// Text measurement and line breaking. Names are measured on a canvas with the
// same font the SVG declares, broken at CJK characters or whole Latin words,
// then balanced so a wrapped name uses the narrowest width with the same line count.
(function (EC) {
  const NO_START = '，。、；：！？）》」』】〕〉”’%‰,.;:!?)]}…·';
  const NO_END = '（《「『【〔〈“‘([{';
  const ctx = document.createElement('canvas').getContext('2d');
  const cache = new Map();

  function font(size, weight) {
    return `${weight} ${size}px ${EC.FONT_STACK}`;
  }

  function measure(text, f) {
    const key = f + '\u0000' + text;
    let w = cache.get(key);
    if (w === undefined) {
      ctx.font = f;
      w = ctx.measureText(text).width;
      cache.set(key, w);
    }
    return w;
  }

  // Ascent and descent of the resolved font, used to place baselines explicitly
  // instead of relying on dominant-baseline, which other SVG software ignores.
  function metrics(f) {
    ctx.font = f;
    const m = ctx.measureText('国Ag');
    return { ascent: m.fontBoundingBoxAscent, descent: m.fontBoundingBoxDescent };
  }

  // A short bracketed group such as （江苏） or （集团） stays on one line.
  const PAIRS = { '（': '）', '(': ')', '【': '】', '《': '》' };
  const GROUP_MAX = 8;

  function tokenize(text) {
    const split = text.match(/[A-Za-z0-9@#&+'’._\-\/]+|\s+|./gu) || [];
    const raw = [];
    for (let i = 0; i < split.length; i++) {
      const close = PAIRS[split[i]];
      const end = close ? split.indexOf(close, i + 1) : -1;
      if (end > i && split.slice(i, end + 1).join('').length <= GROUP_MAX && !split.slice(i, end).some((t) => /^\s+$/.test(t))) {
        raw.push(split.slice(i, end + 1).join(''));
        i = end;
      } else {
        raw.push(split[i]);
      }
    }
    const tokens = [];
    for (const t of raw) {
      if (/^\s+$/.test(t)) {
        if (tokens.length && tokens[tokens.length - 1] !== ' ') tokens.push(' ');
        continue;
      }
      const prev = tokens[tokens.length - 1];
      if (prev && prev !== ' ' && (NO_START.includes(t[0]) || NO_END.includes(prev[prev.length - 1]))) {
        tokens[tokens.length - 1] = prev + t;
      } else {
        tokens.push(t);
      }
    }
    return tokens;
  }

  function wrapTokens(tokens, max, f) {
    const lines = [];
    let cur = '';
    const flush = () => {
      if (cur.trim()) lines.push(cur.trim());
      cur = '';
    };
    for (const t of tokens) {
      if (t === ' ') {
        if (cur) cur += ' ';
        continue;
      }
      if (measure((cur + t).trim(), f) <= max) {
        cur += t;
        continue;
      }
      flush();
      if (measure(t, f) <= max) {
        cur = t;
        continue;
      }
      // A single token wider than the box (a long Latin word) breaks by character.
      for (const ch of t) {
        if (cur && measure(cur + ch, f) > max) flush();
        cur += ch;
      }
    }
    flush();
    return lines;
  }

  function wrap(text, max, f) {
    const lines = [];
    for (const paragraph of String(text).split(/\r?\n/)) {
      const tokens = tokenize(paragraph);
      const greedy = wrapTokens(tokens, max, f);
      if (greedy.length <= 1) {
        lines.push(...(greedy.length ? greedy : ['']));
        continue;
      }
      let lo = measure(paragraph, f) / greedy.length;
      let hi = max;
      let best = greedy;
      for (let i = 0; i < 10 && hi - lo > 0.5; i++) {
        const mid = (lo + hi) / 2;
        const trial = wrapTokens(tokens, mid, f);
        if (trial.length <= greedy.length) {
          best = trial;
          hi = mid;
        } else {
          lo = mid;
        }
      }
      lines.push(...best);
    }
    return lines;
  }

  // Lay out one block of text inside a box bounded by minWidth/maxWidth.
  // The box never truncates: width is bounded, height grows with the lines.
  EC.layoutText = function (text, o) {
    const f = font(o.fontSize, o.fontWeight);
    const lines = wrap(text, o.maxWidth - 2 * o.padX, f);
    const textWidth = Math.max(0, ...lines.map((l) => measure(l, f)));
    const lineHeight = o.fontSize * o.lineHeight;
    return {
      lines,
      font: f,
      lineHeight,
      width: Math.ceil(Math.min(o.maxWidth, Math.max(o.minWidth, textWidth + 2 * o.padX))),
      height: Math.ceil(lines.length * lineHeight + 2 * o.padY),
      metrics: metrics(f),
    };
  };

  EC.measureText = (text, size, weight) => measure(text, font(size, weight));
  EC.fontMetrics = (size, weight) => metrics(font(size, weight));
})(window.EC);
