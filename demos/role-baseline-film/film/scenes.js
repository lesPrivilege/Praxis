/* Four scenes on the narration's own clock, plus a caption strip.
   01 方案  two numbers on one scale
   02 范围  what 23K was priced for, what the role covers, and when the rest arrives
   03 成本  the tool cost, and who carries it
   04 测算 → 05 诉求  two columns against the 20K line; the 29K column stays and the conditions line up beside it
   Every time comes from T(segment, word); nothing is a fixed second. */
(function () {
  const { T } = Film, tl = K.tl;
  const DUR = Film.duration;

  function base(root) {
    root.classList.add('paper');
    const world = K.el(root, 'fill');
    K.el(root, 'grain'); K.el(root, 'vignette');
    return world;
  }
  const title = (parent, text, x, y) => {
    const t = K.lines(parent, 'fig-title', [text]);
    t.style.cssText += `position:absolute;left:${x}px;top:${y}px;`;
    return t;
  };
  /* b replaces a in place */
  function swap(a, b, at) {
    K.hide(a, at - 0.12, { duration: 0.14 });
    K.show(b, at, { y: 0, duration: 0.22 });
  }

  const S2 = T('n2') - 0.35, S3 = T('n5') - 0.35, S4 = T('n7') - 0.35;

  // ------------------------------------------------------------------ 01 方案
  Film.scene('plan', 0, S2, ({ root }) => {
    const world = base(root);
    K.chrome(root, { chapter: ['01', '方案'] });
    const black = K.el(root, 'fill', null, { background: '#05080d', zIndex: 80 });
    tl.to(black, { autoAlpha: 0, duration: 1.0, ease: 'power2.inOut' }, 0.1);

    const X0 = 260, PX = 1400 / 30, BY = 742, BH = 36;           // 0 … 30K across 1400 px
    const x = k => X0 + k * PX;

    const L = K.box(world, '', X0, 236);
    const lLab = K.el(L, 'pl-label', '核定方案');
    const lNum = K.el(L, 'pl-num', '<b>23K</b><span>× 15 薪</span>');
    const R = K.box(world, '', 1000, 236);
    const rLab = K.el(R, 'pl-label blue', '期望基线');
    const rNum = K.el(R, 'pl-num blue', '<b>29K</b><i>左右</i><span>× 15 薪</span>');

    K.show(lLab, T('n1', '核定') - 0.1, { y: 0, duration: 0.5 });
    K.show(lNum.children[0], T('n1', '两万三') - 0.15, { y: 36, duration: 0.8, ease: 'expo.out' });
    K.show(lNum.children[1], T('n1', '十五薪') - 0.1, { y: 0, x: -16, duration: 0.5 });
    K.show(rLab, T('n1', '期望') - 0.1, { y: 0, duration: 0.5 });
    K.show(rNum.children[0], T('n1', '两万九') - 0.15, { y: 36, duration: 0.8, ease: 'expo.out' });
    K.show(rNum.children[1], T('n1', '左右') - 0.05, { y: 0, duration: 0.35 });
    K.show(rNum.children[2], T('n1', '十五薪', 1) - 0.1, { y: 0, x: -16, duration: 0.5 });

    // the scale both numbers sit on
    const scale = K.el(world, 'fill');
    K.box(scale, 'base', X0, BY + BH + 10, 1400, 2);
    for (const k of [0, 10, 20, 30]) {
      K.box(scale, 'tick', x(k) - 1, BY + BH + 10, 2, 14);
      const lab = K.box(scale, 'ax', x(k) - 60, BY + BH + 30, 120, null, k ? k + 'K' : '0');
      lab.style.textAlign = 'center';
    }
    K.box(scale, 'note', X0, BY - 52, null, null, '税前固定月薪');
    K.show(scale, T('n1', '税前') - 0.2, { y: 0, duration: 0.6 });

    const bar = K.box(world, 'pl-bar', X0, BY, 23 * PX, BH);
    gsap.set(bar, { scaleX: 0 });
    tl.to(bar, { scaleX: 1, duration: 1.0, ease: 'power3.out' }, T('n1', '两万三') - 0.2);
    const m23 = K.box(world, 'pl-mark', x(23) - 70, BY - 54, 70, null, '23K');
    m23.style.textAlign = 'right';
    K.show(m23, T('n1', '两万三') + 0.5, { y: 8, duration: 0.4 });

    const ext = K.box(world, 'pl-ext', x(23), BY, 0, BH);
    gsap.set(ext, { autoAlpha: 0 });
    const tExt = T('n1', '两万九') - 0.2;
    tl.to(ext, { autoAlpha: 1, duration: 0.01 }, tExt);
    tl.to(ext, { width: 6 * PX, duration: 0.9, ease: 'power3.out' }, tExt);
    const m6 = K.box(world, 'pl-mark blue', x(26) - 60, BY - 54, 120, null, '+6K');
    m6.style.textAlign = 'center';
    const m29 = K.box(world, 'pl-mark blue', x(29) - 6, BY - 54, 90, null, '29K');
    K.show([m29, m6], tExt + 0.6, { y: 8, duration: 0.4, stagger: 0.15 });

    K.hide(world, S2 - 0.4, { duration: 0.35 });
  });

  // ------------------------------------------------------------------ 02 范围
  Film.scene('scope', S2 - 0.05, S3, ({ root }) => {
    const world = base(root);
    K.chrome(root, { chapter: ['02', '范围'] });
    const g = K.svg(world);

    const W = 172, TY = 410, TH = 126, X0 = 120;
    const tx = i => X0 + i * 188.5;
    const names = ['需求分析', '方案设计', '项目协同', '模型评估', 'Agent<br>工作流', '技术验证', '原型构建', '现场实施', '端到端交付'];
    const tiles = names.map((n, i) => K.box(world, 'sc-tile', tx(i), TY, W, TH, n));
    const pmR = tx(2) + W, allR = tx(8) + W;                      // 669, 1800

    // 23K was priced for the first three
    const b1 = K.path(g, `M${X0},384 L${X0},362 L${pmR},362 L${pmR},384`, 'ln');
    b1.style.strokeWidth = 3;
    const l1 = K.box(world, 'sc-lab', X0, 310, null, null, '<b>23K 的定价范围</b> · 传统产品经理');
    K.draw(b1, T('n2') + 0.15, { duration: 0.9 });
    K.show(l1, T('n2') + 0.3, { y: 0, x: -14, duration: 0.5 });
    K.show(tiles[0], T('n2', '需求分析') - 0.1, { y: 18, duration: 0.5 });
    K.show(tiles[1], T('n2', '方案设计') - 0.1, { y: 18, duration: 0.5 });
    K.show(tiles[2], T('n2', '项目协同') - 0.1, { y: 18, duration: 0.5 });

    // the role reaches further, one piece of work at a time
    const b2 = K.box(world, 'sc-brk', X0, 282, pmR - X0, 22);
    const l2 = K.box(world, 'sc-lab', X0, 230, null, null, '<b>岗位范围</b> · 企业 AI 应用方向');
    K.show([b2, l2], T('n3') + 0.1, { y: 0, duration: 0.5, stagger: 0.1 });
    const cue = ['评估', '设计', '验证', '原型', '现场', '交付'];
    cue.forEach((w, k) => {
      const at = T('n3', w) - 0.12, i = k + 3;
      K.show(tiles[i], at, { y: 18, duration: 0.45 });
      tl.to(b2, { width: tx(i) + W - X0, duration: 0.34, ease: 'power2.out' }, at);
    });
    const ttl = title(world, '定价范围小于岗位范围', X0 - 4, 108);
    K.rise(ttl.inners, T('n3', '评估') + 0.2, { duration: 0.9 });

    // when the rest arrives: order only
    const RY = 800, cPM = (X0 + pmR) / 2, cEx = (tx(3) + allR) / 2, xUp = 1680;
    const uPM = K.path(g, `M${X0},552 L${X0},572 L${pmR},572 L${pmR},552`, 'ln soft');
    const uEx = K.path(g, `M${tx(3)},552 L${tx(3)},572 L${allR},572 L${allR},552`, 'ln soft');
    const sPM = K.path(g, `M${cPM},572 L${cPM},${RY - 12}`, 'ln soft');
    const sEx = K.path(g, `M${cEx},572 L${cEx},${RY - 12}`, 'ln');
    const rail = K.path(g, `M${cPM},${RY} L${cEx},${RY}`, 'ln');
    const railD = K.path(g, `M${cEx},${RY} L${xUp},${RY}`, 'ln dash');
    const dIn = K.sv(g, 'circle', { cx: cPM, cy: RY, r: 9, class: 'dot' });
    const dP1 = K.sv(g, 'circle', { cx: cEx, cy: RY, r: 10, class: 'dot' });
    const dUp = K.sv(g, 'circle', { cx: xUp, cy: RY, r: 10, class: 'dot hollow' });
    const pos = (cx, html) => { const e = K.box(world, 'sc-pos', cx - 160, RY + 24, 320, null, html); return e; };
    const pIn = pos(cPM, '入职'), pP1 = pos(cEx, '第一个项目'), pUp = pos(xUp, '晋升 <span>· 时间未定</span>');
    const note = K.box(world, 'note', X0, 892, null, null, '自左向右是先后次序，间距不表示时长');

    const a4 = T('n4');
    K.draw([uPM, uEx], a4 + 0.05, { duration: 0.6, stagger: 0.1 });
    K.draw(sPM, a4 + 0.45, { duration: 0.5 });
    K.show([dIn, pIn], a4 + 0.85, { y: 0, duration: 0.35 });
    K.draw(rail, a4 + 0.9, { duration: 0.8 });
    const tUp = T('n4', '晋升') - 0.25;
    K.show([railD, dUp, pUp], tUp, { y: 0, duration: 0.5, stagger: 0.08 });
    K.show(note, tUp + 0.3, { y: 0, duration: 0.5 });
    const tP1 = T('n4', '第一个') - 0.15;
    K.draw(sEx, tP1, { duration: 0.55 });
    K.show([dP1, pP1], tP1 + 0.45, { y: 0, duration: 0.35 });
    // the current rules have nothing on the project side to pay for this stretch
    const inc = K.box(world, 'slot', cEx + 26, 652, 340, 68, '项目激励<span>未建立</span>');
    K.show(inc, T('n4', '属于') - 0.1, { y: 0, x: -14, duration: 0.45 });

    // "定起薪的时候就要算进去": the priced range is asked to reach the whole role
    const e1 = K.box(world, 'sc-ext', pmR, 360.5, 0, 24);
    gsap.set(e1, { autoAlpha: 0 });
    const tE = T('n4', '起薪') - 0.25;
    tl.to(e1, { autoAlpha: 1, duration: 0.01 }, tE);
    tl.to(e1, { width: allR - pmR + 1.5, duration: 1.1, ease: 'power3.inOut' }, tE);
    const l3 = K.box(world, 'sc-lab blue', allR - 520, 310, 520, null, '<b>期望基线的定价范围</b> · 待审批');
    l3.style.textAlign = 'right';
    K.show(l3, tE + 0.7, { y: 0, x: 14, duration: 0.5 });

    K.hide(world, S3 - 0.4, { duration: 0.35 });
  });

  // ------------------------------------------------------------------ 03 成本
  Film.scene('cost', S3 - 0.05, S4, ({ root }) => {
    const world = base(root);
    K.chrome(root, { chapter: ['03', '成本'] });
    const X0 = 160, PX = 2, BY = 330, BH = 104;                   // 0 … 500 美元 across 1000 px
    const x = u => X0 + u * PX;

    const ttl = title(world, '工具费每月 400–500 美元', X0 - 4, 108);
    K.rise(ttl.inners, T('n5', '工具费') - 0.3, { duration: 0.9 });

    const band = K.box(world, 'co-band', x(400), BY - 14, 100 * PX, BH + 28);
    K.show(band, T('n5', '四五百') - 0.3, { y: 0, duration: 0.6 });
    const axis = K.el(world, 'fill');
    K.box(axis, 'base', X0, BY + BH + 14, 500 * PX, 2);
    for (const u of [0, 100, 200, 300, 400, 500]) K.box(axis, 'tick', x(u) - 1, BY + BH + 14, 2, 12);
    for (const u of [0, 400, 500]) {
      const lab = K.box(axis, 'ax', x(u) - 80, BY + BH + 32, 160, null, u === 500 ? '500 美元' : String(u));
      lab.style.textAlign = 'center';
    }
    K.show(axis, T('n5') + 0.1, { y: 0, duration: 0.5 });

    const parts = [                                              // from, to, label, label x, label y, cue
      [0, 300, '模型订阅', x(0), BY - 50, T('n5', '订阅') - 0.2],
      [300, 390, 'API 用量', x(300), BY - 50, T('n5', '服务') - 0.15],
      [390, 450, '开发工具', x(390), BY - 98, T('n5', '开发工具') - 0.15],
    ];
    const g = K.svg(world);
    for (const [a, b, name, lx, ly, at] of parts) {
      const s = K.box(world, 'co-seg hatch', x(a), BY, (b - a) * PX, BH);
      gsap.set(s, { scaleX: 0 });
      tl.to(s, { scaleX: 1, duration: 0.7, ease: 'power3.out' }, at);
      const lab = K.box(world, 'co-lab', lx, ly, null, null, `${name}<b>${b - a}</b>`);
      K.show(lab, at + 0.25, { y: 8, duration: 0.4 });
      if (ly < BY - 60) K.draw(K.path(g, `M${x(b) - 12},${BY - 6} L${x(b) - 12},${ly + 44}`, 'ln soft'), at + 0.25, { duration: 0.3 });
    }

    const RX = 1250;
    const total = K.box(world, 'co-total', RX, BY - 30, null, null, '450<span>美元/月</span>');
    K.show(total, T('n5', '四五百') - 0.1, { y: 20, duration: 0.6 });
    const fx = K.box(world, 'note', RX, BY + 62, null, null, '按汇率 7.1 折合人民币');
    K.show(fx, T('n5', '折成') - 0.1, { y: 0, duration: 0.4 });
    const CY0 = BY + 112, CW = 510, CHH = 76;
    const chip = K.box(world, 'chip', RX, CY0, CW, CHH, '<i class="hatch"></i>工具费<b>3.2K</b>/月');
    K.show(chip, T('n5', '三千二') - 0.15, { y: 18, duration: 0.6 });

    // who carries it: the company has no place for it yet
    const HY = 600, RY = 676, PITCH = 86, CX = 620;
    const side = K.box(world, 'co-side', X0, HY + 8, null, null, '费用承担');
    const hC = K.box(world, 'co-head', CX, HY, null, null, '公司');
    const hP = K.box(world, 'co-head', RX, HY, null, null, '个人');
    const rC = K.box(world, 'co-rule', CX, HY + 60, CW, 3), rP = K.box(world, 'co-rule', RX, HY + 60, CW, 3);
    const a6 = T('n6');
    K.show([side, hC, rC, hP, rP], a6 - 0.1, { y: 0, duration: 0.5, stagger: 0.05 });
    const slots = ['统一采购', '路由服务', '费用报销'].map((n, i) => K.box(world, 'slot', CX, RY + i * PITCH, CW, CHH, `${n}<span>未建立</span>`));
    const tBuy = T('n6', '统一采购') - 0.15, tPay = T('n6', '报销') - 0.15;
    K.show(slots[0], tBuy, { y: 0, x: -14, duration: 0.4 });
    K.show(slots[1], Math.min(tBuy + 0.45, tPay - 0.3), { y: 0, x: -14, duration: 0.4 });
    K.show(slots[2], tPay, { y: 0, x: -14, duration: 0.4 });
    const land = K.box(world, 'slot land', RX, RY, CW, CHH, '');
    K.show(land, a6 + 0.2, { y: 0, duration: 0.4 });
    tl.to(chip, { y: RY - CY0, duration: 1.0, ease: 'power3.inOut' }, T('n6', '个人') - 0.45);

    K.hide(world, S4 - 0.4, { duration: 0.35 });
  });

  // -------------------------------------------------------- 04 测算 → 05 诉求
  Film.scene('calc', S4 - 0.05, DUR + 1, ({ root }) => {
    const world = base(root);
    const c4 = K.chrome(root, { chapter: ['04', '测算'] }), c5 = K.chrome(root, { chapter: ['05', '诉求'] });
    const B = 850, PX = 22, AX = 300, CW = 240;                    // base line, px per K
    const y = k => B - k * PX;

    const ttl = title(world, '税前 29K 对应可支配收入 20K', 156, 100);
    K.rise(ttl.inners, S4 + 0.3, { duration: 0.9 });

    const frame = K.el(world, 'fill');                              // axis, base line: leaves with the comparison
    K.box(frame, 'base', AX, y(30), 2, 30 * PX);
    K.box(frame, 'base', AX, B, 1420, 2);
    for (const k of [0, 10, 20, 30]) {
      K.box(frame, 'tick', AX - 12, y(k) - 1, 12, 2);
      const lab = K.box(frame, 'ax', AX - 122, y(k) - 20, 100, null, k ? k + 'K' : '0');
      lab.style.textAlign = 'right';
    }
    K.box(frame, 'note', 130, B + 22, null, null, '单位：元/月');
    K.show(frame, S4 + 0.2, { y: 0, duration: 0.6 });

    /* One column: gross, then 五险一金 / 个税 / 工具费 taken off the top, in that order. */
    function column(X, gross, ins, tax, tool, rowHtml, blue) {
      const grp = K.box(world, '', 0, 0, Film.W, Film.H);
      const col = K.box(grp, 'ca-col' + (blue ? ' blue' : ''), X, y(gross), CW, gross * PX);
      gsap.set(col, { scaleY: 0 });
      const mk = (cls, from, to, name, val, ly) => {
        const seg = K.box(grp, 'ca-seg ' + cls, X, y(from), CW, (from - to) * PX);
        gsap.set(seg, { scaleY: 0 });
        const lab = K.box(grp, 'ca-lab', X + CW + 18, ly, null, null, `<i class="${cls}"></i>${name}<b>−${val}K</b>`);
        return { seg, lab };
      };
      const a1 = gross - ins, a2 = a1 - tax, a3 = a2 - tool;
      // labels sit beside their segments, at least one line apart, and never across the 20K line
      let prev = -1e9;
      const at = (a, b) => {
        let t = Math.max((y(a) + y(b)) / 2 - 20, prev + 46);
        if (t < y(20) + 4 && t + 40 > y(20) - 4) t = y(20) + 8;
        return (prev = t);
      };
      const sIns = mk('f-ins', gross, a1, '五险一金', ins.toFixed(1), at(gross, a1));
      const sTax = mk('f-tax', a1, a2, '个税', tax.toFixed(1), at(a1, a2));
      const sTool = mk('hatch', a2, a3, '工具费', tool.toFixed(1), at(a2, a3));
      const read = (small, v) => K.box(grp, 'ca-read', X, y(a3) + 96, CW, null, `<small>${small}</small><b>${v.toFixed(1)}K</b>`);
      const r0 = read('税前月薪', gross), r1 = read('税后收入', a2), r2 = read('可支配收入', a3);
      const row = K.box(grp, 'ca-row' + (blue ? ' blue' : ''), X + CW / 2 - 200, B + 18, 400, null, rowHtml);
      gsap.set([r0, r1, r2, row, sIns.lab, sTax.lab, sTool.lab], { autoAlpha: 0 });
      const cut = (s, at) => {
        tl.to(s.seg, { scaleY: 1, duration: 0.45, ease: 'power2.out' }, at);
        tl.to(s.lab, { autoAlpha: 1, duration: 0.3 }, at + 0.15);
      };
      return {
        grp, sTool, top: y(a3),
        grow(at) {
          tl.to(col, { scaleY: 1, duration: 0.9, ease: 'power3.out' }, at);
          tl.to(row, { autoAlpha: 1, duration: 0.4 }, at + 0.1);
          tl.to(r0, { autoAlpha: 1, duration: 0.3 }, at + 0.5);
        },
        ins(at) { cut(sIns, at); }, tax(at) { cut(sTax, at); }, tool(at) { cut(sTool, at); },
        net(at) { swap(r0, r1, at); }, left(at) { swap(r1, r2, at); },
      };
    }

    // 核定方案
    const c1 = column(400, 23, 2.8, 1.2, 3.2, '核定方案<b>23K</b>', false);
    c1.grow(T('n7', '两万三') - 0.25);
    c1.ins(T('n7', '五险一金') - 0.1);
    c1.tax(T('n7', '个税') - 0.1);
    c1.net(T('n7', '到手') + 0.1);
    c1.tool(T('n7', '工具费') - 0.1);
    c1.left(T('n7', '剩') + 0.1);

    // the 20K the candidate expects, and how far 23K falls short of it
    const tLine = T('n8', '两万') - 0.35;
    const target = K.box(world, 'ca-target', AX, y(20) - 1.5, 1480, 0);
    gsap.set(target, { scaleX: 0 });
    tl.to(target, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, tLine);
    const tLab = K.box(world, 'ca-row', 1500, y(20) - 52, 280, null, '收入预期<b>20K</b>');
    tLab.style.textAlign = 'right';
    K.show(tLab, tLine + 0.5, { y: 0, duration: 0.4 });
    const gap = K.box(c1.grp, 'ca-gap', 368, y(20), 16, c1.top - y(20));
    const gapLab = K.box(c1.grp, 'ca-row', 368 - 170, (y(20) + c1.top) / 2 - 22, 160, null, '差<b>4.2K</b>');
    gapLab.style.textAlign = 'right';
    K.show([gap, gapLab], tLine + 0.9, { y: 0, duration: 0.4, stagger: 0.1 });

    // 期望基线
    const c2 = column(960, 29, 3.5, 2.3, 3.2, '期望基线<b>29K</b>', true);
    const g0 = T('n8', '两万九') - 0.25;
    c2.grow(g0);
    c2.ins(g0 + 0.75);
    c2.tax(g0 + 1.0);
    c2.net(g0 + 1.2);
    const tTool = Math.max(T('n8', '工具费') - 0.1, g0 + 1.45);
    c2.tool(tTool);
    c2.left(Math.max(T('n8', '才剩') + 0.1, tTool + 0.4));

    // ---- 05: the comparison leaves, the 29K column stays as the thing being asked for
    const A = Math.min(T('n8', 'end', 1.4), T('n9') - 0.55);
    K.hide([ttl, frame, c1.grp, target, tLab], A, { duration: 0.4 });
    K.hide(c4.chapter, A, { duration: 0.3 });
    K.show(c5.chapter, A + 0.3, { y: 0, duration: 0.3 });
    tl.to(c2.grp, { x: 160 - 960, duration: 1.1, ease: 'power3.inOut' }, A + 0.15);

    const SX = 760, VX = 900, VW = 900;
    const head = K.box(world, 'ask-head', SX, 150, null, null, '固定月薪<b>29K</b>左右<i>×</i><b>15</b>薪');
    const sub = K.box(world, 'ask-sub', SX, 244, null, null, '税前年包约 43.5 万元（核定方案 34.5 万元）');
    const rule = K.box(world, 'ask-rule', SX, 318, 1040, 3);
    gsap.set(rule, { scaleX: 0 });
    K.show(head, T('n9') + 0.25, { y: 24, duration: 0.7 });
    K.show(sub, T('n9') + 0.55, { y: 0, duration: 0.5 });
    tl.to(rule, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, T('n9') + 0.5);

    const rows = [
      ['前提', '工具费由个人承担；<br>公司统一采购或报销后，基线另行商定', T('n9', '个人') - 0.1],
      ['驻场', '差旅与住宿由公司按项目独立核算', T('n10') + 0.1],
      ['复评', '承担现场实施与独立交付后，按阶段评估调薪', T('n10', '以后') - 0.1],
      ['替代', '固定月薪受职级限制时，<br>改为兑现条件明确的岗位津贴或专项绩效', T('n11') + 0.1],
    ];
    let ry = 352;
    for (const [k, v, at] of rows) {
      const ek = K.box(world, 'ask-k', SX, ry, null, null, k);
      const ev = K.box(world, 'ask-v', VX, ry, VW, null, v);
      K.show([ek, ev], at, { y: 14, duration: 0.55, stagger: 0.08 });
      ry += ev.offsetHeight + 44;
    }
    // the tool cost is the conditional part of the column
    Film.onFrame(t => c2.sTool.seg.classList.toggle('cond', t >= T('n9', '公司') - 0.1));

    const out = K.el(root, 'fill', null, { background: '#05080d', zIndex: 80 });
    gsap.set(out, { autoAlpha: 0 });
    tl.to(out, { autoAlpha: 1, duration: 0.55, ease: 'power2.in' }, DUR - 0.6);
  });

  // ------------------------------------------------------------------ captions
  Film.scene('captions', 0, DUR + 1, ({ root }) => {
    root.style.zIndex = 70;
    const cap = K.el(root, 'cap', '');
    const isChar = ch => /[\p{L}\p{N}]/u.test(ch);
    const cues = [];
    for (const s of window.TIMELINE.segments) {
      if (!s.text) continue;
      let ci = 0, buf = '', n = 0, t0 = null;
      const chars = [...s.text];
      chars.forEach((ch, i) => {
        if (isChar(ch)) { if (t0 === null) t0 = s.words[ci].t; ci++; n++; }
        buf += ch;
        const last = i === chars.length - 1;
        if (n && ('。？！；'.includes(ch) || ('，：'.includes(ch) && n >= 12) || last)) {
          const w = s.words[ci - 1];
          cues.push({ t0: t0 - 0.08, t1: w.t + w.d + 0.45, text: buf.replace(/^[，：；。\s]+|[，：；。\s]+$/g, '') });
          buf = ''; n = 0; t0 = null;
        }
      });
    }
    Film.onFrame(t => {
      let text = '';
      for (const c of cues) if (t >= c.t0 && t < c.t1) text = c.text;
      if (cap.textContent !== text) cap.textContent = text;
    });
  });
})();
