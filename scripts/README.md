# 索引生成与仓库检查

在仓库根目录运行下列命令。catalog 与 intake 是编辑源，registry 和清单是生成投影。来源卡分两种，由每份 catalog 的 `cards` 字段声明，见[来源卡由谁维护](#来源卡由谁维护)。

| 触发 | 编辑源 | 运行命令 | 生成物 |
|---|---|---|---|
| 新 Chat 或对话增量 | `vault/intake/chat-captures.json` 与版本归档 | `python3 scripts/build_chat_inventory.py` | `vault/chat-inventory.json` |
| 新来源或核查更新 | `cards` 为 `generated` 的 `provenance/catalog.json` | `python3 scripts/render_source_cards.py` | 这些 catalog 的逐源卡与两页索引；其余目录不动 |
| 入账与来源映射变更 | intake 与 catalog | `python3 scripts/build_registry.py` | `vault/registry.json` |
| 新增原件快照 | 对应 intake 的原始定位与 hash | `python3 scripts/build_snapshot_manifest.py` | `vault/snapshot-manifest.json` |
| 修改完成 | 当前工作树 | `python3 scripts/validate_repository.py` | 终端中的计数、错误与通过状态 |

同批新增 Chat、来源与快照时依次运行表中命令。provenance 子目录 catalog 自动发现；新材料类别须接入 registry 对应读取逻辑。

## 来源卡由谁维护

每份 `provenance/**/catalog.json` 顶层必须写 `cards`，没有写时生成和验证都报错。

| `cards` | 卡片与索引 | 生成脚本 | 验证检查 |
|---|---|---|---|
| `generated` | 每个 slug 一张卡，放在该 catalog 的 `cards/`，加 `cards/README.md` 和目录 `README.md`；内容只来自 catalog | 内容不同才写，不删文件 | 磁盘上的卡和索引与 catalog 的投影逐字相同；`card_path` 写了就必须等于默认位置 |
| `maintained` | 手写。可以一张卡对多个 URL，可以放在别处，位置由每条的 `card_path` 给出 | 不读也不写 | `card_path` 指向的文件存在；几条来源共用一张卡时，卡里要出现每一条的 URL |

`vault/provenance/README.md` 是整层的手写索引，生成脚本不写它。手写卡里比 catalog 多出来的内容（重访记录、分组说明）没有第二份，改 catalog 之后要自己同步卡片。两种方式的由来见 [ADR-022](../docs/decisions/022-source-card-ownership.md)。

## 失败处理与覆盖

- 原件 hash 不符或已登记路径内容改变：保留旧原件，核对来源后以新版本路径入账。
- 索引过期：修改源登记，重新生成对应投影。
- 链接、身份或覆盖失败：修复错误列出的源记录，再运行验证。

验证检查受治理目录 README、Markdown 本地链接、JSON、Chat 消息覆盖、快照 hash，以及上表的来源卡两项。来源快照保持原字节，其导航由 Vault 维护。外部主张核查、renderer 离线依赖、应用行为与业务结果分别在 [分层验收](../kit/verification/README.md) 中记录。

XMind 导图另运行 `python3 scripts/lint_xmind.py <file.md> ...`，执行 [md/xmind profile](../docs/governance/xmind-markdown-profile.md) 静态 preflight；通过不代表已在 Xmind 实机导入。

AI 能力测试批次使用专属 intake；来源 catalog 的 snapshot_path / snapshot_sha256 将外部正文副本接入统一快照清单。正文快照不意味着站点依赖完整或产品行为已实测。
