# 主张与来源映射

| 场 | 认知任务 | 对象与变换 | 证据 |
|---|---|---|---|
| whole | AgentScope：把 Agent 接成工作系统 | stack；依次揭示 Agent → Service → Workspace | as-13b26f7a4513、as-dc202a66c974 |
| docs | 文档目录对应四类实现问题 | rows；依次揭示 构建块 → 编排 → 部署 → 企业接入 | as-e800b6665911、as-822919440da3 |
| lanes | Python 与 Java 各有完整运行路径 | compare；依次揭示 Python · Agent → Java · Harness → Python · Agent Service → Java · Service | as-dc202a66c974、as-0a3782c37016、as-9d9136196aa8 |
| migration | Runtime、Studio 的职责归入 2.0 | merge；依次揭示 原 Runtime → 原 Studio → AgentScope 2.0 | as-38708b217d1d、as-ed35bc95bfb2、as-13b26f7a4513 |
| task | 合同助手的一次工作 | flow；依次揭示 接收任务 → 获取依据 → 生成候选 → 交回业务 | as-dc202a66c974、as-69ccfb190c6d |
| agent | Agent 是推理与行动的循环引擎 | stack；依次揭示 配置 → 运行状态 → 调用入口 | as-f2b9fa0f0bea、as-188d64eb8aa5 |
| message | Msg 把一次回复收成完整记录 | rows；依次揭示 身份 → 内容块 → 结束状态 → 附加结果 | as-24299c5c3ff5 |
| events | Event 把运行进展送到界面 | rows；依次揭示 文字增量 → 工具事件 → 确认请求 → 完整消息 | as-24299c5c3ff5 |
| react | 推理与工具结果组成反馈回路 | loop；依次揭示 检查状态 → 调用模型 → 执行工具 → 接收结果 | as-f2b9fa0f0bea |
| model | Model 与 Formatter 分担协议转换 | flow；依次揭示 内部消息 → Formatter → Model → 统一输出 | as-d47e94c7be0b、as-07cb85f8aa73 |
| tools | 工具把模型请求接到真实函数 | flow；依次揭示 登记函数 → 形成 Schema → 执行调用 → 返回结果 | as-47c09ed8a575、as-13c3e91cfe2f |
| scheduling | 工具属性决定并行与串行 | compare；依次揭示 独立读取 → 依赖步骤 → 工具属性 → 结果汇合 | as-2fea42114514、as-13c3e91cfe2f |
| permission | 权限判定发生在工具执行前 | branch；依次揭示 ALLOW → DENY → ASK | as-7dad78a203b5、as-7bfd7ee86f21 |
| hitl | 人工确认把暂停接回执行 | flow；依次揭示 形成调用 → 停在确认点 → 接收答复 → 继续循环 | as-7bfd7ee86f21 |
| integration | Python、MCP 与 Skill 有不同入口 | stack；依次揭示 Python 工具 → MCP 工具 → Skill | as-13c3e91cfe2f、as-2fea42114514 |
| context | 模型输入由三层组装 | stack；依次揭示 系统提示 → 压缩摘要 → 近期上下文 | as-524cfb38d8f2 |
| compression | 压缩给长任务腾出上下文空间 | rows；依次揭示 检查用量 → 处理历史 → 截短结果 → 重新组装 | as-761fb054c0df |
| offload | 卸载保留被压缩内容的回查路径 | flow；依次揭示 原始内容 → 外部保存 → 保留引用 → 按需读回 | as-c3e41125204e |
| memory | 长期记忆跨越当前对话 | compare；依次揭示 本轮上下文 → 长期记忆 → 记忆写入 → 记忆检索 | as-1223f953ff05 |
| rag | RAG 把知识材料接到推理输入 | flow；依次揭示 导入材料 → 建立索引 → 查询片段 → 形成回答 | as-8379a990984a、as-29e364404cfc |
| structured | 结构化输出让结果进入后续流程 | flow；依次揭示 定义字段 → 要求结构 → 校验结果 → 业务核对 | as-188d64eb8aa5 |
| interrupt | 中断与继续各有明确状态 | rows；依次揭示 运行中断 → 暂停中断 → 保留记录 → 恢复核对 | as-1787397c3223、as-79adbb1a7334 |
| middleware | 中间件在生命周期接入规则 | rows；依次揭示 系统提示 → 模型阶段 → 工具阶段 → 运行阶段 | as-cc1c5a96c71f |
| pipeline | GoalPipeline 用执行与核验推进目标 | flow；依次揭示 执行目标 → 结构报告 → 核验判定 → 反馈修正 | as-986459b99a69 |
| team | 团队把工作拆给不同 Agent | flow；依次揭示 分配任务 → 独立执行 → 传回结果 → 统一汇总 | as-0c1773327b10、as-dc202a66c974 |
| plan | 计划与 SOP 组织复杂工作的约束 | compare；依次揭示 计划 → SOP → 任务变化 → 核验推进 | as-ae1de456793f、as-6c4048dcd902 |
| service | Agent Service 托管循环之外的资源 | stack；依次揭示 请求层 → 托管层 → 持久层 | as-dc202a66c974 |
| identity | 用户身份必须来自可信入口 | flow；依次揭示 认证入口 → 用户身份 → 资源归属 → 执行请求 | as-dc202a66c974、as-bd153c6e3a04 |
| sessions | 存储与总线分担会话运行 | rows；依次揭示 Storage → Message Bus → 事件回放 → 执行所有权 | as-dc202a66c974 |
| background | 长工具转入后台继续执行 | flow；依次揭示 提出长任务 → 交给后台 → 结果到达 → 继续推理 | as-dc202a66c974 |
| workspace | Workspace 组织文件与执行环境 | compare；依次揭示 per_agent → per_session → per_user → 生命周期 | as-e8bf00e52cb9、as-dc202a66c974 |
| sandbox | 沙箱限制工具在哪个环境运行 | flow；依次揭示 工具请求 → 工作区接口 → 沙箱后端 → 执行结果 | as-e8bf00e52cb9、as-13b26f7a4513 |
| deployment | 部署一致性影响具体运行结果 | rows；依次揭示 共享后端 → 调度所有权 → 下载密钥 → 解析负载 | as-dc202a66c974、as-8379a990984a、as-c788c6cd8525 |
| observability | 轨迹连接模型、工具与会话 | compare；依次揭示 界面事件 → 调用轨迹 → 消息记录 → 运行诊断 | as-13b26f7a4513、as-dc202a66c974 |
| java-01-harness-context | 身份键关联每次调用 | stack；依次揭示 RuntimeContext → HarnessAgent.Builder → AgentState | as-0cf03f3aa25d、as-66d70ed869dd |
| java-02-agent-session | 即时调用与后台会话分别选择 | compare；依次揭示 直接调用 → 后台会话 → 运行实例 → 任务继续 | as-0cf03f3aa25d、as-e60a2f6c58b3 |
| java-03-execution-targets | 执行目标确定运行所有权 | compare；依次揭示 Managed → External → Hosted → 共同观察面 | as-9d9136196aa8、as-d5dd49d8dc6e、as-556d0c6a5726 |
| java-04-session-turn-idempotency | Session 固定目标，Turn 承载任务 | rows；依次揭示 Session → Turn → Idempotency-Key → queue / approval | as-9d9136196aa8、as-79adbb1a7334 |
| java-05-snapshot-sse-cursor | 快照与事件恢复同一视图 | replay；依次揭示 Snapshot → as_of → Cursor → 游标过期：410 | as-528e3df546ca、as-eb83f48e5259 |
| java-06-interaction-capabilities | 控制入口按目标能力提供 | rows；依次揭示 steer → inject → actions → resume | as-79adbb1a7334、as-528e3df546ca、as-556d0c6a5726 |
| java-07-files-artifacts | 文件发布为可取得的 Artifact | stack；依次揭示 Session file → Artifact → Team / Workflow | as-69ccfb190c6d、as-675c5fc9c363 |
| java-08-auth-grant-registration | 身份、资源与运行通道分别授权 | compare；依次揭示 Account / Namespace → Application key → External registration → Runtime credential | as-c4d45549fd7a、as-d5dd49d8dc6e、as-13473668ae95 |
| java-09-recovery-capabilities | 恢复同时核对状态与副作用 | stack；依次揭示 Capabilities → 共享持久层 → External effects | as-e60a2f6c58b3、as-556d0c6a5726、as-79adbb1a7334 |
| java-orchestration | 协作有三种不同层次 | stack；依次揭示 Subagent → Team → Workflow | as-675c5fc9c363 |
| java-issue | Issue 把执行接到工作接受 | flow；依次揭示 定义 Issue → 分配执行 → 跟踪过程 → 人工接收 | as-675c5fc9c363、as-eb83f48e5259 |
| java-auth-scope | 调用资源与读取工作分别授权 | rows；依次揭示 账户身份 → Namespace → 资源动作 → 工作共享 | as-c4d45549fd7a |
| java-budget | 预算控制工作能继续到哪一步 | rows；依次揭示 用量归属 → Managed 预算 → 达到上限 → 继续工作 | as-79adbb1a7334 |
| java-channels | 消息渠道连接外部对话与任务 | flow；依次揭示 消息渠道 → 目标路由 → 执行观察 → 渠道回传 | as-675c5fc9c363 |
| java-webhook | Webhook 重复投递按事件身份合并 | flow；依次揭示 发出事件 → 接收投递 → 身份去重 → 业务处理 | as-528e3df546ca、as-eb83f48e5259 |
| java-storage | 恢复需要成套的数据与密钥 | stack；依次揭示 数据库 → 文件快照 → Vault 密钥 | as-eb83f48e5259 |
| failure | 失败处理沿原任务身份闭环 | rows；依次揭示 缺少依据 → 权限拒绝 → 结果未知 → 输入改变 | as-f2b9fa0f0bea、as-79adbb1a7334 |
| delivery | 合同助手需要可检查的契约 | rows；依次揭示 输入契约 → 动作契约 → 状态契约 → 交付契约 | as-dc202a66c974、as-69ccfb190c6d |
| end | 从 Agent 循环走到企业工作闭环 | stack；依次揭示 构建能力 → 托管执行 → 接入业务 | as-13b26f7a4513、as-9d9136196aa8 |

详尽原稿在 [reading.md](../reading.md)；固定源码局部定位在 [机制研究](../../../vault/distilled/agentscope-enterprise-20261012/mechanics-handoff.md)。
