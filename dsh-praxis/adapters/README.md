# Adapters

同一张 [工具表](tools.js)，五个入口。工具名、说明和参数在各入口一致，都调用 [core](../core/README.md)。

| 入口 | 文件 | 怎样用 |
|---|---|---|
| DSH 插件 | [dsh.js](dsh.js) | 包的主入口。原生注册全部工具；把常驻单元与任务类型写进系统提示词（约 700 字）；DSH 有 web server 时在 `/praxis/` 提供控制面 |
| DSH 客户端 | [client.js](client.js) | 右侧栏标签类型“Praxis”，内嵌 `/praxis/` 控制面；在侧栏的引导页里打开 |
| MCP | [mcp.js](mcp.js) | stdio 服务，供 Claude Code、Codex 等 agent 调用；仓库根的 `.mcp.json` 已登记 |
| 命令行 | [cli.js](cli.js) | `node dsh-praxis/adapters/cli.js <工具名> '<JSON 参数>'`；`help` 列出工具 |
| 控制面 | [http.js](http.js) | `node dsh-praxis/adapters/cli.js serve [端口]`，默认 <http://127.0.0.1:7878/> |

命令行另有 `export`、`check`、`restore <archive.tar.gz> [--force]`，备份与恢复控制面写下的数据，见 [Data](../data/README.md)。

## 装进 DSH

```bash
"/Applications/DeepSeek Harness.app/Contents/Resources/runtime/cli/bin/dsh" plugin --profile desktop add link:/Users/lesprivilege/Projects/Praxis/dsh-praxis
```

`link:` 安装指向这个仓库，改代码后重启 DSH 即生效。DSH 的 profile 由桌面应用管理时，装完需要重启应用才会加载。插件按包位置找仓库根；包被复制到别处时，在 profile 的 `cordis.patch.yml` 里给 `id: praxis` 设 `config.root`。`config.prompt: false` 关掉系统提示词里的入口段。

控制面与 HTTP 接口只接受本机回环地址的 Host，写操作只收 JSON 请求体；它不经过 DSH 的 token 认证，与 DSH 同机的其他进程都能调用，这与它们本来就能直接改仓库文件的权限相同。MCP 只实现工具相关的方法（initialize、ping、tools/list、tools/call），没有 resources 和 prompts。
