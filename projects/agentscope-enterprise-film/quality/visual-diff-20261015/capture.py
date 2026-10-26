import json,shutil,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[4];D=R/'projects/agentscope-enterprise-film/quality/visual-diff-20261015';rows=[]
def record(dst,source,method,t=None):
 rows.append({'file':dst.name,'source':str(source.relative_to(R)),'method':method,'t':t,'sha256':hashlib.sha256(dst.read_bytes()).hexdigest()})
for src,name in [('projects/agentscope-enterprise-film/quality/cut2-state-frames/024-permission-ask_parked.jpg','scope-permission.jpg'),('projects/agentscope-enterprise-film/cut2/evidence/tools.png','scope-tools.png'),('projects/agentscope-enterprise-film/cut2/evidence/java-09-recovery-capabilities.png','scope-recovery.png'),('projects/visual-grammar/schema-gate/renders/keyframes/t063.10.png','claude-schema-gate.png'),('projects/motion-ceiling-lab/mc01-request/renders/keyframes/t054.00.png','claude-mc01.png')]:
 source=R/src;dst=D/name;shutil.copy2(source,dst);record(dst,source,'existing native frame; copied without edits')
with sync_playwright() as pw:
 b=pw.chromium.launch();page=b.new_page(viewport={'width':1920,'height':1080},device_scale_factor=1)
 src=R/'projects/knowledge-film-001-pyramid-cut5/film/index.html';page.goto(src.as_uri()+'?render=1');page.wait_for_function('Film.ready')
 for seg,offset,name in [('c2.9',1.5,'pyramid-scattered.png'),('c2.11',2.5,'pyramid-topic-groups.png')]:
  t=page.evaluate('([id,dt])=>Film.T(id)+dt',[seg,offset]);page.evaluate('t=>Film.seek(t)',t);dst=D/name;page.screenshot(path=str(dst));record(dst,src,'fresh Film.seek; native viewport',t)
 page.set_viewport_size({'width':1280,'height':1000})
 for name,title,pagepath in [('saas-crash-boundaries.png','f09-crash-t','fdn-09-from-ui-to-recovery.html'),('saas-match-identity.png','f12-match-t','fdn-12-transfer-workbook.html')]:
  src=R/'projects/saas-engineering-textbook/site'/pagepath;page.goto(src.as_uri());loc=page.locator('svg[aria-labelledby~="'+title+'"]').locator('..');loc.scroll_into_view_if_needed();dst=D/name;loc.screenshot(path=str(dst));record(dst,src,'fresh rendered drawing parent; 1280 viewport')
 b.close()
(D/'captures.json').write_text(json.dumps({'base_commit':'b9b87ef','purpose':'Compare visual mechanisms and specifications, not subject matter correctness or full-film preference','captures':rows},ensure_ascii=False,indent=2)+'\n');print(json.dumps(rows,ensure_ascii=False))
