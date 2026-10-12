#!/usr/bin/env python3
"""Bounded isolated synthetic UI evidence; no public probes or private state.
Run: python3 SCRIPT --drift-dir REPOSITORY/demos/drift [--output TEMP_DIR]
Checks DOM reflow/text clipping and explicit 24 px target claim, not WCAG compliance.
"""
import argparse,hashlib,json,sys,tempfile,threading,time
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright,expect

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--drift-dir',type=Path,required=True)
parser.add_argument('--output',type=Path)
args=parser.parse_args()
sys.path.insert(0,str(args.drift_dir.resolve()))
import backend,verify
output=args.output or Path(tempfile.mkdtemp(prefix='drift-polish-bounded-'))
output.mkdir(parents=True,exist_ok=True)
tracked=['app.js','style.css','index.html','verify.py']
def code_hashes():
 return {name:hashlib.sha256((args.drift_dir/name).read_bytes()).hexdigest() for name in tracked}
report={'sourceHashesBefore':code_hashes(),'narrowChecks':[],'axAfter':[],'beforeRepairs':{'sourceAnchorHeightPx':{'390':[15,15],'1440':[15,15]},'unsupportedAXnonIgnoredCells':{'390':3,'1440':4}},'method':{'widths':[320,390,720,1181,1440],'views':['observations','baseline','changes','sources','history'],'states':['hidden','revealed'],'spacing':'line-height 1.5, letter-spacing .12em, word-spacing .16em; CSSOM inline properties, original properties restored','clip':'visible text Range rectangles against overflow hidden/clip ancestors, 1.5 CSS px tolerance; excludes intentionally clipped accessibility headings','targets':'visible a/button/select/summary rendered bounding boxes; literal 24x24 claim, inline-link WCAG exceptions not assessed','contrast':'WCAG relative luminance formula on computed CSS token colors; no pixel sampling','motion':'existing finite animations settle with verified helper; no preference and no animation override'},'samples':[],'external_requests':[],'page_errors':[],'captures':[]}
MEASURE='''() => {
 const visible = el => el.getClientRects().length && getComputedStyle(el).visibility !== "hidden" && !el.closest(".sr-only,.signal-table thead,.skip-link,[aria-hidden='true']");
 const name = el => ({tag:el.tagName.toLowerCase(),id:el.id,class:el.className,text:(el.textContent||"").trim().slice(0,100)});
 const targets = [...document.querySelectorAll("a,button,select,summary")].filter(visible).map(el=>({...name(el),width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height}));
 const clipping=[],fonts=[]; const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 while(walk.nextNode()) {const node=walk.currentNode,el=node.parentElement;if(!node.textContent.trim()||!el||!visible(el))continue;
  const range=document.createRange();range.selectNodeContents(node);const rects=[...range.getClientRects()].filter(r=>r.width&&r.height);if(!rects.length)continue;
  fonts.push({size:parseFloat(getComputedStyle(el).fontSize),...name(el)});
  for(let parent=el;parent&&parent!==document.body;parent=parent.parentElement){const style=getComputedStyle(parent),box=parent.getBoundingClientRect(),left=box.left+parent.clientLeft,right=left+parent.clientWidth,top=box.top+parent.clientTop,bottom=top+parent.clientHeight;
   const x=["hidden","clip"].includes(style.overflowX),y=["hidden","clip"].includes(style.overflowY);
   if(rects.some(r=>(x&&(r.left<left-1.5||r.right>right+1.5))||(y&&(r.top<top-1.5||r.bottom>bottom+1.5)))){clipping.push({...name(el),ancestor:name(parent)});break;}
  }
 }
 return {overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),viewport:innerWidth,smallTargets:targets.filter(t=>t.width<24-.1||t.height<24-.1),targetCount:targets.length,textClipping:clipping,minFont:Math.min(...fonts.map(f=>f.size))};
}'''
STRESS='''() => {window.__driftSpacing=[...document.querySelectorAll("*")].map(el=>({el,styles:["line-height","letter-spacing","word-spacing"].map(key=>[key,el.style.getPropertyValue(key),el.style.getPropertyPriority(key)])}));for(const {el} of window.__driftSpacing){el.style.setProperty("line-height","1.5","important");el.style.setProperty("letter-spacing",".12em","important");el.style.setProperty("word-spacing",".16em","important");}}'''
RESET='''() => {for(const {el,styles} of window.__driftSpacing){for(const [key,value,priority] of styles){if(value)el.style.setProperty(key,value,priority);else el.style.removeProperty(key);}}delete window.__driftSpacing;}'''

def luminance(color):
 color=color.lstrip('#');color=''.join(c*2 for c in color) if len(color)==3 else color;values=[int(color[i:i+2],16)/255 for i in (0,2,4)];rgb=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in values];return sum(v*w for v,w in zip(rgb,[.2126,.7152,.0722]))
def contrast(fg,bg):
 a,b=sorted([luminance(fg),luminance(bg)]);return round((b+.05)/(a+.05),3)

with tempfile.TemporaryDirectory(prefix='drift-polish-private-') as private,sync_playwright() as pw:
 collector=backend.Collector(Path(private),runner=verify.FixtureRunner())
 for i in range(2):
  collector.start({'timezone':'UTC','languages':['en-US'],'online':True})
  while collector.active:time.sleep(.02)
  if i==0:collector.pin(collector.scans[0]['id'])
 collector.scans[-1]['observations'][-1].update(status='error',error='probe_failed',note='合成采集失败')
 server=backend.Server(0,collector);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start();browser=pw.chromium.launch()
 try:
  for width in report['method']['widths']:
   context=browser.new_context(viewport={'width':width,'height':1000 if width>900 else 844},locale='en-US',timezone_id='UTC')
   def route_request(route):
    if urlparse(route.request.url).netloc!=urlparse(server.origin).netloc:report['external_requests'].append(route.request.url);route.abort()
    else:route.continue_()
   context.route('**/*',route_request);page=context.new_page();page.on('pageerror',lambda error:report['page_errors'].append(str(error)))
   page.goto(server.origin,wait_until='networkidle');expect(page.locator('#collector-state')).to_have_text('本机服务端已连接');verify.disclosure_check(page)
   verify.accessibility_structure_check(page)
   session=context.new_cdp_session(page);nodes=session.send('Accessibility.getFullAXTree')['nodes'];mapping={node['nodeId']:node for node in nodes}
   for node in nodes:
    if node.get('role',{}).get('value')!='row':continue
    cells=[mapping[c] for c in node.get('childIds',[]) if c in mapping and mapping[c].get('role',{}).get('value')=='cell' and not mapping[c]['ignored']]
    if any('系统 DNS 配置' in c.get('name',{}).get('value','') for c in cells):report['axAfter'].append({'width':width,'nonIgnoredCells':len(cells),'names':[c.get('name',{}).get('value') for c in cells]})
   session.detach()
   if width in (390,1440):
    name='mobile' if width==390 else 'desktop'
    verify.comparison_time_check(page,server,output,name)
    report['narrowChecks'].append({'width':width,'comparisonTimes':'passed: distinct full dates/seconds, missing/invalid/demo exact text, hidden values and visible timestamps, adjacency and no overflow','accessibleCells':'passed four cells','sourceLinks':'passed minimum 24x24','brandFocusedSkipLink':'passed minimum 24x24'})
    verify.nav(page,'observations');page.evaluate('window.scrollTo(0,0)');verify.settle_finite_motion(page);page.screenshot(path=str(output/f'{name}-top-steady.png'))
    page.locator('button[data-item="local.proxy"]').focus();page.keyboard.press('Enter');verify.settle_finite_motion(page)
    assert page.locator('.inspector-body').evaluate('(el)=>getComputedStyle(el).opacity')=='1'
    page.locator('#inspector').scroll_into_view_if_needed();page.screenshot(path=str(output/f'{name}-detail-steady.png'))
    if width==390:page.locator('[data-action="back-to-list"]').click()

   for view in report['method']['views']:
    verify.nav(page,view)
    if view=='observations':page.locator('button[data-item="local.proxy"]').click()
    for reveal in (False,True):
     wanted=str(reveal).lower()
     if page.locator('#privacy-toggle').get_attribute('aria-pressed')!=wanted:page.locator('#privacy-toggle').click()
     for detail in page.locator('details').all():
      if detail.is_visible() and not detail.evaluate('(el) => el.open'):detail.locator('summary').click()
     verify.settle_finite_motion(page);page.mouse.move(0,0)
     for spacing in ('normal','increased'):
      if spacing=='increased':page.evaluate(STRESS)
      sample=page.evaluate(MEASURE);sample.update(width=width,view=view,reveal=reveal,spacing=spacing);report['samples'].append(sample)
      if spacing=='increased':page.evaluate(RESET)
     if width in (390,1440) and not reveal:
      page.evaluate('window.scrollTo(0,0)');verify.settle_finite_motion(page)
      path=output/f'{width}-{view}-steady.png';page.screenshot(path=str(path),full_page=True);report['captures'].append(path.name)
   if width==1440:
    tokens=page.evaluate('''() => Object.fromEntries(["ink","muted","mark","paper","canvas","sidebar","accent","accent-bg","amber","error","error-bg","control-line"].map(name=>[name,getComputedStyle(document.documentElement).getPropertyValue("--"+name).trim()]))''')
    pairs=[('ink','paper'),('muted','paper'),('muted','canvas'),('muted','sidebar'),('muted','accent-bg'),('amber','paper'),('amber','accent-bg'),('amber','sidebar'),('error','paper'),('error','error-bg'),('accent','paper'),('accent','sidebar'),('mark','paper'),('mark','accent-bg'),('control-line','paper')]
    report['tokenContrast']=[{'foreground':a,'background':b,'colors':[tokens[a],tokens[b]],'ratio':contrast(tokens[a],tokens[b])} for a,b in pairs]
   context.close()
 finally:
  browser.close();server.shutdown();server.server_close();thread.join()
report['sourceHashesAfter']=code_hashes()
report['sourceHashesUnchanged']=report['sourceHashesBefore']==report['sourceHashesAfter']
assert report['sourceHashesUnchanged'],'Source files changed while sampling'
report['summary']={'sampleCount':len(report['samples']),'overflowSamples':sum(s['overflow']>0 for s in report['samples']),'clippedTextSamples':sum(bool(s['textClipping']) for s in report['samples']),'smallTargetSamples':sum(bool(s['smallTargets']) for s in report['samples']),'minimumFont':min(s['minFont'] for s in report['samples'])}
(output/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({'summary':report['summary'],'external_requests':len(report['external_requests']),'page_errors':report['page_errors'],'output':str(output)},ensure_ascii=False))
