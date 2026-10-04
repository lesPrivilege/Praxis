// 四个件共用的底层：文字估宽与换行、SVG 节点、作用域内的 ID、拒用。
// 没有依赖。文字宽度是估算值，实际宽度由 probe 在浏览器里核对。

export const VERSION = '0.1.0';

export const T = {
  font: "system-ui, -apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif",
  size: 14,
  small: 12,
  ink: '#1b2733',
  sub: '#526276',
  edge: '#3d4c5e',
  line: '#7b8ba0',
  wash: '#f2f5f9',
  paper: '#ffffff',
  accent: '#1f5fd1',
};

export const PAD = 2;

export class Refusal extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

export function need(ok, code, message) {
  if (!ok) throw new Refusal(code, message);
}

// 业务 ID 会进属性值和以空格分隔的列表，不能为空，也不能含空白
export function needId(id, what) {
  need(typeof id === 'string' && /^\S+$/.test(id), 'id', `${what}的 id 须是不含空白的非空字符串：${JSON.stringify(id)}`);
}

export const r = (n) => +n.toFixed(1);
export const lineH = (size) => Math.round(size * 1.5);

export function esc(s) {
  return String(s)
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]|[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function attrs(a = {}) {
  let out = '';
  for (const [k, v] of Object.entries(a)) {
    if (v === null || v === undefined || v === false) continue;
    out += ` ${k}="${esc(typeof v === 'number' ? r(v) : v)}"`;
  }
  return out;
}

// 估宽，单位 em。中日韩文字和全角标点按 1；拉丁字母按字形粗分，宁宽勿窄。
function charW(ch, bold) {
  const c = ch.codePointAt(0);
  if (c > 0xffff) return 1.3;
  if (c >= 0x2000) return 1;
  let w;
  if (ch === ' ') w = 0.3;
  else if (/[0-9]/.test(ch)) w = 0.62;
  else if (/[A-Z]/.test(ch)) w = ch === 'I' ? 0.32 : /[MW]/.test(ch) ? 0.92 : 0.72;
  else if (/[a-z]/.test(ch)) w = /[ijl]/.test(ch) ? 0.3 : /[mw]/.test(ch) ? 0.9 : /[frt]/.test(ch) ? 0.42 : 0.6;
  else if (/[.,:;'|!]/.test(ch)) w = 0.32;
  else if (/[@%]/.test(ch)) w = 0.95;
  else w = 0.7;
  return bold ? w * 1.06 : w;
}

export function textW(str, size = T.size, bold = false) {
  let w = 0;
  for (const ch of str) w += charW(ch, bold);
  return w * size;
}

const NO_START = new Set('，。、；：？！）》」』”’％%,.;:?!)]}');
const NO_END = new Set('（《「『“‘([{');
const RUN = /[A-Za-z0-9@#%&_\-./:§+=~]/;

function tokenize(para, base, maxW, size, bold) {
  const toks = [];
  let i = 0;
  while (i < para.length) {
    let j = i;
    if (RUN.test(para[i])) {
      while (j < para.length && RUN.test(para[j])) j++;
    } else {
      j += para.codePointAt(i) > 0xffff ? 2 : 1;
    }
    const s = para.slice(i, j);
    const w = textW(s, size, bold);
    if (w > maxW && j - i > 1) {
      // 一个不可断的串比整行还宽：逐字切开
      for (let k = i; k < j; k++) toks.push({ s: para[k], start: base + k, end: base + k + 1, w: textW(para[k], size, bold) });
    } else {
      toks.push({ s, start: base + i, end: base + j, w });
    }
    i = j;
  }
  return toks;
}

// 返回 [{text, start, end, w}]，start/end 是原字符串里的下标，片段标记靠它定位。
export function wrap(str, maxW, size = T.size, bold = false) {
  const src = String(str);
  const out = [];
  let base = 0;
  for (const para of src.split('\n')) {
    let line = [];
    const width = () => line.reduce((a, t) => a + t.w, 0);
    const flush = () => {
      while (line.length && line[0].s === ' ') line.shift();
      while (line.length && line.at(-1).s === ' ') line.pop();
      if (line.length) {
        const start = line[0].start;
        const end = line.at(-1).end;
        out.push({ text: src.slice(start, end), start, end, w: width() });
      }
      line = [];
    };
    for (const t of tokenize(para, base, maxW, size, bold)) {
      if (line.length && width() + t.w > maxW) {
        const carry = [];
        if (NO_START.has(t.s) && line.length > 1) carry.unshift(line.pop());
        while (line.length > 1 && NO_END.has(line.at(-1).s)) carry.unshift(line.pop());
        flush();
        line = carry;
        // 带下来的字加上这个词仍然放不下时，让带下来的字单独成行
        if (line.length && width() + t.w > maxW) flush();
      }
      line.push(t);
    }
    // 末行只剩一个字时，从上一行带一个字下来
    const prev = out.at(-1);
    if (line.length === 1 && line[0].w <= size && prev && prev.end === line[0].start && prev.end - prev.start > 4) {
      const low = src.charCodeAt(prev.end - 1);
      const cut = prev.end - (low >= 0xdc00 && low <= 0xdfff ? 2 : 1);
      const moved = src.slice(cut, prev.end);
      if (!NO_END.has(src[cut - 1]) && !NO_START.has(moved) && !RUN.test(moved) && moved !== ' ') {
        const w = textW(moved, size, bold);
        out[out.length - 1] = { text: src.slice(prev.start, cut), start: prev.start, end: cut, w: prev.w - w };
        line.unshift({ s: moved, start: cut, end: prev.end, w });
      }
    }
    flush();
    if (para === '') out.push({ text: '', start: base, end: base, w: 0 });
    base += para.length + 1;
  }
  return out.length ? out : [{ text: '', start: 0, end: 0, w: 0 }];
}

export function measure(str, w, size = T.size, bold = false) {
  const lines = wrap(str, w, size, bold);
  return { lines, h: lines.length * lineH(size), w: Math.max(...lines.map((l) => l.w)) };
}

export const poly = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${r(x)} ${r(y)}`).join(' ');

const MARKERS = {
  solid: (id) => `<marker id="${id}" viewBox="0 0 8 8" refX="7.5" refY="4" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 7.5 4 0.5 7.2Z" fill="${T.edge}"/></marker>`,
  open: (id) => `<marker id="${id}" viewBox="0 0 8 8" refX="7.5" refY="4" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M1 1 7.5 4 1 7" fill="none" stroke="${T.edge}" stroke-width="1.25"/></marker>`,
};

export function canvas(scope) {
  need(/^[A-Za-z][A-Za-z0-9_-]*$/.test(scope ?? ''), 'scope', `scope 须是字母开头的 ID：${scope}`);
  const parts = [];
  const labels = [];
  const boxes = {};
  const used = new Set();
  const keys = new Set();
  const c = {
    scope,
    parts,
    labels,
    boxes,
    add(s) {
      parts.push(s);
    },
    open(a) {
      parts.push(`<g${attrs(a)}>`);
      return parts.length;
    },
    close() {
      parts.push('</g>');
    },
    insert(at, s) {
      parts.splice(at, 0, s);
    },
    // 实线表示已经成立，虚线表示尚未成立；arrow 只在关系有方向时画。
    path(pts, { dashed = false, arrow = false, color = T.edge, width = 1.25, data = {} } = {}) {
      let marker = null;
      if (arrow) {
        const kind = dashed ? 'open' : 'solid';
        used.add(kind);
        marker = `url(#${scope}-arrow-${kind})`;
      }
      parts.push(
        `<path${attrs({ d: typeof pts === 'string' ? pts : poly(pts), fill: 'none', stroke: color, 'stroke-width': width, 'stroke-dasharray': dashed ? '4 3' : null, 'marker-end': marker, ...data })}/>`,
      );
    },
    rect(b, a = {}) {
      parts.push(`<rect${attrs({ x: b.x, y: b.y, width: b.w, height: b.h, rx: 4, fill: T.paper, stroke: T.line, 'stroke-width': 1, ...a })}/>`);
    },
    dot(x, y, a = {}) {
      parts.push(`<circle${attrs({ cx: x, cy: y, r: 2.5, fill: T.edge, ...a })}/>`);
    },
    // 一个标签一个 <text>，一行一个 <tspan>。marks 给出要单独标出的片段。
    label(key, str, { x, y, w, size = T.size, weight = null, fill = T.ink, marks = [], anchor = null }) {
      need(!keys.has(key), 'duplicate-id', `两段文字用了同一个键 ${key}；对象、关系和限定语的 id 不能互相重复`);
      keys.add(key);
      const bold = weight >= 600;
      const LH = lineH(size);
      const src = String(str);
      const lines = wrap(src, w, size, bold);
      const base = (i) => r(y + i * LH + (LH + size * 0.7) / 2);
      const piece = (ln) => {
        let out = '';
        let p = ln.start;
        for (const mk of marks) {
          const a = Math.max(mk.start, ln.start);
          const b = Math.min(mk.end, ln.end);
          if (a >= b) continue;
          out += `${esc(src.slice(p, a))}<tspan${attrs(mk.attrs)}>${esc(src.slice(a, b))}</tspan>`;
          p = b;
        }
        return out + esc(src.slice(p, ln.end));
      };
      const body =
        lines.length === 1 ? piece(lines[0]) : lines.map((ln, i) => `<tspan x="${r(x)}" y="${base(i)}">${piece(ln)}</tspan>`).join('');
      parts.push(
        `<text${attrs({ x, y: base(0), 'font-size': size, 'font-weight': weight, fill, 'text-anchor': anchor, 'data-text': key })}>${body}</text>`,
      );
      const maxW = Math.max(...lines.map((l) => l.w));
      labels.push({ key, x: r(anchor === 'middle' ? x - maxW / 2 : x), y: r(y), w: r(maxW), h: lines.length * LH, budget: r(w) });
      return { h: lines.length * LH, lines, LH };
    },
    box(objectId, b) {
      need(!(objectId in boxes), 'duplicate-id', `id ${objectId} 被两个对象使用`);
      boxes[objectId] = { x: r(b.x), y: r(b.y), w: r(b.w), h: r(b.h) };
    },
    defs() {
      if (!used.size) return '';
      return `<defs>${[...used].map((k) => MARKERS[k](`${scope}-arrow-${k}`)).join('')}</defs>\n`;
    },
  };
  return c;
}

// width 是外宽；各件在内宽 width - 2*PAD 里排，描边不被 viewBox 裁掉。
export function finish(c, { asset, width, height, title, desc, data = {} }) {
  need(typeof title === 'string' && title.trim(), 'title', '缺少 title：每张图要有一个短名称');
  const W = Math.ceil(width);
  const H = Math.ceil(height) + 2 * PAD;
  const s = c.scope;
  const head = attrs({
    xmlns: 'http://www.w3.org/2000/svg',
    id: s,
    viewBox: `${-PAD} ${-PAD} ${W} ${H}`,
    width: W,
    height: H,
    role: 'img',
    'aria-labelledby': `${s}-title ${s}-desc`,
    lang: 'zh-Hans',
    'xml:lang': 'zh-Hans',
    'font-family': T.font,
    'data-asset': asset,
    'data-asset-version': VERSION,
    ...data,
  });
  return {
    svg: `<svg${head}>\n<title id="${s}-title">${esc(title)}</title>\n<desc id="${s}-desc">${esc(desc)}</desc>\n${c.defs()}${c.parts.join('\n')}\n</svg>\n`,
    width: W,
    height: H,
    boxes: c.boxes,
    labels: c.labels,
  };
}
