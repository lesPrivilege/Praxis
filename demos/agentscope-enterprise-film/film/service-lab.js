/* Seekable Service exhibits. Every state change lives on the supplied timeline. */
(function () {
  'use strict';
  const specs = {
    replay: {duration:48,phase_names:['snapshot','subscribe','delta_applied','disconnected','replay_deduplicated','fresh_snapshot','turn_terminal'],cues:[0,6,12,18,25,34,42]},
    targets: {duration:48,phase_names:['ownership','context','records','discovery','delivery','recovery','capability_controls'],cues:[0,7,14,21,28,35,42]},
  };
  const esc = s => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const label = s=>'<div class="sl-label">'+s+'</div>';
  const head = s=>'<div class="sl-h">'+s+'</div>';
  const body = s=>'<div class="sl-body">'+s+'</div>';
  const mono = s=>'<div class="sl-mono">'+s+'</div>';
  const pill = (s,c='')=>'<span class="sl-pill '+c+'">'+s+'</span>';
  function node(parent,cls,x,y,w,h,html) {
    const e=document.createElement('div');e.className='sl-node '+cls;
    Object.assign(e.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
    if(html!=null)e.innerHTML=html;parent.appendChild(e);return e;
  }
  function build(type,options) {
    const spec=specs[type];if(!spec)throw new Error('Unknown ServiceLab type: '+type);
    const {root,tl}=options;if(!root||!tl)throw new Error('ServiceLab requires root and timeline');
    const start=options.start??0,duration=options.duration??spec.duration;
    if(!Number.isFinite(start)||!Number.isFinite(duration)||duration<=0)throw new Error('ServiceLab timing must be finite');
    const input=options.cues;
    const cues=spec.phase_names.map((name,i)=>{const v=Array.isArray(input)?input[i]:input&&input[name];return typeof v==='number'?v:v&&typeof v.at==='number'?v.at:spec.cues[i];});
    if(cues.some((v,i)=>!Number.isFinite(v)||v<0||(i&&v<=cues[i-1]))||cues.at(-1)+1>duration)throw new Error('ServiceLab cues must increase and fit duration');
    const identityInput=options.identities??{};
    if(typeof identityInput!=='object'||Array.isArray(identityInput))throw new Error('ServiceLab identities must be an object');
    const identities={session_id:'JS1',turn_id:'U1',item_id:'M1',tool_call_id:'T1'};
    for(const k of Object.keys(identities))if(Object.prototype.hasOwnProperty.call(identityInput,k)){
      if(typeof identityInput[k]!=='string'||!identityInput[k].trim())throw new Error('ServiceLab '+k+' must be a nonempty string');identities[k]=identityInput[k];
    }
    const I=Object.fromEntries(Object.entries(identities).map(([k,v])=>[k,esc(v)]));
    const wrap=node(root,'sl sl-'+type,options.x??88,options.y??300,1744,590);
    const phases=[],motion=[],screen=[];
    function record(at,duration,purpose){motion.push({at,duration,purpose});}
    function phase(i){
      const p=node(wrap,'sl-layer',0,0,1744,590);p.dataset.phase=spec.phase_names[i];phases.push(p);
      gsap.set(p,{autoAlpha:0});tl.to(p,{autoAlpha:1,duration:.7,ease:'power3.out'},start+cues[i]);record(cues[i],.7,'state_change');
      if(i<cues.length-1)tl.to(p,{autoAlpha:0,duration:.45},start+cues[i+1]);return p;
    }
    function transfer(parent,s,x,y,dx,dy,at,d=1.5){
      const e=node(parent,'sl-transfer',x,y,180,48,s);e.dataset.readingTransient='true';gsap.set(e,{autoAlpha:0});
      tl.to(e,{autoAlpha:1,duration:.12},start+at);tl.to(e,{x:dx,y:dy,duration:d,ease:'power2.inOut'},start+at);
      tl.to(e,{autoAlpha:0,duration:.2},start+at+d-.2);record(at,d,'event_delivery');
    }
    if(type==='replay'){
      node(wrap,'sl-identity',0,0,1744,52,'Session（会话） '+I.session_id+'　/　Turn（一次任务） '+I.turn_id+'　/　合同复核');
      const steps=[
        ['快照已保存至 e17','as_of = c17','snapshot → 页面状态','已复原消息 '+I.item_id,'责任上限待核对','保存游标 c17'],
        ['后台保持运行','e17 → 后续事件','SSE · after = c17','观察同一任务 '+I.turn_id,'责任上限待核对','已订阅后续变化'],
        ['e18 · item.delta','内容增量：缺失','e18 → 更新 '+I.item_id,'追加到原消息 '+I.item_id,'责任上限缺失','应用成功 → 保存 c18'],
        ['e19 · 工具 '+I.tool_call_id+' 完成','Turn '+I.turn_id+' 仍在运行','观察连接 × 断开','页面保留 '+I.item_id,'责任上限缺失','最后已应用游标 c18'],
        ['历史：e19；实时交界：e19','事件 ID e19 相同','after = c18 → 补历史','工具 '+I.tool_call_id+' 已完成','责任上限缺失','按事件 ID 去重 → 保存 c19'],
        ['新 snapshot：已含 e19','as_of = c19','410 · cursor_expired','重建原任务 '+I.turn_id,'责任上限缺失','新快照 → after = c19'],
        ['e20 · turn.completed','Turn '+I.turn_id+' = completed','终态事件 → 原任务','同一 '+I.turn_id+' 已完成','责任上限缺失','更新 Turn 状态 → 保存 c20'],
      ];
      const bands=[
        '先恢复快照里的消息、工具与待处理动作，再取 as_of 作为观察起点。',
        'SSE（服务器持续推送事件）补上快照之后的变化；观察不再次提交任务。',
        'item.delta 追加；item.completed 替换累计内容。成功更新页面后才保存游标。',
        '断开的是观察连接；后台任务继续。单个工具完成，Turn 仍可继续运行。',
        '重连补历史；历史与实时交界的重复事件按事件 ID 丢弃，消息不再追加一次。',
        '游标过期：读取 fresh snapshot，再从新的 as_of 订阅。保留 '+I.turn_id+'，不新建 Turn。',
        '只有目标 Turn 的明确终态，才把这次任务显示为完成。',
      ];
      steps.forEach((s,i)=>{
        const p=phase(i);
        node(p,'sl-panel sl-server',0,74,546,382,label('Service · 任务记录与事件日志')+head(s[0])+body(s[1])+'<div class="sl-divider"></div>'+mono('session_id = '+I.session_id+'<br>turn_id = '+I.turn_id)+pill(i===6?'completed':'running',i===6?'done':''));
        node(p,'sl-panel sl-wire',586,74,548,382,label('观察通道')+head(s[2])+body(i===0?'snapshot / as_of':i===1?'订阅该 Turn 的 events':i===2?'按 item_id 更新已有对象':i===3?'任务执行仍在后台继续':i===4?'历史 e19　＋　实时 e19':i===5?'丢弃过期游标，重取快照':'任务状态同步到页面')+'<div class="sl-track '+(i===3?'broken':'')+'"><span>Service</span><b>→</b><span>页面</span></div>'+pill(i===3?'离线期间：后台继续':i===4?'e19  × 1 次应用':i===5?'GET snapshot → SSE':'同一资源的观察流',i===3?'warm':''));
        node(p,'sl-panel sl-page',1174,74,570,382,label('业务页面 · 本地视图')+head(s[3])+'<div class="sl-message">'+label('消息 '+I.item_id)+body(s[4])+'</div>'+body(s[5])+pill(i===6?'Turn '+I.turn_id+' · completed':'Turn '+I.turn_id+' · running',i===6?'done':''));
        node(p,'sl-symbol',0,468,1744,44,'示例事件 e17–e20；示例游标 c17–c20。真实游标是资源专属的不透明值。');
        node(p,'sl-band',0,522,1744,68,bands[i]);
      });
      transfer(wrap,'e18 · delta',492,257,460,0,cues[2]+.8,1.65);
      transfer(wrap,'e19 · 历史',492,257,460,0,cues[4]+.6,1.55);
      transfer(wrap,'e19 · 重复',695,319,205,0,cues[4]+2.4,1.05);
    }
    if(type==='targets'){
      const xs=[0,274,764,1254],ws=[274,490,490,490],ys=[72,130,188,246,304,362],hs=[58,58,58,58,58,88];
      const rows=[
        ['谁持有执行','Service 平台','已有应用进程','Runtime Host 启动提供方'],
        ['谁维护上下文','Harness / AgentState','应用与适配器','Coding Agent 提供方'],
        ['Service 记录','Session / Turn / 事件','Session / Turn / 事件','Session / Turn / 事件'],
        ['能力发现','查询 /capabilities','注册 → 适配器能力','查询提供方能力'],
        ['文件交付','Session file → Artifact','按适配器的文件能力','按提供方的文件能力'],
        ['执行恢复','按可用命令续接状态','取决于适配器支持','checkpoint_restore<br>= false'],
      ];
      const notes=[
        ['选择执行所有权','Managed：平台托管　/　External：保留应用部署　/　Hosted：指定机器上的运行宿主'],
        ['上下文跟随运行者','Harness（Agent 执行与状态内核）在运行层；Service（任务接入与记录平台）在服务层。'],
        ['共同观察面','同一 Session / Turn 接口记录任务进度；上下文、控制与恢复能力仍由目标实现。'],
        ['先查能力，再给控件','External 注册 → 目录可见 → Session 可用 → dispatch（派发执行）分别验证。'],
        ['交付按文件能力走','先取得真实 Session 文件，再发布 Artifact；选中目标的文件能力决定输入与下载入口。'],
        ['观察恢复与执行恢复分开','Hosted：checkpoint_restore = false；断线后仍可读取快照与事件，运行恢复另查可用命令。'],
        ['选中 Hosted · 控制随能力收敛','读取该 Turn 的 capabilities 与 available_commands；仅显示返回的控制项。'],
      ];
      for(let i=0;i<7;i++){
        const p=phase(i);
        const selected=[1,1,2,1,2,3,3][i];
        node(p,'sl-matrix-head sl-dimension',0,0,274,72,'比较维度');
        ['Managed · 平台托管','External · 外部应用','Hosted · 运行宿主'].forEach((h,j)=>node(p,'sl-matrix-head'+(j+1===selected?' selected':''),xs[j+1],0,ws[j+1],72,h));
        rows.slice(0,Math.min(i+1,6)).forEach((r,k)=>r.forEach((v,j)=>node(p,'sl-cell'+(j===0?' sl-rowlabel':'')+(k===Math.min(i,5)?' focus':'')+(j===selected?' selected':''),xs[j],ys[k],ws[j],hs[k],v)));
        const n=notes[i];node(p,'sl-note',0,470,1744,120,head(n[0])+body(n[1]));
        if(i===3){
          const panel=p.querySelector('.sl-note');panel.innerHTML=head('选中 Managed · 例：available_commands = [steer, cancel]')+'<div class="sl-controls">'+pill('调整后续步骤 · steer')+pill('取消任务 · cancel')+body('External：注册成功仍需验证派发执行。')+'</div>';
        }
        if(i===6){
          const panel=p.querySelector('.sl-note');panel.innerHTML=head('选中 Hosted · 例：available_commands = [cancel]')+'<div class="sl-controls">'+pill('取消任务 · cancel')+pill('恢复观察 · snapshot / events')+pill('checkpoint_restore: false','warm')+'</div>';
        }
      }
    }
    const audit=e=>e.nodeType===3?e.textContent:e.nodeType!==1?'':e.tagName==='BR'?'\n':Array.from(e.childNodes).map(audit).join('')+(['DIV','SPAN'].includes(e.tagName)?'\n':'');
    phases.forEach((p,i)=>screen.push({phase:spec.phase_names[i],start:start+cues[i],end:start+(cues[i+1]??duration),text:audit(p).trim()}));
    const persistent=Array.from(wrap.children).filter(e=>!phases.includes(e)&&!e.classList.contains('sl-transfer'));
    screen.push({phase:'persistent',start,end:start+duration,text:persistent.map(audit).filter(Boolean).join('\n')});
    wrap.querySelectorAll('.sl-node:not(.sl-layer)').forEach(e=>{
      const key='service:'+type+':'+e.style.left+':'+e.style.top;e.dataset.readingKey=key;const counts={};
      e.querySelectorAll('.sl-label,.sl-h,.sl-body,.sl-mono,.sl-pill').forEach(leaf=>{const role=[...leaf.classList].find(c=>c.startsWith('sl-'));const n=counts[role]||0;counts[role]=n+1;leaf.dataset.readingKey=key+':'+role+':'+n;});
      e.querySelectorAll('*').forEach(leaf=>{
        if(leaf.dataset.readingKey||![...leaf.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return;
        const role=leaf.tagName.toLowerCase(),n=counts[role]||0;counts[role]=n+1;leaf.dataset.readingKey=key+':'+role+':'+n;
      });
    });
    motion.sort((a,b)=>a.at-b.at);
    const sources=type==='replay'?[{source_id:'as-528e3df546ca',locator:'Restore a snapshot / Interpret events and status / Pagination, reconnects, and expiration'},{source_id:'as-79adbb1a7334',locator:'How Sessions and Turns relate / Read results and restore a page'}]:[{source_id:'as-79adbb1a7334',locator:'Sessions and tasks / Add requirements or context / Continue from a checkpoint'},{source_id:'as-d5dd49d8dc6e',locator:'Choose a transport / Java HTTP integration / Python with HTTP runtime transport'},{source_id:'as-556d0c6a5726',locator:'Preparation and execution / Events, approval and recovery / Track and control work through the API'}];
    return {root:wrap,type,duration,identities:{...identities},phase_names:[...spec.phase_names],cues:Object.fromEntries(spec.phase_names.map((n,i)=>[n,cues[i]])),motion_windows:motion,screen_text:screen,phases,sources};
  }
  window.ServiceLab={build,specs};
})();
