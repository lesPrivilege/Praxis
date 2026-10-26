# 简明教材的阅读主线

案例沿用原有编号，章节按理解的先后排列，与编号顺序无关。阅读先看组织怎样使用软件，再用小输入学会计算方法，最后按业务问题挑选行业案例；每个业务问题选一例走完五步，再换一例改变条件。迁移要写明保持不变的关系和改变的条件，只换产品名、页面名或行业标签不算迁移。

## 组织怎样使用软件

[企业机制四章](enterprise-mechanisms/README.md)从一次采购例外讲起：承诺 12 台、到货 10 台、合格 9 台，为什么付款资格只有 9 台？第 [1](enterprise-mechanisms/01-organization-to-system.md)章分清对象与权威，第 [2](enterprise-mechanisms/02-enterprise-frontend.md)章把证据与动作放进表格、表单和工作台，第 [3](enterprise-mechanisms/03-schema-tools-completion.md)章让 agent 沿批准版本提交、核对并得到接收确认，第 [4](enterprise-mechanisms/04-implementation-reality.md)章把同样的责任带进配置、迁移、培训和退出。

读到接口成功、效果确认和业务接收这三处时，分别画出由谁确认。再把服务变更的条件改成“只收到 accepted”，检查哪一段走不下去。

## 小输入的演算

[计算与系统方法](foundations/README.md)的 12 章都用维修订单 O7 作例子。第 [1](foundations/01-problems-and-objects.md)章分清对象，第 [2](foundations/02-lookup-and-indexes.md)–[3](foundations/03-order-and-intervals.md)章处理查找、顺序与区间，第 [4](foundations/04-graphs-and-connectivity.md)–[6](foundations/06-choices-and-optimization.md)章处理关系、依赖与约束，第 [7](foundations/07-reuse-and-invalidation.md)–[8](foundations/08-approximation-and-search.md)章比较复用和近似的代价，第 [9](foundations/09-from-ui-to-recovery.md)–[11](foundations/11-stacks-and-research.md)章把计算接入界面、事务、恢复、验证和成熟技术栈。最后在第 [12](foundations/12-transfer-workbook.md)章独立完成跨行业变式。

需要查某一种方法时，可以直接从 [解题索引](problem-index.md)进入；进了章节，仍先写下自己的预测，再对照演算。方法章解释算法为什么成立，行业案例解释对象和权威为什么不能照搬。

## 七个业务问题

行业案例按七个业务问题归组；每组列出涉及的机制、可以进入的案例，以及读完后应能作出的判断。

| 业务问题 | 涉及的机制 | 案例入口 | 应能作出的判断 |
|---|---|---|---|
| 1. 承诺、资源与证据 | 独立的对象、角色与状态 | [H01](packages/commercial-finance/H01.md)、[V07](packages/industry-networks/V07.md)、[V20](packages/people-service/V20.md) | 解释“已提交”“已完成”“已收款”为何分别需要证据 |
| 2. 状态与权威 | 修改权限与事实权威 | [H02](packages/commercial-finance/H02.md)、[H04](packages/people-service/H04.md)、[V01](packages/health-science/V01.md)、[V03](packages/health-science/V03.md) | 给一次状态变化列出身份、权限、guard 和接收人 |
| 3. 交接与边界 | UI command、API、event 与 read model 的衔接 | [H05](packages/people-service/H05.md)、[H06](packages/people-service/H06.md)、[H09](packages/data-ai-control/H09.md)、[X01](packages/data-ai-control/X01.md) | 找到同步调用结束后仍未完成的业务责任 |
| 4. 时间、数量与约束 | lookup、Top-K、window、graph、scheduling、optimization | [H03](packages/commercial-finance/H03.md)、[H07](packages/data-ai-control/H07.md)、[V09](packages/industry-networks/V09.md)、[V11](packages/industry-networks/V11.md)、[V21](packages/industry-networks/V21.md) | 用小输入演算，说明时间、规模和目标改变后的结果 |
| 5. 部分完成与失败 | 拆单、重试、竞争、回滚、补偿、核对 | [V04](packages/commerce-property/V04.md)、[V05](packages/commerce-property/V05.md)、[V06](packages/commerce-property/V06.md)、[V12](packages/commercial-finance/V12.md)、[V14](packages/commercial-finance/V14.md) | 区分安全重试与必须先核对的未知结果 |
| 6. 专业判断与责任 | 同意、放行、保全、审批和人工接管 | [H08](packages/data-ai-control/H08.md)、[V02](packages/health-science/V02.md)、[V13](packages/commercial-finance/V13.md)、[V17](packages/people-service/V17.md)、[V18](packages/people-service/V18.md) | 指出自动化能提供什么证据、谁仍要作决定 |
| 7. 跨对象与跨组织闭环 | 变更、工时、资产、供应、计量和内部结算 | [V08](packages/industry-networks/V08.md)、[V10](packages/industry-networks/V10.md)、[V15](packages/commerce-property/V15.md)、[V16](packages/commerce-property/V16.md)、[V19](packages/people-service/V19.md)、[V22](packages/industry-networks/V22.md)、[X02](packages/commercial-finance/X02.md) | 沿关系检查局部完成是否真的关闭全局义务 |

各案例保留原语言术语。一个病例的 consent、一个采购单的 approval 和一次安全响应的 authorization 都可能是执行前提，但它们的撤回、有效期和专业责任必须分别查证。

## 共同机制的迁移

从 H01 学到的不是“所有业务都要先付款”。可迁移的是：先标明哪种证据允许哪种状态变化，再决定是否允许先执行后结算。预付订阅、赊销制造和押金住宿各用不同的 guard，但都要保存承诺、履约、收款和补偿之间的关系。

迁移练习按五步作答：指出保持不变的关系；列出改变的条件；重画受影响的对象或边；写一个最容易出错的反例；给出能发现错误的检查。只换产品名、页面名或行业标签不算迁移。claim 与 provider 事实不会跨案例自动继承：演算可以共用，外部制度和状态定义要重新取证。

## 自检练习与简答

四道练习都从 H01 出发，各改一个前提：拆分履约、多次上门、跨租户缓存和换了约束的排序。每题的简答写出能否沿用、沿用了哪条关系、反例和检查。

**练习 1：从 H01 转到 V04。** 一张订单共 3 件货，2 件已发，1 件缺货，客户已付全款。是否可以把订单标为全部完成？

简答：不能。付款记录不变，履约对象要拆成至少两个数量可以核对的部分：已发的 2 件和待处理的 1 件各有状态，订单汇总同时显示付款进度与履约进度。反例是一个 `paid` 标签把缺货盖住。检查时核对总数满足“已交付 + 待交付 + 已取消 = 已订购”；退款单独核对到账。

**练习 2：从 H01 转到 V20。** 一个 work order 需要两次 booking，第一次技师已经完成。总工单能否关闭？

简答：按本例的规则，不能关闭：两次 booking 都完成并经接收确认后，总工单才关闭；真实系统是否允许关闭，取决于它的状态定义与业务 guard。沿用的是“子任务证据支持父对象状态”这条关系；变的是原来的一段时间区间换成了两个独立 booking，各自要有完成与验收证据。反例是把任意一次 booking 完成当作全部工作完成。检查时，失败或取消的那次 booking 必须仍在父对象上可见。

**练习 3：从 H01 转到 X01。** 把所有租户的发票缓存放在一起，用 invoice number 作为 key，能否沿用原来的查询方法？

简答：lookup 方法仍然可用，但身份前提变了。若 invoice number 只在租户内唯一，key 必须包含 tenant scope，读取时还要检查授权。反例是两个租户都有 `1001`，结果返回了另一方的金额。检查时用业务编号相同、tenant 不同的两条 fixture；cache hit、miss 和失效重建都要保持隔离。只改 cache key 代替不了底层访问控制。

**练习 4：从 H01 转到 V21。** 把催收 Top-K 的“金额最大优先”用于安排运输，是否仍然合理？

简答：不能直接沿用。排序只给出先后，保证不了运输可行。换到运输，容量、路线、时间窗和不可拆分条件都成了约束，要先找到可行方案，再比较成本或延迟。反例是金额最大的货占满车后，剩下的冷链订单错过时间窗。检查时逐项核对约束，并把所得方案与小规模穷举或人工找到的可行解对照；启发式得到的方案不能称为最优。

先独立作答，再对照简答；遇到陌生制度，把待确认的条件留着。各案例末尾另有领域变式与继续研究的方向。

## 三条学习路线

三条路线各把几个案例串成一个连续的问题：从履约、更正到资源计划，每步改变一个条件，最后交付一份可检查的产物。

- **从一个按钮到一次履约**：H01 → V04 → V20 → X01。每步画出承诺、动作与确认者；分别改变“已付款但未发货”“第一次上门完成”“同号跨租户”条件。交付一张对象表和一个拒绝关闭的反例。
- **从更正到可信发布**：H07 → H09 → V03 → V09。沿 `derived_from` 找依据，反向找受影响的结果；把一项已签证据的输入换版。交付受影响的集合和需要重新决定的对象；图上可达不等于有权自动撤销。
- **从时间窗口到资源计划**：H03 → V06 → V19 → V21 → V22。先求依赖和区间，再加房间、人员、车辆与商业时窗；改变一项容量或迟到事件。交付一个可行方案、一个失败方案及其违反的约束。

每条路线的人工走读与解题记录见 [整合验收](../../../docs/verification/saas-engineering-atlas-20261014.md)。[迁移地图](transfer-map.md)按题型连接各案例。
