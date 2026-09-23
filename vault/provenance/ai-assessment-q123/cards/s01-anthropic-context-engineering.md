---
id: "s01-anthropic-context-engineering"
status: "verified"
url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
---

# Anthropic — Effective context engineering for AI agents

来源：[原始页面](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · 状态：`verified`

用途：GRAMMAR / SCALE

## 摘要

Anthropic 将 context 定义为每次推理可见的 token 集合，并把长任务的供给问题拆为 just-in-time retrieval、compaction、结构化笔记和子代理隔离；建议让工具返回高信号、可渐进披露的内容。

## 证据与使用边界

厂商工程文章和经验总结，不是跨模型保证；文章中的方法不能证明本题轨迹、压缩不变量或业务质量已实测。

## 何时重访

上下文窗口、压缩、memory/tool retrieval 或文章引用的 Claude 能力发生变化时；正式交付前复查长任务边界。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
