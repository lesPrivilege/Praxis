---
id: ASA-A-03
url: https://raw.githubusercontent.com/nexu-io/open-design/main/design-systems/README.md
status: verified
evidence_modality: [text_read]
license_state: 属于 Apache-2.0 仓库中的文档；实际引用的第三方系统、字体、图像或组件须按其来源另行核权。
snapshot_status: not-captured
---

# ASA-A-03 · OpenDesign design-system package contract

**Exact URL:** https://raw.githubusercontent.com/nexu-io/open-design/main/design-systems/README.md

**摘要：** 项目目录说明最小包形状为 manifest.json、DESIGN.md、tokens.css，并说明可选 USAGE.md、组件 fixture、派生 token 索引、预览、资产和来源证据如何被运行时消费。列出导入、兼容旧 Markdown 包及质量守卫。用于设计系统上下文和分层字段设计。

**实际阅读位置：** Design Systems: minimum machine-readable shape; Manifest and catalog behavior, Rich package files; Derived files are caches, Importing and refreshing; Writing a package。读取范围限于所列文本。

**支持的主张：**
- **ASA-A-03-C01** — `Design Systems: minimum machine-readable shape; Manifest and catalog behavior`：文档要求标准包的 manifest.id 与目录 slug 对齐，manifest 声明 provenance 与 DESIGN.md/tokens.css 路径；旧式仅含 DESIGN.md 的目录仍可发现。
- **ASA-A-03-C02** — `Rich package files; Derived files are caches`：文档声明 USAGE.md、组件 fixture、tokens JSON、Tailwind 映射、assets/fonts、preview/source 可作为扩展包文件，其中若干格式为派生缓存，需与 canonical token CSS 对齐。
- **ASA-A-03-C03** — `Importing and refreshing; Writing a package`：文档列出 UI/CLI 的本地目录、GitHub 和 shadcn 导入，并要求新包记录来源、token 合约和可选实现/来源证据。

**限制：** 只读项目文档；没有检查实际包、运行守卫或对某品牌内容作真实性判断。文档提到的目录数与运行时行为是维护方声明。

**Derived grammar:** [Agent design resources](../../../../../kit/design/references/agent-design-resources.md) — ASA-G-AGENT-DESIGN-SYSTEM-CONTRACT / ASA-G-AGENT-COMPONENT-RETRIEVAL

**History:** [Research history](../CHANGELOG.md)

品牌归属边界：项目 README 的末尾 attribution 说明将 brand-reference packages 定位为审美灵感，而非官方品牌资产；其目录身份不构成品牌授权。
