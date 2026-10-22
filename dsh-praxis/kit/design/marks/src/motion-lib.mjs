// 运动语义：每种运动是一个“时间 t（秒）的函数”，返回这一刻的状态。
// 网页里用它逐帧画，视频里用它在任意一帧定格；两边是同一份代码。
// 函数都是纯的：同一个 t 得到同一个结果，不读时钟，不记上一帧。

export const clamp01 = x => Math.max(0, Math.min(1, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const easeOut = k => 1 - Math.pow(1 - k, 3);
export const easeInOut = k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
// 驻留：一块文字至少停多久。9 字/秒取自本仓库无声知识片用过的读速，是项目参数。
export const hold = (chars, rate = 9) => Math.max(2, chars / rate);

// —— 十种运动的 t 函数。r 为真时返回减弱动效下的替代 ——
export const fn = {
  // 移动：同一个东西从 a 到 b。d 是时长。
  move: (t, { a, b, d = 0.6 }, r) => {
    const k = clamp01(t / d);
    return { x: r ? (k < 1 ? a : b) : lerp(a, b, easeInOut(k)), arrived: k >= 1 };
  },
  // 流向：沿线匀速前进的小箭头。v 是速度（单位/秒），gap 是箭头间距。
  flow: (t, { len, v = 36, gap = 40 }, r) => {
    const shift = r ? gap / 2 : (v * t) % gap;
    const xs = [];
    for (let x = shift; x < len; x += gap) xs.push(x);
    return { xs };
  },
  // 出现与退出：在 [at, at + d] 出现，在 [out, out + d] 退出。
  appear: (t, { at = 0, out = Infinity, d = 0.2 }, r) => {
    const i = r ? (t >= at ? 1 : 0) : easeOut(clamp01((t - at) / d));
    const o = r ? (t >= out ? 1 : 0) : easeOut(clamp01((t - out) / d));
    return { opacity: i * (1 - o), dy: (1 - i) * 8, present: t >= at && t < out + (r ? 0 : d) };
  },
  // 状态切换：同一个对象原地换状态。前半旧的淡出，后半新的淡入，词在中点换。
  swap: (t, { at = 0, d = 0.2 }, r) => {
    const k = r ? (t >= at ? 1 : 0) : clamp01((t - at) / d);
    return { from: clamp01(1 - k * 2), to: clamp01(k * 2 - 1), word: k < 0.5 ? 0 : 1 };
  },
  // 标出当前：标记每 stay 秒换到下一个位置，用 d 秒移过去。
  current: (t, { n, stay = 1.2, d = 0.24 }, r) => {
    const i = Math.min(n - 1, Math.floor(t / stay));
    const k = r || i === 0 ? 1 : easeInOut(clamp01((t - i * stay) / d));
    return { index: i, pos: i === 0 ? 0 : lerp(i - 1, i, k) };
  },
  // 等待：原地的缓慢明暗，不转圈，不前进。p 是一次明暗的周期。
  wait: (t, { p = 1.6, low = 0.45 }, r) => ({
    opacity: r ? 1 : lerp(low, 1, 0.5 + 0.5 * Math.cos((2 * Math.PI * t) / p)),
  }),
  // 循环一轮：沿闭合路径走一圈用 d 秒；round 是第几轮，从 1 起。
  loop: (t, { n, d = 2.4, max = Infinity }, r) => {
    const turns = Math.min(t / d, max);
    const round = Math.min(Math.floor(turns) + 1, max);
    const k = turns >= max ? 0 : turns % 1;
    return { round, pos: r ? Math.floor(k * n) : k * n, done: turns >= max };
  },
  // 入队与出队：三个阶段各 d 秒，阶段之间停 gap 秒。k 是当前阶段走了多少。
  queue: (t, { d = 0.5, gap = 0.5 }, r) => {
    const step = d + gap, phase = Math.min(2, Math.floor(t / step));
    const raw = clamp01((t - phase * step) / d);
    return { phase, k: r ? (raw > 0 ? 1 : 0) : easeInOut(raw) };
  },
  // 收拢与展开：n 项在 [at, at + d] 压成一项；k 从 0 到 1。倒着放就是展开。
  fold: (t, { at = 0, d = 0.4 }, r) => {
    const raw = clamp01((t - at) / d);
    const k = r ? (raw > 0 ? 1 : 0) : easeInOut(raw);
    return { k, items: 1 - clamp01(k * 1.6), summary: clamp01(k * 2.5 - 1.5) };
  },
  // 计时：真实经过的秒数对时限的比例，匀速，不缓动。
  timer: (t, { limit }, r) => {
    const e = Math.min(t, limit);
    return { seconds: Math.floor(e), ratio: (r ? Math.floor(e) : e) / limit, over: t >= limit };
  },
};

// —— 样张：把函数的结果画成一帧 SVG。舞台 320 × 104 ——
const use = (id, x, y, s = 24, extra = '') => `<use href="#${id}" x="${x}" y="${y}" width="${s}" height="${s}" ${extra}/>`;
const txt = (x, y, s, cls = '', anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="${cls}">${s}</text>`;
const line = (x1, y1, x2, y2, cls = '') => `<path class="g-line ${cls}" d="M${x1} ${y1}L${x2} ${y2}"/>`;
const n2 = x => Math.round(x * 100) / 100;

export const MOTIONS = [
  {
    id: 'move', zh: '移动', span: 1.4,
    means: '同一个东西从 A 到了 B。读者要能一直认出它是同一个。',
    params: '时长：界面 200–300 毫秒，视频 0.4–0.8 秒。曲线：先加速后减速。距离远时加时长，不加速度感。',
    html: 'transform: translate(…);\ntransition: transform var(--t-move) var(--ease-in-out);',
    reduced: '不补间，直接出现在 B；A 到 B 之间留一条带箭头的细线，说明它是从哪里来的。',
    avoid: '前后不是同一个东西时不用（那是一个退出、一个出现）。位置没有含义、只是重新排版时也不用。',
    frame(t, r) {
      const m = fn.move(t - 0.3, { a: 86, b: 210, d: 0.6 }, r);
      return line(80, 44, 240, 44, 'faint') + (r && m.arrived ? use('g-arrow', 196, 38, 12) : '')
        + txt(64, 86, '浏览器') + txt(256, 86, '网关')
        + use('g-browser', 52, 32, 24, 'class="dim"') + use('g-gateway', 244, 32, 24, 'class="dim"')
        + `<g transform="translate(${n2(m.x)} 32)"><rect x="-3" y="-3" width="30" height="30" rx="4" class="chip"/>${use('g-file', 0, 0)}</g>`
        + txt(160, 100, m.arrived ? '请求已到网关' : '请求在路上', 'cap');
    },
  },
  {
    id: 'flow', zh: '流向', span: 3,
    means: '东西此刻正沿这条线朝一个方向持续流动。',
    params: '速度 24–60 单位/秒，匀速。小箭头的间距固定。线保持实线：虚线留给“尚未成立”。',
    html: '@keyframes flow { to { transform: translateX(40px); } }\n.arrows { animation: flow 1.1s linear infinite; }',
    reduced: '小箭头停在线上不动。方向仍然看得出，只是不再表示“正在流”，由旁边的词说明。',
    avoid: '只是有依赖关系、此刻没有东西在流时不用。速度不表示流量，除非流量是量出来的并且写明。',
    frame(t, r) {
      const f = fn.flow(t, { len: 168, v: 36, gap: 42 }, r);
      return line(76, 44, 244, 44) + f.xs.map(x => use('g-arrow', 76 + x - 6, 38, 12)).join('')
        + use('g-model', 48, 32) + use('g-browser', 248, 32) + txt(60, 86, '模型') + txt(260, 86, '浏览器')
        + txt(160, 100, r ? '流式输出中（静止显示）' : '流式输出中', 'cap');
    },
  },
  {
    id: 'appear', zh: '出现与退出', span: 3,
    means: '一个对象加入了，或者离开了。别的对象不动。',
    params: '时长 150–250 毫秒，视频可到 0.4 秒。出现时上移 8 个单位并淡入；退出只淡出，不位移。',
    html: '.enter { animation: in var(--t-state) var(--ease-out); }\n@keyframes in { from { opacity: 0; transform: translateY(8px); } }',
    reduced: '直接出现或消失，旁边的词同时更新（“3 个工具”变“4 个工具”）。',
    avoid: '同一个对象换状态时不用。被拒绝的和已过期的不退出，它们留在图上。',
    frame(t, r) {
      const a = fn.appear(t, { at: 0.5, out: 2.1, d: 0.25 }, r);
      const count = a.present ? 4 : 3;
      return [0, 1, 2].map(i => use('g-tool', 64 + i * 56, 30) + txt(76 + i * 56, 74, ['读文件', '查询', '写文件'][i])).join('')
        + `<g opacity="${n2(a.opacity)}" transform="translate(0 ${n2(a.dy)})">${use('g-tool', 232, 30)}${txt(244, 74, '发邮件')}</g>`
        + txt(160, 100, `可用的工具：${count} 个`, 'cap');
    },
  },
  {
    id: 'swap', zh: '状态切换', span: 2.2,
    means: '同一个对象从一种状态变成另一种。位置和名字不变，变的只有状态。',
    params: '时长 150–250 毫秒。旧记号先淡出，新记号再淡入，两者不同时可见；状态词在中点替换。',
    html: '.state { transition: opacity calc(var(--t-state) / 2) linear; }\n/* 脚本在真实状态变了之后才换记号和词 */',
    reduced: '记号和词同时直接替换。词是反馈本身，不需要别的替代。',
    avoid: '不在两种状态之间补出“中间状态”的样子。状态变化以真实结果为准，动画播完不等于事情做完。',
    frame(t, r) {
      const s = fn.swap(t, { at: 0.9, d: 0.24 }, r);
      return use('g-tool', 92, 30) + txt(126, 47, '写文件', 'lead', 'start')
        + `<g opacity="${n2(s.from)}">${use('g-running', 196, 30)}</g><g opacity="${n2(s.to)}">${use('g-done', 196, 30)}</g>`
        + txt(228, 47, ['进行中', '已完成'][s.word], '', 'start')
        + txt(160, 100, '同一个位置，同一个名字', 'cap');
    },
  },
  {
    id: 'current', zh: '标出当前', span: 4.8,
    means: '读者或叙述此刻在哪里。一张图里只有一个“当前”。',
    params: '标记移动 200–300 毫秒；每处停多久由那里的文字量决定（至少 2 秒，或字数 ÷ 9）。',
    html: '.marker { transition: transform var(--t-move) var(--ease-in-out); }\n[aria-current="step"] { font-weight: 600; }',
    reduced: '标记直接出现在新位置，不滑动。当前项的名字照样加粗。',
    avoid: '同一张图里已经用强调色标“等人决定”时，不再用它标“当前”。不同时标出两个当前。',
    frame(t, r) {
      const names = ['提问', '规划', '调用', '交付'], c = fn.current(t, { n: 4, stay: 1.2, d: 0.26 }, r);
      const x = i => 52 + i * 72;
      return line(x(0), 40, x(3), 40)
        + names.map((s, i) => `<circle cx="${x(i)}" cy="40" r="4.5" class="${i <= c.index ? 'fill' : 'hole'}"/>` + txt(x(i), 68, s, i === c.index ? 'lead' : '')).join('')
        + `<circle cx="${n2(x(c.pos))}" cy="40" r="10" class="ring"/>`
        + txt(160, 100, `当前：第 ${c.index + 1} 步，共 4 步`, 'cap');
    },
  },
  {
    id: 'wait', zh: '等待', span: 3.2,
    means: '停在这里，等人或等外部结果。不知道还要多久。',
    params: '一次明暗 1.4–2 秒，最暗不低于 45%。位置不动，不旋转，不画进度。',
    html: '@keyframes wait { 50% { opacity: .45; } }\n.waiting { animation: wait var(--t-pulse) ease-in-out infinite; }',
    reduced: '记号静止，旁边的词写“等待中”。词已经说明了状态。',
    avoid: '有已知时限时改用计时。系统其实在工作时用“进行中”。结果未知不是等待，用它自己的记号。',
    frame(t, r) {
      const w = fn.wait(t, { p: 1.6 }, r);
      return use('g-agent', 60, 30) + line(92, 42, 140, 42) + use('g-arrow', 134, 36, 12)
        + `<g class="accent"><g opacity="${n2(w.opacity)}">${use('g-awaiting', 150, 30)}</g>${txt(182, 47, '等人确认', 'lead', 'start')}</g>`
        + line(246, 42, 276, 42, 'g-line--pending') + use('g-file', 280, 30, 24, 'class="dim"')
        + txt(160, 100, '写文件之前停在这里', 'cap');
    },
  },
  {
    id: 'loop', zh: '循环一轮', span: 6,
    means: '同一组步骤又走了一遍。读者要知道这是第几轮，以及什么时候停。',
    params: '一轮 1.5–3 秒，匀速。轮数写成字。视频里最多演两轮，之后用轮数代替。',
    html: 'offset-path: path("…");\nanimation: lap 2.4s linear infinite; /* 轮数由脚本按真实轮次更新 */',
    reduced: '标记在几个步骤之间逐个跳，不沿路径滑；轮数照常更新。',
    avoid: '不知道停止条件时不让它无休止地转。只走一遍的流程不画成环。',
    frame(t, r) {
      const names = ['想', '做', '看结果'], L = fn.loop(t, { n: 3, d: 2.4, max: 2 }, r);
      const P = [[80, 30], [240, 30], [160, 70]];
      const i = Math.floor(L.pos) % 3, k = L.pos - Math.floor(L.pos), a = P[i], b = P[(i + 1) % 3];
      const x = lerp(a[0], b[0], k), y = lerp(a[1], b[1], k);
      return `<path class="g-line" d="M80 30H240L160 70Z"/>` + use('g-arrow', 154, 24, 12)
        + P.map((p, j) => `<circle cx="${p[0]}" cy="${p[1]}" r="4.5" class="hole"/>`).join('')
        + txt(66, 34, names[0], '', 'end') + txt(254, 34, names[1], '', 'start') + txt(160, 88, names[2])
        + (L.done ? '' : `<circle cx="${n2(x)}" cy="${n2(y)}" r="6" class="fill"/>`)
        + txt(160, 102, L.done ? '走完 2 轮，达到上限后停下' : `第 ${L.round} 轮，上限 2 轮`, 'cap');
    },
  },
  {
    id: 'queue', zh: '入队与出队', span: 3.4,
    means: '东西在排队：从一头进，从另一头被取走；放不下的被丢弃，但看得出它来过。',
    params: '每个动作 300–500 毫秒，动作之间留停顿。进和出走同一个方向。',
    html: '.item { transition: transform var(--t-move) var(--ease-in-out); }\n/* 脚本改的是队列数据，位置由数据算出 */',
    reduced: '每个动作直接到位，不滑动。被丢弃的那一项照样留在队列下方，带着叉和“已丢弃”。',
    avoid: '顺序没有意义的一堆东西不画成队列。被丢弃的不让它凭空消失。',
    frame(t, r) {
      const q = fn.queue(t - 0.3, { d: 0.5, gap: 0.5 }, r), slot = i => 112 + i * 36, k = q.k, ph = t < 0.3 ? -1 : q.phase;
      const box = (x, y, s, cls = '') => `<g transform="translate(${n2(x)} ${n2(y)})" class="${cls}"><rect x="-13" y="-11" width="26" height="22" rx="3" class="chip"/>${txt(0, 5, s)}</g>`;
      // 阶段 0：D 从右边入队；阶段 1：A 被取走；阶段 2：E 到来，队列已满，被丢弃。
      const taken = ph >= 1 ? (ph === 1 ? k : 1) : 0;
      let out = `<path class="g-line" d="M90 27H242M90 59H242"/>` + txt(58, 48, '取走') + txt(294, 48, '到来');
      out += box(lerp(slot(0), 58, taken), lerp(43, 14, taken), 'A');
      out += box(slot(1), 43, 'B') + box(slot(2), 43, 'C');
      out += box(ph < 0 ? 264 : ph === 0 ? lerp(264, slot(3), k) : slot(3), ph < 0 ? 14 : ph === 0 ? lerp(14, 43, k) : 43, 'D');
      if (ph === 2) out += box(264, lerp(14, 80, k), 'E', 'dim') + (k >= 1 ? use('g-end-cross', 284, 74, 12) + txt(244, 84, '已丢弃', '', 'end') : '');
      return out + txt(124, 102, ['D 到来', 'D 入队', 'A 被取走', '队列已满，E 被丢弃'][ph + 1], 'cap');
    },
  },
  {
    id: 'fold', zh: '收拢与展开', span: 2.4,
    means: '多项压成了一项，或者一项展开成多项。读者要知道压之前有几项。',
    params: '时长 300–500 毫秒。各项向同一处靠拢并淡出，代表它们的那一项随后出现，项数写成字。倒放即展开。',
    html: '.item { transition: transform var(--t-move) var(--ease-in-out), opacity var(--t-state) linear; }',
    reduced: '直接替换，并写明“由 4 条压成”。项数是必须保留的反馈。',
    avoid: '压缩有损失时不让它看起来像无损：写明压掉了什么。几项之间没有归并关系时不用。',
    frame(t, r) {
      const f = fn.fold(t, { at: 0.7, d: 0.45 }, r), ys = [14, 32, 50, 68], yc = 41;
      return ys.map((y, i) => `<g opacity="${n2(f.items)}" transform="translate(0 ${n2(lerp(0, yc - y, f.k))})"><rect x="84" y="${y - 7}" width="${[150, 120, 138, 104][i]}" height="12" rx="2" class="chip"/></g>`).join('')
        + `<g opacity="${n2(f.summary)}"><rect x="84" y="${yc - 9}" width="150" height="18" rx="2" class="chip"/>${use('g-compress', 60, yc - 10, 20)}${txt(92, yc + 5, '摘要 · 由 4 条压成', '', 'start')}</g>`
        + txt(160, 100, f.k < 1 ? '4 条消息' : '1 条摘要，原文已外置', 'cap');
    },
  },
  {
    id: 'timer', zh: '计时', span: 6,
    means: '时间在走，离一个已知的时限还有多远。',
    params: '匀速，不缓动。视频里画面的 1 秒等于讲的 1 秒；要压缩时间就写明比例。',
    html: '/* 每帧按真实经过的时间设宽度，不用固定时长的 transition */\nbar.style.width = elapsed / limit * 100 + "%";',
    reduced: '读数和量条每秒跳一次。计时照常，读数是文字。',
    avoid: '只用于真实的计时。不知道要等多久时不用，否则就是一条假进度。',
    frame(t, r) {
      const m = fn.timer(t, { limit: 5 }, r);
      return `<rect x="60" y="34" width="200" height="10" class="track"/><rect x="60" y="34" width="${n2(200 * m.ratio)}" height="10" class="fill"/>`
        + `<path class="g-line" d="M260 28V50"/>` + txt(60, 66, '0', 'mono', 'start') + txt(260, 66, '时限 5 秒', 'mono', 'end')
        + txt(60, 24, `${m.seconds} 秒`, 'lead', 'start')
        + txt(160, 100, m.over ? '已到时限' : '等待工具返回', 'cap');
    },
  },
];

export const svg = (m, t, r = false) => `<svg viewBox="0 0 320 108" role="img" aria-label="${m.zh}，t = ${t} 秒">${m.frame(t, r)}</svg>`;

// 无脚本和打印时用的定格条：五个时刻。
export const strip = id => {
  const m = MOTIONS.find(x => x.id === id);
  return [0, 0.25, 0.5, 0.75, 1].map(k => {
    const t = Math.round(m.span * k * 100) / 100;
    return `<figure>${svg(m, t)}<figcaption>t = ${t} 秒</figcaption></figure>`;
  }).join('');
};

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const source = id => esc(`${id}: ${fn[id].toString().replace(/\n  /g, '\n')}`);
