# Review Space：只把语义跃迁交给人

## 入口原则

用户明确考虑先用 Codex 手动 loop、让 Luna 做日常抽取，并希望 Courtwork 的 review space 从真实工作中自然生长（T2/U）。历史回答建议把人工 loop 当 instrumentation：Codex 显式执行和修正，Luna 做低风险重复抽取；等对象、字段、失败模式和 review 点稳定后，再考虑更快模型（T2/A）。

Review Space 的问题不是“Agent 能做什么”，而是：

> 什么状态变化值得打断人？

## 不值得占用 attention 的动作

这些机械动作可以逐步静默，但只有在确定性和可回滚边界已被验证后才可自动化：

- inbox 文件移动到项目；
- OCR、转写、格式转换；
- 补 metadata；
- 去除重复文件；
- 邮件归属 matter 的低风险建议；
- 已确认 action 投影到 waiting/next。

它们仍要保留 trace，不能因为静默就没有 provenance。

## 值得 review 的语义跃迁

| Review 类型 | 为什么需要人 | 常见动作 |
|---|---|---|
| New Decision | 改变后续工作的依据 | accept / edit / reject / defer |
| State Change | 项目事实发生变化 | review diff，确认生效范围 |
| New Commitment | 对内/对外形成义务 | 确认 owner、期限、措辞 |
| Ambiguous Ownership | 不知道谁负责 | 指定、退回或保留未决 |
| Scope Change | 工作边界变化 | 接受、拆分或要求重议 |
| Conflict | 新信息与既有记录冲突 | 对照来源、选择版本或保留冲突 |
| External Send | 内容离开本地 | 查看收件人、正文、附件后批准 |
| Destructive Action | 删除、覆盖、撤销 | 显式确认、范围和恢复条件 |
| Low-confidence Extraction | 模型不能稳定判断 | 查看原文，改字段或标记未知 |
| Stale / Unresolved | 需要选择继续、搁置或关闭 | 选择下一动作并记录原因 |

这些类别是 T2/A 的候选 taxonomy，不应自动扩张成新的产品枚举，需由实际 review event 聚类后再稳定。

## Review grammar

### Diff review

用户无需重读全文，只看相对当前状态的变化：

```diff
Scope
+ 增加：采购合同
- 暂停：劳动合同

Decision
+ Pilot 使用客户现有规则库

Open question
+ 历史合同是否允许进入云端模型？
```

Review 应绑定 source、旧值、新值、reason、scope、revision 和可回退方式。

### Commitment review

```yaml
commitment:
  deliverable:
  due:
  owner:
  source:
  status: proposed | accepted | rejected | deferred
```

按钮保持少量、动作清晰，例如 Accept、Edit、Ignore；不要因为是 Agent 产出就添加十几个控制项。

### Conflict review

```text
Possible conflict

Current state:
  Phase 1 includes knowledge base.

New evidence:
  “知识库先放到第二期。”

Source:
  project meeting · timestamp
```

冲突卡应同时展示旧 state、新 evidence、来源版本和下一决定，不把最新一句话自动覆盖既有事实。

### Attention review

候选 Attention 聚合：

```text
Needs you
Waiting on others
Changed since yesterday
Potential conflicts
Upcoming commitments
```

Attention 不等于任务清单或全文 trace；它是从 Action/Decision/Conflict/Commitment 状态投影出的工作入口。

## Review event 记录契约

历史回答建议先使用很薄的记录：

```yaml
review_event:
  source:
  proposed_change:
  reason_for_review:
  human_action:
  correction:
  should_require_review_next_time:
```

可扩展字段（候选）：

```yaml
  object_type:
  object_id:
  before:
  after:
  evidence:
  actor:
  scope:
  revision:
  result:
  next_action:
```

人类 action 可能是 accept、edit、reject、defer、assign、ask_for_context；这些词应由实际产品/服务 contract 最终决定。

## 用真实 trace 长出 Review Space

手动 loop 的每次判断都可以记录：

- 这里本来不需要问人；
- 这里必须问人；
- 全文没有意义，只给 diff；
- 必须给 provenance；
- 必须展示 before/after；
- 需要保留原文；
- 需要查缺失上下文；
- 当前建议可否自动 commit。

经过一段真实使用后再统计：哪些 review 高频、哪些可静默、哪些必须来源、哪些只需一句话。这比先设计完整 Review framework 更接近真实 attention 成本（T2/A）。

## 模型替换边界

无论抽取者是 Luna、Flash、本地模型还是其它 provider，上层应保持：

```text
input
  → extraction schema
  → confidence / provenance
  → proposed state diff
  → human review
  → committed state
```

模型是 runtime selection；Review Event、Matter State、Action、Decision 是稳定工作语义候选。

## 待核实

- “低风险”不能由模型自行声明；需要动作、权限、对象和后果 owner 定义。
- 是否使用 confidence 字段、阈值和显示方式需实证；本地 Courtwork 设计规则明确反对无校准依据的 confidence meter。
- Review Space 与 Courtwork Attention/Review/Commit 现有合同的精确映射需由项目 owner 处理，本文件不创造新 runtime。

