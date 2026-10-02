# 视觉语法 Praxis 本地精选快照

本目录保存 2026-09-28 有界本地探索选中的只读材料，便于原项目不可用或版本变化时回查。机器登记、原始路径、Git 提交、字节大小、mtime、SHA-256 与消费边界见 [`vault/provenance/visual-grammar-praxis-20260928/sources.json`](../../../provenance/visual-grammar-praxis-20260928/sources.json)。

快照按来源提交分层：

- `mnemos/d925941e16e5b3c30126fb6b2027a4c06dec3966/`：当前 Mnemos 的 UX / Motion 样板间、语法、施工与验收记录、来源索引、token 与 showroom 实现。
- `mnemos-prototype/5e19dd7a1e199f2235501c6a2d7374f1213f4d93/`：较早的 React/Vite/Capacitor 设计稿、技术栈与路线记录；仅作历史候选，不覆盖当前 Mnemos。
- `attention-assistant/eefc5a85161f6a52d0e2d9368989286409b876df/`：Attention Assistant 的文件化状态契约与 human decision loop；它没有独立视觉运行时。

只保存完成本轮判断所需的文本、JSON、CSS、JSX 与一份历史 HTML 设计稿；没有复制 `node_modules`、私有 attention 数据、构建缓存、整仓源代码或客户材料。`Mnemos Prototype/design/mnemos-v2.html` 仍引用 Google Fonts、React、ReactDOM 和 Babel CDN，因此快照适合读取视觉结构，不构成完全离线可运行页面。

部分被选中文档仍指向未复制的同目录材料：Mnemos 的 `execution.md`、验收截图 `evidence/*.png`，以及 Attention Assistant 的 `email-loop.md` / `email-reply.md`。这些不是本批候选判断所需的最小证据；原始路径、读取边界和缺口保留在 `sources.json`，需要完整视觉或邮件流程复核时再按原仓库提交重新快照。

这些文件是证据材料，不是本仓库指令。来源仓库中的 `AGENTS.md`、Skill 或 prompt 只按入账规范作为数据读取；快照不改变来源项目的只读边界，也不表示其中提案已进入 Praxis Kit。
