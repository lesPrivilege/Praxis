# AgentScope 企业线视频：范围与版本裁决

日期：2026-10-12。角色：Astra 关键裁决；实际精确模型 ID 以主代理 spawn 调用记录为准，子代理上下文没有独立模型查询结果。

范围：依据文档探索交接及已抓取官方正文做一次有界裁决，未另起全量探索、未 clone/install/run。本文属于制作过程记录，不能直接作为成片屏幕文案。

## 一、主线决定

必须同时覆盖 Python 2.0 与 Java v2 企业应用路线。它们是两条产品与运行路径，不是 SDK → Python Runtime → Studio → Java Service 的一条逐级升级产品链。

建议成片题旨：一个业务任务怎样变成可接入、可观察、可干预、可交付、可恢复的 Agent 服务。文档目录用于导航和证明职责，不能把视频拍成目录朗读。贯穿案例宜用“读取资料 → 研究/审核 → 等待用户决定 → 产出报告 → 交付业务系统”，能自然暴露授权、排队、文件与结果验收问题。

画面最初只需给产品身份地图：Python 2.0.9（稳定文档线）、Java Harness v2、Java Service 2.1.0-BETA1。Python main 2.0.10dev 作为源码研究版本记录进 provenance；只有确需讲main独有实现时，局部标识dev，不用dev覆盖稳定文档。Java Service 的 prerelease 版本是具体产品身份，应出现在Java章节版本角标或起始产品卡；不需要独立免责声明页。

旧 Python Runtime 与 Studio 均已被 README 明确定位迁移/归档线：最多一场迁移关系动画，让历史能力流入当前 Python 2.0 对应入口。不能把独立 Runtime 或 Studio 做成今天必装组件，也不能把旧 Studio UI 当 Java Service 生产 Console。agentscope-runtime-java 同样不能直接等同完整 Java Service。无需为这些旧项目分配大篇幅逐模块讲解。

Java篇是必要的：只讲 Python 主SDK内部ReAct，再以旧Runtime与Studio串起“企业线”，会遗漏现公开产品里最明确的共享平台责任、应用集成契约、持续协作与运行接入模型。反过来，只讲Java Service也会误导观众把Python Agent Service降格为纯SDK。推荐Python约45%、Java约40%、定位/对照/业务落地约15%；具体时长服从必要因果链而非均分API目录。

## 二、优先讲解层级

1. **业务与产品责任**：SDK嵌入应用由应用团队运营；平台Managed由共享Service运营。业务数据授权、目标定义与成果验收仍由业务系统承担。用泳道明确应用、Agent、执行环境、共享平台各自执行什么动作。
2. **一次调用的真实机制**：输入如何进入上下文，模型如何发出工具调用，工具如何被选择/调度/审批，执行结果怎样反馈给下一步，何时结束。Python与Java共享概念可以在此对照，但不能混用API名/默认值。
3. **上下文与持久状态**：区分本次模型输入、会话事实与checkpoint、workspace文件、跨会话memory、RAG知识。压缩/offload只是输入管理；memory不是每次完整会话重放；sandbox文件恢复不等于外部业务事务回滚。
4. **从调用到长期任务**：Session冻结什么，Turn怎样接受/排队，审批怎样阻塞后续工作，steer/inject/取消分别改变什么。必须显示accepted→running→waiting→completed/failed的具体路径，而非一个无限循环发光箭头。
5. **从事件到产品体验**：snapshot→as_of→SSE增量→去重→游标过期重取snapshot；断线与重连是观察链，不是重新发任务，也不是恢复执行进程。
6. **企业接入和交付**：Managed/External/Hosted运行所有权；Namespace/资源use/工作read的不同判断；工具凭证与业务权限；文件到Artifact的显式交付；Team/Workflow/Issue的职责。
7. **生产与故障**：共享存储与隔离范围、执行租约/fencing/Attempt、重试副作用、数据库+文件+Vault key恢复、具体部署限制。优先解释为什么会失败，再出现组件名。

“详尽到局部实现”应落实为每个关键段落有一个对象或状态转换、一个具体机制、一个会影响业务的失败路径，以及可定位的来源。无需逐字段讲完所有HTTP接口。留出画面阅读停顿，主文每屏只承担一个判断，细节用按需展开图层或邻近小卡组织。

## 三、不可混说的契约

| 容易混说 | 裁决与推荐表达 | 依据 |
| --- | --- | --- |
| Python Agent Service = Java AgentScope Service | 两者分别讲；不能把Java Namespace/Hosted/Session契约套到Python | handoff；main-agent-service；java-service-index |
| shared Session API = shared行为 | Managed保留会话上下文；Team/Workflow每Turn启动独立协作/流程；控制按capabilities显示 | java-service-session |
| 配置一改既有会话立即更新 | Java Session创建冻结目标定义；新定义建新Session；Managed可改部分资源binding并不改被冻结定义 | java-service-session |
| accepted = applied = completed | 三种状态必须分开；202 queued尚未完成，input.accepted持久化，input.applied已被runtime消费 | java-service-session |
| 重连 = 恢复进程 = 重跑 | snapshot+SSE恢复UI；Hosted恢复依赖provider会话；重试产生新Attempt | java-service-sse；runtime-host |
| checkpoint统一可恢复任意后端 | Hosted统一调用checkpoint_restore:false；Host checkpoint只是provider恢复材料；OpenClaw当前无Session resume | java-service-runtime-host |
| common registry = fully interoperable | External按adapter capabilities；默认观察adapter不执行Issue/Team任务；Hosted交互也不等于Managed | java-service-external；runtime-host |
| 一条消息成功 = 已交付文件 | 工作目录文件未必对应用可下载；发布真实Artifact记录，按返回ID获取；completed还要业务验收 | java-service-files |
| Subagent = Team = Workflow | 当前Agent内委派、独立成员持续协作、显式流程推进是三个层级；可组合 | java-service-orchestration |
| 资源可发现 = 可调用 = 可读他人工作 | resource actions与Issue sharing分开；admin也不是所有private工作的默认读者 | java-service-access |
| 运行连接凭证保护注册 | Java当前External首次注册端点不认证请求；必须由受控网络/网关保护 | java-service-external |
| Webhook重试保证业务只执行一次 | delivery至少一次；事件ID去重；业务操作仍需自身幂等，通知成功不证明外部事务提交 | java-service-sse |
| cancel/retry/restore撤销外部结果 | cancellation要读终态；重试/恢复不回滚邮件、外部写入等副作用 | external；runtime-host；operations |
| Workflow可直接接所有触发器 | 当前Automation不能直接target Workflow；飞书Issue路由也不收Workflow target，需应用调用已发布Workflow Session | java-service-orchestration |
| 分布式默认全自动成立 | Python部署页仍有WIP；scheduler单持有者、下载secret跨副本一致、RAG共享后端拓扑要具体说明 | docs handoff，待主探索证据位置纳入 |

## 四、漏掉会误导的模块

最高优先，不应为了时长删掉：工具权限/HITL与sandbox的不同职责；context/memory/workspace/RAG边界；Session/Turn与事件恢复；Managed/External/Hosted；身份/资源授权/工作可见性；Artifact交付；Team/Workflow层级；持久化与外部副作用。漏任何一组，都容易把Agent聊天能力错误扩展成可运营业务能力。

次优先但至少给一场或一组局部动效：budget与超限后继续方式、model/tool middleware、并发工具调度、MCP/Skills来源、RAG索引异步生产链、channel/schedule触发、可观测性与trace。其价值是解释变更点、成本和故障责任，而非堆功能名。

可降为附录：每个模型provider、所有storage adapter、完整REST字段、历史Runtime逐框架例子、UI组件库、Java JEV专项、旧Studio操作教程。除非用户特别点名，不应挤占主线契约。

## 五、证据冲突与未决项（只进过程记录）

1. Java文档内有恢复机制张力：java-harness-architecture说默认EVENT_LOG/native checkpoints，LEGACY才走AgentStateStore；java-production仍把JsonFileAgentStateStore称Harness默认，并称状态只能经AgentStateStore跨进程保存。当前稿以architecture+session-log主路径为优先，但最终默认值需源码worker核对，不能合并成两套同时默认。production页可用其明确的OSS不提供分布式锁、共享internal token不适合互不信任多租户等局部约束。
2. Java Service index/operations明确2.1.0-BETA1，access/external页仍有preview说明。不能从“v2”目录推定所有Service能力已正式稳定发布。
3. docs handoff最初引用sources.json，但本轮读取时该文件尚未存在；主代理须用后来落盘清单补齐官方URL、读取时间和hash。已抓正文可支持本裁决，但尚不等于完整可归档来源清单。
4. 本轮没有独立重拉正文、没有验证部署行为；证据是文档内容及已获交接。以上记录放过程文档；成片不插“无配音/未测试/非承诺/作者并未...”这类制作旁白。

## 六、可视化验收准则

动画必须表达因果而非装饰：工具审批前箭头停在gate，批准后才流入sandbox；断网只切断浏览器观察线，后台执行仍推进；重连先恢复snapshot再补事件；重复webhook合并到同一event ID；Artifact从执行环境经过publish动作进入可交付目录；旧Attempt租约失效后回报被拒绝；Team成员只有明确共享Artifact连线，不画默认共享磁盘。

画面不能把示意流程暗示成实录Console。用明确对象名、状态和版本构成教学图，不插泛泛保护话。具体事实如“注册入口需网关保护”“同一幂等键复用原Turn”“审批期间后续Turn排队”“恢复需原Vault key”本身就是产品理解所需内容，必须保留。
