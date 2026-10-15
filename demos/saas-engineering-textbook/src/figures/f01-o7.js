(function () {
  var PRICE = 40;
  var SUMMARY = ['已确认 2 次；待处理 1 次', '服务义务已处理；退款待确认', '服务义务已处理；退款已到账'];
  var SINGLE = ['订单进行中', '订单已结束', '订单已结束'];
  var R1 = ['尚未建立', 'R1，40，待确认', 'R1，40，已确认到账'];
  var DUTY = ['S3 待处理，尚未执行', 'S3 已取消，不再执行', 'S3 已取消，不再执行'];
  var MSG = [
    '',
    '服务检查 S3 尚未执行，保存取消决定；另建退款请求 R1，等待外部结果。',
    '外部回执确认 R1 到账；数量与服务义务不变，只有退款事实改变。'
  ];

  window.FIGURES['f01-o7'] = function (body) {
    var K = window.FigKit;
    var mount = body.querySelector('.mount');
    var phase = 0, prev = 0, single = false, base = '';

    var controls = K.h('div', { class: 'fig-controls' });
    var bCancel = btn('取消 S3');
    var bConfirm = btn('确认退款到账');
    var bTryS1 = btn('尝试取消 S1');
    var bReset = btn('重置');
    [bCancel, bConfirm, bTryS1, bReset].forEach(function (b) { controls.appendChild(b); });
    K.toggle(controls, '只显示单一总状态', function (on) { single = on; render(null); });

    var stage = K.h('div', { class: 'stage' });
    var items = K.h('div', { class: 'o7-items', role: 'group', 'aria-label': '订单 O7 的子项' });
    var inv = K.h('p', { class: 'o7-inv', 'aria-live': 'polite' });
    var facts = K.h('dl', { class: 'o7-facts', 'aria-live': 'polite' });
    var singleEl = K.h('p', { class: 'o7-single', 'aria-live': 'polite' });
    var table = K.h('table', { class: 'state-table' });
    var wrap = K.h('div', { class: 'table-wrap' });
    var msg = K.h('p', { class: 'note o7-msg', 'aria-live': 'polite' });
    wrap.appendChild(table);
    [items, inv, facts, singleEl, wrap, msg].forEach(function (el) { stage.appendChild(el); });
    mount.appendChild(controls);
    mount.appendChild(stage);

    bCancel.addEventListener('click', function () { if (phase === 0) { prev = 0; phase = 1; render(MSG[1]); } });
    bConfirm.addEventListener('click', function () { if (phase === 1) { prev = 1; phase = 2; render(MSG[2]); } });
    bTryS1.addEventListener('click', function () {
      prev = phase;
      render('拒绝：S1 已执行，取消的前提“尚未执行”不成立；数量、退款与汇总均不变。');
    });
    bReset.addEventListener('click', function () { prev = 0; phase = 0; render(''); });

    function btn(text) { var b = K.h('button', { type: 'button' }); b.textContent = text; return b; }
    function hl(v, changed) { return changed ? '<span class="flag">' + v + '</span>' : v; }

    function render(message) {
      if (message === null) message = base; else base = message;
      var fresh = phase !== prev;
      var pending = phase === 0 ? 1 : 0, cancelled = phase === 0 ? 0 : 1;
      var refundDue = cancelled * PRICE, refundConfirmed = phase === 2 ? PRICE : 0;

      var html = '';
      ['S1', 'S2', 'S3'].forEach(function (id) {
        var cls = 'o7-item', state;
        if (id !== 'S3') state = '已确认';
        else if (phase === 0) { state = '待处理'; cls += ' is-pending'; }
        else { state = '已取消'; cls += ' is-cancelled'; }
        if (id === 'S3' && fresh && prev === 0) cls += ' is-changed';
        html += '<div class="' + cls + '"><b>' + id + '</b>' + state + '，' + PRICE + '</div>';
      });
      items.innerHTML = html;

      var qChanged = fresh && prev === 0;
      inv.innerHTML = '已确认 2 + 待处理 ' + hl(pending, qChanged) + ' + 已取消 ' + hl(cancelled, qChanged) + ' = 已订购 3';

      var rChanged = fresh;
      facts.innerHTML =
        '<div><dt>服务义务</dt><dd' + (qChanged ? ' class="changed"' : '') + '>' + DUTY[phase] + '</dd></div>' +
        '<div><dt>退款请求</dt><dd' + (rChanged ? ' class="changed"' : '') + '>' + R1[phase] + '</dd></div>' +
        '<div><dt>订单汇总文字</dt><dd' + (fresh ? ' class="changed"' : '') + '>' + SUMMARY[phase] + '</dd></div>';
      facts.hidden = single;
      singleEl.hidden = !single;
      singleEl.textContent = '总状态：' + SINGLE[phase];

      var rows = [
        ['delivered', 2, 'S1、S2 的确认', false],
        ['pending', pending, phase === 0 ? 'S3 待处理' : '无（S3 已取消）', qChanged],
        ['cancelled', cancelled, phase === 0 ? '无' : 'S3 的取消决定', qChanged],
        ['refund_due', refundDue, phase === 0 ? '无' : '退款规则：取消数量 1 × 40', qChanged],
        ['refund_confirmed', refundConfirmed, phase === 2 ? 'R1 的到账回执' : '无', fresh && prev === 1]
      ];
      table.innerHTML = '<thead><tr><th>汇总值</th><th>数值</th><th>来源</th></tr></thead><tbody>' +
        rows.map(function (r) {
          return '<tr' + (r[3] && !single ? ' class="changed"' : '') + '><td><code>' + r[0] + '</code></td><td class="num">' + r[1] + '</td><td>' + r[2] + '</td></tr>';
        }).join('') + '</tbody>';
      wrap.hidden = single;

      if (single && phase > 0) message = (message ? message + ' ' : '') + '单一总状态在退款待确认与已到账时都显示“订单已结束”，把义务处理与资金到账混为一谈。';
      msg.textContent = message || '';

      bCancel.disabled = phase !== 0;
      bConfirm.disabled = phase !== 1;
    }
    render('');
  };
})();
