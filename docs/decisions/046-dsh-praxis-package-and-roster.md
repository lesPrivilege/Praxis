# ADR-046：dsh-praxis 拆成可发布的包：数据根、自有名册、自足 Kit

日期：2026-10-27。状态：accepted。用户在目录收敛后要求完成 dsh-praxis 的施工，即 [下一轮工单](../../dsh-praxis/work-order.md)剩下的 A3、A4，以及 release 拆分 B1–B7；四项开工决定沿用 2026-10-25 的确认。主会话（Claude Opus 5.5）设计、实现并验证；Kit 正文的改写由三个 Opus 子代理分区完成，主会话逐项应用到名册；控制面界面由一个 Opus 子代理改。

## 问题

[ADR-045](045-praxis-and-dsh-praxis-relations.md)定下 `dsh-praxis/` 整个是 release 包。2026-10-25 的实测里，这个包离开仓库就不能用：
- 数据目录写死为 `<仓库>/dsh-praxis/data`；
- 名册是 `vault/registry.json`，core 每次写入都要调仓库里的 Python 重建它；
- 挂载关系写进 vault 的 catalog；
- Kit 有 68 页链到包外，共 314 处。

自用这一侧也有缺口：
- DSH 给每个会话注册全部 28 个工具；
- 运行没有记下来自哪个会话；
- 集合类来源不随上游增减。

## 决定

### 一处解析路径，数据根可配置（B1）

`core/paths.js` 一处给出四个位置：
- 包（代码与 Kit）；
- 数据根；
- `base`：相对路径的起点；
- 快照目录。

数据根按以下顺序取第一个存在的：
1. 显式参数；
2. `PRAXIS_DATA`；
3. 包旁的 `data/`（检出的仓库）；
4. `$DSH_HOME/dsh-praxis`。

DSH 插件、MCP 与命令行按同一规则解析，所以共用一份数据。数据根里的 `settings.json` 可以写 `base` 与 `snapshots`。这个仓库写 `base: ../..`、`snapshots: ../../vault/snapshots/praxis-captures`，这就是“仓库模式”。

记录里的路径分三种：
- 包内 Kit 页写 `kit/…`；
- `base` 下的文件写相对路径；
- 其余写绝对路径。

core 不再调用 Python。

### 名册：自有来源加来源包，关系都在名册里（B2）

- **自有来源**存在数据根的 `sources.json`，ID 为 `praxis:<slug>`。每条记的是：
  - 链接或定位；
  - 概要、读取范围、证据状态、边界、何时重访；
  - 摘录的定位与说法；
  - 收录任务；
  - Kit 分类。

  不存原件。capture 写这里；`praxis_source_update` 修订，`praxis_retire` 淘汰，淘汰时写理由，记录保留。
- **来源包**按引用接入，Praxis 只读不写，登记在 `packs.json`。分两种：
  - `registry`：Praxis registry 格式的文件，这个仓库的 vault 就是一个；
  - `index`：项目自己的来源索引，经字段映射读取，原 `vault/project-indexes.json` 的 Jev 登记迁到这里。

  vault 的结构与 `build_registry.py` 留在仓库这一侧。builder 把读者需要的字段一并投影进 registry：
  - `reference_priority`；
  - 快照指针；
  - 摘录；
  - 读取范围；
  - 收录任务。

  名册因此不再打开 catalog。
- **挂载：** 来源包可以声明关系（vault 的 `grammar_paths`）。在 Praxis 里新建、移除、恢复、编辑的关系都记在 `bindings.json`。挂载可见的条件是：来源包声明了它且没有被移除，或者它是在名册里建的。一页的全部来源在一处读出，任何写入都不碰来源包。
- **分类：** 预设分类就是 Kit 的层与区域（各层，以及每个带 README 的目录）。新安装得到空名册，分类随 Kit 一起就位。还没挂到页面的来源按 `category` 归类；已挂的来源按所挂页面所在的区域归类。`praxis_search` 可按分类查。
- **检查**移到数据根的 `checks.jsonl`，原 `vault/intake/praxis-captures.json` 里的 14 条随之迁出。

### 包内 Kit 自足（B3）

包内 Kit 正文只链到包内。正文对来源卡、ADR、项目与根 `kit/` 的引用处理如下：
- 来源表格整段移出正文，每行写的“这个来源对本页有什么用”改写为挂载说明；
- ADR 只把读者需要的理由收进句子；
- 项目里的样例与 vault 里未入名册的提炼，登记为自有来源，按定位挂回原页。

应用结果：
- 75 条自有来源；
- 新建 123 条挂载；
- 30 条原先照抄概要的挂载补写了说明；
- 111 条已有说明保留；
- 挂载从 582 条增至 705 条。

validator 加一条规则：包内 Kit 的链接不得离开包；原先的“引用来源卡须有关系”规则随之删除。

### 修订进覆盖层（B4）

`praxis_unit_revise` 把修订后的整页写进数据根的 `overlay/kit/…`，同时登记理由、依据的范例，以及写修订时包里原页的 hash。这条修订立即对所有入口生效，包里的原页不动。包升级后原页变了，upkeep 把这条修订列为冲突，由人或 agent 合并或撤回（`praxis_unit_revert`）。撤回时修订全文留在历史里。

### 其他 agent 的入口（B5）

MCP 在工具之外增加两类入口：
- **resources：** `praxis://entry`、每个单元，以及 source 与 artifact 的模板。来源只给链接、定位与用途，不给原件。
- **prompts：** 每个任务类型一条，参数为这次要做什么和流水线。

instructions 写明取用顺序。命令行读写同一份数据。

### fresh 走查与包内容（B6、B7）

`release/walkthrough.mjs` 的做法：
- 只复制 `npm pack` 会发布的文件；
- 给一个空的 DSH home 和一个空工作目录；
- 经 MCP 走一遍：入口、按任务取用、登记集合与成员、挂载、登记项目、交付底稿与成品、记下运行；
- 上游的集合变动后，upkeep 应提出名册的修订。

包的内容由 `package.json` 的 `files` 决定：
- 代码、Kit、schemas、界面、语言包、用户说明；
- 不含 `data/`、工单、迁移记录与测试。

版本改为 0.2.0；安装说明见包里的 INSTALL.md。发布与创建远端由用户执行。

### worker 自主消费（A3）与集合同步（A4）

- **工具面：** 工具表给 worker 用的 10 个工具标 `agent`。DSH 只注册这 10 个：按“名称、说明、参数 schema”的 JSON 计，约 8.7k 字符；施工前 DSH 注册全部 28 个，同样计法约 17.2k。维护类工具留在控制面、命令行与 MCP。
- **系统提示：** 入口段只进 agent 会话，是渐进目录的根。
- **`/praxis`：** 不带文字时打开控制面，带文字时在会话界面列出任务类型与待处理事项，不进模型上下文。
- **工具卡片：** resolve 与 consume 显示为卡片，可展开单元与素材，或打开交付文件。
- **会话标识：** 运行记下来源会话（DSH 会话 ID，或 MCP 连接），读到的原件正文可以回到那个会话的记录里找。
- **集合同步：** 集合来源用 `members.pattern` 声明成员链接。refresh 记下页面上的成员链接；第一次检查只作基线，之后列出：
  - 上游新增、名册里还没有的成员；
  - 名册里有、上游已下线的成员。

  新增的可以 capture（`member_of`）或带理由跳过（`praxis_skip_member`），下线的可以淘汰；处理理由进 history。这个仓库已用一个真实作品集验证：100 条成员作基线，名册收了其中 2 条。

## 取舍

- **来源包声明的关系不搬进数据。** 搬进来会改动 vault 的 14 个 catalog，也会打断仓库这一侧仍读 `grammar_paths` 的脚本。名册以“来源包声明、名册决定”合成一份视图，写入都在名册。
- **既有收录留在 vault。** `vault/provenance/praxis-captures/` 的 12 条（含 5 条管线）是仓库自己的研究，作为 vault 来源包的一部分继续可读；新收录进自有来源。
- **产物路径不改为按项目相对存储**（ADR-041 留给 B1 的一项）。`base` 相对或绝对已经能离开仓库使用。改为按项目相对存储后，后来登记的内层项目不会自动接管已有产物，与“产物属于最深项目、读取时计算”相冲突。
- **`/praxis` 带文字时不向模型发消息。** 向会话插入用户消息要用 DSH 的 `createUserMessage`，插件包解析不到它。人显式调用，就在会话里直接说要按 Praxis 做。

## 验证

见 [回执](../verification/dsh-praxis-release-split-20261027.md)。

## 没有做的

- 真实 fresh agent 在新 profile 里的走查：脚本化走查只走协议层，真实 agent 的证据来自 A3 的 DSH 对照实验。
- 发布与远端。
- 项目路径按项目相对存储（见取舍）。
