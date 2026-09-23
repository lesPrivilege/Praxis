---
id: "jc-s10-jev-harness-lab-report"
status: "partial"
url: "https://github.com/Aitejiu/jev-harness-lab/blob/main/docs/REPORT.md"
---

# jev-harness-lab 技术评估报告

来源：[原始页面](https://github.com/Aitejiu/jev-harness-lab/blob/main/docs/REPORT.md) · 状态：`partial`

用途：GRAMMAR / SCALE / SOURCE

## 摘要

报告把 Jev 用于注入检测、检索重排、意图分类、命令风险、工具/agent 路由和 skill router，并保留模型难度路由 51.3%、轨迹失败归因 AUROC 0.560、中文子集 14.6% 等负结果；报告还说明工具路由条件是目录已知的候选选择。

## 证据与使用边界

作者报告不是独立审计；数据集、criteria、阈值和同集迭代需复核；README 总计约 22,500 calls/$2.19，而报告方法段局部写 13,616 calls/$0.45，不能合并成一个无歧义总账。安全检测结果不等于生产安全认证，模型路由负结果不能推成所有能力路由都失败。

## 何时重访

报告或结果 JSON 更新、criteria/阈值变化、数据集切片和模型版本变化时；独立复现前逐项核对调用数、费用、重复/泄漏和 held-out 规则。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
