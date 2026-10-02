---
id: "s08-open-deep-research"
status: "partial"
---

# Open Deep Research

状态：4 个链接，主会话读了 2 个。许可（研究包自述）：MIT（项目已归档）。

## 研究包取什么，不取什么

取：独立子问题才并行；每轮按证据缺口重选查询；压缩时保留结论到来源的关系。

不取：固定来源数、查询次数、搜索接口。

## 逐链接

| 编号 | 链接 | 状态 | 本仓库读到的 |
|---|---|---|---|
| K32 | [prompts](https://github.com/langchain-ai/open_deep_research/blob/1b7d2e80db9faa586165c60e09096dbbfd483a64/src/open_deep_research/prompts.py) | `unverified` | 未打开 |
| K33 | [异常分支](https://github.com/langchain-ai/open_deep_research/blob/1b7d2e80db9faa586165c60e09096dbbfd483a64/src/open_deep_research/deep_researcher.py#L331-L343) | `verified` | 主会话读了这一段：异常分支的条件末尾是 or True，任何异常都走“结束研究阶段”。仓库当日为归档状态。 |
| K34 | [#283最小复现](https://github.com/langchain-ai/open_deep_research/issues/283) | `verified` | 主会话查了状态与标题：open，标题说 supervisor_tools 把子研究的任何异常当作研究成功完成。 |
| K35 | [MIT许可](https://github.com/langchain-ai/open_deep_research/blob/1b7d2e80db9faa586165c60e09096dbbfd483a64/LICENSE) | `unverified` | 未打开 |

没有打开的链接，内容以研究包 [sources.md](../../../snapshots/local/community-grammar-20261002/sources.md)记的读取范围为准，本仓库没有核对。

## 何时重访

要据这组来源在 Kit 里写规则、上游改动、或研究包的结论被真实任务推翻时。

研究包正文见 [快照](../../../snapshots/local/community-grammar-20261002/community-grammar-review.md)，机器登记见 [`../catalog.json`](../catalog.json)。
