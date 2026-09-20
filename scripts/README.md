# 索引生成与仓库检查

在仓库根目录运行下列命令。catalog 与 intake 是编辑源，registry、来源卡和清单是生成投影。

| 触发 | 编辑源 | 运行命令 | 生成物 |
|---|---|---|---|
| 新 Chat 或对话增量 | `vault/intake/chat-captures.json` 与版本归档 | `python3 scripts/build_chat_inventory.py` | `vault/chat-inventory.json` |
| 新来源或核查更新 | 各 `provenance/catalog.json` | `python3 scripts/render_source_cards.py` | 逐源卡与目录索引 |
| 入账与来源映射变更 | intake 与 catalog | `python3 scripts/build_registry.py` | `vault/registry.json` |
| 新增原件快照 | 对应 intake 的原始定位与 hash | `python3 scripts/build_snapshot_manifest.py` | `vault/snapshot-manifest.json` |
| 修改完成 | 当前工作树 | `python3 scripts/validate_repository.py` | 终端中的计数、错误与通过状态 |

同批新增 Chat、来源与快照时依次运行表中命令。provenance 子目录 catalog 自动发现；新材料类别须接入 registry 对应读取逻辑。

## 失败处理与覆盖

- 原件 hash 不符或已登记路径内容改变：保留旧原件，核对来源后以新版本路径入账。
- 索引过期：修改源登记，重新生成对应投影。
- 链接、身份或覆盖失败：修复错误列出的源记录，再运行验证。

验证检查受治理目录 README、Markdown 本地链接、JSON、Chat 消息覆盖和快照 hash。来源快照保持原字节，其导航由 Vault 维护。外部主张核查、renderer 离线依赖、应用行为与业务结果分别在 [分层验收](../kit/verification/README.md) 中记录。
