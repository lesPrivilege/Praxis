# 抗折旧：把专业工作制度外置成可执行结构

## 用户意图

用户明确希望在模型后训练尚未内化专业工作制度时，用外部结构保持长期有效；通过字段编排 Expert，把 Expert 的训练调整为 Worker 的训练，并把有语义的执行 trace 回灌后训练（T1/U）。

## 历史 assistant 方案

历史回答将这条路线概括为：SE 不与模型能力竞争，而是在模型尚未学会专业制度时，把制度外置为结构；成熟后的 trace 可同时成为训练数据和验收契约（T1/A）。但回答也修正了一个可能过强的表述：`system / user / AGENTS.md / Skill / retrieved context` 的作用差异不应简单归因于 Transformer attention 权重，还受 harness 指令层级、上下文位置、检索时机、工具权限和 runtime enforcement 影响。

## 稳定边界

候选 Expert schema：

```text
Expert
├── role
├── domain
├── policy
├── tools
├── review boundary
├── escalation
├── state binding
└── runtime
```

候选 semantic execution trace：

```text
Task
Matter
Role
State
Source
Rule
Decision
Action
Exception
Review
Outcome
```

并记录：

```text
context selected
  → tools called
  → intermediate state
  → proposed action
  → human correction
  → accepted result
```

例如合同审查可以记录 `matter_state=negotiation`、适用规则、观察到的偏差、Agent proposal、human correction 及 correction reason。它比单独保存 prompt/response 更能表达“在什么状态、依据什么规则、采取什么动作，以及人为什么修改”。

## 什么可能内化，什么不能外包给权重

模型后训练可能逐渐内化：如何调查、起草、使用 evidence、识别 exception 和安排步骤。但以下内容应继续由 schema/state/policy 承载：

```text
当前客户
当前有效政策
当前授权额度
允许出域的数据
审批人
项目当前状态
有效合同版本
```

因此可保持：

```text
Model weights = 怎么工作
Schema / State / Policy = 这次工作的现实是什么
```

随着模型能力提高，易折旧的是“如何操作模型”的说明；长期稳定的是对象、状态、权限、证据、决策和 review contract。

## 反馈环

```text
现实工作
  → Schema Engineering
  → Expert execution
  → Semantic trace
  → Human review / correction
  → Validated worker trajectory
  → Post-training / eval
  → 模型内化部分工作模式
```

外部结构不会因此消失，而是从行为脚手架转成治理接口。它负责让现实 state、policy、evidence 和权限保持可见、可检查、可迁移。

## 待验证

- “后训练会吸收哪些结构”是长期研究假设，不能当作当前模型能力承诺。
- semantic trace 的字段、脱敏、保留和训练用途需要数据 owner、privacy policy 和实际 eval 决定。
- 本轮没有运行模型、采集 trace、训练后模型或测量 attention；相关内容是设计建议。
