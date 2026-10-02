# 样张核查证据

记录日期：2026-09-27。范围限于 `vault/distilled/layout-specimens-20260927/`；本页是只读审计记录。

## 索引数量与锚点

`specimens.json` 的 `specimens` 数组（从 [specimens.json:122](../../../vault/distilled/layout-specimens-20260927/specimens.json#L122) 开始）有 58 条一级记录：45 条 `atom`、8 条 `pattern`、5 条 `composition`。一级记录不是样张总数；每条的 `variants` 才是可筛选样张。

只读解析得到：

| 层级 | 一级记录 | variant | 状态计数 |
|---|---:|---:|---|
| atom | 45 | 244 | candidate 151 · stress 47 · failed 46 |
| pattern | 8 | 30 | candidate 21 · stress 2 · failed 7 |
| composition | 5 | 6 | candidate 6 |
| 合计 | 58 | 280 | candidate 178 · stress 49 · failed 53 |

索引一致性检查结果：

- 58 个一级 `id` 唯一，280 个 variant `id` 唯一。
- 58 个一级 `href`（文件加锚点）唯一；涉及 11 个 HTML 文件，全部存在。
- 58 个一级锚点在对应 HTML 中各出现一次；280 个 variant ID 也都在 12 个 HTML 文件中各出现一次。12 个文件包含入口 `index.html`、5 个 atom 页、1 个 pattern 页和 5 个 composition 页。
- variant 没有单独的 `href` 字段，这是索引片段约定（见 [shared/contract.md:88-111](../../../vault/distilled/layout-specimens-20260927/shared/contract.md#L88)）；它们通过父记录的文件和自身 ID 锚点回到 HTML。

有两处登记语义不一致，应在下一次生成索引时修复而不改历史样张：

1. `specimens.json:4` 自述为“主会话与五个并行子代理”，而 [README:5](../../../vault/distilled/layout-specimens-20260927/README.md#L5) 与 [handoff.md:5](../../../vault/distilled/layout-specimens-20260927/handoff.md#L5) 自述为十一个子代理。这是制作方 metadata 的范围冲突，不影响上述可数的文件和锚点。
2. `specimens.json:3690` 与 `specimens.json:5350` 仍保留“第14周日期待裁定”的旧 open question（写成 06-08 至 06-13）；当前 fixture、handoff 和页面已改为 06-02 至 06-06。它们应标成历史问题已解决或从 active open questions 移出。

## 检查报告到底证明什么

`checks/report-js.json` 和 `checks/report-nojs.json` 各有 24 条：12 个页面分别在 1440 和 375 两个真实 CDP viewport；两份报告的 `issues` 总数均为 0，且报告记录的 viewport 值确实是 1440/375 各 12 条。`checks/report-reduced-motion.json` 只有 C05 与 wayfinding 的 375 条目，2 条均为 0 issue。

探针源码在 [tools/cdp.mjs:27-46](../../../vault/distilled/layout-specimens-20260927/tools/cdp.mjs#L27) 与 [shared/lab.js:61-96](../../../vault/distilled/layout-specimens-20260927/shared/lab.js#L61) 中，`0 issue` 只表示：

- 页面 `scrollWidth` 没有超过 viewport 1px 以上；
- `.stage` 或 `[data-check-root]` 内可见元素没有越出其舞台边界；
- `overflow` 为 hidden/clip 或 `text-overflow: ellipsis` 的元素没有探针可见的内容裁切。

探针跳过 hidden、`sr-only` 和带 `data-allow-scroll` 的整棵子树，并合并重复 issue。当前有 10 个明确的允许区域：5 个入口矩阵滚动容器，以及 E03-e、V03-c、T01-f、W01-e、W08-f 五个故意失败样张。页面横向滚动仍由页面级检查单独判断。几何探针不判断可读性、层级、美观、SVG 内部文字大小或语义正确性；检查 README 也明确列出未检查的深色、打印、读屏、200% 缩放、完整键盘遍历、真实触屏和其他系统字体。

## fixture 的数值与日期核对

所有数值属于 [shared/fixtures.md:1-3](../../../vault/distilled/layout-specimens-20260927/shared/fixtures.md#L1) 声明的 synthetic 材料。周序列 26 个值（[fixtures.md:23-27](../../../vault/distilled/layout-specimens-20260927/shared/fixtures.md#L23)）相加恰为 12,480，平均为 480/周；这部分合计可复算。

### 东坡均值与“周二低需求”

fixture 给出东坡合计 4,570 人次和周二夜均 38（[fixtures.md:13](../../../vault/distilled/layout-specimens-20260927/shared/fixtures.md#L13)、[fixtures.md:20](../../../vault/distilled/layout-specimens-20260927/shared/fixtures.md#L20)）。页面组合按 130 个计划夜减第14周停开5晚、再减第26周少开1晚，使用 124 个开放夜（[c03-operating-review.html:316-323](../../../vault/distilled/layout-specimens-20260927/compositions/c03-operating-review.html#L316)）。在这个页面假设下：

```text
4,570 ÷ 124 = 36.8548… ≈ 37 人次/开放晚
```

38 高于 36.85，不能支持“低需求集中在周二”；它至多支持“周二也低于 60 的参考线”。即使第26周少开4晚不归给东坡，按东坡 125 个开放夜计算，平均也只有 36.56，结论方向不变。关键限制是：fixture 只写“第26周只开放4晚”，没有明说是哪一个分馆；[specimens.json:3691](../../../vault/distilled/layout-specimens-20260927/specimens.json#L3691) 已把“两馆 × 4 晚”标成待确认推断，不能把 124 夜当作独立观测事实。

### ¥171、¥164 与 ¥163 的分母

fixture 的夜间计划安排是每馆 26 周 × 5 晚 × 3 小时；东坡每小时成本 ¥2,000，到馆 4,570（[fixtures.md:11-16](../../../vault/distilled/layout-specimens-20260927/shared/fixtures.md#L11)）。因此：

| 口径 | 东坡馆·小时 | 公式 | 结果 |
|---|---:|---|---:|
| A：计划时段 | 390 | `2,000 × (26×5×3) ÷ 4,570` | ¥170.678… → **¥171** |
| A'：只扣第14周 5 晚 | 375 | `2,000 × ((26×5−5)×3) ÷ 4,570` | ¥164.114… → **¥164** |
| B：再扣第26周少1晚 | 372 | `2,000 × ((26×5−5−1)×3) ÷ 4,570` | ¥162.801… → **¥163** |

所以 ¥164 不是与 ¥171 并列的独立测量值，而是只扣第14周停开的派生口径；若接受页面把第26周少开的一晚也归给东坡，B 应约 ¥163。页面的逐步算式在 [c03-operating-review.html:285-298](../../../vault/distilled/layout-specimens-20260927/compositions/c03-operating-review.html#L285) 中给出 372 小时和约 ¥163；而 [fixtures.md:16](../../../vault/distilled/layout-specimens-20260927/shared/fixtures.md#L16) 与 [handoff.md:64](../../../vault/distilled/layout-specimens-20260927/handoff.md#L64) 仍写 ¥164。两处不能同时作为同一“实际开放”口径。

组合页还明确采用了“河湾 129 晚、东坡 124 晚”的解释，计算为 387 与 372 馆·小时，总成本 ¥1,409,640，除以两馆 12,480 人次为 ¥112.951… → ¥113（[c03-operating-review.html:294-298](../../../vault/distilled/layout-specimens-20260927/compositions/c03-operating-review.html#L294)）。这依赖第26周少开一晚适用于两馆；fixture 原文没有把这个适用范围写清。

### 第14周日期

2026-03-02 是第1周的周一；第14周周一是 2026-06-01，计划营业日为周二至周六，所以停开窗口是 **2026-06-02 至 2026-06-06**。当前 fixture 已这样写（[fixtures.md:27](../../../vault/distilled/layout-specimens-20260927/shared/fixtures.md#L27)），C03 的局部表和事件表也这样写（[c03-operating-review.html:339-348](../../../vault/distilled/layout-specimens-20260927/compositions/c03-operating-review.html#L339)、[c03-operating-review.html:381-385](../../../vault/distilled/layout-specimens-20260927/compositions/c03-operating-review.html#L381)）。JSON 中残留的旧 open question 仍需清理，但当前日期本身已能由起始日和周序列复算。

## 组合耦合的源码证据

交接中列出的组合问题不是只由描述推测，源码能支持以下几类边界：

- **槽位容器**：制作约定要求 `.stage` 成为名为 `stage` 的 inline-size container（[shared/contract.md:58-60](../../../vault/distilled/layout-specimens-20260927/shared/contract.md#L58)）。C01、C02、C03、C04 和 pattern 适配器分别在槽位重声明 `container: stage`（例如 [c03.css:5-8](../../../vault/distilled/layout-specimens-20260927/compositions/c03.css#L5)、[c04.css:5-8](../../../vault/distilled/layout-specimens-20260927/compositions/c04.css#L5)、[patterns.css:12-17](../../../vault/distilled/layout-specimens-20260927/patterns/patterns.css#L12)），说明原子确实依赖最近的容器，而不是全页宽度。
- **边注与私有网格**：文本的主栏/边注使用 15em（[text.css:14-16](../../../vault/distilled/layout-specimens-20260927/atoms/text.css#L14)）；wayfinding 的旁注使用 15rem、12rem、16rem（[wayfinding.css:121-138](../../../vault/distilled/layout-specimens-20260927/atoms/wayfinding.css#L121)、[wayfinding.css:240-242](../../../vault/distilled/layout-specimens-20260927/atoms/wayfinding.css#L240)）；数量行另有 14rem 固定轴（[quantity.css:219-222](../../../vault/distilled/layout-specimens-20260927/atoms/quantity.css#L219)）。这支持“原子各自带边注槽位，组合时可能争用”的风险描述。
- **外壳与 token**：枚举和定位原子直接携带暖纸背景/暖色文字（[enum.css:22-24](../../../vault/distilled/layout-specimens-20260927/atoms/enum.css#L22)、[wayfinding.css:184-190](../../../vault/distilled/layout-specimens-20260927/atoms/wayfinding.css#L184)）；C02 需要把 `--signal` 收回墨色以维持单一强调色（[c02.css:5-8](../../../vault/distilled/layout-specimens-20260927/compositions/c02.css#L5)）。这证明外壳和语义 token 目前存在组合层覆盖关系。
- **值状态**：枚举 CSS 只定义 `zero / miss / na` 三类（[enum.css:16-20](../../../vault/distilled/layout-specimens-20260927/atoms/enum.css#L16)）；C03 另写 `.c3-halt` 并在页脚把“停开”列为组合层状态（[c03.css:88-90](../../../vault/distilled/layout-specimens-20260927/compositions/c03.css#L88)、[c03-operating-review.html:170](../../../vault/distilled/layout-specimens-20260927/compositions/c03-operating-review.html#L170)）。这支持“需要拆开运营状态、观测值和适用性”的裁决方向，但不足以直接晋升通用第四数值态。

这些源码证据只说明当前实验的耦合和失败边界；它们不能证明某种 CSS 结构已经跨 fixture、跨媒介或跨系统可复用。

## 不可泛化的边界

- 12 页几何报告全为 0 issue，不等于视觉、无障碍、打印、深色主题、缩放、字体退化或真实触屏通过。
- fixture 的机构、数字、日志和问卷均为 synthetic；页面中的“测量”“观察”“自报”标签是实验内的证据身份示例，不是现实来源核验。
- C05 的 9 帧与宽屏 16:9/窄屏自然高度由 [c05.css:46-110](../../../vault/distilled/layout-specimens-20260927/compositions/c05.css#L46) 实现，但阈值是 `c5deck` 容器 1000px；不能直接当作通用投影 renderer 或视口断点。
- T05-c、E06-b、Q06-d、W03-b 等语义候选仍需 main 依据实际截图和跨 fixture 复核；本页不重复视觉检查，也不替 main 做采纳裁决。
