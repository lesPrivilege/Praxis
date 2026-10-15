"""Draw each native cover, then render with the installed Chromium. No raster assets."""
from pathlib import Path
from html import escape
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent
C={'paper':'#f6f8fb','ink':'#182630','muted':'#617284','blue':'#255bec','line':'#bdc9d5','pale':'#e7eef8'}
def text(x,y,t,size=32,weight=450,color='ink',anchor='start'):
 return f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{weight}" fill="{C[color]}" text-anchor="{anchor}">{escape(t)}</text>'
def path(d,color='ink',w=2,fill='none'):
 return f'<path d="{d}" stroke="{C[color]}" stroke-width="{w}" fill="{C.get(fill,fill)}"/>'
def paper(x,y,w,h):
 s=path(f'M{x} {y}H{x+w-42}L{x+w} {y+42}V{y+h}H{x}Z',fill='paper')
 s+=path(f'M{x+w-42} {y}V{y+42}H{x+w}')
 s+=text(x+38,y+65,'消息',36,600)
 for yy,ww in [(111,w-88),(136,w-128),(196,w-88),(221,w-159)]:
  s+=path(f'M{x+38} {y+yy}H{x+ww}', 'line')
 return s

def folder(x,y,w,h):
 s=path(f'M{x} {y+28}V{y}H{x+138}L{x+166} {y+28}H{x+w}V{y+h}H{x}Z',fill='paper')
 s+=text(x+30,y+79,'工作目录',36,600)
 px=x+32;py=y+111
 s+=path(f'M{px} {py}H{px+37}L{px+56} {py+19}V{py+91}H{px}Z','muted',1.8,fill='pale')
 s+=path(f'M{px+37} {py}V{py+19}H{px+56}','muted',1.8)
 s+=text(px+83,py+58,'结果文件',32,500)
 return s

def gate(x,y,w=200,h=100):
 s=path(f'M{x} {y-42}V{y+h+42}M{x+w} {y-42}V{y+h+42}','line',2)
 s+=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{C["pale"]}" stroke="{C["blue"]}" stroke-width="2.5"/>'
 s+=text(x+w/2,y+h/2+12,'动作授权',32,600,'blue','middle')
 return s

def document(w,h,body):
 return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-labelledby="title desc"><title id="title">AgentScope · 企业 Agent 的运行机制</title><desc id="desc">消息经过动作授权连接到工作目录与结果文件。</desc><rect width="{w}" height="{h}" fill="{C['paper']}"/><g font-family="PingFang SC,Helvetica Neue,sans-serif">{body}</g></svg>'''

def landscape():
 s=text(100,185,'AgentScope',108,650)
 s+=text(105,280,'企业 Agent 的运行机制',50,550)
 s+=text(107,347,'从消息流转，到工作交付',34,450,'muted')
 s+=paper(140,501,425,336)
 s+=path('M565 690H1160','ink',2.5)
 s+=gate(760,640,226,100)
 s+=folder(1160,540,335,280)
 
 
 return document(1600,1200,s)

def portrait():
 s=text(90,195,'AgentScope',103,650)
 s+=text(95,300,'企业 Agent 的',48,550)
 s+=text(95,375,'运行机制',48,550)
 s+=text(98,458,'从消息流转，到工作交付',32,450,'muted')
 s+=paper(155,530,575,264)
 # The relation turns downward here; the horizontal cover uses a lateral bridge.
 s+=path('M730 662H905V1080H1040V1267H960','ink',2.5)
 s+=gate(795,876,220,100)
 s+=folder(300,1130,660,274)
 
 return document(1200,1600,s)

for name,svg in [('agentscope-4x3',landscape()),('agentscope-3x4',portrait())]:
 (ROOT/f'{name}.svg').write_text(svg)
with sync_playwright() as pw:
 browser=pw.chromium.launch()
 for name,w,h in [('agentscope-4x3',1600,1200),('agentscope-3x4',1200,1600)]:
  page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
  page.goto((ROOT/f'{name}.svg').as_uri());page.evaluate('document.fonts.ready');page.screenshot(path=str(ROOT/f'{name}.png'));page.close()
 browser.close()
print(ROOT)
