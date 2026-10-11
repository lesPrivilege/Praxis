# AgentScope 企业线研究

本批用文档系统反推职责，再用固定提交源码核对局部机制。主线区分 Python 2.0、Java Harness v2 与 Java Service 2.1.0-BETA1；旧 Runtime/Studio 已进入迁移线。

- [docs-handoff.md](docs-handoff.md)
- [mechanics-handoff.md](mechanics-handoff.md)
- [runtime-handoff.md](runtime-handoff.md)

- [关键裁决](adjudication.md)

[逐源登记](../../provenance/agentscope-enterprise-20261012/README.md) · [消费知识片](../../../demos/agentscope-enterprise-film/README.md)

边界：研究只覆盖公开文档和选定静态源码。Java 默认恢复机制的文档存在 EVENT_LOG 与旧 AgentStateStore 叙述冲突，未把冲突默认值写入成片。文档内嵌 OpenAPI 局部版本漂移单独保留，不用于推断当前 router。商业版、SLA、目标项目的运行表现和受众理解均未验证。
