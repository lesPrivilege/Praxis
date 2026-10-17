// One call from data to SVG, shared by the page and by agents driving the page
// headlessly (see render.mjs): EC.render(data, options) → { svg, width, height, errors, warnings }.
(function (EC) {
  EC.DEFAULTS = {
    fontSize: 14, lineHeight: 1.4, minWidth: 96, maxWidth: 208, padX: 14, padY: 10,
    layerGap: 56, nodeGap: 28, margin: 16, strokeWidth: 1.2, radius: 3, arrow: 7,
    direction: 'DOWN', nodeFill: 'white',
    textColor: '#1e293b', lineColor: '#475569', labelColor: '#334155', accent: '#2563eb',
  };

  EC.render = async function (data, options = {}, { interactive = false } = {}) {
    const o = { ...EC.DEFAULTS, ...options };
    o.maxWidth = Math.max(o.maxWidth, o.minWidth);
    const model = EC.parseModel(data);
    const counts = { entities: model.nodes.length, holdings: model.edges.length };
    if (model.errors.length) return { svg: null, errors: model.errors, warnings: model.warnings, ...counts };
    const chart = await EC.layout(model, o, { latestWins: interactive });
    const out = EC.renderSVG(chart, o, false);
    const result = { ...out, errors: [], warnings: model.warnings, layoutMs: chart.ms, ...counts };
    if (interactive) {
      result.chart = chart;
      result.previewSvg = EC.renderSVG(chart, o, true).svg;
    }
    return result;
  };
})(window.EC);
