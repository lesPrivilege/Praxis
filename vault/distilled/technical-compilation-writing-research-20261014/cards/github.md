# Copilot content instructions and content linting

来源组：`TW-GITHUB` · 作者/维护者：GitHub / Docs contributors · 原语言：en

## Source-language summary / 原语言摘要

GitHub tells assistants to mark the exact uncertain claim rather than hand over an undifferentiated article requiring review. Reusable content and version metadata reduce duplicate maintenance. The content workflow distinguishes annotations from a failing errors-only check and additionally checks journey pages whose dependencies can break without those pages changing. Strategic content guidance explicitly requires judgment rather than mechanical enforcement.

## 中文消费

取用主张级缺口、受影响入口检查和规则严重度。交给 Claude 前由研究/技术负责人消解未决事实；保留精确问题清单作为例外，不默认把审计责任交给主笔。

## Evidence limits / 证据边界

This is a provider-maintained documentation workflow, not evidence about all GitHub internal writing. Liquid variables and AUTOTITLE are stack-specific. No pipeline or linter was run.

许可范围：Content CC BY 4.0; code MIT, separately declared in LICENSE and LICENSE-CODE. 本目录只保存原创摘要和定位，未复制来源实现或安装外部技能。

重访条件：使用的方法、目标版本、翻译源或验证器发生变化；实际试用暴露误报或缺失。消费去向：[综合判断](../synthesis.md)、[比较](../practice-comparison.md)、[候选约定](../candidate-convention.md)。版本与获取记录见 [history.json](../history.json)。

## 已核对文件

| 来源 ID | 原语言原件 | 读取范围 |
|---|---|---|
| `TW-GITHUB-01` | [.github/instructions/content.instructions.md](https://github.com/github/docs/blob/8b39dc44a066dda794bfacdd25653ff86324ef21/.github/instructions/content.instructions.md) | Accuracy and flagging uncertainty; Reusable text; Versioning |
| `TW-GITHUB-02` | [.github/instructions/content-guidelines.instructions.md](https://github.com/github/docs/blob/8b39dc44a066dda794bfacdd25653ff86324ef21/.github/instructions/content-guidelines.instructions.md) | whole-article context; strategic suggestions |
| `TW-GITHUB-03` | [content/contributing/collaborating-on-github-docs/using-the-content-linter.md](https://github.com/github/docs/blob/8b39dc44a066dda794bfacdd25653ff86324ef21/content/contributing/collaborating-on-github-docs/using-the-content-linter.md) | errors/warnings; expiring content; limited suppression |
| `TW-GITHUB-04` | [.github/workflows/content-lint-markdown.yml](https://github.com/github/docs/blob/8b39dc44a066dda794bfacdd25653ff86324ef21/.github/workflows/content-lint-markdown.yml) | annotation step; errors-only step; journey landing page check |
| `TW-GITHUB-05` | [LICENSE](https://github.com/github/docs/blob/8b39dc44a066dda794bfacdd25653ff86324ef21/LICENSE) | content license |
| `TW-GITHUB-06` | [LICENSE-CODE](https://github.com/github/docs/blob/8b39dc44a066dda794bfacdd25653ff86324ef21/LICENSE-CODE) | code license |
