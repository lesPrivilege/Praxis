// Q4 distribution explorer. Pure functions first so they can be tested without a DOM.
const LEVELS = __LEVELS__;
const PRESETS = __PRESETS__;
function validate(values) {
  if (values.length !== 4) return {ok: false, reason: '需要四个概率'};
  for (let i = 0; i < 4; i++) {
    const v = values[i];
    if (typeof v !== 'number' || !Number.isFinite(v)) return {ok: false, reason: `P(${i})不是数字`};
    if (v < 0) return {ok: false, reason: `P(${i})为负数`};
    if (v > 1) return {ok: false, reason: `P(${i})大于1`};
  }
  const sum = values.reduce((a, b) => a + b, 0);
  if (Math.abs(sum - 1) > 1e-9) return {ok: false, reason: `总和为${+sum.toFixed(6)}，须为1`};
  return {ok: true};
}
function derive(values) {
  const mean = values.reduce((acc, p, i) => acc + i * p, 0);
  return {mean, tail: values[2] + values[3], meanRuleAllows: mean < 2};
}
function fmtPct(x) { return `${+(x * 100).toFixed(2)}%`; }
if (typeof document !== 'undefined') {
  const explorer = document.getElementById('q4-explorer');
  const form = document.getElementById('q4-form');
  const inputs = LEVELS.map((_, i) => document.getElementById(`q4-p${i}`));
  const status = document.getElementById('q4-status');
  const title = document.getElementById('q4-custom-title');
  const out = id => document.getElementById(id);
  let label = '';
  function render(values) {
    const d = derive(values);
    const bars = out('q4-custom-bars');
    if (!bars.children.length) {
      bars.innerHTML = values.map((p, i) =>
        `<div class="bar-row${i >= 2 ? ' tail' : ''}"><span class="bar-label">${i} ${LEVELS[i]}</span>` +
        `<span class="bar-track"><span class="bar" style="width:${p * 100}%"></span></span>` +
        `<span class="bar-value">${fmtPct(p)}</span></div>`).join('');
    } else {
      // Update in place so the bars move from the old values to the new ones.
      values.forEach((p, i) => {
        bars.children[i].querySelector('.bar').style.width = `${p * 100}%`;
        bars.children[i].querySelector('.bar-value').textContent = fmtPct(p);
      });
    }
    out('q4-vec').textContent = `[${values.join(', ')}]`;
    out('q4-mean').textContent = d.mean.toFixed(2);
    out('q4-mean-marker').style.left = `${d.mean / 3 * 100}%`;
    out('q4-tail').textContent = fmtPct(d.tail);
    out('q4-rule').textContent = d.meanRuleAllows ? '放行' : '不放行';
    title.textContent = label;
  }
  function load(key) {
    const preset = PRESETS[key];
    preset.values.forEach((v, i) => { inputs[i].value = v; });
    label = `${preset.title}（确定性合成示例）`;
    render(preset.values);
    status.textContent = `已恢复${preset.title}。`;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const values = inputs.map(input => input.value.trim() === '' ? NaN : Number(input.value));
    const check = validate(values);
    if (!check.ok) {
      status.textContent = `向量无效：${check.reason}。下方结果仍为上一有效向量。`;
      status.dataset.state = 'invalid';
      return;
    }
    status.dataset.state = '';
    label = '自定义分布';
    render(values);
    status.textContent = '已按新向量计算。';
  });
  explorer.querySelectorAll('[data-load]').forEach(button =>
    button.addEventListener('click', () => { status.dataset.state = ''; load(button.dataset.load); }));
  load('A');
  status.textContent = '';
  explorer.hidden = false;
}
