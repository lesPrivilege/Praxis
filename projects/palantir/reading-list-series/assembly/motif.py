"""Cover motif for the compilation: the series map — five readings under the job each serves,
joined by a dashed line because the grouping is this series' own reading."""
from html import escape

INK, INK2, INK3, BLUE = '#0d1826', '#3a4658', '#7d8a9c', '#1f4fe0'
MAP = [('问题', 'Interviewing Users'), ('信任', 'Impro'), ('事务', 'Getting Things Done'), ('对错', 'Principles（PDF）'), ('使命', 'The Looming Tower')]


def draw(x, y, w, h, portrait):
    # the same label the film puts over the map: the grouping is this series' reading, not the books'
    out = [f'<text x="{x}" y="{y + 30}" font-family="\'Avenir Next\',\'PingFang SC\',sans-serif" font-size="28" font-weight="600" letter-spacing="4" fill="{INK3}">本系列的读法</text>']
    y, h = y + 64, h - 64
    if portrait:            # five rows, word left, book right
        rh = h / len(MAP)
        out.append(f'<path d="M{x + 40},{y + rh / 2} V{y + h - rh / 2}" stroke="{INK3}" stroke-width="3" stroke-dasharray="8 10" fill="none"/>')
        for i, (word, book) in enumerate(MAP):
            cy = y + i * rh + rh / 2
            out.append(f'<circle cx="{x + 40}" cy="{cy}" r="12" fill="#f2f4f7" stroke="{INK3}" stroke-width="3"/>')
            out.append(f'<text x="{x + 90}" y="{cy + 26}" font-family="\'Songti SC\',serif" font-size="{min(76, rh * 0.62):.0f}" font-weight="700" fill="{INK}">{escape(word)}</text>')
            out.append(f'<text x="{x + 90 + min(76, rh * 0.62) * 2.4:.0f}" y="{cy + 14}" font-family="\'Avenir Next\',\'PingFang SC\',sans-serif" font-size="30" fill="{INK2}">{escape(book)}</text>')
    else:                   # five stacked rows in the right column
        rh = h / len(MAP)
        out.append(f'<path d="M{x + 30},{y + rh / 2} V{y + h - rh / 2}" stroke="{INK3}" stroke-width="3" stroke-dasharray="8 10" fill="none"/>')
        for i, (word, book) in enumerate(MAP):
            cy = y + i * rh + rh / 2
            out.append(f'<circle cx="{x + 30}" cy="{cy}" r="11" fill="#f2f4f7" stroke="{INK3}" stroke-width="3"/>')
            out.append(f'<text x="{x + 70}" y="{cy - 4}" font-family="\'Songti SC\',serif" font-size="{min(64, rh * 0.48):.0f}" font-weight="700" fill="{INK}">{escape(word)}</text>')
            out.append(f'<text x="{x + 70}" y="{cy + 38}" font-family="\'Avenir Next\',\'PingFang SC\',sans-serif" font-size="28" fill="{INK2}">{escape(book)}</text>')
    return '\n'.join(out)
