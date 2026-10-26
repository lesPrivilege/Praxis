"""1x MP4 playback in an isolated browser with timestamped visual samples."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,time
ROOT=Path(__file__).resolve().parent.parent
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    page=browser.new_page(viewport={'width':1440,'height':1100})
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto((ROOT/'review-player.html').as_uri())
    page.locator('#movie').evaluate('(v)=>v.playbackRate=1')
    page.locator('#movie').click()
    page.locator('#movie').evaluate('(v)=>v.play()')
    start=time.monotonic();samples=[]
    for target in [2,12,18,28,31,39,50,62,73,81]:
        page.wait_for_function('(t)=>document.querySelector("video").currentTime>=t',arg=target,timeout=16000)
        media=page.locator('#movie').evaluate('(v)=>({currentTime:v.currentTime,playbackRate:v.playbackRate,paused:v.paused,ended:v.ended,readyState:v.readyState,width:v.videoWidth,height:v.videoHeight})')
        page.locator('#movie').screenshot(path=str(ROOT/f'evidence/playback-{target:02d}s.png'))
        samples.append(media)
    page.wait_for_function('document.querySelector("video").ended',timeout=10000)
    final=page.locator('#movie').evaluate('(v)=>({duration:v.duration,currentTime:v.currentTime,ended:v.ended,error:v.error&&v.error.message})')
    assert final['ended'] and not final['error'],final
    assert not errors,errors
    report={'mode':'actual complete 1x playback in isolated local Chromium; visual samples taken during playback',
      'wall_seconds':round(time.monotonic()-start,2),'samples':samples,'final':final,'errors':errors,
      'limitation':'native screen tool transport closed; sampled screenshots do not establish continuous native-screen viewing or audience comprehension'}
    (ROOT/'evidence/playback-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    browser.close()
print('Complete 1x playback reached ended; timestamped samples saved.')
