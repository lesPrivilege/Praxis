---
id: "jc-s05-langchain-jev-agent-evals"
status: "partial"
url: "https://www.langchain.com/blog/jev-agent-evals-langsmith"
---

# Jev-as-a-Judge for Agent Evals

来源：[原始页面](https://www.langchain.com/blog/jev-agent-evals-langsmith) · 状态：`partial`

用途：GRAMMAR / SCALE / SOURCE

## 摘要

LangChain 将 5 条固定 weather agent runs 存为数据集，每条固定行为重复评估 100 次；以一位 human reviewer 的标签作 oracle，报告 Jev 与 GPT-5.6 Luna/Terra/Claude Sonnet 4.6 的一致性、方差、费用和延迟。

## 证据与使用边界

5 条固定轨迹 × 100 是 500 次重复判断，不是 500 个独立任务；低方差不保证正确；一位标注者、LLM judge 配置未固定 temperature/top-p/seed/max tokens，Jev service version 未写入实验元数据。S06 复用该实验，不是第二次独立复现。

## 何时重访

更换 agent/轨迹、人工标注者、模型/服务版本、judge 配置或生产数据分布时；用独立任务和多标注者重新评估。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
