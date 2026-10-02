---
id: "gw-cpa-claude-executor"
status: "verified"
url: "https://raw.githubusercontent.com/router-for-me/CLIProxyAPI/c404af96ebacedf8168b3c2bdbf4449a21cd1c1e/internal/runtime/executor/claude_executor_execute.go"
---

# gw-cpa-claude-executor

来源：[原始页面](https://raw.githubusercontent.com/router-for-me/CLIProxyAPI/c404af96ebacedf8168b3c2bdbf4449a21cd1c1e/internal/runtime/executor/claude_executor_execute.go) · 状态：`verified`

用途：GRAMMAR / REFERENCE

## 摘要

Claude executor selects upstream model, translates request/response formats, applies thinking/tool/context rules, binds HTTP request to context and records upstream request/response metadata.

## 证据与使用边界

One executor is not evidence for all providers or for cross-executor failover. 本批外部证据保存为研究摘录/归纳，未保存完整原始源码；未实跑验证。

## 何时重访

产品 owner 消费对应候选工单、上游版本变化或需验证具体失败模式时，以固定来源重新核对。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
