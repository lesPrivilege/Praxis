---
id: "s15-typesafe-jev-1-13-jaggedness"
status: "verified"
url: "https://docs.typesafe.ai/model-jaggedness/jev-1.13.md"
---

# TypeSafe — Jev 1.13 jaggedness

来源：[原始页面](https://docs.typesafe.ai/model-jaggedness/jev-1.13.md) · 状态：`verified`

用途：Q4 / JEV / LIMITS / ROBUSTNESS / INJECTION / CALIBRATION

## 摘要

Jev 1.13 的限制页明确列出字面理解、数学与数字、日期比较、间接推理、无关上下文、对抗内容和结构不变量等边界；建议把算术和日期组装留给代码，过滤输入并分别设计问题。

## 证据与使用边界

这是版本化的厂商限制说明，页内明确 last reviewed 2026-09-17；不证明其他 Jev 版本、其他 primitive 或业务数据的效果。文档自称 calibrated 不是独立校准证据。

## 何时重访

Jev 版本、模型限制页或 primitive 语义更新；业务使用从 jev-1.13 切换到 latest/preview 时必须复查。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
