/* Load one assembly: its timeline and ledgers, the engine, then the scene code
   of every unit the assembly contains. `?a=ep01` picks the assembly
   (default: the first standalone episode). Scripts load in order; any error is
   kept in window.__errors so the renderer can refuse to render. */
(function () {
  window.__errors = [];
  addEventListener('error', e => window.__errors.push(String(e.message || e)));
  addEventListener('unhandledrejection', e => window.__errors.push(String(e.reason)));
  const q = new URLSearchParams(location.search);
  const a = q.get('a') || 'ep00';

  const js = src => new Promise((ok, fail) => {
    const s = document.createElement('script');
    s.src = src; s.onload = ok; s.onerror = () => fail(new Error('cannot load ' + src));
    document.body.appendChild(s);
  });
  const css = href => new Promise(ok => {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = href; l.onload = ok; l.onerror = ok;
    document.head.appendChild(l);
  });

  (async () => {
    await js(`../assembly/timelines/${a}.js`);
    await js('../assembly/ledgers.js');
    document.title = window.TIMELINE.title;
    for (const f of ['engine.js', 'camera.js', 'kit.js', 'series.js']) await js(f);
    for (const u of window.TIMELINE.units) {
      await css(`../${u.dir}/scenes.css`);
      await js(`../${u.dir}/scenes.js`);
    }
    if (window.TIMELINE.kind === 'compilation') {
      await css('../assembly/compilation-scenes.css');
      await js('../assembly/compilation-scenes.js');
    }
    await js('boot.js');
  })().catch(e => { window.__errors.push(String(e)); console.error(e); });
})();
