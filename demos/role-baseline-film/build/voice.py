"""Narration and timeline from narration.json, synthesised with Seed TTS one paragraph per request.

Seed TTS returns per-character times with the audio; they are matched to the script's own characters,
so every cue belongs to the script text. A segment marked "break": true starts a new paragraph.
Pauses the script asks for between segments ("gap") are opened at the quietest point of the natural pause.

Writes build/narration.wav, film/timeline.js, out/timeline.json, out/narration.md, out/captions.vtt and
out/voice-report.json (rate, pitch, level and timing coverage: the checks nobody can do by ear here).
Paragraph audio is cached as build/_voice-<id>-<hash>.wav; only changed paragraphs are synthesised again.

  python3 build/voice.py            synthesise what is missing, then build
  python3 build/voice.py --plan     only print the paragraphs and what is cached

Adapted from demos/knowledge-film-001-pyramid-cut5/audio/build_voice_aligned.py (Seed backend only).
"""
import difflib, hashlib, io, json, re, sys, wave
from pathlib import Path

import numpy as np
from scipy.signal import resample_poly

sys.path.insert(0, str(Path(__file__).parent))
import seed

ROOT = Path(__file__).resolve().parent.parent
SR_IN, SR = 24000, 48000
norm = lambda s: re.sub(r'[\W_]', '', s)


def wav_bytes(x, sr):
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())
    return buf.getvalue()


def load_wav(p):
    with wave.open(str(p)) as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768


def f0_median(x, sr):
    """Median pitch of voiced frames, by autocorrelation."""
    hop, win = int(sr * 0.02), int(sr * 0.04)
    out = []
    for i in range(0, len(x) - win, hop):
        f = x[i:i + win]
        if np.sqrt(np.mean(f ** 2)) < 0.02:
            continue
        f = f - f.mean()
        ac = np.correlate(f, f, 'full')[win - 1:]
        lo, hi = int(sr / 400), int(sr / 60)
        k = lo + int(np.argmax(ac[lo:hi]))
        if ac[k] > 0.45 * ac[0]:
            out.append(sr / k)
    return float(np.median(out)) if out else 0.0


def paragraphs(cfg):
    out, cur, n = [], [], 0
    limit = cfg['seed'].get('max_chars', 200)
    for seg in cfg['segments']:
        if 'silent' in seg:
            if cur: out.append(cur); cur, n = [], 0
            out.append([seg]); continue
        if cur and (n + len(seg['text']) > limit or seg.get('break')):
            out.append(cur); cur, n = [], 0
        cur.append(seg); n += len(seg['text'])
    if cur: out.append(cur)
    return out


def base_of(par, cfg):
    g = cfg['seed']
    text = ''.join(s['text'] for s in par)
    h = hashlib.sha1(f"seed|{g['voice']}|{g.get('speech_rate', 0)}|{text}".encode()).hexdigest()[:10]
    return text, ROOT / 'build' / f"_voice-{par[0]['id']}-{h}"


def char_times(script, asr, speech_start, speech_end):
    """Start time and duration for every character of norm(script)."""
    a_chars, a_t = [], []
    for w in asr['words']:
        t = norm(w['text'])
        for i, ch in enumerate(t):
            a_chars.append(ch.lower())
            a_t.append((w['s'] + (w['e'] - w['s']) * i / len(t), (w['e'] - w['s']) / len(t)))
    s_chars = [c.lower() for c in norm(script)]
    sm = difflib.SequenceMatcher(None, s_chars, a_chars, autojunk=False)
    times = [None] * len(s_chars)
    matched = 0
    for b in sm.get_matching_blocks():
        for k in range(b.size):
            times[b.a + k] = a_t[b.b + k]; matched += 1
    i = 0
    while i < len(times):       # characters the service wrote differently: spread them between their neighbours
        if times[i] is None:
            j = i
            while j < len(times) and times[j] is None: j += 1
            t0 = times[i - 1][0] + times[i - 1][1] if i else speech_start
            t1 = times[j][0] if j < len(times) else speech_end
            step = max(0.0, t1 - t0) / (j - i)
            for k in range(i, j): times[k] = (t0 + step * (k - i), step)
            i = j
        else:
            i += 1
    last = 0.0
    for k, (t, d) in enumerate(times):  # never go backwards
        t = max(t, last); times[k] = (t, d); last = t
    return times, matched / max(1, len(s_chars))


def envelope(x, sr, win=0.02):
    n = int(sr * win)
    return np.sqrt(np.convolve(x ** 2, np.ones(n) / n, 'same'))


def main():
    cfg = json.loads((ROOT / 'narration.json').read_text())
    g = cfg['seed']
    pars = paragraphs(cfg)
    spoken = [p for p in pars if 'silent' not in p[0]]
    missing = [p for p in spoken if not Path(f'{base_of(p, cfg)[1]}.wav').exists()]
    print(f'{len(spoken)} paragraphs, {len(missing)} to synthesise')
    if '--plan' in sys.argv:
        for p in spoken:
            text, base = base_of(p, cfg)
            print(('cached ' if Path(f'{base}.wav').exists() else 'MISSING'), p[0]['id'], '…', p[-1]['id'], len(text), 'chars')
        return

    for p in missing:
        text, base = base_of(p, cfg)
        x, words = seed.tts(text, g['voice'], g.get('speech_rate', 0))
        if not words:
            raise SystemExit(f"Seed TTS returned no timestamps for {p[0]['id']}")
        Path(f'{base}.json').write_text(json.dumps({'text': ''.join(w['text'] for w in words), 'words': words}, ensure_ascii=False))
        Path(f'{base}.wav').write_bytes(wav_bytes(x, seed.SR))
        print('synth', p[0]['id'], '…', p[-1]['id'], len(text), 'chars', f'{len(x) / seed.SR:.1f}s', len(words), 'timed words')

    cursor = float(cfg.get('lead', 1.0))
    track, out, report = [], [], []
    for p in pars:
        if 'silent' in p[0]:
            s = p[0]
            out.append({'id': s['id'], 'start': round(cursor, 3), 'end': round(cursor + s['silent'], 3), 'plain': '', 'words': []})
            cursor += float(s['silent'])
            continue
        text, base = base_of(p, cfg)
        x = load_wav(f'{base}.wav')
        asr = json.loads(Path(f'{base}.json').read_text())
        env = envelope(x, SR_IN)
        loud = np.nonzero(env > 0.012)[0]
        a0, a1 = loud[0] / SR_IN, loud[-1] / SR_IN
        times, rate = char_times(text, asr, a0, a1)
        # a stretch of speech with no timed token in it means the returned times cannot be trusted there
        runs, st = [], None
        for i, v in enumerate(env > 0.012):
            if v and st is None: st = i
            if not v and st is not None:
                if i - st > 0.15 * SR_IN: runs.append([st / SR_IN, i / SR_IN])
                st = None
        if st is not None: runs.append([st / SR_IN, len(x) / SR_IN])
        merged = runs[:1]
        for r0, r1 in runs[1:]:
            if r0 - merged[-1][1] < 0.3: merged[-1][1] = r1
            else: merged.append([r0, r1])
        untimed = [(round(r0, 1), round(r1, 1)) for r0, r1 in merged if r1 - r0 > 0.5
                   and not any(r0 - 0.1 <= (w['s'] + w['e']) / 2 <= r1 + 0.1 for w in asr['words'])]

        spans, k = [], 0
        for s in p:
            n = len(norm(s['text'])); spans.append((k, k + n)); k += n
        cuts = []  # (sample, extra seconds): open up the pauses the script asks for
        for i in range(len(p) - 1):
            want = p[i].get('gap')
            tA = times[spans[i][1] - 1][0] + times[spans[i][1] - 1][1]
            tB = times[spans[i + 1][0]][0]
            lo, hi = int(min(tA, tB) * SR_IN), int(max(tA, tB) * SR_IN) + int(0.15 * SR_IN)
            lo = max(0, lo - int(0.1 * SR_IN)); hi = min(len(x) - 1, hi)
            sstar = lo + int(np.argmin(env[lo:hi + 1]))
            q0 = q1 = sstar
            while q0 > 0 and env[q0] < 0.012: q0 -= 1
            while q1 < len(x) - 1 and env[q1] < 0.012: q1 += 1
            natural = (q1 - q0) / SR_IN
            if want is not None and want > natural + 0.05:
                cuts.append((sstar, want - natural))
        pieces, prev, shift_at = [], 0, []
        for sstar, extra in cuts:
            pieces += [x[prev:sstar], np.zeros(int(extra * SR_IN), dtype=np.float32)]
            shift_at.append((sstar / SR_IN, extra)); prev = sstar
        pieces.append(x[prev:])
        y = np.concatenate(pieces)
        shift = lambda t: t + sum(e for (c, e) in shift_at if t >= c)

        lead = max(0.0, a0 - 0.05)
        y = y[int(lead * SR_IN): int((shift(a1) + 0.14) * SR_IN)]
        active = y[np.abs(y) > 0.02]
        rms = float(np.sqrt(np.mean(active ** 2))) if len(active) else 0.1
        y = y * (10 ** (-20 / 20) / rms)
        y48 = resample_poly(y, 2, 1).astype(np.float32)
        start = cursor
        track.append((int(start * SR), y48))
        for s, (c0, c1) in zip(p, spans):
            plain = norm(s['text'])
            ws = [{'t': round(start + shift(times[c][0]) - lead, 3), 'd': round(times[c][1], 3), 'text': plain[c - c0]} for c in range(c0, c1)]
            out.append({'id': s['id'], 'start': round(max(start, ws[0]['t'] - 0.03), 3), 'end': round(ws[-1]['t'] + ws[-1]['d'] + 0.05, 3),
                        'text': s['text'], 'plain': plain, 'words': ws})
        end = start + len(y48) / SR
        half = len(y) // 2
        report.append({'from': p[0]['id'], 'to': p[-1]['id'], 'chars': len(norm(text)), 'seconds': round(len(y) / SR_IN, 2),
                       'chars_per_s': round(len(norm(text)) / (len(y) / SR_IN), 2), 'script_match': round(rate, 3),
                       'f0_hz': round(f0_median(x, SR_IN)), 'rms_db_raw': round(20 * np.log10(rms), 1),
                       'second_half_vs_first_db': round(float(20 * np.log10((np.sqrt(np.mean(y[half:] ** 2)) + 1e-9) / (np.sqrt(np.mean(y[:half] ** 2)) + 1e-9))), 1),
                       'opened_pauses': len(cuts), 'untimed_speech': untimed, 'returned_text': asr['text']})
        cursor = end + max(0.5, float(p[-1].get('gap', cfg.get('gap', 0.45))))
    duration = round(cursor + float(cfg.get('tail', 1.0)), 3)

    mix = np.zeros(int(duration * SR) + SR, dtype=np.float32)
    for at, x in track:
        mix[at: at + len(x)] += x
    mix = mix[: int(duration * SR)]
    (ROOT / 'build' / 'narration.wav').write_bytes(wav_bytes(mix, SR))

    by_id = {s['id']: s for s in out}
    chapters = [{'id': c['id'], 'title': c['title'], 't': by_id[c['at']]['start']} for c in cfg['chapters']]
    data = {'voice': f"seed-tts/{g['voice']}", 'duration': duration, 'chapters': chapters, 'segments': out}
    (ROOT / 'out' / 'timeline.json').write_text(json.dumps(data, ensure_ascii=False, indent=1))
    (ROOT / 'film' / 'timeline.js').write_text('window.TIMELINE = ' + json.dumps(data, ensure_ascii=False) + ';\n')
    (ROOT / 'out' / 'voice-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=1))

    def vt(t):
        h, r = divmod(t, 3600); m, s = divmod(r, 60)
        return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"
    cues = ['WEBVTT', '']       # one cue per clause, timed from the characters
    for s in out:
        if not s.get('text'): continue
        ci, buf, t0 = 0, '', None
        text = s['text']
        for i, ch in enumerate(text):
            if norm(ch):
                if t0 is None: t0 = s['words'][ci]['t']
                ci += 1
            buf += ch
            last = i == len(text) - 1
            if (ch in '。？！；' or (ch in '，：' and len(norm(buf)) >= 12) or last) and norm(buf):
                if not last and not norm(text[i + 1:]): continue
                t1 = s['words'][ci - 1]['t'] + s['words'][ci - 1]['d'] + 0.25
                cues += [f"{vt(t0)} --> {vt(t1)}", buf.strip('，：；。 '), '']
                buf, t0 = '', None
    (ROOT / 'out' / 'captions.vtt').write_text('\n'.join(cues))

    at = {c['at']: c['title'] for c in cfg['chapters']}
    md = ['# 念白文稿', '', '由 `build/voice.py` 在每次合成时从 `narration.json` 导出，供阅读；改稿改那一份。', '']
    for s in cfg['segments']:
        if s['id'] in at: md += ['', f"## {at[s['id']]}", '']
        if s.get('text'): md += [f"`{s['id']}` {s['text']}", '']
    total = ''.join(s.get('text', '') for s in cfg['segments'])
    md += [f'共 {len(total)} 字（含标点）。', '', '返回 [成品](README.md)。', '']
    (ROOT / 'out' / 'narration.md').write_text('\n'.join(md))

    chars = sum(r['chars'] for r in report); secs = sum(r['seconds'] for r in report)
    print(f'duration {duration:.1f}s  speech {secs:.1f}s  {chars / secs:.2f} chars/s')
    for r in report:
        flag = '' if r['script_match'] >= 0.93 and abs(r['second_half_vs_first_db']) < 4 and not r['untimed_speech'] else f"  <-- check {r['untimed_speech'] or ''}"
        print(f"  {r['from']:>4} … {r['to']:<4} {r['seconds']:6.1f}s {r['chars_per_s']:.2f}c/s match {r['script_match']:.3f} f0 {r['f0_hz']}Hz half {r['second_half_vs_first_db']:+.1f}dB{flag}")
    for c in chapters:
        print(f"  {c['t']:7.2f}  {c['title']}")


if __name__ == '__main__':
    main()
