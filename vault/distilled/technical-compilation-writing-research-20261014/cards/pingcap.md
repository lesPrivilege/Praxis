# Review Doc PR; Write or Update TiDB Docs; Translation Rules

来源组：`TW-PINGCAP` · 作者/维护者：PingCAP / TiDB documentation contributors · 原语言：en; automated review prompt and target documentation zh-Hans

## Source-language summary / 原语言摘要

TiDB documentation instructions make concrete defaults, ranges, versions and behavior traceable to code, tests, specifications or existing documentation. Translation is tied to an English source change and the target release; missing terminology stays in the source language pending verification. Review covers user consequences and branch applicability before style. The automated workflow calls a separate reviewer action and prompt, so the skill text and the automation are related but distinct artifacts.

## 中文消费

取用逐项事实取证、源文改动映射、版本适用范围和稳定词表。中文翻译要自然，但不能加减前提、警告和事实。未知值先在编辑记录解决，不把占位稿交给最终作者。

## Evidence limits / 证据边界

The automated reviewer uses qiancai/ai-doc-reviewer@main and a configured model, not a deterministic truth check. External action implementation and runtime results were not audited. Chinese terminology remains TiDB-specific.

许可范围：CC BY-SA 3.0 repository LICENSE; no separate license located for the inspected skill files. 本目录只保存原创摘要和定位，未复制来源实现或安装外部技能。

重访条件：使用的方法、目标版本、翻译源或验证器发生变化；实际试用暴露误报或缺失。消费去向：[综合判断](../synthesis.md)、[比较](../practice-comparison.md)、[候选约定](../candidate-convention.md)。版本与获取记录见 [history.json](../history.json)。

## 已核对文件

| 来源 ID | 原语言原件 | 读取范围 |
|---|---|---|
| `TW-PINGCAP-01` | [.agents/skills/review-doc-pr/SKILL.md](https://github.com/pingcap/docs-cn/blob/ade76875749f08fcac9de276639b215ad63294e6/.agents/skills/review-doc-pr/SKILL.md) | Review priorities; Version and branch checks; Suggested review workflow |
| `TW-PINGCAP-02` | [.agents/skills/write-update-tidb-docs/SKILL.md](https://github.com/pingcap/docs-cn/blob/ade76875749f08fcac9de276639b215ad63294e6/.agents/skills/write-update-tidb-docs/SKILL.md) | Ground every fact in the source; English-first vs Chinese-original; Steps 2–3 |
| `TW-PINGCAP-03` | [.agents/shared/translation-rules.md](https://github.com/pingcap/docs-cn/blob/ade76875749f08fcac9de276639b215ad63294e6/.agents/shared/translation-rules.md) | Preserve structure; Terminology; PR traceability |
| `TW-PINGCAP-04` | [.agents/shared/translation-terms.md](https://github.com/pingcap/docs-cn/blob/ade76875749f08fcac9de276639b215ad63294e6/.agents/shared/translation-terms.md) | High-frequency terms; Usage notes |
| `TW-PINGCAP-05` | [.github/workflows/doc_review.yml](https://github.com/pingcap/docs-cn/blob/ade76875749f08fcac9de276639b215ad63294e6/.github/workflows/doc_review.yml) | trigger guard; AI Doc Reviewer step; PROMPT_PATH |
| `TW-PINGCAP-06` | [doc-review-prompt.txt](https://github.com/pingcap/docs-cn/blob/ade76875749f08fcac9de276639b215ad63294e6/doc-review-prompt.txt) | review prompt; source of automated review instructions |
| `TW-PINGCAP-07` | [LICENSE](https://github.com/pingcap/docs-cn/blob/ade76875749f08fcac9de276639b215ad63294e6/LICENSE) | CC BY-SA 3.0 declaration |
