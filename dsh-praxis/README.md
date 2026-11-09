# dsh-praxis · Praxis

Praxis 是一套设计与写作的工作方法（Kit），加一份来源名册和用户自撰的 stream；任务经 Task 与 Publish 走向具体媒介和场景。名册登记的是链接：原件在哪、概要、读取范围、摘录的定位与说法、为哪件任务收录、挂在哪些页面；原件正文不收进来，agent 和人需要时按链接与定位回原件读。

| 部分 | 内容 |
|---|---|
| Kit | Task、Writing、Design、Publish 四层，每层一组短页，随包发布。Task 决定这次做什么、走哪条 Publish 流水线、取哪些 Writing 方法与 Design 范式；Writing 与 Design 的入口常驻，其余按任务读取 |
| 名册 | 自有来源，加按引用接入的来源包（只读）。来源经挂载连到 Kit 页，挂载说明写这个来源对这一页有什么用；还没挂上的来源按 Kit 的层与区域归类 |
| Stream | 用户自撰的探索方向，一页一条，在数据根的 `streams/`；来源挂到这一页，指定 stream 就能取用 |
| 控制面 | 一套 core：维护名册、挂载、预设、项目、产物与运行记录，三个入口共用 |

## 三个入口

| 入口 | 给谁 | 提供什么 |
|---|---|---|
| DSH 插件 | DSH 里的 agent 会话与人 | worker 用的 10 个工具、系统提示里的入口段、`/praxis` 命令、左侧栏“Praxis”页（控制面：Kit、来源、任务、产物、记录，底部输入框交给 agent 收录与修改）、resolve 与 consume 的工具卡片 |
| MCP | 其他 agent（Claude Code、Codex 等） | 全部工具，加 resources（入口、单元、来源、产物）与 prompts（每个任务类型一条） |
| 命令行 | 人与脚本 | 全部工具，加备份、校验与恢复 |

## 数据在哪

Praxis 写下的一切都在数据根：名册、挂载、stream、预设、项目、产物记录、运行记录、来源检查、维护记录，以及对 Kit 页的修订（覆盖层）。包本身不写入。数据根按以下顺序确定：

1. DSH 插件配置里的 `data`；
2. 环境变量 `PRAXIS_DATA`；
3. 包旁有 `data/` 目录时用它；
4. 其余情况用 `$DSH_HOME/dsh-praxis`，未设 `DSH_HOME` 时为 `~/.dsh/dsh-praxis`。

DSH 插件、MCP 与命令行按同一顺序解析，不另行指定时共用一份数据。数据根里的 `settings.json` 和备份方法见 [安装与运行](INSTALL.md#数据根)。

## 从哪里开始

| 要做什么 | 读哪里 |
|---|---|
| 安装，接进 DSH、MCP 或命令行 | [安装与运行](INSTALL.md) |
| 了解它在 DSH 里怎样用 | [用户说明](docs/DETAIL.zh.md)（[English](docs/DETAIL.md)），也是 DSH 插件详情页 |
| 做一件内容表达任务 | [Kit 入口](kit/README.md)，从 Task 开始；agent 用 `praxis_resolve` |
| 判断一条做法归哪一层 | [分层体例](layers.md) |
| 弄清对象、操作和目录控件的含义 | [对象与操作](objects.md) |
| 查对象的字段草案 | [Schemas](schemas/README.md) |
| 查入口与工具表 | [Adapters](adapters/README.md) |
| 改代码 | [Core](core/README.md) |

在 Praxis 仓库里，包旁有 `data/`，插件以仓库模式运行：相对路径以仓库根为起点，仓库的 vault 作为来源包接入。工单、架构参考与迁移记录留在仓库，不随包发布。
