# 迁移映射

现有 `kit/` 的内容表达与设计部分按分支迁入 `dsh-praxis/kit/<层>/`。迁移期间两边并行：没迁的分支仍在 `kit/` 原处服务任务，迁完的分支删除旧路径，不留兼容入口。企业工作与环境部分不在本插件范围内，留在 `kit/`。

## 每个分支去哪里

| 现在的位置 | 新层与位置 | 怎样处理 |
|---|---|---|
| [kit/README.md](../kit/README.md) “内容表达与设计”一节 | Task 入口 | 改写成按任务类型选路；“企业工作与环境”“验收、来路与维护”两节留在原处 |
| [kit/reporting/](../kit/reporting/README.md) | Task：通用 brief 方法 | `grammar.md` 是 brief 方法正文；`assessment-answer-profile.md` 是旧迁移入口，删除 |
| [kit/work-system/field-loop.md](../kit/work-system/field-loop.md)、[field-governance.md](../kit/work-system/field-governance.md) | Task：FDE 工作主线 | 原文迁入；`work-system/README.md` 的其余内容留在原处，改为链接新位置 |
| [kit/write/publish/media-choice.md](../kit/write/publish/media-choice.md) | Task：选流水线 | 选什么媒介是任务层的决定 |
| [kit/write/README.md](../kit/write/README.md) | Writing 入口 | 三种强度与冲突次序随入口迁移；去往 Publish 与 Motion 的路由移到 Task 入口 |
| [kit/write/shared/evidence.md](../kit/write/shared/evidence.md) | Writing：底线（常驻） | 各层引用这一份 |
| [kit/write/prose/grammar.md](../kit/write/prose/grammar.md) | Writing：编辑启发式 + 语言约定 / zh | 拆开：第 6 条是中文语言约定，进 `zh`；第 4 条是证据底线在成文里的用法，并入底线；其余六条是对外技术成文的编辑启发式，进共用部分。英文分支能否沿用这六条，在第一份英文任务里检查后再写 |
| [kit/write/prose/format.md](../kit/write/prose/format.md)、[multilingual.md](../kit/write/prose/multilingual.md) | Writing：语言约定 | 格式按语言分；多语言页是语言之间的关系 |
| [kit/write/prose/argument.md](../kit/write/prose/argument.md)、[audience.md](../kit/write/prose/audience.md) | Writing：内容组织 | 原文迁入 |
| [kit/write/prose/genres/](../kit/write/prose/genres/README.md)、[microcopy.md](../kit/write/prose/microcopy.md) | Writing：文体 | 原文迁入 |
| [kit/write/prose/review.md](../kit/write/prose/review.md) | Writing：审阅 | 原文迁入 |
| [kit/write/prose/author-profile.md](../kit/write/prose/author-profile.md) | Writing：personal / 作者语体 | 默认关闭，开关条件不变 |
| [kit/write/publish/explainer.md](../kit/write/publish/explainer.md) | 拆到两处 | “整体图景从问题讲起”“共用机制只讲一处”换媒介仍成立，进 Writing：内容组织 / 机制讲解；结论层、章层与链接写法进 Publish / html |
| [kit/write/publish/](../kit/write/publish/README.md) 其余（README、composition、exhibits） | Publish / html：编排规范 | 原文迁入 |
| [kit/write/motion/](../kit/write/motion/README.md) | Publish / video：编排规范 | 分镜、信息驻留、音画分工；制作记录表随之迁移 |
| [kit/write/shared/verification.md](../kit/write/shared/verification.md) | Publish：共用检查 | 各流水线的检查从这里分出 |
| [kit/design/](../kit/design/README.md) 下 foundations、composition、interaction、motion、marks | Design：同名分支 | 结构不变，整体迁移 |
| [kit/design/references/](../kit/design/references/README.md) | Materials：目录视图 | 路由页与 `curated/` 卡片今天是手写目录，数据层建好后改为由 Binding 生成；`curated/` 卡片成为 `priority: preferred` 的 Binding 题解 |
| [kit/design/grammar.md](../kit/design/grammar.md)、[references.md](../kit/design/references.md)、[kit/writing/](../kit/writing/README.md)、`kit/write/shared/README.md`、`kit/write/prose/README.md` | 删除 | 旧路径入口或并入新入口 |
| `vault/provenance/**/catalog.json` | Materials 权威数据 | 原地读取；Binding 从 `grammar_paths`、`grammar_ids` 拆出，见 [对象与操作](objects.md#现有数据怎样对上) |
| [.claude/skills/writing/SKILL.md](../.claude/skills/writing/SKILL.md) | Writing 的薄入口 | 随 Writing 迁移改指新位置 |
| `kit/` 其余：AGENTS.md、Agent.md、landscape.md、adapters、contracts、environment、grammar、ui、verification、work-system 其余 | 不迁 | 企业工作与环境；打包与恢复时引用 [workspace 契约](../kit/environment/workspace-contract.md) |

## 顺序

1. **Writing。** 常驻层，且 `writing` skill 天天在用，最先迁能最早检验三级展开与语言分支。主要工作是拆开成文原理，以及把机制讲解从讲解页里分出来。
2. **Task。** Reporting、FDE 主线、媒介选择迁入；写出技术说明、工作报告两个任务类型。
3. **Publish。** `write/publish` 成为 html，`write/motion` 成为 video，共用检查分出。到这一步，Task 能完整地指向 Writing 与 Publish。
4. **Materials 数据层与 Design 一起。** 仓库外有 231 个文件链接 `kit/design/`，其中 18 个是来源 catalog 的 `grammar_paths`；Design 搬家必须同时把这些路径换成 Binding，所以与数据层切片一起做，不单独先搬。

每一步的完成条件：

- 文件迁入新位置，旧路径删除；
- 仍在维护的页面里的链接改指新位置；ADR、CHANGELOG、Vault 归档等历史记录只改链接目标，不改正文；
- `python3 scripts/validate_repository.py` 通过；
- 用一件真实任务从新入口走一遍，记下读了哪些单元、哪里找不到。

## 迁移之外的实现切片

数据层（Source、Binding、MaterialRevision 的存储与六个操作）、MCP、DSH 插件、控制面 UI，以及 Preset、Run、Artifact，在上面第 4 步开始实现，顺序沿用评审记录 v0.2 的切片：先 Design 来源闭环，再用一条真实 Writing + Publish 交付验证运行记录，然后接 Video 与独立的 Reporting 存储，最后打包与恢复。DSH 的插件包、侧栏与 MCP 能力要先在本机安装版本上核对。
