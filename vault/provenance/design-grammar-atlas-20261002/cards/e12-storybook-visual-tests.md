---
id: "e12-storybook-visual-tests"
status: "verified"
url: "https://storybook.js.org/docs/writing-tests/visual-testing"
---

# E12 · Storybook — Visual tests

来源：[原始页面](https://storybook.js.org/docs/writing-tests/visual-testing) · 状态：`verified` · 重访：2026-10-02（ok）

用途：GRAMMAR / METHOD / VERIFICATION

## 是什么

Storybook 视觉测试文档，支持基线、差异审阅与人工接受的工作流及其与标记快照的区别。

页面所见：Storybook（Chromatic）；未见版本号

## 台账要点与本轮重访

- 有依据：baseline、差异 review、人工接受。首次构建生成基线，之后对比；可在面板查看变化像素并在本地接受。
- 有依据：CI 中接受的基线会延续。页面称本地接受的基线在 CI 中自动接受。
- 有依据：视觉测试与 markup snapshot 不是同一证据。FAQ 明确区分比较渲染标记与比较渲染像素。
- 有依据：推荐同团队商业服务 Chromatic，云端抓取。页面称其为 Storybook 团队的云服务，故事被送往云端截图。
- 有依据：不采纳营销性的最有效比较。页面确有最高效测试方式之类的说法，台账不采纳的做法合理。

## 限制

无差异不等于没有 UX 问题；基线没有审美权威；不能据此授权上传私有数据。 本轮只读文字，没有看图。

## 何时重访

据此设计样张比较方法或自动检查、工具版本更新、或要引用其效果主张时重访。

台账原文见 [包内 engineering 台账](../../../snapshots/local/design-grammar-atlas-20261002/research/engineering-sources.md)，机器登记见 [`../catalog.json`](../catalog.json)。
