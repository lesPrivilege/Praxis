"""Chapter contact sheets and selected full-size settled frames."""
import json,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'build'))
from frames import ROOT,open_page
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
R=ROOT;S=json.loads((R/'script/beats.json').read_text())['scenes'];TL=json.loads((R/'out/timeline.json').read_text());font=ImageFont.truetype('/System/Library/Fonts/Menlo.ttc',16)
groups={};selected={'whole','react','permission','java-05-snapshot-sse-cursor','java-07-files-artifacts','sandbox','java-03-execution-targets'}
with sync_playwright() as pw:
 browser,page=open_page(pw)
 for s,seg in zip(S,TL['segments']):
  t=seg['end']-3;page.evaluate('t=>Film.seek(t)',t);p=R/'evidence'/(s['id']+'.png');page.screenshot(path=str(p));groups.setdefault(s['chapter'][0],[]).append((s['id'],t,p))
 for name,shots in groups.items():
  w,h,pad,lab=480,270,8,26;cols=3;rows=(len(shots)+cols-1)//cols;sheet=Image.new('RGB',(cols*(w+pad)+pad,rows*(h+lab+pad)+pad),'#10272d');d=ImageDraw.Draw(sheet)
  for i,(sid,t,p) in enumerate(shots):
   x=pad+i%cols*(w+pad);y=pad+i//cols*(h+lab+pad);sheet.paste(Image.open(p).convert('RGB').resize((w,h)),(x,y+lab));d.text((x,y+2),f'{t:.1f}s / {sid[:29]}',font=font,fill='#dce6df')
   if sid not in selected:p.unlink()
  sheet.save(R/'evidence'/('chapter-'+name+'.png'))
 browser.close()
print('6 chapter contact sheets; 7 full frames')
