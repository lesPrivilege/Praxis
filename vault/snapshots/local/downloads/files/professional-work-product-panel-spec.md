# Professional Work Agent 产品理念面板

状态：供本地 Codex 直接实现为单页展示面板
日期：2026-08-25
对象：technical founder、product founder、marketing leader、潜在合作方
用途：宣讲产品理念，而非展示完整 Runtime ontology 或学术证明

---

## 0. 面板的唯一任务

让读者在 3–5 分钟内理解：

1. 为什么顶级专家能跑通的 Agent Demo 仍然不是产品；
2. 产品如何通过 Work Contract 把隐形 Human Harness 编译为 Agent Extension；
3. Extension 如何在运行时把概率提议变成可验收工作；
4. 生产 Review 与 Failure 如何进入 Post-agentic Refinement；
5. 这形成怎样的产品 wedge、长期资产与衡量方式。

面板不是产品 UI，不是 dashboard，不是技术架构总图，也不是融资 deck 的十页压缩版。它是一张可以滚动、讲述、截图和分享的产品理念板。

---

## 1. 核心主张

### Eyebrow

**Professional Work AI**

### 主标题

# 把专家跑通的方法，编译成团队可复用的 Agent 能力

### 副标题

专家用真实任务直接演示。Work Contract 将隐形的人类补位编成执行、校验、Review 与 E2E 测试；Agent Extension 在原作者离场后，仍能交付可采用的工作成果。

### 第二主句

> **AI 会生成答案；产品必须定义这些答案何时算作工作。**

---

## 2. 叙事结构

面板由六个纵向区块组成。中心视觉只使用一张主图：三条嵌套链。

### 区块 A：The Gap — Demo 不是产品

#### 标题

## 模型能完成节点，专业工作仍依赖专家在场

#### 三张问题卡

**Demo 依赖作者**  
专家知道该选什么材料、何时重试、哪里遗漏，以及什么可以交付；这些判断通常没有进入产品。

**输出没有正式效力**  
一段回答可以很正确，却没有说明来源、完成状态、有效版本、批准权限和最终责任。

**失败无法归因**  
没有稳定的工作契约，团队无法判断失败来自模型、上下文、工具、评测，还是工作本身没有被定义清楚。

#### 小结

> Prototype 展示“专家加模型能做到什么”；产品必须证明“专家离场后，团队仍能稳定完成什么”。

---

### 区块 B：The Source — 专家演示是可运行的源材料

#### 标题

## 不先要求专家写完整 SOP，让他们先把真实工作跑通

#### 正文

行业头部专家可以直接使用 frontier Agent 完成真实任务：选择材料、调整问题、调用工具、发现遗漏、修订结果并决定是否交付。产品团队不把这段过程当作一次成功 Demo，而把它作为专业能力的 source material。

#### 分层标签

```text
领域稳定义务
机构惯例
客户 / Matter 特有要求
个人习惯
不可转移的专业判断
```

#### 产品动作

**观察 → 抽取 → 分层 → 编订 → 反例验证**

---

### 区块 C：The Weak Compiler — Work Contract

#### 标题

## Work Contract 是工作场景的弱编译器

#### 中心三列

**输入：Expert Demonstration**

- 真实任务与材料
- prompt / context / tool 选择
- revision 与 reject
- materiality 与 deliverability 判断

**编译：Work Contract**

- Execution spec
- Result validation
- Review / authority boundary
- E2E and learning target

**输出：Agent Extension**

- Context / resource policy
- Artifact / evidence / completion contracts
- Validators / Evaluators
- Review / escalation
- Recovery behavior
- E2E release suite

#### 解释

“弱”不是能力不足，而是拒绝伪造完整确定性：可稳定验证的义务交给系统，不可约的专业判断留给具备责任的人。

#### 强句

> **不是把专家全部思维写成规则，而是把可靠委派需要的边界写进产品。**

---

### 区块 D：Inside Every Extension — 从提议到正式工作

#### 标题

## 探索可以发散，承诺必须收敛

#### 运行链

```text
Explore
→ Propose
→ Validate evidence / completion / authority
→ Review when needed
→ Commit an accepted artifact or state change
→ Continue from current work state
```

#### 三项产品承诺

**工作不会丢**  
用户返回的是当前工作、有效成果和未完义务，不是重新寻找上一段 Chat。

**结果可以核**  
重要结论可以回到来源；系统分得清“有依据”和“已经批准”。

**决定有人负责**  
AI 可以查找、比较、起草和执行；什么正式生效，由具备 Authority 和 Accountability 的人决定。

#### 强句

> **Extension 自带 Definition of Done，而不是等模型自己宣布完成。**

---

### 区块 E：After Shipping — Post-agentic Refinement

#### 标题

## 生产中的 Review 不是终点，而是下一版系统的输入

#### 飞轮

```text
Teams use
→ Experts review
→ Revisions and failures are captured
→ Failure is attributed
→ Tests / Eval / Environments are updated
→ Contract / Evaluator / Harness / Context / Tool improve
→ Model post-training only when the residual gap justifies it
```

#### Failure attribution 标签

```text
Contract gap
Evaluator gap
Context gap
Tool / interface accident
Harness / recovery failure
Model capability gap
Institutional disagreement
```

#### 强句

> **先修定义、校验和环境，再判断是否需要训练模型。**

---

### 区块 F：The Product — 从一个真实工作切入

#### 标题

## 不从宏大平台开始，从一条真实的承诺边界开始

#### Minimal wedge

```text
1 task family
+ 1 artifact
+ 1 reviewer
+ 1 formal commit boundary
+ 1 E2E release suite
```

#### 衡量方式

**Accepted-work-product rate**  
有多少成果真正进入下一步工作。

**Expert review time**  
专家是否从逐步驾驶转为关键节点裁决。

**Recovery cost**  
中断、换人或换模型后，恢复当前工作的成本是否下降。

#### 长期积累

```text
Expert access
+ Compilation capability
+ Work semantics and contracts
+ E2E environments
+ Production failure distribution
+ Workflow integration and distribution
```

#### 结束语

> **模型会替换，Prompt 会折旧。能够被验收、被复用、被组织接受的工作方式会留下。**

---

## 3. 主视觉：三条嵌套链

面板中心应是一张横向或轻微弧形的主图，不做普通线性 pipeline。

### 外层：专业能力编译链

```text
Expert Demo → Work Contract → Agent Extension → E2E Release
```

### 中层：Extension 内部的正式提交链

```text
Proposal → Validate → Review → Commit → Current Work State
```

### 回流层：Post-agentic Refinement

```text
Production Review / Failure → Eval / Environment → Refine Extension / Harness / Model
```

视觉上应清楚表达：

- Work Contract 位于 source 与 extension 之间；
- commitment loop 位于 extension 内部；
- production signal 回流到 Work Contract、Evaluator、Harness 和模型，而不是只回流到模型。

---

## 4. Founder 与 Marketing 的共同 message house

| 层级 | Technical founder 读取 | Marketing leader 读取 |
|---|---|---|
| 市场变化 | Node capability 跨过门槛，产品瓶颈转向 e2e adoption | AI 已经会写，但答案仍进不了工作 |
| Source | Expert demonstration 比静态 SOP 更接近真实分布 | 从顶级专家亲手跑通的方法开始 |
| Mechanism | Work Contract 编译状态、校验、Authority 与 Eval | 不是 Prompt 模板，是自带完成标准的能力 |
| Product | Versioned Agent Extension + E2E release | 原作者离场后，团队仍能使用 |
| Learning | Post-agentic refinement 先于 model post-training | 每次 Review 都让下一版更贴近团队标准 |
| Moat | Expert access + compilation + semantics + environments + integration | 模型会变，组织完成工作的方式会留下 |
| Metric | accepted-work-product / review time / recovery cost | 不是生成多少，而是多少成果被采用 |

面板只呈现一套话语，不做 audience toggle。结构本身使 technical 读者看见 mechanism，使 marketing 读者抓住 category 和 message。

---

## 5. 视觉与实现裁定

### 5.1 形态

- 单页 responsive narrative board；
- desktop 首屏可见 Hero + Gap + 主图入口；
- 1440px 宽时主图完整，不要求横向滚动；
- mobile 按六个区块顺序折叠；
- 可作为网页、长图、演示共享链接。

### 5.2 不做

- 不做传统 KPI dashboard；
- 不做产品设置页或伪交互 UI；
- 不使用机器人、脑电、霓虹渐变等通用 AI 视觉；
- 不堆满 Matter、Operator、Lane、Event Ledger 等 Runtime 术语；
- 不把模型训练放在中心；
- 不把 Legal 或 Courtwork 作为定义前提；
- 不制造未经证实的市场数字。

### 5.3 视觉语义

- 中性底色；
- 人类专家、正式 commitment、生产回流各有一类稳定视觉标记；
- Candidate 与 Committed 必须形态不同；
- Work Contract 是唯一中心节点，不用巨型“AI brain”；
- 主图以方向、层级和边界取胜，不依赖装饰性图标；
- 关键术语中英文并置，但正文以中文为主。

### 5.4 Progressive disclosure

主面板只显示产品语言。以下细节可用 hover、点击展开或附注承载：

- extension package contents；
- failure attribution list；
- Work Contract 的三种输出；
- accepted work product 定义。

即使所有交互失效，静态页面仍应完整可读。

---

## 6. Codex 实现验收

- [ ] 首屏 10 秒内能够读出“专家 Demo → Work Contract → Agent Extension”。
- [ ] 主图同时表达 compilation、commitment、refinement 三条链。
- [ ] Work Contract 明确呈现执行规格、结果校验、学习目标三重角色。
- [ ] Agent Extension 明确不等于 prompt / workflow。
- [ ] E2E 终点是 accepted work product，且原作者离场。
- [ ] Post-agentic refinement 的回流对象不只包含 model。
- [ ] 产品 wedge 足够小：一类任务、一类成果、一位 Reviewer、一条正式边界。
- [ ] 页面可被 technical founder 解释机制，也可被 marketing leader提炼主张。
- [ ] 没有依赖具体公司、行业或市场数据。
- [ ] 没有把 WorkPaper 的 Falsifiability、完整 ontology 或实现细节搬上面板。
- [ ] 静态截图仍可完整传达核心故事。

