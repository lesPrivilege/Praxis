# Praxis

## Goal 与第一性原理

**Goal：让工作环境、业务探索和专业交付，都从已消费的证据、清楚的工作语义和可复用契约起步；让本次工作的有效增量提高下一次工作的起点。**

1. 从真实工作与要做的决定出发：对象、输入输出、规则、证据、人的判断先于工具和页面。
2. 扩大专业覆盖并保留问责：AI辅助结构化与判断，关键决定可由人复核，结论能够追溯。
3. 证据与推断分开：用户意图、来源事实、历史建议、本repo裁决分别登记；未知保持可见。
4. 先局部验证，再泛化：客户差异留在overlay；重复出现且有独立证据的能力才进入共享Kit。
5. 小的实现面、稳定的契约、开放的研究面：参考可持续扩充，技术选择可替换，不用规模证明成熟。
6. 本地可消费、持续可修订：结构化提炼为主入口，必要快照支持独立阅读；保留来源与旧版本，允许新增证据推翻旧判断。

这里的稳定是可依赖，不是一成不变。Goal本身也可在用户目标变化后修订，必须记录缘由和影响；原则、目录与选型通过 [增量与修订机制](docs/governance/evolution.md) 演进。

Praxis 是工作环境的能力索引与治理契约，将企业场景、产品 grammar、汇报设计与个人工作系统积累成可追溯、可复用的资产。当前版本是**治理与知识基线**：目录、契约、提炼和来源登记已先行，运行应用与共享组件尚未实现。

远端：[lesPrivilege/Praxis](https://github.com/lesPrivilege/Praxis)。本地目录当前仍名为 `enterprise-kit`；来源历史标题保持原样。

## 架构为何如此

当前用户确认不存在企业数据。面向未来工作，企业资料、身份权限、机器配置与运行状态有不同的归属和生命周期。Praxis因此采用分层的Kit与环境契约：公开规则和可复用资产留在Kit，真实企业资料与客户项目独立管理；后续执行环境必须落实相应边界。

Kit保存长期知识与契约，Skill作为具体任务的薄入口按需引用。更值得长期维护的是工作对象、状态、证据、人工review和验收标准；模型、harness及操作步骤可据实际效果替换。关于模型attention或未来训练路线的推测保留在研究层。

详细理由见 [架构编订](docs/architecture/rationale.md)，跨项目建议见 [消费分流](docs/governance/consumption-map.md)。当前仓库尚无bootstrap、权限执行系统或Courtwork Expert集成，文档声明不等于这些能力已经生效。

## 从这里使用

| 目的 | 入口 |
|---|---|
| 在新环境消费Kit、规划Expert或用量治理 | [Environment契约](kit/environment/README.md) |
| 看整体边界与依赖 | [架构](docs/architecture/README.md) |
| 开始企业 demo | [Kit](kit/README.md) → [场景模板](scenarios/_template/README.md) |
| 写汇报、memo 或 HTML 演示 | [汇报与设计](kit/reporting/README.md) |
| 整理会议、项目状态与工作工具 | [工作系统](kit/work-system/README.md) |
| 阅读已消费的材料 | [Vault](vault/README.md) → [主题提炼](vault/distilled/README.md) |
| 查外部实践 | [明确来源](vault/references/README.md) / [补充追溯](vault/provenance/README.md) |
| 新材料入账 | [入账规范](docs/governance/intake.md) |
| Agent 开工 | [kit/Agent.md](kit/Agent.md) / [AGENTS.md](AGENTS.md) |

先读结构化内容，再按需检查本地快照；原始 Chat 仅用于备查。Reference 的 BUILD 标签表示可消费方向，不代表安装或采纳。

## 目录

- `kit/`：采纳后的使用契约、产品与汇报 grammar；实现候选必须明确标注。
- `scenarios/`：独立业务闭环，保存客户/行业差异；本轮只有模板。
- `demos/`：未来可运行参考实现；客户项目与原始业务资料独立管理。
- `templates/`：未来 demo 的目录蓝图，不伪装为可运行 starter。
- `docs/`：架构、治理、决策与验收。
- `vault/`：登记、提炼、外部来源、本地快照、Chat 备查。
- `scripts/`：本地一致性检查。

治理：Luna 是首选 explorer，承担探索、摘要、登记与核查；Astra 负责边界、晋升和冲突裁决。详见 [治理入口](docs/governance/README.md)。

验收：[最新材料分类增量](docs/verification/2026-09-19-material-classification.md) · [初始发布覆盖与限制](docs/verification/2026-09-19-final.md)。

验证：`python3 scripts/validate_repository.py`。本仓库尚无应用测试或部署；不得把文档验证当成产品可用性验证。
