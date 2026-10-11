# 按语境、媒介与实现条件查找

从 [index.json](index.json) 组合查找现有条目。例如「Nasca 衣物 + 馆教用途」进入经纬结构；「日文出版 + CSS」进入阅读方向与标点；「图形计数 + 印刷报告」进入 Isotype。命中结果返回条目、符合条件的具体对象及连接依据。

## 分面在哪一层维护

| 层级 | 当前填写的分面 | 含义与唯一登记位置 |
|---|---|---|
| source | industry_author、language | 资料的作者/出版机构语境、实际读取内容的语言；各 stream 的 catalog.json |
| exemplar | artifact、style_lineage、stack_runtime | 具体对象的媒介、可据来源归类的传统/实践、对象自身技术；各 stream 的 entities.json |
| implementation | artifact、stack_runtime；style_lineage 的适用判断 | 候选工具或格式的角色和技术身份；同上。技术名已知不等于已经运行 |
| corpus | artifact 及谱系/runtime 的适用判断 | 集合本身。目录收录项的技术、风格和权利不传给集合或其他成员 |
| grammar | industry_applicability、task、artifact、operation；日文条目的 language | 推导的适用语境、任务、输出媒介、操作及语言条件；[grammar.json](grammar.json)。operation 从既有 operations 字段生成 |

`industry_author` 与 `industry_applicability` 分别回答「谁在什么语境下写」和「本条推导可用于什么任务领域」。`artifact` 在 exemplar 上指原物，在 grammar 上指拟交付产物；查询必须写明层级。`style_lineage` 记录来源支持的名称，包含文化归属与实践名称，不能据此推出师承关系。原术语保留，不用一个英文风格名代替它。

每项填写值带 `basis`、稳定证据 ID 和 `rationale`。本库提出的用途标为 inferred；逐源登记保留明确定位。`known` 表示这项分类可据登记说明，不提升来源验证、权利或实现成熟度。

| 状态 | 含义 | 查询形式 |
|---|---|---|
| known | 有可说明的值 | `"exemplar.style_lineage": "Nasca"` |
| unknown | 已检查，现有证据仍不足 | `"exemplar.style_lineage": {"state":"unknown"}` |
| not-applicable | 对此对象不适用，记录理由 | `"exemplar.stack_runtime": {"state":"not-applicable"}` |
| unreviewed | 该层此分面未登记；由缺省生成 | `"source.industry_applicability": {"state":"unreviewed"}` |

未填满每层八个分面。作者语境不复制到作品；拟议用途不回填为来源事实；工具 runtime 不写到历史原物。两份复用来源保留原身份，本批不替其补分类。完整空缺与逐状态分母见 [覆盖回执](../../../docs/verification/art-software-atlas-20261011/facet-correction.md)。

## 查询怎样连接对象

同一 scope 的多个条件必须由同一记录满足。跨 scope 的条件须连接到同一 grammar，但保留各自的命中对象：例如 `exemplar=Nasca` 与 `implementation=SVG` 表示原作线索和候选实现分别存在，绝不表示 Nasca 原物使用 SVG。

source 沿 grammar 的直接来源关系取值。其他对象沿已有 `informs` / `implements` 边，或与该 grammar 明确共享的来源 ID 连接；结果将后者标为 `shared-evidence`，只说明共同证据入口，不补造原作者认同或实现关系。不沿 `contains`、`discovered-via` 递归继承标签。source 条件指该条目的来源见证，不保证它恰好是另一 scope 命中的对象之唯一来源；对象自己的 `source_ids` 用于继续核对。

`facet_index` 是从各记录生成的值→ID、状态→ID 倒排表；其中没有第二套可手工编辑的分类。证据形态、许可与成熟度仍读原记录字段。重建方法见 [生成与校验](../../../docs/verification/art-software-atlas-20261011/atlas-validation.md)。

## 可复现的查询

在仓库根目录运行以下命令。查询只使用 Python 标准库，读取索引，不写文件或访问网络；值按精确字符串匹配，可先查看 `facet_index` 的词值表。

```bash
python3 scripts/atlas_index.py --query '{"exemplar.artifact":"woven-garment","exemplar.style_lineage":"Nasca","grammar.industry_applicability":"museum-interpretation"}'
python3 scripts/atlas_index.py --query '{"exemplar.style_lineage":{"state":"unknown"}}'
```

同一值列表表示该记录同时具备这些值；空对象 `{}` 列出所有 grammar。实现单点维护在 [atlas_index.py](../../../scripts/atlas_index.py)；生成与检查命令见 [脚本入口](../../../scripts/README.md#艺术与软件图谱)。

更多实际查询及命中对象见 [查询回执](../../../docs/verification/art-software-atlas-20261011/facet-query-results.json)。这些是索引功能检查；新上下文发现试用另记在 [消费记录](../../../docs/verification/art-software-atlas-20261011/consumption.md)。
