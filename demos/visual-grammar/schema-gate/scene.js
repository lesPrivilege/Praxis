/* Schema gate — candidates are typeset, compressed into capsules and driven
 * through the contract's gates. validate() decides every outcome; the timeline
 * only schedules when each decision is shown. Rejections bounce with a seeded,
 * fixed-step simulation that is precomputed once and indexed by t. */
(function () {
  'use strict';
  const { U, FONT, MONO } = VG;
  const FX = window.VG_FIXTURE;
  const SERIF = '"Songti SC", "STSong", "Noto Serif CJK SC", serif';

  // ---------- semantics ----------
  function validate(c, state) {
    const b = c.body, gates = [];
    const v = b.proposes.term_months;
    if (!(Number.isInteger(v) && v >= 1 && v <= 60) || typeof b.matter_id !== 'string') {
      gates.push({ id: 'shape', pass: false, code: 'TYPE_MISMATCH', shown: JSON.stringify(v), want: 'integer 1–60' });
      return { result: 'rejected', gate: 'shape', reason_code: 'TYPE_MISMATCH', gates };
    }
    gates.push({ id: 'shape', pass: true, shown: String(v), want: 'integer 1–60' });
    const ev = b.evidence || [];
    if (!ev.length || !ev.every((e) => e.source && e.source_version && e.location)) {
      gates.push({ id: 'evidence', pass: false, code: 'EVIDENCE_REQUIRED', shown: `${ev.length} 条`, want: '≥ 1 条' });
      return { result: 'rejected', gate: 'evidence', reason_code: 'EVIDENCE_REQUIRED', gates };
    }
    gates.push({ id: 'evidence', pass: true, shown: ev.map((e) => `${e.source} ${e.source_version} ${e.location}`).join('；'), want: '≥ 1 条' });
    if (b.expected_state_version !== state.state_version) {
      gates.push({ id: 'version', pass: false, code: 'STATE_VERSION_CONFLICT', shown: `期望 v${b.expected_state_version} · 当前 v${state.state_version}`, want: `v${state.state_version}` });
      return { result: 'rejected', gate: 'version', reason_code: 'STATE_VERSION_CONFLICT', gates };
    }
    gates.push({ id: 'version', pass: true, shown: `v${b.expected_state_version}`, want: `v${state.state_version}` });
    if (!c.decision) { gates.push({ id: 'authority', pass: null, shown: '等待', want: 'reviewer' }); return { result: 'awaiting_decision', gate: 'authority', reason_code: null, gates }; }
    const ok = c.decision.decision === 'approve';
    gates.push({ id: 'authority', pass: ok, shown: `${c.decision.actor} · ${c.decision.decision}`, want: 'reviewer' });
    return ok ? { result: 'committed', gate: null, reason_code: null, gates } : { result: 'rejected', gate: 'authority', reason_code: 'HUMAN_REJECTED', gates };
  }

  // run the fixture: candidates in order against the evolving state
  const RUN = (() => {
    let state = JSON.parse(JSON.stringify(FX.state));
    const states = [{ t: -1, state }], events = [], retained = [];
    const results = FX.candidates.map((c) => {
      const r = validate(c, state);
      if (r.result === 'committed') {
        const next = JSON.parse(JSON.stringify(state));
        next.fields = { ...next.fields, ...c.body.proposes };
        next.state_version += 1;
        const event_id = `evt-${String(parseInt(state.last_event.split('-')[1], 10) + 1).padStart(3, '0')}`;
        next.last_event = event_id;
        events.push({ event_id, candidate_id: c.candidate_id, before: state.fields, after: next.fields, decision: c.decision });
        r.event_id = event_id; r.state_version_after = next.state_version;
        state = next;
      } else if (r.result === 'rejected') retained.push(c.candidate_id);
      return r;
    });
    return { results, finalState: state, events, retained, initial: FX.state };
  })();

  // ---------- schedule ----------
  const GATE_IDS = FX.contract.gates.map((g) => g.id);
  const GX = [740, 970, 1200, 1430];
  const CAP = { w: 150, h: 64, y: 540, x0: 560 };
  const TRAVEL = 0.9, CHECK = 1.4, READ = 3.5, MORPH = 0.8;
  const PLAN = FX.candidates.map((c, i) => {
    const r = RUN.results[i];
    const stops = [];
    let t = c.t + READ + MORPH, x = CAP.x0;
    const last = r.gate ? GATE_IDS.indexOf(r.gate) : GATE_IDS.length - 1;
    for (let g = 0; g <= last; g++) {
      const gx = GX[g] - 110;
      stops.push({ g, from: x, to: gx, t0: t, t1: t + TRAVEL, check: t + TRAVEL, done: t + TRAVEL + CHECK });
      x = gx; t += TRAVEL + CHECK;
    }
    const p = { c, r, stops, hit: null, decisionAt: null, commitAt: null };
    if (r.result === 'rejected') p.hit = stops[stops.length - 1].done;
    if (r.result === 'committed') {
      const arrive = stops[stops.length - 1].check;
      p.decisionAt = Math.max(c.decision.t, arrive + 0.6); // a decision can never be shown before the candidate arrives
      p.passAt = p.decisionAt + 0.8;
      p.commitAt = p.passAt + 1.1;
    }
    return p;
  });
  const COMMIT = PLAN.find((p) => p.commitAt);
  const PROJ_T = COMMIT ? COMMIT.commitAt + 1.6 : 1e9;
  const DURATION = Math.ceil(PROJ_T + 16);

  // ---------- rejection physics: fixed step, seeded ----------
  const DT = 1 / 240, FLOOR = 812 - CAP.h / 2;
  const TRAY = (k) => ({ x: 150 + k * 250, y: 858 });
  PLAN.filter((p) => p.hit).forEach((p, k) => {
    const rnd = U.rng(0x5c4e3a + k * 7919);
    let x = p.stops[p.stops.length - 1].to, y = CAP.y, vx = -560 - rnd() * 120, vy = -520 - rnd() * 160, a = 0, w = -3 - rnd() * 3;
    const path = [];
    for (let i = 0; i < 3 / DT; i++) {
      vy += 2200 * DT; x += vx * DT; y += vy * DT; a += w * DT;
      if (y > FLOOR) { y = FLOOR; vy = Math.abs(vy) < 90 ? 0 : -vy * 0.45; vx *= 0.72; w *= 0.55; }
      if (y === FLOOR) { vx *= 0.992; w *= 0.97; }
      if (x < 110) { x = 110; vx = -vx * 0.5; }
      path.push([x, y, a]);
    }
    p.path = path; p.trayIndex = k; p.settle = p.hit + 2.6;
  });

  // ---------- palette ----------
  const C = { bg: '#f3f6f9', ink: '#16202c', ink2: '#4a5868', ink3: '#8593a3', line: '#d3dce6', accent: '#1f6feb', paper: '#ffffff' };
  const font = (w, s, f = FONT) => `${w} ${s}px ${f}`;
  function text(ctx, s, x, y, f, col, align = 'left') { ctx.font = f; ctx.fillStyle = col; ctx.textAlign = align; ctx.fillText(s, x, y); }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

  // ---------- candidate document → capsule ----------
  function docLines(c) {
    const b = c.body;
    return [
      ['{', ''], [`  "candidate_id": "${c.candidate_id}",`, ''], [`  "matter_id": "${b.matter_id}",`, ''],
      [`  "expected_state_version": ${b.expected_state_version},`, 'version'],
      [`  "proposes": { "term_months": ${JSON.stringify(b.proposes.term_months)} },`, 'shape'],
      [`  "evidence": ${b.evidence.length ? `[{ "${b.evidence[0].source}", "${b.evidence[0].source_version}", "${b.evidence[0].location}" }]` : '[]'}`, 'evidence'],
      ['}', ''],
    ];
  }
  function capsulePos(p, t) {
    if (p.path && t >= p.hit) {
      if (t < p.settle) { const s = p.path[Math.min(p.path.length - 1, Math.floor((t - p.hit) / DT))]; return { x: s[0], y: s[1], a: s[2] }; }
      const s = p.path[Math.min(p.path.length - 1, Math.floor((p.settle - p.hit) / DT))];
      const k = U.ease.inOut(U.seg(t, p.settle, p.settle + 0.7)), T = TRAY(p.trayIndex);
      return { x: U.lerp(s[0], T.x, k), y: U.lerp(s[1], T.y, k), a: U.lerp(s[2] % (Math.PI * 2), 0, k), tray: k };
    }
    let x = CAP.x0;
    for (const s of p.stops) if (t >= s.t0) x = U.lerp(s.from, s.to, U.ease.inOut(U.seg(t, s.t0, s.t1)));
    if (p.passAt && t >= p.passAt) x = U.lerp(p.stops[p.stops.length - 1].to, 1720, U.ease.inOut(U.seg(t, p.passAt, p.commitAt)));
    return { x, y: CAP.y, a: 0 };
  }
  function drawDoc(ctx, p, t) {
    const c = p.c, t0 = c.t, morph = U.seg(t, t0 + READ, t0 + READ + MORPH);
    if (t < t0 || morph >= 1) return;
    const lines = docLines(c);
    const box = { x: 60, y: 170, w: 620, h: lines.length * 46 + 70 };
    const k = U.ease.inOut(morph);
    const bx = U.lerp(box.x, CAP.x0 - CAP.w / 2, k), by = U.lerp(box.y, CAP.y - CAP.h / 2, k);
    const bw = U.lerp(box.w, CAP.w, k), bh = U.lerp(box.h, CAP.h, k);
    ctx.globalAlpha = U.seg(t, t0, t0 + 0.3);
    rr(ctx, bx, by, bw, bh, U.lerp(8, 32, k)); ctx.fillStyle = C.paper; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.ink2; ctx.stroke();
    ctx.globalAlpha = 1 - U.seg(morph, 0, 0.5);
    text(ctx, `${c.actor} · ${c.candidate_id}`, 80, 158, font(600, 24), C.ink2);
    ctx.save(); ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.clip();
    lines.forEach(([ln], i) => {
      const shown = U.seg(t, t0 + 0.25 + i * 0.3, t0 + 0.55 + i * 0.3);
      const chars = Math.floor(ln.length * shown);
      text(ctx, ln.slice(0, chars), 84, 222 + i * 46, font(500, 20, MONO), C.ink);
    });
    ctx.restore(); ctx.globalAlpha = 1;
  }
  function drawCapsule(ctx, p, t) {
    if (t < p.c.t + READ + MORPH * 0.6) return;
    if (p.commitAt && t > p.commitAt + 0.4) return;
    const pos = capsulePos(p, t);
    const rejected = p.hit && t >= p.hit;
    ctx.save(); ctx.translate(pos.x, pos.y); ctx.rotate(pos.a);
    ctx.globalAlpha = U.seg(t, p.c.t + READ + MORPH * 0.6, p.c.t + READ + MORPH) * (p.commitAt ? 1 - U.seg(t, p.commitAt, p.commitAt + 0.4) : 1);
    rr(ctx, -CAP.w / 2, -CAP.h / 2, CAP.w, CAP.h, 32);
    ctx.fillStyle = rejected ? '#e9eef3' : C.paper; ctx.fill();
    ctx.setLineDash(rejected ? [7, 6] : []); ctx.lineWidth = 2.5; ctx.strokeStyle = rejected ? C.ink2 : C.ink; ctx.stroke(); ctx.setLineDash([]);
    text(ctx, p.c.candidate_id, 0, -2, font(600, 22, MONO), C.ink, 'center');
    text(ctx, `term ${JSON.stringify(p.c.body.proposes.term_months)}`, 0, 22, font(400, 16, MONO), C.ink2, 'center');
    ctx.restore(); ctx.globalAlpha = 1;
    if (rejected && pos.tray > 0.6) {
      ctx.globalAlpha = U.seg(pos.tray, 0.6, 1);
      text(ctx, p.r.reason_code, pos.x, pos.y + 56, font(600, 16, MONO), C.ink2, 'center');
      ctx.globalAlpha = 1;
    }
  }

  // ---------- gates ----------
  function gateState(g, t) {
    // most recent candidate interacting with gate g
    let st = null;
    for (const p of PLAN) {
      const s = p.stops.find((x) => x.g === g);
      if (!s || t < s.check) continue;
      const gr = p.r.gates.find((x) => x.id === GATE_IDS[g]);
      const end = p.hit ? p.hit + 4.2 : (p.commitAt || s.done) + 1.2;
      if (t > end && !(p === COMMIT && g === 3 && t < p.passAt + 1)) continue;
      st = { p, s, gr };
    }
    return st;
  }
  function drawGates(ctx, t, fade) {
    ctx.globalAlpha = fade;
    FX.contract.gates.forEach((g, i) => {
      const x = GX[i], st = gateState(i, t);
      text(ctx, `${'①②③④'[i]} ${g.label}`, x, 178, font(700, 34), C.ink, 'center');
      ctx.font = font(400, 18, MONO);
      U.wrap(ctx, g.rule, 214).forEach((ln, j) => text(ctx, ln, x, 210 + j * 23, font(400, 18, MONO), C.ink2, 'center'));
      // wall with a slot at capsule height
      let open = 0, blocked = 0, human = 0;
      if (st) {
        const k = U.seg(t, st.s.check, st.s.check + 0.4);
        if (st.gr.pass === true && i < 3) open = U.seg(t, st.s.done - 0.3, st.s.done);
        if (st.gr.pass === false) blocked = k;
        if (i === 3 && st.p.decisionAt) { human = U.seg(t, st.p.decisionAt, st.p.decisionAt + 0.3); open = U.seg(t, st.p.passAt - 0.2, st.p.passAt); }
      }
      const gap = 44 + open * 40;
      ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.strokeStyle = blocked ? C.ink : human ? C.accent : '#9fb0c2';
      ctx.beginPath(); ctx.moveTo(x, 270); ctx.lineTo(x, CAP.y - gap); ctx.moveTo(x, CAP.y + gap); ctx.lineTo(x, 800); ctx.stroke();
      if (blocked) {
        ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, CAP.y - gap); ctx.lineTo(x, CAP.y + gap); ctx.stroke();
      }
      if (!st) return;
      // check card under the capsule lane
      const ck = U.ease.outBack(U.seg(t, st.s.check, st.s.check + 0.45));
      ctx.save(); ctx.translate(x, 640); ctx.scale(ck, ck);
      const fail = st.gr.pass === false, wait = i === 3 && t < (st.p.decisionAt || 1e9);
      rr(ctx, -112, -34, 224, 126, 8);
      ctx.fillStyle = fail ? C.ink : C.paper; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = i === 3 && !wait ? C.accent : C.ink; ctx.stroke();
      const fg = fail ? '#ffffff' : C.ink;
      const head = fail ? '✕ 拒收' : wait ? '… 等待人工' : i === 3 ? '✓ 已批准' : '✓ 通过';
      text(ctx, head, 0, 2, font(700, 26), fail ? '#ffffff' : i === 3 && !wait ? C.accent : C.ink, 'center');
      ctx.font = font(500, 17, MONO);
      const val = wait ? '需要 reviewer' : st.gr.shown;
      U.wrap(ctx, val, 200).slice(0, 2).forEach((ln, j) => text(ctx, ln, 0, 34 + j * 22, font(500, 17, MONO), fg, 'center'));
      if (fail) text(ctx, st.gr.code, 0, 82, font(700, 16, MONO), '#ffffff', 'center');
      ctx.restore();
    });
    ctx.globalAlpha = 1;
  }

  // ---------- state + events ----------
  function stateAt(t) {
    return COMMIT && t >= COMMIT.commitAt ? RUN.finalState : RUN.initial;
  }
  function drawState(ctx, t, fade) {
    const S = stateAt(t), X = 1560, Y = 150, W = 330;
    ctx.globalAlpha = fade;
    rr(ctx, X, Y, W, 420, 10); ctx.fillStyle = C.paper; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.ink; ctx.stroke();
    text(ctx, '当前语义状态', X + 24, Y + 48, font(600, 26), C.ink);
    text(ctx, S.matter_id, X + 24, Y + 84, font(500, 20, MONO), C.ink2);
    const flash = COMMIT ? Math.max(0, 1 - Math.abs(t - COMMIT.commitAt - 0.4) / 0.8) : 0;
    text(ctx, `v${S.state_version}`, X + W - 24, Y + 84, font(700, 44, MONO), flash > 0.05 ? C.accent : C.ink, 'right');
    const rows = [['counterparty', S.fields.counterparty], ['term_months', String(S.fields.term_months)], ['payment', S.fields.payment], ['last_event', S.last_event]];
    rows.forEach(([k, v], i) => {
      text(ctx, k, X + 24, Y + 150 + i * 62, font(400, 18, MONO), C.ink3);
      text(ctx, v, X + 24, Y + 178 + i * 62, font(600, 24, i === 1 ? MONO : FONT), C.ink);
    });
    // "unchanged" ping after each rejection
    for (const p of PLAN) {
      if (!p.hit) continue;
      const k = U.seg(t, p.hit + 0.2, p.hit + 0.5) * (1 - U.seg(t, p.hit + 3.2, p.hit + 3.8));
      if (k <= 0) continue;
      ctx.globalAlpha = fade * k;
      rr(ctx, X, Y + 432, W, 50, 6); ctx.fillStyle = C.ink; ctx.fill();
      text(ctx, `状态未变 · v${RUN.initial.state_version} · 无提交事件`, X + W / 2, Y + 465, font(600, 20), '#ffffff', 'center');
    }
    ctx.globalAlpha = fade;
    // committed events
    text(ctx, '提交事件', X + 4, 690, font(600, 22), C.ink2);
    const evs = RUN.events.filter(() => COMMIT && t >= COMMIT.commitAt);
    if (!evs.length) text(ctx, '（无）', X + 4, 728, font(400, 20), C.ink3);
    evs.forEach((e) => {
      const k = U.seg(t, COMMIT.commitAt, COMMIT.commitAt + 0.5);
      ctx.globalAlpha = fade * k;
      text(ctx, `${e.event_id} · term_months`, X + 4, 730, font(600, 20, MONO), C.ink);
      text(ctx, `${e.before.term_months} → ${e.after.term_months} · ${e.decision.actor}`, X + 4, 760, font(500, 20, MONO), C.accent);
    });
    ctx.globalAlpha = 1;
  }
  function drawTray(ctx, t, fade) {
    ctx.globalAlpha = fade;
    ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(60, 812); ctx.lineTo(1500, 812); ctx.stroke();
    text(ctx, '保留区 · 候选不删除，待修正或重载后重验', 60, 800, font(500, 18), C.ink3);
    ctx.globalAlpha = 1;
  }

  // ---------- three projections of the committed state ----------
  function drawProjections(ctx, t) {
    const k0 = U.seg(t, PROJ_T, PROJ_T + 1);
    if (k0 <= 0) return;
    const S = RUN.finalState, E = RUN.events[0], P = FX.projections;
    const cols = [
      { x: 60, title: '模型上下文', sub: 'Model Context · 为一次任务编译', f: FONT },
      { x: 680, title: '审阅包', sub: 'Reviewer Packet · 为一次决定组织', f: SERIF },
      { x: 1300, title: '检索索引', sub: 'Retrieval Index · 为定位服务', f: MONO },
    ];
    cols.forEach((c, i) => {
      const k = U.ease.out(U.seg(t, PROJ_T + i * 0.35, PROJ_T + 0.9 + i * 0.35));
      ctx.globalAlpha = k; const y0 = 150 + (1 - k) * 60;
      rr(ctx, c.x, y0, 560, 660, 10); ctx.fillStyle = C.paper; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.ink2; ctx.stroke();
      text(ctx, c.title, c.x + 28, y0 + 52, font(700, 32, c.f === MONO ? FONT : c.f), C.ink);
      text(ctx, c.sub, c.x + 28, y0 + 84, font(400, 18), C.ink3);
      // identity chip on a shared rail
      rr(ctx, c.x + 380, y0 + 26, 152, 40, 20); ctx.fillStyle = C.ink; ctx.fill();
      text(ctx, `${S.matter_id}@v${S.state_version}`, c.x + 456, y0 + 53, font(600, 18, MONO), '#ffffff', 'center');
      const L = (s, j, f, col = C.ink, x = 28) => text(ctx, s, c.x + x, y0 + 150 + j * 52, f, col);
      if (i === 0) {
        L(`task  ${P.model_context.task}`, 0, font(500, 24, MONO), C.ink2);
        L(`counterparty  ${S.fields.counterparty}`, 1, font(600, 26, MONO));
        L(`term_months   ${S.fields.term_months}`, 2, font(600, 26, MONO));
        L(`evidence_ref  ${E ? 'src-email-0925 v1 §2' : ''}`, 3, font(500, 24, MONO));
        L('正文不入上下文，按需经工具读取', 4, font(400, 22), C.ink3);
        L('未选入  payment、审阅意见', 5, font(400, 22), C.ink3);
        const bw = 500 * P.model_context.budget.used / P.model_context.budget.limit;
        ctx.fillStyle = C.line; ctx.fillRect(c.x + 28, y0 + 500, 500, 10); ctx.fillStyle = C.ink2; ctx.fillRect(c.x + 28, y0 + 500, bw, 10);
        L(`${P.model_context.budget.used.toLocaleString()} / ${P.model_context.budget.limit.toLocaleString()} 字符`, 7.6, font(400, 20, MONO), C.ink2);
        L('basis.current = true', 9, font(700, 24, MONO));
      } else if (i === 1) {
        L(`变更  期限 ${E.before.term_months} → ${E.after.term_months} 个月`, 0, font(600, 28, SERIF));
        L('证据  src-email-0925 v1 §2 · 支持', 1, font(400, 26, SERIF));
        L('自动检查  结构 · 证据 · 版本 通过', 2, font(400, 26, SERIF));
        L(`不确定  ${P.reviewer_packet.uncertainty}`, 3, font(400, 26, SERIF));
        L(`后果  ${P.reviewer_packet.consequence}`, 4, font(400, 26, SERIF));
        L(`权限  ${E.decision.actor} · ${E.decision.decision}`, 5, font(600, 26, SERIF), C.accent);
        L(`提交  ${E.event_id}`, 6, font(400, 26, SERIF), C.ink2);
        L('引用可解析只说明位置存在；', 8, font(400, 22, SERIF), C.ink3);
        L('支持与否由审阅者判断', 8.6, font(400, 22, SERIF), C.ink3);
      } else {
        L(`${S.matter_id} term_months=24 @v4`, 0, font(600, 23, MONO));
        L('current', 0.55, font(400, 20, MONO), C.ink2);
        const sk = U.seg(t, PROJ_T + 5.5, PROJ_T + 6.2);
        L(`${S.matter_id} term_months=12 @v3`, 1.6, font(500, 23, MONO), C.ink3);
        ctx.globalAlpha = k * sk;
        ctx.strokeStyle = C.ink2; ctx.setLineDash([8, 6]); rr(ctx, c.x + 18, y0 + 150 + 1.6 * 52 - 32, 520, 84, 6); ctx.stroke(); ctx.setLineDash([]);
        L('旧版本命中 · 已取代 · 不提升为当前事实', 2.15, font(600, 20), C.ink);
        ctx.globalAlpha = k;
        L('src-email-0925 v1 → M-0417', 3.4, font(500, 23, MONO), C.ink);
        L(`${RUN.retained.join(' ')}`, 4.5, font(500, 21, MONO), C.ink3);
        L('retained · 不作为事实检索', 5.05, font(400, 20, MONO), C.ink3);
      }
      ctx.globalAlpha = 1;
    });
    // identity rail
    const rk = U.seg(t, PROJ_T + 1.8, PROJ_T + 2.6);
    if (rk > 0) {
      // rail above the panels, dropping a tick to each identity chip
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.setLineDash([]);
      const xs = [516, 1136, 1756], x1 = U.lerp(xs[0], xs[2], rk);
      ctx.beginPath(); ctx.moveTo(xs[0], 124); ctx.lineTo(x1, 124);
      xs.forEach((x) => { if (x <= x1 + 1) { ctx.moveTo(x, 124); ctx.lineTo(x, 176); } });
      ctx.stroke();
      ctx.globalAlpha = rk;
      text(ctx, '身份与版本一致 · 披露范围不同 · 视图重建不回写状态', 960, 850, font(600, 26), C.ink, 'center');
      ctx.globalAlpha = 1;
    }
  }

  // ---------- captions ----------
  const P = PLAN;
  const CAPTIONS = [
    [0, `合成演示 ${FX.fixture_id}：四份候选依次经过同一份工作合同 ${FX.contract.contract_id} v${FX.contract.contract_version} 的四道检查。当前状态 ${FX.state.matter_id} · v${FX.state.state_version}。`],
    [P[0].c.t, `${P[0].c.candidate_id} 提议把期限改为“三年”。先读原文，再把它压缩成一个候选送去检查。`],
    [P[0].hit - 1.2, '结构检查：term_months 应为 1–60 的整数，收到字符串“三年”。TYPE_MISMATCH；候选被弹回保留区，状态不变。'],
    [P[1].c.t, `${P[1].c.candidate_id} 提议 36 个月，结构合法，但没有附证据。`],
    [P[1].hit - 1.2, '证据检查：evidence 为空。EVIDENCE_REQUIRED：形式正确不等于有依据。'],
    [P[2].c.t, `${P[2].c.candidate_id} 提议 24 个月并附证据，但它是基于状态 v2 起草的。`],
    [P[2].hit - 1.2, '版本检查：期望 v2，当前 v3。STATE_VERSION_CONFLICT：候选保留，待重载当前状态后重验；没有提交事件，状态不变。'],
    [P[3].c.t, `${P[3].c.candidate_id} 同样提议 24 个月，基于当前 v3，附 src-email-0925 v1 §2。`],
    [P[3].stops[3].check, '三道自动检查通过。验证通过不等于批准：提交还需要 reviewer 的人工决定。'],
    [P[3].decisionAt, `${P[3].c.decision.actor} 批准。提交事件 ${RUN.events[0].event_id} 写入，状态更新为 v${RUN.finalState.state_version}。`],
    [PROJ_T, '同一状态 v4 生成三种投影：模型上下文、审阅包、检索索引。披露范围不同，对象身份与版本一致。'],
    [PROJ_T + 5.5, '检索索引中的 v3 旧值仍可命中，但标为已取代，不提升为当前事实；视图重建不回写状态。'],
  ];
  const CHAPTERS = [
    { t: 0, label: '合同与闸门' }, { t: P[0].c.t, label: '类型不符' }, { t: P[1].c.t, label: '缺少证据' },
    { t: P[2].c.t, label: '版本过期' }, { t: P[3].c.t, label: '人工决定' }, { t: PROJ_T, label: '三种投影' },
  ];
  const transcript = (t) => U.at(CAPTIONS, t);

  function render(ctx, t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, 1920, 1080);
    const fade = 1 - U.seg(t, PROJ_T - 0.6, PROJ_T + 0.2);
    if (fade > 0) {
      drawTray(ctx, t, fade);
      drawGates(ctx, t, fade);
      drawState(ctx, t, fade);
      ctx.globalAlpha = fade;
      for (const p of PLAN) { drawDoc(ctx, p, t); drawCapsule(ctx, p, t); }
      ctx.globalAlpha = 1;
      text(ctx, `Work Contract ${FX.contract.contract_id} v${FX.contract.contract_version}`, 340, 72, font(500, 20, MONO), C.ink3);
    }
    drawProjections(ctx, t);
    // title
    const tk = 1 - U.seg(t, 4.2, 5.2);
    if (tk > 0) {
      ctx.globalAlpha = tk; ctx.fillStyle = 'rgba(243,246,249,0.9)'; ctx.fillRect(0, 300, 1920, 300);
      text(ctx, 'Schema 闸门', 960, 440, font(700, 92), C.ink, 'center');
      text(ctx, '意义成为可检查、可定位的对象', 960, 520, font(400, 42), C.ink2, 'center');
      ctx.globalAlpha = 1;
    }
    let ch = 0; CHAPTERS.forEach((c, i) => { if (t >= c.t) ch = i; });
    VG.hud(ctx, { chapter: `${String(ch + 1).padStart(2, '0')} · ${CHAPTERS[ch].label}`, caption: transcript(t),
      tag: `SYNTHETIC · ${FX.fixture_id} · 论文语义的概念演示，非 runtime`, progress: t / DURATION });
  }

  function selfTest() {
    const E = FX.expected, checks = [];
    const eq = (name, got, want) => checks.push({ name, got, want, pass: JSON.stringify(got) === JSON.stringify(want) });
    FX.candidates.forEach((c, i) => {
      const r = RUN.results[i];
      eq(`${c.candidate_id}.result`, r.result, c.expected.result);
      eq(`${c.candidate_id}.gate`, r.gate, c.expected.gate);
      eq(`${c.candidate_id}.reason_code`, r.reason_code, c.expected.reason_code);
    });
    eq('final_state_version', RUN.finalState.state_version, E.final_state_version);
    eq('final_term_months', RUN.finalState.fields.term_months, E.final_term_months);
    eq('committed_events', RUN.events.map((e) => e.event_id), E.committed_events);
    eq('retained_candidates', RUN.retained, E.retained_candidates);
    eq('state_unchanged_after_rejections', stateAt(COMMIT.commitAt - 0.01).state_version === FX.state.state_version, E.state_unchanged_after_rejections);
    eq('projection_identity', `${RUN.finalState.matter_id}@v${RUN.finalState.state_version}`, E.projection_identity);
    eq('stale_hit_promoted', false, E.stale_hit_promoted);
    eq('decision_not_before_arrival', COMMIT.decisionAt >= COMMIT.stops[3].check, true);
    return { pass: checks.every((c) => c.pass), checks };
  }

  const staticTimes = [3, P[0].c.t + 2.5, P[0].hit - 0.3, P[0].hit + 3.6, P[1].hit - 0.3, P[2].c.t + 2.8, P[2].hit - 0.3,
    P[3].stops[3].check + 0.5, P[3].decisionAt + 0.6, COMMIT.commitAt + 0.8, PROJ_T + 3, PROJ_T + 8].map((x) => Math.round(x * 10) / 10);
  VG.stage({
    kicker: 'VG-03 · synthetic fixture vg-schema-gate-001',
    title: 'Schema 闸门：意义成为可检查的对象',
    lede: '四份合成候选依次经过同一份工作合同的四道检查：结构、证据、版本、权限。三份在可定位的位置被拒收并保留，一份在人工批准后提交，再从同一状态生成三种投影。结果由页面内的校验函数算出；语义取自 Schema Engineering 论文，不是 runtime 录屏。',
    duration: DURATION, fps: 30, chapters: CHAPTERS, staticTimes, transcript, render, poster: staticTimes[6],
    meta: { fixture_id: FX.fixture_id, fixture_revision: FX.revision, selfTest },
    footer: '键盘：空格 播放/暂停 · ←/→ 单帧（Shift 1 秒）· [ ] 段落 · Home/End。<a href="README.md">README 与施工回执</a>',
  });
})();
