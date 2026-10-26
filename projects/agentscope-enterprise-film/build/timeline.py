"""Compile beats scene-local seconds and declared motion windows."""
import json
from common import ROOT
def compile_timeline(beats):
    t=0;segments=[];chapters=[];ids=set()
    for scene in beats['scenes']:
        sid=scene['id'];dur=float(scene['dur'])
        if sid in ids or dur<=0:raise ValueError('Unique ids and positive duration required: '+sid)
        ids.add(sid);seg={'id':sid,'start':round(t,6),'end':round(t+dur,6),'plain':'','text':'','words':[]}
        if 'events' in scene:
            events=[]
            for event in scene['events']:
                at=float(event['at']);duration=float(event['duration'])
                if at<0 or duration<0 or at+duration>dur+1e-6:raise ValueError('Event outside scene '+sid)
                events.append({'at':at,'duration':duration})
            seg['events']=sorted(events,key=lambda e:e['at'])
        segments.append(seg);chapter=scene.get('chapter')
        if chapter:
            title=' '.join(str(v) for v in chapter) if isinstance(chapter,list) else str(chapter)
            if not chapters or chapters[-1]['title']!=title:chapters.append({'id':sid,'t':round(t,6),'title':title})
        t+=dur
    if not segments:raise ValueError('At least one scene required')
    if not chapters or chapters[0]['t']!=0:chapters.insert(0,{'id':segments[0]['id'],'t':0,'title':'开场'})
    return {'duration':round(t,6),'fps':24,'segments':segments,'chapters':chapters}
def main():
    tl=compile_timeline(json.loads((ROOT/'script'/'beats.json').read_text()));(ROOT/'out').mkdir(exist_ok=True)
    (ROOT/'film'/'timeline.js').write_text('window.TIMELINE = '+json.dumps(tl,ensure_ascii=False)+';\n')
    (ROOT/'out'/'timeline.json').write_text(json.dumps(tl,ensure_ascii=False,indent=2))
    print(f"{len(tl['segments'])} scenes, {tl['duration']:.2f}s")
if __name__=='__main__':main()
