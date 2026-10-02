---
id: "s05-w3c-inline-bidi-markup"
status: "verified"
url: "https://www.w3.org/International/articles/inline-bidi-markup/"
---

# S05 · W3C Inline markup and bidirectional text in HTML

来源：[原始页面](https://www.w3.org/International/articles/inline-bidi-markup/) · 状态：`verified` · 重访：2026-10-02（ok）

用途：GRAMMAR / STANDARD / DESIGN-SYSTEM

## 是什么

W3C 国际化团队关于行内双向文本标记的指导，支持台账所列 dir、bdi、隔离要点。

页面所见：W3C Internationalization；未见日期

## 台账要点与本轮重访

- 有依据：已知反向片段使用 dir。文章建议用标记紧包每个反向短语，并说明嵌套短语写法。
- 有依据：未知片段 dir=auto / bdi。文中涵盖 dir=auto 与 bdi 用于未知方向文本。
- 有依据：数字、标点与方向片段的污染风险。讨论中性字符与数字在相反方向文本旁错位。
- 有依据：不覆盖块级 RTL、图标镜像、阿拉伯字体整形、图表轴。文章明确把块级结构标记留给配套文章，其余话题未出现。
- 有依据：历史浏览器描述不当作当前兼容性。文中确有对遗留浏览器的 rlm/lrm 补丁与 webkit、Gecko 差异说明。

## 限制

不覆盖块级 RTL、图标镜像、字体整形、图表轴；文中浏览器行为描述可能过时。 本轮只读文字，没有看图。

## 何时重访

项目明确采用该标准或设计系统的某一条、其版本或级别更新、或据此写检查项时重访原文。

台账原文见 [包内 standards 台账](../../../snapshots/local/design-grammar-atlas-20261002/research/standards-sources.md)，机器登记见 [`../catalog.json`](../catalog.json)。
