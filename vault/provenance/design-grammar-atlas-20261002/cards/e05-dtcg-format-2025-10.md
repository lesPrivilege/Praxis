---
id: "e05-dtcg-format-2025-10"
status: "verified"
url: "https://www.designtokens.org/tr/2025.10/format/"
---

# E05 · DTCG — Design Tokens Format Module 2025.10

来源：[原始页面](https://www.designtokens.org/tr/2025.10/format/) · 状态：`verified` · 重访：2026-10-02（redirected）

用途：GRAMMAR / METHOD / VERIFICATION

## 是什么

DTCG 2025.10 的 token 交换格式最终社区报告，支持值、类型、复合与弃用的表达，但不是 W3C 标准。

页面所见：Design Tokens Community Group；Final Community Group Report, 2025-10-28

## 台账要点与本轮重访

- 有依据：token 保留命名、值、类型和说明。每个 token 有名称与 $value，可选 $type、$description、$extensions。
- 有依据：复合 token 表达一起使用的一组值。复合类型含阴影、边框、字体排印、渐变、转场，可引用其他 token。
- 有依据：group 不应被工具用来推断用途。页面写明分组是任意的，工具不应以之推断类型或用途。
- 有依据：弃用应可说明原因。$deprecated 可为布尔值或说明字符串。
- 有依据：不是 W3C Standard。页面称为 Community Group Final Report，非 W3C 标准。

与台账不符或需注意：URL 仅大小写规范化：/TR/ 落地为 /tr/，无实质差别。

## 限制

不能证明定义了 Atlas grammar 或 profile；一棵 token 树不能表达构成意图。 本轮只读文字，没有看图。

## 何时重访

据此设计样张比较方法或自动检查、工具版本更新、或要引用其效果主张时重访。

台账原文见 [包内 engineering 台账](../../../snapshots/local/design-grammar-atlas-20261002/research/engineering-sources.md)，机器登记见 [`../catalog.json`](../catalog.json)。
