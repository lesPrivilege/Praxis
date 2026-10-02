#!/usr/bin/env python3
"""Headless Chrome pass over lab pages: overflow/clip report and screenshots.

Usage:
  python3 tools/check.py [page.html[#anchor] ...] [--widths 1440,375] [--shots DIR] [--height 1400]

An #anchor renders only that element (lab.js ?focus=) so the screenshot starts at it (e.g. atoms/text.html#T03).

Without page arguments it checks every HTML page in atoms/, patterns/, compositions/ and
index.html. The report comes from shared/lab.js check mode (?check). Headless windows cannot be
narrower than 500px, so widths below that use ?w=N: container queries see N, media queries
see 500. Confirm narrow results in a real 375px viewport (browser pane) before relying on them. It only detects
geometry problems; visual judgement still needs a person or an agent looking at shots.
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

LAB = Path(__file__).resolve().parents[1]
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'


def chrome(args):
    return subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars',
                           '--no-first-run', '--no-default-browser-check',
                           '--virtual-time-budget=4000', *args],
                          capture_output=True, text=True, timeout=120)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pages', nargs='*')
    ap.add_argument('--widths', default='1440,375')
    ap.add_argument('--shots', default='')
    ap.add_argument('--height', type=int, default=1400)
    a = ap.parse_args()
    targets = [(Path(p.split('#')[0]).resolve(), p.split('#')[1] if '#' in p else '') for p in a.pages] or [
        (p, '') for p in sorted([LAB / 'index.html', *LAB.glob('atoms/*.html'), *LAB.glob('patterns/*.html'), *LAB.glob('compositions/*.html')])]
    targets = [t for t in targets if t[0].exists()]
    widths = [int(w) for w in a.widths.split(',')]
    summary = {}
    for page, anchor in targets:
        rel = page.relative_to(LAB).as_posix()
        frag = f'&focus={anchor}' if anchor else ''
        for w in widths:
            win = max(w, 500)  # headless Chrome minimum; lab.js ?w= narrows the layout box
            q = f'?w={w}' if w < 500 else '?'
            res = chrome([f'--window-size={win},{a.height}', '--dump-dom', page.as_uri() + q + '&check'])
            m = re.search(r'<pre id="lab-check" hidden="">(.*?)</pre>', res.stdout, re.S)
            report = json.loads(m.group(1).replace('&quot;', '"').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')) if m else {'error': 'no check output'}
            summary[f'{rel}@{w}'] = report
            if a.shots:
                out = Path(a.shots) / f"{rel.replace('/', '__').removesuffix('.html')}{'-' + anchor if anchor else ''}-{w}.png"
                out.parent.mkdir(parents=True, exist_ok=True)
                chrome([f'--window-size={win},{a.height}', f'--screenshot={out}', page.as_uri() + q + frag])  # focus after ?w= / ?
            n = len(report.get('issues', [])) if 'issues' in report else '!'
            print(f'{rel:40} {w:>5}px  issues: {n}', file=sys.stderr)
    print(json.dumps(summary, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
