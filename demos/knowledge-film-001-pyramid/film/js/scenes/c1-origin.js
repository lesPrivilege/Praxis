/* Chapter 1 · 起点: who Minto was, what she met in three offices, the shape she drew.
   Two scenes. `c1-file` is her record, typed (c1.1–c1.3). `c1-europe` runs from the desk to the map, the three
   reports, her words, the library and the pyramid (c1.4–c1.11): its objects carry over, so it is one scene. */
(function () {
  const { T } = Film, tl = K.tl;
  const INK = '#0d1826', INK2 = '#3a4658', PAPER = '#f2f4f7', BLUE = '#1f4fe0', LITE = '#b3bdcb';

  Parts.chapterCard('c1', '01', '起点');

  // ------------------------------------------------------------------ helpers
  /* A line of typewriter text, split into characters. */
  function typed(parent, cls, x, y, text) {
    const e = K.box(parent, 'c1-type ' + cls, x, y);
    e.textContent = text;
    e.chars = K.split(e);
    return e;
  }
  /* Hang an opening quotation mark outside the left edge. */
  function hang(e) { e.style.left = e.offsetLeft - e.chars[0].offsetWidth + 'px'; return e; }
  /* Type lines one after another. Returns the runs; `runs.end` is when the last key lands. */
  function typeRuns(lines, at, cps) {
    const runs = [];
    for (const e of lines) { K.type(e.chars, at, cps); runs.push({ e, at, cps }); at += e.chars.length / cps; }
    runs.end = at;
    return runs;
  }
  /* A caret that follows the typing: a pure function of t. */
  function caret(parent, runs, from, to, h, dy) {
    const c = K.el(parent, 'c1-caret');
    c.style.height = h + 'px';
    const pos = runs.map(r => ({ at: r.at, cps: r.cps, x: r.e.offsetLeft, y: r.e.offsetTop + dy, xs: r.e.chars.map(ch => ch.offsetLeft + ch.offsetWidth) }));
    Film.onFrame(t => {
      if (t < from || t > to) { c.style.opacity = 0; return; }
      let cur = pos[0];
      for (const p of pos) if (t >= p.at) cur = p;
      const n = t < cur.at ? 0 : Math.min(cur.xs.length, Math.floor((t - cur.at) * cur.cps) + 1);
      const busy = t >= cur.at && n < cur.xs.length;
      c.style.transform = `translate(${cur.x + (n ? cur.xs[n - 1] : 0) + 8}px,${cur.y}px)`;
      c.style.opacity = busy || (t * 1.7) % 1 < 0.55 ? 1 : 0;
    });
    return c;
  }
  /* A dashed red segment revealed along its length. dir: 'r', 'l' or 'd'. */
  function dash(parent, x, y, len, dir) {
    const v = dir === 'd';
    const e = K.box(parent, v ? 'c1-dv' : 'c1-dh', x, y, v ? 0 : len, v ? len : 0);
    gsap.set(e, { clipPath: { r: 'inset(0% 100% 0% 0%)', l: 'inset(0% 0% 0% 100%)', d: 'inset(0% 0% 100% 0%)' }[dir] });
    e.reveal = (at, dur) => tl.to(e, { clipPath: 'inset(0% 0% 0% 0%)', duration: dur, ease: 'none' }, at);
    return e;
  }
  /* K.draw, but the path stays hidden until its turn: a round cap would otherwise show as a dot. */
  function drawn(paths, at, o) {
    gsap.set(paths, { autoAlpha: 0 });
    tl.to(paths, { autoAlpha: 1, duration: 0.01 }, at);
    return K.draw(paths, at, o);
  }
  function sheet(parent, x, y, w, h) {
    const s = K.box(parent, 'c1-sheet', x, y, w, h);
    s.bg = K.el(s, 'c1-sheet-bg');
    return s;
  }

  /* The chapter's time axis, 1963–1973, top right. Both scenes build the same one. */
  const AX = { x0: 600, y: 78, w: 1200 };
  const yx = y => AX.x0 + (y - 1963) * (AX.w / 10);
  function axis(root) {
    const a = K.el(root, 'c1-axis');
    const line = K.box(a, 'c1-axis-line', AX.x0, AX.y - 1, AX.w, 2);
    const ticks = [];
    for (let y = 1963; y <= 1973; y++) {
      const major = y === 1963 || y === 1966 || y === 1973;
      ticks.push(K.box(a, 'c1-axis-tick', yx(y) - 1, AX.y - (major ? 10 : 5), 2, major ? 20 : 10));
    }
    const prog = K.box(a, 'c1-axis-prog', AX.x0, AX.y - 2, AX.w, 4);
    gsap.set(prog, { scaleX: 0, transformOrigin: '0 50%' });
    const dot = K.box(a, 'c1-axis-dot', AX.x0 - 9, AX.y - 9, 18, 18);
    const labels = {};
    for (const y of [1963, 1966, 1973]) {
      labels[y] = K.box(a, 't-num c1-axis-year', yx(y) - 60, AX.y + 14, 120, null, String(y));
      gsap.set(labels[y], { autoAlpha: 0 });
    }
    function go(year, at, dur) {
      tl.to(dot, { x: yx(year) - AX.x0, duration: dur, ease: 'power3.inOut' }, at);
      tl.to(prog, { scaleX: (year - 1963) / 10, duration: dur, ease: 'power3.inOut' }, at);
      tl.to(labels[year], { autoAlpha: 1, duration: 0.4 }, at + dur - 0.35);
    }
    return { root: a, line, ticks, prog, dot, labels, go };
  }

  // ------------------------------------------------------------------ c1-file
  const cardEnd = T('c1.card', 'end');
  const A0 = cardEnd - 0.1, A1 = T('c1.4') - 0.15;
  Film.scene('c1-file', A0, A1, ({ root }) => {
    root.classList.add('paper');
    const world = K.el(root, 'fill');
    const front = K.el(root, 'fill');
    K.el(root, 'grain'); K.el(root, 'vignette');
    const ax = axis(root);
    K.chrome(root, { chapter: ['01', '起点'] });
    gsap.set(root, { opacity: 0 });
    tl.to(root, { opacity: 1, duration: 0.4, ease: 'power2.out' }, A0);

    // "她叫芭芭拉·明托" — the card's rule stays; the name is typed above it
    const s1 = T('c1.1');
    gsap.set(ax.line, { left: 200, top: 470, width: 1520, height: 3, backgroundColor: INK });
    gsap.set([...ax.ticks, ax.dot], { autoAlpha: 0 });
    const en = typed(world, 'c1-name-en', 192, 250, 'Barbara Minto');
    const nameRuns = typeRuns([en], s1 + 0.04, 15);
    const zh = K.box(world, 'c1-name-zh', 196, 500, null, null, '芭芭拉·明托');
    const zhCh = K.split(zh);
    gsap.set(zhCh, { yPercent: 40, opacity: 0 });
    tl.to(zhCh, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.06 }, T('c1.1', '芭芭拉') - 0.1);

    // "1963年" — the name becomes the file's header, the rule becomes the time axis
    const h0 = T('c1.2') - 0.8;
    caret(world, nameRuns, s1 - 0.1, h0 - 0.05, 172, 14);
    const kEn = 60 / 196, kZh = 40 / 124;
    tl.to(en, { scale: kEn, x: 8, y: 168 - 250, duration: 0.85, ease: 'power3.inOut' }, h0);
    tl.to(zh, { scale: kZh, x: 200 + en.offsetWidth * kEn + 34 - 196, y: 176 - 500, color: INK2, duration: 0.85, ease: 'power3.inOut' }, h0);
    tl.to(ax.line, { left: AX.x0, top: AX.y - 1, width: AX.w, height: 2, backgroundColor: '#7d8a9c', duration: 0.95, ease: 'power3.inOut' }, h0);
    tl.to(ax.ticks, { autoAlpha: 1, duration: 0.3, stagger: 0.03 }, h0 + 0.75);
    tl.to([ax.dot, ax.labels[1963]], { autoAlpha: 1, duration: 0.35 }, h0 + 0.95);

    const yr = K.lines(world, 't-num c1-year', ['1963']);
    yr.style.cssText += 'position:absolute;left:190px;top:250px;';
    K.rise(yr.inners, h0 + 0.7);

    const r1 = K.box(world, 'c1-row-rule', 200, 510, 1520, 2);
    gsap.set(r1, { scaleX: 0 });
    tl.to(r1, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, T('c1.2', '明托') - 0.25);
    const hbs = typed(world, 'c1-row-en', 200, 526, 'Harvard Business School');
    const hbsRuns = typeRuns([hbs], T('c1.2', '哈佛商') - 0.35, 22);
    caret(world, hbsRuns, hbsRuns[0].at - 0.25, hbsRuns.end + 0.6, 76, 10);
    const hbsZh = K.box(world, 'c1-row-zh', 200, 628, null, null, '哈佛商学院 · <b>MBA 毕业</b>');
    K.show(hbsZh, T('c1.2', '毕业') - 0.15, { y: 12, duration: 0.5 });
    const note = K.box(world, 'c1-row-note', 200 + hbsZh.offsetWidth + 60, 628, null, null, '那时，哈佛刚开始把 MBA 学位授给女性');
    const noteCh = K.split(note);
    gsap.set(noteCh, { opacity: 0 });
    tl.to(noteCh, { opacity: 1, duration: 0.3, stagger: 0.14, ease: 'power2.out' }, T('c1.2', '那时') - 0.05);

    // "同一年" — a second entry under the same year
    const s3 = T('c1.3');
    const g = K.svg(world);
    const spine = K.path(g, 'M190,574 L166,574 L166,784 L190,784', 'ln');
    drawn(spine, s3 + 0.02, { duration: 0.8 });
    const r2 = K.box(world, 'c1-row-rule', 200, 720, 1520, 2);
    gsap.set(r2, { scaleX: 0 });
    tl.to(r2, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, s3 + 0.1);
    const mck = typed(world, 'c1-row-en', 200, 736, 'McKinsey & Company · Cleveland');
    const mckRuns = typeRuns([mck], T('c1.3', '麦肯锡') - 0.2, 21);
    caret(world, mckRuns, mckRuns[0].at - 0.25, mckRuns.end + 0.6, 76, 10);
    const mckZh = K.box(world, 'c1-row-zh', 200, 838, null, null, '麦肯锡 · 克利夫兰新办公室');
    K.show(mckZh, T('c1.3', '克利夫兰') + 0.25, { y: 12, duration: 0.5 });
    const hired = K.box(world, 'c1-row-zh', 200 + mckZh.offsetWidth, 838, null, null, '&nbsp;· <b>录用</b>');
    K.show(hired, T('c1.3', '录用') - 0.1, { y: 0, x: -14, duration: 0.5 });

    // "按麦肯锡自己的说法" — scroll down the file; the McKinsey entry heads its own phrase
    const sc = T('c1.3', '按') - 0.25;
    tl.to(world, { y: -550, duration: 1.2, ease: 'power3.inOut' }, sc);
    tl.to([en, zh, yr, r1, hbs, hbsZh, note, g], { autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, sc + 0.1);

    const qa = T('c1.3', '公司') - 0.5;
    const q = ['“the first female MBA', 'professional hire', 'our Firm ever made”'].map((s, i) => typed(front, 'c1-q1', 200, 366 + i * 156, s));
    hang(q[0]);
    const qRuns = typeRuns(q, qa, 24);
    caret(front, qRuns, qa - 0.4, qRuns.end + 0.5, 120, 20);
    const qZh = K.box(front, 'c1-q1-zh', 200, 852, null, null, '公司招进来的第一位女性 MBA');
    K.show(qZh, T('c1.3', '第一') - 0.2, { y: 16 });
    const by = K.box(front, 'c1-by', 200 + qZh.offsetWidth + 44, 874, null, null, '—— 麦肯锡自己的说法');
    K.show(by, T('c1.3', '第一') + 0.5, { y: 0 });
    K.source(root, '原话见麦肯锡校友网访谈（McKinsey Alumni Center）', qa, A1 - 0.45);

    tl.to([world, front], { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, A1 - 0.42);
  });

  // ---------------------------------------------------------------- c1-europe
  const ROWS = ['F', 'C', 'F', 'F', 'C', 'F', 'C', 'F', 'F'];
  const RW = 460, RH = 560;
  const BW = [288, 345, 218, 310, 345, 184, 322, 264, 230];
  const JX = [0, 22, 8, 34, 4, 28, 14, 40, 10];
  const JR = [-1.6, 1.2, 2.2, -1.0, 1.8, -2.4, 0.8, 2.0, -1.4];
  /* One report: nine lines, findings and conclusions in the same mixed order, and a recommendation nothing reaches. */
  function report(parent, x, y, labelled) {
    const s = sheet(parent, x, y, RW, RH);
    s.bars = ROWS.map((k, i) => {
      const b = K.box(s, 'c1-bar' + (k === 'F' ? ' f' : ''), 46, 44 + i * 45, BW[i], 20, labelled ? `<span>${k === 'F' ? '发现' : '结论'}</span>` : null);
      b.kind = k;
      return b;
    });
    s.rec = K.box(s, 'c1-slot', 24, 474, 412, 58, '<span>建议</span>');
    const yC = 44 + 6 * 45 + 9, yF = 44 + 7 * 45 + 9;
    s.tries = [
      [dash(s, 390, yC, 40, 'r'), dash(s, 427, yC + 3, 116, 'd')],
      [dash(s, 28, yF, 50, 'l'), dash(s, 28, yF + 3, 72, 'd')],
    ];
    const g = K.svg(s);
    s.g = g;
    s.xs = [429, 30].map(cx => K.path(g, `M${cx - 9},447 L${cx + 9},465 M${cx + 9},447 L${cx - 9},465`, 'ln red'));
    return s;
  }

  const B0 = A1 - 0.1, B1 = T('c2.card');
  Film.scene('c1-europe', B0, B1, ({ root }) => {
    root.classList.add('paper');
    const mapL = K.el(root, 'fill');
    const desk = K.el(root, 'fill');
    const reps = K.el(root, 'fill');
    const outL = K.el(root, 'fill');
    const enWrap = K.el(root, 'fill');
    const over = K.el(root, 'fill');
    K.el(root, 'grain'); K.el(root, 'vignette');
    const ax = axis(root);
    gsap.set(ax.labels[1963], { autoAlpha: 1 });
    K.chrome(root, { chapter: ['01', '起点'] });

    // ---- map geometry (used by the desk's exit, so it comes first)
    const cam = { p: 0 };
    const K0 = 15.5, K1 = 150, KY = 1.15, LON0 = -0.1, LAT0 = 51.5;
    function proj(lon, lat) {
      const k = K0 * Math.pow(K1 / K0, cam.p);
      const X0 = 1565 + (520 - 1565) * cam.p, Y0 = 430 + (400 - 430) * cam.p;
      return [X0 + (lon - LON0) * k, Y0 - (lat - LAT0) * k * KY];
    }
    const CITY = {
      cle: { lon: -81.7, lat: 41.5, en: 'Cleveland', zh: '克利夫兰' },
      lon: { lon: -0.1, lat: 51.5, en: 'London', zh: '伦敦' },
      par: { lon: 2.35, lat: 48.86, en: 'Paris', zh: '巴黎' },
      dus: { lon: 6.78, lat: 51.23, en: 'Düsseldorf', zh: '杜塞尔多夫' },
    };
    const CLE0 = proj(CITY.cle.lon, CITY.cle.lat);

    // ---- c1.4 "会改报告" — one sheet under the pencil, then reports from every office
    const s4 = T('c1.4');
    const fame = K.box(desk, 't-lead c1-fame', 204, 352, null, null, '名声');
    K.show(fame, T('c1.4', '名声') - 0.4, { y: 14 });
    const edit = K.lines(desk, 't-hero', ['会改报告']);
    edit.style.cssText += 'position:absolute;left:192px;top:426px;';
    K.rise(edit.inners, T('c1.4', '会') - 0.15);
    const fromAll = K.box(desk, 't-lead c1-fame', 204, 644, null, null, '各地办公室的报告');
    K.show(fromAll, T('c1.4', '各地') - 0.1, { y: 14 });

    const obj = K.box(desk, 'c1-deskobj', 830, 236, 980, 600);
    const tray = K.box(obj, '', 530, 10, 430, 580);
    const main = sheet(obj, 30, 10, 430, 580);
    const r = K.rng(41);
    const mb = [];
    for (let i = 0; i < 9; i++) mb.push(K.box(main, 'c1-bar' + (i === 5 ? ' dark' : ''), 46, 50 + i * 56, i === 5 ? 330 : 170 + Math.round(r() * 170), 20));
    K.show(main, B0, { y: 50, duration: 0.75 });

    const te = T('c1.4', '改') - 0.1;
    const strike = K.el(mb[3], 'c1-strike');
    gsap.set(strike, { scaleX: 0 });
    tl.to(strike, { scaleX: 1, duration: 0.35, ease: 'power2.out' }, te);
    tl.to(mb[3], { backgroundColor: LITE, duration: 0.3 }, te + 0.2);
    const mg = K.svg(main);
    const y5 = 50 + 5 * 56 + 10, y0 = 50 + 10;
    const mv = K.path(mg, `M34,${y5} C6,${y5} 6,${y0} 34,${y0}`, 'ln blue');
    drawn(mv, te + 0.3, { duration: 0.6 });
    tl.to(mb[5], { y: -5 * 56, duration: 0.8, ease: 'power3.inOut' }, te + 0.45);
    tl.to(mb.slice(0, 5), { y: 56, duration: 0.8, ease: 'power3.inOut', stagger: 0.03 }, te + 0.5);

    const IN = [[900, -900, -14, 10, -4], [1100, 200, 18, -8, 3], [700, 900, -6, -20, -2], [-200, -1000, 26, 14, 5], [1200, -500, -22, 4, -6], [400, 1000, 8, -4, 1.5]];
    const t5 = T('c1.4', '各地') - 0.15;
    IN.forEach(([fx, fy, dx, dy, rot], i) => {
      const s = sheet(tray, 0, 0, 430, 580);
      for (let k = 0; k < 9; k++) K.box(s, 'c1-bar', 46, 50 + k * 56, 170 + Math.round(r() * 170), 20);
      gsap.set(s, { x: fx, y: fy, rotation: rot + (i % 2 ? 26 : -26) });
      tl.to(s, { x: dx, y: dy, rotation: rot, duration: 0.85, ease: 'expo.out' }, t5 + i * 0.2);
    });

    // the desk shrinks to a point on the map: Cleveland
    const m0 = T('c1.5') - 0.6;
    tl.to([fame, fromAll], { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, m0 - 0.1);
    K.sink(edit.inners, m0 - 0.1, { duration: 0.45 });
    tl.to(obj, { x: CLE0[0] - 1320, y: CLE0[1] - 536, scale: 0.02, duration: 0.9, ease: 'power3.inOut' }, m0);
    tl.to(obj, { autoAlpha: 0, duration: 0.15 }, m0 + 0.85);

    // ---- c1.5 the map: Cleveland → London, then in on Europe: Paris, Düsseldorf
    const mg2 = K.svg(mapL);
    const grat = [];
    const gl = (o, minor) => { o.e = K.sv(mg2, 'line', { class: minor ? 'c1-minor' : 'ln thin' }); o.minor = minor; grat.push(o); };
    for (let lon = -100; lon <= 20; lon += 10) gl({ lon }, false);
    for (let lon = -5; lon <= 12; lon++) if (lon % 10) gl({ lon }, true);
    for (let lat = 30; lat <= 70; lat += 10) gl({ lat }, false);
    for (let lat = 45; lat <= 56; lat++) if (lat % 10) gl({ lat }, true);
    const arcs = [['cle', 'lon', 0.2], ['lon', 'par', -0.3], ['lon', 'dus', 0.16]].map(([a, b, bulge]) => ({
      a: CITY[a], b: CITY[b], bulge, prog: { v: 0 }, e: K.sv(mg2, 'path', { class: 'c1-arc', pathLength: 1 }),
    }));
    for (const k in CITY) {
      const c = CITY[k];
      c.w = K.el(over, 'c1-city'); c.dot = K.el(c.w, 'c1-dot');
      c.lab = K.el(c.w, 'c1-city-en', c.en); c.sub = K.el(c.w, 'c1-city-zh', c.zh);
    }
    const mapEnd = T('c1.6') + 1.2;
    Film.onFrame(t => {
      if (t < B0 || t >= B1) return;
      for (const k in CITY) { const c = CITY[k], p = proj(c.lon, c.lat); c.w.style.transform = `translate(${p[0]}px,${p[1]}px)`; }
      if (t > mapEnd) return;
      const mo = Math.max(0, Math.min(1, (cam.p - 0.3) / 0.5));
      for (const o of grat) {
        const e = o.e;
        if (o.lon !== undefined) { const x = proj(o.lon, LAT0)[0]; e.setAttribute('x1', x); e.setAttribute('x2', x); e.setAttribute('y1', -20); e.setAttribute('y2', 1100); }
        else { const y = proj(LON0, o.lat)[1]; e.setAttribute('y1', y); e.setAttribute('y2', y); e.setAttribute('x1', -20); e.setAttribute('x2', 1940); }
        if (o.minor) e.style.opacity = mo;
      }
      for (const a of arcs) {
        const A = proj(a.a.lon, a.a.lat), B = proj(a.b.lon, a.b.lat);
        const dx = B[0] - A[0], dy = B[1] - A[1];
        const cx = (A[0] + B[0]) / 2 + dy * a.bulge, cy = (A[1] + B[1]) / 2 - dx * a.bulge;
        a.e.setAttribute('d', `M${A[0]},${A[1]} Q${cx},${cy} ${B[0]},${B[1]}`);
        a.e.style.strokeDashoffset = 1 - a.prog.v;
        a.e.style.visibility = a.prog.v > 0.002 ? 'inherit' : 'hidden';
      }
    });

    gsap.set(mapL, { autoAlpha: 0 });
    tl.to(mapL, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, m0 + 0.1);
    const pop = (c, at) => {
      K.show(c.dot, at, { y: 0, scale: 0.2, duration: 0.5, ease: 'back.out(2.4)' });
      K.show([c.lab, c.sub], at + 0.08, { y: 0, x: -12, duration: 0.5, stagger: 0.08 });
    };
    const tLon = T('c1.5', '伦敦');
    pop(CITY.cle, m0 + 0.8);
    const y66 = K.lines(over, 't-num c1-year c1-year-m', ['1966']);
    y66.style.cssText += 'position:absolute;left:192px;top:158px;';
    K.rise(y66.inners, T('c1.5') - 0.05);
    ax.go(1966, T('c1.5') - 0.1, 1.2);
    tl.to(arcs[0].prog, { v: 1, duration: 1.2, ease: 'power2.inOut' }, tLon - 1.3);
    pop(CITY.lon, tLon - 0.15);
    const tz = tLon + 0.3;
    tl.to(cam, { p: 1, duration: 1.25, ease: 'power2.inOut' }, tz);
    tl.to([CITY.cle.dot, CITY.cle.lab, CITY.cle.sub], { autoAlpha: 0, duration: 0.3 }, tz + 0.1);
    tl.to(arcs[1].prog, { v: 1, duration: 0.6, ease: 'power2.inOut' }, T('c1.5', '巴黎') - 0.25);
    pop(CITY.par, T('c1.5', '巴黎') + 0.3);
    tl.to(arcs[2].prog, { v: 1, duration: 0.65, ease: 'power2.inOut' }, T('c1.5', '杜塞尔多夫') - 0.1);
    pop(CITY.dus, T('c1.5', '杜塞尔多夫') + 0.5);
    K.source(root, '行程据麦肯锡校友网访谈；地图为示意', tLon, T('c1.6') - 0.3);

    // ---- c1.6 three offices, three languages, one report
    const s6 = T('c1.6');
    const SX = [200, 730, 1260], SY = 306, HY = 246, LANG = ['UK', 'FR', 'DE'];
    const reports = [report(enWrap, SX[0], SY, true), report(reps, SX[1], SY), report(reps, SX[2], SY)];
    const R0 = reports[0];
    const cityOf = [CITY.lon, CITY.par, CITY.dus];
    cam.p = 1;
    const P1 = cityOf.map(c => proj(c.lon, c.lat));
    cam.p = 0;
    const row = i => reports.map(s => s.bars[i]);
    const kind = k => reports.flatMap(s => s.bars.filter(b => b.kind === k));
    const tags = [], labs = cityOf.map(c => c.lab);

    tl.to(mapL, { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' }, s6 - 0.1);
    K.sink(y66.inners, s6 - 0.25, { duration: 0.45 });
    reports.forEach((s, i) => {
      const at = s6 - 0.1 + i * 0.16, c = cityOf[i];
      gsap.set(s, { x: P1[i][0] - (SX[i] + RW / 2), y: P1[i][1] - (SY + RH / 2), scale: 0.02, autoAlpha: 0 });
      gsap.set([...s.bars, s.rec, ...s.xs], { autoAlpha: 0 });
      gsap.set(s.bars, { scaleX: 0 });
      if (s.bars[0].firstChild) gsap.set(s.bars.map(b => b.firstChild), { autoAlpha: 0 });
      tl.to(s, { autoAlpha: 1, duration: 0.2 }, at);
      tl.to(s, { x: 0, y: 0, scale: 1, duration: 1.0, ease: 'power3.inOut' }, at);
      tl.to([c.dot, c.sub], { autoAlpha: 0, duration: 0.3 }, at);
      tl.to(c.lab, { x: SX[i] - (P1[i][0] + 38), y: HY - (P1[i][1] + 6), duration: 1.0, ease: 'power3.inOut' }, at);
      const tag = K.box(over, 'c1-lang', SX[i], HY, RW, null, `<span>${LANG[i]}</span>`).firstChild;
      K.show(tag, T('c1.6', '报告') - 0.1 + i * 0.14, { y: -16, duration: 0.5 });
      tags.push(tag);
    });
    const tb = Math.max(s6 + 1.2, T('c1.6', '报告') - 0.6);
    for (let i = 0; i < 9; i++) tl.to(row(i), { autoAlpha: 1, scaleX: 1, duration: 0.45, ease: 'power3.out' }, tb + i * 0.08);

    const same = K.lines(over, 't-title', ['同一种毛病']);
    same.style.cssText += 'position:absolute;left:200px;top:126px;';
    K.rise(same.inners, T('c1.6', '一模一样') - 0.15);

    const tj = T('c1.6', '搅') - 0.25;
    for (let i = 0; i < 9; i++) tl.to(row(i), { x: JX[i], rotation: JR[i], duration: 0.7, ease: 'back.out(1.8)' }, tj + i * 0.05);

    const legend = K.box(over, 'c1-legend', 0, 888, 1920, null, '<div><i></i>发现</div><div><i class="dark"></i>结论</div>');
    const tf = T('c1.6', '发现') - 0.12, tc = T('c1.6', '结论') - 0.12;
    tl.to(kind('F'), { backgroundColor: LITE, duration: 0.4, ease: 'power2.out' }, tf);
    K.show(legend.children[0], tf, { y: 12 });
    tl.to(kind('C'), { backgroundColor: INK, duration: 0.4, ease: 'power2.out' }, tc);
    K.show(legend.children[1], tc, { y: 12 });

    const slots = reports.map(s => s.rec);
    tl.to(slots, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, T('c1.6', '哪') - 0.2);
    const tt = T('c1.6', '通') - 0.3;
    reports.forEach(s => s.tries.forEach(([h, v], k) => {
      h.reveal(tt + k * 0.18, 0.18); v.reveal(tt + k * 0.18 + 0.18, 0.4);
      tl.to(s.xs[k], { autoAlpha: 1, duration: 0.15 }, tt + k * 0.18 + 0.58);
    }));
    K.source(root, '示意图，非原始报告。所依据的描述见麦肯锡校友网访谈', s6 + 1.4, T('c1.7', 'end') - 0.7);

    // ---- c1.7 same pattern in every language: so it is not the language
    const s7 = T('c1.7');
    const sweep = K.box(reps, 'c1-sweep', 176, SY, 1568, 4);
    gsap.set(sweep, { autoAlpha: 0, y: 32 });
    tl.to(sweep, { autoAlpha: 1, duration: 0.2 }, s7 - 0.05);
    tl.to(sweep, { y: 440, duration: 1.3, ease: 'power1.inOut' }, s7);
    tl.to(sweep, { autoAlpha: 0, duration: 0.3 }, s7 + 1.25);
    const eqs = [640, 1170].map(x => K.box(over, 'c1-eq', x, SY + RH / 2 - 46, 110, null, '='));
    K.show(eqs, T('c1.7', '毛病') - 0.1, { y: 0, scale: 0.5, duration: 0.5, stagger: 0.16, ease: 'back.out(2.2)' });
    tl.to(tags, { backgroundColor: INK, color: PAPER, duration: 0.3, stagger: 0.1 }, T('c1.7', '不同') - 0.1);
    const fall = T('c1.7', '不是') - 0.15;
    const spin = [-14, 9, 16];
    tags.forEach((g, i) => tl.to(g, { y: 190, rotation: spin[i], autoAlpha: 0, duration: 0.75, ease: 'power2.in' }, fall + i * 0.07));
    labs.forEach((g, i) => tl.to(g, { y: HY - (P1[i][1] + 6) + 190, rotation: -spin[i] * 0.6, autoAlpha: 0, duration: 0.75, ease: 'power2.in' }, fall + 0.12 + i * 0.07));

    const tm = T('c1.7', 'end') - 0.6;
    tl.to([...eqs, legend], { autoAlpha: 0, duration: 0.3 }, tm - 0.15);
    K.sink(same.inners, tm - 0.1, { duration: 0.45 });
    reports.forEach((s, i) => tl.to(s, { x: 200 - SX[i], y: -46, duration: 1.0, ease: 'power3.inOut' }, tm));
    tl.to([reports[1], reports[2]], { autoAlpha: 0, duration: 0.04 }, tm + 1.0);

    // ---- c1.8 her words
    const say = K.el(over, 'fill');
    const q2 = ['“The problem was', 'the thinking,', 'not the language.”'].map((s, i) => typed(say, 'c1-q2', 760, 172 + i * 128, s));
    hang(q2[0]);
    for (let i = 0; i < 12; i++) q2[1].chars[i].style.color = BLUE;
    const ra = typeRuns(q2.slice(0, 2), T('c1.8', '问题') - 0.2, 24);
    const rb = typeRuns(q2.slice(2), T('c1.8', '不在') - 0.15, 24);
    caret(say, [...ra, ...rb], ra[0].at - 0.5, T('c1.8', '人们') - 0.3, 96, 16);
    const zh2 = K.box(say, 'c1-q2-zh', 760, 578, null, null, '<span>问题出在思考，</span><span>不在语言。</span>');
    K.show(zh2.children[0], T('c1.8', '思考') + 0.25, { y: 14 });
    K.show(zh2.children[1], T('c1.8', '语言') + 0.2, { y: 14 });
    const tq3 = T('c1.8', '人们') - 0.1;
    const rl = K.box(say, 'c1-rule', 760, 696, 110, 3);
    gsap.set(rl, { scaleX: 0 });
    tl.to(rl, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, tq3 - 0.25);
    const q3 = ['“People were starting to write without', 'working out their thinking in advance.”'].map((s, i) => typed(say, 'c1-q3', 760, 726 + i * 52, s));
    hang(q3[0]);
    const rc = typeRuns(q3, tq3, 32);
    caret(say, rc, tq3 - 0.2, rc.end + 0.6, 36, 8);
    const zh3 = K.box(say, 'c1-q3-zh', 760, 846, null, null, '还没把想法理清楚，就动笔了。');
    K.show(zh3, T('c1.8', '就') - 0.1, { y: 12 });
    K.source(root, 'Barbara Minto 语，引自麦肯锡校友网访谈（McKinsey Alumni Center）', ra[0].at, T('c1.9') - 0.3);

    // ---- c1.9 the library
    const s9 = T('c1.9');
    tl.to(say, { autoAlpha: 0, x: 40, duration: 0.4, ease: 'power2.in' }, s9 - 0.4);
    const how = K.lines(over, 't-title', ['怎样才算理清楚？']);
    how.style.cssText += 'position:absolute;left:760px;top:150px;';
    K.rise(how.inners, s9 + 0.02);
    const BOOKS = [['PIAGET', 'Jean', '皮亚杰'], ['LÉVI-STRAUSS', 'Claude', '列维-斯特劳斯'], ['BOURBAKI', 'mathematicians', '布尔巴基'],
      ['PARSONS', 'Talcott', '帕森斯'], ['ADLER', 'Mortimer', '艾德勒'], ['BRONOWSKI', 'Jacob', '布罗诺夫斯基']];
    const tLib = T('c1.9', '图书馆') - 0.2;
    const cards = BOOKS.map(([a, b, c], i) => {
      const e = K.box(over, 'c1-card', 760 + (i % 2) * 529, 262 + (i >> 1) * 200, 505, 180,
        `<div class="c1-card-a">${a}</div><div class="c1-card-b"><span>${b}</span><i>${c}</i></div>`);
      K.show(e, tLib + i * 0.2, { y: -40, rotation: i % 2 ? 2 : -2, duration: 0.55 });
      return e;
    });
    const cap = K.box(over, 'c1-cap', 760, 866, null, null, '图书馆 · 讲思维结构的书');
    K.show(cap, T('c1.9', '思维') - 0.1, { y: 12 });
    K.source(root, '书单据麦肯锡校友网访谈', tLib + 0.3, T('c1.9', '最后') - 0.2);
    const tx = T('c1.9', '最后') - 0.15;
    tl.to(cards, { y: 30, autoAlpha: 0, duration: 0.4, stagger: 0.04, ease: 'power2.in' }, tx);
    tl.to(cap, { autoAlpha: 0, duration: 0.3 }, tx);
    K.sink(how.inners, tx, { duration: 0.45 });

    // ---- c1.9–c1.10 the same lines, put in order: a pyramid
    const O = { x: 200, y: SY - 46 };
    const TOP = { x: 780, y: 290, w: 360, h: 84 };
    const MID = [300, 780, 1260].map(x => ({ x, y: 490, w: 360, h: 72 }));
    const BOT = [300, 495, 780, 975, 1260, 1455].map(x => ({ x, y: 680, w: 165, h: 60 }));
    const loc = b => ({ x: b.x - O.x, y: b.y - O.y, w: b.w, h: b.h });
    const to = (b, extra) => Object.assign({ left: b.x - O.x, top: b.y - O.y, width: b.w, height: b.h, duration: 1.0, ease: 'power3.inOut' }, extra);
    const cBars = R0.bars.filter(b => b.kind === 'C'), fBars = R0.bars.filter(b => b.kind === 'F');
    const tp = tx + 0.25;
    tl.to([R0.bg, ...R0.tries.flat(), ...R0.xs], { autoAlpha: 0, duration: 0.5 }, tp);
    R0.bars.forEach((b, i) => tl.to(b, { x: 0, rotation: 0, duration: 0.6, ease: 'power3.inOut' }, tp + 0.1 + i * 0.03));
    tl.to(R0.rec, to(TOP, { backgroundColor: BLUE, borderColor: BLUE }), tp + 0.6);
    tl.to(R0.rec.firstChild, { color: PAPER, fontSize: 40, duration: 1.0, ease: 'power3.inOut' }, tp + 0.6);
    cBars.forEach((b, i) => tl.to(b, to(MID[i]), tp + 0.95 + i * 0.1));
    fBars.forEach((b, i) => tl.to(b, to(BOT[i]), tp + 1.3 + i * 0.06));
    const pg = K.svg(R0);
    const l1 = MID.map(b => K.path(pg, K.elbow(loc(TOP), loc(b)), 'ln'));
    const l2 = BOT.map((b, i) => K.path(pg, K.elbow(loc(MID[i >> 1]), loc(b)), 'ln'));
    const tk = T('c1.10', '金字塔');
    drawn(l1, Math.max(tk - 0.75, tp + 2.0), { duration: 0.5, stagger: 0.06 });
    drawn(l2, Math.max(tk - 0.3, tp + 2.45), { duration: 0.45, stagger: 0.04 });
    const pyLabels = R0.bars.map(b => b.firstChild);
    tl.to(pyLabels, { autoAlpha: 1, duration: 0.4, stagger: 0.03 }, Math.max(tk + 0.3, tp + 3.0));

    // ---- c1.11 1973: she leaves, and takes it with her
    const s11 = T('c1.11');
    gsap.set(enWrap, { transformOrigin: '960px 515px' });
    tl.to([...pyLabels, R0.rec.firstChild], { autoAlpha: 0, duration: 0.3 }, s11 - 0.4);
    tl.to(enWrap, { scale: 0.56, x: 420, y: 10, duration: 1.1, ease: 'power3.inOut' }, s11 - 0.3);
    tl.to([...l1, ...l2], { strokeWidth: 5, duration: 1.1, ease: 'power3.inOut' }, s11 - 0.3);
    ax.go(1973, s11 - 0.2, 1.4);
    const y73 = K.lines(over, 't-num c1-year c1-year-l', ['1973']);
    y73.style.cssText += 'position:absolute;left:190px;top:270px;';
    K.rise(y73.inners, s11 + 0.05);
    const ev = K.lines(over, 't-title c1-73', ['石油危机', '伦敦办公室裁员', '离开麦肯锡']);
    ev.style.cssText += 'position:absolute;left:200px;top:506px;';
    K.rise(ev.inners[0], T('c1.11', '石油') - 0.1);
    K.rise(ev.inners[1], T('c1.11', '伦敦') - 0.1);
    K.rise(ev.inners[2], T('c1.11', '离开') - 0.1);

    const tv = T('c1.11', '她') - 0.4;
    K.sink([y73.inners[0], ...ev.inners], tv, { duration: 0.45, stagger: 0.04 });
    const manLab = K.box(over, 'c1-by', 204, 330, null, null, '写给同事的第一本手册');
    K.show(manLab, tv + 0.3, { y: 12 });
    const man = ['“Skillful Writing', 'through Structured', 'Thinking”'].map((s, i) => typed(over, 'c1-man', 200, 384 + i * 82, s));
    hang(man[0]);
    const rm = typeRuns(man, tv + 0.4, 34);
    const manCaret = caret(over, rm, tv + 0.2, rm.end + 0.5, 58, 12);
    const peers = K.lines(over, 't-title', ['教给同事']);
    peers.style.cssText += 'position:absolute;left:200px;top:660px;';
    K.rise(peers.inners, T('c1.11', '教给') - 0.15);
    const tM = T('c1.11', '教给', 1) - 0.45;
    K.source(root, '手册名据麦肯锡校友网访谈', tv + 0.4, tM - 0.1);
    tl.to([manLab, ...man, manCaret, peers], { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, tM - 0.1);

    // "教给所有人" — the one pyramid goes out
    function mini(cx, cy) {
      const m = K.box(outL, 'c1-mini', cx - 660, cy - 225);
      const sh = b => ({ x: b.x - 300, y: b.y - 290, w: b.w, h: b.h });
      const add = (b, col) => { K.box(m, '', b.x - 300, b.y - 290, b.w, b.h).style.background = col; };
      add(TOP, BLUE); MID.forEach(b => add(b, INK)); BOT.forEach(b => add(b, LITE));
      const g = K.svg(m, null, 1320, 450);
      MID.forEach(b => { K.path(g, K.elbow(sh(TOP), sh(b)), 'ln').style.strokeWidth = '11px'; });
      BOT.forEach((b, i) => { K.path(g, K.elbow(sh(MID[i >> 1]), sh(b)), 'ln').style.strokeWidth = '11px'; });
      return m;
    }
    tl.to(enWrap, { scale: 0.21, x: 0, y: 0, duration: 0.65, ease: 'power3.inOut' }, tM);
    tl.to([...l1, ...l2], { strokeWidth: 11, duration: 0.65, ease: 'power3.inOut' }, tM);
    for (let rr = 0; rr < 3; rr++) for (let c = 0; c < 5; c++) {
      if (rr === 1 && c === 2) continue;
      const cx = 960 + (c - 2) * 350, cy = 515 + (rr - 1) * 215;
      const m = mini(cx, cy), at = tM + 0.42 + (Math.abs(c - 2) + Math.abs(rr - 1) - 1) * 0.13;
      gsap.set(m, { scale: 0.21, x: 960 - cx, y: 515 - cy, autoAlpha: 0 });
      tl.to(m, { autoAlpha: 1, duration: 0.12 }, at);
      tl.to(m, { x: 0, y: 0, duration: 0.7, ease: 'expo.out' }, at);
    }
    const all = K.lines(over, 't-title c1-all', ['教给所有人']);
    all.style.cssText += 'position:absolute;left:0;top:862px;width:1920px;';
    K.rise(all.inners, tM + 0.4);

    tl.to([enWrap, outL, all, ax.root], { autoAlpha: 0, duration: 0.38, ease: 'power2.in' }, B1 - 0.66);
  });
})();
