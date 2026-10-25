# Data

控制面的持久数据，由 [core](../core/README.md)写入，进 Git，备份与恢复随仓库走。

| 文件 | 内容 |
|---|---|
| `bindings.json` | 挂载上的维护信息：description、取用题解、启用、收藏、优先级、tag、review、状态与 revision。挂载关系本身在来源记录的 `grammar_paths`，项目索引的在 `vault/project-indexes.json` |
| `presets.json` | 预设：流水线、名称、字段值、tag、是否默认、revision |
| `artifacts.json` | 产物：名称、说明、媒介、位置（仓库内为仓库路径，仓库外为绝对路径）、版本（sha256、大小、时间、运行、派生自）、按版本的 review、状态与 revision。文件本身不在这里 |
| `history.jsonl` | 追加式维护记录：时间、操作、对象、revision、操作者、任务、理由，以及这一版写下的字段值（`set`）；`praxis_history` 按 `id` 过滤可回查一条挂载或预设的每个版本 |
| [runs/](runs/README.md) | 每次 consume 一个文件：读了哪些单元（含版本）与来源（含快照 hash），读过的来源与单元之间的挂载（含 revision），以及产物（产物 ID、版本、hash） |

`node dsh-praxis/adapters/cli.js export state.tar.gz` 把本目录、收录 catalog 与卡片、刷新快照及其登记，以及 registry 列出的全部来源 catalog（挂载关系与最新快照指针在那里）打成一个带 hash 清单的包；`check` 校验包，`restore` 恢复并重建 registry 与快照清单，本地已改过的文件默认不覆盖。插件代码与 Kit 正文随仓库走，不在包里；产物文件留在各自的工作区，也不在包里，导出结果的 `not_included` 写明有几件。

可以直接编辑这些 JSON；core 每次调用都重新读取。直接编辑不经过 revision 检查，也不留维护记录，改完运行 `python3 scripts/validate_repository.py`。
