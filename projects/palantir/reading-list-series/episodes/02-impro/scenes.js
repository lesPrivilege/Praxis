/* 02 地位是一种做法 — Keith Johnstone, Impro.
   Seven body scenes, one per chapter of the narration: the book and the pages read, status as something
   one does, the still head, just above or below the partner, accepting and blocking, the author's own
   cautions, and the two uses at Palantir. Solid lines and outlines: stated by a source. Dashed: this
   series' reading, which appears only in the last scene.
   English on screen comes from the claim ledger: K.quote, or split out of a ledger quote at its quotation
   marks (the two subtext lines, the handshake line). The outro exists only in the standalone episode.
   Camera: each beat declares the region it will fill with shot(), so a layout that fills in item by item is
   framed once instead of re-framed at every arrival; close shots (the Status chapter, the shield, the still
   head, the first rain panel) are timed so that text enters only after the camera has settled. */
Series.unit('im', ({ T, tl, has, u, intro, chrome }) => {
  const BLUE = '#1f4fe0', INK = '#0d1826', INK3 = '#7d8a9c';
  const BOOK = p => `Keith Johnstone, Impro, Routledge 2012, ${p}`;
  const READING = '本系列的读法';

  function open(root, title, from) {
    root.classList.add('paper');
    K.el(root, 'grain');
    chrome(root, title);
    gsap.set(root, { opacity: 0 });
    tl.to(root, { opacity: 1, duration: 0.4, ease: 'power2.out' }, from);
  }
  const tag = (e, ids) => { e.dataset.claim = [].concat(ids).join(' '); return e; };
  /* Ledger text split at its quotation marks: 'Don't' keeps its apostrophe because a closing mark is
     followed by a space or the end of the text. */
  const quoted = (s, re) => [...s.matchAll(re)].map(m => m[1]);
  const EN_Q = /(?:^|\s)'(.+?)'(?=\s|$)/g, ZH_Q = /“(.+?)”/g;
  /* Phrases of a quotation that turn blue when the narration reaches them. A phrase that is not in the
     ledger text stops the stage. */
  function marks(e, phrases) {
    const text = e.textContent;
    let pos = 0;
    const out = [];
    e.textContent = '';
    for (const p of phrases) {
      const i = text.indexOf(p, pos);
      if (i < 0) throw new Error('phrase not in quotation: ' + p);
      e.appendChild(document.createTextNode(text.slice(pos, i)));
      const s = document.createElement('span');
      s.className = 'im-mk';
      s.textContent = p;
      e.appendChild(s);
      out.push(s);
      pos = i + p.length;
    }
    e.appendChild(document.createTextNode(text.slice(pos)));
    return out;
  }
  /* A Chinese line that breaks only between sentences (or, with clauses, also after ，；and ——), so no name
     is split and no short tail is left alone. A piece wider than the column wraps normally. */
  function bySentence(e, clauses) {
    const text = e.textContent;
    const parts = text.match(clauses ? /[^。；！？，—]+(?:[。；！？，]|——)*/g : /[^。！？]+[。！？]*/g) || [];
    if (parts.join('') !== text) throw new Error('bySentence: pieces do not rebuild the text: ' + text);
    e.textContent = '';
    for (const t of parts) {
      const p = K.el(e, 'im-nb', t);
      if (p.offsetWidth > e.clientWidth) p.style.whiteSpace = 'normal';
    }
    return e;
  }
  const toBlue = (els, at) => tl.to(els, { color: BLUE, duration: 0.35, ease: 'power2.out' }, at);
  const toInk = (els, at) => tl.to(els, { color: INK, duration: 0.35, ease: 'power2.out' }, at);
  const fadeIn = (els, at, d) => tl.to(els, { autoAlpha: 1, duration: d || 0.5, ease: 'power2.out' }, at);
  const hidden = els => gsap.set(els, { autoAlpha: 0 });

  /* A stroke with an arrowhead: one path per subpath so the head is drawn after the line. */
  const strokes = (sv, d, cls) => d.split(/(?=M)/).map(p => K.path(sv, p.trim(), cls || 'ln'));
  const drawStrokes = (ps, at, dur) => {
    K.draw(ps[0], at, { duration: dur });
    ps.slice(1).forEach((p, i) => K.draw(p, at + dur * 0.85 + i * 0.05, { duration: 0.2 }));
  };
  function arrow(sv, x1, y1, x2, y2, cls) {
    const a = Math.atan2(y2 - y1, x2 - x1), L = 18, w = 0.45;
    const h1 = [x2 - L * Math.cos(a - w), y2 - L * Math.sin(a - w)].map(v => v.toFixed(1));
    const h2 = [x2 - L * Math.cos(a + w), y2 - L * Math.sin(a + w)].map(v => v.toFixed(1));
    return strokes(sv, `M${x1},${y1} L${x2},${y2} M${h1[0]},${h1[1]} L${x2},${y2} L${h2[0]},${h2[1]}`, cls);
  }

  /* A value held at keyframes [[t, v], …] and eased (power2.inOut) between them: a pure function of t. */
  function track(keys) {
    return t => {
      if (t <= keys[0][0]) return keys[0][1];
      for (let i = 1; i < keys.length; i++) {
        if (t < keys[i][0]) {
          const [t0, v0] = keys[i - 1], [t1, v1] = keys[i];
          const p = (t - t0) / (t1 - t0);
          const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          return v0 + (v1 - v0) * e;
        }
      }
      return keys[keys.length - 1][1];
    };
  }
  /* 0 before a, rising to 1 over r seconds, back to 0 over r seconds from b. */
  const envelope = (a, b, r) => t => Math.max(0, Math.min(1, (t - a) / r, (b + r - t) / r));
  /* Small status moves: a fraction up or down at its own moment, eased, then held until the next one.
     Seeded, so a pure function of t. */
  function nudges(seed, t0, t1, amp) {
    const r = K.rng(seed), keys = [[t0, 0]];
    let t = t0, v = 0;
    while (t < t1) {
      t += 0.55 + r() * 0.65;
      const nv = (r() < 0.5 ? -1 : 1) * amp * (0.35 + 0.65 * r());
      keys.push([t, v], [t + 0.35, nv]);
      v = nv;
      t += 0.35;
    }
    return track(keys);
  }

  /* The phrase of a quotation the narration is on: K.lit. When the point moves on, the phrase goes back to ink
     and its rule retracts. */
  const lit = (els, at) => K.lit(els, at);
  const unlit = (els, at) => tl.to(els, { color: INK, backgroundSize: '0% 0.07em', duration: 0.4, ease: 'power2.inOut' }, at);

  /* Layout box of elements in stage pixels, transforms ignored (offsets up to the scene root). */
  function ext(els) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const e of [].concat(els)) {
      let x = 0, y = 0;
      for (let n = e; n && !n.classList.contains('scene'); n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x + e.offsetWidth); y1 = Math.max(y1, y + e.offsetHeight);
    }
    return { x0, y0, x1, y1 };
  }
  const R = (x0, y0, x1, y1) => ({ x0, y0, x1, y1 });
  const join = (...rs) => rs.reduce((a, b) => R(Math.min(a.x0, b.x0), Math.min(a.y0, b.y0), Math.max(a.x1, b.x1), Math.max(a.y1, b.y1)));
  /* The framing of one beat: the camera holds region r from `from` to `to`, so a layout that fills in item by
     item is framed for what it will hold, not re-framed at every arrival (K.frame). Default zoom and pad are the
     camera's own (1.3, 24); a tall region passes pad 0. */
  function shot(root, r, from, to, o) {
    return K.frame(root, r.x0, r.y0, r.x1, r.y1, from, to, Object.assign({ zoom: 1.3, pad: 24 }, o));
  }

  /* A head-and-shoulders figure drawn natively in a 300×360 box; the head turns about the neck. */
  function bust(parent, x, y, topLabel) {
    const box = K.box(parent, 'im-bust', x, y, 300, 360);
    const s = K.svg(box, null, 300, 360);
    K.sv(s, 'path', { d: 'M30,360 C30,262 78,222 150,222 C222,222 270,262 270,360', class: 'im-bust-body' });
    const head = K.sv(s, 'g', {});
    K.sv(head, 'circle', { cx: 150, cy: 120, r: 64, class: 'im-bust-head' });
    const talk = ['M232,98 Q244,120 232,142', 'M252,84 Q270,120 252,156', 'M272,70 Q296,120 272,170'].map(d => K.path(s, d, 'ln soft'));
    const plumb = K.path(s, 'M150,18 L150,206', 'ln blue');
    hidden(plumb);
    const lab = topLabel ? K.box(box, 'im-bust-lab', -60, -58, 420, null, topLabel) : null;
    return { box, head, talk, plumb, lab, turn: a => head.setAttribute('transform', `rotate(${a.toFixed(2)} 150 190)`) };
  }

  /* A mark on a status scale: label, head and stem, standing on the axis at y; h is the whole height.
     Moved by its left edge; p.eye is the stage y of the head's centre. */
  const PIN_LAB = 52;
  function pin(parent, label, cls, y, h) {
    const p = K.box(parent, 'im-pin ' + (cls || ''), 0, y - h, 160, h);
    if (label) K.el(p, 'im-pin-lab', label);
    const hd = (cls || '').includes('mini') ? 22 : 34, top = label ? PIN_LAB : 0;
    const head = K.el(p, 'im-pin-head');
    const stem = K.el(p, 'im-pin-stem');
    head.style.top = top + 'px';
    stem.style.top = top + hd + 'px';
    stem.style.height = h - top - hd + 'px';
    p.eye = y - h + top + hd / 2;
    p.at = x => { p.style.left = (x - 80).toFixed(1) + 'px'; };
    return p;
  }

  /* An open hand held out to the right (fingers extended, thumb up), with its sleeve, in a panel's own
     coordinates; y shifts it down. Returns the strokes in drawing order. */
  function hand(sv, y) {
    const F = [[226, 92], [246, 102], [266, 94], [286, 74]];   // finger top edge and length
    const d = [`M24,${236 + y} L170,${236 + y}`, `M24,${300 + y} L170,${300 + y}`, `M170,${228 + y} L170,${308 + y}`,
      `M170,${236 + y} L212,${226 + y}`, `M170,${300 + y} C190,${304 + y} 200,${304 + y} 212,${304 + y}`];
    for (const [t, len] of F) {
      const a = t + y, b = a + 18, r = 9, e = 212 + len;
      d.push(`M212,${a} L${e - r},${a} A${r},${r} 0 0 1 ${e - r},${b} L212,${b}`);
    }
    d.push(`M206,${226 + y} L236,${178 + y} A10,10 0 0 1 252,${190 + y} L236,${222 + y}`);
    return d.map(s => K.path(sv, s, 'ln'));
  }
  /* The partner's hand coming from the right and closing round the fingers of hand(). */
  function grip(sv) {
    return [
      K.path(sv, 'M440,214 L340,214', 'ln'), K.path(sv, 'M440,318 L340,318', 'ln'),
      K.path(sv, 'M340,206 L262,206 Q236,206 236,232 L236,300 Q236,326 262,326 L340,326 Z', 'ln im-grip'),
      K.path(sv, 'M262,238 L330,238', 'ln thin'), K.path(sv, 'M262,266 L330,266', 'ln thin'), K.path(sv, 'M262,294 L330,294', 'ln thin'),
    ];
  }

  // ================================================================ 一本戏剧书 (b1–b2)
  Film.scene('im-book', u.bodyStart - 0.2, T('im.b3') + 0.2, ({ root, from, to }) => {
    open(root, '一本戏剧书', from);

    // b1: the author, the theatre, the first edition, the four parts
    const fig = K.figure(root, 'im.johnstone-2017-cropped', 200, 176, 500, 600, { pos: '50% 30%' });
    K.show(fig, from + 0.15, { y: 0, scale: 1.02, duration: 0.9 });
    const who = K.box(root, 'im-who', 790, 186, 930, null, '<b>Keith Johnstone</b><span>Impro 作者</span>');
    K.show(who, T('im.b1', '作者') - 0.15, { y: 14 });
    const courtK = K.box(root, 'im-k', 790, 400, 930, null, 'Royal Court Theatre · 伦敦 · 副总监');
    const courtV = K.box(root, 'im-v', 790, 444, 930, null, '探索：让演员更自发、更有反应');
    K.show(courtK, T('im.b1', '皇家') - 0.25, { y: 10 });
    K.show(courtV, T('im.b1', '琢磨') - 0.15, { y: 12 });
    const year = K.box(root, 'im-year', 790, 600, 930, null, '<b class="t-num">1979</b><span>第 1 版</span>');
    K.show(year, T('im.b1', '一九七九') - 0.2, { y: 12 });

    const PARTS = [
      { zh: '地位', en: 'Status', at: '地位', p: [33, 74] },
      { zh: '自发性', en: 'Spontaneity', at: '自发性', p: [75, 108] },
      { zh: '讲故事', en: 'Narrative Skills', at: '讲故事', p: [109, 142] },
      { zh: '面具与恍惚', en: 'Masks and Trance', at: '面具', p: [143, 205] },
    ];
    const CW = (1520 - 3 * 24) / 4;
    const parts = PARTS.map((s, i) => {
      const c = K.box(root, 'im-part', 200 + i * (CW + 24), 812, CW, 110, `<b>${s.zh}</b><span>${s.en}</span>`);
      K.show(c, T('im.b1', s.at) - 0.2, { y: 16, duration: 0.6 });
      return c;
    });
    K.source(root, 'International Theatresports Institute · keithjohnstone.com · Bloomsbury, Impro, 2022', T('im.b1') + 0.6, T('im.b1', 'end') + 0.2,
      ['im.iti-origin-spontaneous', 'im.site-royal-court-post', 'im.site-methuen-1979', 'im.bloomsbury-sections']);
    // camera: the author and his credits, then a tilt down to take in the four parts as the narration lists them
    const b2 = T('im.b2'), fourAt = T('im.b1', '四个部分') - 0.4;
    shot(root, R(200, 176, 1720, 776), from, fourAt, { pad: 0 });
    shot(root, R(200, 176, 1720, 922), fourAt, b2 - 0.5, { pad: 0 });

    // b2: the book as a strip of pages by part (contents of the Routledge 2012 reprint, 208 pages);
    // the four part cards become their own stretch of the strip
    K.hide([fig, who, courtK, courtV, year], b2 - 0.45, { duration: 0.4 });
    const SX = 200, SW = 1520, SY = 380, SH = 120, PP = SW / 208;
    const px = p => SX + (p - 1) * PP;
    PARTS.forEach((s, i) => {
      const c = parts[i];
      tl.to(c, { left: px(s.p[0]), top: SY, width: (s.p[1] - s.p[0] + 1) * PP - 4, height: SH, duration: 1.2, ease: 'power2.inOut' }, b2 - 0.1);
      tl.to(c.querySelector('span'), { autoAlpha: 0, duration: 0.3 }, b2 - 0.1);
      tl.to(c.querySelector('b'), { fontSize: 34, duration: 1.2, ease: 'power2.inOut' }, b2 - 0.1);
    });
    const rest = [[1, 12], [13, 32], [206, 208]].map(([a, b]) => K.box(root, 'im-seg', px(a), SY, (b - a + 1) * PP - 4, SH));
    K.show(rest, b2 + 0.9, { y: 0, duration: 0.5, stagger: 0.05 });
    const book = K.box(root, 'im-k', SX, 262, 900, null, 'Impro · Routledge 2012 · 208 页');
    K.show(book, b2 + 0.7, { y: 10 });
    const nums = [13, 33, 75, 109, 143, 206].map(p => K.box(root, 'im-pno t-num', px(p), 330, 80, null, String(p)));
    K.show(nums, b2 + 1.0, { y: 8, stagger: 0.04 });

    // the pages the publisher's preview shows in full, all inside the Status chapter
    const READ = [[42, 44], [46, 46], [50, 50], [55, 56]];
    const bars = READ.map(([a, b]) => K.box(root, 'im-readbar', px(a), SY + SH - 52, (b - a + 1) * PP, 48));
    K.show(bars, T('im.b2', '谷歌图书') - 0.2, { y: 0, duration: 0.4, stagger: 0.06 });
    const legRead = K.box(root, 'im-leg', SX, 850, 600, null, '<i class="read"></i>整页读过');

    // the Status chapter, magnified: pages 33–74
    const ZY = 650, ZH = 110, CWZ = SW / 42;
    const sv = K.svg(root, 'im-zoom');
    const zl = [K.path(sv, `M${px(33)},${SY + SH + 4} L${SX},${ZY - 6}`, 'ln thin'), K.path(sv, `M${px(75) - 4},${SY + SH + 4} L${SX + SW},${ZY - 6}`, 'ln thin')];
    const za = T('im.b2', '大多') - 0.3;
    K.draw(zl, za, { duration: 0.7, stagger: 0 });
    const on = new Set([42, 43, 44, 46, 50, 55, 56]);
    const cells = [];
    for (let p = 33; p <= 74; p++) cells.push(K.box(root, 'im-cell' + (on.has(p) ? ' on' : ''), SX + (p - 33) * CWZ + 2, ZY, CWZ - 4, ZH));
    K.show(cells, za + 0.3, { y: 0, duration: 0.3, stagger: 0.012 });
    const glabs = READ.map(([a, b]) => {
      const cx = SX + (a - 33 + (b - a + 1) / 2) * CWZ;
      return K.box(root, 'im-glab t-num', cx - 60, ZY + ZH + 12, 120, null, a === b ? String(a) : `${a}–${b}`);
    });
    const ends = [K.box(root, 'im-pno t-num', SX, ZY + ZH + 12, 80, null, '33'), K.box(root, 'im-pno t-num right', SX + SW - 80, ZY + ZH + 12, 80, null, '74')];
    K.show([...glabs, ...ends], za + 0.8, { y: 8, stagger: 0.05 });
    // the legend comes in with the magnified strip it explains
    const legSnip = K.box(root, 'im-leg', SX + 360, 850, 600, null, '<i></i>仅检索片段');
    K.show([legRead, legSnip], za + 0.9, { y: 8, stagger: 0.08 });
    // what the rest of the episode reads: the Status chapter
    const st = parts[0];
    const stAt = T('im.b2', '主要讲地位') - 0.2;
    tl.to(st, { borderColor: BLUE, duration: 0.4 }, stAt);
    toBlue(st.querySelector('b'), stAt);
    // the whole page map holds still while it fills in; once the narration has said it, everything but the
    // Status chapter recedes and the camera pushes into it, so the next chapter opens on the same word
    const b2end = T('im.b2', 'end');
    shot(root, R(SX, 262, SX + SW, 890), b2 - 0.5, b2end, { pad: 0 });
    K.hide([...parts.slice(1), ...rest, book, ...nums, ...zl, ...cells, ...glabs, ...ends, legRead, legSnip], stAt + 0.1, { duration: 0.5 });
    K.focus(st, b2end + 0.3, to, { zoom: 1.7, pad: 40 });
    K.source(root, 'Keith Johnstone, Impro, Routledge 2012 · 目录 · 谷歌图书预览', b2 + 0.4, b2end - 0.3,
      ['im.toc-routledge-pages', 'im.preview-scope']);
  });

  // ================================================================ 地位是一种做法 (b3–b6)
  Film.scene('im-status', T('im.b3') - 0.3, T('im.b7') + 0.2, ({ root, from }) => {
    open(root, '地位是一种做法', from);

    // b3: not social position but something one does; either can be played against it
    // the chapter opens on the word the last scene pushed into, still blue; the blue passes to 一种做法
    const big = K.box(root, 'im-big', 200, 160, 300, null, '地位');
    const notP = K.box(root, 'im-not', 490, 172, 700, null, '<span>社会地位</span><i></i>');
    const isD = K.box(root, 'im-is', 490, 250, 700, null, '一种做法');
    big.style.color = BLUE;
    K.show(big, from + 0.05, { y: 0, scale: 0.96, duration: 0.6 });
    K.show(notP, T('im.b3', '不是') - 0.1, { y: 10 });
    const strike = notP.querySelector('i');
    gsap.set(strike, { scaleX: 0, transformOrigin: '0 50%' });
    tl.to(strike, { scaleX: 1, duration: 0.45, ease: 'power2.out' }, T('im.b3', '社会地位') + 0.35);
    K.show(isD, T('im.b3', '正在做') - 0.2, { y: 10 });
    toInk(big, T('im.b3', '正在做') - 0.2);

    const LX = 420, RX = 1500, HY = 548, LY = 798, NR = 55;
    const heads = [K.box(root, 'im-colh', LX - 200, 422, 400, null, '社会地位'), K.box(root, 'im-colh', RX - 200, 422, 400, null, '扮演的地位')];
    const nodes = [[LX, HY, '高'], [LX, LY, '低'], [RX, HY, '高'], [RX, LY, '低']].map(([x, y, t]) => K.box(root, 'im-node', x - NR, y - NR, 2 * NR, 2 * NR, t));
    const xa = T('im.b3', '社会地位低') - 0.2;
    K.show(heads, xa, { y: 10, stagger: 0.08 });
    K.show(nodes, xa + 0.15, { y: 10, stagger: 0.05 });
    // camera: close on the definition while it is said, one pull back when the two columns arrive
    shot(root, R(200, 160, 722, 326), from, xa - 0.3, { zoom: 1.45 });
    shot(root, R(200, 160, 1720, 853), xa - 0.3, T('im.b4') - 0.45, { pad: 0 });
    const sv3 = K.svg(root, 'im-cross');
    const up = arrow(sv3, LX + NR + 12, LY - 8, RX - NR - 14, HY + 12, 'ln blue');
    const down = arrow(sv3, LX + NR + 12, HY + 8, RX - NR - 14, LY - 12, 'ln blue');
    drawStrokes(up, T('im.b3', '演高地位') - 0.35, 0.7);
    drawStrokes(down, T('im.b3', '反过来') - 0.25, 0.7);
    tl.to(up, { stroke: INK, duration: 0.4 }, T('im.b3', '反过来') - 0.25);
    // the two ends of each arrow light with it: low social status plays high, then the other way round
    const nodeBlue = (els, at) => tl.to(els, { borderColor: BLUE, color: BLUE, duration: 0.35 }, at);
    const nodeInk = (els, at) => tl.to(els, { borderColor: INK, color: INK, duration: 0.35 }, at);
    nodeBlue(nodes[1], xa + 0.6);
    nodeBlue(nodes[2], T('im.b3', '演高地位') - 0.1);
    nodeInk([nodes[1], nodes[2]], T('im.b3', '反过来') - 0.25);
    nodeBlue(nodes[0], T('im.b3', '反过来') - 0.25);
    nodeBlue(nodes[3], T('im.b3', '反过来') + 0.3);
    K.source(root, BOOK('p. 36'), T('im.b3') + 0.4, T('im.b3', 'end') + 0.2, ['im.impro-p36-something-one-does']);
    const b4 = T('im.b4');
    K.hide([big, notP, isD, ...heads, ...nodes, ...up, ...down], b4 - 0.4, { duration: 0.4 });

    // b4: transactions run all the time, conflict or not; friends play status too
    const q33 = K.quote(root, 'im.impro-p33-continuous', 200, 190, 1520, { size: 46 });
    K.show(q33.root, b4 + 0.1, { y: 14 });
    const lane = K.box(root, 'im-lane', 0, 0, 1920, 1080);
    const band = K.box(lane, 'im-band', 1060, 430, 240, 260, '<span>冲突</span>');
    const sv4 = K.svg(lane, 'im-trace');
    const rnd = K.rng(33);
    let lv = 0.5, dA = '', dB = '';
    const AMP = 34, YC = 572, STEP = 40;
    for (let i = 0, x = 200; x < 1720; i++, x += STEP) {
      const inBand = x >= 1060 && x < 1300;
      const nv = (rnd() < 0.5 ? -1 : 1) * (0.4 + rnd() * 0.6) * (inBand ? 2.2 : 1);
      if (i === 0) { dA = `M${x},${(YC - lv * AMP).toFixed(1)}`; dB = `M${x},${(YC + lv * AMP).toFixed(1)}`; }
      else { dA += ` V${(YC - nv * AMP).toFixed(1)}`; dB += ` V${(YC + nv * AMP).toFixed(1)}`; lv = nv; }
      dA += ` H${x + STEP}`; dB += ` H${x + STEP}`;
    }
    const tA = K.path(sv4, dA, 'ln'), tB = K.path(sv4, dB, 'ln soft');
    K.draw([tA, tB], T('im.b4', '交易') - 0.3, { duration: 3.2, ease: 'none', stagger: 0 });
    const laneLab = K.box(lane, 'im-k', 200, 430, 600, null, '地位交易');
    K.show(laneLab, T('im.b4', '交易') - 0.3, { y: 8 });
    K.show(band, T('im.b4', '冲突') - 0.25, { y: 0, duration: 0.4 });
    // the note under the trace rides up with the lane, dimmed, while the objection comes in
    const calm = K.box(lane, 'im-calm', 200, 716, 840, null, '冲突之外 · 照常进行');
    K.show(calm, T('im.b4', '冲突') - 0.1, { y: 8 });
    const obj = T('im.b4', '反驳') - 0.4;
    K.hide([q33.root, laneLab], obj, { duration: 0.4 });
    tl.to(lane, { y: -196, opacity: 0.4, duration: 0.9, ease: 'power2.inOut' }, obj);
    const objection = K.box(root, 'im-objection', 200, 600, 1520, null, '<span>反驳</span><b>朋友之间不玩地位</b>');
    K.show(objection, T('im.b4', '朋友之间') - 0.35, { y: 12 });
    const q37 = K.quote(root, 'im.impro-p37-friends', 200, 700, 1520, { size: 44 });
    K.show(q37.root, T('im.b4', '回答') - 0.2, { y: 14 });
    lit(marks(q37.en, ['agree to play status games together']), T('im.b4', '同意') - 0.25);
    // camera: the quotation over the trace, then the lane risen with the objection and the answer under it
    shot(root, R(200, 190, 1720, 760), b4 - 0.45, obj, { pad: 0 });
    shot(root, join(R(200, 234, 1720, 564), ext(q37.root)), obj, T('im.b5') - 0.45, { pad: 0 });
    K.source(root, BOOK('pp. 33, 37'), b4 + 0.4, T('im.b4', 'end') + 0.2, ['im.impro-p33-continuous', 'im.impro-p37-friends']);
    const b5 = T('im.b5');
    K.hide([lane, objection, q37.root], b5 - 0.4, { duration: 0.4 });

    // b5: the two subtext lines, split out of the ledger quotation
    const hl = Film.claim('im.impro-p43-high-low-lines');
    const en = quoted(hl.quote_en, EN_Q), zh = quoted(hl.quote_zh, ZH_Q);
    if (en.length !== 2 || zh.length !== 2) throw new Error('im.impro-p43-high-low-lines: expected two quoted lines');
    const subLab = K.box(root, 'im-k', 200, 196, 900, null, '两句潜台词');
    K.show(subLab, b5 + 0.1, { y: 8 });
    const sv5 = K.svg(root, 'im-div');
    const divider = K.path(sv5, 'M960,320 L960,706', 'ln thin');
    K.draw(divider, b5 + 0.3, { duration: 0.8 });
    // both headings come in as the narration names high and low, so the two columns are set before either
    // line is spoken; each line comes in with its heading turning blue, as the narration says whose line it is,
    // and its Chinese as the line is spoken
    const cols = [['演高地位', '高', '别靠近我', 200], ['演低地位', '低', '别咬我', 1030]].map(([h, atH, atL, x], i) => {
      const c = tag(K.box(root, 'im-sub', x, 320, 690, null), 'im.impro-p43-high-low-lines');
      const head = K.el(c, 'im-sub-h', h);
      const line = K.el(c, 'im-sub-en', '“' + K.curly(en[i]) + '”');
      const z = K.el(c, 'im-sub-zh', zh[i]);
      K.show(head, T('im.b5', atH) - 0.2, { y: 10 });
      K.show(line, T('im.b5', h) - 0.2, { y: 14 });
      K.show(z, T('im.b5', atL) - 0.2, { y: 8 });
      return { c, head };
    });
    toBlue(cols[0].head, T('im.b5', '演高地位') - 0.2);
    toInk(cols[0].head, T('im.b5', '演低地位') - 0.2);
    toBlue(cols[1].head, T('im.b5', '演低地位') - 0.2);
    shot(root, join(ext(subLab), ext(cols[0].c), ext(cols[1].c)), b5 - 0.45, T('im.b6') - 0.45);
    K.source(root, BOOK('p. 43'), b5 + 0.4, T('im.b5', 'end') + 0.2, ['im.impro-p43-high-low-lines']);
    const b6 = T('im.b6');
    K.hide([subLab, divider, ...root.querySelectorAll('.im-sub')], b6 - 0.4, { duration: 0.4 });

    // b6: his hedge, then preferred status as a defence
    const qh = K.quote(root, 'im.impro-p43-preferred-hedge', 200, 250, 1520, { size: 46 });
    const [mNow, mPref, mMove] = marks(qh.en, ['(at this moment)', 'preferred status', 'manoeuvre themselves into the preferred positions']);
    K.show(qh.root, b6 + 0.15, { y: 14 });
    lit(mNow, T('im.b6', '眼下') - 0.3);
    unlit(mNow, T('im.b6', '偏爱') - 0.3);
    lit(mPref, T('im.b6', '偏爱') - 0.3);
    lit(mMove, T('im.b6', '挪回') - 0.3);
    const def = T('im.b6', '在他看来');
    K.source(root, BOOK('p. 43'), b6 + 0.4, def - 0.4, ['im.impro-p43-preferred-hedge']);
    K.hide(qh.root, def - 0.45, { duration: 0.4 });
    // one figure: shielded in the status it is used to, then stepping out into another one, where the shield
    // does not follow
    const f1 = bust(root, 470, 470);
    hidden(f1.talk);
    K.show(f1.box, def - 0.1, { y: 16 });
    const sv6 = K.svg(root, 'im-shield');
    const shield = K.path(sv6, 'M300,830 A320,320 0 0 1 940,830', 'ln im-shield-arc');
    K.draw(shield, T('im.b6', '防身') - 0.35, { duration: 0.8 });
    const l1 = K.box(root, 'im-figlab', 420, 846, 400, null, '<b>惯用的地位</b><span>防御</span>');
    K.show(l1, T('im.b6', '防身') - 0.1, { y: 10 });
    const qs = K.quote(root, 'im.impro-p43-status-specialist', 200, 196, 1520, { size: 40 });
    // the quotation comes in once the camera is back from the close shot, so it never enters a cropped frame
    const typed = T('im.b6', '定了型') - 0.1, back = typed - 0.7;
    K.show(qs.root, typed, { y: 12 });
    const swap = T('im.b6', '换一种地位') - 0.3;
    tl.to(f1.box, { x: 680, duration: 1.3, ease: 'power2.inOut' }, swap);
    const l2 = K.box(root, 'im-figlab', 1100, 846, 400, null, '<b>另一种地位</b><span>无防护</span>');
    const l2b = l2.querySelector('span');
    K.show(l2.querySelector('b'), swap + 0.9, { y: 10 });
    K.show(l2b, T('im.b6', '没了保护') - 0.25, { y: 8 });
    // camera: close on the figure under its shield while the defence is named, then the whole frame for the quotation
    // and the move
    shot(root, R(300, 470, 940, 940), def + 0.7, back);
    shot(root, join(ext(qs.root), R(300, 470, 1500, 940)), back, T('im.b7') + 0.2, { pad: 0 });
    K.source(root, BOOK('p. 43'), def - 0.1, T('im.b6', 'end') + 0.3, ['im.impro-p43-status-specialist']);
  });

  // ================================================================ 头不动 (b7–b9)
  Film.scene('im-head', T('im.b7') - 0.3, T('im.b10') + 0.2, ({ root, from }) => {
    open(root, '头不动', from);

    // b7: the demonstration; the figure stays the same object through b8
    const fig = bust(root, 360, 500, '头不动');
    K.show(fig.box, from + 0.3, { y: 16 });
    K.show(fig.talk, T('im.b7', '说话时') - 0.2, { y: 0, x: -6, duration: 0.4, stagger: 0.08 });
    K.draw(fig.plumb, T('im.b7', '头保持不动') - 0.3, { duration: 0.6 });
    K.show(fig.lab, T('im.b7', '头保持不动') - 0.1, { y: 8 });
    // the quotation waits for the pull back: while the head is held still the camera is close on it
    const said7 = T('im.b7', '他说');
    const q43 = K.quote(root, 'im.impro-p43-head-still', 200, 176, 1520, { size: 40 });
    const [mSelf, mOthers] = marks(q43.en, ['the way I perceive myself', 'am perceived by others']);
    K.show(q43.root, said7 + 0.5, { y: 12 });
    const sv7 = K.svg(root, 'im-eff');
    const ef1 = arrow(sv7, 700, 620, 800, 620, 'ln'), ef2 = arrow(sv7, 700, 750, 800, 750, 'ln');
    const e1 = K.box(root, 'im-eff-lab', 830, 588, 700, null, '自我观感');
    const e2 = K.box(root, 'im-eff-lab', 830, 718, 700, null, '他人观感');
    drawStrokes(ef1, T('im.b7', '怎么看自己') - 0.3, 0.4);
    K.show(e1, T('im.b7', '怎么看自己') - 0.1, { y: 8 });
    lit(mSelf, T('im.b7', '怎么看自己') - 0.3);
    drawStrokes(ef2, T('im.b7', '别人') - 0.3, 0.4);
    K.show(e2, T('im.b7', '别人') - 0.1, { y: 8 });
    unlit(mSelf, T('im.b7', '别人') - 0.3);
    lit(mOthers, T('im.b7', '别人') - 0.3);
    // the second effect holds into b8 before the figure moves on
    const b8 = T('im.b8'), b8go = b8 + 0.3;
    // camera: the figure, then in on the head while the narration has it held still, then back for what it changes
    const talkAt = T('im.b7', '说话时') - 0.4;
    shot(root, R(300, 442, 720, 860), from, talkAt);
    shot(root, R(420, 442, 660, 706), talkAt, said7 - 0.4, { zoom: 1.75, pad: 50 });
    shot(root, R(200, 176, 1530, 860), said7 - 0.4, b8go, { pad: 0 });
    K.source(root, BOOK('p. 43'), T('im.b7') + 0.4, b8go - 0.1, ['im.impro-p43-head-still']);

    // b8: what follows from a still head
    K.hide([q43.root, ...ef1, ...ef2, e1, e2], b8go, { duration: 0.4 });
    tl.to(fig.box, { x: -170, y: -90, scale: 0.85, duration: 1.0, ease: 'power2.inOut' }, b8go);
    const ITEMS = [['完整的句子', '完整的句子'], ['目光接触', '眼睛'], ['更顺的动作', '动作更顺'], ['更大的空间', '占的地方']];
    const chainH = K.box(root, 'im-k', 980, 196, 740, null, '随之自动出现的高地位行为');
    K.show(chainH, T('im.b8', '别的高地位') - 0.2, { y: 8 });
    const sv8 = K.svg(root, 'im-chain');
    const chain = ITEMS.map(([t, w], i) => {
      const yc = 300 + i * 140;
      const box = K.box(root, 'im-item', 980, yc - 50, 640, 100, t);
      const ln = K.path(sv8, `M520,590 C700,590 790,${yc} 970,${yc}`, 'ln');
      K.draw(ln, T('im.b8', w) - 0.55, { duration: 0.5 });
      K.show(box, T('im.b8', w) - 0.2, { x: -12, y: 0, duration: 0.5 });
      return [box, ln];
    }).flat();
    // the full chain holds about two seconds after its last item arrives, then clears for the roles
    const roles = T('im.b8', '需要权威'), out = roles + 0.3;
    K.hide([chainH, ...chain], out, { duration: 0.4 });
    // the roles: the gravedigger may move his head, Hamlet may not. The figure crosses to Hamlet's place
    // as the chain leaves, and the quotation comes in once its plumb line is clear of the text
    K.hide(fig.lab, out, { duration: 0.3 });
    tl.to(fig.box, { x: 760, y: 20, scale: 1, duration: 1.2, ease: 'power2.inOut' }, out);
    const q44 = K.quote(root, 'im.impro-p43-head-role', 200, 176, 1520, { size: 40 });
    bySentence(q44.zh);
    const [mTrick, mHamlet] = marks(q44.en, ['have to learn this still head trick', 'not if you play Hamlet']);
    K.show(q44.root, out + 0.9, { y: 12 });
    lit(mTrick, T('im.b8', '学会') - 0.3);
    const gd = bust(root, 420, 520);
    K.show(gd.box, T('im.b8', '掘墓人') - 0.35, { y: 16 });
    const gdLab = K.box(root, 'im-role', 320, 896, 500, null, '掘墓人<span>晃头</span>');
    const hmLab = K.box(root, 'im-role', 1020, 896, 500, null, '哈姆雷特<span>头不动</span>');
    K.show(gdLab, T('im.b8', '掘墓人') - 0.15, { y: 8 });
    K.show(hmLab, T('im.b8', '哈姆雷特') - 0.2, { y: 8 });
    toBlue(hmLab, T('im.b8', '哈姆雷特') - 0.2);
    unlit(mTrick, T('im.b8', '哈姆雷特') - 0.3);
    lit(mHamlet, T('im.b8', '哈姆雷特') - 0.3);
    // camera: the figure and the chain it sets off, then the two roles under the quotation
    shot(root, R(200, 196, 1620, 770), b8go - 0.2, out, { pad: 0 });
    shot(root, R(200, 176, 1720, 950), out, T('im.b9') - 0.45, { pad: 0 });
    const wag = envelope(T('im.b8', '边说边晃') - 0.4, T('im.b10') + 1, 0.4);
    Film.onFrame(t => gd.turn(wag(t) * 16 * Math.sin(2 * Math.PI * 1.35 * t)));
    K.source(root, BOOK('pp. 43–44'), b8go + 0.4, T('im.b9') - 0.3, ['im.impro-p44-chain-effects', 'im.impro-p43-head-role']);

    // b9: Qureshi's retold examples, sorted by what the readable pages show. His two sentences name every
    // example on the chips, the still head included
    const b9 = T('im.b9');
    K.hide([q44.root, fig.box, gd.box, gdLab, hmLab], b9 - 0.4, { duration: 0.4 });
    const qq = K.quote(root, 'im.qureshi-hands-head-examples', 200, 176, 1520, { size: 40 });
    bySentence(qq.zh);
    const [mStill] = marks(qq.en, ['keeping your head still while talking']);
    K.show(qq.root, b9 + 0.1, { y: 12 });
    lit(mStill, T('im.b9', '头不动') - 0.3);
    const CY = 176 + qq.root.offsetHeight + 56;
    const hFound = K.box(root, 'im-colhead', 200, CY, 600, null, '书中找到<span>p. 43</span>');
    const hMiss = K.box(root, 'im-colhead miss', 920, CY, 800, null, '可读书页中未见');
    const found = K.box(root, 'im-chip', 200, CY + 92, 300, 92, '头不动');
    K.show(found, T('im.b9', '头不动') - 0.2, { y: 10 });
    K.show(hFound, T('im.b9', '书里找得到') - 0.25, { y: 8 });
    // Qureshi's other examples come in as he lists them, in ink like the one that was found; they go grey when the
    // narration says the readable pages do not have them
    const MISS = [['站直', '站直'], ['露出双手', '露出双手'], ['驼背', '驼背'], ['手插口袋', '手插口袋']];
    const miss = MISS.map(([t, w], i) => {
      const c = K.box(root, 'im-chip', 920 + (i % 2) * 320, CY + 92 + Math.floor(i / 2) * 112, 290, 92, t);
      K.show(c, T('im.b9', w) - 0.2, { y: 10 });
      return c;
    });
    K.show(hMiss, T('im.b9', '能读到的书页') - 0.25, { y: 8 });
    tl.to(miss, { borderColor: INK3, color: '#3a4658', backgroundColor: 'rgba(248, 250, 252, 0)', duration: 0.5, stagger: 0.06 }, T('im.b9', '没有找到') - 0.4);
    shot(root, join(ext(qq.root), ext([hFound, hMiss, found, ...miss])), b9 - 0.45, T('im.b10') + 0.2, { pad: 0 });
    K.source(root, 'Nabeel Qureshi, Reflections on Palantir, 2024 · ' + BOOK('pp. 42–44'), b9 + 0.4, T('im.b9', 'end') + 0.4,
      ['im.qureshi-hands-head-examples', 'im.impro-p43-head-still', 'im.preview-scope']);
  });

  // ================================================================ 高低只差一点 (b10–b12)
  Film.scene('im-partner', T('im.b10') - 0.3, T('im.b13') + 0.2, ({ root, from }) => {
    open(root, '略高略低', from);
    const AY = 742, X0 = 280, X1 = 1640, MID = 960;
    const b10 = T('im.b10'), b11 = T('im.b11'), b12 = T('im.b12');
    const sv = K.svg(root, 'im-scale');
    const axis = K.path(sv, `M${X0},${AY} L${X1},${AY}`, 'ln');
    const ticks = [];
    for (let x = X0 + 85; x < X1; x += 170) ticks.push(K.path(sv, `M${x},${AY - 10} L${x},${AY + 10}`, 'ln thin'));
    K.draw(axis, b10 + 0.1, { duration: 0.9 });
    K.show(ticks, b10 + 0.5, { y: 0, duration: 0.3, stagger: 0.03 });
    const lo = K.box(root, 'im-end', X0 - 110, AY - 30, 90, null, '低');
    const hi = K.box(root, 'im-end', X1 + 30, AY - 30, 90, null, '高');
    K.show([lo, hi], b10 + 0.4, { y: 0, x: 0, duration: 0.5 });

    // the partner moves; the student keeps just above or below. Once below, the student stays below: the lock
    // changes how closely the student follows, not where the student stands. Before the lock the student
    // trails the partner by a visible beat; at the lock the beat closes and the two move as one
    const PH = 260;
    const P = pin(root, '搭档', '', AY, PH), S = pin(root, '学生', 'blue', AY, PH);
    const lock = T('im.b12', '盯住搭档');
    // the partner steps up and stays there until the lock: a step back down would let the trailing student
    // overtake it
    const pBase = track([
      [T('im.b10', '照着对方') - 0.15, MID], [T('im.b10', '调整自己') - 0.3, MID + 160],
      [lock - 0.2, MID + 160], [lock + 1.4, 1170], [lock + 3.2, 820], [lock + 4.6, 1020], [lock + 5.6, MID],
    ]);
    const gap = track([[T('im.b10', '低一点') - 0.25, 140], [T('im.b10', '低一点') + 0.35, -140]]);
    const lag = track([[lock - 0.4, 0.7], [lock + 0.1, 0]]);
    const liveA = T('im.b11', '每时每刻') - 0.6;
    const live = envelope(liveA, lock - 0.6, 0.6);
    // in real life each adjusts a fraction up or down, moment by moment; the student's moves follow the partner's,
    // a beat late, with small ones of the student's own
    const jP = nudges(44, liveA, lock, 34), jS = nudges(46, liveA, lock, 9);
    const pX = t => pBase(t) + live(t) * jP(t);
    const sX = t => {
      const l = lag(t);
      return pBase(t - l) + gap(t) + live(t) * (jP(t - l) + jS(t));
    };
    K.show(P, T('im.b10', '搭档') - 0.35, { y: 16 });
    K.show(S, T('im.b10', '高一点') - 0.3, { y: 16 });
    // line of sight between the two heads
    const sight = K.box(root, 'im-sight', 0, P.eye - 2, 0, 4);
    const lockLab = K.el(sight, 'im-lock', '锁定');
    hidden([sight, lockLab]);
    fadeIn(sight, T('im.b10', '看对方') - 0.3);
    fadeIn(lockLab, lock - 0.1, 0.4);
    tl.to(sight, { height: 7, duration: 0.4 }, lock - 0.1);
    Film.onFrame(t => {
      const a = pX(t), b = sX(t);
      P.at(a); S.at(b);
      const l = Math.min(a, b) + 20, r = Math.max(a, b) - 20;
      sight.style.left = l.toFixed(1) + 'px';
      sight.style.width = Math.max(0, r - l).toFixed(1) + 'px';
    });

    const q1 = K.quote(root, 'im.impro-p44-above-below-partner', 200, 176, 1520, { size: 40 });
    K.show(q1.root, T('im.b10', '要求') - 0.3, { y: 12 });
    lit(marks(q1.en, ['just a little above or below']), T('im.b10', '高一点') - 0.3);
    K.hide(q1.root, b11 - 0.35, { duration: 0.35 });
    const q2 = K.quote(root, 'im.impro-p44-real-life-adjust', 200, 176, 1520, { size: 40 });
    K.show(q2.root, b11 + 0.05, { y: 12 });
    lit(marks(q2.en, ['moment by moment each person adjusts his status up or down a fraction']), T('im.b11', '每时每刻') - 0.3);
    // real life, then the same moves on a stage
    const real = K.box(root, 'im-where', 210, 470, 400, null, '现实');
    const stage = K.box(root, 'im-where', 210, 470, 400, null, '舞台');
    K.show(real, T('im.b11', '现实里') - 0.25, { y: 8 });
    const onStage = T('im.b11', '台上') - 0.6;
    K.hide(real, onStage, { duration: 0.3 });
    K.show(stage, onStage + 0.25, { y: 8 });
    const frame = K.path(sv, 'M180,836 L180,456 L1740,456 L1740,836', 'ln');
    const floor = K.path(sv, 'M150,836 L1770,836', 'ln im-floor');
    K.draw([frame, floor], onStage, { duration: 0.9, stagger: 0.1 });
    K.hide(q2.root, b12 - 0.35, { duration: 0.35 });
    const q3 = K.quote(root, 'im.impro-p44-lock-on', 200, 176, 1520, { size: 40 });
    bySentence(q3.zh, true);
    K.show(q3.root, b12 + 0.05, { y: 12 });
    lit(marks(q3.en, ['‘lock on to’']), lock - 0.3);
    K.source(root, BOOK('p. 44'), b10 + 0.4, T('im.b12', '没有这套训练') - 0.6,
      ['im.impro-p44-above-below-partner', 'im.impro-p44-real-life-adjust', 'im.impro-p44-lock-on']);

    // camera: the whole stage, with the lock-on quotation above it, from the set-up through the lock
    const tm = T('im.b12', '没有这套训练');
    shot(root, R(150, 176, 1770, 836), from, tm - 0.6, { pad: 0 });

    // Theatre Machine
    K.hide([q3.root, stage, lo, hi, axis, ...ticks, P, S, sight, real, frame, floor], tm - 0.55, { duration: 0.4 });
    const q4 = K.quote(root, 'im.impro-p46-theatre-machine', 200, 340, 1520, { size: 50 });
    const [mTM, mEU] = marks(q4.en, ['the Theatre Machine', 'toured successfully in Europe']);
    // in once the lock-on quotation above has gone, so the two never overlap
    K.show(q4.root, tm - 0.1, { y: 14 });
    lit(mTM, T('im.b12', '剧团') - 0.25);
    unlit(mTM, T('im.b12', '欧洲') - 0.3);
    lit(mEU, T('im.b12', '欧洲') - 0.3);
    K.source(root, BOOK('p. 46'), tm - 0.1, T('im.b12', 'end') + 0.3, ['im.impro-p46-theatre-machine']);
  });

  // ================================================================ 接受与阻挡 (b13–b14)
  Film.scene('im-offer', T('im.b13') - 0.3, T('im.b15') + 0.2, ({ root, from }) => {
    open(root, '接受与阻挡', from);
    // the chapter, then the section the narration is about
    const sec = K.box(root, 'im-sec', 200, 168, 1520, null, '<span>Spontaneity</span><b>Blocking and Accepting</b>');
    const [s1, s2] = sec.children;
    K.show(s1, T('im.b13', '自发性') - 0.25, { y: 8 });
    K.show(s2, T('im.b13', '接受和阻挡') - 0.25, { y: 10 });

    // b13: an action as an offer; accept or block. The diagram and the quotation take the full width
    const act = K.box(root, 'im-act', 760, 330, 400, 96, '搭档的动作');
    const sv = K.svg(root, 'im-offer-lines');
    const down = arrow(sv, 960, 430, 960, 510, 'ln');
    const offer = K.box(root, 'im-offer', 990, 444, 300, null, '提议');
    const toA = strokes(sv, 'M960,514 L960,536 L600,536 L600,574 M588,560 L600,574 L612,560', 'ln');
    const toB = strokes(sv, 'M960,536 L1320,536 L1320,574 M1308,560 L1320,574 L1332,560', 'ln');
    const acc = K.box(root, 'im-opt', 450, 580, 300, 96, '接受');
    const blk = K.box(root, 'im-opt', 1170, 580, 300, 96, '阻挡');
    K.show(act, T('im.b13', '搭档的每个动作') - 0.1, { y: 10 });
    drawStrokes(down, T('im.b13', '提议') - 0.5, 0.4);
    K.show(offer, T('im.b13', '提议') - 0.2, { y: 8 });
    drawStrokes(toA, T('im.b13', '接下') - 0.45, 0.4);
    K.show(acc, T('im.b13', '接下') - 0.15, { y: 10 });
    drawStrokes(toB, T('im.b13', '挡回去') - 0.45, 0.4);
    K.show(blk, T('im.b13', '挡回去') - 0.15, { y: 10 });
    const ag = K.box(root, 'im-note', 1506, 576, 300, null, '一种攻击');
    const unaware = K.box(root, 'im-note dim', 1506, 628, 300, null, '可能不自知');
    K.show(ag, T('im.b13', '阻挡就是攻击') - 0.2, { y: 8 });
    tl.to(blk, { color: BLUE, borderColor: BLUE, duration: 0.35 }, T('im.b13', '阻挡就是攻击') - 0.2);
    const q95 = K.quote(root, 'im.impro-p95-prefer-block', 200, 724, 1520, { size: 40 });
    K.show(q95.root, T('im.b13', '多数学生') - 0.25, { y: 10 });
    lit(marks(q95.en, ['most prefer to block']), T('im.b13', '更喜欢阻挡') - 0.3);
    K.show(unaware, T('im.b13', '没察觉') - 0.25, { y: 8 });
    K.source(root, BOOK('pp. 94–95'), T('im.b13') + 0.5, T('im.b14') - 0.3, ['im.impro-p94-blocking-aggression', 'im.impro-p95-prefer-block']);
    // camera: close on the chapter and section while the narration names them, then the diagram's whole frame
    const diag = T('im.b13', '搭档的每个动作') - 0.3;
    shot(root, R(200, 168, 900, 276), from, diag, { zoom: 1.7 });
    shot(root, join(R(200, 168, 1720, 676), ext(q95.root)), diag, T('im.b14') + 0.4, { pad: 0 });

    // b14: the rain example in three panels, then his instruction
    const b14 = T('im.b14');
    // the chapter name steps out while the camera is close on the panels, and returns with the instruction from
    // the same chapter (pp. 99 and 101 are in it); the section name goes with the diagram
    K.hide([s1, s2, act, ...down, offer, ...toA, ...toB, acc, blk, ag, unaware, q95.root], b14 - 0.6, { duration: 0.4 });
    const rain = Film.claim('im.impro-p101-rain-example');
    const [meet] = quoted(rain.quote_en, EN_Q), [meetZh] = quoted(rain.quote_zh, ZH_Q);
    const PW = 460, PX = [200, 730, 1260], PY = 300;
    const panels = PX.map(x => K.box(root, 'im-panel', x, PY, PW, 440));
    const psv = panels.map(p => K.svg(p, null, PW, 440));
    // panel 1: a hand held out to feel for rain
    const hand1 = hand(psv[0], 0);
    const drops = [[270, 120], [326, 160], [372, 96]].map(([x, y]) =>
      K.path(psv[0], `M${x},${y - 22} C${x + 12},${y - 4} ${x + 12},${y + 8} ${x},${y + 8} C${x - 12},${y + 8} ${x - 12},${y - 4} ${x},${y - 22} Z`, 'ln soft'));
    // panel 2: the partner's hand closes round it
    const hand2 = [...hand(psv[1], 0), ...grip(psv[1])];
    const bubble = tag(K.box(panels[1], 'im-bubble', 36, 40, 400, null, `<b>“${K.curly(meet)}”</b><span>${meetZh}</span>`), 'im.impro-p101-rain-example');
    // panel 3: what he meant and what was read
    const intent = K.box(panels[2], 'im-read', 40, 110, 380, null, '<span>本意</span><b>试雨</b>');
    const neq = K.box(panels[2], 'im-neq', 40, 196, 380, null, '≠');
    const taken = K.box(panels[2], 'im-read', 40, 262, 380, null, '<span>读成</span><b>握手问候</b>');
    const caps = [['新手', '伸手试雨'], ['搭档', '握手问候'], ['新手', '恼火']].map(([a, b], i) =>
      K.box(root, 'im-pcap', PX[i], PY + 460, PW, null, `<b>${a}</b><span>${b}</span>`));
    // the first panel is up while the example is introduced, so the frame is never empty
    K.show(panels[0], b14 + 0.1, { y: 12 });
    K.draw(hand1, T('im.b14', '新手') - 0.1, { duration: 0.6, stagger: 0.05 });
    K.show(caps[0], T('im.b14', '伸出手') + 0.1, { y: 8 });
    K.show(drops, T('im.b14', '下雨') - 0.35, { y: -12, duration: 0.5, stagger: 0.1 });
    K.show(panels[1], T('im.b14', '握住') - 0.4, { y: 12 });
    K.draw(hand2, T('im.b14', '握住') - 0.25, { duration: 0.6, stagger: 0.04 });
    K.show(caps[1], T('im.b14', '握住') + 0.1, { y: 8 });
    K.show(bubble, T('im.b14', '幸会') - 0.3, { y: 10 });
    // the third panel arrives with what he meant; what was read follows when the narration says it
    const p3 = T('im.b14', '恼了') - 0.3;
    K.show([panels[2], caps[2]], p3, { y: 12, stagger: 0.1 });
    K.show(intent, p3 + 0.15, { y: 8 });
    K.show([neq, taken], T('im.b14', '会错') - 0.35, { y: 8, stagger: 0.1 });
    const inst = T('im.b14', '别费心');
    K.hide([...panels, ...caps], inst - 0.3, { duration: 0.3 });
    const q99 = K.quote(root, 'im.impro-p99-assume-offer', 200, 360, 1520, { size: 52 });
    K.show(q99.root, inst, { y: 14 });
    K.show(s1, inst, { y: 8 });
    lit(marks(q99.en, ['assume that one has already been made']), T('im.b14', '已经给了你') - 0.35);
    // camera: close on the hand feeling for rain, then back along the strip as the partner's hand closes on it, so
    // the third panel lands in a frame already open for it. At 1.25 the second panel is whole in the first frame
    const at2 = T('im.b14', '握住') - 0.5;
    shot(root, R(PX[0], PY, PX[0] + PW, PY + 512), b14 + 0.4, at2, { zoom: 1.25, pad: 30 });
    shot(root, R(PX[0], PY, PX[2] + PW, PY + 512), at2, inst - 0.2, { pad: 0 });
    K.source(root, BOOK('pp. 99, 101'), b14 + 0.4, T('im.b14', 'end') + 0.4, ['im.impro-p101-rain-example', 'im.impro-p99-assume-offer']);
  });

  // ================================================================ 作者的保留 (b15–b16)
  Film.scene('im-caution', T('im.b15') - 0.3, T('im.b17') + 0.2, ({ root, from }) => {
    open(root, '作者的保留', from);

    // b15: two cautions of his own
    const h1 = K.box(root, 'im-card-h', 200, 190, 720, null, '察觉不易');
    const h2 = K.box(root, 'im-card-h', 1000, 190, 720, null, '学生抵触');
    const q42 = K.quote(root, 'im.impro-p42-perception-difficulty', 200, 300, 720, { size: 40 });
    const q55 = K.quote(root, 'im.impro-p55-resistance-safety', 1000, 300, 720, { size: 40 });
    const [mHard] = marks(q42.en, ['the difficulty of actually perceiving status transactions']);
    const [mRes, mSafe] = marks(q55.en, ['very strong subconscious resistances', 'Making the student safe']);
    K.show(h1, T('im.b15', '承认') - 0.2, { y: 10 });
    K.show(q42.root, T('im.b15', '察觉') - 0.3, { y: 12 });
    lit(mHard, T('im.b15', '并不容易') - 0.3);
    unlit(mHard, T('im.b15', '教这些东西') - 0.3);
    const second = T('im.b15', '教这些东西') - 0.2;
    K.show([h2, q55.root], second, { y: 10, stagger: 0.12 });
    lit(mRes, T('im.b15', '抵触') - 0.3);
    unlit(mRes, T('im.b15', '安全') - 0.35);
    lit(mSafe, T('im.b15', '安全') - 0.35);
    // camera: the first caution on its own, then across to take in the second
    shot(root, join(ext(h1), ext(q42.root)), from, second - 0.3);
    shot(root, join(ext([h1, h2]), ext(q42.root), ext(q55.root)), second - 0.3, T('im.b16') - 0.45);
    K.source(root, BOOK('pp. 42, 55'), T('im.b15') + 0.4, T('im.b16') - 0.3, ['im.impro-p42-perception-difficulty', 'im.impro-p55-resistance-safety']);

    // b16: 1979 and 2007, two dated points with nothing drawn between them
    const b16 = T('im.b16');
    K.hide([h1, h2, q42.root, q55.root], b16 - 0.4, { duration: 0.4 });
    const sv = K.svg(root, 'im-dates');
    const axis = K.path(sv, 'M200,300 L1720,300', 'ln thin');
    K.draw(axis, b16 - 0.1, { duration: 0.8 });
    const dots = [K.box(root, 'im-dot', 200, 289, 22, 22), K.box(root, 'im-dot', 1000, 289, 22, 22)];
    const years = [K.box(root, 'im-yr t-num', 196, 180, 400, null, '1979'), K.box(root, 'im-yr t-num', 996, 180, 400, null, '2007')];
    const what = [
      K.box(root, 'im-what', 200, 330, 720, null, '<b>Impro</b><span>谈出色的即兴演员</span>'),
      K.box(root, 'im-what', 1000, 330, 720, null, '<b>Georgia Straight 电话采访</b><span>谈接受所有提议这条规则</span>'),
    ];
    const qa = K.quote(root, 'im.impro-p99-accept-all-offers', 200, 450, 720, { size: 38 });
    bySentence(qa.zh, true);
    const qb = K.quote(root, 'im.straight-2007-perversion', 1000, 450, 720, { size: 38 });
    const [mAll] = marks(qa.en, ['they accept all offers made']);
    const [mPerv] = marks(qb.en, ['perversion']);
    K.show([dots[0], years[0]], T('im.b16', '一九七九年') - 0.2, { y: 8 });
    K.show(what[0], T('im.b16', '写道') - 0.2, { y: 8 });
    K.show(qa.root, T('im.b16', '出色') - 0.25, { y: 12 });
    lit(mAll, T('im.b16', '所有提议') - 0.35);
    const y07 = T('im.b16', '二〇〇七年') - 0.2;
    K.show([dots[1], years[1]], y07, { y: 8 });
    K.show(what[1], T('im.b16', '采访') - 0.2, { y: 8 });
    K.show(qb.root, T('im.b16', '扭曲') - 0.6, { y: 12 });
    lit(mPerv, T('im.b16', '扭曲') - 0.15);
    // camera: the 1979 column centred while it is read, then out along the date line to 2007
    shot(root, join(ext([years[0], what[0]]), ext(qa.root)), b16 - 0.45, y07 - 0.4, { pad: 0 });
    shot(root, join(ext([years[0], what[0], what[1]]), ext(qa.root), R(200, 180, 1720, 330)), y07 - 0.4, T('im.b17') + 0.2, { pad: 0 });
    // the two sentences side by side; how they connect is left open
    const both = T('im.b16', '前后两句') - 0.3;
    tl.to([qa.en, qb.en, qa.zh, qb.zh], { color: INK3, duration: 0.6 }, both);
    tl.to(dots, { backgroundColor: BLUE, borderColor: BLUE, duration: 0.4 }, both);
    K.source(root, 'Keith Johnstone, Impro, Routledge 2012, p. 99 · Guy MacPherson, Georgia Straight, 2007', b16 + 0.4, T('im.b16', 'end') + 0.4,
      ['im.impro-p99-accept-all-offers', 'im.straight-2007-perversion']);
  });

  // ================================================================ 两种用法 (b17–b19)
  // the body's last scene holds under whatever comes next (the outro, or the next card in the compilation)
  Film.scene('im-uses', T('im.b17') - 0.3, u.bodyEnd + Series.HOLD, ({ root, from, to }) => {
    open(root, '两种用法', from);
    const colL = K.box(root, 'im-col-h', 200, 180, 720, null, '<b>Nabeel Qureshi</b><span>对外用法 · 面向客户</span>');
    const colR = K.box(root, 'im-col-h', 1000, 180, 720, null, '<b>Ted Mabrey</b><span>Palantir 全球商务负责人 · 对内用法</span>');
    const rules = [colL, colR].map(c => K.el(c, 'im-col-rule'));
    gsap.set(rules, { scaleX: 0, transformOrigin: '0 50%' });
    const back = T('im.b17', '回到');
    tl.to(rules, { scaleX: 1, duration: 0.9, ease: 'power3.inOut', stagger: 0.12 }, back + 0.1);
    const [lName, lUse] = colL.querySelectorAll('b, span'), [rName, rUse] = colR.querySelectorAll('b, span');
    // both names come in with the column rules, Mabrey's dimmed until his use is reached; each use line arrives
    // when the narration names that use
    K.show(lName, back + 0.1, { y: 10 });
    gsap.set(rName, { autoAlpha: 0, y: 10 });
    tl.to(rName, { autoAlpha: 0.4, y: 0, duration: 0.7, ease: 'power3.out' }, back + 0.22);
    K.show(lUse, T('im.b17', '往外用') - 0.75, { y: 10 });

    // b17: outward, at the client (the content below the headers is full width and belongs to one use at a time)
    const fde = K.box(root, 'im-fde', 200, 430, 400, 132, '<b>FDE</b><span>驻客户现场的工程师</span>');
    const client = K.box(root, 'im-client', 800, 340, 920, 520, '<span>客户</span>');
    const sv = K.svg(root, 'im-org');
    const top = K.box(root, 'im-orgn top', 1110, 400, 340, 84, '最高层对口人');
    const MIDS = [980, 1280, 1580], LOWS = [920, 1095, 1280, 1465, 1640];
    const mids = MIDS.map(x => K.box(root, 'im-orgn', x - 80, 566, 160, 56));
    const lows = LOWS.map(x => K.box(root, 'im-orgn', x - 60, 700, 120, 48));
    const orgL = [
      ...MIDS.map(x => `M1280,484 L${x},566`),
      'M980,622 L920,700', 'M980,622 L1095,700', 'M1280,622 L1280,700', 'M1580,622 L1465,700', 'M1580,622 L1640,700',
    ].map(d => K.path(sv, d, 'ln thin'));
    const link = K.path(sv, 'M602,496 L1108,444', 'ln');
    const trust = ['结成伙伴', '取得信任', '常涉政治博弈'].map((t, i) => K.box(root, 'im-trust', 200, 600 + i * 62, 520, null, t));
    K.show(fde, T('im.b17', '往外用') + 0.4, { y: 10 });
    const cl = T('im.b17', '客户') - 0.25;
    K.show(client, cl, { y: 10 });
    K.show([...mids, ...lows], cl + 0.2, { y: 8, stagger: 0.04 });
    K.show(top, cl + 0.3, { y: 8 });
    K.draw(orgL, cl + 0.4, { duration: 0.5, stagger: 0.03 });
    tl.to(top, { borderColor: BLUE, color: BLUE, duration: 0.4 }, T('im.b17', '最高层') - 0.2);
    K.draw(link, T('im.b17', '做伙伴') - 0.5, { duration: 0.6 });
    K.show(trust[0], T('im.b17', '做伙伴') - 0.2, { y: 8 });
    K.show(trust[1], T('im.b17', '取得信任') - 0.2, { y: 8 });
    K.show(trust[2], T('im.b17', '玩政治') - 0.3, { y: 8 });
    K.source(root, 'Nabeel Qureshi, Reflections on Palantir, 2024', T('im.b17') + 2.2, T('im.b18') - 0.3,
      ['ov.qureshi_why_impro_social_context', 'im.qureshi-why-impro']);
    shot(root, R(200, 180, 1720, 860), from, T('im.b18') - 0.45, { pad: 0 });

    // b18: inward, inside Palantir
    const b18 = T('im.b18');
    K.hide([fde, client, top, ...mids, ...lows, ...orgL, link, ...trust], b18 - 0.4, { duration: 0.4 });
    tl.to([lName, lUse], { opacity: 0.4, duration: 0.5 }, b18 - 0.3);
    tl.fromTo(rName, { opacity: 0.4 }, { opacity: 1, duration: 0.5, immediateRender: false }, b18 - 0.1);
    K.show(rUse, b18 + 0.15, { y: 10 });
    const qm = K.quote(root, 'ov.mabrey_impro_purpose_status', 200, 360, 1520, { size: 50 });
    bySentence(qm.zh, true);
    const [mAdv] = marks(qm.en, ['to use to advance a given situation']);
    K.show(qm.root, T('im.b18', '写道') - 0.2, { y: 12 });
    lit(mAdv, T('im.b18', '推动局面') - 0.35);
    // the title is struck; the authority won in the situation grows out from behind it and takes its own place
    const cy = 360 + qm.root.offsetHeight + 64;
    const earned = K.box(root, 'im-earned', 200, cy, 260, 120, '局面中赢得的权威');
    const title = K.box(root, 'im-title', 200, cy, 260, 120, '<span>头衔<i></i></span>');
    K.show(title, T('im.b18', '头衔') - 0.25, { y: 8 });
    const tStrike = title.querySelector('i');
    gsap.set(tStrike, { scaleX: 0, transformOrigin: '0 50%' });
    tl.to(tStrike, { scaleX: 1, duration: 0.4 }, T('im.b18', '头衔') + 0.3);
    const won = T('im.b18', '赢来的权威') - 0.6;
    hidden(earned);
    fadeIn(earned, won, 0.3);
    tl.to(earned, { left: 500, width: 700, duration: 1.0, ease: 'power3.inOut' }, won);
    shot(root, join(R(200, 180, 1720, 300), ext(qm.root), R(200, cy, 1200, cy + 120)), b18 - 0.45, T('im.b19') - 0.4, { pad: 0 });
    K.source(root, 'Ted Mabrey, Commentary on The Technological Republic, 2025 · Stratechery, 2023', b18 + 0.4, T('im.b19') - 0.3,
      ['ov.mabrey_impro_purpose_status', 'ov.mabrey_impro_given_on_joining', 'ov.mabrey-title']);

    // b19: both lead back to one line of Johnstone's: the series' wording in the box, his own words under it.
    // The dashed connectors and the dashed box are this series' reading and come in together with its label
    const b19 = T('im.b19');
    K.hide([qm.root, title, earned], b19 - 0.35, { duration: 0.4 });
    tl.to([lName, lUse], { opacity: 1, duration: 0.5 }, b19 - 0.2);
    // the box comes in as the narration turns back to the line; the quotation follows when the line is said
    const core = K.box(root, 'im-core', 560, 372, 800, 96, '地位是一种做法');
    const said = T('im.b19', '地位是人正在做');
    K.show(core, T('im.b19', '回到') - 0.2, { y: 10 });
    const q36 = K.quote(root, 'im.impro-p36-something-one-does', 200, 486, 1520, { size: 37 });
    q36.root.classList.add('im-core-q');
    const [mDoes] = marks(q36.en, ['something one does']);
    K.show(q36.root, said + 0.4, { y: 8 });
    lit(mDoes, said + 0.6);

    const inf = T('im.b19', '推论');
    const conn = [K.path(sv, 'M560,322 C560,350 760,346 860,368', 'ln dash soft'), K.path(sv, 'M1360,322 C1360,350 1160,346 1060,368', 'ln dash soft')];
    K.draw(conn, inf - 0.5, { duration: 0.8, stagger: 0.1 });
    const rd = K.box(root, 'im-reading', 200, 628, 1520, 204);
    K.el(rd, 'im-reading-lab', `<i></i>${READING}`);
    const rd1 = K.el(rd, 'im-reading-1', '陌生组织 · 取得信任之前');
    const rd2 = K.el(rd, 'im-reading-2', '看清在场者的地位升降');
    K.show(rd, inf - 0.5, { y: 10 });
    // the blue moves from the series' wording of Johnstone's line to the reading's key line
    toInk(core, inf - 0.3);
    hidden([rd1, rd2]);
    K.show(rd1, T('im.b19', '陌生组织') - 0.25, { y: 8 });
    K.show(rd2, T('im.b19', '看清') - 0.25, { y: 8 });
    // people present, each moving their status a little up or down
    const MY = 806, many = [1250, 1360, 1470, 1580];
    const msv = K.svg(root, 'im-mini');
    const maxis = K.path(msv, `M1190,${MY} L1660,${MY}`, 'ln soft');
    K.draw(maxis, T('im.b19', '看清') - 0.1, { duration: 0.6 });
    const minis = many.map(() => pin(root, null, 'mini', MY, 120));
    K.show(minis, T('im.b19', '在场') - 0.2, { y: 10, stagger: 0.06 });
    // each moves its status a fraction up or down at its own moments, from when the narration says so
    const moveA = T('im.b19', '往上挪') - 0.3;
    const moves = many.map((x, i) => nudges(190 + i, moveA + 0.15 * i, u.bodyEnd + 1, 26));
    Film.onFrame(t => minis.forEach((m, i) => m.at(many[i] + moves[i](t))));

    // where the accounts of the two uses come from
    const fromH = K.box(root, 'im-from-h', 200, 862, 280, null, '两种用法的出处');
    const rowA = K.box(root, 'im-from', 500, 862, 1220, null, '<i></i><b>一手说法</b><span>Qureshi 2024 · Mabrey 2025</span>');
    const rowB = K.box(root, 'im-from rep', 500, 914, 1220, null, '<i></i><b>书评转述</b><span>Karp、Zamiska, The Technological Republic, 2025</span>');
    K.show(fromH, T('im.b19', '内部') - 0.2, { y: 8 });
    K.show(rowA, T('im.b19', '一手说法') - 0.4, { y: 8 });
    K.show(rowB, T('im.b19', '书评') - 0.2, { y: 8 });
    // p. 36 stays cited while its quotation is on screen; the review joins the line when the narration reaches it
    const src = K.source(root, BOOK('p. 36') + '<span class="im-src-more"> · Hollis Robbins, The Technological Republic (Review), 2025</span>',
      b19 + 0.4, u.bodyEnd + 0.3, ['im.impro-p36-something-one-does', 'ov.karp_zamiska_book_via_reviews']);
    const more = src.querySelector('.im-src-more');
    hidden(more);
    fadeIn(more, T('im.b19', '书评') - 0.1, 0.5);
    // camera: the frame the whole closing layout needs, from the start, so the arrivals fill it in place
    shot(root, join(R(200, 180, 1720, 300), ext([rd, fromH, rowA, rowB])), b19 - 0.4, to, { pad: 0 });
  });

  // ================================================================ 收尾（单集）
  // standalone intro, 20 s long: Qureshi's two reasons arrive as the narration gives them, over the dimmed series map
  // this intro moves the map up for Qureshi's two lines, so the series camera stays off it
  if (intro) intro.lean = false;
  if (intro) Film.scene('im-intro-why', T('im.i1', '说到') - 0.4, intro.end, ({ root }) => {
    root.dataset.cam = 'drift';
    const say = T('im.i1', '说到') - 0.2, more = T('im.i1', '他还说') - 0.2;
    // the series map steps up into a band, this reading (信任) still lit and the others dimmed, and Qureshi's two
    // reasons take the space it leaves. Explicit starts: at boot the intro root is still hidden, so a plain
    // autoAlpha tween would record 0 as its start
    const m = intro.map;
    const others = [m.label, m.line, ...m.cols.filter(c => c.dataset.unit !== 'im')];
    tl.fromTo(m.box, { y: 0 }, { y: -130, duration: 1.2, ease: 'power2.inOut', immediateRender: false }, say);
    tl.fromTo(others, { opacity: 1 }, { opacity: 0.16, duration: 0.8, immediateRender: false }, say);
    tl.fromTo(intro.reading, { opacity: 1 }, { opacity: 0, duration: 0.4, immediateRender: false }, say);
    const who = K.box(root, 'im-intro-who', 200, 610, 1520, null, 'Nabeel Qureshi');
    const r1 = K.box(root, 'im-intro-r', 200, 716, 1520, null, '做 FDE · 须对社交场合格外敏感，<span>取得对方信任</span>');
    const r2 = K.box(root, 'im-intro-r', 200, 796, 1520, null, '受技术人欢迎 · <span>部分因为把社会行为拆成机制</span>');
    K.show(who, T('im.i1', '写过') - 0.6, { y: 12 });
    K.show(r1, T('im.i1', '做') - 0.25, { y: 12 });
    K.show(r2, more, { y: 12 });
    const [trust] = r1.children, [apart] = r2.children;
    lit(trust, T('im.i1', '信任') - 0.3);
    unlit(trust, T('im.i1', '拆开') - 0.4);
    lit(apart, T('im.i1', '拆开') - 0.4);
    K.source(root, 'Nabeel Qureshi, Reflections on Palantir, 2024', say + 0.4, intro.end - 0.4,
      ['ov.qureshi_why_impro_social_context', 'ov.qureshi_impro_mechanistic']);
  });

  Series.outro('im');
});
