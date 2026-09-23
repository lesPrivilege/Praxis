---
id: "s06-openai-latency-optimization"
status: "verified"
url: "https://developers.openai.com/api/docs/guides/latency-optimization"
---

# OpenAI — Latency optimization

来源：[原始页面](https://developers.openai.com/api/docs/guides/latency-optimization) · 状态：`verified`

用途：GRAMMAR / SCALE

## 摘要

官方指南将延迟拆为 token 生成、输入、请求往返和串行依赖，建议减少输出和请求、并行独立步骤、对确定性工作使用硬编码/规则。

## 证据与使用边界

文档中的经验比例和原则不是本产品 p95、SLO 或价格；任何 0.1/1/10 秒等待目标仍需用户行为和真实链路验证。

## 何时重访

模型服务、网络区域、工具链或用户行为变化时；上线前按真实 p50/p95/p99 重测。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
