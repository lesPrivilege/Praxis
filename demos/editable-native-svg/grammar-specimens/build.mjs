// 两条关系语法的样板页。内容取自 ../svg-01-relations/inputs/sheet-rare-book.json，
// 图由那里的生成器画；本页只负责把同一份内容按三级做法摆出来。
// 用法：node build.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { T, VERSION, anchor, anchorText, canvas, esc, finish } from '../svg-01-relations/src/kernel.mjs';
import { STANDING, WHO } from '../svg-01-relations/src/standing.mjs';
import { GEN } from '../svg-01-relations/src/cases.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const input = JSON.parse(fs.readFileSync(path.join(HERE, '..', 'svg-01-relations', 'inputs', 'sheet-rare-book.json'), 'utf8'));
const piece = (asset) => input.model.pieces.find((p) => p.asset === asset).model;
const claims = piece('rel-qualify');
const versions = piece('rel-tracks');

const files = {};
const draw = (name, asset, model, width) => {
  const res = GEN[asset](model, { width, scope: `${name}-w${width}` });
  fs.writeFileSync(path.join(HERE, 'svg', `${name}--w${width}.svg`), res.svg);
  files[`${name}-w${width}`] = res;
  return res.svg;
};
const pair = (name, asset, model, wide) =>
  `<div class="pair"><figure class="wide">${draw(name, asset, model, wide)}<figcaption>宽 ${wide}</figcaption></figure><figure class="narrow">${draw(name, asset, model, 288)}<figcaption>窄 288</figcaption></figure></div>`;

// 反例：三条虚线各表示一件不同的事，画法却一样
function sameDash(width) {
  const c = canvas(`counter-dash-w${width}`);
  const rows = [
    ['建议：重新审核', '意思是建议还没有生效'],
    ['证据：值班员口述', '意思是证据还没有核对'],
    ['品相记录', '意思是这份记录不存在'],
  ];
  let y = 0;
  rows.forEach(([label, meaning], i) => {
    c.path([[0, y + 10.5], [36, y + 10.5]], { st: { line: 'dashed', end: 'none' } });
    c.label(`row.${i}.label`, label, { x: 46, y, w: width - 50 });
    y += 21;
    y += c.label(`row.${i}.meaning`, meaning, { x: 46, y, w: width - 50, size: T.small, fill: T.sub }).h + 10;
  });
  const res = finish(c, { asset: 'counterexample', width, height: y - 10, title: '反例：一条虚线回答三个问题', desc: '三条画法相同的虚线，分别表示未生效、未核对和不存在。' });
  fs.writeFileSync(path.join(HERE, 'svg', `counter-dash--w${width}.svg`), res.svg);
  return res.svg;
}

const table = (head, rows) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

const standingRows = [
  ...versions.bindings.map((b) => [`${b.kind}：${b.text}`, WHO[b.origin], STANDING[b.state].word, b.basis.map((a) => anchorText(anchor(a, ''))).join('；')]),
  ...versions.absences.map((a) => [a.text, '—', STANDING.none.word, anchorText(anchor({ id: a.id, version: a.version, label: a.label }, ''))]),
];
const claimText = Object.fromEntries(claims.claims.map((c) => [c.id, c.text]));
const anchorRows = claims.qualifiers.map((q) => {
  const a = anchor(q.source, '');
  return [claimText[q.target.claim], q.text, anchorText(a), q.target.fragment ? `只限“${q.target.fragment}”` : '整项主张', a.located ? (a.version != null && a.locator ? '对象、版本、位置都有' : '缺版本或位置') : '只有一句话，回查不到'];
});

const css = `
:root{--ink:#1b2733;--sub:#526276;--rule:#dbe2eb;--accent:#1f5fd1}
*{box-sizing:border-box}
body{margin:0;background:#fff;color:var(--ink);font:16px/1.7 system-ui,-apple-system,"PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","Microsoft YaHei",sans-serif}
header,main,footer{max-width:1040px;margin:0 auto;padding:0 16px}
header{padding-top:40px}
h1{font-size:26px;line-height:1.3;margin:0 0 12px}
h2{font-size:20px;margin:56px 0 8px;padding-top:24px;border-top:1px solid var(--rule)}
h3{font-size:16px;margin:36px 0 6px}
h3 small{font-size:13px;font-weight:400;color:var(--sub);margin-left:8px}
p{margin:0 0 12px;max-width:44em}
a{color:var(--accent)}
.pair{display:flex;gap:40px;align-items:flex-start;margin:16px 0}
figure{margin:16px 0}
.pair figure{margin:0}
figure svg{display:block;max-width:100%;height:auto}
figcaption{font-size:12px;color:var(--sub);margin-top:8px}
.wide{display:none}
table{border-collapse:collapse;font-size:14px;margin:8px 0 12px;width:100%;max-width:60em}
th,td{text-align:left;vertical-align:top;padding:6px 16px 6px 0;border-bottom:1px solid var(--rule)}
th{font-weight:600;color:var(--sub);white-space:nowrap}
.scroll{overflow-x:auto}
footer{margin-top:56px;margin-bottom:40px;padding-top:16px;border-top:1px solid var(--rule);font-size:13px;color:var(--sub)}
@media (min-width:736px){.wide{display:block}.narrow{display:none}}
@media (min-width:1040px){.narrow{display:block}}
@media print{.wide{display:block}.narrow{display:none}figure,table{break-inside:avoid}h2,h3{break-after:avoid}}
`;

const html = `<!doctype html>
<html lang="zh-Hans">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>两条关系语法的样板</title>
<style>${css}</style>
</head>
<body>
<header>
<h1>两条关系语法的样板</h1>
<p>同一份合成内容，一张破损古籍的调阅单，用来演示两件事：怎样标出一句话成立到哪一步、是谁说的；怎样写清一句话指的是哪个对象的哪个版本、哪一处。</p>
<p>每条语法分三级做。第一级只用文字，任何材料都做得到；第二级是一张图；第三级把几张图连成一张。前一级写清楚了，后一级才有东西可画，所以后两级不新增信息，只让同样的信息更快被看见。</p>
<p><a href="#standing">成立程度与归属</a>　<a href="#anchoring">精确指向</a></p>
</header>
<main>
<section id="standing">
<h2>成立程度与归属</h2>
<p>一个记号只回答一个问题。这里把四个问题分开：生效了吗，确认了吗，还等谁决定，是谁说的。前三个各占一种画法，第四个写成字。</p>

<h3>第一级 <small>只用文字</small></h3>
<p>每一行把“谁”和“成立到哪一步”写成词。图里的记号都是这两栏的重复，去掉图，这张表仍然完整。</p>
<div class="scroll">${table(['内容', '谁', '成立到哪一步', '绑定在'], standingRows)}</div>

<h3>第二级 <small>一张图</small></h3>
<p>线型回答“生效了吗”，端点回答“确认了吗”，蓝色只标还等人决定的那一处。图例由图自己生成，只列这张图里出现的画法。</p>
${pair('standing', 'rel-tracks', versions, 672)}

<h3>反例 <small>一条虚线回答三个问题</small></h3>
<p>下面三条虚线画法相同，说的却是三件事。读者只能靠旁边的小字分辨，小字一省，三件事就混在一起。本页的图把它们分开：没有生效的建议是虚线加空心端点（上图）；没有核对的证据是实线加空心端点（下一节的图）；还不存在的记录是虚线、没有端点（上图最后一行）。</p>
<figure>${sameDash(288)}</figure>

<h3>第三级 <small>几张图连成一张</small></h3>
<p>几件图叠在一起时共用同一套画法，图例只出现一次。图在下一节的第三级，这里不重复。</p>

<h3>默认画法</h3>
<div class="scroll">${table(
  ['画法', '回答的问题', '取值'],
  [
    ['线型', '生效了吗', '实线：已经成立。虚线：尚未成立或没有生效'],
    ['端点', '确认了吗', '实心：已确认。空心：未确认。叉：已拒绝。没有端点：还不存在'],
    ['蓝色', '还等谁决定', '只用于等人决定的那一处；已经作出的决定用墨色'],
    ['文字', '是谁说的', '人、机器、规则、记录、上下文；来路不止一种时写在每一条的开头'],
  ],
)}</div>
<p>这是这一族关系图的默认分配，不是通用规则。换一类图可以另行分配，例如用线型表示证据强弱；但一张图里一种画法仍只回答一个问题，并且写进图例。</p>
</section>

<section id="anchoring">
<h2>精确指向</h2>
<p>一句话指向别的东西时，写清三件事：哪个对象，哪个版本，哪一处。写不出来的那一层照实标出来，不拿位置相邻来代替。</p>

<h3>第一级 <small>只用文字</small></h3>
<p>每条证据带一个指向，写成“对象 版本 位置”。最后一栏说明这个指向回查得到多少。</p>
<div class="scroll">${table(['主张', '证据', '指向', '限定范围', '回查'], anchorRows)}</div>

<h3>第二级 <small>一张图</small></h3>
<p>括线量的是被限定的主张；只限定几个字时，那几个字在原文里加下划线，并在证据的标题里引出来。指向跟在每条证据后面。</p>
${pair('anchoring', 'rel-qualify', claims, 672)}

<h3>第三级 <small>几张图连成一张</small></h3>
<p>证据、判断和分支的依据用的是同一种指向。某一件里写到的“对象 版本”如果画在另一件里，两处之间就在左侧留白处连一条浅线。“审核通过”连到规则 v2，分支的依据和新证据连到 v3，审核依据的是旧版规则这件事，不用另写一句也看得出来。</p>
${pair('sheet', 'rel-sheet', input.model, 480)}

<h3>反例 <small>只写“依据：借阅规则”</small></h3>
<div class="scroll">${table(
  ['写法', '规则更新之后'],
  [
    ['审核通过。依据：借阅规则', '这句话读起来仍然成立，看不出审核用的是旧版'],
    ['审核通过。依据：借阅规则 v2 第 8 条', '规则到了 v3，这条指向落在旧版本上，需要重新审核一望即知'],
  ],
)}</div>
</section>
</main>
<footer>由 <code>node build.mjs</code> 生成，图件版本 ${VERSION}。内容是合成的，不是真实馆务。语法本身见 Kit 的 Design / Foundations，生成器见 <a href="../svg-01-relations/README.md">svg-01-relations</a>。</footer>
</body>
</html>
`;
fs.writeFileSync(path.join(HERE, 'index.html'), html);
fs.writeFileSync(path.join(HERE, 'svg', 'manifest.json'), `${JSON.stringify(Object.fromEntries(Object.entries(files).map(([k, v]) => [k, { w: v.width, h: v.height, links: v.links }])), null, 1)}\n`);
console.log(JSON.stringify({ svgs: fs.readdirSync(path.join(HERE, 'svg')).filter((n) => n.endsWith('.svg')).length }));
