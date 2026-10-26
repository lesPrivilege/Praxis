# 目录迁移映射 · 2026-10-26

按 [ADR-044](../decisions/044-repository-layout-by-role.md)与[迁移工单](repository-layout-migration.md)第一、二阶段执行。全部用 `git mv`，历史可用 `git log --follow` 追；旧路径不留转向文件，已引用的链接一次改到新位置。

| 旧路径 | 新路径 | 说明 |
|---|---|---|
| `demos/<name>/` | `projects/<name>/` | 17 个演示实现逐个平移；`demos/quant-fieldguide` 在途，暂留 |
| `demos/README.md` | `projects/README.md` | 重写为项目索引；`demos/README.md` 改为过渡说明 |
| `scenarios/_template/` | `templates/scenario/` | 场景契约模板 |
| `scenarios/saas-engineering-textbook/` | `projects/saas-engineering-textbook/scenario/` | 与同名 demo 合并 |
| `scenarios/README.md` | 并入 `projects/README.md` | 目录删除 |
| `jev/` | `projects/jev/` | |
| `palantir/` | `projects/palantir/` | 含 `reading-list-series` |
| `tally/` | `projects/tally/` | |
| `books/` | `projects/books/` | |
| `dsh-praxis-explainer/` | `projects/dsh-praxis-explainer/` | 补 README |
| `lean-readme.md` 等四个根目录 capture 原件 | `work/` | 不入库；卡片在 `vault/provenance/praxis-captures/` |
| 根 README 的“研究与维护”表 | `docs/README.md` | |
| 根 README 的“Goal 与第一性原理”正文 | `docs/architecture/rationale.md` | 根页只留 Goal 一句 |

不迁：`dsh-praxis/kit` 与 `dsh-praxis` 保持原位，第三阶段由 [ADR-045](../decisions/045-praxis-and-dsh-praxis-relations.md)撤回。2026-10-26 稍后 `demos/quant-fieldguide` 也迁入 `projects/quant-fieldguide`，`demos/` 删除。

登记改动：`dsh-praxis/data/projects.json` 与 `artifacts.json` 的仓库相对路径同步改写；`runs/` 与 `history.jsonl` 是历史记录，保留旧路径。`vault/registry.json` 重建。
