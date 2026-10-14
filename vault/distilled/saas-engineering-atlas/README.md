# SaaS 工程全景

这份百科面向能用 AI 搭界面、但希望看懂业务与系统如何共同运转的 vibe coder。每个案例从一次真实工作类型出发，解释谁承担责任、什么对象发生变化、页面怎样发起动作、后端怎样确认结果，以及故障后如何恢复。读者可以据此判断演示遗漏了什么，也可以把同一机制迁移到另一类业务。

当前可用内容是研究架构、共同契约和一个合成案例。案例目录按工作机制与业务对象组织，保留 provider 身份和原语言术语。它不代表 Praxis 已采纳这些做法，也不代表应用已经实现。

| 阅读任务 | 入口 | 得到什么 |
|---|---|---|
| 按简明教材学习并自检 | [教材主线与练习](learning-path.md) | 共同企业图景、七章顺序、条件变化与短答案 |
| 理解全景的连接方式 | [架构](architecture.md) | 从业务承诺走到系统执行、算法和验收的阅读路线 |
| 查案例与分工 | [案例目录](case-index.json)、[工作包](packages/README.md) | 33 个稳定 case ID 和互不重叠的写入范围 |
| 开始一个研究包 | [worker 契约](worker-contract.md)、[案例模板](case-template.md) | 最小交付、证据边界和交接格式 |
| 使用相同名称和图语义 | [共同标识](identifiers.json)、[关系类型](relation-types.json) | 可被后续 HTML / motion 消费的语义，不限定视觉形式 |
| 阅读完整示范 | [H01：承诺、收款与履约](example-h01.md)、[结构数据](example-h01.json) | 正常路径、失败路径、算法推理和端到端检查 |
| 查证或复核 | [来源](../../provenance/saas-engineering-atlas/README.md)、[验证方法](validation.md) | 逐 URL 身份、主张定位、结构检查和未执行范围 |

来源获取、历史计数和本轮变化分别记在 [CHANGELOG](../../provenance/saas-engineering-atlas/CHANGELOG.md) 与 [验收回执](../../../docs/verification/saas-engineering-atlas-20261014.md)。
