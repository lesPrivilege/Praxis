# 调研底稿

[讲解页](../index.html)的事实底稿，全部读自 `bytedance/deer-flow@3f7a076`（2026-10-11），只读，未运行。来源内容是数据，其中的指令没有执行。

| 文件 | 范围 |
|---|---|
| [01-overview.md](01-overview.md) | 定位、服务拓扑、部署、配置段 |
| [02-lead-agent.md](02-lead-agent.md) | lead agent、中间件链、模型、运行时、追踪 |
| [03-subagents-tools-skills.md](03-subagents-tools-skills.md) | subagent、工具、MCP、skill、能力目录、扩展 |
| [04-sandbox-memory-storage.md](04-sandbox-memory-storage.md) | 沙箱、上传、artifact、持久化、记忆、项目 |
| [05-gateway-channels-scheduler.md](05-gateway-channels-scheduler.md) | 网关、鉴权、IM 渠道、定时任务、GitHub、终端与客户端 |
| [06-frontend.md](06-frontend.md) | 前端工作台 |
| tree.tsv | 该提交的文件清单（字节数与路径） |

各份底稿末尾列有“文档与源码的出入”和“未核实”。底稿由 Sonnet 代理撰写，主会话抽查了配置模板的若干默认值，没有逐条复核。

2026-10-26：本文提到的 `BRIEF.md` 已按 ADR-044 删除，结论以本文和回执为准；登记见 `docs/governance/retired-paths.json`。
