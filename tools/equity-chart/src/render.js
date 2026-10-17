// Turn a laid-out chart into a self-contained SVG string. No background shape is
// drawn, so the canvas stays transparent; every line of text is an explicit
// <tspan> with its own baseline, so other viewers do not need to re-wrap.
// The interactive variant only adds data-node / data-edge hooks and wide
// invisible hit lines for the editor preview; exports never carry them.
(function (EC) {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
  const r = (v) => Math.round(v * 100) / 100;

  const FILLS = { white: '#ffffff', tint: null, none: 'none' };

  EC.renderSVG = function (chart, o, interactive = false) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const grow = (x, y, w = 0, h = 0) => {
      minX = Math.min(minX, x); minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + w); maxY = Math.max(maxY, y + h);
    };
    for (const n of chart.nodes) grow(n.x, n.y, n.width, n.height);
    for (const e of chart.edges) {
      for (const p of e.points) grow(p.x, p.y);
      if (e.label) grow(e.label.x, e.label.y, e.label.width, e.label.height);
    }
    if (!chart.nodes.length) minX = minY = maxX = maxY = 0;
    const dx = o.margin - minX;
    const dy = o.margin - minY;
    const W = Math.ceil(maxX - minX + 2 * o.margin);
    const H = Math.ceil(maxY - minY + 2 * o.margin);
    const fill = o.nodeFill === 'tint' ? tint(o.lineColor) : FILLS[o.nodeFill];

    const out = [];
    out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${esc(EC.FONT_STACK)}">`);
    out.push(`<defs><marker id="ec-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="${r(o.arrow)}" markerHeight="${r(o.arrow)}" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="${esc(o.lineColor)}"/></marker></defs>`);

    out.push(`<g fill="none" stroke="${esc(o.lineColor)}" stroke-width="${o.strokeWidth}" stroke-linejoin="round">`);
    for (const e of chart.edges) {
      if (!e.points.length) continue;
      const d = e.points.map((p, i) => `${i ? 'L' : 'M'}${r(p.x + dx)} ${r(p.y + dy)}`).join('');
      if (interactive) {
        out.push(`<g data-edge="${esc(e.id)}"><path d="${d}" marker-end="url(#ec-arrow)"/><path class="hit" d="${d}" stroke="transparent" stroke-width="12"/></g>`);
      } else {
        out.push(`<path d="${d}" marker-end="url(#ec-arrow)"/>`);
      }
    }
    out.push('</g>');

    const labels = chart.edges.filter((e) => e.label);
    if (labels.length) {
      const m = EC.fontMetrics(labels[0].label.size, 400);
      out.push(`<g font-size="${r(labels[0].label.size)}" fill="${esc(o.labelColor)}" text-anchor="middle">`);
      for (const { id, label: l } of labels) {
        const base = l.y + dy + (l.height - (m.ascent + m.descent)) / 2 + m.ascent;
        const hook = interactive ? ` data-edge="${esc(id)}"` : '';
        out.push(`<text x="${r(l.x + dx + l.width / 2)}" y="${r(base)}"${hook}>${esc(l.text)}</text>`);
      }
      out.push('</g>');
    }

    for (const n of chart.nodes) {
      const x = n.x + dx;
      const y = n.y + dy;
      const t = n.text;
      const rx = n.kind === 'person' ? Math.min(n.height / 2, 16) : o.radius;
      const stroke = n.focus ? o.accent : o.lineColor;
      const sw = n.focus ? o.strokeWidth * 1.8 : o.strokeWidth;
      out.push(interactive ? `<g data-node="${esc(n.id)}">` : '<g>');
      out.push(`<rect x="${r(x)}" y="${r(y)}" width="${r(n.width)}" height="${r(n.height)}" rx="${r(rx)}" fill="${esc(fill)}" stroke="${esc(stroke)}" stroke-width="${r(sw)}"/>`);
      const cx = x + n.width / 2;
      const first = y + o.padY + (t.lineHeight - (t.metrics.ascent + t.metrics.descent)) / 2 + t.metrics.ascent;
      const weight = n.focus ? ' font-weight="600"' : '';
      out.push(`<text x="${r(cx)}" y="${r(first)}" font-size="${o.fontSize}"${weight} fill="${esc(o.textColor)}" text-anchor="middle">`);
      t.lines.forEach((line, i) => {
        out.push(`<tspan x="${r(cx)}"${i ? ` dy="${r(t.lineHeight)}"` : ''}>${esc(line)}</tspan>`);
      });
      out.push('</text></g>');
    }
    out.push('</svg>');
    return { svg: out.join('\n'), width: W, height: H };
  };

  // A pale version of the line color, mixed toward white, for tinted node fills.
  function tint(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex);
    if (!m) return '#f1f5f9';
    const n = parseInt(m[1], 16);
    const mix = (c) => Math.round(c + (255 - c) * 0.9).toString(16).padStart(2, '0');
    return '#' + mix(n >> 16) + mix((n >> 8) & 255) + mix(n & 255);
  }
})(window.EC);
