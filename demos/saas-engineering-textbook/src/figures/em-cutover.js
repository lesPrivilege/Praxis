(function () {
  var STEPS = ['19:30', '19:35', '19:45', '20:00', '20:10', '20:15'];
  var ROWS = [
    ['业务负责人', '冻结新提交；旧执行器停止领取新操作', '确认无新增领取，已有在途操作清单固定'],
    ['数据团队', '导出最终增量与旧新 ID 映射', '20 项全部具有去向；附件与引用可访问'],
    ['—', '新系统导入并核对状态、批准与操作身份', '12 ready、5 awaiting_acceptance、2 unknown、1 blocked'],
    ['有权运行人员', '核对两项 unknown', '按原键查询，未产生新业务意图'],
    ['—', '其中一项查到已应用，另一项仍无法确认', '分布变为 12 ready、6 awaiting_acceptance、1 unknown、1 blocked'],
    ['负责人', '决定开放明确可接管的工作', 'unknown 与 blocked 保持专门责任人，新旧执行方没有重叠'],
  ];
  var KEYS = ['ready', 'awaiting', 'unknown', 'blocked'];
  var NAMES = { ready: 'ready', awaiting: 'awaiting_acceptance', unknown: 'unknown', blocked: 'blocked' };
  var NOTES = [
    '冻结后，在途清单不再增加。此时 20 项仍在旧平台，分别处于四组状态。',
    '导出与映射完成前，新系统不执行任何一项。20 项都必须有去向。',
    '导入后逐项核对：12 项批准仍有效；5 项携带外部操作引用与效果版本；2 项携带原操作身份；1 项缺授权附件，不能改成已批准。',
    '两项 unknown 按原操作键查询，不新建操作。',
    '查到已应用的一项转入待接收；另一项仍为 unknown。总数仍为 20。',
    '18 项（12 ready + 6 awaiting_acceptance）可常规推进，余下 2 项作为异常责任整体移交。90% 是可常规推进的比例，不是完成率：20 项仍都未关闭，ready 尚未执行，awaiting_acceptance 还待负责人接收。',
  ];
  function dist(s) { return s >= 4 ? { ready: 12, awaiting: 6, unknown: 1, blocked: 1 } : { ready: 12, awaiting: 5, unknown: 2, blocked: 1 }; }
  window.FIGURES['em-cutover'] = function (body) {
    var K = window.FigKit;
    var mount = body.querySelector('.mount');
    var stage = K.h('div', { class: 'stage' });
    var where = K.h('p', { class: 'where' });
    var cells = K.h('div', { class: 'cells', role: 'img' });
    var legend = K.h('p', { class: 'legend', 'aria-live': 'polite' });
    var split = K.h('p', { class: 'split' });
    var table = K.h('table', { class: 'state-table' });
    var note = K.h('p', { class: 'note step-note' });
    [where, cells, legend, split].forEach(function (el) { stage.appendChild(el); });
    stage.appendChild(K.h('div', { class: 'table-wrap' })).appendChild(table);
    stage.appendChild(note);
    K.stepper(mount, STEPS, function (s) {
      var d = dist(s), old = s < 2, html = '', idx = 0;
      where.textContent = old ? '所在平台：旧平台' : '所在平台：新系统';
      KEYS.forEach(function (k, ki) {
        for (var i = 0; i < d[k]; i++) {
          // the unknown item resolved at 20:10 is the last awaiting cell
          var hot = (s === 3 && k === 'unknown') || (s === 4 && k === 'awaiting' && i === d[k] - 1) || (s === 4 && k === 'unknown');
          var gapCls = (s === 5 && ki === 2 && i === 0) ? ' gap' : '';
          html += '<span class="cell c-' + k + (old ? ' old' : '') + (hot ? ' hot' : '') + gapCls + '"></span>';
          idx++;
        }
      });
      cells.innerHTML = html;
      cells.setAttribute('aria-label', KEYS.map(function (k) { return d[k] + ' ' + NAMES[k]; }).join('、') + '，共 ' + idx + ' 项');
      legend.innerHTML = KEYS.map(function (k) {
        return '<span class="key"><span class="cell c-' + k + '"></span>' + NAMES[k] + ' <b class="num">' + d[k] + '</b></span>';
      }).join('') + '<span class="key">合计 <b class="num">' + (d.ready + d.awaiting + d.unknown + d.blocked) + '</b></span>';
      split.innerHTML = s === 5 ? '可常规推进 <b class="num">18</b> 项（<span class="num">18/20 = 90%</span>）｜异常责任 <b class="num">2</b> 项（1 unknown、1 blocked）' : '';
      split.hidden = s !== 5;
      var r = ROWS[s];
      table.innerHTML = '<thead><tr><th>项目</th><th>内容</th></tr></thead><tbody>' +
        '<tr><td>时间</td><td>' + STEPS[s] + '</td></tr>' +
        '<tr><td>负责方</td><td>' + r[0] + '</td></tr>' +
        '<tr><td>动作</td><td>' + r[1] + '</td></tr>' +
        '<tr class="changed"><td>继续条件</td><td>' + r[2] + '</td></tr></tbody>';
      note.textContent = NOTES[s];
    });
    mount.appendChild(stage);
  };
})();
