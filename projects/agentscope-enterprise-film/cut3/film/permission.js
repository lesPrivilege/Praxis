/* Permission: a call waits at a physical boundary; identity-bound consent opens it. */
(function () {
  'use strict';
  const V = window.V3;
  V.register('permission', {
    title: '权限：调用先停住，再决定是否放行',
    duration: 168,
    covers: ['permission', 'hitl'],
    phases: [
      { at: 0, name: 'input' }, { at: 12, name: 'input_validated' },
      { at: 24, name: 'ask_parked' }, { at: 52, name: 'confirmation' },
      { at: 66, name: 'identity_matched' }, { at: 74, name: 'gate_open' },
      { at: 82, name: 'allowed_to_execute' }, { at: 96, name: 'deny_arrival' },
      { at: 108, name: 'denied' }, { at: 120, name: 'explore_order' },
      { at: 140, name: 'explore_single_call_confirmation' }
    ],
    motion: [
      { at: 10, duration: 2, purpose: '输入检查通过，Schema关口打开' },
      { at: 15, duration: 3, purpose: '原调用T2抵达权限闸门前' },
      { at: 64, duration: 2, purpose: '确认对象的嵌套T2连接原调用T2' },
      { at: 74, duration: 2, purpose: '确认匹配后权限闸门打开' },
      { at: 79, duration: 3, purpose: '原调用T2进入工具执行端' },
      { at: 94, duration: 2, purpose: '权限闸门关闭，下一调用重新判定' },
      { at: 99, duration: 3, purpose: '独立调用T3抵达拒绝点' },
      { at: 108, duration: 3, purpose: 'DENY调用转入止步区，不进入工具执行端' }
    ],
    build(svg) {
      const C = V.C;
      const G = id => V.group(svg, 'permission-' + id);
      const text = (p, x, y, s, size = 32, opts = {}) => V.text(p, x, y, s, size, opts);
      const line = (p, x1, y1, x2, y2, attrs = {}) => V.line(p, x1, y1, x2, y2, Object.assign({ stroke: C.line, 'stroke-width': 2 }, attrs));
      const rect = (p, x, y, w, h, attrs = {}) => V.rect(p, x, y, w, h, Object.assign({ fill: C.paper, stroke: C.line, 'stroke-width': 2 }, attrs));
      const path = (p, d, attrs = {}) => V.path(p, d, Object.assign({ fill: 'none', stroke: C.line, 'stroke-width': 2 }, attrs));
      const fade = (g, t, at, end = Infinity) => V.show(g, V.p(t, at, 1.2) * (1 - V.p(t, end, 1.2)));
      const frame = G('frame');
      line(frame, 110, 500, 1820, 500, { stroke: C.line, 'stroke-width': 3 });
      path(frame, 'M1808 491 L1820 500 L1808 509', { stroke: C.line, 'stroke-width': 3 });
      text(frame, 140, 353, '工具输入', 30, { fill: C.muted });
      text(frame, 590, 353, '输入检查', 30, { fill: C.muted, anchor: 'end' });
      const gateLabel = text(frame, 1230, 353, '权限决定', 30, { fill: C.ink, anchor: 'middle', weight: 650 });
      text(frame, 1640, 353, '工具执行端', 30, { fill: C.muted, anchor: 'middle' });
      line(frame, 1430, 625, 1840, 625, { stroke: C.blue, 'stroke-width': 3 });

      const defaultRules = G('default-rules');
      text(defaultRules, 110, 211, 'DEFAULT', 30, { weight: 650, mono: true });
      const dx = [350, 570, 800, 1070, 1330, 1660];
      ['deny', 'ask', '只读放行', '工具检查', 'allow', '兜底 ASK'].forEach((s, i) => {
        text(defaultRules, dx[i], 211, s, 30, { anchor: 'middle', mono: i === 0 || i === 1 || i === 4, fill: i === 1 ? C.blue : C.muted });
        if (i < 5) path(defaultRules, `M${dx[i] + (i === 2 || i === 3 || i === 5 ? 85 : 65)} 200 L${dx[i + 1] - (i + 1 === 2 || i + 1 === 3 || i + 1 === 5 ? 85 : 65)} 200`, { stroke: C.line });
      });
      const askLink = G('ask-link');
      path(askLink, 'M570 232 L570 297 L1105 297 L1105 389', { stroke: C.blue, 'stroke-width': 3 });
      text(askLink, 860, 282, '命中 ASK', 30, { fill: C.blue, anchor: 'middle', weight: 600 });

      const schema = G('schema');
      const schemaTop = line(schema, 620, 390, 620, 500, { stroke: C.muted, 'stroke-width': 7 });
      const schemaBottom = line(schema, 620, 500, 620, 610, { stroke: C.muted, 'stroke-width': 7 });
      const schemaOk = text(schema, 590, 650, '输入合法', 30, { anchor: 'end', fill: C.blue });

      const gate = G('gate');
      const doorTop = line(gate, 1230, 390, 1230, 500, { stroke: C.ink, 'stroke-width': 10 });
      const doorBottom = line(gate, 1230, 500, 1230, 610, { stroke: C.ink, 'stroke-width': 10 });
      const status = text(gate, 1230, 650, 'ASK · 等待确认', 30, { fill: C.blue, anchor: 'middle', weight: 600 });
      const wait = G('wait-mark');
      line(wait, 1185, 421, 1185, 579, { stroke: C.blue, 'stroke-width': 4 });
      line(wait, 1169, 421, 1185, 421, { stroke: C.blue, 'stroke-width': 4 });
      line(wait, 1169, 579, 1185, 579, { stroke: C.blue, 'stroke-width': 4 });

      function call(id, reply, fill) {
        const g = G('call-' + id);
        rect(g, 0, 0, 410, 150, { fill, stroke: C.ink, 'stroke-width': 2 });
        rect(g, 0, 0, 410, 8, { fill: C.blue, stroke: 'none' });
        text(g, 25, 48, `${reply} /`, 32, { mono: true, weight: 650 });
        text(g, 125, 48, id, 32, { mono: true, fill: C.blue, weight: 650, key: id + '-identity' });
        text(g, 205, 48, '· Write', 32, { mono: true, weight: 650 });
        text(g, 25, 93, 'review-v3.md', 34, { mono: true, key: id + '-filename' });
        const state = text(g, 25, 137, '待检查', 30, { fill: C.muted, key: id + '-state' });
        return { g, state };
      }
      const t2 = call('T2', 'R2', C.paper);
      const t3 = call('T3', 'R3', C.pale);
      const result = G('result');
      text(result, 1640, 678, '获准进入执行路径', 30, { anchor: 'middle', fill: C.blue, weight: 600 });
      text(result, 1640, 720, '执行仍可返回失败', 30, { anchor: 'middle', fill: C.muted });

      const confirm = G('confirm');
      line(confirm, 150, 705, 1100, 705, { stroke: C.blue, 'stroke-width': 3 });
      text(confirm, 150, 748, '用户确认 · R2', 30, { weight: 600 });
      text(confirm, 150, 792, 'confirm_results[0].tool_call.id =', 30, { mono: true });
      text(confirm, 790, 792, 'T2', 30, { mono: true, fill: C.blue, weight: 650 });
      text(confirm, 150, 837, 'confirmed = true', 32, { fill: C.blue, mono: true, weight: 650 });
      const match = G('match');
      const matchPath = path(match, 'M815 765 L815 670 L700 670 L700 390 L890 390 L890 436', { stroke: C.blue, 'stroke-width': 3, 'stroke-dasharray': '7 8' });
      text(match, 1090, 635, '对应待确认 T2', 30, { fill: C.blue, anchor: 'end' });

      const denyRoute = G('deny-route');
      path(denyRoute, 'M955 590 L955 685', { stroke: C.ink, 'stroke-width': 3 });
      path(denyRoute, 'M946 672 L955 685 L964 672', { stroke: C.ink, 'stroke-width': 3 });
      line(denyRoute, 745, 865, 1165, 865, { stroke: C.ink, 'stroke-width': 5 });
      text(denyRoute, 1240, 776, 'DENY', 34, { weight: 650 });
      text(denyRoute, 1240, 821, '不调用工具', 32, { fill: C.muted });
      const denyRule = G('deny-rule');
      path(denyRule, 'M350 232 L350 297 L1050 297 L1050 390', { stroke: C.ink, 'stroke-width': 3 });
      text(denyRule, 740, 282, '先命中 DENY', 30, { anchor: 'middle', weight: 600 });

      const explore = G('explore');
      text(explore, 110, 281, 'EXPLORE', 30, { mono: true, weight: 650 });
      const ex = [350, 570, 800, 1070, 1640];
      ['deny', 'ask', '只读放行', '其余拒绝'].forEach((s, i) => {
        text(explore, ex[i], 281, s, 30, { anchor: 'middle', mono: i < 2, fill: i === 1 ? C.blue : C.muted });
        if (i < 3) line(explore, ex[i] + (i === 2 ? 95 : 70), 270, ex[i + 1] - (i + 1 > 1 ? 100 : 80), 270);
      });
      text(explore, 1640, 270, '跳过工具检查', 30, { anchor: 'middle', fill: C.muted });
      text(explore, 1640, 310, '与 allow 规则', 30, { anchor: 'middle', fill: C.muted });
      const explorePath = G('explore-path');
      path(explorePath, 'M570 298 L570 310 L650 310 L650 348 L1145 348 L1145 386', { stroke: C.blue, 'stroke-width': 3 });
      text(explorePath, 900, 335, '显式 ASK → 单次确认', 30, { fill: C.blue, anchor: 'middle' });
      const nextCall = G('next-call');
      text(nextCall, 1430, 786, '下一调用重新判定', 30, { fill: C.blue });

      return {
        render(t) {
          const inputOpen = V.p(t, 10, 2);
          V.move(schemaTop, 0, -100 * inputOpen);
          V.move(schemaBottom, 0, 100 * inputOpen);
          V.show(schemaTop, 1 - V.p(t, 18, 1.2));
          V.show(schemaBottom, 1 - V.p(t, 18, 1.2));
          V.show(schemaOk, V.p(t, 12, 1.2));
          const passed = V.p(t, 79, 3);
          V.move(t2.g, V.lerp(V.lerp(150, 745, V.p(t, 15, 3)), 1430, passed), 425);
          t2.state.textContent = t < 12 ? '待检查' : t < 24 ? '输入合法' : t < 74 ? 'ASKING · 待确认' : 'ALLOWED · 本次获准';
          const opening = V.p(t, 74, 2) * (1 - V.p(t, 94, 2));
          V.move(doorTop, 0, -120 * opening);
          V.move(doorBottom, 0, 120 * opening);
          const gateCaption = 1 - V.p(t, 74, 0.5) * (1 - V.p(t, 95.6, 0.4));
          V.show(gateLabel, gateCaption);
          V.show(status, gateCaption);
          status.textContent = t < 24 ? '等待权限决定' : t < 74.5 ? 'ASK · 等待确认' : t < 94 ? '本次调用获准' : t < 108 ? '等待下一调用' : t < 120 ? 'DENY · 拒绝执行' : '每次调用独立决定';
          V.set(status, { fill: t < 24 || (t >= 94 && t < 108) ? C.muted : t >= 108 && t < 120 ? C.ink : C.blue });
          fade(defaultRules, t, 4);
          fade(askLink, t, 22, 92);
          fade(wait, t, 24, 74);
          fade(confirm, t, 52, 92);
          fade(match, t, 64, 78);
          V.set(matchPath, { 'stroke-dashoffset': 0 });
          fade(result, t, 83);
          fade(t3.g, t, 96);
          const arrive = V.p(t, 99, 3), down = V.p(t, 108, 3);
          V.move(t3.g, V.lerp(150, 745, arrive), V.lerp(425, 700, down));
          t3.state.textContent = t < 108 ? '新调用 · 重新判定' : 'DENIED · 已止步';
          fade(denyRule, t, 97, 118);
          fade(denyRoute, t, 106);
          fade(explore, t, 120);
          fade(explorePath, t, 140);
          fade(nextCall, t, 153);
          V.note(t < 12 ? 'Write 输入 review-v3.md；输入检查与权限决定是两道关口。' :
            t < 24 ? '输入合法，调用才抵达权限闸门。' :
            t < 52 ? 'ASK 把 T2 留在闸门前；此时工具尚未执行。' :
            t < 66 ? '确认回传携带嵌套的工具调用对象，并指定 confirmed = true。' :
            t < 74 ? 'confirm_results[].tool_call.id 必须对应当前等待确认的 T2。' :
            t < 94 ? '匹配后 T2 置为 ALLOWED，原调用进入执行路径。' :
            t < 120 ? 'DENY 直接拒绝；T3 留在执行端之外。' :
            t < 140 ? 'EXPLORE 非只读调用默认拒绝，显式 ASK 先于只读判断。' :
            t < 153 ? 'EXPLORE 命中显式 ASK 后，合法单次确认仍可进入执行路径。' :
            'EXPLORE 跳过 allow 规则；单次确认不代表未来调用永久获准。');
        }
      };
    }
  });
}());
