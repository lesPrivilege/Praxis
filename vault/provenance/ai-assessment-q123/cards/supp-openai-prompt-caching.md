---
id: "supp-openai-prompt-caching"
status: "verified"
url: "https://developers.openai.com/api/docs/guides/prompt-caching"
---

# OpenAI — Prompt caching

来源：[原始页面](https://developers.openai.com/api/docs/guides/prompt-caching) · 状态：`verified`

用途：GRAMMAR / SCALE

## 摘要

当前官方文档说明缓存匹配完整 rendered prefix，工具定义/顺序和部分设置会影响复用；工具可 append-only 追加，defer_loading 发现工具追加到上下文末尾，且可用 usage 和 diagnostics 测量实际命中。

## 证据与使用边界

缓存生命周期、模型支持、区域/路由和价格随模型与组织策略变化；文档确认不等于目标账户命中或成本收益已实测。

## 何时重访

模型族、cache mode、prompt_cache_options、tool loading 或定价/数据保留变化时；接入前重新读取当前文档。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
