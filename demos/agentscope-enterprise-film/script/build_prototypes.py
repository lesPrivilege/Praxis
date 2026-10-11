"""Integrate reviewed state exhibits without replacing the released full film."""
import json,re,math
from pathlib import Path
R=Path(__file__).resolve().parents[1];P=R/'quality/prototypes'
leaf=json.loads((R/'quality/reading-leaf-check.json').read_text())
info={
'events':('Event 按身份收成完整 Msg','同一 R1 的增量更新 B1；工具调用与结果由 T1 关联。','AgentScope 2.0.10dev · Message / Event'),
'permission':('确认解除暂停，原调用再进入执行','回复 R2 的 T2 经过校验、ASK、确认、执行与结果。','AgentScope 2.0.10dev · DEFAULT 示范路径'),
'offload':('摘要保留当前工作，文件保留回查细节','配置 Workspace Offloader 后，移出的内容仍可按引用读取。','AgentScope 2.0.10dev · Context Offloading'),
'artifact':('工作区文件经发布进入交付记录','Java Managed Session JS1 的文件上传与 Artifact 发布路径。','Java Service 2.1.0-BETA1 · Files / Artifacts')}
count=lambda s:len(re.findall(r'[一-鿿A-Za-z0-9]',s))
scenes=[];start=0
for i,(kind,(title,lead,source)) in enumerate(info.items()):
 known=set();rows=[r for r in leaf['stages'] if r['type']==kind];cues={};budgets=[];at=15.0
 for n,row in enumerate(rows):
  novel=[]
  for item in row['introduced']:
   text=item['text'].strip()
   if text=='合同复核示例':continue
   if text and text not in known:novel.append(text);known.add(text)
  chars=sum(count(s) for s in novel);hold=math.ceil(max(12,chars/5.5+(7 if n==0 else 5)))
  cues[row['phase']]=at;budgets.append({'phase':row['phase'],'characters':chars,'hold_seconds':hold,'new_text':novel});at+=hold
 dur=math.ceil(at+3);scenes.append({'id':kind,'type':kind,'title':title,'lead':lead,'sourceLine':source,'dur':dur,'chapter':[str(i+1).zfill(2),kind],'cues':cues,'identities':({'reply_id':'R2','tool_call_id':'T2'} if kind=='permission' else {'session_id':'JS1','file_id':'JF1','artifact_id':'JA1'} if kind=='artifact' else {}),'reading_budgets':budgets,'events':[{'at':0,'duration':dur}]})
 start+=dur
segments=[];t=0
for s in scenes:segments.append({'id':s['id'],'start':t,'end':t+s['dur'],'events':s['events'],'plain':'','text':'','words':[]});t+=s['dur']
tl={'duration':t,'fps':24,'segments':segments,'chapters':[{'id':s['id'],'t':seg['start'],'title':s['title']} for s,seg in zip(scenes,segments)]}
(P/'script/beats.json').write_text(json.dumps({'scenes':scenes},ensure_ascii=False,indent=2)+'\n');(P/'out/timeline.json').write_text(json.dumps(tl,ensure_ascii=False,indent=2)+'\n');(P/'film/timeline.js').write_text('window.TIMELINE='+json.dumps(tl,ensure_ascii=False)+';\n')
code='''window.PROTOTYPE_MANIFEST=[];\n'''
code+='const PROTO='+json.dumps(scenes,ensure_ascii=False)+';\n'
code+='''PROTO.forEach((s,i)=>{const seg=Film.seg(s.id);Film.scene(s.id,seg.start,seg.end,({root,tl})=>{
 K.el(root,'chrome-chapter','AgentScope · '+String(i+1).padStart(2,'0'));
 const h=K.el(root,'heading',s.title);K.show(h,seg.start,{duration:.8,y:12,stagger:0});
 const l=K.el(root,'lead',s.lead);K.show(l,seg.start+6,{duration:.6,y:10,stagger:0});
 K.el(root,'source',s.sourceLine);
 const m=MechanismLab.build(s.type,{root,tl,start:seg.start,duration:s.dur,cues:s.cues,identities:s.identities});
 window.PROTOTYPE_MANIFEST.push({id:s.id,start:seg.start,end:seg.end,...m,root:undefined,phases:undefined});
});});\n'''
(P/'film/scenes.js').write_text(code)
base=(R/'film/index.html').read_text()
base=base.replace('href="film.css"','href="../../../film/film.css"')
base=base.replace('</head>','<link rel="stylesheet" href="../../../film/mechanism-lab.css"></head>')
for f in ['gsap.min.js','engine.js','kit.js','boot.js']:base=base.replace('src="'+f+'"','src="../../../film/'+f+'"')
base=base.replace('src="scenes.js"','src="../../../film/mechanism-lab.js"></script><script src="scenes.js"')
base=base.replace('href="../reading.html"','href="../../../reading-v2.html"').replace('AgentScope 企业线：从文档到运行','AgentScope · 机制状态预览')
base=base.replace('<output id="clock"','<button id="read-step" type="button">逐步阅读</button><output id="clock"')
base=base.replace('</body>','''<script>document.getElementById('read-step').onclick=()=>{if(Player.playing)Player.toggle();const cues=PROTOTYPE_MANIFEST.flatMap(m=>Object.values(m.cues).map(t=>m.start+t+3.5));Player.go(cues.find(t=>t>Film.time+.1)??cues[0]);};</script></body>''')
(P/'film/index.html').write_text(base)
print('four state exhibits',t,'seconds',[(s['type'],s['dur']) for s in scenes])

# Compile precise windows from the deterministic scene itself, avoiding all-frame capture.
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 browser=pw.chromium.launch();page=browser.new_page(viewport={'width':1920,'height':1080})
 page.goto((P/'film/index.html').as_uri()+'?render=1');page.wait_for_function('Film.ready')
 manifest=page.evaluate('PROTOTYPE_MANIFEST');browser.close()
for scene,m,segment in zip(scenes,manifest,tl['segments']):
 windows=[{'at':0,'duration':1},{'at':6,'duration':.85}]+[{'at':e['at'],'duration':e['duration']} for e in m['motion_windows']]
 scene['events']=windows;segment['events']=windows
(P/'script/beats.json').write_text(json.dumps({'scenes':scenes},ensure_ascii=False,indent=2)+'\n')
(P/'out/timeline.json').write_text(json.dumps(tl,ensure_ascii=False,indent=2)+'\n')
(P/'film/timeline.js').write_text('window.TIMELINE='+json.dumps(tl,ensure_ascii=False)+';\n')
(P/'out/state-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
