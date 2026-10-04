// rel-tracks：每个对象有自己的版本线，判断、建议和候选各自绑定到某条线上的某个版本。
// 版本按先后排列，间距不表示时长。成立程度的画法见 standing.mjs。

import { T, PAD, anchor, anchorKey, anchorTarget, anchorText, canvas, finish, lineH, need, needId } from './kernel.mjs';
import { LEGEND, standing, who } from './standing.mjs';

const STATES = ['recorded', 'proposed', 'rejected', 'open', 'decided'];

// 校验并补齐：每条绑定得到 st、归属的中文和规整过的 basis（都须落在图里的某个版本上）。
function resolve(m) {
  need(!('global_version' in m), 'global-version', '不能用一个全局版本号代替各对象自己的版本');
  need(Array.isArray(m.lanes) && m.lanes.length, 'lanes', '至少要有一条版本线');
  need(m.lanes.length <= 6, 'capacity', `共 ${m.lanes.length} 条版本线，超过已测试的 6 条`);
  const lanes = new Map();
  for (const ln of m.lanes) {
    needId(ln?.id, '版本线');
    need(!lanes.has(ln.id), 'lane', `版本线 ${ln.id} 重复`);
    need(Array.isArray(ln.versions) && ln.versions.length, 'versions', `版本线 ${ln.id} 没有版本`);
    need(ln.versions.every((v, i) => Number.isFinite(v.version) && (i === 0 || v.version > ln.versions[i - 1].version)), 'versions', `版本线 ${ln.id} 的版本号须是递增的数字`);
    need(ln.versions.filter((v) => v.current).length <= 1, 'versions', `版本线 ${ln.id} 有不止一个当前版本`);
    lanes.set(ln.id, new Set(ln.versions.map((v) => v.version)));
  }
  const inFigure = (a) => a.located && lanes.get(a.id)?.has(a.version);
  const ids = new Set();
  const taken = new Set([...lanes].flatMap(([id, vs]) => [id, ...[...vs].map((v) => `${id}@${v}`)]));
  const bindings = (m.bindings ?? []).map((b) => {
    needId(b?.id, '绑定');
    need(!ids.has(b.id) && !taken.has(b.id), 'duplicate-id', `绑定 ${b.id} 与别的绑定、版本线或版本重名`);
    ids.add(b.id);
    need(b.kind, 'binding', `绑定 ${b.id} 没有 kind`);
    need(Array.isArray(b.basis) && b.basis.length, 'no-basis', `绑定 ${b.id} 没有写明绑定到哪个对象的哪个版本`);
    const basis = b.basis.map((x) => {
      need(x && typeof x === 'object', 'dangling-basis', `绑定 ${b.id} 的依据不是一条指向`);
      const a = anchor(x, `绑定 ${b.id} 的依据`);
      need(a.located && a.version != null, 'no-version', `绑定 ${b.id} 的依据没有写版本；判断绑定的是某个版本，不是整个对象`);
      need(inFigure(a), 'dangling-basis', `绑定 ${b.id} 指向的 ${anchorText(a)} 不在图里`);
      return a;
    });
    need(new Set(basis.map(anchorTarget)).size === basis.length, 'duplicate-basis', `绑定 ${b.id} 把同一个版本写了两次`);
    const res = b.resolution && { ...b.resolution, by: who(b.resolution.origin, `绑定 ${b.id} 的结论`) };
    return { ...b, basis, resolution: res, st: standing(b.state, STATES, `绑定 ${b.id} `), by: who(b.origin, `绑定 ${b.id} `) };
  });
  const absences = (m.absences ?? []).map((x) => {
    const a = anchor({ id: x?.id, version: x?.version, label: x?.label, locator: x?.locator }, '空缺说明');
    need(inFigure(a) && x.text, 'dangling-basis', `空缺说明指向的 ${anchorText(a)} 不在图里，或没有文字`);
    return { at: a, text: x.text };
  });
  return { bindings, absences };
}

const head = (b) => [b.by, b.kind].filter(Boolean).join(' · ');
// 所绑的版本已经不是当前版本时写出来：记录本身没有错，但读者要知道它说的是旧版本
const basisLine = (b, current) => `${b.id} 绑定 ${b.basis.map((a) => `${anchorText(a)}${current.get(a.id) != null && current.get(a.id) !== a.version ? '（非当前版本）' : ''}`).join('；')}`;
const resolution = (x) => `${[x.by, x.kind, x.id].filter(Boolean).join(' · ')}：${x.text}${x.replays ? `；重放 ${x.replays} 次，未重复生效` : ''}`;

export function tracks(model, { width = 672, scope, legend = true } = {}) {
  const m = model;
  const { bindings, absences } = resolve(m);
  const W = width - 2 * PAD;
  const c = canvas(scope);
  const current = new Map(m.lanes.map((ln) => [ln.id, ln.versions.find((v) => v.current)?.version]));
  const cols = W >= 600 && m.lanes.length <= 3 ? m.lanes.length : 1;
  const gap = 24;
  const colW = (W - gap * (cols - 1)) / cols;
  const LH = lineH(T.size);
  const SH = lineH(T.small);

  // 一行挂在某个版本下：接线从版本说明下方垂到这一行，再拐进来
  const row = (x, y, w, sub, st, data, draw) => {
    const rx = x + 43;
    const cy = y + SH / 2;
    const bottom = draw(rx, w - 43);
    c.path([[x + 26, sub], [x + 26, cy], [rx - 12, cy]], { st, width: 1, color: st.accent ? T.accent : T.line, data });
    return { cy, bottom };
  };

  const drawLane = (ln, x, y0, w) => {
    c.open({ 'data-object-id': ln.id, 'data-role': 'lane' });
    let y = y0;
    if (ln.role) y += c.label(`${ln.id}.role`, ln.role, { x, y, w, size: T.small, fill: T.sub }).h;
    y += c.label(`${ln.id}.id`, ln.label ?? ln.id, { x, y, w, weight: 600 }).h + 8;
    c.box(ln.id, { x, y: y0, w, h: y - 8 - y0 });
    const rail = c.parts.length;
    const ticks = [];
    for (const v of ln.versions) {
      const key = `${ln.id}@${v.version}`;
      const here = (a) => a.id === ln.id && a.version === v.version;
      c.open({ 'data-version': key, 'data-current': v.current ? 'true' : null });
      const top = y;
      ticks.push({ y: y + LH / 2, v });
      y += c.label(`${key}.head`, `v${v.version}${v.current ? ' · 当前' : ''}`, { x: x + 20, y, w: w - 20, weight: 600 }).h;
      if (v.label) y += c.label(`${key}.label`, v.label, { x: x + 20, y, w: w - 20 }).h;
      c.box(key, { x, y: top, w, h: y - top });
      const sub = y + 1;
      for (const b of bindings.filter((k) => here(k.basis[0]))) {
        y += 7;
        const start = y;
        const fill = b.st.accent ? T.accent : T.sub;
        c.open({ 'data-binding-id': b.id, 'data-origin': b.origin, 'data-state': b.state, 'data-basis': anchorKey(b.basis[0]) });
        const rw = row(x, y, w, sub, b.st, { 'data-link-for': b.id, 'data-to': key }, (rx, rw2) => {
          let cy = y + c.label(`${b.id}.head`, `${head(b)} · ${b.st.word}`, { x: rx, y, w: rw2, size: T.small, weight: 600, fill }).h;
          if (b.text) cy += c.label(`${b.id}.text`, b.text, { x: rx, y: cy, w: rw2 }).h;
          cy += c.label(`${b.id}.basis`, basisLine(b, current), { x: rx, y: cy, w: rw2, size: T.small, fill: T.sub }).h;
          if (b.resolution) cy += c.label(`${b.id}.resolution`, resolution(b.resolution), { x: rx, y: cy, w: rw2, size: T.small, fill: T.sub }).h;
          return cy;
        });
        c.end(x + 35, rw.cy, b.st);
        c.close();
        c.box(b.id, { x: x + 43, y: start, w: w - 43, h: rw.bottom - start });
        y = rw.bottom;
      }
      // 第二个及以后的依据在各自的版本下留一行指回，线型随这条绑定的成立程度
      for (const b of bindings.filter((k) => k.basis.slice(1).some(here))) {
        y += 7;
        y = row(x, y, w, sub, { ...b.st, end: 'none' }, { 'data-link-for': b.id, 'data-to': key }, (rx, rw2) =>
          y + c.label(`${b.id}.ref.${key}`, `${b.id} 同时绑定这个版本（${b.st.word}）`, { x: rx, y, w: rw2, size: T.small, fill: T.sub }).h,
        ).bottom;
      }
      absences.filter((a) => here(a.at)).forEach((a, k) => {
        y += 7;
        y = row(x, y, w, sub, standing('none', ['none'], ''), { 'data-absence-at': key }, (rx, rw2) =>
          y + c.label(`${key}.absence.${k}`, a.text, { x: rx, y, w: rw2, size: T.small, fill: T.sub }).h,
        ).bottom;
      });
      c.close();
      y += 14;
    }
    const marks = ticks.map((t) => `<circle cx="${x + 6}" cy="${t.y}" r="5" fill="${t.v.current ? T.ink : T.paper}" stroke="${T.ink}" stroke-width="1.5"/>`).join('');
    c.insert(rail, `<path d="M${x + 6} ${ticks[0].y}V${ticks.at(-1).y}" fill="none" stroke="${T.ink}" stroke-width="1.5"/>${marks}`);
    c.close();
    return y - 14;
  };

  let height = 0;
  let y = 0;
  m.lanes.forEach((ln, i) => {
    if (cols > 1) height = Math.max(height, drawLane(ln, i * (colW + gap), 0, colW));
    else {
      height = drawLane(ln, 0, y, colW);
      y = height + 20;
    }
  });
  if (legend) {
    const h = c.legend(LEGEND, height + 14, W);
    if (h) height += 14 + h;
  }

  const items = m.lanes.map((ln) => {
    const vs = ln.versions.map((v) => `v${v.version}${v.current ? '（当前）' : ''}${v.label ? ` ${v.label}` : ''}`).join('；');
    return `${ln.role ? `${ln.role} ` : ''}${ln.label ?? ln.id}：${vs}`;
  });
  const notes = [
    ...bindings.map((b) => `${head(b)} · ${b.st.word} · ${b.id}：${b.text ?? ''}（${basisLine(b, current)}）${b.resolution ? ` ${resolution(b.resolution)}` : ''}`),
    ...absences.map((a) => `${anchorText(a.at)}：${a.text}`),
  ];
  const summary = `${m.lanes.length} 个对象各有自己的版本，${bindings.length} 条判断、建议或候选分别绑定到具体版本。`;
  return {
    ...finish(c, { asset: 'rel-tracks', width, height, title: m.title, desc: summary }),
    equivalent: { summary, items, notes },
  };
}
