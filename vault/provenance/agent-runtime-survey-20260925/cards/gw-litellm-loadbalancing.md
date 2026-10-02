---
id: "gw-litellm-loadbalancing"
status: "verified"
url: "https://docs.litellm.ai/docs/proxy/load_balancing"
---

# gw-litellm-loadbalancing

来源：[原始页面](https://docs.litellm.ai/docs/proxy/load_balancing) · 状态：`verified`

用途：GRAMMAR / REFERENCE

## 摘要

Routing strategies, deployment order, cooldown, strict RPM/TPM pre-call checks and Redis-shared state are documented; encrypted_content_affinity pins Responses follow-ups to the originating deployment/key.

## 证据与使用边界

Affinity is specific to encrypted content; it is not general session stickiness. 本批外部证据保存为研究摘录/归纳，未保存完整原始源码；未实跑验证。

## 何时重访

产品 owner 消费对应候选工单、上游版本变化或需验证具体失败模式时，以固定来源重新核对。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
