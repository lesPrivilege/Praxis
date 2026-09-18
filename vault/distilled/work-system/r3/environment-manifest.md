# Environment Manifest：fresh Mac 的受治理工作环境

## 用户意图

用户希望 Praxis 作为 environment 索引：在 fresh Mac 上装载 Kit 后，Agent 能在本机建立数据库，生产工作按既定体系增量入账；客户事实与个人工作流需要隔离，Codex 全局 Agent.md 应把 Praxis 作为企业工作的首要调用对象（T7/U、T8/U）。用户要求的是可长期维护的环境契约，不是本轮执行 bootstrap。

## 历史 assistant 方案

历史回答把 Praxis 定义为 environment manifest：声明机器能力、目录、策略、数据结构和 Agent 行为，真正数据与运行状态在本机按契约生成。候选五层：

| 层 | Praxis 保存 | Fresh Mac 生成 |
| --- | --- | --- |
| Environment | 软件、CLI、目录、系统能力声明 | Brew/CLI/Shortcuts/必要 daemon |
| Policy | 数据、模型、权限、Agent 行为契约 | project-local policy |
| Schema | Matter、Meeting、Action、Run、Review 定义 | 本地 DB schema |
| Workflow | ingest、meeting、mail、closeout loop | 实际 automation |
| Reference | grammar、demo、synthetic fixture、外部索引 | 不产生客户事实 |

候选 public/reusable 与本地状态分层：

```text
~/Praxis/       reusable method / Kit
~/Work/         customer-specific working state
~/Vault/        raw evidence / customer truth
~/Runtime/      agent-runs / logs / cache / temp
~/.config/praxis machine configuration
```

`Vault` 不应在 Praxis public Git tree 下；Work、Vault、Runtime 也不应因便利合并成一个“大工作目录”。这是一项文件系统层的防误 commit 设计建议。

## 数据库与索引

候选实现是 filesystem + relational metadata + rebuildable indexes：原始 PDF、录音、邮件附件、PPT、DOCX 继续是文件；SQLite 保存对象、关系、状态、provenance、run、review 和引用；全文索引、embedding、图谱都是可重建 projection。

数据库不跨客户扁平化：

```text
global-control.sqlite
  → environment / registered projects / non-sensitive registry / usage aggregate

Client A/
  → source.sqlite / project.sqlite
Client B/
  → source.sqlite / project.sqlite
```

Global 层只保存非敏感聚合，例如 project 存在和 extraction 次数，不保存客户会议原文或合同金额。

## Secret 与身份

Praxis 只登记 credential handle，不保存密码、token 或 cookie：

```yaml
credential:
  id: client-a-m365
  provider: keychain
  scope: client-a
```

候选 identities metadata 可包含 service、tenant、role、owner、auth handle、expiry、read/draft/send/delete policy；真实 credential 由系统 Keychain、企业 credential manager 或批准的 secret store 管理。GitHub、SSH、browser profile、Google/Microsoft tenant、飞书/企业微信、API key 和 cloud identity 需要分别隔离。

## Bootstrap contract

历史回答建议 bootstrap 采用 desired-state 阶段机，而不是一串不可重入 shell：

```text
00 inspect
  → 01 machine
  → 02 packages
  → 03 directories
  → 04 database
  → 05 identities
  → 06 agent runtime
  → 07 policies
  → 08 validation
  → ready
```

每一步候选行为是 `inspect current state → compute diff → apply → verify → record`。`Brewfile`、chezmoi、Home Manager 等只作为历史回答提到的成熟实践方向；是否采用、当前版本和与 MDM/IT policy 的兼容性未核验。

全局 `AGENTS.md` 更适合做 router：resolve active Praxis environment、project/customer boundary、policy、允许的数据/模型/tool scope、registered workflow、run record 和人审路由；它不应独自承担安全边界。硬约束应落到 filesystem、Git remote、OS/browser identity、credential、provider allowlist、network、hooks 和 tool permission。

Project-local policy 只能比全局更严格；候选 `praxis check` 在运行前检查 repo/customer、data class、model、credential tenant、output destination 和 HITL 要求。

## 待验证与不实施项

- 本轮未执行 bootstrap、安装包、创建数据库、连接账号或写入 AGENTS.md。
- T7/A 中关于 SQLite WAL 并发、具体修复版本和 Keychain/secret manager 能力含 5 个外部引用占位；由独立流程核查，不在这里当作事实。
- 目录名、SQLite 分层、policy schema 和 `praxis check` 是候选 contract，必须通过真实设备、权限和恢复演练验证。
