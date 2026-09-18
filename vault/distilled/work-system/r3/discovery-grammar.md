# Discovery Grammar：让不同角色落到同一业务模型

## 用户意图

用户希望为会议访谈登记不同高管、业务人员和专业职能人员应关注的问题，避免各方各说各话；希望这些内容可以成为 Praxis 的长期工作 grammar（T10/U）。

## 历史 assistant 方案

历史回答建议所有访谈逐步填入同一组槽位：

```text
Objective
Actor / Role
Object / Case
Trigger
Input
Workflow
Rule
Decision
Approval
Exception
Evidence
System
Handoff
Artifact
Metric
Risk
Owner
Open Question
```

不同角色的表达不应自动成为同一类事实。候选 `assertion_type`：

```yaml
statement:
  speaker:
  role:
  assertion_type:
    - objective
    - policy
    - current_practice
    - exception
    - preference
    - hypothesis
    - decision
    - complaint
  content:
  evidence:
  confidence:
  conflicts_with:
```

尤其区分：制度规定怎样做、组织实际怎样做、某人希望以后怎样做。`confidence` 仍只是候选字段，不能把未核实主张伪装成概率事实。

## 按角色提问

### Sponsor / 高管

关注为什么现在做、成功标准、最贵的问题、不可出错之处、决策权、预算和 rollout boundary。候选问题：如果三个月后项目被认为成功，具体发生了什么变化？

### Process Owner / 业务负责人

问 trigger、入口、正常路径、handoff、判断依据、完成条件、常见 exception 和积压点。最好从一个最近真实 case 的最终交付物倒推批准、规则、输入和发起人。

### 一线人员

问实际打开的软件、信息来源、复制粘贴、找不到的材料、绕过 SOP 的情形、只能询问谁、返工来源和个人提醒方式；`show me` 通常比标准流程叙述更接近 operated world。

### 法律 / 财务 / 风控 / 合规

补 Rule、Evidence、Decision standard、Authority、Exception、Escalation 和 Audit：哪些可机械判断、哪些必须专业判断、判断必须看到什么、什么是硬规则、何时升级。

### IT / 数据 / 安全

问 system of record、data owner、source of truth、更新周期、可信字段、身份权限、出域限制、接口、失败恢复和生产事故 owner；还要区分流程规则与遗留系统限制。

## 四种现实世界

访谈循环可以固定为：

```text
Sponsor
  → Process Owner
  → Real Case
  → Frontline Observation
  → Professional Function
  → IT / Data
  → Contradiction Review
  → Back to Process Owner / Sponsor
```

它依次暴露：

```text
claimed world
  → operated world
  → governed world
  → system world
  → reality model
```

一条单独陈述不能代表完整业务事实。每轮结束后候选抽取结果应分成：`Agreement`、`Contradiction`、`Unknown`、`Exception`、`Dependency`、`Needs verification`。

## 持续 artifact

会议 transcript 只是 Source；真正推进工作的是持续更新的状态文件：

```text
discovery/
├── stakeholders.md
├── glossary.md
├── workflow.md
├── rules/
├── exceptions/
├── systems.md
├── data-sources.md
├── decisions.md
├── contradictions.md
└── open-questions.md
```

候选循环：

```text
meeting
  → extract claims
  → classify
  → compare existing state
  → discover conflict / delta
  → review
  → update discovery model
```

## Universal Discovery Canvas

面对陌生业务，先填：

| 维度 | 要搞清楚什么 |
| --- | --- |
| Outcome | 最终为什么做 |
| Case | 一次工作的基本单位 |
| Actor | 谁参与 |
| Trigger | 什么启动 |
| Input | 需要哪些材料 |
| Flow | 正常怎么走 |
| Rule | 根据什么判断 |
| Exception | 何时不按正常路径 |
| Decision | 谁决定什么 |
| Evidence | 决策依据 |
| System | 信息在哪里流转 |
| Output | 最终留下什么 |

如果这些仍填不出来，先不讨论 RAG、Agent、模型或知识图谱。Discovery 的副产品是找出必须重新问人的位置：说法冲突、规则与实际冲突、证据不足、超授权、无 precedent 或未确认 commitment；这些位置是 Review Space 的原始材料。

## 待验证

- 访谈槽位、assertion_type、contradiction-register 和 Canvas 是候选方法，不是现有 Courtwork schema。
- T10/A 的 Palantir/Anthropic 外部主张含 1 个引用占位，由 trace_gaps 流程负责，不在此处验证。
- `confidence` 的取值、显示与阈值需要真实 trace；不能仅凭字段名增加自动化信任。
