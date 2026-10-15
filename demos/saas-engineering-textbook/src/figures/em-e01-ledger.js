(function () {
  var K;
  var STEPS = ['承诺获批', '收货与验收', '发票暂缓', '发票修订', '取得付款资格', '付款授权', '结果待核对', '付款结算'];
  var ROWS = ['请购 REQ-17', '采购单 PO-17/L1', '收货 RCV-9', '验收 INS-9', '发票 INV-9', '匹配分配', '付款 PAY-17'];
  // state of each row at each step; later steps inherit unless overridden
  var CHANGES = [
    { 0: '版本 1 已批准：12 台 × 80,000 分 = 960,000 分', 1: '已发出，批准金额 960,000 分' },
    { 2: '到货 10 台', 3: '合格 9 台，待检 1 台' },
    { 4: '版本 1：10 台，800,000 分；暂缓，可分配合格量 9，缺口 1' },
    { 4: '版本 2：9 台，720,000 分；版本 1 标记为被替代' },
    { 5: 'MATCH 占用 9 台；可用合格量 0' },
    { 6: '已授权 720,000 分，操作已保存，待发送' },
    { 6: '银行受理后连接中断：结果待核对，按同一付款参考号查询' },
    { 6: '已结算，外部交易引用已保存' },
  ];
  var NOTES = [
    '预算负责人批准的是版本 1。单价若改成 820.00 元，就形成新版本，原批准不再支持新承诺。',
    '9 + 1 + 2 = 12。列表显示“收货 10/12”是正确的摘要，却不足以决定能否付款。',
    '会计不能把数量改成 9 来制造匹配，也不能把待检改成合格。',
    '供应商出具有依据的修订；版本 1 仍留在记录中。',
    '应付服务在一个本地事务里重读版本、检查余额并占用 9 台，此后可以进入付款授权。',
    '资金人员授权付款，付款服务先保存操作和待发送记录，再发送。',
    '恢复任务按同一付款参考号查询，不新建第二笔付款。',
    '9 台对应的款项已结算；采购单仍保留 1 台待检、2 台待收。',
  ];
  function unitState(step, i) {
    if (i >= 10) return step >= 1 ? 'missing' : 'ordered';
    if (step < 1) return 'ordered';
    if (i === 9) return 'pending';
    if (step >= 7) return 'settled';
    if (step >= 4) return 'allocated';
    return 'passed';
  }
  var LEG = { ordered: '已承诺', missing: '尚未收到', pending: '待检', passed: '合格未分配', allocated: '已分配', settled: '已结算' };
  window.FIGURES['em-e01-ledger'] = function (body) {
    K = window.FigKit;
    var mount = body.querySelector('.mount');
    var stage = K.h('div', { class: 'stage' });
    var strip = K.h('div', { class: 'units', role: 'img' });
    var legend = K.h('p', { class: 'unit-legend note' });
    var table = K.h('table', { class: 'state-table' });
    var note = K.h('p', { class: 'note step-note' });
    stage.appendChild(strip);
    stage.appendChild(legend);
    stage.appendChild(K.h('div', { class: 'table-wrap' })).appendChild(table);
    stage.appendChild(note);
    K.stepper(mount, STEPS, function (s) {
      var state = {};
      for (var j = 0; j <= s; j++) for (var r in CHANGES[j]) state[r] = CHANGES[j][r];
      var counts = {};
      var html = '';
      for (var i = 0; i < 12; i++) {
        var st = unitState(s, i);
        counts[st] = (counts[st] || 0) + 1;
        html += '<span class="unit u-' + st + '" title="' + LEG[st] + '"></span>';
      }
      strip.innerHTML = html;
      strip.setAttribute('aria-label', Object.keys(counts).map(function (k) { return LEG[k] + ' ' + counts[k] + ' 台'; }).join('，'));
      legend.innerHTML = Object.keys(LEG).filter(function (k) { return counts[k]; }).map(function (k) {
        return '<span class="key"><span class="unit u-' + k + '"></span>' + LEG[k] + ' <b class="num">' + counts[k] + '</b></span>';
      }).join('');
      table.innerHTML = '<thead><tr><th>记录</th><th>当前状态</th></tr></thead><tbody>' + ROWS.map(function (row, r) {
        var changed = CHANGES[s][r] != null;
        return '<tr' + (changed ? ' class="changed"' : '') + '><td>' + row + '</td><td>' + (state[r] || '<span class="empty">尚未创建</span>') + '</td></tr>';
      }).join('') + '</tbody>';
      note.textContent = NOTES[s];
    });
    mount.appendChild(stage);
  };
})();
