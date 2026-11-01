# Core

一套操作，DSH 插件、MCP 服务、命令行和控制面都调用它；入口是 [index.js](index.js)的 `createPraxis()`。core 不依赖 npm 包；备份调用系统的 `tar`。

| 文件 | 管什么 |
|---|---|
| [paths.js](paths.js) | 一处解析四个位置：包（代码与 Kit）、数据根、`base`（相对路径的起点）、快照目录；记录里的路径按三种写法存取：包内 Kit 页写 `kit/…`，`base` 下的文件写相对路径，其余写绝对路径 |
| [kit.js](kit.js) | 从包内 Kit 的 Markdown 派生单元索引（ID、标题、description、语法 ID、版本、最近一次提交时间；提交时间只在 git 检出里有），解析任务类型页的表格；数据根的覆盖层 `overlay/kit/…` 有同路径的页时，读修订后的页；列出可作分类的层与区域；数据根 `streams/` 里的页读作 `stream` 层的单元 |
| [materials.js](materials.js) | 名册：自有来源（`sources.json`）与按引用接入的来源包（`packs.json`，registry 或项目索引两种格式，只读）合成一份视图；挂载（`bindings.json`）合并来源包声明的关系与在名册里建、移除、编辑的关系；成批 capture 网页来源（记下收录任务，并编进来源编目）、修订与淘汰自有来源；编目（`catalog.json`）给任何来源记形态、Kit 分类、description 与 review，来源包也一样，从不写入来源包；refresh 对照上游检查（`checks.jsonl`，默认只记状态与 hash，要求时另存快照），集合类来源另记成员链接并列出上游新增与下线；挂载的信号只有三种：review 结论待改、来源在上次 review 后变了、链接失效 |
| [store.js](store.js) | JSON 存储：按文件原有排版写回（数据没变的部分照抄原文）、原子写、跨进程锁、按 revision 拒绝过期写入（被拒时什么都不写）、追加式维护记录；每条记录带这一版写下的字段值（`set`），任一版本可回查 |
| [projects.js](projects.js) | 项目：根目录、用途与布局（底稿、中间产物、最终产物、验收证据、临时文件的路径模式）；查一个路径属于哪个项目、在项目里是什么角色，列出最终产物路径里的文件；不移动文件 |
| [artifacts.js](artifacts.js) | 产物：交付文件的身份、按内容区分的版本（sha256、产出它的运行、派生自哪一版）、绑定版本的 review、状态（current、modified、missing，每次从文件读出）；字节留在原处 |
| [presets.js](presets.js) | 每条流水线的预设字段与校验；只记密钥所在的环境变量名 |
| [backup.js](backup.js) | 数据根的导出、校验与恢复；快照目录在数据根之外时一并处理。来源包的文件与产物文件不在其中 |
| [index.js](index.js) | 入口、resolve（可带 stream；素材带原件 URL、摘录定位与快照，之后是服务这些单元的范例：pipeline、example 与已接受的交付）、来源编目（`catalog()` 按层、区域、形态排纲目）、来源条目（收录缘由、所挂页面、服务的任务类型、读过它的运行与产物）、Kit 修订（`reviseUnit` 写覆盖层并记下包内原页的 hash，`revertUnit` 撤回，`revisionList` 标出与包内更新后的原页冲突的修订）、预设、consume、运行记录与 stale 检查；`consume` 先核对再写，记下读过的来源、由它推出所用挂载和来源会话，同时登记交付的文件；`upkeep()` 汇总现在需要人处理的事，通常为空；`entry()` 与 `upkeep()` 在宿主运行旧代码时带 `reload` |

数据归属：Praxis 写下的一切在数据根（名册、挂载、预设、项目、产物记录、运行记录、来源检查、维护记录、Kit 修订）；来源包的文件留在主人那里，Praxis 只读；产物文件留在主人的工作区；包内 Kit 不被写入。数据根与 `settings.json` 见 [安装与运行](../INSTALL.md#数据根)。

测试在源码目录运行 `npm test`，测试文件不随包发布。core 测试在临时目录里的小数据根上跑，不碰真实数据。
