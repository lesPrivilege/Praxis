# 样张制作约定

本页是本实验内部的制作约定，保证不同家族的样张可以并排比较、被组合页复用、被索引召回。它不是 Praxis 的设计规范，也不规定正式交付的主题。

## 原子如何划界

原子以“帮助读者完成的一次判断”为单位：读者读完它，能确认一个命题、比较一组对象、理解一个数量、回查一条证据或找到自己的位置。图标、分隔线、圆角、阴影、徽标是手段，不单独登记。

判断原子边界的三个问题：

1. 拿掉它，读者会失去哪一个判断？说不出来就不是原子。
2. 它的必需输入是什么？“指标 + 单位 + 时间范围 + 基准”缺一项就无法判断，那它们属于同一个原子。
3. 它能否不依赖相邻内容被放进别的组合？能，才适合做原子；否则是组合性质。

## 变化维度（统一词表）

每个变体在 `data-axes` 与索引中标注以下五轴中适用的值；不适用可省略。

| 轴 | 值 |
|---|---|
| relation 输入关系 | single · multi · sequence · parallel · pro-con · claim-evidence · whole-part · before-after · certain-uncertain |
| spatial 空间组织 | inline · stack · juxtapose · main-margin · span · offset · embed · distant |
| path 阅读路径 | linear · scan · compare · drill · adjacent · revisit |
| load 内容负载 | short · long · sparse · dense · missing · zero · many-sources · exception · long-title · long-number · mixed-script |
| expression 表现强度 | baseline · editorial · graphic · spatial |

四种表现强度：

- **baseline**：安静、可迁移。无衬线正文、墨色、细线、至多一个强调色；层级靠字号、字重、位置。
- **editorial**：编辑化。衬线展示字、强烈字号对比、悬挂元素、留白与不对称，可用暖纸色。
- **graphic**：图形化。粗线、色块、大号数字、图示化结构，让关系本身成为画面。
- **spatial**：空间化。错位栅格、边注、跨栏、远距连接、层叠，让位置承担语义。

只换颜色或字体不算新变体；新变体必须改变结构、空间关系、阅读路径或编码之一。

## 页面与标记

```html
<section class="atom" id="T03">
  <header class="atom-head">
    <p class="atom-id">T03 · atom · 文本与命题</p>
    <h2>要点 · Key point</h2>
    <p class="atom-job">读者要确认的一个判断……</p>
    <details class="atom-meta"><summary>输入、适用与失败</summary>
      <dl><dt>输入</dt><dd>…</dd><dt>适用</dt><dd>…</dd><dt>不适合</dt><dd>…</dd><dt>容量</dt><dd>…</dd><dt>已见失败</dt><dd>…</dd></dl>
    </details>
  </header>
  <div class="variants">
    <article class="spec" id="T03-a" data-axes="spatial:stack expression:baseline load:short">
      <p class="spec-label"><span class="spec-id"><a href="#T03-a">T03-a</a></span> 行首标记 <span class="tag tag--base">baseline</span> <span class="axes">stack · linear</span></p>
      <div class="stage"> …specimen… </div>
      <p class="spec-note">为什么这样编排、何时成立、看到的问题。</p>
    </article>
  </div>
</section>
```

- 标签：`tag--base`、`tag--expr`（editorial/graphic/spatial）、`tag--stress`（压力样张）、`tag--fail`（保留的失败样张，note 必须写失败原因）。
- `.stage` 是样张自己的世界，外框由 chrome 提供。它是名为 `stage` 的 inline-size container；样张内部响应式用 `@container stage (min-width: …)`，窄屏优先。
- 需要整块铺底色的表现性样张用 `<div class="stage stage--bleed">` 并在内部自己留边。
- 模拟文件、截图或界面时在样张内放 `<span class="syn">synthetic</span>`。

## CSS 命名与隔离

- 每个家族一份 CSS：`atoms/<family>.css`。所有选择器以家族前缀类开头：文本 `t-`，枚举比较 `e-`，数量关系 `q-`，证据解释 `v-`，定位辅助 `w-`。元素选择器只能出现在前缀类之后。
- 原子基类用 slug，如 `.t-kp`；变体用修饰类，如 `.t-kp--rule`。组合页会同时加载多个家族 CSS 并复用这些类，所以变体的外观应由修饰类决定，不依赖 `#T03-a` 这类 ID。
- 使用 `shared/lab.css` 的 token（`--ink`、`--accent`、`--warm-paper`、`--serif` 等）；表现性样张可在自己的修饰类上定义局部变量。数字用 `font-variant-numeric: tabular-nums`。
- 不修改 `shared/` 下的文件。

## 内容与编码

- 内容取自 [fixtures](fixtures.md)。同一原子的所有变体用同一组内容；压力变体使用 S1–S7。所有内容都是 synthetic，不写成真实观察。
- 数量带单位、分母或时间范围；缺失与零分开；颜色不单独承载必要区别（配合文字、形状、线型或位置）。
- 图表用内联 SVG，带 `viewBox`、`role="img"` 与 `aria-label`，关键数值同时以 HTML 文本可读；正文不做成图片文字。窄容器里放不下的图，用 container query 切换为可重排的 HTML 结构，而不是横向滚动。确需横向滚动的宽表，外层加 `data-allow-scroll` 并在 note 说明。
- 交互只在必要时使用：优先原生 `<details>`、锚点、`:target`；如写 JS，放在家族 HTML 末尾，保证无 JS 时内容完整可读，控件可键盘操作并有可见焦点。动效尊重 `prefers-reduced-motion`。
- 不使用远端字体、脚本或图片。

## 每个原子的最低覆盖

1. 一个 baseline 变体。
2. 至少两个在结构、空间或阅读路径上真正不同的变体，其中至少一个是 editorial / graphic / spatial。
3. 至少一个压力变体，真的放入长标题、长数值、缺失、零、多来源、例外或高密度内容。
4. 有意义时保留一个失败样张（例如只靠颜色、等权卡片切碎推理、截断标题），写明为什么失败。
5. 记录不能成立或无意义的轴组合，写进索引的 `invalid`。

## 索引片段

每个原子一条：

```json
{
  "id": "T03", "level": "atom", "family": "text",
  "name": "要点", "name_en": "Key point",
  "job": "读者完成的判断",
  "input_shape": "必需与可选字段",
  "fixture": "F0 中的哪一项；压力 S?",
  "use_when": "…", "avoid_when": "…", "capacity": "…",
  "failure_modes": ["…"],
  "href": "atoms/text.html#T03",
  "variants": [
    {"id": "T03-a", "name": "行首标记", "axes": {"spatial": "stack", "expression": "baseline", "load": "short"},
     "status": "candidate", "note": "一句话：结构差异与成立条件"}
  ],
  "invalid": [{"combo": "expression:graphic + load:long", "reason": "…"}],
  "related": ["T07"],
  "lineage": {"origin": "original-this-run", "borrowed": [{"ref": "C05", "path": "kit/design/references/composition.md", "scope": "直接标值", "change": "…"}]},
  "open_questions": ["留给筛选者的问题"]
}
```

变体 `status` 取 `candidate`（值得进入筛选）、`stress`（压力探针）、`failed`（失败样张）。整体状态和检查范围由主代理在检查后填写，不在片段里自称通过。
