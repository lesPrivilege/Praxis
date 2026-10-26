# SaaS 工程全景教材站点生成器（多页离线书）

原件：<demos/saas-engineering-textbook/build/build.mjs>

## 是什么

把 Markdown 书稿与结构 JSON 编成多页离线教材：全书目录、标题搜索、上下篇、缩写首现说明、打印样式；Mermaid 在构建时排成静态 SVG 并附文字关系列表；按段落自身的结构投影版式，不改正文。Markdown 解析与图布局的副本在 vendor，不需要安装。

读取范围：读了项目 README 的交付与构建两节和 build.mjs 开头；2026-10-15 至 17 用它产出站点，没有为登记重跑。证据状态：partial。

## 边界

读取路径绑定 projects/books/saas-engineering 与 saas-engineering-atlas 的结构；用户当时尚未目验站点。

## 何时重访

下一次把一份 Markdown 书稿编成离线多页站点时
