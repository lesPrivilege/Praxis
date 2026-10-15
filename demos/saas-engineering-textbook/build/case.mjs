// The structure panel appended to each case page: typed topology in three
// views, lifecycles, checks and teaching transfers, all read from the Vault JSON.
import path from 'node:path';
import { renderGraph, esc } from './graph.mjs';

const VIEWS = [
  { id: 'flow', title: '动作与交接', types: ['operates', 'commands', 'requests', 'emits', 'delivers', 'projects'] },
  { id: 'authority', title: '权威与存储', types: ['owns', 'stores', 'reads', 'authorizes'] },
  { id: 'lineage', title: '依赖与来路', types: ['depends_on', 'derived_from', 'contains'] },
];

const NODE_TYPE_ZH = {
  actor: '角色', ui: '界面', service: '服务', object: '对象', store: '存储',
  external_system: '外部系统', event: '事件', rule: '规则',
};
const TIMING_ZH = { sync: '同步', async: '异步', batch: '批处理', static: '静态关系' };
const BASIS_ZH = { synthetic: '合成设计', source_fact: '来源事实', inference: '编订推理' };

let cache;
function shared(ATLAS, readJSON) {
  if (cache) return cache;
  const rel = readJSON(path.join(ATLAS, 'relation-types.json'));
  const tm = readJSON(path.join(ATLAS, 'transfer-map.json'));
  const ids = readJSON(path.join(ATLAS, 'identifiers.json'));
  cache = {
    relMeaning: Object.fromEntries(rel.relations.map((r) => [r.id, r.meaning_zh])),
    transfers: tm.edges,
    transferType: Object.fromEntries(tm.edge_types.map((t) => [t.id, t.label])),
    alg: Object.fromEntries(ids.algorithms.map((a) => [a.id, a.label])),
  };
  return cache;
}

const short = (id) => id.split(':').slice(2).join(':');

export function casePanel(entry, { ATLAS, readJSON, outDir, OUT, outPathFor, pages }) {
  const S = shared(ATLAS, readJSON);
  const topoPath = path.join(ATLAS, entry.topology_path);
  const topo = readJSON(topoPath);
  const cid = topo.case_id;
  const nodeById = Object.fromEntries(topo.nodes.map((n) => [n.id, n]));
  const factEdges = topo.edges.filter((e) => e.basis !== 'synthetic').length;
  const caseHref = (id) => {
    const rel = [...pages.keys()].find((r) => r.endsWith(`/${id}.md`));
    if (!rel) throw new Error(`no page for ${id}`);
    return path.relative(outDir, path.join(OUT, outPathFor(rel)));
  };

  const o = [];
  o.push(`<section class="case-structure" id="case-structure" aria-labelledby="case-structure-h">`);
  o.push(`<h2 id="case-structure-h">结构、生命周期与迁移</h2>`);
  o.push(`<p class="lede">由 <a href="${esc(path.relative(outDir, topoPath))}">${esc(path.basename(topoPath))}</a> 生成：${topo.nodes.length} 个节点、${topo.edges.length} 条带类型的边、${topo.lifecycles.length} 个生命周期、${topo.checks.length} 条检查定义。${factEdges ? `${factEdges} 条边有来源或推理依据，其余是本例的合成设计。` : '所有边都是本例的合成设计。'}</p>`);
  const algs = topo.algorithm_ids.map((a) => S.alg[a] || a).join('、');
  o.push(`<p class="meta-line"><span>算法家族</span>${esc(algs)}</p>`);

  // three typed views
  o.push(`<div class="topo" data-topo="${esc(cid)}">`);
  o.push(`<div class="topo-tabs" role="tablist" aria-label="关系视图">`);
  VIEWS.forEach((v, i) => {
    const n = topo.edges.filter((e) => v.types.includes(e.type)).length;
    o.push(`<button type="button" role="tab" id="${cid}-tab-${v.id}" aria-controls="${cid}-view-${v.id}" aria-selected="${i === 0}" data-view="${v.id}">${v.title}<span class="count">${n}</span></button>`);
  });
  o.push('</div>');
  for (const v of VIEWS) {
    const edges = topo.edges.filter((e) => v.types.includes(e.type));
    const used = new Set(edges.flatMap((e) => [e.from, e.to]));
    const nodes = topo.nodes.filter((n) => used.has(n.id)).map((n) => ({ id: n.id, label: n.label, kind: n.type }));
    const graph = { dir: 'auto', nodes, edges: edges.map((e) => ({ from: e.from, to: e.to, label: e.type, type: e.type })) };
    const legend = v.types
      .filter((t) => edges.some((e) => e.type === t))
      .map((t) => `<li><code>${t}</code>${esc(S.relMeaning[t] || '')}</li>`)
      .join('');
    o.push(`<div class="topo-view" role="tabpanel" id="${cid}-view-${v.id}" aria-labelledby="${cid}-tab-${v.id}" data-view="${v.id}">`);
    o.push(`<h3 class="print-only">${v.title}</h3>`);
    o.push(edges.length
      ? `<div class="graph-wrap">${renderGraph(graph, { id: `${cid}-${v.id}`, title: `${cid} ${v.title}` })}</div><ul class="rel-legend">${legend}</ul>`
      : '<p class="empty">本例没有这类边。</p>');
    o.push('</div>');
  }
  o.push(`<div class="topo-detail" aria-live="polite"><p class="hint">选中节点后，这里列出与它相连的边，以及每条边的传递内容、时机、约束和失败处理。</p></div>`);
  o.push('</div>');

  // edge data for the detail panel
  const edgeData = topo.edges.map((e) => ({
    t: e.type, f: e.from, to: e.to, p: e.payload, tm: TIMING_ZH[e.timing] || e.timing, i: e.invariant, x: e.failure, b: BASIS_ZH[e.basis] || e.basis,
  }));
  const nodeData = Object.fromEntries(topo.nodes.map((n) => [n.id, { l: n.label, k: NODE_TYPE_ZH[n.type] || n.type, a: n.authority, s: n.tenant_scope }]));
  o.push(`<script type="application/json" class="topo-data">${JSON.stringify({ e: edgeData, n: nodeData }).replace(/</g, '\\u003c')}</script>`);

  // nodes by type
  o.push('<details class="block"><summary>节点：身份、权威与租户范围</summary><div class="table-wrap"><table><thead><tr><th>类型</th><th>节点</th><th>权威</th><th>租户范围</th></tr></thead><tbody>');
  for (const n of topo.nodes) {
    o.push(`<tr><td>${esc(NODE_TYPE_ZH[n.type] || n.type)}</td><td>${esc(n.label)}<br><code>${esc(short(n.id))}</code></td><td>${esc(n.authority)}</td><td>${esc(n.tenant_scope)}</td></tr>`);
  }
  o.push('</tbody></table></div></details>');

  // lifecycles
  o.push(`<h3 id="case-lifecycles">对象生命周期</h3>`);
  for (const lc of topo.lifecycles) {
    const n = nodeById[lc.object_id];
    o.push(`<details class="block lifecycle"><summary>${esc(n ? n.label : lc.object_id)}<span class="states">${lc.states.map((s) => `<code>${esc(s)}</code>`).join(' ')}</span></summary>`);
    o.push('<div class="table-wrap"><table><thead><tr><th>转换</th><th>触发</th><th>guard</th><th>持久效果</th><th>恢复</th></tr></thead><tbody>');
    for (const t of lc.transitions) {
      o.push(`<tr><td><code>${esc(t.from)}</code> → <code>${esc(t.to)}</code></td><td>${esc(t.trigger)}</td><td>${esc(t.guard)}</td><td>${esc(t.durable_effect)}</td><td>${esc(t.recovery)}</td></tr>`);
    }
    o.push('</tbody></table></div></details>');
  }

  // checks
  o.push(`<h3 id="case-checks">检查定义</h3>`);
  o.push(`<details class="block"><summary>${topo.checks.length} 条检查定义</summary><div class="table-wrap"><table><thead><tr><th>类别</th><th>前提</th><th>动作</th><th>预期结果</th><th>所需证据</th></tr></thead><tbody>`);
  for (const c of topo.checks) {
    o.push(`<tr><td><code>${esc(c.kind)}</code></td><td>${esc(c.given)}</td><td>${esc(c.when)}</td><td>${esc(c.then)}</td><td>${esc(c.evidence_required)}</td></tr>`);
  }
  o.push('</tbody></table></div></details>');

  // transfers
  const out = S.transfers.filter((t) => t.from === cid);
  const inn = S.transfers.filter((t) => t.to === cid);
  o.push(`<h3 id="case-transfers">迁移</h3><p>迁移是编订推理，从学过的案例指向变式；目标行业的制度与批准权要重新查证。</p>`);
  const tr = (t, dir) => {
    const other = dir === 'out' ? t.to : t.from;
    return `<li class="transfer"><p class="tr-head"><a href="${esc(caseHref(other))}">${dir === 'out' ? `→ ${other}` : `${other} →`}</a><span class="tr-type">${esc(S.transferType[t.type] || t.type)}</span><code>${esc(t.id)}</code></p>
<dl><dt>保留的机制</dt><dd>${esc(t.preserved_mechanism)}</dd><dt>前提</dt><dd>${esc(t.precondition)}</dd><dt>改变的条件</dt><dd>${esc(t.changed_condition)}</dd><dt>反例</dt><dd>${esc(t.counterexample)}</dd><dt>可观察的检查</dt><dd>${esc(t.observable_check)}</dd></dl></li>`;
  };
  if (out.length) o.push(`<h4>从 ${cid} 迁出</h4><ul class="transfers">${out.map((t) => tr(t, 'out')).join('')}</ul>`);
  if (inn.length) o.push(`<h4>迁入 ${cid}</h4><ul class="transfers">${inn.map((t) => tr(t, 'in')).join('')}</ul>`);
  if (!out.length && !inn.length) o.push('<p class="empty">精选迁移图中没有与本例相连的边。</p>');
  o.push('</section>');
  return o.join('\n');
}
