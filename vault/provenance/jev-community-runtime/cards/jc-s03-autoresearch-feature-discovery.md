---
id: "jc-s03-autoresearch-feature-discovery"
status: "partial"
url: "https://docs.typesafe.ai/cookbooks/autoresearch_feature_discovery.md"
---

# Autoresearch feature discovery

来源：[原始页面](https://docs.typesafe.ai/cookbooks/autoresearch_feature_discovery.md) · 状态：`partial`

用途：GRAMMAR / BUILD / SCALE

## 摘要

Cookbook 把 Jev 的 score/noul 输出编码成数值特征，由 CatBoost 训练评分预测器；2,000 条 wine reviews 中 800 条留出，18→38 个问题的五轮特征发现把示例 held-out RMSE 从 1.87 降到 1.77。代码固定 `jev-1.12`，不是当前 1.13.0 复测。

## 证据与使用边界

这是厂商示例和作者设定的数据集；RMSE 不等于通用业务正确性，留出集是该示例内部评估，问题/特征发现受其程序与数据分布影响。

## 何时重访

将 Jev 特征接入业务、升级 Jev、改变标签/数据集或修改问题生成器时，需重新固定版本、数据切分、独立验收集和特征漂移测试。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
