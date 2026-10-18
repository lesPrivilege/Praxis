"""Still frames and contact sheets for review.

  python3 build/frames.py ep01 3.2 8 12.5             frames at those seconds
  python3 build/frames.py ep01 iu.b3 iu.b3+1.5        segment-relative: start, optional offset
  python3 build/frames.py ep01 --range 20 40 --step 2
  options: --out DIR  --name N  --cols N  --width PX (cell width)  --full (also keep 1920 px frames)

Writes a labelled grid into --out (default: a temporary directory, printed).
Adapted from demos/role-baseline-film/build/frames.py.
"""
import argparse, sys, tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).parent))
from common import open_page, seg_at, timeline


def resolve(tok, segs):
    if tok[0].isdigit():
        return float(tok)
    name, _, off = tok.partition('+')
    return segs[name]['start'] + (float(off) if off else 0.0)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('assembly')
    ap.add_argument('times', nargs='*')
    ap.add_argument('--range', nargs=2, type=float)
    ap.add_argument('--step', type=float, default=1.0)
    ap.add_argument('--out')
    ap.add_argument('--name', default='sheet')
    ap.add_argument('--cols', type=int, default=3)
    ap.add_argument('--width', type=int, default=640)
    ap.add_argument('--full', action='store_true')
    a = ap.parse_args()

    tl = timeline(a.assembly)
    segs = {s['id']: s for s in tl['segments']}
    times = [resolve(t, segs) for t in a.times]
    if a.range:
        t = a.range[0]
        while t <= a.range[1] + 1e-6:
            times.append(round(t, 3)); t += a.step
    out = Path(a.out or tempfile.mkdtemp(prefix='prl-frames-')); out.mkdir(parents=True, exist_ok=True)

    shots = []
    with sync_playwright() as pw:
        browser, page = open_page(pw, a.assembly)
        for t in times:
            page.evaluate('t => Film.seek(t)', t)
            png = out / f'{a.name}-{t:08.3f}.png'
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
    for i, (t, png) in enumerate(shots):
        im = Image.open(png).convert('RGB').resize((cw, ch), Image.LANCZOS)
        x = pad + (i % cols) * (cw + pad); y = pad + (i // cols) * (ch + lab + pad)
        sheet.paste(im, (x, y + lab))
        d.text((x + 2, y + 4), f'{t:7.2f}s  {seg_at(tl, t)}', fill=(200, 210, 225), font=font)
        if not a.full:
            png.unlink()
    path = out / f'{a.name}.png'
    sheet.save(path)
    print(path)


if __name__ == '__main__':
    main()
