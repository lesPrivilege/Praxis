# ADR-047：来源编目，本地材料转为产物 trace

日期：2026-10-27。状态：accepted（“本地材料是产物 trace”一节已由 [ADR-048](048-local-products-and-convergence.md) 取代：本地产物分交付、管线、范例三类，过程记录不登记）。用户要求每条来源都有 description，供渐进展开与 human review，并按分组的纲要体例收录来源索引，使其能被发现、消费和 review；随后裁定本地材料不与网络来源并列，只作 dogfooding 记录、task trace 与当初的消费记录，管理面走任务产出那一层；Writing 只有 personal 部分可以预先确定，不加其他本地项目依赖；Design 要搜罗广备，作为类书。分组轴、description 归属、本轮范围与读取入口由用户在选项中确认。主会话（Claude Opus 5.5）设计、实现、迁移并验证。

## 问题

- **description 只在挂载上。** 一个来源挂到几页就有几条说明，来源本身没有一处写明何时打开、取什么；没挂到页面的来源只有概要。
- **没有来源索引。** 来源只能从 Kit 单元页的挂载卡片或关键词搜索里找到，看不出一个区域收了哪些标准、实践、组件库和案例。
- **自有名册混着本地材料。** 在用的 106 条自有来源里，70 条是本地材料：Courtwork 的约定与截图 19 条、`vault/distilled` 24 条、`projects/` 9 条、`vault/snapshots/local` 9 条、`vault/provenance` 书目 7 条，以及 Schema Engineering 页面与本地 skill 各 1 条。它们与网页来源并列挂在 Kit 页上，Kit 因此依赖本地项目。

## 决定

### 名册只收网页来源

`praxis_capture` 必须给 http(s) URL，`praxis_source_update` 不再接受定位。本地文件、项目约定、蒸馏笔记不进名册。来源包里的条目照旧可以只有定位（ADR-043 已登记的生产管线在 vault 来源包里，不受影响；新的本地管线登记在项目自己的来源索引里，经 `praxis_register_index` 接入）。

### 编目：任何来源一条 CatalogEntry

数据根的 `catalog.json` 按来源 ID 记：
- 形态，固定九种：standard 标准规范、practice 成熟实践、component-library 组件库、case-library 案例库、case 单个案例、skill、tool 工具、article 文章、research 研究；
- Kit 分类（层或区域）；
- description：何时打开、取什么，240 字以内；
- 对 description 的 review，记 revision 与当时的来源版本。

自有来源与来源包里的条目都可编目（`praxis_file`），来源包从不被写入。capture 时形态与 description 必填。挂载没写 description 时沿用编目的；`praxis_review` 既可 review 挂载，也可 review 编目。Kit 分类从自有来源记录移进编目。

编目条目有自己的信号：review 结论待改，或来源变了、链接失效而它的挂载上看不到。upkeep 列出这些条目，以及编目放不下的自有来源（没有形态，或既无 Kit 分类也未挂到页面），替代原来的“新登记未挂载”：一条编了目、归了区域的来源不挂页面也是正常状态。

### 来源编目：层 → 区域 → 形态 → 来源

`praxis_catalog`（worker 工具）与控制面新的“来源”页读同一个纲目。来源按编目的 Kit 分类和所挂页面所在的区域归入，可以同时在几个区域。不给区域与关键词时只返回纲目与各形态的条数；给区域或关键词才返回条目：标题、description、URL、证据状态、所挂页面与信号。控制面里区域默认收起，点开列条目，点开条目即来源条目，在原处编目、review、编辑。

### 本地材料是产物 trace

产物分 `delivery` 与 `trace`。trace 是作为记录保留的本地材料，带 `informs`：它当初为哪些 Kit 页提供了依据、当时怎样用。trace 可以不在已登记项目里，不按项目布局检查，所以不出 `misplaced` 信号。`praxis_consume` 的产物项可写 `kind: trace` 与 `informs`。控制面产物页按全部、交付、trace 筛选，trace 详情列“当初依据了”，点开即到那一页。Kit 页与 resolve 只列网页来源。

### 迁移

- 70 条在用的本地来源中，63 条各自解析到一个文件（目录取其 README 或 index.html，行号范围、提交号与锚点写进说明），登记为 trace，共带 76 条 `informs`，取自它们原来的挂载与说明。
- 7 条 `vault/provenance` 书目不转 trace：它们列出的网页来源已经由 vault 来源包提供。
- 11 条已淘汰的本地来源随之离开名册。
- 合计 81 条记录与它们的挂载从 `sources.json`、`bindings.json` 删除，删除前的整条记录写进 `history.jsonl`。
- 其余 36 条网页来源全部编目：形态与来源级 description 逐条写，Kit 分类从原记录迁入。
- 原有 72 件产物标为 `delivery`。
- Kit 上的挂载 282 → 197。没有运行引用被移出的来源。

## 后果

- 本地材料不再随 resolve 进入任务素材；需要回看当初的依据时，从产物页的 trace 进入。
- emil-design-eng 是公开 skill 的本地安装，暂按 trace 处理；找到它的公开地址后应作为 skill 形态的网页来源登记。
- Design 的类书只开了头：本轮只编目了自有的 36 条。vault 来源包里约 300 条与设计相关的网页来源、上一轮召回清单里 Kit 还没有对应页的约 60 条（材质与半透明、注意力、agent 产品界面），以及新的搜罗，是下一步。
- 网页预览小卡片以后再定。
- `schemas/` 仍是早于名册的草案，只加了一条说明。
