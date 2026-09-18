# 技术栈图景与边界

## 先说结论

用户要求探索企业中台常见前后端技术栈和设计软件，以取得图景（T6/U），但不要求把实现细节本身作为工作目标（T4/U）。因此本文件把两种信息分开：

1. **理解 grammar 所需的常见层次**；
2. **历史回答建议的 demo 默认路线**。

第二类没有被用户最终选定，不能直接当作当前项目的技术决策。

## 六层企业中台图景

| 层 | 对话中出现的常见选择 | 需要理解的职责 |
|---|---|---|
| 前端 Shell | React + TypeScript + Ant Design；Vue + Element Plus | 菜单、权限、表格、表单、详情、审批、Dashboard |
| 业务后端 | Java + Spring Boot；Go / Node；AI 服务常独立 Python | API、业务规则、事务、系统集成 |
| 数据与检索 | PostgreSQL / MySQL、Redis、Kafka、对象存储、OpenSearch | 业务状态、缓存、事件、文件、检索 |
| Workflow | Camunda、Temporal | 长任务、审批、HITL、重试、状态机 |
| 治理 | OIDC/SAML、Keycloak/企业 IdP、OPA、OpenFGA、Audit Log | 身份、权限、策略、审计 |
| Design / Dev | Figma、Storybook、Design Tokens、Camunda Modeler、Penpot | UI 规范、设计到代码、流程建模、可复现状态 |

以上是 T6/A 的认知地图，产品名仍需外部源/项目环境核验。它回答“系统通常由哪些职责构成”，不回答“当前 Kit 必须采用什么”。

## 可能的默认 golden path（未裁决）

历史回答给出一套有限的候选路线：

| 层 | 候选默认 | 替代/scale lane |
|---|---|---|
| Web | React + TypeScript + Vite | Next.js：外部门户、SSR 或公开页面 |
| Enterprise UI | Ant Design | Blueprint、MUI X、AG Grid 作为参考/升级路径 |
| App grammar | 自封装少量 Workbench primitives | Refine / Ant Design Pro 作为成熟参考 |
| Server state | TanStack Query | 通常不需替换 |
| API | FastAPI + Pydantic | NestJS / Spring Boot 按客户环境替换 |
| Contract | OpenAPI + JSON Schema | 保持语言无关 |
| DB | PostgreSQL | 客户 ERP/DB/Data Platform |
| File | local filesystem adapter / S3-compatible adapter | 企业对象存储 |
| Workflow | 有限 state/action contract | Camunda / Temporal |
| Auth | demo personas / fake roles | OIDC / 企业 IAM |
| AI | provider adapter | 私有模型、云模型、gateway |
| UI verification | Storybook + MSW + Playwright/Vitest | visual regression / CI |
| Local runtime | Docker Compose | 企业部署体系 |

这是 T3/A 的 proposed default，不能称为“已定 golden path”。若要写入实际 kit，应先根据现有仓库约束、团队能力和首个场景做裁决。

## 边界原则

### 前端先平台化，后端可替换

回答的判断是：不同客户的后端可能是 Java、Python 或直接接 ERP API，而专业 worker 的工作面 grammar 更稳定，因此 Kit 可优先沉淀 AppShell、ResourceTable、ObjectDetail、ReviewWorkbench、TaskQueue、AuditTimeline、Compare/Diff、ExceptionPanel 和 AI Assist（T3/A）。这是平台化优先级建议。

### Schema 作为跨层 contract

候选对象如 `ContractSchema` 可同时承担：

```text
LLM structured output
  ↓
API validation
  ↓
database persistence
  ↓
frontend rendering
  ↓
eval fixture
```

回答还建议优先采用关系模型，演化字段可用 JSONB，向量库不应因为 AI 自动成为第一依赖（T3/A、T6/A）。这是设计候选，是否适合当前数据量和检索任务需测量。

### Workflow 先用有限状态与动作

首个 demo 可只表达：

```text
draft → submitted → ai_reviewed → human_review
      → approved / rejected / escalated
```

先把 `state / action / actor / event` 定义清楚；Camunda 更适合业务人员需要理解的 BPMN/human task，Temporal 更适合工程拥有的 durable execution。两者是 scale lane，不是首个 demo 的自动依赖（T3/A、T6/A）。

### Auth 与权限分阶段

demo 可以用 personas/fake roles 表达权限 grammar；生产阶段再接 OIDC/企业 IdP。OPA 偏 policy-as-code，OpenFGA 偏关系型授权，Keycloak 偏身份/协议。这里是抽象边界，不是对具体供应商的选型结论（T3/A、T6/A）。

### UI 状态必须可复现

Storybook 的建议重点不是组件展示，而是把 `component × state × fixture` 变成 UI contract。应覆盖 loading、empty、error、disabled、permission-denied、AI-running、needs-review、accepted、rejected、escalated 等状态（T1/A、T3/A、T6/A）。

### 观测与审计属于产品可信度

回答把 OTel、Audit Log、Evidence、Trace 放在治理层；但本线程没有确定事件模型、敏感字段、保留期限或客户合规规则。需要在首个 scenario 明确最小 trace contract 后再选工具。

## 外部参考的使用边界

对话中的 Ant Design Pro、Refine、Storybook、MUI X/AG Grid、Blueprint、Camunda、Temporal、Keycloak、OpenFGA、OPA、Figma、Penpot、Appsmith、Retool、Scale 等均是参考索引候选。它们用于逆向 grammar、边界或成熟做法，不表示要全量引入。

外部版本、当前 API、许可和产品能力未在本次重查；相关主张保留为待核实，引用占位缺口登记在 [`../../intake/materials.json`](../../intake/materials.json)。

## 待裁决清单

- 是否真的采用 React/Vite + Ant Design + FastAPI + PostgreSQL 作为当前 kit 默认。
- 是否把 Storybook/MSW/Playwright/Vitest 作为强制验证面，还是首个 demo 的建议面。
- 首个场景是否需要关系数据库、对象存储、全文检索或只用本地 fixture。
- fake roles 的权限范围与未来 IAM adapter 的 contract。
- workflow state/action contract 的命名、版本和向后兼容规则。

## 来源

不追求实现细节：T4/U。  
技术层图景：T6/U、T6/A。  
候选默认栈与 Kit 边界：T3/U、T3/A。  
工作面 grammar 与 UI contract：T3/A、T4/A。
