"""Lay out every assembly from the same narration: synthesise what is missing, then write timelines.

An assembly is a standalone episode or the compilation (series-manifest.json). Both are built
from the units' own script.json files, so the compilation reuses the episodes' body segments,
their cached audio and their scene code; only the per-episode intro and outro segments are left
out, and the compilation's own bridges (assembly/compilation-script.json) are added.

Seed TTS returns per-character times with the audio; they are matched to the script's own
characters, so every cue belongs to the script text. Paragraph audio is cached in
out/voice/<paragraph>-<hash>.wav, keyed by voice, rate and text: an unchanged paragraph is never
synthesised again, and the same paragraph sounds identical in every assembly.

  python3 build/assemble.py                 synthesise what is missing, build every assembly
  python3 build/assemble.py --plan          list paragraphs and what is cached, synthesise nothing
  python3 build/assemble.py ep01 compilation   build only these assemblies

Writes, per assembly <a>: assembly/timelines/<a>.js (the timeline for the stage), <a>.json,
<a>.vtt (cue IDs are segment IDs, shared by every assembly), and out/<a>.narration.wav.
Also episodes/<unit>/narration.md, assembly/compilation.md and verification/voice-report.json.
Adapted from demos/role-baseline-film/build/voice.py.
"""
import bisect, difflib, hashlib, io, json, re, sys, wave
from pathlib import Path

import numpy as np
from scipy.signal import resample_poly

sys.path.insert(0, str(Path(__file__).parent))

ROOT = Path(__file__).resolve().parent.parent
SR_IN, SR = 24000, 48000
VOICE_DIR = ROOT / 'out' / 'voice'
TLD = ROOT / 'assembly' / 'timelines'
norm = lambda s: re.sub(r'[\W_]', '', s)

SILENT = {'ident': 2.6, 'title': 3.2, 'card': 3.0, 'end': 7.0}
SILENT_CMP_END = 20.0


def load_json(p):
    return json.loads(Path(p).read_text())


def load_jsonl(p):
    p = Path(p)
    if not p.exists(): return []
    return [json.loads(l) for l in p.read_text().splitlines() if l.strip()]


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
        if np.sqrt(np.mean(f ** 2)) < 0.02: continue
        f = f - f.mean()
        ac = np.correlate(f, f, 'full')[win - 1:]
        lo, hi = int(sr / 400), int(sr / 60)
        k = lo + int(np.argmax(ac[lo:hi]))
        if ac[k] > 0.45 * ac[0]: out.append(sr / k)
    return float(np.median(out)) if out else 0.0


def envelope(x, sr, win=0.02):
    n = int(sr * win)
    return np.sqrt(np.convolve(x ** 2, np.ones(n) / n, 'same'))


# ---------------------------------------------------------------- what each assembly contains

MAN = load_json(ROOT / 'series-manifest.json')
UNITS = {u['id']: u for u in MAN['units']}
SCRIPTS = {}


def script(uid):
    if uid not in SCRIPTS:
        if uid == 'cmp':
            SCRIPTS[uid] = load_json(ROOT / 'assembly' / 'compilation-script.json')
        else:
            SCRIPTS[uid] = load_json(ROOT / UNITS[uid]['dir'] / 'script.json')
        for s in SCRIPTS[uid]['segments']:
            s.setdefault('unit', uid)
    return SCRIPTS[uid]


def segs(uid, role, before=None):
    out = [s for s in script(uid)['segments'] if s['role'] == role]
    if before is not None: out = [s for s in out if s.get('before') == before]
    return out


def layout(name):
    """The ordered items of an assembly: ('silent', block) or ('speech', [segments of one unit and role])."""
    a = MAN['assemblies'][name]
    items = []
    silent = lambda typ, unit=None, **kw: items.append(('silent', dict(dict(type=typ, unit=unit, seconds=SILENT[typ]), **kw)))
    speech = lambda ss: ss and items.append(('speech', ss))
    if a['kind'] == 'standalone':
        u = a['units'][0]
        silent('ident')
        speech(segs(u, 'intro'))
        silent('title', u)
        speech(segs(u, 'body'))
        speech(segs(u, 'outro'))
        silent('end', u, next=a.get('next'))
    else:
        silent('ident')
        speech(segs('cmp', 'intro'))
        for u in a['units']:
            silent('card', u)
            speech(segs('cmp', 'bridge', before=u))
            speech(segs(u, 'body'))
        speech(segs('cmp', 'outro'))
        # every source of every episode: long enough for the list to scroll at a readable pace
        silent('end', seconds=SILENT_CMP_END)
    return items


def paragraphs(ss, limit):
    """Consecutive segments of one unit and role, broken at `break` or at the length limit."""
    out, cur, n = [], [], 0
    for s in ss:
        if cur and (n + len(s['text']) > limit or s.get('break')):
            out.append(cur); cur, n = [], 0
        cur.append(s); n += len(s['text'])
    if cur: out.append(cur)
    return out


def base_of(par):
    v = MAN['voice']
    text = ''.join(s['text'] for s in par)
    h = hashlib.sha1(f"seed|{v['voice']}|{v.get('speech_rate', 0)}|{text}".encode()).hexdigest()[:10]
    return text, VOICE_DIR / f"{par[0]['id']}-{h}"


def all_paragraphs(names):
    seen, out = set(), []
    for n in names:
        for kind, it in layout(n):
            if kind != 'speech': continue
            for p in paragraphs(it, MAN['voice'].get('max_chars', 220)):
                key = base_of(p)[1].name
                if key not in seen: seen.add(key); out.append(p)
    return out


# ---------------------------------------------------------------- alignment

def char_times(script_text, asr, speech_start, speech_end):
    """Start time and duration for every character of norm(script_text)."""
    a_chars, a_t = [], []
    for w in asr['words']:
        t = norm(w['text'])
        for i, ch in enumerate(t):
            a_chars.append(ch.lower())
            a_t.append((w['s'] + (w['e'] - w['s']) * i / len(t), (w['e'] - w['s']) / len(t)))
    s_chars = [c.lower() for c in norm(script_text)]
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


def prepare(p):
    """Cut, pause-open and level one cached paragraph. Returns audio at 48 kHz and per-segment word times
    relative to the paragraph's start, plus a report row. Deterministic: the same paragraph always comes out
    the same, whichever assembly asks for it."""
    text, base = base_of(p)
    x = load_wav(f'{base}.wav')
    asr = json.loads(Path(f'{base}.json').read_text())
    env = envelope(x, SR_IN)
    loud = np.nonzero(env > 0.012)[0]
    a0, a1 = loud[0] / SR_IN, loud[-1] / SR_IN
    times, rate = char_times(text, asr, a0, a1)
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
    rel = []
    for s, (c0, c1) in zip(p, spans):
        plain = norm(s['text'])
        ws = [{'t': shift(times[c][0]) - lead, 'd': times[c][1], 'text': plain[c - c0]} for c in range(c0, c1)]
        rel.append((s, plain, ws))
    half = len(y) // 2
    report = {'paragraph': p[0]['id'], 'to': p[-1]['id'], 'chars': len(norm(text)), 'seconds': round(len(y) / SR_IN, 2),
              'chars_per_s': round(len(norm(text)) / (len(y) / SR_IN), 2), 'script_match': round(rate, 3),
              'f0_hz': round(f0_median(x, SR_IN)), 'rms_db_raw': round(20 * np.log10(rms), 1),
              'second_half_vs_first_db': round(float(20 * np.log10((np.sqrt(np.mean(y[half:] ** 2)) + 1e-9) / (np.sqrt(np.mean(y[:half] ** 2)) + 1e-9))), 1),
              'opened_pauses': len(cuts), 'untimed_speech': untimed, 'returned_text': asr['text'], 'cache': base.name}
    return y48, rel, report


# ---------------------------------------------------------------- writing an assembly

def vt(t):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"


def voiced(x, sr, thr=0.01, hop=0.01, gap=0.12):
    """Runs of voice in a levelled narration track, as (start, end) seconds; pauses shorter than `gap` are bridged."""
    n = int(sr * hop); m = len(x) // n
    on = np.sqrt((x[:m * n].reshape(m, n) ** 2).mean(1)) > thr
    runs = []
    for i in np.flatnonzero(np.diff(np.concatenate([[0], on.astype(np.int8), [0]]))):
        if not runs or len(runs[-1]) == 2: runs.append([i * hop])
        else: runs[-1].append(i * hop)
    merged = []
    for r in runs:
        if merged and r[0] - merged[-1][1] < gap: merged[-1][1] = r[1]
        else: merged.append(list(r))
    return merged


def captions(out, runs):
    """One cue per clause, timed from the characters. Cue IDs are segment IDs plus a clause number,
    the same in every assembly that contains the segment. The voice service sometimes squeezes the
    timings around an English name and starts a clause late; a cue then starts where its run of voice starts."""
    starts = [r[0] for r in runs]
    prev = 0.0
    def onset(t0):
        k = bisect.bisect_right(starts, t0) - 1
        if k >= 0 and runs[k][0] < t0 <= runs[k][1] and t0 - runs[k][0] <= 1.5 and runs[k][0] >= prev:
            return runs[k][0]
        return t0
    cues = ['WEBVTT', '']
    for s in out:
        if not s.get('text'): continue
        ci, buf, t0, n = 0, '', None, 0
        text = s['text']
        for i, ch in enumerate(text):
            if norm(ch):
                if t0 is None: t0 = s['words'][ci]['t']
                ci += 1
            buf += ch
            last = i == len(text) - 1
            if (ch in '。？！；' or (ch in '，：' and len(norm(buf)) >= 12) or last) and norm(buf):
                if not last and not norm(text[i + 1:]): continue
                end = s['words'][ci - 1]['t'] + s['words'][ci - 1]['d']
                t0, t1, prev = onset(t0), end + 0.25, end
                n += 1
                cues += [f"{s['id']}#{n}", f"{vt(t0)} --> {vt(t1)}", buf.strip('，：；。 '), '']
                buf, t0 = '', None
    return '\n'.join(cues)


def build(name, prepared):
    a = MAN['assemblies'][name]
    v = MAN['voice']
    cursor = float(MAN.get('lead', 0.6))
    track, out, blocks = [], [], []
    items = layout(name)
    for idx, (kind, it) in enumerate(items):
        if kind == 'silent':
            b = dict(it)
            bid = b['type'] if b['unit'] is None else f"{b['unit']}.{b['type']}"
            if b['type'] == 'end' and b.get('next'):
                b['nextInfo'] = {k: UNITS[b['next']][k] for k in ('no', 'title')} if b['next'] in UNITS else None
            start, end = cursor, cursor + b.pop('seconds')
            blocks.append(dict(b, id=bid, start=round(start, 3), end=round(end, 3)))
            out.append({'id': bid, 'unit': b['unit'], 'role': 'silent', 'start': round(start, 3), 'end': round(end, 3), 'plain': '', 'words': []})
            cursor = end + 0.35
            continue
        first = True
        pars = paragraphs(it, v.get('max_chars', 220))
        for p in pars:
            y48, rel, _ = prepared[base_of(p)[1].name]
            start = cursor
            track.append((int(start * SR), y48))
            for s, plain, ws in rel:
                ws = [{'t': round(start + w['t'], 3), 'd': round(w['d'], 3), 'text': w['text']} for w in ws]
                out.append({'id': s['id'], 'unit': s['unit'], 'role': s['role'], 'start': round(max(start, ws[0]['t'] - 0.03), 3),
                            'end': round(ws[-1]['t'] + ws[-1]['d'] + 0.05, 3), 'text': s['text'], 'plain': plain, 'words': ws})
            end = start + len(y48) / SR
            cursor = end + max(0.5, float(p[-1].get('gap', MAN.get('gap', 0.45))))
        seg = {s['id']: s for s in out}
        blocks.append({'type': 'speech', 'unit': it[0]['unit'], 'role': it[0]['role'], 'id': f"{it[0]['id']}…{it[-1]['id']}",
                       'start': seg[it[0]['id']]['start'], 'end': seg[it[-1]['id']]['end']})
    duration = round(cursor + float(MAN.get('tail', 0.4)), 3)

    mix = np.zeros(int(duration * SR) + SR, dtype=np.float32)
    for at, x in track: mix[at: at + len(x)] += x
    mix = mix[: int(duration * SR)]
    (ROOT / 'out').mkdir(exist_ok=True)
    TLD.mkdir(parents=True, exist_ok=True)
    (ROOT / 'out' / f'{name}.narration.wav').write_bytes(wav_bytes(mix, SR))

    by_id = {s['id']: s for s in out}
    if a['kind'] == 'standalone':
        u = a['units'][0]
        chapters = [{'title': c['title'], 't': by_id[c['at']]['start']} for c in script(u).get('chapters', [])]
    else:
        chapters = [{'title': f"{UNITS[u]['no']} {UNITS[u]['title']}", 't': by_id[f'{u}.card']['start']} for u in a['units']]
    units = [{k: UNITS[u][k] for k in ('id', 'no', 'title', 'reading', 'dir')} for u in a['units']]
    series = dict(MAN['series'])
    title = series['title_zh'] + (f" · {UNITS[a['units'][0]]['no']} {UNITS[a['units'][0]]['title']}" if a['kind'] == 'standalone' else ' · 合集')
    data = {'assembly': name, 'kind': a['kind'], 'title': title, 'voice': f"seed-tts/{v['voice']}", 'duration': duration,
            'series': series, 'units': units,
            'chapters': chapters, 'blocks': blocks, 'segments': out}
    (TLD / f'{name}.js').write_text('window.TIMELINE = ' + json.dumps(data, ensure_ascii=False) + ';\n')
    (TLD / f'{name}.json').write_text(json.dumps(data, ensure_ascii=False, indent=1))
    (TLD / f'{name}.vtt').write_text(captions(out, voiced(mix, SR)))
    return data


def narration_md(uid):
    sc = script(uid)
    at = {c['at']: c['title'] for c in sc.get('chapters', [])}
    roles = {'intro': '单集引入（合集不用）', 'body': '正文（单集与合集共用）', 'outro': '单集收尾（合集不用）', 'bridge': '合集过渡', 'cmp-intro': '合集开头'}
    if uid == 'cmp':
        md = ['# 合集过渡与开头', '', '由 `build/assemble.py` 从 `compilation-script.json` 导出，供阅读；改稿改那一份。合集的正文全部来自各单元的 script.json。', '']
    else:
        md = [f"# {UNITS[uid]['no']} {UNITS[uid]['title']} · 念白", '', '由 `build/assemble.py` 从 `script.json` 导出，供阅读；改稿改那一份。', '']
    role = None
    for s in sc['segments']:
        if s['role'] != role:
            role = s['role']; md += ['', f"## {roles.get(role, role)}", '']
        if s['id'] in at: md += [f"### {at[s['id']]}", '']
        lead = f"`{s['id']}`" + (f" 〔接在 {s['before']} 前〕" if s.get('before') else '')
        md += [f"{lead} {s['text']}", '']
    body = ''.join(s['text'] for s in sc['segments'] if s['role'] == 'body')
    allt = ''.join(s['text'] for s in sc['segments'])
    md += [f'正文 {len(body)} 字，全部 {len(allt)} 字（含标点）。', '']
    target = ROOT / ('assembly/compilation.md' if uid == 'cmp' else f"{UNITS[uid]['dir']}/narration.md")
    target.write_text('\n'.join(md))


def main():
    args = [x for x in sys.argv[1:] if not x.startswith('--')]
    names = args or list(MAN['assemblies'])
    pars = all_paragraphs(names)
    missing = [p for p in pars if not Path(f'{base_of(p)[1]}.wav').exists()]
    print(f'{len(pars)} paragraphs, {len(missing)} to synthesise')
    if '--plan' in sys.argv:
        for p in pars:
            text, base = base_of(p)
            print(('cached ' if Path(f'{base}.wav').exists() else 'MISSING'), p[0]['id'], '…', p[-1]['id'], len(text), 'chars')
        return
    if missing:
        import seed
        VOICE_DIR.mkdir(parents=True, exist_ok=True)
        rd = VOICE_DIR / 'README.md'
        if not rd.exists():
            rd.write_text('# 配音缓存\n\n`build/assemble.py` 按段落缓存的 Seed TTS 返回：音频与逐字时间。生成物，不入库；删掉后会重新合成。\n')
        v = MAN['voice']
        for p in missing:
            text, base = base_of(p)
            x, words = seed.tts(text, v['voice'], v.get('speech_rate', 0))
            if not words:
                raise SystemExit(f"Seed TTS returned no timestamps for {p[0]['id']}")
            Path(f'{base}.json').write_text(json.dumps({'text': ''.join(w['text'] for w in words), 'words': words}, ensure_ascii=False))
            Path(f'{base}.wav').write_bytes(wav_bytes(x, seed.SR))
            print('synth', p[0]['id'], '…', p[-1]['id'], len(text), 'chars', f'{len(x) / seed.SR:.1f}s', len(words), 'timed words')

    prepared, report = {}, []
    for p in pars:
        y48, rel, rep = prepare(p)
        prepared[base_of(p)[1].name] = (y48, rel, rep)
        report.append(rep)
    (ROOT / 'verification' / 'voice-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=1))
    import ledger
    ledger.export()
    for n in names:
        d = build(n, prepared)
        print(f"{n:12s} {d['duration']:7.1f}s  {len([s for s in d['segments'] if s['words']])} spoken segments")
    for uid in {u for n in names for u in MAN['assemblies'][n]['units']} | ({'cmp'} if any(MAN['assemblies'][n]['kind'] == 'compilation' for n in names) else set()):
        narration_md(uid)
    for r in report:
        flag = '' if r['script_match'] >= 0.93 and (abs(r['second_half_vs_first_db']) < 4 or r['seconds'] < 4) and not r['untimed_speech'] else f"  <-- check {r['untimed_speech'] or ''}"
        if flag: print(f"  {r['paragraph']:>8} … {r['to']:<8} {r['seconds']:6.1f}s match {r['script_match']:.3f} half {r['second_half_vs_first_db']:+.1f}dB{flag}")


if __name__ == '__main__':
    main()
