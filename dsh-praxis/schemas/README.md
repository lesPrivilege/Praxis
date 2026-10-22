# Schemas · 草案

五种对象的 JSON Schema（draft 2020-12），字段含义见 [对象与操作](../objects.md)。状态：草案，还没有数据按它存储，也没有程序读取。

| 文件 | 对象 |
|---|---|
| [common](common.schema.json) | ID、版本、路径、description、修改记录与 review 的共用定义 |
| [kit-unit](kit-unit.schema.json) | Task、Writing、Design、Publish 的单元 |
| [task-type](task-type.schema.json) | 任务类型 |
| [source](source.schema.json) | 来源（素材第 2、4 级） |
| [binding](binding.schema.json) | 来源挂到单元上的关系（素材第 1、3 级） |
| [material-revision](material-revision.schema.json) | 原件与资产的一个版本（素材第 5 级） |

[examples.json](examples.json) 给每种对象一个取自仓库现有内容的实例：证据底线、作者语体、设计判断契约、讲解页编排、口播旁白五个单元，技术说明任务类型，APG Accordion 来源及其一条 Binding，本次入账的评审记录快照。实例里的单元 ID 是草案写法；实现里单元 ID 是层名加页面路径（如 `writing/organization/mechanism`），见 [core](../core/README.md)。

六个 schema 本身合法，十个实例全部通过，实例里的正文路径、来源卡与快照 hash 都能在仓库里找到；校验方式与时间记在 [CHANGELOG](../../CHANGELOG.md)。仓库检查脚本不跑这项校验；core 写入时只检查关键字段（见 [materials.js](../core/materials.js)），不按 schema 全量校验。

Preset、Run、Artifact 在第一条流水线跑通时起草。
