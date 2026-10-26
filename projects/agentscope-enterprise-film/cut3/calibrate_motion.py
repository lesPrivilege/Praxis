"""Extend declared capture windows from actual visible SVG changes; never drop declared windows."""
import argparse,json,hashlib,os
from pathlib import Path
from playwright.sync_api import sync_playwright
AP=argparse.ArgumentParser();AP.add_argument('--root',type=Path,default=Path(__file__).resolve().parent);ARGS=AP.parse_args();R=ARGS.root.resolve()
JS=r'''()=>{const active=document.querySelector('.scene[style*="visible"] svg');if(!active)return '';const rows=[];for(const e of active.querySelectorAll('text,rect,path,line,circle,ellipse,polygon,polyline')){if(e.closest('defs'))continue;let a=1;for(let n=e;n&&n!==active;n=n.parentElement){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden'){a=0;break;}a*=Number(s.opacity);}if(a<.001)continue;const m=e.getCTM();rows.push([e.tagName,e.textContent,Math.round(a*10000)/10000,m?[m.a,m.b,m.c,m.d,m.e,m.f]:[],...['x','y','cx','cy','r','rx','ry','width','height','d','fill','stroke','stroke-width','stroke-dasharray','stroke-dashoffset'].map(k=>e.getAttribute(k))]);}return JSON.stringify([rows,document.getElementById('heading').textContent,document.getElementById('note').textContent]);}'''
def main():
 tl=json.loads((R/'out/timeline.json').read_text());report=[]
 with sync_playwright() as pw:
  b=pw.chromium.launch();p=b.new_page(viewport={'width':1920,'height':1080});p.goto((R/'film/index.html').as_uri()+'?render=1');p.wait_for_function('Film.ready');order=p.evaluate('CUT3_ORDER')
  for s in tl['segments']:
   prev=None;last=0;changes=[];t=0.;dur=s['end']-s['start']
   while t<dur:
    p.evaluate('t=>Film.seek(t)',s['start']+t);fingerprint=p.evaluate(JS)
    if prev is not None and fingerprint!=prev:changes.append([max(0,last-.1),min(dur,t+.6)])
    prev=fingerprint;last=t;t=round(t+.5,6)
   windows=[[e['at'],min(dur,e['at']+e['duration'])] for e in s['events']]+changes;merged=[]
   for a,z in sorted(windows):
    if merged and a<=merged[-1][1]+.01:merged[-1][1]=max(z,merged[-1][1])
    else:merged.append([a,z])
   s['events']=[{'at':round(a,3),'duration':round(z-a,3)} for a,z in merged];report.append({'scene':s['id'],'sampled_visible_change_intervals':len(changes),'capture_seconds':round(sum(z-a for a,z in merged),2),'duration':dur})
  b.close()
 (R/'out/timeline.json').write_text(json.dumps(tl,ensure_ascii=False,indent=2)+'\n');(R/'film/timeline.js').write_text('window.TIMELINE='+json.dumps(tl,ensure_ascii=False)+';window.CUT3_ORDER='+json.dumps(order,ensure_ascii=False)+';\n');(R/'out/motion-contract.json').write_text(json.dumps({'sample_step':.5,'method':'Visible SVG leaf transforms, geometry, opacity and text; conservative padding, union with all declared windows','scenes':report},ensure_ascii=False,indent=2)+'\n');print('capture windows calibrated',sum(x['capture_seconds'] for x in report),'seconds',flush=True)
if __name__=='__main__':main()
