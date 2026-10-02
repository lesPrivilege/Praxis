---
id: "s02-w3c-css-color-adjust"
status: "partial"
url: "https://www.w3.org/TR/css-color-adjust/"
---

# S02 · W3C CSS Color Adjustment Level 1

来源：[原始页面](https://www.w3.org/TR/css-color-adjust/) · 状态：`partial` · 重访：2026-10-02（ok）

用途：GRAMMAR / STANDARD / DESIGN-SYSTEM

## 是什么

CSS 颜色调整模块的候选推荐快照，足以说明强制颜色模式的行为和作者应负的责任。

页面所见：W3C (CSS WG)；Candidate Recommendation Snapshot, 16 December 2025

## 台账要点与本轮重访

- 有依据：2025-12-16 CR Snapshot，非 Recommendation。页头状态与日期一致。
- 有依据：forced-colors 将颜色重映射到用户调色板。forced-color-adjust 为 auto 时元素颜色被强制调整。
- 有依据：移除 box/text shadow，改变非 URL 背景图。强制颜色下 box-shadow 与 text-shadow 计算为 none；background-image 除含 url() 的值外计算为 none。
- 有依据：系统颜色与局部 override 边界。有系统色映射表；forced-color-adjust 有 auto、none、preserve-parent-color。
- 有依据：不支持为品牌还原而全局关闭用户颜色。规范只在作者自己负责调整以满足用户颜色与对比需求时才建议用 none。
- 部分：不规定印刷成品色差。规范确有 print-color-adjust（economy 与 exact 两种），涉及打印色处理，但不涉及成品色差；台账表述成立，宜补一句 print-color-adjust 存在。
- 无法判断：不保证所有浏览器一致。属台账对外部实现状况的判断，页面不适合证明。

## 限制

不能证明浏览器实际实现一致；不是印刷色管理依据。 本轮只读文字，没有看图。

## 何时重访

项目明确采用该标准或设计系统的某一条、其版本或级别更新、或据此写检查项时重访原文。

台账原文见 [包内 standards 台账](../../../snapshots/local/design-grammar-atlas-20261002/research/standards-sources.md)，机器登记见 [`../catalog.json`](../catalog.json)。
