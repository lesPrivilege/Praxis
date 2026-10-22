# ADR-038：dsh-praxis 控制面的实现

日期：2026-10-23。状态：accepted（用户以 /loop 指示“完成我们对 plugin 的期待，本地已经安装 dsh”，主会话自行裁决下列实现选择）。主会话（Claude Opus 5.5）实现并验证，没有分派代理。

## 问题与依据

[ADR-037](037-dsh-praxis-layered-grammar.md) 定了分层体例，评审记录留下几项实现问题：数据放哪里、能不能直接改文件、要不要常驻服务、DSH 与其他 agent 怎样接入。本机装的是 DeepSeek Harness 0.2.1-rc.2：插件是 cordis 包，用 `dsh plugin --profile <名> add` 装；工具注册在 `ctx.tools`，系统提示词经 `system-prompt/assemble` 追加；web server 可挂前缀路由；客户端经 `__ModuleLoader__` 加载，右侧栏有标签类型注册表。这些接口从已装插件（dsh-meme）和应用包内各包的 README 读出。

## 决定

- **一套 core，五个入口。** [core](../../dsh-praxis/core/README.md)实现 resolve、curate、remove、restore、review、capture、refresh、consume、预设与运行记录；DSH 插件、DSH 客户端标签、MCP 服务、命令行、独立网页都只调用同一张工具表。
- **来源事实与挂载关系留在 catalog，维护信息另存。** `grammar_paths` 仍是挂载关系的唯一位置，SaaS 图谱等已有脚本不用改；description、取用题解、启用、收藏、优先级、tag、review、预设、运行与维护记录存在 `dsh-praxis/data/`，进 Git。新建或删除挂载时同步改 `grammar_paths`。
- **允许直接改文件。** core 每次调用都重读文件；经工具的写入带 revision，过期即拒绝并返回当前内容；直接改文件不留维护记录，靠仓库检查兜底。
- **不设常驻服务。** 操作在 DSH、MCP 或命令行进程里同步执行；refresh 按需取快照。需要定时更新时再加。
- **派生数据交给已有构建脚本。** 写 catalog 或快照后重跑 `build_registry.py`、`build_snapshot_manifest.py`，不在 JS 里复制它们的格式。新快照放 `vault/snapshots/local/praxis/`，每个版本登记在 `vault/intake/praxis-captures.json`；新来源进 `vault/provenance/praxis-captures/`，卡片由 core 写出。
- **不引入依赖。** 仓库约定不自动安装依赖。MCP 只实现工具相关的四个方法（initialize、ping、tools/list、tools/call），逐行 JSON-RPC；DSH 工具用原始定义注册，不 import DSH 内部包。
- **控制面只收本机请求。** HTTP 接口检查 Host 是否为回环地址、写操作只收 JSON；不接 DSH 的 token 认证。
- **预设只记密钥所在的环境变量名。** 字段按流水线定义，校验拒绝像密钥的值；运行记录写下所用预设的 revision 与值。
- **Design 与数据层一起迁入。** `kit/design/` 整体移到 `dsh-praxis/kit/design/`，来源 catalog 与两份图谱索引里的路径随之改；艺术软件图谱的回归测试期望值是测试夹具，路径一并改。

## 验证

- `node --test` 15 项通过：core 在临时小仓库上测 resolve、curate 冲突、删除与恢复、review、capture 去重、consume 与 stale、refresh 版本、预设、导出恢复；adapters 测工具 schema、MCP 协议、HTTP 守卫、DSH 插件注册。
- 无头 DSH（临时 profile）里模型调用 `praxis_resolve` 成功；临时 web profile 里 `/praxis/` 返回 200，右侧栏引导页出现“Praxis 控制面”，打开后控制面在侧栏里可用。临时 profile 与测试会话已删除。
- 控制面在应用内浏览器里检查了目录、启用与收藏、任务展开、预设保存；测试写入已撤回。
- 仓库检查、`test_atlas_index.py` 与 SaaS 图谱检查通过。
- 本机桌面 DSH 的 desktop profile 已装上插件，应用在安装前已启动，重启后才会加载；没有在桌面应用里看过。

## 没有做的

- Video 流水线按预设调用 TTS 与渲染、独立 Reporting 存储作为模块接入：预设与运行记录已能承载，执行部分等第一条真实流水线。
- Kit 单元本身的 description review：目前 review 只在挂载上。
- MCP 的 resources 与 prompts。
- 没有对照，没有真实任务里的使用证据。
