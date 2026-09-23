---
Status: Companion Paper · Practice Snapshot
Edition: 2026-09-14
Revision: 9.8 · Generalized Practice Snapshot
Canonical base: 2026-09-14 Canonical Edition
Scope: Sparse Work Harness、Compiled Work Expert、Matter Sidecar、Context governance、Human Work Surface、Work Extension 编订、离线 Eval 与验证。
---

# Schema Engineering 的实践面

## Sparse Work Harness、Matter Continuity 与 Governed Work Surface

## 摘要

Schema Engineering 的实践问题是：如何把通用模型和 Agentic Runtime 已经提供的推理、工具、会话、权限和界面能力，编订为可以恢复、审阅、提交和修订的工作能力。

实践从可复用的持久工作语义出发：沿用既有系统、文档与记录中的对象身份、版本、权限和决定，把它们映射到 Work Contract；用适配层接入可替换的 Agentic Runtime；用 Context Compiler 与 Human Work Surface 生成面向模型和人的不同投影；用 typed commitment boundary 决定什么可以生效。Sparse Work Harness、Compiled Work Expert 与 Matter Sidecar 分别组织能力激活、任务族复用和持续状态，可以随现有设施逐步采用。

---

## 一、实践约束

Agent 参与持续工作需要满足四个约束：

1. Runtime 只提供执行机制，不自动提供工作语义。
2. 总存量与单次 Attention 必须分离，否则长期工作会退化为反复全量重读。
3. 模型、人和多个执行实例只能提出候选变更，不能因为输出完整或意见一致就取得正式效力。
4. 专业用户直接处理工作对象、证据、版本、异议和决定，不学习 Session、Prompt、Tool routing 或 Subagent mechanics。

---

## 二、当前实践边界

### 2.1 Runtime seam 不是 Work Contract

可用的 Agentic Runtime 通常提供 model、tool、sandbox、session、event、storage、permission、question、trace 与 UI extension point。这些能力足以承载 Work Extension，但并不定义：

- 正在处理什么 Matter；
- 什么是当前有效状态；
- 哪些证据支持哪项主张；
- 什么算完成；
- 谁可以接受、批准、发布或承担后果；
- 哪个 Artifact 版本已经生效。

因此适配层只负责把宿主的通用机制绑定到稳定语义，不得成为领域规则的唯一存放地。等价的宿主接口替换不应改变专业含义；否则说明 interface accident 已经污染 Work Contract。

### 2.2 Capability surface 与 governance surface

执行层回答“此次运行能做什么”；治理层回答“什么可以取得什么效力”。

```text
Capability surface
  tools / files / network / models / sessions / UI

Governance surface
  scope / evidence / completion / authority / review / commitment / recovery
```

两者可以实现在同一系统中，但不能用工具调用成功替代工作接受，也不能用宿主已经保存 Session 替代 Matter continuity。

实现应把高折旧的 model protocol、reasoning loop、streaming、generic tool calling 与内部 planner topology 留在可替换执行层，把低折旧的 Matter State、Evidence、Authority、side-effect boundary、validation、commitment、checkpoint 与 recovery 留在治理层。模型变强可以减少 imperative orchestration；它不改变哪些状态有权生效。Work Contract 应优先声明目标状态、不变量、充分 Evidence、禁止转换和 commitment condition，只在执行顺序本身承载专业语义时固定步骤。

### 2.3 完成条件必须外置

长程执行不能以当前 Agent 的自评作为唯一终止条件。最小 Completion Contract 需要把目标分解为可查询义务，为每项义务绑定 evidence procedure、validator 或 Reviewer，并把 continue、stop、return-for-revision 与 escalate 写成独立于 Agent 的 gate。

Gate 只检查已声明的完成条件；专业正确性的其余部分仍由 Evidence、Review 与 accepted work product 检验。

### 2.4 修正必须经编订才能跨 Run 复用

一次修正只能说明某个结果在某个 Matter 和时点下被改变。要进入后续执行，必须区分：

```text
artifact-local edit
matter-specific decision
institution convention
domain invariant
candidate evaluator or training signal
```

只有声明 provenance、scope、owner、review、version、rollback 和后续检验的修改，才能从 Candidate feedback 晋升为可复用规则。可读、可版本化的 instruction 能够成为 policy memory，但只有绑定工作对象、状态、Evidence、Authority 与 outcome 后，才能成为 Work Contract 的一部分。

### 2.5 持久化、检索与正式状态分层

持久内容分别承担原始记录、当前状态和工作规则的责任。Memory 支持保存与召回；Current Semantic State 表达目前有效的事实、决定和开放义务；Schema 规定对象关系、状态含义与可接受的转换，并约束什么应跨 Run 保留。

接入已有工作先确定 canonical owner。业务记录、版本库、文件档案或事项系统继续拥有其正式对象，Agent 通过稳定标识、版本和授权接口读取与提案；Sidecar 只补存尚无归属的义务与关系。保留期限、撤销、来源和审批状态随对象进入投影，避免另建一份由模型记忆维护的权威副本。

稳定语义使不同执行实例能够比较同一工作中的变化。Candidate 应引用对象和依据版本，声明拟改变的内容及前置条件；提交时对当前状态重新验证。Schema 版本变化则先建立明确映射，再解释旧状态与新候选的关系。

Context Projection、Human Work Surface 与 Retrieval Index 是执行、裁决和定位所需的不同视图。它们共同引用正式状态与原始来源，不各自维护事实。Current Semantic State 能承载后续决策所需信息时，可以成为默认执行基底；未编入的 Observation、尚待发现的工作关系及作为研究对象的历史过程，通过 Raw History / Evidence 按需补充。

### 2.6 Context Mutation 是有效果的运行动作

删除、截断、摘要、压缩、折叠和重载会改变模型下一步能够注意、比较和引用的对象。因此 Context Mutation 默认只改变 Run-local working set，不改变 Repository、Current Semantic State 或 Active Artifact。

可恢复的 mutation 至少记录：

```text
source object or span
+ previous projection
+ proposed mutation and reason
+ scope and lifetime
+ resulting projection
+ recovery path
+ downstream outcome
```

对 Context 操作给予更细的 credit 可以产生 Eval 或训练候选，但局部任务得分不能回答被保留的内容是否具有正式效力。

### 2.7 Multi-agent 是执行拓扑，Expert 是能力语义

多个 Agent instance 表示存在多个执行位置，它们可以并行、委派、竞争、审阅或汇总。Compiled Expert 则表示对某个任务族已声明、验证并收窄权限的能力配置。

```text
Run Plan
= Compiled Expert Profile
+ current Matter State
+ role and stage
+ current Authority
+ Context Projection
```

多个 Agent 可以共用同一 Expert，一个流程也可以在不同阶段绑定不同 Expert。模型数量、Session 数量、终端数量或角色名称都不能代替 Expert 的 applicability、permission、Eval、fallback 和 release evidence。多个实例的意见一致也不等于独立证据或 Authority。

默认 coordination surface 应是带 identity、version、status、provenance 与写入规则的 governed artifact，而不是高频 Agent-to-Agent conversation。可独立拆分的执行在隔离 branch 中产生 bounded Candidate，再由明确的 comparison、merge、discard 或 Review transition 汇合；只有沟通本身会产生必要信息时才增加消息边。状态介导不能消除并发冲突，因此 shared writes 仍需 owner、base version、conflict handling 与 commitment gate。

### 2.8 文档是工作表面，不是自动成立的记忆

文档可以同时承载执行规格、来源与理由、Review surface、recovery index 和 accepted artifact。这些职责不得因共用同一文件形式而混同：

| 对象 | 默认地位 | 可否直接改变正式状态 |
|---|---|---|
| Session / Tool Trace | Raw History / Evidence | 否 |
| 自动摘要或索引 | Retrieval aid / Candidate Projection | 否 |
| Contract / Decision Record | 取决于 version 与 Authority | 只在提交后 |
| 测试与审阅报告 | Evidence / Review Record | 不单独决定 |
| 已接受文档成果 | Active Artifact | 经 commitment 后可以 |

完整保留原始记录有助于回溯，生成索引有助于恢复；二者都不取代 Current Semantic State。

## 三、参考架构：Sparse Work Harness

### 3.1 分层

```text
Person / Organization / Downstream Work
        ↕
Human Work Surface
        review / revision / decision / work-state projection
        ↕
Sparse Work Harness ↔ Matter Sidecar or Existing System of Record
        Expert / Primitive Registry / Activation Planner / Context Compiler
        Work Contract / Candidates / Evidence / Authority / Committed State
        ↕
Host Adapter
        run control / capability negotiation / event mapping / context handoff
        ↕
Provider-managed Runtime or Thin Runtime
        model invocation / loop / tool dispatch / execution persistence
        ↕
Native API / Structured Browser Interaction / Computer Use
```

分层围绕工作语义与执行机制的变化速度组织。Work Contract、Matter State 和 Expert manifest 保存工作对象、证据、权限与接受条件；Host Adapter 将本次 Assignment 绑定到宿主能力，翻译运行控制与事件；Human Work Surface 把候选差异与决定后果交给人。执行事件提供过程证据，正式状态仍由提交路径更新。

Runtime 兼容以当前 Contract 所需能力为准。Adapter 声明可用的控制时点、Context 管理、历史访问、恢复、授权拦截与效果核对能力，再选择原生实现、经验证的替代路径或收窄后的任务。该绑定覆盖执行时实际进入的材料和可产生的效果，包括宿主自行召回的历史；无法满足必要边界的任务不予执行。宿主可以保留自身的调度、压缩与并发机制；跨 Run 必须保留的工作事实则进入 Matter State。上层由此共享工作语义，下层按各自能力执行。

执行层可以消费 provider-managed Runtime，也可以封装私有模型所需的薄 Runtime。薄实现从模型调用、受限工具分发、事件记录与续行开始，依赖上层的状态、Context 和审批契约。自治长度、并发规模和失败恢复决定需要多少执行设施；短反馈循环与明确的人类裁决节点可以减少自主调度的负担。

API、结构化浏览器交互与 Computer Use 是访问外部系统的不同通道。选择取决于任务要求的授权、前置条件和结果核对能力，以及运行与维护成本。效果未知时先核对再续行；高频或需要更强控制的操作可编订为 Work Primitive。观察到的 trace 为这一编订提供材料，发布仍须经过权限约束与验证。

通用执行、存储、检索和界面组件可以复用成熟实现。SE 的实现工作集中于把它们接成同一条语义链：从正式状态生成有边界的工作视图，让执行交回可审阅的候选，再把被接受的变化写回唯一权威状态。

### 3.2 七个对象

| 对象 | 逻辑职责 |
|---|---|
| Runtime Plugin | 通用技术能力 |
| Runtime Profile | 一组技术运行环境 |
| Work Primitive | 最小可组合工作能力 |
| Work Extension | 面向宿主分发的领域语义和实现 |
| Compiled Work Expert | 对高频任务族已版本化、评测和收窄权限的 activation profile |
| Matter State | 一项具体工作的持久化工作包，包含 Current Semantic State、版本、Evidence、决定与未完义务 |
| Run Plan | Expert / primitives 与 Matter、role、stage 的一次绑定 |

Compiled Work Expert 的最小单元是：

```text
schema
+ tools
+ retrieval policy
+ validators and evaluators
+ permissions
+ Human Work Surface
+ transition and escalation rules
+ applicability and exclusions
+ E2E release evidence
```

### 3.3 五个承重组件

Sparse Work Harness 至少需要：

1. **Activation Planner**：根据 Matter type、role、stage 和 policy 选择 preset、Expert 或受限 primitive composition。
2. **Context Compiler**：从 Stable Contract、Current Semantic State、Resources 与 History 生成最小充分工作集。
3. **Expert / Primitive Registry**：保存版本、依赖、适用范围、权限、验证时间和退出路径。
4. **Matter binding**：将本次执行绑定到唯一工作对象、当前版本与开放义务。
5. **Commitment interface**：将 Candidate Output 路由给 Schema、Evidence、Completion、Authority 和 Review。

### 3.4 三层 activation

```text
Preset binding
→ Expert routing
→ bounded Primitive composition
```

Matter type、role 和 stage 已能确定的工作使用 Preset；常规歧义只在少量 approved Experts 中选择；没有适用 Expert、跨域或低置信度时，才进入 primitive composition。最后一层默认 least-privilege 且 Candidate-only，不自动取得 approve、publish、external transmit 或 irreversible authority。

Activation lifetime 按 `organization → role → matter → stage → run` 分层。越稳定的左侧内容越适合预编译，越靠近当前 Run 的内容越适合动态投影；Matter 或 stage 内的 tool definitions、Contract prefix、permissions 与 Surface 保持稳定，只有 Current Semantic State 与 Evidence disclosure 随 Run 变化。

### 3.5 Compiled Expert 的发布与折旧

```text
frontier execution or expert intervention
→ Candidate Expert Profile
→ applicability / exclusions / provenance
→ Contract and dependency versions
→ held-out E2E and risk-stratified Review
→ release Authority
→ Committed Expert Version
→ outcome / disagreement / reversal / drift monitoring
→ revalidate / narrow / rollback / deprecate
```

成功 trace 不是 Expert。每个版本至少具有 owner、applicability、exclusions、provenance、dependency versions、risk-stratified E2E、freshness trigger、abstention、fallback、rollback 和 deprecation path。法规、来源、机构政策、工具、模型、任务分布或 Reviewer outcome 变化都可以触发重验证。

未覆盖事项必须安全退出：

```text
unsupported case
→ abstain or request Review
→ Human expert or bounded composition
→ preserve Candidate-only boundary
→ capture intervention and outcome
→ Candidate revision
→ E2E revalidation and release
```

---

## 四、Matter Sidecar 与 Context Compiler

### 4.1 两种数据层

Matter 可以首先实现为现有 Session 和 system of record 之外的薄层，即 Matter Sidecar，对应 Overlay / Sidecar 部署形态；既有系统不必一开始就被替换。

```text
Canonical Semantic Layer
  committed events
  current semantic state
  active artifact references
  authority and review decisions
  open obligations

Rebuildable Index Layer
  full-text and vector indexes
  session and source locators
  graph and projection caches
  retrieval ranking
```

索引可以重建；哪个成果已被接受、哪项候选被驳回、谁作出何种裁决以及什么仍未完成，不能靠重新摘要 Transcript 猜回。语义层可以由事件溯源实现，也可以沿用既有 system of record 的事务状态、版本与提交记录；恢复读取指定的权威状态。

### 4.2 最小 Matter 声明

```json
{
  "matter_id": "matter-001",
  "extension_id": "evidence-memo",
  "contract_version": "0.1.0",
  "status": "awaiting_review",
  "active_artifact": "memo:v3",
  "session_refs": ["session-a", "session-b"],
  "open_obligations": ["verify-source-7"],
  "pending_reviews": ["review-12"]
}
```

一个 Matter 可以关联多个 Session。删除 Session、替换模型或宿主升级不应同时删除 active Artifact、Current Semantic State 和未完义务。

Session 只是当前交互与 attention window，Run / executor 是一次可丢弃的执行尝试。恢复测试必须证明新 executor 能从 canonical state、active Artifact、Evidence、开放义务与 checkpoint 继续工作，而不是依赖旧 sandbox、旧模型的主观连续性或完整 transcript replay。

### 4.3 Store → Govern → Retrieve → Compile

```text
Store
  Sources / Events / Artifacts / Raw History / Current Semantic State
→ Govern
  identity / status / version / provenance / authority / scope / expiry
→ Retrieve
  relevant objects within the authorized scope
→ Compile
  Context Projection / Human Work Surface / Retrieval Index / Run Plan
```

实现从本次 Assignment 的接收者、用途、任务阶段和状态版本出发确定可用范围，再定位完成当前义务所需的对象及关系。查询、索引和缓存可以分担这些操作，授权规则在数据进入对应 Runtime、工具或用户界面前执行。相关性排序只在允许使用的材料中决定优先次序。

Schema 与检索分担不同工作。Schema 声明对象身份、关系、状态、效力与使用条件；关键词检索定位术语、编号和原文，向量检索寻找语义近邻，关系遍历补齐依赖与沿革。混合检索可以组合这些候选，再依据任务重排；metadata filter 执行已声明的范围与版本条件。检索结果携带身份、版本、来源和效力标记，进入 Context 时仍保留候选、历史与当前状态的区别。相关性得分不授予事实效力，Schema 也不穷尽尚待发现的内容。

Compiler 按任务组织工作集。路由可以使用事项类别与开放义务，执行需要相关事实、Evidence 与当前版本，Review 需要候选差异、判据和未解冲突。每种视图保留其判断依赖的限定与来源；不足以支持下一步时，补取授权材料或返回缺口。Context 预算决定表示规模，不能把尚未覆盖的义务编译成完成。

视图的来源版本、规则版本和适用范围随生成结果保存。对象变化或权限失效后，复用路径重新判断其适用性；依赖私有材料的摘要和工具参数沿用相应披露约束，不能因换了表示或操作通道而扩大接收范围。传递由执行边界实施控制，不能只交给 Prompt 中的保密要求。

本次执行产生带对象、版本和前置条件的 Candidate，由提交路径判断哪些内容可以写回正式状态。外部操作先通过授权与前置条件检查，完成后将结果证据与相应候选关联；结果未知时保留待核对状态。新 Run 从有效状态和开放义务续行。

Artifact State 与 Evidence State 分别回答“当前对象是什么”与“哪些行为已经验证、哪些主张仍无支持”。每轮工作同时携带可继续修改的 Artifact 与绑定具体版本的验证记录，原始材料和历史行动保持可检索。中间 reasoning 可以退出下一轮 Context，工作连续性由正式状态、Evidence 和恢复路径承接。

## 五、Human Work Surface

### 5.1 三种投影

```text
Current Semantic State + Sources / Evidence + Candidates
├── Context Projection
│   compact / normalized / executable
├── Human Work Surface
│   inspect / compare / trace / revise / decide
└── Retrieval Index
    identify / version / locate / disclose later
```

人需要看到原文锚点、来源关系、版本差异、未解冲突、覆盖缺口与裁决后果。模型需要紧凑、规范化、符合当前权限和任务阶段的工作集。未来 Runtime 需要按 Matter、状态、版本、适用范围和 provenance 重新定位对象。三者以同一权威状态解释来源与候选，保留各自的版本和效力，不必共用同一表示。

### 5.2 表示原语

| 原语 | 主要任务 |
|---|---|
| List / Table | 扫描、筛选、分类、逐项裁决 |
| Tree / Outline | 层级、范围与覆盖 |
| Anchored Document | 返回原文并局部校验 |
| Graph | 多对象与多关系 |
| Timeline | 先后、生效、变化与冲突 |
| State Graph | 步骤、责任、阻塞与转换 |
| Matrix | 两维覆盖、对应与冲突 |
| Diff / Lineage | 版本、候选、覆盖与撤回 |
| Queue / Coverage | 待处理对象、缺口与完成度 |

这些原语是 renderer grammar；哪些节点、关系、字段、动作和权限合法，由 Work Contract 决定。

### 5.3 Review grammar

```text
Review Item
= Target
+ Anchors
+ Current Semantic State and Candidate Delta
+ Judgment Dimensions
+ Evidence
+ Automated Checks
+ Uncertainty and Open Questions
+ Commit Consequence and Reversibility
+ Decision
+ Authority
+ State Consequence
```

Review 围绕有状态后果的 decision unit 分批编译。默认表面只放形成独立判断所需的最小充分对象；Raw Trace、旧版本和补充 Evidence 保持可检索并按需展开。逐项 tool-call confirmation 和事后 chronology replay 都不能替代对 Candidate delta 的专业裁决。

主交互应使 `Current → Proposed → Reviewed → Committed` 的状态差异可见，并同时呈现 prior state、Evidence、uncertainty、Authority、side effect、reversibility 与 recovery point。模型的内部计划、Agent avatar、Agent 间聊天和 workflow graph 只在帮助诊断或裁决时渐进披露；用户审阅的对象是工作变化及其后果。

可复用的动作族包括 accept、reject、revise、request further work、request evidence、qualify、defer、waive、escalate、approve、publish、supersede 和 withdraw。动作名称不产生复用性；只有以下链路可复用：

```text
decision
→ authority requirement
→ validation
→ committed event type
→ semantic-state transition
→ artifact-version effect
→ next-context effect
```

### 5.4 文档与界面的晋升边界

HTML、Markdown、表格或图形只是 Human Work Surface 的表示。界面中的按钮、评论或勾选只有在生成 typed Candidate Decision，并经 Authority 与 validation 写入 Committed Event 时，才更新 Current Semantic State 或 active Artifact reference。

```text
Model proposes Candidate
→ deterministic Renderer builds surface
→ Human reviews or revises
→ typed Candidate Decision
→ Authority and validation
→ Committed Event
→ State and active Artifact update
```

---

## 六、Work Extension 与隐性知识编订

### 6.1 产品吸收 Agent 复杂度

| Runtime 对象 | 专业用户面对的工作语义 |
|---|---|
| Session | Matter 中的一次执行 |
| Memory | 可召回信息、来源与适用范围 |
| Tool permission | 某项资源或行动权限 |
| Agent / Subagent | 执行位置；Operator 绑定运行义务，Lane 表达并行关系 |
| Output | Candidate Change：Candidate State Change 或 Candidate Artifact Version |
| Approval | 具有状态后果的专业裁决 |
| Plugin / Skill | Work Extension / Primitive / Expert dependency |

默认交互以专业对象和工作决定为中心；技术对象在诊断需要时渐进披露。

### 6.2 从观察到 Contract

```text
expert demonstration
→ intervention and correction capture
→ separate invariant / institution / matter / habit / judgment
→ compile Contract / validator / surface / escalation
→ E2E without the original author
→ production review and revision
```

隐性知识首先表现为对任务、来源、Context、工具、失败、重试、完成和交付的手动控制。编订只抽取跨时间必须保留、会改变后续行动、支持 Review 或能被验证的部分，不序列化专家的全部认知过程。

### 6.3 分流

| 内容 | 去向 |
|---|---|
| 稳定义务、来源层级、必查项 | Domain Contract / Evaluator |
| 机构审批、格式、风险偏好 | Versioned institution configuration |
| 特定客户、Matter 和时点要求 | Matter context |
| 个人表达、捷径与工具偏好 | User preference，默认不推广 |
| 风险接受、策略与重大例外 | Human Review / Accountable Decision |

出现频率不能把个人习惯提升为机构规则，也不能把机构规则写成领域真理。

### 6.4 Search Contract

Review Contract 限定什么可以被接受；Search Contract 限定 Agent 应进入哪个 solution space。它可以规定先查哪类来源、什么冲突必须保留、哪些捷径禁止、何时扩大搜索、何时收敛、何时放弃并升级。

Search Contract 不能把候选空间收窄到只能复制旧答案。它的作用是保留专业搜索中稳定且可审阅的约束，并为超出声明边界的问题保留 frontier path。

### 6.5 Runtime 外的评测与改进

Runtime 内的检查决定本次候选能否继续或提交；Runtime 外的 Eval 比较不同版本如何完成同类工作，为下一次修订提供证据。两者可以共用执行设施与判据，但评测分数不授予工作效力。离线评测的产物是关于系统行为的证据与修订候选，正式成果和新版本仍分别经过自己的接受与发布边界。

```text
产品问题与工作要求
→ 可解释的局部信号
→ 跨任务、跨版本的评测
→ 沿 Evidence / State / Projection / Artifact 定位失败
→ Contract / Evaluator / Harness / Context / Tool / Model 修订候选
→ 重新评测与版本裁决
→ 后续工作中的反馈
```

局部信号把笼统的质量感受变成可以追查的问题。Work Contract 则为追查提供坐标：哪些义务尚未处理，来源支持什么，哪些关系进入了持久状态，又在何处未被披露或被错误使用。Schema 提供指认缺口的坐标；未记录的信息和失败的原因仍需另行发现。

符合既有 Contract 与 Contract 足以表达工作要求，是两个不同判断。前者检查执行与成果，后者允许真实工作中的遗漏、分歧和后果反过来修订判据。Eval 因而既约束系统如何执行，也帮助团队判断系统原本要求它做的事是否恰当。

### 6.6 从产品信号到训练候选

```text
codified artifacts
→ software-grounded interaction trajectories
→ governed situated judgment trajectories
```

第三类信号至少需要 Matter、State、Evidence、Candidate / Committed、Review、Authority、Outcome 与 later reversal。这些对象首先服务运行、恢复和 Eval；只有在 rights、failure attribution、held-out Work Eval 和外部现实反馈成立时，才成为 selective post-training 候选。

---

## 七、失败模式

| 失败 | 判定 |
|---|---|
| Sidecar split-brain | Matter State 与 system of record 同时声称权威，却无明确 owner 和 reconciliation |
| Retrieval mistaken for governance | 语义相近的旧内容被当作当前有效状态 |
| Context optimization destroys evidence | 压缩降低 token，同时丢失限定、否定、冲突或坐标 |
| Surface theater | 界面更结构化，动作却没有 Authority 和状态后果 |
| Formal HITL | 人被放进 loop，却没有足够 Evidence、时间或状态差异形成独立判断 |
| Projection split-brain | Context Projection、Human Work Surface 与 Retrieval Index 对同一 Matter 持有不同事实或版本 |
| Evaluator drift without governance | rubric 或 reason 改变生产行为，却没有版本、Review、monitoring 与 rollback |
| Correlated consensus | 多个实例共享错误前提和 Evaluator，共识被误当独立校验 |
| Chatter topology | Agent 间消息成为事实源，缺少版本、冲突处理与 commitment boundary |
| Executor-bound work | 新 Session 或 executor 无法从 governed Matter State 恢复，必须依赖旧 sandbox 或 transcript |
| Imperative ossification | Runtime 已能安全选择执行路径，Contract 仍冻结不必要的 planner / worker / reviewer 步骤 |
| Agent theater | UI 强调内部计划、头像和聊天，却弱化 Candidate delta、Evidence、Authority 与 commit 后果 |
| Dense activation regression | 能力与数据总量增长时，每次 Run 的 Context 和权限表面同比增长 |
| Expert ossification | 旧来源、规则、工具或偏好因快速路径而持续生效 |
| False promotion | 成功 trace 在无适用范围、反例、Authority 和 held-out E2E 时晋升为 Expert |
| Annotation displacement | 结构化主要依赖专家额外填表，成本与使用量同比增长 |
| Interface overfit | 语义等价的宿主变更仍使专业语义或成果质量变化 |
| Structure without outcome | 结构增多，accepted-work-product、Review、恢复、缺口发现和成本均无改善 |

---

## 八、结论

这些责任可以组合为以下参考结构：

```text
thin shared runtime
+ host adapter
+ Preset / Expert / Primitive activation
+ Matter State
+ Context Compiler
+ Human Work Surface
+ typed commitment boundary
+ E2E and lifecycle governance
```

这一结构把总能力、总知识与单次 Attention 分离，把执行拓扑与 Expert 语义分离，把原始记录、索引、当前状态与正式成果分离，并使 Context 的每次重写和 Output 的每次写回都可被检查。

工作积累在可恢复、可审阅和可更新的对象中。新的执行实例读取当前有效状态与开放义务，提出增量变化，由确定性检查、Evaluator 和有权裁决的人使其取得效力。Agent 与 Runtime 可以替换，工作从已有成果继续。
