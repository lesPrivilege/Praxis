/* 00 一份不讲编程的书单 — overview.
   Five scenes on the body: the five readings, where the list comes from, the field job, what blocks
   it, and the reasons people gave. In the standalone episode the last scene runs on through the outro,
   so the series map that closes the body is the same object that hands over to episode 01.
   Solid outlines and lines: stated by a source; grey solid: an account that does not support the list.
   Dashed: this series' own reading, always labelled 本系列的读法. Quotes carry no locator of their own:
   the source line at the bottom left names the source and carries the claim IDs.
   Adjacent scenes cross-fade: the incoming scene starts fading in 0.1 s before the outgoing one fades.
   Camera (film/camera.js): the books and the reasons are composed by hand and only drift; the other three
   are framed, with set framings where pieces arrive one by one and two push-ins on the line that matters. */
Series.unit('ov', ({ T, tl, has, u, chrome }) => {
  const BLUE = '#1f4fe0', INK = '#0d1826', INK2 = '#3a4658', INK3 = '#7d8a9c', PAPER = '#f2f4f7';
  const AB = 'Agrawal 与 Blumenfeld-Gantz';
  const QURESHI = 'Nabeel Qureshi, Reflections on Palantir, 2024';
  const BOOKS = [
    { key: 'im', title: 'Impro', gloss: '即兴戏剧', at: ['ov.b2', '即兴戏剧'] },
    { key: 'lt', title: 'The Looming Tower', gloss: '九一一前史', at: ['ov.b2', '九一一事件'] },
    { key: 'iu', title: 'Interviewing Users', gloss: '用户访谈', at: ['ov.b2', '访谈用户'] },
    { key: 'gtd', title: 'Getting Things Done', gloss: '个人事务管理', at: ['ov.b2', '管住手上'] },
    { key: 'pr', title: 'Principles', gloss: '决策与原则', at: ['ov.b2', '一份'], pdf: true },
  ];

  const toColor = (els, c, at, d) => tl.to(els, { color: c, duration: d || 0.35, ease: 'power2.out' }, at);
  // dim or undim something already on screen: explicit start values, because the boot pass would record a hidden start
  const fade = (els, a, b, at, d) =>
    tl.fromTo(els, { opacity: a }, { opacity: b, duration: d || 0.5, ease: 'power2.inOut', immediateRender: false }, at);

  /* A scene on paper that fades in over the one before it. Returns the chapter tag. */
  function open(root, title, from) {
    root.classList.add('paper');
    K.el(root, 'grain');
    const c = chrome(root, title);
    gsap.set(root, { opacity: 0 });
    tl.to(root, { opacity: 1, duration: 0.4, ease: 'power2.out' }, from);
    return c;
  }
  const close = (root, at) => tl.to(root, { opacity: 0, duration: 0.4, ease: 'power2.in' }, at);

  /* Phrases of a ledger quotation wrapped in spans, so they can be lit when the narration reaches them.
     A phrase that is not in the ledger text stops the stage. */
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
      s.className = 'ov-mk';
      s.textContent = p;
      e.appendChild(s);
      out.push(s);
      pos = i + p.length;
    }
    e.appendChild(document.createTextNode(text.slice(pos)));
    return out;
  }

  /* A phrase lit while the narration says it (K.lit: blue, a rule drawn under it). At `back` it returns to its
     own colour and the rule stays under it in that colour, a trace of what has been said. */
  function say(spans, at, back, dur) {
    const base = spans.map(s => getComputedStyle(s).color);
    K.lit(spans, at, dur ? { duration: dur } : undefined);
    if (back != null) spans.forEach((s, i) => tl.to(s, { color: base[i], duration: 0.5, ease: 'power2.inOut' }, back));
  }

  /* One framing held over a span, so pieces that arrive one by one land in a frame that is already set. */
  const frame = (root, x, y, w, h, from, to) => K.frame(root, x, y, x + w, y + h, from, to);

  /* A straight connector with an arrowhead; the head is drawn once the line has arrived. */
  function arrow(sv, x1, y, x2, cls) {
    const line = K.path(sv, `M${x1},${y} L${x2},${y}`, cls || 'ln');
    const head = K.path(sv, `M${x2 - 16},${y - 10} L${x2},${y} L${x2 - 16},${y + 10}`, cls || 'ln');
    return [line, head];
  }
  function drawArrow(a, at, dur) {
    K.draw(a[0], at, { duration: dur });
    K.draw(a[1], at + dur * 0.85, { duration: 0.2 });
  }

  /* A row of five reading cards; the PDF is drawn as a sheet, the books as covers without art. */
  function cards(root, y, h, cls) {
    const W = 280, gap = 30, x0 = (1920 - (5 * W + 4 * gap)) / 2;
    return BOOKS.map((b, i) => {
      const c = K.box(root, 'ov-card ' + (b.pdf ? 'pdf ' : '') + (cls || ''), x0 + i * (W + gap), y, W, h);
      c.parts = [K.el(c, 'ov-card-title', b.title), K.el(c, 'ov-card-gloss', `<span>${b.gloss}</span>`)];
      if (b.pdf) K.el(c, 'ov-card-fold');
      c.dataset.book = b.key;
      return c;
    });
  }

  // scene changes: the outgoing scene starts fading here, the incoming one 0.1 s earlier
  const X1 = T('ov.b4') + 0.3;
  const X2 = T('ov.b7', 'end') + 0.5;
  const X3 = T('ov.b11', 'end') + 0.5;
  const X4 = T('ov.b13', 'end') + 0.5;

  // ---------------------------------------------------------------- 五份读物
  Film.scene('ov-books', u.bodyStart - 0.2, X1 + 0.4, ({ root, from }) => {
    open(root, '五份读物', from);
    root.dataset.cam = 'drift';
    // who: one block that opens large in the middle of the frame and settles into the header when the books arrive
    const who = K.box(root, 'ov-who', 200, 395, 1520, null);
    const name = K.el(who, 'ov-who-name serif', 'Nabeel Qureshi');
    const meta = K.el(who, 'ov-who-meta', '<span>2015 年夏入职 Palantir</span> <span>· forward deployed engineer（FDE）</span>');
    const gloss = K.el(who, 'ov-who-gloss', 'FDE · 驻在客户现场写软件的工程师');
    K.show(name, T('ov.b1') - 0.05, { y: 24, duration: 0.8 });
    K.show(meta.children[0], T('ov.b1', '进了') - 0.2, { y: 12, duration: 0.6 });
    K.show(meta.children[1], T('ov.b1', '做') - 0.15, { y: 12, duration: 0.6 });
    K.show(gloss, T('ov.b1', '就是') - 0.15, { y: 12, duration: 0.6 });
    tl.to(who, { y: 170 - 395, scale: 0.7, duration: 1.3, ease: 'power2.inOut' }, T('ov.b1', '刚入职') - 0.2);
    fade(who, 1, 0.5, T('ov.b2') - 0.1, 0.8);
    // four empty outlines when the four books are mentioned, centred; each fills as it is named.
    // The PDF arrives as a fifth sheet: the four make room for it, and its gloss and title come with their words.
    const cs = cards(root, 440, 330);
    const outlines = T('ov.b1', '四本书') - 0.15;
    BOOKS.forEach((b, i) => {
      const c = cs[i];
      if (b.pdf) {
        K.show(c, T(...b.at) - 0.15, { y: 30, duration: 0.7 });
        K.show(c.parts[1], T('ov.b2', '一套原则') - 0.15, { y: 12, duration: 0.6 });
        K.show(c.parts[0], T('ov.b2', '就是') - 0.15, { y: 12, duration: 0.6 });
        return;
      }
      gsap.set(c, { x: 155 });
      K.show(c, outlines + i * 0.08, { y: 30, duration: 0.7 });
      K.show(c.parts, T(...b.at) - 0.15, { y: 14, duration: 0.6, stagger: 0.08 });
    });
    tl.to(cs.slice(0, 4), { x: 0, duration: 1.0, ease: 'power2.inOut', stagger: 0.03 }, T('ov.b2', '一份') - 0.55);
    // none of them: a rule runs under the five subjects, then the count lands
    K.lit(cs.map(c => c.parts[1].firstChild), T('ov.b3') - 0.1, { color: INK, duration: 0.45 });
    const none = K.box(root, 'ov-none', 200, 822, 1520, null, '<span>其中讲编程的</span><b class="t-num">0</b>');
    K.show(none.children[0], T('ov.b3', '没有') - 0.15, { y: 16, duration: 0.6 });
    K.show(none.children[1], T('ov.b3', '讲编程') - 0.1, { y: 0, scale: 0.55, duration: 0.8, ease: 'expo.out' });
    K.source(root, QURESHI, T('ov.b1') + 1, X1, ['ov.list_qureshi_four_books', 'ov.list_qureshi_principles_pdf']);
    close(root, X1);
  });

  // ---------------------------------------------------------------- 书单来历
  Film.scene('ov-provenance', X1 - 0.1, X2 + 0.4, ({ root, from }) => {
    open(root, '书单来历', from);
    // Qureshi's own sentence alone, centred; the camera leans in when the narration reaches his hedge
    const q = K.quote(root, 'ov.list_qureshi_four_books', 340, 0, 1240, { size: 44 });
    q.root.style.top = Math.round(540 - q.root.offsetHeight / 2) + 'px';
    gsap.set(q.root, { transformOrigin: '0 0' });
    const hedge = [...marks(q.en, ['I’m not sure if they still do this']), ...marks(q.zh, ['我不确定他们现在是否还这样做'])];
    K.show(q.root, from + 0.2, { y: 20 });
    const lean = T('ov.b4', '不确定') - 0.15;
    K.focus(q.root, lean, T('ov.b5') - 0.5, { zoom: 1.4, pad: 40 });
    K.focus(q.root, from, lean, { zoom: 1, pad: 40 });
    say(hedge, T('ov.b4', '不确定') - 0.1);
    K.source(root, QURESHI, from + 0.4, T('ov.b5') - 0.6, ['ov.list_qureshi_four_books']);
    // who said what: the table is ruled first, then each account fills its row as the narration names it.
    // The quote folds into the first row: the same account, now one line among the others.
    const R0 = 262, ROW = 84;
    const verdict = T('ov.b7', '能站得住') - 0.3;
    frame(root, 176, 200, 1544, 560, T('ov.b5') - 0.5, verdict);
    frame(root, 176, 200, 1544, 750, verdict, X2 + 0.4);
    tl.to(q.root, { x: 200 - 340, y: R0 + 8 - q.root.offsetTop, scale: 0.3, autoAlpha: 0, duration: 0.8, ease: 'power2.inOut' }, T('ov.b5') - 0.6);
    const head = K.box(root, 'ov-tab-head', 200, 200, 1520, null,
      '<span>来源</span><span>入职</span><span>提到的读物</span><span>说法</span><span>写于</span>');
    K.show(head, T('ov.b5') - 0.3, { y: 0, duration: 0.4 });
    const ROWS = [
      { cls: '', cells: ['Nabeel Qureshi', '2015', '四本书 · 一份 PDF', '<b class="ov-hot">入职时寄来四本</b> · 另有 PDF', '2024'], a: T('ov.b5') - 0.1, b: T('ov.b5') - 0.1 },
      { cls: '', cells: ['Ted Mabrey', '2010', 'Impro', '多年来入职即发', '2025'], a: T('ov.b5', '负责全球商务') - 0.2, b: T('ov.b5', '很多年里') - 0.15 },
      { cls: '', cells: [AB, '2013 / 2014', 'The Looming Tower', '<b class="ov-hot">必读</b>', '2024'], a: T('ov.b5', '前员工') - 0.1, b: T('ov.b5', '是必读') - 0.2 },
      { cls: '', cells: ['Sanjay Saraf', '2015', 'Getting Things Done', '<b class="ov-hot">先是推荐，后来必读</b>', '2024'], a: T('ov.b5', '前员工', 1) - 0.1, b: T('ov.b5', '先是') - 0.2 },
      { cls: 'grey', cells: ['匿名留言', '—', '—', '<b class="ov-hot">因岗位而定 · 均为选读</b>', '2016'], a: T('ov.b6', '匿名留言') - 0.2, b: T('ov.b6', '看岗位') - 0.15 },
      { cls: 'grey', cells: ['Palantir 官网入职页', '—', '—', '未提及书', '未注日期'], a: T('ov.b6', '官网') - 0.2, b: T('ov.b6', '没有提到') - 0.15 },
    ];
    const rules = ROWS.map((r, i) => K.box(root, 'ov-tab-rule', 200, R0 + i * ROW, 1520, 2));
    gsap.set(rules, { scaleX: 0, transformOrigin: '0 50%' });
    tl.to(rules, { scaleX: 1, duration: 0.7, ease: 'power3.inOut', stagger: 0.06 }, T('ov.b5') - 0.4);
    const rows = ROWS.map((r, i) => {
      const row = K.box(root, 'ov-tab-row ' + r.cls, 200, R0 + i * ROW, 1520, 72, r.cells.map(c => `<span>${c}</span>`).join(''));
      const sp = [...row.children];
      K.show(sp.slice(0, 2), r.a, { y: 12, duration: 0.5, stagger: 0.05 });
      K.show(sp.slice(2), r.b, { y: 12, duration: 0.5, stagger: 0.06 });
      return row;
    });
    // what holds: a bracket gathers the four who joined 2010–2015, then the verdict; the wording each used
    // is lit as the narration names it and keeps a rule under it
    const sv = K.svg(root, 'ov-bracket');
    const br = K.path(sv, `M192,${R0 + 6} L176,${R0 + 6} L176,${R0 + 3 * ROW + 66} L192,${R0 + 3 * ROW + 66}`, 'ln');
    K.draw(br, T('ov.b7', '能站得住') - 0.3, { duration: 0.7 });
    const holds = K.box(root, 'ov-verdict', 200, 800, 740, 150, '<b>可以确认</b><span>2010–2015 年入职的几位，提到过其中几本</span>');
    const none = K.box(root, 'ov-verdict open', 980, 800, 740, 150, '<b>未找到依据</b><span>一份公司正式发布的书单</span>');
    K.show(holds, T('ov.b7', '能站得住') + 0.1, { y: 16 });
    [[0, '寄来的'], [2, '必读'], [3, '必读'], [4, '选读']].forEach(([i, w]) => {
      const at = T('ov.b7', w) - 0.1;
      say([rows[i].querySelector('.ov-hot')], at, at + 1.0);
    });
    K.show(none, T('ov.b7', '正式的书单') - 0.2, { y: 16 });
    K.source(root, `Qureshi 2024 · Mabrey 2025 · Stratechery 2023 · ${AB} 2024 · Saraf 2024 · HN 2016 · Life at Palantir`, T('ov.b5'), X2,
      ['ov.list_qureshi_four_books', 'ov.list_qureshi_principles_pdf', 'ov.mabrey_impro_given_on_joining', 'ov.agrawal_looming_mandatory',
        'ov.saraf_gtd_mandated', 'ov.hn_2016_optional_by_role', 'ov.official_pages_silent_on_books', 'ov.cohort_and_dates', 'ov.mabrey_stratechery_secret']);
    close(root, X2);
  });

  // ---------------------------------------------------------------- 驻场工作
  Film.scene('ov-field', X2 - 0.1, X3 + 0.4, ({ root, from }) => {
    open(root, '驻场工作', from);
    // a week: Monday to Wednesday at the customer, Thursday sometimes, Friday not said
    const week = K.box(root, 'ov-week', 200, 330, 1520, 300);
    const wlab = K.box(week, 'ov-week-lab', 0, 0, 1520, null, 'FDE 的一周 · 三四天在客户现场');
    const days = ['周一', '周二', '周三', '周四', '周五'].map((d, i) => {
      const c = K.box(week, 'ov-day' + (i === 3 ? ' part' : ''), i * 312, 76, 280, 220);
      const fill = i < 4 ? K.el(c, 'ov-day-fill') : null;
      const name = K.el(c, 'ov-day-name', d);
      // Friday keeps an empty line so its name sits where the others do
      const where = K.el(c, 'ov-day-where' + (i < 4 ? '' : ' blank'), i < 4 ? '客户现场' : '&nbsp;');
      return { c, fill, name, where };
    });
    // already in place as the scene fades in, so the cross-fade never passes through an empty frame
    K.show(wlab, from, { y: 10, duration: 0.5 });
    K.show(days.map(d => d.c), from + 0.05, { y: 20, duration: 0.6, stagger: 0.05 });
    const on = T('ov.b8', '三四天') - 0.2;
    days.slice(0, 3).forEach((d, i) => {
      K.show(d.fill, on + i * 0.1, { y: 0, duration: 0.4 });
      toColor(d.name, PAPER, on + i * 0.1);
      K.show(d.where, on + i * 0.1 + 0.1, { y: 6, duration: 0.4 });
    });
    K.show([days[3].fill, days[3].where], T('ov.b8', '四天') - 0.1, { y: 0, duration: 0.4 });
    tl.to(week, { autoAlpha: 0, y: -30, duration: 0.4 }, T('ov.b9') - 0.3);
    // Airbus, Toulouse: the facts come one by one with their words
    const fig = K.figure(root, 'ov.a350-fal-toulouse-bernd-k', 120, 170, 1060, 700, { pos: '50% 55%' });
    const cap = K.box(root, 'ov-figcap', 120, 890, 1060, null, '图卢兹 · Airbus A350 总装线');
    K.show(fig, T('ov.b9') - 0.05, { y: 0, scale: 1.02, duration: 0.9 });
    K.show(cap, T('ov.b9', '客户是') + 0.5, { y: 8 });
    const fact = K.box(root, 'ov-facts', 1240, 200, 560, null,
      '<div><b>一年</b><span>住在图卢兹</span></div><div><b>每周四天</b><span>在工厂</span></div>');
    K.show(fact.children[0], T('ov.b9', '图卢兹') - 0.1, { y: 14 });
    K.show(fact.children[1], T('ov.b9', '一周四天') - 0.1, { y: 14 });
    const ceo = K.box(root, 'ov-ceo', 1240, 420, 560, null, '<span>CEO 的头号难题</span><b>A350 产量爬坡</b>');
    K.show(ceo, T('ov.b9', '首席执行官') - 0.1, { y: 12 });
    K.show(ceo.children[1], T('ov.b9', '产量') - 0.2, { y: 10 });
    const PY = 770;
    const chips = ['工单', '缺件', '质量问题'].map((t, i) => K.box(root, 'ov-chip', 1240 + (i % 2) * 280, 590 + Math.floor(i / 2) * 90, 250, 70, t));
    const panel = K.box(root, 'ov-panel', 1240, PY, 560, 150, '<b>同一个界面</b><span>各组工作互相可见</span>');
    K.show(chips, T('ov.b9', '工单') - 0.2, { y: 14, stagger: 0.12 });
    chips.forEach((c, i) => tl.to(c, { x: 1255 - c.offsetLeft + i * 12, y: PY + 15 - c.offsetTop + i * 6, autoAlpha: 0, duration: 0.8, ease: 'power3.inOut' }, T('ov.b9', '同一个界面') - 0.2 + i * 0.06));
    K.show(panel, T('ov.b9', '同一个界面') + 0.2, { y: 10 });
    K.source(root, QURESHI, T('ov.b8') + 0.4, T('ov.b9') - 0.3, ['ov.qureshi_fde_onsite_days']);
    K.source(root, QURESHI, T('ov.b9') + 0.1, T('ov.b9', 'end') + 0.2, ['ov.airbus_toulouse_a350']);
    // the photo leaves as its sentence ends, before the camera moves to the next block: the caption goes first
    tl.to(cap, { autoAlpha: 0, duration: 0.4 }, T('ov.b9', 'end') - 0.2);
    tl.to([fig, fact, ceo, panel], { autoAlpha: 0, duration: 0.5 }, T('ov.b9', 'end'));
    // context is that which is scarce: who said it, the line, then what it means. The camera rests on the whole
    // layout, leans in on the line while it is said, and pulls back to show the two ways of knowing a customer.
    const cw = K.box(root, 'ov-cw', 410, 0, 1100, null);
    const spk = K.el(cw, 'ov-speaker', 'Qureshi 引经济学家 Tyler Cowen');
    const cq = K.quote(cw, 'ov.qureshi-cowen-line', 0, 0, 1100, { size: 48 });
    Object.assign(cq.root.style, { position: 'relative', left: '', top: '', marginTop: '28px' });
    const sayEn = marks(cq.en, ['context is that which is scarce']);
    const sayZh = marks(cq.zh, ['情境才是稀缺的东西']);
    const GAP = 56, BH = 210, total = cw.offsetHeight + GAP + BH, top = Math.round(540 - total / 2), by = top + cw.offsetHeight + GAP;
    cw.style.top = top + 'px';
    K.show(spk, T('ov.b9', 'end') + 0.15, { y: 10 });
    K.show(cq.en, T('ov.b10', '经济学家') + 0.15, { y: 16 });
    K.show(cq.zh, T('ov.b10', '稀缺') - 0.1, { y: 12 });
    const near = K.box(root, 'ov-two', 200, by, 740, BH, '<b>人在客户现场</b><span>实际做法的隐性知识</span>');
    const far = K.box(root, 'ov-two far', 980, by, 740, BH, '<b>隔着一层</b><span>压平的需求清单</span>');
    const back = T('ov.b10', '客户现场') - 0.1;
    say(sayEn, T('ov.b10', '一句话', 0, 0.5), back, 2.0);
    say(sayZh, T('ov.b10', '稀缺') + 0.2, back, 1.0);
    K.show(near, back, { y: 16 });
    K.show(far, T('ov.b10', '需求清单') - 0.5, { y: 16 });
    const push = T('ov.b10', '一句话') + 0.3;
    K.focus(cw, push, back - 0.2, { zoom: 1.5, pad: 40 });
    frame(root, 200, top, 1520, total, T('ov.b10') - 0.4, push);
    frame(root, 200, top, 1520, total, back - 0.2, T('ov.b11') - 0.4);
    K.source(root, QURESHI, T('ov.b10') + 0.3, T('ov.b10', 'end') + 0.2, ['ov.qureshi-cowen-line', 'ov.qureshi-cowen']);
    tl.to([cw, near, far], { autoAlpha: 0, y: -20, duration: 0.5 }, T('ov.b11') - 0.3);
    // field to product to other customers; the product team lights when the narration says whose job it is.
    // Framed at 1.0 around the stage centre, the framing the next scene opens with, so the FDE node holds across the cut.
    frame(root, 150, 420, 1620, 200, T('ov.b11') - 0.4, X3 + 0.4);
    const sv = K.svg(root, 'ov-loop');
    const fde = K.box(root, 'ov-node', 200, 420, 480, 200, '<b>FDE · 现场</b><span>解决具体问题，不求通用</span>');
    const pd = K.box(root, 'ov-node', 830, 420, 480, 200, '<b>产品团队</b><span>做成通用产品</span>');
    const other = K.box(root, 'ov-node plain', 1460, 470, 260, 100, '<b>别的客户</b>');
    const a1 = arrow(sv, 692, 520, 818), a2 = arrow(sv, 1322, 520, 1448);
    K.show(fde, T('ov.b11') + 0.1, { y: 16 });
    K.show(fde.children[1], T('ov.b11', '不用操心') - 0.2, { y: 8 });
    drawArrow(a1, T('ov.b11', '做成通用') - 0.2, 0.6);
    K.show(pd, T('ov.b11', '产品') - 0.3, { y: 16 });
    drawArrow(a2, T('ov.b11', '别的客户') - 0.4, 0.4);
    K.show(other, T('ov.b11', '别的客户') - 0.2, { y: 10 });
    tl.to(pd, { borderColor: BLUE, duration: 0.4, ease: 'power2.out' }, T('ov.b11', '产品团队') - 0.15);
    toColor(pd.children[0], BLUE, T('ov.b11', '产品团队') - 0.15);
    K.source(root, QURESHI, T('ov.b11') + 0.3, T('ov.b11', 'end') + 0.4, ['ov.qureshi_overfit_split']);
    close(root, X3);
  });

  // ---------------------------------------------------------------- 组织阻力
  Film.scene('ov-friction', X3 - 0.1, X4 + 0.4, ({ root, from }) => {
    open(root, '组织阻力', from);
    // the FDE node stands where the last scene left it; it reaches for the data and a wall comes down
    frame(root, 176, 285, 1568, 470, from, T('ov.b13') - 0.3);
    const sv = K.svg(root, 'ov-gate');
    const fde = K.box(root, 'ov-node', 200, 420, 480, 200, '<b>FDE</b><span>接入客户数据</span>');
    const src = [0, 1, 2].map(i => K.box(root, 'ov-src', 1340, 300 + i * 165, 380, 110, `<b>数据源</b>`));
    const reach = K.path(sv, 'M692,520 L1328,520', 'ln');
    const gate = K.path(sv, 'M1180,290 L1180,750', 'ln red');
    const keeper = K.box(root, 'ov-keeper', 980, 772, 400, null, '守着数据源的团队');
    const tech = K.box(root, 'ov-tag', 200, 664, 600, null, '难处 · <span class="ov-tech">技术</span><span class="ov-strike"></span>');
    const pol = K.box(root, 'ov-tag', 200, 732, 900, null, '难处 · 往往是组织政治');
    // only 技术 is struck: the rule draws through it once the narration has said 不是
    const word = tech.querySelector('.ov-tech'), strike = tech.querySelector('.ov-strike');
    Object.assign(strike.style, { left: word.offsetLeft + 'px', top: Math.round(word.offsetTop + word.offsetHeight * 0.52) + 'px', width: word.offsetWidth + 'px' });
    gsap.set(strike, { scaleX: 0, transformOrigin: '0 50%' });
    K.show(tech, T('ov.b12', '技术') - 0.25, { y: 10, duration: 0.5 });
    const no = T('ov.b12', '技术') + 0.35;
    tl.to(strike, { scaleX: 1, duration: 0.4, ease: 'power2.inOut' }, no);
    toColor(tech, INK3, no + 0.1, 0.5);
    K.show(fde.children[1], T('ov.b12', '数据') - 0.3, { y: 8 });
    K.show(src, T('ov.b12', '数据') - 0.1, { y: 14, stagger: 0.08 });
    // the line reaches the sources, the gate drops, and the line's far end draws back to the wall
    K.draw(reach, T('ov.b12', '接进来') - 0.3, { duration: 0.7, ease: 'power2.out' });
    K.draw(gate, T('ov.b12', '挡路') - 0.15, { duration: 0.4, ease: 'power3.out' });
    tl.to(reach, { strokeDashoffset: 1328 - 1172, duration: 0.5, ease: 'power3.out' }, T('ov.b12', '挡路') + 0.15);
    K.show(pol, T('ov.b12', '政治') - 0.2, { y: 10 });
    K.show(keeper, T('ov.b12', '守着') - 0.2, { y: 10 });
    K.source(root, QURESHI, T('ov.b12') + 0.5, T('ov.b12', 'end') + 0.2, ['ov.data_politics_essay']);
    tl.to([fde, ...src, keeper, tech, pol], { autoAlpha: 0, duration: 0.5 }, T('ov.b13') - 0.3);
    tl.to([gate, reach], { autoAlpha: 0, duration: 0.5 }, T('ov.b13') - 0.3);
    // the pilot: the weeks go to data access; the fill grows by width, the label comes once the fill has passed it,
    // and the demo is squeezed into the last sliver
    const lab = K.box(root, 'ov-pilot-lab', 200, 400, 1520, null, '试点 · 8 到 12 周');
    const bar = K.box(root, 'ov-pilot', 200, 480, 1520, 140);
    const fill = K.box(bar, 'ov-pilot-fill', 0, 0, 1380, 140);
    const flab = K.box(bar, 'ov-pilot-flab', 40, 0, 600, 140, '获取数据权限');
    const demo = K.box(bar, 'ov-pilot-demo', 1380, 0, 140, 140, '<span>演示</span>');
    gsap.set(fill, { width: 0 });
    gsap.set(demo, { scaleX: 0, transformOrigin: '100% 50%' });
    K.show(lab, T('ov.b13') + 0.1, { y: 12 });
    K.show(bar, T('ov.b13', '八到十二周') - 0.2, { y: 12 });
    const f0 = T('ov.b13', '整个试点期') - 0.2;
    tl.to(fill, { width: 1380, duration: 3.2, ease: 'power1.inOut' }, f0);
    K.show(flab, f0 + 1.0, { y: 0, duration: 0.4 });
    tl.to(demo, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, T('ov.b13', '最后一周') - 0.2);
    K.show(demo.firstChild, T('ov.b13', '最后一周') + 0.1, { y: 0, duration: 0.3 });
    K.source(root, QURESHI, T('ov.b13') + 0.3, T('ov.b13', 'end') + 0.4, ['ov.data_pilot_weeks']);
    close(root, X4);
  });

  // ---------------------------------------------------------------- 入选理由
  // In the standalone episode this scene runs on through the outro: the map that closes the body is the one the
  // outro points from, so it stays one object until the end card covers it.
  const outro = has('ov.o1');
  const reasonsEnd = outro ? T('ov.o1', 'end') + 0.5 : u.bodyEnd + Series.HOLD;
  Film.scene('ov-reasons', X4 - 0.1, reasonsEnd, ({ root, from }) => {
    const tag = open(root, '入选理由', from);
    root.dataset.cam = 'drift';
    // all five with the same neutral outline; the three with stated reasons turn ink, the other two dashed later.
    // The row and its legends open in the middle of the frame and settle to the top when the first reading opens.
    const row = K.box(root, 'ov-row', 0, 0, null, null);
    const cs = cards(row, 170, 190, 'small');
    gsap.set(row, { y: 230 });
    tl.to(row, { y: 0, duration: 1.1, ease: 'power2.inOut' }, T('ov.b15') - 0.9);
    const byKey = Object.fromEntries(cs.map(c => [c.dataset.book, c]));
    K.show(cs, from + 0.05, { y: 16, duration: 0.6, stagger: 0.05 });
    const stated = ['lt', 'im', 'gtd'], ours = ['iu', 'pr'];
    stated.forEach((k, i) => tl.to(byKey[k], { borderColor: INK, duration: 0.3 }, T('ov.b14', '三份') + i * 0.1));
    const tagS = K.box(row, 'ov-legend', 200, 400, 760, null, '<i class="solid"></i>Palantir 员工或前员工讲过理由');
    K.show(tagS, T('ov.b14', '三份') - 0.1, { y: 8 });
    // the reading being discussed lifts out of the row and the others step back
    const SPOTS = [
      [T('ov.b15') - 0.1, 'lt'], [T('ov.b16') - 0.1, 'im'], [T('ov.b18') - 0.1, 'gtd'], [T('ov.b19') - 0.1, null],
      [T('ov.b19', '理由') + 0.6, 'iu'], [T('ov.b19', '那份原则') - 0.2, 'pr'], [T('ov.b19', 'end') + 0.1, null],
    ];
    let cur = null;
    for (const [at, k] of SPOTS) {
      for (const c of cs) {
        const key = c.dataset.book;
        const was = cur === null || key === cur ? 1 : 0.4, now = k === null || key === k ? 1 : 0.4;
        if (was !== now) fade(c, was, now, at, 0.4);
        if ((key === cur) !== (key === k)) tl.to(c, { y: key === k ? -14 : 0, duration: 0.4, ease: 'power2.out' }, at);
      }
      cur = k;
    }
    // quotes sit centred in the space under the row
    const QW = 1520, QS = 44;
    const quote = (id) => {
      const q = K.quote(root, id, 200, 0, QW, { size: QS });
      q.root.style.top = Math.max(485, Math.round(690 - q.root.offsetHeight / 2)) + 'px';
      return q;
    };
    // The Looming Tower: Qureshi's three reasons lit in the order the narration gives them, then Agrawal and Blumenfeld-Gantz
    const q1 = quote('ov.qureshi_why_looming_tower');
    const l1 = marks(q1.en, ['founded partly as a response to 9/11', 'what Peter felt were the inevitable violations of civil liberties', 'the context was valuable']);
    const z1 = marks(q1.zh, ['部分是为了回应 9/11', 'Peter 认为随之而来、无可避免的对公民自由的侵犯', '这段背景有用']);
    K.show(q1.root, T('ov.b15') + 0.2, { y: 14 });
    const s1 = T('ov.b15', '成立') - 0.1, s2 = T('ov.b15', '也因为') - 0.1, s3 = T('ov.b15', '了解这段') - 0.1;
    say([l1[0], z1[0]], s1, s2);
    say([l1[1], z1[1]], s2, s3);
    say([l1[2], z1[2]], s3);
    const swap = T('ov.b15', '他们说') - 0.6;
    tl.to(q1.root, { autoAlpha: 0, duration: 0.4 }, swap - 0.2);
    K.source(root, QURESHI, T('ov.b15') + 0.3, swap - 0.3, ['ov.qureshi_why_looming_tower']);
    const q1b = quote('ov.agrawal_looming_mandatory');
    const l1b = [...marks(q1b.en, ['highlighted the importance of understanding your adversary']), ...marks(q1b.zh, ['突出了了解对手的重要'])];
    K.show(q1b.root, swap, { y: 14 });
    say(l1b, T('ov.b15', '了解对手') - 0.1);
    K.source(root, `${AB}, Palantir: The Founder Foundry, 2024`, swap + 0.1, T('ov.b15', 'end'), ['ov.agrawal_looming_mandatory']);
    tl.to(q1b.root, { autoAlpha: 0, duration: 0.4 }, T('ov.b16') - 0.3);
    // Impro: what Qureshi says the book does (the breakdown, then the mechanism when the narration describes it),
    // then his chain from not knowing it to failure
    const q2 = quote('ov.qureshi_impro_mechanistic');
    const m1 = marks(q2.en, ['breaks down social behavior', 'mechanistically']), m2 = marks(q2.zh, ['把社会行为拆成了', '机制']);
    K.show(q2.root, T('ov.b16') + 0.2, { y: 14 });
    const k1 = T('ov.b16', '拆机器') - 0.2, k2 = T('ov.b16', '只改') - 0.1;
    say([m1[0], m2[0]], k1, k2);
    say([m1[1], m2[1]], k2);
    const c0 = T('ov.b16', '不懂这些') - 0.2;
    tl.to(q2.root, { autoAlpha: 0, duration: 0.4 }, c0 - 0.25);
    const CY = 610;
    const STEPS = [
      ['不懂地位的机制', 200, 300],
      ['不太可能<br>在客户处成事', 606, 300],
      ['不太可能<br>接入数据、软件被采用', 1012, 400],
      ['失败', 1520, 200],
    ];
    const steps = STEPS.map(([t, x, w], i) => K.box(root, 'ov-step' + (i === 3 ? ' last' : ''), x, CY, w, 150, t));
    const csv = K.svg(root, 'ov-chain');
    const arrows = [0, 1, 2].map(i => arrow(csv, STEPS[i][1] + STEPS[i][2] + 12, CY + 75, STEPS[i + 1][1] - 12));
    K.show(steps[0], c0, { y: 12 });
    drawArrow(arrows[0], T('ov.b16', '不太可能') - 0.45, 0.4);
    K.show(steps[1], T('ov.b16', '不太可能') - 0.15, { y: 12 });
    drawArrow(arrows[1], T('ov.b16', '不太可能', 1) - 0.5, 0.4);
    K.show(steps[2], T('ov.b16', '不太可能', 1) - 0.15, { y: 12 });
    drawArrow(arrows[2], T('ov.b16', '意味着') - 0.5, 0.4);
    K.show(steps[3], T('ov.b16', '意味着') - 0.2, { y: 12 });
    K.source(root, QURESHI, T('ov.b16') + 0.3, T('ov.b17') - 0.2, ['ov.qureshi_impro_mechanistic', 'ov.qureshi-impro-chain']);
    tl.to([...steps, ...arrows.flat()], { autoAlpha: 0, duration: 0.4 }, T('ov.b17') - 0.2);
    // Mabrey: status as something to use in a situation, not something a person has; the first phrase returns
    // when the narration comes back to authority won in the situation
    const q3 = quote('ov.mabrey_impro_purpose_status');
    const a3 = marks(q3.en, ['an attribute to use to advance a given situation', 'not an intrinsic property to define a person']);
    const z3 = marks(q3.zh, ['一种属性，用来推动具体局面', '而不是界定一个人的固有特质']);
    K.show(q3.root, T('ov.b17') + 0.1, { y: 14 });
    const p1 = T('ov.b17', '地位是') - 0.1, p2 = T('ov.b17', '不是谁') - 0.1, p3 = T('ov.b17', '头衔') - 0.1, p4 = T('ov.b17', '具体场合') - 0.1;
    say([a3[0], z3[0]], p1, p2);
    say([a3[1], z3[1]], p2, p3);
    toColor([a3[0], z3[0]], BLUE, p4, 0.5);
    K.source(root, 'Ted Mabrey, Commentary on The Technological Republic, 2025', T('ov.b17') + 0.3, T('ov.b17', 'end'), ['ov.mabrey_impro_purpose_status']);
    tl.to(q3.root, { autoAlpha: 0, duration: 0.4 }, T('ov.b18') - 0.3);
    // Getting Things Done: the BCC rule, then the mail piles up from the bottom row
    const q4 = quote('ov.saraf_gtd_bcc_mechanism');
    q4.root.style.top = '485px';
    const b4 = [...marks(q4.en, ['BCC a mailing list with everyone on the team']), ...marks(q4.zh, ['密送给一个包含全组成员的邮件列表'])];
    K.show(q4.root, T('ov.b18') + 0.2, { y: 14 });
    say(b4, T('ov.b18', '密送全组') - 0.2);
    const flood = K.box(root, 'ov-flood', 200, 485 + q4.root.offsetHeight + 56, 1484, 120);
    const env = [];
    for (let r = 2; r >= 0; r--) for (let i = 0; i < 28; i++) env.push(K.box(flood, 'ov-env', i * 53, r * 42, 44, 30));
    K.show(env.slice(0, 8), T('ov.b18', '密送全组') - 0.1, { y: -10, duration: 0.3, stagger: 0.05 });
    K.show(env.slice(8, 18), T('ov.b18', '一长串人') - 0.2, { y: -10, duration: 0.3, stagger: 0.05 });
    K.show(env.slice(18), T('ov.b18', '多到') - 0.3, { y: -10, duration: 0.3, stagger: 0.016 });
    K.source(root, 'Sanjay Saraf, Lessons from Palantir Alums, 2024', T('ov.b18') + 0.3, T('ov.b18', 'end'), ['ov.saraf_gtd_bcc_mechanism']);
    tl.to([q4.root, flood], { autoAlpha: 0, duration: 0.4 }, T('ov.b19') - 0.3);
    // the two without stated reasons: this series' reading; their outlines turn dashed with the legend
    const tagO = K.box(row, 'ov-legend', 1000, 400, 720, null, '<i class="dash"></i>未见有人讲过理由 · <span>本系列的读法</span>');
    const dashAt = T('ov.b19') + 0.1;
    K.show(tagO, dashAt, { y: 8 });
    Film.onFrame(t => ours.forEach(k => byKey[k].classList.toggle('dashed', t >= dashAt)));
    const q5 = quote('ov.inf_interviewing_users_fit');
    const u1 = marks(q5.en, ['meet the people that are going to become your users', 'talk to them about their problems']);
    const u2 = marks(q5.zh, ['去见将来会成为你用户的人', '和他们谈他们的问题']);
    const qa = T('ov.b19', '一次访谈') - 0.2, pa = T('ov.b19', '那份原则');
    // between the Saraf quote and this one the row and its two legends are all there is: the camera holds them centred.
    // The camera leaves about 1.4 s ahead of a framing, so this one starts late enough that the mail has gone first.
    frame(root, 200, 150, 1520, 300, T('ov.b19') + 1.3, qa - 0.6);
    K.show(q5.root, qa, { y: 14 });
    const v1 = T('ov.b19', '要去见') - 0.1, v2 = T('ov.b19', '听他们') - 0.1;
    say([u1[0], u2[0]], v1, v2);
    say([u1[1], u2[1]], v2);
    tl.to(q5.root, { autoAlpha: 0, duration: 0.4 }, pa - 0.4);
    K.source(root, 'Nabeel Qureshi, Lenny’s Podcast, 2025, 00:24:26', qa + 0.1, pa - 0.4, ['ov.inf_interviewing_users_fit']);
    const prl = K.box(root, 'ov-pr', 200, 630, 1480, null, '<span>对待犯错</span><span>处理分歧</span>');
    K.show(prl.children[0], T('ov.b19', '对待犯错') - 0.15, { y: 14 });
    K.show(prl.children[1], T('ov.b19', '处理分歧') - 0.15, { y: 14 });
    K.lit(tagO.querySelector('span'), T('ov.b19', '这两条') - 0.1);
    tl.to(prl, { autoAlpha: 0, duration: 0.4 }, T('ov.b20') - 0.3);
    // all five on one job: each card travels to its place on the series map and becomes its entry there;
    // the dashed line joins them on 同一份工作, and each job word comes with its phrase
    const mapAt = T('ov.b20');
    tl.to([tagS, tagO], { autoAlpha: 0, y: -16, duration: 0.5 }, mapAt - 0.1);
    const MAPY = 370;
    const m = Series.map(root, mapAt, { y: MAPY, show: false });
    const colW = 1520 / 5;
    const P = m.cols.map(c => ({ no: c.querySelector('.sr-map-no'), word: c.querySelector('.sr-map-word'), dot: c.querySelector('.sr-map-dot'), book: c.querySelector('.sr-map-book') }));
    // first the cards take the series order (the two that cross the others travel in their own lanes below the row),
    // then each drops onto its column and dissolves into the book line there: its words go while it falls, its
    // outline as it lands, and the book line comes up only once the outline has gone, so the two titles never stack
    const LANE = { iu: 195, lt: 390 };
    m.cols.forEach((col, j) => {
      const key = col.dataset.unit, c = byKey[key], bk = P[j].book;
      const dx = 200 + j * colW + colW / 2 - (c.offsetLeft + c.offsetWidth / 2);
      const dy = MAPY + bk.offsetTop + bk.offsetHeight / 2 - (c.offsetTop + c.offsetHeight / 2);
      // lanes are reached before the paths cross: the drop is quick, the sideways move slower and later
      const go = mapAt + 0.05, drop = go + 1.15 + j * 0.05;
      if (LANE[key]) tl.to(c, { y: LANE[key], duration: 0.55, ease: 'power3.out' }, go);
      tl.to(c, { x: dx, duration: 1.0, ease: 'power2.inOut' }, go + 0.15);
      tl.to(c, { y: dy, duration: 0.8, ease: 'power2.inOut' }, drop);
      fade(c.parts, 1, 0, drop + 0.1, 0.3);
      tl.to(c, { autoAlpha: 0, duration: 0.35, ease: 'power1.in' }, drop + 0.4);
      K.show(bk, drop + 0.75, { y: 0, duration: 0.5 });
    });
    K.show(m.label, T('ov.b20', '也是我的读法') - 0.2, { y: 0, duration: 0.5 });
    const work = T('ov.b20', '同一份工作') - 0.3;
    K.draw(m.line, work, { duration: 1.0 });
    K.show(P.map(p => p.dot), work + 0.05, { y: 0, scale: 0.4, duration: 0.4, stagger: 0.2 });
    K.show(P.map(p => p.no), work + 0.1, { y: 8, duration: 0.4, stagger: 0.2 });
    ['问题', '信得过', '事', '对错', '为什么存在'].forEach((w, i) => {
      const at = T('ov.b20', w) - 0.15;
      gsap.set(P[i].word, { color: BLUE });
      K.show(P[i].word, at, { y: 18, duration: 0.6 });
      tl.to(P[i].word, { color: INK, duration: 0.5 }, at + 1.0);
    });
    // the plan for the series: the first reading takes the focus, its word on 接下来, its station on 一份一份
    toColor([P[0].word, P[0].no], BLUE, T('ov.b21', '接下来') - 0.1);
    tl.to(P[0].dot, { backgroundColor: BLUE, borderColor: BLUE, duration: 0.35 }, T('ov.b21', '一份一份') - 0.1);
    toColor(P[0].book, INK, T('ov.b21', '一份一份') - 0.1);
    // compilation: the map holds until the next chapter card has come up over it
    // outro (standalone): the chapter tag leaves and the next episode is named under the same map
    if (outro) {
      tl.to(tag.root, { autoAlpha: 0, duration: 0.4 }, T('ov.o1') - 0.3);
      const nx = K.box(root, 'ov-next', 200, 830, 1520, null, '下一集 · <b>01</b> 访谈为决定服务');
      K.show(nx, T('ov.o1') + 0.2, { y: 10 });
    }
  });
});
