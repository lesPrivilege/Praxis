// rel-rail：几项内容沿一条线排开。输入必须写明位置表示什么，图脚把它写成一句话。
//   list   行的次序没有含义。可以带上下级（parent，缩进表示什么须写明），或并排的栏（lanes，同一行说的是同一项）
//   order  自上而下只表示先后，间距不表示时长
//   time   按时间比例排在标尺上；时刻、区间、截止分开画，几栏各有一条轨、按同一条标尺排
// 通线只在位置表示先后或时间时画；次序没有含义的清单没有通线。

import { T, PAD, anchor, anchorText, attrs, canvas, finish, lineH, measure, need, needId, r, textW } from './kernel.mjs';
import { LEGEND, standing, who } from './standing.mjs';

const INDENT = 18;
const LH = lineH(T.size);
const SH = lineH(T.small);
const MAX_ROWS = 12;
const MAX_DEPTH = 5;
const STATES = ['established', 'recorded', 'decided', 'pending', 'proposed', 'rejected', 'open'];

// 位置的读法。画出来的每一句都由输入得出，没有用到的不写。
export const READING = {
  list: '行的次序没有含义。',
  siblings: '同级之间的次序没有含义。',
  lanes: '同一行的几栏说的是同一项；行的次序没有含义。',
  order: '自上而下是先后次序；间距不表示时长。',
  flat: '各项都在顶层，没有上下级；次序没有含义。',
  single: '自上而下是版本先后；间距不表示时长。',
  own: '每条线自上而下是它自己的版本先后。间距不表示时长；不同的线之间，位置不表示谁先谁后。',
  shared: '各栏的轨按同一条标尺排，标尺上同一高度是同一时刻。',
  short: '很短的区间画成最短的一小段，长短以它旁边的文字为准。',
  moved: '文字挤在一起时上下让开，由引线接回它在标尺上的位置。',
  open: '结束时间未知的区间只画出起点，尖端的长短不表示时长。',
  offsets: '写着别的偏移的时刻，括号里是它在标尺上的时刻。',
};

// 一条通线和线上的刻度点
export function spine(c, at, x, ticks) {
  const dots = ticks.map((t) => `<circle cx="${r(x)}" cy="${r(t.y)}" r="5" fill="${t.filled ? T.ink : T.paper}" stroke="${T.ink}" stroke-width="1.5"/>`).join('');
  c.insert(at, `<path d="M${r(x)} ${r(ticks[0].y)}V${r(ticks.at(-1).y)}" fill="none" stroke="${T.ink}" stroke-width="1.5"/>${dots}`);
}

// ---------- 时间 ----------

const ISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(Z|[+-]\d{2}:\d{2})$/;
const offsetOf = (s, what) => {
  need(typeof s === 'string' && /^(Z|[+-]\d{2}:\d{2})$/.test(s), 'offset', `${what}须写成 Z 或 ±hh:mm：${JSON.stringify(s)}`);
  if (s === 'Z') return 0;
  const hh = Number(s.slice(1, 3));
  const mm = Number(s.slice(4));
  need(hh <= 14 && mm <= 59, 'offset', `${what}不是一个存在的偏移：${s}`);
  return (s[0] === '-' ? -1 : 1) * (hh * 60 + mm);
};
function instant(s, what) {
  const m = typeof s === 'string' ? s.match(ISO) : null;
  need(m, 'time', `${what}须写成带偏移的时刻，例如 2026-10-06T09:10+08:00；没有偏移就不知道它在标尺上的位置：${JSON.stringify(s)}`);
  const [y, mo, d, h, mi, se] = m.slice(1, 7).map((x) => Number(x ?? 0));
  const off = offsetOf(m[7], what);
  const local = Date.UTC(y, mo - 1, d, h, mi, se);
  const back = new Date(local);
  // 4 月 31 日、24:00 这类写法会被悄悄挪到别的日子，这里拒掉
  need(h <= 23 && mi <= 59 && se <= 59 && back.getUTCMonth() === mo - 1 && back.getUTCDate() === d, 'time', `${what}不是一个存在的时刻：${s}`);
  return { ms: local - off * 60000, off };
}
const two = (n) => String(n).padStart(2, '0');
const offsetName = (off) => (off === 0 ? 'UTC' : `UTC${off < 0 ? '-' : '+'}${two(Math.floor(Math.abs(off) / 60))}:${two(Math.abs(off) % 60)}`);
// sec：有哪一行写了秒，所有时刻就都写到秒，文字不比位置粗
const clock = (ms, off, sec = false) => {
  const d = new Date(ms + off * 60000);
  const date = `${two(d.getUTCMonth() + 1)}-${two(d.getUTCDate())}`;
  return { date, full: `${d.getUTCFullYear()}-${date}`, time: `${two(d.getUTCHours())}:${two(d.getUTCMinutes())}${sec ? `:${two(d.getUTCSeconds())}` : ''}`, day: Math.floor((ms + off * 60000) / 86400000) };
};
export function span(ms) {
  const s = Math.round(ms / 1000);
  const parts = [[Math.floor(s / 86400), '天'], [Math.floor((s % 86400) / 3600), '小时'], [Math.floor((s % 3600) / 60), '分钟'], [s % 60, '秒']];
  return parts.filter(([n]) => n).map(([n, u]) => `${n} ${u}`).join(' ') || '0 秒';
}
const STEPS = [1, 5, 10, 15, 30, 60, 120, 180, 360, 720, 1440, 2880, 10080];

function timeModel(m, lanes) {
  const laneOf = new Map(lanes.map((ln) => [ln.id, ln]));
  const rows = m.rows.map((row, i) => {
    const a = instant(row.at, `行 ${row.id} 的 at `);
    // 没有 until 是一个时刻；until 写成 null 是结束时间未知的区间
    const end = !('until' in row) ? undefined : row.until === null ? null : instant(row.until, `行 ${row.id} 的 until `);
    need(!end || end.ms >= a.ms, 'time', `行 ${row.id} 的结束早于开始`);
    need(row.kind == null || (row.kind === 'deadline' && end === undefined), 'time', `行 ${row.id}：kind 只能是 deadline；截止是一个时刻，不带 until`);
    need(lanes.length ? laneOf.has(row.lane) : row.lane == null, 'lane', `行 ${row.id} 的 lane 不在 lanes 里`);
    return { ...row, i, a, end, st: row.state == null ? null : standing(row.state, STATES, `行 ${row.id} `), by: row.origin == null ? null : who(row.origin, `行 ${row.id} `), basis: row.basis == null ? null : anchor(row.basis, `行 ${row.id} 的依据`) };
  });
  // 按时刻排，不按字符串排；同一时刻的保持输入次序
  rows.sort((p, q) => p.a.ms - q.a.ms || p.i - q.i);
  const offs = new Set(rows.flatMap((row) => [row.a.off, ...(row.end ? [row.end.off] : [])]));
  need(m.scale.offset != null || offs.size === 1, 'offset', '各行的偏移不一样，须在 scale.offset 里写明标尺按哪个偏移');
  const off = m.scale.offset != null ? offsetOf(m.scale.offset, 'scale.offset ') : [...offs][0];
  const lo = rows[0].a.ms;
  const hi = Math.max(...rows.map((row) => row.end?.ms ?? row.a.ms));
  const step = STEPS.find((s) => (hi - lo) / 60000 / s <= 8);
  need(step, 'capacity', '时间跨度超过已测试的八周；拆成几段，或改成只表示先后的 order');
  const S = step * 60000;
  const shift = off * 60000;
  const t0 = Math.floor((lo + shift) / S) * S - shift;
  const t1 = Math.max(Math.ceil((hi + shift) / S) * S - shift, t0 + S);
  const multiDay = clock(t0, off).day !== clock(t1, off).day;
  const sec = rows.some((row) => row.a.ms % 60000 || (row.end && row.end.ms % 60000));
  // short：区间的结束和开始在同一天时，不重复写日期
  const at = (t, short = false) => {
    const k = clock(t.ms, off, sec);
    const here = `${multiDay && !short ? `${k.date} ` : ''}${k.time}`;
    if (t.off === off) return here;
    return `${clock(t.ms, t.off, sec).time} ${offsetName(t.off)}（标尺 ${here}）`;
  };
  const sameDay = (row) => clock(row.a.ms, off).day === clock(row.end.ms, off).day;
  for (const row of rows) {
    row.when =
      row.end === undefined
        ? `${row.kind === 'deadline' ? '截止 ' : ''}${at(row.a)}`
        : row.end === null
          ? `${at(row.a)} 起 · 结束时间未知`
          : row.end.ms === row.a.ms
            ? `${at(row.a)} · 起止相同`
            : `${at(row.a)}–${at(row.end, sameDay(row))} · ${span(row.end.ms - row.a.ms)}`;
  }
  const ticks = [];
  for (let t = t0; t <= t1; t += S) {
    const k = clock(t, off);
    ticks.push({ ms: t, label: step >= 1440 || (multiDay && k.time === '00:00' && t !== t0) ? k.date : k.time });
  }
  const k0 = clock(t0, off);
  return { rows, off, step, t0, t1, ticks, multiDay, mixed: offs.size > 1 || !offs.has(off), date0: k0.date, from: `${k0.full} ${k0.time}` };
}

// 一行的正文：名称、正文、小字说明、依据
const bodyParts = (row) => [
  ['label', row.label, T.size, 600, T.ink],
  ['text', row.text, T.size, null, T.ink],
  ['note', row.note, T.small, null, T.sub],
  ['basis', row.basis && `依据：${anchorText(row.basis)}`, T.small, null, T.sub],
].filter((p) => p[1]);
const bodyH = (row, w, strong = true) => bodyParts(row).reduce((h, [key, str, size, weight]) => h + measure(str, w, size, key === 'label' ? strong : weight >= 600).h, 0);
function body(c, row, x, y, w, strong = true, quiet = false) {
  let cy = y;
  for (const [key, str, size, weight, fill] of bodyParts(row)) {
    cy += c.label(`${row.id}.${key}`, str, { x, y: cy, w, size, weight: key === 'label' ? (strong ? 600 : null) : weight, fill }).h;
    if (key === 'basis') c.mention(row.id, row.basis, `${row.id}.basis`, quiet);
  }
  return cy;
}
// 生成器自己的属性在前；输入里的 data-* 只能添，不能盖掉它们
const rowAttrs = (row, own) => ({ ...own, ...Object.fromEntries(Object.entries(row.data ?? {}).filter(([k]) => !(k in own))) });

function drawTime(c, m, W, lanes) {
  const tm = timeModel(m, lanes);
  const columns = lanes.length > 1 && W >= 520;
  const groups = columns ? lanes.map((ln) => ({ lane: ln, rows: tm.rows.filter((row) => row.lane === ln.id) })) : [{ lane: null, rows: tm.rows }];
  const laneLabel = new Map(lanes.map((ln) => [ln.id, ln.label]));
  const head = (row) => [row.when, !columns && row.lane != null && laneLabel.get(row.lane), row.by, row.st?.word].filter(Boolean).join(' · ');

  const gutter = Math.ceil(Math.max(...tm.ticks.map((t) => textW(t.label, T.small)), tm.multiDay ? textW(tm.date0, T.small) : 0)) + 8;
  const colW = (W - gutter - 16 * (groups.length - 1)) / groups.length;
  const showDate = tm.multiDay && tm.step < 1440;
  // 栏名可能折行：标尺从最高的栏名下面开始
  const headH = Math.max(showDate ? SH : 0, ...(columns ? lanes.map((ln) => measure(ln.label, colW, T.small, true).h) : [0]));
  const top = headH ? headH + 12 : SH / 2;

  // 重叠的区间错开到并排的小栏里
  for (const g of groups) {
    const busy = [];
    for (const row of g.rows) {
      if (row.end === undefined) continue;
      // 首尾相接的两个区间也错开，免得并成一条
      const k = busy.findIndex((until) => until < row.a.ms);
      row.col = k < 0 ? busy.length : k;
      busy[row.col] = row.end === null ? Infinity : row.end.ms;
    }
    g.cols = busy.length;
    need(g.cols <= 3, 'capacity', '同一时刻重叠的区间超过已测试的 3 个；分到几栏里，或拆成两张');
    g.x = gutter + (colW + 16) * groups.indexOf(g);
    g.rail = g.x + 6;
    g.lead = g.rail + (g.cols ? 6 + g.cols * 8 : 8) + 2;
    g.tx = g.lead + 16 + 12;
    g.tw = g.x + colW - g.tx;
    for (const row of g.rows) row.h = measure(head(row), g.tw, T.small, true).h + bodyH(row, g.tw, false);
  }
  const L = Math.max(160, (tm.ticks.length - 1) * 24, ...groups.map((g) => g.rows.reduce((h, row) => h + row.h + 8, -8)));
  const Y = (ms) => top + ((ms - tm.t0) / (tm.t1 - tm.t0)) * L;

  let height = top + L + SH / 2;
  const positions = Object.create(null);
  let short = false;
  if (showDate) c.label('axis#date', tm.date0, { x: 0, y: headH - SH, w: gutter, size: T.small, fill: T.sub });
  tm.ticks.forEach((t, i) => c.label(`axis#${i}`, t.label, { x: 0, y: Y(t.ms) - SH / 2, w: gutter, size: T.small, fill: T.sub }));

  for (const g of groups) {
    c.open({ 'data-role': 'rail', 'data-lane': g.lane?.id });
    if (g.lane) c.label(`${g.lane.id}.lane`, g.lane.label, { x: g.x, y: 0, w: colW, size: T.small, weight: 600, fill: T.sub });
    // 行尽量贴着自己的时刻；挤在一起时上下让开，引线把行接回标尺
    let prev = -Infinity;
    for (const row of g.rows) {
      row.ty = Y(row.a.ms);
      row.y = Math.max(row.ty - SH / 2, prev);
      prev = row.y + row.h + 8;
    }
    let cap = top + L - SH / 2;
    for (let i = g.rows.length - 1; i >= 0; i--) {
      const row = g.rows[i];
      row.y = Math.min(row.y, Math.max(cap, 0));
      cap = row.y - 8 - (g.rows[i - 1]?.h ?? 0);
    }
    for (const row of g.rows) {
      const ry = row.y + SH / 2;
      const ax = row.end === undefined ? g.rail + 4.5 : g.rail + 6 + row.col * 8 + 5;
      const pts = Math.abs(ry - row.ty) < 0.5 ? [[ax, row.ty], [g.tx - 10, ry]] : [[ax, row.ty], [g.lead, row.ty], [g.lead + 16, ry], [g.tx - 10, ry]];
      c.path(pts, { st: row.st, color: T.line, width: 1, data: { 'data-leader-for': row.id } });
    }
    c.add(`<path${attrs({ d: `M${r(g.rail)} ${r(top)}V${r(top + L)}`, fill: 'none', stroke: T.ink, 'stroke-width': 1.5 })}/>`);
    for (const t of tm.ticks) c.add(`<path${attrs({ d: `M${r(g.rail - 4)} ${r(Y(t.ms))}H${r(g.rail)}`, fill: 'none', stroke: T.line, 'stroke-width': 1, 'data-tick-ms': String(t.ms) })}/>`);
    for (const row of g.rows) {
      const y = row.ty;
      if (row.end === undefined && row.kind === 'deadline') {
        c.add(`<path${attrs({ d: `M${r(g.rail - 7)} ${r(y)}H${r(g.rail + 3.5)}`, fill: 'none', stroke: T.ink, 'stroke-width': 2.5, 'data-mark-for': row.id, 'data-shape': 'deadline', 'data-at-ms': String(row.a.ms) })}/>`);
      } else if (row.end === undefined) {
        c.add(`<circle${attrs({ cx: g.rail, cy: y, r: 3.5, fill: T.ink, 'data-mark-for': row.id, 'data-shape': 'point', 'data-at-ms': String(row.a.ms) })}/>`);
      } else {
        const bx = g.rail + 6 + row.col * 8;
        if (row.end === null) {
          // 结束时间未知：只画一小段定长的起点，尖端向下，不延伸到任何时刻
          c.add(`<path${attrs({ d: `M${r(bx)} ${r(y)}H${r(bx + 5)}V${r(y + 10)}L${r(bx + 2.5)} ${r(y + 22)}L${r(bx)} ${r(y + 10)}Z`, fill: T.edge, 'data-mark-for': row.id, 'data-shape': 'open-interval', 'data-at-ms': String(row.a.ms) })}/>`);
          height = Math.max(height, y + 24);
        } else {
          // 条从它的开始时刻画起；短到看不见时留 3 的最小高度，并在读法里说明。纸色的描边让挨着的两条分得开
          const h = Math.max(3, Y(row.end.ms) - y);
          if (Y(row.end.ms) - y < 3) short = true;
          c.add(`<rect${attrs({ x: bx, y, width: 5, height: h, fill: T.edge, stroke: T.paper, 'stroke-width': 1, 'data-mark-for': row.id, 'data-shape': 'interval', 'data-at-ms': String(row.a.ms), 'data-until-ms': String(row.end.ms) })}/>`);
        }
      }
      positions[row.id] = { y: r(y), y2: row.end ? r(Y(row.end.ms)) : null, lane: g.lane?.id ?? null };
    }
    for (const row of g.rows) {
      c.open(rowAttrs(row, { 'data-row-id': row.id, 'data-role': 'row', 'data-at': row.at, 'data-until': row.until === null ? 'unknown' : row.until, 'data-kind': row.end === undefined ? (row.kind ?? 'point') : 'interval', 'data-lane': row.lane, 'data-state': row.state, 'data-origin': row.origin }));
      if (row.st) c.end(g.tx - 6, row.y + SH / 2, row.st);
      const hh = c.label(`${row.id}.when`, head(row), { x: g.tx, y: row.y, w: g.tw, size: T.small, weight: 600, fill: row.st?.accent ? T.accent : T.sub }).h;
      // 时间图里的依据只留作文字：组合时从留白拉过来的横线会穿过标尺，被读成一个刻度
      const bottom = body(c, row, g.tx, row.y + hh, g.tw, false, true);
      c.close();
      c.box(row.id, { x: g.tx, y: row.y, w: g.tw, h: bottom - row.y });
      height = Math.max(height, bottom);
    }
    c.close();
  }

  const reading = [
    `标尺按时间比例，每格 ${span(tm.step * 60000)}，从 ${tm.from} 起；时刻按 ${offsetName(tm.off)} 写。`,
    short && READING.short,
    tm.rows.some((row) => Math.abs(row.y + SH / 2 - row.ty) > 0.5) && READING.moved,
    columns && READING.shared,
    tm.rows.some((row) => row.end === null) && READING.open,
    tm.mixed && READING.offsets,
  ].filter(Boolean);
  const all = lanes.length ? (row) => ` · ${laneLabel.get(row.lane)}` : () => '';
  const items = tm.rows.map((row) => `${[row.when + all(row), row.by, row.st?.word].filter(Boolean).join(' · ')}，${rowText(row)}`);
  const kinds = [['时刻', (row) => row.end === undefined && row.kind !== 'deadline'], ['区间', (row) => row.end !== undefined], ['截止', (row) => row.kind === 'deadline']].map(([w, f]) => [w, tm.rows.filter(f).length]).filter(([, n]) => n);
  const summary = `${kinds.map(([w, n]) => `${n} 个${w}`).join('、')}，按时间比例排在${lanes.length > 1 ? ` ${lanes.length} 栏共用的` : ''}一条标尺上，标尺从 ${tm.from}（${offsetName(tm.off)}）起。`;
  return { height, reading, items, summary, positions, layout: columns ? 'columns' : 'merged', whens: tm.rows.map((row) => ({ id: row.id, when: row.when })), axis: { t0: tm.t0, t1: tm.t1, step: tm.step, offset: tm.off, y0: r(top), length: r(L) } };
}

const stop = (t) => (/[。！？]$/.test(t) ? t : `${t}。`);
const rowText = (row) => [row.text ? `${row.label}：${stop(row.text)}` : row.label, row.note && `（${row.note}）`, row.basis && `${row.text ? '' : '；'}依据：${anchorText(row.basis)}`].filter(Boolean).join('');

// ---------- 先后 ----------

function drawOrder(c, m, W) {
  const rows = m.rows.map((row) => ({ ...row, basis: row.basis == null ? null : anchor(row.basis, `行 ${row.id} 的依据`) }));
  const nx = 20;
  const tx = nx + Math.ceil(textW(`${rows.length}.`, T.size, true)) + 6;
  const at = c.parts.length;
  const ticks = [];
  const positions = Object.create(null);
  let y = 0;
  rows.forEach((row, i) => {
    c.open(rowAttrs(row, { 'data-row-id': row.id, 'data-role': 'row', 'data-position': String(i + 1), 'data-set-size': String(rows.length) }));
    ticks.push({ y: y + LH / 2 });
    c.label(`${row.id}.n`, `${i + 1}.`, { x: nx, y, w: tx - nx, weight: 600, fill: T.sub });
    const bottom = body(c, row, tx, y, W - tx);
    c.close();
    c.box(row.id, { x: tx, y, w: W - tx, h: bottom - y });
    positions[row.id] = { y: r(y + LH / 2) };
    y = bottom + 12;
  });
  spine(c, at, 6, ticks);
  return { height: y - 12, reading: [READING.order], items: rows.map((row, i) => `${i + 1}. ${rowText(row)}`), summary: `${rows.length} 项按先后排列，只表示次序。`, positions };
}

// ---------- 清单与上下级 ----------

function treeOf(m) {
  const rows = m.rows;
  const byId = new Map(rows.map((row) => [row.id, row]));
  if (!rows.some((row) => row.parent != null || 'parents' in row) && m.scale.depth == null) return null;
  need(typeof m.scale.depth === 'string' && m.scale.depth.trim(), 'no-depth-meaning', '行有上下级，却没有在 scale.depth 里写明缩进表示什么（隶属、包含、汇报……）');
  const depth = new Map();
  for (const row of rows) {
    need(!('parents' in row), 'multi-parent', `行 ${row.id} 有不止一个上级；多个上级不是一棵树，改用关系图`);
    need(row.parent == null || byId.has(row.parent), 'unknown-parent', `行 ${row.id} 的上级 ${row.parent} 不存在`);
  }
  for (const row of rows) {
    const seen = new Set();
    let d = 0;
    for (let p = row; p.parent != null; p = byId.get(p.parent), d++) {
      need(!seen.has(p.id), 'cycle', `行 ${row.id} 的上下级成环`);
      seen.add(p.id);
    }
    need(d < MAX_DEPTH, 'capacity', `行 ${row.id} 在第 ${d + 1} 层，超过已测试的 ${MAX_DEPTH} 层`);
    depth.set(row.id, d);
  }
  const kids = (pid) => rows.filter((row) => (row.parent ?? null) === pid);
  const walk = (pid) => kids(pid).flatMap((row) => [row, ...walk(row.id)]);
  const path = (row) => (row.parent == null ? [row.label] : [...path(byId.get(row.parent)), row.label]);
  return { order: walk(null), depth, kids, path };
}

function drawList(c, m, W) {
  const tree = treeOf(m);
  const rows = (tree?.order ?? m.rows).map((row) => ({ ...row, basis: row.basis == null ? null : anchor(row.basis, `行 ${row.id} 的依据`) }));
  const dots = new Map();
  const at = c.parts.length;
  const positions = Object.create(null);
  const flat = tree && !rows.some((row) => row.parent != null);
  let y = 0;
  for (const row of rows) {
    const d = tree?.depth.get(row.id) ?? 0;
    const dx = 4 + d * INDENT;
    const tx = dx + 12;
    c.open(rowAttrs(row, { 'data-row-id': row.id, 'data-role': 'row', 'data-parent': row.parent, 'data-level': tree ? String(d + 1) : null }));
    c.add(`<circle${attrs({ cx: dx, cy: y + LH / 2, r: 2.5, fill: T.ink })}/>`);
    let bottom = body(c, row, tx, y, W - tx, !tree || d === 0);
    if (tree && row.parent == null && !tree.kids(row.id).length) bottom += c.label(`${row.id}.leaf`, '没有下级', { x: tx, y: bottom, w: W - tx, size: T.small, fill: T.sub }).h;
    c.close();
    c.box(row.id, { x: tx, y, w: W - tx, h: bottom - y });
    dots.set(row.id, { x: dx, y: y + LH / 2 });
    positions[row.id] = { x: dx, y: r(y + LH / 2), level: d + 1 };
    y = bottom + 10;
  }
  // 上下级的连线从上级的点垂下来，拐到下级的点
  const links = rows.filter((row) => row.parent != null).map((row) => {
    const p = dots.get(row.parent);
    const k = dots.get(row.id);
    return `<path${attrs({ d: `M${r(p.x)} ${r(p.y + 2.5)}V${r(k.y)}H${r(k.x - 2.5)}`, fill: 'none', stroke: T.line, 'stroke-width': 1, 'data-child': row.id, 'data-parent': row.parent })}/>`;
  });
  if (links.length) c.insert(at, links.join(''));
  const levels = tree ? Math.max(...tree.depth.values()) + 1 : 1;
  return {
    height: y - 10,
    reading: flat ? [READING.flat] : tree ? [`缩进表示：${m.scale.depth}。`, READING.siblings] : [READING.list],
    items: rows.map((row) => (tree ? `${tree.path(row).slice(0, -1).map((s) => `${s} › `).join('')}${rowText(row)}` : rowText(row))),
    summary: tree ? `${rows.length} 项，${levels} 层；每一项的上级写在它前面。` : `${rows.length} 项，次序没有含义。`,
    positions,
  };
}

// ---------- 并排的栏 ----------

function cell(c, key, cl, x, y, w) {
  const dx = cl.st ? 13 : 0;
  if (cl.st) c.end(x + 4, y + LH / 2, cl.st);
  let cy = y + c.label(key, cl.text, { x: x + dx, y, w: w - dx, fill: cl.st?.accent ? T.accent : cl.tone === 'sub' ? T.sub : T.ink }).h;
  if (cl.sub) cy += c.label(`${key}.sub`, cl.sub, { x: x + dx, y: cy, w: w - dx, size: T.small, fill: T.sub }).h;
  return cy;
}

function drawLanes(c, m, W, lanes) {
  const cols = lanes.map((ln) => ({ ...ln, ref: ln.ref == null ? null : anchor(ln.ref, `栏 ${ln.id} 的指向`) }));
  const rows = m.rows.map((row) => {
    need(row.cells && typeof row.cells === 'object' && Object.keys(row.cells).every((k) => cols.some((ln) => ln.id === k)), 'lane', `行 ${row.id} 的 cells 里有 lanes 没有的栏`);
    const cells = cols.map((ln) => {
      const cl = row.cells[ln.id];
      // 空着的格子会被读成“没有”或“一样”，所以每一格都要有字
      need(cl && typeof cl.text === 'string' && cl.text.trim(), 'empty-cell', `行 ${row.id} 在“${ln.label}”一栏是空的；没有对应的内容也要写明`);
      return { ...cl, st: cl.state == null ? null : standing(cl.state, STATES, `行 ${row.id} 的“${ln.label}”`) };
    });
    return { ...row, cells };
  });
  const wide = W >= 520;
  const rule = (y) => c.add(`<path${attrs({ d: `M0 ${r(y)}H${r(W)}`, fill: 'none', stroke: T.faint, 'stroke-width': 1 })}/>`);
  const positions = Object.create(null);
  let y = 0;
  if (wide) {
    const gap = 16;
    const lw = Math.round(W * 0.2);
    const cw = (W - lw - gap * cols.length) / cols.length;
    const cx = (k) => lw + gap + k * (cw + gap);
    let hb = 0;
    cols.forEach((ln, k) => {
      let cy = c.label(`${ln.id}.lane`, ln.label, { x: cx(k), y: 0, w: cw, size: T.small, weight: 600, fill: T.sub }).h;
      if (ln.ref) {
        cy += c.label(`${ln.id}.ref`, anchorText(ln.ref), { x: cx(k), y: cy, w: cw, size: T.small, fill: T.sub }).h;
        c.mention(ln.id, ln.ref, `${ln.id}.ref`);
      }
      hb = Math.max(hb, cy);
    });
    y = hb + 6;
    for (const row of rows) {
      rule(y);
      y += 7;
      c.open(rowAttrs(row, { 'data-row-id': row.id, 'data-role': 'row' }));
      let bottom = y + c.label(`${row.id}.label`, row.label, { x: 0, y, w: lw, weight: 600 }).h;
      if (row.note) bottom += c.label(`${row.id}.note`, row.note, { x: 0, y: bottom, w: lw, size: T.small, fill: T.sub }).h;
      row.cells.forEach((cl, k) => {
        bottom = Math.max(bottom, cell(c, `${row.id}.${cols[k].id}`, cl, cx(k), y, cw));
      });
      c.close();
      c.box(row.id, { x: 0, y, w: W, h: bottom - y });
      positions[row.id] = { y: r(y) };
      y = bottom + 7;
    }
    y -= 7;
  } else {
    const lw = Math.min(96, Math.ceil(Math.max(...cols.map((ln) => textW(ln.label, T.small))))) + 10;
    for (const ln of cols.filter((k) => k.ref)) {
      y += c.label(`${ln.id}.ref`, `${ln.label}：${anchorText(ln.ref)}`, { x: 0, y, w: W, size: T.small, fill: T.sub }).h;
      c.mention(ln.id, ln.ref, `${ln.id}.ref`);
    }
    if (y) y += 6;
    for (const row of rows) {
      if (y) {
        rule(y);
        y += 7;
      }
      const start = y;
      c.open(rowAttrs(row, { 'data-row-id': row.id, 'data-role': 'row' }));
      y += c.label(`${row.id}.label`, row.label, { x: 0, y, w: W, weight: 600 }).h;
      if (row.note) y += c.label(`${row.id}.note`, row.note, { x: 0, y, w: W, size: T.small, fill: T.sub }).h;
      row.cells.forEach((cl, k) => {
        y += 2;
        c.label(`${row.id}.${cols[k].id}.lane`, cols[k].label, { x: 0, y: y + 1.5, w: lw - 10, size: T.small, fill: T.sub });
        y = Math.max(cell(c, `${row.id}.${cols[k].id}`, cl, lw, y, W - lw), y + 1.5 + measure(cols[k].label, lw - 10, T.small).h);
      });
      c.close();
      c.box(row.id, { x: 0, y: start, w: W, h: y - start });
      positions[row.id] = { y: r(start) };
      y += 7;
    }
    y -= 7;
  }
  return {
    height: y,
    layout: wide ? 'columns' : 'stacked',
    reading: [READING.lanes],
    items: rows.map((row) => `${row.label}。${row.cells.map((cl, k) => `${cols[k].label}：${cl.text}${cl.sub ? `（${cl.sub}）` : ''}`).join('；')}`),
    summary: `${rows.length} 行、${cols.length} 栏，同一行说的是同一项。`,
    positions,
  };
}

// ---------- 入口 ----------

function resolve(m) {
  need(m && typeof m === 'object' && !Array.isArray(m), 'model', '输入须是一个对象');
  const kind = m.scale?.kind;
  need(['list', 'order', 'time'].includes(kind), 'scale', 'scale.kind 须写明位置表示什么：list（次序没有含义）、order（只表示先后）或 time（按时间比例）');
  need(m.scale.depth == null || typeof m.scale.depth === 'string', 'scale', 'scale.depth 须是一句话');
  need(m.scale.note == null || typeof m.scale.note === 'string', 'scale', 'scale.note 须是一句话');
  need(Array.isArray(m.rows) && m.rows.length, 'rows', '至少要有一行');
  need(m.rows.length <= MAX_ROWS, 'capacity', `共 ${m.rows.length} 行，超过已测试的 ${MAX_ROWS} 行；先分组，或改用表格`);
  const lanes = m.lanes ?? [];
  need(Array.isArray(lanes), 'lane', 'lanes 须是一个列表');
  need(lanes.length <= 3, 'capacity', `共 ${lanes.length} 栏，超过已测试的 3 栏`);
  need(kind !== 'order' || !lanes.length, 'scale', 'order 只有一栏；要并排对照，用 list 或 time');
  const seen = new Set();
  for (const ln of lanes) {
    needId(ln?.id, '栏');
    need(typeof ln.label === 'string' && ln.label.trim() && !seen.has(ln.id), 'lane', `栏 ${ln.id} 没有 label，或者重复`);
    seen.add(ln.id);
  }
  const cells = kind === 'list' && lanes.length > 0;
  for (const row of m.rows) {
    needId(row?.id, '行');
    need(!seen.has(row.id), 'duplicate-id', `行 ${row.id} 与别的行或栏重名`);
    seen.add(row.id);
    need(typeof row.label === 'string' && row.label.trim(), 'row', `行 ${row.id} 没有 label`);
    for (const key of ['text', 'note']) need(row[key] == null || (typeof row[key] === 'string' && row[key].trim()), 'row', `行 ${row.id} 的 ${key} 须是非空的文字`);
    need(Object.keys(row.data ?? {}).every((k) => /^data-[a-z][a-z0-9-]*$/.test(k)), 'data', `行 ${row.id} 的 data 只能放 data-* 属性`);
    need(kind === 'time' || !('at' in row || 'until' in row), 'scale', `行 ${row.id} 写了时刻，位置却不按时间比例；把 scale.kind 改成 time，或把时刻写进文字`);
    need(kind === 'list' || !('parent' in row || 'parents' in row), 'scale', `行 ${row.id} 写了上级；上下级只用在 list 上`);
    need(kind === 'time' || (row.state == null && row.origin == null), 'scale', `行 ${row.id} 写了 state 或 origin；成立程度目前只画在 time 的行和 list 的格子里`);
    need(!lanes.length || kind === 'time' || !('parent' in row || 'parents' in row), 'scale', `行 ${row.id}：上下级和并排的栏不能同时用`);
    // 写了却画不出来的字段不悄悄丢掉
    need(cells || !('cells' in row), 'unsupported', `行 ${row.id} 写了 cells，但这张图没有并排的栏（list 加 lanes 才有）`);
    need(lanes.length || !('lane' in row), 'unsupported', `行 ${row.id} 写了 lane，但这张图没有 lanes`);
    need(!cells || !('text' in row || 'basis' in row), 'unsupported', `行 ${row.id}：并排的栏里，内容写进各栏的格子；行本身只有 label 和 note`);
  }
  return { kind, lanes };
}

// meta 给在这之上再加一层语义的件用（rel-pair）：换 asset 名、摘要，追加读法和说明
export function compose(model, { width = 672, scope, legend = true } = {}, meta = {}) {
  const m = model;
  const { kind, lanes } = resolve(m);
  const W = width - 2 * PAD;
  const c = canvas(scope);
  const out = kind === 'time' ? drawTime(c, m, W, lanes) : lanes.length ? drawLanes(c, m, W, lanes) : kind === 'order' ? drawOrder(c, m, W) : drawList(c, m, W);
  let height = out.height + 12;
  const reading = [...out.reading, ...(meta.reading ?? []), m.scale.note].filter(Boolean).join('');
  c.open({ 'data-role': 'scale-note' });
  height += c.label('scale#note', reading, { x: 0, y: height, w: W, size: T.small, fill: T.sub }).h;
  c.close();
  if (legend) {
    const h = c.legend(LEGEND, height + 10, W);
    if (h) height += 10 + h;
  }
  const summary = meta.summary ?? out.summary;
  return {
    ...finish(c, { asset: meta.asset ?? 'rel-rail', width, height, title: m.title, desc: summary, data: { 'data-scale': kind, 'data-layout': out.layout, 'data-lanes': lanes.length ? lanes.map((ln) => ln.id).join(' ') : null } }),
    // 行不是可以被别的件指到的对象；组合时不拿行的 id 去对指向
    targets: [],
    axis: out.axis,
    whens: out.whens,
    positions: out.positions,
    equivalent: { summary, items: out.items, notes: [reading, ...(meta.notes ?? [])] },
  };
}

export const rail = (model, opt) => compose(model, opt);
