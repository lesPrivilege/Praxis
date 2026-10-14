# sphinx.ext.doctest — Test snippets in the documentation

来源组：`TW-SPHINX` · 作者/维护者：Sphinx team / contributors · 原语言：en

## Source-language summary / 原语言摘要

Doctest groups setup and example code with expected output. The implementation compares outputs and propagates failures; setup and skip behavior matter. The translation documentation treats messages as source-derived units. These are mature mechanisms for keeping examples and translations connected to source changes, but they depend on explicit configuration and test coverage.

## 中文消费

取用例题输入—执行—期望输出的契约。不要为了它更换整个教材框架；已有 Python 合成脚本可先与正文数值绑定。跳过检查、隐藏 setup 和只测试片段要在回执可见。

## Evidence limits / 证据边界

No Sphinx build or doctest executed. Agreement with an expected output does not validate the model assumptions, provider behavior or learner comprehension.

许可范围：Repository license declares code BSD-2-Clause; documentation-specific reuse scope not separately resolved here. 本目录只保存原创摘要和定位，未复制来源实现或安装外部技能。

重访条件：使用的方法、目标版本、翻译源或验证器发生变化；实际试用暴露误报或缺失。消费去向：[综合判断](../synthesis.md)、[比较](../practice-comparison.md)、[候选约定](../candidate-convention.md)。版本与获取记录见 [history.json](../history.json)。

## 已核对文件

| 来源 ID | 原语言原件 | 读取范围 |
|---|---|---|
| `TW-SPHINX-01` | [doc/usage/extensions/doctest.rst](https://github.com/sphinx-doc/sphinx/blob/b04a2101295ac3fb725b16111eda0284b6da4cca/doc/usage/extensions/doctest.rst) | groups; setup; doctest/testcode/testoutput; skip options |
| `TW-SPHINX-02` | [sphinx/ext/doctest.py](https://github.com/sphinx-doc/sphinx/blob/b04a2101295ac3fb725b16111eda0284b6da4cca/sphinx/ext/doctest.py) | test_group; runner results; setup failure |
| `TW-SPHINX-03` | [doc/usage/advanced/intl.rst](https://github.com/sphinx-doc/sphinx/blob/b04a2101295ac3fb725b16111eda0284b6da4cca/doc/usage/advanced/intl.rst) | gettext translation workflow |
| `TW-SPHINX-04` | [LICENSE.rst](https://github.com/sphinx-doc/sphinx/blob/b04a2101295ac3fb725b16111eda0284b6da4cca/LICENSE.rst) | code license declaration |
