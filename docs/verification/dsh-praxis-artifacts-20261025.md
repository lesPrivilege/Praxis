# dsh-praxis 产物登记与取用 · 2026-10-25

基线：`eb00ef7`（含 [整合包验收](dsh-praxis-acceptance-20261025.md)五项修复与 Kit 清理）。按 [下一轮工单](../../dsh-praxis/work-order.md)施工，取舍见 [ADR-039](../decisions/039-dsh-praxis-artifacts.md)。

## 已验证

| 范围 | 怎样验证 | 结果 |
|---|---|---|
| core 与适配层 | `node --test dsh-praxis/core/*.test.mjs dsh-praxis/adapters/*.test.mjs`，临时小仓库与模拟宿主 | 23 项通过 |
| 命令行与 MCP 共数据 | `python3 scripts/check_praxis_acceptance.py`，真实子进程、真实 registry 构建脚本、本机 HTTP 来源 | 12 项通过，退出码 0 |
| DSH 工具值 | 适配层测试把 upkeep、stale、entry、runs、artifacts、presets 的返回值做 JSON 往返比较；当前仓库的 stale 含无预设条目 | 往返不变 |
| 控制面 | 应用内浏览器独立运行（端口 7879）：产物列表 18 件、详情的版本时间线与所用单元、文件路由按 ID 返回、按路径返回 404 | 正常，无控制台错误 |
| 旧运行投影 | 4 条运行的 18 个文件按当时 hash 登记；投影前的 data 留在会话临时目录 | 14 件 current，4 件 modified（之后改过、未再交付），全部 basis_changed（Kit 清理改了所用单元） |

## 未验证：DSH 桌面

插件代码已更新，DSH 重启后加载。依次检查：

1. 打开一个会话，右侧栏 → Praxis → **产物**，选 `jev/site/index.html`。
2. **预览**：右侧栏新开 DSH 的文档预览标签，显示这份 HTML。
3. **在 Finder 中显示** 与 **打开**：Finder 选中该文件；默认浏览器打开它。
4. **拖出**：把详情顶部的名称或列表里的行拖到桌面或 Finder 窗口，再拖一次到 TextEdit。通过的标准是落下一个真实文件（`index.html`，与原文件同样大小），不是 `.webloc` 或一行网址。
5. 让 DSH 里的 agent 调用 `praxis_upkeep` 与 `praxis_artifacts`，返回成功，不再出现 `value is not lossless JSON`。

第 4 步不通过时，拖出记为未完成，可用的路径是第 3 步的“在 Finder 中显示”再从 Finder 拖。

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

没有在 DSH 桌面里运行；没有真实模型调用 consume 登记产物；没有并发压力测试；旧运行投影后，modified 的 4 件按设计不进维护清单。
