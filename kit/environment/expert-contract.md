# 领域 Kit 与运行消费者

| 概念 | 负责内容 | 归属 |
|---|---|---|
| Role / Expert | 持续工作职责、能力入口、review 和交接责任 | 消费宿主定义 |
| Kit | 领域语法、规则、证据、模板、契约与演进 | Praxis 维护 |
| Skill | 触发条件、必要输入、步骤、产物和验收 | 按任务引用 Kit 的有限入口 |
| Tool / Adapter | 动作、输入输出、权限与失败契约 | 实现项目 |
| Runtime | 执行生命周期、工具调用与恢复 | 消费宿主 |
| Provider / Model | 服务通道与账号约束 / 可替换的推理选择 | 环境与运行配置 |

Praxis 是可由多个角色消费的领域 Kit。角色名称、模型或服务通道变化时，工作身份、状态归属和账号权限按消费契约持续维护。Kit、Skill 和角色文档遵守宿主指令层级与用户授权。

## 消费登记

| 字段 | 填写内容 |
|---|---|
| consumer / role | 宿主、角色、工作职责与负责人 |
| kit_revision / entry | 固定 commit 或版本、需要的契约和任务入口 |
| capabilities / runtime | 能力、执行方式、Provider 与 Model 选择依据 |
| scope / review | 账号、数据、工具权限、人工确认与批准范围 |
| state_authority / mapping | 工作项、义务、事件与已确认状态的权威位置；本 Kit 概念到宿主字段的映射 |
| handoff / recovery | 产物接收、未决责任、错误升级与恢复 |
| verification / migration | 使用证据、兼容范围、升级重验与回退 |

同一 Kit 可分别供 Attention、Expert 或材料处理角色消费；每个消费者登记自己的 scope 与状态权威。Courtwork、Hermes 等具体接入保持待验证，设计线索见 [消费分流](../../docs/governance/consumption-map.md)。

## 方法入口与替换

Skill 引用所需契约和索引，保留触发条件、输入、步骤、产物与验收。模型或 harness 替换使用相同任务与标准比较质量、错误、人工修正和实际费用。

执行日志存消费环境；可复用的规则、fixture、评估结论与迁移记录经入账返回 Kit。训练用途需独立的数据权限、用途批准和效果验证。

裁决见 [ADR-010](../../docs/decisions/010-domain-kit-consumers.md)。
