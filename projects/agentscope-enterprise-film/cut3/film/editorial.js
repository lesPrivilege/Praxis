/* Explicit editorial graphs. Each mapping is a semantic composition, never an old kind. */
(() => {
  'use strict';
  const V=window.V3, C=V.C;
  const STORY=Array.isArray(window.V3_STORY)?window.V3_STORY:(window.V3_STORY?.scenes||[]);
  // Card layouts: cards are [x,y,w] top-left boxes (height follows text); links route between card edges.
  // ports: two letters (from side, to side) of l/r/t/b; 'bb' loops underneath. Hubs are small named pills.
  const ROW4=[72,529,986,1443],ROW3=[72,690,1308];
  const GRID=[[72,262,720],[1056,262,792],[1056,602,792],[72,602,720]];
  const M={
    docs:{hubs:[{id:'q',text:'项目要解决什么？',x:960,y:262}],cards:ROW4.map(x=>[x,420,405]),links:[0,1,2,3].map(i=>['q',i,{ports:'bt'}])},
    lanes:{cards:[[72,262,720],[72,602,720],[1056,262,792],[1056,602,792]],heads:[['Python',72,236],['Java',72,576]],divider:[[72,540,1848,540]],links:[[0,2],[1,3]]},
    migration:{cards:[[72,250,640],[72,590,640],[1150,420,698]],links:[[0,2,{label:'职责汇入'}],[1,2]]},
    task:{cards:ROW4.map(x=>[x,400,405]),tags:{0:'合同',1:'条款依据',2:'候选',3:'业务确认'},links:[[0,1],[1,2],[2,3]]},
    model:{cards:ROW4.map(x=>[x,330,405]),tags:{0:'内部结构',2:'供应商协议'},links:[[0,1],[1,2],[2,3],[3,0,{ports:'bb',label:'返回统一结构'}]]},
    integration:{cards:[[72,250,640],[72,580,640],[1250,0,598]],hubs:[{id:'tk',text:'Toolkit',x:1000,between:[0,1],mono:true}],align:{2:'tk'},links:[[0,'tk'],[1,'tk'],[2,'tk',{dash:true}]]},
    context:{cards:[[72,240,1560],[72,430,1560],[72,620,1560]],bracket:{x:1672,label:'模型输入'}},
    memory:{cards:[[72,410,520],[1328,410,520],[700,240,520],[700,600,520]],links:[[0,2,{ports:'tl'}],[2,1,{ports:'rt'}],[1,3,{ports:'br'}],[3,0,{ports:'lb'}]]},
    pipeline:{cards:[[72,280,400],[532,280,400],[992,280,400],[532,640,400]],hubs:[{id:'end',text:'结束',sub:'pass / impossible',x:1668,alignTo:2}],links:[[0,1],[1,2],[2,'end'],[2,3,{ports:'bt',label:'fail 且预算允许',dash:true}],[3,0,{ports:'lb',dash:true}]]},
    service:{cards:[[260,230,1588],[260,450,1588],[260,670,1588]],sideHeads:['请求','运行','记录'],links:[[0,1],[1,2]]},
    observability:{hubs:[{id:'s',text:'session / reply 身份',x:960,y:262,mono:true}],cards:[...ROW3.map(x=>[x,400,540]),[654,700,612]],links:[['s',0,{ports:'bt'}],['s',1,{ports:'bt'}],['s',2,{ports:'bt'}],[0,3,{ports:'bt'}],[2,3,{ports:'bt'}]]},
    'java-02-agent-session':{cards:[GRID[0],GRID[1],GRID[2],GRID[3]],heads:[['即时请求',72,236],['后台会话',1056,236]],divider:[[960,220,960,500]],links:[[1,2],[2,3,{label:'原任务续接'}]]},
    'java-04-session-turn-idempotency':{cards:[GRID[0],GRID[1],GRID[3],GRID[2]],links:[[0,1],[2,1,{ports:'rl',tf:.75,label:'同 key + 同请求体',dash:true}],[1,3]]},
    'java-orchestration':{cards:ROW3.map(x=>[x,280,540]),minH:470,tags:{0:'当前 Agent 范围',1:'成员关系',2:'依赖关系'},glyphs:['nest','team','flow']},
    'java-issue':{cards:GRID,heads:[['工作定义 / 接收',72,236],['执行 / 运行记录',1056,236]],links:[[0,1],[1,2],[2,3,{label:'结果交接'}]]},
    'java-auth-scope':{cards:[GRID[0],GRID[1],GRID[3],GRID[2]],links:[[0,1],[1,3,{ports:'bt'}],[1,2,{ports:'bt',label:'作用域内分别判断'}]]},
    'java-budget':{cards:GRID,tags:{0:'已报告用量',1:'配置限制'},links:[[0,1],[1,2],[2,3]]},
    'java-channels':{cards:GRID,links:[[0,1],[1,2],[2,3],[3,0,{label:'原外部对话',dash:true}]]},
    'java-webhook':{cards:GRID,tags:{3:'业务幂等契约另核对'},links:[[0,1],[1,2,{label:'同一 event_id'}],[2,3]]},
    'java-storage':{cards:ROW3.map(x=>[x,280,540]),hubs:[{id:'bp',text:'同一备份点',x:960,y:720}],links:[[0,'bp',{ports:'bt'}],[1,'bp',{ports:'bt'}],[2,'bp',{ports:'bt'}]]},
    // Worked examples keep their own builders; shape only feeds the shared duration formula.
    tools:{shape:'merge-blocks'},plan:{shape:'ledger'},rag:{shape:'rag'},identity:{shape:'ownership'}
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
    const root=V.group(svg,'worked-'+id), bg=V.group(root,'worked-structure'), fg=V.group(root,'worked-objects'), heads=V.arrows(root,'worked-'+id);
    const T=(p,x,y,z,size=32,o={})=>V.text(p,x,y,z,size,o), S=V.set;
    const box=(p,x,y,w,h,a={})=>V.rect(p,x,y,w,h,{fill:C.card,stroke:C.edge,'stroke-width':2,rx:14,...a});
    const path=(d,a={})=>{const e=V.path(bg,d,{fill:'none',stroke:C.blue,'stroke-width':3,'stroke-linejoin':'round',...a});e.dataset.arrow=heads.blue;return e;};
    const group=name=>V.group(fg,name), show=V.show;
    const P=(t,at,d=2.2)=>V.p(t,at,d), L=V.lerp;
    const draw=(e,q)=>{const n=e.getTotalLength();S(e,{'stroke-dasharray':n,'stroke-dashoffset':n*(1-q),opacity:q,'marker-end':q>.98?e.dataset.arrow:'none'});};
    T(bg,1710,210,'合同例',28,{fill:C.muted,role:'navigation'});
    if(id==='tools'){
      const schema=group('schema-input');box(schema,100,245,580,160);T(schema,130,295,'Schema',34,{weight:650});T(schema,130,342,'read_contract(contract_id)',30,{mono:true});T(schema,130,383,'名称、参数与说明',30,{fill:C.muted});
      const model=group('model-input');box(model,1230,245,520,160,{stroke:C.blue});T(model,1260,302,'模型输入',36,{weight:650});T(model,1260,363,'可调用什么、怎样填写参数',30,{fill:C.muted});
      const schemaLine=path('M680 325 L1226 325');T(bg,835,300,'工具定义',30,{fill:C.blue});
      const response=group('response-B1');box(response,730,470,1060,350,{stroke:C.blue});T(response,770,520,'ToolResponse · B1',34,{weight:650,mono:true});
      const d1=T(fg,100,585,'第8条：',36,{weight:550,key:'tools-worked-B1-1'}),d2=T(fg,100,675,'赔偿不超过合同额。',36,{weight:550,key:'tools-worked-B1-2'});
      const incoming=T(bg,100,505,'ToolChunk · 同一 block_id=B1',30,{mono:true,fill:C.blue});
      const call=group('original-T1');T(call,100,850,'原调用 T1',32,{mono:true,weight:650});const pairing=path(V.route([[350,840],[650,840],[650,750],[726,750]]));T(response,770,757,'ToolResultBlock · T1',32,{mono:true,weight:650});
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
      const a=path('M800 390 L1056 390'),b=path(V.route([[800,425],[910,425],[910,720],[1056,720]]));
      const eq=T(bg,830,345,'U-A = U-A',30,{mono:true,fill:C.blue}),neq=T(bg,660,605,'U-A ≠ U-B',30,{mono:true,fill:C.muted});
      const boundary=group('authentication-boundary');T(boundary,100,650,'默认 X-User-ID 是占位头',32);T(boundary,100,710,'入口需要真实认证',32,{fill:C.muted});
      return {render(t){show(auth,1);show(ownerA,P(t,8));show(ownerB,P(t,18));draw(a,P(t,12,3));draw(b,P(t,22,3));show(eq,P(t,12));show(neq,P(t,22));show(allow,P(t,15));show(deny,P(t,25));show(boundary,P(t,30));V.note(t<18?'认证先确定访问者U-A，再检查资源归属。':t<30?'同一访问者：owner匹配才可访问，不匹配则拒绝。':'占位身份头需要替换；用户身份必须来自可信入口。');}};
    }
  }

  for(const s of STORY) {
    const cfg=M[s.id];if(!cfg||V.registry.has(s.id))continue;
    // Reading is a floor, not a fixed scene clock: recognize objects, read, then digest the relation.
    const readTime=text=>{
      const z=String(text||'');const cjk=(z.match(/[㐀-鿿]/g)||[]).length;
      const terms=(z.match(/[A-Za-z][A-Za-z0-9_.\-/]*/g)||[]).length;
      return cjk/4.7+terms/2.5+1.8;
    };
    const intro=Math.max(7,Math.ceil(readTime(s.title)+readTime(s.lead)-1.8));
    const starts=[];let cursor=intro;
    for(const item of s.items||[]){starts.push(cursor);cursor+=Math.max(6.5,readTime(item.label+' '+item.detail)+1.8);}
    const mergeAt=(starts[2]||0)+2,checkAt=(starts[3]||0)+2;
    const finalMotionEnd=cfg.shape==='ledger'?checkAt+8:cfg.shape==='merge-blocks'?mergeAt+12:0;
    const finalAt=Math.ceil(Math.max(cursor,finalMotionEnd)+1.5);
    const duration=Math.max(45,Math.ceil(finalAt+readTime(s.pm)+3));
    // A node appears with its step; a hub is there from the start; a link follows its later end.
    const appearAt=k=>typeof k==='number'?starts[k]:1;
    const links=(cfg.links||[]).map(([a,b,o={}])=>({a,b,o,at:Math.max(appearAt(a),appearAt(b))+1}));
    const until=at=>[...starts,finalAt].find(x=>x>at)??finalAt;
    V.register(s.id,{
      title:s.title,duration,covers:[s.id],
      phases:EXAMPLES[s.id]?.phases||[{at:0,name:'认识对象与关系'},...(s.items||[]).map((it,i)=>({at:starts[i],name:it.label})),{at:finalAt,name:'条件与结果'}],
      motion:EXAMPLES[s.id]?.motion||[...(s.items||[]).map((it,i)=>({at:starts[i],duration:1.8,purpose:it.label+'进入'})),...links.map((l,i)=>({at:l.at,duration:3,purpose:'建立第'+(i+1)+'条连接'}))],
      build(svg) {
        if(EXAMPLES[s.id])return buildExample(s.id,svg,s,duration);
        const root=V.group(svg,'editorial-'+s.id),arrow=V.arrows(root,'ed-'+s.id);
        const under=V.group(root,'structure'),wires=V.group(root,'links'),objects=V.group(root,'objects'),labels=V.group(root,'link-labels');
        const T=(p,x,y,text,size=30,o={})=>V.text(p,x,y,text,size,o);
        const halo=e=>V.set(e,{stroke:C.paper,'stroke-width':10,'stroke-linejoin':'round','paint-order':'stroke'});
        // Measure every card first so rows share one height and links know real edges.
        const PAD=32,cards=(s.items||[]).map((it,i)=>{
          const [x,y,w]=cfg.cards[i],tag=cfg.tags?.[i],head=wrap(it.label,w-2*PAD,34),body=wrap(it.detail,w-2*PAD,30);
          const top=28+(tag?36:0),h=Math.max(cfg.minH||0,top+30+(head.length-1)*44+50+(body.length-1)*40+34);
          return {i,x,y,w,h,tag,head,body};
        });
        const rows=new Map();cards.forEach(c=>rows.set(c.y,Math.max(rows.get(c.y)||0,c.h)));cards.forEach(c=>{c.h=rows.get(c.y)||c.h;});
        const hubs=new Map();
        for(const h of cfg.hubs||[]){
          const w=Math.max(widthUnits(h.text)*30*(h.mono?1.12:1),h.sub?widthUnits(h.sub)*30*1.12:0)+60,hh=h.sub?100:64;
          const cy=h.between?(cards[h.between[0]].y+cards[h.between[0]].h/2+cards[h.between[1]].y+cards[h.between[1]].h/2)/2:h.alignTo!=null?cards[h.alignTo].y+cards[h.alignTo].h/2:h.y+hh/2;
          hubs.set(h.id,{...h,x:h.x-w/2,y:cy-hh/2,w,h:hh});
        }
        for(const [i,id] of Object.entries(cfg.align||{})){const c=cards[i],hub=hubs.get(id);c.y=hub.y+hub.h/2-c.h/2;}
        const box=k=>typeof k==='number'?cards[k]:hubs.get(k);
        // Centre the whole composition in the band between title and note.
        const heads=(cfg.heads||[]).map(([z,x,y])=>[z,x,y]),dividers=(cfg.divider||[]).map(d=>[...d]);
        {const ys=[...cards,...hubs.values()].flatMap(r=>[r.y,r.y+r.h]).concat(heads.map(h=>h[2]-28));if(links.some(l=>l.o.ports==='bb'))ys.push(Math.max(...cards.map(c=>c.y+c.h))+80);
         const dy=Math.round(555-(Math.min(...ys)+Math.max(...ys))/2);cards.forEach(c=>c.y+=dy);hubs.forEach(h=>h.y+=dy);heads.forEach(h=>h[2]+=dy);dividers.forEach(d=>{d[1]+=dy;d[3]+=dy;});}
        // Scene furniture: lane heads, dividers and brackets sit under the cards.
        for(const [text,x,y] of heads)T(under,x,y,text,30,{fill:C.blue,weight:600});
        for(const [x1,y1,x2,y2] of dividers)V.line(under,x1,y1,x2,y2,{stroke:C.line,'stroke-width':2,'stroke-dasharray':'4 10','stroke-linecap':'round'});
        (cfg.sideHeads||[]).forEach((z,i)=>T(under,72,cards[i].y+cards[i].h/2+11,z,32,{fill:C.blue,weight:600}));
        if(cfg.bracket){const b=cfg.bracket,y1=cards[0].y,y2=cards.at(-1).y+cards.at(-1).h,mid=(y1+y2)/2;V.path(under,`M${b.x} ${y1} H${b.x+18} V${y2} H${b.x}M${b.x+18} ${mid} H${b.x+40}`,{stroke:C.blue,'stroke-width':3,fill:'none'});T(under,b.x+56,mid+11,b.label,32,{fill:C.blue,weight:600});}
        const nodes=cards.map(c=>{
          const g=V.group(objects,'topic-'+c.i),frame=V.rect(g,0,0,c.w,c.h,{fill:C.card,stroke:C.edge,'stroke-width':2,rx:14});
          let y=28;if(c.tag){T(g,PAD,y+22,c.tag,24,{fill:C.blue,weight:600,role:'navigation'});y+=36;}
          const head=c.head.map((z,j)=>T(g,PAD,y+30+j*44,z,34,{weight:650,key:s.id+'-label-'+c.i+'-'+j}));
          const by=y+30+(c.head.length-1)*44+50;c.body.forEach((z,j)=>T(g,PAD,by+j*40,z,30,{fill:C.muted,key:s.id+'-detail-'+c.i+'-'+j}));
          if(cfg.glyphs)glyph(g,cfg.glyphs[c.i],PAD,c.h-150,c.w-2*PAD);
          return {g,frame,head,c};
        });
        const hubNodes=[...hubs.values()].map(h=>{
          const g=V.group(objects,'hub-'+h.id);V.rect(g,h.x,h.y,h.w,h.h,{fill:C.pale,stroke:C.blue,'stroke-width':2,rx:h.h/2});
          if(h.sub){T(g,h.x+h.w/2,h.y+42,h.sub,30,{anchor:'middle',mono:true,fill:C.blue});T(g,h.x+h.w/2,h.y+80,h.text,30,{anchor:'middle',weight:650});}
          else T(g,h.x+h.w/2,h.y+h.h/2+11,h.text,30,{anchor:'middle',weight:650,mono:!!h.mono,fill:C.blue});
          return g;
        });
        // Orthogonal routes between real card edges.
        const port=(r,side,f=.5)=>side==='l'?[r.x,r.y+r.h*f]:side==='r'?[r.x+r.w,r.y+r.h*f]:side==='t'?[r.x+r.w*f,r.y]:[r.x+r.w*f,r.y+r.h];
        function points(A,B,o){
          let ports=o.ports;
          if(!ports){
            const oy=[Math.max(A.y,B.y),Math.min(A.y+A.h,B.y+B.h)],ox=[Math.max(A.x,B.x),Math.min(A.x+A.w,B.x+B.w)];
            if(B.x>=A.x+A.w||A.x>=B.x+B.w){
              const right=B.x>=A.x+A.w,ax=right?A.x+A.w:A.x,bx=right?B.x:B.x+B.w;
              if(oy[1]-oy[0]>=60){const y=(oy[0]+oy[1])/2;return [[ax,y],[bx,y]];}
              ports=right?'rl':'lr';
            }else{
              const down=B.y>=A.y+A.h,ay=down?A.y+A.h:A.y,by=down?B.y:B.y+B.h;
              const x=A.x+A.w/2>=ox[0]&&A.x+A.w/2<=ox[1]?A.x+A.w/2:(ox[0]+ox[1])/2;return [[x,ay],[x,by]];
            }
          }
          const a=port(A,ports[0],o.ff??.5),b=port(B,ports[1],o.tf??.5),ha=/[lr]/.test(ports[0]),hb=/[lr]/.test(ports[1]);
          if(ports==='bb'){const y=Math.max(a[1],b[1])+64;return [a,[a[0],y],[b[0],y],b];}
          if(ha&&hb){if(Math.abs(a[1]-b[1])<2)return [a,b];const mx=(a[0]+b[0])/2;return [a,[mx,a[1]],[mx,b[1]],b];}
          if(!ha&&!hb){if(Math.abs(a[0]-b[0])<2)return [a,b];const my=(a[1]+b[1])/2;return [a,[a[0],my],[b[0],my],b];}
          return ha?[a,[b[0],a[1]],b]:[a,[a[0],b[1]],b];
        }
        const edges=links.map(l=>{
          const pts=points(box(l.a),box(l.b),l.o),e=V.path(wires,V.route(pts),{fill:'none',stroke:C.slate,'stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round'});
          let label=null;
          if(l.o.label){
            let best=0,k=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);if(d>best){best=d;k=i;}}
            const [p,q]=[pts[k-1],pts[k]],mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2;
            label=p[1]===q[1]?T(labels,mx,my-16,l.o.label,30,{anchor:'middle',fill:C.blue,weight:550}):T(labels,mx+18,my+10,l.o.label,30,{fill:C.blue,weight:550});halo(label);
          }
          return {...l,e,label,len:e.getTotalLength()};
        });
        function glyph(g,kind,x,y,w){
          const k={fill:C.card,stroke:C.frame,'stroke-width':2},b={stroke:C.blue,'stroke-width':2.5,fill:'none'};
          if(kind==='nest'){V.rect(g,x,y,w,112,{...k,fill:C.paper,rx:10});T(g,x+22,y+44,'Agent',26,{mono:true,fill:C.muted,role:'navigation'});V.rect(g,x+w-210,y+28,180,62,{...k,stroke:C.blue,rx:8});T(g,x+w-120,y+68,'subagent',24,{mono:true,anchor:'middle',fill:C.blue,role:'navigation'});V.path(g,V.route([[x+120,y+76],[x+w-216,y+76]]),{...b,'marker-end':arrow.blue});}
          if(kind==='team'){const xs=[x+50,x+w/2,x+w-50];V.path(g,`M${xs[0]} ${y+80} L${xs[1]} ${y+30} L${xs[2]} ${y+80} Z`,{stroke:C.line,'stroke-width':2,fill:'none'});xs.forEach((cx,i)=>V.circle(g,cx,i===1?y+30:y+80,24,{...k,stroke:C.blue}));}
          if(kind==='flow'){const n=3,sw=96,gap=(w-n*sw)/(n-1);for(let i=0;i<n;i++){V.rect(g,x+i*(sw+gap),y+30,sw,56,{...k,rx:8});T(g,x+i*(sw+gap)+sw/2,y+67,String(i+1),26,{anchor:'middle',mono:true,fill:C.muted,role:'navigation'});if(i)V.path(g,`M${x+i*(sw+gap)-gap+8} ${y+58} H${x+i*(sw+gap)-6}`,{...b,'marker-end':arrow.blue});}}
        }
        const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        const p=(t,at,d=2.2)=>reduce?+(t>=at+d):V.p(t,at,d);
        return {render(t) {
          nodes.forEach((n,i)=>{
            const appear=p(t,starts[i],1.8),hot=t>=starts[i]&&t<(starts[i+1]??finalAt);
            V.show(n.g,appear);V.move(n.g,n.c.x,n.c.y+(1-appear)*14);
            V.set(n.frame,{stroke:hot?C.blue:C.edge,'stroke-width':hot?2.5:2});n.head.forEach(e=>V.set(e,{fill:hot?C.blue:C.ink}));
          });
          hubNodes.forEach(g=>V.show(g,p(t,1,1.8)));
          edges.forEach(l=>{
            const q=p(t,l.at,2.4),hot=t>=l.at&&t<until(l.at),color=hot?'blue':'slate';
            V.set(l.e,{stroke:C[color],opacity:q>0?1:0,'stroke-dasharray':l.o.dash?(q>.98?'10 9':`${l.len*q} ${l.len}`):l.len,'stroke-dashoffset':l.o.dash?0:l.len*(1-q),'marker-end':q>.98?arrow[color]:'none'});
            if(l.label)V.show(l.label,p(t,l.at+1.2,1.4));
          });
          // Preserve source conditions as local object text; note supplies current interpretation only.
          V.note(t>=finalAt?(s.pm||s.lead||''):(s.lead||''));
        }};
      }
    });
  }
})();
