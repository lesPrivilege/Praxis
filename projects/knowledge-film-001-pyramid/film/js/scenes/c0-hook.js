/* Cold open: a passage nobody can place, the title that places it, the 1972 experiment, the title card. */
(function () {
  const { T } = Film, tl = K.tl;

  /* "先把[东西]分成几批" → character spans; bracketed runs become keyword groups. */
  function setLine(parent, markup) {
    const line = K.el(parent, 'c0-line');
    const chars = [], kws = [];
    let host = line;
    for (const ch of markup) {
      if (ch === '[') { host = document.createElement('span'); host.className = 'kw'; line.appendChild(host); kws.push(host); continue; }
      if (ch === ']') { host = line; continue; }
      const s = document.createElement('span');
      s.className = 'ch'; s.textContent = ch; host.appendChild(s); chars.push(s);
    }
    return { line, chars, kws };
  }

  // ---------------------------------------------------------------- passage
  const A1 = T('c0.8') + 0.5;
  Film.scene('c0-passage', 0, A1, ({ root }) => {
    root.classList.add('paper');
    const world = K.el(root, 'fill c0-world');
    K.el(root, 'grain'); K.el(root, 'vignette');

    const slot = K.box(world, 'c0-slot', 300, 150, 470, 124);
    const slotQ = K.el(slot, 'c0-slot-q', '标题？');
    const title = K.el(slot, 'c0-slot-title', '煮饺子');
    const titleChars = K.split(title);

    const P = [
      ['c0.2', '步骤其实很简单。'],
      ['c0.2', '先把[东西]分成几批，量少的话，一批就够。'],
      ['c0.3', '一次别放太多，宁可少一点。'],
      ['c0.4', '然后等它们[浮上来]，加三次[冷的]，'],
      ['c0.4', '每次都等它重新[滚开]。'],
    ];
    const block = K.box(world, 'c0-block', 300, 338);
    const bySeg = {}, lines = [], kws = [];
    P.forEach(([seg, m], i) => {
      const L = setLine(block, m);
      L.line.style.top = i * 108 + 'px';
      (bySeg[seg] = bySeg[seg] || []).push(...L.chars);
      lines.push(L.line); kws.push(...L.kws);
    });
    for (const seg in bySeg) K.spoken(bySeg[seg], seg);

    // open from black; a caret waits where the text will start
    const black = K.el(root, 'fill', null, { background: '#05080d' });
    tl.to(black, { autoAlpha: 0, duration: 1.3, ease: 'power2.inOut' }, 0.15);
    const caret = K.box(world, 'c0-caret', 300, 346, 5, 70);
    Film.onFrame(t => { caret.style.opacity = t < T('c0.2') - 0.1 && (t * 1.7) % 1 < 0.55 ? 1 : 0; });

    // "可它在说什么？" — the lines lose their footing, an empty title slot shows
    const r = K.rng(11);
    const q = T('c0.5', '可');
    lines.forEach((l, i) => {
      tl.to(l, { x: (r() - 0.35) * 150, y: (r() - 0.5) * 30, rotation: (r() - 0.5) * 4.4, color: '#7d8a9c', duration: 3.6, ease: 'sine.inOut' }, q - 0.5 + i * 0.07);
    });
    K.show(slot, T('c0.5') + 0.2, { y: 0, duration: 0.6 });
    K.show(slotQ, q, { y: 0, duration: 0.5 });

    // "煮饺子" — the title lands, lines snap to it, the words that needed it light up
    const land = T('c0.6', '煮') - 0.12;
    K.hide(slotQ, land - 0.25, { duration: 0.2 });
    gsap.set(titleChars, { yPercent: 115 });
    tl.to(titleChars, { yPercent: 0, duration: 0.7, ease: 'expo.out', stagger: 0.07 }, land);
    tl.to(slot, { '--edge': 1, duration: 0.5, ease: 'power2.out' }, land);
    tl.to(lines, { x: 0, y: 0, rotation: 0, color: '#0d1826', duration: 1.0, ease: 'expo.out', stagger: 0.06 }, land + 0.25);

    const g = K.svg(world);
    const spineX = 258, top = 274;
    const ys = lines.map((_, i) => 338 + i * 108 + 42);
    const spine = K.path(g, `M${spineX},${top} L${spineX},${ys[ys.length - 1]}`, 'ln blue');
    const ticks = ys.map(y => K.path(g, `M${spineX},${y} L${spineX + 26},${y}`, 'ln blue'));
    K.draw(spine, land + 0.3, { duration: 0.9 });
    K.draw(ticks, land + 0.45, { duration: 0.35, stagger: 0.1 });
    tl.to(kws, { '--u': 1, color: '#1f4fe0', duration: 0.5, stagger: 0.12, ease: 'power2.out' }, land + 0.9);

    // "变的是……有没有一个能挂东西的地方" — text gives way to its skeleton
    const sk = T('c0.7', '变的是');
    const bars = lines.map((l, i) => {
      const b = K.box(world, 'c0-bar', 300, 338 + i * 108 + 26, l.offsetWidth, 32);
      gsap.set(b, { autoAlpha: 0, scaleX: 0.96, transformOrigin: '0 50%' });
      return b;
    });
    tl.to(lines, { autoAlpha: 0, duration: 0.6, stagger: 0.05, ease: 'power2.inOut' }, sk);
    tl.to(bars, { autoAlpha: 1, scaleX: 1, duration: 0.6, stagger: 0.05, ease: 'power2.inOut' }, sk);
    tl.to(slot, { '--fill': 1, duration: 0.6, ease: 'power2.inOut' }, sk);
    tl.to(titleChars, { color: '#f2f4f7', duration: 0.6 }, sk);
    tl.to(world, { scale: 0.62, x: -110, y: 30, duration: 1.6, ease: 'power3.inOut', transformOrigin: '300px 540px' }, sk + 0.1);

    const say = K.lines(root, 't-display c0-say', ['先有地方挂，', '话才听得进去。']);
    say.style.cssText += 'position:absolute;left:1090px;top:380px;';
    K.rise(say.inners, T('c0.7', '脑子里') - 0.1, { stagger: 0.16 });
    const note = K.box(root, 't-body c0-note', 1094, 670, 760, null, '句子没变。变的是读者手里有没有主题。');
    K.show(note, T('c0.7', '能挂') + 0.2, { y: 14 });

    tl.to([world, say, note], { autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, A1 - 0.5);
  });

  // ------------------------------------------------------------- experiment
  const B0 = A1 - 0.1, B1 = T('c0.title') + 0.35;
  Film.scene('c0-exp', B0, B1, ({ root }) => {
    root.classList.add('paper');
    const world = K.el(root, 'fill');
    K.el(root, 'grain'); K.el(root, 'vignette');

    const head = K.box(world, 't-label', 200, 132, null, null, 'Bransford &amp; Johnson · 1972');
    const ttl = K.lines(world, 't-title', ['同一段文字，三组读者']);
    ttl.style.cssText += 'position:absolute;left:200px;top:176px;';
    K.show(head, T('c0.8') + 0.05, { y: 0 });
    K.rise(ttl.inners, T('c0.8') + 0.15);

    const rows = [
      { label: '不知道主题', v: 2.82, at: T('c0.9', '不知道') - 0.1, y: 396 },
      { label: '读完之后才被告知', v: 2.65, at: T('c0.10', '读完') + 0.2, y: 548 },
      { label: '读之前就知道', v: 5.83, at: T('c0.9', '事先') + 0.1, y: 700, hot: true },
    ];
    const N = 18, X0 = 700, CW = 46, GAP = 8;
    rows.forEach((r, ri) => {
      const lab = K.box(world, 't-lead c0-rowlab' + (r.hot ? ' blue' : ''), 200, r.y - 4, 490, null, r.label);
      const cells = [];
      for (let i = 0; i < N; i++) {
        const c = K.box(world, 'c0-cell' + (r.hot ? ' hot' : ''), X0 + i * (CW + GAP), r.y, CW, 68);
        cells.push(K.el(c, 'c0-cell-fill'));
      }
      const num = K.box(world, 't-num c0-val' + (r.hot ? ' blue' : ''), X0 + N * (CW + GAP) + 26, r.y - 10, 200, null, '0.00');
      K.show([lab, ...cells.map(c => c.parentNode), num], T('c0.8') + 0.7 + ri * 0.25, { y: 18, stagger: 0.012, duration: 0.5 });
      const o = K.count(num, 0, r.v, r.at, 1.3, v => v.toFixed(2));
      Film.onFrame(() => { for (let i = 0; i < N; i++) cells[i].style.transform = `scaleX(${Math.max(0, Math.min(1, o.v - i))})`; });
      r.lab = lab; r.num = num;
    });
    const axis = K.box(world, 't-small dim', X0, 800, 900, null, '读完后能回忆出的意义单元，平均值（满分 18）');
    K.show(axis, T('c0.8') + 1.6, { y: 0 });

    // "两倍"
    const twice = K.box(world, 'c0-twice t-num blue', X0 + N * (CW + GAP) + 26, 782, 200, null, '2×');
    K.show(twice, T('c0.9', '两倍') - 0.1, { scale: 0.6, y: 0, duration: 0.6, ease: 'back.out(2.2)' });
    // "一样差": a bracket ties the first two rows
    const g = K.svg(world);
    const bx = 676, br = K.path(g, `M${bx},${rows[0].y + 8} L${bx - 22},${rows[0].y + 8} L${bx - 22},${rows[1].y + 60} L${bx},${rows[1].y + 60}`, 'ln');
    K.draw(br, T('c0.10', '一样') - 0.5, { duration: 0.7 });
    tl.to([rows[0].lab, rows[1].lab], { color: '#0d1826', duration: 0.3 }, T('c0.10', '一样'));

    // "主题给得晚，等于没给。"
    const quote = K.lines(world, 't-display c0-quote', ['主题给得晚，等于没给。']);
    quote.style.cssText += 'position:absolute;left:200px;top:848px;';
    K.rise(quote.inners, T('c0.11') - 0.05);
    tl.to([axis, twice], { autoAlpha: 0, duration: 0.3 }, T('c0.11') - 0.3);
    tl.to(rows[1].lab, { color: '#dd4a3c', duration: 0.4 }, T('c0.11', '晚'));

    K.source(root, '数据：Bransford &amp; Johnson (1972)，<i>Journal of Verbal Learning and Verbal Behavior</i> 11，实验 II。开头那段“煮饺子”是仿照原实验材料另写的。', T('c0.8') + 1.2, T('c0.12') - 0.2);

    // "比这个实验早几年，伦敦……" — slide back along a time line
    const s12 = T('c0.12');
    tl.to(world, { y: -1080, duration: 1.2, ease: 'power3.inOut' }, s12 - 0.35);
    const line = K.el(root, 'fill c0-time');
    const g2 = K.svg(line);
    const axisY = 560;
    const long = K.path(g2, `M-200,${axisY} L2400,${axisY}`, 'ln soft');
    K.draw(long, s12 + 0.1, { duration: 1.4, ease: 'power2.inOut' });
    const mk = (x, year, text, cls) => {
      K.path(g2, `M${x},${axisY - 18} L${x},${axisY + 18}`, 'ln');
      const y = K.box(line, 't-num c0-year ' + (cls || ''), x - 150, axisY - 150, 300, null, year);
      const d = K.box(line, 't-body c0-yeartext ' + (cls || ''), x - 300, axisY + 46, 600, null, text);
      return [y, d];
    };
    for (let k = 1; k < 6; k++) K.path(g2, `M${-420 + k * 320},${axisY - 9} L${-420 + k * 320},${axisY + 9}`, 'ln soft');
    const a = mk(1500, '1972', '实验发表');
    const b = mk(-420, '1966', '伦敦 · 麦肯锡办事处', 'blue');
    gsap.set(line, { autoAlpha: 0 });
    tl.to(line, { autoAlpha: 1, duration: 0.6 }, s12 + 0.1);
    tl.to(line, { x: 1380, duration: 3.6, ease: 'power2.inOut' }, T('c0.12', '早') - 0.2);
    tl.to(line, { autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, B1 - 0.9);
  });

  // ------------------------------------------------------------- title card
  const C0 = T('c0.title') - 0.2, C1 = T('c0.title', 'end') + 0.5;
  Film.scene('c0-title', C0, C1, ({ root }) => {
    root.classList.add('night');
    K.el(root, 'grain'); K.el(root, 'vignette');
    gsap.set(root, { opacity: 0 });
    tl.to(root, { opacity: 1, duration: 0.7, ease: 'power2.out' }, C0);

    const g = K.svg(root);
    const cx = 960, y0 = 232, tiers = [[70], [150], [230], [310]];
    const marks = tiers.map(([w], i) => K.path(g, `M${cx - w},${y0 + i * 30} L${cx + w},${y0 + i * 30}`, 'ln', { 'stroke-width': 4 }));
    K.draw(marks, C0 + 0.5, { duration: 0.7, stagger: 0.14, ease: 'power3.inOut' });

    const title = K.box(root, 't-hero c0-title', 0, 392, 1920, null, '金字塔原理');
    const chars = K.split(title);
    gsap.set(chars, { yPercent: 60, opacity: 0 });
    tl.to(chars, { yPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.09 }, C0 + 0.9);

    const sub = K.box(root, 'c0-sub', 0, 628, 1920, null, '写不清楚，是因为还没想完');
    K.show(sub, C0 + 1.9, { y: 18, duration: 0.9 });
    const rule = K.box(root, 'c0-rule', 960 - 60, 742, 120, 2);
    gsap.set(rule, { scaleX: 0 });
    tl.to(rule, { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, C0 + 2.3);
    const en = K.box(root, 'c0-en', 0, 786, 1920, null, 'THE PYRAMID PRINCIPLE &nbsp;·&nbsp; BARBARA MINTO');
    K.show(en, C0 + 2.6, { y: 0, duration: 0.9 });

    tl.to(root, { opacity: 0, duration: 0.6, ease: 'power2.in' }, C1 - 0.65);
  });
})();
