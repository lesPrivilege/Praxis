# Domain Grammar：FDE、法律与金融的可复用骨架

## 来源与状态

用户明确要求补充大陆 FDE 会遇到的工作面、法律/金融 grammar，以及在进入陌生业务前可以筹备的泛化材料（T3/U）。历史回答提出 `Field Grammar + Domain Grammar + Entry Playbook`，并把这些 grammar 视作待验证的工作骨架（T3/A）。其中引用外部来源的事实性主张没有在本地重新核验，引用占位与缺口见 [`../../intake/work-system-increment-r2.json`](../../intake/work-system-increment-r2.json)。

## Universal Enterprise Grammar

进入新企业时，先找跨行业对象和关系，再补行业词汇。候选对象：

```text
Organization
Person / Role
System
Data Source
Document
Request
Case / Matter
Workflow
Rule / Policy
Decision
Action
Approval
Exception
Evidence
Artifact
Metric
Deadline / SLA
```

候选关系链：

```text
Request
  → Case
  → Data / Document
  → Rule / Policy
  → Decision
  → Action
  → Exception
  → Approval
  → Artifact
  → Metric
```

这是 schema-discovery 的起点，不是要求一次性建立完整 ontology。每个对象都需要 owner、状态、来源和下一步；缺失字段应保持 unknown，而不是用行业常识填满。

## Mainland FDE Field Grammar

历史回答将大陆 FDE 的现场工作分成八个面（T3/A）：

| 工作面 | 首要产物 |
| --- | --- |
| Executive | 业务目标、拍板人、成功标准 |
| Discovery | 真实用户、痛点、口头需求与实际做法的差异 |
| Workflow | current flow、异常路径、handoff、审批 |
| Data | 来源、owner、格式、质量、权限、更新周期 |
| Systems | ERP/CRM/OA/IM/邮件/数据库/API 的边界 |
| Prototype | 最小真实案例、输入输出、可运行 demo |
| Validation | eval、验收条件、失败案例、fallback |
| Adoption | 使用者、阻力、ROI、后续复用 |

进入现场可以用 72 小时的候选节奏：

1. 0–4 小时画“谁—在哪个系统—处理什么对象—为了什么结果”。
2. 第一天跟一个已经完成的真实 case，从交付物反向追溯批准、规则、来源和发起人。
3. 第二天只拿 5–20 个真实或脱敏案例、规则/模板、一个专家和一个系统入口，建立 `input → expected work → output`。
4. 第三天做第一版 executable workflow，标出机械步骤、模型步骤、专家判断、确定性 verifier 和 review card。

这是一份现场入口草案，不是交付 SLA；具体客户节奏由项目 owner 决定。

## Legal Grammar

### Matter

```text
Matter
├── Client
├── Parties
├── Jurisdiction
├── Facts
├── Issues
├── Authorities
├── Evidence
├── Positions
├── Deadlines
├── Decisions
└── Work Products
```

### Contract

```text
Agreement
  → Clause
  → Term
  → Obligation / Right
  → Condition
  → Deviation
  → Risk
  → Recommendation
  → Redline
  → Negotiation
  → Approval
  → Execution
  → Post-signing Obligation
```

### Due diligence

```text
VDR
  → Document Inventory
  → Review Question
  → Finding
  → Evidence
  → Risk
  → Missing Information
  → Follow-up Request
  → Recommendation
  → Diligence Memo
  → Deal Term
```

### Dispute / arbitration

```text
Claim
  → Defense
  → Issue
  → Fact
  → Evidence
  → Witness
  → Authority
  → Chronology
  → Submission
  → Hearing
  → Procedural Order
  → Deadline
  → Remedy
```

这些 grammar 把“全文摘要”转成可检查的 case objects。高风险字段仍需 evidence、来源和律师/责任人 review；grammar 本身不能给出法律结论。

## Finance Grammar

### KYC / AML

```text
Customer / Entity
  → Document Collection
  → Identity / Beneficial Owner
  → Screening
  → Risk Factor
  → Risk Assessment
  → Exception
  → Analyst Review
  → Approval / Escalation
  → Monitoring / Refresh
```

### Credit / lending

```text
Borrower
  → Application
  → Financial Documents
  → Financial Metrics
  → Credit History
  → Risk Factors
  → Rating
  → Collateral
  → Credit Memo
  → Reviewer
  → Credit Decision
  → Conditions
```

### Regulatory / compliance inquiry

```text
Inquiry
  → Requirement
  → Deadline
  → Relevant Policy
  → Historical Precedent
  → Evidence Retrieval
  → Draft Response
  → Review
  → Submission
  → Audit Record
```

### Reconciliation

```text
Expected Record
  ↔ Actual Record
  → Match / Break
  → Reason
  → Evidence
  → Adjustment
  → Approval
  → Close
```

共同结构是 `case → evidence → exception → human decision → artifact`。对于 KYC、信用、合规和对账，Agent 可以准备 case、匹配记录、抽取指标和起草材料；最终风险判断、审批和外部提交仍由授权人负责。

## 四种跨领域 Review Grammar

| Review | 输入 | 人要决定什么 |
| --- | --- | --- |
| Exception Review | Expected、Actual、Difference、Evidence | 是否接受偏差、补证据或升级 |
| Evidence Review | Claim、支持/反驳来源、缺失证据 | 证据是否足以支持主张 |
| Decision Review | Question、Facts、Rule、Recommendation、Alternatives | 采用哪个决定以及后果 |
| Approval Review | Proposed action、Authority、Scope、Risk、External effect | 是否授权、修改或拒绝 |

这四类可与 [`review-space.md`](review-space.md) 的 New Decision、Conflict、External Send、Destructive Action 对接；具体 UI、字段和阈值仍需从真实 review trace 归纳。

## 可筹备的 Kit 资产

```text
field/       discovery · stakeholder-map · system-map · data-inventory
grammars/    enterprise · legal · finance
workflows/   current-state · target-state · exception-map
evals/       golden-set · acceptance · failure-taxonomy
artifacts/   meeting · executive-brief · poc · weekly-review · handoff
tools/       connectors · synthetic
patterns/
```

Synthetic 训练组可以包含合成合同、VDR、KYC case、credit application、监管问询和发票/对账异常；每组同时保存 raw input、schema、expected extraction、expected findings、edge cases、human decisions 和 final artifact。它们是未来可执行 fixture 的候选，不是当前已创建的资产。

## 待核实

- T3/A 中关于招聘、研究机构、云服务、行业 benchmark 和产品能力的外部主张需要独立来源登记；本地文档不把它们当作已核实事实。
- 法律与金融 grammar 只是抽象工作结构，不构成法律、信贷、合规或投资建议。
- 具体行业对象、审批权限、留痕与保留策略必须由客户 owner、法规和实际系统 contract 确定。
