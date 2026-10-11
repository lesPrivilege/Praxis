---
id: ASA-A-09
url: https://ui.shadcn.com/docs/registry
status: verified
evidence_modality: [text_read]
license_state: 文档页没有在所读内容中声明许可；分发文件的许可证属于各资源自身，尚未检查。
snapshot_status: not-captured
---

# ASA-A-09 · shadcn/ui registry documentation

**Exact URL:** https://ui.shadcn.com/docs/registry

**摘要：** shadcn 文档把 registry 定义为可自行运行的代码分发系统，可向不同项目与框架分发组件、hooks、页面、配置、rules 等文件，并指向 registry.json schema。用于对照内容系统之外的可安装实现资产目录。

**实际阅读位置：** Introduction; A distribution system for code, Getting Started links。读取范围限于所列文本。

**支持的主张：**
- **ASA-A-09-C01** — `Introduction; A distribution system for code`：官方文档称可运行自有 registry 来分发组件、hooks、页面、配置和其他文件，且适配任意项目类型与框架。
- **ASA-A-09-C02** — `Getting Started links`：介绍页提供 registry setup 指引和 registry.json schema 作为下一步规范入口。

**限制：** 只读 registry 介绍，没有读取 registry schema、CLI 或实际安装资源；页面没有就每个条目的信任、许可或副作用作统一背书。

**Derived grammar:** [Agent design resources](../../../../../kit/design/references/agent-design-resources.md) — ASA-G-AGENT-DESIGN-SYSTEM-CONTRACT / ASA-G-AGENT-COMPONENT-RETRIEVAL

**History:** [Research history](../CHANGELOG.md)
