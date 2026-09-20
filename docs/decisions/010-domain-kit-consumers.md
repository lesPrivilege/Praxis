# ADR-010：领域 Kit 与运行消费者

状态：accepted（2026-09-20，Astra 编订）

## 问题与证据

原 Expert 契约把“Praxis Expert”作为未来运行角色，容易将领域知识绑定到一种身份。两份审阅与关联会话提出多角色消费及状态归属问题，见 [消费提炼](../../vault/distilled/themes/architecture-review-2026-09-20.md)。

## 决定

Praxis 维护领域 Kit；Role、Skill、Runtime、Provider 与 Model 分别登记。消费宿主指定工作项、持续义务和确认状态的权威位置，按 [消费契约](../../kit/environment/expert-contract.md) 映射语义、固定版本、scope 与交接责任。

## 兼容与验证

替代原契约中必须以“Praxis Expert”承载知识的隐含预设。已有消费者名称可保留，补登记状态归属和版本；模型更换沿用工作身份。当前无已实现消费者，兼容性待各消费项目验证。

审阅提到的 Attention / Hermes / Courtwork 关系作为接入候选，由相应项目决定和验证。ADR-007 的权限、环境和用量边界继续有效。
