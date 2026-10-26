/* MC01 — one request through four levels.
 *
 * What is true comes from model.js (fixture events at an event time). This file
 * places it in space and draws it: a WebGL pass with real depth for the world,
 * then a 2D pass for every word. The frame is a pure function of story time s
 * unless the viewer has taken the camera; the camera never changes what is true.
 */
(function () {
  'use strict';
  const { U, FONT, MONO } = VG;
  const M = window.MC01Model, D = window.MC01_DATA;
  const { V, segmentHitsBox } = MCGL;
  const MODEL = M.build(D);
  const DIR = D.director;
  const W = 1920, H = 1080, BAND = 150;
  const INK = '#16202c', INK2 = '#4a5868', INK3 = '#8593a3', RULE = '#d8e0e8', ACCENT = '#1f6feb', PANEL = 'rgba(255,255,255,0.94)';
  const hex = (h, a = 1) => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255, a];
  const GL_INK = hex(INK), FOG = { color: [0.925, 0.945, 0.965], near: 17, far: 48 };
  const io = U.ease.inOut;

  // ---------- world layout (explanatory, not physical) ----------
  const G = 3.2, FLOOR = { w: 9, d: 5.6, t: 0.14 };
  const Y = (k) => -G * k;                    // top surface of level k
  const BX = 2.6, BZ = 1.6;                   // the button on the interface; the queue tail sits right under it
  const HX = -2.6, WZ = -1.4;                 // queue head and worker lane; worker exit and storage lane
  const RX = 4.95, SX = 0.7;                  // riser for receipts (outside the floors); where a receipt lands on the interface
  const LIFT = 0.16;                          // a token's centre above the floor it rests on
  const TOKEN = [0.52, 0.2, 0.36], SLIP = [0.36, 0.035, 0.25];
  const HOUSING = { c: [HX, Y(2) + 0.47, 0.1], s: [1.5, 0.94, 1.4] };
  const SLABS = [0, 1, 2, 3].map((k) => ({ c: [0, Y(k) - FLOOR.t / 2, 0], s: [FLOOR.w, FLOOR.t, FLOOR.d] }));
  const OCCLUDERS = [...SLABS, HOUSING];
  const BLOCKS = Array.from({ length: 10 }, (_, i) => [-0.6 + 0.95 * (i % 5), Y(3), WZ + 0.95 * Math.floor(i / 5)]);
  const blockOf = (req) => BLOCKS[(req.index + 2) % BLOCKS.length];
  const LEVEL_INDEX = Object.fromEntries(D.levels.map((l, i) => [l.id, i]));

  // route of a request, on the floor surfaces
  function route(req) {
    const b = blockOf(req);
    return [[BX, Y(0), BZ], [BX, Y(1), BZ], [HX, Y(1), BZ], [HX, Y(2), BZ], [HX, Y(2), WZ], [HX, Y(3), WZ], [b[0], Y(3), WZ], [b[0], Y(3), b[2]]];
  }
  // fractions of the ack→terminal interval spent on each leg after the first
  const LEG_F = [[0.06, 0.26], [0.26, 0.38], [0.38, 0.62], [0.62, 0.74], [0.74, 0.92]];

  // where a request is at event time tau: { p, leg, k, done } or null before it exists
  function journey(req, tau) {
    if (tau < req.tPending) return null;
    const R = route(req), up = (p) => [p[0], p[1] + LIFT, p[2]];
    if (req.tAck === null || tau <= req.tAck) {
      const k = req.tAck === null ? 0 : io(U.clamp((tau - req.tPending) / (req.tAck - req.tPending)));
      return { p: up(V.lerp(R[0], R[1], k)), leg: 0, k, done: false };
    }
    if (req.tEnd === null) return { p: up(R[1]), leg: 1, k: 0, done: false };
    if (tau >= req.tEnd) return { p: [R[7][0], R[7][1] + 0.14, R[7][2]], leg: 6, k: 1, done: true };
    const f = (tau - req.tAck) / (req.tEnd - req.tAck);
    for (let i = 0; i < LEG_F.length; i++) {
      const [f0, f1] = LEG_F[i];
      if (f < f0) return { p: up(R[i + 1]), leg: i + 1, k: 0, done: false };
      if (f <= f1) {
        const k = io((f - f0) / (f1 - f0));
        if (i < 4) return { p: up(V.lerp(R[i + 1], R[i + 2], k)), leg: i + 1, k, done: false };
        // last run: along the storage lane, then across to the block's row
        const l1 = V.len(V.sub(R[6], R[5])), l2 = V.len(V.sub(R[7], R[6])), d = k * (l1 + l2);
        return d <= l1 ? { p: up(V.lerp(R[5], R[6], l1 ? d / l1 : 1)), leg: 5, k: l1 ? d / l1 : 1, done: false }
          : { p: up(V.lerp(R[6], R[7], (d - l1) / l2)), leg: 6, k: (d - l1) / l2, done: false };
      }
    }
    // settling into the block: the write has started and has not finished
    const k = io((f - 0.92) / 0.08);
    return { p: [R[7][0], R[7][1] + LIFT - 0.02 * k, R[7][2]], leg: 6, k: 1, done: false, settling: true };
  }
  const levelOf = (p) => U.clamp((Y(0) + LIFT - p[1]) / G, 0, 3);

  // a receipt's route from where it was issued to the status line on the interface
  function slipRoute(req, state) {
    const h = 0.05, top = [[RX, Y(0) + h, BZ], [SX, Y(0) + h, BZ]];
    if (state === 'ack') return [[BX, Y(1) + 0.3, BZ], [RX, Y(1) + 0.3, BZ], ...top];
    const b = blockOf(req);
    return [[b[0], Y(3) + 0.3, b[2]], [RX, Y(3) + 0.3, b[2]], [RX, Y(3) + 0.3, BZ], ...top];
  }
  function along(points, k) {
    const lens = points.slice(1).map((p, i) => V.len(V.sub(p, points[i])));
    let d = k * lens.reduce((a, b) => a + b, 0);
    for (let i = 0; i < lens.length; i++) {
      if (d <= lens[i] || i === lens.length - 1) return { p: V.lerp(points[i], points[i + 1], lens[i] ? U.clamp(d / lens[i]) : 1), i };
      d -= lens[i];
    }
    return { p: points[0], i: 0 };
  }

  // ---------- camera ----------
  function pose(c) {
    const a = (c.az * Math.PI) / 180;
    return { eye: [c.r * Math.sin(a), c.y, c.r * Math.cos(a)], target: c.target, up: V.norm(V.lerp([0, 1, 0], [0, 0, -1], c.top)) };
  }
  const mixCyl = (a, b, k) => ({ az: U.lerp(a.az, b.az, k), r: U.lerp(a.r, b.r, k), y: U.lerp(a.y, b.y, k), target: V.lerp(a.target, b.target, k), top: U.lerp(a.top, b.top, k) });
  function directorCam(s) {
    const keys = DIR.camera;
    let cur = keys[0];
    for (let i = 1; i < keys.length; i++) {
      const k = keys[i];
      if (s >= k.at) { cur = k; continue; }
      if (s > k.at - k.move) return mixCyl(cur, k, io((s - (k.at - k.move)) / k.move));
      break;
    }
    return cur;
  }
  // the viewer's camera: a station held until released; moves start from wherever the camera is now
  const view = { station: null, from: null, t0: 0, last: null, reduce: window.matchMedia('(prefers-reduced-motion: reduce)').matches };
  function cameraAt(s, pure) {
    const dirCam = directorCam(s);
    if (pure || (!view.station && !view.from)) { view.last = dirCam; return dirCam; }
    const goal = view.station ? DIR.stations[view.station] : dirCam;
    const k = view.reduce ? 1 : U.clamp((performance.now() - view.t0) / 900);
    const cam = k >= 1 ? goal : mixCyl(view.from, goal, io(k));
    if (k >= 1 && !view.station) view.from = null;
    view.last = cam;
    return cam;
  }
  function setStation(name) {
    if (name && !Object.hasOwn(DIR.stations, name)) return false;
    view.from = view.last || directorCam(0);
    view.station = name || null;
    view.t0 = performance.now();
    return true;
  }
  const cameraMoving = () => !!view.from && (view.station ? performance.now() - view.t0 < 950 : true);

  // ---------- world state at story time s ----------
  function world(s) {
    const tau = M.tauAt(MODEL.knots, s);
    const reqs = MODEL.reqs.map((req) => {
      const state = M.stateAt(req, tau), j = journey(req, tau);
      return { req, state, j, level: j ? levelOf(j.p) : null };
    }).filter((x) => x.j);
    const slips = MODEL.flights.filter((f) => s >= f.s0 && s < f.s1).map((f) => {
      const req = MODEL.reqs.find((r) => r.id === f.id), pts = slipRoute(req, f.state);
      const a = along(pts, io((s - f.s0) / (f.s1 - f.s0)));
      return { f, req, pts, p: a.p, i: a.i };
    });
    const policy = M.policyAt(D, s);
    const ui = M.uiStatus(D, MODEL, s, policy);
    const naive = M.uiStatus(D, MODEL, s, 'naive');
    return { s, tau, reqs, slips, policy, ui, ghost: policy !== 'naive' && naive.text !== ui.text ? naive.text : null };
  }

  // ---------- the interface, drawn to a texture ----------
  const UI_W = 2048, UI_H = 1274;
  const uiCanvas = document.createElement('canvas');
  uiCanvas.width = UI_W; uiCanvas.height = UI_H;
  const ux = uiCanvas.getContext('2d');
  const BTN = { x: ((BX + FLOOR.w / 2) / FLOOR.w) * UI_W, y: ((BZ + FLOOR.d / 2) / FLOOR.d) * UI_H, w: 300, h: 124 };
  let uiKey = '', uiBodyLines = 0;
  const UI_BODY_LINES = 5;   // what fits between the heading and the status row
  function uiState(wd) {
    // the pointer approaches before each click and leaves after it
    let cursor = null, pressed = false;
    const clicks = MODEL.reqs.map((r) => M.sOf(MODEL.knots, r.tPending));
    const sc = clicks.find((c) => wd.s < c + 0.3) ?? clicks[clicks.length - 1];
    if (wd.s > sc - 2.4 && wd.s < sc + 1.1) {
      // a second click soon after the first: the pointer is already on the button
      const stay = clicks.some((c) => c < sc && c > sc - 2.4);
      const k = stay ? 1 : U.ease.out(U.seg(wd.s, sc - 2.2, sc - 0.3)), a = (stay ? 1 : U.seg(wd.s, sc - 2.4, sc - 2.0)) * (1 - U.seg(wd.s, sc + 0.6, sc + 1.1));
      cursor = { x: Math.round(U.lerp(BTN.x - 520, BTN.x + 34, k)), y: Math.round(U.lerp(BTN.y - 250, BTN.y + 26, k)), a: Math.round(a * 20) / 20 };
      pressed = wd.s >= sc && wd.s < sc + 0.3;
    }
    return { text: wd.ui.text, awaiting: wd.ui.awaiting, retry: wd.ui.known === 'failed', ghost: wd.ghost, edits: wd.ui.edits.map((e) => e.line), cursor, pressed };
  }
  function drawUI(st) {
    const c = ux;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = '#ffffff'; c.fillRect(0, 0, UI_W, UI_H);
    c.fillStyle = '#eef3f8'; c.fillRect(0, 0, UI_W, 112);
    c.fillStyle = RULE; c.fillRect(0, 112, UI_W, 2);
    c.textBaseline = 'alphabetic'; c.textAlign = 'left';
    c.font = `500 40px ${FONT}`; c.fillStyle = INK2; c.fillText(D.ui.window, 72, 72);
    c.font = `600 88px ${FONT}`; c.fillStyle = INK; c.fillText(D.ui.heading, 96, 300);
    c.font = `400 56px ${FONT}`;
    let y = 440, lines = 0;
    for (const [list, color] of [[D.ui.body, INK2], [st.edits, INK]]) for (const para of list) for (const line of U.wrap(c, para, UI_W - 192)) {
      c.fillStyle = color;
      if (lines < UI_BODY_LINES) c.fillText(line, 96, y);
      y += 84; lines++;
    }
    uiBodyLines = Math.max(uiBodyLines, lines);
    c.fillStyle = RULE; c.fillRect(96, BTN.y - 150, UI_W - 192, 2);
    // button: the accent marks the one place waiting for a person
    const bx = BTN.x - BTN.w / 2, by = BTN.y - BTN.h / 2;
    c.beginPath(); c.roundRect(bx, by, BTN.w, BTN.h, 16);
    c.fillStyle = st.awaiting ? (st.pressed ? '#1558c0' : ACCENT) : (st.pressed ? '#cfd9e4' : '#eef3f8');
    c.fill();
    if (!st.awaiting) { c.lineWidth = 3; c.strokeStyle = '#c3cfdb'; c.stroke(); }
    c.font = `600 56px ${FONT}`; c.textAlign = 'center';
    c.fillStyle = st.awaiting ? '#ffffff' : INK3;
    c.fillText(st.retry && st.awaiting ? D.ui.retry : D.ui.button, BTN.x, BTN.y + 20);
    // status line, right-aligned to the left of the button
    c.textAlign = 'right';
    let size = 58;
    c.font = `500 ${size}px ${FONT}`;
    const room = bx - 60 - 96;
    while (c.measureText(st.text).width > room && size > 30) { size -= 2; c.font = `500 ${size}px ${FONT}`; }
    c.fillStyle = INK; c.fillText(st.text, bx - 60, BTN.y + 20);
    if (st.ghost) {
      const g = `${D.words.oldHint}：${st.ghost}`;
      c.font = `400 40px ${FONT}`; c.fillStyle = INK3;
      c.fillText(g, bx - 60, BTN.y - 62);
      const w = c.measureText(g).width;
      c.setLineDash([14, 10]); c.lineWidth = 3; c.strokeStyle = INK3;
      c.beginPath(); c.moveTo(bx - 60 - w, BTN.y - 48); c.lineTo(bx - 60, BTN.y - 48); c.stroke(); c.setLineDash([]);
    }
    if (st.cursor && st.cursor.a > 0) {
      c.save(); c.globalAlpha = st.cursor.a; c.translate(st.cursor.x, st.cursor.y); c.scale(3.2, 3.2);
      c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 21); c.lineTo(5.6, 16.2); c.lineTo(9.4, 24.6); c.lineTo(12.6, 23.2); c.lineTo(8.8, 15); c.lineTo(15.6, 15); c.closePath();
      c.fillStyle = INK; c.fill(); c.lineWidth = 1.4; c.strokeStyle = '#ffffff'; c.stroke();
      c.restore();
    }
  }

  // ---------- GL pass ----------
  let R = null, glFailed = false;
  function initGL() {
    try { R = MCGL.create(W, H); } catch (e) { R = null; console.error(e); }
    glFailed = !R;
    uiKey = '';
    if (R) {
      R.canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); glFailed = true; });
      R.canvas.addEventListener('webglcontextrestored', () => { initGL(); if (window.__vg) window.__vg.seek(lastS); });
    }
  }
  const SHIFT = [-0.04, 0.13];
  const C = {
    top: [0.985, 0.99, 1, 1], side: [0.8, 0.84, 0.89], edge: [0.43, 0.5, 0.58, 0.95], faint: [0.62, 0.68, 0.75, 0.9],
    tile: [0.925, 0.945, 0.97, 1], tileSide: [0.78, 0.82, 0.87], pale: [0.975, 0.985, 1, 1], ahead: [0.46, 0.53, 0.61, 0.95],
    housing: [0.955, 0.968, 0.985, 1], housingSide: [0.84, 0.875, 0.915],
  };

  // what each storage block shows: the terminal state of the request written to it, or that a write is under way
  function blockStates(wd) {
    const m = new Map();
    for (const x of wd.reqs) {
      if (x.j.done) m.set(blockOf(x.req), x.state);
      else if (x.j.settling) m.set(blockOf(x.req), 'writing');
    }
    return m;
  }

  function drawWorld(wd, cam, reveal) {
    const P = pose(cam);
    R.begin({ eye: P.eye, target: P.target, up: P.up, fov: 30, shift: SHIFT }, FOG);
    const st = uiState(wd), key = JSON.stringify(st);
    if (key !== uiKey) { drawUI(st); R.setTexture(uiCanvas); uiKey = key; }

    // floors
    // lower levels sit a little deeper in tone, so depth reads without shadows
    SLABS.forEach((b, k) => R.box(b.c, b.s, [C.top[0] - 0.011 * k, C.top[1] - 0.008 * k, C.top[2] - 0.005 * k, 1], { side: C.side, tex: k === 0 }));
    R.box(HOUSING.c, HOUSING.s, C.housing, { side: C.housingSide });
    // storage blocks: what a block shows is the state of the request written to it
    const blockState = blockStates(wd);
    for (const b of BLOCKS) {
      const stt = blockState.get(b) || 'empty';
      R.box([b[0], b[1] + 0.05, b[2]], [0.74, 0.1, 0.74], stt === 'durable' ? GL_INK : C.tile, { side: stt === 'durable' ? [0.05, 0.08, 0.12] : C.tileSide });
    }
    // tokens: hollow until the data is on disk
    for (const x of wd.reqs) if (!x.j.done) R.box(x.j.p, TOKEN, C.pale, { side: [0.9, 0.925, 0.955] });
    for (const sl of wd.slips) R.box(sl.p, SLIP, sl.f.state === 'durable' ? GL_INK : C.pale, { side: sl.f.state === 'durable' ? [0.05, 0.08, 0.12] : [0.88, 0.91, 0.945] });

    // soft shadows under whatever stands on or floats above a floor
    R.decal([HOUSING.c[0], Y(2) + 0.006, HOUSING.c[2]], [2.1, 2.0], [0.09, 0.13, 0.18, 0.16], 0.36, 0.1);
    for (const x of wd.reqs) if (!x.j.done) {
      const k = Math.ceil(levelOf(x.j.p) - 1e-6), h = x.j.p[1] - Y(k);
      R.decal([x.j.p[0], Y(k) + 0.008, x.j.p[2]], [0.95, 0.8], [0.09, 0.13, 0.18, 0.24 * (1 - U.clamp(h / G))], 0.26, 0.08);
    }
    // ports where the request passes down through a floor
    R.decal([HX, Y(1) + 0.006, BZ], [0.78, 0.62], [0.09, 0.13, 0.18, 0.3], 0.07, 0.06);
    R.decal([HX, Y(2) + 0.006, WZ], [0.78, 0.62], [0.09, 0.13, 0.18, 0.3], 0.07, 0.06);

    // edges
    SLABS.forEach((b) => R.boxEdges(b.c, b.s, 1.5, C.edge));
    R.boxEdges(HOUSING.c, HOUSING.s, 1.5, C.edge);
    // queue slots
    for (let i = 0; i < 5; i++) {
      const x = BX - i * 1.3, y = Y(1) + 0.012;
      R.line([[x - 0.5, y, BZ - 0.36], [x + 0.5, y, BZ - 0.36], [x + 0.5, y, BZ + 0.36], [x - 0.5, y, BZ + 0.36], [x - 0.5, y, BZ - 0.36]], 1.3, C.faint);
    }
    for (const b of BLOCKS) {
      const stt = blockState.get(b) || 'empty', c = [b[0], b[1] + 0.05, b[2]], s = [0.74, 0.1, 0.74];
      if (stt === 'empty') R.boxEdges(c, s, 1.2, C.faint);
      else if (stt === 'writing') R.boxEdges(c, s, 2.2, GL_INK, { dash: [0.09, 0.07] });
      else R.boxEdges(c, s, 2.2, GL_INK);
      if (stt === 'failed') {
        const y = b[1] + 0.112, d = 0.24;
        R.line([[b[0] - d, y, b[2] - d], [b[0] + d, y, b[2] + d]], 3.4, GL_INK);
        R.line([[b[0] - d, y, b[2] + d], [b[0] + d, y, b[2] - d]], 3.4, GL_INK);
      }
    }
    // routes: solid where the request has been, dashed where it has not
    const lift = (p) => [p[0], p[1] + 0.02, p[2]];
    for (const x of wd.reqs) {
      const pts = route(x.req).map(lift), here = [x.j.p[0], x.j.p[1] - (x.j.done ? 0.12 : LIFT) + 0.02, x.j.p[2]];
      const done = [...pts.slice(0, x.j.leg + 1), here], rest = [here, ...pts.slice(x.j.leg + 1)];
      R.line(done, 2.8, [GL_INK[0], GL_INK[1], GL_INK[2], 0.9]);
      if (!x.j.done && reveal > 0) R.line(rest, 1.7, [C.ahead[0], C.ahead[1], C.ahead[2], 0.95 * reveal], { dash: [0.17, 0.13] });
    }
    // the riser receipts go up, and the receipts in flight
    if (reveal > 0) R.line([[RX, Y(3) + 0.3, BZ], [RX, Y(0) + 0.05, BZ]], 1.3, [C.faint[0], C.faint[1], C.faint[2], 0.9 * reveal], { dash: [0.12, 0.12] });
    for (const sl of wd.slips) {
      R.line([...sl.pts.slice(0, sl.i + 1), sl.p], 2, [GL_INK[0], GL_INK[1], GL_INK[2], 0.8]);
      R.boxEdges(sl.p, SLIP, 1.8, GL_INK);
      if (sl.f.state === 'failed') {
        const y = sl.p[1] + 0.03;
        R.line([[sl.p[0] - 0.1, y, sl.p[2] - 0.08], [sl.p[0] + 0.1, y, sl.p[2] + 0.08]], 2.6, GL_INK);
        R.line([[sl.p[0] - 0.1, y, sl.p[2] + 0.08], [sl.p[0] + 0.1, y, sl.p[2] - 0.08]], 2.6, GL_INK);
      }
    }
    for (const x of wd.reqs) if (!x.j.done) R.boxEdges(x.j.p, TOKEN, 2.4, GL_INK);
    return P;
  }

  // ---------- 2D pass ----------
  const visible = (eye, p, skip) => !OCCLUDERS.some((b) => b !== skip && segmentHitsBox(eye, p, b));
  function hull(pts) {
    const p = pts.slice().sort((a, b) => a.x - b.x || a.y - b.y), cr = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x), lo = [], up = [];
    for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (const q of p.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  // standing glyph: hollow = not on disk, solid = on disk, cross = refused
  function glyph(ctx, x, y, r, state) {
    ctx.save();
    ctx.lineWidth = 2.4; ctx.strokeStyle = INK; ctx.fillStyle = state === 'durable' ? INK : '#ffffff';
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    if (state === 'failed') { const d = r * 0.5; ctx.beginPath(); ctx.moveTo(x - d, y - d); ctx.lineTo(x + d, y + d); ctx.moveTo(x - d, y + d); ctx.lineTo(x + d, y - d); ctx.stroke(); }
    ctx.restore();
  }
  const words = (state) => { const w = D.states[state]; return w.standing ? `${w.word} · ${w.standing}` : w.word; };

  const placed = [];
  let dockX = 400;
  function label(ctx, anchor, lines, o) {
    // lines: [{ text, font, color }]; the box is measured, kept inside the stage and joined to its anchor
    const pad = 12, gap = 6;
    let w = 0, h = pad * 2 - gap;
    for (const ln of lines) { ctx.font = ln.font; ln.w = ctx.measureText(ln.text).width; ln.h = parseInt(ln.font.match(/(\d+)px/)[1], 10); w = Math.max(w, ln.w); h += ln.h + gap; }
    w += pad * 2;
    const safe = { x0: o.hud ? GAUGE_RIGHT + 14 : 24, x1: (o.hud ? 1452 : W - 24) - w, y0: 104, y1: H - BAND - 14 - h };
    let x = anchor.x + (anchor.x > (safe.x0 + safe.x1 + w) / 2 ? -(w + 64) : 64), y = anchor.y - h - 56;
    if (y < safe.y0) y = anchor.y + 56;
    x = U.clamp(x, safe.x0, Math.max(safe.x0, safe.x1)); y = U.clamp(y, safe.y0, Math.max(safe.y0, safe.y1));
    const dock = o.dock || 0;
    if (dock > 0) { x = U.lerp(x, dockX, dock); y = U.lerp(y, H - BAND - 16 - h, dock); dockX += w + 16; }
    for (let guard = 0; guard < 6; guard++) {
      const hit = placed.find((b) => x < b.x + b.w + 8 && x + w + 8 > b.x && y < b.y + b.h + 8 && y + h + 8 > b.y);
      if (!hit) break;
      y = hit.y + hit.h + 10 <= safe.y1 ? hit.y + hit.h + 10 : hit.y - h - 10;
    }
    placed.push({ x, y, w, h, id: o.id, says: o.says || null, note: o.note || null });
    const ex = U.clamp(anchor.x, x, x + w), ey = U.clamp(anchor.y, y, y + h);
    ctx.save();
    ctx.globalAlpha = (o.alpha ?? 1) * (1 - dock);
    ctx.lineWidth = 1.6; ctx.strokeStyle = INK;
    ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(anchor.x, anchor.y); ctx.stroke();
    if (o.state) glyph(ctx, anchor.x, anchor.y, 7, o.state);
    ctx.globalAlpha = o.alpha ?? 1;
    ctx.fillStyle = PANEL; ctx.strokeStyle = RULE; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 6); ctx.fill(); ctx.stroke();
    let ty = y + pad;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    for (const ln of lines) { ctx.font = ln.font; ctx.fillStyle = ln.color; ctx.fillText(ln.text, x + pad, ty); ty += ln.h + gap; }
    ctx.restore();
    return { x, y, w, h };
  }

  function drawOverlay(ctx, wd, cam, P, hudA) {
    placed.length = 0; dockX = 400;
    const flat = U.clamp(cam.top * 1.6), inScene = 1 - flat;
    // level names at the front-left corner of each floor
    if (inScene > 0.02 && hudA > 0) {
      D.levels.forEach((lv, k) => {
        // the corner of the floor that is leftmost on screen, whichever side the camera stands on
        const q = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) => R.project([(i * FLOOR.w) / 2, Y(k), (j * FLOOR.d) / 2])).reduce((a, b) => (b.w > 0 && (a.w <= 0 || b.x < a.x) ? b : a));
        ctx.save(); ctx.font = `600 30px ${FONT}`;
        // a name is drawn only where it clears the gauge on the left
        const clear = q.x - 20 - ctx.measureText(lv.label).width > GAUGE_RIGHT + 8;
        if (q.w <= 0 || !clear || q.x > 1440 || q.y < 96 || q.y > H - BAND - 30) { ctx.restore(); return; }
        ctx.globalAlpha = inScene * hudA; ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = INK; ctx.fillText(lv.label, q.x - 20, q.y + 10);
        ctx.restore();
      });
    }
    // requests: one label each, wherever the camera is; a dashed outline where something stands in front
    for (const x of wd.reqs) {
      const q = R.project(x.j.p);
      const seen = visible(P.eye, x.j.p, null);
      if (!seen && q.w > 0) {
        // the outline of the token, or of the block it was written to
        const s2 = x.j.done ? [0.37, 0.05, 0.37] : [TOKEN[0] / 2, TOKEN[1] / 2, TOKEN[2] / 2], pts = [];
        const c0 = x.j.done ? [x.j.p[0], x.j.p[1] - 0.09, x.j.p[2]] : x.j.p;
        for (const i of [-1, 1]) for (const j of [-1, 1]) for (const k of [-1, 1]) pts.push(R.project([c0[0] + i * s2[0], c0[1] + j * s2[1], c0[2] + k * s2[2]]));
        const hl = hull(pts);
        // facing the interface head-on, what lies behind it is listed under it instead of outlined on top of it
        ctx.save(); ctx.globalAlpha = 1 - U.clamp((cam.top - 0.3) / 0.4); ctx.lineWidth = 1.4; ctx.strokeStyle = INK2; ctx.fillStyle = 'rgba(22,32,44,0.16)';
        ctx.beginPath(); hl.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      }
      const off = q.w <= 0 || q.x < 0 || q.x > W || q.y < 90 || q.y > H - BAND;
      const a = off ? { x: GAUGE_RIGHT + 14, y: GAUGE.y0 + x.level * GAUGE.pitch } : q;
      const lines = [{ text: x.req.id, font: `600 26px ${MONO}`, color: INK }, { text: words(x.state), font: `500 24px ${FONT}`, color: INK }];
      const dock = !seen && !off ? U.clamp((cam.top - 0.3) / 0.4) : 0;
      if (off) lines.push({ text: D.words.offscreen, font: `400 20px ${FONT}`, color: INK2 });
      else if (dock > 0.5) lines.push({ text: `${D.words.behind} · ${D.levels[Math.round(x.level)].label}`, font: `400 20px ${FONT}`, color: INK2 });
      else if (!seen) lines.push({ text: D.words.hidden, font: `400 20px ${FONT}`, color: INK2 });
      x.box = label(ctx, a, lines, { hud: hudA > 0.5, state: off ? null : x.state, id: x.req.id, says: `${x.req.id}|${words(x.state)}`, dock, note: off ? 'off' : dock > 0.5 ? 'docked' : !seen ? 'hidden' : null });
      x.occluded = !seen && !off;
    }
    for (const sl of wd.slips) {
      const q = R.project(sl.p);
      if (q.w <= 0 || q.x < 0 || q.x > W || q.y < 90 || q.y > H - BAND) continue;
      label(ctx, q, [{ text: `${D.words.receipt} · ${sl.req.id} ${D.states[sl.f.state].word}`, font: `500 22px ${FONT}`, color: INK }], { hud: hudA > 0.5, id: sl.f.key });
    }
    if (hudA > 0) { ctx.save(); ctx.globalAlpha = hudA; gauge(ctx, wd, P); statusPanel(ctx, wd); ctx.restore(); }
    const mp = DIR.overlays.mapping, ma = U.seg(wd.s, mp[0], mp[0] + 0.5) * (1 - U.seg(wd.s, mp[1] - 0.5, mp[1]));
    if (ma > 0) mappingCard(ctx, ma);
    const tt = DIR.overlays.title, ta = U.seg(wd.s, tt[0], tt[0] + 0.4) * (1 - U.seg(wd.s, tt[1] - 0.7, tt[1]));
    if (ta > 0) {
      ctx.save(); ctx.globalAlpha = ta;
      ctx.fillStyle = 'rgba(244,247,250,0.9)'; ctx.fillRect(0, 0, W, H - BAND);
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      ctx.font = `600 92px ${FONT}`; ctx.fillStyle = INK; ctx.fillText(D.title, 168, 452);
      ctx.font = `400 38px ${FONT}`; ctx.fillStyle = INK2; ctx.fillText(D.subtitle, 172, 532);
      ctx.restore();
    }
  }

  // left: where each request is among the levels, whatever the camera shows
  const GAUGE = { x: 60, y0: 330, pitch: 128, col: 250, colPitch: 62 };
  const GAUGE_RIGHT = 24 + GAUGE.col + MODEL.reqs.length * GAUGE.colPitch - 6;
  function gauge(ctx, wd, P) {
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(246,249,252,0.86)'; ctx.beginPath(); ctx.roundRect(24, GAUGE.y0 - 112, GAUGE_RIGHT - 24, 3 * GAUGE.pitch + 232, 8); ctx.fill();
    ctx.font = `500 17px ${FONT}`; ctx.fillStyle = INK3; ctx.fillText(D.words.gauge, GAUGE.x, GAUGE.y0 - 74);
    D.levels.forEach((lv, k) => {
      const y = GAUGE.y0 + k * GAUGE.pitch;
      ctx.font = `600 26px ${FONT}`; ctx.fillStyle = INK;
      const name = U.wrap(ctx, lv.label, GAUGE.col - GAUGE.x - 30).slice(0, 2);
      name.forEach((ln, i) => ctx.fillText(ln, GAUGE.x, y + 9 + i * 30));
      ctx.font = `400 16px ${FONT}`; ctx.fillStyle = INK3;
      U.wrap(ctx, lv.gloss, GAUGE.col - GAUGE.x - 30).slice(0, 2).forEach((ln, i) => ctx.fillText(ln, GAUGE.x, y + 4 + name.length * 30 + i * 21));
      // which levels the camera can see right now
      const c = [0, Y(k), 0], q = R.project(c);
      const inView = q.w > 0 && q.x > 300 && q.x < 1470 && q.y > 40 && q.y < H - BAND && visible(P.eye, [0, Y(k) + 0.02, 0], SLABS[k]);
      if (inView) { ctx.fillStyle = INK; ctx.fillRect(GAUGE.x - 18, y - 12, 4, 26); }
    });
    ctx.font = `400 14px ${FONT}`; ctx.fillStyle = INK3; ctx.fillText(`▍${D.words.camera}`, GAUGE.x - 18, GAUGE.y0 + 3 * GAUGE.pitch + 92);
    MODEL.reqs.forEach((req, i) => {
      const x = GAUGE.col + i * GAUGE.colPitch, live = wd.reqs.find((r) => r.req === req);
      ctx.strokeStyle = RULE; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, GAUGE.y0); ctx.lineTo(x, GAUGE.y0 + 3 * GAUGE.pitch); ctx.stroke();
      for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x - 5, GAUGE.y0 + k * GAUGE.pitch); ctx.lineTo(x + 5, GAUGE.y0 + k * GAUGE.pitch); ctx.stroke(); }
      ctx.save(); ctx.globalAlpha *= live ? 1 : 0.4;
      ctx.font = `600 14px ${MONO}`; ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.fillText(req.id, x, GAUGE.y0 - 26);
      ctx.restore();
      if (live) glyph(ctx, x, GAUGE.y0 + live.level * GAUGE.pitch, 9, live.state);
    });
    ctx.textAlign = 'left';
  }

  // right: what the interface says now, and the record so far
  let panelBottom = 0;
  function statusPanel(ctx, wd) {
    const x = 1470, w = 414;
    let y = 34;
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.font = `600 30px ${FONT}`;
    const lines = U.wrap(ctx, wd.ui.text, w - 40).slice(0, 2);
    const h = 58 + lines.length * 40 + (wd.ghost ? 34 : 0);
    ctx.fillStyle = PANEL; ctx.strokeStyle = RULE; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(x, y, w, h, 6); ctx.fill(); ctx.stroke();
    ctx.font = `500 17px ${FONT}`; ctx.fillStyle = INK3; ctx.fillText(D.words.uiNow, x + 20, y + 32);
    ctx.font = `600 30px ${FONT}`; ctx.fillStyle = INK;
    lines.forEach((ln, i) => ctx.fillText(ln, x + 20, y + 74 + i * 40));
    if (wd.ghost) {
      const g = `${D.words.oldHint}：${wd.ghost}`, gy = y + 74 + lines.length * 40 - 6;
      ctx.font = `400 18px ${FONT}`; ctx.fillStyle = INK3; ctx.fillText(g, x + 20, gy);
      ctx.setLineDash([6, 5]); ctx.strokeStyle = INK3; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 20, gy + 7); ctx.lineTo(x + 20 + ctx.measureText(g).width, gy + 7); ctx.stroke(); ctx.setLineDash([]);
    }
    y += h + 30;
    const idW = (ctx.font = `600 19px ${MONO}`, Math.max(...MODEL.reqs.map((r) => ctx.measureText(r.id).width)));
    const wordX = x + 104 + idW + 22;
    ctx.font = `500 19px ${FONT}`;
    const ledger = MODEL.events.filter((e) => wd.tau >= e.time).map((e) => ({ e, lines: U.wrap(ctx, words(e.state), x + w - wordX) }));
    const rowH = (r) => 10 + r.lines.length * 24;
    ctx.fillStyle = 'rgba(246,249,252,0.86)'; ctx.beginPath(); ctx.roundRect(x - 12, y - 30, w + 24, 96 + ledger.reduce((a, r) => a + rowH(r), 0) + 6, 8); ctx.fill();
    ctx.font = `500 17px ${FONT}`; ctx.fillStyle = INK3; ctx.fillText(D.words.ledger, x + 4, y);
    ctx.textAlign = 'right'; ctx.font = `500 19px ${MONO}`; ctx.fillStyle = INK2; ctx.fillText(wd.tau < MODEL.events[0].time ? D.words.before : `t = ${wd.tau.toFixed(1)}`, x + w - 4, y);
    // event-time ruler: the playhead holds while the film looks around
    const t0 = MODEL.events[0].time, t1 = MODEL.events[MODEL.events.length - 1].time, rx = (t) => x + 8 + ((w - 16) * (t - t0)) / (t1 - t0 || 1);
    y += 24;
    ctx.strokeStyle = RULE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 4, y); ctx.lineTo(x + w - 4, y); ctx.stroke();
    for (const e of MODEL.events) { ctx.strokeStyle = wd.tau >= e.time ? INK : INK3; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(rx(e.time), y - 6); ctx.lineTo(rx(e.time), y + 6); ctx.stroke(); }
    const px = rx(U.clamp(wd.tau, t0, t1));
    ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(px, y - 3); ctx.lineTo(px - 6, y - 13); ctx.lineTo(px + 6, y - 13); ctx.closePath(); ctx.fill();
    ctx.textAlign = 'left'; ctx.font = `400 14px ${FONT}`; ctx.fillStyle = INK3; ctx.fillText(D.words.eventTime, x + 4, y + 26);
    y += 62;
    for (const r of ledger) {
      const e = r.e;
      ctx.font = `500 19px ${MONO}`; ctx.fillStyle = INK3; ctx.fillText(`t=${e.time}`, x + 4, y);
      glyph(ctx, x + 84, y - 7, 7, e.state);
      ctx.font = `600 19px ${MONO}`; ctx.fillStyle = INK; ctx.fillText(e.id, x + 104, y);
      ctx.font = `500 19px ${FONT}`; ctx.fillStyle = INK;
      r.lines.forEach((ln, i) => ctx.fillText(ln, wordX, y + i * 24));
      y += rowH(r);
    }
    panelBottom = Math.max(panelBottom, y);
  }

  function mappingCard(ctx, a) {
    const mp = D.mapping, x = 1016, y = 420, colW = [190, 190, 410], w = colW.reduce((p, c) => p + c, 0) + 56;
    const P = D.ui.policies;
    ctx.font = `400 22px ${FONT}`;
    const rows = ['ack', 'durable', 'failed'].map((k) => [D.states[k].word, P.naive[k], P.truthful[k]].map((cell, i) => U.wrap(ctx, cell, colW[i] - 18)));
    const rowH = rows.map((r) => 18 + Math.max(...r.map((c) => c.length)) * 28), h = 96 + rowH.reduce((p, c) => p + c, 0) + 20;
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(255,255,255,0.97)'; ctx.strokeStyle = RULE; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(x, y, w, h, 8); ctx.fill(); ctx.stroke();
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.font = `600 28px ${FONT}`; ctx.fillStyle = INK; ctx.fillText(mp.title, x + 28, y + 46);
    let cx = x + 28;
    mp.columns.forEach((c, i) => { ctx.font = `500 17px ${FONT}`; ctx.fillStyle = INK3; ctx.fillText(c, cx, y + 84); cx += colW[i]; });
    ctx.fillStyle = RULE; ctx.fillRect(x + 28, y + 96, w - 56, 1.5);
    let ry = y + 132;
    rows.forEach((row, r) => {
      let rxx = x + 28;
      row.forEach((cell, i) => {
        ctx.font = `${i === 2 ? 600 : 400} 22px ${FONT}`; ctx.fillStyle = i === 1 ? INK3 : INK;
        cell.forEach((ln, k) => ctx.fillText(ln, rxx, ry + k * 28)); rxx += colW[i];
      });
      ry += rowH[r];
    });
    ctx.restore();
  }

  // ---------- frame ----------
  let lastS = 0;
  const captionAt = (s) => U.at(MODEL.captions, s);
  function render(ctx, s, env) {
    lastS = s;
    const pure = env.pure;
    const wd = world(s), cam = cameraAt(s, pure);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#f5f8fb'); g.addColorStop(1, '#e7edf3');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const rv = DIR.overlays.reveal, hudA = U.seg(s, rv[0], rv[1]);
    if (R && !glFailed && !R.lost()) {
      const P = drawWorld(wd, cam, hudA);
      ctx.drawImage(R.canvas, 0, 0);
      drawOverlay(ctx, wd, cam, P, hudA);
    } else {
      ctx.fillStyle = INK; ctx.font = `600 40px ${FONT}`; ctx.textAlign = 'left';
      ctx.fillText(D.words.noGL, 160, 420);
      ctx.font = `400 28px ${FONT}`; ctx.fillStyle = INK2; ctx.fillText(D.words.noGLMore, 160, 476);
    }
    const ch = DIR.chapters;
    let ci = 0;
    ch.forEach((c, i) => { if (s >= c.t) ci = i; });
    VG.hud(ctx, { W, H, chapter: `${String(ci + 1).padStart(2, '0')} · ${ch[ci].label}`, caption: captionAt(s), tag: D.tag, progress: s / MODEL.duration, accent: INK2 });
  }

  // ---------- self-test ----------
  // Compares what is drawn (label text, block state) with the raw fixture events, read here without model.js.
  function selfTest() {
    const checks = [], skipped = [], eq = (name, got, want) => checks.push({ name, got, want, pass: JSON.stringify(got) === JSON.stringify(want) });
    const times = Array.from({ length: Math.round(MODEL.duration * 10) + 1 }, (_, i) => i / 10);
    const raw = D.fixture.events;
    const rawState = (id, tau) => { let st = null; for (const e of raw) if (e.id === id && tau >= e.time) st = e.state; return st; };
    const gl = R && !glFailed;
    const ctx = document.createElement('canvas').getContext('2d');
    const overlayAt = (s, cam) => {
      const wd = world(s), P = pose(cam);
      R.begin({ eye: P.eye, target: P.target, up: P.up, fov: 30, shift: SHIFT }, FOG);
      drawOverlay(ctx, wd, cam, P, U.seg(s, DIR.overlays.reveal[0], DIR.overlays.reveal[1]));
      return wd;
    };
    // 1. blocks and labels say what the fixture says, at every sample
    let wrongBlock = 0, wrongLabel = 0, lost = 0, outside = 0, onGauge = 0, occluded = 0, overlap = 0;
    panelBottom = 0;
    for (const s of times) {
      const tau = M.tauAt(MODEL.knots, s), bs = blockStates(world(s));
      for (const r of MODEL.reqs) {
        const want = rawState(r.id, tau), got = bs.get(blockOf(r)) || 'empty';
        // a block shows a terminal state only when the fixture has reached it; before that it is empty or being written
        if (M.TERMINAL.includes(want) ? got !== want : !['empty', 'writing'].includes(got)) wrongBlock++;
      }
      if (!gl) continue;
      const wd = overlayAt(s, directorCam(s)), hud = U.seg(s, DIR.overlays.reveal[0], DIR.overlays.reveal[1]) > 0.5;
      for (const r of MODEL.reqs) {
        const want = rawState(r.id, tau), mine = placed.filter((b) => b.id === r.id);
        if (want === null ? mine.length !== 0 : mine.length !== 1 || mine[0].says !== `${r.id}|${words(want)}`) wrongLabel++;
      }
      for (const x of wd.reqs) {
        if (!x.box) { lost++; continue; }
        if (x.box.x < 0 || x.box.y < 0 || x.box.x + x.box.w > W || x.box.y + x.box.h > H - BAND) outside++;
        if (x.occluded) occluded++;
      }
      for (const b of placed) if (hud && b.x < GAUGE_RIGHT) onGauge++;
      for (let i = 0; i < placed.length; i++) for (let j = i + 1; j < placed.length; j++) {
        const a = placed[i], b = placed[j];
        if (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y) overlap++;
      }
    }
    eq('block_state_matches_fixture_at_every_sample', wrongBlock, 0);
    if (gl) {
      eq('label_text_matches_fixture_at_every_sample', wrongLabel, 0);
      eq('label_present_for_every_live_request', lost, 0);
      eq('label_inside_stage', outside, 0);
      eq('labels_clear_of_the_level_gauge', onGauge, 0);
      eq('labels_do_not_overlap', overlap, 0);
      checks.push({ name: 'request_labelled_while_something_stands_in_front', got: occluded, want: '> 0 samples', pass: occluded > 0 });
      eq('record_panel_fits_above_caption', panelBottom <= H - BAND - 8, true);
      // 2. under every station the viewer can hold, each live request still has exactly one label with the same words
      let bad = 0, compared = 0;
      for (let s = 1; s <= MODEL.duration; s += 1) {
        const tau = M.tauAt(MODEL.knots, s);
        for (const name of Object.keys(DIR.stations)) {
          overlayAt(s, DIR.stations[name]);
          for (const r of MODEL.reqs) {
            const want = rawState(r.id, tau), mine = placed.filter((b) => b.id === r.id);
            compared++;
            if (want === null ? mine.length !== 0 : mine.length !== 1 || mine[0].says !== `${r.id}|${words(want)}`) bad++;
          }
          for (let i = 0; i < placed.length; i++) for (let j = i + 1; j < placed.length; j++) {
            const a = placed[i], b = placed[j];
            if (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y) bad++;
          }
        }
      }
      checks.push({ name: 'labels_correct_and_apart_under_every_station', got: bad, want: 0, pass: bad === 0 && compared > 0 });
    } else skipped.push('label_text_matches_fixture_at_every_sample', 'label_present_for_every_live_request', 'label_inside_stage', 'labels_clear_of_the_level_gauge', 'labels_do_not_overlap', 'request_labelled_while_something_stands_in_front', 'record_panel_fits_above_caption', 'labels_correct_and_apart_under_every_station');
    // 3. each state flips at the story time the model reports for its event (tau(s) and its inverse agree)
    eq('states_flip_at_reported_story_times', MODEL.events.filter((e) => {
      const r = MODEL.reqs.find((x) => x.id === e.id);
      return !(M.stateAt(r, M.tauAt(MODEL.knots, e.s - 1e-6)) !== e.state && M.stateAt(r, M.tauAt(MODEL.knots, e.s)) === e.state);
    }).map((e) => e.key), []);
    // 4. the wording: the truthful policy never says saved before the data is on disk; the naive one does, which is the control
    let early = 0, naiveEarly = 0;
    for (const s of times) {
      const tau = M.tauAt(MODEL.knots, s);
      for (const name of ['truthful', 'naive']) {
        const u = M.uiStatus(D, MODEL, s, name);
        if (u.req && u.text === D.ui.policies[name].durable && rawState(u.req.id, tau) !== 'durable') { if (name === 'truthful') early++; else naiveEarly++; }
      }
    }
    eq('truthful_wording_never_early', early, 0);
    checks.push({ name: 'naive_wording_is_early_somewhere', got: naiveEarly, want: '> 0 samples', pass: naiveEarly > 0 });
    // 5. the interface never knows a state the fixture has not reached
    let ahead = 0;
    for (const s of times) for (const r of MODEL.reqs) {
      const known = M.uiKnown(MODEL, r, s), tau = M.tauAt(MODEL.knots, s);
      if (known && !raw.some((e) => e.id === r.id && e.state === known && tau >= e.time)) ahead++;
    }
    eq('interface_never_ahead_of_events', ahead, 0);
    // 6. tokens move continuously: between two frames a token never covers more than a fifth of a level
    let jump = 0;
    for (const r of MODEL.reqs) {
      let prev = null;
      for (let i = 0; i <= MODEL.duration * 30; i++) {
        const j = journey(r, M.tauAt(MODEL.knots, i / 30));
        if (j && prev && !j.done && V.len(V.sub(j.p, prev)) > G / 5) jump++;
        prev = j && !j.done ? j.p : null;
      }
    }
    eq('token_motion_continuous', jump, 0);
    // 7. the text on the interface fits its panel in every state
    uiBodyLines = 0;
    for (let s = 0; s <= MODEL.duration; s += 1) drawUI(uiState(world(s)));
    uiKey = '';
    eq('interface_body_fits', uiBodyLines <= UI_BODY_LINES, true);
    return { pass: checks.every((c) => c.pass), checks, skipped };
  }

  // ---------- stage ----------
  // pure: export, and every frame drawn before the viewer takes the camera; only the viewer's own camera is stateful
  const PURE = new URLSearchParams(location.search).has('export');
  let userCam = false;
  const stageRoot = document.getElementById('vg') || document.body;
  initGL();
  VG.stage({
    kicker: `MC01 · ${D.id} ${D.revision} · synthetic`,
    title: D.title,
    lede: `${D.subtitle}。${D.words.lede}`,
    duration: MODEL.duration, fps: 30, width: W, height: H,
    chapters: DIR.chapters, staticTimes: DIR.staticTimes,
    render(ctx, s, env) { env.pure = PURE || !userCam || stageRoot.classList.contains('vg-is-static'); render(ctx, s, env); },
    transcript: captionAt,
    meta: { fixture_id: D.id, fixture_revision: D.revision, selfTest, bitrate: 10_000_000 },
    footer: `${D.words.footer}`,
  });
  window.MC01 = {
    data: D, model: MODEL, world, journey, levelOf, words,
    setStation(name) { if (PURE || !setStation(name)) return false; userCam = true; return true; },
    station: () => view.station,
    cameraMoving,
    lastS: () => lastS,
    labels: () => placed.map((b) => ({ ...b })),
    camera: () => (view.last ? { ...view.last } : null),
    // test hooks for losing and restoring the GL context
    debug: { lose() { const e = R && R.gl.getExtension('WEBGL_lose_context'); if (e) { R._lose = e; e.loseContext(); } return !!e; }, restore() { if (R && R._lose) R._lose.restoreContext(); } },
    gl: () => (R && !glFailed ? R.renderer() : null),
    glOk: () => !!R && !glFailed && !R.lost(),
    uiBodyLines: () => uiBodyLines,
  };
})();
