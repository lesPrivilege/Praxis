(function () {
  var MAX = 90; // bar scale, 人日
  function save(m) { return m / 60 * 220 * 2 / 8; }
  function fmt1(x) { var r = Math.round(x * 10) / 10; return (Math.abs(r - x) < 1e-9 ? '' : '约 ') + String(r); }
  window.FIGURES['em-custom-cost'] = function (body) {
    var K = window.FigKit;
    var mount = body.querySelector('.mount');
    var ctl = K.h('div', { class: 'fig-controls' });
    var label = K.h('label', { for: 'em-custom-cost-m' }, '定制每天节约');
    var input = K.h('input', { type: 'range', id: 'em-custom-cost-m', min: '0', max: '90', step: '5', value: '30' });
    var mOut = K.h('span', { class: 'num readout' });
    label.appendChild(input);
    label.appendChild(mOut);
    ctl.appendChild(label);
    var stage = K.h('div', { class: 'stage' });
    stage.appendChild(K.h('p', { class: 'formula' }, '标准配置两年：<span class="num">8 + 8×1 = 16</span> 人日；定制两年：<span class="num">20 + 8×4 = 52</span> 人日；增量成本 <span class="num">52 − 16 = 36</span> 人日。'));
    var formula = K.h('p', { class: 'formula', 'aria-live': 'polite' });
    stage.appendChild(formula);
    var bars = K.h('div', { class: 'bars' });
    stage.appendChild(bars);
    var verdict = K.h('p', { class: 'verdict', 'aria-live': 'polite' });
    stage.appendChild(verdict);
    function row(name, v, cls, text) {
      return '<span>' + name + '</span><span class="track"><span class="bar ' + cls + '" style="display:block;width:' + (v / MAX * 100) + '%"></span>' +
        '<span class="ref" style="left:' + (36 / MAX * 100) + '%"></span><span class="val num" style="left:' + (v / MAX * 100) + '%">' + text + '</span></span>';
    }
    function render() {
      var m = +input.value, s = save(m);
      mOut.textContent = m + ' 分钟';
      formula.innerHTML = '两年节约：<span class="num">' + m + '/60 × 220 × 2 ÷ 8 = ' + fmt1(s) + '</span> 人日';
      bars.innerHTML = row('标准配置', 16, '', '16') + row('定制', 52, '', '52') + row('增量成本', 36, 'cost', '36') + row('两年节约', s, 'save', fmt1(s));
      verdict.textContent = s < 36 ? '单看劳动，两年节约 ' + fmt1(s) + ' 人日，不足以抵偿 36 人日增量成本。'
        : '单看劳动，两年节约 ' + fmt1(s) + ' 人日，超过 36 人日增量成本。';
    }
    input.addEventListener('input', render);
    mount.appendChild(ctl);
    mount.appendChild(stage);
    render();
  };
})();
