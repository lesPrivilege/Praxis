# Praxis

企业工作、专业交付与个人工作系统的知识和契约库。当前提供任务指南、场景模板、来源提炼与治理规则；运行应用和共享组件尚未实现。

## 开始工作

| 当前任务 | 从这里开始 | 得到什么 |
|---|---|---|
| 了解陌生业务、判断机会 | [工作全景](kit/landscape.md) → [现场闭环](dsh-praxis/kit/task/field-loop.md) | 问题、基线、替代方案与启动条件 |
| 定义一次验证或试点 | [场景模板](templates/scenario/README.md) | 对象、动作、证据、验收与接收责任 |
| 写汇报、memo、deck 或 HTML | [Task](dsh-praxis/kit/task/README.md) → [Writing](dsh-praxis/kit/writing/README.md) + [Publish](dsh-praxis/kit/publish/README.md) + [Design](dsh-praxis/kit/design/README.md) | 明确材料目的，完成文字、编排与视觉表达 |
| 整理会议、项目状态与后续工作 | [工作系统](kit/work-system/README.md) | 候选变化、确认状态与下一责任 |
| 在新环境消费 Kit | [Environment](kit/environment/README.md) | 能力盘点、权限范围与消费计划 |
| 设计软件视觉与交互、编排可视化 | [Design](dsh-praxis/kit/design/README.md)；需要依据时查 [参考路由](dsh-praxis/kit/design/references/README.md) | 可选做法、适用规则、依据与设计产出 |
| 撰写或改定对外中文成文 | 项目 skill `writing`（`.claude/skills/writing/SKILL.md`）→ [Writing](dsh-praxis/kit/writing/README.md) | 按写作原理成文，附审阅裁决 |
| 将阅读材料制成视频、查旧片的施工经验 | [Publish / video](dsh-praxis/kit/publish/video/README.md) | 分镜、表现参考、旧项目的消费与验收 |
| 维护来源挂载与预设，或看一件任务该读什么 | [Praxis 控制面](dsh-praxis/ui/README.md)：DSH 右侧栏“Praxis”，agent 用 MCP 工具 `praxis_*` | 单元清单、取用说明、运行记录 |
| 画股权结构图并导出 SVG | [股权结构图](tools/equity-chart/README.md)，[工具目录](tools/README.md) | 离线单文件，自动排版与换行，透明背景原生 SVG |
| 查定义、接口与验收要求 | [Kit](kit/README.md) | 对应契约与检查项 |

## 仓库地图

知识只沿一个方向流：`vault → docs/decisions → kit → projects`；反向只有登记（[ADR-044](docs/decisions/044-repository-layout-by-role.md)）。

| 流 | 保存内容 | 入口 |
|---|---|---|
| [kit](kit/README.md) | 已采纳规范：任务入口、契约、能力目录；内容表达四层在 [dsh-praxis/kit](dsh-praxis/kit/README.md) | 做一件任务从这里选分支 |
| [vault](vault/README.md) | 证据：来源卡、快照、提炼、原 Chat | 查证来源、读已消费的研究 |
| [docs](docs/README.md) | 裁决与回执：架构、治理、ADR、验收 | 维护仓库、查取舍缘由 |
| [projects](projects/README.md) | 一切交付与实验：教材、讲解页、视频、语法工场，各有 README 说明做到哪 | 看成品、接手施工 |
| [dsh-praxis](dsh-praxis/README.md) | 控制面：DSH 插件、MCP、命令行与运行账本 `data/` | 维护来源挂载、预设、项目与产物 |
| [scripts](scripts/README.md) · [tools](tools/README.md) · [templates](templates/README.md) | 索引生成与检查、独立工具、场景与材料模板 | 按需 |

`work/` 放下载件与临时渲染，不入库。研究与维护的任务入口在 [docs](docs/README.md)。

**Goal：让工作环境、业务探索和专业交付，都从已消费的证据、清楚的工作语义和可复用契约起步；让本次工作的有效增量提高下一次工作的起点。** 第一性原理见 [架构理由](docs/architecture/rationale.md#goal-与第一性原理)。

验证：`python3 scripts/validate_repository.py`；[验收记录](docs/verification/README.md) 记录各批覆盖与缺口。

远端：[lesPrivilege/Praxis](https://github.com/lesPrivilege/Praxis)。本地目录为 `Praxis`。
