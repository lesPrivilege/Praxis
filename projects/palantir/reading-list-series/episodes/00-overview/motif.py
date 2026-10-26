"""Cover motif for 00: the five readings as plain cards, the Principles PDF with a folded corner."""
from html import escape

INK, INK2, RULE, BLUE = '#0d1826', '#3a4658', '#c3ccd8', '#1f4fe0'
BOOKS = ['Impro', 'The Looming Tower', 'Interviewing Users', 'Getting Things Done', 'Principles（PDF）']


def draw(x, y, w, h, portrait):
    out = []
    if portrait:            # one row of five tall cards across the lower half
        n, gap = 5, 18
        cw = (w - gap * (n - 1)) / n
        ch = h
        for i, t in enumerate(BOOKS):
            cx = x + i * (cw + gap)
            out.append(card(cx, y + (h - ch) / 2, cw, ch, t, i == 4, vertical=True))
    else:                   # a stack of five wide cards on the right
        n, gap = 5, 22
        ch = (h - gap * (n - 1)) / n
        for i, t in enumerate(BOOKS):
            out.append(card(x, y + i * (ch + gap), w, ch, t, i == 4, vertical=False))
    return '\n'.join(out)


def card(x, y, w, h, title, pdf, vertical):
    fold = 30
    if pdf:
        d = f'M{x},{y} H{x + w - fold} L{x + w},{y + fold} V{y + h} H{x} Z'
        shape = f'<path d="{d}" fill="#f8fafc" stroke="{INK}" stroke-width="3"/><path d="M{x + w - fold},{y} V{y + fold} H{x + w}" fill="none" stroke="{INK}" stroke-width="3"/>'
    else:
        shape = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#f8fafc" stroke="{INK}" stroke-width="3"/>'
    if vertical:
        tx, ty = x + w / 2, y + 34
        fs = min(34, w * 0.36, (h - 70) / (len(title) * 0.5))
        text = (f'<text transform="translate({tx - fs * 0.35},{ty}) rotate(90)" font-family="\'Iowan Old Style\',\'Songti SC\',serif" '
                f'font-size="{fs:.0f}" font-weight="700" fill="{INK}">{escape(title)}</text>')
    else:
        text = (f'<text x="{x + 28}" y="{y + h / 2 + 12}" font-family="\'Iowan Old Style\',\'Songti SC\',serif" '
                f'font-size="{min(38, h * 0.36):.0f}" font-weight="700" fill="{INK}">{escape(title)}</text>')
    return shape + text
