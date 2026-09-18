# Vault

默认阅读 [主题提炼](distilled/README.md)，汇报工作直达 [汇报与设计](distilled/reporting/README.md)。

| 层 | 入口 | 用途 |
|---|---|---|
| Intake | [登记](intake/README.md) | 材料身份、处理与覆盖 |
| Distilled | [主题](distilled/README.md) | 已消费知识，优先使用 |
| References | [来源卡](references/README.md) | 明确外部URL摘要 |
| Provenance | [追溯](provenance/README.md) | 缺失原引用、补充官方验证 |
| Snapshots | [快照](snapshots/README.md) | 本地原件和依赖的离线副本 |
| Archive | [备查](archive/README.md) | 原Chat，非主阅读路径 |

依照 [入账规范](../docs/governance/intake.md) 扩展。研究登记不等于本repo采纳。

原始输入总账：[chat-inventory.json](chat-inventory.json)，保留3份对话的32轮/64消息、137引用占位和29明确外链身份；消费覆盖另见intake。

统一消息与外源消费索引：[registry.json](registry.json)。其字段统一来源身份、摘要、证据状态、限制与重访条件；详细分类catalog保留特有证据信息。更新后按 [脚本说明](../scripts/README.md) 重建。
