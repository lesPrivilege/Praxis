# Source scope review

Read on 2026-10-14 against textbook commit `ee597ceaa3675f818746c6122353858872af17e4`. All 40 local source records, their 40 review entries, and all 61 claim mappings were read. Fifteen primary originals were reopened selectively through web text/PDF-text access; the other 25 were not independently reopened. No third-party summary was used to validate the selected assertions.

“Reopened” means the indicated sections were read, not that the entire work, implementation, or experiment was independently validated. All reopened ranges supported the scoped textbook claims; R5 identifies an omitted condition in the teaching explanation. No full original pages were copied into the public review. URLs are live and were not snapshotted; the reviewed package’s source notes likewise disclose no snapshots. This limits historical reproducibility. Product pages were used as evidence of that product’s behavior, not of consensus.

The selected set emphasizes monetary-operation retry semantics, transactional handoff, solver proof states, graph/optimization costs, approximate data structures, filtering, and evaluation interpretation. PDF formulas were checked in extracted text; visual inspection and full-paper proof checking were not performed.

## Reopened originals

| Local source ID suffix | Authoritative source | Read scope and assessment |
|---|---|---|
| `ods-python-btree` | [Open Data Structures — 14.2 B-Trees](https://opendatastructures.org/ods-python/14_2_B_Trees.html) | Definition in §14.2; height discussion. Equal leaf depth and bounded nonroot branching are explicit in the original. This supports R5: page capacity alone is not the missing invariant. |
| `mit-dijkstra` | [MIT 6.006 Lecture 16: Shortest Paths II — Dijkstra](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/6277a1f06100c26a7ff21031af6757b5_MIT6_006F11_lec16.pdf) | Lecture 16, printed pp. 2, 4–6; DAGs, Dijkstra, analysis. Nonnegative weights, relaxation, topological DAG alternative and priority-queue cost distinctions support chapter 4. The chapter does not falsely extend the guarantee to negative edges. |
| `python-graphlib` | [graphlib — Functionality to operate with graph-like structures](https://docs.python.org/3/library/graphlib.html) | TopologicalSorter; is_active; get_ready; done; CycleError. Ready and processed nodes are distinct. Running work can keep the sorter active while get_ready yields no new nodes. Supports the repaired chapter 5 distinction. |
| `rabbitmq-confirms` | [RabbitMQ — Consumer Acknowledgements and Publisher Confirms](https://www.rabbitmq.com/docs/confirms) | Are Publisher Confirms Related to Consumer Delivery Acknowledgements?; acknowledgement modes. Publisher confirms and consumer acknowledgements cover different communication boundaries. Chapter 5 preserves this distinction and conditions guarantees on configuration. |
| `aws-outbox` | [AWS Prescriptive Guidance — Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html) | Intent; Issues and considerations; Using an outbox table with a relational database. Database update and outbox insertion share a transaction; a separate reader dispatches events; duplicate handling is necessary. Supports chapter 5, while R1 shows the local checker does not actually consume its outbox. |
| `mit-knapsack` | [MIT 6.006 Lecture 21: Dynamic Programming III](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/3484e876d81aba07911a1109f5b5e81e_MIT6_006F11_lec21.pdf) | Lecture 21, printed pp. 4–5, Knapsack and Pseudopolynomial Time. The capacity must be part of the subproblem. Integer-size O(nS) work is pseudo-polynomial. The chapter’s table and unit scaling agree. |
| `stanford-bound` | [Branch and Bound Methods — Stephen Boyd and Jacob Mattingley](https://web.stanford.edu/class/ee364b/lectures/bb_notes.pdf) | Introduction and §1, printed pp. 1–3. Provable bounds and exponential worst-case work support the prose. The book explicitly reverses minimization bound directions for its maximizing knapsack. Its 6.5 bound was independently recomputed. |
| `ortools-status` | [Google OR-Tools — CP-SAT Solver](https://developers.google.com/optimization/cp/cp_solver) | CP-SAT return values table. OPTIMAL, FEASIBLE, INFEASIBLE, MODEL_INVALID, and UNKNOWN have the distinct meanings used by chapter 6. No solver was run by the review. |
| `redis-eviction` | [Redis — Key eviction](https://redis.io/docs/latest/develop/reference/eviction/) | Approximated LRU algorithm; LFU eviction and decay parameters. Redis uses approximation/sampling and frequency aging, supporting the explicit distinction from the deterministic exact cache fixture. R2 is a local evaluator error, not a contradiction of Redis behavior. |
| `hll-paper` | [HyperLogLog: the analysis of a near-optimal cardinality estimation algorithm](https://algo.inria.fr/flajolet/Publications/FlFuGaMe07.pdf) | §1 / Figure 2; §4 / Figure 3 and standard-error discussion, PDF pp. 13–15. Register maxima and asymptotic standard error about 1.04/sqrt(m) are supported; practical small-range correction is separate. Four-register arithmetic is not an estimator accuracy experiment. No full-paper proof replication. |
| `pgvector` | [pgvector/pgvector — README](https://github.com/pgvector/pgvector) | README, Indexing / Filtering / Iterative Index Scans. Approximate-index filtering can leave fewer results, and increased/iterative scans trade work for candidates. Chapter 8 does not claim a universal logarithmic worst-case guarantee or report an executed ANN benchmark. |
| `pg-isolation` | [PostgreSQL — 13.2. Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html) | §13.2.1–13.2.3, including conditional UPDATE recheck and transaction retries. Read Committed rechecks an UPDATE condition after a concurrent update; stricter levels have serialization failures requiring retries. Supports chapter 9’s conditional single-row update and multirow caution, not a claim that SQLite tests PostgreSQL. |
| `stripe-idempotency` | [Stripe API Reference — Idempotent requests](https://docs.stripe.com/api/idempotent_requests) | API v1/v2 distinction; execution-start response saving; parameter comparison; pruning. The fetched text distinguishes API v1 response replay from API v2 retry behavior, and documents v1 key pruning and parameter checks. Chapter 9 accurately scopes the example to the chosen API protocol. |
| `k6-load` | [Grafana k6 — Open and closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/) | Closed Model; Drawbacks of using the closed model; Open model. Closed iteration arrival depends on completion time; an open arrival-rate model decouples them. The chapter correctly treats latency targets and workload values as synthetic test design. |
| `openai-eval` | [OpenAI — Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) | Best practices; anti-patterns; Design your eval process; human calibration. Task-specific evaluation, representative real-world distributions, continuous comparison and human calibration are supported. R6 recommends a concrete prevalence example to make distribution dependence actionable. |

## Local evidence records only

The following entries were inspected for original title, locator, claim scope, chapter use, and source/claim identity. Their original contents were not reopened in this review. They remain a coverage limit; a structurally present citation is not a new independent confirmation.

| Local source ID suffix | Original source | Recorded claim scope |
|---|---|---|
| `ods-hash` | [Open Data Structures — 5.1 ChainedHashTable: Hashing with Chaining](https://opendatastructures.org/ods-python/5_1_ChainedHashTable_Hashin.html) | 链地址法、碰撞检查与装载受控时的期望/摊还成本；字符串算 hash 的长度成本另计。 |
| `python-bisect` | [bisect — Array bisection algorithm](https://docs.python.org/3/library/bisect.html) | 有序序列的分割位置、对数查找与线性插入；不能把插入也称为对数成本。 |
| `pg-index` | [PostgreSQL — 11.2. Index Types](https://www.postgresql.org/docs/current/indexes-types.html) | PostgreSQL B-tree 的等值、范围和排序能力，以及 Hash 索引的简单等值能力。 |
| `ods-binary-trie` | [Open Data Structures — 13.1 BinaryTrie: A digital search tree](https://opendatastructures.org/ods-python/13_1_BinaryTrie_digital_sea.html) | 按位路径表示整数键；本书字符路径算例属于明确说明的教学推广。 |
| `cmu-sorting` | [Comparison-based Lower Bounds for Sorting — 15-451 lecture notes](https://www.cs.cmu.edu/~avrim/451f11/lectures/lect0913.pdf) | 比较排序的最坏情况 Ω(n log n) 下界只适用于比较模型。 |
| `python-heap` | [heapq — Heap queue algorithm](https://docs.python.org/3/library/heapq.html) | 堆的局部顺序、少量最大/最小项选择与并列处理；业务评分和教学算例是本地定义。 |
| `cses` | [Competitive Programmer’s Handbook — Antti Laaksonen](https://cses.fi/book/book.pdf) | 双指针的单调移动、静态前缀和、最早结束的无权区间选择与回溯剪枝；不借用书中数据或性能表。 |
| `beam-window` | [Apache Beam Programming Guide](https://beam.apache.org/documentation/programming-guide/) | 事件时间、处理时间、水位线和迟到数据影响窗口结果的完整性与修订。 |
| `ods-graph` | [Open Data Structures — 12.3 Graph Traversal](https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html) | BFS 层次、DFS 访问颜色和有向环，邻接表遍历 O(V+E)。 |
| `opendsa-union` | [OpenDSA — 13.2. Union/Find and the Parent Pointer Implementation](https://opendsa-server.cs.vt.edu/ODSA/Books/CS3/html/UnionFind.html) | 互不相交集合、按规模合并和路径压缩；近常数描述为大量操作的摊还性质。 |
| `python-cache` | [functools — Higher-order functions and operations on callable objects](https://docs.python.org/3/library/functools.html) | 按参数复用、有限缓存及线程安全缓存仍可重复执行函数体；适用纯计算。 |
| `redis-bloom` | [Redis — Bloom filters](https://redis.io/docs/latest/develop/data-types/probabilistic/bloom-filter/) | 概率成员判断、误报、容量和扩展。正文误报率的分母明确为实际不存在的查询，公式是本地推导的独立性近似。 |
| `redis-hll` | [Redis — HyperLogLog](https://redis.io/docs/latest/develop/data-types/probabilistic/hyperloglogs/) | 成熟实现提供基数估计和摘要合并；未把产品说明当作本书性能实测。 |
| `hnsw-paper` | [Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs](https://arxiv.org/abs/1603.09320) | 只支持分层邻近图的结构直觉；不据摘要断言任意数据的最坏 O(log n)，也不称全文复现。 |
| `react-state` | [React — Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure) | 界面状态避免矛盾与冗余；未强制使用 React，也不据页面状态推断业务已确认。 |
| `hypothesis` | [Introduction to Hypothesis](https://hypothesis.readthedocs.io/en/latest/tutorial/introduction.html) | 生成输入、与独立参照比较、反例及输入域约束；本地程序采用标准库穷举而非执行 Hypothesis。 |
| `pact` | [Pact — Introduction](https://docs.pact.io/) | 消费者与提供者的契约兼容测试；不等于真实服务可用或业务闭环。 |
| `playwright` | [Playwright — Best Practices](https://playwright.dev/docs/best-practices) | 以用户可见行为和稳健定位组织浏览器测试；本轮未运行浏览器。 |
| `chaos` | [Principles of Chaos Engineering](https://principlesofchaos.org/) | 用可测业务输出、假设和扰动实验验证韧性；正文给实验设计，不记录真实生产故障。 |
| `sre-monitor` | [Site Reliability Engineering — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) | 延迟、流量、错误、饱和度与尾延迟；本书负载数字是合成目标。 |
| `helm-paper` | [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110) | 多场景、多指标的评估视角；仅摘要已读，不借此声称复现 HELM 或得到模型分数。 |
| `django` | [Django at a glance](https://docs.djangoproject.com/en/5.2/intro/overview/) | 模型、数据库访问、模板和管理界面是可组合成熟能力；不宣称最新版本或性能排名。 |
| `fastapi` | [FastAPI — Features](https://fastapi.tiangolo.com/features/) | OpenAPI 接口描述和 JSON Schema 模型文档/校验；事务与任务仍需另行设计。 |
| `aspnet` | [What is ASP.NET?](https://dotnet.microsoft.com/en-us/learn/aspnet/what-is-aspnet) | 请求处理、模板和认证的官方能力说明；不指定部署形态。 |
| `vue` | [Vue.js — Introduction](https://vuejs.org/guide/introduction.html) | 声明式视图、响应式状态和渐进采用；不是固定框架套餐。 |

## Evidence classification

The local evidence catalog has 40 source-backed statements, 18 synthetic-example statements, one explicit Bloom-rate derivation, and two inference records (method transfer; test/stack design). This separation is useful. HNSW and HELM are explicitly limited to abstracts, BinaryTrie-to-character-trie is labeled as teaching extrapolation, and the Bloom formula states its uniformity/independence approximations. The synthesis examples are not converted into provider facts.

The catalog does not independently prove that its own prior reading occurred. Its `read-scoped` status, source-review dates and empty unresolved-gap list are author assertions. The 15 original reopenings above are this review’s independent checks. No single-provider practice was found labeled as consensus in the chapters or terminology index. Framework options were assessed as conditional design guidance, not as measurements or exhaustive recommendations.
