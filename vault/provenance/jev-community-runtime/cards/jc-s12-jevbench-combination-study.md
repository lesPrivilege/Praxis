---
id: "jc-s12-jevbench-combination-study"
status: "partial"
url: "https://github.com/fstandhartinger/jevbench/blob/main/RESULTS-COMBINATIONS.md"
---

# JevBench combination study

来源：[原始页面](https://github.com/fstandhartinger/jevbench/blob/main/RESULTS-COMBINATIONS.md) · 状态：`partial`

用途：GRAMMAR / SCALE / SOURCE

## 摘要

组合研究在 534 frozen decisions 上离线回放 committee、probability averaging、cascade 和 best-of-n；成本计入每个被调用成员，委员会/并行 best-of-n 等待最慢调用，级联为串行等待。没有组合超过最佳单系统复合分数。

## 证据与使用边界

不是新鲜线上 cascade，也不提供目标网络 p95；classifier.dev Fast→Jev 涉及同一 Jev 底层模型，不能当两份独立模型证据。组合成本仍应按实际每次调用计入，‘同底层’只影响独立性/去重解释，不自动免除账单。

## 何时重访

组合成员、底层模型、阈值、决策集、并发策略或价格变化时；线上路由必须重新测独立性、重复调用成本、p95 和最终接受率。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
