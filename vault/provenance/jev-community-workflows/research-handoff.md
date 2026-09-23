# Jev 社区工作流研究交接

## 范围与证据状态

本批只处理附件 `sources.json` 的 S13–S24：12 个 URL、12 个正文快照、1,140,956 bytes，全部 HTTP 200；`catalog.json` 的 `occurrences` 为空。按 `study_id` 去重后是 10 个研究/项目分组：S13/S14 同一 JEV-as-a-Judge，S17/S18 同一 JevHarness，其余各自分组；分组不等于独立验证。所有来源均 `live_api_rerun=false`，没有安装依赖、运行社区代码或复跑 benchmark。

`reported_date` 和本次 `checked_at` 分开登记。S14/S15 的本次范围只有 arXiv abstract HTML，状态为 `partial`；不能把它们写成已核查完整论文。GitHub 的 raw 快照与包登记 blob SHA 已核对，blob SHA 不是 commit。

## 可供 Q2/Q4 和实践地图使用的结论

JEV-as-a-Judge 的作者研究支持“confidence 用作升级信号”的候选模式：普通 preference/证据事实任务可接近强 judge，但 JudgeBench 的复杂推理、样式对抗和 reference-free prose 暴露明显边界；作者的 JEV→GPT-6 cascade 是离线、特定 workload、特定阈值的结果。适合写成“先用便宜 judge 增加观测密度，低置信或任务不适配时升级”，不能写成通用准确率或成本保证。

SREGym 的重点是端到端分母：10 个事件、每条件每事件 5 次，即 50 次尝试；20/50→24/50，两个事件退步。Jev 只选测试和审核证据，agent 仍执行操作。正确假设未进入候选集时，Jev 排序无法恢复；恢复当前功能也不代表未来 invariant 持久满足。Q2/Q4 应分别记录候选召回、证据质量、最终动作和持久性结果。

JevHarness 展示“强模型开发、冻结程序运行”的候选结构，但 README 自己说明 Pokémon 3/12→9/12 是 selection Eval，不能估计 unseen games。记录 JSON 进一步给出可追溯样式：输入、候选、概率、rounding、transport、usage、动作和结果都保留，但 `model_version_pinned=false`；`0.72` 是 action-choice probability，不是整场胜率。实践地图可采纳“冻结配置并保留完整 trace”的方法，不能采纳该成绩作为泛化证据。

pg-jev 的可迁移点是：批量共用 state、并发、read-ahead、session cache、spend guard，但作者的结构化测试显示 batch 1–20 为 100% 正确、40/80 下降，行位置映射是实际瓶颈。数据会发第三方 API，且 extension 要求 plpython3u/superuser；Q2 应将 batch、准确率、延迟、外发量和 cache 生命周期分开测。

Southbridge 将 entity identity 与 relation 分开判断：同一主体、同一家庭等关联都不能直接当作 merge 许可。其 Jev 主力 + Luna 复核结果来自作者困难切片、累计 call-seconds 和 TB 外推；可作为“实体、关系和复核层分离”的实践示例，不作为生产实体解析准确率。

RAG 文章把 lexical ranking 的“有多接近”与 Jev judging 的“是否支持回答、是否矛盾、是否有注入”分开，并把 keep/drop 与 receipts 放到代码层。作者明确阈值是小样本自校准，当前只清理输入证据，post-synthesis faithfulness guard 尚未实现。实践地图应保留 relevance、evidence、contradiction、injection、最终忠实性五个不同验收面。

SemIf README 记录 2026-09-22 新增 PyTorch/MPS、Qwen3.8-27B EXL3 bridge 和 workload-specific temperature calibration，并要求记录 model revision/prompt hash；它是接口模式的开放项目，不是 TypeSafe/Jev 权重或训练复现。MPS、量化、缓存和校准结果均需按 workload 重验。

## 证据 ID 与本地定位

| 证据 | 用途 | 本地定位 |
|---|---|---|
| JC-S13-JUDGE-01 / JC-S13-CASCADE-01 | Judge 任务适配、confidence escalation、cascade 分母和费用 | [S13 snapshot](snapshots/jc-s13-jev-as-a-judge-project.html.txt)，正文 Finding 01–04、When does escalation pay? |
| JC-S14-ABSTRACT-01 | 同一研究的 arXiv 摘要入口 | [S14 snapshot](snapshots/jc-s14-jev-as-a-judge-arxiv.html.txt)，Abstract；仅摘要范围 |
| JC-S15-SCI-01 | 语义选择、下游量和最终标签分离；20 Choices / 10 cases / 5 repeats | [S15 snapshot](snapshots/jc-s15-jev-scientific-decisions-arxiv.html.txt)，Abstract；仅摘要范围 |
| JC-S16-SRE-01 / JC-S16-SRE-02 | 10 events×5、20/50→24/50、候选缺失和 durable invariant | [S16 snapshot](snapshots/jc-s16-sregym-jev.html.txt)，How we integrated Jev、Results、Where Jev failed |
| JC-S17-HARNESS-01 / JC-S17-HARNESS-02 | 开发/运行冻结、3/12→9/12 selection Eval 污染边界 | [S17 snapshot](snapshots/jc-s17-jev-harness-readme.md.txt) 第 5–15、37–83 行 |
| JC-S18-TRACE-01 / JC-S18-TRACE-02 | 记录字段、0.72 动作概率和 `model_version_pinned=false` | [S18 snapshot](snapshots/jc-s18-jev-harness-turn12.json.txt) 第 1–26、203–241 行 |
| JC-S19-BATCH-01 / JC-S19-DATA-01 | pg-jev batch 位置准确率、cache、第三方 API 和权限 | [S19 snapshot](snapshots/jc-s19-pg-jev-readme.md.txt) 第 40–68、148–188 行 |
| JC-S20-LOOP-01 / JC-S20-LOOP-02 | 50 商品时延/调用量 trade-off、单人无金标、回溯价值 | [S20 snapshot](snapshots/jc-s20-jev-vs-agentic-loop.html.txt)，The numbers / Where the agentic loop still earns its cost |
| JC-S21-ENTITY-01 / JC-S21-ENTITY-02 | entity vs relationship 分离、Jev+Luna 复核 | [S21 snapshot](snapshots/jc-s21-southbridge-entity-resolution.html.txt)，This is where Jev comes in、What is a hank? |
| JC-S22-RAG-01 / JC-S22-RAG-02 | relevance vs evidence/support/injection、post-synthesis 未完成 | [S22 snapshot](snapshots/jc-s22-jev-rag-receipts.html.txt)，Ranking is not the same as judging、Conclusion & The Next Frontier |
| JC-S23-KG-01 / JC-S23-KG-02 | candidate generation vs judgment、stored threshold frontier | [S23 snapshot](snapshots/jc-s23-jev-kg-extraction.html.txt)，Selection, Not Generation、Threshold, Not Gate |
| JC-S24-SEMIF-01 / JC-S24-SEMIF-02 | MPS、calibration、model revision/prompt hash、量化/缓存限制 | [S24 snapshot](snapshots/jc-s24-semif-readme.md.txt) 第 17–33、80–182 行 |

## 未覆盖与争议

- 本批未覆盖 S01–S12；不能从本目录推断其状态。完整 24 entry 仍不是 24 个独立研究。
- S14/S15 未读取全文；S13/S14、S17/S18 不得重复计独立证据。
- 没有 live API、真实网络/费用、服务 SLA、数据驻留、模型版本稳定性、生产权限、安全动作或法律合同核查。
- 所有实验主要是作者自测：S16 分母小，S17 Eval 被用于选择，S20 一位人工无金标，S21 困难切片/成本外推，S22 小样本且未审最终忠实性，S23 合成小图谱，S24 自有 fixture。
- GitHub 当前 main/master raw body 可能变化；blob SHA 不能替代固定 commit。HTML 页面远端资产未镜像。
- `周更`只作为研究建议保留，没有创建或执行自动化任务。

## 晋升建议

可以进入 candidate 方法卡、等待独立场景验证的内容：

- 评估器按任务分布、候选召回、语义判断、最终动作和持久性结果分层；拒绝用固定重复次数或单一 score 代表全流程正确率。
- confidence 只作为 escalation signal；低置信或任务不适配进入更强 judge/人工，阈值按 workload 和错误成本校准。
- 研究/运行分离：强模型可修改候选 harness，运行版本固定并保存输入、问题、概率、版本、动作和失败；selection Eval 不当作 unseen holdout。
- batch/cache/并发/外发/权限单独测量；实体同一、关系、证据支持、注入和最终忠实性分别建模。
- 本地替代保留 model revision、prompt hash、后端/量化/温度校准和 out-of-fold 证据；不因 MPS 或接口兼容就宣称与 Jev 等价。

暂不晋升：JEV→GPT-6 的具体阈值/费用比、SREGym 4/50 增益、JevHarness 3/12→9/12、Southbridge TB 外推、RAG 53 calls、SemIf 与 Published Jev 的对齐数字，以及任何“通用准确率/SLA/生产安全”表述。main 可在 Q2/Q4 中作为作者自测和研究边界引用，并标明未复跑。

## 验收记录

- `catalog.json` JSON 解析和字段检查待 main 统一 build/validate；本目录未改全仓索引。
- 12 个 source 的快照 hash/字节数由本次读取登记；GitHub raw 文件的登记 blob SHA 另行保留，未将其当 commit。
