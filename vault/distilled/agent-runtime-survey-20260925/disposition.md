# Astra 裁决与候选工单

2026-09-25 · 本次基于 Luna 三路功能机制研究，由 Astra 编订。研究深度止于官方说明、版本差异和关键实现接缝；没有安装或实跑外部项目。与现有责任的映射见 [消费边界](consumption-boundary.md)。本页登记的是参考及有限验证工单，不是产品施工许可，也不自动改写 Courtwork 的正式 backlog。

## 裁决

| 材料与机制 | 裁决 | 消费理由与边界 |
|---|---|---|
| DSH 的 request preparation / adapter generation、候选配置验证后原子替换 | 采作接口设计参考，纳入 ARS-01 | 有助于把配置变化与一次实际请求的身份分开；不照搬 profile-wide HMR 去改变已入场 Run 的权限或在途请求 |
| DSH durable scheduled task、delivery history、flush 后记录结果 | 条件登记 ARS-04，等实际提醒/定时工作消费者 | 值得借鉴计划与投递尝试分离；不是 exactly-once，不是外部通知成功证明。process-local jobs 与可恢复 schedule 必须分清 |
| DSH child capability 拒绝、exact-parent 邻接、持久 child 描述符、single-writer/flush | 参考既有 Host/Runtime owner；不新建第二份队列或日志 | 当前 CW 已有 admitted child、Run 绑定与恢复边界，应把这些机制用于验收反例，而非重写已接受实现 |
| DSH Auto review 的 deny/failure/manual decision 区分 | 仅参考交互状态，权限机制不照搬 | 模型审查不是人的权限授予，也不是确定性隔离。人工继续仍须通过既有 grant/admission/effect owner；默认 Full access 或同进程插件不能移植为安全控制 |
| `proboscis/orch` 的 Issue/Run/Event、每次尝试独立 worktree、daemon/attach | 本地 CLI 管理的首选机制参照，纳入 ARS-03 | 与工作尝试身份、后台运行、状态恢复最相关；PTY/tmux liveness 和文本推断不能替代结构化运行结算；其 evaluation-only 许可边界与仍为 proposed 的 reap/revive ADR 也不支持直接搬代码或声称恢复已验证 |
| Agent Workbench 的 native-session binding、attach/resume 与工作树 UI | 交互与适配接缝参考，纳入 ARS-03 | 学习每个 CLI 独立的 resume 适配与用户可理解的工作界面；不统一吞掉各 CLI 的真实权限、会话与终止语义 |
| AI Orchestra 的共享 Markdown、tmux、context refresh | 保留同名候选，不作为当前实现模板 | 用户未指定仓库，不能宣称它就是原指项目。自动 kill/spawn、缺 ID 开新会话、共享可写目录和 bypass 默认值不满足现有身份/权限/未知结果契约 |
| CLIProxyAPI 的 provider-specific translation、bootstrap/已开始流区别 | 参考边界，纳入 ARS-01/02 | 上游称 executor 的对象是网关 provider 实现，不能等同 CW Runtime executor；账号池及模型特例不进入通用 Kit |
| LiteLLM 的 alias→deployment、opaque state affinity | 参考身份与兼容约束，纳入 ARS-01/02 | requested alias 与实际 provider/deployment 分开；有 encrypted reasoning/session 状态时不能随意切路由。Rust/Python 功能边界不能按产品名称推断已等价 |
| Bifrost 的 provider queue、retry/fallback 分层、预算与 key/model allowlist | 参考测试矩阵；完整治理平台延后 | 不复制其数据库、管理 UI、MCP 执行循环或全套插件。多层 retry 不能各自耗尽预算后再无限叠加 |

“采作参考”是本批研究处置，不表示新规范已经晋升 Kit，更不表示替换当前 Pi loop、安装网关或授权产品迁移。

## 登记四个有限候选

### ARS-01 · 配置变化后的真实请求身份与尝试记录

- 状态：候选验证工单，优先消费。归属现有 Provider configuration / request telemetry（PV-13 / PV-21）；executor 的 immutable Run binding 继续沿现有 Runtime owner。
- 用户结果：用户能说明这次回答实际用了哪个 provider/model，而非只看到别名或最新配置。
- 参考：[DSH](deepseek.md) 的 preparation/generation；[网关](gateways.md) 的 alias/deployment、attempt trail。
- 最小工作：先盘点当前已保存的 requested/resolved provider/model、配置版本、attempt 和非 secret auth reference；只补缺口，不另造 route registry。明确请求开始前后配置改变的生效时点。
- 退出证据：配置在一次请求中途变化，当前请求仍指向原解析结果；下次请求按允许边界使用新配置；历史不改写；各尝试的失败原因/usage 能区分；日志不含 secret。先用确定性 fake provider，不引入真实账号池。

### ARS-02 · 流式、取消和不透明续接状态下的重试契约

- 状态：候选验证工单，与 ARS-01 同 owner；待确有网关消费路径再实施。并入现有连接准入测试，不启动自动路由平台。
- 用户结果：网络故障不会让工具重复执行，也不会在续接时悄悄换成无法读取历史状态的模型端点。
- 参考：CLIProxyAPI bootstrap commit 点、LiteLLM encrypted-content affinity、Bifrost 分层 retry/cancellation。
- 最小工作：为同一已准入 connection 定义 retryable error/attempt budget；记录“尚未向下游提交、已发流片段、工具副作用已发生或未知”三类边界。首字节前也可能已产生上游成本或副作用，不能仅凭没有收到内容认定安全重放。
- 退出证据：429/网络错误只在允许范围内重试；流开始后不拼接第二 provider 的结果；tool-effect 已发生/未知时不盲重放；取消后不再派发；opaque state 不匹配时明确拒绝；总预算跨 retry 层共享上限。不能以同一 model alias 冒充相同 deployment 或 Runtime。

### ARS-03 · 一个本地 CLI 的 attach/resume/stop 最小适配证据

- 状态：候选验证工单，等已支持本地 Runtime 出现未覆盖消费者。沿既有 Runtime Adapter/Local Pi owner；禁止另开通用 Orchestra Core。
- 用户结果：用户离开界面再回来，能继续同一个尝试，知道它还在跑、已结束还是结果未知。
- 参考：[Orchestra 候选](orchestra.md)，优先 `proboscis/orch` 的 attempt/worktree 组织与 Agent Workbench 的 native session 交互。
- 最小工作：只选一个现有 CLI，固定 executable/version、cwd、native session ID、结构化协议及已准入 grants。复用 CW 已有 attempt/native binding；终端只作交互显示，不从彩色输出制造正式状态。
- 退出证据：detach 不取消；重连精确 native ID；缺 ID/失回执不默默 fresh spawn；只终止自己拥有的 process group；取消须等待终止/效果证据；崩溃后无法确认时保持 unknown；worktree 不宣称 sandbox。已经由 LP/R1 验收覆盖的项只引用原证据，不重做或重开。

### ARS-04 · 绑定原会话的持久提醒投递

- 状态：登记并延后，直到有明确需要的提醒/定时工作场景。归属既有 Host/scheduler 或 Attention 任务 owner，绝不因为参考项目新增 timer 而建立新平台。
- 用户结果：应用重启后提醒不丢，且归档会话不会继续收到未授权的新工作。
- 参考：DSH schedule storage、delivery history、flush barrier、serialized archive stop。
- 最小工作：先定义计划、到期尝试、入场与结果回执四者关系；关闭窗口与停止服务分别处理；说明错过时间、并发到期、取消与未知投递如何恢复。
- 退出证据：重启/归档/派发之间注入故障，验证不丢身份、不重复入场、不静默补做外部动作；权限和来源版本在实际入场时重验；通知送达与模型任务成功不混为一谈。不声明 exactly-once，除非具体接收端支持并通过幂等证据验证。

## 不开新单的部分

快捷键、onboarding、Office/浏览器/SSH、主题和 Inspector 安装变化先留在版本卡；当前没有用户路径缺口要求它们进入本次产品施工。通用 capability catalog、预算 UI、熔断平台、账号池也不独立扩项：只有 ARS-01/02 的实际失败用例要求时，回原 owner 补最小字段或策略。

所有工单均需产品 owner 消费后才成为该项目的正式施工任务；本轮没有创建远端 issue，没有派实施代理，没有更新用户的 CLI/provider 配置。
