# 迁移工单：目录按角色分流

状态：2026-10-26 编制，依据 [ADR-044](../decisions/044-repository-layout-by-role.md)（proposed）。三个阶段串行；每阶段开工前用户确认，完工写一份验收回执进 [docs/verification](../verification/README.md)。本轮只编制，不搬文件。

## 原则

- **先登记，后搬动。** 每次搬动前，涉及的项目与产物已在 `control/data`（今 `dsh-praxis/data`）登记，搬完只改 `root` 与路径，版本、hash、review 不变。
- **一次搬一类。** 不把目录搬动和内容修订混在一个提交里。
- **旧路径留映射。** 按 [迁移映射](../../dsh-praxis/migration.md)的体例记旧新路径；已被引用的旧路径改链接，不留转向文件。
- **每阶段跑过一轮真实交付再进下一阶段。**

## 第一阶段：清根目录，立规矩（不搬项目）

目标：根目录只剩路由文件、现有一级目录和新建的 `work/`；校验能挡住新的散落。

| # | 工作 | 文件 | 完成标准 |
|---|---|---|---|
| 1.1 | 四个 capture 原件归位 | `lean-readme.md`、`qlib-readme.md`、`rdagent-readme.md`、`tradingagents-readme.md` → `vault/snapshots/praxis-captures/<slug>/`；catalog 对应记录加 `snapshot_path`；`vault/snapshot-manifest.json` 加 hash | 根目录无 `*-readme.md`；validator 的快照 hash 复核通过 |
| 1.2 | 新建 `work/` | `.gitignore` 加 `/work/`；`AGENTS.md` 一句：下载件与临时渲染放 `work/` | 目录存在且被忽略 |
| 1.3 | 根目录白名单 | `scripts/validate_repository.py`：`OWNED` 改为白名单，非白名单的根条目报错 | 当前仓库通过；在根目录放一个测试文件会报错 |
| 1.4 | 项目布局校验 | validator 读 `projects.json`，对每个已登记项目检查文件是否落在某个角色的 glob 或为 README；新项目报错，老项目报警告 | 五个已登记项目全部有输出，无误报 |
| 1.5 | 项目布局加两个角色 | `control/core` 的模板 `standard` 加 `evidence/**`（进 Git）与 `tmp/**`（忽略）；`praxis_project` 登记时接受这两个角色 | `node --test` 新增用例通过 |
| 1.6 | 未登记的根级项目登记 | `dsh-praxis-explainer` 已登记；`books`、`tally`、`palantir`（除书单系列）、`scenarios/saas-engineering-textbook` 按现有结构登记 | `praxis_projects` 列出它们，`misplaced` 只报真实例外 |
| 1.7 | capture 写快照的默认位置 | `praxis_capture` 的 `keep` 固定写到 `vault/snapshots/praxis-captures/<slug>/` | 测试覆盖；手工 capture 一条验证 |

不做：不动 `demos/`、`jev/`、`palantir/` 的位置；不改 Kit 正文；不改根 README 的表。

## 第二阶段：建 `projects/`，迁入交付与实验

目标：一切交付与实验在 `projects/` 下，根目录不再有主题目录。

| # | 工作 | 文件 | 完成标准 |
|---|---|---|---|
| 2.1 | 建 `projects/README.md` | 一张“项目 → 是什么 → 做到哪 → 东西在哪”表，从今天的 `demos/README.md` 与根 README 研究表合并 | 每个项目一行，链接通过 |
| 2.2 | `git mv` 迁入 | `jev`、`palantir`、`tally`、`books`、`dsh-praxis-explainer`、`demos/*`、`scenarios/*`（`_template` 留 `templates/`） | 一次提交一类；`git log --follow` 可追 |
| 2.3 | 改登记 | `projects.json` 的 `root`；`artifacts.json` 里仓库相对路径；`runs/*.json` 里的路径只读不改（历史记录） | `praxis_artifacts` 全部可定位；`praxis_stale` 不因搬动新增 |
| 2.4 | 改链接 | 根 README、`docs/architecture/README.md`、`vault/README.md`、各 ADR、Kit 正文里指向这些目录的相对链接 | validator 无 Broken link |
| 2.5 | 改运行配置 | `.claude/launch.json` 的目录参数；`.gitignore` 里按 demo 列的规则改为按 `projects/*/build/**`、`projects/*/tmp/**` | 每个 launch 配置可起 |
| 2.6 | 根 README 收成一张表 | 五行表；原则移到 `docs/architecture/rationale.md`；研究与维护表移到 `docs/README.md` | 根 README 一张表加一句 Goal |
| 2.7 | 迁移映射 | `docs/governance/repository-layout-map.md`：旧路径 → 新路径 | 每个被搬目录一行 |

不做：不动 `dsh-praxis/`；不改 Kit 正文内容。

## 第三阶段：Kit 归一，控制面独立

目标：只有一个 `kit/`；`dsh-praxis/` 改名 `control/`，只剩代码、数据与插件文档。

| # | 工作 | 文件 | 完成标准 |
|---|---|---|---|
| 3.1 | `dsh-praxis/kit/{task,writing,publish,design}` → `kit/` | `git mv`；`kit/README.md` 把“已迁入 dsh-praxis Kit”一段改为直接入口；`layers.md` 随 Kit 走 | `praxis_resolve` 对每个任务类型跑一遍，单元路径全部解析 |
| 3.2 | `dsh-praxis/` → `control/` | `git mv`；`.mcp.json`、`launch.json`、`scripts/check_praxis_acceptance.py`、DSH 插件清单里的路径 | `node --test` 通过；DSH 重装插件后右侧栏可用 |
| 3.3 | core 的 Kit 根路径改为配置 | 与 [下一轮工单](../../dsh-praxis/work-order.md) B1 合并：数据根与 Kit 根各一个配置项 | 仓库模式与插件模式各跑一次 fresh 走查 |
| 3.4 | 改链接与映射 | 61 页 Kit 正文的相对链接；`migration.md` 补本次映射 | validator 通过 |
| 3.5 | 收尾 | `docs/architecture/README.md` 的内容归属表按五条流重写；`AGENTS.md` 两条路的入口随之改 | 走读两条路各一次 |

不做：Kit 正文的自足（包内不链包外）留给 B3；release 打包留给 B7。

## 顺序与依赖

```
1.1–1.7 ──▶ 一轮真实交付 ──▶ 2.1–2.7 ──▶ 一轮真实交付 ──▶ 3.1–3.5
```

- 第一阶段各项互不依赖，可并行；1.4 依赖 1.5 的角色定义。
- 第二阶段 2.3 必须紧跟 2.2 在同一提交，否则登记与文件分离。
- 第三阶段 3.3 与 release 的 B1 是同一件事，由谁先做由用户定。

## 风险与未决

- `vault/snapshots/praxis-captures/` 今天不存在；capture 的 `keep` 当前写到哪里要先读 core 确认，再定 1.7 的改法。
- 老项目的 `build/` 是否进 Git，按项目逐个决定；`palantir/reading-list-series` 的成片与配音 2.6 G 已在历史里，搬动不减体积。
- 另一个会话可能同时在这个 checkout 工作；搬动前确认没有未提交的改动落在被搬目录。
- 本工单的 ADR 状态为 proposed；用户裁决前，第一阶段的 1.1 与 1.2 可以先做，其余等裁决。
