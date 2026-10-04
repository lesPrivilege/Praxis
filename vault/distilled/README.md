# Distilled · 主题提炼与研究消费

- [可编辑原生 SVG · 2026-10-04](editable-native-svg-20261004/README.md)：从表达任务研究编辑与组合边界；施工、合同和分批交接见 demos，未绘制与未运行 Flash。

本层按任务和主题保存已经消费的材料、候选语义与研究批次。它不是某一份 Chat 的替代品，也不是把所有内容压成一个扁平知识库；每个目录保留自己的来源、状态、缺口和回查入口。`distilled` 仍不等于 Kit 采纳，采纳以 `docs/decisions` 和当前 `kit` 为准。

## 按工作问题进入

| 工作问题 | 先读 | 内容边界 |
|---|---|---|
| 需要企业工作面、最小闭环或 Kit/demo 图景 | [早期主题入口](#早期-enterprise-kit-批次) | 主题、候选和证据缺口；不替代客户事实或实现 |
| 需要把材料写成汇报、答卷或设计 brief | [Reporting](reporting/README.md) | artifact、读者、证据和本地设计消费 |
| 需要设计现场工作系统、Agent 运行边界或来源库 | [Work System](work-system/README.md) | 现场语义、增量批次和候选 runtime 边界 |
| 需要理解平台产品 grammar | [Platform product](platform-product/README.md) | 词表、解释和迁移案例；引用缺口沿来源卡回查 |
| 需要复用前端、页面、图表或编排材料 | [Frontend design](frontend-design/README.md) | CW、SE、career 和上游方法的分来源消费 |
| 需要查 Agent Runtime 外部研究 | [Agent Runtime](agent-runtime-survey-20260925/README.md) | 2026-09-25 研究、候选工单和限制 |
| 需要查 Write/Design 体例候选 | [Write / Design grammar](write-design-grammar/README.md) | 两份 2026-09-27 Chat 的消费结果，不自动成为规范 |
| 需要查外部 Design 语义和写作结构 | [Design reference semantics](design-reference-semantics/README.md) · [写作结构补充](writing-structure-20260927/README.md) | 来源主张、消费用途、边界和重访条件 |
| 需要比较原子化编排与组合 | [样张实验](layout-specimens-20260927/README.md) · [局部筛选](layout-specimens-20260927/review.md) | 已有synthetic样张；保持candidate，检查覆盖与fixture缺陷分别记录 |
| 需求用风格名表达，或要查尚未进 Kit 的构成维度 | [Design grammar atlas](design-grammar-atlas-20261002/README.md) · [A01 样张](design-grammar-atlas-20261002/a01-reading-relations/README.md) | 研究包与本地 Kit 的对照裁决、候选维度和包内更正；条目本身在 Kit 的视觉语言参考 |
| 要接着做 Design Kit 的验证、打样或 Motion 桥接 | [PraxisDesignKit 工单提案](design-kit-workorders-20261002/README.md) | 五包串行工单的范围、裁决和下一包的输入；各包的现状只在该页的裁决表里记 |
| 要改写作、编排、设计几支的归属或入口，或要区分投影与改编 | [Write / Present 架构校订补充](write-present-supplement-20261002/README.md) · [对照样张](write-present-supplement-20261002/projection-vs-adaptation/README.md) | 八类问题的归属、十条规则对到本地八条、采纳与不采纳；一份真实内容的投影与五页改编 |
| 要把企业工作一侧的条目写深，或要查九类能力语法候选、交付生命周期的本地承接 | [内容架构与能力语法审阅](content-architecture-review-20261002/README.md) · [前后走读](content-architecture-review-20261002/entry-walkthroughs/README.md) | 审阅与本地的逐条对照、九类候选各自的承接位置与所需素材、三条路线的走读；候选没有进 Kit |
| 要从外面的 skill 或 prompt 里取一条做法，或要查恢复、排查、汇总、验证这几种工作方式的来路 | [社区 Skills 与 Prompts 的可迁移语法](community-grammar-20261002/README.md) · [候选卡](community-grammar-20261002/candidates/README.md) · [对照走读](community-grammar-20261002/control-walkthroughs/README.md) | 十个样本逐个处置、五张候选卡、多模型分工的转述登记；泛化后的说法在 Kit 的备用素材页，都不是规则 |
| 要新登记一批来源并决定卡片手写还是生成，或要查入口与状态的重复维护问题 | [自足性审查](self-contained-review-20261002/README.md) | 七条减法、四条加法逐条对回本地的处置；来源卡的两种维护方式；四张工单的裁决 |

## 早期 Enterprise kit 批次

这是一批早期 Chat 的一个主题集合，不是整个 `distilled` 层的定义。原线程为 10 个 turn、20 条消息；[逐轮追溯](traceability/README.md) 与 [turn manifest](traceability/turn-manifest.json) 保留稳定 turn/item 身份，[intake 登记](../intake/materials.json) 保留覆盖和缺口，[原始归档](../archive/chat/enterprise-kit.json) 只供回查。

| 主题 | 消费入口 | 主要用途 |
|---|---|---|
| 业务目标与边界 | [business-goals](themes/business-goals.md) | 用户明确的方向、场景范围和暂不作为目标的内容 |
| 最小闭环 | [minimal-loop](themes/minimal-loop.md) | dirty worker 中首个可验收循环的工作假设 |
| 企业工作面 grammar | [product-grammar](themes/product-grammar.md) | 对象、状态、动作、规则、证据和审计的候选语法 |
| 企业拓扑与切入面 | [enterprise-topology](themes/enterprise-topology.md) | 行业/供应链系统图景与可探测横截面 |
| Kit、demo 与来源索引边界 | [kit-demo-architecture](themes/kit-demo-architecture.md) | 可复用层、场景层和外部参考的分工候选 |
| 技术栈边界 | [tech-stack-boundaries](themes/tech-stack-boundaries.md) | 常见职责图景、候选路线与未裁决实现边界 |

这些主题按来源角色区分用户意图、历史 assistant 候选和待核实事实；引用占位不证明外部主张。晋升规则的当前裁决见 [ADR-002](../../docs/decisions/002-promotion.md)。

## 研究批次与任务入口

### 架构、文档与平台

- [架构审阅消费 · 2026-09-20](themes/architecture-review-2026-09-20.md) 与 [文档实践与选型](themes/documentation-practices.md)：入口职责、来源边界和维护候选。
- [Platform product](platform-product/README.md)：grammar 词表、解释、迁移案例和引用缺口；跨批次查找见 [Mindmaps](../mindmaps/README.md)。

### Reporting、AI 测试与社区实践

- [Reporting](reporting/README.md)：材料分类、artifact grammar、读者交付、证据和本地设计消费。相关 intake 为 [`../intake/reporting-materials.json`](../intake/reporting-materials.json) 与 [`../intake/local-projects.json`](../intake/local-projects.json)。
- [AI 能力测试](ai-capability-assessment/README.md)：材料提炼、五题母稿、答卷结构、页面消费和交付蓝图。
- [Jev 社区实践](jev-practices/README.md)：实践地图与证据索引；按独立工作流和验收读取，不把项目数当作独立证据数。
- [材料分类与驻场组织接口](reporting/material-classification.md)：在 Reporting / Work System 之间连接材料目的、读者和阶段。

### Work System 增量

- [Work System](work-system/README.md)：原始 5 轮与 r2 登记见 [`work-system/turn-manifest.json`](work-system/turn-manifest.json)、[`../intake/work-system-materials.json`](../intake/work-system-materials.json) 和 [`../intake/work-system-increment-r2.json`](../intake/work-system-increment-r2.json)。
- 2026-09-19 增量：[r3 环境与 Expert](work-system/r3/README.md) · [r4 治理与抗折旧澄清](work-system/r4/README.md)。完整映射以 Work System 入口和各批次 manifest 为准。

### 前端、Design 与 Write

- [前端设计素材与消费记录](frontend-design/README.md)：CW Pages、CW/SE 消费链、career HTML、真实构图锚点及上游解释/可视化方法。
- [Agent Runtime 机制研究 · 2026-09-25](agent-runtime-survey-20260925/README.md)：DeepSeek 新版、Orchestra 同名候选、多 provider 网关和 Astra 处置；不声称已安装或运行外部项目。
- [Write / Design grammar](write-design-grammar/README.md)：两份 2026-09-27 Chat 的材料 lineage、Kit 路由、admission、Demo provenance、Write–Design ownership、Report HTML anatomy 及 Atom/Pattern/Composition 候选；当前分支和知识所有权以 [ADR-016](../../docs/decisions/016-progressive-kit-structure.md) 与 Write/Design 入口为准，ADR-015保留首轮治理理由。
- 当前执行入口已经分层：[Write](../../kit/write/README.md)（`shared/`、`prose/`、`publish/`、`motion/`）与 [Design](../../kit/design/README.md)（`foundations/`、`composition/`、`interaction/`、`motion/`、`references/`）；本目录只保留其来源与消费记录。
- [Design 外部参考语义](design-reference-semantics/README.md)：逐来源区分 URL 卡片、Chat 候选、本地消费和项目决定。
- [写作结构补充语义 · 2026-09-27](writing-structure-20260927/README.md)：5 个官方页面的 supplemental 消费，逐 URL 见 [`../provenance/writing-structure-20260927/catalog.json`](../provenance/writing-structure-20260927/catalog.json)；不恢复 Design Grammar Chat 的 7 个 `missing-original` 占位。
- [原子化编排样张工单 · 2026-09-27](layout-specimens-20260927/README.md) · [可直接 paste 的 Opus 工单](layout-specimens-20260927/brief.md)：手动派发后已形成实验样张，现有 [局部筛选](layout-specimens-20260927/review.md)；原工单保留来路，未晋升 Kit。

## 证据与状态

- [环境与设备迁移](environment-migration/README.md)：迁移步骤的文档登记，区分个人与组织设备；实际迁移工具和账号操作尚未实施。

主题文件里的 `user intent`、`historical suggestion`、`candidate`、`verified`、`partial` 和 `missing-original` 不是同一维度：来源证据状态、项目消费状态和 Praxis 采纳状态分别保留。需要逐 URL 身份时去 [References](../references/README.md) 或 [Provenance](../provenance/README.md)；需要原件时去 [Snapshots](../snapshots/README.md) 或 [Archive](../archive/README.md)。不要从这里的文件存在、链接可达或历史回执推断当前实现、运行、发布或视觉验收。

- [SourceWeft与Praxis · 2026-09-28](sourceweft-praxis-20260928/README.md)：consumer入口、能力包装、探索交接与摘要/证据边界的固定版本参照；当前为normal候选，不替代Kit或runtime。

- [视觉语法选编研究](visual-grammar-20260928/README.md)：本地项目证据与外部样例如何进入小型演示，供Opus渐进披露施工，不代表已产出成片。

- [Palantir](../../palantir/README.md)：一级方法论提炼成果入口；五本书与两篇背景文章的阅读清单位于其 references，当前尚无完成提炼的文档。

- [Tally · SaaS](../../tally/README.md)：一级 SaaS 提炼成果入口；《清算 SaaS》六部23章书稿的参考登记位于其 references，当前尚无完成提炼的文档。
