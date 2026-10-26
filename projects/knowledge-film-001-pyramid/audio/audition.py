"""Voice casting. Synthesises one test passage with each candidate voice, measures what can be
measured (rate, pitch, pauses, level), and asks an audio-capable model to listen and score.
Nobody on the production side can hear; the listening model is the only ear, so its notes are
recorded as its opinion, next to the measurements.

  python3 audio/audition.py Charon Schedar ...      (results in audio/audition/)
"""
import json, re, sys, wave
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
import gemini

OUT = Path(__file__).parent / 'audition'
TEXT = ('1966年，她调到伦敦，又去了巴黎和杜塞尔多夫的办公室。'
        '同样的毛病出现在不同的语言里，那它就不是语言的毛病。'
        '明托后来说：问题出在思考，不在语言。'
        '续约率从91%掉到了82%。')
RUBRIC = ('这是一段中文知识类纪录片的旁白试音。请只听声音来判断，按 JSON 回答，不要输出别的内容：'
          '{"transcript": "逐字听写", "gender": "male/female", "age_impression": "", '
          '"naturalness": 1-10, "authority": 1-10, "warmth": 1-10, "pacing": 1-10, "clarity": 1-10, '
          '"fit_for_documentary_essay": 1-10, "mispronunciations": ["读错或读得别扭的字词"], '
          '"accent_or_artifacts": "口音、电音、杂音、音量忽大忽小等", "one_line": "一句话评价"}。'
          '评分标准：10 分是成熟的中文纪录片配音演员；5 分是能听但明显是合成音；注意数字、百分比和外国地名读得是否正确。')


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


def pauses(x, sr):
    env = np.sqrt(np.convolve(x ** 2, np.ones(int(sr * 0.02)) / int(sr * 0.02), 'same'))
    quiet = env < 0.01
    runs, n = [], 0
    for q in quiet:
        if q: n += 1
        else:
            if n > sr * 0.18: runs.append(n / sr)
            n = 0
    return runs


def main():
    OUT.mkdir(exist_ok=True)
    spoken = len(re.sub(r'[，。：；、！？%\s]', '', TEXT))
    rows = []
    for voice in sys.argv[1:]:
        wav = OUT / f'{voice}.wav'
        if wav.exists():
            with wave.open(str(wav)) as w:
                sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
        else:
            x, sr, fin = gemini.tts(TEXT, voice)
            wav.write_bytes(gemini.wav_bytes(x, sr))
        loud = np.nonzero(np.abs(x) > 0.01)[0]
        dur = (loud[-1] - loud[0]) / sr
        ps = pauses(x[loud[0]:loud[-1]], sr)
        row = {'voice': voice, 'seconds': round(dur, 2), 'chars_per_s': round(spoken / dur, 2), 'f0_hz': round(f0_median(x, sr)),
               'pauses': len(ps), 'pause_total': round(sum(ps), 2), 'rms_db': round(float(20 * np.log10(np.sqrt(np.mean(x[loud[0]:loud[-1]] ** 2)))), 1),
               'peak_db': round(float(20 * np.log10(np.abs(x).max())), 1)}
        note = OUT / f'{voice}.json'
        if note.exists():
            row['ear'] = json.loads(note.read_text())
        else:
            try:
                txt, _ = gemini.listen('gemini-3.8-flash', x, sr, RUBRIC, {'responseMimeType': 'application/json', 'temperature': 0})
                row['ear'] = json.loads(txt)
                note.write_text(json.dumps(row['ear'], ensure_ascii=False, indent=1))
            except Exception as e:
                row['ear'] = {'error': str(e)[:200]}
        rows.append(row)
        e = row['ear']
        print(f"{voice:14s} {row['seconds']:5.1f}s {row['chars_per_s']:.2f}c/s f0 {row['f0_hz']:3d}Hz pauses {row['pauses']} ({row['pause_total']}s) rms {row['rms_db']}dB | "
              f"{e.get('gender','?')} nat {e.get('naturalness')} auth {e.get('authority')} warm {e.get('warmth')} pace {e.get('pacing')} fit {e.get('fit_for_documentary_essay')} | {e.get('one_line', e.get('error',''))}")
        if e.get('mispronunciations'): print('   mis:', e['mispronunciations'], '|', e.get('accent_or_artifacts'))
        if e.get('transcript'): print('   heard:', e['transcript'])
    (OUT / 'results.json').write_text(json.dumps(rows, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
