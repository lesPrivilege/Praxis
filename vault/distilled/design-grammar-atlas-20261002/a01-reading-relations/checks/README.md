# checks · A01 检查记录

记录日期 2026-10-02。检查者：Opus 5.5 主会话。只证明下列范围，不是视觉验收，也不是无障碍 conformance。

| 文件 | 范围 | 结果 |
|---|---|---|
| [content-report.json](content-report.json) | 10 个样张的文字与夹具逐字比对；环节分钟数由开始时刻与结束时刻算出 | 全部一致；60、75、45 |
| [geometry-report.json](geometry-report.json) | 5 个样张区与记录表 × 1440 / 375，禁用脚本，Chrome 154 headless | 12 次运行 0 issue |
| `axis` `act` `span` `box` `skin` `notes` 的 `-1440.png` 与 `-375.png` | 各区的整段截图 | 主会话全部看过 |

几何探针来自 [编排实验的 cdp.mjs](../../../layout-specimens-20260927/tools/README.md)，只看盒子：页面横向滚动、元素越出样张舞台、带裁切的文本。它不判断层级、可读性或好不好看；盒外的硬偏移阴影不在探针范围内，是看图确认没有被裁掉的。

字重测量另在应用内浏览器（Chromium 152）里用画布像素计数做过一次，结果记在 [上级 README](../README.md)，没有保存为文件。

未检查项见上级 README。
