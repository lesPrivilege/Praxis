# Temporal

- 稳定 ID：`ref-temporal`
- 类别：workflow
- 用途：SCALE
- 原 URL：[https://github.com/temporalio/temporal?utm_source=chatgpt.com](https://github.com/temporalio/temporal?utm_source=chatgpt.com)
- 规范 URL：[https://github.com/temporalio/temporal](https://github.com/temporalio/temporal)
- 来源 turn/item：`1c0c2346-3b9a-4687-9150-cdcd64f172ea` / `98121a7f-451a-430c-adff-c7b4e5666ce0`
- 访问日期：2026-09-18
- 验证状态：**verified**
- 末轮 citation placeholder：无

## 官方核验

官方确认 durable execution、retries、workflow/activity/worker 与 server/UI；timeout/compensation 未在入口明确取证。

## 原对话主张与核实差异

原对话主张：long-running/retry/timeout/resume/compensation/background execution/durability 的生产化参考，普通 demo 不引入。

核实差异：官方确认 durable execution、retries、workflow/activity/worker 与 server/UI；timeout/compensation 未在入口明确取证。

## 可借鉴 grammar

- workflow/activity/worker\n- durability\n- retry/resume\n- operational server/UI

## 勿复制

- 不为普通 demo 预置\n- 不把 durable execution 等同业务补偿

## 重访触发

需要跨进程长任务、重试、恢复或可靠性时复查

## 官方证据

- [https://github.com/temporalio/temporal](https://github.com/temporalio/temporal)\n- [https://docs.temporal.io/](https://docs.temporal.io/)

