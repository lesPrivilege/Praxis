/* Ten scenes on a silent clock. Every time is seconds after the start of its scene, T('loss', 3.6);
   the scene lengths live in script/beats.json. Text enters in reading order and stays until its scene ends.
   00 open   title
   01 loss   a rewrite that reads fine and has lost the qualifier
   02 floor  the four rules that hold in any language and any medium
   03 tiers  floor, language convention, editing heuristic
   04 order  who wins when requirements collide
   05 eight  the eight principles, each with its strength; one rewrite shown
   06 review pattern counts and structural positions
   07 media  projection, adaptation, addition
   08 check  what has to be checked on the real output
   09 end    the three strengths again, and this film's own change note */
(function () {
  const { T } = Film, tl = K.tl;
  const seg = id => Film.seg(id);

  function base(root) {
    root.classList.add('paper');
    const world = K.el(root, 'fill');
    K.el(root, 'grain'); K.el(root, 'vignette');
    return world;
  }
  function frame(id, chapter, build) {
    const s = seg(id);
    Film.scene(id, s.start, s.end, ({ root }) => {
      const world = base(root);
      const at = dt => T(id, dt);
      const chrome = chapter ? K.chrome(root, { chapter }) : null;
      build({ root, world, at, dur: s.end - s.start });
      if (id !== 'end') K.hide(chrome ? [world, chrome.root] : [world], s.end - s.start - 0.5 + s.start, { duration: 0.4 });
    });
  }
  const title = (world, text, at) => {
    const t = K.lines(world, 'ttl', [text]);
    t.style.cssText += 'position:absolute;left:160px;top:128px;';
    K.rise(t.inners, at, { duration: 0.9 });
    return t;
  };
  const strike = (target, at, dur) => {
    const l = document.createElement('span'); l.className = 'strike'; target.appendChild(l);
    gsap.set(l, { scaleX: 0 });
    tl.to(l, { scaleX: 1, duration: dur || 0.5, ease: 'power2.inOut' }, at);
    return l;
  };
  const arrow = (g, x1, x2, y, at) => {
    const a = K.path(g, `M${x1},${y} L${x2},${y}`, 'ln soft');
    const h = K.path(g, `M${x2 - 16},${y - 16} L${x2},${y} L${x2 - 16},${y + 16}`, 'ln soft');
    K.draw(a, at, { duration: 0.6 }); K.draw(h, at + 0.45, { duration: 0.25 });
  };

  // ------------------------------------------------------------------ 00 开场
  frame('open', null, ({ world, at }) => {
    const r = K.box(world, 'rule', 160, 352, 120, 8);
    r.style.background = 'var(--blue)';
    gsap.set(r, { scaleX: 0 });
    tl.to(r, { scaleX: 1, duration: 0.8, ease: 'expo.out' }, at(0.3));
    const t = K.lines(world, 't-hero', ['写作规则的三种强度']);
    t.style.cssText += 'position:absolute;left:160px;top:400px;';
    K.rise(t.inners, at(0.6), { duration: 1.1 });
    const s = K.box(world, 'op-sub', 160, 600, null, null, 'Praxis Kit · Write 分支 · 无配音知识讲解');
    K.show(s, at(2.4), { y: 14, duration: 0.8 });
    K.hide(world, at(5.5), { duration: 0.4 });
  });

  // ------------------------------------------------------------------ 01 改写
  frame('loss', ['01', '改写'], ({ root, world, at }) => {
    const g = K.svg(world);
    title(world, '改写会悄悄丢掉信息', at(0.3));
    const cA = K.box(world, 'lab', 160, 262, null, null, '原稿');
    const cB = K.box(world, 'lab', 1010, 262, null, null, '改写后');
    K.show([cA, cB], at(1.0), { y: 0, duration: 0.5, stagger: 0.1 });

    // row A: a hypothesis turned into a fact
    const aOrig = K.box(world, 'ls-orig', 160, 320, null, null, '<span class="lost" id="lossA">假设</span>演算里省下的33元');
    K.show(aOrig, at(1.8), { y: 20, duration: 0.8 });
    arrow(g, 820, 960, 366, at(3.4));
    const aNew = K.box(world, 'ls-new', 1010, 320, null, null, '<span class="gap" id="gapA">假设</span>演算里省下的33元');
    K.show(aNew, at(3.8), { y: 20, duration: 0.8 });
    const lostA = aOrig.querySelector('.lost'), gapA = aNew.querySelector('.gap');
    gsap.set(lostA, { backgroundColor: 'rgba(249,227,223,0)' });
    gsap.set(gapA, { borderColor: 'rgba(221,74,60,0)' });
    tl.to(lostA, { backgroundColor: 'rgba(249,227,223,1)', color: '#dd4a3c', duration: 0.4 }, at(4.7));
    tl.to(gapA, { borderColor: 'rgba(221,74,60,1)', duration: 0.4 }, at(4.7));
    const tagA = K.box(world, 'ls-tag', 1010, 402, null, null, '证据身份丢失，假设读作事实');
    K.show(tagA, at(5.3), { y: 10, duration: 0.5 });

    // row B: a qualifier turned into an assertion
    const bOrig = K.box(world, 'ls-orig', 160, 560, null, null, '自动错误<span class="lost">可能</span>少了');
    K.show(bOrig, at(7.2), { y: 20, duration: 0.8 });
    arrow(g, 820, 960, 606, at(8.6));
    const bNew = K.box(world, 'ls-new', 1010, 560, null, null, '自动错误<span class="chg">是</span>少了');
    K.show(bNew, at(9.0), { y: 20, duration: 0.8 });
    const lostB = bOrig.querySelector('.lost'), chg = bNew.querySelector('.chg');
    gsap.set(lostB, { backgroundColor: 'rgba(249,227,223,0)' });
    tl.to(lostB, { backgroundColor: 'rgba(249,227,223,1)', color: '#dd4a3c', duration: 0.4 }, at(9.9));
    tl.to(chg, { color: '#dd4a3c', duration: 0.4 }, at(9.9));
    const tagB = K.box(world, 'ls-tag', 1010, 642, null, null, '限定词丢失，可能写作断言');
    K.show(tagB, at(10.5), { y: 10, duration: 0.5 });

    const end = K.lines(world, 'ls-end', ['文字仍然通顺，<span class="blue">证据强度</span>已经变了']);
    end.style.cssText += 'position:absolute;left:160px;top:800px;';
    K.rise(end.inners, at(12.0), { duration: 0.9 });
    K.source(root, 'kit/write/prose/review.md · 常见偏差', at(1.8), at(14.4));
  });

  // ------------------------------------------------------------------ 02 底线
  frame('floor', ['02', '底线'], ({ root, world, at }) => {
    title(world, '底线：四条，任何语言、任何模式都守', at(0.3));
    const rows = [
      ['1', '事实', '不虚构、不歪曲任务给定的事实', 1.6],
      ['2', '逻辑', '指称前后一致，逻辑关系是真的：<br>先后不写成因果，并列不写成递进', 6.4],
      ['3', '确定性', '范围、条件和确定性照原样；<br>事实、推断、经验、建议与可能性不互相冒充', 11.0],
      ['4', '信息', '改写、摘要、重排不悄悄丢掉任务需要的信息与推理；<br>丢了就写明', 16.0],
    ];
    rows.forEach(([n, k, v, t], i) => {
      const y = 290 + i * 160;
      const h = K.box(world, 'hair', 160, y - 20, 1600, 2);
      gsap.set(h, { scaleX: 0 }); tl.to(h, { scaleX: 1, duration: 0.7, ease: 'power2.out' }, at(t - 0.2));
      const a = K.box(world, 'fl-n', 160, y, null, null, n);
      const b = K.box(world, 'fl-k', 240, y + 8, null, null, k);
      const c = K.box(world, 'fl-v', 480, y + 2, null, null, v);
      K.show([a, b], at(t), { y: 14, duration: 0.5, stagger: 0.08 });
      K.show(c, at(t + 0.5), { y: 14, duration: 0.7 });
    });
    const cb = K.box(world, 'fl-back', 480, 912, null, null, '上一幕的两例，违反的是第 3、4 条');
    K.show(cb, at(21.0), { y: 10, duration: 0.6 });
    K.source(root, 'kit/write/shared/evidence.md · 底线', at(1.6), at(23.4));
  });

  // ------------------------------------------------------------------ 03 强度
  frame('tiers', ['03', '强度'], ({ root, world, at }) => {
    title(world, '规则分三种强度', at(0.3));
    const tiers = [
      ['底线', '事实、逻辑、确定性、信息', '任何语言、任何模式', 1240, '#0d1826', 1.6],
      ['语言约定', '搭配、术语、表达习惯', '按输出语言取用，中文见成文原理', 1040, '#34435a', 8.0],
      ['编辑启发式与文体', '承重、主语、先答后说、语体、连贯、收尾', '对外中文技术成文的默认；按任务和读者调整', 840, '#5a6a82', 14.0],
    ];
    tiers.forEach(([name, does, when, w, fill, t], i) => {
      const y = 290 + i * 200;
      const band = K.box(world, '', 160, y, w, 170);
      band.style.background = fill;
      gsap.set(band, { scaleX: 0, transformOrigin: '0 50%' });
      tl.to(band, { scaleX: 1, duration: 0.8, ease: 'power3.out' }, at(t));
      const txt = K.box(world, 'tr-band', 160, y, w, 170, `<div class="tr-name">${name}</div><div class="tr-does">${does}</div>`);
      K.show(txt, at(t + 0.5), { y: 14, duration: 0.7 });
      const wh = K.box(world, 'tr-when', 160 + w + 30, y + 60, null, null, when);
      K.show(wh, at(t + 5.2), { x: -16, y: 0, duration: 0.7 });
    });
    const n = K.box(world, 'note', 160, 900, null, null, '宽度只表示适用范围由宽到窄，不按比例');
    K.show(n, at(21.0), { y: 10, duration: 0.6 });
    K.source(root, 'kit/write/README.md · 规则有三种强度', at(1.6), at(23.4));
  });

  // ------------------------------------------------------------------ 04 次序
  frame('order', ['04', '次序'], ({ root, world, at }) => {
    title(world, '要求冲突时，按次序裁决', at(0.3));
    const g = K.svg(world);
    const lab1 = K.box(world, 'lab', 160, 240, null, null, '优先');
    const lab2 = K.box(world, 'lab', 160, 852, null, null, '让位');
    const stem = K.path(g, 'M210,300 L210,830', 'ln soft');
    const head = K.path(g, 'M194,814 L210,832 L226,814', 'ln soft');
    K.show(lab1, at(1.0), { y: 0, duration: 0.5 });
    K.draw(stem, at(1.0), { duration: 1.2 }); K.draw(head, at(2.1), { duration: 0.3 });
    K.show(lab2, at(2.0), { y: 0, duration: 0.5 });
    const items = ['任务的准确、完整、可访问和交付约束', '本次明确的风格要求', '语言约定', '文体', '作者或品牌偏好', '通用启发式'];
    const ts = [2.6, 4.6, 6.2, 7.4, 8.6, 9.8];
    items.forEach((s, i) => {
      const r = K.box(world, 'or-row' + (i === 0 ? ' top' : ''), 270, 300 + i * 100, 1000, 86, `<b>${i + 1}</b>${s}`);
      K.show(r, at(ts[i]), { x: -30, y: 0, duration: 0.6 });
    });
    const end = K.lines(world, 'or-end', ['两条强要求不能同时满足时，<span>写明裁决</span>，不靠谁后加载来决定']);
    end.style.cssText += 'position:absolute;left:160px;top:928px;';
    K.rise(end.inners, at(13.2), { duration: 0.9 });
    K.source(root, 'kit/write/README.md · 规则有三种强度', at(2.6), at(17.4));
  });

  // ------------------------------------------------------------------ 05 原理
  frame('eight', ['05', '原理'], ({ root, world, at }) => {
    title(world, '成文原理八条，强度不一', at(0.3));
    const FILL = { 底线: '#0d1826', 语言约定: '#34435a', 编辑启发式: '#5a6a82' };
    const cards = [
      ['每个成分都承重', '编辑启发式'], ['对象作主语', '编辑启发式'], ['先回答，再说明', '编辑启发式'], ['证据强度不变', '底线'],
      ['按位置取形', '编辑启发式'], ['搭配用中文原生的说法', '语言约定'], ['连贯靠内容', '编辑启发式'], ['说完即止', '编辑启发式'],
    ];
    const grid = K.el(world, 'fill');
    const els = cards.map(([name, tier], i) => {
      const c = K.box(grid, 'ei-card', 160 + (i % 4) * 409, 290 + Math.floor(i / 4) * 300, 372, 270,
        `<div class="ei-no">${i + 1}</div><div class="ei-name">${name}</div><div class="ei-chip" style="background:${FILL[tier]}">${tier}</div>`);
      c.style.borderTopColor = FILL[tier];
      return c;
    });
    els.forEach((c, i) => K.show(c, at(1.4 + i * 1.4), { y: 24, duration: 0.6 }));
    const fn = K.box(grid, 'note', 160, 900, null, null, '第 5 条的位置取形跨语体适用；第 7 条中“关系是真的”属于底线');
    K.show(fn, at(14.0), { y: 10, duration: 0.6 });
    K.hide(grid, at(18.4), { duration: 0.5 });

    // one principle at work
    const hd = K.box(world, 'txt', 160, 270, null, null, '<b>第 2 条　对象作主语</b>');
    const l1 = K.box(world, 'lab', 160, 372, null, null, '改前');
    const from = K.box(world, 'ei-from', 160, 420, null, null, '首先形成的是这次事项的交付记录');
    const l2 = K.box(world, 'lab', 160, 600, null, null, '改后');
    const to = K.box(world, 'ei-to', 160, 648, null, null, '<em>律师</em>交付这份合同，完成的是客户A的委托');
    const note = K.box(world, 'txt', 160, 840, null, null, '内部结构被直译成了句子；让做事的人作主语');
    K.show(hd, at(19.2), { y: 14, duration: 0.6 });
    K.show([l1, from], at(20.4), { y: 14, duration: 0.7, stagger: 0.1 });
    strike(from, at(22.4), 0.7);
    K.show([l2, to], at(24.8), { y: 14, duration: 0.7, stagger: 0.1 });
    K.show(note, at(29.4), { y: 10, duration: 0.7 });
    K.source(root, 'kit/write/prose/grammar.md · 原理与强度', at(1.4), at(18.4));
    K.source(root, 'kit/write/prose/review.md · 常见偏差', at(19.2), at(35.4));
  });

  // ------------------------------------------------------------------ 06 审阅
  frame('review', ['06', '审阅'], ({ root, world, at }) => {
    title(world, '审阅查句式，也单独查结构位置', at(0.3));
    const div = K.box(world, 'hair', 960, 270, 2, 640);
    div.style.transformOrigin = '50% 0';
    gsap.set(div, { scaleY: 0, scaleX: 1 }); tl.to(div, { scaleY: 1, duration: 0.8, ease: 'power2.out' }, at(1.0));

    // left: pattern counts
    const h1 = K.box(world, 'rv-h', 160, 270, null, null, '句式出现次数');
    const list = K.box(world, 'note', 160, 330, 740, null, '对照否定、短句收尾、自问自答、数目预告、对称排比');
    K.show(h1, at(2.2), { y: 12, duration: 0.6 }); K.show(list, at(4.2), { y: 12, duration: 0.7 });
    const legend = K.box(world, '', 160, 440, null, null,
      '<div class="rv-leg"><i style="background:#aab4c3"></i>改稿前<i style="background:#0d1826;margin-left:30px"></i>改稿后</div>');
    K.show(legend, at(5.4), { y: 8, duration: 0.5 });
    const BX = 340, PX = 24;
    const axis = K.box(world, '', BX - 2, 500, 2, 330); axis.style.background = 'var(--ink3)';
    gsap.set(axis, { scaleY: 0, transformOrigin: '50% 0' }); tl.to(axis, { scaleY: 1, duration: 0.6 }, at(5.6));
    const data = [['对照否定', 14, 2, 520, 6.0], ['短句收尾', 19, 5, 690, 9.0]];
    data.forEach(([cat, a, b, y, t]) => {
      const c = K.box(world, 'rv-cat', 160, y + 36, null, null, cat);
      K.show(c, at(t), { y: 8, duration: 0.5 });
      [[a, '#aab4c3', y, t + 0.3], [b, '#0d1826', y + 62, t + 1.6]].forEach(([v, col, yy, tt]) => {
        const bar = K.box(world, 'rv-bar', BX, yy, v * PX, 50); bar.style.background = col;
        gsap.set(bar, { scaleX: 0 }); tl.to(bar, { scaleX: 1, duration: 0.9, ease: 'power3.out' }, at(tt));
        const val = K.box(world, 'rv-val', BX + v * PX + 16, yy + 6, null, null, `${v}<span>段</span>`);
        K.show(val, at(tt + 0.7), { y: 0, x: -8, duration: 0.4 });
      });
    });
    const fn = K.box(world, 'note', 160, 850, 740, null, '一条知识片旁白改稿前后各数一次；审阅由模型完成');
    K.show(fn, at(13.8), { y: 10, duration: 0.7 });

    // right: structural positions
    const h2 = K.box(world, 'rv-h', 1020, 270, null, null, '结构位置单独审阅');
    const n2 = K.box(world, 'note', 1020, 330, 740, null, '标题、表头、标签、图注，按位置类别排在一起');
    K.show(h2, at(18.0), { y: 12, duration: 0.6 }); K.show(n2, at(18.8), { y: 12, duration: 0.7 });
    const c1 = K.box(world, 'rv-col', 1020, 450, null, null, '改稿前'), c2 = K.box(world, 'rv-col', 1420, 450, null, null, '改稿后');
    K.show([c1, c2], at(20.6), { y: 0, duration: 0.5, stagger: 0.1 });
    const g = K.svg(world);
    const rows = [['要证明什么', '待证明的结论', false, 21.6], ['比较方法', '比较方法', true, 24.4], ['足以支持什么判断', '可以支持的判断', false, 26.4]];
    rows.forEach(([f, t, same, tt], i) => {
      const y = 520 + i * 100;
      const fe = K.box(world, 'rv-from', 1020, y, null, null, f);
      const te = K.box(world, 'rv-to' + (same ? ' same' : ''), 1420, y, null, null, t);
      K.show(fe, at(tt), { y: 12, duration: 0.6 });
      arrow(g, 1346, 1396, y + 24, at(tt + 0.7));
      K.show(te, at(tt + 1.0), { y: 12, duration: 0.6 });
      if (!same) strike(fe, at(tt + 0.5), 0.5);
    });
    const fn2 = K.box(world, 'note', 1020, 850, 740, null, '同类位置形式并列，不从正文截句子');
    K.show(fn2, at(28.6), { y: 10, duration: 0.6 });
    K.source(root, 'kit/write/prose/review.md · 执行次序、审阅裁决记录', at(2.2), at(32.4));
  });

  // ------------------------------------------------------------------ 07 换媒介
  frame('media', ['07', '换媒介'], ({ root, world, at }) => {
    title(world, '换媒介或改篇幅，先分清动了什么', at(0.3));
    const rows = [
      ['投影', '只改排列和外观，<br>文字与数值不动', '能', 'yes', 2.8],
      ['改编', '删减、概括或重排，<br>主张和限定应当还在', '不能；附变动说明', 'no', 7.6],
      ['新增', '加进原稿没有的解释、<br>类比或推论', '不能；标明来路', 'no', 12.2],
    ];
    rows.forEach(([name, does, chip, kind, t], i) => {
      const y = 290 + i * 170;
      const h = K.box(world, 'hair', 160, y - 20, 1600, 2);
      gsap.set(h, { scaleX: 0 }); tl.to(h, { scaleX: 1, duration: 0.7 }, at(t - 0.2));
      const a = K.box(world, 'md-name', 160, y + 4, null, null, name);
      const b = K.box(world, 'md-does', 400, y + 4, 800, null, does);
      const c = K.box(world, 'md-chip ' + kind, 1300, y + 22, null, null, chip);
      K.show(a, at(t), { y: 14, duration: 0.5 });
      K.show(b, at(t + 0.6), { y: 14, duration: 0.7 });
      K.show(c, at(t + 2.2), { y: 0, x: -14, duration: 0.6 });
    });
    const cl = K.box(world, 'lab', 1300, 218, null, null, '能否说内容没有变');
    K.show(cl, at(4.8), { y: 0, duration: 0.5 });
    const lb = K.box(world, 'lab', 160, 832, null, null, '变动说明写四件事');
    K.show(lb, at(16.8), { y: 0, duration: 0.5 });
    const four = ['保留的主张与限定', '删改的内容', '删改的原因', '看不到的人与内容'];
    let x = 160;
    four.forEach((s, i) => {
      const w = [300, 200, 200, 270][i];
      const e = K.box(world, 'md-four', x, 884, null, null, s);
      x += w + 20;
      K.show(e, at(17.8 + i * 0.9), { y: 10, duration: 0.5 });
    });
    K.source(root, 'kit/write/shared/evidence.md · 从来源到表达', at(2.8), at(22.4));
  });

  // ------------------------------------------------------------------ 08 验收
  frame('check', ['08', '验收'], ({ root, world, at }) => {
    title(world, '验收核对实际输出', at(0.3));
    const heads = [['输出', 160], ['必须实际核对', 440], ['不足以证明完成', 1150]];
    const hs = heads.map(([s, x]) => K.box(world, 'ck-h', x, 262, null, null, s));
    K.show(hs, at(1.4), { y: 0, duration: 0.5, stagger: 0.1 });
    const rows = [
      ['正文', '主张、条件、术语与改写前一致，<br>段落关系可理解', '字数变少或句子更短', 5.0],
      ['HTML', '宽窄布局、键盘、状态、<br>实际要求的断网与打印', '文件已生成、仅源码可读', 10.8],
      ['PDF / Slides', '最终导出逐页阅读，<br>引用、表格可读，内容未截断', '只检查编辑器', 16.6],
      ['Motion', '按实际速度观看全片，检查文字驻留、<br>音画同步及来源配套', '联络表或单帧截图', 22.4],
    ];
    rows.forEach(([o, d, n, t], i) => {
      const y = 320 + i * 150;
      if (i === 3) {
        const m = K.box(world, 'ck-mark', 120, y - 14, 1680, 140);
        K.show(m, at(t - 0.3), { y: 0, duration: 0.5 });
      } else {
        const h = K.box(world, 'hair', 160, y - 14, 1600, 2);
        gsap.set(h, { scaleX: 0 }); tl.to(h, { scaleX: 1, duration: 0.6 }, at(t - 0.2));
      }
      const a = K.box(world, 'ck-out', 160, y + 4, null, null, o);
      const b = K.box(world, 'ck-do', 440, y + 2, 680, null, d);
      const c = K.box(world, 'ck-no', 1150, y + 2, 610, null, n);
      K.show(a, at(t), { y: 12, duration: 0.5 });
      K.show(b, at(t + 0.5), { y: 12, duration: 0.7 });
      K.show(c, at(t + (i === 3 ? 4.0 : 2.4)), { y: 12, duration: 0.7 });
    });
    const nt = K.box(world, 'txt', 160, 934, null, null, '<span class="blue">单帧查构图，联络表查前后对应，整段播放才查节奏和同步</span>');
    nt.style.fontSize = '32px';
    K.show(nt, at(28.0), { y: 10, duration: 0.7 });
    K.source(root, 'kit/write/shared/verification.md · 按输出检查；kit/design/motion/grammar.md · 时间叙事', at(5.0), at(31.4));
  });

  // ------------------------------------------------------------------ 09 结尾
  frame('end', null, ({ world, at }) => {
    const lines = [['底线不变', '#0d1826'], ['约定随语言', '#34435a'], ['启发式随任务', '#5a6a82']];
    lines.forEach(([s, col], i) => {
      const e = K.box(world, 'en-t', 160, 250 + i * 110, null, null, `<i style="background:${col}"></i>${s}`);
      K.show(e, at(1.0 + i * 1.2), { y: 18, duration: 0.8 });
    });
    const p = K.box(world, 'en-path', 160, 700, null, null, 'kit/write/README.md');
    K.show(p, at(4.6), { y: 12, duration: 0.7 });

    const rule = K.box(world, 'hair', 980, 232, 780, 2);
    gsap.set(rule, { scaleX: 0 }); tl.to(rule, { scaleX: 1, duration: 0.7 }, at(9.0));
    const h = K.box(world, 'en-h', 980, 250, null, null, '本片是改编，变动如下');
    K.show(h, at(9.3), { y: 12, duration: 0.6 });
    const rows = [
      ['保留', '强度分层、冲突次序、八条原理、<br>审阅查法、改写分类、验收分法', 10.4],
      ['删改', '专门文体、格式检查、展项职责、<br>各条的例外；措辞有缩略', 15.2],
      ['原因', '片长', 19.6],
      ['新增', '示例与底线条号的对应，为本片所加', 20.6],
      ['看不到', '读者看不到各条的来源与审阅记录', 25.2],
      ['状态', '未经受众测试，待人按实际速度看完', 29.8],
    ];
    let y = 340;
    rows.forEach(([k, v, t]) => {
      const a = K.box(world, 'en-k', 980, y, null, null, k);
      const b = K.box(world, 'en-v', 1130, y, 630, null, v);
      K.show([a, b], at(t), { y: 12, duration: 0.6, stagger: 0.1 });
      y += Math.ceil(v.length / 19) * 50 + 24;
    });
  });
})();
