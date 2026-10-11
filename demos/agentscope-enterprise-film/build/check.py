"""Encoded media and actual DOM checks. Intentional static reading holds are valid."""
import argparse,io,json,re,subprocess
from pathlib import Path
import numpy as np
from PIL import Image
from common import ROOT,ffmpeg_path
COUNT=lambda text:len(re.findall(r'[一-鿿A-Za-z0-9]',text))
def probe(ff,video):
    err=subprocess.run([ff,'-hide_banner','-i',str(video)],capture_output=True,text=True).stderr
    match=re.search(r'Duration: (\d+):(\d+):([\d.]+)',err)
    if not match:raise RuntimeError('Cannot read media duration: '+err[-500:])
    h,m,s=match.groups();vm=re.search(r'Video: (.*)',err)
    return {'duration':int(h)*3600+int(m)*60+float(s),'video':vm.group(1) if vm else '', 'has_audio':'Audio:' in err}
def decoded_frame(ff,video,t):
    data=subprocess.run([ff,'-v','error','-ss',f'{max(0,t):.8f}','-i',str(video),'-frames:v','1','-f','image2pipe','-c:v','png','pipe:1'],capture_output=True,check=True).stdout
    return np.asarray(Image.open(io.BytesIO(data)).convert('RGB'),dtype=np.float32)
def reading(tl):
    rows=json.loads((ROOT/'out'/'screen-text.json').read_text());content=[row for row in rows if row['role']=='content'];by_scene={}
    for segment in tl['segments']:
        blocks=[row for row in content if row['scene']==segment['id']];chars=sum(COUNT(row['text']) for row in blocks);first=min((r['first'] for r in blocks),default=segment['start']);budget=segment['end']-first
        by_scene[segment['id']]={'characters':chars,'seconds':round(budget,2),'cps':round(chars/max(budget,.01),3)}
    short=[{'scene':r['scene'],'text':r['text'],'visible_seconds':r['visible_seconds'],'need_seconds':round(max(2,COUNT(r['text'])/9),2)} for r in content if r['visible_seconds']+.51<max(2,COUNT(r['text'])/9)]
    slow=[sid for sid,values in by_scene.items() if values['cps']>6];small=[{'scene':r['scene'],'text':r['text'],'px':r['px'],'role':r['role']} for r in rows if r['px']<(24 if r['role'] in ('source','navigation') else 30)]
    bursts=[]
    for segment in tl['segments']:
        blocks=[r for r in content if r['scene']==segment['id']];peak=max((sum(COUNT(o['text']) for o in blocks if r['first']<=o['first']<r['first']+4)/4 for r in blocks),default=0)
        if peak>9:bursts.append({'scene':segment['id'],'new_characters_per_4s_second':round(peak,2)})
    return ({'pass':not short and not slow,'target_scene_cps':6,'exposure_cps_heuristic':9,'basis':'Static knowledge pages use scene budgets and DOM exposure; subtitle bursts advisory.','by_scene':by_scene,'scenes_above_target':slow,'blocks_shown_too_briefly':short,'advisory_burst_windows':bursts},{'pass':not small,'minimum_content_px':30,'minimum_navigation_source_px':24,'too_small':small})
def main():
    ap=argparse.ArgumentParser();ap.add_argument('video',nargs='?');ap.add_argument('--samples',type=int,default=16);a=ap.parse_args()
    if a.samples<1:ap.error('At least one sample required')
    video=Path(a.video) if a.video else ROOT/'out'/'agentscope-enterprise.mp4';ff=ffmpeg_path();tl=json.loads((ROOT/'out'/'timeline.json').read_text());meta_path=video.with_name(video.stem+'-render.json')
    meta=json.loads(meta_path.read_text()) if meta_path.exists() else {'from':0,'to':tl['duration'],'fps':24};start,end,fps=meta['from'],meta['to'],meta['fps'];duration=end-start;info=probe(ff,video)
    rep={'file':str(video.resolve()),'bytes':video.stat().st_size,'render_range':[start,end],'streams':{'pass':'h264' in info['video'] and '1920x1080' in info['video'] and not info['has_audio'] and abs(info['duration']-duration)<max(.06,1/fps),**info,'expected_duration':duration}}
    from playwright.sync_api import sync_playwright
    from frames import open_page
    frames=max(1,round(duration*fps));indices=sorted(set(int(i) for i in np.random.default_rng(7).integers(0,frames,size=a.samples)));samples=[]
    with sync_playwright() as pw:
        browser,page=open_page(pw)
        for index in indices:
            t=index/fps;page.evaluate('t=>Film.seek(t)',start+t);fresh=np.asarray(Image.open(io.BytesIO(page.screenshot(type='png'))).convert('RGB'),dtype=np.float32);mse=float(np.mean((fresh-decoded_frame(ff,video,t))**2))
            samples.append({'film_t':round(start+t,6),'psnr_db':round(float(10*np.log10(255**2/max(mse,1e-6))),2)})
        browser.close()
    minimum=min(r['psnr_db'] for r in samples);rep['fidelity']={'pass':minimum>=32,'minimum_psnr_db':minimum,'samples':samples}
    raw=subprocess.run([ff,'-v','error','-i',str(video),'-vf','fps=1,scale=320:180,format=gray','-f','rawvideo','pipe:1'],capture_output=True,check=True).stdout;pixels=np.frombuffer(raw,dtype=np.uint8).reshape(-1,180,320);blank=[round(start+i,3) for i,frame in enumerate(pixels) if frame.std()<1.5]
    rep['blank']={'pass':not blank,'sample_fps':1,'flat_frames_at':blank};rep['motion']={'pass':None,'status':'not_checked','intent':'Static holds are intentional reading time; full real-time perceptual viewing has not been completed.'}
    if (ROOT/'out'/'screen-text.json').exists():rep['reading'],rep['size']=reading(tl)
    else:rep['reading']=rep['size']={'pass':None,'error':'Run build/screen_text.py'}
    rep['layout']=json.loads((ROOT/'out'/'layout-report.json').read_text()) if (ROOT/'out'/'layout-report.json').exists() else {'pass':None,'error':'Run build/screen_text.py'}
    report=ROOT/'out'/('check-report.json' if start==0 and end==tl['duration'] else video.stem+'-check-report.json');report.write_text(json.dumps(rep,ensure_ascii=False,indent=2))
    for key,value in rep.items():
        if isinstance(value,dict) and 'pass' in value:print(f"{key}: {'PASS' if value['pass'] else 'FAIL' if value['pass'] is False else 'NOT CHECKED'}")
    print(report)
    if any(isinstance(v,dict) and v.get('pass') is False for v in rep.values()):raise SystemExit(1)
if __name__=='__main__':main()
