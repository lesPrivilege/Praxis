# Enterprise kit 对话提炼

本目录是对 `vault/archive/chat/enterprise-kit.json` 的结构化消费结果。源线程包含 10 个 turn、20 条消息，见 [`traceability/turn-manifest.json`](traceability/turn-manifest.json)。

## 阅读顺序

1. [`themes/business-goals.md`](themes/business-goals.md)：用户明确的业务方向与目标边界。
2. [`themes/minimal-loop.md`](themes/minimal-loop.md)：在 dirty worker 环境中验证首个小闭环的工作假设。
3. [`themes/product-grammar.md`](themes/product-grammar.md)：企业工作面的对象、状态、动作、规则、证据和审计语法。
4. [`themes/enterprise-topology.md`](themes/enterprise-topology.md)：大型行业/供应链企业的中台拓扑及可插入的横截面。
5. [`themes/kit-demo-architecture.md`](themes/kit-demo-architecture.md)：Kit、场景 demo、客户配置与引用索引的边界。
6. [`themes/tech-stack-boundaries.md`](themes/tech-stack-boundaries.md)：对话中出现的技术栈图景、默认路线与尚未裁决的边界。

主题目录的每个结论都标注了来源角色：

- **用户明确意图**：来自原始用户消息，可作为当前方向依据。
- **原 assistant 建议**：来自历史回答，只是候选方案或解释，不能替代用户裁决。
- **待核实事实**：需要重新检查来源、客户现场或后续实验；原文中的外部引用占位不能证明事实。

本提炼记录主题与候选治理，不替代仓库的根架构决策；promotion 的当前裁决见 [`docs/decisions/002-promotion.md`](../../docs/decisions/002-promotion.md)。原始 JSON 仍是备查材料，优先使用本目录的结构化文件。

Reporting 与本地设计材料入口：[`reporting/`](reporting/README.md)、[`../intake/reporting-materials.json`](../intake/reporting-materials.json)、[`../intake/local-projects.json`](../intake/local-projects.json)。

Work System 入口：[`work-system/`](work-system/README.md)，原始 5 轮登记见 [`work-system/turn-manifest.json`](work-system/turn-manifest.json) 与 [`../intake/work-system-materials.json`](../intake/work-system-materials.json)，r2 增量（4 轮/8 条消息）见 [`../intake/work-system-increment-r2.json`](../intake/work-system-increment-r2.json)。

最新增量：[r3 环境与 Expert](work-system/r3/README.md)、[r4 治理与抗折旧澄清](work-system/r4/README.md)。完整增量导航以 [Work System 入口](work-system/README.md) 为准。
