"""Observable reader checks: complete mechanisms remain visible, navigation and details work."""
import json,re
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
S=json.loads((R/'script/beats.json').read_text())['scenes']
report={'file':'reading-v2.html','widths':[],'failures':[]}
with sync_playwright() as pw:
 b=pw.chromium.launch()
 for width,js in [(1440,True),(390,True),(390,False)]:
  p=b.new_page(viewport={'width':width,'height':900},java_script_enabled=js)
  errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.goto((R/'reading-v2.html').as_uri())
  for s in S:
   visible=p.locator('#'+s['id']+' > p').evaluate_all('(els)=>els.filter(e=>getComputedStyle(e).display!=="none"&&getComputedStyle(e).visibility!=="hidden"&&e.getBoundingClientRect().height>0).map(e=>e.textContent)')
   for paragraph in s['essay'].split('\n\n'):
    if paragraph not in visible:report['failures'].append({'width':width,'js':js,'scene':s['id'],'failure':'mechanism_or_condition_hidden'})
  links=p.locator('nav.questions a');assert links.count()==12;links.nth(4).click()
  assert p.url.endswith('#java-05-snapshot-sse-cursor')
  if js:
   p.locator('#expand-all').click();assert p.locator('details.detail[open]').count()==53
   p.locator('#collapse-all').click();assert p.locator('details.detail[open]').count()==0
  layout=p.evaluate('({innerWidth,scrollWidth:document.documentElement.scrollWidth,modules:document.querySelectorAll("article.module").length,answers:document.querySelectorAll(".chapter-head .answer").length})')
  if layout['scrollWidth']>width:report['failures'].append({'width':width,'failure':'horizontal_overflow'})
  assert layout['modules']==53 and layout['answers']==6
  report['widths'].append({'width':width,'javascript':js,'layout':layout,'page_errors':errors})
  if errors:report['failures'].append({'width':width,'failure':'page_error','errors':errors})
  if width==1440 and js:p.goto((R/'reading-v2.html').as_uri());p.screenshot(path=str(R/'quality/reader-v2-wide.png'),full_page=False)
  if width==390 and not js:p.goto((R/'reading-v2.html').as_uri());p.screenshot(path=str(R/'quality/reader-v2-narrow.png'),full_page=False)
  p.close()
 b.close()
report['pass']=not report['failures']
(R/'quality/reader-v2-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False))
raise SystemExit(0 if report['pass'] else 1)
