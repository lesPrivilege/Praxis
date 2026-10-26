# 构建

`node build/build.mjs` 从 `projects/books/saas-engineering` 的正文和 `vault/distilled/saas-engineering-atlas` 的结构数据生成 `site/`。不需要安装依赖：Markdown 解析和图布局用 `vendor/` 里的副本。

| 文件 | 作用 |
|---|---|
| `build.mjs` | 阅读顺序、Markdown 渲染、链接改写、缩写说明、页面外壳、搜索索引 |
| `stage.mjs` | 把渲染好的页面排成标题卡与场景：每个二级标题一场，另把单独成段的等式、“A → B → C”链、按 1、2、3 编号的路线表和“误用反例。”一类加粗标签段落换成对应的版式；只改呈现，不改字 |
| `graph.mjs` | 把正文里的 Mermaid flowchart 和案例拓扑用 dagre 排成静态 SVG |
| `case.mjs` | 案例标题卡上的角色与系统清单；页末的结构面板：三种关系视图、节点、生命周期状态轨与转换表、检查定义、迁移 |
| `figure-brief.md` | 交给图件制作者的施工说明 |
| `drawing-brief.md` | 交给静态图绘制者的施工说明：类名、尺寸、分步出现 |
| `relation-brief.md` | 交给认领章节的编辑：找出有形状的段落、画出它的关系、改写否定式陈述 |
| `review-brief.md` | 交给正文审阅者的审阅说明 |

正文中的 `<!-- figure: id -->……<!-- /figure -->` 指令把 `src/figures/<id>` 的交互图件插到该位置，两条注释之间的 Markdown 是没有脚本和打印时的回退内容。链接到 Books 以外的仓库文件时改写成相对路径，链接失效时构建报错。
