/* Scene-building helpers. Convention: initial states are set at build time
   (CSS or K.set); animation uses tl.to() at absolute seconds.
   Adapted from demos/role-baseline-film/film/kit.js; added for this series:
   source() carries claim IDs, quote() and figure() read the two ledgers. */
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

  /* Stroke a path from nothing. Chrome restarts the dash pattern at every subpath, so the subpaths of one path draw
     at the same time; something that must follow (an arrowhead after its shaft) is a path of its own. */
  function draw(p, at, o) {
    const list = p.length !== undefined && !p.getTotalLength ? Array.from(p) : [p];
    o = Object.assign({ duration: 0.8, ease: 'power2.inOut', stagger: 0.08 }, o);
    // a round line cap would show as a dot before the stroke starts
    gsap.set(list, { autoAlpha: 0 });
    tl.to(list, { autoAlpha: 1, duration: 0.001, ease: 'none' }, at);
    let last;
    list.forEach((q, i) => {
      const len = q.getTotalLength(), t0 = at + i * o.stagger;
      const pat = getComputedStyle(q).strokeDasharray;
      if (!pat || pat === 'none') {
        q.style.strokeDasharray = len + ' ' + len;
        q.style.strokeDashoffset = len;
        last = tl.to(q, { strokeDashoffset: 0, duration: o.duration, ease: o.ease }, t0);
        return;
      }
      // a dashed line keeps its dashes while it draws: the pattern up to the drawn length, then one long gap
      const seg = pat.split(/[\s,]+/).map(parseFloat).filter(x => x >= 0);
      const st = { p: 0 };
      const paint = () => {
        const L = st.p * len, out = [];
        for (let acc = 0, k = 0; acc < L; k++) { const d = Math.min(seg[k % seg.length], L - acc); out.push(d); acc += d; }
        if (out.length % 2) out.push(len + 1); else out.push(0, len + 1);
        q.style.strokeDasharray = out.join(' ');
      };
      paint();
      last = tl.to(st, { p: 1, duration: o.duration, ease: o.ease, onUpdate: paint }, t0);
    });
    return last;
  }
  /* The phrase that matters: it turns blue and a thin rule draws under it, left to right. */
  function lit(targets, at, o) {
    o = Object.assign({ color: 'var(--blue)', duration: 0.6 }, o);
    const list = [].concat(targets.length !== undefined && !targets.tagName ? Array.from(targets) : targets);
    for (const e of list) Object.assign(e.style, { backgroundImage: 'linear-gradient(currentColor, currentColor)', backgroundRepeat: 'no-repeat',
      backgroundPosition: '0 96%', backgroundSize: '0% 0.07em', webkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone' });
    tl.to(list, { color: o.color, duration: 0.35, ease: 'power2.out' }, at);
    return tl.to(list, { backgroundSize: '100% 0.07em', duration: o.duration, ease: 'power2.inOut', stagger: 0.12 }, at);
  }
  /* Point the camera at one element for a while, or hold it on a region (film/camera.js). */
  const focus = (e, from, to, o) => Film.camera.focus(e, from, to, o);
  const frame = (root, x0, y0, x1, y1, from, to, o) => Film.camera.frame(root, x0, y0, x1, y1, from, to, o);

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
  /* A citation that sits at the bottom-left while the cited fact is on screen.
     `claims` is one claim ID or a list; each must be in research/claims.jsonl. */
  function source(root, text, from, to, claims, dark) {
    const ids = claims ? [].concat(claims) : [];
    for (const id of ids) Film.claim(id);
    const s = el(root, 'source' + (dark ? ' dark' : ''), text);
    if (ids.length) s.dataset.claim = ids.join(' ');
    gsap.set(s, { autoAlpha: 0 });
    tl.to(s, { autoAlpha: 1, duration: 0.5 }, from);
    tl.to(s, { autoAlpha: 0, duration: 0.4 }, to);
    return s;
  }

  /* A verbatim English quote from the claim ledger, with its Chinese rendering underneath.
     The English comes from the ledger, never from scene code, so the two cannot drift. */
  /* Quotation marks inside a quote swap levels under the outer “”: inner “…” become ‘…’ and inner ‘…’ become “…”.
     A ’ between two letters is an apostrophe and stays. */
  function nestQuotes(t) {
    let depth = 0, out = '';
    for (let i = 0; i < t.length; i++) {
      const ch = t[i], word = /\p{L}/u.test(t[i - 1] || '') && /\p{L}/u.test(t[i + 1] || '');
      if (ch === '‘') { depth++; out += '\u0001'; }
      else if (ch === '’' && depth > 0 && !word) { depth--; out += '\u0002'; }
      else out += ch;
    }
    let open = true;
    out = out.replace(/[“”"]/g, m => m === '“' ? '‘' : m === '”' ? '’' : ((open = !open) ? '’' : '‘'));
    return curly(out.replace(/\u0001/g, '“').replace(/\u0002/g, '”'));
  }
  /* Straight single quotes, as some sources print them: ‘ after a space, a dash or an opening mark, otherwise ’
     (an apostrophe, or a closing quote after a word or punctuation). The source's wording is unchanged. */
  function curly(t) {
    return t.replace(/'/g, (m, i, s) => /^$|[\s(\[“‘—–-]/.test(s[i - 1] || '') ? '‘' : '’');
  }
  function quote(parent, claimId, x, y, w, o) {
    o = Object.assign({ size: 40, zh: true }, o);
    const c = Film.claim(claimId);
    if (!c.quote_en) throw new Error('claim ' + claimId + ' has no quote_en');
    const q = box(parent, 'kq', x, y, w, null);
    q.dataset.claim = claimId;
    q.style.setProperty('--qs', o.size + 'px');
    const en = el(q, 'kq-en', '“' + nestQuotes(c.quote_en) + '”');
    const zh = o.zh && c.quote_zh ? el(q, 'kq-zh', c.quote_zh) : null;
    // the source line at the bottom left names the source; a card carries its own locator only when asked:
    // locator: true for the ledger's screen_locator, or the text itself
    const loc = o.locator ? el(q, 'kq-loc', o.locator === true ? c.screen_locator || '' : o.locator) : null;
    return { root: q, en, zh, loc };
  }

  /* An external image from research/assets.jsonl, with its credit line when the licence asks for one. */
  function figure(parent, assetId, x, y, w, h, o) {
    o = Object.assign({ fit: 'cover', pos: '50% 50%', credit: true }, o);
    const a = Film.asset(assetId);
    const f = box(parent, 'kfig', x, y, w, h);
    f.dataset.asset = assetId;
    const img = document.createElement('img');
    img.src = '../' + a.local_path;
    img.alt = a.title || '';
    img.style.objectFit = o.fit;
    img.style.objectPosition = o.pos;
    f.appendChild(img);
    // a slow push into the picture while its scene is on; `scale` composes with any crop transform a scene sets
    if (o.drift !== false) {
      const sc = parent.closest('.scene'), a0 = +sc.dataset.from, a1 = +sc.dataset.to;
      img.style.transformOrigin = o.pos;
      Film.onFrame(t => { img.style.scale = (1 + 0.05 * Math.max(0, Math.min(1, (t - a0) / (a1 - a0)))).toFixed(4); });
    }
    if (o.credit && a.credit_text) {
      const c = el(f, 'kfig-credit', a.credit_text);
      if (o.creditSide === 'left') c.classList.add('left');
    }
    return f;
  }

  window.K = { el, box, svg, sv, path, split, lines, rise, sink, show, hide, draw, lit, focus, frame, type, spoken, count, rng, elbow, chrome, source, quote, curly, figure, tl };
})();
