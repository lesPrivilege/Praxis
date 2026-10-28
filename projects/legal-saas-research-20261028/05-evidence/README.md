# 证据目录说明

- `source_ledger.json` 与 `source_ledger_full.csv` 是按 URL 去重的全局来源视图，用于检索和复查；合并时可能保留一个代表 `source_id` 或把 `source_id` 置空，不保证可用任一产品内 alias 做全局反查。
- 各产品 JSON 中的 `source_id` 和引用关系才是产品级权威机器指针。不要用全局 URL 去重结果覆盖产品内来源身份。
- `source_ledger.csv` 是研究启动时保存的人工高优先级账本，不是完整来源集合。
- `visual_observation_ledger.*` 保存独立云端 worker 的图像观察；`visual_handoff_manifest.json` 将编号映射到父任务持有的图像 ZIP 文件名。
- `screenshots/`、`raw/`、`visual/` 的 README 记录跨执行环境附件边界；在父任务合包前，本 executor 没有图像字节。
