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

先辨认要交给 agent 的是什么。设计系统包表达品牌与产品约束；组件 registry 分发实现；Skill 描述工作过程；MCP server 提供工具接口；adapter 连接已有 runtime。OpenDesign 将 functional Skill 与 design template 分置于不同目录/API，这些名称应按项目本义读取。

这里的 OpenDesign 指 `open-design.ai` 及其链接的 `nexu-io/open-design`；`opendesigner.io` 是另一个同名候选。需要指定产品时先核对身份，见下方逐源记录。

<a id="asa-g-agent-design-system-contract"></a>

## 设计系统包：把约束连接到实现

OpenDesign 的包格式以 `manifest.json` 声明身份与路径，`DESIGN.md` 解释设计规则，`tokens.css` 保存语义变量；可附用法、组件夹具、预览和派生映射。它提供一种连接文字、变量与代码的方式。项目的品牌参考包定位为审美灵感；正式品牌资产仍应从对应品牌来源取得。

可调的是语义 token、字级、间距关系、组件选择及状态。保持的是包身份、来源与变量名的对应，以及原始 token 到派生文件的可追踪关系。设计师决定例外、组件和样式取舍；包只把这些选择表达得更明确。

| 实现 | 适合的任务 | 取舍 |
|---|---|---|
| Markdown + CSS variables | 让 agent 阅读规则并应用主题变量 | 文件简单；组件合法变体仍需另行检查 |
| manifest + schema + component fixture/registry | 生成并核对共享组件与派生 token | 能检查路径、变量和状态；需维护生成链及依赖 |
| Figma design context | 读取实际画布中的 variables、components 和 layout | 保留设计文件语境；读取与写回是不同权限 |

**最小例子。** 为设置页定义 surface、text、border、focus、space、radius 六个语义 token，选两个真实组件，说明 default、disabled、focus 状态。manifest 指向来源，CSS 作为 token 唯一编辑位置，派生 JSON 与它对照。先看静态小样的信息层级，再检查组件状态和窄屏布局。

**失效情形。** 只有一句风格提示，没有变量和状态例子，agent 无法据此核对组件；原始 CSS 改了而派生表未改，两条实现路径会产生不同主题。下一步从 [系统](systems.md) 确定约束，再检查实际包的 token 编译、主题切换和组件契约。

<a id="asa-g-agent-component-retrieval"></a>

## 组件检索：从目录到明确的调用

shadcn registry 分发组件、hooks、页面与配置；MCP 用 `tools/list` 描述能力和输入，用 `tools/call` 发起请求；Figma 接口连接设计文件语境与画布操作。它们分别解决分发、调用和设计上下文的问题。

查询包含组件身份、variant、状态、框架和输出目标。结果须能回到组件版本、用法与依赖。读取资料与改变文件/画布分成两步，写入前先确定目标和影响。

| 路径 | 得到什么 | 主要代价 |
|---|---|---|
| 按需读取 Skill / Markdown | 过程说明与判断条件 | 文字可能陈旧，客户端支持需核对 |
| registry / CLI | 可编辑、可固定版本的源文件 | 检查安装差异、文件覆盖和依赖 |
| 本地或远程 MCP | 按 schema 查询工具、组件或实时设计数据 | 核对服务端、客户端、账号范围及读写能力 |
| native agent adapter | 复用已有 CLI 的会话与调用 | 每种 CLI 的流格式、工作目录和权限契约不同 |

**最小例子。** 要给设置页加日期选择器，先检索 `DatePicker` 及目标框架，再读 token 与 disabled/error 例子，核对版本、许可和依赖后形成安装差异。若组件来自 Figma，先读选中 frame 与绑定组件；需要回写时单独确认目标和变更。

**失效情形。** 同名 Card 可能属于不同框架；只按名称复制会遗漏依赖和状态。工具宣称只读也不能替代检查实际行为。下一步从 [标本](specimens.md) 或 [界面](interface.md) 找到实现，沿 [阅读来源](reading-sources.md) 回查具体文档；集成检查范围见 [来源生态](../../../vault/provenance/art-software-atlas/ecosystem/README.md)。

来源卡与直接依据： [ASA-A-01 product site](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-01-opendesign-site.md)、[ASA-A-02 repository](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-02-opendesign-repository.md)、[ASA-A-03 package contract](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-03-opendesign-design-systems.md)、[ASA-A-04 skills protocol](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-04-opendesign-skills-protocol.md)、[ASA-A-05 runtime adapters](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-05-opendesign-agent-adapters.md)、[ASA-A-06 distinct-name candidate](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-06-opendesigner-candidate.md)、[D01 Agent Skills](../../../vault/provenance/design-grammar-atlas-20261002/cards/d01-agent-skills-specification.md)、[ASA-A-08 MCP tools](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-08-mcp-tools-spec.md)、[ASA-A-09 shadcn registry](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-09-shadcn-registry.md)、[ASA-A-10 Figma MCP](../../../vault/provenance/art-software-atlas/ecosystem/cards/asa-a-10-figma-mcp.md)。来源证据限于文本读取；无 demo 执行、代码检查或视觉审阅。
