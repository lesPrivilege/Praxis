# Core

一套操作，DSH 插件、MCP 服务、命令行和控制面都调用它；入口是 [index.js](index.js)的 `createPraxis()`。

| 文件 | 管什么 |
|---|---|
| [kit.js](kit.js) | 从各层 Markdown 派生单元索引（ID、标题、description、语法 ID、版本），解析任务类型页的表格 |
| [materials.js](materials.js) | 来源（经 `vault/registry.json` 列出，详情回到 catalog）、挂载、收录、刷新快照 |
| [store.js](store.js) | JSON 存储：原子写、跨进程锁、按 revision 拒绝过期写入、追加式维护记录 |
| [presets.js](presets.js) | 每条流水线的预设字段与校验；只记密钥所在的环境变量名 |
| [backup.js](backup.js) | 控制面数据的导出、校验与恢复 |
| [index.js](index.js) | 入口、resolve、预设、consume、运行记录与 stale 检查 |

数据归属：来源事实与挂载关系（`grammar_paths`）在 `vault/provenance/**/catalog.json`；挂载上的维护信息（description、取用题解、启用、收藏、优先级、tag、review）、运行记录和维护记录在 [data](../data/README.md)。registry 与快照清单是派生的，写入后由 `scripts/build_registry.py`、`scripts/build_snapshot_manifest.py` 重建。

测试：`node --test core/*.test.mjs adapters/*.test.mjs`（在 `dsh-praxis/` 下）。core 测试在临时目录里的小仓库上跑，不碰真实数据。
