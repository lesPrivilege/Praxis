/* Semantic model of the request chain: what is true at an event time, and what
 * the interface has been told by a story time. No geometry, no drawing. Loaded
 * by the page as a script and by build.mjs through require().
 *
 * Three clocks stay apart:
 *   tau  event time of the recorded run (fixture units)
 *   s    story time of the film (seconds); tau(s) is monotone and may hold
 *   the camera, which never enters this file
 *
 * build() refuses anything the scene would have to guess at or could not draw.
 */
(function (root) {
  'use strict';

  const STATES = ['pending', 'ack', 'durable', 'failed'];
  const TERMINAL = ['durable', 'failed'];
  const LEVELS = ['ui', 'queue', 'worker', 'storage'];   // the scene's geometry is built for these four
  const POLICY_KEYS = ['idle', 'pending', 'ack', 'durable', 'failed'];
  const WORDS = ['receipt', 'hidden', 'offscreen', 'behind', 'uiNow', 'ledger', 'eventTime', 'oldHint', 'camera', 'gauge', 'before', 'noGL', 'noGLMore', 'lede', 'footer', 'page'];
  const MAX_REQUESTS = 4;
  const has = (o, k) => o !== null && typeof o === 'object' && Object.hasOwn(o, k);
  const isObj = (o) => o !== null && typeof o === 'object' && !Array.isArray(o);
  const isNum = (x) => typeof x === 'number' && Number.isFinite(x);
  const isText = (x) => typeof x === 'string' && x.trim().length > 0;
  const num = (x) => String(Math.round(x * 1e6) / 1e6);   // 4.4 - 1.4 prints as 3, not 3.0000000000000004

  function fail(msg) { throw new Error(`mc01 拒绝生成：${msg}`); }
  const need = (cond, msg) => { if (!cond) fail(msg); };

  // requests in order of first appearance
  function requests(chain) {
    need(Array.isArray(chain) && chain.length, 'fixture 里没有事件');
    const byId = new Map();
    let last = -Infinity;
    chain.forEach((e, i) => {
      need(isObj(e), `第 ${i + 1} 条事件不是对象`);
      need(typeof e.id === 'string' && /^\S+$/.test(e.id), `第 ${i + 1} 条事件的 id 为空或含空白`);
      need(isNum(e.time), `${e.id} 的事件时间不是数`);
      need(STATES.includes(e.state), `${e.id} 的状态“${e.state}”不在 ${STATES.join(' / ')} 之内`);
      need(e.time >= last, `事件没有按时间排序：${e.id} t=${e.time}`);
      last = e.time;
      if (!byId.has(e.id)) byId.set(e.id, { id: e.id, index: byId.size, events: [] });
      byId.get(e.id).events.push({ time: e.time, state: e.state, key: `${e.id}.${e.state}` });
    });
    const out = [...byId.values()];
    need(out.length <= MAX_REQUESTS, `这个场景最多画 ${MAX_REQUESTS} 条请求，输入有 ${out.length} 条`);
    for (const r of out) {
      const seq = r.events.map((e) => e.state);
      need(seq[0] === 'pending', `${r.id} 的第一条事件不是 pending`);
      need(new Set(seq).size === seq.length, `${r.id} 有重复的状态`);
      seq.forEach((st, i) => {
        need(i !== 1 || st === 'ack', `${r.id} 的第 2 条事件应为 ack，实为 ${st}`);
        need(i !== 2 || TERMINAL.includes(st), `${r.id} 在 ack 之后只能是 durable 或 failed`);
        need(i <= 2, `${r.id} 在终态之后还有事件`);
      });
      for (let i = 1; i < r.events.length; i++) need(r.events[i].time > r.events[i - 1].time, `${r.id} 的 ${r.events[i].state} 不晚于前一状态`);
      r.tPending = r.events[0].time;
      r.tAck = r.events[1] ? r.events[1].time : null;
      r.tEnd = r.events[2] ? r.events[2].time : null;
      r.endState = r.events[2] ? r.events[2].state : null;
    }
    // two requests leaving at the same instant would be drawn on top of each other
    for (let i = 1; i < out.length; i++) need(out[i].tPending > out[i - 1].tPending, `${out[i].id} 与 ${out[i - 1].id} 同一时刻发出，画面上会重合`);
    return out;
  }

  const stateAt = (req, tau) => { let st = null; for (const e of req.events) if (tau >= e.time) st = e.state; return st; };

  // tau(s): piecewise linear through the knots
  function tauAt(knots, s) {
    if (s <= knots[0][0]) return knots[0][1];
    for (let i = 1; i < knots.length; i++) {
      const [s0, t0] = knots[i - 1], [s1, t1] = knots[i];
      if (s <= s1) return s1 === s0 ? t1 : t0 + ((t1 - t0) * (s - s0)) / (s1 - s0);
    }
    return knots[knots.length - 1][1];
  }
  // first story time at which tau reaches a value
  function sOf(knots, tau) {
    if (tau <= knots[0][1]) return knots[0][0];
    for (let i = 1; i < knots.length; i++) {
      const [s0, t0] = knots[i - 1], [s1, t1] = knots[i];
      if (tau <= t1) return t1 === t0 ? s0 : s0 + ((s1 - s0) * (tau - t0)) / (t1 - t0);
    }
    return Infinity;
  }

  // shapes the scene reads without checking again
  function shape(data) {
    need(isObj(data) && isObj(data.fixture), '缺少 fixture');
    for (const key of ['levels', 'states', 'ui', 'director', 'words', 'mapping']) need(has(data, key), `缺少 ${key}`);
    for (const key of ['id', 'revision', 'title', 'subtitle', 'tagNote']) need(isText(data[key]), `缺少 ${key}`);
    need(Array.isArray(data.levels) && data.levels.length === LEVELS.length && data.levels.every((l, i) => isObj(l) && l.id === LEVELS[i] && isText(l.label) && isText(l.gloss)),
      `levels 必须依次是 ${LEVELS.join(' / ')} 四层，各有 label 和 gloss；这个场景的空间只为这四层搭建`);
    for (const st of STATES) need(isObj(data.states[st]) && isText(data.states[st].word) && typeof data.states[st].standing === 'string' && LEVELS.includes(data.states[st].level), `states.${st} 缺少 word、standing 或 level 不是已知的层`);
    for (const w of WORDS) need(has(data.words, w), `words 缺少 ${w}`);
    const ui = data.ui;
    need(isObj(ui) && isText(ui.window) && isText(ui.heading) && isText(ui.button) && isText(ui.retry), 'ui 缺少 window、heading、button 或 retry');
    need(Array.isArray(ui.body) && ui.body.every(isText), 'ui.body 不是文字数组');
    need(Array.isArray(ui.edits) && ui.edits.every((e) => isObj(e) && isNum(e.tau) && isText(e.line)), 'ui.edits 的每一项要有 tau 和 line');
    for (const p of ['naive', 'truthful']) for (const k of POLICY_KEYS) need(isObj(ui.policies) && isObj(ui.policies[p]) && isText(ui.policies[p][k]), `ui.policies.${p}.${k} 没有写`);
    need(isText(data.mapping.title) && Array.isArray(data.mapping.columns) && data.mapping.columns.length === 3 && data.mapping.columns.every(isText), 'mapping 需要 title 和三个列名');
    const dir = data.director;
    need(isObj(dir) && isNum(dir.duration) && dir.duration > 0, 'director.duration 不是正数');
    need(Array.isArray(dir.knots) && dir.knots.length >= 2 && dir.knots.every((k) => Array.isArray(k) && isNum(k[0]) && isNum(k[1])), 'director.knots 不是 [叙事秒, 事件时间] 的数组');
    need(isNum(dir.policySwitch) && dir.policySwitch >= 0 && dir.policySwitch <= dir.duration, 'director.policySwitch 不在片长之内');
    need(isObj(dir.flights), 'director.flights 没有写');
    const poseOk = (c) => isObj(c) && isNum(c.az) && isNum(c.r) && isNum(c.y) && isNum(c.top) && Array.isArray(c.target) && c.target.length === 3 && c.target.every(isNum);
    need(Array.isArray(dir.camera) && dir.camera.length && dir.camera.every((c) => poseOk(c) && isNum(c.at) && isNum(c.move) && c.move >= 0), 'director.camera 为空或有一项不完整');
    need(dir.camera[0].at === 0, 'director.camera 的第一项不在 0 秒');
    for (let i = 1; i < dir.camera.length; i++) need(dir.camera[i].at - dir.camera[i].move >= dir.camera[i - 1].at, `director.camera 第 ${i + 1} 项的移动与前一项重叠`);
    need(isObj(dir.stations) && ['overview', ...LEVELS].every((k) => poseOk(dir.stations[k])), `director.stations 需要 overview 和 ${LEVELS.join(' / ')}`);
    need(Array.isArray(dir.chapters) && dir.chapters.length && dir.chapters[0].t === 0 && dir.chapters.every((c, i) => isObj(c) && isNum(c.t) && isText(c.label) && (i === 0 || c.t > dir.chapters[i - 1].t)), 'director.chapters 为空、不从 0 开始或没有按时间排序');
    need(Array.isArray(dir.captions) && dir.captions.length && dir.captions[0][0] === 0 && dir.captions.every((c, i) => Array.isArray(c) && isNum(c[0]) && isText(c[1]) && (i === 0 || c[0] > dir.captions[i - 1][0])), 'director.captions 为空、不从 0 开始或没有按时间排序');
    need(Array.isArray(dir.staticTimes) && dir.staticTimes.length && dir.staticTimes.every((t) => isNum(t) && t >= 0 && t <= dir.duration), 'director.staticTimes 为空或超出片长');
    need(isObj(dir.overlays) && ['title', 'reveal', 'mapping'].every((k) => Array.isArray(dir.overlays[k]) && dir.overlays[k].length === 2 && dir.overlays[k].every(isNum)), 'director.overlays 需要 title、reveal、mapping 三个时间窗');
    // these strings are placed into the page as HTML by the stage
    const html = [data.title, data.subtitle, ...dir.chapters.map((c) => c.label), ...dir.captions.map((c) => c[1]), ...data.levels.flatMap((l) => [l.label, l.gloss])];
    for (const t of html) need(!/[<&]/.test(t), `文字里不能有 < 或 &：${t}`);
  }

  function build(data) {
    shape(data);
    const reqs = requests(data.fixture.events);
    const dir = data.director, knots = dir.knots;
    for (let i = 1; i < knots.length; i++) {
      need(knots[i][0] >= knots[i - 1][0], `knots 的故事时间倒退：${knots[i][0]}`);
      need(knots[i][1] >= knots[i - 1][1], `knots 的事件时间倒退：${knots[i][1]}，倒放不能改写已发生的事`);
    }
    need(knots[0][0] === 0 && knots[knots.length - 1][0] === dir.duration, 'knots 没有从 0 排到片长');
    const taus = new Set(knots.map((k) => k[1]));
    const events = [];
    for (const r of reqs) for (const e of r.events) {
      // a state may only flip at a moment the director wrote down
      need(taus.has(e.time), `knots 没有覆盖 ${e.key} 的事件时间 t=${e.time}`);
      events.push({ ...e, id: r.id, s: sOf(knots, e.time) });
    }
    events.sort((a, b) => a.time - b.time || a.s - b.s);
    // receipts: one for the ack, one for the terminal state; they fly in story time while tau holds
    const flights = [];
    for (const r of reqs) for (const e of r.events.slice(1)) {
      const f = has(dir.flights, e.key) ? dir.flights[e.key] : null;
      need(isObj(f) && isNum(f.delay) && f.delay >= 0 && isNum(f.dur) && f.dur > 0, `director.flights.${e.key} 要写 delay（不小于 0）和 dur（大于 0）`);
      const s0 = sOf(knots, e.time) + f.delay, s1 = s0 + f.dur;
      need(s1 <= dir.duration, `${e.key} 的回执在片子结束之后才落地，界面永远收不到`);
      // receipt transit takes no event time in this model, so tau must still be holding when it lands
      need(tauAt(knots, s1) === e.time, `${e.key} 的回执落地之前事件时间已经前进`);
      flights.push({ id: r.id, key: e.key, state: e.state, time: e.time, s0, s1 });
    }
    for (const k of Object.keys(dir.flights)) need(flights.some((f) => f.key === k), `director.flights 写了不存在的事件 ${k}`);
    // one status line can only speak for the latest request; a failure it could not show is refused, not hidden
    for (const f of flights.filter((x) => x.state === 'failed')) {
      const tau = tauAt(knots, f.s1), live = reqs.filter((r) => tau >= r.tPending);
      need(live[live.length - 1].id === f.id, `${f.id} 失败的回执落地时已有更晚的请求在途，一行状态提示说不出这次失败`);
    }
    const first = reqs[0];
    const gap = first.tEnd !== null && first.endState === 'durable' ? num(first.tEnd - first.tAck) : null;
    const captions = dir.captions.map(([s, raw]) => {
      need(!/t\s*[=＝]\s*\d/.test(raw), `文案里的事件时间要写成 {t:事件}：${raw}`);
      const text = raw.replace(/\{t:([^}]+)\}/g, (_, k) => {
        const e = events.find((x) => x.key === k);
        need(e, `文案引用了不存在的事件 ${k}`);
        // a caption may not announce an event before the film reaches it
        need(s >= e.s - 1e-9, `${s} 秒的文案提到 ${k}（t=${e.time}），但影片到 ${num(e.s)} 秒才到这个事件`);
        return num(e.time);
      }).replace(/\{ui:(\w+)\.(\w+)\}/g, (_, p, k) => {
        need(has(data.ui.policies, p) && has(data.ui.policies[p], k), `文案引用了不存在的提示 ${p}.${k}`);
        return data.ui.policies[p][k];
      }).replace(/\{gap\}/g, () => { need(gap !== null, '文案用了 {gap}，但第一条请求没有落盘'); return gap; });
      need(!/[{}]/.test(text), `文案里有没有认出的占位：${raw}`);
      for (const m of text.match(/req-[\w-]+/g) || []) need(reqs.some((r) => r.id === m), `文案提到了 fixture 里没有的 ${m}`);
      // two lines of the caption band hold about 96 full-width characters
      const width = [...text].reduce((a, ch) => a + (/[⺀-￯]/.test(ch) ? 1 : 0.55), 0);
      need(width <= 96, `文案超过两行：${text}`);
      return [s, text];
    });
    return { reqs, events, flights, captions, knots, duration: dir.duration, gap };
  }

  // what the interface has been told about a request by story time s: the state of the last receipt that landed
  function uiKnown(model, req, s) {
    if (s < sOf(model.knots, req.tPending)) return null;
    let st = 'pending';
    for (const f of model.flights) if (f.id === req.id && s >= f.s1) st = f.state;
    return st;
  }

  // the status line at story time s under a wording policy; it speaks for the latest request only
  function uiStatus(data, model, s, policyName) {
    const tau = tauAt(model.knots, s);
    const policy = data.ui.policies[policyName];
    const edits = data.ui.edits.filter((e) => tau >= e.tau);
    const live = model.reqs.filter((r) => tau >= r.tPending);
    const latest = live[live.length - 1] || null;
    const lastEdit = edits.length ? edits[edits.length - 1].tau : -Infinity;
    if (!latest || lastEdit > latest.tPending) return { text: policy.idle, known: null, req: null, awaiting: true, edits };
    const known = uiKnown(model, latest, s);
    // a person has something to decide when the last thing the interface heard is a failure
    return { text: policy[known], known, req: latest, awaiting: known === 'failed' && policyName === 'truthful', edits };
  }

  const policyAt = (data, s) => (s < data.director.policySwitch ? 'naive' : 'truthful');

  const api = { STATES, TERMINAL, LEVELS, MAX_REQUESTS, num, requests, stateAt, tauAt, sOf, build, uiKnown, uiStatus, policyAt };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MC01Model = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
