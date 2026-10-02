# FFmpeg Documentation

- source ID: `ffmpeg-documentation`
- URL: <https://ffmpeg.org/documentation.html>
- accessed: 2026-09-28 (Asia/Singapore)
- status: `verified`; snapshot: `summary-only`

## 读到什么

官方入口说明文档 nightly regeneration 并对应 newest FFmpeg revision。命令行部分列出 `ffmpeg`、`ffprobe`，组件部分列出 scaling/pixel format、audio resampler、codecs、bitstream filters、muxers/demuxers、protocols、filters，另有 libav* 与 API/FATE 等入口。

## 可消费内容

可把 FFmpeg 放在 renderer 后的 delivery 层：帧序列与音轨 mux、fps/scale、codec/filter 与输出检查应回查具体命令和 `ffprobe`，而不是只把“FFmpeg”当模糊标签。

## 边界

入口页不是具体 codec 参数、滤镜质量或音画同步验收；nightly 文档会变化。本批没有运行 ffmpeg/ffprobe、没有锁定本机版本、没有生成输出文件。

## 重访

决定输出容器/codec、音视频 mux、fps/scale、硬件编码或需要复现时重访对应版本的 ffmpeg/ffprobe 文档和本地二进制。
