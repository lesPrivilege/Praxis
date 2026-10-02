# 源码与复现

- [model.mjs](model.mjs)：匿名化合成输入、fold、任务投影、九个时刻、84 秒 beat 与字幕；网页与视频的单一语义来源。
- [page.html](page.html) + [build-html.mjs](build-html.mjs)：模板与内联构建器，生成可直接打开的 `../index.html`。
- [index.tsx](index.tsx)：1920×1080 / 30 fps / 2520 帧 Remotion `Mechanism` composition；SVG 自制图形，没有外部素材。
- [model.test.mjs](model.test.mjs)：13 项基线/反例与 seek 检查。`npm test`。
- [qa.py](qa.py)：已有 Python Playwright 的隔离 Chromium 应用测试与截图渲染；不访问用户 browser profile。`python3 src/qa.py`。
- [extract.py](extract.py)：已渲染 MP4 的 ffprobe/解码/关键帧检查；使用 Remotion 随包的本机 FFmpeg，`python3 src/extract.py`。
- [playback.py](playback.py)：完整 1 倍速 MP4 播放与抽样帧；记录媒体时间和完成状态。

在本项目目录运行根 README 命令。本机依赖为 Node 25.9.0、Remotion/CLI 4.0.529、React 19.3.0，Python 3.14 已有 Playwright/Pillow/OpenCV。Python 工具没有新增安装；不是跨操作系统锁定环境。FFmpeg 的 macOS 动态库路径由 extract.py 仅给该子进程设置，未修改系统设置。其他平台应采用自身匹配的可信官方组件包。

构图参数属于本项目取舍：62px 片头、32px 字幕、固定三列、.7 秒标题过渡与 1.8 秒派生标记。界面控件颜色反馈 160ms，prefers-reduced-motion 下去掉过渡，时间线仍可手动操作；影片是可暂停的视频。没有把这些值晋升为 Kit 默认。
