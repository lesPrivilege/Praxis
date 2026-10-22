# 迁移映射

`kit/` 的内容表达部分已按分支迁入 `dsh-praxis/kit/<层>/`，旧路径已删除，不留导航入口。Design 与 Materials 数据层还没有迁。企业工作与环境部分不在本插件范围内，留在 `kit/`。

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

## 还没迁

| 现在的位置 | 去向 | 为什么等 |
|---|---|---|
| [kit/design/](../kit/design/README.md) 下 foundations、composition、interaction、motion、marks | Design：同名分支 | 仓库里两百多个文件链接 `kit/design/`，其中来源 catalog 的 `grammar_paths` 要换成 Binding；与数据层一起做，不单独先搬 |
| [kit/design/references/](../kit/design/references/README.md) | Materials：目录视图 | 路由页与 `curated/` 卡片今天是手写目录，数据层建好后由 Binding 生成；`curated/` 卡片成为 `priority: preferred` 的 Binding 题解 |
| `kit/design/grammar.md`、`references.md` | 删除 | 旧路径入口，随 Design 迁移删除 |
| `vault/provenance/**/catalog.json` | Materials 权威数据 | 原地读取；Binding 从 `grammar_paths`、`grammar_ids` 拆出，见 [对象与操作](objects.md#现有数据怎样对上) |
| `kit/` 其余：AGENTS.md、Agent.md、landscape.md、adapters、contracts、environment、grammar、ui、verification、work-system 其余 | 不迁 | 企业工作与环境；打包与恢复时引用 [workspace 契约](../kit/environment/workspace-contract.md) |

每一步的完成条件：文件迁入新位置，旧路径删除；维护中的链接改指新位置，历史记录只改链接目标；`python3 scripts/validate_repository.py` 通过；用一件真实任务从新入口走一遍，记下读了哪些单元、哪里找不到。

## 迁移之外的实现切片

数据层（Source、Binding、MaterialRevision 的存储与六个操作）、MCP、DSH 插件、控制面 UI，以及 Preset、Run、Artifact，与 Design 迁移一起开始，顺序沿用评审记录 v0.2 的切片：先 Design 来源闭环，再用一条真实 Writing + Publish 交付验证运行记录，然后接 Video 与独立的 Reporting 存储，最后打包与恢复。DSH 的插件包、侧栏与 MCP 能力要先在本机安装版本上核对。
