---
id: "dsh-client-slot-seam"
status: "verified"
url: "https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/AGENTS.md"
---

# Web client plugin and slot composition guidance

来源：[原始页面](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/AGENTS.md) · 状态：`verified`

用途：GRAMMAR / BUILD

## 摘要

官方 Web client guidance 规定 UI plugin 通过 ctx.slots.register/inject 组合，跨 package 的 UI 通过 slots、行为通过 Cordis services；动态声明可等待、卸载并重新注册，插件不应重建整个 shell。

## 证据与使用边界

文档证明 slot seam 的存在，不证明某个 VS Code bridge 或社区插件确实只使用该 seam，也不列出完整社区生态。

## 何时重访

实现 Sidebar、review surface、IDE client 或跨包 UI 扩展时复查 slot declaration/ownership 约束。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
