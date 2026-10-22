---
id: ASA-A-10
url: https://developers.figma.com/docs/figma-mcp-server/
status: verified
evidence_modality: [text_read]
license_state: 开发者文档页未声明可复用许可；设计文件、变量、组件与团队资料的使用权限仍由 Figma 权限/组织策略决定。
snapshot_status: not-captured
---

# ASA-A-10 · Figma MCP server documentation

**Exact URL:** https://developers.figma.com/docs/figma-mcp-server/

**摘要：** Figma 官方开发文档描述 MCP server 可把 Figma 文件中的组件、变量和布局上下文提供给 coding agent，也可在具备相应工具与 skills 时写回原生 Figma 内容；建议大多数用户使用远程 server，并限制客户端目录。用于设计来源到代码与设计文档回写路线。

**实际阅读位置：** Introduction, How to connect。读取范围限于所列文本。

**支持的主张：**
- **ASA-A-10-C01** — `Introduction`：Figma 称 MCP server 可向 agent 提供变量、组件与布局上下文，也可写入或修改原生画布内容。
- **ASA-A-10-C02** — `How to connect`：文档推荐远程 MCP endpoint；写入工作流建议另装 Figma skills，并称仅 MCP Catalog 中列出的客户端可连接。

**限制：** 仅文档文本，没有连接服务、读取账号权限矩阵或进行画布写入；文档对能力的描述不代表该用户客户端获准连接。政府版和客户端目录有特定限制。

**Derived grammar:** [Agent design resources](../../../../../dsh-praxis/kit/design/references/agent-design-resources.md) — ASA-G-AGENT-DESIGN-SYSTEM-CONTRACT / ASA-G-AGENT-COMPONENT-RETRIEVAL

**History:** [Research history](../CHANGELOG.md)
