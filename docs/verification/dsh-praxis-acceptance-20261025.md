# dsh-praxis 整合包验收 · 2026-10-25

验收提交：`179e227b0d56476423be1f9b8c0d87fc561a38dc`。结论：**整合包的入口与共数据主路径成立，可靠性验收未通过。** DSH 桌面内置控制面已经实际打开并读写成功；MCP 与 CLI 的真实进程互通成功。备份恢复、失败写入和历史依据仍有可复现缺陷。本轮新增验收探针与记录，没有修产品代码，也没有提交或推送。

## 验收口径与来源

用户本轮进一步明确：“其定位相当于一个整合包，控制面版在 dsh 内置，并开放 mcpcli”。据此，以共同 Kit、来源与操作，经 DSH 控制面和 MCP/CLI 消费为验收中心。独立 Reporting 存储、Video 渲染/TTS 引擎不作为本次必备功能。

原始需求来自同一 conversation `6ada3159-c90c-83ec-8974-8fe45f656606`，本次附件保存为 [20-turn 版本](../../vault/archive/chat/dsh-praxis-control-plane-20261025.md)，与旧版本共用 [稳定入账记录](../../vault/intake/dsh-praxis-control-plane-20261023.json)。Turn 3、7 明确共数据、可维护、打包备份与版本对齐；Turn 13 明确 Agent 主维护；Turn 15、17 明确分层、渐进消费与轻量控件。Assistant 提出的完整生产引擎、自动订阅等不等同于用户已接受的范围。

## 实际执行

| 检查 | 结果与范围 |
|---|---|
| 原有测试 | `node --test dsh-praxis/core/*.test.mjs dsh-praxis/adapters/*.test.mjs`：16/16 通过。core 使用临时库和模拟 rebuild，adapter 使用模拟接口；不能替代宿主验收。备份夹具输出一次非 Git 仓库提示，测试仍通过 |
| DSH 桌面 | 本机 DeepSeek Harness `0.2.1-rc.3`，插件 `link:` 指向当前仓库，组件显示 Running。应用启动时间为本地 13:21:59，晚于提交的 13:15:28；无需本轮再次重启 |
| 内置控制面 | 从新建空会话 → 右侧栏 → Praxis，页面地址为 `dsh-app://app/api/praxis`，实际显示 76 units、523 bindings；截图和可访问性树均已查看 |
| 任务展开 | 技术说明/html 显示 12 个单元、4 条素材；切到 video 显示旁白、运动、分镜等对应单元、2 条素材。能够从任务单元进入目录详情 |
| 桌面维护 | 对 APG Accordion 的 navigation 挂载实际收藏、停用、保存 description、记录 review。UI 显示相应状态和 revision；CLI 立即读到收藏与停用，resolve 素材由 4 条降至 3 条；另一个 controls 挂载保持不变 |
| 恢复测试写入 | 事前保存数据，事后核对仅该挂载的 5 次 `dsh-ui` 写入，再还原 history 原字节并移除本次新增 bindings 文件。registry hash 未变；当时 Git 工作区重新为空。Task 再次显示原 4 条素材，Log 仍为原 4 条维护记录 |
| MCP/CLI 集成 | 真实 stdio initialize、21 个工具、MCP 写 → CLI 读、CLI 写 → 同一存活 MCP 读均通过；使用真实 registry/snapshot builders 与本机 HTTP 来源，未模拟 rebuild |
| 补充验收探针 | [探针](../../scripts/check_praxis_acceptance.py)实跑 9 项：3 通过、6 失败，退出码 1，无探针异常。两个失败属于同一个 lookup 错误类别。精确观察见 [JSON 回执](dsh-praxis-acceptance-20261025.json) |
| 打包清单 | `npm pack --dry-run --json --ignore-scripts` 成功，26 个文件；不含 `kit/`、`layers.md`、Vault 和重建脚本。未发布、未安装依赖 |

重放补充检查：在仓库根执行 `python3 scripts/check_praxis_acceptance.py`。它只写独立临时库，自动清理，以正确行为为预期；当前退出码 1 表示下面的产品缺陷仍存在。

## 必须修复的发现

### P1 · 备份恢复遗漏已有来源的权威状态

对原有 catalog 的来源新增一个挂载、删除旧挂载并刷新快照，随后 export/check/restore 均报告成功。恢复到原始 catalog 的临时库后，新挂载消失、旧挂载重新出现，最新快照指针也丢失；即使手动重建 registry 仍然如此。快照文件本身已恢复。

[backup.js](../../dsh-praxis/core/backup.js) 的 `STATE_PATHS` 只包含新 capture catalog 等固定目录，但 [materials.js](../../dsh-praxis/core/materials.js) 的 `setRelation` 与 `refresh` 会改任意已有来源 catalog。备份因此不能重建控制面实际写下的完整状态。应覆盖受改权威记录，并在恢复后重建派生索引；以新增、移除、刷新三种状态均保持作为验收条件。完整仓库另行备份可以携带这些文件，但当前 `export` 不能替代它。

### P1 · 过期预设保存失败仍取消原默认预设

先令 A 为默认、B 为普通预设；更新 B 后，用 B 的旧 revision 请求设为默认。接口正确报 conflict，但 A 已被改成非默认，最终两者都不是默认。

[index.js](../../dsh-praxis/core/index.js) 的 `savePreset` 先清除其他 default，再检查目标 revision。失败操作必须不改任何预设；目标校验与同流水线默认切换需要成为一次完整操作。

### P2 · MCP/CLI 把不存在的条目报告为成功

`praxis_unit`、`praxis_source` 查询不存在 ID 时，正文包含 error，但 CLI exit 0、MCP `isError:false`。同样的未知任务 `resolve` 则正确失败。

[tools.js](../../dsh-praxis/adapters/tools.js) 返回 error 对象，[mcp.js](../../dsh-praxis/adapters/mcp.js) 与 CLI 按普通结果包装；只有 DSH adapter 额外转成异常。应在共同调用边界统一失败语义，保证其他 Agent 与脚本可以可靠分支。

### P2 · 已消费来源更新后，受影响交付没有被找出来

consume 显式记录来源 v1 hash，随后 refresh 得到 v2。挂载出现 changed 信号，但 `stale` 和 `upkeep.stale` 都为空。

[index.js](../../dsh-praxis/core/index.js) 的 stale 只比单元、挂载 revision 和预设，没有比 consume 已记录的 sources。应把来源版本变化关联到使用它的运行；不能以“挂载有提示”代替“找到哪些交付受影响”。

### P2 · description 历史只记版本号，不能回查当时内容

连续两次 curate 后，当前条目只有新 description，history 只有字段名、revision、操作者等元数据，没有任一版 description 值。工具修改不会自动 Git commit，因此仅靠“进 Git”不能保证每个 review 或 consume 引用的 revision 可还原。

[store.js](../../dsh-praxis/core/store.js) 与 [materials.js](../../dsh-praxis/core/materials.js) 应保存可还原的版本或变更内容。这是 [对象契约](../../dsh-praxis/objects.md) 中前后版本和具体版本 review 的未完成部分；预设在 run 中保存值，不能代替挂载自己的版本历史。

## 修复后复验（同日）

五项发现按上面的根因修在共同 core 与调用边界，未改验收探针：

| 发现 | 修法 |
|---|---|
| 备份遗漏已有来源状态 | `export` 另带 registry 列出的全部来源 catalog；`restore` 恢复后重建 registry 与快照清单，缺重建函数时在复制前拒绝 |
| 过期预设保存仍取消原默认 | 目标 revision 检查通过后，清除旧默认与保存目标在同一次加锁写入里完成；被拒时不写 |
| 不存在的条目报成功 | `praxis_unit`、`praxis_source` 查不到时抛错；DSH adapter 的特判删除，各入口同一失败语义 |
| 来源更新未标出受影响交付 | `stale` 比对 consume 记下的来源快照 hash，`upkeep.stale` 与 Log 随之列出 |
| description 历史不可回查 | 每条维护记录带这一版写下的字段值（`set`）与删除的字段（`unset`）；`praxis_history` 可按 `id` 过滤 |

另修：UI 的 review 带上屏幕上所见 revision；`ui/README.md` 的 DSH 路由改为 `/api/praxis`。

复验：`python3 scripts/check_praxis_acceptance.py` 9 项全部通过，退出码 0；`node --test` 18 项通过（新增预设原子性、来源快照 stale 两项，备份、历史和 MCP 查不到三处断言加强）；对真实仓库 `export` + `check` 成功，55 个文件（只写到会话临时目录）。DSH 桌面没有重启复验；npm 包仍不单独携带 Kit。

## 与最初期待的对应

| 用户期待 | 判断 |
|---|---|
| DSH 内置控制面，开放 MCP/CLI | 已实现，桌面主路径与真实进程验证通过；失败语义尚未一致 |
| 同一 Kit、同一数据，人和 Agent 都能维护 | 通过主要读写路径；冲突失败的原子性未通过。当前目录会缓存，不能把“同一数据”解读为 UI 自动实时同步 |
| Task 选方法，Writing/Design 常驻，Publish 分媒介 | 已实现并实际验证 html/video 选择结果；没有把流水线预设误称为生成引擎 |
| 按 grammar 浏览，description、启用、收藏、增删、review | 控件和共同 core 已实现；收藏/停用/描述/review 在桌面实测。增删恢复由原有测试覆盖，本轮未在真实资料上删除 |
| 刷新、版本对齐、历史回查、备份 | 部分实现，以上 P1/P2 阻止完整验收 |
| 可携带的整合包 | 当前可用方式是完整 Praxis checkout 加 link/plugin、MCP 或 CLI；npm 包本身是接入代码，不能单独携带 Kit。若期待复制一个安装包即迁移全部积累，尚未做到；不需要为此新增发布流程 |
| 素材五级与产物统一管理 | 已有概要、题解、摘录和文件定位；UI 原件只是路径文字，Log 主要展示运行和产物数量，未形成完整文件预览、产物版本与派生关系的管理界面 |

此外，代码审阅发现 UI review 请求未携带屏幕上所见 revision，存在并行编辑时审错版本的风险；尚未做该竞争场景的桌面复现，不计入本次六项失败。`ui/README.md` 仍称 DSH 路由为 `/praxis/`，与已实测 `/api/praxis` 不符，属于待修文档。

## 覆盖边界与角色

本轮没有调用真实模型生成内容，没有跑完整报告/视频交付，没有重新验证 Web 登录与未登录拒绝、明暗语言切换、恶意归档、并发压力、跨机器路径重绑定或外网快照资源自足性。桌面截图只在本地会话检查，含无关会话列表，不复制入仓库。原 Chat 为 partial 导出，内嵌组件状态未保存、v0.3 评审附件仍未取得；外部引用未重新打开或快照。

主代理负责桌面验证、范围收敛和最终接收；Luna（gpt-5.6-luna）负责原对话覆盖与增量入账；运行检查 worker 使用默认继承模型，具体型号未确认。未另启 Astra，关键结论由主代理依据复现证据裁定。

`python3 scripts/validate_repository.py` 通过，errors 为空（2047 Markdown、951 JSON、1106 snapshots）；`git diff --check` 通过。功能探针未通过不能被结构校验通过抵消。

## 补充：DSH 调用方反馈与只读核对

本节补充用户转述的 DSH 自测及本会话随后核对，不改写上文 `179e227` 的历史结果。核对时 HEAD 为 `535dd67`，工作区另有 Kit 正文修改；该提交已包含上一轮缺陷修复，本节没有重跑其完整验收。只保留提炼后的发现，没有归档本次消息原文或附件。

| 事项 | 证据与判断 |
|---|---|
| DSH 原生调用可达 | 调用方报告 units、entry、search、presets、runs 可读。这是新增调用方证据，没有附完整调用日志，不扩大为所有读写路径已验证 |
| Kit 数量 | 随后直接调用当前 core 得到 76 个单元：Task 8、Writing 18、Publish 8、Design 42；常驻仍是 4 个。反馈中的粗略分层数量不作为精确基线 |
| 预设与运行 | 只读核对为 0 个预设、4 条运行。空预设表示尚未配置，不是功能错误；有具体任务再确定 provider 等值，不用占位配置填满列表 |
| 版本与产物 hash | 能支持身份比对和变化检测；旧正文、旧文件能否取回取决于是否保留相应版本。不能仅凭 run 中有版本号和 hash 宣称已完成历史内容回查 |

调用方报告 `praxis_upkeep` 失败并出现 `value is not lossless JSON`。本次直接执行 `createPraxis().upkeep()`，得到非空 `stale` 列表，其中每个未变更预设的条目均有自有字段 `preset: undefined`。这不是“没有待办”的空结果情形。

本机 DeepSeek Harness 应用包中的 `snapshotToolValue` 对 `snapshotJsonValue` 失败抛出上述错误；其 `walkJsonValue` 会拒绝 undefined，包括对象中的字段值。[DSH adapter](../../dsh-praxis/adapters/dsh.js) 将 core 原始对象直接返回；CLI/HTTP/MCP 输出中使用的 JSON 序列化则会丢弃这类字段。因此确认了与报错吻合的返回值契约缺陷。本次读取了已装应用包源码，未复制或快照宿主代码，也未重新发起真实模型工具调用；调用方的具体报错来自其自测反馈。

建议下一轮在共同返回值边界与 DSH adapter 之间明确 JSON 可表示性，检查其他含可选字段的工具；具体在 core 构造时省略缺省字段、用有定义的 null，或在适配层规范化，由 Opus 裁决。不要只验证 `JSON.stringify` 能执行，也不要无差别吞掉不合法值来掩盖数据错误。至少覆盖 upkeep 无待办、有 stale 但无 preset、存在预设变更及嵌套可选字段。落实到 下一轮工单。

2026-10-26：本文提到的 `../../dsh-praxis/work-order-artifacts.md` 已按 ADR-044 删除，结论以本文和回执为准；登记见 `docs/governance/retired-paths.json`。
