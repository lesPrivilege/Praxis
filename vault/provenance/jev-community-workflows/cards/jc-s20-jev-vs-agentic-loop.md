---
id: "jc-s20-jev-vs-agentic-loop"
status: "verified"
url: "https://blog.r6i.it/typesafe-jev-vs-agentic-loop.html"
---

# Typed Judgments or Agentic Loops? Benchmarking Jev Against a GPT Agent

来源：[原始页面](https://blog.r6i.it/typesafe-jev-vs-agentic-loop.html) · 状态：`verified`

用途：Q2 / CASCADE / ROUTING / LATENCY / COST / BACKTRACKING

## 摘要

作者把 50 商品分类从 agentic loop 迁到 typed Choice，报告平均 9.62s→1.38s、calls 7.22→3.18，但旧管线用 5 threads、新管线 sequential，作者自己说 7x headline 偏乐观。14 个非一致案例只有一位人工、无 ground truth；结论是 Jev 是 classification primitive，agent loop 保留回溯价值。

## 证据与使用边界

并发条件不同、样本仅 50 商品、人工分歧不能当准确率；成本/时延依赖模型、价格、并发和输出计费，不能据此宣称 7x 收益或 SLA。贪心树搜索会丢失错误上层分支，需单独评估回溯/beam 设计。

## 何时重访

模型、并发、树深度、候选扇出、输出计费或有 ground truth 的分类集变化时复查；对 Q2 只引用相对 trade-off。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
