"""Minimal WebM (Matroska) writer for already-encoded VP8/VP9 video and Opus audio.

Written for this demo so the pipeline needs no ffmpeg audio encoder: the browser's
WebCodecs produces the packets, this file only lays out EBML. Scope:
one video track, optional one audio track, SimpleBlocks, one Cluster per video
keyframe (plus a continuation Cluster when a gap would overflow the int16 block timecode), Cues before the Clusters (positions use fixed 8-byte sizes, so the Cues
length does not depend on its own content).
"""
import struct

TIMECODE_SCALE = 1_000_000  # 1 ms ticks


def _vint_size(n, width=None):
    """EBML data-size varint."""
    if width is None:
        width = 1
        while n >= (1 << (7 * width)) - 1:
            width += 1
    return ((1 << (7 * width)) | n).to_bytes(width, 'big')


def _el(eid, payload):
    idb = eid.to_bytes((eid.bit_length() + 7) // 8, 'big')
    return idb + _vint_size(len(payload)) + payload


def _uint(eid, v, width=None):
    if width is None:
        width = max(1, (v.bit_length() + 7) // 8)
    return _el(eid, v.to_bytes(width, 'big'))


def _float(eid, v):
    return _el(eid, struct.pack('>d', v))


def _str(eid, s):
    return _el(eid, s.encode())


def opus_head(channels, pre_skip, sample_rate=48000):
    return b'OpusHead' + struct.pack('<BBHIhB', 1, channels, pre_skip, sample_rate, 0, 0)


def write_webm(path, width, height, video, audio=None, video_codec='V_VP9', app='praxis visual-grammar vgpipe'):
    """video / audio: lists of dicts {ts_us, data(bytes), key(bool)} sorted by ts_us.
    audio (optional) also needs {'channels', 'sample_rate', 'codec_private', 'pre_skip'} via audio_meta."""
    audio_meta = None
    if audio:
        audio_meta, audio = audio
    dur_ms = max((f['ts_us'] + f.get('dur_us', 0)) for f in video) / 1000
    if audio:
        dur_ms = max(dur_ms, max(a['ts_us'] + a.get('dur_us', 0) for a in audio) / 1000)

    ebml = _el(0x1A45DFA3, b''.join([
        _uint(0x4286, 1), _uint(0x42F7, 1), _uint(0x42F2, 4), _uint(0x42F3, 8),
        _str(0x4282, 'webm'), _uint(0x4287, 4), _uint(0x4285, 2)]))
    info = _el(0x1549A966, b''.join([
        _uint(0x2AD7B1, TIMECODE_SCALE), _str(0x4D80, app), _str(0x5741, app), _float(0x4489, float(dur_ms))]))
    tracks_payload = _el(0xAE, b''.join([
        _uint(0xD7, 1), _uint(0x73C5, 1), _uint(0x9C, 0), _uint(0x83, 1), _str(0x86, video_codec),
        _el(0xE0, _uint(0xB0, width) + _uint(0xBA, height))]))
    if audio:
        m = audio_meta
        tracks_payload += _el(0xAE, b''.join([
            _uint(0xD7, 2), _uint(0x73C5, 2), _uint(0x9C, 0), _uint(0x83, 2), _str(0x86, 'A_OPUS'),
            _el(0x63A2, m['codec_private']),
            _uint(0x56AA, int(m['pre_skip'] * 1e9 / 48000)),  # CodecDelay (ns)
            _uint(0x56BB, 80_000_000),                         # SeekPreRoll 80 ms
            _el(0xE1, _float(0xB5, float(m['sample_rate'])) + _uint(0x9F, m['channels']))]))
    tracks = _el(0x1654AE6B, tracks_payload)

    # clusters start at each video keyframe
    starts = [f['ts_us'] for f in video if f['key']]
    if not starts or starts[0] != video[0]['ts_us']:
        raise ValueError('first video frame must be a keyframe')
    blocks = [(f['ts_us'], 1, f) for f in video] + [(a['ts_us'], 2, a) for a in (audio or [])]
    blocks.sort(key=lambda b: (b[0], b[1]))
    clusters, ci = [], -1
    for ts, track, f in blocks:
        while ci + 1 < len(starts) and ts >= starts[ci + 1]:
            ci += 1
            clusters.append({'ts_ms': starts[ci] // 1000, 'body': [], 'cue': True})
        if ci < 0:  # audio before first video frame
            ci = 0
            clusters.append({'ts_ms': starts[0] // 1000, 'body': [], 'cue': True})
        if ts // 1000 - clusters[-1]['ts_ms'] > 30_000:  # keep SimpleBlock timecodes within int16
            clusters.append({'ts_ms': ts // 1000, 'body': [], 'cue': False})
        c = clusters[-1]
        rel = ts // 1000 - c['ts_ms']
        flags = 0x80 if (track == 2 or f['key']) else 0x00
        c['body'].append(_el(0xA3, bytes([0x80 | track]) + struct.pack('>hB', rel, flags) + f['data']))
    cluster_bytes = [_el(0x1F43B675, _uint(0xE7, c['ts_ms']) + b''.join(c['body'])) for c in clusters]

    def cues(offset):
        pts, pos = [], offset
        for c, b in zip(clusters, cluster_bytes):
            if c['cue']:
                    pts.append(_el(0xBB, _uint(0xB3, c['ts_ms'], 8) + _el(0xB7, _uint(0xF7, 1) + _uint(0xF1, pos, 8))))
            pos += len(b)
        return _el(0x1C53BB6B, b''.join(pts))

    head = info + tracks
    probe = cues(0)
    cue_bytes = cues(len(head) + len(probe))
    assert len(cue_bytes) == len(probe)
    body = head + cue_bytes + b''.join(cluster_bytes)
    segment = (0x18538067).to_bytes(4, 'big') + _vint_size(len(body), 8) + body
    with open(path, 'wb') as fh:
        fh.write(ebml + segment)
    return {'clusters': len(clusters), 'video_blocks': len(video), 'audio_blocks': len(audio or []), 'duration_ms': dur_ms}
