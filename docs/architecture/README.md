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
| [dsh-praxis](../../dsh-praxis/README.md) | 个人 FDE 工作 Kit（Task、Writing、Design、Publish）与控制面；挂载维护信息、预设与运行记录在 dsh-praxis/data | 消费到任务、DSH 插件与 MCP |
| [projects](../../projects/README.md) | 一切交付与实验：教材、讲解页、视频、语法工场；场景契约模板在 [templates/scenario](../../templates/scenario/README.md) | 验证、反馈、登记产物 |

知识晋升：`vault → docs/decisions → kit → projects`（[ADR-044](../decisions/044-repository-layout-by-role.md)）。

运行依赖：`客户 overlay → 行业 scenario → kit`；Kit 的运行代码不得依赖客户逻辑。

## 一级主题入口

- [palantir](../../projects/palantir/README.md)：一级提炼入口；7 个对象已有不同范围原件（3 个全文、3 个片段、1 个仅元数据）及 Vault 候选笔记，尚无主题正文与 Kit 采纳，材料参考见 [`projects/palantir/references`](../../projects/palantir/references/README.md)。
- [tally](../../projects/tally/README.md)：一级提炼入口；当前仅有《清算 SaaS》书稿登记，材料参考见 [`projects/tally/references`](../../projects/tally/references/README.md)。

主题目录保存已接收的提炼正文，`references` 提供材料入口；Chat 原文、会话溯源、入账记录与快照由 Vault 保存。Kit 采纳结果见决策记录。

## 表达与设计的跨域消费

内容表达按 [dsh-praxis 分层体例](../../dsh-praxis/layers.md)分工：[Task](../../dsh-praxis/kit/task/README.md)负责材料目的与组织决定，[Writing](../../dsh-praxis/kit/writing/README.md)负责成文与内容组织，[Publish](../../dsh-praxis/kit/publish/README.md)按媒介编排与制作，[Design](../../dsh-praxis/kit/design/README.md)以视觉、交互和运动判断支持它们。三者按任务组合取用，不是依次都要过的流程；规则的归属与强度见 [ADR-019](../decisions/019-expression-owners-and-entry-paths.md)。Skill 为有界入口，知识正文通过目录渐进读取，迁移见 [ADR-016](../decisions/016-progressive-kit-structure.md)。

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

Praxis 插件下一轮的工作见 [下一轮工单](../../dsh-praxis/work-order.md)：先自用跑通，再拆出 release。已实施的产物取用设计见 [架构参考](../../dsh-praxis/architecture.md)与 产物工单，裁决以 ADR 为准。

首个实现从 [场景模板](../../templates/scenario/README.md) 和 [Demo 准入](../../projects/README.md) 开始；技术候选见 [架构理由](rationale.md#实现候选与触发)。

2026-10-26：本文提到的 `../../dsh-praxis/work-order-artifacts.md` 已按 ADR-044 删除，结论以本文和回执为准；登记见 `docs/governance/retired-paths.json`。
