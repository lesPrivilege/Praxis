---
id: "e03-storybook-interaction-tests"
status: "verified"
url: "https://storybook.js.org/docs/writing-tests/interaction-testing"
---

# E03 · Storybook — Interaction tests

来源：[原始页面](https://storybook.js.org/docs/writing-tests/interaction-testing) · 状态：`verified` · 重访：2026-10-02（ok）

用途：GRAMMAR / METHOD / VERIFICATION

## 是什么

Storybook 交互测试文档，支持用 play 函数把状态轨迹写成可断言样例。

页面所见：Storybook（Chromatic）；未见版本号

## 台账要点与本轮重访

- 有依据：play、canvas、userEvent、expect、mock 初始条件。文档分别讲 play 函数、canvas 查询、userEvent、expect 与 fn() 及 mount 前置设置。
- 有依据：优先用角色与可访问标签查询。查询优先级从 ByRole、ByLabelText 到最后才用 ByTestId。
- 有依据：以结果断言验证状态轨迹。示例断言 DOM、可见性与函数调用等终态。

## 限制

交互断言不能评判 taste，也不等于真机行为；本轮未运行任何测试。 本轮只读文字，没有看图。

## 何时重访

据此设计样张比较方法或自动检查、工具版本更新、或要引用其效果主张时重访。

台账原文见 [包内 engineering 台账](../../../snapshots/local/design-grammar-atlas-20261002/research/engineering-sources.md)，机器登记见 [`../catalog.json`](../catalog.json)。
