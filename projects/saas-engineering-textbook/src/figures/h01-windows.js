(function () {
  var PAID = 36000, CREDIT = 5000, CANCEL_DAY = 20;
  var LINES = [
    { name: '原 10 席位', A: 27000, s: 0, e: 30 },
    { name: '第 12 天新增 5 席位', A: 9000, s: 12, e: 30, cancellable: true }
  ];
  function clamp(x, lo, hi) { return Math.min(Math.max(x, lo), hi); }
  // Cumulative fulfilled amount of one line by day t. With the cancellation on,
  // the added line's service stops at day 20: it keeps C(20) and accrues nothing after.
  function cum(L, t, cancelled) {
    var tt = (cancelled && L.cancellable) ? Math.min(t, CANCEL_DAY) : t;
    var d = clamp(tt - L.s, 0, L.e - L.s);
    return { d: d, v: Math.floor(L.A * d / (L.e - L.s)), capped: tt < t };
  }

  window.FIGURES['h01-windows'] = function (body) {
    var K = window.FigKit, f = K.fmt;
    var mount = body.querySelector('.mount');
    var t = 20, cancelled = false, refunded = false;

    var controls = K.h('div', { class: 'fig-controls' });
    var id = 'hw-t-' + Math.random().toString(36).slice(2, 7);
    var label = K.h('label', { for: id }, '观察日 t');
    var range = K.h('input', { type: 'range', id: id, min: '12', max: '30', step: '1', value: String(t) });
    var tOut = K.h('output', { for: id, class: 'num', 'aria-live': 'polite' });
    label.appendChild(range);
    label.appendChild(tOut);
    controls.appendChild(label);
    var bCancel = K.toggle(controls, '第 20 天取消新增 5 席位', function (on) {
      cancelled = on;
      if (!on) { refunded = false; bRefund.setAttribute('aria-pressed', 'false'); }
      render();
    });
    var bRefund = K.toggle(controls, '确认退款到账', function (on) { refunded = on; render(); });

    var stage = K.h('div', { class: 'stage' });
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 600 112');
    svg.setAttribute('class', 'hw-bars');
    svg.setAttribute('role', 'img');
    var t1 = K.h('table', { class: 'state-table' });
    var t2 = K.h('table', { class: 'state-table' });
    var w1 = K.h('div', { class: 'table-wrap', 'aria-live': 'polite' });
    var w2 = K.h('div', { class: 'table-wrap', 'aria-live': 'polite' });
    var note = K.h('p', { class: 'note step-note' });
    w1.appendChild(t1); w2.appendChild(t2);
    stage.appendChild(svg);
    stage.appendChild(w1);
    stage.appendChild(K.h('p', { class: 'hw-sub' }, '收费、贷项与现金'));
    stage.appendChild(w2);
    stage.appendChild(note);
    mount.appendChild(controls);
    mount.appendChild(stage);

    // Part 2: rounding comparison (static)
    var round = K.h('div', { class: 'stage', style: 'margin-top:1rem' });
    round.appendChild(K.h('p', { class: 'hw-sub', style: 'margin-top:0' }, '逐日四舍五入与累计后求差：100 分摊到 3 天'));
    var C = [0, 1, 2, 3].map(function (k) { return Math.floor(100 * k / 3); });
    var naive = [1, 2, 3].map(function () { return Math.round(100 / 3); });
    var diff = [1, 2, 3].map(function (k) { return C[k] - C[k - 1]; });
    function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
    var g = '<div class="hw-round" role="table" aria-label="两种分法的逐日金额">' +
      '<span></span><span class="head">第 1 天</span><span class="head">第 2 天</span><span class="head">第 3 天</span><span class="head">合计</span>' +
      '<span>逐日四舍五入</span>' + naive.map(cell).join('') + '<span class="sum">' + sum(naive) + '，<span class="warn">少 1 分</span></span>' +
      '<span>累计后求差</span>' + diff.map(cell).join('') + '<span class="sum">' + sum(diff) + '</span>' +
      '</div><p class="note step-note">累计值 <code>C(0..3)=[' + C.join(',') + ']</code>，相邻相减得 ' + diff.join('、') + '。任意相邻窗口相加仍等于整段 100 分。</p>';
    function cell(v) { return '<span class="cell">' + v + '</span>'; }
    round.insertAdjacentHTML('beforeend', g);
    mount.appendChild(round);

    range.addEventListener('input', function () { t = parseInt(range.value, 10); render(); });

    function x(day) { return 130 + day * 15; }
    function drawBars(rows) {
      var s = '';
      [0, 12, 20, 30].forEach(function (d) {
        s += '<text class="tick" x="' + x(d) + '" y="106" text-anchor="middle">' + d + '</text>';
      });
      rows.forEach(function (r, i) {
        var L = r.L, y = 10 + i * 40, end = (cancelled && L.cancellable) ? CANCEL_DAY : L.e;
        s += '<text class="lab" x="0" y="' + (y + 17) + '">' + L.name + '</text>';
        s += '<rect class="period" x="' + x(L.s) + '" y="' + y + '" width="' + (x(end) - x(L.s)) + '" height="26" rx="2"/>';
        if (end < L.e) s += '<rect class="cut" x="' + x(end) + '" y="' + y + '" width="' + (x(L.e) - x(end)) + '" height="26" rx="2"/>' +
          '<text class="tick" x="' + ((x(end) + x(L.e)) / 2) + '" y="' + (y + 17) + '" text-anchor="middle">已取消</text>';
        var doneEnd = clamp(Math.min(t, end), L.s, end);
        s += '<rect class="done" x="' + x(L.s) + '" y="' + y + '" width="' + (x(doneEnd) - x(L.s)) + '" height="26" rx="2"/>';
      });
      s += '<line class="now" x1="' + x(t) + '" x2="' + x(t) + '" y1="4" y2="92"/>';
      s += '<text class="nowlab" x="' + x(t) + '" y="3" text-anchor="middle" dominant-baseline="hanging">t</text>';
      svg.innerHTML = s;
    }

    function render() {
      tOut.textContent = '第 ' + t + ' 天';
      bRefund.disabled = !cancelled;
      var rows = LINES.map(function (L) { return { L: L, c: cum(L, t, cancelled) }; });
      var done = rows[0].c.v + rows[1].c.v;
      var gross = LINES[0].A + LINES[1].A;
      var net = cancelled ? gross - CREDIT : gross;
      var future = net - done;
      drawBars(rows);
      svg.setAttribute('aria-label', '截至第 ' + t + ' 天，' + rows.map(function (r) { return r.L.name + '已履行 ' + f(r.c.v) + ' 分'; }).join('，'));

      t1.innerHTML = '<thead><tr><th>收费行</th><th>金额与服务期间</th><th class="num">截至第 ' + t + ' 天已履行</th></tr></thead><tbody>' +
        rows.map(function (r) {
          var L = r.L, len = L.e - L.s;
          var period = (cancelled && L.cancellable) ? '<code>[12,30)</code>，服务止于第 20 天' : '<code>[' + L.s + ',' + L.e + ')</code>';
          var formula = 'floor(' + f(L.A) + ' × ' + r.c.d + '/' + len + ') = ' + f(r.c.v) + (r.c.capped ? '，第 20 天后不再累计' : '');
          return '<tr' + (r.c.capped ? ' class="changed"' : '') + '><td>' + L.name + '</td><td>' + f(L.A) + ' 分，' + period +
            '<div class="formula">' + formula + '</div></td><td class="num">' + f(r.c.v) + ' 分</td></tr>';
        }).join('') +
        '<tr class="total"><td>合计</td><td>未来期间 <span class="num">' + f(future) + '</span> 分</td><td class="num">' + f(done) + ' 分</td></tr></tbody>';

      var cashNet = cancelled && refunded ? PAID - CREDIT : PAID;
      var dueText = !cancelled ? '无' : (refunded ? '已确认到账，余 0' : '<span class="pending-val">' + f(CREDIT) + ' 分，待确认</span>');
      var lines2 = [
        ['收费合计', f(gross) + ' 分', '27,000 + 9,000', false],
        ['贷项', cancelled ? '−' + f(CREDIT) + ' 分' : '无', cancelled ? '9,000 × 10/18 = 5,000，退回未提供的 10 天' : '未取消', cancelled],
        ['净收费', f(net) + ' 分', '已履行 ' + f(done) + ' + 未来期间 ' + f(future), cancelled],
        ['已付', f(PAID) + ' 分', '正文给定：到第 20 天累计支付', false],
        ['退款义务', dueText, cancelled ? '对应贷项 5,000 分' : '', cancelled && !refunded],
        ['现金净额', f(cashNet) + ' 分', cancelled && refunded ? '36,000 − 5,000' : (cancelled ? '退款确认前不减少' : '已付金额'), cancelled && refunded]
      ];
      t2.innerHTML = '<thead><tr><th>项目</th><th class="num">金额</th><th>依据</th></tr></thead><tbody>' +
        lines2.map(function (r) {
          return '<tr' + (r[3] ? ' class="changed"' : '') + '><td>' + r[0] + '</td><td class="num">' + r[1] + '</td><td>' + r[2] + '</td></tr>';
        }).join('') + '</tbody>';

      note.textContent = !cancelled
        ? '未来期间金额 = 收费合计 36,000 − 已履行，对应尚未提供的服务；已经收款不说明服务已经完成。'
        : (refunded
          ? '退款已确认：现金净额变为 31,000 分。新增部分已履行的 4,000 分保留，原 10 席位继续履行。'
          : '贷项已批准而退款尚未确认：现金净额仍为 36,000 分，另列 5,000 分退款义务。');
    }
    render();
  };
})();
