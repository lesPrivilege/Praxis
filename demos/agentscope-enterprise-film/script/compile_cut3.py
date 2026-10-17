"""Compile registered SVG scenes, preserving all 53 original topics and sources."""
import argparse,json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];P=R/'cut3';ap=argparse.ArgumentParser();ap.add_argument('--pilot',action='store_true');ap.add_argument('--proof',action='store_true');args=ap.parse_args()
S=json.loads((R/'cut2/script/beats.json').read_text())['scenes'];original=json.loads((R/'script/beats.json').read_text())['scenes'];byid={s['id']:s for s in S}
(P/'film/story.js').write_text('window.V3_STORY='+json.dumps(S,ensure_ascii=False)+';\n')
base='''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AgentScope · 企业 Agent 的运行机制</title><link rel="stylesheet" href="film.css"><body><div id="viewport"><div id="stage"></div></div><div id="chapter" hidden></div><div id="mobile-note"><a href="../../reading-v2.html">打开逐章阅读稿</a></div><div id="hud"><button id="play">播放</button><button id="prev">上一场</button><button id="next">下一场</button><select id="chapters" aria-label="章节"></select><input id="progress" type="range" min="0" step="0.0416667" aria-label="播放位置"><output id="clock"></output><a href="../../reading-v2.html">阅读稿</a></div><script src="../../film/gsap.min.js"></script><script src="core.js"></script><script src="story.js"></script>SCENE_SCRIPTS<script src="timeline.js"></script><script src="engine.js"></script></body></html>'''
modules=[f for f in ['journey','permission','workspace','systems','specials','overrides','editorial'] if (P/'film'/f'{f}.js').exists()]
if args.proof:modules=[f for f in modules if f in ['journey','permission','workspace']]
# Meta is read before boot; geometry stays in the producer-owned modules.
boot="""<script>for(const [id,kind] of [['chapter','navigation'],['heading','content'],['note','content'],['version','source'],['scene-count','navigation']]){let old=document.getElementById(id);if(old)old.remove();let e=document.createElement(id==='heading'?'h1':'div');e.id=id;e.dataset.reading=kind;e.dataset.readingKey='chrome:'+id;document.getElementById('stage').appendChild(e);}</script>"""
base=base.replace('SCENE_SCRIPTS',''.join('<script src="'+f+'.js"></script>' for f in modules)+boot)
# A registry-inspection load does not boot an engine or run a video.
inspect=base[:base.index('<script src="timeline.js">')]+'</body></html>';temp=P/'film/inspect.html';temp.write_text(inspect)
with sync_playwright() as pw:
 b=pw.chromium.launch();p=b.new_page();p.goto(temp.as_uri());specs=p.evaluate('Array.from(V3.registry.values()).map(({id,title,duration,covers,phases,motion})=>({id,title,duration,covers,phases,motion}))');b.close()
temp.unlink();specmap={s['id']:s for s in specs};holdfile=P/'design/reading-holds.json'
if holdfile.exists():
 for sid,extra in json.loads(holdfile.read_text())['additional_seconds'].items():
  if sid in specmap:specmap[sid]['duration']+=extra
order=[];seen=set();cover={}
for baseScene in S:
 sid=baseScene['id'];mapped='message-journey' if sid in ['message','events','react'] else 'workspace' if sid=='sandbox' else 'java-recovery' if sid=='java-09-recovery-capabilities' else sid
 if args.proof and mapped not in ['message-journey','permission','workspace','java-recovery']:continue
 if mapped in seen:continue
 if mapped not in specmap:
  if args.pilot:continue
  raise RuntimeError('Missing '+mapped)
 if args.proof and mapped not in ['message-journey','permission','workspace','java-recovery']:continue
 seen.add(mapped);x=specmap[mapped];covers=x.get('covers') or [sid]
 meta={'id':mapped,'index':len(order),'chapter':baseScene['chapter'],'sourceLine':baseScene['sourceLine'],'covered_topics':covers};order.append(meta)
 for topic in covers:
  if topic in cover:raise RuntimeError('Duplicate topic '+topic)
  cover[topic]=mapped
if not args.pilot and not args.proof:assert set(cover)=={s['id'] for s in original},set(s['id'] for s in original)-set(cover)
t=0;segments=[];chapters=[];manifest=[]
for meta in order:
 s=specmap[meta['id']];title=' '.join(meta['chapter'])
 if not chapters or chapters[-1]['title']!=title:chapters.append({'id':s['id'],'t':t,'title':title})
 duration=s['duration'];events=[{'at':0,'duration':4}]+[{'at':p['at'],'duration':4} for p in s['phases']]+[{'at':e['at'],'duration':e['duration']} for e in s['motion']]
 segments.append({'id':s['id'],'start':t,'end':t+duration,'events':events});manifest.append({**s,'start':t,'end':t+duration,'chapter':meta['chapter']});t+=duration
if args.proof:
 P=P/'proof';(P/'film').mkdir(parents=True,exist_ok=True);(P/'out').mkdir(exist_ok=True)
 for f in modules:base=base.replace('src="'+f+'.js"','src="../../film/'+f+'.js"')
 base=base.replace('href="film.css"','href="../../film/film.css"').replace('src="core.js"','src="../../film/core.js"').replace('src="story.js"','src="../../film/story.js"').replace('src="engine.js"','src="../../film/engine.js"').replace('src="../../film/gsap.min.js"','src="../../../film/gsap.min.js"').replace('href="../../reading-v2.html"','href="../../../reading-v2.html"')
TL={'duration':t,'fps':24,'chapters':chapters,'segments':segments};(P/'film/timeline.js').write_text('window.TIMELINE='+json.dumps(TL,ensure_ascii=False)+';window.CUT3_ORDER='+json.dumps(order,ensure_ascii=False)+';\n');(P/'film/index.html').write_text(base)
for name,value in [('timeline',TL),('scene-manifest',manifest),('coverage',cover)]: (P/'out'/f'{name}.json').write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
print(len(order),'scenes',len(cover),'topics',t,'seconds; modules',modules)
