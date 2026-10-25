# Core

一套操作，DSH 插件、MCP 服务、命令行和控制面都调用它；入口是 [index.js](index.js)的 `createPraxis()`。

| 文件 | 管什么 |
|---|---|
| [kit.js](kit.js) | 从各层 Markdown 派生单元索引（ID、标题、description、语法 ID、版本、最近一次提交时间），解析任务类型页的表格 |
| [materials.js](materials.js) | 来源（经 `vault/registry.json` 列出，详情回到 catalog）、挂载、成批收录（记下为哪件任务收录）、按引用登记项目内的来源索引、对照上游检查来源（默认只记 hash，要求时另存快照）；关系写在来源自己的记录上，项目索引的写在登记里；挂载的信号只有三种：review 结论待改、来源在上次 review 后变了、链接失效 |
| [store.js](store.js) | JSON 存储：按文件原有排版写回（数据没变的部分照抄原文，手工排版的 catalog 只改动到的行）、原子写、跨进程锁、按 revision 拒绝过期写入（被拒时什么都不写）、追加式维护记录；每条记录带这一版写下的字段值（`set`），任一版本可回查 |
| [projects.js](projects.js) | 项目：根目录、用途与布局（底稿、中间产物、最终产物的路径模式）；查一个路径属于哪个项目、在项目里是什么角色，列出最终产物路径里的文件；不移动文件 |
| [artifacts.js](artifacts.js) | 产物：交付文件的身份、按内容区分的版本（sha256、产出它的运行、派生自哪一版）、绑定版本的 review、状态（current、modified、missing，每次从文件读出）；字节留在原处 |
| [presets.js](presets.js) | 每条流水线的预设字段与校验；只记密钥所在的环境变量名 |
| [backup.js](backup.js) | 控制面写下的状态的导出、校验与恢复：data、收录与快照，以及挂载和刷新会改的每个来源记录文件与项目索引登记；恢复后重建 registry 与快照清单 |
| [index.js](index.js) | 入口、resolve（素材带原件 URL、摘录定位与快照）、来源条目（收录缘由、所挂页面、服务的任务类型、读过它的运行与产物）、预设、consume、运行记录与 stale 检查（单元、挂载、来源快照、预设任一变了就算）；`consume` 先核对再写，记下读过的来源并由它推出所用挂载，同时登记交付的文件；`artifactList`、`artifact` 给出产物与每一版的依据；`upkeep()` 汇总现在需要人处理的事（有信号的挂载、过期交付、未挂载的新登记、找不到文件或最新版待改的产物，以及宿主运行旧代码时的 `reload`），通常为空；`entry()` 同样带 `reload` |

数据归属：来源事实与挂载关系（`grammar_paths`）在来源自己的记录上（`vault/provenance/**/catalog.json`、`vault/references/catalog.json` 与 intake）；项目内的来源索引留在项目里，它的字段映射与挂载关系在 `vault/project-indexes.json`；挂载上的维护信息（description、取用题解、启用、收藏、优先级、tag、review）、运行记录、产物记录和维护记录在 [data](../data/README.md)；产物文件本身留在主人的工作区。registry 与快照清单是派生的，写入后由 `scripts/build_registry.py`、`scripts/build_snapshot_manifest.py` 重建。

测试：`node --test core/*.test.mjs adapters/*.test.mjs`（在 `dsh-praxis/` 下）。core 测试在临时目录里的小仓库上跑，不碰真实数据。
