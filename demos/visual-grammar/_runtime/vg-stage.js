/* vg-stage — seekable canvas stage for visual-grammar works.
 *
 * Contract: a work supplies render(ctx, t, env) that is a pure function of t
 * (seconds). Anything stateful (physics, layout) is precomputed at setup with a
 * fixed seed and step, then indexed by t. The stage owns the clock, controls,
 * static plates, and the export hooks the pipeline drives (window.__vg).
 *
 * URL params: ?t=12.5 opens paused at t · ?static=1 opens the static plates ·
 * ?export=1 hides chrome and never starts a RAF loop.
 */
(function () {
  'use strict';

  // ---------- utilities shared by works ----------
  const U = {
    clamp: (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)),
    lerp: (a, b, k) => a + (b - a) * k,
    // progress of t through [a, b], clamped 0..1
    seg: (t, a, b) => U.clamp((t - a) / (b - a)),
    ease: {
      inOut: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
      out: (k) => 1 - Math.pow(1 - k, 3),
      in: (k) => k * k * k,
      outBack: (k) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); },
    },
    // mulberry32: deterministic stream from an integer seed
    rng(seed) {
      let a = seed >>> 0;
      return function () {
        a = (a + 0x6d2b79f5) >>> 0;
        let r = Math.imul(a ^ (a >>> 15), 1 | a);
        r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
      };
    },
    // wrap text to width; returns lines
    wrap(ctx, text, width) {
      const out = [];
      for (const para of String(text).split('\n')) {
        let line = '';
        // CJK wraps per character, Latin per word
        const tokens = para.match(/[　-鿿＀-￯]|[^\s　-鿿＀-￯]+\s*|\s+/g) || [''];
        for (const tok of tokens) {
          const trial = line + tok;
          // closing punctuation never starts a line (kinsoku); let it hang instead
          const closing = /^[，。；：、！？）」』”’》,.;:!?)]/.test(tok);
          if (ctx.measureText(trial).width > width && line && !closing) { out.push(line.trimEnd()); line = tok.trimStart(); }
          else line = trial;
        }
        out.push(line);
      }
      return out;
    },
    fmt(t) {
      const s = Math.max(0, t);
      return `${String(Math.floor(s / 60)).padStart(2, '0')}:${(s % 60).toFixed(2).padStart(5, '0')}`;
    },
  };

  const FONT = '"PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Microsoft YaHei", system-ui, sans-serif';
  const MONO = '"SF Mono", Menlo, "JetBrains Mono", Consolas, monospace';

  // Screen-space chrome burned into every frame so the exported video stays
  // readable with sound off: chapter tag, synthetic label, caption band, progress.
  function hud(ctx, o) {
    const W = o.W || 1920, H = o.H || 1080, ink = o.ink || '#16202c', mute = o.mute || '#8593a3';
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.textBaseline = 'alphabetic';
    if (o.chapter) {
      ctx.font = `600 30px ${FONT}`;
      const w = ctx.measureText(o.chapter).width;
      ctx.fillStyle = o.chip || 'rgba(238,243,248,0.9)';
      ctx.beginPath(); ctx.roundRect(36, 30, w + 40, 58, 6); ctx.fill();
      ctx.fillStyle = ink; ctx.textAlign = 'left'; ctx.fillText(o.chapter, 56, 72);
    }
    const bandY = H - 150;
    ctx.fillStyle = o.band || 'rgba(247,249,251,0.94)'; ctx.fillRect(0, bandY, W, 150);
    ctx.fillStyle = o.rule || '#d9e2ec'; ctx.fillRect(0, bandY, W, 1.5);
    ctx.font = `500 34px ${FONT}`; ctx.fillStyle = ink; ctx.textAlign = 'left';
    U.wrap(ctx, o.caption || '', W - 220).slice(0, 2).forEach((ln, i) => ctx.fillText(ln, 110, bandY + 60 + i * 50));
    if (o.tag) { ctx.font = `500 17px ${MONO}`; ctx.fillStyle = mute; ctx.textAlign = 'right'; ctx.fillText(o.tag, W - 56, H - 18); }
    ctx.fillStyle = o.accent || '#1f6feb'; ctx.fillRect(0, H - 4, W * U.clamp(o.progress || 0), 4);
    ctx.restore();
  }
  // current entry of a [[t0, value], ...] list sorted by t0
  U.at = (list, t) => { let v = list[0][1]; for (const [t0, x] of list) if (t >= t0) v = x; return v; };

  function stage(spec) {
    const params = new URLSearchParams(location.search);
    const exportMode = params.has('export');
    const fps = spec.fps || 30;
    const W = spec.width || 1920, H = spec.height || 1080;
    const duration = spec.duration;
    const chapters = spec.chapters || [];
    const staticTimes = spec.staticTimes || chapters.map((c) => c.t + (c.hold || 1.5));

    document.documentElement.classList.toggle('vg-export', exportMode);
    const root = document.getElementById('vg') || document.body;
    root.classList.add('vg-root');
    root.innerHTML = `
      <header class="vg-head">
        <p class="vg-kicker">${spec.kicker || ''}</p>
        <h1>${spec.title}</h1>
        ${spec.lede ? `<p class="vg-lede">${spec.lede}</p>` : ''}
      </header>
      <div class="vg-frame"><canvas width="${W}" height="${H}" aria-describedby="vg-caption"></canvas></div>
      <div class="vg-controls" role="group" aria-label="时间控制">
        <button type="button" data-act="play" aria-label="播放">播放</button>
        <input type="range" min="0" max="${duration}" step="${1 / fps}" value="0" aria-label="时间轴">
        <output class="vg-time">00:00.00 / ${U.fmt(duration)}</output>
        <button type="button" data-act="static" aria-pressed="false">静态</button>
        ${spec.audio ? '<button type="button" data-act="sound" aria-pressed="false">声音</button>' : ''}
      </div>
      <nav class="vg-chapters" aria-label="段落">${chapters.map((c, i) => `<button type="button" data-ch="${i}">${U.fmt(c.t).slice(0, 5)} ${c.label}</button>`).join('')}</nav>
      <p id="vg-caption" class="vg-caption" aria-live="polite"></p>
      <section class="vg-static" hidden aria-label="静态分镜"></section>
      ${spec.footer ? `<footer class="vg-foot">${spec.footer}</footer>` : ''}`;

    const canvas = root.querySelector('canvas');
    // willReadFrequently pins a 2D canvas to one raster backend from the first frame; otherwise
    // Chrome moves it from GPU to CPU raster after a few readbacks and early fingerprints differ.
    const ctx = canvas.getContext(spec.context || '2d', spec.contextAttributes || (spec.context ? {} : { willReadFrequently: true }));
    const range = root.querySelector('input[type=range]');
    const timeOut = root.querySelector('.vg-time');
    const playBtn = root.querySelector('[data-act=play]');
    const staticBtn = root.querySelector('[data-act=static]');
    const soundBtn = root.querySelector('[data-act=sound]');
    const caption = root.querySelector('.vg-caption');
    const staticSec = root.querySelector('.vg-static');
    const chapterBtns = [...root.querySelectorAll('[data-ch]')];

    const env = { W, H, fps, duration, U, FONT, MONO, canvas };
    let t = 0, playing = false, last = 0, raf = 0;
    let audio = null, soundOn = false;
    if (spec.audio) {
      audio = new Audio(spec.audio);
      audio.preload = 'auto';
    }

    function draw(time) {
      t = U.clamp(time, 0, duration);
      if (ctx.setTransform) ctx.setTransform(1, 0, 0, 1, 0, 0);
      spec.render(ctx, t, env);
      range.value = t;
      timeOut.textContent = `${U.fmt(t)} / ${U.fmt(duration)}`;
      const cap = spec.transcript ? spec.transcript(t) : '';
      if (caption.textContent !== cap) caption.textContent = cap;
      let cur = -1;
      chapters.forEach((c, i) => { if (t >= c.t) cur = i; });
      chapterBtns.forEach((b, i) => b.classList.toggle('on', i === cur));
    }

    function tick(now) {
      if (!playing) return;
      if (audio && soundOn && !audio.paused) {
        draw(audio.currentTime);
      } else {
        draw(t + (now - last) / 1000);
      }
      last = now;
      if (t >= duration) { pause(); return; }
      raf = requestAnimationFrame(tick);
    }
    function play() {
      if (exportMode) return;
      if (t >= duration) draw(0);
      playing = true; last = performance.now();
      playBtn.textContent = '暂停'; playBtn.setAttribute('aria-label', '暂停');
      if (audio && soundOn) { audio.currentTime = t; audio.play().catch(() => {}); }
      raf = requestAnimationFrame(tick);
    }
    function pause() {
      playing = false; cancelAnimationFrame(raf);
      playBtn.textContent = '播放'; playBtn.setAttribute('aria-label', '播放');
      if (audio) audio.pause();
    }
    function seek(time) {
      draw(time);
      if (audio) audio.currentTime = t;
    }
    function setStatic(on) {
      staticSec.hidden = !on;
      staticBtn.setAttribute('aria-pressed', String(on));
      root.classList.toggle('vg-is-static', on);
      if (on) { pause(); buildStatic(); }
    }
    let staticBuilt = false;
    function buildStatic() {
      if (staticBuilt) return;
      const keep = t;
      staticSec.innerHTML = staticTimes.map((st, i) => {
        draw(st);
        const url = canvas.toDataURL('image/jpeg', 0.85);
        const cap = spec.transcript ? spec.transcript(st) : '';
        return `<figure><img src="${url}" alt="${U.fmt(st)} ${cap.replace(/"/g, '&quot;')}"><figcaption><b>${String(i + 1).padStart(2, '0')} · ${U.fmt(st)}</b> ${cap}</figcaption></figure>`;
      }).join('');
      staticBuilt = true;
      draw(keep);
    }

    playBtn.addEventListener('click', () => (playing ? pause() : play()));
    range.addEventListener('input', () => { pause(); seek(parseFloat(range.value)); });
    staticBtn.addEventListener('click', () => setStatic(staticSec.hidden));
    chapterBtns.forEach((b, i) => b.addEventListener('click', () => { pause(); seek(chapters[i].t); }));
    if (soundBtn) soundBtn.addEventListener('click', () => {
      soundOn = !soundOn;
      soundBtn.setAttribute('aria-pressed', String(soundOn));
      if (playing && soundOn) { audio.currentTime = t; audio.play().catch(() => {}); }
      if (!soundOn) audio.pause();
    });
    document.addEventListener('keydown', (e) => {
      if (e.target.closest && e.target.closest('input,textarea')) {
        if (e.key !== ' ') return;
      }
      const step = e.shiftKey ? 1 : 1 / fps;
      if (e.key === ' ') { e.preventDefault(); playing ? pause() : play(); }
      else if (e.key === 'ArrowRight') { pause(); seek(t + step); }
      else if (e.key === 'ArrowLeft') { pause(); seek(t - step); }
      else if (e.key === 'Home') { pause(); seek(0); }
      else if (e.key === 'End') { pause(); seek(duration); }
      else if (e.key === ']' || e.key === '[') {
        pause();
        const dir = e.key === ']' ? 1 : -1;
        const idx = chapters.findIndex((c) => c.t > t + 1e-3);
        let target = dir > 0 ? idx : (idx < 0 ? chapters.length : idx) - 2;
        if (dir < 0) { const cur = chapters.filter((c) => c.t <= t - 0.05).length - 1; target = Math.max(0, cur); }
        if (target >= 0 && target < chapters.length) seek(chapters[target].t);
      }
    });

    // FNV-1a over a strided sample of pixels: cheap, stable fingerprint of a frame
    function fingerprint() {
      let data;
      if (spec.context === 'webgl' || spec.context === 'webgl2') {
        data = new Uint8Array(W * H * 4);
        ctx.readPixels(0, 0, W, H, ctx.RGBA, ctx.UNSIGNED_BYTE, data);
      } else {
        data = ctx.getImageData(0, 0, W, H).data;
      }
      let h = 0x811c9dc5;
      for (let i = 0; i < data.length; i += 4) {
        h ^= data[i] | (data[i + 1] << 8) | (data[i + 2] << 16);
        h = Math.imul(h, 0x01000193) >>> 0;
      }
      return h.toString(16).padStart(8, '0');
    }

    const ready = (async () => {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      if (spec.setup) await spec.setup(ctx, env);
      const q = parseFloat(params.get('t'));
      draw(Number.isFinite(q) ? q : (spec.poster ?? 0));
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!exportMode && (params.has('static') || reduce)) setStatic(true);
      return true;
    })();

    window.__vg = {
      ready, duration, fps, width: W, height: H, chapters, staticTimes,
      renderAt(time) { draw(time); return fingerprint(); },
      seek(time) { draw(time); },
      canvas, audio: spec.audio || null,
      frame(time, type = 'image/jpeg', quality = 0.92) { draw(time); return canvas.toDataURL(type, quality); },
      transcript: (time) => (spec.transcript ? spec.transcript(time) : ''),
      meta: spec.meta || {},
    };
    return window.__vg;
  }

  window.VG = { stage, U, FONT, MONO, hud };
})();
