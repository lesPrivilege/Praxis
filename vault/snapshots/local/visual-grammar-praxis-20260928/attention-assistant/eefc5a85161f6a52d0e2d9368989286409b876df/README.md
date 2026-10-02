# Attention Assistant

个人 attention 的独立工作目录，以 Codex 手动运行维护 loop。当前是文件化实践，不是 Courtwork 产品实现。

## 开始

在 Codex 中添加本目录为项目。每次开始先读 `AGENTS.md`，再读 `private/registry.json` 的最小描述；按当前任务披露单个 attention。输入：

> 运行一次手动 attention loop。读取 registry，按本次目标选择一个对象，核对已有授权和来源，只展开相关状态与证据，完成已授权的可逆工作，更新事件、状态及 briefing。无变化不制造动作；对外发送须有当前会话的明确授权。

具体步骤见 [手动 loop](practices/manual-loop.md) 和 [human decision loop](practices/human-decision-loop.md)；邮件处理见 [email loop](practices/email-loop.md) 与 [邮件模板](templates/email-reply.md)，数据语义见 [契约](docs/state-contract.md)。

## 文件责任

- `private/registry.json`：对象存在性、最小描述与定位；只是本地目录，不是跨项目公开目录。
- `private/attentions/<id>/state.json`：个人 attention 的当前事实、状态及下一动作。
- `private/events.jsonl`：追加式本地记录；不是已实施的事务数据库。
- `private/sources/`：本轮网页讨论原文；不自动注入 context。
- `private/briefings/`：每轮向人展示的最小结果与续行入口。
- `templates/`：可复用空模板；可版本化。
- Courtwork：产品契约、实施及验收；Schema Engineering：论文与实践命题。这里仅保留相关引用，不复制两边产品台账。

`private/` 不入 Git，不创建远端。目录访问依靠本地环境权限；下述 disclosure 规则是手动协议，尚非技术强制访问控制。跨项目披露须先核定目标、目的及范围，包括是否允许透露对象存在。

## 本次基线

来源：[解释 GoRaven](chatgpt-conversation://6aa122d3-ac50-83ec-bbb3-a7959c28d9d3)，2026-09-09完整读取13个turn和1张截图。截图中的产品陈述是来信者主张，不构成能力验证或当前邮件状态证明。

Courtwork 固定读取 `683b6d1419242bd08d20b7deec77ce12af7dcf12`；Paper 固定读取 `d78fd312955c1f594e59cbdcbb0d3074ac355940`。工作交付入口见 private registry 的本次 source references。

本项目遵循手动触发，不建立定时器或后台续行。

## 给 Luna 的续行入口

> 作为本 attention 的单 writer，按 `AGENTS.md` 与 `practices/human-decision-loop.md` 运行一次有界 loop。只读取当前任务指定的 provider/thread 和必要公开证据；形成 attention judgment、proposal 与 human decision packet。没有当前会话外发授权时只准备草稿。完成后追加 event、更新 state revision/registry 与 briefing，并明确已做、未做、provider readback 和下一动作。

模板不是授权。`templates/human-decision-trace.json` 用于保持对象分离，`templates/email-reply.md` 用于起草；任何预填的 action、recipient 或正文都仍需按当前来源与授权重新核对。
