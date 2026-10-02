---
id: "gw-litellm-reliability"
status: "verified"
url: "https://docs.litellm.ai/docs/proxy/reliability"
---

# gw-litellm-reliability

来源：[原始页面](https://docs.litellm.ai/docs/proxy/reliability) · 状态：`verified`

用途：GRAMMAR / REFERENCE

## 摘要

Fallback groups are ordered and layered by ordinary errors, content policy, and context-window; retries precede fallback; cooldown and spend-log metadata are documented.

## 证据与使用边界

No documented proof of post-first-byte stream failover or tool replay semantics. 本批外部证据保存为研究摘录/归纳，未保存完整原始源码；未实跑验证。

## 何时重访

产品 owner 消费对应候选工单、上游版本变化或需验证具体失败模式时，以固定来源重新核对。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
