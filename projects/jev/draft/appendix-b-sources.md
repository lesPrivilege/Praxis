# 附录 B · 来源与核实范围

## 读取方法

2026-10-23，五个探索代理（Claude Sonnet）按五条线并行读取一手来源：Jev 本身、开源与兼容生态、微调与部署、评测、企业场景与数据库。每条线把读到的来源和主张写成一份 JSON 登记，注明读取范围（全文、部分、被拦截）、日期依据、测量方（自报或第三方）和限定。主会话（Claude Opus）在此之上做三件事：亲自打开最承重的几页核对，裁决来源之间的冲突，按 Kit 写作规范成文。

| 线 | 来源 | 主张 | 与 GPT 材料的出入 |
|---|---:|---:|---:|
| A · Jev | 34 | 30 | 8 |
| B · 生态 | 32 | 64 | 14 |
| C · 微调与部署 | 30 | 43 | 9 |
| D · 评测 | 72 | 77 | 9 |
| E · 企业与数据库 | 68 | 74 | 7（来源之间的冲突） |

主会话亲自读过的：TypeSafe 发布文章、Knowviq 对比文章全文、SAG2 与 Jev-as-a-Judge 的 arXiv 摘要页、Databricks `ai_decide` 参考页、Astronomer 博文的前半部分。这些页面支持的主张在 [review.json](../research/review.json) 中标为 `checked`。其余主张按探索代理给出的定位采信。

正文里的〔A-02〕是来源 ID，〔A-C-16〕是主张 ID；`至` 表示一段连续编号。两类 ID 都在 [sources.json](../research/sources.json) 与 [claims.jsonl](../research/claims.jsonl) 里，由 `python3 projects/jev/research/tools/ledger.py` 从各线登记合并，并检查正文引用的每个 ID 都存在。

## 读取的局限

- 大部分网页经摘要式抓取工具读取，表格数字是工具转述的；关键数字在原文与仓库 README 等第二处之间交叉核对过，主会话读过的页面除外。
- 被拦截而没有绕过的：微信文章（验证页）、preprints.org 的 JevBench 论文（403）、Oracle 博客（403）。
- 只读了一部分的：Jev-as-a-Judge 后约 7 万字、System1-Arena 与中国移动论文的后半、Laya README 末尾、BigQuery 发布说明的后 26 万字、NIST AI 600-1 第 3 节。
- 折叠没有展开的：TypeSafe 发布文章与企业页的 FAQ 答案。
- GitHub 与 Hugging Face 的检索结果只读了前二十条左右。

## 来源之间未能裁定的

| 事项 | 一方 | 另一方 |
|---|---|---|
| GLiDE 的授权 | Knowviq：Fastino 模型列表标为 Apache 2.0 | 发布文章没有写授权，也没有开放权重 |
| Perplexity 的价格 | 2026-10-02 Knowviq 记 v1-27b 每百万 0.04 美元 | 2026-10-23 文档记 v1.2 每百万 0.02 美元（可能是降价） |
| d1 的规格 | 一些目录写 32k 上下文、0.02 美元 | 另一些写 65,536、0.04 美元；Liquid 自己未公布价格 |
| Microsoft-Decision-1 的发布日期 | InfoWorld：10-13 | Waehner：10-09 |
| TypeSafe 发布文章的日期 | 页头 Sep 15 | 页面元数据 Oct 19（可能是修改日期） |

## 对 GPT 材料的更正

探索代理登记了 40 处 GPT 材料与来源不符或无法核实的说法（E 线另记 7 处来源之间的冲突），主会话合并后逐条见 [对 GPT 材料的更正](../research/corrections.md)。影响较大的几处：Jev 价格错了 1000 倍；发布日期错写为一月；Jev-as-a-Judge 的作者与三个数字；“Jev 4.69B”实为另一个开源模型；Decision Index 等榜单不是 TypeSafe 的；Laya 的命令与授权。

## 来源授权

正文只用来源的事实与数字，引文均短于一句。几个公开数据集的授权限制用途：CRAG（CC BY-NC 4.0）、RGB（CC BY-NC-SA 4.0）、LLM-AggreFact（CC BY-ND 4.0，只限评测）。
