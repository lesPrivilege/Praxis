# EXPLORE 与用户确认路径：静态裁决

结论：**在固定 Python 提交 `e4c1e074dee3f0f6cca28ca29e934c4ec0605354` 的内置 PermissionEngine + Agent 默认路径中，EXPLORE 并非不可解除的写入屏障。非只读调用若先命中显式 ASK 规则，确实会等待确认；有效确认 `confirmed=True` 后，该调用置为 `ToolCallState.ALLOWED`，跳过内置 engine 重检并进入工具执行路径。** 这是静态源码路径结论，没有运行目标项目或证明任何具体部署实际写入成功。工具可用性、输入校验、自定义 middleware、工具本身及外部执行器仍可拒绝/失败。

所有下列路径均相对 worktree `/Users/lesprivilege/.codex/worktrees/agentscope-enterprise-film/Praxis`。源码都已在本批 catalog 登记；没有新增未快照依赖。未修改仓库、未执行源材料命令、未 clone/安装/运行项目。

## 1. 内置 engine 的准确顺序

证据 `as-145a584b7630`：`vault/snapshots/agentscope-enterprise-20261012/as-145a584b7630-_engine.py.txt:214-295`。

1. `deny rule` 命中直接 DENY（250–252）。
2. `ask rule` 命中，生成 suggested rules，直接 ASK（256–263）。**没有先做 read-only 判定，也不限制 ASK 只能针对只读调用。**
3. 本次 invocation 的 read-only fast path 可以 ALLOW（268–270）。
4. 跳过 `tool.check_permissions`（273–277）；不能把工具内置 safety ASK 与上述显式 ask rule 混为一谈。
5. 跳过 allow rules（280–283）。
6. 未被以上决定的调用 fallback DENY（286–295）。

因此，“allow rule 不能解除 EXPLORE”对**规则层**成立；把它扩张为“用户对 ASK 的单次批准也绝不能放行”不成立。

## 2. ASK 到执行的完整链

主要证据 `as-df9d991bfc3d`：`vault/snapshots/agentscope-enterprise-20261012/as-df9d991bfc3d-_agent.py.txt`。

- `_execute_tool_call` 将 ASK 调用置 `ToolCallState.ASKING` 并发出 `RequireUserConfirmEvent(tool_calls=[tool_call])`（2566–2578）。
- `_reply_impl` 先 `_check_incoming_event` 再 `_handle_incoming_event`（1093–1107）。
- `_check_incoming_event` 从等待中的调用提取 ASKING 的 id（1867–1872），并验证收到的 `confirm_results[].tool_call.id` 都属于等待确认集合；无等待或有多余 id 报错（1890–1907）。
- `_handle_incoming_event` 以 `_.tool_call.id` 建映射（1954–1958）。当 `confirmation.confirmed` 为真，将调用置 `ToolCallState.ALLOWED`（1965–1973），将确认对象中的 `tool_call.name`、`tool_call.input` 写回调用（1975–1978），如附有 rules 再加入 engine（1980–1983）。**无需附带 allow rule 即可放行该次调用。**
- `_next_action` 将未完成的 ALLOWED 调用选入 `Acting`（3512–3534）。
- 执行前仍检查工具可用性和输入 schema（2480–2518）；随后 `_check_permission` 仍经过自定义 permission middleware（2340–2410）。
- 内置 `_check_permission_impl` 对 ALLOWED 直接返回 `PermissionBehavior.ALLOW`，仅其他状态才调用 `self._engine.check_permission`（2412–2429）。没有按 EXPLORE 再做 read-only 或 deny/ask/allow 判断。
- ALLOW 分支（2592 起）执行本地工具的 `_acting(tool_call)`（2622–2625）；external tool 则置 SUBMITTED 并发 `RequireExternalExecutionEvent`（2604–2620），不意味着 Agent 自己完成外部副作用。
- `_acting_impl` 直接调用 `self.toolkit.call_tool(tool_call, self.state)`（2773–2801）。`as-7a512c849f50` 的 `vault/snapshots/agentscope-enterprise-20261012/as-7a512c849f50-_toolkit.py.txt:249-318` 做可用性检查、参数准备，然后实际调用工具函数；这一层没有新增 EXPLORE 权限检查。

限定：这是**合法待确认调用**的批准恢复路径，不能描绘成“给任意 id 发 ALLOW 即可执行”。也不能将单次确认变成“未来所有调用永久放行”：EXPLORE 后续调用仍走原顺序；allow rules 被跳过，原 ask rule 命中仍 ASK。

## 3. API 和确认对象身份

证据 `as-4a805cb460f3`：`vault/snapshots/agentscope-enterprise-20261012/as-4a805cb460f3-_event.py.txt:442-492`。

- 待确认输出：`RequireUserConfirmEvent(reply_id=..., tool_calls=[ToolCallBlock, ...])`。
- 用户回传：`UserConfirmResultEvent(reply_id=..., confirm_results=[ConfirmResult, ...])`。
- 单条确认：`ConfirmResult(confirmed=True/False, tool_call=<ToolCallBlock>, rules=None/...)`。
- **用于匹配的是 `confirm_results[i].tool_call.id`；不是回传事件顶层 `tool_call_id`，也不是 `ConfirmResult.tool_call_id`。** `reply_id` 是另一项必需事件字段，不等同于调用 id。
- 正确术语是 `ToolCallState.ALLOWED`，不是 `ToolCall.ALLOWED`；API 没有要求确认对象用 `behavior=ALLOW`，而是布尔 `confirmed`。
- 确认承载嵌套工具对象，包括 name/input；Agent 会采纳 name/input 修改。产品上若提供修改能力，确认 UI 应呈现真实批准对象。这里只裁定源码行为，不推断任何服务层鉴权漏洞或上游身份验证能力。

## 4. 文档与源码的关系

公开总览 `as-7dad78a203b5`：`vault/snapshots/agentscope-enterprise-20261012/as-7dad78a203b5-main-permission.md.txt:54-74` 的 decision matrix **与源码顺序一致**：EXPLORE 的 ask row 为 ASK、allow row skipped、fallback DENY，并写明 first decisive answer wins。其 ASK 流程图（24–50）也画出用户批准后执行。

总览只读示例（82–93）没有配置 ask rule；该示例语境内“修改自动拒绝”符合无 ask rule 的默认路径。不能直接据此断言整份文档错误；问题在于把示例注释外推成全配置、全确认路径保证。

**源码自己的 docstring 存在确凿张力**：`as-145a584b7630:221` 声称 “modifications are categorically denied”，`:234-235` 声称 read-only guarantee 不能被规则让渡，`:245` 声称 “ALLOW for read-only invocations, DENY otherwise”；但相邻实现确实先返回 ASK。后两句如果只解释 allow rule 的无效性可以收窄成立；绝对“不允许任何修改”的读法则与完整 Agent 确认路径不一致。

结论分类：**文档 matrix 与代码一致；“绝对只读”的概括/源码注释过强；旧交接必须修正。** 不能声称官方已经认定 bug 或已修复：本次没有该证据。

## 5. 可直接用于中文产品讲解的句子

推荐完整句：

> “当前固定源码里，EXPLORE 会默认拒绝非只读调用，并忽略 allow 规则；但显式 ask 规则先于只读判定和拒绝兜底。调用进入 ASK 后，用户对该次调用确认通过，Agent 的内置路径可继续执行，因此不能把 EXPLORE 单独当成不可解除的写入隔离。”

简短字幕：

> “EXPLORE：非只读默认拒绝；显式 ASK 后仍可逐次确认执行。allow 规则无效，不等于单次确认无效。”

确认讲解：

> “确认返回包含原调用的嵌套 ToolCallBlock，按 tool_call.id 对应待确认调用；confirmed=True 放行这一次，追加 rules 是独立可选项。”

不可说：

- “EXPLORE 绝对只读，任何写操作都直接 DENY。”
- “用户点击允许也不能执行 EXPLORE 写操作。”
- “给 EXPLORE 加 allow rule，就能永久批准写工具。”
- “确认回传只需要顶层 tool_call_id 和 ALLOW。”
- “该发现已在真实 AgentScope 服务/模型/沙箱运行复现。”
- “绕过内置 engine 等于绕过所有 middleware、外部执行器权限及 OS/沙箱边界。”

边界：仅本提交、内置 Agent 路径静态分析；未验证其他版本、SDK 封装、Service HTTP 适配、具体 UI 或部署策略。没有对 ownedlab DEFAULT 示例作修改，也没有要求保留 v1 视频的主任务扩大范围。
