"""Render an assembly to H.264 with its sound, soft subtitles and chapter marks.

Several headless Chromium workers each take a contiguous run of frames: seek, screenshot,
pipe the frame (JPEG, quality 97) into ffmpeg. The chunks are joined and muxed with
out/<a>.mix.wav, assembly/timelines/<a>.vtt (a selectable subtitle track) and the timeline's chapters.
The stage refuses to boot when a scene uses an asset the ledger has not cleared, so a refused
image stops the render instead of slipping into the film.

A whole compilation renders only its ident, unit cards, end card and the gaps between them; each unit's
body is cut from that unit's standalone render (out/epNN.mp4). A whole render records what its picture
depended on in out/<a>.inputs.json: a hash of the film/ code, the unit's scenes, the timeline, and the
ledger rows of the claims and assets its scenes used. The compilation reuses a body only while that hash
still matches, so a ledger edit elsewhere does not force a re-render, and a relevant one does.

  python3 build/render.py ep01                    whole assembly → out/ep01.mp4
  python3 build/render.py ep01 --from 60 --to 75 --name ep01-test
  python3 build/render.py ep01 --remux            keep the picture, replace sound, subtitles, chapters
  python3 build/render.py compilation              after every standalone episode is rendered
  python3 build/render.py ep01 --record           only rewrite out/ep01.inputs.json (inputs unchanged since its render)
  options: --fps 30  --workers 6  --crf 16  --no-audio

Adapted from demos/role-baseline-film/build/render.py.
"""
import argparse, faulthandler, hashlib, json, multiprocessing as mp, os, re, shutil, signal, subprocess, sys, tempfile, threading, time
from concurrent.futures import ProcessPoolExecutor, as_completed
from concurrent.futures.process import BrokenProcessPool
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from common import ROOT, BrowserLost, ffmpeg_path, kill_browsers, manifest, open_page, timeline


def encode(fps, crf):
    return ['-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-crf', str(crf),
            '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
            '-g', str(fps * 2), '-video_track_timescale', str(fps * 512), '-movflags', '+faststart']


STALL = 180         # seconds without a new frame before a worker gives up on its browser (generous: a loaded machine is slow, not stuck)
RETRIES = 3


def work(job):
    idx, asm, f0, f1, fps, crf, ffmpeg, tmp, src = job
    chunk = Path(tmp) / f'chunk-{idx:03d}.mp4'
    if src:                              # a compilation body: frames src_start … from the standalone render
        path, s0 = src
        # restamp from 0: the cut keeps the source's first timestamp (about a frame in), which the concat turns into a
        # one-frame gap, so every later body would run a frame further behind the sound; no chapter track either
        enc = encode(fps, crf); k = enc.index('-vf'); enc[k + 1] = f'setpts=N/({fps}*TB),' + enc[k + 1]
        subprocess.run([ffmpeg, '-v', 'error', '-y', '-ss', f'{(s0 - 0.5) / fps:.6f}', '-i', path, '-map', '0:v:0',
                        '-map_chapters', '-1', '-frames:v', str(f1 - f0), *enc, '-r', str(fps), str(chunk)], check=True)
        return str(chunk), f1 - f0
    from playwright.sync_api import sync_playwright
    # A worker that has drawn nothing for STALL seconds prints where it hung, ends itself, and main() runs its chunk
    # again. The watch ends with the chunk: the worker goes on to other chunks. A worker the pool ends (because a
    # sibling died) takes its Chrome with it; Chrome leads its own process group and would otherwise outlive it.
    signal.signal(signal.SIGTERM, lambda *_: (kill_browsers(), os._exit(3)))
    last, finished = [time.time()], threading.Event()
    def watchdog():
        while not finished.wait(5):
            if time.time() - last[0] > STALL:
                faulthandler.dump_traceback(); kill_browsers(); os._exit(3)
    threading.Thread(target=watchdog, daemon=True).start()
    enc = subprocess.Popen([ffmpeg, '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', str(fps), '-c:v', 'mjpeg', '-i', 'pipe:0',
                            *encode(fps, crf), str(chunk)], stdin=subprocess.PIPE)
    try:
        with sync_playwright() as pw:
            try:
                browser, page = open_page(pw, asm)
            except SystemExit as e:      # a dead worker would leave the pool waiting; report instead
                raise RuntimeError(str(e)) from None
            for f in range(f0, f1):
                page.evaluate('t => Film.seek(t)', f / fps)
                enc.stdin.write(page.screenshot(type='jpeg', quality=97))
                last[0] = time.time()
            browser.close()
    finally:
        finished.set()
    enc.stdin.close()
    if enc.wait() != 0:
        raise RuntimeError(f'ffmpeg failed on chunk {idx}')
    return str(chunk), f1 - f0


def fingerprint(a, used):
    """Hash of what an assembly's picture depends on: film/ code, the units' scenes, its timeline, and the
    ledger rows (as exported for the stage) of the claims and assets its scenes used."""
    led = {}
    for line in (ROOT / 'assembly' / 'ledgers.js').read_text().splitlines():
        m = re.match(r'window\.(\w+) = (.*);$', line)
        if m: led[m.group(1)] = json.loads(m.group(2))
    tl = timeline(a)
    files = [*sorted((ROOT / 'film').glob('*.js')), *sorted((ROOT / 'film').glob('*.css')), ROOT / 'assembly' / 'timelines' / f'{a}.json']
    files += [ROOT / u['dir'] / f for u in tl['units'] for f in ('scenes.js', 'scenes.css')]
    h = hashlib.sha256()
    for f in files:
        h.update(f.name.encode()); h.update(f.read_bytes())
    for kind, ids in (('CLAIMS', used['claims']), ('ASSETS', used['assets'])):
        h.update(json.dumps({k: led.get(kind, {}).get(k) for k in sorted(ids)}, sort_keys=True, ensure_ascii=False).encode())
    return h.hexdigest()


def record(a):
    """Write out/<a>.inputs.json for a whole render of a."""
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        browser, page = open_page(pw, a)
        used = page.evaluate("({claims: [...Film.used.claims], assets: [...Film.used.assets]})")
        browser.close()
    (ROOT / 'out' / f'{a}.inputs.json').write_text(json.dumps({'fingerprint': fingerprint(a, used), 'used': used}, indent=1))


def body_sources(tl, fps):
    """Compilation body frame ranges and where each comes from: (f0, f1, (standalone mp4, its first frame))."""
    eps = {a['units'][0]: n for n, a in manifest()['assemblies'].items() if a['kind'] == 'standalone'}
    out = []
    for b in tl['blocks']:
        if b['type'] != 'speech' or b.get('role') != 'body':
            continue
        ep = eps[b['unit']]
        sb = next(x for x in timeline(ep)['blocks'] if x['type'] == 'speech' and x.get('role') == 'body')
        mp4, rec = ROOT / 'out' / f'{ep}.mp4', ROOT / 'out' / f'{ep}.inputs.json'
        if not mp4.exists() or not rec.exists():
            raise SystemExit(f'{mp4.name} or its inputs record is missing; render {ep} first')
        r = json.loads(rec.read_text())
        if r['fingerprint'] != fingerprint(ep, r['used']):
            raise SystemExit(f'{mp4.name} is out of date: its scenes, timeline, film code or the ledger rows it shows changed; render {ep} again')
        if abs((b['end'] - b['start']) - (sb['end'] - sb['start'])) > 1e-3:
            raise SystemExit(f"unit {b['unit']}: body length differs from {ep}; rebuild both timelines")
        out.append((round(b['start'] * fps), round(b['end'] * fps), (str(mp4), round(sb['start'] * fps))))
    return out


def chapters_file(tl, path, t0, t1):
    rows = [';FFMETADATA1', f"title={tl['title']}"]
    chs = [c for c in tl['chapters'] if t0 <= c['t'] < t1]
    for i, c in enumerate(chs):
        end = chs[i + 1]['t'] if i + 1 < len(chs) else t1
        rows += ['[CHAPTER]', 'TIMEBASE=1/1000', f"START={int((c['t'] - t0) * 1000)}", f'END={int((end - t0) * 1000)}', f"title={c['title']}"]
    path.write_text('\n'.join(rows) + '\n')


def mux(ffmpeg, video, final, a, tl, t0, t1, no_audio):
    tmp = Path(tempfile.mkdtemp(prefix='prl-mux-'))
    meta = tmp / 'chapters.txt'; chapters_file(tl, meta, t0, t1)
    audio = ROOT / 'out' / f'{a}.mix.wav'
    vtt = ROOT / 'assembly' / 'timelines' / f'{a}.vtt'
    cmd = [ffmpeg, '-v', 'error', '-y', '-i', str(video)]
    maps = ['-map', '0:v:0']
    k = 1
    if not no_audio and audio.exists():
        cmd += ['-ss', f'{t0:.3f}', '-t', f'{t1 - t0:.3f}', '-i', str(audio)]; maps += ['-map', f'{k}:a:0']; k += 1
    whole = t0 == 0 and abs(t1 - tl['duration']) < 1e-3
    if whole and vtt.exists():
        cmd += ['-i', str(vtt)]; maps += ['-map', f'{k}:s:0']; k += 1
    cmd += ['-i', str(meta)]
    cmd += maps + ['-map_metadata', str(k), '-map_chapters', str(k), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000',
                   '-c:s', 'mov_text', '-metadata:s:s:0', 'language=chi', '-metadata:s:a:0', 'language=chi', '-movflags', '+faststart', str(final)]
    subprocess.run(cmd, check=True)
    shutil.rmtree(tmp, ignore_errors=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('assembly')
    ap.add_argument('--fps', type=int, default=30)
    ap.add_argument('--workers', type=int, default=6)
    ap.add_argument('--crf', type=int, default=16)
    ap.add_argument('--from', dest='t0', type=float, default=0.0)
    ap.add_argument('--to', dest='t1', type=float)
    ap.add_argument('--name')
    ap.add_argument('--no-audio', action='store_true')
    ap.add_argument('--remux', action='store_true', help='keep the rendered picture, replace sound, subtitles and chapters')
    ap.add_argument('--record', action='store_true', help='only write out/<a>.inputs.json')
    a = ap.parse_args()
    if a.record:
        record(a.assembly); print(f'out/{a.assembly}.inputs.json written'); return
    tl = timeline(a.assembly)
    name = a.name or a.assembly
    out = ROOT / 'out'; out.mkdir(exist_ok=True)
    final = out / f'{name}.mp4'
    ffmpeg = ffmpeg_path()
    t1 = a.t1 if a.t1 is not None else tl['duration']

    if a.remux:
        tmp = final.with_suffix('.remux.mp4')
        mux(ffmpeg, final, tmp, a.assembly, tl, 0.0, tl['duration'], a.no_audio)
        tmp.replace(final)
        print(f'{final}  sound, subtitles and chapters replaced')
        return

    f0, f1 = round(a.t0 * a.fps), round(t1 * a.fps)
    whole = f0 == 0 and t1 == tl['duration']
    bodies = body_sources(tl, a.fps) if tl['kind'] == 'compilation' and whole else []
    spans, at = [], f0                   # (first frame, end frame, source or None) in film order
    for b0, b1, src in bodies:
        if b0 > at: spans.append((at, b0, None))
        spans.append((b0, b1, src)); at = b1
    if at < f1: spans.append((at, f1, None))
    to_draw = sum(s1 - s0 for s0, s1, src in spans if not src)
    size = max(a.fps * 5, to_draw // (a.workers * 3) + 1)  # more chunks than workers: steadier progress
    pieces = []
    for s0, s1, src in spans:
        if src:
            pieces.append((s0, s1, src)); continue
        n = max(1, round((s1 - s0) / size))
        edges = [s0 + (s1 - s0) * i // n for i in range(n + 1)]
        pieces += [(edges[i], edges[i + 1], None) for i in range(n)]
    tmp = Path(tempfile.mkdtemp(prefix='prl-render-'))
    jobs = [(i, a.assembly, p0, p1, a.fps, a.crf, ffmpeg, str(tmp), src) for i, (p0, p1, src) in enumerate(pieces)]
    from playwright.sync_api import Error as BrowserError
    start, done = time.time(), 0
    chunks = [None] * len(jobs)
    todo = jobs
    for attempt in range(RETRIES + 1):
        failed = []
        with ProcessPoolExecutor(a.workers, mp_context=mp.get_context('spawn')) as pool:
            futures = {pool.submit(work, j): j for j in todo}
            for f in as_completed(futures):
                j = futures[f]
                try:
                    path, k = f.result()
                except (BrokenProcessPool, BrowserError, BrowserLost):   # a stalled or lost browser; the stage's own errors still stop the render
                    failed.append(j); continue
                chunks[j[0]] = path; done += k
                el = time.time() - start
                print(f'  {done}/{f1 - f0} frames  {done / el:.1f} fps  eta {(f1 - f0 - done) / (done / el):.0f}s', flush=True)
        if not failed: break
        if attempt == RETRIES: raise SystemExit(f'{len(failed)} chunks still failing after {RETRIES} retries')
        print(f'  {len(failed)} chunks lost their browser; running them again', flush=True)
        todo = failed
    lst = tmp / 'chunks.txt'
    lst.write_text(''.join(f"file '{c}'\n" for c in chunks))
    video = tmp / 'video.mp4'
    subprocess.run([ffmpeg, '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c', 'copy', str(video)], check=True)
    mux(ffmpeg, video, final, a.assembly, tl, a.t0, t1, a.no_audio)
    shutil.rmtree(tmp, ignore_errors=True)
    if whole and not a.name:
        record(a.assembly)
    print(f'{final}  {f1 - f0} frames  {time.time() - start:.0f}s')


if __name__ == '__main__':
    main()
