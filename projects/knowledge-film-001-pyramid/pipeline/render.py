"""Render the film to H.264.

Several headless Chromium workers each take a contiguous run of frames: seek, screenshot,
pipe the frame (JPEG, quality 97) into ffmpeg. The chunks are then joined and muxed with audio/mix.wav.

  python3 pipeline/render.py                         whole film → out/pyramid-principle.mp4
  python3 pipeline/render.py --from 60 --to 75 --name test
  python3 pipeline/render.py --remux                 keep the picture, replace the sound
  options: --fps 30  --workers 6  --crf 16  --no-audio

ffmpeg comes from the imageio-ffmpeg wheel through uv; nothing is installed on the system.
"""
import argparse, json, multiprocessing as mp, shutil, subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).parent))


def ffmpeg_path():
    out = subprocess.run(['uv', 'run', '--quiet', '--with', 'imageio-ffmpeg', 'python', '-c',
                          'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'], capture_output=True, text=True, check=True)
    return out.stdout.strip().splitlines()[-1]


def work(job):
    idx, f0, f1, fps, crf, ffmpeg, tmp = job
    from playwright.sync_api import sync_playwright
    from frames import open_page
    chunk = Path(tmp) / f'chunk-{idx:03d}.mp4'
    enc = subprocess.Popen(
        [ffmpeg, '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', str(fps), '-c:v', 'mjpeg', '-i', 'pipe:0',
         '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-crf', str(crf),
         '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
         '-g', str(fps * 2), '-movflags', '+faststart', str(chunk)], stdin=subprocess.PIPE)
    with sync_playwright() as pw:
        browser, page = open_page(pw)
        for f in range(f0, f1):
            page.evaluate('t => Film.seek(t)', f / fps)
            enc.stdin.write(page.screenshot(type='jpeg', quality=97))
        browser.close()
    enc.stdin.close()
    if enc.wait() != 0:
        raise RuntimeError(f'ffmpeg failed on chunk {idx}')
    return str(chunk), f1 - f0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--fps', type=int, default=30)
    ap.add_argument('--workers', type=int, default=6)
    ap.add_argument('--crf', type=int, default=16)
    ap.add_argument('--from', dest='t0', type=float, default=0.0)
    ap.add_argument('--to', dest='t1', type=float)
    ap.add_argument('--name', default='pyramid-principle')
    ap.add_argument('--no-audio', action='store_true')
    ap.add_argument('--remux', action='store_true', help='keep the rendered picture, replace the sound with audio/mix.wav')
    a = ap.parse_args()
    if a.remux:
        ffmpeg = ffmpeg_path()
        final = ROOT / 'out' / f'{a.name}.mp4'; tmp = final.with_suffix('.remux.mp4')
        subprocess.run([ffmpeg, '-v', 'error', '-y', '-i', str(final), '-i', str(ROOT / 'audio' / 'mix.wav'), '-map', '0:v:0', '-map', '1:a:0',
                        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-shortest', '-movflags', '+faststart', str(tmp)], check=True)
        tmp.replace(final)
        print(f'{final}  sound replaced')
        return

    tl = json.loads((ROOT / 'script' / 'timeline.json').read_text())
    t1 = a.t1 if a.t1 is not None else tl['duration']
    f0, f1 = round(a.t0 * a.fps), round(t1 * a.fps)
    ffmpeg = ffmpeg_path()
    tmp = ROOT / 'pipeline' / '_render' / a.name
    shutil.rmtree(tmp, ignore_errors=True); tmp.mkdir(parents=True)
    out = ROOT / 'out'; out.mkdir(exist_ok=True)

    n = min(a.workers * 3, max(1, (f1 - f0) // (a.fps * 5)))  # more chunks than workers: steadier progress
    edges = [f0 + (f1 - f0) * i // n for i in range(n + 1)]
    jobs = [(i, edges[i], edges[i + 1], a.fps, a.crf, ffmpeg, str(tmp)) for i in range(n)]
    start, done = time.time(), 0
    chunks = [None] * n
    with mp.get_context('spawn').Pool(a.workers) as pool:
        for i, (path, k) in enumerate(pool.imap(work, jobs)):
            chunks[i] = path; done += k
            el = time.time() - start
            print(f'  {done}/{f1 - f0} frames  {done / el:.1f} fps  eta {(f1 - f0 - done) / (done / el):.0f}s', flush=True)

    lst = tmp / 'chunks.txt'
    lst.write_text(''.join(f"file '{c}'\n" for c in chunks))
    video = tmp / 'video.mp4'
    subprocess.run([ffmpeg, '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c', 'copy', str(video)], check=True)
    final = out / f'{a.name}.mp4'
    audio = ROOT / 'audio' / 'mix.wav'
    if a.no_audio or not audio.exists():
        shutil.copy(video, final)
    else:
        cmd = [ffmpeg, '-v', 'error', '-y', '-i', str(video), '-ss', f'{a.t0:.3f}', '-t', f'{t1 - a.t0:.3f}', '-i', str(audio),
               '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-shortest', '-movflags', '+faststart']
        subprocess.run(cmd + [str(final)], check=True)
    shutil.rmtree(tmp, ignore_errors=True)
    print(f'{final}  {f1 - f0} frames  {time.time() - start:.0f}s')


if __name__ == '__main__':
    main()
