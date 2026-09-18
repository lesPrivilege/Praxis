# Workplace Control Surface

## 工具控制面

用户要求把办公室软件、邮件、WeChat 与工具能力登记到同一控制面（T4/U）。历史回答给出的排序是 `API → CLI → MCP → Skill → GUI fallback`（T4/A）。这是一条按可观察性、可测试性和可回滚性排列的候选接入路径；它不代表当前机器、租户或账号已经安装或授权这些工具。

```text
API
  → CLI
  → MCP
  → Skill
  → GUI / Computer Use fallback
```

每一个能力都应登记为可发现的条目，而不是让 Agent 记住一串隐含命令。候选 registry 字段：

```yaml
capability:
provider:
surface: api | cli | mcp | skill | gui
operations: [read, list, search, draft, create, update, send, delete]
schema:
auth:
scope:
dry_run:
provenance:
fallback:
data_boundary:
status: candidate | verified | disabled
```

## 动作分级

动作级别先表达后果，再决定工具入口和是否需要人：

| 级别 | 含义 | 典型动作 | 人的介入 |
| --- | --- | --- | --- |
| R0 | 只读、列举、导出 | 搜索邮件、读文档、列日历 | 不需批准，但要留 provenance |
| R1 | 提取和准备 | 解析附件、归属 matter、生成摘要 | 低风险建议可批量 review |
| R2 | 本地或草稿变更 | 写本地 artifact、建 draft、stage state diff | 需可回滚和可见 diff |
| R3 | 共享空间或外部承诺 | 发邮件、建会议、创建共享文档 | 人确认收件人、正文、附件、权限 |
| R4 | 破坏性或大范围动作 | 删除、撤销、批量覆盖、改变外部合同 | 每次显式确认并记录恢复条件 |

动作级别是治理候选，不能由模型自行降低级别。`send`、`delete`、对外共享和权限变更即使技术上有 API，也要进入 Review Space。

## 操作序列

每次调用沿同一可审计顺序进行：

```text
discover
  → inspect schema
  → read / search
  → propose
  → dry-run
  → review
  → execute
  → record result and provenance
```

`dry-run` 应展示目标、范围、旧值、新值、受影响对象和失败回滚方式。若能力不支持 dry-run，就把动作降级到 draft/stage，或要求更高等级的人审查。

## 平台登记（候选）

| 工作面 | 优先入口 | 需要核实的边界 |
| --- | --- | --- |
| Google Workspace | gws / Remote MCP / 官方 API | 账号、租户、OAuth scope、Drive/Docs/Sheets/Calendar schema |
| Gmail | Gmail API/CLI/MCP；Himalaya 可作为邮件协议候选 | 线程、附件、发送权限、watch 能力 |
| Microsoft 365 | Graph、M365 CLI/MCP | 租户策略、邮件/Drive/Calendar 权限、审计 |
| WPS | 官方 API 或可验证 CLI/MCP | 当前可用接口、文档权限、区域与租户策略 |
| 飞书、钉钉、企业微信 | 官方 API、CLI 或 MCP 适配器 | 机器人/应用身份、群与文档权限、消息留痕 |
| 个人微信 | 仅实验性 GUI fallback 候选 | 自动化稳定性、隐私和账号风险；不得把 GUI 经验当作 API 契约 |
| 无 API 的桌面工具 | GUI / Computer Use | 可见页面、人工确认、幂等性和失败恢复 |

上表保留了历史回答的候选方向，具体厂商能力、版本和订阅不属于已核验事实。外部引用占位集中登记在 [`../../intake/work-system-materials.json`](../../intake/work-system-materials.json)。

## Email 与外部发送

邮件能力应先拆成可回看的对象和动作：

```text
search / read
  → classify to matter
  → extract commitments
  → draft
  → human accept / edit
  → send
  → record message id, recipients, attachments, timestamp
```

草稿可以是 R2；真正发送是 R3，必须展示收件人、抄送、正文、附件和来源。邮件线程的“最新一句”不能直接覆盖 Matter State；它先进入 proposed diff，再由人决定是否 commit。

## 浏览器 fallback

浏览器的候选优先级是 API → CLI → MCP → Playwright/accessibility → Computer Use（T1/A）。当页面没有稳定接口时，GUI 只负责完成当前可见动作；必须记录页面来源、操作前状态、操作结果和人工介入点。GUI 不应被反向包装成无证据的稳定 API。

## Registry 与 Agent 的边界

工具 registry 负责回答：能力在哪里、支持哪些 schema、读写后果是什么、凭证和数据边界是什么、失败如何恢复。Agent 负责选择已登记能力、准备输入、生成 diff、请求 review、记录结果。若 registry 缺字段或能力未验证，Agent 应输出待核实项，而不是猜命令、猜租户或伪造成功。

## 待核实

- 当前设备、账号、租户、API key、MCP server 和 CLI 安装状态未检查。
- 各产品的现行版本、价格、订阅、区域可用性和官方能力未在本地来源中确认。
- “WeChat MCP”是用户要求登记的能力类别；其具体实现、合规边界和可复现接口必须另行验证。
- 本轮没有安装工具、连接账号、发送消息或执行自动化。
