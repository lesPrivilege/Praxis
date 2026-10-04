// 本批的自动检查。分两段：
// 1. 静态：在 Node 里改输入、重新生成，再读生成的 SVG 文本下断言。
// 2. 浏览器：把全部 SVG 放进一页，用本机 Chrome 无界面模式量实际文字框、查引用是否留在本实例内。
// 用法：node src/check.mjs（先跑 build）。Chrome 路径可用环境变量 CHROME 指定；找不到时第二段记为未运行。

import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import os from 'node:os';
import { Refusal } from './kernel.mjs';
import { HERE, GEN, NARROW, cases, fixtures, edits, f01ToTracks, f02ToTracks, foldF02, f06ToQualify } from './cases.mjs';

const results = [];
const check = (id, name, fn) => {
  try {
    const detail = fn();
    results.push({ id, name, pass: true, detail });
  } catch (e) {
    results.push({ id, name, pass: false, detail: e.message });
  }
};
const must = (ok, msg) => {
  if (!ok) throw new Error(msg);
};
const clone = (o) => structuredClone(o);
const all = cases();
const byId = (id) => all.find((c) => c.id === id);
const draw = (asset, model, width = NARROW, scope = 'chk') => GEN[asset](model, { width, scope });
const attrsOf = (svg, re) => [...svg.matchAll(re)].map((m) => m[1]);
const objects = (svg) => new Set(attrsOf(svg, /data-object-id="([^"]*)"/g));
const edges = (svg) => [...svg.matchAll(/<path[^>]*data-edge-id="([^"]*)"[^>]*data-from="([^"]*)"[^>]*data-to="([^"]*)"/g)].map(([, id, from, to]) => ({ id, from, to }));
const unescape = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const textOf = (svg, key) => {
  const m = svg.match(new RegExp(`<text[^>]*data-text="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>(.*?)</text>`));
  return m ? unescape(m[1].replace(/<[^>]+>/g, '')) : null;
};
const group = (svg, attr, value) => {
  const m = svg.match(new RegExp(`<g[^>]*${attr}="${value}"[^>]*>`));
  return m ? m[0] : null;
};
const F = fixtures();
const WIDTHS = [NARROW, 672];

check('A01', '语义编辑：换对象、增删节点、重绑一条关系', () => {
  const m = clone(byId('fan-branch').model);
  const before = draw('rel-fan', m);
  m.spokes[0].node = { id: 'lend-today', label: '当日办理出借手续' };
  m.spokes.splice(2, 1);
  m.spokes.splice(1, 0, { edge_id: 'reference', state: 'established', label: '馆藏属于参考工具书', basis: { id: 'rule-loan', label: '借阅规则', version: 3, locator: '第 4 条' }, node: { id: 'in-house', label: '只在馆内阅览' } });
  m.spokes.find((s) => s.edge_id === 'on-loan').node = { id: 'waitlist', label: '进入等候名单' };
  const notes = [];
  for (const w of WIDTHS) {
    const after = draw('rel-fan', m, w);
    const objs = objects(after.svg);
    const es = edges(after.svg);
    must(es.length === m.spokes.length, `宽 ${w}：关系数 ${es.length} 与输入 ${m.spokes.length} 不符`);
    must(es.every((e) => objs.has(e.from) && objs.has(e.to)), `宽 ${w}：有端点不在图里`);
    must(!objs.has('lend') && !objs.has('reading-room') && !objs.has('reserve'), `宽 ${w}：旧对象还在`);
    must(es.find((e) => e.id === 'on-loan').to === 'waitlist', `宽 ${w}：on-loan 没有改接`);
    must(textOf(after.svg, 'lend-today.label') === '当日办理出借手续', `宽 ${w}：新标签不是文字节点`);
    must(after.equivalent.items.some((x) => x.includes('进入等候名单')) && !after.equivalent.items.some((x) => x.includes('登记预约')), `宽 ${w}：等效文字没有同步`);
    notes.push(`宽 ${w}：${es.length} 条关系、${objs.size} 个对象`);
  }
  must(edges(before.svg).length === 4, '基线应有 4 条关系');
  return `改了 4 处输入，没有手改路径。${notes.join('；')}`;
});

check('A02', '文字与几何分离：四倍长、混排、手动换行', () => {
  const base = f06ToQualify(F.F06);
  const long = f06ToQualify(edits.f06Long(F.F06));
  const notes = [];
  for (const w of WIDTHS) {
    const a = draw('rel-qualify', base, w);
    const b = draw('rel-qualify', long, w);
    const src = long.qualifiers[0].text;
    must(textOf(b.svg, 'condition-1.text').replace(/\s/g, '') === src.replace(/\s/g, ''), `宽 ${w}：条件文字与输入不一致`);
    must((a.svg.match(/<text/g) ?? []).length === (b.svg.match(/<text/g) ?? []).length, `宽 ${w}：文字节点数变了`);
    must((a.svg.match(/<path/g) ?? []).length === (b.svg.match(/<path/g) ?? []).length, `宽 ${w}：路径数变了`);
    must(b.height > a.height, `宽 ${w}：高度没有随文字增长`);
    notes.push(`宽 ${w}：高 ${a.height} → ${b.height}`);
  }
  return `文字节点数和路径数不变，只有位置重排。${notes.join('；')}`;
});

check('A02b', '全部产物：没有曲线路径，文字都是文字节点', () => {
  const files = fs.readdirSync(path.join(HERE, 'svg')).filter((n) => n.endsWith('.svg'));
  let texts = 0;
  let paths = 0;
  for (const n of files) {
    const svg = fs.readFileSync(path.join(HERE, 'svg', n), 'utf8');
    for (const d of attrsOf(svg, /<path[^>]* d="([^"]*)"/g)) {
      paths++;
      must(/^[MLHVZ0-9 .\-]+$/.test(d), `${n}：路径含曲线命令 ${d.slice(0, 40)}`);
      must(d.split(/[MLHV]/).length <= 8, `${n}：路径段数异常，像是转了轮廓`);
    }
    texts += (svg.match(/<text/g) ?? []).length;
    const keys = attrsOf(svg, /data-text="([^"]*)"/g);
    must(new Set(keys).size === keys.length, `${n}：data-text 有重复`);
  }
  return `${files.length} 个文件，${texts} 个文字节点，${paths} 条路径，路径全部是直线段`;
});

check('A03', '准确作用范围：括线量的是目标主张', () => {
  const notes = [];
  const run = (label, model, target, other) => {
    for (const w of WIDTHS) {
      const res = draw('rel-qualify', model, w);
      const br = res.brackets.find((b) => b.qualifiers.includes('condition-1'));
      const box = res.boxes[target];
      const off = res.boxes[other];
      const q = res.boxes['condition-1'];
      must(br.target === target, `${label} 宽 ${w}：括线目标是 ${br.target}`);
      must(Math.abs(br.y1 - box.y) <= 3 && Math.abs(br.y2 - (box.y + box.h)) <= 3, `${label} 宽 ${w}：括线 ${br.y1}–${br.y2} 与主张 ${box.y}–${box.y + box.h} 不齐`);
      must(br.y2 <= off.y || br.y1 >= off.y + off.h, `${label} 宽 ${w}：括线碰到了另一项主张`);
      must(w >= 560 || br.y2 <= q.y, `${label} 宽 ${w}：括线圈进了条件自己`);
      must(new RegExp(`data-leader-for="condition-1" data-target="${target}"`).test(res.svg), `${label} 宽 ${w}：引线目标不对`);
      notes.push(`${label} 宽 ${w}：括线 ${br.y1}–${br.y2}，主张 ${box.y}–${box.y + box.h}`);
    }
  };
  run('原输入', f06ToQualify(F.F06), 'claim-A', 'claim-B');
  run('四倍长', f06ToQualify(edits.f06Long(F.F06)), 'claim-A', 'claim-B');
  run('改目标', f06ToQualify(edits.f06Retarget(F.F06)), 'claim-B', 'claim-A');
  return notes.join('；');
});

const idScan = (svgs) => {
  const seen = new Map();
  const dangling = [];
  for (const svg of svgs) {
    const own = new Set(attrsOf(svg, / id="([^"]*)"/g));
    for (const id of own) seen.set(id, (seen.get(id) ?? 0) + 1);
    const refs = [...attrsOf(svg, /url\(#([^)]*)\)/g), ...attrsOf(svg, /aria-labelledby="([^"]*)"/g).flatMap((s) => s.split(' ')), ...attrsOf(svg, /href="#([^"]*)"/g)];
    for (const ref of refs) if (!own.has(ref)) dangling.push(ref);
  }
  return { ids: seen.size, duplicates: [...seen].filter(([, n]) => n > 1).map(([id]) => id), dangling };
};

check('A04', '多实例：十个同款加三个异款，ID 与引用各自隔离', () => {
  const m = byId('fan-join').model;
  const ten = Array.from({ length: 10 }, (_, i) => draw('rel-fan', m, NARROW, `inst-${i}`).svg);
  const others = ['scope-library', 'f06-scope', 'f01-versions'].map((id) => draw(byId(id).asset, byId(id).model, NARROW, `other-${id}`).svg);
  const scan = idScan([...ten, ...others]);
  must(!scan.duplicates.length, `重复 ID：${scan.duplicates.join(', ')}`);
  must(!scan.dangling.length, `引用指到实例之外：${scan.dangling.join(', ')}`);
  const control = idScan([draw('rel-fan', m, NARROW, 'same').svg, draw('rel-fan', m, NARROW, 'same').svg]);
  must(control.duplicates.length > 0, '对照失败：同一个 scope 用两次，检查器没有报重复');
  return `13 个实例共 ${scan.ids} 个 ID，无重复、无越界引用；对照（同一 scope 用两次）报出 ${control.duplicates.length} 个重复`;
});

check('A07', '版本绑定：材料更新不带动旧阅读和事项', () => {
  const basisOf = (svg, id) => group(svg, 'data-binding-id', id)?.match(/data-basis="([^"]*)"/)?.[1];
  const now = draw('rel-tracks', f01ToTracks(F.F01)).svg;
  must(basisOf(now, 'reading-demo-01') === 'material-demo-01@1#§4', `旧阅读的依据是 ${basisOf(now, 'reading-demo-01')}`);
  must(/data-version="material-demo-01@2" data-current="true"/.test(now), '材料 v2 没有标为当前');
  must(/data-version="matter-demo-01@8"/.test(now) && !/data-version="matter-demo-01@9"/.test(now), '事项版本变了');
  must(!/data-origin="human" data-state="recorded" data-basis="material-demo-01@2/.test(now), 'v2 下出现了人的阅读记录');
  must(/data-absence-at="material-demo-01@2"/.test(now), 'v2 没有标出“无人阅读”');
  must(/data-binding-id="proposal-demo-01" data-origin="machine" data-state="proposed"/.test(now), '机器建议被画成了已成立');
  must(/data-binding-id="decision-pending" data-origin="human" data-state="open"/.test(now), '人的决定没有标为待定');
  const next = draw('rel-tracks', f01ToTracks(edits.f01Next(F.F01))).svg;
  must(basisOf(next, 'reading-demo-01') === 'material-demo-01@1#§4' && basisOf(next, 'reading-demo-02') === 'material-demo-01@2#§4', '第二步后两条阅读的依据不对');
  must(/data-version="matter-demo-01@9"/.test(next) && !/data-absence-at="material-demo-01@2"/.test(next), '第二步后事项版本或空缺说明不对');
  const bad = draw('rel-tracks', f01ToTracks(edits.f01Rebound(F.F01))).svg;
  must(basisOf(bad, 'reading-demo-01') === 'material-demo-01@2#§4' && /data-absence-at="material-demo-01@1"/.test(bad), '反例输入没有照实画出');
  return '材料 v2 到达后，旧阅读仍绑 material-demo-01@1#§4，v2 标为无人阅读，事项停在 v8；第二步两条阅读各绑各的版本；反例输入画出来与正确图不同（阅读挂在 v2 下，v1 变成无人阅读）';
});

check('A08', '候选、拒绝与重放', () => {
  const fold = foldF02(F.F02);
  must(fold.events.length === 2 && fold.versions.length === 1 && fold.versions[0].rev === 2, `折叠结果：${fold.events.length} 条事件、${fold.versions.length} 个版本`);
  const res = draw('rel-tracks', f02ToTracks(F.F02));
  must(/data-binding-id="e1" data-state="rejected"/.test(res.svg), '候选没有标为已拒绝');
  must(textOf(res.svg, 'e1.resolution').includes('重放 1 次，未重复生效'), '重放没有写出');
  must(!/data-version="object-demo-02@3"/.test(res.svg) && textOf(res.svg, 'object-demo-02@2.label').includes('期限 12 个月'), '对象被改动了');
  must(textOf(res.svg, 'context.text').includes('付款'), '未选入的字段没有写出');
  const g = clone(F.F02);
  g.events = [g.events[0], { id: 'e3', kind: 'accept', candidate: 'e1' }, { id: 'e3', kind: 'accept', candidate: 'e1', replay: true }];
  const acc = draw('rel-tracks', f02ToTracks(g));
  must(/data-version="object-demo-02@3" data-current="true"/.test(acc.svg) && !/data-version="object-demo-02@4"/.test(acc.svg), '接受后应只多出 v3');
  must(textOf(acc.svg, 'object-demo-02@3.label').includes('期限 24 个月') && textOf(acc.svg, 'object-demo-02@3.label').includes('付款 季度'), 'v3 的字段不对');
  must(/data-binding-id="context"[^>]*data-basis="object-demo-02@2"/.test(acc.svg), '上下文应仍绑定 v2');
  return '唯一事件 2 条，拒绝留在记录里，对象停在 v2；把拒绝换成接受并重放一次，只多出 v3，旧上下文仍绑 v2';
});

check('A11', '安全：没有可执行内容和外部引用，标签按文字插入', () => {
  const files = fs.readdirSync(path.join(HERE, 'svg')).filter((n) => n.endsWith('.svg'));
  const banned = [/<script/i, /\son[a-z]+\s*=/i, /<foreignObject/i, /<image/i, /<style/i, /<!DOCTYPE/i, /<!ENTITY/i, /href\s*=/i, /url\((?!#)/i, /javascript:/i, /@import/i];
  for (const n of files) {
    const svg = fs.readFileSync(path.join(HERE, 'svg', n), 'utf8');
    for (const re of banned) must(!re.test(svg), `${n} 含 ${re}`);
  }
  const evil = '<script>alert(1)</script> & "x" onload=y';
  const m = clone(byId('fan-link').model);
  m.spokes[0].node.label = evil;
  m.title = evil;
  const svg = draw('rel-fan', m).svg;
  must(!/<script/i.test(svg) && svg.includes('&lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;x&quot;'), '标签没有被转义');
  must(textOf(svg, 'rule-loan-3-5.label').replace(/\s/g, '') === evil.replace(/\s/g, ''), '转义后的文字与输入不一致');
  return `${files.length} 个文件无 script、事件属性、外链、style、foreignObject、image、DOCTYPE、实体；注入的 <script> 字样作为文字显示`;
});

check('A14', '拒用：越界输入给出理由，不硬画', () => {
  const refused = all.filter((c) => c.role === 'refuse');
  for (const c of refused) {
    let code = null;
    try {
      draw(c.asset, c.model);
    } catch (e) {
      must(e instanceof Refusal, `${c.id} 抛出的不是拒用：${e.message}`);
      code = e.code;
    }
    must(code === c.refuse, `${c.id}：应为 ${c.refuse}，实际 ${code}`);
  }
  let nine = null;
  try {
    const m = clone(byId('fan-branch-8').model);
    m.spokes.splice(7, 0, { edge_id: 'b9', state: 'established', label: '第九条', node: { id: 'n9', label: '第九个去向' } });
    draw('rel-fan', m);
  } catch (e) {
    nine = e.code;
  }
  must(nine === 'capacity', '九条分支没有按容量拒用');
  return `${refused.length} 份越界输入全部按预期代码拒用；九条分支按 capacity 拒用`;
});

check('B01', '边界数量：1 条输入的汇合、单层容器、无跨界、无限定语', () => {
  const j = clone(byId('fan-join').model);
  j.spokes = j.spokes.slice(0, 1);
  const s = { title: '单层', containers: [{ id: 'a', label: '阅览区', boundary: '开放范围' }], members: [] };
  const q = { title: '只有主张', claims: [{ id: 'c', text: '古籍阅览室每周开放三天。' }] };
  for (const w of WIDTHS) {
    draw('rel-fan', j, w);
    draw('rel-scope', s, w);
    draw('rel-qualify', q, w);
  }
  return '两种宽度下都能生成';
});

const codeOf = (fn) => {
  try {
    fn();
    return null;
  } catch (e) {
    return e instanceof Refusal ? e.code : `非拒用错误：${e.message}`;
  }
};
const HUB = { id: 'h', label: '中心' };
const SYN = { text: '合成' };
const sp = (o = {}) => ({ edge_id: 'e1', label: '条件', basis: SYN, state: 'established', node: { id: 'n1', label: '去向' }, ...o });
const lane = { id: 'm', versions: [{ version: 1 }, { version: 2, current: true }] };
const bind = (o = {}) => ({ id: 'b1', kind: '阅读', state: 'recorded', text: '已读', basis: [{ id: 'm', version: 1 }], ...o });
const claim = { id: 'a', text: '古籍阅览室每周开放三天。' };

check('B02', '独立复查发现的越界输入：现在都以拒用收场', () => {
  const f02 = (events) => () => f02ToTracks({ ...clone(F.F02), events });
  const [e1, e2] = F.F02.events;
  const table = [
    ['分支状态写成 rejected', 'state', () => draw('rel-fan', { title: 't', direction: 'out', hub: HUB, spokes: [sp({ state: 'rejected' })] })],
    ['汇合的输入带 default', 'default', () => draw('rel-fan', { title: 't', direction: 'in', rule: 'all', hub: HUB, spokes: [sp({ default: true })] })],
    ['既有默认分支又写 no_default', 'default', () => draw('rel-fan', { title: 't', direction: 'out', no_default: '条件穷尽', hub: HUB, spokes: [sp(), sp({ edge_id: 'e2', default: true, node: { id: 'n2', label: '其他' } })] })],
    ['关系与端点同名', 'duplicate-id', () => draw('rel-fan', { title: 't', direction: 'out', hub: HUB, spokes: [sp({ edge_id: 'n1' })] })],
    ['没有 title', 'title', () => draw('rel-fan', { direction: 'out', hub: HUB, spokes: [sp()] })],
    ['id 含空格', 'id', () => draw('rel-fan', { title: 't', direction: 'out', hub: { id: 'a b', label: '中心' }, spokes: [sp()] })],
    ['两端都不在任何容器里', 'not-crossing', () => draw('rel-scope', { title: 't', containers: [{ id: 'c', label: '甲', boundary: '合成' }], members: [{ id: 'm1', label: 'M1', container: null }, { id: 'm2', label: 'M2' }], crossings: [{ edge_id: 'x', from: 'm1', to: 'm2', kind: 'k', basis: SYN, state: 'established' }] })],
    ['跨界关系状态写成 proposed', 'state', () => draw('rel-scope', { title: 't', containers: [{ id: 'c', label: '甲', boundary: '合成' }], members: [{ id: 'm1', label: 'M1', container: 'c' }, { id: 'm2', label: 'M2' }], crossings: [{ edge_id: 'x', from: 'm1', to: 'm2', kind: 'k', basis: SYN, state: 'proposed' }] })],
    ['一个成员上接五条跨界关系', 'capacity', () => draw('rel-scope', { title: 't', containers: [{ id: 'c', label: '甲', boundary: '合成' }], members: [{ id: 'm1', label: 'M1', container: 'c' }, { id: 'm2', label: 'M2' }], crossings: [1, 2, 3, 4, 5].map((i) => ({ edge_id: `x${i}`, from: 'm1', to: 'm2', kind: 'k', basis: SYN, state: 'established' })) })],
    ['片段是空字符串', 'fragment', () => draw('rel-qualify', { title: 't', claims: [claim], qualifiers: [{ id: 'q', type: 'note', text: '注', target: { claim: 'a', fragment: '' } }] })],
    ['片段只有换行', 'fragment', () => draw('rel-qualify', { title: 't', claims: [{ id: 'a', text: '第一行\n第二行' }], qualifiers: [{ id: 'q', type: 'note', text: '注', target: { claim: 'a', fragment: '\n' } }] })],
    ['同时写 claim 和 claims', 'target', () => draw('rel-qualify', { title: 't', claims: [claim], qualifiers: [{ id: 'q', type: 'note', text: '注', target: { claim: 'a', claims: ['a'] } }] })],
    ['限定语与主张同名', 'duplicate-id', () => draw('rel-qualify', { title: 't', claims: [claim], qualifiers: [{ id: 'a', type: 'note', text: '注', target: { claim: 'a' } }] })],
    ['整体说明没有 id', 'id', () => draw('rel-qualify', { title: 't', claims: [claim], global_notes: [{ text: '说明' }] })],
    ['已核对的证据版本是空串', 'anchor', () => draw('rel-qualify', { title: 't', claims: [claim], qualifiers: [{ id: 'q', type: 'evidence', relation: 'supports', status: 'verified', target: { claim: 'a' }, source: { id: 's', version: '', locator: 'p' } }] })],
    ['绑定与版本线同名', 'duplicate-id', () => draw('rel-tracks', { title: 't', lanes: [lane], bindings: [bind({ id: 'm' })] })],
    ['id 里带 @', 'id', () => draw('rel-tracks', { title: 't', lanes: [lane], bindings: [bind({ id: 'm@1' })] })],
    ['依据是 null', 'dangling-basis', () => draw('rel-tracks', { title: 't', lanes: [lane], bindings: [bind({ basis: [null] })] })],
    ['同一个版本写两次', 'duplicate-basis', () => draw('rel-tracks', { title: 't', lanes: [lane], bindings: [bind({ basis: [{ id: 'm', version: 1 }, { id: 'm', version: 1 }] })] })],
    ['先拒绝又接受同一个候选', 'conflict', f02([e1, e2, { id: 'e3', kind: 'accept', candidate: 'e1' }])],
    ['两个事件各接受一次', 'conflict', f02([e1, { id: 'e3', kind: 'accept', candidate: 'e1' }, { id: 'e4', kind: 'accept', candidate: 'e1' }])],
    ['接受一个不存在的候选', 'illegal-event', f02([e1, { id: 'e3', kind: 'accept', candidate: 'nope' }])],
    ['接受的对象不是候选', 'illegal-event', f02([e1, e2, { id: 'e3', kind: 'accept', candidate: 'e2' }])],
    ['同一事件 id 第二次内容不同', 'conflict', f02([e1, e2, { ...e2, reason: '另一个理由' }])],
  ];
  const wrong = table.map(([name, code, fn]) => [name, code, codeOf(fn)]).filter(([, code, got]) => got !== code);
  must(!wrong.length, wrong.map(([name, code, got]) => `${name}：应为 ${code}，实际 ${got ?? '画出来了'}`).join('；'));
  return `${table.length} 种输入全部按预期代码拒用`;
});

check('B03', '独立复查发现的误导画法：现在图里写明', () => {
  for (const w of WIDTHS) {
    const nd = draw('rel-fan', { title: 't', direction: 'out', basis: { id: 'rule-loan', label: '借阅规则', version: 3 }, no_default: '两个条件已经穷尽', hub: HUB, spokes: [sp({ basis: undefined }), sp({ edge_id: 'e2', basis: undefined, node: { id: 'n2', label: '其他' } })] }, w).svg;
    must(textOf(nd, 'h.basis') === '依据：借阅规则 v3' && textOf(nd, 'h.no-default') === '没有默认分支：两个条件已经穷尽', `宽 ${w}：共用依据或“没有默认分支”没有画进图里`);
    const two = { title: 't', lanes: [lane, { id: 'r', versions: [{ version: 3, current: true }] }], bindings: [bind({ id: 'd4', state: 'rejected', basis: [{ id: 'm', version: 1 }, { id: 'r', version: 3 }] }), bind({ id: 'done', kind: '决定', state: 'decided', basis: [{ id: 'm', version: 2 }] }), bind({ id: 'wait', kind: '决定', state: 'open', basis: [{ id: 'm', version: 2 }] })] };
    const tr = draw('rel-tracks', two, w).svg;
    must(textOf(tr, 'd4.ref.r@3').includes('已拒绝'), `宽 ${w}：第二个依据处没有写出状态`);
    must(/stroke-dasharray="4 3"[^>]*data-link-for="d4" data-to="r@3"/.test(tr), `宽 ${w}：第二个依据处的接线仍是实线`);
    const head = (id) => tr.match(new RegExp(`<text[^>]*fill="([^"]*)"[^>]*data-text="${id}.head"`))[1];
    must(head('done') !== '#1f5fd1' && head('wait') === '#1f5fd1', `宽 ${w}：已作出的决定仍是蓝色，或待定的不是蓝色`);
    const fr = draw('rel-qualify', { title: 't', claims: [{ id: 'a', text: '甲方案须在周一提交，乙方案须在周三提交。' }], qualifiers: [{ id: 'q0', type: 'condition', text: '仅甲方案', target: { claim: 'a', fragment: '甲方案' } }, { id: 'q1', type: 'evidence', relation: 'supports', status: 'verified', source: { id: 's', version: 1, locator: 'p' }, target: { claim: 'a', fragment: '乙方案' } }] }, w).svg;
    must(textOf(fr, 'q0.head') === '条件 · 限于“甲方案”' && textOf(fr, 'q1.head') === '证据 · 支持 · 限于“乙方案”', `宽 ${w}：限定语标题没有引出片段`);
    const part = draw('rel-qualify', { title: 't', require_evidence: true, claims: [{ id: 'a', text: '开放三天，另有夜场两天。' }], qualifiers: [{ id: 'q1', type: 'evidence', relation: 'supports', status: 'verified', source: { id: 's', version: 1, locator: 'p' }, target: { claim: 'a', fragment: '开放三天' } }] }, w).svg;
    must(textOf(part, 'a.no-evidence.head') === '证据 · 尚无', `宽 ${w}：只有片段有证据时，整项主张没有标“尚无”`);
  }
  must(!/\uffff/.test(draw('rel-fan', { title: 't', direction: 'out', hub: HUB, spokes: [sp({ label: 'a\uffffb' })] }).svg), 'U+FFFF 没有被去掉');
  const only = draw('rel-fan', byId('fan-link').model);
  must(only.equivalent.summary.includes('引用') && only.equivalent.summary.includes('由前者指向后者'), '单条关系的说明没有写出类型和方向');
  return '共用依据与“没有默认分支”画进图里；第二个依据处带状态和虚线；只有待定的决定用蓝色；限定语标题引出片段；只限定片段的证据不算整项主张有证据';
});

check('B04', '第二轮复查发现的问题：缺省、原型键、假版本、组合的边界', () => {
  const ev = (source, extra = {}) => () => draw('rel-qualify', { title: 't', claims: [claim], qualifiers: [{ id: 'q', type: 'evidence', relation: 'supports', status: 'verified', target: { claim: 'a' }, source, ...extra }] });
  const sheetOf = (pieces, width = 480) => () => GEN['rel-sheet']({ title: 't', pieces }, { width, scope: 'chk' });
  const tr = (id = 'r') => ({ asset: 'rel-tracks', heading: `版本 ${id}`, model: { title: 't', lanes: [{ id: 'r', label: '规则', versions: [{ version: 1 }, { version: 2, current: true }] }] } });
  const fn = (basis) => ({ asset: 'rel-fan', heading: '分支', model: { title: 't', direction: 'out', hub: HUB, spokes: [sp({ basis })] } });
  const table = [
    ['分支没有写状态', 'state', () => draw('rel-fan', { title: 't', direction: 'out', hub: HUB, spokes: [sp({ state: undefined })] })],
    ['跨界关系没有写状态', 'state', () => draw('rel-scope', { title: 't', containers: [{ id: 'c', label: '甲', boundary: '合成' }], members: [{ id: 'm1', label: 'M1', container: 'c' }, { id: 'm2', label: 'M2' }], crossings: [{ edge_id: 'x', from: 'm1', to: 'm2', kind: 'k', basis: SYN }] })],
    ['归属写成 constructor', 'origin', () => draw('rel-tracks', { title: 't', lanes: [lane], bindings: [bind({ origin: 'constructor' })] })],
    ['证据关系写成 constructor', 'relation', ev({ id: 's', version: 1, locator: 'p' }, { relation: 'constructor' })],
    ['限定语类型写成 toString', 'type', () => draw('rel-qualify', { title: 't', claims: [claim], qualifiers: [{ id: 'q', type: 'toString', text: 'x', target: { claim: 'a' } }] })],
    ['汇合规则写成 toString', 'rule', () => draw('rel-fan', { title: 't', direction: 'in', rule: 'toString', hub: HUB, spokes: [sp()] })],
    ['已核对的证据版本是 latest', 'anchor', ev({ id: 's', version: 'latest', locator: 'p' })],
    ['已核对的证据版本是 v3', 'anchor', ev({ id: 's', version: 'v3', locator: 'p' })],
    ['已核对的证据版本是 NaN', 'anchor', ev({ id: 's', version: NaN, locator: 'p' })],
    ['已核对的证据版本是 true', 'anchor', ev({ id: 's', version: true, locator: 'p' })],
    ['位置只有空格', 'anchor', ev({ id: 's', version: 1, locator: ' ' })],
    ['名字是空串', 'anchor', ev({ id: 's', label: '', version: 1, locator: 'p' })],
    ['同时写 id 和 text', 'anchor', ev({ id: 's', text: '口述', version: 1, locator: 'p' })],
    ['绑定的依据没有版本', 'no-version', () => draw('rel-tracks', { title: 't', lanes: [lane], bindings: [bind({ basis: [{ id: 'm' }] })] })],
    ['组合里的 asset 是 constructor', 'pieces', sheetOf([{ asset: 'constructor', heading: 'x', model: {} }, tr()])],
    ['组合宽度 672', 'capacity', sheetOf([fn({ id: 'r', version: 2 }), tr()], 672)],
    ['同一个版本在另外两件里都画了', 'ambiguous-target', sheetOf([fn({ id: 'r', version: 2 }), tr('甲'), tr('乙')])],
    ['指向的 id 里带 @', 'id', sheetOf([fn({ id: 'r@2' }), tr()])],
    ['同一个对象两处名字不同', 'inconsistent-label', sheetOf([fn({ id: 'r', label: '规则', version: 2 }), { ...fn({ id: 'r', label: '借阅规则', version: 1 }), heading: '另一个分支', model: { title: 't', direction: 'out', hub: { id: 'h2', label: '中心' }, spokes: [sp({ edge_id: 'e2', basis: { id: 'r', label: '借阅规则', version: 1 }, node: { id: 'n2', label: '去向' } })] } }, tr()])],
  ];
  const wrong = table.map(([name, code, f]) => [name, code, codeOf(f)]).filter(([, code, got]) => got !== code);
  must(!wrong.length, wrong.map(([name, code, got]) => `${name}：应为 ${code}，实际 ${got ?? '画出来了'}`).join('；'));

  // 该画出来的仍然画得出来
  must(codeOf(() => draw('rel-tracks', { title: 't', lanes: [{ id: 'constructor', versions: [{ version: 1, current: true }] }] })) === null, '名叫 constructor 的版本线被误拒');
  must(codeOf(() => draw('rel-tracks', { title: 't', lanes: [lane], bindings: [bind({ basis: [{ id: 'm', version: '2' }] })] })) === null, '写成字符串 "2" 的版本没有对上数字 2');

  for (const w of WIDTHS) {
    const allPending = clone(byId('fan-join').model);
    allPending.spokes.forEach((x) => (x.state = 'pending'));
    const fj = draw('rel-fan', allPending, w).svg;
    must(textOf(fj, 'in-fire.sub').includes('尚未成立'), `宽 ${w}：未成立的输入旁边没有写“尚未成立”`);
    must(textOf(fj, 'opening.arrived').includes('汇合条件未满足'), `宽 ${w}：汇合没有写是否满足`);
    must(/data-role="legend"/.test(fj) && !fj.includes('>已确认<'), `宽 ${w}：只有虚线时没有图例，或图例列了图里没有的端点`);
    const sc = clone(byId('scope-library').model);
    sc.crossings.forEach((x) => (x.state = 'pending'));
    must(textOf(draw('rel-scope', sc, w).svg, 'fetch.key').includes('尚未成立'), `宽 ${w}：未成立的跨界关系没有写“尚未成立”`);
    const ro = draw('rel-tracks', { title: 't', lanes: [lane], bindings: [bind(), bind({ id: 'wait', kind: '决定', state: 'open', basis: [{ id: 'm', version: 2 }] })] }, w).svg;
    must(ro.includes('等人决定') && !ro.includes('>未确认<'), `宽 ${w}：图里只有蓝色的空心端点，图例却列了普通的“未确认”`);
  }
  const sh = GEN['rel-sheet'](byId('sheet-rare-book').model, { width: 480, scope: 'chk' });
  must(sh.links.length === 4 && sh.equivalent.notes.every((t) => !/@|#/.test(t)), '组合的等效文字里出现了给程序用的键');
  must(/data-basis="slip-D-12@1"/.test(sh.svg) && !/data-basis="[^"]* [^"]*@/.test(sh.svg), 'data-basis 仍把几条指向用空格拼在一起');
  return `${table.length} 种输入按预期代码拒用；未成立的关系和汇合都写了词；图例只列图里有的画法；组合的等效文字用读者的写法`;
});

check('A11b', '四个生成器都按文字插入不可信标签', () => {
  const evil = '<script>alert(1)</script>&"';
  const svgs = [
    draw('rel-fan', { title: evil, direction: 'out', hub: { id: 'h', label: evil }, spokes: [sp({ label: evil, basis: { text: evil }, node: { id: 'n1', label: evil } })] }).svg,
    draw('rel-scope', { title: evil, containers: [{ id: 'c', label: evil, boundary: evil }], members: [{ id: 'm1', label: evil, container: 'c' }, { id: 'm2', label: evil }], crossings: [{ edge_id: 'x', from: 'm1', to: 'm2', kind: evil, basis: { id: 'src', label: evil }, status: evil, state: 'established' }] }).svg,
    draw('rel-qualify', { title: evil, claims: [{ id: 'a', text: evil }], qualifiers: [{ id: 'q', type: 'evidence', relation: 'limits', status: 'inferred', source: { text: evil }, text: evil, target: { claim: 'a', fragment: 'alert' } }], global_notes: [{ id: 'g', text: evil }] }).svg,
    draw('rel-tracks', { title: evil, lanes: [{ id: 'm', role: evil, label: evil, versions: [{ version: 1, label: evil, current: true }] }], bindings: [bind({ text: evil, kind: evil, resolution: { id: 'r', kind: evil, text: evil } })], absences: [{ id: 'm', version: 1, text: evil }] }).svg,
  ];
  for (const svg of svgs) must(!/<script/i.test(svg) && svg.includes('&lt;script&gt;'), '有标签没有被转义');
  return '标题、标签、依据、状态、来源、空缺说明里的 <script> 字样都作为文字输出';
});

check('X01', '全部产物是格式良好的 XML', () => {
  const files = fs.readdirSync(path.join(HERE, 'svg')).filter((n) => n.endsWith('.svg')).map((n) => path.join(HERE, 'svg', n));
  const res = spawnSync('xmllint', ['--noout', ...files], { encoding: 'utf8' });
  must(!res.error, `没有运行：找不到 xmllint（${res.error?.message}）`);
  must(res.status === 0, res.stderr.slice(0, 300));
  return `xmllint 解析 ${files.length} 个文件无错误`;
});

// ---------- 浏览器段 ----------

const manifest = JSON.parse(fs.readFileSync(path.join(HERE, 'svg', 'manifest.json'), 'utf8'));
const probeItems = [];
for (const c of manifest.cases) {
  for (const o of c.outputs) probeItems.push({ scope: o.scope, group: 'case', w: o.w, labels: o.labels, svg: fs.readFileSync(path.join(HERE, o.file), 'utf8') });
}
for (let i = 0; i < 10; i++) {
  const res = draw('rel-fan', byId('fan-join').model, NARROW, `inst-${i}`);
  probeItems.push({ scope: `inst-${i}`, group: 'instance', w: res.width, labels: res.labels, svg: res.svg });
}
// 对照：故意画一条穿过主张文字的线，并把 claim-A 上的括线标成 claim-B 的，检查器应当报出来
{
  const res = draw('rel-qualify', f06ToQualify(F.F06), NARROW, 'control-bad');
  const svg = res.svg.replace('data-bracket-for="claim-A"', 'data-bracket-for="claim-B"').replace('</svg>', '<path d="M0 11 L200 11" fill="none" stroke="#c00"/></svg>');
  probeItems.push({ scope: 'control-bad', group: 'control', w: res.width, labels: res.labels, svg });
}
{
  // 对照：把旧阅读的 data-basis 改指 v2（它仍画在 v1 下）；把片段括线挪到别的行
  const t = draw('rel-tracks', f01ToTracks(F.F01), NARROW, 'control-binding');
  probeItems.push({ scope: 'control-binding', group: 'control', w: t.width, labels: t.labels, svg: t.svg.replace('data-basis="material-demo-01@1#§4"', 'data-basis="material-demo-01@2#§4"') });
  const longClaim = { title: '对照', claims: [{ id: 'a', text: '调阅古籍须提前两个工作日预约，并在取书当天出示读者证和预约回执，逾期一个工作日即作废。' }], qualifiers: [{ id: 'q', type: 'condition', text: '节假日顺延', target: { claim: 'a', fragment: '逾期一个工作日' } }] };
  const ok = draw('rel-qualify', longClaim, NARROW, 'fragment-wrapped');
  probeItems.push({ scope: 'fragment-wrapped', group: 'case', w: ok.width, labels: ok.labels, svg: ok.svg });
  const bad = draw('rel-qualify', longClaim, NARROW, 'control-fragment');
  probeItems.push({ scope: 'control-fragment', group: 'control', w: bad.width, labels: bad.labels, svg: bad.svg.replace(/(<path d=")M(\S+) (\S+) L(\S+) \S+ L\S+ (\S+) L\S+ \S+("[^>]*data-fragment=)/, (m, p, x1, y1, x2, y2, tail) => `${p}M${x1} 3 L${x2} 3 L${x2} 18 L${x1} 18${tail}`) });
}
const probeScript = `
const items = JSON.parse(document.getElementById('data').textContent);
const out = { ua: navigator.userAgent, svgs: 0, texts: 0, overBudget: [], outside: [], collisions: [], missing: [], refs: [], slack: [], strikes: [], brackets: 0, bracketErrors: [], bindings: 0, bindingErrors: [], fragments: 0, fragmentErrors: [], control: { strikes: [], bracketErrors: [], bindingErrors: [], fragmentErrors: [] }, removal: null };
const hit = (a, b) => Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 1 && Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 1;
const refsOk = (svg) => {
  const bad = [];
  for (const el of svg.querySelectorAll('[marker-end]')) {
    const id = el.getAttribute('marker-end').slice(5, -1);
    const t = document.getElementById(id);
    if (!t || t.closest('svg') !== el.closest('svg')) bad.push(id);
  }
  for (const id of svg.getAttribute('aria-labelledby').split(' ')) {
    const t = document.getElementById(id);
    if (!t || t.closest('svg') !== svg) bad.push(id);
  }
  return bad;
};
for (const it of items) {
  const svg = document.getElementById(it.scope);
  const sink = it.group === 'control' ? out.control : out;
  out.svgs++;
  const boxes = [];
  for (const lab of it.labels) {
    // 组合图里的文字在嵌入的那一件里找；宽度按本件坐标量，重叠和穿线按屏幕坐标量
    const root = lab.in ? document.getElementById(lab.in) : svg;
    const vb = root.viewBox.baseVal;
    const el = root.querySelector('text[data-text="' + CSS.escape(lab.key) + '"]');
    if (!el) { out.missing.push(it.scope + ' ' + lab.key); continue; }
    out.texts++;
    const b = el.getBBox();
    const sr = el.getBoundingClientRect();
    boxes.push({ key: lab.key, b: { x: sr.x, y: sr.y, width: sr.width, height: sr.height } });
    if (b.width > lab.budget + 0.5) out.overBudget.push({ scope: it.scope, key: lab.key, actual: +b.width.toFixed(1), budget: lab.budget });
    if (b.x < vb.x - 0.5 || b.y < vb.y - 0.5 || b.x + b.width > vb.x + vb.width + 0.5 || b.y + b.height > vb.y + vb.height + 0.5) out.outside.push(it.scope + ' ' + lab.key);
    if (lab.w > 40) out.slack.push(b.width / lab.w);
  }
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) if (hit(boxes[i].b, boxes[j].b)) out.collisions.push(it.scope + ': ' + boxes[i].key + ' × ' + boxes[j].key);
  const bad = refsOk(svg);
  if (bad.length) out.refs.push(it.scope + ': ' + bad.join(','));
  // 线段不穿过文字（跨界编号有意压在线上，除外）
  for (const p of svg.querySelectorAll('path[d]')) {
    if (p.closest('defs')) continue;
    const ctm = p.getScreenCTM();
    const pts = [...p.getAttribute('d').matchAll(/[ML]\\s*(-?[\\d.]+)[ ,](-?[\\d.]+)/g)].map((m) => [ctm.a * m[1] + ctm.c * m[2] + ctm.e, ctm.b * m[1] + ctm.d * m[2] + ctm.f]);
    for (let i = 1; i < pts.length; i++) {
      const seg = { x: Math.min(pts[i - 1][0], pts[i][0]), y: Math.min(pts[i - 1][1], pts[i][1]), width: Math.abs(pts[i][0] - pts[i - 1][0]), height: Math.abs(pts[i][1] - pts[i - 1][1]) };
      for (const t of boxes) {
        if (t.key.endsWith('.mark')) continue;
        const b = { x: t.b.x + 1, y: t.b.y + 3, width: t.b.width - 2, height: t.b.height - 6 };
        if (seg.x < b.x + b.width && seg.x + seg.width > b.x && seg.y < b.y + b.height && seg.y + seg.height > b.y) sink.strikes.push(it.scope + ': ' + t.key);
      }
    }
  }
  // 绑定行在它所绑版本的分组里，且位于该版本标题之下、下一个版本之上
  const versions = [...svg.querySelectorAll('g[data-version]')];
  for (const g of svg.querySelectorAll('g[data-binding-id]')) {
    out.bindings++;
    const v = g.closest('g[data-version]');
    const first = g.getAttribute('data-basis').split(' ')[0].split('#')[0];
    if (!v || v.getAttribute('data-version') !== first) { sink.bindingErrors.push(it.scope + ': ' + g.getAttribute('data-binding-id') + ' 不在 ' + first + ' 下'); continue; }
    const headBox = v.querySelector('text').getBBox();
    const gb = g.getBBox();
    const sameLane = versions.filter((o) => o.parentNode === v.parentNode);
    const nextV = sameLane[sameLane.indexOf(v) + 1];
    if (gb.y < headBox.y + headBox.height - 2) sink.bindingErrors.push(it.scope + ': ' + g.getAttribute('data-binding-id') + ' 高于版本标题');
    if (nextV && gb.y + gb.height > nextV.querySelector('text').getBBox().y + 2) sink.bindingErrors.push(it.scope + ': ' + g.getAttribute('data-binding-id') + ' 越到下一个版本');
  }
  // 片段括线盖住下划线片段所在的每一行
  for (const span of svg.querySelectorAll('tspan[data-fragment-of]')) {
    out.fragments++;
    const n = span.getNumberOfChars();
    const a = span.getExtentOfChar(0), z = span.getExtentOfChar(n - 1);
    const claimId = span.closest('[data-role="claim"]').getAttribute('data-object-id');
    const text = span.textContent;
    const br = [...svg.querySelectorAll('path[data-bracket-for="' + claimId + '"][data-fragment]')].find((p) => p.getAttribute('data-fragment').includes(text) || text.includes(p.getAttribute('data-fragment')));
    if (!br) { sink.fragmentErrors.push(it.scope + ': “' + text + '”没有对应的括线'); continue; }
    const bb = br.getBBox();
    const mid = (r) => r.y + r.height / 2;
    if (mid(a) < bb.y - 1 || mid(z) > bb.y + bb.height + 1) sink.fragmentErrors.push(it.scope + ': 括线没有盖住“' + text + '”所在的行');
  }
  // 括线的实际范围落在目标主张的实际文字框内，不碰别的主张
  for (const br of svg.querySelectorAll('path[data-bracket-for]')) {
    out.brackets++;
    const bb = br.getBBox();
    const targets = br.getAttribute('data-bracket-for').split(' ');
    const claims = [...svg.querySelectorAll('[data-role="claim"]')].map((g) => ({ id: g.getAttribute('data-object-id'), b: g.querySelector('text').getBBox() }));
    const own = claims.filter((c) => targets.includes(c.id));
    const top = Math.min(...own.map((c) => c.b.y)), bottom = Math.max(...own.map((c) => c.b.y + c.b.height));
    if (bb.y < top - 4 || bb.y + bb.height > bottom + 4) sink.bracketErrors.push(it.scope + ': ' + targets.join('+') + ' 超出目标');
    if (!br.hasAttribute('data-fragment') && (bb.y > top + 6 || bb.y + bb.height < bottom - 6)) sink.bracketErrors.push(it.scope + ': ' + targets.join('+') + ' 没有量全目标');
    for (const c of claims) if (!targets.includes(c.id) && bb.y < c.b.y + c.b.height - 2 && bb.y + bb.height > c.b.y + 2) sink.bracketErrors.push(it.scope + ': 碰到 ' + c.id);
  }
}
const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
out.ids = ids.length;
out.duplicateIds = ids.filter((id, i) => ids.indexOf(id) !== i);
// 移除一个实例再插回，其余实例的引用不受影响
const victim = document.getElementById('inst-3');
const parent = victim.parentNode, next = victim.nextSibling;
victim.remove();
const during = items.filter((it) => it.scope !== 'inst-3').flatMap((it) => refsOk(document.getElementById(it.scope)));
parent.insertBefore(victim, next);
const after = items.flatMap((it) => refsOk(document.getElementById(it.scope)));
const ids2 = [...document.querySelectorAll('[id]')].map((e) => e.id);
out.removal = { brokenWhileRemoved: during.length, brokenAfterReinsert: after.length, duplicateIdsAfter: ids2.filter((id, i) => ids2.indexOf(id) !== i).length };
out.slack = { min: +Math.min(...out.slack).toFixed(3), max: +Math.max(...out.slack).toFixed(3), n: out.slack.length };
document.getElementById('out').textContent = 'PRO' + 'BE' + JSON.stringify(out) + 'END' + 'PROBE';
`;
const probeHtml = `<!doctype html><html lang="zh-Hans"><head><meta charset="utf-8"><title>probe</title><style>body{margin:16px;font:14px system-ui}div{margin:0 0 24px}</style></head><body>
${probeItems.map((it) => `<div style="width:${it.w}px">${it.svg}</div>`).join('\n')}
<script type="application/json" id="data">${JSON.stringify(probeItems.map(({ scope, group, labels }) => ({ scope, group, labels }))).replace(/</g, '\\u003c')}</script>
<pre id="out"></pre>
<script>${probeScript}</script>
</body></html>`;
const probePath = path.join(HERE, 'evidence', 'probe.html');
fs.writeFileSync(probePath, probeHtml);

const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const runChrome = () =>
  new Promise((resolve) => {
    if (!fs.existsSync(chrome)) return resolve({ ran: false, why: `没有找到 Chrome：${chrome}` });
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'svg01-probe-'));
    const p = spawn(chrome, ['--headless=new', '--disable-gpu', `--user-data-dir=${profile}`, '--virtual-time-budget=3000', '--dump-dom', `file://${probePath}`]);
    let buf = '';
    const done = (v) => {
      p.kill('SIGKILL');
      // Chrome 被杀掉后还可能在写临时目录，删不掉就留给系统清理
      try {
        fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
      } catch {}
      resolve(v);
    };
    const timer = setTimeout(() => done({ ran: false, why: 'Chrome 60 秒内没有输出结果' }), 60000);
    p.stdout.on('data', (d) => {
      buf += d;
      const m = buf.match(/PROBE(.*)ENDPROBE/s);
      if (m) {
        clearTimeout(timer);
        done({ ran: true, data: JSON.parse(unescape(m[1])) });
      }
    });
    p.on('error', (e) => {
      clearTimeout(timer);
      done({ ran: false, why: e.message });
    });
  });

const probe = await runChrome();
if (probe.ran) {
  const d = probe.data;
  const push = (id, name, ok, detail) => results.push({ id, name, pass: ok, detail });
  push('P01', '浏览器实测：文字宽度不超过排版时留的宽度', !d.overBudget.length && !d.missing.length, d.overBudget.length ? JSON.stringify(d.overBudget.slice(0, 8)) : `${d.svgs} 个 SVG、${d.texts} 个文字节点；实际宽度是估算宽度的 ${d.slack.min}–${d.slack.max} 倍（${d.slack.n} 个宽于 40 的标签）`);
  push('P02', '浏览器实测：文字不出画布、互不重叠', !d.outside.length && !d.collisions.length, [...d.outside, ...d.collisions].slice(0, 8).join('；') || '无越界、无重叠');
  push('P03', `浏览器实测：同页 ${d.svgs} 个实例，ID 不重复、引用不出实例`, !d.duplicateIds.length && !d.refs.length, d.duplicateIds.length || d.refs.length ? JSON.stringify({ dup: d.duplicateIds.slice(0, 5), refs: d.refs.slice(0, 5) }) : `${d.ids} 个 ID`);
  push('P04', '浏览器实测：移除一个实例再插回', !d.removal.brokenWhileRemoved && !d.removal.brokenAfterReinsert && !d.removal.duplicateIdsAfter, JSON.stringify(d.removal));
  push('P05', '浏览器实测：线段不穿过文字', !d.strikes.length && d.control.strikes.length > 0, d.strikes.slice(0, 10).join('；') || `无；对照图报出 ${d.control.strikes.length} 处`);
  push('P06', '浏览器实测：括线落在目标主张的文字框内，不碰别的主张', !d.bracketErrors.length && d.control.bracketErrors.length > 0, d.bracketErrors.slice(0, 10).join('；') || `${d.brackets} 条括线；对照图报出 ${d.control.bracketErrors.length} 处`);
  push('P07', '浏览器实测：绑定行落在所绑版本之下', !d.bindingErrors.length && d.control.bindingErrors.length > 0, d.bindingErrors.slice(0, 8).join('；') || `${d.bindings} 条绑定；对照图报出 ${d.control.bindingErrors.length} 处`);
  push('P08', '浏览器实测：片段括线盖住下划线片段所在的行', !d.fragmentErrors.length && d.control.fragmentErrors.length > 0, d.fragmentErrors.slice(0, 8).join('；') || `${d.fragments} 段下划线；对照图报出 ${d.control.fragmentErrors.length} 处`);
  probe.ua = d.ua;
}

const summary = {
  ran_at: new Date().toISOString(),
  node: process.version,
  browser: probe.ran ? probe.ua : `未运行：${probe.why}`,
  passed: results.filter((x) => x.pass).length,
  failed: results.filter((x) => !x.pass).length,
  results,
};
fs.writeFileSync(path.join(HERE, 'evidence', 'check.json'), `${JSON.stringify(summary, null, 1)}\n`);
for (const x of results) console.log(`${x.pass ? 'PASS' : 'FAIL'} ${x.id} ${x.name}\n     ${x.detail}`);
console.log(`\n${summary.passed} 通过，${summary.failed} 失败；浏览器段：${probe.ran ? '已运行' : summary.browser}`);
process.exit(summary.failed ? 1 : 0);
