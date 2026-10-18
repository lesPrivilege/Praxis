/* 03 把承诺移出脑子 — Getting Things Done.
   Body chapters: Saraf's mail flood; the editions, the two objectives and why things leave the head;
   clarifying as a tree; the two-minute rule and Lonsdale's line; the weekly review and its cost;
   the author's own limits; back to the field. The outro (standalone only) hands over to 04.
   Solid: stated by a source. Dashed: this series' reading only, labelled 本系列的读法.
   Not read or not written: a solid hairline in --rule, grey text and a 未读 / 未写明 tag. */
Series.unit('gtd', ({ T, tl, has, u, chrome }) => {
  const BLUE = '#1f4fe0', INK = '#0d1826', INK2 = '#3a4658', INK3 = '#7d8a9c', RULE = '#c3ccd8', RED = '#dd4a3c';
  const BLUE_SOFT = '#dfe7fb';

  /* Paper, grain, chapter tag; the scene fades in over the one before it. */
  function open(root, from, title) {
    root.classList.add('paper');
    K.el(root, 'grain');
    chrome(root, title);
    gsap.set(root, { opacity: 0 });
    tl.to(root, { opacity: 1, duration: 0.4 }, from);
  }

  /* A held shot: from `from` to `to` the camera frames the stage rectangle r = [x0, y0, x1, y1], enlarged up to z.
     Scenes here build up one item at a time; holding the framing of the whole beat keeps the camera from
     re-framing on every arrival, and a change of shot is a deliberate move (camera.js smooths it over about a second).
     The rectangle (K.frame) must fit the safe area (1620 × 780). */
  function shot(root, r, from, to, z) {
    const w = r[2] - r[0], h = r[3] - r[1];
    if (w > 1620 || h > 780) console.warn(`shot ${r} does not fit the safe area`);
    K.frame(root, r[0], r[1], r[2], r[3], from, to, { zoom: z || 1.05 });
  }
  /* The phrase of a quote that the narration lands on, wrapped in a span for K.lit; the quote's text is unchanged. */
  function phrase(q, text) {
    const walk = document.createTreeWalker(q.en, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const i = n.nodeValue.indexOf(text);
      if (i < 0) continue;
      const mid = n.splitText(i);
      mid.splitText(text.length);
      const s = document.createElement('span');
      mid.replaceWith(s);
      s.appendChild(mid);
      return s;
    }
    throw new Error('phrase not in quote: ' + text);
  }
  /* The point moves on: a lit phrase goes back to ink and its rule retracts. */
  const unlit = (s, at) => tl.to(s, { color: INK, backgroundSize: '0% 0.07em', duration: 0.4, ease: 'power2.inOut' }, at);
  /* An arrow is two paths, shaft and head: the browser restarts a dash pattern on every subpath, so a head inside
     the shaft's path would show from the first frame of the draw. The head is drawn as the shaft arrives. */
  const arrow = (sv, shaft, head, cls) => [K.path(sv, shaft, cls), K.path(sv, head, cls)];
  function drawArrow(a, at, o) {
    o = Object.assign({ duration: 0.5 }, o);
    K.draw(a[0], at, o);
    K.draw(a[1], at + o.duration * 0.85, { duration: 0.15, ease: 'none' });
  }

  /* Ten inboxes in a row; the same grid holds the ten to-do lists of b11. */
  const TW = 128, tileX = i => 200 + i * (1520 - TW) / 9;

  /* Saraf's mail flood: an outgoing email that BCCs the team list, a meeting report with a long
     recipient line, the bus to every inbox, and the bars that pile up in each. Built hidden. */
  /* Rows, top to bottom: the two messages, the bus, the inboxes, the labels under them; 160–918 fits one shot. */
  const MAIL_Y = 264, BUS_Y = 558, TRAY_Y = 606, LAB_Y = 874;
  function flood(root) {
    const email = K.box(root, 'gtd-mail', 200, MAIL_Y, 640, 250,
      '<div class="gtd-mail-title">对外邮件</div>' +
      '<div class="gtd-mail-row"><span>收件</span><b>客户</b></div>' +
      '<div class="gtd-mail-row bcc"><span>密送</span><b>全组邮件列表</b></div>');
    const report = K.box(root, 'gtd-mail', 1080, MAIL_Y, 640, 250,
      '<div class="gtd-mail-title">客户会议纪要</div>' +
      '<div class="gtd-mail-row top"><span>收件</span><div class="gtd-dots">' + '<i></i>'.repeat(26) + '</div></div>');
    const sv = K.svg(root, 'gtd-flood-lines');
    const trunkA = K.path(sv, `M520,${MAIL_Y + 252} L520,${BUS_Y}`, 'ln soft');
    const trunkB = K.path(sv, `M1400,${MAIL_Y + 252} L1400,${BUS_Y}`, 'ln soft');
    const bus = [K.path(sv, `M520,${BUS_Y} L${tileX(0) + TW / 2},${BUS_Y}`, 'ln soft'), K.path(sv, `M520,${BUS_Y} L${tileX(9) + TW / 2},${BUS_Y}`, 'ln soft')];
    const drops = [], tiles = [], bars = [];
    for (let i = 0; i < 10; i++) {
      const cx = tileX(i) + TW / 2;
      drops.push(K.path(sv, `M${cx},${BUS_Y} L${cx},${TRAY_Y - 2}`, 'ln soft'));
      const t = K.box(root, 'gtd-tray', tileX(i), TRAY_Y, TW, 250);
      tiles.push(t);
      bars.push(Array.from({ length: 17 }, (_, j) => K.box(t, 'gtd-bar', 16, 224 - j * 17, 91, 11)));
    }
    gsap.set([email, report, ...tiles], { autoAlpha: 0 });
    return { email, report, bcc: email.querySelector('.bcc'), dots: [...report.querySelectorAll('.gtd-dots i')], sv, trunkA, trunkB, bus, drops, tiles, bars };
  }
  /* Bars j0..j1 drop into the given inboxes, inbox by inbox. */
  function pile(f, which, j0, j1, at, step) {
    which.forEach((i, k) => K.show(f.bars[i].slice(j0, j1 + 1), at + k * 0.04, { y: -14, duration: 0.3, stagger: step || 0.07 }));
  }
  const ALL = [...Array(10).keys()], LEFT = [0, 1, 2, 3, 4], RIGHT = [5, 6, 7, 8, 9];

  /* A row of five cells joined by arrows: start, three conditions, outcome. */
  function pipe(root, x, y, cells, dashed) {
    const P = [[0, 180], [250, 230], [550, 230], [850, 230], [1150, 190]];
    const row = K.box(root, 'gtd-pipe', x, y, 1340, 110);
    const sv = K.svg(row, null, 1340, 110);
    const segs = [[180, 250], [480, 550], [780, 850], [1080, 1150]].map(([a, b], i) =>
      arrow(sv, `M${a + 6},55 L${b - 8},55`, `M${b - 20},45 L${b - 8},55 L${b - 20},65`, 'ln' + (dashed && dashed.includes(i) ? ' dash soft' : '')));
    const boxes = cells.map((c, i) => K.box(row, 'gtd-gate ' + (c.cls || ''), P[i][0], 0, P[i][1], 110, c.t));
    return { row, segs, boxes };
  }

  // ---------------------------------------------------------------- 邮件洪水 (b1–b2)
  Film.scene('gtd-flood', u.bodyStart - 0.2, T('gtd.b3') + 0.2, ({ root, from, to }) => {
    open(root, from, '邮件洪水');
    const who = K.box(root, 'gtd-who', 200, 150, 1520, null, '<b>Sanjay Saraf</b><span>2015 年入职 Palantir</span>');
    K.show(who, T('gtd.b1') + 0.1, { y: 0, duration: 0.6 });
    // the camera widens with the mail: the man, then his email, then every inbox on the team list
    const mailAt = T('gtd.b1', '回忆') - 0.1, allAt = T('gtd.b1', '全组') - 0.5, bookAt = T('gtd.b2') - 0.3;
    shot(root, [200, 140, 940, 240], from, mailAt, 1.5);
    shot(root, [200, 140, 840, MAIL_Y + 252], mailAt, allAt, 1.3);
    // the move to the book waits until the flood has cleared, so nothing fading drifts into the source line
    const bookShot = T('gtd.b2', '提到') - 0.2;
    shot(root, [200, 150, 1720, LAB_Y + 46], allAt, bookShot, 1.05);
    shot(root, [200, 150, 1620, 730], bookShot, to, 1.12);

    const f = flood(root);
    K.show(f.email, T('gtd.b1', '邮件') - 0.5, { y: 20 });
    tl.to(f.bcc, { color: BLUE, duration: 0.3 }, T('gtd.b1', '密送') - 0.1);
    K.draw(f.trunkA, T('gtd.b1', '密送') + 0.1, { duration: 0.3 });
    K.draw(f.bus, T('gtd.b1', '全组') - 0.1, { duration: 0.6, stagger: 0 });
    K.show(f.tiles, T('gtd.b1', '全组') - 0.1, { y: 16, duration: 0.5, stagger: 0.04 });
    K.draw(f.drops, T('gtd.b1', '全组') + 0.3, { duration: 0.3, stagger: 0.03 });
    pile(f, ALL, 0, 2, T('gtd.b1', '全组') + 0.6);
    // meeting reports to a long list
    K.show(f.report, T('gtd.b1', '重要') - 0.3, { y: 20 });
    K.show(f.dots, T('gtd.b1', '一长串') - 0.2, { y: 0, scale: 0.3, duration: 0.25, stagger: 0.025 });
    K.draw(f.trunkB, T('gtd.b1', '一长串') + 0.4, { duration: 0.3 });
    pile(f, ALL, 3, 5, T('gtd.b1', '一长串') + 0.6);
    // either drowned or filtering
    tl.to([f.trunkA, f.trunkB, ...f.bus, ...f.drops], { opacity: 0.3, duration: 0.5 }, T('gtd.b1', '淹没') - 0.7);
    pile(f, ALL, 6, 16, T('gtd.b1', '淹没') - 0.6, 0.035);
    const drown = K.box(root, 'gtd-group-lab', 200, LAB_Y, tileX(4) + TW - 200, null, '被邮件淹没');
    K.show(drown, T('gtd.b1', '淹没') - 0.2, { y: 10 });
    const filt = K.path(f.sv, `M${tileX(5) - 10},${TRAY_Y - 26} L${tileX(9) + TW + 10},${TRAY_Y - 26}`, 'ln blue gtd-filter');
    K.draw(filt, T('gtd.b1', '过滤') - 0.5, { duration: 0.5 });
    tl.to(RIGHT.flatMap(i => f.bars[i].slice(3)), { autoAlpha: 0, y: -24, duration: 0.5, stagger: 0.006 }, T('gtd.b1', '过滤') - 0.1);
    const kept = K.box(root, 'gtd-group-lab blue', tileX(5), LAB_Y, tileX(9) + TW - tileX(5), null, '设过滤规则');
    K.show(kept, T('gtd.b1', '过滤') - 0.2, { y: 10 });

    // the book, recommended first and later required
    K.hide([f.email, f.report, f.sv, ...f.tiles, drown, kept], bookAt, { duration: 0.5 });
    const book = K.box(root, 'gtd-book', 200, 360, 1520, null, 'Getting Things Done');
    K.show(book, T('gtd.b2', '提到') + 0.3, { y: 20 });
    const s1 = K.box(root, 'gtd-stage', 200, 580, 620, 140, '常推荐的书');
    const s2 = K.box(root, 'gtd-stage on', 1000, 580, 620, 140, '新员工必读');
    const sv = K.svg(root, 'gtd-stage-arrow');
    const arr = arrow(sv, 'M840,650 L978,650', 'M962,636 L980,650 L962,664', 'ln');
    K.show(s1, T('gtd.b2', '推荐') - 0.4, { y: 14 });
    drawArrow(arr, T('gtd.b2', '后来') - 0.1, { duration: 0.5 });
    K.show(s2, T('gtd.b2', '新员工') - 0.2, { y: 14 });
    // the page clears just before the cut, so the book's own title card does not cross a second title
    K.hide([who, book, s1, s2, sv], T('gtd.b3') - 0.65, { duration: 0.4 });
    K.source(root, 'Sanjay Saraf, Lessons from Palantir Alums, 2024', T('gtd.b1') + 0.6, T('gtd.b2', 'end') + 0.8, ['ov.saraf_gtd_bcc_mechanism', 'ov.saraf_gtd_mandated']);
  });

  // ---------------------------------------------------------------- 版本与出处 (b3)
  Film.scene('gtd-editions', T('gtd.b3') - 0.3, T('gtd.b4') + 0.2, ({ root, from, to }) => {
    open(root, from, '版本与出处');
    // close on the title, then back as the author is named so his picture comes into the frame
    const auAt = T('gtd.b3', '作者') - 0.5, readAt = T('gtd.b3', '我读到') - 0.5, cutAt = T('gtd.b3', '五个步骤') - 0.3;
    shot(root, [200, 190, 1060, 540], from, auAt, 1.3);
    shot(root, [200, 160, 1720, 940], auAt, readAt, 1.03);
    shot(root, [200, 210, 1720, 800], readAt, cutAt, 1.06);
    shot(root, [200, 190, 1720, 925], cutAt, to, 1.05);
    // the book and its author
    const ttl = K.box(root, 'gtd-id-title', 200, 200, 860, null, 'Getting Things<br>Done');
    const abbr = K.box(root, 'gtd-id-abbr t-num', 200, 470, 860, null, 'GTD');
    const au = K.box(root, 'gtd-id-author', 200, 560, 860, null, 'David Allen');
    const ed = K.box(root, 'gtd-id-ed', 200, 660, 860, null, '第 1 版 · 2001 年');
    const fig = K.figure(root, 'gtd.allen-scoble-2009', 1120, 170, 600, 700, { pos: '46% 38%' });
    const cap = K.box(root, 'gtd-figcap', 1120, 890, 600, null, 'David Allen · 摄于 2009 年');
    K.show(ttl, T('gtd.b3') + 0.1, { y: 20 });
    K.show(abbr, T('gtd.b3', '简称') - 0.1, { y: 10 });
    K.show(fig, T('gtd.b3', '作者') - 0.3, { y: 0, scale: 1.02, duration: 0.9 });
    K.show(au, T('gtd.b3', '作者') + 0.2, { y: 12 });
    K.show(cap, T('gtd.b3', '作者') + 0.6, { y: 8 });
    K.show(ed, T('gtd.b3', '第一版') - 0.2, { y: 12 });
    K.hide([ttl, abbr, au, ed, fig, cap], T('gtd.b3', '我读到') - 0.5, { duration: 0.45 });

    // what this episode read: the two editions on a year axis; the author's own material on a row of its own
    const at = a => T(a[0], a[1]) + a[2];
    const ED = [
      { x: 200, year: '2001', title: '第 1 版', subs: [['出版方节选', ['gtd.b3', '节选', -0.4]], ['至第 1 章开头', ['gtd.b3', '第一章', -0.3]]], at: ['gtd.b3', '我读到', -0.15] },
      { x: 1080, year: '2015', title: '第 2 版', subs: [['出版方称全面改写', ['gtd.b3', '出版方', -0.2]]], tag: ['未读', ['gtd.b3', '那一版', -0.2]], at: ['gtd.b3', '第二版', -0.6], unread: true },
    ];
    const sv = K.svg(root, 'gtd-ed-lines');
    const axis = K.path(sv, 'M530,320 L1390,320', 'ln soft');
    const edEls = ED.map(c => {
      const yr = K.box(root, 'gtd-ed-year t-num', c.x, 222, 640, null, c.year);
      const dot = K.box(root, 'gtd-ed-dot' + (c.unread ? ' unread' : ''), c.x + 310, 310, 20, 20);
      const card = K.box(root, 'gtd-ed-card' + (c.unread ? ' unread' : ''), c.x, 370, 640, 230, `<div class="gtd-ed-head"><b>${c.title}</b></div>`);
      c.subs.forEach(([t, a]) => K.show(K.el(card, 'gtd-ed-sub', t), at(a), { y: 8, duration: 0.5 }));
      if (c.tag) K.show(K.el(card.firstChild, 'gtd-tag', c.tag[0]), at(c.tag[1]), { y: 0, scale: 0.9, duration: 0.4 });
      K.show([yr, dot, card], at(c.at), { y: 14, stagger: 0.06 });
      return [yr, dot, card];
    });
    // the axis reaches 2015 as the second edition is named
    K.draw(axis, T('gtd.b3', '第二版') - 0.9, { duration: 0.6 });
    const rest = K.box(root, 'gtd-ed-rest', 200, 660, 1520, 130, '<b>其余内容 · 作者 2011–2020 的说法</b>');
    const chips = K.el(rest, 'gtd-ed-chips');
    [['官网', '官网'], ['讲义', '讲义'], ['访谈', '访谈']].forEach(([t, w]) => K.show(K.el(chips, 'gtd-chip', t), T('gtd.b3', w) - 0.2, { y: 8, duration: 0.5 }));
    K.show(rest, T('gtd.b3', '之后') - 0.2, { y: 14 });
    const cut = T('gtd.b3', '五个步骤') - 0.3;
    K.hide([...edEls.flat(), sv, rest], cut, { duration: 0.4 });

    // two sets of names for the five steps
    const OLD = ['Collection', 'Processing', 'Organizing', 'Reviewing', 'Doing'];
    const NEW = ['Capture', 'Clarify', 'Organize', 'Reflect', 'Engage'];
    const head = K.box(root, 'gtd-terms-head', 200, 200, 1520, null, '五个步骤的名称');
    const lab1 = K.box(root, 'gtd-terms-lab', 200, 330, 320, 92, '<b>旧名称</b><span>2001 目录章名</span>');
    const lab2 = K.box(root, 'gtd-terms-lab new', 200, 480, 320, 92, '<b>新名称</b><span>官网 2014 起</span>');
    const r1 = OLD.map((w, i) => K.box(root, 'gtd-term old', 540 + i * 236, 330, 224, 92, w));
    const r2 = NEW.map((w, i) => K.box(root, 'gtd-term new', 540 + i * 236, 480, 224, 92, w));
    K.show([head, lab1], cut + 0.35, { y: 10, stagger: 0.08 });
    K.show(r1, cut + 0.4, { y: 12, stagger: 0.06 });
    K.show(lab2, T('gtd.b3', '叫法') - 0.2, { y: 10 });
    K.show(r2, T('gtd.b3', '叫法') - 0.1, { y: 12, stagger: 0.07 });
    const q = K.quote(root, 'gtd.ep01-principles-unchanged', 200, 680, 1400, { size: 52 });
    K.show(q.root, T('gtd.b3', '原则') - 0.6, { y: 14 });
    // the point moves from the new names to what did not change
    tl.fromTo(r2, { color: BLUE, borderBottomColor: BLUE }, { color: INK, borderBottomColor: INK3, duration: 0.5, immediateRender: false }, T('gtd.b3', '原则') - 0.4);
    K.lit(phrase(q, 'the principles haven’t changed at all'), T('gtd.b3', '一点没变') - 0.15);

    K.source(root, 'David Allen, Getting Things Done, 2001, 出版方节选 · 出版方文案 · gettingthingsdone.com', T('gtd.b3') + 0.5, cut,
      ['gtd.2001-excerpt-ends', 'gtd.blurb-rewritten', 'gtd.version-split']);
    K.source(root, 'David Allen, Getting Things Done, 2001, 目录 · gettingthingsdone.com, 2014 存档 · GTD Podcast #1, 2015', cut + 0.5, T('gtd.b3', 'end') + 0.6,
      ['gtd.2001-toc-stages', 'gtd.wb2014-labels', 'gtd.version-split', 'gtd.ep01-principles-unchanged']);
  });

  // ---------------------------------------------------------------- 两个目标 (b4)
  const GOAL2 = '每样输入事先拿定主意';
  Film.scene('gtd-goals', T('gtd.b4') - 0.3, T('gtd.b5') + 0.2, ({ root, from, to }) => {
    open(root, from, '两个目标');
    // close on the kicker and the two numerals, back as goal 1 is named
    const goal1At = T('gtd.b4', '第一个') - 0.5;
    shot(root, [200, 160, 1060, 334], from, goal1At, 1.3);
    shot(root, [200, 160, 1720, 870], goal1At, to, 1.06);
    const kick = K.box(root, 'gtd-kicker', 200, 170, 1520, null, '第 1 版 · 第 1 章开头');
    K.show(kick, T('gtd.b4') + 0.1, { y: 10 });
    const nums = [200, 1000].map((x, i) => K.box(root, 'gtd-goal-no t-num', x, 236, 200, null, String(i + 1)));
    const t1 = K.box(root, 'gtd-goal-title', 200, 356, 720, null, '一切收进脑外的可信系统');
    const t2 = K.box(root, 'gtd-goal-title', 1000, 356, 720, null, GOAL2);
    // the source line carries the citation once for both quotes
    const q1 = K.quote(root, 'gtd.2001-two-objectives', 200, 450, 720, { size: 38 });
    const q2 = K.quote(root, 'gtd.2001-front-end-decisions', 1000, 450, 720, { size: 38 });
    K.show(nums, T('gtd.b4', '这套') - 0.2, { y: 12, stagger: 0.12 });
    tl.to(nums[0], { color: BLUE, duration: 0.3 }, T('gtd.b4', '第一个') - 0.2);
    K.show(t1, T('gtd.b4', '第一个') - 0.1, { y: 12 });
    K.show(q1.root, T('gtd.b4', '收进') - 0.2, { y: 12 });
    const chips = K.box(root, 'gtd-chips', 200, 790, 720, 70);
    [['眼下', '眼下'], ['以后', '以后'], ['将来也许', '将来'], ['大事小事', '大事']].forEach(([t, w]) =>
      K.show(K.el(chips, 'gtd-chip', t), T('gtd.b4', w) - 0.2, { y: 10, duration: 0.5 }));
    tl.to(nums[0], { color: INK, duration: 0.3 }, T('gtd.b4', '第二个') - 0.2);
    tl.to(nums[1], { color: BLUE, duration: 0.3 }, T('gtd.b4', '第二个') - 0.2);
    K.show(t2, T('gtd.b4', '第二个') - 0.1, { y: 12 });
    K.show(q2.root, T('gtd.b4', '凡是') - 0.2, { y: 12 });
    // the phrase of each quote the narration lands on; the first returns to ink when the point moves to goal 2
    const p1 = phrase(q1, 'trusted system outside of your head');
    K.lit(p1, T('gtd.b4', '信得过') - 0.15);
    unlit(p1, T('gtd.b4', '第二个') - 0.2);
    K.lit(phrase(q2, 'front-end decisions'), T('gtd.b4', '事先') - 0.15);
    K.source(root, 'David Allen, Getting Things Done, 2001, 第 1 章', T('gtd.b4') + 0.4, T('gtd.b4', 'end') + 0.6,
      ['gtd.2001-two-objectives', 'gtd.2001-front-end-decisions']);
  });

  // ---------------------------------------------------------------- 脑子与日历 (b5–b6)
  /* One head through both segments. b5: a memory with no sense of past or future, then the head used as an
     office, its notes piling up inside. b6: the same notes leave the head for days on a calendar, and one day
     sends you back at the right time. The head stays put in b6, so the eye follows the notes out of it. */
  Film.scene('gtd-head', T('gtd.b5') - 0.3, T('gtd.b7') + 0.2, ({ root, from, to }) => {
    open(root, from, '两个目标');
    shot(root, [200, 160, 1720, 930], from, to, 1.03);
    const kick = K.box(root, 'gtd-kicker', 200, 170, 1520, null, '移出脑子的理由');
    K.show(kick, T('gtd.b5') + 0.1, { y: 10 });
    const hd = K.box(root, 'gtd-headc', 220, 560, 280, 280, '<span>脑子</span>');
    K.show(hd, T('gtd.b5', '脑子') - 0.3, { y: 0, scale: 0.9 });
    const q = K.quote(root, 'gtd.head-no-time-sense', 200, 250, 1520, { size: 52 });
    K.show(q.root, T('gtd.b5', '他说') - 0.1, { y: 12 });
    // a day with no past or future: the cat food reminder lasts all 24 hours
    const X0 = 640, X1 = 1700, AY = 740, hx = h => X0 + (h / 24) * (X1 - X0);
    const HOURS = [0, 3, 6, 9, 12, 15, 18, 21, 24];
    const sv = K.svg(root, 'gtd-day');
    const axis = K.path(sv, `M${X0},${AY} L${X1},${AY}`, 'ln soft');
    const ticks = HOURS.map(h => K.path(sv, `M${hx(h)},${AY - 8} L${hx(h)},${AY + 8}`, 'ln soft'));
    const tlabs = HOURS.map(h => K.box(root, 'gtd-hour t-num', hx(h) - 40, AY + 18, 80, null, String(h)));
    const link = K.path(sv, `M500,700 L${X0 - 4},670`, 'ln soft');
    const bar = K.box(root, 'gtd-catbar', X0, 640, X1 - X0, 60, '<span>买猫粮</span>');
    gsap.set(bar, { scaleX: 0, transformOrigin: '0 50%' });
    K.draw([axis, ...ticks], T('gtd.b5', '二十四') - 0.9, { duration: 0.6, stagger: 0.02 });
    K.show(tlabs, T('gtd.b5', '二十四') - 0.7, { y: 6, duration: 0.4, stagger: 0.03 });
    K.draw(link, T('gtd.b5', '二十四') - 0.6, { duration: 0.4 });
    tl.to(bar, { scaleX: 1, duration: 2.4, ease: 'power1.inOut' }, T('gtd.b5', '二十四') - 0.3);
    const mark = K.path(sv, `M${hx(3)},620 L${hx(3)},${AY}`, 'ln blue');
    const markLab = K.box(root, 'gtd-mark-lab', hx(3) - 20, AY + 70, 600, null, '凌晨三点 · 叫醒');
    K.draw(mark, T('gtd.b5', '凌晨') - 0.3, { duration: 0.4 });
    K.show(markLab, T('gtd.b5', '凌晨') - 0.1, { y: 10 });
    K.source(root, 'David Allen, GTD Podcast #35, 2017 · The Tim Ferriss Show #384, 2019', T('gtd.b5') + 0.5, T('gtd.b5', '他还说') - 0.4,
      ['gtd.head-no-time-sense', 'gtd.cat-food']);

    // the head used as an office: it grows to the middle of the left half and fills with notes
    const p2 = T('gtd.b5', '他还说') - 0.3;
    K.hide([q.root, sv, ...tlabs, bar, markLab], p2, { duration: 0.45 });
    tl.to(hd, { x: 100, y: -140, scale: 1.6, duration: 1.0, ease: 'power2.inOut' }, p2);
    const HC = { x: 460, y: 560 }, HS = 1.6;   // the grown head: centre and scale
    const rnd = K.rng(3);
    const notes = Array.from({ length: 7 }, (_, i) => {
      const w = 60 + rnd() * 30, a = (i / 7) * Math.PI * 2 + 0.4, r = 40 + rnd() * 26;
      const cx = HC.x + HS * Math.cos(a) * r, cy = HC.y + HS * (32 + Math.sin(a) * r * 0.55);
      const n = K.box(root, 'gtd-snote', cx - (HS * w) / 2, cy - HS * 15, HS * w, HS * 30);
      gsap.set(n, { rotation: (rnd() - 0.5) * 34 });
      return n;
    });
    K.show(notes, T('gtd.b5', '办公室') - 0.6, { y: -10, scale: 0.6, duration: 0.4, stagger: 0.07 });
    const cap = K.box(root, 'gtd-headcap', 200, 820, 520, null, '拿脑子当办公室');
    K.show(cap, T('gtd.b5', '办公室') - 0.2, { y: 8 });
    const q2 = K.quote(root, 'gtd.head-crappy-office', 880, 400, 840, { size: 66 });
    K.show(q2.root, T('gtd.b5', '可脑子') - 0.3, { y: 14 });
    K.lit(phrase(q2, 'crappy office'), T('gtd.b5', '很糟') - 0.15);
    K.source(root, 'David Allen, The Tim Ferriss Show #384, 2019', T('gtd.b5', '他还说') + 0.1, T('gtd.b5', 'end') + 0.6, ['gtd.head-crappy-office']);

    // b6: outside the head, a month on paper; the notes go into it, day by day
    K.hide([q2.root, cap], T('gtd.b6') - 0.4, { duration: 0.45 });
    const CX = 900, CY = 500, cellAt = (r, c) => ({ x: CX + c * 104, y: CY + 50 + r * 78 });
    const cal = K.box(root, 'gtd-cal', CX, CY, 728, 362);
    ['一', '二', '三', '四', '五', '六', '日'].forEach((d, c) => K.box(cal, 'gtd-cal-day', c * 104, 0, 96, 40, d));
    const cells = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) cells.push(K.box(cal, 'gtd-cal-cell', c * 104, 50 + r * 78, 96, 70));
    K.show(cal, T('gtd.b6', '外面') - 0.5, { y: 16 });
    const qc = K.quote(root, 'gtd.calendar-analogy', CX - 20, 190, 840, { size: 44 });
    K.show(qc.root, T('gtd.b6', '日历') - 0.3, { y: 12 });
    // into the system: the arrow, then every note to a day of its own, top rows first; the last one is the day that calls you back
    const lsv = K.svg(root, 'gtd-cal-lines');
    const put = arrow(lsv, 'M690,640 L880,640', 'M866,630 L882,640 L866,650', 'ln');
    const putLab = K.box(root, 'gtd-step-lab', 676, 584, 220, null, '放进系统');
    drawArrow(put, T('gtd.b6', '记不住') - 0.2, { duration: 0.5 });
    K.show(putLab, T('gtd.b6', '记不住') - 0.1, { y: 8 });
    const DAYS = [[0, 1], [0, 5], [1, 3], [1, 6], [2, 0], [2, 2], [3, 4]];
    const order = notes.map((n, i) => i).sort((a, b) => notes[a].offsetTop - notes[b].offsetTop);
    const fly = T('gtd.b6', '放进') - 0.3;
    order.forEach((ni, k) => {
      const n = notes[ni], d = cellAt(...DAYS[k]);
      n.style.zIndex = 5;
      tl.to(n, { x: d.x + 8 - n.offsetLeft, y: d.y + 15 - n.offsetTop, width: 80, height: 40, rotation: 0, duration: 0.9, ease: 'power2.inOut' }, fly + k * 0.13);
    });
    const due = notes[order[order.length - 1]], dueCell = cells[3 * 7 + 4];
    const back = arrow(lsv, 'M1364,866 C1364,950 460,960 460,800', 'M450,816 L460,798 L470,816', 'ln blue');
    const backLab = K.box(root, 'gtd-step-lab blue', 668, 856, 220, null, '按时查看');
    tl.to([dueCell, due], { backgroundColor: BLUE_SOFT, borderColor: BLUE, duration: 0.4 }, T('gtd.b6', '到时候') - 0.3);
    drawArrow(back, T('gtd.b6', '到时候') - 0.2, { duration: 0.9 });
    K.show(backLab, T('gtd.b6', '到时候') + 0.1, { y: 8 });
    K.source(root, 'David Allen, GTD Podcast #1, 2015', T('gtd.b6') + 0.4, T('gtd.b6', 'end') + 0.6, ['gtd.calendar-analogy']);
  });

  // ---------------------------------------------------------------- 想清楚 (b7)
  Film.scene('gtd-clarify', T('gtd.b7') - 0.3, T('gtd.b8') + 0.2, ({ root, from, to }) => {
    open(root, from, '下一步行动');
    // close on the goal and its word, back for Drucker's line, across as the email comes in from the right
    const druAt = T('gtd.b7', '德鲁克') - 0.5, mailAt = T('gtd.b7', '一封邮件') - 0.6;
    shot(root, [200, 160, 920, 440], from, druAt, 1.3);
    shot(root, [200, 160, 1260, 920], druAt, mailAt, 1.03);
    shot(root, [200, 160, 1720, 920], mailAt, to, 1.03);
    const goal = K.box(root, 'gtd-goalrow', 200, 166, 1520, null, `<b class="t-num">2</b><span>${GOAL2}</span>`);
    K.show(goal, T('gtd.b7') + 0.1, { y: 10 });
    const cl = K.box(root, 'gtd-clarify', 200, 300, 1000, null, '<b>Clarify</b><span>想清楚</span>');
    K.show(cl, T('gtd.b7', '想清楚') - 0.4, { y: 14 });
    // "not easy": the gloss takes the point until Drucker's line comes in
    const gloss = cl.querySelector('span');
    tl.to(gloss, { color: BLUE, duration: 0.3 }, T('gtd.b7', '并不容易') - 0.2);
    tl.to(gloss, { color: INK2, duration: 0.4 }, T('gtd.b7', '德鲁克') - 0.3);
    const who = K.box(root, 'gtd-drucker-who', 200, 500, 1060, null, 'Allen 转述德鲁克');
    const dr = K.box(root, 'gtd-drucker', 200, 556, 1060, null, '知识工作者的头号任务：界定自己的工作');
    K.show(who, T('gtd.b7', '德鲁克') - 0.3, { y: 8 });
    K.show(dr, T('gtd.b7', '知识工作') - 0.3, { y: 12 });
    const q = K.quote(root, 'gtd.clarify-define-work', 200, 690, 1060, { size: 46 });
    K.show(q.root, T('gtd.b7', '工作不会') - 0.3, { y: 12 });
    K.lit(phrase(q, 'not self-evident'), T('gtd.b7', '摆到眼前') - 0.2);
    // an email that does not say what to do with it
    const env = K.box(root, 'gtd-env', 1340, 320, 380, 240);
    const esv = K.svg(env, null, 380, 240);
    K.path(esv, 'M4,6 L190,130 L376,6', 'ln');
    const tag = K.box(root, 'gtd-env-tag', 1340, 590, 380, 76, '<span>处理方式</span><i class="gtd-tag">未写明</i>');
    K.show(env, T('gtd.b7', '一封邮件') - 0.3, { x: 60, y: 0, duration: 0.7 });
    K.show(tag, T('gtd.b7', '怎么办') - 0.6, { y: 10 });
    K.source(root, 'David Allen, Getting Things Done, 2001, 第 1 章 · gettingthingsdone.com', T('gtd.b7') + 0.4, T('gtd.b7', '德鲁克') - 0.7,
      ['gtd.2001-front-end-decisions', 'gtd.site-2026-clarify']);
    K.source(root, 'David Allen, GTD Podcast #27, 2017', T('gtd.b7', '德鲁克') - 0.1, T('gtd.b7', 'end') + 0.6, ['gtd.clarify-define-work']);
  });

  // ---------------------------------------------------------------- 判断树 (b8–b9)
  Film.scene('gtd-tree', T('gtd.b8') - 0.3, T('gtd.b10') + 0.2, ({ root, from, to }) => {
    open(root, from, '下一步行动');
    shot(root, [200, 160, 1720, 910], from, to, 1.04);
    const sv = K.svg(root, 'gtd-tree-lines');
    const R = { x: 690, y: 170, w: 540, h: 90 }, PN = { x: 500, y: 310, w: 200, h: 64 }, PY = { x: 1340, y: 310, w: 160, h: 64 };
    const NA = { x: 1120, y: 450, w: 600, h: 140 }, PJ = { x: 1120, y: 710, w: 600, h: 140 };
    const top = K.box(root, 'gtd-node first', R.x, R.y, R.w, R.h, '收进来的每一样东西');
    const pNo = K.box(root, 'gtd-pill', PN.x, PN.y, PN.w, PN.h, '无需行动');
    const pYes = K.box(root, 'gtd-pill', PY.x, PY.y, PY.w, PY.h, '需要行动');
    const eNo = K.path(sv, K.elbow(R, PN), 'ln'), eYes = K.path(sv, K.elbow(R, PY), 'ln');
    const LEAF = ['丢弃', '存作参考', '搁置待定'];
    const LB = LEAF.map((_, i) => ({ x: 200 + i * 275, y: 450, w: 250, h: 140 }));
    const leaves = LEAF.map((l, i) => K.box(root, 'gtd-node leaf', LB[i].x, LB[i].y, LB[i].w, LB[i].h, `<b>${l}</b>`));
    const eLeaf = LB.map(b => K.path(sv, K.elbow(PN, b), 'ln'));
    const na = K.box(root, 'gtd-node act', NA.x, NA.y, NA.w, NA.h, '<b>下一步行动</b><span>看得见的具体动作</span>');
    const eNa = K.path(sv, K.elbow(PY, NA), 'ln');
    const pj = K.box(root, 'gtd-node act', PJ.x, PJ.y, PJ.w, PJ.h, '<b>项目</b><span>写明想要的结果</span>');
    const ePj = K.path(sv, `M1420,${NA.y + NA.h} L1420,${PJ.y}`, 'ln');
    const ePjLab = K.box(root, 'gtd-edge-lab', 1440, 626, 280, null, '一个动作做不完');

    K.show(top, T('gtd.b8') + 0.1, { y: 14 });
    K.draw([eNo, eYes], T('gtd.b8', '这是什么') - 0.1, { duration: 0.6, stagger: 0 });
    K.show([pNo, pYes], T('gtd.b8', '要不要') - 0.2, { y: 8, stagger: 0.1 });
    tl.to(pNo, { borderColor: BLUE, color: BLUE, duration: 0.3 }, T('gtd.b8', '不用做') - 0.2);
    K.draw(eLeaf, T('gtd.b8', '三个去处') - 0.4, { duration: 0.5, stagger: 0.08 });
    K.show(leaves[0], T('gtd.b8', '扔掉') - 0.3, { y: 12 });
    K.show(leaves[1], T('gtd.b8', '参考') - 0.5, { y: 12 });
    K.show(leaves[2], T('gtd.b8', '搁着') - 0.4, { y: 12 });
    // actionable: the next action, and a project when one action is not enough
    tl.to(pNo, { borderColor: INK, color: INK, duration: 0.3 }, T('gtd.b9') - 0.2);
    tl.to(pYes, { borderColor: BLUE, color: BLUE, duration: 0.3 }, T('gtd.b9') - 0.2);
    K.draw(eNa, T('gtd.b9', '下一步') - 0.6, { duration: 0.4 });
    K.show(na, T('gtd.b9', '下一步') - 0.3, { y: 12 });
    tl.to([pNo, eNo, ...leaves, ...eLeaf], { opacity: 0.32, duration: 0.5 }, T('gtd.b9', '假如') - 0.6);
    const q1 = K.quote(root, 'gtd.next-action-definition', 200, 650, 860, { size: 38 });
    K.show(q1.root, T('gtd.b9', '假如') - 0.2, { y: 12 });
    tl.to(na, { borderColor: BLUE, duration: 0.3 }, T('gtd.b9', '看得见') - 0.3);
    K.lit(phrase(q1, 'physical, visible action'), T('gtd.b9', '看得见') - 0.15);
    K.hide(q1.root, T('gtd.b9', '一个动作') - 0.4, { duration: 0.35 });
    K.draw(ePj, T('gtd.b9', '一个动作') - 0.2, { duration: 0.4 });
    K.show(ePjLab, T('gtd.b9', '一个动作') - 0.1, { y: 6 });
    tl.to(na, { borderColor: INK, duration: 0.3 }, T('gtd.b9', '项目') - 0.4);
    K.show(pj, T('gtd.b9', '项目') - 0.4, { y: 12 });
    tl.to(pj, { borderColor: BLUE, duration: 0.3 }, T('gtd.b9', '项目') - 0.1);
    const q2 = K.quote(root, 'gtd.project-definition', 200, 650, 860, { size: 38 });
    K.show(q2.root, T('gtd.b9', '一个动作') + 0.1, { y: 12 });
    K.source(root, 'David Allen, GTD Podcast #27, 2017', T('gtd.b8') + 0.4, T('gtd.b9', 'end') + 0.6,
      ['gtd.clarify-nonactionable-three', 'gtd.next-action-definition', 'gtd.project-definition']);
  });

  // ---------------------------------------------------------------- Mom (b10)
  Film.scene('gtd-mom', T('gtd.b10') - 0.3, T('gtd.b11') + 0.2, ({ root, from, to }) => {
    open(root, from, '下一步行动');
    // close on the one word on the list; thinking it through opens the frame to what it becomes
    const thinkAt = T('gtd.b10', '想清楚') - 0.5;
    shot(root, [200, 320, 760, 700], from, thinkAt, 1.3);
    shot(root, [200, 320, 1720, 780], thinkAt, to, 1.06);
    const list = K.box(root, 'gtd-list', 200, 330, 560, 360, '<div class="gtd-list-h">待办清单</div>');
    const item = K.el(list, 'gtd-list-item', '<b>妈妈</b><i>Mom</i>');
    const tags = K.el(list, 'gtd-list-tags');
    const remind = K.el(tags, 'gtd-chip', '提醒');
    const act = K.el(tags, 'gtd-chip off', '行动');
    K.show(list, T('gtd.b10', '清单') - 0.4, { y: 14 });
    K.show(item, T('gtd.b10', '妈妈') - 0.3, { y: 10 });
    K.show(remind, T('gtd.b10', '提醒') - 0.3, { y: 8 });
    K.show(act, T('gtd.b10', '能做') - 0.5, { y: 8 });
    const sv = K.svg(root, 'gtd-mom-lines');
    const a1 = K.path(sv, 'M770,490 C840,490 830,420 892,420', 'ln');
    const a2 = K.path(sv, 'M770,490 C840,490 830,680 892,680', 'ln');
    const pj = K.box(root, 'gtd-out', 900, 330, 820, 180, '<span>项目</span><b>为妈妈办生日聚会</b>');
    const na = K.box(root, 'gtd-out next', 900, 590, 820, 180, '<span>下一步行动</span><b>给姐姐打电话，问妈妈生日怎么过</b>');
    // each branch is drawn as the thing at its end is named
    K.draw(a1, T('gtd.b10', '项目') - 0.6, { duration: 0.5 });
    K.draw(a2, T('gtd.b10', '下一步') - 0.6, { duration: 0.5 });
    K.show(pj, T('gtd.b10', '项目') - 0.2, { y: 12 });
    K.show(na, T('gtd.b10', '下一步') - 0.2, { y: 12 });
    K.source(root, 'David Allen, GTD Times, 2011', T('gtd.b10') + 0.4, T('gtd.b10', 'end') + 0.6, ['gtd.mom-example']);
  });

  // ---------------------------------------------------------------- 九成清单 (b11)
  Film.scene('gtd-lists', T('gtd.b11') - 0.3, T('gtd.b12') + 0.2, ({ root, from, to }) => {
    open(root, from, '下一步行动');
    shot(root, [200, 160, 1720, 880], from, to, 1.06);
    const kick = K.box(root, 'gtd-kicker', 200, 170, 1520, null, 'Allen 见过的待办清单');
    K.show(kick, T('gtd.b11') + 0.2, { y: 10 });
    const lists = Array.from({ length: 10 }, (_, i) => {
      const c = K.box(root, 'gtd-mini', tileX(i), 250, TW, 170);
      for (let k = 0; k < 4; k++) K.box(c, 'gtd-mini-ln', 18, 30 + k * 32, 88 - (k % 2) * 22, 8);
      return c;
    });
    K.show(lists, T('gtd.b11', '待办清单') - 0.4, { y: 14, stagger: 0.05 });
    const nine = lists.slice(0, 9);
    tl.to(nine, { borderColor: RULE, duration: 0.5, stagger: 0.03 }, T('gtd.b11', '九成') - 0.2);
    tl.to(nine.flatMap(c => [...c.children]), { backgroundColor: RULE, duration: 0.5 }, T('gtd.b11', '九成') - 0.2);
    const sv = K.svg(root, 'gtd-brace');
    const br = K.path(sv, `M${tileX(0)},446 L${tileX(0)},462 L${tileX(8) + TW},462 L${tileX(8) + TW},446`, 'ln blue');
    K.draw(br, T('gtd.b11', '九成') - 0.2, { duration: 0.6 });
    const lab = K.box(root, 'gtd-nine', 200, 490, 1520, null, '<b>九成以上</b><span>还没想清楚</span>');
    const [lb, ls] = lab.children;
    K.show(lb, T('gtd.b11', '九成') - 0.1, { y: 10 });
    K.show(ls, T('gtd.b11', '还没想清楚') - 0.2, { y: 10 });
    const q = K.quote(root, 'gtd.todo-incomplete', 200, 650, 1400, { size: 46 });
    K.show(q.root, T('gtd.b11', '压人') - 1.0, { y: 12 });
    K.lit(phrase(q, 'still-unclear things'), T('gtd.b11', '没想完') - 0.15);
    K.source(root, 'David Allen, GTD Times, 2011', T('gtd.b11') + 0.4, T('gtd.b11', 'end') + 0.6, ['gtd.todo-incomplete']);
  });

  // ---------------------------------------------------------------- 两分钟 (b12–b13)
  Film.scene('gtd-twomin', T('gtd.b12') - 0.3, T('gtd.b14') + 0.2, ({ root, from, to }) => {
    open(root, from, '两分钟规则');
    shot(root, [290, 176, 1720, 816], from, T('gtd.b13', '写') - 0.9, 1.1);
    shot(root, [200, 160, 1720, 915], T('gtd.b13', '写') - 0.9, to, 1.03);
    const title = K.box(root, 'gtd-title', 290, 186, 1340, null, '两分钟规则');
    const A = pipe(root, 290, 330, [{ t: '一件事', cls: 'start' }, { t: '下一步已定' }, { t: '本来就要做' }, { t: '两分钟内做完' }, { t: '当场做完', cls: 'end' }]);
    K.show(A.boxes[0], T('gtd.b12') + 0.2, { y: 10 });
    K.show(title, T('gtd.b12', '捷径') - 0.4, { y: 10 });
    const step = (i, at) => { drawArrow(A.segs[i], at - 0.25, { duration: 0.3 }); K.show(A.boxes[i + 1], at, { y: 10, duration: 0.5 }); };
    step(0, T('gtd.b12', '下一步') - 0.2);
    step(1, T('gtd.b12', '本来') - 0.6);
    step(2, T('gtd.b12', '两分钟') - 0.4);
    step(3, T('gtd.b12', '当场') - 0.3);
    // why: looking at it again costs more than doing it
    const bars = K.box(root, 'gtd-bars', 0, 0, 1920, 1080);
    const la = K.box(bars, 'gtd-bar-lab', 290, 572, 400, null, '当场做完');
    const ba = K.box(bars, 'gtd-tbar', 700, 570, 300, 56);
    const lb = K.box(bars, 'gtd-bar-lab', 290, 692, 400, null, '日后再翻看');
    const bb = K.box(bars, 'gtd-tbar later', 700, 690, 780, 56);
    const msv = K.svg(bars, 'gtd-two-mark');
    const mk = K.path(msv, 'M1000,540 L1000,770', 'ln thin');
    const mkl = K.box(bars, 'gtd-mark-lab dim', 1010, 772, 240, null, '两分钟');
    const more = K.box(bars, 'gtd-more', 1500, 694, 220, null, '更费时');
    gsap.set([ba, bb], { scaleX: 0, transformOrigin: '0 50%' });
    K.show(la, T('gtd.b12', '省时间') - 0.8, { y: 8 });
    tl.to(ba, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, T('gtd.b12', '省时间') - 0.6);
    K.draw(mk, T('gtd.b12', '省时间') - 0.2, { duration: 0.4 });
    K.show(mkl, T('gtd.b12', '省时间') - 0.1, { y: 6 });
    K.show(lb, T('gtd.b12', '翻出来') - 0.4, { y: 8 });
    tl.to(bb, { scaleX: 1, duration: 2.2, ease: 'power1.inOut' }, T('gtd.b12', '翻出来') - 0.2);
    K.show(more, T('gtd.b12', '还长') - 0.4, { y: 8 });
    K.source(root, 'David Allen, GTD Podcast #27, 2017 · GTD Podcast #79, 2020 · The Tim Ferriss Show #384, 2019', T('gtd.b12') + 0.6, T('gtd.b12', 'end') + 0.3,
      ['gtd.two-min-rationale-speech', 'gtd.two-min-condition-2020', 'gtd.two-min-spoken-2019']);

    // not a hard rule
    K.hide(bars, T('gtd.b13') - 0.3, { duration: 0.45 });
    const q = K.quote(root, 'gtd.two-min-no-hard-rule', 290, 560, 1340, { size: 48 });
    K.show(q.root, T('gtd.b13') + 0.3, { y: 12 });
    K.lit(phrase(q, 'No hard fast rules'), T('gtd.b13', '死规定') - 0.15);
    tl.to(A.boxes[3], { borderColor: RULE, color: INK3, duration: 0.5 }, T('gtd.b13', '更费时') - 0.2);
    const lonsAt = T('gtd.b13', '写');
    K.source(root, 'David Allen, GTD Times, 2011', T('gtd.b13') + 0.6, lonsAt - 0.9, ['gtd.two-min-no-hard-rule']);

    // Lonsdale's one line, set against Allen's conditions: Allen's row goes back to plain ink as it moves
    K.hide([q.root, title], lonsAt - 0.9, { duration: 0.4 });
    tl.to(A.row, { x: 90, y: 200, duration: 1.0, ease: 'power2.inOut' }, lonsAt - 0.8);
    tl.to(A.boxes[3], { borderColor: INK, color: INK, duration: 0.5 }, lonsAt - 0.8);
    tl.to(A.boxes[4], { backgroundColor: '#f8fafc', borderColor: INK, color: INK, duration: 0.5 }, lonsAt - 0.8);
    const labA = K.box(root, 'gtd-row-lab', 200, 560, 170, null, 'Allen');
    K.show(labA, lonsAt - 0.1, { y: 8 });
    const hd = K.box(root, 'gtd-kicker', 200, 170, 1520, null, 'Joe Lonsdale · Lessons from Peter Thiel<span> · 一句提及</span>');
    K.show(hd, lonsAt - 0.4, { y: 10 });
    K.show(hd.querySelector('span'), T('gtd.b13', '一句话') - 0.2, { y: 0, duration: 0.4 });
    const lq = K.quote(root, 'gtd.lonsdale-mention', 200, 232, 1520, { size: 44 });
    K.show(lq.root, T('gtd.b13', '说在') - 0.2, { y: 12 });
    const L = pipe(root, 380, 720, [{ t: '任务', cls: 'start' }, { t: '未提', cls: 'gap' }, { t: '未提', cls: 'gap' }, { t: '一两分钟<br>能做完' }, { t: '不往后拖', cls: 'end plain' }]);
    const labL = K.box(root, 'gtd-row-lab', 200, 750, 170, null, 'Lonsdale');
    K.show([labL, L.boxes[0]], T('gtd.b13', '一两分钟') - 0.6, { y: 8, stagger: 0.05 });
    // the legend comes with his row and holds to the end: the dashed skip is this series' side-by-side reading
    const leg = K.box(root, 'gtd-legend', 380, 872, 900, null, '<i class="dash"></i>本系列的读法 · 并置对照');
    K.show(leg, T('gtd.b13', '一两分钟') - 0.5, { y: 8 });
    // straight from the task to the time limit: the two conditions are not in his line
    L.segs.slice(0, 3).forEach(a => a.forEach(p => p.remove()));
    const skip = arrow(L.row.querySelector('svg'), 'M186,55 L842,55', 'M828,45 L842,55 L828,65', 'ln dash soft');
    drawArrow(skip, T('gtd.b13', '一两分钟') - 0.6, { duration: 0.5 });
    K.show(L.boxes[3], T('gtd.b13', '一两分钟') - 0.2, { y: 8 });
    drawArrow(L.segs[3], T('gtd.b13', '往后拖') - 0.4, { duration: 0.3 });
    K.show(L.boxes[4], T('gtd.b13', '往后拖') - 0.2, { y: 8 });
    K.show(L.boxes[1], T('gtd.b13', '先定好') - 0.2, { y: 8 });
    K.show(L.boxes[2], T('gtd.b13', '这件事') - 0.1, { y: 8 });
    tl.to([A.boxes[1], A.boxes[2]], { borderColor: BLUE, color: BLUE, duration: 0.4 }, T('gtd.b13', '两个前提') - 0.2);
    K.source(root, 'Joe Lonsdale, Lessons from Peter Thiel, 8VC, 2010 · David Allen, GTD Podcast #79, 2020', lonsAt - 0.3, T('gtd.b13', 'end') + 0.6,
      ['gtd.lonsdale-mention', 'gtd.lonsdale-vs-author']);
  });

  // ---------------------------------------------------------------- 每周回顾 (b14–b15)
  Film.scene('gtd-review', T('gtd.b14') - 0.3, T('gtd.b16') + 0.2, ({ root, from, to }) => {
    open(root, from, '每周回顾');
    // the weeks and the hours first, then down to the checklist as the narration turns to it
    const listAt = T('gtd.b14', '回顾清单') - 0.7;
    shot(root, [200, 160, 1720, 390], from, listAt, 1.06);
    shot(root, [200, 160, 1720, 915], listAt, to, 1.03);
    const weeks = Array.from({ length: 6 }, (_, i) => K.box(root, 'gtd-week', 200 + i * 258, 170, 230, 116, `<span>第 ${i + 1} 周</span>`));
    const rev = weeks.map(w => K.el(w, 'gtd-week-rev', '回顾'));
    K.show(weeks, T('gtd.b14') + 0.2, { y: 10, stagger: 0.05 });
    K.show(rev, T('gtd.b14', '回头看') - 0.3, { y: 6, scale: 0.8, stagger: 0.08 });
    const cad = K.box(root, 'gtd-cadence', 200, 318, 760, null, '<b>每周至少一次</b><span>一到两小时</span>');
    K.show(cad, T('gtd.b14', '每周') - 0.2, { y: 10 });
    // the official checklist, and the one check it spells out
    const card = K.box(root, 'gtd-check', 200, 410, 700, 500, '<div class="gtd-check-h">每周回顾清单 · 2015</div>');
    const rows = ['收件处清零', '各张清单过一遍', '项目逐个看过'].map((t, k) => {
      const r = K.box(card, 'gtd-check-row', 30, 86 + k * 50, 640, 40);
      const box = K.el(r, 'gtd-check-box');
      K.el(r, 'gtd-check-tx', t);
      return box;
    });
    K.show(card, T('gtd.b14', '回顾清单') - 0.4, { y: 14 });
    tl.to(rows[0], { backgroundColor: INK2, duration: 0.2 }, T('gtd.b14', '清空') - 0.1);
    tl.to(rows[1], { backgroundColor: INK2, duration: 0.2 }, T('gtd.b14', '过一遍') - 0.2);
    const q = K.quote(card, 'gtd.weekly-review-checks-next-action', 30, 240, 640, { size: 38 });
    q.root.classList.add('gtd-check-q');
    K.show(q.root, T('gtd.b14', '项目') - 0.3, { y: 10 });
    const ph = K.box(root, 'gtd-proj-h', 1000, 410, 720, null, '逐个项目');
    const projs = Array.from({ length: 5 }, (_, k) => {
      const r = K.box(root, 'gtd-proj', 1000, 470 + k * 86, 720, 68);
      K.el(r, 'gtd-proj-ln').style.width = [380, 300, 420, 340, 260][k] + 'px';
      return r;
    });
    const nas = projs.map(r => K.el(r, 'gtd-proj-na', '下一步'));
    K.show([ph, ...projs], T('gtd.b14', '项目') - 0.2, { y: 10, stagger: 0.05 });
    // the point moves to the projects: the review chips and the hours go back to ink, the third check is ticked
    tl.to(rev, { borderColor: INK, backgroundColor: '#f8fafc', color: INK, duration: 0.4 }, T('gtd.b14', '项目') - 0.3);
    tl.to(cad.querySelector('span'), { color: INK, duration: 0.4 }, T('gtd.b14', '项目') - 0.3);
    tl.to(rows[2], { backgroundColor: INK2, duration: 0.2 }, T('gtd.b14', '项目') - 0.2);
    K.show(nas, T('gtd.b14', '确认') - 0.2, { y: 0, scale: 0.85, duration: 0.4, stagger: 0.22 });
    const qp = phrase(q, 'at least one current next action item');
    K.lit(qp, T('gtd.b14', '至少') - 0.15);
    unlit(qp, T('gtd.b15', '过时') - 0.5);
    K.source(root, 'David Allen, The Tim Ferriss Show #384, 2019 · GTD Weekly Review Checklist, 2015', T('gtd.b14') + 0.5, T('gtd.b14', 'end') + 0.3,
      ['gtd.weekly-review-cadence', 'gtd.weekly-review-get-clear', 'gtd.weekly-review-checks-next-action']);

    // the review stops: the system goes stale, the method is dropped
    const brk = T('gtd.b15', '一断') - 0.3;
    tl.to(rev.slice(3), { autoAlpha: 0, y: 18, duration: 0.45, ease: 'power2.in', stagger: 0.1 }, brk);
    tl.to(weeks.slice(3), { borderColor: RED, duration: 0.4, stagger: 0.1 }, brk);
    tl.to(nas, { backgroundColor: 'rgba(0,0,0,0)', borderColor: RULE, color: INK3, duration: 0.5, stagger: 0.06 }, T('gtd.b15', '过时') - 0.5);
    tl.to(projs, { opacity: 0.45, duration: 0.5 }, T('gtd.b15', '过时') - 0.5);
    const fail = K.box(root, 'gtd-fail', 1000, 318, 720, null, '<b>系统过时</b><span>方法被放下</span>');
    K.show(fail.children[0], T('gtd.b15', '过时') - 0.4, { y: 8 });
    K.show(fail.children[1], T('gtd.b15', '跟着') - 0.3, { y: 8 });
    K.source(root, 'David Allen, The Tim Ferriss Show #384, 2019', T('gtd.b15') + 0.2, T('gtd.b15', 'end') + 0.4, ['gtd.system-decays']);
  });

  // ---------------------------------------------------------------- 时间成本 (b16)
  /* Two different units, so two scales: a one-off span on an hour axis, and a daily hour repeated day after day. */
  Film.scene('gtd-cost', T('gtd.b16') - 0.3, T('gtd.b17') + 0.2, ({ root, from, to }) => {
    open(root, from, '作者自述的代价');
    shot(root, [200, 160, 1720, 745], from, to, 1.06);
    const title = K.box(root, 'gtd-title', 200, 170, 1520, null, '花在方法上的时间');
    K.show(title, T('gtd.b16') + 0.1, { y: 10 });
    // once: 1–6 hours on its own 0–6 hour axis
    const X0 = 760, PX = 150, hx = h => X0 + h * PX;
    const sv = K.svg(root, 'gtd-hours');
    const grid = [0, 1, 2, 3, 4, 5, 6].map(h => K.path(sv, `M${hx(h)},300 L${hx(h)},420`, h === 0 ? 'ln soft' : 'ln thin'));
    const hl = [0, 1, 2, 3, 4, 5, 6].map(h => K.box(root, 'gtd-hour t-num', hx(h) - 40, 430, 80, null, String(h)));
    const unit = K.box(root, 'gtd-hour-unit', hx(6) + 30, 430, 120, null, '小时');
    const l1 = K.box(root, 'gtd-cost-lab', 200, 306, 520, null, '<b>首次全面收集</b><span>中高层 · Allen 的辅导经验</span>');
    const b1 = K.box(root, 'gtd-cost-bar', hx(1), 322, hx(6) - hx(1), 76, '<span>1–6 小时</span>');
    gsap.set(b1, { scaleX: 0, transformOrigin: '0 50%' });
    K.draw(grid, T('gtd.b16', '中高层') - 0.5, { duration: 0.5, stagger: 0.03 });
    K.show([...hl, unit], T('gtd.b16', '中高层') - 0.4, { y: 6, duration: 0.4, stagger: 0.03 });
    K.show(l1, T('gtd.b16', '中高层') - 0.3, { y: 10 });
    tl.to(b1, { scaleX: 1, duration: 1.0, ease: 'power3.out' }, T('gtd.b16', '一到六') - 0.4);
    K.show(b1.children[0], T('gtd.b16', '一到六') + 0.2, { y: 0, duration: 0.4 });
    // every day: one hour, again the next day
    const divider = K.path(sv, 'M200,520 L1720,520', 'ln thin');
    K.draw(divider, T('gtd.b16', '典型') - 0.6, { duration: 0.6 });
    const l2 = K.box(root, 'gtd-cost-lab', 200, 594, 520, null, '<b>处理新输入</b><span>典型专业人士 · Allen 的讲义</span>');
    K.show(l2, T('gtd.b16', '典型') - 0.4, { y: 10 });
    const DX = i => X0 + i * 155;
    const days = Array.from({ length: 6 }, (_, i) => K.box(root, 'gtd-cost-day', DX(i), 624, 140, 64));
    const dayLabs = days.map((_, i) => K.box(root, 'gtd-day-lab', DX(i), 700, 140, null, `第 ${i + 1} 天`));
    const t2 = K.box(root, 'gtd-cost-val', X0, 556, 900, null, '平均每天 1 小时');
    tl.to(b1, { backgroundColor: INK2, borderColor: INK2, duration: 0.4 }, T('gtd.b16', '平均') - 0.4);
    K.show(days, T('gtd.b16', '平均') - 0.4, { x: -12, y: 0, duration: 0.45, stagger: 0.12 });
    K.show(dayLabs, T('gtd.b16', '平均') - 0.35, { y: 6, duration: 0.4, stagger: 0.12 });
    K.show(t2, T('gtd.b16', '每天') - 0.3, { y: 8 });
    K.source(root, 'David Allen, The Tim Ferriss Show #384, 2019 · The Three-fold Nature of Work, 2016', T('gtd.b16') + 0.5, T('gtd.b16', 'end') + 0.6,
      ['gtd.capture-hours', 'gtd.defining-work-hour']);
  });

  // ---------------------------------------------------------------- 作者讲的代价 (b17)
  Film.scene('gtd-limits', T('gtd.b17') - 0.3, T('gtd.b18') + 0.2, ({ root, from, to }) => {
    open(root, from, '作者自述的代价');
    // the two statements first, then down to the five steps when the narration says any of them can fail
    const chainAt = T('gtd.b17', '掉队') - 1.6;
    shot(root, [200, 160, 1720, 500], from, chainAt, 1.06);
    shot(root, [200, 160, 1720, 880], chainAt, to, 1.06);
    const t1 = K.box(root, 'gtd-limit-title', 200, 170, 720, null, '终身手艺 · 不会一夜见效');
    const q1 = K.quote(root, 'gtd.limit-not-overnight', 200, 240, 720, { size: 38 });
    const t2 = K.box(root, 'gtd-limit-title', 1000, 170, 720, null, '理清问题 · 不会让问题消失');
    const q2 = K.quote(root, 'gtd.limit-no-problems-removed', 1000, 240, 720, { size: 38 });
    K.show(t1, T('gtd.b17', '这是') - 0.2, { y: 10 });
    K.show(q1.root, T('gtd.b17', '一夜') - 0.4, { y: 10 });
    K.show(t2, T('gtd.b17', '消失') - 0.8, { y: 10 });
    K.show(q2.root, T('gtd.b17', '理清楚') - 0.4, { y: 10 });
    // any of the five steps can fail
    const STEPS = ['Capture', 'Clarify', 'Organize', 'Reflect', 'Engage'];
    const sx = i => 200 + i * 315;
    const steps = STEPS.map((s, i) => K.box(root, 'gtd-step', sx(i), 600, 260, 96, s));
    const sv = K.svg(root, 'gtd-chain');
    const links = [0, 1, 2, 3].map(i => K.path(sv, `M${sx(i) + 262},648 L${sx(i + 1) - 2},648`, 'ln soft'));
    K.show(steps, T('gtd.b17', '掉队') - 1.1, { y: 10, stagger: 0.07 });
    K.draw(links, T('gtd.b17', '掉队') - 0.8, { duration: 0.3, stagger: 0.07 });
    const FALL = [[0, '收不全', '收不全', -0.3], [1, '下一步没想好', '没想好', -0.5], [3, '不回头看', '不回头看', -0.2]];
    FALL.forEach(([i, t, w, d]) => {
      const m = K.box(root, 'gtd-fall', sx(i), 716, 300, null, t);
      tl.to(steps[i], { borderColor: RED, color: RED, duration: 0.3 }, T('gtd.b17', w) + d);
      K.show(m, T('gtd.b17', w) + d, { y: 8 });
    });
    const any = K.box(root, 'gtd-any', 200, 810, 1520, null, '五步中任何一步都可能掉队');
    K.show(any, T('gtd.b17', '掉队') - 0.3, { y: 8 });
    tl.to(links, { stroke: RED, duration: 0.3 }, T('gtd.b17', '失效') - 0.5);
    K.source(root, 'David Allen, GTD Times, 2015 · GTD Podcast #17, 2016 · The Tim Ferriss Show #384, 2019', T('gtd.b17') + 0.4, T('gtd.b17', 'end') + 0.6,
      ['gtd.limit-not-overnight', 'gtd.limit-no-problems-removed', 'gtd.limit-fall-off']);
  });

  // ---------------------------------------------------------------- 研究出处 (b18)
  Film.scene('gtd-evidence', T('gtd.b18') - 0.3, T('gtd.b19') + 0.2, ({ root, from, to }) => {
    open(root, from, '作者自述的代价');
    shot(root, [200, 168, 1720, 800], from, to, 1.06);
    const th = [K.box(root, 'gtd-th', 200, 178, 1000, null, 'Allen 的说法'), K.box(root, 'gtd-th', 1300, 178, 420, null, '研究出处')];
    const sv = K.svg(root, 'gtd-table');
    const rules = [230, 480, 644, 790].map(y => K.path(sv, `M200,${y} L1720,${y}`, 'ln thin'));
    K.show(th, T('gtd.b18') + 0.2, { y: 8, stagger: 0.08 });
    K.draw(rules, T('gtd.b18') + 0.3, { duration: 0.8, stagger: 0.1 });
    // row 1: a mechanism he states, with no study behind it
    const q1 = K.quote(root, 'gtd.head-no-time-sense', 200, 256, 1000, { size: 40 });
    K.show(q1.root, T('gtd.b18', '比如') - 0.2, { y: 10 });
    const n1 = K.box(root, 'gtd-none', 1300, 266, 420, null, '未给出');
    K.show(n1, T('gtd.b18', '没有给出') - 0.3, { y: 8 });
    // row 2: the research he says the second edition added, in the edition not read
    const ed2 = K.box(root, 'gtd-ed2', 200, 514, 1000, 96, '<b>第 2 版 · 加进认知研究</b>');
    K.show(ed2, T('gtd.b18', '第二版') - 0.3, { y: 10 });
    tl.to(n1, { color: INK, duration: 0.4 }, T('gtd.b18', '第二版') - 0.3);
    const unread = K.box(root, 'gtd-none-tag', 1300, 538, 420, null, '<i class="gtd-tag">未读</i>');
    K.show(unread, T('gtd.b18', '没有读到') - 0.3, { y: 6 });
    // row 3: whether the method works, judged by anyone other than its author
    const r3 = K.box(root, 'gtd-ev-row', 200, 686, 1000, null, '方法效果 · 独立研究或评估');
    const n3 = K.box(root, 'gtd-none', 1300, 680, 420, null, '未找到');
    K.show([r3, n3], T('gtd.b18', '独立') - 0.2, { y: 8, stagger: 0.12 });
    K.source(root, 'David Allen, GTD Podcast #35, 2017 · GTD Times, 2018 · 本系列检索：公开网页，2026-10', T('gtd.b18') + 0.4, T('gtd.b18', 'end') + 0.6,
      ['gtd.head-no-time-sense', 'gtd.staff-comment-method-unchanged', 'gtd.no-independent-evaluation']);
  });

  // ---------------------------------------------------------------- 回到驻场 (b19)
  Film.scene('gtd-field', T('gtd.b19') - 0.3, T('gtd.b20') + 0.2, ({ root, from, to }) => {
    open(root, from, '回到驻场');
    shot(root, [200, MAIL_Y - 10, 1720, LAB_Y + 46], from, to, 1.06);
    const f = flood(root);
    K.show(f.email, T('gtd.b19', '处境') - 0.3, { y: 16 });
    tl.to(f.bcc, { color: BLUE, duration: 0.3 }, T('gtd.b19', '密送'));
    K.show(f.report, T('gtd.b19', '会议纪要') - 0.6, { y: 16 });
    K.show(f.dots, T('gtd.b19', '会议纪要') - 0.3, { y: 0, scale: 0.3, duration: 0.2, stagger: 0.012 });
    const lines = [f.trunkA, f.trunkB, ...f.bus, ...f.drops];
    const seen = T('gtd.b19', '看得到') - 1.6;
    K.draw([f.trunkA, f.trunkB], seen, { duration: 0.3, stagger: 0 });
    K.draw(f.bus, seen + 0.2, { duration: 0.5, stagger: 0 });
    K.show(f.tiles, seen + 0.3, { y: 12, duration: 0.5, stagger: 0.03 });
    K.draw(f.drops, seen + 0.5, { duration: 0.3, stagger: 0.02 });
    pile(f, ALL, 0, 2, seen + 0.8);
    tl.to(lines, { stroke: BLUE, duration: 0.4 }, T('gtd.b19', '看得到') - 0.4);
    const see = K.box(root, 'gtd-group-lab blue', 200, LAB_Y, tileX(4) + TW - 200, null, '最好的一面 · 信息人人可见');
    K.show(see, T('gtd.b19', '看得到') - 0.3, { y: 10 });
    // the point moves to the other side: the visibility goes back to ink
    tl.to(lines, { stroke: INK3, opacity: 0.3, duration: 0.5 }, T('gtd.b19', '另一面') - 0.3);
    tl.to([see, f.bcc], { color: INK, duration: 0.4 }, T('gtd.b19', '另一面') - 0.3);
    pile(f, ALL, 3, 16, T('gtd.b19', '另一面'), 0.03);
    const much = K.box(root, 'gtd-group-lab blue', tileX(5), LAB_Y, tileX(9) + TW - tileX(5), null, '另一面 · 人人收件过多');
    K.show(much, T('gtd.b19', '太多') - 1.4, { y: 10 });
    K.source(root, 'Sanjay Saraf, Lessons from Palantir Alums, 2024', T('gtd.b19') + 0.4, T('gtd.b19', 'end') + 0.6, ['ov.saraf_gtd_bcc_mechanism', 'ov.saraf_best_part']);
  });

  // ---------------------------------------------------------------- Mabrey (b20)
  Film.scene('gtd-mabrey', T('gtd.b20') - 0.3, T('gtd.b21') + 0.2, ({ root, from, to }) => {
    open(root, from, '回到驻场');
    // close on the man and the term he defines, back as responsibility and authority are set side by side
    const dutyAt = T('gtd.b20', '最终结果') - 1.4;
    shot(root, [200, 156, 1000, 330], from, dutyAt, 1.3);
    shot(root, [200, 156, 1720, 900], dutyAt, to, 1.04);
    const who = K.box(root, 'gtd-who', 200, 166, 1520, null, '<b>Ted Mabrey</b><span>Palantir 全球商务负责人</span>');
    K.show(who, T('gtd.b20') + 0.1, { y: 12 });
    const fde = K.box(root, 'gtd-fde', 200, 268, 1520, null, '<b>FDE</b><span>驻客户现场的工程师</span>');
    K.show(fde, T('gtd.b20', '驻到') - 0.4, { y: 10 });
    const l1 = K.box(root, 'gtd-bal-lab', 200, 392, 200, null, '责任');
    const b1 = K.box(root, 'gtd-bal', 420, 380, 1300, 84, '<span>客户业务的最终结果</span>');
    gsap.set(b1, { scaleX: 0, transformOrigin: '0 50%' });
    K.show(l1, T('gtd.b20', '最终结果') - 1.0, { y: 8 });
    tl.to(b1, { scaleX: 1, duration: 1.0, ease: 'power3.out' }, T('gtd.b20', '最终结果') - 0.9);
    K.show(b1.children[0], T('gtd.b20', '最终结果') - 0.2, { y: 0, duration: 0.4 });
    const q = K.quote(root, 'ov.mabrey_owner_no_authority', 200, 640, 1520, { size: 38 });
    K.show(q.root, T('gtd.b20', '首席执行官') - 0.3, { y: 12 });
    // the empty authority bar sits under the full one while CEO is said; its 无 comes with 手里却, so the contrast holds
    const l2 = K.box(root, 'gtd-bal-lab', 200, 512, 200, null, '权力');
    const b2 = K.box(root, 'gtd-bal empty', 420, 500, 1300, 84, '<span>无</span>');
    K.show([l2, b2], T('gtd.b20', '首席执行官') - 0.3, { y: 8, stagger: 0.06 });
    K.show(b2.children[0], T('gtd.b20', '手里却') - 0.2, { y: 0, duration: 0.4 });
    K.lit(phrase(q, 'zero authority'), T('gtd.b20', '没有任何') - 0.15);
    K.source(root, 'Ted Mabrey, Sorry, that isn’t an FDE, 2024 · Stratechery, 2023 · Nabeel Qureshi, Reflections on Palantir, 2024', T('gtd.b20') + 0.4, T('gtd.b20', 'end') + 0.6,
      ['ov.mabrey_owner_no_authority', 'ov.mabrey-title', 'ov.qureshi_fde_onsite_days']);
  });

  // ---------------------------------------------------------------- 本系列的读法 (b21)
  // the body's last scene holds under whatever comes next (the outro, or the next card in the compilation)
  Film.scene('gtd-reading', T('gtd.b21') - 0.3, u.bodyEnd + Series.HOLD, ({ root, from, to }) => {
    open(root, from, '回到驻场');
    // close on what comes in and the system it all leans on; back as the three habits are named
    const habitsAt = T('gtd.b21', '全收出来') - 1.0;
    shot(root, [200, 160, 1130, 660], from, habitsAt, 1.3);
    shot(root, [200, 160, 1720, 840], habitsAt, to, 1.06);
    const leg = K.box(root, 'gtd-legend', 200, 170, 900, null, '<i class="dash"></i>本系列的读法');
    K.show(leg, T('gtd.b21') + 0.1, { y: 8 });
    const YS = [290, 420, 550];
    const ins = [['输入多', '进来'], ['承诺多', '承诺'], ['可差遣的人少', '差遣']].map(([t, w], k) => {
      const b = K.box(root, 'gtd-read', 200, YS[k], 440, 100, t);
      K.show(b, T('gtd.b21', w) - 0.3, { x: -14, y: 0, duration: 0.6 });
      return b;
    });
    const core = K.box(root, 'gtd-read core', 760, 385, 360, 170, '自己的系统');
    const sv = K.svg(root, 'gtd-read-lines');
    const inL = YS.map(y => K.path(sv, `M646,${y + 50} C700,${y + 50} 700,470 752,470`, 'ln dash soft'));
    const outL = YS.map(y => K.path(sv, `M1128,470 C1180,470 1180,${y + 50} 1234,${y + 50}`, 'ln dash soft'));
    K.draw(inL, T('gtd.b21', '依靠') - 0.5, { duration: 0.6, stagger: 0.06 });
    K.show(core, T('gtd.b21', '依靠') - 0.2, { y: 0, scale: 0.94, duration: 0.6 });
    // the same wording as goal 2; no English step names here, so no second gloss for Clarify
    const OUT = [['一切收进系统', '全收出来', -0.2], [GOAL2, '每一样', -0.3], ['每周回顾', '对一次账', -0.7]];
    // each habit's line is drawn as the habit is named
    OUT.forEach(([t, w, d], k) => {
      const b = K.box(root, 'gtd-read out', 1240, YS[k], 480, 100, t);
      K.draw(outL[k], T('gtd.b21', w) + d - 0.4, { duration: 0.5 });
      K.show(b, T('gtd.b21', w) + d, { x: 14, y: 0, duration: 0.6 });
    });
    const note = K.box(root, 'gtd-read-note', 200, 760, 1520, null, '<b>书与邮件处境的连接</b><span>仅见 Sanjay Saraf 一篇</span>');
    K.show(note, T('gtd.b21', '连起来') - 1.4, { y: 8 });
    K.show(note.children[1], T('gtd.b21', '除了') - 0.2, { y: 8 });
    K.source(root, 'Sanjay Saraf, Lessons from Palantir Alums, 2024', T('gtd.b21', '连起来') - 1.2, u.bodyEnd + Series.HOLD, ['ov.saraf_gtd_mandated']);
  });

  // ---------------------------------------------------------------- 收尾（单集）
  Series.outro('gtd');
});
