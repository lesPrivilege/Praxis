---
id: ASA-A-04
url: https://raw.githubusercontent.com/nexu-io/open-design/main/docs/skills-protocol.md
status: verified
evidence_modality: [text_read]
license_state: 仓库文档；外部 SKILL.md、资产、模板和扩展必须逐项确认许可，不因目录可读而推定可再分发。
snapshot_status: not-captured
---

# ASA-A-04 · OpenDesign skills protocol

**Exact URL:** https://raw.githubusercontent.com/nexu-io/open-design/main/docs/skills-protocol.md

**摘要：** 项目协议把 functional Skill 与 rendering design template 分开：两者可共用 SKILL.md 可读格式，却进入不同目录、API 与 UI 分类；扩展字段描述模式、表面、设计系统需求、craft、示例提示和 critique policy。用于解释 agent 工作步骤与可渲染模板是不同资源身份。

**实际阅读位置：** Skills Protocol: opening definition; Base format, OD extensions; What OD uses each field for。读取范围限于所列文本。

**支持的主张：**
- **ASA-A-04-C01** — `Skills Protocol: opening definition; Base format`：项目定义 skill 为原子功能能力、design template 为渲染目录项；都可使用 SKILL.md，但由不同目录和 API 持有。
- **ASA-A-04-C02** — `OD extensions; What OD uses each field for`：项目可用 metadata 选择输出 mode/surface、组合设计系统与 craft 参考、提供示例提示和 critique policy。

**限制：** 项目协议，不等于所有 agent 对 OD 扩展字段的支持。未安装或启动 registry，也未对兼容声明作跨客户端测试。只读取页面前段字段说明，不推断完整插件权限。

**Derived grammar:** [Agent design resources](../../../../../kit/design/references/agent-design-resources.md) — ASA-G-AGENT-DESIGN-SYSTEM-CONTRACT / ASA-G-AGENT-COMPONENT-RETRIEVAL

**History:** [Research history](../CHANGELOG.md)
