# 可编辑原生 SVG · 研究与架构判断

本轮需要的是后续 Agent 能自主发现、选择、修改和组合的表达能力。SVG 的文件格式与可缩放性只解决一部分；可复用单位仍是一条可检验的构成关系，有身份的输入和编辑边界让它能在陌生内容上成立。文字转路径或用 SVG 包住整页图片会失去这种编辑能力。

已登记 44 项需求（22 独立、14 组合、8 暂不抽取），[绘制项目](../../../demos/editable-native-svg/README.md)提供合同、六组合成输入、反例、可视索引设计与五批 fresh Opus 工单。当前是 `registered / partial / candidate / normal`，没有新 SVG、视觉打样、Opus 调用或 Flash 消费。实际基线 `d4fd38765af52f6bd2b9ae422cf016ac0ad1ae96`；完整登记见 [intake](../../intake/editable-native-svg-20261004.json)。

## 既有成果的读取与图像观察

| ID | 实际读取的范围 | 本次能取用什么 / 边界 |
|---|---|---|
| L01 | [原子编排 README](../layout-specimens-20260927/README.md)、[局部筛选](../layout-specimens-20260927/review.md)、specimens 的 job/input_shape/avoid_when 字段、两张 Kit 优先卡；实际看 T05-c 宽屏、E06-b 窄屏、W03-b 窄屏截图 | 三张截图独立确认：T05-c 括线围条件块、目标靠标签表达；E06-b 同属性同时呈现多对象与缺失类型；W03-b 注释跟句后。取用关系、输入形状和反例，不重验 280 变体、旧算术或运行兼容性 |
| L02 | [A01 阅读关系入口](../design-grammar-atlas-20261002/a01-reading-relations/README.md)、Kit 问题地图与来路；实际看 span-375 | 窄屏把持续区间排成同尺段，长标题/正文仍保留。它不是本轮的原生 SVG 或通用时间件验收；其他 A01 输出未看 |
| L03 | 根 AGENTS/README，Kit Agent、Design 各相关入口、[共同工作语法](../../../kit/grammar/work.md)、[Reporting](../../../kit/reporting/grammar.md)、[展项](../../../kit/write/publish/exhibits.md)、Motion、Prose、文档/入账/参考治理与有效 ADR 索引及相关正文 | 真实任务系统覆盖发现、决定、实现、验收、推进、复盘与移交；对象/证据/规则/建议/决定/状态/事件独立。只读文字，不宣称业务系统已实现；本轮只修改发现链接，不迁移规则 |
| L04 | [视觉工场入口](../../../demos/visual-grammar/README.md)、wake/work-orders/demo、[A3 README](../../../demos/visual-grammar/a3-event-state-context/README.md)与 model.mjs 的 fold/BEATS、schema-gate fixture；实际看 A3 playback-28s | 拒绝仍是历史、候选不改状态、投影不删源字段适合做编辑与 Motion 不变量。看的是既有截图，不是本轮播放/视频解码；A3 按整体事项版本判旧上下文，不能替代材料独立版本测试 |
| L05 | 用户委托转述企业付款复核台作者回执 | 未提交、43 项通过、16 处修复、8 处留存及版本风险均为作者报告，未取得完整原件、路径或远端对应代码。只形成 F01/R17/R27 的合成风险要求，不独立确认数字、不修项目 |

五张实际查看的原图与 hash 在 intake 的 `images`；相对链接如下：[T05-c](../layout-specimens-20260927/checks/atoms__text-T05-c-1440.png)、[E06-b](../layout-specimens-20260927/checks/atoms__enum-E06-b-375.png)、[W03-b](../layout-specimens-20260927/checks/atoms__wayfinding-W03-b-375.png)、[A01 span](../design-grammar-atlas-20261002/a01-reading-relations/checks/span-375.png)、[A3 28 秒](../../../demos/visual-grammar/a3-event-state-context/evidence/playback-28s.png)。本轮不把历史制作方或 main 的看图/测试计为本次独立验收。

仓库未建立本任务专属 description/index/content 文件体系；实际采用 README、grammar、参考说明和 specimens.json 的渐进入口。未创建新的 taxonomy 平台。项目 `.agents/skills` 未找到，工作区 `.agents` 无技能目录；相关 writing skill 已读取并用于中文成文，不读取快照中的旧 skill 作为指令。

## 一手外部参考：文字与实现分开

每个 URL 独立登记，见 [18 条来源卡](../../provenance/editable-native-svg-20261004/cards/README.md) / [catalog](../../provenance/editable-native-svg-20261004/catalog.json)。15 个取得相关文字，1 个仅取得章节入口/目录，2 个访问失败；外部页面的实际图一张未看，未保存正文或 renderer 依赖，也未安装、运行、渲染这些库。

- S01–S03/S11：W3C [结构](https://www.w3.org/TR/SVG2/struct.html)、[文本](https://www.w3.org/TR/SVG2/text.html)、[处理模式](https://www.w3.org/TR/SVG2/conform.html)、[坐标](https://www.w3.org/TR/SVG2/coords.html)提供原生分组、文字、引用和坐标的机制。项目推断：语义输入应独立于这些底层节点，所有实例引用需要完整隔离；规范机制不等于浏览器/编辑器支持。S02 仅取得章节入口/目录，后续浏览展开失败；命令行对同一 URL 的只读 GET 被代理返回 403 Forbidden 后停止，没有重试、提升权限或绕过。关于具体文本布局未充分读取正文，不作为 API 或兼容性依据。
- S04：WAI [复杂图说明](https://www.w3.org/WAI/tutorials/images/complex/)支持短名称和能表达核心信息的长说明；结构化等效内容需保留关系和数据。项目要求：每个图形必须提供可消费文本，实际读屏留给作品验收。
- S05/S09/S10：D3 [shape](https://d3js.org/d3-shape)、[hierarchy](https://d3js.org/d3-hierarchy)、[scale](https://d3js.org/d3-scale)支持将输入、尺度、拓扑与几何生成分开。项目取用这种分工，不选曲线或图型、不安装 D3。
- S06：Plot 的 [Link mark](https://observablehq.github.io/plot/marks/link)展示同身份对象两个时点可用位置通道关联；只读说明与代码，不评价实际图。项目推断：同对象对应可成为编辑契约，关联仍需来源。
- S07：Graphviz 的 [SVG 输出](https://graphviz.org/docs/outputs/svg/)说明不同 renderer 输出可读/可转换 XML 的取舍。SVG 扩展名不能代替可编辑性检查。
- S08/S12：Mermaid [flowchart](https://mermaid.js.org/syntax/flowchart.html)与 [accessibility](https://mermaid.js.org/config/accessibility.html)提供关系 DSL 与 accTitle/accDescr 入口。可作为输入机制参考；不能把官方示例的 loose securityLevel 当安全默认。
- S13：Remotion [useCurrentFrame](https://www.remotion.dev/docs/use-current-frame)提供 frame 输入。项目沿用已有显式时间驱动/seek 的方向，Motion 只在有时间任务时适配。
- S14：D3 shape [LICENSE](https://github.com/d3/d3-shape/blob/main/LICENSE)文字为 ISC；适用范围只到这个访问时文件。其他库、数据、字体和具体复用提交许可尚未核查。
- S15/S16：官方 [模型配置](https://code.claude.com/docs/en/model-config) / [CLI](https://code.claude.com/docs/en/cli-reference)支持报告 `claude --model opus` 的新会话路径；本环境 PATH 未找到 CLI，未查认证或调用，详见 [启动交接](../../../demos/editable-native-svg/wake-opus.md)。

S17 的 Remotion `/docs/svg` 与 S18 的 Mermaid securityLevel schema 路径均返回 Internal Error，明确不支持 API/安全主张。重访在实际采用对应栈时触发，不凭 URL 猜规则，也不安装以绕过失败。网页可访问只支持该读取范围，外部源码与示例许可、浏览器差异、离线依赖、编辑器兼容均未验收。

## 架构落位与准入

需求和作品施工交接放 demos；外部与未消费材料的身份、摘要、来源缺口放 Vault。Kit 只在已有 Design 入口增加一条任务路由，未增加 SVG 规范或候选组件。依据为 [文档体例](../../../docs/architecture/documentation.md)、ADR-015/018 的构成关系与准入、ADR-017 的用途验收，以及 ADR-023/024 的产物文字分工。

知识条目需要必要性、入口、行为改变、边界和验证，不能套共享 runtime 的三个独立场景条件；共享运行组件仍遵守 ADR-002。此轮没有规范晋升，不创建新 ADR 把候选写成 accepted。后续 Opus 的具体参数、视觉语言和实现留项目；参考用途通过后按既有分支提炼一处，入口只链接它。

最小消费路径用现有 README 和 job/input_shape/use/avoid 的做法；[可视索引设计](../../../demos/editable-native-svg/discovery.md)要求真实预览、编辑边界、正常/压力/失败状态和等效文本，不先画占位图。Flash 用未见过内容验实际发现、选择、调整、组合，允许失败与拒用，不要求消融双盲，也不宣称效果合格。

## 可重访的缺口

Opus 尚未绘制；合同的参数界限、多实例兼容、长标签、读屏、打印、编辑器往返和 Motion 都待实际资产验证。作者付款回执缺完整原件，外部正文及 renderer 依赖未快照。本轮已有足够输入交 SVG-01，下一轮的扩张应由编辑/组合失败或未覆盖任务触发，不以穷举图型数量证明成熟。

## 现成 SVG 的补充盘点 · L06

Git 跟踪的独立 `.svg` 共 16 个，全部在 Vault 的本地快照：三份 CW recall、四份旧设计包图标、一份纸墨谱符号、八份 Tally 书稿图。完整路径在 intake 的 `existing_standalone_svg_inventory`。它们是来源资产，不是 Kit 的已验收组件。

本轮只读了 `cw-pages-recall-20260923/diagram.svg`、`pipeline.svg` 与 Tally 的 `fig02-authority.svg` 的 XML 源码与节点结构，没有看这三张实际图、渲染或运行编辑。不能从存在 text/path/ID 就宣称可参数化复用、编辑器兼容、许可已核或多实例安全。其余 13 个仅枚举文件身份，未消费，保留在 Vault。

A3 的 `src/index.tsx` 另读到原生 text/path 与固定 defs ID（grid、arrowS、arrowC），说明它有可编辑源码，也提醒同 DOM 多实例不能原样粘贴；本轮没有实际执行碰撞测试。旧编排实验是 HTML 内的 SVG/布局表达，不应与独立 SVG 文件数量混计。优先从这些成果的关系和失败边界取用，绘制时再决定适合拆出的源码范围与许可。
