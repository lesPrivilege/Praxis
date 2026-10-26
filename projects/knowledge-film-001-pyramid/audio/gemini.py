"""Thin REST client for the Gemini calls this project makes. The key is read from
GEMINI_API_KEY and never printed or written anywhere."""
import base64, io, json, os, time, urllib.error, urllib.request, wave

import numpy as np

BASE = 'https://generativelanguage.googleapis.com/v1beta/models/'
TTS_MODEL = 'gemini-3.8-flash-tts'


class Quota(Exception):
    pass


def call(model, body, timeout=180, tries=3):
    req = urllib.request.Request(BASE + model + ':generateContent', data=json.dumps(body).encode(),
                                 headers={'x-goog-api-key': os.environ['GEMINI_API_KEY'], 'Content-Type': 'application/json'})
    for k in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors='replace')[:400]
            if e.code == 429:
                raise Quota(msg)
            if e.code < 500 or k == tries - 1:
                raise RuntimeError(f'{model} HTTP {e.code}: {msg}')
        except (urllib.error.URLError, TimeoutError) as e:
            if k == tries - 1:
                raise RuntimeError(f'{model}: {e}')
        time.sleep(2 * (k + 1))


def tts(text, voice, style=None):
    """Returns (float32 mono samples, sample rate)."""
    part = {'text': text}
    if style:
        part['speech_metadata'] = {'style': style}
    r = call(TTS_MODEL, {'contents': [{'role': 'user', 'parts': [part]}],
                         'generationConfig': {'responseModalities': ['AUDIO'], 'speechConfig': {'voiceConfig': {'voice': voice}}}})
    cand = r['candidates'][0]
    data = base64.b64decode(cand['content']['parts'][0]['inlineData']['data'])
    with wave.open(io.BytesIO(data)) as w:
        sr = w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
    return x, sr, cand.get('finishReason')


def wav_bytes(x, sr):
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())
    return buf.getvalue()


def listen(model, x, sr, prompt, config=None):
    """Send audio plus a text prompt to an audio-capable model; returns its text."""
    body = {'contents': [{'role': 'user', 'parts': [
        {'inlineData': {'mimeType': 'audio/wav', 'data': base64.b64encode(wav_bytes(x, sr)).decode()}},
        {'text': prompt}]}]}
    if config:
        body['generationConfig'] = config
    r = call(model, body)
    return ''.join(p.get('text', '') for p in r['candidates'][0]['content']['parts']), r
