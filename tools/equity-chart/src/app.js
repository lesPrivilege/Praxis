// Editor page. One data object is the source of truth; the tables, the JSON
// view and the canvas all edit it, and every change re-runs EC.render.
// The preview carries editing hooks; export and copy use the clean SVG.
(function (EC) {
  const $ = (id) => document.getElementById(id);
  const DRAFT_KEY = 'equity-chart:draft';
  const SETTINGS_KEY = 'equity-chart:settings';
  const TABLE_LIMIT = 150;
  const FIELDS = Object.keys(EC.DEFAULTS);
  const NUMERIC = FIELDS.filter((k) => typeof EC.DEFAULTS[k] === 'number');

  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* preview or private mode */ } },
  };

  let data = { entities: [], holdings: [] };
  let current = null;
  let selected = null; // { type: 'node', id } | { type: 'edge', index }
  let focusNameAfterRender = false;
  let jsonError = null;
  let run = 0;
  let timer = 0;
  const undoStack = [];
  const redoStack = [];
  let typing = false;

  // ---------- state ----------

  function el(tag, props = {}, ...children) {
    const node = Object.assign(document.createElement(tag), props);
    node.append(...children.filter((c) => c !== null && c !== undefined));
    return node;
  }

  function newId(prefix) {
    let n = data.entities.length + 1;
    while (data.entities.some((e) => e.id === `${prefix}${n}`)) n++;
    return `${prefix}${n}`;
  }

  function pushUndo() {
    undoStack.push(JSON.stringify(data));
    if (undoStack.length > 200) undoStack.shift();
    redoStack.length = 0;
  }

  // A structural change: record undo, mutate, redraw tables and chart.
  function change(mutate) {
    pushUndo();
    mutate(data);
    refresh();
  }

  // A typed change: one undo step per field visit; tables are synced in place
  // so the field being typed in keeps its focus and caret.
  function edit(mutate) {
    if (!typing) pushUndo();
    typing = true;
    mutate(data);
    refresh({ tables: false });
    syncTables();
  }

  function endTyping() {
    typing = false;
  }

  // Leave the focused field alone: it already shows what the user typed.
  function setValue(input, value) {
    if (document.activeElement === input) return;
    if (input.type === 'checkbox') input.checked = !!value;
    else input.value = value;
  }

  function refresh({ tables = true, json = true } = {}) {
    jsonError = null;
    if (json) $('source').value = JSON.stringify(data, null, 2);
    if (tables) renderTables();
    store.set(DRAFT_KEY, JSON.stringify(data));
    $('undo').disabled = !undoStack.length;
    $('redo').disabled = !redoStack.length;
    schedule();
  }

  function undo(from, to) {
    if (!from.length) return;
    to.push(JSON.stringify(data));
    data = JSON.parse(from.pop());
    typing = false;
    refresh();
  }

  function removeEntity(id) {
    change((d) => {
      d.entities = d.entities.filter((e) => e.id !== id);
      d.holdings = d.holdings.filter((h) => h.from !== id && h.to !== id);
    });
    select(null);
  }

  function addRelated(id, role) {
    const newIdValue = newId('e');
    change((d) => {
      const anchor = d.entities.findIndex((e) => e.id === id);
      const entity = { id: newIdValue, name: role === 'holder' ? '新股东' : '新企业' };
      d.entities.splice(anchor + (role === 'holder' ? 0 : 1), 0, entity);
      d.holdings.push(role === 'holder' ? { from: newIdValue, to: id } : { from: id, to: newIdValue });
    });
    select({ type: 'node', id: newIdValue });
    focusNameAfterRender = true;
  }

  function moveEntity(id, beforeId) {
    const from = data.entities.findIndex((e) => e.id === id);
    if (from < 0 || id === beforeId) return false;
    const next = data.entities.slice();
    const [item] = next.splice(from, 1);
    const to = beforeId === null ? next.length : next.findIndex((e) => e.id === beforeId);
    next.splice(to, 0, item);
    if (next.every((e, i) => e === data.entities[i])) return false;
    change((d) => { d.entities = next; });
    return true;
  }

  // ---------- tables ----------

  function renderTables() {
    const big = data.entities.length > TABLE_LIMIT;
    $('table-note').textContent = big ? `主体超过 ${TABLE_LIMIT} 个，表格不展开；请在画布或 JSON 中编辑。` : '';
    $('entity-table').hidden = big;
    $('holding-table').hidden = big;
    if (big) return;
    $('entity-table').tBodies[0].replaceChildren(...data.entities.map(entityRow));
    $('holding-table').tBodies[0].replaceChildren(...data.holdings.map(holdingRow));
    if (!data.entities.length) {
      $('entity-table').tBodies[0].append(el('tr', {}, el('td', { colSpan: 5, className: 'empty', textContent: '没有主体' })));
    }
    if (!data.holdings.length) {
      $('holding-table').tBodies[0].append(el('tr', {}, el('td', { colSpan: 5, className: 'empty', textContent: data.entities.length < 2 ? '至少两个主体才能添加持股' : '没有持股' })));
    }
    markTableSelection();
  }

  function entityRow(e) {
    const row = el('tr', { className: 'entity-row' });
    row.dataset.id = e.id;
    const handle = el('button', { type: 'button', className: 'handle', title: '拖动或用 ↑↓ 调整顺序', textContent: '⋮⋮' });
    handle.setAttribute('aria-label', `调整 ${e.name} 的顺序`);
    handle.addEventListener('pointerdown', () => { row.draggable = true; });
    handle.addEventListener('keydown', (ev) => {
      if (ev.key !== 'ArrowUp' && ev.key !== 'ArrowDown') return;
      ev.preventDefault();
      const i = data.entities.findIndex((x) => x.id === e.id);
      const j = ev.key === 'ArrowUp' ? i - 1 : i + 2;
      if (j < 0 || j > data.entities.length) return;
      moveEntity(e.id, j === data.entities.length ? null : data.entities[j].id);
      document.querySelector(`.entity-row[data-id="${CSS.escape(e.id)}"] .handle`)?.focus();
    });
    row.addEventListener('dragstart', (ev) => {
      ev.dataTransfer.setData('text/plain', e.id);
      ev.dataTransfer.effectAllowed = 'move';
      row.classList.add('is-dragging');
    });
    row.addEventListener('dragend', () => {
      row.draggable = false;
      row.classList.remove('is-dragging');
      clearDropMarks();
    });
    row.addEventListener('dragover', (ev) => {
      ev.preventDefault();
      clearDropMarks();
      const box = row.getBoundingClientRect();
      const after = ev.clientY > box.top + box.height / 2;
      row.classList.add(after ? 'drop-after' : 'drop-before');
    });
    row.addEventListener('drop', (ev) => {
      ev.preventDefault();
      const dragged = ev.dataTransfer.getData('text/plain');
      const after = row.classList.contains('drop-after');
      clearDropMarks();
      const i = data.entities.findIndex((x) => x.id === e.id);
      const beforeId = after ? data.entities[i + 1]?.id ?? null : e.id;
      if (dragged && beforeId !== dragged) moveEntity(dragged, beforeId);
    });

    const name = el('input', { value: e.name, className: 'cell-input' });
    name.setAttribute('aria-label', '名称');
    name.addEventListener('input', () => edit((d) => { find(d, e.id).name = name.value; }));
    name.addEventListener('change', endTyping);

    const kind = el('select', { className: 'cell-input' },
      el('option', { value: 'company', textContent: '企业' }),
      el('option', { value: 'person', textContent: '自然人' }));
    kind.value = e.kind === 'person' ? 'person' : 'company';
    kind.setAttribute('aria-label', '类型');
    kind.addEventListener('change', () => change((d) => setKind(find(d, e.id), kind.value)));

    const focus = el('input', { type: 'checkbox', checked: !!e.focus });
    focus.setAttribute('aria-label', '强调');
    focus.addEventListener('change', () => change((d) => setFocus(find(d, e.id), focus.checked)));

    const del = el('button', { type: 'button', className: 'icon danger', textContent: '×', title: '删除主体及其持股' });
    del.setAttribute('aria-label', `删除 ${e.name}`);
    del.addEventListener('click', () => removeEntity(e.id));

    row.addEventListener('focusin', () => select({ type: 'node', id: e.id }, { fromTable: true }));
    row.append(el('td', { className: 'col-handle' }, handle), el('td', {}, name), el('td', {}, kind), el('td', { className: 'col-focus' }, focus), el('td', {}, del));
    return row;
  }

  function holdingRow(h, index) {
    const row = el('tr', { className: 'holding-row' });
    row.dataset.index = index;
    const pick = (value, key) => {
      const s = el('select', { className: 'cell-input' }, ...data.entities.map((e) => el('option', { value: e.id, textContent: e.name || e.id })));
      s.value = value;
      s.setAttribute('aria-label', key === 'from' ? '股东' : '被投企业');
      s.addEventListener('change', () => change((d) => { d.holdings[index][key] = s.value; }));
      return s;
    };
    const pct = el('input', { value: h.pct ?? '', inputMode: 'decimal', className: 'cell-input' });
    pct.setAttribute('aria-label', '比例');
    pct.addEventListener('input', () => edit((d) => setPct(d.holdings[index], pct.value)));
    pct.addEventListener('change', endTyping);
    const label = el('input', { value: h.label ?? '', className: 'cell-input', placeholder: '—' });
    label.setAttribute('aria-label', '标注');
    label.addEventListener('input', () => edit((d) => setLabel(d.holdings[index], label.value)));
    label.addEventListener('change', endTyping);
    const del = el('button', { type: 'button', className: 'icon danger', textContent: '×', title: '删除持股' });
    del.setAttribute('aria-label', '删除持股');
    del.addEventListener('click', () => { change((d) => d.holdings.splice(index, 1)); select(null); });
    row.addEventListener('focusin', () => select({ type: 'edge', index }, { fromTable: true }));
    row.append(el('td', {}, pick(h.from, 'from')), el('td', {}, pick(h.to, 'to')), el('td', {}, pct), el('td', {}, label), el('td', {}, del));
    return row;
  }

  function syncTables() {
    const eRows = document.querySelectorAll('.entity-row');
    const hRows = document.querySelectorAll('.holding-row');
    if (eRows.length !== data.entities.length || hRows.length !== data.holdings.length) return renderTables();
    eRows.forEach((row, i) => {
      const e = data.entities[i];
      const [name, kind] = row.querySelectorAll('.cell-input');
      setValue(name, e.name);
      setValue(kind, e.kind === 'person' ? 'person' : 'company');
      setValue(row.querySelector('[type=checkbox]'), e.focus);
    });
    hRows.forEach((row, i) => {
      const h = data.holdings[i];
      const [from, to, pct, label] = row.querySelectorAll('.cell-input');
      for (const select of [from, to]) {
        [...select.options].forEach((opt, j) => { opt.textContent = data.entities[j].name || data.entities[j].id; });
      }
      setValue(from, h.from);
      setValue(to, h.to);
      setValue(pct, h.pct ?? '');
      setValue(label, h.label ?? '');
    });
  }

  function clearDropMarks() {
    for (const r of document.querySelectorAll('.drop-before, .drop-after')) r.classList.remove('drop-before', 'drop-after');
  }

  const find = (d, id) => d.entities.find((e) => e.id === id);
  function setKind(e, kind) { if (kind === 'person') e.kind = 'person'; else delete e.kind; }
  function setFocus(e, on) { if (on) e.focus = true; else delete e.focus; }
  function setPct(h, value) {
    const v = value.trim().replace(/%$/, '');
    if (v === '') delete h.pct;
    else h.pct = Number.isFinite(Number(v)) ? Number(v) : v;
  }
  function setLabel(h, value) { if (value) h.label = value; else delete h.label; }

  // ---------- selection and canvas ----------

  function select(next, { fromTable = false } = {}) {
    const same = JSON.stringify(next) === JSON.stringify(selected);
    selected = next;
    if (!same) fillBars();
    markCanvasSelection();
    if (!fromTable) markTableSelection();
    placeBars();
  }

  function validSelection() {
    if (!selected) return null;
    if (selected.type === 'node' && !find(data, selected.id)) return null;
    if (selected.type === 'edge' && !data.holdings[selected.index]) return null;
    return selected;
  }

  function fillBars() {
    const s = validSelection();
    if (s && s.type === 'node') {
      const e = find(data, s.id);
      setValue($('nb-name'), e.name);
      setValue($('nb-kind'), e.kind === 'person' ? 'person' : 'company');
      $('nb-focus').setAttribute('aria-pressed', String(!!e.focus));
    }
    if (s && s.type === 'edge') {
      const h = data.holdings[s.index];
      $('eb-title').textContent = `${find(data, h.from)?.name ?? h.from} → ${find(data, h.to)?.name ?? h.to}`;
      setValue($('eb-pct'), h.pct ?? '');
      setValue($('eb-label'), h.label ?? '');
    }
  }

  function markCanvasSelection() {
    for (const n of $('stage').querySelectorAll('.is-selected')) n.classList.remove('is-selected');
    const s = validSelection();
    if (!s) return;
    const query = s.type === 'node' ? `[data-node="${CSS.escape(s.id)}"]` : `[data-edge="h${s.index}"]`;
    for (const n of $('stage').querySelectorAll(query)) n.classList.add('is-selected');
  }

  function markTableSelection() {
    for (const r of document.querySelectorAll('.rows tr.is-selected')) r.classList.remove('is-selected');
    const s = validSelection();
    if (!s) return;
    const row = s.type === 'node'
      ? document.querySelector(`.entity-row[data-id="${CSS.escape(s.id)}"]`)
      : document.querySelector(`.holding-row[data-index="${s.index}"]`);
    row?.classList.add('is-selected');
  }

  // Float the node or edge bar just above the selected shape, in scroll coordinates.
  function placeBars() {
    const s = validSelection();
    const viewport = $('viewport');
    for (const [bar, type] of [[$('node-bar'), 'node'], [$('edge-bar'), 'edge']]) {
      // An edge bar sits by the percentage label when there is one, not over the whole route.
      const q = (sel) => $('stage').querySelector(sel);
      const target = s && s.type === type && (type === 'node'
        ? q(`[data-node="${CSS.escape(s.id)}"]`)
        : q(`text[data-edge="h${s.index}"]`) || q(`g[data-edge="h${s.index}"]`));
      bar.hidden = !target;
      if (!target) continue;
      const vb = viewport.getBoundingClientRect();
      const tb = target.getBoundingClientRect();
      const left = tb.left - vb.left + viewport.scrollLeft + tb.width / 2 - bar.offsetWidth / 2;
      let top = tb.top - vb.top + viewport.scrollTop - bar.offsetHeight - 8;
      if (top < viewport.scrollTop + 4) top = tb.bottom - vb.top + viewport.scrollTop + 8;
      bar.style.left = `${Math.max(viewport.scrollLeft + 4, left)}px`;
      bar.style.top = `${top}px`;
    }
  }

  let drag = null;

  function onPointerDown(ev) {
    if (ev.button !== 0) return;
    const nodeEl = ev.target.closest('[data-node]');
    const edgeEl = ev.target.closest('[data-edge]');
    if (nodeEl) {
      drag = { id: nodeEl.dataset.node, el: nodeEl, x0: ev.clientX, y0: ev.clientY, moved: false };
      $('stage').setPointerCapture(ev.pointerId);
    } else if (edgeEl) {
      select({ type: 'edge', index: Number(edgeEl.dataset.edge.slice(1)) });
    } else {
      select(null);
    }
  }

  function onPointerMove(ev) {
    if (!drag) return;
    const dx = ev.clientX - drag.x0;
    const dy = ev.clientY - drag.y0;
    if (!drag.moved && Math.hypot(dx, dy) < 4) return;
    drag.moved = true;
    const k = scale();
    drag.el.setAttribute('transform', `translate(${dx / k} ${dy / k})`);
    drag.el.classList.add('is-dragging');
    $('node-bar').hidden = true;
  }

  function onPointerUp(ev) {
    if (!drag) return;
    const d = drag;
    drag = null;
    if (!d.moved) return select({ type: 'node', id: d.id });
    const k = scale();
    const moved = dropNode(d.id, (ev.clientX - d.x0) / k, (ev.clientY - d.y0) / k);
    if (!moved) {
      d.el.removeAttribute('transform');
      d.el.classList.remove('is-dragging');
      placeBars();
    }
  }

  // Dropping a node reorders it among its siblings: entities that share a
  // shareholder with it, or for a top shareholder, share an investee with it.
  // It goes before the first sibling whose centre lies past the drop point.
  function siblingIds(id) {
    const holdersOf = (x) => data.holdings.filter((h) => h.to === x).map((h) => h.from);
    const investeesOf = (x) => data.holdings.filter((h) => h.from === x).map((h) => h.to);
    const viaHolders = new Set(holdersOf(id).flatMap(investeesOf));
    const pool = viaHolders.size ? viaHolders : new Set(investeesOf(id).flatMap(holdersOf));
    pool.delete(id);
    return pool;
  }

  function dropNode(id, dx, dy) {
    if (!current) return false;
    const nodes = current.chart.nodes;
    const me = nodes.find((n) => n.id === id);
    const down = settings().direction === 'DOWN';
    const centre = (n) => (down ? n.x + n.width / 2 : n.y + n.height / 2);
    const ids = siblingIds(id);
    const siblings = nodes.filter((n) => ids.has(n.id)).sort((a, b) => centre(a) - centre(b));
    if (!siblings.length) return false;
    const target = centre(me) + (down ? dx : dy);
    const next = siblings.find((n) => centre(n) > target);
    // Before that sibling in entity order; past the last one, right after it.
    let beforeId;
    if (next) {
      beforeId = next.id;
    } else {
      const last = siblings[siblings.length - 1].id;
      const i = data.entities.findIndex((e) => e.id === last);
      beforeId = data.entities[i + 1]?.id ?? null;
      if (beforeId === id) beforeId = data.entities[i + 2]?.id ?? null;
    }
    return moveEntity(id, beforeId);
  }

  function scale() {
    const svg = $('stage').querySelector('svg');
    return svg && current ? svg.getBoundingClientRect().width / current.width : 1;
  }

  // ---------- render ----------

  function settings() {
    const o = {};
    for (const k of FIELDS) {
      const raw = $(k).value;
      if (NUMERIC.includes(k)) {
        const v = parseFloat(raw);
        o[k] = Number.isFinite(v) ? v : EC.DEFAULTS[k];
      } else {
        o[k] = raw || EC.DEFAULTS[k];
      }
    }
    return o;
  }

  function applySettings(o) {
    for (const k of FIELDS) $(k).value = o[k] ?? EC.DEFAULTS[k];
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(update, 120);
  }

  async function update() {
    const id = ++run;
    const o = settings();
    store.set(SETTINGS_KEY, JSON.stringify(o));
    if (jsonError) return report(jsonError, [], true);
    if (data.entities.length > 150) $('status').textContent = `正在排布 ${data.entities.length} 个主体…`;
    try {
      const res = await EC.render(data, o, { interactive: true });
      if (id !== run) return;
      if (res.errors.length) return report(res.errors.join('；'), res.warnings, true);
      current = res;
      $('stage').innerHTML = res.previewSvg;
      $('empty-hint').hidden = res.entities > 0;
      fit();
      if (!validSelection()) selected = null;
      fillBars();
      markCanvasSelection();
      markTableSelection();
      placeBars();
      if (focusNameAfterRender && selected?.type === 'node') {
        focusNameAfterRender = false;
        $('nb-name').focus();
        $('nb-name').select();
      }
      report(`${res.entities} 个主体 · ${res.holdings} 条持股 · 布局 ${Math.round(res.layoutMs)} ms · ${res.width}×${res.height} · ${(res.svg.length / 1024).toFixed(1)} KB`, res.warnings, false);
    } catch (err) {
      if (id === run) report(`布局失败：${err.message || err}`, [], true);
    }
  }

  function report(text, warnings, failed) {
    $('status').textContent = text;
    $('status').classList.toggle('is-error', failed);
    $('warnings').replaceChildren(...warnings.map((w) => el('li', { textContent: w })));
    for (const b of document.querySelectorAll('[data-needs-chart]')) b.disabled = failed || !current;
  }

  let zoom = 'fit';
  function fit() {
    const svg = $('stage').querySelector('svg');
    if (!svg || !current) return;
    const box = $('viewport').getBoundingClientRect();
    const k = zoom === 'fit' ? Math.min(1, (box.width - 32) / current.width, (box.height - 32) / current.height) : 1;
    svg.style.width = `${current.width * k}px`;
    svg.style.height = `${current.height * k}px`;
    $('zoom').textContent = zoom === 'fit' ? `适应 ${Math.round(k * 100)}%` : '100%';
  }

  // ---------- export ----------

  function download() {
    if (!current) return;
    const blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n', current.svg], { type: 'image/svg+xml' });
    const a = el('a', { href: URL.createObjectURL(blob), download: `${$('filename').value.trim() || '股权结构图'}.svg` });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  async function copy() {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(current.svg);
      flash('已复制 SVG 源码');
    } catch {
      flash('浏览器不允许写剪贴板，请改用导出');
    }
  }

  function flash(text) {
    $('toast').textContent = text;
    $('toast').classList.add('is-shown');
    setTimeout(() => $('toast').classList.remove('is-shown'), 1600);
  }

  // ---------- wiring ----------

  function showTab(name) {
    for (const t of ['table', 'json']) {
      $(`tab-${t}`).hidden = t !== name;
      $(`tab-btn-${t}`).setAttribute('aria-selected', String(t === name));
    }
  }

  function onJsonInput() {
    let parsed;
    try {
      parsed = JSON.parse($('source').value);
    } catch (err) {
      jsonError = `JSON 无法解析：${err.message}`;
      return report(jsonError, [], true);
    }
    if (!typing) pushUndo();
    typing = true;
    data = parsed;
    jsonError = null;
    renderTables();
    store.set(DRAFT_KEY, JSON.stringify(data));
    $('undo').disabled = !undoStack.length;
    schedule();
  }

  function isTextField(t) {
    return t instanceof HTMLTextAreaElement || (t instanceof HTMLInputElement && !['checkbox', 'color'].includes(t.type)) || t instanceof HTMLSelectElement;
  }

  function onKey(ev) {
    const mod = ev.metaKey || ev.ctrlKey;
    if (mod && ev.key.toLowerCase() === 'z' && !isTextField(ev.target)) {
      ev.preventDefault();
      return ev.shiftKey ? undo(redoStack, undoStack) : undo(undoStack, redoStack);
    }
    if (isTextField(ev.target)) return;
    const s = validSelection();
    if (ev.key === 'Escape') select(null);
    if (s && (ev.key === 'Delete' || ev.key === 'Backspace')) {
      ev.preventDefault();
      if (s.type === 'node') removeEntity(s.id);
      else { change((d) => d.holdings.splice(s.index, 1)); select(null); }
    }
  }

  function init() {
    let o = EC.DEFAULTS;
    const saved = store.get(SETTINGS_KEY);
    if (saved) try { o = { ...EC.DEFAULTS, ...JSON.parse(saved) }; } catch { /* keep defaults */ }
    applySettings(o);
    try { data = JSON.parse(store.get(DRAFT_KEY)) || structuredClone(EC.samples.tree); } catch { data = structuredClone(EC.samples.tree); }
    if (!Array.isArray(data.entities) || !Array.isArray(data.holdings)) data = structuredClone(EC.samples.tree);

    $('tab-btn-table').addEventListener('click', () => showTab('table'));
    $('tab-btn-json').addEventListener('click', () => showTab('json'));
    $('source').addEventListener('input', onJsonInput);
    $('source').addEventListener('change', () => { typing = false; });
    for (const k of FIELDS) $(k).addEventListener('input', schedule);
    $('reset-settings').addEventListener('click', () => { applySettings(EC.DEFAULTS); update(); });
    $('undo').addEventListener('click', () => undo(undoStack, redoStack));
    $('redo').addEventListener('click', () => undo(redoStack, undoStack));
    $('sample').addEventListener('change', (ev) => {
      const v = ev.target.value;
      ev.target.value = '';
      if (!v) return;
      const next = v === 'empty' ? { entities: [], holdings: [] } : v.startsWith('gen:') ? EC.generate(Number(v.slice(4))) : structuredClone(EC.samples[v]);
      select(null);
      change((d) => { d.entities = next.entities; d.holdings = next.holdings; });
    });

    $('add-entity').addEventListener('click', () => {
      const id = newId('e');
      change((d) => d.entities.push({ id, name: '新主体' }));
      const input = document.querySelector(`.entity-row[data-id="${CSS.escape(id)}"] input`);
      input?.focus();
      input?.select();
    });
    $('add-holding').addEventListener('click', () => {
      if (data.entities.length < 2) return flash('至少需要两个主体');
      const s = validSelection();
      const to = s?.type === 'node' ? s.id : data.entities[data.entities.length - 1].id;
      const from = data.entities.find((e) => e.id !== to).id;
      change((d) => d.holdings.push({ from, to }));
      const rows = document.querySelectorAll('.holding-row');
      rows[rows.length - 1]?.querySelector('select')?.focus();
    });

    $('nb-name').addEventListener('input', () => edit((d) => { find(d, selected.id).name = $('nb-name').value; }));
    $('nb-name').addEventListener('change', endTyping);
    $('nb-name').addEventListener('keydown', (ev) => { if (ev.key === 'Enter') ev.target.blur(); });
    $('nb-kind').addEventListener('change', () => change((d) => setKind(find(d, selected.id), $('nb-kind').value)));
    $('nb-focus').addEventListener('click', () => change((d) => { const e = find(d, selected.id); setFocus(e, !e.focus); }));
    $('nb-holder').addEventListener('click', () => addRelated(selected.id, 'holder'));
    $('nb-child').addEventListener('click', () => addRelated(selected.id, 'child'));
    $('nb-delete').addEventListener('click', () => removeEntity(selected.id));
    $('eb-pct').addEventListener('input', () => edit((d) => setPct(d.holdings[selected.index], $('eb-pct').value)));
    $('eb-pct').addEventListener('change', endTyping);
    $('eb-label').addEventListener('input', () => edit((d) => setLabel(d.holdings[selected.index], $('eb-label').value)));
    $('eb-label').addEventListener('change', endTyping);
    $('eb-delete').addEventListener('click', () => { const i = selected.index; select(null); change((d) => d.holdings.splice(i, 1)); });

    $('stage').addEventListener('pointerdown', onPointerDown);
    $('stage').addEventListener('pointermove', onPointerMove);
    $('stage').addEventListener('pointerup', onPointerUp);
    $('stage').addEventListener('pointercancel', () => { drag = null; update(); });
    document.addEventListener('keydown', onKey);
    $('export').addEventListener('click', download);
    $('copy').addEventListener('click', copy);
    $('zoom').addEventListener('click', () => { zoom = zoom === 'fit' ? 'actual' : 'fit'; fit(); placeBars(); });
    window.addEventListener('resize', () => { fit(); placeBars(); });

    refresh();
  }

  document.addEventListener('DOMContentLoaded', init);
})(window.EC);
