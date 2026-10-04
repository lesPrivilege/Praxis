/* Scene-building helpers. Convention: initial states are set at build time
   (CSS or K.set); animation uses tl.to() at absolute seconds. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const tl = Film.master;

  function el(parent, cls, html, css) {
    const e = document.createElement('div');
    if (cls) e.className = cls;
    if (html !== undefined && html !== null) e.innerHTML = html;
    if (css) Object.assign(e.style, css);
    parent.appendChild(e);
    return e;
  }
  /* Absolutely placed box. x/y are stage pixels of the top-left corner. */
  function box(parent, cls, x, y, w, h, html) {
    const e = el(parent, cls, html);
    e.style.position = 'absolute';
    e.style.left = x + 'px';
    e.style.top = y + 'px';
    if (w != null) e.style.width = w + 'px';
    if (h != null) e.style.height = h + 'px';
    return e;
  }
  function svg(parent, cls, w, h) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('width', w || Film.W);
    s.setAttribute('height', h || Film.H);
    s.setAttribute('viewBox', `0 0 ${w || Film.W} ${h || Film.H}`);
    if (cls) s.setAttribute('class', cls);
    s.style.position = 'absolute';
    s.style.left = '0';
    s.style.top = '0';
    s.style.overflow = 'visible';
    parent.appendChild(s);
    return s;
  }
  function sv(parent, tag, attrs, text) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    parent.appendChild(e);
    return e;
  }
  const path = (parent, d, cls, attrs) => sv(parent, 'path', Object.assign({ d, class: cls || 'ln' }, attrs));

  /* Wrap each character in a span. Keeps <br> and nested inline tags out: plain text only. */
  function split(e) {
    const text = e.textContent;
    e.textContent = '';
    const out = [];
    for (const ch of text) {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch === ' ' ? ' ' : ch;
      e.appendChild(s);
      out.push(s);
    }
    return out;
  }
  /* A block of lines, each masked so text can rise into place. Returns inner elements. */
  function lines(parent, cls, arr) {
    const wrap = el(parent, 'lines ' + (cls || ''));
    const inners = arr.map(t => {
      const m = el(wrap, 'line-mask');
      return el(m, 'line-inner', t);
    });
    gsap.set(inners, { yPercent: 110 });
    wrap.inners = inners;
    return wrap;
  }
  const rise = (targets, at, o) =>
    tl.to(targets, Object.assign({ yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09 }, o), at);
  const sink = (targets, at, o) =>
    tl.to(targets, Object.assign({ yPercent: -110, duration: 0.6, ease: 'power3.in', stagger: 0.05 }, o), at);

  /* Hidden at build, shown at `at`. */
  function show(targets, at, o) {
    o = Object.assign({ y: 24, duration: 0.7, stagger: 0.06, ease: 'power3.out' }, o);
    const from = { autoAlpha: 0 };
    for (const k of ['x', 'y', 'scale', 'rotation', 'xPercent', 'yPercent']) if (o[k] !== undefined) { from[k] = o[k]; }
    gsap.set(targets, from);
    const to = { autoAlpha: 1, duration: o.duration, stagger: o.stagger, ease: o.ease };
    for (const k of ['x', 'y', 'rotation', 'xPercent', 'yPercent']) if (o[k] !== undefined) to[k] = 0;
    if (o.scale !== undefined) to.scale = 1;
    return tl.to(targets, to, at);
  }
  const hide = (targets, at, o) =>
    tl.to(targets, Object.assign({ autoAlpha: 0, duration: 0.45, ease: 'power2.in', stagger: 0 }, o), at);

  /* Stroke a path from nothing. */
  function draw(p, at, o) {
    const list = p.length !== undefined && !p.getTotalLength ? Array.from(p) : [p];
    for (const q of list) {
      const len = q.getTotalLength();
      q.style.strokeDasharray = len + ' ' + len;
      q.style.strokeDashoffset = len;
    }
    // a round line cap would show as a dot before the stroke starts
    gsap.set(list, { autoAlpha: 0 });
    tl.to(list, { autoAlpha: 1, duration: 0.001, ease: 'none' }, at);
    return tl.to(list, Object.assign({ strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut', stagger: 0.08 }, o), at);
  }
  /* Characters appear one by one, without easing: a typewriter. */
  function type(chars, at, cps) {
    gsap.set(chars, { visibility: 'hidden' });
    return tl.to(chars, { visibility: 'visible', duration: 0.001, stagger: 1 / (cps || 14), ease: 'none' }, at);
  }
  /* A number that counts. Text is written from the tweened value on every frame. */
  function count(e, from, to, at, dur, fmt) {
    const o = { v: from };
    fmt = fmt || (v => String(Math.round(v)));
    e.textContent = fmt(from);
    tl.to(o, { v: to, duration: dur || 1, ease: 'power2.out' }, at);
    Film.onFrame(() => { const s = fmt(o.v); if (e.textContent !== s) e.textContent = s; });
    return o;
  }
  /* Characters appear as the narrator says them. `chars` are the spans of the segment's text, in order;
     punctuation follows the character before it. Returns the time of the last character. */
  function spoken(chars, segId, o) {
    o = Object.assign({ y: 10, duration: 0.3, lead: 0.06 }, o);
    const s = Film.seg(segId);
    const times = [];
    for (const w of s.words) for (let i = 0; i < w.text.length; i++) times.push(w.t + (w.d * i) / w.text.length);
    let pi = 0, last = s.start;
    gsap.set(chars, { opacity: 0, y: o.y });
    for (const c of chars) {
      const ch = c.textContent;
      if (pi < s.plain.length && ch === s.plain[pi]) { last = times[pi] - o.lead; pi++; } else last += 0.03;
      tl.to(c, { opacity: 1, y: 0, duration: o.duration, ease: 'power2.out' }, Math.max(0, last));
    }
    if (pi !== s.plain.length) console.warn('spoken(): text and narration differ in ' + segId, pi, s.plain.length);
    return last;
  }
  /* Deterministic random numbers. */
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  /* Orthogonal connector from the bottom centre of a to the top centre of b. Boxes are {x,y,w,h}. */
  function elbow(a, b, r) {
    const x1 = a.x + a.w / 2, y1 = a.y + a.h, x2 = b.x + b.w / 2, y2 = b.y;
    const ym = y1 + (y2 - y1) * 0.5;
    if (Math.abs(x1 - x2) < 1) return `M${x1},${y1} L${x2},${y2}`;
    r = Math.min(r === undefined ? 14 : r, Math.abs(x2 - x1) / 2, (y2 - y1) / 2);
    const sx = x2 > x1 ? 1 : -1;
    return `M${x1},${y1} L${x1},${ym - r} Q${x1},${ym} ${x1 + sx * r},${ym} L${x2 - sx * r},${ym} Q${x2},${ym} ${x2},${ym + r} L${x2},${y2}`;
  }

  /* Persistent chrome: chapter tag, source line, synthetic-case badge. */
  function chrome(root, o) {
    const c = el(root, 'chrome' + (o.dark ? ' dark' : ''));
    const out = { root: c };
    if (o.chapter) out.chapter = el(c, 'chrome-chapter', `<b>${o.chapter[0]}</b><i></i><span>${o.chapter[1]}</span>`);
    if (o.badge) out.badge = el(c, 'chrome-badge', o.badge);
    return out;
  }
  /* A citation that sits at the bottom-left while the cited fact is on screen. */
  function source(root, text, from, to, dark) {
    const s = el(root, 'source' + (dark ? ' dark' : ''), text);
    gsap.set(s, { autoAlpha: 0 });
    tl.to(s, { autoAlpha: 1, duration: 0.5 }, from);
    tl.to(s, { autoAlpha: 0, duration: 0.4 }, to);
    return s;
  }

  window.K = { el, box, svg, sv, path, split, lines, rise, sink, show, hide, draw, type, spoken, count, rng, elbow, chrome, source, tl };
})();
