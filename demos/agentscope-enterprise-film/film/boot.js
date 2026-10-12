/* The player is silent and paused initially. Render mode keeps a fixed 1080p stage. */
(function () {
  const q = new URLSearchParams(location.search), render = q.has('render');
  if (render) document.body.classList.add('render');
  document.fonts.ready.then(() => {
    Film.boot();
    if (q.has('t')) Film.seek(Number(q.get('t')));
    if (render) return;
    const hud = document.getElementById('hud'), stage = Film.stage;
    const btn = document.getElementById('play'), range = document.getElementById('progress');
    const clock = document.getElementById('clock'), select = document.getElementById('chapters');
    let playing = false, t0 = 0, p0 = 0;
    function fit() {
      const note = document.getElementById('mobile-note');
      const top = getComputedStyle(note).display === 'none' ? 0 : note.offsetHeight;
      const available = Math.max(100, innerHeight - hud.offsetHeight - top);
      stage.style.transform = `scale(${Math.min(innerWidth / Film.W, available / Film.H)})`;
      document.getElementById('viewport').style.bottom = hud.offsetHeight + 'px';
      document.getElementById('viewport').style.top = top + 'px';
    }
    addEventListener('resize', fit); fit();
    range.max = Film.duration;
    for (const c of Film.chapters) { const o = document.createElement('option'); o.value = c.t; o.textContent = c.title; select.appendChild(o); }
    const fmt = t => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
    function paint() {
      range.value = Film.time; clock.textContent = `${fmt(Film.time)} / ${fmt(Film.duration)}`;
      const chapter = Film.chapters.filter(c => c.t <= Film.time).at(-1);
      if (chapter) select.value = chapter.t;
    }
    function go(t) { Film.seek(t); p0 = Film.time; t0 = performance.now(); paint(); }
    function toggle() {
      if (!playing && Film.time >= Film.duration) go(0);
      playing = !playing; btn.textContent = playing ? '暂停' : '播放';
      btn.setAttribute('aria-pressed', String(playing)); p0 = Film.time; t0 = performance.now();
    }
    function moveScene(d) {
      let i = Film.segments.findIndex(s => Film.time >= s.start && Film.time < s.end);
      if (i < 0) i = Film.segments.length - 1;
      if (d < 0 && Film.time > Film.segments[i].start + 1) go(Film.segments[i].start);
      else go(Film.segments[Math.max(0, Math.min(Film.segments.length - 1, i + d))].start);
    }
    (function loop() {
      if (playing) { Film.seek(p0 + (performance.now() - t0) / 1000); paint(); if (Film.time >= Film.duration) toggle(); }
      requestAnimationFrame(loop);
    })();
    btn.onclick = toggle; document.getElementById('prev').onclick = () => moveScene(-1);
    document.getElementById('next').onclick = () => moveScene(1);
    range.oninput = () => go(Number(range.value)); select.onchange = () => go(Number(select.value));
    addEventListener('keydown', e => {
      if (/INPUT|SELECT|TEXTAREA|BUTTON|A/.test(e.target.tagName) || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.code === 'Space' || e.code === 'KeyK') { e.preventDefault(); toggle(); }
      else if (e.code === 'ArrowRight') { e.preventDefault(); go(Film.time + (e.shiftKey ? 10 : 5)); }
      else if (e.code === 'ArrowLeft') { e.preventDefault(); go(Film.time - (e.shiftKey ? 10 : 5)); }
      else if (e.code === 'BracketLeft') moveScene(-1);
      else if (e.code === 'BracketRight') moveScene(1);
      else if (e.code === 'Home') go(0);
      else if (e.code === 'End') go(Film.duration);
    });
    btn.setAttribute('aria-pressed', 'false'); paint();
    window.Player = { go, toggle, moveScene, get playing() { return playing; } };
  });
})();
