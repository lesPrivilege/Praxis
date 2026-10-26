/* The Columbia slide. One object carries the sequence: a tidy outline of bars, which turns out to be
   a briefing slide, is read from its title down to its last line, and goes back to being an outline.
   Slide text as reproduced in CAIB, Report Volume I (2003), p. 191; the layout here is re-set. */
(function () {
  const { T } = Film, tl = K.tl;
  const A = T('c4.11') - 0.3, Z = T('c4.17') - 0.1;
  const MOON = '#dfe6f0', LITE = '#8fb0ff', RED = '#dd4a3c';

  /* lv 0 is the title; b is the bullet glyph; each entry of `lines` is one set line. */
  const SLIDE = [
    { lv: 0, lines: ['Review Of Test Data Indicates <span class="c4b-k">Conservatism</span>', 'for Tile Penetration'] },
    { lv: 1, b: '•', lines: ['The existing SOFI on tile test data used to create Crater', 'was reviewed along with STS-107 Southwest Research data'] },
    { lv: 2, b: '–', lines: ['Crater overpredicted penetration of tile coating significantly'] },
    { lv: 3, b: '•', lines: ['Initial penetration to described by normal velocity'] },
    { lv: 4, b: '•', lines: ['Varies with volume/mass of projectile (e.g., 200ft/sec for 3cu. In)'] },
    { lv: 3, b: '•', lines: ['Significant energy is required for the softer SOFI particle to', 'penetrate the relatively hard tile coating'] },
    { lv: 4, b: '•', lines: ['Test results do show that it is possible at sufficient mass and velocity'] },
    { lv: 3, b: '•', lines: ['Conversely, once tile is penetrated SOFI can cause significant damage'] },
    { lv: 4, b: '•', lines: ['Minor variations in total energy (above penetration level) can', 'cause significant tile damage'] },
    { lv: 2, b: '–', lines: ['Flight condition is significantly outside of test database'] },
    { lv: 3, b: '•', lines: ['Volume of ramp is <span class="c4b-n1">1920cu in</span> vs <span class="c4b-n2">3 cu in</span> for test'] },
  ];
  const PW = 1240, PAD = 56, TOP = 44, GUT = 30;
  const IND = [0, 0, 48, 100, 152], FS = [48, 30, 28, 26, 26], LH = [60, 40, 37, 35, 35], BH = [24, 13, 12, 11, 11];
  const TONE = [0.95, 0.62, 0.5, 0.4, 0.32];

  /* A change that happens while its target is out of sight. */
  const snap = (targets, vars, at) => tl.to(targets, Object.assign({ duration: 0.01, ease: 'none' }, vars), at);

  Film.scene('c4b-columbia', A, Z, ({ root }) => {
    root.classList.add('night');
    gsap.set(root, { opacity: 0 });
    tl.to(root, { opacity: 1, duration: 0.3, ease: 'power2.out' }, A);
    const stage = K.el(root, 'fill');
    K.el(root, 'grain'); K.el(root, 'vignette');
    K.chrome(root, { chapter: ['04', '怎样被用坏'], dark: true });

    // ------------------------------------------------------------ the slide
    const cam = K.el(K.el(stage, 'fill c4b-window'), 'c4b-cam');   // the window keeps the slide clear of the chapter tag
    const slide = K.el(cam, 'c4b-slide');
    slide.style.width = PW + 'px';
    let y = TOP;
    const rows = SLIDE.map(r => {
      const fs = FS[r.lv], lh = LH[r.lv], x = PAD + IND[r.lv] + (r.lv ? GUT : 0);
      const row = { lv: r.lv, x, y, lh, tx: [], bars: [], w: [] };
      r.lines.forEach((html, li) => {
        const t = K.box(slide, 'c4b-tx' + (r.lv ? '' : ' c4b-ttl'), x, y, null, lh, html);
        t.style.fontSize = fs + 'px'; t.style.lineHeight = lh + 'px';
        row.tx.push(t);
        if (r.lv && li === 0) {
          const b = K.box(slide, 'c4b-tx', x - GUT, y, GUT, lh, r.b);
          b.style.fontSize = fs + 'px'; b.style.lineHeight = lh + 'px';
          row.tx.push(b);
        }
        const w = t.offsetWidth;
        row.w.push(w);
        row.bars.push(K.box(slide, 'c4b-bar', x, y + (lh - BH[r.lv]) / 2, w, BH[r.lv]));
        y += lh;
      });
      y += r.lv ? 10 : 34;
      return row;
    });
    const PH = y - 10 + TOP;
    slide.style.height = PH + 'px';
    const head = rows[0], last = rows[rows.length - 1], lastBar = last.bars[0];
    const body = rows.slice(1), allBars = rows.flatMap(r => r.bars);
    const mid = r => r.y + r.lh / 2;

    // camera states: where the slide sits on the stage
    const view = (s, x, y) => ({ scale: s, x, y });
    const S1 = view(1.12, 200 - PAD * 1.12, 150 - TOP * 1.12);          // outline, full frame
    const TH1 = view(0.4, 1344, 590);                                     // waiting beside the facts
    const S3 = view(1, 80, 150);                                          // the slide, whole
    const S5 = view(1.9, 200 - last.x * 1.9, 150 - last.y * 1.9);         // its last line as a heading
    const TH2 = view(0.5, 1220, 500);                                     // exhibit beside the Board's finding
    const on = (S, x, y) => [S.x + S.scale * x, S.y + S.scale * y];
    gsap.set(cam, Object.assign({}, S1));                               // a copy: gsap.set writes into the object it is given

    // lines drawn on the slide: the way down, and the reader's eye going up
    const g = K.svg(slide, null, PW, PH);
    const bx = lv => PAD + IND[lv] + 6;
    const flight = rows[9];
    const route = [          // one path per step down (a dash pattern restarts on every subpath)
      `M${bx(1)},${head.y + 2 * head.lh + 8} L${bx(1)},${rows[1].y + 6}`,
      `M${bx(1)},${rows[1].y + 38} L${bx(1)},${mid(flight)} L${bx(2) - 12},${mid(flight)}`,
      `M${bx(2)},${mid(flight) + 15} L${bx(2)},${mid(last)} L${bx(3) - 12},${mid(last)}`,
    ].map(d => K.path(g, d, 'ln c4b-route'));
    const gy = head.y + head.lh / 2;
    const gaze = K.path(g, `M22,${mid(last)} L22,${gy} L${PAD - 10},${gy}`, 'ln c4b-gaze');
    const gazeTip = K.path(g, `M${PAD - 19},${gy - 8} L${PAD - 10},${gy} L${PAD - 19},${gy + 8}`, 'ln c4b-gaze');
    gsap.set(gazeTip, { opacity: 0 });

    // ------------------------------------------------------------ c4.11 · a tidy outline
    rows.forEach(r => gsap.set(r.bars, { opacity: TONE[r.lv], scaleX: 0, transformOrigin: '0 50%' }));
    tl.to(allBars, { scaleX: 1, duration: 0.7, ease: 'power3.inOut', stagger: 0.05 }, T('c4.11', '工整') - 0.25);

    const [l1x, l1y] = on(S1, last.x + last.w[0], mid(last));
    const lab1 = K.box(stage, 'c4b-tag lite', l1x + 30, l1y - 34, null, null, '要紧的事');
    const k1 = T('c4.11', '要紧') - 0.12, k2 = T('c4.11', '埋') - 0.05;
    tl.to(lastBar, { backgroundColor: LITE, opacity: 1, duration: 0.4 }, k1);
    K.show(lab1, k1 + 0.1, { y: 0, x: -16, duration: 0.45 });
    tl.to(lastBar, { opacity: 0.26, duration: 0.6, ease: 'power2.inOut' }, k2);        // buried: back among the rest
    tl.to(lab1, { autoAlpha: 0.34, duration: 0.6, ease: 'power2.inOut' }, k2 + 0.05);

    // the outline steps aside and waits, small, while the facts are stated
    const m1 = T('c4.11', 'end');
    tl.to(lab1, { autoAlpha: 0, duration: 0.25 }, m1 - 0.05);
    tl.to(cam, Object.assign({ duration: 1.1, ease: 'power3.inOut' }, TH1), m1);
    tl.to(cam, { opacity: 0.5, duration: 0.9 }, m1);
    tl.to(lastBar, { backgroundColor: MOON, opacity: TONE[last.lv], duration: 0.5 }, m1 + 0.6);

    // ------------------------------------------------------------ c4.12 · what happened, in type
    const facts = K.el(stage, 'fill');
    const year = K.lines(facts, 't-num c4b-year', ['2003']);
    year.style.cssText += 'position:absolute;left:190px;top:150px;';
    const name = K.lines(facts, 't-display c4b-name', ['哥伦比亚号航天飞机']);
    name.style.cssText += 'position:absolute;left:200px;top:384px;';
    const rule = K.box(facts, 'c4b-rule', 200, 566, 1040, 2);
    gsap.set(rule, { scaleX: 0 });
    const when1 = K.box(facts, 'c4b-when', 200, 610, null, null, '起飞时');
    const what1 = K.box(facts, 'c4b-what', 440, 610, null, null, '<span>泡沫脱落，</span><span>击中左翼</span>');
    const when2 = K.box(facts, 'c4b-when', 200, 742, null, null, '飞行期间');
    const what2 = K.box(facts, 'c4b-what', 440, 742, null, null, '<span>工程师</span><span>用幻灯片</span><span>汇报评估</span>');
    const w1 = what1.children, w2 = what2.children;

    K.rise(year.inners, T('c4.12') + 0.02, { duration: 0.9 });
    K.rise(name.inners, T('c4.12', '哥伦比亚') - 0.15, { duration: 0.9 });
    tl.to(rule, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, T('c4.12', '起飞') - 0.45);
    K.show(when1, T('c4.12', '起飞') - 0.1, { y: 0, duration: 0.5 });
    K.show(w1[0], T('c4.12', '脱落') - 0.25, { y: 14, duration: 0.55 });
    K.show(w1[1], T('c4.12', '击中') - 0.12, { y: 14, duration: 0.55 });
    K.show(when2, T('c4.12', '飞行') - 0.1, { y: 0, duration: 0.5 });
    K.show(w2[0], T('c4.12', '工程师') - 0.12, { y: 14, duration: 0.55 });
    K.show(w2[1], T('c4.12', '幻灯片') - 0.15, { y: 14, duration: 0.55 });
    K.show(w2[2], T('c4.12', '汇报') - 0.12, { y: 14, duration: 0.55 });
    // "幻灯片": the outline that has been waiting is a page of that briefing
    tl.to(cam, { opacity: 1, duration: 0.6 }, T('c4.12', '幻灯片') - 0.15);
    tl.to(slide, { '--frame': 1, duration: 0.6 }, T('c4.12', '幻灯片') - 0.15);

    // ------------------------------------------------------------ c4.13 · the slide; its title is read first
    const b3 = T('c4.13') - 0.25;
    K.hide(facts, b3 - 0.15, { duration: 0.4 });
    tl.to(cam, Object.assign({ duration: 1.3, ease: 'power3.inOut' }, S3), b3);
    body.forEach(r => tl.to(r.bars, { opacity: 0.3, duration: 0.8 }, b3));
    const tt = T('c4.13', '标题') - 0.15;
    tl.to(head.bars, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, tt);
    tl.to(head.tx, { opacity: 1, duration: 0.5, ease: 'power2.inOut' }, tt);

    const gl = K.el(stage, 'fill');
    const glab = K.box(gl, 'c4b-glab', 1372, 196, null, null, '标题 · 直译');
    const gloss = K.lines(gl, 'c4b-gloss', ['对测试数据的复核表明，', '隔热瓦击穿方面', '偏于保守']);
    gloss.style.cssText += 'position:absolute;left:1372px;top:252px;';
    gloss.inners[2].classList.add('lite');
    K.show(glab, tt + 0.2, { y: 0, duration: 0.5 });
    K.rise(gloss.inners[0], T('c4.13', '对') - 0.12, { duration: 0.8 });
    K.rise(gloss.inners[1], T('c4.13', '隔') - 0.12, { duration: 0.8 });
    K.rise(gloss.inners[2], T('c4.13', '偏于') - 0.12, { duration: 0.8 });
    tl.to(slide.querySelector('.c4b-k'), { '--u': 1, color: LITE, duration: 0.5, ease: 'power2.out' }, T('c4.13', '偏于') + 0.1);
    // the rest of the page resolves under the title, quieter
    const br = T('c4.13', '复核') - 0.05;
    body.forEach((r, i) => {
      tl.to(r.bars, { opacity: 0, duration: 0.45, ease: 'power2.inOut' }, br + i * 0.09);
      tl.to(r.tx, { opacity: 0.72, duration: 0.45, ease: 'power2.inOut' }, br + i * 0.09);
    });

    K.source(root, '幻灯片文字据 Columbia Accident Investigation Board, <i>Report Volume I</i> (2003), p. 191 转载，版式为重排；两个倍数出自同页。', tt + 0.5, T('c4.15') + 0.3, true);

    // ------------------------------------------------------------ c4.14 · down the levels to the last line
    const dn = T('c4.14', '要紧') - 0.15;
    K.hide(gl, dn - 0.3, { duration: 0.35 });
    tl.to(cam, Object.assign({ duration: 2.3, ease: 'power2.inOut' }, S5), dn);
    K.draw(route[0], dn + 0.1, { duration: 0.3, ease: 'power1.in' });
    K.draw(route[1], dn + 0.4, { duration: 1.05, ease: 'none' });
    K.draw(route[2], dn + 1.45, { duration: 0.35, ease: 'power1.out' });
    const onRoute = [rows[1], flight, last];
    body.filter(r => !onRoute.includes(r)).forEach(r => tl.to(r.tx, { opacity: 0.28, duration: 0.5 }, dn));
    tl.to(rows[1].tx, { opacity: 1, duration: 0.4 }, dn + 0.3);
    tl.to(flight.tx, { opacity: 1, duration: 0.3 }, dn + 1.4);
    tl.to(last.tx, { opacity: 1, duration: 0.4 }, dn + 1.7);
    // only the last line stays: it becomes the heading of what follows
    const cl = dn + 1.85;
    rows.filter(r => r !== last).forEach(r => tl.to(r.tx, { opacity: 0, duration: 0.45, ease: 'power2.in' }, cl));
    tl.to(route, { opacity: 0, duration: 0.45, ease: 'power2.in' }, cl);
    tl.to(slide, { '--frame': 0, duration: 0.45, ease: 'power2.in' }, cl);

    const ratio = K.el(stage, 'fill');
    const hg = K.box(ratio, 'c4b-hg', 200, 232, null, null,
      '<span>泡沫坡道的体积 <b>1920</b> 立方英寸</span><span>　·　测试用的 <b>3</b> 立方英寸</span>');
    K.show(hg.children[0], T('c4.14', '写的是') + 0.2, { y: 12, duration: 0.6 });
    K.show(hg.children[1], T('c4.14', '测试') - 0.1, { y: 12, duration: 0.6 });

    // 640 cells of 3 cubic inches each: 32 × 20
    const COLS = 32, N = 640, PITCH = 28, FX = 200, FY = 352, RX = 1190;
    const field = K.box(ratio, 'c4b-field', FX, FY, COLS * PITCH, (N / COLS) * PITCH);
    const cells = [];
    for (let i = 0; i < N; i++) {
      const c = document.createElement('div');
      c.className = 'c4b-cell';
      c.style.left = (i % COLS) * PITCH + 'px'; c.style.top = Math.floor(i / COLS) * PITCH + 'px';
      field.appendChild(c); cells.push(c);
    }
    const cap = K.box(ratio, 'c4b-cap', FX, FY + (N / COLS) * PITCH + 8, null, null, '<b>0</b> 立方英寸 · 坡道体积，幻灯片所写');
    const capNum = cap.querySelector('b');
    const unit = K.box(ratio, 'c4b-unit', RX, FY, 22, 22);
    const unitCap = K.box(ratio, 'c4b-cap', RX + 44, FY - 15, null, null, '<b>3</b> 立方英寸 · 测试用的');
    const rlab = K.box(ratio, 'c4b-rlab', RX, 500, null, null, '幻灯片上写的比例');
    const xN = K.box(ratio, 'c4b-x', RX - 8, 548, null, null, '<b class="t-num">1</b><span>倍</span>');
    const xNum = xN.querySelector('b');
    const later = K.box(ratio, 'c4b-later', RX, 800, null, null, '事后分析：约 400 倍');

    const vol = T('c4.14', '体积');
    K.show([field, cap], T('c4.14', '坡道') - 0.35, { y: 0, duration: 0.5, stagger: 0 });
    const f = { a: 0, b: 0, u: 0 };                       // a: volume counted in, b: units counted across, u: the unit named
    tl.to(f, { a: N, duration: 1.8, ease: 'power1.inOut' }, vol + 0.3);
    tl.to(slide.querySelector('.c4b-n1'), { '--u': 1, duration: 0.5 }, vol + 0.3);
    const three = T('c4.14', '只有') + 0.15;
    K.show([unit, unitCap], three, { y: 0, x: -14, duration: 0.5, stagger: 0.08 });
    tl.to(f, { u: 1, duration: 0.4, ease: 'power2.out' }, three + 0.1);
    tl.to(slide.querySelector('.c4b-n2'), { color: LITE, duration: 0.4 }, three);
    const diff = T('c4.14', '相差') - 0.2;
    K.show([rlab, xN], diff, { y: 16, duration: 0.5, stagger: 0.06 });
    tl.to(f, { b: N, duration: 1.25, ease: 'power2.inOut' }, diff + 0.05);
    K.show(later, diff + 1.3, { y: 12, duration: 0.5 });
    let pa = -1, pb = -1, pu = -1;
    Film.onFrame(() => {
      if (f.a === pa && f.b === pb && f.u === pu) return;
      pa = f.a; pb = f.b; pu = f.u;
      for (let i = 0; i < N; i++) {
        const a = Math.max(0, Math.min(1, f.a - i)), b = Math.max(0, Math.min(1, f.b - i));
        cells[i].style.opacity = 0.09 + 0.25 * a + 0.58 * b;
      }
      cells[0].style.opacity = Math.max(0.34 * Math.min(1, f.a), f.u, 0.09 + 0.83 * Math.min(1, f.b));
      cells[0].style.background = f.u > 0.5 ? LITE : '';
      const n = String(Math.round(f.a) * 3), x = String(Math.max(1, Math.round(f.b)));
      if (capNum.textContent !== n) capNum.textContent = n;
      if (xNum.textContent !== x) xNum.textContent = x;
    });

    // ------------------------------------------------------------ c4.15 · the loss, and what the Board wrote
    const out4 = T('c4.15') + 0.3;
    K.hide([ratio, cam], out4, { duration: 0.45 });
    const rs = out4 + 0.55;                                // out of sight: the slide goes back to being an outline
    snap(cam, TH2, rs);
    snap(last.tx, { opacity: 0 }, rs);
    rows.forEach(r => snap(r.bars, { opacity: TONE[r.lv] }, rs));
    snap(slide, { '--frame': 1 }, rs);

    const board = K.el(stage, 'fill');
    const lossLab = K.box(board, 'c4b-when', 200, 164, null, null, '2003 · 哥伦比亚号');
    const loss = K.lines(board, 'c4b-loss', ['返航途中解体']);
    loss.style.cssText += 'position:absolute;left:194px;top:232px;';
    K.show(lossLab, rs, { y: 0, duration: 0.6 });
    K.rise(loss.inners, T('c4.15', '返航') - 0.1, { duration: 1.1 });

    const rule2 = K.box(board, 'c4b-rule', 200, 452, 900, 2);
    gsap.set(rule2, { scaleX: 0 });
    tl.to(rule2, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, T('c4.15', '调查') - 0.35);
    const who = K.box(board, 'c4b-when', 200, 478, null, null, '调查委员会');
    const finding = K.box(board, 'c4b-finding', 200, 546, null, null, '<span>组织文化的责任</span><span>不亚于那块泡沫</span>');
    K.show(who, T('c4.15', '调查') - 0.05, { y: 0, duration: 0.5 });
    K.show(finding.children[0], T('c4.15', '事故') - 0.15, { y: 14, duration: 0.55 });
    K.show(finding.children[1], T('c4.15', '组织') - 0.15, { y: 14, duration: 0.55 });

    const also = K.box(board, 'c4b-when', 200, 700, null, null, '报告也专门分析了这一页');
    const cnt = K.box(board, 'c4b-count', 196, 786, null, null,
      '<span><b>0</b> 句话</span><i>切成</i><span><b>6</b> 层</span>');
    const [c11, cCut, c6] = cnt.children;
    tl.to(cam, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, T('c4.15', '但') - 0.05);
    K.show(also, T('c4.15', '报告') - 0.1, { y: 0, duration: 0.5 });
    const e11 = T('c4.15', '十一') - 0.15;
    K.show(c11, e11, { y: 16, duration: 0.5 });
    K.count(c11.querySelector('b'), 0, 11, e11 + 0.05, 0.75);
    rows.forEach((r, i) => tl.to(r.bars, { opacity: 0.95, duration: 0.25 }, e11 + 0.05 + i * 0.065));   // one sentence at a time
    K.show(cCut, T('c4.15', '切成') - 0.1, { y: 0, duration: 0.4 });
    const e6 = T('c4.15', '六') - 0.12;
    K.show(c6, e6, { y: 16, duration: 0.5 });
    rows.forEach(r => tl.to(r.bars, { opacity: TONE[r.lv], duration: 0.5 }, e6));                         // ranked again

    K.source(root, 'Columbia Accident Investigation Board, <i>Report Volume I</i> (2003), 第 7 章 “The Accident’s Organizational Causes”，p. 191。', T('c4.15', '调查') + 0.3, T('c4.16') - 0.4, true);

    // ------------------------------------------------------------ c4.16 · the general point, on the outline
    const b6 = T('c4.16') - 0.45;
    K.hide(board, b6 - 0.25, { duration: 0.35 });
    tl.to(cam, Object.assign({ duration: 1.25, ease: 'power3.inOut' }, S1), b6);
    tl.to(slide, { '--frame': 0, duration: 0.7 }, b6);

    const eye = T('c4.16', '目光') - 0.05;
    K.draw(gaze, eye, { duration: 0.95, ease: 'power2.inOut' });
    tl.to(gazeTip, { opacity: 1, duration: 0.2 }, eye + 0.85);
    const [t6x, t6y] = on(S1, head.x + head.w[0], gy);
    const tagTop = K.box(stage, 'c4b-tag', t6x + 40, t6y - 32, null, null, '目光先到这里');
    const tagOff = K.box(stage, 'c4b-tag red', t6x + 40, t6y - 32, null, null, '写偏了');
    const tagOk = K.box(stage, 'c4b-tag lite', l1x + 30, l1y - 34, null, null, '写得对');
    K.show(tagTop, T('c4.16', '塔尖') - 0.12, { y: 0, x: -16, duration: 0.5 });

    const off = T('c4.16', '写偏') - 0.15;
    K.hide(tagTop, off - 0.2, { duration: 0.2 });
    tl.to(head.bars, { backgroundColor: RED, rotation: -1.2, duration: 0.6, ease: 'power3.out' }, off);
    K.show(tagOff, off + 0.05, { y: 0, duration: 0.4 });

    const ok = T('c4.16', '底下') - 0.1;
    tl.to(lastBar, { backgroundColor: LITE, opacity: 1, duration: 0.4 }, ok);
    K.show(tagOk, T('c4.16', '再') - 0.2, { y: 0, x: -16, duration: 0.45 });
    const dim = T('c4.16', '很') - 0.1;
    tl.to(lastBar, { opacity: 0.24, duration: 0.9, ease: 'power2.inOut' }, dim);
    tl.to(tagOk, { autoAlpha: 0.4, duration: 0.9, ease: 'power2.inOut' }, dim);
    body.filter(r => r !== last).forEach(r => tl.to(r.bars, { opacity: TONE[r.lv] * 0.45, duration: 0.9, ease: 'power2.inOut' }, dim));

    tl.to(stage, { autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, Z - 0.5);
  });
})();
