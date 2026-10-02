---
id: "gw-cpa-model-registry"
status: "partial"
url: "https://raw.githubusercontent.com/router-for-me/CLIProxyAPI/c404af96ebacedf8168b3c2bdbf4449a21cd1c1e/internal/registry/model_registry.go"
---

# gw-cpa-model-registry

来源：[原始页面](https://raw.githubusercontent.com/router-for-me/CLIProxyAPI/c404af96ebacedf8168b3c2bdbf4449a21cd1c1e/internal/registry/model_registry.go) · 状态：`partial`

用途：GRAMMAR / REFERENCE

## 摘要

Registry tracks model metadata per provider/client, active client counts and quota-exceeded clients; ModelInfo includes capability/context/thinking fields.

## 证据与使用边界

Only targeted source inspection; scheduler selection details were not exhaustively traced. 本批外部证据保存为研究摘录/归纳，未保存完整原始源码；未实跑验证。

## 何时重访

产品 owner 消费对应候选工单、上游版本变化或需验证具体失败模式时，以固定来源重新核对。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
