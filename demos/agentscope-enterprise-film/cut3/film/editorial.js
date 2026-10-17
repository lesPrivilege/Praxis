/* Explicit editorial graphs. Each mapping is a semantic composition, never an old kind. */
(() => {
  'use strict';
  const V=window.V3, C=V.C;
  const STORY=Array.isArray(window.V3_STORY)?window.V3_STORY:(window.V3_STORY?.scenes||[]);
  const M={
    whole:{shape:'triangle',pos:[[720,240,490],[100,590,520],[1300,590,490]],edges:['M850 390 L500 545','M1100 390 L1500 545','M650 680 L1240 680'],labels:[['请求与结果',540,405],['动作与文件',1260,410],['工作状态',900,665]]},
    docs:{shape:'tree',pos:[[600,250,530],[1250,250,530],[600,590,530],[1250,590,530]],edges:['M300 495 L490 495 L490 230 L590 230','M490 230 L1220 230','M490 495 L490 570 L590 570','M490 570 L1220 570'],root:['项目要解决什么？',80,465]},
    lanes:{shape:'lanes',pos:[[130,300,650],[130,620,650],[1090,300,650],[1090,620,650]],edges:['M780 260 L1060 260','M780 580 L1060 580'],labels:[['Python',120,230],['Java',120,550]]},
    migration:{shape:'merge',pos:[[100,270,560],[100,610,560],[1150,425,620]],edges:['M670 350 L910 350 L1050 465 L1130 465','M670 690 L910 690 L1050 465'],labels:[['职责汇入',860,430]]},
    task:{shape:'material',pos:[[100,360,340],[550,360,340],[1000,360,340],[1450,360,340]],edges:['M430 300 L530 300','M880 300 L980 300','M1330 300 L1430 300'],labels:[['合同',110,250],['条款依据',560,250],['候选',1010,250],['业务确认',1460,250]]},
    model:{shape:'adapter',pos:[[100,345,350],[550,345,350],[1000,345,350],[1450,345,350]],edges:['M440 285 L530 285','M890 285 L980 285','M1340 285 L1430 285','M1610 690 L1610 800 L260 800 L260 670'],labels:[['内部结构',100,240],['供应商协议',1000,240],['返回统一结构',770,785]]},
    tools:{shape:'merge-blocks',pos:[[80,260,620],[80,600,620],[1000,260,730],[1000,650,730]],edges:['M710 330 L920 330 L920 415 L990 415','M710 685 L920 685 L920 475 L990 475','M1370 570 L1370 620'],labels:[]},
    scheduling:{shape:'parallel',pos:[[100,275,650],[100,610,650],[1120,275,650],[1120,610,650]],edges:['M780 250 L1090 250','M780 585 L1090 585'],labels:[['并发：同一批',100,215],['依赖：先后轮次',100,550]]},
    integration:{shape:'roles',pos:[[100,300,520],[100,640,520],[1250,470,520]],edges:['M640 370 L1020 370 L1020 515','M640 710 L1020 710 L1020 515','M1240 515 L1090 515'],root:['Toolkit',850,500]},
    context:{shape:'stack',pos:[[260,260,1300],[320,450,1240],[380,640,1180]],edges:[],labels:[['模型输入',1380,800]]},
    compression:{shape:'fold',pos:[[100,275,710],[1040,275,710],[100,650,710],[1040,650,710]],edges:['M820 250 L1010 250','M820 625 L1010 625'],labels:[['历史窗口',100,215],['单工具结果与兜底',100,590]]},
    memory:{shape:'bidirectional',pos:[[100,270,650],[1100,270,650],[100,650,650],[1100,650,650]],edges:['M760 340 L1060 340','M1060 545 L760 545'],labels:[['选择写入',830,325],['按需取回',830,530]]},
    rag:{shape:'rag',pos:[[100,300,660],[1120,300,660],[1120,650,660],[100,650,660]],edges:['M790 265 L1090 265','M1450 490 L1450 600','M1090 615 L790 615'],labels:[['构建索引',100,225],['问题检索',100,575]]},
    structured:{shape:'gate',pos:[[100,280,650],[1050,280,700],[100,650,650],[1050,650,700]],edges:['M780 345 L930 345 L1030 345','M1390 510 L1390 590','M1030 730 L790 730'],labels:[['schema 校验',800,260],['到上限后',780,610]]},
    interrupt:{shape:'cut',pos:[[100,280,700],[1100,280,700],[100,650,700],[1100,650,700]],edges:['M810 350 L930 350','M990 350 L1090 350','M450 510 L450 600','M1450 510 L1450 600'],labels:[['控制停止',830,295],['外部结果另外核对',750,790]]},
    middleware:{shape:'boundary',pos:[[120,360,420],[740,360,420],[1360,360,420],[480,710,960]],edges:['M560 300 L710 300','M1180 300 L1330 300'],labels:[['调用边界',110,230]]},
    pipeline:{shape:'return',pos:[[100,330,350],[550,330,350],[1000,330,350],[550,680,700]],edges:['M440 275 L530 275','M890 275 L980 275','M1170 580 L1170 640 L900 640','M530 740 L270 740 L270 580','M1360 275 L1730 275'],labels:[['pass / impossible',1400,250],['fail 且预算允许',100,675]]},
    team:{shape:'star',pos:[[730,300,500],[100,600,500],[1290,600,500],[730,700,500]],edges:['M900 400 L350 540','M1080 400 L1530 540','M350 790 L700 790','M1530 790 L1260 790'],labels:[['leader',730,220],['独立上下文',100,545],['成员结果回到 leader',1290,545]]},
    plan:{shape:'ledger',pos:[[150,280,700],[1100,280,650],[150,650,700],[1100,650,650]],edges:['M850 370 L1060 370','M1080 720 L860 720'],labels:[['可变台账',150,220],['规则与推进依据',1100,220]]},
    service:{shape:'layers',pos:[[250,270,1320],[250,470,1320],[250,670,1320]],edges:['M1700 340 L1700 485','M1700 540 L1700 685'],labels:[['请求',140,285],['运行',140,485],['记录',140,685]]},
    identity:{shape:'ownership',pos:[[100,300,620],[1110,300,620],[1110,650,620],[100,650,620]],edges:['M740 265 L1080 265','M1420 500 L1420 590','M1080 615 L740 615'],labels:[['可信入口',100,230],['所有者匹配',780,595]]},
    deployment:{shape:'topology',pos:[[730,300,520],[100,650,500],[720,650,520],[1330,650,500]],edges:['M420 280 L700 280','M1520 280 L1270 280','M980 510 L980 580','M980 565 L350 565 L350 600','M980 565 L1580 565 L1580 600'],labels:[['API',200,270],['worker',1490,270]]},
    observability:{shape:'projections',pos:[[100,320,500],[710,320,500],[1320,320,500],[500,710,950]],edges:['M960 245 L350 245 L350 260','M960 245 L960 260','M960 245 L1570 245 L1570 260','M350 595 L350 650 L950 650','M1570 595 L1570 650 L950 650'],root:['session / reply 身份',720,220]},
    'java-01-harness-context':{shape:'context-axis',pos:[[100,280,700],[1100,280,700],[590,650,740]],edges:['M810 350 L1070 350','M1450 530 L1450 595 L960 595 L960 620','M450 530 L450 595 L960 595']},
    'java-02-agent-session':{shape:'two-lifetimes',pos:[[100,300,700],[1100,300,700],[1100,660,700],[100,660,700]],edges:['M1450 530 L1450 600','M1080 730 L830 730'],labels:[['即时请求',100,230],['后台会话',1100,230],['原任务续接',600,820]]},
    'java-04-session-turn-idempotency':{shape:'idempotency',pos:[[120,280,650],[1100,280,650],[120,650,650],[1100,650,650]],edges:['M790 350 L1070 350','M790 730 L940 730 L940 380 L1070 380','M1430 530 L1430 600'],labels:[['同 key + 同请求体',785,595]]},
    'java-06-interaction-capabilities':{shape:'capabilities',pos:[[120,320,370],[580,320,370],[1040,320,370],[1500,320,370]],edges:['M300 255 L1680 255'],root:['capabilities + available_commands',480,220]},
    'java-08-auth-grant-registration':{shape:'auth-layers',pos:[[120,300,710],[1100,300,710],[120,650,710],[1100,650,710]],edges:['M830 270 L1070 270','M460 530 L460 600','M1470 530 L1470 600'],labels:[['身份与作用域',120,230],['调用入口',1100,230]]},
    'java-orchestration':{shape:'nested',pos:[[120,370,480],[740,370,480],[1360,370,480]],edges:['M850 640 L1040 640','M1430 650 L1550 650 L1550 710 L1680 710'],labels:[['当前 Agent 范围',120,240],['成员关系',740,240],['依赖关系',1360,240]]},
    'java-issue':{shape:'acceptance',pos:[[100,300,700],[1100,300,700],[1100,650,700],[100,650,700]],edges:['M810 265 L1070 265','M1450 530 L1450 600','M1080 730 L830 730'],labels:[['工作定义 / 接收',100,230],['执行 / 运行记录',1100,230],['结果交接',830,605]]},
    'java-auth-scope':{shape:'scopes',pos:[[120,300,720],[1100,300,720],[120,650,720],[1100,650,720]],edges:['M840 265 L1070 265','M1450 530 L1450 590','M1450 570 L480 570 L480 590'],labels:[['作用域内分别判断',780,550]]},
    'java-budget':{shape:'budget',pos:[[100,280,700],[1100,280,700],[1100,650,700],[100,650,700]],edges:['M810 345 L1070 345','M1450 530 L1450 590','M1080 730 L830 730'],labels:[['已报告用量',100,220],['配置限制',1100,220]]},
    'java-channels':{shape:'u-route',pos:[[100,300,680],[1100,300,680],[1100,650,680],[100,650,680]],edges:['M800 265 L1070 265','M1450 530 L1450 590','M1080 615 L800 615','M80 665 L60 665 L60 320 L80 320'],labels:[['原外部对话',100,230]]},
    'java-webhook':{shape:'dedupe',pos:[[100,280,650],[100,650,650],[1100,280,650],[1100,650,650]],edges:['M780 345 L1070 345','M780 720 L950 720 L950 400 L1070 400','M1420 530 L1420 590'],labels:[['同一 event_id',790,245],['业务幂等契约另核对',1100,835]]},
    'java-storage':{shape:'restore-point',pos:[[100,330,500],[710,330,500],[1320,330,500]],edges:['M350 560 L350 720 L960 720','M960 560 L960 720','M1570 560 L1570 720 L960 720','M960 720 L960 800'],labels:[['同一备份点',800,850]]}
  };
  const widthUnits=s=>[...s].reduce((n,c)=>n+(/[\u0000-\u00ff]/.test(c)?.55:1),0);
  function wrap(text,width,font) {
    const cap=width/font, out=[];let line='';
    for(const word of String(text).match(/[A-Za-z0-9_.\-/]+|\s+|./gu)||[]) {
      if(/[。；，：！？、]/.test(word)&&word.length===1){line+=word;continue;}
      if(line&&widthUnits(line+word)>cap){out.push(line.trim());line='';}
      if(widthUnits(word)>cap){for(const c of word){if(widthUnits(line+c)>cap){out.push(line);line='';}line+=c;}}
      else line+=word;
    }
    if(line.trim())out.push(line.trim());return out;
  }
  const EXAMPLES={
    tools:{phases:[{at:0,name:'Schema独立进入模型输入'},{at:10,name:'两个B1内容块'},{at:14,name:'第一段到达'},{at:23,name:'同B1追加'},{at:31,name:'error保留'},{at:38,name:'URL不能追加'}],motion:[{at:5,duration:3,purpose:'Schema送入模型输入'},{at:14,duration:3,purpose:'第一个B1内容到达'},{at:23,duration:3,purpose:'第二段追加到原B1'},{at:32,duration:3,purpose:'后到success不能覆盖error'}]},
    plan:{phases:[{at:0,name:'三条具名待办'},{at:12,name:'对应第8条的结果到达'},{at:22,name:'复核人确认对应结果'},{at:30,name:'只更新读取第8条'}],motion:[{at:12,duration:3,purpose:'已读结果回到对应待办'},{at:22,duration:3,purpose:'确认结果后只改一条状态'}]},
    rag:{phases:[{at:0,name:'合同与附件两份材料'},{at:8,name:'切片进入索引'},{at:18,name:'责任上限问题检索'},{at:27,name:'命中两个片段'},{at:34,name:'片段进入模型输入'}],motion:[{at:8,duration:3,purpose:'两材料切片与索引建立关联'},{at:18,duration:3,purpose:'问题检索索引'},{at:27,duration:3,purpose:'命中原片段身份'},{at:34,duration:3,purpose:'相关片段送模型'}]},
    identity:{phases:[{at:0,name:'真实认证得到U-A'},{at:12,name:'检查第一份合同归属'},{at:22,name:'检查另一份合同归属'},{at:30,name:'两个访问结果'}],motion:[{at:12,duration:3,purpose:'U-A与owner U-A比较'},{at:22,duration:3,purpose:'U-A与owner U-B比较'}]}
  };
  function buildExample(id,svg,s,duration){
    const root=V.group(svg,'worked-'+id), bg=V.group(root,'worked-structure'), fg=V.group(root,'worked-objects');
    const T=(p,x,y,z,size=32,o={})=>V.text(p,x,y,z,size,o), S=V.set;
    const box=(p,x,y,w,h,a={})=>V.rect(p,x,y,w,h,{fill:C.paper,stroke:C.line,'stroke-width':2,...a});
    const path=(d,a={})=>V.path(bg,d,{fill:'none',stroke:C.blue,'stroke-width':3,...a});
    const group=name=>V.group(fg,name), show=V.show;
    const P=(t,at,d=2.2)=>V.p(t,at,d), L=V.lerp;
    const draw=(e,q)=>{const n=e.getTotalLength();S(e,{'stroke-dasharray':n,'stroke-dashoffset':n*(1-q),opacity:q});};
    T(bg,1710,210,'合同例',28,{fill:C.muted,role:'navigation'});
    if(id==='tools'){
      const schema=group('schema-input');box(schema,100,245,580,160);T(schema,130,295,'Schema',34,{weight:650});T(schema,130,342,'read_contract(contract_id)',30,{mono:true});T(schema,130,383,'名称、参数与说明',30,{fill:C.muted});
      const model=group('model-input');box(model,1230,245,520,160,{stroke:C.blue});T(model,1260,302,'模型输入',36,{weight:650});T(model,1260,363,'可调用什么、怎样填写参数',30,{fill:C.muted});
      const schemaLine=path('M710 325 L1200 325');T(bg,835,300,'工具定义',30,{fill:C.blue});
      const response=group('response-B1');box(response,730,470,1060,350,{stroke:C.blue});T(response,770,520,'ToolResponse · B1',34,{weight:650,mono:true});
      const d1=T(fg,100,585,'第8条：',36,{weight:550,key:'tools-worked-B1-1'}),d2=T(fg,100,675,'赔偿不超过合同额。',36,{weight:550,key:'tools-worked-B1-2'});
      const incoming=T(bg,100,505,'ToolChunk · 同一 block_id=B1',30,{mono:true,fill:C.blue});
      const call=group('original-T1');T(call,100,850,'原调用 T1',32,{mono:true,weight:650});const pairing=path('M350 840 L650 840 L650 755 L750 755');T(response,770,757,'ToolResultBlock · T1',32,{mono:true,weight:650});
      const error=group('sticky-error');T(error,1420,680,'error',36,{mono:true,weight:650});const success=T(error,1420,730,'success',30,{mono:true,fill:C.muted});const strike=V.line(error,1412,718,1560,718,{stroke:C.muted,'stroke-width':3});
      const url=group('url-append');T(url,100,750,'URL + URL',30,{mono:true});T(url,100,792,'追加 → 报错',32,{fill:C.blue});
      return {render(t){draw(schemaLine,P(t,5,3));show(response,P(t,10));show(incoming,P(t,10));show(d1,t>=10?1:0);show(d2,t>=19?1:0);const a=P(t,14,3),b=P(t,23,3);S(d1,{x:L(100,800,a),y:L(585,595,a)});S(d2,{x:L(100,944,Math.min(1,b/.65)),y:L(675,595,Math.max(0,(b-.65)/.35))});show(call,P(t,27));draw(pairing,P(t,27,3));show(error,P(t,31));show(success,P(t,34));show(strike,P(t,35));show(url,P(t,38));V.note(t<10?'Schema进入模型输入；它不参与工具内容块的合并。':t<27?'同一B1：第二段追加到第一段，消息里只留一份合并内容。':t<38?'原T1关联结果；已记录error，后到success不能抹去。':'URL来源不能追加；文字内容、执行状态与调用身份分别处理。');}};
    }
    if(id==='plan'){
      const labels=['读取第8条','核对附件B','保存意见'],checks=[],states=[];
      T(bg,100,250,'计划台账',36,{weight:650});T(bg,1100,250,'对应结果',36,{weight:650});
      labels.forEach((z,i)=>{const y=350+i*170;box(bg,100,y-35,44,44);T(bg,185,y,z,36,{weight:550});states.push(T(bg,650,y,'待办',32,{fill:C.muted}));checks.push(V.path(fg,`M108 ${y-15} L118 ${y-5} L140 ${y-30}`,{fill:'none',stroke:C.blue,'stroke-width':4}));V.line(bg,100,y+65,800,y+65,{stroke:C.line,'stroke-width':1.5});});
      const result=group('clause-eight-result');box(result,1100,300,650,180,{stroke:C.blue});T(result,1130,350,'第8条已读',36,{weight:650});T(result,1130,408,'结果对应：读取第8条',30,{fill:C.muted});const confirm=T(result,1130,453,'复核人确认',30,{fill:C.blue});
      const receipt=path('M1100 390 L930 390 L930 350 L790 350');
      const rule=group('SOP-rule');T(rule,1100,625,'SOP',34,{weight:650});T(rule,1100,686,'先核对附件，再保存意见',32);T(rule,1100,744,'后两项仍待办',32,{fill:C.muted});
      return {render(t){show(result,P(t,12));show(confirm,P(t,22));draw(receipt,P(t,22,3));checks.forEach((e,i)=>show(e,i===0?P(t,25):0));states.forEach((e,i)=>{e.textContent=i===0&&t>=25?'完成':'待办';S(e,{fill:i===0&&t>=25?C.blue:C.muted});});show(rule,P(t,30));V.note(t<12?'台账记录任务；规则说明前后条件。':t<25?'结果与第一条待办对应，确认结果后才改变状态。':'只有“读取第8条”完成；核对附件与保存意见仍未完成。');}};
    }
    if(id==='rag'){
      T(bg,100,230,'索引构建',34,{weight:650,fill:C.blue});
      const papers=[['D1/P1','合同 · 第8条','责任总额以约定基数为上限'],['D2/P1','附件B · 计算口径','基数按已支付服务费核对']];
      papers.forEach((a,i)=>{const x=100+i*540;box(bg,x,280,470,250);T(bg,x+25,329,a[1],34,{weight:650});wrap(a[2],420,30).forEach((z,j)=>T(bg,x+25,390+j*40,z,30));T(bg,x+25,495,a[0],30,{mono:true,fill:C.blue});});
      const index=group('index');box(index,1320,280,470,250,{stroke:C.blue});T(index,1350,329,'索引',36,{weight:650});T(index,1350,398,'D1/P1',32,{mono:true});T(index,1350,463,'D2/P1',32,{mono:true});
      const build1=path('M570 495 L610 495 L610 560 L1260 560 L1260 398 L1290 398'),build2=path('M1110 495 L1190 495 L1190 463 L1290 463');
      V.line(bg,100,600,1790,600,{stroke:C.line,'stroke-width':2});T(bg,100,655,'问题检索',34,{weight:650,fill:C.blue});
      const question=group('query');T(question,100,730,'责任上限怎么算？',36,{weight:650});const queryLine=path('M465 715 L600 715 L600 575 L1555 575 L1555 545');
      const hits=group('retrieved-fragments');T(hits,740,710,'命中 D1/P1 + D2/P1',32,{mono:true,weight:650});T(hits,740,768,'第8条 + 附件B口径',32,{fill:C.muted});const fromIndex=path('M1600 545 L1600 620 L1050 620 L1050 670');
      const model=group('grounded-input');box(model,1450,680,340,150,{stroke:C.blue});T(model,1480,730,'模型输入',36,{weight:650});T(model,1480,792,'问题 + 命中片段',30,{fill:C.muted});const toModel=path('M1160 755 L1420 755');
      return {render(t){show(index,P(t,8));draw(build1,P(t,8,3));draw(build2,P(t,10,3));show(question,P(t,18));draw(queryLine,P(t,18,3));show(hits,P(t,27));draw(fromIndex,P(t,25,3));show(model,P(t,34));draw(toModel,P(t,34,3));V.note(t<18?'上轨先解析、切片、建索引；两个片段保留来源身份。':t<34?'下轨按问题检索，取回合同与附件中的相关片段。':'命中片段进入模型输入；检索质量与回答质量分别检查。');}};
    }
    if(id==='identity'){
      const auth=group('trusted-auth');box(auth,100,260,700,190);T(auth,130,315,'真实认证入口',36,{weight:650});T(auth,130,375,'验证登录会话或 token',32);T(auth,130,425,'取得 user_id = U-A',32,{mono:true,fill:C.blue});
      const ownerA=group('owned-resource'),ownerB=group('other-resource');
      [[ownerA,280,'合同 C-17','U-A'],[ownerB,610,'合同 C-88','U-B']].forEach(([g,y,label,owner])=>{box(g,1060,y,730,200);T(g,1090,y+50,label,36,{weight:650});T(g,1090,y+112,'owner = '+owner,32,{mono:true});});
      const allow=T(ownerA,1480,435,'允许访问',34,{fill:C.blue,weight:650}),deny=T(ownerB,1480,765,'拒绝访问',34,{weight:650});
      const a=path('M800 390 L950 390 L1030 390'),b=path('M800 425 L910 425 L910 720 L1030 720');
      const eq=T(bg,830,345,'U-A = U-A',30,{mono:true,fill:C.blue}),neq=T(bg,660,605,'U-A ≠ U-B',30,{mono:true,fill:C.muted});
      const boundary=group('authentication-boundary');T(boundary,100,650,'默认 X-User-ID 是占位头',32);T(boundary,100,710,'入口需要真实认证',32,{fill:C.muted});
      return {render(t){show(auth,1);show(ownerA,P(t,8));show(ownerB,P(t,18));draw(a,P(t,12,3));draw(b,P(t,22,3));show(eq,P(t,12));show(neq,P(t,22));show(allow,P(t,15));show(deny,P(t,25));show(boundary,P(t,30));V.note(t<18?'认证先确定访问者U-A，再检查资源归属。':t<30?'同一访问者：owner匹配才可访问，不匹配则拒绝。':'占位身份头需要替换；用户身份必须来自可信入口。');}};
    }
  }

  for(const s of STORY) {
    const cfg=M[s.id];if(!cfg||V.registry.has(s.id))continue;
    // Reading is a floor, not a fixed scene clock: recognize objects, read, then digest the relation.
    const readTime=text=>{
      const z=String(text||'');const cjk=(z.match(/[\u3400-\u9fff]/g)||[]).length;
      const terms=(z.match(/[A-Za-z][A-Za-z0-9_.\-/]*/g)||[]).length;
      return cjk/4.7+terms/2.5+1.8;
    };
    const intro=Math.max(7,Math.ceil(readTime(s.title)+readTime(s.lead)-1.8));
    const starts=[];let cursor=intro;
    for(const item of s.items||[]){starts.push(cursor);cursor+=Math.max(6.5,readTime(item.label+' '+item.detail)+1.8);}
    const mergeAt=(starts[2]||0)+2,foldAt=(starts[1]||0)+1,checkAt=(starts[3]||0)+2;
    const finalMotionEnd=cfg.shape==='ledger'?checkAt+8:cfg.shape==='merge-blocks'?mergeAt+12:cfg.shape==='fold'?foldAt+4:0;
    const finalAt=Math.ceil(Math.max(cursor,finalMotionEnd)+1.5);
    const duration=Math.max(45,Math.ceil(finalAt+readTime(s.pm)+3));
    const edgeStarts=cfg.edges.map((_,i)=>starts[Math.min(i+1,starts.length-1)]+1);
    V.register(s.id,{
      title:s.title,duration,covers:[s.id],
      phases:EXAMPLES[s.id]?.phases||[{at:0,name:'认识对象与关系'},...(s.items||[]).map((it,i)=>({at:starts[i],name:it.label})),{at:finalAt,name:'条件与结果'}],
      motion:EXAMPLES[s.id]?.motion||[...edgeStarts.map((at,i)=>({at,duration:3,purpose:cfg.shape+'：建立第'+(i+1)+'条语义连接'})),
        ...(cfg.shape==='merge-blocks'?[{at:mergeAt,duration:12,purpose:'同ID文字合并，保留error'}]:[]),
        ...(cfg.shape==='fold'?[{at:foldAt,duration:4,purpose:'旧消息收拢，近期消息保留'}]:[]),
        ...(cfg.shape==='ledger'?[{at:checkAt,duration:8,purpose:'阶段结果改变台账状态'}]:[])],
      build(svg) {
        if(EXAMPLES[s.id])return buildExample(s.id,svg,s,duration);
        const root=V.group(svg,'editorial-'+s.id);const defs=V.el(root,'defs',{});const arrowId='editorial-arrow-'+s.id;const marker=V.el(defs,'marker',{id:arrowId,viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:7,markerHeight:7,orient:'auto'});V.path(marker,'M0 0 L10 5 L0 10 Z',{fill:C.blue});const under=V.group(root,'structure'), objects=V.group(root,'objects');
        const texts=[];const shapes=[];const nodes=[];const extra=[];
        const T=(parent,x,y,text,size=30,opts={})=>V.text(parent,x,y,text,size,opts);
        const path=(d,attrs={})=>V.path(under,d,{fill:'none',stroke:C.blue,'stroke-width':3,...attrs});
        const box=(x,y,w,h,attrs={})=>V.rect(under,x,y,w,h,{fill:'none',stroke:C.line,'stroke-width':2,...attrs});
        const line=(x1,y1,x2,y2,attrs={})=>V.line(under,x1,y1,x2,y2,{stroke:C.line,'stroke-width':2,...attrs});
        const mark=(x,y,text)=>{V.circle(under,x,y,27,{fill:C.paper,stroke:C.blue,'stroke-width':2});T(under,x,y+10,text,28,{anchor:'middle',mono:true,fill:C.blue,role:'navigation'});};
        if(cfg.root) T(under,cfg.root[1],cfg.root[2],cfg.root[0],34,{weight:650});
        for(const [text,x,y]of cfg.labels||[]) T(under,x,y,text,30,{fill:C.blue});
        for(const [i,it]of (s.items||[]).entries()) {
          const [x,y,w]=cfg.pos[i],g=V.group(objects,'topic-'+i),headLines=wrap(it.label,w,34);
          const head=[];headLines.forEach((z,j)=>head.push(T(g,0,j*44,z,34,{weight:650,key:s.id+'-label-'+i+'-'+j})));
          const bodyY=headLines.length*44+12;
          wrap(it.detail,w,30).forEach((z,j)=>T(g,0,bodyY+j*40,z,30,{fill:C.muted,key:s.id+'-detail-'+i+'-'+j}));
          const accent=V.line(g,0,-46,Math.min(130,w),-46,{stroke:C.blue,'stroke-width':4});
          nodes.push({g,x,y,w,head,accent});
        }
        const edges=cfg.edges.map((d,i)=>({e:path(d,{'stroke-linejoin':'round'}),i}));
        // Meaning-bearing structure is independent of explanatory paragraphs.
        switch(cfg.shape) {
          case 'triangle': V.circle(under,960,540,49,{fill:C.pale,stroke:C.blue,'stroke-width':2});T(under,960,550,'工作',30,{anchor:'middle',weight:600});break;
          case 'tree': V.circle(under,300,495,8,{fill:C.blue});break;
          case 'lanes': line(90,465,1810,465,{'stroke-dasharray':'6 10'});break;
          case 'merge': path('M1010 430 L1050 465 L1010 500');break;
          case 'material': [110,560,1010,1460].forEach((x,i)=>{const p=path(`M${x} 680 L${x+210} 680 L${x+210} 810 L${x} 810 Z`,{stroke:C.line});extra.push({kind:'paper',e:p,i});});break;
          case 'adapter': box(510,220,420,480,{stroke:C.blue});box(960,220,420,480,{stroke:C.blue});break;
          case 'merge-blocks': {
            const chunks=V.group(under,'block-merge');const mergeLabel=T(under,740,510,'block_id 对齐后合并',30,{fill:C.blue});extra.push({kind:'merge-label',e:mergeLabel});
            ['B1 · 文本','B1 · 追加','error'].forEach((z,i)=>{const g=V.group(chunks,'chunk-'+i);const rect=V.rect(g,0,0,220,55,{fill:C.pale,stroke:C.blue,'stroke-width':1.5});const text=T(g,15,37,z,30,{mono:true});extra.push({kind:'chunk',g,i,rect,text});});
            const late=V.group(under,'late-success');T(late,0,0,'success',30,{mono:true,fill:C.muted});V.line(late,-5,-12,145,-12,{stroke:C.muted,'stroke-width':2});extra.push({kind:'late-success',g:late});mark(1720,580,'T1');break;
          }
          case 'parallel': {
            [330,455].forEach((y,i)=>{line(800,y,1010,y,{stroke:C.blue});V.circle(under,815,y,8,{fill:C.blue});});
            path('M800 760 L905 760 L905 800 L1010 800',{stroke:C.blue});break;
          }
          case 'roles': setDashed(edges[2]?.e);break;
          case 'stack': [0,1,2].forEach(i=>box(220+i*60,210+i*190,1430-i*60,170,{fill:i===2?C.pale:C.paper}));break;
          case 'fold': {
            [0,1,2,3].forEach(i=>{const p=box(740+i*28,390+i*18,180,110,{fill:C.paper});extra.push({kind:'fold',e:p,i});});
            line(1020,550,1790,550,{'stroke-dasharray':'7 9'});break;
          }
          case 'bidirectional': line(950,235,950,810,{'stroke-dasharray':'5 10'});break;
          case 'rag': box(1080,230,740,330,{stroke:C.blue});break;
          case 'gate': line(930,265,930,520,{stroke:C.ink,'stroke-width':6});setDashed(edges[2]?.e);break;
          case 'cut': line(948,320,975,380,{stroke:C.ink,'stroke-width':5});break;
          case 'boundary': box(80,200,1760,620,{stroke:C.blue});[260,880,1500].forEach(x=>{line(x,200,x,275,{stroke:C.blue});V.circle(under,x,200,7,{fill:C.blue});});break;
          case 'return': setDashed(edges[2]?.e);setDashed(edges[3]?.e);break;
          case 'star': box(660,245,600,280,{stroke:C.blue});break;
          case 'ledger': [380,440,500].forEach((y,i)=>{line(120,y,830,y);const c=path(`M128 ${y-22} L137 ${y-13} L155 ${y-36}`,{stroke:C.blue});extra.push({kind:'check',e:c,i});});break;
          case 'layers': [0,1,2].forEach(i=>box(220,210+i*200,1430,180,{fill:i===1?C.pale:C.paper}));break;
          case 'ownership': box(1060,220,760,630,{stroke:C.blue});break;
          case 'topology': box(690,220,600,340,{fill:C.pale});break;
          case 'projections': line(960,245,960,260);break;
          case 'context-axis': line(80,585,1840,585,{stroke:C.blue});break;
          case 'two-lifetimes': line(960,210,960,850,{'stroke-dasharray':'5 10'});break;
          case 'idempotency': box(1050,210,760,350,{stroke:C.blue});setDashed(edges[1]?.e);break;
          case 'capabilities': box(80,240,1790,570,{stroke:C.blue});[300,760,1220,1680].forEach(x=>line(x,255,x,270,{stroke:C.blue}));break;
          case 'auth-layers': line(80,565,1830,565,{'stroke-dasharray':'9 9'});T(under,770,550,'注册边界',30,{fill:C.blue});break;
          case 'nested': box(80,200,550,590,{stroke:C.blue});box(110,285,480,420);[800,980,1150].forEach(x=>V.circle(under,x,670,18,{fill:C.paper,stroke:C.blue,'stroke-width':2}));break;
          case 'acceptance': line(960,200,960,850,{'stroke-dasharray':'5 10'});setDashed(edges[2]?.e);break;
          case 'scopes': box(80,210,1760,640,{stroke:C.blue});line(960,580,960,830,{'stroke-dasharray':'6 10'});break;
          case 'budget': line(100,545,800,545,{stroke:C.blue});line(1100,545,1800,545,{stroke:C.ink});line(1750,525,1750,565,{stroke:C.ink,'stroke-width':5});break;
          case 'u-route': setDashed(edges[3]?.e);break;
          case 'dedupe': V.circle(under,950,400,12,{fill:C.blue});setDashed(edges[1]?.e);line(1030,595,1810,595,{'stroke-dasharray':'6 10'});break;
          case 'restore-point': V.circle(under,960,720,12,{fill:C.blue});break;
        }
        function setDashed(e){if(e)e.dataset.conditional='1';}
        const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        const p=(t,at,d=2.2)=>reduce?+(t>=at+d):V.p(t,at,d);
        return {render(t) {
          nodes.forEach((n,i)=>{
            const appear=p(t,starts[i],1.8);V.show(n.g,appear);V.move(n.g,n.x,n.y);
            const hot=t>=starts[i]&&t<(starts[i+1]||finalAt);
            n.head.forEach(e=>V.set(e,{fill:hot?C.blue:C.ink}));V.set(n.accent,{x2:hot?130:60,opacity:hot?1:.35});
          });
          edges.forEach(({e,i})=>{
            const q=p(t,edgeStarts[i],3),len=e.getTotalLength();
            V.set(e,{'stroke-dasharray':e.dataset.conditional?'9 9':len,'stroke-dashoffset':e.dataset.conditional?0:len*(1-q),opacity:q,'marker-end':q>.99?'url(#'+arrowId+')':'none'});
          });
          extra.forEach(x=>{
            if(x.kind==='paper'){V.show(x.e,p(t,starts[x.i]+1));}
            if(x.kind==='chunk'){
              const q=p(t,mergeAt+x.i*2,3),target=[1030,1190,1510][x.i];V.move(x.g,V.lerp(690,target,q),V.lerp(430+x.i*60,545,q));V.show(x.g,p(t,starts[1]+1+x.i*2));V.set(x.rect,{width:x.i===0?V.lerp(220,440,q):220,opacity:x.i===1?1-q:1});x.text.textContent=x.i===1&&q>.5?'追加':(['B1 · 文本','B1 · 追加','error'][x.i]);
            }
            if(x.kind==='merge-label')V.show(x.e,p(t,mergeAt+7));
            if(x.kind==='late-success'){const q=p(t,mergeAt+9,3);V.move(x.g,V.lerp(1720,1530,q),620);V.show(x.g,p(t,mergeAt+9));}
            if(x.kind==='fold'){
              const q=p(t,foldAt,4);V.set(x.e,{x:V.lerp(740+x.i*28,830,q),y:V.lerp(390+x.i*18,445+x.i*4,q),width:V.lerp(180,125,q),height:V.lerp(110,34,q),opacity:1-q*.65});
            }
            if(x.kind==='check')V.show(x.e,p(t,checkAt+x.i*3));
          });
          // Preserve source conditions as local object text; note supplies current interpretation only.
          V.note(t>=finalAt?(s.pm||s.lead||''):(s.lead||''));
        }};
      }
    });
  }
})();
