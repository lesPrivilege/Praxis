/* Series layer: the cards every assembly shares, built from the timeline's
   silent blocks, and the wrapper each unit's scenes.js registers through.

   Block types written by build/assemble.py:
     ident  series ident at the very start
     title  episode title card (standalone only)
     card   chapter card for a unit (compilation only)
     end    sources and image credits, plus the next-episode line in standalone */
(function () {
  const { T } = Film, tl = K.tl;
  const S = Film.series;
  const UNITS = Object.fromEntries(Film.units.map(u => [u.id, u]));

  /* Paper for a card. A later scene draws on top of an earlier one, so a handover is the incoming scene fading in
     over the outgoing one, which holds until it is covered (hold: no fade-out of its own). */
  function paper(root, a, b, o) {
    root.classList.add('paper');
    K.el(root, 'grain'); K.el(root, 'vignette');
    gsap.set(root, { opacity: 0 });
    tl.to(root, { opacity: 1, duration: 0.35, ease: 'power2.out' }, a);
    if (!(o && o.hold)) tl.to(root, { opacity: 0, duration: 0.4, ease: 'power2.in' }, b - 0.4);
  }

  /* Where a card may start: right after the block before it ends (that part's last scene holds until
     HOLD past its end), so no frame between two parts is bare. */
  const HOLD = 0.45;
  function after(b, at) {
    const prev = Film.blocks[Film.blocks.indexOf(b) - 1];
    return prev ? Math.min(at, prev.end + 0.05) : at;
  }

  function ident(b) {
    const a = b.start, z = b.end + 0.3;
    Film.scene('series-ident', a, z, ({ root }) => {
      paper(root, a, z);
      root.dataset.cam = 'drift';
      const lab = K.box(root, 't-label', 200, 360, 1520, null, S.title_en);
      const ttl = K.lines(root, 't-hero sr-title', [S.title_zh]);
      ttl.style.cssText += 'position:absolute;left:192px;top:410px;';
      const rule = K.box(root, 'card-rule', 200, 610, 1520, 3);
      gsap.set(rule, { scaleX: 0, transformOrigin: '0 50%' });
      const tag = K.box(root, 't-lead sr-tag', 200, 640, 1520, null, Film.kind === 'compilation' ? S.compilation_zh : S.tagline_zh);
      K.show(lab, a + 0.2, { y: 0, duration: 0.5 });
      K.rise(ttl.inners, a + 0.35, { duration: 1.0 });
      tl.to(rule, { scaleX: 1, duration: 1.0, ease: 'power3.inOut' }, a + 0.45);
      K.show(tag, a + 0.9, { y: 14, duration: 0.7 });
    });
  }

  /* Title card in standalone, chapter card in the compilation: same object, so a viewer
     who has seen one recognises the other. */
  function unitCard(b, kind) {
    // the card comes up as the part before it ends, and holds under the body's first scene, which fades in over it
    const u = UNITS[b.unit], a = after(b, b.start - 0.2);
    const next = Film.blocks[Film.blocks.indexOf(b) + 1];
    const z = next ? Math.max(b.end + 0.3, next.start + HOLD) : b.end + 0.3;
    Film.scene(`${b.unit}-${kind}`, a, z, ({ root }) => {
      paper(root, a, z, { hold: !!next });
      root.dataset.cam = 'drift';
      if (kind === 'title') K.box(root, 'sr-corner', 80, 64, 900, null, S.title_zh);
      const num = K.box(root, 'card-no t-num', 200, 352, null, null, u.no);
      const rule = K.box(root, 'card-rule', 200, 450, 1520, 3);
      gsap.set(rule, { scaleX: 0, transformOrigin: '0 50%' });
      const ttl = K.lines(root, 't-display card-title', [u.title]);
      ttl.style.cssText += 'position:absolute;left:194px;top:486px;';
      const sub = K.box(root, 't-lead card-sub', 200, 640, 1520, null, u.reading);
      K.show(num, a + 0.3, { y: 0, duration: 0.5 });
      tl.to(rule, { scaleX: 1, duration: 1.0, ease: 'power3.inOut' }, a + 0.3);
      K.rise(ttl.inners, a + 0.5, { duration: 1.0 });
      K.show(sub, a + 1.0, { y: 14, duration: 0.7 });
    });
  }

  /* Sources and credits. Scenes are built in time order and this one starts last,
     so it can list every claim and asset the assembly's scenes actually used. */
  function end(b) {
    // the card's paper fades in over whatever closes the episode, and the list comes up with it
    const a0 = after(b, b.start - 0.6), a = a0 + 0.05, z = Film.duration + 0.01;
    Film.scene('end', a0, z, ({ root }) => {
      paper(root, a0, z + 1);
      root.dataset.cam = 'drift';
      const src = new Map();
      for (const id of Film.used.claims) {
        const c = Film.claim(id), s = (window.SOURCES || {})[c.source_id];
        if (s) src.set(c.source_id, s.credit_zh || s.title);
      }
      const credits = [...new Set([...Film.used.assets].map(id => Film.asset(id).credit_text).filter(Boolean))];
      K.box(root, 'sr-corner', 80, 64, 900, null, S.title_zh);
      // the lists sit in a window; the next-episode line has its own slot under it, so it is there however long they are
      const H = b.next ? 740 : 800;
      const win = K.box(root, 'sr-end-win', 200, 160, 1520, H);
      const col = K.box(win, 'sr-end', 0, 0, 1520, null);
      const blocks = [];
      if (src.size) {
        blocks.push(K.el(col, 'sr-end-h', '出处'));
        for (const t of [...new Set(src.values())].sort()) blocks.push(K.el(col, 'sr-end-li', t));
      }
      if (credits.length) {
        blocks.push(K.el(col, 'sr-end-h', '图片'));
        for (const t of credits) blocks.push(K.el(col, 'sr-end-li', t));
      }
      if (b.next) {
        const n = UNITS[b.next] || b.nextInfo;
        blocks.push(K.box(root, 'sr-end-next', 200, 948, 1520, null, `下一集 · <b>${n.no}</b> ${n.title}`));
      }
      // two columns as soon as one column would run past the window's fade (titles that wrap count too)
      if (col.scrollHeight > H - 60) col.classList.add('two');
      K.show(blocks, a, { y: 10, duration: 0.5, stagger: 0.02 });
      // a list that fits the window stands still, without the fades a scroll needs; one that does not scrolls slowly
      // inside its window instead of shrinking below the readable size
      if (col.scrollHeight <= H) win.classList.add('still');
      else tl.to(col, { y: -(col.scrollHeight - H + 60), duration: Math.max(2, z - a - 3), ease: 'none' }, a + 2);
    });
  }

  /* Chapter tag for a unit's body scenes: number and the chapter title. */
  function chrome(root, u, title, o) {
    return K.chrome(root, Object.assign({ chapter: [UNITS[u].no, title] }, o));
  }

  /* Each unit's scenes.js calls Series.unit('iu', ctx => …). The body is always there;
     intro and outro scenes check ctx.has(id) because the compilation leaves them out. */
  function unit(id, fn) {
    const info = Film.unit(id);
    if (!info) return;
    // intro: the standalone intro's elements, for an episode whose intro needs more beats (null in the compilation);
    // an episode that recomposes the intro sets intro.lean = false to keep the camera off it
    const intro = Film.kind === 'standalone' ? introScene(id) : null;
    fn({ T, tl, has: Film.has, u: info, meta: UNITS[id], intro, standalone: Film.kind === 'standalone', chrome: (root, title, o) => chrome(root, id, title, o) });
  }

  /* The series map: five readings under the job each one serves, in series order. It is this
     series' own reading of the list, so the connectors are dashed and the label says so.
     focus: unit id to highlight in blue. Returns the elements so a scene can animate them further. */
  const MAP = [
    { id: 'iu', word: '问题', book: 'Interviewing Users' },
    { id: 'im', word: '信任', book: 'Impro' },
    { id: 'gtd', word: '事务', book: 'Getting Things Done' },
    { id: 'pr', word: '对错', book: 'Principles（PDF）' },
    { id: 'lt', word: '使命', book: 'The Looming Tower' },
  ];
  function map(root, at, o) {
    o = Object.assign({ focus: null, x: 200, y: 330, w: 1520, label: '本系列的读法', show: true }, o);
    const box = K.box(root, 'sr-map', o.x, o.y, o.w, 420);
    const colW = o.w / MAP.length;
    const sv = K.svg(box, 'sr-map-lines', o.w, 420);
    const line = K.path(sv, `M${colW / 2},210 L${o.w - colW / 2},210`, 'ln dash soft');
    const lab = K.box(box, 'sr-map-label', 0, -70, 600, null, '<i></i>' + o.label);   // the dashed sample, as on every legend
    const cols = MAP.map((m, i) => {
      const c = K.box(box, 'sr-map-col' + (m.id === o.focus ? ' focus' : ''), i * colW, 0, colW, 420);
      c.dataset.unit = m.id;
      K.el(c, 'sr-map-no t-num', String(i + 1).padStart(2, '0'));
      K.el(c, 'sr-map-word', m.word);
      K.el(c, 'sr-map-dot');
      K.el(c, 'sr-map-book', m.book);
      return c;
    });
    if (o.show) {
      K.show(lab, at, { y: 0, duration: 0.5 });
      K.draw(line, at + 0.1, { duration: 1.0 });
      K.show(cols, at + 0.2, { y: 18, duration: 0.6, stagger: 0.09 });
    }
    return { box, cols, line, label: lab };
  }

  /* The standalone intro of an episode: the series map with the previous reading in focus while the narration
     recalls it, then this unit when the narration turns to it (这一集 / 最后一集), with the reading named under the map. */
  function introScene(id) {
    const segs = Film.units && TIMELINE.segments.filter(s => s.unit === id && s.role === 'intro');
    if (!segs || !segs.length) return null;
    const intro = { end: segs[segs.length - 1].end + 0.5 };   // filled when the scene is built: map, reading
    const a = segs[0].start - 0.3, z = segs[segs.length - 1].end + 0.5;
    const word = ['这一集', '最后一集'].find(w => segs[0].plain.includes(w));
    const turn = word ? T(segs[0].id, word) - 0.2 : a + 0.3;
    const i = MAP.findIndex(m => m.id === id), prev = i > 0 ? MAP[i - 1].id : null;
    Film.scene(id + '-intro', a, z, ({ root }) => {
      root.classList.add('paper');
      root.dataset.cam = 'drift';
      K.el(root, 'grain');
      K.box(root, 'sr-corner', 80, 64, 900, null, S.title_zh);
      const m = map(root, a + 0.3, { focus: null });
      Film.onFrame(t => { for (const c of m.cols) c.classList.toggle('focus', c.dataset.unit === (t >= turn ? id : prev)); });
      const rd = K.box(root, 'sr-intro-reading', 200, 820, 1520, null, UNITS[id].reading);
      K.show(rd, turn + 0.3, { y: 10 });
      // once the narration has turned to this unit, the camera leans in on the map and the reading, keeping all five columns
      if (intro.lean !== false && z - turn > 2.5) K.frame(root, 180, 260, 1740, 880, turn + 0.9, z, { zoom: 1.06 });
      gsap.set(root, { opacity: 0 });
      tl.to(root, { opacity: 1, duration: 0.35 }, a);
      Object.assign(intro, { map: m, reading: rd });
    });
    return intro;
  }

  /* The standalone outro, the intro's mirror: the map comes up over the body's last scene as soon as the body ends
     (that scene holds HOLD past the end), focus on this reading until the narration turns to the next one (读),
     and the next episode named under the map with the clause that describes it (看). The last episode closes the
     series instead: `last` is its line, shown on `lastWord`. Stays until the end card has covered it. */
  function outro(id, o) {
    const seg = id + '.o1';
    if (!Film.has(seg)) return;
    o = o || {};
    const u = Film.unit(id), endCard = Film.blocks.find(b => b.type === 'end');
    const a = u.bodyEnd + 0.05, z = endCard ? endCard.start + 0.4 : T(seg, 'end') + 0.5;
    // a standalone stage knows only its own unit; the end block names the next one
    const next = endCard && endCard.next ? Object.assign({ id: endCard.next }, UNITS[endCard.next] || endCard.nextInfo) : null;
    Film.scene(id + '-outro', a, z, ({ root }) => {
      root.classList.add('paper');
      root.dataset.cam = 'drift';
      K.el(root, 'grain');
      K.box(root, 'sr-corner', 80, 64, 900, null, S.title_zh);
      gsap.set(root, { opacity: 0 });
      tl.to(root, { opacity: 1, duration: 0.4 }, a);
      const m = map(root, a, { focus: id, show: false });
      if (next) {
        const turn = T(seg, '读') - 0.15;
        Film.onFrame(t => { for (const c of m.cols) c.classList.toggle('focus', c.dataset.unit === (t >= turn ? next.id : id)); });
      }
      const line = K.box(root, 'sr-next', 200, 820, 1520, null, next ? `下一集 · <b>${next.no}</b> ${next.title}` : o.last);
      K.show(line, next ? T(seg, '看') - 0.25 : T(seg, o.lastWord) - 0.2, { y: 10 });
    });
  }

  window.Series = { unit, chrome, paper, map, introScene, outro, units: UNITS, MAP, HOLD };

  for (const b of Film.blocks) {
    if (b.type === 'ident') ident(b);
    if (b.type === 'title') unitCard(b, 'title');
    if (b.type === 'card') unitCard(b, 'card');
    // built last because it starts last, so the ledgers it lists are complete by then
    if (b.type === 'end') end(b);
  }
})();
