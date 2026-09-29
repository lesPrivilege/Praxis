#!/usr/bin/env python3
"""score.js → score.wav: a 120 BPM track synthesised with numpy (48 kHz stereo, seeded noise).

  python3 score.py

Every sound is generated here; no samples, no downloads. The same score.js drives the
picture, so kicks, impacts and risers line up with cuts by construction.
"""
import json
import re
import wave
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
S = json.loads(re.sub(r'^window\.VG_SCORE = |;\s*$', '', (HERE / 'score.js').read_text().strip()))
SR = 48000
N = int(S['duration'] * SR)
BEAT = 60 / S['bpm']
RNG = np.random.default_rng(20260929)
L = np.zeros(N)
R = np.zeros(N)


def section_of(t):
    for s in S['sections']:
        if s['t0'] <= t < s['t1']:
            return s['id']
    return None


def add(sig, t, pan=0.0, gain=1.0):
    i = int(round(t * SR))
    if i >= N:
        return
    sig = sig[:N - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    R[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))


def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR
    return np.clip(t / a, 0, 1) * np.exp(-t / d)


def lowpass(x, cutoff):  # one-pole lowpass
    from scipy.signal import lfilter
    a = np.exp(-2 * np.pi * cutoff / SR)
    return lfilter([1 - a], [1, -a], x)


def kick():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 42 + 110 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.16) * 1.1


def clap():
    n = int(0.25 * SR)
    x = RNG.standard_normal(n)
    x = x - lowpass(x, 900)
    e = sum(env(n, 0.001, 0.012) * (np.arange(n) >= int(k * 0.011 * SR)) for k in range(3)) + env(n, 0.001, 0.09)
    return x * e * 0.35


def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    x = RNG.standard_normal(n)
    x = x - lowpass(x, 7000)
    return x * env(n, 0.0005, 0.06 if open_ else 0.012) * 0.22


def saw(freq, n, detune=0.0):
    t = np.arange(n) / SR
    ph = (t * freq * (1 + detune)) % 1.0
    return 2 * ph - 1


def midi(m):
    return 440 * 2 ** ((m - 69) / 12)


def impact():
    n = int(2.4 * SR)
    t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(30 + 60 * np.exp(-t * 6)) / SR) * env(n, 0.001, 0.9)
    noise = RNG.standard_normal(n)
    noise = lowpass(noise, 2400) * env(n, 0.001, 0.35)
    return boom * 0.9 + noise * 0.5


def riser(dur=2.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = RNG.standard_normal(n)
    cut = 300 + 7000 * (t / dur) ** 2
    y = np.zeros(n)
    # piecewise lowpass with rising cutoff
    for k in range(0, n, 2400):
        y[k:k + 2400] = lowpass(x[k:k + 2400], cut[k])
    return y * (t / dur) ** 2 * 0.45


# ---------- arrangement ----------
# void: sub drone swell
n = int(4 * SR)
t = np.arange(n) / SR
drone = (np.sin(2 * np.pi * 36.7 * t) * 0.6 + np.sin(2 * np.pi * 73.4 * t + 0.3) * 0.15) * (t / 4) ** 1.5
add(drone, 0.0, gain=0.8)

beats = np.arange(0, S['duration'], BEAT)
for b in beats:
    sec = section_of(b)
    idx = int(round(b / BEAT))
    in_kick = S['kick']['from'] <= b < S['kick']['to']
    half = any(a <= b < z for a, z in S['kick']['half_time'])
    if in_kick and (not half or idx % 4 == 0):
        add(kick(), b, gain=0.9)
    if sec in S['clap_sections'] and idx % 2 == 1:
        add(clap(), b, pan=0.1)
    if sec in S['hat_sections']:
        add(hat(), b + BEAT / 2, pan=0.35, gain=1.0)
        add(hat(open_=(idx % 4 == 3)), b + BEAT / 4 * 3 if idx % 2 else b + BEAT / 4, pan=-0.3, gain=0.6)

# bass: one root per bar pair, eighth-note pulse, off in void/droste
bar = BEAT * 4
for k, b in enumerate(np.arange(4, 60, bar)):
    root = S['bass_roots_midi'][(k // 2) % len(S['bass_roots_midi'])]
    sec = section_of(b)
    if sec in ('droste',):
        continue
    for e in range(8):
        n = int(BEAT / 2 * SR * 0.9)
        x = saw(midi(root), n) * 0.5 + np.sin(2 * np.pi * midi(root - 12) * np.arange(n) / SR)
        x = lowpass(x, 380 + 240 * (e % 2)) * env(n, 0.004, 0.18)
        add(x, b + e * BEAT / 2, gain=0.55)

# pads: detuned saws, slow attack, per bar
for k, b in enumerate(np.arange(4, 60, bar)):
    sec = section_of(b)
    if sec not in S['pad_sections']:
        continue
    root = S['bass_roots_midi'][(k // 2) % len(S['bass_roots_midi'])] + 24
    chord = [root, root + 3, root + 7, root + 10]
    n = int(bar * SR)
    tt = np.arange(n) / SR
    x = sum(saw(midi(m), n, d) for m in chord for d in (-0.004, 0.004)) / 8
    x = lowpass(x, 1400) * np.clip(tt / 0.6, 0, 1) * np.clip((bar - tt) / 0.4, 0, 1)
    add(x, b, pan=-0.25, gain=0.35)
    add(x, b + 0.013, pan=0.25, gain=0.25)  # 13 ms offset copy widens the pad

# droste: bell arpeggio in place of bass
for k, b in enumerate(np.arange(36, 44, BEAT / 2)):
    m = [74, 77, 81, 84, 81, 77][k % 6]
    n = int(0.9 * SR)
    tt = np.arange(n) / SR
    x = (np.sin(2 * np.pi * midi(m) * tt) + 0.4 * np.sin(2 * np.pi * midi(m) * 2.76 * tt)) * env(n, 0.002, 0.35)
    add(x, b, pan=0.5 * np.sin(k), gain=0.22)

for t0 in S['impacts']:
    add(impact(), t0, gain=0.8)
    if t0 >= 4:
        add(riser(), t0 - 2.0, pan=0.0, gain=0.9)

# master: gentle glue + fade tail
mix = np.stack([L, R])
mix = np.tanh(mix * 1.1) * 0.9
tail = np.clip((S['duration'] - np.arange(N) / SR) / 1.5, 0, 1)
mix *= tail
pcm = (np.clip(mix, -1, 1).T * 32767).astype('<i2')
with wave.open(str(HERE / 'score.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
peak = float(np.abs(mix).max())
rms = float(np.sqrt((mix ** 2).mean()))
print(json.dumps({'seconds': S['duration'], 'sample_rate': SR, 'channels': 2, 'peak': round(peak, 3), 'rms': round(rms, 3)}))
