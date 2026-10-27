# 来源编目与本地材料转 trace · 2026-10-27

基线：`c0ebb5b`。决定见 [ADR-047](../decisions/047-source-catalog-and-traces.md)。主会话（Claude Opus 5.5）实现、迁移与验证，没有派子代理。

## 改了什么

- **集合的成员账目**：集合的来源条目列出上游全部成员链接，按已登记、不收录、未处理筛选。未处理的可以登记或写理由不收录，已登记的点开即是它的条目。`praxis_source` 对集合返回 `members.ledger`。
- **编目**：新增 `catalog.json` 与 `praxis_file`、`praxis_catalog`，`praxis_review` 也能 review 编目；capture 只收网页，形态与 description 必填；挂载的 description 缺省时沿用编目的；upkeep 的 `unbound` 换成 `unfiled` 与 `sources`。
- **trace**：产物加 `kind` 与 `informs`；trace 可在项目之外，不出 `misplaced`；consume 可登记 trace。
- **控制面**：
  - 新增“来源”页；
  - 来源条目可编目、review；
  - 登记表单去掉定位，加形态与说明；
  - 产物页按交付与 trace 筛选，trace 详情列“当初依据了”；
  - 记录页列编目条目与编目放不下的来源。
- **数据**：
  - 81 条本地来源记录离开名册，其中 63 条转为 trace，带 76 条 `informs`；
  - 7 条书目由 vault 来源包承担；
  - 36 条网页来源全部编目；
  - Kit 挂载 282 → 197。

迁移前的 `sources.json`、`bindings.json`、`artifacts.json`、`history.jsonl` 备份在会话临时目录。删除的每条记录全文写进了 `history.jsonl`（`op: migrate-out`）。

## 验证

| 范围 | 结果 |
|---|---|
| `node --test core/*.test.mjs adapters/*.test.mjs` | 33 项通过。新增“编目与 trace”一项；改写 capture、upkeep、集合三项以覆盖只收网页、`unfiled` 与编目信号、成员账目 |
| `node dsh-praxis/release/walkthrough.mjs` | 15 项通过，新增 `catalog_files_by_area_and_form` |
| `python3 scripts/check_praxis_acceptance.py` | 通过 |
| `python3 scripts/validate_repository.py` | 通过 |
| 控制面（浏览器，7878） | “来源”页给出 6 个区域的纲目，点开区域列条目，点开条目出现编目、review、编辑、淘汰；成员账目 100 条（未处理 98、已登记 2），筛选与跳转可用；产物页 trace 63 件，trace 详情列出所依据的页；控制台无报错。没有在页面上提交写入 |
| upkeep | 挂载与编目信号为 0；15 个项目有未登记的最终产物、6 条过期运行，都是本轮之前就有的 |

## 没有处理

- Design 类书的收录：vault 来源包里约 300 条设计相关网页来源未编目，上一轮召回清单里约 60 条未登记，新的搜罗未做。
- emil-design-eng 暂为 trace，公开地址未找到。
- DSH 宿主里的插件未重启验证；改动后的工具表经 MCP 走查验证。
