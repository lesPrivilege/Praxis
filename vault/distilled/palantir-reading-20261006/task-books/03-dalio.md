# 任务书 03 · Dalio《Principles》（2011 版权 PDF）

先读 [通用规则](00-common-rules.md)。你拥有唯一输出文件 `vault/distilled/palantir-reading-20261006/notes/03-dalio.md`。

## 你读的东西

`vault/snapshots/local/palantir-20261006/principles-dalio-2011.pdf`

106 页。`pdftotext` 报：Title `Principles by Ray Dalio`，Author `Ray Dalio`，Creator `Adobe InDesign CC 2015`，CreationDate 2016-03-04。正文首页与页脚均标 Copyright 2011 Ray Dalio。约 61,000 词。

取值方式：

```bash
pdftotext -layout principles-dalio-2011.pdf dalio.txt
```

## 版本边界（最重要的一条）

**这是 2011 年版权的一份 PDF，不是 2017 年的成书《Principles: Life & Work》。** 两者篇幅、分部、许多条目的编号都不一样。你写的每一条都要能让人看出它出自哪一处，而且**不能与 2017 成书混用**。引言里作者自己交代了分布：Part 1 讲原则为什么重要（与他的无关）、Part 2 讲他的人生原则、Part 3 讲 Bridgewater 的管理原则；他建议贡献比最高的读法是读 Part 1、Part 2，以及 Part 3 开头到 Table of Principles 为止，约合五十五页。

另外：当初登记的 URL（`principles.com/assets/artifacts/...Principles.pdf`）**现已失效**，返回的是官网首页。这份副本来自 Internet Archive 2016-10-21 的存档。

## 记什么

按 Part 1 / Part 2 / Part 3 三节走。每节给：

- 这一节回答什么问题（用作者自己的话说，短引文 + 页码）
- 这一节的结构：分几部分、有没有编号体系、编号到什么层级。Part 3 末尾有编号到两百开外的条目与脚注，说明记录的颗粒度即可，**不要逐条抄**
- 三条以内你判断最能代表这一节的原话（短、逐字、带页码）

特别留意，但不要只写这些：

- 引言结尾作者向读者提的两个要求（保持开放，以及诚实地回答关于自己要什么、什么是真的、打算怎么办的三个问题）。照写。
- 组织学习机制：找出原文里讲「如何面对错误与弱点」的那一段主张，记录他的原文表达与所在 Part / 页码。这是本仓库最关心的线索。
- Part 3 里关于「不可妥协之事」的一段，作者举了「让优秀的人回避自己的错误」为例。记录他给的理由。
- 文末是否允许人 opt-out：若写着，逐字记录作者对 opt-out 的态度与理由。

## 不要做

- 不要跨节归纳出「Dalio 的管理哲学」。这一版太长，你的任务是给它画一张能用的地图，不是替它做结论。
- 不要引用 2017 年成书或 principles.com 上现在的内容来「补全」这份 PDF。版本不同就是不同。
- 不要评价 Bridgewater。

## 交付

- `# Dalio · Principles（2011 版权 PDF，106 页）`（取证身份、存取日期 2026-10-06、证据状态 `verified`、来源路径、**版本警告**）
- `## 版本与来源`
- `## Part 1`
- `## Part 2`
- `## Part 3`
- `## 我以为重要`
- `## 未覆盖`（写明哪些 Part、哪些页码没有读）
- `## 重访触发`
- `## 交接摘要`（不超过 300 字）
