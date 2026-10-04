// rel-qualify：条件、注释和证据各自限定哪一项主张，或主张里的哪个片段。
// 括线量的是被限定的主张，不是限定语自己；片段另用下划线标在原文上。

import { T, PAD, canvas, finish, lineH, measure, need, needId } from './kernel.mjs';

const RELATION = { supports: '支持', contradicts: '反驳', limits: '限定' };
const HEAD = { condition: '条件', note: '注释' };

function resolve(m) {
  need(Array.isArray(m.claims) && m.claims.length, 'claims', '至少要有一项主张');
  const index = new Map();
  m.claims.forEach((cl, i) => {
    need(cl?.text, 'claim', '主张需要 text');
    needId(cl.id, '主张');
    need(!index.has(cl.id), 'duplicate-claim', `主张 ${cl.id} 重复`);
    index.set(cl.id, i);
  });
  const qs = (m.qualifiers ?? []).map((q) => ({ ...q }));
  const ids = new Set();
  for (const q of qs) {
    needId(q.id, '限定语');
    need(!ids.has(q.id) && !index.has(q.id), 'duplicate-id', `限定语 ${q.id} 与别的限定语或主张重名`);
    ids.add(q.id);
    need(!(q.target?.claim && q.target?.claims), 'target', `限定语 ${q.id} 同时写了 claim 和 claims，只能写一个`);
    need(HEAD[q.type] || q.type === 'evidence', 'type', `限定语 ${q.id} 的 type 须为 condition、note 或 evidence`);
    const list = q.target?.claims ?? (q.target?.claim ? [q.target.claim] : []);
    need(list.length && list.every((id) => index.has(id)), 'target', `限定语 ${q.id} 没有指向已登记的主张；整体说明请放进 global_notes`);
    const at = list.map((id) => index.get(id));
    need(at.every((v, k) => k === 0 || v === at[k - 1] + 1), 'target', `限定语 ${q.id} 指向的主张不相邻，无法用一条括线表示`);
    q.i0 = at[0];
    q.i1 = at.at(-1);
    if ('fragment' in q.target) {
      need(typeof q.target.fragment === 'string' && q.target.fragment.trim(), 'fragment', `限定语 ${q.id} 的片段是空的；要限定整项主张就不要写 fragment`);
      need(list.length === 1, 'fragment', `限定语 ${q.id}：片段只能落在一项主张里`);
      const text = m.claims[q.i0].text;
      const s = text.indexOf(q.target.fragment);
      need(s >= 0 && text.indexOf(q.target.fragment, s + 1) < 0, 'fragment', `限定语 ${q.id} 的片段在主张里找不到，或出现了不止一次`);
      q.frag = { start: s, end: s + q.target.fragment.length };
    }
    if (q.type === 'evidence') {
      need(RELATION[q.relation], 'relation', `证据 ${q.id} 须写明 supports、contradicts 或 limits`);
      need(q.status === 'verified' || q.status === 'inferred', 'status', `证据 ${q.id} 须写明 verified 或 inferred`);
      const src = q.source ?? {};
      need(q.status !== 'verified' || (src.id && src.version != null && src.version !== '' && src.locator), 'unlocated-source', `证据 ${q.id} 标为已核对，却缺少来源身份、版本或定位`);
    } else {
      need(q.text, 'text', `限定语 ${q.id} 没有文字`);
    }
  }
  if (m.require_evidence) {
    m.claims.forEach((cl, i) => {
      // 只限定某个片段的证据不算整项主张有了证据
      if (!qs.some((q) => q.type === 'evidence' && !q.frag && q.i0 <= i && i <= q.i1)) qs.push({ id: `${cl.id}.no-evidence`, type: 'evidence', status: 'none', i0: i, i1: i });
    });
  }
  // 同一段范围共用一条括线；范围互相重叠时错开到第二道，再多就拒用。
  const extents = new Map();
  for (const q of qs) {
    const key = `${q.i0}-${q.i1}|${q.frag ? `${q.frag.start}-${q.frag.end}` : ''}`;
    if (!extents.has(key)) extents.set(key, { i0: q.i0, i1: q.i1, frag: q.frag, qs: [] });
    extents.get(key).qs.push(q);
  }
  const list = [...extents.values()].sort((a, b) => b.i1 - b.i0 - (a.i1 - a.i0) || !!a.frag - !!b.frag);
  for (const e of list) {
    const taken = list.filter((o) => o.lane != null && o.i0 <= e.i1 && e.i0 <= o.i1).map((o) => o.lane);
    e.lane = [0, 1].find((l) => !taken.includes(l));
    need(e.lane != null, 'capacity', '同一项主张上叠了两层以上的限定范围；拆开主张，或改用列表');
  }
  for (const a of list) {
    for (const b of list) {
      need(a === b || !a.frag || !b.frag || a.i0 !== b.i0 || a.frag.end <= b.frag.start || b.frag.end <= a.frag.start, 'fragment', '两个片段互相重叠');
    }
  }
  const notes = new Set();
  for (const g of m.global_notes ?? []) {
    needId(g?.id, '整体说明');
    need(g.text && !notes.has(g.id) && !ids.has(g.id) && !index.has(g.id), 'duplicate-id', `整体说明 ${g.id} 没有文字或与别的 id 重名`);
    notes.add(g.id);
  }
  return { qs, extents: list };
}

const leaderDashed = (q) => q.type === 'evidence' && q.status !== 'verified';

// 限定的是片段时，在标题里引出那几个字，读者不必靠括线猜是哪一处
const only = (q) => (q.frag ? ` · 限于“${q.target.fragment}”` : '');

function heads(q) {
  if (q.type !== 'evidence') return [HEAD[q.type] + only(q)];
  if (q.status === 'none') return ['证据 · 尚无'];
  const src = q.source ?? {};
  const where = [src.id && `${src.id}${src.version != null ? `@v${src.version}` : ''}`, src.locator].filter(Boolean).join(' ') || '来源未定位';
  return [`证据 · ${RELATION[q.relation]}${only(q)}`, `${where} · ${q.status === 'verified' ? '已核对' : '推断，未核对'}`];
}

export function qualify(model, { width = 672, scope } = {}) {
  const m = model;
  const { qs, extents } = resolve(m);
  const W = width - 2 * PAD;
  const wide = W >= 560;
  const c = canvas(scope);
  const maxCw = Math.round(W * 0.46);
  const cw = wide ? Math.min(maxCw, Math.ceil(Math.max(...m.claims.map((cl) => measure(cl.text, maxCw).w)))) : W - 22;
  const cx = wide ? 0 : 22;
  const qx = wide ? cw + 50 : 40;
  const qw = W - qx;
  const laneX = wide ? [cw + 17, cw + 10] : [5, 12];
  const SH = lineH(T.small);

  const drawQ = (q, y) => {
    c.open({ 'data-qualifier-id': q.id, 'data-type': q.type, 'data-relation': q.relation, 'data-status': q.status });
    const [head, where] = heads(q);
    let cy = y + c.label(`${q.id}.head`, head, { x: qx, y, w: qw, size: T.small, weight: 600, fill: T.sub }).h;
    if (q.text) cy += c.label(`${q.id}.text`, q.text, { x: qx, y: cy, w: qw }).h;
    if (where) cy += c.label(`${q.id}.source`, where, { x: qx, y: cy, w: qw, size: T.small, fill: T.sub }).h;
    c.close();
    c.box(q.id, { x: qx, y, w: qw, h: cy - y });
    q.cy = y + SH / 2;
    return cy;
  };

  let y = 0;
  let qCur = 0;
  const pos = [];
  m.claims.forEach((cl, i) => {
    const marks = extents
      .filter((e) => e.frag && e.i0 === i)
      .sort((a, b) => a.frag.start - b.frag.start)
      .map((e) => ({ ...e.frag, attrs: { 'text-decoration': 'underline', 'data-fragment-of': e.qs.map((q) => q.id).join(' ') } }));
    c.open({ 'data-object-id': cl.id, 'data-role': 'claim' });
    const t = c.label(`${cl.id}.text`, cl.text, { x: cx, y, w: cw, marks });
    c.close();
    c.box(cl.id, { x: cx, y, w: cw, h: t.h });
    pos[i] = { y, ...t };
    const span = (e) => {
      if (!e.frag) return [pos[e.i0].y, pos[e.i1].y + pos[e.i1].h];
      const hit = t.lines.map((ln, k) => (ln.start < e.frag.end && e.frag.start < ln.end ? k : -1)).filter((k) => k >= 0);
      need(hit.length, 'fragment', '片段落在换行处，量不出它在哪一行');
      return [y + hit[0] * t.LH, y + (hit.at(-1) + 1) * t.LH];
    };
    // 宽版把限定语放在所限范围的右侧起点，窄版放在范围结束之后
    const here = qs.filter((q) => (wide ? q.i0 : q.i1) === i);
    let bottom = y + t.h;
    for (const q of here) {
      const e = extents.find((x) => x.qs.includes(q));
      if (wide) {
        const top = Math.max(qCur, e.frag ? span(e)[0] : y);
        qCur = drawQ(q, top) + 10;
      } else {
        bottom = drawQ(q, bottom + 8);
      }
    }
    for (const e of extents.filter((x) => x.i1 === i)) e.span = span(e);
    y = (wide ? Math.max(bottom, qCur - 10) : bottom) + 16;
  });

  const brackets = [];
  for (const e of extents) {
    const lx = laneX[e.lane];
    const [top, bot] = [e.span[0] + 3, e.span[1] - 3];
    const tick = wide ? lx - 5 : lx + 5;
    const target = m.claims.slice(e.i0, e.i1 + 1).map((cl) => cl.id).join(' ');
    c.path([[tick, top], [lx, top], [lx, bot], [tick, bot]], { color: T.ink, width: 1.5, data: { 'data-bracket-for': target, 'data-fragment': e.frag ? m.claims[e.i0].text.slice(e.frag.start, e.frag.end) : null } });
    brackets.push({ target, fragment: !!e.frag, qualifiers: e.qs.map((q) => q.id), x: lx, y1: top, y2: bot });
    for (const q of e.qs) {
      const data = { 'data-leader-for': q.id, 'data-target': target };
      const end = qx - 8;
      if (wide) {
        const ya = Math.min(Math.max(q.cy, top), bot);
        const tx = cw + (e.lane ? 38 : 30);
        c.path(ya === q.cy ? [[lx, ya], [end, ya]] : [[lx, ya], [tx, ya], [tx, q.cy], [end, q.cy]], { dashed: leaderDashed(q), color: T.line, width: 1, data });
      } else {
        c.path([[lx, bot], [lx, q.cy], [end, q.cy]], { dashed: leaderDashed(q), color: T.line, width: 1, data });
      }
      c.dot(end + 2, q.cy, { r: 2, fill: T.line });
    }
  }

  y -= 16;
  for (const g of m.global_notes ?? []) {
    y += 14;
    y += c.label(`${g.id}.head`, '整体说明', { x: cx, y, w: W - cx, size: T.small, weight: 600, fill: T.sub }).h;
    y += c.label(`${g.id}.text`, g.text, { x: cx, y, w: W - cx }).h;
  }

  const items = m.claims.map((cl, i) => {
    const own = qs.filter((q) => q.i0 <= i && i <= q.i1).map((q) => {
      const [head, where] = heads(q);
      const scopeText = q.i0 !== q.i1 ? `同时限定 ${q.i1 - q.i0 + 1} 项主张` : null;
      return [head, scopeText, q.text, where].filter(Boolean).join('；');
    });
    return own.length ? `${cl.text}〔${own.join('｜')}〕` : cl.text;
  });
  const conflict = m.claims.filter((_, i) => {
    const ev = qs.filter((q) => q.type === 'evidence' && q.i0 <= i && i <= q.i1).map((q) => q.relation);
    return ev.includes('supports') && ev.includes('contradicts');
  });
  const summary = `${m.claims.length} 项主张，${qs.length} 条限定、注释或证据，各自标在所限定的主张旁。`;
  const notes = [...(m.global_notes ?? []).map((g) => `整体说明：${g.text}`), ...conflict.map((cl) => `来源冲突：“${cl.text}”同时有支持和反驳的证据。`)];
  return {
    ...finish(c, { asset: 'rel-qualify', width, height: y, title: m.title, desc: summary }),
    brackets,
    equivalent: { summary, items, notes },
  };
}
