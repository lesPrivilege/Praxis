"""Client for Volcengine / BytePlus Seed TTS (V3 unidirectional HTTP), assembled from the
documented shapes in research/notes-seed-tts.md. Reads three environment variables and never
prints them:

  SEED_TTS_API_KEY       the key sent as X-Api-Key (new console), or the Access Token (legacy console)
  SEED_TTS_APP_ID        legacy console only: the App ID that goes with the Access Token
  SEED_TTS_RESOURCE_ID   e.g. seed-tts-2.0
  SEED_TTS_HOST          openspeech.bytedance.com, or voice.ap-southeast-1.bytepluses.com
"""
import base64, codecs, json, os, urllib.error, urllib.request, uuid

import numpy as np

SR = 24000


def tts(text, speaker, speech_rate=0):
    """Returns (float32 mono samples at 24 kHz, words) with words as [{'text', 's', 'e'}] in seconds."""
    host = os.environ.get('SEED_TTS_HOST', 'openspeech.bytedance.com')
    headers = {'Content-Type': 'application/json', 'X-Api-Resource-Id': os.environ.get('SEED_TTS_RESOURCE_ID', 'seed-tts-2.0'),
               'X-Api-Request-Id': str(uuid.uuid4())}
    if os.environ.get('SEED_TTS_APP_ID'):       # legacy console: App ID plus Access Token
        headers['X-Api-App-Id'] = os.environ['SEED_TTS_APP_ID']
        headers['X-Api-Access-Key'] = os.environ['SEED_TTS_API_KEY']
    else:                                       # new console: one API key
        headers['X-Api-Key'] = os.environ['SEED_TTS_API_KEY']
    if 'bytepluses' in host:
        headers['X-Api-App-Key'] = 'aGjiRDfUWi'   # fixed value given in the BytePlus docs
    body = {'user': {'uid': 'knowledge-film-001'},
            'req_params': {'text': text, 'speaker': speaker,
                           'audio_params': {'format': 'pcm', 'sample_rate': SR, 'speech_rate': speech_rate,
                                            'enable_subtitle': True, 'enable_timestamp': True}}}
    # No shared section_id: with one, each request continued from the last and the pitch climbed
    # paragraph by paragraph (86 Hz to 159 Hz over the film). Paragraphs are synthesised independently.
    req = urllib.request.Request(f'https://{host}/api/v3/tts/unidirectional', data=json.dumps(body, ensure_ascii=False).encode(),
                                 method='POST', headers=headers)
    try:
        resp = urllib.request.urlopen(req, timeout=180)
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"Seed TTS HTTP {e.code}: {e.read().decode(errors='replace')[:300]} logid={e.headers.get('X-Tt-Logid')}")
    audio, words, done = bytearray(), [], False
    dec, buf, raw = codecs.getincrementaldecoder('utf-8')(), '', json.JSONDecoder()
    while True:
        chunk = resp.read(8192)
        buf += dec.decode(chunk)
        while buf.strip():          # objects may be newline-delimited or simply concatenated
            buf = buf.lstrip()
            if buf.startswith('data:'):
                buf = buf[5:].lstrip()
            try:
                obj, end = raw.raw_decode(buf)
            except json.JSONDecodeError:
                break
            buf = buf[end:]
            code = obj.get('code', 0)
            if code not in (0, 20000000):
                raise RuntimeError(f"Seed TTS error {code}: {obj.get('message')}")
            if obj.get('data'):
                audio += base64.b64decode(obj['data'])
            for w in (obj.get('sentence') or {}).get('words', []):
                words.append({'text': w.get('word', ''), 's': float(w['startTime']), 'e': float(w['endTime'])})
            done = done or code == 20000000
        if not chunk:
            break
    if not done:
        raise RuntimeError('Seed TTS stream ended without the end code')
    x = np.frombuffer(bytes(audio[: len(audio) // 2 * 2]), dtype='<i2').astype(np.float32) / 32768
    return x, words
