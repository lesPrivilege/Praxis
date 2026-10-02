#!/usr/bin/env python3
"""Real loopback API + synthetic probe runner UI checks; no external probes."""
import argparse
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
        return backend.result(value={'fixture':id_})


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
    expect(page.locator('.summary-number').first).to_have_text('9')
    expect(page.locator('#inspector')).to_contain_text('<img src=x onerror=alert(1)>')
    expect(page.locator('#inspector img')).to_have_count(0)
    expect(page.locator('#change-count')).to_have_text('—')
    nav(page, 'baseline')
    page.locator('[data-action="pin"]').click()
    expect(page.locator('[data-action="pin"]')).to_have_text('当前记录就是基线')
    assert server.collector.get_baseline()['baseline_id'] == first
    collect(page)
    second = server.collector.scans[-1]['id']
    expect(page.locator('#change-count')).to_have_text('2')
    assert server.collector.get_baseline()['baseline_id'] == first
    page.locator('[data-filter="changed"]').click()
    expect(page.locator('.signal-name')).to_have_text(['系统','出口 · ipify'])
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
    page.locator('#inspector .source-link').click()
    expect(page.locator('.source-card')).to_have_count(len(backend.SOURCES))
    expect(page.locator('#main')).to_be_focused()
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
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), name
    if name == 'mobile':
        work, detail = page.locator('.main-column').bounding_box(), page.locator('#inspector').bounding_box()
        assert detail['y'] >= work['y'] + work['height'], 'Narrow layout must stack the inspector'
    page.locator('#main').focus()
    page.evaluate('window.scrollTo(0,0)')
    page.mouse.move(0,0)
    page.screenshot(path=str(output / f'{name}.png'), full_page=True)


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
                context = browser.new_context(viewport=size, device_scale_factor=1)
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
                finally:
                    context.close()
                    server.shutdown()
                    server.server_close()
                    thread.join()
            assert not external, external
            assert not errors, errors
            assert '/x' not in requests, 'Fixture HTML executed instead of being escaped'
            print(json.dumps({'result':'passed','viewports':['1440x1000','390x844'],'external_requests':len(external),
                              'unexpected_browser_errors':errors,'screenshots':str(output.resolve()),'data':'synthetic'},ensure_ascii=False))
        finally:
            browser.close()


if __name__ == '__main__':
    main()
