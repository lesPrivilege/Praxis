---
id: "gw-bifrost-inference"
status: "partial"
url: "https://raw.githubusercontent.com/maximhq/bifrost/fdeef8e3f31a3b18a61666ba49247d07bae3600a/transports/bifrost-http/handlers/inference.go"
---

# gw-bifrost-inference

来源：[原始页面](https://raw.githubusercontent.com/maximhq/bifrost/fdeef8e3f31a3b18a61666ba49247d07bae3600a/transports/bifrost-http/handlers/inference.go) · 状态：`partial`

用途：GRAMMAR / REFERENCE

## 摘要

HTTP handler parses model and fallbacks, exposes provider/model and tool/reasoning/stream fields, and forwards provider response headers.

## 证据与使用边界

Targeted inspection; provider-specific converters were not exhaustively reviewed. 本批外部证据保存为研究摘录/归纳，未保存完整原始源码；未实跑验证。

## 何时重访

产品 owner 消费对应候选工单、上游版本变化或需验证具体失败模式时，以固定来源重新核对。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
