# ADR-037：dsh-praxis 的分层体例

日期：2026-10-23。状态：accepted（用户在原 Chat 与本次会话中给出方向与三项选择，主会话编订）。主会话（Claude Opus 5.5）独自起草，没有分派代理。

## 问题与依据

用户要在仓库下建 `dsh-praxis/`：一套个人 FDE 工作 Kit，带一个人和 Agent 共同维护的控制面，最终做成 DSH 插件和 MCP。需求来自一段 ChatGPT 讨论，[原 Chat](../../vault/archive/chat/dsh-praxis-control-plane-20261023.md) 与 ChatGPT 起草的评审记录 v0.2 已入账（[登记](../../vault/intake/dsh-praxis-control-plane-20261023.json)）。讨论止于用户第 15 轮：先设计分层体例，Design、Writing 常驻，素材分级最全，Publish 分 video、HTML 等流水线，不同任务类型调用不同的设计范式与写作组织技巧，并问这部分是否该叫 Publish 规范。

本次会话用户另定三项：这一轮只交付体例与迁移映射，不写代码；按任务组织内容的技巧归 Writing；新体例与现有 `kit/` 并行，逐分支迁移，迁完删除旧路径。

## 决定

- **五层分工。** Task 选流水线与方法，Writing 管主张、论证、内容组织、文体、语言与 personal，Design 管表现范式，Publish 按媒介分流水线并负责制作与检查，Materials 管来源与资产。正文在 [分层体例](../../dsh-praxis/layers.md)。
- **内容组织归 Writing，媒介编排归 Publish。** 判别办法是换一种媒介这条做法是否还成立。现在 Write 之下的 Publish 与 Motion 升为顶层 Publish 的 html 与 video 流水线；讲解页编排按此拆到两处。
- **常驻只指入口。** Writing 与 Design 的入口 description、底线和路由每次都在上下文，正文按 Task 展开。各层单元统一三级展开（入口、正文、范例与参考）；Materials 分五级。评审记录里 Writing 的 L0–L4 不单独保留，语言分支和 personal 维度并入三级结构。
- **Agent 按范例为日常维护主路径。** 有效修改直接生效，保留依据与前后版本，并发写入以读取版本比对；改变字段含义、对象身份或消费接口才走 ADR。对象、操作、目录控件与现有数据的对应见 [对象与操作](../../dsh-praxis/objects.md)，草案 schema 在 [Schemas](../../dsh-praxis/schemas/README.md)。
- **Reporting 归 Task。** 现有 `kit/reporting` 讲的是材料目的与组织动作，是任务层的 brief 方法；用户自己的报告流水线是另一回事，以后作为独立存储的模块接入。
- **并行迁移，迁完即删。** 顺序 Writing → Task → Publish → Materials 数据层与 Design 一起，见 [迁移映射](../../dsh-praxis/migration.md)。历史记录只改链接目标，不改正文。
- **只建有内容的目录。** 评审记录提议的七个子目录，这一轮只建 `schemas/`；其余在对应切片开始时建立。仓库检查覆盖 `dsh-praxis/`。

## 没有进入的

- Agent 从行为推断 personal 偏好后进候选队列。原 Chat 第 14 轮已撤回它作为常规维护的默认，学习策略以后单独定义。
- Preset、Run、Artifact 的字段，后台常驻执行，裸文件编辑作为一等入口，个人数据根目录与 Git 跟踪方式。都要等第一条流水线或数据层切片的真实需求再定。
- 原 Chat 引用的 DSH 文档与 Zotero、Quarto、Remotion、Dagster 页面。本次未打开，登记为仅被引用；实现时逐条入账。

## 与既有决定的关系

延续 [ADR-019](019-expression-owners-and-entry-paths.md) 的表达归属，把其中 Write 下的 Publish 与 Motion 升为独立的 Publish 层；延续 [ADR-022](022-source-card-ownership.md) 的来源卡归属和 [ADR-029](029-design-writing-reference-encyclopedia.md) 的来源与可选 grammar 双向连接，后者的连接在新体例里由 Binding 承载。旧 ADR 的正文不改。

体例还没有经过真实任务走读，也没有对照。第一次 Writing 迁移后用一件真实写作任务从新入口走一遍；三级展开让选路变慢，或“换媒介是否成立”在某条做法上判不清时，重访本决定。
