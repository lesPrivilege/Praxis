---
id: "s04-openai-reasoning"
status: "verified"
url: "https://developers.openai.com/api/docs/guides/reasoning"
---

# OpenAI — Reasoning models

来源：[原始页面](https://developers.openai.com/api/docs/guides/reasoning) · 状态：`verified`

用途：GRAMMAR / SCALE

## 摘要

官方文档将 reasoning effort 与任务类型、延迟/成本权衡关联，并确认不可见 reasoning tokens 会占用上下文、计入输出 token 和 usage；提供跨调用上下文与摘要的控制面。

## 证据与使用边界

effort 名称不是跨厂商同量单位；文档的建议仍需在目标任务、模型版本和服务渠道上测质量、延迟和成本。

## 何时重访

模型版本、reasoning effort/context、usage schema 或 API 计费规则变化时；接入前重新核对支持矩阵。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
