---
id: "e06-dtcg-resolver-2025-10"
status: "verified"
url: "https://www.designtokens.org/tr/2025.10/resolver/"
---

# E06 · DTCG — Design Tokens Resolver Module 2025.10

来源：[原始页面](https://www.designtokens.org/tr/2025.10/resolver/) · 状态：`verified` · 重访：2026-10-02（redirected）

用途：GRAMMAR / METHOD / VERIFICATION

## 是什么

DTCG 2025.10 的多上下文解析规范，支持显式次序与正交以抑制组合爆炸。

页面所见：Design Tokens Community Group；Final Community Group Report, 2025-10-28

## 台账要点与本轮重访

- 有依据：主题、尺寸、辅助模式等上下文可独立描述。以 modifier 产生不同 permutation，处理多主题、设备与可访问性模式。
- 有依据：覆盖顺序需显式。resolutionOrder 数组决定叠加次序，后项覆盖前项。
- 有依据：尽量正交以减小组合负担。文中以正交性为理想，减少用户错误与认知负担，并明确关注组合爆炸。
- 有依据：不是 W3C Standard。页面为 Community Group Final Report，称稳定但非 W3C 标准。

与台账不符或需注意：URL 仅大小写规范化：/TR/ 落地为 /tr/，无实质差别。

## 限制

不是 W3C Standard；不能证明 profile 等于 resolver context，也不说明穷举排列是好的视觉研究策略。 本轮只读文字，没有看图。

## 何时重访

据此设计样张比较方法或自动检查、工具版本更新、或要引用其效果主张时重访。

台账原文见 [包内 engineering 台账](../../../snapshots/local/design-grammar-atlas-20261002/research/engineering-sources.md)，机器登记见 [`../catalog.json`](../catalog.json)。
