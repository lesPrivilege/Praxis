# ADR-044：仓库目录按角色分流，源流只走一个方向

日期：2026-10-26。状态：accepted（第一、二阶段已施工；第三阶段等插件测试告一段落）。用户提出 Kit、Vault 与产物管理混乱，要求一套源流清晰、可渐进披露的目录结构；主会话（Claude Fable 5.1）盘点现状后起草，用户同日同意搬动并清理过程性文件。施工按 [迁移工单](../governance/repository-layout-migration.md)分三阶段，旧新路径见 [迁移映射](../governance/repository-layout-map.md)。

## 问题与依据

登记层已经能回答“这件产物读了什么”：来源在 `vault/registry.json` 与各 catalog，产物与运行在 `dsh-praxis/data`，裁决在 ADR，回执在 `docs/verification`。目录层没有与之对应的分流，所以东西落在离手最近的地方。2026-10-26 盘点：

- **根目录叠着两套逻辑。** 按生命周期分的 `vault / docs / kit`，和按主题或项目分的 `jev / palantir / tally / books / dsh-praxis-explainer / demos/*`。[ADR-041](041-dsh-praxis-projects.md) 把项目定义为带布局的目录，没有说目录放哪，于是每件新交付在根目录开一层。
- **Kit 有两个家。** `kit/` 管企业工作、契约与环境；`dsh-praxis/kit/` 管内容表达；`dsh-praxis/` 同时装控制面代码、运行数据和插件文档。读者要先知道这段迁移史（[ADR-016](016-progressive-kit-structure.md)、[ADR-037](037-dsh-praxis-layered-grammar.md)）才找得到入口。
- **临时物没有合法去处。** 根目录的 `lean-readme.md`、`qlib-readme.md`、`rdagent-readme.md`、`tradingagents-readme.md` 是 capture 时落下的原件，卡片在 `vault/provenance/praxis-captures/`，原件却在根目录且未登记为快照。`render.log`、`quality/` 检查帧、`vault/snapshots/local/downloads/rsi-review-*` 是三种日志，各在一处。`.gitignore` 按个别 demo 列外，不按角色列外。
- **一件交付的来路要拼四处。** 来源、产物与运行、裁决、回执分别有索引，没有一条从产物出发的入口把它们串起来。
- **第一层入口过载。** 根 README 有三张表加一节原则；`AGENTS.md` 另给两条路。渐进披露在各层 README 里做得到，在第零层做不到。

## 决定

### 五条流，每条流一个索引

根目录只放路由文件和五条按角色分的流，加三个工具目录和一个临时目录：

| 目录 | 角色 | 唯一索引 | 今天对应 |
|---|---|---|---|
| `kit/` | 已采纳规范 | `kit/README.md` | `kit/` 与 `dsh-praxis/kit/` |
| `vault/` | 证据：来源卡、快照、提炼、原 Chat | `vault/README.md` | 不变；capture 的原件进 `vault/snapshots/praxis-captures/<slug>/` |
| `docs/` | 裁决与回执：ADR、治理、验收 | `docs/README.md` | 不变 |
| `projects/` | 一切交付与实验 | `projects/README.md` | `jev`、`palantir`、`tally`、`books`、`dsh-praxis-explainer`、`demos/*`、`scenarios/*` |
| `control/` | 控制面代码与运行账本 | `control/README.md` | `dsh-praxis/` 去掉 `kit/` |
| `scripts/` `tools/` `templates/` | 维护脚本、独立工具、模板 | 各自 README | 不变 |
| `work/` | 临时物：下载件、中间渲染、worker 草稿 | 无；整目录 gitignored | 新建 |

`README.md`、`AGENTS.md`、`CHANGELOG.md` 留在根目录。其余任何根目录条目都是违例。

### 知识只沿一个方向流

```
vault → docs/decisions → kit → projects
```

反向只允许登记，不允许正文：`projects` 的消费写进 `control/data/runs`，`projects/*/out` 登记为产物，项目的教训先进 `vault/distilled` 再经 ADR 进 `kit`。[架构](../architecture/README.md)已写这条晋升链；目录让它看得见。

### 项目目录统一布局

每个项目是 `projects/` 下的一个目录，沿用 [ADR-041](041-dsh-praxis-projects.md) 的布局登记，角色固定为五个：

| 角色 | 默认位置 | 进 Git |
|---|---|---|
| 底稿 | `draft/` | 是 |
| 中间产物 | `build/` | 按项目决定，默认不进 |
| 最终产物 | `out/` | 是 |
| 验收证据 | `evidence/`：回执、检查帧、保留的日志 | 是 |
| 临时物 | `tmp/` | 否 |

日志只有两种归宿：作为验收证据留在 `evidence/`，否则进 `tmp/`。已登记项目可用自己的 glob 表达现有结构，不为搬文件改布局；新项目从模板开始。项目可嵌套，产物属于最深的项目，不变。

### capture 不落根目录

控制面写快照时固定写到 `vault/snapshots/praxis-captures/<slug>/`，catalog 记 `snapshot_path`，`vault/snapshot-manifest.json` 记 hash。agent 为了读而下载的原件进 `work/`，读完即弃；要固定版本才走 capture 的 `keep`。

### 校验加两道门

`scripts/validate_repository.py` 增加：

- **根目录白名单**：根目录条目不在上表与三个路由文件之内即报错；`.git`、`.github`、`.claude`、`.mcp.json`、`.gitattributes`、`.gitignore`、`.obsidian`、`.DS_Store` 例外。
- **项目布局**：`projects/*` 下不匹配任何已登记角色、也不是 README 的文件报 `misplaced`。第一阶段只对新项目报错，老项目报警告。

沿用 ADR-041 的“违例只报不搬”。

### 渐进披露三层固定格式

| 层 | 格式 |
|---|---|
| 根 README | 一张五行表：每条流一行，写角色与入口；原则移到 `docs/architecture/rationale.md`，根页只留一句 Goal |
| 每条流的 README | 一张“任务 → 先读 → 产出”表 |
| 每个项目的 README | 四段：是什么、做到哪、下一步、东西在哪 |

## 没有改变的

- 登记机制：registry、catalog、`control/data` 的 schema 与 revision 规则不动。
- ADR-041 的项目模型与信号。
- Kit 正文：分层体例（ADR-037）不动，只换目录。
- `vault/private/` 与披露边界（[入账规范](../governance/intake.md#消费与披露)）不动。

## 代价与取舍

- `dsh-praxis/kit → kit/` 与 `dsh-praxis → control/` 是最大一次搬动，影响 61 页正文的相对链接、`.mcp.json`、`launch.json`、DSH 插件的安装路径与 [下一轮工单](../../dsh-praxis/work-order.md)的 B1。放在第三阶段，等前两阶段跑过一轮真实交付。
- `projects/` 把 2.5 G 的 demos 与 2.6 G 的 palantir 并到一处，Git 历史不变，但 release 拆分时要按目录排除。
- 替代方案是只加校验不搬目录：根目录仍是两套逻辑，第一层入口无法收成一张表，不采用。

## 验证计划

- 第一阶段后：validator 两道门通过，根目录无违例，capture 原件在快照目录且 hash 可复核。
- 第二阶段后：`praxis_projects` 的 root 全部在 `projects/` 下，`praxis_upkeep` 的 `misplaced` 不因搬动而新增，所有 README 链接通过。
- 第三阶段后：`node --test` 全部通过，DSH 重装插件后右侧栏可用，`praxis_resolve` 对每个任务类型跑一遍。
