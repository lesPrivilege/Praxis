/* Form lab 01 — seven ways of drawing, cut to one beat grid.
 * One WebGL2 context, four programs (instanced particles, SDF raymarch, Droste
 * spiral, slit-scan), a thin 2D layer on top. Every uniform is a function of t
 * and of score.js, so any frame can be drawn in any order. Words are placeholders. */
(function () {
  'use strict';
  const { U, FONT, MONO } = VG;
  const S = window.VG_SCORE;
  const W = 1920, H = 1080, N = 160000, BEAT = 60 / S.bpm;

  // ---------- score-derived timing ----------
  const KICKS = [];
  for (let i = 0; i * BEAT < S.duration; i++) {
    const b = i * BEAT;
    const half = S.kick.half_time.some(([a, z]) => b >= a && b < z);
    if (b >= S.kick.from && b < S.kick.to && (!half || i % 4 === 0)) KICKS.push(b);
  }
  const lastBefore = (list, t) => { let v = null; for (const x of list) { if (x <= t) v = x; else break; } return v; };
  const impulse = (t, rate = 9) => { const k = lastBefore(KICKS, t); return k === null || t - k > 1 ? 0 : Math.exp(-(t - k) * rate); };
  const flash = (t) => { const k = lastBefore(S.impacts, t); return k === null ? 0 : Math.exp(-(t - k) * 11); };
  const sectionAt = (t) => S.sections.find((s) => t >= s.t0 && t < s.t1) || S.sections[S.sections.length - 1];
  function morphAt(t) {
    let cur = 'point';
    for (const m of S.morphs) {
      if (t >= m.t1) cur = m.to;
      else if (t >= m.t0) return { from: cur, to: m.to, k: (t - m.t0) / (m.t1 - m.t0) };
      else break;
    }
    return { from: cur, to: cur, k: 1 };
  }

  // ---------- tiny mat4 (column-major) ----------
  const M = {
    persp(fovy, asp, n, f) { const q = 1 / Math.tan(fovy / 2); return [q / asp, 0, 0, 0, 0, q, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, (2 * f * n) / (n - f), 0]; },
    look(e, c, up = [0, 1, 0]) {
      const nz = norm(sub(e, c)), nx = norm(cross(up, nz)), ny = cross(nz, nx);
      return [nx[0], ny[0], nz[0], 0, nx[1], ny[1], nz[1], 0, nx[2], ny[2], nz[2], 0, -dot(nx, e), -dot(ny, e), -dot(nz, e), 1];
    },
    mul(a, b) { const o = new Array(16).fill(0); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]; return o; },
  };
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }

  // ---------- GL ----------
  let gl, glc;
  const P = {}, BUF = {}, SHAPES = {}, TEX = {};
  function program(vs, fs) {
    const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) + '\n' + src.slice(0, 200)); return s; };
    const p = gl.createProgram();
    gl.attachShader(p, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'aSeed'); gl.bindAttribLocation(p, 1, 'aFrom'); gl.bindAttribLocation(p, 2, 'aTo'); gl.bindAttribLocation(p, 3, 'aEnd');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const a = gl.getActiveUniform(p, i); u[a.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(p, a.name); }
    return { p, u };
  }
  const FULL_VS = `#version 300 es
    void main() { vec2 v = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2); gl_Position = vec4(v * 2.0 - 1.0, 0.0, 1.0); }`;

  const PARTICLE_VS = `#version 300 es
    layout(location=0) in vec4 aSeed; layout(location=1) in vec4 aFrom; layout(location=2) in vec4 aTo; layout(location=3) in float aEnd;
    uniform mat4 uVP; uniform float uK, uT, uImpulse, uSize, uFlow, uSwirl, uLag;
    out float vTag; out float vA;
    vec3 flow(vec3 p, float t) {
      for (int i = 0; i < 3; i++)
        p += 0.2 * vec3(sin(p.y * 2.1 + t * 0.9 + aSeed.x * 6.0), sin(p.z * 1.9 + p.x * 1.3 + t * 0.7), sin(p.x * 1.7 + t * 1.1 + aSeed.y * 6.0) * 0.4);
      return p;
    }
    void main() {
      float k = clamp((uK - aSeed.x * 0.4) / 0.6, 0.0, 1.0); k = k * k * (3.0 - 2.0 * k);
      vec3 p = mix(aFrom.xyz, aTo.xyz, k);
      vec3 sw = vec3(sin(aSeed.y * 31.0 + uT * 1.7), sin(aSeed.z * 27.0 + uT * 1.3), sin(aSeed.w * 23.0 + uT * 1.1));
      p += sw * sin(3.14159 * k) * uSwirl;  // no idle shimmer: per-frame jitter is noise to the encoder
      p += normalize(p + vec3(1e-4)) * uImpulse * (0.04 + 0.1 * aSeed.w);
      float t = uT - aEnd * uLag;
      p = mix(p, flow(p, t), uFlow);
      gl_Position = uVP * vec4(p, 1.0);
      gl_PointSize = uSize * (0.5 + aSeed.w) / gl_Position.w;
      vTag = mix(aFrom.w, aTo.w, k);
      vA = 1.0 - aEnd;
    }`;
  const PARTICLE_FS = `#version 300 es
    precision highp float;
    in float vTag; in float vA; uniform float uLines, uGain; out vec4 o;
    void main() {
      float a = 1.0;
      if (uLines < 0.5) a = smoothstep(0.5, 0.05, length(gl_PointCoord - 0.5));
      vec3 c = mix(vec3(0.72, 0.82, 1.0), vec3(0.2, 0.5, 1.0), vTag);
      o = vec4(c * a * uGain * mix(0.15, 1.0, vA), 1.0);
    }`;

  const SDF_FS = `#version 300 es
    precision highp float;
    uniform vec2 uRes; uniform float uT, uPulse, uAccentOn; uniform vec3 uRo, uTa; uniform vec2 uAccent; out vec4 o;
    const float SP = 1.3;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float heightOf(vec2 c) { if (c.x > -1.5 && c.x < 0.5) return 0.0; return 0.5 + 3.6 * pow(hash(c), 2.2); }
    float sdBox(vec3 p, vec3 b) { vec3 q = abs(p) - b; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0); }
    float map(vec3 p) {
      vec2 c = floor(p.xz / SP), l = (fract(p.xz / SP) - 0.5) * SP;
      float h = heightOf(c);
      float d = h > 0.0 ? sdBox(vec3(l.x, p.y - h * 0.5, l.y), vec3(0.36, h * 0.5, 0.36)) : 1e3;
      return min(d, p.y);
    }
    vec3 nrm(vec3 p) { vec2 e = vec2(0.002, 0.0); return normalize(vec3(map(p + e.xyy) - map(p - e.xyy), map(p + e.yxy) - map(p - e.yxy), map(p + e.yyx) - map(p - e.yyx))); }
    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
      vec3 f = normalize(uTa - uRo), r = normalize(cross(vec3(0, 1, 0), f)), u = cross(f, r);
      vec3 rd = normalize(f * 1.6 + uv.x * r + uv.y * u);
      vec3 bg = mix(vec3(0.02, 0.028, 0.045), vec3(0.05, 0.085, 0.14), clamp(rd.y * 2.0 + 0.3, 0.0, 1.0));
      float t = 0.0; bool hit = false;
      for (int i = 0; i < 128; i++) {
        vec3 p = uRo + rd * t; float d = map(p);
        if (d < 0.0015) { hit = true; break; }
        // never step past the current cell's wall: map() only sees this cell's column
        vec2 cb = (floor(p.xz / SP) + step(0.0, rd.xz)) * SP;
        vec2 tb = (cb - p.xz) / (rd.xz + vec2(rd.x >= 0.0 ? 1e-6 : -1e-6, rd.z >= 0.0 ? 1e-6 : -1e-6));
        t += min(d, max(min(tb.x, tb.y), 0.0) + 0.003);
        if (t > 60.0) break;
      }
      vec3 col = bg;
      if (hit) {
        vec3 p = uRo + rd * t, n = nrm(p);
        vec3 L = normalize(vec3(-0.5, 0.8, -0.3));
        float dif = max(dot(n, L), 0.0), amb = 0.5 + 0.5 * n.y;
        float ao = 0.0; for (int k = 1; k <= 4; k++) { float h = 0.08 * float(k); ao += (h - map(p + n * h)) / h; }
        ao = clamp(1.0 - ao * 0.25, 0.0, 1.0);
        vec2 c = floor(p.xz / SP);
        if (p.y < 0.002) {
          vec2 g = abs(fract(p.xz / SP) - 0.5);
          float grid = smoothstep(0.49, 0.5, max(g.x, g.y));
          col = vec3(0.03, 0.04, 0.06) * amb * ao + vec3(0.18, 0.3, 0.5) * grid * 0.35;
        } else {
          col = vec3(0.62, 0.68, 0.76) * (0.18 * amb + 0.75 * dif) * ao;
          float band = pow(0.5 + 0.5 * sin(p.y * 3.0 - uT * 4.0 + hash(c) * 6.28), 14.0) * exp(-t * 0.09);
          col += vec3(0.75, 0.85, 1.0) * band * (0.2 + 1.1 * uPulse);
          if (all(equal(c, uAccent))) col = mix(col, vec3(0.18, 0.5, 1.0) * (1.4 + 1.2 * uPulse), uAccentOn);
        }
        col = mix(bg, col, exp(-0.05 * t));
      }
      o = vec4(pow(col, vec3(0.9)), 1.0);
    }`;

  const DROSTE_FS = `#version 300 es
    precision highp float;
    uniform vec2 uRes; uniform float uZoom, uTwist, uPulse; uniform sampler2D uAtlas; out vec4 o;
    const float R = 2.4;
    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y; uv.y = -uv.y;
      float r = max(length(uv), 1e-5);
      float lr = log(2.0 * r) / log(R);
      float L = floor(uZoom - lr);
      if (L < 0.0) { o = vec4(0.012, 0.018, 0.028, 1.0); return; }
      float S = 0.5 * pow(R, uZoom - L);
      float ang = uTwist * (uZoom - lr);
      vec2 q = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * uv / (2.0 * S) + 0.5;
      float idx = mod(L, 6.0);
      vec2 cell = vec2(mod(idx, 3.0), floor(idx / 3.0));
      float lod = log2(max(1.0, 1024.0 / (2.0 * S * uRes.y)));
      vec3 c = textureLod(uAtlas, (cell + clamp(q, 0.002, 0.998)) / vec2(3.0, 2.0), lod).rgb;
      float depth = clamp(1.0 - (uZoom - L - 1.0) * 0.18, 0.35, 1.0);
      o = vec4(c * depth * (0.85 + 0.35 * uPulse), 1.0);
    }`;

  const SLIT_FS = `#version 300 es
    precision highp float;
    uniform vec2 uRes; uniform float uT, uSplit, uGlitch, uBeat; uniform sampler2D uText; out vec4 o;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    void main() {
      vec2 uv = gl_FragCoord.xy / uRes; uv.y = 1.0 - uv.y;
      float band = floor(uv.y * 28.0);
      float gx = (hash(vec2(band, uBeat)) - 0.5) * uGlitch * step(0.72, hash(vec2(band * 1.3, uBeat + 7.0)));
      float tt = uT - uv.x * 0.9;
      float y = uv.y + 0.1 * sin(uv.x * 7.0 + tt * 2.4) + 0.02 * sin(uv.x * 31.0 - tt * 6.0);
      float x = fract(uv.x * 0.42 + tt * 0.07) + gx;
      float rr = texture(uText, vec2(x + uSplit, y)).r;
      float gg = texture(uText, vec2(x, y)).r;
      float bb = texture(uText, vec2(x - uSplit, y)).r;
      vec3 col = vec3(0.93, 0.96, 1.0) * gg + vec3(0.12, 0.42, 1.0) * max(bb - gg, 0.0) + vec3(0.9, 0.35, 0.45) * max(rr - gg, 0.0) * 0.35;
      col *= 0.86 + 0.14 * sin(gl_FragCoord.y * 3.14159);
      o = vec4(col + vec3(0.01, 0.015, 0.025), 1.0);
    }`;

  // ---------- shapes (deterministic) ----------
  function textShape(str, seed, boxW = 3.9) {
    const c = document.createElement('canvas'); c.width = 2048; c.height = 768;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.fillStyle = '#000'; x.fillRect(0, 0, 2048, 768);
    x.font = `900 ${str.length > 2 ? 560 : 620}px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff';
    x.fillText(str, 1024, 400);
    const d = x.getImageData(0, 0, 2048, 768).data, pts = [];
    for (let py = 0; py < 768; py += 2) for (let px = 0; px < 2048; px += 2) if (d[(py * 2048 + px) * 4] > 128) pts.push(px, py);
    const rnd = U.rng(seed), out = new Float32Array(N * 4), s = boxW / 2048;
    for (let i = 0; i < N; i++) {
      const j = Math.floor(rnd() * (pts.length / 2)) * 2;
      out[i * 4] = (pts[j] - 1024 + rnd() * 2) * s;
      out[i * 4 + 1] = -(pts[j + 1] - 384 + rnd() * 2) * s;
      out[i * 4 + 2] = (rnd() - 0.5) * 0.08;
      out[i * 4 + 3] = 0;
    }
    return out;
  }
  function buildShapes() {
    let rnd = U.rng(11);
    const point = new Float32Array(N * 4), cloud = new Float32Array(N * 4), field = new Float32Array(N * 4), helix = new Float32Array(N * 4);
    const gauss = () => { const u = rnd() || 1e-9, v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
    for (let i = 0; i < N; i++) {
      point[i * 4] = (rnd() - 0.5) * 0.004; point[i * 4 + 1] = (rnd() - 0.5) * 0.004; point[i * 4 + 2] = 0;
      cloud[i * 4] = gauss() * 0.9; cloud[i * 4 + 1] = gauss() * 0.55; cloud[i * 4 + 2] = gauss() * 0.7;
      field[i * 4] = (rnd() - 0.5) * 5.4; field[i * 4 + 1] = gauss() * 0.32; field[i * 4 + 2] = (rnd() - 0.5) * 0.6;
    }
    rnd = U.rng(23);
    const REC = 48, accents = new Set(S.helix_accents);
    for (let i = 0; i < N; i++) {
      const spine = rnd() < 0.15;
      const k = spine ? rnd() * (REC - 1) : Math.floor(rnd() * REC);
      const a = k * 0.52, cx = 1.35 * Math.cos(a), cy = (k - REC / 2) * 0.055, cz = 1.35 * Math.sin(a);
      if (spine) { helix[i * 4] = cx; helix[i * 4 + 1] = cy; helix[i * 4 + 2] = cz; helix[i * 4 + 3] = 0; continue; }
      const bx = (rnd() - 0.5) * 0.2, by = (rnd() - 0.5) * 0.07, bz = (rnd() - 0.5) * 0.1;
      helix[i * 4] = cx + bx * Math.cos(a) - bz * Math.sin(a); helix[i * 4 + 1] = cy + by; helix[i * 4 + 2] = cz + bx * Math.sin(a) + bz * Math.cos(a);
      helix[i * 4 + 3] = accents.has(k) ? 1 : 0;
    }
    Object.assign(SHAPES, { point, cloud, field, helix });
    S.words.slice(0, 3).forEach((w, i) => { SHAPES[`word:${i}`] = textShape(w, 101 + i); });
    SHAPES.flow_word = textShape(S.flow_word, 211);
  }

  // ---------- textures ----------
  function uploadCanvas(c, mips) {
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mips ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, mips ? gl.CLAMP_TO_EDGE : gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (mips) gl.generateMipmap(gl.TEXTURE_2D);
    return t;
  }
  function drosteAtlas() {
    const T = 1024, c = document.createElement('canvas'); c.width = T * 3; c.height = T * 2;
    const x = c.getContext('2d');
    x.fillStyle = '#05080c'; x.fillRect(0, 0, c.width, c.height);
    S.words.forEach((word, i) => {
      const ox = (i % 3) * T + T / 2, oy = Math.floor(i / 3) * T + T / 2;
      x.save(); x.translate(ox, oy);
      x.strokeStyle = 'rgba(200,215,235,0.55)'; x.lineWidth = 3;
      x.beginPath(); x.arc(0, 0, 505, 0, Math.PI * 2); x.stroke();
      x.beginPath(); x.arc(0, 0, 220, 0, Math.PI * 2); x.stroke();
      for (let k = 0; k < 120; k++) {
        const a = (k / 120) * Math.PI * 2, r0 = k % 10 === 0 ? 455 : 478;
        x.beginPath(); x.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); x.lineTo(Math.cos(a) * 496, Math.sin(a) * 496); x.lineWidth = k % 10 === 0 ? 3 : 1.5; x.stroke();
      }
      // the word, set around the ring three times
      const accent = word === '决定';
      x.fillStyle = accent ? '#4c8dff' : '#eef3f8'; x.font = `900 118px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle';
      const chars = [...word], per = (Math.PI * 2) / 3;
      for (let rep = 0; rep < 3; rep++) chars.forEach((ch, j) => {
        const a = rep * per + (j - (chars.length - 1) / 2) * 0.33 - Math.PI / 2;
        x.save(); x.rotate(a + Math.PI / 2); x.fillText(ch, 0, -345); x.restore();
      });
      x.fillStyle = 'rgba(200,215,235,0.7)'; x.font = `500 26px ${MONO}`;
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2 + 0.5;
        x.save(); x.rotate(a); x.fillText(`L${i} · ${['evt-0417', 'v3', 'basis', 'ctx-A', 'M-0417', 'r6'][k]}`, 0, -250); x.restore();
      }
      x.restore();
    });
    return c;
  }
  function slitText() {
    const c = document.createElement('canvas'); c.width = 8192; c.height = 1024;
    const x = c.getContext('2d');
    x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = '#fff'; x.font = `900 600px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(`${S.slit_phrase} ·`, 4096, 540);
    return c;
  }

  function setup() {
    glc = document.createElement('canvas'); glc.width = W; glc.height = H;
    gl = glc.getContext('webgl2', { alpha: false, antialias: true, preserveDrawingBuffer: true });
    if (!gl) throw new Error('WebGL2 unavailable');
    P.part = program(PARTICLE_VS, PARTICLE_FS);
    P.sdf = program(FULL_VS, SDF_FS);
    P.droste = program(FULL_VS, DROSTE_FS);
    P.slit = program(FULL_VS, SLIT_FS);
    buildShapes();
    const seed = new Float32Array(N * 4), rnd = U.rng(7);
    for (let i = 0; i < N * 4; i++) seed[i] = rnd();
    const mk = (data) => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); return b; };
    BUF.seed = mk(seed); BUF.end = mk(new Float32Array([0, 1]));
    for (const k of Object.keys(SHAPES)) BUF[k] = mk(SHAPES[k]);
    BUF.vao = gl.createVertexArray();
    TEX.droste = uploadCanvas(drosteAtlas(), true);
    TEX.slit = uploadCanvas(slitText(), false);
  }

  // ---------- passes ----------
  function bindShape(loc, name) {
    gl.bindBuffer(gl.ARRAY_BUFFER, BUF[name]); gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0); gl.vertexAttribDivisor(loc, 1);
  }
  function particleCamera(t) {
    const asp = W / H, proj = M.persp(0.78, asp, 0.05, 50);
    let eye = [Math.sin(t * 0.3) * 0.08, Math.sin(t * 0.23) * 0.05, 3.3], at = [0, 0, 0];
    if (t >= 15.2 && t < 24) {
      const k = U.ease.inOut(U.seg(t, 15.2, 17.6)), a = (t - 15.2) * 0.42;
      const rad = U.lerp(3.3, 4.4, k);
      eye = [Math.sin(a) * rad, U.lerp(0, 0.9 + 0.35 * Math.sin(t * 0.6), k), Math.cos(a) * rad];
    }
    if (t >= 52 && t < 60) eye = [Math.sin(t * 0.4) * 0.12, 0, U.lerp(3.4, 2.9, U.seg(t, 52, 60))];
    return M.mul(proj, M.look(eye, at));
  }
  function drawParticles(t, lines) {
    const m = morphAt(t), u = P.part.u;
    gl.useProgram(P.part.p); gl.bindVertexArray(BUF.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, BUF.seed); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0); gl.vertexAttribDivisor(0, 1);
    bindShape(1, m.from); bindShape(2, m.to);
    gl.bindBuffer(gl.ARRAY_BUFFER, BUF.end); gl.enableVertexAttribArray(3); gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 0, 0); gl.vertexAttribDivisor(3, 0);
    gl.uniformMatrix4fv(u.uVP, false, new Float32Array(particleCamera(t)));
    gl.uniform1f(u.uK, m.k); gl.uniform1f(u.uT, t);
    gl.uniform1f(u.uImpulse, t < 60 ? impulse(t) : 0);
    const inFlow = t >= 52 && t < 60;
    const flowAmt = inFlow ? U.lerp(1, 0.04, U.ease.inOut(U.seg(t, 55.6, 58.4))) : 0;
    gl.uniform1f(u.uFlow, flowAmt);
    gl.uniform1f(u.uSwirl, m.to === 'helix' || m.from === 'helix' ? 0.6 : 0.35);
    gl.uniform1f(u.uLag, 0.55);
    gl.uniform1f(u.uLines, lines ? 1 : 0);
    const collapse = U.seg(t, 60, 62.4);
    gl.uniform1f(u.uSize, lines ? 1 : U.lerp(9, 13, collapse));
    gl.uniform1f(u.uGain, (lines ? 0.26 : 0.55) * (t < 4 ? U.lerp(0.15, 1, U.seg(t, 0.5, 3.5)) : 1) * (1 - U.seg(t, 62.4, 62.9)));
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
    // a quarter of the particles as streaks: distinct strands instead of a fabric the encoder smears
    gl.drawArraysInstanced(lines ? gl.LINES : gl.POINTS, 0, lines ? 2 : 1, lines ? N / 4 : N);
    gl.disable(gl.BLEND); gl.bindVertexArray(null);
  }
  function fullscreen(prog, set) {
    gl.useProgram(prog.p); set(prog.u);
    gl.uniform2f(prog.u.uRes, W, H);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  const SP = 1.3, ACCENT = [1, Math.floor(((36 - 24) * 2.2 + 5.5) / SP)];
  function drawSdf(t) {
    const lt = t - 24, z = lt * 2.2;
    const rise = U.ease.inOut(U.seg(t, 31, 35.6));
    const ro = [0.25 * Math.sin(t * 0.4), 1.1 + 0.15 * Math.sin(t * 0.7) + rise * 3.2, z - 2];
    const ahead = [ro[0] * 0.5, 0.9, z + 4];
    const acc = [(ACCENT[0] + 0.5) * SP, 2.0, (ACCENT[1] + 0.5) * SP];
    const k = U.ease.inOut(U.seg(t, 29.5, 34));
    const ta = [U.lerp(ahead[0], acc[0], k), U.lerp(ahead[1], acc[1], k), U.lerp(ahead[2], acc[2], k)];
    fullscreen(P.sdf, (u) => {
      gl.uniform1f(u.uT, t); gl.uniform1f(u.uPulse, impulse(t, 7));
      gl.uniform3f(u.uRo, ...ro); gl.uniform3f(u.uTa, ...ta);
      gl.uniform2f(u.uAccent, ACCENT[0], ACCENT[1]); gl.uniform1f(u.uAccentOn, U.seg(t, 29.5, 30.5));
    });
  }
  function drawDroste(t) {
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, TEX.droste);
    fullscreen(P.droste, (u) => {
      gl.uniform1i(u.uAtlas, 0);
      gl.uniform1f(u.uZoom, 0.35 + (t - 36) * 0.7 + 0.25 * U.ease.out(U.seg(t, 36, 37)));
      gl.uniform1f(u.uTwist, 0.55); gl.uniform1f(u.uPulse, impulse(t, 5));
    });
  }
  function drawSlit(t) {
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, TEX.slit);
    const k = lastBefore(KICKS, t);
    fullscreen(P.slit, (u) => {
      gl.uniform1i(u.uText, 0); gl.uniform1f(u.uT, t);
      gl.uniform1f(u.uSplit, 0.0012 + 0.006 * impulse(t, 6));
      gl.uniform1f(u.uGlitch, 0.12 * impulse(t, 10));
      gl.uniform1f(u.uBeat, k === null ? 0 : Math.round(k / BEAT));
    });
  }

  // ---------- 2D layer ----------
  const white = (a) => `rgba(236,242,250,${a})`;
  function overlay(ctx, t) {
    const sec = sectionAt(t), idx = S.sections.indexOf(sec);
    // void: a hairline that the point sits on
    if (t < 4.2) {
      const k = U.ease.inOut(U.seg(t, 0.4, 3.6));
      ctx.fillStyle = white(0.35 * (1 - U.seg(t, 3.8, 4.2)));
      ctx.fillRect(960 - 900 * k, 539.5, 1800 * k, 1);
    }
    // vignette
    const g = ctx.createRadialGradient(960, 540, 300, 960, 540, 1150);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // impact flash
    const f = flash(t);
    if (f > 0.01) { ctx.fillStyle = white(0.65 * f); ctx.fillRect(0, 0, W, H); }
    // labels
    ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
    if (t >= 4.2 && t < 62.4) {
      ctx.font = `600 26px ${FONT}`; ctx.fillStyle = white(0.85);
      ctx.fillText(`${String(idx + 1).padStart(2, '0')} / ${String(S.sections.length).padStart(2, '0')}  ${sec.label}`, 56, 76);
      ctx.font = `500 16px ${MONO}`; ctx.fillStyle = white(0.5); ctx.fillText(sec.technique, 56, 104);
    }
    ctx.font = `500 16px ${MONO}`; ctx.fillStyle = white(0.42); ctx.textAlign = 'right';
    ctx.fillText('FORM LAB 01 · 占位数据 · synthetic', W - 56, 76);
    const beat = Math.floor(t / BEAT), bar = Math.floor(beat / 4) + 1;
    ctx.textAlign = 'left';
    ctx.fillText(`${U.fmt(t)}   ♩${S.bpm}   bar ${String(bar).padStart(2, '0')}.${(beat % 4) + 1}`, 56, H - 48);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = white(i === beat % 4 && t >= 4 && t < 60 ? 0.9 : 0.18);
      ctx.fillRect(W - 56 - (4 - i) * 22, H - 60, 14, 14);
    }
    // title and end cards
    const tk = U.seg(t, 0.8, 1.6) * (1 - U.seg(t, 3.3, 3.9));
    if (tk > 0) {
      ctx.textAlign = 'center'; ctx.fillStyle = white(tk);
      ctx.font = `800 76px ${FONT}`; ctx.fillText('形式实验 01', 960, 470);
      ctx.font = `400 28px ${FONT}`; ctx.fillStyle = white(0.6 * tk); ctx.fillText('七种画法 · 一条节拍 · 数据只是占位', 960, 640);
    }
    const ek = U.seg(t, 62.6, 63.2);
    if (ek > 0) {
      ctx.textAlign = 'center'; ctx.fillStyle = white(ek);
      ctx.font = `800 60px ${FONT}`; ctx.fillText('形式实验 01', 960, 520);
      ctx.font = `500 18px ${MONO}`; ctx.fillStyle = white(0.55 * ek);
      ctx.fillText('points · raymarch · droste · slit-scan · flow · 120 BPM numpy score · WebCodecs VP9/Opus', 960, 580);
    }
    ctx.textAlign = 'left';
  }

  function render(ctx, t) {
    const sec = sectionAt(t).id;
    gl.viewport(0, 0, W, H);
    gl.clearColor(0.012, 0.018, 0.028, 1); gl.clear(gl.COLOR_BUFFER_BIT);
    if (sec === 'monolith') drawSdf(t);
    else if (sec === 'droste') drawDroste(t);
    else if (sec === 'slit') drawSlit(t);
    else drawParticles(t, sec === 'flow' && t < 57.4); // streaks while the field flows, points once the word settles
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(glc, 0, 0);
    overlay(ctx, t);
  }

  const LINES = {
    void: '一个点和一根线。次低频慢慢升起。',
    glyph: '16 万个粒子聚成“事件”“状态”“上下文”；每一拍底鼓都把字向外推开一次。',
    cloud: '同一批粒子重组为 48 条记录的螺旋，镜头绕行；三条蓝色记录是占位的“人工决定”。',
    monolith: '距离场柱廊：没有网格模型，每个像素沿光线步进求交。镜头沿通道前进，最后抬头看向唯一亮起的柱子。',
    droste: '文字环一层套一层，缩放沿对数螺旋无限继续，每层内容来自同一张图集。',
    slit: '时间切片：每一列读取不同时刻的同一行字；底鼓触发 RGB 分离与切片错位。',
    flow: '粒子沿解析流场拖出光丝，再被拉回，写成“形式”。',
    collapse: '全部粒子归于一点，黑场。',
  };
  const transcript = (t) => { const s = sectionAt(t); return `${s.label} · ${s.technique}。${LINES[s.id]}`; };

  function selfTest() {
    const checks = [], eq = (name, got, want) => checks.push({ name, got, want, pass: JSON.stringify(got) === JSON.stringify(want) });
    eq('sections contiguous', S.sections.every((s, i) => i === 0 || s.t0 === S.sections[i - 1].t1), true);
    eq('sections cover duration', [S.sections[0].t0, S.sections[S.sections.length - 1].t1], [0, S.duration]);
    eq('cuts on beat grid', S.sections.every((s) => Math.abs(s.t0 / BEAT - Math.round(s.t0 / BEAT)) < 1e-9), true);
    eq('impacts on section starts', S.impacts.every((x) => S.sections.some((s) => s.t0 === x)), true);
    eq('morphs ordered and non-overlapping', S.morphs.every((m, i) => m.t1 > m.t0 && (i === 0 || m.t0 >= S.morphs[i - 1].t1)), true);
    eq('morph targets exist', S.morphs.every((m) => m.to in SHAPES), true);
    eq('kick count', KICKS.length, (60 - 4) / BEAT - (44 - 36) / BEAT + (44 - 36) / (BEAT * 4));
    return { pass: checks.every((c) => c.pass), checks };
  }

  const CH = S.sections.map((s) => ({ t: s.t0, label: s.label }));
  VG.stage({
    kicker: 'FORM LAB 01 · 形式优先 · 占位数据',
    title: '形式实验 01：七种画法，一条节拍',
    lede: '同一条 120 BPM 合成音轨切出七种画法：粒子排印、点云空间、距离场建筑、无限缩放、时间切片、流场，最后塌缩为一点。词语和记录只是占位，这件作品只检验形式。每一帧都由 score.js 与时刻 t 决定，可以暂停、逐帧 seek，也可以切换为静态分镜。',
    duration: S.duration, fps: 30, chapters: CH, audio: 'score.wav',
    staticTimes: [2.5, 7.9, 11.6, 14.6, 20.5, 27, 34.6, 38.5, 42, 46.5, 50, 55, 59, 62.8],
    transcript, render, poster: 34.6,
    setup: () => { setup(); },
    meta: { fixture_id: S.score_id, fixture_revision: S.revision, selfTest, bitrate: 24_000_000 }, // flow strands stay below 30 dB at any tested rate; see README
    footer: '按“声音”开启音轨（导出的 WebM 已含 Opus 音轨）。键盘：空格 播放/暂停 · ←/→ 单帧 · [ ] 段落。<a href="README.md">README 与施工回执</a>',
  });
})();
