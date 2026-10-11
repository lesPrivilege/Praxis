"""Check the delivered reader: visible content, source access, navigation and narrow layout."""
import importlib.util
import json
from pathlib import Path

from playwright.sync_api import sync_playwright

R = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('reading_v2', R / 'script/reading_v2.py')
reader = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reader)
SCENES = reader.load_scenes()
report = {
    'file': 'reading-v2.html',
    'content_source': 'script/reading_v2.py:load_scenes',
    'scope': 'Rendered content and source navigation; no target-system integration checks.',
    'expected': {
        'modules': len(SCENES),
        'paragraphs': sum(len(s['essay'].split('\n\n')) for s in SCENES),
        'depth_paragraphs': sum(len(s['depth_paragraphs']) for s in SCENES),
        'source_locators': sum(len(s['evidence']) for s in SCENES),
        'unique_source_ids': len({e['id'] for s in SCENES for e in s['evidence']}),
    },
    'widths': [],
    'failures': [],
}

VISIBLE_TEXT = '''els => els.filter(e => e.getBoundingClientRect().height > 0 &&
    e.checkVisibility({checkOpacity:true, checkVisibilityCSS:true})).map(e => e.textContent)'''


def check(condition, failure, width, javascript, **context):
    if not condition:
        report['failures'].append({'width': width, 'javascript': javascript,
                                   'failure': failure, **context})


with sync_playwright() as pw:
    browser = pw.chromium.launch()
    for width, javascript in [(1440, True), (390, True), (390, False)]:
        page = browser.new_page(viewport={'width': width, 'height': 900},
                                java_script_enabled=javascript)
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        try:
            page.goto((R / 'reading-v2.html').as_uri())
            module_ids = page.locator('article.module').evaluate_all('(els) => els.map(e => e.id)')
            check(module_ids == [s['id'] for s in SCENES], 'module_coverage_or_order', width, javascript)
            for scene in SCENES:
                module = page.locator('#' + scene['id'])
                visible = module.locator('p').evaluate_all(VISIBLE_TEXT)
                for paragraph in scene['essay'].split('\n\n'):
                    check(paragraph in visible, 'mechanism_or_condition_hidden', width, javascript,
                          scene=scene['id'], paragraph=paragraph)
                for selector, expected in [('h3', scene['title']),
                                           (':scope > p.lead', scene['lead']),
                                           (':scope > p.condition', scene['pm'])]:
                    actual = module.locator(selector).inner_text()
                    check(actual == expected, 'updated_text_missing', width, javascript,
                          scene=scene['id'], field=selector, actual=actual)
                actual_items = module.locator('li').evaluate_all('''els => els.map(e => ({
                    label:e.querySelector('.name').textContent,
                    detail:e.querySelector('.work').textContent}))''')
                check(actual_items == [{k: item[k] for k in ('label', 'detail')}
                                       for item in scene['items']],
                      'mechanism_items_mismatch', width, javascript, scene=scene['id'])
                actual_sources = module.locator('details [data-source-id]').evaluate_all('''els =>
                    els.map(e => ({id:e.dataset.sourceId,
                                  url:e.querySelector('a').getAttribute('href')}))''')
                expected_sources = [{'id': e['id'], 'url': e['url']} for e in scene['evidence']]
                check(actual_sources == expected_sources, 'source_identity_or_url_mismatch',
                      width, javascript, scene=scene['id'])
                # Every source also has an always-visible link; only its expanded
                # identity/version locator is hidden until the reader requests it.
                accessible_sources = module.locator(':scope > p.source a').evaluate_all('''els =>
                    els.filter(e => e.checkVisibility({checkOpacity:true, checkVisibilityCSS:true}))
                    .map(e => e.getAttribute('href'))''')
                check(accessible_sources == [e['url'] for e in scene['evidence']],
                      'source_link_hidden_or_missing', width, javascript, scene=scene['id'])
            if javascript:
                page.locator('#expand-all').click()
            else:
                # Native details remain usable without the expand-all script.
                for summary in page.locator('details.detail summary').all():
                    summary.click()
            check(page.locator('details.detail[open]').count() == len(SCENES),
                  'source_expansion_failed', width, javascript)
            visible_locators = page.locator('details.detail [data-source-id]').evaluate_all(
                '''els => els.filter(e => e.checkVisibility({checkOpacity:true,
                    checkVisibilityCSS:true})).length''')
            check(visible_locators == report['expected']['source_locators'],
                  'expanded_source_locator_hidden', width, javascript)
            if javascript:
                page.locator('#collapse-all').click()
                check(page.locator('details.detail[open]').count() == 0,
                      'source_collapse_failed', width, javascript)
            links = page.locator('nav.questions a')
            check(links.count() == len(reader.QUESTIONS), 'query_route_count', width, javascript)
            question_hrefs = links.evaluate_all('(els) => els.map(e => e.getAttribute("href"))')
            check(question_hrefs == ['#' + sid for _, sid in reader.QUESTIONS],
                  'query_routes_mismatch', width, javascript)
            links.nth(4).click()
            check(page.url.endswith('#java-05-snapshot-sse-cursor'),
                  'query_navigation_failed', width, javascript)
            layout = page.evaluate('''({innerWidth,
                scrollWidth:document.documentElement.scrollWidth,
                modules:document.querySelectorAll('article.module').length,
                answers:document.querySelectorAll('.chapter-head .answer').length})''')
            check(layout['scrollWidth'] <= width, 'horizontal_overflow', width, javascript,
                  scroll_width=layout['scrollWidth'])
            check(layout['answers'] == len(reader.CHAPTERS), 'chapter_answer_count', width, javascript)
            check(not errors, 'page_error', width, javascript, errors=errors)
            report['widths'].append({'width': width, 'javascript': javascript, 'layout': layout,
                                    'visible_paragraphs_checked': report['expected']['paragraphs'],
                                    'visible_depth_paragraphs_checked': report['expected']['depth_paragraphs'],
                                    'visible_source_locators_checked': visible_locators,
                                    'page_errors': errors})
            if (width == 1440 and javascript) or (width == 390 and not javascript):
                page.goto((R / 'reading-v2.html').as_uri())
                name = 'reader-v2-wide.png' if width == 1440 else 'reader-v2-narrow.png'
                page.screenshot(path=str(R / 'quality' / name), full_page=False)
        except Exception as error:
            check(False, 'reader_check_error', width, javascript, error=str(error))
        finally:
            page.close()
    browser.close()
report['pass'] = not report['failures']
(R / 'quality/reader-v2-check.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report, ensure_ascii=False))
raise SystemExit(0 if report['pass'] else 1)
