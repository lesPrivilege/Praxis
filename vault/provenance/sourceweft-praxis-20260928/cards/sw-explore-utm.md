# SourceWeft explore subagent

状态：verified-primary-web · supplemental-reference  
original URL：<https://github.com/SourceWeft/SourceWeft/blob/main/apps/backend/src/modules/threads/agent/subagents/explore.ts?utm_source=chatgpt.com>  
canonical URL：<https://github.com/SourceWeft/SourceWeft/blob/main/apps/backend/src/modules/threads/agent/subagents/explore.ts>  
pinned URL：<https://raw.githubusercontent.com/SourceWeft/SourceWeft/f88212b91216267f3dc1053f9424010cae9de5b6/apps/backend/src/modules/threads/agent/subagents/explore.ts>  
source commit：f88212b91216267f3dc1053f9424010cae9de5b6

## 是什么

文件注释把 explore delegate 定义为 read-only investigation 和 context quarantine：子调查消耗自己的上下文，父子通过共享文件系统作 blackboard，消息保持隔离；它不能写入、执行或发布。

schema 要求 summary、findings 数组和 limitations；每个 finding 有 claim、citationMarkers、sourceReferences。description 和 system prompt 要求返回单一、自洽的报告。

## 可消费语义

这为 Luna explorer → Astra/main 的交接提供运行时参照：低价值检索留在 child，主上下文接收有证据定位和限制的摘要。

## 边界

只核实注释、schema、描述和 system prompt，不证明实际运行、检索质量、计费、权限 middleware 或报告完整性。Praxis 可继续扩展 evidence_ids、candidate_increment 和 needs_main_decision，不应照搬为产品实现。

证据：SW-EXPLORE-01..02；访问：2026-09-28。
