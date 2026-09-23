# Courtwork Pages 实际可视化参考索引

状态：Luna 有界只读召回，2026-09-23。来源仓库 `/Users/lesprivilege/Projects/Courtwork` 在本次检查中保持只读；当前源 HEAD 为 `59f50e09beb8d4fa43fbc0878a49979900b26f91`。本文只登记 Pages/site 已有的编译实现、数据语义、布局行为和验收记录，供跨任务复用；五页AI能力测试是本批的一个消费例。

本次没有运行 `site/build.mjs`、预览服务器、浏览器验证脚本或源代码，没有安装依赖、读取客户材料或制作截图。追加保存了3份SVG和1份编排源码的原字节快照；没有复制完整站点。源码证据来自路径、代码符号、登记字段和既有 JSON 回执；视觉效果没有在本轮重新渲染。原色不作为迁移约束。Courtwork 现有图式使用 campaign tokens、灰阶和少量语义红，答卷可采用冰白、雾蓝灰、冰青和钴蓝，但状态、差异、待人判断等语义仍需保持可辨。

## 构建身份与数据边界

`site/build.mjs:65-78` 先检查 Pages semantic map，再读取 `site/release.json` 的固定 `source_sha`，从固定产品提交提取 tokens 和 renderer；`site/build.mjs:80-134` 校验 specimen、media、continuity evidence 的 hash 和 source identity；`site/build.mjs:136-170` 将图、产品页、CSS、脚本和证据写入 `site/dist/`。`site/release.json` 当前固定产品证据提交 `9e5384fcabdac432259b3ffab7928251bea49859`，而当前源 HEAD 是 `59f50e0`。现有 `site/dist/build-manifest.json` 的 `site_sha` 为 `401004568946f5125fb057024718e58bf28b8003e694b6fdad9284b1c3736f5f`，因此生成产物不能当作当前 HEAD 的重新构建结果。

`site/src/assets/figures/figures.json` 登记 21 个图式：11 个 `concept`、8 个 `research`、2 个 `shipped`。登记字段包括 `id`、`concepts`、`status`、`grammar`、`renderer`、`source`、`mount`、`page`、`viewport`、`red`、`reducedMotion` 和 `alt`；文件型 SVG 还必须有 SHA-256。`site/src/assets/figures/figures.mjs:11-24` 在挂载前按 id 查找并重算文件 hash。答卷页面可以借用这套“内容身份、视觉语义、状态和来源分开登记”的方法，但不需要照搬 Courtwork 的 registry 或内部命名。

## 定向参考

### CW-P01 · 状态到提交的闭环图

原路径：`/Users/lesprivilege/Projects/Courtwork/site/src/assets/diagram.svg:1-28`；登记位置：`site/src/assets/figures/figures.json:53-77`；挂载位置：`site/src/page.mjs:221-243`。文件 SHA-256 为 `008864a7ce0eada15350f66996c05a9f596c670ea9ae834902e6b6f8d649b31e`，registry 状态为 `shipped`、grammar 为 `plate`。

图的结构是 `Governed work state → Context projection → Model / human proposal → Candidate → validation · evidence · authority · review → Committed change → Updated state`，另以虚线回到下一次运行。它把候选、证据、授权、审阅和正式变化放在同一条关系链上，适合 Q3 的执行状态与回执回放，也适合 Q5 的候选、批准和生效边界。每个节点是可解释对象，箭头表达真实关系，虚线只表达下一次运行。

可借元素是单张闭环图、节点和关系的分层、实线/虚线的单一语义以及图下的连续说明。五页答卷中可用一张窄版状态图承载 Q3 的 `verified / unknown / failed` 三条回放，或用 Q5 的 `candidate → review → active` 过程卡。不能照搬 Courtwork 的 Work Core、Harness、Matter 等内部名词，也不能把页面图上的“commit”当作真实系统已经提交。

依赖是自足 SVG、页面 caption 和 `figures.mjs` hash 校验；无运行时数据。既有 `site/verification/verify.json` 记录了无脚本首屏、架构图和章节完整性，但本轮没有重跑。

### CW-P02 · 来源更新后的宽窄双版

原路径：`/Users/lesprivilege/Projects/Courtwork/site/src/assets/figures/source-change.svg:1-51` 与 `source-change-compact.svg:1-36`；登记位置：`figures.json:242-300`；编排位置：`site/src/continuity-figures.mjs:3-24`。宽版和窄版分别有独立 hash，registry 的 `viewport` 为 `wide` / `compact`，两者都是静态图。

数据语义是同一 Matter 的来源 `s-1` 从版本 1 到 2、来源集合从修订 2 到 3；旧候选 `c-9`、`c-10` 仍可追溯，当前检查生成 `c-11`，经过验证、授权和接受后进入 Matter 版本 8。图把来源变化、派生失效、重新派生和正式接受分开。

可借元素是一个事实叙事对应两份静态视图；桌面保留横向关系，窄屏改用纵向 compact 图，而不是把宽图压缩到不可读。CSS 在 `site/src/site.css:1017-1042` 通过 `@media (max-width:720px)` 切换宽/窄图；`continuity-figures.mjs:3-14` 保持两版共用同一 caption。它最适合 Q5 的来源变更、旧候选和反事实行，也可作为每页纲要卡的“版本变化”小图。

不能照搬具体的 Matter、候选编号、来源文本或“进入版本 8”的示例事实；它们是 Pages 的合成产品叙事。依赖是两个内联 SVG 文件、静态 caption、720px 断点和 `figure-scroll` 容器；没有真实 API 或 live data。

### CW-P03 · 候选到正式记录

原路径：`/Users/lesprivilege/Projects/Courtwork/site/src/assets/figures/candidate-to-record.svg:1-46` 与 `candidate-to-record-compact.svg:1-38`；登记位置：`figures.json:302-360`；挂载位置：`site/src/continuity-figures.mjs:27-33` 的 `candidateCommitStory()`。宽版与 compact 版是 `tour.html` 的两种 viewport，文件 hash 已登记。

图中当前 Matter 版本 7、来源 `s-1` 版本 2、来源集合修订 3 先形成执行上下文；执行产生候选 `c-11` 和独立运行记录；候选绑定证据，经验证、授权和接受决定后，Work Core 才产生正式成果、决定与回执并进入版本 8。运行记录可供查证，却不自动成为正式成果。

可借元素是把 `run record`、`candidate`、`evidence`、`authorization`、`accepted result` 分成不同节点，避免把模型输出、执行成功和正式生效画成同一状态。Q5 的四行反事实矩阵可用这套字段：父版本、候选、证据、独立复核、动作状态、生效/回滚目标；Q3 的状态回放可用它区分“执行结束”和“结果已被接受”。

不能照搬具体版本号、客户案例或接受动作，也不能为静态答案页面添加真实 Accept/Commit 按钮。依赖是 SVG、静态 caption、wide/compact 两版以及 `@media(max-width:720px)` 切换；没有后端状态机。

### CW-P04 · 原子差异的文字图式

原路径：`/Users/lesprivilege/Projects/Courtwork/site/src/assets/figures/change-language.svg:1-43`；登记位置：`figures.json:362-389`；CSS 语义位置：`site/src/site.css:886-898`。registry 把它标为 `concept`、`plate`、`geometry: browser`，来源还记录生成器 `site/scripts/render-diff-figure.mjs` 与 fixture `app/web/diff-fixture.mjs`。

数据结构是行号、旧行号、新行号、行类型 `context / del / add`、加减号、旧文本、新文本和新增/删除计数。原行保持灰色，新行使用差异色，真正新增词段放在实色块上，删除词段保留灰底；行号与加减号让含义不依赖颜色。它正好对应 Q5 的 D1 删除、D2 新增和组合修改，也可把每题纲要卡里的“原子变化”压成一条可核对记录。

可借元素是“旧文本、删除文本、新文本、上下文行、变更计数”分层，以及用结构和符号承担差异语义。不能照搬示例中的 NDA/notice 文本、红色 token 或把差异色当作 `attention.review`、批准或风险状态；当前 CSS 明确把 `--campaign-diff-change` 与 `--campaign-attention-review` 分开。该图是生成式来源，若页面要显示 Q5 的实际 diff，应由本题数据生成，不能手改一份装饰 SVG。

依赖与状态：生成器与 fixture 的完整运行链本轮未执行；registry 已记录浏览器几何检查，既有 `check-figures.mjs:244-307` 会校验源 hash、SVG title/desc、外部元素、颜色和静态几何，浏览器验证仍需另行执行。

### CW-P05 · Store—Govern—Retrieve—Compile—Run

原路径：`/Users/lesprivilege/Projects/Courtwork/site/src/assets/figures/pipeline.svg:1-85`；登记位置：`figures.json:149-168`；挂载位置：`site/src/page.mjs:286-310` 的 `researchFigures()`。registry 状态为 `concept`、grammar 为 `plate`。

图把 Store 定义为持续增长的来源、事件、成果版本、原始历史与当前状态；Govern 以 contract、status、version、authority、applicability 使对象可选择；Retrieve 只找潜在相关对象；Compile 按 assignment、role 与 stage 形成最小充分的 context projection；Run 使用 model/tools，提议经 candidate → review → commit 返回 Store。底部用“存量变大、单次工作集不变”比较全量材料与当前上下文。

可借元素是把 Q1 的长会话供给画成数据路径，而不是把“上下文”画成一块无限大的文本框；把选择条件、版本、权限和适用范围集中在 Govern；把 Retrieve 与 Compile 分开；用一条回写路径表达候选回到长期记录。Q2 的路由表也可借它拆成“候选供给 → 工作集 → 执行 → 验收”的关系。

不能把这张概念图当作已实现的统一 Work Compiler，也不能把 Schema Engineering 9.6 的标注或 CourtWork 内部角色直接写进答卷事实。它是自足 SVG，无数值数据，状态为 concept；应转译成外部读者能理解的来源、候选、授权、上下文和验收语言。

### CW-P06 · 长文中的图、说明和可达性

原路径：`/Users/lesprivilege/Projects/Courtwork/site/src/page.mjs:286-310`、`site/src/site.css:857-908`、`site/src/site.css:996-1008`。`figure()` 统一生成 `figure`、可聚焦的 `figure-scroll` region、可见 caption 和 `data-figure`；`researchFigures()` 把 pipeline 放在长文主展项，下方按 Spark、Attention、Experts 三个语义区分小图。

可借元素是“一段判断 → 一张关系图 → 一段说明”的长文节奏；图有自己的 caption、键盘可聚焦区域和滚动容器，宽版图在窄窗保留横向阅读，页面提供 `Scroll to explore` 提示，焦点环不依赖 hover。CSS 还为 `prefers-reduced-motion`、`prefers-reduced-transparency` 与 forced colors 保留降级语义。

这适合五页答卷的长文主栏：每题一页时，主判断先连续成段，纲要卡只承载该题的对象、机制、验收和一项反例；图不被拆成五张同权卡，也不把题目正文改成 slide deck。不能照搬三栏产品角色、英文 campaign 标题或 720px/440px 的固定尺寸。

依赖是 `site.css`、SVG 的 `title/desc`、`figure-scroll` 与本地 tokens；本轮未重新打开页面。现有 Pages 源没有 `@media print`、`break-after` 或 `page-break` 规则，打印版需要在新答卷实现中另行设计和验收。

### CW-P07 · 产品页的数据投影与真实媒体槽

原路径：`/Users/lesprivilege/Projects/Courtwork/site/src/product-pages.mjs:20-45`、`:61-80`，`site/src/product-pages.css:13-84`。`tourGroups` 把页面内容分成 START、KNOW、JUDGE、SPECIALIZE、CONTROL 五组；`tourStates` 为每个状态绑定标题、描述和 capture slot；`data-routes` 用五个带序号的 section 表达本地事项、模型请求、凭据、工具效果和网站本身的边界；`featureRows`、`journal`、`boundary-pair` 和 `spec-table` 提供静态内容容器。

可借元素是数据与 layout 分开：页面函数从数组生成标题、状态、caption、链接和截图，媒体由 `capture-plan.mjs:23-45` 按 `source_sha`、theme、viewport 选取，缺图不会静默替换旧批次。对五页答卷可借 `tourGroups` 的分组方式、`state-index` 锚点、`journal` 的长文块和 `boundary-pair` 的两列比较，但纲要卡必须来自答卷母稿，不继承产品营销文案。

不能照搬页面的商业 copy、产品截图、产品版本、合成 NDA、媒体 source SHA 或“已接入/已可用”语气。`site/verification/product-pages-main-20260910/verify.json` 记录了既有 product pages 在 1440、390 和 scale 2 的检查，并不证明五页答卷已经渲染、打印或完成内容验收。

### CW-P08 · 图式与页面验收边界

原路径：`site/scripts/check-figures.mjs:195-327`、`site/verification/verify.json`、`site/verification/product-pages-main-20260910/verify.json`。静态 figure 检查会确认 manifest mount、源 hash、title/desc、无 `script`/`foreignObject`/`image`/`iframe`/`use`/外部 URL、唯一红点、viewBox 内几何与文字不溢出；页面回执还记录无脚本章节完整、对比度、减弱动效/透明度、1440/390/200% 无横向溢出。

可借元素是把“图存在”拆成来源完整性、语义可读性、状态颜色边界、窄屏几何和无脚本退化几类检查。五页答卷最小验收应保留：图和表有同一数据源；精确数字不藏在 hover；窄屏不裁断 Q5 矩阵；Q4 交互在 JS 禁用时仍有两组预设；Q3 的 `unknown` 由文字表达；打印版有单独分页检查。

不能把这些历史回执当作本题页面已经通过验证，也不能声称 `site/dist` 是当前 HEAD 的构建。此处只复用检查思想和字段，未在本任务重新运行任何脚本。

## 适用于五页与纲要卡的最小取法

Q1 适合借 CW-P05 的 Store/Govern/Retrieve/Compile 关系，把长会话供给、工具发现和工作集边界放在一张关系图或简表中；Q2 可借同一图的“候选供给 → 路由 → 成本/等待/验收”顺序，但不照搬任何产品数字。Q3 适合 CW-P01 的状态闭环与 CW-P02 的来源变化/回执连续性，保持 `unknown` 独立。Q4 的概率分布仍应使用代码生成的四等级分布图和精确值表，CW Pages 图式只贡献 caption、focus、静态降级和不依赖颜色的关系表达。Q5 适合 CW-P02、CW-P03、CW-P04，分别承载来源变化、原子 diff、候选到正式记录。

每页纲要卡只保留标题和一句判断，作为页面锚点；机制、反例、验收和视觉展项进入该题正文，不把卡片扩成第二份答卷。可以借 `journal` 或 `boundary-pair` 的连续块结构，但不把卡片写成阅读指引，不在正文中加入来源快照、保护说明或 Pages 内部名称。当前素材足以支持五页的结构参考，不能支持真实业务效果、模型性能、法律批准或当前 Courtwork HEAD 的离线发布结论。

## 小型离线快照

为后续 Claude 离线回查，已保存四个原字节文件：[`pipeline.svg`](../../snapshots/local/downloads/cw-pages-recall-20260923/pipeline.svg)、[`change-language.svg`](../../snapshots/local/downloads/cw-pages-recall-20260923/change-language.svg)、[`diagram.svg`](../../snapshots/local/downloads/cw-pages-recall-20260923/diagram.svg)、[`continuity-figures.mjs`](../../snapshots/local/downloads/cw-pages-recall-20260923/continuity-figures.mjs)。快照索引和 hash 见 [`README.md`](../../snapshots/local/downloads/cw-pages-recall-20260923/README.md) 与 [`cw-pages-recall-20260923.json`](../../intake/cw-pages-recall-20260923.json)。CSS、其他 SVG、figure registry、build/runtime 和源 fixture 未快照；这四个文件不能独立运行。

## 读取数量与未覆盖

本次入账 12 个核心 Pages/site 源入口或实现文件，另定向读取 6 个 SVG 主实现及其 2 个 compact 变体、2 份既有页面验证 JSON、1 份 dist build manifest 和 5 个生成页面。`figures.json` 共登记 21 个图式，已有 dist 页面挂载 figure 的数量为 index 13、features 2、chat 1、experts 3、tour 2。未复制完整源仓库；已保存4份最小源码/SVG快照，未保存HTML产物、共享CSS或完整依赖；入账记录见 [`cw-pages-recall-20260923.json`](../../intake/cw-pages-recall-20260923.json)。

未覆盖 Courtwork 全部 site 源、所有 SVG、完整 `product-pages.mjs` 数据、当前 HEAD 重建、浏览器实际截图、打印/PDF 分页、屏幕阅读器、触摸、实时接口、客户案例、图片生成和五页答卷实现。现有 Pages 源中未找到 `@media print`、`break-after` 或 `page-break`，因此打印实现不能声称已有可复用实现，只能借其长文/窄屏/静态降级结构另行设计。
