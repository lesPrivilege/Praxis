"""Isolated Chromium application test and screenshot render; no user browser profile."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'evidence'
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width':1440,'height':1000})
    errors=[]
    page.on('pageerror',lambda err:errors.append(str(err)))
    page.on('console',lambda msg:errors.append(msg.text) if msg.type=='error' else None)
    page.goto((ROOT/'index.html').as_uri())
    page.screenshot(path=str(OUT/'html-desktop-initial.png'),full_page=True)
    assert page.locator('#prev').is_disabled()
    page.locator('#next').click()
    assert page.evaluate('window.A3_STATE.model.state.term')=='12 个月'
    assert page.evaluate('window.A3_STATE.model.version')==1
    page.locator('[data-step="6"]').click()
    assert '决定入口暂停' in page.locator('#basis').inner_text()
    page.screenshot(path=str(OUT/'html-desktop-stale.png'),full_page=True)
    page.locator('[data-step="8"]').click()
    assert page.evaluate('window.A3_STATE.model.state.term')=='24 个月'
    assert page.evaluate('window.A3_STATE.context.values.term === undefined')
    page.screenshot(path=str(OUT/'html-desktop-final.png'),full_page=True)
    for _ in range(3): page.locator('#replay').click()
    assert page.evaluate('window.A3_STATE.model.log.length')==6
    assert '第 3 次' in page.locator('#feedback').inner_text()
    page.locator('#options input:checked').uncheck()
    page.locator('#project').click()
    assert '空投影已生成' in page.locator('#feedback').inner_text()
    assert page.evaluate('Object.keys(window.A3_STATE.context.values).length')==0
    assert page.evaluate('window.A3_STATE.model.state.payment')=='按月'
    page.locator('#options input[value="term"]').check()
    page.locator('#project').click()
    assert page.evaluate('window.A3_STATE.context.values.term')=='24 个月'
    page.locator('#reset').click()
    assert page.evaluate('window.A3_STATE.index')==0
    page.locator('#timeline').focus()
    page.keyboard.press('ArrowRight')
    assert page.evaluate('window.A3_STATE.index')==1
    page.locator('#next').focus()
    page.keyboard.press('Enter')
    assert page.evaluate('window.A3_STATE.index')==2
    page.locator('#play').click()
    page.wait_for_timeout(5650)
    assert page.evaluate('window.A3_STATE.index')==3
    page.locator('#play').click()
    stopped=page.evaluate('window.A3_STATE.index')
    page.wait_for_timeout(5800)
    assert page.evaluate('window.A3_STATE.index')==stopped
    layout=[]
    for width,height in [(390,844),(375,812),(720,1000)]:
        page.set_viewport_size({'width':width,'height':height})
        page.locator('[data-step="8"]').click()
        dimensions=page.evaluate('({viewport:innerWidth,content:document.documentElement.scrollWidth})')
        assert dimensions['content']<=dimensions['viewport']
        page.screenshot(path=str(OUT/f'html-{width}-final.png'),full_page=True)
        layout.append(dimensions)
    page.emulate_media(reduced_motion='reduce')
    page.locator('#reset').click()
    page.locator('#next').focus()
    page.keyboard.press('Space')
    assert page.evaluate('window.A3_STATE.index')==1
    page.screenshot(path=str(OUT/'html-reduced-motion.png'),full_page=True)
    requests=[]
    page.on('request',lambda r:requests.append(r.url))
    page.reload()
    assert not [url for url in requests if url.startswith('http')]
    assert not errors,errors
    report={'result':'passed','mode':'isolated local Chromium application test; file:// open',
      'browser':browser.version,'viewports':layout,'keyboard':['range ArrowRight','button Enter','button Space'],
      'interaction':['proposal remains pending','stale basis visible','final omitted field retained','three extra replays','empty projection','rebuild','reset','autoplay advances','pause remains stopped','reduced-motion'],
      'console_errors':errors,'network_requests':[url.replace(str(ROOT),'[project]') for url in requests],'native_screen_check':'blocked: cua transport closed; this test is not native screen verification',
      'zoom':'720 CSS px reflow sample; native browser 200% zoom not yet verified'}
    (OUT/'html-checks.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    browser.close()
print('HTML application checks passed; screenshot artifacts generated.')
