---
id: "playwright-mcp"
status: "verified"
url: "https://playwright.dev/mcp/introduction"
---

# Playwright MCP

来源：[原始页面](https://playwright.dev/mcp/introduction) · 状态：`verified`

用途：GRAMMAR / BUILD

## 摘要

MCP 通过 accessibility snapshot 和 refs 让模型操作页面，不依赖视觉模型；另有 snapshot 和 profile/session 配置能力需按文档复查。

## 证据与使用边界

accessibility tree 不等于完整 DOM；cookie/profile 隔离和持久化需安全审查。

## 何时重访

网页 fallback、登录态或浏览器隔离策略变化时复查。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
