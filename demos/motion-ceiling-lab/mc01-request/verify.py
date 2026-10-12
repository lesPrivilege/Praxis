#!/usr/bin/env python3
"""Checks that need a browser: self-test, the viewer's camera, look-back, text version, narrow
screens, reduced motion, no WebGL, context loss, and the variants. Writes evidence/check.json.

  python3 verify.py

Uses the Playwright Chromium already on this machine; installs nothing.
"""
import json
import subprocess
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
GPU = ['--use-angle=metal']
SAMPLES = [2, 10, 22, 30, 36.6, 45, 49, 56, 61, 68, 74, 80, 85, 93]


def page_for(pw, path, query='', args=GPU, size=(1440, 1000), reduced=False):
    browser = pw.chromium.launch(args=args)
    ctx = browser.new_context(viewport={'width': size[0], 'height': size[1]}, device_scale_factor=1,
                              reduced_motion='reduce' if reduced else 'no-preference')
    page = ctx.new_page()
    logs = []
    page.on('console', lambda m: logs.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: logs.append(str(e)))
    page.goto(path.as_uri() + (f'?{query}' if query else ''))
    page.wait_for_function('window.__vg !== undefined')
    page.evaluate('window.__vg.ready')
    return browser, page, logs


SEMANTICS = '''(times) => times.filter((s) => s <= MC01.model.duration).map((s) => { const fp = __vg.renderAt(s); const w = MC01.world(s);
  return { s, tau: w.tau, reqs: w.reqs.map((x) => [x.req.id, x.state]), ui: w.ui.text, says: MC01.labels().filter((b) => b.says).map((b) => b.says).sort(), fp }; })'''


def main():
    out = {'checked_at': time.strftime('%Y-%m-%dT%H:%M:%S%z'), 'results': {}}
    res = out['results']
    build = subprocess.run(['node', str(HERE / 'build.mjs'), '--all'], capture_output=True, text=True)
    lines = [l for l in build.stdout.splitlines() if l.strip()]
    refused = {l.split(':')[0]: l.split('：', 1)[1] if '：' in l else l for l in lines if '拒绝生成' in l}
    specs = {p.stem: json.loads(p.read_text()) for p in (HERE / 'variants').glob('*.json')}
    # every refusal must be refused for the reason it was written to show, and nothing else may be refused
    wrong = {n: {'want': v.get('refuse_with'), 'got': refused.get(n)} for n, v in specs.items()
             if (n.startswith('refuse-') and not (v.get('refuse_with') and v['refuse_with'] in refused.get(n, ''))) or (not n.startswith('refuse-') and n in refused)}
    built = [l.split(':')[0] for l in lines if '拒绝生成' not in l]
    variants = sorted(n for n in specs if not n.startswith('refuse-'))
    res['build'] = {'lines': lines, 'pass': build.returncode == 0 and sorted(built) == sorted(['main', *variants])}
    res['refusals'] = {'refused': refused, 'wrong_or_missing': wrong, 'pass': not wrong and len(refused) == sum(n.startswith('refuse-') for n in specs)}

    with sync_playwright() as pw:
        # 1. self-test and console, main and each variant
        sem = {}
        for name in ['main', *variants]:
            path = HERE / 'index.html' if name == 'main' else HERE / 'variants' / name / 'index.html'
            browser, page, logs = page_for(pw, path)
            st = page.evaluate('__vg.meta.selfTest()')
            sem[name] = page.evaluate(SEMANTICS, SAMPLES)
            res[f'self_test:{name}'] = {'checks': len(st['checks']), 'skipped': st['skipped'], 'failed': [c for c in st['checks'] if not c['pass']],
                                         'console_errors': logs, 'gl': page.evaluate('MC01.gl()'), 'pass': st['pass'] and not st['skipped'] and not logs}
            browser.close()
        # 2. the camera variant changes what is seen and nothing that is said
        strip = lambda rows: [{k: v for k, v in r.items() if k != 'fp'} for r in rows]
        a, b = sem['main'], sem.get('storage-from-behind', [])
        res['camera_variant'] = {'semantics_equal': strip(a) == strip(b), 'samples': len(a), 'pass': strip(a) == strip(b) and len(a) == len(b) > 0}

        # 3. the viewer's camera on the main piece
        browser, page, logs = page_for(pw, HERE / 'index.html')
        f0 = page.evaluate('__vg.renderAt(30)')
        w0 = page.evaluate('JSON.stringify(MC01.world(30).reqs.map((x) => [x.req.id, x.state, x.j.p]))')
        page.keyboard.press('4')  # hold the camera on the storage level
        page.wait_for_timeout(1300)
        f1 = page.evaluate('__vg.renderAt(30)')  # one draw per task: see acceptance.md on fingerprints
        w1 = page.evaluate('JSON.stringify(MC01.world(30).reqs.map((x) => [x.req.id, x.state, x.j.p]))')
        pressed = page.evaluate('[...document.querySelectorAll(".mc-stations button")].filter((b) => b.getAttribute("aria-pressed") === "true").map((b) => b.dataset.st)')
        offscreen = page.evaluate('MC01.labels().filter((b) => b.note === "off").map((b) => b.id)')
        # interruption: ask for another level mid-move; the camera must carry on from where it is
        page.keyboard.press('2')
        page.wait_for_timeout(300)
        jump = page.evaluate('''(() => { const d = (a, b) => Math.hypot(a.r - b.r, a.y - b.y, (a.az - b.az) / 10, a.target[0] - b.target[0], a.target[1] - b.target[1], a.target[2] - b.target[2]);
            __vg.seek(30); const before = MC01.camera(); MC01.setStation('overview'); __vg.seek(30); return d(before, MC01.camera()); })()''')
        page.wait_for_timeout(200)
        mid = page.evaluate('MC01.cameraMoving()')
        page.keyboard.press('0')
        page.wait_for_timeout(1300)
        f2 = page.evaluate('__vg.renderAt(30)')
        res['viewer_camera'] = {'frame_changes_when_station_held': f0 != f1, 'world_unchanged': w0 == w1, 'pressed_button': pressed,
                                'labels_while_request_out_of_view': offscreen, 'camera_step_at_interruption': round(jump, 4), 'still_moving_after_interruption': mid,
                                'frame_returns_after_release': f0 == f2,
                                'pass': f0 != f1 and w0 == w1 and pressed == ['storage'] and jump < 0.2 and mid and f0 == f2 and offscreen == ['req-1']}

        # 3b. plates are the film's frames even when the viewer holds a camera
        plain = page.evaluate('''(() => { document.querySelector('[data-act=static]').click(); const a = [...document.querySelectorAll('.vg-static img')].map((i) => i.src.length + ':' + i.src.slice(-64)); document.querySelector('[data-act=static]').click(); return a; })()''')
        browser2, page2, _ = page_for(pw, HERE / 'index.html')
        page2.keyboard.press('1'); page2.wait_for_timeout(1300)
        held = page2.evaluate('''(() => { document.querySelector('[data-act=static]').click(); return [...document.querySelectorAll('.vg-static img')].map((i) => i.src.length + ':' + i.src.slice(-64)); })()''')
        browser2.close()
        res['static_plates_ignore_held_camera'] = {'plates': len(plain), 'different': sum(a != b for a, b in zip(plain, held)), 'pass': len(plain) > 0 and plain == held}
        # 3c. Space on a focused control presses that control instead of toggling play
        page.evaluate('__vg.seek(30)')
        page.focus('.mc-stations button[data-st=worker]'); page.keyboard.press('Space'); page.wait_for_timeout(1300)
        space = {'station_after_space_on_button': page.evaluate('MC01.station()'), 'playhead_moved': page.evaluate('MC01.lastS()') != 30}
        page.focus('.mc-ledger tbody tr:nth-child(2) button'); page.keyboard.press('Space'); page.wait_for_timeout(200)
        space['seek_after_space_on_row_button'] = page.evaluate('MC01.lastS()')
        page.evaluate('document.activeElement.blur()')
        page.keyboard.press('0'); page.wait_for_timeout(1300)
        res['space_on_focused_controls'] = {**space, 'pass': space['station_after_space_on_button'] == 'worker' and not space['playhead_moved'] and space['seek_after_space_on_row_button'] == 20}

        # 4. look-back: scrubbing to an earlier moment does not unsay what the record holds
        page.evaluate('__vg.seek(60)'); page.wait_for_timeout(120)
        hidden_at_60 = page.evaluate('document.querySelector(".mc-lookback").hidden')
        page.evaluate('__vg.seek(22)'); page.wait_for_timeout(120)
        note = page.evaluate('(() => { const n = document.querySelector(".mc-lookback"); return n.hidden ? null : n.textContent; })()')
        state_at_22 = page.evaluate('MC01.world(22).reqs.map((x) => x.state)')
        page.evaluate('__vg.seek(60)'); page.wait_for_timeout(120)
        res['look_back'] = {'note_at_22_after_60': note, 'state_drawn_at_22': state_at_22, 'hidden_when_back_at_60': page.evaluate('document.querySelector(".mc-lookback").hidden'),
                            'pass': hidden_at_60 and bool(note) and 'req-1 在 t=4 已落盘' in note and state_at_22 == ['ack']}
        # a jump from a chapter button counts the same as dragging
        page.click('.vg-chapters button:nth-child(8)'); page.wait_for_timeout(120); page.click('.vg-chapters button:nth-child(3)'); page.wait_for_timeout(120)
        jump_note = page.evaluate('(() => { const n = document.querySelector(".mc-lookback"); return n.hidden ? null : n.textContent; })()')
        res['look_back']['after_chapter_jump'] = jump_note
        res['look_back']['pass'] = res['look_back']['pass'] and bool(jump_note) and 'req-2 在 t=8 写入失败' in jump_note

        # 5. text version follows the playhead and can drive it
        page.click('.mc-ledger tbody tr:nth-child(3) button'); page.wait_for_timeout(120)
        cur = page.evaluate('(() => { const r = document.querySelector(".mc-ledger tr[aria-current]"); return r ? r.dataset.t : null; })()')
        res['text_version'] = {'seek_from_row_3': page.evaluate('MC01.lastS()'), 'current_row_t': cur, 'rows': page.evaluate('document.querySelectorAll(".mc-ledger tbody tr").length'),
                               'section_cells': page.evaluate('document.querySelectorAll(".mc-section tbody td").length'),
                               'pass': page.evaluate('MC01.lastS()') == 48 and cur == '4'}
        # 6. keyboard
        page.evaluate('document.activeElement.blur()')
        page.keyboard.press('Home'); page.keyboard.press('Space'); page.wait_for_timeout(1000); page.keyboard.press('Space')
        played = page.evaluate('MC01.lastS()')
        page.keyboard.press('ArrowRight')
        step = round(page.evaluate('MC01.lastS()') - played, 4)
        res['keyboard'] = {'space_played_to': round(played, 2), 'arrow_step': step, 'pass': 0.4 < played < 2.5 and abs(step - 1 / 30) < 1e-3}

        # 7. context loss and restore
        lost = page.evaluate('MC01.debug.lose()'); page.wait_for_timeout(300)
        page.evaluate('__vg.seek(30)'); page.wait_for_timeout(100)
        gl_lost = page.evaluate('MC01.gl()')
        warned = page.evaluate('!document.querySelector(".mc-warn").hidden')
        page.evaluate('MC01.debug.restore()'); page.wait_for_timeout(600)
        f3 = page.evaluate('__vg.renderAt(30)')
        res['context_loss'] = {'lost': lost, 'gl_while_lost': gl_lost, 'page_says_so_while_lost': warned, 'notice_gone_after_restore': page.evaluate('document.querySelector(".mc-warn").hidden'),
                               'frame_restored': f3 == f0, 'console_errors': list(logs), 'pass': lost and gl_lost is None and warned and f3 == f0}
        res['console_after_interaction'] = {'errors': list(logs), 'pass': not logs}
        browser.close()

        # 8. narrow screen and reduced motion
        browser, page, logs = page_for(pw, HERE / 'index.html', size=(390, 844))
        res['narrow_390'] = {'horizontal_overflow': page.evaluate('document.documentElement.scrollWidth > window.innerWidth'),
                             'ledger_rows_stacked': page.evaluate('getComputedStyle(document.querySelector(".mc-ledger tbody tr")).display') == 'block',
                             'console_errors': logs}
        res['narrow_390']['pass'] = not res['narrow_390']['horizontal_overflow'] and res['narrow_390']['ledger_rows_stacked'] and not logs
        page.screenshot(path=str(HERE / 'evidence' / 'narrow-390.png'), full_page=True)
        browser.close()
        browser, page, logs = page_for(pw, HERE / 'index.html', size=(390, 844), reduced=True)
        res['reduced_motion'] = {'plates': page.evaluate('document.querySelectorAll(".vg-static figure img").length'),
                                 'expected': page.evaluate('__vg.staticTimes.length'),
                                 'stage_hidden': page.evaluate('getComputedStyle(document.querySelector(".vg-frame")).display') == 'none',
                                 'camera_controls_hidden': page.evaluate('getComputedStyle(document.querySelector(".mc-stations")).display') == 'none',
                                 'text_version_present': page.evaluate('document.querySelectorAll(".mc-ledger tbody tr").length') > 0,
                                 'seek_buttons_hidden': page.evaluate('getComputedStyle(document.querySelector(".mc-ledger button")).display') == 'none',
                                 'horizontal_overflow': page.evaluate('document.documentElement.scrollWidth > window.innerWidth')}
        r = res['reduced_motion']
        r['pass'] = r['plates'] == r['expected'] and r['stage_hidden'] and r['camera_controls_hidden'] and r['seek_buttons_hidden'] and r['text_version_present'] and not r['horizontal_overflow']
        browser.close()

        # 9. no WebGL at all
        browser, page, logs = page_for(pw, HERE / 'index.html', args=['--disable-3d-apis'])
        page.wait_for_timeout(200)
        st = page.evaluate('__vg.meta.selfTest()')
        res['no_webgl'] = {'gl': page.evaluate('MC01.gl()'), 'warning': page.evaluate('(() => { const w = document.querySelector(".mc-warn"); return w.hidden ? null : w.textContent; })()'),
                           'ledger_rows': page.evaluate('document.querySelectorAll(".mc-ledger tbody tr").length'),
                           'static_button_hidden': page.evaluate('getComputedStyle(document.querySelector("[data-act=static]")).display') == 'none',
                           'camera_controls_hidden': page.evaluate('getComputedStyle(document.querySelector(".mc-stations")).display') == 'none',
                           'self_test_checks_run': len(st['checks']), 'self_test_checks_skipped': st['skipped'], 'self_test_run_part_passes': st['pass'],
                           'page_errors': [l for l in logs if 'WebGL' not in l]}
        r = res['no_webgl']
        r['pass'] = r['gl'] is None and bool(r['warning']) and r['ledger_rows'] > 0 and r['static_button_hidden'] and r['camera_controls_hidden'] and r['self_test_run_part_passes'] and not r['page_errors']
        page.screenshot(path=str(HERE / 'evidence' / 'no-webgl.png'), full_page=True)
        browser.close()

    out['summary'] = {k: v['pass'] for k, v in res.items()}
    out['pass'] = all(out['summary'].values())
    (HERE / 'evidence' / 'check.json').write_text(json.dumps(out, ensure_ascii=False, indent=1))
    print(json.dumps(out['summary'], ensure_ascii=False, indent=1))
    for k, v in res.items():
        if not v['pass']:
            print(k, json.dumps(v, ensure_ascii=False, indent=1)[:1500])
    return 0 if out['pass'] else 1


if __name__ == '__main__':
    sys.exit(main())
