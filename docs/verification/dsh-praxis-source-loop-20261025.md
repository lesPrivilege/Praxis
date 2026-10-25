# dsh-praxis 来源闭环 · 2026-10-25

基线：`a2f2b6d`。取舍见 [ADR-040](../decisions/040-dsh-praxis-source-loop.md)。

## 已验证

| 范围 | 怎样验证 | 结果 |
|---|---|---|
| core 与适配层 | `node --test dsh-praxis/core/*.test.mjs dsh-praxis/adapters/*.test.mjs`，临时小仓库与模拟宿主 | 25 项通过 |
| 命令行、MCP 与真实构建脚本 | `python3 scripts/check_praxis_acceptance.py` | 13 项通过；`source_loop` 走完登记、挂载、resolve、consume、来源条目，references catalog 上的新关系经重建仍在 |
| 每页来源一处 | `python3 scripts/validate_repository.py`，新规则：Kit 页引用已登记来源的卡片，就要在它的 `grammar_paths` 里 | 施工前 45 处违反；补关系后通过 |
| registry 重建 | 补关系前后与 `HEAD` 的 registry 逐条比较 | 来源 ID 不变；只有关系所在的记录变化 |
| 项目索引 | 用 `praxis_register_index` 登记 `jev/research/sources.json`，主张取自 `claims.jsonl` | 236 条进入名册，186 条带摘录（共 288 条主张）；`jev/` 下文件未改 |
| 控制面 | 应用内浏览器（端口 7879）：一条挂载的来源条目、登记表单 | 显示收录缘由、挂在哪些页面、服务的任务类型、读过它的运行；表单要求“为哪件任务收录”；无控制台错误 |

## 补上的关系

45 条，分布在 14 个文件：

| 文件 | 条数 |
|---|---|
| `vault/references/catalog.json` | 17 |
| `design-grammar-atlas-20261002` 的 catalog | 7 |
| 其余 12 个文件 | 21 |

这 45 处都是 Kit 页面正文里已经引用、记录上缺这一页的来源。它们当中 41 处所在的记录，原先的构建脚本根本不带关系。`cw-frontend-references` 与 `writing-structure-20260927` 两个 catalog 是手工排版的，用文本插入，diff 只有新增的关系。

## 没有验证

- **素材是否帮到交付。** 需要一件真实任务：resolve 拿到素材，按定位回原件，consume 记下读过的来源，再与不用素材的做法对照。本轮没有做。
- **DSH 桌面里的新工具。** 插件代码在 DSH 启动时加载，要重启后由 DSH 里的 agent 调用 `praxis_resolve`、`praxis_source`、`praxis_capture`、`praxis_register_index`、`praxis_consume` 再看。
- **refresh 覆盖。** 补上关系后 328 个已挂载来源只有 7 个有快照，“来源已变”的信号对其余来源不起作用。
- **挂载说明。** Design 的 78 条挂载里 76 条照抄来源概要，没有按位置改写。
