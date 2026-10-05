#!/usr/bin/env python3
"""Real loopback API + synthetic probe runner UI checks; no external probes."""
import argparse
import copy
import datetime as dt
import json
import tempfile
import threading
import time
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import expect, sync_playwright
import backend


class FixtureRunner:
    def __init__(self):
        self.generation = 0

    def __call__(self, id_, timeout=8):
        if id_ == 'local.os':
            self.generation += 1
        time.sleep(0.04)
        if id_ == 'local.dns':
            return backend.result('unsupported', error='os_not_supported')
        if id_ == 'tls.cloudflare':
            return backend.result('unknown', error='timeout')
        if id_ == 'egress.geojs':
            return backend.result('unknown', value={'ip':'198.51.100.20','asn':None,'country':None}, error='partial_result')
        if id_ == 'egress.ipify':
            return backend.result(value={'ip':f'192.0.2.{self.generation}'})
        if id_ == 'local.os':
            return backend.result(value={'family':'Synthetic OS','version':str(self.generation),'architecture':'fixture'},
                                  note='<img src=x onerror=alert(1)> · escaped fixture note')
        values = {
            'local.timezone': {'names':['Fixture/Zone'], 'utc_offset_seconds':28800},
            'local.locale': {'language':'zh_CN', 'encoding':'UTF-8'},
            'local.proxy': {'configured':False},
            'dns.example': {'target':'example.com', 'addresses':['192.0.2.10']},
            'dns.cloudflare': {'target':'www.cloudflare.com', 'addresses':['192.0.2.11']},
            'tls.example': {'target':'example.com', 'tls_version':'TLSv1.3', 'cipher':'Fixture cipher', 'transport_peer':'192.0.2.10', 'http_status':200},
        }
        return backend.result(value=values[id_])


def nav(page, view):
    page.locator(f'.nav-item[data-view="{view}"]').click()


def collect(page):
    page.locator('#scan-button').click()
    expect(page.locator('#collection-bar')).to_be_visible()
    expect(page.locator('#scan-button')).to_be_disabled()
    expect(page.locator('#scan-button')).to_be_enabled(timeout=10000)
    expect(page.locator('#scan-button')).to_have_text('重新采集')
    expect(page.locator('.signal-table tbody tr')).to_have_count(len(backend.PROBES))


def check(page, server, runner, output, name):
    page.goto(server.origin, wait_until='networkidle')
    expect(page.locator('#scan-button')).to_be_enabled()
    expect(page.locator('#mode-badge')).to_have_text('尚未采集')
    expect(page.locator('#view-content')).to_contain_text('从一次观测开始')
    assert runner.generation == 0, 'Opening a page must not start public probes'
    expect(page.locator('#change-count')).to_have_text('—')
    collect(page)
    first = server.collector.scans[-1]['id']
    expect(page.locator('.summary-strip')).to_contain_text('9 / 12 项已观测')
    expect(page.locator('.signal-table th')).to_have_text(['观测项','当前读数','观测状态','采集时间'])
    disclosure_check(page)
    assert page.locator('.signal-table tbody tr').first.bounding_box()['y'] < page.viewport_size['height'], 'First reading must enter the initial viewport'
    page.screenshot(path=str(output / f'{name}-top.png'))
    # The whole row selects its observation, not only the name button.
    page.locator('.signal-table tbody tr').nth(3).locator('.col-status').click()
    expect(page.locator('button[data-item="local.proxy"]')).to_have_attribute('aria-pressed','true')
    expect(page.locator('#inspector .inspector-title')).to_have_text('服务端代理配置')
    page.locator('.signal-table tbody tr').first.locator('.col-status').click()
    expect(page.locator('#inspector')).to_contain_text('<img src=x onerror=alert(1)>')
    expect(page.locator('#inspector img')).to_have_count(0)
    expect(page.locator('#change-count')).to_have_text('—')
    nav(page, 'baseline')
    page.locator('[data-action="pin"]').click()
    expect(page.locator('[data-action="pin"]')).to_have_text('当前记录已是基线')
    assert server.collector.get_baseline()['baseline_id'] == first
    collect(page)
    second = server.collector.scans[-1]['id']
    expect(page.locator('#change-count')).to_have_text('2')
    assert server.collector.get_baseline()['baseline_id'] == first
    page.locator('.filter-button[data-view="changes"]').click()
    expect(page.locator('.signal-name')).to_have_text(['操作系统','服务端出口 IP · ipify'])
    current = page.locator('.comparison-table tbody tr').first.locator('.col-value').bounding_box()
    reference = page.locator('.comparison-table tbody tr').first.locator('.col-baseline').bounding_box()
    if name == 'mobile':
        assert current['x'] == reference['x'] and 0 <= reference['y'] - current['y'] - current['height'] <= 8, 'Narrow comparison stacks current and baseline in aligned, adjacent slots'
    else:
        assert current['y'] == reference['y'] and reference['x'] >= current['x'] + current['width'], 'Wide comparison keeps current and baseline in adjacent columns'
    page.mouse.move(0,0)
    page.screenshot(path=str(output / f'{name}-changes.png'))
    nav(page, 'observations')
    page.locator('[data-filter="missing"]').click()
    expect(page.locator('.signal-table tbody tr')).to_have_count(3)
    page.locator('button[data-item="egress.geojs"]').click()
    expect(page.locator('#inspector .detail-value').first).to_have_text('已隐藏')
    page.locator('#inspector [data-action="privacy"]').click()
    expect(page.locator('#inspector .detail-value').first).to_contain_text('部分结果 · 未知')
    expect(page.locator('#inspector .detail-value').first).to_contain_text('198.51.100.20')
    page.locator('#privacy-toggle').click()
    expect(page.locator('#inspector .detail-value').first).to_have_text('已隐藏')
    if name == 'mobile':
        page.locator('button[data-item="egress.geojs"]').click()
        expect(page.locator('.inspector-title')).to_be_focused()
        page.locator('[data-action="back-to-list"]').click()
        expect(page.locator('button[data-item="egress.geojs"]')).to_be_focused()
    page.locator('#inspector summary').click()
    page.locator('#inspector .source-link').click()
    expect(page.locator('.source-card')).to_have_count(len(backend.SOURCES))
    expect(page.locator('#main')).to_be_focused()
    expect(page.locator('#inspector')).to_be_hidden()
    nav(page, 'history')
    expect(page.locator('.history-item')).to_have_count(2)
    page.locator(f'[data-history="{first}"]').click()
    expect(page.locator('#change-count')).to_have_text('0')
    assert server.collector.get_baseline()['baseline_id'] == first
    # Viewing history while another scan runs must remain on the selected record.
    collect(page)
    page.locator('#scan-button').click()
    expect(page.locator('#collection-bar')).to_be_visible()
    nav(page, 'history')
    page.locator(f'[data-history="{first}"]').click()
    expect(page.locator('#view-content .panel-subheading')).to_contain_text('本地时间')
    expect(page.locator('#collection-bar')).to_be_hidden(timeout=10000)
    expect(page.locator('#change-count')).to_have_text('0')
    assert server.collector.get_baseline()['baseline_id'] == first
    # Missing records must surface an error, not silently select a different scan.
    nav(page, 'history')
    saved = server.collector.scans
    server.collector.scans = [s for s in saved if s['id'] != second]
    page.locator(f'[data-history="{second}"]').click()
    expect(page.locator('#operation-error')).to_contain_text('扫描记录不存在')
    server.collector.scans = saved
    # A service restart changes the token; UI must require reconnection.
    nav(page, 'observations')
    server.collector.csrf = 'new-session-token'
    page.locator('#scan-button').click()
    expect(page.locator('#operation-error')).to_contain_text('页面会话已失效')
    expect(page.locator('#scan-button')).to_have_text('重新连接')
    page.locator('#scan-button').click()
    expect(page.locator('#scan-button')).to_have_text('重新采集')
    expect(page.locator('#operation-error')).to_be_hidden()
    assert runner.generation == 4, 'Reconnect must not start another scan'
    page.locator('#mode-select').select_option('demo')
    nav(page, 'observations')
    expect(page.locator('#mode-badge')).to_have_text('演示数据')
    expect(page.locator('#change-count')).to_have_text('2')
    page.locator('#sample-select').select_option('C')
    nav(page, 'changes')
    expect(page.locator('#view-content')).to_contain_text('没有可确认的变化')
    expect(page.locator('#inspector')).to_contain_text('当前没有选中项')
    assert runner.generation == 4, 'Demo mode must not start probes'
    page.locator('#mode-select').select_option('real')
    nav(page, 'observations')
    page.locator('[data-filter="all"]').click()
    expect(page.locator('#privacy-toggle')).to_have_attribute('aria-pressed','false')
    expect(page.locator('#privacy-toggle')).to_have_text('显示本页详细值')
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), name
    if name == 'mobile':
        work, detail = page.locator('.main-column').bounding_box(), page.locator('#inspector').bounding_box()
        assert detail['y'] >= work['y'] + work['height'], 'Narrow layout must stack the inspector'
    page.locator('#main').focus()
    page.evaluate('window.scrollTo(0,0)')
    page.mouse.move(0,0)
    page.screenshot(path=str(output / f'{name}.png'), full_page=True)


def reconnect(page, server):
    server.collector.csrf = f'fixture-token-{time.monotonic_ns()}'
    page.locator('#scan-button').click()
    expect(page.locator('#scan-button')).to_have_text('重新连接')
    page.locator('#scan-button').click()
    expect(page.locator('#scan-button')).to_be_enabled()
    expect(page.locator('#collector-state')).to_have_text('本地采集器已连接')
    expect(page.locator('#operation-error')).to_be_hidden()


def disclosure_check(page):
    summary = page.locator('#collection-disclosure summary')
    summary.focus()
    page.keyboard.press('Enter')
    expect(page.locator('#collection-disclosure')).to_contain_text('ipify、GeoJS')
    expect(page.locator('#collection-disclosure')).to_contain_text('example.com、www.cloudflare.com')
    expect(page.locator('#collection-disclosure')).to_contain_text('HTTPS HEAD')
    expect(page.locator('#collection-disclosure')).to_contain_text('HTTPS 目标可见本次请求的出口 IP')
    expect(page.locator('#collection-disclosure')).to_contain_text('仅提交到本机服务端')
    page.keyboard.press('Enter')
    expect(page.locator('#collection-disclosure p').first).to_be_hidden()


def pruned_history_response_check(page, server, runner):
    saved = copy.deepcopy(server.collector.scans)
    baseline = copy.deepcopy(server.collector.baseline)
    template = copy.deepcopy(saved[-1])
    start = dt.datetime(2026, 1, 1, tzinfo=dt.timezone.utc)
    seeded = []
    for i in range(backend.HISTORY_LIMIT):
        scan = copy.deepcopy(template)
        scan['id'] = f'pruning-history-{i}'
        scan['started_at'] = scan['finished_at'] = (start + dt.timedelta(minutes=i)).isoformat()
        seeded.append(scan)
    server.collector.scans = seeded
    page.reload(wait_until='networkidle')
    expect(page.locator('#scan-button')).to_be_enabled()
    entered, release = threading.Event(), threading.Event()
    real_get = server.collector.get_scan
    previous = seeded[0]['id']
    def delayed_snapshot(id_):
        snapshot = real_get(id_)
        if id_ == previous:
            entered.set()
            release.wait(12)
        return snapshot
    server.collector.get_scan = delayed_snapshot
    try:
        page.locator('#scan-button').click()
        expect(page.locator('#collection-bar')).to_be_visible()
        nav(page, 'history')
        page.locator(f'[data-history="{previous}"]').click()
        deadline = time.monotonic() + 10
        while not entered.is_set() and time.monotonic() < deadline:
            page.wait_for_timeout(25)
        assert entered.is_set()
        page.wait_for_function('() => !state.history.some(scan => scan.id === "pruning-history-0")')
        with page.expect_response(lambda response: response.url.endswith(f'/api/scans/{previous}')) as response:
            release.set()
        response.value.json()
        expect(page.locator('#operation-error')).to_contain_text('这份记录已不在可用记录中')
        expect(page.locator('#collector-state')).to_have_text('本地采集器已连接')
        nav(page, 'observations')
        expect(page.locator('button[data-item="local.os"]')).to_be_visible()
        assert page.evaluate('state.currentId !== "pruning-history-0" && !state.scans.has("pruning-history-0")')
    finally:
        release.set()
        server.collector.get_scan = real_get
        server.collector.scans = saved
        server.collector.baseline = baseline
        server.collector.store.save(saved, baseline)
        page.reload(wait_until='networkidle')
        expect(page.locator('#scan-button')).to_be_enabled()


def old_snapshot_copy_check(page, server):
    scan = server.collector.scans[-1]
    notes = {
        'local.proxy': '仅后端可读取的代理配置存在性；false 不证明 VPN/PAC 未启用或浏览器没有代理。不导出代理地址、凭据或其他环境变量。',
        'local.dns': '仅系统配置地址，不能证明一次实际查询的 resolver 或公网出口。',
        'browser.context': '当前浏览器自报；online 不证明外网可达。',
        'egress.ipify': 'ipify 只报告 IP；ASN 与国家不在该来源覆盖内。后端请求出口不代表浏览器或其他应用。',
        'egress.geojs': '部分字段未知，不能作为完整对照。提供方独立结果；空字段保持未知。后端请求出口不代表浏览器或其他应用。',
        'dns.example': '系统解析目标地址；不表明所用 resolver 或 DNS resolver 的公网出口。',
        'tls.example': '已校验证书的后端 HTTPS 请求；传输对端可能是系统/环境代理，不代表浏览器或其他应用。',
    }
    for item in scan['observations']:
        if item['id'] in notes:
            item['note'] = notes[item['id']]
            item['label'] = '旧字段名称'
        if item['id'] == 'egress.geojs':
            item['comparison_key'] = 'egress.geojs:v1'
        if item['id'] == 'local.os':
            item['note'] = 'HTTP 418 · 保留原始备注 <img src=x onerror=alert(1)>'
    server.collector.store.save(server.collector.scans, server.collector.baseline)
    stored = server.collector.store.path.read_bytes()
    page.reload(wait_until='networkidle')
    expect(page.locator('#scan-button')).to_be_enabled()
    expect(page.locator('.signal-name')).to_contain_text(['操作系统','本机时区','本机语言','服务端代理配置','系统 DNS 配置','浏览器自报','服务端出口 IP · ipify','服务端出口 IP · GeoJS','目标 DNS 解析 · example.com','目标 DNS 解析 · www.cloudflare.com','TLS · example.com','TLS · www.cloudflare.com'])
    for id_ in notes:
        page.locator(f'button[data-item="{id_}"]').click()
        page.locator('#inspector summary').click()
        expect(page.locator('#inspector')).not_to_contain_text(notes[id_])
        expect(page.locator('#inspector .source-link')).to_be_visible()
        if id_ == 'egress.geojs':
            expect(page.locator('#inspector')).to_contain_text('部分字段未知')
            expect(page.locator('#inspector')).to_contain_text('egress.geojs:v1')
            expect(page.locator('#inspector')).to_contain_text('未知')
            expect(page.locator('#inspector')).to_contain_text('partial_result')
    page.locator('button[data-item="local.os"]').click()
    page.locator('#inspector summary').click()
    expect(page.locator('#inspector')).to_contain_text('HTTP 418 · 保留原始备注 <img src=x onerror=alert(1)>')
    expect(page.locator('#inspector img')).to_have_count(0)
    assert server.collector.store.path.read_bytes() == stored, 'Reading old snapshots must not rewrite their persisted evidence'
    nav(page, 'sources')
    expect(page.locator('#view-content')).not_to_contain_text('其他应用')
    expect(page.locator('#view-content')).not_to_contain_text('egress.ipify')
    nav(page, 'observations')
    assert all(item['note'] == notes[item['id']] for item in scan['observations'] if item['id'] in notes)


def delayed_restore_check(page, server):
    previous = server.collector.baseline['id']
    chosen = server.collector.scans[1]['id']
    page.locator('#scan-button').click()
    expect(page.locator('#collection-bar')).to_be_visible()
    nav(page, 'history')
    page.locator(f'[data-history="{previous}"]').click()
    expect(page.locator('#inspector .detail-value').first).to_contain_text('Synthetic OS · 1 · fixture')
    entered, release = threading.Event(), threading.Event()
    real_get = server.collector.get_scan
    def delayed_get(id_):
        if id_ == previous:
            entered.set()
            release.wait(10)
        return real_get(id_)
    server.collector.get_scan = delayed_get
    try:
        # Pump Playwright routing callbacks while awaiting the real server request.
        # Blocking on threading.Event would prevent loopback routes from continuing.
        deadline = time.monotonic() + 10
        while not entered.is_set() and time.monotonic() < deadline:
            page.wait_for_timeout(25)
        assert entered.is_set(), 'Completion must revalidate the selected record'
        nav(page, 'history')
        page.locator(f'[data-history="{chosen}"]').click()
        expect(page.locator('#inspector .detail-value').first).to_contain_text('Synthetic OS · 2 · fixture')
        with page.expect_response(lambda response: response.url.endswith(f'/api/scans/{previous}')) as restored_response:
            release.set()
        restored_response.value.json()
        page.evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
        expect(page.locator('#collection-bar')).to_be_hidden(timeout=10000)
        # Wait for the delayed response to cross a browser event boundary before asserting selection.
        page.wait_for_function('() => state.activeId === null && !state.busy')
        nav(page, 'history')
        expect(page.locator(f'[data-history="{chosen}"]')).to_have_attribute('aria-pressed','true')
        page.locator(f'[data-history="{previous}"]').click()
        expect(page.locator('#inspector .detail-value').first).to_contain_text('Synthetic OS · 1 · fixture')
    finally:
        release.set()
        server.collector.get_scan = real_get


def retention_check(page, server, runner):
    # The current record is an independently retained baseline, outside these 30 records.
    template = copy.deepcopy(server.collector.scans[-1])
    original_baseline = copy.deepcopy(server.collector.baseline)
    start = dt.datetime(2026, 1, 1, tzinfo=dt.timezone.utc)
    seeded = []
    for i in range(backend.HISTORY_LIMIT):
        scan = copy.deepcopy(template)
        scan['id'] = f'fixture-history-{i}'
        scan['started_at'] = scan['finished_at'] = (start + dt.timedelta(minutes=i)).isoformat()
        scan['observations'][0]['value']['version'] = f'retained-{i}'
        seeded.append(scan)
    server.collector.scans = seeded
    reconnect(page, server)
    page.locator('button[data-item="local.os"]').click()
    expect(page.locator('#inspector .detail-value').first).to_contain_text(original_baseline['observations'][0]['value']['version'])
    nav(page, 'baseline')
    expect(page.locator('[data-action="pin"]')).to_have_text('当前记录已是基线')
    nav(page, 'history')
    expect(page.locator('.history-item')).to_have_count(30)
    page.locator('[data-history="fixture-history-0"]').click()
    page.locator('#scan-button').click()
    expect(page.locator('#collection-bar')).to_be_visible()
    nav(page, 'history')
    page.locator('[data-history="fixture-history-1"]').click()
    expect(page.locator('#collection-bar')).to_be_hidden(timeout=10000)
    expect(page.locator('#inspector .detail-value').first).to_contain_text('retained-1')
    nav(page, 'history')
    expect(page.locator('.history-item')).to_have_count(30)
    expect(page.locator('[data-history="fixture-history-0"]')).to_have_count(0)
    assert not page.evaluate('state.scans.has("fixture-history-0")'), 'Pruned private records must leave the page cache'
    page.locator('[data-history="fixture-history-1"]').click()
    expect(page.locator('#page-title')).to_have_text('观测概览')
    # A session refresh with the currently viewed record trimmed must select a valid record.
    server.collector.scans = [s for s in server.collector.scans if s['id'] != 'fixture-history-1']
    server.collector.scans[-1]['observations'][0]['value']['version'] = 'fallback-latest'
    reconnect(page, server)
    nav(page, 'observations')
    expect(page.locator('#inspector .detail-value').first).to_contain_text('fallback-latest')
    expect(page.locator('#scan-button')).to_have_text('重新采集')
    # A summary can race with removal. A scan 404 is recoverable while bootstrap stays healthy.
    newest = server.collector.scans[-1]['id']
    real_get = server.collector.get_scan
    def missing_current(id_):
        if id_ == newest:
            raise backend.APIError(404, 'scan_not_found', '扫描记录不存在。')
        return real_get(id_)
    server.collector.get_scan = missing_current
    try:
        reconnect(page, server)
        nav(page, 'observations')
        expect(page.locator('#inspector .detail-value').first).to_contain_text('retained-29')
        expect(page.locator('#scan-button')).to_have_text('重新采集')
    finally:
        server.collector.get_scan = real_get
    # No retained history or baseline must recover to the connected empty state.
    server.collector.scans = []
    server.collector.baseline = None
    reconnect(page, server)
    expect(page.locator('#scan-button')).to_have_text('开始采集')
    expect(page.locator('#view-content')).to_contain_text('从一次观测开始')
    assert runner.generation == 7, 'Reconnect never starts a probe'


def accessibility_and_capture(page, output, name):
    nav(page, 'history')
    page.locator('.history-item').first.click()
    expect(page.locator('#page-title')).to_have_text('观测概览')
    nav(page, 'observations')
    page.locator('[data-filter="all"]').click()
    page.locator('button[data-item="local.proxy"]').focus()
    page.keyboard.press('Enter')
    if name == 'mobile':
        expect(page.locator('.inspector-title')).to_be_focused()
    expect(page.locator('#inspector')).to_contain_text('服务端代理配置')
    expect(page.locator('#inspector .detail-value').first).to_have_text('未检出配置')
    page.locator('#inspector').scroll_into_view_if_needed()
    page.screenshot(path=str(output / f'{name}-detail.png'))
    # Method disclosure is reachable by keyboard and must expose its content.
    page.locator('#inspector summary').focus()
    page.keyboard.press('Enter')
    expect(page.locator('#inspector .source-link')).to_be_visible()
    page.keyboard.press('Enter')
    if name == 'mobile':
        page.locator('[data-action="back-to-list"]').focus()
        page.keyboard.press('Enter')
        expect(page.locator('button[data-item="local.proxy"]')).to_be_focused()
        page.screenshot(path=str(output / f'{name}-return.png'))
    page.emulate_media(reduced_motion='reduce')
    assert page.evaluate('matchMedia("(prefers-reduced-motion: reduce)").matches')
    assert page.locator('#privacy-toggle').evaluate('(el) => getComputedStyle(el).transitionDuration') == '0s'
    page.locator('button[data-item="local.os"]').click()
    assert page.locator('.inspector-body').evaluate('(el) => getComputedStyle(el).animationName') == 'none', 'Reduced motion must drop the detail swap'
    page.locator('#privacy-toggle').focus()
    page.keyboard.press('Enter')
    expect(page.locator('#privacy-toggle')).to_have_text('隐藏本页详细值')
    page.keyboard.press('Enter')
    expect(page.locator('#privacy-toggle')).to_have_text('显示本页详细值')
    page.emulate_media(reduced_motion='no-preference')
    labels = {}
    for view in ['observations','baseline','changes','sources','history']:
        nav(page, view)
        labels[view] = page.evaluate("""() => ({title:document.querySelector('#page-title').textContent, collectionDisclosure:document.querySelector('#collection-disclosure').textContent.trim(), sectionHeadings:[...document.querySelectorAll('#view-content h2')].map(el=>el.textContent), headers:[...document.querySelectorAll('#view-content th')].map(el=>el.textContent), observations:[...document.querySelectorAll('.signal-name')].map(el=>el.textContent), statuses:[...document.querySelectorAll('.status')].map(el=>el.textContent), buttons:[...document.querySelectorAll('button')].filter(el=>el.getBoundingClientRect().width).map(el=>el.textContent), detailLabels:[...document.querySelectorAll('#inspector .inspector-label,#inspector .detail-meta>span,#inspector summary')].map(el=>el.textContent)})""")
    (output / f'{name}-structure.json').write_text(json.dumps(labels,ensure_ascii=False,indent=2))
    nav(page, 'observations')
    page.locator('#main').focus()
    page.evaluate('window.scrollTo(0,0)')
    page.screenshot(path=str(output / f'{name}.png'), full_page=True)
    if name == 'desktop':
        # Half-width CSS viewport checks reflow pressure equivalent to 200% zoom.
        # It does not exercise Chromium native page zoom or scaled text rendering.
        page.set_viewport_size({'width':720,'height':500})
        assert page.evaluate('window.innerWidth') == 720
        assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
        page.locator('button[data-item="local.proxy"]').focus()
        page.keyboard.press('Enter')
        expect(page.locator('.inspector-title')).to_be_focused()
        page.locator('[data-action="back-to-list"]').click()
        expect(page.locator('button[data-item="local.proxy"]')).to_be_focused()
        page.screenshot(path=str(output / 'desktop-reflow-720.png'))
        page.set_viewport_size({'width':1440,'height':1000})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--screenshots', type=Path)
    args = parser.parse_args()
    output = args.screenshots or Path(tempfile.mkdtemp(prefix='drift-ui-'))
    output.mkdir(parents=True, exist_ok=True)
    errors, external, requests = [], [], []
    with tempfile.TemporaryDirectory(prefix='drift-ui-state-') as private, sync_playwright() as pw:
        browser = pw.chromium.launch()
        try:
            for name, size in [('desktop',{'width':1440,'height':1000}),('mobile',{'width':390,'height':844})]:
                runner = FixtureRunner()
                server = backend.Server(0, backend.Collector(Path(private) / name, runner=runner))
                thread = threading.Thread(target=server.serve_forever, daemon=True)
                thread.start()
                context = browser.new_context(viewport=size, device_scale_factor=1, locale="en-US", timezone_id="UTC")
                def route_request(route):
                    url = route.request.url
                    requests.append(urlparse(url).path)
                    if urlparse(url).netloc != urlparse(server.origin).netloc:
                        external.append(url)
                        route.abort()
                    else:
                        route.continue_()
                context.route('**/*', route_request)
                page = context.new_page()
                page.on('pageerror',lambda e: errors.append(str(e)))
                # Deliberately tested HTTP 404/403 may be logged by Chromium.
                page.on('console',lambda m: errors.append(m.text) if m.type == 'error' and not ('Failed to load resource' in m.text and ('404' in m.text or '403' in m.text)) else None)
                try:
                    check(page, server, runner, output, name)
                    old_snapshot_copy_check(page, server)
                    pruned_history_response_check(page, server, runner)
                    accessibility_and_capture(page, output, name)
                    delayed_restore_check(page, server)
                    retention_check(page, server, runner)
                finally:
                    context.close()
                    server.shutdown()
                    server.server_close()
                    thread.join()
            assert not external, external
            assert not errors, errors
            assert '/x' not in requests, 'Fixture HTML executed instead of being escaped'
            print(json.dumps({'result':'passed','viewports':['1440x1000','390x844'],'external_requests':len(external),
                              'unexpected_browser_errors':errors,'screenshots':str(output.resolve()),'data':'synthetic','checks':['request disclosure keyboard path','pruned delayed history response keeps valid current without caching expired values','old snapshot terms/exact standard note updates preserve arbitrary evidence and storage','demo uses implemented fields only','30-to-31 authoritative history/cache','pruned current and new session','404 fallback','delayed restore preserves new history choice','independent baseline','connected empty state','keyboard selection/disclosure/privacy/return','whole-row selection','comparison adjacency wide and narrow','reduced motion','720 CSS px reflow pressure (native 200 percent browser zoom untested)']},ensure_ascii=False))
        finally:
            browser.close()


if __name__ == '__main__':
    main()
