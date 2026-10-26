/* Film engine: one paused GSAP master timeline, addressed by absolute seconds.
   Every frame is a pure function of t once boot() has run, so frames can be
   rendered in any order and by several workers.

   The timeline comes from build/assemble.py for one assembly (a standalone
   episode or the compilation). Scenes never hard-code seconds: they ask T()
   for the moment a segment starts or the narrator reaches a word, so the same
   scene code lays itself out in every assembly that contains its segments.
   Adapted from demos/role-baseline-film/film/engine.js. */
(function () {
  const W = 1920, H = 1080;
  gsap.defaults({ ease: 'power3.out', duration: 0.8, lazy: false, overwrite: false });
  gsap.config({ force3D: false, nullTargetWarn: true });
  gsap.ticker.lagSmoothing(0);

  const TL = window.TIMELINE;
  const segs = new Map(TL.segments.map(s => [s.id, s]));
  const blocks = TL.blocks;
  const master = gsap.timeline({ paused: true });
  const scenes = [];
  const frameFns = [];

  /* T('iu.b3')            start of the segment
     T('iu.b3', '安全帽')  moment the narrator reaches that word
     T('iu.b3', 'end')     end of the segment's audio
     T('iu.b3', '安全帽', 1) second occurrence; a trailing number adds seconds.
     T('iu.b3', 1.2)       1.2 s after the segment starts */
  function T(id, word, nth, dt) {
    const s = segs.get(id);
    if (!s) throw new Error('unknown segment ' + id);
    if (typeof word === 'number') return s.start + word;
    if (word === undefined) return s.start;
    if (word === 'end') return s.end + (nth || 0);
    if (typeof nth !== 'number') nth = 0;
    let idx = -1;
    for (let k = 0; k <= nth; k++) idx = s.plain.indexOf(word, idx + 1);
    if (idx < 0) throw new Error('word "' + word + '" not in ' + id + ': ' + s.plain);
    let pos = 0;
    for (const w of s.words) {
      if (idx < pos + w.text.length) return w.t + (w.d * (idx - pos)) / w.text.length + (dt || 0);
      pos += w.text.length;
    }
    return s.end;
  }

  /* Where a unit sits in this assembly: its blocks, first and last body segment. */
  function unit(u) {
    const own = blocks.filter(b => b.unit === u);
    if (!own.length) return null;
    const body = TL.segments.filter(s => s.unit === u && s.role === 'body');
    return {
      id: u,
      start: own[0].start, end: own[own.length - 1].end,
      bodyStart: body.length ? body[0].start : null,
      bodyEnd: body.length ? body[body.length - 1].end : null,
      blocks: own,
    };
  }

  const ALLOWED = new Set(window.ASSET_POLICY || ['approved', 'commentary-review']);
  const Film = (window.Film = {
    W, H, fps: 30, master, T, scenes, duration: TL.duration, chapters: TL.chapters || [], blocks,
    assembly: TL.assembly, kind: TL.kind, units: TL.units, series: TL.series,
    stage: null, time: 0, ready: false, used: { assets: new Set(), claims: new Set() },
    has(id) { return segs.has(id); },
    seg(id) { const s = segs.get(id); if (!s) throw new Error('unknown segment ' + id); return s; },
    unit,
    /* An external image from research/assets.jsonl. Throws for anything the ledger has not cleared. */
    asset(id) {
      const a = (window.ASSETS || {})[id];
      if (!a) throw new Error('asset not in ledger: ' + id);
      if (!ALLOWED.has(a.rights_status)) throw new Error(`asset ${id} is ${a.rights_status}; the build refuses it`);
      Film.used.assets.add(id);
      return a;
    },
    claim(id) {
      const c = (window.CLAIMS || {})[id];
      if (!c) throw new Error('claim not in ledger: ' + id);
      Film.used.claims.add(id);
      return c;
    },
    scene(id, from, to, build) {
      if (!(to > from)) throw new Error(`scene ${id} has no duration (${from}–${to})`);
      scenes.push({ id, from, to, build, root: null });
    },
    onFrame(fn) { frameFns.push(fn); },
    seek(t) {
      t = Math.max(0, Math.min(Film.duration, t));
      Film.time = t;
      master.time(t, false);
      for (const s of scenes) s.root.style.visibility = t >= s.from && t < s.to ? 'visible' : 'hidden';
      for (const fn of frameFns) fn(t);
    },
    boot() {
      Film.stage = document.getElementById('stage');
      scenes.sort((a, b) => a.from - b.from);
      for (const s of scenes) {
        s.root = document.createElement('div');
        s.root.className = 'scene';
        s.root.id = 'scene-' + s.id.replace(/[^\w-]/g, '-');
        s.root.dataset.from = s.from.toFixed(3);
        s.root.dataset.to = s.to.toFixed(3);
        Film.stage.appendChild(s.root);
        s.build({ root: s.root, tl: master, from: s.from, to: s.to });
        Film.camera.wrap(s);
      }
      master.set({}, {}, Film.duration);
      // Initialise every tween in time order, then rewind: start values no longer depend on seek order.
      master.time(master.duration(), false);
      master.time(0, false);
      Film.camera.solve();
      Film.seek(0);
      Film.ready = true;
    },
  });
})();
