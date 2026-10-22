# 迁移映射

`kit/` 的内容表达与设计部分已按分支迁入 `dsh-praxis/kit/<层>/`，旧路径已删除，不留导航入口。Materials 的来源记录留在 `vault/provenance/`，由控制面读写。企业工作与环境部分不在本插件范围内，留在 `kit/`。

## 已迁移

| 原路径 | 新位置 | 处理 |
|---|---|---|
| `kit/write/README.md`、`kit/write/prose/README.md`、`kit/writing/` | [Writing 入口](kit/writing/README.md)、[Kit 入口](kit/README.md) | 三种强度与冲突次序进 Writing 入口；去往 Publish 的路由移到 Task 与 Kit 入口 |
| `kit/write/shared/evidence.md` | [证据与来源](kit/writing/evidence.md) | 常驻底线，各层引用这一份 |
| `kit/write/prose/grammar.md` | [成文原理](kit/writing/principles.md) + [中文语言约定](kit/writing/language/zh.md) | 第 6 条正文进 `zh.md`，原条目留一句指向，编号不变。第 4 条本就是底线在成文里的用法、已链向底线，留在原位 |
| `kit/write/prose/format.md`、`multilingual.md` | [语言约定](kit/writing/language/README.md) | 原文迁入 |
| `kit/write/prose/argument.md`、`audience.md` | [内容组织](kit/writing/organization/README.md) | 原文迁入 |
| `kit/write/publish/explainer.md` | [机制讲解](kit/writing/organization/mechanism.md) + [讲解页的编排](kit/publish/html/explainer.md) | 四问、整体图景、事实底稿和两条反例进 Writing；四层可见性、可调项和“条件收进折叠区”反例留 Publish / html |
| `kit/write/prose/genres/`、`microcopy.md` | [文体](kit/writing/genres/README.md) | 原文迁入 |
| `kit/write/prose/review.md` | [审阅](kit/writing/review.md) | 原文迁入 |
| `kit/write/prose/author-profile.md` | [作者语体](kit/writing/author-profile.md) | 默认关闭，开关条件不变 |
| `kit/reporting/README.md`、`grammar.md` | [Task 入口](kit/task/README.md)、[材料目的与组织动作](kit/task/brief.md) | 入口改写为按任务类型选路；`assessment-answer-profile.md` 删除 |
| `kit/work-system/field-loop.md`、`field-governance.md` | [现场闭环](kit/task/field-loop.md)、[驻场组织接口](kit/task/field-governance.md) | 原文迁入；`work-system/README.md` 留在原处，链接改指新位置 |
| `kit/write/publish/media-choice.md` | [选择表达媒介](kit/task/media-choice.md) | 选流水线是任务层的决定 |
| `kit/write/publish/` 其余 | [Publish / html](kit/publish/html/README.md) | 原文迁入 |
| `kit/write/motion/` | [Publish / video](kit/publish/video/README.md) | 原文迁入，制作记录表随之迁移 |
| `kit/write/shared/verification.md` | [内容与媒介验收](kit/publish/verification.md) | 两条流水线共用 |
| `.claude/skills/writing/SKILL.md` | 指向 [Writing](kit/writing/README.md) | 薄入口 |

新写的页：[Kit 入口](kit/README.md)、[Publish 入口](kit/publish/README.md)、[任务类型](kit/task/types/README.md)（技术说明、工作报告）、Writing 的语言与内容组织入口。

仍在维护的页面里的链接与标签已改到新位置；ADR、CHANGELOG、Vault 记录、验收与项目记录只改了 Markdown 链接目标，正文与其中记下的路径字符串保持原样。来源 catalog 的 `grammar_paths` 是维护中的数据，一并改了。

## Design 与 Materials

| 原路径 | 新位置 | 处理 |
|---|---|---|
| `kit/design/` 全部（foundations、composition、interaction、motion、marks、references） | [Design](kit/design/README.md) | 整体迁入，结构不变；来源 catalog 的 `grammar_paths`、SaaS 图谱与艺术软件图谱的索引随之改路径 |
| `kit/design/grammar.md`、`references.md` | 删除 | 旧路径入口 |
| `vault/provenance/**/catalog.json` | Materials 权威数据，原地 | 控制面读写：挂载关系在 `grammar_paths`，维护信息在 [data](data/README.md)，见 [对象与操作](objects.md#现有数据怎样对上) |
| `kit/` 其余：AGENTS.md、Agent.md、landscape.md、adapters、contracts、environment、grammar、ui、verification、work-system 其余 | 不迁 | 企业工作与环境；打包与恢复时引用 [workspace 契约](../kit/environment/workspace-contract.md) |

[Design 参考路由](kit/design/references/README.md)与 `curated/` 卡片仍是手写的目录页；控制面的目录是同一批挂载按单元排的另一个视图。

每一步的完成条件：文件迁入新位置，旧路径删除；维护中的链接改指新位置，历史记录只改链接目标；`python3 scripts/validate_repository.py` 通过；用一件真实任务从新入口走一遍，记下读了哪些单元、哪里找不到。

## 实现

数据层、MCP、DSH 插件与客户端、控制面和预设已实现，见 [Core](core/README.md)、[Adapters](adapters/README.md)、[控制面](ui/README.md)；取舍见 [ADR-038](../docs/decisions/038-dsh-praxis-control-plane.md)。还没做的：Video 流水线按预设真正调用 TTS 与渲染；独立 Reporting 存储作为模块接入；Kit 单元的 description review（目前只有挂载上的）。
