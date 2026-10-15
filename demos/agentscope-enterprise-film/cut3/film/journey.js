/* R1 is one visible record throughout: no transport clones, timers or mutable timeline. */
(() => {
  'use strict';
  const V = window.V3;
  V.register('message-journey', {
    title: '一条消息，怎样长成一次完整回复',
    duration: 192,
    covers: ['message', 'events', 'react'],
    phases: [
      {at: 0, name: '识别同一个 Msg R1'},
      {at: 12, name: '第一段 delta 进入 B1'},
      {at: 30, name: '第二段追加到 B1'},
      {at: 46, name: 'TEXT_BLOCK_END只结束B1'},
      {at: 49, name: '身份不符，事件跳过'},
      {at: 66, name: '消息展开并记录调用 T1'},
      {at: 83, name: '只读查询进入工具'},
      {at: 102, name: '结果按 T1 写回'},
      {at: 120, name: '完整消息进入下一轮'},
      {at: 138, name: '条件支路：ASK 暂停'},
      {at: 157, name: '条件支路：工具失败回灌'},
      {at: 176, name: '迭代预算与结束'},
      {at: 186, name: 'REPLY_END写入整次结束原因'}
    ],
    motion: [
      {at: 12, duration: 4, purpose: 'delta 本身进入目标 B1'},
      {at: 30, duration: 4, purpose: '第二段追加，第一段保留'},
      {at: 46, duration: 1.8, purpose: 'B1结束而R1继续'},
      {at: 49, duration: 3, purpose: '错误身份停在容器之外'},
      {at: 66, duration: 4, purpose: 'R1 左移展开，建立工具空间'},
      {at: 83, duration: 3, purpose: '调用先连通，工具才开始'},
      {at: 102, duration: 4, purpose: '结果对象返回并配对 T1'},
      {at: 120, duration: 3, purpose: '完整记录作为下一次模型输入'},
      {at: 138, duration: 2.2, purpose: 'ASK 支路停在等待线'},
      {at: 157, duration: 2.2, purpose: 'error 沿条件支路回灌'},
      {at: 176, duration: 2.2, purpose: '预算上限与禁工具总结'},
      {at: 186, duration: 1.8, purpose: '整次回复结束并记录finished_reason'}
    ],
    build(svg) {
      const C = V.C;
      const G = (parent, id) => V.group(parent, id);
      const txt = (parent, x, y, s, size = 32, opts = {}) => V.text(parent, x, y, s, size, opts);
      const set = V.set;
      const show = V.show;
      const root = G(svg, 'journey-art');
      const defs = V.el(root, 'defs', {});
      const marker = V.el(defs, 'marker', {id:'journey-arrow', viewBox:'0 0 10 10', refX:9, refY:5, markerWidth:9, markerHeight:9, orient:'auto-start-reverse'});
      V.path(marker, 'M0 0 L10 5 L0 10 Z', {fill:C.blue});
      const lineAttrs = {fill:'none', stroke:C.blue, 'stroke-width':3, 'marker-end':'url(#journey-arrow)'};
      const makePath = (d, attrs = {}) => V.path(root, d, {...lineAttrs,...attrs});
      const draw = (node, frac, length) => set(node, {'stroke-dasharray':length, 'stroke-dashoffset':length * (1-frac), opacity:frac > 0 ? 1 : 0});
      const model = G(root, 'journey-model');
      V.circle(model, 100, 55, 60, {fill:C.paper,stroke:C.ink,'stroke-width':2});
      txt(model, 100, 66, '模型', 36, {anchor:'middle',weight:650});
      const modelSub = txt(model, 100, 153, '本轮输出', 30, {anchor:'middle',fill:C.muted});
      const msg = G(root, 'journey-msg-R1');
      const msgRect = V.rect(msg, 0, 0, 900, 300, {fill:C.paper, stroke:C.ink,'stroke-width':2});
      txt(msg, 34, 51, 'Msg', 31, {fill:C.muted});
      txt(msg, 119, 53, 'R1', 40, {weight:700,mono:true,key:'journey-msg-id'});
      txt(msg, 260, 51, 'assistant', 30, {fill:C.muted,mono:true});
      const replyState=txt(msg,500,51,'reply 生成中',30,{fill:C.blue});
      const finishReason=txt(msg,500,98,'finished_reason=None',30,{fill:C.muted,mono:true,key:'journey-finished-reason'});
      const blockEnd=txt(msg,500,143,'TEXT_BLOCK_END · B1',30,{fill:C.blue,mono:true,key:'journey-B1-ended'});
      txt(msg, 34, 98, 'B1  ·  text', 30, {mono:true,fill:C.blue,key:'journey-b1-id'});
      const msgDivider = V.line(msg, 34, 69, 1126, 69, {stroke:C.line,'stroke-width':1.5});
      const blockBracket = V.path(msg, 'M17 90 L7 90 L7 210 L17 210', {fill:'none',stroke:C.blue,'stroke-width':3});
      const delta1 = txt(root, 100, 430, '先查合同条款。', 37, {weight:550,key:'journey-delta-1'});
      const delta2 = txt(root, 100, 478, '再核对责任边界。', 37, {weight:550,key:'journey-delta-2'});
      const deltaRoute = makePath('M260 374 L490 374', {'stroke-width':2, 'marker-end':'none'});
      const ids = txt(root, 100, 526, 'reply_id=R1', 28, {mono:true,fill:C.muted,role:'navigation'});
      const ids2 = txt(root, 100, 566, 'block_id=B1', 28, {mono:true,fill:C.muted,role:'navigation'});
      const deltaLabel = txt(root, 280, 350, 'delta', 30, {mono:true,fill:C.blue});
      const wrong = G(root, 'journey-wrong-reply');
      txt(wrong, 0, 0, 'R9 / B1', 30, {mono:true,fill:C.muted});
      txt(wrong, 0, 47, '“追加一段”', 32, {fill:C.muted});
      const wrongStrike = V.line(wrong, -4, 33, 204, 33, {stroke:C.muted,'stroke-width':2});
      const skip = txt(root, 100, 689, 'reply 不符 → 跳过', 30, {fill:C.muted});
      const call = G(msg, 'journey-call-T1');
      V.line(call, 34, 251, 1126, 251, {stroke:C.line,'stroke-width':1.5});
      txt(call, 34, 303, 'T1', 34, {mono:true,weight:700,key:'journey-call-id'});
      txt(call, 152, 303, '查询合同条款', 36, {weight:550});
      txt(call, 152, 354, 'read_contract(contract_id)', 30, {mono:true,fill:C.muted});
      const tool = G(root, 'journey-tool');
      V.rect(tool, 0, 0, 310, 130, {fill:C.pale,stroke:C.blue,'stroke-width':2});
      txt(tool, 155, 52, '只读查询', 34, {anchor:'middle',weight:650});
      const toolState = txt(tool, 155, 99, '尚未调用', 30, {anchor:'middle',fill:C.muted});
      const run = makePath('M1200 600 L1470 600');
      const runLabel = txt(root, 1330, 561, '执行', 30, {anchor:'middle',fill:C.blue});
      const result = G(root, 'journey-result-T1');
      const resultRule = V.line(result, 0, 0, 1020, 0, {stroke:C.line,'stroke-width':1.5});
      txt(result, 0, 52, 'T1', 34, {mono:true,weight:700,key:'journey-result-id'});
      txt(result, 118, 52, '3 条相关条款', 36, {weight:550});
      const resultType = txt(result, 118, 99, 'ToolResultBlock · success', 30, {mono:true,fill:C.muted});
      const paired = V.path(msg, 'M90 316 L90 442 L111 442', {fill:'none',stroke:C.blue,'stroke-width':3});
      const pairLabel = txt(msg, 650, 471, '调用与结果共享 T1', 30, {fill:C.blue});
      const back = makePath('M1640 660 L1640 752 L1280 752');
      const backLabel = txt(root, 1435, 724, '结果写回', 30, {anchor:'middle',fill:C.blue});
      const feedback = makePath('M350 280 L350 209 L1550 209 L1550 242');
      const feedbackLabel = txt(root, 745, 195, '上下文 + 完整 R1', 30, {anchor:'middle',fill:C.blue});
      const iteration = txt(root, 1780, 320, '第 1 轮', 32, {anchor:'end',fill:C.blue});
      const ask = G(root, 'journey-ask-branch');
      const askPath = V.path(ask, 'M1370 600 L1370 493 L1515 493', {...lineAttrs, 'stroke-dasharray':'8 8'});
      V.line(ask, 1527, 465, 1527, 524, {stroke:C.ink,'stroke-width':5});
      txt(ask, 1310, 450, '若 ASK', 30, {anchor:'start',fill:C.blue});
      txt(ask, 1580, 475, '等待确认', 34, {weight:650});
      txt(ask, 1580, 518, '确认后续接', 30, {fill:C.muted});
      const error = G(root, 'journey-error-branch');
      const errorPath = V.path(error, 'M1640 660 L1640 849 L1150 849 L1150 794', {...lineAttrs,'stroke-dasharray':'8 8'});
      txt(error, 1450, 795, '若工具失败', 32, {anchor:'middle',weight:600});
      txt(error, 1450, 833, 'error 也写回 T1', 30, {anchor:'middle',fill:C.muted});
      const budget = G(root, 'journey-budget');
      txt(budget, 1370, 721, 'max_iters', 30, {mono:true,fill:C.muted});
      txt(budget, 1370, 784, '默认 50 轮', 48, {weight:650,fill:C.blue});
      txt(budget, 1370, 830, '普通文本到上限', 30, {fill:C.muted});
      txt(budget, 1370, 865, '→ 禁工具总结', 30, {fill:C.blue});
      const replyEnd=G(root,'journey-reply-end');txt(replyEnd,1370,465,'REPLY_END',34,{mono:true,weight:650,fill:C.blue});txt(replyEnd,1370,515,'R1 整次回复结束',30,{fill:C.muted});
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const P = (t, at, duration=2.2) => reduce ? +(t >= at + duration) : V.p(t,at,duration);
      const L = V.lerp;
      const travel = (q) => {
        if(q < .36) return [L(1510,1510,q/.36),L(702,752,q/.36)];
        return [L(1510,134,(q-.36)/.64),L(752,700,(q-.36)/.64)];
      };
      return {render(t) {
        const expand=P(t,66,4), mx=L(510,100,expand);
        V.move(msg,mx,280); set(msgRect,{height:L(300,540,expand),width:L(900,1160,expand)});set(msgDivider,{x2:L(866,1126,expand)});
        // Lift into the 160..280 corridor, cross above R1, then lower at the next input.
        // The circle and its label stay one object; only its secondary caption waits at the endpoints.
        const lift=P(t,66,1),cross=P(t,67,2),lower=P(t,69,1);
        V.move(model,L(40,1450,cross),235-70*lift+80*lower);
        modelSub.textContent=t>=120 ? '下一次模型输入' : '本轮输出';
        show(modelSub,t<=66||t>=70?1:0);
        show(model,1); show(msg,1);
        replyState.textContent=t>=186?'reply 已结束':'reply 生成中';finishReason.textContent=t>=186?'finished_reason=completed':'finished_reason=None';show(blockEnd,P(t,46));show(replyEnd,P(t,186));
        const d1=P(t,12,4), d2=P(t,30,4);
        set(delta1,{x:L(100,mx+70,d1),y:430,fill:d1<1?C.blue:C.ink});
        set(delta2,{x:L(100,mx+70,d2),y:478,fill:d2<1?C.blue:C.ink});
        show(delta1,t>=12?1:0);show(delta2,t>=30?1:0);
        show(deltaLabel,t>=10&&t<49?1:0);show(deltaRoute,t>=12&&t<49?.6:0);
        show(ids,t>=10&&t<49?1:0);show(ids2,t>=10&&t<49?1:0);
        set(blockBracket,{stroke:t>=12&&t<49?C.blue:C.line});
        const bad=P(t,49,3); V.move(wrong,L(100,265,bad),605);
        show(wrong,t>=49&&t<66?1:0);show(wrongStrike,t>=55?1:0);show(skip,t>=55&&t<66?1:0);
        show(call,P(t,70,1.8));show(tool,P(t,78,1.8));V.move(tool,1470,535);
        toolState.textContent=t<86?'尚未调用':t<101?'执行中':'已完成';
        draw(run,P(t,83,3),270);show(runLabel,t>=83?1:0);
        const returning=P(t,102,4);const xy=travel(returning);V.move(result,xy[0],xy[1]);
        set(resultRule,{x2:L(260,1020,returning)});show(resultType,returning>=1?1:0);show(result,t>=102?1:0);draw(back,P(t,102,2.2),510);set(back,{opacity:(t>=102?1:0)*(1-P(t,176,1.8))});show(backLabel,t>=102&&t<120?1:0);
        show(paired,P(t,106,1.8));show(pairLabel,P(t,108,1.8));
        draw(feedback,P(t,120,3),1310);show(feedbackLabel,P(t,122,1.8));
        iteration.textContent=t>=123?'第 2 轮':'第 1 轮';show(iteration,t>=70?1:0);
        show(ask,P(t,138,2.2)*(1-P(t,176,1.8)));set(askPath,{opacity:1});
        show(error,P(t,157,2.2)*(1-P(t,176,1.8)));set(errorPath,{opacity:1});
        show(budget,P(t,176,2.2));
        V.note(t>=186?'REPLY_END才写入整次回复的finished_reason；本例为completed。':t<46?'本例：只读查询。两个 delta 更新同一文字块 B1。':t<49?'TEXT_BLOCK_END只结束B1；R1仍在生成，工具调用还可继续。':
          t<66?'收到事件后，身份匹配才会改变这条消息。':
          t<102?'调用记录留在 R1；校验与权限允许后才进入工具。':
          t<120?'结果以原调用 T1 的身份写回，保留在有序内容中。':
          t<138?'下一轮模型读取上下文与当前回复，决定继续还是结束。':
          t<157?'ASK 是条件支路：暂停时，R1 尚无最终结束原因。':
          t<176?'失败内容仍写回原调用，并交给下一轮推理。':
          '50 限制一次 reply 的推理—行动迭代，不等于固定模型请求次数。');
      }};
    }
  });
})();
