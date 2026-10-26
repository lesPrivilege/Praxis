# 画面

一张 1920×1080 的网页舞台，每一帧只由时间决定。浏览器直接打开 `index.html` 可以预览：空格播放，方向键逐帧，可拖动，没有声音。

| 文件 | 内容 |
|---|---|
| `scenes.js` | 十场画面。每个时间是“本场开始后的秒数”，例如 `T('floor', 6.4)`；场长在 `../script/beats.json` |
| `film.css` | 设计变量与各场样式。三档强度各有固定的深浅（底线最深），蓝色标出此刻要说的那一点，红色标出改写丢掉的部分，虚线表示“不能” |
| `engine.js`、`kit.js` | 时间线引擎、搭场景的工具。取自[薪酬基线说明片](../../role-baseline-film/film/README.md)，未改 |
| `boot.js` | 播放器。同上，去掉了音频 |
| `gsap.min.js` | GSAP 3.13.0，取自同一处；按 GreenSock 的 Standard License 使用，不是开源许可 |
| `timeline.js` | 由 `build/timeline.py` 生成，不手改 |

返回 [项目说明](../README.md)。
