---
id: "jc-s18-jev-harness-turn12"
status: "verified"
url: "https://github.com/TianyuCodings/JevHarness/blob/main/docs/examples/pokemon-turn12-jev.json"
---

# JevHarness recorded turn-12 call

来源：[原始页面](https://github.com/TianyuCodings/JevHarness/blob/main/docs/examples/pokemon-turn12-jev.json) · 状态：`verified`

用途：Q2 / Q4 / RECORDED_CALL / MODEL_VERSION / PROVENANCE / PROBABILITY_SEMANTICS

## 摘要

记录保留 run/candidate/episode/split/turn、输入 state、候选动作、probabilities、confidence、rounding、transport、usage、执行动作和游戏结果。turn 12 选择概率 0.72 的 switch:2 是动作选择概率，不是赢得整场比赛的概率；记录明确 model_version_pinned=false。

## 证据与使用边界

这是规范化记录，不是完整 gateway 原包；source trace 只登记远端路径和 hash，本批未验证原 trace；未钉死模型版本，回放不等于今天新鲜调用会相同。

## 何时重访

需要复盘 provider 行为、模型版本、rounding 或真实可重放性时取得原 trace、固定 commit/model version 并做新鲜调用对照。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
