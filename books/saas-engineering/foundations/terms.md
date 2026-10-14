# 术语与原文索引

中文解释采用正文的含义；英文保留可检索的原名。同一个英文词在数据结构、协议与业务中可能指不同边界，下面按用途区分。来源的完整原文标题与章节定位见 [evidence.json](../../../vault/distilled/saas-engineering-atlas/foundations/evidence.json)。

## 计算结构

| 正文用语 | 原文 / 缩写 | 本书含义与容易混淆之处 | 章节 |
|---|---|---|---|
| 散列、散列表 | hash, hash table | 从完整键定位桶，碰撞后仍比较键；短 hash 不能代替业务身份 | [2](02-lookup-and-indexes.md) |
| 二分查找、下边界 | binary search, lower bound | 在有序序列找第一个不小于目标的位置；插入成本另算 | [2](02-lookup-and-indexes.md) |
| B 树 | B-tree | 一个节点容纳多键、多分支；与二叉树不同，B 不在本书臆作缩写展开 | [2](02-lookup-and-indexes.md) |
| 前缀树 | trie | 沿符号路径共享前缀；BinaryTrie 的符号是位，字符 trie 的符号是字符 | [2](02-lookup-and-indexes.md) |
| 前 K 项 | Top-K | 按完整比较规则选择 K 项；并列处理决定是否恰好 K 项 | [3](03-order-and-intervals.md) |
| 堆、优先队列 | heap, priority queue | 堆是优先队列的一种实现；堆顶有序不等于整数组已排序 | [3](03-order-and-intervals.md) |
| 双指针、滑动窗口、前缀和 | two pointers, sliding window, prefix sums | 分别是扫描方式、连续范围、累计表；有联系但不互为同义词 | [3](03-order-and-intervals.md) |
| 广度 / 深度优先搜索 | breadth-first search (BFS), depth-first search (DFS) | BFS 逐层扩展；DFS 沿支路再回退；等权最短路可按层数计代价 | [4](04-graphs-and-connectivity.md) |
| 松弛、降低键值 | relaxation, decrease-key | 松弛尝试改进路径估计；decrease-key 更新优先队列键值 | [4](04-graphs-and-connectivity.md) |
| 并查集 | disjoint-set union (DSU), union–find | 维护互不相交集合的代表；不保存有向依赖或完整路径 | [4](04-graphs-and-connectivity.md) |
| 有向无环图、拓扑排序 | directed acyclic graph (DAG), topological sort | DAG 是图的性质，拓扑排序是满足前提顺序的一种线性排列 | [5](05-dependencies-and-queues.md) |
| 先进先出、双端队列 | first in, first out (FIFO), deque | FIFO 是顺序规则，deque 是可从两端操作的结构；都不自动提供持久化 | [5](05-dependencies-and-queues.md) |
| 贪心、动态规划 | greedy, dynamic programming (DP) | 贪心需局部选择的证明；DP 通过完整状态复用子问题 | [6](06-choices-and-optimization.md) |
| 回溯、剪枝、分支限界 | backtracking, pruning, branch and bound | 回溯搜索候选；分支限界用有效目标界排除分支；启发式估计不自动成为界 | [6](06-choices-and-optimization.md) |
| 约束规划 / 可满足性 | constraint programming (CP), satisfiability (SAT) | CP-SAT 是 OR-Tools 求解器名，最优性相对于输入模型 | [6](06-choices-and-optimization.md) |
| 记忆化、缓存 | memoization, cache | 记忆化复用同一函数输入的结果；缓存还涉及共享、新鲜度、容量和失效 | [7](07-reuse-and-invalidation.md) |
| 最近最少使用 / 最不经常使用 | least recently used (LRU), least frequently used (LFU) | 一个看时间次序，一个看频率；精确教学策略与采样实现可产生不同结果 | [7](07-reuse-and-invalidation.md) |
| 存活时限、淘汰、失效 | time to live (TTL), eviction, invalidation | TTL 是时间策略；淘汰释放容量；失效表示结果已不适用 | [7](07-reuse-and-invalidation.md) |
| 布隆过滤器 | Bloom filter | 命名来自 Bloom；判断集合成员的概率结构，阳性仍需核对 | [8](08-approximation-and-search.md) |
| 去重数量估计 | HyperLogLog (HLL), cardinality estimation | HyperLogLog 保留原名；基数是不同元素数，不是元素清单 | [8](08-approximation-and-search.md) |
| 近似最近邻搜索 | approximate nearest neighbor search (ANN search) | ANN 在本书不表示 artificial neural network；近邻候选不等于语义正确答案 | [8](08-approximation-and-search.md) |
| 分层可导航小世界图 | hierarchical navigable small world (HNSW) graph | 多层邻近图的一种索引机制，正文用其结构直觉 | [8](08-approximation-and-search.md) |

## 应用与验证

| 正文用语 | 原文 / 缩写 | 本书含义与容易混淆之处 | 章节 |
|---|---|---|---|
| 权威记录、读取投影 | system of record, read model / projection | 权威由事实责任决定；投影为查询组织数据，能否延迟由使用场景决定 | [1](01-problems-and-objects.md)、[9](09-from-ui-to-recovery.md) |
| 动作命令、动作前提、事件 | command, guard, event | 分别表达请求、允许执行的条件、已发生的事实 | [1](01-problems-and-objects.md) |
| 界面、应用接口、传输协议 | user interface (UI), application programming interface (API), Hypertext Transfer Protocol (HTTP) | 三者处于不同边界；请求成功码需由业务契约解释 | [9](09-from-ui-to-recovery.md) |
| 发件表、收件台账 | outbox, inbox | 本地持久化的交接记录与消费身份，不是界面中的邮件文件夹 | [5](05-dependencies-and-queues.md)、[9](09-from-ui-to-recovery.md) |
| 执行者、派发器、代理、外部服务 | worker, dispatcher, broker, provider | 执行任务、派发消息、转交消息、提供外部能力是不同角色 | [5](05-dependencies-and-queues.md) |
| 幂等、去重、恰好一次 | idempotency, deduplication, exactly-once | 重复请求不增加逻辑效果、识别重复身份、某个明确边界的处理语义，不能互相替代 | [9](09-from-ui-to-recovery.md) |
| 测试样例、参照答案、模拟对象 | fixture, test oracle, mock | 测试初始材料、判定正确性的参照、受控替身；oracle 不是必须采用的数据库产品 | [10](10-verification-and-evals.md) |
| 单元 / 性质 / 差分测试 | unit / property-based / differential testing | 单元划分测试对象；性质跨输入成立；差分比较两个计算结果 | [10](10-verification-and-evals.md) |
| 集成 / 契约 / 端到端测试 | integration / contract / end-to-end (E2E) testing | 组件连接、边界兼容、用户路径分别建立证据 | [10](10-verification-and-evals.md) |
| 故障注入、负载测试 | failure injection, load testing | 改变运行条件或工作到达量，再观察业务与性能判据 | [10](10-verification-and-evals.md) |
| AI 评估、语言模型综合评估 | artificial intelligence evaluation (AI eval), Holistic Evaluation of Language Models (HELM) | eval 是评估活动；HELM 是特定研究项目 | [10](10-verification-and-evals.md) |
| 真 / 假阳性，真 / 假阴性 | true positive (TP), false positive (FP), true negative (TN), false negative (FN) | 正类须先定义；本书正类为应建议退款核查 | [10](10-verification-and-evals.md) |
| 精确率、召回率、准确率 | precision, recall, accuracy | TP/(TP+FP)、TP/(TP+FN)、(TP+TN)/总数；三种分母不同 | [10](10-verification-and-evals.md) |
| 前 K 项召回率 | recall@k | 本书 ANN 算例分母为精确近邻数 k；业务相关文档召回需另定义标注全集 | [8](08-approximation-and-search.md) |
| 尾延迟、分位数 | tail latency, percentile (p95/p99) | p95/p99 分别对应 95%/99% 的观测分位；不等于最大耗时 | [10](10-verification-and-evals.md) |
| 接口描述、数据结构约束 | OpenAPI, JSON Schema | OpenAPI 是接口描述规范名；JSON（JavaScript Object Notation）是数据格式，Schema 表达数据约束 | [11](11-stacks-and-research.md) |
| 软件即服务、站点可靠性工程 | software as a service (SaaS), site reliability engineering (SRE) | 分别描述服务交付模式和工程实践领域 | [11](11-stacks-and-research.md)、[10](10-verification-and-evals.md) |

`booking` 在案例中保留预约/资源占用的具体对象含义；`folio` 指住宿账单明细；`signoff` 指相应版本的专业签认。三个词都不能仅因界面出现“完成”就统一成同一种批准。具体行业对象沿用 [33 案例目录](../../../vault/distilled/saas-engineering-atlas/case-index.json)中的案例定义。
