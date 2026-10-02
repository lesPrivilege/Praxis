---
id: "e08-every-layout-sidebar"
status: "verified"
url: "https://every-layout.dev/layouts/sidebar/"
---

# E08 · Heydon Pickering & Andy Bell — The Sidebar

来源：[原始页面](https://every-layout.dev/layouts/sidebar/) · 状态：`verified` · 重访：2026-10-02（ok）

用途：GRAMMAR / METHOD / VERIFICATION

## 是什么

Every Layout 的 Sidebar 布局页，支持用内容与容器关系而非设备名单决定邻接与换行。

页面所见：Heydon Pickering & Andy Bell (Every Layout)；未见日期

## 台账要点与本轮重访

- 有依据：可用容器空间和内容需要比设备名单更能说明邻接与换行。问题陈述：基于视口的媒体查询在组件处于不同容器宽度时失效。
- 有依据：同一关系可用于媒体说明或输入与操作的排列。用例即媒体对象与输入加按钮。
- 有依据：gutter、intrinsic width、API。有 gap 控制间距、无 flex-basis 时宽度由内容决定，以及 side、sideWidth、contentMin、space、noStretch 参数表。
- 有依据：对 container queries 的历史性措辞。文中仅称所谓 container queries 或能让布局完全感知上下文，属历史性说法。

## 限制

文中数值不是唯一默认；container queries 措辞已过时，不能当现今支持结论。 本轮只读文字，没有看图。

## 何时重访

据此设计样张比较方法或自动检查、工具版本更新、或要引用其效果主张时重访。

台账原文见 [包内 engineering 台账](../../../snapshots/local/design-grammar-atlas-20261002/research/engineering-sources.md)，机器登记见 [`../catalog.json`](../catalog.json)。
