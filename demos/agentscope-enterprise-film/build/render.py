"""Render a deterministic silent H.264 film, reusing still frames outside explicit motion windows.

python3 build/render.py --workers 4
python3 build/render.py --from 0 --to 12 --name sample
A missing events field renders every frame; events:[] declares a fully static scene.
No dependency download or audio is involved.
"""
import argparse
import json
import math
import multiprocessing as mp
import shutil
import subprocess
import tempfile
import time
from pathlib import Path
from common import ROOT, ffmpeg_path


def needs_capture(frame, previous, fps, segment):
    if previous is None or 'events' not in segment:
        return True
    t, last = frame / fps - segment['start'], previous / fps - segment['start']
    for event in segment['events']:
        start, end = event['at'], event['at'] + event['duration']
        # Capture motion frames plus the first frame after an event, including instantaneous cuts.
        if start <= t <= end or last < start <= t or last < end <= t:
            return True
    return False


def work(job):
    idx, f0, f1, fps, crf, preset, ffmpeg, tmp, segment = job
    from playwright.sync_api import sync_playwright
    from frames import open_page
    chunk = Path(tmp) / f'chunk-{idx:04d}.mp4'
    command = [ffmpeg, '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', str(fps), '-c:v', 'mjpeg', '-i', 'pipe:0',
               '-an', '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p', '-c:v', 'libx264',
               '-preset', preset, '-crf', str(crf), '-threads', '2', '-colorspace', 'bt709', '-color_primaries', 'bt709',
               '-color_trc', 'bt709', '-color_range', 'tv', '-g', str(fps * 2), '-movflags', '+faststart', str(chunk)]
    enc = subprocess.Popen(command, stdin=subprocess.PIPE)
    captures, cached, previous = 0, None, None
    try:
        with sync_playwright() as pw:
            browser, page = open_page(pw)
            for frame in range(f0, f1):
                if needs_capture(frame, previous, fps, segment):
                    page.evaluate('t => Film.seek(t)', frame / fps)
                    cached = page.screenshot(type='jpeg', quality=97)
                    captures += 1
                enc.stdin.write(cached)
                previous = frame
            browser.close()
    finally:
        enc.stdin.close()
    if enc.wait() != 0:
        raise RuntimeError('ffmpeg failed on chunk ' + str(idx))
    return idx, str(chunk), f1 - f0, captures


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--fps', type=int, default=24)
    ap.add_argument('--workers', type=int, default=4)
    ap.add_argument('--crf', type=int, default=18)
    ap.add_argument('--preset', default='veryfast')
    ap.add_argument('--from', dest='t0', type=float, default=0)
    ap.add_argument('--to', dest='t1', type=float)
    ap.add_argument('--name', default='agentscope-enterprise')
    a = ap.parse_args()
    tl = json.loads((ROOT / 'out' / 'timeline.json').read_text())
    end = a.t1 if a.t1 is not None else tl['duration']
    if not 0 <= a.t0 < end <= tl['duration'] or a.fps <= 0 or a.workers <= 0:
        ap.error('Require 0 <= from < to <= film duration and positive fps/workers')
    f0, f1 = math.ceil(a.t0 * a.fps - 1e-8), math.ceil(end * a.fps - 1e-8)
    ffmpeg = ffmpeg_path()
    tmp = Path(tempfile.mkdtemp(prefix='agentscope-render-'))
    out = ROOT / 'out'; out.mkdir(exist_ok=True)
    jobs = []
    for segment in tl['segments']:
        lo = max(f0, math.ceil(segment['start'] * a.fps - 1e-8))
        hi = min(f1, math.ceil(segment['end'] * a.fps - 1e-8))
        if lo < hi:
            jobs.append((len(jobs), lo, hi, a.fps, a.crf, a.preset, ffmpeg, str(tmp), segment))
    start, done, captures = time.time(), 0, 0
    chunks = [None] * len(jobs)
    try:
        with mp.get_context('spawn').Pool(min(a.workers, len(jobs))) as pool:
            for idx, path, frames, shots in pool.imap_unordered(work, jobs):
                chunks[idx] = path; done += frames; captures += shots
                elapsed = time.time() - start
                print(f'{done}/{f1-f0} frames; {captures} screenshots; {elapsed:.0f}s elapsed', flush=True)
        listing = tmp / 'chunks.txt'
        listing.write_text(''.join(f"file '{path}'\n" for path in chunks))
        final = out / f'{a.name}.mp4'
        subprocess.run([ffmpeg, '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(listing),
                        '-c', 'copy', '-an', '-movflags', '+faststart', str(final)], check=True)
        metadata = {'file': final.name, 'from': f0 / a.fps, 'to': f1 / a.fps, 'fps': a.fps,
                    'frames': f1-f0, 'screenshots': captures, 'reused_frames': f1-f0-captures,
                    'seconds_to_render': round(time.time()-start, 2), 'events_contract': 'scene-local motion windows; first post-window frame is captured'}
        (out / f'{a.name}-render.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=2))
        print(final)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

if __name__ == '__main__':
    main()
