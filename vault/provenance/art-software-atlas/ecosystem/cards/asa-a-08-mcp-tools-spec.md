---
id: ASA-A-08
url: https://modelcontextprotocol.io/specification/2025-11-25/server/tools
status: verified
evidence_modality: [text_read]
license_state: 规范网页未核验再利用许可；消费其要求与结构摘要。
snapshot_status: not-captured
---

# ASA-A-08 · Model Context Protocol tools specification

**Exact URL:** https://modelcontextprotocol.io/specification/2025-11-25/server/tools

**Original-language / source framing:** Model Context Protocol tools specification. The statements below preserve the source's own project or specification perspective; they are not Praxis endorsements.

**摘要：** MCP 工具规范为 server 声明工具名、描述和 JSON Schema 输入，client 用 tools/list 与 tools/call 发现、调用，并允许结构化输出。规范强调服务器校验和访问控制、客户端对敏感操作征求确认、审阅输入与结果。用于评估 agent 接入路线的授权边界。

**本 Kit 消费：** ['agent-tool-protocol', 'permission-contract', 'implementation-specification']。用于 agent 设计资源发现、格式对照与权限/交付边界判断。

**实际阅读位置：** User Interaction Model; Listing Tools; Calling Tools, Security Considerations。仅消费网页提取的文字；未检查其他未列章节、图像、现场页面或运行结果。

**支持的主张：**
- **ASA-A-08-C01** — `User Interaction Model; Listing Tools; Calling Tools`：MCP client 可发现工具 schema 并调用；规范不强制单一交互 UI 模式。
- **ASA-A-08-C02** — `Security Considerations`：规范要求 server 校验输入、访问控制、限流、净化输出；建议 client 对敏感调用确认、显示工具输入、校验结果并记录调用。

**限制：** 规范描述协议，不验证某个 MCP server 的实现、工具副作用或客户端的人机确认 UI。工具注释不应盲目信任。页面在 URL 中固定一个协议日期版本；应按当前协议复核。

**权利与依赖：** 规范网页未核验再利用许可；消费其要求与结构摘要。 不因本页可访问而扩大第三方字体、图像、组件、品牌系统、设计文件、agent CLI、MCP server 或服务的授权。未安装或调用任何集成。

**来源用途：** `agent-tool-protocol, permission-contract, implementation-specification`。证据形态仅为文本读取；该卡不证明产品行为、视觉质量、可访问性、性能或安全性。

**Derived grammar:** [Agent design resources](../../../../../kit/design/references/agent-design-resources.md) — ASA-G-AGENT-DESIGN-SYSTEM-CONTRACT / ASA-G-AGENT-COMPONENT-RETRIEVAL

**History:** [Research history](../CHANGELOG.md)
