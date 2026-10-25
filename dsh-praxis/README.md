# dsh-praxis · 个人 FDE 工作 Kit 与控制面

一套个人 FDE 工作 Kit，加上让人和 Agent 共同维护它的控制面；以 DSH 插件、MCP 服务和命令行提供给 agent 与人。个人使用，不发布。

**现状：四层 Kit 都在 [dsh-praxis/kit](kit/README.md)；控制面已实现并装进本机 DSH。** 同一套操作有四个入口：DSH 插件（原生工具、系统提示词入口段、右侧栏“Praxis”标签）、MCP 服务（仓库根 `.mcp.json`）、命令行、独立网页。

验证范围见 [整合包验收](../docs/verification/dsh-praxis-acceptance-20261025.md)：桌面入口与共数据主路径已实测；验收发现的备份、冲突、错误语义与版本追踪缺陷已修，补充探针 9 项通过。

| 要做什么 | 读哪里 |
|---|---|
| 接手下一轮整合包与产物管理工作 | [架构参考](architecture.md)与[下一轮工单](work-order.md)；设计提案，由 Opus worker 最后裁决 |
| 第一次用，想知道它是什么、在 DSH 里怎么用 | [用户说明](docs/DETAIL.zh.md)（[English](docs/DETAIL.md)），也是 DSH 插件详情页 |
| 做一件内容表达任务 | [Kit 入口](kit/README.md)，从 Task 开始；agent 用 `praxis_resolve` |
| 浏览、维护来源挂载与预设 | [控制面](ui/README.md)：DSH 右侧栏“Praxis”，或 `node dsh-praxis/adapters/cli.js serve` |
| 把插件接进 DSH 或别的 agent | [Adapters](adapters/README.md) |
| 理解五层分工，判断一条做法该归哪一层 | [分层体例](layers.md) |
| 弄清对象、操作和目录控件的含义 | [对象与操作](objects.md) |
| 改代码 | [Core](core/README.md)；测试 `node --test core/*.test.mjs adapters/*.test.mjs` |
| 备份或恢复控制面写下的数据 | [Data](data/README.md) |
| 查一个旧 Kit 页面去了哪里 | [迁移映射](migration.md) |

一句话的分层：Task 决定这次做什么、走哪条 Publish 流水线、取哪些 Writing 方法与 Design 范式；Writing 与 Design 常驻；Publish 按媒介分 html、video 流水线，预设记下流水线的默认配置；Materials 把来源与资产分五级展开。内容组织归 Writing，媒介编排与制作归 Publish。

裁决与理由见 [ADR-037](../docs/decisions/037-dsh-praxis-layered-grammar.md)（分层体例）和 [ADR-038](../docs/decisions/038-dsh-praxis-control-plane.md)（控制面的实现）；需求来源是一段 ChatGPT 讨论，[原 Chat](../vault/archive/chat/dsh-praxis-control-plane-20261023.md) 与 [入账登记](../vault/intake/dsh-praxis-control-plane-20261023.json)在 Vault。
