# Work System r4 增量提炼

本目录消费 [`work-system-toolchain-20260919-r4.json`](../../../archive/chat/work-system-toolchain-20260919-r4.json) 的新增首轮：1 轮、2 条消息。该归档共 20 轮，前 19 轮是已在 r1–r3 登记的内容；本目录只登记新增轮，不重写旧提炼。

## 阅读顺序

1. [`governance-and-durability.md`](governance-and-durability.md)：Praxis 当前规范、Courtwork/runtime 消费边界、post-training 未来消费和宿主指令层级。
2. [`../../../intake/work-system-increment-r4.json`](../../../intake/work-system-increment-r4.json)：精确 turn/item ID、角色分类和缺口。

## 身份与状态

- 用户意图：不把企业治理做成一堆普通 Skill；隔离 Coding Agent 与企业工作；保留外部结构的长期抗折旧性。
- 历史 assistant 方案：把治理规则放在 Expert/Kit/runtime 共同承载，并将 Skill 作为局部执行入口。
- 待验证：模型 attention、后训练吸收、宿主 harness 具体上下文权重和 Courtwork 现有 runtime 行为都不是本轮可证明的事实。

Expert→Kit→Skill→Tool 是产品职责划分，不能覆盖宿主的 system/developer/user 指令层级，也不能绕过平台权限、用户授权或项目 policy。本增量没有实施 Courtwork、bootstrap、模型训练、账号连接或自动化。
