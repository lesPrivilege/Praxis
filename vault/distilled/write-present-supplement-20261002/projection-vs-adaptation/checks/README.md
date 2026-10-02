# checks · 投影与改编的检查记录

记录日期 2026-10-02。检查者：Opus 5.5 主会话。只证明下列范围，不是视觉验收，也不是无障碍 conformance。

| 文件 | 范围 | 结果 |
|---|---|---|
| [content-report.json](content-report.json) | 投影的文字与原稿逐字比对；改编里每个声称出自原稿的片段是否在原稿里 | 879 字完全相同；21 个片段全部找到 |
| [geometry-report.json](geometry-report.json) | 三个区（对照、变动表、归属图）× 1440 / 375，禁用脚本，Chrome headless | 6 次运行 0 issue |
| `pair` `changes` `owners` 的 `-1440.png` 与 `-375.png` | 各区的整段截图 | 主会话全部看过 |

几何探针来自 [编排实验的 cdp.mjs](../../../layout-specimens-20260927/tools/README.md)，只看盒子：横向滚动、越界、带裁切的文本。它不判断层级、可读性或好不好看。

未检查项见上级 README。
