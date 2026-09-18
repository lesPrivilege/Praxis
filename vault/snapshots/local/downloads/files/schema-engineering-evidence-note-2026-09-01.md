---
title: "Schema Engineering · Evidence Note: Context Action, Runtime Topology and Governed Documentation"
date: 2026-09-01
status: Dated Evidence Note
canonical_base: 2026-08-29 Definitive Canonical Edition
practice_base: 2026-08-29 Definitive Snapshot
---

# Schema Engineering · Evidence Note

## Context Action、Runtime Topology 与 Governed Documentation

### 编订姿态

本附注不重开 Schema Engineering 的 Canonical Kernel，也不把具体产品、论文或个人工作流提升为新的本体。它只吸收近期实践中已经反复出现、并且能够从既有原则推出的三个机制性澄清：

1. Context 的增删、压缩、摘要与重载是会改变后续行为的运行期动作，应接受与其他状态变化相称的治理；
2. Multi-agent 描述执行拓扑，Compiled Expert 描述受治理的能力语义，两者不能互相替代；
3. 文档可以同时服务执行、审阅、恢复与交付，但原始轨迹、索引、当前状态和正式成果必须保持分离。

近期研究与社区实践只作为这些判断的局部证据和反例来源，列于文末附注；正文保持可脱离具体实现成立的表述。

---

## 一、Context mutation 是动作，不是无损的后台整理

模型每次执行所见的 Context 不是历史本身，而是由 Stable Contract、Current Semantic State、选定资源、可检索历史以及当前权限共同编译出的工作投影。由此至少需要区分四层：

```text
Raw Evidence / History
→ Governed Repository and Canonical State
→ Context Projection
→ Run-local Working Context
```

删除、截断、摘要、压缩、折叠、写入临时记忆或重新载入材料，都会改变模型下一步能够注意、比较和引用的对象。因此，这些操作不是中性的 token 优化，而是 **Context Mutation**：它们可能降低成本，也可能删除限定条件、改变证据方向、掩盖冲突或重新引入已经失效的状态。

Context Mutation 的默认效力应当局限于当前 Run 的 working set。它不能仅以改善当前 Context 为由删除仍在 retention policy 内的 Raw Evidence，不能凭一次模型判断改写 canonical state，也不能让摘要因被反复使用而取得事实地位。一个可治理的 Context Mutation 至少应记录：

```text
source span / object
+ previous projection state
+ proposed mutation and reason
+ scope and lifetime
+ resulting projection state
+ reversibility / recovery path
+ downstream outcome
```

当这些动作形成可回放 snapshot，并能与下游结果建立局部对应时，它们可以成为 Eval、Environment 或 post-training 的候选信号。近期研究已经表明，context-editing action 可以获得比整条 trajectory reward 更细的 credit，并在特定长上下文任务中改善工具使用与工作集压缩。[^contextpilot-paper][^contextpilot-code] 但 action-level credit 只回答“这个动作是否提高了既定任务得分”，不回答被保留的内容是否具有正式效力，也不建立 Matter、Authority、Review 或 Commitment。

因此，Schema Engineering 对主动 Context 管理的增量不是增加一个新的 Memory 概念，而是把它放回既有边界：

> **Context 可以由模型主动提议修改；Repository、canonical state 与正式成果仍由 Contract、Evidence、Authority 和 Review 决定。**

---

## 二、Multi-agent 是执行拓扑，Expert 是能力语义

Agent instance 是某次运行中的执行身份。它可以拥有独立的模型、Session、工作目录、Context、预算、权限和工具入口。Multi-agent 只说明存在多个这样的执行实例，以及它们之间具有委派、并行、竞争、审阅或汇总关系。

Compiled Expert 则是另一类对象：它是面向某一任务族和适用范围，经版本化、验证和权限收敛后可以复用的能力配置。两者的关系应写成：

```text
Run Plan
= Compiled Expert Profile
+ Current Matter State
+ role and stage
+ current Authority / permission
+ Context Projection
```

多个 Agent instance 可以绑定同一个 Expert Profile，例如分别探索相互独立的候选；一个流程中的不同 Agent 也可以绑定不同 Expert Profile，例如一个准备证据、一个执行专业审阅、另一个只检查交付完整性。多个模型、终端、Session 或 worktree 本身不会产生多个 Expert；不同 extensions、tools 或 permissions 也只有在差异满足以下条件时，才构成不同的 Expert Profile：

- 差异是有意声明的，而不是临时环境事故；
- 具有明确任务范围、适用条件和失效条件；
- capability 与 permission 经过最小化和版本治理；
- 存在独立 Eval、fallback、rollback 与 release evidence；
- 差异会实质改变能够观察、提议、验证或提交的工作，而不只是改变界面。

实践中，多个交互界面可以共享同一套 Harness、skills 与工作约束，也可以按 planner、worker、critic 等位置隔离 Context。[^fryxell-harness] 大量并发 Agent 还会产生优先级、状态跟踪、隔离环境和资源调度需求。[^ondrej-setup] 这些观察支持“执行拓扑可以与能力配置分离”，但不证明角色名称本身就是 Expert，也不证明更多 Agent 会自动提高工作质量。

尤其需要避免把 Agent 间共识当作 Authority。两个实例可能共享同一模型分布、错误前提、Context 污染或 Evaluator，因此它们的意见并不独立。对抗审阅可以增加候选和反例，正式采用仍须经过与事项风险相称的 Evidence、Reviewer independence 和 Accountable Decision。

---

## 三、文档是工作表面，不是自动成立的记忆

文档之所以在 Agent 工作中重新成为一等对象，不是因为 Markdown 对模型更友好，而是因为长期工作需要一种人与模型都能读取、修订、比较和交付的共享表面。设计说明、需求、决策记录、测试方案、使用手册和版本说明可以分别承担：

```text
execution specification
+ source and rationale
+ Review surface
+ recovery index
+ accepted artifact
```

这支持一种从工作开始就维护文档、并用同一来源生成 Human Surface 与 machine-readable projection 的实践。[^document-driven-practice] 但“文档化”不能抹平文档内部的制度差异：

| 对象 | 默认地位 | 可否直接改变正式状态 |
|---|---|---|
| 原始 Session / Tool Trace | Raw History / Evidence | 否 |
| 自动摘要或索引 | Retrieval aid / Candidate Projection | 否 |
| PRD、Contract、Decision Record | 取决于版本和 Authority | 仅在获准后 |
| 测试与审阅报告 | Evidence / Review Record | 不单独决定 |
| 已接受并发布的文档成果 | Active Artifact | 经 commitment 后可以 |

完整保留原始记录有助于回溯，定期生成索引有助于检索；二者都不能取代当前 semantic state。被否决的方案即使在 Session 中出现次数更多，也不能因摘要或相似度检索再次成为默认事实。恢复工作应当重建当前状态、开放义务和最小充分 Context，而不是重新播放或压缩全部历史。

公开文档站同样只是 distribution surface。它可以让定义、反例、证据等级和修订历史接受社区检查，却不会因可访问、可搜索或被转发而取得外部背书。其可信度应来自可引用命题、明确反证条件、版本差异和对负面证据的保留，而不是页面形式。

---

## 四、对实现与验证的最小增量

本附注不增加新的 Kernel object。下一份 Practice Snapshot 或 Reference Implementation 只需在既有测试中加入以下子项：

### 1. Context Mutation Preservation

在相同任务和资源下，对删除、摘要、压缩与重载分别检查：

- 关键限定、冲突、否定关系和来源坐标是否保留；
- retention policy 要求保留的 Raw Evidence 是否仍可恢复；
- 已 supersede 或 rejected 的状态是否被重新引入；
- mutation 的 scope、lifetime 和 provenance 是否可见；
- 较短 Context 是否同时改善 accepted-work-product，而不只改善 token 或局部 benchmark。

### 2. Runtime Profile Separation

对同一 Agent 更换等价模型、Session、TUI 或 worktree，确认 Expert semantics 不发生无声明变化；对不同 Expert Profile 则确认 tool、permission、validator、Authority 和 fallback 的差异能够被检测、版本化和复现。

### 3. Correlated Review Failure

为 planner、worker、critic 或多个 reviewer 注入共享错误前提、共同缺失来源与相同 Evaluator 偏差，检查系统是否会把表面共识误报为独立验证，并确认高风险提交仍能路由到具备 Authority 的人或外部证据。

### 4. Documentation Promotion Boundary

确认 Raw Trace、自动索引、Candidate Decision、Active Contract 和 Accepted Artifact 具有不同的写入与晋升路径；删除 Session 或更换模型后，系统应从 governed state 恢复，而不是从最近摘要猜测。

---

## 五、证据边界与定本关系

| 观察 | 本附注吸收的局部结论 | 不据此主张 |
|---|---|---|
| 主动 Context 管理研究 | Context editing 可作为 stateful action、snapshot 与训练信号 | 已建立 governed Matter memory 或通用专业能力 |
| 个人 Harness 实践 | 多种模型/TUI 可共享 Harness；执行位置可隔离 | 个人工作流已证明通用架构或收益幅度 |
| 文档驱动工程实践 | 文档可兼任规格、审阅、恢复和交付表面 | Session log 是 canonical state；Agent 共识等于验收 |
| 公共文档与社区发布 | 可降低引用、回溯与反驳成本 | 发布本身构成背书或独立 Review |

因此，本次增量不改变 Canonical 的 Matter、Candidate / Committed、Evidence、Completion、Authority、Review、Artifact 与 Context Projection，也不新增原则编号。它只为 Practice 中既有的 `Store → Govern → Retrieve → Compile`、Sparse Work Harness、Compiled Expert、Human Work Surface 与 Post-agentic Refinement 提供一组日期化的机制证据、边界澄清和可执行子测试。

未来只有当新证据实质改变 commitment、continuity、evaluation 或 falsification boundary 时，才应重开 Canonical；否则继续以 Snapshot 或 Evidence Note 累积。

---

## 附注与来源

[^contextpilot-paper]: Zhuoshi Pan et al., “ContextPilot: Teaching Agents for Proactive Context Management via Fine-grained RL,” arXiv:2608.28476, 2026, https://arxiv.org/abs/2608.28476 。作者报告 planning、structured memory、soft context offloading、context-aware partial rollout 与 snapshot-level credit assignment；本文只把它作为长上下文 QA / deep-search 场景中的机制级、供应方研究证据，不视为 Schema Engineering 整体架构的独立验证。

[^contextpilot-code]: Tencent, “ContextPilot,” https://github.com/Tencent/ContextPilot 。截至 2026-09-01，仓库公开 inference、evaluation 与 training 实现；公开时间短，尚不足以建立独立复现或跨工作领域外部效度。

[^fryxell-harness]: Scott Fryxell, “The Harness Is the Thing,” 2026, https://scott-fryxell.github.io/blog/the-harness-is-the-thing/ 。文章描述多个 TUI 共享 skills、extensions 与 `AGENTS.md`，并以 explore / planner / worker / critic / promoter 划分工作位置。本文把它列为社区实践观察，不据其个人使用结果推断一般因果。

[^ondrej-setup]: David Ondrej, “Agentic Engineering Setup (after 2,000+ hours),” 2026 Q3，用户保存的公开帖子 Markdown 快照，原作者主页 https://x.com/DavidOndrej1 。其中关于并发 Agent 状态、优先级、隔离环境与 manager / worker topology 的描述属于个人经验和趋势判断，没有统一 benchmark 或独立复现。

[^document-driven-practice]: Vonng, “如何验收 AI 拉出来的屎山？”，2026，用户保存的公开文章 Markdown 快照；相关发布说明见 https://x.com/RonVonng/status/2094288759743545769 。文章提出文档驱动、对抗审查、测试与复杂度约束，并将完整记录与 `AGENTS.md` 索引并置。本文只吸收“文档作为共享工作表面”的实践观察，同时保留 Raw Trace 不等于 canonical state、Agent 共识不等于 Authority 的边界修正；文中的成本比例和效果判断视为作者自报。
