"""Synthesize the soundtrack from timeline.json -> public/score.wav (48 kHz stereo, 16-bit).

Chords come from music.chords (one per bar), pulse density from music.sections, and every
sound event from the same beat events the film draws, so cuts, actions and sound share one clock.
Uses numpy only.
"""
import json
import wave
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
TL = json.loads((HERE / 'timeline.json').read_text())
META, MUSIC = TL['meta'], TL['music']
SR = 48000
DUR = META['duration']
BEAT = 60 / META['bpm']
BAR = BEAT * META['beats_per_bar']
N = int(DUR * SR)
rng = np.random.default_rng(7)

PC = {'C': 0, 'C#': 1, 'D': 2, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'Ab': 8, 'A': 9, 'Bb': 10, 'B': 11}
QUAL = {'': [0, 4, 7], 'add9': [0, 4, 7, 14], 'm7': [0, 3, 7, 10], 'maj7': [0, 4, 7, 11], 'm6': [0, 3, 7, 9],
        'sus4': [0, 5, 7], '7sus4': [0, 5, 7, 10], 'maj9': [0, 4, 7, 11, 14]}


def parse(ch):
    name, _, slash = ch.partition('/')
    root = name[:2] if len(name) > 1 and name[1] in '#b' else name[:1]
    tones = QUAL[name[len(root):]]
    bass = PC[slash] if slash else PC[root]
    return PC[root], tones, bass


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def pad_voicing(root, tones):
    notes = []
    for iv in tones:
        m = 50 + (root + iv - 50) % 12 + (12 if iv >= 12 else 0)
        notes.append(m if m <= 76 else m - 12)
    return sorted(set(notes))


out = np.zeros(N)


def add(sig, t0):
    i = int(t0 * SR)
    if i >= N:
        return
    sig = sig[:N - i]
    out[i:i + len(sig)] += sig


def env_adsr(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na)
    e[n - nr:] *= np.linspace(1, 0, nr)
    return e


def pad(m, length, amp):
    t = np.arange(int(length * SR)) / SR
    f = hz(m)
    s = sum(np.sin(2 * np.pi * f * 2 ** (c / 1200) * t + ph) for c, ph in ((-5, 0), (0, 1.3), (5, 2.1))) / 3
    s += 0.12 * np.sin(2 * np.pi * 2 * f * t)
    s *= 1 + 0.08 * np.sin(2 * np.pi * 0.2 * t)
    return amp * s * env_adsr(len(t), 0.9, 1.6)


def mallet(m, amp, decay=0.45):
    t = np.arange(int((decay * 4) * SR)) / SR
    f = hz(m)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t / decay) + 0.25 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t / (decay / 6))
    s[:96] *= np.linspace(0, 1, 96)
    return amp * s


def bell(m, amp):
    t = np.arange(int(4.5 * SR)) / SR
    f = hz(m)
    s = sum(w * np.sin(2 * np.pi * f * r * t) * np.exp(-t / d) for r, w, d in ((1, 1, 2.2), (2.76, 0.35, 0.9), (5.4, 0.15, 0.4), (8.93, 0.06, 0.2)))
    s[:48] *= np.linspace(0, 1, 48)
    return amp * s


def thud(f0, f1, length, amp):
    t = np.arange(int(length * 2 * SR)) / SR
    f = f1 + (f0 - f1) * np.exp(-t / (length / 3))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / length)
    s[:48] *= np.linspace(0, 1, 48)
    return amp * s


chords = [parse(c) for c in MUSIC['chords']]
bars = len(chords)
assert abs(bars * BAR - DUR) < 1e-6, 'chord list must cover the film exactly'


def section(bar):
    for s in MUSIC['sections']:
        if s['bars'][0] <= bar <= s['bars'][1]:
            return s
    raise ValueError(bar)


def chord_at(t):
    return chords[min(bars - 1, int(t / BAR))]


# harmony: one pad per run of identical chords (the last run rings to the end), bass from bar 3
names = MUSIC['chords']
for b, (root, tones, bass) in enumerate(chords):
    if b > 0 and names[b] == names[b - 1]:
        continue
    run = next((k for k in range(b + 1, bars) if names[k] != names[b]), bars) - b
    t0 = b * BAR
    length = DUR - t0 if b + run == bars else run * BAR + 1.2
    reveal = b == 18
    for m in pad_voicing(root, tones):
        add(pad(m, length, 0.075 if reveal else 0.05), t0)
    if b >= 3:
        add(pad(36 + bass if bass >= 2 else 48 + bass, min(length, run * BAR + 0.6), 0.11), t0)
    if reveal:
        add(pad(pad_voicing(root, tones)[-1] + 12, BAR * 2, 0.03), t0)

# pulse: eighth-note mallet arpeggio, density from section; silent for the reveal bar and the last two bars
for k in range(int(DUR / (BEAT / 2))):
    t0 = k * BEAT / 2
    bar = int(t0 / BAR)
    dens = section(bar)['pulse']
    if dens == 0 or bar == 18 or bar >= bars - 2:
        continue
    root, tones, _ = chords[bar]
    notes = [m + 12 for m in pad_voicing(root, tones)]
    step = k % 8
    if dens < 1 and step % 2:
        continue
    m = notes[[0, 2, 1, 3, 0, 2, 1, 3][step] % len(notes)]
    add(mallet(m, 0.035 * dens * (1.25 if step == 0 else 1), 0.3), t0)

# semantic events
cell_i = 0
for beat in TL['beats']:
    for e in beat['events']:
        kind, t0 = e.get('sound'), e['t']
        if not kind:
            continue
        root, tones, _ = chord_at(t0)
        hi = [m + 24 for m in pad_voicing(root, tones)]
        if kind == 'pop':
            add(mallet(hi[-1], 0.08, 0.5), t0)
        elif kind == 'cell':
            add(mallet(hi[cell_i % len(hi)], 0.075, 0.45), t0)
            cell_i += 1
        elif kind == 'soft':
            add(mallet(hi[1], 0.045, 0.9), t0)
        elif kind == 'low':
            add(thud(140, 70, 0.35, 0.16), t0)
        elif kind == 'drop':
            add(thud(260, 55, 0.5, 0.16), t0)
        elif kind == 'unknown':
            add(mallet(root + 72, 0.05, 1.0) + mallet(root + 73, 0.04, 1.0), t0)   # minor second: unresolved
        elif kind == 'reveal':
            add(bell(70, 0.12), t0)          # Bb4 over the borrowed Bbmaj7
            add(thud(90, 45, 0.8, 0.12), t0)
        elif kind == 'resolve':
            add(bell(74, 0.1), t0)           # D5
            for i, m in enumerate((62, 66, 69)):
                add(mallet(m + 12, 0.05, 0.8), t0 + 0.07 * i)
        else:
            raise ValueError(kind)

# room: short stereo reverb from decaying noise
ir_len = int(2.4 * SR)
decay = np.exp(-np.arange(ir_len) / SR / 0.55)
stereo = []
for ch in range(2):
    ir = rng.standard_normal(ir_len) * decay
    ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(N + ir_len)))
    wet = np.fft.irfft(np.fft.rfft(out, size) * np.fft.rfft(ir, size), size)[:N]
    stereo.append(out * 0.85 + wet * 0.32)
mix = np.stack(stereo, axis=1)

# edges and level
fade_in = int(0.2 * SR)
mix[:fade_in] *= np.linspace(0, 1, fade_in)[:, None]
end_fade = TL['beats'][-1]['events'][-1]['t']
i0 = int(end_fade * SR)
mix[i0:] *= np.linspace(1, 0, N - i0)[:, None] ** 1.5
mix *= 10 ** (-1 / 20) / np.max(np.abs(mix))

(HERE / 'public').mkdir(exist_ok=True)
with wave.open(str(HERE / 'public' / 'score.wav'), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())

rms = 20 * np.log10(np.sqrt(np.mean(mix ** 2)))
win = SR // 2
loud = [20 * np.log10(np.sqrt(np.mean(mix[i:i + win] ** 2)) + 1e-9) for i in range(0, N - win, win)]
print(f'score.wav {DUR}s, RMS {rms:.1f} dBFS, max 0.5s-window jump {max(abs(a - b) for a, b in zip(loud, loud[1:])):.1f} dB')
