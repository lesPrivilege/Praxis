import json,time,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[2];P=R/'cut2';D=R/'quality/playback-part4';D.mkdir(exist_ok=True)
(D/'README.md').write_text('# 第四段一倍速播放采样\n\n由主代理观察 2426–3121 秒，原生 1080p，时间轴实际以一倍速度前进；PNG 按场景、展项阶段及动效窗口采样，非人类连续感知记录。详见 [记录](../playback-part4.md)。\n')
a,b=2426,3121
tl=json.loads((P/'out/timeline.json').read_text());manifest=json.loads((P/'out/exhibit-manifest.json').read_text());points={}
for s in tl['segments']:
 if s['start']<a or s['end']>b:continue
 for event in s['events']:
  t=s['start']+event['at']+event['duration']+.2
  if t<s['end']-.2:points[round(t,3)]=(s['id'],'settled')
 points[s['end']-1]=(s['id'],'final')
for m in manifest:
 if m['start']<a or m['end']>b:continue
 for phase,at in m['cues'].items():
  for offset in [.15,.45,.9]:points[round(m['start']+at+offset,3)]=(m['id'],phase+'-'+str(offset))
points=sorted(points.items());rows=[];started=time.time()
with sync_playwright() as pw:
 browser=pw.chromium.launch();p=browser.new_page(viewport={'width':1920,'height':1080});p.goto((P/'film/index.html').as_uri()+'?render=1');p.wait_for_function('Film.ready')
 p.evaluate('([a,b])=>{window.playbackAudit={origin:performance.now(),start:a,end:b,samples:[],done:false};function tick(){const r=playbackAudit;const t=Math.min(b,a+(performance.now()-r.origin)/1000);Film.seek(t);r.time=t;r.samples.push({t,wall:performance.now()});if(t<b)requestAnimationFrame(tick);else r.done=true;}tick();}',[a,b])
 tick=0;lastreport=time.monotonic()
 while not p.evaluate('playbackAudit.done'):
  current=p.evaluate('playbackAudit.time')
  while tick<len(points) and points[tick][0]<=current:
   target,(sid,phase)=points[tick];file=f'{target:08.3f}-{sid}-{phase}.png';p.screenshot(path=str(D/file));actual=p.evaluate('playbackAudit.time');rows.append({'target':target,'actual':actual,'file':file,'scene':sid,'phase':phase,'unix_time':time.time()});tick+=1
   print(json.dumps({'file':str(D/file),'film_time':round(actual,3)}),flush=True)
  if time.monotonic()-lastreport>30:print(json.dumps({'progress':round(current,2),'captured':len(rows)}),flush=True);lastreport=time.monotonic()
  p.wait_for_timeout(100)
 timing=p.evaluate('({start:playbackAudit.start,end:playbackAudit.time,frames:playbackAudit.samples.length,wall_seconds:(performance.now()-playbackAudit.origin)/1000})');browser.close()
report={'part':[a,b],'sampling':'scene event settled + each custom phase .15/.45/.9 + final state','continuous_time_driver':'requestAnimationFrame; Film.seek(start + elapsed performance time), capped at end','timing':timing,'captures':rows,'real_start':started,'real_end':time.time(),'timeline_sha256':hashlib.sha256((P/'out/timeline.json').read_bytes()).hexdigest()}
(D/'capture-log.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'done':timing,'captures':len(rows)}),flush=True)
