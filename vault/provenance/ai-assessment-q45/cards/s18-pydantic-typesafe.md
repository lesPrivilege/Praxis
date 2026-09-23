---
id: "s18-pydantic-typesafe"
status: "verified"
url: "https://pydantic.dev/docs/ai/models/typesafe/"
---

# Pydantic AI — TypeSafe (Jev)

来源：[原始页面](https://pydantic.dev/docs/ai/models/typesafe/) · 状态：`verified`

用途：Q4 / SCHEMA / ROUNDING / RAW_SCORE / FALLBACK / CALIBRATION

## 摘要

Pydantic AI 的 Jev 集成文档把 schema 类型、原始 probabilities、confidence 和 rubric 的未取整 scores 分开；rubric 结果取最近等级且半数进位。文档要求在自有标签上测 accuracy、阈值和 hand-off rate，并提醒 latest/preview 别名会移动。

## 证据与使用边界

这是框架集成语义和维护者示例，不是 Jev 或业务的独立效果验证；包装层的取整不能替代原始分数和概率；内部支持工单示例太小，不能推导本题业务准确率。

## 何时重访

Pydantic AI 或 TypeSafe provider 版本更新，provider_details 结构、取整规则、latest 别名或 fallback API 变化。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
