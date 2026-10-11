"""Actual 1080p DOM/frame check for 39 final explanation pages + 71 exhibit phases.

Runs forward and reverse Film.seek against the current clock and manifest. This
checks rendered state/determinism, not AgentScope execution or perceptual quality.
"""
import hashlib
import json
import re
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

PROJECT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(PROJECT/'build'))
from screen_text import JS as TEXT_JS
from check import analyze_reading
CUT=PROJECT/'cut2'


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


VISIBLE_JS=r"""() => {
 function shown(e){let a=1;for(let p=e;p;p=p.parentElement){const c=getComputedStyle(p);a*=Number(c.opacity);if(c.display==='none'||c.visibility==='hidden'||a<.99)return false;}return true;}
 return {scenes:[...Film.stage.querySelectorAll('.scene')].filter(shown).map(e=>e.dataset.scene),
 phases:[...Film.stage.querySelectorAll('[data-phase]')].filter(shown).map(e=>e.dataset.phase)};
}"""

SSE_JS=r"""phase => {
 const panel=document.querySelector('#scene-java-05-snapshot-sse-cursor [data-phase="'+phase+'"] .sl-page');
 if(!panel)return null;
 function text(el){
  if(!el)return '';let out='';const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
  for(let n=w.nextNode();n;n=w.nextNode()){
   let alpha=1,visible=true;for(let p=n.parentElement;p;p=p.parentElement){const c=getComputedStyle(p);alpha*=Number(c.opacity);if(c.display==='none'||c.visibility==='hidden'||alpha<.25){visible=false;break;}}
   if(visible)out+=n.nodeValue;
  }
  return out.replace(/\s+/g,' ').trim();
 }
 return {message:text(panel.querySelector('.sl-message .sl-body')),cursor:text(panel.querySelector(':scope > .sl-body'))};
}"""


def check_sse_causality(page,manifest,output):
    """Observe the receiver only; event payload text is not already-applied content."""
    exhibit=manifest['java-05-snapshot-sse-cursor']
    cases=[('snapshot-initial','snapshot',1,'责任上限',None),
           ('subscribe-initial','subscribe',1,'责任上限',None),
           ('before-arrival','delta_applied',1.9,'责任上限','c17'),
           ('arrival','delta_applied',2.5,'责任上限缺失','c17'),
           ('applied-before-cursor','delta_applied',2.6,'责任上限缺失','c17'),
           ('cursor-after-apply','delta_applied',3.1,'责任上限缺失','c18')]
    observations=[]
    for name,phase,offset,message,cursor in cases:
        t=exhibit['start']+exhibit['cues'][phase]+offset
        page.evaluate('t=>Film.seek(t)',t);actual=page.evaluate(SSE_JS,phase)
        png=page.screenshot(type='png');frame=output/f'sse-cause-{name}.png';frame.write_bytes(png)
        ok=bool(actual) and actual['message']==message and (cursor is None or (cursor in actual['cursor'] and ('c18' if cursor=='c17' else 'c17') not in actual['cursor']))
        observations.append({'name':name,'phase':phase,'offset':offset,'t':t,'expected_message':message,'expected_cursor':cursor,
          'actual':actual,'pass':ok,'frame':str(frame.relative_to(PROJECT)),'png_sha256':hashlib.sha256(png).hexdigest()})
    mismatches=[]
    for item in reversed(observations):
        page.evaluate('t=>Film.seek(t)',item['t']);actual=page.evaluate(SSE_JS,item['phase']);png=page.screenshot(type='png')
        if actual!=item['actual'] or hashlib.sha256(png).hexdigest()!=item['png_sha256']:mismatches.append(item['name'])
    return {'pass':all(item['pass'] for item in observations) and not mismatches,
            'scope':'Actual right-page message/cursor at 6 instants; arrival precedes cursor advancement; forward/reverse PNG equality.',
            'observations':observations,'reverse_seek_mismatches':mismatches}


def main():
    timeline=json.loads((CUT/'out/timeline.json').read_text())
    stored=json.loads((CUT/'out/exhibit-manifest.json').read_text())
    manifest={entry['id']:entry for entry in stored}
    states=[]
    for segment in timeline['segments']:
        exhibit=manifest.get(segment['id'])
        if not exhibit:
            states.append({'scene':segment['id'],'phase':None,'t':segment['end']-.5,'final':True})
            continue
        for index,phase in enumerate(exhibit['phase_names']):
            end=segment['start']+exhibit['cues'][exhibit['phase_names'][index+1]] if index+1<len(exhibit['phase_names']) else segment['end']
            start=segment['start']+exhibit['cues'][phase]
            if end-start<=1:raise ValueError('No settled exposure for '+segment['id']+'/'+phase)
            states.append({'scene':segment['id'],'phase':phase,'t':end-.5,'final':index+1==len(exhibit['phase_names'])})
    output=PROJECT/'quality/cut2-state-frames';output.mkdir(exist_ok=True)
    (output/'README.md').write_text('# 切 2 状态帧\n\n由 [状态检查](../check_cut2_states.py)从当前 Film.seek 实际截图。每个一般场取最终状态；展项每阶段取下一阶段之前的稳定状态，共110张JPG，另有SSE初始/到达/游标因果检查的六张PNG。图片不能代替实际速度完整观看。\n\n返回 [质量记录](../README.md)。\n')
    inputs=[CUT/'out/timeline.json',CUT/'out/exhibit-manifest.json',CUT/'out/screen-text.json',CUT/'film/scenes.js',CUT/'film/index.html']
    inputs += sorted((PROJECT/'film').glob('*-lab.js'))+sorted((PROJECT/'film').glob('*-lab.css'))
    inputs += [PROJECT/'film'/name for name in ['film.css','engine.js','kit.js']]
    report={'object':'cut2/film/index.html','date':'2026-10-12 Asia/Singapore','native_pixels':[1920,1080],
            'scope':'Forward and reverse seek of settled DOM and frames; all scene finals. No AgentScope execution, encoded-media check, complete real-time viewing or audience test.',
            'input_sha256':{str(p.relative_to(PROJECT)):digest(p) for p in inputs},
            'expected_states':110,'actual_states':len(states),'scene_final_count':sum(s['final'] for s in states),'page_errors':[],
            'manifest_mismatches':[],'state_failures':[],'font_failures':[],'reverse_seek_mismatches':[],'states':[]}
    with sync_playwright() as pw:
        browser=pw.chromium.launch(args=['--force-device-scale-factor=1','--hide-scrollbars','--font-render-hinting=none','--disable-lcd-text'])
        page=browser.new_page(viewport={'width':1920,'height':1080},device_scale_factor=1)
        page.on('pageerror',lambda error:report['page_errors'].append(str(error)))
        page.goto((CUT/'film/index.html').as_uri()+'?render=1');page.wait_for_function('window.Film && Film.ready');page.evaluate('document.fonts.ready')
        fresh=page.evaluate('CUT2_MANIFEST')
        for current in fresh:
            previous=manifest.get(current['id'])
            for field in ['start','end','phase_names','cues','identities','output_filename','target_path','permission_mode']:
                if previous is None or current.get(field)!=previous.get(field):report['manifest_mismatches'].append({'scene':current['id'],'field':field,'stored':previous.get(field) if previous else None,'current':current.get(field)})
        for index,state in enumerate(states):
            page.evaluate('t=>Film.seek(t)',state['t']);visible=page.evaluate(VISIBLE_JS);rows=page.evaluate(TEXT_JS)
            text='\n'.join(r['text'] for r in rows)
            png=page.screenshot(type='png');filename=f"{index+1:03d}-{state['scene']}-{state['phase'] or 'final'}.jpg"
            page.screenshot(path=str(output/filename),type='jpeg',quality=94)
            item={**state,'visible':visible,'text':text,'minimum_content_px':min((r['px'] for r in rows if r['role']=='content'),default=None),
                  'frame':str((output/filename).relative_to(PROJECT)),'frame_sha256':digest(output/filename),
                  'png_sha256':hashlib.sha256(png).hexdigest(),'text_sha256':hashlib.sha256(text.encode()).hexdigest()}
            report['states'].append(item)
            if visible['scenes']!=[state['scene']] or (state['phase'] and visible['phases']!=[state['phase']]) or not any(r['role']=='content' for r in rows):report['state_failures'].append({'state':index,'expected':state,'visible':visible})
            for row in rows:
                minimum=24 if row['role'] in ['source','navigation'] else 30
                if row['px']<minimum:report['font_failures'].append({'state':index,'scene':state['scene'],'phase':state['phase'],'text':row['text'],'px':row['px'],'minimum':minimum})
        for index in reversed(range(len(states))):
            state=states[index];page.evaluate('t=>Film.seek(t)',state['t']);text='\n'.join(r['text'] for r in page.evaluate(TEXT_JS));png=page.screenshot(type='png')
            original=report['states'][index]
            if hashlib.sha256(png).hexdigest()!=original['png_sha256'] or hashlib.sha256(text.encode()).hexdigest()!=original['text_sha256'] or page.evaluate(VISIBLE_JS)!=original['visible']:report['reverse_seek_mismatches'].append({'state':index,'scene':state['scene'],'phase':state['phase']})
        report['sse_causality']=check_sse_causality(page,manifest,output)
        structured=next(item for item in report['states'] if item['scene']=='structured')
        page.evaluate('t=>Film.seek(t)',structured['t']);structured_rows=page.evaluate(TEXT_JS)
        frame=output/'structured-final.png';page.screenshot(path=str(frame),type='png')
        report['structured_text_bounds']={'pass':not any(row['overflow'] for row in structured_rows),
          'overflows':[{'text':row['text'],'geometry':row['geometry']} for row in structured_rows if row['overflow']],
          'frame':str(frame.relative_to(PROJECT)),'frame_sha256':digest(frame),
          'scope':'Actual settled text bounds against stage and clipping ancestors; line wrapping inspected separately.'}
        browser.close()
    # These assertions use text that actually appeared at the sampled stage, not
    # the source script or the manifest's static screen_text declaration.
    text_by_scene={s['id']:'\n'.join(r['text'] for r in report['states'] if r['scene']==s['id']) for s in timeline['segments']}
    permission=text_by_scene['permission'];tools=text_by_scene['tools'];artifact=text_by_scene['java-07-files-artifacts'];closure=text_by_scene['end']
    checks={
      'explore_mode_visible':'EXPLORE' in permission,
      'explore_ask_exception_visible':all(token in permission for token in ['EXPLORE','显式 ask','confirmed = true','ALLOWED']),
      'url_merge_failure_visible':all(token in tools for token in ['URL','不能追加']),
      'permission_R2_T2_visible':all(token in permission for token in ['R2','T2','review-v3.md']),
      'closure_R2_T2_visible':all(token in closure for token in ['R2','T2','review-v3.md']),
      'artifact_JA1_same_filename':all(token in artifact for token in ['JA1','review-v3.md']),
      'closure_JA1_same_filename':all(token in closure for token in ['JA1','review-v3.md']),
      'obsolete_output_names_absent':all(name not in permission+artifact+closure for name in ['risk-report.pdf','reviews/risk.md']),
      'permission_manifest_target':manifest['permission'].get('target_path')=='review-v3.md',
      'artifact_manifest_filename':manifest['java-07-files-artifacts'].get('output_filename')=='review-v3.md',
      'closure_manifest_filename':manifest['end']['identities'].get('result_filename')=='review-v3.md',
      'SSE_view_rebuild_wording':'重建 U1 的视图' in text_by_scene['java-05-snapshot-sse-cursor']}
    report['visible_content_assertions']=checks
    rows=json.loads((CUT/'out/screen-text.json').read_text());report['reading'],report['size']=analyze_reading(rows,timeline)
    report['inputs_changed_during_run']=[str(p.relative_to(PROJECT)) for p in inputs if digest(p)!=report['input_sha256'][str(p.relative_to(PROJECT))]]
    report['pass']=(report['sse_causality']['pass'] and report['structured_text_bounds']['pass'] and not report['inputs_changed_during_run'] and len(states)==110 and report['scene_final_count']==len(timeline['segments']) and
        not any(report[key] for key in ['page_errors','manifest_mismatches','state_failures','font_failures','reverse_seek_mismatches']) and all(checks.values()))
    report['reading_is_separate_from_state_pass']=True
    path=PROJECT/'quality/cut2-state-check.json';path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    reading_path=PROJECT/'quality/cut2-reading-check.json';reading_path.write_text(json.dumps({'input_sha256':report['input_sha256'],'reading':report['reading'],'size':report['size'],'scope':'Quantitative actual-DOM reading only; does not replace perceptual viewing.'},ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({key:report[key] for key in ['pass','actual_states','scene_final_count','visible_content_assertions']},ensure_ascii=False,indent=2))
    print('Reading:',report['reading']['pass'],'Size:',report['size']['pass']);print(path)
    if not report['pass']:raise SystemExit(1)

if __name__=='__main__':main()
