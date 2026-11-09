# Adapters

同一张 [工具表](tools.js)，五个入口。工具名、说明和参数在各入口一致，都调用 [core](../core/README.md)。表里 35 个工具，其中 10 个标 `agent`：worker 做任务时用的 entry、resolve、unit、search、source、capture、curate、consume、projects、project。

| 入口 | 文件 | 怎样用 |
|---|---|---|
| DSH 插件 | [dsh.js](dsh.js) | 包的主入口。只原生注册标 `agent` 的 10 个工具（只读工具可并行；consume 的运行记下 DSH 会话 ID）；用 `systemPrompt.section` 给 agent 会话加入口段（常驻单元与任务类型，每次组装时读取）；注册 `/praxis` 命令，带文字时在会话界面回复任务类型与待处理事项，不发给模型；在 DSH 的 Connection 上注册三条精确路由 `GET /api/praxis`（页面）、`POST /api/praxis.call`（`{tool, args}`）与 `GET /api/praxis.file`（产物文件），Web 与桌面应用都走 DSH 自己的浏览器认证 |
| DSH 客户端 | [client.js](client.js) | 右侧栏标签类型“Praxis”，内嵌 `/api/praxis`，`keepMounted` 保留状态；引导卡文字经 `ctx.locale` 的中英词典；只输入 `/praxis` 时打开这个标签；`praxis_resolve` 与 `praxis_consume` 的调用显示为卡片（affectUI Tool Call Card 的样式：状态转圈与计时、画出的勾或“没有完成”、展开看单元与素材，或打开交付的文件）；转交 iframe 的文件请求：预览交给 DSH 文档预览（`openResource`），在 Finder 中显示与打开交给 `remote.session.openWorkspacePath`；左侧栏 `sidebar.panellist` 登记“Praxis”，`main` 槽位放来源 review 页，用平台共享的 `@deepseek-ai/dsh-client-ui-primitives` 控件与 `--dsw-alias-*` token，经 `/api/praxis.call` 调 `praxis_catalog`、`praxis_source`、`praxis_review`、`praxis_file` |
| MCP | [mcp.js](mcp.js) | stdio 服务，供 Claude Code、Codex 等 agent 调用：全部工具；resources（`praxis://entry`、每个单元，source 与 artifact 按模板读取，来源只给链接、定位与用途）；prompts（每个任务类型一条，参数 `brief` 与 `pipeline`）；instructions 写明取用顺序。一个连接是一个会话，运行记下它 |
| 命令行 | [cli.js](cli.js) | `node adapters/cli.js <工具名> '<JSON 参数>'`，工具名可省略 `praxis_` 前缀；`help` 列出工具；`export`、`check`、`restore <archive.tar.gz> [--force]` 备份与恢复数据根 |
| 控制面 | [http.js](http.js) | 页面、调用与产物文件三条路由的 Fetch 处理（`GET /api/praxis.file?artifact=<id>` 只给已登记产物的文件，带 sandbox CSP）；不经 DSH 时 `node adapters/cli.js serve [端口]`，默认 <http://127.0.0.1:7878/> |

返回值在各入口相同：`callTool` 把结果规范为无损 JSON，缺省字段省略，NaN、函数、类实例等报错（DSH 拒绝含 `undefined` 的工具值）。失败在各入口语义一致：查不到条目、参数错误、版本冲突都是失败的调用——DSH 工具错误、MCP `isError: true`、命令行退出码 1、HTTP 400（冲突 409，附当前内容）——不当作带 `error` 字段的成功结果返回。

在 DSH 里，控制面与调用路由由 DSH 的 Connection 做 Host/Origin 检查和浏览器会话认证，未登录的请求得到 401。不经 DSH 单独运行时，只接受本机回环地址的 Host，写操作只收 JSON 请求体；同机进程都能调用，与它们本来就能直接改数据根文件的权限相同。

安装、插件配置（`config.data`、`config.prompt`）与 MCP 登记见 [安装与运行](../INSTALL.md)。DSH 插件详情页的标题、说明与用户文档在 [locale](../locale/README.md) 与 [docs](../docs/README.md)。
