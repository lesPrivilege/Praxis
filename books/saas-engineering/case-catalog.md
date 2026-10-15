# 案例目录

全书 33 个案例，每例对应一条从承诺到结清的工作链。表中给出每例的正文、保存对象、关系与检查定义的结构 JSON，以及演算用到的算法家族。按业务找起点时选工作链；按题型找解法从 [解题索引](problem-index.md)进入，看一个机制换到另一个行业还保留什么、在哪里失效，从 [迁移地图](transfer-map.md)进入。

| ID | 工作链 | 正文与结构 | 算法家族 |
|---|---|---|---|
| H01 | 报价 → 合同 → 服务 → 收款 → 收入 | [正文](packages/commercial-finance/H01.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/commercial-finance/H01.json) | lookup, windows, caches |
| H02 | 请购 → 验收 → 发票匹配 → 付款 | [正文](packages/commercial-finance/H02.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/commercial-finance/H02.json) | lookup, caches |
| H03 | 子账 → 对账 → 关账 → 管理报告 | [正文](packages/commercial-finance/H03.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/commercial-finance/H03.json) | lookup, windows, scheduling, caches |
| H04 | Offer → 员工 → 薪资 → 离职 | [正文](packages/people-service/H04.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/people-service/H04.json) | lookup, windows, caches |
| H05 | Incident → 受控变更 → 恢复 → 关闭 | [正文](packages/people-service/H05.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/people-service/H05.json) | windows, graph-paths, caches |
| H06 | 支持请求 → 动作 → 客户确认 → 关闭 | [正文](packages/people-service/H06.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/people-service/H06.json) | windows, top-k, lookup, caches |
| H07 | 源数据变化 → 治理 → BI 发布 | [正文](packages/data-ai-control/H07.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/data-ai-control/H07.json) | lookup, windows, graph-paths, caches |
| H08 | 安全信号 → 事件 → 授权响应 → 恢复 | [正文](packages/data-ai-control/H08.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/data-ai-control/H08.json) | lookup, windows, top-k, graph-paths, caches |
| H09 | 文档版本 → 审批 → 下游集成记录 | [正文](packages/data-ai-control/H09.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/data-ai-control/H09.json) | scheduling, lookup, caches |
| V01 | 就诊 → 检验/影像证据 → 理赔 → 结算 | [正文](packages/health-science/V01.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/health-science/V01.json) | lookup, graph-paths, caches |
| V02 | Protocol → consent → eCRF query → signed data lock | [正文](packages/health-science/V02.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/health-science/V02.json) | lookup, graph-paths, caches |
| V03 | Sample → 校准分析 → 结果复核 → lot certificate | [正文](packages/health-science/V03.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/health-science/V03.json) | approximate, lookup, graph-paths, windows, caches |
| V04 | 产品目录 → 拆分履约 → 退货 → 净结算 | [正文](packages/commerce-property/V04.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/commerce-property/V04.json) | lookup, optimization, top-k, caches |
| V05 | 菜单选择 → 出餐 → split tender → 结账 | [正文](packages/commerce-property/V05.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/commerce-property/V05.json) | lookup, graph-paths, top-k, caches |
| V06 | Reservation → 入住夜数 → folio → check-out | [正文](packages/commerce-property/V06.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/commerce-property/V06.json) | windows, lookup, scheduling, caches |
| V07 | 发布设计 → 生产 → 检验 → 发货 → 收款 | [正文](packages/industry-networks/V07.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/industry-networks/V07.json) | lookup, graph-paths, scheduling, caches |
| V08 | Recipe → batch record → 质量处置 → lot release | [正文](packages/industry-networks/V08.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/industry-networks/V08.json) | lookup, graph-paths, caches |
| V09 | RTL baseline → 实现证据 → signoff → release | [正文](packages/industry-networks/V09.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/industry-networks/V09.json) | scheduling, graph-paths, top-k, caches |
| V10 | 资产信号 → 获许可工作 → 维护确认 → 关闭 | [正文](packages/industry-networks/V10.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/industry-networks/V10.json) | lookup, windows, scheduling, caches |
| V11 | Meter data → VEE → bill determinant → 账单 → 结算 | [正文](packages/industry-networks/V11.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/industry-networks/V11.json) | lookup, windows, caches |
| V12 | 申请 → 审批 → 放款 → 贷后 → payoff | [正文](packages/commercial-finance/V12.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/commercial-finance/V12.json) | lookup, windows, caches |
| V13 | Submission → quote → issue → claim → reserve → payment | [正文](packages/commercial-finance/V13.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/commercial-finance/V13.json) | lookup, graph-paths, caches |
| V14 | 投资订单 → fills/cancel → allocation → settlement | [正文](packages/commercial-finance/V14.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/commercial-finance/V14.json) | lookup, top-k |
| V15 | 发布设计 → RFI → change event → approved variation → 付款 | [正文](packages/commerce-property/V15.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/commerce-property/V15.json) | graph-paths, lookup, caches |
| V16 | 租约 → 入住 → 维护 → 押金对账 | [正文](packages/commerce-property/V16.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/commerce-property/V16.json) | lookup, windows, caches |
| V17 | 注册 → roster → 学习 → 成绩批准 → transcript | [正文](packages/people-service/V17.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/people-service/V17.json) | lookup, windows, caches |
| V18 | Matter intake → hold → discovery → production → legal spend | [正文](packages/people-service/V18.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/people-service/V18.json) | lookup, graph-paths, caches |
| V19 | Engagement → 配员 → 工时批准 → capped bill → 收款 | [正文](packages/people-service/V19.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/people-service/V19.json) | scheduling, optimization, windows, lookup, caches |
| V20 | 服务请求 → 两次 booking → 完成 → posting → 付款 | [正文](packages/people-service/V20.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/people-service/V20.json) | scheduling, optimization, windows, caches, lookup |
| V21 | 约束计划 → 供应批准 → 运输 → 交付 → 运费支付 | [正文](packages/industry-networks/V21.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/industry-networks/V21.json) | optimization, scheduling, lookup, caches |
| V22 | Product order → service activation → usage → bill → retirement | [正文](packages/industry-networks/V22.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/industry-networks/V22.json) | windows, lookup, caches |
| X01 | Tenant onboarding → isolated service → metering → bill → offboard | [正文](packages/data-ai-control/X01.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/data-ai-control/X01.json) | lookup, windows, scheduling, caches |
| X02 | 集团销售 → 实物流/虚单 → 内外结算 → 合并核对 | [正文](packages/commercial-finance/X02.md) · [结构](../../vault/distilled/saas-engineering-atlas/packages/commercial-finance/X02.json) | graph-paths, lookup |
