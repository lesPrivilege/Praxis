# Enterprise kit intake

[`materials.json`](materials.json) 是本次 intake 覆盖登记：包括源线程元数据、全部 10 轮、全部 20 条消息、每条消息的主题映射和消费状态。

## 缺口

- 归档文本中的 `:chatgpt-content-reference{index="..."}` 只保留了引用占位，无法从该 JSON 还原具体来源 URL、标题或正文；相关主张均标为待核实。
- 源数据没有可消费的附件条目；本次按“附件为空”登记，不推断是否存在对话外附件。
- 用户提到的 CW 治理、Jev/结构化模型、企业内部平台状态等上下文在本线程没有可独立验证的附件或定义；保留为上下文线索，不把它们展开成事实。

本目录只负责 intake 与缺口登记；不重复保存 raw 对话全文。

Reporting / 本地设计材料：[`reporting-materials.json`](reporting-materials.json)、[`local-projects.json`](local-projects.json)。结构化阅读入口为 [`../distilled/reporting/README.md`](../distilled/reporting/README.md) 与 [`../distilled/reporting/local-design.md`](../distilled/reporting/local-design.md)。

Work System 材料：[`work-system-materials.json`](work-system-materials.json)（原 5 轮/10 条消息）、[`work-system-increment-r2.json`](work-system-increment-r2.json)（r2 4 轮/8 条消息）；结构化阅读入口为 [`../distilled/work-system/README.md`](../distilled/work-system/README.md)。

Downloads登记：[downloads.json](downloads.json)；[主题提炼](../distilled/reporting/downloads.md)。统一消息与来源索引：[registry.json](../registry.json)；快照完整性：[snapshot-manifest.json](../snapshot-manifest.json)。

后续完整增量：[r3 登记](work-system-increment-r3.json)（10 轮/20 消息）、[r4 登记](work-system-increment-r4.json)（1 轮/2 消息）。

[建立材料分类体系登记](material-classification.json)：独立对话 2 轮/4 消息，无外部 URL 或 citation。

[平台类产品 grammar 扫盲](platform-grammar-20260922.json)：原线程读取 6 轮/12 消息，按主题归档 4 轮/8 消息；11 个 citation placeholder 登记为 `missing-original`。后续消费入口预留为 [`../distilled/platform-product/README.md`](../distilled/platform-product/README.md)、[`../distilled/platform-product/outline.md`](../distilled/platform-product/outline.md) 与 [`../distilled/platform-product/annotated.md`](../distilled/platform-product/annotated.md)。

## 架构与文档增量 · 2026-09-20

- [审阅入账](architecture-review-2026-09-20.json)：两份原件、1 轮/2 消息、7 个引用占位及交付缺口。
- [文档实践研究](documentation-practices-2026-09-20.json)：6 个官方 URL 的问题、证据、选型建议与未快照依赖；[来源登记](../provenance/documentation-practices/catalog.json)。

[AI 能力测试登记](ai-capability-assessment-20260923.json)：r2 8 轮/11 条可见消息（保留 r1）、3 个附件原件与逐消息覆盖；[消费入口](../distilled/ai-capability-assessment/README.md)。

[Jev社区研究包增量](jev-community-20260923.json)：4个包文件与1份粘贴文本；24个历史来源入口另行核查，逐项状态见[实践索引](../distilled/jev-practices/README.md)。

[CW Pages召回](cw-pages-recall-20260923.json)与[career HTML召回](career-html-recall-20260923.json)：实际图式/编译入口、展示HTML、定向快照和未保存依赖，供[五页答卷](../distilled/ai-capability-assessment/five-page-outline.md)消费。

[CW前端消费链](cw-frontend-consumption-20260923.json)与[SE前端消费链](se-frontend-recall-20260923.json)：统一归入[前端设计资料目](../distilled/frontend-design/README.md)。

[用户Q1截图审阅](assessment-layout-review-20260923.json)与[真实编排参考](frontend-composition-anchors-20260923.json)：保存当前问题证据与历史设计参考，二者不混作当前页面验收。
