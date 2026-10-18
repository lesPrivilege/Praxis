"""Bed and final mix for one assembly.

Everything is synthesised here, so there is nothing to license: a slow pad and sparse plucks on
chord tones. The bed is laid over the whole assembly from its blocks, so the compilation gets one
continuous bed rather than episode beds joined end to end. The bed sits about 19 dB under the
voice and ducks further while it speaks. Levels are measured (EBU R128) and written to
verification/mix-<a>.json.

  python3 build/mix.py ep01        → out/ep01.mix.wav (48 kHz stereo)

Adapted from demos/role-baseline-film/build/mix.py.
"""
import json, re, subprocess, sys, wave
from pathlib import Path

import numpy as np
from scipy.ndimage import maximum_filter1d, uniform_filter1d
from scipy.signal import butter, sosfilt, sosfiltfilt

sys.path.insert(0, str(Path(__file__).parent))
from common import ROOT, ffmpeg_path, timeline

A = sys.argv[1]
SR = 48000
TL = timeline(A)
DUR = TL['duration']
N = int(DUR * SR) + SR
hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)

CH = {'Dm9': [38, 45, 53, 57, 64], 'Bb': [34, 46, 53, 57, 62], 'F': [41, 48, 57, 60, 67], 'C': [36, 48, 55, 62, 64],
      'Gm7': [43, 50, 53, 58, 65], 'Am7': [45, 52, 55, 60, 64]}
P1 = ['Dm9', 'Bb', 'F', 'C']            # reflective
P2 = ['Dm9', 'Gm7', 'Dm9', 'Am7']       # unsettled
P3 = ['F', 'C', 'Dm9', 'Bb']            # resolved

music = np.zeros((N, 2), dtype=np.float32)


def add(buf, at, x, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or i + len(x) <= 0: return
    if i < 0: x = x[-i:]; i = 0
    x = x[: N - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    if x.ndim == 1:
        buf[i:i + len(x), 0] += x * gain * l * 1.414; buf[i:i + len(x), 1] += x * gain * r * 1.414
    else:
        buf[i:i + len(x)] += x * gain


def pad_note(f, dur, attack=2.2, release=3.2):
    n = int((dur + release) * SR); t = np.arange(n) / SR
    env = np.minimum(1, t / attack) * np.minimum(1, np.maximum(0, (dur + release - t) / release))
    env = env ** 1.5
    out = np.zeros((n, 2), dtype=np.float32)
    for ch, det in ((0, 0.9985), (1, 1.0015)):
        w = np.zeros(n)
        for h, a in ((1, 1.0), (2, 0.22), (3, 0.07)):
            w += a * np.sin(2 * np.pi * f * det * h * t + h * 1.3 + ch)
        w *= 1 + 0.12 * np.sin(2 * np.pi * 0.11 * t + f)
        out[:, ch] = w * env
    return out


def pluck(f, dur=4.5):
    n = int(dur * SR); t = np.arange(n) / SR
    w = np.zeros(n)
    for h in range(1, 7):
        fh = f * h * (1 + 0.0004 * h * h)
        w += (1 / h ** 1.7) * np.sin(2 * np.pi * fh * t) * np.exp(-t / (1.5 / h ** 0.7))
    w *= np.minimum(1, t / 0.012)
    return w.astype(np.float32)


def section(t0, t1, prog, pad=1.0, plucks=0.0, bar=8.0, seed=0):
    rng = np.random.default_rng(seed + int(t0 * 10))
    t, k = t0, 0
    while t < t1 - 0.5:
        d = min(bar, t1 - t)
        notes = CH[prog[k % len(prog)]]
        for m in notes:
            add(music, t, pad_note(hz(m), d), 0.05 * pad * (0.8 if m > 55 else 1.0))
        if plucks:
            tones = [m + 12 for m in notes[2:]] + [notes[-1] + 12]
            tt = t + 0.5
            while tt < t + d - 1.0:
                if rng.random() < plucks:
                    m = tones[int(rng.integers(len(tones)))]
                    add(music, tt, pluck(hz(m)), 0.085 * (0.7 + 0.3 * rng.random()), pan=float(rng.uniform(-0.45, 0.45)))
                tt += 2.0
        t += d; k += 1


# ---- the plan: one section per block, chords chosen by role; units take turns between two reflective progressions
PROG = {'ident': P1, 'title': P1, 'card': P1, 'intro': P1, 'outro': P3, 'end': P3, 'bridge': P1}
order = [u['id'] for u in TL['units']]
blocks = TL['blocks']
for i, b in enumerate(blocks):
    t0 = 0.2 if i == 0 else b['start']
    t1 = blocks[i + 1]['start'] if i + 1 < len(blocks) else DUR - 1.5
    if t1 - t0 < 0.5: continue
    role = b['type'] if b['type'] != 'speech' else b['role']
    if role == 'body':
        prog = P1 if order.index(b['unit']) % 2 == 0 else P2
    else:
        prog = PROG.get(role, P1)
    plucks = 0.0 if b['type'] in ('ident', 'title', 'card', 'end') else 0.35
    section(t0, t1, prog, pad=1.0, plucks=plucks, seed=i + 1)

# ---- voice
with wave.open(str(ROOT / 'out' / f'{A}.narration.wav')) as w:
    assert w.getframerate() == SR
    voice = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
voice = sosfiltfilt(butter(2, 70, 'highpass', fs=SR, output='sos'), voice).astype(np.float32)
active = voice[np.abs(voice) > 0.02]
voice *= 10 ** (-19 / 20) / np.sqrt(np.mean(active ** 2))


def follow(x, hold=0.005, smooth=0.03):
    """Peak envelope: hold the maximum, then smooth."""
    return uniform_filter1d(maximum_filter1d(np.abs(x), int(hold * SR)), int(smooth * SR))


# gentle compression, 3:1 above −16 dBFS, so the voice can sit louder without its peaks
e = follow(voice, 0.01, 0.08)
over = np.maximum(0, 20 * np.log10(e + 1e-9) + 16)
voice *= 10 ** (-(over * (1 - 1 / 3)) / 20)

# ---- music bus: soften, then duck under the voice
music = sosfiltfilt(butter(2, [38, 5200], 'bandpass', fs=SR, output='sos'), music, axis=0).astype(np.float32)
win = int(0.35 * SR)
env = np.sqrt(np.convolve(voice ** 2, np.ones(win) / win, 'same'))
speech = np.clip(env / 0.03, 0, 1)
speech = np.convolve(speech, np.ones(int(0.6 * SR)) / int(0.6 * SR), 'same')
duck = 1.0 - 0.52 * speech                      # about −6 dB while the narrator speaks
spk = [s for s in TL['segments'] if s['words']]
REF = (int(spk[0]['start'] * SR), int(spk[min(len(spk) - 1, 3)]['end'] * SR))
mrms = np.sqrt(np.mean(music[REF[0]:REF[1]] ** 2))
music *= (10 ** (-38 / 20) / mrms)              # bed about 19 dB under the voice before ducking
music *= duck[:, None]
fade = np.ones(N); k = int(2.5 * SR); end = int(DUR * SR)
fade[end - k:end] = np.linspace(1, 0, k); fade[end:] = 0
mix = (np.stack([voice, voice], 1) + music) * fade[:, None]
mix = mix[: int(DUR * SR)]


def write(path, x):
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())


FF = ffmpeg_path()


def loudness(path):
    err = subprocess.run([FF, '-hide_banner', '-nostats', '-i', str(path), '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    tail = err[err.rfind('Summary:'):]
    i = float(re.search(r'I:\s+(-?[\d.]+) LUFS', tail).group(1))
    lra = float(re.search(r'LRA:\s+(-?[\d.]+) LU', tail).group(1))
    tp = float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', tail).group(1))
    return i, lra, tp


def limit(x, ceiling_db=-2.0):   # sample peak; inter-sample true peak comes out about 0.6 dB higher
    c = 10 ** (ceiling_db / 20)
    e = follow(np.max(np.abs(x), axis=1), 0.004, 0.012)
    return np.clip(x * np.minimum(1.0, c / (e + 1e-9))[:, None], -c, c)


out = ROOT / 'out' / f'{A}.mix.wav'
gain = 1.0
for _ in range(3):                              # integrated −15 LUFS, sample peaks held under −2 dBFS
    y = limit(mix * gain)
    write(out, y)
    i0, lra, tp0 = loudness(out)
    if abs(-15.0 - i0) < 0.3: break
    gain *= 10 ** ((-15.0 - i0) / 20)
mix = y
i1, lra1, tp1 = loudness(out)
vr = 20 * np.log10(np.sqrt(np.mean((voice[np.abs(voice) > 0.02] * gain) ** 2)))
mr = 20 * np.log10(np.sqrt(np.mean((music[REF[0]:REF[1]] * gain) ** 2)) + 1e-9)
report = {'integrated_lufs': i1, 'loudness_range_lu': lra1, 'true_peak_dbfs': tp1, 'voice_rms_dbfs_active': round(float(vr), 1),
          'music_rms_dbfs_under_speech': round(float(mr), 1), 'voice_minus_music_db': round(float(vr - mr), 1), 'duration_s': DUR,
          'clipped_samples': int(np.sum(np.abs(mix) >= 1.0))}
(ROOT / 'verification' / f'mix-{A}.json').write_text(json.dumps(report, indent=1))
print(report)
