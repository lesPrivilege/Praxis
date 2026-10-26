# ADR-045：Praxis 与 dsh-praxis 的关系；撤回 ADR-044 第三阶段

日期：2026-10-26。状态：accepted。用户裁定 DSH 插件是单独的开发任务，本轮不做；本轮只理清 Praxis、dsh-praxis、MCP、控制面、数据、release 与 praxis task 的关系，并收敛项目目录。主会话（Claude Fable 5.1）编订。

## 问题

[ADR-044](044-repository-layout-by-role.md) 第三阶段打算把 `dsh-praxis/kit` 归并到根 `kit/`、把 `dsh-praxis` 改名 `control/`。这与 [ADR-038](038-dsh-praxis-control-plane.md) 和 [下一轮工单](../../dsh-praxis/work-order.md)已定的 release 方案冲突：`dsh-praxis/` 整个是 release 包，包内 Kit 要自足。两个 Kit 并存不是混乱，是两种东西；混乱在于没有一页把关系说清。

## 决定

### 七个名字各指什么

| 名字 | 是什么 | 在哪 | 谁消费 |
|---|---|---|---|
| **Praxis** | 个人工作系统的知识与证据库：证据、裁决、企业工作语义、交付 | 这个仓库 | 人与 agent 直接读目录 |
| **dsh-praxis** | 可独立发布的单元：内容表达 Kit（Task、Writing、Publish、Design）加控制面加运行数据 | `dsh-praxis/` | 经控制面的四个入口 |
| **控制面** | 让人和 agent 维护名册、预设、项目、产物与运行记录的操作面：一套 core，四个入口（DSH 插件、MCP、命令行、独立网页） | `dsh-praxis/core`、`adapters`、`ui` | 人用 DSH 右侧栏或网页，agent 用 MCP 或命令行 |
| **MCP** | 控制面的一个入口：把 `praxis_*` 工具开放给任何 agent | `dsh-praxis/adapters/mcp.js`，仓库根 `.mcp.json` | 其他 agent |
| **数据** | 控制面写下的状态：挂载维护信息、预设、项目、产物版本、运行记录、历史；来源名册是从 vault 投影的 `registry.json`；固定版本的原件在 `vault/snapshots` | `dsh-praxis/data/`、`vault/registry.json`、`vault/snapshots/` | 控制面读写；全部进 Git，没有仓库外的缓存 |
| **release** | 把 `dsh-praxis/` 打成包：数据根可配置、名册自有存储、包内 Kit 不链包外；这个仓库以“仓库模式”接入同一个包，vault 作为来源包 | 工单 B1–B7，未做 | 新用户的 fresh agent |
| **praxis task** | 一次内容表达任务从 Task 层进入：任务类型决定流水线、常驻单元与可选单元；`praxis_entry` / `praxis_resolve` 给出要读的单元与素材，`praxis_consume` 记下读过什么、交付了什么 | `dsh-praxis/kit/task/`，产物落在 `projects/<项目>/` | 做任务的 agent |

### 两个 Kit 的分工

- 根 `kit/` 是 **Praxis 的企业工作 Kit**：工作全景、共同语法、契约、环境、工作系统、验收。它是知识，人与 agent 读目录消费，不进 release 包。
- `dsh-praxis/kit/` 是 **表达 Kit**：由控制面按单元提供，随包发布。

`kit/README.md` 是两者共用的任务入口表；一件任务从那里选分支。不合并，不改名。

### 产物与目录

交付与实验在 `projects/`，由控制面登记项目与产物（[ADR-041](041-dsh-praxis-projects.md)、ADR-044）。项目目录属于 Praxis，不属于 release 包；release 用户的项目在他们自己的目录，控制面只记位置。

### 撤回

ADR-044 的第三阶段（Kit 归并、`control/` 改名）撤回；第一、二阶段的结果不变。迁移工单 1.5（布局角色）与 1.7（capture 快照位置）属于插件开发，实现已由 worker 完成并验证，留在分支 `wip/dsh-praxis-layout-roles`，由插件那条线决定是否并入。

## 没有做的

- 插件的任何代码改动；`ui/index.html` 的角色标签。
- release 拆分（B1–B7）。
- 把这张关系表写进 dsh-praxis 的用户说明；那是插件文档的事。
