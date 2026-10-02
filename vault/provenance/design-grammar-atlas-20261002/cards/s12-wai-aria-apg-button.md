---
id: "s12-wai-aria-apg-button"
status: "partial"
url: "https://www.w3.org/WAI/ARIA/apg/patterns/button/"
---

# S12 · WAI-ARIA APG：Button Pattern

来源：[原始页面](https://www.w3.org/WAI/ARIA/apg/patterns/button/) · 状态：`partial` · 重访：2026-10-02（ok）

用途：GRAMMAR / STANDARD / DESIGN-SYSTEM

## 是什么

APG 的按钮模式页，支持按钮键盘行为、焦点处理、toggle 与禁用状态的写法。

页面所见：W3C WAI (ARIA Authoring Practices Guide)；版权年 2026，无修订日期

## 台账要点与本轮重访

- 有依据：按钮与链接行为区分。页面强调按钮与链接的作用不同，不建议给链接样式元素加 role=button。
- 有依据：Enter/Space。聚焦时 Space 与 Enter 均可激活。
- 有依据：动作后的焦点。打开对话框焦点移入，关闭回到触发按钮（有例外），不关闭的动作焦点保持。
- 有依据：toggle 的 aria-pressed 与标签策略。页面强调切换按钮的标签在状态变化时不应改变。
- 有依据：不可用状态。按钮动作不可用时使用 aria-disabled=true。
- 无法判断：APG 是作者实践模式，不能代替 WCAG/ARIA 或辅助技术测试。该说法出自台账；本次抓取未在页面正文见到相应免责声明，APG 本身的定位需另查。
- 无法判断：不支持 selected 与 pressed 混为一谈。本页未见 aria-selected 的讨论。

## 限制

不代替 WCAG 或辅助技术实测；本次只经 WebFetch 摘要。 本轮只读文字，没有看图。

## 何时重访

项目明确采用该标准或设计系统的某一条、其版本或级别更新、或据此写检查项时重访原文。

台账原文见 [包内 standards 台账](../../../snapshots/local/design-grammar-atlas-20261002/research/standards-sources.md)，机器登记见 [`../catalog.json`](../catalog.json)。
