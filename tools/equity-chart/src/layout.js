// Measure every box first, then hand the sized graph to ELK Layered for
// placement and orthogonal edge routing. Coordinates come back absolute.
// ELK runs in workers built from the inlined worker script, so a large chart
// does not freeze the page. Editor previews share one worker where a newer
// request replaces one still running; other calls queue on their own worker.
(function (EC) {
  const editor = { elk: null, active: null };
  let api = null;

  function createElk() {
    const url = URL.createObjectURL(new Blob([document.getElementById('elk-worker').textContent], { type: 'text/javascript' }));
    const instance = new ELK({ workerFactory: () => new Worker(url) });
    URL.revokeObjectURL(url);
    return instance;
  }

  function runLatest(graph) {
    if (editor.active) {
      // ELK cannot cancel a layout, so a superseded run takes its worker with it.
      editor.elk.terminateWorker();
      editor.elk = null;
      editor.active.reject(new Error('superseded'));
    }
    editor.elk ||= createElk();
    return new Promise((resolve, reject) => {
      const job = { reject };
      editor.active = job;
      editor.elk.layout(graph).then(resolve, reject).finally(() => {
        if (editor.active === job) editor.active = null;
      });
    });
  }

  function runElk(graph, latestWins) {
    if (latestWins) return runLatest(graph);
    api ||= createElk();
    return api.layout(graph);
  }

  EC.layout = async function (model, o, { latestWins = false } = {}) {
    const nodeText = new Map();
    for (const n of model.nodes) {
      nodeText.set(n.id, EC.layoutText(n.name, {
        fontSize: o.fontSize,
        fontWeight: n.focus ? 600 : 400,
        lineHeight: o.lineHeight,
        minWidth: o.minWidth,
        maxWidth: o.maxWidth,
        padX: o.padX,
        padY: o.padY,
      }));
    }
    const labelSize = o.fontSize * 0.86;
    const labelHeight = Math.ceil(labelSize * 1.3);

    const graph = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': o.direction,
        'elk.edgeRouting': 'ORTHOGONAL',
        'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
        // Entity order decides left-to-right order within a layer, so reordering is an edit.
        'elk.layered.crossingMinimization.forceNodeModelOrder': 'true',
        'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
        'elk.layered.spacing.nodeNodeBetweenLayers': String(o.layerGap),
        'elk.spacing.nodeNode': String(o.nodeGap),
        'elk.layered.spacing.edgeNodeBetweenLayers': String(Math.round(o.layerGap / 3)),
        'elk.spacing.edgeEdge': '12',
        'elk.layered.spacing.edgeEdgeBetweenLayers': '10',
        'elk.spacing.edgeLabel': '3',
        'elk.edgeLabels.placement': 'CENTER',
        'elk.padding': '[top=0,left=0,bottom=0,right=0]',
      },
      children: model.nodes.map((n) => ({ id: n.id, width: nodeText.get(n.id).width, height: nodeText.get(n.id).height })),
      edges: model.edges.map((e) => ({
        id: e.id,
        sources: [e.from],
        targets: [e.to],
        labels: e.label ? [{ text: e.label, width: Math.ceil(EC.measureText(e.label, labelSize, 400)) + 4, height: labelHeight }] : [],
      })),
    };

    const t0 = performance.now();
    const res = await runElk(graph, latestWins);
    const ms = performance.now() - t0;

    const placed = new Map(res.children.map((c) => [c.id, c]));
    const nodes = model.nodes.map((n) => {
      const c = placed.get(n.id);
      return { ...n, x: c.x, y: c.y, width: c.width, height: c.height, text: nodeText.get(n.id) };
    });
    const edges = res.edges.map((e) => {
      const points = [];
      for (const s of e.sections || []) {
        points.push(s.startPoint, ...(s.bendPoints || []), s.endPoint);
      }
      const label = e.labels && e.labels[0];
      return {
        id: e.id,
        points,
        label: label ? { text: label.text, x: label.x, y: label.y, width: label.width, height: label.height, size: labelSize } : null,
      };
    });
    return { nodes, edges, ms };
  };
})(window.EC);
