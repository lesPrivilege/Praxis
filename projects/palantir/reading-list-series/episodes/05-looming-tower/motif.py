"""Cover motif for 05: CIA and FBI as two columns. What the CIA knew sits on the left; each message
heads across in a red line and stops short of an empty slot on the FBI side."""

INK, INK2, BLUE, RED, RULE = '#0d1826', '#3a4658', '#1f4fe0', '#dd4a3c', '#c3ccd8'
SERIF = "'Iowan Old Style','Songti SC',serif"


def draw(x, y, w, h, portrait):
    rows = 3
    head = 92 if portrait else 108
    hs = 58 if portrait else 64                 # header type size
    colw = w * (0.38 if portrait else 0.34)
    lx, rx = x, x + w - colw                    # left (CIA) and right (FBI) columns
    gap = 30 if portrait else 40
    top = y + head + 34
    bh = (y + h - top - gap * (rows - 1)) / rows
    out = []
    for cx, label in ((lx, 'CIA'), (rx, 'FBI')):
        out.append(f'<text x="{cx}" y="{y + hs}" font-family="{SERIF}" font-size="{hs}" font-weight="700" fill="{INK}" letter-spacing="2">{label}</text>')
        out.append(f'<rect x="{cx}" y="{y + head}" width="{colw}" height="3" fill="{INK}"/>')
    for i in range(rows):
        by = top + i * (bh + gap)
        cy = by + bh / 2
        # what the CIA knew: a filled record with two lines of "text"
        out.append(f'<rect x="{lx + 1.5}" y="{by + 1.5}" width="{colw - 3}" height="{bh - 3}" fill="#f8fafc" stroke="{INK}" stroke-width="3"/>')
        pad = colw * 0.12
        for k, frac in enumerate((0.72, 0.48)):
            ly = by + bh * (0.38 + 0.26 * k)
            color = BLUE if (i == 0 and k == 1) else INK2
            out.append(f'<rect x="{lx + pad}" y="{ly - 5}" width="{(colw - 2 * pad) * frac}" height="10" fill="{color}"/>')
        # the empty slot on the FBI side
        out.append(f'<rect x="{rx + 1.5}" y="{by + 1.5}" width="{colw - 3}" height="{bh - 3}" fill="none" stroke="{RED}" stroke-width="3"/>')
        # the message that does not arrive
        x1, x2 = lx + colw + 18, rx - 30
        out.append(f'<path d="M{x1},{cy} L{x2},{cy}" fill="none" stroke="{RED}" stroke-width="4"/>')
        out.append(f'<path d="M{x2 + 12},{cy - 18} L{x2 + 12},{cy + 18}" fill="none" stroke="{RED}" stroke-width="4" stroke-linecap="round"/>')
    return '\n'.join(out)
