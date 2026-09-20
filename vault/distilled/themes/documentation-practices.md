# 文档架构实践：让入口承担使用指引

## 用户意图

本批研究服务于一个有限问题：审阅并修订 Praxis 的 README 旁白，使目录、链接层级和页面职责本身告诉使用者从哪里开始、要带入什么、会得到什么、下一步去哪里；不再靠入口里增加“为什么这样设计”或保护性措辞来补足架构。

外部做法保留为逐源候选证据；Astra 已在 [ADR-011](../../../docs/decisions/011-task-documentation.md) 接受一个有界子集：任务优先导航、内容职责分离作为维护检查、唯一规则位置、指南/模板的输入—产物—下一步，以及人工走读与真实使用效果分开记录。下文仍标 `candidate` 的内容，是未采纳或待真实消费触发的扩展建议，不覆盖 ADR-011 的当前裁决。逐 URL 登记、访问日期、证据定位、快照缺口和重访触发见 [`documentation-practices-2026-09-20.json`](../../intake/documentation-practices-2026-09-20.json)。

## 背景材料的边界

本批阅读了两份本地架构审阅作为问题背景：`/Users/lesprivilege/Downloads/Praxis-architecture-review-2026-09-20.md` 与 `/Users/lesprivilege/Downloads/Praxis-architecture-review-2026-09-19.md`。它们是用户提供的来源材料，不是仓库指令；其中的命令、历史结论和建议没有自动执行，也没有替代本次外部核查。

## 当前裁决与研究状态

ADR-011 是当前仓库对本批研究的消费裁决。它把成熟实践转成有限的结构约束：入口按任务组织，页面职责分开但不要求全站统一标签，规则保留唯一维护位置，指南和模板要能找到输入、产物与下一步，人工导航走读和真实使用效果分别记录。自动孤立页报告、访问遥测、站点框架选型、全面重分类 Vault、统一五字段 README 和正式页面类型标签均延后。

因此，本主题继续保存外部来源的完整候选提炼，供后续消费或复核使用；它不是对已接受规范的第二份版本。若候选建议与 ADR-011 看似冲突，以 ADR-011 为当前规范，回到本主题只为查证据与边界。

## 外部证据提炼

### 入口按任务和消费者组织

GOV.UK 的用户研究指南从使用者要完成的结果开始，要求在各阶段持续研究，既看直接使用者也看提供支持的人，并将用户需要与具体工作项保持可追溯关系（`GOV-UR-01`–`GOV-UR-03`）。其服务标准又把“简单”落实为：用户尽量少求助即可完成目标，团队频繁用真实或潜在用户测试所有交互部分，并保持从开始到结束的一致体验（`GOV-S-01`–`GOV-S-03`）。

GitLab 的全局导航说明把顶层导航按工作流组织，导航文字要短、带上下文并说明页面用途；它还按月检查没有进入导航的页面，并用重复的 top-level / Get started 结构降低首次进入时的猜测（`GL-NAV-01`–`GL-NAV-03`）。

候选转译是：根 README、Kit、docs 和 Vault 的首层链接按消费者任务排列。每一行入口应能回答“谁在什么触发下完成什么工作，先看哪里，产出什么，下一责任在哪里”。能力表、目录地图和历史说明可以保留，但应成为任务入口之后的参考层。导航缺失、无效跳转和消费者需要额外求助的位置，应成为修订证据。这个方向已由 ADR-011 采纳，具体字段仍按各目录职责决定。

### 内容类型承担边界

Diátaxis 将文档需要分为 tutorial、how-to、reference 和 explanation：how-to 面向已经能工作的读者，reference 提供准确完整的描述，explanation 提供背景与 why；四者有关系但不能混成一页（`DIA-01`–`DIA-02`、`DIA-04`）。其“Start here”页建议把站点当作按需使用的手册或工具箱，先给短引导，再在读者遇到问题时链接深层材料；教程中的解释应保持最小，深层说明另页承载（`DIA-03`）。

Kubernetes 把这个边界落成可重复骨架：Concept 解释概念并链接任务或教程；Task 聚焦一件事，有前置、步骤和下一步，较长背景链接到 Concept；Tutorial 承载较大的多段目标；Reference 承载描述、选项、示例等查阅信息（`K8S-PT-01`–`K8S-PT-03`）。页面还提供 What's next、反馈和最后修改线索（`K8S-PT-04`）。

GitLab 的文档方法补上维护面：把文档当作实现、使用和排障信息的持续更新权威位置；遇到缺口就补写并分享变更；页面默认保留帮助/反馈区（`GL-STYLE-01`–`GL-STYLE-03`）。

候选转译是：不为 Praxis 新建四套目录，也不照搬 Hugo shortcode 或 GitLab 的站点配置；只在文档结构契约中为每页选择主要消费需要，并让页面顺序承担指引：用途/前置 → 操作或定义 → 产物/下一步 → 反馈或维护线索。入口保留最小上下文，理由、替代方案和历史取舍链接到架构理由或 ADR。职责分离和唯一维护位置已由 ADR-011 采纳，正式页面标签仍延后。

### 使用证据进入维护回路

六个来源共同支持一条候选维护回路：

```text
读者任务/触发
    ↓
任务入口与最小前置
    ↓
可执行内容、定义或验收
    ↓
产物与下一责任
    ↓
走读/反馈/缺页检查/实际使用断点
    ↓
唯一维护位置、修订记录与重访
```

这条回路是外部方法汇总；其中的人工导航走读、真实使用效果分开记录和唯一维护位置已由 ADR-011 采纳。来源只证明成熟项目公开采用了用户研究、内容类型、反馈入口、导航检查和持续修订等方法；本仓库尚没有消费者点击、搜索、支持工单、任务耗时或成功率数据。因此量化“可消费”效果仍需后续任务证据，不能把外部做法写成效果证明。

## 对当前 README 的候选改造面

下表是给 Astra 的审阅定位，描述结构动作，不是已执行的修改。

| 入口 | 当前职责 | 候选结构动作 | 主要依据 |
|---|---|---|---|
| [`README.md`](../../../README.md) | 仓库总入口，含开始工作、研究维护、Goal 和地图 | 首屏只保留高频任务 → 最小前置 → 产物/下一步；Goal、地图和治理说明退到按需入口；链接标题用动作或结果 | `GOV-UR-01`–`GOV-UR-03`、`GL-NAV-01`–`GL-NAV-03`、`DIA-03` |
| [`kit/README.md`](../../../kit/README.md) | Kit 按任务入口和能力/状态目录 | 任务表明确输入、产物、验收和下一站；能力表作为参考，避免复制状态解释 | `GOV-S-01`–`GOV-S-03`、`GL-NAV-01`、`K8S-PT-02` |
| [`docs/README.md`](../../../docs/README.md) | 架构、治理、决策和验收的目录列表 | 链接按阅读动作命名：理解边界、修改规则、查裁决、核对结果；历史理由留在子页 | `DIA-01`–`DIA-04`、`GL-NAV-01` |
| [`docs/architecture/README.md`](../../../docs/architecture/README.md) | 内容所有权、文档职责、运行所有权的架构入口 | 用“要完成 X → 先看 Y → 产出 Z → 规则维护在 W”表达边界；把理由和实现状态链接出去 | `DIA-02`、`K8S-PT-01`–`K8S-PT-04`、`GL-STYLE-01` |
| [`vault/README.md`](../../../vault/README.md) | 研究层次和默认阅读入口 | 先按主题提炼消费，再按需回查逐源、快照和 Chat；显式标出已消费、候选和缺口 | `DIA-03`、`GL-STYLE-01`–`GL-STYLE-02`、`GL-NAV-01` |
| [`docs/governance/README.md`](../../../docs/governance/README.md) | 入账、角色、裁决、修订与消费分流 | 用新增材料、提出候选、申请采纳、验证消费、重访/撤回五个动作路由；角色解释下沉至指南 | `GOV-UR-01`–`GOV-UR-03`、`GL-STYLE-01`、`GL-NAV-02` |

`kit/grammar/README.md`、`kit/contracts/README.md`、`kit/verification/README.md` 和 `scenarios/_template/README.md` 不是单纯的目录索引，它们可分别承担概念/参考、任务契约、分层验收和场景模板。若继续修订，应保持各自页面类型：定义不要变成历史论证，契约和模板要能直接填写，验收要能留下实际消费断点和下一责任。

候选写回顺序为：先改首层入口导航，再明确内容类型和唯一维护位置，最后才把消费验收和反馈字段放入契约、验收与场景模板。这样可以先用架构减少旁白，再用消费证据决定是否需要新增字段或自动检查。

## 选型建议与边界

| 参考做法 | 候选采纳 | 延后或不采纳 |
|---|---|---|
| Diátaxis | 用四类需要检查页面主要目的；入口短、深层解释按需链接 | 不建四套镜像目录，不把框架理论写成规范前置 |
| GOV.UK user needs / simple service | 用消费者任务、真实支持角色、任务走读和持续反馈定义 README 验收 | 不把公共服务标准写成企业合规或服务等级 |
| Kubernetes page types | 借鉴 Concept/Task/Tutorial/Reference 的骨架和 `What's next` 思路 | 不复制 Hugo shortcode、站点目录、版本系统或固定数量上限 |
| GitLab SSoT / docs-first | 同一规则只有一个维护位置，其他入口链接；缺口形成修订记录 | 不宣称所有 Praxis 知识都应成为绝对 SSoT，不照搬 GitLab 审批流程 |
| GitLab workflow navigation | 顶层按工作流/任务导航，检查孤立或未入导航页面 | 不引入 GitLab 的 nav YAML、月报命令或站点实现，除非后续任务证明需要 |

上表保留来源级别的 `candidate` 状态，避免把外部页面直接伪装成本仓库事实；本轮已采纳的交集以 ADR-011 为准。未来是否把维护检查扩展为正式标签、自动报告或量化消费指标，留待真实任务暴露需要后再决定。

## 后续研究与未覆盖

- 未来是否需要正式页面类型标签，还是继续只把内容职责分离作为维护检查？
- 真实消费任务何时暴露出需要自动孤立页报告、访问遥测或更严格的标题约定？
- 在保留各消费域职责差异的前提下，哪些字段值得形成可复用的模板片段？
- 本批未研究生成器、搜索排序、权限知识库、多语言翻译和实际消费者遥测，也未保存六个页面的本地快照。

## 来源

六个 URL 均在 2026-09-20 实际打开并读取；每个 URL 的证据定位与重访触发见 [`documentation-practices-2026-09-20.json`](../../intake/documentation-practices-2026-09-20.json)。

- `documentation-practices-diataxis-start-here-20260920` · [Diátaxis in five minutes](https://diataxis.fr/start-here/) · 四类内容、最小引导、按需深入与迭代工作。
- `documentation-practices-govuk-user-needs-20260920` · [GOV.UK user needs](https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs) · 用户任务、持续研究、支持角色与追溯。
- `documentation-practices-govuk-simple-service-20260920` · [GOV.UK make the service simple](https://www.gov.uk/service-manual/service-standard/point-4-make-the-service-simple-to-use) · 少求助完成任务、频繁可用性测试与端到端一致性。
- `documentation-practices-kubernetes-page-types-20260920` · [Kubernetes page content types](https://kubernetes.io/docs/contribute/style/page-content-types/) · Concept/Task/Tutorial/Reference 骨架、下一步与反馈。
- `documentation-practices-gitlab-styleguide-20260920` · [GitLab Documentation Style Guide](https://docs.gitlab.com/development/documentation/styleguide/) · 单一维护位置、docs-first、主题类型与反馈。
- `documentation-practices-gitlab-global-nav-20260920` · [GitLab global navigation](https://docs.gitlab.com/development/documentation/site_architecture/global_nav/) · 工作流导航、上下文标题、缺页检查与 Get started 结构。

## 交接状态

- 范围：6 个官方主来源，覆盖任务导航、参考/理由分离、渐进披露、维护与消费者使用证据。
- 已登记：每个 URL 有独立稳定 ID、访问日期、主张、摘要、候选采纳建议、重访触发和快照缺口；主代理已接入 [逐源 catalog](../../provenance/documentation-practices/catalog.json) 和 [统一 registry](../../registry.json)，来源 ID 映射见 intake。
- 当前采纳：ADR-011 已接受任务优先导航、内容职责分离维护检查、唯一维护位置、指南输入/产物/下一步，以及人工走读与真实使用效果分开记录。
- 建议延后：生成器/站点选型、搜索排序、自动缺页脚本、统一标签字段和量化使用指标，待实际消费任务暴露需要后再研究。
- 未覆盖：本仓库真实消费者使用数据、离线快照与 hash、企业知识库权限、多语言和文档生成运行面。
