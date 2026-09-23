# AI 能力测试视觉参考索引

状态：Luna 有界只读召回，2026-09-23。本文只登记可供后续页面工单消费的参考，不生成页面，不改变来源仓库，也不替 main 编写 Claude 工单。

## 召回边界与覆盖

本次视觉召回围绕五个明确用途展开：Q4 的概率分布、均值与严重尾部交互；Q3 的 `unknown` 状态与回放；Q5 的原子 diff 与反事实矩阵；统一入口的长文导览；以及静态打印。主结论仍来自 [交付蓝图](delivery-plan.md) 和 [回答母稿](answer-draft.md)：首版只有 Q4 的分布演示需要交互，Q3 与 Q5 以可打印的静态工件承载判断。

已消费的本 kit 入口和提炼包括 [Reporting README](../../../kit/reporting/README.md)、[能力测试回答体例](../../../kit/reporting/assessment-answer-profile.md)、[Visual Grammar、Renderer 与 Review](../reporting/visual-renderer-review.md)、[本地设计提炼](../reporting/local-design.md) 和 [Downloads 依赖清单](../reporting/downloads.md)。career-kit 的本地快照登记为 6 个图式库入口文件，本文实际定向读取 README、图式目录、绘制规范、视觉记号和图式样张；其余 career-kit 内容没有扩大消费。

Courtwork 的 [local-projects 登记](../../intake/local-projects.json) 给出的原仓库路径是 `/Users/lesprivilege/Projects/Courtwork`，快照共 219 个文件、1,757,666 bytes，原仓库只读。本文定向读取其设计总纲、数据可视化、状态/投影契约、阅读与输出边界、表面层级和完成面等入口；manifest 标为 `deep_read` 的核心文件与 `indexed` 的目录级文件保持区分，没有把目录级索引当作逐件验证。

当前 Courtwork 源仓库在 `59f50e09beb8d4fa43fbc0878a49979900b26f91`。本次只读检查发现 `engineering/design/visual-spatial-grammar.md`、`engineering/design/grammar-convergence-20260921/` 和 `engineering/design/role-composer-20260922/` 不在既有快照中；其中前两项与本任务相关，保留在文末的“未快照增量”中。当前源文件没有复制进 vault，原仓库的 AGENTS/Skill 只作为来源材料。

## 参考裁取

### V-01 · Reporting 的语义视觉词汇

来源是本 kit 的 [Visual Grammar、Renderer 与 Review](../reporting/visual-renderer-review.md) 与 [本地设计提炼](../reporting/local-design.md)。它们把选择顺序固定为“语义问题 → visual primitive → annotation → provenance → renderer”，并把 Table、Chart、Diagram、Card 分别限制在查数、观察数量关系、表达结构/流转、承载独立工作对象的范围内。页面 review 依次检查故事线、claim/evidence、去色层级、真实渲染、表面适配、长文/错误/空态和反 slop。

可借用的元素是一个共享的 `claim / evidence / visual` 内容模型，以及每个展项都带单位、分母、基准、状态、版本和来源的约束。Q4 的图和表应表达同一组分布；Q3 的状态图只表达真实状态转换；Q5 的矩阵承担精确比较，正文承担判断。

不能照搬的是候选 renderer contract、页面比例、容器阴影、具体 token 或某个产品的组件命名。它们是本 kit 的候选治理提炼，不能单独证明浏览器或打印实现已经通过。

依赖与状态：无运行时依赖；本地设计快照、reporting 提炼和 career-kit 规则已入账，renderer contract 仍是候选，页面实现与真实渲染尚未执行。

最小实施：为每个视觉块保留 `question`、`data`、`state`、`source`、`unit` 五类字段；先复用表格与静态标注，只有 Q4 增加一个改变分布的控件。

### V-02 · career-kit 图式目录、矩阵骨架与打印样张

原路径：`/Users/lesprivilege/Projects/career-kit/10-Vault/地基/企业汇报图式库/README.md`、`图式目录.md`、`绘制规范.md`、`视觉记号.md`、`图式样张.html`。

本 kit 快照：[`README.md`](../../snapshots/local/career-kit/10-Vault/地基/企业汇报图式库/README.md)、[`图式目录.md`](../../snapshots/local/career-kit/10-Vault/地基/企业汇报图式库/图式目录.md)、[`绘制规范.md`](../../snapshots/local/career-kit/10-Vault/地基/企业汇报图式库/绘制规范.md)、[`视觉记号.md`](../../snapshots/local/career-kit/10-Vault/地基/企业汇报图式库/视觉记号.md)、[`图式样张.html`](../../snapshots/local/career-kit/10-Vault/地基/企业汇报图式库/图式样张.html)。快照状态为本地只读深读，样张是几何与打印参考，不是本题数据。

可借用的元素是 `Slide Job → Exhibit Family → Container → Notation` 的选择次序、L0–L4 层级、Q5 可用的方案矩阵结构，以及“主展项 + 证据/口径 + 来源元数据”的三层关系。样张还提供了一个自足 HTML 的总览、单页查看、灰阶/标题/眯眼/墨线检查与打印分离方式；打印规则以 `@media print` 隐藏操作栏，把每一页放入固定打印页。

不能照搬的是样张的占位文案、1600×900 舞台、13.333×7.5 英寸页面、深蓝灰色主题、九页 deck 结构和 `window.print()` 之外的控制台。Q4 的概率分布不能被改成普通 KPI 柱图；Q5 的行列必须来自题目中的原子变更与适用范围。

依赖与状态：样张的 CSS/JS 内联，未发现运行所需的外部包；打印规则只在快照文本中确认，未在本任务重新启动浏览器或打印引擎。它适合贡献页面几何和静态打印思路，不提供招聘答卷的事实。

最小实施：Q5 使用一个不嵌套 Card 的 `Frame + Table`，表下保留一条待决/证据说明；导览页按 L1 标题、L2 主展项、L3 解释、L4 来源组织。打印版隐藏导航和控件，保留全文、表格、状态和来源，不强制使用 deck 的固定比例。

### V-03 · Courtwork 数据可视化的分布、缺失与精确值处理

原路径：`/Users/lesprivilege/Projects/Courtwork/engineering/design/home-composition-2026-09-10/data-visualization.md`。

本 kit 快照：[`data-visualization.md`](../../snapshots/local/courtwork/engineering/design/home-composition-2026-09-10/data-visualization.md)。它是 2026-09-10 的设计/数据接缝提炼，快照来源中记录为设计候选与实现边界，不是已交付图表。

可借用的元素是重尾数据先比较分位数和 `log1p` 的思路、缺失值保持独立文字/纹理状态、图形旁保留精确值表、同一组数据使用稳定尺度和排序、键盘/触摸检查取得日期、指标、值、时区与 reporting status。它还明确区分 recorded Runs、usage totals、cache 字段、unknown identity 和 partial coverage，避免以图形填补数据契约。

对 Q4 的直接落点是：用两组已确定的合成概率向量作为初始状态，图形显示各等级概率，旁边同步显示期望值与 `P(level ≥ 2)`，再显示明确标注为合成演示的动作结果。滑块或键盘只改变概率向量；派生数字由确定性代码计算，概率总和与非负性在输入层校验。关闭交互时，两组预设和对应数字仍完整可读。

不能照搬的是 Courtwork 的 Usage 端点、Run 计数、UTC 天区间、heatmap 等值分级、模型分组、`Other` 规则或任何现有产品文案。Q4 不是 Usage 数据，不能把合成向量画成真实校准曲线、业务命中率或生产阈值。

依赖与状态：所需 Q4 数据可由本题母稿内的人工构造例子提供，无需后端或 chart library；Courtwork 的后端投影、heatmap 和模型 drilldown 在原材料中均有前置契约，不能在本页面工单中补造。

最小实施：一张水平分布图、一张精确值表和一个派生指标区即可。预设 A 固定呈现 `0 / 0.01 / 0.99 / 0`、`1.99`、`99%`；预设 B 固定呈现 `0.5 / 0 / 0 / 0.5`、`1.50`、`50%`。动作标签只从母稿定义的 `allow / review / deny / unknown` 中选择，并显示前置条件未完成时的 `unknown`。

### V-04 · Courtwork 的 unknown、状态投影与回放连续性

原路径：`/Users/lesprivilege/Projects/Courtwork/engineering/mvp/execution/work-surface-kit/contracts/review-projection.md`、`ui-state-vocabulary.md`、`primitive-canon.md`、`/Users/lesprivilege/Projects/Courtwork/docs/ui-composition.md`。

本 kit 快照：[`review-projection.md`](../../snapshots/local/courtwork/engineering/mvp/execution/work-surface-kit/contracts/review-projection.md)、[`ui-state-vocabulary.md`](../../snapshots/local/courtwork/engineering/mvp/execution/work-surface-kit/contracts/ui-state-vocabulary.md)、[`primitive-canon.md`](../../snapshots/local/courtwork/engineering/mvp/execution/work-surface-kit/contracts/primitive-canon.md)、[`ui-composition.md`](../../snapshots/local/courtwork/docs/ui-composition.md)。来源契约把 `unknown`、`failed`、`completed`、`cancelled` 和 `pending` 分开；回放规则保留 session/run/request 身份、草稿、原始输入、焦点与滚动位置。

可借用的元素是三条静态回放：正常完成后有可核验回执；外部写入超时后进入 `unknown → reconciling`，先查权威状态；明确失败进入 `failed`，可按合同提供有界重试。状态词直接显示，颜色只作辅助。来源、版本、目标对象和动作回执与状态放在同一阅读块中。

不能照搬的是 Courtwork 的完整 Run/permission/question 词表、具体 API、`j/k` 快捷键、`work-summary` 集合或任何“重试可用”的假设。Q3 的回放必须保持题目动作和状态的边界，不能把页面加载动画、客户端 `Message-ID` 或按钮点击当成已提交。

依赖与状态：这是本地状态/投影契约与设计经验，真实邮件、桌面、生产账号和后端幂等性均未由本批验证。静态回放不要求 runtime；若以后接入真实数据，必须重新核对 owner、revision、回执和重试合同。

最小实施：做三行或三段固定回放，分别标记 `verified`、`unknown / reconciling`、`failed`；每段保留 `action → target → request id → observed result → next allowed action`。`unknown` 段不显示“重试成功”或“发送失败”，只显示核查路径和当前不可判定事实。

### V-05 · 原子 diff、候选版本与反事实矩阵

原路径：`/Users/lesprivilege/Projects/Courtwork/docs/interface-components.md`、`/Users/lesprivilege/Projects/Courtwork/docs/output-review.md`，以及 career-kit 的 `图式目录.md` 中的方案矩阵定义。

本 kit 快照：[`interface-components.md`](../../snapshots/local/courtwork/docs/interface-components.md)、[`output-review.md`](../../snapshots/local/courtwork/docs/output-review.md)、[`图式目录.md`](../../snapshots/local/career-kit/10-Vault/地基/企业汇报图式库/图式目录.md)。其中 Courtwork 的工作面候选保留 identity、base/source version、lineage、rule status、source anchor 和 frozen quote；历史 source bytes 从候选自己的 frozen revision 读取，不用当前来源回填；unknown 不是 failure。Output Review 将读取、比较、修改、新版本和正式接受分开。

可借用的元素是 Q5 的四行反事实矩阵：原版、仅删除 D1、仅新增 D2、D1+D2 组合。列至少包含原子变更、事项/客户/法域范围、法源与证据状态、评估状态、建议动作、批准/生效状态和回滚目标。每行都能回到同一父版本和 source anchor，矩阵底部再放一条独立性与隐藏验收集说明。

不能照搬的是 Courtwork 的 Work packet 字段、客户法域、实际 action enum、任何已实现的 Accept/Revise 按钮或“candidate 已接受”的显示。Q5 的德国、越南、新加坡材料仍按母稿标记为待核或局部证据，矩阵只能表达测试设计和状态，不能把演示结果写成法律意见。

依赖与状态：矩阵使用母稿已登记的 D1/D2、范围与反事实；不需要后端。候选版本、法源、审批和 active 状态仍是答题中要证明的治理对象，页面本身没有权限改变它们。

最小实施：用一个静态 `table`，把四个候选排列成行；用一列窄 diff 摘要显示删除/新增原子性，另列写 `evidence-pending`、`reviewed`、`approved`、`active` 等状态。组合行不能吞并两项变更的独立证据；无有效法源的 VN 行明确写 `unknown`。

### V-06 · 长文阅读、来源回跳与打印边界

原路径：`/Users/lesprivilege/Projects/Courtwork/docs/output-review.md`、`typography-refinement.md`、`ui-composition.md`；打印几何参照 career-kit 的 `图式样张.html`。

本 kit 快照：[`output-review.md`](../../snapshots/local/courtwork/docs/output-review.md)、[`typography-refinement.md`](../../snapshots/local/courtwork/docs/typography-refinement.md)、[`ui-composition.md`](../../snapshots/local/courtwork/docs/ui-composition.md)、[`图式样张.html`](../../snapshots/local/career-kit/10-Vault/地基/企业汇报图式库/图式样张.html)。Courtwork 的阅读材料保留内容来源、版本、当前/记录版本和比较边界；排版提炼采用清晰标题、紧凑元数据、可按需打开的版本详情、正文阅读宽度，并移除 Markdown 普通文本继承的 `pre-wrap`，避免源格式换行制造假间距。

可借用的元素是单一正文列、章节锚点、固定的标题/版本/状态关系、来源与正文相邻、展开后可返回原位置，以及打印时去掉操作栏但保留判断、反例、状态和来源。Career-kit 样张的 `@media print` 展示了固定打印页、`break-after: page` 和屏幕控制隐藏的最小做法；它同时保留了总览和单页检查模式。

不能照搬的是 15px/1.7、22px 标题、390/1440 viewport、1600×900 舞台或任何固定打印尺寸作为本答卷硬标准。样张的 13.333×7.5 英寸是 deck 参考，不能代替 A4/Letter、窄屏、长表格和 PDF 导出的实际检查。不要把来源元数据压成不可读小字，也不要让 sticky 导览遮住正文。

依赖与状态：Markdown/HTML 可采用本地 CSS/JS；无远端字体、CDN 或在线数据依赖才能满足离线阅读。快照登记明确指出 HTML 文件存在不等于离线资产完整；本次没有启动 renderer、打印或 PDF 导出。

最小实施：桌面显示一个窄而完整的正文列，顶部提供题目锚点和状态，正文内保留表格与反例；打印 CSS 隐藏锚点控件和交互提示，保留章节顺序、完整句子、矩阵、两组 Q4 数字及来源 ID。打印验收至少检查长行换行、表头重复、矩阵不裁断和 `unknown` 不因颜色消失。

## 未快照增量：仅摘要定位

### L-01 · `visual-spatial-grammar.md`（未快照）

原路径：`/Users/lesprivilege/Projects/Courtwork/engineering/design/visual-spatial-grammar.md`；当前源 SHA：`59f50e09beb8d4fa43fbc0878a49979900b26f91`。该文件 2026-09-21 新增于现有快照之后，本次只读完整查看，未复制。

它把 Courtwork 的表面分为 Workbench chrome、Reading/review、Action/decision 三种角色，要求紧凑 chrome、可读正文和局部集中的后果/恢复信息同时成立；`unknown`、scope、版本、授权与必要失败说明不能被几何替代。它还把 text resize、320px reflow、text spacing、target size 分开，并要求新构造记录 surface role、token mapping、focus/scroll/state owner、输入假设和证据状态。

对本任务可借用的是“Q4 图形属于 review/decision 区，Q3 回放属于状态/恢复区，Q5 矩阵属于精确比较区”的角色分配，以及把长文阅读与顶部 chrome 分开验收。不能把 24–40 或 44×44 等角色范围当作全局 CSS，不能因该文件存在就宣称 Courtwork 已完成可访问性或本答卷页面已通过渲染。

### L-02 · `grammar-convergence-20260921/`（未快照）

原路径：`/Users/lesprivilege/Projects/Courtwork/engineering/design/grammar-convergence-20260921/`，本次查看 `README.md`、`astra-loop.md`、`disposition-20260922.md`、`luna-external-index.md` 与审计入口；当前源 SHA 同为 `59f50e09beb8d4fa43fbc0878a49979900b26f91`，未复制。

这组材料把设计收敛拆为 extract → inspect representative composition → map to owner → record bounded candidate，明确先做只读 audit，再由 owner 决定迁移。它特别要求完整检查 tab → document header → reader toolbar 的叠层、长内容、窄窗、键盘、未知与回执，并区分作者截图、自动化测量和独立验收。它是后续页面实现的边界材料，不改变本索引中已登记的视觉选择，也不构成 Claude 工单。

## 最小实现集合与未覆盖

后续页面若启动，最小可视化集合为：Q4 一张可键盘操作的概率分布图加精确值表；Q3 三段静态状态回放；Q5 一张四行原子 diff/反事实矩阵；一个带章节锚点的长文入口；一份去掉交互控件仍完整可读的打印输出。上述五块共享同一份已审定内容数据，不各自补数字、来源或状态。

本次没有消费或复制 Courtwork 的 raster evidence、视频、完整 runtime、当前 HTML/CSS、生产 API、账号、客户材料或源仓库之外的页面资源；也没有验证 browser zoom、屏幕阅读器、触摸、PDF 字体嵌入、实际打印分页、Q4 控件可访问性或任何业务数据。当前 live source 的新文件与改动只做了上述两项视觉语法摘要，其他 595 个候选文本路径和 18 个 manifest-listed size changes 未逐件读取。

引用关系、snapshot hash、文件处理状态和来源边界以 [local-projects.json](../../intake/local-projects.json)、[本地设计提炼](../reporting/local-design.md) 与 [Downloads 依赖清单](../reporting/downloads.md) 为准。真正进入页面实现前，需要由 main 冻结母稿内容、选择是否采用未快照增量，并另行形成唯一的 Claude paste 工单。

## 后续召回：实际Pages与展示HTML

用户随后补充CW Pages编译数据可视化和career展示HTML。新增[CW Pages参考](cw-pages-reference-index.md)与[career HTML参考](career-html-reference-index.md)面向具体文件、实现符号及依赖；当前呈现裁决为[五页加共用纲要卡](five-page-outline.md)。早期索引中的单长文、顶部状态和元数据位置建议不覆盖当前工单。
