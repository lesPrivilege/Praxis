# Report / Briefing HTML grammar 候选

状态：`candidate`。来源为 `6ab64deb-7870-83ec-8e5c-0f78ccd7340b`，主要证据是 turn `bbb2195b-0728-4d12-a1ed-9cfecc42c78d` 与 assistant item `a0f8bc40-fbf7-4103-a3c7-a34d402e68a3`。

## 页面 anatomy

对话建议先固定页面从上到下的语义职责，而不是先做 theme：

```text
Document Header
  eyebrow / context → title → dek / thesis → metadata
Executive Lead
  conclusion / takeaway → 1–3 supporting facts → optional metric
Section
  heading → lead → narrative → one primary exhibit
  exhibit title → description → visual → annotation → caption → source
  narrative continuation → evidence / quote → implication
Notes / Method → Sources → Appendix
```

`Exhibit` 是一级语义。`title` 说命题，`description` 告诉读者正在看什么、范围是什么以及如何解释，`annotation` 指出关键读法，`caption` 解释必要口径，`source` 跟随被证明的对象。一个图表不应只剩一张图和页面末尾的来源堆。

## 内容元素 Registry

候选元素包括 Paragraph、Lead、Key point、List、Description list、Comparison、Stat、Chart、Diagram、Table、Screenshot、Quote、Evidence excerpt、Note、Warning、Source、Footnote 与 Method note。每个元素至少登记 semantic job、必需字段、允许变体、选择条件、边界和 failure modes；例如 Chart 需要 title、scope、encoding 与 source，Evidence excerpt 需要 claim、excerpt 与 provenance。

## 写作与排版原则

- Markdown 先对人类自足，只有 Markdown 无法自然表达的内容才增加薄的 semantic hint。
- 一段承载一个主要判断，结论尽量前置；标题描述内容并保持语义层级，不为字号跳级。
- 有顺序才编号，普通并列用 bullet；同级 item 保持句法平行；字段重复且可比时用 table 或 description list。
- Inline citation 支撑局部命题；Exhibit source 解释图表数据；Method / Note 解释口径；Document bibliography 供复核，不能替代前面三者。
- 使用相对层级和 measure 规则表达留白、宽度与阅读关系，具体像素、颜色和 token 由 Design 决定。
- 从 plain text 开始，只有内容关系在低成本表达不足时才升级到视觉 exhibit，防止过度可视化与 card soup。

## 当前裁决

初次消费后的页面 anatomy、展项职责、来源邻接和媒介投影由 [ADR-015](../../../docs/decisions/015-kit-editorial-contract.md) 收敛到 Reporting/Writing/Design 的治理路由；当时的历史入口仍可由 [`kit/reporting/grammar.md`](../../../kit/reporting/grammar.md) 回查。[ADR-016](../../../docs/decisions/016-progressive-kit-structure.md) 将它们落到当前分支：内容与空间投影进入 [Write / Publish](../../../kit/write/publish/README.md)，展项职责见 [Publish / Exhibits](../../../kit/write/publish/exhibits.md)，证据与跨媒介验收进入 [Write / Shared](../../../kit/write/shared/README.md)，视觉编码和交互投影按需进入 [Design / Composition](../../../kit/design/composition/README.md) 或 [Design / Interaction](../../../kit/design/interaction/README.md)。完整内容 Atom/Pattern/Composition 注册表、canonical specimen 与通用 renderer schema 尚未建立，不能从这份研究材料推断已有实现。
