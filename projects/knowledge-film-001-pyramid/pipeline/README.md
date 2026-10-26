# 渲染与检查

| 脚本 | 作用 |
|---|---|
| `frames.py` | 取静帧，拼成带时间和段号的联络表，供看图检查 |
| `render.py` | 多个无头 Chromium 逐帧截图，经 ffmpeg 编成 H.264，再与 `audio/mix.wav` 合成 |
| `check.py` | 成片检查：流信息、与重新渲染的帧比对、静止段、空白帧、旁白转写比对、响度 |
| `watch_page.py` | 生成 `out/watch.html` |

ffmpeg 来自 `imageio-ffmpeg` 的轮子，经 `uv` 临时取用，没有装到系统里。Chromium 用本机已有的 Playwright。[sheets/](sheets/README.md) 是成片的联络表；`_review/` 与 `_render/` 是过程产物，用完即删。返回 [项目说明](../README.md)。
