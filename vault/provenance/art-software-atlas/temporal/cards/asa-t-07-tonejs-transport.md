# ASA-T-07 · Tone.js：Transport

原始 URL：[Tone.js 14.7.77 Transport docs](https://tonejs.github.io/docs/14.7.77/Transport.html)

## 来源摘要

Tone.js 版本化 API 文档把 Transport 定义为音乐事件时间线，列出 tempo、位置、loop、start/stop/pause、schedule、scheduleOnce 和 scheduleRepeat 等控制。文档示例在重复回调收到的时间参数上对振荡器排程 start/stop，并提示必须启动 transport 才会触发排程。

## 可支持与边界

支持文档描述的 API 模型和使用示例；不能证明特定浏览器、音频硬件下的时序或声音质量，也不能推断与图像渲染自动同步。本次未运行代码或听音。版本路径明确是 14.7.77，升级后需复核。

## 阅读位置与用途

Overview、scheduleRepeat、start/stop 与事件 API 说明。供 [score and time](../../../../../kit/design/motion/score-and-time.md) 和 [rule systems](../../../../../kit/design/motion/rule-systems.md)；[CHANGELOG](../CHANGELOG.md)。
