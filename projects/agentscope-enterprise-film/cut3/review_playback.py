"""Continuous wall-clock 1x proof timeline, with explicitly sampled native frames."""
import time,json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parent;P=R/'proof';D=R/'evidence/playback';D.mkdir(exist_ok=True);(D/'README.md').write_text('# 一倍速样段运行\n\n三组核心样段与Java恢复，共662秒；按阶段取帧。运行不等于人类持续感知，实际查看名单在review.md。\n')
specs=json.loads((P/'out/scene-manifest.json').read_text());points=[]
for s in specs:
 for p in s['phases']:
  for offset in [1,5]:
   if p['at']+offset<s['duration']:points.append((s['start']+p['at']+offset,s['id'],p['name']))
points.sort();rows=[];origin=time.time();i=0
with sync_playwright() as pw:
 b=pw.chromium.launch();page=b.new_page(viewport={'width':1920,'height':1080});page.goto((P/'film/index.html').as_uri()+'?render=1');page.wait_for_function('Film.ready');page.evaluate('()=>{window.review={epoch:performance.now(),ticks:0,done:false};function tick(){let t=Math.min(Film.duration,(performance.now()-review.epoch)/1000);Film.seek(t);review.t=t;review.ticks++;review.done=t>=Film.duration;if(!review.done)requestAnimationFrame(tick);}tick();}')
 while not page.evaluate('review.done'):
  t=page.evaluate('review.t')
  if i<len(points) and t>=points[i][0]:
   target,sid,phase=points[i];f=f'{i:03d}-{sid}.png';page.screenshot(path=str(D/f));rows.append({'target':target,'actual':page.evaluate('review.t'),'file':f,'scene':sid,'phase':phase});print(f'{i+1}/{len(points)} {t:.1f}s {sid}',flush=True);i+=1
  page.wait_for_timeout(100)
 timing=page.evaluate('({time:review.t,ticks:review.ticks,wall_seconds:(performance.now()-review.epoch)/1000})');b.close()
(D/'run.json').write_text(json.dumps({'scope':'Continuous 1x stage timeline and sampled native frames; no claim of continuous human perception','real_wall_seconds':time.time()-origin,'timing':timing,'captures':rows},ensure_ascii=False,indent=2)+'\n');print(timing)
