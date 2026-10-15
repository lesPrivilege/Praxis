(function () {
  var STEPS = ['提交前', '本地保存后', '外部断线后', '查询核对后', '探测与负责人接收后'];
  var GATES = ['意图已保存', '外部已受理', '效果已确认', '查询投影已同步', '业务已接收'];
  // gate status per step: d = done, p = pending, u = unknown to caller, s = not separately listed in this example
  var GS = ['ppps p', 'dppsp', 'duusp', 'dddsp', 'dddsd'].map(function (x) { return x.replace(/ /g, '').split(''); });
  var ST = { d: '已通过', p: '尚未通过', u: '未知', s: '本例不单列' };
  var CLS = { d: 'done', p: '', u: 'unknown', s: 'skip' };
  var TRUTH = ['worker 上限 4 · 版本 8', 'worker 上限 4 · 版本 8', 'worker 上限 6 · 版本 9', 'worker 上限 6 · 版本 9', 'worker 上限 6 · 版本 9'];
  var KNOWN = ['worker 上限 4 · 版本 8', '已保存 OP-42，待发送', 'unknown', 'OP-42 applied · 版本 9', 'closed'];
  // the "时点" table, verbatim
  var ROWS = [
    ['4，版本 8', '已批准', '可以执行此范围'],
    ['尚未确认变化', '已保存待发送', '已创建操作 OP-42'],
    ['实际为 6，版本 9；调用方尚不知', 'unknown', '结果待核对'],
    ['OP-42 已 applied，版本 9', 'awaiting_acceptance', '配置效果已确认'],
    ['6，版本 9', 'closed', '本次变更已获接收'],
  ];
  var NOTES = [
    'agent 读取告警、方案、当前配置和批准。4→6 与批准一致，窗口有效，当前版本仍为 8。',
    '服务端再验身份、范围、期限和版本，在本地事务内写入操作 OP-42 与 outbox（待发送记录）。外部尚未收到请求。',
    'worker 用同一 OP-42 调用控制系统。控制系统已写成 6、版本 9，却在返回响应前断开。调用方只知道结果未知，应按 OP-42 查询。',
    '控制系统返回 OP-42 的租户、目标、结果版本 9、目标值 6、回执身份和 applied 状态。前提版本 8 来自本地已保存的意图，不是回执字段。回执若只有数字“6”，不足以确认效果：它可能来自另一项未经本次批准的修改。',
    '固定探测由 8/10 通过变为 10/10，绑定已批准并持久化的 SVC-ACCEPT-1 工作政策。负责人检查变更与探测记录后接收，工单关闭。',
  ];
  function probes(label, pass) {
    var h = '<div class="probes" role="img" aria-label="' + label + ' ' + pass + '/10 通过"><span class="lbl">' + label + '</span>';
    for (var i = 0; i < 10; i++) h += '<span class="probe' + (i < pass ? '' : ' fail') + '"></span>';
    return h + '<span class="num">' + pass + '/10</span></div>';
  }
  window.FIGURES['em-e02-gates'] = function (body) {
    var K = window.FigKit;
    var mount = body.querySelector('.mount');
    var cur = 0, alt = false;
    var stage = K.h('div', { class: 'stage' });
    var gates = K.h('ol', { class: 'gates', 'aria-label': '五道门槛' });
    var views = K.h('div', { class: 'views', 'aria-live': 'polite' });
    var table = K.h('table', { class: 'state-table' });
    var detail = K.h('div', { class: 'detail' });
    var altBox = K.h('div', { class: 'alt', 'aria-live': 'polite' });
    var note = K.h('p', { class: 'note step-note' });
    stage.appendChild(gates);
    stage.appendChild(views);
    stage.appendChild(K.h('div', { class: 'table-wrap' })).appendChild(table);
    stage.appendChild(detail);
    stage.appendChild(note);
    stage.appendChild(altBox);
    function render() {
      var s = cur;
      gates.innerHTML = GATES.map(function (g, i) {
        var st = GS[s][i];
        var now = st !== 's' && st !== GS[Math.max(0, s - 1)][i] && s > 0;
        return '<li class="' + CLS[st] + (now ? ' now' : '') + '">' + g + '<span class="st">' + ST[st] + '</span></li>';
      }).join('');
      var gap = s === 2;
      views.innerHTML = '<div class="view"><p class="lbl">控制系统事实</p><p class="val">' + TRUTH[s] + '</p></div>' +
        '<div class="view' + (gap ? ' gap' : '') + '"><p class="lbl">调用方所知</p><p class="val">' + KNOWN[s] + '</p></div>';
      var r = ROWS[s];
      table.innerHTML = '<thead><tr><th>时点</th><th>控制系统事实</th><th>本地工作状态</th><th>可向用户报告的结果</th></tr></thead><tbody><tr class="changed"><td>' + STEPS[s] + '</td><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr></tbody>';
      if (s === 3) {
        detail.innerHTML = '<h4>确认效果的检查条件</h4><ul class="checks">' +
          '<li><b>结果版本</b>回执 9 = 意图中的前提版本 8 + 1</li>' +
          '<li><b>目标值</b>回执 6 = 意图中的目标值 6</li>' +
          '<li><b>操作身份</b>回执属于同一 OP-42</li>' +
          '<li><b>租户</b>回执租户与意图租户相同</li></ul>';
      } else if (s === 4) {
        detail.innerHTML = '<h4>验收：工作政策 SVC-ACCEPT-1</h4>' + probes('变更前', 8) + probes('变更后', 10) +
          '<p class="note">政策固定 10 项探测并要求全数通过。调用方报告 1/1 或 9/9，比例虽同为 100%，仍不满足本次验收。</p>';
      } else detail.innerHTML = '';
      note.textContent = NOTES[s];
      altBox.hidden = !alt;
      altBox.innerHTML = alt ? '<h4>改用新操作 OP-43 重试的后果</h4>' +
        '<p>OP-43 是新的操作身份，控制系统会把它当作第二次业务意图，可能造成第二次业务效果。</p>' +
        '<p>' + (s >= 2 ? '此时 OP-42 实际已把上限写成 6、版本 9，' : 'OP-42 若已执行，') + 'OP-42 的结果仍无人核对，本地也无法分清两次尝试各自产生了什么效果。</p>' +
        '<p>正确动作：保留同一意图、同一目标和同一操作键，按 OP-42 查询。</p>' : '';
    }
    K.stepper(mount, STEPS, function (s) { cur = s; render(); });
    var ctl = K.h('div', { class: 'fig-controls' });
    K.toggle(ctl, '改用新操作 OP-43 重试', function (on) { alt = on; render(); });
    mount.appendChild(ctl);
    mount.appendChild(stage);
    render();
  };
})();
