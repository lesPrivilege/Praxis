"""Native 4:3 and 3:4 covers for every unit and for the compilation.

Each ratio is laid out on its own grid (1600×1200 and 1200×1600); nothing is cropped from the
other. The series band, number, title and reading line come from series-manifest.json; the
motif is drawn by the unit's own episodes/<dir>/motif.py (`draw(x, y, w, h, portrait)` returning
SVG markup), so each episode owns its picture. SVG is the editable source; PNG previews are
rendered with Chromium and stay out of Git.

  python3 build/cover.py              every unit and the compilation
  python3 build/cover.py iu           one unit
"""
import importlib.util, json, sys
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).parent))
MAN = json.loads((ROOT / 'series-manifest.json').read_text())
INK, INK2, INK3, RULE, PAPER, BLUE = '#0d1826', '#3a4658', '#7d8a9c', '#c3ccd8', '#f2f4f7', '#1f4fe0'
SERIF = "'Songti SC','Iowan Old Style',serif"
SANS = "'PingFang SC','Avenir Next','Helvetica Neue',sans-serif"
NUMF = "'Avenir Next','Helvetica Neue',sans-serif"


def t(x, y, s, size, color=INK, weight=400, family=SANS, ls=0, anchor='start'):
    return (f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" fill="{color}" '
            f'letter-spacing="{ls}" text-anchor="{anchor}">{escape(s)}</text>')


def motif(unit, x, y, w, h, portrait):
    if unit == 'cmp':
        path = ROOT / 'assembly' / 'motif.py'
    else:
        path = ROOT / next(u for u in MAN['units'] if u['id'] == unit)['dir'] / 'motif.py'
    if not path.exists():
        return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="none" stroke="{RULE}" stroke-dasharray="8 10"/>'
    spec = importlib.util.spec_from_file_location(f'motif_{unit}', path)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m.draw(x, y, w, h, portrait)


def layout(unit, w, h):
    portrait = h > w
    S = MAN['series']
    if unit == 'cmp':
        c = S['compilation_cover']; no, reading = '合集', c['reading']
        lines = c['lines_3x4' if portrait else 'lines_4x3']
    else:
        u = next(u for u in MAN['units'] if u['id'] == unit)
        no, reading = u['no'], u['reading']
        lines = u['cover']['lines_3x4' if portrait else 'lines_4x3']
    m = 96 if portrait else 104
    a = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">',
         f'<rect width="{w}" height="{h}" fill="{PAPER}"/>',
         t(m, m + 30, S['title_zh'], 34, INK2, 600, SANS, 4),
         t(w - m, m + 30, S['title_en'], 24, INK3, 600, NUMF, 3, 'end'),
         f'<rect x="{m}" y="{m + 58}" width="{w - 2 * m}" height="3" fill="{INK}"/>']
    def fit(width, base):           # CJK glyphs are about one em wide; keep the longest line inside the column
        longest = max(sum(1 if ord(ch) > 0x2e80 else 0.55 for ch in ln) for ln in lines)
        return int(min(base, width / (longest * 1.04)))
    if portrait:
        ny = m + 230
        a.append(t(m, ny, no, 112 if unit != 'cmp' else 96, BLUE, 700, NUMF if unit != 'cmp' else SERIF, 2))
        size = fit(w - 2 * m, 112)
        y = ny + 40 + size
        for ln in lines:
            a.append(t(m - 4, y, ln, size, INK, 700, SERIF, 2)); y += int(size * 1.26)
        a.append(t(m, y + 10, reading, 36, INK2, 400, SANS, 1))
        mx, my = m, y + 90
        a.append(motif(unit, mx, my, w - 2 * m, h - my - m, True))
    else:
        ny = m + 250
        col = int(w * 0.56)
        a.append(t(m, ny, no, 120 if unit != 'cmp' else 100, BLUE, 700, NUMF if unit != 'cmp' else SERIF, 2))
        size = fit(col - m - 60, 104)
        y = ny + 40 + size
        for ln in lines:
            a.append(t(m - 4, y, ln, size, INK, 700, SERIF, 2)); y += int(size * 1.26)
        rsize = min(34, int((col - m - 60) / max(1, sum(1 if ord(ch) > 0x2e80 else 0.55 for ch in reading))))
        a.append(t(m, y + 4, reading, rsize, INK2, 400, SANS, 1))
        a.append(motif(unit, col, m + 120, w - col - m, h - m - (m + 120), False))
    a.append('</svg>')
    return '\n'.join(a)


def main():
    from playwright.sync_api import sync_playwright
    want = sys.argv[1:] or [u['id'] for u in MAN['units'] if u.get('status') != 'hold'] + ['cmp']
    with sync_playwright() as pw:
        from common import launch
        browser = launch(pw)
        for unit in want:
            d = ROOT / ('assembly/covers' if unit == 'cmp' else next(u for u in MAN['units'] if u['id'] == unit)['dir'] + '/covers')
            d.mkdir(parents=True, exist_ok=True)
            for w, h, name in [(1600, 1200, '4x3'), (1200, 1600, '3x4')]:
                f = d / f'{unit}-{name}.svg'
                f.write_text(layout(unit, w, h))
                page = browser.new_page(viewport={'width': w, 'height': h})
                page.goto(f.as_uri()); page.evaluate('document.fonts.ready')
                page.screenshot(path=str(f.with_suffix('.png'))); page.close()
            print(unit, 'covers written to', d.relative_to(ROOT))
        browser.close()


if __name__ == '__main__':
    main()
