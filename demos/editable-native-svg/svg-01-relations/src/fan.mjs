// rel-fan：一个对象和它的若干条有向关系。
// direction: out 是分支（每条出边带条件，默认分支写明），in 是汇合（写明全部、任一或未定）。
// 只有一条出边时就是一条带类型和依据的方向关系。

import { T, PAD, canvas, finish, measure, need, needId } from './kernel.mjs';

const RULE = { all: '须全部到位', any: '任一到位即可', undetermined: '汇合规则未定' };
const DEFAULT = '其余情况（默认）';

function validate(m) {
  need(m.direction === 'out' || m.direction === 'in', 'direction', 'direction 须为 out 或 in');
  need(m.hub?.label, 'hub', 'hub 缺少 label');
  needId(m.hub?.id, 'hub ');
  need(Array.isArray(m.spokes) && m.spokes.length >= 1, 'spokes', '至少要有一条关系');
  need(m.spokes.length <= 8, 'capacity', `共 ${m.spokes.length} 条关系，超过已测试的 8 条；改用表格或先分组`);
  const nodes = new Set([m.hub.id]);
  const edges = new Set();
  for (const s of m.spokes) {
    need(s.node?.label, 'spoke', '每条关系需要带 label 的端点');
    needId(s.edge_id, '关系');
    needId(s.node.id, '端点');
    need(s.state === undefined || s.state === 'established' || s.state === 'pending', 'state', `关系 ${s.edge_id} 的 state 只能是 established 或 pending：${s.state}`);
    need(!(s.default && m.direction === 'in'), 'default', `关系 ${s.edge_id}：汇合的输入没有“默认分支”一说`);
    need(!edges.has(s.edge_id), 'duplicate-edge', `关系 ${s.edge_id} 重复`);
    need(!nodes.has(s.node.id), 'duplicate-endpoint', `端点 ${s.node.id} 出现两次；合并成一条关系，或确认它们是两个对象`);
    need(s.default || s.label, 'no-label', `关系 ${s.edge_id} 没有条件或关系类型`);
    need(s.basis || m.basis, 'no-basis', `关系 ${s.edge_id} 没有依据`);
    edges.add(s.edge_id);
    nodes.add(s.node.id);
  }
  if (m.direction === 'out' && m.spokes.length > 1) {
    const d = m.spokes.filter((s) => s.default).length;
    need(d === 1 || (d === 0 && m.no_default), 'default', '多条分支须恰有一条默认分支，或用 no_default 写明为什么没有');
    need(!(d && m.no_default), 'default', '既有默认分支，又写了 no_default');
  }
  if (m.direction === 'in') need(RULE[m.rule], 'rule', '汇合须写明 rule：all、any 或 undetermined');
}

const spokeLabel = (s) => (s.default ? (s.label ? `${DEFAULT}：${s.label}` : DEFAULT) : s.label);
const spokeSub = (s) => [s.status, s.basis && `依据：${s.basis}`].filter(Boolean).join('\n');
const pending = (s) => s.state === 'pending';

export function fan(model, { width = 672, scope } = {}) {
  validate(model);
  const m = model;
  const out = m.direction === 'out';
  const W = width - 2 * PAD;
  const c = canvas(scope);
  const arrived = m.spokes.filter((s) => !pending(s)).length;
  const gate = !out;
  // 汇入中心对象的那一段单独画：汇合条件满足才是实线
  const met = m.rule === 'all' ? arrived === m.spokes.length : m.rule === 'any' ? arrived >= 1 : false;
  const joinData = { 'data-join-for': m.hub.id, 'data-rule': m.rule, 'data-met': met ? 'true' : 'false' };

  const node = (o, b, hub) => {
    c.open({ 'data-object-id': o.id, 'data-role': hub ? 'hub' : 'node' });
    c.rect(b, hub ? { fill: T.wash } : {});
    const t = c.label(`${o.id}.label`, o.label, { x: b.x + 12, y: b.y + 9, w: b.w - 24, weight: hub ? 600 : null });
    if (o.state) c.label(`${o.id}.state`, o.state, { x: b.x + 12, y: b.y + 9 + t.h + 2, w: b.w - 24, size: T.small, fill: T.sub });
    c.close();
    c.box(o.id, b);
  };
  const nodeH = (o, w, hub) =>
    Math.max(40, measure(o.label, w - 24, T.size, hub).h + (o.state ? measure(o.state, w - 24, T.small).h + 2 : 0) + 18);
  const edgeData = (s) => ({
    'data-edge-id': s.edge_id,
    'data-from': out ? m.hub.id : s.node.id,
    'data-to': out ? s.node.id : m.hub.id,
    'data-state': pending(s) ? 'pending' : 'established',
  });

  let height;
  if (W >= 520) {
    const hubW = Math.round(W * 0.28);
    const nodeW = Math.round(W * 0.33);
    const gateW = out ? 0 : 100;
    const hubX = out ? 0 : W - hubW;
    const nodeX = out ? W - nodeW : 0;
    const trunk = out ? hubW + 18 : W - hubW - gateW - 12;
    const lx = out ? trunk + 12 : nodeW + 12;
    const lw = out ? nodeX - 26 - lx : trunk - 12 - lx;
    const hubH = nodeH(m.hub, hubW, true);
    const rows = m.spokes.map((s) => {
      const lab = measure(spokeLabel(s), lw);
      const sub = spokeSub(s) ? measure(spokeSub(s), lw, T.small) : null;
      const nh = nodeH(s.node, nodeW);
      return { s, lab, sub, nh, up: Math.max(lab.h + 5, nh / 2), down: Math.max(sub ? sub.h + 5 : 0, nh / 2) };
    });
    const gateH = gate ? measure(RULE[m.rule], gateW - 8, T.size, true).h : 0;
    let y = Math.max(0, hubH / 2 - rows[0].up, gateH + 5 - rows[0].up);
    for (const row of rows) {
      row.ly = y + row.up;
      y = row.ly + row.down + 14;
    }
    const ly0 = rows[0].ly;
    height = Math.max(y - 14, ly0 + hubH / 2);
    for (const { s, lab, nh, ly } of rows) {
      const pts = out ? [[hubW, ly0], [trunk, ly0], [trunk, ly], [nodeX, ly]] : [[nodeW, ly], [trunk, ly], [trunk, ly0]];
      c.path(pts, { dashed: pending(s), arrow: out, data: edgeData(s) });
      c.label(`${s.edge_id}.label`, spokeLabel(s), { x: lx, y: ly - 5 - lab.h, w: lw });
      if (spokeSub(s)) c.label(`${s.edge_id}.sub`, spokeSub(s), { x: lx, y: ly + 5, w: lw, size: T.small, fill: T.sub });
      node(s.node, { x: nodeX, y: ly - nh / 2, w: nodeW, h: nh });
    }
    node(m.hub, { x: hubX, y: ly0 - hubH / 2, w: hubW, h: hubH }, true);
    if (gate) {
      c.path([[trunk, ly0], [hubX, ly0]], { dashed: !met, arrow: true, data: joinData });
      c.label(`${m.hub.id}.rule`, RULE[m.rule], { x: trunk + 8, y: ly0 - 5 - gateH, w: gateW - 8, weight: 600 });
      c.label(`${m.hub.id}.arrived`, `已到位 ${arrived}/${m.spokes.length}`, { x: trunk + 8, y: ly0 + 5, w: gateW - 8, size: T.small, fill: T.sub });
    }
  } else {
    const tx = 9;
    const ix = 26;
    const iw = W - ix;
    const hubH = nodeH(m.hub, W, true);
    let y = out ? hubH + 14 : 0;
    const rows = [];
    for (const s of m.spokes) {
      const lab = c.label(`${s.edge_id}.label`, spokeLabel(s), { x: ix, y, w: iw });
      y += lab.h;
      if (spokeSub(s)) y += c.label(`${s.edge_id}.sub`, spokeSub(s), { x: ix, y, w: iw, size: T.small, fill: T.sub }).h;
      y += 5;
      const nh = nodeH(s.node, iw);
      node(s.node, { x: ix, y, w: iw, h: nh });
      rows.push({ s, ly: y + nh / 2 });
      y += nh + 14;
    }
    let hubY = 0;
    if (!out) {
      const g = c.label(`${m.hub.id}.rule`, RULE[m.rule], { x: ix, y, w: iw, weight: 600 });
      const a = c.label(`${m.hub.id}.arrived`, `已到位 ${arrived}/${m.spokes.length}`, { x: ix, y: y + g.h, w: iw, size: T.small, fill: T.sub });
      hubY = y + g.h + a.h + 12;
    }
    for (const { s, ly } of rows) {
      const pts = out ? [[tx, hubH], [tx, ly], [ix, ly]] : [[ix, ly], [tx, ly], [tx, rows.at(-1).ly]];
      c.path(pts, { dashed: pending(s), arrow: out, data: edgeData(s) });
    }
    if (gate) c.path([[tx, rows.at(-1).ly], [tx, hubY]], { dashed: !met, arrow: true, data: joinData });
    node(m.hub, { x: 0, y: hubY, w: W, h: hubH }, true);
    height = out ? y - 14 : hubY + hubH;
  }

  // 整张图共用的依据和“没有默认分支”的理由也画进图里，不只留在等效文字
  const foot = [m.basis && `依据：${m.basis}`, m.no_default && `没有默认分支：${m.no_default}`].filter(Boolean);
  foot.forEach((line, i) => {
    height += i ? 2 : 12;
    height += c.label(`${m.hub.id}.foot.${i}`, line, { x: 0, y: height, w: W, size: T.small, fill: T.sub }).h;
  });

  const items = m.spokes.map((s) => {
    const sub = [pending(s) ? '尚未成立' : null, s.status, s.basis ? `依据：${s.basis}` : null].filter(Boolean).join('；');
    return out
      ? `${spokeLabel(s)} → ${s.node.label}${sub ? `（${sub}）` : ''}`
      : `${s.node.label}：${spokeLabel(s)}${sub ? `（${sub}）` : ''}`;
  });
  const summary = out
    ? m.spokes.length === 1
      ? `“${m.hub.label}”${spokeLabel(m.spokes[0])}“${m.spokes[0].node.label}”，方向由前者指向后者。`
      : `${m.hub.label}之后有 ${m.spokes.length} 条分支，各由条件决定。`
    : `${m.hub.label}由 ${m.spokes.length} 项输入汇合，${RULE[m.rule]}，已到位 ${arrived} 项，${m.rule === 'undetermined' ? '无法判断是否满足' : met ? '汇合条件已满足' : '汇合条件未满足'}。`;
  const notes = [m.basis && `依据：${m.basis}`, m.no_default && `没有默认分支：${m.no_default}`, m.hub.state && `${m.hub.label}：${m.hub.state}`].filter(Boolean);
  return {
    ...finish(c, { asset: 'rel-fan', width, height, title: m.title, desc: summary, data: { 'data-direction': m.direction, 'data-rule': m.rule } }),
    equivalent: { summary, items, notes },
  };
}
