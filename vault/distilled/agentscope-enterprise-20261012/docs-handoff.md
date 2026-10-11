# AgentScope 企业线无 TTS 视频：有界探索交接（初版）

## 当前已确认范围与固定版本

本轮只读官方 agentscope-ai 生态，围绕“主 SDK → Runtime → Studio → Java/Service 企业线”建立边界；不 clone、不安装、不运行、不做真实测试。已锁定的 main 头部 commit（GitHub API 读取时间 2026-10-12）：

| 项目 | 官方定位/文档入口 | commit / commit date |
|---|---|---|
| agentscope | Python 主 SDK + Agent Service；docs.agentscope.io | e4c1e074dee3f0f6cca28ca29e934c4ec0605354 / 2026-10-10 |
| agentscope-runtime | Python runtime：sandbox、Agent-as-a-Service、部署/观测/框架互操作 | 22072fd7075ce0c6f43cb39509d6a14b0e60ddb5 / 2026-06-04 |
| agentscope-studio | 开发期可视化工具；官网有 AgentScope 2.0 migration archive 提示 | 20e7638273d3726732eb317b440bfa34e6694e17 / 2026-09-02 |
| agentscope-java | Java Harness SDK + AgentScope Service（Managed/External/Hosted agents） | 65a35d40abc2925b57c2d23c65f2081a599972a8 / 2026-10-11 |
| agentscope-runtime-java | Java Runtime 的 deployment/tool sandbox 实现 | 7b9032bec8b370fa09bc12e77ce2125b18853fbd / 2026-05-07 |
| docs | AgentScope 版本化文档源仓库（MIT） | 2dbdca882bd664876115b160096d32f224976bec / 2026-09-28 |
| agentscope-samples | Python SDK/Runtime 样例；仅作样例导航，不算产品边界 | c7f3174cbbd32a96c796571d0fe930ac80ddd523 / 2026-04-10 |

本表的仓库描述与 commit 来自 GitHub API，源码正文来自 raw URL；详见 sources.json。官方产品入口另有 runtime.agentscope.io、java.agentscope.io。

## 文档系统目录（已确认）

1. Python AgentScope 官网是 Mintlify 版本化系统：docs.agentscope.io/llms.txt 指向按语言、产品和版本的 /_llms/...txt 索引；当前索引标出 2.0.10dev（156 页）、2.0.9（156 页）等，并明确 /latest/ 是开发文档、稳定新项目应使用 /stable/en/index，不要混用 1.x/2.x API。主线视频应以“稳定/版本化入口问题”开场，而不是把 /latest/ 当不变产品页。
2. Runtime 官网是 Sphinx/Furo 静态文档：runtime.agentscope.io/en/intro.html，入口顺序为 Installation → Quickstart → Concepts → Deployment/Framework/Runtime API 等（页面 HTML 标出 Sphinx 7.4.7/Furo 2025.12.19）。其仓库 README 还链接 runtime.agentscope.io，仓库与文档分开。
3. Java 官网也是 Mintlify 版本化系统：java.agentscope.io/llms.txt 明确 v2，按 Harness（SDK/运行语义）和 Service（平台/企业运行）分区，另列 JEV；它的目录本身就是理解产品边界的主证据。
4. Studio 的 GitHub Pages 入口为 agentscope-ai.github.io/agentscope-studio/。当前 README 顶部的 Archive Notice 明说 AgentScope 2.0 的内置 Web UI/Agent Service 已涵盖原 Studio 能力，Studio 不再作为 standalone tool 维护并将归档；因此不可把 Studio 旧界面当成 2.0 企业运行控制台。
5. agentscope-spark-design 是旁支 UI component library（agentscope-ai/design + agentscope-ai/chat），有 sparkdesign.agentscope.io；可作为展示层/聊天 UI 线索，但不归入核心 Runtime 或 Java Service。

## 初步架构职责与企业线边界

- 主 SDK（Python）回答“如何定义/编排 Agent”：Agent/ReAct、Toolkit（Python/MCP/Skill）、Model、Context/Middleware、Memory、Event、Permission/HITL、Workspace/Sandbox；同时主仓库 README 把 Agent Service 描述为 FastAPI + Web UI 的多租户、多会话应用层，列出 Team、Channel、RAG、Hub、资源共享、持久化、调度。
- Runtime（历史独立 Python runtime）曾回答“如何把 agent app 安全地放到可部署/可观测的执行环境”：sandbox、工具安全、Agent-as-a-Service、扩缩/部署、全栈观测、跨框架互操作；但其 README 与在线 cookbook 顶部均有 Archive Notice，明确这些能力已原生并入 AgentScope 2.0，独立仓库只读、将归档。主线应把它当迁移前身/证据来源，当前能力入口回到主 SDK 2.0 的 building-blocks 与 deploy。
- Studio（历史开发工具）回答“开发阶段如何看见/调试过程”；当前源头明确不再维护并将归档，不应赋予它 Java Service 的生产控制平面职责。
- Java v2 把企业线显式拆成 Harness 与 Service：Harness 是应用侧构建和持续工作的 Agent（AgentState/RuntimeContext、workspace/filesystem/sandbox、session/recovery、memory/subagent/skill/plan/channel）；Service 是平台侧部署、自有/托管 Agent、Session API、事件回放、文件/artifact、Teams/Workflows、External/Hosted agent、权限/namespace、生产安装与运维。
- agentscope-runtime-java 是 Runtime 的 Java 实现线，职责是部署与工具沙箱；不要将它等同于完整 Java Service 平台（Service 目录在 agentscope-java 文档）。

## 立即可用于主线的“入口问题”

视频面向 20–30 分钟、约 40–50 场、无 TTS 时，建议 PM 先回答：这个需求是在 SDK 内定义 agent，历史 Runtime/当前 2.0 内托管执行，历史 Studio/当前 2.0 Web UI 内观察开发过程，还是 Java Service 内接入企业业务/多租户生产控制？同一个“视频演示”若不先选边界，会把 Studio、Runtime、Service 的职责混成一个产品。

已确认、会改变业务判断的具体边界：Python Agent Service 默认只用 X-User-ID 占位头（不是认证），需接入 JWT/OAuth 等真实身份；分布式部署在 2.0.9 文档仍标 WIP，依赖 Redis storage + message bus；scheduler 只能由一个进程持有内存定时器，否则每个副本都会触发一次；load balancer 后必须显式配置 download_secret，否则跨副本下载 token 随机失败；高 CPU 文档解析必须移到 ProcessPoolExecutor，否则阻塞 API/event loop。资源 sharing 默认 DenyAllResourceAccessPolicy，企业 IAM/组织关系需部署方实现；shared agent 不共享 workspace/MCP/skills/Memory（文档标为已知 gap）。RAG 生产拓扑要求 API 与 worker 共享同一 storage/message bus/blob/vector backend，配置不一致会 indexing failure/data corruption。

Java 线还应在视频里保留这些会改变方案的条件：Service 当前是 2.1.0-BETA1 prerelease；官方建议 self-host，Harness SDK 由应用团队自行部署运维，Managed Agent 由 Service 平台管理。多副本 Harness 需 DistributedStore（Redis/JDBC/OSS 组合）提供 AgentState、KV、sandbox snapshot、execution guard；仅本机 JsonFile/Noop snapshot 是开发约束。每次调用都必须显式传 RuntimeContext 的 userId + sessionId，否则共享 defaultSessionId 造成串话；IsolationScope 上线后改变不会迁移既有数据。Service 的 Session/Turn 是应用观察与恢复边界：SSE 需 snapshot + cursor，410 过期要重新 snapshot；Webhook 至少一次，不等于业务幂等；取消、checkpoint、恢复都不能撤销已经发出的外部副作用。Managed/External/Hosted 不是同一能力：External 注册本身不等于有 task executor，Hosted Runtime Host 的 checkpoint 不能当通用 Agent API restore；Team/Workflow 成员不自动共享文件系统，依赖 Artifact 交接。企业权限在 Account/Namespace/Resource/Issue 四层，Service 不替业务系统做数据授权或结果验收。

## 文档系统如何组织理解

主线可按“稳定入口 → 构建块 → 执行环境 → 服务部署/API → 生产限制”的顺序读：Mintlify 的 2.0.9 index 先把 Agent/Model/Context/Tool/Permission/Workspace 分组，再单列 Agent as Service 和 API；Runtime 的 Sphinx cookbook 是旧版 Engine/Sandbox/Tool 三段式，顶部已经转为迁移告示；Java Mintlify 的 v2 index 直接把 Harness（SDK）与 Service（平台）分开，Service 再按 Getting started、Sessions/API、Orchestration、External/Hosted、Access、Operations 展开。这个目录顺序比仓库名更可靠：它说明“构建能力”和“托管/交付能力”是两个消费面。

## 给主线的内容裁决

可以用四个可回看的视觉层组织 40–50 场：Python SDK 的 Agent loop（定义）；Workspace/Permission（执行边界）；Agent Service/Runtime lineage（托管、回放、后台/调度）；Java Harness → Service（企业接入、Managed/External/Hosted、Session/Turn → Artifact）。Studio 仅作为“历史开发可视化已被 2.0 Web UI 吸收”的转场。无声画面应把具体故障条件做成可读标签或事件状态（例如 'X-User-ID ≠ auth'、'cursor_expired → snapshot'、'NoopSnapshot = dev-only'），而不是泛泛讲“安全/生产级”。

## 覆盖与未决

本轮固定版本与来源逐条登记在 sources.json；有意读取 46 个本地捕获文件，共 854,296 bytes / 13,067 lines（另有 4 个并发探针/404 临时文件保留但不计入）。已覆盖主 SDK、版本化 docs、Runtime/Studio 迁移、Java Harness/Service 关键页面及 Runtime Java；未查商业版/SLA/内部服务，也未 clone/install/run/真实测试。Java Service 页面自身标明 preview/prerelease，需由主代理决定视频是把它呈现为企业线“当前公开预览能力”，还是只做架构方向。

待主代理裁决：是否把 Java Service 2.1.0-BETA1 以“当前公开预览”讲入主线，还是只用 Harness/Service 分层解释企业边界；未查企业商业版、付费 SLA、阿里云内部服务或非公开组件，当前结论只描述公开开源仓库/公开文档。
