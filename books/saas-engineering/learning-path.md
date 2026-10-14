# 简明教材的阅读主线

一家企业不断接受承诺、安排资源、完成交付、取得证据并结清义务。销售订单让客户与企业对交付形成共同约定；生产单安排如何履约；检验结果决定能否放行；发票与付款记录各自回答应收多少和实际收到多少。SaaS 把这些对象交给不同角色处理，又使它们能互相核对。页面是人进入这条链的地方，接口连接不同权威系统，存储保留已经作出的决定。

全景图首先要让读者看见这些连接，再进入行业细节。案例编号保留已有身份；教材章节按理解依赖组织，不按编号顺序堆放案例。阅读分两次展开：先用一组小输入学会方法，再按业务问题选行业案例。下列七个问题从简单承诺走向时间、资源与跨组织责任；每次选一例完成五步，再用另一例改变条件。

## 先把一组小输入算清

[计算与系统方法](foundations/README.md)用维修订单 O7 连起 12 章。第 [1](foundations/01-problems-and-objects.md)章分清对象，第 [2](foundations/02-lookup-and-indexes.md)–[3](foundations/03-order-and-intervals.md)章处理查找、顺序与区间，第 [4](foundations/04-graphs-and-connectivity.md)–[6](foundations/06-choices-and-optimization.md)章处理关系、依赖与约束，第 [7](foundations/07-reuse-and-invalidation.md)–[8](foundations/08-approximation-and-search.md)章比较复用和近似的代价，第 [9](foundations/09-from-ui-to-recovery.md)–[11](foundations/11-stacks-and-research.md)章把计算接入界面、事务、恢复、验证和成熟技术栈。最后在第 [12](foundations/12-transfer-workbook.md)章独立完成跨行业变式。

需要查某一种方法时，可直接从 [解题索引](problem-index.md)进入；进入章节后仍先写自己的预测，再对照演算。方法章解释算法为何成立，行业例解释对象和权威为何不能照搬。

## 再用七个问题展开行业全景

| 业务问题 | 逐步建立的理解 | 案例入口 | 本章应能完成的判断 |
|---|---|---|---|
| 1. 承诺、资源与证据 | 企业为何需要独立对象、角色与状态 | [H01](packages/commercial-finance/H01.md)、[V07](packages/industry-networks/V07.md)、[V20](packages/people-service/V20.md) | 解释“已提交”“已完成”“已收款”为何分别需要证据 |
| 2. 状态与权威 | 谁能改什么；哪个系统对哪项事实负责 | [H02](packages/commercial-finance/H02.md)、[H04](packages/people-service/H04.md)、[V01](packages/health-science/V01.md)、[V03](packages/health-science/V03.md) | 给一次状态变化列出身份、权限、guard 和接收人 |
| 3. 交接与边界 | UI command、API、event、read model 如何连接 | [H05](packages/people-service/H05.md)、[H06](packages/people-service/H06.md)、[H09](packages/data-ai-control/H09.md)、[X01](packages/data-ai-control/X01.md) | 找到同步调用结束后仍未完成的业务责任 |
| 4. 时间、数量与约束 | lookup、Top-K、window、graph、scheduling、optimization | [H03](packages/commercial-finance/H03.md)、[H07](packages/data-ai-control/H07.md)、[V09](packages/industry-networks/V09.md)、[V11](packages/industry-networks/V11.md)、[V21](packages/industry-networks/V21.md) | 用小输入演算，说明时间、规模和目标改变后的结果 |
| 5. 部分完成与失败 | 拆单、重试、竞争、回滚、补偿、核对 | [V04](packages/commerce-property/V04.md)、[V05](packages/commerce-property/V05.md)、[V06](packages/commerce-property/V06.md)、[V12](packages/commercial-finance/V12.md)、[V14](packages/commercial-finance/V14.md) | 区分安全重试与必须先核对的未知结果 |
| 6. 专业判断与责任 | 同意、放行、保全、审批和人工接管 | [H08](packages/data-ai-control/H08.md)、[V02](packages/health-science/V02.md)、[V13](packages/commercial-finance/V13.md)、[V17](packages/people-service/V17.md)、[V18](packages/people-service/V18.md) | 指出自动化可提供什么证据、谁仍须作决定 |
| 7. 跨对象与跨组织闭环 | 变更、工时、资产、供应、计量和内部结算 | [V08](packages/industry-networks/V08.md)、[V10](packages/industry-networks/V10.md)、[V15](packages/commerce-property/V15.md)、[V16](packages/commerce-property/V16.md)、[V19](packages/people-service/V19.md)、[V22](packages/industry-networks/V22.md)、[X02](packages/commercial-finance/X02.md) | 沿关系检查局部完成是否真的关闭全局义务 |

每次沿“识题 → 解法 → 演算 → 验算 → 变式”展开。每例先接回共同图景，再讲该行业为什么需要自己的对象；具体源词不被统一术语抹平。一个病例的 consent、一个采购单的 approval 和一次安全响应的 authorization 都可能是执行前提，但它们的撤回、有效期和专业责任必须分别查证。

## 共同机制的迁移方法

从 H01 学到的不是“所有业务都要先付款”。可迁移的是：先标明哪种证据允许哪种状态变化，再决定是否允许先执行后结算。预付订阅、赊销制造和押金住宿分别选择不同 guard，却都需要保存承诺、履约、收款和补偿之间的关系。

迁移练习按五步作答：指出保持不变的关系；列出改变的条件；重画受影响的对象或边；写一个最容易出错的反例；给出能发现错误的检查。只换产品名、页面名或行业标签不算迁移。跨案例 claim 与 provider 事实不自动继承，演算可以共享，外部制度和状态定义必须重新取证。

## 自检练习与简答

**练习 1：从 H01 转到 V04。** 一张订单共 3 件货，2 件已发，1 件缺货，客户已付全款。是否可以把订单标为全部完成？

简答：付款记录不变，履约对象要拆成至少两个数量可核对的部分。已发 2 件和待处理 1 件各有状态；订单汇总应同时显示付款与履约进度。反例是一个 `paid` 标签隐藏缺货。检查总数满足“已交付 + 待交付 + 已取消 = 已订购”，退款单独核对资金，不把退货动作直接等同于到账。

**练习 2：从 H01 转到 V20。** 一个 work order 需要两次 booking，第一次技师已经完成。总工单能否关闭？

简答：保持“子任务证据支持父对象状态”的关系；将时间区间变成两个独立 booking 的完成与验收证据。是否允许关闭仍取决于该系统的状态定义与业务 guard。合成练习要求两次都完成且接收确认才关闭；反例是把任意一个 booking 完成当作所有工作完成。检查一次失败或取消的 booking 必须在父对象仍可见。

**练习 3：从 H01 转到 X01。** 把所有租户的发票缓存放在一起，用 invoice number 作为 key，能否沿用原来的查询方法？

简答：lookup 方法仍可用，身份前提已改变。若 invoice number 只在租户内唯一，key 必须包括 tenant scope，读取还须检查授权。反例是两个租户都有 `1001`，返回了另一方的金额。检查使用相同业务编号、不同 tenant 的两条 fixture；cache hit、miss 和失效重建都应保持隔离。仅增加 cache key 不替代底层访问控制。

**练习 4：从 H01 转到 V21。** 把催收 Top-K 的“金额最大优先”用于安排运输，是否仍然合理？

简答：排序能产生顺序，不能保证运输可行。资源约束改变后，容量、路线、时间窗和不可拆分条件成为约束；要先找可行方案，再比较成本或延迟。反例是金额最大的货占满车后，剩余冷链订单超过时间窗。检查每个约束，并将所得方案与小规模穷举或人工可行解对照；启发式不能称为最优。

各案例末尾还有领域变式与继续研究方向。先独立作答，再对照短答；遇到陌生制度时保留待确认条件。

## 三条可完成的学习路线

- **从一个按钮到一次履约**：H01 → V04 → V20 → X01。每步画出承诺、动作与确认者；分别改变“已付款但未发货”“第一次上门完成”“同号跨租户”条件。交付一张对象表和一个拒绝关闭的反例。
- **从更正到可信发布**：H07 → H09 → V03 → V09。沿 `derived_from` 找依据，反向找受影响结果；把一项已签证据的输入换版。交付受影响集合和需要重新决定的对象，勿把可达性写成自动撤销权限。
- **从时间窗口到资源计划**：H03 → V06 → V19 → V21 → V22。先求依赖和区间，再加房间、人员、车辆与商业时窗；改变一项容量或迟到事件。交付一个可行方案、一个失败方案及其违反的约束。

每条路线的人工走读与解题记录见 [整合验收](../../docs/verification/saas-engineering-atlas-20261014.md)。按需展开 [迁移地图](transfer-map.md)，它连接题型而不替各行业继承批准权。
