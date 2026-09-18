# Praxis Agent：第一个 managed Expert 的候选边界

## 用户意图

用户认为 Praxis 可以成为 Courtwork 第一个入驻的 Expert；它应接办公、会议、文档、workspace 和 Agent Ops 工作，并把真正需要高模型能力或高 computer use 的事情交给 Codex（T4/U、T6/U）。用户同时要求不必过早过度工程化，可以先用通用 Agent 编排。

## 历史 assistant 方案

历史回答区分：

```text
Praxis Kit
  = environment / grammar / policy / workflow index

Praxis Expert
  = Courtwork 中消费 Praxis Kit 的 managed agent
```

候选 v0 形态：

```text
Generic Agent
  + Praxis environment
  + Praxis AGENTS / Skills / MCP
  + Flash model
  = Praxis Agent v0
```

Praxis 的默认工作可窄化为：

- inbox intake、meeting/mail extraction、document classify；
- workspace housekeeping、schema projection、matter state diff；
- attention queue、follow-up、tool orchestration、Agent Ops ledger。

不默认负责大规模代码施工、高难度 reasoning、GUI-heavy computer use、架构级修改和高风险不可逆操作；候选升级路径是 `Praxis → escalate → Codex`。

候选 Expert Contract：

```yaml
expert:
  id: praxis
  role: enterprise-work steward
  runtime:
    default: generic-agent
    preferred_model: flash
  environment:
    kit: Praxis
    workspace: active-project
  permissions:
    governed_by: project-policy
  escalation:
    hard_reasoning: codex
    computer_use: codex
    external_commitment: human
    policy_conflict: human
  state:
    own: false
    source: enterprise-workspace
  outputs:
    - proposed_state_diff
    - attention_item
    - artifact
    - run_record
```

关键边界是：**Expert 不拥有事实，Workspace 拥有事实。** Praxis 可以更换 runtime、模型或 Harness，项目 state 不随之消失。

## Courtwork 入口关系

历史回答建议 Praxis Expert 由 Chat、Attention、Spark 三入口共同调用，而不是新增第四个主入口：

```text
Chat       → ingest / organize request
Attention  → check state / produce diff / surface review
Spark      → OCR / transcribe / classify / extract / index / redact
Praxis     → interpret results as work state
Codex      → hard reasoning / coding / computer use / complex execution
```

这些是候选职责分工；当前 Courtwork 是否具备 Experts Core、managed session、heartbeat、handoff 或 tool restriction，不能由历史对话声称已实现来证明。

## Runtime 与模型路由

Praxis 的重复任务更关注吞吐、延迟、结构化输出、tool use、长上下文、成本与并发；候选路由为：

```text
Flash       → routine extraction / classification / routing
Frontier    → ambiguity / conflict / hard judgment
Codex       → coding / computer use / complex execution
```

用户的真实目标是工作责任由 Expert 表达，Model 只是 runtime 参数；使用者不必手工选择每次模型，但实际路由必须受 data class、policy、成本和 review contract 约束。

## 待验证与不实施项

- Praxis Agent 仍是候选 managed Expert，不在本轮创建 Courtwork 实现、extension、MCP 连接或 bootstrap。
- Flash、Codex、通用 Agent、Spark 等名称来自对话上下文，不证明当前账号、模型或 Courtwork runtime 可用。
- 需要用真实 run 验证 Expert identity、workspace binding、tool scope、review output、escalation 和 handoff，再决定是否独立 fork/runtime。
