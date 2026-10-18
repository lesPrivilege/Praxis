/* 05 没有送到的情报 — The Looming Tower.
   The book's own text was not available, so the episode works from Wright's New Yorker report, the 9/11
   Commission Report, the CIA Inspector General's summary and Ali Soufan's 2018 remarks; every item on
   screen names its source. Red marks the messages that did not arrive. Dashed frames and links are this
   series' own reading; the diagrams of what a source states are drawn solid.
   Six body scenes, one per chapter, and the series map as the standalone outro.

   Camera (film/camera.js): each section shows a guide, an unpainted box over its finished composition, so the
   camera frames the whole section once and the items arrive into a still frame; it moves between sections.
   K.focus is kept for three beats, so each push means something: the book's title, the passport row and the
   Commission's "not the disease". */
Series.unit('lt', ({ T, tl, has, u, chrome }) => {
  const INK = '#0d1826', INK2 = '#3a4658', INK3 = '#7d8a9c', BLUE = '#1f4fe0', RED = '#dd4a3c';

  // The four materials used instead of the book's text. Same wording in the source cards and the four columns.
  const SRC = [
    { name: 'Lawrence Wright', kind: '《纽约客》报道 · 2006', fig: 'lt.wright-moore-2018', pos: '50% 18%' },
    { name: '九一一委员会', kind: '官方报告 · 2004', fig: 'lt.911-report-cover', pos: '50% 0%' },
    { name: 'CIA 监察长', kind: '报告摘要 · 2005', fig: 'lt.cia-hq-highsmith-aerial', pos: '36% 50%', cap: 'CIA 总部' },
    { name: 'Ali Soufan', kind: '前 FBI 探员的对谈 · 2018', fig: 'lt.fbi-hq-fbi-gov-photo', pos: '45% 50%', cap: 'FBI 总部' },
  ];
  const TAG_W = 'Wright 报道', TAG_C = '委员会报告';

  function open(root, title, from) {
    root.classList.add('paper');
    K.el(root, 'grain');
    chrome(root, title);
    gsap.set(root, { opacity: 0 });
    tl.to(root, { opacity: 1, duration: 0.4 }, from);
  }
  function close(root, to) {
    tl.to(root, { opacity: 0, duration: 0.4, ease: 'power2.in' }, to - 0.4);
  }
  /* Wrap a phrase of a ledger quote in a span so it can be lit; the text itself is not changed.
     The span is cut out of a text node in place, so spans from earlier calls stay attached. */
  function mark(el, phrase) {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const i = n.data.indexOf(phrase);
      if (i < 0) continue;
      const r = document.createRange(), s = document.createElement('span');
      r.setStart(n, i); r.setEnd(n, i + phrase.length);
      s.className = 'lt-mark';
      r.surroundContents(s);
      return s;
    }
    throw new Error('phrase not in quote: ' + phrase);
  }
  /* The phrase of the moment is lit: blue, with a rule drawn under it. When the narration moves on it goes back
     to its text colour and keeps a pale rule, so what has been said stays marked and only the current phrase is blue. */
  const lit = (els, at) => K.lit(els, at);
  const settle = (els, at, color) => {
    tl.set(els, { backgroundImage: 'linear-gradient(#c3ccd8, #c3ccd8)' }, at);
    return tl.to(els, { color: color || INK, duration: 0.5 }, at);
  };
  const blue = (els, at) => tl.to(els, { color: BLUE, duration: 0.4 }, at);
  const unblue = (els, at, color) => tl.to(els, { color: color || INK, duration: 0.5 }, at);
  /* A guide: an unpainted box over a section's finished composition, on from the section's first beat. The camera
     frames what is visible, so it frames the whole section at once instead of reframing as each item arrives. */
  function guide(root, x, y, w, h, from, to) {
    const g = K.box(root, 'lt-guide', x, y, w, h);
    g.dataset.cam = 'frame';
    gsap.set(g, { autoAlpha: 0 });
    tl.to(g, { autoAlpha: 1, duration: 0.01, ease: 'none' }, from);
    if (to !== undefined) tl.to(g, { autoAlpha: 0, duration: 0.01, ease: 'none' }, to);
    return g;
  }
  const bottomOf = els => Math.max(...els.map(e => e.offsetTop + e.offsetHeight));
  /* A line stroked from its start; K.draw keeps a dashed line's dashes while it draws. */
  const drawn = (sv, d, cls, at, o) => { const p = K.path(sv, d, cls); K.draw(p, at, Object.assign({ duration: 0.7 }, o)); return p; };
  /* Arrowhead at (x, y) pointing r / l / u / d; a stop bar ends a link that does not arrive. */
  function head(sv, x, y, dir, cls) {
    const s = 11, d = { r: `M${x - s},${y - s} L${x},${y} L${x - s},${y + s}`, l: `M${x + s},${y - s} L${x},${y} L${x + s},${y + s}`,
      d: `M${x - s},${y - s} L${x},${y} L${x + s},${y - s}`, u: `M${x - s},${y + s} L${x},${y} L${x + s},${y + s}` }[dir];
    return K.path(sv, d, cls);
  }
  const stopBar = (sv, x, y) => K.path(sv, `M${x},${y - 16} L${x},${y + 16}`, 'ln red');
  const fadeIn = (els, at, o) => K.show(els, at, Object.assign({ y: 0, duration: 0.3, stagger: 0 }, o));
  const midY = e => e.offsetTop + e.offsetHeight / 2;

  // ---------------------------------------------------------------- 书与公司
  Film.scene('lt-book', u.bodyStart - 0.2, T('lt.b4') - 0.1, ({ root, from, to }) => {
    open(root, '书与公司', from);
    close(root, to);
    // The book opens as a title card, the camera close on it; when Qureshi's reason arrives the camera pulls back
    // and the same title is the header of the scene.
    const head = K.box(root, 'lt-book-head', 200, 170, null, null);
    const title = K.el(head, 'lt-book-title', 'The Looming Tower');
    const meta = K.el(head, 'lt-book-meta', '<span>Lawrence Wright 著 · 2006</span><span>九一一前史</span>');
    Film.claim('lt.book-knopf-2006'); meta.dataset.claim = 'lt.book-knopf-2006';
    const [m1, m2] = meta.children;
    K.show(title, T('lt.b1') - 0.05, { y: 20, duration: 0.8 });
    K.show(m1, T('lt.b1', '记者') - 0.15, { y: 10 });
    K.show(m2, T('lt.b1', '写') - 0.1, { y: 10 });
    const said = T('lt.b1', '说');
    K.focus(head, from, said - 1.0, { zoom: 1.5, pad: 60 });

    // Qureshi's reason
    const q = K.quote(root, 'ov.qureshi_why_looming_tower', 200, 420, 1520, { size: 42 });
    const why = [mark(q.en, 'founded partly as a response to 9/11'), mark(q.zh, '回应 9/11')];
    const civ = [mark(q.en, 'what Peter felt were the inevitable violations of civil liberties that would follow'),
      mark(q.zh, 'Peter 认为随之而来、无可避免的对公民自由的侵犯')];
    const ctx = [mark(q.en, 'the context was valuable'), mark(q.zh, '这段背景有用')];
    K.show(q.root, said - 0.2, { y: 16 });
    // one phrase at a time: the founding, then civil liberties, then the context; each keeps its rule
    const beat = (prev, next, at) => { settle(prev[0], at); settle(prev[1], at, INK2); lit(next, at); };
    lit(why, T('lt.b1', '回应') - 0.15);
    beat(why, civ, T('lt.b1', '公民自由') - 0.2);
    beat(civ, ctx, T('lt.b1', '背景') - 0.2);
    K.source(root, 'Nabeel Qureshi, Reflections on Palantir, 2024', said - 0.2, T('lt.b1', 'end') + 0.2, ['ov.qureshi_why_looming_tower']);
    tl.to(q.root, { autoAlpha: 0, y: -16, duration: 0.5 }, T('lt.b2') - 0.3);

    // the company's own filing
    const doc = K.box(root, 'lt-doc', 200, 420, 1520, null,
      '<div class="lt-doc-head">Palantir 上市文件 · Form S-1 · 2020</div>' +
      '<div class="lt-doc-row"><b>成立</b><span>2003 年，九一一袭击之后</span></div>' +
      '<div class="lt-doc-row"><b>起初</b><span>为美国情报界的反恐调查与行动开发软件</span></div>');
    const [dh, r1, r2] = doc.children;
    fadeIn(doc, T('lt.b2') - 0.1, { duration: 0.4 });
    K.show(dh, T('lt.b2') + 0.1, { y: 12 });
    // on "the filing" the card is laid out: its first row whole, the second row's label and rule waiting for "at first"
    K.show([r1, r2], T('lt.b2', '上市') - 0.3, { y: 12, stagger: 0.1 });
    K.show(r2.querySelector('span'), T('lt.b2', '起初') - 0.15, { y: 12 });
    K.source(root, 'Palantir Technologies, Form S-1, 2020', T('lt.b2') + 0.3, T('lt.b2', 'end') + 0.3, ['lt.s1-founding']);
    tl.to(doc, { autoAlpha: 0, y: -16, duration: 0.5 }, T('lt.b3') - 0.3);

    // what of the book could be read
    const sheet = K.box(root, 'lt-sheet', 200, 420, 1520, null,
      '<div class="lt-sheet-head">出版方公开的开篇节选</div><div class="lt-sheet-title">The Martyr</div>' +
      '<div class="lt-sheet-line">Sayyid Qutb · 1948 年乘船赴美</div><div class="lt-sheet-note">节选中未出现 CIA、FBI 与九一一</div>');
    const [sh, st, sl, sn] = sheet.children;
    // the empty sheet stands for the book's text on "the text"; the excerpt's head and title fill it on "the publisher"
    gsap.set(sheet, { autoAlpha: 0 });
    tl.to(sheet, { autoAlpha: 1, duration: 0.5 }, T('lt.b3', '正文') - 0.2);
    K.show([sh, st], T('lt.b3', '出版社') - 0.3, { y: 12, stagger: 0.12 });
    K.show(sl, T('lt.b3', '埃及人') - 0.2, { y: 10 });
    K.show(sn, T('lt.b3', '情报机构') - 0.4, { y: 10 });
    K.source(root, 'Lawrence Wright, The Looming Tower, 2006（出版方节选）', T('lt.b3', '出版社') - 0.2, T('lt.b3', '下面') - 0.4, ['lt.pub-excerpt']);
    const away = T('lt.b3', '下面') - 0.3;
    tl.to([head, sheet], { autoAlpha: 0, y: -20, duration: 0.5, stagger: 0.05 }, away);
    // the header and its three panels share one frame: the camera holds still while the panel below changes
    guide(root, 200, 170, 1520, bottomOf([q.root, doc, sheet]) - 170, said - 0.4, away);

    // the four materials used instead
    const lab = K.box(root, 'lt-label', 200, 196, 1520, null, '本集的依据');
    K.show(lab, T('lt.b3', '下面') + 0.1, { y: 8 });
    // credits sit under the picture, outside its frame, so they cover neither the photo nor the report cover's subtitle
    const IMG_H = 380;
    const cards = SRC.map((s, i) => {
      const c = K.box(root, 'lt-src', 200 + i * 390, 256, 350, 680);
      K.figure(c, s.fig, 0, 0, 350, IMG_H, { pos: s.pos, credit: false });
      c.under = K.box(c, 'lt-src-under', 0, IMG_H + 10, 350, null);
      if (s.cap) K.el(c.under, 'lt-src-cap', s.cap);
      K.el(c.under, 'kfig-credit lt-credit', Film.asset(s.fig).credit_text);
      return c;
    });
    // names line up across the four cards, below the tallest caption and credit
    const nameY = IMG_H + 10 + Math.max(...cards.map(c => c.under.offsetHeight)) + 22;
    const kinds = cards.map((c, i) => {
      K.box(c, 'lt-src-name', 0, nameY, 350, null, SRC[i].name);
      return K.box(c, 'lt-src-kind', 0, nameY + 54, 350, null, SRC[i].kind);
    });
    [T('lt.b3', '自己') - 0.5, T('lt.b3', '委员会') - 0.8, T('lt.b3', '监察长') - 0.8, T('lt.b3', '探员') - 0.8]
      .forEach((at, i) => K.show(cards[i], at, { y: 24, duration: 0.7 }));
    guide(root, 200, 196, 1520, 256 + bottomOf(kinds) - 196, away);
    // the four photos leave one by one before the scene fades, so none is cut away at the change of scene
    tl.to([lab, ...cards], { autoAlpha: 0, y: -16, duration: 0.6, stagger: 0.06 }, to - 1.1);
    K.source(root, 'Lawrence Wright, The Agent, The New Yorker, 2006 · The 9/11 Commission Report, 2004 · CIA OIG, Executive Summary, 2005 · 9/11 Memorial panel, 2018',
      T('lt.b3', '自己') - 0.3, to, ['lt.ag-nopass', 'lt.rep-visa-not-shared', 'lt.ig-notreluctance', 'lt.eye-soufan-individuals', 'lt.eye-soufan-fbi']);
  });

  // ---------------------------------------------------------------- 一本护照
  Film.scene('lt-chain', T('lt.b4') - 0.5, T('lt.b10') - 0.1, ({ root, from, to }) => {
    open(root, '一本护照', from);
    close(root, to);
    // columns: date | CIA | (gap where the messages should cross) | FBI
    const C = { date: 200, cia: 440, ciaW: 600, fbi: 1200, fbiW: 520 };
    const hc = K.box(root, 'lt-colhead', C.cia, 132, C.ciaW, null, '<b>CIA</b><span>中央情报局</span>');
    const hf = K.box(root, 'lt-colhead', C.fbi, 132, C.fbiW, null, '<b>FBI</b><span>联邦调查局</span>');
    const rule = K.box(root, 'lt-rule', 200, 220, 1520, 2);
    K.show([hc, hf], from + 0.2, { y: 10, stagger: 0.1 });
    gsap.set(rule, { scaleX: 0, transformOrigin: '0 50%' });
    tl.to(rule, { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, from + 0.2);
    // the view's edges fade (see .lt-view): a row at rest sits between TOP and VIEW_H - 24, never under a fade
    const VIEW_H = 740, TOP = 38, GAP = 18, PAGE_GAP = 40;
    const view = K.box(root, 'lt-view', 0, 240, 1920, VIEW_H);
    const rows = K.box(view, 'lt-rows', 0, 0, 1920, 2000);
    const sv = K.svg(rows, 'lt-links', 1920, 2000);

    const date = (y, html) => K.box(rows, 'lt-date', C.date, y + 16, 220, null, html);
    /* A card holds one or more accounts of the same event, each with its own source tag. */
    const card = (x, y, w, accs) => {
      const c = K.box(rows, 'lt-card', x, y, w, null);
      const acc = accs.map(([lines, tag]) => {
        const e = K.el(c, 'lt-acc');
        return { e, ls: lines.map(t => K.el(e, 'lt-line', t)), tg: tag ? K.el(e, 'lt-tag', tag) : null };
      });
      return { c, acc, ls: acc[0].ls, tg: acc[0].tg };
    };
    const bottom = e => e.offsetTop + e.offsetHeight;
    /* Where a message should have arrived: red words beside the stop bar, no frame. */
    const slot = (x, w, ref, text, end) => K.box(rows, 'lt-slot' + (end ? ' end' : ''), x, ref.offsetTop, w, ref.offsetHeight, text);
    /* An undelivered message, as the sources state it: a solid red link from the CIA side that stops short of the FBI. */
    const X1 = C.cia + C.ciaW + 12, X2 = C.fbi - 12;
    function lost(y, at) {
      const p = drawn(sv, `M${X1},${y} L${X2 - 26},${y}`, 'ln red', at, { duration: 0.6 });
      const b = stopBar(sv, X2 - 12, y);
      fadeIn(b, at + 0.55, { duration: 0.2 });
      return [p, b];
    }
    /* Moves down the chain go by whole rows. Rows that leave the view fade out before the move starts, so none is
       ever cut by the fading edge; `keep` stays at the top, receded. */
    function turn(top, leave, keep, at, dur) {
      tl.to(leave, { opacity: 0, duration: 0.4, ease: 'power1.inOut' }, at - 0.4);
      if (keep.length) tl.to(keep, { opacity: 0.3, duration: 0.6 }, at - 0.4);
      tl.to(rows, { y: -(top - TOP), duration: dur, ease: 'power2.inOut' }, at);
    }

    // late 1999: the call and the name (Wright)
    let y = TOP;
    const d1 = date(y, '<b>1999 年底</b>');
    const r1 = card(C.cia, y, C.ciaW, [[['电话得知：马来西亚聚会', 'Khalid al-Mihdhar（米赫达尔）'], TAG_W]]);
    K.show(d1, T('lt.b4', '年底') - 0.6, { y: 10 });
    fadeIn(r1.c, T('lt.b4', '电话') - 0.5, { duration: 0.5 });
    K.show(r1.tg, T('lt.b4', '电话') - 0.3, { y: 6 });
    K.show(r1.ls[0], T('lt.b4', '电话') - 0.2, { y: 10 });
    K.show(r1.ls[1], T('lt.b4', '哈立德') - 0.1, { y: 10 });
    K.source(root, 'Lawrence Wright, The Agent, The New Yorker, 2006', T('lt.b4') + 0.2, T('lt.b4', 'end') + 0.1, ['lt.ag-nopass', 'lt.ag-passport']);

    // early January 2000: the passport in Dubai. Wright's account first; the Commission's account of the same
    // January event joins the same card when the narration reaches it, so it reads as one event told twice.
    y = bottom(r1.c) + GAP;
    const d2 = date(y, '<b>2000 年<br>1 月初</b><i>两种记述</i>');
    const r2 = card(C.cia, y, C.ciaW, [[['迪拜：复印护照，<span>内有美国签证</span>'], TAG_W], [['得知 Mihdhar 持美国签证'], TAG_C]]);
    const visa = r2.ls[0].querySelector('span'), [aW, aC] = r2.acc;
    const visa2 = mark(aC.ls[0], '持美国签证');
    K.show(d2.querySelector('b'), T('lt.b4', '一月初') - 0.5, { y: 10 });
    fadeIn(r2.c, T('lt.b4', '迪拜') - 0.4, { duration: 0.4 });
    K.show([aW.ls[0], aW.tg], T('lt.b4', '迪拜') - 0.2, { y: 10, stagger: 0.1 });
    gsap.set(visa, { autoAlpha: 0 });
    tl.to(visa, { autoAlpha: 1, duration: 0.3 }, T('lt.b4', '护照', 1) - 0.1);
    // the card holds Wright's account alone until the Commission's joins it (its short height is set once
    // every row has been laid out from the full one, at the end of this scene)
    const full = r2.c.offsetHeight;
    const join = T('lt.b5') - 0.2;
    tl.to(r2.c, { height: full, duration: 0.5, ease: 'power2.out' }, join - 0.15);
    K.show(aC.e, join, { y: 10 });
    K.show(d2.querySelector('i'), join + 0.2, { y: 6 });
    // The close-up: from the copied passport to the Commission's account of the same visa, the camera is on the two
    // CIA rows and the empty gap towards the FBI. The column heads would be cut by the close-up's top edge: they step out.
    const inA = T('lt.b4', '复印') - 0.3, inB = T('lt.b5', '签证') + 0.1;
    const aim = K.box(rows, 'lt-aim', C.date, r1.c.offsetTop - 8, C.fbi - C.date, r2.c.offsetTop + full - r1.c.offsetTop + 16);
    K.focus(aim, inA, inB, { zoom: 1.6, pad: 10 });
    tl.fromTo([hc, hf, rule], { opacity: 1 }, { opacity: 0, duration: 0.4, immediateRender: false }, inA - 0.9);
    tl.fromTo([hc, hf, rule], { opacity: 0 }, { opacity: 1, duration: 0.6, immediateRender: false }, inB + 0.5);
    // the visa in Wright's account, then the same visa in the Commission's
    lit(visa, T('lt.b4', '美国签证') - 0.15);
    settle(visa, T('lt.b5', '签证') - 0.2);
    lit(visa2, T('lt.b5', '签证') - 0.2);
    settle(visa2, T('lt.b5', '纳瓦夫') - 0.3);

    // March 2000: Los Angeles (Commission)
    y = bottom(r2.c) + GAP;
    const d3 = date(y, '<b>2000 年 3 月</b>');
    const r3 = card(C.cia, y, C.ciaW, [[['得知 Nawaf al-Hazmi（哈兹米）', '1 月 15 日飞抵洛杉矶'], TAG_C]]);
    K.show(d3, T('lt.b5', '三月') + 0.05, { y: 10 });
    fadeIn(r3.c, T('lt.b5', '纳瓦夫') - 0.4, { duration: 0.4 });
    K.show([r3.ls[0], r3.tg], T('lt.b5', '纳瓦夫') - 0.3, { y: 10 });
    K.show(r3.ls[1], T('lt.b5', '洛杉矶') - 0.6, { y: 10 });
    const s2 = slot(C.fbi, C.fbiW, r2.c, '未送到'), s3 = slot(C.fbi, C.fbiW, r3.c, '未送到');
    const sent = T('lt.b5', '没有送到') - 0.4;
    const l2 = lost(midY(r2.c), sent), l3 = lost(midY(r3.c), sent + 0.15);
    K.show([s2, s3], sent + 0.5, { y: 0, duration: 0.4, stagger: 0.15 });

    // the State Department watchlist
    y = bottom(r3.c) + GAP;
    const wl = K.box(rows, 'lt-watch', C.cia, y, C.fbi + C.fbiW - C.cia, null, '<b>国务院观察名单（TIPOFF）</b><span>两人均未列入</span>');
    K.show(wl, T('lt.b6', '观察名单') - 0.9, { y: 10 });
    // the four rows fit the view without a move
    if (bottom(wl) > VIEW_H - 24) console.warn('lt-chain: the watchlist row reaches the fading edge of the view');
    K.source(root, 'The 9/11 Commission Report, 2004, pp. 181–182; ch. 6, n. 44', T('lt.b5') + 0.2, T('lt.b6', 'end') + 0.1, ['lt.rep-visa-not-shared', 'lt.rep-passport-jan2000']);

    // 11 June 2001, New York: two versions, each with its own source
    y = bottom(wl) + PAGE_GAP;
    const d4 = date(y, '<b>2001 年<br>6 月 11 日</b>');
    const meet = K.box(rows, 'lt-meet', C.cia, y, C.fbi + C.fbiW - C.cia, null, '<b>纽约会议</b><span>：出示马来西亚聚会照片</span>');
    y = bottom(meet) + GAP;
    const r4a = card(C.cia, y, C.ciaW, [[['分析员：知道签证与洛杉矶行程'], TAG_C]]);
    const s4a = slot(C.fbi, C.fbiW, r4a.c, '未被问及 · 未主动说明');
    y = bottom(r4a.c) + GAP;
    const r4b = card(C.fbi, y, C.fbiW, [[['探员索要出生日期与护照号'], TAG_W]]);
    const s4b = slot(C.cia, C.ciaW, r4b.c, '未给', true);
    // the view moves down to June; the March row and the watchlist stay at the top, receded
    const pageA = [d1, r1.c, d2, r2.c, s2, ...l2], keepA = [d3, r3.c, s3, ...l3, wl];
    turn(r3.c.offsetTop, pageA, keepA, T('lt.b7') - 0.4, 1.3);
    K.show(d4, T('lt.b7') + 0.1, { y: 10 });
    const [mb, ms] = meet.children;
    fadeIn(meet, T('lt.b7', '纽约') - 0.4);
    K.show(mb, T('lt.b7', '纽约') - 0.3, { y: 10 });
    K.show(ms, T('lt.b7', '马来西亚') - 0.2, { y: 10 });
    K.show(r4a.c, T('lt.b7', '分析员') - 0.3, { y: 12 });
    // what the analyst knew: the Los Angeles row, receded above, comes back up while it is named
    tl.to([d3, r3.c], { opacity: 1, duration: 0.4 }, T('lt.b7', '洛杉矶') - 0.5);
    tl.to([d3, r3.c], { opacity: 0.3, duration: 0.5 }, T('lt.b7', '没人问') - 0.3);
    const l4a = lost(midY(r4a.c), T('lt.b7', '没人问') - 0.5);
    K.show(s4a, T('lt.b7', '没人问') - 0.1, { y: 0, duration: 0.4 });
    K.show(r4b.c, T('lt.b7', '探员') - 0.3, { y: 12 });
    // the CIA did not give what the FBI asked for: the link runs from the CIA's empty answer and stops short of the FBI
    K.show(s4b, T('lt.b7', '没给') - 0.5, { y: 0, duration: 0.4 });
    const l4b = lost(midY(r4b.c), T('lt.b7', '没给') - 0.3);
    K.source(root, 'The 9/11 Commission Report, 2004, p. 269 · Lawrence Wright, The Agent, The New Yorker, 2006', T('lt.b7') + 0.3, T('lt.b7', 'end') + 0.1, ['lt.rep-dave', 'lt.rep-june11-photos', 'lt.ag-june11']);

    // late August 2001: the search starts, and the wall
    y = bottom(r4b.c) + PAGE_GAP;
    const d5 = date(y, '<b>2001 年<br>8 月下旬</b>');
    const r5 = card(C.fbi, y, C.fbiW, [[['开始寻找两人'], TAG_C]]);
    y = bottom(r5.c) + GAP;
    const r5b = card(C.fbi, y, C.fbiW, [[['分析员邮件', '<span class="lt-wall">“墙”</span>：刑事侦查人员不能参与'], TAG_W]]);
    const y6 = bottom(r5b.c) + PAGE_GAP;
    // the view follows the chain down to August and September; the June request the CIA did not answer stays on top
    turn(r4b.c.offsetTop, [...keepA, d4, meet, r4a.c, s4a, ...l4a], [r4b.c, s4b, ...l4b], T('lt.b8') - 0.3, 1.1);
    K.show(d5, T('lt.b8') + 0.1, { y: 10 });
    K.show(r5.c, T('lt.b8', '开始') - 0.4, { y: 12 });
    K.show(r5b.c, T('lt.b8', '分析员') - 0.3, { y: 12 });
    // the line stays until the Cole agent's reply below has left: the card has no locator of its own
    K.source(root, 'The 9/11 Commission Report, 2004, pp. 270–272 · Lawrence Wright, The Agent, The New Yorker, 2006', T('lt.b8') + 0.3, T('lt.b9') - 0.7, ['lt.rep-late-august', 'lt.ag-email', 'lt.rep-email', 'lt.rep-luck']);
    // the Cole agent's reply, over the chain; the camera comes in on the letter and goes back to the chain after it
    const chain = [hc, hf, rule, view];
    const rp = T('lt.b8', '回信') - 0.5;
    tl.to(chain, { opacity: 0, duration: 0.6 }, rp);
    const who = K.box(root, 'lt-who', 260, 300, null, null, '科尔号（Cole）案探员的回信 · 2001 年 8 月');
    const rq = K.quote(root, 'lt.rep-email', 260, 370, 1400, { size: 44 });
    const die = [mark(rq.en, 'someday someone will die'), mark(rq.zh, '总有一天会有人死')];
    const pub = [mark(rq.en, 'the public will not understand'), mark(rq.zh, '公众都不会明白')];
    K.show([who, rq.root], rp + 0.3, { y: 14, stagger: 0.12 });
    lit(die, T('lt.b8', '会有人死') - 0.3);
    settle(die[0], T('lt.b8', '公众') - 0.3); settle(die[1], T('lt.b8', '公众') - 0.3, INK2);
    lit(pub, T('lt.b8', '公众') - 0.3);
    const back = T('lt.b9') - 0.7;
    tl.to([who, rq.root], { autoAlpha: 0, duration: 0.5 }, back);
    tl.to(chain, { opacity: 1, duration: 0.6 }, T('lt.b9') - 0.5);
    // while the letter is up, the August search recedes: on 11 September the last row stands alone
    tl.fromTo([d5, r5.c, r5b.c], { opacity: 1 }, { opacity: 0.35, duration: 0.4, immediateRender: false }, rp + 2);
    // the chain manages its own view (it moves by whole pages), so the camera holds the full stage on it
    guide(root, 200, 132, 1520, 240 + VIEW_H - 132, from, rp + 0.3);
    guide(root, 200, 132, 1520, 240 + VIEW_H - 132, back);

    // 11 September 2001
    const d6 = date(y6, '<b>2001 年<br>9 月 11 日</b>');
    const r6 = K.box(rows, 'lt-meet plain', C.cia, y6, C.fbi + C.fbiW - C.cia, null,
      '<b>Mihdhar 与 Hazmi</b><span> 在华盛顿杜勒斯机场登上美国航空 77 号航班</span><i class="lt-tag">' + TAG_C + '</i>');
    K.show(d6, T('lt.b9') + 0.05, { y: 10 });
    const [r6a, r6b, r6c] = r6.children;
    fadeIn(r6, T('lt.b9', '米赫达尔') - 0.4);
    K.show(r6a, T('lt.b9', '米赫达尔') - 0.3, { y: 10 });
    K.show([r6b, r6c], T('lt.b9', '登上') - 0.3, { y: 10, stagger: 0.1 });
    K.source(root, 'The 9/11 Commission Report, 2004, p. 3', T('lt.b9') + 0.2, to, ['lt.flight77']);
    gsap.set(r2.c, { height: full - aC.e.offsetHeight - 9, overflow: 'hidden' });
  });

  // ---------------------------------------------------------------- 几种解释
  Film.scene('lt-reasons', T('lt.b10') - 0.5, T('lt.b16') - 0.1, ({ root, from, to }) => {
    open(root, '几种解释', from);
    close(root, to);
    const cols = SRC.map((s, i) => {
      const c = K.box(root, 'lt-col', 200 + i * 390, 180, 350, 700);
      const h = K.el(c, 'lt-col-head', `<div class="lt-src-name">${s.name}</div><div class="lt-src-kind">${s.kind}</div>`);
      c.list = K.el(c, 'lt-col-list');
      c.head = h;
      return c;
    });
    K.show(cols.map(c => c.head), T('lt.b10') + 0.1, { y: 16, stagger: 0.12 });
    const item = (c, headText, subs, cls) => {
      const e = K.el(c.list, 'lt-item ' + (cls || ''), (headText ? `<b>${headText}</b>` : '') + (subs || []).map(s => `<span>${s}</span>`).join(''));
      return { e, b: e.querySelector('b'), s: Array.from(e.querySelectorAll('span')) };
    };
    // the column being spoken about is at full strength, the others recede
    const spot = (i, at) => cols.forEach((c, j) => tl.to(c, { opacity: j === i ? 1 : 0.3, duration: 0.5 }, at));

    // Wright
    const [cw, cc, ci, cs] = cols;
    spot(0, T('lt.b11') - 0.3);
    const w1 = item(cw, '使命不同', ['FBI：情报为定罪', 'CIA：情报即目标', '多年争地盘']);
    const w2 = item(cw, '个人恩怨');
    const w3 = item(cw, '威胁信息过多', ['未看出这一条的分量'], 'pick');
    const w3t = K.el(w3.e, 'lt-pick', 'Wright 认为最合理');
    w3.e.prepend(w3t);
    K.show(w1.b, T('lt.b11', '使命') - 0.3, { y: 10 });
    K.show(w1.s[0], T('lt.b11', '收集') - 0.3, { y: 8 });
    K.show(w1.s[1], T('lt.b11', '情报本身') - 0.4, { y: 8 });
    K.show(w1.s[2], T('lt.b11', '争地盘') - 0.3, { y: 8 });
    K.show(w2.b, T('lt.b11', '恩怨') - 0.6, { y: 10 });
    K.show(w3t, T('lt.b11', '最说得通') - 0.2, { y: 8 });
    K.show(w3.b, T('lt.b11', '威胁') - 0.3, { y: 10 });
    K.show(w3.s[0], T('lt.b11', '没看出') - 0.2, { y: 8 });
    // each column's key phrase is lit while it is spoken and keeps its rule: by b15 the four are marked side by side
    blue(w3t, T('lt.b11', '最说得通') - 0.2);
    lit(w3.b, T('lt.b11', '威胁') - 0.3);
    settle(w3.b, T('lt.b12') - 0.3); unblue(w3t, T('lt.b12') - 0.3, INK2);
    K.source(root, 'Lawrence Wright, The Agent, The New Yorker, 2006', T('lt.b11') + 0.2, T('lt.b11', 'end') + 0.1, ['lt.ag-mission', 'lt.ag-animus', 'lt.ag-overload']);

    // the Commission
    spot(1, T('lt.b12') - 0.3);
    const c1 = item(cc, '1995 年的共享程序', ['遭误解、误用']);
    const c2 = item(cc, '“墙”', ['名称有误导性', '实为层层叠加的障碍']);
    const c3 = item(cc, '同一小组也被隔开');
    const c4 = item(cc, '副局长的提醒', ['共享过多，可能断送前程']);
    K.show(c1.b, T('lt.b12', '追到') - 0.2, { y: 10 });
    K.show(c1.s[0], T('lt.b12', '误解') - 0.3, { y: 8 });
    K.show(c2.b, T('lt.b12', '墙') - 0.3, { y: 10 });
    K.show(c2.s[0], T('lt.b12', '误导性') - 0.4, { y: 8 });
    K.show(c2.s[1], T('lt.b12', '障碍') - 0.6, { y: 8 });
    lit(c2.b, T('lt.b12', '墙') - 0.3);
    settle(c2.b, T('lt.b12', '同一个小组') - 0.3);
    K.show(c3.b, T('lt.b12', '同一个小组') - 0.3, { y: 10 });
    K.show(c4.b, T('lt.b12', '副局长') - 0.3, { y: 10 });
    K.show(c4.s[0], T('lt.b12', '共享得太多') - 0.3, { y: 8 });
    K.source(root, 'The 9/11 Commission Report, 2004, p. 79', T('lt.b12') + 0.2, T('lt.b12', 'end') + 0.1, ['lt.rep-wall-misapplied', 'lt.rep-samesquad', 'lt.rep-bryant']);

    // the CIA Inspector General
    spot(2, T('lt.b13') - 0.3);
    const i1 = item(ci, '流程执行差', ['不在于不愿共享']);
    const i2 = item(ci, '一条消息未发出', ['本该发给 FBI', '看来因格式不对或需修改']);
    K.show(i1.b, T('lt.b13', '出在') - 0.2, { y: 10 });
    K.show(i1.s[0], T('lt.b13', '不愿意') - 0.4, { y: 8 });
    lit(i1.s[0], T('lt.b13', '不愿意') - 0.4);
    settle(i1.s[0], T('lt.b14') - 0.3, INK2);
    K.show([i2.b, i2.s[0]], T('lt.b13', '本该') - 0.3, { y: 10, stagger: 0.12 });
    K.show(i2.s[1], T('lt.b13', '格式') - 0.3, { y: 8 });
    K.source(root, 'CIA OIG, Executive Summary, 2005, pp. xv–xvi', T('lt.b13') + 0.2, T('lt.b13', 'end') + 0.1, ['lt.ig-notreluctance', 'lt.ig-unsent']);

    // Ali Soufan
    spot(3, T('lt.b14') - 0.3);
    const s0 = item(cs, null, ['当年在 FBI 追查此线'], 'lead');
    const s1 = item(cs, '不是机构的问题');
    const s2 = item(cs, '个别人决定不共享');
    const s3 = item(cs, '他至今不知原因');
    K.show(s0.s[0], T('lt.b14', '追查') - 0.3, { y: 8 });
    K.show(s1.b, T('lt.b14', '机构') - 0.4, { y: 10 });
    K.show(s2.b, T('lt.b14', '个别人') - 0.3, { y: 10 });
    lit(s2.b, T('lt.b14', '个别人') - 0.3);
    settle(s2.b, T('lt.b15') - 0.2);
    K.show(s3.b, T('lt.b14', '不知道') - 0.3, { y: 10 });
    K.source(root, 'Ali Soufan, The Looming Tower panel, 9/11 Memorial & Museum, 2018', T('lt.b14') + 0.2, T('lt.b14', 'end') + 0.1, ['lt.eye-soufan-individuals', 'lt.eye-soufan-queries']);

    // four accounts side by side, each with its marked phrase; then the Commission's own caution about the labels
    const out = T('lt.b15', '委员会') - 0.7;
    cols.forEach(c => tl.to(c, { opacity: 1, duration: 0.5 }, T('lt.b15') - 0.2));
    tl.to(cols, { autoAlpha: 0, y: -24, duration: 0.6, stagger: 0.05 }, out);
    guide(root, 200, 180, 1520, bottomOf(cols.map(c => c.list)), from, out + 0.3);

    // the three labels, then the quote; the labels leave on "symptoms" and the camera comes in on the quote
    const CW = 300, CG = 30, cx0 = 960 - (3 * CW + 2 * CG) / 2;
    const chips = ['观察名单', '信息共享', '连点成线'].map((t, i) => K.box(root, 'lt-chip', cx0 + i * (CW + CG), 250, CW, 84, t));
    K.show(chips[0], T('lt.b15', '观察名单') - 0.3, { y: 10 });
    K.show(chips[1], T('lt.b15', '信息共享') - 0.3, { y: 10 });
    K.show(chips[2], T('lt.b15', '连点成线') - 0.3, { y: 10 });
    const q = K.quote(root, 'lt.rep-symptoms', 460, 400, 1000, { size: 46 });
    const dis = [mark(q.en, 'not the disease'), mark(q.zh, '不是病根')];
    K.show(q.root, T('lt.b15', '委员会') - 0.1, { y: 16 });
    const sym = T('lt.b15', '症状');
    tl.to(chips, { autoAlpha: 0, y: -12, duration: 0.5, stagger: 0.04 }, sym - 0.9);
    guide(root, 460, 250, 1000, q.root.offsetTop + q.root.offsetHeight - 250, out + 0.3, sym - 0.9);
    K.focus(q.root, sym - 0.3, to, { zoom: 1.5, pad: 60 });
    lit(dis, T('lt.b15', '病根') - 0.3);
    K.source(root, 'The 9/11 Commission Report, 2004, p. 400', T('lt.b15', '委员会'), to, ['lt.rep-symptoms']);
  });

  // ---------------------------------------------------------------- 病根
  Film.scene('lt-root', T('lt.b16') - 0.5, T('lt.b19') - 0.1, ({ root, from, to }) => {
    open(root, '病根', from);
    close(root, to);
    const cover = K.figure(root, 'lt.911-report-cover', 200, 196, 400, 563, { pos: '50% 0%' });
    K.show(cover, T('lt.b16') - 0.1, { y: 16, duration: 0.8 });
    const X = 680, W = 1040;
    // one frame for the chapter: the cover stays on the left while the right side changes
    guide(root, 200, 196, 1520, 728, from);

    // no one in charge of the case
    const q1 = K.quote(root, 'lt.rep-noowner', X, 196, W, { size: 38 });
    const nobody = [mark(q1.en, 'no one was firmly in charge'), mark(q1.zh, '没有人牢牢负责')];
    K.show(q1.root, T('lt.b16', '病根') - 0.2, { y: 14 });
    lit(nobody, T('lt.b16', '没有人') - 0.2);
    const list = K.box(root, 'lt-nobody', X, 600, W, null,
      '<b>无人承担</b><span>从政府各处调取情报</span><span>跨机构分派责任</span><span>跟踪进展</span><span>障碍上报到能解决的一级</span>');
    const [lb, ...li] = list.children;
    K.show(lb, T('lt.b16', '没有一个人') - 0.3, { y: 8 });
    [['调来', 0.4], ['跨机构', 0.3], ['盯着', 0.3], ['往上报', 0.4]].forEach(([w, d], i) => K.show(li[i], T('lt.b16', w) - d, { y: 8 }));
    K.source(root, 'The 9/11 Commission Report, 2004, p. 400', T('lt.b16') + 0.3, T('lt.b16', 'end') + 0.1, ['lt.rep-noowner']);
    tl.to([q1.root, list], { autoAlpha: 0, y: -16, duration: 0.5, stagger: 0.05 }, T('lt.b17') - 0.4);

    // specialists without an attending physician
    const doc = K.box(root, 'lt-doctor', X + 280, 196, 480, 124, '<b>主治医生</b><span>缺位</span>');
    const specs = [0, 1, 2, 3].map(i => K.box(root, 'lt-spec', X + i * 265, 380, 245, null,
      '<b>专科医生</b><span>开检查</span><span>看症状</span><span>开药</span>'));
    K.show(specs.map(s => s.querySelector('b')), T('lt.b17', '专科医生') - 0.4, { y: 10, stagger: 0.08 });
    specs.forEach((s, i) => { gsap.set(s, { borderColor: 'rgba(13,24,38,0)' }); tl.to(s, { borderColor: INK, duration: 0.4 }, T('lt.b17', '机构') - 0.4 + i * 0.08); });
    ['开检查', '症状', '开药'].forEach((w, k) => K.show(specs.map(s => s.querySelectorAll('span')[k]), T('lt.b17', w) - 0.25, { y: 6, stagger: 0.05 }));
    K.show(doc, T('lt.b17', '主治医生') - 0.3, { y: 12 });
    const q2 = K.quote(root, 'lt.rep-physician', X, 680, W, { size: 38 });
    K.show(q2.root, T('lt.b17', '缺的') - 0.2, { y: 12 });
    const out17 = T('lt.b18') - 0.4;
    K.source(root, 'The 9/11 Commission Report, 2004, p. 353', T('lt.b17') + 0.3, out17, ['lt.rep-physician']);
    tl.to([doc, ...specs, q2.root], { autoAlpha: 0, y: -16, duration: 0.5, stagger: 0.03 }, out17);

    // skill and luck, beside the cover: the date the search could have begun, then what it would still have needed
    const q3 = K.quote(root, 'lt.rep-luck', X, 290, W, { size: 42 });
    const early = [mark(q3.en, 'as early as August 23'), mark(q3.zh, '早在 8 月 23 日')];
    const luck = [mark(q3.en, 'luck as well as skill'), mark(q3.zh, '既需要技巧，也需要运气')];
    K.show(q3.root, T('lt.b18') + 0.1, { y: 14 });
    lit(early, T('lt.b18', '八月') - 0.3);
    settle(early[0], T('lt.b18', '技巧') - 0.3); settle(early[1], T('lt.b18', '技巧') - 0.3, INK2);
    lit(luck, T('lt.b18', '技巧') - 0.3);
    K.source(root, 'The 9/11 Commission Report, 2004, p. 272', T('lt.b18') + 0.3, to, ['lt.rep-luck']);
  });

  // ---------------------------------------------------------------- 需要知道
  Film.scene('lt-need', T('lt.b19') - 0.5, T('lt.b21') - 0.1, ({ root, from, to }) => {
    open(root, '“需要知道”原则', from);
    close(root, to);
    const sec = K.box(root, 'lt-label', 200, 190, 1520, null, '委员会报告 · 13.3 信息共享');
    K.show(sec, T('lt.b19') + 0.1, { y: 8 });
    const q = K.quote(root, 'lt.rep-needtoknow', 200, 250, 1520, { size: 42 });
    const ntk = [mark(q.en, 'need to know'), mark(q.zh, '需要知道')];
    K.show(q.root, T('lt.b19') + 0.3, { y: 14 });
    lit(ntk, T('lt.b19', '需要知道') - 0.3);
    // the incentives, as the Commission lists them
    const share = K.box(root, 'lt-ledger', 200, 580, 740, null, '<b>共享</b><span><i>风险</i>刑事、民事、内部处分</span><span><i>回报</i>很少</span>');
    const keep = K.box(root, 'lt-ledger', 980, 580, 740, null, '<b>不共享</b><span><i>处罚</i>没有</span>');
    const [sb, sr, sw] = share.children, [kb, kp] = keep.children;
    const none = mark(kp, '没有');
    fadeIn(share, T('lt.b19', '没有动力') - 0.4, { duration: 0.4 });
    K.show(sb, T('lt.b19', '没有动力') - 0.3, { y: 10 });
    K.show(sr, T('lt.b19', '风险') - 0.4, { y: 8 });
    K.show(sw, T('lt.b19', '好处') - 0.4, { y: 8 });
    fadeIn(keep, T('lt.b19', '不共享') - 0.4, { duration: 0.4 });
    K.show([kb, kp], T('lt.b19', '不共享') - 0.3, { y: 10, stagger: 0.12 });
    settle(ntk[0], T('lt.b19', '不共享') - 0.3); settle(ntk[1], T('lt.b19', '不共享') - 0.3, INK2);
    lit(none, T('lt.b19', '受罚') - 0.4);
    K.source(root, 'The 9/11 Commission Report, 2004, p. 417', T('lt.b19') + 0.3, T('lt.b19', 'end') + 0.1, ['lt.rep-needtoknow', 'lt.rep-incentive']);
    const away = T('lt.b20') - 0.5;
    tl.to([sec, q.root, share, keep], { autoAlpha: 0, y: -16, duration: 0.5, stagger: 0.04 }, away);
    guide(root, 200, 190, 1520, bottomOf([share, keep]) - 190, T('lt.b19'), away);

    // the network the Commission proposed
    const sv = K.svg(root, 'lt-net');
    const node = (x, y, w, h, html, cls) => K.box(root, 'lt-node ' + (cls || ''), x, y, w, h, html);
    const R = node(200, 470, 260, 120, '情报报告');
    const D = node(600, 330, 300, 110, '数据本身');
    const M = node(600, 620, 300, 110, '来源与手段', 'held');
    const U = node(1420, 330, 300, 110, '各机构的用户');
    const G = node(1060, 620, 280, 110, '规则：是否提供');
    const A = node(1060, 820, 280, 90, '审计记录');
    const lab = (x, y, w, t, cls) => K.box(root, 'lt-netlab ' + (cls || ''), x, y, w, null, t);
    const lShare = lab(930, 330, 470, '先发共享范围最广的版本');
    const lAsk = lab(1590, 500, 220, '再查询细节');
    const lData = lab(600, 452, 420, '权限设在数据层', 'blue');
    const lNet = lab(1150, 950, 600, '权限不设在整个网络', 'dim right');
    const e1 = [K.path(sv, 'M460,510 L530,510 L530,385 L588,385'), head(sv, 590, 385, 'r', 'ln')];
    const e2 = [K.path(sv, 'M460,550 L530,550 L530,675 L588,675'), head(sv, 590, 675, 'r', 'ln')];
    const e3 = [K.path(sv, 'M900,385 L1408,385'), head(sv, 1410, 385, 'r', 'ln')];
    const e4 = [K.path(sv, 'M1570,440 L1570,675 L1352,675'), head(sv, 1350, 675, 'l', 'ln')];
    const e5 = [K.path(sv, 'M1060,675 L912,675'), head(sv, 910, 675, 'l', 'ln')];
    const e6 = [K.path(sv, 'M1200,730 L1200,808'), head(sv, 1200, 810, 'd', 'ln')];
    const edge = (e, at, dur) => { K.draw(e[0], at, { duration: dur || 0.6 }); fadeIn(e[1], at + (dur || 0.6) - 0.1, { duration: 0.2 }); };
    K.show(R, away + 0.3, { y: 12 });
    edge(e1, T('lt.b20', '数据本身') - 1.0);
    K.show(D, T('lt.b20', '数据本身') - 0.3, { y: 10 });
    edge(e2, T('lt.b20', '来源') - 0.7);
    K.show(M, T('lt.b20', '来源') - 0.3, { y: 10 });
    K.show(U, T('lt.b20', '先发') - 0.5, { y: 10 });
    edge(e3, T('lt.b20', '先发') - 0.3, 0.8);
    K.show(lShare, T('lt.b20', '共享得最广') - 0.4, { y: 8 });
    edge(e4, T('lt.b20', '查询') - 0.9, 0.8);
    K.show(lAsk, T('lt.b20', '查询') - 0.5, { y: 8 });
    K.show(G, T('lt.b20', '规则') - 0.3, { y: 10 });
    edge(e5, T('lt.b20', '给不给') - 0.2, 0.4);
    edge(e6, T('lt.b20', '留下记录') - 0.6, 0.4);
    K.show(A, T('lt.b20', '留下记录') - 0.3, { y: 10 });
    // permissions on the data: the data node turns blue; not on the whole network: its outline is drawn round everything
    tl.to(D, { borderColor: BLUE, color: BLUE, duration: 0.4 }, T('lt.b20', '权限') - 0.2);
    K.show(lData, T('lt.b20', '权限') - 0.1, { y: 8 });
    const net = K.path(sv, 'M180,290 L1740,290 Q1750,290 1750,300 L1750,930 Q1750,940 1740,940 L180,940 Q170,940 170,930 L170,300 Q170,290 180,290', 'ln lt-netline');
    K.draw(net, T('lt.b20', '整个网络') - 0.6, { duration: 1.2 });
    K.show(lNet, T('lt.b20', '整个网络') - 0.2, { y: 8 });
    guide(root, 170, 290, 1580, 700, away);
    K.source(root, 'The 9/11 Commission Report, 2004, pp. 417–418', T('lt.b20') + 0.3, to, ['lt.rep-network']);
  });

  // ---------------------------------------------------------------- 回到驻场
  // the body's last scene holds under whatever comes next (the outro, or the next card in the compilation)
  Film.scene('lt-field', T('lt.b21') - 0.5, u.bodyEnd + Series.HOLD, ({ root, from, to }) => {
    open(root, '回到驻场', from);
    // Qureshi on Palantir's controls: a compact block the camera comes in on, so the four controls read large
    const who = K.box(root, 'lt-qhead', 200, 190, null, null, '<b>Nabeel Qureshi</b><span>回忆 Palantir 早年 · 2024</span>');
    const why = K.box(root, 'lt-qline', 200, 320, null, null, '数据之争：部分出于真实的安全顾虑');
    const how = K.box(root, 'lt-qline', 200, 396, null, null, '对策：数据整合的每一层都加控制');
    K.show(who, T('lt.b21') + 0.1, { y: 12 });
    K.show(why, T('lt.b21', '争数据') - 0.4, { y: 10 });
    K.show(how, T('lt.b21', '每一层') - 0.4, { y: 10 });
    const QI = ['角色权限', '行级规则', '安全标记', '审计记录'];
    const QW = 290, QG = 26, QY = 520, QH = 84;
    const qi = QI.map((t, i) => K.box(root, 'lt-ctl', 200 + i * (QW + QG), QY, QW, QH, t));
    [['角色', 0.4], ['每一行', 0.4], ['安全标记', 0.3], ['审计', 0.4]].forEach(([w, d], i) => K.show(qi[i], T('lt.b21', w) - d, { y: 12 }));
    K.source(root, 'Nabeel Qureshi, Reflections on Palantir, 2024', T('lt.b21') + 0.3, T('lt.b21', 'end') + 0.1, ['lt.qur-controls']);
    const at22 = T('lt.b22');
    guide(root, 200, 190, 4 * QW + 3 * QG, QY + QH - 190, from, at22 - 0.2);

    // set beside the Commission's design: this series' comparison. The camera pulls back as Qureshi's four
    // controls move into the right column: down to their rows first, then across, so they never cross.
    const LX = 200, RX = 1080, IW = 640, IY = 330, STEP = 84;
    tl.to([who, why, how], { autoAlpha: 0, y: -16, duration: 0.5, stagger: 0.04 }, at22 - 0.6);
    const label = K.box(root, 'lt-ours', 200, 176, 1520, null, '<i></i>本系列的读法 · 并置对照');
    const frame = K.box(root, 'lt-cmp-frame', 170, 226, 1580, 540);
    const hl = K.box(root, 'lt-cmp-head', LX, 252, IW, null, '九一一委员会 · 网络设计');
    const hr = K.box(root, 'lt-cmp-head', RX, 252, IW, null, 'Nabeel Qureshi · Palantir 的控制');
    const CI = ['数据与来源、手段拆开', '先发共享范围最广的版本', '查询由规则决定是否提供', '权限设在数据层', '每次查询留下审计记录'];
    const ci = CI.map((t, i) => K.box(root, 'lt-ctl', LX, IY + i * STEP, IW, 68, t));
    gsap.set(frame, { autoAlpha: 0 });
    tl.to(frame, { autoAlpha: 1, duration: 0.5 }, at22 - 0.2);
    K.show([label, hl, hr], at22 - 0.1, { y: 8, stagger: 0.06 });
    K.show(ci, at22 + 0.9, { y: 12, stagger: 0.07 });
    // Each lands on a row: 行级规则 beside 权限设在数据层, 审计记录 beside 每次查询留下审计记录.
    const ROW = [1, 3, 2, 4];
    const rowY = r => IY + r * STEP;
    qi.forEach((e, i) => {
      tl.to(e, { y: rowY(ROW[i]) - e.offsetTop, height: 68, duration: 0.6, ease: 'power2.inOut' }, at22 - 0.35);
      tl.to(e, { x: RX - e.offsetLeft, width: IW, duration: 0.9, ease: 'power2.inOut' }, at22 + 0.25);
    });
    // the only two overlaps, straight across
    const sv = K.svg(root, 'lt-cmp');
    const pairs = [[ci[3], qi[1], '权限'], [ci[4], qi[3], '查看']];
    const rest = [ci[0], ci[1], ci[2], qi[0], qi[2]];
    tl.to(rest, { opacity: 0.35, duration: 0.5 }, T('lt.b22', '相近') - 0.2);
    pairs.forEach(([l, r, w]) => {
      const at = T('lt.b22', w) - 0.3, y = rowY(ROW[qi.indexOf(r)]) + 34;
      tl.to([l, r], { borderColor: BLUE, color: BLUE, duration: 0.4 }, at);
      drawn(sv, `M${LX + IW + 10},${y} L${RX - 10},${y}`, 'ln blue dash', at + 0.1, { duration: 0.7 });
    });
    // what the sources say about a link between the two; Qureshi's own words are credited on the source line
    const lim = [['设计来源', '无一手材料', '没有一手材料', ['lt.inf-parallel']],
      ['发书用意', '无材料提到信息共享', '也没有', ['lt.inf-parallel', 'lt.qur-reason']],
      ['Qureshi 的理由', '这段背景有用', '说的只是', ['lt.qur-reason', 'ov.qureshi_why_looming_tower']]]
      .map(([k, v, w, ids], i) => {
        const e = K.box(root, 'lt-lim', 200, 800 + i * 56, 1520, null, `<b>${k}</b><span>${v}</span>`);
        ids.forEach(id => Film.claim(id));
        e.dataset.claim = ids.join(' ');
        K.show(e, T('lt.b22', w) - 0.3, { y: 8 });
        return e;
      });
    const out22 = T('lt.b23') - 0.5;
    K.source(root, '本系列的对照：The 9/11 Commission Report, 2004, pp. 417–418 · Nabeel Qureshi, Reflections on Palantir, 2024', at22 + 0.3, out22,
      ['lt.inf-parallel', 'lt.rep-network', 'lt.qur-controls', 'lt.qur-reason', 'ov.qureshi_why_looming_tower']);
    tl.to([label, frame, hl, hr, ...ci, ...qi, sv, ...lim], { autoAlpha: 0, duration: 0.5 }, out22);
    guide(root, 170, 176, 1580, bottomOf(lim) - 176, at22 - 0.2, out22);

    // the closing reading
    const ours = K.box(root, 'lt-ours', 200, 176, 1520, null, '<i></i>本系列的读法');
    const box = K.box(root, 'lt-org', 200, 226, 1520, 560);
    const org = K.box(root, 'lt-org-lab', 240, 250, 600, null, '大组织');
    const holder = K.box(root, 'lt-person', 300, 400, 440, 170, '<b>持有信息的人</b><span>最要紧的信息</span>');
    const needer = K.box(root, 'lt-person', 1180, 400, 440, 170, '<b>最需要它的人</b>');
    const sv2 = K.svg(root, 'lt-read');
    const at23 = T('lt.b23');
    const remind = K.box(root, 'lt-remind', 200, 430, 1520, null, '给新人的提醒');
    K.show(ours, at23, { y: 8 });
    K.show(remind, at23 + 0.6, { y: 16, duration: 0.8 });
    tl.to(remind, { autoAlpha: 0, y: -16, duration: 0.5 }, T('lt.b23', '大组织') - 0.8);
    gsap.set(box, { autoAlpha: 0 });
    tl.to(box, { autoAlpha: 1, duration: 0.5 }, T('lt.b23', '大组织') - 0.5);
    K.show(org, T('lt.b23', '大组织') - 0.3, { y: 8 });
    K.show(holder.querySelector('b'), T('lt.b23', '某个人') - 0.4, { y: 10 });
    fadeIn(holder, T('lt.b23', '最要紧') - 0.4, { duration: 0.4 });
    K.show(holder.querySelector('span'), T('lt.b23', '最要紧') - 0.3, { y: 8 });
    const lostY = 455;
    // inside the series' reading the undelivered stub is dashed like the link below it; red still marks the failure
    drawn(sv2, `M752,${lostY} L940,${lostY}`, 'ln red dash', T('lt.b23', '没有送到') - 0.3, { duration: 0.6 });
    const bar = stopBar(sv2, 954, lostY);
    fadeIn(bar, T('lt.b23', '没有送到') + 0.25, { duration: 0.2 });
    K.show(needer, T('lt.b23', '最需要') - 0.3, { y: 10 });
    const linkY = 525;
    drawn(sv2, `M752,${linkY} L1166,${linkY}`, 'ln blue dash', T('lt.b23', '接起来') - 0.6, { duration: 0.8 });
    const arr = head(sv2, 1168, linkY, 'r', 'ln blue');
    fadeIn(arr, T('lt.b23', '接起来') + 0.15, { duration: 0.2 });
    const lJoin = K.box(root, 'lt-readlab', 752, 560, 414, null, '接通信息');
    const gate = K.box(root, 'lt-gate', 930, linkY - 22, 56, 44);
    const lGate = K.box(root, 'lt-readlab', 752, 616, 414, null, '管控查看权限');
    K.show(lJoin, T('lt.b23', '接起来') - 0.3, { y: 8 });
    K.show(gate, T('lt.b23', '管好') - 0.3, { y: 0, scale: 0.6, duration: 0.4 });
    K.show(lGate, T('lt.b23', '管好') - 0.2, { y: 8 });
    const fde = K.box(root, 'lt-fde', 200, 830, 1520, null, 'FDE（驻客户现场的工程师）的要务');
    K.show(fde, T('lt.b23', '要做的') - 0.8, { y: 12 });
    guide(root, 200, 176, 1520, bottomOf([fde]) - 176, out22);
  });

  // ---------------------------------------------------------------- 收尾（单集）
  Series.outro('lt', { last: '全系列完', lastWord: '结束' });
});
