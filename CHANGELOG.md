# Changelog

## 2026-10-25 · dsh-praxis 管线登记为来源；Design 挂载说明按位置写

- 已有的 5 条生产管线按本地定位登记为来源：书单系列、薪酬基线短片、金字塔长片、Jev 网页构建器、SaaS 教材站点生成器。它们挂到 publish/video 与 publish/html，写明何时用；脚本留在原项目。consume 的产物可带 `made_with` 写明由哪条管线产出，来源条目列出用它产出的运行与产物。已知的 8 件产物补记了管线。取舍见 [ADR-043](docs/decisions/043-dsh-praxis-pipelines-as-sources.md)。
- 108 条 Design 挂载的说明改为按位置写：这个来源对这一页有什么用、何时打开。Opus 子代理起草，主会话逐条审阅后经 `praxis_curate` 写入。两条关系的去留待用户决定，见 [回执](docs/verification/dsh-praxis-pipelines-roster-20261025.md)。

## 2026-10-25 · dsh-praxis 对照上游检查来源；写回保留原排版

- `praxis_refresh` 默认只记一条检查（状态、HTTP 码、内容 hash），不存正文；相邻两次 hash 不同是来源变了，最近一次打不开是链接失效，挂载新增 `unreachable` 信号；`keep: true` 才另存快照，快照指针以 intake 为准，所有来源都适用。运行记下读到的内容 hash。取舍见 [ADR-042](docs/decisions/042-dsh-praxis-upstream-checks.md)。
- JSON 写回按文件原有排版：数据没变的部分照抄，手工排版的 catalog 只改动到的行；267 个文件原样写回逐字不变。
- 修正：`12105ed` 之后，technical-explainer 的 html 流水线 resolve 出错。原因是部分 catalog 把说法写成 `claim_zh` 或纯字符串，素材摘录读不到。现在三种写法都读出；适配层测试对真实仓库的每个任务类型跑一遍 resolve。挂载在来源变化的同一毫秒内 review，不再误报 `changed`。命令行与 MCP 服务的来源检查走 `HTTP(S)_PROXY`；被任务类型取到的 11 个来源首轮检查都打得开。27 项测试、探针 14 项通过。

## 2026-10-25 · dsh-praxis 项目与产物位置；下一轮工单

- [下一轮工单](dsh-praxis/work-order.md)：先自用跑通（A1 项目与产物、A2 管线、A3 worker 自主消费、A4 名册维护），再拆出 release（B1–B7）。设计原则写在工单开头：名册登记链接与功效，不收录原件正文；经渐进目录逐级展开，是否打开原件由模型决定；消费过的留本地记录；链接随上游同步、增减淘汰。上一轮工单改名为 [work-order-artifacts](dsh-praxis/work-order-artifacts.md)。
- A1：项目是带布局的目录（底稿、中间产物、最终产物各按 glob，从模板开始），产物属于包含它的最深项目；consume 拒收项目外的文件；upkeep 只报两种例外：产物不在约定位置（`misplaced`）、最终产物路径里有没登记的文件。新增 `praxis_projects`、`praxis_project`；控制面的产物按项目分组。取舍见 [ADR-041](docs/decisions/041-dsh-praxis-projects.md)。
- 三个试点（jev、Palantir 书单系列、技术说明页）登记，不搬文件，找出 14 条例外并按用户指示处理：7 件非交付件的产物记录移除（可恢复），7 个成片一次登记；26 项测试、探针 14 项通过，见 [回执](docs/verification/dsh-praxis-projects-20261025.md)。

## 2026-10-25 · dsh-praxis 来源闭环

- 名册对人和 agent 说清每条来源：`praxis_source` 与控制面的来源条目给出收录缘由（集合的用途或 capture 时的任务）、挂在哪些页面、经这些页面服务哪些任务类型、哪些运行读过它并交付了什么。取舍见 [ADR-040](docs/decisions/040-dsh-praxis-source-loop.md)。
- resolve 的素材带 source ID、原件 URL、证据状态、读取范围、摘录定位与快照；`praxis_consume` 的 `sources` 记实际读过的来源，挂载由“读过的来源 × 读过的单元”推出，`bindings` 参数去掉。
- 关系只在来源自己的记录上：registry 构建脚本为所有记录形态带出 `grammar_paths`（此前只有扩展 catalog，挂到其他来源上的关系重建后会消失）；Kit 页引用已登记来源的卡片就必须有这条关系，validator 检查，补上 45 条。
- `praxis_register_index` 按引用登记项目自己的来源索引，登记在 [`vault/project-indexes.json`](vault/project-indexes.json)；Jev 研究登记 236 条由此进入名册，`jev/` 不变。`praxis_capture` 改为成批，写明为哪件任务收录。
- 25 项测试、[验收探针](scripts/check_praxis_acceptance.py) 13 项、仓库校验通过；素材对交付的帮助与 DSH 桌面待测，见 [回执](docs/verification/dsh-praxis-source-loop-20261025.md)。

## 2026-10-25 · dsh-praxis 旧代码提示与 DSH 实测补登

- DSH 会话实测报回的三项问题（经插件的 `value is not lossless JSON`、consume 报错但运行已写、插件少产物四件工具）都出自同一个旧进程：DSH 在后两次提交之前启动，跑的是 `179e227` 的代码。`praxis_entry` 与 `praxis_upkeep` 现在带 `reload`，宿主运行的服务端代码比磁盘旧时出现，控制面“需要处理”显示一行。
- core 测试把写工具的返回值也过一遍无损 JSON 边界。实测运行的两份文件按当时 hash 补登为产物。经过见 [回执](docs/verification/dsh-praxis-artifacts-20261025.md#dsh-会话实测)。

## 2026-10-25 · dsh-praxis 产物登记与取用

- 交付的文件成为 [产物](dsh-praxis/core/artifacts.js)：`praxis_consume` 同时登记，同一内容不重复，内容变了是新版本，review 写明版本，挪位置要求内容一致；状态每次从文件读出，只有找不到文件和最新版待改进维护清单。新增 `praxis_artifacts`、`praxis_artifact`、`praxis_artifact_review`、`praxis_artifact_update`。取舍见 [ADR-039](docs/decisions/039-dsh-praxis-artifacts.md)。
- 控制面加“产物”视图；DSH 里预览交给文档预览，显示与打开交给 `openWorkspacePath`，经客户端插件转交；文件路由只给已登记产物。拖出用 HTML5 `DownloadURL`，DSH 没有原生接口，待桌面实测。
- 4 条既有运行的 18 个文件按当时 hash 一次投影为产物版本。DSH 调用方反馈的 `value is not lossless JSON` 在 `callTool` 统一修正。
- 23 项测试、[验收探针](scripts/check_praxis_acceptance.py) 12 项通过；DSH 桌面未测，步骤见 [回执](docs/verification/dsh-praxis-artifacts-20261025.md)。[架构参考](dsh-praxis/architecture.md)与 [工单](dsh-praxis/work-order.md)随本轮入库。

## 2026-10-25 · Kit 正文去旁白，入口段按 description 撰写

- [成文原理](dsh-praxis/kit/writing/principles.md)第 5 条把目录里的说明（description）列为结构位置，第 8 条点名自述：页面讲什么、怎样读由标题、顺序和入口段承担；[审阅方法](dsh-praxis/kit/writing/review.md)常见偏差加“页面自述”一行。
- 两名 Opus 审阅者按此清理 `dsh-praxis/kit` 四层 72 页：删去“本页回答/只写/不替代……”一类自述、重复设防与来路标签，每页入口段改写成 description（这页决定什么、何时用，约 100 字内），表头与标题改为按位置撰写；规则强度、锚点与来源事实不变。主会话逐项复核，补回一处证据身份（论证示例改为“假设走读……”），示例为构造的约定写在 [Kit 入口](dsh-praxis/kit/README.md)。
- 未改：正文里的修订触发（约 25 处，留待单独决定是否移到 index）、跨层共用的问句式表头与“最小产物与何时停”一类标题（ADR 按文字引用）。

## 2026-10-25 · dsh-praxis 整合包验收与修复

- [整合包验收](docs/verification/dsh-praxis-acceptance-20261025.md)：DSH 桌面内置控制面实际打开并读写，MCP 与 CLI 真实进程共数据；[补充探针](scripts/check_praxis_acceptance.py)找出五类缺陷，增量入账见 [原 Chat](vault/archive/chat/dsh-praxis-control-plane-20261025.md)。
- 修复：备份带上全部来源 catalog 并在恢复后重建派生索引；预设保存被拒时不再取消原默认；查不到的单元与来源在 MCP、CLI、DSH、HTTP 上都是失败调用；`stale` 比对已消费来源的快照；维护记录带每一版写下的字段值，`praxis_history` 可按 `id` 回查。UI review 带上所见 revision。
- 探针 9 项、`node --test` 18 项通过。DSH 桌面未重启复验；npm 包不单独携带 Kit，仍需完整仓库。

## 2026-10-25 · dsh-praxis 控制面：渐进披露、轻维护、中英界面

- [控制面](dsh-praxis/ui/README.md)的目录改成 层 → 领域 → 单元 的渐进披露，加上“Kit 之外的挂载”按路径展开；单元页以来源卡片为主，正文按需展开。界面对齐 DSH 客户端的 token 与控件形状，嵌入时跟随 DSH 的明暗与语言。
- 维护只列信号：新增 `praxis_upkeep`（待改、来源已变的挂载，过期交付，未挂载的新登记），放在“记录”顶部，通常为空；未写说明、未 review 不再计数。取舍补记在 [ADR-038](docs/decisions/038-dsh-praxis-control-plane.md#补充目录维护与语言2026-10-25)。
- 单元带最近一次提交时间（一次 `git log`）。界面文字中英两套，Kit 与来源内容保留原语言；DSH 侧栏引导卡随语言切换。
- 对齐 DSH 官方插件文档：控制面改走 DSH Connection 的两条精确路由（`/api/praxis`、`/api/praxis.call`），桌面应用里也能打开，且受 DSH 会话认证保护；入口段改用 `systemPrompt.section`；侧栏标签 `keepMounted`、引导卡中英词典；补插件展示信息与用户文档 [DETAIL](dsh-praxis/docs/DETAIL.zh.md)。未做：schemastery `Config`、发布。
- `node --test` 16 项、仓库检查通过；在本机 DSH web profile 里核对认证、侧栏、数据读写、主题与语言切换，profile 已恢复。桌面应用没有重启验证；没有真实任务里的使用，没有他人读过界面。

## 2026-10-23 · Jev 专章

- 新增 [jev](jev/README.md)：Jev 与 System One 决策模型的快照（2026-10-23），中文底稿七章加两个附录、单文件网页（两处步进运动）、五条线 236 个来源与 288 条主张的登记。材料与产物都在该目录，原 Chat 按用户要求存于 `jev/research/inputs/`，没有进 `vault/archive/chat`。
- ChatGPT 两份 Deep Research 报告只作核对对象，40 处说法与来源不符或无法核实，见 [更正](jev/research/corrections.md)。
- 一次 Sonnet 冷读审阅，主会话逐条裁决，见 [记录](jev/review-20261023.md)。Kit 消费记在 dsh-praxis 运行记录 `2026-10-22-5eb2c727`。
- 仓库检查的覆盖目录加入 `jev`。没有 Kit 规则变动；未做读者测试与屏幕阅读器检查。

## 2026-10-23 · dsh-praxis 控制面与 DSH 插件

- 实现 [dsh-praxis](dsh-praxis/README.md) 的控制面：[core](dsh-praxis/core/README.md)（Kit 单元索引、任务展开、来源与挂载维护、收录、快照刷新、预设、运行记录与 stale、导出恢复），[工具表](dsh-praxis/adapters/README.md)经 DSH 插件、DSH 右侧栏标签、MCP 服务（`.mcp.json`）、命令行和 [网页](dsh-praxis/ui/README.md)提供。取舍见 [ADR-038](docs/decisions/038-dsh-praxis-control-plane.md)。
- `kit/design/` 迁入 `dsh-praxis/kit/design/`；来源 catalog、艺术软件图谱与 SaaS 图谱的路径随之更新，艺术软件图谱回归测试的期望值同步改路径。
- 插件以 `link:` 装进本机 DSH 的 desktop profile（包 dsh-praxis），桌面应用重启后加载；验证在临时 headless 与 web profile 里做，之后已删除。
- `node --test` 15 项、仓库检查、`test_atlas_index.py` 与 SaaS 图谱检查通过。没有真实任务里的使用，没有对照。

## 2026-10-23 · dsh-praxis：Task、Writing、Publish 迁入

- 按 [迁移映射](dsh-praxis/migration.md)把内容表达部分迁进 [dsh-praxis/kit](dsh-praxis/kit/README.md)：Writing（底线、成文原理、内容组织、文体、语言约定、审阅、作者语体），Task（入口、材料目的与组织动作、现场闭环与驻场组织接口、选择表达媒介、技术说明与工作报告两个任务类型），Publish（html、video 两条流水线与共用验收）。`kit/write/`、`kit/writing/`、`kit/reporting/` 删除，不留导航；取舍补记在 [ADR-037](docs/decisions/037-dsh-praxis-layered-grammar.md#补充taskwritingpublish-迁入2026-10-23)。
- 成文原理第 6 条正文拆到 [中文语言约定](dsh-praxis/kit/writing/language/zh.md)，编号不变；讲解页拆成 Writing 的 [机制讲解](dsh-praxis/kit/writing/organization/mechanism.md)与 Publish / html 的 [讲解页的编排](dsh-praxis/kit/publish/html/explainer.md)。
- 维护中的页面、`writing` skill、根 README 与 Kit 入口改指新位置；历史记录只改 Markdown 链接目标。来源 catalog 的 `grammar_paths` 随之更新，registry 重新生成。
- 走读：一个 Sonnet 代理从 AGENTS.md 冷读路由“给同事写一页 tools/equity-chart 技术说明”，经 Task → 任务类型 → Writing / Publish / Design 到达完整阅读集，没有断链。据它的报告改了四处：类型页列出的单元照读、html 入口不再称其“非必经”；任务兼有两类时怎样选；导航与渐进披露改为按需；分层体例写明 Design 与 Materials 仍在原处。用法类内容不在四问框架里、首次使用者的校准没有专门页，记为观察，未改规则。只走了路由，没有写出页面，没有对照。
- Design 与 Materials 数据层没有迁。

## 2026-10-23 · dsh-praxis 分层体例

- 新增 [dsh-praxis](dsh-praxis/README.md)：个人 FDE 工作 Kit 与控制面的分层体例（Task、Writing、Design、Publish、Materials）、对象与操作、五种对象的 schema 草案和现有 Kit 的迁移映射。裁决见 [ADR-037](docs/decisions/037-dsh-praxis-layered-grammar.md)。没有写代码，没有迁移任何 Kit 页面。
- 需求来源入账：ChatGPT 讨论的 [原 Chat](vault/archive/chat/dsh-praxis-control-plane-20261023.md)、评审记录 v0.2 [快照](vault/snapshots/local/dsh-praxis-control-plane-20261023/README.md)与 [登记](vault/intake/dsh-praxis-control-plane-20261023.json)。原 Chat 所说 registry 不带 `reference_priority` 等字段，回到 `scripts/build_registry.py` 核实属实。
- schema 草案在 2026-10-23 用 `jsonschema` 4.26（draft 2020-12）校验：六个 schema 合法，`examples.json` 十个实例通过，实例里的路径与快照 hash 可在仓库解析。仓库检查覆盖 `dsh-praxis/`。
- 未做：真实任务走读、对照，DSH 本机版本核对。

## 2026-10-19 · 入职书单系列：施工记录归位与 dogfooding

- 各轮审阅代理的原始结果存进 [审阅原始记录](palantir/reading-list-series/verification/reviews/README.md)，来源探索与核验结果存进 [研究交接](palantir/reading-list-series/research/handoffs/README.md)；会话临时路径改写为占位，联络表与截图不入库。
- 没有参与制作的 Opus 代理从会话日志写成 [过程重建](vault/distilled/palantir-reading-list-series-distill-20261019/README.md)，附二十二份任务书原文与 [登记](vault/intake/palantir-reading-list-series-distill-20261019.json)。
- 八条候选落地三条：[叙事与分镜交接](dsh-praxis/kit/publish/video/narrative.md#旁白与屏幕文字的审阅)的结构文字独立审阅不再以对外发布为条件，多人或多代理写成即触发；[工作开展方式](kit/environment/working-methods.md)补“量出来的数异常时先单独再量一段”和“原因不明时”的一次实测反例。均未对照。
- 验收页更正：ep04 转写记为未通过（识别器漏写英文名，单独转写正确）；`c11ebf4` 的提交说明与表格里“配额未运行”的说法以此为准。空白检查写明取样粒度。

## 2026-10-17 · Palantir 入职书单视频系列

- 新增 [入职书单视频系列](palantir/reading-list-series/README.md)：一部总论加五集，各读一份（Interviewing Users、Impro、Getting Things Done、Dalio 的早期 PDF、The Looming Tower），另有由同一份正文排出、去掉各集引入与收尾的 33:33 合集。中文旁白按作者语体写成，每集有 4:3 与 3:4 原生封面；画面上的每句引文和出处都对应主张登记里的一条，外部图片只经素材登记上屏。
- 原 Chat 与交接稿入账：[归档](vault/archive/chat/palantir-reading-list-series-20261017.md)、[入账记录](vault/intake/palantir-reading-list-series-20261017.json)，另有两份新来源快照。交接稿按“仅供参考”裁决，采用与不采用的写在系列页。旧提炼里“这五份是入职书单”等几处说法回到原文更正，见 [系列研究](palantir/reading-list-series/research/README.md#对旧记录的更正)。
- Sonnet 代理探索与核验来源；Opus 代理冷读稿子、施工画面、审阅画面与结构文字、做镜头导演和成片审阅；主会话逐条裁决，记在 [验收](palantir/reading-list-series/verification/acceptance.md)。
- Kit 只加两处记录：[口播旁白体例](dsh-praxis/kit/writing/genres/narration.md)的“悬念后揭晓”一行补上冒号揭晓（合成语音在冒号处停顿）；[Motion](dsh-praxis/kit/publish/video/README.md) 的制作记录加本系列一行。
- 没有人带声音按实际速度看过成片；几处人名读音与没跑成的转写比对留给人，见验收页。

## 2026-10-17 · 股权结构图工具

- 新增 [工具](tools/README.md) 目录与第一个工具 [股权结构图](tools/equity-chart/README.md)：单个离线 HTML，ELK.js 0.9.3 分层布局在 Web Worker 中运行，名称自动换行，导出透明背景的原生 SVG。仓库检查覆盖 `tools/`。
- 两种用法：人在页面上用表格和图上工具栏编辑（加减主体与持股、改比例、拖动调整同级顺序、撤销），agent 用 `render.mjs` 经无头 Chrome 调用同一个 `EC.render` 出图。
- 在应用内浏览器检查了编辑操作、样例与 20/100/500 主体合成图和 SVG 结构，命令行在 `file://` 下出图成功；没有在其他 SVG 软件、Safari、Firefox 中检查。

## 2026-10-17 · Writing Kit 修订交接的裁决

- 并入 [Writing Kit 修订交接](vault/distilled/writing-kit-spec-handoff-20261016/README.md)，按 [ADR-036](docs/decisions/036-writing-kit-spec-handoff.md) 裁决：讲解页的结论层从问题讲起，共用机制只在一处讲；成文原理第 6 条加缩写首用；多语言页加外文来源提炼的语言边界；共享验收的固定顺序换成检查面；证据页写明对象自身的历史是正文；审阅加“改正时补进假设”。
- 新增配置项 [作者语体](dsh-praxis/kit/writing/author-profile.md)，默认关闭；任务要求用仓库所有者口吻，或项目 AGENTS.md 写有 `作者语体：开` 时打开。私有证据底稿留在本机 `vault/private/`，不入库。
- 并入 AgentScope 知识片的视觉修订（原生 SVG 对象叙事的 cut3 与视觉规格比对）；其余已并入的分支删除。
- 没有做真实写作试用。

## 2026-10-15 · SaaS 教材的交互版与编订体例

- 新增 [SaaS 工程全景 · 交互教材](demos/saas-engineering-textbook/README.md)：从 Books 正文与 Vault 结构数据生成的离线多页站点，含 33 例结构面板与 9 个交互图件；全书正文经独立审阅后改写回 Books。交接与验证命令移出读者路径，归入 [Vault 资产索引](vault/distilled/saas-engineering-atlas/README.md)。
- 并入 [技术文档编订研究](vault/distilled/technical-compilation-writing-research-20261014/README.md)，并在本书上做事后对照，见 [试用记录](vault/distilled/technical-compilation-writing-research-20261014/saas-trial-20261015.md)。
- [成文原理](dsh-praxis/kit/writing/principles.md)第 8 条与 [审阅方法](dsh-praxis/kit/writing/review.md)加“重复设防”：限定在读者需要处说一次；[证据与来源](dsh-praxis/kit/writing/evidence.md)把过程材料归 index；审阅第 7 步可用脚本比对不可损失的字面量。兼容扩展，见 [ADR-034](docs/decisions/034-state-limits-once-and-keep-process-out.md)。
- 来路标签（例子是构造的、不对应某家产品或标准）不算限定，写在约定页或 index；SaaS 书据此删去，补记在 ADR-034。教材站点改为分场版式，并加 18 张手绘 SVG。
- 用户交来的写作规范只取结构：讲解页每节先给局部答案，审阅加“目录冒充概览”“摘要逐级稀释”，交叉链接写明关系，见 [ADR-035](docs/decisions/035-local-answers-and-link-relations.md)；原件登记在 [Vault](vault/distilled/technical-compilation-writing-research-20261014/knowledge-organization-spec-20261015.md)。

## 2026-10-12 · 并回此前暂存的本地工作

- 10-04 至 10-12 暂存在 stash 的本地工作并回 main：[排列与刻度](dsh-praxis/kit/design/foundations/placement.md)与 ADR-026、Motion ceiling、两条能力测试短片、Palantir 阅读原件、会话入账与 harness 审计（ADR-030）、互著别裁（原编 ADR-029，改编 [ADR-033](docs/decisions/033-content-discovery-and-retirement.md)）。各项的日期与内容见下方原条目。
- 两边改了同一段时：正文体例取 main 较晚的写法（[ADR-029](docs/decisions/029-design-writing-reference-encyclopedia.md)），stash 独有的判断并入其中，即指向排列与刻度的入口、治理文档里以职责代替模型名、Write / Motion 的制作记录表。AgentScope 知识片取已完成的第二版；索引由脚本重新生成。
- 没有重新验收各项工作本身。

## 2026-10-12 · 术语与讲解页的编排

- [成文原理](dsh-praxis/kit/writing/principles.md)第 6 条：术语取目标读者之间最稳定的说法；在 AI 与 agent 这类术语主要以英文流通的领域用英文原词，不临时造译名，首次出现时交代含义。[审阅方法](dsh-praxis/kit/writing/review.md)偏差表加一行。兼容扩展，强度不变。见 [ADR-031](docs/decisions/031-stable-terms-and-explainer-page.md)。
- Write / Publish 新增 [讲解页的编排](dsh-praxis/kit/publish/html/explainer.md)：每个局部回答四问、四层的可见性、事实底稿、可调之处与反例。可取用的参考，不是必经步骤。
- [成立程度的标记](dsh-praxis/kit/design/foundations/standing.md)可调情形加一句：交互图里强调色可作“当前选中”。
- 新增演示 [DeerFlow 怎样工作](demos/deerflow-explainer/README.md)；稳定语义的记号、控件与运动写成 [工单](demos/editable-native-svg/claude-design-order-20261012.md)，交给独立的 ClaudeDesign。
- 交付收进 Design 的 [记号、控件与运动](dsh-praxis/kit/design/marks/README.md)：57 个原生 SVG 记号、11 个控件、10 种运动，grammar 与这一版画法分开；normal/reference，按需取用。讲解页的系统全景图取用了 18 个记号，效果与缺口记在该包的 [检查与取用记录](dsh-praxis/kit/design/marks/checks.md)。见 [ADR-032](docs/decisions/032-semantic-marks-library.md)。
## 2026-10-12 · AgentScope 企业线视频与封面交付

- 新增 [AgentScope 企业线知识片](demos/agentscope-enterprise-film/README.md)：公开文档与固定源码研究形成 53 场、横屏无 TTS 视频，以及可暂停舞台、详尽阅读稿和两张原生绘制封面。Python 2.0 与 Java Harness/Service 分开讲解，旧 Runtime/Studio 只讲迁移。
- 三位 Luna 做有界探索，Astra 裁决范围并独立审阅；事实和图形语义修订、编码及检查见 [制作记录](demos/agentscope-enterprise-film/production.md)。公开来源、原件 hash 与局部缺口保留 Vault。
- 按用户新增要求，在唯一 [Motion 交接契约](dsh-praxis/kit/publish/video/narrative.md#多平台封面与交付表述)记录后续视频默认交付 4:3 与 3:4 原生封面，封面与成片画幅独立；制作状态和泛泛保护话语进入过程文档。新要求不追补历史成片。
- 一次外部误重置移除了在制目录；研究包与管线在临时目录恢复，转入独立分支保存本次成果。仓库验证与成片范围见 [验收回执](docs/verification/agentscope-enterprise-film-20261012.md)。

## 2026-10-11 · 艺术与软件语法参考书

新增有界来源书目、12 条可选深参考与语法交叉索引，区分来源、发现集合、作品、实现工具和本库推导；覆盖传统材料、编辑排印、光与空间、时间/规则、交互及 Open Design/agent 设计生态。沿用既有 canonical homes，不改写上一轮百科。验证、失败与独立发现试用见 [交付回执](docs/verification/art-software-atlas-20261011/README.md)。

## 2026-10-11 · Design / Write 参考书目与语法扩展

- 保留现有任务树，增加 13 个可选语法条目、29 个独立公开 URL 记录与 6 份短摘录，覆盖视觉、交互与时间、写作编辑、跨媒介四流；[书目与覆盖](vault/provenance/design-writing-encyclopedia/README.md)连接来源自足摘要和 Kit 操作判断。
- 版本、取得/复核时间、使用轨迹移到独立记录；历史原件不改，当前缺陷和证据范围仍可见。维护规则与双向索引见 [ADR-029](docs/decisions/029-design-writing-reference-encyclopedia.md)。
- 四项独立普通任务、一次入口复查与独立编订复核暴露的发现/表述缺口已修复；实际路线、局限与检查见[验收记录](docs/verification/design-writing-encyclopedia-20261011/README.md)。本批不声称组件实测、受众效果或全学科覆盖。

## 2026-10-12 · 无配音知识片

- 新增 [Write 分支知识片](demos/write-kit-film/README.md)：只给题目（编译成知识讲解视频，不做配音），由主会话沿 Kit 入口取用 Write 各页，引用 Netflix 简体中文字幕规范的读速上限（成人每秒 9 字），沿用薪酬基线说明片的管线、去掉配音与混音，做成 245 秒的无声片。时间由人定，读速写成检查：任意 4 秒窗口新出现的字不超过 36 个。
- 画面文字由一位未参与撰写的 Opus 审阅者做结构审阅并对照 Kit 原文核对事实，主会话裁决：13 项采纳（含 1 项改写后采纳）、2 项保留；其中四条底线、三档强度与验收表的几处措辞回到原文，一处页面没有的说法（“无对照组”）去掉。
- Kit 只动一处入口：[Write / Motion](dsh-praxis/kit/publish/video/README.md)的制作记录加一行，写明无声片怎样定时。规则含义没有改，没有新增目录、ADR 或依赖；观察和复用说明留在项目说明里。
- 成片检查六项通过（流、保真、静止、空白、读速、字号）；制作方没有按实际速度完整看过，没有受众测试，审阅只有一位审阅者、一轮。验证：`python3 scripts/validate_repository.py`。

## 2026-10-10 · 视频能力测试与一次回流

- 新增 [薪酬基线说明片](demos/role-baseline-film/README.md)：只给题目，由主会话沿 Kit 入口取用规则、参考和金字塔片的管线，做成 97 秒说明片与一份 txt（另编 Word 与 PDF），材料合成。成片检查七项通过；制作方没有听过声音，独立冷读没有完成，没有受众测试。
- Kit 只动两处入口：[内容验收](dsh-praxis/kit/publish/verification.md)加一句，指向“感知不到的部分”和“自查通过之后”两条备用做法，这次从内容表达的入口读不到它们；[Write / Motion](dsh-praxis/kit/publish/video/README.md)的制作记录加一行，写明短片从哪个项目起步。规则含义没有改，没有新增目录、ADR 或依赖。
- 取用记录、观察和复用说明都留在项目说明里，没有写进各规则页。引擎与管线仍是从金字塔片拷来的一份，没有抽公共层。
- 主会话（Opus）完成；交给独立审阅者的一次冷读随会话中断，没有交回。验证：`python3 scripts/validate_repository.py` 通过。

## 2026-10-09 · 会话入账与 harness 边界

- 两份讨论摘录按现有 Vault 结构归档、提炼与登记；原会话历史未提供，外部官方来源作为补充来源，不冒充原引用恢复。
- 全局指引新增薄会话入账契约；Praxis 收窄维护前必读范围，将固定模型分工与会话授权改为能力偏好和当前授权判断。保留工作规则、来源边界和仓库验证，见 [ADR-030](docs/decisions/030-session-ingestion-and-harness-boundaries.md)。
- 具体改动、风险、验证及未决项见 [审计回执](docs/verification/harness-audit-20261009.md)。

## 2026-10-08 · 技术文档文案收敛

- 精简架构与治理文档中的重复提醒、抽象术语和保护性措辞；将动作、条件、去向和必要依赖写明。架构与 Motion 入口按用途链接正文，ADR-033 校正文句，规则含义保持不变。
- 按仓库中文成文规范审校，重访中文技术文档指南和 ASD 官方说明；来源取得范围、消费方式和缺口见 [复核记录](docs/verification/writing-review-20261003.md#2026-10-08-复核与文案清理)。
- 图文、网页、Slides 与视频入口同时连接 Write 和 Design；Design 参考表补外部作品与 Opus 制作研究，语法仍按分支维护。旧参考页收为兼容导航，保留既有锚点；修正 Write 的样张阶段描述。
- 仓库校验与 `git diff --check` 通过；首轮检查的 227 个本地链接与锚点可达，改后五条定向导航与三个兼容锚点检查通过。未制作新材料或复验外部作品。

## 2026-10-08 · 持续维护与互著别裁

- 按用户要求，在既有文档结构与修订流程中补充多入口单正文、按用途提炼、显式必要依赖，以及增量、合并、迁移、移交和清退的去向记录，见 [ADR-033](docs/decisions/033-content-discovery-and-retirement.md)。没有新增目录、索引系统或运行依赖，没有实际迁移或删除材料。
- 主代理编订，Luna 核对既有规则；三种维护情形的条文走读未发现职责冲突，未做真实生命周期操作或对照实验。来源与快照覆盖没有变化，既有未核实来源及未快照依赖仍按原记录保留。
- 验证：`python3 scripts/validate_repository.py` 通过（1,207 份 Markdown、478 份 JSON、866 个快照，0 错误）；本轮既有文件的 `git diff --check` 通过。

## 2026-10-08 · 发现入口与消费记录

- 保留现有目录；在 [Write / Motion](dsh-praxis/kit/publish/video/README.md)连接长片、机制演算、空间表达的施工与消费记录，[Design / Motion](dsh-praxis/kit/design/motion/README.md)补外部研究入口，[demos](demos/README.md)补 Motion ceiling 工场。各项目的技术与参数继续留在项目内。
- [Palantir reading list](palantir/references/README.md)逐项链接已有候选笔记；上层入口区分候选提炼与已采纳正文，历史任务书标明已经执行，主题入口补已有消费项目。补金字塔过程重建的 intake 导航。
- 本轮由主代理编订、两位 Luna 只读追溯；只核对仓库内记录，没有重新访问外部来源、补快照、运行渲染或制作视频。金字塔主日志与研究网页未快照，A3 部分运行依赖未快照，Motion ceiling 多数外部来源仍未读；四本阅读材料全文仍缺。未新增专用交接文档或重复的制作流程。
- 验证：`python3 scripts/validate_repository.py` 通过；Luna 定向走读 Dalio 已读边界、Impro 缺正文、机制类视频选型与金字塔过程追溯四条路径，无断链。属于维护走读，未做新主笔制作或对照实验。

## 2026-10-06 · Palantir 阅读清单拿到原本

- 逐条实访阅读清单的 8 个 URL，取得 9 个文件、3,998,632 字节：[原件快照](vault/snapshots/local/palantir-20261006/README.md)。此前 8 个 URL 全部 `unverified`、7 个对象都没有本地原件。
- 三份是全文：Qureshi、Lonsdale，以及 Dalio 的 2011 版权 106 页 PDF。四本书只有片段：Portigal 的第 2 版第 1 章、Wright 的出版方授权节选、Allen 的官方节选，Johnstone 只有出版方描述与目录。
- 原站直连两个被拒：Qureshi 返回 429，Rosenfeld 与 Bloomsbury 返回 403，都没有绕过；这三份经 Internet Archive 存档取得。Dalio 的登记 URL 已失效为官网首页，PDF 是经 2016 年存档取回的。
- 阅读清单与[主题入口](palantir/README.md)改写为按实际证据边界登记；`unverified` 归零，改为 3 个 `verified`、5 个 `partial`。GTD 的节选据版权页为 2001 年版，与登记 URL 所指 2015 版不同，已写明。
- 另取得 Portigal 自行免费发布的 6 份实践 PDF（363,054 字节：筛选问卷、访谈提纲、现场参与说明、两份复盘表、顶部摘要），取自作者自己站点的媒体库，不是第三方转载。共 15 个文件、4,365,133 字节。
- Internet Archive 有 Impro、The Looming Tower、Getting Things Done 三份扫描件，但都是受控借阅（`access-restricted-item`，抓取全文返回 401），需用使用者自己的账号借阅；本轮没有登录、没有替借、没有绕过闸门。
- 影子图书馆（zlib、Anna’s Archive、libgen 等）未接触：所涉四本为版权期内商业书，是来源不授权，个人学习用途不构成豁免。补齐只走购买、借阅或使用者提供合法副本。
- [回执](docs/verification/palantir-source-acquisition-20261006.md)记录逐件核对、取得依据、放弃的路径与未做项。没有提炼，没有 Kit 采纳。
- 随后按先写好的八份任务书完成初次提炼，在 dsh 里由主会话串行执行（claude 未登录、无 codex CLI，派不出 subagent，故不是 Luna 集群）。七份笔记见 [Palantir 初次提炼](vault/distilled/palantir-reading-20261006/README.md)。
- **最主要的发现：这七份材料不是散书。** Qureshi 原文说明 Impro、The Looming Tower、Interviewing Users、Getting Things Done 加 Dalio 早期 PDF，是 Palantir 当年发给新人的入职书单；Lonsdale 那篇曾是对内文件。清单的关联来自这份书单本身。
- 核对确认两条旧记录：Lonsdale 第 5、6 条（第 5 条用细小迹象看整体，第 6 条当场想清楚）；Portigal 高层计划只有三项、参与者提问另列。
- **更正两处数字**：Looming Tower 的节选是 2,470 词，不是回执记的 3,448 词（旧值把出版方奖项与评价文案算进去了）；Dalio 106 页在手但 Part 3 的 210 条基本未读。
- 三处如实记下「不足以支撑」：Impro 的三个关注维度与目录标题重合，目前是循环论证；Looming Tower 的四个维度在节选中一个都支撑不了；GTD 的四类边界在节选中未出现。

## 2026-10-05 · 知识片的做法留作可取用的参考

- 把 ADR-027、ADR-028 新增的两种独立审阅写明是可以取用的做法，不是每件任务的必经步骤；口播旁白页的随稿材料改成按任务取用。条文的含义没有变，强度写清了。
- [工作开展方式 · 备用素材](kit/environment/working-methods.md)加三条：把研究交出去、自查通过之后、感知不到的部分。它们是备用素材，不默认加载。
- [Motion 入口](dsh-praxis/kit/publish/video/README.md)、[演示实现](demos/README.md)和 [Distilled](vault/distilled/README.md)各加一处指向 Knowledge Film 001 的样例和过程重建。
- Knowledge Film 001 第五版收尾：片尾塔补上第五片叶子，成片检查六项通过（旁白转写比对第一次跑）。记录在 [回执](docs/verification/narration-distill-20261005.md)的“收尾时的调整”一节。

## 2026-10-05 · 口播旁白与独立冷读

- Write / Prose 新增文体页 [口播旁白](dsh-praxis/kit/writing/genres/narration.md)：为耳朵写的指代、主干、读音和叫法，口播里要数的六种句式，旁白与画面文字的对应，随稿交付的句式统计和读音清单。见 [ADR-028](docs/decisions/028-narration-genre-and-cold-read.md)。
- [审阅方法](dsh-praxis/kit/writing/review.md)新增“成文的独立冷读”，结构文字的独立审阅补三项产出，常见偏差表加七行结构文字的例子；[成文原理](dsh-praxis/kit/writing/principles.md)第 5 条加一句“同一句话在几处出现时逐字一致”。
- Prose 入口加两处：把撰写交给别人时把条文写进任务书；空泛写法的自查指向 Vault 里已有的候选提炼。
- 属于兼容扩展。[回执](docs/verification/narration-distill-20261005.md)记录这次提炼对照的过程、进入与没有进入的内容、一次入口走读。使用证据只有一条片子和同一名主笔。

## 2026-10-05 · 成文审阅的目标与结构位置

- Write / Prose 按用户裁决恢复两项，见 [ADR-027](docs/decisions/027-prose-review-goal-and-structural-text.md)：[审阅方法](dsh-praxis/kit/writing/review.md)以让成文更接近人类作者写出的中文为目标；[成文原理](dsh-praxis/kit/writing/principles.md)第 5 条的结构位置回到凝练、并列的短语，画面上的短文字计入结构位置，第 6 条恢复“模型惯用的搭配”。
- 审阅新增两步：通篇检查句式是否重复；结构文字多的材料由没有参与撰写的审阅者单独审。
- Write / Motion 的 [叙事与分镜交接](dsh-praxis/kit/publish/video/narrative.md)新增“旁白与屏幕文字的审阅”一节，把旁白接到成文审阅、屏幕上的结构文字接到独立审阅，并要求写进撰写者的任务书。属于兼容扩展。
- 属于规则含义的变化，修订 ADR-024 的两处。新任务适用；ADR-024 生效期间按旧条文审过的材料没有重审。[回执](docs/verification/prose-review-restoration-20261005.md)记录召回、核对、改动和未做的事。

## 2026-10-04 · 排列与刻度

- Design / Foundations 新增 [排列与刻度](dsh-praxis/kit/design/foundations/placement.md)：把几项内容沿一条线排开时，位置回答了哪几个问题要写成一句读法放进图里；没有量就不按比例画；并排的线要么共用一条标尺，要么写明各排各的。见 [ADR-026](docs/decisions/026-placement-and-scale.md)。属于兼容扩展：新增一页和几处入口链接；[图形编码](dsh-praxis/kit/design/composition/encoding.md)、[成立程度与归属的标记](dsh-praxis/kit/design/foundations/standing.md)、[精确指向](dsh-praxis/kit/design/foundations/anchoring.md)各补了半句，原有规则的含义没有变。
- 可编辑原生 SVG 的图件升到 0.3.0：新增 `rel-rail` 和 `rel-pair` 两件，版本图在图脚补上位置的读法；样板页加第三节。它们是 demo 里的候选实现，不是 Kit 的共享组件。
- [回执](docs/verification/placement-grammar-20261004.md)记录检查、独立复查、两次冷读与对照、未做的事。使用证据只有合成内容和同一名制作者。

## 2026-10-04 · 关系图的成立程度与精确指向

- Design / Foundations 新增 [成立程度与归属的标记](dsh-praxis/kit/design/foundations/standing.md)和 [精确指向](dsh-praxis/kit/design/foundations/anchoring.md)，各给不随画法改变的约束、关系图的默认和“只用文字、一张图、几张图连起来”的三级做法，见 [ADR-025](docs/decisions/025-relation-marks-and-anchors.md)。属于兼容扩展：新增两页和几处入口链接，既有规则的含义没有变。
- 可编辑原生 SVG 的四个关系图件升到 0.2.0，状态词和指向改用共同的一套，新增组合件；另有一页样板。它们是 demo 里的候选实现，不是 Kit 的共享组件。
- [回执](docs/verification/relation-grammar-20261004.md)记录检查、两次冷读与对照、未做的事。使用证据只有合成内容和同一名制作者。

## 2026-10-03 · 成文规则与 writing 薄入口

- 对照委托提供的召回摘要与当前 Write 实现，窄修订语体、句式、信息作用、审阅判准和修改记录默认，见 [ADR-024](docs/decisions/024-prose-defaults-and-review-scope.md)。四条语义底线和现有目录保持，个人口吻只用于当前任务。
- Prose 直接说明外部参考的用途与低权重边界；既有三个来源重访，ASD-STE100 三个官方路由访问受限，未提炼规则或声称合规。Reporting 的 brief 前提与入口对齐，Publish 补当前职责裁决链接。
- [回执](docs/verification/writing-review-20261003.md)保留对照表、四段现有文本的适用边界和未验项。Write 纯文本收缩与既有 ADR 落位的冲突已列明，未实施职责迁移。

## 2026-09-27 · Kit 体例与设计参考消费

- 消费两份指定 Chat，由 Luna 探索与登记、Astra/main 裁决；覆盖与缺口见 [验收回执](docs/verification/kit-editorial-review-20260927.md)。
- 补齐 Kit 准入、渐进阅读、参考 distilled 语义、使用反馈与退出机制，见 [ADR-015](docs/decisions/015-kit-editorial-contract.md)。
- Design 入口改为任务导航，通用判断独立维护；答卷的固定样式与交付参数迁入 Vault 历史 profile，既有产物未改动。

## 2026-09-18 · 初始入账

- 以用户建立的Praxis远端为总名，建立Enterprise、Reporting与Work System三个入口。
- 登记三份Chat、外部溯源、本地设计材料的提炼与快照。
- 建立Goal/第一性原理、Luna/Astra分工、晋升与增量修订规则。
- 本版本是知识与契约基线；应用、组件与真实客户场景尚未实现。

后续语义变化须关联证据或ADR；来源入账数量与缺口以vault登记为准。

## 2026-09-19 · 工作系统增量与发布收敛

- 保留r1/r2，新增r3/r4完整快照；消费分流区分当前Praxis治理与其他项目候选。
- Goal扩展到工作环境、业务探索与专业交付；编订Kit/Skill、数据分区、Expert职责和抗折旧理由。
- 增加可重建的Chat inventory、统一registry、来源卡与不可静默覆盖的快照hash清单。
- 最终结构与公开范围review由Luna独立完成，Astra负责修复、验收与提交。

## 2026-09-19 · 材料分类小单

消费独立对话 2 轮/4 消息；补充 Reporting 六项 brief 与目的路由，采纳驻场组织接口、净减负和双账本约束。见 ADR-008。

## 2026-09-20 · 文档架构与审阅消费

- 将根、Kit 与各工作入口按任务和产物组织；定义、理由、状态与验证各自维护，见 ADR-011。
- 接续 ADR-009：共同语法、十二知识面、场景字段、分层验收、移交和消费者维护闭合。
- ADR-010 区分领域 Kit 与运行消费者，保留宿主状态和权限归属。
- 登记两份审阅原件、关联会话与 6 个官方文档实践页面；原补丁包未取得，具体范围见本轮验收回执。
- 新批次接入既有索引生成；独立研究的来源卡使用独立来源身份说明。

## 2026-09-22 · 平台产品 grammar 与 XMind Profile

- 按 ADR-012 为平台产品扫盲建立十章词表、自然语言解释与迁移案例，研究材料留 Vault，Kit 提供消费入口。
- 新建跨任务思维导图索引，原稿按主题单点维护；核心词表限定规模，推荐与采纳分开记录。
- 采纳用户提供的 `xmind-md/0.1`，增加静态 preflight；应用基线来源和实际导入状态分开报告。

## 2026-09-23 · AI 能力测试研究与回答体例

- 登记关联 Chat 与 3 个附件，Luna 分题核查外部实践并保存正文快照；原引用占位与补充证据分别登记。
- Astra 编订五题母稿、交付蓝图与 ADR-013，采纳面向外部读者的回答体例；页面与产品实验待后续工单。
- 外部正文快照接入 hash 清单，保留既有平台 grammar 工作树修改。

同日追加Jev社区研究包：独立登记24个来源入口，分清重复任务、独立样本、同研究多入口与线上/离线回放；增量进入研究地图，并少量修订Q2/Q4正文，Claude工单仍为单张。

同日续订：Luna召回CW Pages实际图表/编译与career展示HTML；答卷采用五个阅读页和共用纲要卡，参考定位并入原Claude单工单，保留正文/index分工。

前端设计资料在vault/distilled/frontend-design单设一目，集中CW、SE、career原件定位、前端绘制消费记录与外部参考；答卷作为消费者，避免通用素材仅挂在单次考题下。

同日版式复审：根据用户Q1截图否决仅去卡片的修补，建立五页论证/主展项和37段内容映射，重写Claude单工单；保留用户截图、CSS与两张历史Pages编排参考，未将文档改动称为页面已修复。

## 2026-09-22 至 24 · 平台扫盲、能力测试答卷与 Design/Writing kit

- 平台产品扫盲与思维导图归属，见 ADR-012。
- AI 能力测试：研究登记、五题回答母稿、问题—答案树与离线 HTML 答卷（`vault/distilled/ai-capability-assessment/rendered/`），回答体例见 ADR-013。
- 前端设计与可视化参考的召回、裁决与消费记录（CW、Schema Engineering、career-kit、外部 DESIGN.md、W3C/WCAG、GOV.UK、ONS）。
- 建立 [kit/design](dsh-praxis/kit/design/README.md) 与 [kit/writing](dsh-praxis/kit/writing/README.md)，写作原理由项目 skill `writing` 自足承载，见 ADR-014；旧的全局 house-style skill 停用。
- 第三方网页快照中的预签名 S3 凭证已脱敏，另存为带日期的新版本路径。

## 2026-09-27 · Kit 结构落实与独立审计

- 按用户指出的结构缺口建立 Write 的 prose/publish/motion/shared 分支，Design 按判断和参考用途分层；规则迁入唯一位置，旧路径保留导航，见 [ADR-016](docs/decisions/016-progressive-kit-structure.md)。
- Writing skill 改为读取 Kit 的薄入口；专门答卷体例放入 Prose/Genres。
- Sol 完成迁移前的 [治理审计](docs/verification/editorial-audit-20260927/README.md)，Luna整理参考与Vault导航。
- Opus 改为用户手动paste的 [原子化编排工单](vault/distilled/layout-specimens-20260927/brief.md)，开放Design探索，尚无样张产物。

## 2026-09-27 · 参考发现、优先取用与回流

- 按 [ADR-017](docs/decisions/017-reviewed-reference-priority.md)区分参考取用优先级、证据状态和规范采纳；两项经限定用途验收的结构说明进入Kit任务优先层。
- 建立demo/实际消费的增量回流、降级与退出路径；修正样张父级入口的旧状态，并补非Design与Runtime的任务参考路由。
- 全仓本地材料覆盖与无额外提示的真实消费效果仍须继续验证，详见 [发现性验收](docs/verification/reference-discovery-20260928.md)。

2026-09-28续订：以不点名材料的任务验证渐进披露；完整atom与事件快照保留探索入口，发现性断点也作为长期维护的反馈。


## 2026-09-28/29 · 视觉语法材料与当前工作收尾

- 入账“建立视觉语法语料库”3轮6消息及截图；四组Luna追溯Courtwork、Schema Engineering、Praxis与相邻项目，以及21个独立外部URL。
- 在 [视觉语法工场](demos/visual-grammar/README.md)准备8个开放工单、原仓库/外部索引和Opus唤醒prompt。Astra整理材料结构，Opus自由选择技术栈、grammar、激进效果与实现。
- 梳理既有Kit迁移、研究入口与答卷产物改名后的链接；历史研究与验收保留其原范围，当前入口采用最新状态。原子化编排实验现已有产物，27日“尚无样张”是当时状态，当前见 [研究与筛选](vault/distilled/layout-specimens-20260927/README.md)。
- 本轮材料检查与全仓收尾结果见 [验收](docs/verification/visual-grammar-20260928.md)，不代表新demo或视频已经制作。

同轮结构接管验证：布局样张明确为可直接参考/改编，消费与审阅状态分离。两项HTML工件和一项文字布局只作验证证据，归入docs/verification；发现的参考机制误读回写唯一卡片，并经新上下文复测，未将测试工件晋升为产品或组件。

## 2026-10-02 · Design grammar atlas 消费

- 入账用户提供的 44 文件研究包并逐文件 hash；47 条外部来源各重访一次，32 verified、11 partial、4 unavailable，只读文字。
- 包的校订意见基于远端旧基线；关于入口与路由的部分，本地已由 ADR-015/016/017 覆盖。
- 按用户裁决保留泛化层（[ADR-018](docs/decisions/018-generalized-design-relations.md)）：新增 [构成关系与问题地图](dsh-praxis/kit/design/foundations/relations.md)，收十五个构成问题、约束强度与检验方法；[视觉语言参考](dsh-praxis/kit/design/references/languages.md)（VL01–VL08）、样张和打样提案作为它的取用方式挂出。
- 按包内 A01 提案做了一件 [阅读关系样张](vault/distilled/design-grammar-atlas-20261002/a01-reading-relations/README.md)：一份夹具、一份 HTML、五套样式；得到断行与字重两处失配。
- 六题冷启动走读、补入口后的复跑与全部未做项见 [回执](docs/verification/design-grammar-atlas-20261002.md)。Opus 主会话裁决，Sonnet 只读代理对照、重访与走读。

## 2026-10-02 · 工单提案入账与工单一

- 入账 dot 的 [下一轮串行工单与 Motion 提案](vault/distilled/design-kit-workorders-20261002/README.md)：五包工单逐包裁决，附录的 16 个外部链接登记为 unverified。
- 执行工单一：九项更正逐条对回包内原句，主会话直接重读 16 条来源并看了一张原作海报；三行首轮记法撤回，atlas 来源现为 34 verified、12 partial、1 unavailable。
- Kit 只改措辞：[视觉语言参考](dsh-praxis/kit/design/references/languages.md)的 VL01、VL03、VL07 与图像说明，[问题地图](dsh-praxis/kit/design/foundations/relations.md)的 G12 一句。没有新增条目或规则。
- 放行给下一包的输入、悬置项与未做项见 [回执](docs/verification/design-kit-wo1-20261002.md)。工单二至五未开工。

## 2026-10-02 · 工单二：陌生 brief 冷读

- 三份合成内容（迁移、拒用、补充），预期判断在代理开跑前冻结；九次 Sonnet 冷读，其中三次是不读仓库的对照。
- 读过 Kit 的六次全部到达所需页面并作出预期决定。对照组在版面结构上决定相同，只在把字体与颜色归给风格名这一点上不同。
- 修订一处：A01 的字重观察补了适用范围。VL01 与问题地图登记了这次取用。没有新增条目、参数或样张。
- 结果、限制与给下一包的输入见 [冷读结果](vault/distilled/design-kit-workorders-20261002/wo2-unfamiliar-briefs/README.md)与 [回执](docs/verification/design-kit-wo2-20261002.md)。

## 2026-10-02 · 表达规则的归属、强度与入口

- 入账 dot 的 [Write / Present 架构校订补充](vault/distilled/write-present-supplement-20261002/README.md)；它审的是远端旧基线，对照本地后按 [ADR-019](docs/decisions/019-expression-owners-and-entry-paths.md)落位，不新建 Present。
- 根 `AGENTS.md` 与 Kit 入口分成“做任务”与“维护仓库”两条路，写明读到哪里停。
- Write 的规则分底线、语言约定、编辑启发式三种强度；成文原理八条原文不改，新增强度表；新增 [格式检查](dsh-praxis/kit/writing/language/format.md)。
- 换媒介或改篇幅分投影、改编与新增，改编附变动说明；配一件 [对照样张](vault/distilled/write-present-supplement-20261002/projection-vs-adaptation/README.md)。
- 图形语义去掉第二份正文；运动判断补“补间不是观测”。
- 四条取用路线前后走读共十次：内容都守住，读取量只在一个任务上下降。见 [回执](docs/verification/write-present-supplement-20261002.md)。
- 用户下载的 Poster House PDF 里看了四张海报，H02 与 VL01 的来源状态更新。

## 2026-10-02 · 内容架构审阅：入口校订

- 入账一份没有署名的 [内容架构与能力语法审阅](vault/distilled/content-architecture-review-20261002/README.md)；它读的是远端旧基线，逐条对照本地后只执行第一批，裁决见 [ADR-020](docs/decisions/020-entry-calibration-and-depth-check.md)。目录不动。
- [Kit 任务入口](kit/README.md)写明改一句话、解释通用概念、规则确定的转换不必进分支，只守证据底线；改正一处把企业工作面九项标成“共同语法”的链接。
- [Reporting 入口](dsh-praxis/kit/task/README.md)把“写明要对方决定或去做什么”提到产物一行，做到就停。[工作系统](kit/work-system/README.md)的研究层改为按需；[企业工作面九项](kit/grammar/README.md)写明什么任务不必读。
- [文档结构契约](docs/architecture/documentation.md)加场景取值与工具能力两行，加写深条目的五问检查。
- 六个合成任务前后走读共十四次：三条企业工作路线改动前就走得通；小请求的读取量从 6、7 个文件降到 2、3 个；个人经营一题的提案改动后有了明确请求。见 [回执](docs/verification/content-architecture-review-20261002.md)。
- 九类能力语法候选、交付生命周期与后四批没有进 Kit，等真实素材；13 个外部来源没有打开。

## 2026-10-02 · 社区实践里的工作方式：备用素材

- 入账三份没有署名的文件：[社区 Skills 与 Prompts 的可迁移语法](vault/distilled/community-grammar-20261002/README.md)、版本与读取范围、给 Opus 的消费建议。十个样本不安装、不导入、不做成 skill；45 个外部链接里主会话按固定提交回读了 8 个，与研究包的说法一致。
- 新增 [工作开展方式 · 备用素材](kit/environment/working-methods.md)一页：部分成功后的对账、原因不明时的单一假设、对照留出与代价、分支终态、检查的覆盖范围，以及从外面拿一条做法之前的四层拆法。normal 参考，不是规则。
- [文档结构契约](docs/architecture/documentation.md)的验收加一条默认做法：说规则起了作用之前留对照和留出任务。
- [Kit 任务入口](kit/README.md)的企业工作表加一行，把恢复类任务指向工作契约和共同工作语法。
- 八次走读含三次不读仓库的对照：对照把“部分成功先对账”该做的全做到了，所以没有写成规则；读仓库的那次原先到不了已有的不变量，加路由后到了。裁决见 [ADR-021](docs/decisions/021-community-mechanisms-and-attribution-check.md)，结果见 [回执](docs/verification/community-grammar-20261002.md)。

## 2026-10-02 · 自足性审查：来源卡归属与当前状态校订

- 入账一份没有署名的 [自足性审查](vault/distilled/self-contained-review-20261002/README.md)，读的是 `main@ff96b9a`。十一条建议逐条对回本地，裁决见 [ADR-022](docs/decisions/022-source-card-ownership.md)，过程见 [回执](docs/verification/self-contained-review-20261002.md)。
- 每份 provenance catalog 加 `cards` 字段声明来源卡是生成的还是手写的。[生成脚本](scripts/render_source_cards.py)只写 `generated` 的 17 份，内容相同不写，不再写整层的 Provenance 索引。改之前照说明运行会覆盖 108 张手写卡和 24 页索引。
- [仓库校验](scripts/validate_repository.py)加两项：生成的卡和索引与 catalog 逐字相同；共用一张卡的几条来源在卡里都有 URL。第二项查出一处缺口并已补上。
- 工单提案的现状只留在主题页的裁决表，两个上层入口不再复述；[决定索引](docs/decisions/README.md)注明 ADR-014、015、016 被后来的决定替代或修订的部分；根 README 的设计任务直链参考路由。
- 没有做：按用途投影、用真实任务做带对照的消费验收、兼容入口的瘦身。没有改任何 Kit 规则。

## 2026-10-03 · Palantir 首次设计打样

- 入账用户交来的 [设计交接包](vault/snapshots/local/palantir-design-handoff-20261003/README.md)（七个文件），登记见 [入账记录](vault/intake/palantir-design-handoff-20261003.json)。
- 据此做了 [从诉求到决定](demos/palantir-discovery/README.md)：一页离线交互网页，读者加减五张合成材料，台账和四个分支的判读随之改写，选择只模拟；同一文件打印成 A4 带 S0/S1 对照表。
- 复查三篇公开来源：Lonsdale 第 5、6 条在交接里对应反了，作品已逐条改写；Portigal 页面遇到人机验证，主会话没有亲自读到。
- 没有做：受众测试、减少动效和读屏软件下的实际检查。方法仍是项目候选，`palantir/` 主题和 Kit 规则没有改。
- 用户读页面后指出文案别扭：页面文字没有经过 Write / Prose，Design 参考卡也没读。按 [审阅方法](dsh-praxis/kit/writing/review.md)改了 63 处，按两张优先参考卡加了“判读一览”，记录见作品 README。
- 入口修订见 [ADR-023](docs/decisions/023-consume-by-artifact-component.md)：[Kit 任务入口](kit/README.md)按产物的组成部分分到几支；[Design 入口](dsh-praxis/kit/design/README.md)写明页面文字仍按 Prose 写和审，并加一张先读哪张参考的表；[媒介验收](dsh-praxis/kit/publish/verification.md)加交付前的分工核对；[成文原理](dsh-praxis/kit/writing/principles.md)的结构位置加上按钮、图例和状态提示；`writing` skill 在产物含中文文字时也加载。一次改前改后对照：改后的代理打开了审阅方法和四种 Design 参考，改前只看到名字。

## 2026-10-03 · 成文原理开头的写作姿态

- 用户贴来一份写作姿态建议，主张单立 preamble 文件；按用户要求由 Opus 裁决，目标是文质彬彬、辞达。没有新建文件，把八条原理里还没写明的部分写成 [成文原理](dsh-praxis/kit/writing/principles.md)开头一段：文辞与内容相称，不凑结构，不抹平复杂与分歧。裁决记在 [当时的审阅裁决](https://github.com/lesPrivilege/Praxis/blob/02ca9ea4b0faa6a9376523883c1f9f7afd5cf154/kit/write/prose/review.md#审阅裁决记录)。

## 2026-10-04 · 企业工作面语法实验第一轮

- 按用户贴入的两段任务来文，用 Kit 的企业工作语法和一份场景契约施工了 [事项工作台](demos/enterprise-grammar-lab/README.md)：React 与 Ant Design 前端、OpenAPI 契约、模拟冲突与结果未知等行为的假后端，数据全部合成。来文没有入账 Vault；技术栈只在该目录内选定，没有写实现 ADR。
- [施工发现](demos/enterprise-grammar-lab/evals/README.md)记录了逐项判据、Kit 起作用和没有内容的地方，以及独立复查找出的缺陷和处置。只做了受 Kit 约束的一组，没有对照组，没有换领域。
- 用户随后给了一份研究 brief 作参考（未入账）。按它的反例表对照后补了 fixture 自洽检查、风险的下一步归属和离开前的拦截；它建议的付款复核场景留作第二个独立场景的候选。
- Kit、docs 和 Vault 没有改动；`.gitignore` 增加 `node_modules/`，`.claude/launch.json` 增加两条本地启动配置。

## 2026-10-04 · 企业工作面语法实验第二轮

- 用户决定做研究 brief 建议的场景。在同一目录加了第二个工作台 [付款复核台](demos/enterprise-grammar-lab/scenarios/payment-review.md)：规则检查、预制的机器提议和人的判断分开呈现，金额是带币种的精确值，依据按“材料、版本、位置”打开。
- 为了让两个场景共用，把契约的公共部分、后端内核和工作面与场景解开。[第二轮施工发现](demos/enterprise-grammar-lab/evals/round-2.md)记录了改了多少、公共层里原先藏着哪些第一个场景的形状，以及两个场景各写了一遍、暂不抽取的部分。
- Kit、docs 和 Vault 没有改动。工作面按 ADR-002 是两个独立场景在用的候选，没有申请晋升。

## 2026-10-04 · 企业工作面语法实验收尾

- 按用户转来的三条收尾建议处置第二轮末留下的问题：不做无 Kit 对照组，结论限定为两轮怎样消费了 Kit；技术栈记在只对该 demo 有效的 [实现 ADR](demos/enterprise-grammar-lab/stack-adr.md)，不进 `docs/decisions`；教训先留成四条带反例的 [候选条目](demos/enterprise-grammar-lab/evals/candidates.md)，没有提交裁决。
- 用户给的交接稿（未入账）推荐的场景已经做完，只拿它的 12 条不变量对照了现状：五条有，七条部分有，没有因此改代码。
- Kit、docs 和 Vault 没有改动。

## 2026-10-04 · 企业工作面语法实验：合并后的独立复验

- 用户另找的执行者在 `9514ce4` 上做了独立复验（交接稿未入账），只到代码和后端。它报告的两处 fixture 检查漏检属实并已修：状态与记录是否一致改为把记录按动作允许的步骤走一遍；付款复核台的记录不能指向不存在的机器提议。测试 43 项变 45 项。
- 它报告的另外两处是已记录的未修项（材料版本不带动事项版本；切换身份和整页离开绕过离开前的拦截），没有改；后一处补了浏览器实测。记录见 [合并后的独立复验](demos/enterprise-grammar-lab/evals/reverification.md)。
- 用户随后决定给关标签页和刷新加离开确认：有未提交的填写或结果未知时页面请求浏览器确认。页面侧的行为已验证；确认框本身在内置浏览器面板里不显示，没有在普通浏览器里看过。


## 2026-10-11 · 艺术与软件图谱补正

- 补齐有依据的来源/实体/grammar 分面，提供倒排查询、逐状态覆盖与反例；保留原证据身份。
- 参考建构草案记录最小采纳/延后/拒绝裁决，精简本批挂载正文，并提供本地累计审阅交接。见 [补正记录](docs/verification/art-software-atlas-20261011/facet-correction.md)。

## 2026-10-11 · 软件视觉与交互范围

- 明确目录面向全部软件工程视觉/交互，补齐原生、终端、游戏/空间、触觉与感知性能的发现路线和研究缺口；复用现有正文，不扩张证据覆盖。见 [范围矩阵](vault/provenance/art-software-atlas/software-scope.md)。
