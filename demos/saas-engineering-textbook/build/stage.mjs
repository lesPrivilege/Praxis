// Turns a rendered Markdown page into the staged layout: a title card, one scene per H2,
// labelled blocks, display formulas, chains and route lists. Works on the HTML string; the words themselves are untouched.
import { esc } from './graph.mjs';

const STEP_LABEL = /^(.{2,6}?)[：:](.+)$/;
const plain = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

// "第一章：先看对象，再认题型" → kicker 第一章; "H01 · 报价…" → kicker H01
export function splitTitle(title) {
  let m = /^(第[一二三四五六七八九十]+章)[：:\s　]*(.+)$/.exec(title);
  if (m) return { kicker: m[1], title: m[2] };
  m = /^([HVX]\d\d)\s*·\s*(.+)$/.exec(title);
  if (m) return { kicker: m[1], title: m[2] };
  return { kicker: '', title };
}

function labelKind(label) {
  if (/反例/.test(label)) return 'counter';
  if (/简答|答/.test(label)) return 'answer';
  if (/题|练习/.test(label)) return 'exercise';
  if (/探索/.test(label)) return 'next';
  return 'step';
}

// <p><strong>误用反例。</strong>…</p> → labelled block, label hung in the margin
function labelled(html) {
  return html.replace(/<p><strong>([^<]{1,10}?)[。：:]<\/strong>\s*([\s\S]*?)<\/p>/g, (m, label, rest) =>
    `<div class="labelled" data-kind="${labelKind(label)}"><p class="blk-l">${label}</p><p>${rest}</p></div>`);
}

// "…是：A → B → C → D。…" in running text → the steps drawn as a chain.
function chains(html) {
  return html.replace(/<p(?: class="scene-lede")?>([\s\S]*?)<\/p>/g, (m, inner) => {
    const colon = inner.search(/[：:]/);
    if (colon < 0) return m;
    const after = inner.slice(colon + 1);
    const stop = after.indexOf('。');
    const seg = stop < 0 ? after : after.slice(0, stop);
    if (/<a /.test(seg) || /<code>[^<]*→/.test(seg)) return m;
    const steps = seg.split(/\s*→\s*/).map((x) => x.trim());
    if (steps.length < 4 || steps.some((x) => !x || x.length > 60)) return m;
    const lead = inner.slice(0, colon + 1);
    const tail = stop < 0 ? '' : after.slice(stop + 1).trim();
    const cls = m.startsWith('<p class') ? ' class="scene-lede"' : '';
    const per = steps.length <= 5 ? steps.length : Math.ceil(steps.length / 2);
    return `<p${cls}>${lead}</p><ol class="chain" style="--per:${per}">${steps.map((x, i) => `<li><span class="cn">${i + 1}</span><span class="ct">${x}</span></li>`).join('')}</ol>${tail ? `<p>${tail}</p>` : ''}`;
  });
}

// A paragraph that is only an equation in inline code → display formula.
function formulas(html) {
  return html.replace(/<p><code>([^<]*?[=∧][^<]*?)<\/code>[。．]?<\/p>/g, (m, code) => {
    const text = plain(code);
    const parts = text.split(/\s+([+−\-×=∧→])\s+/);
    const cells = parts.map((p, i) => {
      if (i % 2) return `<span class="op${p === '=' ? ' eq' : ''}">${esc(p)}</span>`;
      const t = /^(.*?[^\d\s,.])\s+([\d][\d,.]*)$/.exec(p);
      return t
        ? `<span class="term"><span class="tl">${esc(t[1])}</span><span class="tv">${esc(t[2])}</span></span>`
        : `<span class="term"><span class="tv${/^[\d,.\s]+$/.test(p) ? '' : ' word'}">${esc(p)}</span></span>`;
    });
    return `<div class="eqn"><code class="visually-hidden">${code}</code><div class="eqn-row" aria-hidden="true">${cells.join('')}</div></div>`;
  });
}

// A table whose first column counts 1, 2, 3… is a route: render it as one.
function routes(html) {
  return html.replace(/<div class="table-wrap"><table>([\s\S]*?)<\/table><\/div>/g, (m, inner) => {
    const head = /<thead>([\s\S]*?)<\/thead>/.exec(inner);
    const rows = [...inner.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].slice(head ? 1 : 0).map((r) => [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) => c[1]));
    const cols = head ? [...head[1].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((c) => c[1]) : [];
    const sequential = rows.length >= 3 && rows.every((r, i) => plain(r[0]).trim() === String(i + 1)) && cols.length === 3 && /顺序|步/.test(plain(cols[0]));
    if (!sequential) {
      return cols.length >= 4 ? m.replace('<div class="table-wrap">', '<div class="table-wrap wide">') : m;
    }
    const items = rows.map((r) => `<li><span class="rn" aria-hidden="true">${String(plain(r[0])).padStart(2, '0')}</span><p class="rh">${r[1]}</p><p class="rs">${r[2]}</p></li>`);
    return `<ol class="route" style="--rows:${Math.ceil(items.length / 2)}" aria-label="${esc(plain(cols[1]))}">${items.join('')}</ol>`;
  });
}

export function stage(html, { section, sectionHref, title, cast = '' }) {
  const h1 = /<h1 id="[^"]*">([\s\S]*?)<\/h1>\n?/.exec(html);
  let rest = h1 ? html.slice(0, h1.index) + html.slice(h1.index + h1[0].length) : html;
  const t = splitTitle(title);

  const chunks = rest.split(/(?=<h2 id=)/);
  let intro = chunks[0].startsWith('<h2 ') ? '' : chunks.shift();
  let lede = '';
  intro = intro.replace(/^\s*<p>([\s\S]*?)<\/p>\n?/, (m, p) => { lede = p; return ''; });

  const scenes = chunks.map((c, i) => {
    const h = /^<h2 id="([^"]*)">([\s\S]*?)<\/h2>\n?/.exec(c);
    const id = h[1];
    const text = plain(h[2]);
    const m = STEP_LABEL.exec(text);
    const step = m ? m[1] : '';
    const head = m ? m[2].trim() : text;
    const no = String(i + 1).padStart(2, '0');
    let body = c.slice(h[0].length).replace(/^\s*<p>/, '<p class="scene-lede">');
    const h2 = step
      ? `<h2 id="${id}"><span class="scene-no" aria-hidden="true">${no}</span><span class="visually-hidden">${esc(step)}：</span><span class="head">${esc(head)}</span></h2>`
      : `<h2 id="${id}"><span class="scene-no" aria-hidden="true">${no}</span><span class="head">${h[2]}</span></h2>`;
    return {
      id, step, head, no, isStructure: id === 'case-structure',
      html: `<section class="scene${id === 'case-structure' ? ' scene-structure' : ''}" aria-labelledby="${id}"><header class="scene-head">${h2}</header>${body}</section>`,
    };
  });

  const hero = `<header class="hero">
<p class="kicker">${section ? `<a href="${esc(sectionHref)}">${esc(section)}</a>` : ''}${section && t.kicker ? '<span class="dot">·</span>' : ''}${esc(t.kicker)}</p>
<h1>${esc(t.title)}</h1>
${lede ? `<p class="lede">${lede}</p>` : ''}
${cast}
</header>`;

  const body = routes(chains(formulas(labelled(intro + scenes.map((s) => s.html).join('\n')))));
  return { html: hero + body, scenes };
}
