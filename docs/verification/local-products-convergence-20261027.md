# 本地产物三类与收敛 · 2026-10-27

基线：ADR-047 那一轮的工作树（未提交）。决定见 [ADR-048](../decisions/048-local-products-and-convergence.md)。主会话（Claude Opus 5.5）实现、迁移与验证；grammar-demos 的对页映射由一个 Sonnet 子代理初拟（42 条有页、3 条无页），主会话去掉 3 条偏弱的映射。

## 改了什么

- **产物种类**：`delivery`、`pipeline`、`example`，加 `serves`；`made_with` 指向 pipeline 产物；`praxis_artifact_update` 可改种类与服务页。
- **resolve**：网页素材之后给 `exemplars`，每类至多三件、共至多八件；delivery 要最新版经 accepted 才给。
- **review**：挂载、编目与产物各存一个 `review`。
- **upkeep**：去掉 `stale` 与 `projects`。
- **工具说明**：`praxis_capture`、`praxis_file` 带编目规则；`praxis_consume`、`praxis_artifact_update` 带本地产物规则。
- **控制面**：
  - 产物页按交付、管线、范例筛选，详情列“服务的页”；
  - 任务页在素材后列“范例与管线”；
  - 记录页不再列过期运行与未登记的最终产物。
- **数据**：
  - 50 条 trace 记录离开；
  - 13 件 trace 改为 example 或 pipeline，6 件由 README 代表的改指成品；
  - 5 条 vault 管线改为 pipeline 产物，来源包声明的 5 条挂载标为移除，8 处 `made_with` 改指；
  - grammar-demos 43 条作 example，39 条挂页；
  - emil-design-eng 登记为网页来源 `github.com/emilkowalski/skills`；
  - 135 条记录的 review 数组收成一条。
- **结果**：
  - 产物：交付 26（4 件写了服务页，待接受）、管线 8、范例 55（51 件写了服务页）；
  - upkeep 为空。

迁移前的 `artifacts.json`、`bindings.json`、`catalog.json`、`sources.json`、`history.jsonl` 与运行记录备份在会话临时目录。删除的每条记录全文写进了 `history.jsonl`。

## 验证

| 范围 | 结果 |
|---|---|
| `node --test core/*.test.mjs adapters/*.test.mjs` | 33 项通过。改写的测试覆盖：pipeline 产物与 `made_with`；example 不受项目布局约束；delivery 接受后才进入范例；resolve 先素材后范例；只留最近一次 review；过期运行与未登记最终产物不进 upkeep |
| `node dsh-praxis/release/walkthrough.mjs` | 15 项通过 |
| `python3 scripts/check_praxis_acceptance.py` | 通过 |
| `python3 scripts/validate_repository.py` | 通过 |
| 实际数据上的 resolve | `design/composition/encoding` 加 `publish/video`：素材 9 条，范例 6 件（管线 3、范例 3） |
| 控制面（浏览器，7878） | 记录页“需要处理”为 0，标签上没有数字；产物页四个筛选（全部 89、交付 26、管线 8、范例 55）；范例详情列服务的页；任务页列“范例与管线”；控制台无报错。没有在页面上提交写入 |

## 没有处理

- DeerFlow 讲解页、AgentScope 第三版成片、MC01、A3 四件交付等主人 review 接受。
- grammar-demos 的 4 个条目没有挂页。
- Write Kit 无声片的成片不在本机（`out/` 是生成物，不入库），只登记了管线。
