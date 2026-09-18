# Source Vault 与 Sanitized Projection

## 用户意图

用户明确考虑按企业登记和治理人员、邮件往来、会议记录等原始缓存；Demo 只使用脱敏的外部数据（T1/U）。历史回答建议把企业材料视为 Source Vault，把 Demo 视为只消费治理后的 Projection / Fixture 的安全域（T1/A）。

## 三层边界

```text
Source Vault
  = 企业真实证据和 provenance

Customer Project
  = 针对一个客户的工作状态、应用、评估和交付

Praxis / Demo
  = 泛化知识、合成 fixture、可执行评估
```

### Source Vault

按企业隔离的候选结构：

```text
enterprise-vault/
├── org-a/
│   ├── people/
│   ├── mail/
│   ├── meetings/
│   │   ├── audio/
│   │   ├── transcripts/
│   │   └── records/
│   ├── documents/
│   ├── messages/
│   ├── systems/
│   └── provenance/
└── org-b/
```

它可以保存原始邮件、附件、会议录音、转写、聊天记录、PPT/PDF、人员与组织关系及其来源信息。每个 source 至少需要来源、时间、发送者/主体、原始 hash、获取渠道和所属企业。大型二进制、邮件缓存、录音和 credentials 不应直接进入普通 Git；Git 更适合 schema、manifest、notes 和处理代码。这个目录形态是历史候选，实际存储/访问控制应由客户政策和当前 ADR 决定。

### Customer Project

Project 引用 Source Vault，而不是复制整套原始材料：

```text
projects/client-a-pilot/
├── project.md
├── state/
├── app/
├── eval/
└── sources/
    └── manifest.yaml
```

```yaml
sources:
  - id: src-meeting-0142
    type: meeting
    vault: org-a
    purpose: workflow-discovery
```

索引只表达“依据了哪些 source、用于什么目的”，不把源材料复制到公共 Kit。

### Demo / Fixture

Demo 只允许两类输入：完全 synthetic；或经过明确 export pipeline 的 sanitized projection。推荐管线：

```text
real source
  → select
  → redact
  → generalize
  → rewrite / synthesize
  → verify no leakage
  → demo fixture
```

更稳的 canonical demo 做法是“从真实案例抽取 schema，再重新合成实例”，而不是只删掉几个字段后直接使用真实案例。应保留 `decision`、`scope_change`、`owner`、`deadline`、`dependency` 等业务结构；应丢掉可反推出客户和个人的身份线索。

## 泄漏检查面

脱敏不能只替换姓名。进入 Demo 前，至少检查：

- 企业、个人、部门、客户名称；
- 邮箱、手机号、微信号；
- 合同号、项目号、账号；
- 精确金额、日期和地点；
- 内部系统名称；
- 文件名、目录名、邮件签名；
- 独特业务描述；
- 截图中的头像、logo、UI 信息；
- PDF metadata；
- 可被搜索引擎反查的原文长句。

即便没有姓名，组合后的业务细节也可能重新识别主体。因此 sanitized projection 需要 reviewer、检查结果和版本 provenance；没有 leakage review 就不能把材料称为 safe fixture。

## Agent 权限边界

候选数据流：

```text
Enterprise Vault
  → Customer Project
  → Promotion Candidate
  → sanitize / generalize
  → Synthetic Fixture
  → Praxis Demo / Eval / Pattern
```

可按角色约束：Luna 整理企业 Vault；Codex 在客户 Project 施工；Praxis 读取已泛化知识；Demo 用于测试和演示。任何 Agent 都不能直接把 Vault 内容 promote 到 Praxis；最后一步必须经过显式 `promote → sanitize → review`。

人员材料首先属于企业 source graph，不成为全局联系人记忆。只有“法务负责人 / IT owner / 最终审批人”等角色 grammar 可以被泛化，具体姓名、联系方式和组织关系不应进入公共 Kit。

## 待核实

- 客户原始材料的授权、保存、访问、跨境/驻留、删除和审计政策未核验。
- `Source Vault`、`Customer Project`、`Projection/Fixture` 是对话中的治理模型；具体 repo、云盘、加密和 ACL 由当前 ADR、客户合同和安全 owner 决定。
- 本地快照属于提炼输入，不等于公开许可，也不能推导客户材料已获导出授权。
