# Data

控制面的持久数据，由 [core](../core/README.md)写入，进 Git，备份与恢复随仓库走。

| 文件 | 内容 |
|---|---|
| `bindings.json` | 挂载上的维护信息：description、取用题解、启用、收藏、优先级、tag、review、状态与 revision。挂载关系本身在来源 catalog 的 `grammar_paths` |
| `presets.json` | 预设：流水线、名称、字段值、tag、是否默认、revision |
| `history.jsonl` | 追加式维护记录：时间、操作、对象、revision、操作者、任务、理由 |
| [runs/](runs/README.md) | 每次 consume 一个文件：用了哪些单元（含版本）、挂载（含 revision）、来源与产物 |

`node dsh-praxis/adapters/cli.js export state.tar.gz` 把本目录、收录 catalog 与卡片、刷新快照及其登记打成一个带 hash 清单的包；`check` 校验包，`restore` 恢复，本地已改过的文件默认不覆盖。插件代码与 Kit 正文随仓库走，不在包里。

可以直接编辑这些 JSON；core 每次调用都重新读取。直接编辑不经过 revision 检查，也不留维护记录，改完运行 `python3 scripts/validate_repository.py`。
