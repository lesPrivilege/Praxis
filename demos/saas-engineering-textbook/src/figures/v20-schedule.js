(function () {
  var K;
  // Synthetic inputs from the prose. Minutes from 09:00, half-open intervals.
  var RES = [
    { key: 'lin', name: '林', windows: [[0, 120], [180, 300]], install: true },
    { key: 'chen', name: '陈', windows: [[60, 240]], install: false },
  ];
  var INSTALL = 90, BREAK = [40, 50], STABLE = 30, CALIB = 60;
  var RATE = 120, PARTS = 200; // 记账单位 per 60 minutes; parts

  function iv(a) { return '[' + a[0] + ',' + a[1] + ')'; }
  function clock(m) { var h = 9 + Math.floor(m / 60), mm = m % 60; return (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm; }

  // Plan the two tasks. withBreak: install has the 10-minute pause. earliestFree: ignore the dependency.
  function plan(earliestFree, withBreak) {
    var segs = withBreak ? [[0, BREAK[0]], [BREAK[1], INSTALL + (BREAK[1] - BREAK[0])]] : [[0, INSTALL]];
    var installEnd = segs[segs.length - 1][1];
    var stable = [installEnd, installEnd + STABLE];
    var earliest = stable[1];
    var options = RES.map(function (r) {
      var busyUntil = r.install ? installEnd : 0;
      for (var i = 0; i < r.windows.length; i++) {
        var w = r.windows[i];
        var s = Math.max(w[0], busyUntil, earliestFree ? 0 : earliest);
        if (s + CALIB <= w[1]) return { res: r, iv: [s, s + CALIB] };
      }
      return null;
    }).filter(Boolean);
    options.sort(function (a, b) { return a.iv[1] - b.iv[1]; });
    var chosen = options[0];
    return {
      segs: segs, rest: withBreak ? BREAK : null, installEnd: installEnd, stable: stable, earliest: earliest,
      calib: chosen, alt: options[1] || null, violates: chosen.iv[0] < earliest,
    };
  }

  // ---- SVG geometry ----
  var W = 652, L = 100, S = 1.74, H = 250;
  var ROWS = { lin: { y: 34, h: 44 }, chen: { y: 88, h: 44 }, dev: { y: 142, h: 34 } };
  function X(m) { return L + m * S; }
  function rect(a, row, cls, extra) {
    return '<rect class="' + cls + '" x="' + X(a[0]) + '" y="' + row.y + '" width="' + (a[1] - a[0]) * S + '" height="' + row.h + '" rx="3"' + (extra || '') + '/>';
  }
  function label(a, row, cls, text) {
    return '<text class="' + cls + '" x="' + (X(a[0]) + X(a[1])) / 2 + '" y="' + (row.y + row.h / 2 + 7) + '" text-anchor="middle">' + text + '</text>';
  }

  function drawGantt(p) {
    var o = [];
    o.push('<text class="row-t" x="0" y="' + (ROWS.lin.y + 29) + '">林</text>');
    o.push('<text class="row-t" x="0" y="' + (ROWS.chen.y + 29) + '">陈</text>');
    o.push('<text class="row-t" x="0" y="' + (ROWS.dev.y + 24) + '">设备稳定</text>');
    RES.forEach(function (r) { r.windows.forEach(function (w) { o.push(rect(w, ROWS[r.key], 'win')); }); });
    // install
    p.segs.forEach(function (s) { o.push(rect(s, ROWS.lin, 'work')); o.push(label(s, ROWS.lin, 'work-t', '安装')); });
    if (p.rest) {
      var r = ROWS.lin;
      o.push('<rect class="rest" x="' + X(p.rest[0]) + '" y="' + (r.y + 4) + '" width="' + (p.rest[1] - p.rest[0]) * S + '" height="' + (r.h - 8) + '"/>');
    }
    // stabilisation wait
    o.push(rect(p.stable, ROWS.dev, 'wait')); o.push(label(p.stable, ROWS.dev, 'wait-t', '稳定'));
    // alternative and chosen calibration
    if (p.alt) { o.push(rect(p.alt.iv, ROWS[p.alt.res.key], 'alt')); o.push(label(p.alt.iv, ROWS[p.alt.res.key], 'alt-t', '备选')); }
    var c = p.calib, cr = ROWS[c.res.key];
    if (p.violates) {
      o.push(rect(c.iv, cr, 'bad')); o.push(label(c.iv, cr, 'bad-t', '违反依赖'));
    } else {
      o.push(rect(c.iv, cr, 'sel')); o.push(label(c.iv, cr, 'work-t', '校准'));
    }
    // earliest start allowed by the dependency
    o.push('<line class="mark" x1="' + X(p.earliest) + '" x2="' + X(p.earliest) + '" y1="26" y2="' + (ROWS.dev.y + ROWS.dev.h) + '"/>');
    o.push('<text class="mark-t" x="' + (X(p.earliest) + 4) + '" y="20">校准最早 ' + p.earliest + '</text>');
    // axis
    var ay = 192;
    o.push('<line class="axis" x1="' + L + '" x2="' + X(300) + '" y1="' + ay + '" y2="' + ay + '"/>');
    for (var m = 0; m <= 300; m += 60) {
      o.push('<line class="axis" x1="' + X(m) + '" x2="' + X(m) + '" y1="' + ay + '" y2="' + (ay + 5) + '"/>');
      o.push('<text class="tick-t" x="' + X(m) + '" y="' + (ay + 23) + '" text-anchor="middle">' + m + '</text>');
      o.push('<text class="clock-t" x="' + X(m) + '" y="' + (ay + 46) + '" text-anchor="middle">' + clock(m) + '</text>');
    }
    o.push('<text class="tick-t" x="0" y="' + (ay + 23) + '">分钟</text>');
    o.push('<text class="tick-t" x="0" y="' + (ay + 46) + '">钟点</text>');
    return o.join('');
  }

  function planText(p) {
    var items = [];
    if (p.rest) {
      items.push('安装：林 ' + iv(p.segs[0]) + ' 工作、' + iv(p.rest) + ' 休息、' + iv(p.segs[1]) + ' 工作，实际工作仍为 90 分钟，结束晚 10 分钟。');
    } else {
      items.push('安装：林 ' + iv(p.segs[0]) + '。');
    }
    items.push('稳定期：' + iv(p.stable) + '，校准最早从第 ' + p.earliest + ' 分钟开始。');
    var c = p.calib;
    if (p.violates) {
      items.push('<span class="warn">校准：' + c.res.name + ' ' + iv(c.iv) + '。它不与' + c.res.name + '的其他任务重叠，但安装在第 ' + p.installEnd + ' 分钟才结束，违反依赖。</span>');
    } else {
      items.push('校准：<span class="flag">' + c.res.name + ' ' + iv(c.iv) + '</span>' +
        (p.rest ? '，仍可行。' : '，比' + p.alt.res.name + '的 ' + iv(p.alt.iv) + ' 早，预计 ' + clock(c.iv[1]) + ' 完成。'));
    }
    if (p.rest) items.push('客户已确认的校准时间受影响：系统标出这项预约，由调度确认后再改期，不自动顺延。');
    return items.map(function (t) { return '<li>' + t + '</li>'; }).join('');
  }

  // ---- billing ----
  var ACTUAL = [[0, 40], [50, 100]]; // install in_progress intervals from the field record
  var MODES = [
    { key: 'ok', label: '按工作区间' },
    { key: 'elapsed', label: '按经过时间' },
    { key: 'dup', label: '按未去重事件' },
  ];
  function billRows(mode) {
    var rows;
    if (mode === 'elapsed') rows = [['安装 起止 [0,100)', 100]];
    else rows = ACTUAL.map(function (a) { return ['安装 工作段 ' + iv(a), a[1] - a[0]]; });
    if (mode === 'dup') rows.push(['安装 工作段 [50,100)（重复事件）', 50, true]);
    rows.push(['校准', CALIB]);
    return rows;
  }
  function labor(min) { return min * RATE / 60; }

  window.FIGURES['v20-schedule'] = function (body) {
    K = window.FigKit;
    var mount = body.querySelector('.mount');
    var stage = K.h('div', { class: 'stage' });
    mount.appendChild(stage);

    // (a) schedule
    var pa = K.h('section', { class: 'part' });
    pa.appendChild(K.h('p', { class: 'part-title' }, '一　排程'));
    stage.appendChild(pa);
    var ctr = K.h('div', { class: 'fig-controls' });
    pa.appendChild(ctr);
    var svgWrap = K.h('div');
    pa.appendChild(svgWrap);
    var list = K.h('ul', { class: 'plan', 'aria-live': 'polite' });
    pa.appendChild(list);
    var st = { free: false, brk: false };
    function renderA() {
      var p = plan(st.free, st.brk);
      list.innerHTML = planText(p);
      svgWrap.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img">' + drawGantt(p) + '</svg>';
      svgWrap.firstChild.setAttribute('aria-label', '排程甘特图。' + list.textContent);
      return p;
    }
    K.toggle(ctr, '只按最早空闲排程', function (on) { st.free = on; renderA(); });
    K.toggle(ctr, '安装中途休息 10 分钟', function (on) { st.brk = on; renderA(); });
    renderA();

    // (b) billing
    var pb = K.h('section', { class: 'part' });
    pb.appendChild(K.h('p', { class: 'part-title' }, '二　计费'));
    pb.appendChild(K.h('p', { class: 'note' }, '按 booking 事件排序并验证转换后，只累加 in_progress 区间；休息 [40,50) 不计。人工按每 60 分钟 120 记账单位计算。'));
    stage.appendChild(pb);
    var grp = K.h('div', { class: 'fig-controls group', role: 'group', 'aria-label': '计费口径' });
    pb.appendChild(grp);
    var tb = K.h('table', { class: 'state-table' });
    pb.appendChild(K.h('div', { class: 'table-wrap' })).appendChild(tb);
    var noteB = K.h('p', { class: 'note readout', 'aria-live': 'polite' });
    pb.appendChild(noteB);
    var correct = 0;
    billRows('ok').forEach(function (r) { correct += r[1]; });
    var correctDue = labor(correct) + PARTS;
    var btns = MODES.map(function (m) {
      var b = K.h('button', { type: 'button', 'aria-pressed': 'false' }, m.label);
      b.addEventListener('click', function () { renderB(m.key); });
      grp.appendChild(b);
      return b;
    });
    function renderB(mode) {
      MODES.forEach(function (m, i) { btns[i].setAttribute('aria-pressed', String(m.key === mode)); });
      var rows = billRows(mode), min = 0;
      rows.forEach(function (r) { min += r[1]; });
      var due = labor(min) + PARTS;
      tb.innerHTML = '<thead><tr><th>计入的区间</th><th class="n">分钟</th></tr></thead><tbody>' +
        rows.map(function (r) { return '<tr' + (r[2] || mode === 'elapsed' && r[1] === 100 ? ' class="changed"' : '') + '><td>' + r[0] + '</td><td class="n">' + r[1] + '</td></tr>'; }).join('') +
        '<tr class="total"><td>合计分钟</td><td class="n">' + min + '</td></tr>' +
        '<tr><td>人工 ' + min + ' × 120 / 60</td><td class="n">' + labor(min) + '</td></tr>' +
        '<tr><td>零件</td><td class="n">' + PARTS + '</td></tr>' +
        '<tr class="total"><td>应收（记账单位）</td><td class="n">' + due + '</td></tr></tbody>';
      var diff = due - correctDue;
      noteB.innerHTML = diff === 0
        ? '安装 40 + 50 = 90 分钟，校准 60 分钟，合计 150 分钟；人工 300，加零件 200，应收 500。'
        : (mode === 'elapsed'
          ? '把休息的 10 分钟也算进安装，多计 <span class="flag">10 × 120 / 60 = ' + diff + '</span>。'
          : '同一个 50 分钟工作段重复上传，又被加了一次，多计 <span class="flag">' + diff + '</span>。区间累加以事件身份和有效转换为前提。');
    }
    renderB('ok');

    // (c) payments
    var pc = K.h('section', { class: 'part' });
    pc.appendChild(K.h('p', { class: 'part-title' }, '三　收款'));
    stage.appendChild(pc);
    var stepHost = K.h('div');
    pc.appendChild(stepHost);
    var readC = K.h('p', { class: 'note readout', 'aria-live': 'polite' });
    pc.appendChild(readC);
    var PAY = [0, 300, 200];
    K.stepper(stepHost, ['开票 500', '到账 300', '再确认到账 200'], function (s) {
      var got = 0;
      for (var i = 0; i <= s; i++) got += PAY[i];
      var owe = correctDue - got;
      readC.innerHTML = '已收 <b class="num">' + got + '</b>，仍欠 <b class="num' + (s ? ' flag' : '') + '">' + owe + '</b>。' +
        (owe === 0 ? '全部到账已确认，发票为 paid。' : '发票尚未 paid；booking、Posted 标签和发票送达都不能替代到账凭据。');
    });
  };
})();
