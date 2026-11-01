# ADR-049：架构收敛：Design 与 Writing 为核，名册与 stream 编目，工作流在下游

日期：2026-11-01。状态：accepted。用户在原 Chat（[登记](../../vault/intake/visual-design-grammar-20261101.json)）里提出收敛方向：提高设计与撰写的权重，reporting、驻场工作等作为 workflow 放到下游；收藏与自撰优先；目录用互著别裁、辨章 grammars、考镜源流的方式编排；体例要稳定、最小、易共识，LLM 给出的详细拓扑不算数。随后要求编定并完成收敛。主会话（Claude Opus 5.5）对照 ADR-045 至 ADR-048 的现状编定：用户的话按决定处理，助手的话按候选处理。

## 问题

- **架构总页落后于结构。** [架构](../architecture/README.md)第一句还写着 Enterprise、Reporting、Work System 三个消费域；ADR-037 起的表达 Kit、ADR-046 起的名册都不在这句话里。
- **自撰没有位置。** ADR-048 排除过程记录是对的，用户自己持续发展的主张却也没有去处：`vault/distilled` 放研究结论，`projects/` 放交付，名册只收网页。
- **指定一个方向不能直接消费。** `praxis_resolve` 只认任务类型与单元，用户说“按这条 stream 来”时 agent 要自己找。
- **原 Chat 的拓扑太重。** 四个并列维度、三层体例、三种知识形态、五项权重，多数已有对象能承担。

## 决定

### 定位

Praxis 积累设计与写作的判断和来源；工作流把它们带到具体场景。

| 位置 | 是什么 | 在哪 |
|---|---|---|
| 核 | Design、Writing：判断与方法，常驻 | `dsh-praxis/kit/design`、`dsh-praxis/kit/writing` |
| 编目 | 名册（收藏）与 stream（自撰） | `dsh-praxis/data` |
| 证据 | 原件、提炼、裁决与回执 | `vault`、`docs` |
| 下游 | 工作流：Task 类型、Publish 流水线、现场工作语义、场景模板、交付 | `dsh-praxis/kit/task`、`dsh-praxis/kit/publish`、`kit`、`templates`、`projects` |

下游（Flow）是一个位置，不是目录或新包。Reporting、驻场工作、视频都是工作流：可跨场景复用的表达方法回到核，依附场景的状态与交付留在下游。根 `kit/` 的内容不动，也不改名（ADR-045），定位从主干改为下游的现场工作语义。Goal 不改：它说的是工作从已消费的证据起步、增量提高下一次的起点，正好是编目到下游再回流。

### 体例不增加对象

用户的目录学用语都落在已有机制上，不另建层：

| 用语 | 机制 |
|---|---|
| 收藏 | Source 加 CatalogEntry；形态固定九种，skill 是其中一种，读用法、取脚本，不安装 |
| 互著 | 一个来源多条 Binding，一个来源可归入几个区域 |
| 别裁 | 片段用摘录；有限收敛的经典做法写成 Kit 单元，或登记为 example、pipeline |
| 辨章 grammars | Kit 的层、区域与单元 |
| 考镜源流 | 来源 → 挂载 → 单元 → 运行 → 产物，加 `derived_from`、`made_with` 与维护记录 |
| 新风格、配色、笔触 | 新来源，不新增形态、区域或对象 |
| 贴链接让 agent 取用 | 挂载的 description 与取用题解；agent 自行决定读到多深 |

### 新增一个对象：Stream

Stream 是一页自撰：一个持续探索的方向，写自己的主张、未决问题和取用的 Kit 单元。

- **一个文件。** 放在数据根的 `streams/<slug>.md`，属于用户，不进包；修订直接改文件，不走覆盖层。
- **一种挂载。** 来源挂到这一页，与挂到 Kit 页同一套，所以 stream 能统领任何来源，来源不归它独占。
- **一个参数。** `praxis_entry` 列出 stream，`praxis_resolve` 带 `stream` 时给出这一页、它写明取用的单元、挂在它上面的素材（排在最前），可与任务类型同用。

`状态`、权重之类不设字段：页面自己写。成熟的部分别裁进 Kit 单元或范例，这一页留着。Stream 的价值不依赖模型能力：模型能 one shot 之后，它仍是扫盲和陌生化的来源。第一条是 [视觉与运动语法](../../dsh-praxis/data/streams/visual-motion-grammar.md)。

### Index first

默认顺序写进 agent 的入口文字：要找外部参考，先查名册，名册不够或要核实时才上网；确有增量再写回。维护按差异走，已有 refresh 与 upkeep，不做全量重建。

### 不采纳

- Collections、Authored、Explore Streams、Sources 四个并列维度：收藏就是名册，自撰与探索是同一个 Stream。
- Canonical Pattern、Repertoire 作为对象：见上表。
- 重要程度、原创程度、成熟度、复用价值、活跃程度五项字段。
- `source_version`、`last_verified`、`refresh_policy`、`supersedes` 等 Index 元数据：`checks.jsonl`、review 的 `source_version` 与 `history.jsonl` 已覆盖。
- 六类视觉原语与陌生化维度作为规范：留在 stream 的候选里。

## 改动

- `dsh-praxis/core`：`Kit` 读 `streams/`，`entry` 与 `resolve` 支持 stream；工具说明与入口文字；一条测试。
- 文档：架构总页、根 README、`kit/README.md`、`AGENTS.md`、[Kit 使用约定](../../kit/Agent.md)、`dsh-praxis/README.md`、分层体例、对象与操作、入账规范。ADR-045 的“Praxis”一行由本文取代，状态处加注。
- 入账：原 Chat 与三张附图。回执：[架构收敛](../verification/architecture-convergence-20261101.md)。

## 后果

- 定位与体例到此收口：之后加新材料走收藏，加新主张走 stream，加新场景走 Task 类型或流水线，都不动这张表。只有知识对象或关系模型变了才另写 ADR。
- 控制面网页没有 stream 专页：stream 上的挂载出现在“Kit 之外”的目标里，页面文字直接读文件。真实使用证明不够时再加。
- 运行中的 DSH 与 MCP 要重载才带上 stream。
