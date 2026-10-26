/* Chapter 2: one synthetic case, taken from a pile of material to a pyramid.
   The forty fragments are the same elements from the pile to the finished structure. */
(function () {
  const { T } = Film, tl = K.tl;
  const CH = ['02', '方法'];
  Parts.chapterCard('c2', '02', '方法', '合成案例');

  // ------------------------------------------------------------ the company
  const A0 = T('c2.card', 'end') - 0.1, A1 = T('c2.5') + 0.2;
  Film.scene('c2-company', A0, A1, ({ root }) => {
    root.classList.add('paper');
    const w = K.el(root, 'fill');
    K.el(root, 'grain'); K.el(root, 'vignette');
    K.chrome(root, { chapter: CH, badge: '合成案例 · 数字为虚构' });

    const lab = K.box(w, 't-label', 200, 236, null, null, '案例');
    const name = K.lines(w, 't-hero', ['栈桥科技']);
    name.style.cssText += 'position:absolute;left:194px;top:268px;';
    const what = K.box(w, 't-lead c2-what', 200, 470, 700, null, '连锁门店的<br>收银与对账软件');
    K.show(lab, T('c2.1') + 0.1, { y: 0 });
    K.rise(name.inners, T('c2.2') - 0.1);
    K.show(what, T('c2.2', '连锁') - 0.1, { y: 16 });

    // renewal rate by quarter
    const X0 = 1000, X1 = 1740, Y0 = 330, Y1 = 830, lo = 78, hi = 94;
    const vals = [90, 91, 92, 91, 90, 92, 91, 91, 82];
    const px = i => X0 + (i * (X1 - X0)) / (vals.length - 1), py = v => Y1 - ((v - lo) / (hi - lo)) * (Y1 - Y0);
    const g = K.svg(w);
    const base = K.path(g, `M${X0 - 30},${Y1} L${X1 + 40},${Y1}`, 'ln thin');
    const ref = K.path(g, `M${X0 - 30},${py(90)} L${X1 + 40},${py(90)}`, 'ln thin dash');
    const steady = K.path(g, 'M' + vals.slice(0, 8).map((v, i) => `${px(i)},${py(v)}`).join(' L'), 'ln', { 'stroke-width': 6 });
    const drop = K.path(g, `M${px(7)},${py(91)} L${px(8)},${py(82)}`, 'ln red', { 'stroke-width': 7 });
    const ctitle = K.box(w, 't-body dim', X0 - 30, Y0 - 110, 600, null, '老客户续约率，按季度');
    const ref90 = K.box(w, 't-small dim', X1 + 52, py(90) - 20, 100, null, '90%');
    const v91 = K.box(w, 't-num c2-big', px(7) - 250, py(91) - 140, 260, null, '91%');
    const v82 = K.box(w, 't-num c2-big red', px(8) - 150, py(82) + 30, 260, null, '82%');
    const q3 = K.box(w, 't-body dim', px(8) - 110, Y1 + 24, 240, null, '今年第三季度');
    const dot = K.sv(g, 'circle', { cx: px(8), cy: py(82), r: 11, fill: '#dd4a3c' });
    gsap.set(dot, { scale: 0, transformOrigin: `${px(8)}px ${py(82)}px` });
    const c0 = T('c2.2', '今年') - 0.3;
    K.show([ctitle, ref90], c0, { y: 0 });
    K.draw([base, ref], c0, { duration: 0.6 });
    K.draw(steady, c0 + 0.3, { duration: 1.5, ease: 'power1.inOut' });
    K.show(v91, T('c2.2', '续约率') + 0.5, { y: 14, duration: 0.5 });
    K.draw(drop, T('c2.2', '掉到') - 0.25, { duration: 0.5, ease: 'power3.in' });
    tl.to(dot, { scale: 1, duration: 0.4, ease: 'back.out(3)' }, T('c2.2', '掉到') + 0.2);
    K.show([v82, q3], T('c2.2', '掉到') + 0.2, { y: -14, duration: 0.5 });

    // the sales head, then the CEO
    const say = K.box(w, 'c2-say', 200, 690, 720, null, '<span>销售负责人</span><p>“对手便宜两成，<br>必须降价。”</p>');
    K.show(say, T('c2.3') + 0.1, { y: 20 });
    tl.to([name, what, lab], { autoAlpha: 0.0, y: -30, duration: 0.6, ease: 'power2.inOut' }, T('c2.3') - 0.2);
    tl.to(say, { y: -400, duration: 0.9, ease: 'power3.inOut' }, T('c2.3') + 0.1 + 0.9);
    const ceo = K.box(w, 'c2-say', 200, 640, 720, null, '<span>CEO</span><p>“先查清楚。”</p>');
    K.show(ceo, T('c2.4') + 0.1, { y: 20 });
    const days = [];
    for (let i = 0; i < 14; i++) days.push(K.box(w, 'c2-day', 200 + i * 50, 900, 38, 38));
    const dlab = K.box(w, 't-small dim', 200, 952, 400, null, '两周');
    K.show([...days, dlab], T('c2.4', '两周') - 0.3, { y: 0, stagger: 0.02, duration: 0.3 });
    tl.to(days, { backgroundColor: '#0d1826', duration: 0.12, stagger: 0.11, ease: 'none' }, T('c2.4', '两周'));
    tl.to(w, { autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, A1 - 0.75);
  });

  // ------------------------------------------------------------- the world
  const CARDS = [
    // price
    ['dash', 'price', '流失客户：折扣 7.8 折'], ['dash', 'price', '留存客户：折扣 7.9 折'],
    ['dash', 'price', '嫌贵的：流失客户 38%'], ['dash', 'price', '嫌贵的：留存客户 36%'],
    ['note', 'price', '对手报价低两成'], ['note', 'price', '客户嫌贵'], ['note', 'price', '要求打折再续约'], ['note', 'price', '竞品送半年'],
    ['note', 'price', '留下的客户也嫌贵'], ['talk', 'price', '“价格能再谈谈吗”'], ['talk', 'price', '“贵，但还在用”'], ['fin', 'price', '降两成 ≈ 少收两成'],
    // first month
    ['dash', 'first', '未启用对账：续约 61%'], ['dash', 'first', '已启用对账：续约 93%'],
    ['dash', 'first', '流失客户 74% 未启用'], ['dash', 'first', '启用 66%，往年 94%'],
    ['tick', 'first', '对账规则不会配'], ['tick', 'first', '月底对不上账'], ['tick', 'first', '门店导入失败'], ['tick', 'first', '找不到对账入口'],
    ['tick', 'first', '培训视频看不懂'], ['tick', 'first', '工单集中在首月'], ['talk', 'first', '“上线后没人教”'], ['talk', 'first', '“店长只用收银”'],
    ['talk', 'first', '“头一个月就搁下了”'], ['note', 'first', '新客户没人跟进'], ['fin', 'first', '未启用的回款变慢'],
    // pilot
    ['dash', 'pilot', '试点：40 家新客户'], ['dash', 'pilot', '试点启用率 85%'], ['dash', 'pilot', '对照组启用率 48%'],
    ['talk', 'pilot', '“有人带着配了一遍”'], ['note', 'pilot', '辅导每家约 3 小时'], ['fin', 'pilot', '辅导成本低于降价损失'], ['tick', 'pilot', '试点客户工单少一半'],
    // unrelated
    ['note', 'other', '想要外卖对接'], ['tick', 'other', '打印机驱动问题'], ['talk', 'other', '“界面颜色太素”'], ['note', 'other', '对方老板换人了'],
    ['fin', 'other', '发票抬头变更'], ['tick', 'other', '周末客服排队'],
  ];
  const SRC = { note: '销售笔记', tick: '客服工单', talk: '客户访谈', dash: '数据看板', fin: '回款表' };
  const KX = { price: 700, first: 1500, pilot: 2300 };
  const KEYS = {
    price: { label: '价格', title: '关于价格', claim: '价格不能解释客户去留' },
    first: { label: '上线首月', claim: '流失集中在首月未启用对账的客户' },
    pilot: { label: '辅导试点', claim: '首月辅导能提高启用率' },
  };
  const CW = 360, CHt = 84, KEY_Y = 560, KEY_H = 130, KEY_W = 720, TOP = { x: 1010, y: 190, w: 980, h: 150 };

  const B0 = A1 - 0.8, B1 = T('c3.card') + 0.1;
  Film.scene('c2-world', B0, B1, ({ root }) => {
    root.classList.add('c2-root');
    const tilt = K.el(root, 'fill c2-tilt');
    const world = K.el(tilt, 'c2-world');
    K.el(root, 'grain'); K.el(root, 'vignette');
    const chD = K.chrome(root, { chapter: CH, badge: '合成案例 · 数字为虚构', dark: true });
    const chL = K.chrome(root, { chapter: CH, badge: '合成案例 · 数字为虚构' });
    gsap.set(chL.root, { autoAlpha: 0 });
    gsap.set(root, { opacity: 0 });
    tl.to(root, { opacity: 1, duration: 0.7 }, B0);

    const cam = { x: 1500, y: 960, s: 0.62, rx: 42 };
    Film.onFrame(() => {
      world.style.transform = `translate(${960 - cam.x * cam.s}px,${540 - cam.y * cam.s}px) scale(${cam.s})`;
      tilt.style.transform = `perspective(1800px) rotateX(${cam.rx}deg)`;
    });
    const camTo = (at, x, y, s, dur, ease) => tl.to(cam, { x, y, s, duration: dur || 1.6, ease: ease || 'power3.inOut' }, at);

    // cards
    const r = K.rng(42);
    const bySrc = { note: 0, tick: 0, talk: 0, dash: 0, fin: 0 }, byTopic = { price: 0, first: 0, pilot: 0, other: 0 };
    const srcCol = { note: 0, tick: 1, talk: 2, dash: 3, fin: 4 };
    const cards = CARDS.map(([src, topic, text], i) => {
      const e = K.el(world, 'c2-card c2-src-' + src, `<i>${SRC[src]}</i><b>${text}</b>`);
      e.style.setProperty('--len', 42 + Math.round(r() * 44) + '%');
      const c = { e, src, topic, i };
      c.m = { x: 150 + r() * 2400, y: 330 + r() * 1250, r: (r() - 0.5) * 50 };
      c.s = { x: 330 + srcCol[src] * 460, y: 430 + bySrc[src]++ * 98 };
      const n = byTopic[topic]++;
      c.t = topic === 'other' ? { x: 2800, y: 800 + n * 100 } : { x: KX[topic] - 370 + (n % 2) * 380, y: 800 + Math.floor(n / 2) * 100 };
      gsap.set(e, { x: c.m.x, y: c.m.y - 700, rotation: c.m.r, autoAlpha: 0 });
      return c;
    });

    // --- c2.5: the pile
    const drops = { note: T('c2.5', '团队') - 0.5, tick: T('c2.5', '客服工单') - 0.5, talk: T('c2.5', '客户访谈') - 0.5, dash: T('c2.5', '数据看板') - 0.5, fin: T('c2.5', '回款表') - 0.5 };
    const seen = {};
    cards.forEach(c => {
      const k = (seen[c.src] = (seen[c.src] || 0) + 1);
      tl.to(c.e, { y: c.m.y, autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, drops[c.src] + k * 0.09);
    });
    tl.to(cam, { s: 0.72, y: 980, rx: 36, duration: T('c2.6') - T('c2.5') + 1, ease: 'sine.inOut' }, T('c2.5') - 0.4);
    const hud = K.el(root, 'c2-hud');
    const counts = [['47', '条销售笔记', 'note'], ['300+', '张客服工单', 'tick'], ['12', '场客户访谈', 'talk'], ['1', '块数据看板', 'dash'], ['1', '张回款表', 'fin']]
      .map(([n, t, k]) => { const e = K.el(hud, 'c2-count', `<b class="t-num">${n}</b><span>${t}</span>`); K.show(e, drops[k] + 0.3, { y: 14, duration: 0.5 }); return e; });
    tl.to(hud, { autoAlpha: 0, duration: 0.5 }, T('c2.6') - 0.3);

    // --- c2.9–c2.11: grouping
    const g9 = T('c2.9');
    tl.to(cam, { rx: 0, s: 0.66, x: 1500, y: 960, duration: 2.0, ease: 'power3.inOut' }, g9 - 0.2);
    camTo(T('c2.10', '按来源') - 0.6, 1430, 905, 0.74, 1.6);
    cards.forEach(c => tl.to(c.e, { rotation: c.m.r * 0.25, duration: 1.6, ease: 'power3.inOut' }, g9 - 0.1));
    const step = K.el(root, 'c2-step');
    const step1 = K.el(step, 'c2-step-line', '<b>第一步</b>分组');
    const step2 = K.el(step, 'c2-step-line', '<b>第二步</b>每组写一句判断');
    K.show(step1, T('c2.9', '第一步') - 0.1, { y: 16 });
    // by source
    const s10 = T('c2.10', '按来源') - 0.5;
    cards.forEach(c => tl.to(c.e, { x: c.s.x, y: c.s.y, rotation: 0, duration: 1.3, ease: 'power3.inOut' }, s10 + srcCol[c.src] * 0.08 + r() * 0.2));
    const srcLabs = Object.keys(SRC).map(k => { const e = K.box(world, 'c2-collab', 330 + srcCol[k] * 460, 340, 360, null, SRC[k]); K.show(e, s10 + 1.0 + srcCol[k] * 0.08, { y: 14 }); return e; });
    const verdict = K.box(root, 'c2-verdict', 0, 800, 1920, null, '<span>按来源分，只整理了文件</span>');
    const gsv = K.svg(world, null, 3000, 2200);
    const strike = K.path(gsv, 'M330,372 L2530,372', 'ln red', { 'stroke-width': 5 });
    K.show(verdict, T('c2.10', '等于') - 0.2, { y: 14 });
    K.draw(strike, T('c2.10', '等于') + 0.3, { duration: 0.7 });
    // by what they say; the stage turns from night to paper
    const s11 = T('c2.11') - 0.2;
    tl.to([...srcLabs, verdict, strike], { autoAlpha: 0, duration: 0.4 }, s11);
    tl.to(root, { '--k': 1, duration: 1.8, ease: 'power2.inOut' }, s11 + 0.1);
    tl.to(chD.root, { autoAlpha: 0, duration: 0.8 }, s11 + 0.4);
    tl.to(chL.root, { autoAlpha: 1, duration: 0.8 }, s11 + 0.8);
    cards.forEach(c => tl.to(c.e, { x: c.t.x, y: c.t.y, rotation: 0, duration: 1.5, ease: 'power3.inOut' }, s11 + 0.2 + r() * 0.5));
    camTo(s11, 1700, 1000, 0.58, 2.0);
    const topicLab = {};
    const lit = { price: T('c2.11', '价格') - 0.2, first: T('c2.11', '上线') - 0.3, pilot: T('c2.11', '辅导') - 0.3 };
    for (const k in KEYS) {
      topicLab[k] = K.box(world, 'c2-topic', KX[k] - KEY_W / 2, KEY_Y + 60, KEY_W, null, KEYS[k].label);
      K.show(topicLab[k], lit[k], { y: 20, duration: 0.6 });
      const mine = cards.filter(c => c.topic === k).map(c => c.e);
      tl.to(mine, { '--hot': 1, duration: 0.35, stagger: 0.02 }, lit[k]);
      tl.to(mine, { '--hot': 0, duration: 0.6 }, lit[k] + 1.5);
    }
    const others = cards.filter(c => c.topic === 'other').map(c => c.e);
    const otherLab = K.box(world, 'c2-collab', 2760, 720, 440, null, '无关材料');
    K.show(otherLab, T('c2.11', 'end') - 0.6, { y: 0 });
    tl.to([...others, otherLab], { autoAlpha: 0, x: '+=160', duration: 0.9, ease: 'power2.in' }, T('c2.12') - 0.2);

    // --- c2.12–c2.17: one statement per group
    tl.to(step1, { autoAlpha: 0.35, duration: 0.4 }, T('c2.12'));
    K.show(step2, T('c2.12', '第二步') - 0.1, { y: 16 });
    const keyBox = {}, keyChars = {};
    for (const k in KEYS) {
      const b = K.box(world, 'c2-key', KX[k] - KEY_W / 2, KEY_Y, KEY_W, KEY_H, `<span>${KEYS[k].claim}</span>`);
      gsap.set(b, { autoAlpha: 0, y: 30 });
      keyBox[k] = b;
    }
    const focus = (k, at) => {
      camTo(at, KX[k] + 400, 925, 1.12, 1.5);
      for (const j in KEYS) {
        const mine = cards.filter(c => c.topic === j).map(c => c.e);
        tl.to([...mine, topicLab[j], keyBox[j]], { opacity: j === k ? 1 : 0.1, duration: 0.6 }, at + 0.2);
      }
    };
    // panel on the right for what the evidence says
    const panel = K.el(root, 'c2-panel');
    gsap.set(panel, { xPercent: 100 });
    const pane = (html) => { const e = K.el(panel, 'c2-pane', html); gsap.set(e, { autoAlpha: 0 }); return e; };
    const bar = (label, v, max, cls) => `<div class="c2-bar ${cls || ''}"><span>${label}</span><i style="--w:${(v / max) * 100}%"></i><b class="t-num">${typeof v === 'number' && max === 100 ? v + '%' : v}</b></div>`;

    focus('price', T('c2.12') - 0.3);
    tl.to(panel, { xPercent: 0, duration: 0.9, ease: 'power3.inOut' }, T('c2.13') - 0.4);
    // "关于价格" is a heading; it asserts nothing
    const p1 = pane(`<h4>每组的概括句</h4>
      <div class="c2-vs"><div class="c2-chip dashed" data-a><em>标题</em>关于价格</div><p data-a2>未下判断</p></div>
      <div class="c2-vs"><div class="c2-chip solid" data-b><em>判断</em>价格不能解释客户去留</div><p data-b2>可追问、可推翻</p></div>`);
    const [pa, pa2, pb, pb2] = ['[data-a]', '[data-a2]', '[data-b]', '[data-b2]'].map(s => p1.querySelector(s));
    gsap.set([pa, pa2, pb, pb2], { autoAlpha: 0, y: 16 });
    tl.to(p1, { autoAlpha: 1, duration: 0.4 }, T('c2.13') - 0.2);
    tl.to(pa, { autoAlpha: 1, y: 0, duration: 0.5 }, T('c2.13') + 0.05);
    tl.to(pa2, { autoAlpha: 1, y: 0, duration: 0.5 }, T('c2.13', '什么也没有') - 0.1);
    tl.to(topicLab.price, { '--strike': 1, duration: 0.5 }, T('c2.13', '不够') - 0.1);
    tl.to(pb, { autoAlpha: 1, y: 0, duration: 0.5 }, T('c2.14', '判断') - 0.2);
    tl.to(topicLab.price, { autoAlpha: 0, y: -20, duration: 0.4 }, T('c2.14', '价格') - 0.35);
    tl.to(keyBox.price, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'expo.out' }, T('c2.14', '价格') - 0.2);
    // the evidence under it
    const p2 = pane(`<h4>依据</h4><h5>折扣</h5>${bar('流失客户', '7.8 折', 1, 'a')}${bar('留存客户', '7.9 折', 1, 'b')}
      <h5>抱怨价格的占比</h5>${bar('流失客户', 38, 100, 'c')}${bar('留存客户', 36, 100, 'd')}<p class="c2-note">两组相近：价格不能解释去留</p>`);
    p2.querySelector('.a i').style.setProperty('--w', '78%'); p2.querySelector('.b i').style.setProperty('--w', '79%');
    const swap = (from, to, at) => { tl.to(from, { autoAlpha: 0, duration: 0.35 }, at); tl.to(to, { autoAlpha: 1, duration: 0.45 }, at + 0.3); };
    swap(p1, p2, T('c2.14', '依据') - 0.3);
    const rows2 = p2.querySelectorAll('.c2-bar'), fills2 = p2.querySelectorAll('.c2-bar i');
    const vals2 = p2.querySelectorAll('.c2-bar b');
    gsap.set(fills2, { scaleX: 0 }); gsap.set(vals2, { autoAlpha: 0 }); gsap.set(p2.querySelector('.c2-note'), { autoAlpha: 0 });
    tl.to([fills2[0], fills2[1]], { scaleX: 1, duration: 0.8, stagger: 0.25, ease: 'power3.out' }, T('c2.14', '折扣') - 0.3);
    tl.to([vals2[0], vals2[1]], { autoAlpha: 1, duration: 0.4, stagger: 0.25 }, T('c2.14', '折扣'));
    tl.to([fills2[2], fills2[3]], { scaleX: 1, duration: 0.8, stagger: 0.25, ease: 'power3.out' }, T('c2.14', '嫌贵') - 0.2);
    tl.to([vals2[2], vals2[3]], { autoAlpha: 1, duration: 0.4, stagger: 0.25 }, T('c2.14', '嫌贵') + 0.1);
    tl.to(p2.querySelector('.c2-note'), { autoAlpha: 1, duration: 0.5 }, T('c2.14', '一样多') - 0.1);
    const ev = k => cards.filter(c => c.topic === k).slice(0, 4).map(c => c.e);
    tl.to(ev('price'), { '--hot': 1, duration: 0.4, stagger: 0.08 }, T('c2.14', '依据') - 0.1);
    // "判断可以被追问，可以被推翻。标题不能。"
    swap(p2, p1, T('c2.15') - 0.3);
    tl.to(pb2, { autoAlpha: 1, y: 0, duration: 0.5 }, T('c2.15', '追问') - 0.2);
    tl.to(pb, { '--ring': 1, duration: 0.5 }, T('c2.15', '追问') - 0.2);
    tl.to([pa, pa2], { opacity: 0.35, duration: 0.5 }, T('c2.15', '标题') - 0.1);
    tl.to(ev('price'), { '--hot': 0, duration: 0.5 }, T('c2.15'));

    // first month
    focus('first', T('c2.16') - 0.3);
    const p3 = pane(`<h4>依据</h4><h5>续约率，按首月是否启用对账</h5>${bar('首月未启用', 61, 100, 'a')}${bar('首月已启用', 93, 100, 'b hot')}<p class="c2-note">流失客户中 74% 首月未启用<br>本批到期客户首月启用率 66%，往年 94%</p>`);
    swap(p1, p3, T('c2.16') - 0.2);
    tl.to(topicLab.first, { autoAlpha: 0, y: -20, duration: 0.4 }, T('c2.16', '流失集中') - 0.35);
    tl.to(keyBox.first, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'expo.out' }, T('c2.16', '流失集中') - 0.2);
    const f3 = p3.querySelectorAll('.c2-bar i'), v3 = p3.querySelectorAll('.c2-bar b'); gsap.set(f3, { scaleX: 0 }); gsap.set(v3, { autoAlpha: 0 }); gsap.set(p3.querySelector('.c2-note'), { autoAlpha: 0 });
    tl.to(f3[0], { scaleX: 1, duration: 0.9, ease: 'power3.out' }, T('c2.16', '续约率') - 0.1);
    tl.to(v3[0], { autoAlpha: 1, duration: 0.4 }, T('c2.16', '续约率') + 0.5);
    tl.to(f3[1], { scaleX: 1, duration: 0.9, ease: 'power3.out' }, T('c2.16', '启用了的') - 0.2);
    tl.to(v3[1], { autoAlpha: 1, duration: 0.4 }, T('c2.16', '启用了的') + 0.4);
    tl.to(p3.querySelector('.c2-note'), { autoAlpha: 1, duration: 0.5 }, T('c2.16', '这一批') - 0.2);
    tl.to(ev('first'), { '--hot': 1, duration: 0.4, stagger: 0.08 }, T('c2.16', '续约率') - 0.3);
    tl.to(ev('first'), { '--hot': 0, duration: 0.5 }, T('c2.17') - 0.2);
    // pilot
    focus('pilot', T('c2.17') - 0.3);
    const p4 = pane(`<h4>依据</h4><h5>首月启用率（试点 40 家）</h5>${bar('有辅导', 85, 100, 'b hot')}${bar('无辅导', 48, 100, 'a')}<p class="c2-note">每家辅导约 3 小时，成本低于降价损失</p>`);
    swap(p3, p4, T('c2.17') - 0.2);
    tl.to(topicLab.pilot, { autoAlpha: 0, y: -20, duration: 0.4 }, T('c2.17', '首月辅导') - 0.35);
    tl.to(keyBox.pilot, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'expo.out' }, T('c2.17', '首月辅导') - 0.2);
    const f4 = p4.querySelectorAll('.c2-bar i'), v4 = p4.querySelectorAll('.c2-bar b'); gsap.set(f4, { scaleX: 0 }); gsap.set(v4, { autoAlpha: 0 }); gsap.set(p4.querySelector('.c2-note'), { autoAlpha: 0 });
    tl.to(f4[0], { scaleX: 1, duration: 0.9, ease: 'power3.out' }, T('c2.17', '启用率', 1) - 0.2);
    tl.to(v4[0], { autoAlpha: 1, duration: 0.4 }, T('c2.17', '启用率', 1) + 0.4);
    tl.to(f4[1], { scaleX: 1, duration: 0.9, ease: 'power3.out' }, T('c2.17', '没配的') - 0.1);
    tl.to(v4[1], { autoAlpha: 1, duration: 0.4 }, T('c2.17', '没配的') + 0.5);
    tl.to(p4.querySelector('.c2-note'), { autoAlpha: 1, duration: 0.5 }, T('c2.17', 'end') - 0.4);
    tl.to(ev('pilot'), { '--hot': 1, duration: 0.4, stagger: 0.08 }, T('c2.17', '试点') - 0.3);
    tl.to(ev('pilot'), { '--hot': 0, duration: 0.5 }, T('c2.18') - 0.2);

    // --- c2.18–c2.20: one more "so what", and the top
    const s18 = T('c2.18') - 0.3;
    tl.to(panel, { xPercent: 100, duration: 0.8, ease: 'power3.inOut' }, s18);
    tl.to(step, { autoAlpha: 0, duration: 0.4 }, s18);
    camTo(s18, 1500, 880, 0.66, 2.0);
    // seen whole, the evidence is read as a body, not line by line: each card becomes a slip with a bar
    tl.to(root, { '--bar': 1, duration: 1.0, ease: 'power2.inOut' }, s18 + 0.5);
    for (const j in KEYS) tl.to([...cards.filter(c => c.topic === j).map(c => c.e), keyBox[j]], { opacity: 1, duration: 0.8 }, s18 + 0.4);
    const lines = K.svg(world, null, 3000, 2200);
    const kb = k => ({ x: KX[k] - KEY_W / 2, y: KEY_Y, w: KEY_W, h: KEY_H });
    const stems = Object.keys(KEYS).map(k => K.path(lines, `M${KX[k]},${KEY_Y + KEY_H} L${KX[k]},${800 - 22} M${KX[k] - 370},${800 - 22} L${KX[k] + 370},${800 - 22}`, 'ln soft'));
    K.draw(stems, s18 + 1.2, { duration: 0.6, stagger: 0.1 });
    const ups = Object.keys(KEYS).map(k => K.path(lines, K.elbow(TOP, kb(k), 18), 'ln'));
    const topQ = K.box(world, 'c2-topq', TOP.x, TOP.y, TOP.w, TOP.h, '合在一起，说明什么？');
    K.show(topQ, T('c2.18', '往上一层') - 0.2, { y: 20 });
    const top = K.box(world, 'c2-top', TOP.x, TOP.y, TOP.w, TOP.h, '<span>不降价，把预算投到新客户首月的上线辅导</span>');
    gsap.set(top, { autoAlpha: 0, scale: 0.94 });
    tl.to(topQ, { autoAlpha: 0, duration: 0.3 }, T('c2.19') - 0.25);
    tl.to(top, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'expo.out' }, T('c2.19') - 0.15);
    // connectors are drawn upward: the structure is built from the bottom
    ups.forEach(p => { const len = p.getTotalLength(); p.style.strokeDasharray = len + ' ' + len; p.style.strokeDashoffset = -len; });
    tl.to(ups, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.08 }, T('c2.18', '往上一层') - 0.1);
    const apex = K.box(world, 'c2-apex', TOP.x + TOP.w + 40, TOP.y + 36, 400, null, '塔尖');
    const apexLine = K.path(lines, `M${TOP.x + TOP.w + 6},${TOP.y + 75} L${TOP.x + TOP.w + 30},${TOP.y + 75}`, 'ln blue');
    K.show(apex, T('c2.20', '塔尖') - 0.2, { x: -20, y: 0 });
    K.draw(apexLine, T('c2.20', '塔尖') - 0.3, { duration: 0.3 });
    const rest = [...cards.filter(c => c.topic !== 'other').map(c => c.e), ...Object.values(keyBox), ...stems, ...ups];
    tl.to(rest, { opacity: 0.22, duration: 0.8 }, T('c2.20', '整份') - 0.2);
    camTo(T('c2.20', '整份') - 0.2, 1500, 560, 0.78, 2.4, 'power2.inOut');
    tl.to(rest, { opacity: 1, duration: 0.8 }, T('c2.21') - 0.3);

    // --- c2.21–c2.23: vertical is a dialogue
    camTo(T('c2.21') - 0.3, 1500, 880, 0.66, 1.8);
    tl.to([apex, apexLine], { autoAlpha: 0, duration: 0.3 }, T('c2.21') - 0.4);
    const axis = K.box(world, 'c2-axis', 90, 360, 170, 1180, '<b>纵向</b><span>问</span><i></i><span>答</span>');
    const up = K.box(world, 'c2-dir', 2040, 196, 420, null, '搭：自下而上 ↑');
    const down = K.box(world, 'c2-dir blue', 2040, 272, 420, null, '读：自上而下 ↓');
    K.show(up, T('c2.21') + 0.1, { y: 0 }); K.show(down, T('c2.21', '读的时候') - 0.1, { y: 0 });
    tl.to([up, down], { autoAlpha: 0, duration: 0.4 }, T('c2.22') + 0.6);
    const pill = (text, x, y) => { const e = K.box(world, 'c2-pill', x - 110, y, 220, null, text); gsap.set(e, { autoAlpha: 0, scale: 0.6 }); return e; };
    const why = T('c2.22', '为什么') - 0.25;
    tl.to(top, { '--ring': 1, duration: 0.4 }, T('c2.22') - 0.1);
    Object.keys(KEYS).forEach((k, i) => {
      const q = pill('为什么？', TOP.x + TOP.w / 2, TOP.y + TOP.h + 14);
      tl.to(q, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, why);
      tl.to(q, { x: KX[k] - (TOP.x + TOP.w / 2), y: KEY_Y - TOP.y - TOP.h - 74, duration: 0.9, ease: 'power3.inOut' }, why + 0.55 + i * 0.08);
      tl.to(keyBox[k], { '--ring': 1, duration: 0.4 }, T('c2.22', '下一层') - 0.1 + i * 0.1);
      tl.to(q, { autoAlpha: 0, duration: 0.3 }, T('c2.22', '下一层') + 0.5);
      const q2 = pill('凭什么？', KX[k], KEY_Y + KEY_H + 10);
      const t2 = T('c2.22', '新的问题') - 0.2 + i * 0.12;
      tl.to(q2, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, t2);
      tl.to(q2, { y: 62, duration: 0.7, ease: 'power3.inOut' }, t2 + 0.5);
      tl.to(cards.filter(c => c.topic === k).map(c => c.e), { '--hot': 1, duration: 0.4, stagger: 0.03 }, T('c2.22', '再下一层') + i * 0.12);
      tl.to(q2, { autoAlpha: 0, duration: 0.3 }, T('c2.22', '直到'));
      tl.to(cards.filter(c => c.topic === k).map(c => c.e), { '--hot': 0, duration: 0.6 }, T('c2.23', 'end'));
      tl.to(keyBox[k], { '--ring': 0, duration: 0.5 }, T('c2.23', 'end'));
    });
    tl.to(top, { '--ring': 0, duration: 0.5 }, T('c2.23', 'end'));
    K.show(axis, T('c2.23') - 0.2, { x: -30, y: 0, duration: 0.7 });
    tl.to(axis, { autoAlpha: 0, duration: 0.5 }, T('c2.24') - 0.2);

    // --- c2.24–c2.26: horizontal is induction or deduction
    const s24 = T('c2.24') - 0.3;
    const evid = [...cards.filter(c => c.topic !== 'other').map(c => c.e), ...stems];
    tl.to(evid, { opacity: 0.0, duration: 0.6 }, s24);
    camTo(s24, 1500, 620, 0.78, 1.8);
    const brk = K.path(lines, `M${KX.price - KEY_W / 2},${KEY_Y + KEY_H + 26} L${KX.price - KEY_W / 2},${KEY_Y + KEY_H + 52} L${KX.pilot + KEY_W / 2},${KEY_Y + KEY_H + 52} L${KX.pilot + KEY_W / 2},${KEY_Y + KEY_H + 26}`, 'ln blue');
    const indLab = K.box(world, 'c2-hlabel blue', 1500 - 500, KEY_Y + KEY_H + 66, 1000, null, '<b>归纳</b>理由并列，共同支持上一层');
    K.draw(brk, T('c2.24', '归纳') - 0.2, { duration: 0.8 });
    K.show(indLab, T('c2.24', '归纳') - 0.1, { y: 14 });
    // the deductive chain, set below
    const DY = 960, DW = 650;
    const chainText = ['流失的是未启用对账的客户', '未启用是因为无人辅导', '所以应当投入辅导'];
    const chain = chainText.map((t, i) => { const e = K.box(world, 'c2-key c2-chain', KX.price - KEY_W / 2 + i * 720, DY, DW, KEY_H, `<span>${t}</span>`); gsap.set(e, { autoAlpha: 0, x: -30 }); return e; });
    const arrows = [0, 1].map(i => K.path(lines, `M${KX.price - KEY_W / 2 + i * 720 + DW + 14},${DY + KEY_H / 2} L${KX.price - KEY_W / 2 + (i + 1) * 720 - 14},${DY + KEY_H / 2} m-16,-12 l16,12 l-16,12`, 'ln'));
    const dedLab = K.box(world, 'c2-hlabel', 1500 - 500, DY + KEY_H + 26, 1000, null, '<b>演绎</b>逐步推出，结论在最后');
    const dts = [T('c2.25', '流失的') - 0.2, T('c2.25', '他们没') - 0.2, T('c2.25', '所以') - 0.2];
    chain.forEach((e, i) => tl.to(e, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out' }, dts[i]));
    K.draw(arrows[0], dts[1] - 0.3, { duration: 0.4 }); K.draw(arrows[1], dts[2] - 0.3, { duration: 0.4 });
    K.show(dedLab, T('c2.25', '演绎') - 0.1, { y: 14 });
    camTo(T('c2.25') - 0.3, 1500, 760, 0.76, 1.4);
    // Minto's advice
    const adv = K.box(world, 'c2-advice', 1500 - 700, 300, 1400, null, '靠近塔尖，尽量用归纳');
    tl.to(top, { autoAlpha: 0.0, duration: 0.5 }, T('c2.26') - 0.3);
    tl.to(ups, { autoAlpha: 0, duration: 0.5 }, T('c2.26') - 0.3);
    K.show(adv, T('c2.26', '靠近') - 0.2, { y: 20 });
    const walker = K.box(world, 'c2-walker', KX.price - KEY_W / 2 - 10, DY - 10, DW + 20, KEY_H + 20);
    gsap.set(walker, { autoAlpha: 0 });
    tl.to(walker, { autoAlpha: 1, duration: 0.3 }, T('c2.26', '演绎') - 0.1);
    tl.to(walker, { x: 720, duration: 0.9, ease: 'power2.inOut' }, T('c2.26', '从头') - 0.2);
    tl.to(walker, { x: 1440, duration: 0.9, ease: 'power2.inOut' }, T('c2.26', '走到最后') - 0.3);
    tl.to(chain[2], { '--ring': 1, duration: 0.4 }, T('c2.26', '结论') - 0.1);
    const fade26 = T('c2.27') - 0.4;
    tl.to([...chain, ...arrows, dedLab, walker, adv, brk, indLab], { autoAlpha: 0, duration: 0.5 }, fade26);

    // --- c2.27: three rules
    camTo(fade26, 1500, 880, 0.66, 1.8);
    tl.to(evid, { opacity: 1, duration: 0.8 }, fade26 + 0.3);
    tl.to([top, ...ups], { autoAlpha: 1, duration: 0.6 }, fade26 + 0.3);
    const rule = (n, text, x, y, w) => { const e = K.box(world, 'c2-rule', x, y, w, null, `<b class="t-num">${n}</b>${text}`); return e; };
    const r1 = rule('1', '上一层概括下一层', 2780, 430, 780);
    const r2 = rule('2', '同组的想法属于同一类', 2780, 650, 780);
    const r3 = rule('3', '组内的先后有依据', 2780, 870, 780);
    const r1a = K.path(lines, `M${TOP.x + TOP.w / 2 + 250},${KEY_Y - 30} L${TOP.x + TOP.w / 2 + 250},${TOP.y + TOP.h + 30} m-13,18 l13,-18 l13,18`, 'ln blue');
    const r3a = K.path(lines, `M${KX.price - 200},${KEY_Y - 36} L${KX.pilot + 200},${KEY_Y - 36} m-18,-13 l18,13 l-18,13`, 'ln blue dashless');
    K.show(r1, T('c2.27', '上一层') - 0.2, { x: 30, y: 0 }); K.draw(r1a, T('c2.27', '上一层') - 0.1, { duration: 0.7 });
    K.show(r2, T('c2.27', '同一组') - 0.2, { x: 30, y: 0 });
    Object.values(keyBox).forEach((b, i) => tl.to(b, { '--ring': 1, duration: 0.35 }, T('c2.27', '同一组') + i * 0.12));
    K.show(r3, T('c2.27', '组内') - 0.2, { x: 30, y: 0 });
    tl.to(r1a, { autoAlpha: 0, duration: 0.3 }, T('c2.27', '组内') - 0.3);
    K.draw(r3a, T('c2.27', '组内') - 0.1, { duration: 0.9 });
    camTo(T('c2.27') + 0.4, 1960, 880, 0.58, 1.6);
    K.source(root, '三条规则据明托本人在麦肯锡校友网访谈中的表述转述。', T('c2.27') + 0.6, T('c2.28') - 0.3);
    const f27 = T('c2.28') - 0.4;
    tl.to([r1, r2, r3, r3a], { autoAlpha: 0, duration: 0.5 }, f27);
    Object.values(keyBox).forEach(b => tl.to(b, { '--ring': 0, duration: 0.4 }, f27));

    // --- c2.28–c2.29: the introduction
    camTo(f27, 1500, 300, 0.7, 1.8);
    const IY = -230, IW = 600, IH = 290;
    const scq = [['情境', '读者已认可的事实', '续约率多年稳定在九成上下'], ['冲突', '打破现状的变化', '本季跌到 82%，销售要求降价'], ['疑问', '读者由此产生的问题', '该不该降？']]
      .map(([a, b, c], i) => { const e = K.box(world, 'c2-scq', 1500 - 960 + i * 660, IY, IW, IH, `<em>${a}</em><i>${b}</i><p>${c}</p>`); gsap.set(e, { autoAlpha: 0, y: 30 }); return e; });
    const scqT = [T('c2.29', '情境') - 0.2, T('c2.29', '冲突') - 0.2, T('c2.29', '疑问') - 0.2];
    scq.forEach((e, i) => {
      tl.to(e, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, scqT[i]);
      gsap.set(e.querySelector('p'), { autoAlpha: 0 });
    });
    tl.to(scq[0].querySelector('p'), { autoAlpha: 1, duration: 0.5 }, T('c2.29', '续约率') - 0.1);
    tl.to(scq[1].querySelector('p'), { autoAlpha: 1, duration: 0.5 }, T('c2.29', '这个季度') - 0.1);
    tl.to(scq[2].querySelector('p'), { autoAlpha: 1, duration: 0.5 }, T('c2.29', '该不该') - 0.1);
    const flow = [0, 1].map(i => K.path(lines, `M${1500 - 960 + i * 660 + IW + 8},${IY + IH / 2} L${1500 - 960 + (i + 1) * 660 - 8},${IY + IH / 2} m-14,-11 l14,11 l-14,11`, 'ln'));
    K.draw(flow[0], scqT[1] - 0.2, { duration: 0.4 }); K.draw(flow[1], scqT[2] - 0.2, { duration: 0.4 });
    const ans = K.path(lines, `M${1500 - 960 + 2 * 660 + IW / 2},${IY + IH + 8} L${1500 - 960 + 2 * 660 + IW / 2},${IY + IH + 110} L${TOP.x + TOP.w / 2},${IY + IH + 110} L${TOP.x + TOP.w / 2},${TOP.y - 10} m-13,-18 l13,18 l13,-18`, 'ln blue');
    const ansLab = K.box(world, 'c2-hlabel blue', TOP.x + TOP.w / 2 + 30, TOP.y - 86, 400, null, '<b>回答</b>');
    K.draw(ans, T('c2.29', '然后') - 0.3, { duration: 0.9 });
    K.show(ansLab, T('c2.29', '回答') - 0.1, { y: 0 });
    tl.to(top, { '--ring': 1, duration: 0.5 }, T('c2.29', '回答'));
    const introLab = K.box(world, 'c2-introlab', 1500 - 960, IY - 96, 1920, null, '开头：引出读者的问题');
    K.show(introLab, T('c2.28', '读者') - 0.2, { y: 14 });
    camTo(T('c2.29') - 0.2, 1500, 70, 0.8, 1.6);
    camTo(T('c2.29', '然后') - 0.4, 1500, 300, 0.62, 1.8);
    tl.to(root, { opacity: 0, duration: 0.5, ease: 'power2.in' }, T('c2.30') - 0.5);
  });

  // ------------------------------------------- the first draft: nine pages
  function pageStrip(parent, x, y, pw, ph, gap, labels) {
    const pages = labels.map((lab, i) => {
      const p = K.box(parent, 'c2-pg', x + i * (pw + gap), y, pw, ph, `<u>${i + 1}</u>` + '<s></s>'.repeat(7) + `<span>${lab}</span>`);
      return p;
    });
    return pages;
  }
  const PG = ['背景与分工', '流失名单', '访谈纪要', '访谈纪要（续）', '工单比对', '看板数据', '回款分析', '结论与建议', '附录'];
  const R0 = T('c2.6') - 0.5, R1 = T('c2.9') + 0.3;
  Film.scene('c2-report', R0, R1, ({ root }) => {
    root.classList.add('night', 'c2-report');
    K.chrome(root, { chapter: CH, badge: '合成案例 · 数字为虚构', dark: true });
    gsap.set(root, { opacity: 0 });
    tl.to(root, { opacity: 1, duration: 0.6 }, R0);
    const head = K.box(root, 't-label c2-rlab', 150, 170, null, null, '第一版报告 · 第 1 页');
    const first = K.box(root, 'c2-first', 150, 216, 1620, null, '我们首先梳理了流失客户名单，随后访谈了 12 家客户，接着比对了客服工单……');
    const chars = K.split(first);
    const t0 = T('c2.6', '我们首先');
    K.show(head, T('c2.6') + 0.1, { y: 0 });
    K.type(chars, t0, chars.length / (T('c2.6', 'end') - t0));
    const pages = pageStrip(root, 150, 520, 160, 216, 22.5, PG);
    K.show(pages, T('c2.6') + 0.5, { y: 40, stagger: 0.06, duration: 0.6 });
    const cur = K.box(root, 'c2-cursor', 150 - 8, 520 - 8, 176, 232);
    gsap.set(cur, { autoAlpha: 0 });
    tl.to(cur, { autoAlpha: 1, duration: 0.2 }, T('c2.7', '结论') - 0.9);
    tl.to(cur, { x: 7 * 182.5, duration: 1.3, ease: 'steps(7)' }, T('c2.7', '结论') - 0.8);
    tl.to(pages[7], { '--hot': 1, duration: 0.4 }, T('c2.7', '第八页') + 0.3);
    const tag = K.box(root, 'c2-ptag', 150 + 7 * 182.5 - 20, 458, 200, null, '结论：第 8 页');
    K.show(tag, T('c2.7', '第八页') + 0.3, { y: 12 });
    // what the report is organised by
    const g = K.svg(root);
    const br = K.path(g, `M150,790 L150,812 L${150 + 7 * 182.5 - 22},812 L${150 + 7 * 182.5 - 22},790`, 'ln');
    const done = K.box(root, 'c2-below', 150, 826, 1250, null, '团队的工作过程');
    K.draw(br, T('c2.8', '团队') - 0.3, { duration: 0.8 });
    K.show(done, T('c2.8', '团队') - 0.1, { y: 12 });
    tl.to(pages.map(p => p.querySelector('span')), { autoAlpha: 1, duration: 0.4, stagger: 0.05 }, T('c2.8') - 0.1);
    // the question
    tl.to([head, first], { autoAlpha: 0, y: -20, duration: 0.5 }, T('c2.8', '可') - 0.5);
    const asks = K.box(root, 't-label c2-rlab', 150, 170, null, null, 'CEO 的问题');
    const q = K.lines(root, 't-hero c2-q', ['该不该降价？']);
    q.style.cssText += 'position:absolute;left:144px;top:206px;';
    K.show(asks, T('c2.8', 'CEO问') - 0.3, { y: 0 });
    K.rise(q.inners, T('c2.8', '该不该') - 0.15);
    const arc = K.path(g, `M820,400 C1100,400 1380,410 ${150 + 7 * 182.5 + 80},452`, 'ln blue dash');
    K.draw(arc, T('c2.8', '该不该') + 0.4, { duration: 0.9 });
    tl.to(root, { opacity: 0, duration: 0.5, ease: 'power2.in' }, R1 - 0.55);
  });

  // ------------------------------------------------ nine pages become one
  const P0 = T('c2.30') - 0.4, P1 = T('c3.card') + 0.1;
  Film.scene('c2-page', P0, P1, ({ root }) => {
    root.classList.add('paper');
    const w = K.el(root, 'fill');
    K.el(root, 'grain'); K.el(root, 'vignette');
    K.chrome(root, { chapter: CH, badge: '合成案例 · 数字为虚构' });
    gsap.set(root, { opacity: 0 });
    tl.to(root, { opacity: 1, duration: 0.6 }, P0);
    const pages = pageStrip(w, 150, 300, 80, 108, 10, PG);
    pages.forEach(p => p.classList.add('light'));
    gsap.set(pages[7], { '--hot': 1 });
    const cap1 = K.box(w, 'c2-cap', 150, 452, 930, null, '<b>九页</b>按团队工作的先后排列');
    K.show(pages, P0 + 0.3, { y: 20, stagger: 0.04, duration: 0.5 });
    // the one-pager
    const memo = K.box(w, 'c2-memo', 1040, 120, 780, 850,
      `<h6>给 CEO · 关于降价</h6>
       <p class="scq">续约率多年稳定在九成上下。本季跌到 82%，销售要求降价。该不该降？</p>
       <h3>不降价。把预算投到新客户首月的上线辅导。</h3>
       <ol><li><b>价格不能解释客户去留</b><span>两组折扣相近；抱怨价格的占比相近</span></li>
       <li><b>流失集中在首月未启用对账的客户</b><span>续约率 61% 对 93%；流失客户 74% 属于这一类</span></li>
       <li><b>首月辅导能提高启用率</b><span>试点 40 家：有辅导 85%，无辅导 48%</span></li></ol>`);
    gsap.set(memo, { autoAlpha: 0, y: 60 });
    tl.to(memo, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out' }, T('c2.30', '一页') - 0.5);
    const cap2 = K.box(w, 'c2-cap blue', 150, 640, 930, null, '<b>一页</b>按读者提问的先后排列');
    const same = K.lines(w, 't-display', ['同一批证据，', '换了顺序']);
    same.style.cssText += 'position:absolute;left:144px;top:742px;';
    K.rise(same.inners, T('c2.30', '证据') - 0.2, { stagger: 0.5 });
    K.show(cap1, T('c2.30', '原来') - 0.2, { y: 12 });
    K.show(cap2, T('c2.30', '现在') - 0.2, { y: 12 });
    const parts = memo.querySelectorAll('.scq, h3, li');
    gsap.set(parts, { autoAlpha: 0, x: 20 });
    tl.to(parts, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.16, ease: 'power3.out' }, T('c2.30', '一页') - 0.1);
    tl.to(w, { autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, T('c3.card') - 0.45);
  });
})();
