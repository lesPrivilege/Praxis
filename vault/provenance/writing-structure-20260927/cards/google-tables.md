---
id: "google-tables"
status: "verified"
url: "https://developers.google.com/style/tables"
---

# Tables — Google developer documentation style guide

来源：[原始页面](https://developers.google.com/style/tables) · 状态：`verified` · 访问：2026-09-27

用途：GRAMMAR / WRITING / TABLE / HTML / ACCESSIBILITY / RESPONSIVE

## 是什么

Google 将 table 保留给每项有三个或更多相关属性的二维数据；单项、成对数据、单列或长的一维集合通常应使用 list/description list。表格前用完整句子说明用途，复杂或相邻多表可用 caption，列标题应简洁并使用 `th` 与适当 `scope`。证据见页面第 50–57、62–74、86–100、111–124 行。

## 取用

设计 registry/specimen 或 report HTML 时，先按数据关系选择 table 或 list，再检查表格是否有可理解的介绍句、明确列标题和语义 header。表格不要承担页面布局、代码排版或编号流程中的布局；响应式行为要单独检查。

## 限制

这是 Google 文档页面的 HTML/编辑建议，不是 Praxis 渲染器或屏幕阅读器的运行验收。三属性只是选择启发式而非硬阈值；中文列宽、复杂关系、响应式布局和真实可访问性需要按具体 artifact 验证。

## 何时重访

遇到 list/table 边界、表格需要响应式或辅助技术支持、表格进入编号流程、Google 更新 table accessibility、caption 或 responsive guidance 时重读原页面。

来源身份、支持主张与 catalog 级边界见 [`../catalog.json`](../catalog.json)。本卡是 supplemental source，不恢复 Design Grammar Chat 的隐藏引用。
