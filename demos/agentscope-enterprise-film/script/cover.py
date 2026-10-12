"""Native layouts; editable SVG → browser PNG. No remote assets."""
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]

def txt(x,y,text,size=32,fill='#dce6df',weight=400,family='PingFang SC,Helvetica Neue,sans-serif'):
 return f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" fill="{fill}">{text}</text>'

def layout(w,h,portrait):
 p=['<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">'%(w,h,w,h),'<rect width="100%" height="100%" fill="#10333b"/>']
 # Quiet registration marks; typography and architecture carry the image.
 p += [f'<path d="M64 104 H{w-64}" stroke="#46656b" stroke-width="1.5"/>',txt(64,76,'OPEN SOURCE  /  ENTERPRISE AGENTS',22,'#8eadae',500)]
 p += [txt(64,230 if portrait else 254,'AgentScope',112 if portrait else 148,'#f5f1e7',600,'Avenir Next,Helvetica Neue,sans-serif')]
 p += [txt(68,324 if portrait else 351,'企业 Agent 的运行全景',48 if portrait else 58,'#f5f1e7',600)]
 p += [txt(68,385 if portrait else 418,'从局部实现，到上线边界',31 if portrait else 35,'#a7c7c5')]
 if portrait:
  # Vertical native composition: three floors, matching vertical reading.
  xs,ys,ww,hh=90,525,1008,214
  labels=[('01','Agent','推理循环 · 工具 · 上下文'),('02','Service','会话 · 请求 · 事件'),('03','Workspace','文件 · 终端 · 沙箱')]
  for i,(no,name,sub) in enumerate(labels):
   y=ys+i*274
   p += [f'<rect x="{xs}" y="{y}" width="{ww}" height="{hh}" rx="4" fill="#173e46" stroke="#668b8b" stroke-width="2"/>',f'<rect x="{xs}" y="{y}" width="7" height="{hh}" fill="#75c9bf"/>',txt(xs+37,y+65,no,26,'#7bbcb7',500,'Menlo,monospace'),txt(xs+37,y+125,name,51,'#f5f1e7',600,'Avenir Next,Helvetica Neue,sans-serif'),txt(xs+37,y+177,sub,30,'#a7c7c5')]
   if i<2:
    p += [f'<path d="M{xs+50} {y+hh} V{y+hh+60}" stroke="#75c9bf" stroke-width="3"/>',f'<circle cx="{xs+50}" cy="{y+hh+30}" r="7" fill="#75c9bf"/>']

 else:
  # Landscape native composition: visible layered system, distinct from portrait.
  labels=[('Agent','推理循环 / 工具 / 上下文'),('Service','会话 / 请求 / 事件'),('Workspace','文件 / 终端 / 沙箱')]
  for i,(name,sub) in enumerate(labels):
   x=68+i*494; y=590+i*45
   p += [f'<rect x="{x}" y="{y}" width="452" height="275" rx="4" fill="#173e46" stroke="#668b8b" stroke-width="2"/>',f'<path d="M{x+28} {y+32} H{x+116}" stroke="#75c9bf" stroke-width="5"/>',txt(x+28,y+105,'0'+str(i+1),29,'#7bbcb7',500,'Menlo,monospace'),txt(x+28,y+169,name,50,'#f5f1e7',600,'Avenir Next,Helvetica Neue,sans-serif'),txt(x+28,y+229,sub,27,'#a7c7c5')]
  p += ['<path d="M294 865 V980 H1282 V955 M788 910 V980" fill="none" stroke="#75c9bf" stroke-width="2.5"/>','<circle cx="788" cy="980" r="8" fill="#75c9bf"/>',txt(68,1045,'开源组成示意 · 非能力完备性承诺',24,'#8eadae')]
 p += ['</svg>']
 return '\n'.join(p)

if __name__=='__main__':
 with sync_playwright() as pw:
  browser=pw.chromium.launch()
  for w,h,label in [(1600,1200,'4x3'),(1200,1600,'3x4')]:
   f=R/'covers'/f'agentscope-{label}.svg';f.write_text(layout(w,h,label=='3x4'))
   page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
   page.goto(f.as_uri());page.evaluate('document.fonts.ready')
   page.screenshot(path=str(f.with_suffix('.png')));page.close()
  browser.close()
 print('native covers: 1600x1200, 1200x1600')
