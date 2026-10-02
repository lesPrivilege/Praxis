# SourceWeft / Praxis 架构差异交接

状态：candidate，供 Astra/main 决定是否形成后续 contract、ADR 或 demo。  
证据范围：仅使用固定提交 f88212b91216267f3dc1053f9424010cae9de5b6 的五张 source cards；历史 Chat 只作为待消费材料。

## 差异

| 层 | SourceWeft 中核实的形态 | Praxis 当前对应物 | 可吸收的最小增量 |
|---|---|---|---|
| 入口与渐进披露 | Skill 给短 workflow，按任务读取 references、layouts、themes 和 catalog | Kit README、目录语义、薄 Skill | 把 consumer route 的“下一步读取什么”登记为候选 contract |
| 机器目录 | catalog 枚举可用主题、布局、动画和效果 | Kit 目录与来源索引偏人读 | 需要时为 consumer 建 machine index；不把 catalog 当长期规范 |
| 能力包装 | manifest 声明 id、version、visibility、tools、artifact output/publisher | Skill/Kit 的职责边界和产物验收 | 未来 adapter 可采用 manifest；Kit 只记录需要的能力语义和 provenance |
| 探索隔离 | explore 是 read-only context quarantine，结构化返回 findings 与 limitations | Luna explorer → Astra/main handoff | 将现有 handoff 的 evidence IDs、candidate increment、main decision 做成可检查字段 |
| 上下文压缩 | summary 是 memory，不是 evidence；旧 citations 移除，保留 locator hints | Vault evidence、distilled、Kit 和当前 context 已分层 | 明确压缩记忆只能导回 source card，不得直接支撑事实 claim |
| 产物生命周期 | HTML skill 把 build、QA、视觉复核、publish、revision 写入运行路径 | Reporting grammar 与 verification receipts | 只吸收“产物必须有可追溯 QA/版本基线”的候选接口，运行实现留给 consumer |

## 不应直接合并的部分

SourceWeft 的运行时实现、模型/工具选择、sandbox 语义、RAG/chunk/ranking、Skill marketplace 和产品版本状态不属于本批 Praxis Kit 知识。Chat 对 context-assembly.ts、provenance.ts、PPT skill 与 releases 的说明没有在本批核实，因此只能作为回查路线。

Praxis 也不应把 Kit 压平成可检索 corpus：外部材料先经过 consume、source grounding、generalize、review 和 promotion；manifest 或 catalog 只能帮助 consumer 找到材料，不能替代治理。

## Main 决策点

1. 是否把 Luna → Astra/main handoff schema 作为独立候选工单继续验证？
2. 是否为未来 runtime consumer 建立最薄的 capability/route manifest，且只声明可消费入口、版本和 provenance？
3. 是否在已有 Kit 文档契约中补充 memory/evidence 的回查规则，还是让现有 intake/governance 文档承载即可？

证据缺口、访问日期和重访触发见 [SourceWeft provenance catalog](../../provenance/sourceweft-praxis-20260928/catalog.json)。

## Main 当前处置

本批作为 normal runtime-consumer / capability-packaging 参考，连接到 Environment expert-contract 的后续消费路径；不作为 highweight canonical reference。memory/evidence 边界可吸收为澄清项；manifest、machine schema 和实际宿主接入仍是候选，不在本批实现。Chat 中未核查的 RC、RAG 和完整 artifact lifecycle 说法不进入处置结论。
