// Builds the offline multi-page textbook from books/saas-engineering (prose)
// and vault/distilled/saas-engineering-atlas (structure). Run: node build/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from '../vendor/marked.esm.js';
import { parseFlowchart, renderGraph, edgeList, esc } from './graph.mjs';
import { casePanel } from './case.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(HERE, '..');
const REPO = path.resolve(PROJECT, '../..');
const BOOK = path.join(REPO, 'books/saas-engineering');
const ATLAS = path.join(REPO, 'vault/distilled/saas-engineering-atlas');
const OUT = path.join(PROJECT, 'site');
const SRC = path.join(PROJECT, 'src');

const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

// ---------- reading order ----------
const manifest = readJSON(path.join(ATLAS, 'packages/manifest.json'));
const caseIndex = readJSON(path.join(ATLAS, 'case-index.json'));
const caseById = Object.fromEntries(caseIndex.cases.map((c) => [c.case_id, c]));

const SECTIONS = [
  { title: '开篇', files: ['README.md', 'learning-path.md', 'architecture.md'] },
  {
    title: '企业软件的工作机制',
    files: [
      'enterprise-mechanisms/README.md',
      'enterprise-mechanisms/01-organization-to-system.md',
      'enterprise-mechanisms/02-enterprise-frontend.md',
      'enterprise-mechanisms/03-schema-tools-completion.md',
      'enterprise-mechanisms/04-implementation-reality.md',
      'enterprise-mechanisms/lab-guide.md',
      'enterprise-mechanisms/case-connections.md',
      'enterprise-mechanisms/terms.md',
    ],
  },
  {
    title: '计算与系统方法',
    files: [
      'foundations/README.md',
      ...fs.readdirSync(path.join(BOOK, 'foundations')).filter((f) => /^\d\d-.*\.md$/.test(f)).sort().map((f) => `foundations/${f}`),
      'foundations/terms.md',
    ],
  },
  ...manifest.packages.map((p) => ({
    title: p.title,
    group: p.slug,
    files: [
      `packages/${p.slug}/README.md`,
      ...p.case_ids.slice().sort(caseOrder).map((id) => `packages/${p.slug}/${id}.md`),
    ],
  })),
  {
    title: '索引与查证',
    files: ['packages/README.md', 'case-catalog.md', 'problem-index.md', 'transfer-map.md', 'semantics.md', 'terminology.md'],
  },
];

function caseOrder(a, b) {
  const rank = (id) => ({ H: 0, V: 1, X: 2 })[id[0]] * 100 + Number(id.slice(1));
  return rank(a) - rank(b);
}

const order = SECTIONS.flatMap((s) => s.files);
const inBook = new Set(order);

// One flat output directory: the repository asks every directory for a README.
function outPathFor(rel) {
  const parts = rel.replace(/\.md$/, '').split('/');
  const name = parts.pop();
  const prefix = { 'enterprise-mechanisms': 'em', foundations: 'fdn', packages: 'packages' }[parts[0]];
  if (!parts.length) return name === 'README' ? 'index.html' : `${name}.html`;
  if (parts[0] === 'packages' && parts.length === 2) return name === 'README' ? `group-${parts[1]}.html` : `${name}.html`;
  return name === 'README' ? `${prefix}.html` : `${prefix}-${name}.html`;
}

// ---------- glossary ----------
const terminology = readJSON(path.join(ATLAS, 'terminology.json'));
const ABBR = terminology.terms
  .filter((t) => /^[A-Z][A-Za-z0-9]{1,7}$/.test(t.source_term) && t.english_expansion)
  .map((t) => ({ term: t.source_term, title: `${t.english_expansion}：${t.chinese || t.meaning_zh}` }));

function wrapAbbr(html) {
  const seen = new Set();
  const skip = /^<(code|pre|a|h[1-6]|svg|abbr|script|style|summary)\b/i;
  let depth = 0;
  const stack = [];
  return html.replace(/(<[^>]+>)|([^<]+)/g, (m, tag, text) => {
    if (tag) {
      const open = /^<([a-z0-9]+)/i.exec(tag);
      const close = /^<\/([a-z0-9]+)/i.exec(tag);
      if (open && skip.test(tag) && !tag.endsWith('/>')) { stack.push(open[1].toLowerCase()); depth++; }
      else if (close && stack.length && stack[stack.length - 1] === close[1].toLowerCase()) { stack.pop(); depth--; }
      return tag;
    }
    if (depth > 0) return text;
    let t = text;
    for (const a of ABBR) {
      if (seen.has(a.term)) continue;
      const re = new RegExp(`(?<![A-Za-z0-9_\\-])${a.term}(?![A-Za-z0-9_\\-])`);
      if (re.test(t)) {
        t = t.replace(re, `<abbr title="${esc(a.title)}">${a.term}</abbr>`);
        seen.add(a.term);
      }
    }
    return t;
  });
}

// ---------- markdown ----------
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
    .replace(/ /g, '-');
}
const stripTags = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

function makeRenderer(rel, ctx) {
  const srcDir = path.dirname(path.join(BOOK, rel));
  const outDir = path.dirname(path.join(OUT, outPathFor(rel)));
  return {
    heading({ tokens, depth }) {
      const inner = this.parser.parseInline(tokens);
      const plain = stripTags(inner);
      let id = slugify(plain);
      const n = ctx.slugs.get(id) || 0;
      ctx.slugs.set(id, n + 1);
      if (n) id = `${id}-${n}`;
      if (depth === 1) ctx.title = plain;
      if (depth === 2) ctx.toc.push({ id, text: plain });
      return `<h${depth} id="${esc(id)}">${inner}</h${depth}>\n`;
    },
    link({ href, title, tokens }) {
      const inner = this.parser.parseInline(tokens);
      const target = resolveHref(href, srcDir, outDir);
      const ext = /^https?:/.test(target) ? ' class="ext" rel="noopener"' : '';
      return `<a href="${esc(target)}"${title ? ` title="${esc(title)}"` : ''}${ext}>${inner}</a>`;
    },
    code({ text, lang }) {
      if (lang === 'mermaid') {
        const g = parseFlowchart(text);
        ctx.graphs++;
        return `<figure class="graph-fig"><div class="graph-wrap">${renderGraph(g, { id: `g${ctx.graphs}`, title: ctx.title })}</div>${edgeList(g)}</figure>`;
      }
      return `<pre><code${lang ? ` class="lang-${esc(lang)}"` : ''}>${esc(text)}</code></pre>`;
    },
  };
}

function resolveHref(href, srcDir, outDir) {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const [p, hash] = href.split('#');
  const abs = path.resolve(srcDir, decodeURI(p));
  const relToBook = path.relative(BOOK, abs);
  if (!relToBook.startsWith('..') && inBook.has(relToBook)) {
    const t = path.relative(outDir, path.join(OUT, outPathFor(relToBook))) || path.basename(outPathFor(relToBook));
    return t + (hash ? `#${hash}` : '');
  }
  if (!fs.existsSync(abs)) throw new Error(`Broken link ${href} from ${srcDir}`);
  return path.relative(outDir, abs) + (hash ? `#${hash}` : '');
}


// Figure directives:  <!-- figure: id --> fallback markdown <!-- /figure -->
const FIG_RE = /<!--\s*figure:\s*([\w-]+)\s*-->\n([\s\S]*?)<!--\s*\/figure\s*-->/g;

function renderMarkdown(md, rel, ctx) {
  const marked = new Marked({ gfm: true });
  marked.use({ renderer: makeRenderer(rel, ctx) });
  const parts = [];
  let last = 0;
  for (const m of md.matchAll(FIG_RE)) {
    parts.push({ md: md.slice(last, m.index) });
    parts.push({ fig: m[1], md: m[2] });
    last = m.index + m[0].length;
  }
  parts.push({ md: md.slice(last) });
  // Render as one document so heading slugs and link references stay consistent.
  const html = [];
  for (const part of parts) {
    if (!part.fig) { html.push(marked.parse(part.md)); continue; }
    const figHtmlPath = path.join(SRC, 'figures', `${part.fig}.html`);
    if (!fs.existsSync(figHtmlPath)) throw new Error(`Missing figure ${part.fig}`);
    ctx.figures.push(part.fig);
    const fallback = marked.parse(part.md);
    html.push(`<div class="fig" data-fig="${part.fig}">${fs.readFileSync(figHtmlPath, 'utf8')}<div class="fig-fallback">${fallback}</div></div>`);
  }
  return html.join('\n').replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>');
}

// ---------- page shell ----------
function navHtml(currentRel, prefix) {
  const out = ['<nav class="book-nav" aria-label="全书目录">'];
  for (const s of SECTIONS) {
    const open = s.files.includes(currentRel);
    out.push(`<details class="nav-sec"${open ? ' open' : ''}><summary>${esc(s.title)}</summary><ol>`);
    for (const f of s.files) {
      const t = pages.get(f).navTitle;
      const href = prefix + outPathFor(f);
      out.push(`<li${f === currentRel ? ' aria-current="page"' : ''}><a href="${href}">${esc(t)}</a></li>`);
    }
    out.push('</ol></details>');
  }
  out.push('</nav>');
  return out.join('');
}

function navTitleFor(rel, title) {
  const m = /^([HVX]\d\d)\s*·\s*(.*)$/.exec(title);
  if (m) return `${m[1]} ${m[2]}`;
  return title.replace(/^第[一二三四五六七八九十]+章[：:\s　]*/, (x) => x.replace(/[：:\s　]+$/, '') + ' ');
}

function shell({ rel, ctx, body }) {
  const outRel = outPathFor(rel);
  const depth = outRel.split('/').length - 1;
  const prefix = '../'.repeat(depth);
  const i = order.indexOf(rel);
  const prev = i > 0 ? order[i - 1] : null;
  const next = i < order.length - 1 ? order[i + 1] : null;
  const pn = (f, cls, label) =>
    f ? `<a class="${cls}" href="${prefix + outPathFor(f)}"><span>${label}</span>${esc(pages.get(f).navTitle)}</a>` : '<span></span>';
  const toc = ctx.toc.length > 1
    ? `<aside class="page-toc" aria-label="本页目录"><p>本页</p><ol>${ctx.toc.map((h) => `<li><a href="#${esc(h.id)}">${esc(h.text)}</a></li>`).join('')}</ol></aside>`
    : '<aside class="page-toc"></aside>';
  const figScripts = [...new Set(ctx.figures)]
    .filter((f) => fs.existsSync(path.join(SRC, 'figures', `${f}.js`)))
    .map((f) => `<script src="${prefix}fig-${f}.js"></script>`)
    .join('');
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(ctx.title)} · SaaS 工程全景</title>
<link rel="stylesheet" href="${prefix}book.css">
</head>
<body>
<a class="skip" href="#main">跳到正文</a>
<header class="topbar">
  <button class="nav-toggle" type="button" aria-controls="sidebar" aria-expanded="false">目录</button>
  <a class="book-title" href="${prefix}index.html">SaaS 工程全景</a>
  <label class="search"><span class="visually-hidden">搜索章节与案例</span><input type="search" placeholder="章节、案例或小节标题" autocomplete="off"></label>
</header>
<div class="layout">
  <div class="sidebar" id="sidebar">${navHtml(rel, prefix)}</div>
  <main id="main" class="page${ctx.isCase ? ' case-page' : ''}">
${body}
    <nav class="pager" aria-label="前后章节">${pn(prev, 'prev', '上一篇')}${pn(next, 'next', '下一篇')}</nav>
    <footer class="page-foot">正文 <a href="${path.relative(path.dirname(path.join(OUT, outRel)), path.join(BOOK, rel))}">books/saas-engineering/${esc(rel)}</a> · <a href="${path.relative(path.dirname(path.join(OUT, outRel)), path.join(ATLAS, 'README.md'))}">结构、来源与验证</a></footer>
  </main>
  ${toc}
</div>
<script src="${prefix}search-index.js"></script>
<script src="${prefix}book.js"></script>
${figScripts}
</body>
</html>
`;
}

// ---------- build ----------
const pages = new Map();
for (const rel of order) {
  const md = fs.readFileSync(path.join(BOOK, rel), 'utf8');
  const title = (/^#\s+(.+)$/m.exec(md) || [, rel])[1].trim();
  pages.set(rel, { md, title, navTitle: navTitleFor(rel, title) });
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const search = [];
const stats = { pages: 0, graphs: 0, figures: 0, cases: 0 };
for (const rel of order) {
  const page = pages.get(rel);
  const ctx = { slugs: new Map(), toc: [], title: page.title, graphs: 0, figures: [], isCase: false };
  let body = renderMarkdown(page.md, rel, ctx);
  const caseId = /\/([HVX]\d\d)\.md$/.exec(rel)?.[1];
  if (caseId) {
    ctx.isCase = true;
    const panel = casePanel(caseById[caseId], { ATLAS, readJSON, outDir: path.dirname(path.join(OUT, outPathFor(rel))), OUT, outPathFor, pages });
    ctx.toc.push({ id: 'case-structure', text: '结构、生命周期与迁移' });
    body += panel;
    stats.cases++;
  }
  body = wrapAbbr(body);
  const html = shell({ rel, ctx, body });
  const outFile = path.join(OUT, outPathFor(rel));
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  search.push({ u: outPathFor(rel), t: page.navTitle, h: ctx.toc.map((h) => [h.id, h.text]) });
  stats.pages++;
  stats.graphs += ctx.graphs;
  stats.figures += ctx.figures.length;
}

// assets
fs.copyFileSync(path.join(SRC, 'book.css'), path.join(OUT, 'book.css'));
fs.copyFileSync(path.join(SRC, 'book.js'), path.join(OUT, 'book.js'));
fs.copyFileSync(path.join(SRC, 'site-README.md'), path.join(OUT, 'README.md'));
for (const f of fs.readdirSync(path.join(SRC, 'figures'))) {
  if (f.endsWith('.js')) fs.copyFileSync(path.join(SRC, 'figures', f), path.join(OUT, `fig-${f}`));
}
fs.writeFileSync(path.join(OUT, 'search-index.js'), `window.BOOK_INDEX=${JSON.stringify(search)};\n`);

console.log(JSON.stringify(stats));
