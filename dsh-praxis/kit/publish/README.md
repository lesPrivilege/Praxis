# Publish · 按媒介编排与制作

内容怎样适配一种媒介，经过制作和检查成为交付物；每种媒介一条流水线，Task 选定流水线后读取。

内容先讲什么、怎样组织归 [Writing](../writing/README.md)，关系用什么视觉、交互或运动表现归 [Design](../design/README.md)，判别见 [分层体例](../../layers.md#边界怎样判)。

| 流水线 | 管什么 | 入口 |
|---|---|---|
| html | 网页、报告、Slides、PDF 的阅读单元、分页、密度、展项与说明、可收起的内容 | [html](html/README.md) |
| video | 分镜、每段时间承载的信息、旁白与画面的分工、TTS、字幕、渲染与导出 | [video](video/README.md) |

两条流水线交付前都按 [内容与媒介验收](verification.md)检查，从风险最大的一面开始。新流水线在真实任务需要时建立。模板、画幅、TTS provider 与 voice、风格等可调参数以后写成 preset，不写进编排规范。
