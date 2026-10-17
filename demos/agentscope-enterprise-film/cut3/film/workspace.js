/* AgentScope cut3: paths show sharing; boundaries show execution position. */
(() => {
  const {C,el,group,text,rect,line,path,circle,set,show,move,p,lerp,note}=V3;
  const stroke=(color=C.line,w=2)=>({fill:'none',stroke:color,'stroke-width':w});
  const tx=(g,x,y,s,n=32,o={})=>text(g,x,y,s,n,{key:`ws:${s}`, ...o});
  function grow(e,t,at,d=2){const q=p(t,at,d);set(e,{'stroke-dasharray':'1','stroke-dashoffset':1-q,pathLength:1});show(e,q>0?1:0);}
  function directory(g,x,y,w,h,id){
    const q=group(g,id);path(q,`M${x} ${y+23}V${y}H${x+143}L${x+166} ${y+23}H${x+w}V${y+h}H${x}Z`,{fill:C.paper,stroke:C.ink,'stroke-width':2.5});
    tx(q,x+24,y+68,id,34,{weight:600,mono:true});return q;
  }
  function file(g,x,y){
    const q=group(g,'contract-v3');path(q,`M${x} ${y}H${x+55}L${x+82} ${y+27}V${y+116}H${x}Z`,{fill:C.pale,stroke:C.ink,'stroke-width':2});path(q,`M${x+55} ${y}V${y+27}H${x+82}`,stroke(C.ink));
    line(q,x+18,y+52,x+62,y+52,stroke());line(q,x+18,y+69,x+62,y+69,stroke());
    tx(q,x+108,y+42,'contract-v3.pdf',36,{weight:600,mono:true});tx(q,x+108,y+91,'已在 W-A 的真实工作文件',30,{fill:C.muted});return q;
  }
  V3.register('workspace',{
    title:'同一份文件，哪些会话能看见？',duration:206,covers:['workspace','sandbox'],
    phases:[{at:0,name:'默认 per_agent'},{at:24,name:'同 Agent 新会话'},{at:46,name:'不同 Agent 分目录'},{at:70,name:'per_session 新分配'},{at:94,name:'per_user 新分配'},{at:120,name:'MCP 与 Skills 分区'},{at:147,name:'后端执行位置'},{at:173,name:'绑定与生命周期'}],
    motion:[{at:3,duration:3,purpose:'PA1 路径落到 W-A'},{at:25,duration:3,purpose:'PA2 汇入既有目录'},{at:48,duration:3,purpose:'PB1 分叉到 W-B'},{at:72,duration:3,purpose:'新会话分别分配目录'},{at:96,duration:3,purpose:'同用户的新入口汇合'},{at:121,duration:3,purpose:'资源端口与技能括线展开'},{at:149,duration:3,purpose:'显露 Local 主机边界'},{at:176,duration:3,purpose:'工作区身份连接到后端'}],
    build(svg){
      const g=group(svg,'workspace-map');
      tx(g,100,218,'Python Agent Service · 用户 U-A',32,{fill:C.muted});
      const aLabel=tx(g,145,286,'Agent A',36,{weight:600});
      const aBrace=path(g,'M160 316H142V526H160',stroke(C.ink,2.5));
      const pa1=group(g,'PA1');rect(pa1,230,326,380,78,{fill:C.paper,stroke:C.ink,'stroke-width':2});tx(pa1,250,375,'Session PA1',34,{mono:true});
      const pa2=group(g,'PA2');rect(pa2,230,452,380,78,{fill:C.paper,stroke:C.ink,'stroke-width':2});tx(pa2,250,501,'Session PA2',34,{mono:true});
      const routes=group(g,'routes');
      const r1=path(routes,'M610 365H825V407H1050',stroke(C.ink,3));
      const r2=path(routes,'M610 491H825V407H1050',stroke(C.blue,3));circle(routes,825,407,6,{fill:C.blue});
      const wa=directory(g,1050,300,700,260,'W-A');file(wa,1090,403);
      tx(wa,1290,366,'默认 per_agent',30,{fill:C.muted,mono:true});
      const b=group(g,'agent-B');tx(b,145,611,'Agent B',36,{weight:600});rect(b,230,632,380,78,{fill:C.paper,stroke:C.ink,'stroke-width':2});tx(b,250,681,'Session PB1',34,{mono:true});path(b,'M610 671H1050',stroke(C.ink,3));directory(b,1050,603,700,107,'W-B');
      const config=group(g,'new-policy-examples');
      line(config,100,732,1815,732,stroke());tx(config,100,771,'仅对新建会话分配',30,{fill:C.muted});
      const perSession=group(config,'per-session');tx(perSession,100,821,'per_session',32,{weight:600,mono:true});
      tx(perSession,430,786,'PA3',30,{mono:true});tx(perSession,430,859,'PA4',30,{mono:true});
      path(perSession,'M510 775H615V764H720M510 848H615V849H720',stroke(C.blue,2.5));
      path(perSession,'M720 741H769L782 752H890V788H720ZM720 826H769L782 837H890V873H720Z',{fill:C.paper,stroke:C.ink,'stroke-width':2});
      const perUser=group(config,'per-user');tx(perUser,1030,821,'per_user',32,{weight:600,mono:true});
      tx(perUser,1300,782,'A / PA5',30,{mono:true});tx(perUser,1300,857,'B / PB2',30,{mono:true});path(perUser,'M1440 773H1510V814H1605M1440 848H1510V814',stroke(C.blue,2.5));
      path(perUser,'M1605 773H1654L1667 784H1790V855H1605Z',{fill:C.paper,stroke:C.ink,'stroke-width':2});tx(perUser,1625,832,'U-A',30,{mono:true});
      const resources=group(g,'resource-scopes');
      tx(resources,330,286,'Skills · 按 Agent',30,{fill:C.blue});
      path(resources,'M213 316H199V526H213',stroke(C.blue,3));
      path(resources,'M575 326V310H640V265H670M510 530V575H670',stroke(C.blue,2.5));
      circle(resources,575,326,5,{fill:C.blue});circle(resources,510,530,5,{fill:C.blue});
      rect(resources,670,235,230,60,{fill:C.pale,stroke:C.blue,'stroke-width':2});tx(resources,689,275,'MCP PA1',30,{mono:true});
      rect(resources,670,545,230,60,{fill:C.pale,stroke:C.blue,'stroke-width':2});tx(resources,689,585,'MCP PA2',30,{mono:true});
      const local=group(g,'local-host');rect(local,1005,255,790,350,{fill:'none',stroke:C.ink,'stroke-width':2,'stroke-dasharray':'10 7'});tx(local,1120,239,'Local · 主机文件系统 · 无沙箱',32,{weight:600});
      const backend=group(g,'backend-alternatives');
      tx(backend,100,650,'其他后端配置',32,{weight:600});tx(backend,100,698,'执行位置随后端变化',30,{fill:C.muted});
      const backendWire=path(backend,'M925 580V720H1790M925 720H350',stroke(C.ink,2));
      const cols=[350,970,1580];
      const labels=[['Docker','容器 ↔ 主机挂载','单机'],['E2B','按元数据重连云沙箱','跨节点'],['K8s','Pod + PVC','跨节点']];
      labels.forEach((r,i)=>{line(backend,cols[i],720,cols[i],748,stroke(C.ink,2));tx(backend,cols[i],785,r[0],34,{weight:600,anchor:'middle'});tx(backend,cols[i],830,r[1],30,{anchor:'middle'});tx(backend,cols[i],867,r[2],24,{anchor:'middle',fill:C.muted,role:'navigation'});});
      const conditions=group(g,'workspace-binding');tx(conditions,1060,654,'Session 保存 workspace_id',32,{mono:true});tx(conditions,1060,700,'显式 ID 优先；既有会话保持原绑定',30,{fill:C.muted});
      tx(conditions,105,590,'闲置 TTL 默认 3600s',32,{weight:600});tx(conditions,105,633,'Local：下次访问清理缓存',30,{fill:C.muted});tx(conditions,105,676,'沙箱后端：另有后台回收',30,{fill:C.muted});
      return {render(t){
        show(pa2,p(t,24,2));show(aBrace,p(t,24,2));grow(r1,t,3,3);grow(r2,t,25,3);show(routes.querySelector('circle'),p(t,26,2));show(b,p(t,46,2)*(1-p(t,147,2)));
        show(config,p(t,70,2)*(1-p(t,147,2)));show(perSession,p(t,70,2));show(perUser,p(t,94,2));show(resources,p(t,120,2));show(local,p(t,147,2));show(backend,p(t,153,2));grow(backendWire,t,155,3);show(conditions,p(t,173,2));
        // Local lifecycle annotations take over the former Agent B margin, not its file.
        show(backend.querySelector('text'),p(t,153,2)*(1-p(t,173,2)));show(backend.querySelectorAll('text')[1],p(t,153,2)*(1-p(t,173,2)));
        note(t<24?'会话创建时分配工作区；文件留在已绑定的目录。':t<46?'同一用户、同一 Agent 的新会话，默认仍访问同一目录。':t<70?'不同 Agent 默认分目录；目录可见性不替代工具动作授权。':t<94?'per_session 为每个新会话分配独立目录。':t<120?'per_user 让同一用户的多个 Agent 共享新目录；旧文件没有迁移。':t<147?'文件可共享；MCP 按 Agent＋Session 分区，Skills 按 Agent 分区。':t<173?'Local 使用主机文件系统且无沙箱；Docker 为单机，云后端可跨节点重连。':'TTL 回收的是缓存与运行资源；隔离策略改变只影响新的分配。');
      }};
    }
  });

  V3.register('java-recovery',{
    title:'断在哪里，恢复就核对哪里的事实',duration:96,covers:['java-09-recovery-capabilities'],
    phases:[{at:0,name:'Java 原任务与动作轴'},{at:18,name:'观察连接断开'},{at:34,name:'进程中断与未知结果'},{at:53,name:'查询原调用回执'},{at:71,name:'核实结果后 reconcile'},{at:84,name:'显式 resume'}],
    motion:[{at:3,duration:4,purpose:'原调用沿动作轴派发'},{at:19,duration:3,purpose:'仅观察连接断开'},{at:28,duration:3,purpose:'从已提交日志恢复页面'},{at:36,duration:3,purpose:'定位结果提交前的进程断点'},{at:55,duration:4,purpose:'查询原调用的外部回执'},{at:72,duration:3,purpose:'核实回执写入保存状态'},{at:86,duration:3,purpose:'同一 turn 的新 run 从 checkpoint 继续'}],
    build(svg){
      const g=group(svg,'java-recovery-map');
      tx(g,100,216,'Java Harness · AgentSession',32,{fill:C.muted});
      tx(g,100,277,'J-TURN1',36,{weight:600,mono:true});const run=tx(g,100,321,'run J-RUN1',30,{mono:true,fill:C.muted});
      const xs=[290,620,965,1300,1715];const names=['接受任务','派发工具','外部执行','提交工具结果','观察页面'];
      line(g,230,490,1770,490,stroke(C.line,3));
      names.forEach((s,i)=>{circle(g,xs[i],490,8,{fill:C.paper,stroke:C.ink,'stroke-width':2});tx(g,xs[i],450,s,32,{anchor:'middle',weight:600});});
      const call=group(g,'J-T1');rect(call,-72,-28,144,56,{fill:C.pale,stroke:C.blue,'stroke-width':2});tx(call,0,12,'J-T1',30,{anchor:'middle',mono:true,weight:600});
      const execution=path(g,'M290 490H1300',stroke(C.blue,4));
      const durable=group(g,'durable-records');line(durable,290,526,290,673,stroke());rect(durable,130,673,320,98,{fill:C.paper,stroke:C.ink,'stroke-width':2});tx(durable,290,710,'持久接受记录',30,{anchor:'middle'});tx(durable,290,758,'原 turn / 输入',30,{anchor:'middle',fill:C.muted});
      line(durable,620,526,620,673,stroke());rect(durable,470,673,300,98,{fill:C.paper,stroke:C.ink,'stroke-width':2});tx(durable,620,716,'Checkpoint',30,{anchor:'middle',mono:true});tx(durable,620,755,'Agent 工作状态',30,{anchor:'middle',fill:C.muted});
      const resultRecord=group(g,'committed-result');line(resultRecord,1300,526,1300,673,stroke());rect(resultRecord,1120,673,360,98,{fill:C.pale,stroke:C.blue,'stroke-width':2});tx(resultRecord,1300,716,'J-T1 · 核实结果',30,{anchor:'middle',mono:true});tx(resultRecord,1300,755,'reconcile 保存',30,{anchor:'middle',fill:C.muted});
      const view=group(g,'observer-view');rect(view,1510,234,350,139,{fill:C.paper,stroke:C.ink,'stroke-width':2});tx(view,1685,282,'页面 / 观察者',32,{anchor:'middle',weight:600});tx(view,1685,329,'读取 committed log',30,{anchor:'middle',mono:true});
      const observer=path(g,'M1715 490H1850V373H1780',stroke(C.ink,3));
      const observerBreak=group(g,'observer-break');path(observerBreak,'M1833 399L1867 427M1867 399L1833 427',stroke(C.ink,4));tx(observerBreak,1685,196,'浏览器断连',30,{anchor:'middle'});
      const logRecord=group(g,'committed-prefix');line(logRecord,1715,526,1715,673,stroke());rect(logRecord,1520,673,340,98,{fill:C.paper,stroke:C.ink,'stroke-width':2});tx(logRecord,1690,710,'committed log',30,{anchor:'middle',mono:true});tx(logRecord,1690,758,'同一前缀 + cursor',30,{anchor:'middle',fill:C.muted});
      const reconnect=path(g,'M1690 673V620H1815V392H1715V373',stroke(C.blue,3));
      const interrupted=group(g,'process-break');line(interrupted,1130,463,1130,520,stroke(C.ink,6));line(interrupted,1130,521,1130,579,stroke());tx(interrupted,1130,646,'进程停止',34,{anchor:'middle',weight:600});tx(interrupted,1130,695,'本地结果未提交',30,{anchor:'middle'});
      const unknown=group(g,'unknown-outcome');path(unknown,'M643 548V566H1110V548',stroke(C.blue,3));tx(unknown,876,587,'派发后 → 提交前：外部结果未知',30,{anchor:'middle',fill:C.blue});
      const external=group(g,'external-system');rect(external,720,251,580,112,{fill:C.paper,stroke:C.ink,'stroke-width':2});tx(external,745,297,'外部系统 · 原回执',32,{weight:600});tx(external,745,342,'J-T1 → 已写入 ORD-42',30,{mono:true});
      const receiptRoute=path(g,'M1300 310H1435V397H1510V625',stroke(C.blue,2));
      const query=path(g,'M1130 579V397H1170V363',stroke(C.blue,3));const receipt=group(g,'verified-receipt');rect(receipt,-130,-30,260,60,{fill:C.pale,stroke:C.blue,'stroke-width':2});tx(receipt,0,11,'J-T1 · 已核实',30,{mono:true,anchor:'middle'});
      const resume=group(g,'resume-new-run');path(resume,'M620 790V834H1500V520',stroke(C.blue,3));tx(resume,1030,883,'显式 resume · 原 turn / 新 run',32,{anchor:'middle',weight:600});
      g.appendChild(call);
      const prerequisites=group(g,'recovery-prerequisites');tx(prerequisites,100,829,'同工具、凭据、工作文件',30,{fill:C.muted});tx(prerequisites,100,875,'旧 writer lease 已释放 / 过期',30,{fill:C.muted});
      return {render(t){
        const travel=p(t,3,4);move(call,lerp(290,965,travel),490);show(call,1-p(t,70,1));set(execution,{d:'M290 490H'+(lerp(290,965,travel)+335*p(t,72,3))});show(durable,1);show(resultRecord,p(t,71,2));show(observer,t>=19&&t<28?.15:1);show(observerBreak,p(t,18,1)*(1-p(t,28,1)));grow(reconnect,t,28,3);show(reconnect,p(t,28,1)*(1-p(t,34,1)));
        show(interrupted,p(t,34,2)*(1-p(t,70,1)));show(unknown,p(t,34,2)*(1-p(t,70,1)));show(external,p(t,34,2));grow(receiptRoute,t,58,6);show(receiptRoute,p(t,58,1)*(1-p(t,72,2)));grow(query,t,55,3);show(query,p(t,53,1)*(1-p(t,71,1)));
        show(receipt,p(t,58,1));const q=p(t,60,4);move(receipt,lerp(1510,1510,q),lerp(397,625,q));show(receipt,p(t,58,1)*(1-p(t,72,2)));
        show(resume,p(t,84,1));show(prerequisites,p(t,84,1));run.textContent=t<84?'run J-RUN1':'run J-RUN2';
        note(t<18?'提交获得任务回执；执行与前端观察分别推进。':t<34?'浏览器断连不取消后台任务；页面从同一已提交前缀恢复，再接后续事件。':t<53?'Checkpoint 不恢复线程、网络请求或工具进度；派发后未提交的结果需要核对。':t<71?'按原调用 J-T1 查询外部记录；结果仍未知时继续调查。':t<84?'reconcile 保存实际查到的结果与 checkpoint，不再次执行原工具。':'只有显式 resume 才继续原任务；turn 保留，run 更新。');
      }};
    }
  });
})();
