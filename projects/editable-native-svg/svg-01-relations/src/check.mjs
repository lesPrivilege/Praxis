// 本批的自动检查。分两段：
// 1. 静态：在 Node 里改输入、重新生成，再读生成的 SVG 文本下断言。
// 2. 浏览器：把全部 SVG 放进一页，用本机 Chrome 无界面模式量实际文字框、查引用是否留在本实例内。
// 用法：node src/check.mjs（先跑 build）。Chrome 路径可用环境变量 CHROME 指定；找不到时第二段记为未运行。

import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import os from 'node:os';
import { Refusal } from './kernel.mjs';
import { HERE, GEN, NARROW, cases, fixtures, edits, f01ToTracks, f02ToTracks, f02ToPair, f04ToRail, foldF02, f06ToQualify } from './cases.mjs';

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
const r1 = (n) => +n.toFixed(1);
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
    // 组合图里嵌着几件各自的 <svg>；文字的键在所属的那一件里唯一即可
    const stack = [];
    const seen = new Set();
    for (const [, open, close, key] of svg.matchAll(/<svg[^>]* id="([^"]*)"|(<\/svg>)|data-text="([^"]*)"/g)) {
      if (open) stack.push(open);
      else if (close) stack.pop();
      else {
        must(!seen.has(`${stack.at(-1)} ${key}`), `${n}：data-text ${key} 在同一件里重复`);
        seen.add(`${stack.at(-1)} ${key}`);
      }
    }
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


// ---------- 排列与刻度（0.3.0） ----------

const T6 = (hm) => `2026-10-06T${hm}+08:00`;
const noteOf = (svg) => textOf(svg, 'scale#note');
const flat = (t) => t.replace(/\s/g, '');
// 文字框（按排版时算出的宽度）两两不相交
const overlaps = (labels) => labels.flatMap((a, i) => labels.slice(i + 1).filter((b) => Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) > 1 && Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) > 1).map((b) => `${a.key}×${b.key}`));

check('C01', '位置的含义写在图脚：先后、时间、上下级、并排的栏各说各的', () => {
  const said = [];
  for (const id of ['f01-versions', 'tracks-four', 'f02-candidate', 'f04-times', 'rail-day', 'rail-steps', 'rail-tree', 'pair-slip', 'f02-projection']) {
    const cs = byId(id);
    for (const w of WIDTHS) {
      const res = draw(cs.asset, cs.model, w);
      const note = noteOf(res.svg);
      must(note && note.length > 8, `${id} 宽 ${w}：图脚没有写位置的读法`);
      must(res.equivalent.notes.some((t) => flat(t) === flat(note)), `${id} 宽 ${w}：等效文字里没有同一句读法`);
      must(/data-scale="(list|order|time)"/.test(res.svg), `${id} 宽 ${w}：没有 data-scale`);
    }
    said.push(id);
  }
  must(noteOf(draw('rel-tracks', byId('tracks-four').model, 672).svg).includes('不表示谁先谁后'), '并排的版本线没有写明互相不表示先后');
  must(noteOf(draw('rel-rail', byId('rail-steps').model).svg).includes('间距不表示时长'), '先后图没有写明间距不表示时长');
  // 只有一条版本线时，不提“不同的线”
  must(flat(noteOf(draw('rel-tracks', byId('f02-candidate').model).svg)) === flat('自上而下是版本先后；间距不表示时长。'), '只有一条版本线的图里写了“不同的线之间”');
  const lone = draw('rel-rail', { title: 't', scale: { kind: 'list', depth: '隶属' }, rows: [{ id: 'a', label: '甲' }, { id: 'b', label: '乙' }] });
  must(!noteOf(lone.svg).includes('缩进') && noteOf(lone.svg).includes('没有上下级'), '没有任何下级的清单里写了“缩进表示”');
  must(noteOf(draw('rel-rail', byId('rail-day').model, 672).svg).includes('同一高度是同一时刻') && !noteOf(draw('rel-rail', byId('rail-day').model, NARROW).svg).includes('同一高度'), '共用标尺这句话应只在并排成栏时出现');
  must(noteOf(draw('rel-rail', byId('rail-tree').model).svg).includes('缩进表示：下级部门隶属于上级部门'), '上下级图没有写缩进表示什么');
  // 只有一个时刻、没有让开的行，就不该出现“文字让开”那句
  const one = draw('rel-rail', { title: 't', scale: { kind: 'time' }, rows: [{ id: 'a', at: T6('09:00'), label: '提交' }] });
  must(!noteOf(one.svg).includes('让开') && !noteOf(one.svg).includes('结束时间未知'), '读法里写了图上没有的情形');
  const sh = GEN['rel-sheet'](byId('sheet-day').model, { width: 480, scope: 'chk' });
  must(textOf(sh.svg, 'sheet#note').includes('不共用标尺') && sh.equivalent.notes.some((t) => t.includes('不共用标尺')), '组合图没有说明各件之间位置表示什么');
  return `${said.length} 份输入在两种宽度下都带读法，等效文字里是同一句；读法只写图里出现的情形：一条版本线不提“不同的线”，没有下级不提缩进；组合图另有一句说明各件各排各的`;
});

check('C02', '时间按比例：按时刻排不按字符串排，同钟面不同偏移分得开，未知的结束不补', () => {
  const m = f04ToRail(F.F04);
  const notes = [];
  for (const w of WIDTHS) {
    const res = draw('rel-rail', m, w);
    const p = res.positions;
    const hour = p.t2.y - p.t1.y;
    must(hour > 20, `宽 ${w}：钟面相同、偏移差一小时的两个时刻画在了一处`);
    must(Math.abs(p.i1.y2 - p.i1.y - 2 * hour) < 0.6, `宽 ${w}：两小时的区间长 ${p.i1.y2 - p.i1.y}，一小时是 ${hour}`);
    must(Math.abs(p.i1.y - (p.t1.y + hour / 2)) < 0.6 && Math.abs(p.i2.y - (p.t2.y + hour / 2)) < 0.6, `宽 ${w}：区间的起点不在它的时刻上`);
    must(p.t1.y < p.i1.y && p.i1.y < p.t2.y && p.t2.y < p.i2.y, `宽 ${w}：次序不是按时刻排的`);
    must(p.i2.y2 === null && /data-shape="open-interval"/.test(res.svg) && !/data-mark-for="i2"[^>]*data-until-ms/.test(res.svg), `宽 ${w}：结束未知的区间被画出了结束`);
    must(textOf(res.svg, 'i2.when').includes('结束时间未知') && textOf(res.svg, 't1.when').replace(/\s/g, '').includes('01:30UTC+02:00（标尺10-2423:30）'), `宽 ${w}：时刻的写法不对`);
    must(res.axis.offset === 0 && res.axis.step === 30, `宽 ${w}：标尺的偏移或格距不对`);
    must(textOf(res.svg, 'axis#date') === '10-24' && textOf(res.svg, 'axis#0') === '23:30' && textOf(res.svg, 'axis#1') === '10-25' && textOf(res.svg, 'axis#2') === '00:30' && textOf(res.svg, 'axis#5') === '02:00', `宽 ${w}：刻度上写的时刻不对`);
    notes.push(`宽 ${w}：一小时 ${r1(hour)}px，两小时的区间 ${r1(p.i1.y2 - p.i1.y)}px`);
  }
  // 把 t2 的偏移改成和 t1 一样：两个时刻重合
  const same = clone(m);
  same.rows.find((x) => x.id === 't2').at = '2026-10-25T01:30:00+02:00';
  const ps = draw('rel-rail', same).positions;
  must(ps.t1.y === ps.t2.y, '同一时刻没有落在同一处');
  // 给未知的结束填上时刻：这一条变成普通区间，读法里那句也跟着消失
  const closed = clone(m);
  closed.rows.find((x) => x.id === 'i2').until = '2026-10-25T01:30:00Z';
  const rc = draw('rel-rail', closed);
  must(!/open-interval/.test(rc.svg) && !noteOf(rc.svg).includes('结束时间未知') && textOf(rc.svg, 'i2.when').includes('30 分钟'), '补上结束时刻后图没有跟着变');
  must(flat(noteOf(draw('rel-rail', m).svg)).includes('从2026-10-2423:30起') && flat(noteOf(draw('rel-rail', byId('rail-day').model).svg)).includes('从2026-10-0609:00起'), '读法里没有写标尺从哪一天哪一刻起');
  // 写了秒的，文字也写到秒；时长不四舍五入
  const secs = draw('rel-rail', { title: 't', scale: { kind: 'time' }, rows: [{ id: 'a', at: '2026-10-06T09:00:30Z', label: 'a' }, { id: 'b', at: '2026-10-06T09:00:50Z', label: 'b' }, { id: 'c', at: '2026-10-06T09:00:00Z', until: '2026-10-06T09:01:30Z', label: 'c' }] });
  must(textOf(secs.svg, 'a.when') === '09:00:30' && textOf(secs.svg, 'b.when') === '09:00:50' && flat(textOf(secs.svg, 'c.when')) === flat('09:00:00–09:01:30 · 1 分钟 30 秒'), `带秒的时刻写成了 ${textOf(secs.svg, 'a.when')}、${textOf(secs.svg, 'c.when')}`);
  // 首尾相接的两个区间分在两个小栏里；很短的区间从它的开始时刻画起，并在读法里说明
  const touch = draw('rel-rail', { title: 't', scale: { kind: 'time' }, rows: [{ id: 'a', at: '2026-10-06T09:00Z', until: '2026-10-06T10:00Z', label: 'a' }, { id: 'b', at: '2026-10-06T10:00Z', until: '2026-10-06T11:00Z', label: 'b' }, { id: 'c', at: '2026-10-06T10:30Z', until: '2026-10-06T10:31Z', label: 'c' }] });
  const bar = (id) => touch.svg.match(new RegExp(`<rect x="([\\d.]+)" y="([\\d.]+)"[^>]*data-mark-for="${id}"`)).slice(1).map(Number);
  must(bar('a')[0] !== bar('b')[0], '首尾相接的两个区间画在同一个小栏里，会并成一条');
  must(Math.abs(bar('c')[1] - touch.positions.c.y) < 0.11 && noteOf(touch.svg).includes('很短的区间'), '很短的区间没有从它的开始时刻画起，或读法里没有说明');
  must(!noteOf(draw('rel-rail', m).svg).includes('很短的区间'), '没有短区间的图里写了短区间的说明');
  const badTimes = [['4 月 31 日', '2026-04-31T09:00Z'], ['2 月 30 日', '2026-02-30T09:00Z'], ['24 点', '2026-10-06T24:00Z'], ['61 分', '2026-10-06T09:61Z'], ['偏移 +99:99', '2026-10-06T09:00+99:99']];
  for (const [name, at] of badTimes) must(['time', 'offset'].includes(codeOf(() => draw('rel-rail', { title: 't', scale: { kind: 'time' }, rows: [{ id: 'a', at, label: 'a' }] }))), `${name}（${at}）没有被拒用`);
  must(codeOf(() => draw('rel-rail', { title: 't', scale: { kind: 'time', offset: '+99:99' }, rows: [{ id: 'a', at: '2026-10-06T09:00Z', label: 'a' }] })) === 'offset', 'scale.offset 写成 +99:99 没有被拒用');
  const zero = clone(m);
  zero.rows.find((x) => x.id === 'i1').until = zero.rows.find((x) => x.id === 'i1').at;
  must(textOf(draw('rel-rail', zero).svg, 'i1.when').includes('起止相同'), '零时长的区间没有写明');
  return `${notes.join('；')}；同一时刻重合；补上结束后变成普通区间；零时长写明“起止相同”；读法写明标尺从哪天哪刻起；带秒的时刻写到秒；首尾相接的区间分栏；${badTimes.length + 1} 种不存在的日期、钟点或偏移被拒用`;
});

check('C03', '并排的栏共用一条标尺；截止、时刻、区间各有各的形状', () => {
  const m = byId('rail-day').model;
  const wide = draw('rel-rail', m, 672);
  must(/data-layout="columns"/.test(wide.svg) && (wide.svg.match(/data-role="rail"/g) ?? []).length === 3, '宽版应是三栏各一条轨');
  const two = clone(m);
  two.rows.push({ id: 'same-time', lane: 'repair', at: T6('10:15'), label: '收到通知' });
  const p = draw('rel-rail', two, 672).positions;
  must(p['same-time'].y === p['rule-v3'].y && p['same-time'].lane !== p['rule-v3'].lane, '两栏里同一时刻的记号不在同一高度');
  const narrow = draw('rel-rail', m, NARROW);
  must(/data-layout="merged"/.test(narrow.svg) && textOf(narrow.svg, 'rule-v3.when').includes('借阅规则') && !textOf(wide.svg, 'rule-v3.when').includes('借阅规则'), '窄版应并成一条轨，并把栏名写进每一行');
  const shapes = (svg) => Object.fromEntries(['point', 'interval', 'open-interval', 'deadline'].map((k) => [k, (svg.match(new RegExp(`data-shape="${k}"`, 'g')) ?? []).length]));
  for (const res of [wide, narrow]) {
    const s = shapes(res.svg);
    must(s.point === 5 && s.interval === 2 && s['open-interval'] === 1 && s.deadline === 1, `形状数目不对：${JSON.stringify(s)}`);
    must(textOf(res.svg, 'cutoff.when').startsWith('截止') && /data-row-id="cutoff"[^>]*data-state="open"/.test(res.svg), '截止没有写成词，或待定没有标出');
    must(res.svg.split('#1f5fd1').length === 5, '蓝色应只出现在待定的那一处（引线、端点、它的标题）和图例里');
  }
  // 栏名长到折行时，标尺从栏名下面开始，栏名不压住第一行
  const longLane = clone(m);
  longLane.lanes[0].label = '古籍修复与数字化加工中心的值班安排';
  const ll = draw('rel-rail', longLane, 672);
  must(!overlaps(ll.labels).length && ll.axis.y0 > 40, `栏名折行后与别的文字相叠：${overlaps(ll.labels).slice(0, 3).join('、')}`);
  must(!/data-leader-for/.test(GEN['rel-sheet'](byId('sheet-day').model, { width: 480, scope: 'c' }).svg.match(/<g data-role="cross-link"[\s\S]*?<\/g>/g)?.join('') ?? ''), '组合图的连线里混进了时间图的引线');
  // 重叠的区间错开，超过三个拒用
  const over = clone(m);
  for (let i = 0; i < 3; i++) over.rows.push({ id: `o${i}`, lane: 'slip', at: T6('14:10'), until: T6('14:50'), label: '重叠' });
  must(codeOf(() => draw('rel-rail', over)) === 'capacity', '四个重叠的区间没有按容量拒用');
  return '宽版三栏三条轨共用标尺，不同栏里同一时刻同高；窄版并成一条轨，栏名写进每行；四种形状各自计数正确；蓝色只在待定的截止上';
});

check('C04', '先后与上下级：编号跟着输入走，层级和路径跟着上级走', () => {
  const steps = clone(byId('rail-steps').model);
  const a = draw('rel-rail', steps);
  must(['1.', '2.', '3.', '4.', '5.'].every((n, i) => textOf(a.svg, `${steps.rows[i].id}.n`) === n), '编号与输入次序不一致');
  [steps.rows[1], steps.rows[2]] = [steps.rows[2], steps.rows[1]];
  const b = draw('rel-rail', steps);
  must(textOf(b.svg, 's-repair.n') === '2.' && textOf(b.svg, 's-check.n') === '3.' && b.equivalent.items[1].startsWith('2. 修复室评估'), '调换两步之后编号或等效文字没有跟着变');
  must((a.svg.match(/<path/g) ?? []).length === (b.svg.match(/<path/g) ?? []).length, '调换次序不应改变路径数');

  const tree = clone(byId('rail-tree').model);
  const t = draw('rel-rail', tree);
  const level = (svg, id) => group(svg, 'data-row-id', id).match(/data-level="(\d)"/)[1];
  must(level(t.svg, 'lib') === '1' && level(t.svg, 'repair-room') === '3' && level(t.svg, 'binding') === '4', '层级不对');
  must(Object.values(t.positions).every((p) => p.x === 4 + 18 * (p.level - 1)), '缩进与层级不成正比');
  must((t.svg.match(/data-child=/g) ?? []).length === tree.rows.filter((x) => x.parent).length, '上下级连线的条数不对');
  must(t.equivalent.items.some((x) => x.startsWith('图书馆 › 典藏部 › 修复室 › 装帧组')), '等效文字里没有完整路径');
  // 把修复室改挂到读者服务部下面：它和它的下级一起移动
  tree.rows.find((x) => x.id === 'repair-room').parent = 'service';
  const t2 = draw('rel-rail', tree);
  must(t2.equivalent.items.some((x) => x.startsWith('图书馆 › 读者服务部 › 修复室 › 装帧组')) && t2.positions['repair-room'].y < t2.positions.stacks.y, '改了上级之后位置或路径没有跟着变');
  const wideTree = draw('rel-rail', byId('rail-tree-wide').model);
  must(textOf(wideTree.svg, 'empty.leaf') === '没有下级' && textOf(wideTree.svg, 'root.leaf') === null && level(wideTree.svg, 'd4') === '5', '空根或深链没有照实画出');
  const row = (id, parent) => ({ id, label: id, ...(parent ? { parent } : {}) });
  const depth = { kind: 'list', depth: '隶属' };
  const table = [
    ['上下级成环', 'cycle', { title: 't', scale: depth, rows: [row('a', 'b'), row('b', 'a')] }],
    ['上级不存在', 'unknown-parent', { title: 't', scale: depth, rows: [row('a', 'x')] }],
    ['六层', 'capacity', { title: 't', scale: depth, rows: [row('a'), row('b', 'a'), row('c', 'b'), row('d', 'c'), row('e', 'd'), row('f', 'e')] }],
    ['十三行', 'capacity', { title: 't', scale: { kind: 'list' }, rows: Array.from({ length: 13 }, (_, i) => row(`r${i}`)) }],
    ['先后图里写上级', 'scale', { title: 't', scale: { kind: 'order' }, rows: [row('a'), row('b', 'a')] }],
    ['先后图里并排几栏', 'scale', { title: 't', scale: { kind: 'order' }, lanes: [{ id: 'x', label: '甲' }], rows: [row('a')] }],
    ['结束早于开始', 'time', { title: 't', scale: { kind: 'time' }, rows: [{ id: 'a', label: 'a', at: T6('10:00'), until: T6('09:00') }] }],
    ['截止带了结束时刻', 'time', { title: 't', scale: { kind: 'time' }, rows: [{ id: 'a', label: 'a', kind: 'deadline', at: T6('10:00'), until: T6('11:00') }] }],
    ['时刻没有偏移', 'time', { title: 't', scale: { kind: 'time' }, rows: [{ id: 'a', label: 'a', at: '2026-10-06T10:00' }] }],
    ['时间跨度九周', 'capacity', { title: 't', scale: { kind: 'time' }, rows: [{ id: 'a', label: 'a', at: '2026-01-01T00:00Z' }, { id: 'b', label: 'b', at: '2026-03-05T00:00Z' }] }],
    ['行的栏不存在', 'lane', { title: 't', scale: { kind: 'time' }, lanes: [{ id: 'x', label: '甲' }], rows: [{ id: 'a', label: 'a', lane: 'y', at: T6('10:00') }] }],
    ['行的状态不认识', 'state', { title: 't', scale: { kind: 'time' }, rows: [{ id: 'a', label: 'a', at: T6('10:00'), state: 'done' }] }],
    ['行名叫 constructor 的归属', 'origin', { title: 't', scale: { kind: 'time' }, rows: [{ id: 'a', label: 'a', at: T6('10:00'), origin: 'constructor' }] }],
    ['清单里写了成立程度', 'scale', { title: 't', scale: { kind: 'list' }, rows: [{ id: 'a', label: 'a', state: 'open' }] }],
    ['正文写成了对象', 'row', { title: 't', scale: { kind: 'order' }, rows: [{ id: 'a', label: 'a', text: {} }] }],
    ['说明写成了数字 0', 'row', { title: 't', scale: { kind: 'order' }, rows: [{ id: 'a', label: 'a', note: 0 }] }],
    ['没有并排的栏却写了 cells', 'unsupported', { title: 't', scale: { kind: 'list' }, rows: [{ id: 'a', label: 'a', cells: { x: { text: '1' } } }] }],
    ['没有栏却写了 lane', 'unsupported', { title: 't', scale: { kind: 'order' }, rows: [{ id: 'a', label: 'a', lane: 'x' }] }],
    ['并排的栏里行自己带正文', 'unsupported', { title: 't', scale: { kind: 'list' }, lanes: [{ id: 'x', label: '甲' }], rows: [{ id: 'a', label: 'a', text: '正文', cells: { x: { text: '1' } } }] }],
    ['data 的键不是 data-*', 'data', { title: 't', scale: { kind: 'order' }, rows: [{ id: 'a', label: 'a', data: { 'data-x" onmouseover="alert(1)': 'v' } }] }],
    ['输入是 null', 'model', null],
    ['lanes 写成一句话', 'lane', { title: 't', scale: { kind: 'list' }, lanes: 'abc', rows: [row('a')] }],
    ['行名带一个会被去掉的字符', 'id', { title: 't', scale: { kind: 'list' }, rows: [{ id: 'a\uffff', label: 'a' }] }],
    ['并排的栏里再写上级', 'scale', { title: 't', scale: depth, lanes: [{ id: 'x', label: '甲' }], rows: [{ id: 'a', label: 'a', cells: { x: { text: '1' } } }, { id: 'b', label: 'b', parent: 'a', cells: { x: { text: '2' } } }] }],
  ];
  for (const [name, code, model] of table) must(codeOf(() => draw('rel-rail', model)) === code, `${name}：应为 ${code}，实际 ${codeOf(() => draw('rel-rail', model))}`);
  // data 里的属性不能盖掉生成器自己写的；名叫 __proto__ 的行照常有位置
  const own = draw('rel-rail', { title: 't', scale: { kind: 'time' }, rows: [{ id: '__proto__', label: 'p', at: T6('09:00'), data: { 'data-role': 'x', 'data-kind': 'deadline' } }] });
  must(/data-row-id="__proto__" data-role="row"/.test(own.svg) && /data-kind="point"/.test(own.svg) && !/data-role="x"/.test(own.svg) && Object.hasOwn(own.positions, '__proto__'), 'data 盖掉了生成器写的属性，或 __proto__ 这一行没有位置');
  return `调换两步，编号和等效文字跟着变；改挂上级，整枝一起移动，路径改写；空根写“没有下级”；${table.length} 种越界输入按预期代码拒用`;
});

check('C05', '对照与选取：没变的、没选的都留着；单位不同、对象不同不算变化', () => {
  const m = clone(byId('pair-slip').model);
  const notes = [];
  for (const w of WIDTHS) {
    const res = draw('rel-pair', m, w);
    must(JSON.stringify(res.count) === JSON.stringify({ same: 2, changed: 2, added: 1, removed: 1, pending: 1 }), `宽 ${w}：五种变化的计数不对 ${JSON.stringify(res.count)}`);
    must((res.svg.match(/data-role="row"/g) ?? []).length === m.fields.length, `宽 ${w}：行数与字段数不符，有字段被省掉了`);
    for (const [id, kind] of [['item', 'same'], ['slot', 'changed'], ['companion', 'removed'], ['purpose', 'added'], ['copy', 'pending']]) must(new RegExp(`data-row-id="${id}"[^>]*data-change="${kind}"`).test(res.svg), `宽 ${w}：${id} 没有标为 ${kind}`);
    must(textOf(res.svg, 'copy.change') === '待定' && textOf(res.svg, 'copy.after').startsWith('提议：') && res.svg.split('#1f5fd1').length === 4, `宽 ${w}：待定的一行没有写成提议，或蓝色不止用在它上面`);
    must(textOf(res.svg, 'duration.before') === '60 分钟' && textOf(res.svg, 'companion.after') === '这一项已不在' && textOf(res.svg, 'purpose.before') === '原先没有这一项', `宽 ${w}：单位或空缺的写法不对`);
    notes.push(`宽 ${w}：${m.fields.length} 行`);
  }
  m.fields.find((f) => f.id === 'slot').after = m.fields.find((f) => f.id === 'slot').before;
  must(draw('rel-pair', m).count.same === 3 && draw('rel-pair', m).count.changed === 1, '把值改回去之后没有变成“未变”');

  const pr = f02ToPair(F.F02);
  const res = draw('rel-pair', pr);
  must(/data-row-id="期限"[^>]*data-selected="true"/.test(res.svg) && /data-row-id="付款"[^>]*data-selected="false"/.test(res.svg) && textOf(res.svg, '付款.view') === '没有选入，仍在源里' && textOf(res.svg, '付款.source') === '季度', 'F02：没有选入的字段没有照样列出');
  const brief = clone(byId('pair-brief').model);
  const br = draw('rel-pair', brief);
  must(br.stale && noteOf(br.svg).includes('非当前版本') && textOf(br.svg, 'purpose.view').includes('选取时还没有这个字段'), '依据旧版本的选取没有写明');
  const allSel = { ...brief, view: { ...brief.view, basis: { ...brief.view.basis, version: 2 } }, selected: brief.fields.map((f) => f.id) };
  const none = { ...brief, selected: [] };
  must(draw('rel-pair', allSel).equivalent.summary.includes('全部选入') && !draw('rel-pair', allSel).stale, '全选没有写明');
  must(!draw('rel-pair', allSel).equivalent.summary.includes('没有选入的') && draw('rel-pair', none).equivalent.summary.includes('全部仍在源里'), '全选或空选时的摘要自相矛盾');
  must(draw('rel-pair', none).equivalent.summary.includes('一个都没有选') && (draw('rel-pair', none).svg.match(/data-role="row"/g) ?? []).length === 4, '空选之后字段行少了');
  const ch = (fields, o = {}) => ({ title: 't', kind: 'change', before: { label: '原', ref: { id: 'a', version: 1 } }, after: { label: '现', ref: { id: 'a', version: 2 } }, fields, ...o });
  // 只差空白的值不算改了
  must(draw('rel-pair', ch([{ id: 'f', label: 'f', before: '60 ', after: 60 }])).count.same === 1, '只差一个空格的两个值被算成“已改”');
  const table = [
    ['选入了选取时还没有的字段', 'stale-basis', { ...brief, selected: ['item', 'purpose'] }],
    ['两边都没有值', 'field', ch([{ id: 'f', label: 'f' }])],
    ['待定却没有提议的值', 'field', ch([{ id: 'f', label: 'f', before: '1', pending: true }])],
    ['一边没有写版本', 'no-version', ch([{ id: 'f', label: 'f', before: '1', after: '2' }], { before: { label: '原', ref: { id: 'a' } } })],
    ['一边只有一句话', 'no-version', ch([{ id: 'f', label: 'f', before: '1', after: '2' }], { before: { label: '原', ref: { text: '上一版' } } })],
    ['字段重名', 'duplicate-id', ch([{ id: 'f', label: 'f', before: '1', after: '2' }, { id: 'f', label: 'g', before: '1', after: '2' }])],
    ['字段名与栏重名', 'duplicate-id', ch([{ id: 'before', label: 'f', before: '1', after: '2' }])],
    ['值是空字符串', 'value', ch([{ id: 'f', label: 'f', before: ' ', after: '2' }])],
    ['kind 不认识', 'kind', { title: 't', kind: 'diff' }],
    ['输入是 null', 'model', null],
    ['后一份的版本比前一份旧', 'version', ch([{ id: 'f', label: 'f', before: '1', after: '2' }], { before: { label: '原', ref: { id: 'a', version: 3 } } })],
    ['两份是同一个版本', 'version', ch([{ id: 'f', label: 'f', before: '1', after: '2' }], { before: { label: '原', ref: { id: 'a', version: 2 } } })],
    ['同一个对象两边名字不同', 'inconsistent-label', ch([{ id: 'f', label: 'f', before: '1', after: '2' }], { before: { label: '原', ref: { id: 'a', label: '甲', version: 1 } }, after: { label: '现', ref: { id: 'a', label: '乙', version: 2 } } })],
    ['pending 写成字符串', 'field', ch([{ id: 'f', label: 'f', before: '1', after: '2', pending: 'false' }])],
    ['前一份的指向写在 basis 里', 'no-version', ch([{ id: 'f', label: 'f', before: '1', after: '2' }], { before: { label: '原', basis: { id: 'a', version: 1 } } })],
    ['选取依据的版本比源还新', 'version', { ...brief, view: { ...brief.view, basis: { ...brief.view.basis, version: 5 } } }],
    ['since 和版本不是数', 'version', { ...brief, source: { label: '源', ref: { id: 'slip-D-12', label: '调阅单 D-12', version: '2026-03' } }, view: { label: '摘要', basis: { id: 'slip-D-12', label: '调阅单 D-12', version: '2026-02' } }, fields: [{ id: 'x', label: 'x', value: '1', since: '2026-03' }], selected: ['x'] }],
    ['selected 有重复', 'selected', { ...brief, selected: ['item', 'item'] }],
  ];
  for (const [name, code, model] of table) must(codeOf(() => draw('rel-pair', model)) === code, `${name}：应为 ${code}，实际 ${codeOf(() => draw('rel-pair', model))}`);
  return `${notes.join('；')}，五种变化各标各的，蓝色只在待定一行；把值改回去变成“未变”；F02 没选入的“付款”仍列出；全选、空选、旧版本依据都写明；${table.length} 种越界输入按预期代码拒用`;
});

check('C06', '新的两件：不可信标签按文字插入，多实例不串 ID，能进组合并连上线', () => {
  const evil = '<script>alert(1)</script>&"';
  const svgs = [
    draw('rel-rail', { title: evil, scale: { kind: 'time', note: evil }, lanes: [{ id: 'x', label: evil }], rows: [{ id: 'a', lane: 'x', at: T6('09:00'), until: null, label: evil, text: evil, note: evil, basis: { text: evil } }] }).svg,
    draw('rel-rail', { title: evil, scale: { kind: 'list', depth: evil }, rows: [{ id: 'a', label: evil }, { id: 'b', parent: 'a', label: evil, note: evil }] }).svg,
    draw('rel-rail', { title: evil, scale: { kind: 'order' }, rows: [{ id: 'a', label: evil, text: evil }] }).svg,
    draw('rel-pair', { title: evil, kind: 'change', before: { label: evil, ref: { id: 'a', label: evil, version: 1 } }, after: { label: evil, ref: { id: 'a', label: evil, version: 2 } }, fields: [{ id: 'f', label: evil, note: evil, unit: evil, before: evil, after: 'x' }] }).svg,
  ];
  for (const svg of svgs) must(!/<script/i.test(svg) && svg.includes('&lt;script&gt;'), '有标签没有被转义');
  const many = ['rail-day', 'f04-times', 'rail-tree', 'rail-steps', 'pair-slip', 'pair-brief'].flatMap((id, i) => [draw(byId(id).asset, byId(id).model, NARROW, `m${i}a`).svg, draw(byId(id).asset, byId(id).model, 672, `m${i}b`).svg]);
  const scan = idScan(many);
  must(!scan.duplicates.length && !scan.dangling.length, `重复或越界：${[...scan.duplicates, ...scan.dangling].join(', ')}`);
  // 对照表的两栏各指调阅单的一个版本，版本图里画着它们，组合时连上；
  // 时间图里的依据只留作文字，不拉横线穿过标尺，但等效文字里说明它画在哪一件里
  const sh = GEN['rel-sheet'](byId('sheet-day').model, { width: 480, scope: 'chk' });
  const linked = sh.links.map((l) => `${l.owner}→${l.target}`).sort().join(' ');
  must(linked === 'after→slip-D-12@2 before→slip-D-12@1', `组合里的连线不对：${linked}`);
  must(sh.equivalent.notes.some((t) => t.includes('借阅规则 v2 第 8 条') && t.includes('版本与判断') && t.includes('不拉连线')), '时间图里的依据画在别的件里这件事，等效文字没有说');
  must((sh.svg.match(/data-role="scale-note"/g) ?? []).length === 3, '组合里每一件都应保留自己的读法');
  // 行的 id、字段的 id 和对象的 id 不是一回事：指向“item”这个对象的依据，不该连到名叫 item 的字段上
  const trap = GEN['rel-sheet']({ title: 't', pieces: [{ asset: 'rel-rail', heading: '一', model: { title: 'a', scale: { kind: 'order' }, rows: [{ id: 'r', label: '查阅', basis: { id: 'item', label: '某个对象', locator: '第 1 条' } }] } }, { asset: 'rel-pair', heading: '二', model: byId('pair-slip').model }] }, { width: 480, scope: 'trap' });
  must(!trap.links.some((l) => l.target === 'item'), '指向一个对象的依据被连到了同名的字段上');
  // 注入的文字不破坏 XML
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'svg01-evil-'));
  svgs.forEach((svg, i) => fs.writeFileSync(path.join(dir, `evil-${i}.svg`), svg));
  const lint = spawnSync('xmllint', ['--noout', ...svgs.map((_, i) => path.join(dir, `evil-${i}.svg`))], { encoding: 'utf8' });
  fs.rmSync(dir, { recursive: true, force: true });
  must(!lint.error && lint.status === 0, `注入之后不是格式良好的 XML：${lint.stderr?.slice(0, 200)}`);
  return `四种输入里的 <script> 字样都作为文字输出；12 个实例共 ${scan.ids} 个 ID，无重复、无越界引用，注入后仍是格式良好的 XML；组合里对照表的两栏连到调阅单的两个版本，时间图里的依据只留作文字并在等效文字里说明；同名的字段不被误连`;
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
{
  // 压力：栏名长到折行；一串宽的大写字母（估宽最容易偏窄的字形）
  const longLane = clone(byId('rail-day').model);
  longLane.lanes[0].label = '古籍修复与数字化加工中心的值班安排';
  const ll = draw('rel-rail', longLane, 672, 'long-lane');
  probeItems.push({ scope: 'long-lane', group: 'case', w: ll.width, labels: ll.labels, svg: ll.svg });
  const caps = { title: 't', scale: { kind: 'list', depth: '包含' }, rows: [{ id: 'a', label: 'WWWWWWWWWWWWWWWWWWWW MMMMMMMMMMMMM' }, { id: 'b', parent: 'a', label: 'MMMMMMMMMMMMMMMM WWWWWWWWWWWWWWWWWWWWWWW', note: 'WWWWWWWWWWWWWWWWWWWWWWWWWWWW' }] };
  for (const w of WIDTHS) {
    const cp = draw('rel-rail', caps, w, `caps-${w}`);
    probeItems.push({ scope: `caps-${w}`, group: 'case', w: cp.width, labels: cp.labels, svg: cp.svg });
  }
  const pc = draw('rel-pair', { title: 't', kind: 'change', before: { label: '原', ref: { id: 'a', version: 1 } }, after: { label: '现', ref: { id: 'a', version: 2 } }, fields: [{ id: 'f', label: 'WWWWWWWWWW', before: 'MMMMMMMMMMMMMMMMMMMM WWWW', after: 'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW' }] }, 672, 'caps-pair');
  probeItems.push({ scope: 'caps-pair', group: 'case', w: pc.width, labels: pc.labels, svg: pc.svg });
  // 对照：窄版对照表里把一格挪到下一行去；把一行的 data-parent 写成别的上级
  const ps = draw('rel-pair', byId('pair-slip').model, NARROW, 'control-stacked');
  probeItems.push({ scope: 'control-stacked', group: 'control', w: ps.width, labels: [], svg: ps.svg.replace(/(<text x=")([\d.]+)(" y="[\d.]+"[^>]*data-text="duration\.after")/, (m, a, x, z) => `${a}${+x - 60}${z}`) });
  const tp = draw('rel-rail', byId('rail-tree').model, NARROW, 'control-parent');
  probeItems.push({ scope: 'control-parent', group: 'control', w: tp.width, labels: tp.labels, svg: tp.svg.replace('data-row-id="rare-stack" data-role="row" data-parent="stacks"', 'data-row-id="rare-stack" data-role="row" data-parent="service"') });
}
{
  // 对照：把一个时刻的圆点往下挪 20；把“装帧组”的层级写成 2；把对照表里一格往右挪出它那一栏
  const t = draw('rel-rail', f04ToRail(F.F04), NARROW, 'control-time');
  probeItems.push({ scope: 'control-time', group: 'control', w: t.width, labels: t.labels, svg: t.svg.replace(/(<circle cx="[\d.]+" cy=")([\d.]+)("[^>]*data-mark-for="t2")/, (m, a, y, z) => `${a}${+y + 20}${z}`) });
  const tr = draw('rel-rail', byId('rail-tree').model, NARROW, 'control-level');
  probeItems.push({ scope: 'control-level', group: 'control', w: tr.width, labels: tr.labels, svg: tr.svg.replace(/(data-row-id="binding"[^>]*data-level=")4/, '$12') });
  const pr = draw('rel-pair', byId('pair-slip').model, 672, 'control-cell');
  probeItems.push({ scope: 'control-cell', group: 'control', w: pr.width, labels: pr.labels, svg: pr.svg.replace(/(<text x=")([\d.]+)("[^>]*data-text="duration\.after")/, (m, a, x, z) => `${a}${+x + 40}${z}`) });
}
const probeScript = `
const items = JSON.parse(document.getElementById('data').textContent);
const out = { ua: navigator.userAgent, svgs: 0, texts: 0, overBudget: [], outside: [], collisions: [], missing: [], refs: [], slack: [], strikes: [], brackets: 0, bracketErrors: [], bindings: 0, bindingErrors: [], fragments: 0, fragmentErrors: [], timeMarks: 0, timeErrors: [], levels: 0, levelErrors: [], cells: 0, cellErrors: [], control: { strikes: [], bracketErrors: [], bindingErrors: [], fragmentErrors: [], timeErrors: [], levelErrors: [], cellErrors: [] }, removal: null };
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
    const segs = [];
    let px = 0, py = 0, last = null;
    for (const m of p.getAttribute('d').matchAll(/([MLHV])\\s*(-?[\\d.]+)(?:[ ,](-?[\\d.]+))?/g)) {
      if (m[1] === 'H') px = +m[2]; else if (m[1] === 'V') py = +m[2]; else { px = +m[2]; py = +m[3]; }
      const pt = [ctm.a * px + ctm.c * py + ctm.e, ctm.b * px + ctm.d * py + ctm.f];
      if (m[1] !== 'M' && last) segs.push([last, pt]);
      last = pt;
    }
    for (const [a, z] of segs) {
      const seg = { x: Math.min(a[0], z[0]), y: Math.min(a[1], z[1]), width: Math.abs(z[0] - a[0]), height: Math.abs(z[1] - a[1]) };
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
  // 时间图：每个记号的位置由标尺上的刻度线性推出；引线的一头在记号的高度，另一头在它那一行的首行里
  for (const rail of svg.querySelectorAll('g[data-role="rail"]')) {
    const ticks = [...rail.querySelectorAll('path[data-tick-ms]')].map((t) => ({ ms: +t.getAttribute('data-tick-ms'), y: t.getBBox().y }));
    if (ticks.length < 2) continue;
    const a = ticks[0], z = ticks[ticks.length - 1];
    const yOf = (ms) => a.y + ((ms - a.ms) / (z.ms - a.ms)) * (z.y - a.y);
    for (const mk of rail.querySelectorAll('[data-mark-for]')) {
      out.timeMarks++;
      const id = mk.getAttribute('data-mark-for');
      const bb = mk.getBBox();
      const shape = mk.getAttribute('data-shape');
      const want = yOf(+mk.getAttribute('data-at-ms'));
      const got = shape === 'point' || shape === 'deadline' ? bb.y + bb.height / 2 : bb.y;
      if (Math.abs(got - want) > 1) sink.timeErrors.push(it.scope + ': ' + id + ' 的记号在 ' + got.toFixed(1) + '，按时刻应在 ' + want.toFixed(1));
      if (mk.hasAttribute('data-until-ms') && bb.height > 3.01 && Math.abs(bb.y + bb.height - yOf(+mk.getAttribute('data-until-ms'))) > 1) sink.timeErrors.push(it.scope + ': ' + id + ' 的区间长度不按比例');
      if (shape === 'open-interval' && (bb.height > 24 || mk.hasAttribute('data-until-ms'))) sink.timeErrors.push(it.scope + ': ' + id + ' 结束未知，却画出了长度');
      const lead = rail.querySelector('path[data-leader-for="' + CSS.escape(id) + '"]');
      const head = rail.querySelector('g[data-row-id="' + CSS.escape(id) + '"] text');
      if (!lead || !head) { sink.timeErrors.push(it.scope + ': ' + id + ' 没有引线或没有文字'); continue; }
      const n = lead.getTotalLength();
      const p0 = lead.getPointAtLength(0), p1 = lead.getPointAtLength(n);
      const hb = head.getBBox();
      if (Math.abs(p0.y - want) > 1) sink.timeErrors.push(it.scope + ': ' + id + ' 的引线没有从它的时刻出发');
      if (p1.y < hb.y - 1 || p1.y > hb.y + 20 || p1.x > hb.x || p1.x < hb.x - 14) sink.timeErrors.push(it.scope + ': ' + id + ' 的引线没有接到它的文字');
    }
  }
  // 上下级：同一层的文字左缘对齐，层级越深越靠右，下级在上级下面
  const leveled = [...svg.querySelectorAll('g[data-role="row"][data-level]')].map((g) => ({ id: g.getAttribute('data-row-id'), parent: g.getAttribute('data-parent'), level: +g.getAttribute('data-level'), b: g.querySelector('text').getBBox() }));
  for (const row of leveled) {
    out.levels++;
    const same = leveled.find((o) => o.level === row.level);
    if (Math.abs(same.b.x - row.b.x) > 0.6) sink.levelErrors.push(it.scope + ': ' + row.id + ' 与同层的 ' + same.id + ' 左缘不齐');
    if (!row.parent) { if (row.level !== 1) sink.levelErrors.push(it.scope + ': ' + row.id + ' 没有上级，却不在第一层'); continue; }
    const up = leveled.find((o) => o.id === row.parent);
    if (!up || up.level !== row.level - 1 || up.b.x >= row.b.x - 6 || up.b.y >= row.b.y) { sink.levelErrors.push(it.scope + ': ' + row.id + ' 的缩进或位置与它的上级对不上'); continue; }
    // 往上找第一个浅一层的行，它应当就是写着的那个上级
    const above = leveled.filter((o) => o.b.y < row.b.y && o.level === row.level - 1).sort((p, q) => q.b.y - p.b.y)[0];
    if (above.id !== row.parent) sink.levelErrors.push(it.scope + ': ' + row.id + ' 画在 ' + above.id + ' 下面，写的上级却是 ' + row.parent);
  }
  // 并排的栏：同一行各格的首行同高，各格左缘落在自己那一栏的栏名之下
  if (svg.getAttribute('data-layout') === 'columns' && svg.getAttribute('data-scale') === 'list') {
    const lanes = svg.getAttribute('data-lanes').split(' ');
    const boxOf = (key) => { const t = svg.querySelector('text[data-text="' + CSS.escape(key) + '"]'); return t ? t.getBBox() : null; };
    for (const g of svg.querySelectorAll('g[data-role="row"]')) {
      const id = g.getAttribute('data-row-id');
      const tops = [];
      for (const ln of lanes) {
        out.cells++;
        const cb = boxOf(id + '.' + ln), hb = boxOf(ln + '.lane');
        if (!cb || !hb) { sink.cellErrors.push(it.scope + ': ' + id + ' 在 ' + ln + ' 一栏没有文字'); continue; }
        tops.push(cb.y);
        if (cb.x < hb.x - 0.6 || cb.x > hb.x + 14) sink.cellErrors.push(it.scope + ': ' + id + ' 的 ' + ln + ' 一格不在它那一栏之下');
      }
      if (Math.max(...tops) - Math.min(...tops) > 1) sink.cellErrors.push(it.scope + ': ' + id + ' 这一行的几格不在同一高度');
    }
  }
  // 窄版的并排栏：每一格和它的栏名同高，都在这一行的名称之下、下一行的名称之上
  if (svg.getAttribute('data-layout') === 'stacked') {
    const lanes = svg.getAttribute('data-lanes').split(' ');
    const boxOf = (key) => { const t = svg.querySelector('text[data-text="' + CSS.escape(key) + '"]'); return t ? t.getBBox() : null; };
    const rows = [...svg.querySelectorAll('g[data-role="row"]')].map((g) => g.getAttribute('data-row-id'));
    rows.forEach((id, i) => {
      const head = boxOf(id + '.label'), next = rows[i + 1] ? boxOf(rows[i + 1] + '.label') : null;
      for (const ln of lanes) {
        out.cells++;
        const cb = boxOf(id + '.' + ln), nb = boxOf(id + '.' + ln + '.lane');
        if (!cb || !nb || !head) { sink.cellErrors.push(it.scope + ': ' + id + ' 在 ' + ln + ' 一栏没有文字或没有栏名'); continue; }
        if (Math.abs(cb.y - nb.y) > 4 || nb.x >= cb.x) sink.cellErrors.push(it.scope + ': ' + id + ' 的 ' + ln + ' 一格和它的栏名不在同一行');
        if (cb.y < head.y + head.height - 2 || (next && cb.y + cb.height > next.y + 2)) sink.cellErrors.push(it.scope + ': ' + id + ' 的 ' + ln + ' 一格不在这一行里');
      }
    });
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
  push('P09', '浏览器实测：时间记号按比例落在标尺上，引线接到自己的文字', !d.timeErrors.length && d.control.timeErrors.length > 0, d.timeErrors.slice(0, 8).join('；') || `${d.timeMarks} 个记号；对照图报出 ${d.control.timeErrors.length} 处`);
  push('P10', '浏览器实测：缩进与层级一致，下级在上级之下', !d.levelErrors.length && d.control.levelErrors.length > 2, d.levelErrors.slice(0, 8).join('；') || `${d.levels} 行；对照图报出 ${d.control.levelErrors.length} 处`);
  push('P11', '浏览器实测：并排的栏里同一行同高、各格在自己的栏下', !d.cellErrors.length && d.control.cellErrors.length > 1, d.cellErrors.slice(0, 8).join('；') || `${d.cells} 格；对照图报出 ${d.control.cellErrors.length} 处`);
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
