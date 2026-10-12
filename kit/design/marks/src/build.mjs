// 由 src 里的三份来源生成交付文件：glyphs.svg、components.html、motion.html。
// 零依赖：node src/build.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { GLYPHS, GROUPS, ENDS, GLYPH_CSS, defs } from './glyphs.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const read = f => readFileSync(join(here, f), 'utf8');
const tokens = readFileSync(join(root, 'tokens.css'), 'utf8');

// —— glyphs.svg：定义加一张带文字标签的总览 ——
function overview() {
  const W = 960, pad = 32, cols = 6, cw = (W - pad * 2) / cols, rh = 62;
  let y = 58, out = '';
  const text = (x, yy, cls, s) => `<text x="${x}" y="${yy}" class="${cls}">${s}</text>`;
  out += text(pad, 44, 'h1', '承载稳定语义的记号与关系画法');
  out += text(W - pad, 44, 'note end', `记号 ${GLYPHS.length} 个 · 24 × 24 网格 · 描边 1.5 · currentColor`);
  for (const grp of GROUPS) {
    const items = GLYPHS.filter(g => g.group === grp.key);
    y += 34;
    out += `<path class="rule" d="M${pad} ${y - 20}H${W - pad}"/>` + text(pad, y, 'h2', grp.zh) + text(pad + 44, y, 'note', `${grp.note} · ${items.length} 个`);
    y += 18;
    items.forEach((g, i) => {
      const x = pad + (i % cols) * cw, yy = y + Math.floor(i / cols) * rh;
      out += `<use href="#${g.id}" x="${x}" y="${yy}" width="32" height="32"/>`
        + text(x + 42, yy + 14, 'lbl', g.zh + (g.sub ? `<tspan class="sub">  ${g.sub}</tspan>` : ''))
        + text(x + 42, yy + 30, 'id', g.id);
    });
    y += Math.ceil(items.length / cols) * rh;
  }
  // 关系画法
  y += 34;
  out += `<path class="rule" d="M${pad} ${y - 20}H${W - pad}"/>` + text(pad, y, 'h2', '关系') + text(pad + 44, y, 'note', '线型回答“生效了吗”，端点回答“确认了吗”，强调色只标“等人决定”，边界回答“在谁里面”');
  y += 30;
  const rows = [
    ['solid', 'solid', false, '已经成立 · 已确认'],
    ['solid', 'hollow', false, '已经成立 · 未确认'],
    ['pending', 'hollow', false, '尚未成立 · 未确认'],
    ['pending', 'cross', false, '已拒绝，没有生效'],
    ['pending', 'none', false, '这一项还不存在'],
    ['pending', 'hollow', true, '等人决定'],
  ];
  const rw = (W - pad * 2) / 3;
  rows.forEach(([line, end, accent, word], i) => {
    const x = pad + (i % 3) * rw, yy = y + Math.floor(i / 3) * 40, x2 = x + 96;
    out += `<g${accent ? ' class="accent"' : ''}><path class="g-line${line === 'pending' ? ' g-line--pending' : ''}" d="M${x + 4} ${yy}H${x2 - (end === 'none' ? 0 : 4)}"/>`
      + (end === 'none' ? '' : `<use href="#g-end-${end}" x="${x2 - 6}" y="${yy - 6}" width="12" height="12"/>`)
      + text(x2 + 16, yy + 5, 'lbl', word) + '</g>';
  });
  y += 80;
  const ax = pad;
  out += `<path class="g-line" d="M${ax + 4} ${y}H${ax + 90}"/><use href="#g-arrow" x="${ax + 84}" y="${y - 6}" width="12" height="12"/>` + text(ax + 112, y + 5, 'lbl', '箭头只表示方向，虚实随线')
    + text(pad + rw, y + 5, 'id', 'g-end-solid  g-end-hollow  g-end-cross  g-arrow  .g-line  .g-line--pending');
  y += 30;
  out += `<rect class="g-line" x="${pad + 4}" y="${y}" width="150" height="44" rx="6"/>` + text(pad + 14, y + 27, 'lbl', '范围 · 已经成立')
    + `<rect class="g-line g-line--pending" x="${pad + rw + 4}" y="${y}" width="150" height="44" rx="6"/>` + text(pad + rw + 14, y + 27, 'lbl', '范围 · 尚未成立')
    + text(pad + rw * 2, y + 27, 'note', '边界是一条闭合的线，虚实沿用线型的回答');
  y += 80;
  out += text(pad, y, 'note', '总览里的标签就是每个记号重复的那个词。记号旁边总有文字；去掉记号，内容不变。');
  y += pad;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${y}" width="${W}" height="${y}" role="img" aria-labelledby="t d">
<title id="t">承载稳定语义的记号与关系画法 · 总览</title>
<desc id="d">${GROUPS.map(g => g.zh + '：' + GLYPHS.filter(x => x.group === g.key).map(x => x.zh).join('、')).join('。')}。关系：实线与虚线，实心、空心、叉三种端点，箭头。</desc>
<style>
svg{color:#15202b;--paper:#fff;background:#fff;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","Microsoft YaHei",sans-serif}
text{fill:currentColor}
.h1{font-size:20px;font-weight:600}.h2{font-size:15px;font-weight:600}
.lbl{font-size:14px}.sub{font-size:12px;fill:#5d6a78}
.id{font-size:11px;fill:#5d6a78;font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace}
.note{font-size:12px;fill:#5d6a78}.end{text-anchor:end}
.rule{stroke:#d6dde6;stroke-width:1}
.accent{color:#1b58cf}
${GLYPH_CSS}
</style>
<defs>
${defs()}
</defs>
<rect width="100%" height="100%" fill="#fff"/>
${out}
</svg>
`;
}
writeFileSync(join(root, 'glyphs.svg'), overview());

// —— 两个单文件页面：内联 tokens、记号定义和运动函数 ——
const used = html => [...new Set([...html.matchAll(/#(g-[a-z-]+)/g)].map(m => m[1]))];
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function motionSection(M, m, no) {
  return `<section class="c" id="m-${m.id}" data-motion="${m.id}">
  <header><span class="no">${no}</span><h2>${m.zh}</h2><p>${m.means}</p></header>
  <div class="demo">
    <div class="synthetic">合成例子<span class="js-only"> · 可以播放，也可以拖到任意一刻定格</span><span class="no-js-only print-only"> · 五个时刻的定格</span></div>
    <div class="stage js-only" data-stage>${M.svg(m, 0)}</div>
    <div class="ctl">
      <button class="btn" type="button" data-play aria-pressed="false">播放</button>
      <label class="scrub"><span>t</span><input type="range" min="0" max="${m.span}" step="0.01" value="0" data-t aria-label="${m.zh}：时间 t，单位秒"></label>
      <output class="count" data-tv>0.00 秒</output>
    </div>
    <div class="strip no-js-only print-only">${M.strip(m.id)}</div>
  </div>
  <dl class="spec">
    <dt>可调的参数</dt><dd>${m.params}</dd>
    <dt>t 的函数</dt><dd><pre><code>${M.source(m.id)}</code></pre></dd>
    <dt>网页里的实现</dt><dd><pre><code>${esc(m.html)}</code></pre></dd>
    <dt>减弱动效时</dt><dd>${m.reduced}</dd>
    <dt>不该用的情形</dt><dd>${m.avoid}</dd>
  </dl>
</section>`;
}
async function page(name) {
  if (!existsSync(join(here, name + '.src.html'))) return;
  let html = read(name + '.src.html');
  if (html.includes('/*MOTION*/')) {
    const lib = read('motion-lib.mjs');
    const M = await import('./motion-lib.mjs');
    html = html.replace('<!--MOTIONS-->', () => M.MOTIONS.map((m, i) => motionSection(M, m, i + 1)).join('\n'));
    html = html.replace('<!--MOTION-TOC-->', () => M.MOTIONS.map((m, i) => `<a href="#m-${m.id}">${i + 1} ${m.zh}</a>`).join(''));
    html = html.replace('/*MOTION*/', () => lib.replace(/^export /gm, ''));
  }
  const ids = used(html);
  const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>\n${defs(ids)}\n</defs></svg>`;
  html = html.replace('/*TOKENS*/', () => tokens).replace('/*BASE*/', () => read('base.css')).replace('<!--GLYPHS-->', () => sprite);
  writeFileSync(join(root, name + '.html'), html);
}
await page('components');
await page('motion');
console.log(`glyphs ${GLYPHS.length} + ends ${ENDS.length}`);
