# 附录 A · 数据库里的判断列

主流数据仓库在 2025–2026 年已经把“判断”做成 SQL 函数：Snowflake 的 `AI_FILTER`、`AI_CLASSIFY`，BigQuery 的 `AI.IF`、`AI.CLASSIFY`，Databricks 的 `ai_classify`，背后都是生成式 LLM。Jev 发布后五周内，Databricks 上线了第一个按 System One 请求格式设计的 SQL 函数 `ai_decide`，Snowflake 推出了私有预览的 Snowflake Decision，DuckDB、MotherDuck、PostgreSQL 出现了直接调用 Jev 的扩展。变化落在三处：判断列的类型变严格了，每一行带上了概率，单行成本低到可以对全表运行。

Astronomer 的 CTO 把这叫作 semantic column：值是一个判断，类型仍然是严格的〔E-14〕。

## A.1 平台现状

| 平台 | 函数 | 返回 | 背后的模型 | 状态与日期 |
|---|---|---|---|---|
| Databricks | `ai_decide(state, questions [, options])` | VARIANT：每个问题一个答案；noul 为 0–1 概率，choice 为 1–255 个标签之一，score 为 2–10 级上的概率加权平均 | 未点名；文档称当前可能用到的模型为 Apache 2.0 授权，经 Model Serving 提供，以后可能更换 | Beta；参考页 2026-09-29 更新，博文 2026-09-30，称与 TypeSafe API“直接兼容” |
| Databricks | `ai_query` 调用自部署的开放决策模型（SemIf-OpenJev） | 结构化决策与每个选项的概率 | 用户在 GPU Model Serving 上部署 | 博文 2026-09-24 |
| Snowflake | Snowflake Decision，经 `AI_COMPLETE` 调用 | choice：选中项、每项概率、confidence；score：概率加权分 | 未点名；博文引用 Jev Decision Index 0.2.1 上 57.63 分 | 私有预览，2026-10-07；Decision Fast 2026-10-19 |
| Snowflake | `AI_FILTER`、`AI_CLASSIFY`、`AI_AGG`、`AI_SIMILARITY` | `AI_FILTER` 为 BOOLEAN（出错为 NULL） | Cortex 托管的 LLM | 已有；`AI_FILTER` 内置优化称快 2–10 倍、token 少至多 60% |
| BigQuery | `AI.IF`、`AI.SCORE`、`AI.CLASSIFY`、`AI.AGG` | 布尔、分数、类别 | Gemini，由 BigQuery 选择 | 2026-04-13 GA；优化模式为 Preview |
| Microsoft Fabric | `ai.classify`、`ai.extract`、`ai.similarity` 等；T-SQL 也有 | 类别、抽取值 | 默认 gpt-5-mini，可换 | 页面 2026-09-19 更新；需 F2 以上容量 |
| ClickHouse | `aiClassify`、`aiFilter` | 字符串标签；UInt8，可用在 WHERE、PREWHERE、JOIN ON | 经 named collection 配置 OpenAI 兼容端点 | Beta；Cloud 为私有预览，博文 2026-09-11 |
| Redshift ML | `CREATE MODEL` 经 SageMaker 训练 | 分类时另生成返回标签与概率数组的函数 | XGBoost、MLP 等传统模型 | 已有；没有读到 LLM 判断函数 |
| MotherDuck | `prompt_jev()` | 真假概率、标签或分数 | TypeSafe Jev，数据经 TypeSafe 在美国处理 | 2026-09-21 上线；10-01 起按输入 token 计费；10-08 增欧洲区；管理员可关闭 |
| DuckDB 社区扩展 `jev` | `jev()`、`jev_prob()`、`jev_choice()`、`jev_score()` | 布尔、概率、选项、分数 | TypeSafe Jev | DuckDB 官方博客 2026-09-29 介绍；按至多 2,048 行一块批量发送 |
| DuckDB 社区扩展 `anofox_decide` | `decide_probability` 等 | 同上 | 可接 Jev、Liquid d1、Clef，也可接本地 Kev 等兼容服务；远程调用默认关闭 | 页面无日期 |
| PostgreSQL `pg-jev` | `jev(row, condition [, threshold])` 等 | 布尔（默认阈值 0.5）、概率、分数、jsonb | 默认 TypeSafe 端点，可改指本地兼容服务 | 个人项目，需要 plpython3u 与 superuser |
| Oracle Select AI | SQL 生成与对话 | — | — | 读到的页面里没有分类或布尔函数；博客返回 403 |

〔E-C-34 至 E-C-50〕

Oracle、Amazon Aurora ML 与 pgai 的官方文档没有读到或没有找到相应函数，表中的空缺是“没读到”，不是“确认没有”〔E-C-50, E-C-51〕。

## A.2 数据离开数据库的位置

DuckDB、MotherDuck 与 pg-jev 的 Jev 函数都把行内容发到 TypeSafe 的 API；DuckDB 的博文明确提醒不要用在没有权利外传的数据上〔E-C-42〕。MotherDuck 的欧洲区，数据也由 TypeSafe 在美国处理〔E-C-39〕。Databricks 的 `ai_decide` 在 Databricks 安全边界内处理，不存调用参数〔E-C-34〕；Snowflake 称每次 Decision 调用沿用既有的治理、访问控制与审计策略〔E-C-71〕。`anofox_decide` 与 `pg-jev` 可以改指本地的 Kev 或其他兼容服务，这时数据不出库〔E-C-43, E-C-44〕。

## A.3 研究里的语义算子

数据库研究把这类函数归为 semantic operators：按含义而不是按值做 filter、join、sort、aggregate。

| 工作 | 内容 | 结果 |
|---|---|---|
| LOTUS（Stanford / Berkeley） | 定义语义算子并给出带精度保证的优化 | filter、join、group-by、top-k 上最多快 1,000 倍 |
| Palimpzest（MIT） | 声明式 AI 分析的代价优化器 | 对单线程 GPT-4 最多快 90.3 倍、便宜 9.1 倍，F1 在基线的 83.5% 以内 |
| Cortex AISQL（Snowflake） | 生产中的语义 SQL 引擎 | 自适应模型级联快 2–6 倍，保留 90–95% 的 oracle 质量；语义 join 改写为多标签分类，快 15–70 倍 |
| Streaming Model Cascades for Semantic SQL | proxy 加 oracle 的流式级联 | F1 ≥ 0.95 时 oracle 调用比 LOTUS 的级联少至多 58% |
| Fast LLM-Based Semantic Filtering | 用 oracle 的置信度作软标签训练 proxy | 90% 精度目标下比此前最好方法快 1.6–2.0 倍 |
| ThalamusDB | 图像、音频、文本上带自然语言谓词的近似 SQL | 论文未打开 |

〔E-C-52 至 E-C-57〕

这些工作里的 proxy 都是不具名的小模型或生成式模型；没有找到用 Jev、Clef、d1 等 System One 模型作语义算子的论文〔E-C-57〕。

## A.4 判断列带来的新对象

把判断写进列以后，库里多出几样以前没有的东西：

| 对象 | 是什么 | 读到的现成做法 |
|---|---|---|
| 概率与 confidence 列 | 每个判断旁边的数，决定这一行自动通过还是转人工 | MotherDuck 演示保留 80% 以上置信的行，其余转人工；Airflow provider 的 `DecisionPolicy` |
| 问题定义 | `questions` 的 JSON：指令、选项与描述；改一个字，整列的含义就变了 | Databricks 要求 `questions` 为常量，同一组定义作用于每一行 |
| 模型版本 | 同一问题在不同版本上的答案会变 | Jev 响应返回实际作答的版本号；Databricks 文档写明可能更换底层模型 |
| 决策日志 | 每次判断的输入、问题、答案、概率、版本 | 没有厂商定义格式；Waehner 建议逐条记录并在换版本时重验 |

〔E-C-30, E-C-41, E-C-34, E-C-70, A-C-13〕

这四样都需要和数据本身一样被版本化、可回查。第五章 5.4 列了可借用的评测集与标注工具。

## A.5 本附录未核实

- BigQuery 发布说明只读了前 10 万字（共 36 万字）；`AI.GENERATE_BOOL` 的返回类型。
- Snowflake AISQL 各函数的 GA 日期与所用模型。
- 报道中 pg-jev 作者加入 Actian 一事只见于一条二手检索结果。
- d1 在不同目录里的上下文长度（32k 或 65,536）与价格（0.02 或 0.04 美元）不一致。
