"""Actual DOM inventory: text, roles, exposure, font sizes, settled overflow."""
import argparse,json
from playwright.sync_api import sync_playwright
from frames import ROOT,open_page
JS=r"""
() => {
 const INLINE=new Set(['SPAN','B','I','EM','STRONG','BR','SMALL','SUP','SUB','TSPAN']);
 const rows=[],stage=Film.stage.getBoundingClientRect();let sequence=0;
 function visible(el){
  if(!el)return false;const rect=el.getBoundingClientRect();let alpha=1;
  for(let e=el;e&&e!==document.body;e=e.parentElement){
   const c=getComputedStyle(e);alpha*=Number(c.opacity);
   if(c.display==='none'||c.visibility==='hidden'||alpha<.25)return false;
   if(e!==el&&(['hidden','clip'].includes(c.overflowX)||['hidden','clip'].includes(c.overflowY))){
    const clip=e.getBoundingClientRect();if(rect.bottom<=clip.top||rect.top>=clip.bottom||rect.right<=clip.left||rect.left>=clip.right)return false;
   }
  }
  return rect.width>1&&rect.height>1&&rect.right>stage.left&&rect.left<stage.right&&rect.bottom>stage.top&&rect.top<stage.bottom;
 }
 const block=e=>[...e.children].every(c=>INLINE.has(c.tagName.toUpperCase())&&[...c.querySelectorAll('*')].every(d=>INLINE.has(d.tagName.toUpperCase())));
 function walk(el,scene){
  if(el.classList.contains('scene'))scene=el.dataset.scene||el.id;
  if(!(el.textContent||'').trim())return;
  if(el.tagName.toLowerCase()==='text'||!el.children.length||block(el)){
   if(INLINE.has(el.tagName.toUpperCase())&&el.parentElement&&block(el.parentElement))return;
   const uid=sequence++;if(!visible(el))return;
   let text='';const fonts=[],textRects=[],keys=[];let transient=true;const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
   for(let n=walker.nextNode();n;n=walker.nextNode())if(n.nodeValue.trim()&&visible(n.parentElement)){
    text+=n.nodeValue;fonts.push(parseFloat(getComputedStyle(n.parentElement).fontSize));
    const range=document.createRange();range.selectNodeContents(n);textRects.push(...range.getClientRects());
    const keyed=n.parentElement.closest('[data-reading-key]');if(keyed)keys.push(keyed.dataset.readingKey);
    transient=transient&&!!n.parentElement.closest('[data-reading-transient="true"]');
   }
   text=text.replace(/\s+/g,' ').trim();if(!text)return;
   const rect=el.getBoundingClientRect(),cs=getComputedStyle(el),role=el.closest('.source,[data-reading="source"]')?'source':el.closest('.chrome-chapter,.chrome-badge,[data-reading="navigation"]')?'navigation':'content';
   const outside=textRects.some(r=>r.left<stage.left-1||r.top<stage.top-1||r.right>stage.right+1||r.bottom>stage.bottom+1);
   const clip=['hidden','clip'].includes(cs.overflow)&&(el.scrollHeight>el.clientHeight+2||el.scrollWidth>el.clientWidth+2);
   let parentClip=false;
   for(let p=el.parentElement;p&&p!==Film.stage;p=p.parentElement){
    const pc=getComputedStyle(p),pr=p.getBoundingClientRect(),horizontal=['hidden','clip'].includes(pc.overflowX),vertical=['hidden','clip'].includes(pc.overflowY);
    if(textRects.some(r=>(horizontal&&(r.left<pr.left-2||r.right>pr.right+2))||(vertical&&(r.top<pr.top-2||r.bottom>pr.bottom+2))))parentClip=true;
   }
   rows.push({scene,uid,cls:el.getAttribute('class')||el.tagName.toLowerCase(),text,role,px:Math.round(Math.min(...fonts)*100)/100,reading_key:el.closest('[data-reading-key]')?.dataset.readingKey||null,reading_keys:[...new Set(keys)],reading_transient:transient,x:Math.round(rect.left),y:Math.round(rect.top),overflow:outside||clip||parentClip,geometry:{x:rect.left,y:rect.top,width:rect.width,height:rect.height}});return;
  }
  for(const c of el.children)walk(c,scene);
 }
 walk(Film.stage,'');return rows;
}
"""
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--step',type=float,default=.5);a=ap.parse_args()
    if a.step<=0:ap.error('Step must be positive')
    tl=json.loads((ROOT/'out'/'timeline.json').read_text());seen={};overflows=[]
    with sync_playwright() as pw:
        browser,page=open_page(pw)
        for segment in tl['segments']:
            t=segment['start']
            while t<segment['end']-1e-8:
                page.evaluate('t=>Film.seek(t)',t);sample_end=min(segment['end'],t+a.step)
                for b in page.evaluate(JS):
                    key=(b['scene'],b['uid'],b['text']);entry=seen.setdefault(key,{**b,'first':round(t,6),'last':round(t,6),'visible_seconds':0,'intervals':[]})
                    entry['last']=round(t,6);entry['visible_seconds']+=sample_end-t;entry['px']=min(entry['px'],b['px']);intervals=entry['intervals']
                    if intervals and abs(intervals[-1][1]-t)<1e-6:intervals[-1][1]=round(sample_end,6)
                    else:intervals.append([round(t,6),round(sample_end,6)])
                    if b['overflow'] and not entry.get('overflow_recorded'):
                        active=any(e['at']<=t-segment['start']<=e['at']+e['duration'] for e in segment.get('events',[]))
                        if not active:overflows.append({'scene':b['scene'],'t':round(t,3),'text':b['text'],'geometry':b['geometry']});entry['overflow_recorded']=True
                t=round(t+a.step,6)
        browser.close()
    rows=sorted(seen.values(),key=lambda e:(e['first'],e['y'],e['x']))
    for row in rows:row['visible_seconds']=round(row['visible_seconds'],6);row.pop('overflow_recorded',None)
    out=ROOT/'out';out.mkdir(exist_ok=True);(out/'screen-text.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2));(out/'layout-report.json').write_text(json.dumps({'sample_step':a.step,'pass':not overflows,'settled_text_overflows':overflows},ensure_ascii=False,indent=2))
    md=['# 实际画面文字清单','','取自 Film.seek 后实际 DOM；导航、来源另行标记。取样间隔 '+str(a.step)+' 秒，曝光边界精度受间隔限制。','','| 首次出现 | 场 | 职责 | 字号 px | 可见秒数 | 文字 |','|---|---|---|---|---|---|']
    for row in rows:md.append(f"| {row['first']:.1f}s | {row['scene']} | {row['role']} | {row['px']} | {row['visible_seconds']:.1f} | {row['text'].replace('|','｜')} |")
    md+=['','返回 [成品](README.md)。',''];(out/'screen-text.md').write_text('\n'.join(md));print(f'{len(rows)} visible blocks; {len(overflows)} settled overflow')
if __name__=='__main__':main()
