"""Compare encoded frames at the repaired incremental-update/cursor boundaries."""
import os,sys,json,io,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];P=R/'cut2'
os.environ['PRAXIS_FILM_ROOT']=str(P);sys.path.insert(0,str(R/'build'))
from check import decoded_frame
from common import ffmpeg_path
from frames import open_page
m=json.loads((P/'out/exhibit-manifest.json').read_text());s=next(x for x in m if x['id']=='java-05-snapshot-sse-cursor');tl=json.loads((P/'out/timeline.json').read_text());structured=next(x for x in tl['segments'] if x['id']=='structured')
points=[('snapshot',s['start']+s['cues']['snapshot']+1),('subscribe',s['start']+s['cues']['subscribe']+1)]+[(f'delta-{v}',s['start']+s['cues']['delta_applied']+v) for v in [1.9,2.5,2.6,3.1]]+[('structured',structured['end']-.5),('terminal',s['end']-.5)]
D=R/'quality/repair-media-frames';D.mkdir(exist_ok=True);(D/'README.md').write_text('# 修后编码帧\n\nSSE追加/游标边界与structured最终态的实际MP4解码帧，按24fps量化时刻与同刻舞台作PSNR比较。见 [回执](../cut2-repair-media-check.json)。\n')
video=P/'out/agentscope-enterprise-cut2.mp4';ff=ffmpeg_path();rows=[]
with sync_playwright() as pw:
 b,page=open_page(pw)
 for name,t in points:
  t=int(t*24)/24;page.evaluate('t=>Film.seek(t)',t);fresh=np.asarray(Image.open(io.BytesIO(page.screenshot(type='png'))).convert('RGB'),dtype=np.float32);encoded=decoded_frame(ff,video,t);mse=float(np.mean((fresh-encoded)**2));psnr=float(10*np.log10(255**2/max(mse,1e-6)));f=D/(name+'.png');Image.fromarray(encoded.astype(np.uint8)).save(f);rows.append({'name':name,'t':t,'psnr_db':round(psnr,2),'file':str(f.relative_to(R))})
 b.close()
report={'pass':all(r['psnr_db']>=32 for r in rows),'minimum_psnr_db':min(r['psnr_db'] for r in rows),'video_sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'timeline_sha256':hashlib.sha256((P/'out/timeline.json').read_bytes()).hexdigest(),'samples':rows,'scope':'Encoded repair boundaries, not continuous perceptual viewing'}
(R/'quality/cut2-repair-media-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False));raise SystemExit(0 if report['pass'] else 1)
