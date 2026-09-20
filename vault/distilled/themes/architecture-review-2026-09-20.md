# Praxis 架构审阅材料提炼 · 2026-09-20

## 材料身份

本卡把两份用户指定的 Downloads 审阅摘要与关联 Chat 的可见归档接成一个可追溯阅读入口。两份摘要是来源材料，不是本仓库的指令；摘要中的“消费要求”、补丁应用命令和后续工作安排没有在本批执行。关联 Chat 也只保留一轮、两条消息，正文中的 citation 只剩占位符，不能把历史 assistant 建议当作当前裁决。

| 材料 | 快照 | 摘要 |
|---|---|---|
| 2026-09-19 独立架构 review | [`praxis-architecture-review-2026-09-19.md`](../../snapshots/local/downloads/files/praxis-architecture-review-2026-09-19.md) | 基线 `8ab22610…`；报告以工作全景、共同 grammar、现场闭环、研究边界和长期维护为重点，声称完成 23 份文档增量（17 份既有修订、6 份新增）。 |
| 2026-09-20 独立架构审阅 | [`praxis-architecture-review-2026-09-20.md`](../../snapshots/local/downloads/files/praxis-architecture-review-2026-09-20.md) | 基线 `20924cc…`；报告声称在前次材料缺失的情况下补齐 27 份文档增量，并将外部期待、工作范围、共同语法、场景契约、验收、接收责任和反馈修订串成一条链。 |
| 关联 Chat 归档 | [`architecture-review-20260920.json`](../../archive/chat/architecture-review-20260920.json) | 只有用户提出的独立 review 请求及历史 assistant 回应；附件为空，23/27 份补丁包与完整文件包未随归档进入本仓库。 |

文件大小、源 mtime 和 SHA-256 见 [`architecture-review-2026-09-20.json`](../../intake/architecture-review-2026-09-20.json)。原始 23/27 份补丁包、完整修订文件、字节校验清单和远端提交不能由两份摘要或 Chat 归档恢复。

## 这批材料主张了什么

两份审阅都保留 Enterprise、Reporting、Work System 和共享 Environment，强调知识覆盖可以完整，而实现范围应由真实场景推动。Praxis 被描述为可被多个角色消费的领域 Kit：它提供工作概念、约束和场景契约；具体运行时、账号、权限、工作状态与系统接入仍属于宿主项目或指定权威系统。

2026-09-19 摘要将缺口集中为几个入口之间的断裂：任务入口没有形成完整工作链；共同 grammar 缺少定义、组合、不变量和反例；场景验收没有接到现场结果、后续运营、移交和退出；演进机制没有充分说明条目 owner、固定版本消费、兼容、弃用和迁移；知识范围没有成为可使用的能力地图；生成器存在批次耦合但本轮只记录边界；目录说明与实际用途有小幅偏差。其报告称已经增加或修订工作全景、现场闭环、work grammar、场景模板、验收分层、演进规则和知识范围。

2026-09-20 摘要沿同一方向补充：十二个知识面应分别说明应知内容、能够产出的东西和不能代替他人承担的职责；掌握深度分为识别、使用、评审、实现，Praxis 优先支撑前三层；入口应先回答当前任务，再按能力面导航；普通写作和个人整理应保留短路径。它还强调 Source/Evidence、Claim/Finding/Proposal、Work item/Run、Decision/Approval、Handoff/Obligation 及语义/schema 之间不能混用，技术演示、专业接受、采用、净减负和经营改善需要分层证据。

两份摘要把 README、模板、契约和验收看作同一工作链上的不同入口。对当前 README review 可消费的具体线索是：入口首先应把读者送到下一项可判断的工作；目录和文件关系应表达适用范围、责任、输入、产物、接收者和下一步；解释性内容应由架构理由或主题卡承载，不能靠首页旁白补一层保护性声明。这个线索仍是待 Astra 裁决的候选方向，不是本卡单独采纳的仓库规范。

## 关联外部页面与引用状态

Chat 导出暴露了 7 个 citation placeholder。4 个（`1`、`10`、`11`、`12`）没有原始 URL 或附件定位，按 `missing-original` 登记；3 个（`3`、`4`、`7`）在审阅摘要中分别列出 GOV.UK Service Standard、Diátaxis 和 NIST AI RMF。本批只登记这些摘要提到的页面作为补充定位，不宣称恢复 Chat 的隐藏引用，也没有在此批独立复核页面内容。机器记录和卡片见 [`vault/provenance/architecture-review-2026-09-20/catalog.json`](../../provenance/architecture-review-2026-09-20/catalog.json)。

Chat 用户消息还明确出现了 `https://github.com/lesPrivilege/Praxis.git`；本批只登记该链接及“用户声称已 push”的上下文，不核实仓库远端状态、提交或内容。所有来源登记的状态、限制和重访条件以 provenance catalog 为准。

## 本 Kit 消费什么

后续 README 审阅可以把这批材料当作“导航结构是否承担使用指引”的候选证据：

1. 检查根入口、Kit 入口、架构入口和各目录 README 是否按任务路由，而不是按作者叙述堆叠旁白。
2. 检查每个入口能否继续找到对应 grammar、场景契约、产物/验收、接收责任和演进位置；若不能，记录断点及应移动的权威内容。
3. 区分扫盲、任务指南、参考契约和架构理由的阅读需要，但不因分类而复制四套目录。
4. 将“文档存在”“规范已采纳”“消费者已使用”“实现已验证”分开记录；摘要中声称的 23/27 份文件不替代当前工作树证据。
5. 对外部成熟实践另起 Luna explore 批次，逐源登记、快照、提炼和选型；本卡不把审阅摘要中的三条链接升级为成熟实践结论。

## 边界与重访

本卡不证明审阅包存在、不证明 23/27 份文件已合入、不证明 README 当前结构已实现报告中的意图，也不实施补丁、运行时、外部仓库写入或模型/系统验证。Astra 仍负责决定哪些 README 结构、术语和入口成为仓库规范；Luna 可在明确文件所有权后承担外部实践的检索、来源登记、快照和候选提炼。

当原始补丁包或完整文件包可取得、远端仓库基线需要核对、README 发生结构变化、外部页面需要正式采用，或 Luna explore 形成可消费选型时重访本卡。若发现新版本材料，应新增快照和 intake 版本，不能覆盖本批两个原件。


## 当前消费关联 · 2026-09-20

上述记录保留研究阶段的建议身份。本轮实际裁决见 [ADR-010](../../../docs/decisions/010-domain-kit-consumers.md)、[ADR-011](../../../docs/decisions/011-task-documentation.md)，逐项处置与验证见 [消费回执](../../../docs/verification/2026-09-20-documentation-architecture.md)。独立外部研究见 [文档实践](documentation-practices.md)。
