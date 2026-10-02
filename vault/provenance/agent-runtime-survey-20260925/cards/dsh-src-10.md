---
id: "dsh-src-10"
status: "verified"
url: "https://github.com/deepseek-ai/deepseek-harness/blob/477b4f420553e8a52c2fbccc464d7561b239c443/packages/interaction/user-questions/src/index.ts"
---

# DSH-SRC-10

来源：[原始页面](https://github.com/deepseek-ai/deepseek-harness/blob/477b4f420553e8a52c2fbccc464d7561b239c443/packages/interaction/user-questions/src/index.ts) · 状态：`verified`

用途：GRAMMAR / REFERENCE

## 摘要

UserQuestionService validates structured questions and routes them through a scoped answerer waterfall; delegated child callers are rejected.

## 证据与使用边界

Question intent changes presentation only and is not an authority/permission decision. 本批外部证据保存为研究摘录/归纳，未保存完整原始源码；未实跑验证。

## 何时重访

产品 owner 消费对应候选工单、上游版本变化或需验证具体失败模式时，以固定来源重新核对。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
