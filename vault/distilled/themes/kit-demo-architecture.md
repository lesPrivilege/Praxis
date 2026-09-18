# Kit、demo 与外部索引的架构边界

## 定位

用户在 T3/U 明确想先做一个 Kit，把外部选型和成熟实践整理好，以后开工不临时编排，并希望 demo repo 有治理、前端对齐企业中台样式。历史回答将其命名为 **Enterprise Demo Kit / Demo Foundry**（T3/A）。命名是 assistant 建议，尚未被用户正式裁决。

核心边界候选：

```text
Kit
  = 可复用的产品 grammar、组件、contract、fixture、adapter、工程治理

Scenario demo
  = 具体对象、schema、policy、样本、expected result、演示叙事

Reference index
  = 外部实践的消费入口，不自动变成依赖
```

## 三个面

```text
ENTERPRISE DEMO KIT
│
├── Build Surface
│   ├── 有限的默认运行路径
│   ├── local runtime / compose
│   ├── 默认 UI 与 API contract
│   └── 可替换 provider/adapter
│
├── Product Grammar
│   ├── Object / Table / Detail
│   ├── Task / Review / Evidence
│   ├── Decision / Workflow / Audit
│   └── Permission / Schema / Fixture
│
└── Reference Index
    ├── 前端与设计系统
    ├── SaaS 与内部工具
    ├── Workflow / HITL
    ├── Identity / Policy
    └── field → platform 实践
```

这张分层图是 T3/A 的建议。Build Surface 应保持小，Product Grammar 应稳定，Reference Index 可以扩张；外部参考不因为先进或流行就自动进入 Build Surface。

## 建议的 demo repo 形态

历史回答建议用 scenario 目录作为 demo 的核心：

```text
enterprise-demo/
├── apps/
│   └── web/
├── services/
│   └── api/
├── packages/
│   └── ui/
├── contracts/
│   ├── openapi/
│   └── schemas/
├── scenarios/
│   └── contract-review/
│       ├── scenario.md
│       ├── schemas/
│       ├── policies/
│       ├── fixtures/
│       ├── expected/
│       └── demo.md
├── adapters/
│   ├── llm/
│   ├── storage/
│   ├── identity/
│   └── enterprise/
├── docs/
│   ├── architecture/
│   ├── grammar/
│   ├── design/
│   ├── decisions/
│   ├── research/
│   └── verification/
├── tests/
│   ├── contract/
│   └── e2e/
└── infra/
    └── compose.yaml
```

这是 assistant 的结构草案，不能当作当前仓库的架构要求；实际根架构应以仓库中的治理裁决和当前实现为准。

Scenario 自足说明的问题应包括：

```text
worker 在做什么？
有哪些对象？
输入是什么？
期待输出是什么？
AI 可以决定什么？
人必须决定什么？
证据如何显示？
发生什么状态变化？
```

## 单向依赖与 promotion 候选规则

```text
Enterprise Kit
      ↓
Generic Demo
      ↓
Industry Scenario
      ↓
Customer Overlay
```

客户特殊逻辑不应反向污染 Kit。回答给出一个保守的晋升规则：

```text
第一次出现       → scenario-local
第二个独立场景   → reusable candidate
第三个独立场景仍需要 → promote to Kit primitive
```

历史回答给出的次数规则已经由仓库 ADR 细化：第一次保持 scenario-local；第二个独立场景进入 candidate；第三个独立场景在稳定契约与 fixture/验证齐备后才可申请 shared primitive，且需经 ADR 裁决。详见 [`docs/decisions/002-promotion.md`](../../../docs/decisions/002-promotion.md)。

## 首批可能稳定的 primitives

回答列出：

```text
AppShell
ResourceTable
ObjectDetail
TaskQueue
ReviewWorkbench
Finding
Evidence
Decision
AuditTimeline
Permission
Workflow State
Schema Contract
Fixture Contract
Provider Adapter
```

这些名称应先作为候选词表；是否纳入 Kit，需要至少一个 scenario 的 contract、fixture 和验收 evidence 支撑。

## UI contract 与治理

回答建议把 `component × state × fixture` 变成 executable UI contract。`FindingCard` 等组件至少应能复现 default、accepted、rejected、escalated、low-confidence、missing-evidence、loading、error、permission-denied 等状态（T3/A）。

这可与用户提到的 CW 治理对齐，但 CW 的具体规则没有出现在本线程，不能假设两者完全相同。当前可采纳的治理方向是：

- design grammar、architecture contract、scenario contract 先于 Coding Agent 开工存在；
- fixture 和 expected result 是验证资产，不只是演示数据；
- 客户差异进入 config/policy，行业共性进入 schema/evaluator，执行能力进入 runtime/platform；
- 每次 promotion 记录来源 scenario、重复证据和回退方式。

## Reference Index 组织建议

原回答建议的外部索引分组包括：

```text
frontend / design-systems / saas / internal-tools
workflow / governance / field-practice
```

每个索引条目保持：Source、Status、Why indexed、Grammar、Reusable primitives、Do not copy、When to revisit、Last reviewed。外部链接和状态需由另一个登记流程补齐；本次不重新浏览外部源。

## 待核实与不应越界的点

- Kit 是否采用 React/Vite、FastAPI、Ant Design 等默认组合，见 [`tech-stack-boundaries.md`](tech-stack-boundaries.md)，本次未将其升格为用户裁决。
- 具体 repo 目录是否适合当前工作区，需查现有根架构和 CW 治理，不能仅凭历史草案改造。
- promotion 的次数、验收证据、版本与废弃策略需由治理负责人裁决。
- 本文件只提出治理建议，未修改任何根目录或生产架构。

## 来源

Kit 需求：T3/U、T6/U、T7/U。  
Kit/demo 边界与 repo 草案：T3/A。  
grammar/UI contract：T3/A、T4/A。  
field → platform promotion：T7/U、T7/A。
