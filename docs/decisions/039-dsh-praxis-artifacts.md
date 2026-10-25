# ADR-039：dsh-praxis 的产物登记与取用

日期：2026-10-25。状态：accepted（用户指示“这一轮先从第一性原理完成施工”，按 [下一轮工单](../../dsh-praxis/work-order-artifacts.md)与 [架构参考](../../dsh-praxis/architecture.md)执行，主会话裁决下列选择）。主会话（Claude Opus 5.5）实现并验证；DSH 接口由一名 Sonnet 代理只读调研，结论经主会话抽查。

## 问题与依据

一次工作交付的文件，此前只在运行记录里留下路径和 hash：找不到它的下一版，review 落不到具体版本，文件挪走后无从察觉，人要回 Finder 里翻。DSH 0.2.1-rc.3 自己的 `present` 工具把交付声明写进会话日志，但只记绝对路径与说明，不记版本或 hash，也只在该会话里可见，MCP 与命令行读不到。

DSH 应用包里可用的宿主能力：客户端标签体收到 `sessionId` 与 `useTabInfo`，`tab.actions.openResource('dsh-resource://file/session/<会话>/<路径>')` 在 DSH 的文档预览里打开文件（md、html 沙箱渲染、pdf、图片、Office、表格、代码）；`ctx.remote.session.openWorkspacePath({ path, action })` 在 Finder 中显示或用默认应用打开。主进程与 preload 里没有 `startDrag`，插件拿不到原生拖出接口。

## 决定

- **产物是独立记录，字节留在原处。** `dsh-praxis/data/artifacts.json` 记身份、名称与说明、媒介、位置、版本、review 和状态；文件本身留在主人的工作区，仓库内的存仓库路径，仓库外的存绝对路径。每个版本是一份不同的内容：sha256、大小、时间、产出它的运行、派生自哪些产物的哪一版。旧版本的字节不另存：hash 能核对，能否取回取决于主人是否保留（例如 Git）。
- **登记走 `praxis_consume`。** 交付记录与产物登记是同一次调用：文件先全部核对（存在、指名的产物存在、派生引用有效），再写运行与版本。同一文件内容未变不重复登记，重试不产生新产物；内容变了是下一版；文件挪了位置用 `artifact` 指明。文件不存在则整次拒绝，不留半条记录。
- **状态每次从文件读出，不存。** current、modified（有未登记改动）、missing。需要人处理的信号只有两种：missing（记录找不到文件）和 needs_work（最新版的 review 待改）。modified 与 basis_changed（产出最新版的运行所用单元、挂载、来源或预设之后改过）显示在列表与详情里，不进维护清单：后续交付自然会登记，过期运行已由 stale 列出。
- **review 写明版本。** 结论分 needs-work、checked（已按验收项核对）、accepted（主人接受）；新版本不继承旧版本的结论。对外发布另记，本轮不做。
- **挪位置不伪造版本。** `praxis_artifact_update` 改指新路径时，新文件必须与最新版本内容相同；不同就是新版本，回到 consume。
- **宿主动作经客户端桥接。** 控制面 iframe 只向父页发 `{type:'praxis:file'}` 消息；客户端插件只认自己那个 iframe 的消息，预览交给 DSH 文档预览，显示与打开交给 `openWorkspacePath`。Praxis 不自建预览器。
- **文件路由只给已登记的产物。** `GET /api/praxis.file?artifact=<id>` 按记录取路径，不接受任意路径；响应带 `Content-Security-Policy: sandbox`，文件内容不以控制面的身份运行。用于拖出与独立运行时的预览。
- **拖出用 HTML5 `DownloadURL`，尚未验证。** DSH 没有原生拖出接口，行与详情头可拖动并给出 `DownloadURL` 与 `text/uri-list`；`dsh-app` 是标准、安全、可 fetch 的 scheme，但 Chromium 能否按它下载到 Finder，只有桌面实测能回答。不成时可用“在 Finder 中显示”再拖，拖出记为未完成。
- **旧运行的产物一次投影。** 4 条既有运行里的 18 个文件，用运行当时记下的 hash 与时间登记为版本，运行记录补上产物 ID；没有按文件现状补造版本。投影脚本是一次性的，不留在仓库。
- **备份只带记录。** `artifacts.json` 随 data 导出；导出结果写明 `not_included.artifact_files`，归档校验通过不等于产物文件已备份。
- **工具值是无损 JSON。** DSH 拒绝含 `undefined` 的工具值（`value is not lossless JSON`），其他入口经 `JSON.stringify` 会悄悄丢掉。`callTool` 在共同边界统一：缺省字段省略，NaN、函数、类实例等报错，不猜。
- **不复用 DSH 的 deliverables 记录。** 它只有路径、只在会话里、其他 agent 读不到。以后可以把会话里的 `deliverables/presented` 读进来作为登记线索。

## 验证

- `node --test` 23 项：产物登记、去重、新版本与派生，review 绑定版本、状态与信号、依据变化，挪位置的版本规则与冲突，文件路由只给已登记产物，DSH 适配层的工具值经 JSON 往返不变。
- [验收探针](../../scripts/check_praxis_acceptance.py) 12 项，新增 3 项：命令行登记、MCP 读取并 review v1，v2 不继承结论、重试不加版本；查不到的产物在两端都是失败；导出写明不含产物文件。
- 控制面在应用内浏览器里看过产物列表、详情（4 个版本各自的运行与所用单元）与文件路由；没有在 DSH 桌面里看。
- 回执与桌面测试步骤见 [产物登记与取用](../verification/dsh-praxis-artifacts-20261025.md)。

## 没有做的

DSH 桌面里的预览、显示、打开与拖出（用户稍后测）；对外发布状态；旧版本字节的保留；读入 DSH 会话的交付声明；按内容的全文检索。名称与定位的统一梳理放在发布前的正名环节。
