/* Page chrome around the stage: camera stations, the look-back notice, and the text version.
 * Nothing here draws into the canvas, so exported frames do not depend on it. All reader-facing
 * strings come from editable.json (words.page). */
(function () {
  'use strict';
  const MC = window.MC01, M = window.MC01Model, D = MC.data, MODEL = MC.model, vg = window.__vg, T = D.words.page;
  const root = document.getElementById('vg'), extra = document.getElementById('mc');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const mark = (state) => (state === 'durable' ? '●' : state === 'failed' ? '✕' : '○');
  const levelLabel = (id) => D.levels.find((l) => l.id === id).label;
  const clock = (s) => { const m = Math.floor(s / 60), r = s - m * 60; return `${String(m).padStart(2, '0')}:${(Number.isInteger(r) ? String(r) : r.toFixed(1)).padStart(Number.isInteger(r) ? 2 : 4, '0')}`; };
  const fill = (tpl, o) => tpl.replace(/\{(\w+)\}/g, (_, k) => esc(o[k]));

  document.title = D.title;
  const canvas = root.querySelector('canvas');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', D.title);

  // The stage toggles play on Space wherever the focus is. On a focused control Space belongs to that control.
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && e.target.closest && e.target.closest('button, a[href], select')) e.stopPropagation();
  }, true);

  // ---------- camera stations ----------
  const stations = [['', T.follow], ...D.levels.map((l) => [l.id, l.label]), ['overview', T.overview]];
  const bar = document.createElement('div');
  bar.className = 'mc-stations';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', T.cameraGroup);
  bar.innerHTML = `<span class="mc-k">${esc(T.cameraGroup)}</span>${stations.map(([id, label], i) => `<button type="button" data-st="${id}" aria-pressed="${i === 0}"><kbd>${i}</kbd> ${esc(label)}</button>`).join('')}
    <span class="mc-hint">${esc(T.cameraHint)}</span>`;
  root.querySelector('.vg-chapters').after(bar);
  let pumping = false;
  function pump() {
    vg.seek(MC.lastS());
    if (MC.cameraMoving()) requestAnimationFrame(pump); else pumping = false;
  }
  function go(id) {
    if (!MC.setStation(id || null)) return;
    bar.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.st === id)));
    if (!pumping) { pumping = true; requestAnimationFrame(pump); }
  }
  bar.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) go(b.dataset.st); });
  document.addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('input,textarea')) return;
    if (e.metaKey || e.ctrlKey || e.altKey || root.classList.contains('vg-is-static')) return;
    if (/^[0-9]$/.test(e.key) && Number(e.key) < stations.length) go(stations[Number(e.key)][0]);
  });

  // ---------- look-back notice ----------
  const back = document.createElement('p');
  back.className = 'mc-lookback';
  back.setAttribute('role', 'status');
  back.hidden = true;
  bar.after(back);
  let maxSeen = 0, shown = -1, backText = '';

  // ---------- text version ----------
  const flightsOf = (id) => MODEL.flights.filter((f) => f.id === id);
  const cell = (req, level) => {
    const items = [];
    for (const e of req.events) if (D.states[e.state].level === level) items.push(`<li><span class="mc-t">t=${M.num(e.time)}</span> ${mark(e.state)} ${esc(MC.words(e.state))}</li>`);
    if (level === 'ui') for (const f of flightsOf(req.id)) items.push(`<li><span class="mc-t">t=${M.num(f.time)}</span> ${esc(T.gotReceipt)}${esc(D.states[f.state].word)}</li>`);
    return items.length ? `<ul>${items.join('')}</ul>` : `<span class="mc-none">${esc(T.passed)}</span>`;
  };
  // what the status line shows once the receipt for an event has landed (for pending: at the click)
  const shownAt = (e, policy) => { const f = MODEL.flights.find((x) => x.key === e.key); return M.uiStatus(D, MODEL, f ? f.s1 : e.s, policy).text; };
  const rows = MODEL.events.map((e) => `<tr role="row" data-t="${e.time}">
      <td role="cell" data-label="${esc(T.ledgerCols[0])}"><span class="mc-t">t=${M.num(e.time)}</span></td>
      <td role="cell" data-label="${esc(T.ledgerCols[1])}"><code>${esc(e.id)}</code></td>
      <td role="cell" data-label="${esc(T.ledgerCols[2])}">${mark(e.state)} ${esc(MC.words(e.state))}</td>
      <td role="cell" data-label="${esc(T.ledgerCols[3])}">${esc(levelLabel(D.states[e.state].level))}</td>
      <td role="cell" data-label="${esc(T.ledgerCols[4])}">${esc(shownAt(e, 'naive'))}</td>
      <td role="cell" data-label="${esc(T.ledgerCols[5])}">${esc(shownAt(e, 'truthful'))}</td>
      <td role="cell"><button type="button" data-seek="${e.s}">${esc(T.seek)}（${clock(e.s)}）</button></td>
    </tr>`).join('');
  const findings = MODEL.reqs.map((r) => {
    const ack = r.events[1], end = r.events[2];
    let text = T.findingOpen;
    if (r.endState === 'durable') text = fill(T.findingDurable, { ack: M.num(r.tAck), end: M.num(r.tEnd), gap: M.num(r.tEnd - r.tAck), naive: shownAt(ack, 'naive') });
    if (r.endState === 'failed') text = fill(T.findingFailed, { end: M.num(r.tEnd), naive: shownAt(end, 'naive'), truthful: shownAt(end, 'truthful') });
    return `<li><code>${esc(r.id)}</code>：${text}</li>`;
  }).join('');
  extra.innerHTML = `
    <h2>${esc(T.heading)}</h2>
    <p>${esc(T.intro)}</p>
    <p class="mc-warn" role="status" hidden>${esc(T.noGL)}</p>
    <ul class="mc-findings">${findings}</ul>
    <h3>${esc(T.sectionTitle)}</h3>
    <table class="mc-section">
      <thead><tr><th scope="col">${esc(T.levelCol)}</th>${MODEL.reqs.map((r) => `<th scope="col"><code>${esc(r.id)}</code></th>`).join('')}</tr></thead>
      <tbody>${D.levels.map((l) => `<tr><th scope="row">${esc(l.label)}<small>${esc(l.gloss)}</small></th>${MODEL.reqs.map((r) => `<td>${cell(r, l.id)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>
    <h3>${esc(T.ledgerTitle)}</h3>
    <table class="mc-ledger" role="table">
      <thead role="rowgroup"><tr role="row">${T.ledgerCols.map((c) => `<th role="columnheader" scope="col">${esc(c)}</th>`).join('')}</tr></thead>
      <tbody role="rowgroup">${rows}</tbody>
    </table>
    <p class="mc-legend">${esc(T.legend)}</p>
    <p class="mc-legend"><a href="README.md">README</a> · <a href="acceptance.md">${esc('验收回执')}</a></p>`;
  extra.addEventListener('click', (e) => {
    const b = e.target.closest('[data-seek]');
    if (!b) return;
    const play = root.querySelector('[data-act=play]');
    if (play.getAttribute('aria-label') === '暂停') play.click();
    vg.seek(parseFloat(b.dataset.seek));
    root.querySelector('.vg-frame').scrollIntoView({ block: 'nearest' });
  });
  const trs = [...extra.querySelectorAll('.mc-ledger tbody tr')], warn = extra.querySelector('.mc-warn');

  // ---------- follow the playhead and the GL context ----------
  let glOk = null;
  function sync() {
    const ok = MC.glOk();
    if (ok !== glOk) {
      glOk = ok;
      warn.hidden = ok;
      // without the picture the static plates would be nineteen copies of the same notice
      root.classList.toggle('mc-nogl', !ok);
    }
    const s = MC.lastS();
    if (s !== shown) {
      shown = s;
      maxSeen = Math.max(maxSeen, s);
      const tau = M.tauAt(MODEL.knots, s), tauMax = M.tauAt(MODEL.knots, maxSeen);
      let cur = null;
      trs.forEach((tr) => { const on = tau >= parseFloat(tr.dataset.t); tr.classList.toggle('on', on); tr.removeAttribute('aria-current'); if (on) cur = tr; });
      if (cur) cur.setAttribute('aria-current', 'true');
      // scrubbing back shows an earlier moment of the record; it does not undo what the record holds
      const changed = MODEL.reqs.map((r) => [r, M.stateAt(r, tau), M.stateAt(r, tauMax)]).filter(([, a, b]) => a !== b);
      const text = maxSeen - s > 0.05 && changed.length
        ? T.lookback + changed.map(([r, , b]) => `${r.id} 在 t=${M.num(r.events.find((e) => e.state === b).time)} ${D.states[b].word}`).join('；') + '。' : '';
      if (text !== backText) { backText = text; back.hidden = !text; back.textContent = text; }
    }
    requestAnimationFrame(sync);
  }
  vg.ready.then(() => requestAnimationFrame(sync));
})();
