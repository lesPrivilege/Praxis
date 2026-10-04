# 关系图的两条语法 · 清点与裁决

2026-10-04。可编辑原生 SVG 的第一批交付了四个关系图件，四个件各自处理“成立到哪一步”和“指向谁”，写法并不一致。这一轮把仓库里这两件事的既有做法清点了一遍，对照三份 W3C 文档的用词，泛化成两页 Kit 条目：[成立程度与归属的标记](../../../kit/design/foundations/standing.md)和 [精确指向](../../../kit/design/foundations/anchoring.md)。裁决见 [ADR-025](../../../docs/decisions/025-relation-marks-and-anchors.md)，样板在 [grammar-specimens](../../../demos/editable-native-svg/grammar-specimens/README.md)。

状态是 `distilled / partial / candidate`：清点由三个只读的 Claude Sonnet 子代理完成，Luna 在这个会话不可用；主会话重读了写进本页的每一行，其余行没有逐一复核。登记见 [intake](../../intake/relation-grammar-20261004.json)。

## 一条虚线在仓库里的意思

子代理在样张、演示和答卷的源码里找到三十一种不同的用法。下表是主会话重读过的十五行，按它实际回答的问题归类。

| 回答的问题 | 出处 | 虚线表示 |
|---|---|---|
| 生效了吗 | `vault/distilled/ai-capability-assessment/rendered/style.css:3` | 按需、有条件或尚未生效；实线是保留的或权威的 |
| | `demos/visual-grammar/event-state-context/scene.js:146` | 事件的效果是 pending |
| | `demos/visual-grammar/schema-gate/scene.js:162` | 被拒绝 |
| | `demos/visual-grammar/observations.md:8` | 过期（另用弹回、抖动、回声环表示拒收、冲突、重放） |
| | `demos/visual-grammar/attention-grammars/scene.js:126` | 状态是 later |
| | `demos/palantir-discovery/index.html:176` | 一份已经过期的决定记录 |
| | `vault/distilled/ai-capability-assessment/rendered/style.css:350` | 需要人决定的节点，同时用了强调色 |
| 有这个值吗 | `vault/distilled/layout-specimens-20260927/atoms/enum.css:19` | 缺失 |
| | `vault/distilled/layout-specimens-20260927/atoms/evidence.css:318` | 不适用 |
| | `vault/distilled/layout-specimens-20260927/atoms/wayfinding.css:160` | 不在数据范围内 |
| | `demos/palantir-discovery/index.html:136` | 未知 |
| | `vault/distilled/layout-specimens-20260927/atoms/quantity.css:344` | 无法量化的偏差 |
| 可信到哪 | `vault/distilled/layout-specimens-20260927/atoms/evidence.css:363`、`:364` | 证据强度中；点线是弱 |
| 与成立无关 | `vault/distilled/layout-specimens-20260927/atoms/quantity.css:553` | 例外分支 |
| | `vault/distilled/layout-specimens-20260927/atoms/enum.css:337` | 参考线 |

这些用法各自在自己的图里都说得通。问题出在第一批的四个生成器：`rel-tracks` 的虚线表示未生效，`rel-qualify` 的虚线表示证据未核对，两种意思落在同一种画法上，独立复查当时就指出了这一点。[图形编码](../../../kit/design/composition/encoding.md)早已写着“不要默认虚线在所有领域都表示候选”。

强调色的情况相反。子代理列出二十二种用法，其中“标在人作决定的地方”在五处独立出现：答卷线图（`style.css:349`）、视觉工场的观察（`observations.md:9`）、Palantir 打样的说明、企业实验的主题文件和本批的 `rel-tracks`。其余用法是导航、数据系列、推荐项之类，与成立程度无关。

状态词也是各写各的。子代理列出二十多组枚举，例如 `commit / pending / reject`、`applied / rejected / running`、`open / proposed / decided`、`verified / inferred`、`零 / 缺失 / 不适用`。它们回答的是不同的问题，却常被并进一个 `state` 字段。

裁决：不规定“虚线表示什么”，改为规定一种画法在一张图里只回答一个问题，并把问题分成四个（生效、确认、待谁决定、谁说的）。关系图一族另给一套默认分配。“有这个值吗”属于数量与值状态，留给 SVG-02，不占用线型。

## 一句话指向别处的写法

子代理列出二十九种写法。主会话重读了下面十一行。

| 写法 | 出处 | 能细到哪里 | 可核对吗 |
|---|---|---|---|
| `source_id@version#locator` | `demos/editable-native-svg/delivery-contract.md:9` | 版本内的位置 | 合同里的约定，第一批只有两个件照做 |
| `{ material_id, revision, fragment }` | `demos/editable-native-svg/fixtures.json`（F01） | 版本内的位置 | 是 |
| `{ source, source_version, location }` | `demos/visual-grammar/schema-gate/fixture.js:22` | 版本内的位置 | 位置只查非空 |
| `RULE@version` | `demos/enterprise-grammar-lab/contracts/work.yaml:102` | 版本 | 字符串 |
| `basis_version`（整数） | `demos/visual-grammar/event-state-context/fixture.js:24` | 整个对象的版本 | 是，但分不出是哪份材料变了 |
| 同一身份标签加一条横贯的轨线 | `demos/visual-grammar/observations.md:13` | 对象与版本 | 靠标签文字相同 |
| 从注释到被注词语的 `aria-labelledby` | `vault/distilled/layout-specimens-20260927/atoms/wayfinding.html:276` | 几个字 | 是 |
| 标签点名目标（“A 的条件”） | `vault/distilled/layout-specimens-20260927/atoms/text.html:424` | 一句 | 靠读者读标签 |
| 整段说明加字母上标 | `demos/palantir-discovery/index.html:276` | 几个字 | 字母与次序对应，没有逐条关联 |
| `locator: page / section / row / timestamp / object_id / url` | `vault/distilled/reporting/claim-evidence.md:40` | 位置 | 候选写法，不是运行契约 |
| 自由文字的依据（“借阅规则 v3 第 4 条”） | 第一批的 `rel-fan`、`rel-scope` | 看写的人 | 只查了非空 |

这些写法收敛在同一个结构上：对象、版本、位置，再加上可选的原文片段或一组相邻的条目。分歧在强度：有的身份可以核对，有的只是一句话，有的只靠版面相邻。原子编排的 [筛选记录](../layout-specimens-20260927/review.md)已经要求“被条件限定的文字范围需要可追踪，不能仅按两个盒子的高度推断”，交接页也写了“锚点型原子不是一个盒子”，两处都只描述了缺口。

裁决：一条指向分开写对象、版本、位置；缺哪一层就标哪一层，不用相邻代替。第一批的 `rel-fan` 和 `rel-scope` 改为结构化的指向，四个件由此可以靠共同的指向连成一张图。

## 外部用词的对照

读了三份 W3C 文档，逐条登记在 [来源卡](../../provenance/relation-grammar-20261004/cards/README.md)。

- [Web Annotation Data Model](https://www.w3.org/TR/annotation-model/)把一条注释分成 body 和 target；指向资源的一部分时，用 Selector 说明怎样定出那一段，用 State 说明指的是资源的哪个状态或版本。“对象、版本、范围分开写”与它一致；“抄下原文来定位”对应它的 Text Quote Selector。本仓库只取这个分法，不采用它的数据格式，也没有实现前后文消歧。
- [PROV-DM](https://www.w3.org/TR/prov-dm/)的 Agent 说的是谁负责，Revision 和 Invalidation 是实体之间的关系。“归属”一栏写的是谁说的、谁负责，与它相合。提议、拒绝、待定这些词它没有，本仓库的词表来自 [共同工作语法](../../../kit/grammar/work.md)里 Proposal、Decision、State、Event 的区分。
- [WCAG 2.2 对 1.4.1 的说明](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)要求颜色不是唯一的视觉手段，建议另用形状或文字。本仓库没有声明采用 WCAG 的某个级别，只取这个做法。

## 落位

| 内容 | 位置 |
|---|---|
| 两页泛化的判断，不带参数 | `kit/design/foundations/standing.md`、`anchoring.md` |
| 词表、默认画法、指向的实现 | `demos/editable-native-svg/svg-01-relations/src/standing.mjs`、`kernel.mjs`，版本 0.2.0 |
| 把几件图连成一张的组合件 | 同目录 `sheet.mjs` |
| 三级做法的样板 | `demos/editable-native-svg/grammar-specimens/` |
| 清点的逐行表 | 没有入库。两份报告各几十 KB，留在会话记录里；本页只收主会话重读过的行 |

## 缺口

两页 Kit 条目的使用证据只有同一名制作者在合成内容上做的四个生成器和一页样板。两次冷读走读的结果见 [验收回执](../../../docs/verification/relation-grammar-20261004.md)，没有不读这两页的对照组。“有这个值吗”一类的值状态没有处理。外部来源只读了三份 W3C 文档，UML、BPMN 等领域自己的线型约定没有查；它们的存在本身就支持“线型的意思因领域而异”，但这句话在这里是推断。
