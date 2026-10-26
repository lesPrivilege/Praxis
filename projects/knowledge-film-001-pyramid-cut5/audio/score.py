"""Score and final mix.

Everything is synthesised here, so there is nothing to license: a slow pad, sparse felt-piano
plucks on chord tones, a muted pulse under the pile of material, low hits and soft noise swells
at the chapter cards. Sections follow the narration cues in script/timeline.json, so the score
moves with the film when the voice is rebuilt.

Nobody on the production side can hear, so the writing is deliberately conservative: consonant
chord tones only, slow envelopes, music about 20 dB under the voice and ducked further while it
speaks. Levels are measured (EBU R128) and written to audio/mix-report.json.

  python3 audio/score.py        → audio/mix.wav (48 kHz stereo)
"""
import json, re, subprocess, wave
from pathlib import Path

import numpy as np
from scipy.ndimage import maximum_filter1d, uniform_filter1d
from scipy.signal import butter, sosfilt, sosfiltfilt

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
TL = json.loads((ROOT / 'script' / 'timeline.json').read_text())
SEG = {s['id']: s for s in TL['segments']}
DUR = TL['duration']
N = int(DUR * SR) + SR
T = lambda id, end=False: SEG[id]['end' if end else 'start']
hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)

CH = {
    'Dm9': [38, 45, 53, 57, 64], 'Bb': [34, 46, 53, 57, 62], 'F': [41, 48, 57, 60, 67], 'C': [36, 48, 55, 62, 64],
    'Gm7': [43, 50, 53, 58, 65], 'Am7': [45, 52, 55, 60, 64], 'D5': [26, 38, 45],
}
P1 = ['Dm9', 'Bb', 'F', 'C']            # reflective
P2 = ['Dm9', 'Gm7', 'Dm9', 'Am7']       # unsettled
P3 = ['F', 'C', 'Dm9', 'Bb']            # resolved
P0 = ['D5']                             # drone

music = np.zeros((N, 2), dtype=np.float32)
fx = np.zeros((N, 2), dtype=np.float32)


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


def hit():
    n = int(2.4 * SR); t = np.arange(n) / SR
    f = 46 + 30 * np.exp(-t / 0.05)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.7) * np.minimum(1, t / 0.004)).astype(np.float32)


def swell(dur=1.4, seed=1):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.random.default_rng(seed).standard_normal(n)
    x = sosfilt(butter(2, [500, 2600], 'bandpass', fs=SR, output='sos'), x)
    env = np.minimum(1, (t / (dur * 0.75)) ** 2) * np.minimum(1, np.maximum(0, (dur - t) / (dur * 0.25)))
    return (x * env).astype(np.float32)


def pulse_note(f):
    n = int(0.22 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.05) * np.minimum(1, t / 0.003)).astype(np.float32)


def section(t0, t1, prog, pad=1.0, plucks=0.0, pulse=0.0, bar=8.0, seed=0):
    rng = np.random.default_rng(seed + int(t0 * 10))
    t, k = t0, 0
    while t < t1 - 0.5:
        d = min(bar, t1 - t)
        notes = CH[prog[k % len(prog)]]
        for m in notes:
            add(music, t, pad_note(hz(m), d), 0.05 * pad * (0.8 if m > 55 else 1.0))
        if plucks:
            tones = [m + 12 for m in notes[2:]] + [notes[-1] + 24 - 12]
            tt = t + 0.5
            while tt < t + d - 1.0:
                if rng.random() < plucks:
                    m = tones[int(rng.integers(len(tones)))]
                    add(music, tt, pluck(hz(m)), 0.085 * (0.7 + 0.3 * rng.random()), pan=float(rng.uniform(-0.45, 0.45)))
                tt += 2.0
        if pulse:
            tt = t
            while tt < t + d:
                add(music, tt, pulse_note(hz(notes[1])), 0.11 * pulse, pan=0.0)
                tt += 0.625
        t += d; k += 1


# ---- the plan, in cue names
section(T('c0.2'), T('c0.6'), P0, pad=0.8)
section(T('c0.6') + 1.0, T('c0.8'), ['F', 'C'], pad=0.9, plucks=0.7, seed=1)
section(T('c0.8'), T('c0.title'), P1, pad=0.9, plucks=0.45, seed=2)
section(T('c0.title'), T('c1.card', True), ['Bb', 'Dm9'], pad=1.7, plucks=0.9, bar=4.2, seed=3)
section(T('c1.card', True), T('c2.card'), P1, pad=1.0, plucks=0.5, seed=4)
section(T('c2.card'), T('c2.5'), P1, pad=1.0, plucks=0.4, seed=5)
section(T('c2.5'), T('c2.11'), P2, pad=1.1, pulse=1.0, seed=6)
section(T('c2.11'), T('c2.19'), P3, pad=1.0, plucks=0.5, seed=7)
section(T('c2.19'), T('c3.card'), P3, pad=1.1, plucks=0.6, seed=8)
section(T('c3.card'), T('c4.card'), P1, pad=1.0, plucks=0.5, seed=9)
section(T('c4.card'), T('c4.11'), P2, pad=1.0, plucks=0.25, seed=10)
section(T('c4.11'), T('c4.17'), P0, pad=1.0)
section(T('c4.17'), T('c5.card'), P1, pad=0.9, plucks=0.3, seed=11)
section(T('c5.card'), T('c5.6'), P3, pad=1.2, plucks=0.6, seed=12)
section(T('c5.6'), DUR - 2.5, ['F', 'C', 'F'], pad=1.8, plucks=0.9, bar=4.5, seed=13)

add(fx, T('c0.title') + 0.6, hit(), 0.5)
for c in ('c1', 'c2', 'c3', 'c4', 'c5'):
    add(fx, T(c + '.card') - 0.9, swell(1.3, seed=ord(c[1])), 0.05)
    add(fx, T(c + '.card') + 0.25, hit(), 0.28)
add(fx, T('c0.6') + 1.0, pluck(hz(77)), 0.10)          # the title lands
add(fx, T('c2.19'), hit(), 0.22)                        # the top of the pyramid
add(fx, T('c5.end') + 6.2, hit(), 0.3)                  # end card

# ---- voice
with wave.open(str(ROOT / 'audio' / 'narration.wav')) as w:
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
mrms = np.sqrt(np.mean(music[int(T('c1.2') * SR): int(T('c1.8') * SR)] ** 2))
music *= (10 ** (-38 / 20) / mrms)              # bed about 19 dB under the voice before ducking
music *= duck[:, None]
fade = np.ones(N); k = int(3.0 * SR); end = int(DUR * SR)
fade[end - k:end] = np.linspace(1, 0, k); fade[end:] = 0
mix = (np.stack([voice, voice], 1) + music + fx) * fade[:, None]
mix = mix[: int(DUR * SR)]


def write(path, x):
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())


def loudness(path):
    ff = subprocess.run(['uv', 'run', '--quiet', '--with', 'imageio-ffmpeg', 'python', '-c',
                         'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'], capture_output=True, text=True, check=True).stdout.strip().splitlines()[-1]
    err = subprocess.run([ff, '-hide_banner', '-nostats', '-i', str(path), '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    tail = err[err.rfind('Summary:'):]
    i = float(re.search(r'I:\s+(-?[\d.]+) LUFS', tail).group(1))
    lra = float(re.search(r'LRA:\s+(-?[\d.]+) LU', tail).group(1))
    tp = float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', tail).group(1))
    return i, lra, tp


def limit(x, ceiling_db=-2.0):   # sample peak; inter-sample true peak comes out about 0.6 dB higher
    c = 10 ** (ceiling_db / 20)
    e = follow(np.max(np.abs(x), axis=1), 0.004, 0.012)
    return np.clip(x * np.minimum(1.0, c / (e + 1e-9))[:, None], -c, c)


out = ROOT / 'audio' / 'mix.wav'
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
a, b = int(T('c1.2') * SR), int(T('c1.8') * SR)
mr = 20 * np.log10(np.sqrt(np.mean((music[a:b] * gain) ** 2)) + 1e-9)
report = {'integrated_lufs': i1, 'loudness_range_lu': lra1, 'true_peak_dbfs': tp1, 'voice_rms_dbfs_active': round(float(vr), 1),
          'music_rms_dbfs_under_speech': round(float(mr), 1), 'voice_minus_music_db': round(float(vr - mr), 1), 'duration_s': DUR,
          'clipped_samples': int(np.sum(np.abs(mix) >= 1.0))}
(ROOT / 'audio' / 'mix-report.json').write_text(json.dumps(report, indent=1))
print(report)
