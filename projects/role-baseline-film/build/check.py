"""Checks on the rendered film. Each check has a way to fail; results go to out/check-report.json.

  python3 build/check.py [out/role-baseline.mp4]

  streams     container has H.264 1920×1080 video and AAC audio, and their durations match the timeline
  fidelity    frames decoded from the file match fresh renders of the same instants (PSNR ≥ 32 dB)
  motion      no stretch longer than 6 s in which the picture does not change at all (the closing hold excepted)
  blank       no frame that is a single flat colour, outside the opening and closing fades
  length      the narration is at most 500 characters, punctuation included
  narration   gemini-3.5-transcribe hears the script: character match rate per chapter, numbers compared by value
              (skipped without a key or with --no-listen; transcripts are cached in out/heard.json by audio hash)
  loudness    integrated loudness and true peak, from out/mix-report.json

Adapted from demos/knowledge-film-001-pyramid-cut5/pipeline/check.py.
"""
import base64, difflib, hashlib, io, json, os, re, subprocess, sys, urllib.request, wave
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).parent))
from render import ffmpeg_path
from voice import wav_bytes

FF = ffmpeg_path()
TL = json.loads((ROOT / 'out' / 'timeline.json').read_text())
norm = lambda s: re.sub(r'[\W_]', '', s)


DIG = {'零': 0, '一': 1, '二': 2, '两': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9}
UNIT = {'十': 10, '百': 100, '千': 1000}


def cn2int(s):
    """Spoken Chinese numeral to int: 两万三 → 23000, 一万五千八 → 15800, 十五 → 15. None when it is not one number (四五百)."""
    total = section = 0
    num = last = None
    for ch in s:
        if ch in DIG:
            if num is not None: return None
            num = DIG[ch]
        elif ch == '万':
            section += num or 0
            if not section: return None
            total += section * 10000; section, num, last = 0, None, 10000
        else:
            u = UNIT[ch]
            if num is None and u != 10: return None
            section += (1 if num is None else num) * u; num, last = None, u
    if num is not None:     # a trailing digit takes the next unit down, except after 十
        section += num * (last // 10) if last and last > 10 else num
    return total + section


def digits(text):
    """The recogniser writes some numbers as digits and some as words; put both sides in digits before comparing."""
    return re.sub(r'[零一二两三四五六七八九十百千万]+', lambda m: str(v) if (v := cn2int(m.group())) is not None else m.group(), text)


def probe(mp4):
    err = subprocess.run([FF, '-hide_banner', '-i', str(mp4)], capture_output=True, text=True).stderr
    h, m, s = re.search(r'Duration: (\d+):(\d+):([\d.]+)', err).groups()
    return {'duration': int(h) * 3600 + int(m) * 60 + float(s), 'video': re.search(r'Video: (.*)', err).group(1), 'audio': re.search(r'Audio: (.*)', err).group(1)}


def frame_from(mp4, t):
    # seek a little before the frame's own timestamp: ffmpeg returns the first frame at or after -ss
    raw = subprocess.run([FF, '-v', 'error', '-ss', f'{max(0, t - 0.012):.3f}', '-i', str(mp4), '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', 'pipe:1'], capture_output=True, check=True).stdout
    return np.asarray(Image.open(io.BytesIO(raw)).convert('RGB'), dtype=np.float32)


def transcribe(x, sr):
    body = {'model': 'gemini-3.5-transcribe',
            'input': [{'type': 'audio', 'data': base64.b64encode(wav_bytes(x, sr)).decode(), 'mime_type': 'audio/wav'}],
            'generation_config': {'transcription_config': {'mode': {'type': 'verbatim', 'timestamp_granularities': ['word']}}}}
    req = urllib.request.Request('https://generativelanguage.googleapis.com/v1beta/interactions', data=json.dumps(body).encode(),
                                 headers={'x-goog-api-key': os.environ['GEMINI_API_KEY'], 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=240) as r:
        d = json.loads(r.read())
    return ''.join(c.get('text', '') for step in d.get('steps', []) for c in step.get('content', []))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    mp4 = Path(args[0]) if args else ROOT / 'out' / 'role-baseline.mp4'
    rep = {'file': str(mp4.resolve().relative_to(ROOT)), 'bytes': mp4.stat().st_size}

    info = probe(mp4)
    ok = 'h264' in info['video'] and '1920x1080' in info['video'] and 'aac' in info['audio'] and abs(info['duration'] - TL['duration']) < 0.2
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

    w, h = 320, 180     # motion and blank frames, at 2 frames per second
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
    hold = next(x for x in TL['segments'] if x['id'] == 'end')      # the closing sheet is held to be read
    unexpected = [x for x in still if not (x['from'] >= hold['start'] - 2.0 and x['seconds'] <= 8)]
    rep['motion'] = {'pass': not unexpected, 'still_stretches': still, 'intended_hold_in': 'end'}
    flat = [round(i / 2, 1) for i, f in enumerate(fr) if f.std() < 1.5 and 1.5 < i / 2 < TL['duration'] - 1.5]
    rep['blank'] = {'pass': not flat, 'flat_frames_at': flat[:40]}

    n = len(''.join(s.get('text', '') for s in TL['segments']))
    rep['length'] = {'pass': n <= 500, 'characters_with_punctuation': n, 'limit': 500}

    if os.environ.get('GEMINI_API_KEY') and '--no-listen' not in sys.argv:
        with wave.open(str(ROOT / 'build' / 'narration.wav')) as wv:
            sr = wv.getframerate(); x = np.frombuffer(wv.readframes(wv.getnframes()), dtype='<i2').astype(np.float32) / 32768
        from scipy.signal import resample_poly
        chapters = TL['chapters'] + [{'t': TL['duration']}]
        res = {}
        cache_path = ROOT / 'out' / 'heard.json'
        cache = json.loads(cache_path.read_text()) if cache_path.exists() else {}
        try:
            for a, b in zip(chapters[:-1], chapters[1:]):
                clip = resample_poly(x[int(a['t'] * sr): int(b['t'] * sr)], 1, sr // 24000)
                key = hashlib.sha1(wav_bytes(clip, 24000)).hexdigest()
                if key not in cache:
                    cache[key] = transcribe(clip, 24000)
                    cache_path.write_text(json.dumps(cache, ensure_ascii=False, indent=1))
                heard = norm(digits(cache[key]))
                script = norm(digits(''.join(s.get('text', '') for s in TL['segments'] if a['t'] <= s['start'] < b['t'])))
                sm = difflib.SequenceMatcher(None, script, heard, autojunk=False)
                wrong = [(script[i1:i2], heard[j1:j2]) for tag, i1, i2, j1, j2 in sm.get_opcodes() if tag != 'equal']
                res[a['id']] = {'match': round(sm.ratio(), 3), 'heard': heard, 'differences': wrong[:25]}
            rep['narration'] = {'pass': min(v['match'] for v in res.values()) >= 0.9, 'by_chapter': res,
                                'note': 'Numbers are compared by value. The recogniser picks its own homophones; read the differences before calling one a misreading.'}
        except Exception as e:
            rep['narration'] = {'pass': None, 'error': str(e)[:300]}
    else:
        rep['narration'] = {'pass': None, 'error': 'not run'}

    mr = ROOT / 'out' / 'mix-report.json'
    if mr.exists():
        m = json.loads(mr.read_text())
        rep['loudness'] = {'pass': -16.5 <= m['integrated_lufs'] <= -13.5 and m['true_peak_dbfs'] <= -1.0 and m['clipped_samples'] == 0, **m}

    (ROOT / 'out' / 'check-report.json').write_text(json.dumps(rep, ensure_ascii=False, indent=1, default=lambda o: o.item() if hasattr(o, 'item') else str(o)))
    for k, v in rep.items():
        if isinstance(v, dict) and 'pass' in v:
            print(f"{k:10s} {'PASS' if v['pass'] else ('SKIP' if v['pass'] is None else 'FAIL')}")
    print(json.dumps({k: rep[k] for k in ('fidelity', 'motion', 'blank', 'length')}, ensure_ascii=False, default=lambda o: o.item() if hasattr(o, 'item') else str(o))[:1400])


if __name__ == '__main__':
    main()
