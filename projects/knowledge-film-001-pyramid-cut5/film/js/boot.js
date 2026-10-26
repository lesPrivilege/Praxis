/* Boot the film, then either wait for the renderer (?render=1) or run the live player. */
(function () {
  const q = new URLSearchParams(location.search);
  const render = q.has('render');
  if (render) document.body.classList.add('render');

  document.fonts.ready.then(() => {
    Film.boot();
    if (q.has('t')) Film.seek(parseFloat(q.get('t')));
    if (render) return;

    const stage = Film.stage, hud = document.getElementById('hud');
    const fit = () => { stage.style.transform = `scale(${Math.min(innerWidth / Film.W, innerHeight / Film.H)})`; };
    addEventListener('resize', fit); fit();

    const audio = new Audio('../audio/mix.wav');
    audio.preload = 'auto';
    let hasAudio = false, playing = false, t0 = 0, p0 = 0;
    audio.addEventListener('canplaythrough', () => { hasAudio = true; }, { once: true });

    const btn = hud.querySelector('button'), range = hud.querySelector('input'), clock = hud.querySelector('output'), sel = hud.querySelector('select');
    range.max = Film.duration;
    for (const c of Film.chapters) { const o = document.createElement('option'); o.value = c.t; o.textContent = c.title; sel.appendChild(o); }
    const fmt = t => `${String(Math.floor(t / 60)).padStart(2, '0')}:${(t % 60).toFixed(2).padStart(5, '0')}`;
    const paint = () => { range.value = Film.time; clock.textContent = `${fmt(Film.time)} / ${fmt(Film.duration)}`; };
    const now = () => (hasAudio ? audio.currentTime : p0 + (performance.now() - t0) / 1000);
    function go(t) { Film.seek(t); if (hasAudio) audio.currentTime = Film.time; p0 = Film.time; t0 = performance.now(); paint(); }
    function toggle() {
      playing = !playing; btn.textContent = playing ? '暂停' : '播放';
      p0 = Film.time; t0 = performance.now();
      if (hasAudio) { if (playing) { audio.currentTime = Film.time; audio.play(); } else audio.pause(); }
    }
    (function loop() {
      if (playing) { Film.seek(now()); paint(); if (Film.time >= Film.duration) toggle(); }
      requestAnimationFrame(loop);
    })();
    btn.onclick = toggle;
    range.oninput = () => go(parseFloat(range.value));
    sel.onchange = () => go(parseFloat(sel.value));
    addEventListener('keydown', e => {
      if (e.code === 'Space') { e.preventDefault(); toggle(); }
      if (e.code === 'ArrowRight') go(Film.time + (e.shiftKey ? 5 : 1 / Film.fps));
      if (e.code === 'ArrowLeft') go(Film.time - (e.shiftKey ? 5 : 1 / Film.fps));
    });
    paint();
  });
})();
