"""Cover motif for 01: a line-art hard hat over the three parts of Portigal's research plan.
The first part, the business problem, carries the series' one blue accent."""
from html import escape

INK, INK2, RULE, BLUE = '#0d1826', '#3a4658', '#c3ccd8', '#1f4fe0'
PARTS = ['业务问题', '研究问题', '研究方法']
SERIF = "'Songti SC','Iowan Old Style',serif"


def draw(x, y, w, h, portrait):
    out = []
    if w / h > 1.2:            # wide area (the 3:4 cover): hat on the left, cards stacked on the right
        s = min(h * 1.35, w * 0.56)
        hy = y + (h - s * 0.6) / 2
        out.append(hat(x, hy, s))
        cx, cw = x + s + w * 0.06, w - s - w * 0.06
        gap = 22
        ch = min(130, (h - 2 * gap) / 3)
        top = y + (h - (3 * ch + 2 * gap)) / 2
        for i, t in enumerate(PARTS):
            out.append(card(cx, top + i * (ch + gap), cw, ch, t, i == 0))
    else:                      # tall area (the 4:3 cover): hat on top, cards in a row below
        s = min(w, h * 0.95)
        gap = 20
        cw = (w - 2 * gap) / 3
        ch = min(140, cw * 0.66)
        y0 = y + (h - (s * 0.56 + 90 + ch)) / 2
        out.append(hat(x + (w - s) / 2, y0, s))
        top = y0 + s * 0.56 + 90
        for i, t in enumerate(PARTS):
            out.append(card(x + i * (cw + gap), top, cw, ch, t, i == 0))
    return '\n'.join(out)


def hat(x, y, s):
    """Hard hat seen from the side, s wide: dome, centre rib, side ridges and brim."""
    P = lambda u, v: f'{x + u * s:.1f},{y + v * s:.1f}'
    sw = max(3, s * 0.009)
    dome = f'M{P(.12, .48)} C{P(.12, .16)} {P(.31, .02)} {P(.5, .02)} C{P(.69, .02)} {P(.88, .16)} {P(.88, .48)}'
    rib = f'M{P(.455, .035)} C{P(.43, .2)} {P(.425, .34)} {P(.425, .48)} M{P(.545, .035)} C{P(.57, .2)} {P(.575, .34)} {P(.575, .48)}'
    ridges = f'M{P(.3, .1)} C{P(.25, .22)} {P(.24, .34)} {P(.24, .48)} M{P(.7, .1)} C{P(.75, .22)} {P(.76, .34)} {P(.76, .48)}'
    brim = f'M{P(.02, .48)} L{P(.98, .48)} Q{P(1.0, .55)} {P(.95, .56)} L{P(.05, .56)} Q{P(.0, .55)} {P(.02, .48)} Z'
    band = f'M{P(.14, .44)} L{P(.86, .44)}'
    return (f'<g fill="none" stroke="{INK}" stroke-width="{sw:.1f}" stroke-linecap="round" stroke-linejoin="round">'
            f'<path d="{dome}" fill="#f8fafc"/><path d="{rib}" stroke="{INK2}" stroke-width="{sw * .7:.1f}"/>'
            f'<path d="{ridges}" stroke="{INK2}" stroke-width="{sw * .7:.1f}"/><path d="{band}" stroke="{RULE}" stroke-width="{sw * .7:.1f}"/>'
            f'<path d="{brim}" fill="#f8fafc"/></g>')


def card(x, y, w, h, text, accent):
    color = BLUE if accent else INK
    size = min(40, h * 0.34, w / 4.6)
    return (f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="#f8fafc" stroke="{color}" stroke-width="3"/>'
            f'<text x="{x + w / 2:.1f}" y="{y + h / 2 + size * 0.36:.1f}" text-anchor="middle" font-family="{SERIF}" '
            f'font-size="{size:.0f}" font-weight="700" fill="{color}">{escape(text)}</text>')
