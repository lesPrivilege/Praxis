---
id: "s13-typesafe-score"
status: "verified"
url: "https://docs.typesafe.ai/primitives/score.md"
---

# TypeSafe — Score

来源：[原始页面](https://docs.typesafe.ai/primitives/score.md) · 状态：`verified`

用途：Q4 / JEV / SCORE / CALIBRATION / THRESHOLD

## 摘要

Score 是按有序、描述性等级评估内容的题型，正文说明返回每级概率、加权 score 和 confidence；score 可以落在两个等级之间。正文还明确 confidence 只描述返回分布的集中程度，同一个 score 可由不同概率分布产生。

## 证据与使用边界

这是厂商接口语义和演示，不是本业务正确率或校准证据。等级编号的概率加权均值不是物理量或业务损失；四舍五入不能单独承担严重风险闸门。

## 何时重访

Score/Choice/Noul API 语义、概率字段或等级处理变更；为业务阈值做实测前复查。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
