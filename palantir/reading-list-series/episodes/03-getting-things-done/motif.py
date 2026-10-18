"""Cover motif for 03: notes leave a head (a plain circle) and land as rows in a list outside it;
the one in transit is blue. Landscape stacks head over list; portrait sets them side by side."""

INK, INK2, RULE, BLUE = '#0d1826', '#3a4658', '#c3ccd8', '#1f4fe0'
CARD = '#f8fafc'
SERIF = "'Songti SC','Iowan Old Style',serif"


def draw(x, y, w, h, portrait):
    if portrait:                       # head on the left, list on the right
        r = min(h * 0.36, w * 0.2)
        hx, hy = x + r + 6, y + h / 2
        bx, bw = x + w * 0.57, w * 0.43
        by, bh = y + h * 0.1, h * 0.8
        a0, a1 = (hx + r + 24, hy), (bx - 22, hy)
    else:                              # head above, list below
        r = min(w * 0.3, h * 0.18)
        hx, hy = x + w / 2, y + r + 6
        bx, bw = x + w * 0.08, w * 0.84
        by, bh = y + h * 0.56, h * 0.44
        a0, a1 = (hx, hy + r + 24), (hx, by - 22)
    out = [head(hx, hy, r), arrow(a0, a1, portrait), system(bx, by, bw, bh)]
    return '\n'.join(out)


def head(cx, cy, r):
    s = [f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="{CARD}" stroke="{INK}" stroke-width="4"/>',
         f'<text x="{cx:.1f}" y="{cy - r * 0.42:.1f}" text-anchor="middle" font-family="{SERIF}" font-size="{r * 0.26:.0f}" '
         f'font-weight="700" fill="{INK2}">脑子</text>']
    # notes still inside, slightly askew
    notes = [(-0.38, 0.02, -8, 0.42), (0.14, -0.04, 6, 0.46), (-0.18, 0.3, 4, 0.5), (0.3, 0.28, -10, 0.36)]
    for dx, dy, rot, nw in notes:
        nx, ny, ww, hh = cx + dx * r, cy + dy * r, nw * r, 0.16 * r
        s.append(f'<rect x="{nx - ww / 2:.1f}" y="{ny - hh / 2:.1f}" width="{ww:.1f}" height="{hh:.1f}" fill="{CARD}" '
                 f'stroke="{INK2}" stroke-width="3" transform="rotate({rot} {nx:.1f} {ny:.1f})"/>')
    return '\n'.join(s)


def arrow(a, b, horizontal):
    (x0, y0), (x1, y1) = a, b
    if horizontal:
        head = f'M{x1 - 18:.1f},{y1 - 12:.1f} L{x1:.1f},{y1:.1f} L{x1 - 18:.1f},{y1 + 12:.1f}'
        mx, my = (x0 + x1) / 2 - 6, y0
        note = f'<rect x="{mx - 34:.1f}" y="{my - 12:.1f}" width="68" height="24" fill="{BLUE}" transform="rotate(-8 {mx:.1f} {my:.1f})"/>'
    else:
        head = f'M{x1 - 12:.1f},{y1 - 18:.1f} L{x1:.1f},{y1:.1f} L{x1 + 12:.1f},{y1 - 18:.1f}'
        mx, my = x0, (y0 + y1) / 2 - 6
        note = f'<rect x="{mx - 34:.1f}" y="{my - 12:.1f}" width="68" height="24" fill="{BLUE}" transform="rotate(-8 {mx:.1f} {my:.1f})"/>'
    return (f'<path d="M{x0:.1f},{y0:.1f} L{x1:.1f},{y1:.1f} {head}" fill="none" stroke="{BLUE}" stroke-width="4" '
            f'stroke-linecap="round" stroke-linejoin="round"/>' + note)


def system(x, y, w, h):
    s = [f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{CARD}" stroke="{INK}" stroke-width="4"/>']
    n, pad = 5, h * 0.1
    step = (h - 2 * pad) / n
    for i in range(n):
        ry = y + pad + i * step + step / 2
        box = step * 0.34
        col = BLUE if i == 0 else INK2
        s.append(f'<rect x="{x + w * 0.08:.1f}" y="{ry - box / 2:.1f}" width="{box:.1f}" height="{box:.1f}" fill="none" '
                 f'stroke="{col}" stroke-width="3"/>')
        lw = w * (0.62 - 0.08 * (i % 3))
        s.append(f'<rect x="{x + w * 0.08 + box + 20:.1f}" y="{ry - 5:.1f}" width="{lw:.1f}" height="10" '
                 f'fill="{BLUE if i == 0 else RULE}"/>')
    return '\n'.join(s)
