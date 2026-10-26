"""Real wall-clock 1x stage traversal with scheduled native frame samples."""
import hashlib,json,time
from datetime import datetime,timezone
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT=Path(__file__).resolve().parent
PROJECT=OUT.parents[1]
CUT=PROJECT/'cut2'
END=767.0
TL=json.loads((CUT/'out/timeline.json').read_text())
MANIFEST={entry['id']:entry for entry in json.loads((CUT/'out/exhibit-manifest.json').read_text())}
segments=[s for s in TL['segments'] if s['start']<END]
inputs=[CUT/'film/index.html',CUT/'film/timeline.js',CUT/'film/scenes.js',CUT/'out/timeline.json',CUT/'out/exhibit-manifest.json']+list((PROJECT/'film').glob('*-lab.*'))+[PROJECT/'film'/n for n in ['engine.js','kit.js','film.css','gsap.min.js']]
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def stamps():return {str(path.relative_to(PROJECT)):sha(path) for path in inputs}
plan=[]
def sample(t,scene,label,kind):
 if 0<=t<END:plan.append({'target_t':round(t,3),'scene':scene,'label':label,'kind':kind})
for seg in segments:
 sid=seg['id'];a=seg['start'];b=min(seg['end'],END)
 sample(a+1.05,sid,'heading-settled','heading')
 if a:sample(a+.22,sid,'scene-entry','boundary')
 entry=MANIFEST.get(sid)
 if entry:
  phases=entry['phase_names']
  for i,phase in enumerate(phases):
   cue=entry['cues'][phase]
   stop=a+entry['cues'][phases[i+1]] if i+1<len(phases) else b
   sample(stop-.5,sid,phase+'-settled','phase')
  for motion in entry['motion_windows']:
   if motion['purpose'] not in ['state_change','object_transfer']:continue
   for f in [.12,.5,.88]:sample(a+motion['at']+motion['duration']*f,sid,motion['purpose']+'-'+str(motion['at'])+'-'+str(f),'motion')
 else:sample(b-.5,sid,'final','scene-final')
plan.sort(key=lambda x:x['target_t'])
# Targets within 40 ms share one image, preserving all intended sample labels.
merged=[]
for target in plan:
 if merged and target['target_t']-merged[-1]['target_t']<.04 and target['scene']==merged[-1]['scene']:
  merged[-1]['labels'].append(target)
 else:merged.append({'target_t':target['target_t'],'scene':target['scene'],'labels':[target]})
report={'range':[0,END],'stage':[1920,1080],'requested_speed':1,'clock':'browser performance.now / requestAnimationFrame','started_utc':datetime.now(timezone.utc).isoformat(),'input_sha256':stamps(),'scene_ids':[s['id'] for s in segments],'scheduled_samples':len(merged),'page_errors':[],'samples':[]}
(OUT/'sample-plan.json').write_text(json.dumps(merged,ensure_ascii=False,indent=2)+'\n')
with sync_playwright() as pw:
 browser=pw.chromium.launch(args=['--force-device-scale-factor=1','--hide-scrollbars','--font-render-hinting=none','--disable-lcd-text','--disable-background-timer-throttling','--disable-renderer-backgrounding'])
 page=browser.new_page(viewport={'width':1920,'height':1080},device_scale_factor=1)
 page.on('pageerror',lambda e:report['page_errors'].append(str(e)))
 page.goto((CUT/'film/index.html').as_uri()+'?render=1')
 page.wait_for_function('window.Film && Film.ready');page.evaluate('document.fonts.ready')
 wall_start=time.monotonic()
 page.evaluate('''end=>{window.PB={start:performance.now(),t:0,frames:0,maxGapMs:0,gapsOver100ms:0,last:performance.now(),done:false,elapsed:0};function tick(now){let p=PB;const gap=now-p.last;p.maxGapMs=Math.max(p.maxGapMs,gap);if(gap>100)p.gapsOver100ms++;p.last=now;p.elapsed=(now-p.start)/1000;p.t=Math.min(end,p.elapsed);Film.seek(p.t);p.frames++;if(p.elapsed<end)requestAnimationFrame(tick);else p.done=true;}Film.seek(0);requestAnimationFrame(tick)}''',END)
 print(json.dumps({'event':'started','range':[0,END],'samples':len(merged),'wall_clock':True}),flush=True)
 next_progress=60
 for index,target in enumerate(merged):
  while True:
   state=page.evaluate('({...PB})')
   if state['t']>=target['target_t']:break
   if state['t']>=next_progress:
    print(json.dumps({'event':'progress','t':round(state['t'],2),'frames':state['frames'],'captures':len(report['samples']),'maxGapMs':round(state['maxGapMs'],2)}),flush=True);next_progress+=60
   page.wait_for_timeout(min(100,max(5,(target['target_t']-state['t'])*1000)))
  before=page.evaluate('({t:Film.time,elapsed:PB.elapsed,frames:PB.frames,scenes:[...Film.stage.querySelectorAll(".scene")].filter(e=>getComputedStyle(e).visibility==="visible").map(e=>e.dataset.scene),phases:[...Film.stage.querySelectorAll("[data-phase]")].filter(e=>e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})).map(e=>e.dataset.phase)})')
  file=f'{index+1:03d}-{target["scene"]}-{target["labels"][0]["label"].replace(".","p")}.jpg'
  page.screenshot(path=str(OUT/file),type='jpeg',quality=93)
  after=page.evaluate('({t:Film.time,elapsed:PB.elapsed,frames:PB.frames})')
  report['samples'].append({**target,'before':before,'after':after,'frame':file,'frame_sha256':sha(OUT/file)})
  (OUT/'playback.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
  if index%8==0:print(json.dumps({'event':'capture','count':index+1,'scene':target['scene'],'t':round(before['t'],3),'frame':file}),flush=True)
 while not page.evaluate('PB.done'):
  state=page.evaluate('({...PB})')
  if state['t']>=next_progress:
   print(json.dumps({'event':'progress','t':round(state['t'],2),'frames':state['frames'],'captures':len(report['samples']),'maxGapMs':round(state['maxGapMs'],2)}),flush=True);next_progress+=60
  page.wait_for_timeout(100)
 report['clock_result']=page.evaluate('({...PB})')
 report['wall_elapsed_seconds']=time.monotonic()-wall_start
 report['finished_utc']=datetime.now(timezone.utc).isoformat()
 report['input_sha256_after']=stamps()
 report['inputs_unchanged']=report['input_sha256']==report['input_sha256_after']
 report['capture_scene_mismatches']=[s['frame'] for s in report['samples'] if s['before']['scenes']!=[s['scene']]]
 browser.close()
report['continuous_clock_completed']=report['clock_result']['done'] and report['clock_result']['t']==END and report['wall_elapsed_seconds']>=END
(OUT/'playback.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'event':'complete','wall_elapsed_seconds':report['wall_elapsed_seconds'],'clock':report['clock_result'],'samples':len(report['samples']),'page_errors':report['page_errors'],'inputs_unchanged':report['inputs_unchanged']}),flush=True)
