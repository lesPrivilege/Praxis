/* Deterministic explanatory exhibits. All mutations are GSAP timeline operations;
   no playback callbacks, timers, random IDs, or business execution. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const specs = {
    events: { duration: 35, phase_names: ['reply_start', 'text_delta', 'text_end', 'tool_result', 'reply_end'], cues: [0, 6, 13, 21, 28] },
    permission: { duration: 35, phase_names: ['tool_call', 'input_validated', 'ask_parked', 'confirmed', 'executing', 'result'], cues: [0, 5, 10, 18, 23, 29] },
    offload: { duration: 34, phase_names: ['context', 'compressed', 'offloaded', 'read_back'], cues: [0, 8, 16, 25] },
    artifact: { duration: 35, phase_names: ['working_file', 'session_file', 'published', 'record_read', 'downloaded'], cues: [0, 7, 14, 21, 28] },
  };
  function node(p, cls, x, y, w, h, html) {
    const e = document.createElement('div'); e.className = 'ml-node ' + cls;
    Object.assign(e.style, { left: x + 'px', top: y + 'px' });
    if (w != null) e.style.width = w + 'px'; if (h != null) e.style.height = h + 'px';
    if (html != null) e.innerHTML = html; p.appendChild(e); return e;
  }
  function svg(p) { const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 1744 590'); s.setAttribute('width', '1744'); s.setAttribute('height', '590'); Object.assign(s.style, { position: 'absolute', inset: '0', pointerEvents: 'none' }); p.appendChild(s); return s; }
  function path(s, d, cls) { const e = document.createElementNS(NS, 'path'); e.setAttribute('d', d); e.setAttribute('class', 'ml-line ' + (cls || '')); s.appendChild(e); return e; }
  function arrow(s, x1, y1, x2, y2, cls) { path(s, `M${x1},${y1} L${x2},${y2}`, cls); const a = Math.atan2(y2-y1, x2-x1), z=13; path(s, `M${x2-z*Math.cos(a-.5)},${y2-z*Math.sin(a-.5)} L${x2},${y2} L${x2-z*Math.cos(a+.5)},${y2-z*Math.sin(a+.5)}`, cls); }
  function build(type, options) {
    type = ({ event: 'events', context: 'offload', artifacts: 'artifact' })[type] || type;
    const spec = specs[type]; if (!spec) throw new Error('Unknown MechanismLab type: ' + type);
    const { root, tl } = options; if (!root || !tl) throw new Error('MechanismLab requires root and GSAP timeline');
    const identityInput=options.identities ?? {};
    if(typeof identityInput!=='object' || Array.isArray(identityInput)) throw new Error('MechanismLab identities must be an object');
    const identities={reply_id:'R1',tool_call_id:'T1',session_id:'S1',file_id:'F1',artifact_id:'A1'};
    for(const key of Object.keys(identities)) {
      if(!Object.prototype.hasOwnProperty.call(identityInput,key)) continue;
      const value=identityInput[key];
      if(typeof value!=='string' || !value.trim()) throw new Error('MechanismLab '+key+' must be a nonempty string');
      identities[key]=value;
    }
    const outputFilename=options.output_filename ?? 'risk-report.pdf';
    if(typeof outputFilename!=='string' || !outputFilename.trim()) throw new Error('MechanismLab output_filename must be a nonempty string');
    const start = options.start ?? options.from ?? 0;
    const duration = options.duration ?? spec.duration;
    const input = options.cues;
    const cues = spec.phase_names.map((name, i) => {
      const cue = Array.isArray(input) ? input[i] : input && input[name];
      return typeof cue === 'number' ? cue : cue && typeof cue.at === 'number' ? cue.at : spec.cues[i];
    });
    if (cues.some((v,i) => v < 0 || (i && v <= cues[i-1])) || cues.at(-1) + 1 > duration) throw new Error('MechanismLab cues must increase and fit duration');
    const wrap = document.createElement('div'); wrap.className = 'ml ml-' + type;
    if (options.x != null) wrap.style.left=options.x+'px'; if (options.y != null) wrap.style.top=options.y+'px';
    root.appendChild(wrap);
    const windows = [], text = [], phases = [];
    const record = (at, d, purpose) => windows.push({ at, duration:d, purpose });
    function show(e, at, d=.85) { gsap.set(e,{autoAlpha:0,y:14}); tl.to(e,{autoAlpha:1,y:0,duration:d,ease:'power3.out'},start+at); record(at,d,'state_reveal'); }
    function layer(i) {
      const e = node(wrap,'ml-layer',0,0,1744,590); e.dataset.phase = spec.phase_names[i]; phases.push(e);
      gsap.set(e,{autoAlpha:0}); tl.to(e,{autoAlpha:1,duration:.8,ease:'power3.out'},start+cues[i]); record(cues[i],.8,'state_change');
      if (i < cues.length-1) tl.to(e,{autoAlpha:0,duration:.55,ease:'power2.in'},start+cues[i+1]);
      return e;
    }
    function flight(p, label, x, y, dx, dy, at, d=1.5) {
      const e = node(p,'ml-chip',x,y,null,null,label); e.dataset.readingTransient='true'; gsap.set(e,{autoAlpha:0});
      tl.to(e,{autoAlpha:1,duration:.15},start+at);
      tl.to(e,{x:dx,y:dy,duration:d,ease:'power2.inOut'},start+at);
      tl.to(e,{autoAlpha:0,duration:.2},start+at+d-.2); record(at,d,'object_transfer');
    }
    const caseNode = options.caseBadge === false ? null : node(wrap,'ml-case',options.caseX ?? 1420,options.caseY ?? -254,324,34,'合同复核示例');
    const label = (s) => '<div class="ml-label">'+s+'</div>';
    const mono = (s) => '<div class="ml-mono">'+s+'</div>';
    const title = (s) => '<div class="ml-h">'+s+'</div>';
    const body = (s) => '<div class="ml-text">'+s+'</div>';
    const chip = (s,c='') => '<span class="ml-chip '+c+'">'+s+'</span>';

    if (type === 'events') {
      node(wrap,'ml-section',0,8,480,40,'事件流');
      node(wrap,'ml-section',580,8,530,40,'内容块');
      node(wrap,'ml-section',1210,8,530,40,'回复记录');
      const route=svg(wrap); arrow(route,493,249,554,249); arrow(route,1125,249,1185,249);
      const streams = [
        ['REPLY_START','reply_id = R1','TEXT_START','block_id = B1'],
        ['TEXT_DELTA · B1','delta = “发现”','TEXT_DELTA · B1','delta = “责任上限缺失”'],
        ['TEXT_END · B1','reply_id = R1','block_id = B1','文本块结束'],
        ['TOOL_CALL_START','tool_call_id = T1','TOOL_RESULT_END','tool_call_id = T1'],
        ['REPLY_END','reply_id = R1','finished_reason','completed'],
      ];
      for (let i=0;i<5;i++) {
        const p=layer(i);
        node(p,'ml-paper',0,62,495,408,
          label('回复 R1')+'<div class="ml-divider"></div>'+streams[i].map((t,j)=>'<div class="ml-stream-row">'+(j%2===0?t:'<b>'+t+'</b>')+'</div>').join(''));
        node(p,'ml-block',580,95,520,195,label(i===0?'TextBlock · B1':'文本 · B1')+body(i===0?'':i===1?'<span class="ml-first">发现</span><span class="ml-second">责任上限缺失</span>':'发现责任上限缺失')+(i===0?chip('已建立空文本块'):chip(i<2?'接收增量':'文本块已结束')));
        if(i===1) {
          const a=p.querySelector('.ml-first'), b=p.querySelector('.ml-second');
          gsap.set([a,b],{autoAlpha:0});
          tl.to(a,{autoAlpha:1,duration:.15,ease:'none'},start+cues[1]+1.5);
          tl.to(b,{autoAlpha:1,duration:.15,ease:'none'},start+cues[1]+3.1);
          record(cues[1]+1.5,.15,'delta_append'); record(cues[1]+3.1,.15,'delta_append');
        }
        if(i>=3) {
          node(p,'ml-block',580,310,520,178,label('工具调用 · T1')+body('Read：读取合同条款')+body('工具结果 → T1'));
        } else {
          node(p,'ml-pathlabel',600,305,480,120,i===0?'start 建块；delta 追加内容':i===1?'两段 delta 追加到同一个 B1':'TextBlock 留在 content 中，<br>后续块继续追加。');
        }
        node(p,'ml-paper ml-ink',1210,62,534,446,
          label('Assistant')+title('Msg · R1')+'<div class="ml-divider"></div>'+label('有序内容')+
          '<div class="ml-text" style="margin-top:14px">B1 · 文本'+(i>=3?'<br>T1 · 工具调用<br>结果 → T1':'')+'</div>'+
          '<div style="margin-top:25px">'+chip(i===4?'completed · 回复完成':'生成中','ink')+'</div>');
        node(p,'ml-band',0,520,1744,64,[
          'reply_id 关联整次回复 R1；block_id 定位文本块 B1。',
          'delta 追加到 B1，块身份保持稳定。',
          'TEXT_END 结束文本块，回复可以继续产生工具调用。',
          'tool_call_id 把调用与结果配成一对。',
          'REPLY_END 写入 completed，完整回复保存在 Msg · R1。',
        ][i]);
      }
      flight(wrap,'发现',320,169,315,-18,cues[1]+.1,1.4);
      flight(wrap,'责任上限缺失',270,293,365,-142,cues[1]+1.7,1.4);
    }
    if (type === 'permission') {
      node(wrap,'ml-section',0,8,490,40,'模型请求'); node(wrap,'ml-section',596,8,480,40,'执行入口'); node(wrap,'ml-section',1198,8,500,40,'工具与结果');
      for(let i=0;i<6;i++) {
        const p=layer(i), s=svg(p);
        arrow(s,475,180,562,180,'active');
        // The ASK state deliberately has no path through to the executing tool.
        if(i>=3) arrow(s,1082,180,1164,180,'active');
        node(p,'ml-paper',0,62,475,382,label(i===0?'ToolCallBlock · T1':'工具调用 · T1')+title('Write')+mono('目标：reviews/risk.md')+'<div class="ml-divider"></div>'+body('保存合同风险清单')+'<div style="margin-top:27px">'+chip(i<2?'pending':i===2?'asking':i<5?'allowed':'finished',i===2?'ask':'')+'</div>');
        node(p,'ml-paper ml-gate',596,62,486,382,
          label(i===0?'Toolkit · 输入契约':i===1?'JSON / input_schema':'PermissionEngine')+title(['解析参数','校验通过','ASK · 等待确认','ALLOW · 允许执行','进入工具','返回结果'][i])+
          '<div class="ml-divider"></div>'+body([
            '工具已注册并激活<br>解析 JSON 参数',
            '输入字段匹配<br>input_schema',
            'RequireUserConfirmEvent<br>reply_id = R1<br>tool_calls → [T1]',
            'UserConfirmResultEvent<br>reply_id = R1<br>确认 ToolCallBlock T1',
            'ToolResultStartEvent<br>tool_call_id = T1',
            'ToolResultEndEvent<br>tool_call_id = T1',
          ][i]));
        node(p,'ml-paper ml-ink'+(i<4?' ml-dashed':''),1198,62,546,382,
          label('工作区工具')+title(i<4?'尚未执行':i===4?'Write 执行中':'ToolResultBlock')+'<div class="ml-divider"></div>'+body(i<4?'reviews/risk.md':i===4?'写入风险条目与修改建议':'已保存 reviews/risk.md')+
          '<div style="margin-top:29px">'+chip(i<4?'无工具结果':i===4?'state = running':'state = success','ink')+'</div>');
        if(i===2) {
          node(p,'ml-chip ask',678,459,350,56,'parked · 等待用户确认');
          path(s,'M838,444 L838,455','warm');
          node(p,'ml-text ml-orange',1102,155,69,58,'Ⅱ');
        }
        node(p,'ml-band',0,520,1744,64,[
          '工具可用性与参数校验先于 Permission 判断。',
          '参数合法后，Permission 决定此次调用能否执行。',
          'ASK 结束当前 stream；AgentState 保留 R1 / T1 等待续接。',
          '确认结果回到同一 R1 / T1，允许后才进入工具。',
          'ToolResultStartEvent 标记工具真正开始执行。',
          '工具结果回写上下文，Agent 再决定下一步。',
        ][i]);
      }
      flight(wrap,'T1',1000,167,183,0,cues[3]+.6,1.6);
    }
    if (type === 'offload') {
      node(wrap,'ml-section',0,8,600,40,'会话上下文'); node(wrap,'ml-section',1110,8,580,40,'下一次模型输入');
      const rows=['用户：复核合同责任条款','Read：合同全文与附件','Agent：既往风险分析','用户：采用修订稿 v3','Read：本轮待核条款'];
      for(let i=0;i<4;i++) {
        const p=layer(i), s=svg(p);
        node(p,'ml-paper',0,61,620,421,label('AgentState · session_id = S1')+
          '<div style="margin-top:18px">'+rows.slice(i===0?0:3).map(t=>'<div class="ml-slice" style="margin-top:9px">'+t+'</div>').join('')+
          (i>0?'<div style="margin-top:22px">'+chip('最近消息保留在 context')+'</div><div class="ml-divider"></div><div class="ml-small">较早 3 条 → '+(i===1?'等待 Offloader 写入':'已保存到 context.jsonl')+'</div>':''));
        if(i===0) {
          node(p,'ml-brace',625,128,90,205,'}');
          node(p,'ml-text',730,117,280,140,'超过压缩阈值<br>生成 summary');
          arrow(s,675,284,1069,284);
        } else {
          node(p,'ml-bar',717,72,322,146,label('summary')+body('合同待复核<br>沿用修订稿 v3'));
          arrow(s,1045,148,1077,148,'active');
        }
        node(p,'ml-paper ml-ink',1110,61,634,421,label('Model call')+title(i===0?'完整历史':i===3?'摘要与所需细节':'摘要与最近消息')+
          '<div class="ml-divider"></div>'+body(i===0?'system prompt<br>全部 context<br>activated tool schemas':'system prompt<br>summary + recent context<br>activated tool schemas')+
          (i===3?'<div class="ml-ledger-row" style="margin-top:18px;color:#bfe6df">读回：责任上限条款</div>':''));
        if(i>=2) {
          node(p,'ml-paper',704,272,355,239,label('Offloader · S1')+mono('sessions/S1/<br>context.jsonl')+'<div style="margin-top:15px">'+chip(i===2?'消息已保存':'Read / Grep / Glob')+'</div>');
          arrow(s,616,360,692,360,'active');
        }
        if(i===3) {
          arrow(s,1059,392,1097,392,'active');
          node(p,'ml-pathlabel',715,228,340,40,'按文件引用读回细节');
        }
        node(p,'ml-band',0,520,1744,64,[
          '模型输入将超过阈值：压缩较早消息，保留最近上下文。',
          'summary 概括较早消息，context 保留近期对话。',
          '配置 Offloader 后，被压缩消息追加到 context.jsonl，并返回引用。',
          '文件工具按引用读回所需细节，结果重新进入当前上下文。',
        ][i]);
      }
      flight(wrap,'较早消息',445,390,298,-30,cues[2]+.3,1.7);
      flight(wrap,'责任上限条款',858,390,375,-13,cues[3]+.4,1.7);
    }
    if (type === 'artifact') {
      node(wrap,'ml-section',0,8,490,40,'ENVIRONMENT · 工作文件'); node(wrap,'ml-section',628,8,486,40,'MANAGED · 文件与发布'); node(wrap,'ml-section',1250,8,494,40,'APPLICATION · 交付读取');
      for(let i=0;i<5;i++) {
        const p=layer(i), s=svg(p);
        node(p,'ml-paper',0,64,468,419,label('合同复核输出')+title('risk-report.pdf')+
          '<div class="ml-divider"></div>'+body('责任条款与修改建议')+'<div class="ml-page-lines"></div><div class="ml-page-lines" style="width:72%"></div><div class="ml-page-lines" style="width:88%"></div>'+
          '<div style="margin-top:40px">'+chip('工作目录文件')+'</div>');
        if(i>=1) arrow(s,483,234,598,234,'active');
        node(p,'ml-paper',628,64,494,419,label('Managed Session · S1')+title(i===0?'上传结果文件':i===1?'file_id = F1':'Artifact · A1')+
          '<div class="ml-divider"></div>'+mono(i<2?'POST /files<br>risk-report.pdf':'POST /artifacts<br>{ "file_id": "F1" }')+
          '<div style="margin-top:22px">'+chip(i===0?'待上传':i===1?'已上传 · F1':'已发布 · A1')+'</div>'+
          (i>=2?'<div class="ml-small" style="margin-top:22px">Artifact 引用实际 Session file</div>':''));
        if(i>=3) arrow(s,1136,234,1218,234,'active');
        node(p,'ml-paper ml-ink'+(i<3?' ml-dashed':''),1250,64,494,419,label('Application')+title(i<3?'等待交付记录':i===3?'读取 Artifact':'下载实际文件')+
          '<div class="ml-divider"></div>'+mono(i<3?'artifact_id / file_id':i===3?'GET /artifacts/A1<br>file_id = F1':'GET /files/F1/content')+
          '<div style="margin-top:25px">'+chip(i<3?'尚未读取':i===3?'A1 → F1':'risk-report.pdf','ink')+'</div>'+
          (i===4?'<div class="ml-small" style="margin-top:20px">核对文件内容、版本与业务验收</div>':''));
        node(p,'ml-band',0,520,1744,64,[
          '工作区落盘产生工作文件；应用交付仍需建立可读取的记录。',
          '此 Managed 示例上传结果文件，返回本 Session 的 file_id = F1。',
          '显式发布 F1，建立 artifact_id = A1 的交付记录。',
          '应用读取实际 Artifact，取得它引用的 file_id。',
          '应用凭 Session 读取权限下载 F1，再核对实际内容。',
        ][i]);
      }
      flight(wrap,'risk-report.pdf',322,217,358,0,cues[1]+.25,1.6);
      flight(wrap,'A1 → F1',985,217,310,0,cues[3]+.25,1.6);
    }
    if(caseNode) show(caseNode,0,.6);
    // Replace only exact example identities in text nodes, in one pass.
    // Timelines only change transform/opacity/visibility, so later seek cannot
    // restore old IDs. Text-node assignment keeps caller input out of HTML.
    const replacements={R1:identities.reply_id,T1:identities.tool_call_id,S1:identities.session_id,F1:identities.file_id,A1:identities.artifact_id,'risk-report.pdf':outputFilename};
    const textWalker=document.createTreeWalker(wrap,NodeFilter.SHOW_TEXT);
    while(textWalker.nextNode()) {
      const n=textWalker.currentNode;
      n.nodeValue=n.nodeValue.replace(/\brisk-report\.pdf\b|\b(?:R1|T1|S1|F1|A1)\b/g, token=>replacements[token]);
    }
    function auditText(e) {
      if(e.nodeType===3) return e.textContent;
      if(e.nodeType!==1) return '';
      if(e.classList.contains('ml-first') || e.classList.contains('ml-second')) return '';
      if(e.tagName==='BR') return '\n';
      return Array.from(e.childNodes).map(auditText).join('')+(e.tagName==='DIV'?'\n':'');
    }
    phases.forEach((p,i) => text.push({phase:spec.phase_names[i],start:start+cues[i],end:start+(cues[i+1]??duration),text:auditText(p).trim()}));
    if(type==='events') {
      text.push({phase:'delta_append_1',start:start+cues[1]+1.5,end:start+cues[2],text:'发现'});
      text.push({phase:'delta_append_2',start:start+cues[1]+3.1,end:start+cues[2],text:'责任上限缺失'});
    }
    const staticNodes=Array.from(wrap.children).filter(e=>!phases.includes(e)&&e.tagName!=='svg'&&!e.classList.contains('ml-chip'));
    text.push({phase:'persistent',start,end:start+duration,text:staticNodes.map(auditText).filter(Boolean).join('\n')});
    // A layer exit is contained in the next layer's .8-second motion window.
    windows.sort((a,b)=>a.at-b.at);
    // Phase replacement keeps semantic reading identity: geometry identifies the
    // same object, while changed content is still independently auditable.
    wrap.querySelectorAll('.ml-node').forEach(e=>{
      if(e.classList.contains('ml-layer')) return;
      const key='mechanism:'+type+':'+e.style.left+':'+e.style.top; e.dataset.readingKey=key;
      const counts={};
      e.querySelectorAll('.ml-label,.ml-h,.ml-text,.ml-mono,.ml-small,.ml-chip,.ml-stream-row,.ml-ledger-row,.ml-slice').forEach(leaf=>{
        const role=Array.from(leaf.classList).find(c=>c.startsWith('ml-'))||'text';
        const index=counts[role]||0; counts[role]=index+1; leaf.dataset.readingKey=key+':'+role+':'+index;
      });
    });
    return { root:wrap, type, duration, identities:{...identities}, output_filename:outputFilename, phase_names:[...spec.phase_names], cues:Object.fromEntries(spec.phase_names.map((name,i)=>[name,cues[i]])), motion_windows:windows, screen_text:text, phases };
  }
  window.MechanismLab = { build, specs };
})();
