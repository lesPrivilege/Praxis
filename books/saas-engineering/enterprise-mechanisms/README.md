# 企业软件的工作机制

软件即服务（Software as a Service, SaaS）使企业可以持续使用和更新软件能力。本册关心这种软件承载的工作机制。企业软件保存的，不只是数据，还有人们依据数据作出的承诺。采购为什么要分请购、收货、验收与付款，工单为什么有执行完成和客户接收两种状态，表格为什么到处都是，agent 为什么接通工具后仍不能宣布任务完成——这些问题可以沿着同一条线理解：谁承担什么责任，依据什么事实改变哪个对象，变化如何被下一方接受。

本册面向已经能搭建界面、希望独立理解陌生业务并实现完整工作链的开发者。四章按“识题 → 解法 → 演算 → 验算 → 变式”推进。读完后应能从一段业务叙述提取对象与权威，给页面补齐后端契约，为 agent 定义有用且有界的工具，并为上线、迁移与退出设计可检查的交接。

| 顺序 | 章节 | 本章完成的工作 |
|---|---|---|
| 1 | [组织约束怎样变成软件](01-organization-to-system.md) | 从责任冲突建立对象、状态、权限与流程；演算采购例外 |
| 2 | [企业前端的工作面与契约](02-enterprise-frontend.md) | 从判断任务选择表格、表单、详情、工作台、看板、批量动作与设置；把采购闭环接到界面 |
| 3 | [从系统结构到 agent 的工作上下文](03-schema-tools-completion.md) | 区分 System Schema、Work Schema 与 Agent Context；演算服务变更的授权、执行与接收 |
| 4 | [软件进入组织之后](04-implementation-reality.md) | 分清购买者、使用者、管理员与数据负责人；完成配置、迁移、切换、训练、升级与退出 |

两条贯穿例子均为原创合成设计，使用虚构组织、人员代号与记录。`EM-E01` 采购设备，重点是承诺、验收、例外与付款资格；`EM-E02` 变更服务配置，重点是范围批准、外部结果未知与业务验收。它们不是任何厂商产品内部实现的复原。金额使用整数分，时间使用明确时区，批准绑定确定版本。

[原语言术语索引](terms.md)集中解释术语差别；[33 个案例的机制入口](case-connections.md)把本册接回全景图谱，说明什么可以迁移、什么必须重新识别。既有 [架构](../architecture.md)和[案例索引](../../../vault/distilled/saas-engineering-atlas/case-index.json)保持各案例身份；[计算与系统方法](../foundations/README.md)继续解释算法家族；这里先把与组织决策直接相关的数量、版本、状态和交接算清。

两例的对象、数值、状态与故障见 [examples.json](../../../vault/distilled/saas-engineering-atlas/enterprise-mechanisms/examples.json)。读完后可进入 [可执行例子与适配器契约](lab-guide.md)改变输入并观察结果；来源定位在 [证据侧栏](../../../vault/distilled/saas-engineering-atlas/enterprise-mechanisms/evidence.md)，执行记录与作者历史保存在 [配套资产](../../../vault/distilled/saas-engineering-atlas/enterprise-mechanisms/README.md)。
