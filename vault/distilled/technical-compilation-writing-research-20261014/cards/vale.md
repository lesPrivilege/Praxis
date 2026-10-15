# Vale: configurable prose linting

来源组：`TW-VALE` · 作者/维护者：Joseph Kato / Vale contributors · 原语言：en

## Source-language summary / 原语言摘要

Vale offers configurable prose checks rather than a universal writing standard. The inspected conditional rule can relate matched expressions and scopes; substitution rules can flag terminology variants. Actual rule implementation and tests make this a useful contrast to prompts. A presence relation is not automatically a check that an acronym was correctly explained before its first meaningful use.

## 中文消费

适合试验稳定术语和局部机械检查。中文分词、缩写豁免、代码保护及误报须用本书材料校准；不导入英语可读性分数或自动改写风格包。

## Evidence limits / 证据边界

No binary, package or style pack was installed. No Chinese quality benchmark or claimed adopter deployment was independently checked.

许可范围：MIT repository LICENSE. 本目录只保存原创摘要和定位，未复制来源实现或安装外部技能。

重访条件：使用的方法、目标版本、翻译源或验证器发生变化；实际试用暴露误报或缺失。消费去向：[综合判断](../synthesis.md)、[比较](../practice-comparison.md)、[候选约定](../candidate-convention.md)。版本与获取记录见 [history.json](../history.json)。

## 已核对文件

| 来源 ID | 原语言原件 | 读取范围 |
|---|---|---|
| `TW-VALE-01` | [README.md](https://github.com/errata-ai/vale/blob/cfb21a4ce87238bcfb44b90e8e0db9e0e91d6c09/README.md) | Why Vale; Quickstart; maintainer attribution |
| `TW-VALE-02` | [.vale.ini](https://github.com/errata-ai/vale/blob/cfb21a4ce87238bcfb44b90e8e0db9e0e91d6c09/.vale.ini) | StylesPath; Packages; BasedOnStyles |
| `TW-VALE-03` | [internal/check/conditional.go](https://github.com/errata-ai/vale/blob/cfb21a4ce87238bcfb44b90e8e0db9e0e91d6c09/internal/check/conditional.go) | Conditional; Second capture groups; In scope |
| `TW-VALE-04` | [internal/check/conditional_test.go](https://github.com/errata-ai/vale/blob/cfb21a4ce87238bcfb44b90e8e0db9e0e91d6c09/internal/check/conditional_test.go) | same-block and cross-scope tests |
| `TW-VALE-05` | [internal/check/substitution.go](https://github.com/errata-ai/vale/blob/cfb21a4ce87238bcfb44b90e8e0db9e0e91d6c09/internal/check/substitution.go) | substitution rule implementation |
| `TW-VALE-06` | [LICENSE](https://github.com/errata-ai/vale/blob/cfb21a4ce87238bcfb44b90e8e0db9e0e91d6c09/LICENSE) | MIT declaration |
