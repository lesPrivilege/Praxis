"""Cover motif for 04: a page of the 2011 Principles PDF with one line marked in blue, and Dalio's
formula set beside or under it."""
from html import escape

INK, INK2, INK3, RULE, BLUE = '#0d1826', '#3a4658', '#7d8a9c', '#c3ccd8', '#1f4fe0'
SERIF = "'Iowan Old Style','Songti SC',serif"
SANS = "'Avenir Next','PingFang SC',sans-serif"
WIDTHS = [0.92, 0.86, 0.95, 0.6, 0.9, 0.82, 0.94, 0.88, 0.55, 0.93, 0.84, 0.9, 0.7, 0.96, 0.8, 0.62]
MARKED = 6


def draw(x, y, w, h, portrait):
    if portrait:            # the page on the left, the formula stacked on the right
        sw = min(w * 0.48, h * 0.74)
        out = [page(x, y, sw, h)]
        out.append(formula_stacked(x + sw + w * 0.07, y, w - sw - w * 0.07, h))
    else:                   # the page above, the formula along the bottom
        fs = min(44, w / 16)
        out = [page(x, y, w, h - fs * 2.6)]
        out.append(formula_line(x, y + h - fs * 0.55, w, fs))
    return '\n'.join(out)


def page(x, y, w, h):
    fold = min(w, h) * 0.1
    d = f'M{x},{y} H{x + w - fold} L{x + w},{y + fold} V{y + h} H{x} Z'
    a = [f'<path d="{d}" fill="#f8fafc" stroke="{INK}" stroke-width="3"/>',
         f'<path d="M{x + w - fold},{y} V{y + fold} H{x + w}" fill="none" stroke="{INK}" stroke-width="3"/>']
    pad = w * 0.11
    ts = min(46, w * 0.085)
    a.append(f'<text x="{x + pad}" y="{y + pad + ts * 0.8}" font-family="{SERIF}" font-size="{ts:.0f}" font-weight="700" fill="{INK}">Principles</text>')
    top, bottom = y + pad + ts * 1.9, y + h - pad - ts * 0.9
    n = len(WIDTHS)
    step = (bottom - top) / n
    bar = max(6, min(12, step * 0.32))
    for i, f in enumerate(WIDTHS):
        ly = top + i * step
        lw = (w - 2 * pad) * f
        color = BLUE if i == MARKED else RULE
        a.append(f'<rect x="{x + pad}" y="{ly:.1f}" width="{lw:.1f}" height="{bar:.1f}" rx="2" fill="{color}"/>')
    my = top + MARKED * step + bar / 2
    a.append(f'<rect x="{x + pad * 0.38}" y="{my - step * 0.55:.1f}" width="5" height="{step * 1.1:.1f}" fill="{BLUE}"/>')
    fs = min(24, w * 0.045)
    a.append(f'<text x="{x + pad}" y="{y + h - pad * 0.6:.1f}" font-family="{SANS}" font-size="{fs:.0f}" font-weight="500" fill="{INK3}">{escape("© 2011 Ray Dalio")}</text>')
    return '\n'.join(a)


def formula_line(x, y, w, fs):
    return (f'<text x="{x + w / 2}" y="{y:.1f}" text-anchor="middle" font-family="{SERIF}" font-size="{fs:.0f}" font-weight="700" fill="{INK}">'
            f'Pain <tspan fill="{INK3}" font-weight="400">+</tspan> <tspan fill="{BLUE}">Reflection</tspan> '
            f'<tspan fill="{INK3}" font-weight="400">=</tspan> Progress</text>')


def formula_stacked(x, y, w, h):
    fs = min(64, w / 7.2, h / 6.5)
    rows = [('', 'Pain', INK), ('+', 'Reflection', BLUE), ('=', 'Progress', INK)]
    gap = fs * 1.6
    y0 = y + (h - gap * 2) / 2 + fs * 0.35
    a = []
    for i, (op, t, c) in enumerate(rows):
        lead = f'<tspan fill="{INK3}" font-weight="400">{op} </tspan>' if op else ''
        a.append(f'<text x="{x}" y="{y0 + i * gap:.1f}" font-family="{SERIF}" font-size="{fs:.0f}" font-weight="700" fill="{c}">{lead}{t}</text>')
    return '\n'.join(a)
