"""Cover motif for 02: two figures on a status scale, one standing just a little higher than the other.
The higher one keeps its head still, marked by a blue plumb line through the head, as in the episode."""

INK, BLUE = '#0d1826', '#1f4fe0'
FILL, FILL2 = '#f8fafc', '#e5e9ef'


def draw(x, y, w, h, portrait):
    # the figures are drawn in a 300×360 unit (head r 64 at (150,120), shoulders to the bottom);
    # scale the unit so the two figures and the step between them fill the box
    gap = 0.18                                   # space between the figures, in figure widths
    s = min(w / (2 + gap) / 300 * 0.94, h / 360 * 0.74)   # platforms span 2.3 figure widths
    fw, fh = 300 * s, 360 * s
    step = fh * 0.16                             # "just a little" higher
    base = y + h / 2 + (fh + step) / 2           # the floor of the lower figure; the group is centred
    lx = x + w / 2 - (2 + gap) * fw / 2          # left edge of the left figure
    rx = lx + fw + gap * fw
    mx = rx - gap * fw / 2                       # the riser between the two platforms
    return '\n'.join([
        f'<path d="M{lx - fw * 0.06:.1f},{base:.1f} H{mx:.1f} V{base - step:.1f} H{rx + fw * 1.06:.1f}" '
        f'fill="none" stroke="{INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>',
        bust(lx, base - fh, s, INK, plumb=False),
        bust(rx, base - step - fh, s, BLUE, plumb=True),
    ])


def bust(x, y, s, color, plumb):
    sw = 3.5 / s
    g = [f'<g transform="translate({x:.1f},{y:.1f}) scale({s:.4f})">',
         f'<path d="M30,360 C30,262 78,222 150,222 C222,222 270,262 270,360 Z" fill="{FILL2}" stroke="{color}" stroke-width="{sw:.2f}"/>',
         f'<circle cx="150" cy="120" r="64" fill="{FILL}" stroke="{color}" stroke-width="{sw:.2f}"/>']
    if plumb:
        g.append(f'<line x1="150" y1="18" x2="150" y2="206" stroke="{BLUE}" stroke-width="{sw:.2f}" stroke-linecap="round"/>')
    g.append('</g>')
    return ''.join(g)
