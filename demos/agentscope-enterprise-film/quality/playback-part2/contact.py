from pathlib import Path
from PIL import Image,ImageDraw
import json,sys

out=Path(__file__).resolve().parent
rows=json.loads((out/'capture-manifest.json').read_text())
scenes=sys.argv[1:] or list(dict.fromkeys(r['scene'] for r in rows))
for scene in scenes:
    group=[r for r in rows if r['scene']==scene]
    for n in range(0,len(group),6):
        sample=group[n:n+6]
        sheet=Image.new('RGB',(1920,740),(245,243,237));draw=ImageDraw.Draw(sheet)
        for i,r in enumerate(sample):
            x=i%3*640;y=i//3*370
            sheet.paste(Image.open(out/r['png']).resize((640,360)),(x,y))
            draw.text((x+6,y+360),r['png'],fill='black')
        sheet.save(out/f'{scene}-contact-{n//6:02}.png')
    print(scene,len(group),[r['png'] for r in group if any(t.startswith('phase_') for t in r['tags'])])
