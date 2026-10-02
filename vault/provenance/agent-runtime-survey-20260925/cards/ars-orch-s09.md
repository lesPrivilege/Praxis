---
id: "ars-orch-s09"
status: "official-source-reviewed"
url: "https://github.com/reidliu41/agent-workbench/blob/0.1.12/apps/server/src/index.ts"
---

# ARS-ORCH-S09

来源：[原始页面](https://github.com/reidliu41/agent-workbench/blob/0.1.12/apps/server/src/index.ts) · 状态：`official-source-reviewed`

用途：GRAMMAR / REFERENCE

## 摘要

TerminalManager owns PTY handles keyed by task/channel, buffers and broadcasts output, records exits/diffs, polls native IDs, and kills/restarts processes.

## 证据与使用边界

Server process memory is not a durable terminal registry; startup recovery falls back to worktree diff. 本批外部证据保存为研究摘录/归纳，未保存完整原始源码；未实跑验证。

## 何时重访

产品 owner 消费对应候选工单、上游版本变化或需验证具体失败模式时，以固定来源重新核对。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
