---
id: "dsh-source-launch-bug"
status: "partial"
url: "https://github.com/deepseek-ai/deepseek-harness/discussions/6974"
---

# alpha.2 source checkout runtime-resolution regression report

来源：[原始页面](https://github.com/deepseek-ai/deepseek-harness/discussions/6974) · 状态：`partial`

用途：BUILD / SCALE

## 摘要

社区报告在 alpha.2 commit ddefc45、源码 pnpm dsh web、runtime resolution 下首个 tool call 抛 prepare 错误并使 session 无法恢复；同一报告和回复显示改回 link 或使用 built bin 可工作。

## 证据与使用边界

这是指定 commit/Node/平台的讨论复现，页面未证明当前 master 或每个 tool 都仍受影响；官方 README 只确认源码需先 build。

## 何时重访

从 checkout 运行 dsh、切换 resolution mode、或升级 alpha 时重新跑最小 read/tool-call 复现并检查 release 修复。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
