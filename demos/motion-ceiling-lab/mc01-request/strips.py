#!/usr/bin/env python3
"""Dense frame strips of the key continuous passages, for reading motion between keyframes.

  python3 strips.py

Writes evidence/strip-*.jpg. A strip is closer to continuous viewing than a keyframe and is still
not playback: rhythm and flicker can only be judged by watching the film.
"""
import base64, io
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
STRIPS = {  # name: (start, end, step)
    'reveal': (6.5, 12.0, 0.5), 'first-receipt': (19.0, 24.5, 0.5), 'occlusion': (34.4, 38.0, 0.3),
    'durable-and-return': (47.0, 58.0, 1.0), 'second-save': (69.0, 87.0, 1.5), 'back-to-flat': (86.6, 91.0, 0.4),
}
with sync_playwright() as pw:
    b = pw.chromium.launch(args=['--use-angle=metal'])
    pg = b.new_page(viewport={'width': 1920, 'height': 1080})
    pg.goto((HERE / 'index.html').as_uri() + '?export=1')
    pg.wait_for_function('window.__vg !== undefined'); pg.evaluate('__vg.ready')
    for name, (a, z, step) in STRIPS.items():
        times = [round(a + i * step, 2) for i in range(int(round((z - a) / step)) + 1)]
        ims = [Image.open(io.BytesIO(base64.b64decode(pg.evaluate('t => __vg.frame(t, "image/jpeg", 0.9)', t).split(',')[1]))).resize((640, 360), Image.LANCZOS) for t in times]
        cols = 4
        sheet = Image.new('RGB', (cols * 640, ((len(ims) + cols - 1) // cols) * 360), 'white')
        for i, im in enumerate(ims):
            sheet.paste(im, ((i % cols) * 640, (i // cols) * 360))
        sheet.save(HERE / 'evidence' / f'strip-{name}.jpg', quality=82)
        print(name, len(times), times[0], times[-1])
    b.close()
