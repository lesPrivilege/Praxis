---
id: "dsh-per-session-agent-preset-note"
status: "verified"
url: "https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/notes/implemented/architecture/2026-08-03-per-session-agent-presets.md"
---

# Per-session agent presets implementation note

来源：[原始页面](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/notes/implemented/architecture/2026-08-03-per-session-agent-presets.md) · 状态：`verified`

用途：GRAMMAR / BUILD

## 摘要

实现说明把 preset 挂到每个 agent/session scope；Host plane 保留 registries 与 model routing，Agent plane 提供工具/persona/prompt；已运行 session 不重组，只有 blank session 可切换，resume 恢复原 preset composition。

## 证据与使用边界

这是 upstream 当前实现/设计记录，不是稳定 API 版本承诺；其中 model/provider routing 明确在 preset 之外。

## 何时重访

需要在已有内容 session 切换 preset、修改 provider/model seam 或跨进程复用时复查。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
