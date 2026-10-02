# 架构

Praxis 由 Enterprise、Reporting、Work System 三个消费域和共享 Environment 组成。任务入口见 [Kit](../../kit/README.md)，设计取舍见 [架构理由](rationale.md)。

## 内容归属

| 位置 | 权威内容 | 下一步 |
|---|---|---|
| [vault/intake](../../vault/intake/README.md) | 材料身份与覆盖 | 快照、提炼 |
| [vault/distilled](../../vault/distilled/README.md) | 研究结论与候选 | 查证、提出采纳 |
| [vault/references](../../vault/references/README.md) / [provenance](../../vault/provenance/README.md) | 逐 URL 来源、引用恢复与缺口 | 支持或修订主张 |
| [vault/snapshots](../../vault/snapshots/README.md) / [archive/chat](../../vault/archive/chat/README.md) | 版本原件、原始对话 | 按定位回查 |
| [docs/decisions](../decisions/README.md) | 接受、延后、拒绝及其理由 | 更新规范 |
| [kit](../../kit/README.md) | 当前定义、契约与验收规则 | 消费到任务 |
| [scenarios](../../scenarios/README.md) / [demos](../../demos/README.md) | 闭环定义 / 演示实现 | 验证、反馈 |

知识晋升：`vault → docs/decisions → kit → scenario/demo`。

运行依赖：`客户 overlay → 行业 scenario → kit`；Kit 的运行代码不得依赖客户逻辑。

## 一级主题入口

- [palantir](../../palantir/README.md)：一级提炼入口；当前仅有 5 本书、2 篇文章的登记，材料参考见 [`palantir/references`](../../palantir/references/README.md)。
- [tally](../../tally/README.md)：一级提炼入口；当前仅有《清算 SaaS》书稿登记，材料参考见 [`tally/references`](../../tally/references/README.md)。

这两个目录是主题的一级提炼入口；当前尚无完成提炼的成果，不应把登记当作成果。Chat 原文、会话溯源与入账记录由 `vault` 承载；材料自身参考可放对应 `references`，已有快照保留原定位，且不表示内容已经采纳进 Kit。

## 表达与设计的跨域消费

[Write](../../kit/write/README.md)以 Prose / Publish / Motion 承载内容表达，Shared 保证证据与验收一致；[Design](../../kit/design/README.md)以视觉、交互和运动判断支持这些模式。Reporting 仍负责材料目的和组织决定。Skill 为有界入口，知识正文通过目录渐进读取，迁移见 [ADR-016](../decisions/016-progressive-kit-structure.md)。

## 文档职责

| 阅读需要 | 维护位置 |
|---|---|
| 选择任务和下一步 | 各层 README |
| 理解概念及工作范围 | [工作全景](../../kit/landscape.md)、[共同语法](../../kit/grammar/work.md) |
| 执行任务、填写产物 | 工作指南、场景与材料模板 |
| 查字段、权限及失败处理 | 对应 Kit 契约 |
| 理解取舍及变更缘由 | 架构理由、ADR |
| 查实现与验证程度 | 能力目录、验收回执 |

编订规则见 [文档结构契约](documentation.md)。规则在一个位置维护，入口以任务、产物和链接连接。

## 数据与运行所有权

| 内容 | 所有者或位置 |
|---|---|
| 可复用知识与研究材料 | Praxis Kit / 研究 Vault |
| 企业原始资料 | 按组织治理的 Source Vault |
| 客户差异与真实业务状态 | 独立客户项目或宿主权威系统 |
| secret、账号与机器状态 | 受控运行环境 |
| 运行消费者与 Kit 的映射 | [消费角色契约](../../kit/environment/expert-contract.md) |

[ADR-006](../decisions/006-demo-project-vault.md) 规定项目与资料分区；[Environment](../../kit/environment/README.md) 规定环境使用条件。当前提供契约，权限执行和运行接入尚未实现。

## 实现入口

首个实现从 [场景模板](../../scenarios/_template/README.md) 和 [Demo 准入](../../demos/README.md) 开始；技术候选见 [架构理由](rationale.md#实现候选与触发)。
