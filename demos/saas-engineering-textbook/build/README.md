# 构建

`node build/build.mjs` 从 `books/saas-engineering` 的正文和 `vault/distilled/saas-engineering-atlas` 的结构数据生成 `site/`。不需要安装依赖：Markdown 解析和图布局用 `vendor/` 里的副本。

| 文件 | 作用 |
|---|---|
| `build.mjs` | 阅读顺序、Markdown 渲染、链接改写、缩写说明、页面外壳、搜索索引 |
| `graph.mjs` | 把正文里的 Mermaid flowchart 和案例拓扑用 dagre 排成静态 SVG |
| `case.mjs` | 每个案例页末尾的结构面板：三种关系视图、节点、生命周期、检查定义、迁移 |
| `figure-brief.md` | 交给图件制作者的施工说明 |
| `review-brief.md` | 交给正文审阅者的审阅说明 |

正文中的 `<!-- figure: id -->……<!-- /figure -->` 指令把 `src/figures/<id>` 的交互图件插到该位置，两条注释之间的 Markdown 是没有脚本和打印时的回退内容。链接到 Books 以外的仓库文件时改写成相对路径，链接失效时构建报错。
