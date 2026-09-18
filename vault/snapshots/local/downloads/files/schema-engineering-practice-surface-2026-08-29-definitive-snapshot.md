---
Status: Companion Paper · Practice / Product Snapshot
Edition: 2026-08-29
Revision: Definitive Snapshot · Sparse Work Harness, Compiled Experts & Judgment Learning
Relation: 《Schema Engineering：让工作存在于模型之外》之独立实践篇；不构成 Canonical Kernel 正文
Scope: 以 DeepSeek Harness developer preview 为当前宿主样本，讨论 Sparse Work Harness、Work Extension、Matter sidecar、Human Work Surface、Store → Govern → Retrieve → Compile、capability surface 与 work governance 的分岔、Search Contract、专家 orchestration 的产品化，并登记 Factory completion governance、Warp feedback compilation、Andrew Ng 的结构模板与 Frontier managed-resource surface 等当前生态证据。
Evidence posture: 本文包含带日期的官方产品机制、vendor research / case study、参考架构、结构类比与待验证产品命题。外部案例只支持其直接呈现的局部必要条件，不能相加为对完整 Schema Engineering 的充分证明；公开 UI / product surface 不能反推出不可观察的 backend ontology；Mixture-of-Experts 只作为总容量与单次激活成本解耦的结构类比。Compiled Expert、三层 activation、promotion threshold、staleness detection、fallback loop、Harness composability、Govern layer、Sparse Context compilation、Search Contract、review bandwidth、capture economics、schema-as-capture-protocol 与模型飞轮均需各自验证。
Closure posture: 本快照消费截至 2026-08-29 的产品与架构讨论并在此冻结。最后一次增量只补齐从 codified knowledge、agentic software interaction 到 governed expert judgment 的训练信号迁移，以及 product / model flywheel 之后的 governed meta-improvement 边界；不新增产品对象。未来宿主 API、产品机制和外部证据以新 Snapshot 追加，不再回写本版。
---

# Schema Engineering 的实践面：从通用 Agent Runtime 到工作语义界面

## Compiled Work Experts、三层激活、Matter Sidecar、Human Work Surface 与专家 orchestration 编译

## 摘要

Schema Engineering 的 Canonical Edition 处理的是一组不依赖具体宿主的 Kernel 问题：概率性 proposal 如何取得正式工作效力，专家亲自跑通的 practice 如何被编订为可转移的 Agent capability，以及 Matter、Evidence、Completion、Authority、Review、Context Projection 与 accepted work product 如何形成分层治理。本文不修改这些定义，而选择一条当下可执行的实践路径：以快速演化的通用 Agent Harness 为底座，用 Work Extension 把 Runtime capability、Session、Tool、Permission、Context、State 与 UI 编译为专业人士认识的工作对象、结构化审阅面和业务裁决动作。

截至 2026-08-28，DeepSeek Harness 已以 developer preview 形式公开 all-plugin 架构，将 model、tool、skill、session、sandbox、storage、loop、scheduling 与 UI 暴露为可组合能力，并提供 durable session event、live agent event、approval / question seam、guarded tool pipeline 与 UI extension point。它适合验证 Work Extension 的封装、挂载、撤销、状态引用和 Human Surface 投影；但其兼容性仍会发生破坏性变化，且这些机制不能证明任何 Work Contract、Review decision 或 accepted work product 的正确性。[^dsh-home] [^dsh-readme] [^dsh-architecture]

本文提出的实践闭环是：

```text
Generic Agent Runtime
→ Work Extension compiles work semantics
→ Matter sidecar preserves governed continuity
→ Work Surface renders human-readable structure
→ Model / Human proposes Candidate Change
→ Evidence / Completion / Authority / Review
→ Committed State / Active Artifact
→ production revision and outcome
→ Contract / Runtime / Eval refinement
→ selective training candidate, only when justified
```

其产品目标不是让专业人士学习 Agent engineering，而是使 Agent 的技术对象退到基础设施层。用户面对的是 Matter、来源、问题、关系、版本、风险、成果、修订、批准和未完义务；Session、Memory、Tool、Plugin、Context orchestration 与 recovery logic 由产品吸收，并只在诊断需要时渐进披露。

这套产品编译面可以进一步组织为 `Store → Govern → Retrieve → Compile`。原始 chats、files、events、Artifact 与状态先被保存；少量信息按来源、版本、效力、Authority 与 supersession 被治理；检索只得到潜在相关集合；Context Compiler 再为当前 role、Matter、stage 与 task 生成 executable context plan。存在于 Project / Matter / Library 中的信息，不等于必须进入本次模型 Context；否则 Schema Engineering 只会把 prompt bloat 改造成 schema bloat。

本文把这一实现方向称为 **Sparse Work Harness**：总的 Work Primitive、Tool、Verifier、Human Surface 与 Matter history 可以持续扩张，一次 Run 只激活当前工作所需的 capability 和 state slice。通用性不来自永久携带全部知识和能力，而来自任何经过治理的工作对象都可以被准确寻址、组合和投影。

高频任务不应让模型每轮从零拼装 primitives。本文将 **Compiled Work Expert** 定义为一份经过版本化、E2E 验证和权限收敛的工作能力配置，并采用 `Preset binding → Expert routing → Primitive composition` 三层 activation：大多数流量由 Matter / role / stage 直接绑定或在少量 Expert 中路由；开放 primitive composition 只服务未覆盖、跨域和 frontier 场景。动态组合必须经过 Candidate Expert、领域 Authority、评测、发布、监控、重验证与弃用，才能进入主路径。

本次增量修订进一步区分 capability surface 与 work governance：当前许多专业 Agent 已经扩大了模型能够接触和操作的对象，却仍由专家承担完成判断、证据充分性、路径切换、风险取舍与停止条件。Work Contract 因而不只规定结果如何被验证和提交，也可以作为 solution space 的先验，声明什么值得注意、应到哪里搜索、何时更换 Runtime、怎样比较候选以及何时放弃一条路径。Human Work Surface 则提高 expert 对 Artifact 的 review bandwidth，使专业短语能够被翻译为可审阅的 Runtime action，而不是迫使用户学习 Prompt 和实现基底。

本次证据修订把现实锚点扩展为五组彼此正交的局部机制：Factory 展示 execution 之外的 executable completion standard；Warp 展示 Human feedback 的捕获、审阅、版本化与外部复用；Claude 与 ChatGPT 展示 Project-bounded memory 与按需历史检索；OpenAI 的 memory summary、Library / Drive references 与 sources surface 展示 context 正从 message payload 转向可管理资源；Andrew Ng 关于 software fundamentals 的文章则提供一项结构模板——execution 变便宜没有消除 data / architecture / reliability / lifecycle judgment。[^factory-completion] [^warp-improver] [^frontier-project-memory] [^openai-managed-resources] [^andrew-ng-se-fundamentals] 这些案例分别逼近 Completion、Feedback compilation、Matter-bounded recall、storage-attention separation 与 judgment migration；它们没有单独或合计实现本文主张的 Govern layer、canonical state、Sparse Work Harness 与 commitment boundary。

---

## 一、为什么应当独立成篇

这套讨论不宜直接并入 Canonical Kernel，原因不在于它不重要，而在于它承担另一种证据责任。

Canonical Edition 定义的是弱编译、工作编纂、commitment boundary、continuity、分层 Contract、Work Eval 与 Post-agentic Refinement。它允许 Work Extension、sidecar、embedded module、垂直产品和既有 system of record 等多种实现形态，不应被某一时期的 Harness API、Web Client、插件协议或前端组件树绑住。

本文处理的则是五类更具体、也更易折旧的对象：

1. **当前宿主选择**：为什么 DeepSeek Harness 适合做理念认证，而不是为什么 Schema Engineering 必须依赖 DSH；
2. **产品编译面**：Work Contract 如何同时编译 Agent execution、Matter continuity 与 Human Work Surface；
3. **组件化假设**：有限的工作表示与 Review grammar 能否被整理为可声明调用的 Kit；
4. **数据形成路径**：专家手动驾驶 frontier Agent 的 loop，如何先改造产品和基础设施，再形成 Eval、Environment 或训练候选。
5. **生态证据图谱**：近期公开机制分别支撑哪一项局部命题、没有支撑哪一项外推，以及证据随产品和模型版本怎样折旧。
6. **稀疏编排与分发**：通用 Runtime 如何以 Shared Core、Compiled Experts、Primitive fallback、Matter State 与 Context Compiler 承载越来越多工作能力，并治理 Expert 的发布、失效、升级和回流。

因此，本文应被视为 **Practice / Product Companion**，而不是 Canonical Edition 的新增本体论。它可以快速修订、替换宿主、删除失效组件，甚至在某些产品假设被证伪后整体缩窄，而不反向改变 Kernel 中 Matter、Candidate / Committed、Evidence、Authority、Review 与 accepted-work-product 的基本边界。

---

## 二、当下生态快照：Runtime、Completion、Feedback 与 Memory

### 2.1 可利用的 Runtime seam

DeepSeek Harness 当前公开的关键能力包括：

- model、tool、skill、session、sandbox、storage、loop、scheduling 与 UI 均可由插件提供、替换或重组；
- Cordis kernel 负责插件 mount / unmount 与 dependency 管理；
- 模型所见内容进入 append-only session log，resume、fork、search、replay 与 Trajectory 由同一 event stream 派生；
- Standard、Code、Minimal 与 Creator 等 mode 展示了同一 Runtime 在不同 capability composition 下的运行形态；
- durable `session/event` 与 live `agent/*`、capability events 分层；`agent/pre-step` 可以决定模型本步看见什么，`tools/pre-execute`、`tools/execute` 与 `tools/post-execute` 提供 guarded execution seam；
- `user-questions` 提供 provider-neutral 的人类问答协议，presentation intent 可以改变 UI 呈现而不改变回答协议；
- UI plugin 可以消费 session event feed，也可以通过 `ConversationNodeDefinition` 向内置 Web Client 注入业务节点。[^dsh-home] [^dsh-architecture] [^dsh-question] [^dsh-ui]

这些能力使下列实现具有工程可行性：

```text
Work Extension declares required services / tools / events
→ adapter binds the declaration to DSH
→ Context Projection enters through runtime seam
→ Candidate actions pass guarded tool and permission paths
→ Human-facing work nodes appear in the host UI
→ committed work state remains owned outside the raw transcript
```

### 2.2 当前兼容性姿态

DSH 仍明确处于 developer preview。官方仓库声明会发生 compatibility-breaking changes；其 pre-release engineering stance 允许自由 rename / repackage，并且旧的 on-disk format 可以被 backend 拒绝，`SESSION_FORMAT_VERSION` 目前也不承诺兼容。[^dsh-readme] [^dsh-agents]

因此，理念认证阶段不应追求一套“长期兼容所有 DSH 版本”的产品，而应采用以下纪律：

```text
pin one exact DSH commit / coherent release train
→ isolate all DSH imports inside one adapter package
→ keep Work Contract and Matter schema host-agnostic
→ treat DSH session persistence as execution history, not canonical work state
→ run compatibility tests before every upstream upgrade
→ delete adapter shims rather than pollute semantic core
```

### 2.3 证据边界

DSH 和 Cordis 当前能够支持的命题是：

- Agent Runtime capability 可以被组合、加载、卸载和替换；
- durable event 与 live extension point 可以分层；
- UI、human question、approval、tool guard 与 session persistence 存在可扩展 seam；
- effect tracking、coeffect resolution、configuration reconciliation 与 hot module replacement 可以为动态组合提供实现基础。[^cordis]

它们不能单独支持以下命题：

- 某一 Work Contract 正确表达了专业工作；
- Matter sidecar 与宿主 session 永远不会发生状态分叉；
- 热替换后 accepted-work-product rate 不下降；
- 通用 Work Surface Kit 能覆盖多个领域而不退化为大量例外；
- 生产 trace 必然形成可训练的专家隐性知识；
- Work Extension 必然构成独立横向产品类别。

上游证明的是“能力怎样组合”；下游仍需证明“这项能力是否形成可采用的工作”。

### 2.4 Capability surface 与 work governance 的分岔

一个较稳健的生态判断是：当前 agentic post-training 已经大量内化了读取环境、调用工具、观察反馈、继续修正等 procedural policy；但 completion、coverage、verification scope、escalation 与 exception handling 等 work governance，仍有相当部分依赖 Runtime 外部提供。这里不需要断言模型“只学到了程序性外壳”；更准确的说法是，模型已拥有大量专业判断，却还不能稳定地产生完整、可恢复、可问责的工作治理。

许多所谓 professional agent 的主要增量仍发生在 capability surface：

```text
legal agent     → retrieval / citation / document tools
finance agent   → market data / spreadsheet / database
research agent  → browser / PDF / search
```

它们首先回答的是：

```text
Agent 能接触什么、能操作什么？
```

Work Extension 还必须回答：

```text
在当前 Matter、证据、权限、版本和责任条件下，
什么情况下这些操作才构成一项完成并可被接受的专业工作？
```

因此，当前产品往往已经能够委派一部分 labor，却没有同等程度地委派 judgment。Expert 仍然充当 invisible orchestrator：发现漏项、解释失败、扩大或收窄验证面、切换路径，并决定什么时候可以停。

这也说明 model weights 与 Work Contract 不是互斥的专业性载体：

```text
Model weights
→ 承载高度复用、低变动、跨任务的知识与行为能力

Work Contract / Matter Context
→ 承载机构特定、版本敏感、需要 Review、Authority 与责任归属的判断
```

Schema Engineering 优先把尚未被模型和 Runtime 稳定包含的专业判断放到权重之外治理；其中稳定、普遍、可验证的剩余部分，才可能在后续进入 Eval、Environment 或模型训练。

### 2.5 Factory：执行前的 executable completion governance

Factory Research 在 2026-08-27 发布的 vendor research 中，对 24 个经选择的 ProgramBench 软件重建任务比较 single-agent 与 multi-role system。文章报告，同一底层模型在 implementation 之前由独立角色先构造 executable standard of completion，并在后续执行中持续受该标准约束后，多个任务的 behavioral parity 显著提高；文中给出的例子包括 GDAL 由 36% 提高到 90%、7-Zip 由 54% 提高到 95%、DuckDB 由 34% 提高到 80%。[^factory-completion]

其结构可以抽象为：

```text
Requirements / source of truth
→ Outcome inventory
→ Evidence and validation procedures
→ Implementation
→ Continue / stop decision
```

真正的增量不是再增加一个普通 validator agent，而是把原本由资深工程师、Reviewer 与 team continuity 持有的“什么才算真的做完”外化为独立于当前 implementation 的长期标准。实现者不能因为已经做成某种样子就静默降低标准；验证面也不应只暴露一组容易被局部拟合的 case。

这一案例直接支持的是：在 verifier 最成熟的 Coding 场景，procedural execution 之外仍可能需要外部 Completion governance，而且同一模型的结果会随治理结构变化。它仍是供应方在自选任务、自建系统和自有 benchmark 上的报告，不能证明一般专业正确性、跨领域适用性、Authority、Matter continuity 或完整 accepted-work-product architecture。

### 2.6 Warp：执行后的 Human feedback compilation

Anthropic 对 Warp 的案例描述了一种已经运行的外部学习循环：

```text
base domain skill
→ Agent execution
→ Human feedback where the work happens
→ scheduled improver skill
→ small proposed skill diff
→ Human review / approve / merge
→ next execution inherits the change
```

Warp 将 domain-specific instructions 保存为 file-based skill；Human 可以在 PR 或 issue 中直接反馈，improver skill 汇总这些反馈并提出小幅修改，再通过普通 PR / code-review workflow 批准。Warp 还把同类机制用于 spec-writing、code review 与 issue triage，并认为 improver machinery 在不同 domain skill 之间具有较高复用性。[^warp-improver]

这组机制支持三项较窄的判断：

1. Human correction 不必随 Session 结束而消失；
2. 外部、可读、可版本化、可回滚的知识载体在不做 post-training 时已经可以产生产品价值；
3. generic improvement machinery 与 domain-specific semantics 可以分层。

但 Warp 的 Skill 仍主要是 principles、conventions、heuristics、domain knowledge 与 operating instructions，属于 **learning substrate / policy memory**。完整 Work Contract 还要表达 work object、Evidence、State、Confidence、Authority、Transition、适用范围和 downstream consequence。Issue triage 中对 `ready to spec` 的反馈开始触及一个状态标签的适用条件，但还不是具备完整证据、权限和状态后果的 transition predicate。

这一差距也揭示了一个 Authority 问题：谁的反馈可以改变未来 Skill，错误反馈如何被过滤，修改依据是什么？Warp 以 Human review / merge 控制写入资格；Schema Engineering 还需要继续说明修改的是哪类 Contract 对象、适用于什么 scope、怎样回滚，以及如何用后续 accepted outcome 校验其语义。

### 2.7 Frontier memory：Project-bounded recall 与 archive retrieval

截至 2026-08-29，Anthropic 官方文档把 Claude 的 chat search 描述为通过 RAG 按需检索旧对话，并说明 Project 可以拥有与非 Project 对话分离的 memory；OpenAI 官方文档则说明 ChatGPT 的 project-only memory 可以使用同一 Project 内的对话，同时排除 Project 外的 memory 和 conversation context。[^frontier-project-memory]

这些公开机制可以抽象为一项产品方向，而不是已经完成的统一架构：

```text
Global identity / preference memory
+ Project-bounded memory
+ retrievable historical archive
+ temporary working context
```

它说明长期 context 正从“不断压缩全部 chronology”转向“按工作域隔离、保留历史、按需检索”。这支持 Matter 作为 long-horizon work 的自然 memory boundary，也支持 progressive disclosure 与 context economics：Attention 只承载当前 working set，历史材料保留检索权和 provenance。

但这里必须保留一条决定性差异：

```text
Memory retrieval architecture
→ What should I recall now?

Matter governance architecture
→ What should become canonical,
   with what status, version, authority and supersession relation?
```

Project-specific memory 可以隔离和召回聊天，不自动知道某项陈述是临时猜测、已确认事实、被驳回候选、已 supersede 决定或具备 Authority 的正式版本。Frontier 产品支持了 recall boundary，尚未因此证明 Candidate / Committed、Evidence relation、Review decision 与 canonical owner 已经被商品化。

### 2.8 ChatGPT managed-resource surface：从 message payload 到 addressable source

截至 2026-08-29，OpenAI 官方资料已经公开几种可观察的产品机制：Memory 使用持续更新的综合表示；Project-only memory 把上下文限制在 Project 边界；Library 与 Google Drive references 允许文件持续存在、被重新选择并返回原始来源；memory sources 可以显示回答引用了哪些 memories、past chats 或其他资源。[^openai-managed-resources]

这些机制支持一个较窄的产品判断：

> **Context 正在从一次 message 中的临时 payload，转向具有 identity、scope、lifecycle 与可复用 reference 的 managed resource。**

它为去重、检索、延迟加载、渐进披露和 source reuse 创造条件，也使 `Source layer → managed layer → current Projection` 成为可理解的产品分层。但公开 UI 与文档不能证明后台已经从 `messages[]` 迁移到本文设想的 event / object ontology；系统仍可能在模型调用前 flatten 成字符串。这里的证据是 storage-attention separation 的产品表面，不是 backend governance 的实现证明。

### 2.9 Andrew Ng：execution-to-judgment migration 的结构模板

Andrew Ng 在 2026-08-28 的 Software Engineering Fundamentals 文章中强调，即使 coding agent 承担大量代码实现，开发者仍需理解 full stack、data architecture、system architecture、security、reliability 与 production operation，才能识别 latency、consistency、maintainability、cost 等 trade-off，并随项目阶段演化架构。[^andrew-ng-se-fundamentals]

这篇文章直接讨论的是 **what humans need to know to steer coding agents**，不是 **what systems need to represent and preserve for consequential work**。本文只抽取一项结构模板：

```text
execution becomes cheaper
→ syntax / local implementation becomes less scarce
→ architecture / data / verification / lifecycle judgment becomes relatively more load-bearing
```

Schema Engineering 对 professional work 的扩展是自己的待验证命题：当 local reasoning / generation 也变便宜时，高 continuity、高 consequence 与高 judgment-density 场景是否需要把 state、provenance、transition、verification 与 lifecycle 建成显式计算层。Andrew Ng 不是 SE 的外部背书，软件工程成熟 primitive 与 work-agent candidate primitive 也不具备同等成熟度。

### 2.10 当前证据图谱

外部案例按局部命题登记，而不按“与 Schema Engineering 相似程度”累计分数：

| SE 命题 | 当前机制 | 证据类型 | 直接支持 | 不证明 |
|---|---|---|---|---|
| Completion 应独立于执行者自评 | Factory executable standard of completion | Vendor research / self-run benchmark | 外部 completion inventory 与 validation gate 可以改变同一模型的长程执行结果 | 一般专业正确性；完整 Work Contract；跨领域因果 |
| Human correction 可以跨 Run 复利 | Warp base skill + feedback + improver + Human merge | Vendor case study / running mechanism | Feedback 可以被低摩擦捕获、审阅、版本化并写回下一次执行 | Skill 已成为 governance substrate；accepted-work-product 因果；模型训练收益 |
| 长程 memory 自然形成工作域边界 | Claude Project memory / chat search；ChatGPT project-only memory | Official product documentation | Project isolation、历史检索与 progressive recall 已进入 Frontier 产品 | Project 等于 accountable Matter；retrieval 等于 canonical state |
| Context 正从 message payload 变成 managed resource | ChatGPT memory summary、sources、Library / Drive references、Project source surface | Official docs / observable product surface | identity、scope、lifecycle、reuse 与 selective reference 已进入通用产品 | backend event/object ontology；canonical work state；非 flatten 的模型输入 |
| Execution commodity 不消除 architecture judgment | Andrew Ng Software Engineering Fundamentals | Expert commentary / structural template | coding 中 data / architecture / reliability / lifecycle trade-off 仍承重 | SE 已被背书；human steering knowledge 等于 system governance；跨领域成熟度对称 |
| Runtime 与领域语义可以分层 | DSH / Cordis plugin、event、permission、UI seam | Developer preview / architecture paper | Work Extension 的加载、撤销与 UI 投影具备工程底座 | Work reliability；零成本 portability；热替换不影响成果质量 |
| Structured traces 可以形成训练上游 | 本文的 capture protocol 与 product / model flywheel | Product / research hypothesis | 给出可实现的数据单元、rights 和 Eval 设计 | 规模必然产生涌现；局部偏好可以泛化；模型飞轮已成立 |

Factory 与 Warp 可以被排列为 ex ante completion governance 和 ex post feedback compilation，但二者还没有共同证明：同一套 work-object ontology、Candidate / Committed boundary、Authority、State transition、Artifact version 与 accepted outcome 能把两段稳定闭合。类似地，Frontier memory 的方向性收敛不能替代 Matter governance 的独立 E2E。

五组外部材料共同形成的是必要条件图谱，而不是充分条件证明：Warp 展示 capture-and-persist，却主要沉淀 heuristic Skill；Andrew Ng 展示 judgment migration，却不主张建立新的治理层；Frontier / ChatGPT 展示 storage-attention separation，却不证明 stored information 已被按 work semantics 治理；DSH / Cordis 展示 composability，却不证明组合出的工作可靠；Factory 展示 external completion governance，却不覆盖完整 Evidence、Authority 与 Matter continuity。把这些片段整合为 Govern layer、Sparse Work Harness 与 accepted-work-product E2E，仍是本文自己的工程假设。

---

## 三、参考架构：Sparse Work Harness

### 3.1 总体分层

```text
Model Providers
        ↓
DeepSeek Harness / Generic Agent Runtime
        ├── model / loop / tools / sandbox
        ├── session / event / trace / recovery
        ├── permission / approval / question
        └── host UI / plugin lifecycle
        ↓
schema-dsh-adapter
        ├── Context Bridge
        ├── Capability / Permission Bridge
        ├── Session / Matter Reference Bridge
        ├── HITL / Human Surface Bridge
        ├── Event / Trace Bridge
        └── Compatibility Boundary
        ↓
Sparse Work Harness
        ├── Compiled Expert Registry
        ├── Work Primitive Registry / Composer
        ├── Activation Planner / Context Compiler
        ├── Work Extension semantic packages
        └── Matter State binding
        ↓
Matter Sidecar / Existing System of Record
        ├── Committed Event Ledger
        ├── Current Semantic State
        ├── Candidate Changes
        ├── Artifact Versions
        ├── Progressive Retrieval Index
        └── Open Obligations
        ↓
Person / Organization / Downstream Work
```

### 3.2 七个不应混同的对象

| 对象 | 逻辑职责 | 示例 |
|---|---|---|
| Runtime Plugin | 提供通用技术能力 | model、tool、sandbox、storage、session、UI |
| Runtime Profile / Mode | 组合一套技术运行环境 | Minimal、Standard、Code、Creator |
| Work Primitive | 最小可组合工作能力 | schema section、verifier、renderer、permission primitive |
| Work Extension | 面向宿主分发领域语义和实现 | contract-review package、research-evidence package |
| Compiled Work Expert | 针对高频任务族 / stage 的版本化、已评测、权限收敛 activation profile | Contract Review / Negotiation v3 |
| Matter State | 某项具体工作的长期实例状态 | Project Atlas 的事实、版本、决定、未完义务 |
| Run Plan | Expert / primitive composition 与当前 Matter、role、stage 的一次绑定 | 当前终止条款审查的 executable context plan |

**Expert 不是人格化 Agent。** 它不是“模拟一位 Partner”，也不只是“一组 Domain Tools”；它是：

```text
schema
+ tools
+ retrieval policy
+ verifier / evaluator
+ permissions
+ Human Work Surface
+ transition / escalation rules
+ applicability / exclusions
+ E2E release evidence
```

这些对象作为一个整体被验证。评测目标不再只是“搜索 Tool 能否调用”，而是“该配置能否在声明范围内形成可采用工作”。

### 3.3 唯一允许了解宿主内部的部分

`schema-dsh-adapter` 是唯一可以直接依赖 DSH service、event、package name 与 UI channel 的层。Work Extension 的 Semantic Core、Compiled Expert manifest 和 Matter State 不应 import DSH。

如果上游把 `agent/pre-step` 改名、更换 `userQuestions` provider、调整 UI node protocol 或替换 session backend，只应修改 adapter 与 compatibility tests。若这些变化迫使合同审查中的“谁可以接受风险”“哪一版成果生效”“哪项来源支持主张”发生专业语义变化，说明 Runtime code 已污染 Work Contract。

### 3.4 五个承重组件

```text
Request + Matter + Role + Stage
                ↓
Activation Planner
├── Preset Binder
├── Expert Router
└── Primitive Composer           # fallback / frontier
                ↓
Compiled Expert or Candidate Composition
+ Matter Projection
+ Permission Envelope Intersection
                ↓
Executable Run Plan
                ↓
Shared Core execution
                ↓
Candidate / Review / Commitment
```

**Shared Core** 尽量薄，只知道怎样运行、装载、退出、记录、恢复和 fail closed，不知道合同怎样审或审计 finding 怎样成立。

**Compiled Expert Registry** 保存已经发布的工作能力配置，以及它们的版本、适用范围、owner、依赖、评测证据、freshness trigger、fallback 和 rollback。

**Work Primitive Registry / Composer** 保存 schema、instruction、tool、verifier、transition、permission 与 renderer 等原子能力。它主要服务 Expert 编译和长尾探索，不应成为普通用户的默认操作面。

**Matter State** 保存具体工作的事实、版本、证据、决定、Review、未完义务和历史引用。它不是 executable Expert；同一 Expert 可以绑定多个 Matter。

**Activation Planner / Context Compiler** 同时回答 `which work capability?` 与 `which current state?`。它输出 executable Run Plan，而不是单一 Expert ID。

```yaml
run_plan:
  matter: acquisition/project-atlas
  task: review_termination_provisions
  stage: contract_negotiation
  expert:
    id: contract_review.negotiation
    version: 3.2.0
    selection: preset

  project:
    - matter.parties
    - matter.business_constraints
    - matter.open_issues.termination
    - artifacts.spa_v7.sections[8,11]
    - events.last_negotiation_round

  gates:
    external_transmit: deny
    accept_risk: human_review

  exclude:
    - tax_due_diligence
    - employment_due_diligence
    - superseded_drafts
    - other_matters
```

### 3.5 三层 activation：Preset、Expert、Primitive

#### Preset binding

产品已能从 institution policy、Matter type、role 与 lifecycle stage 确定配置：

```text
matter.type = contract
stage = negotiation
role = legal_reviewer
→ contract_review.negotiation.v3
```

这是最稳定的生产路径，不需要模型决定“拼哪些插件”。

#### Expert routing

当同一 Matter / stage 允许多个合法工作能力时，模型或规则只在较小的 approved Expert set 中提出选择，例如 Contract Review、Legal Research、Redline Drafting 与 Risk Summary。Runtime 仍检查 applicability、version、compatibility、role 和 permission envelope。

Expert 可以声明一个 primary profile 与有限 auxiliary graph：

```yaml
expert: contract_review
requires: [document_ingestion]
may_invoke: [legal_research, redline_drafting]
conflicts_with: [external_filing]
authority_ceiling: [read, propose, revise_candidate]
```

模型不能从全部 Experts 的幂集中任意组合。预编排把高维 primitive composition 降为少量、经过评测的能力选择，降低 routing entropy 和权限误配。

#### Primitive composition

只有没有合适 Expert、跨域、低置信度、异常或 Expert frontier 场景，才下钻到 primitives：

```text
no acceptable Expert
→ bounded Primitive Composer
→ least-privilege exploratory Run
→ Candidate Artifact / Candidate Composition
```

该路径默认只读或 candidate-write，不允许直接 approve、publish、external transmit、promote policy 或修改 approved state。成功一次不能自动保存为 Expert。

因此，主要流量应依次优先：

```text
Preset activation
→ Expert routing
→ Primitive composition only when necessary
```

本文不预设三者的固定流量比例；需要验证的是，高频工作是否持续上移到低熵、可评测、可治理的路径，而不是 dynamic composition 是否被完全消灭。

### 3.6 Sparse capability activation × Sparse state projection

Sparse Work Harness 同时存在两种稀疏性：

- **Horizontal sparsity**：在大量 Expert、domain、tool、verifier、surface 与 policy 中，只激活当前任务需要的一小部分；
- **Vertical sparsity**：在一个 Matter 的巨大历史中，从 manifest、module、issue、recent events 逐层展开到必要 source span，而不是默认注入完整 chronology。

```text
Sparse Expert / capability activation
× Sparse Matter-state projection
× Progressive evidence disclosure
```

这不是单纯节省 token。Capability activation 会改变数据访问、Tool Authority 与现实行动能力；错误路由可能读取其他 Matter、使用错误法域、绕过 Review 或把错误状态写回 canonical store。因此不能只依赖概率性 routing：

```text
Model proposes Expert / capability / context
→ deterministic applicability and role check
→ permission-envelope intersection
→ least-privilege mount / deny / request review
→ execution
```

模型负责提出“可能需要什么”，Harness 决定“允许装载什么”。

### 3.7 Activation lifetime：稀疏不等于每轮热插拔

DSH / Cordis 的模块化与可逆生命周期证明的是 capability 可以被分拆、组合和替换，不表示 Work 产品应在每个 token 或 turn 重新路由全部模块。Activation lifetime 可以分层：

```text
organization
→ role
→ matter
→ stage
→ run
→ evidence span
```

越靠左越稳定、越适合 AOT 预编排；越靠右越动态、越适合 JIT projection。实践上更接近：

> **cold composition / stage-bound reconfiguration / hot execution**

Matter 或 stage 内的 Expert version、Contract prefix、Tool definitions、permissions 与 Surface 可以保持稳定；Current State 与 Evidence disclosure 随 Run 变化。这比每轮重选全部 primitives 更有利于 cache stability、回归测试、权限审计和可解释恢复。Hot swap 是部署能力，不是产品价值本身。

### 3.8 Expert compilation 本身是一项 governed release

长尾组合是否“成功到足以编译”不能由 improver、模型或一次 Reviewer 反馈决定。法律、咨询、医疗等工作往往没有即时 Boolean outcome；结果可能在数月后被推翻，不同 Reviewer 也可能合理分歧。因此 Expert promotion 必须使用自己的 commitment boundary：

```text
frontier composition / repeated manual loop
→ Candidate Expert Profile
→ applicability / exclusions
→ provenance / source demonstrations
→ Work Contract and primitive dependency graph
→ held-out E2E + risk-stratified Review
→ accepted-work-product / disagreement / reversal observation
→ release Authority
→ Committed Expert Version
```

一个 release manifest 至少包括：

```text
expert_id / version
semantic_owner / release_authority
applicability / exclusions / known unsupported cases
source demonstrations / feedback / Candidate traces
Work Contract / primitive / model / Harness dependencies
held-out Matters / Reviewer distribution / risk strata
accepted outcome / disagreement / reversal window
last_validated_at / next_review_at
freshness and drift triggers
abstention / escalation / fallback
rollback / suspend / deprecation path
```

“成功”不是一个跨领域通用数字。低风险、高频、强 verifier 场景可以使用较快 promotion；高风险、慢反馈、后果滞后的场景需要更长观察窗口、更高 Authority 和更保守 rollout。编译过程本身可以被实现为一项产品治理 Matter：Candidate version 经 Review 和 Committed release 才进入 Router，active Expert 不被模型或 improver 静默修改。

### 3.9 Expert 是资产，也是 staleness liability

Compiled Expert 冻结了一组当前可接受的治理假设。以下变化都可能使它过时：

- 法规、precedent、source catalog 或 institution policy 变化；
- Tool provider、数据库、API、模型或 Harness 行为变化；
- Matter distribution、客户风险偏好或 Reviewer composition 变化；
- later reversal、escalation spike、abstention spike 或新型 edge case；
- Eval 饱和、已知限制扩大，或新的 primitives 显著改变最优路径。

生命周期应明确为：

```text
Candidate Expert
→ validate
→ release
→ preset / route production traffic
→ monitor outcome, disagreement, reversal and drift
→ revalidate / recompile / narrow applicability
→ suspend / rollback / deprecate
```

每个 Expert 都是可复用资产，也是一项需要 owner 和维护预算的责任。Registry 规模不能只以 Expert 数量衡量；未被及时重验证的 Expert 越多，冻结错误判断的 blast radius 越大。

### 3.10 Productized work 与 Expert frontier 是循环，不是瀑布

传统 fast path / slow path 类比需要限定：系统编程中的两条路径常以相同语义结果为目标；Compiled Expert 与 dynamic composition 可能产生不同判断，因为前者包含被冻结的搜索、来源、验证和权限假设。Expert 是 **governed default path**，Primitive Composer 是 **exploratory fallback path**，不是仅仅更慢的等价实现。

产品必须提供 graceful escape：

```text
Compiled Expert encounters unsupported case
→ abstain / mark uncertainty / request Human Review
→ escalate to Human Expert or bounded Primitive Composer
→ preserve Candidate-only boundary
→ capture state, evidence, intervention and outcome
→ Candidate Expert revision or new Expert
→ E2E revalidation
→ new version released to preset / router
```

这条反馈箭头使普通用户不必承担开放 orchestration，又让 productized work 持续把 edge case 推回 Expert frontier。专家从“每一次亲自 orchestra”迁移为“定义、验证、修订和弃用 orchestration contract”，但仍在 Contract 覆盖不到的地方承担判断。

插件 Registry 因而可以从 tool marketplace 演化为 **work capability registry**。Runtime 不需要内建所有行业，只需要稳定的 Extension contract、Expert manifest、Context Compiler 与 commitment interface；领域 Expert、机构和 community 贡献并验证 work packs。后台总能力越大，单个用户看到的表面反而应越简单。

> **Modularity makes sparse composition possible; governed compilation makes expert orchestration distributable and revisable.**

## 四、Matter Sidecar：Session 之外的渐进式语义目录

### 4.1 Matter 不是重做一套 Session

实践阶段不必修改 DSH 的底层 Session ontology，也不必先建设完整 Matter Management 产品。Matter 可以先实现为 Session JSON 之外的一层本地、可版本化、可恢复的 semantic repository 与 progressive retrieval index。

```text
DeepSeek Harness storage
└── sessions/
    ├── session-a
    ├── session-b
    └── session-c

Schema Engineering sidecar
└── matters/
    └── matter-001/
        ├── manifest.json
        ├── events.jsonl
        ├── state.json
        ├── index.sqlite
        ├── candidates/
        ├── artifacts/
        └── projections/
```

DSH Session 保存 chronology、model-visible context、tool call、execution trace 与 replay 依据；Matter 保存当前仍有效的工作语义、版本、来源关系、Review decision、未完义务及下一次执行的检索入口。

```text
Session preserves chronology.
Matter preserves governed continuity.
```

### 4.2 两种不同的数据层

Matter Store 不应只被称为“可丢弃索引”。它至少包含两个逻辑层：

```text
Canonical Semantic Layer
├── committed events
├── current semantic state
├── accepted / active artifact references
├── authority and review decisions
└── open obligations

Rebuildable Index Layer
├── full-text index
├── embeddings
├── session locators
├── graph layout cache
├── retrieval ranking
└── context projection cache
```

后者可以重建；前者不能仅靠重新总结 transcript 猜回。哪一版 Artifact 已被接受、哪项候选被驳回、谁作出何种裁决、什么仍未完成，属于正式工作状态，而不是搜索优化。

### 4.3 一个最小 Matter 声明

```json
{
  "matter_id": "matter-001",
  "extension_id": "evidence-memo",
  "contract_version": "0.1.0",
  "status": "awaiting_review",
  "active_artifact": "memo:v3",
  "session_refs": [
    {"runtime": "dsh", "session_id": "session-a"},
    {"runtime": "dsh", "session_id": "session-b"}
  ],
  "open_obligations": ["verify-source-7"],
  "pending_reviews": ["review-12"]
}
```

一个 Matter 可以关联多个 Session；一个 Session 被删除或因上游升级无法恢复，不应使 Matter 的 active Artifact、Committed State 和未完义务一并消失。

### 4.4 UI 上出现 Matter，不等于修改 Harness core

Matter UI 只是一层读取和操作 sidecar 的 Human Projection：

```text
Matter Header
├── title / status
├── active artifact
├── current assignment
├── open obligations
├── pending review
└── related sessions
```

打开 Matter 的动作可以是：

```text
load Matter manifest
→ load Current Semantic State
→ select relevant Resources
→ resolve session and artifact references
→ compile task-specific Context Projection
→ create or resume a DSH session
```

因此，“返回当前 Matter”可以在产品语义上替代“resume 某个 session”，但底层仍可以使用 DSH 的 session、event 与 agent factory。UI 的 Matter 概念属于 Work Extension 与 sidecar，不要求 DSH core 原生认识 Matter。

### 4.5 Recall boundary 不等于 canonical boundary

Frontier Project memory 的演化降低了 Matter sidecar 的产品陌生度，却不能替代它。Project boundary 可以限制搜索范围，past-chat search 可以找回相关历史；只有 Work Contract 与 commit protocol 才能决定找到的内容是否仍有效、属于何种 Epistemic / Institutional Status、是否已经被 supersede，以及能否成为下一次默认 Context。

```text
retrieve a historical statement
≠
restore it as current work state
```

因此 sidecar 不需要与通用 memory 系统竞争全文检索、embedding 或 archive search。它只需拥有较小、语义密度更高的 canonical layer，并把现有 memory / RAG 作为 Raw History 的检索基础设施。若未来 Harness 原生提供 Project isolation 和 archive retrieval，Work Extension 可以直接复用；Candidate / Committed、Authority、Review 与 active Artifact pointer 仍由明确的 canonical owner 维护。

### 4.6 Store → Govern → Retrieve → Compile

Matter Sidecar 的运行路径可以压缩为：

```text
Store
  raw files / chats / events / artifacts / committed state
→ Govern
  identity / status / version / provenance / authority / scope / expiry
→ Retrieve
  potentially relevant objects and references
→ Compile
  model working set / human work surface / executable context plan
```

Store 解决总容量，Govern 使对象可被区分，Retrieve 缩小候选集合，Compile 决定谁真正占用当前 Attention。这里最难的不是数据库和搜索，而是 Govern：谁定义状态、谁能修改 transition、机构分歧如何表示、规则何时过期、错误提升如何回滚。每个 governance object 需要 owner、scope、version、Review 与 deletion test。

`Context is a working set, not a database.` 即使未来 context window 达到百万或千万 token，capacity 也不自动解决 relevance、conflict、authority、recency、provenance、version、canonical state 与 attention dilution。总工作知识通常会比 per-run budget 增长更快；更大的仓库不会使目录和编译失去价值。

---

## 五、Human Work Surface：不只是 HITL，而是人类理解工作的编译目标

### 5.1 两种 Projection

同一份 Canonical Matter State 应当产生至少两种不同投影：

```text
Canonical Matter State
├── Model-facing Context Projection
│   └── 为有限 Attention 选择紧凑、规范化、可执行的输入
│
└── Human-facing Work Surface Projection
    └── 为浏览、定位、比较、校验、修订和裁决生成结构化工作面
```

模型可能更适合读取：

```json
{
  "claim_id": "C-17",
  "epistemic_status": "contradicted",
  "sources": ["S-2", "S-8"],
  "open_issue": true
}
```

人类则可能更适合看到：

- Claim–Source 关系图；
- 支持、反驳与限定来源分列；
- 来源层级与适用时间；
- 当前结论与历史版本的 Diff；
- 尚未解决的冲突与覆盖缺口；
- 点击后返回原文、页码、条款或记录坐标。

图布局、颜色、折叠、分栏和空间邻近未必对 LLM 有意义，却可以显著降低人的 Review 成本。Human Surface 不是 Prompt 的可视化，而是相同工作语义面向另一类认知主体的独立编译目标。

### 5.2 可以穷举的是有限的表示语法

不可能穷举全部行业页面，但可以整理一组高复用的人类结构化认知原语：

| 表示原语 | 主要用途 | 可承载对象 |
|---|---|---|
| List / Table | 扫描、筛选、分类、逐项裁决 | clause、finding、risk、claim、requirement |
| Tree / Outline | 层级、范围和覆盖检查 | 合同结构、报告目录、义务体系 |
| Anchored Document | 返回原文并做局部校验 | 条款、引文、病历、政策、记录 |
| Graph | 多对象、多关系和影响传播 | entity、evidence、knowledge、dependency |
| Timeline | 先后、生效、变化与冲突 | 事件、法规版本、交易进程、历史沿革 |
| Process / State Graph | 步骤、责任、阻塞与下一状态 | 审批、案件、风控处置、incident |
| Matrix | 两维覆盖、对应与冲突 | 风险×控制、主张×来源、义务×责任人 |
| Diff / Side-by-side | 版本、候选和修改比较 | redline、报告修订、政策版本 |
| Version Lineage | 分叉、覆盖、撤回与生效版本 | Artifact、方案、Decision |
| Queue / Board | 待处理对象与 Review 进度 | 待审条款、开放问题、升级事项 |
| Coverage / Gap | 漏项、证据缺口和未完成 | Completion、尽调、测试覆盖 |
| Dashboard | 全局态势与异常聚集 | 风险、状态、进度、Review 分布 |

这些 primitive 可以组合为合同审查面、研究校勘面、审计底稿面或投研 Review 面，而无需每个场景重新发明全部交互。

### 5.3 图谱是 Renderer，不是通用 Ontology

同一个 Graph Kit 可以呈现不同语义：

```text
Entity Graph
node = person / company / contract / asset
edge = owns / controls / signed / related-to

Evidence Graph
node = claim / source / finding
edge = supports / contradicts / qualifies / derives-from

Knowledge Graph
node = concept / rule / precedent
edge = applies-to / exception-to / supersedes

Process Graph
node = state / task / approval
edge = transitions-to / blocks / requires

Version Graph
node = artifact version / decision version
edge = revises / supersedes / branches-from
```

共享的是布局、筛选、展开、定位、对象详情与关系编辑；不共享的是哪些节点和边合法、哪种关系需要来源、哪类修改可由模型提出、哪类关系必须人工确认，以及变更如何影响 Completion、Authority 与正式状态。

### 5.4 Human Review Grammar

对于会进入正式状态的 Review Unit，可以进一步抽象为：

```text
Review Item
= Target
+ Anchors
+ Candidate Assertion / Change
+ Judgment Dimensions
+ Evidence
+ Decision
+ Authority
+ State Consequence
```

可复用的动作族包括：

```text
accept
reject
revise
request further work
request evidence
qualify
defer
waive
escalate
approve
publish
supersede
withdraw
```

同一个底层动作可以被领域化：

```text
request further work
合同审查  → 要求补充替代条款
研究校勘  → 要求补充一手来源
审计底稿  → 要求扩大抽样范围
投研判断  → 要求补充反方情景
产品评审  → 要求补充验收条件
```

真正的复用不是共用一个按钮，而是共用一条 commitment grammar：

```text
decision
→ authority requirement
→ validation
→ committed event type
→ semantic-state transition
→ artifact-version effect
→ next-context effect
```

### 5.5 Work Surface Contract 与中间表示

```text
Work Contract
→ Human Surface Contract
→ Work Surface IR
→ DSH UI Adapter / Static Renderer
→ rendered professional work surface
```

概念性声明如下：

```yaml
review_surface:
  unit:
    type: contract_clause
    key: clause_id
    label: 条款

  anchors:
    primary:
      type: document_span
      required: true

  fields:
    - id: risk_level
      control: ordinal_choice
      options: [low, medium, high, critical]
      required: true

    - id: rationale
      control: structured_comment
      required_when:
        risk_level: [high, critical]

  evidence:
    multiplicity: many
    relation_types: [supports, contradicts, qualifies]
    show_source_version: true

  views:
    - outline
    - anchored_document
    - evidence_graph
    - version_diff
    - coverage

  actions:
    - id: accept
      requires_authority: review_clause
      commits: clause_review_accepted

    - id: request_revision
      requires_reason: true
      commits: clause_revision_requested

    - id: escalate
      target_role: accountable_principal
      commits: clause_review_escalated
```

换成研究主张场景时，renderer、Evidence panel、Decision bar、Event writing 与 Matter binding 可以不变，只需替换领域对象、判断轴、来源要求和状态后果。

### 5.6 编译阶段即可完成，不必依赖运行时热插拔

Work Surface 不必全部在运行时动态生成。更稳定的实现可以是：

```text
Work Contract
→ compile surface bundle
→ package with Work Extension
→ runtime binds current Matter data and Authority
```

```text
extensions/contract-review/
├── contract.yaml
├── surface.bundle.json
├── validators/
├── reducers/
├── renderers/
└── assets/
```

热插拔是部署机制，不是 Human Surface 成立的前提。对快速变化的宿主而言，预编译的 Surface IR 与确定性 Renderer 反而更利于兼容和回归测试。

### 5.7 临时 HTML 的价值与边界

Frontier model 临时生成 HTML，说明纯文本回答不足以承载复杂 Review；但临时页面常常具有以下问题：

```text
每次重新设计
字段和布局不稳定
只表达当前回答
引用与版本只是文本
按钮没有正式状态后果
无法跨 Session 恢复
难以绑定 Authority 和 Review routing
```

Schema-driven Work Surface 的链路应是：

```text
Model proposes structured Candidate
→ deterministic Renderer builds work surface
→ Human inspects / edits / reviews
→ typed action creates Candidate Decision
→ Authority / validation
→ Committed Event
→ Matter State and active Artifact update
```

HTML 是 Renderer 的输出，不是工作语义的来源。

### 5.8 旧垂直 Chatbot 与专业 SaaS 的可继承资产

过去许多垂直产品的模型能力并不构成长期差异，但它们沉淀的部分 Human Surface pattern 仍然有价值：

- 合同逐条审查、原文与意见并排、redline、风险分级；
- 尽调清单、审计 Finding 与整改状态；
- Claim–Source、Citation、证据冲突与来源层级；
- 财务异常与解释；
- 医疗或诉讼时间线；
- 义务覆盖矩阵；
- 版本沿革、审批记录和决策包。

这些交互通常经过专业判断，被认为是 LLM 相对容易触达、结构较稳定、又有明显 Human Review 价值的对象。它们可以与现有专业 SaaS、Excel、workpaper、审批表和专家 prototype 一起，被重新编订为 Work Surface Kit 的 pattern source。

应按认知任务而不是行业整理：

```text
Inspect
Compare
Trace
Locate
Classify
Reconcile
Prioritize
Complete
Decide
Approve
Escalate
```

并以三个条件筛选是否值得进入 Kit：

```text
LLM reachability
× structural stability
× human review value
```

仅仅“能够结构化”不足以成为进入 Schema 的理由；它必须改善 Review、恢复、版本、来源、Authority、Completion、Context Projection 或成果采用。

### 5.9 Review bandwidth：让专家直接面对 Artifact

Human Work Surface 的另一项价值，不是增加更多字段，而是降低 expert 对实现基底的依赖，使专业判断可以直接作用于可见 Artifact。

前端设计是一个典型的中间场景。局部实现通常已不是主要瓶颈；有设计判断但不写代码的人，也能够直接看出留白、层级、密度、节奏和动效是否成立。Canvas、live preview 或可交互 Artifact 把以下 loop 闭合：

```text
design judgment
→ implementation
→ rendered artifact
→ human review
→ revision
```

Output 变好，不是因为 Human 学会了 coding，而是因为 review bandwidth 提高了：人可以直接指出结果哪里不对，不必理解 DOM、CSS、component tree 或 tool protocol。

这也揭示了一种重要的产品方向：专业语言本身不一定含糊，缺失的往往是它到 Runtime action 的语义映射。例如“太密”“不够透气”“层级靠排版而不是卡片”“动效太积极”，对成熟设计师可以是稳定而精确的 shorthand；Work Extension 应当把它们展开为可审阅的候选操作：

```text
“太密”
→ 降低信息密度
→ 增大 section rhythm
→ 减少 container boundary
→ 拉开 heading / body hierarchy
→ 弱化装饰元素
→ 增加 negative space
```

这类映射不能直接取得正式效力。系统可以提出解释和修改候选，Expert 在 Artifact 上接受、驳回或修订；被接受的映射再进入 Matter、institution configuration、Eval 或训练候选。产品不应要求专业人士把自己的语言改写成 Prompt engineering 术语，而应逐步学习并治理专业短语背后的操作语义。

---

## 六、Work Extension 的产品定义：吸收 Agent 复杂度

Work Extension 不是给通用 Agent 增加一层行业术语，而是把整个 Agent Runtime 与 Agent UI 收敛为工作语义。

| Agent Runtime 对象 | 专业用户面对的工作语义 |
|---|---|
| Session | 当前 Matter、Assignment 或工作阶段 |
| Memory / Context | 当前有效事实、适用版本、开放问题与相关材料 |
| Model output | Candidate Finding、Candidate Artifact、候选修改 |
| Tool call | 搜索来源、修订草稿、生成对照、提交业务系统 |
| Plugin / capability | 当前场景可用的工作能力 |
| Permission | read、propose、revise、approve、publish、transmit |
| Approval popup | 接受成果、退回修订、批准风险、要求补证、升级裁决 |
| Agent trace | 按需展开的执行证据与诊断信息 |
| Generated HTML | 由 Contract 预编译并绑定状态的专业工作面 |
| Chat response | 一种交互，不是产品本体或正式状态 |

Sparse Work Harness 进一步把“产品吸收复杂度”落实为一个反向关系：

```text
后台可寻址的 Work Primitive / Matter / Tool 越多
→ Context Compiler 越需要精确稀疏
→ 单个用户默认看到的 capability 与 UI 越少
```

产品不是把复杂度搬到一个高级设置页，而是用预编排 profile、least-privilege capability、stage-bound transitions 和 progressive disclosure 消除用户逐次 orchestration。

用户不应首先回答：

```text
选哪个模型？
开哪些插件？
该不该 compact？
使用哪个 Session？
怎样写 Prompt？
Memory 放在哪里？
```

用户应首先回答：

```text
正在处理什么 Matter？
当前要形成什么 Artifact？
哪些问题尚未解决？
哪些来源支持或反驳判断？
哪一版成果当前有效？
谁可以修订、批准或发布？
下一步应处理什么？
```

隐藏技术层不等于删除可诊断性。合适的信息架构是：

```text
Default Work Surface
→ professional objects and decisions

Progressive Disclosure
→ evidence, version, provenance, context projection

Deep Diagnostics
→ model, tool, session, plugin, trace, recovery
```

Work Extension 是否真正成立，可以用一个直接的产品测试：

> 一名合格专业人士能否从工作对象出发，启动、审阅、修订、恢复并提交一项工作，而不必先学习模型选择、Session 管理、Memory 策略、Tool Calling、插件生命周期和 Context 编排？

若不能，它仍主要是一个可配置 Agent；若能够，并且成果可以进入正式下游流程，它才形成了工作渗透面。

---

## 七、专家隐性知识：先蒸馏环境，再考虑蒸馏策略

### 7.1 隐性知识首先表现为手动控制行为

专家使用 frontier Agent 跑通高质量 Demo 时，往往同时承担一层未产品化的 Human Harness：

```text
Expert selects task and context
→ Model attempts
→ Expert notices omission or error
→ Expert changes framing, source or search
→ Model retries
→ Expert judges materiality
→ Expert decides what is deliverable
```

这些行为很少完整出现在法规、合同、论文、SOP 或最终报告中。它们也不要求专家先准确口述自己的全部思维过程；更可靠的 source material 是专家在具体 Work State 下实际怎样选择、修订、驳回、补证、升级和提交。

### 7.2 第一次蒸馏：进入产品和基础设施

专家的手动 loop 中，相当一部分不应训练进模型，而应直接改造工作环境：

```text
反复重新说明任务范围
→ Assignment / Context Projection 不充分
→ 编入 Stable Contract 与 projection policy

反复要求补充引用
→ Evidence Contract 与锚定面缺失
→ 编入 source relation、citation view 和 validator

自行记录未处理问题
→ Completion 不存在于模型之外
→ 编入 open obligations 与 coverage view

不断比较旧稿和新稿
→ Artifact version semantics 缺失
→ 编入 active version、Diff 和 supersession

判断何时继续、询问或升级
→ Review / Escalation routing 不清
→ 编入 typed decision 与 Authority

反复改变 Prompt 或工具顺序绕开接口问题
→ Harness / tool interface accident
→ 修复 Runtime，而不是训练 workaround
```

这一步形成的是：

```text
hidden expert intervention
→ explicit work object
→ Work Contract
→ Human Work Surface
→ Validator / Evaluator
→ Context / State policy
→ Runtime capability and routing
```

因此，更准确的顺序是：

> **Environment distillation first; policy distillation only for the residual.**

### 7.3 第二次蒸馏：形成结构化行为记录

当 Matter、State、Candidate、Evidence、Review、Revision、Artifact Version 与 Outcome 已经显式存在后，专家的干预才不再只是 Transcript 中的一段自然语言，而可以形成带语义的状态转换：

```text
Work State
+ available evidence and resources
+ model candidate
+ expert intervention
+ accepted / rejected alternatives
+ resulting state change
+ artifact revision
+ downstream outcome
```

一种潜在的数据单元是：

```text
(state_t,
 candidate_t,
 expert_action_t,
 evidence_context,
 state_t+1,
 accepted_work_product_outcome,
 later_reversal,
 applicability_scope,
 data_rights)
```

它记录的不是完整内在思维，而是：专家在什么状态下发现问题、模型提出什么候选、哪些候选被保留或推翻、补充了哪些来源和约束、结果是否由具备 Authority 的 Reviewer 接受，以及后来是否发生 reversal。

### 7.4 隐性知识必须分流

| 行为来源 | 默认归宿 |
|---|---|
| 稳定专业义务 | Work Contract、Validator、Work Eval |
| 机构规则和风险偏好 | Versioned institution configuration |
| Client / Matter 特殊条件 | Matter Context |
| 个人表达和工具习惯 | User preference，默认不推广 |
| Runtime / tool workaround | Harness 修复或删除 |
| 跨 Matter、跨接口仍可复现的剩余行为 | Eval / Environment / selective post-training candidate |
| 不可约的重大判断 | Expert Review / Accountable Decision |

“专家这样操作”本身不等于训练理由。只有在模型、工具名、字段顺序、UI 布局和等价协议变化后仍然成立，并且跨 Matter 或跨 Reviewer 具有可解释复现的行为，才更可能是可迁移的专业能力，而不是 interface overfit。

### 7.5 产品化同时改造数据生成环境

Work Extension 不只是采集专家行为。它先统一任务、状态、来源、动作和结果，使后续行为更容易比较、归因和校勘：

```text
Expert controls frontier Agent
→ hidden Human Harness becomes observable
→ stable interventions compile into product and Runtime
→ qualified users can perform the same work
→ structured Review / Revision / Outcome accumulate
→ failure attribution separates product gaps from model gaps
→ residual portable behavior becomes training candidate
```

这条路线仍受客户机密、training rights、Reviewer 分歧、机构偏好、选择偏差和 held-out Work benchmark 约束。结构化数据首先服务运行、审计、恢复和 Eval，不会因存在而自动取得训练价值。

### 7.6 Search Contract：Work Contract 也约束进入哪个 solution space

专家隐性知识不只包括“怎样判断结果”，也包括：

```text
what to notice
→ where to search
→ what to try
→ how to compare
→ when to abandon a path
```

因此，Work Contract 在实践中可以区分两个互补部分：

#### Review Contract

记录怎样判断候选是否成立，例如 hierarchy、coverage、materiality、evidence sufficiency、risk、completion 与 deliverability。

#### Search Contract

记录怎样进入更可能有效的 solution space，例如：

- 哪类问题先找 reference，而不是立即生成；
- 哪些缺陷应从整体结构修复，而不是继续 patch 局部；
- 什么迹象说明默认组件、默认检索或当前 Runtime 已经形成路径依赖；
- 何时应调用另一种表示、工具或执行环境；
- 哪些路径历史上反复得到 mediocre output，应降低优先级；
- 何时需要扩大验证面，何时应停止当前路径并升级。

Search Contract 不是固定 workflow，也不是把 expert 的每一步写死。它更像一组可修订的搜索先验、路由条件和放弃条件：减少模型在训练分布最密、但不适合当前工作的默认路径上反复消耗，同时保留探索与反例发现。

它也必须通过等价接口扰动检验。若把 tool rename、替换组件库或更换等价 Runtime 后收益消失，说明系统学到的是 interface accident；只有能以工作语义表达并跨接口保持的路径判断，才适合提升为 Contract。

### 7.7 Schema 作为采集协议：产品飞轮先于模型飞轮

从训练上游看，可以把当前能力积累压缩为三种信号：

```text
codified human artifacts
→ foundation pretraining

software interaction / tool-use trajectories
→ agentic post-training

governed expert judgment trajectories
→ next Eval / Environment / training candidate
```

第三种信号不是专家思维链的完整转录，而是某一 Work State 下可以观察和校勘的 evidence、candidate、intervention、decision、outcome 与 later reversal。下一阶段需要规模化的，不只是更多 task / output pair，而是：

```text
context
→ expert judgment
→ evidence
→ intervention
→ outcome
→ later validation / reversal
```

在这个意义上，Schema 的重要资产之一是 **capture protocol**。它把原本散落在人脑、review comment、临时追问、返工和最终拍板中的判断，变成具有 Matter、状态、来源、版本、动作、适用范围与结果的可累计记录。

由此可以区分两个不同飞轮：

```text
Product flywheel
expert loop
→ Work Contract / Work Surface
→ Agent execution
→ failure / revision
→ Contract and Runtime refinement

Model flywheel
large-scale governed contracts and judgment traces
→ Eval / Environment / selective post-training
→ lower expert intervention
→ broader deployment
→ more qualified traces
```

第二层不能跳过第一层。没有清楚的任务边界、状态、Evidence、Outcome、rights 与 failure attribution，规模只会放大噪声、机构偏好和 interface overfit。

这条路径也有清楚的能力边界：

```text
Level 1 — Procedural execution
Level 2 — Contract-governed work
Level 3 — Contract-derived learning
Level 4 — Open-ended knowledge creation
```

Schema Engineering 明确位于第二层，并连接第一层与第三层；它可以把人类已经会但机器尚未稳定学会的工作判断外化、治理和积累，却不保证在没有 expert answer、contract 或外部反馈时自动产生开放式的新知识。

在产品飞轮和模型飞轮之外，只能把第三条更远期回路列为研究假说：

```text
Governed meta-improvement
failure / outcome
→ Candidate change to Contract / Evaluator / Tool / Environment / learning procedure
→ counterfactual test
→ independent Review / external reality feedback
→ authorized commit or rejection
→ monitor reversal and unintended effects
```

这条回路与普通 self-editing 不同。系统不能用自己修改过的标准证明自己变强，也不能因某次局部收益自动提升训练方法；Evaluator independence、Authority、rollback、held-out environment 与现实后果仍是提交边界。它不是数据规模自然触发的“涌现”，也不是本快照已经验证的能力。

### 7.8 Skill-to-Expert Compilation Gap

Warp pattern 可以作为 Post-agentic Refinement 的较弱 reference implementation：它已经完成 `capture → propose diff → Human review → versioned reuse`。但 improver 主要产生原则、convention、heuristic 与自然语言 instruction；Compiled Expert 要求的输入更强：

```text
affected Work Object / Artifact span
+ epistemic / institutional state
+ evidence requirement
+ transition predicate
+ Authority / permission consequence
+ completion and Review routing
+ applicability / exclusions
+ verifier / evaluator
+ Human Work Surface
+ E2E release evidence
```

从“Look for repeated code”或“这种 issue 可以打 ready-to-spec 标签”，到“该状态在什么证据、角色和前置条件下可以成立，并对下游开放什么动作”，不是简单增加字段，而是从 learning / policy substrate 提升到 governance substrate。

本文将这段距离称为 **Skill-to-Expert Compilation Gap**。其最小链路是：

```text
feedback instance
→ affected object and state diff
→ inferred correction type and scope
→ Candidate Contract / Expert Change
→ evidence and competing interpretations
→ promotion Authority
→ updated verifier / transition / permission / Surface
→ held-out E2E and reversal observation
→ versioned release / reject / rollback
```

这条链避免把“Senior reviewer 说过一次”直接提升为 domain truth。具体 correction 可以先停留在 Matter 或 user scope；跨 Matter、跨 Reviewer、跨模型和等价接口复现后，才成为 institution / product rule candidate。即使被 merge 的 Skill diff 也只是 Candidate source material，不是 active Expert 的自动更新。

因此，Warp 对本文最强的支持是：**权重之外的专业知识可以先以可读、可审阅、可版本化的形式复利。** Schema Engineering 的工程增量正是把这种 policy memory 进一步锚定到工作对象、状态、Authority、正式提交和 outcome，并把它编译为可发布、可失效、可回滚的 Expert version。

### 7.9 从 codified knowledge 到 tacit work knowledge

模型参数本身不是“显性知识”；它是隐式表示。但从系统供给看，Foundation model 已经大量商品化的是人类曾经文本化、编码化和公开表达的知识：法规、案例、教材、论文、软件文档、操作指南和可观察行为。Agentic post-training 随后进一步吸收在计算机与软件环境中观察状态、调用工具、读取反馈、恢复失败和继续执行的 interaction trajectory。

下一层更稀缺的是专业共同体会做却很少完整写下来的工作知识：

```text
什么时候证据不足
哪一种来源形式上正确但实际上不能依赖
一个 draft 何时值得送给 senior reviewer
什么变化构成 Matter state transition
哪个风险可以接受、哪个必须升级
何时切换路径而不是继续 patch 当前 workflow
什么应当长期保存、什么只是探索噪声
```

这些对象混合 procedural knowledge、judgment、governance 与 exception handling。Schema Engineering 不应把全部隐性知识写成字段；Schema 只是显影后的中间表示：

```text
expert behavior
→ intervention / decision / correction
→ event + state / artifact diff
→ recurring pattern
→ Contract / verifier / Surface / routing policy
→ Eval / Environment
→ selective post-training, only for portable residuals
```

只有必须稳定存在、必须改变行动、必须接受 Review 或能够被验证的部分进入 Schema；局部、低风险、重推成本低或不可约的判断继续留在人和模型的当前 Context 中。产品首先把专家重复的 orchestration 蒸馏进环境，再把跨 Matter、跨接口仍然成立的剩余行为作为 policy distillation 候选。

---

## 八、在 DeepSeek Harness 上的理念认证

### 8.1 验证目标

当前阶段不建设完整垂直产品，也不证明所有工作场景都能被统一。目标是完成一份 **Schema Engineering Reference Implementation / Executable Specification**：

> 验证 Work Contract 能否在不修改 DSH core 的条件下，被编译为可加载的场景能力、Matter continuity、Context Projection、Human Work Surface、Authority boundary 与 typed commitment protocol。

最小闭环是：

```text
Load Work Extension
→ bind Matter
→ project Context
→ Agent produces Candidate
→ render structured work surface
→ Human inspects / corrects / reviews
→ Authority and validators check decision
→ commit Event and Artifact
→ destroy Session / unload extension
→ restore Matter
→ build next Context
```

### 8.2 三个共享场景与一个对照场景

不应先做一个功能繁重的法律产品。前三个场景用来测试表示与 Review Kit 是否能够跨专业对象复用；第四个前端设计场景则刻意引入 rendered Artifact、专业 shorthand 与 Search Contract，检查这套实践是否超越表单化工作流：

#### A. 合同条款逐条裁决

```text
Target      = clause
Anchor      = document span / contract version
Judgment    = interpretation / risk / recommendation
Evidence    = source clause / precedent / policy
Views       = outline + anchored document + diff + risk queue
Actions     = accept / revise / request alternative / escalate
Artifact    = risk list + redline
```

#### B. 研究主张与来源校勘

```text
Target      = claim
Anchor      = source location / source version
Judgment    = support status / confidence / applicability
Evidence    = supports / contradicts / qualifies
Views       = claim table + evidence graph + source panel + coverage
Actions     = accept / qualify / request source / reject
Artifact    = evidence-backed memo
```

#### C. 审计 Finding 与整改裁决

```text
Target      = finding
Anchor      = workpaper / record / control
Judgment    = severity / materiality / remediation status
Evidence    = sample / system record / policy
Views       = finding queue + risk-control matrix + timeline
Actions     = accept / expand test / remediate / waive / escalate
Artifact    = finding register + remediation plan
```

前三者共享 Review Item、Anchor、Evidence Relation、Decision Bar、Authority Check、Committed Event、Matter update 和 recovery；只改变对象、字段、来源要求、版本能力、Review 路由和状态后果。

#### D. 前端设计审阅与搜索轨迹（对照场景）

```text
Target      = rendered region / interaction / component relation
Anchor      = viewport / component / source version / reference
Judgment    = hierarchy / density / rhythm / motion / responsiveness
Input       = professional shorthand + direct Artifact annotation
Views       = live canvas + visual diff + structure tree + references
Search      = layout / typography / component / image / SVG / WebGL / runtime routing
Actions     = accept / reject / compare / switch path / request alternative
Artifact    = rendered interface + source version + accepted design decisions
```

这个对照场景不以表单和逐条裁决为中心，用来验证三件事：Work Surface 是否能提高不写代码 Expert 的 review bandwidth；专业短语是否能映射为可审阅的 Runtime action；Search Contract 是否能改变路径选择，而不退化为特定 tool name 或组件库的 workaround。

### 8.3 最小仓库形态

```text
schema-engineering-lab/
├── packages/
│   ├── kernel/                  # host-agnostic contracts and reducers
│   ├── matter-store-local/      # JSONL / SQLite provider
│   ├── work-surface-ir/         # representation and review grammar
│   ├── work-surface-renderers/  # table / graph / diff / timeline / matrix
│   ├── dsh-adapter/             # only DSH-dependent package
│   └── dsh-work-surface-ui/     # host UI bridge
│
├── extensions/
│   ├── contract-clause-review/
│   ├── evidence-claim-review/
│   ├── audit-finding-review/
│   └── frontend-design-review/
│
├── tests/
│   ├── contract/
│   ├── e2e/
│   ├── recovery/
│   ├── authority/
│   ├── surface/
│   └── compatibility/
│
└── compat/
    └── dsh/<pinned-commit>.json
```

### 8.4 必要测试

#### No Core Patch

Work Extension 只能通过公开 service、event、tool、permission、question 与 UI seam 工作。若必须 patch agent loop，记录为宿主接口缺口，不将 fork 偷渡为架构前提。

#### Session Replacement

销毁原 Session，新建 Session 并绑定同一 Matter。不读取完整 transcript，也能恢复 Current Semantic State、active Artifact、pending Review 与 open obligations。

#### Candidate / Committed Isolation

模型产生候选后强制中断。重启后，候选不得被误认为正式状态；只有 Review、Authority 与 commit protocol 完成后才能更新 canonical state。

#### Completion Contract Independence

Completion inventory、Evidence requirement 与 acceptance gate 必须由版本化 Contract 或独立 Reviewer ownership 维护，不能被当前实现轨迹静默改写。测试应包含未向执行 Agent 暴露的 boundary cases，避免系统把“满足工作语义”退化为拟合具体 instrument。

#### Profile Perturbation

同一 Extension 分别加载在 Minimal 与 Standard profile。工具丰富度与 trajectory 可以变化，工作语义和 accepted-work-product 标准不得变化。

#### UI Representation Equivalence

同一 Review Item 分别通过 table、graph、anchored document 或 static HTML 展示。只要决策语义等价，Committed Event 和 Matter State 后果应当一致。

#### Review Bandwidth

让具备专业判断但不熟悉实现基底的用户，通过 rendered Artifact、anchor、diff 和结构化动作完成 Review。比较其达到同等 accepted outcome 所需的时间、实现级指令数量和往返轮次；若仍必须阅读代码、理解 tool protocol 或手写 Prompt，Work Surface 尚未吸收 Agent complexity。

#### Professional Shorthand Mapping

对“太密”“证据不够”“这项风险需要上升一级”等专业短语，系统先提出带依据的语义展开和操作候选，由 Expert 接受、驳回或修订。测试同一短语在不同 Context 下是否产生不同且可解释的候选，而不是硬编码成单一动作。

#### Search Contract Portability

在语义等价的 reference source、component system、tool name 或 Runtime provider 间替换。Search Contract 应保留“何时扩大搜索、切换表示或放弃路径”的专业含义；若收益依赖固定接口，归类为 interface overfit。

#### Feedback / Contract Promotion Authority

Human feedback 可以自动捕获并形成 Candidate Contract Change，但不能由 improver agent 直接改写 active Contract。Promotion 必须记录提出者、受影响对象、推断 scope、支持与反对证据、具备 promote-policy Authority 的 Reviewer、Contract version 和 rollback path；后续 reversal 应能归因到具体提升决定。

#### Retrieval / Canonical Separation

历史检索应能找回已经驳回、撤回或 superseded 的候选，但这些内容不能因 relevance 较高而重新进入 Current Semantic State。测试同一语义相近的 active decision、old decision、working assumption 与 rejected candidate，检查 Runtime 是否按 status 和 version 生成不同的 Context Projection。

#### Sparse Capacity Scaling

逐步扩大同一组织可寻址的 Matter、Artifact、history 与 Work Primitive 总量，同时固定当前 Assignment。per-run Context、mounted Tool surface、Human Surface 和 latency 不应随 Store 总量近似线性增长；critical omission、wrong-version recall、cross-Matter leakage 与 accepted outcome 需要保持在声明阈值内。

#### Context Compiler Omission / Pollution

构造两类对照：under-inclusion 隐藏一项 binding fact、active version、Authority 或 mandatory verifier；over-inclusion 混入已 superseded、其他 Matter、越权或语义相近但无关对象。测试 compiler 能否同时控制漏项和 attention pollution，而不是只优化 retrieval recall。

#### Least-Privilege Capability Activation

Model 可以请求额外 Tool、schema 或 verifier；Harness 必须依据 role、Matter、stage 与 Contract fail closed。测试错误法域、跨 Matter search、external transmit、approve / publish 与 irreversible action 不能因“模型认为需要”而被动态挂载。

#### Three-tier Activation Priority

构造可被 preset 覆盖、需要 Expert selection、必须 primitive fallback 的三组任务。验证 Runtime 不在已有 preset 时调用模型路由，不在已有合适 Expert 时下钻 primitives；当 Expert 不适用或低置信度时，能够 abstain 并进入受限 fallback，而不是勉强执行。

#### Compiled Expert Unit E2E

以整个 Expert bundle 为评测对象，而不是分别证明 Tool 可调用。固定 Matter family、role、risk stratum 与 accepted-work-product 标准，检查 schema、retrieval、verifier、permission、Surface 和 transitions 组合后是否稳定形成可采用成果，并记录 Expert version、selection source 与 later reversal。

#### Expert Promotion Governance

动态 composition 只能产生 Candidate Expert。Promotion 需要 provenance、applicability / exclusions、semantic owner、release Authority、held-out Matters、Reviewer disagreement、risk-stratified outcome、freshness trigger、fallback 和 rollback。Improver、模型或单次成功 trace 不能直接进入 active Registry。

#### Staleness / Revalidation

改变法规、source catalog、institution policy、Tool provider、base model、Harness version 或 Matter distribution，检查是否触发相应 Expert 的 revalidation、narrowing、suspension 或 deprecation。旧 Expert 不得因仍可加载而继续自动获得生产流量。

#### Graceful Escape / Frontier Re-entry

给 Compiled Expert 注入已知 unsupported case 和新型 edge case。系统应能暴露不确定性、停止正式提交、升级到 Human / bounded Primitive Composer，并把状态、证据、干预和 outcome 保存为 Candidate Expert revision，而不是让普通用户重新承担完整 orchestration。

#### AOT / JIT Semantic Equivalence

同一 Work Extension 分别采用 Matter 创建时预编排、stage transition 重编排与 Run-time 动态 composition。具体 trajectory 和 cache 行为可以不同，但 Work Contract、Authority、Candidate / Committed、Review 与 accepted-work-product 标准必须等价。

#### Stage-bound Reconfiguration

从 negotiation 进入 execution、从 discovery 进入 filing 等明确 state transition 时，Runtime profile 应可受控重编译；旧 stage 的 Tool、Context slice 与 Authority 被撤销，新 profile 通过 migration 和 Review 后生效，不允许两个 stage profile 同时拥有互相冲突的正式写入权。

#### Expert Orchestration Transfer

让 prototype Expert 在自由 Runtime 中完成若干 Matters，再将稳定模式编订为 Extension。由其他合格用户执行 held-out Matters，比较其 Prompt / Tool-routing 操作、Expert intervention、Review 时间、accepted outcome 与 recovery。若仍需原 Expert 逐轮 orchestra，预编排并未形成可分发能力。

#### Authority Failure

Agent 尝试 approve、publish、external transmit 或修改 approved state 时必须 fail closed；具备适用 Authority 的 Reviewer 才能提交相应 decision。

#### Context Hygiene

被驳回、撤回、过期或 superseded 的 Candidate 不进入下一次优先 Context；必要时仍可从 Raw History 检索和审计。

#### Plugin Unload / Reload

卸载和重新加载 Extension 后，Matter 的正式状态不丢失；Runtime effect 可以清理，canonical work state 不随插件生命周期消失。

#### Upstream Upgrade

升级 DSH commit 后运行：

```text
adapter compiles
required services resolve
event ordering remains acceptable
permission guard remains fail-closed
HITL answer maps to the same typed decision
surface actions produce the same committed consequence
Matter schema remains readable
E2E accepted outcome remains comparable
```

升级只迫使 adapter 修改，说明分层成立；若迫使 Work Contract、accepted-work-product 标准或既有 Matter State 改写，说明存在 Runtime contamination。

---

## 九、明确的非目标与风险

### 9.1 非目标

本文不主张：

- 先建立完整领域 ontology 才能使用 Agent；
- 所有专业判断都应变成字段、下拉框或图谱；
- 一个通用页面可以抹平不同领域的 Evidence、Authority 和 Review 语义；
- Matter sidecar 应复制既有 Case Management、EHR、BPM 或专业 SaaS；
- Work Surface 必须由模型运行时生成；
- 所有生产 Revision 都是高质量训练数据；
- DeepSeek Harness 是唯一或永久宿主；
- plugin hot swap 等于 work reliability；
- 一套 Reference Implementation 足以证明横向平台市场成立；
- 每一次成功的 dynamic composition 都应自动编译为 Expert；
- Compiled Expert 代表跨机构、跨时期不变的领域真理，或 fast path 与 frontier path 必然产生相同结果。

### 9.2 主要失败模式

#### Surface Overgeneralization

通用 Kit 在多个领域反复产生大量例外，或字段结构制造错误确信。处理方式是退回较弱表示、保留自由判断，必要时让场景使用专属 renderer。

#### Sidecar Split-Brain

Matter sidecar 与既有 system of record 各自保存一份“已批准成果”。处理方式是为每类正式对象指定唯一 canonical owner，sidecar 只持有 Candidate、Projection、trace 或外部 immutable reference。

#### Expert Intervention Does Not Fall

即使结构化和产品化后，专家仍需以接近原频率逐步驾驶。此时定位应退回 expert augmentation，不能宣称已形成可委派 Extension。

#### Review Surface Becomes Annotation Labor

高频 Review 被迫填写 reason code、scope 与 taxonomy，只为未来训练服务。应遵循 capture first、infer later、promote selectively；规则提升是低频治理动作，不把当前工作变成标注任务。

#### Interface Overfit

收益在 tool rename、field-order randomization、等价协议替换或 UI channel 变化后消失。相应行为属于 Harness specialization 或 interface accident，不应被提升为领域规则。

#### Search Contract Overconstrains

路径先验逐渐退化为固定 workflow，抑制新的有效解法，或把历史上常见的路径误写成专业义务。Search Contract 应允许探索、对照和人工 override，并以 accepted outcome 而不是路径服从度评价。

#### Shorthand Miscompilation

系统把专业短语直接映射为确定动作，忽略 Context 差异，使“太密”“不够稳健”“风险偏高”等表达产生错误修改。专业短语只能产生 Candidate interpretation 与 Candidate action，必须允许 Expert 查看、纠正和限定适用范围。

#### Surface Theater

图谱、Dashboard、Diff 或结构化面提高了可读性，却没有改善来源锚定、漏项发现、Review 时间或 accepted work product。此时它们只是展示层，不应因视觉完整而被误认为治理能力。

#### Feedback Compounds Wrongness

Improver 把高权重但错误、局部或相互冲突的 Reviewer feedback 写入长期 Skill / Contract，导致错误随每次执行复利。必须限制谁可以提出和提升规则，保存来源与 scope，比较 Reviewer disagreement，提供 rollback，并用 held-out outcome 而不是 merge 本身验证改进。

#### Retrieval Is Mistaken for Governance

产品提供 Project memory、chat search 和相关性排序后，就把任何被召回的信息当成当前事实。这样会让旧决定、working assumption 与已驳回候选重新污染 Context。解决方式不是更强 embedding，而是保留 status、version、supersession、Authority 与 Candidate / Committed 边界。

#### Dense Activation Regression

系统声称所有资源和能力都“可用”，实际上把 `anything addressable` 实现成 `everything loaded`。随着 Matter、history、Tool 与 Extension 增长，Context、latency、permission surface 与状态冲突线性膨胀。应以 working-set size、critical omission、irrelevant disclosure、cross-Matter leakage 与 accepted outcome 共同约束 compiler。

#### Capability Misactivation Becomes a Governance Failure

错误激活不只是效果下降，还可能开放错误 Tool、法域、数据范围、Review bypass 或正式写入权。Routing 必须与 deterministic permission、purpose limitation、Authority 和 commit gate 绑定；任何 learned router 只能提出候选 composition。

#### False Success Is Promoted

一次顺利交付、短期 Reviewer 接受或 improver 合并被误当成“模式已成功”，没有考虑风险分层、Reviewer disagreement、慢反馈和 later reversal。Candidate Expert 因而把偶然捷径冻结成主路径。Promotion 必须有明确 observation window、适用范围和 release Authority；无法形成充分证据时保持 frontier / institution-local，而不是自动上移。

#### Precompiled Profile Ossifies Practice

AOT Expert 把某位专家、某个工具或旧模型时代的有效路径固化为长期 Contract，阻止新 Runtime 和更优解法。每个 Expert 需要 applicability、version、semantic owner、counterexample、freshness trigger、override、abstention、rollback、deprecation 和 stage-bound recompile；评价标准是 outcome，不是 profile 服从度。

#### Expert Lifecycle Has No Owner

团队不断发布 Experts，却没有人对 dependency drift、policy change、source freshness、reversal、fallback 和 deprecation 负责。Registry 于是从能力资产变成冻结判断的债务。每个 active Expert 必须具有 owner、review cadence 和 suspension authority；无法承担维护成本时，应减少 Expert 数量或缩窄适用范围。

#### Fast Path Conceals Semantic Divergence

把 Compiled Expert 和 Primitive Composer 当成结果等价、速度不同的两条实现，因而忽略 Expert 中已冻结的 retrieval、verification、permission 与 transition 假设。对照运行若持续产生实质性结果差异，应进入 Contract / Expert Review，而不能只作为性能问题处理。

#### Work Primitive Fragmentation

Registry 中 schema、tool、verifier、transition 与 UI pack 由不同团队独立演化，出现语义重复、冲突 Authority、版本组合爆炸和无法解释的 activation。需要明确 package boundary、dependency contract、compatibility matrix 与 canonical semantic owner；插件数量本身不是生态健康指标。

#### MoE Analogy Is Overread

把 learned top-k gating 直接移植为 Matter routing，忽略异构 ontology、temporal validity、provenance、Authority 和正式后果；或者把 MoE 的成功写成 Sparse Work Harness 已被证明。MoE 只提供容量解耦的设计启发，不替 Govern layer、Context Compiler 与 E2E work acceptance 提供证据。

#### Host Churn Dominates

DSH 的破坏性更新使 adapter 维护成本长期高于理念验证收益。此时可以冻结 commit、迁移宿主或把实验降为静态 Reference Runtime；不应为了追随上游而改变 Work Contract。

#### Structure Does Not Improve Work

与 raw context、普通文档或现有 Review 流程相比，结构化 Matter 与 Work Surface 没有改善 accepted work product、Review 时间、恢复、版本一致性、来源锚定或成本。此时应删除相应 Schema 与组件，而不是继续扩大平台。

---

## 十、结论：Sparse Work Harness 把通用能力编译为可分发工作

本实践篇的核心判断可以收束为十一条。

第一，**Matter 可以先作为 Session 之外的本地语义目录与治理状态存在**。它不要求修改通用 Harness core，也不要求先做完整产品层；只要正式状态、active Artifact、Review decision、未完义务和 session references 能够跨 Run 恢复，就已经越过 Session-first 的边界。

第二，**Work Contract 不只编译 Agent execution，也编译 Human Work Surface**。表格、纲要、锚定文档、图谱、时间轴、流程、矩阵、Diff、版本沿革、覆盖和逐条裁决等有限原语，可以形成可声明、可组合的 Work Surface Kit。具体场景声明对象、关系、字段、来源、版本、Authority、Review 与状态后果；复用的是表示与承诺语法，不是抹平专业判断。

第三，**Work Extension 的产品责任是吸收 Agent 复杂度并提高 review bandwidth**。用户不是在管理 Session、Memory、Tool、Plugin 与 Context window，而是在处理 Matter、证据、问题、版本、成果和裁决；专业人士应能直接面对 Artifact，使用自己的工作语言进行 Review，而不必理解实现基底。

第四，**Work Contract 既是评判和提交边界，也可以成为 Search Contract**。它把 expert 的 what to notice、where to search、what to try、how to compare 与 when to abandon 编订为可修订的搜索先验和路由条件，并把专业 shorthand 映射为可审阅的 Candidate action，而不是固定 workflow 或 Prompt trick。

第五，**训练信号正从 codified knowledge，经 software-grounded procedural capability，向 governed situated judgment 延伸**。专家隐性知识首先进入产品环境，Schema 先成为采集协议：稳定干预被编订为 Contract、Work Surface、Context、Validator 与 Runtime；局部偏好留在适用范围内；只有在等价接口、rights 和 held-out Matter 上仍可复现的剩余行为，才成为 Eval、Environment 或 selective post-training 候选。产品飞轮先于模型飞轮，数据规模本身不保证涌现。

第六，**当下生态已经分别出现 Completion governance、feedback compilation、Project-bounded recall、managed-resource surface、architecture-judgment template 与 Runtime composability 的局部实现，但完整整合仍未被证明**。Factory、Warp、Claude / ChatGPT、Andrew Ng 与 DSH / Cordis 为不同承重环节提供方向性证据；Schema Engineering 仍需通过 Govern layer、共享 work semantics、canonical state、Authority、Sparse Context compilation、Commitment 与 accepted-work-product E2E 证明自己的增量。

第七，**Continuity Runtime 可以用 Store → Govern → Retrieve → Compile 表达，但难点集中在 Govern**。数据库和检索不能决定什么是 canonical、谁有 Authority、哪一版生效、何时 supersede；治理规则必须有 owner、scope、version、Review、disagreement 与 rollback，同时以低于收益的成本被维护。

第八，**Sparse Work Harness 使总能力与单次 Attention 解耦**。Shared Core 承载稳定机制，Compiled Expert Registry 承载高频、已验证工作能力，Primitive Registry 服务长尾探索，Matter 保存具体状态，Activation Planner / Context Compiler 生成 executable Run Plan。通用不是全部常驻，而是任何经过治理的能力和状态都可被准确寻址。

第九，**生产激活应分为 Preset、Expert 与 Primitive 三层**。能由 Matter、role 和 stage 确定的工作不需要模型路由；常规歧义只在少量 approved Experts 中选择；开放 primitive composition 留给低置信度、跨域与 frontier 场景，并默认处于 least-privilege、Candidate-only 边界。

第十，**Compiled Expert 是 governed release，而不是成功 trace 的缓存**。它必须具有 provenance、owner、applicability、依赖版本、风险分层 E2E、Reviewer disagreement、freshness trigger、abstention、fallback、rollback 与 deprecation。Expert 是可复用资产，也是可能陈旧的治理责任。

第十一，**Productized work 与 Expert frontier 构成回路，Schema 是其中的隐性知识中间表示**。Compiled Expert 遇到未覆盖事项时应安全退出，升级到 Human / bounded composition，并把 edge case 回流为 Candidate Expert revision；只有稳定、必要、可验证、可维护的路径选择、证据判断、例外、状态转换和升级边界进入 Contract、Surface 与 Eval，跨 Matter 和等价接口仍成立的剩余行为才成为训练候选。

扩大 work penetration surface 不等于增加 Chatbot 用户数，而是同时增加任务族广度、可委派 lifecycle 深度、跨时间连续性、commitment depth 与 outcome observability。只有当这些环境能够产生多样、可归因、具有 later validation / reversal 的 judgment trajectory，并且系统能够在外部反馈和 Authority 边界下检验对自身 Contract、Tool、Environment 与 learning procedure 的修改时，才可以把从 contract-derived learning 走向 governed meta-improvement 视为一条可能路径；它不是本快照的产品承诺。

因此，本文给出的不是一个完整垂直产品方案，而是一种可执行的实践方向：

> **以薄的 Shared Core 承载通用执行，以 Preset / Expert / Primitive 三层 activation 控制能力入口，以 Compiled Work Expert 分发已经验证的工作配置，以 Matter State 与 Context Compiler 提供当前最小充分投影，以 graceful fallback 把未覆盖事项送回 Expert frontier，并由 typed commitment boundary 决定什么可以取得正式效力。专业人士完成的是工作，而不是 Agent engineering。**

这套方向是否成立，不由页面完整度、插件数量或 Demo 流畅度证明，而由以下结果裁决：更换 Session 或模型后工作是否可恢复，候选与正式状态是否分离，专业用户是否无需学习 Agent 技术，专家 Review 时间是否下降，accepted-work-product rate 是否提高，以及新形成的结构化行为记录能否在严格 rights、归因和 held-out Work Eval 下产生真实增量。

---

## 快照冻结说明（2026-08-29）

本篇在此冻结为当前实践与产品快照。它消费了截至本日已经形成的主要判断：

1. Matter continuity 以 `Store → Govern → Retrieve → Compile` 分离 repository、canonical state、retrieval 与 current working set；
2. Human Work Surface 同时服务 inspection、comparison、provenance、Review、correction 与 commitment，不只是 HITL 弹窗；
3. Sparse Work Harness 以 Shared Core、Compiled Expert Registry、Primitive Registry、Matter State 与 Activation Planner / Context Compiler 解耦总能力和单次 Attention；
4. 高频工作采用 `Preset binding → Expert routing`，长尾和发现采用受限 `Primitive composition`；
5. Compiled Expert 是带 provenance、Authority、适用范围、E2E、freshness、fallback 和 rollback 的 governed release；
6. Productized work 与 Expert frontier 通过 abstention、escalation、Candidate revision、revalidation 和 versioned release 形成闭环；
7. Factory、Warp、Andrew Ng、Frontier managed-resource surface 与 DSH / Cordis 只支撑各自局部必要条件，不证明完整架构；
8. Schema 主要作为正常工作副产品中的治理和 capture protocol，不以高频 Expert 标注、模型训练或横向平台市场作为成立前提。
9. 训练信号被分为 codified artifacts、software interaction trajectories 与 governed expert judgment trajectories；远期 meta-improvement 只有在独立 Eval、外部现实反馈、Authority、rollback 与 held-out environment 下才可讨论，不由规模或涌现自动成立。

本快照中的 DSH API、产品表面、案例和市场判断具有日期边界。未来变化应新建 Snapshot 或 Evidence Note；Canonical 只在 commitment、continuity、evaluation 或 falsification boundary 被新证据实质改变时重开。

## 资料与快照来源

本文的理论边界与术语以《Schema Engineering：让工作存在于模型之外》（WorkPaper · Canonical Edition, 2026-08-28）为准。本文仅展开其中 Work Extension、Matter continuity、Human Surface、产品吸收 Agent complexity 与 Post-agentic Refinement 的实践面。

[^dsh-home]: DeepSeek, “DeepSeek Harness developer preview: Everything is a plugin,” https://deepseek.com/harness/en/ （访问与快照日期：2026-08-28）。
[^dsh-readme]: DeepSeek AI, “deepseek-ai/deepseek-harness,” https://github.com/deepseek-ai/deepseek-harness （developer preview；明确提示 compatibility-breaking changes）。
[^dsh-architecture]: DeepSeek Harness Documentation, “DeepSeek Harness Architecture,” https://deepseek-harness.github.io/deepseek-harness/en/reference/ （session events、agent events、capability events、turn flow 与 session log）。
[^dsh-question]: DeepSeek Harness Documentation, “User Interaction,” https://deepseek-harness.github.io/deepseek-harness/en/reference/subsystems/user-questions （provider-neutral question vocabulary 与 presentation intent）。
[^dsh-ui]: DeepSeek Harness Documentation, “Cookbook: extension plugin shapes,” https://deepseek-harness.github.io/deepseek-harness/en/reference/cookbook/extension-cookbook （UI plugin 与 ConversationNodeDefinition）。
[^dsh-agents]: DeepSeek AI, “AGENTS.md,” https://github.com/deepseek-ai/deepseek-harness/blob/master/AGENTS.md （pre-release compatibility stance 与 session format posture）。
[^cordis]: Cordiverse, “A Programming Paradigm for Spatiotemporal Composability,” https://github.com/cordiverse/paper （revertible effects、reactive coeffects、effect tracking、coeffect resolution、configuration reconciliation 与 HMR）。
[^factory-completion]: Factory Research, Theo Luan, “What it Takes for Coding Agents to Complete Large Software Tasks,” https://factory.ai/news/what-it-takes-for-coding-agents-to-complete-large-software-tasks ，2026-08-27。文中结果来自 24 个经选择的 ProgramBench 任务与供应方自建 system / benchmark；本文只将其解释为 Coding 侧 completion governance 的局部证据。
[^warp-improver]: Michael Segner, Anthropic / Claude, “How Warp builds self-improving agents on Claude,” https://claude.com/blog/how-warp-builds-self-improving-agents-on-claude ，2026-08-26。文章描述 Warp 的 base skill、Human feedback、improver skill 与 PR review loop；本文不将 Skill 直接等同于完整 Work Contract。
[^frontier-project-memory]: Anthropic Help Center, “Use Claude’s chat search and memory to build on previous context,” https://support.anthropic.com/en/articles/11817273-using-claude-s-chat-search-and-memory-to-build-on-previous-context ；“How can I create and manage projects?”, https://support.anthropic.com/en/articles/9519177-how-can-i-create-and-manage-projects ；OpenAI Help Center, “Projects in ChatGPT,” https://help.openai.com/en/articles/10169521-projects-in-chatgpt 。截至 2026-08-29，这些官方文档分别描述 RAG chat search、Project-specific memory 与 project-only memory；它们不声称提供本文意义上的 canonical Matter State。

[^openai-managed-resources]: OpenAI, “Memory FAQ,” https://help.openai.com/en/articles/8590148-memory-faq ；“ChatGPT Release Notes,” https://help.openai.com/en/articles/6825453-chatgpt-release-notes ；“Dreaming: Better memory for a more helpful ChatGPT,” https://openai.com/index/chatgpt-memory-dreaming/ 。截至 2026-08-29，官方资料描述 continually updated memory synthesis、project-only memory、Library / Drive references 与 memory sources；本文只据此观察 managed-resource surface，不反推 backend 数据模型。

[^andrew-ng-se-fundamentals]: Andrew Ng / DeepLearning.AI, “The AI Engineering Skills Map In Detail — Software Engineering Fundamentals,” https://www.deeplearning.ai/the-batch/the-ai-engineering-skills-map-in-detail-software-engineering-fundamentals ，2026-08-28。本文只将其作为 execution-to-judgment migration 的结构模板，不把它写成 Schema Engineering 的外部背书。
