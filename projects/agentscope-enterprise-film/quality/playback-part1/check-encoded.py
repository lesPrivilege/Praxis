"""Decode five stable Part1 times from the available MP4; record bounded visual evidence."""
import hashlib,json,subprocess,sys
from pathlib import Path
from PIL import Image,ImageChops,ImageStat
OUT=Path(__file__).resolve().parent;PROJECT=OUT.parents[1]
sys.path.insert(0,str(PROJECT/'build'))
from common import ffmpeg_path
movie=PROJECT/'cut2/out/agentscope-enterprise-cut2.mp4'
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
selected=[(35.5,'002-whole-final.jpg'),(305.5,'036-agent-matching_result-settled.jpg'),(449.5,'071-events-reply_end-settled.jpg'),(573.5,'080-tools-final.jpg'),(732.5,'112-permission-result-settled.jpg')]
report={'movie':str(movie.relative_to(PROJECT)),'movie_sha256_before':sha(movie),'scope':'Five settled Part1 samples; not full video pixel equivalence or playback verification.','samples':[]}
for index,(t,reference) in enumerate(selected):
 target=OUT/f'encoded-{index+1}.png'
 run=subprocess.run([ffmpeg_path(),'-hide_banner','-loglevel','error','-ss',str(t),'-i',str(movie),'-frames:v','1','-y',str(target)],capture_output=True,text=True)
 if run.returncode:report['samples'].append({'t':t,'error':run.stderr});continue
 actual=Image.open(target).convert('RGB');ref=Image.open(OUT/reference).convert('RGB')
 if actual.size!=ref.size:report['samples'].append({'t':t,'error':'dimension mismatch','actual':actual.size,'reference':ref.size});continue
 diff=ImageStat.Stat(ImageChops.difference(actual,ref))
 report['samples'].append({'t':t,'frame':target.name,'reference':reference,'native_pixels':list(actual.size),'mean_absolute_channel_difference_0_255':diff.mean,'rms_channel_difference_0_255':diff.rms,'frame_sha256':sha(target)})
report['movie_sha256_after']=sha(movie);report['movie_unchanged']=report['movie_sha256_before']==report['movie_sha256_after'];report['decoded_all_samples']=len(report['samples'])==5 and not any('error' in s for s in report['samples'])
(OUT/'encoded-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2))
