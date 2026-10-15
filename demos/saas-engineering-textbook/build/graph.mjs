// Static SVG rendering of small directed graphs with dagre layout.
// Used for the book's Mermaid flowcharts and the case topologies.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const dagre = require('../vendor/dagre.min.js');

const FONT = 13;
const LABEL_FONT = 11;

export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Approximate advance width; CJK and full-width punctuation take one em.
export function textWidth(s, size = FONT) {
  let w = 0;
  for (const ch of String(s)) {
    const c = ch.codePointAt(0);
    if (c > 0x2e7f || (c >= 0xff00 && c <= 0xffef)) w += size;
    else if (/[A-Z0-9]/.test(ch)) w += size * 0.62;
    else if (ch === ' ') w += size * 0.3;
    else w += size * 0.54;
  }
  return Math.ceil(w);
}

// Parse the flowchart subset the book uses:
//   flowchart LR|TB
//   A[label] -->|edge label| B[label]
//   A --> B
export function parseFlowchart(src) {
  const lines = src.split('\n').map((l) => l.trim()).filter(Boolean);
  const head = lines.shift();
  const m = /^flowchart\s+(LR|TB|TD|RL|BT)$/.exec(head);
  if (!m) throw new Error(`Unsupported mermaid header: ${head}`);
  const dir = m[1] === 'TD' ? 'TB' : m[1];
  const nodes = new Map();
  const edges = [];
  const node = (id, label) => {
    if (!nodes.has(id)) nodes.set(id, { id, label: label ?? id });
    else if (label) nodes.get(id).label = label;
  };
  const re = /^(\w+)(?:\[(.+?)\])?\s*-->\s*(?:\|(.+?)\|\s*)?(\w+)(?:\[(.+?)\])?$/;
  for (const line of lines) {
    const e = re.exec(line);
    if (!e) throw new Error(`Unsupported mermaid line: ${line}`);
    node(e[1], e[2]);
    node(e[4], e[5]);
    edges.push({ from: e[1], to: e[4], label: e[3] ?? '' });
  }
  return { dir, nodes: [...nodes.values()], edges };
}

function wrapLabel(label, max) {
  // Break long labels at the first full-width colon, otherwise keep one line.
  if (textWidth(label) <= max) return [label];
  const i = label.search(/[：:]/);
  if (i > 0) return [label.slice(0, i + 1), label.slice(i + 1)];
  return [label];
}

// graph: {dir, nodes:[{id,label,kind?}], edges:[{from,to,label,type?}]}
const FIT = 740;

export function renderGraph(graph, opts = {}) {
  if (graph.dir !== 'auto') return draw(layout(graph, graph.dir || 'LR'), opts);
  // Pick the direction that needs the least shrinking to fit the text column.
  const a = layout(graph, 'LR');
  const b = layout(graph, 'TB');
  const fit = (g) => Math.min(1, FIT / g.graph().width);
  return draw(fit(b) > fit(a) + 0.05 ? b : a, opts);
}

function layout(graph, dir) {
  const g = new dagre.graphlib.Graph({ multigraph: true });
  g.setGraph({ rankdir: dir, nodesep: 22, ranksep: 54, edgesep: 12, marginx: 8, marginy: 8 });
  g.setDefaultEdgeLabel(() => ({}));
  const maxLine = dir === 'TB' ? 300 : 200;
  for (const n of graph.nodes) {
    const lines = wrapLabel(n.label, maxLine);
    const w = Math.max(...lines.map((l) => textWidth(l))) + 24;
    g.setNode(n.id, { width: Math.max(w, 56), height: 18 * lines.length + 16, lines, kind: n.kind });
  }
  graph.edges.forEach((e, i) => {
    const lw = e.label ? textWidth(e.label, LABEL_FONT) + 8 : 0;
    g.setEdge(e.from, e.to, { width: lw, height: e.label ? 16 : 0, labelpos: 'c', label: e.label, type: e.type || e.label }, `e${i}`);
  });
  dagre.layout(g);
  return g;
}

function draw(g, { title = '', id = '' }) {
  const { width, height } = g.graph();
  const W = Math.ceil(width);
  const H = Math.ceil(height);
  const out = [];
  const mid = `arrow-${id || Math.random().toString(36).slice(2, 8)}`;
  out.push(`<svg class="graph" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="min-width:${Math.round(Math.min(W, Math.max(W * 0.85, FIT)))}px" role="img" aria-label="${esc(title)}">`);
  out.push(`<defs><marker id="${mid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="arrowhead"/></marker></defs>`);
  for (const ev of g.edges()) {
    const e = g.edge(ev);
    const p = e.points;
    let d = `M${p[0].x.toFixed(1)},${p[0].y.toFixed(1)}`;
    if (p.length === 2) d += ` L${p[1].x.toFixed(1)},${p[1].y.toFixed(1)}`;
    else {
      for (let i = 1; i < p.length - 1; i++) {
        const mx = (p[i].x + p[i + 1].x) / 2;
        const my = (p[i].y + p[i + 1].y) / 2;
        d += ` Q${p[i].x.toFixed(1)},${p[i].y.toFixed(1)} ${i === p.length - 2 ? p[i + 1].x.toFixed(1) : mx.toFixed(1)},${i === p.length - 2 ? p[i + 1].y.toFixed(1) : my.toFixed(1)}`;
      }
    }
    out.push(`<path class="edge" data-type="${esc(e.type || '')}" data-from="${esc(ev.v)}" data-to="${esc(ev.w)}" d="${d}" marker-end="url(#${mid})"/>`);
    if (e.label) {
      const lw = textWidth(e.label, LABEL_FONT) + 8;
      out.push(`<g class="edge-label" data-from="${esc(ev.v)}" data-to="${esc(ev.w)}"><rect x="${(e.x - lw / 2).toFixed(1)}" y="${(e.y - 8).toFixed(1)}" width="${lw}" height="16" rx="3"/><text x="${e.x.toFixed(1)}" y="${(e.y + 4).toFixed(1)}">${esc(e.label)}</text></g>`);
    }
  }
  for (const v of g.nodes()) {
    const n = g.node(v);
    const x = n.x - n.width / 2;
    const y = n.y - n.height / 2;
    out.push(`<g class="node" data-id="${esc(v)}"${n.kind ? ` data-kind="${esc(n.kind)}"` : ''}><rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${n.width}" height="${n.height}" rx="4"/>`);
    n.lines.forEach((l, i) => {
      const ty = n.y - ((n.lines.length - 1) * 18) / 2 + i * 18 + 4.5;
      out.push(`<text x="${n.x.toFixed(1)}" y="${ty.toFixed(1)}">${esc(l)}</text>`);
    });
    out.push('</g>');
  }
  out.push('</svg>');
  return out.join('');
}

// A text rendering of the same edges, for screen readers and print.
export function edgeList(graph) {
  const label = Object.fromEntries(graph.nodes.map((n) => [n.id, n.label]));
  const items = graph.edges.map(
    (e) => `<li>${esc(label[e.from])} <span class="rel">${e.label ? `—${esc(e.label)}→` : '→'}</span> ${esc(label[e.to])}</li>`,
  );
  return `<details class="edge-list"><summary>图中关系的文字列表</summary><ul>${items.join('')}</ul></details>`;
}
