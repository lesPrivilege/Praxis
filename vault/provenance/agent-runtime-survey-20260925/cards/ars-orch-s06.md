---
id: "ars-orch-s06"
status: "official-source-reviewed"
url: "https://raw.githubusercontent.com/proboscis/orch/b1a6c1628fea02ad56347d4df9a7e1bef4e2b65d/internal/daemon/agent_session.go"
---

# ARS-ORCH-S06

来源：[原始页面](https://raw.githubusercontent.com/proboscis/orch/b1a6c1628fea02ad56347d4df9a7e1bef4e2b65d/internal/daemon/agent_session.go) · 状态：`official-source-reviewed`

用途：GRAMMAR / REFERENCE

## 摘要

Claude native ID is minted at launch; Codex ID is resolved from rollout metadata after boot; missing identity is recorded as an error and makes the run unreapable.

## 证据与使用边界

Gemini and OpenCode use separate identity paths; no live recovery was tested. 本批外部证据保存为研究摘录/归纳，未保存完整原始源码；未实跑验证。

## 何时重访

产品 owner 消费对应候选工单、上游版本变化或需验证具体失败模式时，以固定来源重新核对。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
