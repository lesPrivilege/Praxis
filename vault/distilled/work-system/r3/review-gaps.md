# 成熟度 Review：横切缺口与停线条件

## 用户意图

用户希望回头 review 已较成熟的 Kit，补充容易忽略但真实驻场会遇到的面，并以“许愿”方式看清还缺什么（T9/U）。历史回答没有继续堆行业场景，而是列出治理、连续性、采用、交付和 closeout 等横切面（T9/A）。

## 缺口清单

| 面 | 应补的 contract |
| --- | --- |
| Identity & Access | tenant、账号、角色、API key、MFA、credential ownership、申请/回收、break-glass |
| Data Governance | 分级、出域、retention、删除、export、录音许可、敏感字段、legal hold |
| Runtime Routing | 任务路由、成本/延迟/隐私、fallback、离线和模型不可用处理 |
| Observability / Eval | 输入、工具、模型、state diff、人工修改、失败原因、replay |
| Delivery Lifecycle | discovery → pilot → acceptance → production → operate → closeout |
| Change / Adoption | friction、training、support、adoption metric、shadow workflow |
| Business Value | baseline、cycle time、throughput、error rate、人工时、风险减少、复用率 |
| Communication | 周报、decision memo、RAID、steering、handoff、升级口径 |
| Relationship | sponsor、process owner、expert、IT/security、blocker、champion、decision authority |
| Operational Continuity | backup、restore、设备丢失、断网、换电脑、换 Agent、人员更替 |
| Commercial / Admin | license、采购、报销、API budget、合同到期、公司/个人支付边界 |
| Closeout / Handoff | 交付、凭证清理、数据返还/删除、archive、可回流资产 |

## 优先补的治理对象

### Identity

登记 service、tenant、identity、device scope、credential owner、permission scope、expiry、allowed agents 和 write policy；不要保存密码。Agent 不能只知道“可以发邮件”，还要知道用哪个组织身份、向哪个 tenant 发送。

### Governance Plane

将 Source → Classification → Allowed Processing → Allowed Model → Allowed Destination → Retention → Disposal 固定为一条策略链。Project-local policy 只能收紧全局 policy，不能放宽；`praxis check` 可作为未来运行前 validator 的候选名称。

### Operations / Failure Grammar

```text
tool unavailable
permission denied
data stale
schema changed
API rate limit
model degraded
network unavailable
source conflict
human unavailable
deadline missed
wrong external send
```

每类异常只需先定义 `detect → contain → fallback → notify → recover → record`。它们很可能直接成为 Attention 的异常面。

### Project Lifecycle

```text
Discover
  → Frame
  → Baseline
  → Prototype
  → Pilot
  → Evaluate
  → Accept
  → Deploy
  → Operate
  → Scale / Stop
  → Close
  → Distill
```

Pilot 前至少需要 owner、real cases、baseline、expected output、acceptance criteria、fallback、data boundary 和 review owner。阶段名和门槛是候选，不替代当前 repo ADR。

### Adoption / Shadow Workflow

记录 current behavior、desired behavior、friction、incentive、training、trust、fallback 和 adoption metric；特别观察系统上线后仍与 Excel、微信或个人笔记并行的 shadow workflow，因为它揭示了产品尚未接管的真实工作。

### Closeout

项目结束应回答：谁继续拥有运行系统、哪些 credential 仍存在、哪些数据应返还/删除、文档与 unresolved risk 留在哪里、哪些内容可泛化。然后执行 customer handoff、credential cleanup、source retention/disposal、archive 和 promotion review。

## 停止扩张的判断

历史回答最后把 Praxis 的稳定目标收敛为：现实邮件、会议、文档、人员、系统和任务进入正确 Matter；Agent 完成整理、抽取、检索和机械执行；不同陈述被编译成事实、规则、分歧和待确认；真正改变状态的动作有 provenance；决策、异常、承诺、冲突和高风险外部动作进入 Review Space；客户特有数据留在 Project，泛化 grammar/workflow/eval/fixture 才治理回流 Kit。

这应作为成熟度 review 的目标描述，而不是已实现能力声明。

## 待验证

- T9/A 的横切缺口均是候选 backlog，尚无 Courtwork 实现或验收证据。
- adoption、business value、operations、closeout 需要真实客户项目和 owner 定义指标。
- “已成熟”不能由目录数量或 README 长度证明，需由运行 trace、失败案例、恢复演练和 review 结果证明。
