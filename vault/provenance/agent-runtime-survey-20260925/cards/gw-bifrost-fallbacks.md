---
id: "gw-bifrost-fallbacks"
status: "verified"
url: "https://docs.getbifrost.ai/features/fallbacks"
---

# gw-bifrost-fallbacks

来源：[原始页面](https://docs.getbifrost.ai/features/fallbacks) · 状态：`verified`

用途：GRAMMAR / REFERENCE

## 摘要

Retries classify network/5xx versus per-key 429/401/402/403; key rotation and exponential backoff precede provider fallback, each fallback receiving its own retry budget; cancellation is non-retryable.

## 证据与使用边界

The docs describe request semantics; tool side effects still require upper-layer policy. 本批外部证据保存为研究摘录/归纳，未保存完整原始源码；未实跑验证。

## 何时重访

产品 owner 消费对应候选工单、上游版本变化或需验证具体失败模式时，以固定来源重新核对。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
