# 53 场内容补丁交接

产物：[content-v2.json](../script/content-v2.json)。只修改该 JSON 与本记录，不修改 beats、影片构件、阅读稿或其他代理文件。

## 使用方式

`scenes` 按原 beats 的 53 个 ID 与顺序排列。字段缺省沿用原稿；`items` 是一整组文字替换，不附旧 labelAt/detailAt。新增文字须由最终编排按实际阅读量安排时间，不能机械保留旧时间。`essay_additions` 是内容增量，在成文时自然融入原段落；它不是要求逐段附在末尾。

35 场有局部变更，18 场保留原稿中已经具体的机制。新增 9 组屏幕 items，集中在 message、react、tools、hitl、compression、structured、Java Turn、Java controls 与 recovery。agent/events/permission/offload/sessions/background/workspace/Java targets/replay/artifact/end 只补标题旁文、条件与判断，展项仍由主代理接入。

## 必须保持的区别

- Python DEFAULT 的第一个决定性结果生效：deny → ask → 本次输入只读 → 工具自检 → allow → 兜底 ASK。工具 safety ASK 不被后面的 allow 覆盖。
- EXPLORE 忽略 allow 不等于单次批准无效。合法待确认调用 `confirmed=True` 可进入本次执行；后续调用继续按原模式判定。确认按嵌套 `tool_call.id` 匹配，不存在顶层 `ConfirmResult.tool_call_id` 字段。
- ToolResponse：按内容 block ID 聚合，文字追加；Base64 各自解码后合并；URL 来源不能追加。error 不被后到 success 覆盖。**不要把其他失败类型画成已经证明的严格严重性阶梯**：当前源码对 denied/interrupted 的覆盖逻辑并非完整单调层级。
- Msg 事件是另一种应用逻辑：文字 delta 追加、end 可用累积文字替换；URL delta 替换媒体来源。它不能与 ToolResponse 的 URL 追加报错混为同一路径。
- ContextConfig 固定 2.0.10dev 源码默认 `trigger_ratio=0.8`、`reserve_ratio=0.1`、`tool_result_limit=50000` tokens；3000 是文档示例。摘要生成失败默认截断，关闭兜底才报错；未配 offloader 的被移出内容会丢弃。
- Python ChatService 的 600 秒是传入 run lock 的 lease 参数；Redis续租、内存不因该参数过期。1000 是 replay 裁剪参数，Redis近似、内存精确，checkpoint 还可提前 trim；都不是统一任务时限或历史保留保证。
- ToolOffloadMiddleware 的原文件现已登记为 `as-0791af56faa2`。旧 defaults-check 中“尚未登记”已过时。10 秒是当前普通工具等待默认，live-state 与 external 工具保持同步；watcher 为进程内执行，registry 不是重启后的任务进度。
- LocalWorkspaceManager 默认 PER_AGENT，实际 host path 为 `basedir/agent_id`；3600 秒是空闲缓存回收。MCP live state 按 agent+session、skills 按 agent。目录粒度不能推出跨用户租户隔离。
- Java Session/Turn：同key同body取回原Turn；202 queued为接收，input.applied为运行时使用；Managed保留上下文，Team/Workflow每Turn独立启动。
- Java 16 MiB 是当前公开 Managed Session upload contract；其他目标先查 file_input。显式 Artifact 发布引用真实 file_id，不生成或读取工作目录文件；外部HTTPS是另一发布路径。
- Java checkpoint 恢复状态，不恢复线程、在途网络请求、工具内部进度；Hosted 统一路径 `checkpoint_restore:false`。不确定外部副作用先核对，旧 writer lease先释放或过期。

## 成文接合

原稿中以下位置宜在合并时处理，不能把增量重复附在末尾：

- `scheduling`：原文末尾已有两句补充依赖，由本补丁 lead/pm 接合前文即可。
- `sandbox`：原 essay 的“PM 可以把它们转成……”改为对象作主语；本补丁给出具体运行条件段落。
- `java-webhook`：原末尾孤立签名句与新增的接收顺序段落合并，保留原始请求体、时间、去重和持久化条件。
- `task`：合同助手是贯穿的构造业务案例，不宣称 AgentScope 已内置制度库、真实审批和发布集成；案例身份保留在过程记录，不在画面堆砌制作旁白。

## 检查与边界

窄检查通过：53 scene ID 与原稿逐项同序；ID无重复；每条有source_ids/reason/checked_scope；65个引用ID实际存在catalog且snapshot文件存在；新增title≤26字符、items.detail≤40字符。检查按JSON实际内容执行，未调用仓库验证器（主代理负责最终全仓检查）。

新关键数字、权限与确认分支回查固定源码；其他未变场复用现有53场文案、depth-review与已登记证据，没有重复全量调研。读取原件包括 AgentState、ContextConfig、PermissionEngine、Msg.append_event、ToolResponse、ToolOffload、LocalWorkspaceManager，以及Java Session/SSE/files/Harness恢复公开页。API和source ID不是语义自动验证；最终跨场叙事与画面仍需主代理核验。

本轮没有 clone、安装依赖、运行模型/Provider、Redis、目标服务、真实文件上传或沙箱。Java Harness默认存储页面张力未裁定，补丁不创建统一默认。其他版本、全量storage/workspace适配器、真实多副本接管和业务SLA未核。公开Access/External的preview身份保留在版本scope，产品解释不追加泛泛保护措辞。
