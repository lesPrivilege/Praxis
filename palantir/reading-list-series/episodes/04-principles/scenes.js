/* 04 把错误摆上桌面 — Ray Dalio's Principles, the © 2011 PDF.
   Solid: stated by a source. Dashed: only this series' reading, labelled 本系列的读法.
   Grey solid hairline: what is unknown or was not found. Blue marks the point of the moment;
   red only a break. English wording on screen always comes from the claim ledger, never from this file. */
Series.unit('pr', ({ T, tl, has, u, chrome }) => {
  const INK = '#0d1826', INK2 = '#3a4658', BLUE = '#1f4fe0';
  // The work, and the copy whose page and principle numbers this episode cites (the 106-page re-layout).
  const PDF0 = 'Ray Dalio, Principles, PDF © 2011';
  const PDF = PDF0 + '（2016 重排版）';
  const IA = 'Internet Archive · bwater.com 存档记录';
  const NQ = 'Nabeel Qureshi, Reflections on Palantir, 2024';
  const BW = 'Dalio 笔下的 Bridgewater';

  /* One scene on paper with the chapter tag; it fades in over the scene before it. */
  function page(id, from, to, chapter, build) {
    Film.scene(id, from, to, ({ root }) => {
      root.classList.add('paper');
      K.el(root, 'grain');
      if (chapter) chrome(root, chapter);
      gsap.set(root, { opacity: 0 });
      tl.to(root, { opacity: 1, duration: 0.4, ease: 'power2.out' }, from);
      build(root, from, to);
    });
  }

  /* K.quote, with named phrases wrapped for highlighting.
     o.hl / o.hlz: phrases of the English / Chinese text as shown; each must occur in it. */
  function quote(parent, id, x, y, w, o) {
    o = o || {};
    const q = K.quote(parent, id, x, y, w, o);
    // keep the copyright year with its sign when a narrow locator wraps
    if (q.loc) q.loc.textContent = q.loc.textContent.replace('© ', '©\u00a0');
    q.hl = mark(q.en, o.hl, id);
    q.hlz = q.zh ? mark(q.zh, o.hlz, id) : [];
    return q;
  }
  function mark(e, parts, id) {
    if (!parts) return [];
    let html = e.innerHTML;
    parts.forEach((p, i) => {
      if (!html.includes(p)) throw new Error(`"${p}" is not in ${id}`);
      html = html.replace(p, `<span class="pr-hl" data-i="${i}">${p}</span>`);
    });
    e.innerHTML = html;
    return parts.map((_, i) => e.querySelector(`.pr-hl[data-i="${i}"]`));
  }
  /* Words the source itself uses, read from the claim's statement so they cannot drift from the ledger. */
  function said(id, re) {
    const m = Film.claim(id).statement_zh.match(re);
    if (!m) throw new Error('pattern not in ' + id);
    return m.slice(1);
  }
  /* A phrase in a quote or a formula: blue, with a thin rule drawn under it (K.lit). unlit() takes the colour back;
     the rule stays, in ink, so a phrase once pointed at keeps its mark. tint() is the bare colour change for boxes. */
  const lit = (e, at, color) => K.lit(e, at, { color: color || BLUE });
  const unlit = (e, at, color) => tl.to(e, { color: color || INK, duration: 0.5, ease: 'power2.out' }, at);
  const tint = (e, at, color) => tl.to(e, { color: color || BLUE, duration: 0.35, ease: 'power2.out' }, at);
  /* Recede or come back. Written start values, so the boot pass (end first, then rewind) cannot record a hidden start. */
  const dim = (e, at, to, from) => tl.fromTo(e, { opacity: from === undefined ? 1 : from },
    { opacity: to, duration: 0.5, ease: 'power2.out', immediateRender: false }, at);
  /* The camera's set-up for a beat: an invisible box marked data-cam="frame", which the camera frames while it is on,
     so it settles on the beat's whole composition from the first moment instead of hunting while items arrive
     one by one. On from a to b (b left out: to the end of the scene). */
  function shot(root, x0, y0, x1, y1, a, b) {
    const s = K.box(root, 'pr-shot', x0, y0, x1 - x0, y1 - y0);
    s.dataset.cam = 'frame';
    gsap.set(s, { visibility: 'hidden' });
    tl.to(s, { visibility: 'visible', duration: 0.001, ease: 'none' }, a);
    if (b !== undefined) tl.to(s, { visibility: 'hidden', duration: 0.001, ease: 'none' }, b);
    return s;
  }
  /* A line drawn through a short inline phrase. */
  function strike(e, at, color) {
    e.classList.add('pr-struck');
    const ln = K.el(e, 'pr-strike');
    if (color) ln.style.background = color;
    gsap.set(ln, { scaleX: 0 });
    tl.to(ln, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, at);
    return ln;
  }
  const deg = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  /* A stroked arrow: path d ending at tip, head pointing at angle (degrees). */
  function arrow(sv, d, tip, ang, cls) {
    const line = K.path(sv, d, cls || 'ln');
    const head = K.path(sv, 'M-15,-10 L0,0 L-15,10', cls || 'ln', { transform: `translate(${tip[0]},${tip[1]}) rotate(${ang})` });
    return {
      line, head,
      draw(at, dur) { dur = dur || 0.6; K.draw(line, at, { duration: dur }); K.draw(head, at + dur - 0.1, { duration: 0.2 }); },
    };
  }
  /* A page of the PDF: folded corner, a title, grey bars for text. */
  function sheet(parent, x, y, w, h, title, cls) {
    const s = K.box(parent, 'pr-sheet ' + (cls || ''), x, y, w, h);
    K.el(s, 'pr-sheet-fold');
    if (title) K.box(s, 'pr-sheet-title', 30, 26, w - 100, null, title);
    return s;
  }
  function bars(s, n, top, step, w, seed) {
    const r = K.rng(seed);
    return Array.from({ length: n }, (_, i) => K.box(s, 'pr-sheet-ln', 30, top + i * step, Math.round((w - 60) * (i % 5 === 4 ? 0.45 : 0.7 + 0.28 * r())), 10));
  }
  const label = (root, html, y) => K.box(root, 'pr-label', 200, y || 172, 1520, null, html);
  /* A short statement, large while it is the subject, then replaced by the same words as the scene's top label. */
  function statement(root, html, at, until, close) {
    // as wide as its words and centred on the stage; unless close === false the camera holds it whole as a close title,
    // even while part of it is still to come, and pulls straight back from it when the label takes over
    const big = K.box(root, 'pr-statement', 0, 420, null, null, html);
    const x = Math.round(Film.W / 2 - big.offsetWidth / 2);
    big.style.left = x + 'px';
    const small = label(root, big.textContent);
    if (close !== false) shot(root, x, 420, x + big.offsetWidth, 420 + big.offsetHeight, at - 0.6, until + 0.2);
    K.show(big, at, { y: 16 });
    tl.to(big, { autoAlpha: 0, y: '-=30', duration: 0.45, ease: 'power2.in' }, until);
    K.show(small, until + 0.2, { y: 8, duration: 0.5 });
    return big;
  }

  // ================================================================ 那份 PDF
  // Qureshi's sentence: the four books, then the PDF that set the tone.
  page('pr-tone', u.bodyStart - 0.2, T('pr.b2') + 0.2, '早期 PDF', root => {
    // the name alone first, held close through the line about his recollection; the camera pulls back to the whole
    // table as the books arrive
    const who = K.box(root, 'pr-who', 200, 160, null, null, '<b>Nabeel Qureshi</b><span>Reflections on Palantir · 2024</span>');
    K.show(who, T('pr.b1') + 0.05, { y: 16 });
    K.focus(who, T('pr.b1') - 0.2, T('pr.b1', '入职') - 0.2, { zoom: 1.3 });
    shot(root, 200, 160, 1720, 930, T('pr.b1', '几本书') - 0.3);
    const BOOKS = ['Impro', 'The Looming Tower', 'Interviewing Users', 'Getting Things Done'];
    const spines = BOOKS.map((b, i) => K.box(root, 'pr-spine', 200 + i * 86, 330, 72, 440, `<span>${b}</span>`));
    K.show(spines, T('pr.b1', '几本书') - 0.3, { y: 20, stagger: 0.07 });
    const pdf = sheet(root, 560, 330, 330, 440, 'Principles', 'blue');
    K.box(pdf, 'pr-sheet-sub', 30, 360, 270, null, '早期 PDF');
    bars(pdf, 7, 110, 30, 330, 3);
    K.show(pdf, T('pr.b1', '一份') - 0.15, { y: 24 });
    const q = quote(root, 'ov.list_qureshi_principles_pdf', 970, 330, 750, { size: 46, hl: ['This set the tone.'], hlz: ['这定下了调子。'] });
    K.show(q.root, T('pr.b1', '是后来') - 0.2, { y: 18 });
    // the line that set the tone: the camera goes in on the quote while the rest of the table clears away,
    // and comes back out to the whole table for the count
    // (the camera eases in about a second before the span starts, so the table clears first and returns after)
    const tone = T('pr.b1', '紧接着') + 0.4, back = T('pr.b1', '整篇') - 0.3;
    K.focus(q.root, tone, back, { zoom: 1.45, pad: 50 });
    dim([who, ...spines, pdf], tone - 1.0, 0);
    dim([who, ...spines, pdf], back + 0.45, 1, 0);
    lit([q.hl[0], q.hlz[0]], T('pr.b1', '定下') - 0.35);
    unlit(q.hl[0], T('pr.b1', '整篇') - 0.1);
    unlit(q.hlz[0], T('pr.b1', '整篇') - 0.1, INK2);
    const once = K.box(root, 'pr-count', 200, 846, 1520, null, '<span>回顾全文提到这份 PDF</span><b class="t-num">1</b><span>处</span>');
    K.show(once, T('pr.b1', '整篇') + 0.3, { y: 14 });
    K.source(root, NQ, T('pr.b1') + 0.6, T('pr.b1', 'end') + 0.4, ['ov.list_qureshi_principles_pdf', 'pr.qureshi-early-pdf', 'pr.qureshi-silent']);
  });

  // Who wrote it, and where it was public.
  page('pr-dalio', T('pr.b2') - 0.3, T('pr.b2', '夏天') - 0.05, '早期 PDF', root => {
    // the head from the 1280×720 video still, cut above the moving hand and the microphones just under the chin;
    // the credit sits under the frame so it does not cover the chin
    const CROP = { x: 505, y: 8, w: 290, h: 240 }, FW = 580, s = FW / CROP.w, FH = CROP.h * s;
    const fig = K.figure(root, 'pr.dalio-grameen-2017', 200, 230, FW, FH);
    Object.assign(fig.querySelector('img').style, { width: 1280 * s + 'px', height: 720 * s + 'px', transform: `translate(${-CROP.x * s}px, ${-CROP.y * s}px)` });
    const credit = fig.querySelector('.kfig-credit');
    credit.classList.add('pr-credit');
    Object.assign(credit.style, { left: '200px', top: 230 + FH + 10 + 'px' });
    root.appendChild(credit);
    K.show(fig, T('pr.b2') - 0.1, { y: 0, scale: 1.02, duration: 0.9 });
    K.show(credit, T('pr.b2') + 0.3, { y: 0, duration: 0.5 });
    const name = K.box(root, 'pr-name', 900, 230, 820, null, 'Ray Dalio');
    K.show(name, T('pr.b2') + 0.15, { y: 16 });
    const role = K.box(root, 'pr-role', 900, 348, 820, null, 'Bridgewater 创始人 · 1975');
    K.show(role, T('pr.b2', '创始人') - 0.2, { y: 10 });
    const work = K.box(root, 'pr-work', 900, 420, 820, null, 'Principles');
    K.show(work, T('pr.b2', '这些原则') - 0.2, { y: 14 });
    const site = K.box(root, 'pr-site', 900, 560, 820, null, '<b>bwater.com</b><span>Bridgewater 网站 · 公开</span>');
    K.show(site, T('pr.b2', '挂在') - 0.2, { y: 14 });
    K.source(root, PDF0 + ' · ' + IA, T('pr.b2') + 0.3, T('pr.b2', '夏天') - 0.5, ['pr.dalio-founded-1975', 'pr.version-2015-match', 'pr.ver-2015-public']);
  });

  // The public file on a calendar: served 2012-01 to 2016-03, the summer Qureshi joined inside it.
  page('pr-strip', T('pr.b2', '夏天') - 0.5, T('pr.b3') + 0.2, '早期 PDF', (root, from) => {
    const X = yr => 200 + (yr - 2011) * 1520 / 6;
    const sv = K.svg(root);
    const axis = K.path(sv, 'M200,760 L1720,760', 'ln');
    const ticks = [], years = [];
    for (let yr = 2011; yr <= 2017; yr++) {
      ticks.push(K.path(sv, `M${X(yr)},760 L${X(yr)},778`, 'ln'));
      years.push(K.box(root, 'pr-year t-num', X(yr) - 60, 792, 120, null, String(yr)));
    }
    K.draw(axis, from + 0.1, { duration: 0.8 });
    K.draw(ticks, from + 0.3, { duration: 0.2, stagger: 0.05 });
    K.show(years, from + 0.3, { y: 8, duration: 0.4, stagger: 0.05 });
    // the bar for the period bwater.com served this file
    const x0 = X(2012 + 9 / 365), x1 = X(2016 + 63 / 365);
    const bar = K.box(root, 'pr-bar', x0, 600, x1 - x0, 100);
    gsap.set(bar, { scaleX: 0, transformOrigin: '0 50%' });
    const at = T('pr.b2', '网站上', 1) - 0.3;
    tl.to(bar, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, at);
    const barLab = K.box(root, 'pr-bar-lab', x0 + 36, 600, x1 - x0 - 72, 100, '<span>bwater.com 公开版</span><b>· 123 页</b>');
    K.show(barLab.firstChild, at + 0.6, { y: 0, duration: 0.4 });
    K.show(barLab.lastChild, T('pr.b2', '页') - 0.2, { y: 0, duration: 0.4 });
    const ends = K.box(root, 'pr-date', x0, 712, x1 - x0, null, '存档所见 <span class="t-num">2012 年 1 月–2016 年 3 月</span>');
    K.show(ends, at + 0.7, { y: 0, duration: 0.4 });
    // 2015 summer, on top of the bar
    const top = K.svg(root);
    const xq = X(2015.5);
    const summer = K.path(top, `M${xq},420 L${xq},760`, 'ln blue');
    K.draw(summer, T('pr.b2', '夏天') - 0.35, { duration: 0.6 });
    const qlab = K.box(root, 'pr-mark-lab', xq - 260, 352, 520, null, '2015 夏 · Qureshi 入职');
    K.show(qlab, T('pr.b2', '夏天') - 0.2, { y: 10 });
    // the copyright line on its footer, at 2011
    const stem = K.path(sv, 'M200,532 L200,760', 'ln soft');
    const copy = K.box(root, 'pr-tag', 200, 470, 300, 60, '页脚 · © 2011');
    K.draw(stem, T('pr.b2', '页脚') - 0.1, { duration: 0.5 });
    K.show(copy, T('pr.b2', '页脚') - 0.15, { y: 10 });
    K.source(root, PDF0 + ' · ' + IA + ' · ' + NQ, from + 0.5, T('pr.b2', 'end') + 0.4, ['pr.ver-2015-public', 'pr.version-2015-match', 'pr.qureshi-joined-2015']);
  });

  // The 2015 public copy against the 2016 re-layout, word by word.
  page('pr-compare', T('pr.b3') - 0.3, T('pr.b4') + 0.2, '早期 PDF', (root, from) => {
    const A = { x: 200, y: 350, w: 400, h: 510 }, B = { x: 1000, y: 350, w: 400, h: 510 };
    // close on the two files while they are compared, with room for the second before it arrives;
    // back out when the question turns to Qureshi's copy and the book
    shot(root, 200, 350, 1400, 925, from - 0.05, T('pr.b3', '拿到') - 0.9);
    shot(root, 200, 168, 1720, 925, T('pr.b3', '拿到') - 0.9);
    const sv = K.svg(root);
    const sa = sheet(root, A.x, A.y, A.w, A.h, 'Principles');
    const sb = sheet(root, B.x, B.y, B.w, B.h, 'Principles');
    const la = bars(sa, 12, 100, 28, A.w, 5), lb = bars(sb, 14, 100, 24, B.w, 5);
    const stamp = K.box(sa, 'pr-stamp', 30, A.h - 84, A.w - 60, 56, '网络存档 · 2015-08');
    const labA = K.box(root, 'pr-sheet-lab', A.x - 40, A.y + A.h + 22, A.w + 80, null, '2015 公开版 · 123 页');
    const labB = K.box(root, 'pr-sheet-lab', B.x - 40, B.y + B.h + 22, B.w + 80, null, '2016 重排版 · 106 页');
    K.show([sa, labA], T('pr.b3') + 0.05, { y: 20, stagger: 0.1 });
    K.show(stamp, T('pr.b3', '找出') - 0.15, { y: 0, scale: 1.08, duration: 0.5 });
    K.show([sb, labB], T('pr.b3', '换过') - 0.6, { y: 20, stagger: 0.1 });
    tl.to(stamp, { color: INK, borderColor: INK, duration: 0.4 }, T('pr.b3', '换过') - 0.2);
    // word by word: each line of the first file finds its place in the second
    const ya = i => A.y + 100 + i * 28 + 5, yb = i => B.y + 100 + i * 24 + 5;
    const HL = 9;
    const links = la.map((_, i) => K.path(sv, `M${A.x + A.w + 6},${ya(i)} L${B.x - 6},${yb(i)}`, 'ln soft pr-link'));
    K.draw(links, T('pr.b3', '逐词') - 0.15, { duration: 0.5, stagger: 0.06 });
    // the measure
    const badge = K.box(root, 'pr-badge', A.x + A.w + 30, 430, B.x - A.x - A.w - 60, 220, '<b class="t-num">0.000</b><span>按词比对<br>序列相似度</span>');
    K.show(badge, T('pr.b3', '两份') - 0.1, { y: 12, duration: 0.5 });
    const score = badge.querySelector('b');
    K.count(score, 0, 0.936, T('pr.b3', '两份'), 1.1, v => v.toFixed(3));
    tl.to(links, { autoAlpha: 0.35, duration: 0.5 }, T('pr.b3', '两份') - 0.1);
    // every line this episode quotes is in both
    const hot = K.path(sv, `M${A.x + A.w + 6},${ya(HL)} L${B.x - 6},${yb(HL)}`, 'ln blue');
    const tagA = K.box(sa, 'pr-ln-tag t-num', A.w - 120, ya(HL) - A.y - 21, 90, null, '#195b');
    const tagB = K.box(sb, 'pr-ln-tag t-num', B.w - 120, yb(HL) - B.y - 21, 90, null, '#195b');
    gsap.set([la[HL], lb[HL]], { width: 220 });
    const both = K.box(root, 'pr-both', A.x + A.w + 10, 790, B.x - A.x - A.w - 20, null, '本集所引 Dalio 原文<br>两份都有');
    const at = T('pr.b3', '每一句') - 0.25;
    unlit(score, at);
    tl.to([la[HL], lb[HL]], { backgroundColor: BLUE, duration: 0.3 }, at);
    K.show([tagA, tagB], at, { y: 0, duration: 0.3 });
    K.draw(hot, at + 0.1, { duration: 0.5 });
    K.show(both, T('pr.b3', '都有') - 0.3, { y: 10 });
    // the point moves to Qureshi's copy: the matched line keeps its mark, without the blue
    const off = T('pr.b3', '拿到') - 0.3;
    tl.to([la[HL], lb[HL]], { backgroundColor: INK2, duration: 0.5 }, off);
    tl.to(hot, { stroke: INK, duration: 0.5 }, off);
    unlit([tagA, tagB, both], off, INK2);
    // whether this is the copy Qureshi got: not known, so grey and solid
    const nq = K.box(root, 'pr-open', A.x, 168, 560, 84, 'Qureshi 拿到的早期 PDF');
    const link = K.path(sv, `M${A.x + 120},252 L${A.x + 120},${A.y - 6}`, 'ln pr-hair');
    const open = K.box(root, 'pr-open-lab', A.x + 150, 276, 600, null, '是否同一份 · 无法确定');
    K.show(nq, off, { y: 10 });
    K.draw(link, T('pr.b3', '拿到') + 0.1, { duration: 0.6 });
    K.show(open, T('pr.b3', '没法') - 0.15, { y: 8 });
    // the book of 2017 is not read here: focus goes back to the two files
    tl.to([nq, link, open], { opacity: 0.45, duration: 0.5 }, T('pr.b3', '正式出版') - 0.3);
    tl.to([labA, labB], { color: BLUE, duration: 0.4 }, T('pr.b3', '不用') - 0.3);
    const bk = K.box(root, 'pr-book', 1480, 430, 240, 340, '<b>成书</b><i class="t-num">2017</i><span>本集不用</span>');
    K.show(bk, T('pr.b3', '正式出版') - 0.2, { y: 16 });
    K.show(bk.querySelector('span'), T('pr.b3', '不用') - 0.2, { y: 6, duration: 0.4 });
    K.source(root, 'Open Library · Principles: Life and Work, 2017', T('pr.b3', '正式出版'), T('pr.b3', 'end') + 0.3, ['pr.book-2017']);
    K.source(root, '本系列比对：' + PDF0 + ' · 2015 公开版（Internet Archive 2015-08 存档）与 2016 重排版', T('pr.b3') + 0.4, T('pr.b3', '正式出版') - 0.4,
      ['pr.version-2015-match', 'pr.ver-2015-public', 'pr.ver-local-2016']);
  });

  // What the public record says about Palantir's use of it, and what this episode reads instead.
  page('pr-scope', T('pr.b4') - 0.3, T('pr.b5') + 0.2, '早期 PDF', (root, from) => {
    // the first panel centred while it is alone, then both
    K.frame(root, 200, 310, 920, 760, from, T('pr.b4', '所以') - 0.9);
    shot(root, 200, 310, 1720, 760, from - 0.05);
    const use = K.box(root, 'pr-panel open', 200, 310, 720, 450);
    K.el(use, 'pr-panel-h', 'Palantir 的用法');
    const lines = [K.el(use, 'pr-panel-li', 'Qureshi 的回顾 · 只此一处'), K.el(use, 'pr-panel-li', '版本、读法、培训 · 均未提及'),
      K.el(use, 'pr-panel-li', '本系列检索的公开网页 · 未见描述')];
    K.show(use, T('pr.b4') + 0.05, { y: 16 });
    K.show(lines, T('pr.b4', '公开材料') - 0.2, { y: 10, stagger: 0.25 });
    const read = K.box(root, 'pr-panel', 1000, 310, 720, 450);
    const readH = K.el(read, 'pr-panel-h blue', '文件的内容');
    const parts = ['痛苦与反思', '机器与诊断', '可信度', '制度'].map(t => K.el(read, 'pr-panel-li', t));
    K.show(read, T('pr.b4', '所以') - 0.1, { y: 16 });
    K.show(parts, T('pr.b4', '文件里') - 0.1, { y: 10, stagger: 0.1 });
    // the first part takes the point just before its chapter begins: the list hands over to the chapter tag
    const next = T('pr.b4', 'end') + 0.15;
    dim(use, next, 0.45);
    tint(readH, next, INK);
    tint(parts[0], next);
    K.source(root, NQ + ' · 本系列检索：公开网页，2026-10', T('pr.b4') + 0.4, T('pr.b4', 'end') + 0.4, ['pr.qureshi-silent', 'pr.no-firsthand-else']);
  });

  // ================================================================ 痛苦与反思
  page('pr-true', T('pr.b5') - 0.3, T('pr.b6') + 0.2, '痛苦与反思', root => {
    const q = quote(root, 'pr.use-not-blind', 200, 200, 1520, { size: 44,
      hl: ['for you to reflect on', 'not for you to blindly follow'], hlz: ['供你在遭遇自己的现实时反思', '而不是让你盲目照做'] });
    K.show(q.root, T('pr.b5') + 0.2, { y: 16 });
    // what they are for, then what they are not for, each as the narration says it
    lit([q.hl[0], q.hlz[0]], T('pr.b5', '想一想') - 0.3);
    unlit(q.hl[0], T('pr.b5', '盲目') - 0.3); unlit(q.hlz[0], T('pr.b5', '盲目') - 0.3, INK2);
    lit([q.hl[1], q.hlz[1]], T('pr.b5', '盲目') - 0.3);
    const [ask] = said('pr.use-not-blind', /“(Is it true\?)”/);
    const lab = K.box(root, 'pr-ask-lab', 200, 640, 1520, null, '每一条原则 · 自问');
    const big = K.box(root, 'pr-ask', 200, 700, 1520, null, '“' + ask + '”');
    big.dataset.claim = 'pr.use-not-blind';
    K.show(lab, T('pr.b5', '每读') - 0.15, { y: 10 });
    K.show(big, T('pr.b5', '问一句') - 0.1, { y: 18, duration: 0.8 });
    dim(q.root, T('pr.b5', '每读') - 0.15, 0.45);
    K.source(root, PDF + ', p. 5', T('pr.b5') + 0.4, T('pr.b5', 'end') + 0.4, ['pr.use-not-blind']);
  });

  // Mistake, reflection, a better next time; then his formula. The formula stays as the header
  // while the next segment names what gets in the way.
  page('pr-pain', T('pr.b6') - 0.3, T('pr.b8') + 0.2, '痛苦与反思', (root, from) => {
    // two set-ups: the chain over its formula, then the formula as the header over what blocks it
    shot(root, 200, 172, 1720, 690, from - 0.05, T('pr.b7') - 0.3);
    shot(root, 200, 178, 1720, 910, T('pr.b7') - 0.3);
    const learn = label(root, '多数学习的来路');
    K.show(learn, T('pr.b6') + 0.05, { y: 8 });
    const sv = K.svg(root);
    const CX = [400, 960, 1520];
    const steps = ['犯错', '反思原因', '改变做法'].map((t, i) => K.box(root, 'pr-step', CX[i] - 200, 250, 400, 130, t));
    const links = [0, 1].map(i => arrow(sv, `M${612 + i * 560},315 L${748 + i * 560},315`, [748 + i * 560, 315], 0));
    K.show(steps[0], T('pr.b6', '犯错') - 0.25, { y: 14 });
    links[0].draw(T('pr.b6', '反思') - 0.45, 0.4);
    K.show(steps[1], T('pr.b6', '反思') - 0.2, { y: 14 });
    links[1].draw(T('pr.b6', '下回') - 0.45, 0.4);
    K.show(steps[2], T('pr.b6', '下回') - 0.2, { y: 14 });
    K.source(root, PDF + ', p. 20', T('pr.b6') + 0.4, T('pr.b6', 'end') + 0.3, ['pr.pain-reflect']);
    // the formula, typeset under the chain it restates: each term under a step, each operator halfway between
    // the terms it joins; the terms arrive with the words
    const terms = said('pr.pain-reflect', /(Pain) (\+) (Reflection) (=) (Progress)/);
    const GLOSS = ['痛苦', '', '反思', '', '进步'];
    const eq = K.box(root, 'pr-eq', 200, 500, 1520, 200);
    eq.dataset.claim = 'pr.pain-reflect';
    const parts = terms.map((t, i) => {
      const s = K.el(eq, i % 2 ? 'pr-eq-op' : 'pr-eq-term', t);
      if (GLOSS[i]) K.el(s, 'pr-eq-gloss', GLOSS[i]);
      return s;
    });
    [0, 2, 4].forEach((k, i) => { parts[k].style.left = CX[i] - 200 - parts[k].offsetWidth / 2 + 'px'; });
    [1, 3].forEach(k => {
      const a = parts[k - 1], b = parts[k + 1];
      parts[k].style.left = (a.offsetLeft + a.offsetWidth + b.offsetLeft) / 2 - parts[k].offsetWidth / 2 + 'px';
    });
    // the chain settles back as he writes it down as a formula
    const settle = T('pr.b6', '写成') - 0.2;
    tl.to(steps, { borderColor: '#c3ccd8', color: '#7d8a9c', duration: 0.6, ease: 'power2.out' }, settle);
    dim(links.flatMap(a => [a.line, a.head]), settle, 0.3);
    K.show(parts[0], T('pr.b6', '痛苦') - 0.2, { y: 16 });
    K.show([parts[1], parts[2]], T('pr.b6', '反思', 1) - 0.25, { y: 16, stagger: 0.08 });
    K.show([parts[3], parts[4]], T('pr.b6', '进步') - 0.25, { y: 16, stagger: 0.08 });

    // --- b7: what blocks it
    const b7 = T('pr.b7') - 0.3;
    tl.to([learn, ...steps], { autoAlpha: 0, y: '-=20', duration: 0.45, stagger: 0.04 }, b7);
    tl.to(links.flatMap(a => [a.line, a.head]), { autoAlpha: 0, duration: 0.45 }, b7);
    tl.to(eq.querySelectorAll('.pr-eq-gloss'), { autoAlpha: 0, duration: 0.3 }, b7);
    tl.to(eq, { y: -322, scale: 0.6, transformOrigin: '50% 0%', duration: 1.0, ease: 'power2.inOut' }, b7 + 0.1);
    lit(parts[2], T('pr.b7', '看清') - 0.2);
    // oneself and one's own mistakes, with the ego in between
    const self = K.box(root, 'pr-node', 200, 380, 300, 120, '自己');
    const err = K.box(root, 'pr-node', 1420, 380, 300, 120, '自己的错');
    const see = K.path(sv, 'M512,440 L1408,440', 'ln soft');
    const seeLab = K.box(root, 'pr-small', 540, 466, 360, null, '很难看清');
    K.show(self, T('pr.b7', '人') - 0.2, { y: 12 });
    K.draw(see, T('pr.b7', '看清') - 0.3, { duration: 0.8 });
    K.show(seeLab, T('pr.b7', '看清') - 0.1, { y: 8 });
    K.show(err, T('pr.b7', '自己的错') - 0.3, { y: 12 });
    const wall = K.box(root, 'pr-wall', 953, 360, 14, 160);
    const wallLab = K.box(root, 'pr-wall-lab', 660, 290, 600, null, '自我防御<i>ego barriers</i>');
    gsap.set(wall, { scaleY: 0, transformOrigin: '50% 100%' });
    tl.to(wall, { scaleY: 1, duration: 0.5, ease: 'power3.out' }, T('pr.b7', '自我防御') - 0.2);
    K.show(wallLab, T('pr.b7', '自我防御') - 0.1, { y: 8 });
    tl.to(see, { opacity: 0.35, duration: 0.5 }, T('pr.b7', '自我防御') + 0.3);
    K.source(root, PDF + ', pp. 17–18', T('pr.b7') + 0.4, T('pr.b7', '多数人') - 0.3, ['pr.ego-18']);
    // others: the second half of the segment; the quote's three steps light as the narration reaches them
    const q = quote(root, 'pr.fail-33', 200, 610, 1520, { size: 38,
      hl: ['reluctant to point out mistakes in others', 'an objective diagnosis of problems arising from people’s mistakes is often missing', 'personal evolution is stunted'],
      hlz: ['不愿指出别人的错误', '对人的错误引起的问题，常常缺少客观的诊断', '个人的进化也受到阻碍'] });
    K.show(q.root, T('pr.b7', '多数人') - 0.2, { y: 14 });
    const beats = [T('pr.b7', '多数人') + 0.3, T('pr.b7', '诊断') - 0.2, T('pr.b7', '受了阻') - 0.2];
    unlit(parts[2], beats[0]);
    beats.forEach((t, i) => {
      lit([q.hl[i], q.hlz[i]], t);
      if (i < 2) { unlit(q.hl[i], beats[i + 1]); unlit(q.hlz[i], beats[i + 1], INK2); }
    });
    K.source(root, PDF + ', p. 33', T('pr.b7', '多数人'), T('pr.b7', 'end') + 0.4, ['pr.fail-33']);
  });

  // Pain has a dose.
  page('pr-dose', T('pr.b8') - 0.3, T('pr.b9') + 0.2, '痛苦与反思', (root, from) => {
    shot(root, 200, 270, 1720, 880, from - 0.05);
    const Y = 370, H = 120;
    const Z = [{ x: 200, w: 420, top: '没有痛苦', bot: '通常妨碍成长', cls: 'none' }, { x: 620, w: 680, top: '适度', bot: '与目标相称', cls: 'mid' }, { x: 1300, w: 420, top: '过多痛苦', bot: '把人压垮', cls: 'over' }];
    const frame = K.box(root, 'pr-dose-frame', 200, Y, 1520, H);
    const zones = Z.map(z => K.box(root, 'pr-zone ' + z.cls, z.x, Y, z.w, H));
    const tops = Z.map(z => K.box(root, 'pr-zone-top ' + z.cls, z.x, Y - 94, z.w, null, z.top));
    const bots = Z.map(z => K.box(root, 'pr-zone-bot ' + z.cls, z.x, Y + H + 22, z.w, null, z.bot));
    K.show(frame, from + 0.1, { y: 0, duration: 0.4 });
    const when = [T('pr.b8', '完全') - 0.2, T('pr.b8', '度') - 0.3, T('pr.b8', '太痛') - 0.2];
    Z.forEach((_, i) => {
      gsap.set(zones[i], { scaleX: 0, transformOrigin: '50% 50%' });
      tl.to(zones[i], { scaleX: 1, duration: 0.6, ease: 'power3.out' }, when[i]);
      K.show([tops[i], bots[i]], when[i] + 0.1, { y: 10, stagger: 0.08 });
    });
    // the source's sentence first, then its two ends lit as the needle reaches them
    const q = quote(root, 'pr.pain-bounded', 200, 640, 1520, { size: 40,
      hl: ['too much pain can break someone', 'the absence of pain typically prevents growth'], hlz: ['过多的痛苦会把人压垮', '没有痛苦通常会妨碍成长'] });
    K.show(q.root, T('pr.b8') + 0.3, { y: 14 });
    // the dose: a needle set in the middle, carried to each end as the narration names it, and back
    const mid = z => z.x + z.w / 2;
    const needle = K.box(root, 'pr-needle', mid(Z[1]) - 2, Y - 14, 4, H + 28);
    K.el(needle, 'pr-needle-cap');
    K.show(needle, T('pr.b8', '度') - 0.2, { y: -14, duration: 0.5 });
    tl.to(needle, { x: mid(Z[2]) - mid(Z[1]), duration: 0.8, ease: 'power2.inOut' }, T('pr.b8', '太痛') - 0.35);
    lit([q.hl[0], q.hlz[0]], T('pr.b8', '太痛') - 0.1);
    tl.to(needle, { x: mid(Z[0]) - mid(Z[1]), duration: 1.1, ease: 'power2.inOut' }, T('pr.b8', '完全') - 0.45);
    unlit(q.hl[0], T('pr.b8', '完全') - 0.2); unlit(q.hlz[0], T('pr.b8', '完全') - 0.2, INK2);
    lit([q.hl[1], q.hlz[1]], T('pr.b8', '完全') + 0.1);
    tl.to(needle, { x: 0, duration: 1.0, ease: 'power2.inOut' }, T('pr.b8', 'end') - 0.1);
    K.source(root, PDF + ', p. 14, note 15', T('pr.b8') + 0.4, T('pr.b8', 'end') + 0.6, ['pr.pain-bounded']);
  });

  // ================================================================ 机器与诊断
  // Goals → machine (design + people) → outcomes; a mismatch goes back to design or to people.
  // the finished loop holds into the next segment; the page turns as 问题 is said
  page('pr-machine', T('pr.b9') - 0.3, T('pr.b11', '问题') - 0.3, '机器与诊断', (root, from, to) => {
    // the topic as a title while the narration names it, then the label over the whole diagram; too short a beat
    // for a camera move, so the frame stays on the diagram's set-up throughout
    shot(root, 200, 172, 1720, 870, from - 0.05);
    statement(root, '管理公司', T('pr.b9') + 0.05, T('pr.b9', '看成') - 0.3, false);
    const sv = K.svg(root);
    const goals = K.box(root, 'pr-mnode', 200, 400, 280, 140, '<b>目标</b><i>Goals</i>');
    const mach = K.box(root, 'pr-machine', 640, 330, 640, 280, '<div class="pr-machine-h"><b>机器</b><i>Machine</i></div>');
    const design = K.box(root, 'pr-part', 680, 418, 260, 160, '<b>设计</b><i>design</i>');
    const people = K.box(root, 'pr-part', 980, 418, 260, 160, '<b>人</b><i>people</i>');
    const out = K.box(root, 'pr-mnode', 1440, 400, 280, 140, '<b>结果</b><i>Outcomes</i>');
    const gm = arrow(sv, 'M482,470 L634,470', [634, 470], 0);
    const mo = arrow(sv, 'M1282,470 L1434,470', [1434, 470], 0);
    const cmp = K.path(sv, 'M1580,396 L1580,250 L340,250 L340,396', 'ln red');
    const cmpLab = K.box(root, 'pr-mismatch', 760, 196, 400, null, '对不上');
    const back = arrow(sv, 'M1580,544 L1580,700 L810,700 L810,586', [810, 586], -90);
    const back2 = arrow(sv, 'M1110,700 L1110,586', [1110, 586], -90);
    const fixD = K.box(root, 'pr-fix', 690, 716, 240, null, '改设计');
    const fixP = K.box(root, 'pr-fix', 990, 716, 240, null, '改人');
    K.show(mach, T('pr.b9', '机器') - 0.25, { y: 16 });
    K.show(design, T('pr.b9', '设计') - 0.2, { y: 12 });
    K.show(people, T('pr.b9', '和人') - 0.05, { y: 12 });
    mo.draw(T('pr.b9', '产出') - 0.3, 0.4);
    K.show(out, T('pr.b9', '产出') + 0.05, { y: 12 });
    K.show(goals, T('pr.b9', '目标') - 0.3, { y: 12 });
    gm.draw(T('pr.b9', '目标') - 0.1, 0.4);
    K.draw(cmp, T('pr.b9', '对不上') - 0.35, { duration: 0.7 });
    K.show(cmpLab, T('pr.b9', '对不上') - 0.1, { y: 8 });
    back.draw(T('pr.b9', '改设计') - 0.6, 0.8);
    K.show(fixD, T('pr.b9', '改设计') - 0.1, { y: 8 });
    tl.to(design, { borderColor: BLUE, color: BLUE, duration: 0.3 }, T('pr.b9', '改设计') - 0.05);
    back2.draw(T('pr.b9', '人身上') - 0.4, 0.4);
    K.show(fixP, T('pr.b9', '人身上') - 0.05, { y: 8 });
    tl.to(people, { borderColor: BLUE, color: BLUE, duration: 0.3 }, T('pr.b9', '人身上') + 0.05);
    K.source(root, PDF + ', p. 24', T('pr.b9') + 0.4, T('pr.b9', 'end') + 0.3, ['pr.machine-loop']);
    // --- b10: the loop itself. When the narration names it, a blue stroke runs round it in order:
    // goals into the machine, through it to the outcomes, and back to design and to people
    const b10 = T('pr.b10') - 0.1;
    tl.to([design, people], { borderColor: INK, color: INK, duration: 0.4 }, b10);
    unlit([fixD, fixP], b10, INK2);
    dim([cmp, cmpLab], b10, 0.4);
    const name = K.box(root, 'pr-loop', 200, 800, 1520, null, '<b>反馈回路管得好坏</b><span>·</span><div>好组织与坏组织的最大差别</div>');
    const [term, dot, gloss] = name.children;
    K.show(gloss, T('pr.b10', '好组织') - 0.25, { y: 10 });
    const loopAt = T('pr.b10', '反馈回路') - 0.35;
    const run = [arrow(sv, 'M482,470 L634,470', [634, 470], 0, 'ln blue'), arrow(sv, 'M1282,470 L1434,470', [1434, 470], 0, 'ln blue'),
      arrow(sv, 'M1580,544 L1580,700 L810,700 L810,586', [810, 586], -90, 'ln blue'), arrow(sv, 'M1110,700 L1110,586', [1110, 586], -90, 'ln blue')];
    run[0].draw(loopAt, 0.3);
    tl.to(mach, { borderColor: BLUE, duration: 0.3, ease: 'power2.out' }, loopAt + 0.25);
    run[1].draw(loopAt + 0.45, 0.3);
    run[2].draw(loopAt + 0.8, 0.7);
    run[3].draw(loopAt + 1.2, 0.3);
    K.show([term, dot], loopAt, { y: 10, stagger: 0 });
    K.source(root, PDF + ', pp. 24, 41', T('pr.b10'), to - 0.4, ['pr.machine-loop', 'pr.feedback-41']);
  });

  // Problem and cause; then cause in two layers.
  // ends after the jump scene has faded in over it, so the root-cause example stays up through its sentence
  page('pr-cause', T('pr.b11', '问题') - 0.7, T('pr.b12', '他说') + 0.7, '机器与诊断', (root, from) => {
    // problem and cause, then the cause in two layers under the same heading
    shot(root, 200, 190, 1720, 815, from - 0.05, T('pr.b12') - 0.4);
    shot(root, 200, 190, 1720, 780, T('pr.b12') - 0.4);
    // the two examples as the narration says them
    const sleep = '“睡不够”', tired = '“我因为太累，工作做得不好”';
    const hCause = K.box(root, 'pr-col-h', 200, 190, 660, null, '原因');
    const hProb = K.box(root, 'pr-col-h', 1060, 190, 660, null, '问题');
    const sv = K.svg(root);
    const div = K.path(sv, 'M960,200 L960,520', 'ln thin');
    // the first heading comes in as the page finishes turning, so the turn never shows bare paper
    K.show(hProb, T('pr.b11', '问题') - 0.4, { y: 10 });
    K.show(hCause, T('pr.b11', '原因') - 0.25, { y: 10 });
    K.draw(div, T('pr.b11', '原因') - 0.2, { duration: 0.5 });
    const card = K.box(root, 'pr-card', 760, 320, 400, 120, sleep);
    K.show(card, T('pr.b11', '睡不够') - 0.25, { y: 14 });
    tl.to(card, { x: 330 - 760, duration: 0.9, ease: 'power2.inOut' }, T('pr.b11', '原因', 1) - 0.5);
    const sub = K.box(root, 'pr-col-sub', 1060, 270, 660, null, '不好的结果');
    const prob = K.box(root, 'pr-card', 1060, 320, 660, 120, tired);
    K.show(sub, T('pr.b11', '不好的结果') - 0.2, { y: 8 });
    K.show(prob, T('pr.b11', '太累') - 0.3, { y: 14 });
    const q = quote(root, 'pr.diag-31', 200, 610, 1520, { size: 42 });
    K.show(q.root, T('pr.b11', '睡不够', 1) - 0.2, { y: 14 });
    K.source(root, PDF + ', p. 31', from + 0.4, T('pr.b11', 'end') + 0.4, ['pr.diag-31']);
    // --- b12: proximate and root
    const b12 = T('pr.b12') - 0.35;
    tl.to([hProb, sub, prob, card, q.root, div], { autoAlpha: 0, y: '-=16', duration: 0.45, stagger: 0.03 }, b12);
    const [prox] = said('pr.diag-root', /（“([^”]+)”）/);
    const [root_] = said('pr.diag-root', /（“(我[^”]+)”）。/);
    const rows = [
      { y: 300, term: '近因', en: 'proximate cause', kind: '动作或不作为 · 通常用动词描述', ex: prox, at: ['近因', '动作', '没查'] },
      { y: 560, term: '根因', en: 'root cause', kind: '人的特点 · 通常用形容词描述', ex: root_, at: ['根因', '特点', '健忘'] },
    ];
    const rules = [280, 520, 780].map(y => K.path(sv, `M200,${y} L1720,${y}`, 'ln thin'));
    K.draw(rules, T('pr.b12', '近因') - 0.4, { duration: 0.6, stagger: 0.08 });
    const cells = rows.map(r => {
      const term = K.box(root, 'pr-term', 200, r.y + 30, 420, null, `<b>${r.term}</b><i>${r.en}</i>`);
      const kind = K.box(root, 'pr-kind', 660, r.y + 70, 520, null, r.kind);
      const ex = K.box(root, 'pr-ex', 1220, r.y + 54, 500, null, '“' + r.ex + '”');
      K.show(term, T('pr.b12', r.at[0]) - 0.25, { y: 10 });
      K.show(kind, T('pr.b12', r.at[1]) - 0.25, { y: 10 });
      K.show(ex, T('pr.b12', r.at[2]) - 0.25, { y: 10 });
      return { term, kind, ex };
    });
    tint(cells[0].ex, T('pr.b12', '没查') - 0.1);
    unlit(cells[0].ex, T('pr.b12', '健忘') - 0.3);
    tint(cells[1].ex, T('pr.b12', '健忘') - 0.1);
    const because = arrow(sv, 'M1300,410 L1300,600', [1300, 600], 90);
    const bLab = K.box(root, 'pr-because', 1324, 478, 200, null, '因为');
    because.draw(T('pr.b12', '没查', 1) - 0.1, 0.5);
    K.show(bLab, T('pr.b12', '是因为', 1) - 0.1, { y: 6 });
    K.source(root, PDF + ', p. 32', T('pr.b12') + 0.3, T('pr.b12', '他说') - 0.2, ['pr.diag-root']);
  });

  // Straight from problem to solution, skipping the hours of diagnosis.
  page('pr-jump', T('pr.b12', '他说') + 0.15, T('pr.b13') + 0.2, '机器与诊断', (root, from) => {
    shot(root, 200, 150, 1720, 910, from - 0.05);
    const sv = K.svg(root);
    // the stations sit low enough that the arc and its label stay inside the frame, clear of the chapter tag
    const SY = 320;
    const s1 = K.box(root, 'pr-station', 200, SY, 320, 120, '发现问题');
    const s2 = K.box(root, 'pr-station skip', 800, SY, 320, 120, '<b>诊断</b><span>几个小时</span>');
    const s3 = K.box(root, 'pr-station', 1400, SY, 320, 120, '解决办法');
    const road = [K.path(sv, `M524,${SY + 60} L796,${SY + 60}`, 'ln thin'), K.path(sv, `M1124,${SY + 60} L1396,${SY + 60}`, 'ln thin')];
    const jump = arrow(sv, `M360,${SY - 6} Q960,${SY - 220} 1548,${SY - 6}`, [1548, SY - 6], deg(960, SY - 220, 1548, SY - 6), 'ln red');
    const jLab = K.box(root, 'pr-jump-lab', 760, SY - 170, 400, null, '一眨眼');
    const skipped = K.box(root, 'pr-skip-lab', 800, SY + 136, 320, null, '被跳过');
    const q = quote(root, 'pr.diag-jump', 200, 560, 1520, { size: 38, hl: ['in a nanosecond'], hlz: ['一眨眼'] });
    K.show(q.root, from + 0.1, { y: 14 });
    K.show(s1, T('pr.b12', '发现') - 0.25, { y: 12 });
    jump.draw(T('pr.b12', '眨眼') - 0.35, 0.6);
    K.show(jLab, T('pr.b12', '眨眼') - 0.1, { y: 8 });
    lit([q.hl[0], q.hlz[0]], T('pr.b12', '眨眼') - 0.1);
    K.show(s3, T('pr.b12', '解决') - 0.25, { y: 12 });
    K.draw(road, T('pr.b12', '几个小时') - 0.4, { duration: 0.5 });
    K.show(s2, T('pr.b12', '几个小时') - 0.25, { y: 12 });
    K.show(skipped, T('pr.b12', '诊断') - 0.1, { y: 6 });
    K.source(root, PDF + ', p. 32', T('pr.b12', '他说') + 0.2, T('pr.b12', 'end') + 0.4, ['pr.diag-jump']);
  });

  // ================================================================ 可信度
  page('pr-believe', T('pr.b13') - 0.3, T('pr.b15') + 0.2, '可信度', root => {
    const big = statement(root, '<span>分歧中的意见</span><span>&nbsp;· 权重不同</span>', T('pr.b13') + 0.05, T('pr.b13', '可信度') - 0.5);
    // after the statement, one set-up holds the term while its definition, the grid and the caveat take turns under it
    shot(root, 200, 172, 1720, 885, T('pr.b13', '可信度') - 0.6);
    gsap.set(big.lastChild, { autoAlpha: 0 });
    tl.to(big.lastChild, { autoAlpha: 1, duration: 0.4 }, T('pr.b13', '所有意见') - 0.2);
    const lab = root.querySelector('.pr-label');
    const hero = K.box(root, 'pr-hero', 200, 236, 1520, null, '<b>可信度</b><i>believability</i>');
    K.show(hero, T('pr.b13', '可信度') - 0.25, { y: 16 });
    const q = quote(root, 'pr.bel-31', 200, 430, 1520, { size: 40,
      hl: ['the probability that a person’s view will be right', 'the quality of a person’s reasoning', 'their track record'],
      hlz: ['一个人的看法正确的概率', '一个人推理的质量', '他过往的记录'] });
    K.show(q.root, T('pr.b13', '看法') - 0.35, { y: 14 });
    const walk = [T('pr.b13', '看法') - 0.1, T('pr.b13', '推理') - 0.25, T('pr.b13', '做成过') - 0.25];
    walk.forEach((t, i) => {
      lit([q.hl[i], q.hlz[i]], t);
      if (i < 2) { unlit(q.hl[i], walk[i + 1]); unlit(q.hlz[i], walk[i + 1], INK2); }
    });
    K.source(root, PDF + ', #30, #31', T('pr.b13') + 0.5, T('pr.b13', 'end') + 0.3, ['pr.bel-30', 'pr.bel-31']);
    // --- b14: three levels from two qualities
    const b14 = T('pr.b14') - 0.4;
    tl.to([lab, q.root], { autoAlpha: 0, y: '-=16', duration: 0.45 }, b14);
    const C = [760, 1260], R = [480, 650], CW = 460, RH = 150;
    const colH = ['反复做成过', '没有反复做成过'].map((t, i) => K.box(root, 'pr-grid-h', C[i], 420, CW, null, t));
    const rowH = ['讲得清道理', '讲不清道理'].map((t, i) => K.box(root, 'pr-grid-r', 200, R[i], 520, RH, t));
    const CELLS = [[0, 0, '最可信', 'top'], [0, 1, '排在其次', ''], [1, 0, '排在其次', ''], [1, 1, '最不可信', 'low']];
    const cells = CELLS.map(([r, c, t, cls]) => K.box(root, 'pr-cell ' + cls, C[c], R[r], CW, RH, t));
    K.show(colH, T('pr.b14', '反复') - 0.25, { y: 8, stagger: 0.1 });
    K.show(rowH, T('pr.b14', '讲得清') - 0.25, { y: 8, stagger: 0.1 });
    K.show(cells[0], T('pr.b14', '最可信') - 0.25, { y: 10 });
    K.show([cells[1], cells[2]], T('pr.b14', '只占') - 0.25, { y: 10, stagger: 0.1 });
    K.show(cells[3], T('pr.b14', '最不可信') - 0.25, { y: 10 });
    K.source(root, PDF + ', #31b', T('pr.b14') + 0.3, T('pr.b14', 'end') + 0.4, ['pr.bel-31b', 'pr.bel-merit']);
    // ideas are still judged on their merit; the grid stays until the caveat's subject is named,
    // so its last cell is read and not only glimpsed
    const turn = T('pr.b14', '意见') - 0.55;
    tl.to([...colH, ...rowH, ...cells], { autoAlpha: 0, y: '-=16', duration: 0.45, stagger: 0.02 }, turn);
    const m = quote(root, 'pr.bel-merit', 200, 440, 1520, { size: 44, hl: ['assessed on their merit'], hlz: ['按其本身的是非来评估'] });
    K.show(m.root, T('pr.b14', '意见') - 0.3, { y: 14 });
    lit(m.hl[0], T('pr.b14', '内容') - 0.2); lit(m.hlz[0], T('pr.b14', '内容') - 0.2);
    const novice = K.box(root, 'pr-novice', 200, 830, 1520, null, '新手 · 有时也有很好的想法');
    K.show(novice, T('pr.b14', '没经验') - 0.25, { y: 10 });
    unlit(m.hl[0], T('pr.b14', '没经验') - 0.25); unlit(m.hlz[0], T('pr.b14', '没经验') - 0.25, INK2);
  });

  // Ask three, about their reasoning; have them test yours.
  page('pr-three', T('pr.b15') - 0.3, T('pr.b16') + 0.2, '可信度', (root, from) => {
    shot(root, 200, 180, 1720, 925, from - 0.05);
    const q = quote(root, 'pr.bel-195b', 200, 180, 1520, { size: 44 });
    K.show(q.root, T('pr.b15') + 0.1, { y: 14 });
    const sv = K.svg(root);
    const you = K.box(root, 'pr-you', 200, 580, 340, 200, '<b>你</b><span>重要的决定</span>');
    K.show(you, T('pr.b15', '重要') - 0.1, { y: 12 });
    const PY = [520, 640, 760];
    const ppl = PY.map(y => K.box(root, 'pr-person', 1340, y, 380, 100, '可信的人'));
    K.show(ppl, T('pr.b15', '可信的人') - 0.35, { y: 12, stagger: 0.1 });
    const concl = K.box(root, 'pr-tagword dim', 740, 476, 180, null, '<span>结论</span>');
    const reason = K.box(root, 'pr-tagword blue', 960, 476, 180, null, '推理');
    K.show(concl, T('pr.b15', '结论') - 0.3, { y: 8 });
    strike(concl.firstChild, T('pr.b15', '结论') + 0.1, INK2);
    const lines = PY.map(y => {
      const ty = 680 + (y - 640) / 4;
      return arrow(sv, `M1334,${y + 50} L548,${ty}`, [548, ty], deg(1334, y + 50, 548, ty), 'ln blue');
    });
    lines.forEach((a, i) => a.draw(T('pr.b15', '推理') - 0.45 + i * 0.08, 0.6));
    K.show(reason, T('pr.b15', '推理') - 0.25, { y: 8 });
    const test = arrow(sv, 'M548,866 L1320,866', [1320, 866], 0);
    const tLab = K.box(root, 'pr-test', 600, 880, 700, null, '检验你的推理');
    test.draw(T('pr.b15', '检验') - 0.45, 0.6);
    K.show(tLab, T('pr.b15', '检验') - 0.2, { y: 8 });
    K.source(root, PDF + ', #195b', T('pr.b15') + 0.4, T('pr.b15', 'end') + 0.4, ['pr.bel-195b']);
  });

  // Arguing to find out what is true.
  page('pr-argue', T('pr.b16') - 0.3, T('pr.b17') + 0.2, '可信度', root => {
    const q = quote(root, 'pr.dis-24', 200, 270, 1520, { size: 56,
      hl: ['find out what is true', '‘win’', 'assertive', 'open-minded', 'at the same time'],
      hlz: ['弄清什么是真的', '“赢”', '坚持己见', '保持开放', '同时'] });
    K.show(q.root, T('pr.b16') + 0.1, { y: 16 });
    const [tr, win, as, op, same] = q.hl, [ztr, zwin, zas, zop, zsame] = q.hlz;
    lit([tr, ztr], T('pr.b16', '真的') - 0.35);
    strike(win, T('pr.b16', '赢') - 0.15, INK2); strike(zwin, T('pr.b16', '赢') - 0.15, INK2);
    unlit(tr, T('pr.b16', '敢说') - 0.35); unlit(ztr, T('pr.b16', '敢说') - 0.35, INK2);
    lit([as, zas], T('pr.b16', '敢说') - 0.35);
    lit([op, zop], T('pr.b16', '听得进') - 0.35);
    lit([same, zsame], T('pr.b16', '同时') - 0.35);
    K.source(root, PDF + ', #24', T('pr.b16') + 0.4, T('pr.b16', 'end') + 0.4, ['pr.dis-24']);
  });

  // ================================================================ 制度
  page('pr-mistake', T('pr.b17') - 0.3, T('pr.b18') + 0.2, '制度', (root, from) => {
    shot(root, 200, 172, 1720, 890, from - 0.05);
    const lab = label(root, BW);
    K.show(lab, T('pr.b17') + 0.15, { y: 8 });
    const q = quote(root, 'pr.mistake-8', 200, 240, 1520, { size: 44 });
    K.show(q.root, T('pr.b17', '写道') - 0.1, { y: 14 });
    const ok = K.box(root, 'pr-verdict', 200, 640, 560, 250, '<span>没关系</span><b>犯错</b>');
    const no = K.box(root, 'pr-verdict no', 840, 640, 880, 250, '<span>不可接受</span><div class="pr-verdict-items"><b>不识别</b><b>不分析</b><b>不学习</b></div>');
    K.show(ok, T('pr.b17', '犯错') - 0.25, { y: 14 });
    K.show(no, T('pr.b17', '错了') - 0.25, { y: 14 });
    const items = no.querySelectorAll('b');
    gsap.set(items, { autoAlpha: 0 });
    ['找出', '分析', '学东西'].forEach((w, i) => tl.to(items[i], { autoAlpha: 1, duration: 0.35 }, T('pr.b17', w) - 0.25));
    K.source(root, PDF + ', #8', T('pr.b17') + 0.4, T('pr.b17', 'end') + 0.4, ['pr.mistake-8']);
  });

  // The issues log: mandatory, and lopsided.
  page('pr-log', T('pr.b18') - 0.3, T('pr.b19') + 0.2, '制度', (root, from) => {
    shot(root, 200, 172, 1720, 870, from - 0.05);
    label(root, BW);
    const log = K.box(root, 'pr-log', 200, 250, 620, 620, '<div class="pr-log-h"><b>问题日志</b><i>issues log</i></div>');
    const rows = Array.from({ length: 8 }, (_, i) => K.box(log, 'pr-log-row', 30, 150 + i * 52, 560, 36));
    const fresh = K.box(log, 'pr-log-row new', 30, 150 + 8 * 52, 560, 36);
    const must = K.box(log, 'pr-must', 344, 34, 236, 64, '强制使用');
    K.show(log, T('pr.b18', '记进') - 0.3, { y: 16 });
    K.show(rows, T('pr.b18', '记进'), { y: 0, duration: 0.3, stagger: 0.04 });
    K.show(must, T('pr.b18', '非用不可') - 0.3, { y: 0, scale: 1.1, duration: 0.45 });
    const sv = K.svg(root);
    const LANES = [
      { y: 300, cond: '未记入日志', res: '大麻烦', cls: 'bad', at: ['没记进', '大麻烦'] },
      { y: 580, cond: '已记入日志', res: '多半受表扬', cls: 'good', at: ['记进去', '表扬'], nth: 1 },
    ];
    LANES.forEach(l => {
      const c = K.box(root, 'pr-cond', 920, l.y, 420, 150, `<span>出现问题</span><b>${l.cond}</b>`);
      const a = arrow(sv, `M1346,${l.y + 75} L1430,${l.y + 75}`, [1430, l.y + 75], 0);
      const r = K.box(root, 'pr-res ' + l.cls, 1450, l.y + 36, 270, null, l.res);
      const t0 = T('pr.b18', l.at[0], l.nth || 0) - 0.3;
      K.show(c, t0, { y: 12 });
      a.draw(T('pr.b18', l.at[1]) - 0.5, 0.35);
      K.show(r, T('pr.b18', l.at[1]) - 0.2, { y: 10 });
    });
    K.show(fresh, T('pr.b18', '记进去', 1) - 0.1, { y: 0, x: 20, duration: 0.5 });
    const dx = K.box(root, 'pr-res-sub', 1450, 580 + 112, 270, null, '最好已诊断');
    K.show(dx, T('pr.b18', '诊断') - 0.2, { y: 8 });
    K.source(root, PDF + ', #19a, #144', T('pr.b18') + 0.4, T('pr.b18', 'end') + 0.4, ['pr.log-mandatory', 'pr.log-asymmetry']);
  });

  // Name the person.
  page('pr-name', T('pr.b19') - 0.3, T('pr.b20') + 0.2, '制度', (root, from) => {
    shot(root, 200, 172, 1720, 790, from - 0.05);
    label(root, BW);
    const q = quote(root, 'pr.mistake-15', 200, 250, 1520, { size: 48 });
    K.show(q.root, T('pr.b19') + 0.15, { y: 14 });
    const [named, we] = said('pr.mistake-15', /“(Harry[^”]+)”[^“]*“([^”]+)”/);
    const a = K.box(root, 'pr-say', 200, 610, 700, 180, '“' + named + '”');
    const b = K.box(root, 'pr-say dim', 1020, 610, 700, 180, '<span>“' + we + '”</span>');
    a.dataset.claim = b.dataset.claim = 'pr.mistake-15';
    K.show(a, T('pr.b19', '点名') - 0.25, { y: 14 });
    K.show(b, T('pr.b19', '不说') - 0.25, { y: 14 });
    strike(b.firstChild, T('pr.b19', '处理好', 1) - 0.1, INK2);
    K.source(root, PDF + ', #15', T('pr.b19') + 0.4, T('pr.b19', 'end') + 0.4, ['pr.mistake-15']);
  });

  // No opt-outs.
  page('pr-optout', T('pr.b20') - 0.3, T('pr.b21') + 0.2, '制度', (root, from) => {
    shot(root, 200, 172, 1720, 855, from - 0.05);
    label(root, BW);
    const req = K.box(root, 'pr-request', 200, 250, 1000, 230, '<span>常有的请求</span><b>出色的人 · 免于审视自己的错误与弱点</b><i>理由 · 太痛苦</i>');
    const [, b, why] = req.children;
    gsap.set([b, why], { autoAlpha: 0 });
    K.show(req, T('pr.b20', '通融') - 0.3, { y: 14 });
    tl.to(b, { autoAlpha: 1, duration: 0.45 }, T('pr.b20', '出色') - 0.25);
    tl.to(why, { autoAlpha: 1, duration: 0.45 }, T('pr.b20', '太痛苦') - 0.25);
    const refuse = K.box(root, 'pr-refuse', 1300, 300, 420, 130, '不让步');
    K.show(refuse, T('pr.b20', '不肯') - 0.25, { y: 0, scale: 1.08, duration: 0.5 });
    const q = quote(root, 'pr.opt-209', 200, 580, 1520, { size: 44, hl: ['opt-outs', 'two sets of rules'], hlz: ['允许有人退出', '两套规则'] });
    K.show(q.root, T('pr.b20', '理由') - 0.3, { y: 14 });
    lit([q.hl[0], q.hlz[0]], T('pr.b20', '口子') - 0.3);
    lit([q.hl[1], q.hlz[1]], T('pr.b20', '两套') - 0.2);
    K.source(root, PDF + ', #209', T('pr.b20') + 0.4, T('pr.b20', 'end') + 0.4, ['pr.opt-209']);
  });

  // ================================================================ 边界
  page('pr-limits', T('pr.b21') - 0.3, T('pr.b22') + 0.2, '边界', (root, from) => {
    // the statement sits over the column that takes its place, so one close frame holds both: the statement, then the
    // file's claim alone; the camera opens out to the whole page as the inside view arrives
    const big = statement(root, '作者的主张', T('pr.b21') + 0.1, T('pr.b21', '文件') - 0.5, false);
    big.style.left = Math.round(550 - big.offsetWidth / 2) + 'px';
    shot(root, 200, 172, 1720, 830, T('pr.b21', '文件') - 0.6);
    const sv = K.svg(root);
    const div = K.path(sv, 'M960,250 L960,900', 'ln thin');
    const lh = K.box(root, 'pr-col-t', 200, 246, 700, null, '文件里的说法');
    // the card names its own source once the source line turns to the New Yorker
    const q1 = quote(root, 'pr.tested-40-years', 200, 370, 700, { size: 40, hl: ['tested over the last 40 years'], hlz: ['经过了检验'], locator: true });
    K.show(q1.loc, T('pr.b21', '内部') - 0.3, { y: 0, duration: 0.4 });
    const none = K.box(root, 'pr-none', 200, 0, 700, null, '外部数据 · 未给出');
    none.style.top = (370 + q1.root.offsetHeight + 36) + 'px';
    K.frame(root, 200, 172, 900, none.offsetTop + none.offsetHeight, from, T('pr.b21', '内部') - 0.9);
    K.show(lh, T('pr.b21', '文件') - 0.25, { y: 8 });
    K.show(q1.root, T('pr.b21', '文件') - 0.05, { y: 14 });
    lit([q1.hl[0], q1.hlz[0]], T('pr.b21', '检验') - 0.25);
    K.show(none, T('pr.b21', '外部') - 0.25, { y: 10 });
    K.draw(div, T('pr.b21', '内部') - 0.5, { duration: 0.6 });
    const rh = K.box(root, 'pr-col-t', 1020, 246, 700, null, 'Bridgewater 内部的用法');
    const rs = K.box(root, 'pr-col-s', 1020, 300, 700, null, 'Copeland 的 The Fund · 据 The New Yorker');
    const q2 = quote(root, 'pr.ny-dispute', 1020, 370, 700, { size: 38, hl: ['inaccurate portrayal'], hlz: ['描绘不准确'] });
    K.show(rh, T('pr.b21', '内部') - 0.25, { y: 8 });
    K.show(rs, T('pr.b21', '记者') - 0.25, { y: 8 });
    K.show(q2.root, T('pr.b21', '都说') - 0.4, { y: 14 });
    lit([q2.hl[0], q2.hlz[0]], T('pr.b21', '不准') - 0.25);
    K.source(root, PDF + ', p. 43', T('pr.b21', '文件') + 0.2, T('pr.b21', '内部') - 0.3, ['pr.tested-40-years']);
    K.source(root, 'Tarpley Hitt, The New Yorker, 2023-11-16', T('pr.b21', '内部') + 0.1, T('pr.b21', 'end') + 0.4, ['pr.ny-dispute']);
  });

  // ================================================================ 回到驻场
  // This series' juxtaposition: an explicit hierarchy, and Qureshi's Palantir.
  page('pr-contrast', T('pr.b22') - 0.3, T('pr.b23') + 0.2, '回到驻场', (root, from) => {
    shot(root, 160, 160, 1760, 930, from - 0.05);
    const sv = K.svg(root);
    // the frame ends inside the safe area, clear of the source line
    const frame = K.path(sv, 'M160,226 L1760,226 L1760,930 L160,930 Z', 'ln dash soft');
    const leg = K.box(root, 'pr-legend', 200, 164, 900, null, '<i></i>本系列的读法 · 并置对照');
    K.draw(frame, T('pr.b22') + 0.05, { duration: 1.0 });
    K.show(leg, T('pr.b22') + 0.3, { y: 8 });
    // the two sides are named as soon as the narration sets them side by side, then each is filled in turn
    const lt = K.box(root, 'pr-col-t', 220, 244, 680, null, BW);
    const rt = K.box(root, 'pr-col-t', 1020, 244, 700, null, 'Qureshi 记得的 Palantir');
    K.show([lt, rt], T('pr.b22', '旁边') - 0.3, { y: 8, stagger: 0.15 });
    // Dalio: a tree of decision rights
    const N = [[560, 325], [410, 392], [710, 392], [335, 459], [485, 459], [635, 459], [785, 459]];
    const E = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
    const edges = E.map(([a, b]) => K.path(sv, `M${N[a][0]},${N[a][1] + 20} L${N[a][0]},${N[a][1] + 33} L${N[b][0]},${N[a][1] + 33} L${N[b][0]},${N[b][1] - 20}`, 'ln'));
    const nodes = N.map(([x, y], i) => K.box(root, 'pr-tree' + (i === 0 ? ' top' : ''), x - 40, y - 20, 80, 40));
    const q1 = quote(root, 'pr.dis-hierarchy', 220, 516, 680, { size: 38, hl: ['an explicit decision-making hierarchy'], hlz: ['一套明确的决策层级'] });
    K.show(nodes.slice(0, 1), T('pr.b22', '决策') - 0.4, { y: 6, duration: 0.4 });
    K.draw(edges, T('pr.b22', '决策') - 0.25, { duration: 0.4, stagger: 0.05 });
    K.show(nodes.slice(1), T('pr.b22', '决策') - 0.1, { y: 6, duration: 0.4, stagger: 0.05 });
    K.show(q1.root, T('pr.b22', '层级') - 0.2, { y: 12 });
    lit([q1.hl[0], q1.hlz[0]], T('pr.b22', '层级') + 0.2);
    // Qureshi: a few directors and the chief executive, everyone else on about the same title
    const lead = Array.from({ length: 6 }, (_, i) => K.box(root, 'pr-flat' + (i === 0 ? ' top' : ''), 1150 + i * 60, 312, 40, 40));
    const leadLab = K.box(root, 'pr-flat-lab', 1020, 362, 700, null, '几位总监与 CEO');
    const flat = Array.from({ length: 16 }, (_, i) => K.box(root, 'pr-flat', 1024 + i * 43, 420, 30, 30));
    const flatLab = K.box(root, 'pr-flat-lab', 1020, 460, 700, null, '其余所有人 · 大致同一头衔');
    const q2 = quote(root, 'pr.qureshi-no-titles', 1020, 516, 700, { size: 38 });
    K.show([...lead, leadLab], T('pr.b22', '总监') - 0.3, { y: 6, duration: 0.4, stagger: 0.04 });
    K.show([...flat, flatLab], T('pr.b22', '头衔') - 0.3, { y: 6, duration: 0.4, stagger: 0.025 });
    K.show(q2.root, T('pr.b22', '命令') - 0.35, { y: 12 });
    K.source(root, PDF + ', #34 · ' + NQ, T('pr.b22') + 0.5, T('pr.b22', 'end') + 0.6, ['pr.dis-hierarchy', 'pr.qureshi-no-titles']);
  });

  page('pr-email', T('pr.b23') - 0.3, T('pr.b24') + 0.2, '回到驻场', root => {
    // the hedge lights with the claim it qualifies
    const q = quote(root, 'pr.qureshi-criticism', 200, 180, 1520, { size: 46, hl: ['seemed', 'tolerated and welcomed'], hlz: ['似乎', '很受容忍，也很受欢迎'] });
    K.show(q.root, T('pr.b23', '写过') - 0.1, { y: 14 });
    lit([...q.hl, ...q.hlz], T('pr.b23', '看起来') - 0.2);
    unlit(q.hl, T('pr.b23', '邮件') - 0.4); unlit(q.hlz, T('pr.b23', '邮件') - 0.4, INK2);
    const mail = K.box(root, 'pr-mail', 200, 470, 680, 330, '<div class="pr-mail-h">一串邮件</div>');
    const r1 = K.el(mail, 'pr-mail-row', '<span>争论双方</span><b>刚入行的工程师 · 总监</b>');
    const r2 = K.el(mail, 'pr-mail-row', '<span>方式</span><b>公开争论</b>');
    K.show(mail, T('pr.b23', '邮件') - 0.35, { y: 14 });
    K.show(r1, T('pr.b23', '工程师') - 0.3, { y: 8 });
    K.show(r2, T('pr.b23', '争论') - 0.3, { y: 8 });
    // the cc line: about a thousand people
    const sv = K.svg(root);
    const COLS = 40, ROWS = 25, x0 = 966, y0 = 480, px = 19, py = 12.6;
    const cols = Array.from({ length: COLS }, (_, c) => {
      const g = K.sv(sv, 'g', { class: 'pr-cc' });
      for (let r = 0; r < ROWS; r++) K.sv(g, 'circle', { cx: x0 + c * px, cy: y0 + r * py, r: 3.6 });
      return g;
    });
    // the whole company fills in column by column while the narration says it, and the count under it
    // keeps pace with the columns: 25 to a column, 1000 when the last one is in
    const fill = T('pr.b23', '全公司') - 0.1, STG = 0.03;
    K.show(cols, fill, { y: 0, duration: 0.25, stagger: STG });
    const ccLab = K.box(root, 'pr-cc-lab', 960, 806, 760, null, '抄送 · 全公司约 <span class="t-num">1000</span> 人');
    K.show(ccLab, fill, { y: 8 });
    const n = ccLab.querySelector('span');
    Film.onFrame(t => {
      const k = Math.max(0, Math.min(COLS, Math.floor((t - fill) / STG) + 1));
      const v = String(k * ROWS);
      if (n.textContent !== v) n.textContent = v;
    });
    const not = K.box(root, 'pr-attr', 200, 880, 1520, null, 'Qureshi 未将此归因于 Dalio');
    K.show(not, T('pr.b23', '归到') - 0.35, { y: 10 });
    K.source(root, NQ, T('pr.b23') + 0.4, T('pr.b23', 'end') + 0.4, ['pr.qureshi-criticism']);
  });

  // This series' reading, dashed.
  // the body's last scene holds under whatever comes next (the outro, or the next card in the compilation)
  page('pr-reading', T('pr.b24') - 0.3, u.bodyEnd + Series.HOLD, '回到驻场', (root, from) => {
    shot(root, 200, 222, 1720, 880, from - 0.05);
    const sv = K.svg(root);
    const frame = K.path(sv, 'M200,300 L1720,300 L1720,880 L200,880 Z', 'ln dash soft');
    const leg = K.box(root, 'pr-legend', 200, 222, 900, null, '<i></i>本系列的读法');
    // the frame of this series' reading is drawn as the narration claims it; the whole takeaway lands with its heading,
    // so it can be read before the outro, and each card takes the blue as the narration names it
    K.show(leg, T('pr.b24') + 0.1, { y: 8 });
    K.draw(frame, T('pr.b24') + 0.2, { duration: 1.0, ease: 'power1.inOut' });
    const head = K.box(root, 'pr-read-h', 260, 350, 1400, null, '进入陌生组织 · 对待错误的办法');
    K.show(head, T('pr.b24', '陌生') - 0.3, { y: 12 });
    const W3 = [['承认错误', '先认'], ['追溯根因', '追到底'], ['听可信的人推理', '可信']];
    const cards = W3.map(([t], i) => K.box(root, 'pr-read', 260 + i * 480, 520, 440, 260, t));
    K.show(cards, T('pr.b24', '陌生') + 0.1, { y: 14, stagger: 0.08 });
    W3.forEach(([, w], i) => {
      tl.to(cards[i], { color: BLUE, borderColor: BLUE, duration: 0.3 }, T('pr.b24', w) - 0.1);
      if (i < 2) tl.to(cards[i], { color: INK, borderColor: '#7d8a9c', duration: 0.4 }, T('pr.b24', W3[i + 1][1]) - 0.1);
    });
  });

  // ================================================================ 收尾（单集）
  Series.outro('pr');
});
