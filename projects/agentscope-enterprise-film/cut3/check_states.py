"""Actual native SVG states: text size/bounds, collisions, reverse seek and frame records."""
import os,sys,json,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parent;os.environ['PRAXIS_FILM_ROOT']=str(R);sys.path.insert(0,str(R.parent/'build'))
from screen_text import JS
P=R/'evidence/final';P.mkdir(exist_ok=True)
(P/'README.md').write_text('# 第三版当前状态帧\n\n来自最终集成舞台的原生帧；check.json逐项记录字号、边界、实际文字与正逆seek。\n')
def main():
 tl=json.loads((R/'out/timeline.json').read_text());manifest=json.loads((R/'out/scene-manifest.json').read_text());points=[]
 for s in manifest:
  phases=s['phases']
  for i,q in enumerate(phases):
   nxt=phases[i+1]['at'] if i+1<len(phases) else s['duration'];local=min(nxt-.3,q['at']+5);points.append({'id':s['id'],'phase':q['name'],'t':s['start']+local})
 failures=[];records=[];signatures={};errors=[]
 with sync_playwright() as pw:
  b=pw.chromium.launch();page=b.new_page(viewport={'width':1920,'height':1080});page.on('pageerror',lambda e:errors.append(str(e)));page.goto((R/'film/index.html').as_uri()+'?render=1');page.wait_for_function('Film.ready')
  for i,pt in enumerate(points):
   page.evaluate('t=>Film.seek(t)',pt['t']);rows=page.evaluate(JS);dom=page.evaluate('()=>document.querySelector(".scene[style*=visible] svg").outerHTML+document.getElementById("heading").textContent+document.getElementById("note").textContent');signatures[i]=hashlib.sha256(dom.encode()).hexdigest();bad=[r for r in rows if r['overflow'] or r['px']<(24 if r['role']!='content' else 30)]
   if bad:failures.append({'point':pt,'kind':'font_or_stage_bounds','rows':bad})
   f=P/f'{i:03d}-{pt["id"]}.png';page.screenshot(path=str(f));records.append({**pt,'file':f.name,'text':[r['text'] for r in rows],'signature':signatures[i]})
  for i in range(len(points)-1,-1,-1):
   page.evaluate('t=>Film.seek(t)',points[i]['t']);dom=page.evaluate('()=>document.querySelector(".scene[style*=visible] svg").outerHTML+document.getElementById("heading").textContent+document.getElementById("note").textContent')
   if hashlib.sha256(dom.encode()).hexdigest()!=signatures[i]:failures.append({'point':points[i],'kind':'reverse_seek'})
  b.close()
 report={'pass':not failures and not errors,'states':len(points),'scenes':len(tl['segments']),'page_errors':errors,'failures':failures,'records':records};(P/'check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'pass':report['pass'],'states':len(points),'failures':failures,'page_errors':errors},ensure_ascii=False));raise SystemExit(0 if report['pass'] else 1)
if __name__=='__main__':main()
