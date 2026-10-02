# SourceWeft HTML Slides runtime catalog

状态：verified-primary-web · supplemental-reference  
original URL：<https://github.com/SourceWeft/SourceWeft/blob/main/packages/builtin-skill-html-slides/runtime/catalog.json?utm_source=chatgpt.com>  
canonical URL：<https://github.com/SourceWeft/SourceWeft/blob/main/packages/builtin-skill-html-slides/runtime/catalog.json>  
pinned URL：<https://raw.githubusercontent.com/SourceWeft/SourceWeft/f88212b91216267f3dc1053f9424010cae9de5b6/packages/builtin-skill-html-slides/runtime/catalog.json>  
source commit：f88212b91216267f3dc1053f9424010cae9de5b6

## 是什么

catalog.json 以 schemaVersion、html-ppt-skill 与 reveal.js 上游提交引用，以及 themes、layouts、effects、animations 数组，提供机器可读的可用项目录。

## 可消费语义

它适合让 consumer 先从真实枚举中选择，再展开对应 layout/theme/reference；目录承担发现和版本线索，不承担设计裁决。

## 边界

目录不证明每个实现文件、视觉质量、可访问性、兼容性或运行结果。Praxis 只可把它当 machine index 的参照，不把它当长期 Kit 规范。

证据：SW-HS-CATALOG-01；访问：2026-09-28。
