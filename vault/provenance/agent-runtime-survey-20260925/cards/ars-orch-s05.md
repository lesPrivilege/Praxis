---
id: "ars-orch-s05"
status: "official-source-reviewed"
url: "https://raw.githubusercontent.com/proboscis/orch/b1a6c1628fea02ad56347d4df9a7e1bef4e2b65d/internal/agent/opencode_client.go"
---

# ARS-ORCH-S05

来源：[原始页面](https://raw.githubusercontent.com/proboscis/orch/b1a6c1628fea02ad56347d4df9a7e1bef4e2b65d/internal/agent/opencode_client.go) · 状态：`official-source-reviewed`

用途：GRAMMAR / REFERENCE

## 摘要

OpenCode client parses provider/model, sends optional variant, polls health, retries bounded requests, subscribes to SSE and maps busy/idle/retry state.

## 证据与使用边界

No live provider calls or side-effect retry validation was performed. 本批外部证据保存为研究摘录/归纳，未保存完整原始源码；未实跑验证。

## 何时重访

产品 owner 消费对应候选工单、上游版本变化或需验证具体失败模式时，以固定来源重新核对。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
