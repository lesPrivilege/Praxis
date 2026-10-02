# 复核证据

本目录保存本轮生成的证据，不附原始会话。当前结论见 [验收](../acceptance.md)。

- [consumption-trace.json](consumption-trace.json)：入口、触发原因、读取 hash、采用与未采用、补全、失败修正；由本轮可见工具调用整理。
- [model-checks.json](model-checks.json)：13 项语义和反例检查。
- [html-checks.json](html-checks.json)：隔离 Chromium 实际打开/控件/键盘/窄屏/减少动效结果；原生屏幕通道未通过。
- `html-desktop-initial.png`、`html-desktop-stale.png`、`html-desktop-final.png`：桌面截图；`html-375-final.png`、`html-390-final.png`、`html-720-final.png` 和 `html-reduced-motion.png` 为重排/焦点样本。
- [video-metadata.json](video-metadata.json) / [decode-check.json](decode-check.json)：最终 MP4 媒体信息和 2520 帧解码。
- `film-02s.png` 至 `film-81s.png`：最终 MP4 的 10 个关键帧（2、12、18、28、31、39、50、62、73、81 秒）；`contact-sheet.jpg` 本地可生成，不入 Git。
- [playback-check.json](playback-check.json)：1 倍速完整播放与分段抽样；连续原生屏幕观看仍未执行。
- [repository-check.txt](repository-check.txt)：仓库 required validator 结果。

媒体存在、构建通过、几何无溢出和联络表都不等于受众理解或真人接受。本轮通过与未验项分列，屏幕通道失联不被隐藏。
