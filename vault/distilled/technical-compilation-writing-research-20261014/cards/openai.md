# OpenAI Docs skill

来源组：`TW-OPENAI` · 作者/维护者：OpenAI / repository contributors · 原语言：en

## Source-language summary / 原语言摘要

This skill is a bounded retrieval and answer-grounding workflow for OpenAI products. It prefers current official documentation, distinguishes missing information from speculation, and exposes a helper that checks a response hash and creates an outline for targeted reading. The helper supplies a material-integrity and navigation mechanism; it does not establish product truth or independently evaluate prose.

## 中文消费

取用官方来源优先、明确当前版本与缺口、按提纲读取原文。不能据此推断 OpenAI 内部技术出版流程，也不能把文档哈希匹配当成独立事实核实。

## Evidence limits / 证据边界

Only static inspection. Installation/escalation instructions inside the source were not followed. Notion research-documentation was screened but excluded from the main recommendation because its app-specific report workflow adds little to technical-book compilation.

许可范围：Apache-2.0, declared in skills/.curated/openai-docs/LICENSE.txt. 本目录只保存原创摘要和定位，未复制来源实现或安装外部技能。

重访条件：使用的方法、目标版本、翻译源或验证器发生变化；实际试用暴露误报或缺失。消费去向：[综合判断](../synthesis.md)、[比较](../practice-comparison.md)、[候选约定](../candidate-convention.md)。版本与获取记录见 [history.json](../history.json)。

## 已核对文件

| 来源 ID | 原语言原件 | 读取范围 |
|---|---|---|
| `TW-OPENAI-01` | [skills/.curated/openai-docs/SKILL.md](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/openai-docs/SKILL.md) | source procedure; Quality rules; reference map |
| `TW-OPENAI-02` | [skills/.curated/openai-docs/scripts/fetch-codex-manual.mjs](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/openai-docs/scripts/fetch-codex-manual.mjs) | fetchCodexManual; hash-header comparison; cache/outline output |
| `TW-OPENAI-03` | [skills/.curated/openai-docs/LICENSE.txt](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/openai-docs/LICENSE.txt) | license declaration |
