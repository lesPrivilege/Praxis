# 对象与操作

控制面的数据由几类对象组成，人、Agent、UI、DSH 与 MCP 用同一组操作读写它们。对象的含义和操作的输入、结果保持稳定；内容、分类和视图随使用生长。

## 谁来维护

**Agent 是日常维护的主路径。** 入账、补摘要、写取用题解、归类、打 tag、对照上游检查来源、按范例修订 Kit 单元，都由 Agent 完成；校验通过后直接生效，不进人工审批队列。人通过任务指示、界面编排、修订范例和纠错表达意图，界面上的操作与 Agent 调用同一组操作。

每次修改记下操作者、所属任务、依据的范例或规则版本、改动理由，以及前后版本。写入时带上读取时的版本号（`expected_revision`）；版本已变就返回差异，重新处理，不整段覆盖别人刚改的内容。

**结构变化单独处理。** 新增分类节点、专题视图或任务类型是内容维护。改变字段含义、对象身份或消费接口是结构变化，写 ADR 并给出迁移。从未明说的行为里推断新的长期 personal 偏好，是另一类操作，学习策略以后单独定义；按已有 personal 规则维护内容不受此限。

## 对象

| 对象 | 是什么 | 草案或实现 |
|---|---|---|
| KitUnit | Task、Writing、Design、Publish 里的一个单元：入口 description、正文位置、适用范围、强度、子单元与范例 | [kit-unit](schemas/kit-unit.schema.json) |
| TaskType | 一种任务：读者、要促成的结果、默认流水线、取用的单元、素材查询与验收 | [task-type](schemas/task-type.schema.json) |
| Source | 名册里的一个来源：链接、概要、读取范围、证据状态、边界、何时重访、摘录与收录任务。自有来源都是网页，ID 为 `praxis:<slug>`；来源包的条目沿用来源包的 ID，可以只有定位 | [source](schemas/source.schema.json) |
| CatalogEntry | 一个来源在来源编目里的位置与说明：形态、Kit 分类、description（何时打开、取什么）与对它的 review；自有来源与来源包里的条目都可编目，记在名册里 | 实现见 [materials.js](core/materials.js) |
| SourcePack | 按引用接入的一组来源：一份 registry 格式的文件，或项目自己的来源索引；文件留在主人那里，Praxis 原地读取、从不写入 | 实现见 [materials.js](core/materials.js) |
| Binding | 一个来源挂到一个页面上的关系：目录里的 description、取用题解、启用、收藏、优先级、tag 与 review；关系与维护信息都在名册里 | [binding](schemas/binding.schema.json) |
| MaterialRevision | 实际取得的一份原件或资产：快照、附件、图片、音视频、代码、模板、组件 | [material-revision](schemas/material-revision.schema.json) |
| KitRevision | 对一个 Kit 单元的修订：整页存在数据根的覆盖层，记理由、依据的范例，以及写修订时包内原页的 hash | 实现见 [index.js](core/index.js) |
| Preset、Run | 可编辑的默认配置；一次任务实际用到的输入、单元版本、来源与配置，以及来源会话 | 实现见 [core](core/README.md) |
| Project | 一件工作所在的目录：根、用途、布局（哪些路径放底稿、中间产物、最终产物，按 glob）；产物属于包含它的最深一个项目 | 实现见 [projects.js](core/projects.js) |
| Artifact | 一件本地产物，三类：`delivery` 交付、`pipeline` 再做同类交付的方法、`example` 为示范某种做法预先做的样张。身份、按内容区分的版本（sha256、产出它的 Run、派生自哪一版、用哪件 pipeline 做成）、最近一次 review（写明针对哪一版）、`serves`（作为范例服务哪些 Kit 页、何时对照）。字节留在主人的工作区 | 实现见 [artifacts.js](core/artifacts.js) |

同一个来源用在两个单元上，是两条 Binding，各有题解、启用状态和 review；来源身份只有一个，编目也只有一条。Binding 没写 description 时沿用编目的 description。

**本地产物不是来源。** 本地的东西只有三类值得留下：真实交付，质量较高，常带一条可复用的管线；管线本身；为示范某种做法预先做的样张，强模型可以借来自己设计，受限模型可以照着做。它们记在产物这一层，写明 `serves` 的管线与范例、以及经 review 接受的交付，在 resolve 里排在网页素材之后，每类至多三件。项目约定、蒸馏笔记、dogfooding 与 review 记录只对当初那件工作成立，留下来只会增加噪声，不登记；运行记录就是它们的痕迹。Writing 的 personal 部分写在 Kit 里，不经名册。

**取用顺序。** 网页来源与稳定的本地产物是优先取用的对象：先读网页素材，要照着做或重复同类交付时打开范例与管线，按“标准化重复加组装”使用。

**review 只留最近一次。** 挂载、编目与产物各存最近一次 review，信号只看它；更早的结论在维护记录里。

**升级要收敛。** 每次施工都想沉淀，积累下来会尾大不掉。新增对象、字段或信号前先看能否并入已有的；过程材料不进名册与产物；upkeep 只列现在有人能处理的事。同一个文件可以既是某次任务的 Artifact，又是后来任务的 MaterialRevision，身份与用途分开记。

## 三类数据

| 类 | 例子 | 规则 |
|---|---|---|
| 持久编排 | 自有来源记录、挂载关系、题解、description、tag、收藏、启用、优先级、personal 规则、review、Kit 修订 | 必须备份；刷新和重建索引不覆盖。Agent 写的也属于这一类 |
| 版本化材料 | 来源检查（状态与内容 hash）、网页快照、摘录、附件、音频、已交付产物 | 按实际保存的版本登记；来源失效或更新时新增版本，不改旧版本 |
| 派生缓存 | 名册的合成视图、全文索引、缩略图、可重做的中间渲染 | 标明可重建及依赖；只供列表与搜索，编辑回到权威记录 |

## 素材的五级展开

| 级 | 内容 | 回答的问题 | 来自哪个对象 |
|---|---|---|---|
| 1 目录 | 名称、短 description、形态、Kit 分类、所挂单元、状态 | 值得展开吗？ | Source 的标题，CatalogEntry 的形态、分类与 description，Binding 的 description 与状态 |
| 2 来源条目 | 出处、概要、语言、实际读取范围、证据状态 | 这是什么，已经取得什么？ | Source |
| 3 取用题解 | 适用问题、用法、条件、限制、范例 | 在这次工作里怎么用？ | Binding 的 `usage` |
| 4 摘录与注解 | 可定位的片段、图表、代码，以及译释与说明 | 判断依据具体在哪里？ | Source 的 `excerpts` |
| 5 原件与附件 | 原件（按链接打开）、需要固定版本时另存的快照、可复用资产 | 怎样回查或直接取用？ | Source 的链接；MaterialRevision |

级别只表示展开深度。启用、收藏、优先级、证据状态和采纳状态分别存，不互相推断：收藏不提高证据等级，preferred 不等于已采纳为规范。

## 目录里的条目控件

目录每行是一条 Binding，显示名称、description、启用开关、收藏、删除；列表有添加入口。

| 控件 | 含义 |
|---|---|
| 启用 | 进入任务默认可选的范围；正文仍按需读取。停用不删除题解 |
| 收藏 | 个人快捷标记，与启用无关；停用的条目也可以收藏 |
| 删除 | 移除这条 Binding，可以撤销；历史消费记录仍能解析到它。从“交互”下移除一个来源，不影响它在“排版”下的 Binding。来源的最后一条 Binding 被移除后，来源仍在名册里，按自己的 Kit 分类归类 |
| Description review | 检查 description 是否准确，是否写明适用条件与取用方法；每条 review 针对具体版本，记操作者、结论和说明。Binding 的 description 与编目的 description 各自 review。Agent 和 UI 走同一个入口 |
| 添加 | 对已有 Source 建新 Binding，或先 capture 一个新来源 |

同一条 description 同时服务于目录浏览、Agent 发现和 review，不另写一份给 Agent 的版本。

## 操作

| 操作 | 输入 | 结果 |
|---|---|---|
| capture | 一批网页来源（URL、形态、description、概要、读取范围）与收录它们的任务 | 稳定的自有 Source ID 与它的编目；名册记链接、概要与摘录，不存原件；同一 URL 已在名册的返回已有条目。本地产物经 consume 登记为产物 |
| file | 任何 Source，加形态、Kit 分类或 description | 编目的一次可追溯修订；来源包从不被写入 |
| catalog | 可选的区域、形态、关键词 | 来源编目的纲目：层 → 区域 → 形态 → 来源；不给区域与关键词时只给各形态的条数 |
| curate | Source 与目标页，或已有 Binding | Binding 的题解、description、tag、启用、收藏、优先级的一次可追溯修订；目标页还没有这条关系时新建 |
| resolve | 任务类型或 brief、流水线、预设 | 要读的单元与素材清单，附选用理由；之后是服务这些单元的范例（pipeline、example、已接受的交付）；不默认挂载全部 |
| consume | resolve 的结果与一次运行 | 运行记录写下实际用到的单元、来源及其版本、由它们推出的挂载、交付的产物和来源会话；不复制原件 |
| refresh | Source | 一条检查：是否打得开、内容 hash；要求保留时另存快照，旧版本保留。集合类来源另记页面上的成员链接 |
| retire | 自有 Source 与理由 | 来源离开名册的活动列表，挂载随之停用，记录与历史保留 |
| revise | KitUnit 修订后的整页，加理由与依据的范例 | 修订写进覆盖层，立即对所有入口生效，包内原页不动；包升级后原页变了，列为冲突，合并或撤回（revert） |

每个操作配一个完整范例：输入语境、修改后的完整记录、取舍理由、完成条件。范例传达“怎样维护才合适”，schema 只检查字段、类型、引用和版本；校验通过不等于内容合格。第一个范例是 explore 中遇到一个设计参考：capture → curate 到一个 Design 单元 → 下一次任务 resolve 到它 → consume 记下版本 → 来源更新后 refresh。

## 名册怎样组成

**名册由自有来源与来源包合成。** 自有来源存在数据根的 `sources.json`：capture 写入，`praxis_source_update` 修订，`praxis_retire` 淘汰。来源包登记在 `packs.json`，分两种格式：
- `registry`：Praxis registry 格式的文件，一组来源记录，记录里的相对路径以登记的 `root` 为起点；
- `index`：项目自己的来源索引，经 `fields` 把名册字段对到项目字段名，`status` 把项目的状态值对到 verified、partial、unavailable，`excerpts` 指向按来源 ID 关联的主张文件（JSON Lines）；条目 ID 为 `<登记 ID>:<条目 ID>`。

来源包里的条目在来源包自己那里维护，名册只读。

**编目也在名册里。** `catalog.json` 按来源 ID 记形态、Kit 分类、description 与 review，自有来源与来源包里的条目同样编目（`praxis_file`）。形态是固定的一组：standard 标准规范、practice 成熟实践、component-library 组件库、case-library 案例库、case 单个案例、skill、tool 工具、article 文章、research 研究。编目是来源编目（`praxis_catalog`、控制面“来源”页）收录的条件；没编目的来源包条目仍可搜索、挂载。形态与区域的判断规则写在 `praxis_capture`、`praxis_file` 的工具说明里：形态看来源本身，区域填会用到它的 Kit 页所在的区域，拿不准就填层，不自建区域。分类不求预先穷举，只要 agent 照规则一次调用就能维护。

**挂载都在名册里。** 来源包可以声明关系（registry 记录的 `grammar_paths`）。在 Praxis 里新建、移除、恢复或编辑的关系记在 `bindings.json`，按 `<来源 ID>@<页面路径>` 对上；Kit 页写 `kit/…`。一条挂载可见，要么是来源包声明了它且没有在名册里移除，要么是在名册里建的。一页的全部来源在一处读出，任何写入都不碰来源包。

**分类就是 Kit 的层与区域。** 预设分类是 Kit 的各层，以及层下每个带 README 的目录。来源按编目里的 `category` 归类，也按所挂页面所在的区域归类，可以同时在几个区域。`praxis_search` 可按分类查。

**检查与集合。** refresh 的每次检查追加到数据根的 `checks.jsonl`：状态、HTTP 码、内容 hash。HTML 页另记正文 hash（去掉标签、脚本、样式与注释），因为标记里带每次载入都不同的令牌；判断变化时 HTML 比正文，其余比字节。相邻两次不同是来源变了，挂载的 review 记下当时的来源版本，来源此后再变才出信号；最近一次答复 404、410 或域名已不存在是链接失效，两者都让受影响的挂载出现信号。拒绝访问、限流与超时说明的是检查所在的网络，记进检查但不算失效。集合类来源（作品集、组件库、动画库）用 `members.pattern` 声明成员链接的 URL 模式；第一次检查只作基线，之后列出上游新增、名册里还没有的成员，以及名册里有、上游已下线的成员。新增的可以 capture（写 `member_of`）或带理由跳过（`praxis_skip_member`），下线的可以淘汰；处理理由进维护记录。`praxis_source` 对集合另给成员账目：最近一次检查列出的每条成员链接，记已登记（对应的来源）、不收录（理由）或未处理，并标出比上一次检查新增的。

registry 格式的字段这样读进名册：

| registry 字段 | 名册里的 | 说明 |
|---|---|---|
| `id`、`aliases` | Source ID 与别名 | 别名解析到同一个 Source |
| `title`、`canonical_url`、`original_locator` | 标题、链接或定位 | 没有 `canonical_url` 时，`original_locator` 是 URL 就当链接用，否则当定位 |
| `summary`、`evidence_status`、`evidence_modality`、`limitations`、`revisit_when` | 概要、证据状态、读取范围、边界、何时重访 | 素材第 2 级 |
| `purpose_tags` | tag | 用途 tag 跟着用途走 |
| `supported_claims`（claim_id、locator、claim） | 摘录 | 第 4 级；说法也可以写成 `claim_zh` 或纯字符串 |
| `snapshot_path`、`snapshot_sha256`、`snapshot_status` | 快照 | 第 5 级的当前版本指针 |
| `reference_priority` | Binding 的 `priority` 默认值 | 挂载上设了优先级就以挂载为准 |
| `grammar_paths` | 来源包声明的挂载 | 相对 `root` 的页面路径 |
| `captured_for`、`local_card` | 收录任务、来源卡位置 | |

Kit 正文只链到包内，不引外部材料；一页用到的来源经挂载由名册披露，随 resolve 的素材或控制面里该页的条目给出。
