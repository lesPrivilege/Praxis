---
id: "jc-s23-jev-kg-extraction"
status: "verified"
url: "https://lyonwj.com/blog/typesafe-jev-knowledge-graph-extraction"
---

# Typed Judgments for Knowledge Graph Extraction with TypeSafe's Jev

来源：[原始页面](https://lyonwj.com/blog/typesafe-jev-knowledge-graph-extraction) · 状态：`verified`

用途：Q4 / KNOWLEDGE_GRAPH / CANDIDATE_GENERATION / ASSERTION / RELATION_SELECTION / THRESHOLD

## 摘要

William Lyon 文章把 GLiNER 候选生成与 Jev 的 assertion/relationship 判断分开，在 10 篇合成文档、47 gold triples、13 alias groups 上说明：候选生成决定 recall，Jev 对已有候选做 assertion gate、relation selection、entity resolution；阈值扫 stored judgments 可不重新调用模型。文章报告局部 precision 提升和实体合并反例。

## 证据与使用边界

合成小数据、候选已由 GLiNER 生成，不能将局部 gate 结果当端到端图谱召回或生产准确率；作者明确 perfect judge 对错误 queue 无法补回漏候选；本次未运行代码和 API。

## 何时重访

ontology、candidate generator、scope（paragraph/document）、threshold 或关系聚合更新时复查；用独立 gold graph 测候选 recall 与关系 precision 分层。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
