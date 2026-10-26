/* Attention in three grammars — one fold of synthetic Attention actions drawn
 * as a typographic ledger, a spatial orbit and a shader light field, over a
 * sound timeline whose onsets were detected from the rendered WAV.
 * Ledger and orbit read the authored fold; the field reads only audio-derived
 * onsets and the loudness envelope, so detector misses stay visible there. */
(function () {
  'use strict';
  const { U, FONT, MONO } = VG;
  const FX = window.VG_FIXTURE, AU = window.VG_AUDIO;
  const DURATION = 56;

  // ---------- semantics: a minimal re-statement of Courtwork attention rules ----------
  function applyAll(actions) {
    const items = {}, receipts = {}, log = [];
    for (const a of actions) {
      const identity = JSON.stringify({ item: a.item, action: a.action, payload: a.payload });
      let outcome = 'applied', code = null;
      const prev = receipts[a.request_id];
      const it = items[a.item];
      if (prev && prev.identity === identity) outcome = 'replayed';
      else if (prev) { outcome = 'rejected'; code = 'IDEMPOTENCY_CONFLICT'; }
      else if ((it ? it.revision : 0) !== a.expected_revision) { outcome = 'rejected'; code = 'VERSION_CONFLICT'; }
      else {
        const s = it ? { ...it } : null;
        const need = (cond, c) => { if (!cond && !code) { outcome = 'rejected'; code = c; } };
        if (a.action === 'create') {
          items[a.item] = { status: 'investigating', seen: false, freshness: 'unknown', revision: 1, next_action: a.payload.next_action, due: null };
        } else if (a.action === 'acknowledge') { s.seen = true; }
        else if (a.action === 'set_waiting' || a.action === 'snooze') {
          need(s.status !== 'resolved', 'INVALID_TRANSITION');
          s.status = a.action === 'snooze' ? 'later' : 'waiting'; s.freshness = 'current';
          s.next_action = a.payload.next_action; s.due = a.payload.due_at || null;
        } else if (a.action === 'resume') { need(s.status !== 'resolved', 'INVALID_TRANSITION'); s.status = a.payload.status; s.next_action = a.payload.next_action; s.due = null; }
        else if (a.action === 'reopen') { need(s.status === 'resolved', 'INVALID_TRANSITION'); s.status = a.payload.status; s.next_action = a.payload.next_action; }
        else if (a.action === 'resolve') { s.status = 'resolved'; s.next_action = '无后续动作'; s.due = null; }
        else if (a.action === 'record_signal') { need(a.actor === 'runtime', 'FORBIDDEN'); s.freshness = 'unknown'; /* status untouched by design */ }
        if (outcome === 'applied') {
          if (a.action !== 'create') { s.revision += 1; items[a.item] = s; }
          receipts[a.request_id] = { identity };
        }
      }
      log.push({ ...a, outcome, code, after: JSON.parse(JSON.stringify(items[a.item])) });
    }
    return { items, log };
  }
  const FULL = applyAll(FX.actions);
  const LOG = FULL.log;
  const stateAt = (t) => {
    const out = {};
    for (const r of LOG) if (r.t <= t) out[r.item] = { ...r.after, since: r.outcome === 'applied' ? r.t : (out[r.item] || {}).since };
    return out;
  };
  // status history per item, for tweens
  const HIST = {};
  for (const it of FX.items) {
    HIST[it.id] = [];
    for (const r of LOG) if (r.item === it.id && r.outcome === 'applied') {
      const h = HIST[it.id], last = h[h.length - 1];
      if (!last || last.status !== r.after.status) h.push({ t: r.t, status: r.after.status });
    }
  }
  const statusAt = (id, t) => { let cur = null, prev = null; for (const h of HIST[id]) if (t >= h.t) { prev = cur; cur = h; } return { cur, prev }; };
  const lastOutcome = (t, id) => { let r = null; for (const x of LOG) if (x.t <= t && (!id || x.item === id)) r = x; return r; };

  // ---------- palette ----------
  const C = { bg: '#f3f6f9', paper: '#ffffff', ink: '#16202c', ink2: '#4a5868', ink3: '#8593a3', line: '#d3dce6', accent: '#1f6feb', night: '#0b121a' };
  const font = (w, s, f = FONT) => `${w} ${s}px ${f}`;
  function text(ctx, s, x, y, f, col, align = 'left') { ctx.font = f; ctx.fillStyle = col; ctx.textAlign = align; ctx.fillText(s, x, y); }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
  const ZH = { investigating: '调查中', needs_you: '需要你', waiting: '等待', later: '稍后', resolved: '已处理' };
  const CODE_ZH = { IDEMPOTENCY_CONFLICT: '同一请求换了内容', VERSION_CONFLICT: 'revision 过期', INVALID_TRANSITION: 'resolved 需先 reopen' };
  const PANES = [{ x: 40, title: '账本', sub: '排印 · 状态即文字' }, { x: 660, title: '轨道', sub: '空间 · 状态即位置' }, { x: 1280, title: '光场', sub: '着色器 · 只听声音（艺术隐喻）' }];
  const PY = 108, PW = 600, PH = 596;

  function paneFrame(ctx, p, dark) {
    rr(ctx, p.x, PY, PW, PH, 10); ctx.fillStyle = dark ? C.night : C.paper; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = dark ? '#1d2a38' : C.line; ctx.stroke();
    text(ctx, p.title, p.x + 24, PY + 44, font(700, 30), dark ? '#e6edf3' : C.ink);
    text(ctx, p.sub, p.x + 24 + ctx.measureText(p.title).width + 14, PY + 42, font(400, 18), dark ? '#8aa0b6' : C.ink3);
  }

  // ---------- grammar 1: ledger ----------
  function ledger(ctx, t) {
    const p = PANES[0]; paneFrame(ctx, p);
    const S = stateAt(t);
    FX.items.forEach((it, i) => {
      const y = PY + 80 + i * 150, s = S[it.id];
      ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x + 24, y + 140); ctx.lineTo(p.x + PW - 24, y + 140); ctx.stroke();
      if (!s) { text(ctx, `${it.id} · 尚未创建`, p.x + 24, y + 40, font(400, 22), C.ink3); return; }
      text(ctx, it.descriptor, p.x + 24, y + 34, font(600, 24), C.ink);
      text(ctx, `${it.id} · r${s.revision}`, p.x + PW - 24, y + 34, font(500, 18, MONO), C.ink2, 'right');
      const { cur, prev } = statusAt(it.id, t);
      const k = U.ease.out(U.seg(t, cur.t, cur.t + 0.5));
      ctx.save(); ctx.beginPath(); ctx.rect(p.x + 20, y + 42, 300, 58); ctx.clip();
      if (prev && k < 1) { ctx.globalAlpha = 1 - k; text(ctx, ZH[prev.status], p.x + 24, y + 88 - k * 50, font(700, 44), C.ink3); }
      ctx.globalAlpha = k; text(ctx, ZH[cur.status], p.x + 24, y + 88 + (1 - k) * 50, font(700, 44), cur.status === 'needs_you' ? C.accent : cur.status === 'resolved' ? C.ink3 : C.ink);
      ctx.restore(); ctx.globalAlpha = 1;
      text(ctx, cur.status, p.x + 330, y + 86, font(400, 18, MONO), C.ink3);
      text(ctx, s.next_action, p.x + 24, y + 126, font(400, 20), C.ink2);
      const flags = `${s.seen ? 'seen' : 'unseen'} · freshness ${s.freshness}${s.due ? ` · due ${s.due}` : ''}`;
      text(ctx, flags, p.x + PW - 24, y + 126, font(400, 16, MONO), s.freshness === 'unknown' ? C.ink : C.ink3, 'right');
    });
    // latest outcome
    const r = lastOutcome(t);
    if (r && t - r.t < 3.2) {
      const k = U.seg(t, r.t, r.t + 0.25) * (1 - U.seg(t, r.t + 2.8, r.t + 3.2));
      ctx.globalAlpha = k;
      const y = PY + PH - 68;
      const bad = r.outcome === 'rejected';
      rr(ctx, p.x + 20, y, PW - 40, 50, 6); ctx.fillStyle = bad ? C.ink : '#eef3f8'; ctx.fill();
      const label = bad ? `${r.request_id} · ${r.action} · ${r.code}` : r.outcome === 'replayed' ? `${r.request_id} · 重放 · 复用回执，无新事件` :
        r.action === 'record_signal' ? `${r.request_id} · 信号 · 只置 freshness，不改状态` : `${r.request_id} · ${r.action} · 已应用`;
      text(ctx, label, p.x + 36, y + 33, font(600, 19, MONO), bad ? '#ffffff' : C.ink);
      ctx.globalAlpha = 1;
    }
  }

  // ---------- grammar 2: orbit ----------
  const RING = { needs_you: 0, investigating: 120, waiting: 185, later: 245, resolved: 330 };
  const ANG = { 'att-A': -2.2, 'att-B': -0.45, 'att-C': 1.35 };
  function orbit(ctx, t) {
    const p = PANES[1]; paneFrame(ctx, p);
    const cx = p.x + PW / 2 - 20, cy = PY + 330;
    // rings
    [['investigating', 120], ['waiting', 185], ['later', 245]].forEach(([k, r]) => {
      ctx.strokeStyle = C.line; ctx.lineWidth = 1.5; ctx.setLineDash(k === 'later' ? [6, 6] : []);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, ZH[k], cx + Math.cos(0.35) * r + 6, cy + Math.sin(0.35) * r + 6, font(500, 16), C.ink3);
    });
    ctx.fillStyle = 'rgba(31,111,235,0.08)'; ctx.beginPath(); ctx.arc(cx, cy, 72, 0, Math.PI * 2); ctx.fill();
    text(ctx, '需要你', cx, cy + 96, font(600, 18), C.accent, 'center');
    const tray = { x: p.x + PW - 110, y: PY + PH - 70 };
    rr(ctx, tray.x - 80, tray.y - 34, 170, 68, 8); ctx.strokeStyle = C.line; ctx.stroke();
    text(ctx, '已处理', tray.x + 5, tray.y + 52, font(500, 16), C.ink3, 'center');
    const S = stateAt(t);
    for (const it of FX.items) {
      const s = S[it.id]; if (!s) continue;
      const { cur, prev } = statusAt(it.id, t);
      const k = U.ease.inOut(U.seg(t, cur.t, cur.t + 0.8));
      const place = (st) => st === 'resolved' ? [tray.x - 40 + FX.items.indexOf(it) * 40, tray.y] :
        st === 'needs_you' ? [cx + Math.cos(ANG[it.id]) * 42, cy + Math.sin(ANG[it.id]) * 42] : [cx + Math.cos(ANG[it.id]) * RING[st], cy + Math.sin(ANG[it.id]) * RING[st]];
      const a = prev ? place(prev.status) : place(cur.status), b = place(cur.status);
      let x = U.lerp(a[0], b[0], k), y = U.lerp(a[1], b[1], k);
      // rejected actions shake the body in place
      const rej = LOG.find((r) => r.item === it.id && r.outcome === 'rejected' && t >= r.t && t < r.t + 0.7);
      if (rej) x += Math.sin((t - rej.t) * 60) * 10 * (1 - (t - rej.t) / 0.7);
      const born = U.ease.outBack(U.seg(t, HIST[it.id][0].t, HIST[it.id][0].t + 0.5));
      const r0 = 15 * born;
      ctx.beginPath(); ctx.arc(x, y, r0, 0, Math.PI * 2);
      if (s.seen) { ctx.fillStyle = cur.status === 'needs_you' ? C.accent : cur.status === 'resolved' ? C.ink3 : C.ink; ctx.fill(); }
      else { ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.stroke(); }
      if (s.freshness === 'unknown') {
        ctx.setLineDash([4, 5]); ctx.lineDashOffset = -t * 12; ctx.lineWidth = 2; ctx.strokeStyle = C.ink2;
        ctx.beginPath(); ctx.arc(x, y, 26, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); ctx.lineDashOffset = 0;
      }
      text(ctx, it.descriptor, x + 24, y - 12, font(600, 18), C.ink);
      text(ctx, `r${s.revision}`, x + 24, y + 10, font(400, 15, MONO), C.ink3);
      // replay echo and outcome tags
      for (const r of LOG) {
        if (r.item !== it.id || t < r.t || t > r.t + 2.4) continue;
        const e = U.seg(t, r.t, r.t + 2.4);
        if (r.outcome === 'replayed') { ctx.strokeStyle = `rgba(74,88,104,${1 - e})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 18 + e * 50, 0, Math.PI * 2); ctx.stroke(); }
        if (r.outcome === 'rejected' || r.outcome === 'replayed' || r.action === 'record_signal') {
          ctx.globalAlpha = 1 - U.seg(e, 0.75, 1);
          const tag = r.outcome === 'rejected' ? r.code : r.outcome === 'replayed' ? '重放 · 无新事件' : '信号 · 不授权';
          ctx.font = font(600, 15, MONO); const w = ctx.measureText(tag).width + 16;
          rr(ctx, x - w / 2, y + 26, w, 26, 4); ctx.fillStyle = r.outcome === 'rejected' ? C.ink : '#e3e9f0'; ctx.fill();
          text(ctx, tag, x, y + 44, font(600, 15, MONO), r.outcome === 'rejected' ? '#fff' : C.ink, 'center');
          ctx.globalAlpha = 1;
        }
        // signal tries to pull toward resolved and snaps back
        if (r.action === 'record_signal') {
          const pull = Math.sin(U.seg(t, r.t, r.t + 1.2) * Math.PI);
          ctx.setLineDash([6, 6]); ctx.strokeStyle = C.ink2; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(U.lerp(x, tray.x, pull * 0.45), U.lerp(y, tray.y, pull * 0.45)); ctx.stroke(); ctx.setLineDash([]);
        }
      }
    }
  }

  // ---------- grammar 3: shader field driven by audio-derived data only ----------
  let gl = null, glCanvas = null, prog = null, uni = {};
  function setupGL() {
    glCanvas = document.createElement('canvas'); glCanvas.width = PW; glCanvas.height = PH;
    gl = glCanvas.getContext('webgl', { preserveDrawingBuffer: true, antialias: false });
    if (!gl) return;
    const vs = 'attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }';
    const fs = `precision highp float;
      uniform vec2 res; uniform float time; uniform vec2 pos[3]; uniform float inten[3]; uniform float need[3];
      uniform vec4 onset; uniform float env;
      float hash(vec2 q){ return fract(sin(dot(q, vec2(12.9898,78.233))) * 43758.5453); }
      void main(){
        vec2 uv = gl_FragCoord.xy / res; uv.y = 1. - uv.y;
        vec2 a = vec2(res.x/res.y, 1.);
        vec3 col = vec3(0.035, 0.055, 0.085);
        for (int i = 0; i < 3; i++) {
          vec2 d = (uv - pos[i]) * a;
          float r2 = dot(d, d);
          float g = inten[i] * 0.0065 / (r2 + 0.0016);
          vec3 tint = mix(vec3(0.72, 0.82, 0.95), vec3(0.35, 0.62, 1.0), need[i]);
          col += tint * g;
        }
        vec2 c = (uv - vec2(0.5)) * a;
        for (int k = 0; k < 4; k++) {
          float age = onset[k];
          if (age >= 0. && age < 2.5) {
            float r = age * 0.42;
            float ring = exp(-pow((length(c) - r) * 38., 2.)) * exp(-age * 1.6);
            col += vec3(0.55, 0.72, 1.0) * ring * 0.55;
          }
        }
        col *= 0.9 + env * 0.25;
        col += (hash(floor(gl_FragCoord.xy) + floor(time * 30.)) - 0.5) * 0.025;
        gl_FragColor = vec4(1. - exp(-col * 1.6), 1.);
      }`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const n of ['res', 'time', 'pos', 'inten', 'need', 'onset', 'env']) uni[n] = gl.getUniformLocation(prog, n);
  }
  const INT = { needs_you: 1.0, investigating: 0.55, waiting: 0.32, later: 0.14, resolved: 0.0 };
  const envAt = (t) => AU.envelope[Math.min(AU.envelope.length - 1, Math.max(0, Math.round(t * AU.envelope_hz)))] || 0;
  function field(ctx, t) {
    const p = PANES[2]; paneFrame(ctx, p, true);
    if (!gl) { text(ctx, 'WebGL 不可用：光场未渲染', p.x + 24, PY + 120, font(500, 20), '#e6edf3'); return; }
    // The field is told only where items sit and how bright their status is;
    // its motion comes from audio-derived onsets and envelope, never from authored times.
    const inten = [], need = [], pos = [];
    for (const it of FX.items) {
      const { cur, prev } = statusAt(it.id, t);
      const born = cur ? U.seg(t, HIST[it.id][0].t, HIST[it.id][0].t + 0.6) : 0;
      let v = cur ? U.lerp(prev ? INT[prev.status] : 0, INT[cur.status], U.ease.inOut(U.seg(t, cur.t, cur.t + 1.0))) * born : 0;
      if (cur && cur.status === 'waiting') v *= 0.75 + 0.25 * Math.sin(t * 2.2);
      inten.push(v); need.push(cur && cur.status === 'needs_you' ? 1 : 0); pos.push(...it.pos);
    }
    const ages = AU.onsets.filter((o) => o <= t).slice(-4).map((o) => t - o);
    while (ages.length < 4) ages.unshift(-1);
    gl.viewport(0, 0, PW, PH);
    gl.uniform2f(uni.res, PW, PH); gl.uniform1f(uni.time, t);
    gl.uniform2fv(uni.pos, pos); gl.uniform1fv(uni.inten, inten); gl.uniform1fv(uni.need, need);
    gl.uniform4f(uni.onset, ages[0], ages[1], ages[2], ages[3]); gl.uniform1f(uni.env, envAt(t));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    ctx.save(); rr(ctx, p.x, PY, PW, PH, 10); ctx.clip(); ctx.drawImage(glCanvas, p.x, PY); ctx.restore();
    paneFrameLabels(ctx, p);
    FX.items.forEach((it, i) => {
      if (!statusAt(it.id, t).cur) return;
      text(ctx, it.descriptor, p.x + it.pos[0] * PW, PY + it.pos[1] * PH + 46, font(500, 17), 'rgba(230,237,243,0.75)', 'center');
    });
    text(ctx, '亮度 ≈ 需要注意的程度（隐喻，非度量）', p.x + 24, PY + PH - 46, font(400, 16), '#8aa0b6');
    text(ctx, '波纹 = 声音里检出的起点：只知道何时，不知道是谁', p.x + 24, PY + PH - 20, font(400, 16), '#8aa0b6');
  }
  function paneFrameLabels(ctx, p) {
    text(ctx, p.title, p.x + 24, PY + 44, font(700, 30), '#e6edf3');
    ctx.font = font(700, 30);
    text(ctx, p.sub, p.x + 24 + ctx.measureText(p.title).width + 14, PY + 42, font(400, 18), '#8aa0b6');
  }

  // ---------- sound timeline ----------
  const TL = { x0: 250, x1: 1860, y: 716 };
  const tx = (s) => TL.x0 + (s / DURATION) * (TL.x1 - TL.x0);
  function timeline(ctx, t) {
    const y = TL.y;
    text(ctx, '作者事件', 60, y + 36, font(600, 18), C.ink2);
    text(ctx, 'authored', 60, y + 56, font(400, 14, MONO), C.ink3);
    text(ctx, '声音包络', 60, y + 104, font(600, 18), C.ink2);
    text(ctx, '检出起点', 60, y + 170, font(600, 18), C.ink2);
    text(ctx, 'audio-derived', 60, y + 190, font(400, 14, MONO), C.ink3);
    // envelope
    ctx.fillStyle = '#c9d4df';
    const mid = y + 98;
    for (let i = 0; i < AU.envelope.length; i += 1) {
      const s = i / AU.envelope_hz, h = AU.envelope[i] * 34;
      if (h > 0.4) ctx.fillRect(tx(s), mid - h, Math.max(1, (TL.x1 - TL.x0) / (DURATION * AU.envelope_hz)), h * 2);
    }
    // authored ticks
    FX.actions.forEach((a, i) => {
      const x = tx(a.t), m = AU.matches[i];
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
      ctx.setLineDash(a.sound === 'silent' ? [3, 3] : []);
      ctx.beginPath(); ctx.moveTo(x, y + 22); ctx.lineTo(x, y + 46); ctx.stroke(); ctx.setLineDash([]);
      if (m.status === 'matched') {
        ctx.strokeStyle = '#b3c1cf'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y + 46); ctx.lineTo(tx(m.onset), y + 150); ctx.stroke();
      } else {
        const show = t >= a.t;
        ctx.globalAlpha = show ? 1 : 0.35;
        ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y + 158, 8, 0, Math.PI * 2); ctx.stroke();
        text(ctx, m.why === 'authored silent' ? '漏检：静默信号' : '漏检：60ms 内第二声', x, y + 196, font(600, 14), C.ink, 'center');
        ctx.globalAlpha = 1;
      }
    });
    // detected onsets
    for (const o of AU.onsets) {
      const x = tx(o), sp = AU.spurious.includes(o);
      ctx.fillStyle = sp ? C.ink3 : C.ink;
      ctx.beginPath(); ctx.moveTo(x, y + 150); ctx.lineTo(x - 6, y + 164); ctx.lineTo(x + 6, y + 164); ctx.closePath(); ctx.fill();
    }
    if (AU.spurious.length) text(ctx, `误检 ${AU.spurious.length}：创建音的第二个音符`, tx(AU.spurious[0]) - 4, y + 196, font(500, 14), C.ink3);
    // playhead
    ctx.fillStyle = C.accent; ctx.fillRect(tx(t) - 1, y + 10, 2, 170);
    text(ctx, `${t.toFixed(2)}s`, tx(t) + 6, y + 18, font(500, 14, MONO), C.accent);
  }

  // ---------- captions ----------
  const CAPTIONS = [
    [0, `合成演示 ${FX.fixture_id}：同一组 Attention 动作，同时用三种语法呈现，分别是排印账本、空间轨道和着色器光场。底部是声音时间线。`],
    [4, '三条线索被创建，进入 investigating。'],
    [12, 'att-A 被确认看过：acknowledge 只改 seen，不改状态。'],
    [15, 'att-A 转入 waiting，记下“10-02 前等回函”。next_action 是记录的后续描述，不是定时器，也不是核心义务。'],
    [18, 'att-B 暂缓为 later。'],
    [21, '同一 request_id 以相同内容重放：复用原回执，不产生新事件，revision 不变。'],
    [24, '同一 request_id 换了内容：IDEMPOTENCY_CONFLICT，拒收。'],
    [27, '运行时信号试图把 att-A 标为已处理：record_signal 只能把 freshness 设为 unknown，不能改状态。这个动作没有声音，声音分析也检不出它。'],
    [30, 'att-C 被处理为 resolved。'],
    [33, '对已处理的事项暂缓：INVALID_TRANSITION，resolved 需要先 reopen。'],
    [36, 'att-C 重新打开，转为 needs_you：需要你判断。'],
    [39, 'att-A 以过期 revision 恢复：VERSION_CONFLICT；60 毫秒后按最新 revision 重试成功。两声靠得太近，检测只找到一个起点。'],
    [43, 'att-A 处理完毕。'],
    [46, 'att-B 恢复调查。之后再无事件：动画结束时 att-B 仍在调查，att-C 仍需要你。未完成就是未完成。'],
    [50.5, `声音时间线：${AU.matches.filter((m) => m.status === 'matched').length} 个作者事件被检出，${AU.matches.filter((m) => m.status === 'missed').length} 个漏检，${AU.spurious.length} 个误检。光场只听声音，所以它也漏掉了那条信号。`],
  ];
  const CHAPTERS = [
    { t: 0, label: '三种语法' }, { t: 4, label: '出现' }, { t: 12, label: '确认与等待' }, { t: 18, label: '重放与冲突' },
    { t: 27, label: '信号不授权' }, { t: 30, label: '无效转移' }, { t: 36, label: '重开与版本冲突' }, { t: 46, label: '结束不是完成' },
  ];
  const transcript = (t) => U.at(CAPTIONS, t);

  function render(ctx, t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, 1920, 1080);
    ledger(ctx, t); orbit(ctx, t); field(ctx, t); timeline(ctx, t);
    const tk = 1 - U.seg(t, 3.0, 3.8);
    if (tk > 0) {
      ctx.globalAlpha = tk; ctx.fillStyle = 'rgba(243,246,249,0.92)'; ctx.fillRect(0, 260, 1920, 300);
      text(ctx, '注意力的三种语法', 960, 400, font(700, 88), C.ink, 'center');
      text(ctx, '同一份 Attention 事件：排印 · 空间 · 光与声', 960, 478, font(400, 38), C.ink2, 'center');
      ctx.globalAlpha = 1;
    }
    let ch = 0; CHAPTERS.forEach((c, i) => { if (t >= c.t) ch = i; });
    VG.hud(ctx, { chapter: `${String(ch + 1).padStart(2, '0')} · ${CHAPTERS[ch].label}`, caption: transcript(t),
      tag: `SYNTHETIC · ${FX.fixture_id} · 规则最小重写，非 Courtwork 录屏`, progress: t / DURATION });
  }

  function selfTest() {
    const E = FX.expected, checks = [];
    const eq = (name, got, want) => checks.push({ name, got, want, pass: JSON.stringify(got) === JSON.stringify(want) });
    FX.actions.forEach((a, i) => eq(`${a.request_id}@${a.t}`, LOG[i].outcome === 'rejected' ? LOG[i].code : LOG[i].outcome, a.expect));
    const fin = Object.fromEntries(Object.entries(FULL.items).map(([k, v]) => [k, v.status]));
    eq('final', fin, E.final);
    eq('revisions', Object.fromEntries(Object.entries(FULL.items).map(([k, v]) => [k, v.revision])), E.revisions);
    const sig = LOG.find((r) => r.action === 'record_signal'), before = LOG[LOG.indexOf(sig) - 1];
    eq('att-A_freshness_after_signal', sig.after.freshness, E['att-A_freshness_after_signal']);
    eq('signal_changed_status', sig.after.status !== stateAt(sig.t - 0.001)['att-A'].status, E.signal_changed_status);
    eq('open_items_at_end', Object.values(fin).filter((s) => s !== 'resolved').length, E.open_items_at_end);
    eq('audio_detect_missed', AU.matches.filter((m) => m.status === 'missed').map((m) => m.request_id), E.audio_detect_expect_missed);
    return { pass: checks.every((c) => c.pass), checks };
  }

  VG.stage({
    kicker: 'VG-02 · VG-05 · VG-06 · synthetic fixture vg-attention-001',
    title: '注意力的三种语法：排印 · 空间 · 光与声',
    lede: '三条合成线索经历创建、确认、等待、暂缓、重放、冲突、信号、处理与重开。左两栏读取作者事件折叠出的状态；右栏光场只读取从音轨中检出的起点和响度，所以声音分析的漏检与误检也会出现在画面里。规则名取自 Courtwork Attention 核心，本页为最小重写，不是产品录屏。',
    duration: DURATION, fps: 30, chapters: CHAPTERS, audio: 'attention.wav',
    staticTimes: [2, 10, 13.5, 16.5, 21.8, 24.8, 28, 33.8, 37.5, 39.8, 44, 52],
    transcript, render, poster: 39.8,
    setup: () => { setupGL(); },
    meta: { fixture_id: FX.fixture_id, fixture_revision: FX.revision, selfTest },
    footer: '声音默认关闭，按“声音”开启；导出视频无音轨，音轨为同目录 attention.wav。键盘：空格 播放/暂停 · ←/→ 单帧 · [ ] 段落。<a href="README.md">README 与施工回执</a>',
  });
})();
