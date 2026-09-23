---
id: "jc-s21-southbridge-entity-resolution"
status: "verified"
url: "https://www.southbridge.ai/blog/jev-entity-resolution"
---

# Using system-one models inside high-throughput data pipelines

来源：[原始页面](https://www.southbridge.ai/blog/jev-entity-resolution) · 状态：`verified`

用途：Q2 / Q4 / ENTITY_RESOLUTION / RELATIONSHIP / BATCH / COST / PRACTICE_MAP

## 摘要

Southbridge 在 Ohio campaign-finance entity resolution 困难切片中用 Jev 作为主判断、Luna 复核难例，强调实体同一性与关系（如 household）分开判断；作者报告 batch/evidence pipeline 的成本、吞吐和接近 Fable 质量。

## 证据与使用边界

困难子集、作者自测和累计 call-seconds；TB 成本是外推而非 TB 运行，Jev-only 会明显掉准确率，关系不是实体合并许可。公开页面不是独立金标、通用实体解析准确率或生产 SLA。

## 何时重访

数据切片、entity/relationship ontology、review policy、模型/价格或公开 experiment bundle 更新时复查；用于实践地图时保留实体与关系拆分。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
