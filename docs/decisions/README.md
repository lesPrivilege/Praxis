# Architecture decisions

| ID | 状态 | 决策 |
|---|---|---|
| [001](001-scope.md) | accepted | 先知识与契约，保留小Build Surface |
| [002](002-promotion.md) | accepted | 独立场景证据与人工晋升门槛 |
| [003](003-reporting.md) | accepted | 汇报设计单列，统一入账与本地快照 |
| [004](004-work-system.md) | accepted | 工作系统单列第三目，先手动loop与工具登记 |
| [005](005-naming-proposal.md) | accepted | Praxis总名与三个消费域 |
| [006](006-demo-project-vault.md) | accepted | Demo、真实项目与企业Source Vault分界 |
| [007](007-environment-expert.md) | accepted / runtime deferred | Environment、Expert、Skill与使用量治理边界 |

accepted 表示本仓库当时采纳；技术实现与使用证据在对应契约和验收中记录。变更以新 ADR 关联旧记录，旧记录的原文不改；某一条里被后来的决定替代或修订的部分，在下面的索引行里注明，现行做法以它指向的 Kit 页面为准。

- [ADR-008：材料路由与驻场组织接口](008-artifact-field-governance.md)（accepted；文体与现场效果待验证）。

- [ADR-009：以工作为入口的知识架构](009-work-led-knowledge-architecture.md)（accepted）。
- [ADR-010：领域 Kit 与运行消费者](010-domain-kit-consumers.md)（accepted；接入待验证）。
- [ADR-011：由文档结构承担使用指引](011-task-documentation.md)（accepted）。

- [ADR-012：平台产品扫盲与思维导图归属](012-platform-grammar-mindmaps.md)（accepted；行业说明为研究，XMind 导入待验证）。

- [ADR-013：能力测试回答体例与证据分层](013-assessment-answer-profile.md)（accepted；产品实测与视觉制作 deferred）。

- [ADR-014：跨项目的 Design 与 Writing kit](014-design-writing-kits.md)（accepted；重复登记待逐步合并。其中“写作原理由自足 skill 承载”已由 ADR-016 替代，skill 现在是薄入口）。

- [ADR-015：Kit 体例、参考消费与活跃维护](015-kit-editorial-contract.md)（accepted；收敛项目样式范围，跨项目效果待使用验证。其中“暂不建立 Write/Motion 分支”已由 ADR-016 替代）。

- [ADR-016：以真实分支落实 Kit 的渐进消费](016-progressive-kit-structure.md)（accepted；Write/Design 分层，skill改为薄入口，旧路径保留导航。其中八条写作原理的读法由 ADR-019 修订，不再是同一强度）。

- [ADR-017：验收后的参考进入任务优先层](017-reviewed-reference-priority.md)（accepted；优先级与证据/规范采纳分离，首批仅验收结构查阅用途）。

- [ADR-018：Design 保留泛化的构成关系，原子化作为取用方式](018-generalized-design-relations.md)（accepted；用户裁决，九项问题尚无真实任务检验）。

- [ADR-019：表达规则的归属、强度与两条入口路径](019-expression-owners-and-entry-paths.md)（accepted；不新建 Present，Write 规则分三种强度，入口分消费与维护；走读每条路线前后各一次。其中“八条原文不改”和语体分类由 ADR-024 修订）。

- [ADR-020：企业工作侧的入口校订与写深条目的检查](020-entry-calibration-and-depth-check.md)（accepted；目录不动，入口补三句改两处，体例加场景取值、工具能力与五问；九类能力语法候选与交付生命周期延后，等真实素材）。

- [ADR-021：社区实践里的工作方式作为备用素材，以及“规则起了作用”的检查](021-community-mechanisms-and-attribution-check.md)（accepted；五条机制收进 Kit 一页备用素材，没有一条写成规则；验收加对照、留出、代价的默认做法；入口加恢复路由一行）。

- [ADR-022：来源卡由谁维护要在 catalog 里声明，以及自足性审查的处置](022-source-card-ownership.md)（accepted；catalog 加 `cards` 字段，生成脚本只写 `generated` 的 17 份，校验对两种都查；在途状态只记一处；按用途投影和真实任务的消费验收没有做）。

- [ADR-023：按产物的组成部分取用 Write 与 Design](023-consume-by-artifact-component.md)（accepted；任务入口按产物成分分到几支，Design 入口写明页面文字仍过 Prose 并列出先读哪张参考，交付前核对分工，`writing` skill 触发条件扩到产物里的文字；一次改前改后对照，没有留出）。

- [ADR-024：成文默认与审阅范围的窄修订](024-prose-defaults-and-review-scope.md)（accepted；信息作用、语体、句式与修改记录按任务判断，参考低权重；Write 纯文本职责收缩待迁移裁决，目录与所有权未改）。
