/* mc-gl — a small immediate-mode WebGL2 renderer for the request-chain scene.
 *
 * Draws lit boxes (optionally with a canvas texture on the top face), soft
 * decals on horizontal planes, and screen-space-thick lines with world-length
 * dashes. Everything is depth tested, so occlusion is real. No dependencies.
 * Draw calls take effect in call order; the scene draws opaque boxes first,
 * then decals, then lines.
 */
(function () {
  'use strict';

  // ---------- vectors and matrices (column-major) ----------
  const V = {
    add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
    sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
    scale: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
    dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
    cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
    len: (a) => Math.hypot(a[0], a[1], a[2]),
    norm: (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
    lerp: (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k],
  };

  function perspective(fovyDeg, aspect, near, far, shift) {
    const f = 1 / Math.tan((fovyDeg * Math.PI) / 360), m = new Float32Array(16);
    m[0] = f / aspect; m[5] = f; m[10] = (far + near) / (near - far); m[11] = -1; m[14] = (2 * far * near) / (near - far);
    if (shift) for (let c = 0; c < 4; c++) { m[c * 4] += shift[0] * m[c * 4 + 3]; m[c * 4 + 1] += shift[1] * m[c * 4 + 3]; }
    return m;
  }
  function lookAt(eye, target, up) {
    const f = V.norm(V.sub(target, eye)), s = V.norm(V.cross(f, up)), u = V.cross(s, f);
    return new Float32Array([s[0], u[0], -f[0], 0, s[1], u[1], -f[1], 0, s[2], u[2], -f[2], 0, -V.dot(s, eye), -V.dot(u, eye), V.dot(f, eye), 1]);
  }
  function mul(a, b) {
    const o = new Float32Array(16);
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
      let x = 0;
      for (let k = 0; k < 4; k++) x += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = x;
    }
    return o;
  }
  const clip = (m, p) => [
    m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12],
    m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
    m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14],
    m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15],
  ];

  // does the segment a→b pass through the box before reaching b?
  function segmentHitsBox(a, b, box) {
    let t0 = 0, t1 = 1 - 1e-3;
    for (let i = 0; i < 3; i++) {
      const d = b[i] - a[i], lo = box.c[i] - box.s[i] / 2, hi = box.c[i] + box.s[i] / 2;
      if (Math.abs(d) < 1e-9) { if (a[i] < lo || a[i] > hi) return false; continue; }
      let x0 = (lo - a[i]) / d, x1 = (hi - a[i]) / d;
      if (x0 > x1) [x0, x1] = [x1, x0];
      t0 = Math.max(t0, x0); t1 = Math.min(t1, x1);
      if (t0 > t1) return false;
    }
    return true;
  }

  // ---------- shaders ----------
  const BOX_VS = `#version 300 es
layout(location=0) in vec3 aPos; layout(location=1) in vec3 aNor;
uniform mat4 uVP; uniform vec3 uCenter, uSize;
out vec3 vNor; out vec3 vWorld; out vec3 vLocal;
void main(){ vec3 w = uCenter + aPos * uSize; vWorld = w; vNor = aNor; vLocal = aPos; gl_Position = uVP * vec4(w, 1.0); }`;
  const BOX_FS = `#version 300 es
precision highp float;
in vec3 vNor; in vec3 vWorld; in vec3 vLocal;
uniform vec4 uColor; uniform vec3 uSide; uniform vec3 uEye; uniform vec3 uFogColor; uniform vec2 uFog;
uniform sampler2D uTex; uniform float uUseTex;
out vec4 o;
void main(){
  vec3 col;
  if (vNor.y > 0.5) { col = uColor.rgb; if (uUseTex > 0.5) col = texture(uTex, vLocal.xz + 0.5).rgb; }
  else {
    float k = vNor.y < -0.5 ? 0.93 : (abs(vNor.x) > 0.5 ? (vNor.x > 0.0 ? 0.97 : 0.90) : (vNor.z > 0.0 ? 1.0 : 0.86));
    col = uSide * k;
  }
  float fog = smoothstep(uFog.x, uFog.y, distance(vWorld, uEye));
  col = mix(col, uFogColor, fog * 0.8);
  o = vec4(col * uColor.a, uColor.a);
}`;
  const DECAL_VS = `#version 300 es
layout(location=0) in vec3 aPos;
uniform mat4 uVP; uniform vec3 uCenter; uniform vec2 uSize;
out vec2 vP;
void main(){ vP = aPos.xz * uSize; gl_Position = uVP * vec4(uCenter + vec3(vP.x, 0.0, vP.y), 1.0); }`;
  const DECAL_FS = `#version 300 es
precision highp float;
in vec2 vP; uniform vec2 uSize; uniform vec4 uColor; uniform float uFeather; uniform float uRadius;
out vec4 o;
void main(){
  vec2 h = uSize * 0.5 - vec2(uFeather + uRadius);
  vec2 q = abs(vP) - h;
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
  float a = uColor.a * (1.0 - smoothstep(0.0, max(uFeather, 1e-4), d));
  o = vec4(uColor.rgb * a, a);
}`;
  const LINE_VS = `#version 300 es
layout(location=0) in vec2 aTS;
uniform vec4 uA, uB; uniform vec2 uViewport; uniform float uWidth, uCap, uD0, uD1;
out float vD;
void main(){
  vec2 sa = uA.xy / uA.w * 0.5 * uViewport, sb = uB.xy / uB.w * 0.5 * uViewport;
  vec2 d = sb - sa; float l = length(d); vec2 dir = l > 1e-5 ? d / l : vec2(1.0, 0.0); vec2 n = vec2(-dir.y, dir.x);
  vec4 p = mix(uA, uB, aTS.x);
  vec2 off = n * aTS.y * uWidth * 0.5 + dir * (aTS.x * 2.0 - 1.0) * uCap;
  p.xy += off / (0.5 * uViewport) * p.w;
  vD = mix(uD0, uD1, aTS.x);
  gl_Position = p;
}`;
  const LINE_FS = `#version 300 es
precision highp float;
in float vD; uniform vec4 uColor; uniform vec2 uDash;
out vec4 o;
void main(){
  if (uDash.x > 0.0 && mod(vD, uDash.x + uDash.y) > uDash.x) discard;
  o = vec4(uColor.rgb * uColor.a, uColor.a);
}`;

  function program(gl, vs, fs) {
    const p = gl.createProgram();
    for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      gl.attachShader(p, s);
    }
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {};
    for (let i = 0, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i < n; i++) {
      const name = gl.getActiveUniform(p, i).name;
      u[name] = gl.getUniformLocation(p, name);
    }
    return { p, u };
  }

  function cube() {
    const faces = [[[0, 1, 0], [1, 0, 0], [0, 0, -1]], [[0, -1, 0], [1, 0, 0], [0, 0, 1]], [[1, 0, 0], [0, 0, -1], [0, 1, 0]],
      [[-1, 0, 0], [0, 0, 1], [0, 1, 0]], [[0, 0, 1], [1, 0, 0], [0, 1, 0]], [[0, 0, -1], [-1, 0, 0], [0, 1, 0]]];
    const out = [];
    for (const [n, a, b] of faces) {
      const c = (i, j) => [n[0] / 2 + a[0] * i + b[0] * j, n[1] / 2 + a[1] * i + b[1] * j, n[2] / 2 + a[2] * i + b[2] * j];
      for (const [i, j] of [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]]) out.push(...c(i, j), ...n);
    }
    return new Float32Array(out);
  }

  function create(W, H) {
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const gl = canvas.getContext('webgl2', { antialias: true, alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true });
    if (!gl) return null;
    const box = program(gl, BOX_VS, BOX_FS), decal = program(gl, DECAL_VS, DECAL_FS), line = program(gl, LINE_VS, LINE_FS);

    const cubeVao = gl.createVertexArray();
    gl.bindVertexArray(cubeVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, cube(), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);

    const planeVao = gl.createVertexArray();
    gl.bindVertexArray(planeVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, 0.5]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);

    const lineVao = gl.createVertexArray();
    gl.bindVertexArray(lineVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, -1, 1, -1, 1, 1, 0, -1, 1, 1, 0, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
    if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(16, gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));

    let cam = null, fog = null;
    const NEAR = 0.3;

    const R = {
      canvas, gl,
      renderer() { const d = gl.getExtension('WEBGL_debug_renderer_info'); return d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'unknown'; },
      lost() { return gl.isContextLost(); },
      setTexture(source) {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        gl.generateMipmap(gl.TEXTURE_2D);
      },
      // camera: { eye, target, up, fov, shift }; fog: { color:[r,g,b], near, far }
      begin(camera, fogSpec) {
        const proj = perspective(camera.fov, W / H, NEAR, 120, camera.shift);
        cam = { eye: camera.eye, vp: mul(proj, lookAt(camera.eye, camera.target, camera.up)) };
        fog = fogSpec;
        gl.viewport(0, 0, W, H);
        gl.clearColor(0, 0, 0, 0);
        gl.clearDepth(1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.disable(gl.CULL_FACE);
        return cam;
      },
      // screen position of a world point: { x, y, w } in canvas pixels; w <= 0 means behind the camera
      project(p) {
        const c = clip(cam.vp, p);
        return { x: (c[0] / c[3] * 0.5 + 0.5) * W, y: (1 - (c[1] / c[3] * 0.5 + 0.5)) * H, w: c[3] };
      },
      box(c, s, color, o = {}) {
        gl.useProgram(box.p); gl.bindVertexArray(cubeVao);
        gl.depthMask(color[3] >= 1);
        gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(1, 1);
        gl.uniformMatrix4fv(box.u.uVP, false, cam.vp);
        gl.uniform3fv(box.u.uCenter, c); gl.uniform3fv(box.u.uSize, s);
        gl.uniform4fv(box.u.uColor, color); gl.uniform3fv(box.u.uSide, o.side || color.slice(0, 3));
        gl.uniform3fv(box.u.uEye, cam.eye); gl.uniform3fv(box.u.uFogColor, fog.color); gl.uniform2f(box.u.uFog, fog.near, fog.far);
        gl.uniform1f(box.u.uUseTex, o.tex ? 1 : 0);
        if (o.tex) { gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(box.u.uTex, 0); }
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        gl.disable(gl.POLYGON_OFFSET_FILL);
        gl.depthMask(true);
      },
      // soft rounded rectangle lying on a horizontal plane (shadows, ports, slots)
      decal(c, size, color, feather = 0.2, radius = 0.05) {
        gl.useProgram(decal.p); gl.bindVertexArray(planeVao);
        gl.depthMask(false);
        gl.uniformMatrix4fv(decal.u.uVP, false, cam.vp);
        gl.uniform3fv(decal.u.uCenter, c); gl.uniform2fv(decal.u.uSize, size);
        gl.uniform4fv(decal.u.uColor, color); gl.uniform1f(decal.u.uFeather, feather); gl.uniform1f(decal.u.uRadius, radius);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.depthMask(true);
      },
      // polyline with a pixel width; dash = [on, off] in world units; d0 = distance offset for the dash phase
      line(points, width, color, o = {}) {
        gl.useProgram(line.p); gl.bindVertexArray(lineVao);
        if (o.depth === false) gl.disable(gl.DEPTH_TEST);
        gl.depthMask(false);
        gl.uniform2f(line.u.uViewport, W, H);
        gl.uniform1f(line.u.uWidth, width); gl.uniform4fv(line.u.uColor, color);
        gl.uniform2fv(line.u.uDash, o.dash || [0, 0]); gl.uniform1f(line.u.uCap, o.dash ? 0 : width * 0.5);
        let d = o.d0 || 0;
        for (let i = 0; i + 1 < points.length; i++) {
          let a = clip(cam.vp, points[i]), b = clip(cam.vp, points[i + 1]);
          const l = V.len(V.sub(points[i + 1], points[i]));
          let d0 = d, d1 = d + l;
          d = d1;
          if (a[3] < NEAR && b[3] < NEAR) continue;
          if (a[3] < NEAR || b[3] < NEAR) {
            const k = (NEAR - a[3]) / (b[3] - a[3]), m = a.map((x, j) => x + (b[j] - x) * k), dm = d0 + (d1 - d0) * k;
            if (a[3] < NEAR) { a = m; d0 = dm; } else { b = m; d1 = dm; }
          }
          gl.uniform4fv(line.u.uA, a); gl.uniform4fv(line.u.uB, b);
          gl.uniform1f(line.u.uD0, d0); gl.uniform1f(line.u.uD1, d1);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        gl.depthMask(true);
        if (o.depth === false) gl.enable(gl.DEPTH_TEST);
      },
      boxEdges(c, s, width, color, o) {
        const h = [s[0] / 2, s[1] / 2, s[2] / 2], p = (i, j, k) => [c[0] + i * h[0], c[1] + j * h[1], c[2] + k * h[2]];
        for (const j of [-1, 1]) R.line([p(-1, j, -1), p(1, j, -1), p(1, j, 1), p(-1, j, 1), p(-1, j, -1)], width, color, o);
        for (const [i, k] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) R.line([p(i, -1, k), p(i, 1, k)], width, color, o);
      },
    };
    return R;
  }

  window.MCGL = { create, V, segmentHitsBox };
})();
