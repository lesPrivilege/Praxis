from pathlib import Path
from playwright.sync_api import sync_playwright
import json, time, hashlib

out=Path(__file__).resolve().parent
base=out.parents[2]
plan=json.loads((out/'capture-plan.json').read_text())
START,END=1014,1059
errors=[];captures=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(args=['--use-angle=metal','--font-render-hinting=none','--disable-lcd-text','--disable-background-timer-throttling','--disable-renderer-backgrounding'])
    page=browser.new_page(viewport={'width':1920,'height':1080},device_scale_factor=1)
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto((base/'cut2/film/index.html').as_uri()+'?render=1')
    page.wait_for_function('Film.ready')
    fingerprint={str(p.relative_to(base)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [base/'cut2/film/scenes.js',base/'cut2/film/timeline.js',base/'film/runtime-lab.js',base/'film/runtime-lab.css']}
    page.evaluate('''([a,b])=>{
      window.PlaybackProof={start:a,end:b,epoch:performance.now(),frames:0,maxFrameGap:0,last:0,samples:[],done:false};
      const p=PlaybackProof;
      function step(now){
        if(p.last)p.maxFrameGap=Math.max(p.maxFrameGap,now-p.last);
        p.last=now;p.frames++;Film.seek(Math.min(b,a+(now-p.epoch)/1000));
        if(!p.samples.length||now-p.samples.at(-1).now>=1000)p.samples.push({now,film_time:Film.time,frames:p.frames});
        if(Film.time>=b){p.done=true;p.finished=now;}else requestAnimationFrame(step);
      }
      Film.seek(a);requestAnimationFrame(step);
    }''',[START,END])
    wall=time.monotonic();last_status=-1
    for sample in plan:
        page.wait_for_function('t=>Film.time>=t',arg=sample['target'],timeout=60000,polling=16)
        actual=page.evaluate('({film_time:Film.time,performance_now:performance.now(),frames:PlaybackProof.frames})')
        name=f"{sample['scene']}-{sample['target']:08.3f}.png"
        png=page.screenshot(path=str(out/name))
        item={**sample,**actual,'png':name,'sha256':hashlib.sha256(png).hexdigest()}
        captures.append(item)
        if int(time.monotonic()-wall)//60>last_status:
            last_status=int(time.monotonic()-wall)//60
            print(json.dumps({'elapsed_wall':round(time.monotonic()-wall,2),'film_time':actual['film_time'],'captures':len(captures)},ensure_ascii=False),flush=True)
        (out/'capture-manifest.json').write_text(json.dumps(captures,ensure_ascii=False,indent=2))
    page.wait_for_function('PlaybackProof.done',timeout=60000)
    proof=page.evaluate('PlaybackProof')
    proof.update({'elapsed_wall':time.monotonic()-wall,'page_errors':errors,'viewport':[1920,1080],'device_scale_factor':1,'capture_count':len(captures),'source_sha256':fingerprint})
    (out/'playback-log.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2))
    print(json.dumps({k:v for k,v in proof.items() if k!='samples'},ensure_ascii=False),flush=True)
    browser.close()
