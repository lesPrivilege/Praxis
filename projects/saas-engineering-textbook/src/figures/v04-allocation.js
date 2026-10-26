(function () {
  var K;
  // Units in fixed unit-ID order; prices in 分 (synthetic, as in the prose).
  var UNITS = [
    { id: 0, name: '茶杯 1', sku: 'cup', price: 4000 },
    { id: 1, name: '茶杯 2', sku: 'cup', price: 4000 },
    { id: 2, name: '茶杯 3', sku: 'cup', price: 4000 },
    { id: 3, name: '杯盖 1', sku: 'lid', price: 1000 },
    { id: 4, name: '杯盖 2', sku: 'lid', price: 1000 },
  ];
  var DISCOUNT = 1001, FEE = 260;

  // Largest remainder with integer arithmetic; ties broken by unit ID.
  function allocate() {
    var total = 0;
    UNITS.forEach(function (u) { total += u.price; });
    var floorSum = 0;
    var rows = UNITS.map(function (u) {
      var num = DISCOUNT * u.price;
      var q = Math.floor(num / total);
      floorSum += q;
      return { u: u, q: q, rem: num % total };
    });
    var left = DISCOUNT - floorSum;
    var order = rows.slice().sort(function (a, b) { return b.rem - a.rem || a.u.id - b.u.id; });
    rows.forEach(function (r) { r.extra = 0; });
    for (var i = 0; i < left; i++) order[i].extra = 1;
    rows.forEach(function (r) { r.disc = r.q + r.extra; r.paid = r.u.price - r.disc; });
    return { total: total, floorSum: floorSum, left: left, rows: rows };
  }

  function remText(rem, total) {
    // remainder as a decimal fraction of 1 分; exact for this example (0 or 0.5)
    if (rem === 0) return '0';
    return String(rem / total);
  }

  var STEPS = ['原价权重', '整数部分', '余数比较', '尾差去向'];

  window.FIGURES['v04-allocation'] = function (body) {
    K = window.FigKit;
    var A = allocate();
    var mount = body.querySelector('.mount');
    var stage = K.h('div', { class: 'stage' });
    mount.appendChild(stage);

    // ---- (a) allocation steps ----
    var pa = K.h('section', { class: 'part' });
    pa.appendChild(K.h('p', { class: 'part-title' }, '一　分配过程'));
    stage.appendChild(pa);
    var tableA = K.h('table', { class: 'state-table' });
    var noteA = K.h('p', { class: 'note step-note', 'aria-live': 'polite' });
    var stepHost = K.h('div');
    pa.appendChild(stepHost);
    pa.appendChild(K.h('div', { class: 'table-wrap' })).appendChild(tableA);
    pa.appendChild(noteA);

    var NOTES_A = [
      '总原价为 3 × 4,000 + 2 × 1,000 = ' + K.fmt(A.total) + ' 分。每个 unit 按原价占总原价的权重分优惠：1,001 × 原价 / 14,000。',
      '用整数乘法和整除取整数部分：茶杯各 286 分，杯盖各 71 分，合计 ' + K.fmt(A.floorSum) + ' 分，还剩 ' + A.left + ' 分未分。',
      '茶杯的 1,001 × 4,000 / 14,000 恰为 286，余数为 0；两只杯盖各应得 71.5 分，余数同为 0.5，形成平手。',
      '剩下的 1 分给余数最大者；两只杯盖平手，按固定 unit ID 排序，杯盖 1 得到这 1 分。最终优惠为 286、286、286、72、71，合计 1,001 分；实付合计 12,999 分。',
    ];
    // which column each step reveals: 0 weight, 1 floor, 2 remainder, 3 final discount + paid
    function renderA(s) {
      function cell(col, html) {
        var shown = s >= col;
        var cls = 'n' + (shown ? (s === col ? ' chg' : '') : ' hide');
        return '<td class="' + cls + '">' + (shown ? html : '—') + '</td>';
      }
      var head = '<thead><tr><th>unit</th><th class="n">原价权重</th><th class="n">整数部分</th><th class="n">余数</th><th class="n">优惠</th><th class="n">实付</th></tr></thead>';
      var rows = A.rows.map(function (r) {
        return '<tr><td>' + r.u.name + '</td>' +
          cell(0, K.fmt(r.u.price) + ' / ' + K.fmt(A.total)) +
          cell(1, r.q) +
          cell(2, remText(r.rem, A.total)) +
          cell(3, r.disc + (r.extra ? ' <span class="flag">（+1）</span>' : '')) +
          cell(3, K.fmt(r.paid)) + '</tr>';
      }).join('');
      var paidSum = 0, discSum = 0;
      A.rows.forEach(function (r) { paidSum += r.paid; discSum += r.disc; });
      var total = '<tr class="total"><td>合计</td>' +
        cell(0, K.fmt(A.total) + ' / ' + K.fmt(A.total)) + cell(1, K.fmt(A.floorSum)) + cell(2, '剩 ' + A.left + ' 分') +
        cell(3, K.fmt(discSum)) + cell(3, K.fmt(paidSum)) + '</tr>';
      tableA.innerHTML = head + '<tbody>' + rows + total + '</tbody>';
      noteA.textContent = NOTES_A[s];
    }
    K.stepper(stepHost, STEPS, renderA);

    // ---- (b) refunds against the snapshot ----
    var pb = K.h('section', { class: 'part' });
    pb.appendChild(K.h('p', { class: 'part-title' }, '二　按快照退款'));
    pb.appendChild(K.h('p', { class: 'note' }, '点选要退回的商品。同规格商品无法逐件辨认，本例把每次退货归属到该规格中尚未退的最小 unit ID。'));
    stage.appendChild(pb);
    var pick = K.h('div', { class: 'pick', role: 'group', 'aria-label': '选择退回的商品' });
    pb.appendChild(pick);
    var ctr = K.h('div', { class: 'fig-controls' });
    pb.appendChild(ctr);
    var priceLine = K.h('p', { class: 'note' });
    pb.appendChild(priceLine);
    var readB = K.h('dl', { class: 'sums readout', 'aria-live': 'polite' });
    pb.appendChild(readB);
    var mapNote = K.h('p', { class: 'note', 'aria-live': 'polite' });
    pb.appendChild(mapNote);

    pb.appendChild(K.h('p', { class: 'note' }, '两只杯盖若各自取整，整单优惠就不再等于 1,001 分。金额单位为分。'));
    var wrong = K.h('table', { class: 'state-table' });
    wrong.innerHTML = '<thead><tr><th>做法</th><th class="n">杯盖 1</th><th class="n">杯盖 2</th><th class="n">整单优惠</th><th>结果</th></tr></thead><tbody>' +
      '<tr><td>最大余数法</td><td class="n">72</td><td class="n">71</td><td class="n">1,001</td><td>守恒</td></tr>' +
      '<tr><td>各自四舍五入</td><td class="n">72</td><td class="n">72</td><td class="n">1,002</td><td class="warn">多优惠 1 分</td></tr>' +
      '<tr><td>各自舍去</td><td class="n">71</td><td class="n">71</td><td class="n">1,000</td><td class="warn">少优惠 1 分</td></tr></tbody>';
    pb.appendChild(K.h('div', { class: 'table-wrap' })).appendChild(wrong);

    var returned = {}; // unit id -> true
    var lastId = null, lastClicked = null;
    var raised = false;
    var unitBtns = A.rows.map(function (r) {
      var b = K.h('button', { type: 'button' });
      b.addEventListener('click', function () { returnSku(r.u.sku, r.u.id); });
      pick.appendChild(b);
      return b;
    });
    function returnSku(sku, clickedId) {
      for (var i = 0; i < A.rows.length; i++) {
        var u = A.rows[i].u;
        if (u.sku === sku && !returned[u.id]) { returned[u.id] = true; lastId = u.id; lastClicked = clickedId; break; }
      }
      renderB();
    }
    var reset = K.h('button', { type: 'button' }, '清空退货');
    reset.addEventListener('click', function () { returned = {}; lastId = lastClicked = null; renderB(); });
    var sample = K.h('button', { type: 'button' }, '载入正文示例');
    sample.addEventListener('click', function () {
      returned = {}; lastId = lastClicked = null;
      returnSku('cup', 0); returnSku('lid', 3);
      lastId = lastClicked = null; renderB();
    });
    ctr.appendChild(sample);
    ctr.appendChild(reset);
    K.toggle(ctr, '杯盖目录价改为 1,200 分', function (on) { raised = on; renderB(); });

    function refundTotal() {
      var t = 0;
      A.rows.forEach(function (r) { if (returned[r.u.id]) t += r.paid; });
      return t;
    }
    function renderB() {
      A.rows.forEach(function (r, i) {
        var b = unitBtns[i];
        var done = !!returned[r.u.id];
        b.disabled = done;
        b.className = r.u.id === lastId ? 'last' : '';
        b.innerHTML = r.u.name + '<small>' + (done ? '已退 ' + K.fmt(r.paid) + ' 分' : '实付 ' + K.fmt(r.paid) + ' 分') + '</small>';
        b.setAttribute('aria-label', r.u.name + (done ? '，已退 ' : '，实付 ') + r.paid + ' 分');
      });
      priceLine.innerHTML = '当前目录价：茶杯 4,000 分，杯盖 ' + (raised ? '<span class="flag">1,200</span>' : '1,000') + ' 分。' +
        (raised ? '退款仍读接受订单时的快照，金额不变。' : '');
      var list = A.rows.filter(function (r) { return returned[r.u.id]; });
      var R = refundTotal();
      readB.innerHTML = (list.length ? list.map(function (r) {
        return '<dt>' + r.u.name + '</dt><dd class="num">' + K.fmt(r.paid) + '</dd>';
      }).join('') : '<dt>尚未退货</dt><dd class="num">0</dd>') +
        '<dt>累计退款</dt><dd class="num res">' + K.fmt(R) + ' 分</dd>';
      if (lastId != null && lastClicked !== lastId) {
        mapNote.innerHTML = '点选的是' + UNITS[lastClicked].name + '，退货归属到<span class="flag">' + UNITS[lastId].name + '</span>（该规格中尚未退的最小 unit ID）。';
      } else if (lastId != null) {
        mapNote.innerHTML = '退货归属到<span class="flag">' + UNITS[lastId].name + '</span>，退款取它在快照中的实付。';
      } else {
        mapNote.textContent = '';
      }
      renderC(R);
    }

    // ---- (c) net pending settlement ----
    var pc = K.h('section', { class: 'part' });
    pc.appendChild(K.h('p', { class: 'part-title' }, '三　净待结算额'));
    stage.appendChild(pc);
    var readC = K.h('dl', { class: 'sums readout', 'aria-live': 'polite' });
    pc.appendChild(readC);
    var noteC = K.h('p', { class: 'note' });
    pc.appendChild(noteC);
    function renderC(R) {
      var paidSum = 0;
      A.rows.forEach(function (r) { paidSum += r.paid; });
      var net = paidSum - R - FEE;
      readC.innerHTML =
        '<dt>收款</dt><dd class="num">' + K.fmt(paidSum) + '</dd>' +
        '<dt>减 退款</dt><dd class="num">' + K.fmt(R) + '</dd>' +
        '<dt>减 支付手续费（不退）</dt><dd class="num">' + K.fmt(FEE) + '</dd>' +
        '<dt>净待结算额</dt><dd class="num res">' + K.fmt(net) + ' 分</dd>';
      noteC.textContent = '顾客净支付额是收款减退款，即 ' + K.fmt(paidSum - R) + ' 分，不扣手续费；净待结算额 ' + K.fmt(net) +
        ' 分是同一合成结算批次的净额；两者都未扣除成本和其他费用，不是利润。';
    }

    sample.click();
  };
})();
