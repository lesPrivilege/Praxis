# dsh-praxis · 个人 FDE 工作 Kit 与控制面

一套个人 FDE 工作 Kit，加上让人和 Agent 共同维护它的控制面；做成后以 DSH 插件和 MCP 提供给 agent 调用。个人使用，不发布。

**现状：Task、Writing、Publish 已迁入 [dsh-praxis/kit](kit/README.md)，做内容表达任务从这里进入。** Design 仍在 `kit/design/`，与 Materials 数据层一起迁；数据层、MCP、DSH 插件与 UI 都还没有写。

| 要做什么 | 读哪里 |
|---|---|
| 做一件内容表达任务 | [Kit 入口](kit/README.md)，从 Task 开始 |
| 理解五层分工，判断一条做法该归哪一层 | [分层体例](layers.md) |
| 入账、维护条目，或弄清目录控件的含义 | [对象与操作](objects.md) |
| 查字段与校验规则 | [Schemas](schemas/README.md) |
| 找一个现有 Kit 页面的新归属，或开始下一步迁移 | [迁移映射](migration.md) |

一句话的分层：Task 决定这次做什么、走哪条 Publish 流水线、取哪些 Writing 方法与 Design 范式；Writing 与 Design 常驻；Publish 按媒介分 html、video 等流水线；Materials 把来源与资产分五级展开。内容组织归 Writing，媒介编排与制作归 Publish。

下一步是 Materials 数据层与 Design 迁移，见 [迁移映射](migration.md#还没迁)。裁决与理由见 [ADR-037](../docs/decisions/037-dsh-praxis-layered-grammar.md)；需求来源是一段 ChatGPT 讨论，[原 Chat](../vault/archive/chat/dsh-praxis-control-plane-20261023.md) 与 [入账登记](../vault/intake/dsh-praxis-control-plane-20261023.json)在 Vault。
