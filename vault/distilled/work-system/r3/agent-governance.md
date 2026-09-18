# Agent Governance：账号、数据、模型、额度与运行账本

## 用户意图

用户要求治理 Agent 使用了哪些模型、完成了哪些任务、产生哪些 trace、消耗多少 quota；同时要求驻场客户数据、企业账号权限和 fresh Mac 工作流有完备隔离，避免隐私和丑闻风险（T8/U）。

## Governance Plane

历史回答建议把每次处理拆成：

```text
Source
  → Classification
  → Allowed Processing
  → Allowed Model
  → Allowed Destination
  → Retention
  → Disposal
```

候选数据等级：

```text
P0 Public
P1 Internal
P2 Client Confidential
P3 Restricted / Secret
```

候选约束是：P0 可走批准的 frontier；P1 走企业批准 provider；P2 走客户/公司批准环境或本地；P3 默认不进入通用模型 context，只允许明确授权的本地/主权处理。等级、允许 provider、保留期限和删除规则必须由实际公司/客户 policy 编译，Praxis 不能自行宣布某 provider 安全。

## Identity 与权限

账号是工具调用前的治理对象：

```yaml
identity:
  service:
  tenant:
  role:
  device_scope:
  credential_owner:
  permission_scope:
  expires:
  allowed_agents:
  write_policy:
```

Agent 执行读 SharePoint、发邮件或访问客户数据库前，应知道以谁的身份、在哪个 tenant、凭什么权限执行。密码、token、cookie 不进 Markdown、Git 或 run log；Praxis 只引用 secret handle。读、draft、send、delete 应分别登记，外部发送和破坏性动作默认进入 human review。

## Model routing 与 quota

候选 model registry 字段：

```yaml
provider:
model:
deployment: cloud | company-cloud | local
data_classes_allowed: []
capabilities:
  reasoning:
  extraction:
  coding:
cost:
latency:
context:
```

任务路由输入为 data classification、intelligence requirement、latency requirement 和 cost ceiling，而不是固定绑定某个模型名。应记录 quota/credits、input/output tokens、estimated cost、latency 和 fallback；真实 provider、价格、额度和模型可用性未从本聊天验证。

## Work Ledger

不保存模型私有 reasoning，保存可审计的工作事实：

```yaml
run:
  id:
  timestamp:
  project:
  task_type:
  provider:
  model:
  data_class:
  context_refs:
  tools:
  actions:
  input_tokens:
  output_tokens:
  credits:
  estimated_cost:
  latency:
  proposed_changes:
  committed_changes:
  review:
    required:
    result:
    correction:
  failure:
  retry:
```

`context_refs` 应优先指向 `src://meeting/...`、`src://mail/...` 等 source identity，不把完整客户材料复制进日志。一个月后可以按 accepted-without-edit、correction rate、tool-call failure、escalation、human review minutes 和 cost per accepted artifact 评估 Luna/Flash/Codex 的路由，而不是凭感觉比较。

## Promotion 与 privacy

公共 Praxis 只保存方法、grammar、workflow、eval 和 synthetic fixture：

```text
candidate
  → inspect provenance
  → remove customer identifiers
  → generalize
  → synthesize fixtures
  → leakage review
  → promote
```

发现 enterprise source、raw transcript、customer email、内部域名、secret 或可识别主体时，promotion 应拒绝。开源 Praxis 只能被企业 workspace 消费，不能自动反向同步客户材料。

## 待验证

- P0–P3、identity schema、run ledger 和 quota 指标是候选治理 contract，不是现有 Courtwork 已实现能力。
- 数据等级、租户/账号、provider allowlist、留存/删除和外发审批必须由客户与公司安全 owner 定义。
- 用户提到的“无 quota”只是当时工作约束，不应推断当前账户额度、模型状态或平台限制。
