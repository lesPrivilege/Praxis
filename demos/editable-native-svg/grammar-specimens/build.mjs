// 三条关系语法的样板页。内容取自 ../svg-01-relations/inputs/ 里同一张调阅单的几份输入，
// 图由那里的生成器画；本页只负责把同一份内容按三级做法摆出来。
// 用法：node build.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { T, VERSION, anchor, anchorText, canvas, esc, finish } from '../svg-01-relations/src/kernel.mjs';
import { spine } from '../svg-01-relations/src/rail.mjs';
import { STANDING, WHO } from '../svg-01-relations/src/standing.mjs';
import { GEN } from '../svg-01-relations/src/cases.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const input = JSON.parse(fs.readFileSync(path.join(HERE, '..', 'svg-01-relations', 'inputs', 'sheet-rare-book.json'), 'utf8'));
const read = (name) => JSON.parse(fs.readFileSync(path.join(HERE, '..', 'svg-01-relations', 'inputs', `${name}.json`), 'utf8')).model;
const day = read('rail-day');
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

// 反例：两条各排各的版本线并排，刻度落在同一高度
function sameHeight(width) {
  const c = canvas(`counter-height-w${width}`);
  const col = (x, w, name, rows) => {
    c.label(`${name}.name`, name, { x, y: 0, w, size: T.small, weight: 600, fill: T.sub });
    const at = c.parts.length;
    const ticks = rows.map(([head, text], i) => {
      const y = 28 + i * 62;
      c.label(`${name}.${i}.head`, head, { x: x + 20, y, w: w - 20, weight: 600 });
      c.label(`${name}.${i}.text`, text, { x: x + 20, y: y + 21, w: w - 20 });
      return { y: y + 10.5, filled: i === rows.length - 1 };
    });
    spine(c, at, x + 6, ticks);
  };
  const w = (width - 4 - 16) / 2;
  col(0, w, '调阅单 D-12', [['v1', '提交'], ['v2', '改了取书时间']]);
  col(w + 16, w, '借阅规则', [['v2', '审核时用的'], ['v3', '须经修复室同意']]);
  const res = finish(c, { asset: 'counterexample', width, height: 28 + 62 + 42, title: '反例：并排的两条线被读成同时', desc: '两条各排各的版本线并排，同一高度的刻度会被读成同一时刻。' });
  fs.writeFileSync(path.join(HERE, 'svg', `counter-height--w${width}.svg`), res.svg);
  return res.svg;
}

// 同一份内容的两种排法：只表示先后，和按时间比例
const timed = GEN['rel-rail'](day, { width: 288, scope: 'probe-day' });
const laneName = Object.fromEntries(day.lanes.map((ln) => [ln.id, ln.label]));
const whenOf = Object.fromEntries(timed.whens.map((x) => [x.id, x.when]));
const sorted = timed.whens.map((x) => day.rows.find((row) => row.id === x.id));
const asOrder = { title: '同一天，只排先后', scale: { kind: 'order' }, rows: sorted.map((row) => ({ id: row.id, label: row.label, note: `${whenOf[row.id]} · ${laneName[row.lane]}` })) };
const placementRows = sorted.map((row, i) => [row.label, laneName[row.lane], whenOf[row.id], `第 ${i + 1}`]);
const two = (a, b) => `<div class="two"><figure>${a[0]}<figcaption>${a[1]}</figcaption></figure><figure>${b[0]}<figcaption>${b[1]}</figcaption></figure></div>`;

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
.pair,.two{display:flex;gap:40px;align-items:flex-start;margin:16px 0}
.two{flex-wrap:wrap}
.two figure{margin:0}
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
<title>三条关系语法的样板</title>
<style>${css}</style>
</head>
<body>
<header>
<h1>三条关系语法的样板</h1>
<p>同一份合成内容，一张破损古籍的调阅单，用来演示三件事：怎样标出一句话成立到哪一步、是谁说的；怎样写清一句话指的是哪个对象的哪个版本、哪一处；把几项内容沿一条线排开时，怎样写明位置在说什么。</p>
<p>每条语法分三级做。第一级只用文字，任何材料都做得到；第二级是一张图；第三级把几张图连成一张。前一级写清楚了，后一级才有东西可画，所以后两级不新增信息，只让同样的信息更快被看见。</p>
<p><a href="#standing">成立程度与归属</a>　<a href="#anchoring">精确指向</a>　<a href="#placement">排列与刻度</a></p>
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

<section id="placement">
<h2>排列与刻度</h2>
<p>把几项内容沿一条线排开，读者会从位置读出四件事：谁先谁后，隔了多久，谁属于谁，哪两处说的是同一项。图里用到哪几件，就把哪几件写明；没有用到的，也要说一句“这不表示”。</p>

<h3>第一级 <small>只用文字</small></h3>
<p>每一行自己带着位置：属于哪条线，在什么时刻，排第几。表怎么重排，这三栏都跟着行走。后面的图只是把这三栏画成位置。</p>
<div class="scroll">${table(['事项', '属于', '时刻', '先后'], placementRows)}</div>

<h3>第二级 <small>一条线</small></h3>
<p>同一份内容排两次。左边只表示先后：相邻两项隔一分钟还是隔三小时，看上去一样远，所以图脚写明“间距不表示时长”。右边按时间比例：上午挤、下午空，一眼看得出；挤在一起的文字上下让开，由引线接回各自的时刻。</p>
${two([draw('placement-order', 'rel-rail', asOrder, 288), '只表示先后'], [draw('placement-time', 'rel-rail', day, 288), '按时间比例'])}
<p>什么时候不画右边这种：只知道先后；时长是约数，或一项按分钟、另一项按工作日。这时照左边画，并把知道的时间写成字。结束时间未知的区间只画起点，不替它估一个长度。</p>

<h3>反例 <small>并排的两条线被读成同时</small></h3>
<p>两条线各排各的版本，刻度却落在同一高度。读者会把调阅单 v1 和规则 v2、调阅单 v2 和规则 v3 读成两两同时，还会觉得各版之间隔得一样久。两件事图里都没有依据。上一节的版本图因此在图脚加了一句：不同的线之间，位置不表示谁先谁后。</p>
<figure>${sameHeight(288)}</figure>

<h3>第三级 <small>几条线共用一条标尺</small></h3>
<p>三栏共用一条按比例的标尺之后，跨栏的先后才读得出来。审核（09:40）在规则 v3 生效（10:15）之前，按 v2 审核在当时没有错；调阅单的改动（11:05）在 v3 之后，这一版还没有人按新规则审核。各排各的版本图回答不了这个问题。窄屏并成一条线，栏名写进每一行。</p>
${pair('placement-shared', 'rel-rail', day, 672)}

<h3>另外两种读法 <small>缩进与同一行</small></h3>
<p>缩进回答“属于谁”。缩进表示的是隶属、包含还是汇报，要写出来；同级之间的上下次序没有含义，也写出来。</p>
<figure>${draw('placement-tree', 'rel-rail', read('rail-tree'), 288)}</figure>
<p>同一行回答“是不是同一项”。前后两个版本按字段对齐，没有变的字段照样列出，空着的格子写明是原先没有还是已经不在。</p>
${pair('placement-pair', 'rel-pair', read('pair-slip'), 672)}

<h3>三条语法合在一张图里</h3>
<p>时间、对照和版本三件叠成一张。各件保留自己的读法，整张图另有一句：各件各排各的，互相不共用标尺。成立程度用同一套画法，图例只出现一次。对照表的两栏各指调阅单的一个版本，连到版本图里；时间图里的依据只留作文字，因为从留白拉过来的横线会穿过标尺，被读成一个刻度。</p>
${pair('placement-sheet', 'rel-sheet', read('sheet-day'), 480)}

<h3>位置的四种读法</h3>
<div class="scroll">${table(
  ['位置上的做法', '回答的问题', '要写明的'],
  [
    ['沿线的上下次序', '谁先谁后', '次序有没有含义；间距是不是时长'],
    ['沿线的距离', '隔了多久', '每格多长、按哪个时区；哪些长度不按比例'],
    ['缩进', '属于谁', '缩进表示哪种关系；同级的次序有没有含义'],
    ['同一行、同一高度', '是不是同一项、同一时刻', '几栏是否共用一条标尺；不共用时说明互相不可比'],
  ],
)}</div>
<p>这是位置能回答的问题，不是画法的规定。线画成竖的还是横的、刻度用点还是用短线、行间留多少空，都由项目决定。</p>
</section>
</main>
<footer>由 <code>node build.mjs</code> 生成，图件版本 ${VERSION}。内容是合成的，不是真实馆务。语法本身见 Kit 的 Design / Foundations，生成器见 <a href="../svg-01-relations/README.md">svg-01-relations</a>。</footer>
</body>
</html>
`;
fs.writeFileSync(path.join(HERE, 'index.html'), html);
fs.writeFileSync(path.join(HERE, 'svg', 'manifest.json'), `${JSON.stringify(Object.fromEntries(Object.entries(files).map(([k, v]) => [k, { w: v.width, h: v.height, links: v.links }])), null, 1)}\n`);
console.log(JSON.stringify({ svgs: fs.readdirSync(path.join(HERE, 'svg')).filter((n) => n.endsWith('.svg')).length }));
