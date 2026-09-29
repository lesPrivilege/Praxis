#!/usr/bin/env python3
"""Render and check visual-grammar works that expose window.__vg (see _runtime/vg-stage.js).

  python3 vgpipe.py frames <work> [t ...]   keyframe PNGs for review (default: staticTimes)
  python3 vgpipe.py render <work>           WebM: VP9 video + Opus audio when the work has a
                                            soundtrack; encoded in-browser by WebCodecs at
                                            frame-exact timestamps, muxed by webm.py
  python3 vgpipe.py check  <work>           self-test, seek consistency, static and reduced-motion
                                            entry, decode, playback, audio track and A/V offset

Only tools already on this machine are used: Playwright's Chromium (Metal GPU through ANGLE,
WebCodecs encoders), numpy/scipy for the audio feed and sync measurement, OpenCV for decoding.
Outputs land in <work>/renders/.
"""
import base64
import hashlib
import json
import random
import subprocess
import sys
import time
import wave
from math import gcd
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from webm import opus_head, write_webm  # noqa: E402

ROOT = HERE.parents[2]  # Praxis repo
# Real GPU through ANGLE/Metal; without the flag headless Chromium falls back to SwiftShader.
LAUNCH_ARGS = ['--autoplay-policy=no-user-gesture-required', '--use-angle=metal']
VIDEO_CODEC, VIDEO_BITRATE, AUDIO_BITRATE = 'vp09.00.40.08', 8_000_000, 192_000


def git_head():
    try:
        return subprocess.check_output(['git', '-C', str(ROOT), 'rev-parse', 'HEAD'], text=True).strip()
    except Exception:
        return 'unknown'


def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def source_hashes(work):
    files = sorted([*work.glob('*.js'), *work.glob('*.html'), *work.glob('*.wav'), *work.glob('*.py'),
                    *(work.parent / '_runtime').glob('*'), *HERE.glob('*.js'), *HERE.glob('*.py')])
    return {str(f.relative_to(work.parent)): sha256(f) for f in files if f.is_file() and f.suffix != '.md'}


def open_page(pw, work, query='export=1', reduced=False, size=None):
    browser = pw.chromium.launch(args=LAUNCH_ARGS)
    ctx = browser.new_context(viewport=size or {'width': 1920, 'height': 1080}, device_scale_factor=1,
                              reduced_motion='reduce' if reduced else 'no-preference')
    page = ctx.new_page()
    logs = []
    page.on('console', lambda m: logs.append({'type': m.type, 'text': m.text}))
    page.on('pageerror', lambda e: logs.append({'type': 'pageerror', 'text': str(e)}))
    page.goto((work / 'index.html').as_uri() + (f'?{query}' if query else ''))
    page.wait_for_function('window.__vg !== undefined')
    page.evaluate('window.__vg.ready')
    return browser, page, logs


def info(page):
    return page.evaluate('({duration: __vg.duration, fps: __vg.fps, width: __vg.width, height: __vg.height,'
                         ' chapters: __vg.chapters, staticTimes: __vg.staticTimes, audio: __vg.audio, bitrate: __vg.meta.bitrate || null,'
                         ' meta: {fixture_id: __vg.meta.fixture_id, fixture_revision: __vg.meta.fixture_revision}})')


def gl_renderer(page):
    return page.evaluate('''() => { const g = document.createElement('canvas').getContext('webgl2');
        const d = g && g.getExtension('WEBGL_debug_renderer_info'); return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : null; }''')


def data_url_bytes(url):
    return base64.b64decode(url.split(',', 1)[1])


def load_wav(path, rate=48000):
    """int16 WAV → float32 planar [channels, n] at `rate`, plus the source rate."""
    import numpy as np
    from scipy.signal import resample_poly
    with wave.open(str(path)) as w:
        sr, ch = w.getframerate(), w.getnchannels()
        x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float32) / 32768
    x = x.reshape(-1, ch).T
    if sr != rate:
        g = gcd(rate, sr)
        x = resample_poly(x, rate // g, sr // g, axis=1).astype(np.float32)
    return x, sr


def cmd_frames(work, times):
    out = work / 'renders' / 'keyframes'
    out.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as pw:
        browser, page, logs = open_page(pw, work)
        meta = info(page)
        times = times or meta['staticTimes']
        paths = []
        for t in times:
            p = out / f't{t:06.2f}.png'
            p.write_bytes(data_url_bytes(page.evaluate('t => __vg.frame(t, "image/png")', t)))
            paths.append(str(p.relative_to(work)))
        browser.close()
    errors = [l for l in logs if l['type'] in ('error', 'pageerror')]
    print(json.dumps({'keyframes': paths, 'errors': errors}, ensure_ascii=False, indent=1))


def cmd_render(work):
    import numpy as np
    out = work / 'renders'
    out.mkdir(exist_ok=True)
    video_path = out / f'{work.name}.webm'
    started = time.time()
    with sync_playwright() as pw:
        browser, page, logs = open_page(pw, work)
        meta = info(page)
        fps, n = meta['fps'], int(round(meta['duration'] * meta['fps'])) + 1
        renderer, chromium = gl_renderer(page), browser.version
        page.add_script_tag(path=str(HERE / 'encoder.js'))
        bitrate = meta['bitrate'] or VIDEO_BITRATE  # a work may ask for more
        page.evaluate('o => __enc.initVideo(o)', {'codec': VIDEO_CODEC, 'width': meta['width'], 'height': meta['height'],
                                                  'bitrate': bitrate, 'fps': fps})
        video, audio, fingerprints = [], [], {}
        for i0 in range(0, n, fps):  # one second of frames per round trip
            page.evaluate('([a, b]) => __enc.frames(a, b)', [i0, min(n, i0 + fps)])
            d = page.evaluate('__enc.drain()')
            if d['err']:
                sys.exit(f'video encoder error: {d["err"]}')
            video += d['v']
            if i0 % (fps * 2) == 0:
                fingerprints[f'{i0 / fps:.3f}'] = page.evaluate('t => __vg.renderAt(t)', i0 / fps)
        audio_meta = None
        if meta['audio']:
            x, src_sr = load_wav(work / meta['audio'])
            page.evaluate('o => __enc.initAudio(o)', {'channels': x.shape[0], 'bitrate': AUDIO_BITRATE})
            for s0 in range(0, x.shape[1], 48000):
                seg = np.ascontiguousarray(x[:, s0:s0 + 48000])
                page.evaluate('([b, f, ts]) => __enc.feed(b, f, ts)',
                              [base64.b64encode(seg.tobytes()).decode(), seg.shape[1], round(s0 * 1e6 / 48000)])
            audio_meta = {'source': meta['audio'], 'source_sample_rate': src_sr, 'channels': x.shape[0], 'sample_rate': 48000}
        page.evaluate('__enc.flush()')
        d = page.evaluate('__enc.drain()')
        if d['err']:
            sys.exit(f'encoder error: {d["err"]}')
        video += d['v']; audio += d['a']
        desc = page.evaluate('__enc.aDesc')
        browser.close()

    def frames(lst):
        return sorted(({'ts_us': f['ts'], 'dur_us': f['dur'] or 0, 'key': f['key'], 'data': base64.b64decode(f['b64'])} for f in lst),
                      key=lambda f: f['ts_us'])
    vf, mux_audio = frames(video), None
    if audio_meta:
        head = base64.b64decode(desc) if desc else None
        from_encoder = bool(head and head[:8] == b'OpusHead')
        pre_skip = int.from_bytes(head[10:12], 'little') if from_encoder else 312
        audio_meta.update({'codec': 'opus', 'bitrate': AUDIO_BITRATE, 'pre_skip': pre_skip,
                           'codec_private': head if from_encoder else opus_head(audio_meta['channels'], pre_skip),
                           'opus_head_from': 'encoder' if from_encoder else 'webm.py (encoder gave none)'})
        mux_audio = (audio_meta, frames(audio))
        # audio-only companion: check decodes exactly this Opus stream to measure the offset
        write_webm(out / 'audio-only.webm', meta['width'], meta['height'], vf[:1], audio=mux_audio)
    mux = write_webm(video_path, meta['width'], meta['height'], vf, audio=mux_audio)
    config = {
        'work': work.name, 'fixture': meta['meta'], 'git_head': git_head(), 'sources_sha256': source_hashes(work),
        'fps': fps, 'frames': n, 'duration_s': meta['duration'], 'size': [meta['width'], meta['height']],
        'renderer': 'Playwright Chromium; frame i drawn by __vg.seek(i/fps), wrapped in VideoFrame(canvas, ts=i/fps); no wall-clock waits',
        'gl_renderer': renderer, 'launch_args': LAUNCH_ARGS, 'chromium': chromium,
        'video': {'codec': VIDEO_CODEC, 'bitrate': bitrate, 'keyframe_every_s': 2, 'packets': len(vf), 'encoder': 'WebCodecs VideoEncoder'},
        'audio': ({k: v for k, v in audio_meta.items() if k != 'codec_private'} | {'packets': len(mux_audio[1]), 'encoder': 'WebCodecs AudioEncoder'}) if audio_meta else None,
        'mux': mux | {'writer': '_pipeline/webm.py'}, 'elapsed_s': round(time.time() - started, 1),
        'fingerprints_every_2s': fingerprints,
        'console_errors': [l for l in logs if l['type'] in ('error', 'pageerror')],
        'output': str(video_path.relative_to(work)), 'output_bytes': video_path.stat().st_size,
    }
    (out / 'render-config.json').write_text(json.dumps(config, ensure_ascii=False, indent=1))
    print(json.dumps({k: config[k] for k in ('frames', 'elapsed_s', 'output_bytes', 'audio', 'mux', 'gl_renderer')}, ensure_ascii=False, indent=1))


def psnr(a, b):
    import numpy as np
    m = ((a.astype('float64') - b.astype('float64')) ** 2).mean()
    return 99.0 if m == 0 else round(10 * np.log10(255 * 255 / m), 2)


def audio_offset(work, page, meta):
    """Decode the muxed Opus stream in Chromium and cross-correlate it with the source WAV."""
    import numpy as np
    from scipy.signal import correlate
    probe = work / 'renders' / 'audio-only.webm'
    page.add_script_tag(path=str(HERE / 'encoder.js'))
    d = page.evaluate('s => __decodeAudio(s)', base64.b64encode(probe.read_bytes()).decode())
    got = np.frombuffer(base64.b64decode(d['pcm']), '<i2').astype(np.float32) / 32768
    src = load_wav(work / meta['audio'])[0][0]
    n = min(len(got), len(src), 48000 * 20)
    a, b = got[:n], src[:n]
    c = correlate(a, b, mode='full', method='fft')
    lag = int(np.argmax(c)) - (n - 1)
    return {'decoder': 'Chromium decodeAudioData', 'decoded_seconds': round(d['length'] / d['sampleRate'], 3),
            'source_seconds': round(len(src) / 48000, 3), 'offset_ms': round(lag / 48, 2),
            'correlation': round(float(c.max() / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-9)), 4),
            'pass': abs(lag / 48) <= 10}


def cmd_check(work):
    import cv2
    import numpy as np
    out = work / 'renders'
    out.mkdir(exist_ok=True)
    report = {'work': work.name, 'git_head': git_head(), 'checked_at': time.strftime('%Y-%m-%dT%H:%M:%S%z')}
    with sync_playwright() as pw:
        # 1. interactive page: load, self-test, seek consistency
        browser, page, logs = open_page(pw, work, query='')
        meta = info(page)
        report['fixture'] = meta['meta']
        report['gl_renderer'] = gl_renderer(page)
        report['self_test'] = page.evaluate('__vg.meta.selfTest ? __vg.meta.selfTest() : null')
        rnd = random.Random(20260929)
        times = sorted({0.0, meta['duration'], *[c['t'] for c in meta['chapters']], *meta['staticTimes'],
                        *[round(rnd.uniform(0, meta['duration']), 3) for _ in range(12)]})
        passes = [{t: page.evaluate('t => __vg.renderAt(t)', t) for t in order}
                  for order in (times, list(reversed(times)), rnd.sample(times, len(times)))]
        mismatch = [t for t in times if len({p[t] for p in passes}) != 1]
        report['seek_consistency'] = {'times': len(times), 'orders': 3, 'mismatched_times': mismatch, 'pass': not mismatch}
        page.keyboard.press('Home')
        page.keyboard.press('Space'); page.wait_for_timeout(1200); page.keyboard.press('Space')
        played_to = page.evaluate('parseFloat(document.querySelector(".vg-controls input").value)')
        report['interactive_play'] = {'advanced_to_s': round(played_to, 2), 'pass': 0.5 < played_to < 3}
        report['transcript_samples'] = {f'{t:.2f}': page.evaluate('t => __vg.transcript(t)', t) for t in meta['staticTimes']}
        report['console_errors'] = [l for l in logs if l['type'] in ('error', 'pageerror')]
        browser.close()

        # 2. static entry and reduced motion at phone width
        for label, query, reduced in (('static_param', 'static=1', False), ('reduced_motion', '', True)):
            browser, page, logs = open_page(pw, work, query=query, reduced=reduced, size={'width': 390, 'height': 844})
            figs = page.evaluate('document.querySelectorAll(".vg-static figure img").length')
            hidden = page.evaluate('document.querySelector(".vg-static").hidden')
            overflow = page.evaluate('document.documentElement.scrollWidth > window.innerWidth')
            report[label] = {'plates': figs, 'expected': len(meta['staticTimes']), 'static_visible': not hidden,
                             'horizontal_overflow_390px': overflow,
                             'pass': figs == len(meta['staticTimes']) and not hidden and not overflow}
            browser.close()

        video = out / f'{work.name}.webm'
        if not video.exists():
            report['video_decode'] = {'pass': False, 'reason': 'no exported video'}
        else:
            # 3. decode with OpenCV, compare to fresh renders, contact sheet
            cap = cv2.VideoCapture(str(video))
            fps = meta['fps']
            want = {int(round(t * fps)): t for t in meta['staticTimes']}
            frames, keep, thumbs = 0, {}, []
            while True:
                ok, frame = cap.read()
                if not ok:
                    break
                if frames in want:
                    keep[want[frames]] = frame
                if frames % (fps * 4) == 0:
                    thumbs.append((frames / fps, cv2.resize(frame, (384, 216), interpolation=cv2.INTER_AREA)))
                frames += 1
            cap.release()
            browser, page, logs = open_page(pw, work)
            comps = {}
            for t, frame in keep.items():
                png = data_url_bytes(page.evaluate('t => __vg.frame(Math.round(t * __vg.fps) / __vg.fps, "image/png")', t))
                comps[f'{t:.2f}'] = psnr(frame, cv2.imdecode(np.frombuffer(png, np.uint8), cv2.IMREAD_COLOR))
            if meta['audio']:
                report['audio_sync'] = audio_offset(work, page, meta)
            browser.close()
            expected = int(round(meta['duration'] * fps)) + 1
            report['video_decode'] = {'decoder': f'OpenCV {cv2.__version__}', 'frames_decoded': frames, 'frames_expected': expected,
                                      'psnr_vs_fresh_render_db': comps,
                                      'pass': frames == expected and all(v >= 30 for v in comps.values())}
            cols = 4
            sheet = np.full((((len(thumbs) + cols - 1) // cols) * 246, cols * 394, 3), 255, np.uint8)
            for i, (t, th) in enumerate(thumbs):
                r, c = divmod(i, cols)
                sheet[r * 246 + 5:r * 246 + 221, c * 394 + 5:c * 394 + 389] = th
                cv2.putText(sheet, f'{t:05.1f}s', (c * 394 + 8, r * 246 + 240), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (60, 60, 60), 1)
            cv2.imwrite(str(out / 'contact-sheet.png'), sheet)
            report['contact_sheet'] = 'renders/contact-sheet.png (decoded video frames, every 4 s)'

            # 4. play the exported file in Chromium to the end; with audio, require decoded audio bytes
            browser = pw.chromium.launch(args=LAUNCH_ARGS)
            page = browser.new_page()
            page.goto(video.parent.as_uri() + '/')
            page.set_content(f'<video id=v src="{video.as_uri()}"></video>')
            res = page.evaluate('''() => new Promise((resolve) => {
                const v = document.getElementById('v'); const t0 = performance.now();
                v.onerror = () => resolve({error: v.error && v.error.code});
                const go = () => { v.playbackRate = 4; v.play().catch(e => resolve({error: String(e)})); };
                if (v.readyState >= 1) go(); else v.onloadedmetadata = go;
                v.onended = () => resolve({ended: true, duration: v.duration, width: v.videoWidth, height: v.videoHeight,
                                           audio_bytes_decoded: v.webkitAudioDecodedByteCount, video_bytes_decoded: v.webkitVideoDecodedByteCount,
                                           wall_s: (performance.now() - t0) / 1000});
                setTimeout(() => resolve({timeout: true, currentTime: v.currentTime, duration: v.duration}), 60000);
            })''')
            browser.close()
            ok = bool(res.get('ended')) and abs(res.get('duration', 0) - meta['duration']) < 0.2
            if meta['audio']:
                ok = ok and res.get('audio_bytes_decoded', 0) > 0
            report['browser_playback'] = {**res, 'playback_rate': 4, 'pass': ok}

    keys = ['self_test', 'seek_consistency', 'interactive_play', 'static_param', 'reduced_motion', 'video_decode', 'browser_playback', 'audio_sync']
    report['summary'] = {k: report[k].get('pass') if isinstance(report.get(k), dict) else None for k in keys}
    report['summary']['console_errors'] = len(report['console_errors'])
    (out / 'check-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=1))
    print(json.dumps(report['summary'], indent=1))
    if report['self_test'] and not report['self_test']['pass']:
        print(json.dumps(report['self_test'], ensure_ascii=False, indent=1))


if __name__ == '__main__':
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    cmd, work = sys.argv[1], Path(sys.argv[2]).resolve()
    {'frames': lambda: cmd_frames(work, [float(x) for x in sys.argv[3:]]),
     'render': lambda: cmd_render(work), 'check': lambda: cmd_check(work)}.get(cmd, lambda: sys.exit(__doc__))()
