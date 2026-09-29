/* Event · State · Context — three glass panels in one perspective space.
 * State and context are derived from the fixture by fold(); the drawing never
 * decides semantics on its own. Camera, beams and captions are pure in t. */
(function () {
  'use strict';
  const { U, FONT, MONO } = VG;
  const FX = window.VG_FIXTURE;
  const LAG = 1.2; // seconds between an event entering the log and its beam reaching state

  // ---------- semantics ----------
  function fold(events, cutoff) {
    const log = [], seen = new Set(), candidates = {}, replays = [];
    let state = {}, version = 0;
    const versions = [{ version: 0, state: {} }];
    for (const ev of events) {
      if (!cutoff(ev)) continue;
      if (seen.has(ev.event_id)) { replays.push(ev); continue; }
      seen.add(ev.event_id); log.push(ev);
      if (ev.effect === 'pending') candidates[ev.candidate_id] = { ...ev, status: 'pending' };
      if (ev.effect === 'reject') { const c = candidates[ev.decides]; if (c) { c.status = 'rejected'; c.closed = ev.t; } }
      if (ev.effect === 'commit') {
        let set = ev.set;
        if (ev.decides) { const c = candidates[ev.decides]; if (c) { c.status = 'approved'; c.closed = ev.t; set = c.proposes; } }
        state = { ...state, ...set }; version += 1;
        versions.push({ version, state, event_id: ev.event_id, t: ev.t });
      }
    }
    return { log, state, version, versions, candidates, replays };
  }
  const logAt = (t) => fold(FX.events, (ev) => ev.t <= t);
  const stateAt = (t) => fold(FX.events, (ev) => ev.t + LAG <= t);
  const END = fold(FX.events, () => true);
  const stateAtVersion = (v) => (END.versions.find((x) => x.version === v) || { state: {} }).state;

  const FIELDS = [['counterparty', '对方'], ['term', '期限'], ['payment', '付款'], ['status', '状态']];
  const LABEL = Object.fromEntries(FIELDS);

  // ---------- space ----------
  const PW = 1600, PH = 760;
  const PANELS = {
    log: { c: [0, -920, 300], name: '事件日志', sub: 'Event · 追加，不改写' },
    state: { c: [0, 0, 150], name: '当前状态', sub: 'State · 只含已生效事实' },
    ctx: { c: [0, 920, 0], name: '上下文', sub: 'Context · 一次调用看到的选择' },
  };
  const world = (P, u, v) => [P.c[0] + u - PW / 2, P.c[1] - (v - PH / 2), P.c[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (a) => { const l = Math.hypot(...a); return [a[0] / l, a[1] / l, a[2] / l]; };
  const mix3 = (a, b, k) => [U.lerp(a[0], b[0], k), U.lerp(a[1], b[1], k), U.lerp(a[2], b[2], k)];

  const face = (P, d, dx = 0, dy = 0) => ({ pos: [P.c[0] + dx, P.c[1] + dy, P.c[2] - d], tgt: P.c.slice() });
  const pair = (A, B, d, dx) => { const m = mix3(A.c, B.c, 0.5); return { pos: [m[0] + dx, m[1], m[2] - d], tgt: m }; };
  const SHOT = {
    over: { pos: [2900, 1300, -3300], tgt: [0, 0, 150] },
    log: face(PANELS.log, 1500, 120, 40),
    state: face(PANELS.state, 1500, 120, 40),
    ls: pair(PANELS.log, PANELS.state, 2560, 420),
    sc: pair(PANELS.state, PANELS.ctx, 2560, 420),
  };
  const KEYS = [
    [0, 'over'], [4, 'over'], [5.6, 'log'], [8.2, 'log'], [9.4, 'ls'], [26, 'ls'], [27.6, 'sc'], [33, 'sc'],
    [34.4, 'ls'], [38.5, 'ls'], [39.8, 'sc'], [42, 'sc'], [43.2, 'log'], [47, 'log'], [48.2, 'sc'], [52.6, 'sc'],
    [53.8, 'state'], [56, 'state'], [57.8, 'over'], [64, 'over'],
  ];
  function camera(t) {
    let i = 0;
    while (i < KEYS.length - 2 && KEYS[i + 1][0] <= t) i++;
    const [t0, a] = KEYS[i], [t1, b] = KEYS[i + 1];
    const k = U.ease.inOut(U.seg(t, t0, t1));
    const A = SHOT[a], B = SHOT[b];
    // slow drift so held shots still breathe; deterministic in t
    const drift = [Math.sin(t * 0.21) * 40, Math.sin(t * 0.17) * 22, 0];
    return { pos: mix3(A.pos, B.pos, k).map((x, j) => x + drift[j]), tgt: mix3(A.tgt, B.tgt, k) };
  }

  let cam, fwd, right, up;
  const F = 1400, CX = 960, CY = 468; // optical centre sits above the caption band
  function setCam(c) {
    cam = c; fwd = norm(sub(c.tgt, c.pos));
    right = norm(cross([0, 1, 0], fwd)); up = cross(fwd, right);
  }
  function proj(p) {
    const d = sub(p, cam.pos);
    const z = dot(d, fwd);
    return { x: CX + (F * dot(d, right)) / z, y: CY - (F * dot(d, up)) / z, z };
  }
  // draw in panel-local units with an affine fitted at (u, v)
  function on(ctx, P, u, v, fn) {
    const p0 = proj(world(P, u, v)), pu = proj(world(P, u + 1, v)), pv = proj(world(P, u, v + 1));
    if (p0.z < 50) return;
    ctx.save();
    ctx.setTransform(pu.x - p0.x, pu.y - p0.y, pv.x - p0.x, pv.y - p0.y, p0.x, p0.y);
    fn(ctx);
    ctx.restore();
  }

  // ---------- palette ----------
  const C = {
    bg: '#eef3f8', grid: '#d9e2ec', glass: 'rgba(255,255,255,0.93)', edge: '#b8c6d6',
    ink: '#16202c', ink2: '#4a5868', ink3: '#8593a3', accent: '#1f6feb', faint: '#c4d0dc',
  };
  const font = (w, s, f = FONT) => `${w} ${s}px ${f}`;
  function text(ctx, s, x, y, f, col, align = 'left') {
    ctx.font = f; ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.fillText(s, x, y);
  }
  function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  // ---------- panels ----------
  function panelFrame(ctx, P) {
    const q = [world(P, 0, 0), world(P, PW, 0), world(P, PW, PH), world(P, 0, PH)].map(proj);
    ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.closePath();
    ctx.fillStyle = C.glass; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = C.edge; ctx.stroke();
    on(ctx, P, 44, 70, (c) => {
      text(c, P.name, 0, 0, font(600, 44), C.ink);
      text(c, P.sub, 0, 40, font(400, 24), C.ink2);
    });
  }

  const SLOT = (i) => ({ u: 40 + i * 256, v: 140, w: 240, h: 320 });
  const LOG_SLOT = {}; // event_id -> slot index
  FX.events.forEach((ev) => { if (!(ev.event_id in LOG_SLOT)) LOG_SLOT[ev.event_id] = Object.keys(LOG_SLOT).length; });

  function describe(ev) {
    if (ev.set) return Object.entries(ev.set).map(([k, v]) => `${LABEL[k]} ${v}`);
    if (ev.proposes) return Object.entries(ev.proposes).map(([k, v]) => `${LABEL[k]} → ${v}`);
    if (ev.decides) return [`${ev.effect === 'reject' ? '拒绝' : '批准'} ${ev.decides}`].concat(ev.reason ? [ev.reason] : []);
    return [];
  }

  function eventCard(ctx, ev, t, L) {
    const s = SLOT(LOG_SLOT[ev.event_id]);
    const k = U.ease.out(U.seg(t, ev.t, ev.t + 0.55));
    if (k <= 0) return;
    const cand = ev.candidate_id ? L.candidates[ev.candidate_id] : null;
    const rejected = cand && cand.status === 'rejected';
    const pulse = ev.event_id === 'evt-003' ? Math.max(0, 1 - Math.abs(t - 45) / 1.2) : 0;
    on(ctx, PANELS.log, s.u + (1 - k) * 80, s.v, (c) => {
      c.globalAlpha = k;
      rrect(c, 0, 0, s.w, s.h, 8);
      c.fillStyle = '#ffffff'; c.fill();
      c.setLineDash(ev.effect === 'pending' ? [9, 7] : []);
      const human = ev.actor.startsWith('人工');
      c.lineWidth = human ? 3 : 2; c.strokeStyle = human ? C.accent : C.ink2;
      if (pulse) { c.lineWidth = 3 + pulse * 5; c.strokeStyle = C.accent; }
      c.stroke(); c.setLineDash([]);
      text(c, ev.event_id, 18, 40, font(500, 22, MONO), C.ink3);
      text(c, ev.type, 18, 74, font(600, 19, MONO), C.ink);
      text(c, ev.actor, 18, 116, font(600, 28), human ? C.accent : C.ink2);
      c.font = font(400, 23);
      describe(ev).flatMap((line) => U.wrap(c, line, s.w - 36)).slice(0, 4)
        .forEach((ln, j) => text(c, ln, 18, 158 + j * 32, font(400, 23), C.ink));
      let badge = ev.effect === 'commit' ? '已生效' : ev.effect === 'pending' ? '候选 · 未生效' : '拒绝 · 已留档';
      if (cand && cand.status === 'approved' && t >= cand.closed) badge = '候选 · 已批准';
      if (rejected && t >= cand.closed) badge = '被拒 · 仍在日志';
      text(c, badge, 18, s.h - 22, font(600, 21), C.ink2);
      if (rejected && t >= cand.closed) {
        const kk = U.seg(t, cand.closed, cand.closed + 0.5);
        c.strokeStyle = C.ink2; c.lineWidth = 2;
        c.beginPath(); c.moveTo(18, 150); c.lineTo(18 + (s.w - 36) * kk, 150); c.stroke();
      }
      c.globalAlpha = 1;
    });
  }

  function replayGhost(ctx, t) {
    const R = END.replays[0];
    if (!R || t < R.t || t > R.t + 4) return;
    const s = SLOT(LOG_SLOT[R.event_id]);
    const inK = U.ease.inOut(U.seg(t, R.t, R.t + 1.3));
    const fade = 1 - U.seg(t, R.t + 3, R.t + 4);
    const u = U.lerp(PW + 40, s.u + 18, inK), v = s.v + 300 - inK * 282;
    on(ctx, PANELS.log, u, v, (c) => {
      c.globalAlpha = 0.9 * fade;
      rrect(c, 0, 0, s.w, s.h, 8); c.fillStyle = 'rgba(238,243,248,0.92)'; c.fill();
      c.setLineDash([5, 6]); c.lineWidth = 2; c.strokeStyle = C.ink2; c.stroke(); c.setLineDash([]);
      text(c, R.event_id, 18, 40, font(500, 22, MONO), C.ink2);
      text(c, '重放', 18, 118, font(600, 28), C.ink2);
      text(c, R.type, 18, 74, font(600, 19, MONO), C.ink2);
      c.globalAlpha = 1;
    });
    if (t > R.t + 1.3) {
      const k = U.ease.outBack(U.seg(t, R.t + 1.3, R.t + 1.8));
      on(ctx, PANELS.log, s.u + s.w / 2, s.v + s.h + 60, (c) => {
        c.globalAlpha = fade; c.scale(k, k);
        rrect(c, -210, -40, 420, 64, 6); c.fillStyle = C.ink; c.fill();
        text(c, `${R.event_id} 已存在 · 不新增`, 0, 3, font(600, 28), '#ffffff', 'center');
        c.globalAlpha = 1;
      });
    }
  }

  function logPanel(ctx, t) {
    const L = logAt(t);
    panelFrame(ctx, PANELS.log);
    const replayed = L.replays.length;
    on(ctx, PANELS.log, PW - 44, 70, (c) => {
      text(c, `log_length ${L.log.length}`, 0, 0, font(600, 30, MONO), C.ink, 'right');
      if (replayed) text(c, `重放 ${replayed} 次 · 按 event_id 去重`, 0, 38, font(400, 22), C.ink2, 'right');
    });
    // time rule under the cards
    on(ctx, PANELS.log, 44, 560, (c) => {
      c.strokeStyle = C.faint; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(PW - 88, 0); c.stroke();
      text(c, '实线 = 已生效　虚线 = 候选，未生效　蓝色 = 人工决定', 0, 50, font(400, 22), C.ink3);
      text(c, `object ${FX.object.object_id} · ${FX.object.title}`, 0, 90, font(400, 22), C.ink3);
    });
    for (const ev of L.log) eventCard(ctx, ev, t, L);
    replayGhost(ctx, t);
  }

  const ROW = (i) => ({ u: 44, v: 160 + i * 112 });
  function valueHistory(key) {
    return END.versions.filter((x) => x.state[key] !== undefined).map((x, i, arr) => ({ t: x.t + LAG, v: x.state[key], prev: i ? arr[i - 1].state[key] : null }))
      .filter((x, i, arr) => i === 0 || x.v !== arr[i - 1].v);
  }
  const HIST = Object.fromEntries(FIELDS.map(([k]) => [k, valueHistory(k)]));

  function statePanel(ctx, t) {
    const S = stateAt(t);
    panelFrame(ctx, PANELS.state);
    const vFlash = S.versions.length ? Math.max(0, 1 - (t - (S.versions[S.versions.length - 1].t + LAG)) / 1.2) : 0;
    on(ctx, PANELS.state, PW - 44, 80, (c) => {
      text(c, `state_version v${S.version}`, 0, 0, font(700, 40, MONO), vFlash > 0 ? C.accent : C.ink, 'right');
      const last = S.versions[S.versions.length - 1];
      if (last && last.event_id) text(c, `last_event ${last.event_id}`, 0, 38, font(400, 22, MONO), C.ink2, 'right');
    });
    FIELDS.forEach(([key, label], i) => {
      const r = ROW(i);
      const h = HIST[key].filter((x) => x.t <= t);
      const cur = h[h.length - 1];
      on(ctx, PANELS.state, r.u, r.v, (c) => {
        c.strokeStyle = C.grid; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, 30); c.lineTo(980, 30); c.stroke();
        text(c, label, 0, 0, font(400, 28), C.ink2);
        if (!cur) { text(c, '—', 170, 4, font(600, 40), C.faint); return; }
        const k = U.ease.out(U.seg(t, cur.t, cur.t + 0.6));
        if (cur.prev && k < 1) {
          c.globalAlpha = 1 - k;
          text(c, cur.prev, 170, 4 - k * 40, font(600, 40), C.ink3);
          c.globalAlpha = 1;
        }
        c.globalAlpha = k;
        text(c, cur.v, 170, 4 + (1 - k) * 36, font(600, 40), C.ink);
        c.globalAlpha = 1;
      });
    });
    // "not selected ≠ deleted" callout on the term row
    const ex = U.seg(t, 53.3, 54) * (1 - U.seg(t, 57, 57.6));
    if (ex > 0) {
      const r = ROW(1);
      on(ctx, PANELS.state, r.u - 16, r.v - 50, (c) => {
        c.globalAlpha = ex; c.strokeStyle = C.accent; c.lineWidth = 4; rrect(c, 0, 0, 1010, 96, 8); c.stroke();
        text(c, 'ctx-B 未选入 · 状态中仍在', 1030, 60, font(600, 28), C.accent);
        c.globalAlpha = 1;
      });
    }
    // candidate column
    on(ctx, PANELS.state, 1100, 150, (c) => text(c, '待审候选', 0, 0, font(600, 26), C.ink2));
    let slot = 0;
    for (const ev of FX.events) {
      if (ev.effect !== 'pending') continue;
      const appear = ev.t + LAG;
      if (t < appear) continue;
      const cand = END.candidates[ev.candidate_id];
      const closed = cand.closed + LAG;
      const gone = cand.status !== 'pending' ? U.seg(t, closed + 2.6, closed + 3.4) : 0;
      if (gone >= 1) continue;
      const k = U.ease.out(U.seg(t, appear, appear + 0.5)) * (1 - gone);
      const y = 180 + slot * 150; slot++;
      on(ctx, PANELS.state, 1100, y, (c) => {
        c.globalAlpha = k;
        rrect(c, 0, 0, 456, 124, 8); c.setLineDash([9, 7]); c.lineWidth = 2; c.strokeStyle = C.ink2; c.stroke(); c.setLineDash([]);
        text(c, ev.candidate_id, 18, 36, font(500, 22, MONO), C.ink3);
        text(c, describe(ev)[0], 18, 78, font(600, 30), C.ink);
        let note = '未生效';
        if (t >= closed) note = cand.status === 'approved' ? '已批准 · 已并入状态' : '已拒绝 · 不进入状态';
        text(c, note, 18, 112, font(600, 22), t >= closed && cand.status === 'approved' ? C.accent : C.ink2);
        if (t >= closed && cand.status === 'rejected') {
          c.strokeStyle = C.ink2; c.lineWidth = 2; c.beginPath(); c.moveTo(18, 68); c.lineTo(18 + 300 * U.seg(t, closed, closed + 0.4), 68); c.stroke();
        }
        c.globalAlpha = 1;
      });
    }
  }

  const LENS = (i) => ({ u: 44 + i * 776, v: 130, w: 736, h: 580 });
  function ctxPanel(ctx, t) {
    const S = stateAt(t);
    panelFrame(ctx, PANELS.ctx);
    FX.contexts.forEach((cx, i) => {
      const L = LENS(i);
      const k = U.ease.out(U.seg(t, cx.t, cx.t + 0.6));
      on(ctx, PANELS.ctx, L.u, L.v, (c) => {
        rrect(c, 0, 0, L.w, L.h, 10);
        if (k <= 0) {
          c.setLineDash([9, 7]); c.strokeStyle = C.faint; c.lineWidth = 2; c.stroke(); c.setLineDash([]);
          text(c, `${cx.context_id} · 尚未编译`, 28, 60, font(500, 26), C.ink3);
          return;
        }
        c.globalAlpha = k; c.fillStyle = '#ffffff'; c.fill(); c.lineWidth = 2; c.strokeStyle = C.ink2; c.stroke();
        text(c, `${cx.context_id} · ${cx.task}`, 28, 56, font(600, 32), C.ink);
        text(c, `basis v${cx.basis_version}`, L.w - 28, 56, font(600, 26, MONO), C.ink2, 'right');
        const snap = stateAtVersion(cx.basis_version);
        let y = 120;
        text(c, '选入', 28, y, font(600, 22), C.ink3); y += 44;
        cx.selected.forEach((key, j) => {
          const kk = U.ease.out(U.seg(t, cx.t + 0.9 + j * 0.25, cx.t + 1.5 + j * 0.25));
          c.globalAlpha = k * kk;
          const label = key.startsWith('evidence:') ? '证据' : LABEL[key];
          const val = key.startsWith('evidence:') ? key.slice(9) : snap[key];
          text(c, label, 28, y, font(400, 28), C.ink2);
          text(c, val, 150, y, font(600, 32), C.ink);
          y += 50;
        });
        c.globalAlpha = k;
        y += 10;
        text(c, '未选入', 28, y, font(600, 22), C.ink3); y += 40;
        text(c, cx.excluded.map((x) => LABEL[x]).join('、') + '　（仍在状态中）', 28, y, font(400, 26), C.ink3);
        // budget
        const bw = L.w - 56, frac = cx.budget.used / cx.budget.limit;
        c.fillStyle = C.grid; c.fillRect(28, L.h - 190, bw, 10);
        c.fillStyle = C.ink2; c.fillRect(28, L.h - 190, bw * frac * U.seg(t, cx.t + 0.6, cx.t + 1.6), 10);
        text(c, `${cx.budget.used.toLocaleString()} / ${cx.budget.limit.toLocaleString()} 字符预算`, 28, L.h - 152, font(400, 22, MONO), C.ink2);
        // basis.current
        const current = cx.basis_version === S.version;
        const staleAt = (END.versions.find((x) => x.version === cx.basis_version + 1) || {}).t;
        text(c, `basis.current = ${current}`, 28, L.h - 78, font(700, 28, MONO), current ? C.ink : C.ink2);
        if (!current && staleAt !== undefined) {
          const sk = U.seg(t, staleAt + LAG, staleAt + LAG + 0.5);
          c.globalAlpha = k * sk;
          text(c, `基于 v${cx.basis_version}，当前 v${S.version} · 决定入口暂停，需重新编译`, 28, L.h - 32, font(600, 24), C.ink2);
          c.setLineDash([10, 8]); c.lineWidth = 3; c.strokeStyle = C.ink2; rrect(c, -8, -8, L.w + 16, L.h + 16, 14); c.stroke(); c.setLineDash([]);
        }
        c.globalAlpha = 1;
      });
    });
  }

  // ---------- beams between panels ----------
  function beam(ctx, a, b, k, color, dashed, stopAt = 1, alpha = 1) {
    if (k <= 0 || alpha <= 0) return;
    const A = proj(a), B = proj(b);
    if (A.z < 50 || B.z < 50) return;
    const e = Math.min(k, stopAt);
    const X = U.lerp(A.x, B.x, e), Y = U.lerp(A.y, B.y, e);
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.globalAlpha = 0.85 * alpha;
    ctx.setLineDash(dashed ? [10, 8] : []);
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(X, Y); ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha = alpha;
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(X, Y, 7, 0, Math.PI * 2); ctx.fill();
    if (stopAt < 1 && k >= stopAt) {
      ctx.lineWidth = 3; ctx.beginPath();
      ctx.moveTo(X - 10, Y - 10); ctx.lineTo(X + 10, Y + 10); ctx.moveTo(X + 10, Y - 10); ctx.lineTo(X - 10, Y + 10); ctx.stroke();
    }
    ctx.restore();
  }
  function beams(ctx, t) {
    for (const ev of FX.events) {
      if (ev.replay) continue;
      const s = SLOT(LOG_SLOT[ev.event_id]);
      const from = world(PANELS.log, s.u + s.w / 2, s.v);
      const human = ev.actor.startsWith('人工');
      const col = human ? C.accent : C.ink2;
      const k = U.ease.inOut(U.seg(t, ev.t + 0.3, ev.t + LAG)), a = 1 - U.seg(t, ev.t + 3, ev.t + 3.6);
      if (ev.effect === 'commit') {
        const keys = ev.set ? Object.keys(ev.set) : Object.keys(END.candidates[ev.decides].proposes);
        keys.forEach((key) => {
          const i = FIELDS.findIndex(([f]) => f === key);
          beam(ctx, from, world(PANELS.state, 150, ROW(i).v + 30), k, col, false, 1, a);
        });
      } else if (ev.effect === 'pending') {
        beam(ctx, from, world(PANELS.state, 1100, 180), k, C.ink2, true, 1, a);
      }
    }
    for (const cx of FX.contexts) {
      const L = LENS(FX.contexts.indexOf(cx));
      const k = U.ease.inOut(U.seg(t, cx.t, cx.t + 0.9)), a = 1 - U.seg(t, cx.t + 4.5, cx.t + 5.3);
      // each selected field lands on its own line in the lens; excluded ones stop short
      cx.selected.forEach((key, j) => {
        const i = FIELDS.findIndex(([f]) => f === key);
        const from = i >= 0 ? world(PANELS.state, 440, ROW(i).v - 12) : world(PANELS.state, 1000, 40);
        beam(ctx, from, world(PANELS.ctx, L.u + 140, L.v + 152 + j * 50), k, C.ink, false, 1, a);
      });
      cx.excluded.forEach((key, j) => {
        const i = FIELDS.findIndex(([f]) => f === key);
        beam(ctx, world(PANELS.state, 440, ROW(i).v - 12), world(PANELS.ctx, L.u + 60 + j * 90, L.v + 330), k, C.ink3, true, 0.5, a);
      });
    }
  }

  // ---------- screen layer ----------
  const CAPTIONS = [
    [0, '合成演示 vg-esc-001：一份合同续签事项。下层记录发生过什么，中层是当前生效的事实，上层是某次模型调用看到的材料。'],
    [5, 'evt-001 登记事项。已生效的事件进入日志，状态据此形成 v1。'],
    [11, 'evt-002 是模型提议：期限改为 24 个月。提议进入日志；在状态中只是待审候选，尚未生效。'],
    [14.5, 'evt-003 人工批准该候选。批准本身也是一条事件，状态随之更新为 v2。'],
    [18.5, 'evt-004 再次提议：付款改为一次性预付。'],
    [21.5, 'evt-005 人工拒绝，理由留档。被拒的提议仍在日志中，从未进入状态。'],
    [27, '上下文 ctx-A 为“起草续签邮件”从状态 v2 选入对方与期限，付款与状态未选入。它是一次投影，不是事实本身。'],
    [35, 'evt-006 人工修正：附件 v3 更正付款为按月。状态更新为 v3。'],
    [39.5, 'ctx-A 仍基于 v2：basis.current = false。过期只说明输入不再适用，既不是批准也不是拒绝；决定入口暂停，需重新编译。'],
    [43, 'evt-003 被重放。事件 ID 已存在，日志不新增，状态不变：重放不凭空产生新事实。'],
    [48, 'ctx-B 为“复核付款条款”基于 v3 选入付款与附件 v3 证据；期限未选入。'],
    [53.3, '未选入不等于已删除：期限 24 个月仍在当前状态中。'],
    [57.3, '事件追加，不改写；状态只随已生效事件变化；上下文按任务选择，可以过期，也可以不选，但不删除事实。'],
  ];
  const CHAPTERS = [
    { t: 0, label: '三层' }, { t: 5, label: '追加与生效' }, { t: 18.5, label: '拒绝被记录' }, { t: 27, label: '上下文投影' },
    { t: 35, label: '修正与过期' }, { t: 43, label: '重放去重' }, { t: 48, label: '未选入≠删除' }, { t: 57.3, label: '回看' },
  ];
  const transcript = (t) => { let s = ''; for (const [t0, x] of CAPTIONS) if (t >= t0) s = x; return s; };

  function screen(ctx, t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    let ch = 0; CHAPTERS.forEach((c, i) => { if (t >= c.t) ch = i; });
    VG.hud(ctx, { chapter: `${String(ch + 1).padStart(2, '0')} · ${CHAPTERS[ch].label}`, caption: transcript(t),
      tag: `SYNTHETIC · ${FX.fixture_id} · 概念演示，非产品录屏`, progress: t / 64 });
    // title card
    const tk = 1 - U.seg(t, 3.8, 4.8);
    if (tk > 0) {
      ctx.globalAlpha = tk;
      ctx.fillStyle = 'rgba(238,243,248,0.82)'; ctx.fillRect(0, 300, 1920, 330);
      text(ctx, '同一件事，三种存在', 960, 440, font(700, 88), C.ink, 'center');
      text(ctx, '事件 · 状态 · 上下文', 960, 530, font(400, 44), C.ink2, 'center');
      ctx.globalAlpha = 1;
    }
    // closing summary
    const ek = U.seg(t, 58.2, 59.2);
    if (ek > 0) {
      ctx.globalAlpha = ek;
      ctx.fillStyle = 'rgba(238,243,248,0.9)'; ctx.fillRect(0, 250, 1920, 440);
      [['事件', '发生过什么 · 追加，不改写'], ['状态', '当前生效的事实 · 只随已生效事件变化'], ['上下文', '一次调用看到的选择 · 可以过期、可以不选，但不删除事实']]
        .forEach(([a, b], i) => {
          const k = U.ease.out(U.seg(t, 58.4 + i * 0.35, 59.2 + i * 0.35));
          ctx.globalAlpha = ek * k;
          text(ctx, a, 420, 360 + i * 120, font(700, 56), C.ink, 'right');
          text(ctx, b, 470, 360 + i * 120, font(400, 44), C.ink2);
        });
      ctx.globalAlpha = 1;
    }
  }

  function backdrop(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, 1920, 1080);
    // floor grid far below the stack, gives the space a ground
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
    for (let i = -8; i <= 8; i++) {
      const a = proj([i * 400, -1500, -800]), b = proj([i * 400, -1500, 3200]);
      if (a.z > 50 && b.z > 50) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    }
    for (let j = 0; j <= 10; j++) {
      const a = proj([-3200, -1500, -800 + j * 400]), b = proj([3200, -1500, -800 + j * 400]);
      if (a.z > 50 && b.z > 50) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    }
  }

  function render(ctx, t) {
    setCam(camera(t));
    backdrop(ctx);
    const order = [['log', logPanel], ['state', statePanel], ['ctx', ctxPanel]]
      .map(([k, fn]) => ({ fn, z: dot(sub(PANELS[k].c, cam.pos), fwd) }))
      .sort((a, b) => b.z - a.z);
    for (const p of order) p.fn(ctx, t);
    beams(ctx, t);
    screen(ctx, t);
  }

  // ---------- self test against fixture.expected ----------
  function selfTest() {
    const E = FX.expected, R = END, checks = [];
    const eq = (name, got, want) => checks.push({ name, got, want, pass: JSON.stringify(got) === JSON.stringify(want) });
    eq('log_length', R.log.length, E.log_length);
    eq('replay_appended', R.replays.length === 0, E.replay_appended);
    eq('final_state_version', R.version, E.final_state_version);
    eq('final_state', R.state, E.final_state);
    eq('rejected_candidate_in_state', Object.values(R.candidates).some((c) => c.status === 'rejected' && Object.entries(c.proposes).every(([k, v]) => R.state[k] === v)), E.rejected_candidate_in_state);
    eq('rejected_event_in_log', R.log.some((e) => e.effect === 'reject'), E.rejected_event_in_log);
    eq('ctx-A_current_at_end', FX.contexts[0].basis_version === R.version, E['ctx-A_current_at_end']);
    eq('ctx-B_current_at_end', FX.contexts[1].basis_version === R.version, E['ctx-B_current_at_end']);
    eq('term_in_state_while_excluded_from_ctx-B', FX.contexts[1].excluded.includes('term') && R.state.term !== undefined, E['term_in_state_while_excluded_from_ctx-B']);
    return { pass: checks.every((c) => c.pass), checks };
  }

  VG.stage({
    kicker: 'VG-01 · synthetic fixture vg-esc-001',
    title: '同一件事，三种存在：事件 · 状态 · 上下文',
    lede: '一份合成的合同续签事项在三块面板之间流动：日志只追加，状态只随已生效事件变化，上下文是某次调用按任务做的选择。拒绝、修正、过期与重放各有一段。语义取自 Praxis Core Model 候选文档，不是产品录屏。',
    duration: 64, fps: 30, chapters: CHAPTERS,
    staticTimes: [3, 9.5, 13, 17, 24, 31, 38, 41.5, 45.5, 51.5, 55, 61.5],
    transcript, render, poster: 31,
    meta: { fixture_id: FX.fixture_id, fixture_revision: FX.revision, selfTest },
    footer: '键盘：空格 播放/暂停 · ←/→ 单帧（Shift 1 秒）· [ ] 段落 · Home/End。<a href="README.md">README 与施工回执</a>',
  });
})();
