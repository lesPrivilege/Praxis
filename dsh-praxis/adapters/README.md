# Adapters

同一张 [工具表](tools.js)，四个入口。工具名、说明和参数在各入口一致，都调用 [core](../core/README.md)。表里 37 个工具，其中 12 个标 `agent`：worker 做任务时用的 entry、resolve、unit、search、catalog、source、capture、curate、consume、projects、project，加上 file：Praxis 页的收录 agent 要靠它重写被标为待改的 description。

| 入口 | 文件 | 怎样用 |
|---|---|---|
| DSH 插件 | [dsh.js](dsh.js) | 包的主入口。只原生注册标 `agent` 的 12 个工具（只读工具可并行；consume 的运行记下 DSH 会话 ID）；用 `systemPrompt.section` 给 agent 会话加入口段（常驻单元与任务类型，每次组装时读取）；注册 `/praxis` 命令，带文字时在会话界面回复任务类型与待处理事项，不发给模型；在 DSH 的 Connection 上注册三条精确路由 `POST /api/praxis.call`（`{tool, args}`）、`GET /api/praxis.file`（产物文件）与 `GET|POST /api/praxis.ask`（输入框请求，[ask.js](ask.js) 经宿主的 sessionController 开 agent 会话，同定时任务），Web 与桌面应用都走 DSH 自己的浏览器认证 |
| DSH 客户端 | [client.js](client.js) | 左侧栏 `sidebar.panellist` 登记“Praxis”，`main` 槽位放 Praxis 页（控制面）：Kit、来源、任务、产物、记录五个标签，层级同 agent 的取用路径；用平台共享的 `@deepseek-ai/dsh-client-ui-primitives` 控件与 `--dsw-alias-*` token，经 `/api/praxis.call` 调工具；底部输入框经 `/api/praxis.ask` 交给 agent；产物在 Finder 中显示与打开交给 `remote.session.openWorkspacePath`。只输入 `/praxis` 打开这一页；`praxis_resolve` 与 `praxis_consume` 的调用显示为卡片，链到页里的单元、来源与产物 |
| MCP | [mcp.js](mcp.js) | stdio 服务，供 Claude Code、Codex 等 agent 调用：全部工具；resources（`praxis://entry`、每个单元，source 与 artifact 按模板读取，来源只给链接、定位与用途）；prompts（每个任务类型一条，参数 `brief` 与 `pipeline`）；instructions 写明取用顺序。一个连接是一个会话，运行记下它 |
| 命令行 | [cli.js](cli.js) | `node adapters/cli.js <工具名> '<JSON 参数>'`，工具名可省略 `praxis_` 前缀；`help` 列出工具；`export`、`check`、`restore <archive.tar.gz> [--force]` 备份与恢复数据根 |
| 路由 | [http.js](http.js) | 调用、产物文件与输入框请求三条路由的 Fetch 处理（`GET /api/praxis.file?artifact=<id>` 只给已登记产物的文件，带 sandbox CSP）；只挂在 DSH 的 Connection 上 |

返回值在各入口相同：`callTool` 把结果规范为无损 JSON，缺省字段省略，NaN、函数、类实例等报错（DSH 拒绝含 `undefined` 的工具值）。失败在各入口语义一致：查不到条目、参数错误、版本冲突都是失败的调用——DSH 工具错误、MCP `isError: true`、命令行退出码 1、HTTP 400（冲突 409，附当前内容）——不当作带 `error` 字段的成功结果返回。

路由由 DSH 的 Connection 做 Host/Origin 检查和浏览器会话认证，未登录的请求得到 401；写操作只收 JSON 请求体。

安装、插件配置（`config.data`、`config.prompt`）与 MCP 登记见 [安装与运行](../INSTALL.md)。DSH 插件详情页的标题、说明与用户文档在 [locale](../locale/README.md) 与 [docs](../docs/README.md)。
