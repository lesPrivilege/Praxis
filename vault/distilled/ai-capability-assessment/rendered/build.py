#!/usr/bin/env python3
"""Render answer.html and evidence-index.html.

answer-draft.md carries the prose and its structure: h2 pages and h3 sections with {#id} anchors, and
`::: figure <exhibit> <primary|supporting>` lines placing each exhibit. page-composition.json records
the reasoning relations and where each required claim is answered. The build fails on any unsupported
block, unknown exhibit, unplaced or duplicated exhibit, or composition reference the draft cannot satisfy.
"""
import hashlib
import html
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
from exhibits import EXHIBITS, IDENTITY, q4_script_data

HERE = Path(__file__).resolve().parent
SRC = HERE.parent
DRAFT = SRC / 'answer-draft.md'
COMPOSITION = SRC / 'page-composition.json'
OUTLINE = SRC / 'five-page-outline.md'
EVIDENCE = SRC / 'evidence-index.md'
CROSS = SRC / 'cross-check.md'
PUBLIC_SOURCES = SRC / 'public-source-index.md'


def esc(text):
    return html.escape(text, quote=True)


def sha256_file(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


# ---------- markdown reading (links, code, bold; headings, paragraphs, tables, figures) ----------

def inline(text, link_prefix=''):
    out, cursor = [], 0
    for match in re.finditer(r'\[((?:[^\[\]]|\[[^\]]*\])+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*', text):
        out.append(esc(text[cursor:match.start()]))
        label, target, code, bold = match.groups()
        if label is not None:
            href = target if re.match(r'^[a-z]+:|^#', target) else link_prefix + target
            out.append(f'<a href="{esc(href)}">{inline(label)}</a>')
        elif code is not None:
            out.append(f'<code>{esc(code)}</code>')
        else:
            out.append(f'<strong>{inline(bold)}</strong>')
        cursor = match.end()
    out.append(esc(text[cursor:]))
    return ''.join(out)


def blocks(markdown):
    """Split markdown into ('h1'|'h2'|'h3'|'p'|'table'|'figure', payload) blocks."""
    result, para, table = [], [], []

    def flush():
        if para:
            result.append(('p', ' '.join(para)))
            para.clear()
        if table:
            rows = [[c.strip() for c in row.strip().strip('|').split('|')] for row in table]
            result.append(('table', [rows[0]] + [r for r in rows[1:] if not set(''.join(r)) <= set('-: ')]))
            table.clear()

    for line in markdown.splitlines():
        heading = re.match(r'^(#{1,3}) (.+)$', line)
        if line.startswith('|'):
            if para:
                flush()
            table.append(line)
        elif not line.strip():
            flush()
        elif heading:
            flush()
            result.append((f'h{len(heading.group(1))}', heading.group(2).strip()))
        elif line.startswith('::: answer '):
            flush()
            result.append(('answer', line[len('::: answer '):].strip()))
        elif line.startswith('::: '):
            flush()
            result.append(('figure', line[4:].split()))
        else:
            if table:
                flush()
            para.append(line.strip())
    flush()
    return result


def render_table(rows, link_prefix=''):
    head = ''.join(f'<th scope="col">{inline(c, link_prefix)}</th>' for c in rows[0])
    body = ''.join('<tr>' + ''.join(f'<td data-label="{esc(rows[0][i])}">{inline(c, link_prefix)}</td>'
                                    for i, c in enumerate(r)) + '</tr>' for r in rows[1:])
    return f'<table class="stack"><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>'


# ---------- content projection ----------

ROLES = ('primary', 'supporting')


def split_id(heading):
    match = re.match(r'^(.*?)\s*\{#([a-z0-9-]+)\}$', heading)
    if not match:
        raise SystemExit(f'Heading without {{#id}}: {heading}')
    return match.group(1), match.group(2)


def parse_draft():
    """The draft carries both prose and structure: h2 pages, h3 sections, figure placements."""
    title, pages = None, []
    for kind, payload in blocks(DRAFT.read_text()):
        if kind == 'h1':
            title = payload
        elif kind == 'h2':
            text, pid = split_id(payload)
            pages.append({'id': pid, 'heading': re.sub(r'^[一二三四五六七八九十]+、', '', text), 'opening': [], 'sections': []})
        elif kind == 'h3':
            text, sid = split_id(payload)
            pages[-1]['sections'].append({'id': sid, 'heading': text, 'items': []})
        elif kind in ('p', 'answer', 'table'):
            target = pages[-1]['sections'][-1]['items'] if pages[-1]['sections'] else pages[-1]['opening']
            target.append((kind, payload))
        elif kind == 'figure':
            if payload[0] != 'figure' or len(payload) != 3 or payload[1] not in EXHIBITS or payload[2] not in ROLES:
                raise SystemExit(f'Unsupported figure directive: ::: {" ".join(payload)}')
            if not pages[-1]['sections']:
                raise SystemExit(f'Figure {payload[1]} placed outside a section')
            pages[-1]['sections'][-1]['items'].append(('figure', payload[1], payload[2]))
        else:
            raise SystemExit(f'Unsupported {kind} block in answer draft')
    return title, pages


def project():
    """Check the draft against page-composition.json: pages, primary exhibits and claim locations."""
    title, pages = parse_draft()
    composition = json.loads(COMPOSITION.read_text())
    if composition['source_sha256'] != sha256_file(DRAFT):
        raise SystemExit('answer-draft.md changed since page-composition.json was updated')
    specs = {p['id']: p for p in composition['pages']}
    if [p['id'] for p in pages] != [p['id'] for p in composition['pages']]:
        raise SystemExit('Page ids differ between draft and composition')
    used = []
    for page in pages:
        spec = specs[page['id']]
        figures = [(item[1], item[2]) for s in page['sections'] for item in s['items'] if item[0] == 'figure']
        primary = [f for f, role in figures if role == 'primary']
        if primary != [spec['primary_exhibit']]:
            raise SystemExit(f"{page['id']}: primary exhibit {primary} differs from composition {spec['primary_exhibit']}")
        locations = {'opening'} | {s['id'] for s in page['sections']}
        for claim in spec['claims']:
            if claim['location'] not in locations:
                raise SystemExit(f"{page['id']}: claim {claim['id']} points to missing location {claim['location']}")
        tree = spec['argument_tree']
        if not page['heading'].endswith('？') or not page['opening'] or page['opening'][0][0] != 'answer':
            raise SystemExit(f"{page['id']}: page question and immediate answer required")
        if sum(item[0] == 'answer' for item in page['opening']) != 1:
            raise SystemExit(f"{page['id']}: exactly one core answer required")
        if tree['question'] != page['heading'] or tree['answer'] != page['opening'][0][1]:
            raise SystemExit(f"{page['id']}: page question/answer differs from argument tree")
        if [n['id'] for n in tree['nodes']] != [s['id'] for s in page['sections']]:
            raise SystemExit(f"{page['id']}: argument tree section order differs from draft")
        for section, node in zip(page['sections'], tree['nodes']):
            items = section['items']
            if not section['heading'].endswith('？') or items[0][0] != 'answer':
                raise SystemExit(f"{section['id']}: question and immediate answer required")
            if sum(item[0] == 'answer' for item in items) != 1:
                raise SystemExit(f"{section['id']}: exactly one immediate answer required")
            if node['question'] != section['heading'] or node['answer'] != items[0][1]:
                raise SystemExit(f"{section['id']}: question/answer differs from argument tree")
            if set(node['exhibits']) != {item[1] for item in items if item[0] == 'figure'}:
                raise SystemExit(f"{section['id']}: exhibit ownership differs from argument tree")
            if not node['reason'] or not node['decision'] or not node['evidence']:
                raise SystemExit(f"{section['id']}: incomplete reasoning relation")
        used += [f for f, _ in figures]
        page['spec'] = spec
    if sorted(used) != sorted(EXHIBITS):
        raise SystemExit(f'Each exhibit must be placed exactly once: {sorted(set(EXHIBITS) ^ set(used))}')
    return title, pages


def chapter_sources():
    """External sources per chapter, from public-source-index.md: {page number: rows}, plus the scope note."""
    chapters, note, current = {}, '', None
    for kind, payload in blocks(PUBLIC_SOURCES.read_text()):
        if kind == 'h2':
            current = int(re.match(r'Q(\d)', payload).group(1))
        elif kind == 'p' and current is None:
            note = payload
        elif kind == 'table' and current:
            chapters[current] = payload[1:]
    return chapters, note


def render_sources(number, page, rows, note):
    items = ''.join(f'<li><span class="src-title">{inline(title)}</span>'
                    f'<span class="src-meta">{esc(publisher)} · {esc(kind)}</span>'
                    f'<span class="src-point">{esc(point)}</span></li>' for title, publisher, kind, point in rows)
    tail = f'<p class="src-note">{inline(note)}</p>' if note else ''
    return (f'<section class="q-sources" id="{page["id"]}-sources" aria-labelledby="{page["id"]}-sources-h">'
            f'<h3 id="{page["id"]}-sources-h">来源</h3><ol>{items}</ol>{tail}</section>')


def render_page(index, page):
    number = index + 1
    opening = ''.join(
        f'<p class="core-answer" id="{page["id"]}-answer">{inline(text)}</p>' if kind == 'answer'
        else render_table(text) if kind == 'table' else f'<p>{inline(text)}</p>' for kind, text in page['opening'])
    answer_map = ''.join(
        f'<li><a href="#{s["id"]}"><span class="map-no">{number}.{i + 1}</span>'
        f'<span>{esc(s["heading"])}</span></a></li>' for i, s in enumerate(page['sections']))
    parts = [f'<section class="q-page" id="{page["id"]}" aria-labelledby="{page["id"]}-h">',
             f'<header class="q-head"><h2 id="{page["id"]}-h"><span class="q-num">Q{number}</span>'
             f'<span class="q-title">{esc(page["heading"])}</span></h2></header>',
             f'<div class="opening">{opening}</div>',
             f'<nav class="answer-map" aria-label="Q{number}的问题结构"><ol>{answer_map}</ol></nav>']
    figure_no = 0
    for i, section in enumerate(page['sections']):
        body = []
        for item in section['items']:
            if item[0] == 'p':
                body.append(f'<p>{inline(item[1])}</p>')
            elif item[0] == 'answer':
                body.append(f'<p class="section-answer" id="{section["id"]}-answer">{inline(item[1])}</p>')
            elif item[0] == 'table':
                body.append(render_table(item[1]))
            elif item[0] == 'figure':
                figure_no += 1
                body.append(EXHIBITS[item[1]]().replace(
                    '<figure class="exhibit">', f'<figure class="exhibit {item[2]}" id="fig-{item[1]}" aria-describedby="{section["id"]}-answer">', 1).replace(
                    '<figcaption>', f'<figcaption><span class="fig-no">图 {number}.{figure_no}</span>', 1))
        parts.append(f'<section class="argument" id="{section["id"]}" aria-labelledby="{section["id"]}-h">'
                     f'<h3 id="{section["id"]}-h"><span class="sec-no">{number}.{i + 1}</span>{esc(section["heading"])}</h3>'
                     + ''.join(body) + '</section>')
    return parts


def outline_cards():
    """Card titles and sentences come verbatim from the finalised five-page outline."""
    table = next(p for kind, p in blocks(OUTLINE.read_text()) if kind == 'table' and p[0][0] == '页面')
    return [(row[0].lower(), row[1], row[2]) for row in table[1:]]


def page_shell(title, body, script=''):
    css = (HERE / 'style.css').read_text()
    script_tag = f'<script>{script}</script>' if script else ''
    return f'''<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<style>{css}</style>
</head>
<body>
{body}
{script_tag}
</body>
</html>
'''


def build_answer():
    title, pages = project()
    cards = outline_cards()
    ids = [p['id'] for p in pages]
    if [c[0] for c in cards] != ids or [c[1] for c in cards] != [p['spec']['navigation_title'] for p in pages]:
        raise SystemExit('Outline cards do not match the pages and navigation titles in page-composition.json')
    sources, note = chapter_sources()
    if sorted(sources) != list(range(1, len(pages) + 1)):
        raise SystemExit('public-source-index.md needs one source table per page')
    parts = []
    for i, page in enumerate(pages):
        parts += render_page(i, page)
        parts.append(render_sources(i + 1, page, sources[i + 1], note if i == len(pages) - 1 else ''))
        parts.append('</section>')
    chapter_tabs = ''.join(
        f'<li><a class="chapter-tab" href="#{q}"><span class="chapter-tab-no">{i + 1:02}</span>'
        f'<span class="chapter-tab-title">{esc(t)}</span></a></li>'
        for i, (q, t, _) in enumerate(cards))
    chapter_links = ''.join(
        f'<li><a class="chapter-link" href="#{q}"><span class="chapter-tab-no">{i + 1:02}</span>'
        f'<span class="chapter-tab-title">{esc(t)}</span></a></li>'
        for i, (q, t, _) in enumerate(cards))
    card_html = ''.join(f'<li><a class="card" href="#{q}"><span class="card-no">{i + 1:02} / {len(cards):02}</span>'
                        f'<span class="card-title">{esc(t)}</span><span class="card-text">{esc(s)}</span></a></li>'
                        for i, (q, t, s) in enumerate(cards))
    body = f'''<header class="publication-header frame">
<div class="publication-masthead">
<h1><a href="#" class="home">{esc(title)}</a></h1>
<div class="publication-actions"><button type="button" id="chapter-overview" aria-haspopup="dialog" aria-controls="outline-dialog" aria-expanded="false">纲要总览</button></div>
</div>
<nav class="chapter-tabs" aria-label="章节"><ol>{chapter_tabs}</ol></nav>
<details class="chapter-menu"><summary><span class="chapter-menu-label">章节</span><span class="chapter-menu-current">共{len(cards)}题</span></summary>
<nav aria-label="章节"><ol>{chapter_links}</ol></nav></details>
</header>
<main class="frame" id="answer-pages">
{''.join(parts)}
</main>
<nav class="chapter-controls" aria-label="章节翻页"><span id="chapter-progress" aria-hidden="true"></span>
<button type="button" id="chapter-prev" disabled><span aria-hidden="true">←</span> <span class="pager-label">上一题</span></button>
<output id="chapter-count" aria-label="当前题目" aria-live="polite">01 / {len(cards):02}</output><span id="chapter-section" aria-hidden="true"></span>
<button type="button" id="chapter-next"><span class="pager-label">下一题</span> <span aria-hidden="true">→</span></button>
</nav>
<dialog class="outline-dialog" id="outline-dialog" aria-labelledby="outline-title">
<header class="overview-heading"><h2 id="outline-title">纲要</h2><button type="button" id="outline-close">返回当前题</button></header>
<nav class="cards" aria-label="五题纲要"><ol>{card_html}</ol></nav>
</dialog>'''
    levels, presets = q4_script_data()
    script = ((HERE / 'q4.js').read_text().replace('__LEVELS__', levels).replace('__PRESETS__', presets)
              + (HERE / 'nav.js').read_text().replace('__IDS__', json.dumps(ids)))
    return page_shell(title, body, script)


def section_blocks(markdown, link_prefix):
    out = []
    for kind, payload in blocks(markdown):
        if kind == 'h2':
            out.append(f'<h3>{esc(payload)}</h3>')
        elif kind == 'p':
            out.append(f'<p>{inline(payload, link_prefix)}</p>')
        elif kind == 'table':
            out.append(render_table(payload, link_prefix))
    return ''.join(out)


def build_index():
    index_title = project()[0] + '：证据与状态索引'
    link_prefix = '../'
    inputs = [('answer-draft.md', DRAFT), ('page-composition.json', COMPOSITION), ('five-page-outline.md', OUTLINE),
              ('evidence-index.md', EVIDENCE), ('cross-check.md', CROSS)] + [
             (f'rendered/{name}', HERE / name) for name in ('build.py', 'exhibits.py', 'q4.js', 'nav.js', 'style.css')]
    hash_rows = [['输入', 'SHA-256']] + [[f'`{name}`', f'`{sha256_file(path)}`'] for name, path in inputs]
    cross = blocks(CROSS.read_text())
    cross_table = next(p for kind, p in cross if kind == 'table')
    calc = next(p for kind, p in cross if kind == 'p' and p.startswith('可确定复核的两个演算'))
    body = f'''<header class="topbar">
<div class="frame topbar-inner">
<h1>{esc(index_title)}</h1>
<a class="index-link" href="answer.html">返回答卷</a>
</div>
</header>
<main class="frame index">
<section id="version"><h2>内容版本</h2>
<p>答卷正文与本索引由同一生成脚本从下列输入生成；正文、小节与图的位置取自回答母稿，构图映射记录论证关系与要点位置。</p>
{render_table(hash_rows)}</section>
<section id="exhibits"><h2>展项数据与身份</h2>{render_table(IDENTITY)}</section>
<section id="evidence"><h2>证据、状态与覆盖</h2>{section_blocks(EVIDENCE.read_text(), link_prefix)}</section>
<section id="cross-check"><h2>交叉核验与裁决</h2>{render_table(cross_table, link_prefix)}<p>{inline(calc, link_prefix)}</p></section>
</main>'''
    return page_shell(index_title, body)


if __name__ == '__main__':
    (HERE / 'answer.html').write_text(build_answer())
    (HERE / 'evidence-index.html').write_text(build_index())
    print('wrote answer.html, evidence-index.html')
