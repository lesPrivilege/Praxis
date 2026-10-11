# 分面补全与查询验收

## 缺口与修正

基线 `f30b158946b284838afd9c0253ba3d01142b027d` 的架构声明了八个分面，但分类没有落实：56 份新来源中只有 6 份填写 task/operation、2 份填写 artifact/stack_runtime，其余四维为零；46 个实体和 12 个 grammar 都未填写。此前的模式与链接通过没有检查分类可用性，独立初审也未发现这一缺口。

补正按对象职责填写，保持所有来源 URL、ID、主张、卡片正文不变。来源记录维护出版语境和阅读语言，实体维护原物媒介与可证归属、工具技术，grammar 维护推导用途与交付产物。没有把作者行业作为成效证据，也没有把候选 SVG/Canvas 归给历史织物或瓷砖。

`grammar.json` 接替生成器中原有硬编码叶子表，成为元数据单点；Kit 仍是解释正文的唯一位置。index schema 从 1.0 升至 1.1，允许实体和 grammar 的 facets、增加分类理由及生成的倒排表。旧来源 schema 与旧百科索引不迁移。operation 从既有 operations 生成，倒排表只保存 ID。

## 前后覆盖

表中「填写」包含已审 unknown / not-applicable，并不等于 known。完整逐层八维分母见 [补正前](facet-coverage-before.json) 与 [补正后](facet-coverage-after.json)。

| 所有者 / 分面 | 补正前填写 | 补正后：known / unknown / not-applicable |
|---|---:|---:|
| source / industry_author | 0/56 | 56 / 0 / 0 |
| source / language | 0/56 | 54 / 2 / 0 |
| entity / artifact | 0/46 | 46 / 0 / 0 |
| entity / style_lineage | 0/46 | 10 / 6 / 30 |
| entity / stack_runtime | 0/46 | 22 / 6 / 18 |
| grammar / industry_applicability | 0/12 | 12 / 0 / 0 |
| grammar / task、artifact、operation（各） | 0/12 | 12 / 0 / 0 |
| grammar / language | 0/12 | 1 / 0 / 0，另 11 未标注 |

所有 grammar 用途均标 inferred，并注明具体依据和未验证的效果范围。10 个谱系值是有来源的文化/实践检索词，不是十条已证明的历史传播链。三件 Skyspace 的控制 runtime 未识别，复核后记 unknown；没有以「未找到软件证据」推出不适用。两项材料绘图方案的 runtime 则是本库明确提出的候选技术，known 不表示原作技术或已执行。

仍未分类的范围包括：来源的 applicability 与 lineage 各 56 项，task/operation 各 50 项，artifact/runtime 各 54 项；实体的作者语境、用途、任务、操作和语言各 46 项；grammar 的作者语境、原作谱系、runtime 各 12 项与语言 11 项；两份复用来源的本批八维投影均未标注。这些字段没有用 not-applicable 填满。组合检索从相应所有者取值，未做过的分类继续显示 unreviewed。

来源语言未知项是 ASA-S-07 与 ASA-S-11。实体谱系未知项是汽车散点图、新聞総覧、三件 Skyspace 与光之教会；实体 runtime 未知项是三个外部集合与三件 Skyspace。每项原因留在对应 facet.rationale。

## 实际查询

[查询说明与可执行代码](../../../vault/provenance/art-software-atlas/facets.md)使用真实 index。13 个维护者执行的确定性案例覆盖组合命中、unknown 和反污染，结果及命中对象见 [查询回执](facet-query-results.json)。

| 意图 / 条件 | 命中 |
|---|---|
| woven-garment + Nasca + museum-interpretation | 经纬与服饰结构 |
| 英语来源 + 日文文本条件 + CSS 候选 | 日文阅读关系 |
| Isotype + compare-quantities + print-report | 重复符号与计量 |
| p5.js + plotter-drawing + compare-rule-variants | 规则、扰动与选择 |
| interactive-chart + retain-context + JavaScript | 范围选择 |
| church-building + three.js + explain-spatial-sequence | 光之教会空间关系 |
| exemplar 同时要求 Nasca 与 SVG runtime | 无结果，候选实现不污染原物 |

查询通过只证明当前索引能完成这些定位，不证明设计效果或无遗漏。原有三次新上下文发现试用没有被改称为新分类的用户验收。证据、许可和成熟度没有从标签或集合继承。

## 验证与复核

生成器和只读校验见 [复现说明](atlas-validation.md)；查询代码与结果可独立重跑。校验覆盖每层 facet 的状态/值、证据外键、分类理由、源/实体/grammar 投影一致性、operation 单点与完整倒排表。补正同时执行仓库验证与旧百科索引检查；最终回执和独立复核链接由 [交付目录](README.md)汇总。

本轮分类只重读既有来源摘要、主张定位、Kit 与原检查记录，没有增加外部作品观看、音频或集成测试。分类可修订，历史记录和原始证据身份不变。
