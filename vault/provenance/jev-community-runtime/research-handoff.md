# Jev 社区实践运行时核查交接

交接对象：Astra/main。范围严格限定为用户附件 `Jev_社区实践研究包_2026-09-23/sources.json` 的 S01—S12；没有重复附件中的 S13—S24，也没有运行 Jev API、LangChain、Vercel Gateway、GitHub 仓库代码或任何基准。12 个正文快照、哈希、大小、逐 URL source、主张 ID 和限制都在 [catalog.json](catalog.json)。卡片由 main 后续生成。

本批的证据分级是：S01/S02 为 TypeSafe 官方文档；S03/S04 为 TypeSafe cookbook 自测；S05/S06 为 LangChain 集成方自测/产品公告；S07/S08 为 Vercel Gateway 集成公告；S09/S10 为社区实现和作者报告；S11/S12 为 JevBench 作者基准与离线组合回放。`verified` 只表示正文读取和定位完成；实验结果仍按来源类型保留自测、报告、离线回放的限制。

## 已核实的关键事实

TypeSafe 当前模型页列出 Jev `jev-1.13.0`、`jev-latest`/`jev-preview` 的映射、文本输入、请求与 state/question 上限、动态 rate limit，以及英语优先和版本化 ID 记录建议。模型页还说明 state 会被读取一次并供多个问题并行评估；这支持 Q2 的“一个状态、多个窄问题”设计，但不证明跨步因果推理。见 JC-Q2-01、JC-Q2-02、JC-Q4-01，快照 `snapshots/jc-s01-typesafe-models.txt`。

ZDR 必须按账户、合同和接入通道记录。TypeSafe Legal 只确认 enterprise customers 可申请 ZDR，并要求联系隐私邮箱；该页没有证明普通账户默认启用、数据不出网、具备某个 SLA 或独立安全测试许可。LangSmith 9 月 21 日集成说明写的是该 provider 当时不提供 ZDR；Vercel AI Gateway 9 月 16 日的 AI SDK 示例则把 `zeroDataRetention: true` 作为 Gateway request option。三条信息并不矛盾到可以合并为一个产品标签，也不能据此推出本账户已经启用 ZDR。见 JC-Q2-03、JC-Q2-08、JC-Q2-10，快照 `jc-s02`、`jc-s06`、`jc-s07`。

S03 的 AutoResearch cookbook 展示了“Jev 产出有限语义特征→CatBoost 负责下游预测”的结构：2,000 条 wine reviews，800 条留出，18 个问题到 38 个问题，示例 held-out RMSE 从 1.87 到 1.77；代码固定 `jev-1.12`。这能支持“把 Jev 当特征/局部判断层，再由独立程序或监督模型验收”，不能支持“Jev 1.13 在业务上已经正确”。S04 的 cascade cookbook 展示 mini→Jev verifier→reasoning escalation，100 prompts 曲线明确标为历史快照，成本未按当前 Jev 费率重算，代码同样是 `jev-1.12`。见 JC-Q4-02、JC-Q4-03、JC-Q2-04、JC-Q2-05。

## 分母、独立性和来源去重

S05 的实验分母必须写准确：5 条固定 weather agent 轨迹，每条重复评估 100 次，即 500 次对固定行为的重复判断。它不是 500 个独立任务，也不是 500 条独立 agent 轨迹。人工 oracle 只有一位 reviewer；页面指出 lower variance 不自动等于 correctness；LLM judge 没有固定 temperature、top-p、seed、max tokens；Jev service version 未写入实验元数据。LangChain 报道的 Jev 全部 500 次与 human oracle 一致，只能表达这个窄切片和固定行为下的重复结果。S06 的 LangSmith 文章复用 S05，不是第二次独立复现。见 JC-Q2-06、JC-Q2-07、JC-Q2-08、JC-Q2-09。

S09 README 与 S10 REPORT 应拆开消费。S09 证明仓库公开了 MCP server、skill router、评测脚本和报告入口；它没有证明已安装或生产安全。S10 报告保留了有用的负结果：RouterBench 的“是否需要强模型”约 51.3%（接近无信号），Who&When 轨迹失败归因 AUROC 0.560，中文子集弱于英文；同时它报告了已知候选目录的工具/agent 路由和 BM25→Jev skill 选择的正结果。这里要区分：

| 任务 | 证据支持 | 不能推出 |
|---|---|---|
| 工具/skill 候选选择 | 目录已知或先由 BM25 召回，再由 Jev 在小候选集内选择 | 全目录发现、无召回上限的端到端路由 |
| 模型难度路由 | 负结果，约随机/无信号 | Jev 能可靠预测某个具体模型会不会答对 |
| 轨迹失败归因 | 负结果，接近随机 | Jev 能从当前一步推断跨步因果失败 |
| 中文/长上下文 | 现有切片显示明显边界 | 所有中文、所有长任务都必然失败 |

README 写“约 22,500 次 API 调用、52.2M input tokens、$2.19”；REPORT 的评估方法段写“13,616 次、$0.45、P50 约 0.3s”。这两个统计范围没有在当前快照中被统一解释，catalog 已保留 `report-total-mismatch`，不得自行把它们相加或择一伪装成总账。见 JC-Q2-12—JC-Q2-14、JC-Q4-04、JC-Q4-05。

## JevBench 的费用和同底层去重

JevBench v1.3.0 的 Score 是 Intelligence、Calibration、Speed、Cost 的几何平均；Cost 的单位是每 1,000 个 **decision**，不是每 1,000 tokens。README 还给出 534 个 frozen decisions、Jev 1.13.0 平均输入 tokens 和公开费率推导的每千 decision 费用，并明说自托管/演示端点的延迟 ×2/+0.15s 是估计。正式回答应把这些写成 benchmark 的口径和假设，不写成企业账单、网络 p95 或真实吞吐。

JevBench 的 classifier.dev Fast 被移出排名，因为 README 说明其 fast tier 底层就是 Jev。这个去重是“独立模型证据/排名资格”的去重，不是“实际调用不计费”的去重。S12 组合研究进一步明确：每个被调用成员计成本，committee/best-of-n 等待最慢的并行成员，cascade 是串行等待；其 `classifier.dev Fast → Jev` 组合涉及同一 Jev 底层模型，因此不能当异构独立模型证据。若线上确实调用两次，仍应记录两次请求、两次费用和两段延迟。见 JC-Q2-15、JC-Q2-16、JC-Q2-17、JC-Q2-18，快照 `jc-s11`、`jc-s12`。

S09 与 S12 的 Git 内容身份有额外核对：当前 raw README 的 Git blob SHA 与附件记录的 `20601083742025be8d01b5692be3387c57a769fc` 相同；当前 raw JevBench combinations 的 blob SHA 与附件记录的 `0890ae70e22716fa60bbe8ad65f9d40cc97e261b` 相同。这只是内容对象身份，不是 commit；其余当前 main 内容没有在附件中给出可比较 blob SHA。

## 给 Q2 的可迁移实践

适合采用的路由结构是：代码负责权限、格式、日期、金额和确定性计算；Jev 负责窄问题的 typed Choice/Score/Noul 或候选内排序；高后果、跨步、需要因果解释或需要文字理由的节点交给更强模型/人工。每一层都保留原始 state、问题/选项、实际模型版本、SDK/通道、完整 probability、confidence 语义和最终动作，不能只保存离散标签。

级联要按 accepted result 评估：便宜节点、Jev verifier、升级模型、人审和返工的调用/等待/费用全部进入任务账本。Jev 发现的“窄局部判断”不应直接被解释为“模型能力预测”；S10 的模型难度路由负结果正好反例。工具选择也必须先记录候选召回率，再记录候选内选择率；Jev 选择得再准，召回漏掉正确工具时端到端结果仍不能超过召回上限。

等待和成本的界面应展示：使用的模型/版本/通道、已运行调用、剩余阶段、实际 usage、是否在等待人审或外部回执、是否可取消、结果是否已验证。外部来源的美元价格、LangChain 自测的 0.44s 或 JevBench 假设都不是本产品 SLO。需要新结论时，优先补目标业务的 p50/p95、accepted-result cost 和人工返工，而不是继续收集同类宣传数字。

## 给 Q4 的可迁移实践

Jev 的类型化输出只是 schema/选项空间约束，不能替代业务真值。上线材料应包含自有样本、独立标签、校准曲线、严重漏报、弃权/人工交接、输入分布切片、版本和通道。分数、概率分布、confidence、业务正确率和最终动作必须分开记录；阈值要围绕风险事件和尾部概率，而不是只读平均分或四舍五入等级。

S03 的特征工程提示一个可控路径：将若干有明确语义的问题转成特征，由独立监督模型或代码组合；S04 的级联提示验证与升级；S10 的负结果提示模型路由不能冒充能力预测；S11/S12 提示复合分数和组合收益必须同时支付所有调用并承受串行/最慢延迟。所有自动放行策略先影子运行，在独立验收集和真实分布上测严重风险，不因厂商自测或 benchmark 排名直接改变权限。

## 未覆盖和再核查触发

- 没有本轮 API、Gateway、LangSmith 或社区代码实跑；不能确认账户、通道、ZDR、实际价格、重试、缓存、SLA 或网络地区。
- S02 只读 Legal 索引，没有读取 DPA/MCA/Privacy Policy；正式合同或合规判断必须另行核查。
- S05/S06 的服务版本、完整请求参数和人工标注过程不完整；不能把 500 repeated decisions 视作独立任务集。
- S09/S10 的数据集、结果 JSONL、脚本和运行环境未复制；报告数字与总账存在内部口径差异。
- S11/S12 是作者定义的 benchmark/离线 replay，不是生产业务金标；延迟和价格有作者假设，组合没有线上 p95。
- 模型、别名、SDK/网关、ZDR、数据处理条款、候选召回、下游标签、后端量化/缓存和风险成本变化时，均触发复核。

本批没有执行周更或自动化监控建议；只登记复核触发条件，等待 main 的统一治理决定。
