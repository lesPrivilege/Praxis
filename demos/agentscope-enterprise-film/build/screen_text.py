"""Inventory visible text from the actual seeked DOM, never from script source.

The output records first/last exposure, font size, role and geometry. Navigation/source
are retained separately. Static reading pages are assessed by exposure, not subtitle bursts.
"""
import argparse
import json
from playwright.sync_api import sync_playwright
from frames import ROOT, open_page

JS = r"""
() => {
  const INLINE = new Set(['SPAN','B','I','EM','STRONG','BR','SMALL','SUP','SUB','TSPAN']);
  const rows = [], stage = Film.stage.getBoundingClientRect();
  function visible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect(); let alpha = 1;
    for (let e=el; e && e!==document.body; e=e.parentElement) {
      const c=getComputedStyle(e); alpha*=Number(c.opacity);
      if (c.display==='none' || c.visibility==='hidden' || alpha<0.25) return false;
      if (e!==el && (c.overflowX==='hidden'||c.overflowY==='hidden'||c.overflow==='clip')) {
        const clip=e.getBoundingClientRect();
        if (rect.bottom<=clip.top || rect.top>=clip.bottom || rect.right<=clip.left || rect.left>=clip.right) return false;
      }
    }
    return rect.width>1 && rect.height>1 && rect.right>stage.left && rect.left<stage.right && rect.bottom>stage.top && rect.top<stage.bottom;
  }
  const block = e => [...e.children].every(c => INLINE.has(c.tagName.toUpperCase()) && [...c.querySelectorAll('*')].every(d => INLINE.has(d.tagName.toUpperCase())));
  let sequence=0;
  function walk(el, scene) {
    if(el.classList.contains('scene')) scene=el.dataset.scene||el.id;
    if(!(el.textContent||'').trim()) return;
    if(el.tagName.toLowerCase()==='text' || !el.children.length || block(el)) {
      if(INLINE.has(el.tagName.toUpperCase()) && el.parentElement && block(el.parentElement)) return;
      const uid=sequence++; if(!visible(el)) return;
      let text=''; const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
      for(let n=walker.nextNode();n;n=walker.nextNode()) if(n.nodeValue.trim() && visible(n.parentElement)) text+=n.nodeValue;
      text=text.replace(/\s+/g,' ').trim(); if(!text) return;
      const rect=el.getBoundingClientRect(), cs=getComputedStyle(el);
      const role=el.closest('.source,[data-reading="source"]')?'source':el.closest('.chrome-chapter,.chrome-badge,[data-reading="navigation"]')?'navigation':'content';
      const range=document.createRange();range.selectNodeContents(el);
      const textRects=[...range.getClientRects()];
      const outside=textRects.some(r=>r.left<stage.left-1||r.top<stage.top-1||r.right>stage.right+1||r.bottom>stage.bottom+1);
      const clip=(cs.overflow==='hidden'||cs.overflow==='clip')&&(el.scrollHeight>el.clientHeight+2||el.scrollWidth>el.clientWidth+2);
      let parentClip=false;
      for(let p=el.parentElement;p && p!==Film.stage;p=p.parentElement){
        const pc=getComputedStyle(p),pr=p.getBoundingClientRect();
        const horizontal=['hidden','clip'].includes(pc.overflowX),vertical=['hidden','clip'].includes(pc.overflowY);
        if(textRects.some(r=>(horizontal&&(r.left<pr.left-2||r.right>pr.right+2))||(vertical&&(r.top<pr.top-2||r.bottom>pr.bottom+2)))) parentClip=true;
      }
      rows.push({scene,uid,cls:el.getAttribute('class')||el.tagName.toLowerCase(),text,role,
        px:Math.round(parseFloat(cs.fontSize)*100)/100,x:Math.round(rect.left),y:Math.round(rect.top),
        overflow:outside||clip||parentClip,geometry:{x:rect.left,y:rect.top,width:rect.width,height:rect.height}});
      return;
    }
    for(const c of el.children)walk(c,scene);
  }
  walk(Film.stage,'');return rows;
}
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--step', type=float, default=0.5)
    a = ap.parse_args()
    if a.step <= 0: ap.error('--step must be positive')
    tl = json.loads((ROOT / 'out' / 'timeline.json').read_text())
    seen, overflows = {}, []
    with sync_playwright() as pw:
        browser, page = open_page(pw)
        for segment in tl['segments']:
            t = segment['start']
            while t < segment['end'] - 1e-8:
                page.evaluate('t => Film.seek(t)', t)
                # Last sample covers only the remaining fraction of a scene.
                sample_end = min(segment['end'], t + a.step)
                for b in page.evaluate(JS):
                    key = (b['scene'], b['uid'], b['text'])
                    entry = seen.setdefault(key, {**b, 'first': round(t, 6), 'last': round(t, 6), 'visible_seconds': 0, 'intervals': []})
                    entry['last'] = round(t, 6); entry['visible_seconds'] += sample_end-t
                    entry['px'] = min(entry['px'], b['px'])
                    intervals = entry['intervals']
                    if intervals and abs(intervals[-1][1]-t)<1e-6: intervals[-1][1]=round(sample_end,6)
                    else: intervals.append([round(t,6),round(sample_end,6)])
                    if b['overflow'] and not entry.get('overflow_recorded'):
                        # Transform motion can temporarily cross a mask. Check the settled content instead.
                        active = any(e['at'] <= t-segment['start'] <= e['at']+e['duration'] for e in segment.get('events',[]))
                        if not active:
                            overflows.append({'scene':b['scene'],'t':round(t,3),'text':b['text'],'geometry':b['geometry']})
                            entry['overflow_recorded']=True
                t = round(t + a.step, 6)
        browser.close()
    rows = sorted(seen.values(), key=lambda e:(e['first'],e['y'],e['x']))
    for row in rows:
        row['visible_seconds']=round(row['visible_seconds'],6);row.pop('overflow_recorded',None)
    out=ROOT/'out';out.mkdir(exist_ok=True)
    (out/'screen-text.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
    (out/'layout-report.json').write_text(json.dumps({'sample_step':a.step,'pass':not overflows,'settled_text_overflows':overflows},ensure_ascii=False,indent=2))
    md=['# 实际画面文字清单','','从 Film.seek 后的 DOM 抽取；导航与来源另行保留。取样间隔 '+str(a.step)+' 秒，曝光边界精度受该间隔限制。','',
        '| 首次出现 | 场 | 职责 | 字号 px | 可见秒数 | 文字 |','|---|---|---|---|---|---|']
    for row in rows:
        md.append(f"| {row['first']:.1f}s | {row['scene']} | {row['role']} | {row['px']} | {row['visible_seconds']:.1f} | {row['text'].replace('|','｜')} |")
    md+=['','返回 [成品](README.md)。','']
    (out/'screen-text.md').write_text('\n'.join(md))
    print(f'{len(rows)} visible text blocks; {len(overflows)} settled text overflows')

if __name__ == '__main__':main()
