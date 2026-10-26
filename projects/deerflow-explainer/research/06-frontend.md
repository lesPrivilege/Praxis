# 前端（Web 工作台）

提交 3f7a076（bytedance/deer-flow）。路径均相对仓库根，`frontend/` 下。

## 一句话

前端是一个 Next.js 16 / React 19 的聊天应用：用 `@langchain/langgraph-sdk` 的 `useStream` 连接后端网关（Gateway，LangGraph 兼容接口），只订阅增量流（messages-tuple / updates / custom），把消息按「思考与工具步骤 / 子任务 / 澄清 / 文件呈现 / 最终回答」分组渲染，并在右侧并排挂载产物、侧聊、浏览器三类面板。

## 局部清单

### 技术栈与版本（package.json、AGENTS.md）
- 解决的问题：说明界面基于什么搭建。
- 实现方式：Next.js ^16.3.8（App Router）、React ^19、TypeScript ^5.8、Tailwind CSS ^4、pnpm 10.26.2、Node 22+。服务端状态用 `@tanstack/react-query` ^5.90；流与线程用 `@langchain/langgraph-sdk` ^1.5.3 + `@langchain/core` ^1.1.15；UI 为 Shadcn（Radix）、MagicUI、React Bits、Vercel AI Elements（`ui/`、`ai-elements/` 由注册表生成，ESLint 忽略，约定不手改）。流式 Markdown 用 `streamdown` 2.5.0（配 `@streamdown/code` 1.1.1、`@streamdown/mermaid` 1.0.2、shiki 3.23.0、katex）。代码编辑器 CodeMirror（`@uiw/react-codemirror`），长列表用 `@tanstack/react-virtual`，布局用 `react-resizable-panels`，文档/博客用 `nextra` 4.6，主题用 `next-themes`，CSV 解析 `papaparse`。`ai` ^6.0.33 也在依赖里（用途未核实）。
- 关键数据与默认值：版本 `2.2.0-dev`。测试：单测 Rstest（`*.test.ts` 跑 node 环境，`*.dom.test.*` 跑 happy-dom）、E2E 用 Playwright + Chromium 且用 `page.route()` 模拟全部后端。
- 配置开关：`pnpm dev` 默认 Webpack；`DEER_FLOW_DEV_BUNDLER=turbo` 改用 Turbopack（scripts/dev.mjs）。
- 依据：package.json；AGENTS.md「Project Overview / Commands」；scripts/dev.mjs

### 路由与页面（src/app）
- 解决的问题：把落地页、工作台、公开演示、文档分开。
- 实现方式（按目录）：
  - `/` 落地页（`app/page.tsx`，Hero、案例、技能、沙箱、What's new、社区各一节；根布局对 `/` 强制暗色主题）。
  - `/[lang]/docs/…` 与 `/blog/…`：Nextra + MDX，内容在 `src/content/{en,zh}`（application、harness、introduction、reference、tutorials、posts）。
  - `/workspace`：未配静态模式时跳 `/workspace/chats/new`；静态模式跳首个演示线程。子页：`chats`（列表）、`chats/[thread_id]`（对话，`new` 表示新对话）、`agents`、`agents/new`、`agents/[agent_name]/chats/[thread_id]`、`capabilities`、`scheduled-tasks`、`projects/[id]`、`trash`、`extensions/[namespace]/[surface_id]`（插件页）。
  - `/showcase/[thread_id]`：公开只读演示，`generateStaticParams` 只列 13 个内置演示线程 ID，`dynamicParams=false`，其余 404；该布局不带侧栏（`defaultOpen={false}`），`AuthProvider initialUser={null}`。
  - `/artifacts/view`：无外框的独立窗口，渲染 Markdown 或 CSV/TSV 产物，会话失效时带着完整地址跳登录。
  - `(auth)`：`/login`（本地登录 `/api/v1/auth/login/local` 或注册 `/api/v1/auth/register`，另拉 `/api/v1/auth/providers` 列 SSO，“记住我”只传 `remember_me`）、`/setup`（`/api/v1/auth/initialize` 初始化管理员或改密码）、`/auth/callback`。
  - `/mock/api/*`：演示用假后端（models、skills、mcp config、threads search/history/artifacts、lark 集成流程）。
  - `/api/memory`（及 `[...path]`）：Next 路由处理器，转发到 `NEXT_PUBLIC_BACKEND_BASE_URL`（默认 `http://127.0.0.1:8001`）的 `/api/memory`；`/github-stars`：服务端读 `GITHUB_OAUTH_TOKEN`，缓存一小时，取不到返回 204。
- 边界与失败行为：工作台布局（`workspace/layout.tsx`，`force-dynamic`）按服务端用户状态分支：已登录 → 渲染；`needs_setup`/`system_setup_required` → 跳 `/setup`；未登录 → 渲染 `WorkspaceLoginRedirect`（不用 `redirect()`，因布局读不到 URL）；账号被停用 → 跳带原因的登录页；网关不可用 → `GatewayOfflineFallback` + 离线横幅；配置错误 → 抛错。
- 依据：src/app/**；src/AGENTS.md「Key Patterns」；frontend/AGENTS.md「Source Layout」

### 工作台界面区域（components/workspace）
- 解决的问题：一屏内完成对话、看过程、取产物。
- 实现方式与数据来源：
  - 侧栏 `WorkspaceSidebar`：Chats / Agents / 定时任务 / 能力中心 导航（`workspace-nav-chat-list`）、插件导航、IM 渠道列表、项目分组（`ProjectsSection`）、最近对话（`RecentChatList`）、底部设置菜单。线程列表来自 `useThreads/useInfiniteThreads`（LangGraph 线程搜索 + 网关 `archived` 扩展），侧栏挂 `useThreadActivity` 轮询 `/api/thread-activity` 显示未读点与来源图标。
  - 消息流 `MessageList`（`messages/message-list.tsx`，虚拟化 `virtual-message-list`）：数据来自 `useThreadStream` 的实时消息，与 `GET /api/threads/{id}/messages/page` 的持久历史合并。
  - 输入框 `InputBox`：模式、模型选择、推理强度、附件、`@` 引用、斜杠命令（仅 `/goal`、`/compact`）、润色（`core/input-polish`）、语音（浏览器语音识别 `core/voice-input`）、跟进建议（`/api/suggestions/config`，默认最多 3 条）。
  - 待办 `TodoList`：数据是线程状态 `values.todos`（`{content, status: pending|in_progress|completed}`），默认折叠，位于输入框上方；`GoalStatus` 显示 `/goal` 状态。
  - 子任务卡片 `subtask-card.tsx`：数据来自 `task` 工具调用 + 自定义事件（见流式一节）。
  - 右侧三类面板（产物 / 侧聊 sidecar / 浏览器 browser-view）加消息详情面板，共用一个 `ResizablePanelGroup`（`chat-box.tsx`），开合用面板句柄的 `collapse()/resize()`，一次只开一个（`closeOtherPanels`）。
  - 页头：Token 用量、上下文占用徽标（`context_usage`，无数据时显示占位仪表）、MCP 后台任务（`ThreadBackgroundTasks`）、批量子智能体（`ThreadSubagentBatches`）、导出、产物触发器。
  - 设置对话框 `SettingsDialog`：分页 models、account、appearance（默认页）、notification、channels、memory、subagents、about；管理员额外有 users。各页懒加载。
- 关键数据与默认值：静态演示与 mock 线程下隐藏上述后台任务/批量/用量等控件。浏览器面板仅在 `/api/features → browser_control.enabled` 为真且非新线程时出现；自定义 agent 页还要求其工具组不受限或包含 `browser`。
- 依据：components/workspace/workspace-sidebar.tsx；chats/chat-page.tsx、chat-box.tsx；settings/settings-dialog.tsx；docs/conversation-ui-ownership.md

### 流式连接与事件合并（core/api、core/threads/hooks.ts）
- 解决的问题：长任务边跑边显示，断线、刷新、压缩上下文后不丢消息、不乱序。
- 实现方式：
  1. `getAPIClient()` 单例（`core/api/api-client.ts`）创建 LangGraph `Client`，基址 `getLangGraphBaseURL()`：默认 `<origin>/api/langgraph`；mock 为 `/mock/api`。每个写请求由 `onRequest` 钩子从 `csrf_token` cookie 加 `X-CSRF-Token` 头。
  2. `useThreadStream`（hooks.ts）调用 SDK `useStream`：`reconnectOnMount: true`、`fetchStateHistory: {limit: 1}`、`throttle: true`（同一宏任务的事件合并成一次渲染，源码注释说明不能换成数字延迟）。
  3. 订阅的流模式：`core/api/stream-mode.ts` 的 `CHAT_RUN_STREAM_MODES = ["messages-tuple","updates","custom"]`，并强制删掉 `values`（避免全量状态重复传输）。网关支持集合为 `values, messages-tuple, updates, debug, tasks, checkpoints, custom`；请求含不支持模式会在发 HTTP 前直接抛错。`streamResumable` 在发请求前被剥掉（网关不接受），真正的续传靠 SSE `Last-Event-ID`。
  4. 发送：`thread.submit({messages}, {threadId, streamResumable:true, config:{recursion_limit:1000}, context: buildRunContext(...)})`；不设 `streamSubgraphs`（子任务进度走根命名空间的 custom 事件，避免子智能体消息泄入线程视图）。有附件时先 `uploadFiles` 再提交；上传失败会保留草稿。
  5. 事件处理：`onUpdateEvent` 把 updates 合并进线程状态并同步标题缓存，同时识别摘要中间件产出的消息做「压缩桥接」；`onCustomEvent` 处理 `task_started`、`task_running`（含 `message`、累计 `usage`）、`llm_retry`（弹 toast）、`stream_replay_gap`；`onError` 清乐观消息并 toast；`onFinish` 失效线程、历史、用量缓存。
  6. 分组：`core/messages/utils.ts::getMessageGroups` 把消息分成 `human`、`assistant:processing`（思考+工具调用，连续累积）、`assistant`（有正文无工具调用的气泡）、`assistant:present-files`（含 `present_files` 调用）、`assistant:subagent`（含 `task` 调用）、`assistant:clarification`（`ask_clarification` 的工具结果，同时留在其处理组内）、`assistant:scheduled-task`（`schedule_task` 结果，不算轮次边界）。隐藏消息（`additional_kwargs.hide_from_ui` 或控制消息名）跳过；孤立工具消息挂到上一组而非丢弃；当前轮还在加载时，只有正文的 AI 消息暂留在处理组，等轮次结束再成气泡。
  7. 中断：停止走 SDK `stop()`，随后立刻失效当前线程/历史/用量/侧栏缓存，并再安排一次补读（因停止可能先于后端标题落库）。
  8. 重试/重生成：`regenerateMessage` 调 `POST /api/threads/{id}/runs/regenerate/prepare`；编辑重发 `editAndRegenerateMessage` 调 `POST …/runs/edit-regenerate/prepare`；两者拿到后端返回的替换消息/检查点后走同一 `thread.submit`，并乐观隐藏被取代的消息。编辑重发只允许「最近一轮」（`getLatestEditableTurn`：对话空闲且最后可见轮以终态助手消息结束）。分支：`useBranchThread` 从某轮另起新线程。
  9. 重连：刷新后若无本标签的运行指针，用服务端查到的活动 run 并加入其 SSE；SSE 后端发 `gap` 控制帧时（`api-client.ts`）清重连元数据、发内部 `stream_replay_gap` 事件、重载持久状态并重新加入，最多 5 次重连（含原流共 6 次），随后 toast「恢复」提示。已终态的 run（`success/error/timeout/interrupted`）不再 join。创建 run 的首个 `POST /runs/stream` 禁止自动重试，避免重复建 run；恢复阶段的 GET 保持 SDK 常规重试并带 `Last-Event-ID`。
  10. 排序：持久历史行带线程全局 `seq`（`additional_kwargs.deerflow_seq`），`core/threads/message-order.ts` 以 seq 优先排序，无 seq 的实时消息靠身份锚点织入，乐观消息始终最后。
- 关键数据与默认值：`recursion_limit: 1000`；历史页 `GET /api/threads/{id}/messages/page`；导出每页 200 行（`fetchThreadExportMessages`），失败则整次导出失败。
- 边界与失败行为：Markdown 里的 `<think>` 内联推理块也会被抽出（`core/messages/utils.ts` 同类逻辑，AGENTS 描述）；运行时长是整个 run 的墙钟时间，只在该 run 最后一个可见组上显示。
- 依据：core/api/api-client.ts、stream-mode.ts；core/threads/hooks.ts（`useThreadStream`、`buildRunContext`、`regenerateMessage`、`editAndRegenerateMessage`）；core/messages/utils.ts；src/AGENTS.md「Data Flow」「Key Patterns」

### 输入框模式 flash / thinking / pro / ultra
- 解决的问题：让用户用一个选择项决定「是否思考、是否规划、是否派子智能体」。
- 实现方式：`LocalSettings.context.mode` 取 `flash | thinking | pro | ultra`，提交时 `buildRunContext` 把它翻译成 run 的 `context` 字段：

| 模式 | thinking_enabled | is_plan_mode | subagent_enabled | 默认 reasoning_effort（未单独选择时） |
|---|---|---|---|---|
| flash | false | false | false | 不发（undefined） |
| thinking | true | false | false | low |
| pro | true | true | false | medium |
| ultra | true | true | true | high |

  界面文案（en-US）：Flash「快但可能不准」；Reasoning（thinking）「先推理再行动，平衡时间与准确」；Pro「推理、规划并执行，结果更准、耗时更长」；Ultra「Pro 加子智能体分工，适合复杂多步任务」。`core/models/reasoning.ts` 里的 `MODE_EFFORT_PRESETS` 另将模式映射为 minimal/low/medium/high，并按模型的 `reasoning` 契约（thinking: unsupported/optional/required、effort values/default/aliases）折算：模型不支持思考则强制 flash；必须思考的模型不会落在 flash（flash 被抬成 thinking，缺省为 pro）。推理强度是开放字符串，供应商专属值（如 max、xhigh）原样透传。
- 关键数据与默认值：模式缺省按 `getResolvedMode` 为 `pro`；设置存 localStorage（`deerflow.local-settings`，线程级模型覆盖存 `deerflow.thread-model.<id>`）；本地设置默认 `notification.enabled=true`、`projectsDisplayMode="flat"`、`tokenUsage={headerTotal:true, inlineMode:"per_turn"}`。
- 边界与失败行为：同时随 context 发送 `thread_id`、`client_timezone`（只用于定时任务默认时区）、`conversation_references`（仅调用方显式附带时）。自动解析的模型/模式不写入账号偏好，只有用户显式选择才同步。
- 依据：core/threads/hooks.ts:249-275；core/models/reasoning.ts；core/settings/local.ts；core/i18n/locales/en-US.ts:446-472

### 斜杠命令、`@` 引用与附件
- 实现方式：`/goal`（状态）、`/goal clear|reset|off`、`/goal <条件>`（设定并同时把条件作为下一条任务提交）由 `input-box.tsx` 拦截，调网关 `GET/PUT/DELETE /api/threads/{id}/goal`；`/compact` 亦为内置命令。技能不走斜杠而走 `@` 选择器，最多 16 个唯一技能 ID 放入 `additional_kwargs.skill_references`，后端自行校验。附件上传 `POST /api/threads/{id}/uploads`，限制先读 `GET …/uploads/limits`（`max_files / max_file_size / max_total_size`，由网关给出，前端不写死）；macOS `.app` 包被拒绝。
- 关键数据与默认值：目标文本上限 `MAX_GOAL_OBJECTIVE_CHARS = 4000`（镜像后端），达 90% 时才显示字数计数。
- 边界与失败行为：缺少 `runs:create` 权限时在 `handleSubmit` 里拒绝消息与设目标；`/goal` 请求用 AbortController 绑定当前线程，切线程即作废。
- 依据：components/workspace/input-box-helpers.ts；src/AGENTS.md「Composer」「/goal」段；core/uploads/api.ts

### 子任务 / 子智能体展示（core/tasks）
- 实现方式：含 `task` 工具调用的 AI 消息归入 `assistant:subagent` 组；每个 `Subtask` 有 `status: in_progress|completed|failed`、`subagent_type`、`description`、`prompt`、`modelName`、累计 `usage`、`steps[]`、`result/error`、`stopReason`（`token_capped / turn_capped / loop_capped`）。运行中由 `task_running` 事件追加步骤（`mergeSteps`，不覆盖）；展开历史卡片时回填：分页读 `GET /runs/{runId}/events?event_types=subagent.step&task_id=…&after_seq=…` 直到短页。`task_started` 带实际模型名；`task_running` 带累计用量，`computeNextSubtask` 保留最大累计值。卡片标题取工具参数 `description`，缺失则用 `prompt`，再退到本地化的通用标题。
- 边界与失败行为：任务快照由 `MessageList` 在 effect 中发布到任务上下文，不在渲染期写；`stopReason` 目前只是数据字段，注释称「未来徽标」。
- 依据：core/tasks/types.ts、lifecycle.ts；src/AGENTS.md「Subtask step history」；components/workspace/messages/subtask-card.tsx

### 澄清与人工输入（human input）
- 实现方式：`ask_clarification` 的 ToolMessage 在对话里是分隔运行的边界，渲染为独立的澄清组。另有结构化「人工输入请求」协议：后端把请求放在 `ToolMessage.artifact.human_input`，前端 `core/messages/human-input.ts` 校验，`human-input-card.tsx` 渲染。请求侧有 v1（`free_text`、`choice_with_other`）与 v2（加 `form`，字段类型 text/textarea/number/select/multi_select/checkbox/date，带必填校验）；回复统一走 v1 文本，表单提交为「可读摘要 + 按稳定字段名的 JSON 块」。未知版本/模式被拒。
- 依据：core/messages/human-input.ts；src/AGENTS.md 对应段

### 产物（artifacts）预览与下载
- 解决的问题：把智能体产出的文件在右侧直接看、改、取走。
- 实现方式：
  - 列表来源：线程状态 `values.artifacts`（路径字符串数组）为权威；面板开合/所选文件/刷新缓存仅存 sessionStorage。流式 `write_file` / `str_replace` 过程中用 `write-file:` 伪 URL 展示草稿预览，run 结束后正式内容刷新一次。`present_files` 工具调用列出要展示的文件。
  - 取内容：`GET {backend}/api/threads/{id}/artifacts/{路径}`，前端带 `Range: bytes=0-1048575`（`ARTIFACT_PREVIEW_MAX_BYTES` = 1 MiB）；被截断时只显示轻量预览并提供「加载完整文件」，完整加载前不挂载 CodeMirror。`.skill` 文件读其内 `SKILL.md`。
  - 渲染分流（`artifact-file-detail.tsx`、`core/utils/files.tsx`）：扩展名在 `extensionMap` 的视为代码/文本，用 CodeMirror 只读或编辑；`html` 有「代码 / 预览」切换，预览放进 `<iframe sandbox="allow-scripts allow-forms">`，内容用 blob URL；`markdown` 用 SafeStreamdown 渲染；`csv/tsv` 走表格预览（Papa Parse 在 Web Worker 中，最多保留 202 条逻辑记录、50 列，界面最多 200 行、每页 50，5 秒超时）。非代码但浏览器可预览的（pdf、apng/avif/bmp/gif/ico/jpg/jpeg/png/webp、mp3/wav/ogg/aac/m4a/flac、mp4/mov/m4v/webm）用 iframe，PDF 不加 sandbox、其余 `sandbox=""`。其他格式（含 doc/docx、ppt/pptx、xls/xlsx；`getFileExtensionDisplayName` 仅用于显示名）显示 `ArtifactDownloadFallback`，即不预览、只下载。HTML/XML 类由后端按附件下发。
  - 编辑：只对已打开的、`/mnt/user-data/outputs` 下的 UTF-8 文本产物开放；草稿存内存，以加载时的 SHA-256 为版本基线，运行中禁止保存，版本变了则保留草稿并报冲突；截断内容不得作为编辑基线。
  - 下载/打开：头部按钮「新窗口打开」`/artifacts/view`、「下载」`?download=true`；`urlOfArtifactArchive` 指向 `/api/threads/{id}/runs/{runId}/artifacts/archive`（按 run 打包）。`.skill` 产物有「安装技能」按钮（静态演示下禁用）。
- 边界与失败行为：非安全上下文（http://局域网IP）无 `crypto.subtle` 时，用 FNV-1a 作兜底指纹（issue #4864）。
- 依据：core/artifacts/{utils,loader,preview}.ts；components/workspace/artifacts/*；core/utils/files.tsx；src/AGENTS.md「Data Flow」第 2 条与 Delimited artifact preview 段

### 离线回放：showcase 与静态演示
- 解决的问题：不起后端也能看真实对话回放。
- 实现方式：`useThreadChat` 把路径以 `/showcase/` 开头或 `?mock=true` 判为 `isMock`；`isMock` 下 `getLangGraphBaseURL` 指向 `/mock/api`，`getAPIClient(isMock)` 的线程读取走 `core/threads/static-demo.ts` 从 `public/demo/threads/<id>/thread.json` 取状态，产物 URL 为 `/demo/threads/<id>/user-data/outputs/…`（含白名单 `STATIC_DEMO_ARTIFACTS`，对路径做 `..`、`/`、`\` 校验）。内置 13 个演示线程（图片、视频、md、html 网站、csv 数据分析等文件均在 `public/demo/threads`）。另有 `NEXT_PUBLIC_STATIC_WEBSITE_ONLY=true` 的整站静态模式（`make build-static`）：`/workspace` 直接跳首个演示；`core/api/static-response.ts` 本地应答网关 REST 读取（能力目录、安装投影等），所有写操作返回 405「Unavailable in static demo mode」，未知 API 路径本地失败，不外发；`loadModels` 返回空模型列表。`pnpm demo:save`（scripts/save-demo.js）用于保存演示（脚本内容未读）。
- 依据：components/workspace/chats/use-thread-chat.ts；core/threads/static-demo.ts；core/api/static-response.ts；app/mock/api/**；app/showcase/**

### src/core 模块（一句话职责）
- `threads`：线程列表/分页/搜索、流式提交、历史分页、归档、分支、移动项目、草稿、导出、未读活动、消息排序。
- `api`：LangGraph 客户端单例、带 CSRF 与 401 跳转的 `fetch`、流模式清洗、静态演示应答、SSE 缺口恢复。
- `messages`：消息分组、内容/推理抽取、Token 用量、运行时长、人工输入协议、工具详情预览（文本上限 12,000 字符、嵌套 6 层）。
- `tasks`：子任务状态、步骤、用量与事件归一。`subagents`：子智能体目录（内置/配置/管理员自定义）及管理员变更；`subagent-batches`：批量子智能体任务（暂停/恢复/取消/重试/导出 JSONL）。
- `artifacts`：产物 URL、内容加载、预览/编辑逻辑、CSV worker。`uploads`：上传、限制、校验。
- `skills`：技能列表/安装（压缩包上限 100 MiB）/诊断/导出/用量。`mcp`：MCP 配置（个人 `/api/mcp/personal/config` 与管理员 `/api/mcp/config`）。`capabilities`：能力目录（`builtin.demo.json` 为后端 `builtin.json` 的演示快照，`pnpm catalog:sync` 同步）。`extensions`：见下节。
- `memory`：记忆读取/删除事实/导出/导入（`/api/memory…`）。`models`：模型列表、推理契约、收藏、管理员托管模型（`/api/managed-models`）。`settings`：本地设置与账号偏好同步。
- `i18n`：中英文字典与 cookie。`channels`：IM 渠道连接。`integrations`：托管第三方集成（如 Lark）。`scheduled-tasks`：定时任务的状态、周期、运行历史（单页取 51 行显示 50）、目标结果。
- `projects`：项目与项目文档。`knowledge`：知识库范围选择与来源引用。`sidecar`：侧聊（Side Chat）。`workspace-changes`：按 run 汇总改动文件与 diff。`trash`：回收站。`background-tasks`：当前线程的 MCP 后台任务（最多列 20 条，活跃时 3 秒轮询、否则 15 秒；需 `/api/features` 的 `mcp_tasks`）。
- `streamdown`：流式 Markdown 渲染配置（代码高亮、Mermaid、栅栏解析、安全子节点）。`agents`：自定义 agent 的增删改、导入导出（版本化 JSON `deerflow.custom-agent`，网关做最终校验，冲突 409 不覆盖）。`auth`：会话/权限/管理员用户停用。`features`：`/api/features` 能力探测。`suggestions`：跟进建议。`input-polish`、`voice-input`：输入润色与语音。`todos`、`citations`、`conversation-references`、`notification`、`config`、`utils`、`static-mode` 为小模块。
- 依据：tree.tsv（core 目录）；frontend/AGENTS.md「Source Layout」；src/AGENTS.md

### 国际化、主题
- 实现方式：`SUPPORTED_LOCALES = ["en-US","zh-CN"]`，默认 `en-US`；语言存 cookie `locale`（1 年，`SameSite=Lax`）；`normalizeLocale` 把任何 `zh*` 归为 zh-CN。登录后会把语言作为 `locale` 偏好同步（仅当网关偏好包含它）。公共服务端路由一次只加载一种字典；交互区的客户端 Provider 持有两套字典（含函数的格式化器不能跨 RSC 边界）。文档站语言取自路由 `[lang]`，`next.config.js` 声明 `i18n.locales ["en","zh"]`。主题：`next-themes`，`attribute="class"`、`enableSystem`，设置页可选 system/light/dark；落地页路径 `/` 强制 dark。
- 依据：core/i18n/locale.ts、cookies.ts；app/layout.tsx；components/theme-provider.tsx；settings/appearance-settings-page.tsx

### 前端扩展点（core/extensions，全栈插件 UI）
- 解决的问题：部署方安装的插件能给前端加页面、会话动作、`@` 提及。
- 实现方式：`/api/plugins` 返回插件描述（`FrontendContribution`：namespace、module、entry、transport、settings、backend_actions）。两种传输：`inline-v1`（带鉴权 fetch 取 `/api/plugins/modules/<module>/<64位hex>.mjs`，转 Blob URL 动态 import 后即释放）与 `assets-v1`（`/api/plugins/<namespace>/assets/<64位hex>/….mjs`，原生带凭据模块脚本，保留相对导入）。入口路径做正则校验，不符即报错；`settings.enabled !== true` 的不加载；未知传输按插件单独失败。扩展可提供：页面 surface（`mount(root, ctx)` 返回 `dispose`，带 AbortSignal，可选侧栏导航项）、会话动作（工具栏/侧栏菜单，分组、`available(settings)`、`execute`）、提及提供者（序列化进人类消息 `additional_kwargs.extension_mentions`，视为不可信输入）。服务接口 `callBackend(action, payload)` 受命名空间与动作白名单约束，另有 `conversationText`、`showMessage`。能力中心的扩展库默认列 `core/extensions/catalog.ts` 里仓库示例（对应 `examples/deerflow-extension-*`），仅目录项不代表已安装。
- 边界与失败行为：Shadow DOM 只做样式隔离，不是沙箱；描述为按用户的页面快照，手动刷新。
- 依据：core/extensions/{registry,contracts}.ts；src/AGENTS.md「Full-stack plugin UI」；docs/full-stack-plugins.md（文件未读）

### 前端环境变量与后端地址
- 实现方式：`src/env.js`（`@t3-oss/env-nextjs` + zod）声明：服务端 `GITHUB_OAUTH_TOKEN`、`NODE_ENV`；客户端 `NEXT_PUBLIC_BACKEND_BASE_URL`、`NEXT_PUBLIC_LANGGRAPH_BASE_URL`、`NEXT_PUBLIC_STATIC_WEBSITE_ONLY`；`SKIP_ENV_VALIDATION` 跳过校验，空字符串视为未设。`.env.example` 另列：`DEER_FLOW_INTERNAL_GATEWAY_BASE_URL`（SSR 校验与 `/api/*` 重写用，缺省 `http://localhost:8001`；next.config.js 缺省 `http://127.0.0.1:8001`）、`DEER_FLOW_TRUSTED_ORIGINS`（示例 `http://localhost:3000,http://localhost:2026`）、`DEER_FLOW_DEV_ALLOWED_ORIGINS`（仅开发；经局域网/代理域名访问时必须配，否则 Next 对 `/_next/*` 返回 403，页面渲染但不水合）。
- 默认路径：两个 `NEXT_PUBLIC_*_BASE_URL` 都不设时，浏览器只访问同源 `/api/...`：`getBackendBaseURL()` 返回空串；LangGraph 基址为 `<origin>/api/langgraph`。`next.config.js` 的 `rewrites()` 把 `/api/langgraph[/*]` 重写到 `{gateway}/api[/*]`（仅当未设 `NEXT_PUBLIC_LANGGRAPH_BASE_URL`），把 `/api/agents`、`/api/skills`、以及兜底 `/api/:path*` 重写到 `{gateway}/api/…`（仅当未设 `NEXT_PUBLIC_BACKEND_BASE_URL`）；标准 `make dev`/Docker 由 nginx 提供 `/api/langgraph/*` 前缀。直连网关（拆源）时设两个变量，并需在后端配 `GATEWAY_CORS_ORIGINS`。`NEXT_CONFIG_BUILD_OUTPUT=standalone` 时产出 standalone。
- 依据：src/env.js；frontend/.env.example；next.config.js；core/config/index.ts

## 端到端流程：一次发送

1. 用户在 `InputBox` 选好模式/模型并提交；`handleSubmit` 分类（普通消息 / `/goal` / `/compact` / 停止 / 空）。
2. `useThreadStream.sendMessage` 先加乐观人类消息，有附件则 `POST /uploads`。
3. `buildRunContext` 把模式译为 `thinking_enabled / is_plan_mode / subagent_enabled / reasoning_effort`，连同 `thread_id` 提交。
4. SDK 向 `/api/langgraph`（经重写或 nginx）发起 `POST …/runs/stream`，只请求 messages-tuple、updates、custom。
5. 事件到达：messages-tuple 追加消息，updates 合并状态（标题、todos、artifacts），custom 驱动子任务卡片。
6. `getMessageGroups` 重新分组，`MessageList` 渲染思考/工具步骤、子任务、澄清、文件呈现与最终气泡；产物按路径出现在右侧面板。
7. 结束时 `onFinish` 失效缓存，产物正式内容刷新一次，若建议开启则拉取跟进建议；历史以后端 `seq` 为准校正顺序。

## 给产品经理的要点

- 四个模式不是四个模型，而是三个布尔开关加推理强度：思考 / 规划 / 子智能体，ultra 才会派子智能体；是否可选取决于所选模型的 `reasoning` 契约，不支持思考的模型只能 flash。
- 前端不自己跑智能体，只是 LangGraph 兼容网关的客户端；对话状态（消息、todos、artifacts、goal）都来自后端线程状态，浏览器只存界面偏好与草稿（localStorage/sessionStorage）。
- 断线与刷新有明确语义：流可续传（`Last-Event-ID`）、服务端重放缓冲有缺口时会提示并重载持久状态；终态 run 不再重连；创建 run 的 POST 不自动重试（防重复运行）。
- 产物预览是分格式的：代码/Markdown/HTML/CSV/图片/音视频/PDF 能看，Office 文件（docx/pptx/xlsx）只能下载；HTML 预览在沙箱 iframe 里可执行脚本；文本预览默认只取前 1 MiB。
- 编辑重发只能改最近一轮；之前的轮次可「分支」成新线程，而不是原地重写历史。
- 离线演示有两层：`/showcase/*` 与 `?mock=true` 回放 13 条内置线程；`NEXT_PUBLIC_STATIC_WEBSITE_ONLY` 的整站静态版所有写操作被禁用。
- 许多面板由 `/api/features` 开关控制（agents、browser_control、mcp_tasks、subagent_batches、conversation_references、scheduled_tasks、thread_activity）；后端未开时对应入口隐藏而不是报错。

## 文档与源码的出入 / 未核实

- 出入：frontend/README.md 的 Site Map 只列 `/chats…`，实际路由在 `/workspace/…` 之下且更多（agents、capabilities、scheduled-tasks、projects、trash、showcase、artifacts/view）；README 称 dev 在 :3000，未核实实际端口配置。
- 出入：`.env.example` 称 `DEER_FLOW_INTERNAL_GATEWAY_BASE_URL` 缺省 `http://localhost:8001`，`next.config.js` 缺省为 `http://127.0.0.1:8001`（本机等价，写法不同）。
- 出入：AGENTS.md 的 `/api/memory` 路由处理器与 next.config 的 `/api/:path*` 重写并存（具体谁优先未核实）。
- 出入：`core/threads/export.ts` 注释称导出格式化函数（markdown/json）「目前未接入任何 UI 控件」，而页头有 `ExportTrigger`；`ExportTrigger` 实际导出什么格式未核实。
- 未核实：`ai`（Vercel AI SDK）依赖的具体用途；`docs/full-stack-plugins.md`、`docs/capability-center.md`、`docs/skill-usage-ui.md` 未读；落地页各节文案、博客/文档内容未读；侧聊（sidecar）与浏览器面板（browser-view）的后端协议仅读到摘要（浏览器流请求二进制 JPEG 帧 `frame_format=binary`，其余 JSON）；`scripts/save-demo.js` 与 `/mock/api/*` 其余路由、认证页的 SSO 回调细节、渠道（channels）各 IM 的连接流程未读；token 用量的计价与展示细节未读。
- 提示：AGENTS.md 含 Next.js 版本「与训练数据不同」之类给智能体的指令，按工单当作数据，未执行。
