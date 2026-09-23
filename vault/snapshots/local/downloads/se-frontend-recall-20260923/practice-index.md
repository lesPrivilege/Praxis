---
Status: Practice Index · Evidence and Revision Ledger
Edition: 2026-09-14
Canonical base: 2026-09-14 Canonical Edition
Practice base: 2026-09-14 Generalized Practice Snapshot
Scope: 来源、局部命题、证据边界、检验状态与增量修订记录。
---

# Schema Engineering · Practice Index

## 引用、检验与增量修订记录

## 一、用途

Practice Index 保存会折旧的实例、来源和裁决记录。Canonical 定义 Kernel，Practice 给出当下可执行的泛化快照，Index 回答：

- 某项局部观察来自哪里；
- 它直接支持什么，不支持什么；
- 应如何复现、消融或证伪；
- 经过讨论后，是否修订 Canonical 或 Practice；
- 哪一版文本吸收了何种最小增量。

Index 不是案例汇编，也不为正文提供必要前提。删除 Index 后，Canonical 和 Practice 仍应各自完整。

---

## 二、登记格式

每个条目至少包含：

```text
id / observed_at / source_class
source / version or access date
observable mechanism
smallest supported claim
unsupported extrapolations
verification or falsification
text disposition
status
```

状态只使用：

| 状态 | 含义 |
|---|---|
| observed | 来源和机制已登记，未形成文本裁决 |
| abstracted | 已抽取可检验的最小机制 |
| indexed | 只保留于 Index，不修订正文 |
| practice-adopted | 已以泛化形式写入 Practice |
| canonical-adopted | 已证明现有 Kernel 边界需修订 |
| rejected | 观察不足以支持候选命题 |
| superseded | 条目的产品或解释已被后续证据覆盖 |

---

## 三、局部命题索引

### PI-01 · Runtime composability

- **观察**：插件原生 Runtime 公开 model、tool、session、event、permission、question、storage 与 UI seam；可组合系统还可以提供 effect tracking、dependency resolution、configuration reconciliation 与可逆生命周期。[^dsh-home][^dsh-readme][^dsh-architecture][^dsh-question][^dsh-ui][^cordis]
- **最小命题**：Work Extension 可以在不把领域语义写入宿主核心的条件下被封装、加载、撤销和投影。
- **不支持**：Work Contract 正确；跨宿主零成本迁移；热替换后成果质量不退化。
- **检验**：No Core Patch、Upstream Upgrade、Plugin Reload、AOT / JIT Equivalence。
- **处置**：Practice §2.1、3.1 以宿主无关表述采用；具体 API 仅留本条。
- **状态**：practice-adopted。

### PI-02 · External completion governance

- **观察**：在所选长程软件重建任务中，供应方先构造 executable standard of completion，再以它约束实现与 continue / stop decision；报告结果来自自选任务和自建 system / benchmark。[^factory-completion]
- **最小命题**：独立于当前 Agent 的 completion inventory、evidence procedure 与 validation gate 可以改变长程执行结果。
- **不支持**：一般专业正确性；完整 Work Contract；跨领域因果；独立复现。
- **检验**：固定模型与任务，消融 external completion inventory、evidence gathering 和 stopping gate，同时报告负面结果。
- **处置**：Practice §2.3 采用泛化机制；数字与供应方叙事留在 Index。
- **状态**：practice-adopted。

### PI-03 · Feedback compilation

- **观察**：实践系统将相对稳定的 procedural Skill 与 inference-time Memory 区分，把 domain instructions 保存为文件，在工作位置捕获 Human feedback，由 improver 提出小幅 diff，再经普通 PR / review / merge 流程进入后续执行；材料同时提醒 feedback 可能错误，需筛选其 Authority 与适用范围。[^warp-improver]
- **最小命题**：Human correction 可以被低摩擦捕获、审阅、版本化并在模型权重之外跨 Run 复用；可复用 procedural rule 的变更应走独立于自动 Memory 写入的 commitment path。
- **不支持**：Skill 已成为完整 governance substrate；accepted-work-product 因果；post-training 收益；局部偏好可泛化；自动 improver 已能判断所有 feedback 的 Authority。
- **检验**：检查 feedback Authority、scope、version、rollback、Reviewer disagreement 与后续 outcome。
- **处置**：Practice §2.4、6.3 采用；具体产品流程留在 Index。
- **状态**：practice-adopted。

### PI-04 · Project-bounded recall

- **观察**：Frontier lab 的官方产品文档描述工作域内的记忆隔离、旧对话检索与域外上下文排除。[^frontier-project-memory]
- **最小命题**：持久内容可以按工作域隔离，历史可以保留检索权而不必全量占用当前 Context。
- **不支持**：Project 等于 accountable Matter；retrieval 等于 Current Semantic State；Review、Authority 与 supersession 已解决。
- **检验**：Retrieval / Canonical Separation、Session Replacement、stale-state reintroduction。
- **处置**：Practice §2.5 采用机制区分；产品名与版本留在 Index。
- **状态**：practice-adopted。

### PI-05 · Managed resource surface

- **观察**：Frontier lab 的官方文档公开 memory synthesis、project scope、persistent file references、source reuse 与 source disclosure 等产品表面。[^openai-managed-resources]
- **最小命题**：Context 可以从一次 message payload 转向拥有 identity、scope、lifecycle 和 reference 的可管理资源；storage 与 current attention 可分离。
- **不支持**：不可观察的 backend 已采用 event / object ontology；UI 表明 Govern layer 已成立；资源不会在模型输入前被 flatten。
- **检验**：查验 identity、scope、version、source return、deletion、expiry 与 Context disclosure，不从 UI 反推内部实现。
- **处置**：Practice §2.5、4.3 采用 storage-attention separation；产品表面留在 Index。
- **状态**：practice-adopted。

### PI-06 · Execution-to-judgment migration

- **观察**：专家文章指出，即使 Agent 降低局部实现成本，人仍需理解 data architecture、system architecture、security、reliability、production operation 与 lifecycle trade-off。[^andrew-ng-se-fundamentals]
- **最小命题**：execution 变便宜不会自动消除 architecture、verification 和 lifecycle judgment。
- **不支持**：该作者提出了 Schema Engineering；人需要理解的内容必然应全部成为系统状态；软件工程与专业工作的成熟度对称。
- **检验**：在执行成本下降后，测量决策、验证、责任和生命周期错误是否成为更主要的成果失败来源。
- **处置**：只作为 Practice 的结构假设背景，不在正文点名。
- **状态**：indexed。

### PI-07 · Proactive context management

- **观察**：Frontier 研究把 context editing 表达为 planning、structured memory、offloading、partial rollout 与 snapshot-level credit 的一部分，并公开 inference、evaluation 与 training 实现。[^contextpilot-paper][^contextpilot-code]
- **最小命题**：Context 的删除、摘要、压缩与重载是改变后续行为的 action，可以被快照、回放和给予局部 credit。
- **不支持**：已建立 governed Matter memory；被保留的内容具有正式效力；特定长上下文任务的结果具有跨领域外部效度。
- **检验**：Context Mutation Preservation；对 token、局部得分和 accepted-work-product 分别报告；保留 Raw Evidence recovery、scope 与 lifetime。
- **处置**：Canonical §5.4 作最小边界澄清，Practice §2.6、4.4 写入实现与测试；不新增 ontology 或原则编号。
- **状态**：canonical-adopted / practice-adopted。

### PI-08 · Multi-agent work topology

- **观察**：个人实践描述多种模型或 TUI 共享 harness、skills 与工作约束，并用 planner、worker、critic 等位置隔离 Context；另一个人实践强调并发实例需要状态、优先级、隔离环境与调度。[^fryxell-harness][^ondrej-setup]
- **最小命题**：执行拓扑、能力配置、工作责任与最终 Authority 是不同对象。
- **不支持**：角色名称等于 Expert；Agent 数量提高必然改善质量；个人工作流已证明一般架构或收益幅度。
- **检验**：Runtime Profile Separation、Correlated Review Failure、Authority Failure。
- **处置**：Canonical §4.3–4.4 已充分表达责任区分，不修订；Practice §2.7 增加 topology / Expert 分离及相关测试。
- **状态**：practice-adopted。

### PI-09 · Documentation as work surface

- **观察**：社区实践把文档驱动、对抗审查、测试、复杂度约束、完整记录与工作索引并置。[^document-driven-practice]
- **最小命题**：文档可以兼任执行规格、审阅、恢复和交付表面；同一文件形式不消除对象的制度差异。
- **不支持**：Session log 等于 Current Semantic State；自动索引可以改变正式状态；Agent 共识等于验收；个人报告的成本比例具有一般性。
- **检验**：Documentation Promotion Boundary、Session Replacement、Candidate / Committed Isolation。
- **处置**：Practice §2.8、5.4 采用；Canonical 已有 History / State / Context / Artifact 边界，不增加新对象。
- **状态**：practice-adopted。

### PI-10 · Structured state as the execution substrate

- **观察**：Google / Purdue 的 *SKILL.state: Scalable Long-Horizon Agent Skills* 将长程 procedural execution 表达为 `immutable procedure + current structured state + latest observation`，由模型提出 State Patch 与 action，再由 deterministic runtime 验证、merge 和执行。论文 v2 于 2026-08-28 修订，arXiv 页标注 accepted at EMNLP。[^skill-state]
- **最小命题**：在 Current Semantic State 能够作为后续执行充分统计量的长程 procedural task 中，canonical structured state 比 append-only conversational history 更适合作为默认 execution substrate；它可以同时降低累计 token 复杂度和 history contamination。
- **实验边界**：论文在 synthetic SkillExecBench、InterCode CTF 与 Sierra τ-Bench 上比较 ReAct-style Prompt、Summary Memory、State + History 与 State-only Runtime。Warehouse `T=100` 的 budget-matched 对照中，sliding window、capped summary、LLMLingua 与 structured state 的 score 分别为 0.18、0.52、0.22 与 0.94；structured state 的累计 token 为 65,408。`T=200` 时 structured state 报告 0.94 / 约 122k tokens。在 `T=50` 每轮 50 个 distractor events 时，Prompt 与 structured state 的 score 分别为 0.53 与 0.98。[^skill-state]
- **不支持**：History 可以从存储删除；固定 Schema 适用所有专业工作；论文已建立 Evidence、Authority、Review、Artifact version 或 Matter governance；单 Agent procedural benchmark 结果可直接外推到审计、法律、投资或多写者工作。
- **论文自述限制**：State 必须是 future execution 的 sufficient statistic。该假设在三类场景失效：Schema 需在执行中发现；旧 Observation 的重要性未被及时识别和 commit；historical trajectory 本身是 auditing、debugging provenance 或解释过去行动的工作对象。当前实现也只验证单 Agent；多 Agent 共享 State 还需要 deterministic concurrent-write conflict resolution。[^skill-state]
- **失败归因**：论文对一个较小 open-weight model 的 State 失败分类为 premature overwrite / deletion 68%、schema comprehension / type coercion 20% 和 JSON syntax 12%。这只能说明失败在结构化 transition 后更可归因；不证明 reasoning error 已被消除。[^skill-state]
- **检验**：State Sufficiency / History Disclosure、Patch Preservation、Context Omission / Pollution、Session Replacement、Candidate / Committed Isolation。消融应同时比较 accuracy / accepted outcome、token、latency、recovery、source preservation 和旧 Observation 召回。
- **处置**：Canonical §5 增加一句带 sufficient-state 条件的规范性收敛，不新增原则；Practice §2.5、4.3、7.3 增加 Memory / State / Schema 区分、State-first 运行链与边界测试。论文名、数字和限制仅留 Index。
- **状态**：canonical-adopted / practice-adopted（局部实证，待专业工作场景复现）。

### PI-11 · Fresh-context continuation as a runtime hypothesis

- **观察**：用户保存的 2026-09-03 Codex 实现讨论截图描述一个候选 `new_context` 机制：Agent 可以结束已污染的 working window，在不生成 compaction summary 的情况下进入 fresh initial context，并通过 history / notes 类工具按需取回旧信息。当前公开 OpenAI 文档能够确认长程 Runtime 对 compaction、state continuity、tool orchestration 与 autonomy boundary 的支持，但未能独立确认该截图中的具体接口、合并状态或发布语义。[^openai-runtime-context]
- **最小命题**：将 history 作为可查询数据源、将 current Context 作为可销毁 working set，是一条不同于“持续把旧 attention 压入新 attention”的 Runtime 路径；两者可以并存。
- **不支持**：Codex 已停止 compaction；`new_context` 已发布或会按截图落地；notes / history 已构成 governed Matter State；fresh window 一定提高 accepted-work-product。
- **检验**：Fresh-context / Compaction 对照；Session Replacement；State Sufficiency / History Disclosure；比较关键约束遗漏、旧状态重引入、token、latency、recovery 与 accepted outcome。
- **处置**：现有 Canonical §5 和 Practice §2.5–2.6 已能表达，不因未独立核验的产品接口修订正文；仅作为 Harness 内化 context / state management 的候选趋势保留。
- **状态**：indexed（产品实现观察待公开来源或可重复实验确认）。

### PI-12 · Human attention as a review constraint

- **观察**：Mitchell、Ghosh 与 Passi 的 position paper 认为，把人放入 Agent loop 不自动构成有效监督；Agent 的速度、步骤与长期自动化可能削弱 situational awareness、形成 approval fatigue，并使监督所需技能退化。论文提出 strategic friction、bounded autonomy、batch review、automated pre-checks、monitoring 与组织协议等设计方向。[^agents-out-of-loop]
- **最小命题**：Human Review 有独立的 attention 与 cognition constraint；Review Contract 必须规定人看到什么、何时看到、以何种 decision unit 和 Evidence 颗粒度看到，而不能只规定“存在 approval step”。
- **不支持**：论文实证了某一种 Review UI；所有 batch review 都优于逐项 review；review duration、override 或 canary 单项指标能够证明判断质量；HITL 可以消除能力差距或责任风险。
- **检验**：固定任务、Agent 与 Authority，比较 raw chronology、tool-call approval 与 structured decision packet；测 critical error detection、evidence-seeking、Review time、override、later reversal、canary 与 accepted-work-product。
- **处置**：Canonical §6.6 增加 Review 的认知充分性与 decision-unit projection；Practice §5.1、5.3、7.3 增加 Human attention、Review Sufficiency 与监测边界；不新增 Contract 类型或原则编号。
- **状态**：canonical-adopted / practice-adopted（设计约束；具体 UI 收益待实证）。

### PI-13 · Software engineering becomes work-shaped beyond the task boundary

- **观察**：*Harness-of-Harness* 把多日 autonomous software development 组织为迭代的 planning–coding–testing 循环（论文原文用语；本 Index 此前转述为 planning–development–independent QA），并把实现期测试与独立评测分开。Runtime 保存 software Artifact State 与 Evidence State，为不同 role 冻结输入、限制读写权限、要求 structured output、按 concise index 渐进披露持久 Artifact，并把 Evidence 绑定到 read-only candidate version。[^hoh]
- **最小命题**：当 coding autonomy 跨出一次 bounded task，持续推进需要长期 Specification、Artifact continuity、Evidence continuity、bounded objective、role-specific Authority 与独立 Acceptance；Artifact 与 Evidence 谁也不能替代谁。
- **实验边界**：论文在三个 software benchmark、三组 harness–model pair 和一个 70+ iteration 游戏开发案例中报告增益；多日案例来自单一项目和作者系统，benchmark 的 verifier 与软件 substrate 也比多数专业工作更可执行、可回放和可版本化。[^hoh]
- **不支持**：Planner / Developer / QA 是通用最佳拓扑；QA 报告已经形成外部 commitment gate；固定 Specification 适合规则会演化的工作；software tests 可以替代 broader professional judgment；结果可直接外推到法律、投资或机构审批。
- **检验**：固定模型、Harness 与任务，消融 Artifact / Evidence dual state、progressive disclosure、role Authority、frozen candidate 和 independent Acceptance；分别测 regression、重复工作、unsupported completion、token、recovery 与 accepted artifact。
- **处置**：Canonical §8.5 增加 coding 跨 task boundary 后的 work-shaped runtime 与外推边界；Practice §4.3 增加 Artifact / Evidence dual continuity；具体角色、模型、benchmark 与数字仅留 Index。
- **状态**：canonical-adopted / practice-adopted（软件域局部实证，跨专业域待验证）。

### PI-14 · Evaluator criteria have a governed lifecycle

- **观察**：Netflix 的 production case study 把 LLM judge 组织为 Birth、Training、Deployment、Monitoring 四阶段 lifecycle：专家定义 must-have criteria、labeling guideline、边界样本与 rationale；rubric tuning 同时处理 label error 和“同为 fail 但 reason 不一致”；生产中 judge 既 gate explanation，又把 reason 送回 bounded revision；每周 Human review 监测 drift 和 rubric gap，新 rubric 经 manual review gate 后才能部署，旧版保留 rollback。[^judge-lifecycle]
- **最小命题**：当 criterion、verdict 或 reason 会改变生产 lifecycle 时，Evaluator 与 rubric 本身是需要 owner、version、monitoring、Review、deployment gate 和 rollback 的 governed artifacts；label agreement 不能覆盖具有下游后果的 attribution error。
- **实验边界**：案例只覆盖一个 recommendation-explanation family 和 mobile surface；部分 criterion 与模型细节未公开；drift-triggered automatic retuning 尚未在生产触发；meta-judge 与 primary judge 使用同一 base-model family，可能存在相关错误。[^judge-lifecycle]
- **不支持**：LLM-as-a-Judge 可以替代 Accountable Reviewer；该 rubric lifecycle 已验证一般专业 Work Contract；单一 judge 的 gate 与 critique 复用在所有领域都更安全；线上业务 lift 证明每项 rubric revision 的因果。
- **检验**：Criterion / Evaluator Version Binding；Right-label / Wrong-reason cases；Drift and Rubric-gap Detection；Candidate Rubric / Deployed Rubric Isolation；Rollback；下游 revision contamination。
- **处置**：Canonical §11.2 增加 Evaluator / criterion lifecycle 与 reason 的执行后果；Practice §7.3 增加 Evaluator Lifecycle 测试；数字、产品规模与限制仅留 Index。
- **状态**：canonical-adopted / practice-adopted（生产案例，外部效度受限）。

### PI-15 · Repository-governed handoff continuation

- **观察**：在 2026-09-04 本轮续行中，新 Run 先读取仓库 README、CONTRIBUTING、papers/README、CHANGELOG、近期 commits、三份 source 的责任边界与 build / validation 规则，再按需展开三段 chat attachment 和原始论文；它识别 PI-10 已完成裁决而未重复引入，并把未公开的 Codex 接口观察、论文证据与本文综合推论分开处置。
- **最小命题**：显式 repository state、revision protocol、source / generated artifact 分工与可查询 history 可以让一次新的执行在不把全部旧聊天当作 Current Semantic State 的条件下继续修订。
- **不支持**：单次自观察证明该方法优于 compaction；Agent 未获得隐含上下文；结果已经由独立 Reviewer 接受；相同协议能在其他模型、仓库或专业领域稳定复现。
- **检验**：用同一修订任务比较 repository-governed handoff、仅提供 chat summary 与无治理文件三组 fresh Run；检查重复论断、来源错配、Canonical 过度修订、版本一致性、验证通过率、Review time 与 later reversal。
- **处置**：只登记为本轮方法自观察和 V-13 起点，不作为 Canonical 或 Practice 成立的外部证据。
- **状态**：observed（单次自观察，待独立对照与人工 Review）。

---

### PI-16 · Product signals motivate offline attribution

- **日期 / 来源类别**：2026-09-05 访问；作者发布、由从业者补充的实践分享。用户提供的微信链接无法直接读取；已核对同作者 Substack 全文，聊天转述仅作查找线索。[^manus-research-bench]
- **观察**：文章以事实点数量和隐喻率描述 Research Bench 的局部指标；报告 GPT 搜索调用较多但最终信息量较低，检查中间笔记后修改写法，并自报信息量改善。文中也承认指标需要线上结果持续校验。
- **最小支持命题**：输出信号可以引导 trace inspection，并产生针对中间表示和 Harness 的修订假说。这是产品诊断实践的局部观察。
- **不支持的外推**：Search 次数不等于接触到的相关信息量，不能排除检索质量或覆盖不足；干预自报没有给出足以独立复现的对照与效应区间，不能认定唯一因果；信息点数量不自动度量真实性、相关性或义务覆盖；隐喻率不等于易读性。文章未公开的架构不能据此判定存在或缺失；本文不采用其中关于隐喻必然造成信息损失的数学解释。
- **检验**：固定来源、任务和资源预算，比较自由摘要、原子笔记与按既有 Work Contract 记录证据关系的表示；以独立核对的任务义务和来源支持为参照，分别测抽取遗漏、持久化遗漏、Projection 遗漏与最终使用错误，同时记录相关性、重复、未获支持的主张、Review 时间和成果接受。端到端检索另设对照；不以同一个抽取器生成并裁决全部参照。
- **讨论与裁决**：具体案例只入 Index；结合 PI-14、PI-17 与既有 P19、P21，把诊断、受控比较和回归发布合成为 Practice 的离线 Eval 实践。Schema 提供可检查的位置和关系，不自动提供完整观测、正确标签或因果识别。
- **正文处置**：Practice §6.5 补全 Runtime 外的评测闭环；无需新 ontology、Contract 类型或原则。
- **状态**：practice-adopted（机制设计已采用；收益与因果待验证）。

### PI-17 · Evaluation harness and agent harness have distinct responsibilities

- **日期 / 来源类别**：2026-09-05 访问；Anthropic 官方工程实践总结，2026-01-09 发布。[^agent-evals]
- **观察**：文章区分 task、trial、grader、trace、outcome 和 evaluation harness；区分能力探索与回归检查，并要求校准 grader、读取轨迹、隔离试验环境、重复运行及结合生产观察。
- **最小支持命题**：执行 Agent 的 Harness 与组织试验、记录、评分和比较的评测设施可以分担不同职责；一次试验的最终外部状态不能只从 Agent 自述推断。
- **不支持的外推**：工程建议不是通用收益的受控实验；离线通过不等于专业工作已被接受；重复调用同一家族模型不形成独立专业判断；Trace 可读不等于失败原因已被识别。
- **检验**：固定同一候选版本，对比单次总分与重复、按风险分层的指标及盲审；注入环境残留、评分顺序变化和 grader 漂移，检查结论是否变化；用未参与调优的任务和后续成果复核判断。
- **讨论与裁决 / 正文处置**：与 PI-16 合并支持 Practice §6.5 的评测理念；沿用 Canonical §8.5、10、11.2 的分层与归因边界。
- **状态**：practice-adopted（工程方法；SE 的增量效度未完成验证）。

---

### PI-18 · Existing foundations and the scope of the contribution

- **日期 / 来源类别**：2026-09-05；概念定位与独立审稿裁决。核对原作者 Event Sourcing 说明、W3C PROV-DM 与 OMG CMMN 1.1 的正式来源。[^event-sourcing][^prov-dm][^cmmn]
- **观察与承接关系**：Event Sourcing 用事件序列保存状态变化并支持重建，对应本文的 Ledger / reducer 参考实现；PROV-DM 提供 entity、activity、agent 与 derivation 等来源表达，对应 provenance 的既有建模基础；CMMN 提供 case、case file 与 case plan 的建模标准，对应工作对象和非固定流程的既有基础。
- **最小支持命题**：这些原语已有明确先例。本文提出的是面向 Agent 的实践编订、候选提交、状态投影与评测修订的组合框架，不是状态、案件管理或来源建模的首次发明。
- **不支持的外推**：术语相近不表示模型完全等价；PROV 的 derivation 不自动等于 Evidence Contract 的语义支持；CMMN 不自动包含本文全部模型权限与 Context 语义；事件溯源不是治理成立的唯一实现。这组定位不构成穷尽相关工作的综述。
- **检验 / 反例**：以既有案件或流程系统加来源记录与模型接口为基线；只有在相同工作要求下出现可归于编订、提交或连续性边界的增量，才主张组合收益。不能以“基线不叫 SE”排除已经实现同等机制的系统。
- **讨论与裁决 / 正文处置**：Canonical §2 交代贡献与承接关系；§4 把事件溯源限定为参考实现，保留既有 SoR 路径。
- **状态**：canonical-adopted（定位与边界澄清；组合收益待验证）。

---

### PI-19 · Replaceable execution, durable control and contained failure

- **日期 / 来源类别**：2026-09-06 访问；InfoQ 对 TiDB、腾讯研究院、Floatboat 与 Trae 从业者的访谈报道。[^infoq-thin-loop]
- **观察**：TiDB 受访者将内部 Harness 概括为“薄 Agent Loop，厚 Control Plane”，报告从 OpenCode 更换到 Pi 时保留 Sandbox、权限、持久状态与恢复设施；同一报道还描述 declarative goal、低通信拓扑、通过明确状态与结果协作，以及 `fail fast → limit propagation → recover from trusted state`。项目周期、workspace 数量与无人工编码／审阅均为受访者自报，未见本文独立复核。
- **最小支持命题**：通用执行 loop 与持久状态／权限／副作用／恢复边界可以分层；模型吸收通用执行步骤时，Work Contract 可以减少不承载专业语义的 imperative orchestration；长程可靠性需要衡量错误传播与 trusted recovery，而不只衡量连续步数；可分解任务可以优先通过 bounded state output 协作。
- **不支持的外推**：Pi 或任何 Agent core 是通用最优；所有 Skill 或 orchestration 都会消失；所有工作应使用数据库、filesystem、MVCC、checkpoint 或 Multi-agent；少通信必然提高结果；受访系统已经实现完整 Work Contract、Matter governance 或 accepted-work-product gate；自报规模与周期具有独立因果效度。
- **检验**：固定模型、任务、资源与 Work Contract，替换等价 Agent loop 并比较状态语义与成果；比较 declarative contract 与固定 planner / worker / reviewer 路径；在不同阶段注入错误，测 durable-state contamination、detection latency、rollback loss 与 recovery success；比较 governed branch / artifact 汇合与高频 messaging 的冲突、重复、成本与接受结果。
- **讨论与裁决 / 正文处置**：Canonical §2.1、3、4.5、5.4–5.5 与 8.1 只吸收 declarative contract、Matter / Session / Run、Context compilation、failure containment 和可替换执行的最小关系，不采用产品实现为理论来源；Practice §2、3、4、5、7、8 增加实现、UI、复用、测试与失败边界。未新增 ontology、Contract 类型或原则编号。
- **状态**：practice-adopted；canonical-adopted（既有边界的必要澄清，实证效果未验证）。

---

### PI-20 · Runtime compatibility and action-channel guarantees

- **日期 / 来源类别**：2026-09-07；用户提供的架构讨论与本轮文本对照，属于设计推论，无新增实证。
- **来源**：[Harness架构对比](chatgpt-conversation://6a9e6c32-5afc-83ec-834b-19ba8b9e9efa)，本轮读取完整四轮讨论。聊天中的产品说明与引用未独立核验，不作为供应方实现事实。
- **可观察机制**：讨论提出 provider-managed / 自封装薄 Runtime 两条路径，终端围绕 Review / revision 组织，并比较 SaaS API 与 Computer Use 的适配成本；这是方案描述，不是运行观察。
- **最小支持命题**：由既有分层 Contract 推导，替换执行层与操作通道必须保留工作语义并显式检验能力缺口；执行复杂度应随任务要求选择。
- **不支持的外推**：不证明 Codex 或 Claude 的具体内部机制、CodeRabbit 的定位与优劣、专业任务普遍简单、API 天然幂等或可回滚、Computer Use 必然替代 connector，也不证明 SE 因治理语义而必然拥有市场优势。
- **复现 / 证伪**：V-19 固定 Work Contract 比较原生、模拟和缺失能力的执行层；V-20 注入未知副作用结果并切换操作通道；另以相同成果接受标准比较薄与完整 Runtime 的开发、运维、Review 和恢复成本。均未运行。
- **讨论与裁决**：Canonical §13.2、P21 与 F21 已容纳替换边界，不改正文；Practice §3.1 重写逻辑责任、能力协商、薄 Runtime 及通道选择，并在 §7.3 补充测试。§5.3 已表达面向变化的 Review surface，不重复增加产品类比。拒绝把“停止→注入→恢复”视作无条件等价的 steering，也不把本地 checkpoint 当作外部回滚。
- **正文处置 / 状态**：已吸收为实现约束；9.6 重写 §3.1，并将新增的逐项测试移至 PI-21 / V-19–V-20。性能、互操作性与经济性待验证。不新增 ontology、Contract 或原则。

---

### PI-21 · Structured state, authorized views and reusable CS mechanisms

- **日期 / 来源类别**：2026-09-07；用户提供的概念讨论与本轮文本对照，属于形式化候选与工程研究线索，无新增实证。
- **来源**：[稳定 Schema 是否向量空间](chatgpt-conversation://6a9e71a9-85b4-83ec-8a39-93f4a1427090)。已读取三轮讨论，依次涉及状态空间、分层披露和 CS 范式迁移。初次入账未核理论文献；9.6 审阅补核下列原始资料，聊天类比仍不作为定理、实现保证或新颖性证据。
- **可观察机制**：讨论尝试以同一 Schema 表达 Matter State、候选变化及不同执行角色的可见视图，并提出数据库、编译器、权限与程序分析机制作为实现候选。这是方案描述，尚无运行观察。
- **最小支持命题**：既有 Schema、Context Projection 与 Authority 边界可以进一步转译为可测试的状态约束、读取策略、候选操作和提交检查；工程选型可按这些职责查找成熟机制，不必增加新的 Kernel 对象。
- **数学边界**：可暂记 `X_S = {x ∈ ∏ᵢ Xᵢ | I_S(x)}`，表示满足 Schema 不变量的异质状态集合；分量间约束意味着并非所有字段组合都合法。候选操作 `p` 在给定版本、授权与前置条件下通过部分转换 `apply_S(x, p)` 求得候选结果，正式生效另经提交边界。这里不默认存在状态减法、线性加法、标量乘法或可逆操作；操作组合可能有顺序依赖、冲突或无定义。数值字段、文本 embedding 与稳定字段名均不能自动赋予整个工作状态向量空间结构。“坐标系”只作表示类比；流形、切空间与局部线性化需要另行定义结构和证明条件，本次不采纳。
- **披露边界**：视图可暂记为 `v_i = π(x; assignment, purpose, policy_version, state_version)`；可读范围、可提议操作与可提交权限分别验证。授权过滤应在数据跨越相应信任边界前执行，但不因此把 Project 固定为新增流水线阶段或规定它总先于所有检索；可信域内的查询计划和最终 Context 编译可以分阶段实施。摘要、索引、缓存、日志、工具参数与结果也属于需检查的传播路径；隐藏原文不排除从派生值推断敏感信息。权限撤销不能使已经披露的数据自动消失。

| 候选范式 | 对应的既有 SE 职责 | 迁移边界与待检验问题 |
|---|---|---|
| 数据库 view、行列访问控制、查询优化、物化视图 | 按 Matter / role / purpose 生成 Context Projection 与 Retrieval Index | 普通 view 或 projection pushdown 不自动成为安全边界；检查跨对象关联、派生字段、缓存失效与撤权后的重建 |
| 编译器 IR / lowering、ISA / ABI 契约 | Work Contract 的中间表示与 Host Adapter 兼容边界 | 不将 Schema 等同于 ISA，也不新增 Work ABI；版本映射、语义保持和能力缺失继续按 PI-20 / V-19 检验 |
| 类型、guard 与状态转换检查 | Candidate 形状、前置条件与 typed commitment boundary | 类型正确不等于 Evidence 充分或具有 Authority；并发版本冲突仍需提交时验证 |
| OS 隔离、object capability、信息流控制 | 资源访问、最小权限、委派与输出去向 | 执行层 capability 不等于组织 Authority；RBAC 与 capability 可组合。Context 裁剪不是内存隔离或不泄漏证明，读取与外传权限的组合需单独检查 |
| Abstract interpretation / abstract domain | 保留 unknown、冲突、限定和任务所需性质的抽象视图 | 普通摘要不自动具有 soundness；须定义具体域、抽象域、所保留性质与转换关系后才讨论可靠近似，不能仅凭两个映射声称 Galois connection |
| CQRS / event sourcing | 读投影、候选命令、正式写入与可恢复历史 | 二者不互相蕴含，也不自动提供 Review / Authority；沿用 PI-18，事件溯源仍只是参考实现 |

- **不支持的外推**：Schema 稳定即变化可自由组合、Context 编译必然确定或最小充分；数据库检索与投影可以任意交换且保持权限和结果；Agent 只能知道本次 Context 中的信息；传统 CS 只治理计算位置而不治理信息与动作；通用理论机制已证明 SE 的安全性、效率、专业正确性或市场价值。
- **复现 / 证伪**：V-21 比较源端授权视图与检索后过滤，注入跨 Matter 关联、敏感派生值、缓存与撤权变化，检查各信任边界的暴露及必要证据遗漏；V-22 固定任务与授权范围，对比全文、自由摘要与按声明性质生成的视图，保留反例、unknown 和冲突，测错误确信、成果接受与披露成本。跨版本映射和 Runtime 替换复用 V-19，不新建重复队列。均未运行；本轮来源核验只覆盖下表，具体安全模型、实现选型和证明仍待执行。
- **讨论与裁决 / 正文处置**：初次裁决为 indexed；9.6 强审后，主要概念仍由既有 Kernel 承载，但发现候选可见性被误写成必须先取得正式效力，以及 Schema 被缩窄为 persistence policy 的表述问题。Canonical §2.3、§5.4–5.5、§6.1 重写既有表示、披露与提交关系；Practice §2.5、§3.1、§4.3 将其编排为实现叙述。数学公式、CS 对应、反例和证明要求保留本条，不增加 Project 阶段、epistemic sandbox 或 Work ABI 等对象，不据此采纳技术栈。
- **状态**：practice-adopted；Canonical 为既有原则的一致性修订，不新增 Kernel 命题。

**9.6 原始来源核验（2026-09-07）**：

| 来源 | 本轮核验到的内容 | 不据此推导 |
|---|---|---|
| PostgreSQL 18 Row Security Policies 与 CREATE VIEW [^pg-authorized-views] | 行级策略可分别限制读取与修改；view 的安全语义取决于执行身份与 security 配置，部分访问路径有例外 | 普通 view、查询优化或简单字段投影自动防泄漏；任何数据库配置直接满足 SE 的组织 Authority |
| LLVM Language Reference，Introduction / Well-Formedness [^llvm-ir] | 同一 IR 有多种表示；可解析与满足内部结构约束有区别 | Work Schema 具有 LLVM 的精确执行语义，或宿主替换无需证明兼容 |
| Cousot & Cousot 1977，作者保存的论文摘要及书目信息 [^abstract-interpretation] | 抽象解释通过有序结构、转换和不动点讨论程序性质及抽象间一致性 | 普通摘要具备可靠近似；本轮已复核完整论文证明或为 SE 建立 Galois connection |
| Sabelfeld & Myers 2003，§I、§V.D [^information-flow] | 读取控制不直接约束读取后的传播；允许的信息释放需由相应策略定义 | 标签检查能完全追踪 LLM 的语义依赖，或当前 SE 已证明 noninterference |

**保留于 Index 的实现与审查条件**：

- PI-20 的 Runtime 兼容测试继续覆盖控制时点、能力缺失、取消后完成和未知副作用；恢复 Matter State 不等于迁移内部推理快照，API 不天然提供幂等或回滚，薄 Runtime 不自动满足主权部署的数据边界。将这些条件从 Practice §3.1 的逐项警戒句和 §7.3 的两项新增测试收回本条与 V-19 / V-20；正文保留能力协商、效果核对与必要授权的机制。
- 候选可保存、检索和进入 Review，但身份不得被摘要或重复召回升级为正式状态；对照“候选进入 Context”与“候选取得 Authority”分别断言。视图的一致性按相同对象、版本和效力检查，不要求不同时间的快照逐字相同。
- 检查对象存在性、关联、派生值、工具参数、日志、缓存和接收端；撤权阻止后续复用，不能收回已披露信息。允许的脱敏或释放需要具备 Authority 的规则或决定，不能由模型自行降低限制。
- 视图内容不足时应标明缺口或请求授权补充；对未能识别的遗漏另用 V-22 外部参照评测，不把“按 Schema 编译”当作充分性证明。保留先验知识、推断与隐蔽通道等模型边界，不声称限制了模型全部可知信息。
- 保留 unknown、限定、冲突和来源的目标属于任务性质保持；如果要上升为形式可靠性，必须另行定义状态域、转换、抽象关系与威胁模型。没有该证明仍可实现并测量视图治理，不借数学术语取得保证。


---

### PI-22 · Personal Attention 与既有连续性原语

- **日期 / 来源类别**：2026-09-09；用户提供的设计讨论。完整读取13个turn与1张截图，属于设计输入；外部项目机制与Courtwork实际接缝由Courtwork研究索引登记，不在论文重复选型。
- **来源**：[解释 GoRaven](chatgpt-conversation://6aa122d3-ac50-83ec-bbb3-a7959c28d9d3)。后续用户明确Attention可拥有独立于单个Matter和Session的生命周期；“全量memory”指可寻址、按需要披露。完整私有原文留在个人项目，外部技术来源及本轮消费见[Courtwork固定来源索引](https://github.com/lesPrivilege/Courtwork/blob/b260feb213bf60c39165d2070fcfe7c4940bb590/engineering/research/attention-2026-09-09/source-index.md)与[局部核验](https://github.com/lesPrivilege/Courtwork/blob/b260feb213bf60c39165d2070fcfe7c4940bb590/engineering/research/attention-2026-09-09/verification.md)。固定提交已在本地形成，未推送前远端链接可能暂不可用。
- **观察与最小支持命题**：这是对个人持续关注对象的设计要求，而非运行结果。可检验一个关注关系在关联零个、一个或多个Matter时，能否保留identity、owner、未完义务与生命周期；人的视图与执行Session是否仍可替换且不成为第二事实源。
- **Astra裁决 / 正文处置**：本轮不修订Canonical或Practice。Canonical摘要已明确 `anything governed is addressable`、持久状态与Context分离；PI-21已容纳存在性、关联、缓存与撤权的披露边界；PI-20 / V-19已容纳Runtime能力协商。typed lookup与grep作为实现选择进入Courtwork局部选型，不升为新的普遍检索定律。独立Attention的产品对象语义不自动要求新增Kernel ontology；先比较既有对象关系是否足够，再决定是否需要最小正文修订。若未来需修正文，由Astra在SE源目录亲自撰写。
- **不支持的外推**：不证明Attention必须成为新的Kernel实体、任何Runtime可无损互换、grep提供访问控制，或文件化手动loop已经证明自动ACL、效率及专业质量；来信中的产品主张不证明成熟度。个人通信原文、Courtwork工单和选型台账不复制到论文。
- **复现 / 证伪**：V-23比较独立Attention记录与既有Topic/Queue/Matter关系及State/Event原语，覆盖零/单/多Matter、Session替换、关闭/重开及未完义务。若既有对象可保持同等边界，则否决新增ontology。存在性与内容披露复用V-21，Runtime缺失能力与替换复用V-19；本轮均未运行这些对照实验。
- **状态**：indexed；设计线索已登记，正文不改，无新Edition或发布。

---

### PI-23 · DSH model–harness 协同与持续工作 loop（候选观察）

- **原始讨论入口**：[DSH协同训练分析](chatgpt-conversation://6aa26525-7848-83ec-90b3-34b4da6ef670)；访问需要原讨论权限。导出 JSON SHA-256：`c2d975314cc1f3c2ce4b0af79927d07e6fb3d73aa5591c63705481bef995e58f`；原文不复制到论文仓。
- **日期 / 来源类别**：2026-09-10；用户提供的产品讨论导出与社交媒体截图。来源身份是完整的《DSH协同训练分析》导出（7 turns、13 messages，最新用户轮无 assistant reply）及一张 X.com 截图；本条仅消费 T01–T03 技术讨论，不复制后续职业交流材料。截图可见发帖人 Tianyi Cui（`@tianyi`）、`13:27 · 10/09/2026`，帖子 URL 未随附件提供；评论者与聊天中 Exa 的引用不作为已核验来源。
- **核验级别**：仅核对附件文字、导出完整性和来源身份；属于未核验产品信号 / 设计推论（非运行观察、非独立实证）。截图声称 DSH `v0.1.5` 与 DeepSeek V4.1 Flash 深度结合并在不同配置中专项训练／优化，且 Agent Teams 将以模型训练结合的实验功能开放；这些版本、训练关系和实验语义尚未由本条独立确认。已有 [CourtWork 固定来源索引（`9c8b64e`）](https://github.com/lesPrivilege/Courtwork/blob/9c8b64e85e1b4a906dcd23cd5be621da1ba90638/engineering/research/architecture-maintenance-2026-09-09/source-index.md) 与本 Index 的 [DSH 官方入口][^dsh-home][^dsh-readme][^dsh-architecture] 只可作为后续核验入口，不替代本轮新证据。
- **可观察机制与候选解释**：材料把以下五个方面放在同一 model × harness 叙事中，但后四项主要来自聊天内的二手分析，当前只登记为待核对候选：

  | 观察面 | 材料中的声称或类比 | 本条限度 |
  |---|---|---|
  | model–harness specialization | Standard / PTC / Minimal 等配置与模型专项优化共同演化；工具语法、Context 排列、反馈与 Eval 可能成为能力的一部分 | 不能据截图确认模型确实按这些配置训练，更不能把收益归因给 Harness 或模型单一组件 |
  | state / Context / cache | 稳定状态、运行时 Context、superseding snapshot 与 prefix/KV-cache 可分层；聊天提及 cache 命中与排序的数字 | 未提供可定位的原始代码、版本、请求 trace 或对照；不把 cache 数字、snapshot 语义或收益当作 DSH 事实 |
  | durable coordination | Agent Teams 被描述为持久 identity / roster、mailbox、task DAG、revision/CAS，并区分 durable phase 与 live runtime status | 未确认这些对象、重放、并发和投递语义已在 v0.1.5 或稳定包中实现；不把“多个 Agent”当作治理对象本身 |
  | expert-maintained loop / post-train 类比 | 专家 loop 可由 trace → failure attribution → Eval → policy revision → regression 维护；这与模型 post-training 相似但不等同于权重更新 | 这是概念综合，不是 DSH 运行证据；不新增 Expert、Policy 或训练 ontology |
  | coding ≠ software engineering | 局部 coding 输出与跨时间的架构、版本、回归、发布和维护闭环被区分 | 该材料没有独立软件工程结果；沿用 PI-13 与 Canonical §12.2 的既有边界 |

- **最小支持命题**：本材料最多支持一个可追踪的外部产品／社区信号：DSH 叙事明确把 Harness 配置、模型专项优化和实验性 Agent Teams 放在共同演化语境中，并提出一个可检验的分层候选——稳定的 Work semantics、durable state 与 provenance 应与可专门化的 model / Harness / Context / coordination execution 分离；专家维护的工作 loop 可作为由 trace、Eval、修复和版本化推动的行为改进候选，但不等于模型 post-training。该命题是 Index 级候选，不是独立趋同已证明，也不证明任何收益。
- **不支持的外推**：不支持 DSH `v0.1.5`、V4.1 Flash 的完整发布或训练细节；不支持不同 Harness 配置已经导致质量、效率或 cache 命中改善；不支持 Agent Teams 的 roster、mailbox、CAS、DAG、live-vs-durable separation、replay 或实验包隔离已经实现；不支持任何聊天内数字、代码路径、API、产品 roadmap、组织或市场判断；不支持 Harness specialization 必然保持 Work semantics、专家 loop 等于权重 post-training、trace 可直接变成训练数据、coding agent 已成为 software-engineering agent，或 DSH 与 SE 已形成独立趋同／跨领域效度。亦不据此增加 Career-kit 内容或复制个人职业／私密原文。
- **复现 / 证伪**：先用带版本的官方 release、tag、源码／文档和可定位的原帖核对产品与训练声称；无原帖 URL 或官方训练说明时，将相关项保持未核验。对 model–Harness 候选，固定 Work Contract、模型、任务与预算，比较 generic 与 harness-specialized profile，并做 tool rename、protocol substitution、field-order、Context Projection 和环境迁移，复用 Canonical §11.3、PI-20 / V-19 的 interface-accident 与兼容边界。对 state / Context / cache，比较同一 Matter 的跨 Session 投影，注入 compaction、stale / superseded context、policy 变化和 prefix 重排，分别测 provenance、omission / pollution、cache stability、成本与 accepted work，复用 PI-07、PI-10、PI-21 / V-06、V-09、V-21、V-22。对 durable coordination，注入重复投递、迟到回执、CAS 冲突和并发写入，对照 governed branch / artifact 与 messaging topology，测污染、重复、恢复和接受，复用 PI-19 / V-17、V-18。对 expert loop / post-train，固定 rights、专家工时、计算、模型族和留出集，对照静态 prompt、版本化 loop policy 与权重训练，检查 attribution、held-out Work Eval、accepted outcome、reversal、成本和回归，复用 PI-03、PI-13、PI-14、PI-16 / P15–P16。coding 与 software engineering 的区分沿用 PI-13 的局部 coding benchmark 对长期 Artifact / Evidence、架构和独立 Acceptance 的对照；本条不新建验证队列。
- **讨论与裁决 / 正文处置**：主 Astra 复读候选差异及既有 PI-03、PI-22 / 验证队列后，裁为 `indexed` / Index-only：只保留来源身份、逐项候选、核验级别、最小命题和证伪路径；不把原文“极强命中”“独立趋同”作为裁决，不修改 Canonical、Practice、Edition、CHANGELOG、验证队列或发布生成物。上述既有正文坐标是 Luna 的候选映射，不声称本轮独立逐条验证；没有足够证据支持新增 ontology 或正文修订。后续若提出新命题，由 Astra 另行复读承重正文并裁决。
- **状态**：indexed（候选仅入 Index；不构成产品或实证接受，未发布）。

---

### PI-24 · 机制类比与保护性措辞的登记

- **日期 / 来源类别**：2026-09-13；9.7 修订时从正文移出的类比与保护性措辞。无新增外部来源。
- **Mixture-of-Experts 类比**（原 Canonical §5.6 末段）：MoE 稀疏化模型容量上的计算，Matter Runtime 稀疏化工作知识和 capability 上的 Attention；二者都尝试把总容量与单次成本解耦。差异在于模型 expert 通常是同构参数模块并由 learned router 激活，而 Matter、Work Contract、Evidence、Authority 与 Tool 是异构、状态化、带来源和现实后果的对象；Work Primitive 的 routing 更接近语义编译、least-privilege composition 与 governance gate，不能由 top-k gating 直接替代。类比只说明 scaling principle，不构成实现或正确性的证据；参数模块的 sparse routing 与 Work Primitive activation 不能互相证明。
- **fast path / slow path 类比**（原 Canonical §8.2）：Compiled Expert 与 primitive composition 可以借用双路径的产品类比，但二者不保证产生相同结果，也不是同一决策过程的快慢版本；正文只保留“治理的默认路径 / 受限的探索路径”及其回路。
- **目录学参照**（Canonical §2.3）：“辨章学术、考镜源流”只用于说明来源、版本、关系、沿革与适用范围的保存要求，不作为古典术语的移植；正文保留参照本身，删去解释借用动机的辩护句。
- **正文移出的保护性措辞**：Schema Engineering “不是垂直 Agent 产品的宣言”；Matter-first “不是把所有长期对话改名为 Work”；Matter、Assignment、Work Contract “不需要合并成新的上位名词”；Compiled Expert “不新增一套专业 ontology”；分层 “不是第二套分类”；Agent Extension 与 Work Extension package “不是两套专业 ontology”；E2E “不能因全绿宣称整个领域已被形式化”；Benchmark “不是后来另造的 QA，也不是系统设计的起点”；Post-agentic Refinement “不把任何系统改进都称为 Training”；训练信号分层 “不表示当前 Agent 只有程序性外壳”；Schema Engineering “不是所有 LLM 应用都需要额外 Schema”，“不是把专业判断伪装成可完全编译的程序”；Kernel “不能单独证明市场规模、学习壁垒、横向平台机会或通用智能”；“不存在自动成立的单一 moat”；Boundary Tests “只规定产品边界，不证明具体实现已经满足”；“移除 Index 不影响本文的完整性”；§17 末段关于 P17–P21 “不改写 Runtime ontology、不新增 Kernel ontology” 的复述；Practice “上述命题是当前实现方向，并非已完成的普遍验证”与“产品成立不以训练飞轮成立为前提”（后者保留于 Practice §8.1 非目标）。这些句子的功能是预防误读；其边界已由所在章节的定义、F 表或本 Index 承担。
- **AGI 与 governed meta-improvement**：原 Canonical §12.1 与结语两处声明“不是对 AGI 已经实现的宣称，也不证明任一模型本身具有通用智能”，以及 meta-improvement “不由 judgment data 的规模、模型涌现或系统优化自身评分器自动推出”。9.7 只保留可检验命题（每层 Contract 是否成立、accepted work 是否增加、成本和责任是否改善）与“研究假说、非前提”的证据等级；对模型通用智能本身不作判断的立场以本条记录。
- **managed-resource 与 scoped-context 表面的推断边界**（原 Canonical §15.2）：可观察的产品表面只证明某项机制已被提供，不能反推后端 ontology 或 Govern layer 已成立；从人需要理解的结构与权衡推到系统需要表示和保存的状态，是一项额外命题。该边界由 PI-04、PI-05 与 §15.2 证据类型表承担。
- **正文处置 / 状态**：indexed。正文不再承担上述辩护；F1–F27、§15.2 证据类型表与本条共同保存边界。

---

### PI-25 · 持久工作语义、概率推理成本与检索分工

- **日期 / 来源类别**：2026-09-14；固定对话输入、既有研究索引、标准与官方产品文档、设计推论。
- **输入**：[登记前端测试技术栈](chatgpt-conversation://6aa6e0a8-cd5c-83ec-9ba3-077682e5f1fd)，固定导出 SHA-256 `7973c9bf8ff9d398884a3a0317e13ab654bf5d1d9b2b628ab92cddc683b96ee0`，2 页、12 turn、24 消息，最终 `hasMore=false`。对话后半段作为候选观点消费；content-reference `index3` 手稿正文未返回，未读、未引用。
- **独立实践快照与来源清单**：[Durable work semantics · 2026-09-14](https://github.com/lesPrivilege/Schema-Engineering/blob/a263805f65c326ba044392c792e5adf09ecfb98d/papers/research/2026-09-14-durable-work-semantics.md)。快照分开记录 Mature Systems、DDIA、法律信息、记录管理、PROV、DataHub/OpenMetadata 与 metadata-aware retrieval；每项附核验层级、固定工程来源或原始 URL 与外推限制。研究包是材料索引，不是 CourtWork 实现或验收证据。
- **可观察机制**：若干既有系统和标准已经为对象提供身份、关系、版本或生命周期以及机器可读接口；检索设施分别处理字段条件、词项和语义相似性。来源覆盖各自定义的局部机制，不构成一个跨领域统一系统的实证。
- **最小支持命题**：Agent 可沿既有权威关系消费已经积累的持久语义；Schema、正式状态、检索索引与一次执行的 Context 承担不同职责。新增内容由现有 Work Contract、Evidence、Authority、State 与 Context Projection 承载。
- **机制推论**：保存并更新高复用的有效关系，可减少后续重复识别、推理与核对；净收益必须扣除捕获、核验、纠错、迁移和维护成本。“状态复利”描述积累与复用，不是已测成本曲线、训练收益或必然为正的投资回报。
- **不支持的外推**：企业系统已治理全部工作；metadata 本身正确；PROV 关系等于专业证据支持；向量相似度决定权限、效力或完整性；任意 Runtime 可无条件替换；SE 已取得效率或跨域效果验证。ELI 等法律标准不提供具体法律判断，ISO 公开目录不等于已读标准全文。
- **检验 / 证伪方案**：在固定任务、模型、资源权限与成果判据下，比较 raw history、混合检索、带有效状态的检索与 Context Projection；记录遗漏、旧状态重引入、接受与 reversal、恢复成本、推理成本及专家维护时间。引入状态更新、撤销、权限变化和语义等价的 Runtime 替换，观察积累是否仍可复用。沿用 F12、F21–F24，不开新 benchmark；本轮未执行这些实验。
- **讨论与裁决**：采用历史桥梁与成本机制；拒绝“结构取代推理”或“更多 metadata 自动改善效果”。可替换 Runtime 沿用声明能力与语义兼容的既有条件。Schema 继续是 judgment boundary，混合裁决保持 P6；不新增 ontology、Contract 类型或原则编号。
- **正文处置**：Canonical §2、§2.4、§12.1 与结语；Practice 摘要、§2.5、§4.3 与结语。测试、证据等级和开放问题移入本 Index 第七节；F1–F27 作为 Kernel 的可证伪边界仍保留正文。来源适用范围移入快照与本条，工作本身的作用域、授权条件和语义边界仍属于正文定义。

## 四、验证队列

| ID | 待验证命题 | 最小对照 | 主要结果 | 当前状态 |
|---|---|---|---|---|
| V-01 | 宿主适配可以隔离 Runtime 与 Work semantics | 固定 Work Contract，替换等价宿主接口 | 语义一致性、适配成本、E2E | 未完成 |
| V-02 | External Completion 改善长程任务 | 有无独立 completion inventory / gate | completion、accepted outcome、负面结果 | 供应方观察，待独立复现 |
| V-03 | Governed feedback 可以跨 Run 复利 | 仅保存 comment vs 经 scope / Authority / version 编订 | 接受率、reversal、错误放大 | 未完成 |
| V-04 | Govern layer 相比 files + search 有增量 | 固定模型、任务和材料 | 状态一致、critical omission、token、Review | 未完成 |
| V-05 | Sparse activation 解耦总存量与单次 Attention | 稠密激活 vs preset / Expert / primitive | Context / Tool surface、omission、pollution、permission | 未完成 |
| V-06 | Context Mutation 可管理且可恢复 | 各类 mutation vs 未修改 Context | accepted outcome、source preservation、recovery | 研究方向性证据，待工作场景验证 |
| V-07 | Multi-agent review 不会把相关错误误当独立证据 | 注入共享前提、来源缺失和 Evaluator 偏差 | false consensus、escalation、Authority routing | 未完成 |
| V-08 | Document surface 改善 Review 而不污染正式状态 | 文档表面 vs 非结构输出 | Review time、修正率、promotion errors | 社区观察，待消融 |
| V-09 | Current Semantic State 可作为长程工作的默认 execution substrate | State-only vs State + on-demand History vs State + append-only Transcript | accepted outcome、token、latency、recovery、omission、source disclosure | procedural benchmark 局部实证，待专业工作复现 |
| V-10 | Human Review packet 在有限 attention 下仍支持独立判断 | raw trace / per-action approval vs structured decision unit | error detection、evidence-seeking、time、override、reversal、canary | position paper 支持问题定义，待产品实验 |
| V-11 | Artifact / Evidence dual state 改善跨轮 work continuity | 仅 Artifact vs Artifact + governed Evidence | regression、repeat work、unsupported completion、recovery | software benchmark 局部实证，待跨域验证 |
| V-12 | Governed Evaluator lifecycle 防止 rubric 与 attribution drift | static rubric vs versioned monitoring / review / rollback | wrong-reason contamination、drift detection、rollback、outcome | 单一生产案例，跨域与因果待验证 |
| V-13 | Repository-governed handoff 支持自主续行 | repository state vs chat summary vs no governance files | duplication、source mismatch、revision scope、validation、Review | 单次自观察，待独立对照 |
| V-14 | 按工作义务和状态边界记录信号改善失败定位 | 自由摘要 vs 原子笔记 vs Contract 证据记录；固定来源后另做端到端对照 | 独立参照下的遗漏、归因准确度、相关性、支持、Review 成本、接受与 reversal | 方法已定义，实验未运行 |
| V-15 | 离线 signal 的改善预测真实工作改善 | 调优集 vs 按来源 / Matter 隔离的留出集及后续成果 | 指标稳定性、排序偏差、风险分层、成果接受、成本、指标与结果背离 | 方法已定义，实验未运行 |
| V-16 | 可替换 Agent loop 不改变 Work semantics | 固定 Contract / Matter，替换语义等价 Runtime core | state transition、permission、recovery、accepted outcome、adapter cost | 访谈自报支持可行性，待独立复现 |
| V-17 | Failure containment 比持续步数更能解释长程可靠性 | 分阶段注入相同错误；有无 commit isolation / trusted checkpoint | detection latency、propagation depth、state contamination、rollback loss、recovery | 从业者观察与架构推论，实验未运行 |
| V-18 | Governed state 协作优于高频 Agent chatter 的条件 | bounded branches / artifacts vs messaging topology | conflict、duplicate work、Context cost、error propagation、accepted outcome | 从业者观察，适用边界待验证 |
| V-19 | Runtime 能力协商保留 Work Contract | 原生 / 经验证替代 / 缺失能力；固定任务、权限和接受标准 | 非法提交、信息丢失、可恢复性、显式拒绝与总成本 | 设计推论，待验证 |
| V-20 | 操作通道切换不突破效果边界 | API / Browser / Computer Use；注入超时、迟到结果、重复回执 | 重复副作用、授权绕过、结果核对与错误成功报告 | 设计推论，待验证 |
| V-21 | 授权视图约束端到端披露 | 源端授权视图 vs 检索后过滤；跨 Matter、关联推断、缓存与撤权注入 | 边界暴露、外传、陈旧权限、必要证据遗漏 | 已核局部原始来源，实验未运行 |
| V-22 | 任务抽象保留所声明的必要性质 | 全文 vs 自由摘要 vs 按声明性质生成的视图；固定授权范围 | unknown / 冲突保留、错误确信、接受率与披露成本 | 设计候选，不声称形式可靠性 |
| V-23 | 个人Attention是否需要独立对象语义 | 独立记录 vs 既有Topic/Queue/Matter关系与State/Event；零/单/多Matter及Session替换 | identity、owner、未完义务、生命周期、恢复与重复事实源 | 设计候选，实验未运行 |

### V-14 / V-15 · 离线评测快照与查考方法

以下是待执行的评测设计，不是本次实验结果。它使用已有的 Contract、Evidence、Artifact 与 Review 对象，不增设运行时 ontology。

| 环节 | 应保存的快照或记录 | 解释边界与校验 |
|---|---|---|
| 定义比较 | 任务与义务版本、来源快照、初始状态、模型、Harness、Context policy、预算、工具环境和评测器版本 | 模型比较与完整系统比较分开命名；环境不能冻结时记录变化，不声称严格可回放 |
| 构造信号 | 测量对象、单位、分母、去重与相关性规则、原文坐标、grader 判据 | 数量、支持、覆盖与可读性分开报告；重复或无关事实不能靠累积数量获得工作价值；不将局部信号相乘为未经定义的总分 |
| 留出与校准 | 调优样本、独立留出 Matter / 来源、边界样本、人工分歧与评分器输出 | 同源改写不算独立留出；盲化模型标签、交换输出顺序、重复评分；共享模型家族的结果不当作独立验证 |
| 定位遗漏 | 来源 → 抽取 → 持久状态 → Projection → Artifact 的对象对应与版本 | 留存率只针对明示且独立核对的应保留集合；没有抽取到的内容不能从分母消失；允许合理归并、舍弃与未解冲突；无法对应时标为不可测 |
| 归因与重测 | 原配置、候选修改、配对任务、重复 trial、失败样本、成本与延迟 | 固定来源检查表示，再恢复端到端检索；共同变更只能支持组合效果；区分改进 signal 与改善成果；样本量与不确定性不足时不下稳定排序结论 |
| 接受与后续 | 未参与调优的 Reviewer 判断、声明观察窗口、下游采用、返工、reversal 和风险分层 | 当前 Contract 未覆盖但影响工作的问题必须能进入评测；保留全部尝试与退出，避免只统计成功件；离线结果与真实结果背离时重开指标或判据 |

评测快照可以作为版本发布的 Evidence，但评分器没有部署 Authority。已用于反复调优的留出集应降为开发或回归资料；后续候选使用新的留出材料。这里的校验是研究队列，不能写作已经验证的 SE 性能。

---

## 五、增量修订记录

### 2026-09-15 · 9.8发布接续与实践入口

- **来源 / 可观察事实**：SE `ec8d57ea9d2e69e84ebdc187472c5c50795804f7` 的[Pages工作流](https://github.com/lesPrivilege/Schema-Engineering/actions/runs/34778033066)已成功，中文线上为9.8；原9.8条目的“本地候选”是编订时点，现以本条接续。英文仍绑定9.6，固定历史译文可读，当前译文入口不生成。
- **固定工程来源**：CourtWork [产品方向](https://github.com/lesPrivilege/Courtwork/blob/fe7f317b9e14d3ceb1692e1e565b6b8ac71baffe/engineering/product-direction.md)和[发布/开工回执](https://github.com/lesPrivilege/Courtwork/blob/caf3edbceb8cf9b535a28c547088874852752a1e/engineering/release/product-node-2026-09-15/deployment.md)。本轮产品裁决将工作现场、来源版本、决定与接续路径放在执行组合之前；属于产品方向与文档交付，没有新增机制实验。
- **最小支持与正文处置**：既有Canonical §5的历史/状态/Context区分、§6的授权与提交边界及结语已容纳此方向。仅同步发布状态与实践入口，Canonical和Practice不改，不提高论文版本，不增加新观察ID或复制产品工单。
- **不支持的外推 / 后续检验**：产品宣言和Pages部署不证明恢复、成本或成果接受有所改善；若后续固定任务的中断/来源更新/执行替换产生可复现的新增观察，再按原条目及检验矩阵裁决。CourtWork采用仍由其PAPER.md固定为9.6，SE公开版本更新不自动改变工程采用。
- **呈现与保全**：README以独立产品定义连接CourtWork，阅读页仅在既有页脚增加CourtWork链接。2026-09-15阅读文件保存本次Index与入口，旧日期HTML、样式、交互、图与译文原字节保留。检查和发布回执留论文仓内部记录；正文不添加修订旁白。

### 2026-09-14 · 9.8

- **裁决与撰写**：Luna 有界 Explore 并编制独立实践快照；Astra 负责主叙事、正文合成和最终裁决。未开展人工审稿、产品施工或新实证。
- **实质变化**：PI-25 解释可复用持久语义的既有积累、重复概率推理的成本与状态维护的经济边界；Practice 明确沿用 canonical owner、Schema 与混合检索各司其职。
- **体例变化**：移出 Canonical 原 §14、§15.1–15.2、§16、§11.5，以及 Practice 原 §2.9、§4.4、§七、非目标与成立条件；保存于本 Index 第七节。移走元说明与证据等级不把假说晋升为已发生事实。Canonical 后段现为 §14 可证伪边界、§15 原则索引；Practice 后段现为 §七失败模式、§八结论。旧版章节由历史 HTML 保留。
- **不变量核对**：21 条显式原则定义及 F1–F27 相对 `fc820559` 逐字一致；正文无外部来源 URL。正文保留工作条件、成本边界与专业裁决责任，删去发表过程旁白。
- **发布准备**：三份源的 Edition/base 为 2026-09-14，Revision 9.8；中文生成新日期产物，历史产物不覆盖。英文仍绑定 9.6，门禁 withheld。发布测试修复历史字节夹具及缺少英文链接时的键盘路径假设，未放宽生产门禁。
- **发布状态**：本地候选；未 merge/push/Pages 部署，未修改 CourtWork `PAPER.md`。实际构建与浏览器核验回执见本轮发布准备记录；工作流通过后才能登记为发布完成。

### 2026-09-13 · 9.7

本版为发表修订：不新增命题、ontology、Contract 类型或原则编号，只处理正文的旁白、保护性措辞、重复定义与同名对象。Sonnet 5 三路只读探查（正文清单、术语与外部快照、CourtWork 文档）供裁决，Fable 5.1 裁决并撰写全部正文与本条；未做人工审稿。

| 审查对象 | 裁决 | 正文处置 |
|---|---|---|
| 自指与旁白（“本文承接”“本文称其为”“本部把…分开处理”“下文采用”“这里需要区分”“例如”“真正稳定的顺序”） | 删去作者与文本作主语的句子；定义、关系与来源承接改为对象直述 | Canonical 摘要、§2、§4、§5、§8.1、§8.5、§12 |
| 保护性措辞（“不是…宣言”“不新增 ontology”“不是第二套分类”“不能因全绿宣称…”“不证明具体实现已经满足”等） | 一律移出正文；边界由所在章节定义、F 表或 PI-24 承担 | Canonical 摘要、§2.1、§3、§4.2、§6.3、§7、§8、§9、§11.4、§12、§13、§14、§15、§17；Practice §2.3、§2.9、§6.6 |
| 机制类比 | MoE 类比与 fast / slow path 类比移入 PI-24；目录学参照保留参照本身，删去辩护句；法律 Agent 的失败例保留为条件陈述 | Canonical §2.3、§5.6、§8.2、§8.5、§15.2、§17 |
| AGI 与 governed meta-improvement 的免责声明 | 只保留可检验命题与证据等级；免责立场记入 PI-24 | Canonical §12.1、结语 |
| 重复定义 | Accepted work product 定义只留 §8.6，§14.3 保留实质性修改判据与分层报告；§15 引言的证据类型清单并入 §15.2 表；§17 末段删去对 P17–P21 的复述 | Canonical §8.6、§14.3、§15、§17 |
| 同名对象 | Semantic State 为对象名，其当前值统一称 Current Semantic State（§4.8 首句定义，§4.8、§6.6 两处补全）；P4 大小写统一；progressive disclosure 统一为渐进披露；§12.1 标题改为正文定义的 Commitment scope / Continuity scope；Candidate Change 在 §2 定义为 Candidate State Change 与 Candidate Artifact Version 的统称；Review Policy 在 §6.6 定义为 Review Contract 的路由规则；弱编译首次出现附 weak compilation；Eval infrastructure 附 evaluation harness；Practice 的 Matter Sidecar 与 Canonical 的 Overlay / Sidecar 在 Practice §4.1 对应；Practice §七 “理念认证”改为通行的“概念验证”。修后通读另发现：Continuity Profile、Commitment Profile、Commitment / Continuity Kernel 与 §12.1 的 scope 指同一对适用范围，统一为 Commitment scope / Continuity scope；Commitment Boundary 在 §2 与 typed commitment interface 同处定义；Review Policy 在 §4.6 首次出现处标明属 Review Contract；§2.4 与 §12.2 的 P / F 编号前引改为可定位的表述；“这里”“本节”“本文推论”“本文所说的”改为对象直述 | Canonical 摘要、§2、§2.2、§2.3、§2.4、§4、§4.6、§4.8、§5.3、§6.6、§8.7、§11.2、§12.1、§12.2、§15.2、F16、F19、结语；Practice §4.1、§6.1、§七 |
| Evidence Contract 关系词汇 | supports / contradicts / qualifies 不在 PROV-DM 关系集合内，derives-from 对应其派生关系；该区分写入正文，不再只由 PI-18 承担 | Canonical §6.2 |
| Practice §一 | 原“文本责任与快照方法”只叙述修订流程，属仓库协议；改写为承重的“实践约束”，四项约束从摘要移入，摘要保留问题与形态 | Practice 摘要、§一 |
| CourtWork 文档核对 | CourtWork `ada8657`（2026-09-13）的 PAPER.md 固定 9.6 / `d78fd31`；工程文档中与论文相关的七项记录里两项已登记（PI-01、PI-22），其余五项均为“无需修订正文”或收窄为实现缺口的本地裁决，无新的泛化观察；产品侧把 Assignment、Operator、Lane 合并为 actor、把 Review 实现为 Decision、把 Context Compiler 改称 Work Compiler，属产品命名，不改论文用词 | 不修订正文；本条登记 |
| 外部快照复核（2026-09-13） | Anthropic agent evals、Fowler Event Sourcing、W3C PROV-DM、OMG CMMN、DeepSeek Harness reference、OpenAI model guidance、Harness-of-Harness、LLM-as-a-Judge lifecycle 八项来源均可达；PROV-DM 无认识关系词汇（见上）；CMMN 的定义在规范正文 §4–5 而非入口页，脚注调整主次；Harness-of-Harness 原文为 planning–coding–testing，PI-13 改按原文转述；OpenAI 页面仍无 `new_context` 或 history / notes 接口，PI-11 维持不升级 | PI-11 不变；PI-13、[^cmmn] 校正 |
| 英文译文 | 中文源改变后，绑定 9.6 源的英文 cache 按既有规则 withheld；英文入口待重译与复核后开放 | 不改译文；manifest 保持指向 9.6 源 |

**修后通读**：一个未继承本轮聊天的 Sonnet 实例只读通读修订后的 Canonical 与 Practice，报告六处悬空指称、六处残余自指、四处命名不一致、零处断裂与零处依赖 Index 的句子；全部处置见上表“同名对象”行。属于模型通读，不是人工审稿或同行评审。

**本地候选检查**：三份源文件 Edition / base 同步为 2026-09-13；构建与 14 项阅读器检查通过，13 个历史发布文件字节不变，当前入口与带日期 HTML 一致，64 个文内链接均有目标，`git diff --check` 通过。浏览器抽查三视图首屏（Canonical 封面、Practice §一、Index PI-24 与本条），不声称逐屏检查全文。Canonical 与 Practice 正文合计较 9.6 缩短约 5,900 字符。`papers/qa/test_translation_gate.py` 的 exact-binding 用例在 9.6 节点已因 cache 过期失败，与本轮无关。未推送或部署。



Astra复读现有正文与PI-20/PI-21后裁决：只登记PI-22及对象生命周期对照V-23，披露与Runtime验证复用V-21/V-19；不修订Canonical、Practice、Edition、CHANGELOG或发布产物。外部成熟实践的局部核验与产品消费留在Courtwork，不把本轮设计讨论提升为实现证据。

### 2026-09-07 · 9.6

| 审查对象 | 裁决与有机合成 | 正文处置 |
|---|---|---|
| 稳定 Schema / 状态空间 | 保留跨执行可比较的对象、状态、版本与转换语义；不用向量、流形或 ISA 替代工作定义 | Canonical §2.3 首段；Practice §2.5 |
| 按角色披露与工作集编译 | 从授权范围、当前义务到不同接收视图，保留判断依赖的来源、限定和缺口 | 重写 Canonical §5.4、Practice §4.3 |
| 候选可见性与正式效力混同 | Candidate 可被保存、检索并供后续 Review；正式更新单独过提交边界 | Canonical §5.5 |
| 读取、操作与信息传播 | 读取权、工具权和向外传递的权限不能相互代替 | Canonical §6.1；Practice §4.3 |
| Runtime / 通道适配段落累积保护性条件 | 按语义责任、能力协商、执行复杂度和操作通道重新合成 | 压缩 Practice §3.1；详细校验归 PI-21 / V-19–V-22 |

本轮由 Astra 主笔，Luna 只读探索，另由未继承聊天历史的 Astra 实例进行独立文本审查。初审与终稿复审结果见下表。属于模型审稿与原始来源核验，不是安全证明、互操作实测或同行评审接受。没有新增 ontology、Contract 类型或原则编号。

**审稿与修后复审**：Luna（`gpt-5.6-luna`，max）只读定位既有承重章节与重复，建议不新增 Kernel 对象；主笔据此选择重写而非加入术语合集。独立 Astra（`gpt-6-astra`，xhigh）在未继承聊天的情况下完整通读三份原稿，并复核磁盘修订稿；最终未发现阻断本轮修订接受的承重矛盾。主笔保留最终裁决与文字责任。

| 审稿发现 | 最终处置与反例 |
|---|---|
| 候选尚未提交便不能进入下一轮 Context | §5.5 允许有明确身份的候选被保存、检索和审阅；候选可见不等于取得正式效力 |
| “未提交错误仍是局部失败”与共享候选冲突 | 整段改写为传播时保留认识状态、提交限制正式效力及污染后的修复；Committed working assumption 仍非已证实事实 |
| 三视图只从正式状态生成，排除了候选与原始材料 | 同步 Practice §2.9、§5.1 图示与说明、Projection Consistency 测试和 Canonical 开放问题 33；一致性比较相同版本和效力，不要求披露相同 |
| 本地提交与外部执行被写在同一步 | 删除原 Practice §4.3 procedural 图，以授权和前置检查、结果证据与待核对状态表达边界 |
| 宿主历史不透明仅被视为审计限制 | Practice §3.1 的兼容绑定覆盖宿主实际召回的信息及可产生的效果；不能只约束新传入的 Context |
| §11.5 声称相乘公式预设独立、单调且同号 | 删除错误数学断言；`X·X` 即可反驳独立性推论，负因子反驳同号预设。组合模型仍需定义与消融，不在正文扩写代数解释 |
| F21 将接受率的任何变化视为兼容失败 | 收紧为所需能力满足时仍破坏工作语义或无法维持声明的接受条件；质量改善和随机轨迹变化本身不触发证伪 |
| “未审阅 output”可能被读成人工 Review 普遍必需 | Practice §7.3 统一为“未通过适用提交检查的 output”，服从既有混合裁决边界 |

**本地候选检查**：构建与 10 项发布检查通过，67 个文内链接均有目标，当前入口与带日期 HTML 一致，`git diff --check` 通过。浏览器检查三视图切换与入口排版，并抽查重写后的 Practice §4.3；不声称逐屏检查全文。Canonical 与 Practice 正文合计较本轮起点缩短约 1,600 字符。原始来源核验仅覆盖 PI-21 所列范围；V-19–V-22 实验未运行，未推送或部署 Pages。

同日 9.5 HTML 保存为 `papers/dist/schema-engineering-2026-09-07-v9.5.html`；当前带日期文件在本轮更新为 9.6。此前 Index-only 条目随本次构建进入 HTML。未推送或部署。

### 2026-09-07 · Index-only 补记

登记 PI-21 与 V-21 / V-22：保留受约束状态空间、授权视图及 CS 机制映射；拒绝把向量空间、流形、隔离或可靠抽象类比提升为已证命题。Canonical / Practice 与版本元数据不变；按索引更新规则不重新构建发布文件，本条尚未进入已生成的 9.5 HTML。检查条目编号、聊天来源、章节指向与 diff；实验及外部理论来源核验待执行。

### 2026-09-07 · 9.5

| 观察 / 讨论 | 裁决 | Canonical | Practice | Index |
|---|---|---|---|---|
| 可替换 Runtime、薄主权部署、面向 Review 的终端与 API / Computer Use 适配 | 采用能力与效果边界；产品事实和市场推断不提升为证据 | 正文不变，仅同步 Edition / Revision | 重写 §3.1；§7.3 增加两项验证要求；§5.3 已充分 | PI-20；V-19 / V-20，均待实测 |

本轮为架构与文字审阅，不是运行时互操作实验或独立模型审稿。保留已有未提交修订与历史候选产物；本地生成不等于 Pages 发布。

**本地候选检查**：三份源文件 Edition / base 同步为 2026-09-07；构建与 10 项发布检查通过，带日期 HTML 与当前入口一致，`git diff --check` 通过。本轮未做浏览器视觉复核，未推送或部署。

### 2026-09-06 · 9.4

| 观察 / 讨论 | 裁决 | Canonical | Practice | Index |
|---|---|---|---|---|
| TiDB 等从业者访谈把易折旧 Agent loop 与状态、权限、副作用、验证和恢复控制面分层 | 作为既有 SE layering 的工程佐证；不把具体 Harness、数据库类比或自报结果提升为理论权威 | §2.1、8.1 合并重复 Runtime 说明，收紧为 declarative Contract 与 replaceable execution | §2.2、3.1 增加折旧分层与成熟组件复用 | PI-19；V-16 |
| 长程失败来自局部错误越过验证成为持久共享状态 | 吸收为 proposal / commitment 的 failure-containment 解释，不新增状态对象 | §5.5 增加最小段落；§3、4.5 明确 Matter / Session / Run 与 executor replacement | §4.2、7.3、8.2 增加 trusted recovery 测试与失败模式 | PI-19；V-17 |
| Agent 间通信拓扑会增加协调状态；安静协作可以经 bounded artifacts 汇合 | 只采用 state-mediated coordination 的默认倾向，保留任务相关通信与并发冲突边界 | 现有 Operator / Lane / Candidate 关系已充分，不修订 | §2.7、7.3、8.2 增加 branch / artifact 协作和对照 | PI-19；V-18 |
| Human review 与 GUI 应暴露状态、证据、权限、提交与恢复，而不是 Agent 表演 | 作为既有 Human Work Surface 的产品推导；UI 形态不进入 Canonical ontology | 不修订 | §5.3、8.2 明确 transition surface 与 Agent theater 失败 | PI-19 记录来源边界；具体组件不作为证据命题 |

本轮没有新增 Canonical ontology、Contract 类型或原则编号。正文净增量通过合并 Canonical §8.1 的重复 Runtime / composability 说明控制；外部项目、受访者判断和易折旧实现细节只留 Index。

**本地候选检查**：三份源文件 Edition / base 已同步到 2026-09-06；构建与 10 项现有发布检查通过，当前入口与带日期 HTML 内容一致，`git diff --check` 通过；桌面浏览器完成当前 Canonical 入口的渲染检查。未推送、未部署，Pages 工作流尚未执行。

### 2026-09-05 · 9.3

| 观察 / 讨论 | 裁决 | Canonical | Practice | Index |
|---|---|---|---|---|
| Manus 实践分享用局部信号追查笔记行为；官方 Agent eval 方法区分执行设施和评测设施 | 抽取 Runtime 外的评测—归因—修订闭环；不将案例自报提升为因果 | §11.2 澄清遵守判据与判据充分，明确归因坐标的边界 | §6.5 写入理念，原训练候选移 §6.6 | PI-16/17；V-14/15；具体校验只留 Index |
| Fresh Astra 独立通读指出提交语义被写成事件溯源的唯一实现 | 保留 Candidate / Committed 与唯一权威状态；事件重放限定为参考实现 | §2、4、5 明确语义要求与持久化选择 | §4.1 明确既有 SoR 的承载方式 | 记录反例：事务状态表、版本化成果与可审计提交记录可实现同一边界 |
| 独立审稿发现示例把可解析引用直接晋升为 supported | 证据定位与语义支持分别成立 | §6.2、8.8 补清语义检查责任 | 沿用既有 Evidence / Review 边界 | 反例：引用确实存在，但只限定或反驳目标主张 |
| 训练的默认检查顺序被写成普遍必要前后关系 | 不以训练替代判据和接受；允许训练参与首次能力形成或降低成本 | §9、11.4、P15 及对应检查统一范围 | §6.6 保留产品不依赖训练飞轮的独立价值 | 反例：基础模型不满足任务门槛，先训练再做首次 E2E；质量相同但训练显著降低成本 |
| 独立审稿要求交代与既有工作建模、来源与事件溯源方法的关系 | 贡献限定为 Agent 工作生命周期中的组合与边界 | §2 增加最小定位 | 不扩写 | PI-18 登记 primary sources、承接与非等价关系 |

本版以可公开讨论的概念工作论文为目标；文本修订与本地构建不表示完成实证或已经线上发布。独立审稿不继承聊天历史，仍属于模型审稿，不替代作者或专业共同体接受。

**审稿与修后复审**：2026-09-05，使用不继承父任务聊天的 `gpt-6-astra` 实例，以 `xhigh` reasoning 完整通读三份文本，再核对修订 diff 与受影响章节。首轮提出五项必要边界修复，上表均已处置；复审未发现阻断公开概念／立场工作论文发表的承重矛盾。其判断不覆盖全部外部来源的独立复核，不等于实证论文或正式同行评审接受。篇幅收敛、系统实现、跨域结果与训练增益继续作为后续工作，不扩大本轮正文。

**本地候选检查**：三份源文件 Edition / base 已同步到 2026-09-05；构建与 10 项现有发布检查通过，当前入口与带日期 HTML 内容一致，57 个文内链接均有目标，`git diff --check` 通过。浏览器安全策略拒绝本地文件预览，未完成视觉复核；不以结构校验代替视觉校验。未推送、未部署，Pages 工作流尚未执行。

### 2026-09-04 · 9.2

| 观察 / 讨论 | 裁决 | Canonical | Practice | Index |
|---|---|---|---|---|
| Codex 实现讨论显示 fresh Context + on-demand history 的候选方向 | 公开资料不足以确认具体接口；现有 Context / State 边界已经充分 | 不修订 | 不修订 | PI-11 作为产品趋势观察，保留严格不支持项 |
| 人在 loop 中仍可能因 attention overload 失去有效监督 | Review Contract 必须包含认知充分性，不只包含审批拓扑 | §6.6 最小增量；无新 Contract / 原则 | §5、7 增加三投影、Review packet 与测试 | PI-12 保留 position paper、边界与待验证指标 |
| 同一 governed state 同时服务模型、人和未来 Run | Context Projection、Human Work Surface 与 Retrieval Index 是不同 Projection；Current Semantic State 保持唯一事实源 | §5.4 明确三类 Projection 与 split-brain 边界 | §2.5、4.3、5.1、7.3 增加实现与测试 | 作为 PI-10–PI-12 的综合裁决，不虚构独立外部来源 |
| 多日 autonomous software development 同时保存 Artifact 与 Evidence，并隔离角色权限和 Acceptance | software 跨 task boundary 后呈现 work-shaped runtime；软件 substrate 的可验证性限制外推 | §8.5 增加局部边界 | §4.3 增加 dual continuity | PI-13 保留具体实现、实验范围和限制 |
| 生产 Evaluator 的 criterion、reason 与 rubric 会变化并产生下游后果 | Evaluator 是 governed artifact；正确 label 不能掩盖错误 attribution | §11.2 增加 lifecycle 与 commitment boundary | §7.3 增加测试 | PI-14 保留生产案例与外部效度限制 |
| 本轮由 repository state、revision protocol 与渐进披露续行 | 只构成单次方法自观察，不构成因果证据 | 不修订 | 不修订 | PI-15 / V-13 登记对照设计 |
| 正文修订仍可从新增段落和版本摘要辨认材料加入顺序 | 接受后的命题必须重写进最小完整章节；逐项记录与校验只留 Index | 重写 §5.4、6.6、8.5、11.2，删除补丁式解释 | 重写 §2.5、5.3，删除版本摘要 | 修订合成纪律写入 CONTRIBUTING 与 papers/README |
| 同一 SE 对象曾出现无意别名和机械翻译；反过来，固定词形会把自然多义误作治理问题 | 用词按语境自然达意并保持全篇体例；治理同一指代与概念边界，不治理单词本身；SE 抽象优先对接共识，自撰概念保持最少 | 统一没有语义差别的定义、状态转换和 Projection 名称；不要求单词一义，不改变 ontology 或原则 | 统一同一对象的实现与测试表述，保留不同语境所需的自然用词 | 写作凡例并入既有治理文件；本行保存裁决与 repo-wide 校验范围 |

本轮没有新增 Canonical ontology、Contract 类型或原则编号。

### 2026-09-01 · 9.1

| 观察 / 讨论 | 裁决 | Canonical | Practice | Index |
|---|---|---|---|---|
| 主动 Context 编辑可以被表达为 action 并给予局部 credit | 这是 Projection 操作纪律，不是新 Memory ontology | §5.4 增加最小边界；无新原则 | 增加 Context Mutation 实现与 Preservation 测试 | PI-07 保留论文、代码和外推边界 |
| 多个 Agent 可以共享 Harness 或隔离 Context | 这描述 execution topology，不定义 Expert 或 Authority | §4.3–4.4 已充分，不修订 | §2.7 明确 topology / Expert；增加 correlated failure 测试 | PI-08 保留个人实践与限制 |
| 文档驱动工作可以同时服务执行、审阅、恢复和交付 | 吸收“文档是共享工作表面”，保留 Trace / Index / State / Artifact 分离 | 已有对象边界，不新增术语 | §2.8、5.4 与 Documentation Promotion 测试 | PI-09 保留社区来源和自报限制 |
| 旧 Practice 以宿主、产品和个例组织大量论证 | 正文改为泛化、最小、连贯的实践快照；实例与来源移入 Index | 移除当前证据图谱，保留稳定证据纪律 | 整体重写，保留架构、对象、测试与失败边界 | PI-01–PI-09 承接来源、检验与处置 |
| Structured State 在长程 procedural task 中比累积 Transcript 更准确且更省 token | 吸收带 sufficient-state 前提的 state-first execution；History 仍属于 Evidence / Ledger，discard from prompt 不等于 delete from storage | §5 增加一句规范性收敛；无新 ontology 或原则 | §2.5、4.3、7.3 增加操作区分和测试 | PI-10 保留论文、数字、限制与待复现边界 |

本轮没有新增 Canonical ontology、Contract 类型或原则编号。

---

## 六、来源登记

[^dsh-home]: DeepSeek, “DeepSeek Harness developer preview: Everything is a plugin,” https://deepseek.com/harness/en/ （快照日期：2026-08-28）。仅用于可观察的插件化能力面。

[^dsh-readme]: DeepSeek AI, “deepseek-ai/deepseek-harness,” https://github.com/deepseek-ai/deepseek-harness （developer preview）。官方仓库明示 compatibility-breaking changes，因而只支持带版本的宿主适配实验。

[^dsh-architecture]: DeepSeek Harness Documentation, “DeepSeek Harness Architecture,” https://deepseek-harness.github.io/deepseek-harness/en/reference/ 。用于 session events、agent events、capability events、turn flow 与 session log 的公开定义。

[^dsh-question]: DeepSeek Harness Documentation, “User Interaction,” https://deepseek-harness.github.io/deepseek-harness/en/reference/subsystems/user-questions 。用于 provider-neutral question vocabulary 与 presentation intent。

[^dsh-ui]: DeepSeek Harness Documentation, “Cookbook: extension plugin shapes,” https://deepseek-harness.github.io/deepseek-harness/en/reference/cookbook/extension-cookbook 。用于 UI extension surface。

[^cordis]: Cordiverse, “A Programming Paradigm for Spatiotemporal Composability,” https://github.com/cordiverse/paper 。用于 reversible effects、reactive coeffects、effect tracking、resolution、reconciliation 与 hot replacement 的形式化参照；不证明 Work semantics。

[^factory-completion]: Factory Research, Theo Luan, “What it Takes for Coding Agents to Complete Large Software Tasks,” https://factory.ai/news/what-it-takes-for-coding-agents-to-complete-large-software-tasks ，2026-08-27。来自所选 ProgramBench 任务、供应方自建 system / benchmark；仅用于 Completion governance 的局部机制。

[^warp-improver]: Michael Segner, Anthropic / Claude, “How Warp builds self-improving agents on Claude,” https://claude.com/blog/how-warp-builds-self-improving-agents-on-claude ，2026-08-26。仅用于 feedback capture、proposed diff、Human review 与 versioned reuse；不把 Skill 等同于 Work Contract。

[^frontier-project-memory]: Anthropic Help Center, “Use Claude’s chat search and memory to build on previous context,” https://support.anthropic.com/en/articles/11817273-using-claude-s-chat-search-and-memory-to-build-on-previous-context ；“How can I create and manage projects?,” https://support.anthropic.com/en/articles/9519177-how-can-i-create-and-manage-projects ；OpenAI Help Center, “Projects in ChatGPT,” https://help.openai.com/en/articles/10169521-projects-in-chatgpt 。快照日期：2026-08-29。仅用于 project-bounded recall 与 archive retrieval。

[^openai-managed-resources]: OpenAI, “Memory FAQ,” https://help.openai.com/en/articles/8590148-memory-faq ；“ChatGPT Release Notes,” https://help.openai.com/en/articles/6825453-chatgpt-release-notes ；“Dreaming: Better memory for a more helpful ChatGPT,” https://openai.com/index/chatgpt-memory-dreaming/ 。快照日期：2026-08-29。仅用于 managed-resource 与 scoped-context 的产品表面，不反推 backend ontology。

[^andrew-ng-se-fundamentals]: Andrew Ng / DeepLearning.AI, “The AI Engineering Skills Map In Detail — Software Engineering Fundamentals,” https://www.deeplearning.ai/the-batch/the-ai-engineering-skills-map-in-detail-software-engineering-fundamentals ，2026-08-28。仅用于 execution-to-judgment migration 的结构假设，不作为 Schema Engineering 的外部背书。

[^contextpilot-paper]: Zhuoshi Pan et al., “ContextPilot: Teaching Agents for Proactive Context Management via Fine-grained RL,” arXiv:2608.28476, 2026, https://arxiv.org/abs/2608.28476 。仅用于 context-editing action、snapshot 与局部 credit 的机制；不视为 Matter governance 或跨领域专业能力的证明。

[^contextpilot-code]: Tencent, “ContextPilot,” https://github.com/Tencent/ContextPilot 。截至 2026-09-01 公开 inference、evaluation 与 training 实现；公开时间短，尚不足以建立独立复现或外部效度。

[^fryxell-harness]: Scott Fryxell, “The Harness Is the Thing,” 2026, https://scott-fryxell.github.io/blog/the-harness-is-the-thing/ 。个人实践观察；仅用于共享 Harness 与执行位置隔离，不推断一般收益。

[^ondrej-setup]: David Ondrej, “Agentic Engineering Setup (after 2,000+ hours),” 2026 Q3，用户保存的公开帖子快照；原作者主页 https://x.com/DavidOndrej1 。个人经验与趋势判断，无统一 benchmark 或独立复现。

[^document-driven-practice]: Vonng, “如何验收 AI 拉出来的屎山？”，2026，用户保存的公开文章快照；发布说明 https://x.com/RonVonng/status/2094288759743545769 。仅吸收文档作为共享工作表面的观察；成本比例与效果判断作为作者自报。

[^skill-state]: Sanket Badhe, Priyanka Tiwari, and Jonghyun Chung, “SKILL.state: Scalable Long-Horizon Agent Skills,” arXiv:2608.26263v2, 2026, https://arxiv.org/abs/2608.26263 。v1 于 2026-08-26 提交，v2 于 2026-08-28 修订，arXiv 页标注 accepted at EMNLP。作者所属 Google LLC 与 Purdue University。本 Index 仅将其用作 explicit execution state、validated patch、bounded prompt footprint、noise robustness 与 sufficient-statistic limitation 的局部实证，不视为完整 Schema Engineering 的证明。

[^openai-runtime-context]: OpenAI, “Model guidance,” https://developers.openai.com/api/docs/guides/latest-model 。访问日期：2026-09-04。官方材料用于确认 Responses Runtime 中的 persisted reasoning、conversation / state compaction、tool orchestration 与 autonomy guidance；未发现公开 `new_context` 或截图所述 history / notes 接口，因而不据此确认 Codex 产品实现。

[^agents-out-of-loop]: Margaret Mitchell, Avijit Ghosh, and Samir Passi, “AI Agents Push Humans Out of the Loop,” arXiv:2608.23642, 2026, https://arxiv.org/abs/2608.23642 。Position paper；用于 human oversight 的 cognitive requirement、approval fatigue、strategic friction、batch review 与 monitoring 设计约束，不作为特定 Review UI 收益的实证。

[^hoh]: Haoyang Yan et al., “Harness-of-Harness: Multi-Day Autonomous Software Development with Continual Improvement,” arXiv:2609.01481v1, 2026, https://arxiv.org/abs/2609.01481 。用于 Artifact / Evidence dual state、bounded increment、role-specific Authority、progressive disclosure、frozen candidate 与 independent QA 的软件域观察；不把其多 Agent topology 或 benchmark 数字外推为一般专业工作结论。

[^judge-lifecycle]: Emma Yanyang Kong et al., “The Lifecycle of LLM-as-a-Judge for Large-Scale Recommendation Explanations,” arXiv:2608.18300, 2026, https://arxiv.org/abs/2608.18300 。用于 criterion / guideline / rubric 的生产 lifecycle、reason-aligned evaluation、bounded revision、drift monitoring、Human review gate 与 rollback；不把单一 recommendation surface 视为通用 Work Eval 的证明。

[^manus-research-bench]: 葬愛咸鱼，邀请胡迪 Hoodie 补充整理，《Manus团队测模型一点微小的经验》，2026-09-04，https://funeralai.substack.com/p/manus 。访问日期：2026-09-05。用户提供的微信入口为 https://mp.weixin.qq.com/s/2CXssAsQMxdPn_5aLcaijw?scene=1 ，本次无法直接读取；以作者 Substack 全文核验，不声称逐字核对两个版本。证据类别为 practitioner account，不是 Manus 完整评测架构规格或独立实验。

[^agent-evals]: Anthropic, “Demystifying evals for AI agents,” 2026-01-09, https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents 。访问日期：2026-09-05。官方工程实践总结，用于离线评测设施、重复 trial、多类 grader、轨迹与 outcome 分离及回归纪律；不视为 Schema Engineering 的效度证明。

[^event-sourcing]: Martin Fowler, “Event Sourcing,” 2005-12-12, https://martinfowler.com/eaaDev/EventSourcing.html 。访问日期：2026-09-05。作者的架构模式说明；用于事件序列、状态重建与 system-of-record 选择的定位，不证明 SE 组合收益。

[^prov-dm]: W3C, “PROV-DM: The PROV Data Model,” Recommendation, 2013-04-30, https://www.w3.org/TR/prov-dm/ 。访问日期：2026-09-05。用于 provenance 对象和关系的既有基础；来源关系本身不判定专业主张为真。

[^cmmn]: OMG, “Case Management Model and Notation,” Version 1.1, December 2016，规范正文 https://www.omg.org/spec/CMMN/1.1/PDF ，§4–5（case file、case plan、stage、milestone 的定义所在）；规范入口 https://www.omg.org/spec/CMMN/1.1/About-CMMN 只给出范围声明。访问日期：2026-09-05，入口页于 2026-09-13 复核。用于 case 工作建模的定位，不把 SE 等同于 CMMN，也不声称穷尽案件管理相关工作。

[^infoq-thin-loop]: Tina，InfoQ，《人人都能整个“自己的 DeepSeek Harness”，那我们为啥还在给 Claude Code 们充会员？》，2026-09-04，https://www.infoq.cn/article/6Jc130IN2OaXqsPDIzmJ ，访问日期：2026-09-06。访谈报道用于 thin loop / control plane、Runtime replacement、declarative orchestration、state-mediated coordination 与 failure containment 的从业者观察；系统规模、开发周期、无人工编码／PR review 与行业共识均视为报道或受访者自述，不作为独立实验。

[^pg-authorized-views]: PostgreSQL Global Development Group, PostgreSQL 18 Documentation, “Row Security Policies,” https://www.postgresql.org/docs/18/ddl-rowsecurity.html ；“CREATE VIEW,” https://www.postgresql.org/docs/18/sql-createview.html 。访问日期：2026-09-07，访问 current 页面时版本为 18；登记固定主版本入口。用于区分访问与修改策略、执行身份及视图安全配置，不构成 SE 安全验证。

[^llvm-ir]: LLVM Project, “LLVM Language Reference Manual,” Introduction / Well-Formedness, https://llvm.org/docs/LangRef.html 。访问日期：2026-09-07。仅用于中间表示与结构约束的既有机制定位；不证明 Work Contract 的语义保持。

[^abstract-interpretation]: Patrick Cousot and Radhia Cousot, “Abstract interpretation: a unified lattice model for static analysis of programs by construction or approximation of fixpoints,” POPL 1977, pp. 238–252，作者摘要与书目 https://www.di.ens.fr/~cousot/COUSOTpapers/POPL77.shtml 。访问日期：2026-09-07。本轮核验摘要，不声称逐项复核论文证明。

[^information-flow]: Andrei Sabelfeld and Andrew C. Myers, “Language-Based Information-Flow Security,” IEEE Journal on Selected Areas in Communications, 21(1), 2003，§I、§V.D，作者保存的原文 https://www.cs.cornell.edu/andru/papers/jsac/sm-jsac03.pdf 。访问日期：2026-09-07。用于访问控制与传播约束的区别及显式信息释放策略，不把传统程序分析保证直接外推给 LLM。

## 七、正文移入的检验与研究记录 · 2026-09-14

以下保存 9.7 的验收设计、证据解释与开放问题，作为方案与研究议程；条目出现不表示测试已经执行或命题已经获得实证。原章节号用于历史定位。正文保留实质治理边界与 F1–F27 证伪条件。

### 9.7 Canonical §14 · 架构、连续性与产品价值验收

#### 14. Boundary Tests

Boundary Tests 分别检查架构、连续性与治理、产品价值。三组结果不能合并为一个总分；Model、Agentic 与 Work benchmark 也必须保留各自的解释边界。

##### 14.1 Architecture

1. Candidate State Change 只有经过 Schema、Evidence、Authority 与适用的 Review Policy 检查，才能写入 Committed Event。
2. Committed Event Ledger、Current Semantic State 和 Artifact Store 之间只有一条明确的权威关系，不会各自形成相互冲突的状态。
3. Evidence Relation、Authority、Operational Responsibility 与 Accountability 存在于 prose 之外，并且可以分别查询。
4. Assignment completion 不由 Agent 单方面宣布。
5. 并行执行不会模糊 Operator 的运行义务，也不会改变 Accountable Principal 的最终问责。
6. Work Contract 能够派生 validators、Evaluator rubric、Work benchmark 与 Review points；tool success、Run stop 或 Agentic benchmark 全绿不能直接把结果提升为 accepted work product。
7. Work Extension 通过声明式 service / event / permission / UI seam 依赖宿主；更换语义等价的 Harness provider、model adapter 或 UI channel，不会改变 Work Contract 与 accepted-work-product 标准。
8. HITL action 具有领域化 decision type、Authority、evidence context 与正式状态后果，不以一个无语义的通用确认框替代 Review Contract。
9. Capability activation 由 Contract、role、Matter stage 与 deterministic permission gate 约束；模型不能仅凭自述挂载越权 Tool、其他 Matter 数据或绕过 Review 的执行路径。
10. Work Extension 可以在组织、角色、Matter 或 stage 层预编排，也可以在 Run 层动态投影；AOT 与 JIT 组合只要语义等价，就产生相同的 Authority、Commitment 与 accepted-work-product 标准。
11. Compiled Work Expert 具有独立 identity、version、semantic owner、provenance、applicability、dependency compatibility、E2E evidence、freshness trigger、abstention / fallback 与 rollback；模型或 improver 不能直接改写 active version。
12. Preset binding、Expert routing 与 primitive composition 具有明确的升级和降级边界；primitive path 默认 Candidate-only，Compiled Expert 遇到未覆盖事项可以 fail closed 并回到 Human / frontier path。

##### 14.2 Continuity / Governance

1. 用户返回的是 Matter，不是重建一段 Chat。
2. 不阅读完整 transcript 也能理解当前工作状态。
3. Artifact、approved decision、来源关系和未完成义务能跨模型、跨 Session 存在。
4. Human Review 通过 Committed Event 改变正式状态，不只留下评论。
5. 系统能够分别回答：发生过什么、现在是什么、模型下一次应看什么、这次运行产生的什么可以留下。
6. 未提交、被驳回、已撤回或已 superseded 的 Output 不会静默进入 authoritative state 或下一轮优先 Context。
7. Context Projection 可以从 Stable Contract、Current Semantic State 与可检索历史重建，不以反复压缩完整 chronology 作为唯一恢复方式。
8. 当 Matter、Artifact、history 与可用 Work Primitive 总量扩大时，单次 Context、Tool surface 与 Human Work Surface 的规模主要随当前 Assignment working set 变化，不随 Store 总量线性增长；关键约束遗漏率、错误版本重引入率和成果接受率不因稀疏投影而恶化。
9. Compiled Expert 的发布、暂停、重验证、替换和弃用均有 Committed version history；生产 edge case、Reviewer disagreement 与 later reversal 可以回溯到具体 Expert version 和 release decision。

##### 14.3 Product Value

1. 普通专业用户不必学习 Agent engineering 才能完成主要工作。
2. 不以未来训练飞轮承诺代替当前成果接受；使用外部模型或自有训练模型的实现，都按同一工作要求判断产品是否成立。
3. 移除 prototype 作者后，合格用户的成果接受率、恢复成本或专家 Review 时间至少有一项得到可测改善，且其他高风险指标没有恶化。
4. 一个边界明确的 Matter 能够在不替换既有 system of record、不部署完整 Runtime 的条件下，分开 Candidate 与 Committed，并可测地降低 Review、恢复或版本协调成本。
5. 与反复全量注入 Raw History 相比，Current Semantic State + task-specific Context Projection 至少在成本、latency、状态一致性、恢复或 accepted-work-product rate 中改善一项，且审计与开放问题发现不恶化。
6. Model 或 Agentic benchmark 的提升只有在 Work benchmark、accepted work product、completion、grounding、escalation calibration 或真实 downstream adoption 上产生改进时，才能被解释为专业产品能力提升。
7. 结构主要由正常工作行为、Artifact diff 与实际 Review 自动产生；在固定成果质量下，额外 clarification、字段填写与 Contract 维护占用的 Expert 时间低于它节省的 Review、恢复、重复 orchestration 与错误成本。
8. 把 expert 自由 orchestration 编订为 Work Extension 后，其他合格用户能够在不学习 Tool routing、Prompt、Plugin 与 Context mechanics 的情况下复现声明范围内的工作，且 Expert 由逐次驾驶转为低频 Contract / rule governance。
9. 高频任务通过 preset / Compiled Expert 执行时，routing 与 orchestration 成本下降；未覆盖任务进入 frontier path 后能够安全升级并回流为 Candidate Expert，而不会因 fallback 被掩盖或使普通用户承担开放式插件编排。

判定 accepted work product 时，格式和措辞调整可以单独记录；改变结论、风险等级、事实基础或行动建议属于实质性修改。评估期内被推翻的成果需要记录 reversal，结果按风险等级、任务族、机构和 Reviewer 分层报告，不能只给一个总接受率。

测试需要覆盖真实 Matter、任务恢复、模型替换、权限边界、Review 状态转换、Context Projection、Output commitment、三层 benchmark 和 accepted work product。

### 9.7 Canonical §15 导言与 §15.1–15.2 · 证据解释

#### 15. 证据纪律与可证伪边界

Schema Engineering 的产品命题、学习命题与市场命题具有不同证据强度。Matter-first、external Semantic State、Evidence、Authority、Completion、Review、Operational Responsibility、Accountability、Context Projection、Candidate Output commitment 与 Lane parallelism 属于产品结构判断；Work benchmark 的增量解释力、attention economics、Production Learning、schema-derived behavior signal、institution-level generalization、synthetic economics、refinement capability 与横向市场品类仍需实证。抗折旧判断建立在“有限 attention 下由 Context 生成 Output，且工作经验不能可靠持续写回参数”的条件上。

##### 15.1 证据命题与检验单元

Canonical 只保留不随产品版本折旧的命题和证据责任。每项待验证主张至少写成 `claim + scope + observable mechanism + outcome measure + comparison + disconfirming result + evidence class and date`。实例、产品机制、个人实践和来源不进入 Kernel 的定义或推理链；它们只能支持自己直接呈现的局部机制。多个必要条件同时出现，不构成对整体架构的充分证明。

##### 15.2 证据解释纪律

证据强度由来源独立性、方法可审查性、负面结果保留、测量与命题的对应、反事实设计、重复性与外部效度共同决定。不同类型证据不得合并成“已验证”。

下表限定各类证据的最大解释范围：

| 证据类型 | 可以支持 | 不能单独支持 |
|---|---|---|
| 可观察产品机制与官方文档 | 某项 surface、scope 或 mechanism 被提供 | 不可观察的 backend ontology、效果大小或通用因果 |
| 供应方报告与自建 benchmark | 在公开设定下的局部结果 | 跨任务、跨机构或一般专业正确性 |
| 社区与个人实践 | 可检验的现象、候选机制或失败模式 | 因果、收益幅度或外部效度 |
| 独立复现、消融与真实 outcome | 在声明边界内的机制与结果关系 | 超出采样、权限、时间窗口和任务分布的外推 |
| 设计推论 | 待验证的系统命题和反证设计 | 外部背书或已经成立的产品事实 |

机制类比只用于生成问题，不用于证明答案。

### 9.7 Canonical §15 测试设计与 §16 · 研究问题

每项证伪条件都需要配套测试设计。长期连续性比较应包含中断、跨周工作与模型替换；Ontology 比较应覆盖责任结构不同的至少三个领域；Contract 比较应同时测开放问题发现、锚定、错误确信、成果接受率、token、latency 与维护成本；Model / Agentic / Work benchmark 比较应固定模型、Harness 与任务分层，检查对 accepted work product 和 reversal 的增量预测力；学习路线比较应固定 expert-hour、计算、rights 和数据预算，并比较 schema-derived signal、普通文档与 synthetic-only 的增量收益；Harness 测试应在语义等价的接口变化下进行；产品边界应以真实采购、替换、留存和支付行为验证；增量采用测试应固定 Matter 范围，完整计入编码、集成、迁移和持续维护成本，再与 Review、恢复、Context 构造和版本协调收益比较。

#### 16. 待回答的问题

1. 最小 Semantic State 应包含哪些内容，才能改善连续性而不成为第二份过时 transcript？
2. 哪些 Completion obligation 足够稳定，可以编码；哪些只能作为 Reviewer prompt？
3. Runtime 如何表示同等授权 Reviewer 之间的真实分歧？
4. Lane 在什么条件下应被提升为独立 Operator？
5. 哪些 Event 对审计必要，哪些只是应当过期的噪声？
6. Context Projection 如何暴露状态可能过时、冲突或置信不足？
7. 一项重复 correction 从 Matter 提升到 client、institution 或 product scope，需要什么阈值？
8. Accepted-work-product Eval 如何同时抵抗 benchmark saturation 与 institution overfit？
9. Training rights 不存在时，aggregation 与 evaluation 至少需要哪些权利？
10. 法律实现中的哪些对象必须保留为领域专属，不能进入通用 Runtime？
11. 从 Expert Demonstration 抽取稳定义务时，多少个 Matter、多少位 Reviewer 才足以区分 domain invariant 与 individual habit？
12. Extension 的 E2E suite 如何覆盖任务族边界，又不把全绿误当成整个领域的专业正确？
13. Failure attribution 如何表示多因一果、归因不确定性与机构间真实分歧？
14. Work benchmark 应以多大颗粒度从 Work Contract 派生，才能解释真实失败而不固化单一机构或 Reviewer 的偏好？
15. 什么规则决定 Candidate Output 的 persistence、expiry、supersession 与下一轮 attention priority，且不把 Current Semantic State 重新写成一份压缩 transcript？
16. 如何在固定模型、任务与 accepted-work-product 标准下，测量 Context Projection 相对全量历史注入的 token、latency、Review、漂移与恢复收益？
17. Persistent learning 达到什么可靠性、可撤销性和权限隔离标准后，哪些外部状态可以降级，哪些 provenance 与 institutional semantics 仍必须显式存在？
18. Capture → infer → promote 的产品界面如何把规则提升集中为低频裁决，而不让高频 Review 重新退化为数据标注？
19. Work Contract、Evaluator、Committed Revision、Review decision 与 accepted outcome 中，哪些对象真正含有普通专业文档和 SOP 不具备的行为信号；怎样区分跨场景能力、机构偏好与 interface overfit？
20. 在软件工程场景中，哪些高层 Completion、Architecture、Compatibility 与 Release 义务能够形成超越 tests / CI 的最小 Work Contract，而不重复工程师已有的手动 loop？
21. Topic-level memory、Project / workspace 与 Matter 之间的 promotion rule 应如何定义，才能既避免 Session-first 退化，也避免把每条持久记忆或宽泛主题都建成 Matter？
22. Work Extension 与通用 Harness 之间的最小稳定接口应包含哪些 service、event、permission、HITL UI、state migration、rollback 与 compatibility 语义，才能既支持热插拔，又不让 Runtime-specific code 污染 Work Contract？
23. 外部案例中的哪一项最小机制必须被独立复现，才能把 vendor observation 从方向性证据提升为可归因证据；又如何避免把同一技术周期中的共同约束误写为对完整架构的独立收敛？
24. Govern layer 的 owner、版本、Reviewer disagreement、deprecation 与 rollback 如何定义，才能避免它成为少数专家永久维护的第二套业务系统？
25. 在 Store 持续增长时，如何同时测量 Context compiler 的 critical omission、irrelevant disclosure、stale-state reintroduction、token、latency 与 cache stability？
26. Work Primitive Pack 的最小接口应如何划分 schema、tool、verifier、permission、transition 与 Human Work Surface，才能既支持组合又避免领域 ontology 碎片化？
27. Organization、role、Matter、stage 与 Run 各适合承担多长的 activation lifetime；何时应 AOT 预编排，何时应 JIT 重编译？
28. Expert orchestration 从自由 Demo 提升为可分发 Extension，需要多少跨 Matter 与跨 Operator 复现，才能区分稳定工作结构与单个 Expert 的有效捷径？
29. Compiled Expert 的发布门应如何组合 accepted-work-product、Reviewer disagreement、风险分层、观察窗口与 later reversal，才能在慢反馈专业领域判断“足以部署”而不制造虚假确定性？
30. 哪些变化应触发 Expert 的自动重验证、暂停或重新编译；怎样区分 source / regulation / institution drift、model / Harness drift 与真实工作分布变化？
31. 当 Compiled Expert 遇到未覆盖事项时，abstention、Human escalation、bounded primitive composition 与 Candidate Expert revision 如何形成低摩擦闭环，而不把 ordinary user 重新推回开放 orchestration？
32. Review packet 至少需要哪些 Evidence、delta、uncertainty、consequence 与 Authority 信息，才能证明人在有限 attention 下形成了独立判断，而不是只完成形式 approval？
33. Context Projection、Human Work Surface 与 Retrieval Index 基于同一权威状态解释来源与候选时，如何检测 omission、staleness 与 cross-projection inconsistency，又不把三种视图物理锁死为同一表示？
34. Evaluator reason 被下游执行消费时，怎样分别版本化 criterion、verdict、rationale 与 state consequence，并检测“标签正确但归因错误”的闭环污染？

### 9.7 Practice §七 · 概念验证方案（未执行）

### 七、概念验证

#### 7.1 验证目标

> 验证 Work Contract 能否在不修改宿主核心的条件下，被编译为可加载能力、Matter continuity、Context Projection、Human Work Surface、Authority boundary 与 typed commitment protocol。

概念验证需要一个可插拔或可适配的 Runtime、一个 Matter repository、一组 Work Extension、一个 Context Compiler、一个 Human Work Surface renderer 和一条 commit protocol；多租户平台、市场、训练管线和全领域 ontology 都不是前提。

#### 7.2 共享场景

至少使用三类责任结构不同的任务：

- 结构化对象的逐项裁决；
- 主张、来源、支持、反驳与限定的校勘；
- finding、control、evidence、owner 与 remediation 的整改裁决。

再增加一个弱 commitment 的对照场景，检查 Human Work Surface 是否在不依赖完整 Matter governance 时仍能改善 review bandwidth。

#### 7.3 必要测试

##### Architecture

- **No Core Patch**：不修改宿主核心也能加载、撤销和恢复 Extension。
- **Upstream Upgrade**：等价接口替换只修改 adapter，不改变 Work semantics。
- **Plugin Reload**：重载后 Matter 与 active Artifact 不丢失。
- **AOT / JIT Equivalence**：预编译与运行时组合在相同边界下产生等价语义。

##### Continuity and governance

- **Session Replacement**：替换 Session 或模型后从 governed state 恢复。
- **Candidate / Committed Isolation**：未通过适用提交检查的 output 不改变 Current Semantic State。
- **Authority Failure**：越权裁决被拒绝并保留候选记录。
- **Retrieval / Canonical Separation**：检索命中的旧陈述不被自动恢复为当前状态。
- **Documentation Promotion**：Trace、Index、Candidate Decision、Active Contract 和 Accepted Artifact 具有不同写入路径。
- **Context Mutation Preservation**：限定、冲突、否定、来源和恢复路径不因压缩丢失。
- **State Sufficiency / History Disclosure**：对照 State-only、State + on-demand History 与 append-only Transcript，检查未被及时编入的 Observation、动态 Schema 和 trajectory-defined task 是否需要披露历史。
- **Patch Preservation**：State patch 采用 merge semantics 而不是无声全量覆写；旧字段删除、类型改变与非法 patch 必须显式验证、拒绝或回滚。
- **Failure Containment / Trusted Recovery**：向 Observation、Proposition、Candidate 与 validation 阶段分别注入错误，检查它是否在 commit 前被发现或隔离，并能否从最近 trusted checkpoint 由新 executor 恢复。

##### Sparse activation and Expert release

- **Sparse Capacity Scaling**：per-run Context 和 Tool surface 不随总存量线性增长。
- **Omission / Pollution**：必要约束不被遗漏，旧版本、其他 Matter 和越权 capability 不被引入。
- **Least Privilege**：激活能力只获得当前 role 与 stage 所需权限。
- **Three-tier Priority**：Preset 先于 Expert routing，Expert 先于 primitive composition。
- **Compiled Expert E2E**：评测整个 activation profile，而不是单个 tool 或 prompt。
- **Staleness / Revalidation**：依赖或现实变化能触发缩窄、暂停、回滚或弃用。
- **Graceful Escape**：未覆盖事项进入 Candidate-only frontier path，不被快速路径掩盖。

##### Review and evaluation

- **Completion Independence**：完成条件不由 Agent 临时降低。
- **UI Representation Equivalence**：不同 renderer 对同一裁决产生相同状态后果。
- **Review Bandwidth**：在成果质量不降低时，专家 Review 时间或恢复成本下降。
- **Review Sufficiency**：去除完整 execution trace 后，结构化 Review packet 仍使 Reviewer 发现关键错误、请求必要证据并形成可解释的独立判断。
- **Projection Consistency**：基于同一状态与来源快照重建三种视图，检查候选身份、版本与效力一致，且不同披露范围不被误判为事实冲突。
- **Evaluator Lifecycle**：criterion、rubric、reason 与 deployment version 可追踪；错误归因不会因 label 碰巧正确而进入下游 revision 或训练信号。
- **Correlated Review Failure**：注入共享错误前提、共同缺失来源和相同 Evaluator 偏差，检查多实例共识是否被误当独立验证。
- **State-mediated Coordination**：比较 governed branch / artifact 汇合与高频 Agent messaging，在相同任务下检查冲突、重复工作、错误传播、Context 成本和 accepted outcome。
- **Accepted Work Product**：结果由具备 Authority 的 Reviewer 在预定节点接受，可进入下游且无需实质性修改。

---

### 9.7 Practice §八 · 非目标

### 八、非目标与失败模式

#### 8.1 非目标

当前实践不主张：

- 某个宿主是唯一或永久实现；
- 把所有工作完全形式化；
- 把专业判断消除或转移给多个 Agent 投票；
- 把文档、索引、记忆或检索系统等同于 Current Semantic State；
- 让普通用户在全量工具和 primitives 中自行编排；
- 以训练、市场规模或横向平台作为产品价值成立的前提。

### 9.7 Practice §2.9 · 综合检验命题

#### 2.9 当前实践命题

当前快照承担以下可检验命题：

1. Runtime 与 Work semantics 可以通过适配层分离。
2. Completion 外置、feedback 编订、工作域隔离、持久资源和 Context 管理是互补机制，不是完整架构的替代品。
3. Sparse capability activation 与 sparse state projection 需要共同接受 omission、pollution、permission 和 accepted-work-product 检验。
4. Context Mutation、multi-agent topology 和 documentation workflow 都必须回到同一 Candidate / Committed 边界。
5. Context Projection、Human Work Surface 与 Retrieval Index 共享同一权威状态及带来源和效力标记的材料、候选，不各自维护事实源。

---

### 9.7 Practice 结语 · 成立条件

是否成立不由宿主能力、界面完整度、Agent 数量、社区采用或库内 Expert 数量证明。裁决条件是：原作者离场后其他合格用户能否产生可采用成果，替换 Session、模型或宿主后工作能否恢复，候选与正式状态是否始终分离，专家 Review 或恢复成本是否下降，以及新形成的信号是否在 rights、归因和 held-out Work Eval 下具有增量价值。

### 9.7 Canonical §11.5 · 组件归因纪律

#### 11.5 系统组合不能替单个组件证明因果

系统表现由 model、Runtime、environment、context、Contracts 与 Evaluator 共同产生。这些组件存在交互：同一项 Harness 改动可能在不同 base model 上改善结果，也可能方向相反。组合系统在自有 benchmark 上表现更好，只能证明这套组合在相应设置下有效，不能据此把主要贡献分配给某个组件。

因此，组件判断需要独立消融、跨模型复现、接口扰动和 held-out environment。


### 解释范围与远期命题

Kernel 定义架构与治理边界；市场规模、学习壁垒、横向平台机会与通用智能各需独立证据。

9.8 的持久语义经济学是机制推论，净收益未在本轮测量；“状态复利”不指收益必然为正、固定增长率或训练收益。governed meta-improvement、通用能力渗透和连续学习仍是研究方向，本轮无新实验；正文以条件关系和治理要求表达，移走证据等级措辞不提升其事实地位。§12.1 judgment × continuity × consequence 表保留为采用框架，其经济阈值尚待测量。

9.7 §12.1 通用智能的解释性类比：如果把通用智能理解为通用能力持续抵达多种现实工作，而不只是一项模型 benchmark，那么“上游扩展能力边界、下游编订并验证渗透面”的组合，是当前 Context + Output、Agentic Runtime 范式下一条可能的系统实现路径；其可检验的命题是每层 Contract 是否成立、accepted work 是否增加、成本和责任是否改善。

### 9.7 Practice §4.4 · Context Mutation 检验方案

### 4.4 Context Mutation Preservation

在相同任务和资源下，对删除、摘要、压缩和重载分别检查：

- 限定、冲突、否定关系和来源坐标是否保留；
- retention policy 要求保留的 Raw Evidence 是否可恢复；
- superseded 或 rejected state 是否被重新引入；
- mutation 的 scope、lifetime、provenance 和 recovery path 是否可见；
- 更短 Context 是否改善 accepted-work-product，而不只改善 token 或局部得分。

---
