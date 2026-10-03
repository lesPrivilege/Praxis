# Palantir 首次设计打样交接

本包于 2026-10-03 按实际本机规范对齐，并依据用户手动下载的原报告完成 Palantir 内容改编。只交给 Claude 一个文件时，使用 [主交接 Markdown](palantir-claude-design-handoff.md)：问题、方法、内容基线、合成材料、探索空间及后续验收要求均在其中。

**状态：原报告的 Palantir 方法卡与 Claude Design brief 内容对齐完成；方法仍为项目候选。设计实现、视觉/受众验收和 Library 保存未完成。** 当前包只含 Markdown、JSON 与清单，没有 HTML、视频、图像样张或业务实现。

| 文件 | 用途 |
|---|---|
| [palantir-claude-design-handoff.md](palantir-claude-design-handoff.md) | 可独立交给 Claude 的首次打样 brief |
| [fixture.json](fixture.json) | 原报告催单场景的 E0–E4、S0–S1、选择与反例 |
| [sources.md](sources.md) | 报告身份、精确公开引用、读取范围及许可边界 |
| [local-alignment.md](local-alignment.md) | 实际基线、尚未入库的拟议路径、包内映射与改编说明 |
| [redaction-and-checks.md](redaction-and-checks.md) | 脱敏、内容覆盖及实际检查范围 |
| [package-manifest.json](package-manifest.json) | 文件清单、大小、SHA-256 与检查结果 |

目录独立于源仓库，没有 Git 元数据、历史或依赖。解压后可直接阅读，不需要安装或运行脚本。公开来源需联网回查；原报告、第三方全文、下载工具与私人工作记录均在包外。继续原书研究的缺口见主文，当前窄范围打样无需等待全部书目补齐。
