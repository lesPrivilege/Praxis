---
id: "supp-openai-tool-search"
status: "verified"
url: "https://developers.openai.com/api/docs/guides/tools-tool-search"
---

# OpenAI — Tool search

来源：[原始页面](https://developers.openai.com/api/docs/guides/tools-tool-search) · 状态：`verified`

用途：GRAMMAR / SCALE

## 摘要

当前官方 Tool search 支持 hosted/client search、defer_loading、工具加载到上下文末尾和 additional_tools 指定位置注入；已加载集合的修改会破坏后续缓存，因此后续加载、撤回和授权仍需分开。

## 证据与使用边界

Tool search 的模型/API 支持和 Agents API/MCP 配置不同；动态加载不自动授予权限，也不证明目标 runtime 支持无中断 hot-swap。

## 何时重访

tool_search 支持模型、Agents API/MCP 接入、工具集合变更或缓存语义变化时；目标运行时做实际轨迹和授权测试。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
