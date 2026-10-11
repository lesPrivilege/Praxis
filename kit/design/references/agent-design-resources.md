---
kind: reference-grammar
status: reference
reference_priority: normal
grammar_ids:
  - ASA-G-AGENT-DESIGN-SYSTEM-CONTRACT
  - ASA-G-AGENT-COMPONENT-RETRIEVAL
source_stream: vault/provenance/art-software-atlas/ecosystem/catalog.json
---

# 面向 agent 的设计资源

`ASA-A` 卡片记录设计系统、组件目录、agent 工作流和设计工具接入的官方材料。它们补充现有设计语义分支，不替代 [设计语法入口](../grammar.md) 与 [普通参考索引](README.md)。先保留来源自己的分类：OpenDesign 的 **functional Skill** 和 **design template** 是不同目录/API；**design-system package** 描述品牌/产品约束；**plugin** 是分发容器；**agent adapter** 接入 CLI runtime；**MCP server** 按工具 schema 提供读写能力。它们不是同一层级的设计分类。OpenDesign 包文档还把品牌参考包定位为审美灵感，不能视为相关品牌的官方资产或授权设计系统；具体品牌资源须另核来源和权利。

| 既有任务分类 | 可接入的新入口 | 适用问题 | 主要边界 |
|---|---|---|---|
| [系统](systems.md)、[界面](interface.md)、[语言](languages.md) | `DESIGN.md` + `manifest.json` + semantic token CSS；可含 component fixture、usage 与 provenance | 项目已有系统约束，需让 agent 按品牌变量和组件契约生成 | 文档是指导与索引；除非有实际组件代码和校验器，不代表运行时合规 |
| [标本](specimens.md)、[组成](composition.md) | 明确身份的可安装组件 registry 或 live Figma component | 需要可执行组件、页面片段或画布对象 | snippet 可携带依赖/副作用；Figma 写入与导出须检查权限和上下文 |
| [阅读来源](reading-sources.md) | Agent Skill 的 `SKILL.md` 工作流 | 需要稳定、可渐进加载的过程知识或操作规则 | skill 规范不等于客户端支持保证；instruction 本身不是可复用实现代码 |
| [界面](interface.md)、[系统](systems.md) | MCP `tools/list` / `tools/call` 或供应商 native runtime | 需要从 agent 读取实时设计数据、搜索或执行编辑 | 声明工具不证明安全；应检查输入 schema、权限、批准界面、网络目的地与结果 |

<a id="asa-g-agent-design-system-contract"></a>

## ASA-G-AGENT-DESIGN-SYSTEM-CONTRACT · 设计系统包作为可读契约与可编译 token 来源

- **来源语境与原术语：** OpenDesign 包格式用 `manifest.json` 做身份、provenance 与路径声明，以 `DESIGN.md` 表达 agent 可读的 design prose，以 `tokens.css` 表达 semantic token stylesheet；可选 `USAGE.md`、组件 fixture、预览、资产、字体、源码证据、派生 JSON/Tailwind 映射。[ASA-A-03](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-03-opendesign-design-systems.md) 与 [仓库总览 ASA-A-02](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-02-opendesign-repository.md) 是项目方说明，非格式普遍标准。`opendesigner.io` 同样自称 Open Design，但身份不同且未确认为用户所指，见 [ASA-A-06](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-06-opendesigner-candidate.md)。
- **设计意图：** 将品牌语言转为可以阅读、引用、编译和校验的跨工具约束；由设计师保留目标、例外、风格和组件取舍。翻译是本 Kit 推断，不表示不同产品/品牌语境等价。
- **可操控操作与不变量：** 设计师可改语义 token、类型比例、间距关系、组件选择/状态、使用与反例规则；维护身份、来源、版本、变量名与执行资产之间的明确映射。派生文件必须标注来源并能校验一致性；资源目录存在不等于可用或获准复制。
- **实现选择：** (1) Markdown + CSS variables：可直接读、简单导入、易版本控制；对组件 API/合法变体校验较弱。适合纯视觉规范。 (2) 加 JSON manifest、schema 与组件 fixture/registry：可发现、生成和校验路径/变量/组件，但要维护生成链、依赖与权利元数据。适合有实际共享组件的产品。 (3) Figma MCP：可按需提取真实 variables/components/layout，并可能写回画布；依赖账号/客户端/远程 endpoint 权限，不是本地 token 文件的替代品。[ASA-A-10](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-10-figma-mcp.md)
- **已检查例子：** OpenDesign `od-design-system-project/v1` package minimum: `manifest.json` + `DESIGN.md` + `tokens.css`；文档举出的 `manifest.id` 与目录 slug 对齐规则、以及 token JSON/Tailwind 派生校验为具体格式实例。[ASA-A-03，Manifest and catalog behavior / Rich package files](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-03-opendesign-design-systems.md)；shadcn registry introduction 明确将组件、hooks、pages、config、rules 作为可分发代码目录，而非纯视觉规范。[ASA-A-09](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-09-shadcn-registry.md)
- **构造性 fixture：** 为一个设置页写 6 个语义 token（surface、text、border、focus、space、radius），选 2 个真实组件，说明 default/disabled/focus 三种状态及禁止事项；manifest 指向原始来源，CSS 是 token 唯一来源，再生成一份结构化索引并对照检查。先用静态小样检查信息层级，之后接入共享组件验证状态与窄屏行为。
- **失败与反例：** 只有一张“设计风格 prompt”或 `DESIGN.md` 名称，却无 tokens、例子、约束、来源或版本；导入一个 registry snippet 后覆盖本地代码但没读其依赖/许可；把某个 vendor 样式当通用视觉规则；把 Figma MCP 远程访问误当本机已授权。
- **相邻研究：** 查看具体 design-system 的包和代码许可、token 编译/主题切换、组件状态/a11y 测试、Figma Code Connect 的映射维护与 remote MCP 权限说明。具体 SaaS 品牌包应回到对应品牌的一手 system 文档与代码，不从聚合列表推断品质。

<a id="asa-g-agent-component-retrieval"></a>

## ASA-G-AGENT-COMPONENT-RETRIEVAL · 从目录查找组件到 agent 调用/写入

- **来源语境与原术语：** shadcn/ui 叫 `registry` 的代码分发系统；MCP 定义 tools 和 JSON Schema；Figma MCP 暴露 design context 与 canvas 写入；OpenDesign 把 `Skill` 作为功能能力、把 `design template` 作为可渲染目录项，并以 `agent adapter` 启动已有 CLI。保留这些不同层次，不把每个 agent-visible 文件都叫“skill”。[ASA-A-04](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-04-opendesign-skills-protocol.md)、[ASA-A-08](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-08-mcp-tools-spec.md)。
- **设计意图：** 让 agent 针对当前工作请求精确组件、token 或画布数据，带回足够来源和用法上下文，并在有权限的情况下执行明确动作。降低臆造 API 的概率，保留设计师对采用和修改的决定权。本翻译不声称 agent 输出必然更准确。
- **可操控操作与不变量：** 先发现能力，再提供最小化查询（名称、variant、状态、框架、输出目标）；读取结果时携带源组件身份、版本、依赖、授权、局限。只读检索与写入分开标注；写操作显示目标、参数和影响，验证结果后再继续。MCP 的工具描述/注释也按不可信输入看待。
- **实现选择：** (1) 按需读 `SKILL.md`/Markdown：零常驻工具权限、可渐进加载；但信息可能陈旧，应用端需人工解析或调用模型文本上下文。[D01 Agent Skills specification](../../../vault/provenance/design-grammar-atlas-20261002/cards/d01-agent-skills-specification.md) (2) registry/CLI 拉取组件源文件：可拿到可编辑实现、可固定版本；引入包执行/文件覆盖、依赖树和 license 审核责任，先以 dry run、隔离分支和差异预览控制。[ASA-A-09] (3) 本地 stdio MCP：与本机 agent 工具集成，适用于查询本地 catalog；仍需检查 server binary/npm 包、运行权限和工具范围。 (4) 远程 MCP：共享服务可直接给实时 Figma 数据并写回；需控制账号授权、传输数据、支持客户端、敏感工具确认和审计。[ASA-A-08][ASA-A-10] (5) Native agent runtime adapter：可复用用户现有 CLI 的权限与会话机制，代价是每种 CLI 的调用、流格式、工作目录与安全契约要维护；不能只凭 adapter 文档认定权限隔离正确。[ASA-A-05](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-05-opendesign-agent-adapters.md)
- **已检查例子：** MCP tools 先通过 `tools/list` 发现 `inputSchema`，再以 `tools/call` 请求；协议建议敏感调用前向用户显示参数并确认。[ASA-A-08，User Interaction Model / Security Considerations]；Figma 文档描述 selection-based frame-to-code、上下文读取和 native canvas 写入，并要求在 catalog 列出的 client 上连接。[ASA-A-10，Introduction / How to connect]。这些是协议/厂商文档里的路径，不是本轮运行验证。
- **构造性 fixture：** 对“在设置页添加可访问的日期选择器”任务，先在仓库查组件 registry 的 `DatePicker` 与支持框架，再读取本地组件文档、token 和 `disabled/error` 示例；确认版本、许可证和依赖后才建议实现。若须从 Figma 导入，先读取选中 frame 与绑定组件，不授予画布写入；若明确要回写，展示目标文件和变更摘要，再按实际 client 权限请求批准。
- **失败与反例：** 目录命中一个名字相同的 Card 就直接复制，漏看框架、依赖和源许可；MCP tool schema 标了只读但实现会发出外部写入；无确认批量修改画布；将“仓库支持 Codex/Claude/Cursor”误当该用户当前连接已配置；把 `SKILL.md` 指令按代码依赖来安装执行。
- **相邻研究：** 逐个核验 registry 的 lock/version、安装 diff 和回滚机制，比较 MCP client 批准 UI 与审计、远程端授权范围，读取真实 SaaS design system 的 component API 与源码 license。可补看 Storybook component context、Figma Code Connect、官方 `design.md` 生态的 schema；先按源身份确认，再决定是否入账。

## 发现入口与回查

- 找某类交互组件的可用实现：从 [标本](specimens.md)、[界面](interface.md) 进入对应 registry 或厂商组件文档，再按 ASA-G-AGENT-COMPONENT-RETRIEVAL 核查。
- 将已有品牌规则交给 agent：从 [系统](systems.md)、[语言](languages.md) 进入设计系统包，再按 ASA-G-AGENT-DESIGN-SYSTEM-CONTRACT 查 manifest、token、fixture 与 provenance。
- 需要流程类指导：看 Agent Skills 文件格式，但先判断任务需要可加载的 instruction、可执行组件，还是只需视觉参考；不要一律包装成 Skill。
- 需要读写 SaaS 设计文件：读具体供应商的 MCP/开发者文档，再查账号范围、工具 schema、客户端批准和数据路由；本页不提供集成配置或授权。

来源卡与直接依据： [ASA-A-01 product site](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-01-opendesign-site.md)、[ASA-A-02 repository](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-02-opendesign-repository.md)、[ASA-A-03 package contract](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-03-opendesign-design-systems.md)、[ASA-A-04 skills protocol](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-04-opendesign-skills-protocol.md)、[ASA-A-05 runtime adapters](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-05-opendesign-agent-adapters.md)、[ASA-A-06 distinct-name candidate](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-06-opendesigner-candidate.md)、[D01 Agent Skills](../../../vault/provenance/design-grammar-atlas-20261002/cards/d01-agent-skills-specification.md)、[ASA-A-08 MCP tools](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-08-mcp-tools-spec.md)、[ASA-A-09 shadcn registry](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-09-shadcn-registry.md)、[ASA-A-10 Figma MCP](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-10-figma-mcp.md)。来源证据限于文本读取；无 demo 执行、代码检查或视觉审阅。
