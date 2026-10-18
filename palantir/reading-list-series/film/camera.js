/* Camera. Each scene's content sits in a world layer the camera frames; the fixed parts (grain, vignette,
   chapter tag, source line, corner label) stay on the scene itself.

   At boot the camera looks at what is visible in each scene five times a second and frames it in the safe
   area between the chapter tag and the source line: centred, enlarged up to MAXZ when it is small, left as
   laid out when it does not fit or bleeds off the stage. It looks a second ahead, so new content enters a
   frame that is already making room, and half a second back, so fading content is not cropped. The path is
   smoothed, a slow push-in runs while the scene is on, and scenes cross with a small dolly. Every frame is
   still a pure function of t.

   A scene opts out with root.dataset.cam = 'drift' (push-in and dolly only) or 'off' (no camera);
   an element with data-cam="fixed" stays on the scene, one inside data-cam="ignore" is not framed, and one with
   data-cam="frame" is framed while visible although it paints nothing (a beat's composition set up in advance).
   K.focus(el, from, to) points the camera at one element for a while: the push-in on the line that matters.
   K.frame(root, x0, y0, x1, y1, from, to) holds the camera on a region, so pieces arriving one by one land in a
   frame that is already set. Focus and frame work in 'frame' and 'drift' scenes; where spans overlap, the one
   registered first wins; each starts to pull 0.4 s early and the smoothing begins about a second before that. */
(function () {
  const W = Film.W, H = Film.H;
  const SAFE = { x0: 150, x1: 1770, y0: 150, y1: 930 };
  const CX = (SAFE.x0 + SAFE.x1) / 2, CY = (SAFE.y0 + SAFE.y1) / 2;
  const MAXZ = 1.3, PAD = 24, STEP = 0.2, AHEAD = 1.0, BEHIND = 0.5, SIGMA = 0.6;
  const PUSH = 0.03, PUSH_TAU = 45, DOLLY_IN = 0.018, DOLLY_OUT = 0.012;
  const FIXED = ['grain', 'vignette', 'chrome', 'source', 'sr-corner'];
  const ID = { s: 1, x: CX, y: CY };
  const focuses = [];   // { el, from, to, zoom, pad, scene }

  /* Frame one element from `from` to `to` (seconds), enlarged up to o.zoom. Recorded at build time. */
  function focus(el, from, to, o) {
    o = Object.assign({ zoom: 1.5, pad: 60 }, o);
    const scene = el.closest('.scene');
    if (!scene) throw new Error('K.focus: element is not in a scene');
    if (!(to > from)) throw new Error('K.focus: empty span');
    focuses.push({ el, from, to, zoom: o.zoom, pad: o.pad, scene });
  }
  /* Hold the camera on a region of the stage: an unpainted box the camera is pointed at. */
  function hold(root, x0, y0, x1, y1, from, to, o) {
    const b = document.createElement('div');
    b.className = 'cam-frame';
    b.dataset.cam = 'ignore';
    Object.assign(b.style, { position: 'absolute', left: x0 + 'px', top: y0 + 'px', width: (x1 - x0) + 'px', height: (y1 - y0) + 'px' });
    root.appendChild(b);
    focus(b, from, to, Object.assign({ zoom: MAXZ, pad: 0 }, o));
    return b;
  }

  /* Move the scene's content into its world layer. Called once per scene, right after it is built. */
  function wrap(s) {
    const root = s.root, world = document.createElement('div');
    world.className = 'cam-world';
    let placed = false;
    for (const k of [...root.children]) {
      if (FIXED.some(c => k.classList.contains(c)) || k.dataset.cam === 'fixed') continue;
      if (!placed) { root.insertBefore(world, k); placed = true; }
      world.appendChild(k);
    }
    if (!placed) root.appendChild(world);
    s.world = world;
  }

  // a computed colour that shows: not fully transparent
  const seen = c => { const m = /rgba\([^)]*,\s*([\d.]+)\)/.exec(c); return !m || parseFloat(m[1]) > 0; };

  /* The painted elements of a world: text, images, SVG shapes, boxes with a visible border or fill. */
  function painted(world) {
    const out = [];
    for (const e of world.querySelectorAll('*')) {
      if (e.closest('[data-cam="ignore"]')) continue;
      if (e.dataset && e.dataset.cam === 'frame') { out.push({ e }); continue; }
      if (e instanceof SVGElement) {
        if (e instanceof SVGGeometryElement || e.tagName === 'text' || e.tagName === 'image')
          if (!e.closest('defs, clipPath, mask, marker, pattern')) out.push({ e });
        continue;
      }
      const cs = getComputedStyle(e);
      const text = [...e.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim());
      const fill = seen(cs.backgroundColor) || cs.backgroundImage !== 'none';
      const border = ['Top', 'Right', 'Bottom', 'Left'].some(k => parseFloat(cs['border' + k + 'Width']) > 0 && cs['border' + k + 'Style'] !== 'none' && seen(cs['border' + k + 'Color']));
      if (e.tagName === 'IMG' || text || fill || border) out.push({ e });
    }
    // the boxes that clip each element (masks, windows), nearest first
    for (const p of out) {
      p.clip = [];
      for (let a = p.e.parentElement; a && a !== world; a = a.parentElement)
        if (!(a instanceof SVGElement) && getComputedStyle(a).overflow !== 'visible') p.clip.push(a);
    }
    return out;
  }

  function rectOf(e) {
    const sr = Film.stage.getBoundingClientRect(), f = sr.width / W, r = e.getBoundingClientRect();
    return { x0: (r.left - sr.left) / f, y0: (r.top - sr.top) / f, x1: (r.right - sr.left) / f, y1: (r.bottom - sr.top) / f };
  }

  /* Union of the visible painted boxes, in stage pixels, with the camera at rest. */
  function measure(s) {
    const rect = rectOf;
    const cut = (a, b) => ({ x0: Math.max(a.x0, b.x0), y0: Math.max(a.y0, b.y0), x1: Math.min(a.x1, b.x1), y1: Math.min(a.y1, b.y1) });
    const clips = new Map();
    let box = null, bleed = false;
    for (const p of s.paint) {
      if (!p.e.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
      let r = cut(rect(p.e), { x0: 0, y0: 0, x1: W, y1: H });
      for (const c of p.clip) { if (!clips.has(c)) clips.set(c, rect(c)); r = cut(r, clips.get(c)); }
      if (r.x1 - r.x0 < 2 || r.y1 - r.y0 < 2) continue;
      if (r.x1 - r.x0 > 0.85 * W || r.y1 - r.y0 > 0.85 * H || r.x0 < 2 || r.y0 < 2 || r.x1 > W - 2 || r.y1 > H - 2) bleed = true;
      box = box ? { x0: Math.min(box.x0, r.x0), y0: Math.min(box.y0, r.y0), x1: Math.max(box.x1, r.x1), y1: Math.max(box.y1, r.y1) } : r;
    }
    return { box, bleed };
  }

  /* The framing for a content box: scale and the stage point brought to the centre of the safe area. */
  function frame(box) {
    if (!box) return null;
    const bw = box.x1 - box.x0 + 2 * PAD, bh = box.y1 - box.y0 + 2 * PAD;
    const s = Math.min(MAXZ, (SAFE.x1 - SAFE.x0) / bw, (SAFE.y1 - SAFE.y0) / bh);
    if (s < 1) return ID;
    return { s, x: (box.x0 + box.x1) / 2, y: (box.y0 + box.y1) / 2 };
  }
  const fits = (f, box) => {
    const X = x => CX + f.s * (x - f.x), Y = y => CY + f.s * (y - f.y);
    return X(box.x0) >= SAFE.x0 - 40 && X(box.x1) <= SAFE.x1 + 40 && Y(box.y0) >= SAFE.y0 - 40 && Y(box.y1) <= SAFE.y1 + 40;
  };

  function solve() {
    const t0 = performance.now();
    for (const s of Film.scenes) {
      s.world.style.transform = '';
      s.mode = s.root.dataset.cam || 'frame';
      if (s.mode === 'frame') s.paint = painted(s.world);
      s.focused = focuses.some(f => f.scene === s.root);
    }
    // sample every framed scene, and every drifting scene with a focus, over its own span
    const framed = Film.scenes.filter(s => s.mode === 'frame' || (s.mode === 'drift' && s.focused));
    for (const s of framed) s.samples = [];
    const end = Film.duration;
    for (let t = 0; t <= end + 1e-6; t += STEP) {
      const on = framed.filter(s => t >= s.from - 1e-6 && t <= s.to + 1e-6);
      if (!on.length) continue;
      Film.seek(t);
      for (const s of on) {
        const st = s.root.style, keep = [st.opacity, st.visibility];
        st.opacity = '1'; st.visibility = 'visible';
        const smp = Object.assign({ t }, s.mode === 'frame' ? measure(s) : { box: null, bleed: true });
        const f = focuses.find(f => f.scene === s.root && t >= f.from - 0.4 && t <= f.to);
        if (f) smp.focus = { box: rectOf(f.el), zoom: f.zoom, pad: f.pad, f };
        s.samples.push(smp);
        st.opacity = keep[0]; st.visibility = keep[1];
      }
    }
    for (const s of Film.scenes) s.path = path(s);
    Film.cameraMs = Math.round(performance.now() - t0);
    Film.onFrame(apply);
  }

  /* Targets per sample, held until the content no longer fits or the framing changes enough to matter,
     then smoothed with a Gaussian that sees ahead as well as behind. */
  function path(s) {
    if (!s.samples || !s.samples.length) return null;
    const S = s.samples, n = S.length;
    const tg = [];
    let cur = null;
    for (let i = 0; i < n; i++) {
      let box = null, bleed = false;
      for (let j = i; j >= 0 && S[j].t >= S[i].t - BEHIND; j--) ({ box, bleed } = join(box, bleed, S[j]));
      for (let j = i + 1; j < n && S[j].t <= S[i].t + AHEAD; j++) ({ box, bleed } = join(box, bleed, S[j]));
      if (S[i].focus) {
        const { box: b, zoom, pad } = S[i].focus;
        const z = Math.min(zoom, (SAFE.x1 - SAFE.x0) / (b.x1 - b.x0 + 2 * pad), (SAFE.y1 - SAFE.y0) / (b.y1 - b.y0 + 2 * pad));
        if (z >= 1) { cur = { s: z, x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2, focus: true }; tg.push(cur); continue; }
        if (!S[i].focus.f.warned) { S[i].focus.f.warned = true; console.warn(`K.focus at ${S[i].t.toFixed(1)} s in ${s.id}: the target does not fit the safe area at 1×, ignored`); }
      }
      const want = bleed ? ID : frame(box);
      if (!want) { tg.push(cur || null); continue; }
      if (cur && cur.focus) cur = null;
      if (!cur || !fits(cur, box || { x0: CX, y0: CY, x1: CX, y1: CY })
          || Math.abs(Math.log(want.s / cur.s)) > 0.03 || Math.hypot(want.x - cur.x, want.y - cur.y) * want.s > 36) cur = want;
      tg.push(cur);
    }
    // a scene that opens on nothing takes its first framing
    const first = tg.find(Boolean) || ID;
    for (let i = 0; i < n && !tg[i]; i++) tg[i] = first;
    for (let i = 1; i < n; i++) if (!tg[i]) tg[i] = tg[i - 1];
    const sig = SIGMA / STEP, R = Math.ceil(3 * sig), w = [];
    for (let k = -R; k <= R; k++) w.push(Math.exp(-(k * k) / (2 * sig * sig)));
    const out = [];
    for (let i = 0; i < n; i++) {
      let ls = 0, x = 0, y = 0, sw = 0;
      for (let k = -R; k <= R; k++) {
        const p = tg[Math.min(n - 1, Math.max(0, i + k))], q = w[k + R];
        ls += q * Math.log(p.s); x += q * p.x; y += q * p.y; sw += q;
      }
      out.push({ t: S[i].t, s: Math.exp(ls / sw), x: x / sw, y: y / sw });
    }
    return out;
  }
  function join(box, bleed, smp) {
    if (smp.bleed) bleed = true;
    if (smp.box) box = box ? { x0: Math.min(box.x0, smp.box.x0), y0: Math.min(box.y0, smp.box.y0), x1: Math.max(box.x1, smp.box.x1), y1: Math.max(box.y1, smp.box.y1) } : smp.box;
    return { box, bleed };
  }

  const clamp = v => Math.max(0, Math.min(1, v));
  const ease = v => v * v * (3 - 2 * v);
  function at(p, t) {
    if (!p) return ID;
    if (t <= p[0].t) return p[0];
    if (t >= p[p.length - 1].t) return p[p.length - 1];
    const i = Math.min(p.length - 2, Math.floor((t - p[0].t) / STEP));
    let a = p[i], b = p[i + 1];
    if (t < a.t || t > b.t) { let j = 0; while (j < p.length - 2 && p[j + 1].t < t) j++; a = p[j]; b = p[j + 1]; }
    const u = (t - a.t) / (b.t - a.t || 1);
    return { s: a.s * Math.pow(b.s / a.s, u), x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
  }

  function apply(t) {
    for (const s of Film.scenes) {
      if (s.mode === 'off' || t < s.from || t >= s.to) continue;
      const f = at(s.path, t);
      const push = 1 + PUSH * (1 - Math.exp(-(t - s.from) / PUSH_TAU));
      const dolly = (1 - DOLLY_IN * (1 - ease(clamp((t - s.from) / 1.2)))) * (1 + DOLLY_OUT * ease(clamp((t - (s.to - 0.9)) / 0.9)));
      const k = f.s * push * dolly;
      s.world.style.transform = `translate(${(CX - k * f.x).toFixed(2)}px, ${(CY - k * f.y).toFixed(2)}px) scale(${k.toFixed(5)})`;
    }
  }

  Film.camera = { wrap, solve, focus, frame: hold, SAFE };
})();
