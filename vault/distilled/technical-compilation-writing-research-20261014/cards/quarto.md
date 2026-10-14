# Book Crossrefs; Citations; Managing Execution

来源组：`TW-QUARTO` · 作者/维护者：Posit / Quarto contributors · 原语言：en

## Source-language summary / 原语言摘要

Quarto links chapter, figure and equation identifiers across book outputs and formats bibliographies through Pandoc. Captions and alternative text have separate fields. Freeze reuses computational output during project rendering; the documentation explicitly says external input changes can require a full rerender. Rendering frozen results is therefore different from rerunning the calculation that produced them.

## 中文消费

取用稳定交叉引用、计算与排版分离、图注与替代文字分工。冻结结果必须绑定输入；书目格式正确不代表引用支持主张。暂不为研究更换 SaaS 技术栈。

## Evidence limits / 证据边界

Official docs and examples inspected, not Quarto CLI implementation or a local build. Full offline dependencies and byte-identical output reproducibility were not established.

许可范围：license.qmd identifies CLI MIT from 1.4 onward and separate dependency licenses; inspected page does not resolve a blanket documentation-content license. 本目录只保存原创摘要和定位，未复制来源实现或安装外部技能。

重访条件：使用的方法、目标版本、翻译源或验证器发生变化；实际试用暴露误报或缺失。消费去向：[综合判断](../synthesis.md)、[比较](../practice-comparison.md)、[候选约定](../candidate-convention.md)。版本与获取记录见 [history.json](../history.json)。

## 已核对文件

| 来源 ID | 原语言原件 | 读取范围 |
|---|---|---|
| `TW-QUARTO-01` | [docs/books/book-basics.qmd](https://github.com/quarto-dev/quarto-web/blob/3c41ebe17449fa7e70d714212a75f2b2650eb69d/docs/books/book-basics.qmd) | Overview; Quick Start; Config File opening, lines 1–140 |
| `TW-QUARTO-02` | [docs/books/book-crossrefs.qmd](https://github.com/quarto-dev/quarto-web/blob/3c41ebe17449fa7e70d714212a75f2b2650eb69d/docs/books/book-crossrefs.qmd) | cross-chapter labels; printed output vs hyperlinks |
| `TW-QUARTO-03` | [docs/authoring/citations.qmd](https://github.com/quarto-dev/quarto-web/blob/3c41ebe17449fa7e70d714212a75f2b2650eb69d/docs/authoring/citations.qmd) | bibliography; citation syntax; CSL |
| `TW-QUARTO-04` | [docs/projects/code-execution.qmd](https://github.com/quarto-dev/quarto-web/blob/3c41ebe17449fa7e70d714212a75f2b2650eb69d/docs/projects/code-execution.qmd) | Using Freeze; Cache; Working Dir |
| `TW-QUARTO-05` | [docs/projects/_freeze-basics.md](https://github.com/quarto-dev/quarto-web/blob/3c41ebe17449fa7e70d714212a75f2b2650eb69d/docs/projects/_freeze-basics.md) | freeze true/auto; incremental execution |
| `TW-QUARTO-06` | [docs/computations/execution-options.qmd](https://github.com/quarto-dev/quarto-web/blob/3c41ebe17449fa7e70d714212a75f2b2650eb69d/docs/computations/execution-options.qmd) | Caption and Alt Text; error option; intermediates |
| `TW-QUARTO-07` | [license.qmd](https://github.com/quarto-dev/quarto-web/blob/3c41ebe17449fa7e70d714212a75f2b2650eb69d/license.qmd) | CLI and dependency license scope |
