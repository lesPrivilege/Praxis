# Docs Writer and Auditing the Docset

来源组：`TW-GEMINI` · 作者/维护者：Google / Gemini CLI contributors · 原语言：en

## Source-language summary / 原语言摘要

The writer reads implementation and related pages, repairs incoming links when headings change, and regenerates derived references. The audit reference separates editorial findings, undocumented-feature discovery and implementation decisions. A checked-in weekly workflow activates docs-writer and proposes a pull request. This connects the protocol to configured automation; it does not show that a particular run succeeded or that its findings were correct.

## 中文消费

取用代码→文档影响检查、生成参考页回到生成器、逐条接受/改写/拒绝审阅意见。英语人称、80 字符换行和每标题后引介段属于项目风格，不能移成中文成书硬规则。

## Evidence limits / 证据边界

The workflow grants write capabilities and depends on credentials; none was invoked. The skill asks before formatting while the audit reference instructs formatting directly: instructions are contextual, not one universal execution policy.

许可范围：Apache-2.0 in repository LICENSE. 本目录只保存原创摘要和定位，未复制来源实现或安装外部技能。

重访条件：使用的方法、目标版本、翻译源或验证器发生变化；实际试用暴露误报或缺失。消费去向：[综合判断](../synthesis.md)、[比较](../practice-comparison.md)、[候选约定](../candidate-convention.md)。版本与获取记录见 [history.json](../history.json)。

## 已核对文件

| 来源 ID | 原语言原件 | 读取范围 |
|---|---|---|
| `TW-GEMINI-01` | [.gemini/skills/docs-writer/SKILL.md](https://github.com/google-gemini/gemini-cli/blob/a6321abb69aa877288417f6eb85a7acc0165ea1f/.gemini/skills/docs-writer/SKILL.md) | Preparation; Verification; Links; Formatting |
| `TW-GEMINI-02` | [.gemini/skills/docs-writer/references/docs-auditing.md](https://github.com/google-gemini/gemini-cli/blob/a6321abb69aa877288417f6eb85a7acc0165ea1f/.gemini/skills/docs-writer/references/docs-auditing.md) | Editor Audit; Software Engineer Audit; Technical Writer Implementation |
| `TW-GEMINI-03` | [.github/workflows/docs-audit.yml](https://github.com/google-gemini/gemini-cli/blob/a6321abb69aa877288417f6eb85a7acc0165ea1f/.github/workflows/docs-audit.yml) | schedule; run-gemini-cli prompt; create-pull-request |
| `TW-GEMINI-04` | [package.json](https://github.com/google-gemini/gemini-cli/blob/a6321abb69aa877288417f6eb85a7acc0165ea1f/package.json) | docs:settings; docs:keybindings; format scripts |
| `TW-GEMINI-05` | [LICENSE](https://github.com/google-gemini/gemini-cli/blob/a6321abb69aa877288417f6eb85a7acc0165ea1f/LICENSE) | license declaration |
