# 画面

一张 1920×1080 的网页舞台，每一帧只由时间决定。浏览器直接打开 `index.html` 可以预览：空格播放，方向键逐帧，可拖动。

| 文件 | 内容 |
|---|---|
| `scenes.js` | 四场画面和底部的字幕条；所有动作的时间都取自念白里的词，例如 `T('n7', '个税')` |
| `film.css` | 设计变量与各场样式。蓝色只给等审批的那一项，斜纹在哪里都是工具费，虚线表示尚未成立 |
| `engine.js`、`kit.js`、`boot.js` | 时间线引擎、搭场景的工具、播放器。原样取自[金字塔片第五版](../../knowledge-film-001-pyramid-cut5/film/README.md)，只改了音频路径 |
| `gsap.min.js` | GSAP 3.13.0，取自同一处；按 GreenSock 的 Standard License 使用，不是开源许可 |
| `timeline.js` | 由 `build/voice.py` 生成，不手改 |

返回 [项目说明](../README.md)。
