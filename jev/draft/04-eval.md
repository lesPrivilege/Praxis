# 四 · 评测

已发表的评测给出一个反复出现的结论：总体指标相近的两个决策模型，在部署关心的那一种错误上可以差得很远。区分能力（AUC、balanced accuracy）回答“排得对不对”，阈值上的误拒与误放回答“接进系统后会怎样”，两者要分开测。

## 4.1 已发表的评测

| 评测 | 谁做 | 决策模型做什么 | 主要结果 | 读的时候要知道 |
|---|---|---|---|---|
| SAG2（arXiv 2610.22588） | Yuchao Wu，单作者 | BM25 检索后判断证据，选扩展方向 | MuSiQue、2Wiki、HotpotQA 的 1,000 题子集 Recall@10 为 86.62、97.43、99.00；EnterpriseRAG-Bench 81.10 | 开发集子集与混合语料，不是全量 Wikipedia；MuSiQue 也参与了方法开发（§5.5）；只测证据召回，不测回答 |
| Knowviq | 在生产中使用 Jev 的检索产品 | 结果相关性、可回答性闸门、逐句证据支持 | 五个模型的 AUC 相近；0.75 阈值下 Jev 隐藏 22.2% 的好答案，其他 6–11% | 相关性标签由答案关键词匹配生成；可回答性只有 12 个“否”；句子支持只有 50 条随机样本 |
| Jev-as-a-Judge（arXiv 2610.20634） | Alden Do Rosario、Kirollos Atef（CustomGPT.ai） | 判断一条陈述是否得到证据支持 | balanced accuracy 73.27 对 GPT-6 Astra 73.83，无显著差异；不受支持陈述被放行 23.23% 对 14.14% | 495 条 LLM-AggreFact 开发集陈述；成本差约 187 倍是按 token 建模，不是实付；未测延迟 |
| jev-rag-benchmark | 与 TypeSafe 无关的个人仓库 | 替代 cross-encoder 重排 | SciFact nDCG@10 从 71.67 到 79.29 | 与 NVIDIA cross-encoder（78.70）打平：+0.59，CI −1.25 至 +2.42 |
| LargitData | 厂商博客 | 多轮企业 RAG 的路由、范围、模式与限制继承 | 四项同时正确：Gemma 4 31B 77.0%，Jev 1.13 61.4%；限制继承 84.4% 对 95.0% | 20 段对话、100 个决策；Jev 托管、Gemma 自托管 |
| Arize | 集成 Jev 的观测厂商 | RAGTruth 幻觉判断、Phoenix 评估器、路由 | RAGTruth balanced accuracy：Jev 85.5、Clef 85.2、d1 84.8、Laya 59.8 | 每个模型在各自调好的阈值下测；问题换一种措辞，d1 的 ROC AUC 从 0.92 掉到 0.17 |
| Deusser 等（arXiv 2609.37647） | 学术 | 37 个数据集零样本 | 27/37 超过 Qwen3.8-27B；choice 概率校准良好，binary 在固定 0.5 阈值下差 | 34.6 万次请求，总成本不到 10 美元 |
| Rao 与 Callison-Burch（arXiv 2609.29769） | 学术 | 作为 rubric judge | 27 组比较中决策模型显著落后的至多 6 组；LLM judge 贵 16–357 倍 | 只读了摘要 |
| System1-Arena（arXiv 2610.21244） | Tianyu Chen 等 | 92,125 个带类型问题、105 个任务 | Jev 非 agent 任务 72.6%、Brier 0.349、约 321 ms；Claude Opus 5.5 81.1%、Brier 0.232 | 检索与可回答性类任务未逐项读到 |
| jevrag | 第三方 PyPI 包 | 证据是否充分，决定是否继续检索 | HotpotQA 测试 700 题 EM 0.4129 对固定轮次 0.4057，不显著；检索轮次减少 38.5% | 数据与索引不公开 |

〔D-C-01至D-C-07, D-C-11至D-C-26, D-C-33, D-C-34, D-C-40至D-C-42, D-C-46, D-C-47〕

另有几份厂商或二手材料可作线索，不作依据：Amplitude 把 Jev 放在级联的第一级（64 张合成图表），Akita 比较了 23 个模型（用例由 AI 辅助生成），Glean 的查询分类与路由对照（样本量部分未写），MindStudio 转述的 Banking77 对比（没有原始出处）〔D-C-43至D-C-45, D-C-48〕。

中国移动 EnterpriseRAG 摘要里“全部约束同时满足 26.8%”是最好模型（Qwen3-235B-Thinking）的严格分，宽松分为 83.8%〔D-C-32〕。

## 4.2 四个反复出现的发现

**AUC 相近，阈值上的行为不同。** Knowviq 的可回答性闸门上，五个模型的 AUC 在 0.979 到 0.984 之间；套用同一个 0.75 阈值，Jev 隐藏 22.2% 的好答案，Clef-flash 6.2%。反过来，Clef、Clef-flash 与 Perplexity 放行的坏答案略多（负例的 4.5%，Jev 与 d1 为 2.7%）。Knowviq 为 Clef 单独定阈值后，结果徽章的误显示与误隐藏率与 Jev 在原阈值下基本一致〔D-C-13, D-C-14, D-04〕。阈值要按模型分别定。

**准确率相近，错误不同。** Jev-as-a-Judge 中两个系统的 balanced accuracy 没有显著差异，在 15.2% 的陈述上判断不同；Jev 放行的不受支持陈述多 9.1 个百分点（p = 0.000534）。负责拦截错误依据的组件，应以放行率评判，总体分数会掩盖这一差异〔D-C-18, D-C-19〕。

**按置信度升级与随机升级无法区分。** 同一篇论文里，把 Jev 不确定的约 30% 升级给 Astra，得到 74.10%、每千条 2.92 美元，对 Astra 单独 73.83%、8.93 美元；以同样预算随机升级，平均 73.36%；置信度门控高出随机 0.65–2.51 个百分点，区间不能排除零。论文的结论是省钱来自升级的比例〔D-C-21, D-C-22〕。

**当前轮判断与跨轮约束是两件事。** LargitData 的多轮测试里，Jev 在当前轮的路由、范围、模式上与 Gemma 接近，跨轮继承上一轮限制时落后 10 个百分点〔D-C-26〕。会话约束要由应用层保存和执行。

SAG2 补上了另一面：决策模型的收益很大一部分来自它所在的检索结构。MuSiQue 上 BM25 为 54.41，加 JEV 判断升到 67.93，再按已选证据扩展一轮、两轮，到 83.36、86.62；在判断次数相同的预算下，一次性 BM25 + JEV 只有 69.82〔D-C-05, D-C-06〕。

## 4.3 按决策单元组织评测

原 Chat 第 4 轮提出把模型决策本身与系统最终行为分开测，按决策单元列指标。下表保留那一版的单元，补上每个单元在 4.4 目录里可以借用的公开 benchmark：

| 决策单元 | 典型问题 | 指标 | 可借用的公开数据 |
|---|---|---|---|
| 候选相关性 | 这份材料与问题有关吗 | Recall@K、nDCG@K | BEIR（含 SciFact）、MTEB reranking、C-MTEB、HotpotQA supporting facts |
| 证据支持 | 证据支持这条陈述吗 | 放行率、precision | LLM-AggreFact、RAGTruth、FEVER、SummaC、AlignScore |
| 可回答性 | 现有证据够回答吗 | 误拒率、误放率 | SQuAD 2.0、MuSiQue-Full、RGB negative rejection、FreshQA false premise |
| 知识冲突 | 两份材料矛盾、补充还是版本替代 | 分类准确率、冲突漏检率 | WikiContradict、ConflictBank、EnterpriseRAG-Bench Conflicting Info（20 题） |
| 时间有效性 | 哪个版本在指定日期有效 | 时间截面正确率、过期证据误用率 | TimeQA、SituatedQA、FreshQA、ConflictBank temporal |
| 流程路由 | 继续检索、回答还是升级复核 | 联合正确率、端到端成本 | MTRAG、CORAL、CRAG、FRAMES |

〔原 Chat Turn 4；D-C-51至D-C-77〕

三项实验控制同样来自原 Chat：比较 reranker、决策模型与 LLM judge 时固定候选池与预算；阈值按模型单独校准、保留独立测试集；除静态问答外测知识变动（修订、替代、撤权、冲突资料加入、源文件消失）。上表最后两类在公开数据里覆盖最薄，企业知识库的版本与撤权尤其没有现成数据。

## 4.4 阈值的选法

Hamel Husain 与 Antaripa Saha（2026-10-20）给出一个可以照做的流程：每个模型对每条 trace 返回失败概率；分层五折交叉验证；在 precision 与 recall 都不低于 80% 的阈值里选 F1 最高的；没有阈值满足时退回不加约束的 F1 最优，并把这一折记为不可行。之后在 log-odds 上拟合 Platt scaling，同一组折用于所有模型，画 reliability 图，报 Brier〔C-C-27, C-C-28〕。

他们的数据只有 98 条租房 agent 的 trace，作者写明最低门槛只用来引导选择，不保证新数据上的表现。比较的模型有 Jev 1.13、Perplexity Decider 1.1、Liquid d1 与 d1-ultra、Clef Flash 和 OpenAI Decisions（GPT-6 Luna）；F1 最高的是 OpenAI，0.87，每百次评估 3.72 美分〔C-C-29〕。

## 4.5 公开 benchmark 目录

按决策类型列出，作为方向登记，未作选型。授权一栏只写读到的；空着表示页面没写。

| benchmark | 任务 | 规模 | 授权 | 决策类型 |
|---|---|---|---|---|
| MuSiQue | 2–4 跳组合问答；Full 版含不可回答的对照题 | 25K 题 | CC BY 4.0 | 相关性、可回答性 |
| HotpotQA | 多跳问答，句级 supporting facts | 113K | CC BY-SA 4.0 | 相关性、支持 |
| 2WikiMultiHopQA | 带推理路径证据的多跳问答 | — | CC BY 4.0 | 相关性 |
| BEIR | 18 个异构检索数据集的零样本检索 | 18 个数据集 | 按数据集 | 相关性 |
| MTEB | embedding 评测，reranking 为其中一类 | 58 个数据集 | 按数据集 | 相关性 |
| C-MTEB | 中文 embedding 评测 | 35 个数据集 | — | 相关性（中文） |
| CLUE | 中文理解 9 项任务 | 9 项 | CC0 | 分类、NLI（中文） |
| LLM-AggreFact | 基于文档核验 LLM 输出的陈述 | dev 30,420 / test 29,320 | CC BY-ND 4.0，仅限评测，需申请 | 支持 |
| RAGTruth | RAG 回答的词级幻觉标注 | 17,790 条回答 | MIT | 支持 |
| FEVER | 对照 Wikipedia 的陈述核验：支持、反驳、信息不足 | 185,445 | — | 支持、充分性 |
| SummaC | 摘要不一致检测 | 6 个数据集 | — | 支持 |
| AlignScore | 事实一致性的统一度量 | 22 个评测集 | — | 支持 |
| SQuAD 2.0 | 含不可回答问题的抽取式阅读理解 | 10 万可答 + 5 万以上不可答 | CC BY-SA 4.0 | 可回答性 |
| RGB | 噪声鲁棒、负例拒答、信息整合、反事实鲁棒；中英 | — | CC BY-NC-SA 4.0 | 可回答性、冲突 |
| CRAG | 模拟网页与知识图谱检索的 RAG，含时间动态性 | 4,409 | CC BY-NC 4.0 | 路由、时间 |
| FRAMES | 多约束、数值、表格、时间推理的多跳问答 | 824 | Apache-2.0 | 路由、相关性 |
| ConflictBank | 误导信息、时间、语义三类知识冲突 | 55.3 万 QA | CC BY 4.0 | 冲突、时间 |
| WikiContradict | 两段相互矛盾的 Wikipedia 段落上的问答 | 253 | MIT | 冲突 |
| FreshQA | 时效性与错误前提问答，定期更新 | — | Apache-2.0（仓库） | 时间、可回答性 |
| SituatedQA | 以时间或地点为条件的开放检索问答 | — | CC BY-SA 4.0 | 时间 |
| TimeQA | 长文档上的时间敏感问答 | — | — | 时间 |
| MTRAG | 多轮 RAG，含不可回答与不独立的问题 | 110 段对话、842 个任务 | Apache-2.0 | 路由、可回答性 |
| CORAL | 多轮对话式 RAG：段落检索、回答、引用标注 | 8,000 段对话 | 代码 MIT；数据授权说法不一 | 路由、支持 |
| CUAD | 合同条款抽取 | 510 份合同、41 类条款 | CC BY 4.0 | 抽取、长文档 |
| EnterpriseRAG-Bench | 合成公司 9 个系统的 511,962 份文档 | 500 题、10 类 | MIT（仓库） | 相关性、冲突、不存在 |
| EnterpriseRAG（中国移动九天研究院） | 噪声检索、知识缺失、事实冲突、复杂指令；6 个领域，中文 | 983 例 | 尚未发布 | 可回答性、冲突、约束遵循 |
| RAGAS / ARES | 无参考的 RAG 评测框架；ARES 用合成数据与微调 judge | 框架 | CC BY 4.0（论文） | 评测方法 |
| TREC RAG | 检索加生成，nugget 式评测；2026 年为 agent-first | 按年度 | — | 端到端 |

〔D-C-27至D-C-32, D-C-51至D-C-77〕

授权会限制用途：CRAG 与 RGB 不可商用，LLM-AggreFact 禁止演绎且只限评测。EnterpriseRAG-Bench 的类别名在原 Chat 里被意译，原名是 Project Related（40）、Constrained（30）、Conflicting Info（20）、Completeness（20）、Info Not Found（20）；来源系统共九个，除 Slack、Gmail、GitHub、Jira、Confluence 外还有 Linear、Drive、HubSpot、Fireflies〔D-C-28, D-C-29〕。

## 4.6 本章未核实

- Jev-as-a-Judge HTML 后约 7 万字、System1-Arena 与中国移动论文的后半部分未读。
- JevBench 的 preprints.org 论文返回 403；Benchmark Heaven 与 Artificial Analysis 的原页只经 BenchLM 镜像读到。
- FEVER、TimeQA、SummaC、AlignScore、MTEB、C-MTEB 的数据授权；FreshQA 与 RGB 的规模。
- 各论文表格经摘要工具读取，SAG2 的数字在论文与仓库 README 之间交叉核对过，主会话另读了 SAG2 与 Jev-as-a-Judge 的摘要页。
