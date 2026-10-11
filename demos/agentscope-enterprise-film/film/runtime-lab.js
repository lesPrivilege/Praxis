/* Seekable runtime mechanisms. All changes are authored on the supplied timeline. */
(function(){
  'use strict';
  const specs={
    state:{duration:54,phase_names:['persisted','own_tail_asking','observed_other_ignored','submitted_unresolved','matching_result','persisted_resumable'],cues:[0,8,16,24,34,44]},
    lock:{duration:54,phase_names:['contention','acquired_before_load','event_logged','event_live','persisted_before_release','next_worker_loads','stale_branch'],cues:[0,7,14,21,29,38,46]},
    background:{duration:54,phase_names:['synchronous_wait','offloaded','observer_disconnected','watcher_completed','inbox_wakeup','locked_resume','process_exit'],cues:[0,7,14,22,30,39,47]}
  };
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const label=s=>'<div class="rl-label">'+s+'</div>',head=s=>'<div class="rl-h">'+s+'</div>',body=s=>'<div class="rl-body">'+s+'</div>',mono=s=>'<div class="rl-mono">'+s+'</div>',chrome=s=>'<div class="rl-chrome">'+s+'</div>';
  const chip=(s,c='')=>'<span class="rl-chip '+c+'">'+s+'</span>';
  function build(type,options){
    const spec=specs[type];if(!spec)throw new Error('Unknown RuntimeLab type: '+type);
    const {root,tl}=options;if(!root||!tl)throw new Error('RuntimeLab requires root and timeline');
    const start=options.start??0,duration=options.duration??spec.duration;
    if(!Number.isFinite(start)||!Number.isFinite(duration)||duration<=0)throw new Error('RuntimeLab timing must be finite');
    const input=options.cues;
    const cues=spec.phase_names.map((n,i)=>{const v=Array.isArray(input)?input[i]:input&&input[n];return typeof v==='number'?v:v&&typeof v.at==='number'?v.at:spec.cues[i];});
    if(cues.some((v,i)=>!Number.isFinite(v)||v<0||(i&&v<=cues[i-1]))||cues.at(-1)+1>duration)throw new Error('RuntimeLab cues must increase and fit duration');
    const alias=options.identities??{};
    if(typeof alias!=='object'||Array.isArray(alias))throw new Error('RuntimeLab identities must be an object');
    const identities={session_id:'S1',agent_id:'A1',reply_id:'R2',tool_call_id:'T2',task_id:'BG2'};
    for(const k of Object.keys(identities))if(Object.prototype.hasOwnProperty.call(alias,k)){
      if(typeof alias[k]!=='string'||!alias[k].trim())throw new Error('RuntimeLab '+k+' must be a nonempty string');identities[k]=alias[k];
    }
    const I=Object.fromEntries(Object.entries(identities).map(([k,v])=>[k,esc(v)]));
    function node(parent,cls,key,x,y,w,h,html){
      const e=document.createElement('div');e.className='rl-node '+cls;e.dataset.readingKey='runtime:'+type+':'+key;
      Object.assign(e.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});if(html!=null)e.innerHTML=html;parent.appendChild(e);
      const counts={};e.querySelectorAll('*').forEach(leaf=>{
        if(![...leaf.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return;
        const role=[...leaf.classList].find(c=>c.startsWith('rl-'))||leaf.tagName.toLowerCase(),n=counts[role]||0;counts[role]=n+1;
        leaf.dataset.readingKey=e.dataset.readingKey+':'+role+':'+n;
      });return e;
    }
    const wrap=node(root,'rl rl-'+type,'stage',options.x??88,options.y??300,1744,590);
    const phases=[],motion=[];
    function record(at,duration,purpose){motion.push({at,duration,purpose});}
    function phase(i){
      const p=node(wrap,'rl-layer','phase-'+spec.phase_names[i],0,0,1744,590);p.dataset.phase=spec.phase_names[i];phases.push(p);
      gsap.set(p,{autoAlpha:0});tl.to(p,{autoAlpha:1,duration:.65,ease:'power3.out'},start+cues[i]);record(cues[i],.65,'state_change');
      if(i<cues.length-1){tl.to(p,{autoAlpha:0,duration:.4},start+cues[i+1]);record(cues[i+1],.4,'retire_previous_state');}return p;
    }
    function transfer(s,x,y,dx,dy,at,d=1.5){
      const e=node(wrap,'rl-transfer','transfer',x,y,235,54,s);e.dataset.readingTransient='true';e.querySelectorAll('*').forEach(n=>n.dataset.readingTransient='true');
      gsap.set(e,{autoAlpha:0});tl.to(e,{autoAlpha:1,duration:.1},start+at);tl.to(e,{x:dx,y:dy,duration:d,ease:'power2.inOut'},start+at);tl.to(e,{autoAlpha:0,duration:.2},start+at+d-.2);record(at,d,'identity_preserving_delivery');
    }
    node(wrap,'rl-identity','identity',0,0,1744,49,'会话 '+I.session_id+'　/　Agent '+I.agent_id+'　/　回复 '+I.reply_id+'　/　写任务 '+I.tool_call_id);
    if(type==='state'){
      const tailStates=['已载入持久状态','等待用户确认','观察到另一 Agent','已批准，等待外部结果','匹配结果补入原消息','继续原回复并保存'];
      const verdicts=['尚无待处理调用','parked = true · 等确认','parked = false · 作者不匹配','parked = true · 缺匹配结果','parked = false · 结果已补齐','parked = false · 可继续'];
      const notes=[
        'AgentState 把上下文、当前回复、权限、工具与任务状态一起保存为 JSON。',
        '只检查该 Agent 的尾部 assistant Msg；ASKING 表示等待用户确认。',
        '尾部若来自另一 Agent，返回空等待列表；观察消息不代表本 Agent 仍在等待。',
        'SUBMITTED 且原消息没有同 ID 的 ToolResultBlock，才等待外部执行结果。',
        '同一消息已有 ToolResultBlock('+I.tool_call_id+')；SUBMITTED 调用不再被当成等待。',
        '保存后仍是 '+I.session_id+' / '+I.reply_id+'。下次请求根据本 Agent 的尾部消息，决定等待还是继续。'
      ];
      for(let i=0;i<6;i++){
        const p=phase(i);
        node(p,'rl-ink','agentstate',0,72,652,400,label('AgentState · 持久 JSON 单元')+head('session_id: '+I.session_id)+mono('summary + context<br>reply_context: '+I.reply_id+'<br>permission_context: DEFAULT<br>tool_context · 已激活工具<br>tasks_context · 任务记录<br>middle_context · 中间件状态'));
        node(p,'rl-paper','tail-message',694,72,1050,292,label('context[-1] · 尾部 assistant Msg')+head(tailStates[i])+mono('name: '+(i===2?'Reviewer':I.agent_id)+'　/　id: '+(i===2?'OBS1':I.reply_id))+'<div class="rl-call">'+mono(i===0?'当前没有待处理 tool_call':i===2?'观察调用 OBS-T · ASKING':'tool_call '+I.tool_call_id+' · '+(i===1?'ASKING':'SUBMITTED'))+'</div>'+body(i===4||i===5?'tool_result '+I.tool_call_id+' · success':i===2?'属于 Reviewer，不属于 '+I.agent_id:i===0?'检查未压缩上下文的最后一条消息':'tool_result '+I.tool_call_id+' · 尚未出现'));
        node(p,'rl-verdict'+(i===1||i===3?' wait':''),'waiting-verdict',694,384,1050,88,verdicts[i]);
        node(p,'rl-rule','state-explanation',0,494,1744,96,notes[i]);
      }
      transfer('结果 '+I.tool_call_id,1010,293,380,0,cues[4]+.8,1.4);
    }
    if(type==='lock'){
      const current=[0,0,0,0,1,1,1];
      const owner=['尚未取得','W1 持有','W1 持有','W1 持有','W1 持有','W2 持有','错误分支 · 先读后锁'];
      const w1=['申请运行权','拿锁 → 读取 state v0','推进 '+I.reply_id+'，写事件 e1','事件 e1 → live channel','已保存消息 / state v1 / cursor','保存完成 → 释放 run lock','W1 已写入 v1'];
      const w2=['同时申请 → 等锁','等锁；不提前读取','等锁；不提前读取','等锁；不提前读取','仍等锁，写入必须先完成','拿锁 → 读取最新 state v1','错误：拿锁后仍用旧 v0'];
      const notes=[
        'run lock 保护同一会话的推进；两个 worker 不能各自用旧状态运行。',
        '先拿锁，再载入可变 Session / AgentState；等待者不预先装配旧快照。',
        '每个事件先追加 replay log，取得 entry ID；此刻 live channel 还未发送。',
        '再把同一事件和 entry ID 发到 live channel；断线补历史依靠日志。',
        'checkpoint lock 保护消息、AgentState 与 cursor 的组合写入；run lock 仍保持。',
        '写入完成才释放 run lock；W2 拿到运行权后读到 v1，再继续原会话。',
        '先读 v0 再等锁：W1 已存 v1，W2 却按 v0 推进。应拿锁后重新读取。'
      ];
      for(let i=0;i<7;i++){
        const p=phase(i);
        node(p,'rl-worker','worker-W1',0,75,228,104,head('W1')+chrome('Worker · '+I.session_id));
        node(p,'rl-lane','lane-W1',270,73,1474,104,body(w1[i])+chip('运行权：'+owner[i],i===6?'warm':''));
        node(p,'rl-worker wait','worker-W2',0,192,228,104,head('W2')+chrome('Worker · '+I.session_id));
        node(p,'rl-lane','lane-W2',270,190,1474,104,body(w2[i])+chip(i===5?'已取得 run lock':i===6?'旧快照 v0 ×':'等待同一 run lock',i===5?'':'warm'));
        node(p,'rl-paper rl-store','storage',0,318,740,124,label('Storage · '+I.session_id)+head('state v'+current[i]+' · 消息 '+I.reply_id+(current[i]?' · cursor c1':'')));
        node(p,'rl-event-row','event-log',778,318,966,61,label('replay log')+body(i>=2?'e1 · '+I.reply_id+' / '+I.tool_call_id+' · 已追加':'空：事件尚未写入'));
        node(p,'rl-event-row','live-channel',778,381,966,61,label('live channel')+body(i>=3?'e1 · 与日志使用相同 entry ID':'尚未发送'));
        node(p,'rl-body','lease-implementation',0,457,1744,43,'Service 传入 TTL = 600s；Redis lease 续期；内存 acquire_lock 不因 TTL 自动过期。');
        node(p,'rl-rule','lock-explanation',0,510,1744,80,notes[i]);
      }
      transfer('e1 · 先写日志',1010,294,265,29,cues[2]+.8,1.2);
      transfer('e1 · 再发 live',1300,320,0,64,cues[3]+.8,1.2);
    }
    if(type==='background'){
      const titles=['普通工具同步等待','超过 10s · 返回占位','页面连接断开','watcher 收到真实结果','结果写入 inbox，触发 wakeup','拿会话锁，续接原工作','失败分支 · 完成前进程退出'];
      const tool=['tool '+I.tool_call_id+' · running','drain_task 仍运行','drain_task 仍运行','drain_task 完成 · success','真实结果已投递','原会话 '+I.session_id+' 继续推理','任务未完成时，进程退出'];
      const watchers=['尚未卸载','watcher 持有 '+I.task_id,'watcher 继续持有 '+I.task_id,'汇总结果；task handle 清理','inbox 投递完成','接续 worker 继续原会话','停机取消 task；watcher 结束'];
      const inbox=['无结果','先返回 synthetic 占位','页面离线；inbox 尚无真实结果','准备 HintBlock('+I.task_id+')','inbox('+I.session_id+') + wakeup','run lock → inbox → 继续推理','registry('+I.task_id+') 只是 metadata'];
      const notes=[
        '当前 Service 的普通工具默认等待 10 秒；状态注入与外部工具走同步路径。',
        '卸载阈值只结束同步等待：底层工具 task 继续，本进程 watcher 接住它。',
        '页面断开停止观察；watcher 持有的工具任务仍运行，结果仍回到 '+I.session_id+'。',
        '工具完成后，watcher 将结果构造成 HintBlock；保留原会话与后台任务身份。',
        '结果进原会话 inbox，再 enqueue wakeup；空闲会话可被任一 worker 唤醒。',
        '先拿 '+I.session_id+' 的 run lock，再消费 inbox 结果；可在同一 run 或新的 wakeup run 继续。',
        '硬重启没有原 asyncio task。即使 registry 暂时有旧记录，也不能据此宣称恢复执行。'
      ];
      for(let i=0;i<7;i++){
        const p=phase(i);
        node(p,'rl-boundary'+(i===6?' rl-stop':''),'process-boundary',0,70,1196,410,'');
        node(p,'rl-chrome','process-label',23,83,1130,36,'应用进程　·　'+(i===6?'已退出':'活跃')+'　·　任务与 watcher 的生命周期');
        node(p,'rl-h','offload-heading',25,132,1150,50,titles[i]);
        if(i===0){
          node(p,'rl-axis','threshold-axis',25,234,1110,80,'');
          node(p,'rl-axis-label','axis-zero',25,256,200,48,'调用开始');
          node(p,'rl-threshold','threshold',548,212,580,82,head('10s 卸载阈值')+chrome('工具继续执行；同步等待结束'));
        }else{
          node(p,'rl-focus'+(i===6?' rl-warm':''),'tool-task',25,204,1146,98,body(tool[i])+chrome('task_id: '+I.task_id+'　/　tool_call: '+I.tool_call_id));
        }
        node(p,'rl-focus'+(i===6?' rl-warm':''),'watcher',25,315,1146,111,head(watchers[i])+body(i===0?'执行线程等待结果':i===6?'任务不会因 registry 记录重建':i<3?'进程内 asyncio task；页面不持有它':'按原 task / session 身份送回结果'));
        node(p,'rl-chrome','registry',25,433,1140,32,i===6?'崩溃可留下 stale registry；这不是存活任务':'BackgroundTaskManager · local handle + registry metadata');
        node(p,'rl-paper'+(i===2?' rl-stop':''),'observer',1230,70,514,174,label('页面 · 只观察')+head(i===2?'连接 × 断开':i===6?'需重新查执行状态':'观察 '+I.session_id)+body(i===2?'工具未被取消':i===6?'旧记录不能证明存活':'连接生命周期独立'));
        node(p,'rl-paper','inbox',1230,251,514,229,label('继续工作的入口')+head(i===5?'原会话续接':i===4?'唤醒 '+I.session_id:i===6?'无自动恢复':'原会话 '+I.session_id)+body(inbox[i]));
        node(p,'rl-rule','background-explanation',0,510,1744,80,notes[i]);
      }
      transfer('Hint · '+I.task_id,947,440,310,0,cues[4]+.8,1.7);
    }
    const audit=e=>e.nodeType===3?e.textContent:e.nodeType!==1?'':e.tagName==='BR'?'\n':Array.from(e.childNodes).map(audit).join('')+(['DIV','SPAN'].includes(e.tagName)?'\n':'');
    const screen=phases.map((p,i)=>({phase:spec.phase_names[i],start:start+cues[i],end:start+(cues[i+1]??duration),text:audit(p).trim()}));
    screen.push({phase:'persistent',start,end:start+duration,text:Array.from(wrap.children).filter(e=>!phases.includes(e)&&!e.dataset.readingTransient).map(audit).filter(Boolean).join('\n')});
    motion.sort((a,b)=>a.at-b.at);
    const sources=type==='state'?[{source_id:'as-614314fd8b6b',locator:'AgentState fields / append_context / get_awaiting_tool_calls'},{source_id:'as-188d64eb8aa5',locator:'Run agent / State and incoming events'}]:type==='lock'?[{source_id:'as-73da307b2ffd',locator:'ChatService._run_impl 804–850 / persistence 1476–1512'},{source_id:'as-68f5bb723b26',locator:'publish_session_event 37–66'},{source_id:'as-ebaf50819a12',locator:'acquire_lock 629–700'},{source_id:'as-e2af92fa9ac1',locator:'acquire_lock 362–399'},{source_id:'as-19629c6bf4d8',locator:'SESSION_RUN_TTL_SECS'}]:[{source_id:'as-0791af56faa2',locator:'ToolOffloadMiddleware timeout_secs / timeout path / inbox delivery 68–394'},{source_id:'as-d612211accc9',locator:'register_task 249–328 / __aexit__ 446–470'},{source_id:'as-73da307b2ffd',locator:'ToolOffloadMiddleware assembly 984–995 / run lock acquisition'}];
    return {root:wrap,type,duration,identities:{...identities},phase_names:[...spec.phase_names],cues:Object.fromEntries(spec.phase_names.map((n,i)=>[n,cues[i]])),motion_windows:motion,screen_text:screen,phases,sources};
  }
  window.RuntimeLab={build,specs};
})();
