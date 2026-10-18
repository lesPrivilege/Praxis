# 画面

一张 1920×1080 的网页舞台。`index.html?a=ep01` 打开某个编排（单集或 `compilation`），空格播放，方向键逐帧；声音读 `out/<编排>.mix.wav`，没有时舞台照常走。施工约定见 [AUTHORING](AUTHORING.md)。

| 文件 | 作用 |
|---|---|
| `load.js` | 按 `?a=` 依次加载时间线、登记、引擎和编排里每一集的 `scenes.js`；出错记进 `window.__errors`，渲染器据此拒绝出片 |
| `engine.js` | 一条暂停的 GSAP 主时间线；`T()` 按段号和词取时刻；`Film.claim()`、`Film.asset()` 按登记放行或拒绝 |
| `camera.js` | 镜头：每场的内容放在一层上，启动时按可见内容取景，居中、偏小时放大，平滑后加缓推和转场推拉；`K.focus` 指定推近的元素 |
| `kit.js` | 搭场景的工具；`K.quote`、`K.source`、`K.figure` 只从登记取文字和图片；`K.lit` 标出重点短语 |
| `series.js` | 系列标识、标题卡、章节卡、片尾出处与图片署名、系列书单图、单集引入与收尾 |
| `film.css` | 设计变量与共用样式；各集样式在自己目录 |
| `gsap.min.js` | GSAP 3.13.0，取自 [薪酬基线说明片](../../../demos/role-baseline-film/film/README.md)；按 GreenSock 的 Standard License 使用 |

`engine.js`、`kit.js`、`boot.js` 改自同一处的旧引擎，增加了编排、登记和图片三项；改动写在各文件开头。

返回 [系列说明](../README.md)。
