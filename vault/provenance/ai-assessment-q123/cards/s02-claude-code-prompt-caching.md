---
id: "s02-claude-code-prompt-caching"
status: "verified"
url: "https://code.claude.com/docs/en/prompt-caching"
---

# Claude Code — How Claude Code uses prompt caching

来源：[原始页面](https://code.claude.com/docs/en/prompt-caching) · 状态：`verified`

用途：GRAMMAR / SCALE

## 摘要

Claude Code 当前文档描述按前缀匹配的缓存、工具定义所在层和模型/effort/连接变更的产品行为；同时区分延迟工具目录变化与已加载到前缀的工具变化。

## 证据与使用边界

这是 Claude Code 及其后端/接入渠道的实现文档；模型、effort、网关和云渠道存在条件差异，不能外推为所有 API 的通则，也没有本地实测本题账单。

## 何时重访

Claude Code、模型、effort、MCP/插件加载策略、网关或云渠道变化时；引用具体缓存行为前复查。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
