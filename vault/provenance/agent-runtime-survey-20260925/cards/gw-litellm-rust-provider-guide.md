---
id: "gw-litellm-rust-provider-guide"
status: "verified"
url: "https://raw.githubusercontent.com/BerriAI/litellm/ccb327f032c69754445763dbec669a5d2517630c/litellm-rust/ADDING_A_PROVIDER.md"
---

# gw-litellm-rust-provider-guide

来源：[原始页面](https://raw.githubusercontent.com/BerriAI/litellm/ccb327f032c69754445763dbec669a5d2517630c/litellm-rust/ADDING_A_PROVIDER.md) · 状态：`verified`

用途：GRAMMAR / REFERENCE

## 摘要

Provider route contract separates entrypoint, transformation trait, prepare (resolve model/credentials/auth/URL) and handler (HTTP call/response transform).

## 证据与使用边界

Guide does not guarantee parity for every route/provider. 本批外部证据保存为研究摘录/归纳，未保存完整原始源码；未实跑验证。

## 何时重访

产品 owner 消费对应候选工单、上游版本变化或需验证具体失败模式时，以固定来源重新核对。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
