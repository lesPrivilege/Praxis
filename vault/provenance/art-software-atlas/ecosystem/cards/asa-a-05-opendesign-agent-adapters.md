---
id: ASA-A-05
url: https://raw.githubusercontent.com/nexu-io/open-design/main/docs/agent-adapters.md
status: verified
evidence_modality: [text_read]
license_state: 仓库文档；无独立代码复制。依赖、CLI 许可和第三方 agent 的权限仍各自适用。
snapshot_status: not-captured
---

# ASA-A-05 · OpenDesign agent adapter contract

**Exact URL:** https://raw.githubusercontent.com/nexu-io/open-design/main/docs/agent-adapters.md

**Original-language / source framing:** OpenDesign agent adapter contract. The statements below preserve the source's own project or specification perspective; they are not Praxis endorsements.

**摘要：** 项目描述以 plain data 对象声明 CLI 探测、参数构建、提示输送、流格式和能力，由共享 engine 执行发现、启动、调用和流解析；另有运行态权限处理、恢复和取消的委托边界。用于把代理运行环境集成与 design-system 内容格式区分开。

**本 Kit 消费：** ['integration-route', 'runtime-adapter-contract', 'vendor-architecture-claims']。用于 agent 设计资源发现、格式对照与权限/交付边界判断。

**实际阅读位置：** Agent Adapters: opening thesis; adapter contract, RuntimeAgentDef abbreviated; Adding a CLI。仅消费网页提取的文字；未检查其他未列章节、图像、现场页面或运行结果。

**支持的主张：**
- **ASA-A-05-C01** — `Agent Adapters: opening thesis; adapter contract`：文档称 OD 将模型调用、工具、上下文、权限、恢复与取消委托给用户既有 CLI；适配器是数据契约而非 per-agent subclass。
- **ASA-A-05-C02** — `RuntimeAgentDef abbreviated; Adding a CLI`：示例字段涵盖 binary、argv、prompt 传递、stream parser 和 capability/integration flags；新 CLI 可按文档通过新增定义注册到共享引擎。

**限制：** 维护方的架构说明，未读取 TypeScript 实现或运行适配器。文档声称的权限委托不是对任一 agent CLI 沙箱、批准行为或配置安全性的独立证明。

**权利与依赖：** 仓库文档；无独立代码复制。依赖、CLI 许可和第三方 agent 的权限仍各自适用。 不因本页可访问而扩大第三方字体、图像、组件、品牌系统、设计文件、agent CLI、MCP server 或服务的授权。未安装或调用任何集成。

**来源用途：** `integration-route, runtime-adapter-contract, vendor-architecture-claims`。证据形态仅为文本读取；该卡不证明产品行为、视觉质量、可访问性、性能或安全性。

**Derived grammar:** [Agent design resources](../../../../../kit/design/references/agent-design-resources.md) — ASA-G-AGENT-DESIGN-SYSTEM-CONTRACT / ASA-G-AGENT-COMPONENT-RETRIEVAL

**History:** [Research history](../CHANGELOG.md)
