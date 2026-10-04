// rel-scope：谁在哪个范围里，哪些关系越过了边界。
// 每个容器必须写明边界表示什么；跨界关系在右侧走线，编号对应图下的说明行。

import { T, PAD, canvas, finish, measure, need, needId } from './kernel.mjs';

const NUM = '①②③④⑤⑥';
const MAX_DEPTH = 3;

function validate(m) {
  need(Array.isArray(m.containers) && m.containers.length, 'containers', '至少要有一个容器');
  const cs = new Map();
  for (const ct of m.containers) {
    need(ct?.label, 'container', '容器需要 label');
    needId(ct.id, '容器');
    need(!cs.has(ct.id), 'duplicate-container', `容器 ${ct.id} 重复`);
    need(ct.boundary, 'no-boundary-meaning', `容器 ${ct.id} 没有写明边界表示什么；只是装饰边框就不要画`);
    cs.set(ct.id, ct);
  }
  const depth = (ct) => {
    const seen = new Set();
    let d = 1;
    for (let p = ct; p.parent != null; p = cs.get(p.parent), d++) {
      need(cs.has(p.parent), 'unknown-parent', `容器 ${p.id} 的上级 ${p.parent} 不存在`);
      need(!seen.has(p.id), 'cycle', `容器 ${ct.id} 的包含关系成环`);
      seen.add(p.id);
    }
    return d;
  };
  for (const ct of m.containers) need(depth(ct) <= MAX_DEPTH, 'capacity', `容器 ${ct.id} 嵌套超过已测试的 ${MAX_DEPTH} 层`);
  const ms = new Map();
  for (const mb of m.members ?? []) {
    need(mb?.label, 'member', '成员需要 label');
    needId(mb.id, '成员');
    need(!ms.has(mb.id) && !cs.has(mb.id), 'duplicate-member', `成员 ${mb.id} 重复`);
    need(!Array.isArray(mb.containers), 'overlap', `成员 ${mb.id} 同时属于多个容器；集合重叠不能画成一棵树`);
    need(mb.container == null || cs.has(mb.container), 'unknown-container', `成员 ${mb.id} 的容器 ${mb.container} 不存在`);
    ms.set(mb.id, mb);
  }
  const xs = m.crossings ?? [];
  need(xs.length <= NUM.length, 'capacity', `共 ${xs.length} 条跨界关系，超过已测试的 ${NUM.length} 条`);
  const es = new Set();
  const load = {};
  for (const x of xs) {
    needId(x.edge_id, '关系');
    need(!es.has(x.edge_id) && !ms.has(x.edge_id) && !cs.has(x.edge_id), 'duplicate-id', `关系 ${x.edge_id} 与别的关系或对象重名`);
    need(x.state === undefined || x.state === 'established' || x.state === 'pending', 'state', `关系 ${x.edge_id} 的 state 只能是 established 或 pending：${x.state}`);
    need(ms.has(x.from) && ms.has(x.to), 'unknown-endpoint', `关系 ${x.edge_id} 的端点不是已登记的成员`);
    need((ms.get(x.from).container ?? null) !== (ms.get(x.to).container ?? null), 'not-crossing', `关系 ${x.edge_id} 的两端在同一个容器里，不是跨界关系`);
    need(x.kind && x.basis, 'no-basis', `关系 ${x.edge_id} 缺少类型或依据`);
    es.add(x.edge_id);
    for (const id of [x.from, x.to]) {
      load[id] = (load[id] ?? 0) + 1;
      need(load[id] <= 4, 'capacity', `成员 ${id} 上接了超过 4 条跨界关系，接点排不开`);
    }
  }
}

export function scope(model, { width = 480, scope: sid } = {}) {
  validate(model);
  const m = model;
  const members = m.members ?? [];
  const xs = m.crossings ?? [];
  const W = width - 2 * PAD;
  const c = canvas(sid);
  const gutter = xs.length ? 14 + 14 * xs.length : 0;
  const FW = W - gutter;

  const drawMember = (mb, x, y, w) => {
    const b = { x, y, w, h: measure(mb.label, w - 20).h + 16 };
    c.open({ 'data-object-id': mb.id, 'data-role': 'member', 'data-container': mb.container });
    c.rect(b);
    c.label(`${mb.id}.label`, mb.label, { x: x + 10, y: y + 8, w: w - 20 });
    c.close();
    c.box(mb.id, b);
    return y + b.h;
  };

  const drawContainer = (ct, x, y, w) => {
    const at = c.open({ 'data-object-id': ct.id, 'data-role': 'container', 'data-parent': ct.parent });
    let cy = y + 9;
    cy += c.label(`${ct.id}.label`, ct.label, { x: x + 10, y: cy, w: w - 20, weight: 600 }).h;
    cy += c.label(`${ct.id}.boundary`, ct.boundary, { x: x + 10, y: cy, w: w - 20, size: T.small, fill: T.sub }).h + 8;
    const kids = members.filter((mb) => mb.container === ct.id);
    const subs = m.containers.filter((k) => k.parent === ct.id);
    if (!kids.length && !subs.length) cy += c.label(`${ct.id}.empty`, '当前没有成员', { x: x + 10, y: cy, w: w - 20, size: T.small, fill: T.sub }).h + 8;
    for (const mb of kids) cy = drawMember(mb, x + 10, cy, w - 20) + 8;
    for (const k of subs) cy = drawContainer(k, x + 10, cy, w - 20) + 8;
    const b = { x, y, w, h: cy - y + 2 };
    c.insert(at, `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="6" fill="none" stroke="${T.line}" stroke-width="1"/>`);
    c.close();
    c.box(ct.id, b);
    return y + b.h;
  };

  let y = 0;
  for (const ct of m.containers.filter((k) => k.parent == null)) y = drawContainer(ct, 0, y, FW) + 12;
  for (const mb of members.filter((k) => k.container == null)) y = drawMember(mb, 0, y, FW) + 12;
  y -= 12;

  // 同一成员上有多条关系时，接点上下错开
  const ports = {};
  for (const x of xs) for (const id of [x.from, x.to]) (ports[id] ??= []).push(x.edge_id);
  const portY = (id, edge) => {
    const b = c.boxes[id];
    const list = ports[id];
    return b.y + b.h / 2 + (list.indexOf(edge) - (list.length - 1) / 2) * 8;
  };
  xs.forEach((x, i) => {
    const a = c.boxes[x.from];
    const b = c.boxes[x.to];
    const tx = FW + 12 + i * 14;
    const ay = portY(x.from, x.edge_id);
    const by = portY(x.to, x.edge_id);
    const dashed = x.state === 'pending';
    c.path([[a.x + a.w, ay], [tx, ay], [tx, by], [b.x + b.w, by]], {
      dashed,
      arrow: true,
      data: { 'data-edge-id': x.edge_id, 'data-from': x.from, 'data-to': x.to, 'data-state': dashed ? 'pending' : 'established' },
    });
    const my = (ay + by) / 2;
    c.add(`<rect x="${tx - 7}" y="${my - 9}" width="14" height="18" fill="${T.paper}"/>`);
    c.label(`${x.edge_id}.mark`, NUM[i], { x: tx, y: my - 9, w: 14, size: T.small, fill: T.edge, anchor: 'middle' });
  });

  const label = (id) => members.find((mb) => mb.id === id).label;
  const keyText = (x, i) => `${NUM[i]} ${x.kind}：${label(x.from)} → ${label(x.to)}。${x.status ? `${x.status}。` : ''}依据：${x.basis}`;
  if (xs.length) y += 14;
  xs.forEach((x, i) => {
    y += c.label(`${x.edge_id}.key`, keyText(x, i), { x: 0, y, w: W, size: T.small }).h + 4;
  });

  const tree = (parent, d) =>
    m.containers
      .filter((k) => (k.parent ?? null) === parent)
      .flatMap((k) => {
        const kids = members.filter((mb) => mb.container === k.id).map((mb) => mb.label);
        const inner = tree(k.id, d + 1);
        const own = kids.length ? kids.join('、') : inner.length ? '成员都在下一级范围里' : '当前没有成员';
        return [`${'　'.repeat(d)}${k.label}（${k.boundary}）：${own}`, ...inner];
      });
  const loose = members.filter((mb) => mb.container == null).map((mb) => `不在任何范围内：${mb.label}`);
  const summary = `${m.containers.length} 个范围、${members.length} 个成员，${xs.length} 条关系越过边界。`;
  return {
    ...finish(c, { asset: 'rel-scope', width, height: y, title: m.title, desc: summary }),
    equivalent: { summary, items: [...tree(null, 0), ...loose], notes: xs.map(keyText) },
  };
}
