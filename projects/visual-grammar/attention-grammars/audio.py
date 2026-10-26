#!/usr/bin/env python3
"""Write the soundtrack from authored events, then listen back to it.

  python3 audio.py

1. synth: fixture.js actions → attention.wav (numpy, deterministic, self-made sounds)
2. analyse: attention.wav only → onsets by spectral flux → audio-events.js

The analysis never reads the fixture's times; it is matched against them only
afterwards, so a silent event or two events closer than the detector's minimum
gap show up as real misses instead of being papered over.
"""
import hashlib
import json
import re
import wave
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
SR = 22050
FX = json.loads(re.sub(r'^window\.VG_FIXTURE = |;\s*$', '', (HERE / 'fixture.js').read_text().strip()))
DURATION = 56.0


# ---------- 1. synth ----------
def env(n, attack=0.005, decay=0.25):
    t = np.arange(n) / SR
    a = np.clip(t / attack, 0, 1)
    return a * np.exp(-t / decay)


def tone(freqs, dur, decay=0.25, shape='sine', glide=None):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for f in freqs:
        f_t = f if glide is None else f * (glide ** (t / dur))
        phase = 2 * np.pi * np.cumsum(np.full(n, 1.0) * f_t) / SR
        wave_ = np.sin(phase) if shape == 'sine' else np.sign(np.sin(phase)) * 0.35 + np.sin(phase) * 0.4
        out += wave_
    return out / len(freqs) * env(n, decay=decay)


def noise_tick(dur=0.04):
    rng = np.random.default_rng(7)
    n = int(dur * SR)
    x = rng.standard_normal(n)
    x = np.convolve(x, np.ones(6) / 6, mode='same')
    return x * env(n, attack=0.001, decay=0.012) * 0.8


SOUNDS = {
    'create': lambda: np.concatenate([tone([660], 0.09, 0.08), tone([880], 0.16, 0.10)]),
    'tick': lambda: noise_tick(),
    'wait': lambda: tone([330, 495], 0.9, 0.45),
    'snooze': lambda: tone([520], 0.35, 0.18, glide=0.75),
    'replay': lambda: np.concatenate([tone([520], 0.06, 0.03) * 0.5, np.zeros(int(0.05 * SR)), tone([520], 0.06, 0.03) * 0.5]),
    'conflict': lambda: tone([110, 117], 0.42, 0.20, shape='buzz'),
    'resolve': lambda: tone([523.25, 659.25, 783.99], 1.1, 0.5),
    'bell': lambda: tone([990, 1487], 0.8, 0.35),
    'resume': lambda: tone([440], 0.3, 0.16, glide=1.26),
    'silent': lambda: np.zeros(1),
}


def synth():
    buf = np.zeros(int(DURATION * SR))
    for a in FX['actions']:
        s = SOUNDS[a['sound']]() * 0.5
        i = int(round(a['t'] * SR))
        buf[i:i + len(s)] += s[:len(buf) - i]
    buf = np.clip(buf, -1, 1)
    pcm = (buf * 32767).astype('<i2')
    path = HERE / 'attention.wav'
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    return path


# ---------- 2. analyse (reads the wav only) ----------
PARAMS = {'frame': 1024, 'hop': 128, 'threshold_of_max': 0.15, 'min_gap_s': 0.12, 'match_window_s': 0.05}


def analyse(path):
    with wave.open(str(path)) as w:
        sr = w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float64) / 32768
    F, H = PARAMS['frame'], PARAMS['hop']
    win = np.hanning(F)
    frames = np.lib.stride_tricks.sliding_window_view(np.pad(x, (F // 2, F)), F)[::H][: len(x) // H]
    mag = np.abs(np.fft.rfft(frames * win, axis=1))
    # linear-magnitude flux: log compression turned every decay tail into onsets
    flux = np.maximum(0, np.diff(mag, axis=0, prepend=mag[:1])).sum(axis=1)
    thr = flux.max() * PARAMS['threshold_of_max']
    onsets, last = [], -1e9
    for i in range(1, len(flux) - 1):
        t = i * H / sr
        if flux[i] > thr and flux[i] >= flux[i - 1] and flux[i] >= flux[i + 1] and t - last >= PARAMS['min_gap_s']:
            onsets.append(round(t, 4)); last = t
    # loudness envelope at 50 Hz for drawing and for the audio-driven layer
    step = sr // 50
    rms = np.sqrt(np.convolve(x ** 2, np.ones(step) / step, mode='same'))[::step]
    envelope = np.round(rms / (rms.max() + 1e-9), 3).tolist()
    return onsets, envelope, round(float(thr), 3)


def match(onsets):
    rows, used = [], set()
    for a in FX['actions']:
        best = None
        for j, o in enumerate(onsets):
            d = o - a['t']
            if j not in used and abs(d) <= PARAMS['match_window_s'] and (best is None or abs(d) < abs(best[1])):
                best = (j, d)
        if best:
            used.add(best[0])
            rows.append({'request_id': a['request_id'], 't': a['t'], 'onset': onsets[best[0]], 'offset_ms': round(best[1] * 1000, 1), 'status': 'matched'})
        else:
            why = 'authored silent' if a['sound'] == 'silent' else 'no onset within window (merged or below threshold)'
            rows.append({'request_id': a['request_id'], 't': a['t'], 'onset': None, 'offset_ms': None, 'status': 'missed', 'why': why})
    spurious = [o for j, o in enumerate(onsets) if j not in used]
    return rows, spurious


if __name__ == '__main__':
    wav = synth()
    onsets, envelope, thr = analyse(wav)
    rows, spurious = match(onsets)
    out = {
        'origin': 'audio-derived', 'source_wav': wav.name, 'wav_sha256': hashlib.sha256(wav.read_bytes()).hexdigest(),
        'sample_rate': SR, 'duration_s': DURATION, 'params': PARAMS, 'threshold': thr,
        'onsets': onsets, 'envelope_hz': 50, 'envelope': envelope, 'matches': rows, 'spurious': spurious,
        'analyser': 'numpy linear spectral flux, threshold = 0.15 × max, peak-pick with min gap; written for this demo',
    }
    (HERE / 'audio-events.js').write_text('window.VG_AUDIO = ' + json.dumps(out, ensure_ascii=False) + ';\n')
    missed = [r['request_id'] for r in rows if r['status'] == 'missed']
    print(json.dumps({'onsets': len(onsets), 'matched': sum(r['status'] == 'matched' for r in rows), 'missed': missed,
                      'spurious': spurious, 'max_abs_offset_ms': max(abs(r['offset_ms']) for r in rows if r['offset_ms'] is not None)}, ensure_ascii=False))
