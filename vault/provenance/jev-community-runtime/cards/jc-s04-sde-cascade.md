---
id: "jc-s04-sde-cascade"
status: "partial"
url: "https://docs.typesafe.ai/cookbooks/sde_cascade.md"
---

# SDE cascade

来源：[原始页面](https://docs.typesafe.ai/cookbooks/sde_cascade.md) · 状态：`partial`

用途：GRAMMAR / SCALE

## 摘要

SDE cookbook 展示 mini 提取→Jev 逐字段验证→必要时升级 reasoning 的级联，并明确案例使用 `jev-1.12`；100 prompts 的成本/质量曲线是历史快照，文档说没有按当前 Jev 费率重算。

## 证据与使用边界

示例含硬编码/单例展示和供应商自报成本；100 prompts 不是本轮独立复现，价格来自文档核对日和外部链接，不能当当前账单或上线收益。

## 何时重访

模型/价格、Jev 版本、gate threshold、提取字段或升级策略变化时；重新测 accepted result、误检、漏检、端到端延迟和总成本。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
