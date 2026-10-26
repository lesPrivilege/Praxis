"""Still frames and contact sheets for review.

  python3 pipeline/frames.py 3.2 8 12.5            frames at those seconds
  python3 pipeline/frames.py c0.6 c0.6+1.5         cue-relative: segment start, optional offset
  python3 pipeline/frames.py --range 20 40 --step 2
  options: --out DIR  --cols N  --width PX (cell width in the sheet)  --full (also keep 1920 px frames)

Writes sheet.png (labelled grid) into --out, default pipeline/_review (not versioned).
"""
import argparse, json, sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
URL = (ROOT / 'film' / 'index.html').as_uri() + '?render=1'
ARGS = ['--use-angle=metal', '--enable-gpu-rasterization', '--force-device-scale-factor=1', '--hide-scrollbars',
        '--font-render-hinting=none', '--disable-lcd-text']


def open_page(pw):
    browser = pw.chromium.launch(args=ARGS)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    page.on('console', lambda m: print('console:', m.text, file=sys.stderr) if m.type in ('error', 'warning') else None)
    page.on('pageerror', lambda e: print('pageerror:', e, file=sys.stderr))
    page.goto(URL)
    page.wait_for_function('window.Film && Film.ready', timeout=30000)
    return browser, page


def resolve(tok, segs):
    if tok[0].isdigit():
        return float(tok)
    name, _, off = tok.partition('+')
    return segs[name]['start'] + (float(off) if off else 0.0)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('times', nargs='*')
    ap.add_argument('--range', nargs=2, type=float)
    ap.add_argument('--step', type=float, default=1.0)
    ap.add_argument('--out', default=str(ROOT / 'pipeline' / '_review'))
    ap.add_argument('--name', default='sheet')
    ap.add_argument('--cols', type=int, default=3)
    ap.add_argument('--width', type=int, default=640)
    ap.add_argument('--full', action='store_true')
    a = ap.parse_args()

    tl = json.loads((ROOT / 'script' / 'timeline.json').read_text())
    segs = {s['id']: s for s in tl['segments']}
    times = [resolve(t, segs) for t in a.times]
    if a.range:
        t = a.range[0]
        while t <= a.range[1] + 1e-6:
            times.append(round(t, 3)); t += a.step
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)

    shots = []
    with sync_playwright() as pw:
        browser, page = open_page(pw)
        for t in times:
            page.evaluate('t => Film.seek(t)', t)
            png = out / f'f-{t:08.3f}.png'
            page.screenshot(path=str(png))
            shots.append((t, png))
        browser.close()

    cw = a.width; ch = round(cw * 9 / 16); pad = 6; lab = 26
    cols = min(a.cols, len(shots)); rows = -(-len(shots) // cols)
    sheet = Image.new('RGB', (cols * (cw + pad) + pad, rows * (ch + lab + pad) + pad), (20, 24, 30))
    d = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 16)
    except OSError:
        font = ImageFont.load_default()
    def seg_at(t):
        cur = ''
        for s in tl['segments']:
            if s['start'] <= t: cur = s['id']
        return cur
    for i, (t, png) in enumerate(shots):
        im = Image.open(png).convert('RGB').resize((cw, ch), Image.LANCZOS)
        x = pad + (i % cols) * (cw + pad); y = pad + (i // cols) * (ch + lab + pad)
        sheet.paste(im, (x, y + lab))
        d.text((x + 2, y + 4), f'{t:7.2f}s  {seg_at(t)}', fill=(200, 210, 225), font=font)
        if not a.full:
            png.unlink()
    path = out / f'{a.name}.png'
    sheet.save(path)
    print(path)


if __name__ == '__main__':
    main()
