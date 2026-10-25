# Adapters

同一张 [工具表](tools.js)，五个入口。工具名、说明和参数在各入口一致，都调用 [core](../core/README.md)。

| 入口 | 文件 | 怎样用 |
|---|---|---|
| DSH 插件 | [dsh.js](dsh.js) | 包的主入口。原生注册全部工具（只读工具可并行）；用 `systemPrompt.section` 加入口段（常驻单元与任务类型，约 700 字，每次组装时读取）；在 DSH 的 Connection 上注册两条精确路由 `GET /api/praxis`（页面）与 `POST /api/praxis.call`（`{tool, args}`），Web 与桌面应用都走 DSH 自己的浏览器认证 |
| DSH 客户端 | [client.js](client.js) | 右侧栏标签类型“Praxis”，内嵌 `/api/praxis`，`keepMounted` 保留状态；引导卡文字经 `ctx.locale` 的中英词典 |
| MCP | [mcp.js](mcp.js) | stdio 服务，供 Claude Code、Codex 等 agent 调用；仓库根的 `.mcp.json` 已登记 |
| 命令行 | [cli.js](cli.js) | `node dsh-praxis/adapters/cli.js <工具名> '<JSON 参数>'`；`help` 列出工具 |
| 控制面 | [http.js](http.js) | 两条路由的 Fetch 处理；不经 DSH 时 `node dsh-praxis/adapters/cli.js serve [端口]`，默认 <http://127.0.0.1:7878/> |

失败在各入口语义一致：查不到条目、参数错误、版本冲突都是失败的调用——DSH 工具错误、MCP `isError: true`、命令行退出码 1、HTTP 400（冲突 409，附当前内容）——不当作带 `error` 字段的成功结果返回。

命令行另有 `export`、`check`、`restore <archive.tar.gz> [--force]`，备份与恢复控制面写下的数据，见 [Data](../data/README.md)。

## 装进 DSH

```bash
"/Applications/DeepSeek Harness.app/Contents/Resources/runtime/cli/bin/dsh" plugin --profile desktop add link:/Users/lesprivilege/Projects/Praxis/dsh-praxis
```

`link:` 安装指向这个仓库，改代码后重启 DSH 即生效。DSH 的 profile 由桌面应用管理时，装完需要重启应用才会加载。插件按包位置找仓库根；包被复制到别处时，在 profile 的 `cordis.patch.yml` 里给 `id: praxis` 设 `config.root`。`config.prompt: false` 关掉系统提示词里的入口段。

在 DSH 里，控制面与调用路由由 DSH 的 Connection 做 Host/Origin 检查和浏览器会话认证，未登录的请求得到 401。不经 DSH 单独运行时，只接受本机回环地址的 Host，写操作只收 JSON 请求体；同机进程都能调用，与它们本来就能直接改仓库文件的权限相同。MCP 只实现工具相关的方法（initialize、ping、tools/list、tools/call），没有 resources 和 prompts。

DSH 插件详情页的标题、说明与用户文档在 [locale](../locale/README.md) 与 [docs](../docs/README.md)。
