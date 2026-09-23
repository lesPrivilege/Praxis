---
id: "s14-typesafe-confidence"
status: "verified"
url: "https://docs.typesafe.ai/confidence.md"
---

# TypeSafe — Confidence

来源：[原始页面](https://docs.typesafe.ai/confidence.md) · 状态：`verified`

用途：Q4 / JEV / CONFIDENCE / CALIBRATION / DEGRADATION

## 摘要

Confidence 是由 Choice/Score 概率分布形状计算的 0 到 1 统计量；文档给出按风险区分自动执行、审阅和降级的示例，并说明阈值不是全系统只有一个数。

## 证据与使用边界

confidence 是概率分布的派生量，不是经业务验证的正确率，也不是独立证据。文档示例阈值不是本题上线门槛，仍需自有标签和错误成本校准。

## 何时重访

confidence 定义、计算方式、fallback 行为或风险分层示例变化；业务 policy 版本变更时复查。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
