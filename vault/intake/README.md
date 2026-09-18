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
