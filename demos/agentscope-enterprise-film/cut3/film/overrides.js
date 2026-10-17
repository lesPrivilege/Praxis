/* Relation-specific compositions for system overview, deployment and independent controls. */
(()=>{'use strict';const V=V3,C=V.C,S=Object.fromEntries(V3_STORY.map(s=>[s.id,s]));
 const helpers=svg=>{const g=V.group(svg,'relation-overrides'),text=(x,y,s,z=32,o={})=>V.text(g,x,y,s,z,o),path=(d,c=C.line,w=2)=>V.path(g,d,{stroke:c,'stroke-width':w}),group=id=>V.group(g,id);return {g,text,path,group};};
 for(const id of ['whole','deployment','java-06-interaction-capabilities']){const s=S[id];V.register(id,{title:s.title,duration:id==='whole'?54:id==='deployment'?58:56,covers:[id],phases:[{at:0,name:'辨认对象'},{at:10,name:'建立关系'},{at:22,name:'区别职责'},{at:36,name:'条件与结果'}],motion:[{at:10,duration:3,purpose:'以实际角色建立连接'},{at:22,duration:3,purpose:'展开独立职责与条件'},{at:36,duration:3,purpose:'强调作用对象'}],build(svg){const {g,text,path,group}=helpers(svg),objects=[];
 function T(p,x,y,z,sz=32,o={}){return V.text(p,x,y,z,sz,o);}
 function line(p,x1,y1,x2,y2,c=C.line){return V.line(p,x1,y1,x2,y2,{stroke:c,'stroke-width':2});}
 function rect(p,x,y,w,h){return V.rect(p,x,y,w,h,{stroke:C.edge,'stroke-width':2,fill:C.card,rx:14});}
 function folder(p,x,y,w,h){return V.path(p,`M${x} ${y}h100l24 24h${w-124}v${h-24}H${x}Z`,{stroke:C.edge,'stroke-width':2,fill:C.card});}
 let a,b,c,d,extras;
 const arrow=V.arrows(g,'ov-'+id),link=(p,pts,c=C.blue,w=3,head=true)=>V.path(p,V.route(pts),{stroke:c,'stroke-width':w,fill:'none','stroke-linecap':'round','marker-end':head?arrow[c===C.blue?'blue':'slate']:null});
 const label=(p,x,y,z,c,anchor='start')=>V.set(T(p,x,y,z,30,{fill:c,anchor,weight:550}),{stroke:C.paper,'stroke-width':10,'paint-order':'stroke','stroke-linejoin':'round'});
 if(id==='whole'){
  a=group('application');rect(a,100,300,300,150);T(a,130,362,'应用',38,{weight:650});T(a,130,415,'合同复核请求',30,{fill:C.muted});
  b=group('service');rect(b,560,560,520,200);T(b,595,622,'Service',42,{weight:650});T(b,595,678,'请求 · 会话 S1',32);T(b,595,728,'事件与结果回传',30,{fill:C.muted});
  c=group('agent');V.circle(c,1015,330,130,{stroke:C.blue,'stroke-width':2.5,fill:C.card});T(c,1015,315,'Agent',44,{anchor:'middle',weight:650});T(c,1015,363,'推理与工具',30,{anchor:'middle'});T(c,1015,405,'工作上下文',30,{anchor:'middle',fill:C.muted});
  d=group('workspace');folder(d,1360,560,460,200);T(d,1390,645,'Workspace',40,{weight:650});T(d,1390,698,'文件 · 终端 · 执行环境',30);T(d,1390,740,'contract-v3.pdf',30,{mono:true,fill:C.muted});
  extras=group('relations');
  link(extras,[[250,450],[250,660],[556,660]]);label(extras,270,560,'请求',C.blue);
  link(extras,[[1070,560],[1070,452]]);label(extras,1090,520,'运行请求',C.blue);
  link(extras,[[960,452],[960,556]],C.slate,3);label(extras,940,520,'事件 / 结果',C.muted,'end');
  link(extras,[[1145,330],[1590,330],[1590,580]]);label(extras,1370,312,'工具访问',C.blue,'middle');
  link(extras,[[560,720],[160,720],[160,454]],C.slate,3);label(extras,360,762,'回传进展与结果',C.muted,'middle');
  V.line(extras,1080,680,1360,680,{stroke:C.slate,'stroke-width':3,'stroke-dasharray':'2 8','stroke-linecap':'round'});label(extras,1220,662,'工作区绑定',C.muted,'middle');
 }else if(id==='deployment'){
  a=group('api');rect(a,100,260,400,140);T(a,135,318,'API 进程',38,{weight:650});T(a,135,370,'接收请求与观察',30,{fill:C.muted});
  b=group('worker');rect(b,100,600,400,140);T(b,135,658,'Worker 进程',38,{weight:650});T(b,135,710,'执行任务',30,{fill:C.muted});
  c=group('shared-backend');V.path(c,'M760 310 V420 A200 34 0 0 0 1160 420 V310',{stroke:C.frame,'stroke-width':2,fill:C.card});V.el(c,'ellipse',{cx:960,cy:310,rx:200,ry:34,stroke:C.frame,'stroke-width':2,fill:C.card});T(c,960,405,'共享存储',38,{anchor:'middle',weight:650});rect(c,1400,280,420,160);T(c,1435,345,'共享事件总线',36,{weight:650});T(c,1435,400,'同一连接配置',30,{fill:C.muted});
  d=group('separate-responsibilities');V.circle(d,960,680,62,{stroke:C.frame,'stroke-width':2,fill:C.card});T(d,960,691,'定时器',30,{anchor:'middle',weight:600});T(d,1042,691,'单一进程持有调度权',30,{fill:C.muted});rect(d,1400,620,420,140);T(d,1435,677,'解析进程',36,{weight:650});T(d,1435,730,'CPU 密集任务',30,{fill:C.muted});T(d,100,860,'副本共用 download_secret',30,{mono:true});
  link(d,[[500,690],[894,690]],C.slate,3);link(d,[[300,740],[300,800],[1610,800],[1610,764]],C.slate,3);label(d,1180,785,'解析派发',C.muted,'middle');
  extras=group('backend-relationships');V.path(extras,'M500 330 H640 M500 640 H640 M640 330 V640',{stroke:C.blue,'stroke-width':3,fill:'none','stroke-linecap':'round'});link(extras,[[640,365],[756,365]]);link(extras,[[640,330],[640,220],[1610,220],[1610,276]]);label(extras,1125,205,'相同存储与总线',C.blue,'middle');
 }else{
  a=group('capability-contract');text(105,230,'capabilities / available_commands',36,{mono:true,weight:650});text(105,289,'能力与当前状态决定可用入口',32,{fill:C.muted});
  b=group('independent-controls');V.path(b,'M205 365H1555M205 365V430M655 365V430M1105 365V430M1555 365V430',{stroke:C.line,'stroke-width':2,fill:'none'});
  const data=[['steer',['改变后续要求','已发请求的输入不改']],['inject',['补充背景','不立即启动推理']],['actions',['回答待处理动作','request_id + payload']],['resume',['能力允许、动作处理后','继续原 Turn']]];
  data.forEach(([name,ls],i)=>{const x=[100,550,1000,1450][i];T(b,x,480,name,38,{mono:true,weight:650});ls.forEach((z,j)=>T(b,x,552+j*48,z,30,{fill:C.muted}));});
  c=group('action-response');rect(c,480,720,990,135);T(c,515,773,'待处理动作 → 原 request_id 的回答',34,{weight:600});T(c,515,823,'payload 按动作字段提交',30,{fill:C.blue});
  d=group('state-condition');extras=group('none');
 }
 objects.push(a,b,c,d,extras);
 return {render(t){objects.forEach((o,i)=>V.show(o,i===0?1:V.p(t,[0,6,11,id==='whole'?14:24,id==='deployment'?27:16][i],2.4)));V.note(t<22?s.lead:t<36?(id==='whole'?'应用请求进入 Service，Agent 调用工具与工作区，事件和结果返回应用。':id==='deployment'?'API 与 Worker 共用后端；调度、解析与下载密钥分别配置。':'这些入口具有不同效果，先读取目标支持的能力与命令。'):s.pm);}};
 }});}
})();
