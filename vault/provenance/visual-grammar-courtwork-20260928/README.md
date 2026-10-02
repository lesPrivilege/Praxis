# Courtwork visual grammar source index

本批是 2026-09-28/29 对本地 Courtwork `main` 的有限、只读召回，服务于视觉语法 demo 的开放创作。它只登记已读实现、合同、测试和两张候选工单；不把 Courtwork 的设计设想当成 Praxis 采纳规范，也不把快照当成可运行应用。

- [sources.json](sources.json)：机器可读来源、定位、大小、mtime、SHA-256、快照路径、发现和边界。
- [有限源快照](../../snapshots/local/visual-grammar-courtwork-20260928/README.md)：按 Courtwork 相对路径保存的必要原件副本。

## 这批材料支持什么

已读实现把三个可分开的语义层放在同一条可回查路径上：Attention 记录人的后续义务、状态和动作回执；Work Core 保存 Matter、Candidate、Artifact、Decision、obligation 与 B1 event log；Model Context 只编译有预算的 Matter/Artifact/source/pending 引用投影，正文通过受约束工具读取。UI 将这些状态投影成列表、详情、动作编辑器、冲突/未知回执和焦点恢复。

需要避免的术语合并：Attention 的 `next_action` 不是 Core 的 `obligation`；Attention 的 `attention_event` 是对象自身的 revision 事件，不等同于 Work Core B1 `event` 表；Context 的 `basis.current` 只表示输入适用性，不授予模型或人类接受权限。

## 可召回的施工入口

FE01（共享 packet fixture 与 Control Grammar）和 FE03（Attention triage、revision/idempotency、丢回执恢复）是已读的两个开放素材入口。两张工单在 Courtwork 当前记录中仍为 `blocked-by-dependencies`；本批只说明其可观察事实和可用合成 fixture，不替它们宣布实现或验收。

## 覆盖边界

来源仓库 `/Users/lesprivilege/Projects/Courtwork` 保持只读。本批未复制 `.git`、`node_modules`、缓存、凭据、个人数据或其他 checkout 的文件，也未登记外部页面为已核实实现。源仓库当前 `main` HEAD、工作树状态、URL 线索、测试命令及未覆盖项都在 `sources.json` 中。
