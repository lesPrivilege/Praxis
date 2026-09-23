---
id: "jc-s17-jev-harness-readme"
status: "verified"
url: "https://github.com/TianyuCodings/JevHarness/blob/main/README.md"
---

# JevHarness README

来源：[原始页面](https://github.com/TianyuCodings/JevHarness/blob/main/README.md) · 状态：`verified`

用途：Q2 / Q4 / HARNESS / FREEZE / EVAL_CONTAMINATION / TRACE / VERSIONING

## 摘要

项目把强模型开发和冻结的 task-specific harness 分开：代码/特征/问题/控制流由 authoring LLM 修改，冻结后运行时只执行代码与 Jev calls。README 报告 Pokémon Eval 3/12→9/12，但明确 Eval 用于候选选择，不是未见游戏估计；GEPA 记录 rejected proposals、ancestry 和完整 trace。

## 证据与使用边界

这是作者项目 README 与 selection Eval 自测，不是独立 holdout 或生产验收。默认分支不是固定 commit；hosted alias 未钉死未来 provider 行为；页面/演示依赖远端资产。本次未复跑。

## 何时重访

项目 commit、Eval split、模型版本、harness freezing contract 或作者公布独立测试更新时复查。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
