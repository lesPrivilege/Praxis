# 企业软件的工作机制

软件即服务（Software as a Service, SaaS）让企业持续使用软件，并随时取得更新。企业软件里存着数据，也存着人们依据数据作出的承诺。采购为什么要分请购、收货、验收与付款，工单为什么有“执行完成”和“客户接收”两种状态，表格为什么到处都是，agent 接通工具后为什么仍不能宣布任务完成，这些问题都沿同一条线索展开：谁负责什么，依据什么事实改变哪个对象，下一方怎样接受这次变化。

本册写给已经能搭界面、想独立理解陌生业务并实现完整工作链的开发者。每章都按“识题 → 解法 → 演算 → 验算 → 变式”展开。读完后，读者应能从一段业务叙述里找出对象与权威，给页面补齐后端契约，为 agent 定义有用、范围明确的工具，并为上线、迁移与退出设计可以检查的交接。

| 顺序 | 章节 | 本章内容 |
|---|---|---|
| 1 | [组织约束怎样变成软件](01-organization-to-system.md) | 由责任冲突导出对象、状态、权限与流程；演算采购例外 |
| 2 | [企业前端的工作面与契约](02-enterprise-frontend.md) | 按判断任务选择表格、表单、详情页、工作台、看板、批量操作与设置；把采购闭环接到界面 |
| 3 | [从系统结构到 agent 的工作上下文](03-schema-tools-completion.md) | 区分 System Schema、Work Schema 与 Agent Context；演算服务变更的授权、执行与接收 |
| 4 | [软件进入组织之后](04-implementation-reality.md) | 分清购买者、使用者、管理员与数据负责人；安排配置、迁移、切换、训练、升级与退出 |

两条贯穿全册的例子都是原创的合成设计，不复原任何厂商产品的内部实现；组织、人员代号和记录均为虚构。`EM-E01` 采购设备，重点是承诺、验收、例外与付款资格；`EM-E02` 变更服务配置，重点是范围批准、外部结果未知与业务验收。金额以分为单位、只用整数，时间都标明时区，每次批准都绑定一个确定的版本。

[原语言术语索引](terms.md)集中解释术语之间的差别；[33 个案例的机制入口](case-connections.md)把本册接回全景图谱，说明哪些做法可以迁移、哪些要重新识别。各案例的定位以 [架构](../architecture.md)和[案例索引](../../../vault/distilled/saas-engineering-atlas/case-index.json)为准，算法家族由 [计算与系统方法](../foundations/README.md)讲解；本册只算与组织决策直接相关的数量、版本、状态和交接。

两例的对象、数值、状态与故障见 [examples.json](../../../vault/distilled/saas-engineering-atlas/enterprise-mechanisms/examples.json)。读完正文，可以到 [可执行例子与适配器契约](lab-guide.md)里改变输入、观察结果；来源出处见 [证据侧栏](../../../vault/distilled/saas-engineering-atlas/enterprise-mechanisms/evidence.md)，执行记录与写作历史见 [配套资产](../../../vault/distilled/saas-engineering-atlas/enterprise-mechanisms/README.md)。
