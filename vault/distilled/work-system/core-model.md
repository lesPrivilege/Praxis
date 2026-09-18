# Core Model：事件、状态、上下文与 workspace

## 先固定工作对象

驻场工作不应按使用了哪些 Agent 设计，而应按“现实事件 → 结构化对象 → 状态更新 → 后续动作”设计（T3/A）。候选稳定对象：

```text
Meeting
Person / Organization
Matter / Project
Decision
Action
Open Question
Evidence / Source
Artifact
Follow-up
```

这些是工作系统的候选 schema，不等于 Courtwork 现有 runtime schema；要以本地 owner contract 和实际使用轨迹校准。

## Event ≠ State ≠ Context

```text
Event log
  = 发生过什么

Matter state
  = 当前哪些事实生效、范围是什么、下一步是什么

Model context
  = 下一次工作为完成任务需要看到的、经过选择和编译的材料
```

会议是 event；项目现状是 state；模型下一次需要的是 state + 相关 evidence/context，而不是每次从 transcript 重新理解整个项目。三者相互关联但不能混用：

- Event 追加事实，不自动等于已确认决定；
- State 只反映已提交/接受或按明确规则生效的变化；
- Context 是面向任务的投影，可有 scope、版本和排除项；它不应隐形截断或把猜测装成事实。

这是历史回答在 T3/A 中给出的核心区分，适合与 Courtwork 本地的 projection 不创造事实、状态 owner 负责语义的规则对齐。

## 会议的五层产物

一次会议不应只得到一篇“会议纪要”。候选产物分五层：

### 1. Raw record

保存 audio、transcript、meeting invite、chat/screenshots、白板/现场材料、原始附件和 source metadata。此层不解释事实，保留 provenance。

### 2. Meeting Record

```yaml
meeting_id:
title:
date:
location:
participants:
related_project:
purpose:
topics:
decisions:
open_questions:
action_items:
risks:
dependencies:
references:
```

它把会议变成可继续运行的对象，不只是摘要全文。

### 3. Decision

```yaml
decision:
  statement:
  owner:
  status: proposed | confirmed | superseded | rejected
  source:
  effective_date:
  supersedes:
```

只有在责任人/规则确认后，才把会议中一句候选话语升级为有效 Decision。

### 4. Action

```yaml
action:
  task:
  owner:
  due:
  status: proposed | waiting_external | in_progress | done | blocked | stale
  source:
  related_decision:
```

Attention 主要消费 Action 投影；Action 关闭后从当前 Attention 视图消失，原记录仍保留。

### 5. Matter State Update

```yaml
scope:
  included: []
  excluded: []
current_blockers: []
next_milestone: []
```

状态更新只在关键变化经过 review/commit 后生效。具体状态词、权限和保存事实由产品/domain owner 决定。

## 标准循环

```text
Capture
  → Normalize
  → Extract
  → Diff
  → Commit
  → Follow
```

### Capture

录音、聊天、附件、截图、白板照片和临时笔记统一进入 Inbox；保留原始文件与来源。

### Normalize

转写、OCR、文件转换、重命名、时间戳、参与者和 source metadata 补全。确定性工具先做机械整理，不能让模型承担 OCR/解压/格式迁移。

### Extract

提取 participant、topic、decision、action、owner、deadline、open question、risk、dependency、reference；输出必须绑定来源和不确定性。

### Diff

关键问题不是重新总结所有历史，而是：相对于当前 Matter State，这次事件改变了什么？

```text
Scope       + 增加合同审查 / - 暂停知识库
Decision    + 首期使用私有部署模型
Blocker     + 缺失财务字段定义
Action      + 某负责人提供字段表
```

此处的示例来自历史回答，仅说明 diff 形态。

### Commit

人确认关键 Decision、Action、scope 或 state diff 后，写入 workspace；只把“提出”写成“生效”会损害后续上下文。

### Follow

Attention 后续主要投影 overdue、waiting_external、unresolved、upcoming、stale；不把每个机械 housekeeping 都升级成需要人的任务。

## Workspace 组织

按 Matter/Project 组织，而不是按文件类型分桶：

```text
workspace/
├── inbox/
│   ├── capture/
│   ├── documents/
│   ├── messages/
│   └── requests/
├── projects/
│   └── client-a-contract-review/
│       ├── matter.md
│       ├── state.yaml
│       ├── meetings/
│       ├── decisions/
│       ├── actions/
│       ├── sources/
│       ├── artifacts/
│       ├── drafts/
│       └── deliverables/
├── people/
├── organizations/
├── templates/
├── reference/
└── archive/
```

`matter.md` 面向人类阅读；`state.yaml` 面向 Agent 消费。会议可以进一步固定为：

```text
meetings/<date-topic>/
  record.md
  transcript.md
  audio.m4a
  extraction.yaml
  attachments/
  source.json
```

## Attention 是投影，不是第二数据库

候选目录：

```text
attention/
├── inbox.md
├── waiting.md
├── next.md
├── upcoming.md
├── blocked.md
└── followups.md
```

它们应由 Project/Action 状态投影生成，不复制另一份真相；事项关闭后从 Attention 消失，但原 Action、Decision、Event 和 provenance 保留。

## Requests 与 housekeeping

外部“周五前给张总一版”“整理三年合同”“下周做汇报”等真实要求应尽早变成 Project/Action；不要长期留在聊天中。

第一阶段 Agent 的价值更多是 housekeeping：归属 matter、重命名、provenance、OCR/extract、索引、去重、检查 Action 和 State 是否变化、生成 follow-up；需要判断的语义跃迁再进入 Review Space。

## 待核实

- 以上对象字段与状态是候选 schema，不等于现有 Courtwork Core/API 字段。
- 录音 consent、数据驻留、客户设备与账号边界必须按现场政策确认。
- `state.yaml` 是否最终采用、文件名/目录是否进入实现，需要与现有 workspace contract 对齐。

