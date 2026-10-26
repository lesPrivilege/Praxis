// A project-local explanatory model; no product API or private source dependency.
export const META = {id:'a3-esc-001', revision:'20261002-r1', synthetic:true, objectId:'M-0417', sourceFixture:'vg-esc-001@20260929-r1'};
export const FIELDS = [
  {key:'counterparty',label:'对方'}, {key:'term',label:'期限'},
  {key:'payment',label:'付款'}, {key:'status',label:'事项状态'}
];
export const EVENTS = [
  {id:'evt-001',label:'登记合同',kind:'commit',set:{counterparty:'示例公司',term:'12 个月',payment:'按季度',status:'审阅中'},evidence:['src-contract-v1']},
  {id:'evt-002',label:'提议延长至 24 个月',kind:'pending',candidate:'cand-02',proposes:{term:'24 个月'},evidence:['src-email-0912']},
  {id:'evt-003',label:'人工批准延长',kind:'approve',decides:'cand-02',evidence:['src-email-0912']},
  {id:'evt-004',label:'提议一次性预付',kind:'pending',candidate:'cand-04',proposes:{payment:'一次性预付'},evidence:[]},
  {id:'evt-005',label:'人工拒绝预付',kind:'reject',decides:'cand-04',reason:'与已签附件的付款节奏冲突',evidence:['src-contract-v1']},
  {id:'evt-006',label:'修正为按月付款',kind:'commit',set:{payment:'按月'},reason:'附件 v3 更正付款节奏',evidence:['src-contract-v3']},
];
export const REPLAY = {...EVENTS[2],replay:true};
export function fold(events) {
  const seen = new Set(), log = [], candidates = {}, state = {};
  let version = 0, replayCount = 0;
  for(const event of events) {
    if(seen.has(event.id)) { replayCount++; continue; }
    seen.add(event.id); log.push(event);
    if(event.kind === 'pending') candidates[event.candidate] = {...event,status:'pending'};
    else if(event.kind === 'commit') {Object.assign(state,event.set); version++;}
    else if(event.kind === 'approve') {
      const candidate = candidates[event.decides];
      if(!candidate || candidate.status !== 'pending') throw new Error('批准必须指向待审候选');
      Object.assign(state,candidate.proposes); candidate.status='approved'; version++;
    } else if(event.kind === 'reject') {
      const candidate = candidates[event.decides];
      if(!candidate || candidate.status !== 'pending') throw new Error('拒绝必须指向待审候选');
      candidate.status='rejected';
    } else throw new Error('未知事件类型');
  }
  return {log,state,version,candidates,replayCount};
}
export function project(model,keys,id,task) {
  return {id,task,basis:model.version,values:Object.fromEntries(keys.filter(key=>key in model.state).map(key=>[key,model.state[key]]))};
}
export const STAGES = [
  {title:'登记',count:1,headline:'记录开始，状态成为 v1。',note:'合同登记生效：12 个月，按季度付款。'},
  {title:'提议',count:2,headline:'一条新记录，未必是一项新事实。',note:'24 个月仍是候选；日志已追加，当前期限仍为 12 个月。'},
  {title:'批准',count:3,headline:'人工批准，使候选进入状态。',note:'批准引用 cand-02：期限变为 24 个月，版本成为 v2。'},
  {title:'预付提议',count:4,headline:'另一项提议，等待决定。',note:'一次性预付尚未生效，付款仍是按季度。'},
  {title:'拒绝',count:5,headline:'拒绝留在历史，付款保持原值。',note:'cand-04 被拒绝；提议和拒绝都保留，状态仍是 v2。'},
  {title:'选入',count:5,context:'A',headline:'一次调用，只取任务需要的材料。',note:'ctx-A 为起草邮件选入对方和期限，基于 v2；付款与事项状态未选入。'},
  {title:'修正',count:6,context:'A',headline:'状态更新，旧上下文不会自行改写。',note:'付款修正为按月，状态成为 v3；ctx-A 仍基于 v2，本例按整体版本判为过期。'},
  {title:'重放',count:6,replay:true,context:'A',headline:'同一事件重放，不制造第二次批准。',note:'按 event_id 去重：日志仍为 6 条，状态仍是 v3。'},
  {title:'换任务',count:6,replay:true,context:'B',headline:'换任务，重建投影；当前事实仍完整。',note:'ctx-B 为复核付款选入付款与附件证据；未选期限，状态中的 24 个月仍存在。'}
];
const A = project(fold(EVENTS.slice(0,3)),['counterparty','term'],'ctx-A','起草续签邮件');
export function atStage(index) {
  const stage = STAGES[Math.max(0,Math.min(STAGES.length-1,index))];
  const model = fold([...EVENTS.slice(0,stage.count),...(stage.replay?[REPLAY]:[])]);
  let context = stage.context==='A'? structuredClone(A) : stage.context==='B'? project(model,['payment'],'ctx-B','复核付款条款') : null;
  if(context) {context.current = context.basis===model.version; if(context.id==='ctx-B') context.evidence='src-contract-v3';}
  return {...model,stage,context};
}
export const BEATS = [
  {start:0,end:7,stage:0,title:'同一件事，三种存在',formula:'L → Sᵥ → Cₜ'},
  {start:7,end:16,stage:1,title:'01 / 记录不等于生效',formula:'S₁ = fold([e₁, e₂])'},
  {start:16,end:25,stage:2,title:'02 / 批准改变当前事实',formula:'S₂ = apply(S₁, Δ(cand-02))'},
  {start:25,end:34,stage:4,title:'03 / 拒绝仍是一段历史',formula:'fold(L + [e₄, e₅]) = S₂'},
  {start:34,end:45,stage:5,title:'04 / 上下文是一份任务投影',formula:'Cₐ = π{对方,期限}(S₂)'},
  {start:45,end:57,stage:6,title:'05 / 新状态，旧依据',formula:'basis(Cₐ) = 2 ≠ 3'},
  {start:57,end:66,stage:7,title:'06 / 重放保持幂等',formula:'dedupe(L + [e₃]) = L'},
  {start:66,end:77,stage:8,title:'07 / 省略字段，事实仍在',formula:'Cᵦ = πₜ(S₃, E₃)'},
  {start:77,end:84,stage:8,title:'从历史中折叠，向任务作投影',formula:'L ── fold ──▶ Sᵥ ── πₜ ──▶ Cₜ'}
];
export const CAPTIONS = [
  [0,3.5,'同一份合同，留下历史、形成状态、进入一次调用。'],
  [3.5,7,'三者共享对象 M-0417，承担不同职责。'],
  [7,11.5,'登记生效：期限 12 个月，付款按季度，状态为 v1。'],
  [11.5,16,'提出 24 个月的候选，只追加日志；期限尚未改变。'],
  [16,20.5,'人工批准 cand-02，期限才变为 24 个月。'],
  [20.5,25,'状态来自生效事件的折叠，版本成为 v2。'],
  [25,29,'一次性预付的候选先进入日志，等待人工决定。'],
  [29,34,'人工拒绝后，历史保留；付款仍按季度，状态仍是 v2。'],
  [34,39,'起草邮件，只选对方和期限，形成基于 v2 的 ctx-A。'],
  [39,45,'选择不会搬走原字段；上下文也不能反向创造事实。'],
  [45,50.5,'附件修正付款节奏：按季度改为按月，状态成为 v3。'],
  [50.5,57,'ctx-A 仍基于 v2。本例按整体版本判过期，决定入口暂停。'],
  [57,61.5,'再次收到 evt-003，先检查稳定的事件身份。'],
  [61.5,66,'重放不追加：日志仍为 6 条，状态仍是 v3。'],
  [66,71.5,'复核付款，重建 ctx-B：选付款与附件证据，基于 v3。'],
  [71.5,77,'期限没有选入；状态中的 24 个月仍然存在。'],
  [77,80.5,'日志回答发生过什么；状态回答当前什么生效。'],
  [80.5,84,'上下文回答本次需要看什么。合成演算，不是产品实装。']
];
export function movieAt(seconds) {
  const baseBeat = BEATS.find(b=>seconds>=b.start&&seconds<b.end)||BEATS.at(-1);
  const beat={...baseBeat};
  if(seconds>=7&&seconds<11.5) beat.formula='S₁ = fold([e₁])';
  if(seconds>=25&&seconds<29) beat.formula='fold(L + [e₄]) = S₂';
  let stage=beat.stage;
  if(seconds<3.5) stage=0;
  if(seconds>=7&&seconds<11.5) stage=0;
  if(seconds>=25&&seconds<29) stage=3;
  return {beat,...atStage(stage),caption:(CAPTIONS.find(c=>seconds>=c[0]&&seconds<c[1])||CAPTIONS.at(-1))[2]};
}
