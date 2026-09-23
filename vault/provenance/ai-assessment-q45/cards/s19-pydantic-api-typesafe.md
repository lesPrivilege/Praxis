---
id: "s19-pydantic-api-typesafe"
status: "verified"
url: "https://pydantic.dev/docs/ai/api/models/typesafe/"
---

# Pydantic AI — models.typesafe API

来源：[原始页面](https://pydantic.dev/docs/ai/api/models/typesafe/) · 状态：`verified`

用途：Q4 / SCHEMA / THRESHOLD / RAW_SCORE / VERSIONING / DEGRADATION

## 摘要

API 参考明确 bool threshold 默认 0.5、tool-call threshold 默认 0.6，并区分 bool 的阈值化、float 原始概率、rubric 最近等级和 provider_details 中的 confidence/probabilities/scores。它提醒工具阈值应在自有标注上调校。

## 证据与使用边界

API 默认值不是业务门槛，也不是跨 primitive 可迁移的校准结果；文档中的 provider/model 版本和运行环境不证明服务 SLA、区域稳定性或绝对确定性。

## 何时重访

Pydantic AI API 版本、TypeSafe provider 配置、threshold 默认值或 response metadata 结构变更。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
