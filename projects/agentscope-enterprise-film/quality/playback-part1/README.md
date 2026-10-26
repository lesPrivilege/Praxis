# 第一段实际时轴检查证据

从 cut2 的 whole 到 integration，时间 0–767 秒。`playback.py` 使用 headless Chromium 的 performance.now 驱动 Film.seek，在原生 1920×1080 舞台连续按 1 倍速运行；帧记录保留实际捕获前后时间，不暂停或回跳来伪造采样。

运行完成后 `playback.json` 保存时轴统计、输入摘要、错误与截图索引；截图用于逐场、逐phase和短动效序列审阅。实际时轴运行、采样帧审阅与观众测试分别记录，不相互冒充。审阅见 [第一段记录](../playback-part1.md)。
