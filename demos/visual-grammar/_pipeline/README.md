# 视觉作品导出与检查

驱动作品的 `window.__vg` 入口，只使用本机已有工具：Python Playwright 1.61 自带的 Chromium，通过 `--use-angle=metal` 使用 Apple M2 GPU，并用其中的 WebCodecs 编码器；另用 numpy/scipy 喂音频、测同步，用 OpenCV 解码。没有安装任何依赖，也不再使用 ffmpeg。

| 文件 | 作用 |
|---|---|
| [vgpipe.py](vgpipe.py) | `frames` / `render` / `check` 三个命令 |
| [encoder.js](encoder.js) | 注入页面：逐帧 `__vg.seek(i/fps)`，把画布包成时间戳为 `i/fps` 的 `VideoFrame`，送入 VP9 编码器；把 48 kHz 浮点音频送入 Opus 编码器；另提供检查用的音频解码 |
| [webm.py](webm.py) | 自写的 WebM 封装：EBML 头、Info、Tracks（VP9 + 可选 Opus，OpusHead 取自编码器）、Cues、每个关键帧一个 Cluster |
| [receipt.py](receipt.py) | 由 `check-report.json` 与 `render-config.json` 生成作品 README 中的验证表，以及 `renders/README.md` |

```bash
python3 demos/visual-grammar/_pipeline/vgpipe.py frames demos/visual-grammar/form-lab-01
```

```bash
python3 demos/visual-grammar/_pipeline/vgpipe.py render demos/visual-grammar/form-lab-01
```

```bash
python3 demos/visual-grammar/_pipeline/vgpipe.py check demos/visual-grammar/form-lab-01
```

```bash
python3 demos/visual-grammar/_pipeline/receipt.py demos/visual-grammar/form-lab-01
```

作品通过 `VG.stage` 的 `audio` 声明音轨（WAV，任意采样率，会重采样到 48 kHz），通过 `meta.bitrate` 申请高于默认 8 Mbps 的码率。

## 检查

| 检查 | 通过条件 |
|---|---|
| self_test | 作品内 `selfTest()` 逐项对照 |
| seek_consistency | 首尾、段落、静态分镜及 12 个种子随机时刻，按顺序、逆序、乱序三遍渲染，帧指纹全部一致 |
| interactive_play | 普通模式下按空格播放约 1.2 秒，时间轴实际前进 |
| static_param / reduced_motion | 390×844 视口下，两种入口都生成全部分镜且没有横向溢出 |
| video_decode | OpenCV 解码帧数等于 `duration×fps+1`，关键帧与新渲染帧的 PSNR 都 ≥ 30 dB；另存每 4 秒一格的解码拼图 |
| browser_playback | Chromium `<video>` 以 4 倍速播放到 `ended`，时长误差 < 0.2 秒；有音轨时还要求解码音频字节数 > 0 |
| audio_sync | Chromium 解码 `audio-only.webm`（与主文件相同的 Opus 数据块），与源 WAV 的前 20 秒互相关，偏移 ≤ 10 ms |

这些检查确认视频已经导出、能解码、能播放、音画对齐，不确认受众理解。拼图是给 Opus 读图用的，不算受众观看。PSNR 对随机亚像素颗粒过于严格；判断失败前应放大比对原图，是真损失还是指标误伤（见 [form-lab-01](../form-lab-01/README.md)）。

## 失败记录

- v1 首次导出 `BrokenPipeError`：Playwright 附带的 ffmpeg 不接受 `-` 作标准输入，要写 `pipe:0`。
- v1 播放检查超时：监听器挂上之前，`<video>` 已经加载完元数据，`play()` 从未被调用。
- v1 没有音频编码器，视频无法带音轨。v2 改为 WebCodecs 编码加 `webm.py` 封装，v1 的 JPEG → ffmpeg VP8 路径已删除。
- v2 第一次封装 `audio-only.webm` 时出错：只有一帧画面，56 秒音频全塞进同一个 Cluster，块时间码超出 int16。现在超过 30 秒就另开 Cluster。
- 切到 Metal GPU 后，t=0 与 t=2 的帧指纹在前几次调用中变化：2D 画布在几次读回后会从 GPU 光栅换成 CPU 光栅。运行层现在用 `willReadFrequently: true` 创建 2D 上下文。
- `bitrateMode: 'quantizer'` 几乎不改善质量，文件却有 300–480 MB，已删除。

返回 [工场](../README.md)。
