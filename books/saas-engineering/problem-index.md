# 从题型选择解法

先说清哪些事实看起来互相冲突，再选方法。下表按题型把常见机制与案例对应起来；题型分组是本书的教学归纳。算法用 lookup、Top-K、window、graph、scheduling 等通行名称，provider 术语保留原文；技术方案和行业制度的适用范围见各例。

对象、权限和页面怎样影响一项工作的完成，可先读 [企业机制](enterprise-mechanisms/README.md)。其中 [前端工作面](enterprise-mechanisms/02-enterprise-frontend.md)解释表格、表单、详情、工作台、看板、批量动作与设置各自需要的后端契约；[工作上下文与工具](enterprise-mechanisms/03-schema-tools-completion.md)讲 agent 怎样按这些契约执行动作、回写结果。

## 题型索引

| 识题线索 | 解法 | 演算入口 | 查证与反例 |
|---|---|---|---|
| 一件事已显示完成，另一方仍认为未完成 | 分离承诺、执行、接收、资金对象；用明确 guard 连接 | [H01](packages/commercial-finance/H01.md)、[V20](packages/people-service/V20.md)、[V01](packages/health-science/V01.md) | 查每个完成状态的确认者及证据；只完成一个子对象 |
| 多张单据金额相等，仍无法对账 | 按来源行、币种、版本匹配；保存差额和调整链 | [H02](packages/commercial-finance/H02.md)、[H03](packages/commercial-finance/H03.md)、[X02](packages/commercial-finance/X02.md) | 查来源身份和抵销范围；用总额相等但行归属错的输入 |
| 数量经拆分、部分交付或退回，记录难以对齐 | 数量守恒、累计占用、独立实物与资金账 | [V04](packages/commerce-property/V04.md)、[V05](packages/commerce-property/V05.md)、[V14](packages/commercial-finance/V14.md) | 查不可逆交接点；改变一个取消/退货回执的到达次序 |
| 输入已更正，旧批准或报告效力未定 | 冻结输入版本；沿证据依赖求影响集合，再由责任人重判 | [H07](packages/data-ai-control/H07.md)、[H09](packages/data-ai-control/H09.md)、[V03](packages/health-science/V03.md)、[V09](packages/industry-networks/V09.md)、[V15](packages/commerce-property/V15.md) | 查签署范围和修订效力；保留旧版批准而替换输入 |
| 成员关系结束，权限或费用仍残留 | 人、成员关系、访问权和结算义务分别建模 | [H04](packages/people-service/H04.md)、[V17](packages/people-service/V17.md)、[X01](packages/data-ai-control/X01.md) | 查各系统停用与保留规则；用成功停用但账单未结的例子 |
| 工作已结束，责任尚无人接收 | 执行证据、恢复探测、接收决定分开；按范围聚合 | [H05](packages/people-service/H05.md)、[H06](packages/people-service/H06.md)、[V16](packages/commerce-property/V16.md)、[V20](packages/people-service/V20.md) | 查谁可以接收及等待原因；取消一个 booking 后重新判断整体是否完成 |
| 同一事件跨日期或迟到后改变结果 | 半开区间、事件时间窗口、固定口径与修订链 | [H01](packages/commercial-finance/H01.md)、[V06](packages/commerce-property/V06.md)、[V11](packages/industry-networks/V11.md)、[V12](packages/commercial-finance/V12.md)、[V22](packages/industry-networks/V22.md) | 查时区、计费基数和生效日；分别移动发生时间与收到时间 |
| 先后顺序可行，资源仍冲突 | 先求依赖，再加技能、容量、地点和时窗约束 | [H03](packages/commercial-finance/H03.md)、[V19](packages/people-service/V19.md)、[V20](packages/people-service/V20.md)、[V21](packages/industry-networks/V21.md) | 查硬约束；构造两项同时争用一名技师的方案 |
| 授权存在，动作仍可能越界 | 授权绑定范围、动作、输入版本和有效期；效果逐项确认 | [H08](packages/data-ai-control/H08.md)、[V02](packages/health-science/V02.md)、[V18](packages/people-service/V18.md) | 查撤回与认领边界；给旧版本发送一个迟到动作 |
| 配方或设计正确，产物仍不能放行 | 基线、实际谱系、质量证据与专业决定分开 | [V07](packages/industry-networks/V07.md)、[V08](packages/industry-networks/V08.md)、[V10](packages/industry-networks/V10.md) | 查实际批次/设备资格；插入一个失效测量或旧解锁命令 |
| 估计、预留与实际支付混在一起 | 按责任维度分别保存可修订估计、额度占用与现金效果 | [V13](packages/commercial-finance/V13.md)、[V19](packages/people-service/V19.md)、[V01](packages/health-science/V01.md) | 查额度或责任规则；支付结果未知时保留占用，再重算 |
| 请求超时，重试的安全性未定 | 持久化操作身份；核对外部结果；明确补偿与人工接管 | [H01](packages/commercial-finance/H01.md)、[V12](packages/commercial-finance/V12.md)、[V18](packages/people-service/V18.md)、[X01](packages/data-ai-control/X01.md) | 查 provider 身份与查询能力；让回执在重试后到达 |

## 算法索引

每种算法先说明输入、单位、规模和要保持的不变量；复杂度与服务延迟分别验证。各案例采用的家族完整列在 [案例索引](../../vault/distilled/saas-engineering-atlas/case-index.json)。

| 家族 | 适用场景与取舍 | 方法章与案例演算 |
|---|---|---|
| lookup / 查找 | 用稳定键找对象；hash 平均 O(1) 与树索引 O(log n) 的前提不同，先保证身份完整 | [查找与索引](foundations/02-lookup-and-indexes.md)；[H02](packages/commercial-finance/H02.md)、[H04](packages/people-service/H04.md)、[X01](packages/data-ai-control/X01.md) |
| sorting / Top-K | 按可解释分数选少量优先项；顺序不能代替授权或运输可行性 | [顺序与区间](foundations/03-order-and-intervals.md)；[H06](packages/people-service/H06.md)、[H08](packages/data-ai-control/H08.md)、[V14](packages/commercial-finance/V14.md) |
| windows / 窗口 | 累计区间或事件时间；先定义半开边界、迟到和修订 | [顺序与区间](foundations/03-order-and-intervals.md)；[H01](packages/commercial-finance/H01.md)、[V06](packages/commerce-property/V06.md)、[V11](packages/industry-networks/V11.md)、[V22](packages/industry-networks/V22.md) |
| graph paths / 图路径 | 来源追溯和影响集合；方向、权限与环决定结果 | [图与连通](foundations/04-graphs-and-connectivity.md)；[H07](packages/data-ai-control/H07.md)、[V03](packages/health-science/V03.md)、[V15](packages/commerce-property/V15.md)、[V18](packages/people-service/V18.md) |
| dependencies / scheduling | DAG 求先后与关键路径；资源约束要另外加入 | [依赖与队列](foundations/05-dependencies-and-queues.md)；[H03](packages/commercial-finance/H03.md)、[H09](packages/data-ai-control/H09.md)、[V09](packages/industry-networks/V09.md)、[V20](packages/people-service/V20.md) |
| optimization / 优化 | 在硬约束内比较成本、时间或利用率；启发式不保证全局最优 | [有约束的选择](foundations/06-choices-and-optimization.md)；[V04](packages/commerce-property/V04.md)、[V19](packages/people-service/V19.md)、[V20](packages/people-service/V20.md)、[V21](packages/industry-networks/V21.md) |
| caches / 缓存 | 复用读取与计算；键、失效、版本和当前权限一起设计 | [复用与失效](foundations/07-reuse-and-invalidation.md)；[H07](packages/data-ai-control/H07.md)、[X01](packages/data-ai-control/X01.md)、[V16](packages/commerce-property/V16.md) |
| approximate / 近似 | 允许量化误差的估计；阈值附近需要精确复核，不能直接授予放行权 | [近似与检索](foundations/08-approximation-and-search.md)；[V03](packages/health-science/V03.md) |

## 技术栈索引

先读 [技术栈与研究](foundations/11-stacks-and-research.md)，分清一次动作由哪些部分负责，再从数据与恢复条件反推技术栈。下表列出案例设计中的候选构件，不描述 provider 的内部实现，也不指定框架。

| 系统需求 | 候选构件 | 前提与替代 | 案例入口 |
|---|---|---|---|
| 一并提交版本、数量、金额与唯一操作身份 | 关系数据库、约束、事务、操作账本 | 先界定本地原子边界；外部效果另用核对与补偿 | [H01](packages/commercial-finance/H01.md)、[H02](packages/commercial-finance/H02.md)、[V04](packages/commerce-property/V04.md)、[V19](packages/people-service/V19.md) |
| 应对回执重复、迟到与进程恢复 | durable outbox/inbox、队列或可恢复 worker | 小规模可先用数据库任务表；每项外部效果仍需独立身份 | [H08](packages/data-ai-control/H08.md)、[H09](packages/data-ai-control/H09.md)、[V18](packages/people-service/V18.md)、[X01](packages/data-ai-control/X01.md) |
| 保存文件/测量证据与引用版本 | 对象存储、内容摘要、关系元数据 | hash 判断内容身份，不能替代来源实例、权限、签署或保留义务 | [H09](packages/data-ai-control/H09.md)、[V02](packages/health-science/V02.md)、[V03](packages/health-science/V03.md)、[V18](packages/people-service/V18.md) |
| 追溯来源与变更影响 | 邻接关系表、递归查询或图计算 | 有实际多跳规模再考虑图引擎；先固定边类型与方向 | [H07](packages/data-ai-control/H07.md)、[V07](packages/industry-networks/V07.md)、[V15](packages/commerce-property/V15.md) |
| 处理时间容量与资源冲突 | 区间类型、约束/锁、调度器或求解器 | SQLite 上的合成检查证明不了生产环境的隔离；小时容量之外还要核对地点时窗 | [V06](packages/commerce-property/V06.md)、[V16](packages/commerce-property/V16.md)、[V20](packages/people-service/V20.md)、[V21](packages/industry-networks/V21.md) |
| 展示状态并应对投影滞后 | API + 查询投影 + UI 等待/冲突/重试状态 | 服务端复核当前权限与版本；界面禁用只是反馈 | [H06](packages/people-service/H06.md)、[H09](packages/data-ai-control/H09.md)、[X01](packages/data-ai-control/X01.md) |
| 接入 AI 给出的候选或检索结果 | 检索、模型适配、引用与评估记录 | 固定分母、留出集、拒绝条件和人工接管；模型输出不自动成为执行授权 | [H08](packages/data-ai-control/H08.md)、[V01](packages/health-science/V01.md)、[V02](packages/health-science/V02.md)、[X01](packages/data-ai-control/X01.md) |

选一个案例，完成“识题→解法→演算→验算→变式”，再按 [迁移地图](transfer-map.md)改变条件。真正实施时，还要查接口 schema、部署版本、业务制度、负载与故障证据；细项见各例末尾的探索方向。
