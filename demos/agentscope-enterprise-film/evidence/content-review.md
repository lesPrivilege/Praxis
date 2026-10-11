# 分镜文字与机制独立审阅

审阅时间：2026-10-12。对象：`/tmp/praxis-agentscope-film/script/story.py`、`java-scenes.json`、`java-more.json`；为核对实际箭头，另读 `compile.py` 和 `stage-template.js`。依据沿用现有 docs/mechanics source 包，未另做全量研究。未修改稿件及仓库；未运行画面或测试。

结论：结构覆盖已足够，Python → Java 的章节关系成立；进入渲染前先修下面 P1/P2。未发现“未测试、无配音、非承诺”等泛泛保护/制作旁白。片中身份、权限、后台工作、恢复条件、文件交付等具体条件均应保留。`lanes` essay里的“本片局部机制对应...”属于版本制作说明，应移入过程版本记录；阅读稿正文可改为客观版本说明，屏幕保留Python 2.0抽象主线。

## P1：修正语义与所属接口

### 1. java-02-agent-session：当前flow把互斥入口画成顺序步骤，并混SDK/Service

现稿：call/streamEvents → AgentSession → Checkpoint → cancel/resume。实际 Harness 文档明确同一conversation应选直接调用或AgentSession scheduling。对已有任务再调用streamEvents会启动另一次执行。当前最后卡还用Service的capabilities/Turn控制描述SDK入口。

最小修订：kind改`compare`；scope改`AgentScope Java Harness v2`。四卡：

- `直接调用`：`call / streamEvents 由应用管理执行。`
- `后台会话`：`AgentSession 接收任务并管理排队。`
- `运行实例`：`会话管理器持有 Agent，关闭时中断工作。`
- `任务继续`：`respond 回答等待，resume 继续未完成任务。`

essay第二段用：`AgentSession 的观察连接断开后，后台工作继续；运行实例仍须由会话管理器持有。respond 回答待处理交互，resume 继续最新的未完成任务；已完成或已取消的任务不能通过该 SDK 操作续跑。Checkpoint 恢复 Agent 工作状态，外部操作结果仍需核对。`

依据：java-harness-session.md “Start a background conversation”与约L139；java-harness-architecture.md “Choose an invocation style”。Service `/capabilities` 只在java-06展开。

### 2. java-01-harness-context：scope错误；缺sessionId必然跨用户串状态过强

scope改`AgentScope Java Harness v2`。Builder卡detail改`直接请求按次构建；后台会话保留实例。`，避免下一场后台执行与本场“请求结束即销毁”冲突。

essay中的`缺少sessionId会落到defaultSessionId，多个用户的状态可能串在一起`改成：`会话以 userId、agentId、sessionId 和存储命名空间共同定位。缺失或复用身份键，可能使本应独立的工作共用状态。跨请求恢复需要保持这些身份与后端一致。`

依据：java-harness-session.md约L256–260 SessionKey；architecture实例生命周期。不要采用production旧状态章节的简化键表达覆盖新Session Log身份模型。

### 3. java-09-recovery-capabilities：再次把旧production存储路径泛化到新Harness

当前essay要求`把AgentState...放到分布式后端`，继而用`JsonFile状态`统称当前默认恢复路线，跨越已知EVENT_LOG/LEGACY文档差异。无需声明默认值。

卡2 label改`共享持久层`，detail改`会话日志、工作文件、沙箱快照各有后端。`。

essay改：`跨副本继续任务，需要相同身份能够读取会话日志与恢复点，并访问对应工作文件。沙箱快照与执行锁承担另外的恢复和并发职责；所选后端需要提供这些能力。IsolationScope 改变后，既有数据不会自动迁移。`

补refs `java-harness-session.md`。如提DistributedStore，必须局部限定所配置组件；OSS不提供SandboxExecutionGuard，因此“DistributedStore统一提供跨副本锁”也不应泛称。

### 4. java-06-interaction-capabilities：respond标签造成SDK方法与HTTP接口混淆

Java Harness确有`session.respond`；Service文档动作答复是向Turn `/actions`发送request_id及payload，并返回command receipt。改第三卡label为`actions`或`动作答复`，essay用`动作答复回答 required action`。无需造出Service `/respond`接口。

另把essay `先读取Session或Turn的capabilities`限定为`先读取 Turn 的 /capabilities 和 available_commands`，与本稿所引来源一致。保留Hosted恢复条件。

### 5. events：文字、工具、确认不是必然顺序

当前flow画成文字增量→工具事件→确认请求→完整消息，会让观众理解每轮一定用工具且一定人工确认。kind最小改`rows`，lead改`不同事件按身份更新同一回复`。四项内容可保留。需要动画时让前三类事件汇入同一消息对象，不互相串联。

### 6. scheduling：框架调度不自动推断业务依赖

标题可保留；lead `调度按冲突与依赖组织一批调用`改为`并发安全属性控制一批调用的执行顺序`。第二卡改：`依赖步骤` / `先取得前一步结果，再发起后一步。`

essay末句前明确：`生成文件再发布文件，应由编排或后续推理轮表达先后关系。` 不能让画面暗示is_concurrency_safe能推断工具参数间的数据依赖。

依据：固定Python源码 agent/_agent.py `_schedule_tool_calls`约L2096，按属性形成执行批次，未见依赖图推理。

## P2：局部精度与箭头

### 7. compression：历史压缩与工具结果截短是不同措施

kind从flow改rows或compare，避免看起来每次历史压缩都先后执行结果截短。现有title/lead已正确区分，改图形即可。

### 8. react / pipeline：给真正出口与条件回路

react的“调用模型”detail改`发送上下文；无工具请求时形成答复。`，使持续循环有可见出口。pipeline末卡`反馈修正`detail改`verifier 未通过且预算允许时继续。`。当前flow没有回边，可保留作为一轮展开，但不应出现无条件无限回箭头。`pass / fail / impossible`建议上屏以保留不可达出口。

### 9. java-04：补Workflow版本及上下文差别

Session卡改`创建时固定目标配置或已发布流程版本。`。Turn卡改`一次提交对应一个工作任务。`，删“独立执行”以免暗示Managed不保留上下文。essay补一句：`Managed 在同一 Session 内保留对话上下文；Team 与 Workflow 的每个 Turn 启动独立协作或流程。`

### 10. java-07：自动共享与绝不共享不同

Team/Workflow卡detail `成员用Artifact交换，不共享文件系统`改为`成员通过 Artifact 交付，文件系统不自动共享。`，与essay和来源一致。Artifact卡可写`登记实际结果文件，供应用按记录读取。`，避免把平台发布操作说成内建内容核验。

### 11. java-budget：限定Managed，不对所有目标泛化

compile.py已补“已启动并行调用不会被额度强行截断”，正确且应保留。lead改`Managed 的用量预算约束后续运行`；items第2卡可在label标`Managed 预算`。essay可直接采用现有充分证据：`Managed Session 的 /budget 限制模型调用次数和已报告的累计用量。Token 与费用预算无法强制截断已经启动的并行调用；费用上限还需要模型定价。应用级并发与Token预算另行管理。`

来源java-service-session.md L276–290已足够支持这一具体层级，无需模糊为“按能力决定是否停止”。不要断言调整预算本身自动恢复任务。

### 12. java-webhook：再次投递是可能分支

如果维持flow，第二label从`再次投递`改`接收投递`，detail改`同一事件可能重复到达。`。现文让“每个事件至少经历一次重复”成为流程必经步。正文仍可讲retry。真实验签可加一句到阅读稿：`先验证原始请求体签名与时间，再持久化并按事件 ID 去重。`，来源java-service-sse.md已经覆盖。

### 13. java-channels：标题包含定时，但图只有消息路由

最小把title改`消息渠道连接外部对话与任务`；定时和Automation独立性保留essay，或加独立并列卡说明，不在现有消息直线图里冒充两种入口共有链。

### 14. migration与permission编译变换已正确

compile.py将migration改merge、permission改branch，避免了源稿kind误读。无需重复改图。注意一切审阅应针对编译后kind，不能只凭story.py。

## 书面标题与平行标签的最小替换

现有Python标题大体可接受。Java初稿有口语隐喻，建议统一成对象+关系：

| 场 | 建议title | 建议lead |
| --- | --- | --- |
| java-01 | 调用身份决定状态归属 | RuntimeContext 连接会话、工作区与恢复记录 |
| java-02 | 直接调用与后台会话分别管理执行 | 调用入口与运行实例的生命周期对应 |
| java-03 | 三种执行目标划分运行责任 | Managed、External 与 Hosted 分别接入运行环境 |
| java-04 | Session 固定目标，Turn 承载任务 | 配置版本与幂等键保持任务身份 |
| java-05 | 快照与事件流恢复页面状态 | 先恢复已有记录，再订阅后续变化 |
| java-06 | 目标能力决定交互方式 | 指导、补充、答复与继续分别控制 |
| java-08 | 账户、应用与运行凭证分层授权 | Namespace 权限与实例连接凭证分别管理 |
| java-09 | 持久数据与执行状态限定恢复范围 | 目标能力、恢复材料与外部结果共同核对 |
| java-issue | Issue 连接执行记录与业务验收 | 目标、讨论、执行与验收分别记录 |

对应pm口语最小替换：`先拿授权，再让External Agent入册`→`注册入口由可信网关或受控网络保护。`；`交付走Artifact，别从回复猜路径`→`文件交付使用 Artifact 返回的真实引用。`；`先选运行所有权，再选API`→`运行责任决定接入契约。`

## 屏幕边界与后续验收

当前实际sourceLine将所有Java场统一写`Harness v2 / Service 2.1.0-BETA1`，且stage未读取scope。因此修json scope不能单独解决最终画面：compile需按java-01/02标Harness，Service场标Service；java-09跨层可以保留二者。Python屏幕写2.0抽象主线成立，固定2.0.10dev/source hash写过程版本记录，不把主线变成稳定2.0.9实测。

标题/lead/items/pm/sourceLine均为屏幕文字；essay进入阅读稿。两类都要维护产品事实，制作说明归过程记录。本轮只审文字与图形语义，未核对字号、遮挡、停留时长、实际屏幕截图或视频时序。
