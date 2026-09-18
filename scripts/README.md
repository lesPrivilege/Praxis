# Repository checks

运行 `python3 scripts/validate_repository.py` 检查受治理目录入口、Markdown本地链接、JSON解析、Chat轮次和快照hash。来源快照中的原有文档结构不强制添加README或改写链接，避免污染原件；其消费入口由vault维护。

此检查不证明外部主张正确，也不执行来源HTML或应用。来源核查状态与离线依赖分别查看各批次登记。

外部登记完成或更新后运行 `python3 scripts/build_registry.py` 生成统一字段的 `vault/registry.json`，再运行验证。各来源catalog是编辑入口，registry是消费投影；不手改生成索引。

快照入账后运行 `python3 scripts/build_snapshot_manifest.py`，它会复核intake原件hash并冻结当前快照摘要；已登记路径内容发生变化时拒绝静默刷新，改用新版本路径。随后运行主验证脚本。

来源catalog更新后先运行 `python3 scripts/render_source_cards.py` 同步中文卡片与目录索引，再运行registry构建和验证。

新Chat或增量：先把新版本加入 `vault/intake/chat-captures.json`，运行 `python3 scripts/build_chat_inventory.py`；旧快照不覆盖。后续registry、来源卡生成自动发现新增provenance/catalog.json与work-system增量manifest。
