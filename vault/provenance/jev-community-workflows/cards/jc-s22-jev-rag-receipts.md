---
id: "jc-s22-jev-rag-receipts"
status: "verified"
url: "https://dev.to/kike/how-i-went-from-trust-me-bro-to-boomer-with-receipts-using-jev-2141"
---

# RAG ranking is not the same as judging with Jev

来源：[原始页面](https://dev.to/kike/how-i-went-from-trust-me-bro-to-boomer-with-receipts-using-jev-2141) · 状态：`verified`

用途：Q4 / RAG / RELEVANCE / EVIDENCE_SUPPORT / INJECTION / RECEIPTS / CALIBRATION

## 摘要

Zerikai Memory 作者把 RAG 的 lexical ranking 与 Jev judging 分开：L2/lexical 先召回排序，Jev 批量判断每段 relevant/evidence/contradicts/injection 及全局 coverage/conflict，代码决定 keep/drop，最后给 synthesis LLM receipts。53 calls、约 210k input tokens 的 early-access 试验中，5 candidates 保留 3；作者明确集成未公开、阈值小样本校准，尚未做 post-synthesis faithfulness guard。

## 证据与使用边界

不是独立准确率样本，53 次调用不等于 53 个独立任务；集成未发布、阈值是作者自定且边界会翻转；只证明输入证据筛选，不证明最终答案忠实，后合成审查仍未实现。

## 何时重访

集成公开、retrieval candidate distribution、threshold calibration 或 post-synthesis guard 更新时复查；实践地图保留 support/relevance/injection 分离。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
