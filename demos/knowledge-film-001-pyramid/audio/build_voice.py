"""Narration and timeline.

Reads script/narration.json, synthesises each spoken segment (cached by text, voice and rate),
lays the segments on one track, and writes:
  audio/narration.wav       48 kHz mono
  film/data/timeline.js     cue times the scenes are written against
  script/timeline.json      the same data for tools
  out/captions.vtt          captions cut at the script's own segment boundaries

Run from the project root:
  uv run --with edge-tts --with imageio-ffmpeg --with numpy python audio/build_voice.py
"""
import asyncio, hashlib, json, subprocess, sys, wave
from pathlib import Path

import edge_tts
import imageio_ffmpeg
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
VOICE_DIR = ROOT / 'audio' / 'voice'


def key(seg, cfg):
    text = seg.get('tts') or seg['text']
    h = hashlib.sha1(f"{cfg['voice']}|{cfg['rate']}|{text}".encode()).hexdigest()[:10]
    return text, VOICE_DIR / f"{seg['id'].replace('.', '_')}-{h}"


async def synth(seg, cfg, sem):
    text, base = key(seg, cfg)
    if Path(f'{base}.mp3').exists() and Path(f'{base}.json').exists():
        return
    async with sem:
        for attempt in range(4):
            try:
                com = edge_tts.Communicate(text, cfg['voice'], rate=cfg['rate'], boundary='WordBoundary')
                audio, words = bytearray(), []
                async for ch in com.stream():
                    if ch['type'] == 'audio':
                        audio.extend(ch['data'])
                    elif ch['type'] == 'WordBoundary':
                        words.append({'o': ch['offset'] / 1e7, 'd': ch['duration'] / 1e7, 'text': ch['text']})
                if not audio:
                    raise RuntimeError('no audio')
                Path(f'{base}.mp3').write_bytes(bytes(audio))
                Path(f'{base}.json').write_text(json.dumps(words, ensure_ascii=False))
                print('synth', seg['id'], len(text), 'chars')
                return
            except Exception as e:  # network hiccups: retry, then fail loudly
                print('retry', seg['id'], e, file=sys.stderr)
                await asyncio.sleep(1.5 * (attempt + 1))
        raise SystemExit(f"could not synthesise {seg['id']}")


def decode(mp3):
    raw = subprocess.run([FFMPEG, '-v', 'error', '-i', str(mp3), '-f', 'f32le', '-ac', '1', '-ar', str(SR), 'pipe:1'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def trim_tail(x, keep=0.14):
    loud = np.nonzero(np.abs(x) > 0.004)[0]
    if len(loud) == 0:
        return x
    return x[: min(len(x), loud[-1] + int(keep * SR))]


def vtt_time(t):
    h, r = divmod(t, 3600)
    m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"


def main():
    cfg = json.loads((ROOT / 'script' / 'narration.json').read_text())
    VOICE_DIR.mkdir(parents=True, exist_ok=True)
    spoken = [s for s in cfg['segments'] if 'text' in s]

    async def run():
        sem = asyncio.Semaphore(3)
        await asyncio.gather(*(synth(s, cfg, sem) for s in spoken))
    asyncio.run(run())

    cursor = float(cfg.get('lead', 1.0))
    track, out = [], []
    for seg in cfg['segments']:
        cursor += float(seg.get('pre', 0))
        if 'silent' in seg:
            out.append({'id': seg['id'], 'start': round(cursor, 3), 'end': round(cursor + seg['silent'], 3), 'plain': '', 'words': []})
            cursor += float(seg['silent'])
            continue
        _, base = key(seg, cfg)
        x = trim_tail(decode(Path(f'{base}.mp3')))
        words = json.loads(Path(f'{base}.json').read_text())
        start = cursor
        track.append((int(start * SR), x))
        end = start + len(x) / SR
        out.append({
            'id': seg['id'], 'start': round(start, 3), 'end': round(end, 3), 'text': seg['text'],
            'plain': ''.join(w['text'] for w in words),
            'words': [{'t': round(start + w['o'], 3), 'd': round(w['d'], 3), 'text': w['text']} for w in words],
        })
        cursor = end + float(seg.get('gap', cfg.get('gap', 0.38)))
    duration = round(cursor + float(cfg.get('tail', 1.0)), 3)

    mix = np.zeros(int(duration * SR) + SR, dtype=np.float32)
    for at, x in track:
        mix[at: at + len(x)] += x
    mix = mix[: int(duration * SR)]
    with wave.open(str(ROOT / 'audio' / 'narration.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype('<i2').tobytes())

    by_id = {s['id']: s for s in out}
    chapters = [{'id': c['id'], 'title': c['title'], 't': by_id[c['at']]['start']} for c in cfg['chapters'] if c['at'] in by_id]
    data = {'voice': cfg['voice'], 'rate': cfg['rate'], 'duration': duration, 'chapters': chapters, 'segments': out}
    (ROOT / 'script' / 'timeline.json').write_text(json.dumps(data, ensure_ascii=False, indent=1))
    tmp = ROOT / 'film' / 'data' / 'timeline.js.tmp'
    tmp.write_text('window.TIMELINE = ' + json.dumps(data, ensure_ascii=False) + ';\n')
    tmp.replace(ROOT / 'film' / 'data' / 'timeline.js')

    (ROOT / 'out').mkdir(exist_ok=True)
    cues = ['WEBVTT', '']
    for s in out:
        if s.get('text'):
            cues += [f"{vtt_time(s['start'])} --> {vtt_time(s['end'])}", s['text'], '']
    (ROOT / 'out' / 'captions.vtt').write_text('\n'.join(cues))

    chars = sum(len(s.get('plain', '')) for s in out)
    speech = sum(s['end'] - s['start'] for s in out if s.get('text'))
    print(f"duration {duration:.1f}s  segments {len(out)}  spoken chars {chars}  speech {speech:.1f}s  {chars / speech:.2f} chars/s")
    for c in chapters:
        print(f"  {c['t']:7.2f}  {c['title']}")


if __name__ == '__main__':
    main()
