"""Two native editable cover layouts. SVG → PNG with existing Chromium."""
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
def text(x,y,t,size=32,color='#dce6df',weight=400,family='PingFang SC,Helvetica Neue,sans-serif'):
 return f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" fill="{color}">{t}</text>'
def draw(w,h,portrait):
 a=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">','<rect width="100%" height="100%" fill="#10333b"/>',f'<path d="M64 104 H{w-64}" stroke="#46656b" stroke-width="1.5"/>',text(64,76,'OPEN SOURCE / ENTERPRISE AGENTS',22,'#8eadae',500),text(64,230 if portrait else 254,'AgentScope',112 if portrait else 148,'#f5f1e7',600,'Avenir Next,Helvetica Neue,sans-serif'),text(68,324 if portrait else 351,'企业 Agent 的运行全景',48 if portrait else 58,'#f5f1e7',600),text(68,385 if portrait else 418,'从局部实现，到上线边界',31 if portrait else 35,'#a7c7c5')]
 labels=[('Agent','推理循环 · 工具 · 上下文'),('Service','会话 · 请求 · 事件'),('Workspace','文件 · 终端 · 沙箱')]
 for i,(name,sub) in enumerate(labels):
  x=90 if portrait else 68+i*494;y=525+i*274 if portrait else 590+i*45;ww=1008 if portrait else 452;hh=214 if portrait else 275
  a += [f'<rect x="{x}" y="{y}" width="{ww}" height="{hh}" rx="4" fill="#173e46" stroke="#668b8b" stroke-width="2"/>']
  if portrait:a += [f'<rect x="{x}" y="{y}" width="7" height="{hh}" fill="#75c9bf"/>',text(x+37,y+65,'0'+str(i+1),26,'#7bbcb7',500,'Menlo,monospace'),text(x+37,y+125,name,51,'#f5f1e7',600,'Avenir Next,Helvetica Neue,sans-serif'),text(x+37,y+177,sub,30,'#a7c7c5')]
  else:a += [f'<path d="M{x+28} {y+32} H{x+116}" stroke="#75c9bf" stroke-width="5"/>',text(x+28,y+105,'0'+str(i+1),29,'#7bbcb7',500,'Menlo,monospace'),text(x+28,y+169,name,50,'#f5f1e7',600,'Avenir Next,Helvetica Neue,sans-serif'),text(x+28,y+229,sub.replace(' · ',' / '),27,'#a7c7c5')]
  if portrait and i<2:a += [f'<path d="M{x+50} {y+hh} V{y+hh+60}" stroke="#75c9bf" stroke-width="3"/>',f'<circle cx="{x+50}" cy="{y+hh+30}" r="7" fill="#75c9bf"/>']
 if not portrait:a += ['<path d="M294 865 V980 H1282 V955 M788 910 V980" fill="none" stroke="#75c9bf" stroke-width="2.5"/>','<circle cx="788" cy="980" r="8" fill="#75c9bf"/>']
 a.append('</svg>');return '\n'.join(a)
if __name__=='__main__':
 with sync_playwright() as pw:
  browser=pw.chromium.launch()
  for w,h,name in [(1600,1200,'4x3'),(1200,1600,'3x4')]:
   f=R/'covers'/f'agentscope-{name}.svg';f.write_text(draw(w,h,name=='3x4'));page=browser.new_page(viewport={'width':w,'height':h});page.goto(f.as_uri());page.evaluate('document.fonts.ready');page.screenshot(path=str(f.with_suffix('.png')));page.close()
  browser.close()
 print('4:3 and 3:4 native covers generated')
