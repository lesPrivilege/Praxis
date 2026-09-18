# Harness 边界：Profile 优先，Fork 后置

## 用户意图

用户考虑为 Praxis fork 一个 agent/harness，与 coding agent 分离，接 Flash 和独立 extension/MCP，同时询问上游与社区生态是否已有热插拔和封装方式（T5/U）。用户也接受先用通用 Agent、以后再决定是否 fork（T6/U）。

## 历史 assistant 方案

历史回答建议先把 upstream harness 当运行底座，优先使用：

```text
Profile
  → Bundle
  → Plugin / Extension
  → Preset
  → MCP / Skill / patch
  → fork core
```

候选结构：

```text
upstream harness
├── profile: coding
│   ├── shell / filesystem / git
│   ├── browser / computer use
│   └── coding skills
└── profile: praxis
    ├── routine model
    ├── Praxis instructions / Kit
    ├── filesystem / SQLite
    ├── workplace / document / meeting hands
    └── strict enterprise policy
```

如果确需硬隔离，历史回答建议隔离 `DSH_HOME` 或等价的 state root，以分开 profile、plugin tree、credentials、sessions、settings、cache、browser profile 和 local ports；不要先修改源码里的 agent ID。只有当需要不同 session/state semantics、Agent loop、权限模型、Review Space seam、后台 daemon，或维护插件的成本高于薄 fork rebase 时，才考虑 fork。

## 当前可用性不作事实

历史回答声称某上游 prerelease、Profile、Agent Preset、Plugin Manager、client slots、browser/computer-use MCP 和社区 package 已存在或有具体版本，并列出若干近期 bug（T5/A）。这些主张含 16 个外部引用占位，外部核查由其他流程负责；本文件不把它们写成已验证能力。

本地可以保留的治理结论是抽象边界：

```text
Praxis v0     = generic runtime + opinionated profile/environment
Praxis v1     = bundle/profile package + policy + extensions
Praxis runtime = upstream seam 不足时再评估薄 fork
```

## 待验证

- 上游仓库、版本、配置目录、Profile/Preset/Plugin API、GUI slots、DSH_HOME 语义和 bug 状态必须在真正安装前以官方源和可复现实验核验。
- 不能因为聊天声称“已有插件/热插拔/限制工具”就假定当前 Courtwork 或本机存在。
- 本轮不安装 harness、不创建 profile、不修改 source code、不改 Agent ID，也不连接账号。
