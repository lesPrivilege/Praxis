# 当前采纳与跨项目消费

这张表记录材料要交给谁、处于什么状态。列为跨项目候选，不代表已在对方repo落地或获得其owner采纳。

| 内容 | 消费方 | 当前裁决 | 后续触发 |
|---|---|---|---|
| Goal、入账、来源与增量规范 | Praxis | 已采纳 | 新证据或范围变化触发修订 |
| 企业工作grammar与场景边界 | Praxis | 已采纳契约，未实现运行demo | 实际scenario开工 |
| Reporting grammar / anti-slop /视觉验收 | Praxis | 已采纳基本约束 | 实际artifact反馈校准 |
| Environment/data/identity边界 | Praxis | 已采纳契约，bootstrap待实现 | 新机器或实际环境部署任务 |
| Agent模型/用量/run ledger | Praxis | 字段与unknown原则已采纳 | 获取真实telemetry后实现 |
| 薄Skill执行入口 | Praxis或宿主Skill库 | 组织原则已采纳，未安装新Skill | 高频工作方法与验收稳定 |
| 领域 Kit 被 Attention / Expert / 材料处理角色消费 | Courtwork 或其他宿主 | 语义映射要求已采纳；具体角色、Hermes 接入与 GUI 仍为候选 | 宿主 owner 指定状态权威，登记版本、scope 并验证 |
| managed Expert的权限/state/extension绑定 | Courtwork runtime | 交接候选 | 有接口契约、实现与运行验证 |
| 独立Praxis Agent、profile/bundle/fork | 后续runtime适配项目 | 延后实现；外部能力按来源状态消费 | 通用agent路径出现可复现缺口 |
| semantic trace用于worker后训练 | 未来评估/训练项目 | 研究候选 | 数据权限、训练方案和效果验证齐备 |

本次没有更改Courtwork源码、其他repo、全局Agent配置或模型路由。任何未来移交都应带Kit revision、来源ID、已采纳/候选边界、未验证项和验收要求。

本表依据 [架构理由](../architecture/rationale.md)、[ADR-007](../decisions/007-environment-expert.md) 与 [r3提炼](../../vault/distilled/work-system/r3/README.md)。

本次发布基线（2026-09-19）：用户明确确认当前材料不存在企业数据。企业数据分区是未来环境设计约束，不应被误写为当前仓库存在客户资料，亦不据此额外阻塞本轮已授权推送。

2026-09-20：按 [ADR-010](../decisions/010-domain-kit-consumers.md) 更新多角色消费行；原 Praxis Expert / composer 方案保留在来源与历史裁决中。消费宿主接入尚未验证。
