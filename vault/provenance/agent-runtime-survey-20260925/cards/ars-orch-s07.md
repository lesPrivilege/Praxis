---
id: "ars-orch-s07"
status: "official-adr-reviewed"
url: "https://raw.githubusercontent.com/proboscis/orch/b1a6c1628fea02ad56347d4df9a7e1bef4e2b65d/docs/adr/defadr_0005_run_session_lifecycle.hy"
---

# ARS-ORCH-S07

来源：[原始页面](https://raw.githubusercontent.com/proboscis/orch/b1a6c1628fea02ad56347d4df9a7e1bef4e2b65d/docs/adr/defadr_0005_run_session_lifecycle.hy) · 状态：`official-adr-reviewed`

用途：GRAMMAR / REFERENCE

## 摘要

ADR-0005 makes sessions disposable cache, requires recorded revivability before reap, snapshots before kill, and revives same native conversation through send/attach.

## 证据与使用边界

ADR status is proposed in source; do not treat as generally proven production behavior. 本批外部证据保存为研究摘录/归纳，未保存完整原始源码；未实跑验证。

## 何时重访

产品 owner 消费对应候选工单、上游版本变化或需验证具体失败模式时，以固定来源重新核对。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
