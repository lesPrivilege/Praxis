---
Status: WorkPaper · Canonical
Edition: 2026-09-14
Revision: Canonical Edition · 9.8 Publication Revision
Scope: 从通用模型与 Agentic Runtime 的能力边界，到 Work Extension、正式工作、Context / Output 治理、Work Eval 与 Post-agentic Refinement 的分层方法、架构边界与证据纪律。
---

# Schema Engineering：让工作存在于模型之外

## 从通用能力到可提交工作的弱编译、工作编纂与分层治理方法

## 摘要

概率模型已经能够搜索、比较、解释、起草和调用工具，却不能仅凭一次输出取得正式工作所需的事实效力、行动权限、完成状态和责任归属。一次 Run 会结束，模型会替换，上下文会压缩；Matter、Artifact、Review decision、未完义务与适用边界仍然必须继续存在。正式工作不能与一次生成同时出现或消失。

专业 Agent 的第二项瓶颈在模型能力之外。行业头部专家可以借助 frontier Agent 亲手跑通高质量 Demo，但 Demo 往往依赖一层未被记录的 Human Harness：专家选择任务和材料、识别遗漏、调整搜索与上下文、修复失败，并判断什么可以交付。原作者离场后，这些能力常常随之消失。

Schema Engineering 是一种面向 Agent 的弱编译（weak compilation）与工作编纂方法。它不是把工作简化成字段表，而是把专家在真实工作中演示出来的隐性义务、状态、权限、证据、完成标准与裁决边界编订为可版本化、可执行、可验证、可恢复的 Work Contract，并以同一套 Schema 治理 Sources、Events、State 与 Artifacts 之间的来源、版本和演化关系。Work Contract 据此约束模型与工具如何参与工作，规定候选结果如何通过 Evidence、Completion、Authority 与 Review 进入正式状态，并把生产中的 Revision 与 Failure 转化为 Eval、Environment 和后续系统改进的语义基础。

Schema Engineering 是 Agent 参与有后果工作时的编纂与承诺治理方法。Professional Work Runtime 是这套 Kernel 在高责任、高语义密度场景中的完整 profile；通用 Infra primitive、宿主可加载的 Work Extension、既有系统中的 embedded capability、sidecar、垂直产品与组织运行协议，都可以成为实现形态。产品负责把通用治理原语编译为具体人群认识的工作对象，组织负责提供最终 Authority、Accountability 与成果接受。

这一方法同时治理 Run 的两端。输入侧把 Stable Contract、Current Semantic State、相关资源与可检索历史投影为 task-specific Context；输出侧把 Model / Human Proposal 视为 Candidate Change，只有经过验证、授权和适用的 Review，才能写入 Committed Event 并更新 Current Semantic State。单次输出质量因此不等于跨时间工作的质量；只要 output 会成为后续工作的 input，运行之后“留下什么、失效什么、下一次优先看什么”就是系统能力的一部分。

当工作需要跨 Run 继续存在时，输入侧还可以被压缩为一条运行管线：`Store → Govern → Retrieve → Compile`。Store 保存 Sources、Events、Artifact versions、Raw History 与正式状态；Govern 通过 Work Contract、commit protocol、status、version、Authority 与 applicability 使这些对象具有可选择的语义；Retrieve 返回潜在相关对象；Compile 才为当前 Assignment、role 与 task stage 生成最小充分的 Context Projection、Human Work Surface 与 Retrieval Index。这条管线是既有 ontology 的运行投影。存在于 Matter 中的信息不等于必须存在于当前模型 Context；Work Contract 也不是一份更大的 system prompt。

这条管线同时解耦总工作容量与单次 Attention 成本。Matter、历史、机构知识和可用能力可以持续增长，一次 Run 激活的 working set 不应随总存量线性增长。通用 Agent 的含义因而不是 `everything loaded`，而是 `anything governed is addressable`：它能够进入不同工作空间，并可靠取得当前任务所需的最小充分 Projection。

对于高频、边界稳定的任务族，这种投影可以进一步发布为 **Compiled Work Expert**：一份经过版本化、E2E 验证和权限收敛的激活配置。Routine work 优先由机构 policy 或少量 Expert routing 选择这类配置；只有未覆盖、跨域或低置信度任务才退回受限的 primitive composition。Compiled Expert 是 Agent Extension 的发布投影。

这一方法完整覆盖三条互相嵌套、不能混写的链：

```text
A. Expert Demonstration
→ Invisible Human Harness Extraction
→ Work Contract
→ Agent Extension
→ E2E Acceptance

B. Stable Contract / Current Semantic State / Resources
→ Context Projection
→ Model / Human Proposal
→ Candidate State Change / Candidate Artifact Version
→ Validation / Evidence / Authority / Review
→ Committed Change
→ Updated Current Semantic State / Active Artifact

C. Production Use / Review / Revision / Failure
→ Failure Attribution
→ Eval / Environment / Regression
→ Contract / Evaluator / Harness / Context / Tool Refinement
→ Selective Model Post-training, only when justified
```

第一条把 Expert Demonstration 编订为自带 Validator、Evaluator、Review boundary 和 E2E release suite 的 Agent Extension；第二条把 Current Semantic State 投影为有限 Context，再把概率性 Proposal 经 typed commitment interface 写为 Committed Change；第三条在 Extension 进入生产后，把失败先归因到 Contract、Evaluator、Context、Tool、Harness、Model 或机构分歧，再决定改进对象。模型提出并执行，确定性系统维护不变量，Evaluator 测量已明确规定的语义，人承担不可约的专业判断。

横向三条工作链之外，系统还具有一条不能混写的纵向分层：

```text
Model Capability Layer
→ Agentic Runtime / Harness
→ Work Extension
→ Commitment Boundary / System of Record
→ Person / Organization / Downstream Work
```

上游扩展 reasoning、knowledge、tool use 与执行边界；下游把通用能力收敛为带有领域语义、HITL、Review 和 accepted-work-product 标准的工作渗透面。每层拥有自己的 Contract、Eval、长期资产和改进周期，不能借用相邻层的成功证明自身正确。

研究、工程、法律、财务、医疗、咨询与持续运营围绕不同对象工作，共同面对来源、权限、版本、审阅和责任。一次性的高后果行动需要 commitment governance；跨时间、具有状态、又缺乏廉价稳定 verifier 的工作进一步需要 Matter、continuity 与 Context Projection。各领域可以共享 Runtime primitives，不能因此省略各自的专业语义。

## 第一部　弱编译与正式工作

Schema Engineering Kernel 同时处理两项不可约转换：专家亲自跑通的 practice 如何成为可转移的 Agent capability，以及概率性 proposal 如何取得可问责的 work commitment。Runtime 对象、Contracts、Agent Extension 和 E2E 都服务于这两项转换。

### 1. 概率性提议与组织承诺

模型输出首先是一项提议。提议可以并列、撤回、试探和互相矛盾；组织承诺必须回答范围、依据、版本、责任与后果。语言再流畅，也不能自动把提议变成组织承诺。

一份合同审查意见可以写得完整，却仍然缺少原文坐标、适用版本、风险接受人和批准状态；一份研究报告可以列出大量来源，却没有说明哪些主张已经被采纳、哪些结论还需要复核；一个工具调用可以在技术上成功，却不一定取得业务权限。输出质量与工作效力属于不同对象。

模型也不能同时负责执行、定义事实来源、设定完成标准和作最终裁决。四项责任合一时，系统无法区分“模型认为已经完成”和“组织已经接受成果”，也无法在模型替换、任务恢复或责任追溯时重建正式状态。

> **P6 — 模型提出；确定性系统执行不变量；Evaluator 测量已经明确规定的语义；人裁决不可约的专业判断。**

专业正确性通常没有一个廉价、完整的布尔判定器（Boolean oracle）。字段结构、权限、版本、引用坐标、算术和明确覆盖范围可以由系统检查；重要性、策略、风险接受、例外和责任仍需专业判断。混合裁决保留了这一区分。

工作的正式状态因此位于模型之外。模型可以进入和退出执行，组织承诺却不能随一次输出出现或消失。

### 2. Schema Engineering 与 Work Contract

> **Schema Engineering 是一种面向 Agent 的弱编译与工作编纂方法：它把专家在真实工作中演示出来的隐性义务、状态、权限、证据、完成标准与裁决边界编订为可版本化、可执行、可验证、可恢复的 Work Contract，以同一套 Schema 治理工作对象（工作需要继续存在时即 Matter）中 Sources、Events、State 与 Artifacts 的关系，并据此发布可通过端到端验收、能够在生产 Review 中继续改进的 Agent Extension。**

它完成两项不同的转换：

```text
Expert practice → transferable Agent capability
Probabilistic proposal → accountable work commitment
```

前者解决“专家亲自跑通的 Demo 如何成为其他人可用的能力”；后者解决“模型输出凭什么改变正式状态”。只写后者，Schema Engineering 会退化为 Work Commitment Runtime；只写前者，它会退化为专家 workflow 产品化。两项转换共同发生在一条持续的 Context / State 循环中：正式状态被投影给一次执行，一次执行的结果再经过窄化提交改变正式状态。

持久工作语义已经存在于软件仓库、业务记录、档案目录、审批制度和专业文书中：对象有身份，材料有版本，决定有权限，记录有来源与保留期限。Agent 接入这些工作时，应沿用其权威关系，把分散在系统、文档和人员判断中的语义编订为可消费的 Work Contract。Schema Engineering 连接这份积累与概率执行：已有状态决定本次执行的起点，专家干预补出委派所需的边界，新的候选经裁决成为下一次工作的基础。

它的最小操作不是“给工作加上结构”，而是建立一条 typed commitment interface，即 Commitment Boundary。模型和人都可以提出变化，但不能直接改写正式状态：

```text
Stable Contract + Current Semantic State + selected Resources / History
→ Context Projection
→ Model / Human Proposal
→ Candidate State Change
→ Candidate Artifact Version, when applicable
→ Schema Validation
→ Evidence Check
→ Authority Check
→ Completion / Review Routing
→ Committed Event
→ Atomic Projection: Current Semantic State + Active Artifact Reference
→ New Context Projection
```

输入端把现实工作编排为本次执行可用的 Context；输出端把概率性结果编排为可提交、可拒收、可审阅的 Candidate Change，即 Candidate State Change 及适用时的 Candidate Artifact Version。Runtime 不执行专家全部思维，只执行一项提议进入正式工作需要满足的条件。必要边界是候选、正式检查与可追溯提交；上图以事件记录和状态投影表达它，也可以由既有系统的事务、版本和审批记录承载。领域建模、workflow、结构化输出或 memory summarization 本身不建立这条边界。

#### 2.1 Work Contract 的四重角色

Work Contract 是整套方法的枢纽，但不是完整的专业知识库、全部程序或 Boolean oracle。它同时承担四项逻辑责任：

1. **执行规格**：规定任务族、目标状态、输入资源与目的限制、交付物与受众、不变量、工具与 Authority、Evidence、Completion、Review、Escalation，以及中断和恢复所需保留的状态。它声明有效工作和有效转换必须满足什么，不要求冻结 Runtime 能自行选择的每一步执行路径。
2. **结果与提交校验器**：为 schema validation、deterministic validator、evidence check、completion ledger、authority check、evaluator rubric、review routing 与 accepted-work-product 判据提供语义来源。它决定哪些结果可以被机器拒收，哪些需要人裁决，哪些可以取得正式效力；它不保证专业结论必然正确。
3. **状态与 Context 编纂器**：规定哪些事实、决定、Artifact 与未完义务应当持久化，哪些信息具有时效或适用范围，哪些旧状态应被 supersede，哪些内容需要 Human confirmation，以及下一次 Run 优先披露什么。它同时治理 input 和 output，而不只帮助模型生成一次结果。
4. **Post-agentic Refinement 目标**：为失败归因、regression、Eval 与 Environment 提供稳定参照，使团队能区分“模型错了”与“产品没有定义清楚”，再决定应该修改 Contract、Validator、Evaluator、Context、Tool、Harness 还是模型权重。

Work Contract 不一定是一份单文件。它可以编译或投影为：

```text
state schema
+ artifact schema
+ evidence requirements
+ completion obligations
+ authority policy
+ review / escalation policy
+ context and resource policy
+ persistence / expiry / supersession policy
+ validators
+ evaluators
+ E2E and Work Eval cases
+ version / compatibility metadata
```

这些对象可以在同一系统中物理合并；逻辑责任必须清楚，物理服务不必拆散。

#### 2.2 为什么是“弱编译”

这一编译不包含完整形式验证，也不要求把专家知识全部写成规则。它是弱编译，因为 source 主要来自不完整的 demonstration、revision、accept / reject 与隐形人工补位；专业正确性通常没有廉价且完整的 Boolean oracle；target 是确定性系统、Evaluator、Agent 与人共同组成的混合 Runtime；部分语义只能表示为 Review、Escalation 或 Accountable Decision，不能被自动裁决。

因此，弱编译只把可靠委派需要的边界变成显式对象，显式化“判断的后果与工作边界”，不显式化“判断的全部心理过程”：

- 正在处理什么事项；
- 谁承担运行义务，谁承担最终问责；
- 可以读取、修改、批准和发布什么；
- 哪些主张需要来源；
- 当前已经知道、决定和遗漏什么；
- 什么条件才算完成；
- 哪些判断可以由系统裁决；
- 哪些判断必须由人承担；
- 修改、批准和升级如何改变正式成果；
- 哪些结果可以进入长期状态，哪些只属于本次执行。

完整编码专业知识既昂贵也脆弱。专家不一定能完整陈述判断过程；可以陈述的规则也可能只适用于某一机构、客户、时点或个人习惯。Schema 不追求完整描述整个领域，只保留可委派、可验证、可恢复、可审阅和可继续工作所需的最小显式语义。

Schema 是隐性专业判断显影后的中间表示，不是对专家 cognition 的序列化：只抽取那些必须跨时间继续存在、必须改变后续行动、必须支持 Review，或者必须能够验证、撤销和追责的工作语义。其余判断仍可以留在人、模型推理、Source、Context 与情境化 Review 中。

#### 2.3 Schema 作为工作纲要与目录

Schema 规定工作对象如何被识别、关联和区分状态，以及哪些变化在什么条件下具有意义。它使不同人员和执行实例能够围绕同一对象、版本与来源比较判断，而不必先重建彼此的对话。类型、状态机、权限规则、来源关系与审阅条件共同构成这一中间表示；JSON Schema 只是其中的数据形状约束。

“纲要体”不是把复杂工作粗暴摘要成几句话，而是在有限篇幅和有限 attention 中压缩现实，同时保留足以恢复原有关系的结构。一个合格的 Matter state 不只回答“发生了什么”，还应当能够回答：

- 这个判断来自哪份材料、哪次沟通和哪个版本；
- 哪些事实已经确认，哪些仍是推断或 working assumption；
- 哪个结论覆盖了哪个旧结论，何时开始生效；
- 哪些来源彼此冲突，哪些关系只是限定而非支持；
- 当前状态为什么演化到这里；
- 必要时怎样返回原文、旧版本与执行 trace。

这接近目录学的“辨章学术、考镜源流”：编目借由出处、版本、关系、沿革和适用范围保存知识的内部秩序。对工作而言这是一项数据治理要求：来源、版本、状态、冲突与撤销一旦在压缩中丢失，留下来的自然语言即使语义相似，也不再具有专业工作的可靠性。

> **Schema 不是把现实塞进数据库，而是给现实留下可追溯、可更新、可继续工作的骨架。**

这一级别的数据治理因此是工作智能的一部分。自动摘要可以充任索引或临时投影，不能取代 authoritative state；未经校验的模型输出也不能因为“写得完整”就成为下一轮的事实。

Eval 会从这套编纂关系中自然生长出来。只要系统已经明确记录：

```text
state → source → judgment → transition → artifact
```

Eval 就可以检查来源是否正确且仍然有效、判断是否越过前置条件、冲突是否被披露、状态转换是否符合 Contract、Artifact 是否能够沿 provenance 回溯。它不再是后来外加的一组问答，而是对工作目录、契约与成果的校勘机制。Schema Engineering 先解决“如何记述和继续一项工作”，再获得“如何检查它是否按已声明的标准成立”。

#### 2.4 哪些语义值得显式化

Schema 显式化判断的后果，不显式化判断的完整过程。一个语义对象值得进入 Schema，通常需要满足以下大部分条件：

1. 它会改变正式状态，例如接受、驳回、批准、发布、完成或升级。
2. 它必须跨时间、模型或人员继续存在。
3. Operator、Reviewer 与 Accountable Principal 需要对它形成共享理解。
4. 遗漏或误解会造成错误提交、重复工作、责任不清、版本漂移或高昂 Review。
5. 它足够稳定，可以用可接受的成本命名和维护。
6. 显式化会改变 validation、routing、Authority、Completion、Review 或 Context Projection，而不只是增加字段。
7. 它会改变下一次执行应当优先看到什么，或者决定本次 output 能否进入长期状态。
8. 它能够以低于预期治理收益的成本被捕获、解释和维护，不要求专家按同等比例增加表单填写与标注劳动。

低风险且可撤销的判断、只在单次推理中使用的信息、高度依赖整体语境的专业直觉、重新推断成本很低的内容，以及不影响正式状态的描述，可以继续留在 source、context 或 Reviewer judgment 中。显式化如果持续产生大量例外或错误确信，也应退回较弱的表示。

每个字段和对象都需要通过一个删除测试：移除后，恢复、权限、审计、完成、Review、Context Projection 或成果采用是否明显变差？如果长期没有可测影响，它就不应继续占据 Schema。删除测试因此是日常产品纪律，不只在模型升级时执行。

持久语义的经济价值来自复用已经完成的工作。每次从原始材料重建身份、版本、有效决定和未完义务，都会重复支付检索、概率推理与复核成本；把这些关系保存为可更新的状态，后续执行便能从已确认的位置处理增量。状态复利积累的是可复用的事实关系、裁决与义务，而非对话长度。它依赖持续纠错、失效与替换：过时状态被反复消费，同样会累积错误。

治理的净收益由节省的重复推理、协调、Review 和恢复成本，减去捕获、核验、迁移与维护成本决定。高频复用且后果明确的语义值得持久化；低成本即可重建、很快过期或难以维护的细节留在按需推理中。模型推理越便宜，执行指导越应删减；决定效力、权限和责任的工作记录仍按其后果保留。

Capture Economics 决定结构如何形成。优先从正常工作中的变更与裁决捕获语义，只在歧义影响行动时请求专家澄清：

```text
normal work behavior
→ implicit event / before-after capture
→ uncertain semantic inference
→ selective clarification, only when ambiguity matters
→ Candidate rule or state change
→ authorized promotion
```

专家承担语义晋升的裁决，日常工作无需改造成高频数据标注。

泛化到一个新场景时，不从“能结构化什么”开始，而先回答四个最低问题：

```text
What persists?                 运行结束后，哪些事实、决定和 Artifact 应当留下？
What expires?                  哪些信息具有时效、版本或适用范围？
What gates action?             什么状态必须确认后才能继续或提交？
What deserves attention next? 下一次执行应优先披露什么，而不是重放全部历史？
```

如果一项 Schema 声明不能改变这四个问题中的任何一个，也不能改善 validation、Review、recovery 或 accountability，它很可能只是形式主义。

## 第二部　Work Commitment and Continuity Runtime

Kernel 有两个嵌套的适用范围。**Commitment scope** 覆盖任何可能改变持久共享状态、触发外部行动或产生现实后果的概率性 Output，即使它只发生一次；**Continuity scope** 进一步覆盖跨 Run、跨人员或跨时间继续存在的工作。Matter、Event Ledger、Semantic State 与 Context Projection 主要服务后者；Candidate、Authority、Review 与 Committed Change 同时服务两者。Professional Work Runtime 是二者重叠时的高保证 profile。

### 3. Matter，而不是 Session

一次 Run 会结束，模型会替换，上下文会压缩，用户会隔日返回。需要持续的工作仍然必须保留材料、事实、版本、未决问题、权限和审阅结果。如果工作只存在于 transcript，连续性就会依赖对历史对话的反复压缩、对旧模型隐含推理的猜测、对一次性 prompt 的复现，以及用户记得“上次说到哪里”。

在 Continuity scope 中，Professional Work 产品的首要用户对象是 **Matter**：具有可识别责任边界、状态连续性和成果或决定历史的最小工作承诺单元。Matter 可以是一宗案件、一项交易、一次审计、一个研究任务、一个客户项目，也可以是持续运营中产生的一项需要独立处理和追踪的工作。

Session 是对一项 Matter 的临时交互与 attention window；Run 是其中一次可停止、失败或替换的执行尝试；Matter 才是工作本身。工作必须能够在不复现完整 transcript 的情况下由新的 Session、模型或 executor 从 governed state 恢复。

> **P1 — Matter over Session：Session 是基础设施对象，Matter 才是用户对象。**

Matter 持有 identity、resources、participants、permissions、Assignments、Artifacts、Semantic State、evidence、Events、Reviews 与 outcomes。Conversation 仍然存在，但只是一种交互表面。

> **P2 — Conversation is an interaction surface, not the product ontology：Conversation 是交互表面，不是工作本体。**

经过治理的 Matter 可以进一步被理解为一种 **semantic repository**。它具有稳定 identity、权威当前状态、版本化 Artifact、候选变更、Review、commit 与可恢复历史；必要时，互相竞争的假设、方案或机构配置可以在独立 branch / fork 上演化，只有经过适用的 Evidence、Authority 与 Review 才进入当前权威状态。借用的是 repository 的治理层级，不是它的文件操作。

这种 repository 的权威语义层通常远小于它所引用的原始材料和完整执行历史，语义密度却更高。它不以 boilerplate、执行日志和全部 transcript 充当当前状态，而主要保存仍然有效的 finding、evidence relation、decision、open issue、active Artifact version 与未完义务。Fork 的合并也不是文本层面的 merge，而是对哪个判断、方案或版本取得正式效力的业务裁决。

Topic-level memory 位于另一层。它可以按主题保存偏好、项目事实、持续关注点和近期变化，减少跨 Session 的重复说明；但 Topic 回答的是“这些信息关于什么”，不必回答 objective、Accountable Principal、Artifact、Authority、Completion、Review、正式版本与提交历史。因而，从 transcript summary 转向可编辑、可持续更新的 topics，是从 chronology 向 semantic persistence 的推进，却不自动构成 Matter management。

> **Topic organizes remembered information; Matter organizes accountable work：Topic 组织记忆内容，Matter 组织可问责的持续工作。**

用户返回一项 Matter，不是寻找某个自动生成标题的 Session；用户审阅一版 Artifact，不是从消息流中猜测哪段回答已经生效；用户恢复工作时读取当前状态，不必重放完整聊天。

Portfolio、Queue、Program 或 Practice 位于 Matter 之上，用来组织多个 Matter。持续监控、周期性合规、长期账户管理和工单队列通常由这些上层对象管理，并在出现独立责任、状态或成果时创建 Matter。把整项长期职责塞进一个 Matter，会使 Matter 退化为无边界 workspace；把每条微小事件都建成 Matter，又会造成过度建模。

普通聊天、角色陪伴和开放探索可以共享持久化 Runtime primitives，却不必共享专业工作的 Evidence、Completion、Authority、Operational Responsibility 和 Accountability 语义。

### 4. Work Commitment and Continuity Runtime

Runtime objects 表示逻辑责任、状态和权威边界。参考实现采用事件溯源（event sourcing）：Committed Event 保存生效变化，reducer 从事件生成 Current Semantic State。既有系统也可以用事务状态表、版本化成果和可审计的提交记录实现同一语义；它需要保持唯一 canonical owner、验证后的写入与可恢复状态，不必从事件日志重建全部历史。一次性 consequential action 可以只实现 Candidate → Authority / Review → Committed Change；当工作需要继续存在时，再引入 Matter 与 continuity objects。

两种“最小”需要区分：

- **Semantic Minimum** 是完整描述高保证持续工作所需的逻辑闭环，即 Continuity Runtime Kernel 的完整对象集合；
- **Deployable Minimum** 是让用户第一次感受到工作不再只存在于 Chat 的最小产品切片，通常只实现一条真实的 commitment boundary。

Semantic Minimum 定义扩展方向，不是产品采用的前置建设清单。Deployable Minimum 可以把多个逻辑对象压在一套现有系统或单体实现中。完整 Kernel 由以下对象构成：

```text
Matter
├── Resources / Context
├── Assignment / Work Contract
├── Operator
│   ├── Lane
│   │   └── Run
│   └── Delegated Operator
├── Accountable Principal
├── Event Ledger
├── Semantic State
│   └── Evidence Graph
├── Artifacts
└── Review
    └── Revision / Outcome
```

#### 4.1 Matter

Matter 是最小工作承诺单元，定义责任边界、资源、参与者、权限、当前事实、正式成果和决定历史。它跨模型、跨 Conversation、跨人员继续存在，可以容纳多个 Assignment 和同一 Artifact 的多个版本；Portfolio、Queue、Program 和 Practice 只负责组织多个 Matter。

#### 4.2 Assignment 与 Work Contract

Assignment 是 Matter 内一项有边界的委派，不是自然语言 prompt 的别名。它至少说明 objective、deliverable、audience、constraints、deadline、authority、completion requirements 与 Review requirements。

Assignment 的状态可以包括 not started、in progress、blocked、awaiting review、completed、superseded 与 cancelled。状态由 Runtime 维护，不能只存在于 Agent 的自然语言自述。

Work Contract 是约束 Assignment 并支撑同一任务族复用的契约集合。它在此处作为执行规格和提交校验的语义来源，并在生产后成为失败归因与改进的参照。Matter 是工作对象，Assignment 是一次有边界的委派，Work Contract 是可版本化的规范。

#### 4.3 Operator 与 Accountable Principal

Operator 对某一范围承担稳定的 **Operational Responsibility**，可以是人、主 Agent 或被委派的 Agent。这种责任只表示谁必须执行、恢复、交付或升级工作，不表示谁最终承担专业、组织或法律后果。

**Authority** 说明谁被允许读取、提出、修改、批准、发布或委派。**Accountability** 说明谁最终接受专业判断和组织后果。Accountable Principal 必须是能够承担这项问责的人或组织角色；Agent 可以取得部分 Operational Responsibility 和 Authority，不能自行取得不可约的 Accountability。

新的 Operator 只有在 Operational Responsibility、scope、tools、Authority、completion obligation 与 escalation path 相对独立时才成立。每个 Assignment 需要明确 Operator、授权范围和 Accountable Principal，三个字段不能互相代替。

并行调用、检索线程或后台任务不自动形成 Multi-agent。运行义务和最终问责都不能从计算拓扑反推。

#### 4.4 Lane

Lane 是同一 Operator 内的一条独立工作线或 execution cursor。不同 Lane 可以并行检查问题、搜集材料或起草不同部分，同时共享 Operational Responsibility 与 Authority。

> **P9 — Lane is parallelism; Operator carries operational responsibility; the Accountable Principal carries ultimate accountability：Lane 表示并行，Operator 承担运行义务，Accountable Principal 承担最终问责。**

Lane 在取得独立 Operational Responsibility、Authority、完成义务和升级路径后，才被提升为新的 Operator。

#### 4.5 Run

Run 是某条 Lane 的一次 activation。它接收输入、调用工具、读取或更新状态、创建或修改 Artifact、产生 Event、请求 Review，并可能停止、失败或恢复。

Run 只承载一次暂时执行，其 model invocation、sandbox、tools 与 working Context 都可以被替换。它的结束不证明 Assignment 已经完成，Assignment 完成也不等于 Matter 结束；Run 的 disposable state 也不能成为恢复 Matter 的唯一来源。

#### 4.6 Event

Event 记录“What happened”，但候选变化和已经生效的变化必须分开：

- **Candidate Event** 记录待提交的状态变化，没有正式效力；
- **Committed Event** 已经通过 Schema Validation、Evidence Check、Authority Check 和 Review Contract 规定的路由规则（Review Policy），可以改变 Current Semantic State。

模型和人都可以提出 Candidate Event，只有 Runtime 可以按提交协议写入 Committed Event Ledger。在适用 retention policy 内，Committed Event 不被静默改写；纠正由新的 Committed Event 表达，删除、匿名化和归档由明确的权利与保留政策处理。

典型 Event 包括 assignment accepted、resource accessed、tool called、artifact proposed、review requested、revision committed、approval granted 与 failure occurred。Committed Event Ledger 是正式状态转换的权威记录；执行 trace 和未提交候选可以另行保存，但不能混入正式账本。

#### 4.7 Artifact

Artifact 是可以进入真实工作流的正式成果，具有 identity、type、version、provenance、status 和下游用途。文档、表格、redline、workpaper、finding、decision、plan 与结构化 issue set 均可成为 Artifact。Artifact 内容保存在版本化 Artifact Store 中；Committed Event 引用不可变的 Artifact version，Current Semantic State 只保存当前权威版本的引用和状态。

Candidate Artifact Version 可以在提交前暂存，没有正式效力。只有引用该版本的 Committed Event 写入账本后，它才成为正式 Artifact。Chat 回答也只有经过这条路径，或形成其他已经提交的状态变化，才进入正式工作。

#### 4.8 Semantic State

Semantic State 表示“What is happening now”，其当前值为 Current Semantic State。每项 claim、finding 或 decision 至少携带两个互相独立的状态轴：

| 状态轴 | 可用状态 | 回答的问题 |
|---|---|---|
| Epistemic Status | proposed、supported、contradicted、uncertain、working assumption、resolved | 证据和认识处于什么状态 |
| Institutional Status | draft、under review、approved、published、superseded、withdrawn | 组织赋予了什么效力 |

证据充分不等于已经批准；已经作为业务决定接受，也不等于它被证明为客观事实。Current Semantic State 还保存 open issues、Evidence relations 与 gaps、coverage、completion status、pending decisions、active Artifact references 和 Review state。

> **P3 — Transcript is evidence of execution, not canonical work state：Transcript 是执行证据，不是权威工作状态。**

在事件溯源实现中，Committed Event Ledger 是状态转换的权威记录，Current Semantic State 是这些事件的确定性投影，可以 checkpoint 并从账本与引用的 Artifact versions 重建。由既有 system of record 持有状态时，恢复以其正式版本和提交记录为准。Artifact Store 保存成果内容，Current Semantic State 保存权威版本引用；引用与实际版本不一致时，Runtime 阻止继续提交并进入修复流程。

#### 4.9 Review

Review 是工作生命周期中的裁决动作，包括 accept、reject、revise、request further work、escalate、approve 与 promote policy。Reviewer 先提出 Candidate Decision；Runtime 检查 Authority 与 Review Policy 后写入 Committed Event，再由 reducer 更新 Current Semantic State 和 active Artifact reference。Review 不直接改写 State。

Review 只出现在具有专业意义、权限意义或学习治理意义的节点，并且必须改变正式状态，而不只是留下评论。

#### 4.10 生命周期

这些对象共同形成一条可恢复的工作链：

```text
Matter created
→ Resources, Accountable Principal and permissions established
→ Assignment accepted
→ Operator and Work Contract selected
→ one or more Lanes execute through Runs
→ Candidate State Changes and Candidate Artifact Versions proposed
→ Schema, Evidence and Authority checks executed
→ Completion / Review Policy routes the candidate
→ Committed Event appended
→ Current Semantic State and active Artifact reference projected atomically
→ Outcome and reusable signals recorded
```

这条链不要求线性推进。Review 可以把成果退回执行，Assignment 可以拆给新的 Operator，新证据可以重开已经关闭的问题，新 Artifact 也可以取代旧版本。每次回转都通过 Committed Event 改变 Current Semantic State 和 active Artifact reference；历史记录与当前状态因此保持一致。

### 5. 历史、状态、上下文与输出不能混为一体

持久工作需要分别回答四个问题：

| 问题 | 承载对象 | 作用 |
|---|---|---|
| 发生过什么？ | Committed Event Ledger 与 Raw History | 正式状态转换、执行追溯 |
| 现在是什么？ | Current Semantic State | 当前事实、决定、覆盖、未决义务 |
| 下一次执行应看见什么？ | Context Projection | 面向特定 Operator、Lane、Run 的临时视图 |
| 这次运行产生的什么可以留下？ | Candidate Change + Commit Protocol | 把 output 区分为临时结果与正式状态更新 |

Transcript 不能同时承担四项职责。历史越长，完整注入的成本越高；反复 summary 又会把暂时解释写成事实，并在多轮压缩中积累漂移。未经治理的 output 如果直接进入 memory，还会把一次推测、旧版本或未通过 Review 的结果带入后续执行。

对于能够把未来决策所需信息表达为当前语义状态的长程工作，规范执行基底应是 Current Semantic State，而不是累积 Transcript。History 仍属于 Evidence 与溯源层：它在需要时被检索和披露，不默认重放为执行上下文。

连续性由三层持久内容和一条提交路径共同组成：

#### 5.1 Stable Contract

Stable Contract 保存长期稳定的 role、institution policy、Assignment semantics、professional schema、permissions 与 tool authority。

#### 5.2 Current Semantic State

Current Semantic State 保存双轴 claim status、开放问题、Evidence Relations、coverage、active Artifact reference、completion、decision 与 pending Review；它由指定的 system of record 维护，在事件溯源实现中为 Committed Events 的当前投影。

#### 5.3 Raw History / Evidence

Raw History / Evidence 保存完整 transcript、原始材料、工具轨迹、Candidate Events、执行 trace 与旧版本成果。它们默认可检索，不默认全量注入，也不能直接改变 Current Semantic State。

> **P4 — Continuity comes from Stable Contracts, Current Semantic State and retrievable history：连续性来自稳定契约、当前语义状态与可检索历史，不依赖不断压缩 chronology。**

按工作域隔离持久内容、保留可检索历史和按需生成工作集，只解决 recall boundary 与 attention allocation；它们不自动建立 authoritative Current Semantic State、Evidence status、Authority、supersession 或 commitment governance。

#### 5.4 Store → Govern → Retrieve → Compile

Context 是面向当前 Assignment 的临时工作视图。它从持久内容中选择本次执行有权使用、与当前义务相关的对象，并保留判断所需的状态、来源和限定。Continuity Runtime 的输入侧由四项责任组成：

```text
Store
→ preserve Sources / Events / Artifacts / Raw History / Current Semantic State

Govern
→ assign identity / status / version / provenance / authority / scope / expiry

Retrieve
→ locate relevant objects within the authorized scope

Compile
→ represent the working set for this recipient, task and stage
```

Govern 确定对象的效力与使用边界，Retrieve 定位候选材料，Compile 将其组织为可用于当前工作的表示。相关性不能授予访问权限；对象可读，也不表示其中的主张已获支持或已经生效。披露由接收者、Assignment、用途和当前规则共同约束，规则在数据交给相应接收者之前实施。

Context Projection、Human Work Surface 与 Retrieval Index 分别服务执行、裁决和未来定位。它们可以采用不同颗粒度，但同一对象的身份、版本、来源与效力必须一致。执行者可以只看到与当前问题相关的事实和 Evidence，Reviewer 则需要候选差异、未解冲突与决定后果。投影省略的内容不因此成为否定事实；影响判断的未知、限定和分歧应在视图中保留，材料不足时通过授权路径补充，或将问题交回裁决。

Govern layer 的每项规则需要 owner、scope、version、review path、disagreement representation、deprecation 与 rollback。若这些规则只能由少数专家永久手工维护，或其结构化成本与使用量同比增长，Runtime 只是把隐形 Human Harness 改写成配置劳动。

投影随任务、权限和状态变化而重建。Stable Contract、Current Semantic State、选定的 Resources / History 与当前 Assignment 构成其输入，正式状态与受 retention policy 保护的 Evidence 保留在投影之外。Recovery 因而是恢复有效状态并重新生成工作视图；已经失效的权限或旧视图不能仅因执行续行而重新生效。

删除、截断、摘要、压缩、折叠与重载属于 **Context Mutation**，改变本次 Run 能注意、比较和引用的内容。其作用限于工作视图；需要长期保留的事实与决定仍走正式提交路径，Raw Evidence 仍按 retention policy 保存。影响恢复、来源完整性或重要判断的 mutation 应保留来源、作用域、变更理由和恢复路径。

#### 5.5 Run 的双向治理

一次 Run 不是从“全部记忆”直接生成“新的记忆”，而是位于两次治理之间：

```text
Stable Contract + Current Semantic State + selected Resources / History
→ Task-specific Context Projection
→ Model Attention / Tool Execution
→ Candidate Output
→ Schema / Evidence / Authority / Completion / Review
→ Committed Event + Committed Artifact Version
→ New Current Semantic State
→ Next Context Projection
```

输入侧决定哪些材料以什么状态进入 attention；输出侧决定哪些结果取得正式效力。未经接受的 finding、plan 与候选成果可以为继续执行和 Review 被保存、检索并进入授权视图，但必须保留候选身份、来源和适用范围。只有通过相应 Contract 的变化，才能更新 authoritative state 或 active Artifact。可见性服务于工作，提交决定效力。

提交边界限制错误取得正式效力，来源与认识状态则约束它在后续工作中如何被使用。候选中的错误仍可能随共享和检索传播，因此后续视图必须保留其未获支持、存在分歧或尚待审阅的状态；正式记录一项 working assumption，也不使它成为已证实事实。发现偏差后，系统应定位受影响的候选、状态和成果，修订其效力，再从经核对的状态继续工作。长程可靠性由这条发现、限制、纠正与恢复的链路支撑。

> **P18 — Context is a projection; output is a candidate state update：Context 是针对当前工作生成的投影；Output 只是候选状态更新，不能默认沉淀为 Memory。**

这一区分使系统可以保留丰富的探索，而不让 brainstorming、已撤回判断、失败尝试和未审阅结果污染当前状态。它也说明 one-shot quality 与 longitudinal work quality 属于不同指标：一次生成可以很好，跨时间工作仍可能因状态未更新、版本覆盖错误、来源失效或错误沉淀而失败。

#### 5.6 Attention economics

更大的 context window 会降低一部分检索和压缩压力，但不会取消信息治理。至少有三个约束继续存在：

1. **可见信息不等于有效信息。** 模型“看得到”全部历史，不表示它会把当前有效、最承重的信息赋予正确权重。
2. **Semantic similarity 不等于 epistemic status。** 已确认事实、旧结论、用户猜测、已撤回决定、权威来源和 brainstorming 可能语义相近，却不能被平等使用。
3. **Output 会成为下一轮 Context 的上游。** 未经验证的结果如果直接沉淀，会累积为错误状态、错误摘要和错误检索索引。

没有结构化治理时，系统往往反复支付同一笔成本：

```text
全部历史
→ 塞入 Context
→ 模型重新辨别有效与失效状态
→ 再摘要或压缩
→ 丢弃大部分
→ 下一次重新开始
```

Schema Engineering 把它改写为：

```text
Raw History / Evidence
→ 一次编订与提交
→ Current Semantic State
→ task-specific Context Projection
```

前者反复支付 token、latency、retrieval、context construction、状态重判和 attention dilution；后者把已经解决过的状态判断保存下来，只在当前任务需要时渐进披露。更多 Context 因而不能自动等价于更好的 Context。上下文窗口扩张类似仓库扩容，不会使目录、版本和权威关系失去价值。

这种 semantic repository 对 attention economics 的关键作用，不是再造一份精简 transcript，而是把体量庞大的材料与 trace 同体量较小、语义密度较高的权威状态分开。同样的 Context budget 不再主要装入需要重新辨别有效性的 chronology，而是装入已经过提交的事实、判断、关系、版本、适用边界和未完义务。

Context Projection 也不是对整座 repository 重新摘要，而是从权威状态编译出的本次执行视图。相同模型与 Context budget 下，这种编订可以承载更长的 Matter horizon 和更高的语义复杂度；它拓展的是由工作基础设施支撑的有效能力边界，不等于模型参数本身已经获得同等提升。

Schema Engineering 控制的是 Reality、Sources、State、Contract、Projection 与 Output 之间的转换。它不试图比模型更聪明，而是在有限 attention 下，把模型能力配置给正确的现实。

Memory 也不再是一个不断增长的“模型记忆罐”。需要持久保存的是专业对象、正式状态、来源关系与检索权；模型每次只获得与当前执行有关的投影。

这可以进一步表述为工作知识层的 **sparse activation**：

```text
Total governed work knowledge and capability
→ Matter / Contract / Catalog boundary
→ retrieve potentially relevant objects and packs
→ compile a minimal sufficient working set
→ Model Attention / Tool Execution / Human Review
```

目标不是把总存量压缩为一份永久摘要，而是使总容量与单次激活成本解耦。随着 Matter、Artifact、历史和可用 capability 增长，per-run Context 应主要随当前 Assignment 的 working set 变化，而不是随整个 repository 线性增长。Compile layer 同时控制两类错误：under-inclusion 会遗漏有约束力的事实、active version 或 Authority；over-inclusion 会引入已 superseded、越权或无关对象，增加 token、attention dilution、状态重判与 stale-context 风险。

### 6. Contract Discipline

专业工作由一组互补契约约束。单一 schema 无法同时表达来源、权限、完成、成果和裁决。

#### 6.1 授权范围内广泛探索，正式边界上窄化提交

Assignment 分别约束可以读取的资源、允许提出的变化，以及能够提交或向外传递的结果。读取权不授予提交权，合法读取与合法调用工具也不能自动组合成向任意接收者披露信息的权限。目的与接收范围因此约束 Context、工具参数和交付物中的信息传播，外部传递须在发生前满足相应授权条件。

> **P5 — Explore broadly within authorized scope; commit narrowly across the formal boundary：在授权资源范围内广泛探索；只有通过带有明确类型、证据、权限和问责主体的窄化边界，才能改变正式状态。**

模型可以在此范围内搜索、比较、试探和提出替代方案。候选变化须绑定目标对象、依据版本与前置条件，再由 Evidence、Authority、Completion 与 Review 决定能否取得正式效力。探索可以保持开放，提交则必须具体到对象及其后果。

#### 6.2 Evidence Contract

需要事实依据的正式主张必须关联机器可读的 Evidence Relation。来源坐标只说明材料在哪里，不能说明材料支持、反驳还是限定某项主张。最小关系包括：

```text
claim
source
source_version
location
relation: supports / contradicts / qualifies / derives-from
extraction_actor
derivation_method
effective_time
status
```

关系类型中，derives-from 对应 provenance 模型的派生关系；supports、contradicts 与 qualifies 是 claim 与来源之间的认识关系，由 Evidence Contract 自行定义。模型可以提出引文、主张和候选关系；Runtime 负责解析来源、版本、坐标和关系类型。可解析引用只确认定位，语义上是否支持主张，由 Evidence Contract 指定的可验证规则、Evaluator 或 Reviewer 判断；未通过该判断的关系仍是候选。垂直 Contract 定义 source authority、precedent hierarchy、freshness 与 admissibility，通用 Runtime 不给不同领域的来源设定统一权重。

> **P7 — Provenance is state, not prose：来源关系属于工作状态，不能只写在说明文字里。**

无来源关系的事实主张不能进入要求事实承诺的正式状态。可用来源不只包括文档和数据库，也包括用户或专业人士的明确陈述、系统观察和工具返回、可以复算的推导结果。没有足够依据的主张可以保留为 proposed、uncertain 或 working assumption，但不能伪装成已经确认的事实。

Evidence Contract 必须区分事实、推论、偏好、策略与人类裁决。一个来源可以支持事实前提，却不能替 Reviewer 承担风险接受或策略选择。

#### 6.3 Completion Contract

Run 可能因 token、工具失败、不确定性或局部成功而停止，这些都不构成专业完成。Assignment 只有在 Completion Contract 满足，或授权人明确豁免、修改该 Contract 后，才进入 completed state。

Completion ledger 可以包括：

- required Artifacts；
- required issue families 与 coverage；
- unresolved questions；
- evidence gaps；
- mandatory checks；
- dependency state；
- pending external input；
- required approvals；
- known exceptions。

> **P8 — Completion must exist outside the model’s self-assessment：完成条件必须存在于模型自评之外。**

可执行的 completion inventory、evidence procedure 与 continue / stop gate 可以改变长程执行的结果；它们证明的只是已表达的完成条件得到执行，专业正确性仍由 Evidence、Authority、Matter continuity 与 accepted work product 分别检验。系统应使“不完整”可见；机器可验证义务和人类裁决点分别表示。

#### 6.4 Authority Contract

Tool capability 与业务 authority 不是同一个对象。模型可能技术上能够创建文件，却没有权力发布；可以生成邮件，却没有权力发送；可以提出修改，却不能改变 approved state。

Runtime 至少应区分 read、propose、modify draft、modify approved state、approve、publish、transmit externally、execute irreversible action、delegate 与 promote policy。取得 Authority 不等于取得 Accountability；自动化可以准备材料、提出建议和执行可撤销步骤，不能替 Accountable Principal 作出最终问责决定。

用户看到的是业务语义：

```text
write_file                  → 接受这项成果修订
run_external_tool           → 把这份工作成果发送给客户
resume_session              → 返回当前 Matter
create_subagent             → 委派一项边界明确的运行义务
```

技术操作不应自动成为用户心智对象。

#### 6.5 Artifact Contract

Artifact Contract 定义成果类型、结构、版本、状态、引用关系、审批条件和下游可用性。Committed Event 必须引用具体 Artifact version，Current Semantic State 只能把已经提交的版本设为 active。产品价值以可采用的 work product 计量，不以聊天回答的长度或流畅度计量。

#### 6.6 Review Contract

Review Contract 定义谁在哪种状态下可以接受、驳回、修订、要求补充、批准和提升规则；Runtime 据此路由候选的规则即 Review Policy。有效 Review 还要求具备 Authority 的人能在有限 attention 下形成独立判断。Human Work Surface 因此按 decision unit 编译当前状态、Candidate delta、Evidence、自动检查、未决问题、可逆性、Authority requirement 与 state consequence；Raw Trace 保持可检索，而不成为默认审阅对象。Review 产生 Candidate Decision，只有通过 Authority Check 并写入 Committed Event 后，才改变 Current Semantic State 或 active Artifact reference。

#### 6.7 Escalation Contract

Escalation 是 Runtime 中的正式动作，不是模型失败后的兜底。合格 escalation 至少表达：

```text
issue
+ evidence
+ alternatives
+ recommendation
+ reason_for_escalation
```

系统不迫使模型在信息不足或权限越界时给出答案，而是把不确定性送到具备相应 Authority 或 Accountability 的主体。

## 第三部　从专家演示到 Agent Extension

### 7. Expert Demonstration 与隐形 Human Harness

专家 Demo 不是产品能力，却是比静态 SOP 更接近真实工作的可运行 source material。专家不必先写出完整 SOP、Schema 或 rubric；Schema Engineering 团队可以从以下材料抽取可转移的工作语义：

- 真实或合成 Matter 上的完整示范；
- prompt、context、tool 和 source 的选择；
- 反复重试、失败恢复和执行路径变化；
- before / after revision；
- accept、reject、request further work 与 escalation；
- 对 materiality、coverage 与 deliverability 的判断；
- 哪些结果进入下游流程，哪些被推翻。

编订因此包含五步：

```text
观察 → 抽取 → 分层 → 编订 → 反例验证
```

专家做出的模型 prototype 往往由一层未被记录的人工 Runtime 支撑：

```text
Expert selects task and context
→ Model attempts
→ Expert notices omission or error
→ Expert changes framing, source or search
→ Model retries
→ Expert judges materiality
→ Expert decides what is deliverable
```

Prototype 制作者亲自操作时，这些干预容易被误认为模型能力；prototype 交给其他人后，任务选择、上下文拼装、遗漏识别、失败恢复和完成判断同时消失。产品化需要外部化足以支持委派、验证、恢复和审阅的干预，不需要复制专家全部思维。

编订时必须按责任、适用范围与稳定性分层：

| 层级 | 例子 | 编译目标 |
|---|---|---|
| Domain invariant | 稳定的专业义务、来源层级、必查事项 | Product Contract / Evaluator |
| Institution convention | 团队审批、格式、风险偏好 | Versioned institution configuration |
| Client / Matter context | 特定客户、交易、时点要求 | Client / Matter context |
| Individual habit | 个人表达、捷径、工具偏好 | User preference，默认不推广 |
| Irreducible judgment | 风险接受、策略、重大例外 | Expert Review / Accountable Decision |

可重复、低争议且可机械验证的动作可以落为 Validator 或 deterministic policy；可委派但仍需判断的步骤落在 Assignment、Review 或 Escalation。

同一 prototype 往往混合 domain invariant、institution convention、client or Matter context 与 individual habit。出现频率不能自动把个人习惯提升为机构规则，也不能把机构规则写成领域真理。

产品化的完成判据是：prototype 作者离开后，其他合格用户能否依靠显式对象和状态委派同类工作，专家 Review 时间是否下降，accepted-work-product rate 是否提高。如果专家仍然需要以接近原来的频率介入，产品只能支持 expert augmentation，还没有形成可委派的 Agent Extension。

### 8. Agent Extension、Work Extension 与 E2E 发布

> **Agent Extension 是由 Work Contract 约束、能够在特定任务族中产生可采用成果，并自带执行边界、结果校验、Review / Escalation 语义和 E2E 发布门的可版本化专业能力包。**

它不限定物理形态，可以实现为 package、plugin、skill、workflow、service、sidecar、embedded module 或其他宿主可加载单元。但 Agent Extension 不等于 prompt + tools + workflow；成熟 Extension 至少包含以下逻辑对象：

```text
Agent Extension
├── Task family and applicability
├── Work Contract
├── Context / resource policy
├── Artifact / evidence / completion contracts
├── Authority contract
├── Review / escalation policy
├── Validators / Evaluators
├── Recovery behavior
├── Golden / adversarial / boundary cases
└── E2E release suite
```

Prompt、tool definition 和 workflow 只是可折旧的实现部分，不构成 Extension 的全部身份。

#### 8.1 Work Extension 作为 Runtime 封装

Agent Extension 表示不依赖具体宿主的逻辑能力身份；当它被封装为可由通用 Harness 加载、替换或组合的运行单元时，其实现形态为 **Work Extension package**：前者保存可移植的工作语义，后者提供面向某一 Runtime 的编译目标与部署封装。

```text
Work Extension package
├── Semantic core
│   └── Work Contract / State / Artifact / Evidence / Completion / Authority / Review
├── Runtime adapter
│   └── required services / tools / events / model and harness compatibility
├── Human Work Surface
│   └── inspection / comparison / provenance / correction / review / approval / escalation
├── State compatibility
│   └── version / migration / rollback / canonical-owner mapping
└── Evaluation and release
    └── Validators / Work benchmark / boundary cases / E2E suite
```

通用 Harness 可以提供 mount / unmount、dependency resolution、event、tool、permission、session、trace、recovery 与 UI slot 等机制；Work Extension 决定这些机制在具体工作中意味着什么。Harness 可以提供“一次性允许、拒绝或询问”的 approval primitive，Extension 必须把它编译为“接受这一版成果”“批准这项风险”“要求补充证据”或“把决定升级给谁”，并规定该操作改变哪项正式状态。HITL 因而不是通用确认弹窗的同义词，而是 Work Contract 的人类裁决面。

这一分层允许 model、Agent loop、Harness 与 Work Extension 以不同速度演化。Model protocol、reasoning loop、streaming、generic tool calling、adapter 和 renderer 通常比 work state、Evidence、Authority、validation、commitment 与 recovery 更易折旧。成熟 Work Contract 因而优先声明目标状态、不变量、充分证据、禁止转换和提交条件，把具体 planner / worker / reviewer 路径留给可替换 Runtime；更强的模型可以减少 imperative orchestration，不能因此取得更宽的副作用或正式提交权限。Runtime composability 证明组件能够被组合、替换或撤销；Work Contract 是否正确，以及 state migration、canonical ownership 与 E2E Acceptance，仍需分别检验。

一种实现形态是 **Sparse Work Harness**：

```text
Shared Core
  agent loop / tool protocol / event / permission / artifact IO / compiler
+ Work Primitive Packs
  schema / instructions / tools / verifier / transition / surface / policy
+ Matter State
  Current Semantic State / versions / evidence / decisions / open obligations
+ Context Compiler
  activate capabilities + project Matter State + mount gates + exclude noise
```

Compiler 输出一份 executable context plan：本次 Run 允许装载哪些 schema、tools、verifiers 与 Human Work Surface，投影哪些 Matter slices，明确排除哪些旧版本、其他 Matter 与越权 capability。Model 可以提出“我认为需要什么”；Harness 必须根据 Contract、role、stage 与 policy 决定“允许装载什么”。由于 capability activation 会改变数据访问、Tool Authority 和现实行动范围，routing 必须采用 learned proposal 与 deterministic permission / commitment gate 的组合。

Activation lifetime 按 `organization → role → matter → stage → run` 分层：越靠左越适合预编译，越靠右越适合动态投影。实践上可以采用 `cold composition / stage-bound reconfiguration / hot execution`，在 Matter 或 stage 内保持 tool definitions、Contract prefix、permissions 与 Surface 相对稳定，只让 Current Semantic State 和 Evidence disclosure 随 Run 变化。Modularity 使 sparse composition 可行；预编排组合才使专家 orchestration 可以被分发。

#### 8.2 Compiled Work Expert 与三层激活

**Compiled Work Expert** 是一份经过版本化、评测和权限收敛的 activation profile：它把一个或多个 Work Extension / Work Primitive 与机构配置、适用任务族、Review / Escalation policy 和 E2E 证据绑定为可复用工作能力。它不是人格化 Agent，也不是单个 Tool 或 Matter instance。

逻辑对象应当分开：

```text
Work Primitive
→ 原子 schema / tool / verifier / renderer / permission capability

Work Extension
→ 面向某一 Harness 的可分发领域封装

Compiled Work Expert
→ 针对高频任务族或 stage 的预编译、已验证 activation profile

Run Plan
→ Compiled Expert + current Matter State + role + stage 的本次执行计划
```

成熟 Runtime 可以采用三层 activation：

1. **Preset binding**：Matter type、institution policy、role 与 stage 已经足以确定 Expert，不需要模型路由；
2. **Expert routing**：模型或规则只在一组已经批准、彼此兼容的 Expert 中提出选择，Runtime 再检查 applicability、version 与 permission envelope；
3. **Primitive composition**：仅用于无合适 Expert、跨域、低置信度或 frontier exploration；默认处于 least-privilege、Candidate-only 边界，不得直接取得 approve、publish、external transmit 或 irreversible authority。

预编排的价值不只是减少 routing entropy。Expert 以完整工作能力作为评测单位，使 `schema + retrieval + tools + verifier + permissions + Human Work Surface + transitions` 可以共同接受 Work benchmark 和 accepted-work-product 检验；模型不必在每个 Run 中重新发明 capability graph。一个 primary Expert 可以调用 Contract 明确允许的 auxiliary Experts，但不能从 Registry 的任意子集自由取得组合权限。

从动态组合编译成 Expert 是一项治理过程，成功 trace 不自动成为 Expert：

```text
frontier composition / expert intervention
→ Candidate Expert Profile
→ applicability and exclusions
→ provenance and source demonstrations
→ Contract / primitive dependency versions
→ held-out E2E, risk-stratified Review and reversal window
→ release Authority
→ Committed Expert Version
→ production monitoring
→ revalidate / recompile / suspend / deprecate
```

Candidate Expert 至少应记录 `expert_id / version`、semantic owner、适用与排除范围、来源示范和 correction、依赖的 Contract / Tool / model / Harness version、评测样本与 Reviewer 分布、已知限制、最后验证时间、freshness trigger、abstention / fallback、rollback 与 deprecation path。不同领域不必共享一个“成功次数”阈值；法律、咨询、医疗等慢反馈场景可以使用 accepted-work-product、Reviewer disagreement、后续 reversal、风险分层和观察窗口共同裁决是否足以发布。

Compiled Expert 既是资产也是被冻结判断的责任。法规、source catalog、institution policy、base model、Tool provider、Matter distribution 或 Reviewer outcome 变化，都可能使它过时。生产中的 edge case 必须能够让 Expert abstain 或升级到 Human / frontier composition，并形成 Candidate Expert Change；不能为了维持 fast path 而把未覆盖事项强行解释为已覆盖。

Compiled Expert 是经过治理的默认路径，primitive composition 是受限的探索路径；二者不保证产生相同结果。两条路径之间形成回路：

```text
Compiled Expert execution
→ uncovered case / drift / disagreement
→ abstain or escalate
→ Human expert / bounded primitive composition
→ structured trace and outcome
→ Candidate Expert revision or new Expert
→ E2E revalidation and release
```

这条回路把 Expert frontier 与 productized work 保持连接，同时防止 active Expert 被 improver 或模型静默改写。

#### 8.3 Extension 的发布判据

Demo 只有同时满足以下条件，才被提升为 Agent Extension：

1. 原作者不再承担逐步驾驶；
2. 其他合格用户能够启动并完成同类工作；
3. 输入、适用范围和不适用边界清楚；
4. required artifacts、evidence、completion 与 review requirements 可以被查询；
5. failure、interrupt、return-for-revision 和 recovery 有可验证行为；
6. 结果能被 Reviewer 作为 accepted work product 接受并进入下一步流程；
7. E2E suite 覆盖正常路径、关键反例、权限边界、恢复和模型替换；
8. 专家 Review 时间、成果接受率或恢复成本至少一项得到可测改善，且高风险指标不恶化；
9. 发布版本具有可查询的 semantic owner、provenance、applicability / exclusions、依赖版本、last validation、freshness trigger、abstention、fallback 与 rollback；
10. 未覆盖或发生 drift 的生产事项能够 fail closed、abstain 或升级到 Human / frontier path，并以 Candidate Change 进入重新评测，而不是静默修改 active Expert。

#### 8.4 E2E 的测试对象

E2E 不是页面点击完成、Agent 停止生成或文件成功写入。它测试一套 Extension 能否在声明范围内稳定完成工作：

```text
Representative Matter / Task
→ authorized resources and context
→ Agent execution
→ candidate artifacts and state changes
→ contract validation
→ review / revision / escalation
→ accepted work product
→ downstream handoff or recoverable continuation
```

完整 suite 可以混合 deterministic checks、schema / evidence / completion / authority validators、evaluator rubric、expert review、accepted-work-product outcome、recovery and replay tests 与 equivalent-interface perturbation tests。E2E 同时观察执行是否成功、状态是否正确提交以及成果是否构成可接受的工作，三者不压成一个总分；全绿只说明声明范围内的检查通过。

#### 8.5 Model、Agentic 与 Work benchmark

专业 Agent 的 Eval 至少包含三层，它们回答不同问题：

| 层级 | 主要测试对象 | 典型问题 |
|---|---|---|
| Model benchmark | reasoning、knowledge、instruction following | 模型是否知道、是否能推理出正确候选 |
| Agentic benchmark | agent loop、harness、tool use、recovery | Runtime 是否能规划、调用、重试、跨工具执行并保持目标 |
| Work benchmark | Work State、专业判断、Artifact 与承诺边界 | 在真实工作状态下，动作与判断是否组成可采用的工作 |

Agentic benchmark 相对容易规范化。输入、动作空间、目标状态和技术成功条件通常可以预先定义，例如 tool calling 是否正确、长上下文检索是否稳定、失败后能否 recover、跨文件操作是否完成。它主要测量 Runtime 内部的执行质量。

Work benchmark 的语义来源则位于 Runtime 之外。它不先问“Agent 有没有把流程跑完”，而问“在这个 Matter 的事实、权限、版本与责任条件下，它形成的判断、中间状态和最终 Artifact 是否满足 Work Contract”。测试可以由 Runtime 执行，但 acceptance criteria 必须来自领域、机构和 Reviewer，而不能由 agent loop 自己定义。

一个法律 Agent 可以顺利完成：

```text
读取材料 → 搜索法规 → 起草 memo → 写入文档
```

所有 tool call 都可能成功，任务也可能正常停止，但工作仍然失败：

- 它识别错了 Matter 的真正争议焦点；
- 应当要求客户补充事实，却直接开始起草；
- 使用了已失效版本或不适用的 jurisdiction；
- 选择了法律上成立、商业上却不可接受的方案；
- 忽略了证明力不足、冲突来源或未决义务；
- 交付件形式完整，却仍不能被 Reviewer 作为 accepted work product 接受。

这些失败不能仅靠“更好的 planner”或“更多 tool coverage”定义。Work Contract 需要先声明：

```text
Context / Work State
→ Required Judgment
→ Intermediate Artifacts and State Transitions
→ Evidence / Authority / Completion / Review
→ Acceptance Criteria
```

然后从同一 Contract 派生 deterministic validators、Evaluator rubric、adversarial cases、expert review points 与 accepted-work-product outcome。Benchmark 是 Work Contract 的测试投影。

> **P19 — Work benchmarks are derived from Work Contracts; runtime success cannot substitute for work acceptance：Work benchmark 从 Work Contract 派生；Runtime 执行成功不能代替工作成果被接受。**

这三类 benchmark 同时对应三层架构、三类 Contract 与三组长期资产：

| 层级 | 自有 Contract | 主要长期资产 | 主要任务 | 成功证据 |
|---|---|---|---|---|
| Model Capability Layer | Context / output interface、能力与安全边界 | weights、训练数据与管线、推理栈、Model Eval | 扩展 reasoning、knowledge、generation 与候选行动边界 | held-out Model benchmark、跨任务能力与成本 |
| Agentic Runtime / Harness | observation / action、tool、session、event、plugin、permission、trace、recovery contract | Harness kernel、service / plugin ABI、tool adapters、sandbox、session / event infrastructure、Agentic Eval | 把模型能力变成可执行、可组合、可恢复、可观测的行动 | Agentic benchmark、tool success、recovery、trace invariant、跨模型复现 |
| Work Extension | Work Contract、Context / State、Evidence、Completion、Authority、Review、accepted work product | 领域语义、机构配置、HITL UX、Validators、Work Eval、failure distribution、accepted / reversal outcomes | 把通用能力收敛为特定人群可依赖的工作渗透面 | Work benchmark、Expert Review、accepted work product 与 downstream adoption |

Coding 同时跨越后两层。一次 bounded issue 主要检验 Harness 执行；多日、跨迭代的软件开发还需要长期 Specification、持续变化的 Artifact State、关于已验证行为与未解失败的 Evidence State、每轮受限目标、role-specific Context 与 Authority，以及独立于实现者自评的 Acceptance。Repository、toolchain、test、CI 与 PR lifecycle 提供 machine-readable、versionable、replayable substrate，定义软件工程 Contract 的一部分；产品意图、Architecture、Compatibility、Release Authority 与运营后果仍由 Work Contract 承担。其他专业领域沿用这组状态与责任关系时，需要以各自的 Evidence 与 Acceptance 语义替换软件测试提供的低成本 verifier。

> **P21 — Layered contracts, local evidence：Model、Agentic Runtime 与 Work Extension 各自拥有 Contract、Eval、长期资产和演化周期；上游能力不能代替下游成果接受，下游失败也不能未经归因就归咎于模型。**

三层 benchmark 可以共同进入 E2E，但各自只回答自己的问题：Model 分数提高不证明 Harness 有效，Agentic benchmark 全绿不证明工作正确，Work benchmark 也不覆盖未被声明的专业判断。稳定的顺序是先定义 work-state contract，再从 contract 派生 benchmark，并以真实 Review 和 downstream adoption 校验其外部效度。

#### 8.6 Accepted work product

Accepted work product 指由具备相应 Authority 的 Reviewer 在预定流程节点接受、可以进入下一步业务流程、不需要实质性修改的 Artifact version。Accepted-work-product rate 是 Extension 发布和迭代的核心指标；它按任务族、风险、机构和 Reviewer 分层，并记录 reversal。

> **P17 — A demo becomes an Extension only when its hidden human harness is compiled and it passes E2E without its author：只有当隐形 Human Harness 被编译，并且原作者离场后仍能端到端交付可采用成果，Demo 才成为 Extension。**

#### 8.7 产品吸收 Agent 复杂度

Frontier Agent 的能力越广，可配置对象越多。Session、Memory、context window、compaction、handoff、tool call、MCP、plugin、subagent、system prompt 和 model-specific recovery logic 属于构建执行系统的概念，不是专业用户完成工作的概念。

用户需要管理的是 Matter、Assignment、resources、issue、evidence、Artifact、revision、approval 与 outcome。

> **P10 — Agent complexity should be absorbed by the product：用户面对专业对象和业务裁决，产品吸收 Session、Memory、Tool、Subagent 与 Context mechanics。**

复杂度没有消失。产品把它从用户的逐次配置移入可复用的契约、默认值、路由、恢复与审阅设计。一次产品判断可以服务多次任务，用户无需每次重新发明工作方法。

部分专业用户需要诊断 Context Projection、工具失败或委派拓扑。产品因此采用渐进披露：默认呈现领域对象，在诊断需要时暴露技术证据，不把技术对象设为主工作面。

#### 8.8 一个完整的提交、退回与恢复过程

一项合同审查 Matter 的目标是形成可以交给业务负责人的风险清单和修订稿。法务负责人是 Accountable Principal；主 Operator 承担审查、恢复、交付和升级义务；Authority Contract 允许它读取合同、提出 finding 和修改 draft，不允许批准或对外发送。

```text
1. Matter 创建
   → 建立原合同、标准条款库、参与人和权限边界

2. Assignment 接受
   → Work Contract 要求覆盖责任、付款、终止和数据义务
   → Completion ledger 登记四类义务与两个交付物

3. 主 Operator 建立两个 Lane
   → Lane A 检查责任与终止
   → Lane B 检查付款与数据义务

4. Lane A 提出 Finding F-17
   → Epistemic Status = proposed
   → Institutional Status = draft
   → Candidate Event 还没有进入 Committed Event Ledger

5. Evidence Check 失败
   → Finding 只有原文摘录，没有 source version 和 location
   → F-17 保留为 proposed，不能进入 accepted state

6. Lane B 定位合同版本与条款坐标
   → 提出候选 Evidence Relation = source supports claim
   → Candidate State Change 再次提交

7. Schema、Evidence 与 Authority checks 通过
   → 指定 Reviewer 确认原文在适用范围内支持该事实主张
   → Runtime 写入 Committed Event
   → reducer 把 F-17 投影为 supported / under review

8. Completion ledger 仍显示数据义务未覆盖
   → Operator 不能宣布 Assignment 完成
   → Context Projection 为下一次 Run 加入缺口和相关材料

9. Reviewer 处理候选成果
   → 接受 F-17 的事实基础
   → 退回风险等级判断
   → Candidate Decision 通过 Authority Check 后写入 Committed Event

10. Revision 生成 Artifact v3
    → Artifact Store 保存不可变版本
    → Committed Event 引用 v3
    → 同一次投影把 Current Semantic State 与 active Artifact reference 更新到 v3

11. 法务负责人批准发布
    → Authority 允许 approve，不允许 Operator external transmit
    → Accountable Principal 的批准写入 Committed Event
    → 发布动作由具备 transmit Authority 的角色执行

12. 新 Run 恢复
    → Runtime 从 Committed Event Ledger 重建 Current Semantic State
    → 读取 active Artifact v3 与未完成义务
    → 生成新的 Context Projection，不重放完整 transcript
```

这条 trace 同时约束 Lane 与 Operator、Candidate 与 Committed、Evidence 与 Completion、Authority 与 Accountability，以及 Event、State、Artifact 和 Context Projection 的写入顺序。任何一步都不能由模型自述“已经完成”替代。

## 第四部　Post-agentic Refinement

Post-agentic Refinement 从 Kernel 推导产品运行、学习与模型策略。生产 trace 不自动成为训练数据，模型权重更新只是系统改进的一种；每项命题分别接受成本、数据权利和产品结果检验。

### 9. Post-agentic Refinement 与 Review 治理

> **Post-agentic Refinement 是 Agent Extension 已经能够端到端运行之后，基于生产使用、Review、Revision、Failure 与 E2E 结果，对整个 Agentic System 进行的后续改进。**

改进对象按默认检查顺序包括：

1. Work Contract 是否遗漏或错误表达专业义务；
2. Validator / Evaluator 是否过弱、过强，或把机构偏好当成事实；
3. Compiled Expert 的 applicability、依赖版本、routing、fallback 或 freshness 是否已经失效；
4. Context Projection 和资源选择是否缺失、过时或冗余；
5. Tool / interface 是否制造 interface accident；
6. Harness / recovery 是否造成系统性失败；
7. Base model 是否存在可测、可泛化的剩余能力缺口；
8. 对剩余能力缺口或可测的质量、成本与效率收益，判断 Selective Model Post-training 是否值得采用。

专业工作本来就通过 Review 与 Revision 推进。产品应捕获实际发生的修订，不应要求专业人士为了未来训练，在每次修改时额外填写 reason code、materiality、scope 和 judgment type。

> **P11 — Capture first, infer later, promote selectively：先捕获事实，再推断语义，只把少数经过确认的候选提升为规则。**

P11 同时是一项 Capture Economics 原则：结构应主要作为正常工作的副产品产生，而不是由专业人士额外为 Schema 填写。删除一句话、选择另一版、拒绝某来源、要求补充某法域、把候选退回或升级，本身都可以先记录为 Event 与 before / after diff；只有当行为无法消歧、且该判断对未来工作具有足够价值时，才请求最小化 clarification。

人的 correction 可以被捕获、抽象、审阅、版本化并在模型权重之外持续复用。若其仅修改自然语言 instruction 或 heuristic，它仍只是 policy memory，不等于完整 Work Contract；写回还必须受 feedback authority、semantic validation、适用范围和结果归因约束。

#### 9.1 自动捕获的事实

系统自动记录 before / after、Artifact path 与 version、actor 与 role、Matter 与 Assignment、evidence、surrounding context、trajectory、outcome 与 learning rights。这些对象首先服务审计、恢复和当前产品运行。

#### 9.2 机器推断的语义

系统可以带不确定性地推断 correction type、likely scope、materiality、failure family、applicability 与 Reviewer disagreement。推断结果不是正式规则，可以通过跨 Matter、跨 Reviewer 和跨版本比较校正。

#### 9.3 人工确认的规则提升

系统准备改变未来行为时，才要求明确裁决：

- Matter 规则是否成为 client preference；
- 重复 client preference 是否成为 institution configuration candidate；
- 重复 institution correction 是否成为 product 或 domain rule candidate；
- 某类失败是否进入正式 Eval；
- 某类数据是否允许 aggregate、evaluation 或 training。

低频的规则提升决定未来行为，适合承担治理成本；高频 Review 只处理当前工作，不应退化为数据标注界面。

生产中的 revision 不一定能可靠区分 correctness、client preference、strategy 与 style。如果自动语义长期不准，Revision Event 仍然保留审计价值，学习语义需要另行采集。

#### 9.4 Capture Economics

“能够捕获”不等于“值得捕获”。每类结构化信号至少需要同时评估：

- 当前工作本来是否会自然产生该行为或 Artifact；
- 自动推断的准确度和可校正性；
- clarification 的频率、时长与被打断成本；
- 规则未来影响的 Matter 数量、风险和可撤销性；
- 相比普通文档、自由 Review 或不保存，该结构是否降低总专家时间。

如果结构化程度只能通过同比例增加 Expert 操作成本获得，expert-trace flywheel 不能作为产品成立的前提。系统仍可保留原始 Event 与 Artifact diff，用于审计和未来重新解释，不应因无法立即得到完整语义而强迫当前用户标注。

### 10. Failure Attribution、Production Learning 与 Synthetic Environment

每项生产失败至少应允许落入下列一种或多种类型：

```text
contract gap
validator gap
evaluator disagreement
expert profile / routing / staleness gap
context / resource gap
tool / interface accident
harness / recovery failure
model capability gap
institutional disagreement
rights / data limitation
```

失败归因本身可以是带不确定性的推断，不能自动改变正式规则。规则提升仍遵循 capture first、infer later、promote selectively。Work Contract 为这一归因提供任务边界、目标成果、accepted-work-product 标准、可验证义务、failure taxonomy、Eval rubric、Environment seed 以及权限与数据 rights 边界。它不只是 Runtime guard，也是训练目标的治理层。

结构化产品界面可以产生学习信号，不会自动形成数据飞轮。生产 trace 首先揭示由当前产品、客户选择、权限条件和使用方式共同塑造的 observed production distribution：

- task distribution；
- failure distribution；
- preference distribution；
- escalation distribution；
- environment seeds；
- accepted-work-product standard。

这些 trace 可能受客户机密、权限、上下文依赖、Reviewer 分歧和选择偏差限制，不一定适合直接训练。Documents 是内容资产；带有具体情境的 task、state、trajectory、judgment 与 outcome 才可能成为学习资产。两类资产都不能自动取得聚合、评测或训练权。

Synthetic Environment 走另一条路径：

```text
Expert defines task family / rubric ontology
→ Synthetic Environment generation
→ oracle or multi-agent solve
→ deterministic checks
→ expert audits disagreements and high-value cases
→ accepted Eval / training environments
```

两条路线承担不同作用：

- Production Learning 揭示系统在哪里工作、在哪里失败、哪种偏好和升级具有现实权重；
- Synthetic Environment 以较低边际成本扩展任务族和失败模式；
- held-out production Matters 检查 synthetic system 是否只优化自己的世界。

> **P12 — Production traces reveal observed production distributions; synthetic environments expand them：生产记录揭示当前产品条件下可观察到的分布并提供环境种子；合成环境扩展规模，但不能自行证明它代表完整任务分布。**

如果 synthetic-only 路线在 held-out real Matters 上持续达到同等效果且成本更低，生产 instrumentation 仍然服务运行和 failure discovery，不再构成学习壁垒。如果生产失败不能形成可复用 task family，trace 只保留局部审计价值。

### 11. Eval、Environment、折旧与 Selective Model Post-training

Schema 中面向模型的 scaffold 与面向人和系统的工作语义具有不同寿命。

#### 11.1 有限 Attention 下的抗折旧语义

只要主流智能系统仍然在有限 attention 下，根据当前可见 Context 产生 Output，而工作经验不能持续、可靠、低成本地写回参数，Context 与 Output 治理就不是阶段性的 workaround，而是系统能力的一部分。Context window、模型推理和 Harness 自动化可以继续增强，却不会自动消灭三项约束：

1. 可见信息不等于有效信息，窗口扩大只是把一部分 retrieval problem 转化为 attention allocation problem；
2. 模型不会天然知道每条自然语言的来源、版本、时效、适用范围、Epistemic Status 与 Institutional Status；
3. Output 会进入新的工作状态并成为后续 Context 的上游，错误沉淀会在多轮中放大。

因此，需要主动区分两类对象。

会随模型快速折旧的是 model-facing scaffold：Explicit reasoning recipe、model-specific prompt trick、过细 workflow instruction、checkpoint tool workaround、固定 prefix、特定 tool name，以及补偿当前模型缺陷的 context orchestration。模型越强、Harness 越原生，这些 procedural glue 越应被删除。

不因模型增强而自动消失的是工作语义：Artifact identity 与 version、provenance、authority、permissions、Semantic State、completion、Review、audit、institution policy、rights、temporal validity、matter isolation 与 correction / revocation。模型更强不会自动决定谁有权批准、哪种来源可以采用、哪个旧结论已被覆盖，或者组织什么时候愿意承担结果。

> **P13 — Delete scaffolding aggressively; preserve semantics deliberately：主动删除会随模型折旧的脚手架，谨慎保留工作语义。**

Schema 保存意义，Harness 负责执行。Harness 越强，Work Contract 中为了引导模型而存在的 procedural instruction 可以越少；但事实是什么、来源在哪里、何时有效、谁能提交、何时完成、什么必须 Review，这些语义不会因为 API、agent loop 或模型版本变化而消失。抗折旧指的是实现层可以持续删减，而编纂与治理的对象仍然存在。

即使未来 persistent learning 成熟，一部分显式 memory management 也可能减少，但严肃工作仍需 provenance、version control、access control、auditability、matter isolation、temporal validity、human authority 与 revocation。系统不能只知道模型“学会了”某项客户偏好，还必须知道它从何而来、适用于谁、何时被修改以及如何撤销。治理对象可能从外部 memory 部分迁移到“模型学到了什么”，治理责任不会自动消失。

这项判断仍然接受删除测试。如果模型能从 raw context 稳定推断某项契约，并在 accepted work product、责任承担、审计、恢复、多角色协作、成本和 latency 上不劣于显式契约，该契约可以降为 model-facing scaffold、按需投影或审计视图。单纯 benchmark 分数提高、context window 扩大或一次 one-shot 成功不足以得出这一结论。

#### 11.2 Eval 基础设施与条目折旧

Eval infrastructure（evaluation harness）管理 task generation、execution、scoring、regression、分层和复核；Evaluator、rubric、labeling guideline 与 Eval item 都是其中的 governed artifacts。它们需要 owner、source criteria、version、适用范围、disagreement、monitoring、Candidate revision、Review、deployment gate 与 rollback。单个 Eval item 会因模型普遍通过、任务分布或制度变化而失去区分力，因而分别标记 stable regression value、frontier discriminative value、distribution relevance 与 legal or institutional validity。

Schema 与 Eval 可以是同一 governed criterion 的执行与测量投影；两者一致只能说明执行符合已声明判据，不能证明判据充分。Runtime 外的评测把产品问题转为可解释信号，沿工作对象与状态变化定位失败，再把修订送回 Contract、Evaluator 或执行系统。未被编码的义务、人类分歧与外部 outcome 使判据本身也能被质疑。Schema 因而既是评测对象，也是归因的坐标；坐标不自动提供原因。

当 Evaluator reason 会进入下一轮生成、状态迁移、拒收、升级或训练信号时，evaluation trace 已经取得执行后果。Criterion、verdict 与 reason 都需要可追溯的版本和修订边界；rubric revision 与普通候选一样，不能静默改变正式规则。

> **P14 — Eval infrastructure compounds; individual Eval items saturate：Eval 基础设施会复利，单个条目会饱和并折旧。**

Environment generation capability 也会复利；单个 environment instance 同样会饱和。

#### 11.3 Harness Specialization 与 Interface Accident

有价值的 Harness specialization 使模型适应 state、evidence、authority、completion 与 escalation 等工作语义。脆弱的 specialization 只适应固定 prefix、tool name、field order、wrapper 或 protocol。

两者需要通过等价语义下的 tool rename、protocol substitution、field-order randomization、Context Projection 变化和环境迁移区分。收益在这些变化后消失，表示系统学到的是 interface accident，portability 低且折旧快。

#### 11.4 Selective Model Post-training 的位置

> **P15 — Selective model post-training is optional; acceptance criteria come first：模型权重训练是可选项，接受判据先于训练目标。**

对于已经能够通过 E2E 的 Extension，默认改进顺序是：

```text
Expert Demonstration
→ Work Contract
→ Agent Extension
→ E2E Acceptance
→ Production Use
→ Failure Attribution
→ Eval / Environment
→ Post-agentic Refinement
→ Selective Model Post-training, if residual gains justify it
```

训练也可以参与首次能力形成，或在质量相同时降低成本。它仍需依据独立声明的工作要求接受评测；产品尚未成立不能由训练计划代替，已有训练投入也不能代替成果接受。

模型权重本身不是显性知识库，而是对训练分布的隐式表示。从训练信号看，可以区分三项连续但不互相替代的积累：

```text
codified human knowledge
→ foundation pretraining

software-grounded interaction trajectories
→ agentic post-training

situated expert judgment in governed Work State
→ next Eval / Environment / training candidate
```

Foundation model 大规模吸收了人类曾经文本化、编码化和公开表达出来的知识与行为；Agentic post-training 又强化了模型在计算机和软件环境中观察状态、调用工具、读取反馈、恢复失败和继续执行的程序性 policy。下一层更稀缺的信号，是专业共同体会做却很少完整写下来的情境化判断，包括何时证据不足、何时切换路径、什么变化可以进入 Current Semantic State、哪类例外必须升级，以及什么才算能够交付。

Schema Engineering 可能在这里产生一类在自然形成的预训练语料中通常不存在、至少不以可执行和可归因形态存在的专业行为信号。法规、合同、论文、SOP 与最终报告记录了世界知识和部分工作成果，却很少完整记录：在某一具体 Work State 下，专家为何补充某项事实、拒绝哪项候选、采用哪个来源、何时升级、怎样修改 Artifact，以及什么条件使成果真正可以进入下游流程。

当专家借助 frontier Agent 把自己的隐形 Human Harness 编订为 Work Contract、Evaluator、Review boundary 和 Agent Extension，并在生产中留下 Committed Event、Current Semantic State、Revision、Failure attribution 与 accepted-work-product outcome 时，系统生成的不只是更多专业文本，而是“专业工作如何在契约下发生状态转换”的结构化行为记录。它不是把专家经验包装成一个静态 skill，而是把情境、判断、行动、审阅与结果保存在同一可校勘的工作结构中。

Coding 提供了先例：repository、diff、test 与 CI 先是软件生产的基础设施，后来也成为 code model 的训练上游。Coding Agent 又可以帮助构建 AI 进入更多专业场景的交互面和产品；进入这些场景后，专家与模型共同编订新的 Work Contract 和 Extension，进而形成新的 Eval、Environment 与训练候选：

```text
Coding Agent / product engineering
→ domain interaction surface
→ Expert + frontier model compile hidden practice
→ Work Contract / Agent Extension / Work Eval
→ governed state, revision, review and outcome
→ validated training candidate
→ broader professional behavior capability
```

这里需要扩大的不是抽象“用户量”，而是 **work penetration surface** 的有效覆盖：更多任务族的横向广度、更深的可委派 lifecycle、跨时间连续性、更接近现实后果的 commitment depth，以及能够观察 later validation / reversal 的反馈深度。只有在这些维度上形成多样、可比较、可归因的 Work State 与 judgment trajectory，规模才可能转化为模型学习信号。

由此得到一项待验证命题：Schema Engineering 不只消费模型能力，也可能生产能够扩展模型专业行为边界的训练上游。局部机构偏好、Reviewer 分歧、选择偏差、interface accident、客户机密和 training rights 都可能使这些记录不适合训练；只有经过语义归因、权利确认、held-out Work benchmark 与真实成果检验的信号，才可以进入 Selective Model Post-training。

Post-agentic Refinement 是上位词，模型权重更新是其中的 Selective Model Post-training。只有当后者能够改善 accepted work product、completeness、grounding、escalation calibration、institutional adherence、cost、latency 或 tool efficiency，并且改善幅度可以测量时，它才有采用依据。如果新的 frontier model 在 accepted-work-product Eval 上超过旧 specialized model，应直接迁移，不因旧 checkpoint 的 sunk cost 延迟替换。

> **P16 — Do not use training as a substitute for reliable validation; do not globalize local preference; do not let automation substitute for the accountable decision：训练不能取代可靠验证；局部偏好不能直接推广；自动化不能取代最终问责决定。**

可以训练已经能够验证的行为，以提高首次通过率、降低成本或减少重试；Validator 仍然保留判定权。自动化也可以准备材料、提出建议和执行可撤销步骤；Accountable Principal 仍然保留最终裁决资格。

没有自有模型、专有 checkpoint 或 post-training，Professional Work 产品仍然需要依靠 Matter、state、evidence、authority、Artifact 与 Review 产生真实价值。

## 第五部　实现形态、长期资产与可证伪边界

### 12. 适用范围、分层资产与工作渗透面

#### 12.1 适用范围：Commitment scope 与 Continuity scope

Schema Engineering 有两个逐层增加的适用范围：

- **Commitment scope**：概率性 Output 会改变持久共享状态、触发外部行动，或产生需要 Authority 与 Accountability 的现实后果；
- **Continuity scope**：工作跨 Run、人员或时间继续存在，而 Evidence、Authority、Completion 或专业正确性不能被廉价稳定 verifier 完整判断。

一次发送、发布、合并、批准或不可逆操作即使没有长期 Matter，也需要 Candidate 与 Committed 的边界；完整 Matter、Current Semantic State 与 Context Projection 则在 Continuity scope 中产生更高价值。一个场景越符合以下条件，显式 Work Contract 与状态治理越有价值：

- 工作跨多轮、跨人员或跨时间持续；
- 本次 Output 会成为下一轮 Input，Matter 会不断积累历史；
- 存在来源、版本、时效、状态变化与相互冲突的陈述；
- 专业正确性缺乏廉价、稳定、完整的外部 verifier；
- 错误 Context、遗漏前提或过期状态会显著影响结果；
- 存在 HITL、approval、Authority、Escalation 或最终问责；
- 用户不应承担 Session、Memory、compaction 与 Context 拼装；
- 恢复、版本协调、Review 和未完义务本身具有可见成本。

即使 frontier model 已经能够 one-shot 产出一份高质量研究报告、合同审查、投研判断或咨询建议，这层治理仍然有独立价值。下一次工作仍要判断哪些事实继续有效、哪些只是当时假设、哪些结论已经被新材料覆盖、哪些结果值得沿用、哪些中间推理不应进入长期状态。

> **P20 — One-shot quality is not longitudinal work quality：单次交付质量不等于跨时间工作质量；当 Output 会进入后续工作，状态治理就是产品质量的一部分。**

一次性的翻译、改写、摘要或开放 brainstorming，如果 Output 不进入正式状态、不产生后续义务，也没有版本、来源和责任连续性，额外 Schema 的收益通常很低。最小结构只补在需要继续、追溯和承担后果的地方。

一个更直接的选场景方法是把 **Judgment density** 与 **Continuity** 分开观察：

| | Continuity 低 | Continuity 高 |
|---|---|---|
| Judgment density 低 | 普通 automation；通常不需要 SE | workflow / traditional software；重点是状态流转 |
| Judgment density 高 | strong model / copilot；重点是一次性专业判断 | **Schema Engineering 最可能产生增量价值** |

Consequentiality 是另一条正交轴：即使 continuity 很低，一次发送、批准、发布、合并或不可逆行动仍可能需要 Candidate / Committed、Authority 与 Review。显式状态和 Contract 的采用边界，由重复判断与责任连续性的收益相对建模、维护和交互成本决定。

Coding 的表现反而说明了其他工作为何更需要这层结构。代码仓库已经天然拥有一套长期工作基础设施：

```text
file system → state
git → version history
type system → schema
compiler → verifier
tests → eval
diff → change representation
CI → acceptance gate
```

Coding Agent 可以显得高度自由，是因为它背后站着几十年积累的结构、状态和验证系统。法律意见、投资判断、咨询建议、研究结论和客户管理通常没有天然的 `git + compiler + test suite`。其他领域也已通过记录管理、专业信息标准、业务系统与审阅制度积累这些语义。Schema Engineering 把既有结构接入 Agent，在缺口处增量补足状态、来源、承诺与验证关系；专业判断仍留在 Review 与 Accountable Decision 中。

Coding 的 verifier 主要作用于 **code execution layer**：代码能否编译、测试是否通过、接口是否满足已经声明的检查。软件工程作为一项持续工作还要处理产品意图、架构边界、迁移策略、向后兼容、安全与性能约束、部署准备、跨团队依赖、技术债务和 release authority。Tests green 只说明已声明的 checks 通过，不说明功能、架构与运营条件已经完整实现，也不自动形成成熟软件。

Issue、spec、ADR、PR discussion、code review、release checklist 与 incident record 可以看作软件工程中分散存在的 Work Schema；工程师对遗漏、materiality、trade-off 与完成状态的手动判断，则构成一层隐形 Human Harness。工程师群体通常具有较强的手动 loop 能力，因此这层 Schema 可以更薄、更隐式，也未必值得额外封装成新的产品门槛。但当 Coding Agent 从完成局部 patch 走向 one-shot 交付成熟软件时，瓶颈会重新出现在 model 与 agent runtime 之外：什么才算实现、哪些架构变化可以接受、谁有权合并和发布、旧决定何时被 supersede，以及下一次 Run 必须优先看到哪些约束。

因此，Coding 更准确地包含两层：底层是拥有强 verifier 的代码执行，上层是仍需语义契约和专业裁决的软件工程。Schema Engineering 对前者可以极薄，对后者仍然成立。它也解释了为什么“测试全绿”不能代替 Work benchmark，以及为什么成熟软件的 one-shot 生成不只等待更强模型或更长 agent loop。

在当前范式下，能力抵达现实工作可以被理解为两个方向的持续对接：

```text
Upstream expansion
Model scaling / attention / post-training
→ Agentic Runtime / coding infrastructure
→ broader candidate capability

Downstream convergence
Work Contract / Work Extension / HITL UX
→ Commitment Boundary / System of Record
→ accepted work for a concrete person or organization
```

上游负责拓展模型与 Agentic execution 的能力前沿；下游负责把开放能力收敛为任务族、证据、权限、完成、Review 与用户工作面。Provider 到具体的人之间不是一次 API call，而是一条从 model interface、Harness service、Work Extension、正式状态到组织承担的编译路径。随着 Work Extension 覆盖的场景增多、每个场景中可可靠委派的深度增加，系统获得的是不断扩张的 **work penetration surface**。

更远期的递归改进只有在系统不仅能够完成工作，还能够根据 failure 与 outcome 提出对 Contract、Evaluator、Tool、Environment 和 learning procedure 的候选修改，通过反事实实验、独立 Review 与外部现实反馈验证，再由明确 Authority 提交时，才成立。这一 **governed meta-improvement** 把改进系统自身也纳入候选、验证与授权提交的边界。

当上游能力逐渐商品化，瓶颈会更多移向外部世界：工作是否有可观测状态，专家判断能否被低负担地编订，组织是否存在可执行 Authority 与 Review，数据与行为信号是否取得复用权。Schema Engineering 不只让模型读取世界，也提高世界作为工作环境被模型可靠触达的可编纂性。

最低必要 Schema 仍遵循 2.4 的四个问题：What persists、What expires、What gates action、What deserves attention next。实现不应超过真实 Review、恢复、版本和责任问题所需要的程度。

#### 12.2 分层长期资产与实现边界

Professional Work Runtime 是 Work Commitment and Continuity Kernel 的高保证 profile：模型在可执行契约下参与工作，系统在对话之外维护状态、证据、权限、完成条件、Context Projection 与可恢复历史，Accountable Principal 在需要最终问责的节点裁决。

这一定义可以形成产品、Infra 或 embedded capability；横向市场品类是否成立由 15.3 的 F14 与 F15 检验。不同领域的 Artifact、Evidence、Authority、Completion、Review 与 Work benchmark 语义并不相同。共享 Runtime primitives 可以降低重复建设，不能替代下游对具体工作的定义。

每层都有自己的长期资产、主要任务与验证方式：

| 层级 | 长期资产 | 主要任务 | 关键检查 |
|---|---|---|---|
| Model Capability | weights、训练与数据管线、推理基础设施、Model Eval | 扩展候选推理、知识和生成边界 | held-out capability、成本、鲁棒性与跨任务迁移 |
| Agentic Runtime / Harness | kernel、service / plugin ABI、tool adapters、sandbox / permission、session / event / trace、recovery 与 Agentic Eval | 让能力可执行、可组合、可替换、可恢复 | tool / recovery success、trace invariant、跨模型与等价接口复现 |
| Work Extension | Work Contract、domain vocabulary、state / evidence / completion / authority / review policy、HITL UX、Work Eval、failure distribution、accepted / reversal outcomes | 把通用能力编译为边界明确的工作渗透面 | accepted work product、Review 时间、completion、grounding 与 downstream adoption |
| Product / Organization | distribution、Expert access、institution configuration、Runtime integration、canonical ownership、rights 与采购关系 | 让工作能力被具体的人采用并取得正式效力 | 留存、替换、支付、责任承担、跨 Matter 复现与合法复用 |

Schema-derived behavior signals、Environment generation 与 Post-agentic Refinement 横跨 Work Extension 和组织层，仍受 rights、failure attribution 与 held-out Work benchmark 约束。这些资产可能组合后产生采购价值，也可能分别被 frontier provider、平台商、开源生态或垂直软件商品化；单一资产不构成 moat。

机构能够沉淀的对象是 Work Contracts、precedent hierarchy、institution policy、client preference、completion standards、Review patterns、escalation rules、Work Eval infrastructure、environment generators、Context Projection policy 与 trained policies。只有当这些对象使专业判断和工作连续性超越原始个体而稳定复现时，它们才构成组织能力。

如果上游平台提供通用 Matter persistence、Artifact state、permissions、Evidence、Completion、Review、Context Projection 与 commitment primitives，并使垂直产品无法在专业语义、成果接受率、集成留存、状态治理成本或支付意愿上形成改进，Schema Engineering 仍然可以作为设计纪律，但不再构成独立产品机会。

### 13. 采用路径与既有系统

Deployable Minimum 从一条真实 commitment boundary 开始：模型提出某项结果，某位具备 Authority 和 Accountability 的人判断它能否进入正式工作。第一版只需要把这次转换从专家脑中移到产品中，不需要先建设全部 Runtime primitives。

#### 13.1 Minimal Viable Matter

第一版不从完整领域 ontology 或全量 Contract 开始，而从四个最低问题选择对象：什么必须留下、什么会失效、什么阻止提交、下一次首先看什么。最小切片可以压缩为：

```text
1 Matter
+ 1 Artifact type
+ 1 Reviewer role
+ 1 formal commit transition
+ 1 active version pointer
+ 1 unresolved-obligation list
+ 1 next-context projection
```

对应实现只需要一个稳定 Matter identity、一个边界明确的 Assignment、Candidate Artifact 与 active Artifact 的区分、一个 Accountable Principal、propose 与 approve 两级 Authority、可见的未完义务、带版本的 commit / reject / revise 记录，以及能够从当前状态恢复的结构化工作包。

Evidence Contract 可以先覆盖最承重的事实主张；Completion 可以由少量 checklist 和人工裁决共同完成；Context Projection 可以只是由 active Artifact、开放问题、适用版本、Assignment 与少量相关来源组成的工作包。Output 侧也只需明确哪一版可以提交、哪些 finding 仍是 proposed、哪些旧状态被 supersede。这些逻辑对象可以存在于同一应用和数据库中，不需要先拆成独立服务。

只要产品能够回答哪一版已经生效、谁接受了它、什么还没有完成、哪些信息已经失效、下一次执行首先应看什么，它就已经越过 Session-first 产品的边界。后续扩展可以沿着以下路径发生：

```text
Chat + invisible human gate
→ explicit Candidate / Accepted Artifact
→ persistent Matter State
→ task-specific Context Projection
→ typed Evidence / Authority / Completion Contracts
→ reusable institution configuration
→ Work Eval and selective learning
```

这条路径不是强制成熟度模型。高风险场景可能先建设 Authority，研究场景可能先建设 Evidence，长程任务可能先建设 Completion、Context Projection 与 Recovery。第一项 Matter 宜具备清楚的交付物、已经存在的 Review、明确的 Reviewer 或 Accountable Principal、可重复任务，以及状态丢失、版本混乱、重复注入或漏项造成的可见成本；第一版不宜要求模型执行不可逆的外部行动。

#### 13.2 分层 Runtime、Work Extension 与 System of Record

Schema Engineering 可以在既有 Agent Harness 与 system of record 上实现。逻辑上的调用与承诺链可以表示为：

```text
Model Capability Layer
        ↓ generates candidate reasoning / action intent
Agentic Runtime / Harness
        ↓ executes through service, plugin, permission and trace contracts
Work Extension
        ↓ projects Context, proposes Candidate Change, renders HITL and validates work
Commitment Boundary
        ↓ commits through Authority / Review
Existing System of Record / Downstream Work
        ↓ acquires organizational effect
Person / Organization
```

通用 Harness 负责 model adapter、tool execution、session、event、plugin lifecycle、sandbox、approval seam、trace 与 recovery；Work Extension 负责具体 Task family、Work State、Artifact、Evidence、Completion、Authority、Review 与 HITL 语义。二者之间应通过稳定 service、event、permission、UI slot 和 state interface 连接。宿主可以替换，领域语义不应被迫重写；领域 Contract 可以修订，也不应要求重新训练模型或 fork Harness core。

Case Management、EHR、BPM、审计平台和垂直 SaaS 可能已经持有 Matter identity、客户或患者资料、Artifact、用户角色、审批流程、正式状态和 retention policy。Schema and Commitment Layer 不应无条件复制这些对象，而应补充 Candidate Change 与 Current Semantic State 的区分、model-facing Authority、Evidence Relation、Completion obligation、persistence / expiry / supersession policy、Context Projection，以及跨模型 Run 的恢复和升级语义。

每一类正式对象必须只有一个 **canonical owner**。AI sidecar 或 Work Extension 可以持有 Candidate、Context Projection 和执行 trace，但不能与原系统各保存一份互相独立的“已批准 Artifact”。最终批准状态必须提交到指定的 system of record，或者由 Schema Runtime 明确成为该对象的 canonical owner。Event Ledger 也可以引用外部系统的 immutable event ID、审批记录和 Artifact version，不需要复制所有既有事件。

#### 13.3 两条正交部署轴

Work Extension 如何装入 Runtime，与谁拥有正式状态，是两条正交轴。第一条是运行封装：

| Runtime 封装 | 宿主关系 | 适用情形 |
|---|---|---|
| Host-loaded Work Extension | 通过 plugin / package / bundle 加载到通用 Harness | 复用宿主 tool、session、permission、trace 与 UI seam，保持领域包独立版本 |
| Embedded Module | 作为垂直产品内部模块 | 产品已经拥有主要工作对象和 UI，需要最短调用链与一致体验 |
| Remote Service / Sidecar | 通过 API、event 或 protocol 与 Harness / 业务系统连接 | 隔离权限、语言栈或部署边界，允许独立扩缩与升级 |

第二条是正式状态的 canonical ownership：

| 形态 | Canonical owner | Schema Engineering 的位置 |
|---|---|---|
| Overlay / Sidecar | 既有专业系统 | 读取正式状态，生成 Candidate Change，通过原系统 API 提交 |
| Embedded Runtime | Case Management、EHR、BPM 或垂直 SaaS | Proposal、Evidence、Completion、HITL 与 Context Projection 成为原产品内部能力 |
| Greenfield Vertical System | 新的 Work 产品 | 同时拥有 Matter、Artifact Store、Committed Event Ledger、Review 与模型执行层，并允许外部系统拥有部分对象 |

Hot swap 只作用于第一条轴。Runtime 安全替换一个插件，不改变第二条轴上的 canonical owner，不迁移正式 State，也不跳过 Authority 与 Review。

### 14. 可证伪边界

下列结果会使相应命题失效或缩窄：

| 编号 | 证伪结果 | 直接后果 |
|---|---|---|
| F1 | 仅用 Conversation History 的 Agent 在长期专业 Matter 中持续等于或优于外部 Semantic State | P3、P4 与外部状态复杂度下修 |
| F2 | Session-first 在恢复、审阅、版本和搜索成本上不劣于 Matter-first | Matter-first 降为特定信息架构选项 |
| F3 | Runtime ontology 在多个领域反复退化为大量例外 | 跨领域范式退回少数垂直架构 |
| F4 | 外部化专家干预后，专家介入频率和成果接受率没有改善 | 定位退回 expert augmentation |
| F5 | Structured Contract 持续漏掉开放问题或制造错误确信 | Contract 缩到 accountability fields，部分任务放弃结构化 |
| F6 | 专业质量依赖持续细粒度人工干预 | Human Review 不能只集中在里程碑或终态 |
| F7 | 自动捕获 Revision 无法低成本形成可靠语义 | Revision Event 只保留审计价值 |
| F8 | Synthetic-only 在真实 Matter 上同效且成本显著更低 | Production trace 不再构成学习壁垒 |
| F9 | 生产失败无法形成可复用 Environment Seeds | Trace 只保留局部审计价值 |
| F10 | 机构内分歧不低于机构间，机构规则降低成果接受率 | 配置停留在 Reviewer 或 team scope |
| F11 | Rights 使合法可复用信号不足以支撑学习 | 学习分支失效，产品结构不受影响 |
| F12 | 在长期 Matter 中，Raw History 全量注入与 raw-context inference 持续在 accepted work product、开放问题发现、成本、latency、问责、审计和恢复上不劣于显式 Contract、Current Semantic State 与 Context Projection | 相应 Contract 与外部状态降为 scaffold、按需投影或审计视图；P18 的适用范围缩小 |
| F13 | 等价接口变化使 specialization 收益持续消失 | Harness 只学到 interface accident |
| F14 | Frontier provider 商品化通用 Runtime primitives，且垂直产品无法在专业语义、成果接受率、集成留存、状态治理成本或支付意愿上形成改进 | 设计纪律保留，独立产品机会消失；如果垂直差异仍然成立，只消除 Runtime primitives 本身的差异化 |
| F15 | 共享 Runtime 没有独立采用、复用或支付价值 | 横向市场类别不成立 |
| F16 | 只有暴露技术对象才能取得显著更好结果 | 采用渐进披露，不彻底隐藏技术层 |
| F17 | 任何有价值的使用都必须先完成全套领域契约和 Runtime 建设，且前置编码、集成与维护成本持续高于节省的 Review、恢复和版本协调成本 | 增量采用路径失败；Schema Engineering 保留为架构纪律，但不构成可独立启动的产品 wedge |
| F18 | Agentic benchmark 在跨任务族、风险和机构的 held-out Matter 上已经充分预测 accepted work product，Work Contract 派生 rubric 不再提供增量区分力或失败解释 | 独立 Work benchmark 降级；E2E 可以更多依赖 Agentic benchmark 与真实 outcome |
| F19 | 实际高价值使用主要是一次性任务，Output 很少进入后续工作，持久状态与 Context Projection 不改善留存、成果质量、恢复或成本 | P20 与 longitudinal product wedge 缩到少数连续性场景；Commitment scope 仍保留于发送、发布、批准、合并和不可逆行动 |
| F20 | 在固定模型、任务分布、expert-hour、rights 与计算预算下，Work Contract、Committed Revision、Review 与 outcome 形成的结构化信号，在 held-out Matter 上不优于普通文档、人工 SOP 或 synthetic-only 数据 | “Schema Engineering 生产新的专业行为训练上游”命题失效；这些对象仍保留运行、审计和 Eval 价值，不构成模型能力扩展路径 |
| F21 | Work Extension 只有持续 patch 某一 Harness 内部实现才能工作，或在所需能力已满足的 service、plugin、model adapter、UI channel 替换后，反复破坏既定工作语义或无法维持声明的成果接受条件 | 独立 Work Extension 封装与可移植性命题缩窄；相应场景可能需要与单一 Runtime 深度耦合，但 Work Contract 与 commitment governance 仍需保留 |
| F22 | 在固定任务与模型下，Store → Govern → Retrieve → Compile 相比 files + search + raw context 没有改善状态一致性、critical omission、token、latency、Review 或 accepted work product，或 Govern layer 的长期维护成本高于收益 | 该管线降为实现偏好；Govern 只保留最小 accountability fields，其余交给 retrieval 与 Human Review |
| F23 | 结构化信号只能通过高频 Expert 填报获得，额外操作成本与数据量近似同比增长，implicit capture + inference + selective clarification 无法降低成本 | expert-trace learning 分支失效；Schema 只保留当前运行与审计必要对象，不宣称可规模化蒸馏隐性知识 |
| F24 | Matter、Artifact、history 与 capability 总量增长时，per-run Context / Tool surface 仍近似线性增长，或稀疏投影持续遗漏关键约束、混入其他 Matter 与旧状态 | Sparse Work Harness 与 attention-scaling 命题失效；退回更窄场景、固定 profile 或更简单 retrieval |
| F25 | 预编排 Work Extension 无法让非原始 Expert 复现工作；合格用户仍需逐次选择 tools、修 Prompt、解释 context 和判断全部下一步 | “precompiled composition makes expert orchestration distributable”失效；产品定位退回 Expert frontier / augmentation |
| F26 | Compiled Expert 的有效性无法通过 owner、version、freshness trigger、reversal 与 held-out outcome 维护；旧规则和旧 source / Tool / policy 持续以“fast path”污染成果，或维护成本随 Expert 数量不可控增长 | Expert Registry 降为临时 preset；正式 Authority 回到 Human / dynamic path，不宣称 Expert 层可持续复利 |
| F27 | 长尾 composition 的“成功”在高 judgment 场景中无法形成可审阅的发布证据，Reviewer 分歧、慢反馈与事后 reversal 使 Candidate Expert 无法可靠晋级 | Expert promotion 保持机构内、人工且低频；自动编译飞轮失效，不影响 Work Contract 和 Matter governance 的运行价值 |

### 15. 分层原则索引

#### Compilation Principles

- **P17 — A demo becomes an Extension only when its hidden human harness is compiled and it passes E2E without its author.** 只有当隐形 Human Harness 被编译，并且原作者离场后仍能端到端交付可采用成果，Demo 才成为 Extension。

#### Ontology and Continuity Principles

- **P1 — Matter over Session.** Matter 是用户对象，Session 是基础设施对象。
- **P2 — Conversation is an interaction surface, not the product ontology.** Conversation 提供交互，不承载工作本体。
- **P3 — Transcript is evidence of execution, not canonical work state.** Transcript 记录执行，不代表当前正式状态。
- **P4 — Continuity comes from Stable Contracts, Current Semantic State and retrievable history.** 连续性来自稳定契约、当前状态和可检索历史。
- **P9 — Lane is parallelism; Operator carries operational responsibility; the Accountable Principal carries ultimate accountability.** Lane 表示并行，Operator 承担运行义务，Accountable Principal 承担最终问责。
- **P18 — Context is a projection; output is a candidate state update.** Context 是针对当前工作生成的投影；Output 只是候选状态更新，不能默认沉淀为 Memory。

#### Commitment Principles

- **P5 — Explore broadly within authorized scope; commit narrowly across the formal boundary.** 在授权资源范围内广泛探索；只有通过带有明确类型、证据、权限和问责主体的窄化边界，才能改变正式状态。
- **P6 — Model proposes; systems enforce invariants; Evaluators measure specified semantics; humans adjudicate irreducible judgment.** 模型、系统、Evaluator 和人分别承担提议、约束、测量和裁决。
- **P7 — Provenance is state, not prose.** 来源关系属于工作状态，不能只写在说明文字里。
- **P8 — Completion must exist outside the model’s self-assessment.** 完成条件必须由模型之外的对象维护。

#### Layering and Evaluation Principles

- **P19 — Work benchmarks are derived from Work Contracts; runtime success cannot substitute for work acceptance.** Work benchmark 从 Work Contract 派生；Runtime 执行成功不能代替工作成果被接受。
- **P21 — Layered contracts, local evidence.** Model、Agentic Runtime 与 Work Extension 各自拥有 Contract、Eval、长期资产和演化周期；相邻层不能互相借用正确性。

#### Product Governance

- **P10 — Agent complexity should be absorbed by the product.** 产品吸收 Agent 的技术复杂度，用户处理专业对象。
- **P11 — Capture first, infer later, promote selectively.** 先捕获事实，再推断语义，最后选择少数候选提升为规则。
- **P12 — Production traces reveal observed production distributions; Synthetic Environments expand them.** 生产记录揭示当前产品条件下可观察到的分布，合成环境扩展覆盖。
- **P20 — One-shot quality is not longitudinal work quality.** 单次交付质量不等于跨时间工作质量；当 Output 会进入后续工作，状态治理就是产品质量的一部分。

#### Evolution Strategy

- **P13 — Delete scaffolding aggressively; preserve semantics deliberately.** 删除会随模型折旧的脚手架，保留工作语义。
- **P14 — Eval infrastructure compounds; individual Eval items saturate.** Eval 基础设施可以积累，单个条目会饱和和折旧。
- **P15 — Selective model post-training is optional; acceptance criteria come first.** 模型权重训练是可选项，接受判据先于训练目标。
- **P16 — Do not use training as a substitute for reliable validation; do not globalize local preference; do not let automation substitute for the accountable decision.** 训练不能取代可靠验证，局部偏好不能直接推广，自动化不能取代最终问责决定。

Compilation、Ontology / Continuity 与 Commitment 三组共同定义 Schema Engineering Kernel；Layering and Evaluation Principles 规定 Model、Agentic Runtime 与 Work Extension 的证据边界，以及 Work benchmark 如何从 Work Contract 派生；Product Governance 和 Evolution Strategy 规定治理的采用与演化。Sparse Work Harness、Compiled Work Expert、三层 activation 与 AOT / JIT composition 是从这些原则推导的实现解释。

## 结语

模型能力决定它能够提出什么变化；Agentic Runtime 决定它能否把变化执行出来；Work Contract 决定这些变化在什么条件下可以被理解、验证并取得现实效力；Matter Runtime 与 Context Compiler 进一步决定，在不断增长的工作知识与能力中，哪一小部分值得在此刻占用模型和人的 Attention。上游持续拓展 reasoning、knowledge 与 action 的能力边界，下游持续把这些能力编订为面向具体人、具体组织和具体后果的工作渗透面。两者之间的 Contract、Eval、Extension、Commitment 与长期资产，构成 Schema Engineering。

高频工作可以被发布为 Compiled Work Expert，使普通用户在 preset 或少量 Expert routing 下消费已经验证的能力；长尾工作保留受限的 frontier composition，并通过 abstention、Human Review、Candidate revision、E2E revalidation 与版本发布回流到主路径。Expert 因而不是一个被扮演的人格，而是一项带 provenance、Authority、适用范围、失效条件与回滚路径的工作能力承诺。

Schema Engineering 把每次执行连接到能够积累的工作：已确认的关系无需逐次重建，未完义务随状态继续，新的判断保留出处与效力。模型与 Runtime 沿能力前沿替换，工作语义沿事实、制度与裁决更新。让工作存在于模型之外，才能让新的模型从已有工作继续。
