---
id: "dsh-tools-scoped-restriction"
status: "verified"
url: "https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/core/tools/README.md"
---

# Per-agent scoped tool restrictions

来源：[原始页面](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/core/tools/README.md) · 状态：`verified`

用途：GRAMMAR / SCALE

## 摘要

核心 tools 文档定义 ctx.tools.restrict(filter)：对 agent 继承的 global tools 加 allow/deny mask，mask 相交，scoped registrations 保留可见，dispose 后解除；同一 resolver 同时影响 schemas、lookup 和 execution view。

## 证据与使用边界

这是同进程的可见性/组合控制，不是安全边界、授权模型、插件沙箱或 parent-to-child 非升级保证。

## 何时重访

把 restrict 用于企业权限、跨进程隔离或合规承诺前，必须复查 authority 设计和执行时 enforcement。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
