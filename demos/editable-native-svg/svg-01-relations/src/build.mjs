// 由输入重建全部 SVG、svg/manifest.json 和预览页 index.html。
// 用法：node src/build.mjs

import fs from 'node:fs';
import path from 'node:path';
import { VERSION, Refusal, esc } from './kernel.mjs';
import { HERE, GEN, NARROW, wideOf, cases } from './cases.mjs';

const ASSETS = [
  {
    id: 'rel-fan',
    name: '分支与汇合',
    job: '一个对象有几条去向，各由什么条件决定；或者几项输入怎样汇到一处。只有一条出边时，它就是一条写明类型和依据的方向关系。',
    facts: [
      ['输入', '一个中心对象，若干条带条件或类型的关系，各自的端点和依据'],
      ['可以改', '条件与标签、端点、分支次序、方向、汇合规则、每条关系是否成立'],
      ['不适用', '条件不完备、需要完整决策表、关系没有依据'],
      ['测试到', '1 至 8 条关系'],
    ],
  },
  {
    id: 'rel-scope',
    name: '范围与跨界',
    job: '谁在哪个范围里，哪些关系越过了边界。每个边界都写明它表示什么，位置本身不表示权限。',
    facts: [
      ['输入', '容器及其上下级，成员，跨界关系及依据'],
      ['可以改', '成员、嵌套、边界说明、关系端点与状态'],
      ['不适用', '集合互相重叠、边框只是装饰、两端在同一范围内的关系'],
      ['测试到', '3 层嵌套、空容器、3 条跨界关系'],
    ],
  },
  {
    id: 'rel-qualify',
    name: '限定与证据',
    job: '条件、注释和证据各自限定哪一项主张，或者主张里的哪几个字。括线量的是被限定的主张，不是限定语自己。',
    facts: [
      ['输入', '主张，限定语及其目标（一项、相邻几项或一个片段），证据的来源身份与核对状态'],
      ['可以改', '主张与限定语的文字、目标、片段、证据关系与状态'],
      ['不适用', '整体说明硬绑到某一项主张、同一项主张上叠三层及以上的范围'],
      ['测试到', '3 项主张、一项主张上 5 条证据、四倍长的条件、一项主张上至多两层范围'],
    ],
  },
  {
    id: 'rel-tracks',
    name: '版本与绑定',
    job: '材料、事项、规则各有自己的版本。一条判断绑定的是某个对象的某个版本，别的对象更新不会带着它走。',
    facts: [
      ['输入', '对象及其版本，判断、建议或候选及其依据版本，尚无记录的空缺'],
      ['可以改', '版本、依据、状态、空缺说明'],
      ['不适用', '用一个全局版本号概括所有对象；需要按时长比例排布'],
      ['测试到', '1 至 4 条版本线，每条 1 至 2 个版本'],
    ],
  },
];
ASSETS.push({
  id: 'rel-sheet',
  name: '组合',
  job: '几件图叠成一张，靠共同的指向串起来。一件里写到的“对象@版本”如果正好画在另一件里，两处之间在左侧留白处连一条细线。',
  facts: [
    ['输入', '两件以上的图，各带一个小标题；各件的指向写成 id、version、locator'],
    ['可以改', '各件的内容与次序；指向改了，连线跟着变'],
    ['不适用', '宽度超过 520；被指到的对象或版本超过五个。只是一句话、没有身份的指向照常留作文字，但连不上'],
    ['测试到', '3 件、3 条连线'],
  ],
});
const ROLE = { normal: '正常输入', stress: '压力输入', counterexample: '反例输入' };

const out = path.join(HERE, 'svg');
for (const n of fs.readdirSync(out)) if (n.endsWith('.svg')) fs.rmSync(path.join(out, n));

const manifest = { asset_version: VERSION, widths: { narrow: NARROW, wide: 'rel-scope 与 rel-sheet 480，其余 672' }, cases: [], refusals: [] };
const inline = {};
for (const cs of cases()) {
  const gen = GEN[cs.asset];
  if (cs.role === 'refuse') {
    let got = null;
    try {
      gen(cs.model, { width: NARROW, scope: 'refused' });
    } catch (e) {
      if (!(e instanceof Refusal)) throw e;
      got = { code: e.code, message: e.message };
    }
    if (got?.code !== cs.refuse) throw new Error(`${cs.id}: 应以 ${cs.refuse} 拒用，实际 ${got?.code ?? '画出来了'}`);
    manifest.refusals.push({ id: cs.id, asset: cs.asset, note: cs.note, ...got });
    continue;
  }
  const outputs = [];
  let equivalent;
  for (const width of [wideOf(cs.asset), NARROW]) {
    const scope = `${cs.id}-w${width}`;
    const res = gen(cs.model, { width, scope });
    const file = `${cs.id}--w${width}.svg`;
    fs.writeFileSync(path.join(out, file), res.svg);
    inline[scope] = res.svg;
    equivalent = res.equivalent;
    outputs.push({ width, scope, file: `svg/${file}`, w: res.width, h: res.height, boxes: res.boxes, labels: res.labels, brackets: res.brackets, links: res.links, mentions: res.mentions });
  }
  manifest.cases.push({
    id: cs.id,
    asset: cs.asset,
    role: cs.role,
    fixture: cs.fixture ?? null,
    requirements: cs.requirements,
    title: cs.model.title,
    note: cs.note,
    input: cs.fixture ? `../fixtures.json#${cs.fixture}` : (cs.input ?? `inputs/${cs.id}.json`),
    equivalent,
    outputs,
  });
}
fs.writeFileSync(path.join(out, 'manifest.json'), `${JSON.stringify(manifest, null, 1)}\n`);

const list = (xs) => (xs.length ? `<ul>${xs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '');
const caseHtml = (cs) => {
  const [wide, narrow] = cs.outputs;
  const input = cs.fixture ? `<a href="../fixtures.json">fixtures.json 的 ${cs.fixture}</a>，经 src/cases.mjs 适配` : `<a href="${cs.input}">${cs.input}</a>`;
  return `<article class="case" id="${cs.id}">
<h3>${esc(cs.title)} <span class="role">${ROLE[cs.role]}</span></h3>
<p>${esc(cs.note)}</p>
<div class="pair">
<figure class="wide">${inline[wide.scope]}<figcaption>宽 ${wide.width}</figcaption></figure>
<figure class="narrow">${inline[narrow.scope]}<figcaption>窄 ${narrow.width}</figcaption></figure>
</div>
<div class="equiv"><h4>等效文字</h4><p>${esc(cs.equivalent.summary)}</p>${list(cs.equivalent.items)}${list(cs.equivalent.notes)}</div>
<p class="files">输入：${input}。文件：<a href="${wide.file}">${wide.file}</a>、<a href="${narrow.file}">${narrow.file}</a></p>
</article>`;
};
const assetHtml = (a) => {
  const own = manifest.cases.filter((c) => c.asset === a.id);
  const refused = manifest.refusals.filter((c) => c.asset === a.id);
  return `<section id="${a.id}">
<h2>${a.name} <code>${a.id}</code></h2>
<p class="job">${a.job}</p>
<dl>${a.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
${own.map(caseHtml).join('\n')}
<h3>拒用的输入</h3>
<table><thead><tr><th>输入</th><th>拒用理由</th></tr></thead><tbody>
${refused.map((x) => `<tr><td><a href="inputs/${x.id}.json">${esc(x.note)}</a></td><td>${esc(x.message)}</td></tr>`).join('\n')}
</tbody></table>
</section>`;
};

const css = `
:root{--ink:#1b2733;--sub:#526276;--rule:#dbe2eb;--accent:#1f5fd1}
*{box-sizing:border-box}
body{margin:0;background:#fff;color:var(--ink);font:16px/1.7 system-ui,-apple-system,"PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","Microsoft YaHei",sans-serif}
header,main{max-width:1040px;margin:0 auto;padding:0 16px}
header{padding-top:40px}
h1{font-size:26px;line-height:1.3;margin:0 0 12px}
h2{font-size:20px;margin:56px 0 8px;padding-top:24px;border-top:1px solid var(--rule)}
h3{font-size:16px;margin:36px 0 4px}
h4{font-size:13px;margin:0;color:var(--sub)}
p{margin:0 0 12px;max-width:44em}
code{font:13px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--sub);font-weight:400}
a{color:var(--accent)}
.role{font-size:13px;font-weight:400;color:var(--sub);margin-left:8px}
nav a{margin-right:16px}
dl{margin:12px 0 0;font-size:14px}
dl div{display:flex;gap:16px;padding:4px 0;border-bottom:1px solid var(--rule);max-width:44em}
dt{flex:0 0 4em;color:var(--sub)}
dd{margin:0}
.pair{display:flex;gap:40px;align-items:flex-start;margin:16px 0}
figure{margin:0}
figure svg{display:block;max-width:100%;height:auto}
figcaption{font-size:12px;color:var(--sub);margin-top:8px}
.wide{display:none}
.equiv{font-size:14px;color:var(--sub);max-width:48em}
.equiv p{margin:0}
.equiv ul{margin:4px 0;padding-left:1.4em}
.files{font-size:13px;color:var(--sub);overflow-wrap:anywhere}
table{border-collapse:collapse;font-size:14px;margin:8px 0 0;max-width:48em}
th,td{text-align:left;vertical-align:top;padding:6px 16px 6px 0;border-bottom:1px solid var(--rule)}
th{font-weight:600;color:var(--sub)}
footer{max-width:1040px;margin:56px auto 40px;padding:16px 16px 0;border-top:1px solid var(--rule);font-size:13px;color:var(--sub)}
@media (min-width:736px){.wide{display:block}.narrow{display:none}}
@media (min-width:1040px){.narrow{display:block}}
@media print{.wide{display:block}.narrow{display:none}.case{break-inside:avoid}h2{break-after:avoid}}
`;

const html = `<!doctype html>
<html lang="zh-Hans">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>四个可编辑的关系图件 · SVG-01</title>
<style>${css}</style>
</head>
<body>
<header>
<h1>四个可编辑的关系图件</h1>
<p>每一张图都由一份语义输入生成：改输入里的文字、端点、目标或版本，图、等效文字和文件一起重建。文字是 SVG 的文字节点，没有转成轮廓。全部内容是合成的图书馆示例和本项目的合成 fixture。</p>
<p>线型回答“生效了吗”：实线是已经成立，虚线是尚未成立或没有生效。端点回答“确认了吗”：实心是已确认，空心是未确认，叉是已拒绝。蓝色只用在还等人决定的那一处。每个回答同时写成词，写在它说的那一项旁边。版本 ${VERSION}，SVG-01 批次；验收范围见 <a href="acceptance.md">acceptance.md</a>。</p>
<nav>${ASSETS.map((a) => `<a href="#${a.id}">${a.name}</a>`).join('')}</nav>
</header>
<main>
${ASSETS.map(assetHtml).join('\n')}
</main>
<footer>由 <code>node src/build.mjs</code> 生成，请勿手改本页；要改图，改 inputs/ 或 fixtures.json 后重建。</footer>
</body>
</html>
`;
fs.writeFileSync(path.join(HERE, 'index.html'), html);
console.log(JSON.stringify({ cases: manifest.cases.length, svgs: manifest.cases.length * 2, refusals: manifest.refusals.length }));
