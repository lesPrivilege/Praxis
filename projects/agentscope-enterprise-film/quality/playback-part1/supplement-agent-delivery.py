"""Additional 1x window for identity_preserving_delivery omitted by the first sample filter."""
import json,time
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT=Path(__file__).resolve().parent
CUT=OUT.parents[1]/'cut2'
START,STOP=293.6,295.8
TARGETS=[293.968,294.5,295.032]
report={'range':[START,STOP],'clock':'performance.now / requestAnimationFrame','reason':'Additional motion sampling; does not replace the complete 0–767s pass','samples':[]}
with sync_playwright() as pw:
 b=pw.chromium.launch(args=['--force-device-scale-factor=1','--hide-scrollbars','--font-render-hinting=none','--disable-lcd-text']);p=b.new_page(viewport={'width':1920,'height':1080},device_scale_factor=1)
 p.goto((CUT/'film/index.html').as_uri()+'?render=1');p.wait_for_function('Film.ready');p.evaluate('document.fonts.ready');wall=time.monotonic()
 p.evaluate('''([a,z])=>{window.SUP={base:performance.now(),t:a,frames:0,done:false};function step(n){SUP.elapsed=(n-SUP.base)/1000;SUP.t=Math.min(z,a+SUP.elapsed);Film.seek(SUP.t);SUP.frames++;if(SUP.t<z)requestAnimationFrame(step);else SUP.done=true;}Film.seek(a);requestAnimationFrame(step)}''',[START,STOP])
 for i,target in enumerate(TARGETS):
  p.wait_for_function('t=>SUP.t>=t',arg=target);before=p.evaluate('({...SUP})');name=f'supplement-agent-delivery-{i+1}.jpg';p.screenshot(path=str(OUT/name),type='jpeg',quality=93);after=p.evaluate('({...SUP})');report['samples'].append({'target':target,'before':before,'after':after,'frame':name})
 p.wait_for_function('SUP.done');report['clock_result']=p.evaluate('({...SUP})');report['wall_elapsed_seconds']=time.monotonic()-wall;b.close()
(OUT/'supplement-agent-delivery.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report))
