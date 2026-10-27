# Data

这个仓库的数据根：包旁有 `data/`，插件、MCP 与命令行都读写这里（仓库模式）。由 [core](../core/README.md)写入，进 Git，备份与恢复随仓库走。新安装没有这个目录，数据根的解析顺序见 [安装与运行](../INSTALL.md#数据根)。

| 文件 | 内容 |
|---|---|
| `settings.json` | `base: ../..`：记录里的相对路径以仓库根为起点；`snapshots: ../../vault/snapshots/praxis-captures`：refresh 另存的快照放进 vault |
| `sources.json` | 自有来源，都是网页：ID 为 `praxis:<slug>`，记 URL、概要、读取范围、证据状态、边界、何时重访、摘录、收录任务、集合的成员模式（含带理由跳过的成员）与所属集合、淘汰理由与 revision；不存原件 |
| `catalog.json` | 来源编目：按来源 ID 记形态、Kit 分类、description 与最近一次 review（含 revision 与当时的来源版本）；自有来源与来源包里的条目都可编目，来源包本身不被写入 |
| `packs.json` | 按引用接入的来源包：`vault`（registry 格式，读 `vault/registry.json`）与 `jev-research`（Jev 专章的来源索引，经字段映射读取）；Praxis 只读这些文件，不写 |
| `bindings.json` | 挂载：在名册里新建、移除、恢复或编辑过的关系，以及挂载上的维护信息（description、取用题解、启用、收藏、优先级、tag、最近一次 review、状态与 revision），按 `<来源 ID>@<页面路径>` 对上。来源包声明的关系（vault 记录的 `grammar_paths`）没被动过时不在这里 |
| `checks.jsonl` | 追加式来源检查：来源、时间、状态、HTTP 码、内容 hash（HTML 另记正文 hash）、大小与类型，打不开时记错误；集合类来源另记成员链接；另存快照时记快照路径 |
| `presets.json` | 预设：流水线、名称、字段值、tag、是否默认、revision |
| `projects.json` | 项目：根目录（仓库内为仓库路径，仓库外为绝对路径）、名称、用途、布局（按角色给路径模式：draft 底稿、build 中间产物、final 最终产物、evidence 验收回执与留存帧进 Git、tmp 临时文件不进 Git；缺的角色由模板 standard 补齐）、状态与 revision |
| `artifacts.json` | 产物：名称、说明、媒介、种类（`delivery` 交付、`pipeline` 管线、`example` 范例）、`serves`（作为范例服务哪些 Kit 页、何时对照）、位置（仓库内为仓库路径，仓库外为绝对路径）、版本（sha256、大小、时间、运行、派生自）、最近一次 review（写明针对哪一版）、状态与 revision。文件本身不在这里 |
| `revisions.json`、`overlay/kit/…` | 对 Kit 单元的修订：登记理由、依据的范例与写修订时包内原页的 hash；修订后的整页放在 `overlay/` 的同名路径。第一次修订时建立 |
| `history.jsonl` | 追加式维护记录：时间、操作、对象、revision、操作者、任务、理由，以及这一版写下的字段值（`set`）；`praxis_history` 按 `id` 过滤可回查一条挂载、来源或预设的每个版本 |
| [runs/](runs/README.md) | 每次 consume 一个文件：读了哪些单元（含版本）与来源（含内容 hash），读过的来源与单元之间的挂载（含 revision），产物（产物 ID、版本、hash），以及来源会话 |

`node dsh-praxis/adapters/cli.js export state.tar.gz` 把本目录和快照目录（`vault/snapshots/praxis-captures`，在本目录之外）打成一个带 hash 清单的包；`check` 校验包，`restore` 恢复，本地已改过的文件默认不覆盖。vault 的 catalog 与 registry、Jev 的来源索引、产物文件都留在各自的位置，不在包里。

可以直接编辑这些 JSON；core 每次调用都重新读取。直接编辑不经过 revision 检查，也不留维护记录，改完运行 `python3 scripts/validate_repository.py`。
