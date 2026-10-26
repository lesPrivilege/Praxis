/* Chapter 4, 怎样被用坏, apart from the Columbia slide (c4b-columbia.js).
   Each misuse is a deformation of the pyramid built in Chapter 2. The three key-line boxes are the same
   elements all the way: they hold the tree (c4.1–c4.3), close up into one whole cut three ways (c4.4–c4.5),
   wait as a small strip, are laid over a causal loop as three cells (c4.6–c4.7), and return under a top
   that was written before the evidence (c4.9–c4.10). */
(function () {
  const { T } = Film, tl = K.tl;
  const CH = ['04', '怎样被用坏'];
  const BLUE = '#1f4fe0', RED = '#dd4a3c', INK = '#0d1826';
  Parts.chapterCard('c4', '04', '怎样被用坏');

  // ------------------------------------------------------------ local helpers
  const R = (x, y, w, h) => ({ x, y, w, h });
  const css = r => ({ left: r.x, top: r.y, width: r.w, height: r.h });
  const bx = (p, cls, r, html) => K.box(p, cls, r.x, r.y, r.w, r.h, html);
  const move = (e, r, at, dur, ease) => tl.to(e, Object.assign({ duration: dur || 1, ease: ease || 'power3.inOut' }, css(r)), at);
  const snap = (e, vars, at) => tl.to(e, Object.assign({ duration: 0.01, ease: 'none' }, vars), at);   // a change made out of sight
  const on = (e, at, dur) => tl.to(e, { autoAlpha: 1, duration: dur || 0.4, ease: 'power2.out' }, at);
  const off = (e, at, dur) => tl.to(e, { autoAlpha: 0, duration: dur || 0.35, ease: 'power2.in' }, at);
  const hidden = e => { gsap.set(e, { autoAlpha: 0 }); return e; };
  const pulse = (e, at, hold) => { tl.to(e, { '--ring': 1, duration: 0.3 }, at); tl.to(e, { '--ring': 0, duration: 0.5 }, at + (hold || 0.6)); };

  /* 一 二 三 四 五 beside the chapter tag: where we are in the list. */
  function index(root) {
    const wrap = K.el(root, 'c4-index');
    const it = ['一', '二', '三', '四', '五'].map(n => K.el(wrap, 'c4-ix', n));
    const cur = (i, at) => {
      tl.to(it[i], { color: BLUE, duration: 0.4 }, at);
      if (i > 0) tl.to(it[i - 1], { color: INK, duration: 0.4 }, at);
    };
    return { wrap, it, cur };
  }
  const title = (root, no, text) => K.lines(root, 'c4-title', [`<b>${no}、</b>${text}`]);

  // ------------------------------------------------------------ geometry of the pyramid
  const COLX = [180, 585, 990], COLW = 350, CX = 40;
  const TOPR = R(450, 250, 620, 96), KY = 420, KH = 90, CY = 570, CP = 68, CARDH = 56;
  const keyR = i => R(COLX[i], KY, COLW, KH);
  const cardR = (i, row) => R(COLX[i] + CX, CY + row * CP, COLW - CX, CARDH);
  const spineH = n => CY + (n - 1) * CP + CARDH / 2 - (KY + KH);
  const cntY = n => CY + n * CP + 6;
  const KEYA = ['价格解释不了', '走的是没用起来的', '辅导能用起来'];
  const KEYB = ['对手更便宜', '客户都嫌贵', '不降就不续'];
  const KIND = [['折扣一样', '嫌贵一样'], ['续约对比', '流失构成', '首月工单', '客户访谈', '回款变慢'], ['试点启用', '辅导成本', '工单减半']];
  const HONEST = ['折扣 7.8 折对 7.9 折', '嫌贵 38% 对 36%', '未启用：续约 61%', '已启用：续约 93%', '试点启用率 85%', '对照组启用率 48%'];
  const FITS = ['对手报价低两成', '竞品送半年', '客户嫌贵', '流失客户 38% 嫌贵', '要求打折再续约', '“价格能再谈谈吗”'];
  // the same three boxes, as one whole, as a parked strip, as three cells
  const BAR = [R(210, 470, 503, 150), R(710, 470, 503, 150), R(1210, 470, 500, 150)];
  const STRIP = [R(1420, 140, 110, 56), R(1527, 140, 110, 56), R(1634, 140, 110, 56)];
  const CELL = [R(170, 250, 513, 710), R(680, 250, 563, 710), R(1240, 250, 510, 710)];

  const A0 = T('c4.card', 'end') - 0.1, A1 = T('c4.11');
  Film.scene('c4-misuse', A0, A1, ({ root }) => {
    root.classList.add('paper');
    root.style.isolation = 'isolate';              // keep this scene's z-indexed chrome under the scene that follows it
    const world = K.el(root, 'fill');
    K.el(root, 'grain'); K.el(root, 'vignette');
    const chrome = K.chrome(root, { chapter: CH, badge: '合成案例 · 数字为虚构' });
    const ix = index(root);
    gsap.set(root, { opacity: 0 });
    tl.to(root, { opacity: 1, duration: 0.4, ease: 'power2.out' }, A0);

    // ------------------------------------------------------------ the pyramid
    const pyr = K.el(world, 'fill c4-pyr');
    const g = K.svg(pyr);
    const top = bx(pyr, 'c4-top', TOPR, '<div class="c4-lab">不降价，投首月辅导</div><div class="c4-lab">必须降价</div>');
    const [topA, topB] = top.children;
    const topChars = K.split(topB);
    const keys = [0, 1, 2].map(i => bx(pyr, 'c4-key', keyR(i), `<div class="c4-lab">${KEYA[i]}</div><div class="c4-lab">${KEYB[i]}</div>`));
    const keyA = keys.map(k => k.children[0]), keyB = keys.map(k => k.children[1]);
    gsap.set(keyB, { autoAlpha: 0 });
    const card = (cls, r, text) => bx(pyr, 'c4-card ' + cls, r, `<span>${text}</span>`);
    const etc = hidden(card('c4-etc', cardR(1, 2), '其他'));
    const hollow = card('c4-hollow', cardR(0, 2), '凑一条');
    const cardsA = KIND.map((col, i) => col.map((t, r) => card('', cardR(i, r), t)));
    const spA = KIND.map((col, i) => K.box(pyr, 'c4-spine', COLX[i] + 16, KY + KH, null, 0));
    const elbA = [0, 1, 2].map(i => K.path(g, K.elbow(TOPR, keyR(i), 14), 'ln'));

    // ------------------------------------------------------------ c4.1 · the sound structure
    gsap.set(pyr, { x: 78, y: -86, scale: 1.16 });
    const t1 = T('c4.1') + 0.05;
    gsap.set(top, { autoAlpha: 0, scale: 0.94 });
    tl.to(top, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'expo.out' }, t1);
    K.draw(elbA, t1 + 0.3, { duration: 0.6, stagger: 0.06 });
    K.show(keys, t1 + 0.65, { y: 20, stagger: 0.08, duration: 0.6 });
    spA.forEach((s, i) => tl.to(s, { height: spineH(KIND[i].length), duration: 0.6, ease: 'power2.inOut' }, t1 + 1.0));
    K.show(cardsA.flat(), t1 + 1.1, { x: -14, y: 0, stagger: 0.04, duration: 0.5 });
    K.show(ix.it, T('c4.1', '办法') - 0.15, { y: 10, stagger: 0.13, duration: 0.45 });

    // ------------------------------------------------------------ c4.2 · 凑三点: every group forced to three
    tl.to(pyr, { x: 0, y: 0, scale: 1, duration: 1.2, ease: 'power3.inOut' }, T('c4.2') - 0.3);
    ix.cur(0, T('c4.2', '头') - 0.05);
    const ttl1 = title(root, '一', '凑三点');
    K.rise(ttl1.inners, T('c4.2', '凑') - 0.2);
    const tpl = hidden(K.box(pyr, 'c4-tpl', 164, 558, 1192, 216));
    const tplLab = hidden(K.box(pyr, 'c4-note', 1366, 556, null, null, '版面'));
    on([tpl, tplLab], T('c4.2', '每') - 0.2, 0.5);
    // "不多": five kinds, three slots; the last three are crammed into one box
    const sq = T('c4.2', '不多') - 0.1, slot = cardR(1, 2);
    cardsA[1].slice(2).forEach((c, k) => {
      tl.to(c.firstChild, { autoAlpha: 0, duration: 0.2 }, sq);
      tl.to(c, { left: slot.x + 10, top: slot.y + 8 + k * 15, width: 176, height: 10, borderColor: '#7d8a9c', '--tick': 0, backgroundColor: '#c3ccd8', duration: 0.6, ease: 'power3.inOut' }, sq + k * 0.05);
    });
    on(etc, sq + 0.3, 0.3);
    tl.to(spA[1], { height: spineH(3), duration: 0.6, ease: 'power3.inOut' }, sq);
    // "不少": two kinds, three slots; a hollow third fills the row
    const fill = T('c4.2', '不少') - 0.05;
    K.show(hollow, fill, { y: -16, duration: 0.45 });
    tl.to(spA[0], { height: spineH(3), duration: 0.45, ease: 'power3.inOut' }, fill);
    const cnt = [0, 1, 2].map(i => K.box(pyr, 'c4-cnt', COLX[i] + CX, cntY(3), null, null, '<b class="t-num">3</b><span><i>条</i><i>类</i></span>'));
    cnt.forEach(c => gsap.set(c.querySelector('i + i'), { autoAlpha: 0 }));
    K.show(cnt, T('c4.2', '都是') - 0.05, { y: 12, stagger: 0.1, duration: 0.45 });
    const cap2 = K.box(world, 'c4-say', 1450, 600, null, null, '三条，<br>看着像结构');
    K.show(cap2, T('c4.2', '看着') - 0.25, { y: 16 });

    // ------------------------------------------------------------ c4.3 · the rules say nothing about number
    const t3 = T('c4.3');
    off(cap2, t3 - 0.15, 0.3);
    const rlab = K.box(world, 'c4-kick', 1450, 262, null, null, '三条规则');
    const rules = ['上一层概括下一层', '同一组属于同一类', '顺序说得出道理'].map((t, i) =>
      K.box(world, 'c4-rule', 1450, 322 + i * 64, null, null, `<b class="t-num">${i + 1}</b>${t}`));
    K.show(rlab, T('c4.3', '三条') - 0.15, { y: 0 });
    K.show(rules, T('c4.3', '规则') - 0.2, { x: 20, y: 0, stagger: 0.16, duration: 0.5 });
    const noNum = K.box(world, 'c4-say', 1450, 548, null, null, '没有一条<br>规定数量');
    K.show(noNum, T('c4.3', '没有') - 0.15, { y: 16 });
    tl.to(cnt, { '--strike': 1, duration: 0.3, stagger: 0.09, ease: 'power2.out' }, T('c4.3', '数量') - 0.1);
    // the groups go back to what the material has: 2, 5, 3
    const r0 = T('c4.3', '一组') - 0.1;
    tl.to(cnt, { '--strike': 0, duration: 0.25 }, r0 - 0.1);
    off(hollow, r0, 0.35);
    tl.to(spA[0], { height: spineH(2), duration: 0.5, ease: 'power3.inOut' }, r0);
    tl.to(cnt[0], { top: cntY(2), duration: 0.5, ease: 'power3.inOut' }, r0 + 0.1);
    K.count(cnt[0].querySelector('b'), 3, 2, r0 + 0.2, 0.3);
    const r1 = T('c4.3', '看材料') - 0.2;
    off(etc, r1, 0.25);
    cardsA[1].slice(2).forEach((c, k) => {
      tl.to(c, Object.assign({ '--tick': 1, backgroundColor: '#ffffff', borderColor: '#c3ccd8', duration: 0.7, ease: 'power3.inOut' }, css(cardR(1, 2 + k))), r1 + k * 0.06);
      tl.to(c.firstChild, { autoAlpha: 1, duration: 0.3 }, r1 + 0.45 + k * 0.06);
    });
    tl.to(spA[1], { height: spineH(5), duration: 0.7, ease: 'power3.inOut' }, r1);
    tl.to(cnt[1], { top: cntY(5), duration: 0.7, ease: 'power3.inOut' }, r1 + 0.05);
    K.count(cnt[1].querySelector('b'), 3, 5, r1 + 0.2, 0.5);
    const unit = T('c4.3', '几类') - 0.1;
    cnt.forEach(c => { const [a, b] = c.querySelectorAll('i'); off(a, unit, 0.25); on(b, unit + 0.1, 0.25); });
    const mat1 = K.box(world, 'c4-say', 1450, 720, null, null, '看材料，');
    const mat2 = K.box(world, 'c4-say', 1450, 784, null, null, '不看版面');
    K.show(mat1, T('c4.3', '看材料') - 0.1, { y: 14 });
    K.show(mat2, T('c4.3', '不看') - 0.1, { y: 14 });
    off([tpl, tplLab], T('c4.3', '版面') - 0.05, 0.6);
    K.source(root, '三条规则据明托本人在麦肯锡校友网访谈中的表述转述。', t3 + 0.5, T('c4.4') - 0.6);

    // ------------------------------------------------------------ c4.4 · the three boxes close up into one whole
    const x4 = T('c4.4') - 0.5;
    K.sink(ttl1.inners, x4);
    off([rlab, ...rules, noNum, mat1, mat2, ...cnt, ...cardsA.flat(), ...spA, ...elbA, top, chrome.badge], x4, 0.4);
    tl.to(keyA, { autoAlpha: 0, duration: 0.3 }, x4 + 0.15);
    keys.forEach((k, i) => move(k, BAR[i], x4 + 0.35, 0.95));
    ix.cur(1, T('c4.4', '第二') - 0.05);
    const ttl2 = title(root, '二', '为切而切');
    K.rise(ttl2.inners, T('c4.4', '为了') - 0.25);
    const g2 = K.svg(world);
    const cuts = [711.5, 1211.5].map(x => K.path(g2, `M${x},444 L${x},646`, 'ln blue'));
    const tag1 = K.box(world, 'c4-tag', 728, 404, null, null, '不重复');
    const brk = K.path(g2, 'M211,640 L211,662 L1709,662 L1709,640', 'ln blue');
    const tag2 = K.box(world, 'c4-tag mid', 660, 672, 600, null, '不遗漏');
    K.draw(cuts, T('c4.4', '不重复') - 0.2, { duration: 0.4, stagger: 0.1 });
    K.show(tag1, T('c4.4', '不重复') - 0.05, { y: 10, duration: 0.4 });
    K.draw(brk, T('c4.4', '不遗漏') - 0.2, { duration: 0.6 });
    K.show(tag2, T('c4.4', '不遗漏') + 0.1, { y: -10, duration: 0.4 });

    // ------------------------------------------------------------ c4.5 · MECE: what it is, whose it is, what it checks
    const mece = K.lines(world, 'c4-mece', ['MECE']);
    mece.style.cssText += 'position:absolute;left:204px;top:236px;';
    K.rise(mece.inners, T('c4.5') - 0.05);
    const gl1 = K.box(world, 'c4-gloss', 760, 244, null, null, '<i>ME</i><span>Mutually Exclusive</span><b>相互独立</b>');
    const gl2 = K.box(world, 'c4-gloss', 760, 322, null, null, '<i>CE</i><span>Collectively Exhaustive</span><b>完全穷尽</b>');
    K.show(gl1, T('c4.5', '相互') - 0.25, { x: 24, y: 0 });
    K.show(gl2, T('c4.5', '完全') - 0.25, { x: 24, y: 0 });
    tl.to(cuts, { strokeWidth: 8, duration: 0.25 }, T('c4.5', '相互') - 0.1);
    tl.to(cuts, { strokeWidth: 3, duration: 0.4 }, T('c4.5', '相互') + 0.3);
    tl.to(brk, { strokeWidth: 8, duration: 0.25 }, T('c4.5', '完全') - 0.1);
    tl.to(brk, { strokeWidth: 3, duration: 0.4 }, T('c4.5', '完全') + 0.3);
    // the name is hers; the idea, she says, is Aristotle's
    const attr = K.el(world, 'fill');
    const who1 = K.box(attr, 'c4-who', 210, 770, null, null, '<i>缩写</i><b>明托</b>');
    const who2 = K.box(attr, 'c4-who', 500, 770, null, null, '<i>道理 · 她说</i><b>亚里士多德</b>');
    const q1 = K.box(attr, 'c4-quote', 1010, 776, null, null, '“it wasn’t really I, actually,');
    const q2 = K.box(attr, 'c4-quote', 1010, 824, null, null, 'it was Aristotle”');
    const qz = K.box(attr, 'c4-quote-zh', 1010, 884, null, null, '“其实不是我，是亚里士多德。”');
    K.show(who1.children[0], T('c4.5', '缩写') - 0.15, { y: 0 });
    K.show(who1.children[1], T('c4.5', '明托') - 0.15, { y: 14 });
    K.show(who2.children[0], T('c4.5', '道理') - 0.15, { y: 0 });
    K.show(who2.children[1], T('c4.5', '亚里士') - 0.15, { y: 14 });
    const qc = [...K.split(q1), ...K.split(q2)], qt = T('c4.5', '她说') - 0.1;
    K.type(qc, qt, qc.length / Math.max(1, T('c4.5', '头上') - qt));
    K.show(qz, T('c4.5', '头上') - 0.1, { y: 0 });
    K.source(root, '缩写与出处，据明托在麦肯锡校友网访谈中的自述。', T('c4.5', '这个') - 0.1, T('c4.6') - 0.35);
    // the check: a part drifts; the overlap and the gap are caught
    const ck = T('c4.5', '它用来') - 0.15;
    off([tag1, tag2, ...cuts, brk], ck, 0.35);
    tl.to(attr, { opacity: 0.28, duration: 0.5 }, ck);
    const sh = T('c4.5', '一组') - 0.2;
    tl.to(keys[1], { left: 630, duration: 0.55, ease: 'power3.inOut' }, sh);
    const hatch = hidden(K.box(world, 'c4-hatch', 630, 470, 83, 150));
    const gap = hidden(K.box(world, 'c4-gap', 1133, 470, 77, 150));
    const tagO = K.box(world, 'c4-tag red mid', 571, 404, 200, null, '重叠');
    const tagG = K.box(world, 'c4-tag red mid', 1071, 404, 200, null, '遗漏');
    const scan = hidden(K.box(world, 'c4-scan', 208, 446, null, 198));
    const tO = T('c4.5', '重叠'), tG = T('c4.5', '遗漏'), s0 = Math.min(sh + 0.5, tO - 0.4);
    on(scan, s0 - 0.2, 0.2);
    tl.to(scan, { x: 462, duration: tO - s0, ease: 'none' }, s0);
    tl.to(scan, { x: 962, duration: Math.max(0.3, tG - tO), ease: 'none' }, tO);
    tl.to(scan, { x: 1502, duration: 0.55, ease: 'none' }, tG);
    off(scan, tG + 0.45, 0.15);
    on(hatch, tO - 0.1, 0.25); K.show(tagO, tO - 0.05, { y: 10, duration: 0.35 });
    on(gap, tG - 0.1, 0.25); K.show(tagG, tG - 0.05, { y: 10, duration: 0.35 });
    const fx = T('c4.6') - 0.3;
    off([hatch, gap, tagO, tagG], fx - 0.05, 0.25);
    tl.to(keys[1], { left: 710, duration: 0.35, ease: 'power3.out' }, fx);

    // ------------------------------------------------------------ c4.6 · a problem that is a loop
    const t6 = T('c4.6');
    off([mece, gl1, gl2, attr], t6 - 0.4, 0.35);
    keys.forEach((k, i) => move(k, STRIP[i], t6 + 0.1, 0.9));
    const stripLab = K.box(world, 'c4-note', 1318, 146, null, null, 'MECE');
    K.show(stripLab, t6 + 0.8, { x: 14, y: 0 });
    on(chrome.badge, t6 + 0.5);
    const loop = K.el(world, 'fill');
    const lg = K.svg(loop);
    const nodes = [['价格', R(270, 550, 260, 100)], ['谁来买', R(810, 280, 300, 100)], ['上线难不难', R(1320, 550, 400, 100)], ['觉得值不值', R(760, 820, 400, 100)]]
      .map(([t, r]) => bx(loop, 'c4-node', r, t));
    K.show(nodes, T('c4.6', '各个') - 0.3, { scale: 0.85, y: 0, stagger: 0.1, duration: 0.5 });
    const center = K.box(loop, 'c4-center', 660, 558, 600, null, '互相牵连');
    K.show(center, T('c4.6', '互相') - 0.15, { y: 12 });
    // arrows: drawn as they are named; later each is cut where it crosses a cell border
    const GAPW = 76;
    const arrows = [
      ['M400,546 Q400,330 802,330', 'M790,319 L804,330 L790,341', 680],
      ['M1118,330 Q1520,330 1520,542', 'M1509,530 L1520,544 L1531,530', 1240],
      ['M1520,654 Q1520,870 1168,870', 'M1180,859 L1166,870 L1180,881', 1240],
      ['M752,870 Q400,870 400,658', 'M389,670 L400,656 L411,670', 680],
    ].map(([d, h, border]) => {
      const p = K.path(lg, d, 'ln c4-arrow'), head = hidden(K.path(lg, h, 'ln c4-arrow'));
      const L = p.getTotalLength();
      let c = { len: L / 2, x: border, y: 0 }, prev = p.getPointAtLength(0);
      for (let s = 2; s <= L; s += 2) {
        const q = p.getPointAtLength(s);
        if ((prev.x - border) * (q.x - border) <= 0) { c = { len: s - 1, x: border, y: (prev.y + q.y) / 2 }; break; }
        prev = q;
      }
      return { p, head, L, c, st: { p: 0, g: 0 } };
    });
    Film.onFrame(() => arrows.forEach(a => {
      const { p, g } = a.st;
      a.p.style.visibility = p > 0.001 ? '' : 'hidden';
      a.p.style.strokeDasharray = g > 0 ? `${a.c.len - (g * GAPW) / 2} ${g * GAPW} ${a.L}` : `${a.L * p} ${a.L}`;
    }));
    const drawArrow = (i, at, dur) => { tl.to(arrows[i].st, { p: 1, duration: dur, ease: 'power2.inOut' }, at); on(arrows[i].head, at + dur - 0.12, 0.15); };
    const verbs = [K.box(loop, 'c4-verb', 560, 410, null, null, '影响'), K.box(loop, 'c4-verb r', 1160, 410, 200, null, '决定'), K.box(loop, 'c4-verb r', 1070, 740, 300, null, '反过来影响')];
    pulse(nodes[0], T('c4.6', '价格') - 0.1, 0.9);
    drawArrow(0, T('c4.6', '影响') - 0.1, 0.55);
    K.show(verbs[0], T('c4.6', '影响') - 0.05, { y: 8, duration: 0.4 });
    pulse(nodes[1], T('c4.6', '谁来买') - 0.05, 1.7);
    drawArrow(1, T('c4.6', '决定') - 0.1, 0.55);
    K.show(verbs[1], T('c4.6', '决定') - 0.05, { y: 8, duration: 0.4 });
    pulse(nodes[2], T('c4.6', '上线') - 0.05, 2.2);
    drawArrow(2, T('c4.6', '反过来') - 0.1, 0.9);
    K.show(verbs[2], T('c4.6', '反过来') - 0.05, { y: 8, duration: 0.4 });
    pulse(nodes[3], T('c4.6', '觉得') - 0.1, 1.0);
    drawArrow(3, T('c4.6', 'end') - 0.4, 0.6);

    // ------------------------------------------------------------ c4.7 · three tidy cells; every arrow that crosses a border is cut
    const t7 = T('c4.7');
    off([center, stripLab], t7 - 0.1, 0.3);
    keys.forEach((k, i) => move(k, CELL[i], t7, 1.0));
    const cellLabs = ['定价', '客户', '交付'].map((t, i) => K.box(loop, 'c4-celllab', CELL[i].x + 26, CELL[i].y + 18, null, null, t));
    K.show(cellLabs, t7 + 0.8, { y: 0, stagger: 0.08, duration: 0.4 });
    const cut = T('c4.7', '互不') - 0.1;
    arrows.forEach((a, i) => tl.to(a.st, { g: 1, duration: 0.4, ease: 'power3.out' }, cut + i * 0.05));
    off(verbs, cut, 0.3);
    tl.to(arrows.flatMap(a => [a.p, a.head]), { opacity: 0.2, duration: 0.6 }, T('c4.7', '图') - 0.1);
    const xs = arrows.flatMap(a => [[-1, 1], [1, -1]].map(([sx, sy]) =>
      hidden(K.path(lg, `M${a.c.x + 17 * sx},${a.c.y - 17} L${a.c.x - 17 * sx},${a.c.y + 17}`, 'c4-x'))));
    const dead = T('c4.7', '因果') - 0.15;
    xs.forEach((x, i) => on(x, dead + i * 0.04, 0.05));
    K.draw(xs, dead, { duration: 0.22, stagger: 0.04 });
    const deadCap = K.box(loop, 'c4-center red', 660, 558, 600, null, '因果断了');
    K.show(deadCap, T('c4.7', '切断') - 0.2, { y: 12 });

    // ------------------------------------------------------------ c4.8 · 先说结论 taken for 先定结论
    const x8 = T('c4.8') - 0.5;
    off([loop, ...keys, chrome.badge], x8, 0.4);
    K.sink(ttl2.inners, x8);
    keys.forEach((k, i) => snap(k, Object.assign({ y: 20 }, css(keyR(i))), x8 + 0.5));
    snap(keyA, { autoAlpha: 1 }, x8 + 0.5);
    snap(pyr, { y: 64 }, x8 + 0.5);              // out of sight: the tree comes back a little lower, under the phrase pair
    ix.cur(2, T('c4.8', '第三') - 0.05);
    const ttl3 = title(root, '三', '最隐蔽的一种');
    K.rise(ttl3.inners, T('c4.8', '第三') - 0.05);
    const pair = K.el(world, 'c4-pair');
    const pA = K.lines(pair, 'c4-pairline', ['先<em>说</em>结论']); pA.style.left = '200px'; pA.style.top = '380px';
    const pB = K.lines(pair, 'c4-pairline', ['先<u>定</u>结论']); pB.style.left = '1120px'; pB.style.top = '380px';
    const pg = K.svg(pair);
    const pLine = K.path(pg, 'M852,476 L1064,476', 'ln'), pHead = hidden(K.path(pg, 'M1046,459 L1067,476 L1046,493', 'ln'));
    pLine.style.strokeWidth = pHead.style.strokeWidth = '5px';
    const asLab = K.box(pair, 'c4-as', 852, 404, 212, null, '当成');
    K.rise(pA.inners, T('c4.8', '先说') - 0.25);
    K.draw(pLine, T('c4.8', '当成') - 0.15, { duration: 0.45 });
    on(pHead, T('c4.8', '当成') + 0.2, 0.15);
    K.show(asLab, T('c4.8', '当成') - 0.1, { y: 8 });
    K.rise(pB.inners, T('c4.8', '先定') - 0.25);

    // ------------------------------------------------------------ c4.9 · an order of telling, not of finding out
    const gA = K.box(world, 'c4-gl blue', 206, 600, null, null, '<i>金字塔管的是</i><b>表达的顺序</b>');
    const gB = K.box(world, 'c4-gl', 1126, 600, null, null, '<i>不是</i><b>调查的顺序</b>');
    K.show(gA.children[0], T('c4.9') + 0.1, { y: 0 });
    K.show(gA.children[1], T('c4.9', '表达') - 0.2, { y: 14 });
    K.show(gB.children[0], T('c4.9', '不是') - 0.1, { y: 0 });
    K.show(gB.children[1], T('c4.9', '调查') - 0.2, { y: 14 });
    const sB = T('c4.9', '塔要') - 0.45;
    off([gA, gB, asLab], sB, 0.3);
    K.sink(ttl3.inners, sB - 0.1, { duration: 0.45 });
    tl.to(pair, { x: 96, y: -36, scale: 0.42, duration: 0.9, ease: 'power3.inOut' }, sB + 0.1);   // the pair becomes this misuse's title
    // built upward from the evidence …
    const slotR = n => cardR(Math.floor(n / 2), n % 2);
    const hB = HONEST.map((t, n) => card('out', slotR(n), t));
    const fB = FITS.map((t, n) => card('', cardR(Math.floor(n / 2), 2 + (n % 2)), t));
    gsap.set(fB, { '--tick': 0 });
    const spUp = [0, 1, 2].map(i => K.box(pyr, 'c4-spine', COLX[i] + 16, KY + KH, null, spineH(2)));
    const spDn = [0, 1, 2].map(i => K.box(pyr, 'c4-spine', COLX[i] + 16, KY + KH, null, spineH(2)));
    gsap.set(spUp, { scaleY: 0, transformOrigin: '50% 100%' });
    gsap.set(spDn, { scaleY: 0, transformOrigin: '50% 0%' });
    const elbUp = [0, 1, 2].map(i => hidden(K.path(g, K.elbow(TOPR, keyR(i), 14), 'ln')));
    elbUp.forEach(p => { const len = p.getTotalLength(); p.style.strokeDasharray = len + ' ' + len; p.style.strokeDashoffset = -len; });
    const elbDn = [0, 1, 2].map(i => hidden(K.path(g, K.elbow(TOPR, keyR(i), 14), 'ln')));
    const elbDash = [0, 1, 2].map(i => hidden(K.path(g, K.elbow(TOPR, keyR(i), 14), 'ln soft dash')));
    const dg = K.svg(world);
    const upL = K.path(dg, 'M1460,764 L1460,328', 'ln'), upH = hidden(K.path(dg, 'M1449,342 L1460,326 L1471,342', 'ln'));
    const dnL = K.path(dg, 'M1650,322 L1650,758', 'ln blue'), dnH = hidden(K.path(dg, 'M1639,744 L1650,760 L1661,744', 'ln blue'));
    const upLab = K.box(world, 'c4-dir', 1484, 630, null, null, '<b>搭</b><span>从证据往上</span>');
    const dnLab = K.box(world, 'c4-dir blue', 1674, 326, null, null, '<b>讲</b><span>从塔尖往下</span>');
    const b0 = T('c4.9', '底下') - 0.35, tBuilt = T('c4.9', '搭');
    on(chrome.badge, b0);
    K.show(hB, b0, { y: 30, stagger: 0.05, duration: 0.5 });
    K.draw(upL, b0 + 0.1, { duration: Math.max(0.6, tBuilt - b0 - 0.1), ease: 'power1.inOut' });
    on(upH, tBuilt - 0.1, 0.15);
    K.show(upLab, T('c4.9', '往上') - 0.1, { y: 14 });
    tl.to(spUp, { scaleY: 1, duration: 0.4, ease: 'power2.inOut', stagger: 0.05 }, T('c4.9', '证据') - 0.05);
    const k9 = T('c4.9', '往上') - 0.2;
    tl.to(keys, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06 }, k9);
    snap(elbUp, { autoAlpha: 1 }, k9 + 0.14);
    tl.to(elbUp, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut', stagger: 0.05 }, k9 + 0.15);
    tl.to(top, { autoAlpha: 1, duration: 0.5, ease: 'expo.out' }, tBuilt - 0.05);
    pulse(top, T('c4.9', '搭完') - 0.05, 0.45);
    // … and only then told downward from the top
    K.draw(dnL, T('c4.9', '才') - 0.05, { duration: Math.max(0.6, T('c4.9', '讲') - T('c4.9', '才')), ease: 'power1.inOut' });
    on(dnH, T('c4.9', '讲') - 0.1, 0.15);
    K.show(dnLab, T('c4.9', '往下') - 0.15, { y: -14 });
    pulse(top, T('c4.9', '塔尖') - 0.1, 0.5);
    pulse(keys, T('c4.9', '往下') - 0.1, 0.5);
    tl.to(hB, { '--hot': 1, duration: 0.3 }, T('c4.9', '讲') - 0.1);
    tl.to(hB, { '--hot': 0, duration: 0.4 }, T('c4.9', 'end') + 0.05);

    // ------------------------------------------------------------ c4.10 · the top is written first; evidence is picked to fit
    const z0 = T('c4.10') - 0.2;
    off([upL, upH, upLab, dnL, dnH, dnLab], z0, 0.3);
    off([...keys, ...spUp, ...elbUp], z0 + 0.1, 0.35);
    tl.to(hB, { '--tick': 0, duration: 0.3 }, z0 + 0.1);
    snap(keyA, { autoAlpha: 0 }, z0 + 0.6);
    snap(keyB, { autoAlpha: 1 }, z0 + 0.6);
    off(topA, T('c4.10', '先写') - 0.4, 0.25);
    K.type(topChars, T('c4.10', '先写') - 0.05, 8);
    K.show(fB, T('c4.10', '再回头') - 0.15, { y: 50, stagger: 0.05, duration: 0.5 });
    const s10 = T('c4.10', '只挑') - 0.1, rp = K.rng(11);
    hB.forEach((c, n) => {                       // what does not fit is pushed aside, and stays in view
      const at = s10 + n * 0.16;
      tl.to(c, { left: 1474 + (rp() - 0.5) * 36, top: 408 + n * 60, rotation: (rp() - 0.5) * 11, duration: 0.75, ease: 'power3.inOut' }, at);
      tl.to(fB[n], { top: slotR(n).y, duration: 0.6, ease: 'power3.inOut' }, at + 0.15);
    });
    const pileLab = K.box(world, 'c4-pilelab', 1474, 854, null, null, '被挑掉的证据');
    K.show(pileLab, s10 + 5 * 0.16 + 0.6, { y: 10 });
    const r10 = T('c4.10', '结构') - 0.15;
    snap(elbDn, { autoAlpha: 1 }, r10 - 0.01);
    K.draw(elbDn, r10, { duration: 0.5, stagger: 0.05 });
    tl.to(keys, { autoAlpha: 1, duration: 0.45, stagger: 0.06 }, r10 + 0.3);
    tl.to(spDn, { scaleY: 1, duration: 0.4, stagger: 0.05, ease: 'power2.inOut' }, r10 + 0.55);
    tl.to(fB, { '--tick': 1, duration: 0.3 }, r10 + 0.75);
    const neat = T('c4.10', '工整') - 0.1;
    pulse([top, ...keys], neat, 0.5);
    const verdict = K.box(world, 'c4-verdict', 180, 880, null, null, '<b>照样工整</b><span>，不再是论证</span>');
    K.show(verdict.children[0], neat, { y: 14 });
    K.show(verdict.children[1], T('c4.10', '不再') - 0.15, { x: -14, y: 0 });
    const v0 = T('c4.10', '不再') - 0.2;
    tl.to(top, { '--void': 1, duration: 0.5 }, v0);
    off(elbDn, v0, 0.3); on(elbDash, v0 + 0.1, 0.3);
    tl.to([...fB, ...keys, ...spDn], { opacity: 0.5, duration: 0.5 }, v0);
    tl.to(pileLab, { color: RED, duration: 0.4 }, T('c4.10', '只是') - 0.1);
  });

  // ------------------------------------------------------------ c4.17 · when not to lead with the answer
  const C0 = T('c4.17') - 0.1, C1 = T('c5.card');
  Film.scene('c4-notfirst', C0, C1, ({ root }) => {
    root.classList.add('paper');
    root.style.isolation = 'isolate';              // keep this scene's z-indexed chrome under the scene that follows it
    const world = K.el(root, 'fill');
    K.el(root, 'grain'); K.el(root, 'vignette');
    K.chrome(root, { chapter: CH });
    const ix = index(root);
    gsap.set(ix.it.slice(0, 4), { color: INK });
    const veil = K.el(root, 'fill c4-veil');          // the Columbia sequence ends on night; lift it rather than cut
    tl.to(veil, { autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, C0);
    ix.cur(4, T('c4.17') + 0.1);
    const ttl = title(root, '五', '有时不该先说结论');
    K.rise(ttl.inners, T('c4.17') + 0.3);

    // a refusal: the reasons come before the decision
    const BX = 220, BW = 720, BH = 140, SY = [322, 478, 634];
    const sheet = K.box(world, 'c4-sheet', 180, 250, 800, 560);
    const shLab = K.box(world, 'c4-kick', 220, 268, null, null, '一封拒绝信');
    const concl = K.box(world, 'c4-blk concl', BX, SY[0], BW, BH, '<i>结论</i><b>很遗憾，未能通过</b>');
    const rs = [1, 2].map(k => K.box(world, 'c4-blk', BX, SY[k], BW, BH, `<i>理由${'一二'[k - 1]}</i><s></s><s></s>`));
    const l0 = T('c4.17') + 0.55;
    K.show(sheet, l0, { y: 30, duration: 0.6 });
    K.show([concl, ...rs], l0 + 0.15, { y: 20, stagger: 0.08, duration: 0.5 });
    tl.to(concl, { '--hot': 1, duration: 0.35 }, T('c4.17', '先说') - 0.1);
    K.show(shLab, T('c4.17', '拒绝') - 0.2, { x: -12, y: 0 });
    const sw = T('c4.17', '先讲') - 0.15, land = Math.max(0.9, T('c4.17', '再给') + 0.3 - sw);
    rs.forEach((r, k) => tl.to(r, { top: SY[k], duration: 0.7, ease: 'power3.inOut' }, sw + k * 0.08));
    tl.to(concl, { top: SY[2], duration: land, ease: 'power3.inOut' }, sw);
    tl.to(concl, { x: 48, duration: land * 0.45, ease: 'power2.out' }, sw);
    tl.to(concl, { x: 0, duration: land * 0.5, ease: 'power2.inOut' }, sw + land * 0.5);
    // what the experiment found: set large beside the letter, then it settles under it as a caption
    const find = K.box(world, 'c4-find', 1080, 372, null, null, '<i>实验里</i><b>先讲理由，再给结论</b><span>读的人觉得更好懂，</span><span>也更能接受</span>');
    world.insertBefore(find, sheet);              // it passes behind the letter on its way down
    const [fk, fb, f1, f2] = find.children;
    K.show(fk, T('c4.17', '实验') - 0.15, { y: 0 });
    K.show(fb, sw + 0.1, { y: 16 });
    K.show(f1, T('c4.17', '读') - 0.1, { y: 12 });
    K.show(f2, T('c4.17', '更', 0) - 0.1, { y: 12 });
    const p0 = T('c4.17', '问题') - 0.45;
    off(fk, p0 - 0.15, 0.25);
    tl.to(find, { x: -900, y: 400, scale: 0.72, duration: 0.9, ease: 'power3.inOut' }, p0);
    K.source(root, 'Jansen &amp; Janssen (2011), <i>Journal of Business and Technical Communication</i> 25(1), 36–67：荷兰语的拒赔信、拒聘信与邮件。', T('c4.17', '有实验') - 0.1, C1 - 0.7);

    // a problem not yet solved: the top stays empty
    const mg = K.svg(world);
    const MT = R(1230, 262, 380, 96), MX = [1100, 1325, 1550], MW = 190, MKY = 440, MKH = 80, MN = [2, 3, 1];
    const mel = MX.map(x => hidden(K.path(mg, K.elbow(MT, R(x, MKY, MW, MKH), 14), 'ln soft dash')));
    const mkey = MX.map(x => K.box(world, 'c4-mkey', x, MKY, MW, MKH));
    const mcards = MX.flatMap((x, i) => Array.from({ length: MN[i] }, (_, r) => K.box(world, 'c4-mcard', x + 40, 572 + r * 60, MW - 40, 46)));
    const msp = MX.map((x, i) => K.box(world, 'c4-spine', x + 16, MKY + MKH, null, 572 + (MN[i] - 1) * 60 + 23 - (MKY + MKH)));
    gsap.set(msp, { scaleY: 0, transformOrigin: '50% 100%' });
    const mtop = bx(world, 'c4-top0', MT);
    const m0 = p0 + 0.35;
    K.show(mcards, m0, { y: 24, stagger: 0.04, duration: 0.5 });
    tl.to(msp, { scaleY: 1, duration: 0.4, ease: 'power2.inOut' }, m0 + 0.3);
    K.show(mkey, m0 + 0.4, { y: 20, stagger: 0.06, duration: 0.5 });
    on(mel, m0 + 0.85, 0.4);
    K.show(mtop, T('c4.17', '清楚') - 0.3, { y: 0, scale: 0.94, duration: 0.6 });
    tl.to(mtop, { borderColor: INK, duration: 0.4 }, T('c4.17', '塔尖') - 0.15);
    const capR = K.box(world, 'c4-cap', 1100, 834, null, null, '<b>问题还没想清楚</b><span>塔尖空着，不假装</span>');
    K.show(capR.children[0], T('c4.17', '清楚') - 0.1, { y: 12 });
    K.show(capR.children[1], T('c4.17', '假装') - 0.1, { y: 10 });

    off([world, ttl, ix.wrap], C1 - 0.5, 0.4);
  });
})();
