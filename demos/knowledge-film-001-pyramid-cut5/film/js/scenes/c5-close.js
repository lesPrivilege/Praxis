/* Chapter 5: the test, and the end of the film.
   One set of elements runs from the cold-open picture to the film's own pyramid: the dashed title slot is the
   top box throughout, and the seventeen pieces of the five drifting lines are the seventeen boxes under it. */
(function () {
  const { T } = Film, tl = K.tl;
  const CH = ['05', '检验'];
  Parts.chapterCard('c5', '05', '检验');

  const INK = '#0d1826', GREY = '#7d8a9c', PAPER = '#f2f4f7', BLUE = '#1f4fe0';

  // ------------------------------------------------- the film's own argument
  const FILM = {
    top: '写不清楚，多半是思考还没形成结构',
    keys: [
      { tag: '起点', say: ['问题出在思考，', '不在语言'], chips: ['1966 伦敦', '巴黎、杜塞尔多夫', '明托的原话'] },
      { tag: '方法', say: ['从证据往上搭，', '从塔尖往下讲'], chips: ['分组', '写成判断', '三条规则'] },
      { tag: '依据', say: ['先读到的内容', '决定后文的读法'], chips: ['Bransford &amp; Johnson 1972', 'Kieras 1980', 'Li 等 2020'] },
      { tag: '误用', say: ['结构工整', '不等于论证成立'], chips: ['凑三点', '为切而切', '先定结论', '埋没要点'] },
    ],
  };

  // Geometry of the finished pyramid in world pixels; the camera at scale 1 shows it full frame.
  const X0 = 70, COLW = 427, GAP = 24, BAR = 32;
  const TOP = { x: 410, y: 150, w: 1100, h: 132 };
  const SLOT = { x: 300, y: 150, w: 470, h: 124 };          // where the cold open kept its title slot
  const KEY_Y = 392, KEY_H = 184, CHIP_Y = 632, CHIP_H = 60, CHIP_P = 72, CHIP_IN = 28, SPINE = 12;
  const colX = k => X0 + k * (COLW + GAP);
  const SLOTS = [];
  FILM.keys.forEach((key, k) => {
    SLOTS.push({ kind: 'key', k, x: colX(k), y: KEY_Y, w: COLW, h: KEY_H, bh: BAR,
      html: `<em><u class="t-num">${k + 1}</u>${key.tag}</em><b>${key.say.join('<br>')}</b>` });
    key.chips.forEach((c, j) => SLOTS.push({ kind: 'chip', k, j, x: colX(k) + CHIP_IN, y: CHIP_Y + j * CHIP_P, w: COLW - CHIP_IN, h: CHIP_H, bh: 22, html: `<b>${c}</b>` }));
  });
  const N = SLOTS.length;                                   // 17
  const keyIdx = SLOTS.map((s, i) => (s.kind === 'key' ? i : -1)).filter(i => i >= 0);
  const firstIdx = SLOTS.map((s, i) => (s.kind === 'chip' && s.j === 0 ? i : -1)).filter(i => i >= 0);
  const restIdx = SLOTS.map((s, i) => (s.kind === 'chip' && s.j > 0 ? i : -1)).filter(i => i >= 0);

  // The five lines of the cold open, cut into seventeen pieces. Same drift as the opening (same seed, same order).
  const LINES = [[512, 2], [1280, 5], [832, 3], [1024, 4], [704, 3]], SEG_GAP = 12;
  const drift = (() => { const r = K.rng(11); return LINES.map(() => ({ x: (r() - 0.35) * 150, y: (r() - 0.5) * 30, rot: (r() - 0.5) * 4.4 })); })();
  const SEGS = [];
  LINES.forEach(([W, n], li) => { for (let si = 0; si < n; si++) SEGS.push({ li, si, w: (W - (n - 1) * SEG_GAP) / n }); });
  // which piece of which line ends up in which box
  const segOf = (() => { const r = K.rng(5), a = SEGS.map((_, i) => i); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; })();

  const asBar = (cx, cy, w, rot) => ({ x: cx - w / 2, y: cy - BAR / 2, width: w, height: BAR, rotation: rot, '--box': 0, '--p': 0, '--bh': BAR });
  const arranged = s => ({ x: s.x, y: s.y, width: s.w, height: s.h, rotation: 0, '--box': 1, '--p': 1, '--bh': s.bh });
  function inLine(seg, k) {                                  // k: how far adrift, 0…1
    const W = LINES[seg.li][0], d = drift[seg.li], px = 300 + 0.2 * W, py = 338 + seg.li * 108 + 42;
    const cx = 300 + seg.si * (seg.w + SEG_GAP) + seg.w / 2, a = (d.rot * k * Math.PI) / 180;
    return asBar(px + (cx - px) * Math.cos(a) + d.x * k, py + (cx - px) * Math.sin(a) + d.y * k, seg.w, d.rot * k);
  }
  // the loose pile under the top box: staggered rows with jitter, taken left to right in the order of the columns they will join
  const CELLS = [];
  [5, 4, 5, 3].forEach((n, row) => { for (let c = 0; c < n; c++) CELLS.push({ x: 272 + (5 - n) * 172 + c * 344, y: 745 + row * 73 }); });
  CELLS.sort((a, b) => a.x - b.x || a.y - b.y);
  const pile = seed => { const r = K.rng(seed); return CELLS.map(c => ({ cx: c.x + (r() - 0.5) * 90, cy: c.y + (r() - 0.5) * 22, rot: (r() - 0.5) * 24 })); };
  const tidy = i => ({ x: 100 + Math.floor(i / 3) * 290, y: 770 + (i % 3) * 78 - BAR / 2 });   // the same pieces set as a neat table

  function makeTop(world) {
    const e = K.el(world, 'c5-top');
    const ph1 = K.el(e, 'c5-ph1', '无标题'), ph2 = K.el(e, 'c5-ph2', '你的主张');
    const bar = K.el(e, 'c5-claim'), caret = K.el(e, 'c5-caret');
    const txt = K.el(e, 'c5-toptxt', `<span>${FILM.top}</span>`);
    return { e, ph1, ph2, bar, caret, txt };
  }
  function build(world, own) {
    const g = K.svg(world);
    const ups = keyIdx.map(i => K.path(g, K.elbow(TOP, SLOTS[i], 14), 'ln'));
    const hooks = SLOTS.map(s => {
      if (s.kind !== 'chip') return null;
      const sx = colX(s.k) + SPINE, cy = s.y + s.h / 2;
      return K.path(g, `M${sx},${s.j ? cy - CHIP_P : KEY_Y + KEY_H} L${sx},${cy} L${s.x},${cy}`, 'ln soft');
    });
    const top = makeTop(world);
    const pieces = SLOTS.map(s => {
      const e = K.el(world, 'c5-piece ' + s.kind);
      const bar = document.createElement('i'); e.appendChild(bar);
      const txt = own ? K.el(e, 'c5-txt', s.html) : null;
      if (own) {                                              // the bar in a box is as long as the words it stands for
        const bw = txt.querySelector('b').offsetWidth;
        s.pl = s.kind === 'key' ? (s.w - bw) / 2 : 16; s.pr = s.w - s.pl - bw;
      }
      e.style.setProperty('--pl', s.pl + 'px'); e.style.setProperty('--pr', s.pr + 'px');
      return { e, bar, txt };
    });
    return { g, ups, hooks, top, pieces };
  }
  const blink = t => (t * 1.7) % 1 < 0.55;
  /* K.draw, but the path stays invisible until its turn: a round cap otherwise leaves a dot at the end of an undrawn line. */
  function draw(p, at, o) {
    gsap.set(p, { autoAlpha: 0 });
    tl.to(p, { autoAlpha: 1, duration: 0.01, stagger: (o && o.stagger) || 0 }, at);
    return K.draw(p, at, o);
  }

  // ------------------------------------------------------------------ cameras
  const CAM_0 = { s: 1, x: 0, y: 0 };                        // cold-open picture; later the film's pyramid
  const CAM_A = { s: 0.76, x: 434, y: 100 };                 // the pyramid with a column of words on its left
  const Q_TOP = 292, Q_LH = 144, Q_S = 0.3;                  // Minto's sentence; its third line sits level with the empty top box
  const CAM_Q = { s: Q_S, x: 1269, y: Q_TOP + 2.5 * Q_LH - Q_S * (TOP.y + TOP.h / 2) };
  const CAM_L = { s: 0.48, x: 46, y: 288 }, RIGHT_X = 952;   // two outcomes side by side

  const A0 = T('c5.card', 'end') - 0.1;
  const E0 = Film.duration - 5.7;                            // the end card takes over here
  Film.scene('c5-test', A0, E0 + 0.8, ({ root }) => {
    root.classList.add('paper');
    const world2 = K.el(root, 'c5-world');
    const world = K.el(root, 'c5-world');
    const ui = K.el(root, 'fill');
    K.el(root, 'grain'); K.el(root, 'vignette');
    K.chrome(root, { chapter: CH });
    gsap.set(root, { opacity: 0 });
    tl.to(root, { opacity: 1, duration: 0.4, ease: 'power2.out' }, A0);

    const cam = Object.assign({}, CAM_0);
    Film.onFrame(() => { world.style.transform = `translate(${cam.x}px,${cam.y}px) scale(${cam.s})`; });
    const camTo = (at, c, dur) => tl.to(cam, { s: c.s, x: c.x, y: c.y, duration: dur, ease: 'power3.inOut' }, at);

    const P = build(world, true);
    const top = P.top, pc = P.pieces;
    const els = idx => idx.map(i => pc[i].e);
    const loose = pile(23), r = K.rng(31);
    const at = i => asBar(loose[i].cx, loose[i].cy, SEGS[segOf[i]].w, loose[i].rot);

    // the top box: measure the sentence it will hold, so the claim bar is exactly as long
    gsap.set(top.e, { width: TOP.w, height: TOP.h });
    const barW = top.txt.firstChild.offsetWidth, barL = (TOP.w - barW) / 2;
    top.bar.style.left = barL + 'px'; top.caret.style.left = barL + 'px'; top.ph2.style.left = barL + 26 + 'px';
    gsap.set(top.e, { x: SLOT.x, y: SLOT.y, width: SLOT.w, height: SLOT.h, autoAlpha: 0 });
    gsap.set([top.ph1, top.ph2], { autoAlpha: 0 });

    // ---- c5.1 back at the opening: five lines adrift, and the slot above them still empty
    pc.forEach((p, i) => {
      const seg = SEGS[segOf[i]];
      gsap.set(p.e, Object.assign(inLine(seg, 0.35), { autoAlpha: 0 }));
      gsap.set(p.bar, { backgroundColor: GREY });
      tl.to(p.e, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, A0 + 0.1 + seg.li * 0.07);
    });
    const tA = T('c5.2', '塔尖') - 0.25;                     // the slot starts to become the top of a pyramid
    pc.forEach((p, i) => { const s = inLine(SEGS[segOf[i]], 1); tl.to(p.e, { x: s.x, y: s.y, rotation: s.rotation, duration: tA - A0, ease: 'sine.inOut' }, A0); });
    const tSlot = T('c5.1', '写') - 0.3;
    tl.to(top.e, { autoAlpha: 1, duration: 0.6 }, tSlot);
    tl.to(top.ph1, { autoAlpha: 1, duration: 0.5 }, tSlot + 0.25);
    const tFine = T('c5.1', '多半') - 0.1;
    pc.forEach((p, i) => tl.to(p.bar, { backgroundColor: INK, duration: 0.5 }, tFine + SEGS[segOf[i]].li * 0.07));
    const fine = K.box(ui, 'c5-sidenote', 1250, 560, null, null, '句子齐全');
    const g1 = K.svg(ui);
    const fineLn = K.path(g1, 'M1232,584 L1176,584', 'ln soft');
    K.show(fine, tFine + 0.25, { x: 16, y: 0, duration: 0.5 });
    draw(fineLn, tFine + 0.2, { duration: 0.35 });
    tl.to([fine, fineLn], { autoAlpha: 0, duration: 0.3 }, tA - 0.25);

    // ---- c5.2 the slot is the top box; nothing is in it yet
    tl.to(top.ph1, { autoAlpha: 0, duration: 0.3 }, tA - 0.1);
    tl.to(top.e, { x: TOP.x, y: TOP.y, width: TOP.w, height: TOP.h, duration: 1.3, ease: 'power3.inOut' }, tA);
    pc.forEach((p, i) => tl.to(p.e, Object.assign(at(i), { duration: 1.3, ease: 'power3.inOut' }), tA + 0.05 + r() * 0.25));
    camTo(tA, CAM_A, 1.6);
    const ghosts = keyIdx.map(i => K.box(world, 'c5-ghost', SLOTS[i].x, SLOTS[i].y, SLOTS[i].w, SLOTS[i].h));
    const dashed = keyIdx.map(i => K.path(P.g, K.elbow(TOP, SLOTS[i], 14), 'ln soft dash'));
    gsap.set([...ghosts, ...dashed], { autoAlpha: 0 });
    tl.to(dashed, { autoAlpha: 1, duration: 0.5, stagger: 0.07 }, tA + 0.8);
    tl.to(ghosts, { autoAlpha: 0.75, duration: 0.5, stagger: 0.07 }, tA + 0.9);
    const topY = CAM_A.y + CAM_A.s * (TOP.y + TOP.h / 2), topL = CAM_A.x + CAM_A.s * TOP.x;
    const apex = K.box(ui, 'c5-apex', 80, topY - 40, null, null, '塔尖');
    const apexLn = K.path(g1, `M258,${topY} L${topL - 14},${topY}`, 'ln blue');
    const empty = K.box(ui, 'c5-sidenote', 82, topY + 62, null, null, '塔尖空缺');
    K.show(apex, tA + 0.9, { x: -20, y: 0, duration: 0.6 });
    draw(apexLn, tA + 1.0, { duration: 0.5 });
    const tCaret = T('c5.2', '还') - 0.15;
    K.show(empty, tCaret + 0.15, { y: 12, duration: 0.5 });

    // ---- c5.3 Minto's sentence; the empty pyramid waits beside it
    const tQ = T('c5.3') - 0.35;
    tl.to([apex, apexLn, empty], { autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, tQ - 0.1);
    camTo(tQ, CAM_Q, 1.4);
    const who = K.box(ui, 'c5-who', 204, Q_TOP - 66, null, null, 'BARBARA MINTO');
    const quote = K.lines(ui, 'c5-quote', ['<span class="c5-hang">“</span>The pyramid is a tool', 'to help you find out', '<span>what you think.”</span>']);
    quote.style.cssText += `position:absolute;left:200px;top:${Q_TOP}px;`;
    const zh = K.box(ui, 'c5-zh', 204, Q_TOP + 3 * Q_LH + 36, null, null, '<span>金字塔是一件工具，</span><span>帮你弄清自己<em>到底在想什么</em>。</span>');
    K.show(who, T('c5.3', '明托') + 0.2, { y: 0, duration: 0.5 });
    K.rise(quote.inners[0], T('c5.3', '金字塔') - 0.2);
    K.rise(quote.inners[1], T('c5.3', '帮') - 0.2);
    K.rise(quote.inners[2], T('c5.3', '弄清') + 0.3);
    K.show(zh.children[0], T('c5.3', '金字塔') + 0.1, { y: 14, duration: 0.5 });
    K.show(zh.children[1], T('c5.3', '帮') - 0.05, { y: 14, duration: 0.5 });
    const tThink = T('c5.3', '想') - 0.25;
    const l3 = quote.inners[2].firstChild, linkX = 200 + l3.offsetWidth + 34, linkY = Q_TOP + 2.5 * Q_LH;
    const link = K.box(ui, 'c5-link', linkX, linkY - 1, 0, null);
    tl.to([quote.inners[2], zh.querySelector('em')], { color: BLUE, duration: 0.5 }, tThink);
    tl.to(link, { width: CAM_Q.x + Q_S * TOP.x - 16 - linkX, duration: 0.8, ease: 'power2.inOut' }, tThink + 0.1);
    tl.to(top.e, { '--ring': 3, duration: 0.5 }, tThink + 0.7);
    K.source(root, 'Barbara Minto 语，引自麦肯锡校友网访谈（McKinsey Alumni Center）', T('c5.3', '金字塔'), T('c5.4') - 0.4);

    // ---- c5.4 not a matter of layout: a test. One sentence, then "why?" all the way down
    const tB = T('c5.4') - 0.3;
    tl.to([who, zh, link], { autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, tB);
    K.sink(quote.inners, tB, { duration: 0.5, stagger: 0.04 });
    tl.to(top.e, { '--ring': 0, duration: 0.4 }, tB);
    camTo(tB + 0.15, CAM_A, 1.5);
    // tidy rows are not the point
    const tTidy = T('c5.4', '排版') - 0.3, tLoose = T('c5.4', '它') - 0.35;
    pc.forEach((p, i) => {
      const w = SEGS[segOf[i]].w;
      tl.to(p.e, Object.assign(tidy(i), { rotation: 0, duration: 0.7, ease: 'power3.inOut' }), tTidy + i * 0.015);
      tl.to(p.e, { x: loose[i].cx - w / 2, y: loose[i].cy - BAR / 2, rotation: loose[i].rot, duration: 0.7, ease: 'power3.inOut' }, tLoose + r() * 0.15);
    });
    const layout = K.box(ui, 'c5-word dim', 80, topY - 40, null, null, '排版');
    const test = K.box(ui, 'c5-word', 80, topY - 40, null, null, '检验');
    K.show(layout, T('c5.4', '排版') - 0.2, { y: 16, duration: 0.5 });
    tl.to(layout, { '--strike': 1, duration: 0.4, ease: 'power2.inOut' }, T('c5.4', '排版') + 0.3);
    tl.to(layout, { autoAlpha: 0, duration: 0.3 }, tLoose);
    K.show(test, T('c5.4', '检验') - 0.2, { y: 16, duration: 0.5 });
    const item1 = K.box(ui, 'c5-item', 80, topY + 110, null, null, '<b class="t-num">1</b>能用一句话说出');
    const item2 = K.box(ui, 'c5-item', 80, topY + 190, null, null, '<b class="t-num">2</b>经得起追问');
    // 1 · can it be said in one sentence
    tl.to(top.ph2, { autoAlpha: 1, duration: 0.4 }, T('c5.4', '你的') - 0.1);
    K.show(item1, T('c5.4', '能') - 0.15, { y: 14, duration: 0.5 });
    const tType = T('c5.4', '一句话') - 0.35, TYPE = 1.1, tFill = tType + TYPE + 0.05;
    tl.to(top.ph2, { autoAlpha: 0, duration: 0.2 }, tType - 0.1);
    tl.to(top.bar, { width: barW, duration: TYPE, ease: 'steps(17)' }, tType);
    tl.to(top.caret, { x: barW + 10, duration: TYPE, ease: 'steps(17)' }, tType);
    tl.to(top.e, { '--edge': 1, '--fill': 1, duration: 0.45, ease: 'power2.out' }, tFill);
    tl.to(top.bar, { backgroundColor: PAPER, duration: 0.45 }, tFill);
    tl.to(item1, { '--on': 1, duration: 0.35 }, tFill + 0.1);
    Film.onFrame(t => { top.caret.style.opacity = t >= tCaret && t < tFill && (t >= tType || blink(t)) ? 1 : 0; });
    // 2 · does it stand up to "why?"
    const pill = (x, y) => { const e = K.box(world, 'c5-pill', x - 110, y, 220, null, '为什么？'); gsap.set(e, { autoAlpha: 0, scale: 0.6 }); return e; };
    const lock = (idx, t, dur, each) => idx.forEach((i, n) => tl.to(pc[i].e, Object.assign(arranged(SLOTS[i]), { duration: dur, ease: 'expo.out' }), t + n * each));
    const tW1 = T('c5.4', '又') - 0.05;
    K.show(item2, tW1 + 0.1, { y: 14, duration: 0.5 });
    const cx = TOP.x + TOP.w / 2;
    keyIdx.forEach((i, n) => {
      const s = SLOTS[i], q = pill(cx, TOP.y + TOP.h + 12);
      tl.to(q, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, tW1 + 0.15);
      tl.to(q, { x: s.x + s.w / 2 - cx, y: KEY_Y - 76 - (TOP.y + TOP.h + 12), duration: 0.6, ease: 'power3.inOut' }, tW1 + 0.5 + n * 0.05);
      tl.to(q, { autoAlpha: 0, duration: 0.25 }, tW1 + 1.4);
    });
    draw(P.ups, tW1 + 0.55, { duration: 0.6, stagger: 0.05 });
    tl.to(dashed, { autoAlpha: 0, duration: 0.3 }, tW1 + 0.9);
    lock(keyIdx, tW1 + 0.85, 0.7, 0.07);
    tl.to(ghosts, { autoAlpha: 0, duration: 0.3, stagger: 0.07 }, tW1 + 1.0);
    const tW2 = T('c5.4', '一路');
    firstIdx.forEach((i, n) => {
      const s = SLOTS[i], q = pill(colX(s.k) + COLW / 2, KEY_Y + KEY_H + 8);
      tl.to(q, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, tW2 + n * 0.05);
      tl.to(q, { y: 30, duration: 0.5, ease: 'power3.inOut' }, tW2 + 0.35 + n * 0.05);
      tl.to(q, { autoAlpha: 0, duration: 0.25 }, tW2 + 1.1);
    });
    lock(firstIdx, tW2 + 0.65, 0.6, 0.05);
    firstIdx.forEach((i, n) => draw(P.hooks[i], tW2 + 0.75 + n * 0.05, { duration: 0.4 }));
    const tHeld = T('c5.4', 'end') - 0.1;
    tl.to(item2, { '--on': 1, duration: 0.35 }, tHeld);
    tl.to(top.e, { '--ring': 1, duration: 0.35 }, tHeld);

    // ---- c5.5 two outcomes
    const tC = T('c5.5') - 0.4;
    tl.to([test, item1, item2], { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, tC);
    tl.to(top.e, { '--ring': 0, duration: 0.5 }, tC + 0.2);
    camTo(tC + 0.1, CAM_L, 1.4);
    const yes = K.box(ui, 'c5-out blue', 80, 176, null, null, '说得出');
    const no = K.box(ui, 'c5-out', RIGHT_X + 34, 176, null, null, '说不出');
    const yesCap = K.box(ui, 'c5-cap', 80, 822, null, null, '只剩排列');
    const noCap = K.box(ui, 'c5-cap strong', RIGHT_X + 34, 822, null, null, '还没想完');
    K.show(yes, T('c5.5', '说') - 0.1, { y: 20, duration: 0.6 });
    // said: the rest simply falls into place
    const tRest = T('c5.5', '剩下') - 0.1;
    lock(restIdx, tRest, 0.6, 0.07);
    restIdx.forEach((i, n) => draw(P.hooks[i], tRest + 0.15 + n * 0.07, { duration: 0.35 }));
    K.show(yesCap, T('c5.5', '只是') - 0.15, { y: 16, duration: 0.5 });
    // not said: the same pieces, the same top box — left empty
    const Q = build(world2, false), loose2 = pile(47), r2 = K.rng(9);
    gsap.set(world2, { x: CAM_L.x, y: CAM_L.y, scale: CAM_L.s, transformOrigin: '0 0', autoAlpha: 0 });
    gsap.set(Q.top.e, { x: TOP.x, y: TOP.y, width: TOP.w, height: TOP.h, '--edge': 1, '--fill': 1 });
    gsap.set([Q.top.ph1, Q.top.ph2, Q.top.txt], { autoAlpha: 0 });
    Q.top.bar.style.left = barL + 'px'; Q.top.caret.style.left = barL + 'px';
    gsap.set(Q.top.bar, { width: barW, backgroundColor: PAPER });
    Q.pieces.forEach((p, i) => gsap.set(p.e, arranged(SLOTS[i])));
    const tD = T('c5.5', '说', 1) - 0.4, tFall = tD + 0.45;
    tl.to(world2, { autoAlpha: 1, duration: 0.01 }, tD);
    tl.to(world2, { x: RIGHT_X, duration: 1.0, ease: 'power3.inOut' }, tD);
    const div = K.path(g1, 'M960,186 L960,890', 'ln thin');
    draw(div, tD + 0.3, { duration: 0.7 });
    K.show(no, T('c5.5', '说', 1) - 0.05, { y: 20, duration: 0.6 });
    tl.to(Q.top.e, { '--edge': 0, '--fill': 0, duration: 0.5, ease: 'power2.inOut' }, tFall);
    tl.to(Q.top.bar, { autoAlpha: 0, duration: 0.3 }, tFall);
    tl.to([...Q.ups, ...Q.hooks.filter(Boolean)], { autoAlpha: 0, duration: 0.35 }, tFall);
    Q.pieces.forEach((p, i) => tl.to(p.e, Object.assign(asBar(loose2[i].cx, loose2[i].cy, SEGS[segOf[i]].w, loose2[i].rot), { duration: 0.9, ease: 'power2.inOut' }), tFall + 0.05 + r2() * 0.3));
    K.show(noCap, T('c5.5', '还') - 0.1, { y: 16, duration: 0.5 });

    // ---- c5.6 the film was built the same way: the bars turn into its own argument
    const tF = T('c5.6') - 0.45;
    tl.to([world2, yes, no, yesCap, noCap, div], { autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, tF);
    Film.onFrame(t => { Q.top.caret.style.opacity = t >= tFall + 0.5 && blink(t) ? 1 : 0; });
    camTo(tF + 0.15, CAM_0, 1.6);
    const say = (t, bar, txt, n, each) => {
      tl.to(bar, { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, t + n * each);
      tl.to(txt, { opacity: 1, duration: 0.5, ease: 'power2.out' }, t + 0.12 + n * each);
    };
    say(T('c5.6', '片子'), top.bar, top.txt, 0, 0);
    keyIdx.forEach((i, n) => say(T('c5.6', '也') - 0.05, pc[i].bar, pc[i].txt, n, 0.14));
    [...firstIdx, ...restIdx].sort((a, b) => a - b).forEach((i, n) => say(T('c5.6', '搭'), pc[i].bar, pc[i].txt, n, 0.055));

    // hand over to the end card: the evidence goes first, the top sentence last
    tl.to([...P.hooks.filter(Boolean), ...els([...firstIdx, ...restIdx])], { autoAlpha: 0, duration: 0.3, ease: 'power2.in', stagger: { each: 0.008, from: 'end' } }, E0 - 0.5);
    tl.to([...els(keyIdx), ...P.ups], { autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, E0 - 0.3);
  });

  // ------------------------------------------------------------------ end card
  Film.scene('c5-end', E0, Film.duration + 1, ({ root }) => {
    root.classList.add('night');
    K.el(root, 'grain'); K.el(root, 'vignette');
    gsap.set(root, { opacity: 0 });
    tl.to(root, { opacity: 1, duration: 0.7, ease: 'power2.out' }, E0);

    const g = K.svg(root);
    const cx = 960, y0 = 232;
    const marks = [70, 150, 230, 310].map((w, i) => K.path(g, `M${cx - w},${y0 + i * 30} L${cx + w},${y0 + i * 30}`, 'ln', { 'stroke-width': 4 }));
    draw(marks, E0 + 0.3, { duration: 0.6, stagger: 0.1, ease: 'power3.inOut' });
    const title = K.box(root, 't-hero c5-end-title', 0, 392, 1920, null, '金字塔原理');
    const chars = K.split(title);
    gsap.set(chars, { yPercent: 60, opacity: 0 });
    tl.to(chars, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.07 }, E0 + 0.55);
    const sub = K.box(root, 'c5-end-sub', 0, 628, 1920, null, '写不清楚，多半是还没想完');
    K.show(sub, E0 + 1.25, { y: 18, duration: 0.7 });
    const rule = K.box(root, 'c5-end-rule', 960 - 60, 742, 120, 2);
    gsap.set(rule, { scaleX: 0 });
    tl.to(rule, { scaleX: 1, duration: 0.7, ease: 'power3.inOut' }, E0 + 1.55);
    const credits = K.box(root, 'c5-end-credits', 0, 790, 1920, null, '<span>案例为合成，数字为虚构</span><span>旁白为合成语音</span><span>出处见配套页面</span>');
    K.show(credits, E0 + 1.9, { y: 0, duration: 0.8 });

    const black = K.el(root, 'fill', null, { background: '#05080d', zIndex: 80 });
    gsap.set(black, { autoAlpha: 0 });
    tl.to(black, { autoAlpha: 1, duration: 0.8, ease: 'power1.inOut' }, Film.duration - 0.8);
  });
})();
