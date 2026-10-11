---
id: "as-e8bf00e52cb9"
status: "verified"
url: "https://docs.agentscope.io/en/versions/2.0.9/building-blocks/workspace/overview.md"
---

# main-workspace.md

来源：[原始页面](https://docs.agentscope.io/en/versions/2.0.9/building-blocks/workspace/overview.md) · 状态：`verified`

用途：BUILD / GRAMMAR

## 摘要

官方材料，用于 workspace owns tools, MCP processes, skills, offloaded context lifecycle；seven backends from Local/Docker/Bubblewrap/E2B/Daytona/K8s/OpenSandbox；common agent-facing interface and sandbox gateway

## 证据与使用边界

LocalWorkspace is host filesystem and does not provide sandbox isolation; backend lifecycle/configuration still needs deployment docs.

## 何时重访

项目版本、接口、归档状态或部署范围变化时重访。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
