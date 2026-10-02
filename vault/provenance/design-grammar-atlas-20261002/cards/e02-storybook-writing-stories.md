---
id: "e02-storybook-writing-stories"
status: "verified"
url: "https://storybook.js.org/docs/writing-stories"
---

# E02 · Storybook — How to write stories

来源：[原始页面](https://storybook.js.org/docs/writing-stories) · 状态：`verified` · 重访：2026-10-02（ok）

用途：GRAMMAR / METHOD / VERIFICATION

## 是什么

Storybook 官方 story 编写文档，支持多状态、显式输入与组合复用。

页面所见：Storybook（页面称由 Chromatic 维护）；文档版本 10.6

## 台账要点与本轮重访

- 有依据：同一组件可有多个状态 story。例子含 Primary、Secondary、Tertiary 等多个故事。
- 有依据：输入、上下文与渲染显式（args、render、decorators）。文档分别讲 args、带 context 参数的 render 函数与 decorators。
- 有依据：子样本数据能在组合中复用。有导入其他组件 args 并展开用于父组件 story 的写法。
- 有依据：多组件局限。文中提到复合场景下无法完全利用 args 机制。

## 限制

story 不是 grammar；CSF 不保证跨框架无损；文档版本会随更新变化。 本轮只读文字，没有看图。

## 何时重访

据此设计样张比较方法或自动检查、工具版本更新、或要引用其效果主张时重访。

台账原文见 [包内 engineering 台账](../../../snapshots/local/design-grammar-atlas-20261002/research/engineering-sources.md)，机器登记见 [`../catalog.json`](../catalog.json)。
