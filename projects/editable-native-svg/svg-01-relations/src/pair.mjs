// rel-pair：同一个对象的两份内容按字段对齐，一行是一个字段。
//   change      前后两个版本：哪些变了，哪些没变，哪些是新增、删除或还没定
//   projection  源和从它选出来的一份：选入了什么，没选入的仍在源里
// 这里只管对照的语义和词；排布交给 rail.mjs 的并排栏。没变的行和没选入的行照样画出来。

import { anchor, anchorText, need, needId } from './kernel.mjs';
import { compose } from './rail.mjs';

const CHANGE = { same: '未变', changed: '已改', added: '新增', removed: '已删除', pending: '待定' };

// 值与单位分开写（unit 字段）；两边 unit 不同的不算“变了”，是不可比。单位写在值的文字里时，这里只能当文字比
function side(v, unit, what) {
  if (v == null) return null;
  const o = typeof v === 'object' ? v : { value: v };
  need(['string', 'number'].includes(typeof o.value) && String(o.value).trim(), 'value', `${what}的值须是非空的文字或数字`);
  return { value: String(o.value).trim(), unit: o.unit ?? unit ?? null };
}
const show = (s) => `${s.value}${s.unit ? ` ${s.unit}` : ''}`;

function ref(x, key, what) {
  need(x && typeof x.label === 'string' && x.label.trim(), 'side', `${what}需要 label`);
  need(x[key] != null, 'no-version', `${what}没有 ${key}：须写明是哪个对象的哪个版本`);
  const a = anchor(x[key], `${what}的指向`);
  need(a.located && a.version != null, 'no-version', `${what}没有写明是哪个对象的哪个版本；两份说不清来路的内容不能对照`);
  return a;
}
// 两份是同一个对象：id 相同，名字也得相同
function same(a, b, why) {
  need(a.id === b.id, 'incomparable', `${why}（${a.id} 和 ${b.id}）`);
  need((a.label ?? null) === (b.label ?? null), 'inconsistent-label', `对象 ${a.id} 在两边的名字不一样：“${a.label}”和“${b.label}”`);
}
const numeric = (v) => typeof v === 'number';

function fieldsOf(m) {
  need(Array.isArray(m.fields) && m.fields.length, 'fields', '至少要有一个字段');
  const ids = new Set();
  for (const f of m.fields) {
    needId(f?.id, '字段');
    need(!ids.has(f.id), 'duplicate-id', `字段 ${f.id} 重复`);
    need(typeof f.label === 'string' && f.label.trim(), 'field', `字段 ${f.id} 没有 label`);
    ids.add(f.id);
  }
  return ids;
}

function change(m) {
  const a = ref(m.before, 'ref', '变化之前的一份');
  const b = ref(m.after, 'ref', '变化之后的一份');
  same(a, b, '两份不是同一个对象，不能当作前后变化');
  need(a.version !== b.version && !(numeric(a.version) && numeric(b.version) && a.version > b.version), 'version', `前一份是 v${a.version}，后一份是 v${b.version}；须是先后两个不同的版本`);
  fieldsOf(m);
  const count = { same: 0, changed: 0, added: 0, removed: 0, pending: 0 };
  const rows = m.fields.map((f) => {
    const p = side(f.before, f.unit, `字段 ${f.id} 之前`);
    const q = side(f.after, f.unit, `字段 ${f.id} 之后`);
    need(p || q, 'field', `字段 ${f.id} 两边都没有值`);
    need(!p || !q || p.unit === q.unit, 'incomparable', `字段 ${f.id} 两边单位不同（${p?.unit ?? '无'} 和 ${q?.unit ?? '无'}）；先换成同一种口径，不能直接当作变化`);
    // pending：后一个值只是提议，还等人决定
    need(f.pending == null || typeof f.pending === 'boolean', 'field', `字段 ${f.id} 的 pending 须是 true 或 false`);
    const kind = f.pending ? 'pending' : !p ? 'added' : !q ? 'removed' : p.value === q.value ? 'same' : 'changed';
    need(!f.pending || q, 'field', `字段 ${f.id} 标了待定，却没有写提议的值`);
    count[kind]++;
    const quiet = kind === 'same' ? 'sub' : null;
    return {
      id: f.id,
      label: f.label,
      note: f.note,
      data: { 'data-change': kind },
      cells: {
        before: p ? { text: show(p), tone: quiet } : { text: '原先没有这一项', tone: 'sub' },
        after: q ? { text: f.pending ? `提议：${show(q)}` : show(q), tone: quiet } : { text: '这一项已不在', tone: 'sub' },
        change: kind === 'pending' ? { text: CHANGE.pending, state: 'open' } : { text: CHANGE[kind], tone: quiet },
      },
    };
  });
  const tally = ['changed', 'added', 'removed', 'pending', 'same'].filter((k) => count[k]).map((k) => `${CHANGE[k]} ${count[k]} 项`).join('，');
  return {
    model: {
      title: m.title,
      scale: { kind: 'list' },
      lanes: [{ id: 'before', label: m.before.label, ref: m.before.ref }, { id: 'after', label: m.after.label, ref: m.after.ref }, { id: 'change', label: '变化' }],
      rows,
    },
    meta: { summary: `从 ${anchorText(a)} 到 ${anchorText(b)}，共 ${rows.length} 个字段：${tally}。`, reading: ['没有变的字段照样列出。'], count },
  };
}

function projection(m) {
  const src = ref(m.source, 'ref', '源');
  const basis = ref(m.view, 'basis', '选出来的一份');
  same(src, basis, '选出来的一份依据的不是这个源');
  need(!(numeric(src.version) && numeric(basis.version) && basis.version > src.version), 'version', `选取依据的 v${basis.version} 比源的 v${src.version} 还新`);
  const ids = fieldsOf(m);
  need(Array.isArray(m.selected) && new Set(m.selected).size === m.selected.length, 'selected', 'selected 须是不重复的字段 id 列表；一个都没选就写空列表');
  for (const id of m.selected) need(ids.has(id), 'unknown-field', `选入的字段 ${id} 不在源里；选取不能给源添字段`);
  const stale = basis.version !== src.version;
  let late = 0;
  const rows = m.fields.map((f) => {
    const v = side(f.value, f.unit, `字段 ${f.id}`);
    need(v, 'field', `字段 ${f.id} 没有值`);
    // since：这个字段是源的哪个版本才有的。选取依据的版本更早时，它当时还不存在
    // 版本号不是数的（“2026-03”）排不出先后，写了 since 就拒用，不猜
    need(f.since == null || (numeric(f.since) && numeric(basis.version)), 'version', `字段 ${f.id} 写了 since，但 since 或选取依据的版本不是数，比不出先后`);
    const after = f.since != null && f.since > basis.version;
    const picked = m.selected.includes(f.id);
    need(!(after && picked), 'stale-basis', `字段 ${f.id} 是 v${f.since} 才有的，选取依据的是 v${basis.version}，不可能已经选入`);
    if (after) late++;
    return {
      id: f.id,
      label: f.label,
      note: f.note,
      data: { 'data-selected': picked ? 'true' : 'false' },
      cells: {
        source: { text: show(v) },
        view: picked ? { text: '选入' } : { text: after ? `选取时还没有这个字段（v${f.since} 新增）` : '没有选入，仍在源里', tone: 'sub' },
      },
    };
  });
  const n = m.selected.length;
  const summary = `${anchorText(src)} 有 ${rows.length} 个字段，${m.view.label}${n === rows.length ? '全部选入。' : n === 0 ? '一个都没有选，全部仍在源里。' : `选入 ${n} 个；没有选入的仍在源里。`}`;
  return {
    model: {
      title: m.title,
      scale: { kind: 'list' },
      lanes: [{ id: 'source', label: m.source.label, ref: m.source.ref }, { id: 'view', label: m.view.label, ref: m.view.basis }],
      rows,
    },
    meta: {
      summary,
      reading: ['没有选入的字段照样列出；选取只读，不改源。'],
      notes: [stale && `${m.view.label}依据的是${anchorText(basis)}，源现在是${anchorText(src)}（非当前版本）。`, late && `${late} 个字段是选取之后才有的。`].filter(Boolean),
      stale,
    },
  };
}

export function pair(model, opt) {
  need(model && typeof model === 'object' && !Array.isArray(model), 'model', '输入须是一个对象');
  need(model.kind === 'change' || model.kind === 'projection', 'kind', 'kind 须为 change（前后变化）或 projection（选取）');
  const { model: m, meta } = model.kind === 'change' ? change(model) : projection(model);
  // 选取依据的不是当前版本时，把这件事写进图脚，不只留在等效文字里
  const reading = [...meta.reading, ...(meta.notes ?? [])];
  const res = compose(m, opt, { asset: 'rel-pair', summary: meta.summary, reading });
  return { ...res, count: meta.count, stale: meta.stale };
}
