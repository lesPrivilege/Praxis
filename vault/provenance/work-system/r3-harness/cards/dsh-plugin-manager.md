---
id: "dsh-plugin-manager"
status: "verified"
url: "https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/boot/plugin-manager/README.md"
---

# @deepseek-ai/dsh-plugin-manager

来源：[原始页面](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/boot/plugin-manager/README.md) · 状态：`verified`

用途：BUILD / GRAMMAR / SCALE

## 摘要

官方 plugin-manager 支持在当前 profile 安装/移除 bundle、启用/禁用 plugin entry；Web Plugins sidebar 和 plugin_manager tool 共用操作，启用 HMR 时立即应用，移除流程会卸载 runtime contributions。

## 证据与使用边界

profile-wide 变更会影响使用该 profile 的 sessions；安装可能执行 Host 代码，页面要求相应权限/审批，不能把热卸载理解成进程级安全隔离。

## 何时重访

部署 GUI 插件管理、HMR、安装审批或 runtime unload 时复查当前限制。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
