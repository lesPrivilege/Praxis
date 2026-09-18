# Expert、Kit、Skill、Tool：不要把工作世界压成一段 Skill

## 用户意图

用户认为撰写、汇报、PPT 等局部工作可以作为 Skill，Kit 中的长期索引继续维护；如果把大体系全部放进 Skill，层次会不清楚（T2/U）。用户进一步提出 Expert 可以成为 composer 的一级语义，Model 降为二级 runtime，并担心 Skill 在 Codex 中造成 attention drift（T3/U）。

## 历史 assistant 方案

历史回答给出以下候选层级：

```text
Expert
  ↓
Kit
  ↓
Skill / Workflow
  ↓
Tool / Script / MCP / CLI
  ↓
Runtime / Model
```

其语义分工是：

| 层 | 回答的问题 | 候选内容 |
| --- | --- | --- |
| Expert | 谁负责这件事？ | Praxis、Legal、Research、Codex；角色、权限、状态绑定、升级和 runtime |
| Kit | 它如何理解和治理工作世界？ | grammar、policy、schema、workflow、references、patterns、eval、registry |
| Skill | 这一类局部工作怎么做？ | 输入、步骤、约束、工具提示、输出 artifact、验收 |
| Tool | 用什么执行？ | API、CLI、MCP、脚本、浏览器或文件系统能力 |
| Model | 当前用什么 brain？ | Flash、frontier、local 或其它 runtime 参数 |

可以把 Skill 视作薄的 execution entrypoint：

```text
SKILL.md
  → 何时调用
  → 输入与输出
  → 先查哪些 Kit 索引
  → 遵守哪些约束
  → 调用哪些工具
  → 怎样验收
```

Kit 文档保留 canonical knowledge；Skill 通过稳定引用消费 Kit，而不是复制整套方法论。候选接口形态如 `skill(context, kit, tools) → artifact`，说明 Skill 是程序步骤，Kit 是其工作环境。

## Attention topology

历史回答把 attention drift 描述为：过大的 Skill 与 repo instructions、user prompt、其它 skills、tool descriptions、历史 session 同时进入上下文时，模型可能把 governing context 当作普通局部指引。该解释是设计假设，不是对模型内部权重的测量。

更稳的候选权威顺序：

```text
Expert Contract
  ↓
Kit Policy / Environment
  ↓
Project-local Policy
  ↓
Workflow / Skill
  ↓
Task prompt
```

数据边界、凭证 scope、工具权限、外部发送门槛、workspace root 和允许模型等“重要到不能遗忘”的约束，不应只依赖 prompt attention，应由 runtime 或环境能力 enforce。Kit 之间的切换也不应只是追加 prompt；候选做法是 Expert handoff，只携带 objective、matter、relevant sources、known facts、open question、constraints 和 expected output。

## Expert 与 Model

历史回答建议 composer 的一级选择显示 `Praxis`，二级才显示 Runtime、Escalation、Workspace 和 Policy。切换 Expert 应改变 identity、Kit、context compiler、tool visibility、extension set、model routing 与 review policy；同一 session 中变身会混合两套 tool semantics 和 policy，候选做法是新建 handoff session，并保留 parent/handoff/provenance。

## 待验证与边界

- Expert/Kit/Skill/Tool/Model 是本轮的产品语义候选，不代表 Courtwork 已有对应 runtime contract。
- `praxis://...`、Expert composer UI、handoff package 和权威层级仍需由 Courtwork owner 设计、fixture 和 trace 验证。
- Model 选择不能替代当前 state、policy、evidence 和人审；模型切换不应改变工作事实。
