---
id: "s16-typesafe-consistency-choice"
status: "verified"
url: "https://docs.typesafe.ai/cookbooks/consistency_choice_cookbook.md"
---

# TypeSafe — Self-consistency: choices

来源：[原始页面](https://docs.typesafe.ai/cookbooks/consistency_choice_cookbook.md) · 状态：`verified`

用途：Q4 / CONSISTENCY / REPEATABILITY / ABSTENTION / HUMAN_REVIEW

## 摘要

官方 cookbook 对一个边界 moderation post 做 15 次重复，报告标签一致性、概率波动、uncertain 比例和自动处理覆盖率；它明确说明把 top probability 低于 0.60 的结果送人工能提高重复一致性，但该阈值只是示例 policy，不代表校准保证，重复性不等于正确性。

## 证据与使用边界

单个边界 post、8 个 Choice、每条件 15 次，TypeSafe 调用使用 fresh uid；不能分离同请求随机性与 uid 扰动，也不能推导本业务正确率、校准或优越性。

## 何时重访

Jev/LLM 版本、rubric、uid/cache 机制或业务 action policy 改变；正式上线前用自有标注和未调参测试集重做。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
