---
id: "dsh-src-12"
status: "verified"
url: "https://github.com/deepseek-ai/deepseek-harness/blob/477b4f420553e8a52c2fbccc464d7561b239c443/packages/subagent/subagent/src/continuation.ts"
---

# DSH-SRC-12

来源：[原始页面](https://github.com/deepseek-ai/deepseek-harness/blob/477b4f420553e8a52c2fbccc464d7561b239c443/packages/subagent/subagent/src/continuation.ts) · 状态：`verified`

用途：GRAMMAR / REFERENCE

## 摘要

Continuable child lifecycle uses durable Session descriptors, process-local Activations, inbox-only queueing, exact adjacent authorization, and cold resume.

## 证据与使用边界

Activation is process-local; durable child Session survival does not imply a running executor survives process loss. 本批外部证据保存为研究摘录/归纳，未保存完整原始源码；未实跑验证。

## 何时重访

产品 owner 消费对应候选工单、上游版本变化或需验证具体失败模式时，以固定来源重新核对。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
