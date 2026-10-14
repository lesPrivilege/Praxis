# SaaS 工程全景 · 来源

这里按 canonical URL 汇集材料，保留每个来源 ID、每条主张及各次读取范围。相同页面上的不同主张仍各自带限定；原页面失败与替代材料成功可以同时存在。

| 需要查什么 | 入口 |
|---|---|
| 一手材料的贡献、具体主张与边界 | [来源总表](sources.md) |
| 当前唯一 URL 记录与公共 registry 输入 | [catalog](catalog.json) |
| 包内、种子 ID 如何解析到唯一记录 | [source-aliases](source-aliases.json) |
| 主张原文、类别、locator 与编辑来源 | [claims](claims.json) |
| 日期、读取状态、原始来源记录与失败范围 | [reviews](reviews.json)、[历史记录](CHANGELOG.md) |

包内 `evidence.json` 与保留的 [种子记录](seed-catalog.json)是编辑源。`python3 scripts/build_saas_atlas_indexes.py` 重建本目录的五个投影；`--check` 检查同步。合并只采用相同 canonical URL 和有依据的跳转，不把门户、指南、版本页或另一个产品当成同一材料。部分 `current` 与固定版本 URL 保持分离，避免推断未记录的版本等价。

正文快照与 provider 运行证据未保存。这里的可用事实只覆盖作者实际读取的 locator；整合没有把同 URL 的一次成功扩展成整页已读，也没有将合成模型提升为厂商实现。消费入口见 [全景教材](../../../books/saas-engineering/README.md)。

Foundations 的原始证据保留在 [evidence](../../distilled/saas-engineering-atlas/foundations/evidence.json)。全局 `claims.json` 保留原 `kind`，附加 `evidence_kind` 供统一筛选；`source-backed → source_fact`、`synthetic-example → synthetic`、`derivation → inference` 只是类别映射，不改变原主张或读取范围。

[修订证据](repair-evidence.json)追加版本固定的来源复读与合成变式，和[编订流程证据](editorial-evidence.json)一起作为索引输入。两者均保留自己的scope，不改写包内作者证据。

[全书复核补充](whole-book-repair-evidence.json)保存术语的一手来源复读和五项合成规则澄清，也参与统一索引。原 source、review、claim 身份与限制保持。
