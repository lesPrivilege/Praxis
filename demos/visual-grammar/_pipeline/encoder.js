/* Injected by vgpipe.py render. Drives window.__vg frame by frame into WebCodecs
 * encoders and hands encoded packets back to Python as base64. No wall clock is
 * involved: frame i is drawn at t = i / fps and stamped with that timestamp. */
(() => {
  const b64 = (u8) => { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); };
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const pack = (c) => { const u = new Uint8Array(c.byteLength); c.copyTo(u); return { ts: c.timestamp, dur: c.duration, key: c.type === 'key', b64: b64(u) }; };

  window.__enc = {
    v: [], a: [], aDesc: null, err: null,
    initVideo(o) {
      this.fps = o.fps;
      this.venc = new VideoEncoder({ output: (c) => this.v.push(pack(c)), error: (e) => { this.err = String(e); } });
      this.venc.configure({ codec: o.codec, width: o.width, height: o.height, bitrate: o.bitrate, framerate: o.fps,
                            latencyMode: 'quality', bitrateMode: 'variable' });
    },
    async frames(i0, i1) {
      for (let i = i0; i < i1; i++) {
        __vg.seek(i / this.fps);
        const f = new VideoFrame(__vg.canvas, { timestamp: Math.round(i * 1e6 / this.fps), duration: Math.round(1e6 / this.fps) });
        this.venc.encode(f, { keyFrame: i % (this.fps * 2) === 0 });
        f.close();
        while (this.venc.encodeQueueSize > 6) await new Promise((r) => setTimeout(r, 1));
      }
    },
    initAudio(o) {
      this.ach = o.channels;
      this.aenc = new AudioEncoder({
        output: (c, md) => {
          if (md && md.decoderConfig && md.decoderConfig.description) this.aDesc = b64(new Uint8Array(md.decoderConfig.description));
          const p = pack(c); p.key = true; this.a.push(p);
        },
        error: (e) => { this.err = String(e); } });
      this.aenc.configure({ codec: 'opus', sampleRate: 48000, numberOfChannels: o.channels, bitrate: o.bitrate });
    },
    feed(s, frames, ts) {
      const u = unb64(s);
      const data = new Float32Array(u.buffer, u.byteOffset, u.byteLength / 4);
      const ad = new AudioData({ format: 'f32-planar', sampleRate: 48000, numberOfFrames: frames, numberOfChannels: this.ach, timestamp: ts, data });
      this.aenc.encode(ad); ad.close();
    },
    async flush() { if (this.venc) await this.venc.flush(); if (this.aenc) await this.aenc.flush(); },
    drain() { const out = { v: this.v, a: this.a, err: this.err }; this.v = []; this.a = []; return out; },
  };

  // check helper: decode an audio file handed over as base64, return channel 0 as int16 base64
  window.__decodeAudio = async (s) => {
    const ctx = new OfflineAudioContext(1, 48000, 48000);
    const buf = await ctx.decodeAudioData(unb64(s).buffer);
    const x = buf.getChannelData(0), out = new Int16Array(x.length);
    for (let i = 0; i < x.length; i++) out[i] = Math.max(-32768, Math.min(32767, Math.round(x[i] * 32767)));
    return { sampleRate: buf.sampleRate, length: buf.length, channels: buf.numberOfChannels, pcm: b64(new Uint8Array(out.buffer)) };
  };
})();
