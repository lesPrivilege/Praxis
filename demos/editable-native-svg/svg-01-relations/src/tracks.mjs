// rel-tracks：每个对象有自己的版本线，判断、建议和候选各自绑定到某条线上的某个版本。
// 版本按先后排列，间距不表示时长。强调色只留给还在等人决定的那一处；已经作出的决定和别的记录一样用墨色。

import { T, PAD, canvas, finish, lineH, need, needId } from './kernel.mjs';

const ORIGIN = { human: '人', machine: '机器', rule: '规则', context: '上下文' };
const STATES = new Set(['recorded', 'proposed', 'rejected', 'open', 'decided']);
const STATE_TEXT = { recorded: '已记录', proposed: '尚未成立', rejected: '已拒绝', open: '等人决定', decided: '已决定' };
const isDashed = (b) => b.state === 'proposed' || b.state === 'rejected' || b.state === 'open';
const basisText = (b) => `${b.lane}@v${b.rev}${b.locator ? ` ${b.locator}` : ''}`;
const basisAttr = (b) => `${b.lane}@${b.rev}${b.locator ? `#${b.locator}` : ''}`;

function validate(m) {
  need(!('global_version' in m), 'global-version', '不能用一个全局版本号代替各对象自己的版本');
  need(Array.isArray(m.lanes) && m.lanes.length, 'lanes', '至少要有一条版本线');
  need(m.lanes.length <= 6, 'capacity', `共 ${m.lanes.length} 条版本线，超过已测试的 6 条`);
  const lanes = new Map();
  for (const ln of m.lanes) {
    needId(ln?.id, '版本线');
    need(!lanes.has(ln.id), 'lane', `版本线 ${ln.id} 重复`);
    need(Array.isArray(ln.versions) && ln.versions.length, 'versions', `版本线 ${ln.id} 没有版本`);
    need(ln.versions.every((v, i) => Number.isFinite(v.rev) && (i === 0 || v.rev > ln.versions[i - 1].rev)), 'versions', `版本线 ${ln.id} 的版本号须是递增的数字`);
    need(ln.versions.filter((v) => v.current).length <= 1, 'versions', `版本线 ${ln.id} 有不止一个当前版本`);
    lanes.set(ln.id, new Set(ln.versions.map((v) => v.rev)));
  }
  const ids = new Set();
  const taken = new Set([...lanes].flatMap(([id, revs]) => [id, ...[...revs].map((rev) => `${id}@${rev}`)]));
  for (const b of m.bindings ?? []) {
    needId(b?.id, '绑定');
    need(!ids.has(b.id) && !taken.has(b.id), 'duplicate-id', `绑定 ${b.id} 与别的绑定、版本线或版本重名`);
    ids.add(b.id);
    need(b.kind && STATES.has(b.state), 'binding', `绑定 ${b.id} 须有 kind 和合法的 state`);
    need(Array.isArray(b.basis) && b.basis.length, 'no-basis', `绑定 ${b.id} 没有写明绑定到哪个对象的哪个版本`);
    for (const bs of b.basis) need(lanes.get(bs?.lane)?.has(bs.rev), 'dangling-basis', `绑定 ${b.id} 指向的 ${bs?.lane}@v${bs?.rev} 不存在`);
    need(new Set(b.basis.map((bs) => `${bs.lane}@${bs.rev}`)).size === b.basis.length, 'duplicate-basis', `绑定 ${b.id} 把同一个版本写了两次`);
  }
  for (const a of m.absences ?? []) need(lanes.get(a.lane)?.has(a.rev) && a.text, 'dangling-basis', `空缺说明指向的 ${a.lane}@v${a.rev} 不存在`);
}

const head = (b) => [ORIGIN[b.origin], b.kind].filter(Boolean).join(' · ');
const resolution = (x) => `${[ORIGIN[x.origin], x.kind, x.id].filter(Boolean).join(' · ')}：${x.text}${x.replays ? `；重放 ${x.replays} 次，未重复生效` : ''}`;

export function tracks(model, { width = 672, scope } = {}) {
  validate(model);
  const m = model;
  const bindings = m.bindings ?? [];
  const absences = m.absences ?? [];
  const W = width - 2 * PAD;
  const c = canvas(scope);
  const cols = W >= 600 && m.lanes.length <= 3 ? m.lanes.length : 1;
  const gap = 24;
  const colW = (W - gap * (cols - 1)) / cols;
  const LH = lineH(T.size);
  const SH = lineH(T.small);

  const row = (x, y, w, sub, draw) => {
    // 接线从版本说明下方垂到这一行，再拐进来
    const rx = x + 43;
    const cy = y + SH / 2;
    const bottom = draw(rx, w - 43);
    return { cy, bottom, link: (opts) => c.path([[x + 26, sub], [x + 26, cy], [rx - 12, cy]], { width: 1, ...opts }) };
  };

  const drawLane = (ln, x, y0, w) => {
    c.open({ 'data-object-id': ln.id, 'data-role': 'lane' });
    let y = y0;
    if (ln.role) y += c.label(`${ln.id}.role`, ln.role, { x, y, w, size: T.small, fill: T.sub }).h;
    y += c.label(`${ln.id}.id`, ln.label ?? ln.id, { x, y, w, weight: 600 }).h + 8;
    const rail = c.parts.length;
    const ticks = [];
    for (const v of ln.versions) {
      const key = `${ln.id}@${v.rev}`;
      c.open({ 'data-version': key, 'data-current': v.current ? 'true' : null });
      ticks.push({ y: y + LH / 2, v });
      y += c.label(`${key}.head`, `v${v.rev}${v.current ? ' · 当前' : ''}`, { x: x + 20, y, w: w - 20, weight: 600 }).h;
      if (v.label) y += c.label(`${key}.label`, v.label, { x: x + 20, y, w: w - 20 }).h;
      c.box(key, { x, y: ticks.at(-1).y - LH / 2, w, h: y - ticks.at(-1).y + LH / 2 });
      const sub = y + 1;
      for (const b of bindings.filter((k) => k.basis[0].lane === ln.id && k.basis[0].rev === v.rev)) {
        y += 7;
        const accent = b.state === 'open';
        const dashed = isDashed(b);
        const color = accent ? T.accent : T.edge;
        c.open({ 'data-binding-id': b.id, 'data-origin': b.origin, 'data-state': b.state, 'data-basis': b.basis.map(basisAttr).join(' ') });
        const top = y;
        const rw = row(x, y, w, sub, (rx, rw2) => {
          let cy = y + c.label(`${b.id}.head`, head(b), { x: rx, y, w: rw2, size: T.small, weight: 600, fill: accent ? T.accent : T.sub }).h;
          if (b.text) cy += c.label(`${b.id}.text`, b.text, { x: rx, y: cy, w: rw2 }).h;
          cy += c.label(`${b.id}.basis`, `${b.id} 绑定 ${b.basis.map(basisText).join('；')}`, { x: rx, y: cy, w: rw2, size: T.small, fill: T.sub }).h;
          if (b.resolution) cy += c.label(`${b.id}.resolution`, resolution(b.resolution), { x: rx, y: cy, w: rw2, size: T.small, fill: T.sub }).h;
          return cy;
        });
        rw.link({ dashed, color, data: { 'data-link-for': b.id, 'data-to': key } });
        const [mx, my] = [x + 35, rw.cy];
        if (b.state === 'rejected') c.path(`M${mx - 3} ${my - 3}L${mx + 3} ${my + 3}M${mx + 3} ${my - 3}L${mx - 3} ${my + 3}`, { color, width: 1.5 });
        else if (b.state === 'recorded' || b.state === 'decided') c.dot(mx, my, { fill: color });
        else c.dot(mx, my, { r: accent ? 3.5 : 2.5, fill: T.paper, stroke: color, 'stroke-width': accent ? 1.5 : 1.25 });
        c.close();
        c.box(b.id, { x: x + 43, y: top, w: w - 43, h: rw.bottom - top });
        y = rw.bottom;
      }
      // 第二个及以后的依据在各自的版本下留一行指回
      for (const b of bindings.filter((k) => k.basis.slice(1).some((s) => s.lane === ln.id && s.rev === v.rev))) {
        y += 7;
        const rw = row(x, y, w, sub, (rx, rw2) => y + c.label(`${b.id}.ref.${key}`, `${b.id} 同时绑定这个版本（${STATE_TEXT[b.state]}）`, { x: rx, y, w: rw2, size: T.small, fill: T.sub }).h);
        rw.link({ dashed: isDashed(b), color: T.line, data: { 'data-link-for': b.id, 'data-to': key } });
        y = rw.bottom;
      }
      absences.filter((a) => a.lane === ln.id && a.rev === v.rev).forEach((a, k) => {
        y += 7;
        const rw = row(x, y, w, sub, (rx, rw2) => y + c.label(`${key}.absence.${k}`, a.text, { x: rx, y, w: rw2, size: T.small, fill: T.sub }).h);
        rw.link({ dashed: true, color: T.line, data: { 'data-absence-at': key } });
        y = rw.bottom;
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

  const items = m.lanes.map((ln) => {
    const vs = ln.versions.map((v) => `v${v.rev}${v.current ? '（当前）' : ''}${v.label ? ` ${v.label}` : ''}`).join('；');
    return `${ln.role ? `${ln.role} ` : ''}${ln.label ?? ln.id}：${vs}`;
  });
  const notes = [
    ...bindings.map((b) => `${head(b)} · ${b.id}：${b.text ?? ''}（绑定 ${b.basis.map(basisText).join('；')}）${b.resolution ? ` ${resolution(b.resolution)}` : ''}`),
    ...absences.map((a) => `${a.lane}@v${a.rev}：${a.text}`),
  ];
  const summary = `${m.lanes.length} 个对象各有自己的版本，${bindings.length} 条判断、建议或候选分别绑定到具体版本。`;
  return {
    ...finish(c, { asset: 'rel-tracks', width, height, title: m.title, desc: summary }),
    equivalent: { summary, items, notes },
  };
}
