# Schemas · 草案

五种对象的 JSON Schema（draft 2020-12），字段含义见 [对象与操作](../objects.md)。状态：草案。数据不按它存储，core 也不读取：写入时只检查关键字段（见 [materials.js](../core/materials.js)），不按 schema 全量校验。

| 文件 | 对象 |
|---|---|
| [common](common.schema.json) | ID、版本、路径、description、修改记录与 review 的共用定义 |
| [kit-unit](kit-unit.schema.json) | Task、Writing、Design、Publish 的单元 |
| [task-type](task-type.schema.json) | 任务类型 |
| [source](source.schema.json) | 来源（素材第 2、4 级） |
| [binding](binding.schema.json) | 来源挂到单元上的关系（素材第 1、3 级） |
| [material-revision](material-revision.schema.json) | 原件与资产的一个版本（素材第 5 级） |

[examples.json](examples.json) 给每种对象一个实例，取自 Praxis 仓库的内容：证据底线、作者语体、设计判断契约、讲解页编排、口播旁白五个单元，技术说明任务类型，APG Accordion 来源及其一条 Binding，一份评审记录的快照。实例里的路径是仓库路径，单元 ID 是草案写法；实现里单元 ID 是层名加页面路径（如 `writing/organization/mechanism`），见 [core](../core/README.md)。2026-10-23 用 `jsonschema` 4.26 校验：六个 schema 合法，十个实例通过，实例里的路径与快照 hash 能在仓库里解析。

草案早于名册的现行存储：binding 草案仍写关系在来源的 `grammar_paths`。现行做法是关系与维护信息都在名册里，见 [名册怎样组成](../objects.md#名册怎样组成)。

SourcePack、KitRevision、Preset、Run、Project、Artifact 没有 schema 草案，实现见 [core](../core/README.md)。
