# Agent 通用层 UI：参考与选型索引

研究快照：2026-09-06。状态：Explore，不是采购、移植或集成通过的决定。

本索引把**行为基准、可复用组件、完整应用、专业原语**分开。所有 runtime_tested 均为 false；目录已见不等于源码已审；README 自述不等于实际可用性验证。

## 当前收束

先查 Courtwork 已有 assistant-ui 接入，再测试外部状态适配路线。AI Elements 是有边界的对照，Tool UI 是候选局部组件。OpenCode/OpenChamber/cdesktop 是具体交互的参考，不是整机底座。暂不定新栏数、不选 harness core。

| ID | 对象 | 层级 | 本轮位置 |
|---|---|---|---|
| R01 | Claude Code Desktop | product_reference | reference_only |
| R02 | Codex App | product_reference | reference_only |
| R03 | assistant-ui | behavior_toolkit | test_first_existing_dependency |
| R04 | Vercel AI Elements | behavior_and_presentation_components | bounded_alternative |
| R05 | Ant Design X | behavior_and_presentation_components | conditional_comparator |
| R06 | Tool UI | typed_tool_result_components | selective_leaf_trial |
| R07 | OpenCode Web | complete_application | pattern_reference_only |
| R08 | OpenChamber | complete_application | pattern_reference_only |
| R09 | cdesktop | complete_application | reference_only_beta |
| R10 | CloudCLI / Claude Code UI | complete_application | secondary_reference |
| R11 | Streamdown | specialized_primitive | isolated_renderer_trial |
| R12 | use-stick-to-bottom | specialized_primitive | only_if_no_existing_owner |
| R13 | Pierre Diffs / @pierre/diffs | specialized_primitive | conditional_read_only_trial |
| R14 | Pi：当前仓库与历史 web-ui 入口 | runtime_adjacent_reference | hold_unresolved_web_ui |
| R15 | Courtwork 公开 main：现状基线 | existing_project | inspect_local_before_changes |
| R16 | react-resizable-panels | specialized_primitive | optional_existing_layout_helper |
| R17 | xterm.js | specialized_primitive | only_for_real_terminal_capability |

## R01 · Claude Code Desktop

**已观察：**官方 Desktop 文档描述会话管理、权限模式、diff 审阅、preview 等工作入口。

**建议借用：**研究输入—工作过程—需要人处理—审阅结果的行为连续性；明确比较的是 Claude Code Desktop，不将 Claude Chat、CLI 和 Cowork 的行为混为一体。

**不采用：**不复制品牌资产，不将每个产品功能变成需求，不由公开 UI 推断内部状态模型。

**入口及核对层级：**
- `docs/en/desktop` — official_documentation
- `docs/en/permission-modes` — official_documentation

**来源：** [1](https://code.claude.com/docs/en/desktop)；[2](https://code.claude.com/docs/en/permission-modes)

**许可：**本轮未核验 / 仅产品参考。复制前仍需复核具体版本及文件。

**关联验收：**T01, T08, T14, T16, T24。

**限制：**未登录、录屏或实测；参考具体产品与页面，后续采样需记录版本、平台和权限模式。

## R02 · Codex App

**已观察：**OpenAI 官方 App 介绍以项目中的独立线程、长任务监督和结果审阅为主要能力。

**建议借用：**作为用户熟悉的行为参照；将跟进消息、停止、审阅、恢复分别写成测试，而不是复制界面截图。

**不采用：**不把 Codex App、CLI、Web、iOS 的队列/快捷键语义视为相同；不以内部 model turn 代替面向用户的 run 边界。

**入口及核对层级：**
- `index/introducing-the-codex-app/` — official_documentation

**来源：** [1](https://openai.com/index/introducing-the-codex-app/)

**许可：**本轮未核验 / 仅产品参考。复制前仍需复核具体版本及文件。

**关联验收：**T08, T09, T10, T23, T24。

**限制：**旧 developers.openai.com/codex/app/features/ 路径在检索中重定向；本文不据此宣称具体版本的 queue/steer 行为。

## R03 · assistant-ui

**已观察：**ExternalStoreRuntime 文档允许应用自有消息状态与回调，按适配器能力开放 UI 功能；Courtwork 已声明 @assistant-ui/react 0.15.4。

**建议借用：**先审计现有接入，再用公开 API 对接现有 projection；优先复用 Thread/Message/Composer 等行为，不将库的 runtime 名称误当 harness core。

**不采用：**不创建第二份 canonical work state；不默认开启编辑/重试/分支；不依赖 unstable/internal API；不因当前文档而自动升级锁定依赖。

**入口及核对层级：**
- `packages/react/src/` — directory_inspected
- `packages/react/src/primitives/` — directory_entry_seen
- `packages/react/src/hooks/` — directory_entry_seen
- `docs/runtimes/custom/external-store` — official_documentation

**来源：** [1](https://www.assistant-ui.com/docs/runtimes/custom/external-store)；[2](https://github.com/assistant-ui/assistant-ui/tree/main/packages/react/src)；[3](https://github.com/assistant-ui/assistant-ui)

**许可：**MIT（[许可入口](https://github.com/assistant-ui/assistant-ui)）。复制前仍需复核具体版本及文件。

**关联验收：**T01, T02, T04, T05, T06, T08, T09, T23。

**限制：**在线文档不等于已安装 0.15.4 API；需以本地 lockfile、类型导出和目标版本文档确认。

## R04 · Vercel AI Elements

**已观察：**可复制组件包含 conversation、prompt-input、message、tool、confirmation 等。已读 conversation 源码使用 use-stick-to-bottom；默认 Markdown 导出辅助逻辑仅提取 text parts。

**建议借用：**作为同一条回放下的组件级对照；可只取 prompt-input、tool、confirmation 等局部。完整会话组件只在替代方案中拥有滚动和消息展示职责。

**不采用：**不为示例迁 Vite 到 Next.js；不引入第二个会话生命周期/滚动控制器；不将 text-only transcript export 当作 SE 工作包导出。

**入口及核对层级：**
- `packages/elements/src/` — directory_inspected
- `packages/elements/src/conversation.tsx` — source_read
- `packages/elements/src/prompt-input.tsx` — file_name_seen_not_implementation_reviewed
- `packages/elements/src/message.tsx` — file_name_seen_not_implementation_reviewed
- `packages/elements/src/tool.tsx` — file_name_seen_not_implementation_reviewed
- `packages/elements/src/confirmation.tsx` — file_name_seen_not_implementation_reviewed
- `packages/elements/src/queue.tsx` — file_name_seen_not_implementation_reviewed
- `packages/elements/src/plan.tsx` — file_name_seen_not_implementation_reviewed
- `packages/elements/src/artifact.tsx` — file_name_seen_not_implementation_reviewed
- `packages/elements/src/sources.tsx` — file_name_seen_not_implementation_reviewed
- `packages/elements/src/inline-citation.tsx` — file_name_seen_not_implementation_reviewed

**来源：** [1](https://github.com/vercel/ai-elements/tree/main/packages/elements/src)；[2](https://raw.githubusercontent.com/vercel/ai-elements/main/packages/elements/src/conversation.tsx)；[3](https://elements.ai-sdk.dev/components/prompt-input)；[4](https://elements.ai-sdk.dev/components/confirmation)

**许可：**Apache-2.0（[许可入口](https://github.com/vercel/ai-elements/blob/main/LICENSE)）。复制前仍需复核具体版本及文件。

**关联验收：**T01, T04, T05, T06, T14, T29。

**限制：**文件名存在不代表语义符合本项目；复制式组件需要承担本地升级和样式维护成本。

## R05 · Ant Design X

**已观察：**官方将 React 组件、流式 Markdown、数据流 SDK 和卡片能力分为不同包。

**建议借用：**保留为较完整交互组件方案的对照；只有现有设计系统或特定控件收益足够大时再做小样。

**不采用：**不同时引入整套 Ant Design X、assistant-ui 和 AI Elements 作为三个重叠会话框架；不为 UI 引入其 SDK 或 A2UI。

**入口及核对层级：**
- `docs/react/introduce/` — official_documentation
- `packages/` — repository_structure_reference

**来源：** [1](https://x.ant.design/docs/react/introduce/)；[2](https://github.com/ant-design/x)

**许可：**本轮未核验 / 仅产品参考。复制前仍需复核具体版本及文件。

**关联验收：**T01, T05, T11, T27。

**限制：**本轮未核验具体组件实现与目标文件许可；Courtwork 已读 manifest 未显示该组件体系。

## R06 · Tool UI

**已观察：**项目提供 schema 驱动的工具结果组件与 action receipt 示例，包括 Approval Card、Question Flow、Plan、Progress Tracker、Citation、Code Diff 等。

**建议借用：**选一张问题卡与一张审批卡，接入现有 action/receipt；验证可读摘要、键盘操作、失效请求和未知 payload。

**不采用：**Zod 通过不等于内容正确；前端选中不等于后端授权/commit；不照搬解析失败 return null 的静默丢弃；不允许任意模型字符串指定可执行组件。

**入口及核对层级：**
- `docs/quick-start` — official_documentation
- `@tool-ui/approval-card` — documented_registry_entry
- `@/components/tool-ui/<component>/schema.ts` — documented_generated_destination_not_upstream_path

**来源：** [1](https://www.tool-ui.com/docs/quick-start)；[2](https://github.com/assistant-ui/tool-ui)

**许可：**MIT（[许可入口](https://github.com/assistant-ui/tool-ui)）。复制前仍需复核具体版本及文件。

**关联验收：**T13, T14, T15, T16, T17, T18, T21。

**限制：**只核对文档、README 和 schema/receipt 接入方式；未完整审阅所有组件源码。

## R07 · OpenCode Web

**已观察：**packages/app 的 session.tsx 为 Solid 组件，围绕 session、review、自动滚动与应用上下文组织界面。

**建议借用：**拆读 session 身份、权限/问题入口、工具与文件审阅的组织方式；比较恢复与进行中状态，不移植整机。

**不采用：**不因参考实现迁 React 到 Solid；不引入 OpenCode 服务端、SDK、权限或工作区模型为本项目默认 core。

**入口及核对层级：**
- `packages/app/src/pages/session.tsx` — source_excerpt_read；ref=dev
- `packages/app/src/app.tsx` — source_excerpt_read；ref=dev
- `packages/app/package.json` — manifest_read；ref=dev
- `packages/app/README.md` — readme_read；ref=dev

**来源：** [1](https://github.com/anomalyco/opencode)；[2](https://github.com/anomalyco/opencode/blob/dev/packages/app/src/pages/session.tsx)；[3](https://github.com/anomalyco/opencode/blob/dev/packages/app/README.md)

**许可：**MIT（[许可入口](https://github.com/anomalyco/opencode)）。复制前仍需复核具体版本及文件。

**关联验收：**T08, T11, T14, T23, T24。

**限制：**源码片段和目录核对，不是全仓架构或端到端质量审计；采用前记录实际 commit。

## R08 · OpenChamber

**已观察：**README 描述基于 OpenCode 的会话、权限、分支、diff/review 和跨设备界面；packages/ui/src 下有 components、hooks、stores、sync。

**建议借用：**优先研究会话切换保留草稿、审阅意见带回对话、diff 选区和窄屏恢复；逐条落成行为验收。

**不采用：**不吸收 OpenCode backend 耦合、云端/隧道、多 agent、GitHub 管线及完整设置中心。

**入口及核对层级：**
- `packages/ui/src/` — directory_inspected
- `packages/ui/src/components/` — directory_entry_seen
- `packages/ui/src/hooks/` — directory_entry_seen
- `packages/ui/src/stores/` — directory_entry_seen
- `packages/ui/src/sync/` — directory_entry_seen

**来源：** [1](https://github.com/openchamber/openchamber)；[2](https://openchamber.dev/)

**许可：**MIT（[许可入口](https://github.com/openchamber/openchamber)）。复制前仍需复核具体版本及文件。

**关联验收：**T02, T19, T20, T23, T24, T28。

**限制：**列举能力是项目自述；未独立测试性能、稳定性或访问真实账号。

## R09 · cdesktop

**已观察：**README 明示 beta；通过 child process 包装多个 agent；Web 应用构建入口是 packages/local-web；Tauri 已接线但 README 表示尚未发布。

**建议借用：**用于研究桌面式 agent 壳、transcript 与检查结果的邻接关系；只列为候选参考，不再给出默认底座排名。

**不采用：**不将 beta、多 provider 或截图丰富视为成熟证据；不继承 child-process 生命周期假设；不把未发布的桌面端当成已验证交付。

**入口及核对层级：**
- `README.md` — readme_read
- `packages/local-web` — build_path_documented_in_readme

**来源：** [1](https://github.com/cdesktop-ai/cdesktop)

**许可：**Apache-2.0（[许可入口](https://github.com/cdesktop-ai/cdesktop)）。复制前仍需复核具体版本及文件。

**关联验收：**T11, T19, T24。

**限制：**上轮优先级收敛为 reference-only；不存在本轮实测的成熟度排名。

## R10 · CloudCLI / Claude Code UI

**已观察：**siteboon/claudecodeui README 展示会话、文件/终端与移动访问能力。

**建议借用：**作为会话继续和移动端输入的第二参照；确认真实流程后再提升优先级。

**不采用：**不导入整套认证/部署/多 provider 服务，不因 self-hosted 就认为数据与权限安全已解决。

**入口及核对层级：**
- `README.md` — readme_read

**来源：** [1](https://github.com/siteboon/claudecodeui)

**许可：**本轮未核验 / 仅产品参考。复制前仍需复核具体版本及文件。

**关联验收：**T02, T24, T28。

**限制：**未核验目标源码许可和细粒度实现；暂不可列为直接抄取源码的依赖。

## R11 · Streamdown

**已观察：**官方产品面向 streaming Markdown，处理生成中的 Markdown 呈现。

**建议借用：**与现有 remark 渲染在相同文本、分片、停止与恶意输入下对照；先只更换渲染器，不同时替换整个会话 UI。

**不采用：**不把格式补全当作事实补全；不改变原始内容、复制文本或 canonical artifact；不以营销性能描述作为测量。

**入口及核对层级：**
- `streamdown.ai` — official_documentation

**来源：** [1](https://streamdown.ai/)

**许可：**本轮未核验 / 仅产品参考。复制前仍需复核具体版本及文件。

**关联验收：**T05, T07, T26, T30, T31。

**限制：**本轮未运行样例或核验目标版本源码/许可；依赖选入前完成本地检查。

## R12 · use-stick-to-bottom

**已观察：**AI Elements 已读 conversation 源码使用此 hook；项目提供 React 滚动跟随能力。

**建议借用：**仅当采用自行拥有 viewport 的方案时作为滚动原语；测试用户向上阅读、选择文字、内容增高与回到底部。

**不采用：**不在 assistant-ui 已拥有滚动时再叠加另一个自动滚动器；不强制所有 resize 平滑滚到底部。

**入口及核对层级：**
- `README.md` — readme_read

**来源：** [1](https://github.com/stackblitz-labs/use-stick-to-bottom)；[2](https://raw.githubusercontent.com/vercel/ai-elements/main/packages/elements/src/conversation.tsx)

**许可：**本轮未核验 / 仅产品参考。复制前仍需复核具体版本及文件。

**关联验收：**T06。

**限制：**先确认 viewport 所有者；不同时安装重叠的行为层。

## R13 · Pierre Diffs / @pierre/diffs

**已观察：**官方介绍 React diff/code 组件、unified/split 视图、行选择和注释扩展。

**建议借用：**在确有文本差异审阅需求时，先测只读 diff 与带版本的选区注释，和现有查看器比较。

**不采用：**不为一个 diff 引入完整 IDE；本轮不采用编辑器 beta 功能；不能用行号单独作为长期证据锚点。

**入口及核对层级：**
- `diffs.com` — official_documentation

**来源：** [1](https://diffs.com/)

**许可：**本轮未核验 / 仅产品参考。复制前仍需复核具体版本及文件。

**关联验收：**T19, T20, T27, T30。

**限制：**未安装、未测 bundle 或大文件；目标版本与许可待本地复核。

## R14 · Pi：当前仓库与历史 web-ui 入口

**已观察：**badlogic/pi-mono 仓库检索重定向到 earendil-works/pi；旧 packages/web-ui/README.md 读取未成功。当前 README 声明 Pi 不内置文件/进程/网络权限限制。

**建议借用：**保留为下一轮 runtime 选型输入；GUI 需要明确权限执法来自宿主，不由按钮提供。只有确认可访问版本后，才恢复历史 web-ui 候选。

**不采用：**不把旧网页索引当作当前可用包；不由路径失败推断包已删除；不把 Pi 的权限边界放大为所有 harness 的结论。

**入口及核对层级：**
- `README.md` — current_readme_read
- `packages/web-ui/README.md` — old_path_fetch_failed_not_verified

**来源：** [1](https://github.com/earendil-works/pi)；[2](https://github.com/badlogic/pi-mono)

**许可：**本轮未核验 / 仅产品参考。复制前仍需复核具体版本及文件。

**关联验收：**T14, T18。

**限制：**本轮没有选择 harness core，也未验证历史版本 UI；失败路径仅作为索引漂移记录。

## R15 · Courtwork 公开 main：现状基线

**已观察：**已读 desktop manifest 及三个前端文件。manifest 声明 React/Vite/Tauri 与 assistant-ui 0.15.4。ChatAssistantMessage 在 running 阶段用文本 div，结束后用 Markdown；取消在 failed 分支以 canceled 区分。ChatMarkdown 保留链接开启边界、无损回退与输入预算。

**建议借用：**先定位现有 assistant-ui 使用范围；对流式/完成态转换、取消与重试、链接行为做复现；保留必要安全边界，不以“已安装”推断“已正确使用”。

**不采用：**不把公开 main 当本地两条施工线；不把源码疑点写为已复现缺陷；不以依赖存在或测试脚本数量当成熟度证据。

**入口及核对层级：**
- `apps/desktop/package.json` — manifest_read；blob=`95639ec8f91a24a7ce8fd68167c758d3175eb047`
- `apps/desktop/src/App.tsx` — source_read_lines_1_130；blob=`550e9fe314a15b977169a62a5ecc8cbd631e39a4`
- `apps/desktop/src/chat/ChatAssistantMessage.tsx` — source_read；blob=`5db439d7d73b1272030ac2200519b68fa7251a1c`
- `apps/desktop/src/chat/ChatMarkdown.tsx` — source_read_lines_1_160；blob=`36eaf0e1039353d47a067ff4bf7ab1fcd9b6c9fc`
- `apps/desktop/src/protocol/client.ts` — import_reference_seen_path_to_resolve_locally
- `apps/desktop/src/preview/HostRendererRegistry` — import_reference_seen_path_to_resolve_locally
- `apps/desktop/src/pi/PiLanePanel` — import_reference_seen_path_to_resolve_locally

**来源：** [1](https://github.com/lesPrivilege/Courtwork/blob/main/apps/desktop/package.json)；[2](https://github.com/lesPrivilege/Courtwork/blob/main/apps/desktop/src/App.tsx)；[3](https://github.com/lesPrivilege/Courtwork/blob/main/apps/desktop/src/chat/ChatAssistantMessage.tsx)；[4](https://github.com/lesPrivilege/Courtwork/blob/main/apps/desktop/src/chat/ChatMarkdown.tsx)

**许可：**本轮未核验 / 仅产品参考。复制前仍需复核具体版本及文件。

**关联验收：**T02, T05, T07, T08, T26, T30, T31。

**限制：**记录的是文件 blob hash，不是 commit pin。未全面扫描仓库、未运行测试、未查看本地未提交变更。

## R16 · react-resizable-panels

**已观察：**公开 React 面板组件项目。

**建议借用：**仅在现有布局需要可调整面板时替代手写拖拽，测试键盘调整、窄屏和尺寸恢复。

**不采用：**不将面板工具引入解释为已经选定三栏布局、浮动窗口或 workspace docking 系统。

**入口及核对层级：**
- `README.md` — readme_read

**来源：** [1](https://github.com/bvaughn/react-resizable-panels)

**许可：**本轮未核验 / 仅产品参考。复制前仍需复核具体版本及文件。

**关联验收：**T19, T27, T28。

**限制：**本轮不决定栏数或品牌视觉；API 与目标版本待本地确认。

## R17 · xterm.js

**已观察：**公开浏览器终端前端组件项目。

**建议借用：**仅当当前宿主确有 PTY/终端任务时研究终端呈现、尺寸同步和断线提示；普通 tool output 优先文本/日志组件。

**不采用：**终端渲染器不是 PTY、进程管理、安全沙箱或权限执法；不要为了界面像 coding agent 就常驻终端。

**入口及核对层级：**
- `README.md` — readme_read

**来源：** [1](https://github.com/xtermjs/xterm.js)

**许可：**本轮未核验 / 仅产品参考。复制前仍需复核具体版本及文件。

**关联验收：**T08, T24, T26, T28。

**限制：**本轮未选择终端后端，也未复制源码。

## 本轮之外

DeepSeek Harness、Pi/OpenCode 各 runtime 层如何组合，属于后续 core 选型。本轮不因任何组件 API 而倒置选择 core；也不将未知拼写的 frontIer 当作一个已核验的开源 GUI 仓库。

SE 依据来自已检索的《schema-engineering-workpaper-2026-08-29-canonical-final.md》typed commitment interface，以及《schema-engineering-practice-surface-2026-08-29-definitive-snapshot.md》。这里仅保留 UI 兼容性约束，不修改 Canon。
