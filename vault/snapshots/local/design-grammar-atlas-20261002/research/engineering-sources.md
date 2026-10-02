# 工程与原作者来源 ledger

description：仅当需要核对组合、测试、token、动效或材质的具体断言时，从 [研究索引](RESEARCH_MAP.md) 按编号查对应来源；不是必读书单。

读取日期：2026-10-02（UTC）。范围：原子方法、组合关系、状态测试、token 交换、动效与材质的可复用边界。

## 检索与阅读口径

- Exa 搜索 7 次，每次请求 5 个结果；**检索候选预算合计 35**
- 35 不是 35 个独立来源，也不是全文读过 35 页；包含同源镜像、重复及未采用结果
- 实际 Exa fetch 并读取相关正文的 **独立页面 12 个**；长文按相关段落阅读，不宣称每页逐字读完
- 其中 **2 个页面另用 dot 云端浏览器核图**：Every Layout Composition、Apple Materials。未操作用户电脑
- 下表 12 条均为原作者/规范制定者/官方维护团队发布。没有依赖二手风格盘点、Pinterest、SEO 聚合或未经读取的结果摘要
- 只读来源并制作研究 Markdown；没有生成运行demo或修改产品repo

### 搜索记录

| 轮次 | 角度 | numResults |
|---|---|---:|
| Q1 | Brad Frost 原书，非线性 Atomic Design 与真实内容验证 | 5 |
| Q2 | Storybook story、args、composition 与各类测试官方文档 | 5 |
| Q3 | DTCG format、alias、group 与 composite type | 5 |
| Q4 | Carbon/IBM 原动效系统、目的与 reduced-motion 关系 | 5 |
| Q5 | Every Layout 原作者 Sidebar 与 composition | 5 |
| Q6 | Apple HIG 材质、语义与可读性 | 5 |
| Q7 | DTCG 2025.10 的 canonical URL、版本与标准地位核验 | 5 |
| **合计** | 搜索请求结果量，不与实际读页混用 | **35** |

## E01 · Brad Frost — Atomic Design Methodology

- 出处：[Atomic Design，第 2 章](https://atomicdesign.bradfrost.com/chapter-2/)
- 质量观察：方法提出者原书；有部分与整体、真实内容反向校正的解释，明确反对线性解读
- 已读：五阶段、templates/pages、部分与整体、真实内容验证等相关正文；2026-10-02
- 支持：拆解与组合可以来回进行；真实代表内容是验证界面系统的一环；孤立元素不足以证明整体成立
- 不支持：所有设计必须采用这五类；atom 必须等于 token；先完成全部 atoms 才能做整体；一次页面成功证明通用性
- 可转样例：同一个内容 fixture 在整体中暴露某局部关系失败，再回到关系登记修订
- 授权边界：本包仅摘要与链接；未核验原书插图/代码的再分发许可，不复制整章或打包原图
- 看图：未实际查看本章原图；不据此评价图中作品的美感

## E02 · Storybook — How to write stories

- 出处：[官方 stories 文档](https://storybook.js.org/docs/writing-stories)
- 质量观察：实现与格式维护团队文档，带 CSF、args、render、decorators 和子 story 复用实例
- 已读：story 定义、args、组合复用、play、环境 decorator 和多组件局限；2026-10-02
- 支持：同一组件可以有多个状态 story；输入、上下文与渲染应显式；子样本数据能在组合中复用
- 不支持：story 就是 grammar；CSF 天然跨所有框架无损运行；每个可变参数都必须生成独立 demo
- 可转样例：同一关系使用普通/长内容和指定上下文，保留输入可追溯性；工具并非必须选 Storybook
- 授权边界：可借鉴测试组织方法；本包无源代码拷贝。后续采用具体包时另核验版本与许可证
- 看图：未看；正文/代码结构证据，不作视觉评价

## E03 · Storybook — Interaction tests

- 出处：[官方交互测试](https://storybook.js.org/docs/writing-tests/interaction-testing)
- 质量观察：测试功能维护团队文档，解释初始 state/context、模拟行为与 end-result assertions
- 已读：play、canvas、query 优先级、userEvent、expect、mock 初始条件；2026-10-02
- 支持：状态轨迹能成为样例证据；优先用角色与可访问标签寻找元素，降低纯测试 ID 与真实使用脱节
- 不支持：交互断言能评判 taste；测试环境与真实设备完全等价；截图就能证明取消/焦点/异步行为
- 可转样例：触发→反馈→完成/错误→取消的一条有目的轨迹，另验证内容和语义不变
- 授权边界：本轮不安装、执行或连接 CI；不把文档里的测试代码当已运行结果
- 看图：未看；仅正文和代码方法

## E04 · Storybook — Accessibility tests

- 出处：[官方可访问性测试](https://storybook.js.org/docs/writing-tests/accessibility-testing)
- 质量观察：官方说明 axe-core 启发式检查、自动/手动结果与规则配置；也有安装推广，不能将功能介绍当完整合规证明
- 已读：检查范围、violations/passes/incomplete、默认规则和测试行为；2026-10-02
- 支持：自动检查有盲区；incomplete 需要人工确认；测试语境与规则范围应显式
- 不支持：自动通过代表 WCAG 全面合规；自动捕获比例适用于所有应用；可访问性可用一个最终分数表达
- 可转样例：同一 specimen 同时保留自动扫描结果与手工键盘/阅读验证；反例作为明确的失败教材隔离
- 授权边界：未安装 addon；不就司法辖区作法律合规保证
- 看图：未看；只采用测试范围说明

## E05 · DTCG — Design Tokens Format Module 2025.10

- 出处：[2025.10 Format](https://www.designtokens.org/TR/2025.10/format/)
- 质量观察：Design Tokens Community Group 的正式报告，直接规定交换格式、类型、分组与弃用；规范性条文与示例需区分
- 已读：status、术语、token/composite、JSON/type、groups、扩展与弃用等相关段落；2026-10-02
- 支持：token 交换可保留命名、值、类型和说明；复合 token 能表达一起使用的一组值；group 不应被工具用来推断用途；弃用应可说明原因
- 不支持：它是 W3C Standard；它已定义 Atlas grammar、profile 或 recipe；分组名称就等于语义；一个 token 树能完整表达构成意图
- 可转样例：把已确定的实现值导出为 token；关系登记保持独立，仅引用对应值，不把未定 taste 提前变成 token 合同
- 授权边界：本包引用规范内容、不宣称已实现符合性；具体实现、翻译或再分发需按规范与代码各自许可处理
- 看图：无图像判断；规范正文

## E06 · DTCG — Design Tokens Resolver Module 2025.10

- 出处：[2025.10 Resolver](https://www.designtokens.org/TR/2025.10/resolver/)
- 质量观察：同一标准制定社区的多上下文解析规范，明确组合爆炸、ordering 与 alias 解析次序
- 已读：context/permutation/orthogonality、sets/modifiers、resolutionOrder、inputs、解析逻辑；2026-10-02
- 支持：主题、尺寸、辅助模式等上下文可独立描述；覆盖顺序需显式；尽量正交能减小理解与组合负担
- 不支持：所有 modifier 都互不重叠；profile 可直接等同 resolver context；穷举所有排列是最佳视觉研究策略
- 可转样例：已确定实现后的 light/dark/reduced-motion 上下文解析验证；研究阶段只借用显式上下文与避免组合爆炸的思路
- 授权边界：不是 W3C Standard；本轮不新增 resolver 或持续访问配置
- 看图：无图像判断；规范正文

## E07 · Heydon Pickering & Andy Bell — Composition

- 出处：[Every Layout: Composition](https://every-layout.dev/rudiments/composition/)
- 质量观察：布局方法作者的公开原文，有具体拆解及跨对象组合示意，并承认其 primitives 不覆盖字面上的一切布局
- 已读：composition over inheritance、layout primitives、intrinsic responsiveness；2026-10-02
- 支持：局部关系职责可在不同语义对象中重新组织；dialog 不必被当作独占其所有布局规则的大包
- 不支持：必须改用作者的 custom elements；所有布局都无需任何 media/container queries；组合能替代内容语义或保证 taste
- 可转样例：以同一组关系服务信息区与静态演示，比较哪些关系保留、哪些需重写
- 授权边界：仅摘要与链接；未提取付费下载、复制作者整套实现或再分发插图
- 看图：**已在云端浏览器实看**。完整看到 dialog 的 Center/Stack/Box/Cluster 标注、form 的嵌套 Stack/Box/Cluster；也看了 slide 图的局部与 Sidebar/Cover 标注。图支持“同类关系被重新组织”，不支持无损跨媒介或好 taste 的一般化

## E08 · Heydon Pickering & Andy Bell — The Sidebar

- 出处：[Every Layout: Sidebar](https://every-layout.dev/layouts/sidebar/)
- 质量观察：原作者给出问题、算法思路、CSS 示例与用途；页面含对 container queries 的历史性措辞，不能作为今日浏览器支持结论
- 已读：问题、solution、gutter、intrinsic width、用途与 API；2026-10-02
- 支持：可用容器空间和内容需要比设备名单更能说明邻接/换行关系；同一关系可用于媒体说明或输入与操作的排列
- 不支持：文中数值是唯一正确默认；现代 container queries 尚不支持；所有二维内容应自动堆叠
- 可转样例：同一 fixture 放入宽窄容器，测试主辅关系与顺序，而非比较品牌色
- 授权边界：未下载 component；独立实现前需另核验代码许可，不能把公开可读当可整包复制
- 看图：未实际打开本页图像；采用正文算法说明

## E09 · IBM Carbon — Motion overview

- 出处：[Carbon Motion](https://carbondesignsystem.com/elements/motion/overview/)
- 质量观察：系统所有者的工程/设计指导，有状态、编排、时长、评估及静态替代；属于特定品牌系统而非普适感知规律
- 已读：productive/expressive、整体编排责任、easing、duration、策略与 adaptive interface；2026-10-02
- 支持：动作目的、对象关系和状态含义比统一曲线更完整；重要时刻与日常反馈可有不同表达；应存在减少运动的等价沟通
- 不支持：Carbon 的曲线/时长/禁止弹跳适合所有 profile；“动态时长 upcoming”措辞证明当前版本已实现；静态图足以证明动效质量
- 可转样例：同一状态轨迹作两种有不同目的的节奏解释，并有静态替代和中断路径
- 授权边界：未安装 @carbon/motion、未复刻 IBM 品牌资产；未来采用其包需核验版本与包许可
- 看图：**未观看动画或视频**；仅据原文登记动效关系，不声称实测其流畅、手感或速度

## E10 · Apple — Materials

- 出处：[Apple Human Interface Guidelines: Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- 质量观察：平台所有者文档，明确用途、功能/内容层、系统设置、平台差异及错误例；不等于跨平台测试结果
- 已读：Liquid Glass、standard materials、语义选择、对比度、平台差异；2026-10-02
- 支持：材质服务层级与上下文；背景与前景耦合；选择应考虑语义和系统变化，而不只看一帧颜色
- 不支持：CSS blur 能得到原生 Liquid Glass 的适配保证；透明必然优于不透明；Apple 的所有平台建议可直接用于网页或印刷
- 可转样例：相同内容/轮廓在不同背景上的前景辨认；比较有材质与无材质的关系实现
- 授权边界：未下载 Apple 资产、SF Symbols 或系统材质实现；引用设计问题，不把品牌图像当可自由再发布素材
- 看图：**已在云端浏览器实看** Standard materials 的 share 符号并列反例/正例。相近材质与背景中，左侧淡符号更难辨认，右侧深符号较清楚；这只是该示意图的观察，未测量对比度比值，也未验证真实设备或动态效果

## E11 · W3C WAI — Understanding Reflow (WCAG 2.2)

- 出处：[Understanding SC 1.4.10: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- 质量观察：W3C WAI 对成功标准的官方解释，清楚区分一般内容与必要二维布局的例外；Understanding 文档本身是解释性材料
- 已读：SC、intent、basic text reflow、二维关系及例外范围；2026-10-02
- 支持：非例外内容应在相关条件下保留信息和功能；必要二维内容的例外不自动扩展到整页；不是所有内容都必须一列
- 不支持：一个截图或 overflow 检查证明完整合规；固定画布媒介必须采用同样网页行为；任何 data table 周边内容都自动豁免
- 可转样例：长文本和窄容器的内容韧性检查；二维例外显式登记为 scope
- 授权边界：仅引用适用条件，不做法律合规认证；不使用本文示例图作新作品资产
- 看图：未实看示例截图；本包不对其视觉作独立断言

## E12 · Storybook — Visual tests

- 出处：[官方视觉测试](https://storybook.js.org/docs/writing-tests/visual-testing)
- 质量观察：维护团队的功能文档，但推荐的是同团队商业服务 Chromatic；采纳机制说明，不采纳“最有效”等营销比较作为研究结论
- 已读：baseline、差异 review、人工接受、CI、像素与 markup snapshot 区别；2026-10-02
- 支持：视觉差异需要判断，接受的基线会影响以后回归；视觉测试与 markup snapshot 不是同一证据
- 不支持：无差异就无 UX bug；基线有审美权威；必须使用 Chromatic；本包已获私有数据上传许可
- 可转样例：实现后为已认可状态保留基线，变化需说明原因，并单独保留语义/状态测试
- 授权边界：文档明确云端抓取/比较 stories 的流程；本轮未创建账户、上传 stories、授予访问或购买服务
- 看图：未看工具演示图；只采用工作流说明

## 采用与未采用的边界

- 本文的晋升规则、稀疏矩阵、六类对象关系和 Opus 自由度是**可选校订提案**，不是上述作者联合认可的框架，也不构成 schema 或待执行 eval
- 工程标准只能支持其定义范围。DTCG 的值互操作、Storybook 的状态测试、WCAG 的可访问性目标，与审美/历史解释分别保留
- 原图可读不意味着获得素材再分发或商标使用许可。本轮没有打包源站图片；后续若要带原图交付，先核验授权方式
- 未看动画不以摘要或截图冒充动态观察。所有未来 demo、测试通过和跨媒介成功均仍待 Opus 实作与评审
