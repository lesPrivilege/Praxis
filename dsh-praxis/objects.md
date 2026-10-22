# 对象与操作

控制面的数据由几类对象组成，人、Agent、UI、DSH 与 MCP 用同一组操作读写它们。对象的含义和操作的输入、结果保持稳定；内容、分类和视图随使用生长。

## 谁来维护

**Agent 是日常维护的主路径。** 入账、补摘要、写取用题解、归类、打 tag、刷新快照、按范例修订 Kit 单元，都由 Agent 完成；校验通过后直接生效，不进人工审批队列。人通过任务指示、界面编排、修订范例和纠错表达意图，界面上的操作与 Agent 调用同一组操作。

每次修改记下操作者、所属任务、依据的范例或规则版本、改动理由，以及前后版本。写入时带上读取时的版本号（`expected_revision`）；版本已变就返回差异，重新处理，不整段覆盖别人刚改的内容。

**结构变化单独处理。** 新增分类节点、专题视图或任务类型是内容维护。改变字段含义、对象身份或消费接口是结构变化，写 ADR 并给出迁移。从未明说的行为里推断新的长期 personal 偏好，是另一类操作，学习策略以后单独定义；按已有 personal 规则维护内容不受此限。

## 对象

| 对象 | 是什么 | 草案 |
|---|---|---|
| KitUnit | Task、Writing、Design、Publish 里的一个单元：入口 description、正文位置、适用范围、强度、子单元与范例 | [kit-unit](schemas/kit-unit.schema.json) |
| TaskType | 一种任务：读者、要促成的结果、默认流水线、取用的单元、素材查询与验收 | [task-type](schemas/task-type.schema.json) |
| Source | 一个来源的身份：出处、语言、概要、实际读取范围、证据状态与摘录 | [source](schemas/source.schema.json) |
| Binding | 一个来源挂到一个单元上的关系：目录里的 description、取用题解、启用、收藏、优先级、tag 与 review | [binding](schemas/binding.schema.json) |
| MaterialRevision | 实际取得的一份原件或资产：快照、附件、图片、音视频、代码、模板、组件 | [material-revision](schemas/material-revision.schema.json) |
| Preset、Run、Artifact | 可编辑的默认配置；一次任务实际用到的输入、单元版本与配置；产物及其派生关系 | 第一条流水线跑通时起草 |

同一个来源用在两个单元上，是两条 Binding，各有题解、启用状态和 review；来源身份只有一个。同一个文件可以既是某次任务的 Artifact，又是后来任务的 MaterialRevision，身份与用途分开记。

## 三类数据

| 类 | 例子 | 规则 |
|---|---|---|
| 持久编排 | 题解、description、tag、收藏、启用、优先级、personal 规则、review | 必须备份；刷新和重建索引不覆盖。Agent 写的也属于这一类 |
| 版本化材料 | 网页快照、摘录、附件、音频、已交付产物 | 按实际保存的版本登记；来源失效或更新时新增版本，不改旧版本 |
| 派生缓存 | 全文索引、缩略图、`vault/registry.json`、可重做的中间渲染 | 标明可重建及依赖；只供列表与搜索，编辑回到权威记录 |

## 素材的五级展开

| 级 | 内容 | 回答的问题 | 来自哪个对象 |
|---|---|---|---|
| 1 目录 | 名称、短 description、类型、所挂单元、状态 | 值得展开吗？ | Source 的标题与类型，Binding 的 description 与状态 |
| 2 来源条目 | 出处、概要、语言、实际读取范围、证据状态 | 这是什么，已经取得什么？ | Source |
| 3 取用题解 | 适用问题、用法、条件、限制、范例 | 在这次工作里怎么用？ | Binding 的 `usage` |
| 4 摘录与注解 | 可定位的片段、图表、代码，以及译释与说明 | 判断依据具体在哪里？ | Source 的 `excerpts` |
| 5 原件与附件 | 完整快照、原文件、图片、音视频、可复用资产 | 怎样回查或直接取用？ | MaterialRevision |

级别只表示展开深度。启用、收藏、优先级、证据状态和采纳状态分别存，不互相推断：收藏不提高证据等级，preferred 不等于已采纳为规范。

## 目录里的条目控件

目录每行是一条 Binding，显示名称、description、启用开关、收藏、删除；列表有添加入口。

| 控件 | 含义 |
|---|---|
| 启用 | 进入任务默认可选的范围；正文仍按需读取。停用不删除题解 |
| 收藏 | 个人快捷标记，与启用无关；停用的条目也可以收藏 |
| 删除 | 移除这条 Binding，可以撤销；历史消费记录仍能解析到它。从“交互”下移除一个来源，不影响它在“排版”下的 Binding。来源的最后一条 Binding 被移除后，Source 退出目录但不删除 |
| Description review | 检查 description 是否准确，是否写明适用条件与取用方法；每条 review 针对具体版本，记操作者、结论和说明。Agent 和 UI 走同一个入口 |
| 添加 | 对已有 Source 建新 Binding，或先 capture 一个新来源 |

同一条 description 同时服务于目录浏览、Agent 发现和 review，不另写一份给 Agent 的版本。

## 操作

| 操作 | 输入 | 结果 |
|---|---|---|
| capture | 一个来源线索（URL、文件、引文、项目记录） | 稳定的 Source ID；能取得的材料存为 MaterialRevision，取不到的部分写明；重复的线索并入已有身份 |
| curate | Source 与目标单元，或已有 Binding | Binding 的题解、description、tag、启用、收藏、优先级的一次可追溯修订 |
| resolve | 任务类型或 brief、语言、文体、personal 配置 | 要读的单元与素材清单，附选用理由；不默认挂载全部 |
| consume | resolve 的结果与一次运行 | 运行记录写下实际用到的单元、Binding、材料及其版本；不复制原件 |
| refresh | Source | 新的 MaterialRevision、与上一版的差异，以及据此修订的题解；历史任务仍指向旧版本 |
| revise | KitUnit 或 Binding，加依据的范例 | 一次带依据与适用范围的修订；结构变化转 ADR |

每个操作配一个完整范例：输入语境、修改后的完整记录、取舍理由、完成条件。范例传达“怎样维护才合适”，schema 只检查字段、类型、引用和版本；校验通过不等于内容合格。第一个范例是 explore 中遇到一个设计参考：capture → curate 到一个 Design 单元 → 下一次任务 resolve 到它 → consume 记下版本 → 来源更新后 refresh。

## 现有数据怎样对上

Materials 的权威数据现在是 `vault/provenance/**/catalog.json` 里的来源记录：49 个 catalog（27 个 `cards: maintained`，22 个 `generated`），共 1119 条，字段名一百多种。下表只列各 catalog 共有或用于发现的字段；其余按 catalog 自有字段原样保留在 Source 的 `extensions`，不为统一表面强行映射。数据层切片之前不搬家。

| 现有字段 | 新对象 | 说明 |
|---|---|---|
| `id`、`slug`、`aliases`、`title`、`url`、`original_url`、`summary_zh`、`status`、`limits`、`revisit_trigger`、`history_record` | Source | 来源自有 ID 与 registry 的 `namespace:slug` 都保留，解析到同一个 Source |
| `supported_claims`（claim_id、locator、claim） | Source 的 `excerpts` | 第 4 级 |
| `grammar_paths`、`grammar_ids` | 每个路径或 ID 一条 Binding | 现在挂在来源上，迁移时拆开 |
| `reference_priority`、`reference_status` | Binding 的 `priority` 与 Source 的采纳状态 | 现在一个来源只有一个优先级；拆成 Binding 后各单元可以不同 |
| `purpose_tags`、`facets` | Binding 的 `tags`，Source 的 `facets` | 用途 tag 跟着用途走 |
| `snapshot_path`、`snapshot_sha256`、`snapshot_status`、`accessed_at`、`snapshot_gap` | MaterialRevision | 566 条记录有 `snapshot_path`，各生成一个版本；只有缺口的记在 Source 的 `materials_gap` |
| 来源卡正文 | Source 的概要与 Binding 的题解 | `cards: generated` 的卡由 catalog 生成，编辑写回 catalog；`cards: maintained` 的卡正文是权威，编辑写回卡片（[ADR-022](../docs/decisions/022-source-card-ownership.md)） |

`scripts/build_registry.py` 的扩展投影不带 `reference_priority`、`reference_status`、`grammar_ids`，所以 registry 只能用来列表和搜索，详情与编辑必须回到 catalog。Kit 里的参考路由页（[Design 参考路由](../kit/design/references/README.md)及其下各页、`curated/` 卡片）是今天手写的目录视图，数据层建好后改为由 Binding 生成。
