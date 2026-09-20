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
