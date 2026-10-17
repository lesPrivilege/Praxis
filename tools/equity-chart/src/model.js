// The chart data is a directed graph: entities are nodes, holdings are edges
// from shareholder to investee. A tree is only the simplest case of it.
(function (EC) {
  EC.parseModel = function (source) {
    const data = (typeof source === 'string' ? JSON.parse(source) : source) || {};
    const errors = [];
    const warnings = [];
    const entities = Array.isArray(data.entities) ? data.entities : [];
    const holdings = Array.isArray(data.holdings) ? data.holdings : [];
    if (!Array.isArray(data.entities)) errors.push('缺少 entities 数组');
    if (!Array.isArray(data.holdings)) errors.push('缺少 holdings 数组');

    const byId = new Map();
    for (const e of entities) {
      if (!e || typeof e.id !== 'string' || !e.id) {
        errors.push('有主体缺少字符串 id');
        continue;
      }
      if (byId.has(e.id)) errors.push(`主体 id 重复：${e.id}`);
      byId.set(e.id, { id: e.id, name: String(e.name ?? e.id), kind: e.kind === 'person' ? 'person' : 'company', focus: !!e.focus });
    }

    const edges = [];
    const pctIn = new Map();
    holdings.forEach((h, i) => {
      if (!h || !byId.has(h.from) || !byId.has(h.to)) {
        errors.push(`第 ${i + 1} 条持股引用了不存在的主体：${h && h.from} → ${h && h.to}`);
        return;
      }
      if (h.from === h.to) {
        errors.push(`第 ${i + 1} 条持股指向自身：${h.from}`);
        return;
      }
      const pct = h.pct === undefined || h.pct === null || h.pct === '' ? null : Number(h.pct);
      if (pct !== null && !(pct >= 0 && pct <= 100)) errors.push(`第 ${i + 1} 条持股比例不在 0–100：${h.pct}`);
      const label = h.label !== undefined ? String(h.label) : pct === null ? '' : `${+pct.toFixed(4)}%`;
      edges.push({ id: `h${i}`, from: h.from, to: h.to, label });
      if (pct !== null) pctIn.set(h.to, (pctIn.get(h.to) || 0) + pct);
    });
    for (const [id, sum] of pctIn) {
      if (sum > 100.0001) warnings.push(`${byId.get(id).name} 的股东比例合计 ${+sum.toFixed(4)}%，超过 100%`);
    }
    for (const cycle of findCycles([...byId.keys()], edges)) {
      warnings.push(`循环持股：${cycle.map((id) => byId.get(id).name).join(' → ')}`);
    }
    return { nodes: [...byId.values()], edges, errors, warnings };
  };

  // Strongly connected components with more than one member are cross-holding loops.
  function findCycles(ids, edges) {
    const out = new Map(ids.map((id) => [id, []]));
    for (const e of edges) out.get(e.from).push(e.to);
    let index = 0;
    const idx = new Map();
    const low = new Map();
    const stack = [];
    const onStack = new Set();
    const cycles = [];
    function visit(v) {
      idx.set(v, index);
      low.set(v, index++);
      stack.push(v);
      onStack.add(v);
      for (const w of out.get(v)) {
        if (!idx.has(w)) {
          visit(w);
          low.set(v, Math.min(low.get(v), low.get(w)));
        } else if (onStack.has(w)) {
          low.set(v, Math.min(low.get(v), idx.get(w)));
        }
      }
      if (low.get(v) === idx.get(v)) {
        const comp = [];
        let w;
        do {
          w = stack.pop();
          onStack.delete(w);
          comp.push(w);
        } while (w !== v);
        if (comp.length > 1) cycles.push(comp.reverse());
      }
    }
    for (const id of ids) if (!idx.has(id)) visit(id);
    return cycles;
  }
})(window.EC);
