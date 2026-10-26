"""Decode the actual MP4 and make keyframe/contact-sheet artifacts."""
from pathlib import Path
from PIL import Image,ImageDraw
import subprocess,json,cv2,os
ROOT=Path(__file__).resolve().parent.parent
BIN=ROOT/'node_modules/@remotion/compositor-darwin-arm64'
env={**os.environ,'DYLD_LIBRARY_PATH':str(BIN)}
movie=ROOT/'media/three-existences.mp4'
meta=json.loads(subprocess.check_output([str(BIN/'ffprobe'),'-v','quiet','-show_streams','-show_format','-of','json',str(movie)],env=env))
# Keep portable evidence: ffprobe's filename is local, not part of public provenance.
meta['format']['filename']='media/three-existences.mp4'
(ROOT/'evidence/video-metadata.json').write_text(json.dumps(meta,indent=2)+'\n')
times=[2,12,18,28,31,39,50,62,73,81]
imgs=[]
for t in times:
    target=ROOT/f'evidence/film-{t:02d}s.png'
    subprocess.run([str(BIN/'ffmpeg'),'-hide_banner','-loglevel','error','-ss',str(t),'-i',str(movie),'-frames:v','1','-y',str(target)],check=True,env=env)
    im=Image.open(target).convert('RGB');im.thumbnail((960,540));imgs.append((t,im))
sheet=Image.new('RGB',(1920,5*570),'#0c141c');draw=ImageDraw.Draw(sheet)
for i,(t,im) in enumerate(imgs):
    x=i%2*960;y=i//2*570;sheet.paste(im,(x,y));draw.text((x+20,y+545),f'{t}s',fill='white')
sheet.save(ROOT/'evidence/contact-sheet.jpg',quality=90)
cap=cv2.VideoCapture(str(movie));n=0
while cap.read()[0]:n+=1
cap.release()
(ROOT/'evidence/decode-check.json').write_text(json.dumps({'decoded_frames':n,'expected_frames':2520,'complete':n==2520},indent=2)+'\n')
print({'frames':n,'keyframes':times,'duration':meta['format']['duration']})
