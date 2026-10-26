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

- [ADR-025：成立程度的标记与精确指向进入 Design Foundations](025-relation-marks-and-anchors.md)（accepted；Foundations 加两页，各给约束、关系图的默认和三级做法；实现与样板留在 demo；合成内容、单一制作者、无对照）。

- [ADR-026：排列与刻度进入 Design Foundations](026-placement-and-scale.md)（accepted；Foundations 加一页，规定位置的读法要写进图里、没有量不按比例画、并排的线写明是否共用标尺；实现与样板留在 demo；合成内容、单一制作者）。

- [ADR-027：成文审阅的目标与结构位置的取形](027-prose-review-goal-and-structural-text.md)（accepted；用户裁决恢复两项：审阅以更接近人类作者为目标，结构位置用凝练、并列的短语；审阅新增句式重复检查和结构文字的独立审阅；修订 ADR-024 的两处，其余不变；新条文尚未在真实任务上用过）。

- [ADR-028：口播旁白体例与独立冷读](028-narration-genre-and-cold-read.md)（accepted；把第五版改稿的做法提炼进 Kit：新增口播旁白文体页，审阅方法新增成文的独立冷读，结构文字审阅补三项产出；使用证据只有一条片子、同一名主笔，审阅由模型完成）。

- [ADR-029：书目摘要与可选语法参考](029-design-writing-reference-encyclopedia.md)（accepted；沿用任务树、双向来源、可选分面与独立历史；新增方法仍是参考）。
- [ADR-030：会话入账与 agent 指引边界](030-session-ingestion-and-harness-boundaries.md)（accepted；沿用 Vault 分层，维护按需读取，模型角色保留为能力偏好；运行收益待实际消费验证）。
- [ADR-031：术语取最稳定的说法；讲解页的编排留作参考](031-stable-terms-and-explainer-page.md)（accepted；成文原理第 6 条写明 AI 与 agent 等领域的术语用英文原词；Publish 新增讲解页的编排，是可取用的参考；强调色在交互图里可作当前选中；稳定语义的记号、控件与运动写成工单交给独立的 ClaudeDesign，Kit 暂不新增；使用证据只有一页、一名主笔，未对照）。
- [ADR-032：承载稳定语义的记号、控件与运动收进 Design](032-semantic-marks-library.md)（accepted；整包在 kit/design/marks，normal/reference，按需取用，可改用外部库或重画）。
- [ADR-033：互著别裁与内容的持续维护](033-content-discovery-and-retirement.md)（accepted；多入口与独立用途提炼、依赖边界、增量和清退的去向闭合；未执行真实迁移或删除）。
- [ADR-034：限定说一次；过程材料留在索引；改写后可机器比对不可损失项](034-state-limits-once-and-keep-process-out.md)（accepted；成文原理第 8 条与审阅方法加“重复设防”；Shared 证据把交接、核验和审阅记录归 index；审阅第 7 步可用脚本比对字面量；证据为 SaaS 教材两批编订，未对照）。
- [ADR-035：每节先给局部答案；链接写明关系](035-local-answers-and-link-relations.md)（accepted；讲解页的结论层与章层补验收和节首答案；审阅加“目录冒充概览”“摘要逐级稀释”；内容编排要求交叉链接写明关系；取自用户交来的写作规范，只取结构，不取文字）。
- [ADR-036：Writing Kit 修订交接的裁决](036-writing-kit-spec-handoff.md)（accepted；讲解页结论层从问题讲起；缩写首用；外文来源提炼的语言边界；验收改为检查面；正文历史不是过程材料；改正时不补假设；作者语体单页默认不启用；未试用、未对照）。
- [ADR-037：dsh-praxis 的分层体例](037-dsh-praxis-layered-grammar.md)（accepted；Task、Writing、Design、Publish、Materials 五层，内容组织归 Writing、媒介编排归 Publish，Agent 按范例维护，并行迁移迁完即删；只有体例与 schema 草案，未实现、未走读）。
- [ADR-038：dsh-praxis 控制面的实现](038-dsh-praxis-control-plane.md)（accepted；一套 core 五个入口；挂载关系留在 catalog、维护信息在 dsh-praxis/data；允许直接改文件；不设常驻服务；不引入依赖；Design 一并迁入；已在临时 DSH profile 里验证，桌面应用待重启）。
- [ADR-039：dsh-praxis 的产物登记与取用](039-dsh-praxis-artifacts.md)（accepted；产物记录与版本，字节留在原处；consume 同时登记；review 写明版本；信号只有 missing 与 needs_work；预览、显示、打开交给 DSH；拖出用 DownloadURL 待桌面实测；工具值统一为无损 JSON）。
- [ADR-040：dsh-praxis 的来源闭环](040-dsh-praxis-source-loop.md)（accepted；名册说清每条来源的收录缘由、所挂页面、服务的任务与读过它的运行；resolve 素材带原件 URL 与摘录定位；consume 记读过的来源并推出挂载；关系只在来源自己的记录上，Kit 页引用已登记来源须有关系；项目内来源索引按引用登记；capture 成批并写明任务）。
- [ADR-041：dsh-praxis 的项目与产物位置](041-dsh-praxis-projects.md)（accepted；项目是带布局的目录，底稿、中间产物、最终产物各按 glob；产物属于包含它的最深项目，consume 拒收项目外的文件；违例只报不搬：misplaced 与未登记的最终产物）。
- [ADR-042：dsh-praxis 对照上游检查来源，写回保留原排版](042-dsh-praxis-upstream-checks.md)（accepted；refresh 默认只记状态与内容 hash，keep 才存快照；变化与失效从观察记录推出，新增 unreachable 信号；运行记内容 hash；写回 JSON 只改动到的部分）。
- [ADR-043：dsh-praxis 的生产管线登记为来源](043-dsh-praxis-pipelines-as-sources.md)（accepted；已有生产管线按本地定位登记为来源，挂到 publish/video 与 publish/html 并写明何时用；产物记下 `made_with`；脚本留在原项目）。
- [ADR-044：仓库目录按角色分流，源流只走一个方向](044-repository-layout-by-role.md)（proposed；根目录只留五条流、三个工具目录与 gitignored 的 `work/`；项目统一进 `projects/`，布局加验收证据与临时物两个角色；capture 原件进快照目录；validator 加根目录白名单与项目布局两道门；三阶段迁移见 [工单](../governance/repository-layout-migration.md)，本轮未搬文件，待用户裁决）。
