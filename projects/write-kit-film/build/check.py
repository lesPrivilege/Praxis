"""Checks on the rendered silent film. Each check has a way to fail; results go to out/check-report.json.

  python3 build/check.py [out/write-kit.mp4]

  streams      H.264 1920×1080, no audio stream, duration equals the scene clock
  fidelity     frames decoded from the file match fresh renders of the same instants (PSNR ≥ 32 dB)
  motion       no stretch longer than 6 s in which the picture does not change at all (the closing sheet excepted, ≤ 8 s)
  blank        no frame that is a single flat colour
  reading      from out/screen-text.json, which build/screen_text.py writes: the characters that first appear in any
               4-second window stay under 9 per second (the adult limit of Netflix's Simplified Chinese timed-text
               guide), and every block stays visible for at least max(2 s, characters / 9 s)
  size         no visible text under 24 px, none under 30 px outside the source line

There is no sound, so there is nothing to transcribe or measure for loudness.
Adapted from demos/role-baseline-film/build/check.py.
"""
import io, json, re, subprocess, sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).parent))
from render import ffmpeg_path

FF = ffmpeg_path()
TL = json.loads((ROOT / 'out' / 'timeline.json').read_text())
CPS = 9.0
SKIP = ('chrome-chapter', 'source')       # chapter tag and source line are navigation, not content to read
count = lambda s: len(re.findall(r'[一-鿿A-Za-z0-9]', s))


def probe(mp4):
    err = subprocess.run([FF, '-hide_banner', '-i', str(mp4)], capture_output=True, text=True).stderr
    h, m, s = re.search(r'Duration: (\d+):(\d+):([\d.]+)', err).groups()
    return {'duration': int(h) * 3600 + int(m) * 60 + float(s), 'video': re.search(r'Video: (.*)', err).group(1), 'has_audio': 'Audio:' in err}


def frame_from(mp4, t):
    raw = subprocess.run([FF, '-v', 'error', '-ss', f'{max(0, t - 0.012):.3f}', '-i', str(mp4), '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', 'pipe:1'], capture_output=True, check=True).stdout
    return np.asarray(Image.open(io.BytesIO(raw)).convert('RGB'), dtype=np.float32)


def reading():
    blocks = [b for b in json.loads((ROOT / 'out' / 'screen-text.json').read_text()) if b['cls'] not in SKIP]
    for b in blocks:
        b['n'] = count(b['text'])
    peak, worst = 0.0, None
    t = 0.0
    while t < TL['duration']:
        n = sum(b['n'] for b in blocks if t <= b['first'] < t + 4)
        if n / 4 > peak:
            peak, worst = n / 4, round(t, 1)
        t += 0.5
    short = [{'text': b['text'], 'first': b['first'], 'seen_s': b['last'] - b['first'] + 0.5, 'need_s': round(max(2.0, b['n'] / CPS), 1)}
             for b in blocks if b['last'] - b['first'] + 0.5 < max(2.0, b['n'] / CPS)]
    by_scene = {}
    for s in TL['segments']:
        n = sum(b['n'] for b in blocks if s['start'] <= b['first'] < s['end'])
        by_scene[s['id']] = {'characters': n, 'seconds': round(s['end'] - s['start'], 1), 'cps': round(n / (s['end'] - s['start']), 2)}
    small = [{'text': b['text'], 'px': b['px']} for b in json.loads((ROOT / 'out' / 'screen-text.json').read_text())
             if b['px'] < (24 if b['cls'] in SKIP else 30)]
    return ({'pass': peak <= CPS and not short, 'limit_cps': CPS, 'peak_cps_in_4s_window': round(peak, 2), 'peak_window_starts_at': worst,
             'blocks_shown_too_briefly': short, 'by_scene': by_scene},
            {'pass': not small, 'too_small': small})


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    mp4 = Path(args[0]) if args else ROOT / 'out' / 'write-kit.mp4'
    rep = {'file': str(mp4.resolve().relative_to(ROOT)), 'bytes': mp4.stat().st_size}

    info = probe(mp4)
    ok = 'h264' in info['video'] and '1920x1080' in info['video'] and not info['has_audio'] and abs(info['duration'] - TL['duration']) < 0.2
    rep['streams'] = {'pass': ok, **info, 'timeline_duration': TL['duration']}

    from playwright.sync_api import sync_playwright
    from frames import open_page
    rng = np.random.default_rng(7)
    times = sorted(float(round(t * 30) / 30) for t in rng.uniform(2, TL['duration'] - 3, 16))
    psnr = []
    with sync_playwright() as pw:
        browser, page = open_page(pw)
        for t in times:
            page.evaluate('t => Film.seek(t)', t)
            fresh = np.asarray(Image.open(io.BytesIO(page.screenshot(type='png'))).convert('RGB'), dtype=np.float32)
            mse = float(np.mean((fresh - frame_from(mp4, t)) ** 2))
            psnr.append(round(10 * np.log10(255 ** 2 / max(mse, 1e-6)), 1))
        browser.close()
    rep['fidelity'] = {'pass': min(psnr) >= 32, 'min_psnr_db': min(psnr), 'samples': dict(zip([round(t, 2) for t in times], psnr))}

    w, h = 320, 180
    raw = subprocess.run([FF, '-v', 'error', '-i', str(mp4), '-vf', f'fps=2,scale={w}:{h},format=gray', '-f', 'rawvideo', 'pipe:1'], capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, dtype=np.uint8).reshape(-1, h, w).astype(np.int16)
    diff = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
    still, run = [], 0
    for i, d in enumerate(diff):
        if d < 0.02: run += 1
        else:
            if run >= 12: still.append({'from': round((i - run) / 2, 1), 'seconds': run / 2})
            run = 0
    if run >= 12: still.append({'from': round((len(diff) - run) / 2, 1), 'seconds': run / 2})
    hold = next(x for x in TL['segments'] if x['id'] == 'end')
    unexpected = [x for x in still if not (x['from'] >= hold['start'] - 2.0 and x['seconds'] <= 8)]
    rep['motion'] = {'pass': not unexpected, 'still_stretches': still, 'intended_hold_in': 'end'}
    flat = [round(i / 2, 1) for i, f in enumerate(fr) if f.std() < 1.5 and 0.5 < i / 2 < TL['duration'] - 0.5]
    rep['blank'] = {'pass': not flat, 'flat_frames_at': flat[:40]}

    if (ROOT / 'out' / 'screen-text.json').exists():
        rep['reading'], rep['size'] = reading()
    else:
        rep['reading'] = rep['size'] = {'pass': None, 'error': 'run build/screen_text.py first'}

    (ROOT / 'out' / 'check-report.json').write_text(json.dumps(rep, ensure_ascii=False, indent=1, default=lambda o: o.item() if hasattr(o, 'item') else str(o)))
    for k, v in rep.items():
        if isinstance(v, dict) and 'pass' in v:
            print(f"{k:10s} {'PASS' if v['pass'] else ('SKIP' if v['pass'] is None else 'FAIL')}")
    print(json.dumps({k: rep[k] for k in ('fidelity', 'motion', 'blank', 'reading', 'size')}, ensure_ascii=False, default=lambda o: o.item() if hasattr(o, 'item') else str(o))[:3000])


if __name__ == '__main__':
    main()
