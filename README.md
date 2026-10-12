# Praxis

企业工作、专业交付与个人工作系统的知识和契约库。当前提供任务指南、场景模板、来源提炼与治理规则；运行应用和共享组件尚未实现。

## 开始工作

| 当前任务 | 从这里开始 | 得到什么 |
|---|---|---|
| 了解陌生业务、判断机会 | [工作全景](kit/landscape.md) → [现场闭环](kit/work-system/field-loop.md) | 问题、基线、替代方案与启动条件 |
| 定义一次验证或试点 | [场景模板](scenarios/_template/README.md) | 对象、动作、证据、验收与接收责任 |
| 写汇报、memo、deck 或 HTML | [Reporting brief](templates/reporting/README.md) → [Write](kit/write/README.md) + [Design](kit/design/README.md) | 明确材料目的，完成文字、编排与视觉表达 |
| 整理会议、项目状态与后续工作 | [工作系统](kit/work-system/README.md) | 候选变化、确认状态与下一责任 |
| 在新环境消费 Kit | [Environment](kit/environment/README.md) | 能力盘点、权限范围与消费计划 |
| 设计软件视觉与交互、编排可视化 | [Design](kit/design/README.md)；需要依据时查 [参考路由](kit/design/references/README.md) | 可选做法、适用规则、依据与设计产出 |
| 撰写或改定对外中文成文 | 项目 skill `writing`（`.claude/skills/writing/SKILL.md`）→ [Write / Prose](kit/write/prose/README.md) | 按写作原理成文，附审阅裁决 |
| 将阅读材料制成视频、查旧片的施工经验 | [Write / Motion](kit/write/motion/README.md) | 分镜、表现参考、旧项目的消费与验收 |
| 查定义、接口与验收要求 | [Kit](kit/README.md) | 对应契约与检查项 |

## 研究与维护

| 需要 | 入口 |
|---|---|
| 阅读已消费材料、查证来源 | [Vault](vault/README.md) → [主题提炼](vault/distilled/README.md) |
| 进入 Palantir 方法论主题 | [palantir](palantir/README.md)：一级提炼入口；7 个对象已有不同范围原件及候选笔记，材料参考见 [reading list](palantir/references/README.md)，来源登记与原件仍在 Vault |
| 进入 Tally SaaS 研究主题 | [tally](tally/README.md)：一级提炼入口；当前仅有《清算 SaaS》书稿登记，材料参考见 `tally/references/README.md`，来源登记与原件仍在 Vault |
| 会话如何入账、agent 指引如何维护 | [本轮提炼](vault/distilled/chat-ingestion-harness-20261009/README.md) / [采纳边界](docs/decisions/030-session-ingestion-and-harness-boundaries.md) / [审计](docs/verification/harness-audit-20261009.md) |
| 增补材料或启动研究 | [入账](docs/governance/intake.md) / [研究问题](docs/governance/research-agenda.md) |
| 修改规则、迁移或撤回推荐 | [修订流程](docs/governance/evolution.md) |
| 登记新的设计或写作参考 | [来源入账](docs/governance/intake.md#处理链) / [参考生命周期](docs/governance/reference-lifecycle.md) |
| 理解组织方式与历史取舍 | [架构](docs/architecture/README.md) / [决策](docs/decisions/README.md) |
| Agent 选择任务路线 | [AGENTS.md](AGENTS.md)；普通任务进入 Kit，维护仓库时再读 [使用约定](kit/Agent.md) |

## Goal 与第一性原理

**Goal：让工作环境、业务探索和专业交付，都从已消费的证据、清楚的工作语义和可复用契约起步；让本次工作的有效增量提高下一次工作的起点。**

1. 从真实工作与要做的决定出发：对象、输入输出、规则、证据、人的判断先于工具和页面。
2. 扩大专业覆盖并保留问责：AI辅助结构化与判断，关键决定可由人复核，结论能够追溯。
3. 证据与推断分开：用户意图、来源事实、历史建议、本repo裁决分别登记；未知保持可见。
4. 先局部验证，再泛化：客户差异留在overlay；重复出现且有独立证据的能力才进入共享Kit。
5. 小的实现面、稳定的契约、开放的研究面：参考可持续扩充，技术选择可替换，不用规模证明成熟。
6. 本地可消费、持续可修订：结构化提炼为主入口，必要快照支持独立阅读；保留来源与旧版本，允许新增证据推翻旧判断。


目标和原则的修订按 [增量机制](docs/governance/evolution.md) 记录缘由、影响与迁移。

## 仓库地图

| 位置 | 保存内容 |
|---|---|
| [kit](kit/README.md) | 已采纳规则、可选参考、使用契约和能力目录 |
| [scenarios](scenarios/README.md) | 独立业务闭环与验收定义，当前提供模板 |
| [demos](demos/README.md) | 演示实现与施工交接；视觉语法工场与并行施工现场，运行验收见项目回执 |
| [templates](templates/README.md) | 入账、材料 brief 与 demo 蓝图 |
| [docs](docs/README.md) | 架构理由、治理规则、裁决和验收回执 |
| [vault](vault/README.md) | 研究登记、提炼、来源、快照与 Chat 备查 |
| [palantir](palantir/README.md) | 一级主题/提炼入口；材料参考见 [references](palantir/references/README.md)，已有候选笔记，尚无主题正文与 Kit 采纳 |
| [tally](tally/README.md) | 一级主题/提炼入口；材料参考见 [references](tally/references/README.md)，当前仅登记，尚无完成提炼 |
| [scripts](scripts/README.md) | 生成消费索引与检查仓库一致性 |

验证：`python3 scripts/validate_repository.py`；[验收记录](docs/verification/README.md) 记录各批覆盖与缺口。

远端：[lesPrivilege/Praxis](https://github.com/lesPrivilege/Praxis)。本地目录为 `Praxis`。
