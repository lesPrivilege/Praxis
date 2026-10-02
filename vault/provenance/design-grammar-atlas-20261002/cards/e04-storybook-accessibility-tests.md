---
id: "e04-storybook-accessibility-tests"
status: "partial"
url: "https://storybook.js.org/docs/writing-tests/accessibility-testing"
---

# E04 · Storybook — Accessibility tests

来源：[原始页面](https://storybook.js.org/docs/writing-tests/accessibility-testing) · 状态：`partial` · 重访：2026-10-02（ok）

用途：GRAMMAR / METHOD / VERIFICATION

## 是什么

Storybook 无障碍测试文档，支持自动检查不是完整合规证明、incomplete 要人工确认。

页面所见：Storybook；未见版本号

## 台账要点与本轮重访

- 有依据：基于 axe-core 的启发式检查。文档称 addon 基于 axe-core。
- 有依据：自动检查有盲区，incomplete 需人工确认。结果分 violations、passes、incomplete，incomplete 需手动确认；页面自述自动检测可发现至多约 57% 的 WCAG 问题，其余需人工。
- 有依据：规则配置与测试语境显式。可配置规则集、禁用规则、选择 WCAG 2.0/2.1/2.2/AAA 标准。
- 无法判断：自动捕获比例不适用于所有应用。这是台账的限定；页面给出一个具体比例，台账未记录该数字，引用时应保留页面原有的限定。

## 限制

自动通过不等于 WCAG 全面合规；页面含安装推广；本轮未安装 addon。 本轮只读文字，没有看图。

## 何时重访

据此设计样张比较方法或自动检查、工具版本更新、或要引用其效果主张时重访。

台账原文见 [包内 engineering 台账](../../../snapshots/local/design-grammar-atlas-20261002/research/engineering-sources.md)，机器登记见 [`../catalog.json`](../catalog.json)。
