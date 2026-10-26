# 导出产物

由 [流水线](../../_pipeline/README.md) 生成；git HEAD `17d44bd`，工作树含未提交修改，逐文件源哈希见配置。

| 文件 | 内容 |
|---|---|
| `attention-grammars.webm` | vp09.00.40.08 1920×1080 @30fps，1681 帧；Opus 音轨 1 声道 48 kHz |
| `audio-only.webm` | 同一 Opus 流另封一份（只含一帧画面），供同步检查解码 |
| [render-config.json](render-config.json) | 帧率、尺寸、编码器与码率、GL renderer、启动参数、源文件 sha256、每 2 秒帧指纹 |
| [check-report.json](check-report.json) | 自检、seek 一致、交互、静态与减少动态效果入口、解码 PSNR、浏览器播放、音画偏移 |
| `contact-sheet.png` | 从导出视频解码出的帧，每 4 秒一格 |
| [keyframes](keyframes/README.md) | 静态分镜时刻的 PNG |

视频、`audio-only.webm` 与拼图不进 git，用 `vgpipe.py render` 与 `check` 在本地重新生成；配置、报告与关键帧随仓库保存。文件存在不算验收；各项检查结论写在 [作品说明](../README.md#验证)。
