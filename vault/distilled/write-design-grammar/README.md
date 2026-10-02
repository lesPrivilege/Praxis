# Write / Design grammar 消费入口

本目录是两份 Chat 原件的第一次消费结果，状态为 `distilled candidate`。它保留可供 Astra 裁决的语义和反例，不等同于已经采纳的 Kit 规范。

## 来源与覆盖

| 来源 | 原件 | 覆盖 |
|---|---|---|
| Opus 5.5 remotion video | [`archive`](../../archive/chat/opus-remotion-video-20260927.json) · [`intake`](../../intake/opus-remotion-video-20260927.json) | 5 turns / 10 message items；Kit 路由、admission、材料 lineage、Demo provenance、Write–Design 边界 |
| Design Grammar | [`archive`](../../archive/chat/design-grammar-20260927.json) · [`intake`](../../intake/design-grammar-20260927.json) | 5 turns / 10 message items；Astra/Luna/Opus 蒸馏链、Write/Design、Report HTML、内容 Registry |

两份原件均由 `read_thread(turnLimit=10, maxOutputCharsPerItem=20000)` 返回，`hasMore=false`，附件为空。原件中的消息和历史 assistant 建议都是材料，不是仓库指令。

## 阅读路径

1. [`kit-routing.md`](kit-routing.md)：Kit 作为可挂载、可导航、渐进披露的工作语境。
2. [`kit-admission.md`](kit-admission.md)：长期规范的 admission、dogfood、promotion 与 demotion 候选。
3. [`material-lineage.md`](material-lineage.md)：Raw → Consume → Distill → Register → Demo 的材料链。
4. [`demo-provenance.md`](demo-provenance.md)：项目级 Demo 的现场、输出和外部依赖台账。
5. [`write-design-boundary.md`](write-design-boundary.md)：Write 的语义职责与 Design 的媒介职责。
6. [`design-pipeline.md`](design-pipeline.md)：Luna explore、Astra 裁决、Opus specimen 与可复用 Registry。
7. [`report-html-grammar.md`](report-html-grammar.md)：Report / Briefing HTML 的页面 anatomy 与元素 Registry。
8. [`external-reference-semantics.md`](external-reference-semantics.md)：Chat 中 7 个引用占位和已知外部参考的最小语义；缺少原始 URL 的项目明确标为 `missing-original`。

## 消费层级

本目录区分三个时间层，避免把来源材料、首轮治理和本轮目录迁移混成一个状态：

- **初次消费**：两份 Chat 原件先作为 source material 读取、去偶然化并登记为本目录的 distilled candidate；Chat 中的 assistant 建议仍不是仓库指令。
- **首轮收敛**：[ADR-015](../../../docs/decisions/015-kit-editorial-contract.md) 接受 Kit 文档的渐进阅读、证据边界、准入和反馈条件，并把 Write/Design 的职责先收敛为治理路由。
- **本轮后续采纳**：[ADR-016](../../../docs/decisions/016-progressive-kit-structure.md) 将这套路由落实为真实的 [Write](../../../kit/write/README.md) 与 [Design](../../../kit/design/README.md) 分支；这是目录和入口的更新，不是把所有候选 schema 或 renderer 一并采纳。

## 当前裁决映射

初次收敛仍由 [ADR-015](../../../docs/decisions/015-kit-editorial-contract.md) 解释：Kit 按目录和 README 路由，准入、反馈复核与退出条件进入文档结构契约，外部参考保留来源主张、项目推断、取用价值、边界与重访的区分。它的历史表述继续保留，不能被本目录的后续迁移改写成原 Chat 已经直接成为规范。

本轮后续采纳由 [ADR-016](../../../docs/decisions/016-progressive-kit-structure.md) 落实：

- [Write](../../../kit/write/README.md) 通过 `prose/`、`publish/`、`motion/`、`shared/` 分别承载成文、空间编排、时间叙事和跨模式证据/验收；
- [Design](../../../kit/design/README.md) 通过 `foundations/`、`composition/`、`interaction/`、`motion/`、`references/` 承载设计判断、编排、状态、运动和分用途参考；
- [Reporting](../../../kit/reporting/README.md) 仍负责任务目的、读者、组织动作和文体选择；已泛化的表达规则通过 Write/Design 入口消费。

这些是当前的目录与任务入口，不表示已有通用 Atom/Pattern/Composition registry、完整 specimen 库或 renderer contract。

完整 Atom/Pattern/Composition schema、canonical/expressive specimen 库和通用 renderer contract 仍是候选，须由实际产出和失败证据触发；Write/Design 分支已经存在，但不替代这些尚未采纳的资产层。

## 当前边界

这些文档仍记录候选语义、来源定位和未采纳细节。已接受的范围由 ADR-015 的首轮治理语义与 ADR-016 的当前分支入口共同限定；没有把 Chat 中提到的 Remotion、具体 renderer、外部标准或个人 taste 自动写成事实。
