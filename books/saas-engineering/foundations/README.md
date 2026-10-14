# 把业务问题算清楚

这一部分从一张订单、一段时间、几条依赖边开始，用纸笔得到答案，再决定数据放在哪里、请求怎样执行、失败怎样恢复。学完后，可以给 AI 一份可验算的任务：输入明确、选择有理由、结果能检查。

每章沿同一条路线展开：**识题**找出输入与约束；**解法**说明为何选这种方法；**演算**逐步处理小输入；**验算**用不变量和反例检查；**变式**改变一个前提，判断方法是否仍成立。维修订单 O7 贯穿对象、数量、任务、退款和验证，其他行业案例用来练习迁移。

只需能读表格、比较大小和计算加减乘除。复杂度中的 n 是输入条数，k 是保留项数，V/E 是图的点数/边数，L 是键的长度；`[a,b)` 包含 a、不包含 b。章节会在第一次使用时解释方法和术语，原文名称可从[术语索引](terms.md)反查。

## 渐进路线

| 顺序 | 学会判断什么 | 小输入与入口 |
|---|---|---|
| 1 | 一次点击究竟改变哪项事实 | [对象与题型](01-problems-and-objects.md)：3 次服务与 40 单位退款 |
| 2 | 等值、边界、范围、前缀为什么用不同结构 | [查找与索引](02-lookup-and-indexes.md)：5 个日期、4 个词 |
| 3 | 何时全排，何时只留少量候选，如何累计区间 | [顺序与区间](03-order-and-intervals.md)：5 个评分与 5 段用量 |
| 4 | 要的是影响集合、解释路径、最短路，还是连通分组 | [图与连通](04-graphs-and-connectivity.md)：5 个依赖节点、4 个站点 |
| 5 | 哪些前提已满足，资源何时可用，任务怎样交接 | [依赖与队列](05-dependencies-and-queues.md)：4 项工作，7 分钟与 10 分钟 |
| 6 | 局部最优是否足够，状态怎样表达剩余问题 | [有约束的选择](06-choices-and-optimization.md)：预算 5、3 件工作、2 名技师 |
| 7 | 哪个结果可复用，何时应淘汰，何时已失效 | [复用与失效](07-reuse-and-invalidation.md)：容量 2，6 次访问 |
| 8 | 允许哪一种误差，怎样测量和补救 | [近似与检索](08-approximation-and-search.md)：8 位过滤器、4 个寄存器、4 个向量 |
| 9 | 计算结果怎样变成可恢复的业务动作 | [从界面到恢复](09-from-ui-to-recovery.md)：取消 S3、操作 OP7、退款回执 R1 |
| 10 | 用哪层实验支持哪项承诺 | [分层验证与 AI 评估](10-verification-and-evals.md)：重复投递、未知结果、40 条评估样本 |
| 11 | 哪些成熟能力能减少自建工作，何时才值得增加组件 | [技术栈与研究](11-stacks-and-research.md)：50 名操作员、每天 2,000 次操作 |
| 12 | 换行业后哪些结构留下，哪些语义要重建 | [迁移练习册](12-transfer-workbook.md)：33 案例地图与 6 组跨行业演算 |

第一遍顺序读：1–3 章把对象和数字算清楚，4–6 章处理关系与选择，7–8 章讨论成本，9–11 章把答案接进系统，12 章独立迁移。每个例子先遮住答案自己算，再改变一个条件。第二遍从产品症状进入：查不到或查得慢看第 2 章，列表顺序与报表看第 3 章，任务卡住看第 5 章，重复执行或结果未知看第 9–10 章。

## 把方法用于自己的产品

拿一项真实需求，先写一小段题目：“给定哪些对象和版本；要返回什么或改变什么；哪些条件绝不能破坏。”接着写 3–5 条足以手算的输入、一组期望结果和一个反例。选出正文中最接近的方法，写明它的适用前提。最后把计算检查与运行检查分开：前者证明固定输入下的答案，后者检查并发、重复、超时和恢复。

业务软件通过网络提供服务的模式通常称为软件即服务（software as a service，SaaS）。这些章节在这种工作台场景里练习，但方法同样适用于内部工具、数据任务和单机应用。[共同学习路径](../learning-path.md)、[atlas 架构](../architecture.md)、[33 案例目录](../../../vault/distilled/saas-engineering-atlas/case-index.json)及 [H01 服务承诺案例](../packages/commercial-finance/H01.md)补充业务背景。

## 配套材料

[examples.json](../../../vault/distilled/saas-engineering-atlas/foundations/examples.json)保存 18 组输入、关键步骤、不变量和期望值。[check_examples.py](../../../vault/distilled/saas-engineering-atlas/foundations/check_examples.py)可用 Python 3.9 或更新版本直接运行，只依赖标准库；不必先读程序才能学习正文。在仓库根目录运行：

```sh
python3 vault/distilled/saas-engineering-atlas/foundations/check_examples.py --self-test
```

原文标题、定位与主张范围见 [证据索引](../../../vault/distilled/saas-engineering-atlas/foundations/evidence.json)，术语区别见 [术语索引](terms.md)。输入与章节映射、执行记录和修订历史集中在 [配套资产](../../../vault/distilled/saas-engineering-atlas/foundations/README.md)。
