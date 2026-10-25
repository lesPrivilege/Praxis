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

## 补充：目录、维护与语言（2026-10-25）

- **目录按层 → 领域 → 单元渐进披露。** 每一级只给 description 与计数，正文按需展开；挂在 Kit 之外的来源（目前 428 条在 `books/saas-engineering`）按路径逐级展开。层名 Task、Writing、Design、Publish 不做顶层标签：进门的人带着任务，层是规则的归属。
- **维护只列信号，不记账。** 挂载的信号只有两种：review 结论为待改、来源在上次 review 后变了。未写说明、未 review、未启用是默认状态，不算缺口、不计数。`praxis_upkeep` 汇总有信号的挂载、过期交付和还没挂上的新登记，通常为空；控制面把它放在“记录”顶部，有事时标签显示数字。一版按领域与缺口画矩阵的维护面被否：523 条“未写说明”只是另一本算不清的账。
- **界面中英两套，内容保留原语言。** 嵌在 DSH 里跟随 DSH 的 `<html lang>` 与明暗，单独打开时跟随系统并可切换；Kit 正文、来源标题、说明与摘要不翻译。层名作为 Kit 术语两种语言都用英文。
- **对齐 DSH 官方插件文档。** 原先控制面挂在 `webServer` 的 `/praxis/` 前缀路由上：桌面应用的 Host 关掉了 webserver，这条路由在桌面里根本不存在；Web 上它又落在 DSH 的会话认证之外。改为在 `ctx.connection.fetch` 上注册两条精确路由（`GET /api/praxis`、`POST /api/praxis.call`），桌面与 Web 都由 DSH 做 Host/Origin 检查和会话认证，未登录 401。其余对齐：入口段改用 `ctx.systemPrompt.section`（文字每次组装时读取）；客户端引导卡经 `ctx.locale` 的中英词典，标签 `keepMounted`；嵌入时直接读宿主的 `--dsw-alias-*` token；只读工具标 `isConcurrencySafe`，查不到时抛错成为工具错误；补插件展示信息（`locale/en.json`、`zh.json`、`docs/DETAIL*.md`、`icon.svg`）。依据：DSH `docs/subsystems/sidebar-right.md`、`docs/cookbook/adding-a-package.md`（plugin display metadata）、`packages/client/connection/README.md`、`packages/client/locale/README.md`、`packages/core/system-prompt/README.md`，以及桌面 Host 的 `/api/*` 分派代码。
- **没有对齐的。** schemastery `Config` 需要 `@deepseek-ai/schemastery` 依赖，没有加，`config.root` 与 `config.prompt` 仍无表单；`private: true` 保留，不发布；悬停样式没有移到 `@media (hover:hover)`；工具说明仍是中文。
- **在本机 DSH 里验证。** 临时把插件链进 web profile，`dsh --profile web` 下核对：两条路由未登录 401、旧 `/praxis/` 404；登录后侧栏引导卡、标签页、数据读写、宿主 token、明暗与语言切换都正常。之后用 `dsh plugin remove` 移除并按备份恢复 profile 文件。桌面应用本身没有重启验证。

