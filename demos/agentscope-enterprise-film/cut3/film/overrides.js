/* Relation-specific compositions for system overview, deployment and independent controls. */
(()=>{'use strict';const V=V3,C=V.C,S=Object.fromEntries(V3_STORY.map(s=>[s.id,s]));
 const helpers=svg=>{const g=V.group(svg,'relation-overrides'),text=(x,y,s,z=32,o={})=>V.text(g,x,y,s,z,o),path=(d,c=C.line,w=2)=>V.path(g,d,{stroke:c,'stroke-width':w}),group=id=>V.group(g,id);return {g,text,path,group};};
 for(const id of ['whole','deployment','java-06-interaction-capabilities']){const s=S[id];V.register(id,{title:s.title,duration:id==='whole'?54:id==='deployment'?58:56,covers:[id],phases:[{at:0,name:'辨认对象'},{at:10,name:'建立关系'},{at:22,name:'区别职责'},{at:36,name:'条件与结果'}],motion:[{at:10,duration:3,purpose:'以实际角色建立连接'},{at:22,duration:3,purpose:'展开独立职责与条件'},{at:36,duration:3,purpose:'强调作用对象'}],build(svg){const {g,text,path,group}=helpers(svg),objects=[];
 function T(p,x,y,z,sz=32,o={}){return V.text(p,x,y,z,sz,o);}
 function line(p,x1,y1,x2,y2,c=C.line){return V.line(p,x1,y1,x2,y2,{stroke:c,'stroke-width':2});}
 function rect(p,x,y,w,h){return V.rect(p,x,y,w,h,{stroke:C.ink,'stroke-width':2,fill:C.paper});}
 function folder(p,x,y,w,h){return V.path(p,`M${x} ${y}h100l24 24h${w-124}v${h-24}H${x}Z`,{stroke:C.ink,'stroke-width':2,fill:C.paper});}
 let a,b,c,d,extras;
 if(id==='whole'){
  a=group('application');V.circle(a,200,340,75,{stroke:C.ink,'stroke-width':2});T(a,200,353,'应用',36,{anchor:'middle',weight:650});T(a,100,470,'合同复核请求',32);
  b=group('service');rect(b,430,540,460,200);T(b,460,595,'Service',42,{weight:650});T(b,460,651,'请求 · 会话 S1',32);T(b,460,705,'事件与结果回传',32,{fill:C.muted});
  c=group('agent');V.circle(c,1015,360,135,{stroke:C.ink,'stroke-width':2});T(c,1015,345,'Agent',44,{anchor:'middle',weight:650});T(c,1015,393,'推理与工具',30,{anchor:'middle'});T(c,1015,438,'工作上下文',30,{anchor:'middle'});
  d=group('workspace');folder(d,1300,570,490,190);T(d,1330,635,'Workspace',40,{weight:650});T(d,1330,690,'文件 · 终端 · 执行环境',30);T(d,1330,735,'contract-v3.pdf',30,{mono:true,fill:C.muted});
  extras=group('relations');path('M275 340H365V595H420',C.blue,3);text(300,500,'请求',30,{fill:C.blue});
  V.path(extras,'M780 530V405H870',{stroke:C.blue,'stroke-width':3,fill:'none'});T(extras,580,435,'运行请求',30,{fill:C.blue});
  V.path(extras,'M920 465L850 500H750',{stroke:C.ink,'stroke-width':2,fill:'none'});T(extras,820,530,'事件 / 结果',30,{fill:C.muted});
  V.path(extras,'M1150 360H1540V555',{stroke:C.blue,'stroke-width':3,fill:'none'});T(extras,1360,410,'工具访问',30,{fill:C.blue});
  V.path(extras,'M430 700H80V340H115',{stroke:C.ink,'stroke-width':2,fill:'none'});T(extras,110,675,'回传进展与结果',30,{fill:C.muted});line(extras,900,700,1280,700);T(extras,980,752,'工作区绑定',30,{fill:C.muted});
 }else if(id==='deployment'){
  a=group('api');rect(a,130,280,400,140);T(a,165,335,'API 进程',38,{weight:650});T(a,165,390,'接收请求与观察',30);
  b=group('worker');rect(b,130,590,400,140);T(b,165,645,'Worker 进程',38,{weight:650});T(b,165,700,'执行任务',30);
  c=group('shared-backend');V.el(c,'ellipse',{cx:1010,cy:340,rx:200,ry:38,stroke:C.ink,'stroke-width':2,fill:C.paper});V.path(c,'M810 340V470C810 525 1210 525 1210 470V340',{stroke:C.ink,'stroke-width':2,fill:C.paper});T(c,1010,428,'共享存储',38,{anchor:'middle',weight:650});rect(c,1370,315,410,180);T(c,1410,380,'共享事件总线',36,{weight:650});T(c,1410,440,'同一连接配置',30,{fill:C.muted});
  d=group('separate-responsibilities');V.circle(d,990,710,65,{stroke:C.ink,'stroke-width':2});T(d,990,722,'定时器',30,{anchor:'middle'});T(d,850,815,'单一进程持有调度权',30);rect(d,1365,620,410,140);T(d,1400,677,'解析进程',36,{weight:650});T(d,1400,730,'CPU 密集任务',30);T(d,130,835,'副本共用 download_secret',30,{mono:true});
  extras=group('backend-relationships');V.path(extras,'M530 345H790M530 655H700V445H790M700 445V270H1560V300',{stroke:C.blue,'stroke-width':3,fill:'none'});T(extras,550,480,'相同存储与总线',30,{fill:C.blue});V.path(extras,'M540 700H915M540 650H680V565H1570V605',{stroke:C.line,'stroke-width':2,fill:'none'});T(extras,1370,545,'解析派发',30,{fill:C.muted});
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
