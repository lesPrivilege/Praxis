---
id: "s08-openai-guardrails-approvals"
status: "verified"
url: "https://developers.openai.com/api/docs/guides/agents/guardrails-approvals"
---

# OpenAI — Guardrails and human review

来源：[原始页面](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals) · 状态：`verified`

用途：GRAMMAR / SCALE

## 摘要

官方 Agents 指南把自动 guardrail 与人审拆开：敏感工具调用前可暂停，审批作为可恢复 interruption 保存 state；工具级检查贴近副作用，不能只依赖 agent 输入/最终输出检查。

## 证据与使用边界

SDK 状态模型不替代环境中的身份、网络、文件和项目隔离；仅文档确认 API 语义，未运行 approval、超时或恢复回放。

## 何时重访

Agents API/SDK interruption、guardrail scope、工具审批或序列化 state 变化时。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
