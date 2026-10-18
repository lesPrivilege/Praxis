/* 01 访谈为决定服务 — Steve Portigal, Interviewing Users.
   Seven body scenes, one per chapter of the narration: the hard hat, the two editions, satisficing,
   the research plan, fieldwork and debrief, the limits of interviewing, and back to field work at Palantir.
   Solid lines and outlines: stated by a source. Dashed: only this series' reading, always under the
   本系列的读法 legend (b25, b27).
   English on screen comes from the claim ledger (K.quote, or claimText() for form labels and headings).
   The outro exists only in the standalone episode and points to 02. */
Series.unit('iu', ({ T, tl, has, u, chrome }) => {
  const BOOK2 = 'Steve Portigal, Interviewing Users, 2nd ed., 2023, ch. 1';
  const BLUE = '#1f4fe0', INK = '#0d1826', INK2 = '#3a4658', RULE = '#c3ccd8';

  function open(root, title, from) {
    root.classList.add('paper');
    K.el(root, 'grain');
    chrome(root, title);
    gsap.set(root, { opacity: 0 });
    tl.to(root, { opacity: 1, duration: 0.4, ease: 'power2.out' }, from);
  }
  /* Ledger text shown outside K.quote (form labels, headings): the claim is looked up, so the stage
     refuses an unknown one, and the element carries the claim ID like a quote does. Straight single quotes
     are set curly, as K.quote sets them. */
  const claimText = id => K.curly(Film.claim(id).quote_en);
  const tag = (e, ids) => { e.dataset.claim = [].concat(ids).join(' '); return e; };
  /* Wrap phrases of a quote line in spans, in order, so they can be tinted as the narration reaches them.
     The text itself stays exactly as the ledger has it. */
  const marks = (e, subs) => {
    const t = e.textContent, out = [];
    let pos = 0;
    e.textContent = '';
    for (const sub of subs) {
      const i = t.indexOf(sub, pos);
      if (i < 0) throw new Error('marks(): "' + sub + '" not in ' + t);
      const s = document.createElement('span');
      s.textContent = sub;
      e.append(t.slice(pos, i), s);
      out.push(s);
      pos = i + sub.length;
    }
    e.append(t.slice(pos));
    return out;
  };
  /* A stroke with several subpaths (a line and its arrowhead) becomes one path per subpath, drawn in order:
     the dash pattern restarts on every subpath, so a single path would show its heads before the line. */
  const strokes = (sv, d, cls) => d.split(/(?=M)/).map(p => K.path(sv, p.trim(), cls || 'ln'));
  const drawStrokes = (ps, at, dur) => {
    K.draw(ps[0], at, { duration: dur });
    ps.slice(1).forEach((p, i) => K.draw(p, at + dur * 0.85 + i * 0.05, { duration: 0.2 }));
  };
  const arrow = (sv, x1, y, x2, cls) => {
    const d = x2 > x1 ? 1 : -1;
    return strokes(sv, `M${x1},${y} L${x2},${y} M${x2 - d * 13},${y - 10} L${x2},${y} L${x2 - d * 13},${y + 10}`, cls);
  };
  /* Dashed rule and words: the marker for this series' own reading, same wording everywhere; `kind` names the
     kind of reading after a dot (并置对照 for two sources set side by side). */
  const READING = '本系列的读法';
  const legend = (root, x, y, kind) => K.box(root, 'iu-legend', x, y, 700, null, `<i></i>${READING}${kind ? ' · ' + kind : ''}`);
  /* The frame a beat is composed for, as [x0, y0, x1, y1]. The camera (film/camera.js) frames what is painted and
     visible, so a beat whose parts arrive one by one would be re-framed at every arrival. This box is painted
     (data-cam="frame") but never seen: while it is on, from `a` to `b`, the camera holds the whole beat. */
  const shot = (root, [x0, y0, x1, y1], a, b) => {
    const g = K.box(root, 'iu-shot', x0, y0, x1 - x0, y1 - y0);
    g.dataset.cam = 'frame';
    gsap.set(g, { autoAlpha: 0 });
    tl.to(g, { autoAlpha: 1, duration: 0.01, ease: 'none' }, a);
    if (b !== undefined) tl.to(g, { autoAlpha: 0, duration: 0.01, ease: 'none' }, b);
    return g;
  };
  /* The phrase of a quote the narration lands on, English and Chinese together: K.lit at `at`.
     `pairs` are [element, phrase]; one phrase per element. Returns the spans so a scene can put them back. */
  const litPhrase = (pairs, at) => {
    const spans = pairs.map(([e, sub]) => marks(e, [sub])[0]);
    K.lit(spans, at, { color: BLUE });
    return spans;
  };

  // ================================================================ 一顶安全帽 (b1–b5)
  Film.scene('iu-hardhat', u.bodyStart - 0.2, T('iu.b6') + 0.2, ({ root, from }) => {
    open(root, '一顶安全帽', from);
    // camera: close on the photo; back to the whole page as the client's plan arrives (b1–b2);
    // one frame for the three steps of b3–b5, so the boxes stay put while their contents change
    const planAt = T('iu.b1', '高端产品');
    shot(root, [120, 170, 1120, 800], from, planAt - 1.0);
    shot(root, [120, 170, 1800, 810], planAt - 1.0, T('iu.b3') - 0.4);
    shot(root, [184, 230, 1736, 720], T('iu.b3') - 0.4, T('iu.b5') - 0.4);
    shot(root, [184, 230, 1736, 880], T('iu.b5') - 0.4);

    // b1: the hat, the client's plan, the researcher
    const fig = K.figure(root, 'iu.hardhat-hongkong-site', 120, 170, 1000, 563);
    const figCap = K.box(root, 'iu-cap', 120, 756, 1000, null, '安全帽 · 劳保用品');
    K.show(fig, from + 0.15, { y: 0, scale: 1.02, duration: 0.9 });
    K.show(figCap, T('iu.b1', '劳保用品') - 0.2, { y: 10 });
    const planLab = K.box(root, 'iu-label', 1200, 176, 600, null, '客户的计划');
    const planHead = K.box(root, 'iu-head', 1200, 220, 600, null, '高端安全帽');
    const planRows = ['加功能', '提高售价'].map((t, i) => K.box(root, 'iu-plus', 1200, 330 + i * 70, 600, null, t));
    K.show(planLab, T('iu.b1', '高端产品') - 0.7, { y: 10 });
    K.show(planHead, T('iu.b1', '高端产品') - 0.25, { y: 14 });
    K.show(planRows[0], T('iu.b1', '加') - 0.15, { y: 10 });
    K.show(planRows[1], T('iu.b1', '卖') - 0.15, { y: 10 });
    // the only approved photo of him is a stage shot too small to crop to a face: the name stands alone
    const whoCap = K.box(root, 'iu-who', 1200, 556, 620, null, '<b>Steve Portigal</b><span>受托访谈安全帽使用者</span>');
    const [whoName, whoRole] = whoCap.children;
    K.show(whoName, T('iu.b1', '被请去') - 0.9, { y: 12 });
    K.show(whoRole, T('iu.b1', '被请去') - 0.2, { y: 10 });

    // b2: what he did not ask, what he asked, what came up
    const b2 = T('iu.b2');
    K.hide([planLab, planHead, ...planRows, whoCap], b2 - 0.45, { duration: 0.4 });
    const notLab = K.box(root, 'iu-label', 1200, 176, 600, null, '未问');
    const notTxt = K.box(root, 'iu-struck', 1200, 222, 600, null, '对计划中功能的评价');
    const askLab = K.box(root, 'iu-label', 1200, 316, 600, null, '只问');
    const askTxt = K.box(root, 'iu-line', 1200, 360, 600, null, '受访者的工作');
    const gotLab = K.box(root, 'iu-label', 1200, 470, 600, null, '谈到');
    const got = ['午饭时离开工地', '一身亮色安全装备', '走在人群里'].map((t, i) => K.box(root, 'iu-cap', 1200, 516 + i * 56, 600, null, t));
    const awk = K.box(root, 'iu-awk', 1200, 690, 600, null, '尴尬');
    K.show([notLab, notTxt], T('iu.b2', '评价') - 0.35, { y: 10, stagger: 0.08 });
    K.show([askLab, askTxt], T('iu.b2', '笼统') - 0.25, { y: 10, stagger: 0.08 });
    K.show(gotLab, T('iu.b2', '聊出来') - 0.2, { y: 10 });
    K.show(got[0], T('iu.b2', '中午') - 0.2, { y: 10 });
    K.show(got[1], T('iu.b2', '亮色') - 0.3, { y: 10 });
    K.show(got[2], T('iu.b2', '人群') - 0.25, { y: 10 });
    K.show(awk, T('iu.b2', '尴尬') - 0.25, { y: 16, duration: 0.6 });

    // b3: the version told on stage; three steps that will be replaced by what happened
    const b3 = T('iu.b3');
    K.hide([fig, figCap, notLab, notTxt, askLab, askTxt, gotLab, ...got, awk], b3 - 0.4, { duration: 0.4 });
    const headA = K.box(root, 'iu-label', 200, 236, 1520, null, '台上的版本');
    const headB = K.box(root, 'iu-label', 200, 236, 1520, null, '实际的结果');
    const BX = [200, 730, 1260], BW = 460;
    const boxes = BX.map(x => K.box(root, 'iu-step', x, 300, BW, 220));
    const sv = K.svg(root, 'iu-hh-lines');
    const links = [0, 1].map(i => arrow(sv, BX[i] + BW + 6, 410, BX[i + 1] - 8, 'ln soft'));
    K.show(headA, b3 + 0.05, { y: 8 });
    // the empty chain is set out as the narration takes the story to the stage, then filled step by step
    K.show(boxes, T('iu.b3', '讲') - 0.25, { y: 14, stagger: 0.08 });
    links.forEach(a => drawStrokes(a, T('iu.b3', '收尾') - 0.1, 0.45));
    const DREAM = [['发现新机会', '团队'], ['推翻原计划', '推翻'], ['大赚一笔', '大赚']];
    const dream = DREAM.map(([t, w], i) => {
      const e = K.el(boxes[i], 'iu-step-in dream', `<b>${t}</b>`);
      K.show(e, T('iu.b3', w) - 0.2, { y: 10 });
      return e;
    });
    const strike = K.path(sv, 'M184,410 L1736,410', 'ln');
    K.draw(strike, T('iu.b3', '不会') - 0.35, { duration: 0.6, ease: 'power2.out' });
    const qStage = K.quote(root, 'iu.hh-not-tedx', 200, 600, 1520, { size: 42 });
    K.show(qStage.root, T('iu.b3', '说') - 0.45, { y: 16 });

    // b4: the same three boxes take what actually happened
    const b4 = T('iu.b4');
    K.hide([qStage.root, strike, headA], b4 - 0.35, { duration: 0.4 });
    K.show(headB, b4 + 0.05, { y: 8 });
    tl.to(dream, { opacity: 0.3, duration: 0.5 }, b4 - 0.3);
    const REAL = [
      { top: '加功能的方案', at: T('iu.b4', '加功能') - 0.3, mid: '商业风险大', midAt: T('iu.b4', '风险') - 0.3, end: '停止开发', endAt: T('iu.b4', '停了') - 0.25 },
      { top: '时髦安全帽', at: T('iu.b4', '时髦') - 0.45, mid: '不合公司的技术与文化', midAt: T('iu.b4', '不合') - 0.25, end: '未开发', endAt: T('iu.b4', '没有做') - 0.25 },
      { top: '推向市场的产品', at: T('iu.b4', '最后') - 0.2, end: '0', endAt: T('iu.b4', '产品') - 0.3, zero: true },
    ];
    const ends = REAL.map((r, i) => {
      tl.to(dream[i], { autoAlpha: 0, y: -8, duration: 0.25, ease: 'power2.in' }, r.at - 0.3);
      tl.to(boxes[i], { borderColor: INK, duration: 0.3 }, r.at);
      const box = K.el(boxes[i], 'iu-step-in real');
      const top = K.el(box, 'top', r.top);
      K.show(top, r.at, { y: 8, duration: 0.5 });
      if (r.mid) K.show(K.el(box, 'mid', r.mid), r.midAt, { y: 8, duration: 0.5 });
      const end = K.el(box, 'end' + (r.zero ? ' zero t-num' : ''), r.end);
      K.show(end, r.endAt, { y: 10, duration: 0.5 });
      return end;
    });
    // the zero: the first two step out before the camera closes on the last box, and the zero holds still through
    // 也没上市; when b5 counts all three as a result, the camera steps back and they return under one brace.
    // The push-in would cut them at the frame edge, so each is gone before the edge reaches it (the first box with
    // the heading, then the second) and back once the pull-out has brought it inside the 80 px margin
    const zIn = T('iu.b4', '一样') - 0.2, zOut = T('iu.b5', '这也算作') + 0.3;
    K.focus(boxes[2], zIn, zOut, { zoom: 1.35, pad: 80 });
    const back0 = zOut + 0.8;
    [[[boxes[0], ...links[0], headB], zIn - 1.7, back0], [[boxes[1], ...links[1]], zIn - 0.45, zOut - 0.5]].forEach(([els, out, back]) => {
      tl.fromTo(els, { opacity: 1 }, { opacity: 0, duration: 0.6, ease: 'power2.inOut', immediateRender: false }, out);
      tl.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.inOut', immediateRender: false }, back);
    });

    // b5: all of it counts as the result; the job is to inform decisions. The brace and its label start where the
    // first box does, so they wait for it
    const brace = K.path(sv, 'M200,548 L200,566 L1720,566 L1720,548', 'ln');
    K.draw(brace, back0, { duration: 0.8 });
    const res = K.box(root, 'iu-result', 200, 590, 1520, null, '<span>访谈的成果</span><em>不推出产品的决定</em>');
    const [resA, resB] = res.children;
    K.show(resA, back0, { y: 8 });
    const qJob = K.quote(root, 'iu.researcher-job', 200, 690, 1520, { size: 37 });
    K.show(qJob.root, T('iu.b5', '在他看来') - 0.2, { y: 14 });
    litPhrase([[qJob.en, 'inform critical decisions'], [qJob.zh, '关键决定提供依据']], T('iu.b5', '关键') - 0.2);
    const dec = T('iu.b5', '决定不做') - 0.25;
    K.show(resB, dec, { y: 8 });
    tl.to(boxes[2], { borderColor: BLUE, duration: 0.4 }, dec);
    tl.to(ends[2], { color: BLUE, duration: 0.4 }, dec);

    K.source(root, BOOK2, T('iu.b1') + 0.6, T('iu.b5', 'end') + 0.3,
      ['iu.hh-premium', 'iu.hh-method', 'iu.hh-finding', 'iu.hh-not-tedx', 'iu.hh-stop', 'iu.hh-fashion-dropped', 'iu.hh-no-product', 'iu.researcher-job']);
  });

  // ================================================================ 两个版本 (b6)
  Film.scene('iu-editions', T('iu.b6') - 0.3, T('iu.b7') + 0.2, ({ root, from }) => {
    open(root, '版本与出处', from);
    // camera: the axis row, then down to what this episode uses from each edition
    const usedAt = T('iu.b6', '两版');
    shot(root, [200, 200, 1750, 520], from, usedAt - 0.9);
    shot(root, [200, 200, 1750, 960], usedAt - 0.9);
    const sv = K.svg(root, 'iu-ed-lines');
    const axis = K.path(sv, 'M200,420 L1720,420', 'ln');
    K.draw(axis, from + 0.2, { duration: 1.0 });
    const node = (x, year, title, cls, at) => {
      const els = [
        K.box(root, 'iu-ed-year t-num', x - 200, 334, 400, null, year),
        K.box(root, 'iu-ed-dot ' + cls, x - 13, 407, 26, 26),
        K.box(root, 'iu-ed-title ' + cls, x - 200, 448, 400, null, title),
      ];
      K.show(els, at, { y: 10, stagger: 0.06, duration: 0.6 });
      return els;
    };
    // the story hangs from the edition it comes from: the chip sits over 2023 and a tie drops to it
    const chip = K.box(root, 'iu-chip', 1370, 214, 380, 72, '安全帽的故事');
    K.show(chip, from + 0.35, { y: 12 });
    const e2 = node(1560, '2023', '第 2 版', 'book', T('iu.b6', '第二版') - 0.7);
    K.draw(K.path(sv, 'M1560,290 L1560,330', 'ln'), T('iu.b6', '第二版') - 0.3, { duration: 0.35 });
    node(600, '2015', 'Qureshi 入职', 'mark', T('iu.b6', '入职') - 0.7);
    node(360, '2013', '第 1 版', 'book', T('iu.b6', '第一版') - 0.7);

    // what this episode uses from each
    const cardA = K.box(root, 'iu-use', 200, 590, 520, 190, '<div>目录</div><div>第 3 章节选</div>');
    const cardB = K.box(root, 'iu-use', 1200, 590, 520, 190, '<div class="ch1">第 1 章</div><span class="iu-default">默认出处</span>');
    // the author's own materials span 2012–2024, so they sit below the to-scale axis, not on it
    const outLab = K.box(root, 'iu-label', 200, 812, 1520, null, '书以外 · 2012–2024');
    const cardC = K.box(root, 'iu-use author', 200, 858, 1520, 96, '<p>作者公布的材料</p><div>工作表格</div><div>采访</div>');
    const ties = [K.path(sv, 'M360,512 L360,586', 'ln soft'), K.path(sv, 'M1560,512 L1560,586', 'ln soft')];
    const used = usedAt - 0.2;
    K.draw(ties, used - 0.2, { duration: 0.4 });
    K.show([cardA, cardB], used, { y: 14, stagger: 0.12 });
    const [cHead, cWs, cIv] = cardC.children;
    K.show([outLab, cardC], T('iu.b6', '加上') - 0.2, { y: 14, stagger: 0.08 });
    gsap.set([cWs, cIv], { autoAlpha: 0 });
    K.show(cWs, T('iu.b6', '工作表格') - 0.25, { y: 8 });
    K.show(cIv, T('iu.b6', '采访') - 0.25, { y: 8 });
    // unless a line says otherwise: the 2nd edition, chapter 1
    const def = T('iu.b6', '没有特别说明') - 0.2;
    const [ch1, defTag] = cardB.children;
    gsap.set(defTag, { autoAlpha: 0 });
    tl.to(cardB, { borderColor: BLUE, duration: 0.4 }, def);
    tl.to(ch1, { color: BLUE, duration: 0.4 }, def);
    K.show(defTag, def + 0.1, { y: 8 });
    tl.to(e2[1], { backgroundColor: BLUE, borderColor: BLUE, duration: 0.4 }, def);
    K.source(root, 'Rosenfeld Media 图书页（第 1、2 版）· Nabeel Qureshi, Reflections on Palantir, 2024', from + 0.8, T('iu.b6', 'end') + 0.3,
      ['iu.toc-1e-pubinfo', 'iu.pubinfo-2e', 'iu.qu-joined']);
  });

  // ================================================================ 够用就行 (b7–b11)
  Film.scene('iu-satisficing', T('iu.b7') - 0.3, T('iu.b12') + 0.2, ({ root, from }) => {
    open(root, '够用就行', from);
    const [b8, b9, b10, b11] = ['iu.b8', 'iu.b9', 'iu.b10', 'iu.b11'].map(id => T(id));
    // camera: close on the common view, back to the page when Portigal answers it (b7); one frame each for the
    // two sizes of pain (b8) and the sling (b9); in b10 the term and the shrunken sling first, then the four
    // examples; then in on the balance and its moral (b11)
    const answer = T('iu.b7', '觉得') - 1.0;
    shot(root, [200, 230, 840, 720], from, answer);
    shot(root, [200, 230, 1720, 720], answer, b8 - 0.4);
    shot(root, [200, 290, 1720, 690], b8 - 0.4, b9 - 0.4);
    shot(root, [250, 180, 1720, 960], b9 - 0.4, b10 - 0.4);
    const wide = T('iu.b10', '抽屉') - 1.4;
    shot(root, [150, 150, 960, 840], b10 - 0.4, wide);
    shot(root, [200, 150, 1720, 770], wide, b11 - 0.5);
    shot(root, [380, 360, 1540, 880], b11 - 0.5);

    // b7: "finding pain points" as foraging, against digging with a plan
    const said = K.box(root, 'iu-label', 200, 236, 640, null, '常见的说法');
    const pain = K.box(root, 'iu-big', 200, 282, 640, null, '找痛点');
    K.show(said, from + 0.3, { y: 8 });
    K.show(pain, T('iu.b7', '找痛点') - 0.3, { y: 14 });
    const tray = K.box(root, 'iu-tray', 200, 500, 600, 210);
    const need = Array.from({ length: 7 }, (_, i) =>
      K.box(tray, 'iu-need', 28 + (i % 4) * 140 + (i >= 4 ? 70 : 0), i < 4 ? 26 : 112, 124, 64, '需求'));
    K.show(tray, T('iu.b7', '出门') - 0.2, { y: 10 });
    K.show(need, T('iu.b7', '一圈') - 0.1, { y: -40, duration: 0.5, stagger: 0.16, ease: 'power2.out' });
    const qDig = K.quote(root, 'iu.pain-dig', 960, 250, 760, { size: 40 });
    K.show(qDig.root, T('iu.b7', '觉得') - 0.45, { y: 16 });
    tl.to([said, pain, tray], { autoAlpha: 0.35, duration: 0.6 }, T('iu.b7', '觉得') - 0.45);
    litPhrase([[qDig.en, 'work hard and dig for them'], [qDig.zh, '下功夫去挖']], T('iu.b7', '力气') - 0.3);

    // b8: the same pain point at two sizes. The person's copy peels off the designers' box and shrinks as it
    // crosses to the other side: one object, seen from two places
    K.hide([said, pain, tray, qDig.root], b8 - 0.4, { duration: 0.4 });
    const pvL = K.box(root, 'iu-label', 200, 300, 700, null, '设计师与工程师眼中');
    const pvR = K.box(root, 'iu-label', 1100, 300, 620, null, '当事人眼中');
    const bigP = K.box(root, 'iu-pain big', 200, 380, 560, 300, '痛点');
    const smallP = K.box(root, 'iu-pain big', 200, 380, 560, 300, '痛点');
    const less = K.box(root, 'iu-cap', 1100, 620, 620, null, '未必那么痛');
    K.show([pvL, bigP], b8 + 0.1, { y: 14, stagger: 0.1 });
    const peel = T('iu.b8', '当事人') - 0.35;
    gsap.set(smallP, { autoAlpha: 0 });
    tl.to(smallP, { autoAlpha: 1, duration: 0.01, ease: 'none' }, peel);
    tl.to(smallP, { left: 1100, top: 478, width: 220, height: 104, fontSize: 46, borderWidth: 2.5, borderColor: '#7d8a9c', color: '#7d8a9c',
      duration: 1.1, ease: 'power2.inOut' }, peel);
    K.show(pvR, peel + 0.2, { y: 10 });
    K.show(less, T('iu.b8', '未必') - 0.2, { y: 10 });

    // b9: the phone sling, drawn from the description
    K.hide([pvL, pvR, bigP, smallP, less], b9 - 0.4, { duration: 0.4 });
    const sling = K.box(root, 'iu-sling', 0, 0, 1920, 1080);
    const ss = K.svg(sling, 'iu-sling-svg');
    const seat = K.path(ss, 'M260,960 L260,262 Q260,190 332,190 L688,190 Q760,190 760,262 L760,960', 'ln');
    const trayT = K.path(ss, 'M318,486 L702,486 Q716,486 716,500 L716,800 Q716,814 702,814 L318,814 Q304,814 304,800 L304,500 Q304,486 318,486 Z', 'ln');
    const recess = K.path(ss, 'M334,528 L686,528', 'ln soft');
    const ROPE_UP = 'M510,546 L510,486 L513,438';
    // the rope is one path: twisted where the bag lay, then carried round the phone. Both shapes have the same
    // commands, so the path morphs from one to the other instead of one rope fading for another
    const ROPE_LOOSE = 'M846,880 C866,866 886,894 906,880 C926,866 946,894 966,880 C986,866 1000,892 1012,884 C1018,880 1022,876 1026,880';
    const ROPE_LOOP = 'M510,546 C440,552 420,640 428,704 C436,776 470,806 510,806 C550,806 584,776 592,704 C600,640 580,552 510,546';
    const up = K.path(ss, ROPE_UP, 'ln iu-rope');
    const upTw = K.path(ss, ROPE_UP, 'iu-twist');
    const phone = K.path(ss, 'M466,566 L554,566 Q570,566 570,582 L570,770 Q570,786 554,786 L466,786 Q450,786 450,770 L450,582 Q450,566 466,566 Z', 'ln iu-phone');
    const screen = K.path(ss, 'M462,590 L558,590 L558,756 L462,756 Z', 'ln soft');
    const latch = K.path(ss, 'M484,464 L536,464 Q544,464 544,472 L544,484 Q544,492 536,492 L484,492 Q476,492 476,484 L476,472 Q476,464 484,464 Z', 'ln iu-latch');
    const bag = K.path(ss, 'M856,812 L1000,812 L1010,948 L846,948 Z M856,812 L866,786 L884,808 L902,782 L922,806 L942,780 L962,806 L982,784 L1000,812', 'ln');
    const rope = K.path(ss, ROPE_LOOSE, 'ln iu-rope');
    const ropeTw = K.path(ss, ROPE_LOOSE, 'iu-twist');
    K.draw([seat, trayT, recess], T('iu.b9', '长途') - 0.2, { duration: 1.2, stagger: 0.15 });
    K.draw(latch, T('iu.b9', '前排') + 0.2, { duration: 0.5 });
    K.draw(bag, T('iu.b9', '塑料袋') - 0.35, { duration: 0.7 });
    K.hide(bag, T('iu.b9', '拧成') - 0.15, { duration: 0.35 });
    K.draw(rope, T('iu.b9', '拧成') - 0.05, { duration: 0.5 });
    K.show(ropeTw, T('iu.b9', '拧成') + 0.4, { y: 0, duration: 0.3 });
    K.show([phone, screen], T('iu.b9', '绕住') - 0.55, { y: 0, duration: 0.4 });
    const wrapAt = T('iu.b9', '绕住') - 0.15;
    // the drawn rope's dash is as long as the loose rope; lengthen it first so the longer loop is not cut short
    tl.to(rope, { strokeDasharray: '2400 2400', duration: 0.01, ease: 'none' }, wrapAt - 0.05);
    tl.to([rope, ropeTw], { attr: { d: ROPE_LOOP }, duration: 1.0, ease: 'power2.inOut' }, wrapAt);
    K.draw(up, T('iu.b9', '塞进') - 0.1, { duration: 0.7 });
    K.show(upTw, T('iu.b9', '卡扣') - 0.1, { y: 0, duration: 0.3 });
    // labels with leader lines, cleared before the quote
    const LAB = [
      ['前排座椅背', 212, 'M1046,236 L764,262', T('iu.b9', '前排') - 0.1],
      ['小桌板卡扣', 452, 'M1046,478 L548,478', T('iu.b9', '小桌板') - 0.2],
      ['手机', 640, 'M1046,664 L574,664', T('iu.b9', '手机') - 0.3],
      ['飞机毯的塑料袋', 856, null, T('iu.b9', '塑料袋') - 0.1],
    ];
    const labs = LAB.map(([t, y, d, at]) => {
      const l = K.box(root, 'iu-cap', 1060, y, 520, null, t);
      K.show(l, at + 0.15, { y: 8, duration: 0.5 });
      if (d) K.draw(K.path(ss, d, 'ln thin'), at, { duration: 0.5 });
      return l;
    });
    const leaders = () => [...ss.querySelectorAll('path.thin')];
    // the bag's label goes with the bag: once the rope has left for the phone it would name an empty spot
    K.hide(labs[3], wrapAt + 0.6, { duration: 0.4 });
    const turn = T('iu.b9', '这套东西') - 0.35;
    K.hide([...labs, ...leaders()], turn, { duration: 0.4 });
    const qTurn = K.quote(root, 'iu.airplane-turn', 1000, 250, 720, { size: 37 });
    K.show(qTurn.root, turn + 0.35, { y: 14 });
    // "it was beautiful in its own way" as the narration turns from ugly to beautiful; the point then moves to the materials
    const beauty = litPhrase([[qTurn.en, 'it was beautiful in its own way'], [qTurn.zh, '它自有一种美']], T('iu.b9', '自有') - 0.25);
    const atHand = K.box(root, 'iu-hand', 1000, 660, 720, null, '<b>手边现成的东西</b><span>飞机毯的塑料袋 · 小桌板卡扣</span>');
    const hand = T('iu.b9', '手边') - 0.3;
    K.show(atHand, hand, { y: 10 });
    tl.to([rope, up, latch], { stroke: BLUE, duration: 0.4 }, hand);
    tl.to(beauty[0], { color: INK, duration: 0.4 }, hand);
    tl.to(beauty[1], { color: INK2, duration: 0.4 }, hand);

    // b10: satisficing; the sling shrinks into the first of four examples
    K.hide([qTurn.root, atHand], b10 - 0.4, { duration: 0.4 });
    gsap.set(sling, { transformOrigin: '0 0' });
    tl.to(sling, { x: 151, y: 288, scale: 0.43, duration: 1.2, ease: 'power2.inOut' }, b10 - 0.2);
    tl.to([rope, up, latch], { stroke: INK, duration: 0.6 }, b10 + 0.4);
    const sat = K.box(root, 'iu-sat', 200, 150, 1520, null, '<b>够用就行</b><i>satisficing</i>');
    const [satZh, satEn] = sat.children;
    // as wide as its words, so the camera can frame the term and the sling together
    const satNote = K.box(root, 'iu-label', 200, 262, null, null, 'satisfy + suffice · Herbert Simon, 1956');
    K.show(satZh, b10 + 0.8, { y: 12 });
    K.show(satEn, T('iu.b10', '叫') + 0.15, { y: 12 });
    K.show(satNote, T('iu.b10', '叫') + 0.8, { y: 8 });
    const SX = [200, 590, 980, 1370], SW = 350;
    const caps = ['塑料袋做的手机吊带', '配不上对的盖子', '没拆封的说明书', '又缠又短的连接线']
      .map((t, i) => K.box(root, 'iu-ex-cap', SX[i], 720, SW, null, t));
    K.show(caps[0], b10 + 0.8, { y: 8 });
    const xs = K.svg(root, 'iu-ex');
    // lids overflowing a drawer
    const x1 = SX[1];
    const drawer = [K.path(xs, `M${x1 + 35},560 L${x1 + 315},560 L${x1 + 315},680 L${x1 + 35},680 Z`, 'ln'),
      K.path(xs, `M${x1 + 140},620 L${x1 + 210},620`, 'ln'),
      K.path(xs, `M${x1 + 35},560 L${x1 + 62},522 L${x1 + 288},522 L${x1 + 315},560`, 'ln soft')];
    const LIDS = [[110, 508, 64, 16, -8], [236, 500, 58, 15, 10], [128, 458, 50, 13, 6], [250, 446, 40, 11, -12], [186, 414, 34, 10, 4]];
    const lids = LIDS.map(([cx, cy, rx, ry, r]) => K.sv(xs, 'ellipse', { cx: x1 + cx, cy, rx, ry, class: 'ln', transform: `rotate(${r} ${x1 + cx} ${cy})` }));
    const lidSq = K.path(xs, `M${x1 + 150},482 L${x1 + 262},474 L${x1 + 264},494 L${x1 + 152},502 Z`, 'ln');
    const ex1 = T('iu.b10', '抽屉') - 0.3;
    K.draw(drawer, ex1, { duration: 0.6 });
    K.draw([...lids, lidSq], ex1 + 0.4, { duration: 0.5, stagger: 0.1 });
    K.show(caps[1], ex1 + 0.3, { y: 8 });
    // an owner's manual still in its wrap
    const x2 = SX[2];
    const manual = [K.path(xs, `M${x2 + 95},420 L${x2 + 255},420 L${x2 + 255},650 L${x2 + 95},650 Z`, 'ln'),
      K.path(xs, `M${x2 + 120},460 L${x2 + 230},460 M${x2 + 120},484 L${x2 + 200},484`, 'ln soft'),
      K.path(xs, `M${x2 + 118},590 L${x2 + 134},562 L${x2 + 206},562 L${x2 + 224},590 L${x2 + 236},592 L${x2 + 236},610 L${x2 + 118},610 Z`, 'ln'),
      K.sv(xs, 'circle', { cx: x2 + 146, cy: 612, r: 10, class: 'ln' }),
      K.sv(xs, 'circle', { cx: x2 + 208, cy: 612, r: 10, class: 'ln' })];
    const wrap = [K.path(xs, `M${x2 + 82},408 L${x2 + 268},408 Q${x2 + 278},408 ${x2 + 278},418 L${x2 + 278},652 Q${x2 + 278},662 ${x2 + 268},662 L${x2 + 82},662 Q${x2 + 72},662 ${x2 + 72},652 L${x2 + 72},418 Q${x2 + 72},408 ${x2 + 82},408 Z`, 'ln soft'),
      K.path(xs, `M${x2 + 196},430 L${x2 + 244},478 M${x2 + 214},428 L${x2 + 250},464`, 'ln soft')];
    const ex2 = T('iu.b10', '汽车') - 0.3;
    K.draw(manual, ex2, { duration: 0.6, stagger: 0.06 });
    K.draw(wrap, ex2 + 0.5, { duration: 0.5 });
    K.show(caps[2], ex2 + 0.3, { y: 8 });
    // a short cable, tangled, between two devices
    const x3 = SX[3];
    const devs = [K.path(xs, `M${x3 + 20},520 L${x3 + 110},520 L${x3 + 110},600 L${x3 + 20},600 Z`, 'ln'),
      K.path(xs, `M${x3 + 240},540 L${x3 + 330},540 L${x3 + 330},620 L${x3 + 240},620 Z`, 'ln')];
    const cable = K.path(xs, `M${x3 + 110},560 C${x3 + 150},560 ${x3 + 146},492 ${x3 + 176},494 C${x3 + 210},496 ${x3 + 204},560 ${x3 + 168},556 C${x3 + 132},552 ${x3 + 156},618 ${x3 + 192},606 C${x3 + 220},596 ${x3 + 214},580 ${x3 + 240},580`, 'ln');
    const ex3 = T('iu.b10', '连接线') - 0.3;
    K.draw(devs, ex3, { duration: 0.5 });
    K.draw(cable, ex3 + 0.3, { duration: 0.9 });
    K.show(caps[3], ex3 + 0.3, { y: 8 });

    // the balance: the pain weighs less than the effort to fix it
    const bal = T('iu.b10', '人们觉得') - 0.25;
    const exAll = [sling, ...caps, xs];
    K.hide(exAll, bal - 0.2, { duration: 0.45 });
    const bs = K.svg(root, 'iu-bal');
    const post = K.path(bs, 'M960,430 L960,700 M870,700 L1050,700', 'ln');
    const beam = K.box(root, 'iu-beam', 540, 412, 840, 8);
    const pivot = K.box(root, 'iu-pivot', 948, 404, 24, 24);
    const pan = (cx, text) => {
      const g = K.box(root, 'iu-pan', cx - 180, 416, 360, 230);
      K.el(g, 'iu-pan-str');
      K.el(g, 'iu-pan-dish');
      K.el(g, 'iu-pan-lab', text);
      return g;
    };
    const panL = pan(560, '麻烦带来的痛'), panR = pan(1360, '解决要花的力气');
    const [labL, labR] = [panL.lastChild, panR.lastChild];
    gsap.set([labL, labR], { autoAlpha: 0 });
    K.draw(post, bal + 0.1, { duration: 0.5 });
    K.show([beam, pivot, panL, panR], bal + 0.25, { y: 0, duration: 0.5, stagger: 0.04 });
    K.show(labL, T('iu.b10', '麻烦') - 0.2, { y: 8 });
    K.show(labR, T('iu.b10', '犯不上') - 0.1, { y: 8 });
    const tip = T('iu.b10', '力气') - 0.1;
    const A = 7, dy = 420 * Math.sin(A * Math.PI / 180);
    gsap.set(beam, { transformOrigin: '50% 50%' });
    tl.to(beam, { rotation: A, duration: 1.1, ease: 'power2.inOut' }, tip);
    tl.to(panL, { y: -dy, duration: 1.1, ease: 'power2.inOut' }, tip);
    tl.to(panR, { y: dy, duration: 1.1, ease: 'power2.inOut' }, tip);

    // b11: what you see as a need may be what they tolerate
    K.hide([sat, satNote], b11 - 0.3, { duration: 0.4 });
    // as wide as its words, centred, so the camera can close on the balance and its moral together
    const sum = K.box(root, 'iu-sum', 0, 790, null, null, '所见的需求，对方可能完全可以忍受');
    sum.style.left = (960 - sum.offsetWidth / 2) + 'px';
    K.show(sum, T('iu.b11', '看到') - 0.35, { y: 14 });

    K.source(root, BOOK2, from + 0.8, T('iu.b11', 'end') + 0.3,
      ['iu.pain-foraging', 'iu.pain-dig', 'iu.pain-not-painful', 'iu.airplane-sling', 'iu.airplane-turn',
        'iu.satisficing-def', 'iu.satisficing-examples', 'iu.satisficing-effort', 'iu.need-tolerated']);
  });

  // ================================================================ 开工之前 (b12–b17)
  Film.scene('iu-plan', T('iu.b12') - 0.3, T('iu.b18') + 0.2, ({ root, from }) => {
    open(root, '开工之前', from);
    const sv = K.svg(root, 'iu-plan-lines');
    // camera: it rises with the plan segment into the bracket, tilts down when the participants' questions fall
    // outside the plan (b13), and holds one frame per beat after that
    const up = T('iu.b12', '一份') - 0.3, outside = T('iu.b13', '想问') - 1.0;
    const [c14, c15, c16, c17] = ['iu.b14', 'iu.b15', 'iu.b16', 'iu.b17'].map(id => T(id) - 0.4);
    shot(root, [200, 440, 1720, 670], from, up + 0.3);
    shot(root, [184, 190, 1736, 640], up + 0.3, outside);
    shot(root, [184, 190, 1736, 900], outside, c14);
    shot(root, [184, 150, 1736, 770], c14, c15);
    shot(root, [200, 320, 1720, 830], c15, c16);
    shot(root, [200, 180, 1720, 820], c16, c17);
    shot(root, [200, 190, 1720, 760], c17);

    // b12: the work goes in before the start, built from the first frame; the plan has three parts
    const line = K.path(sv, 'M200,560 L1720,560', 'ln soft');
    const tick = K.path(sv, 'M760,526 L760,594', 'ln');
    const seg = K.box(root, 'iu-plan-seg', 200, 556, 560, 8);
    const go = K.box(root, 'iu-mark', 660, 460, 200, null, '开工');
    const pl = K.box(root, 'iu-mark blue', 200, 600, 560, null, '计划');
    const iv = K.box(root, 'iu-mark dim', 760, 600, 960, null, '访谈');
    K.draw(line, from + 0.1, { duration: 0.7 });
    K.draw(tick, from + 0.25, { duration: 0.3 });
    K.show(go, from + 0.3, { y: 8 });
    gsap.set(seg, { scaleX: 0, transformOrigin: '100% 50%' });
    tl.to(seg, { scaleX: 1, duration: 0.7, ease: 'power3.out' }, from + 0.45);
    K.show(pl, from + 0.6, { y: 8 });
    K.show(iv, from + 0.8, { y: 8 });
    // the plan segment rises into the heading and becomes the bracket the three parts hang from
    K.hide([line, tick, go, iv], up, { duration: 0.4 });
    tl.to(seg, { x: -16, y: -294, width: 1552, height: 3, duration: 1.0, ease: 'power2.inOut' }, up);
    // its label rides along under it and hands over to the heading above
    tl.to(pl, { y: -294, duration: 1.0, ease: 'power2.inOut' }, up);
    tl.to(pl, { autoAlpha: 0, duration: 0.35 }, up + 0.5);
    const head = K.box(root, 'iu-label', 200, 200, 1520, null, '一份研究计划');
    K.show(head, up + 0.7, { y: 0, duration: 0.4 });
    tl.to(seg, { backgroundColor: INK, duration: 0.4 }, up + 0.9);
    const legs = [K.path(sv, 'M184,264 L184,620 L200,620', 'ln'), K.path(sv, 'M1736,264 L1736,620 L1720,620', 'ln')];
    K.draw(legs, up + 0.9, { duration: 0.6, stagger: 0 });
    const CX = [200, 720, 1240], CW = 480, CY = 300, CH = 300;
    const PLAN = [
      ['业务问题', '关于组织自己', '业务问题', '组织自己'],
      ['研究问题', '关于用户', '研究问题', '用户那里'],
      ['研究方法', '已商定的做法', '研究方法', '研究方法'],
    ];
    const cards = PLAN.map(([t, s, w1, w2], i) => {
      const c = K.box(root, 'iu-pcard', CX[i], CY, CW, CH, `<b>${t}</b><span>${s}</span><i></i>`);
      const [tt, sub] = c.children;
      K.show(tt, T('iu.b12', w1) - 0.25, { y: 10 });
      K.show(sub, T('iu.b12', w2) - (i === 2 ? -0.4 : 0.25), { y: 8 });
      return c;
    });
    K.show(cards, T('iu.b12', '拆成') - 0.25, { y: -16, stagger: 0.1 });

    // b13: inward, outward; questions for participants sit below the bracket, outside the plan
    [['朝里看', 'in', '朝里看'], ['朝外看', 'out', '朝外看']].forEach(([t, k, w], i) => {
      const chip = cards[i].children[2];
      chip.className = 'iu-look ' + k;
      chip.textContent = t;
      gsap.set(chip, { autoAlpha: 0 });
      const at = T('iu.b13', w) - 0.25;
      K.show(chip, at, { y: 8 });
      tl.to(chip, { color: BLUE, borderColor: BLUE, duration: 0.3 }, at);
      tl.to(chip, { color: INK, borderColor: INK, duration: 0.5 }, at + 1.4);
    });
    const pq = K.box(root, 'iu-pcard outside', 720, 720, 480, 170, '<b>访谈问题</b><span>不属于计划</span>');
    const pqNote = pq.children[1];
    gsap.set(pqNote, { autoAlpha: 0 });
    const drift = K.path(sv, 'M960,604 L960,714', 'ln soft');
    const driftLab = K.box(root, 'iu-label', 990, 640, 640, null, '讨论时的岔路');
    K.show(pq, T('iu.b13', '想问') - 0.3, { y: 14 });
    K.show(pqNote, T('iu.b13', '算不上') - 0.25, { y: 6 });
    K.draw(drift, T('iu.b13', '滑到') - 0.5, { duration: 0.5 });
    K.show(driftLab, T('iu.b13', '滑到') - 0.3, { y: 6 });

    // b14: three ways in, then asking backwards
    const b14 = T('iu.b14');
    K.hide([pq, drift, driftLab, seg, ...legs], b14 - 0.4, { duration: 0.4 });
    tl.to(head, { autoAlpha: 0, duration: 0.3 }, b14 - 0.4);
    const head2 = K.box(root, 'iu-label', 200, 160, 1520, null, '可能的起点');
    K.show(head2, b14 + 0.1, { y: 8 });
    const STARTS = [['一个处境', '处境'], ['一个研究问题', '研究问题'], ['一个方法与工期', '方法']];
    STARTS.forEach(([t, w], i) => {
      const c = K.box(root, 'iu-start', CX[i] + 40, 206, CW - 80, 62, t);
      const a = strokes(sv, `M${CX[i] + CW / 2},270 L${CX[i] + CW / 2},294 M${CX[i] + CW / 2 - 9},284 L${CX[i] + CW / 2},294 L${CX[i] + CW / 2 + 9},284`);
      const at = T('iu.b14', w) - 0.3;
      K.show(c, at, { y: -10 });
      drawStrokes(a, at + 0.25, 0.25);
    });
    const back = K.box(root, 'iu-label', 200, 716, 300, null, '往回问');
    K.show(back, T('iu.b14', '往回问') - 0.3, { y: 8 });
    const BACK = [
      [CX[2] + CW / 2, CX[1] + CW / 2, '“希望知道什么”', '希望'],
      [CX[1] + CW / 2, CX[0] + CW / 2, '“为什么需要知道”', '为什么'],
    ];
    const backEls = BACK.map(([xa, xb, t, w]) => {
      const p = strokes(sv, `M${xa},612 C${xa},700 ${xb},700 ${xb},612 M${xb - 10},626 L${xb},612 L${xb + 10},626`);
      const l = K.box(root, 'iu-ask', (xa + xb) / 2 - 260, 714, 520, null, t);
      const at = T('iu.b14', w) - 0.35;
      drawStrokes(p, at, 0.55);
      K.show(l, at + 0.3, { y: 8 });
      return [...p, l];
    }).flat();

    // b15: method → information → action; a mismatched method breaks the chain
    const b15 = T('iu.b15');
    K.hide([head2, back, ...backEls, ...cards, ...sv.querySelectorAll('path')], b15 - 0.4, { duration: 0.4 });
    root.querySelectorAll('.iu-start').forEach(e => K.hide(e, b15 - 0.4, { duration: 0.4 }));
    const sv2 = K.svg(root, 'iu-plan-lines2');
    const NX = [200, 760, 1320], NW = 400;
    const nodes = ['方法', '所需信息', '团队的行动'].map((t, i) => K.box(root, 'iu-node', NX[i], 330, NW, 170, t));
    const links = [['产出', '拿得到'], ['支撑', '帮得上']].map(([t, w], i) => {
      const a = arrow(sv2, NX[i] + NW + 8, 415, NX[i + 1] - 10);
      const l = K.box(root, 'iu-link', NX[i] + NW, 350, NX[i + 1] - NX[i] - NW, null, t);
      return { a, l, w };
    });
    K.show(nodes[0], b15 + 0.0, { y: 14 });
    drawStrokes(links[0].a, T('iu.b15', '拿得到') - 0.2, 0.35);
    K.show(links[0].l, T('iu.b15', '拿得到') - 0.1, { y: 6 });
    K.show(nodes[1], T('iu.b15', '信息') - 0.2, { y: 14 });
    drawStrokes(links[1].a, T('iu.b15', '帮得上') - 0.2, 0.35);
    K.show(links[1].l, T('iu.b15', '帮得上') - 0.1, { y: 6 });
    K.show(nodes[2], T('iu.b15', '团队') - 0.1, { y: 14 });
    const bad = K.box(root, 'iu-node bad', 200, 650, 400, 170, '对不上的方法');
    const no = K.box(root, 'iu-no', 440, 610, 160, 56, '不接');
    const brk = K.path(sv2, 'M610,735 L700,735 M726,735 L770,735', 'ln red');
    const slash = K.path(sv2, 'M704,712 L722,758', 'ln red');
    const fail = K.box(root, 'iu-fail', 790, 700, 900, null, '<b>交不出结果</b><span>责任归研究者</span>');
    const [failA, failB] = fail.children;
    gsap.set(failB, { autoAlpha: 0 });
    K.show(bad, T('iu.b15', '对不上') - 0.25, { y: 14 });
    K.show(no, T('iu.b15', '别接') - 0.25, { y: 8, scale: 0.9 });
    K.draw([brk, slash], T('iu.b15', '交不出') - 0.4, { duration: 0.4 });
    K.show(fail, T('iu.b15', '交不出') - 0.2, { y: 10 });
    K.show(failB, T('iu.b15', '责任') - 0.2, { y: 8 });

    // b16: two kickoffs, two misalignments
    const b16 = T('iu.b16');
    K.hide([...nodes, ...links.flatMap(k => [...k.a, k.l]), bad, no, brk, slash, fail], b16 - 0.4, { duration: 0.4 });
    // the principle is stated large in the middle of the frame while the narration states it; it gives way to the
    // first example, and is back in its corner over both workshops once the camera steps back (k2)
    const early = K.box(root, 'iu-head', 200, 190, null, null, '尽早摆出分歧');
    const k1 = T('iu.b16', '启动会') - 0.25, k2 = T('iu.b16', '另一场会') - 0.25;
    const S0 = 1.5;
    gsap.set(early, { transformOrigin: '0 0', x: 960 - 200 - (early.offsetWidth * S0) / 2, y: 470 - 190 - (early.offsetHeight * S0) / 2, scale: S0, autoAlpha: 0 });
    tl.to(early, { autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, b16 + 0.1);
    tl.to(early, { autoAlpha: 0, scale: S0 * 0.96, duration: 0.45, ease: 'power2.in' }, k1 - 0.5);
    tl.to(early, { x: 0, y: 0, scale: 1, duration: 0.01, ease: 'none' }, k1 + 0.2);
    const m1 = K.box(root, 'iu-meet', 200, 330, 720, null, '第一场启动工作坊');
    const m2 = K.box(root, 'iu-meet', 1000, 330, 720, null, '第二场启动工作坊');
    const q1 = K.quote(root, 'iu.2e-third-parties', 200, 400, 720, { size: 37 });
    const q2 = K.quote(root, 'iu.misalignment-sidebar', 1000, 400, 720, { size: 40 });
    K.show([m1, q1.root], k1, { y: 14, stagger: 0.1 });
    // the long first quote is read along with the narration: the camera closes on it once it is up, and each
    // phrase is lit as it is said; the camera steps back for the second workshop
    const qIn = T('iu.b16', '发起人') - 0.5;
    K.focus(q1.root, qIn, k2 - 0.3, { zoom: 1.4, pad: 50 });
    tl.to(early, { autoAlpha: 1, duration: 0.6 }, k2);
    const [tpEn, knewEn] = marks(q1.en, ['third parties', 'I assumed they knew, and they assumed I knew!']);
    const [tpZh, knewZh] = marks(q1.zh, ['第三方', '我以为他们知道，他们以为我知道！']);
    const tp = T('iu.b16', '第三方') - 0.2, knew = T('iu.b16', '以为') - 0.2;
    K.lit([tpEn, tpZh], tp, { color: BLUE });
    tl.to(tpEn, { color: INK, duration: 0.4 }, knew);
    tl.to(tpZh, { color: INK2, duration: 0.4 }, knew);
    K.lit([knewEn, knewZh], knew, { color: BLUE });
    tl.to(knewEn, { color: INK, duration: 0.4 }, k2);
    tl.to(knewZh, { color: INK2, duration: 0.4 }, k2);
    tl.to([m1, q1.root], { autoAlpha: 0.45, duration: 0.5 }, k2);
    K.show([m2, q2.root], k2 + 0.1, { y: 14, stagger: 0.1 });
    K.source(root, BOOK2, T('iu.b12') + 0.6, T('iu.b16', 'end') + 0.2,
      ['iu.plan-summary', 'iu.plan-plus-one', 'iu.plan-inward-outward', 'iu.plan-participant-guest', 'iu.plan-nonlinear-starts',
        'iu.plan-backward-why', 'iu.plan-alignment', 'iu.plan-prescribed', 'iu.2e-third-parties', 'iu.misalignment-sidebar']);

    // b17: the 1st-edition example: six weeks, four spent agreeing on whom to interview
    const b17 = T('iu.b17');
    K.hide([early, m1, m2, q1.root, q2.root], b17 - 0.4, { duration: 0.4 });
    const ex = K.box(root, 'iu-label', 200, 200, 1520, null, '第 1 版 · 原定六周的研究');
    K.show(ex, b17 + 0.1, { y: 8 });
    // the empty bar is laid down with "一个例子", its six weeks are counted out on "六周", and each week's
    // label darkens as the fill passes it
    const weeks = sixWeeks(root, 200, 330, 1520, 150, true);
    K.show(weeks.bar, T('iu.b17', '例子') - 0.2, { y: 14 });
    K.show(weeks.nums, T('iu.b17', '六周') - 0.35, { y: 8, stagger: 0.07 });
    const g0 = T('iu.b17', '定下') - 0.2, gd = 2.8;
    weeks.grow(g0, gd);
    // the fill eases power1.inOut over four of six cells: it passes week k at these shares of its run
    [0.354, 0.5, 0.646, 1].forEach((p, k) => tl.to(weeks.nums[k], { color: INK, duration: 0.3 }, g0 + gd * p - 0.2));
    const sh = Array.from({ length: 8 }, (_, i) => K.box(root, 'iu-stake', 200 + i * 166, 540, 150, 62, '相关方'));
    const s0 = T('iu.b17', '越来越多') - 0.2, s1 = T('iu.b17', '商量');
    sh.forEach((e, i) => K.show(e, s0 + (s1 - s0) * Math.pow(i / 7, 0.8), { y: 10, duration: 0.4 }));
    const verdict = K.box(root, 'iu-verdict', 200, 680, 1520, null, '<span>辛苦</span><em>，但研究得以推进</em>');
    const [vA, vB] = verdict.children;
    K.show(vA, T('iu.b17', '很累人') - 0.25, { y: 10 });
    K.show(vB, T('iu.b17', '往下走') - 0.3, { y: 10 });
    K.source(root, 'Steve Portigal, Interviewing Users, 1st ed., 2013, ch. 3', b17 + 0.4, T('iu.b17', 'end') + 0.3, ['iu.1e-four-weeks']);
  });

  /* A six-week bar with the first four weeks filling, used in b17 and again in b25.
     `numbers` adds the week labels above the cells. The white label is clipped to the fill,
     so it never sits on the unfilled cells: grow(at, dur) moves both together. */
  function sixWeeks(root, x, y, w, h, numbers) {
    const cw = w / 6;
    const nums = numbers ? Array.from({ length: 6 }, (_, i) => K.box(root, 'iu-wk-no', x + i * cw, y - 46, cw, null, `第 ${i + 1} 周`)) : [];
    const all = [...nums];
    const bar = K.box(root, 'iu-wk', x, y, w, h);
    for (let i = 1; i < 6; i++) K.box(bar, 'iu-wk-sep', i * cw - 1, 0, 2, h);
    const fill = K.box(bar, 'iu-wk-fill', 0, 0, cw * 4, h);
    const lab = K.box(bar, 'iu-wk-lab', 0, 0, cw * 4, h, '商定访谈的顾客类型');
    gsap.set(fill, { scaleX: 0, transformOrigin: '0 50%' });
    gsap.set(lab, { clipPath: 'inset(0% 100% 0% 0%)' });
    all.push(bar);
    const grow = (at, dur) => {
      const o = { duration: dur, ease: 'power1.inOut' };
      tl.to(fill, Object.assign({ scaleX: 1 }, o), at);
      tl.to(lab, Object.assign({ clipPath: 'inset(0% 0% 0% 0%)' }, o), at);
    };
    return { all, nums, bar, fill, lab, grow };
  }

  // ================================================================ 现场与复盘 (b18–b22)
  Film.scene('iu-field', T('iu.b18') - 0.3, T('iu.b23') + 0.2, ({ root, from }) => {
    open(root, '现场与复盘', from);
    // camera: close on the one-page guide, then across to what it says (b18); one frame per beat after that.
    // A quote that opens a beat alone is centred first; the camera makes room once, when the diagram under it comes
    const [c20, c21, c22] = ['iu.b20', 'iu.b21', 'iu.b22'].map(id => T(id) - 0.4);
    const across = T('iu.b18', '由他来问') - 1.2, cols = T('iu.b21', '听同伴讲') - 1.0, daily = T('iu.b22', '每天') - 1.2;
    shot(root, [200, 180, 620, 800], from, across);
    shot(root, [200, 140, 1720, 880], across, c20);
    shot(root, [200, 160, 1720, 940], c20, c21);
    shot(root, [200, 180, 1720, 440], c21, cols);
    shot(root, [200, 180, 1720, 860], cols, c22);
    shot(root, [200, 190, 1720, 400], c22, daily);
    shot(root, [200, 190, 1720, 890], daily);

    // b18: the one-page guide for clients joining fieldwork
    const page = K.box(root, 'iu-page', 200, 190, 420, 600,
      '<h4>A Guide to Participating in Fieldwork</h4><p class="t-num">2012</p>' + '<i></i>'.repeat(9));
    tag(page, 'iu.fg12-roles');
    K.show(page, from + 0.3, { y: 18 });
    // the caption under the page stays in view in both framings, so it does not pull the close-up wider
    const pre = K.box(root, 'iu-label', 200, 830, 420, null, '带客户去现场之前');
    pre.dataset.cam = 'ignore';
    K.show(pre, from + 0.4, { y: 8 });
    const roles = claimText('iu.fg12-roles').match(/\b(lead interviewer|second interviewer)\b/g);
    const R = 720, RW = 1000;
    const r1 = K.box(root, 'iu-label', R, 200, RW, null, '分工');
    const lead = tag(K.box(root, 'iu-role', R, 246, RW, null, `<i>${roles[0]}</i><span>主问：Portigal 一方</span>`), 'iu.fg12-roles');
    const second = tag(K.box(root, 'iu-role', R, 306, RW, null, `<i>${roles[1]}</i><span>副手：随行的客户</span>`), 'iu.fg12-roles');
    const r2 = K.box(root, 'iu-label', R, 420, RW, null, '提问');
    const hold = tag(K.box(root, 'iu-line', R, 462, RW, null, '先记下，择机再问'), 'iu.fg12-hold-questions');
    const r3 = K.box(root, 'iu-label', R, 580, RW, null, '专家');
    const qExp = K.quote(root, 'iu.fg12-experts', R, 626, RW, { size: 40 });
    K.show([r1, lead], T('iu.b18', '由他来问') - 0.3, { y: 10, stagger: 0.08 });
    K.show(second, T('iu.b18', '副手') - 0.35, { y: 10 });
    K.show([r2, hold], T('iu.b18', '想问') - 0.25, { y: 10, stagger: 0.08 });
    K.show([r3, qExp.root], T('iu.b18', '受访的人') - 0.3, { y: 12, stagger: 0.08 });

    // b19: the bus example, worse and better, from the same guide
    const b19 = T('iu.b19');
    K.hide([r1, lead, second, r2, hold, r3, qExp.root], b19 - 0.4, { duration: 0.4 });
    const qBus = K.quote(root, 'iu.fg12-bus', R, 210, RW, { size: 40 });
    // split from the ledger text itself: each question becomes the outermost quote on screen, so it keeps its double marks
    const busEn = claimText('iu.fg12-bus').match(/^(Less Good):\s*(“.+?”)\s*(Good):\s*(“.+?”)$/);
    const busZh = qBus.zh.textContent.match(/^(较差)：\s*(“.+?”)\s*(较好)：\s*(“.+?”)$/);
    qBus.en.textContent = '';
    qBus.zh.remove();
    const rowBus = (k, cls) => K.el(qBus.en, 'iu-bus ' + cls, `<b>${busEn[k]}</b><span>${busEn[k + 1]}</span><small>${busZh[k + 1]}</small>`);
    const worse = rowBus(1, 'worse'), better = rowBus(3, 'better');
    const busLab = K.box(root, 'iu-label', R, 150, RW, null, '例子 · 坐公交');
    K.show(busLab, b19 + 0.1, { y: 8 });
    K.show(worse, T('iu.b19', '与其') - 0.25, { y: 12 });
    K.show(better, T('iu.b19', '不如') - 0.25, { y: 12 });
    tl.to(worse, { opacity: 0.5, duration: 0.5 }, T('iu.b19', '不如') - 0.25);
    K.source(root, 'Portigal Consulting, A Guide to Participating in Fieldwork, 2012', T('iu.b18', '一页说明'), T('iu.b19', 'end') + 0.3,
      ['iu.fg12-roles', 'iu.fg12-hold-questions', 'iu.fg12-experts', 'iu.fg12-bus']);

    // b20: the two debrief worksheets, typeset from their own labels
    const b20 = T('iu.b20');
    K.hide([page, pre, busLab, qBus.root], b20 - 0.4, { duration: 0.4 });
    const SUFFIX = /^(.*?)\s*--\s*(describe|interpret|report|assess)\s+(.*)$/;
    const section = (sheet, id) => {
      const m = claimText(id).match(SUFFIX);
      const q = m[3].match(/^.*?[?.]|^.*$/)[0];
      const s = tag(K.el(sheet, 'iu-ws-sec'), id);
      K.el(s, 'iu-ws-h', `<span>${m[1]}</span><b data-k="${m[2]}">-- ${m[2]}</b>`);
      K.el(s, 'iu-ws-q', q);
      return s;
    };
    const ws1 = K.box(root, 'iu-ws', 200, 170, 740, 600, '<h4>Debriefing Worksheet 1 <span class="t-num">2012</span></h4>');
    ['iu.ws1-interpret', 'iu.ws1-describe', 'iu.ws1-report'].forEach(id => section(ws1, id));
    const ws2 = K.box(root, 'iu-ws', 980, 170, 740, 600, '<h4>Debriefing Worksheet 2 <span class="t-num">2012</span></h4>');
    const fill = tag(K.el(ws2, 'iu-ws-note', claimText('iu.ws2-immediately').match(/^.*?\./)[0]), 'iu.ws2-immediately');
    section(ws2, 'iu.ws2-getting-describe');
    const life = tag(K.el(ws2, 'iu-ws-sec life'), 'iu.ws2-surprise');
    K.el(life, 'iu-ws-h', `<span>${Film.claim('iu.ws2-surprise').statement_zh.match(/([A-Z][A-Z ]+[A-Z]) 栏/)[1]}</span>`);
    K.el(life, 'iu-ws-dots');
    const lifeQ = K.el(life, 'iu-ws-q', claimText('iu.ws2-surprise'));
    section(ws2, 'iu.ws2-assess');
    K.show([ws1, ws2], b20 + 0.0, { y: 18, stagger: 0.15 });
    // the instruction at the head of sheet 2, while the narration paraphrases it
    const [fillLit] = litPhrase([[fill, 'immediately after the interview, together with both interviewers']], T('iu.b20', '访谈一结束') - 0.3);
    tl.to(fillLit, { color: INK2, duration: 0.5 }, T('iu.b20', '多数栏目') - 0.4);
    // the word after most headings; a legend gives the Chinese
    const WORDS = [['describe', '描述'], ['interpret', '解读'], ['report', '报告'], ['assess', '评估']];
    const leg = WORDS.map(([k, zh], i) => K.box(root, 'iu-wsk', 200 + i * 390, 812, 360, 70, `<b>${k}</b><span>${zh}</span>`));
    K.show(leg, T('iu.b20', '多数栏目') - 0.2, { y: 10, stagger: 0.06 });
    WORDS.forEach(([k, zh], i) => {
      const at = T('iu.b20', zh) - 0.2;
      const hits = [...root.querySelectorAll(`.iu-ws-h b[data-k="${k}"]`), leg[i]];
      tl.to(hits, { color: BLUE, borderColor: BLUE, duration: 0.25 }, at);
      tl.to(hits, { color: INK, borderColor: RULE, duration: 0.4 }, at + 0.75);
    });
    // one heading has no such word; its last line pairs two questions
    const sur = T('iu.b20', '有一栏') - 0.2;
    tl.to(life, { borderLeftColor: BLUE, duration: 0.3 }, sur);
    litPhrase([[lifeQ, lifeQ.textContent]], T('iu.b20', '两个问题') - 0.3);
    K.hide(leg, T('iu.b20', '两个问题') - 0.5, { duration: 0.35 });
    const qSur = K.quote(root, 'iu.ws2-surprise', 200, 806, 1520, { size: 44 });
    K.show(qSur.root, T('iu.b20', '两个问题') - 0.1, { y: 12 });
    K.source(root, 'Portigal Consulting, Debriefing Worksheet 1 & 2, 2012', b20 + 0.3, T('iu.b20', 'end') + 0.3,
      ['iu.ws1-interpret', 'iu.ws1-describe', 'iu.ws1-report', 'iu.ws2-immediately', 'iu.ws2-getting-describe', 'iu.ws2-surprise', 'iu.ws2-assess']);

    // b21: what the debrief shows him, and the gap it reveals
    const b21 = T('iu.b21');
    K.hide([ws1, ws2, qSur.root], b21 - 0.4, { duration: 0.4 });
    const qFrame = K.quote(root, 'iu.gb-debrief-frame', 200, 190, 1520, { size: 38 });
    K.show(qFrame.root, b21 + 0.05, { y: 14 });
    litPhrase([[qFrame.en, 'how they’re framing the world'], [qFrame.zh, '他们是怎样框定这个世界的']], T('iu.b21', '眼光') - 0.4);
    const colA = K.box(root, 'iu-col', 200, 520, 560, 330, '<p>同伴的收获</p>');
    const colB = K.box(root, 'iu-col', 1160, 520, 560, 330, '<p>Portigal 的收获</p>');
    const barsA = [0, 1, 2, 3].map(i => K.box(colA, 'iu-pt' + (i === 2 ? ' gap' : ''), 0, 64 + i * 66, [520, 440, 480, 380][i], 46));
    const barsB = [0, 1, 2, 3].map(i => K.box(colB, 'iu-pt', 0, 64 + i * 66, [520, 440, 480, 380][i], 46));
    K.show(colA, T('iu.b21', '听同伴讲') - 0.25, { y: 12 });
    gsap.set(barsA, { autoAlpha: 0 });
    K.show(barsA.filter((_, i) => i !== 2), T('iu.b21', '听到了') - 0.2, { y: 0, x: -20, stagger: 0.1, duration: 0.5 });
    K.show(colB, T('iu.b21', '同伴的理解') - 0.3, { y: 12 });
    const gapAt = T('iu.b21', '漏掉') - 0.2;
    K.show(barsA[2], gapAt, { y: 0, duration: 0.4 });
    const gapLab = K.box(root, 'iu-gaplab', 200 + 480 + 24, 520 + 64 + 2 * 66 + 2, 300, null, '缺口');
    K.show(gapLab, gapAt + 0.2, { y: 6 });
    const sv = K.svg(root, 'iu-gap-lines');
    const fixA = arrow(sv, 1150, 520 + 64 + 2 * 66 + 23, 820, 'ln blue');
    const fixLab = K.box(root, 'iu-fix', 820, 520 + 64 + 66 + 4, 330, null, '汇报时强调');
    const fixAt = T('iu.b21', '汇报') - 0.3, filled = T('iu.b21', '补') - 0.15;
    drawStrokes(fixA, fixAt, 0.55);
    K.show(fixLab, fixAt + 0.2, { y: 6 });
    // the gap keeps its name until it is filled
    K.hide(gapLab, filled, { duration: 0.3 });
    tl.to(barsA[2], { backgroundColor: BLUE, borderColor: BLUE, duration: 0.4 }, filled);
    tl.to(barsB[2], { backgroundColor: BLUE, duration: 0.4 }, fixAt);
    K.source(root, 'Steve Portigal, Greenbook Podcast, 2024', b21 + 0.4, T('iu.b21', 'end') + 0.3, ['iu.gb-debrief-frame', 'iu.gb-debrief-gap']);

    // b22: what he usually does instead
    const b22 = T('iu.b22');
    K.hide([qFrame.root, colA, colB, ...fixA, fixLab], b22 - 0.4, { duration: 0.4 });
    const qSkip = K.quote(root, 'iu.ama-worksheet-optional', 200, 200, 1520, { size: 44 });
    K.show(qSkip.root, b22 + 0.05, { y: 14 });
    litPhrase([[qSkip.en, 'but typically not.'], [qSkip.zh, '但通常不填']], T('iu.b22', '并不填') - 0.2);
    const dayLab = K.box(root, 'iu-label', 200, 450, 1520, null, '每日速记');
    const days = [0, 1, 2, 3].map(i => K.box(root, 'iu-day', 200 + i * 390, 500, 350, 160,
      `<b>第 ${i + 1} 天</b><i style="width:88%"></i><i style="width:${[64, 72, 58, 70][i]}%"></i>`));
    K.show(dayLab, T('iu.b22', '每天') - 0.35, { y: 8 });
    K.show(days, T('iu.b22', '每天') - 0.2, { y: 14, stagger: 0.1 });
    const pile = K.box(root, 'iu-pile', 200, 720, 520, 170);
    const bits = Array.from({ length: 15 }, (_, i) => K.box(pile, 'iu-bit', (i % 5) * 104, Math.floor(i / 5) * 56, [90, 70, 84, 60, 92][(i * 3) % 5], 38));
    const sv2 = K.svg(root, 'iu-pile-lines');
    const pull = arrow(sv2, 750, 805, 900);
    const keep = [0, 1, 2].map(i => K.box(root, 'iu-keep', 930 + i * 130, 778, 110, 54));
    const forced = K.box(root, 'iu-forced', 1320, 744, 400, null, '<i>forced analysis</i><span>大块里拎出小块</span>');
    K.show(bits, T('iu.b22', '一大堆') - 0.3, { y: 0, duration: 0.3, stagger: 0.03 });
    drawStrokes(pull, T('iu.b22', '拎出') - 0.3, 0.35);
    K.show(keep, T('iu.b22', '拎出') - 0.05, { y: 0, x: -30, stagger: 0.08, duration: 0.5 });
    K.show(forced, T('iu.b22', '拎出') + 0.1, { y: 8 });
    K.source(root, 'Steve Portigal, What Users Do AMA, 2017', b22 + 0.4, T('iu.b22', 'end') + 0.3, ['iu.ama-worksheet-optional', 'iu.ama-forced-analysis']);
  });

  // ================================================================ 访谈的边界 (b23–b24)
  Film.scene('iu-limits', T('iu.b23') - 0.3, T('iu.b25') + 0.2, ({ root, from }) => {
    open(root, '访谈的边界', from);
    shot(root, [288, 200, 1740, 930], from, T('iu.b24') - 0.4);
    shot(root, [200, 190, 1720, 720], T('iu.b24') - 0.4);

    // b23: depth, not sample size
    const sv = K.svg(root, 'iu-lim-lines');
    const axes = strokes(sv, 'M300,240 L300,860 L1640,860 M288,256 L300,240 L312,256 M1624,848 L1640,860 L1624,872');
    const yLab = K.box(root, 'iu-axis', 330, 216, 300, null, '深度');
    const xLab = K.box(root, 'iu-axis', 1440, 880, 300, null, '样本量');
    drawStrokes(axes, from + 0.3, 0.9);
    K.show([yLab, xLab], from + 0.6, { y: 6 });
    const deep = K.box(root, 'iu-deep', 330, 300, 150, 560);
    const deepLab = K.box(root, 'iu-deep-lab', 510, 300, 400, null, '访谈');
    gsap.set(deep, { scaleY: 0, transformOrigin: '50% 100%' });
    tl.to(deep, { scaleY: 1, duration: 0.9, ease: 'expo.out' }, T('iu.b23', '深度') - 0.3);
    K.show(deepLab, T('iu.b23', '深度') - 0.1, { y: 10 });
    const wide = K.box(root, 'iu-wide', 860, 770, 760, 90);
    const wideLab = K.box(root, 'iu-wide-lab', 860, 640, 860, null, '<b>统计上可靠的结论</b><span>不宜用访谈</span>');
    const [wA, wB] = wideLab.children;
    gsap.set(wide, { scaleX: 0, transformOrigin: '0 50%' });
    tl.to(wide, { scaleX: 1, duration: 0.9, ease: 'expo.out' }, T('iu.b23', '统计') - 0.3);
    gsap.set(wB, { autoAlpha: 0 });
    K.show(wideLab, T('iu.b23', '统计') - 0.1, { y: 10 });
    K.show(wB, T('iu.b23', '别用') - 0.3, { y: 8 });
    K.source(root, BOOK2, from + 0.8, T('iu.b23', 'end') + 0.3, ['iu.limit-depth']);

    // b24: what a price question can and cannot give
    const b24 = T('iu.b24');
    K.hide([...axes, yLab, xLab, deep, deepLab, wide, wideLab], b24 - 0.4, { duration: 0.4 });
    const fut = K.box(root, 'iu-head', 200, 200, 1520, null, '人难以预测自己日后的行为');
    K.show(fut, b24 + 0.05, { y: 12 });
    const ask = K.box(root, 'iu-askcard', 200, 470, 620, 170, '“这个你愿意付多少钱”');
    K.show(ask, T('iu.b24', '问人家') - 0.25, { y: 14 });
    const sv2 = K.svg(root, 'iu-lim-lines2');
    const toNum = strokes(sv2, 'M830,520 C900,520 900,430 990,430 M976,420 L990,430 L976,440', 'ln soft');
    const toWhy = strokes(sv2, 'M830,590 C900,590 900,680 990,680 M976,670 L990,680 L976,690', 'ln blue');
    const num = K.box(root, 'iu-out no', 1010, 396, 700, null, '定价可用的数字');
    const why = K.box(root, 'iu-out yes', 1010, 644, 700, null, '出价背后的理由');
    drawStrokes(toNum, T('iu.b24', '得不到') - 0.35, 0.35);
    K.show(num, T('iu.b24', '得不到') - 0.1, { y: 8 });
    drawStrokes(toWhy, T('iu.b24', '听出') - 0.4, 0.35);
    K.show(why, T('iu.b24', '听出') - 0.15, { y: 8 });
    K.source(root, BOOK2, b24 + 0.4, T('iu.b24', 'end') + 0.3, ['iu.limit-future', 'iu.limit-pricing']);
  });

  // ================================================================ 回到驻场 (b25–b27)
  // the body's last scene holds under whatever comes next (the outro, or the next card in the compilation)
  Film.scene('iu-back', T('iu.b25') - 0.3, u.bodyEnd + Series.HOLD, ({ root, from, to }) => {
    open(root, '回到驻场', from);
    // camera: the four books; the comparison, with a close look at the pilot bar while it fills (b25);
    // one frame each for the table of contents (b26) and the reading (b27)
    const cmp = T('iu.b25', '对照') - 0.3;
    const [c26, c27] = ['iu.b26', 'iu.b27'].map(id => T(id) - 0.4);
    shot(root, [200, 250, 1720, 530], from, cmp - 0.5);
    shot(root, [200, 170, 1720, 910], cmp - 0.5, c26);
    shot(root, [200, 180, 1720, 870], c26, c27);
    shot(root, [200, 186, 1720, 770], c27);

    // b25: the list as Qureshi gives it, with no reason for this book
    const BOOKS = ['Impro', 'The Looming Tower', 'Interviewing Users', 'Getting Things Done'];
    const books = BOOKS.map((t, i) => K.box(root, 'iu-bk' + (i === 2 ? ' on' : ''), 200 + i * 390, 260, 350, 180, t));
    K.show(books, from + 0.3, { y: 14, stagger: 0.07 });
    const why = K.box(root, 'iu-cap', 980, 466, 520, null, '理由 · 文中未写');
    K.show(why, T('iu.b25', '没说过') - 0.25, { y: 8 });
    K.source(root, 'Nabeel Qureshi, Reflections on Palantir, 2024', from + 0.6, T('iu.b25', '对照') - 0.4, ['iu.qu-list', 'iu.qu-no-reason']);

    // the comparison is this series' reading: dashed ties, solid facts
    K.hide([...books, why], cmp - 0.1, { duration: 0.4 });
    const leg = legend(root, 200, 176, '并置对照');
    K.show(leg, cmp + 0.2, { y: 6 });
    const hA = K.box(root, 'iu-colh', 200, 240, 700, null, '驻场 · Qureshi 的回顾');
    const hB = K.box(root, 'iu-colh', 1020, 240, 700, null, 'Interviewing Users');
    K.show([hA, hB], cmp + 0.3, { y: 10, stagger: 0.1 });
    const sv = K.svg(root, 'iu-back-lines');
    // Airbus started from the CEO's problem; the book puts the business problem first in a plan,
    // without saying a project starts there (b14), so only the Airbus card says 起点
    const sA = K.box(root, 'iu-from', 200, 330, 700, 200, '<b>起点 · 业务问题</b><span>Airbus · CEO 的头号难题<br>A350 产量爬坡</span>');
    const sB = K.box(root, 'iu-from', 1020, 330, 700, 200, '<b>业务问题</b><span>研究计划的第一项</span>');
    const tie1 = K.path(sv, 'M908,430 L1012,430', 'ln dash soft');
    K.show(sA, T('iu.b25', '那个项目') - 0.5, { y: 12 });
    K.show(sB, T('iu.b25', '业务问题') - 0.25, { y: 12 });
    K.draw(tie1, T('iu.b25', '开始') - 0.1, { duration: 0.4 });
    // a separate item from the same essay, not the Airbus project: some pilots went entirely on data access
    const pLab = K.box(root, 'iu-cap', 200, 580, 700, null, '试点 · 8 到 12 周');
    const pBar = K.box(root, 'iu-pilot', 200, 640, 700, 100);
    const pFill = K.box(pBar, 'iu-pilot-fill', 0, 0, 600, 100);
    const pTxt = K.box(pBar, 'iu-pilot-lab', 0, 0, 600, 100, '获取数据权限');
    K.box(pBar, 'iu-pilot-demo', 600, 0, 100, 100, '<span>演示</span>');
    gsap.set(pFill, { scaleX: 0, transformOrigin: '0 50%' });
    K.show([pLab, pBar], T('iu.b25', '有的客户') - 0.25, { y: 12, stagger: 0.08 });
    tl.to(pFill, { scaleX: 1, duration: 1.6, ease: 'power1.inOut' }, T('iu.b25', '耗在') - 0.3);
    K.show(pTxt, T('iu.b25', '拿数据权限') - 0.1, { y: 6 });
    // once the pilot is on the page, the camera closes on the Qureshi column while the pilot is used up, and
    // steps back as the book's six weeks come in beside it. What the close-up would cut (the legend, the column
    // heads, the book's card and its tie) gives way first and is back for the comparison
    const pIn = T('iu.b25', '试点') - 0.5, pOut = T('iu.b25', '书里') - 0.7;
    const spot = K.box(root, 'iu-spot', 200, 330, 700, 410);
    spot.dataset.cam = 'ignore';
    K.focus(spot, pIn, pOut, { zoom: 1.45, pad: 70 });
    const aside = [leg, hA, hB, sB, tie1];
    tl.to(aside, { autoAlpha: 0, duration: 0.4 }, pIn - 1.1);
    tl.to(aside, { autoAlpha: 1, duration: 0.6 }, pOut + 0.1);
    const sLab = K.box(root, 'iu-cap', 1020, 580, 700, null, '书里的六周研究');
    const study = sixWeeks(root, 1020, 640, 700, 100, false);
    K.show([sLab, ...study.all], T('iu.b25', '书里') - 0.25, { y: 12, stagger: 0.08 });
    study.grow(T('iu.b25', '四周') - 0.3, 1.4);
    const tie2 = K.path(sv, 'M908,690 L1012,690', 'ln dash soft');
    K.draw(tie2, T('iu.b25', '来回商量') - 0.1, { duration: 0.4 });
    const near = K.box(root, 'iu-near', 640, 810, 640, 96, '相近的处境');
    const tie3 = K.path(sv, 'M960,690 L960,806', 'ln dash soft');
    K.draw(tie3, T('iu.b25', '我看') - 0.2, { duration: 0.4 });
    K.show(near, T('iu.b25', '相近') - 0.35, { y: 10 });
    K.source(root, 'Nabeel Qureshi, Reflections on Palantir, 2024 · Steve Portigal, Interviewing Users, 1st ed., 2013 & 2nd ed., 2023', cmp + 0.5, T('iu.b25', 'end') + 0.3,
      ['ov.airbus_toulouse_a350', 'ov.data_pilot_weeks', 'iu.plan-summary', 'iu.1e-four-weeks']);

    // b26: three 1st-edition section headings, then Qureshi on the customer's language
    const b26 = T('iu.b26');
    K.hide([leg, hA, hB, sA, sB, pLab, pBar, sLab, ...study.all, near, ...sv.querySelectorAll('path')], b26 - 0.4, { duration: 0.4 });
    const tocHead = K.box(root, 'iu-label', 200, 190, 1520, null, '第 1 版目录 · 小节标题');
    K.show(tocHead, b26 + 0.05, { y: 8 });
    const heads = Film.claim('iu.1e-toc-worldview').statement_zh.match(/[A-Z][A-Za-z’' ]*[a-z]/g).map(K.curly);
    if (claimText('iu.1e-toc-worldview') !== heads[0]) throw new Error('iu.1e-toc-worldview: headings and quote differ');
    const TOC = [[2, '把你的世界观留在门外', '把你的'], [6, '用他们的语言', '用他们的'], [6, '先假定对方说得通', '先假定']];
    // the three headings as the narration announces them, each Chinese rendering as it is read
    const toc = TOC.map(([ch, zh, w], i) => {
      const row = tag(K.box(root, 'iu-toc', 200, 250 + i * 128, 1520, 118, `<b class="t-num">第 ${ch} 章</b><span>${heads[i]}</span><small>${zh}</small>`), 'iu.1e-toc-worldview');
      K.show(row, T('iu.b26', '小节标题') - 0.3 + i * 0.12, { y: 12 });
      K.show(row.lastChild, T('iu.b26', w) - 0.3, { y: 6 });
      return row;
    });
    // one attribution at a time: the quote carries no locator, the source line grows to name Qureshi
    const src26 = K.source(root, 'Steve Portigal, Interviewing Users, 1st ed., 2013, 目录<span> · Nabeel Qureshi, Reflections on Palantir, 2024</span>',
      b26 + 0.4, T('iu.b26', 'end') + 0.2, ['iu.1e-toc-worldview', 'ov.qureshi-language']);
    const qu26 = src26.querySelector('span');
    gsap.set(qu26, { autoAlpha: 0 });
    const qLang = K.quote(root, 'ov.qureshi-language', 200, 660, 1520, { size: 37 });
    K.show(qLang.root, T('iu.b26', '也写过') - 0.5, { y: 14 });
    tl.to(qu26, { autoAlpha: 1, duration: 0.5 }, T('iu.b26', '也写过') - 0.5);
    // Qureshi's phrase is lit as it is read, and the 1st-edition heading it answers is lit with it
    const [, tocEn, tocZh] = toc[1].children;
    litPhrase([[qLang.en, 'learn to speak the customer’s language'], [qLang.zh, '学会说客户的语言'], [tocEn, heads[1]], [tocZh, TOC[1][1]]],
      T('iu.b26', '学会说') - 0.3);

    // b27: this series' reading — the first steps after the door
    const b27 = T('iu.b27');
    K.hide([tocHead, ...toc, qLang.root], b27 - 0.4, { duration: 0.4 });
    const leg2 = legend(root, 200, 196);
    K.show(leg2, b27 + 0.05, { y: 6 });
    const title = K.box(root, 'iu-head', 200, 250, 1520, null, 'FDE（驻客户现场的工程师）进门之后的头几步');
    K.show(title, T('iu.b27', '这本书') - 0.3, { y: 12 });
    // three empty steps on "头几步", each filled as the narration names it
    const STEPS = [['问清要做的决定', '先问清', 'plan'], ['观察实际做法', '再去看', 'hat'], ['对照各自所见', '回来', 'sheets']];
    const sv3 = K.svg(root, 'iu-steps');
    const steps = T('iu.b27', '头几步') - 0.35;
    STEPS.forEach(([t, w, icon], i) => {
      const x = 200 + i * 520;
      const box = K.box(root, 'iu-stepr', x, 400, 460, 360);
      const ic = K.svg(box, 'iu-icon', 460, 220);
      drawIcon(ic, icon);
      const lab = K.el(box, 'iu-stepr-lab', t);
      K.show(box, steps + i * 0.1, { y: 14 });
      const at = T('iu.b27', w) - 0.3;
      K.show([ic, lab], at, { y: 10, stagger: 0.08 });
      if (i) {
        const a = [K.path(sv3, `M${x - 54},580 L${x - 10},580`, 'ln dash soft'), K.path(sv3, `M${x - 22},570 L${x - 10},580 L${x - 22},590`, 'ln soft')];
        drawStrokes(a, at - 0.25, 0.3);
      }
    });
  });

  /* Small line icons for the last scene: the plan's three cards, a hard hat, two worksheets. */
  function drawIcon(s, kind) {
    if (kind === 'plan') {
      for (let i = 0; i < 3; i++) K.sv(s, 'rect', { x: 110 + i * 86, y: 70, width: 70, height: 96, rx: 4, class: 'ln' + (i === 0 ? ' blue' : '') });
    } else if (kind === 'hat') {
      K.path(s, 'M150,150 C150,84 196,52 230,52 C264,52 310,84 310,150', 'ln');
      K.path(s, 'M124,152 L336,152 Q342,166 330,168 L130,168 Q118,166 124,152 Z', 'ln');
      K.path(s, 'M230,54 L230,150 M196,64 C186,90 182,120 182,150 M264,64 C274,90 278,120 278,150', 'ln soft');
    } else {
      for (let i = 0; i < 2; i++) {
        const x = 140 + i * 100;
        K.sv(s, 'rect', { x, y: 50, width: 80, height: 120, rx: 4, class: 'ln' });
        K.path(s, `M${x + 14},80 L${x + 66},80 M${x + 14},104 L${x + 58},104 M${x + 14},128 L${x + 62},128`, 'ln soft');
      }
    }
  }

  // ================================================================ 收尾（单集）
  // the outro's paper comes up while the last body scene fades, so the cut never shows a bare frame
  Series.outro('iu');
});
