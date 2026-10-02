# Environment

三个消费域共用的环境契约。当前提供盘点、数据分区、消费角色与用量规则；bootstrap 和运行接入尚未实现。

| 步骤 | 入口 | 产物 |
|---|---|---|
| 盘点机器、账号、能力与缺口 | [环境与数据分区](workspace-contract.md) | 带 scope 的 inventory 与计划 |
| 定义消费角色及状态归属 | [领域 Kit 与运行消费者](expert-contract.md) | 固定 Kit 版本、权限、review 与交接契约 |
| 安排 Agent 分工与预算 | [使用与额度登记](agent-usage.md) | 执行计划与实际用量记录 |
| 执行与验收 | [统一验收](../verification/README.md) | 授权范围内的操作和验证回执 |

安装、账号操作、读取企业资料及外发内容以用户授权为准。真实账号、secret、企业资料和运行状态按环境分区管理。

理由与证据：[ADR-007](../../docs/decisions/007-environment-expert.md)、[ADR-010](../../docs/decisions/010-domain-kit-consumers.md)、[r3 提炼](../../vault/distilled/work-system/r3/README.md)。

## 任务参考路由

需要比较 Agent runtime、provider/model 路由、session 恢复或调度边界时，先读 [Agent Runtime 机制研究（2026-09-25）](../../vault/distilled/agent-runtime-survey-20260925/README.md)，再按问题进入 [消费边界](../../vault/distilled/agent-runtime-survey-20260925/consumption-boundary.md)、[三网关对照](../../vault/distilled/agent-runtime-survey-20260925/gateways.md) 或 [Astra 裁决与候选工单](../../vault/distilled/agent-runtime-survey-20260925/disposition.md)。消费的是 route/attempt、配置与凭据分离、attach/resume、retry/unknown outcome 等候选接缝；该研究明确以 2026-09-25 为时间锚点，外部项目未安装或运行，候选工单也不是施工许可。

| 需要 | 参考入口 | 消费与边界 |
|---|---|---|
| 身份、账号、策略或对象级授权 | [governance 参考族](../../vault/references/governance/README.md) | 查 Keycloak、OPA、OpenFGA 的对应 grammar；用于补齐 scope、policy、decision 与 relation，不继承外部实现或安全保证 |
| 长任务的恢复、重试和 worker 边界 | [workflow 参考族](../../vault/references/workflow/README.md) | 查 Camunda/Temporal 卡片的 process/runtime 或 workflow/activity 区分；不代表本机已安装或已选择引擎 |

本页的运行能力状态仍以 inventory、授权和验收回执为准；参考研究不能替代实际机器、账号、租户或版本检查。

冷启动时只从需求进入：先用任务词定位上表，再沿研究页的“需要→语义”入口选择对应材料；研究页和 [Agent Runtime 快照索引](../../vault/snapshots/agent-runtime-survey-20260925/README.md) 提供日期、版本、来源与证据定位。只有验收、冲突或缺口需要时才回查快照原件，不要求先读完整批次，也不需要知道材料名才能开始。
