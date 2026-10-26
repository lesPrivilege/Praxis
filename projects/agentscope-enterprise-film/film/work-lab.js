/* Contract work and workspace exhibits; all visual state is a function of timeline time. */
(function () {
  'use strict';
  const specs = {
    isolation:{duration:58,phase_names:['default_agent','new_session','session_scope','user_scope','resource_scopes','backends','access_boundary'],cues:[0,7,15,23,31,41,49]},
    closure:{duration:90,phase_names:['input','missing_basis','supplemented','candidate','confirm_T2','written','artifact','accepted','unknown_receipt','receipt_checked'],cues:[0,8,16,24,33,43,52,61,70,80]},
  };
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tag=s=>'<div class="wl-label">'+s+'</div>';
  const h=s=>'<div class="wl-h">'+s+'</div>';
  const b=s=>'<div class="wl-body">'+s+'</div>';
  const pill=(s,c='')=>'<span class="wl-pill '+c+'">'+s+'</span>';
  function node(parent,cls,x,y,w,h,html){const e=document.createElement('div');e.className='wl-node '+cls;Object.assign(e.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});if(html!=null)e.innerHTML=html;parent.appendChild(e);return e;}
  function build(type,options){
    const spec=specs[type];if(!spec)throw new Error('Unknown WorkLab type: '+type);
    const {root,tl}=options;if(!root||!tl)throw new Error('WorkLab requires root and timeline');
    const start=options.start??0,duration=options.duration??spec.duration;
    if(!Number.isFinite(start)||!Number.isFinite(duration)||duration<=0)throw new Error('WorkLab timing must be finite');
    const cues=spec.phase_names.map((name,i)=>{const v=Array.isArray(options.cues)?options.cues[i]:options.cues&&options.cues[name];return typeof v==='number'?v:v&&typeof v.at==='number'?v.at:spec.cues[i];});
    if(cues.some((v,i)=>!Number.isFinite(v)||v<0||(i&&v<=cues[i-1]))||cues.at(-1)+1>duration)throw new Error('WorkLab cues must increase and fit duration');
    const identityInput=options.identities??{};
    if(typeof identityInput!=='object'||Array.isArray(identityInput))throw new Error('WorkLab identities must be an object');
    const identities={user_id:'U-A',agent_id:'A',other_agent_id:'B',python_session_id:'PA1',other_python_session_id:'PA2',other_agent_session_id:'PB1',reply_id:'R2',tool_call_id:'T2',session_id:'JS1',file_id:'JF1',artifact_id:'JA1',external_call_id:'XW1',filename:'contract-v3.pdf',result_filename:'review-v3.md'};
    for(const k of Object.keys(identities))if(Object.prototype.hasOwnProperty.call(identityInput,k)){
      if(typeof identityInput[k]!=='string'||!identityInput[k].trim())throw new Error('WorkLab '+k+' must be a nonempty string');identities[k]=identityInput[k];
    }
    const I=Object.fromEntries(Object.entries(identities).map(([k,v])=>[k,esc(v)]));
    const wrap=node(root,'wl wl-'+type,options.x??88,options.y??300,1744,590),phases=[],motion=[],screen=[];
    function record(at,duration,purpose){motion.push({at,duration,purpose});}
    function phase(i){const p=node(wrap,'wl-layer',0,0,1744,590);p.dataset.phase=spec.phase_names[i];phases.push(p);gsap.set(p,{autoAlpha:0});tl.to(p,{autoAlpha:1,duration:.65,ease:'power3.out'},start+cues[i]);record(cues[i],.65,'state_change');if(i<cues.length-1)tl.to(p,{autoAlpha:0,duration:.35},start+cues[i+1]);return p;}
    function line(parent,x,y,w,vertical=false,c=''){return node(parent,'wl-line '+(vertical?'vertical ':'')+c,x,y,vertical?3:w,vertical?w:3);}
    function arrow(parent,x,y,w,c=''){return node(parent,'wl-arrow '+c,x,y,w,42);}
    function document(parent,x,y,filename,kind,extra='',wide=440){return node(parent,'wl-document '+kind,x,y,wide,142,'<span class="wl-page-icon" aria-hidden="true"></span><div class="wl-doc-copy">'+tag(kind==='result'?'复核结果 · v3':'输入材料 · v3')+h(filename)+b(extra)+'</div>');}
    function sweep(parent,x,y,dx,dy,at,kind='file'){const e=node(parent,'wl-flight '+kind,x,y,66,76,'');e.dataset.readingTransient='true';gsap.set(e,{autoAlpha:0});tl.to(e,{autoAlpha:1,duration:.1},start+at);tl.to(e,{x:dx,y:dy,duration:1.4,ease:'power2.inOut'},start+at);tl.to(e,{autoAlpha:0,duration:.2},start+at+1.2);record(at,1.4,'material_transfer');}
    if(type==='isolation'){
      node(wrap,'wl-identity',0,0,1744,48,'Python Agent Service · 用户 '+I.user_id+' · '+I.filename+' · 工作区分配');
      const sessions=[I.python_session_id,I.other_python_session_id,I.other_agent_session_id];
      const policies=['per_agent · 默认','per_agent · 同一 Agent 的新会话','per_session · 配置对照','per_user · 配置对照'];
      for(let i=0;i<4;i++){
        const p=phase(i);
        node(p,'wl-section-title',0,72,475,52,'会话与 Agent');
        node(p,'wl-agent-group',0,142,480,218,tag('Agent '+I.agent_id)+h('合同复核'));
        node(p,'wl-agent-group secondary',0,386,480,126,tag('Agent '+I.other_agent_id)+h('合同归档'));
        node(p,'wl-session selected',27,262,197,78,'会话 '+sessions[0]);
        if(i>0)node(p,'wl-session'+(i!==2?' selected':''),254,262,197,78,'会话 '+sessions[1]);
        node(p,'wl-session'+(i===3?' selected':''),254,410,197,78,'会话 '+sessions[2]);
        node(p,'wl-section-title',566,72,700,52,policies[i]);
        const zone=node(p,'wl-directory',566,144,702,368,tag(i===2?'每个会话一个工作区':i===3?'同一用户一个工作区':'每个 Agent 一个工作区'));
        if(i===2){
          node(zone,'wl-scope-badge',28,66,632,44,'当前会话 '+sessions[0]);
          document(zone,29,125,I.filename,'input','保存于当前工作目录',638);
          node(zone,'wl-mini-folders',28,275,640,65,'<span>'+sessions[1]+' · 独立目录</span><span>'+sessions[2]+' · 独立目录</span>');
        }else{
          document(zone,29,112,I.filename,'input','保存于当前工作目录',638);
          node(zone,'wl-members',28,268,640,64,i===3?'共用：'+sessions.join(' / '):'共用：'+sessions.slice(0,i===0?1:2).join(' / '));
        }
        arrow(p,490,267,63);
        node(p,'wl-visibility',1320,144,424,368,tag('此文件的目录可见范围')+h(i===3?'同一用户的两个 Agent':i===2?'仅当前会话':'仅 Agent '+I.agent_id)+b('会话 '+sessions[0]+'　可见')+(i>0?b('会话 '+sessions[1]+'　'+(i===2?'不可见':'可见')):'')+b('会话 '+sessions[2]+'　'+(i===3?'可见':'不可见')));
        const notes=['Agent '+I.agent_id+' 与 Agent '+I.other_agent_id+' 分到不同工作区；合同文件保存在 '+I.agent_id+' 的目录。','同一 Agent 新开会话 '+sessions[1]+'，仍落到原工作区，继续看到原文件。','新建会话按 per_session 分配；'+sessions[1]+' 不会继承 '+sessions[0]+' 的工作目录。','新建会话按 per_user 分配；Agent '+I.other_agent_id+' 也会落到同一用户的工作目录。'];
        node(p,'wl-note',0,536,1744,54,notes[i]);
      }
      {
        const p=phase(4);
        node(p,'wl-directory',0,73,515,440,tag('共享文件目录 · per_user')+h('用户 '+I.user_id));
        document(p,25,233,I.filename,'input','多个 Agent 共用文件目录',464);
        node(p,'wl-section-title',574,74,1170,50,'连接与技能仍有各自的分区');
        node(p,'wl-resource-name',574,156,200,135,tag('MCP 连接')+h('Agent<br>＋ Session'));
        const mx=[812,1118,1424];
        sessions.forEach((s,j)=>node(p,'wl-resource-cell',mx[j],156,286,135,tag((j===2?I.other_agent_id:I.agent_id)+' / '+s)+b(j===0?'合同系统连接':j===1?'本会话连接':'归档系统连接')));
        node(p,'wl-resource-name',574,340,200,132,tag('Skills')+h('按 Agent'));
        node(p,'wl-resource-cell skill',812,340,591,132,tag('Agent '+I.agent_id)+b('合同复核技能 · '+sessions[0]+' / '+sessions[1]));
        node(p,'wl-resource-cell skill',1424,340,286,132,tag('Agent '+I.other_agent_id)+b('合同归档技能'));
        node(p,'wl-note',0,536,1744,54,'文件共享粒度、MCP 连接分区与技能分区分别配置；同目录不意味着同一套连接与技能。');
      }
      {
        const p=phase(5);
        node(p,'wl-section-title',0,74,1744,50,'执行后端决定工具在哪里运行');
        const ys=[150,238,326,414],rows=[['Local','主机目录','直接使用主机文件系统；无沙箱'],['Docker','容器 ＋ 挂载目录','目录持久化在主机'],['E2B','云沙箱','按沙箱元数据重新连接'],['K8s','Pod ＋ PVC','按工作区身份连接集群资源']];
        rows.forEach((r,j)=>{
          node(p,'wl-backend-label'+(j===0?' warm':''),0,ys[j],242,70,r[0]);
          node(p,'wl-backend-space',278,ys[j],550,70,r[1]);
          arrow(p,839,ys[j]+15,70);
          node(p,'wl-backend-detail',935,ys[j],809,70,r[2]);
        });
        node(p,'wl-note',0,536,1744,54,'后端选择改变执行环境与持久化方式；调用的读写授权仍由权限规则与具体工具检查。');
      }
      {
        const p=phase(6);
        node(p,'wl-boundary-panel',0,74,800,440,tag('位置与分配')+h('会话记录保存工作区身份')+b('显式 workspace_id 优先于分配策略。')+b('策略变更只影响新分配的会话。'));
        document(p,23,340,I.filename,'input','文件始终落到已绑定的工作目录',752);
        node(p,'wl-seam',835,74,3,440);
        node(p,'wl-boundary-panel auth',872,74,872,440,tag('授权与副作用')+h('找到文件，再检查动作权限')+b('文件可见　→　工具读写检查')+b('共享资源　→　访问策略校验')+pill('目录归属不能代替动作授权','warm'));
        node(p,'wl-note',0,536,1744,54,'工作区确定文件与运行位置；用户身份、资源访问与每次工具调用的授权分别判定。');
      }
      const sharedRoute=phases[1].querySelector('.wl-arrow');
      gsap.set(sharedRoute,{scaleX:0,transformOrigin:'left center'});
      tl.to(sharedRoute,{scaleX:1,duration:.9,ease:'power2.inOut'},start+cues[1]+.8);record(cues[1]+.8,.9,'workspace_resolution');
    }
    if(type==='closure'){
      const rail=['输入','依据','候选','执行','交付','接收'],active=[0,1,1,2,3,3,4,5,4,4];
      const texts=[
        ['复核合同责任上限','输入材料与版本固定','合同第 8 条 + 附件 B','输出：复核意见与引用依据'],
        ['附件 B 尚未提供','缺少依据 → 暂停判断','责任上限的计算口径待核对','补件责任：合同经办人'],
        ['附件 B · v3 已补齐','读取新增依据后继续分析','第 8 条：责任上限取决于附件 B','附件 B：年度费用 × 2'],
        ['候选意见已形成','依据 → 发现 → 建议','发现：主合同与附件口径需保持一致','建议：在批注中标明年度费用基数'],
        ['保存复核文件','Python · 回复 '+I.reply_id+' / 调用 '+I.tool_call_id,'调用：Write '+I.result_filename,'本例调用返回 ASK → 等待确认'],
        ['复核文件已生成','确认后执行原调用 '+I.tool_call_id,'写入 '+I.result_filename,'工具完成；业务交付继续'],
        ['文件发布为 Artifact','Java Managed · Session '+I.session_id,'真实文件 '+I.file_id+' → Artifact '+I.artifact_id,'发布记录关联已上传的结果文件'],
        ['业务接收复核结果','法务复核 · 接收版本 v3','核对正文、引用与下载内容','接收人确认后记录接收状态'],
        ['外部台账写入超时','另一路径 · 业务调用 '+I.external_call_id,'请求已发出，执行结果未知','保持调用身份，先查询台账回执'],
        ['原调用已写入台账','核对 '+I.external_call_id+' → 查到原回执','回执关联 '+I.artifact_id+' 与版本 v3','恢复结果观察，不再次发起写入'],
      ];
      texts.forEach((s,i)=>{
        const p=phase(i);
        node(p,'wl-identity',0,0,1744,48,'合同复核 · 示例业务路径'+(i>=8?' · 外部写入核对分支':''));
        const progress=node(p,'wl-progress',0,73,1744,86);
        rail.forEach((name,j)=>{const x=j*299;node(progress,'wl-step '+(j<active[i]?'done':j===active[i]?'current':''),x,0,242,76,'<span class="wl-step-index">'+(j+1)+'</span>'+name);if(j<5)line(progress,x+250,37,41);});
        const sidebar=node(p,'wl-task-object',0,184,446,329,tag('任务对象')+h(I.filename)+b('输入版本 v3')+b('责任上限复核'));
        node(sidebar,'wl-page-icon large',333,218,65,85);
        const desk=node(p,'wl-workbench'+(i===1||i===4||i===8?' pending':''),486,184,1258,329,tag(s[1])+h(s[0]));
        if(i===0){
          node(desk,'wl-contract-row',25,121,1208,67,b(s[2]));
          node(desk,'wl-contract-row',25,204,1208,75,b(s[3]));
        }
        if(i===1||i===2){
          node(desk,'wl-evidence-row',25,117,1208,77,'<span class="wl-evidence-mark '+(i===1?'missing':'')+'">'+(i===1?'?':'✓')+'</span>'+b('附件 B · '+(i===1?'缺失':'v3 已收到')));
          node(desk,'wl-detail',25,211,1208,100,b(s[2])+b(s[3]));
        }
        if(i===3){
          node(desk,'wl-argument-link',25,119,1208,68,pill('第 8 条')+'<span>＋</span>'+pill('附件 B · v3')+'<span>→</span>'+pill('候选批注'));
          node(desk,'wl-detail',25,211,1208,100,b(s[2])+b(s[3]));
        }
        if(i===4){
          node(desk,'wl-call',25,123,691,150,b(s[2])+pill('ASK · 等待确认','warm'));
          node(desk,'wl-confirmation',754,123,479,150,tag('针对本次调用')+h('用户确认 → 执行'));
        }
        if(i===5){
          document(desk,27,134,I.result_filename,'result','原调用 '+I.tool_call_id+' 已完成',677);
          node(desk,'wl-state-stack',754,119,479,177,pill('已生成','done')+b('尚未发布')+b('尚未业务接收'));
        }
        if(i===6){
          node(desk,'wl-bridge',25,123,1208,46,'Python 执行例　→　材料交付契约　→　Java Managed 交付例');
          const cells=[['工作文件','上传真实字节'],['Session file '+I.file_id,'归属 '+I.session_id],['Artifact '+I.artifact_id,'引用 '+I.file_id]];
          cells.forEach((c,j)=>{node(desk,'wl-file-stage'+(j===2?' published':''),25+j*412,184,376,140,h(c[0])+b(c[1]));if(j<2)arrow(desk,405+j*412,233,29);});
        }
        if(i===7){
          node(desk,'wl-receive-file',25,119,700,172,tag('已发布 Artifact '+I.artifact_id)+h(I.result_filename)+b('可下载文件与结果内容一致'));
          node(desk,'wl-confirmation done',766,119,467,172,tag('业务接收记录')+h('法务 · v3')+pill('已接收','done'));
        }
        if(i===8){
          node(desk,'wl-external',25,116,516,173,tag('业务台账')+h('调用 '+I.external_call_id)+b('连接超时 · 结果未知'));
          arrow(desk,561,176,63,'warm');
          node(desk,'wl-receipt',660,116,573,173,tag('接入方恢复逻辑')+h('查询原调用回执')+b('保持版本与调用身份'));
        }
        if(i===9){
          node(desk,'wl-external resolved',25,116,516,173,tag('业务台账回执')+h(I.external_call_id+' · 已写入')+b('关联 '+I.artifact_id+' / v3'));
          arrow(desk,561,176,63);
          node(desk,'wl-receipt',660,116,573,173,tag('恢复原任务结果')+h('读取既有记录')+pill('写入次数保持 1','done'));
        }
        const notes=['输入版本、复核范围和输出要求形成这次任务的契约。','缺少计算依据时先补材料；当前输入不足以形成可执行结论。','补件沿原任务继续；输入版本有实质变化时，需要重新核对受影响的判断。','候选意见承载依据和建议；形成候选本身不触发外部写入。','ASK 是本次调用的判定结果；确认绑定 '+I.reply_id+' / '+I.tool_call_id+' 和具体写入范围。','原调用 '+I.tool_call_id+' 完成，只证明本次工具执行；文件交付与业务接收各有检查。','先上传核实的结果文件，再显式发布；从真实 Artifact 记录取得文件身份与下载内容。','已生成、已发布、已接收分别记录；发布动作不会自动替业务方验收。','超时不能推断未执行；接入方保留尝试身份，核对外部影响后决定恢复。','原回执证明既有写入；继续读取与观察，不把页面恢复变成重复提交。'];
        node(p,'wl-note',0,536,1744,54,notes[i]);
      });
      sweep(phases[2],408,258,495,0,cues[2]+.9);
      sweep(phases[5],790,420,411,0,cues[5]+.9,'result');
    }
    const audit=e=>e.nodeType===3?e.textContent:e.nodeType!==1?'':e.tagName==='BR'?'\n':Array.from(e.childNodes).map(audit).join('')+(['DIV','SPAN'].includes(e.tagName)?'\n':'');
    phases.forEach((p,i)=>screen.push({phase:spec.phase_names[i],start:start+cues[i],end:start+(cues[i+1]??duration),text:audit(p).trim()}));
    const persistent=Array.from(wrap.children).filter(e=>!phases.includes(e)&&!e.classList.contains('wl-flight'));
    screen.push({phase:'persistent',start,end:start+duration,text:persistent.map(audit).filter(Boolean).join('\n')});
    wrap.querySelectorAll('.wl-node:not(.wl-layer)').forEach(e=>{
      if(e.classList.contains('wl-flight'))return;
      const key='work:'+type+':'+e.style.left+':'+e.style.top+':'+[...e.classList].filter(c=>c!=='wl-node')[0];e.dataset.readingKey=key;
      const counts={};e.querySelectorAll('*').forEach(leaf=>{
        if(![...leaf.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return;
        const role=[...leaf.classList].find(c=>c.startsWith('wl-'))||leaf.tagName.toLowerCase(),n=counts[role]||0;counts[role]=n+1;leaf.dataset.readingKey=key+':'+role+':'+n;
      });
    });
    // The file is one object even when a different layout changes its coordinates.
    wrap.querySelectorAll('.wl-document.input .wl-h,.wl-task-object > .wl-h').forEach(e=>{e.dataset.readingKey='work:'+type+':input:filename';});
    wrap.querySelectorAll('.wl-document.result .wl-h,.wl-receive-file > .wl-h').forEach(e=>{e.dataset.readingKey='work:'+type+':result:filename';});
    motion.sort((a,b)=>a.at-b.at);
    const sources=type==='isolation'?[{source_id:'as-00c6583072da',locator:'Isolation grain / End-to-end request flow / Distributed deployment'},{source_id:'as-dc202a66c974',locator:'Workspace implementation and isolation / Workspace MCPs / Workspace skills'},{source_id:'as-e8bf00e52cb9',locator:'Interface / workspace implementations'}]:[{source_id:'as-7dad78a203b5',locator:'Overview / Decision Matrix; ASK is conditional, not automatic for every write'},{source_id:'as-69ccfb190c6d',locator:'Upload a Session file / Download and deliver; Managed file and Artifact identity'},{source_id:'as-79adbb1a7334',locator:'Add requirements or context / Read results and restore a page'},{source_id:'kit-work-contract',locator:'kit/grammar/work.md: 外部动作结果未知 / 运行完成 / 材料接收; business teaching design'}];
    return {root:wrap,type,duration,identities:{...identities},phase_names:[...spec.phase_names],cues:Object.fromEntries(spec.phase_names.map((n,i)=>[n,cues[i]])),motion_windows:motion,screen_text:screen,phases,sources};
  }
  window.WorkLab={build,specs};
})();
