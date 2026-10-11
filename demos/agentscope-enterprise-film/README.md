# AgentScope 企业线 · 从运行机制到业务交付

第二版覆盖 53 个主题，编排为 50 场、52:01，1920×1080 横屏，无 TTS。面向 PM，从文档系统反推职责，再展开消息、循环、工具、权限、上下文、协作、Python 服务和 Java 企业接入。

## 交付入口

- 视频：`cut2/out/agentscope-enterprise-cut2.mp4`，本地生成物。
- [可暂停、跳章的舞台](cut2/film/index.html)
- [详尽阅读稿](reading-v2.html) · [第一版 Markdown 原稿](reading.md)
- [4:3 封面](covers/agentscope-4x3.png) · [可编辑 SVG](covers/agentscope-4x3.svg)
- [3:4 封面](covers/agentscope-3x4.png) · [可编辑 SVG](covers/agentscope-3x4.svg)
- [主题分镜](script/storyboard.md) · [第二版时间线](cut2/out/timeline.json) · [实际画面文字](cut2/out/screen-text.md)
- [制作与验收](production.md)

## 阅读与观看顺序

| 章 | 讲解范围 |
|---|---|
| 01 项目全貌 | 文档入口、Python/Java 两条路径、Runtime/Studio 迁移、合同助手 |
| 02 Agent 内核 | Msg/Event、ReAct、模型适配、工具注册与调度、权限与确认 |
| 03 上下文与协作 | 压缩、卸载、记忆、RAG、结构化输出、中断、中间件、核验和团队 |
| 04 Python 服务 | 托管、身份、状态与总线、后台任务、工作区、沙箱、部署和观测 |
| 05 Java 企业接入 | Harness、Session/Turn、目标接入、重试、SSE、动作控制、文件、授权、恢复、编排、Issue、预算、渠道、Webhook 和备份 |
| 06 从机制到方案 | 失败闭环与输入、动作、状态、交付契约 |

## 运行与重建

直接打开舞台或阅读稿；舞台全部本地依赖。使用现有 Python、Playwright、Pillow、numpy 和 ffmpeg，重建命令见 [build](build/README.md)。封面在 [cover.py](script/cover.py)分别绘制，无裁切转换。

公开来源原件在 [Vault](../../vault/provenance/agentscope-enterprise-20261012/README.md)，源码固定提交和阅读缺口在 [研究](../../vault/distilled/agentscope-enterprise-20261012/README.md)。说明中的合同助手是贯穿解释案例，不是运行实录。

## 第二版与基线

第二版将 AgentState、事件合并、权限确认、上下文卸载、运行锁、后台任务、目录分配、执行目标、SSE 回放、Artifact 与业务接收编排为 11 组状态展项。调用、会话和文件身份跨阶段保持稳定，关键默认与失败条件保留在画面和阅读稿中。

- [逐层阅读稿](reading-v2.html)：六章答案、53 个局部、12 条追问路线。
- [第二版工程](cut2/README.md) · [验收与修订记录](quality/README.md)
- 第一版保留：`out/agentscope-enterprise.mp4`，53 场、32:14；[原舞台](film/index.html)、[原阅读稿](reading.html)。
- [四段机制样片](quality/prototypes/README.md)保留初次时序与集成证据。

封面按各自画幅原生绘制，不改变横屏视频；此项已记入 [后续视频交付要求](../../kit/write/motion/narrative.md#多平台封面与交付表述)。
