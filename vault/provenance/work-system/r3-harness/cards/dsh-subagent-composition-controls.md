---
id: "dsh-subagent-composition-controls"
status: "verified"
url: "https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/notes/implemented/feature/2026-07-12-subagent-persona-tool-filter-and-depth.md"
---

# Subagent persona, toolFilter and depth controls

来源：[原始页面](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/notes/implemented/feature/2026-07-12-subagent-persona-tool-filter-and-depth.md) · 状态：`verified`

用途：GRAMMAR / SCALE

## 摘要

实现说明把 subagent composition 拆成 persona、toolFilter、maxDepth；provider 需声明能力，不支持时启动前拒绝；toolFilter 只改变 visible tool view，文档明确说不形成 authority、parent subset、插件 sandbox 或直接 service caller 隔离。

## 证据与使用边界

这是当前 in-process provider 的组合语义；外部 provider 可只声明部分能力，不能把 toolFilter 当企业授权系统。

## 何时重访

设计多 agent policy、工具白名单、递归深度或外部 provider adapter 时复查。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
