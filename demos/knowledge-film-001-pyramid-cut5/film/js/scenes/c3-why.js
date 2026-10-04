/* Chapter 3 · 为什么管用
   Scene 1 (c3.1–c3.4): working memory as slots; a conclusion-last report read into four slots (示意);
   the same items with the conclusion first; the callback to the cold open.
   Scene 2 (c3.5–c3.9): the one direct experiment, what does hold (first position), three trades and their reader. */
(function () {
  const { T } = Film, tl = K.tl;
  const INK = '#0d1826', INK3 = '#7d8a9c', RULE = '#c3ccd8', BLUE = '#1f4fe0', RED = '#dd4a3c', PAPER = '#f2f4f7', MUTE = '#b3bcc9';

  Parts.chapterCard('c3', '03', '依据');

  const title = (parent, html) => K.lines(parent, 't-title c3-title', [html]);
  /* Hidden at build, opacity only: for elements whose position is already driven by x / y. */
  const fade = (targets, at, o) => {
    gsap.set(targets, { autoAlpha: 0 });
    return tl.to(targets, Object.assign({ autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, o), at);
  };

  // ================================================================ scene 1
  const A0 = T('c3.card', 'end') - 0.05, A1 = T('c3.5', '直接') + 0.3;
  Film.scene('c3-memory', A0, A1, ({ root }) => {
    root.classList.add('paper');
    const world = K.el(root, 'fill');
    const top = K.el(root, 'fill');
    K.el(root, 'grain'); K.el(root, 'vignette');
    K.chrome(root, { chapter: ['03', '依据'] });
    gsap.set(root, { opacity: 0 });
    tl.to(root, { opacity: 1, duration: 0.3, ease: 'power2.out' }, A0);

    // ---- geometry
    const QW = 230, QH = 64, QY = 290, qx = k => 200 + k * 258;            // document order, six places
    const SW = 340, SH = 150, SY = 440, sx = j => 200 + j * (1180 / 3);    // the reader's four slots
    const ty = i => 616 + (i - 1) * 74;                                    // places under the conclusion
    const NAMES = ['结论', '第一条', '第二条', '第三条', '第四条', '第五条'];

    // ---- c3.1 "这个顺序": the order itself, conclusion first
    const kick0 = K.box(top, 'c3-kick', 200, 404, null, null, '结论在前');
    const ghosts = NAMES.map((_, k) => K.box(world, 'c3-ghost', qx(k), QY, QW, QH));
    gsap.set(ghosts, { autoAlpha: 0 });

    // slots are built before the chips so that chips travel above them
    const slots = [], fills = [];
    for (let i = 0; i < 7; i++) {
      const s = K.box(world, 'c3-slot', 200 + i * 222, 590, 188, 188);
      slots.push(s); fills.push(K.el(s, 'c3-fill'));
    }
    const g = K.svg(world);

    const chips = NAMES.map((n, i) => {
      const c = K.el(world, 'c3-chip' + (i ? '' : ' top'));
      c.lab = K.el(c, 'c3-chip-a', n);
      gsap.set(c, { x: qx(i), y: 470, scale: 0.94, autoAlpha: 0 });
      return c;
    });
    const alt = K.el(chips[0], 'c3-chip-b', '煮饺子');
    gsap.set(alt, { yPercent: 110 });

    K.show(kick0, A0 + 0.2, { y: 0, duration: 0.4 });
    const dir = [K.path(g, 'M200,572 L1716,572', 'ln soft'), K.path(g, 'M1698,561 L1716,572 L1698,583', 'ln soft')];   // read left to right
    K.draw(dir[0], A0 + 0.55, { duration: 0.9, ease: 'power2.inOut' });
    K.draw(dir[1], A0 + 1.35, { duration: 0.2 });
    tl.to(chips, { autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out' }, A0 + 0.3);

    // "常见的解释是：读者的工作记忆很小"
    const e1 = Math.max(T('c3.1', '常见') - 0.05, A0 + 1.6);
    K.hide([kick0, ...dir], e1, { duration: 0.3 });
    tl.to(chips, { autoAlpha: 0, y: 430, duration: 0.5, ease: 'power2.in', stagger: 0.03 }, e1);
    const kick1 = K.box(top, 'c3-kick', 200, 120, null, null, '常见的解释');
    K.show(kick1, e1 + 0.2, { y: 0, duration: 0.5 });
    const t1 = title(top, '读者的工作记忆：容量很小');
    K.rise(t1.inners, Math.max(T('c3.1', '读者') - 0.3, e1 + 0.5));
    K.show(slots, T('c3.1', '很') - 0.25, { y: 22, stagger: 0.05, duration: 0.5 });
    gsap.set(fills, { scale: 0 });

    // ---- c3.2 Miller 1956: about seven. Cowan 2001: about four.
    const year = K.box(world, 't-num c3-year', 200, 384, null, null, '1956');
    K.show(year, T('c3.2') + 0.05, { y: 18, duration: 0.6 });
    const n1 = K.lines(world, 'c3-name', ['乔治·米勒', 'George A. Miller']);
    const n2 = K.lines(world, 'c3-name', ['纳尔逊·考恩', 'Nelson Cowan']);
    K.rise(n1.inners, T('c3.2', '乔治') - 0.15, { stagger: 0.1, duration: 0.7 });

    const est = K.box(world, 'c3-est', 1020, 360, 700, null, '<span>约</span><b class="t-num">1</b><span>个单位</span>');
    const estN = est.querySelector('b'), ev = { v: 1 };
    const fillAt = T('c3.2', '人') + 0.1;
    K.show(est, fillAt - 0.1, { y: 0, duration: 0.4 });
    tl.to(fills, { scale: 1, duration: 0.4, ease: 'back.out(1.8)', stagger: 0.16 }, fillAt);
    tl.to(ev, { v: 7, duration: 0.96, ease: 'none' }, fillAt + 0.08);
    Film.onFrame(() => { const s = String(Math.round(ev.v)); if (estN.textContent !== s) estN.textContent = s; });
    K.source(root, 'Miller (1956), <i>Psychological Review</i> 63: “The Magical Number Seven, Plus or Minus Two”', T('c3.2', '乔治'), T('c3.2', '上下') + 0.55);

    const y2 = Math.max(T('c3.2', '上下') + 0.5, T('c3.2', '年', 1) - 0.75);   // "2001年"
    K.count(year, 1956, 2001, y2, 0.9);
    K.sink(n1.inners, y2 + 0.35, { duration: 0.4, stagger: 0.04 });
    K.rise(n2.inners, T('c3.2', '纳尔逊') - 0.15, { stagger: 0.1, duration: 0.7 });
    const fix = T('c3.2', '修正') - 0.05;
    tl.to(fills.slice(4).reverse(), { scale: 0, duration: 0.3, ease: 'power2.in', stagger: 0.14 }, fix);
    tl.to(ev, { v: 4, duration: 0.5, ease: 'none' }, fix + 0.1);
    tl.to(slots.slice(4).reverse(), { '--solid': 0, duration: 0.35, stagger: 0.14 }, fix + 0.15);
    tl.to(estN, { color: BLUE, duration: 0.3 }, T('c3.2', '四') - 0.05);
    const cond = K.box(world, 'c3-note', 200, 824, null, null, '测量条件：不可复述，不可归组');
    K.show(cond, T('c3.2', '左右'), { y: 0, duration: 0.5 });
    K.source(root, 'Cowan (2001), <i>Behavioral and Brain Sciences</i> 24(1): “The magical number 4 in short-term memory”', T('c3.2', '纳尔逊'), T('c3.3') - 0.45);

    // ---- c3.3 a report whose conclusion comes last, read into four slots
    const z = Math.max(T('c3.3') - 0.25, T('c3.2', '左右') + 0.55);
    K.hide([year, est, cond, kick1], z, { duration: 0.35 });
    K.sink(n2.inners, z, { duration: 0.4, stagger: 0.04 });
    K.sink(t1.inners, z, { duration: 0.4 });
    tl.to(slots.slice(4), { autoAlpha: 0, duration: 0.3 }, z);
    tl.to(fills.slice(0, 4), { scale: 0, duration: 0.35, ease: 'power2.in', stagger: 0.04 }, z);
    slots.slice(0, 4).forEach((s, j) =>
      tl.to(s, { left: sx(j), top: SY, width: SW, height: SH, duration: 1.0, ease: 'power3.inOut' }, z + 0.2 + j * 0.03));

    const kick2 = K.box(top, 'c3-kick', 200, 120, null, null, '按此思路的示意，非实验结果');
    K.show(kick2, z + 0.45, { y: 0, duration: 0.5 });
    const t2 = title(top, '结论在后的报告');
    K.rise(t2.inners, T('c3.3', '读') - 0.1);

    // the queue comes back, conclusion at the far end
    const k33 = i => (i === 0 ? 5 : i - 1);
    chips.forEach((c, i) => tl.to(c, { x: qx(k33(i)), y: QY, duration: 0.01 }, T('c3.2')));
    const q0 = T('c3.3', '一') - 0.1;
    tl.to(ghosts, { autoAlpha: 1, duration: 0.4, stagger: 0.05 }, q0);
    chips.forEach((c, i) => tl.to(c, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power3.out' }, q0 + k33(i) * 0.13));

    const hand = K.box(world, 'c3-note', 200, 386, null, null, '读者手中');
    K.show(hand, T('c3.3', '读者') - 0.1, { y: 0, duration: 0.5 });

    // "把前面的每一条先拿在手里"
    const inSlot = j => ({ x: sx(j) + (SW - QW) / 2, y: SY + (SH - QH) / 2 });
    const take = T('c3.3', '前面') - 0.12;
    const beat = Math.max(0.28, Math.min(0.55, (T('c3.3', '却') - 0.7 - take) / 3));
    for (let i = 1; i <= 4; i++) tl.to(chips[i], Object.assign(inSlot(i - 1), { duration: 0.6, ease: 'power3.inOut' }), take + (i - 1) * beat);

    // "却不知道往哪儿放": nothing joins the four
    const by = SY + SH, cxs = [0, 1, 2, 3].map(j => sx(j) + SW / 2);
    const ask = [
      ...cxs.map(x => K.path(g, `M${x},${by + 12} L${x},${by + 40}`, 'c3-dash')),
      K.path(g, `M${cxs[0]},${by + 40} L${cxs[3]},${by + 40}`, 'c3-dash'),
      K.path(g, `M960,${by + 40} L960,${by + 68}`, 'c3-dash'),
    ];
    const askT = K.box(world, 'c3-ask', 660, by + 76, 600, null, '无处可放');
    fade(ask, T('c3.3', '却') - 0.05, { duration: 0.4, stagger: 0.04 });
    K.show(askT, T('c3.3', '往') - 0.1, { y: 0, duration: 0.5 });
    const late = T('c3.3', '拿到') - 0.05;
    tl.to([...ask, askT], { autoAlpha: 0, duration: 0.3 }, late - 0.3);

    // "拿到后面几条，前面的已经掉了"
    const floor = K.path(g, 'M200,950 L1720,950', 'ln thin');
    K.draw(floor, late + 0.3, { duration: 0.6 });
    const drop = (c, at, x, rot) => {
      tl.to(c, { y: 882, x, rotation: rot * 1.6, duration: 0.6, ease: 'power2.in' }, at);
      tl.to(c, { rotation: rot, duration: 0.25, ease: 'power2.out' }, at + 0.6);
      tl.to(c, { color: INK3, borderColor: RULE, duration: 0.4 }, at + 0.25);
    };
    const d2 = Math.max(T('c3.3', '掉') - 0.55, late + 1.0);   // the second one lands on "掉"
    tl.to(chips[5], Object.assign(inSlot(0), { duration: 0.6, ease: 'power3.inOut' }), late);
    drop(chips[1], late + Math.min(0.5, (d2 - late) * 0.33), 262, -6);
    tl.to(chips[0], Object.assign(inSlot(1), { duration: 0.6, ease: 'power3.inOut' }), Math.max(late + 0.3, d2 - 0.5));
    drop(chips[2], d2, 668, 5);
    const fell = K.box(world, 'c3-fell', 960, 866, null, null, '已遗忘');
    K.show(fell, d2 + 0.6, { y: 0, duration: 0.4 });

    // ---- c3.4 the same items, conclusion first
    const r = Math.max(T('c3.4') - 0.5, d2 + 1.05);
    K.hide([fell, floor], r, { duration: 0.3 });
    K.sink(t2.inners, r, { duration: 0.4 });
    const t3 = title(top, '<em>结论在前</em>的报告');
    K.rise(t3.inners, r + 0.3);
    chips.forEach((c, i) =>
      tl.to(c, { x: qx(i), y: QY, rotation: 0, color: i ? INK : BLUE, borderColor: i ? INK : BLUE, duration: 0.6, ease: 'power3.inOut' }, r + i * 0.03));

    // "先给结论": the conclusion takes one slot and becomes the place
    const give = Math.max(T('c3.4', '结论') - 0.18, r + 0.65);
    tl.to(chips[0], { x: sx(0), y: SY, width: SW, height: SH, backgroundColor: BLUE, color: PAPER, fontSize: 64, duration: 0.7, ease: 'power3.inOut' }, give);

    // "每条新信息一进来就有地方放"
    const sp = 201.5;
    const spine = K.path(g, `M${sp},${SY + SH} L${sp},${ty(5) + 32}`, 'ln blue');
    const ticks = [1, 2, 3, 4, 5].map(i => K.path(g, `M${sp},${ty(i) + 32} L${sp + 26},${ty(i) + 32}`, 'ln blue'));
    const BW = [563, 1338, 845, 1056, 704];                     // the five lines of the cold open, same proportions
    const come = Math.max(T('c3.4', '每') + 0.1, give + 0.5), gap = Math.max(0.25, (T('c3.4', '放') - 0.5 - come) / 4);
    K.draw(spine, come, { duration: gap * 4 + 0.45, ease: 'none' });
    const tails = [];
    for (let i = 1; i <= 5; i++) {
      const at = come + (i - 1) * gap;
      tl.to(chips[i], { x: 242, y: ty(i), duration: 0.55, ease: 'power3.inOut' }, at);
      K.draw(ticks[i - 1], at + 0.35, { duration: 0.25 });
      const tail = K.box(world, 'c3-tail', 242 + QW + 16, ty(i) + 15, BW[i - 1] - QW - 16, 34);
      gsap.set(tail, { scaleX: 0, transformOrigin: '0 50%' });
      tl.to(tail, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, at + 0.5);
      tails.push(tail);
    }

    // "和那个标题一样：煮饺子" — the picture from the cold open
    const cb = Math.max(T('c3.4', '和') - 0.2, come + gap * 4 + 0.6);
    K.hide([...ghosts, hand, ...slots.slice(0, 4)], cb, { duration: 0.45 });
    K.sink(t3.inners, cb, { duration: 0.4 });
    tl.to(world, { y: -170, duration: 1.1, ease: 'power3.inOut' }, cb);
    for (let i = 1; i <= 5; i++) {
      tl.to(chips[i].lab, { opacity: 0, duration: 0.25 }, cb + 0.05);
      tl.to(chips[i], { width: QW + 20, height: 34, y: ty(i) + 15, backgroundColor: INK, borderRadius: 3, duration: 0.7, ease: 'power3.inOut' }, cb + 0.2 + i * 0.06);
    }
    const land = T('c3.4', '煮') - 0.12;
    tl.to(chips[0].lab, { yPercent: -110, duration: 0.35, ease: 'power3.in' }, land - 0.3);
    tl.to(alt, { yPercent: 0, duration: 0.7, ease: 'expo.out' }, land);
    const echo = K.box(world, 'c3-note', 580, SY + 52, null, null, '片头那段话的标题');
    K.show(echo, land + 0.45, { x: -16, y: 0, duration: 0.6 });

    // ---- c3.5 "不过要说实话": the illustration steps back, its label steps forward
    const but = T('c3.5') - 0.05;
    tl.to(chips.slice(1), { backgroundColor: MUTE, borderColor: MUTE, duration: 0.6, stagger: 0.03 }, but);
    tl.to(tails, { backgroundColor: MUTE, duration: 0.6, stagger: 0.03 }, but);
    tl.to(chips[0], { backgroundColor: MUTE, borderColor: MUTE, duration: 0.6 }, but);
    tl.to([spine, ...ticks], { stroke: MUTE, duration: 0.6 }, but);
    tl.to(kick2, { color: INK, duration: 0.5 }, but);
    K.hide(echo, but, { duration: 0.3 });
    tl.to([world, kick2], { autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, A1 - 0.55);
  });

  // ================================================================ scene 2
  const B0 = T('c3.5', '直接') - 0.3, B1 = T('c4.card');
  Film.scene('c3-proof', B0, B1, ({ root }) => {
    root.classList.add('paper');
    const world = K.el(root, 'fill');
    const top = K.el(root, 'fill');
    K.el(root, 'grain'); K.el(root, 'vignette');
    K.chrome(root, { chapter: ['03', '依据'] });
    gsap.set(root, { opacity: 0 });
    tl.to(root, { opacity: 1, duration: 0.35, ease: 'power2.out' }, B0);

    // ---- c3.5 one direct experiment: two orders, the same recall
    const kickB = K.box(top, 'c3-kick', 200, 120, null, null, '直接比较两种顺序的实验不多 · 其中一项（2020）');
    K.show(kickB, B0 + 0.25, { y: 0, duration: 0.5 });
    const tB = title(top, '同一份文本，两种顺序');
    K.rise(tB.inners, T('c3.5', '两种') - 0.2);

    const RY = [420, 590], X0 = 520, CW = 100, CG = 12, CH = 100, LY = ri => RY[ri] + 14, XE = X0 + 8 * CW + 7 * CG;
    const rows = ['结论在前', '结论在后'].map((label, ri) => {
      const lab = K.box(world, 't-lead c3-rowlab', 200, LY(ri), null, null, label);
      const cells = [];
      for (let i = 0; i < 8; i++) cells.push(K.el(K.box(world, 'c3-cell', X0 + i * (CW + CG), RY[ri], CW, CH), 'c3-cell-fill'));
      const val = K.box(world, 'c3-val', XE + 26, RY[ri], null, null, '<span>约</span><b class="t-num">6</b>');
      K.show([lab, ...cells.map(c => c.parentNode)], T('c3.5', '两种') + 0.15 + ri * 0.2, { y: 18, stagger: 0.02, duration: 0.5 });
      return { lab, cells, val, boxes: cells.map(c => c.parentNode) };
    });
    const axis = K.box(world, 'c3-note', X0, RY[1] + CH + 22, null, null, '读完后答对的题数（共 8 题）');
    K.show(axis, T('c3.5', '实验') - 0.1, { y: 0, duration: 0.5 });
    const got = { v: 0 }, fillAt = T('c3.5', '结果') - 0.15;
    tl.to(got, { v: 6, duration: 0.9, ease: 'power2.out' }, fillAt);
    Film.onFrame(() => {
      for (const r of rows) for (let i = 0; i < 8; i++) r.cells[i].style.transform = `scaleX(${Math.max(0, Math.min(1, got.v - i))})`;
    });
    K.show(rows.map(r => r.val), fillAt + 0.6, { y: 0, x: -14, stagger: 0, duration: 0.5 });
    const g = K.svg(world);
    const bx = XE + 190;
    const br = K.path(g, `M${bx},${RY[0] + 10} L${bx + 22},${RY[0] + 10} L${bx + 22},${RY[1] + CH - 10} L${bx},${RY[1] + CH - 10}`, 'ln');
    K.draw(br, T('c3.5', '不是') - 0.15, { duration: 0.6 });
    const same = K.box(world, 'c3-same', bx + 46, (RY[0] + RY[1] + CH) / 2 - 30, null, null, '没有差别');
    K.show(same, T('c3.5', '一边倒') - 0.15, { y: 0, x: -14, duration: 0.5 });
    K.source(root, 'Li, Karreman &amp; de Jong (2020), <i>Journal of Business and Technical Communication</i> 34(4)：各组都答对约 6 题', T('c3.5', '实验') - 0.2, T('c3.6') - 0.3);

    // ---- c3.6 what does hold: whatever comes first is taken as the point
    const s6 = T('c3.6') - 0.2;
    K.hide([kickB, axis, same, br, ...rows.flatMap(r => [...r.boxes, r.val])], s6, { duration: 0.35 });
    K.sink(tB.inners, s6, { duration: 0.4 });
    const PX = [200, 1000], PY = 372, PW = 720, PH = 500, CAPY = 292;
    rows.forEach((r, ri) => tl.to(r.lab, { x: PX[ri] - 200, y: CAPY - LY(ri), duration: 0.9, ease: 'power3.inOut' }, s6 + 0.1));

    const kickC = K.box(top, 'c3-kick', 200, 120, null, null, '证据较充分的发现');
    K.show(kickC, T('c3.6') + 0.1, { y: 0, duration: 0.5 });
    const tC = title(top, '最先读到的内容被当成主旨');
    K.rise(tC.inners, T('c3.6', '读者') - 0.15);

    const WORDS = [['结论', '理由', '理由', '背景'], ['背景', '理由', '理由', '结论']];
    const BARS = [[310, 470, 400, 300], [330, 430, 480, 280]];
    const pages = WORDS.map((ws, pi) => {
      const p = K.box(world, 'c3-page', PX[pi], PY, PW, PH);
      const mark = K.box(p, 'c3-mark', 20, 34, PW - 44, 100);
      gsap.set(mark, { clipPath: 'inset(0% 100% 0% 0%)' });
      const rws = ws.map((w, i) => {
        const row = K.el(p, 'c3-row', `<div class="c3-word">${w}</div><div class="c3-bar" style="width:${BARS[pi][i]}px"></div>`);
        row.style.top = 42 + i * 108 + 'px';
        return row;
      });
      const tag = K.box(p, 'c3-tag' + (pi ? ' red' : ''), null, 52, null, null, '主旨');
      tag.style.right = '42px';
      K.show(p, s6 + 0.65 + pi * 0.12, { y: 26, duration: 0.7 });
      return { p, mark, rws, tag };
    });
    const [pa, pb] = pages;
    // "最先读到的内容": the reader's mark goes on line one, whatever it says
    tl.to([pa.mark, pb.mark], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power2.inOut', stagger: 0.12 }, T('c3.6', '最先') - 0.1);
    const m1 = T('c3.6', '主旨') - 0.15;
    tl.to(pa.mark, { borderColor: BLUE, backgroundColor: 'rgba(31,79,224,0.10)', duration: 0.4 }, m1);
    K.show(pa.tag, m1, { scale: 0.6, y: 0, duration: 0.5, ease: 'back.out(2.2)' });
    // "开头写的是背景，背景就被当成了重点"
    const bg = T('c3.6', '开头') - 0.15;
    tl.to([pa.p, rows[0].lab], { opacity: 0.38, duration: 0.5 }, bg);
    tl.to(pb.mark, { borderColor: RED, backgroundColor: 'rgba(221,74,60,0.10)', duration: 0.4 }, T('c3.6', '背景', 1) - 0.1);
    K.show(pb.tag, T('c3.6', '当成', 1) - 0.12, { scale: 0.6, y: 0, duration: 0.5, ease: 'back.out(2.2)' });
    tl.to(pb.rws[3], { opacity: 0.3, duration: 0.5 }, T('c3.6', '主旨', 1) - 0.1);
    K.source(root, 'Kieras (1980), <i>Memory &amp; Cognition</i> 8, 345–353: “Initial mention as a signal to thematic content in technical passages”', T('c3.6', '读者') - 0.3, T('c3.7') - 0.3);

    // ---- c3.7 three unrelated trades, one order
    const s7 = T('c3.7') - 0.15;
    const CX = [200, 725, 1250], CWD = 470, BY = 378, BH = 80, RULEY = 756;
    const cols = CX.map(() => K.el(world, 'fill'));
    cols[0].style.zIndex = 2;                                  // the other two first blocks slide out from under the apex
    K.hide([kickC, rows[1].lab], s7, { duration: 0.4 });
    K.hide(pb.p, s7, { duration: 0.4, x: 50 });
    K.sink(tC.inners, s7, { duration: 0.4 });
    tl.to([pa.p, rows[0].lab], { opacity: 1, duration: 0.25 }, s7);
    tl.to([...pa.rws.slice(1), pa.tag, rows[0].lab], { autoAlpha: 0, duration: 0.4 }, s7 + 0.4);
    tl.to(pa.p, { borderColor: 'rgba(195,204,216,0)', backgroundColor: 'rgba(248,249,251,0)', duration: 0.4 }, s7 + 0.4);

    // the marked first line of the conclusion-first page becomes the top of a pyramid
    const apex = K.box(cols[0], 'c3-block', PX[0] + 20, PY + 34, PW - 44, 100, '结论');
    gsap.set(apex, { autoAlpha: 0 });
    tl.to(apex, { autoAlpha: 1, duration: 0.3 }, s7 + 0.3);
    tl.to([pa.mark, pa.rws[0]], { autoAlpha: 0, duration: 0.3 }, s7 + 0.45);
    const AX = CX[0] + 125, AW = 220;
    tl.to(apex, { left: AX, top: BY, width: AW, height: BH, duration: 0.85, ease: 'power3.inOut' }, s7 + 0.5);

    const g1 = K.svg(cols[0]);
    const tree = s7 + 1.15;
    const apexBox = { x: AX, y: BY, w: AW, h: BH };
    const mids = [0, 1, 2].map(k => ({ x: CX[0] + k * 166, y: BY + 150, w: 138, h: 60 }));
    const leaves = mids.flatMap(m => [0, 1].map(k => ({ x: m.x + k * 74, y: BY + 280, w: 64, h: 44, up: m })));
    const e1 = mids.map(m => K.path(g1, K.elbow(apexBox, m), 'ln'));
    const e2 = leaves.map(l => K.path(g1, K.elbow(l.up, l), 'ln'));
    const midEls = mids.map(m => K.box(cols[0], 'c3-node', m.x, m.y, m.w, m.h));
    const leafEls = leaves.map(l => K.box(cols[0], 'c3-node', l.x, l.y, l.w, l.h));
    K.draw(e1, tree, { duration: 0.45, stagger: 0.06 });
    K.show(midEls, tree + 0.3, { y: -10, duration: 0.4, stagger: 0.06 });
    K.draw(e2, tree + 0.55, { duration: 0.35, stagger: 0.03 });
    K.show(leafEls, tree + 0.75, { y: -8, duration: 0.35, stagger: 0.03 });

    const caps = ['咨询', '新闻', '军队'].map((t, i) => K.box(cols[i], 'c3-cap', CX[i], 294, null, null, t));
    const holds = [1, 2].map(i => K.box(cols[i], 'c3-hold', CX[i], BY, CWD, 344));
    K.show(caps[0], tree - 0.2, { y: 14, duration: 0.5 });
    K.show([caps[1], holds[0]], T('c3.7', '互不') - 0.15, { y: 14, duration: 0.5, stagger: 0 });
    K.show([caps[2], holds[1]], T('c3.7', '相干') + 0.05, { y: 14, duration: 0.5, stagger: 0 });

    // "会走到同一个顺序上": the same blue first block lands in the other two
    const gl = K.svg(world);
    const links = [K.path(gl, `M${AX + AW},${BY + BH / 2} L${CX[1]},${BY + BH / 2}`, 'ln blue'), K.path(gl, `M${CX[1] + CWD},${BY + BH / 2} L${CX[2]},${BY + BH / 2}`, 'ln blue')];
    const go = T('c3.7', '同') - 0.15;
    const blocks = [
      K.box(cols[1], 'c3-block', AX, BY, AW, BH, '<span>最重要的事实</span>'),
      K.box(cols[2], 'c3-block', AX, BY, AW, BH, '<span class="en">main point</span>'),
    ];
    const blockText = blocks.map(b => b.firstChild);
    gsap.set(blockText, { autoAlpha: 0 });
    blocks.forEach((b, i) => {
      gsap.set(b, { autoAlpha: 0 });
      tl.to(b, { autoAlpha: 1, duration: 0.15 }, go + i * 0.14);
      tl.to(b, { left: CX[i + 1], width: CWD, duration: 0.95, ease: 'power3.inOut' }, go + i * 0.14);
    });
    K.draw(links, go + 0.75, { duration: 0.4, stagger: 0.15 });
    const tD = title(top, '三个行业，要点都在前');
    K.rise(tD.inners, T('c3.7', '同') - 0.25);

    // detail zone: a rule under the three, a blue segment under the one being described
    const rule = K.box(world, 'c3-rule', 200, RULEY, 1520, 2);
    gsap.set(rule, { scaleX: 0, transformOrigin: '0 50%' });
    const focus = K.box(world, 'c3-focus', CX[1], RULEY - 2, CWD, 6);
    gsap.set(focus, { autoAlpha: 0 });

    // "新闻写作有倒金字塔：最重要的事实，写在第一段"
    const nw = T('c3.7', '新闻') - 0.15;
    tl.to(rule, { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, nw - 0.3);
    tl.to(focus, { autoAlpha: 1, duration: 0.4 }, nw + 0.1);
    tl.to([cols[0], cols[2]], { opacity: 0.35, duration: 0.5 }, nw);
    K.hide(holds[0], nw + 0.3, { duration: 0.3 });
    const cxm = CX[1] + CWD / 2, apexY = BY + 370;
    const bands = [0, 1, 2, 3, 4].map(k => {
      const y = BY + 96 + k * 52, w = Math.round(CWD * (apexY - (y + 20)) / 370);
      const b = K.box(cols[1], 'c3-band', cxm - w / 2, y, w, 40);
      gsap.set(b, { scaleX: 0 });
      return b;
    });
    tl.to(bands, { scaleX: 1, duration: 0.6, ease: 'expo.out', stagger: 0.09 }, T('c3.7', '倒') - 0.3);
    const nName = K.lines(world, 't-title', ['倒金字塔']);
    nName.style.cssText += 'position:absolute;left:200px;top:788px;';
    K.rise(nName.inners, T('c3.7', '倒') - 0.1);
    K.show(blockText[0], T('c3.7', '最') - 0.1, { y: 0, duration: 0.5 });
    const nSub = K.box(world, 't-lead c3-news-sub', 510, 788, null, null, '第一段：最重要的事实');
    K.show(nSub, T('c3.7', '写在') - 0.1, { y: 0, x: -16, duration: 0.6 });
    K.source(root, '倒金字塔在 1880 年代前后成为通行写法：Pöttker (2003), <i>Journalism Studies</i> 4(4)', T('c3.7', '倒') + 0.3, T('c3.8') - 0.3);

    // ---- c3.8 the Army regulation
    const ar = T('c3.8') - 0.15;
    K.hide(nSub, ar - 0.1, { duration: 0.3 });
    K.sink(nName.inners, ar - 0.1, { duration: 0.4 });
    tl.to(focus, { left: CX[2], duration: 0.7, ease: 'power3.inOut' }, ar);
    tl.to(cols[1], { opacity: 0.35, duration: 0.5 }, ar);
    tl.to(cols[2], { opacity: 1, duration: 0.5 }, ar);
    K.hide(holds[1], ar + 0.3, { duration: 0.3 });
    const memo = [470, 430, 470, 395, 250].map((w, k) => {
      const b = K.box(cols[2], 'c3-band', CX[2], BY + 100 + k * 52, w, 30);
      gsap.set(b, { scaleX: 0, transformOrigin: '0 50%' });
      return b;
    });
    tl.to(memo, { scaleX: 1, duration: 0.55, ease: 'expo.out', stagger: 0.08 }, T('c3.8', '公文') - 0.2);
    const arLab = K.box(world, 'c3-note', 200, 774, null, null, '美国陆军公文条例 AR 25-50 · 第 1-38 段');
    K.show(arLab, T('c3.8', '条例') - 0.1, { y: 0, duration: 0.5 });
    const q1 = K.box(world, 'c3-quote', 200, 822, null, null, '“putting the main point at the beginning of the');
    const q2 = K.box(world, 'c3-quote', 200, 884, null, null, 'correspondence (bottom line up front)”');
    const qc1 = K.split(q1), qc2 = K.split(q2);
    const typeAt = T('c3.8', '有') - 0.1;
    const cps = Math.max(26, Math.min(44, (q1.textContent.length + q2.textContent.length) / Math.max(0.5, T('c3.8', '要点') - 0.35 - typeAt)));
    K.type([...qc1, ...qc2], typeAt, cps);
    K.show(blockText[1], typeAt + 0.55, { y: 0, duration: 0.4 });
    const h0 = q2.textContent.indexOf('bottom'), h1 = q2.textContent.indexOf('front') + 4;
    const hot = qc2.slice(h0, h1 + 1);
    const under = K.box(q2, 'c3-under', qc2[h0].offsetLeft, 58, qc2[h1].offsetLeft + qc2[h1].offsetWidth - qc2[h0].offsetLeft, 4);
    gsap.set(under, { scaleX: 0 });
    const typed = typeAt + (qc1.length + qc2.length) / cps;
    tl.to(under, { scaleX: 1, duration: 0.5, ease: 'power3.out' }, typed + 0.05);
    tl.to(hot, { color: BLUE, duration: 0.3 }, typed + 0.05);
    const gloss = K.box(world, 'c3-gloss', Math.max(CX[2], 200 + q2.offsetWidth + 60), 884, null, null, '要点放在公文开头');
    K.show(gloss, Math.max(T('c3.8', '要点') - 0.1, typed + 0.2), { y: 0, x: -16, duration: 0.6 });
    K.source(root, 'Army Regulation 25-50, <i>Preparing and Managing Correspondence</i>（2020 年 10 月 10 日），第 1-38 段', T('c3.8', '条例') - 0.1, T('c3.9') - 0.3);

    // ---- c3.9 "咨询、新闻、军队，面对的是同一种读者：时间少，要做决定"
    const s9 = T('c3.9') - 0.25;
    K.hide([arLab, q1, q2, gloss], s9, { duration: 0.35 });
    tl.to(focus, { left: CX[0], duration: 0.5, ease: 'power3.inOut' }, s9);
    tl.to(cols[2], { opacity: 0.35, duration: 0.4 }, s9);
    tl.to(cols[2], { opacity: 1, duration: 0.4 }, T('c3.9', '军队') - 0.15);
    tl.to(cols[0], { opacity: 1, duration: 0.4 }, s9);
    tl.to(focus, { width: CX[1] + CWD - CX[0], duration: 0.35, ease: 'power3.inOut' }, T('c3.9', '新闻') - 0.2);
    tl.to(cols[1], { opacity: 1, duration: 0.4 }, T('c3.9', '新闻') - 0.15);
    tl.to(focus, { width: 1520, duration: 0.35, ease: 'power3.inOut' }, T('c3.9', '军队') - 0.2);

    const RB = { x: 690, y: 860, w: 540, h: 112 };
    const g9 = K.svg(world);
    const down = CX.map(x => K.path(g9, K.elbow({ x, y: RULEY + 4, w: CWD, h: 0 }, RB, 16), 'ln blue'));
    const same9 = T('c3.9', '一样的是') - 0.1;
    K.draw(down, same9 - 0.5, { duration: 0.6, stagger: 0.05 });
    const reader = K.box(world, 'c3-reader', RB.x, RB.y, RB.w, RB.h, '要点在前');
    K.show(reader, same9, { y: -14, duration: 0.6 });
    const cy = RB.y + RB.h / 2;
    const dashL = K.path(g9, `M${RB.x},${cy} L${RB.x - 44},${cy}`, 'ln');
    const trL = K.box(world, 'c3-trait', 200, RB.y, RB.x - 44 - 24 - 200, null, '读者时间少');
    trL.style.textAlign = 'right';
    K.draw(dashL, T('c3.9', '时间') - 0.25, { duration: 0.3 });
    K.show(trL, T('c3.9', '时间') - 0.1, { y: 0, x: 16, duration: 0.55 });

    // clear before the next chapter card
    const out = T('c4.card') - 0.8;
    K.sink(tD.inners, out, { duration: 0.4 });
    tl.to(world, { autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, out);
  });
})();
