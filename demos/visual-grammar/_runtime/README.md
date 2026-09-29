# 视觉作品运行层

四件作品共用的零依赖 Canvas 舞台。只需浏览器，不加载外部脚本、字体或 CDN；以 `file://` 直接打开作品的 `index.html` 即可运行。

## 契约

作品调用 `VG.stage(spec)`，并提供 `render(ctx, t, env)`。WebGL 作品可以在 `setup` 中建立离屏 WebGL 画布，每帧先画到离屏画布，再 `drawImage` 到舞台的 2D 画布（见 attention-grammars 与 form-lab-01）。`render` 必须是 t（秒）的纯函数：物理、布局等有状态过程在 `setup` 或加载时以固定种子、固定步长预先算好，再按 t 取值。这是重复 seek 一致与帧级导出的前提。

| 入口 | 作用 |
|---|---|
| [vg-stage.js](vg-stage.js) | 时钟、播放/暂停、时间轴、逐帧与段落跳转、静态分镜、可选音轨同步、`VG.hud` 屏幕层、`VG.U` 工具（缓动、`seg`、mulberry32 随机、CJK 避头换行） |
| [vg-stage.css](vg-stage.css) | 页面外壳；浅色冷调，含暗色、375px 回流、打印（打印时输出静态分镜） |
| `window.__vg` | 导出与检查入口：`ready`、`seek(t)` 只绘制、`renderAt(t)` 绘制并返回帧指纹、`frame(t, type)` 返回 dataURL、`canvas`、`audio`、`transcript(t)`、`meta.selfTest()`、`meta.bitrate` |

URL 参数：`?t=12.5` 停在指定时刻；`?static=1` 打开静态分镜；`?export=1` 只留原生尺寸画布，且不启动 RAF。系统开启“减少动态效果”时，页面默认进入静态分镜。

键盘：空格 播放/暂停；←/→ 单帧，Shift 加 ← / → 为 1 秒；`[` `]` 切换段落；Home/End 跳到首尾。

## 边界

`VG.hud` 把段落名、字幕、合成标记和进度条画进每一帧，因此导出的视频静音时也能看懂。字体使用系统 PingFang SC、SF Mono、Songti SC，没有随仓库保存；换一台没有这些字体的机器，会回退到其他字体，帧指纹随之改变。播放时若开启声音，以 `<audio>` 的 currentTime 为主时钟，否则以 `performance.now` 推进；导出与检查都不经过墙钟。2D 上下文以 `willReadFrequently: true` 创建：否则 Chrome 会在几次读回后从 GPU 光栅换成 CPU 光栅，前几次的帧指纹因此不同。

这是 demo 内共享实现，尚未晋升 Kit。按 [ADR-002](../../../docs/decisions/002-promotion.md)，现在只有本工场的四件作品在使用它，还没有第二个独立场景。返回 [工场](../README.md)。
