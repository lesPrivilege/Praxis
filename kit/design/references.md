# 设计参考索引

本文件保留为 Design 参考索引的兼容入口。原来的大表已按任务分成 [内容与数据可视化编排](references/composition.md)、[产品软件界面](references/interface.md)、[设计系统与前端参考](references/systems.md) 和 [参考产出与样张](references/specimens.md) 四个分支；稳定 ID、状态、语义、边界、证据和历史定位保留在对应分支。新任务先读[分支 README](references/README.md)。

## 四类路由

| 路由 | 适用任务 | 稳定 ID |
|---|---|---|
| [内容与数据可视化编排](references/composition.md) | 内容关系、数据图、章节导航、动效、版式与反模式观察 | C01–C25 |
| [产品软件界面](references/interface.md) | 控件尺寸、缩放、对象状态、界面层级与 conceptual donor | U01–U09 |
| [设计系统与前端参考](references/systems.md) | 需要逐 URL 查原文入口、来源证据和重访条件 | `ref-*` |
| [参考产出与样张](references/specimens.md) | 对照已完成答卷的结构、媒介和验收线索 | P01 |

## 兼容说明

旧的 `kit/design/references.md` 路径仍可作为入口，便于既有 README、grammar 和项目文档继续导航；详细条目已不在此重复维护。按稳定 ID 回查时使用对应分支中的表格和小节：C01–C25 见 [composition](references/composition.md)，U01–U09 见 [interface](references/interface.md)，`ref-*` 见 [systems](references/systems.md)，P01 见 [specimens](references/specimens.md)。

`accepted` 表示本地消费处置，不表示来源主张已经核实，也不表示当前实现或渲染已经通过。`verified`、`partial` 是 URL 卡片的来源证据状态，和 Kit 的采纳状态分开。状态沿用 [状态词表](../../docs/governance/status-vocabulary.md)；标为在线读取的来源没有保存正文快照，引用前需重新核对。外部参考的语义解释见 [Design reference semantics](../../vault/distilled/design-reference-semantics/README.md)。

## 维护边界

- 外部 URL 每条只在 `vault/references` 或 `vault/provenance` 的一个 canonical 位置登记；Design 分支只提供消费摘要和路由。
- 先登记 source，再写 candidate；只有完成本地消费、明确边界和验证位置后才改为 accepted。历史 accepted 不自动扩散到新的 artifact。
- 新的页面、视频或交互输出应回写自己的项目 index；跨项目重复消费并有独立证据后，再由 Astra 决定是否回流 [Design 语法](grammar.md) 或本目录。
- 答卷 profile、单次 Opus 样本、参考网站风格和未重读的外部页面保留 reference/profile 状态，不写成长期事实。

详细的任务路由、原文回查和样张比较方式见 [references/README.md](references/README.md)。
