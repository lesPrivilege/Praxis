# Kit、Demo、Project 与回流生命周期

## 用户问题

用户提出两种施工组织方式：在 Kit 内建立 Demo 目录、项目仓库和 Worktree；或让 Demo/企业项目分目录、用索引互引；也提出 Demo 留在 Kit、生产时另建项目仓库，并把 Demo 调研/参考回收给 Kit（T2/U）。历史回答将它们合并成一个生命周期（T2/A）：Demo 属于 Kit，真实项目从 Kit fork 出独立 workspace/repo，项目产出经 distill 回流 Kit。

当前仓库的治理裁决见 [`ADR-006`](../../../docs/decisions/006-demo-project-vault.md)。本文件保留原对话模型；若与 ADR 冲突，以当前 ADR 为准。

## 三类长期对象

### Kit

Kit 保存长期知识和可复用实现：grammars、patterns、tools、connectors、playbooks、templates、canonical demos、references、registry。Demo 不只是截图，而是可运行的 reference implementation 候选。

### Project

当问题从“这个 workflow 能不能工作”变为“给客户 A 交付”，就进入独立 Project。Project 保存客户数据、matter、部署、交付、客户特有 schema/policy 和本地决定。它通过显式引用（例如 `praxis.lock` 或 `references/praxis.md`）记录所依据的 Kit revision，避免复制后失去来源关系。

### Worktree

Worktree 表示同一 repo 的并行施工，不表示知识归属或项目分类。它可以用于 Demo 或真实 Project 的 Codex/Agent 并发分支，任务结束后应可删除；具体 worktree 位置服从当前 repo/ADR 的治理。

## 进入与离开 Kit

```text
Kit canonical demo / pattern
  + client schema + connectors + policies + deployment constraints
  ↓
independent customer project
  ↓
candidate pattern
  ↓
sanitize
  ↓
generalize
  ↓
synthetic reproduction
  ↓
independent eval
  ↓
promote to Kit
```

只有独立验证后的可复用资产才能回流。客户原始数据、会议记录、账号、credentials 和客户专有 workflow 不回到 Kit；Project 只通过 index/lock/reference 指向 Kit。

## Demo 的两种状态

```text
demos/
├── experiments/
└── canonical/
```

`experiments` 用于短期字段抽取、模型吞吐、PDF parser 或新 connector 试验；它们可以消失。`canonical` 是完整场景的 executable documentation，至少应展示：

```text
raw input
  → normalize
  → schema extraction
  → workflow
  → review
  → artifact
  → eval
```

Canonical demo 应使用 synthetic data、明确 baseline、failure cases 和可复现运行说明，不带客户依赖。

## Research 的回流

Demo 阶段可以有 `research/scratch.md`、`links.md`、`vendor-notes.md`、`decisions.md` 等冗余材料。收敛后，只回流真正承重的选择、理由、适用条件、边界和对应可运行 Demo：

```text
demo research
  → scouts/
  → references/
  → decisions/ADR
```

Kit 保存“选了什么、为什么和何时适用”，而不是所有浏览过的链接。外部引用应按 trace gap 单独补充。

## 稳定性与核验

- 这是历史回答给出的生命周期建议；当前 repo 的目录和 promotion gate 由 ADR-006 与其它 ADR 决定。
- `praxis.lock`、`canonical/`、`experiments/` 是候选命名，不等于已存在的 runtime contract。
- “可运行”需要 fixture、schema、workflow、eval 和失败案例共同证明；README 或截图不能单独证明。
