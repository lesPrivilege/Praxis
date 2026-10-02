# 写作结构补充语义 · 2026-09-27

状态：`supplemental-candidate`。本目录消费 5 个在 2026-09-27 实际打开并阅读的 Google Developers / Microsoft Learn 官方页面，补充 `Design Grammar` Chat 中 7 个 `missing-original` 占位的有限语义。它们是新找到的外部来源，不恢复原 Chat 的 URL、标题、原话或附件；原占位仍按 [`vault/intake/design-grammar-20260927.json`](../../intake/design-grammar-20260927.json) 的状态处理。

来源身份、逐 URL 行定位、访问状态、快照缺口和重访触发见 [`vault/provenance/writing-structure-20260927/catalog.json`](../../provenance/writing-structure-20260927/catalog.json) 及其 [来源卡](../../provenance/writing-structure-20260927/cards/README.md)。本文件只提供可消费的候选语义，不是 Kit 规范、ADR 或 HTML 通过结论。

## 是什么

这 5 个页面的共同交集是：把技术文档当作可扫描、可导航的语义结构，而不是只调整视觉样式。

- **Heading 是导航结构。** Google 建议使用描述性、sentence case 标题；任务内容和概念内容可采用不同标题句式；每页保留一个唯一 h1，使用 h1/h2/h3 等层级表达结构，不跳级、不留空 heading。标题先说明读者要完成的任务或要理解的概念，再考虑视觉样式。
- **List 由内容关系决定。** 有顺序的步骤、阶段或优先级使用 numbered list；无顺序的集合使用 bulleted list；术语及定义使用 description list。列表应有完整引导句或明确上下文，同一列表保持平行句法；多段列表项使用段落元素，不用硬换行伪造段落。
- **Table 只承载二维关系。** Google 的选择启发式是：每项有三个或更多相关属性时更适合 table；单项、成对数据、单列或长的一维集合通常用 list/description list。表格前说明目的，使用清楚简短的列标题；HTML 交付可用 `caption`、`th` 和适当的 `scope` 保留语义，不用 table 做页面布局、代码排版或编号步骤中的布局。
- **Paragraph 围绕一个想法。** Google 建议用尽可能少的词和句子表达单一想法，将关键事实放在段落开头，避免墙状长段和句内硬换行。五六句以上只是需要检查的信号，不是硬上限；单句段落或围绕一个想法的较长段仍可能合理。
- **扫描性需要重复模式。** Microsoft 将 heading、list、table、paragraph 视为离散组件，建议短 heading、短句和短段，重要关键词靠近 heading、table entry 和 paragraph 开头；长文应提供分节、目录或回到顶部等内部导航，相似内容采用一致和平行的句式。其页面还给出三到七行作为短段的经验范围，但明确允许偶尔出现单行段落。

以上是来源交集的泛化转译，不代表 Google 或 Microsoft 对 Praxis 的背书，也不自动改变现有 `kit/` 内容。

## 取用

在编辑 `README`、Kit 入口、Design Grammar、Report/Briefing HTML 或 specimen registry 时，按以下顺序消费：

1. 先识别内容原子要表达的关系：任务/概念、顺序/集合/术语定义、二维属性、单一想法。
2. 选择对应的语义结构，再写可扫描的文字：heading 说明任务或概念，list/table 由数据形状决定，paragraph 先说决定性事实。
3. 若产物是 HTML，再检查语义元素和可访问关系：heading 层级、`ol`/`ul`/`dl`、`p`、`caption`、`th`、`scope`；不要用视觉样式或硬换行替代结构。
4. 若文档较长，补充下一段或内部导航线索，让读者知道当前页面、下一步和回到上层的位置。
5. 把这些页面当作候选检查表，回到目标语言、artifact family、renderer 和项目规则做裁决；采纳为长期规范前，留下实际消费者或 specimen 的验证证据。

这组来源尤其适合在“内容语义已经确定，但 HTML/Markdown 表达仍混用 heading、list、table、paragraph”时回查。它们不替代 `Design` Kit 的视觉判断、`Write` Kit 的项目规则或具体场景的验收契约。

## 来源之间的差异

Google 和 Microsoft 都支持“先表达要点、拆成可扫描组件、保持平行结构”的方向，但具体数字、标点和实现建议不能直接合并成硬规则。

- Google 的 `table` 页面以“三个或更多相关属性”区分 table 与 list；这是选择启发式。Microsoft 的页面只强调清楚结构、短列和可扫描性，不提供同一个阈值。
- Google 对 numbered/bulleted/description list 及 HTML `ol`/`ul`/`dl` 有细分；Microsoft 的 term list 页面并未纳入本批 5 个来源，因此本文件不把其 bullet/bold 细节写成已核验语义。
- Microsoft 的“三到七行”依赖字体、宽度、设备和语言；Google 的段落页面强调单一想法和关键事实前置，并允许长于六句的单一主题段落。两者只能作为走读提示，不能作为固定行数或句数 lint。
- Google 的 sentence case、bare infinitive、末尾标点和 description list 标点是英文编辑语境；中文写作、产品 UI 文案及本地化要另行裁决。原 Chat 中中文技术写作指南、GB/T 15834、GB/T 15835 与 SI / GB 3100 仍未核实。

## 限制

- 5 个 URL 都是 supplemental；没有一个 URL 被写入 `Design Grammar` 的原始 placeholder mapping，不能声称恢复原 Chat 引用。
- 本批未保存网页 HTML、图片或 renderer 依赖；离线可消费的是本文件、来源卡和 catalog 中的摘要与行定位。网页更新后应重新读取，不把本文件当作永久原件。
- Microsoft `Scannable content` 页面在正文前显示“access requires authorization”提示。本批只使用实际可见的第 31–75 行，未推断受限部分。
- 外部指南只证明这些页面公开表达了相应编辑建议；没有证明 Praxis 当前 README、Kit、report HTML 或 specimen 已满足建议，也没有消费者点击、搜索、任务完成或屏幕阅读器运行数据。
- 本批不研究标准全文、中文标点、数字、单位、版式 token、renderer 实现或自动 lint；这些边界仍待另行任务和 Astra 裁决。

## 何时重访

出现以下任一情况时回查 catalog 的原始 URL和来源卡：

- Astra 要把 heading/list/table/paragraph 候选语义写入 Kit、ADR 或正式文档结构契约。
- 新增 README、Report/Briefing HTML 或 specimen registry 让一个页面同时承载多种内容关系，读者无法扫描或导航。
- 需要在 list、description list 和 table 之间做边界判断，或表格进入响应式布局、编号步骤或辅助技术验收。
- 目标语言、字体、renderer、移动端宽度或本地化流程发生变化，尤其是需要把英文编辑建议转成中文机械规则时。
- Google 或 Microsoft 页面更新、授权状态变化，或出现与现有规则冲突的真实消费反馈。
- 需要补核 Chat 占位 `index=3`–`6` 的中文指南、GB/T 或 SI 版本；本目录不应被当成这些缺口的替代来源。

## 来源

- [`google-headings-titles`](../../provenance/writing-structure-20260927/cards/google-headings-titles.md) · [Google Headings and titles](https://developers.google.com/style/headings) · 标题语义、层级和 h1。
- [`google-lists`](../../provenance/writing-structure-20260927/cards/google-lists.md) · [Google Lists](https://developers.google.com/style/lists) · 列表类型、引导句、平行结构和多段列表项。
- [`google-tables`](../../provenance/writing-structure-20260927/cards/google-tables.md) · [Google Tables](https://developers.google.com/style/tables) · 二维数据边界、表格语义和可访问结构。
- [`google-paragraph-structure`](../../provenance/writing-structure-20260927/cards/google-paragraph-structure.md) · [Google Paragraph structure](https://developers.google.com/style/paragraph-structure) · 单一想法、要点前置和硬换行边界。
- [`microsoft-scannable-content`](../../provenance/writing-structure-20260927/cards/microsoft-scannable-content.md) · [Microsoft Scannable content](https://learn.microsoft.com/en-us/style-guide/scannable-content/) · 扫描性、内部导航、平行结构和短段经验。

以上 5 个 URL 均在 2026-09-27 实际打开并读取；每个来源的逐行定位、状态和限制见 catalog。它们只是补充证据，不是原 Chat 引用的恢复。
