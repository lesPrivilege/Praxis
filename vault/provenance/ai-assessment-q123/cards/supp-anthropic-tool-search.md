---
id: "supp-anthropic-tool-search"
status: "verified"
url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool"
---

# Anthropic — Tool search tool

来源：[原始页面](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) · 状态：`verified`

用途：GRAMMAR / SCALE

## 摘要

Anthropic 当前 Tool search 允许为工具设置 defer_loading；客户端仍提交完整目录，但延迟工具不进入初始 system prompt，发现后用 tool_reference 展开并保持前缀缓存。

## 证据与使用边界

文档规定的是 Claude API 的工具搜索和 toolset 语义；它不证明所有 Claude Code/第三方网关/目标 runtime 相同，也不把发现视为执行授权。

## 何时重访

tool search/toolset 日期版本、MCP/Computer toolset 配置或 prompt caching 语义变化时。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
