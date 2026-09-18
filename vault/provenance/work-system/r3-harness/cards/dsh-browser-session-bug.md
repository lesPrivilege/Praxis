---
id: "dsh-browser-session-bug"
status: "partial"
url: "https://github.com/deepseek-ai/deepseek-harness/discussions/7007"
---

# Browser Use provider multi-session report

来源：[原始页面](https://github.com/deepseek-ai/deepseek-harness/discussions/7007) · 状态：`partial`

用途：BUILD / SCALE

## 摘要

社区报告在 Windows、dsh 0.1.6-alpha.1/alpha.2 与 browser-use alpha.1 组合中，首个 session 可用而后续创建/恢复失败；移除 profile insert 后恢复，作者做了两轮开关复现。

## 证据与使用边界

单条无回复的 Windows 复现，针对具体 profile/plugin 组合；不是官方 bug 修复状态，也不能泛化为所有 Browser Use 或所有平台。

## 何时重访

启用 Browser Use、多 session 或升级 alpha 时在目标平台做独立最小复现，并检查对应插件版本。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
