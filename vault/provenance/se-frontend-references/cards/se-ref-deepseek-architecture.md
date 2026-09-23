---
id: "se-ref-deepseek-architecture"
status: "partial"
url: "https://deepseek-harness.github.io/deepseek-harness/en/reference/"
---

# DeepSeek Harness — Architecture reference

来源：[原始页面](https://deepseek-harness.github.io/deepseek-harness/en/reference/) · 状态：`partial`

用途：BUILD / GRAMMAR

## 摘要

Practice Index 记录该架构页用于 session events、agent events、capability events、turn flow 与 session log 的公开定义；前端消费只取事件/状态可投影的设计启发，不把 Runtime event 模型等同于 SE 的 Committed Event。

## 证据与使用边界

本轮未重新读取；不证明当前 DeepSeek Harness 事件语义、版本兼容、恢复或 UI 投影实现。

## 何时重访

需要设计事件驱动的前端状态投影、回放或 runtime adapter 时，复核固定版本和事件契约。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
