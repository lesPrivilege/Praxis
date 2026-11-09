# Release

发布前的回归检查：[walkthrough.mjs](walkthrough.mjs)，在包目录用 `npm run walkthrough` 运行，可选参数是放临时目录的位置。这个目录不随包发布。

走查模拟一次全新安装：只复制 `npm pack` 会发布的文件，给一个空的 DSH home、一个空工作目录和一个本机的上游作品集页面，再像 fresh agent 那样经 MCP 调用。只用合成材料，不写临时目录以外的地方。

| 检查 | 通过的条件 |
|---|---|
| `install_has_no_data` | 安装的文件里有 Kit，没有 `data/` |
| `shipped_links_resolve_inside` | 随包发布的 Markdown 里，相对链接都指向包内的文件 |
| `mcp_offers_tools_resources_prompts` | MCP 声明 tools、resources 与 prompts |
| `entry_from_the_package_kit` | 入口读的是包内 Kit，有任务类型，第一条 resource 是 `praxis://entry` |
| `prompt_starts_the_task` | 任务类型的 prompt 让 agent 先调用 `praxis_resolve` |
| `fresh_roster_is_empty` | 新名册没有素材，任务仍能取到单元 |
| `related_source_reaches_the_task_with_its_link` | 登记并挂上的来源出现在任务素材里，带原件 URL 与摘录定位 |
| `roster_files_by_category` | 按 Kit 分类能查到归了类的集合来源 |
| `catalog_files_by_area_and_form` | 来源编目在该区域下按形态列出登记的集合与成员，各带 description |
| `run_records_units_sources_and_session` | consume 记下读过的单元、来源和来源会话 |
| `finals_registered_and_in_place` | 底稿与成品登记在项目里，最终产物路径没有未登记的文件 |
| `artifacts_carry_roles_without_signals` | 产物带底稿或最终产物的角色，没有信号 |
| `upkeep_proposes_roster_revisions` | 上游集合新增与下线成员后，upkeep 列出两者 |
| `data_lives_in_the_plugin_folder` | 写下的数据都在 `$DSH_HOME/dsh-praxis` |
| `stock_survives_offline_original` | 来源备了一版库存，原件下线后，任务素材写明原件失效，并给出库存版本的目录 |
| `package_untouched` | 包目录里没有写入数据 |

输出一份 JSON（临时目录、是否通过、每项检查与观察值）；有检查不通过时退出码为 1，中途出错记为 `walkthrough_completed` 不通过。

## 迁移到独立的数据根

[migrate.mjs](migrate.mjs) 把这个仓库的数据根复制到一个空目录，并核对副本与原数据答得一样（ADR-050 第 4、5 步）：

```bash
node release/migrate.mjs data <新数据根>
```

原数据根只读。副本逐个文件照搬，另做四处改动：`settings.json` 的 `base` 写成绝对路径；按旧包路径（`dsh-praxis/kit/…`）声明 Kit 页的 registry 来源包，登记加上 `kit`，换到别处安装的包也能对上；挂在 stream 页上的挂载随数据根改名，`bindings.json` 与运行记录里的挂载跟着改，`history.jsonl` 保留原名；来源包记录的快照文件在、且 sha256 对得上的，导入为 `stock/` 的 download 版本，时间取记录的 `reviewed_at`（快照本身的时间没有记）。之后在两边对每个任务类型与流水线、每条 stream 和两两组合跑 `praxis_resolve`，比较挂载数、过期运行与 upkeep；除库存和 stream 页自己的路径外都要一致，不一致时退出码为 1。
