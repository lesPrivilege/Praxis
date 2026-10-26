# 目录按角色分流 · 2026-10-26

依据 [ADR-044](../decisions/044-repository-layout-by-role.md)与[迁移工单](../governance/repository-layout-migration.md)第一、二阶段。主会话（Claude Fable 5.1）执行；过程性文件的清点由一个只读 Sonnet 子代理完成，删除由主会话决定。

## 检查

| 项 | 结果 |
|---|---|
| `python3 scripts/validate_repository.py` | pass；0 错误，131 条 `misplaced` 警告（老项目，未启用 `layout_enforced`） |
| `node --test core/*.test.mjs adapters/*.test.mjs` | 27 项通过 |
| `praxis_projects` | 9 个项目全部可定位；jev 11 件、dsh-praxis-explainer 2 件、书单系列 7 件产物按新路径解析 |
| 根目录 | 只剩白名单条目；`demos/` 为过渡目录，只含在途的 `quant-fieldguide` |
| 旧目录 | `jev`、`palantir`、`tally`、`books`、`scenarios`、`dsh-praxis-explainer` 已不存在 |
| launch 配置 | 路径改写；未逐个启动验证 |

## 已删除

| 文件 | 依据 |
|---|---|
| `projects/drift/evidence/` 根级 12 张 png 与 2 个结构 JSON（1.1 M） | `verify.py --screenshots` 重跑即覆盖；带日期的 `acceptance-20261005/` 保留；只有目录内 README 引用，已改写 |
| `projects/agentscope-enterprise-film/cut3/design/failed-retime-attempt.txt` | 自述“不作为重建入口”，无引用 |

## 第二次清理（同日，用户裁定）

用户裁定把下表全部删掉。27 个路径已 `git rm`，登记在 [retired-paths.json](../governance/retired-paths.json)；31 个 Markdown 文件里的链接改为纯文字并各加一行删除说明，三处只为指向这些文件而存在的条目删去；ADR 原文不动，validator 对 `docs/decisions/` 指向已登记退役路径的链接放行。三个相关脚本都保留：`check_repair_media.py` 与 `svg-01-relations/src/check.mjs` 自己生成被删的帧目录和 `probe.html`，重跑即重建；`visual-diff-20261015/capture.py` 的三个源帧已删，不能再复现它那五张图里的三张，作历史记录。`.claude/launch.json` 的 11 个配置路径逐个核对存在，没有启动。

| 文件 | 大小 | 原引用自 |
|---|---|---|
| agentscope `quality/playback-part1..4/` 取帧 | 124 M | 四份 `playback-part*.md` 回执 |
| agentscope `quality/cut2-state-frames/` | 23.5 M | `cut2-state-acceptance.md`、`visual-diff-20261015/capture.py` |
| agentscope `quality/repair-media-frames/` | 3.7 M | `check_repair_media.py`、`cut2-independent-review.md` |
| agentscope `quality/*-lab-handoff.md`、`content-v2-handoff.md` | 44 K | `quality/README.md` |
| agentscope `cut3/evidence/final/`、`cut3/evidence/playback/`、`cut2/evidence/` | 56 M | 各自 README |
| `drift/design-handoff.md` | 5 K | README、`product.md`、`design-polish.md` |
| `editable-native-svg/wake-opus.md`、`claude-design-order-20261012.md`、`svg-01-relations/evidence/probe.html` | 576 K | README、ADR-031/032、`docs/verification`、`marks/checks.md` |
| `motion-ceiling-lab/wake-opus.md`、`visual-grammar/wake-opus.md` | 8 K | README、`docs/verification` |
| `visual-grammar/a3-event-state-context/acceptance.html` | 1.0 M | README |
| `saas-engineering-textbook/build/*-brief.md`、`deerflow-explainer/research/BRIEF.md` | 28 K | README、ADR-031、`visual-spec-diff-20261015.md` |
| `dsh-praxis/work-order-artifacts.md` | | `work-order.md`、README、ADR-039/040 |

不入库、只占本机磁盘的生成物另有 3.6 G（palantir 成片 2.6 G、agentscope mp4 650 M、visual-grammar webm 204 M、node_modules 245 M），按需手动清；金字塔第四版的音频在 `FREEZE.sha256` 里，删了冻结校验会失败。

## 第二轮（同日）：worker 收尾与裁决

四个 worker 并行，主会话逐项裁决；用户中途裁定 DSH 插件为单独开发任务，本轮不做。

| 项 | 结果 |
|---|---|
| quant-fieldguide（Sonnet） | 在途项目停工后迁入 `projects/quant-fieldguide`，README 如实写“底稿阶段，没有最终产物”，登记 root 改到新位置；`demos/` 删除，validator 白名单去掉 `demos` |
| 项目登记（Sonnet） | 13 个迁入的演示全部登记，布局按现有结构写；agentscope、书单系列、jev 的布局补齐；`misplaced` 警告 131 → 0。worker 登记时 core 短暂带着 `evidence`/`tmp` 角色，主会话把这两个键从 `projects.json` 直接删掉（26 处），使数据与 main 的 core 一致 |
| core 角色与快照位置（Sonnet） | 实现并通过 28 项测试与验收探针，但按用户裁定不并入 main，整体留在分支 `wip/dsh-praxis-layout-roles`（087baaf） |
| launch 与脚本（Haiku） | 11 个 launch 配置路径都存在，无需改；三个脚本中两个自己生成被删目录，一个作历史 |
| 关系澄清 | [ADR-045](../decisions/045-praxis-and-dsh-praxis-relations.md)：七个名字一张表；两个 Kit 不合并；ADR-044 第三阶段撤回 |

主会话一次操作失误：切分支时把 worker 已暂存的 quant-fieldguide 迁移带进了 wip 提交，并让 `demos/` 回到 main；已用临时 worktree 改写 wip 提交、在 main 重做迁移，两边核对后 validator 通过。

## 没有做的

- 第三阶段已由 ADR-045 撤回。
- books 与 saas-engineering-textbook 等项目的最终产物未逐件登记为产物，`praxis_projects` 的 `unregistered` 列出它们；逐件登记属于控制面接管产物时做。
- 工单 1.5 与 1.7 的实现在 `wip/dsh-praxis-layout-roles`，未并入；插件开发另立任务。
- 两个提交及本轮未推送。
