"""Checks on a rendered assembly. Each check has a way to fail; results go to verification/check-<a>.json.

  python3 build/check.py ep01 [--no-listen]

  streams     H.264 1920×1080 video, AAC audio, a subtitle track and the chapters; durations match the timeline
  fidelity    frames decoded from the file match fresh renders of the same instants (PSNR ≥ 32 dB); a compilation's
              body frames are its episodes' own (render.py cuts them), so those are compared with the episode's stage
  motion      no stretch longer than 10 s in which the picture does not change, except on the cards; holds of
              6–10 s are listed for review (how long a screen may stay is a call on its content, not a number)
  blank       no run of flat single-colour frames lasting 1 s or more, outside the opening and closing fades;
              shorter ones (a breath between scenes) are listed
  type        every text block on screen is at least 24 px (image credits 20 px), from the screen-text inventory
  ledger      every quote and source line carries claim IDs that are in research/claims.jsonl and reviewed;
              every image is in research/assets.jsonl with a status the build accepts; commentary-review uses listed
  narration   gemini-3.5-transcribe hears the script: character match rate per chapter
              (skipped without a key or with --no-listen; transcripts cached in verification/heard.json by audio hash)
  loudness    integrated loudness and true peak, from verification/mix-<a>.json
  assembly    compilation only: no intro or outro segment, one card per unit, unique chapter titles, each unit's body
              laid out exactly as in its standalone episode, and narration level steady across every join

Adapted from demos/role-baseline-film/build/check.py.
"""
import base64, difflib, hashlib, io, json, os, re, subprocess, sys, urllib.request, wave
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))
from common import ROOT, ffmpeg_path, manifest, open_page, timeline
from assemble import wav_bytes, load_jsonl

FF = ffmpeg_path()
# Years read as digits: the recogniser writes 2015 where the script says 二〇一五, which is not a misreading.
YEARS = str.maketrans('〇一二三四五六七八九', '0123456789')
norm = lambda s: re.sub(r'[〇一二三四五六七八九]{4}', lambda m: m.group(0).translate(YEARS), re.sub(r'[\W_]', '', s)).lower()
REVIEWED = {'checked', 'checked-with-limits'}


def probe(mp4):
    err = subprocess.run([FF, '-hide_banner', '-i', str(mp4)], capture_output=True, text=True).stderr
    h, m, s = re.search(r'Duration: (\d+):(\d+):([\d.]+)', err).groups()
    sub = re.search(r'Subtitle: (.*)', err)
    return {'duration': int(h) * 3600 + int(m) * 60 + float(s), 'video': re.search(r'Video: (.*)', err).group(1),
            'audio': re.search(r'Audio: (.*)', err).group(1), 'subtitle': sub.group(1) if sub else None,
            'chapters': len(re.findall(r'Chapter #', err))}


def frame_from(mp4, t):
    # seek a little before the frame's own timestamp: ffmpeg returns the first frame at or after -ss
    raw = subprocess.run([FF, '-v', 'error', '-ss', f'{max(0, t - 0.012):.3f}', '-i', str(mp4), '-map', '0:v:0', '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', 'pipe:1'], capture_output=True, check=True).stdout
    return np.asarray(Image.open(io.BytesIO(raw)).convert('RGB'), dtype=np.float32)


def transcribe(x, sr):
    body = {'model': 'gemini-3.5-transcribe',
            'input': [{'type': 'audio', 'data': base64.b64encode(wav_bytes(x, sr)).decode(), 'mime_type': 'audio/wav'}],
            'generation_config': {'transcription_config': {'mode': {'type': 'verbatim', 'timestamp_granularities': ['word']}}}}
    req = urllib.request.Request('https://generativelanguage.googleapis.com/v1beta/interactions', data=json.dumps(body).encode(),
                                 headers={'x-goog-api-key': os.environ['GEMINI_API_KEY'], 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=300) as r:
        d = json.loads(r.read())
    return ''.join(c.get('text', '') for step in d.get('steps', []) for c in step.get('content', []))


def read_wav(p):
    with wave.open(str(p)) as w:
        sr = w.getframerate(); ch = w.getnchannels()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
    return (x.reshape(-1, ch).mean(axis=1) if ch > 1 else x), sr


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    A = args[0]
    TL = timeline(A)
    mp4 = ROOT / 'out' / f'{A}.mp4'
    rep = {'assembly': A, 'file': f'out/{A}.mp4', 'bytes': mp4.stat().st_size}

    info = probe(mp4)
    ok = ('h264' in info['video'] and '1920x1080' in info['video'] and 'aac' in info['audio'] and info['subtitle'] is not None
          and info['chapters'] == len(TL['chapters']) and abs(info['duration'] - TL['duration']) < 0.2)
    rep['streams'] = {'pass': ok, **info, 'timeline_duration': TL['duration'], 'timeline_chapters': len(TL['chapters'])}

    from playwright.sync_api import sync_playwright
    rng = np.random.default_rng(7)
    times = sorted(float(round(t * 30) / 30) for t in rng.uniform(2, TL['duration'] - 3, 16))
    psnr = []
    # a body frame of a compilation is the episode's frame s0 + (f - b0): its start rounds to a whole frame differently in
    # the two timelines, so the compilation's own stage can be up to a frame away from what the file shows
    from render import body_sources
    spans = body_sources(TL, 30) if TL['kind'] == 'compilation' else []
    def reference(t):
        f = round(t * 30)
        for b0, b1, (path, s0) in spans:
            if b0 <= f < b1: return Path(path).stem, (s0 + f - b0) / 30
        return A, t
    with sync_playwright() as pw:
        pages = {}
        def stage(a):
            if a not in pages: pages[a] = open_page(pw, a)
            return pages[a][1]
        for t in times:
            a, ts = reference(t)
            page = stage(a)
            page.evaluate('t => Film.seek(t)', ts)
            fresh = np.asarray(Image.open(io.BytesIO(page.screenshot(type='png'))).convert('RGB'), dtype=np.float32)
            mse = float(np.mean((fresh - frame_from(mp4, t)) ** 2))
            psnr.append(round(10 * np.log10(255 ** 2 / max(mse, 1e-6)), 1))
        used = stage(A).evaluate("({claims: [...Film.used.claims], assets: [...Film.used.assets], "
                                 "untagged: [...document.querySelectorAll('.source, .kq')].filter(e => !e.dataset.claim && e.textContent.trim()).map(e => e.textContent.trim().slice(0, 60))})")
        for browser, _ in pages.values(): browser.close()
    rep['fidelity'] = {'pass': min(psnr) >= 32, 'min_psnr_db': min(psnr), 'samples': dict(zip([round(t, 2) for t in times], psnr))}

    w, h = 320, 180     # motion and blank frames, at 2 frames per second
    raw = subprocess.run([FF, '-v', 'error', '-i', str(mp4), '-map', '0:v:0', '-vf', f'fps=2,scale={w}:{h},format=gray', '-f', 'rawvideo', 'pipe:1'], capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, dtype=np.uint8).reshape(-1, h, w).astype(np.int16)
    diff = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
    def runs(flags):                     # (first sample, length) of each run of True
        out, n = [], 0
        for i, f in enumerate(list(flags) + [False]):
            if f: n += 1
            elif n: out.append((i - n, n)); n = 0
        return out
    still = [{'from': i / 2, 'seconds': n / 2} for i, n in runs(diff < 0.02) if n >= 12]
    holds = [b for b in TL['blocks'] if b['type'] in ('ident', 'title', 'card', 'end')]
    inside = lambda x: any(b['start'] - 1.0 <= x['from'] and x['from'] + x['seconds'] <= b['end'] + 1.5 for b in holds)
    body = [x for x in still if not inside(x)]
    dead = [x for x in body if x['seconds'] > 10]
    rep['motion'] = {'pass': not dead, 'dead_picture': dead, 'holds_to_review': [x for x in body if x['seconds'] <= 10]}
    flat = [{'from': i / 2, 'seconds': n / 2} for i, n in runs(f.std() < 1.5 for f in fr) if 1.5 < i / 2 < TL['duration'] - 1.5]
    long_flat = [x for x in flat if x['seconds'] >= 1.0]
    rep['blank'] = {'pass': not long_flat, 'blank_runs': long_flat, 'breaths': [x for x in flat if x['seconds'] < 1.0]}

    inv_p = ROOT / 'verification' / f'screen-text-{A}.json'
    if inv_p.exists():
        inv = json.loads(inv_p.read_text())
        small = [{'text': e['text'][:40], 'px': e['px'], 'cls': e['cls'], 'at': e['first']} for e in inv
                 if e['px'] < (20 if 'kfig-credit' in e['cls'] else 24)]
        rep['type'] = {'pass': not small, 'blocks': len(inv), 'too_small': small[:30]}
    else:
        rep['type'] = {'pass': None, 'error': 'run build/screen_text.py first'}

    claims = {c['claim_id']: c for c in load_jsonl(ROOT / 'research' / 'claims.jsonl')}
    assets = {a['asset_id']: a for a in load_jsonl(ROOT / 'research' / 'assets.jsonl')}
    bad_c = [c for c in used['claims'] if c not in claims or claims[c].get('review_state') not in REVIEWED]
    bad_a = [a for a in used['assets'] if a not in assets or assets[a].get('rights_status') not in ('approved', 'commentary-review')]
    pending = [{'asset': a, 'title': assets[a].get('title'), 'use': assets[a].get('allowed_uses')} for a in used['assets']
               if a in assets and assets[a].get('rights_status') == 'commentary-review']
    rep['ledger'] = {'pass': not bad_c and not bad_a and not used['untagged'], 'claims_on_screen': len(used['claims']),
                     'assets_on_screen': len(used['assets']), 'unreviewed_or_unknown_claims': bad_c, 'refused_assets': bad_a,
                     'untagged_quotes_or_sources': used['untagged'], 'commentary_review_pending_owner': pending}

    if os.environ.get('GEMINI_API_KEY') and '--no-listen' not in sys.argv:
        x, sr = read_wav(ROOT / 'out' / f'{A}.narration.wav')
        from scipy.signal import resample_poly
        chs = TL['chapters'] + [{'t': TL['duration'], 'title': 'end'}]
        res = {}
        cache_path = ROOT / 'verification' / 'heard.json'
        cache = json.loads(cache_path.read_text()) if cache_path.exists() else {}
        try:
            for a, b in zip(chs[:-1], chs[1:]):
                clip = resample_poly(x[int(a['t'] * sr): int(b['t'] * sr)], 1, sr // 24000)
                key = hashlib.sha1(wav_bytes(clip, 24000)).hexdigest()
                if key not in cache:
                    cache[key] = transcribe(clip, 24000)
                    cache_path.write_text(json.dumps(cache, ensure_ascii=False, indent=1))
                heard = norm(cache[key]).lower()
                script = norm(''.join(s.get('text', '') for s in TL['segments'] if a['t'] <= s['start'] < b['t'])).lower()
                sm = difflib.SequenceMatcher(None, script, heard, autojunk=False)
                wrong = [(script[i1:i2], heard[j1:j2]) for tag, i1, i2, j1, j2 in sm.get_opcodes() if tag != 'equal']
                res[a['title']] = {'match': round(sm.ratio(), 3), 'differences': wrong[:30]}
            rep['narration'] = {'pass': min(v['match'] for v in res.values()) >= 0.9, 'by_chapter': res,
                                'note': 'The recogniser picks its own homophones and writes some numbers and names its own way; read the differences before calling one a misreading.'}
        except Exception as e:
            rep['narration'] = {'pass': None, 'error': str(e)[:300]}
    else:
        rep['narration'] = {'pass': None, 'error': 'not run'}

    mr = ROOT / 'verification' / f'mix-{A}.json'
    if mr.exists():
        m = json.loads(mr.read_text())
        rep['loudness'] = {'pass': -16.5 <= m['integrated_lufs'] <= -13.5 and m['true_peak_dbfs'] <= -1.0 and m['clipped_samples'] == 0, **m}

    if TL['kind'] == 'compilation':
        man = manifest()
        problems = []
        if any(s['role'] in ('intro', 'outro') for s in TL['segments']):
            problems.append('intro or outro segment in the compilation')
        for u in TL['units']:
            if sum(1 for b in TL['blocks'] if b['type'] == 'card' and b['unit'] == u['id']) != 1:
                problems.append(f"unit {u['id']}: not exactly one card")
        titles = [c['title'] for c in TL['chapters']]
        if len(set(titles)) != len(titles): problems.append('duplicate chapter titles')
        same = {}
        for u in TL['units']:
            ep = next((n for n, a in man['assemblies'].items() if a['kind'] == 'standalone' and a['units'] == [u['id']]), None)
            if not ep or not (ROOT / 'assembly' / 'timelines' / f'{ep}.json').exists():
                same[u['id']] = None; continue
            sa = [s for s in timeline(ep)['segments'] if s['unit'] == u['id'] and s['role'] == 'body']
            ca = [s for s in TL['segments'] if s['unit'] == u['id'] and s['role'] == 'body']
            rel = lambda ss: [(s['id'], s['text'], s['start'] - ss[0]['start'], s['end'] - ss[0]['start']) for s in ss]
            # times are stored to the millisecond at different absolute offsets, so relative times can differ by 1 ms
            same[u['id']] = len(sa) == len(ca) and all(x[:2] == y[:2] and abs(x[2] - y[2]) <= 0.002 and abs(x[3] - y[3]) <= 0.002
                                                       for x, y in zip(rel(sa), rel(ca)))
            if not same[u['id']]: problems.append(f"unit {u['id']}: body differs from its standalone episode")
        x, sr = read_wav(ROOT / 'out' / f'{A}.narration.wav')
        joins = []
        for b in TL['blocks']:
            if b['type'] != 'card': continue
            before = x[max(0, int((b['start'] - 12) * sr)): int(b['start'] * sr)]
            after = x[int(b['end'] * sr): int((b['end'] + 12) * sr)]
            lv = lambda y: 20 * np.log10(np.sqrt(np.mean(y[np.abs(y) > 0.02] ** 2)) + 1e-9) if np.any(np.abs(y) > 0.02) else None
            lb, la = lv(before), lv(after)
            if lb is not None and la is not None:
                joins.append({'card': b['id'], 'before_db': round(float(lb), 1), 'after_db': round(float(la), 1)})
                if abs(lb - la) > 3: problems.append(f"level jump of {abs(lb - la):.1f} dB around {b['id']}")
        rep['assembly'] = {'pass': not problems, 'problems': problems, 'body_matches_standalone': same, 'joins': joins}

    out = ROOT / 'verification' / f'check-{A}.json'
    out.write_text(json.dumps(rep, ensure_ascii=False, indent=1, default=lambda o: o.item() if hasattr(o, 'item') else str(o)))
    for k, v in rep.items():
        if isinstance(v, dict) and 'pass' in v:
            print(f"{k:10s} {'PASS' if v['pass'] else ('SKIP' if v['pass'] is None else 'FAIL')}")


if __name__ == '__main__':
    main()
