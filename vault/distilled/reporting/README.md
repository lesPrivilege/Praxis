# Reporting / Artifact Grammar

这是一个独立主题：把 PM/FDE 的临时汇报、调研材料、方案说明、PPT 式 HTML、pre-read 和书面 memo 组织成可复用的 Artifact Grammar。它与 Enterprise Product Grammar 并列；前者负责“如何把判断交付给不同读者”，后者负责“企业工作面如何表达对象与状态”。

## 阅读顺序

1. [`artifact-grammar.md`](artifact-grammar.md)：claim/evidence、artifact lifecycle 与各文体 registry。
2. [`claim-evidence.md`](claim-evidence.md)：主张、证据状态、来源、版本和 ask 的契约。
3. [`audience-delivery.md`](audience-delivery.md)：读者 altitude、功能视角、技术素养、注意力预算和交付面。
4. [`writing-anti-slop.md`](writing-anti-slop.md)：写作编辑规则与 Kill AI Slop 评估。
5. [`visual-renderer-review.md`](visual-renderer-review.md)：可视化语义、页面层级、renderer 和 review。
6. [`local-design.md`](local-design.md)：Courtwork 与 career-kit 本地设计规则的离线提炼及快照入口。

7. [Downloads设计材料与HTML原型](downloads.md)：anti-slop、Schema与设计语言包的本地消费入口。

## 来源角色

- **用户明确意图**：来自 `report-design-kit.json` 的用户消息，定义新 Kit 的目的和范围。
- **原 assistant 建议**：历史回答中的 artifact registry、受众模型、可视化和反 slop 候选规则。
- **本地源规则**：从 Courtwork/career-kit 的已复制快照读取；文件中若标为 adopted/proposed，保留原状态，不自行升格。
- **待核实**：原 chat 的外部引用占位、外部产品能力、未复制的二进制视觉证据和任何客户事实。

Reporting Kit 的结构化阅读路径优先于原始 chat；原始 JSON 只用于追溯。消息覆盖与引用缺口见 [`../../intake/reporting-materials.json`](../../intake/reporting-materials.json)。

本地快照的逐文件来源、哈希、mtime 和 processing status 见 [`../../intake/local-projects.json`](../../intake/local-projects.json)。
