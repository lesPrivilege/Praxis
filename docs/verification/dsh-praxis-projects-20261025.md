# dsh-praxis 项目与产物位置 · 2026-10-25

基线：`12105ed`。[工单](../../dsh-praxis/work-order.md) A1，取舍见 [ADR-041](../decisions/041-dsh-praxis-projects.md)。

## 已验证

| 范围 | 怎样验证 | 结果 |
|---|---|---|
| core 与适配层 | `node --test dsh-praxis/core/*.test.mjs dsh-praxis/adapters/*.test.mjs` | 26 项通过 |
| 命令行、MCP 与真实构建脚本 | `python3 scripts/check_praxis_acceptance.py` | 14 项通过 |
| 试点登记 | 用 `praxis_project` 登记三个现有项目，没有挪动文件 | 布局都能用模式表达，见下表 |
| 控制面 | 应用内浏览器（端口 7879）的“产物”视图 | 按项目分组，项目头部显示未登记的最终产物，违例标“不在约定位置”；无控制台错误 |
| 仓库 | `python3 scripts/validate_repository.py` | 通过 |

## 三个试点

| 项目 | 布局 | 登记后看到的 |
|---|---|---|
| `jev` | 底稿 `draft/*.md`；中间 `site/src/**`；最终 `site/index.html`、`review-*.md` | 16 件产物；5 件不在约定位置：`research/` 的两份来源登记（已按引用进名册）、`site/build.py`、`site/src/page.html`、`site/README.md` |
| `reading-list-series` | 底稿各集 `narration.md` 与合集正文；中间 `build/**`、`film/**`、`out/*.wav`、`out/*.json` 等；最终 `out/*.mp4` | 0 件产物；7 个成片未登记（总论、五集与合集；生成物，不入库） |
| `dsh-praxis-explainer` | 最终 `index.html`、`style.css` | 2 件产物，都在约定位置 |

另有 2 件产物不在任何项目里：Kit 清理那一轮登记的 `dsh-praxis/kit/writing/principles.md` 与 `review.md`。

## 例外的处理

这 14 条都是旧登记或旧产出留下的真实例外，按用户指示处理：

| 例外 | 处理 |
|---|---|
| Jev 的 5 件（两份来源登记、构建脚本、构建源、README） | 产物记录标为已移除，可恢复；文件不动 |
| 2 件 Kit 页面 | 同上；Kit 单元另有自己的版本与历史 |
| 7 个成片 | 由运行 `2026-10-25-57d6cd2a` 一次登记为最终产物；底稿尚未登记为产物，所以没有写派生关系 |

处理后 upkeep 没有产物或项目的例外。

## 没有验证

- DSH 桌面里的新工具与分组视图：要重启 DSH 后再看。
- 一件新任务从开工就按项目交付的全过程：留给 A2 的管线和 A3 的真实任务。
