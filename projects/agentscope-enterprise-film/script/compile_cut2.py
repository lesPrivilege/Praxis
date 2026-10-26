"""Full-scope second cut: generic explanation and verified state exhibits on one timeline."""
import argparse,json,re,math,copy,html
from pathlib import Path
R=Path(__file__).resolve().parents[1];P=R/'cut2'
AP=argparse.ArgumentParser();AP.add_argument('--retain-timing',action='store_true',help='Reuse reviewed scene durations and phase cues for local wording/motion repairs');ARGS=AP.parse_args()
PREVIOUS={s['id']:s for s in json.loads((P/'script/beats.json').read_text())['scenes']} if ARGS.retain_timing else {}
BASE=json.loads((R/'script/beats.json').read_text())['scenes']
PATCH=json.loads((R/'script/content-v2.json').read_text())['scenes'] if (R/'script/content-v2.json').exists() else []
patch={s['id']:s for s in PATCH};DEPTH=json.loads((R/'script/depth-v2.json').read_text())
CAT=json.loads((R.parents[1]/'vault/provenance/agentscope-enterprise-20261012/catalog.json').read_text());SOURCE={s['slug']:s for s in CAT['sources']}
COUNT=lambda s:len(re.findall(r'[一-鿿A-Za-z0-9]',s))
# These are implementation routes, not one shared Python/Java backend.
EXHIBITS={
 'agent':('RuntimeLab','state'),
 'events':('MechanismLab','events'),
 'permission':('MechanismLab','permission'),
 'offload':('MechanismLab','offload'),
 'sessions':('RuntimeLab','lock'),
 'background':('RuntimeLab','background'),
 'workspace':('WorkLab','isolation'),
 'java-03-execution-targets':('ServiceLab','targets'),
 'java-05-snapshot-sse-cursor':('ServiceLab','replay'),
 'java-07-files-artifacts':('MechanismLab','artifact'),
 'end':('WorkLab','closure')}
FOLDED={'hitl':'permission','failure':'end','delivery':'end'}
IDENTITIES={'permission':{'reply_id':'R2','tool_call_id':'T2'},'artifact':{'session_id':'JS1','file_id':'JF1','artifact_id':'JA1'}}
scenes=[];coverage={}
for original in BASE:
 sid=original['id']
 if sid in FOLDED:coverage[sid]=FOLDED[sid];continue
 s=copy.deepcopy(original);p=patch.get(sid,{})
 for k in ['title','lead','items','pm']:
  if k in p:s[k]=copy.deepcopy(p[k])
 s['essay_additions']=p.get('essay_additions',[]);s['covered_topics']=[sid]+[a for a,b in FOLDED.items() if b==sid]
 ids=list(dict.fromkeys([e['id'] for e in s['evidence']]+p.get('source_ids',[])+DEPTH.get(sid,{}).get('refs',[])))
 for folded in s['covered_topics'][1:]:
  ids+=patch.get(folded,{}).get('source_ids',[])
 s['evidence']=[{'id':i,'url':SOURCE[i]['url'],'version':SOURCE[i].get('version'),'snapshot':SOURCE[i].get('snapshot_path')} for i in dict.fromkeys(ids)]
 s['sourceLine']='AgentScope 2.0.10dev' if s['chapter'][0] in ['01','02','03','04'] else 'Java Harness v2 / Service 2.1.0-BETA1'
 if sid in EXHIBITS:
  family,kind=EXHIBITS[sid];s['exhibit']={'family':family,'type':kind,'identities':IDENTITIES.get(kind,{}),'duration':180,'cues':{}}
  s['dur']=180;s['events']=[{'at':0,'duration':180}]
 else:
  t=max(5,COUNT(s['title'])/4.7+1);s['leadAt']=round(t,2);t+=max(4,COUNT(s['lead'])/4.7+1);events=[{'at':0,'duration':1},{'at':s['leadAt'],'duration':.85}]
  if s['kind']=='branch':s['centerAt']=round(t,2);events.append({'at':s['centerAt'],'duration':.85});t+=4
  for item in s['items']:
   n=COUNT(item['label'])+COUNT(item['detail'])+2;item['labelAt']=round(t,2);events.append({'at':item['labelAt'],'duration':.85})
   if n<=34:item['detailAt']=item['labelAt'];t+=max(5,n/5+1.4)
   else:t+=max(3.5,(COUNT(item['label'])+2)/5+1);item['detailAt']=round(t,2);events.append({'at':item['detailAt'],'duration':.85});t+=max(4,COUNT(item['detail'])/5+1.1)
  s['pmAt']=round(t,2);events.append({'at':s['pmAt'],'duration':.85});t+=max(7,COUNT(s['pm'])/4.5+2);s['dur']=math.ceil(t);s['events']=events
 scenes.append(s);coverage[sid]=sid
assert set(coverage)=={s['id'] for s in BASE}
# Build file set, then ask each real exhibit for its phase contract and reading content.
def emit():
 t=0;segs=[];chapters=[]
 for s in scenes:
  segs.append({'id':s['id'],'start':t,'end':t+s['dur'],'plain':'','text':'','words':[],'events':s['events']})
  title=' '.join(s['chapter'])
  if not chapters or chapters[-1]['title']!=title:chapters.append({'id':s['id'],'t':t,'title':title})
  t+=s['dur']
 tl={'duration':t,'fps':24,'segments':segs,'chapters':chapters}
 (P/'script/beats.json').write_text(json.dumps({'scenes':scenes},ensure_ascii=False,indent=2)+'\n');(P/'script/coverage.json').write_text(json.dumps(coverage,ensure_ascii=False,indent=2)+'\n')
 (P/'out/timeline.json').write_text(json.dumps(tl,ensure_ascii=False,indent=2)+'\n');(P/'film/timeline.js').write_text('window.TIMELINE='+json.dumps(tl,ensure_ascii=False)+';\n')
 generic=(R/'script/stage-template.js').read_text().replace("STORY.scenes.forEach((s,idx)=>{","STORY.scenes.forEach((s,idx)=>{if(s.exhibit)return;")
 custom='''\nwindow.CUT2_MANIFEST=[];
 STORY.scenes.forEach(s=>{if(!s.exhibit)return;const seg=Film.seg(s.id),x=s.exhibit;Film.scene(s.id,seg.start,seg.end,({root,tl})=>{
 K.el(root,'chrome-chapter',s.chapter.join(' · '));const h=K.el(root,'heading',s.title);K.show(h,seg.start,{duration:.8,y:12,stagger:0});const l=K.el(root,'lead',s.lead);K.show(l,seg.start+6,{duration:.6,y:10,stagger:0});K.el(root,'source',s.sourceLine);
 const m=window[x.family].build(x.type,{root,tl,start:seg.start,duration:s.dur,cues:x.cues,identities:x.identities,output_filename:'review-v3.md',target_path:'review-v3.md',permission_mode:'EXPLORE'});
 CUT2_MANIFEST.push({id:s.id,start:seg.start,end:seg.end,...m,root:undefined,phases:undefined});});});
'''
 (P/'film/scenes.js').write_text('window.STORY='+json.dumps({'scenes':scenes},ensure_ascii=False)+';\n'+generic+custom)
 base=(R/'film/index.html').read_text().replace('href="film.css"','href="../../film/film.css"').replace('href="../reading.html"','href="../../reading-v2.html"')
 for f in ['gsap.min.js','engine.js','kit.js','boot.js']:base=base.replace('src="'+f+'"','src="../../film/'+f+'"')
 css=''.join('<link rel="stylesheet" href="../../film/'+f+'-lab.css">' for f in ['mechanism','service','runtime','work'])
 js=''.join('<script src="../../film/'+f+'-lab.js"></script>' for f in ['mechanism','service','runtime','work'])
 base=base.replace('<body>', '<body class="cut2">').replace('</head>',css+'<style>.cut2 .rl-chrome,.cut2 .wl-label,.cut2 .wl-identity,.cut2 .wl-step-index,.cut2 .wl-bridge,.cut2 .ml-case,.cut2 .wl-document .wl-label{font-size:30px}</style></head>').replace('<script src="scenes.js">',js+'<script src="scenes.js">').replace('AgentScope 企业线：从文档到运行','AgentScope 企业线 · 第二版完整讲解')
 (P/'film/index.html').write_text(base)
 return tl
emit()
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 browser=pw.chromium.launch();page=browser.new_page(viewport={'width':1920,'height':1080});page.goto((P/'film/index.html').as_uri()+'?render=1');page.wait_for_function('Film.ready')
 manifest=page.evaluate('CUT2_MANIFEST');browser.close()
by_id={m['id']:m for m in manifest}
for s in scenes:
 if not s.get('exhibit'):continue
 m=by_id[s['id']];phase_names=m['phase_names'];raw=m['screen_text'];seen=set();cues={};at=15
 if ARGS.retain_timing:
  old=PREVIOUS[s['id']];assert set(old['exhibit']['cues'])==set(phase_names);s['exhibit']['cues']=old['exhibit']['cues'];s['dur']=old['dur'];continue
 for i,name in enumerate(phase_names):
  texts=[r['text'] for r in raw if r['phase']==name]
  # Read estimates count Chinese characters plus stable English terms; tokens are
  # not read letter-by-letter. Formula is a design heuristic, not audience research.
  text=' '.join(texts);parts=re.split(r'\s+',text);novel=[]
  for part in parts:
   if part not in seen:novel.append(part);seen.add(part)
  val=' '.join(novel);cjk=len(re.findall('[一-鿿]',val));latin=len(re.findall('[A-Za-z]+(?:_[A-Za-z0-9]+)*',val))
  hold=math.ceil(max(10,cjk/4.0+latin/2.0+(6 if i==0 else 3)))
  cues[name]=at;at+=hold+(2 if s['id']=='permission' else 0)
 s['exhibit']['cues']=cues;s['dur']=math.ceil(at+3);s['events']=[{'at':0,'duration':s['dur']}]
tl=emit()
with sync_playwright() as pw:
 browser=pw.chromium.launch();page=browser.new_page(viewport={'width':1920,'height':1080});page.goto((P/'film/index.html').as_uri()+'?render=1');page.wait_for_function('Film.ready');manifest=page.evaluate('CUT2_MANIFEST');browser.close()
for s in scenes:
 if not s.get('exhibit'):continue
 m=next(m for m in manifest if m['id']==s['id']);s['events']=[{'at':0,'duration':1},{'at':6,'duration':.85}]+[{'at':e['at'],'duration':e['duration']} for e in m['motion_windows']]
tl=emit();(P/'out/exhibit-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(len(scenes),'scenes; all',len(coverage),'topics; duration',tl['duration'],'seconds')
