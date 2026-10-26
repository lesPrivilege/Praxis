# dsh-praxis 产物登记与取用 · 2026-10-25

基线：`eb00ef7`（含 [整合包验收](dsh-praxis-acceptance-20261025.md)五项修复与 Kit 清理）。按 下一轮工单施工，取舍见 [ADR-039](../decisions/039-dsh-praxis-artifacts.md)。

## 已验证

| 范围 | 怎样验证 | 结果 |
|---|---|---|
| core 与适配层 | `node --test dsh-praxis/core/*.test.mjs dsh-praxis/adapters/*.test.mjs`，临时小仓库与模拟宿主 | 23 项通过 |
| 命令行与 MCP 共数据 | `python3 scripts/check_praxis_acceptance.py`，真实子进程、真实 registry 构建脚本、本机 HTTP 来源 | 12 项通过，退出码 0 |
| DSH 工具值 | 适配层测试把 upkeep、stale、entry、runs、artifacts、presets 的返回值做 JSON 往返比较；当前仓库的 stale 含无预设条目 | 往返不变 |
| 控制面 | 应用内浏览器独立运行（端口 7879）：产物列表 18 件、详情的版本时间线与所用单元、文件路由按 ID 返回、按路径返回 404 | 正常，无控制台错误 |
| 旧运行投影 | 4 条运行的 18 个文件按当时 hash 登记；投影前的 data 留在会话临时目录 | 14 件 current，4 件 modified（之后改过、未再交付），全部 basis_changed（Kit 清理改了所用单元） |

## 未验证：DSH 桌面

插件代码在 DSH 启动时加载，之后的改动要重启才生效。先让 agent 调用 `praxis_entry`：结果带 `reload` 就是旧代码，重启后再测。依次检查：

1. 打开一个会话，右侧栏 → Praxis → **产物**，选 `projects/jev/site/index.html`。
2. **预览**：右侧栏新开 DSH 的文档预览标签，显示这份 HTML。
3. **在 Finder 中显示** 与 **打开**：Finder 选中该文件；默认浏览器打开它。
4. **拖出**：把详情顶部的名称或列表里的行拖到桌面或 Finder 窗口，再拖一次到 TextEdit。通过的标准是落下一个真实文件（`index.html`，与原文件同样大小），不是 `.webloc` 或一行网址。
5. 让 DSH 里的 agent 调用 `praxis_upkeep` 与 `praxis_artifacts`，返回成功，不再出现 `value is not lossless JSON`。

第 4 步不通过时，拖出记为未完成，可用的路径是第 3 步的“在 Finder 中显示”再从 Finder 拖。

## DSH 会话实测

DSH 里的一名 agent 以本插件为工具做了一份技术说明页（`projects/dsh-praxis-explainer/`，运行 `2026-10-25-682e2b26`），报回三项问题。三项都来自同一原因：DSH 桌面 13:22 启动，加载的是 `179e227` 的插件代码，此后的验收修复与产物登记（`535dd67`、`0346ffd`）都没有进入这个进程。

| 报回的现象 | 在 `179e227` 上的原因 | 当前代码 |
|---|---|---|
| `praxis_resolve`、`praxis_upkeep` 经插件报 `value is not lossless JSON`，命令行正常 | 那时没有无损 JSON 边界，返回值里的 `preset: undefined` 被 DSH 拒绝 | `callTool` 统一省略缺省字段；适配层测试覆盖读工具，core 测试覆盖写工具的返回值 |
| `praxis_consume` 报错，运行已写入，产物列表里没有这两份文件 | 那时 consume 只在运行里记路径与 hash，还没有产物记录；写入完成后返回值被拒，报错发生在落盘之后 | consume 先核对、再登记产物与运行；返回值走同一边界 |
| 插件 21 个工具，命令行 25 个，缺产物四件 | 进程里是加了产物工具之前的工具表 | 两端都是 25 个，取自同一份 `TOOLS` |

处理：`praxis_entry` 与 `praxis_upkeep` 增加 `reload`，宿主进程运行的服务端代码比磁盘上的旧时出现，控制面在“需要处理”里显示一行；agent 读到它就知道结论要在重启后重测。这条运行的两份文件按运行时的 hash 补登为产物（`index-e5dbc5`、`style-a32afb`，文件内容与运行记录一致），运行记录补上产物 ID。说明页第 5 章的对照表描述的是旧进程，重启后需要重做。

## 工单建议的采用情况

| 建议 | 处理 |
|---|---|
| 收敛基线、宿主可行性 | 采用。五项缺陷已在 `535dd67` 修复；宿主能力由只读调研确认，预览与打开有接口，原生拖出没有 |
| 在已有 consume/run 上最小扩展 | 采用并扩展：consume 同时登记产物；产物另立一份记录，因为 review、改名与挪位置需要自己的版本与冲突检查 |
| 独立 artifact 存储与否 | 存记录，不存字节 |
| 发现、review、取用 | 新增“产物”视图；review 绑定所见版本；预览、显示、打开走 DSH；拖出待桌面实测 |
| 修订与恢复 | 修订即新版本，旧 review 与依据可回查；恢复只带记录，导出写明不含产物文件 |
| 来源变化与文件搬移 | 区分：依据变化显示在版本上，文件找不到是信号；改指新路径要求内容一致 |
| 重复登记与并行修改 | 重试不加版本；改名与挪位置带 revision |
| 隐私 | 验证只用合成夹具与仓库里已有的运行；探针的合成文件与临时运行已删除，history 按字节核对恢复 |
| DSH 调用方反馈的 JSON 契约 | 采用：在 `callTool` 统一为无损 JSON，并加测试 |
| 对外发布状态、旧字节保留、读入 DSH 交付声明 | 延后，见 ADR-039 |

## 覆盖边界

重启后的 DSH 桌面没有运行过；没有真实模型在当前代码上调用 consume 登记产物；没有并发压力测试；旧运行投影后，modified 的 4 件按设计不进维护清单。

2026-10-26：本文提到的 `../../dsh-praxis/work-order-artifacts.md` 已按 ADR-044 删除，结论以本文和回执为准；登记见 `docs/governance/retired-paths.json`。
