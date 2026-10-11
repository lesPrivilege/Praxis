"""Add the six chapter marks to the local MP4 without re-encoding frames."""
import json,sys,subprocess
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'build'))
from common import ROOT,ffmpeg_path
x=json.loads((ROOT/'out/timeline.json').read_text());entries=[';FFMETADATA1']
for i,c in enumerate(x['chapters']):
 end=x['chapters'][i+1]['t'] if i+1<len(x['chapters']) else x['duration']
 entries+=['[CHAPTER]','TIMEBASE=1/1000',f"START={round(c['t']*1000)}",f'END={round(end*1000)}','title='+c['title']]
meta=ROOT/'out/chapters.ffmetadata';meta.write_text('\n'.join(entries)+'\n');video=ROOT/'out/agentscope-enterprise.mp4';temp=ROOT/'out/chaptered.mp4'
subprocess.run([ffmpeg_path(),'-v','error','-y','-i',str(video),'-i',str(meta),'-map','0:v:0','-map_metadata','1','-map_chapters','1','-c','copy','-an','-movflags','+faststart',str(temp)],check=True);temp.replace(video)
print(len(x['chapters']),'chapter marks added')
