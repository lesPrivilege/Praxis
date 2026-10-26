#!/usr/bin/env python3
"""Narrow synthetic summary target/keyboard check after minimum-size repair."""
import argparse,hashlib,json,sys,tempfile,threading,time
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
parser=argparse.ArgumentParser();parser.add_argument('--drift-dir',type=Path,required=True);parser.add_argument('--layout-report',type=Path,required=True);parser.add_argument('--output',type=Path);args=parser.parse_args()
sys.path.insert(0,str(args.drift_dir.resolve()));import backend,verify
output=args.output or Path(tempfile.mkdtemp(prefix='drift-summary-closeout-'));output.mkdir(parents=True,exist_ok=True)
tracked=['app.js','style.css','index.html','verify.py'];hashes=lambda:{name:hashlib.sha256((args.drift_dir/name).read_bytes()).hexdigest() for name in tracked}
previous=json.loads(args.layout_report.read_text());report={'sourceHashesBefore':hashes(),'layoutSnapshotHashes':previous['sourceHashesAfter'],'beforeRepair':{'widths':[1181,1440],'summaryHeightPx':22,'spacing':'line-height 1.5/letter .12em/word .16em'},'checks':[],'captures':[],'externalRequests':[],'pageErrors':[]}
with tempfile.TemporaryDirectory(prefix='drift-summary-state-') as private,sync_playwright() as pw:
 collector=backend.Collector(Path(private),runner=verify.FixtureRunner());collector.start({'timezone':'UTC','languages':['en-US'],'online':True})
 while collector.active:time.sleep(.02)
 server=backend.Server(0,collector);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start();browser=pw.chromium.launch()
 try:
  for width in [1181,1440]:
   context=browser.new_context(viewport={'width':width,'height':1000},locale='en-US',timezone_id='UTC')
   def route_request(route):
    if not route.request.url.startswith(server.origin+'/'):report['externalRequests'].append(route.request.url);route.abort()
    else:route.continue_()
   context.route('**/*',route_request);page=context.new_page();page.on('pageerror',lambda error:report['pageErrors'].append(str(error)));page.goto(server.origin,wait_until='networkidle');expect(page.locator('#collector-state')).to_have_text('本机服务端已连接')
   page.evaluate('''() => {for(const el of document.querySelectorAll('*')){el.style.setProperty('line-height','1.5','important');el.style.setProperty('letter-spacing','.12em','important');el.style.setProperty('word-spacing','.16em','important');}}''')
   targets=[]
   for selector in ['#collection-disclosure summary','.provider-comparison summary','#inspector .technical-details summary']:
    item=page.locator(selector);item.focus();page.keyboard.press('Enter');assert item.evaluate('(el)=>el.parentElement.open');page.keyboard.press('Enter');assert not item.evaluate('(el)=>el.parentElement.open');bounds=item.bounding_box();assert bounds and bounds['height']>=24 and bounds['width']>=24;targets.append({'text':item.text_content().strip(),'width':bounds['width'],'height':bounds['height'],'keyboard':'open/close passed'})
   assert page.evaluate('document.documentElement.scrollWidth <= innerWidth');verify.settle_finite_motion(page);page.evaluate('window.scrollTo(0,0)');filename=f'{width}-summary-spacing-steady.png';page.screenshot(path=str(output/filename),full_page=True);report['captures'].append(filename);report['checks'].append({'viewport':width,'targets':targets,'overflow':0});context.close()
 finally:browser.close();server.shutdown();server.server_close();thread.join()
report['sourceHashesAfter']=hashes();report['sourceHashesUnchanged']=report['sourceHashesBefore']==report['sourceHashesAfter'];assert report['sourceHashesUnchanged'];assert not report['externalRequests'] and not report['pageErrors'];report['result']='passed';(output/'summary-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps({'result':report['result'],'checks':report['checks'],'sourceHashesUnchanged':report['sourceHashesUnchanged'],'output':str(output)},ensure_ascii=False))
