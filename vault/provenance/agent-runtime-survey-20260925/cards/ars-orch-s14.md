---
id: "ars-orch-s14"
status: "official-source-reviewed"
url: "https://github.com/yedidya-buildfy/ai-orchestra/blob/107b590f4404bed258edeed493feb42fbc7f6a72/src/refresh.ts"
---

# ARS-ORCH-S14

来源：[原始页面](https://github.com/yedidya-buildfy/ai-orchestra/blob/107b590f4404bed258edeed493feb42fbc7f6a72/src/refresh.ts) · 状态：`official-source-reviewed`

用途：GRAMMAR / REFERENCE

## 摘要

Refresh persists a snapshot, kills and respawns tmux, sends a bootstrap directive, checks liveness, and logs completion.

## 证据与使用边界

Native conversation continuity and side effects across kill are not verified in this study. 本批外部证据保存为研究摘录/归纳，未保存完整原始源码；未实跑验证。

## 何时重访

产品 owner 消费对应候选工单、上游版本变化或需验证具体失败模式时，以固定来源重新核对。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
