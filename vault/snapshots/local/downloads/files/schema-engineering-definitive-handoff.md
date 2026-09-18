# Schema Engineering 定本编译交接件

状态：供本地 Codex 直接编译定本
日期：2026-08-25
目标：消化 2026-08-24 夜间至 2026-08-25 网页端 sessions 的全部增量，形成不依赖任何具体项目的 WorkPaper 定本。

---

## 0. 最终裁定

Schema Engineering 的完整对象不再只是一条 `proposal → commitment` 的 Runtime 提交链，而是三条互相嵌套、不能混写的链：

```text
A. 专业能力编译链
Expert Demonstration
→ Invisible Human Harness Extraction
→ Work Contract
→ Agent Extension
→ E2E Acceptance

B. 正式工作提交链
Model / Human Proposal
→ Candidate Change
→ Validation / Evidence / Authority / Review
→ Committed Change
→ Current Work State / Active Artifact

C. Post-agentic 改进链
Production Use / Review / Revision / Failure
→ Failure Attribution
→ Eval / Environment / Regression
→ Contract / Evaluator / Harness / Context / Tool Refinement
→ Selective Model Post-training, only when justified
```

三条链分别回答：

1. 专业 Agent 能力从哪里来；
2. 一次概率输出何时取得正式工作效力；
3. 已经进入生产的 Agent 系统如何继续进化。

Schema Engineering 的定本必须同时覆盖三条链。只写 B，会退化为 Professional Work Runtime；只写 A，会退化为专家 workflow 产品化；只写 C，会退化为训练与数据飞轮叙事。

---

## 1. 定本核心命题

### 1.1 一句话定义

> **Schema Engineering 是一种面向概率性执行者的弱编译方法：它把专家在真实工作中演示出来的隐性义务、状态、权限、证据、完成标准与裁决边界，编译为可版本化、可执行、可验证、可恢复的 Work Contract，并据此发布可通过端到端验收、能够在生产 Review 中继续改进的 Agent Extension。**

### 1.2 两项不可约转换

Schema Engineering 完成两项不同的转换：

```text
Expert practice → transferable Agent capability
Probabilistic proposal → accountable work commitment
```

前者解决“专家亲自跑通的 Demo 如何成为其他人可用的能力”；后者解决“模型输出凭什么改变正式状态”。

### 1.3 为什么称为弱编译器

Work Contract 的“编译”不是完整形式验证，也不把专家全部推理改写为规则。它是弱编译器，因为：

- source 主要来自不完整的 demonstration、revision、accept / reject 与隐形人工补位；
- 专业正确性通常不存在廉价、完整的 Boolean oracle；
- target 是确定性系统、Evaluator、Agent 与人共同组成的混合 Runtime；
- 部分语义只能被表示为 Review、Escalation 或 Accountable Decision，不能被自动裁决；
- 编译目标不是复刻专家思维，而是使同类工作能够被委派、校验、恢复、审阅和继续改进。

因此，弱编译器只显式化“判断的后果与工作边界”，不显式化“判断的全部心理过程”。

---

## 2. Work Contract 的最终定位

当前稿将 Work Contract 定义为约束 Assignment 的契约集合。定本需要把它提升为整篇的枢纽，但不把它神化为完整程序。

### 2.1 Work Contract 的三重角色

#### A. 执行规格

Work Contract 规定：

- 正在处理哪类工作；
- 输入资源和目的限制；
- 交付物与受众；
- 可用工具和 Authority；
- Evidence、Completion、Review、Escalation 要求；
- 中断、失败和恢复时需要保留的状态。

#### B. 结果校验器

Work Contract 为以下机制提供语义来源：

- schema validation；
- deterministic validator；
- evidence check；
- completion ledger；
- authority check；
- evaluator rubric；
- review routing；
- accepted-work-product 判据。

它不保证专业结论必然正确，但决定哪些结果可以被机器拒收，哪些需要人裁决，哪些可以取得正式效力。

#### C. Post-agentic 学习目标

Work Contract 为生产改进提供稳定参照：

- failure 属于遗漏、grounding、completion、authority、escalation、institutional adherence，还是模型能力；
- revision 改变了事实、策略、机构偏好、客户要求还是表达；
- 哪类失败应进入 regression、Eval 或 Environment；
- 应先修改 Contract、Validator、Evaluator、Context、Tool、Harness，还是模型权重。

没有 Work Contract，生产 trace 只是一串未经类型化的交互记录，无法稳定区分“模型错了”与“产品没有定义清楚”。

### 2.2 Work Contract 的输出

Work Contract 不一定是一份单文件。它可以编译或投影为：

```text
state schema
+ artifact schema
+ evidence requirements
+ completion obligations
+ authority policy
+ review / escalation policy
+ context and resource policy
+ validators
+ evaluators
+ E2E cases
+ version / compatibility metadata
```

这些对象可以在同一系统中物理合并。定本必须坚持：逻辑责任需要清楚，物理服务不必拆散。

---

## 3. 专家演示作为源材料

### 3.1 专家 Demo 不是产品能力

行业头部专业人士，例如律师 Partner、审计负责人、临床专家、工程负责人或研究负责人，可能借助 frontier Agent 直接完成真实任务，并通过反复调整材料、问题、搜索、工具与结果得到高质量 Demo。

这类 Demo 的价值很高，因为它比静态 SOP 更接近真实工作；但它仍可能由一层隐形 Human Harness 支撑：

```text
Expert selects a suitable task
→ chooses context and sources
→ notices omission or misframing
→ changes tools or framing
→ retries
→ judges materiality
→ repairs output
→ decides what is deliverable
```

原作者在场时，这些动作容易被误归入 Agent 能力。原作者离场后，Demo 常常无法复现。

### 3.2 专家演示是“可运行的源材料”

定本应明确：专家不必先写出完整 SOP、Schema 或 rubric。专业能力的 source 可以包括：

- 真实或合成 Matter 上的完整示范；
- prompt、context、tool 与 source 的选择；
- 反复重试和失败恢复；
- before / after revisions；
- accept、reject、request further work 与 escalation；
- 对 materiality、coverage 与 deliverability 的判断；
- 哪些结果进入下游流程，哪些被推翻。

Schema Engineering 团队承担的角色不是简单“采访专家写需求”，而是对这些可运行样本进行抽取、分层、编订、验证和测试。

### 3.3 编订时必须分层

同一个 Demo 可能混合：

| 层级 | 例子 | 编译目标 |
|---|---|---|
| Domain invariant | 稳定的专业义务、来源层级、必查事项 | Product Contract / Evaluator |
| Institution convention | 团队审批、格式、风险偏好 | Versioned institution configuration |
| Client / Matter context | 特定客户、交易、时点要求 | Matter context |
| Individual habit | 个人表达、捷径、工具偏好 | User preference，默认不推广 |
| Irreducible judgment | 风险接受、策略、重大例外 | Expert Review / Accountable Decision |

出现频率不能自动把个人习惯提升为机构规则，也不能把机构规则写成领域真理。

---

## 4. Agent Extension 的定本定义

### 4.1 定义

> **Agent Extension 是由 Work Contract 约束、能够在特定任务族中产生可采用成果，并自带执行边界、结果校验、Review / Escalation 语义和 E2E 发布门的可版本化专业能力包。**

它不限定物理形态。它可以被实现为 package、plugin、skill、workflow、service、sidecar、embedded module 或其他宿主可加载单元。

### 4.2 不等于 Prompt + Tools + Workflow

一个成熟 Extension 至少包含以下逻辑对象：

```text
Agent Extension
├── Task family and applicability
├── Work Contract
├── Context / resource policy
├── Artifact contract
├── Evidence contract
├── Completion contract
├── Authority contract
├── Review / escalation policy
├── Validators / Evaluators
├── Recovery behavior
├── Golden / adversarial / boundary cases
└── E2E release suite
```

Prompt、tool definition 和 workflow 只是可折旧的实现部分，不构成 Extension 的全部身份。

### 4.3 Extension 的发布判据

Demo 只有满足以下条件，才被提升为 Agent Extension：

1. 原作者不再承担逐步驾驶；
2. 其他合格用户能够启动并完成同类工作；
3. 输入、适用范围和不适用边界清楚；
4. required artifacts、evidence、completion 与 review requirements 可以被查询；
5. failure、interrupt、return-for-revision 和 recovery 有可验证行为；
6. 结果能够被 Reviewer 作为 accepted work product 接受并进入下一步流程；
7. E2E suite 覆盖正常路径、关键反例、权限边界、恢复和模型替换；
8. 专家 Review 时间、成果接受率或恢复成本至少一项得到可测改善，且高风险指标不恶化。

### 4.4 新原则

建议在原则索引中新增：

> **P17 — A demo becomes an Extension only when its hidden human harness is compiled and it passes E2E without its author：只有当隐形 Human Harness 被编译，并且原作者离场后仍能端到端交付可采用成果，Demo 才成为 Extension。**

该原则是本轮增量的核心，不应只埋在“隐形 Human Harness”章节中。

---

## 5. E2E 的最终含义

E2E 不是页面点击完成，不是 Agent 停止生成，也不是文件成功写入。

### 5.1 E2E 测试对象

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

### 5.2 E2E 可以是混合裁决

完整 E2E suite 可以包含：

- deterministic checks；
- schema / evidence / completion / authority validators；
- evaluator rubric；
- expert review；
- accepted-work-product outcome；
- recovery and replay tests；
- equivalent-interface perturbation tests。

它不要求所有专业正确性被自动化。E2E 的作用是证明一套 Extension 能在声明范围内稳定完成工作，而不是证明整个领域已经形式化。

### 5.3 Accepted work product

Accepted work product 仍按当前稿定义：由具备 Authority 的 Reviewer 在预定流程节点接受、可以进入下一步业务流程、无需实质性修改的 Artifact version。

定本应进一步强调：accepted-work-product rate 是 Extension release 和迭代的核心指标，不是单一模型 benchmark 的替代名。必须按任务族、风险、机构和 Reviewer 分层，并记录 reversal。

---

## 6. Post-agentic Refinement 与 Training

当前稿的 “Post-training” 仍容易被理解为模型权重训练。定本应拆成两个层级。

### 6.1 Post-agentic Refinement

> **Post-agentic Refinement 是 Agent Extension 已经能够端到端运行之后，基于生产使用、Review、Revision、Failure 与 E2E 结果，对整个 Agentic System 进行的后续改进。**

它优化的对象按优先级包括：

1. Work Contract 是否遗漏或错误表达专业义务；
2. Validator / Evaluator 是否过弱、过强或把机构偏好当成事实；
3. Context Projection 和资源选择是否缺失、过时或冗余；
4. Tool / interface 是否制造 interface accident；
5. Harness / routing / recovery 是否造成系统性失败；
6. Base model 是否存在可测、可泛化的剩余能力缺口；
7. 只有第 6 类稳定成立时，才考虑 selective model post-training。

### 6.2 Failure Attribution

每项生产失败至少应允许落入下列一种或多种类型：

```text
contract gap
validator gap
evaluator disagreement
context / resource gap
tool / interface accident
harness / recovery failure
model capability gap
institutional disagreement
rights / data limitation
```

失败分类本身可以是带不确定性的推断，不能自动改变正式规则。规则提升仍遵循 capture first、infer later、promote selectively。

### 6.3 Work Contract 连接 Runtime 与 Training

Work Contract 为 post-agentic refinement 提供：

- 任务边界；
- 目标成果；
- accepted-work-product 标准；
- 可验证义务；
- failure taxonomy；
- Eval rubric；
- Environment seed；
- 权限和数据 rights 边界。

因此，Work Contract 不只是 Runtime guard，也是一种训练目标的治理层。

### 6.4 Selective Model Post-training

模型权重训练仍是可选项，且位于下游：

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

训练可以提高首次通过率、成本、速度、tool efficiency、grounding、completion 或 escalation calibration，但不能取代 Validator、Authority 或 Accountable Decision。

### 6.5 术语裁定

正文主用：

- `Post-agentic Refinement`：广义系统后续改进；
- `Selective Model Post-training`：狭义权重训练。

避免把所有 Contract、Harness 或 Eval 改进都称为 Training。

---

## 7. 建议的定本目录

### 标题

# Schema Engineering：让工作存在于模型之外
## 从专家演示到可验收 Agent Extension 的弱编译方法

### 摘要

同时交代两项转换：

- proposal → commitment；
- expert demonstration → Agent Extension。

### 第一部　弱编译与正式工作

1. 概率性提议与组织承诺
2. Schema Engineering 的定义与两项转换
3. Work Contract 作为弱编译器
4. 哪些语义值得显式化

### 第二部　Professional Work Runtime

5. Matter，而不是 Session
6. Runtime objects 与 canonical state
7. Contract discipline
8. 历史、状态与 Context Projection
9. 产品吸收 Agent complexity

### 第三部　从专家演示到 Agent Extension

10. Invisible Human Harness
11. Demonstration extraction and semantic stratification
12. Agent Extension definition
13. E2E release and accepted work product

### 第四部　Post-agentic Refinement

14. Review、Revision 与学习治理
15. Failure attribution
16. Production learning 与 Synthetic Environment
17. Eval、折旧与 Harness specialization
18. Selective model post-training

### 第五部　产品边界与证据纪律

19. Adoption and existing systems
20. Long-term assets and market hypotheses
21. Boundary tests
22. Falsifiability
23. Open questions
24. Layered principles index

---

## 8. 可直接替换的摘要草案

概率模型已经能够搜索、比较、解释、起草和调用工具，却不能仅凭一次输出取得正式工作所需的事实效力、行动权限、完成状态和责任归属。一次 Run 会结束，模型会替换，上下文会压缩；Matter、Artifact、Review decision 与未完义务仍然必须继续存在。

专业 Agent 的另一项瓶颈也不只是模型能力。行业头部专家可以借助 frontier Agent 亲手跑通高质量 Demo，但 Demo 往往依赖一层未被记录的 Human Harness：专家选择任务和材料、识别遗漏、调整搜索与上下文、修复失败，并判断什么可以交付。原作者离场后，这些能力常常随之消失。

Schema Engineering 是一种面向概率性执行者的弱编译方法。它把专家在真实工作中演示出来的隐性义务、状态、权限、证据、完成标准与裁决边界，编译为可版本化、可执行、可验证、可恢复的 Work Contract。Work Contract 同时承担执行规格、结果校验和 Post-agentic Refinement 目标：它约束模型与工具怎样参与工作，规定候选结果怎样通过 Evidence、Completion、Authority 与 Review 进入正式状态，并把生产中的 Revision 与 Failure 转化为 Eval、Environment 和后续系统改进的语义基础。

这一方法形成两条相互连接的链。第一条把 Expert Demonstration 编订为自带 Validator、Evaluator、Review boundary 和 E2E release suite 的 Agent Extension；第二条把 Model / Human Proposal 通过 typed commitment interface 提升为 Committed Work State。模型提出并执行，确定性系统维护不变量，Evaluator 测量已明确规定的语义，人承担不可约的专业判断。

法律提供了高要求实例，但不构成外延边界。财务、医疗、咨询、研究、工程、合规和审计等工作同样需要将专业演示转化为可委派能力，并在对话之外维护来源、权限、版本、完成、审阅与责任。各领域可以共享 Runtime primitives 和 compilation discipline，不能因此省略各自的专业语义。

---

## 9. 当前稿的保留、移动与压缩裁定

### 保留

- proposal ≠ commitment；
- typed commitment interface；
- Matter over Session；
- Event / Semantic State / Artifact canonicality；
- epistemic × institutional 双轴；
- Evidence / Completion / Authority / Artifact / Review / Escalation；
- Context Projection；
- explicitness 删除测试；
- Deployable Minimum；
- Overlay / Embedded / Greenfield；
- Boundary Tests 与 Falsifiability。

### 提升

- Work Contract：从 Assignment 的约束集合提升为弱编译器枢纽；
- Invisible Human Harness：从 prototype 风险提升为专业能力 source；
- E2E：从产品价值测试提升为 Agent Extension release criterion；
- Review / Revision：从审计与学习信号提升为 Post-agentic Refinement 输入；
- Post-training：重写为广义 refinement 与狭义 model training 两层。

### 移动

- 完整合同 12 步 trace 可移至 Appendix 或保留为唯一纵向例证，不在 Kernel 前半段打断定义；
- 现有 systems / adoption 仍置于产品边界部分，不抢占定义；
- synthetic / market / moat 不写成 Kernel 必然推论。

### 压缩

- Runtime object 的重复定义；
- Event / State / Artifact canonicality 的多次复述；
- “产品吸收复杂度”与 Context Projection 中重复的 Session / Memory 反论；
- 训练、Eval、Environment 三节之间重复的顺序声明。

---

## 10. 定本不可漂移的边界

1. 不依赖 Courtwork、Legal AI 或任何具体项目作为定义前提。
2. 法律只可作为实例，不可成为 source 或 market 的唯一证明。
3. 不把 expert vibe coding 浪漫化为自动可产品化；必须显式 Human Harness extraction。
4. 不把 Work Contract 写成完整专业知识库或 Boolean oracle。
5. 不把 Agent Extension 等同于 prompt template、workflow 或 package format。
6. 不把 E2E 全绿写成整个领域的专业正确性证明。
7. 不把生产 trace 自动称为训练数据或 moat；rights、selection bias 与 disagreement 保留。
8. 不把 model post-training 写成产品成立前置条件。
9. 不把所有系统改进称为 Training；广义用 Post-agentic Refinement。
10. 不因新增 compilation 主轴而删除 proposal → commitment 的本体论核心。

---

## 11. Codex 编译验收清单

最终 WorkPaper 必须逐项满足：

- [ ] 摘要同时出现 expert demonstration → extension 与 proposal → commitment。
- [ ] Work Contract 明确定义为弱编译器，并具备执行规格、结果校验、学习目标三重角色。
- [ ] 解释“弱”的原因与不可形式化边界。
- [ ] 明确 expert demonstration 是可运行 source material，不是产品能力本身。
- [ ] 明确区分 domain / institution / matter / individual / irreducible judgment。
- [ ] 定义 Agent Extension，并说明不等于 prompt + tools + workflow。
- [ ] E2E release 以作者离场后的 accepted work product 为终点。
- [ ] Post-agentic Refinement 先于 selective model post-training。
- [ ] 增加 failure attribution，能区分 Contract、Evaluator、Context、Tool、Harness、Model 与 institution disagreement。
- [ ] 保留 Matter-first、commitment boundary、canonical state、contracts 与 adoption path。
- [ ] 仍然允许无自有模型、无 proprietary post-training 的产品成立。
- [ ] 全文不依赖任何具体项目、公司或市场口号。
- [ ] Principle index 中加入 P17 或等效的 compilation principle。
- [ ] 没有因概念新增而产生第二套互相竞争的 ontology。

