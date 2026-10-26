(function () {
  var STEPS = ['选择候选', '预检', '冻结提交集合', 'B 被修订', '逐项执行', '只重试 B'];
  var IDS = ['A', 'B', 'C', 'D'];
  // [set, status, reason]; later steps inherit unless overridden
  var CHANGES = [
    { A: ['候选', '已选择', '—'], B: ['候选', '已选择', '—'], C: ['候选', '已选择', '—'], D: ['候选', '已选择', '—'] },
    { A: ['候选', '预检可匹配', '—'], B: ['候选', '预检可匹配', '—'], C: ['排除', '不进入提交', '缺验收'], D: ['排除', '不进入提交', '无权限'] },
    { A: ['提交', '已冻结，待执行', '确认时进入提交集合'], B: ['提交', '已冻结，待执行', '确认时进入提交集合'] },
    { B: ['提交', '已冻结，待执行', '执行前已修订'] },
    { A: ['提交', '成功', '分配 1 次，有回执'], B: ['提交', '冲突', '冻结后被修订，重验不通过'] },
    { A: ['提交', '成功，不重试', '分配仍为 1 次'], B: ['重试', '修复后重新执行', '只有冲突项进入重试'] },
  ];
  // [category, count, denominator label, first step shown]
  var COUNTS = [
    ['候选', 4, '基数（本次选择）', 0],
    ['排除', 2, '候选 4', 1],
    ['提交', 2, '候选 4', 2],
    ['成功', 1, '提交 2', 4],
    ['冲突', 1, '提交 2', 4],
    ['重试', 1, '冲突 1', 5],
  ];
  var NOTES = [
    '会计在列表中选择 4 张发票。这是候选集合，尚未检查权限、状态和版本。',
    '预检显示 A、B 可匹配，C 缺验收，D 无权限。预检用于预估影响，不能代替正式执行时的重验。',
    '确认时提交集合冻结为 A、B。C、D 记为排除，不属于执行失败。',
    'B 在执行前又被修订。冻结的是集合，不是发票的当前版本；正式执行仍逐项重验。',
    'A 成功，B 冲突。成功 1 的分母是提交 2；若写成 1/4，就把预检排除的 C、D 混入了执行结果。',
    '修复 B 后只重试 B。A 已有成功回执，不进入重试，分配仍为 1 次。',
  ];
  window.FIGURES['em-batch'] = function (body) {
    var K = window.FigKit;
    var mount = body.querySelector('.mount');
    var stage = K.h('div', { class: 'stage' });
    stage.appendChild(K.h('h4', {}, '发票状态'));
    var inv = K.h('table', { class: 'state-table' });
    stage.appendChild(K.h('div', { class: 'table-wrap' })).appendChild(inv);
    stage.appendChild(K.h('h4', {}, '批任务计数'));
    var counts = K.h('table', { class: 'state-table counts' });
    stage.appendChild(K.h('div', { class: 'table-wrap', 'aria-live': 'polite' })).appendChild(counts);
    var note = K.h('p', { class: 'note step-note' });
    stage.appendChild(note);
    K.stepper(mount, STEPS, function (s) {
      var state = {};
      for (var j = 0; j <= s; j++) for (var k in CHANGES[j]) state[k] = CHANGES[j][k];
      inv.innerHTML = '<thead><tr><th>发票</th><th>集合</th><th>状态</th><th>说明</th></tr></thead><tbody>' + IDS.map(function (id) {
        var r = state[id];
        var changed = CHANGES[s][id] != null && s > 0;
        return '<tr' + (changed ? ' class="changed"' : '') + '><td>' + id + '</td><td><span class="set-tag' + (r[0] === '排除' ? ' out' : '') + '">' + r[0] + '</span></td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>';
      }).join('') + '</tbody>';
      counts.innerHTML = '<thead><tr><th>类别</th><th>计数</th><th>分母</th></tr></thead><tbody>' + COUNTS.filter(function (c) { return c[3] <= s; }).map(function (c) {
        var ratio = c[3] === 0 ? '<span class="num ratio">' + c[1] + '</span>' : '<span class="num ratio">' + c[1] + '/' + c[2].replace(/\D+/g, '') + '</span>';
        return '<tr' + (c[3] === s && s > 0 ? ' class="changed"' : '') + '><td>' + c[0] + '</td><td>' + ratio + '</td><td>' + c[2] + '</td></tr>';
      }).join('') + '</tbody>';
      note.textContent = NOTES[s];
    });
    mount.appendChild(stage);
  };
})();
