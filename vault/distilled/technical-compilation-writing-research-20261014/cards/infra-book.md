# 深入理解 AI Infra：量化分析与系统设计

来源组：`TW-INFRA-BOOK` · 作者/维护者：Bojie Li（李博杰）及公开贡献者、译者 · 原语言：zh-Hans; scripts/config English and Chinese

## Source-language summary / 原语言摘要

本书把资料保全、教学单元修订、全章阅读和出版检查分开。教学计划关注概念引入、贯穿算例、条件变化、跨章分工及图文连续性；第 4 章记录展示了具体删重与补定义。配套脚本能检查部分结构、数值和来源身份。最终配置确实连接网站、可移植文档格式（Portable Document Format，PDF）与电子出版物格式（Electronic Publication，EPUB）构建，但没有把每份历史审阅脚本都变成发布门槛。

## 中文消费

最有价值的是编订工作和可检查对象的对应关系，详见正文的配置核对。来源原件可得、技术事实成立、读者学会与排版通过须分开报告。

## Evidence limits / 证据边界

历史第 4 章报告的 source_sha256 与当前稿不同；不能拿历史通过状态证明当前稿。未重跑作者报告的计算或渲染；教学计划引用的参考教材未由本研究阅读全文。

许可范围：原创正文、配图与配套代码 Apache-2.0；第三方代码、字体、模板和参考材料各自许可。 本目录只保存原创摘要和定位，未复制来源实现或安装外部技能。

重访条件：使用的方法、目标版本、翻译源或验证器发生变化；实际试用暴露误报或缺失。消费去向：[综合判断](../synthesis.md)、[比较](../practice-comparison.md)、[候选约定](../candidate-convention.md)。版本与获取记录见 [history.json](../history.json)。

## 已核对文件

| 来源 ID | 原语言原件 | 读取范围 |
|---|---|---|
| `TW-INFRA-BOOK-01` | [README.md](https://github.com/bojieli/ai-infra-book/blob/3bdcb4fcab73010eeaccf31cc10a8242a895d82e/README.md) | 正文唯一来源; 许可; 版本与格式 |
| `TW-INFRA-BOOK-02` | [references/README.md](https://github.com/bojieli/ai-infra-book/blob/3bdcb4fcab73010eeaccf31cc10a8242a895d82e/references/README.md) | 开头资料库规则，lines 1–29；未逐项核查全部书目 |
| `TW-INFRA-BOOK-03` | [archive/reviews/book-teaching-plan-2026-09-10/README.md](https://github.com/bojieli/ai-infra-book/blob/3bdcb4fcab73010eeaccf31cc10a8242a895d82e/archive/reviews/book-teaching-plan-2026-09-10/README.md) | 十条编辑原则; 跨章重复; 实施顺序; 验收 |
| `TW-INFRA-BOOK-04` | [research/ch04-whole-chapter-review-2026-09-11/README.md](https://github.com/bojieli/ai-infra-book/blob/3bdcb4fcab73010eeaccf31cc10a8242a895d82e/research/ch04-whole-chapter-review-2026-09-11/README.md) | 全章修订说明与上游自报检查 |
| `TW-INFRA-BOOK-05` | [research/ch04-whole-chapter-review-2026-09-11/check.py](https://github.com/bojieli/ai-infra-book/blob/3bdcb4fcab73010eeaccf31cc10a8242a895d82e/research/ch04-whole-chapter-review-2026-09-11/check.py) | figure/footnote/link/duplicate/arithmetic assertions |
| `TW-INFRA-BOOK-06` | [research/ch04-whole-chapter-review-2026-09-11/validation.json](https://github.com/bojieli/ai-infra-book/blob/3bdcb4fcab73010eeaccf31cc10a8242a895d82e/research/ch04-whole-chapter-review-2026-09-11/validation.json) | source_sha256 and reported checks |
| `TW-INFRA-BOOK-07` | [scripts/verify_core_principles.py](https://github.com/bojieli/ai-infra-book/blob/3bdcb4fcab73010eeaccf31cc10a8242a895d82e/scripts/verify_core_principles.py) | chapter endings; footnotes; figure index; source hashes |
| `TW-INFRA-BOOK-08` | [scripts/README.md](https://github.com/bojieli/ai-infra-book/blob/3bdcb4fcab73010eeaccf31cc10a8242a895d82e/scripts/README.md) | verify_outline is historical, not a release gate |
| `TW-INFRA-BOOK-09` | [.github/workflows/book-site.yml](https://github.com/bojieli/ai-infra-book/blob/3bdcb4fcab73010eeaccf31cc10a8242a895d82e/.github/workflows/book-site.yml) | website/pdf/EPUB/release jobs and triggers |
| `TW-INFRA-BOOK-10` | [book/README.md](https://github.com/bojieli/ai-infra-book/blob/3bdcb4fcab73010eeaccf31cc10a8242a895d82e/book/README.md) | single manuscript; build records; output description |
| `TW-INFRA-BOOK-11` | [book/build_pdf.py](https://github.com/bojieli/ai-infra-book/blob/3bdcb4fcab73010eeaccf31cc10a8242a895d82e/book/build_pdf.py) | source_ref and source SHA-256 report, lines 26–132 |
| `TW-INFRA-BOOK-12` | [book/check_ci_pdf.py](https://github.com/bojieli/ai-infra-book/blob/3bdcb4fcab73010eeaccf31cc10a8242a895d82e/book/check_ci_pdf.py) | chapters/text/fonts/reference placeholder checks and previews |
| `TW-INFRA-BOOK-13` | [manuscripts/04-加速器架构.md](https://github.com/bojieli/ai-infra-book/blob/3bdcb4fcab73010eeaccf31cc10a8242a895d82e/manuscripts/04-%E5%8A%A0%E9%80%9F%E5%99%A8%E6%9E%B6%E6%9E%84.md) | bytes/hash only for report-version comparison; no full technical audit |
| `TW-INFRA-BOOK-14` | [LICENSE](https://github.com/bojieli/ai-infra-book/blob/3bdcb4fcab73010eeaccf31cc10a8242a895d82e/LICENSE) | Apache-2.0 declaration |
