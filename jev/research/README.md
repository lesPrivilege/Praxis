# 研究登记

Jev 专章每一条事实回到这里。快照日期 2026-10-23。

| 文件 | 内容 |
|---|---|
| [inputs/](inputs/README.md) | 起点材料：原 Chat 与两份 ChatGPT Deep Research 报告，带 hash 与入账记录 |
| [streams/](streams/README.md) | 五条线各自的登记（JSON），探索代理写，主会话不改 |
| [review.json](review.json) | 主会话亲自打开原页核对过的主张，以及来源冲突的裁决 |
| [sources.json](sources.json) | 合并后的全部来源，另含每条线登记的 GPT 出入与缺口；生成文件 |
| [claims.jsonl](claims.jsonl) | 合并后的全部主张，带上 review 记录；生成文件 |
| [corrections.md](corrections.md) | 对 GPT 材料的更正，逐条给出原说法、位置、核实结果与依据 |
| [tools/](tools/README.md) | 合并与引用检查脚本 |

## 五条线

| 线 | 范围 | 来源 | 主张 |
|---|---|---:|---:|
| A · Jev | TypeSafe 文档、博客、定价、版本、企业条款、官方评测 | 34 | 30 |
| B · 生态 | Laya、Kev、Clef、d1、Perplexity、GLiDE、Simple Jev 等的规模、授权、兼容性、自报成绩 | 32 | 64 |
| C · 微调与部署 | 各实现的训练与服务命令、校准、外部成熟做法、训练私有数据的风险条目 | 30 | 43 |
| D · 评测 | 已发表的评测逐项核对，以及 27 个公开 benchmark 的目录 | 72 | 77 |
| E · 企业与数据库 | 公开用法、权限与版本的成熟做法、数据平台的判断函数、语义算子研究 | 68 | 74 |

每条主张记录：来源中的说法、短引文（如有）、定位、数值、测量方（自报或第三方）、限定、状态（confirmed / partial / contradicted / not-found / unverifiable）、它核对的是哪条 GPT 说法。

## 证据状态怎样读

- `status` 是探索代理读来源后的判断；`review.state` 为 `checked` 的，主会话亲自读过原页。
- 大部分网页经摘要式抓取工具读取，`read_scope` 写明了读到哪里。
- 登记不等于采纳：本目录不产生 Kit 规则。

## 执行角色

探索代理为 Claude Sonnet（五个，并行）；主会话与底稿、网页的撰写为 Claude Opus；冷读审阅为一个不带撰写上下文的 Claude Sonnet。未使用 Luna 或 Astra。
