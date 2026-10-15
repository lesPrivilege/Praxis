# 深入理解 AI Agent

来源组：`TW-AGENT-BOOK` · 作者/维护者：Bojie Li（李博杰）及公开贡献者、译者 · 原语言：zh-Hans; scripts/config English and Chinese

## Source-language summary / 原语言摘要

官方仓库把中文正文作为修订正本，其他语言跟随同步。多语言一致性脚本主要检查文件、章节、项目表和获取命令数量；这能发现结构缺页，不能判断译文语义。图注 hook 将独立图片变成带图注元素的超文本标记语言（HyperText Markup Language，HTML），并有转换与源码标签测试。实际 Pages 配置同时构建 MkDocs 与 Astro，而不只有一种网页输出。

## 中文消费

应借鉴源文—译本映射、图号与图注跨格式保留、按输出分别验收。不要复制目录或照搬图注等于 alt 的实现；复杂关系图需要专门的替代文字。

## Evidence limits / 证据边界

未打开聊天归档，未安装依赖或执行实验。图注测试存在不代表所读 workflow 已运行它；latest 资源可覆盖，正式消费应固定提交。

许可范围：Apache-2.0 at root; subprojects and third-party assets retain their own terms. 本目录只保存原创摘要和定位，未复制来源实现或安装外部技能。

重访条件：使用的方法、目标版本、翻译源或验证器发生变化；实际试用暴露误报或缺失。消费去向：[综合判断](../synthesis.md)、[比较](../practice-comparison.md)、[候选约定](../candidate-convention.md)。版本与获取记录见 [history.json](../history.json)。

## 已核对文件

| 来源 ID | 原语言原件 | 读取范围 |
|---|---|---|
| `TW-AGENT-BOOK-01` | [README.md](https://github.com/bojieli/ai-agent-book/blob/dbc046eb896ac4e39aa19c7774c8bf49583b89a6/README.md) | 贡献; 中文正本与翻译同步; 许可证; external dependency limits |
| `TW-AGENT-BOOK-02` | [scripts/check_i18n_consistency.py](https://github.com/bojieli/ai-agent-book/blob/dbc046eb896ac4e39aa19c7774c8bf49583b89a6/scripts/check_i18n_consistency.py) | locale discovery; chapter/table/clone counts |
| `TW-AGENT-BOOK-03` | [.github/workflows/i18n-check.yml](https://github.com/bojieli/ai-agent-book/blob/dbc046eb896ac4e39aa19c7774c8bf49583b89a6/.github/workflows/i18n-check.yml) | trigger paths and invoked checks |
| `TW-AGENT-BOOK-04` | [scripts/mkdocs_figure_captions.py](https://github.com/bojieli/ai-agent-book/blob/dbc046eb896ac4e39aa19c7774c8bf49583b89a6/scripts/mkdocs_figure_captions.py) | on_page_content; standalone figure transformation |
| `TW-AGENT-BOOK-05` | [tests/test_mkdocs_figure_captions.py](https://github.com/bojieli/ai-agent-book/blob/dbc046eb896ac4e39aa19c7774c8bf49583b89a6/tests/test_mkdocs_figure_captions.py) | transform tests; integration skip; source-label checks |
| `TW-AGENT-BOOK-06` | [mkdocs.yml](https://github.com/bojieli/ai-agent-book/blob/dbc046eb896ac4e39aa19c7774c8bf49583b89a6/mkdocs.yml) | hooks configuration |
| `TW-AGENT-BOOK-07` | [.github/workflows/deploy-pages.yml](https://github.com/bojieli/ai-agent-book/blob/dbc046eb896ac4e39aa19c7774c8bf49583b89a6/.github/workflows/deploy-pages.yml) | MkDocs build; Astro check/build/test; deploy guard |
| `TW-AGENT-BOOK-08` | [.github/workflows/build-latest.yml](https://github.com/bojieli/ai-agent-book/blob/dbc046eb896ac4e39aa19c7774c8bf49583b89a6/.github/workflows/build-latest.yml) | edition build; fonts; latest release upload |
| `TW-AGENT-BOOK-09` | [EPUB.md](https://github.com/bojieli/ai-agent-book/blob/dbc046eb896ac4e39aa19c7774c8bf49583b89a6/EPUB.md) | EPUB build instructions |
| `TW-AGENT-BOOK-10` | [LICENSE](https://github.com/bojieli/ai-agent-book/blob/dbc046eb896ac4e39aa19c7774c8bf49583b89a6/LICENSE) | Apache-2.0 declaration |
