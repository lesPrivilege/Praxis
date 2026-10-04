/* Film engine: one paused GSAP master timeline, addressed by absolute seconds.
   Every frame is a pure function of t once boot() has run, so frames can be
   rendered in any order and by several workers. */
(function () {
  const W = 1920, H = 1080;
  gsap.defaults({ ease: 'power3.out', duration: 0.8, lazy: false, overwrite: false });
  gsap.config({ force3D: false, nullTargetWarn: true });
  gsap.ticker.lagSmoothing(0);

  const TL = window.TIMELINE;
  const segs = new Map(TL.segments.map(s => [s.id, s]));
  const master = gsap.timeline({ paused: true });
  const scenes = [];
  const frameFns = [];

  /* T('c1.3')            start of the segment
     T('c1.3', '伦敦')    moment the narrator reaches that word
     T('c1.3', 'end')     end of the segment's audio
     T('c1.3', '伦敦', 1) second occurrence; a trailing number adds seconds. */
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

  const Film = (window.Film = {
    W, H, fps: 30, master, T, scenes, duration: TL.duration, chapters: TL.chapters || [],
    stage: null, time: 0, ready: false,
    seg(id) { const s = segs.get(id); if (!s) throw new Error('unknown segment ' + id); return s; },
    scene(id, from, to, build) { scenes.push({ id, from, to, build, root: null }); },
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
        s.root.id = 'scene-' + s.id;
        Film.stage.appendChild(s.root);
        s.build({ root: s.root, tl: master, from: s.from, to: s.to });
      }
      master.set({}, {}, Film.duration);
      // Initialise every tween in time order, then rewind: start values no longer depend on seek order.
      master.time(master.duration(), false);
      master.time(0, false);
      Film.seek(0);
      Film.ready = true;
    },
  });
})();
