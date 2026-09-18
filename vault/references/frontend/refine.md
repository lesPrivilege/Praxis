# Refine

- 稳定 ID：`ref-refine`
- 类别：frontend
- 用途：BUILD / GRAMMAR
- 原 URL：[https://github.com/refinedev/refine?utm_source=chatgpt.com](https://github.com/refinedev/refine?utm_source=chatgpt.com)
- 规范 URL：[https://github.com/refinedev/refine](https://github.com/refinedev/refine)
- 来源 turn/item：`1c0c2346-3b9a-4687-9150-cdcd64f172ea` / `98121a7f-451a-430c-adff-c7b4e5666ce0`
- 访问日期：2026-09-18
- 验证状态：**verified**
- 末轮 citation placeholder：无

## 官方核验

官方确认 headless/CRUD/provider seams；原对话的完整 provider 枚举与资源子路由是抽象化解读，需看具体 provider docs。

## 原对话主张与核实差异

原对话主张：以 Data/Auth/Access Control/Notification/Audit Log/Router provider boundary 与 Resource list/show/create/edit 校准 Kit 边界。

核实差异：官方确认 headless/CRUD/provider seams；原对话的完整 provider 枚举与资源子路由是抽象化解读，需看具体 provider docs。

## 可借鉴 grammar

- headless provider boundary\n- resource list/show/create/edit\n- logic/UI separation

## 勿复制

- 不引入完整 meta-framework\n- 不把 provider 名称当已实现 contract

## 重访触发

需要 provider、审计或资源路由时复查

## 官方证据

- [https://github.com/refinedev/refine](https://github.com/refinedev/refine)\n- [https://github.com/refinedev/refine/blob/master/packages/core/README.md](https://github.com/refinedev/refine/blob/master/packages/core/README.md)

