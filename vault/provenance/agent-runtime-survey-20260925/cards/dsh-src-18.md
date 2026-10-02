---
id: "dsh-src-18"
status: "verified"
url: "https://github.com/deepseek-ai/deepseek-harness/blob/477b4f420553e8a52c2fbccc464d7561b239c443/packages/jobs/tool-jobs/README.md"
---

# DSH-SRC-18

来源：[原始页面](https://github.com/deepseek-ai/deepseek-harness/blob/477b4f420553e8a52c2fbccc464d7561b239c443/packages/jobs/tool-jobs/README.md) · 状态：`verified`

用途：GRAMMAR / REFERENCE

## 摘要

Model-facing job tools deliver busy-owner next-step notices or idle-owner wakeups, with configurable wait/wakeup caps.

## 证据与使用边界

Pending notices do not survive owner disposal; wakeup is not a durable scheduler. 本批外部证据保存为研究摘录/归纳，未保存完整原始源码；未实跑验证。

## 何时重访

产品 owner 消费对应候选工单、上游版本变化或需验证具体失败模式时，以固定来源重新核对。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
