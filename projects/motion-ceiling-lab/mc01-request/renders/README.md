# 导出产物

由 `export.sh` 调用视觉语法工场的 [流水线](../../../visual-grammar/_pipeline/README.md)生成。

| 文件 | 内容 |
|---|---|
| `mc01-request.webm` | VP9，1920×1080，30 帧，2821 帧，94 秒，无音轨；不进 git，在本地重新生成 |
| [render-config.json](render-config.json) | 帧率、尺寸、编码器与码率、GL renderer、启动参数、源文件 sha256、每 2 秒帧指纹 |
| [check-report.json](check-report.json) | 自检、seek 一致、播放、静态与减少动态效果入口、解码 PSNR、浏览器播放 |
| `contact-sheet.png` | 从导出的视频解码出的帧，每 4 秒一格；不进 git |
| [keyframes](keyframes/README.md) | 静态分镜时刻的 PNG |

文件存在不算验收；各项结论写在 [验收回执](../acceptance.md)。返回 [作品说明](../README.md)。
