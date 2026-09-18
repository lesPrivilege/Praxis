# Camunda

- 稳定 ID：`ref-camunda`
- 类别：workflow
- 用途：GRAMMAR / SCALE
- 原 URL：[https://github.com/camunda/camunda?utm_source=chatgpt.com](https://github.com/camunda/camunda?utm_source=chatgpt.com)
- 规范 URL：[https://github.com/camunda/camunda](https://github.com/camunda/camunda)
- 来源 turn/item：`1c0c2346-3b9a-4687-9150-cdcd64f172ea` / `98121a7f-451a-430c-adff-c7b4e5666ce0`
- 访问日期：2026-09-18
- 验证状态：**verified**
- 末轮 citation placeholder：无

## 官方核验

官方确认 BPMN/DMN、process orchestration、Tasklist/Operate/Identity/Optimize/Modeler；gateway/timer/escalation 等子项未在入口逐项验证。

## 原对话主张与核实差异

原对话主张：Process/Task/Human Task/Service Task/Gateway/Condition/Timer/Escalation/Incident/Form/Decision，并让 definition/runtime/human task/business-visible process 共存。

核实差异：官方确认 BPMN/DMN、process orchestration、Tasklist/Operate/Identity/Optimize/Modeler；gateway/timer/escalation 等子项未在入口逐项验证。

## 可借鉴 grammar

- process definition/runtime\n- human/service task\n- modeler/tasklist/operate\n- BPMN/DMN

## 勿复制

- 不为普通 demo 引入 engine\n- 不混淆业务态与引擎态

## 重访触发

需要长流程、HITL、incident 或 BPMN/DMN 时复查

## 官方证据

- [https://github.com/camunda/camunda](https://github.com/camunda/camunda)

