# 样张清单（生成）

由 `tools/catalog.py` 从 [specimens.json](specimens.json) 生成，勿手改。可视入口见 [index.html](index.html)。全部内容为 synthetic 实验样张，状态均未经采纳。


## T01 · 命题标题 · Propositional heading

- 层级：atom；家族：text；位置：[atoms/text.html#T01](atoms/text.html#T01)
- 职责：只扫标题就知道本节的判断，而不只是话题
- 输入：必需：可证伪的主张（主语、谓语、关键数量）；可选：话题眉题、转折/限定从句、前提列表
- 适用：报告/决定材料的节标题，读者可能只读标题
- 不适合：纯导航节点；主张尚未成立（改用问题式标题+T10）
- 容量：≤28 字单行最稳；28–48 字需语义断行；>48 字拆为问题+前提
- 已见失败：话题标签冒充标题；单行省略号截掉句尾主干；text-wrap: balance 在中文里拆开词语（目|标）；数字两侧空格成为意外断点
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| T01-a | 眉题＋命题 | relation:single spatial:stack path:linear load:short expression:baseline | candidate | 话题降级为眉题，命题占据标题位。 |
| T01-b | 转折分层 | relation:pro-con spatial:stack path:linear load:short expression:editorial | candidate | 把一句含转折的命题拆成两层：主句用衬线大字，“但”字悬挂在左边距外，后半句降一级。 |
| T01-c | 话题入栏、命题入正文 | relation:single spatial:main-margin path:scan load:short expression:spatial | candidate | 话题标签和编号移入左栏，与命题首行基线对齐；左栏在全文中保持同一列，形成可扫的目录竖轴，右栏只放命题。 |
| T01-d | S1 按语义断行 | relation:single spatial:stack path:linear load:long-title expression:baseline | stress | S1 原文 56 字。 |
| T01-e | S1 拆为“问题＋前提” | relation:claim-evidence spatial:stack path:linear load:long-title expression:editorial | stress | 同一句 S1，改为标题只保留问题（22 字），前提降为编号子行挂在标题下。 |
| T01-f | 单行省略截断 | relation:single spatial:stack load:long-title expression:baseline | failed | 失败原因：为了让标题“整齐”用单行 text-overflow: ellipsis。 |
| T01-g | 话题标签当标题 | relation:single spatial:stack load:short expression:baseline | failed | 失败原因：标题只说明“关于什么”，没有判断；读者要读完正文才知道结论是好是坏，扫读路径失效。 |

## T02 · 引介 · Lead

- 层级：atom；家族：text；位置：[atoms/text.html#T02](atoms/text.html#T02)
- 职责：进入一节时知道看什么、为何看、看完回答什么
- 输入：必需：看的对象、它回答的问题；可选：阅读顺序、需提前知道的例外/缺失
- 适用：节首，材料多于两件或有需预告的例外
- 不适合：单段小节；复述标题
- 容量：1–3 句 ≤120 字；更多改为路线
- 已见失败：“本节将介绍……”空引介；例外预告比引介本身更长；提前写结论与 T07 重复
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| T02-a | 节首一段 | relation:single spatial:stack path:linear load:short expression:baseline | candidate | 两句话、两个对象、各带一个“判断……”。 |
| T02-b | “看／因为”悬挂 | relation:sequence spatial:offset path:linear load:short expression:editorial | candidate | 把引介的两个必需成分做成悬挂词，放在左边距外的衬线字里。 |
| T02-c | 阅读路线 | relation:sequence spatial:stack path:drill load:short expression:graphic | candidate | 引介变成带编号的路线：问题在上，三站各有“看什么／为何看”两层，编号和粗连线表示顺序。 |
| T02-d | 带例外预告的引介 | relation:certain-uncertain spatial:stack path:linear load:exception expression:baseline | stress | 压力：引介必须提前交代两个例外（S5 第 14 周、S3 北站缺失），长度翻倍。 |
| T02-e | 空引介 | relation:single spatial:stack load:short expression:baseline | failed | 失败原因：只列话题（“到馆情况、成本情况”），没有要判断的问题，也没有顺序理由；删掉它读者不损失任何判断，按原子划界规则它不是原子。 |

## T03 · 要点 · Key point

- 层级：atom；家族：text；位置：[atoms/text.html#T03](atoms/text.html#T03)
- 职责：读完需要记住并在回看时能找回的一个判断
- 输入：必需：一句判断；可选：来源段落回链、支撑数字
- 适用：一节最多一个，读者会被追问“关键是什么”
- 不适合：每段都有要点；未被证据支撑的判断
- 容量：≤50 字一句
- 已见失败：等权高亮多处；要点脱离来源段落；长数字把判断推到句尾
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| T03-a | 左线独立句 | relation:single spatial:stack path:linear load:short expression:baseline | candidate | 要点是正文流里的一句，左侧 3px 线＋“要点”文字标签，字重加一级。 |
| T03-b | 段首主题句 | relation:single spatial:inline path:linear load:short expression:baseline | candidate | 不单列，要点就是段落第一句，加粗。 |
| T03-c | 边栏要点带回链 | relation:claim-evidence spatial:main-margin path:revisit load:short expression:spatial | candidate | 要点移入右栏，与它的来源段落顶对齐，段落前留一个 ¶ 锚点，要点里有“见 ¶”回链。 |
| T03-d | 跨栏引出 | relation:single spatial:span path:revisit load:short expression:graphic | candidate | 要点被抽成满宽色带，大字把 22% 换算成“每 5 位里 1 位”，下方小字给回原始数字、分母与时间范围。 |
| T03-e | 长数值要点 | relation:single spatial:stack path:linear load:long-number expression:baseline | stress | S2 两个长金额放进一句要点（S2 按“首年全口径”解读，与 F0 的年化增量 ¥1,160,000 是不同口径，本次补充）。 |
| T03-f | 满段高亮 | relation:multi spatial:stack load:dense expression:baseline | failed | 失败原因：六处等权高亮，没有一处是要点；“但”后面的代价与前面的好消息同样被高亮，读者无法判断哪个更重要。 |

## T04 · 定义 · Definition

- 层级：atom；家族：text；位置：[atoms/text.html#T04](atoms/text.html#T04)
- 职责：读数字前知道术语口径，判断能否与别处比较
- 输入：必需：术语、口径；可选：计入/不计入、单位、来源、与常识含义差异
- 适用：术语日常含义与口径不同；数字会被引用
- 不适合：共享口径的通用词；术语表（枚举家族）
- 容量：≤80 字；更长拆为计入/不计入
- 已见失败：定义沉到文末导致作者自己误读人次为人数；长 token 断行落在时间戳中间；word-break: break-all 在宽屏也拆开标识符
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| T04-a | 术语—口径 | relation:single spatial:stack path:linear load:short expression:baseline | candidate | 术语一行、口径一行缩进。 |
| T04-b | 首用内联 | relation:single spatial:inline path:linear load:short expression:baseline | candidate | 定义放在术语第一次出现的括号里，术语用 <dfn>，括号内降一级字号和灰度。 |
| T04-c | 边注定义 | relation:single spatial:main-margin path:adjacent load:short expression:spatial | candidate | 定义与使用它的句子同一高度，用字母标记配对，不用数字（避免和数据数字混淆）。 |
| T04-d | 口径解剖 | relation:whole-part spatial:juxtapose path:scan load:short expression:graphic | candidate | 把口径拆成“计入／不计入”两栏，以＋／－符号与标题文字区分（不靠颜色），最后一行写出这个口径阻止的误读。 |
| T04-e | 长 token 口径 | relation:single spatial:stack path:linear load:mixed-script expression:baseline | stress | S7 的 71 字符调用放进口径。 |
| T04-f | 定义沉到文末 | relation:single spatial:distant path:revisit load:short expression:baseline | failed | 失败原因：口径沉到文末注释，正文作者自己都把“人次”读成了“人数”（“覆盖约 1.2 万名读者”是错误推论）。 |

## T05 · 条件与限定 · Condition & qualifier

- 层级：atom；家族：text；位置：[atoms/text.html#T05](atoms/text.html#T05)
- 职责：判断主张在什么条件/范围/假设下成立，以及条件现在是否满足
- 输入：必需：主张 + ≥1 条件；可选：条件类型（前提/范围/假设）、当前状态、何时可知
- 适用：推荐、预测、扩展判断
- 不适合：无条件事实；条件 >5（改对照表）
- 容量：内联 1；悬挂 2–4；边注 1–3
- 已见失败：条件降为 11px 灰字星号；条件移到脚注；闸门比喻用于不会“满足”的范围/假设
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| T05-a | 主张＋悬挂条件 | relation:claim-evidence spatial:stack path:linear load:short expression:baseline | candidate | 条件缩进挂在主张下面，“仅当以下两项都满足”写明逻辑关系（且／或）。 |
| T05-b | 同句内联 | relation:claim-evidence spatial:inline path:linear load:short expression:baseline | candidate | 条件留在同一句，“仅当”做成小号前缀标签，条件从句加下划点线。 |
| T05-c | 括号边注 | relation:claim-evidence spatial:main-margin path:adjacent load:short expression:spatial | candidate | 条件移到右栏，用一条竖括线只括住它限定的那一句（A），不括住 B。 |
| T05-d | 条件闸门 | relation:claim-evidence spatial:stack path:scan load:short expression:graphic | candidate | 条件在上、主张在下，粗线从条件汇入主张，每个条件带空心方框和“未满足”文字状态。 |
| T05-e | 三类限定并存 | relation:certain-uncertain spatial:stack path:linear load:missing expression:baseline | stress | 压力：一个主张同时有前提、范围、假设三种限定，其中一个建立在缺失数据上（S3）。 |
| T05-f | 大主张小灰条件 | relation:claim-evidence spatial:stack load:short expression:graphic | failed | 失败原因：条件在形式上“在旁边”，但被降到 11px 灰字加星号，截图或转述时一定被丢掉。 |

## T06 · 反例 · Counterexample

- 层级：atom；家族：text；位置：[atoms/text.html#T06](atoms/text.html#T06)
- 职责：判断主张有哪些已知例外、范围多大、是否推翻主张
- 输入：必需：被反驳的主张或词、反例事实；新发现必需：范围维度（时间/分馆×星期）；可选：影响等级
- 适用：概括性主张遇到明确不符的数据
- 不适合：反例其实是数据错误；反例多到主张不成立
- 容量：1–3 条，每条写范围
- 已见失败：只靠红色；埋在列举中用“其中”当支持细节；等宽并置暗示双方同样有代表性
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| T06-a | 主张＋“例外”段 | relation:pro-con spatial:stack path:linear load:short expression:baseline | candidate | 反例紧随主张，前缀文字标签“例外”，并写出对主张的影响等级。 |
| T06-b | 挂在被反驳的词上 | relation:pro-con spatial:inline path:adjacent load:short expression:spatial | candidate | 反例不针对整句，而是针对一个词“每晚”。 |
| T06-c | 支持与反向意见并置 | relation:pro-con spatial:juxtapose path:compare load:short expression:editorial | candidate | 主张在上横跨，两条原话左右并置，支持在左、反向在右，用标签文字“支持／反向”而不是颜色区分。 |
| T06-d | 两处局部例外带范围 | relation:pro-con spatial:stack path:scan load:exception expression:graphic | stress | 压力 S5：两条例外性质不同——一条是外因（不削弱主张），一条是真实弱点（局部削弱）。 |
| T06-e | 只用红字 | relation:pro-con spatial:inline load:short expression:baseline | failed | 失败原因：反例埋在列举里，只靠红色区分；灰度打印、色弱读者或朗读时它和“河湾周六最高”没有区别。 |

## T07 · 结论 · Conclusion

- 层级：atom；家族：text；位置：[atoms/text.html#T07](atoms/text.html#T07)
- 职责：判断证据最终支持什么、支持到什么程度
- 输入：必需：陈述句判断、证据强度；可选：分判断及依据、未覆盖部分（转 T10）
- 适用：一节或全文收束
- 不适合：要读者做事（T08）；证据不足（T10）
- 容量：单句或 2–5 个分判断
- 已见失败：措辞强于证据；行动请求套进结论句式；多来源制造充分错觉而某分句只有弱来源
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| T07-a | 结论＋依据行 | relation:claim-evidence spatial:stack path:linear load:short expression:baseline | candidate | “结论”标签、陈述句、依据行三层。 |
| T07-b | 分判断＋强度刻度 | relation:certain-uncertain spatial:stack path:scan load:short expression:graphic | candidate | 结论拆成三条分判断，每条右侧是三格强度刻度＋文字等级＋一句理由。 |
| T07-c | 推导收束 ∴ | relation:sequence spatial:offset path:linear load:short expression:spatial | candidate | 前提左对齐编号，结论向右缩进一级并以 ∴ 起头，上方一条横线把前提与结论隔开，类似算式的“得”。 |
| T07-d | 四来源支撑同一结论 | relation:claim-evidence spatial:stack path:linear load:many-sources expression:editorial | stress | 压力 S4：同一结论由四个强度不同的来源支撑。 |
| T07-e | 措辞强于证据 | relation:claim-evidence spatial:stack load:short expression:graphic | failed | 失败原因：“普遍”依赖的是回收率约 11% 的自愿问卷；“应全面推广”是一个行动请求，却套在结论的句式和字号里，没有责任人和日期。 |

## T08 · 行动请求 · Action request

- 层级：atom；家族：text；位置：[atoms/text.html#T08](atoms/text.html#T08)
- 职责：判断是不是要我做事、做什么、何时之前、凭什么
- 输入：必需：谁、动词开头的动作、截止、依据；可选：依赖动作、金额
- 适用：决定材料结尾，需要签署/授权/确认
- 不适合：无责任人的倡议
- 容量：1–3 项
- 已见失败：只靠颜色与结论区分；无主语被动句（需要确认）；缺“谁”时仍以请求形式出现
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| T08-a | 四字段 | relation:single spatial:stack path:scan load:short expression:baseline | candidate | 祈使句打头（“请……”），下方三字段。 |
| T08-b | 截止日悬挂 | relation:single spatial:offset path:linear load:short expression:editorial | candidate | 截止日期用衬线大字悬挂在左侧，动作句在右。 |
| T08-c | 有依赖的两项动作 | relation:sequence spatial:stack path:linear load:short expression:graphic | candidate | 动词单列成粗体左栏（确认／授权），宾语和“谁·何时”在右；竖线连成顺序，第三项用虚线和“不是本次请求”文字标出。 |
| T08-d | 结论与请求并置对照 | relation:claim-evidence spatial:juxtapose path:compare load:short expression:spatial | candidate | 把结论和请求放在同一行的左右两格：左格细线框、右格粗线框并在右上角加实心三角，中间箭头表示“由此推出”。 |
| T08-e | 长金额与缺责任人 | relation:multi spatial:stack path:scan load:long-number expression:baseline | stress | 压力 S2＋S3：长金额进入祈使句，责任人字段为空。 |
| T08-f | 只靠颜色区分结论与请求 | relation:claim-evidence spatial:stack load:short expression:baseline | failed | 失败原因：两段形状、字号、位置相同，只有蓝色和橙色的区别；请求用了无主语被动句（“需要确认”），没有谁和何时。 |

## T09 · 正文段落 · Body paragraph

- 层级：atom；家族：text；位置：[atoms/text.html#T09](atoms/text.html#T09)
- 职责：顺着推理读下去，不因行长、断行、数字或混排丢失位置
- 输入：必需：一段推理；可选：内嵌数字、强调、代码 token、英文名
- 适用：连续推理；其它原子的承载体
- 不适合：并列事项；>250 字单段
- 容量：28–40 字/行；80–200 字/段
- 已见失败：宽屏行长 >70 字；两端对齐拉松含数字行；长 token 右缘留白；中西文间距需手工空格
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| T09-a | 段间距分段 | relation:sequence spatial:stack path:linear load:short expression:baseline | candidate | 行长上限 36em（约 36 个汉字），行高 1.85，段间一行空。 |
| T09-b | 首行缩进、无段距 | relation:sequence spatial:stack path:linear load:long expression:editorial | candidate | 中文书籍惯例：衬线正文、首行缩进两字、段间无空行、暖纸色。 |
| T09-c | 段落＋数字旁栏 | relation:claim-evidence spatial:main-margin path:adjacent load:short expression:spatial | candidate | 正文不写数字，数字移到同高度的旁栏，大字＋口径小字。 |
| T09-d | 中英混排与长 token | relation:single spatial:stack path:linear load:mixed-script expression:baseline | stress | 压力 S7＋S2 同段。 |
| T09-e | 满宽两端对齐 | relation:sequence spatial:span load:long expression:baseline | failed | 失败原因：1440 宽下每行超过 70 字，视线换行时容易串行；两端对齐在含数字和 ¥ 的行里拉开字距；两个论点挤在一段，“代价同样清楚”失去段首位置。 |

## T10 · 未决问题 · Open question

- 层级：atom；家族：text；位置：[atoms/text.html#T10](atoms/text.html#T10)
- 职责：判断哪些不知道、为何不知道、会否改变结论、如何知道
- 输入：必需：问句、已知、为何未知；可选：验证方式、对结论的潜在影响、负责人
- 适用：有信号未验证；数据缺失
- 不适合：已被回答的问题；修辞问
- 容量：1–4 个
- 已见失败：被写成结论；空的“待定”；缺失/零/不适用混为一谈；不适用被误读为无关
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| T10-a | 问句＋已知／未知 | relation:certain-uncertain spatial:stack path:linear load:short expression:baseline | candidate | 问句本身用问号结尾，这是与结论最直接的区别。 |
| T10-b | 已知实线、未知虚线 | relation:certain-uncertain spatial:juxtapose path:compare load:short expression:graphic | candidate | 已知与未知左右并置，已知格实线、未知格虚线并以破折号代替数字（不是 0）。 |
| T10-c | 挂在它限定的结论旁 | relation:certain-uncertain spatial:main-margin path:adjacent load:short expression:spatial | candidate | 未决问题放在结论的边栏，被它影响的词（“周三至周六”）加虚下划线。 |
| T10-d | 缺失、零、不适用 | relation:multi spatial:stack path:scan load:missing expression:baseline | stress | 压力 S3：三个值都“没有数字”，但只有“未采集”是未决问题。 |
| T10-e | 未决被写成结论 | relation:certain-uncertain spatial:stack load:short expression:baseline | failed | 失败原因：27% 是“提到”，不是“需要”，更不是到馆量；把信号写成结论，并借用结论的标签和位置，读者会把它当成已验证的依据。 |

## E01 · 有序步骤 · Ordered steps

- 层级：atom；家族：enum；位置：[atoms/enum.html#E01](atoms/enum.html#E01)
- 职责：知道先做什么、后做什么，哪一步要等前一步完成，每步做到什么算完成
- 输入：必需：序号、动作、完成条件；可选：时刻/时长、执行角色、依赖、例外
- 适用：后一步依赖前一步的过程
- 不适合：无先后（E02）；有分支判断（E09-c 门槛图或流转原子）
- 容量：3–9 步
- 已见失败：卡片网格按列填充，阅读顺序与源码顺序不一致；去掉序号和完成条件；把部分并行的步骤硬排成线性
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| E01-a | 编号清单 | relation:sequence spatial:stack path:linear expression:baseline | candidate | 序号/时刻/动作/完成条件四列固定位置；线性依赖时成立 |
| E01-b | 比例时间轴 | relation:sequence spatial:offset path:linear expression:graphic | candidate | 纵向距离等于分钟数，时长步骤另列成条；只在时刻真实且跨度短时成立 |
| E01-c | 角色泳道 | relation:sequence spatial:juxtapose path:scan expression:spatial | candidate | 换道处就是交接点；窄屏收成一列加角色标签；至少 2 个角色才成立 |
| E01-d | 部分并行 + 长标题 + 长 token | relation:sequence spatial:stack load:long-title/mixed-script/missing expression:baseline | stress | 实施步骤只有部分先后关系；可并行组用双线收成一组 |
| E01-e | 等权卡片网格 | relation:sequence spatial:juxtapose path:scan expression:graphic | failed | 按列填充让人眼按行读错顺序；宽窄两种宽度下顺序不一样 |

## E02 · 并列列表 · Parallel list

- 层级：atom；家族：enum；位置：[atoms/enum.html#E02](atoms/enum.html#E02)
- 职责：知道一组东西有哪些、有没有漏项，不需要先后或主次
- 输入：必需：同类若干项；可选：每项一句限定（范围、起始、例外）
- 适用：服务项目、覆盖范围、清单核对
- 不适合：有主次或排名（E07）；需按字段比较（E05/E06）
- 容量：内联 ≤6 短项；堆叠 ≤12 项
- 已见失败：数字编号暗示先后或主次；例外不挂在对应项上；两栏排布被读成两组
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| E02-a | 短横列表 | relation:parallel spatial:stack path:scan expression:baseline | candidate | 短横项目符号，限定语跟在项后 |
| E02-b | 句内串列 | relation:parallel spatial:inline path:linear expression:baseline | candidate | 间隔号串在句内，例外放句尾；≤6 短项 |
| E02-c | 分栏目录 | relation:parallel spatial:span path:scan expression:editorial | candidate | 衬线项名横排分栏，每项都写范围；项名长度相近时成立 |
| E02-d | 12 项 + 例外 + 长 token | relation:parallel spatial:stack load:dense/exception/mixed-script expression:baseline | stress | 超过约 8 项就会被读成分组；长 token 撑乱栏 |
| E02-e | 编号暗示主次 | relation:parallel spatial:stack path:linear expression:baseline | failed | 数字编号制造了原料里没有的排名，并删了例外 |

## E03 · 术语—说明 · Term and description

- 层级：atom；家族：enum；位置：[atoms/enum.html#E03](atoms/enum.html#E03)
- 职责：查一个词在本文里指什么、怎么算，再回到正文
- 输入：必需：术语、说明；可选：单位、公式、来源或口径限制
- 适用：指标定义、口径说明、词汇表
- 不适合：单个嵌入式定义（文本家族定义原子）
- 容量：3–12 条；术语 >12 字时两栏失衡
- 已见失败：术语列定宽加省略号截断；公式混进正文找不到；一个长术语撑宽整栏
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| E03-a | 堆叠 dl | relation:multi spatial:stack path:drill expression:baseline | candidate | 不论长短都不会失衡；占纵向空间 |
| E03-b | 两栏对齐 | relation:multi spatial:juxtapose path:scan expression:baseline | candidate | 左栏可扫；<480px 退堆叠；术语长度相近时成立 |
| E03-c | 定义 + 算式边栏 | relation:multi spatial:main-margin path:drill expression:editorial | candidate | 含义与算式/单位/数值分离；术语需有可计算口径 |
| E03-d | 长术语 + 长 token + 长说明 | relation:multi spatial:juxtapose load:long-title/mixed-script/long expression:baseline | stress | 长条目手动跨栏；列对齐中断 |
| E03-e | 定宽省略 | relation:multi spatial:juxtapose load:long-title expression:baseline | failed | 省略号截掉术语关键限定；stage 标 data-allow-scroll |

## E04 · 成对比较 · Pairwise comparison

- 层级：atom；家族：enum；位置：[atoms/enum.html#E04](atoms/enum.html#E04)
- 职责：判断两个对象在同一组字段上谁高谁低、差多少、差距大不大
- 输入：必需：两个对象、共同字段、每字段单位；可选：差值/倍数、方向（高好/低好）
- 适用：夜间 vs 日间、试点馆 vs 候选馆、前后对照
- 不适合：≥3 对象（E06）；单字段（E05）
- 容量：2 对象 × 2–6 字段
- 已见失败：两张卡字段、顺序、单位都不同；差值方向未说明高好低好；一方全缺失时形式完整但无一行可比
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| E04-a | 三列对照表 | relation:pro-con spatial:juxtapose path:compare expression:baseline | candidate | 单位写在字段名后，差值列统一“夜间相对日间” |
| E04-b | 对称条形 | relation:pro-con spatial:juxtapose path:compare expression:graphic | candidate | 字段居中，两侧展开；每行一个尺度并声明跨行不可比 |
| E04-c | 倍数领句 | relation:claim-evidence spatial:stack path:linear expression:editorial | candidate | 结论先行，已站队；只在作者有明确主张时成立 |
| E04-d | 一方数据缺失 | relation:pro-con spatial:juxtapose load:long-title/missing/zero expression:baseline | stress | 加“可比？”列直说比较不成立；0 与不适用分开 |
| E04-e | 口径不一的两张卡 | relation:pro-con spatial:juxtapose path:compare expression:graphic | failed | 字段顺序、单位、字段集都不一致，诱发“夜间便宜”错读 |

## E05 · 比较行 · Comparison row

- 层级：atom；家族：enum；位置：[atoms/enum.html#E05](atoms/enum.html#E05)
- 职责：在一个字段上看清几个对象各是多少、谁高谁低；可嵌入正文或表格
- 输入：必需：字段名、单位、时间范围、2–6 个值；可选：参考值
- 适用：正文中一句比较；表格中被拿出来的一行；仪表板横带
- 不适合：多字段（E06）
- 容量：2–6 值；句内 ≤4
- 已见失败：同一行混用分母和单位；缺字段名；有效值只剩一个
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| E05-a | 标签 + 值格 | relation:multi spatial:stack path:compare expression:baseline | candidate | 字段与单位只写一次，参考值用竖线隔开 |
| E05-b | 共轴点带 | relation:multi spatial:juxtapose path:compare expression:graphic | candidate | 同一轴上的间距即差值；参考值空心点；轴非零起点已声明 |
| E05-c | 句内微条 | relation:multi spatial:inline path:linear expression:graphic | candidate | 零起点微条嵌入正文；≤4 值 |
| E05-d | 三种空值 + 长数值 | relation:multi spatial:stack load:missing/zero/long-number expression:baseline | stress | 空值要附原因；长数值迫使退化成小表；只剩一个可比值时不成立 |
| E05-e | 混合单位 | relation:multi spatial:inline path:linear expression:baseline | failed | 两种分母与四种单位写法，句子通顺但比较错误 |

## E06 · 多属性对照 · Multi-attribute matrix

- 层级：atom；家族：enum；位置：[atoms/enum.html#E06](atoms/enum.html#E06)
- 职责：在多对象 × 多属性之间横看竖看：谁整体怎样，谁在某属性突出，哪里缺数据
- 输入：必需：对象 × 属性值、每属性单位与时间范围；可选：分组、参考列、状态原因
- 适用：分馆对照、指标总表
- 不适合：2 对象（E04）；属性间有推导关系
- 容量：常规 ≤6×6；12×6 需分组和窄屏专案
- 已见失败：窄屏按对象成卡失去列对齐；只用颜色表示好坏；三种空值都显示成“—”；不同质对象硬放一张表
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| E06-a | 表格 → 窄屏按对象成卡 | relation:multi spatial:stack path:scan load:missing/zero expression:baseline | candidate | 常见做法；窄屏失去跨对象比较 |
| E06-b | 窄屏按属性转置 | relation:multi spatial:stack path:compare load:missing expression:spatial | candidate | 窄屏每属性一块、对象固定 4 格位置，保留比较关系；双份标记 |
| E06-c | 格内条 · 按列同尺度 | relation:multi spatial:stack path:compare load:missing/zero expression:graphic | candidate | 零画刻线、不适用不画轨道；窄屏按对象成块但条仍同尺度，跨块可比 |
| E06-d | 12×6 行分组 + 窄屏定位格 | relation:multi spatial:stack path:scan load:dense/missing/zero expression:baseline | stress | 参考列双线隔开；窄屏 3×2 带名定位格；暴露候选馆应另表 |
| E06-e | 纯色块热力表 | relation:multi spatial:stack path:scan expression:graphic | failed | 无值无阈值，红绿不可辨，缺失与不适用同色 |

## E07 · 排序 · Ranking

- 层级：atom；家族：enum；位置：[atoms/enum.html#E07](atoms/enum.html#E07)
- 职责：按某依据知道谁第一谁垫底、方向是什么、谁没有参加排序
- 输入：必需：依据（字段+单位+时间）、方向、各对象值；可选：参考值、不参与排序的对象及原因
- 适用：按成本给分馆/时段/方案排序
- 不适合：差距小于误差；只有 2 对象
- 容量：3–10 个 + 不参与排序区
- 已见失败：没写依据和方向；缺数据对象排在末位像“最差”；奖牌装饰；异口径数值混入同一排序
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| E07-a | 名次清单 + 未排区 | relation:sequence spatial:stack path:linear load:missing expression:baseline | candidate | 依据和方向在上，缺数据对象单列并写原因 |
| E07-b | 排序条 + 参考线 | relation:sequence spatial:stack path:compare load:missing expression:graphic | candidate | 条长显出名次间距不均；参考值用贯穿虚线而非参与排序 |
| E07-c | 换依据后的名次对照 | relation:before-after spatial:juxtapose path:compare expression:spatial | candidate | 两份排名连线，完全交叉显示“最好取决于依据”；≤6 对象 |
| E07-d | 正负值 + 长数值 + 异口径 | relation:sequence spatial:stack load:long-title/long-number/missing expression:baseline | stress | 负数=节省易误读；异口径金额移出排序；排序第一≠推荐 |
| E07-e | 无依据的奖牌榜 | relation:sequence spatial:stack path:scan expression:graphic | failed | 无依据、无方向、无值，缺数据对象被排成末位 |

## E08 · 取舍 · Trade-off

- 层级：atom；家族：enum；位置：[atoms/enum.html#E08](atoms/enum.html#E08)
- 职责：看清选这条路得到什么、放弃什么，每项得的代价在哪里
- 输入：必需：选项与参照（相对谁）、得若干、失若干；可选：共同维度、量化值与单位、确定程度
- 适用：单一方案的得失
- 不适合：多方案并排（E09）；只有一侧（文本家族论证原子）
- 容量：每侧 2–5 项
- 已见失败：失缩成脚注；把人次与金额相加求净值；只靠红绿区分；把前提条件当成代价
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| E08-a | 得 / 失两栏 | relation:pro-con spatial:juxtapose path:compare expression:baseline | candidate | 两栏等权；配对靠读者自己 |
| E08-b | 按维度成对 | relation:pro-con spatial:juxtapose path:compare expression:spatial | candidate | 维度作行首，得失同行对峙；“周二”一行显出方向相反 |
| E08-c | 分单位账本 + 交换率 | relation:pro-con spatial:juxtapose path:compare expression:graphic | candidate | 两本账不相加、不画长度；交换率 ¥66 < ¥116 是新判断 |
| E08-d | 不对称 + 不确定 | relation:certain-uncertain spatial:juxtapose load:long/exception expression:baseline | stress | 推测/实测/确定标签显出不对称；门槛不属于“失” |
| E08-e | “失”藏进脚注 | relation:pro-con spatial:stack path:linear expression:editorial | failed | 视觉权重失衡，把取舍伪装成推荐 |

## E09 · 方案与推荐 · Options and recommendation

- 层级：atom；家族：enum；位置：[atoms/enum.html#E09](atoms/enum.html#E09)
- 职责：看到所有方案同口径对照，再看作者推荐哪个、为什么、条件变化时怎样
- 输入：必需：方案（名称、内容）、共同字段（同单位同口径）、推荐项、理由；可选：成立条件/门槛、重评时点
- 适用：决定会材料
- 不适合：不推荐（用 E06）；只有一个方案（文本家族行动请求）
- 容量：2–4 方案 × 3–5 字段
- 已见失败：推荐只靠颜色；条件藏在星号；到馆口径混用增量与总量；某列只有部分方案有值
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| E09-a | 方案表 + 推荐列 + 条件行 | relation:multi spatial:stack path:compare expression:baseline | candidate | 推荐=文字列+▶+左粗线；条件独立行贴在 A 下；到馆统一为相对现状变化 |
| E09-b | 先中立陈列，后推荐 | relation:claim-evidence spatial:stack path:linear expression:editorial | candidate | 陈列与主张分两节，陈列声明顺序不代表偏好 |
| E09-c | 门槛图 | relation:certain-uncertain spatial:juxtapose path:drill expression:graphic | candidate | 推荐是条件的输出；当前分支用粗框+“当前”文字 |
| E09-d | 长题 + 长数值 + 真零 + 推测 | relation:multi spatial:stack load:long-title/long-number/zero/missing expression:baseline | stress | 换口径后推荐项反而缺值；真零与未采集区分 |
| E09-e | 只靠颜色推荐 | relation:multi spatial:juxtapose path:compare expression:graphic | failed | 蓝底=推荐不可辨；口径不一；条件归属不明 |

## E10 · 值状态：缺失、零、不适用 · Value state

- 层级：atom；家族：enum；位置：[atoms/enum.html#E10](atoms/enum.html#E10)
- 职责：看到空位时分辨：量过是 0；本该有但未采集；对该对象不成立
- 输入：必需：状态（值/零/缺失/不适用）；可选：原因短语
- 适用：E04–E09 所有比较单元格；数量家族图表空条
- 不适合：单独使用（嵌入型原子）
- 容量：一格一状态，原因 ≤6 字
- 已见失败：三态都画“—”；缺失画成长度 0 的条；零用灰色像无数据；“停开”这类例外无编码
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| E10-a | 文字状态 | relation:multi spatial:inline path:scan load:missing/zero expression:baseline | candidate | 零=普通数字；缺失=斜体虚下划线；不适用=小号淡字；本页通用类 e-v--* |
| E10-b | 格底纹编码 | relation:multi spatial:embed path:scan load:missing/zero expression:graphic | candidate | 缺失虚线框、不适用斜线底，可扫出“还缺什么” |
| E10-c | 条形图中的三种空 | relation:multi spatial:stack path:compare load:missing/zero expression:graphic | candidate | 零=轨道+刻线；缺失=斜线轨道；不适用=无轨道 |
| E10-d | 长原因与混合状态 | relation:multi spatial:embed load:dense/missing/zero/exception expression:baseline | stress | “停开”是三态装不下的第四态（例外） |
| E10-e | 一律画横线 | relation:multi spatial:embed path:scan load:missing/zero expression:baseline | failed | 0、不适用、未采集同为“—” |

## Q01 · 指标及上下文 · Metric in context

- 层级：atom；家族：quantity；位置：[atoms/quantity.html#Q01](atoms/quantity.html#Q01)
- 职责：判断一个数算多还是少
- 输入：必需：指标名、值、单位、时间范围/口径期、基准（或明写“未设基准”）；可选：差值、样本量
- 适用：一段里只需记住一个量；决定段首个论据
- 不适合：要看形状（Q10）或部分（Q05）；只有值无任何基准时不宜放大成大数字
- 容量：单指标 1 值 + 1 基准；簇状 ≤ 6
- 已见失败：只有大数字无单位与期间；长金额在大字号下撑破窄屏；缺失写成 0 或空白；▲ 无参照、靠绿色暗示好坏
- 来路：original-this-run；借用 C05（直接标值、精确值可查、缺失与零区分；改动：从 CW 使用量图的数据约定移植到合成的图书馆 fixture；以 HTML 条/表为主、SVG 只在折线处使用；增加“不适用”作为第三种空值；不把零起点泛化到折线与迷你图（Q10-a 选择零起点、Q10-c 明示截断））
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| Q01-a | 指标块 | relation:single spatial:stack path:linear load:short expression:baseline | candidate | 名→值→期间→基准四行；缺基准时写“未设目标”而不删行 |
| Q01-b | 句中标值 | relation:single spatial:inline path:linear load:short expression:editorial | candidate | 值嵌入命题句，期间降到脚注；只在全段一个关键量时成立 |
| Q01-c | 零起点刻度条 | relation:single spatial:juxtapose path:compare load:short expression:graphic | candidate | 值与目标在同一 0 起刻度上，超出部分成为长度；量级差过大时失效 |
| Q01-d | 指标簿（值列对齐、基准在边栏） | relation:multi spatial:main-margin path:scan load:dense expression:spatial | candidate | 多指标值列右对齐扫描，基准/差在边栏，“未设目标”为明文占位 |
| Q01-e | 长金额 | relation:whole-part spatial:stack path:linear load:long-number expression:baseline | stress | S2 13 字符金额用 cqi 字号 + nowrap；无基准须明写 |
| Q01-f | 缺失与零并置 | relation:multi spatial:juxtapose path:compare load:missing expression:baseline | stress | 未采集用虚线框文字占值位，0 按普通数字排印 |
| Q01-g | 无上下文 KPI 砖 | relation:single spatial:stack load:short expression:graphic | failed | 无单位、期间、基准；好坏只靠绿三角 |

## Q02 · 数值变化 · Change

- 层级：atom；家族：quantity；位置：[atoms/quantity.html#Q02](atoms/quantity.html#Q02)
- 职责：判断从哪到哪、变了多少、往哪个方向
- 输入：必需：前值、后值（同口径）、两端时点/状态、方向（文字或符号）；可选：绝对差、相对差、不可比说明
- 适用：两点比较；方案相对现状的增减
- 不适合：中间过程重要（Q10）；两端口径不同（开放晚数不同）
- 容量：1–4 组变化
- 已见失败：只给百分比不给基数；比较不可比两期；方向只靠红绿；总额混入增量列表
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| Q02-a | 前 → 后 · 差 | relation:before-after spatial:inline path:linear load:short expression:baseline | candidate | 一行读完，终点选择的理由作为附注属于原子本身 |
| Q02-b | 零起点刻度上的箭头 | relation:before-after spatial:embed path:compare load:short expression:graphic | candidate | 起点空心、终点箭头，增量相对整体大小可见 |
| Q02-c | 变化量作主角 | relation:before-after spatial:offset path:linear load:short expression:editorial | candidate | 相对变化悬挂放大，基数紧跟在下一句；小基数时不可用 |
| Q02-d | 两栏并置、差在栏间 | relation:before-after spatial:juxtapose path:compare load:short expression:spatial | candidate | 差值住在栏间沟里并有连接线；窄屏改竖向 |
| Q02-e | 正负混合、长金额 | relation:multi spatial:stack path:compare load:long-number expression:baseline | stress | 0 为中轴的发散条 + “增加/减少”文字；S2 小数点无法对齐；总额混入需虚线区隔 |
| Q02-f | 不可比两期的环比下降 | relation:before-after spatial:inline load:exception expression:graphic | failed | 第 26 周只开 4 晚，−9% 实为口径差；按馆·晚反而上升 |

## Q03 · 基准差异 · Gap to reference

- 层级：atom；家族：quantity；位置：[atoms/quantity.html#Q03](atoms/quantity.html#Q03)
- 职责：判断离参考线多远、在哪一边
- 输入：必需：对象、值、参考值及其身份（目标/盈亏线/日间）、差（绝对或倍数）；可选：刻度范围
- 适用：“低于盈亏线”“是日间 3 倍”这类判断；多对象各自对照
- 不适合：参考线未定义或不可信；差很小时用 Q01 上下文行即可
- 容量：1–6 行；不同单位不能共用一把刻度
- 已见失败：未标明的截断轴；参考线只靠颜色；未采集画成零长度条；以平均值为参考造成必然对称
- 来路：original-this-run；借用 C05（直接标值、精确值可查、缺失与零区分；改动：从 CW 使用量图的数据约定移植到合成的图书馆 fixture；以 HTML 条/表为主、SVG 只在折线处使用；增加“不适用”作为第三种空值；不把零起点泛化到折线与迷你图（Q10-a 选择零起点、Q10-c 明示截断））
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| Q03-a | 值 · 参考 · 差 三列 | relation:multi spatial:stack path:scan load:short expression:baseline | candidate | 每行参考自带身份；窄屏收成带列名的行组 |
| Q03-b | 子弹条：每行自有零起点刻度 | relation:multi spatial:embed path:compare load:short expression:graphic | candidate | 条=值、竖线=参考、直接标值；须声明只比较行内 |
| Q03-c | 倍数作标题的分式 | relation:single spatial:offset path:linear load:short expression:editorial | candidate | 倍数悬挂、分子分母真分式并列；只适用单对值 |
| Q03-d | 参考线作中轴的偏离比例 | relation:multi spatial:offset path:compare load:short expression:spatial | candidate | 换算为偏离 % 后跨单位共用中轴；代价是扭曲严重程度与百分点 |
| Q03-e | 低于参考、未采集、不适用 | relation:multi spatial:embed path:compare load:missing expression:graphic | stress | 三种“无条”各自编码；平均值作参考造成对称假象 |
| Q03-f | 未标明的截断轴 | relation:multi spatial:juxtapose load:short expression:graphic | failed | 纵轴从 30 起无刻度，38/60 被夸大成 1:3.7 |

## Q04 · 分布 · Distribution

- 层级：atom；家族：quantity；位置：[atoms/quantity.html#Q04](atoms/quantity.html#Q04)
- 职责：判断集中在哪、散到哪、有多少说不清
- 输入：必需：有序类别、占比或计数、分母及口径、缺失类；可选：累计占比、组距
- 适用：3–8 个有序分组
- 不适合：无序类别份额（Q05）；组距不等却用面积编码
- 容量：3–8 组 + 1 缺失组
- 已见失败：未填写混入序列或被丢弃；取整余差不说明；不等组距的面积误导；人次分布当人分布
- 来路：original-this-run；借用 C05（直接标值、精确值可查、缺失与零区分；改动：从 CW 使用量图的数据约定移植到合成的图书馆 fixture；以 HTML 条/表为主、SVG 只在折线处使用；增加“不适用”作为第三种空值；不把零起点泛化到折线与迷你图（Q10-a 选择零起点、Q10-c 明示截断））
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| Q04-a | 有序行 + 行内条 | relation:multi spatial:stack path:scan load:missing expression:baseline | candidate | 按年龄序，未填写在虚线下斜纹单列 |
| Q04-b | 有序柱 + 脱离的缺失柱 | relation:multi spatial:juxtapose path:compare load:missing expression:graphic | candidate | 峰值一眼可见；缺失柱以间隙+纹理区隔；须写明组距不等 |
| Q04-c | 分组点阵 + 读法句 | relation:whole-part spatial:embed path:linear load:short expression:editorial | candidate | 100 点按组分块，句子给读法；只在整数且合计 100 时成立（依赖 CSS round()/mod()） |
| Q04-d | 累计标尺 | relation:sequence spatial:span path:drill load:missing expression:spatial | candidate | 回答“某年龄以下占多少”；窄屏标记改竖排 |
| Q04-e | 换算计数与四舍五入余差 | relation:multi spatial:stack path:scan load:dense expression:baseline | stress | 12,479 ≠ 12,480 必须显式；人次≠人 |
| Q04-f | 组距当宽度的面积直方 | relation:multi spatial:juxtapose load:short expression:graphic | failed | 面积=占比×跨度，50+ 看起来大于 18–24；未填写被丢 |

## Q05 · 组成 · Composition

- 层级：atom；家族：quantity；位置：[atoms/quantity.html#Q05](atoms/quantity.html#Q05)
- 职责：判断整体由什么构成、哪部分占大头
- 输入：必需：整体值及单位、部分名、份额、合计；可选：部分绝对值、部分性质
- 适用：2–6 部分的构成
- 不适合：部分有重叠或未计；需同时比较不同整体的总量
- 容量：2–6 部分；<5% 合并
- 已见失败：环图只靠图例色；合计 99/101% 不说明；性质不同的部分同条相加
- 来路：original-this-run；借用 C05（直接标值、精确值可查、缺失与零区分；改动：从 CW 使用量图的数据约定移植到合成的图书馆 fixture；以 HTML 条/表为主、SVG 只在折线处使用；增加“不适用”作为第三种空值；不把零起点泛化到折线与迷你图（Q10-a 选择零起点、Q10-c 明示截断））
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| Q05-a | 部分表 + 合计行 | relation:whole-part spatial:stack path:scan load:short expression:baseline | candidate | 降序，占比与金额两列，合计行确认整体 |
| Q05-b | 100% 条带 + 直接标签 | relation:whole-part spatial:span path:scan load:short expression:graphic | candidate | 标签在段正下方同宽格；窄屏转为带段号色块的列表 |
| Q05-c | 主部分先行的句子 | relation:whole-part spatial:inline path:linear load:short expression:editorial | candidate | 主部分进大字句，其余 run-in；势均力敌时不成立 |
| Q05-d | 瀑布累加 | relation:sequence spatial:offset path:linear load:short expression:spatial | candidate | 每段从上一段末端起，读“去掉某项剩多少” |
| Q05-e | 两部分、长金额 | relation:whole-part spatial:span path:compare load:long-number expression:graphic | stress | 长金额标签须能折行；一次性与经常性同条相加的口径问题 |
| Q05-f | 图例配色的环图 | relation:whole-part spatial:juxtapose load:short expression:graphic | failed | 四个相近蓝色靠图例、无数值、无整体 |

## Q06 · 区间与不确定性 · Interval & uncertainty

- 层级：atom；家族：quantity；位置：[atoms/quantity.html#Q06](atoms/quantity.html#Q06)
- 职责：判断数能信到什么程度、可能偏向哪边
- 输入：必需：点估计、区间及类型、样本量/分母、未量化偏差的来源与方向；可选：放大刻度
- 适用：问卷比例、估算、预测
- 不适合：记录值（闸机计数）不需要区间；未量化偏差不能画成区间
- 容量：1–4 个估计
- 已见失败：± 不说明含义；抽样误差与选择偏差混为一谈；受访者外推为全体读者
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| Q06-a | 估计 · 区间 · 限定 | relation:certain-uncertain spatial:stack path:linear load:short expression:baseline | candidate | 区间紧跟点估计并写类型；主体写“问卷受访者” |
| Q06-b | 全刻度 + 标明的放大段 | relation:certain-uncertain spatial:embed path:drill load:short expression:graphic | candidate | 截断轴被显式标注并与全刻度相连；偏差只画方向不画端点 |
| Q06-c | 模糊化主句 + 边注限定 | relation:claim-evidence spatial:main-margin path:adjacent load:short expression:editorial | candidate | 主句用与精度相称的“约八成”，精确值与限定在边注 |
| Q06-d | 两种不确定性分道 | relation:certain-uncertain spatial:juxtapose path:compare load:short expression:spatial | candidate | 已量化（实框）与未量化（开口虚框）平行 |
| Q06-e | 确定程度不一的估计并列 | relation:multi spatial:stack path:scan load:missing expression:baseline | stress | 有 CI / 未报告 / 不适用三种空区间；“性质”列越界到方法说明 |
| Q06-f | 未说明的 ± 与越界的主体 | relation:single spatial:inline load:short expression:graphic | failed | ±3 含义不明，“读者”过度外推 |

## Q07 · 时间事件 · Dated events

- 层级：atom；家族：quantity；位置：[atoms/quantity.html#Q07](atoms/quantity.html#Q07)
- 职责：判断什么时候发生了什么、现在在哪、还剩什么
- 输入：必需：日期或日期区间、事件、状态（已发生/未发生/例外）、“今天”；可选：间隔、责任方
- 适用：3–12 个事件的历程、决策前时间线
- 不适合：只有先后没有日期（枚举家族有序步骤）；日内流程（Q09）
- 容量：水平比例轴 ≤ 10 事件；更多用列表
- 已见失败：等距排布暗示等间隔；状态只靠颜色；区间事件画成点；缺“今天”
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| Q07-a | 日期列表 | relation:sequence spatial:stack path:scan load:short expression:baseline | candidate | 今天作为列表中的一行插入；状态=文字+形状 |
| Q07-b | 比例时间轴（窄屏按间隔留白的竖排） | relation:sequence spatial:span path:scan load:short expression:graphic | candidate | 位置按真实天数；< 720px 转竖排，上间距 ∝ 间隔天数，永不重叠 |
| Q07-c | “今天”分割的过去与未来 | relation:sequence spatial:stack path:linear load:short expression:editorial | candidate | 过去压成清单，未来倒计时放大；未来事件多时不成立 |
| Q07-d | 按性质分道的月栅格 | relation:parallel spatial:offset path:scan load:exception expression:spatial | candidate | 例外有自己的道；≥ 900px 才启用月栅格，否则退化为分组列表 |
| Q07-e | 区间事件、长议题、长 token | relation:sequence spatial:stack path:scan load:long-title expression:baseline | stress | 区间日期两行；长 token 任意断行；状态顶对齐 |
| Q07-f | 等距箭头链 + 仅颜色状态 | relation:sequence spatial:span load:short expression:graphic | failed | 等距、无日期、红绿灰、无今天——是顺序不是时间 |

## Q08 · 状态 · Status

- 层级：atom；家族：quantity；位置：[atoms/quantity.html#Q08](atoms/quantity.html#Q08)
- 职责：判断每个对象此刻处于什么状态、截至何时
- 输入：必需：对象、状态（封闭词表）、截至日期，状态用文字+形状；可选：限定、下一步
- 适用：多个同类对象的盘点
- 不适合：状态变化才是重点（Q07/Q10）；词表不封闭
- 容量：2–12 对象 × 1–4 维度
- 已见失败：红黄绿灯无文字；缺截至时点；三种空值都画成空格
- 来路：original-this-run；借用 C05（直接标值、精确值可查、缺失与零区分；改动：从 CW 使用量图的数据约定移植到合成的图书馆 fixture；以 HTML 条/表为主、SVG 只在折线处使用；增加“不适用”作为第三种空值；不把零起点泛化到折线与迷你图（Q10-a 选择零起点、Q10-c 明示截断））
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| Q08-a | 对象—状态—限定 | relation:multi spatial:stack path:scan load:short expression:baseline | candidate | 封闭词表 + 形状标签 + 同行限定；截至日在标题 |
| Q08-b | 对象 × 维度 形状矩阵 | relation:multi spatial:juxtapose path:compare load:dense expression:graphic | candidate | 满/半/空/斜杠圆/斜纹方块；窄屏每馆一组，列名作格前缀（thead 隐藏，靠 ::before 标签） |
| Q08-c | 示意分区图上的状态 | relation:multi spatial:distant path:adjacent load:short expression:spatial | candidate | synthetic 示意图，非地图；空间与决策相关时才成立；窄屏按北→南排列 |
| Q08-d | 句内状态标记 | relation:multi spatial:inline path:linear load:short expression:editorial | candidate | 状态标签嵌入叙述句；对象 ≤ 4 |
| Q08-e | 未采集 · 0 · 不适用 | relation:multi spatial:juxtapose path:compare load:missing expression:baseline | stress | 三种空各有样式；北站缺失原因两层，一个标签装不下 |
| Q08-f | 红黄绿灯 | relation:multi spatial:stack load:short expression:graphic | failed | 只靠颜色、无时点、灰色合并两种不同原因 |

## Q09 · 流转与例外分支 · Flow & exception branch

- 层级：atom；家族：quantity；位置：[atoms/quantity.html#Q09](atoms/quantity.html#Q09)
- 职责：判断正常路径、在哪岔出、岔出后回到哪里或终止
- 输入：必需：有序主线步骤、分支触发条件、分支动作、汇合点或明确终止；可选：时刻、角色、实例、反馈
- 适用：操作/审批流程，1 主线 + 1–4 分支
- 不适合：多条等重并行路径（状态机/决策树）；只有依赖没有顺序
- 容量：主线 3–8 步；分支 > 4 改“主线 + 分支表”
- 已见失败：分支无汇合点；分支与主线等重；实例当规则；自回环写成“回到第 N 步”
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| Q09-a | 有序列表 + 内嵌“若…则…” | relation:sequence spatial:stack path:linear load:exception expression:baseline | candidate | 固定词“若/则/回到第 N 步”，实例与规则分开 |
| Q09-b | 主线横排、分支下垂回流 | relation:sequence spatial:span path:linear load:exception expression:graphic | candidate | HTML/CSS 网格而非 SVG；窄屏竖排、分支缩进挂在 ③④ 之间（display:contents + order） |
| Q09-c | 角色泳道 × 时刻 | relation:parallel spatial:juxtapose path:scan load:exception expression:spatial | candidate | 谁在何时做什么；窄屏退化为每道带时刻前缀的列表，同列对照丢失 |
| Q09-d | 时刻悬挂的叙述 + 分支旁白 | relation:sequence spatial:main-margin path:linear load:exception expression:editorial | candidate | 时刻在页边，分支作旁白插在触发点与汇合点之间 |
| Q09-e | 多个分支、终止分支、长 token | relation:sequence spatial:stack path:drill load:dense expression:baseline | stress | 一步三分支是容量上限；终止分支须异形；自回环语义不清 |
| Q09-f | 无汇合点、与主线等重的分支 | relation:sequence spatial:juxtapose load:exception expression:graphic | failed | 两行等重方框，提醒之后去向不明 |

## Q10 · 趋势序列 · Trend series

- 层级：atom；家族：quantity；位置：[atoms/quantity.html#Q10](atoms/quantity.html#Q10)
- 职责：判断整体走向、哪里偏离、偏离是否可解释
- 输入：必需：≥ 5 点等间隔序列、时间单位与起止、数值单位、例外点及原因；可选：目标线、每期可比性、归一化序列
- 适用：需要看形状、拐点和例外
- 不适合：只有首尾两点（Q02）；各期口径不同却不归一化
- 容量：单序列 5–60 点；多序列 ≤ 3 且直接标注
- 已见失败：截断纵轴未标明；平滑掩盖例外；例外不解释；窄屏 SVG 字缩到不可读
- 来路：original-this-run；借用 C05（直接标值、精确值可查、缺失与零区分；改动：从 CW 使用量图的数据约定移植到合成的图书馆 fixture；以 HTML 条/表为主、SVG 只在折线处使用；增加“不适用”作为第三种空值；不把零起点泛化到折线与迷你图（Q10-a 选择零起点、Q10-c 明示截断））
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| Q10-a | 零起点折线 + 直接标注 | relation:sequence spatial:span path:scan load:exception expression:baseline | candidate | 宽/窄两张 SVG 由 container query 切换，窄版标签改编号+HTML 图注；精确值在 details |
| Q10-b | 26 根柱（窄屏转横条） | relation:sequence spatial:span path:scan load:exception expression:graphic | candidate | 同一 <ol> 宽屏为柱、窄屏为 26 行横条；例外斜纹+原因 |
| Q10-c | 句中迷你图 | relation:sequence spatial:inline path:linear load:exception expression:editorial | candidate | 截断轴有意且脚注写明；图只表形状 |
| Q10-d | 周序查找格 | relation:sequence spatial:offset path:revisit load:exception expression:spatial | candidate | 数值为主、长度降为格底细条；宽屏两行 13 格前后半段对齐 |
| Q10-e | 分母改变后例外反转 | relation:before-after spatial:juxtapose path:compare load:exception expression:baseline | stress | 按周是低谷，按馆·晚是高点；并列两种口径 |
| Q10-f | 截断轴 + 例外不解释 | relation:sequence spatial:span load:exception expression:graphic | failed | 300 起无刻度、无单位、标题与画面矛盾 |

## V01 · 引文 · Quotation

- 层级：atom；家族：evidence；位置：[atoms/evidence.html#V01](atoms/evidence.html#V01)
- 职责：确认一句原话是谁、何时、在哪份材料里说的，它能代表多少人，有无反向声音
- 输入：必需：原话、定位（编号/回收时间）、身份；可选：反向引文、比例数字、省略/插入标记
- 适用：需要具体读者的语气或为比例数字提供实例
- 不适合：用单条原话证明普遍性；需要大量改写才读通（应改为转述并标明）
- 容量：一条 ≤60 字；两条可并置；≥3 条回到数量或列表
- 已见失败：无定位 pull quote 被读成结论；省略改变原意（删掉前半句）；反向引文被删；编辑符号 [ ] …… 不解释被读成原文
- 来路：original-this-run；借用 kit-evidence（证据身份（事实/观察/转述/推断/假设/构造例子）；改动：拆为 测量/观察/原话/转述/推断/假设/构造 七个页面标签；‘事实’改称‘测量’以强调来自计数，‘原话’从转述中分出（未改写）；每类配不同边框形状作冗余编码）；kit-exhibits（‘引文保留原意和定位’；改动：具体化为定位行字段与省略/插入图例）
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| V01-a | 块引＋定位行 | relation:single spatial:stack path:linear load:short expression:baseline | candidate | 定位行与引文同属 figure，紧贴下方 |
| V01-b | 正反并置 | relation:pro-con spatial:juxtapose path:compare load:short expression:editorial | candidate | 同基线同字号并置正反原话，底行把单条接回比例；仅在存在有代表性的反向原话时成立 |
| V01-c | 正文内嵌＋边注定位 | relation:claim-evidence spatial:main-margin path:adjacent load:short expression:spatial | candidate | 只引半句入正文，定位与省略说明放同高边注；正文转述与边注原话标签不同 |
| V01-d | 长引文：省略、插入与上下文 | relation:multi spatial:stack path:linear load:long expression:baseline | stress | 一条回答同时含支持与反对，编辑符号需在定位行解释 |
| V01-e | 无定位 pull quote 充当结论 | relation:single spatial:span load:short expression:graphic | failed | 视觉强度超过证据强度：无定位、删半句、推成‘普遍期待’、反向消失 |

## V02 · 证据摘录 · Record excerpt

- 层级：atom；家族：evidence；位置：[atoms/evidence.html#V02](atoms/evidence.html#V02)
- 职责：确认记录原文写了什么、哪天哪个馆，哪些是记录、哪些是解读者加的
- 输入：必需：原文、记录类型、日期、地点、条目定位；可选：上下文条目、解读、缺失项说明
- 适用：带时间戳的原始记录支撑具体事实
- 不适合：单晚记录代表整个试点；解读放进引号
- 容量：1–3 条原文；更多用带选中标记的上下文块
- 已见失败：转述冒充摘录（外壳相同）；时间轴把未记录时刻画成确定点；略去条目不留编号无法核对
- 来路：original-this-run；借用 kit-evidence（证据身份（事实/观察/转述/推断/假设/构造例子）；改动：拆为 测量/观察/原话/转述/推断/假设/构造 七个页面标签；‘事实’改称‘测量’以强调来自计数，‘原话’从转述中分出（未改写）；每类配不同边框形状作冗余编码）
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| V02-a | 记录头＋原文 | relation:single spatial:stack path:linear load:short expression:baseline | candidate | 身份头在前、时间戳作行首锚点；与引文的差别是先交代记录再读内容 |
| V02-b | 主张在主列，摘录挂在旁边 | relation:claim-evidence spatial:main-margin path:adjacent load:short expression:spatial | candidate | 连接线＋不同身份标签（推断 vs 观察）＋范围说明紧贴摘录 |
| V02-c | 摘录落在时间条上 | relation:certain-uncertain spatial:embed path:scan load:missing expression:graphic | candidate | 实心点=已知时刻，悬空虚线段=只知时长不知落点；只有 ≥2 个时间信息时成立 |
| V02-d | 带上下文的摘录（选中＋省略） | relation:multi spatial:embed path:drill load:dense expression:baseline | stress | 保留略去条目编号才能核对 4/7；缺时刻用 — 并文字说明 |
| V02-e | 转述冒充摘录 | relation:single spatial:stack load:short expression:baseline | failed | 引号内是解读，原事实（12 分钟清场完毕）消失 |

## V03 · 截图与局部标注 · Screenshot with callouts

- 层级：atom；家族：evidence；位置：[atoms/evidence.html#V03](atoms/evidence.html#V03)
- 职责：确认截图哪块是证据、显示什么值、截图是真实系统还是合成界面
- 输入：必需：截图、真实/合成身份、时间与系统定位、≥1 个标注（HTML 文字）；可选：放大局部、原始接口调用
- 适用：证据只存在于界面状态里
- 不适合：数值可直接从数据导出；标注 >5 个
- 容量：1–4 个标注，每个 ≤2 行
- 已见失败：说明烤进图片；标注遮住证据（窄屏时钉子盖住 ‘/ 120’，已改位）；合成界面不标身份；截图推出的比例无分母；长 token 在截图里被截断，关键参数丢失
- 来路：original-this-run；借用 kit-evidence（证据身份（事实/观察/转述/推断/假设/构造例子）；改动：拆为 测量/观察/原话/转述/推断/假设/构造 七个页面标签；‘事实’改称‘测量’以强调来自计数，‘原话’从转述中分出（未改写）；每类配不同边框形状作冗余编码）；brief（不能以图片中的文字替代正文；改动：落实为：截图 SVG 只作‘图片’，标注与关键数值全部 HTML）
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| V03-a | 编号钉＋图下编号说明 | relation:whole-part spatial:stack path:drill load:short expression:baseline | candidate | 画面当图片，说明全在 HTML；synthetic 以画框顶部斜纹标签呈现 |
| V03-b | 画面＋侧栏标注对齐 | relation:whole-part spatial:main-margin path:adjacent load:short expression:spatial | candidate | 标注按画面纵向位置对齐（≥820px 容器）；钉距近时重叠，需手工 --y，不自动避让 |
| V03-c | 全图缩略＋放大局部 | relation:whole-part spatial:juxtapose path:drill load:short expression:graphic | candidate | 缩略定位、放大识读、HTML 大号数字为准；证据是界面上一小块时成立 |
| V03-d | 截图被截断的长 token（S7） | relation:whole-part spatial:stack path:drill load:mixed-script expression:baseline | stress | 完整调用只能在 HTML 标注中给出；被截掉的恰是时间与时区 |
| V03-e | 说明烤进图片 | relation:single spatial:embed load:short expression:graphic | failed | 图中文字不可选/不可重排，色块遮挡证据，无分母无时刻，无 synthetic 标记 |

## V04 · 示例推算 · Worked example

- 层级：atom；家族：evidence；位置：[atoms/evidence.html#V04](atoms/evidence.html#V04)
- 职责：确认派生指标（每次到馆成本 ¥116）由哪些数、按什么口径算出，换口径变多少
- 输入：必需：每步输入值（单位、来源）、运算、中间结果、取整规则；可选：替代口径、分项拆解
- 适用：派生指标进入决策比较
- 不适合：口径无争议且读者只需结果；>6 步
- 容量：3–5 步，每步一个运算
- 已见失败：只给公式名不给数；隐含假设（按计划时段、两馆等时）不写；与日间 ¥38 比较时口径未知
- 来路：original-this-run；借用 kit-evidence（证据身份（事实/观察/转述/推断/假设/构造例子）；改动：拆为 测量/观察/原话/转述/推断/假设/构造 七个页面标签；‘事实’改称‘测量’以强调来自计数，‘原话’从转述中分出（未改写）；每类配不同边框形状作冗余编码）
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| V04-a | 逐步列式 | relation:sequence spatial:stack path:linear load:short expression:baseline | candidate | 步骤名/算式/结果三列，结果右对齐可竖核；口径紧跟最后一步 |
| V04-b | 算式带（单位挂在数下） | relation:sequence spatial:inline path:linear load:long-number expression:graphic | candidate | 一行算式，单位与来源挂在数字正下方；≤4 项且只有乘除时成立 |
| V04-c | 正文推导＋每个数的边注出处 | relation:claim-evidence spatial:main-margin path:revisit load:short expression:editorial | candidate | 先结论后回看；编辑化写法容易掩盖 ¥38 口径缺口 |
| V04-d | 两种口径并排（S5 例外） | relation:before-after spatial:juxtapose path:compare load:exception expression:baseline | stress | 扣停开只差 ¥3，分馆差异 ¥85 vs ¥171 才是关键 |
| V04-e | 只有公式名 | relation:single spatial:inline load:short expression:baseline | failed | 无单位、无范围、无输入值，不能复算 |

## V05 · 展项框架 · Exhibit frame

- 层级：atom；家族：evidence；位置：[atoms/evidence.html#V05](atoms/evidence.html#V05)
- 职责：确认一个图/表回答什么问题、看什么范围、注意哪里、限定过的结论、来源与计算
- 输入：标题、description、主体（图/表）、annotation、caption、source、method note；按需出现
- 适用：任何作为主证据的图、表、截图、示例
- 不适合：正文顺带提及的单个数字
- 容量：主体 1；annotation ≤3；caption 1–2 句
- 已见失败：caption 重复标题；无来源/方法；annotation 只靠颜色；长决策问题直接当展项标题，只能回答其中一部分；375 下 SVG 文字过小（已改为窄容器切换精简 SVG）
- 来路：original-this-run；借用 kit-exhibits（标题/Description/主体/Annotation/Caption/Source/Method note 七项职责表；改动：V05-c 页边标签把职责缩写为 ‘回答的问题/看什么、范围/承载数量/例外、方向/可独立理解的结论/身份、时间、定位/影响判断的条件’；新增 description 的职责‘声明回答标题哪一部分’（V05-e））
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| V05-a | 纵向装配 | relation:whole-part spatial:stack path:linear load:short expression:baseline | candidate | 按阅读需要自上而下；来源/方法同一行但各带标签 |
| V05-b | 主体居中、成分分到两侧栏 | relation:whole-part spatial:main-margin path:adjacent load:short expression:spatial | candidate | 左=读图前（范围/来源/方法），右=读图后（例外/结论）；窄屏回落等于 V05-a |
| V05-c | 展项解剖：成分职责标在页边 | relation:whole-part spatial:offset path:scan load:short expression:editorial | candidate | 审稿/模板视图，一眼看出缺哪项、哪项重复；对外交付去掉页边 |
| V05-d | 同一框架、主体换成表 | relation:whole-part spatial:stack path:scan load:short expression:baseline | candidate | annotation 变为行内记号＋表下注；汇总引入新方法条件 |
| V05-e | 长标题＋缺失分馆（S1、S3） | relation:whole-part spatial:stack path:linear load:long-title expression:baseline | stress | description 须声明本展项只回答标题哪一部分；缺失行文字占位 |
| V05-f | 成分重复、缺失、只靠颜色 | relation:whole-part spatial:stack load:short expression:graphic | failed | caption=标题、无 description/来源/方法、红绿达标且例外与常态同色 |

## V06 · 来源、脚注与方法说明 · Source, note, method

- 层级：atom；家族：evidence；位置：[atoms/evidence.html#V06](atoms/evidence.html#V06)
- 职责：区分数从哪来（来源）、旁支信息（脚注）、会改变结论的产生条件（方法），并按其作用决定离主张多远
- 输入：主张句；来源（身份、时间、定位）；脚注；方法说明
- 适用：任何带数字或引用的主张
- 不适合：—
- 容量：每主张 1 个来源锚点；脚注 ≤2；方法 1–3 句
- 已见失败：方法沉到尾注，读者判断后才看到偏差；三类附注同一上标样式；零与缺失共用 — 或空白
- 来路：original-this-run；借用 kit-exhibits（Source 与 Method note 的职责区分；改动：补充‘脚注’作为第三类（旁支信息，不影响本句判断），并以邻接距离编码三者）；kit-evidence（‘会改变判断的条件仍在读者作判断之前可见’；改动：变成规则：方法说明不得进尾注，V06-e 作为反例）
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| V06-a | 来源紧邻、方法先于结论、脚注在段后 | relation:claim-evidence spatial:inline path:linear load:short expression:baseline | candidate | 三种附注三种距离与三种形状：〔 〕/带标签块/上标 |
| V06-b | 三类边注，同高对齐 | relation:claim-evidence spatial:main-margin path:adjacent load:short expression:spatial | candidate | 标签＋边线样式区分三类；正文一句显式召唤方法边注；窄屏插回对应句后 |
| V06-c | 集中尾注，但方法留在正文 | relation:claim-evidence spatial:distant path:revisit load:many-sources expression:editorial | candidate | 尾注只收‘从哪来’，改变判断强度的条件不进尾注 |
| V06-d | 零与缺失各自的来源（S3） | relation:claim-evidence spatial:inline path:scan load:zero expression:baseline | stress | 有来源的 0 / 无来源的缺失 / 定义上不存在，‘无来源’本身需显示 |
| V06-e | 方法沉到尾注 | relation:claim-evidence spatial:distant load:short expression:baseline | failed | 削弱结论的条件排在尾注第 3 条；来源拆碎；上标无区分 |

## V07 · 多来源与证据强度 · Converging sources

- 层级：atom；家族：evidence；位置：[atoms/evidence.html#V07](atoms/evidence.html#V07)
- 职责：确认同一主张有几个来源、各自能证明到什么程度、合起来是否更强，弱来源不被画成强来源
- 输入：一条主张；2–5 个来源，每个带身份、覆盖（时间/地点/样本）、强度（强/中/弱）与理由、偏差方向、彼此独立性；可选：限制来源
- 适用：一个关键主张依赖多个性质不同的来源
- 不适合：只有一个来源；独立性无法判断时不要暗示三角验证
- 容量：2–5 个来源；强度 3 档文字，不打分
- 已见失败：数来源个数当强度；等大等色图标；把定性判断画成精确百分比；同日来源不独立的信息丢失；同一来源按粒度同时支持与限制，按来源分栏会误导
- 来路：original-this-run；借用 kit-evidence（‘没有证据时写假设，不用精确图形增强确定性’；改动：延伸为强度只用三档文字＋冗余形状，禁止分数（V07-e 反例））
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| V07-a | 按强度排序的来源清单 | relation:multi spatial:stack path:linear load:many-sources expression:baseline | candidate | 排序＋文字强度＋竖线粗细冗余；总结句指出哪个来源承重及独立性 |
| V07-b | 覆盖矩阵：强度来自哪一维 | relation:multi spatial:juxtapose path:compare load:dense expression:graphic | candidate | 强度拆成覆盖/测量对象/偏差方向；格子只编码覆盖面；窄屏转为每来源一组 |
| V07-c | 距离即强度：来源挂在承重线上 | relation:claim-evidence spatial:distant path:adjacent load:many-sources expression:spatial | candidate | 垂直距离与线型（实/虚/点）冗余编码强度；多数来源同档时会被读成排序 |
| V07-d | 支持与限制同表（S4＋S5） | relation:pro-con spatial:juxtapose path:compare load:exception expression:baseline | stress | 闸机同时出现在两侧，暴露按来源分栏的缺陷；建议拆主张 |
| V07-e | 四个勾与信心百分比 | relation:multi spatial:juxtapose load:many-sources expression:graphic | failed | 等权勾选＋凭空 92%，视觉最确定、身份最模糊 |

## W01 · 章节标识 · Section marker

- 层级：atom；家族：wayfinding；位置：[atoms/wayfinding.html#W01](atoms/wayfinding.html#W01)
- 职责：确认这一段属于哪一章哪一节、处于第几层
- 输入：必需：编号或层级名、标题、层级；可选：上级路径、作者声明的短标题
- 适用：多节文档、会被跳读或从目录/交叉引用进入的位置
- 不适合：一两段的短文；标题需要承担结论时（交文本家族）
- 容量：层级 ≤ 3；标题 > 约 30 字必须声明短标题
- 已见失败：单行截断吃掉长标题句尾的决定对象；只用颜色/字号细差区分层级；无编号导致无法被引用
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| W01-a | 路径行 + 编号标题 | relation:single spatial:stack path:linear load:short expression:baseline | candidate | 路径文字说明层级，编号与标题同基线；可迁移 |
| W01-b | 悬挂章号 | relation:single spatial:offset path:linear load:short expression:editorial | candidate | 大章号悬挂左侧留白，章与节成为两个尺度；窄容器回到正文上方 |
| W01-c | 三级刻度 | relation:whole-part spatial:span path:scan load:short expression:graphic | candidate | 色块/粗线/细线 + 缩进 + 文字三重冗余编码层级，灰度可用；超过 3 层用完 |
| W01-d | S1 长标题 + 声明短标题 | relation:single spatial:offset path:linear load:long-title expression:baseline | stress | 编号悬挂、balance 换行不截断；另声明短标题供 W02/W08 复用 |
| W01-e | 单行截断 + 只靠颜色分层 | relation:single spatial:inline path:scan load:long-title expression:baseline | failed | ellipsis 截掉决定对象；层级只靠颜色；无编号（data-allow-scroll） |

## W02 · 阅读顺序与位置 · Sequence position

- 层级：atom；家族：wayfinding；位置：[atoms/wayfinding.html#W02](atoms/wayfinding.html#W02)
- 职责：确认第几节/共几节、还剩多少、下一节讲什么，决定继续、跳过或回看
- 输入：必需：当前序号、总数、前后节编号与（短）标题；可选：篇幅/估时、缺节说明
- 适用：线性论证的长文、分节阅读、读者中途离开再回来
- 不适合：无顺序的参考手册；只有 2 节
- 容量：分段进度条 ≤ 8–10 节；更多时用文字位置 + W08
- 已见失败：只有百分比没有节数；翻页链接不带标题；进度条当唯一导航；缺节不说明导致编号跳跃被误读
- 来路：original-this-run；借用 C20（阅读进度线作为单次页面反馈；改动：放在嵌套滚动示例框顶部，仅 JS 时出现、无过渡；与 sticky 逐节页眉组合，位置信息不依赖它）；C13（条目数与当前所在提示；改动：改写为‘第 n / 共 N 节’位置句，并加入缺节说明）
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| W02-a | 带标题的翻页条 | relation:sequence spatial:juxtapose path:linear load:short expression:baseline | candidate | 位置句 + 前后节编号标题；窄屏‘下一节’在前 |
| W02-b | 按篇幅分段的进度条 | relation:sequence spatial:span path:scan load:short expression:graphic | candidate | 段宽 = 估时，已读/当前/未读用填充/粗框/空心；窄屏只留编号，最短段有下限 |
| W02-c | 逐节吸附页眉 + 进度线 | relation:sequence spatial:embed path:linear load:short expression:spatial | candidate | 每节 sticky 页眉无 JS 也给出 n/6；JS 进度线无过渡；嵌套滚动框仅为模拟 |
| W02-d | S1 长标题 + S3 缺节 | relation:sequence spatial:juxtapose path:linear load:long-title expression:baseline | stress | 长标题撑高‘下一节’破坏对称；缺节须显式写出 |
| W02-e | 百分比 + 裸箭头 | relation:sequence spatial:inline path:linear load:sparse expression:baseline | failed | 百分比既非节数也非篇幅；箭头无标题、目标过小 |

## W03 · 邻接注释与边注 · Adjacent note

- 层级：atom；家族：wayfinding；位置：[atoms/wayfinding.html#W03](atoms/wayfinding.html#W03)
- 职责：在读到说法的同一视线范围内拿到它的限定或出处，判断该句要打几折
- 输入：必需：被注锚点、注释内容、对应标记；可选：注释类型（口径/来源/反向）
- 适用：注释会改变对被注句的理解（口径、例外、反向意见）
- 不适合：注释量大于正文；注释是必须先读的前提（改用 W04 或正文限定）
- 容量：边注每段 ≤ 2 条、每条 ≤ 80 字，超过即碰撞下移
- 已见失败：尾注离正文过远且无回链；边注碰撞后与锚点错位；窄屏折回时把句子切断；只在悬停时出现的注释
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| W03-a | 段后紧随注 | relation:claim-evidence spatial:stack path:adjacent load:short expression:baseline | candidate | 注释紧跟所注段，双向链接与类型词；也是窄屏折回形态 |
| W03-b | 行对齐边注，窄屏折回句后 | relation:claim-evidence spatial:main-margin path:adjacent load:short expression:spatial | candidate | 注释写在锚点句的句号之后；宽容器浮到边栏，窄容器变句后缩进块；无 JS |
| W03-c | 左侧悬挂批注 | relation:claim-evidence spatial:offset path:adjacent load:short expression:editorial | candidate | 批注挂左栏与段顶对齐，锚点为底纹短语；窄屏折到段下以 ↑ 连回 |
| W03-d | 边注碰撞 + S4 多来源 + S7 | relation:claim-evidence spatial:main-margin path:adjacent load:dense expression:spatial | stress | 一句四注：窄屏句子被切成五段，宽屏边注下移错位；S7 断在标识符内 |
| W03-e | 文末尾注、无回链 | relation:claim-evidence spatial:distant path:revisit load:short expression:baseline | failed | 关键限定离 81% 三节远，编号非链接无回链 |

## W04 · 范围说明 · Scope statement

- 层级：atom；家族：wayfinding；位置：[atoms/wayfinding.html#W04](atoms/wayfinding.html#W04)
- 职责：读结论前确认数据覆盖哪些对象、哪段时间、哪些不在内，避免外推
- 输入：必需：覆盖对象、时间窗、明确不覆盖项；可选：不覆盖原因（未采集/不适用/有意排除）、在哪里回答
- 适用：结论易被外推的节；数据有缺口；决定材料
- 不适合：覆盖显然完整；测量方法细节（交证据家族方法说明）
- 容量：覆盖 + 不覆盖 ≤ 6 项
- 已见失败：范围只在细则或折叠里；‘不覆盖’写成‘其他’；缺失/零/不适用混为一个‘—’；范围放在结论之后
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| W04-a | 含 / 不含两栏 | relation:whole-part spatial:juxtapose path:scan load:short expression:baseline | candidate | 结论前两栏并置，实线/虚线框 + 文字；窄屏堆叠 |
| W04-b | 时间窗 × 周内时段 × 分馆 | relation:whole-part spatial:span path:scan load:short expression:graphic | candidate | 年轴数据窗、七格周内、分馆方块；让‘决定会在窗外’‘周日无数据’可见 |
| W04-c | 引导句式范围 | relation:whole-part spatial:inline path:linear load:short expression:editorial | candidate | 一句带‘只看/不回答/不涉及’动词的引导句，左侧竖排悬挂标记 |
| W04-d | S3 缺失 / 零 / 不适用分列 | relation:whole-part spatial:stack path:scan load:missing expression:baseline | stress | 四种状态四种写法 + 读法列；窄屏表格重排为卡行 |
| W04-e | 大字结论 + 细则范围 | relation:whole-part spatial:distant path:linear load:short expression:graphic | failed | 11px 细则在结论之后，结论越过范围外推到北站 |

## W05 · 交叉引用 · Cross-reference

- 层级：atom；家族：wayfinding；位置：[atoms/wayfinding.html#W05](atoms/wayfinding.html#W05)
- 职责：判断要不要现在去看别处的图或段落，并在看完后回到原处
- 输入：必需：目标类型与编号、目标标题或要点、锚点；可选：方向（前/后文）、关键值预览、回链
- 适用：同一数据多处使用；论证依赖前文证据
- 不适合：目标就在相邻段落；目标需长篇上下文
- 容量：一句 ≤ 2 个引用；更多改为来源列表
- 已见失败：‘见上文’‘如前所述’无目标；‘点击这里’；只有编号无标题；跳转后无回路
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| W05-a | 编号 + 标题的行内引用 | relation:claim-evidence spatial:inline path:revisit load:short expression:baseline | candidate | 链接文字含类型编号、标题、所在节；:target 落点提示 + 回链 |
| W05-b | 边栏预览，不必跳转 | relation:claim-evidence spatial:main-margin path:adjacent load:short expression:spatial | candidate | 目标压缩成 1 值 + 1 比较放在引用句旁；窄屏折到段下 |
| W05-c | 方向与距离标记 | relation:claim-evidence spatial:inline path:revisit load:short expression:graphic | candidate | ↑前文/↓后文、隔几节、已读/未读；实心与虚线两种形状 |
| W05-d | S4 一句四引 + S7 | relation:claim-evidence spatial:stack path:drill load:many-sources expression:baseline | stress | 改为句后列表；列出强度后越界成证据评估 |
| W05-e | ‘见上文’‘点击这里’ | relation:claim-evidence spatial:inline path:revisit load:sparse expression:baseline | failed | 无目标、无预期、链接文字脱离上下文不可理解 |

## W06 · 展开补充 · Disclosure

- 层级：atom；家族：wayfinding；位置：[atoms/wayfinding.html#W06](atoms/wayfinding.html#W06)
- 职责：判断折叠内容现在需不需要看；前提是不看它结论不变
- 输入：必需：摘要行（内容与分量）、折叠内容；可选：‘不影响结论’声明、层级
- 适用：原始记录、题目原文、计算细节
- 不适合：限定、范围、反例；打印稿
- 容量：嵌套 ≤ 2 层；摘要 ≤ 1 行半
- 已见失败：把关键限定折起来；摘要写‘更多’；JS 生成的折叠无 JS 时内容丢失；作者误判补充与前提（W06-d）
- 来路：original-this-run；借用 C08（原生 details、无 JS 可读；改动：摘要行改为‘内容 + 分量 + 与结论关系’两行结构，标记悬挂）；C15（disclosure 按钮语义、键盘与焦点；改动：按钮挂在句尾、内容紧随所在段；渐进增强，无 JS 时内容常显）
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| W06-a | 原生 details，摘要说明内容与分量 | relation:whole-part spatial:stack path:drill load:short expression:baseline | candidate | 摘要写内容、条数、与结论关系；限定留在正文 |
| W06-b | 句尾就地展开（APG disclosure） | relation:whole-part spatial:inline path:drill load:short expression:editorial | candidate | 句尾 button + aria-expanded/controls；无 JS 时补充段直接显示 |
| W06-c | 逐层下钻，层级错位 | relation:whole-part spatial:offset path:drill load:dense expression:spatial | candidate | 每层右移 24px 并换线型，层号写入摘要；第 0 层限定以徽记留外 |
| W06-d | S1 长摘要 + S7 | relation:whole-part spatial:stack path:drill load:long-title expression:baseline | stress | 摘要 3 行时标记须悬挂；暴露作者把影响方案 A 的推测误作补充 |
| W06-e | 把前提折起来 | relation:certain-uncertain spatial:stack path:drill load:short expression:graphic | failed | 唯一限定折进‘更多’，大号 81% 独占视线 |

## W07 · 局部与总览 · Local in whole

- 层级：atom；家族：wayfinding；位置：[atoms/wayfinding.html#W07](atoms/wayfinding.html#W07)
- 职责：判断眼前的局部在整体中处于什么位置、是常态还是例外
- 输入：必需：整体范围与单位、局部位置、局部内容；可选：整体形状缩略、例外说明
- 适用：讨论单个数据点或小节时需整体参照
- 不适合：局部即整体；整体 > 200 点缩略后失去形状
- 容量：缩略单元 ≤ 约 60 个时 320px 内可逐个辨认；日历格 130 个时每格约 9px，只能编码状态
- 已见失败：只给局部且用‘近期’等相对时间；重编局部序号（W1–W5）无法与正文对上；总览与局部没有连接标记
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| W07-a | 位置句 + 前后邻域表 | relation:whole-part spatial:stack path:linear load:short expression:baseline | candidate | 一句给整体尺度，±2 周邻域表给局部，当前行 ◀ + 例外原因 |
| W07-b | 缩略全程 + 放大框 | relation:whole-part spatial:stack path:drill load:short expression:graphic | candidate | 26 柱缩略 + 细框与引线落到放大列表；例外柱空心虚线；数值在 HTML |
| W07-c | 文档地图 + 当前局部 | relation:whole-part spatial:main-margin path:revisit load:short expression:spatial | candidate | 按篇幅的竖向文档地图 + 当前局部对齐；窄屏变横向条带 |
| W07-d | S5 局部例外 · 130 晚日历 | relation:whole-part spatial:span path:scan load:exception expression:graphic | stress | 列例外（停开）与行例外（周二偏低）同屏；格子只能编码状态不能编码值 |
| W07-e | 只有局部，‘近 5 周’ | relation:whole-part spatial:stack path:linear load:sparse expression:graphic | failed | 相对时间把第 12–16 周伪装成最新；重编序号；无总体无例外说明 |

## W08 · 目录 · Contents

- 层级：atom；家族：wayfinding；位置：[atoms/wayfinding.html#W08](atoms/wayfinding.html#W08)
- 职责：在全体中选择去哪里：有几节、各讲什么、自己在哪一节
- 输入：必需：条目编号、（短）标题、锚点、总数；可选：当前项、层级、每节要点、缺节说明
- 适用：≥ 4 节、读者会跳读或回查
- 不适合：≤ 3 节；目录比正文长
- 容量：平铺 ≤ 8 项；超过按章折叠；吸附侧栏只在 ≥ 10 节且正文 > 3 屏时值得
- 已见失败：JS 生成的横向滚动标签栏；窄屏直接隐藏目录；没有当前项；长标题被截断或把后续条目挤出扫视范围
- 来路：original-this-run；借用 C08（原生 details 目录、无 JS 可读；改动：用于长目录按章折叠（W08-b）与窄屏侧栏回退（W08-c））；C13（条目数、当前所在；改动：条目数写入目录标题；当前项加文字标记）；C14（当前小节标示；小节少时不强加吸附侧栏；改动：W08-c 保留吸附做对照并在 note 写明不值得的条件）；C11（窄屏隐藏导航为失败模式；改动：W08-c 窄屏以打开的 details 置前代替隐藏；W08-f 记录同类失败）；C12（JS 生成横向滚动标签栏为失败模式；改动：以静态 HTML 复现外观作为失败样张 W08-f）
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| W08-a | 短目录，带条目数与当前项 | relation:sequence spatial:stack path:scan load:short expression:baseline | candidate | 标题写条目数；当前项粗线 + 粗体 + ‘当前’文字 + aria-current |
| W08-b | 长目录：按章折叠，当前章展开 | relation:whole-part spatial:stack path:drill load:dense expression:baseline | candidate | 22 节按 6 个原生 details 折叠，章摘要写节数；打印需平铺 |
| W08-c | 吸附侧栏 + 当前项跟随 | relation:sequence spatial:main-margin path:scan load:short expression:spatial | candidate | 宽容器 sticky 侧栏 + JS 按滚动位置标当前项；窄屏为打开的 details 置前；6 节时不值得 |
| W08-d | 论点目录：每节带一句结论 | relation:claim-evidence spatial:offset path:scan load:long expression:editorial | candidate | 大号衬线序号悬挂 + 标题 + 一句结论，目录兼提纲 |
| W08-e | S1 长条目 + S3 缺节 + S7 | relation:sequence spatial:offset path:scan load:long-title expression:baseline | stress | 编号悬挂保住扫描路径，但长条目挤出后续；缺节虚线条目原位保留 |
| W08-f | 横向滚动标签栏 | relation:sequence spatial:inline path:scan load:short expression:graphic | failed | C12：不换行横滚，窄屏只露 3 个；原型依赖 JS（data-allow-scroll） |

## P01 · 证据段落 · Evidence paragraph

- 层级：pattern；家族：pattern；位置：[patterns/patterns.html#P01](patterns/patterns.html#P01)
- 职责：读完一段论证，同时确认主张、看到原话或记录、知道来源与方法，不把例证读成比例
- 输入：必需：1–2 段主张；1–2 条原话/记录；来源；方法。可选：反向意见、注
- 组合自：T09, V01, V02, V06, W03
- 适用：正文段落需要例证与比例并存
- 不适合：多来源强度排序（P05）；证据是图表（P07）
- 容量：一段主张 ≤ 2 条原文证据、≤ 2 条注
- 已见失败：证据与主张隔三段；原话、摘录、方法等权卡片化；方法说明沉到最后
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| P01-a | 纵向紧邻 | relation:claim-evidence spatial:stack path:adjacent load:many-sources expression:baseline | candidate | 主张→例证→比例→方法→注一条线；V01 定位在下、V02 身份头在上，相邻时小字归属含混 |
| P01-b | 主列＋同高边注 | relation:claim-evidence spatial:main-margin path:adjacent load:many-sources expression:spatial | candidate | W03-b 承担来源/方法；与 V02-b 三栏并置形成两套右侧系统，宽度起点不齐 |
| P01-c | 左侧批注栏逐件挂证据 | relation:claim-evidence spatial:main-margin path:revisit load:many-sources expression:editorial | candidate | 每件证据的强度上限挂在左栏；证据家族无 editorial 皮肤，W03-c 需补 figure 入第 2 栏 |
| P01-d | 证据远离主张＋等权卡片 | relation:claim-evidence spatial:distant path:linear load:many-sources expression:graphic | failed | 主张与证据隔三段；卡片抹平方法与原话的分量，删掉身份标签与定位 |

## P02 · 带上下文的指标带 · Metric band with context

- 层级：pattern；家族：pattern；位置：[patterns/patterns.html#P02](patterns/patterns.html#P02)
- 职责：一次扫过几项关键数字，每个数带单位、期间、基准，并知道共同范围与方法
- 输入：必需：2–5 个指标（名、值、单位、基准或未设目标）；共享期间；范围；方法。可选：缺失/零/不适用
- 组合自：Q01, W04, V06, E10
- 适用：报告开头或决策材料的现状摘要
- 不适合：指标间要比较大小；只有一个关键数
- 容量：一行 ≤ 4 个；更多改指标簿
- 已见失败：各格重复同一期间；不同刻度并排被读成同尺度；KPI 砖逼出伪零
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| P02-a | 共享表头的指标带 | relation:multi spatial:juxtapose path:scan load:short expression:baseline | candidate | 期间提到带头，删去各 Q01-a 的期间行；每格需 .p-slot |
| P02-b | 范围引导句＋指标簿 | relation:multi spatial:stack path:scan load:dense expression:editorial | candidate | W04-c 暖纸衬线接 Q01-d 冷色簿，表现强度中途断开；原子 fixture 含实验室交叉引用 |
| P02-c | 两条刻度并排 | relation:multi spatial:juxtapose path:compare load:short expression:graphic | candidate | 两个正确的 Q01-c 并排后条长被读成同尺度；共享尺度是组合性质，需组合层声明 |
| P02-d | 长数值、缺失、零、不适用同带 | relation:multi spatial:juxtapose path:scan load:missing expression:baseline | stress | 借用 E10 的 e-v--na 进 56px 值位后成为全带最大字；四格值行高度不齐 |
| P02-e | KPI 砖＋细则范围 | relation:multi spatial:juxtapose path:scan load:sparse expression:graphic | failed | 砖墙要求每格一个数，把“北站未采集”写成 0 |

## P03 · 比较区 · Comparison block

- 层级：pattern；家族：pattern；位置：[patterns/patterns.html#P03](patterns/patterns.html#P03)
- 职责：先读比较结论，再横竖核对对照表，并在同一视线看到限定结论的反例
- 输入：必需：命题标题；多对象×多属性表（含三种空值）；≥1 条反例及影响。
- 组合自：T01, E06, T06, E10
- 适用：“哪个更好/差在哪”的节
- 不适合：只有两个对象；需要推荐（接 P04）
- 容量：表 ≤ 6×6；反例 ≤ 2
- 已见失败：话题标题；反例沉为表注；标题的比较在表里找不到
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| P03-a | 命题标题→表→例外 | relation:multi spatial:stack path:compare load:missing expression:baseline | candidate | 例外紧随表而非标题；暴露 E06 fixture 东坡 ¥164 与 fixtures ¥171 不符 |
| P03-b | 转折标题＋格内条＋词级反例 | relation:multi spatial:stack path:compare load:short expression:graphic | candidate | 标题两层对应表中两列条；暖纸出血标题与白底表断层；标题倍数与条尺度无约束 |
| P03-c | 长问题标题＋两处性质不同的例外 | relation:multi spatial:stack path:compare load:long-title expression:baseline | stress | S1 是问题不是命题，比较区只能回答一小部分，需补范围与缺口声明 |
| P03-d | 话题标题＋反例沉入表注 | relation:multi spatial:distant path:compare load:missing expression:baseline | failed | 删单位、删状态、删影响等级的组合层删减 |

## P04 · 决定段 · Decision block

- 层级：pattern；家族：pattern；位置：[patterns/patterns.html#P04](patterns/patterns.html#P04)
- 职责：在一个单元里看到结论、方案与推荐、代价、条件和请求（谁、何时）
- 输入：必需：结论；≥2 同口径方案＋推荐；得失；条件；请求
- 组合自：T07, E09, E08, T05, T08
- 适用：决定材料最后一节
- 不适合：尚无推荐；只有一个方案
- 容量：方案 ≤ 4；得失 ≤ 4 行；请求 ≤ 2
- 已见失败：结论与请求同形；条件与推荐分离；等权卡片化后推荐与请求消失
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| P04-a | 结论→方案表→得失→请求 | relation:multi spatial:stack path:linear load:dense expression:baseline | candidate | E09-a 条件行吸收 T05；删 T08-a 依据；“招聘 2 人”在条件与请求中角色不同 |
| P04-b | 先中立陈列，再推荐，最后结论与请求对照 | relation:multi spatial:juxtapose path:compare load:dense expression:editorial | candidate | E09-b 暖纸挂在 .stage 上需另建盒子；推荐说两遍 |
| P04-c | 推导收束＋括号条件＋悬挂截止日 | relation:claim-evidence spatial:main-margin path:linear load:short expression:spatial | candidate | 三套缩进系统左缘不齐；无方案表，比较退化为罗列 |
| P04-d | 全部原子等权卡片化 | relation:multi spatial:juxtapose path:scan load:dense expression:graphic | failed | 推荐无处承担；条件失去作用范围；请求无主语 |

## P05 · 主张—证据阶梯 · Claim–evidence ladder

- 层级：pattern；家族：pattern；位置：[patterns/patterns.html#P05](patterns/patterns.html#P05)
- 职责：看到一个要点，同时看到来源按强度排开，并在最具体来源上展开摘录
- 输入：必需：要点；≥2 来源（强度＋理由）；≥1 条摘录。可选：独立性说明
- 组合自：T03, V07, V02
- 适用：关键判断要经得起追问
- 不适合：单一来源；来源同档
- 容量：来源 ≤ 5；摘录 ≤ 2
- 已见失败：要点与阶梯各写一次主张；最弱证据视觉最强
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| P05-a | 要点→强度清单→嵌入摘录 | relation:claim-evidence spatial:stack path:drill load:many-sources expression:baseline | candidate | 删 V07-a 自带主张行；摘录身份头与来源行重复，缩成条目号 |
| P05-b | 距离即强度＋弱证据下挂主张—摘录 | relation:claim-evidence spatial:juxtapose path:drill load:many-sources expression:spatial | candidate | 两级主张可见；V02-b 位置被读成更弱一级，无原子提供“从某级引出”的连接件 |
| P05-c | 最弱证据最显眼 | relation:claim-evidence spatial:stack path:linear load:many-sources expression:editorial | failed | 组合层放大并截断单晚日志，强度倒置 |

## P06 · 流程与例外 · Procedure with exceptions

- 层级：pattern；家族：pattern；位置：[patterns/patterns.html#P06](patterns/patterns.html#P06)
- 职责：照着流程走，知道分支与回流，并看到规程与实际记录不一致处
- 输入：必需：主线步骤；≥1 分支（触发/动作/回流）；≥1 反例或规程外情况。可选：注
- 组合自：Q09, T06, W03
- 适用：规程说明、事后复盘
- 不适合：分支 ≥3 或多层嵌套
- 容量：主线 ≤ 6、分支 ≤ 2、注 ≤ 2
- 已见失败：两原子争同一边距；例外写成分支；注离步骤过远
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| P06-a | 编号流程＋内嵌分支＋例外段＋段后注 | relation:sequence spatial:stack path:linear load:exception expression:baseline | candidate | 分支在步骤内、例外在流程外；组合暴露日志 21:40 早于规程 21:50 |
| P06-b | 横排主线＋下垂分支＋正反并置 | relation:sequence spatial:juxtapose path:linear load:exception expression:graphic | candidate | 正反原话共同检验 ①②；反例原子无“指向某步”字段 |
| P06-c | 时刻悬左、注释在右 | relation:sequence spatial:main-margin path:linear load:exception expression:editorial | candidate | 左右边距各司其职；边注落在暖纸外 |
| P06-d | 两个原子争左边距 | relation:sequence spatial:main-margin path:linear load:exception expression:editorial | failed | Q09-d 时刻与 W03-c 批注同占左栏；仅宽屏出现 |

## P07 · 展项装配 · Exhibit assembly

- 层级：pattern；家族：pattern；位置：[patterns/patterns.html#P07](patterns/patterns.html#P07)
- 职责：从正文被引到展项，读展项时知道问题、范围、来源、方法与例外，读完能回到引用处
- 输入：必需：引用句；展项编号与问题式标题；主体；description、caption、来源、方法
- 组合自：V05, Q10, W05
- 适用：正文依赖一张图做判断
- 不适合：只有 1–2 个数
- 容量：一处引用、一个展项
- 已见失败：见上图；caption 重复标题；主体按整页断点排版
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| P07-a | 行内引用→纵向展项（主体换成 HTML 柱） | relation:claim-evidence spatial:stack path:adjacent load:exception expression:baseline | candidate | 框架与主体可替换；annotation 归属无约定，删 V05 callout |
| P07-b | 引用处预览＋三栏展项 | relation:claim-evidence spatial:main-margin path:adjacent load:exception expression:spatial | candidate | 中栏柱/横条由组合层的容器决定；预览与主体两种编码 |
| P07-c | “见上图”＋标题即 caption | relation:claim-evidence spatial:distant path:revisit load:exception expression:baseline | failed | 局部截段＋去例外＋远距模糊引用叠加出相反结论 |

## P08 · 时间叙事 · Timeline narrative

- 层级：pattern；家族：pattern；位置：[patterns/patterns.html#P08](patterns/patterns.html#P08)
- 职责：沿时间读经过，同时知道事件在全程的位置、离今天与决定会多远，以及局部异常在全程中的意义
- 输入：必需：事件表（含今天）；叙述；一个局部与全程数据
- 组合自：Q07, T09, W07
- 适用：复盘、评估报告的经过
- 不适合：事件 >12 或多条并行线
- 容量：事件 ≤ 10；局部 1 处
- 已见失败：叙述与事件表逐条重复；局部无总览；未来事件盖过过去
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| P08-a | 叙述→事件表→局部邻域 | relation:sequence spatial:stack path:linear load:exception expression:baseline | candidate | 叙述写相对时间、表写绝对日期；日期与周序两种坐标需手工换算 |
| P08-b | 比例时间轴在上，叙述与总览—局部并行 | relation:whole-part spatial:main-margin path:revisit load:exception expression:spatial | candidate | 三种时间尺度由叙述串联；同一例外两种形状两种坐标 |
| P08-c | 书页叙述收束到“今天”分割 | relation:before-after spatial:stack path:linear load:short expression:editorial | candidate | 两个暖纸原子衔接不齐；叙述使 Q07-c 过去清单重复 |

## C01 · 证据主导的解释长文 · Evidence-led explanatory essay

- 层级：composition；家族：composition；位置：[compositions/c01-evidence-essay.html#C01](compositions/c01-evidence-essay.html#C01)
- 职责：不了解试点的读者从头读到尾，理解夜间开放吸引了什么人、代价在哪里、证据有多强，并能在任何一处就地回查证据
- 输入：命题标题 × 章；每段正文 + 0–2 条同高边注（定义/例外/来源/方法/注/要点/反例/未决）；1 个展项（问题式标题 + 图 + 例外 + 来源/方法）；分布、组成、基准差、多来源强度、区间限定、结论＋依据
- 组合自：T01, T02, T03, T04, T06, T07, T09, T10, Q01, Q03, Q04, Q05, Q06, Q10, V01, V02, V04, V05, V06, V07, W01, W02, W03, W04, W08
- 适用：读者要一次性读懂一个论证、又需要随时核对数字出处的长报告；宽屏编辑化阅读
- 不适合：读者主要是扫描查找或横向比较方案（用比较页/决定页）；每段注释超过 2 条（边注碰撞）
- 容量：4 章、每章 5–8 行正文、每行边注 ≤ 2 条；主栏 40rem
- 已见失败：边注样式来自 6 个不同原子，边注栏视觉不统一；T09-b 两端对齐在窄栏配合不换行数字会拉开字距（已在组合层改为左对齐）；V04-c 推导段与 T09-b 正文属于两套段落体系（无缩进/有缩进），交界处节奏不连续
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| C01-a | 章轨 + 主栏 + 边注，窄屏边注折回句后 | relation:claim-evidence spatial:main-margin path:adjacent load:many-sources expression:editorial | candidate | 整页一个 stage，每个栏位重建 stage 容器；主栏 40rem 恰在原子 640px 阈值上，使主栏原子呈宽形态、边注原子呈窄形态；900px 以下单栏，边注折回所注段落之后并缩进。 |

## C02 · 决定备忘（pre-read） · Decision memo

- 层级：composition；家族：composition；位置：[compositions/c02-decision-memo.html#C02](compositions/c02-decision-memo.html#C02)
- 职责：决定会参会者会前 5 分钟读完：知道要决定什么、推荐什么、为什么、何时不成立、需要他做什么
- 输入：待决问题＋前提；结论＋依据强度；行动请求（做什么/谁/何时/依据）；同口径方案表＋推荐；取舍；范围；指标与基准差；方法与来源；条件；反例；未决问题
- 组合自：T01, T02, T05, T06, T07, T08, T10, E08, E09, Q01, Q03, V06, W01, W04
- 适用：读者要在会前独立读完并带着立场进会；有明确推荐与请求
- 不适合：作者尚无推荐（改用中立陈列）；读者需要逐段被说服时，结论先行会被读成先下结论
- 容量：约 13 个原子、5 节；1440 下 C02-a 首屏即可读到结论与请求；375 下 C02-b 的请求在约 4000px 之后
- 已见失败：结论/请求/未决同为 20px 粗体，首屏两块同样响亮；推导版在方案表处泄露推荐
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| C02-a | 结论先行 · 安静基线 | relation:claim-evidence spatial:stack path:linear load:dense expression:baseline | candidate | 问题→引介→结论＋请求（宽屏并排）→方案/取舍→依据→条件/例外→未决；范围被迫退到结论之后 |
| C02-b | 推导在先 · 结论在末 | relation:claim-evidence spatial:stack path:linear load:dense expression:baseline | candidate | 同一原子集合与内容，只改顺序：范围/指标/差→例外→方案/取舍/条件→结论＋请求→未决；E09-a 的“▶ 推荐”在第 3 节提前泄露答案 |

## C03 · 运营回顾（高密度扫描） · Operating review

- 层级：composition；家族：composition；位置：[compositions/c03-operating-review.html#C03](compositions/c03-operating-review.html#C03)
- 职责：馆务处负责人每周扫描：30 秒内找到异常、在哪个分馆、与参考差多少，再下钻到证据
- 输入：对象（分馆）× 多指标且每指标带参考；逐周序列（可按对象拆）；有日期事件；每个异常至少一条可下钻的证据或推算
- 组合自：T01, W04, W08, W01, E07, Q08, W05, Q01, E06, E10, Q10, W06, V04, Q03, T04, V02, W07, Q07, V06
- 适用：定期回看、对象同质、读者熟悉口径，只需知道哪里不对
- 不适合：需要说服或决定（改用决定备忘录）；对象不同质、候选馆大半不适用
- 容量：异常清单 ≤6 条；对照表 12×6 已到上限；小倍数 ≤4 幅
- 已见失败：对照表同列混口径（E06-d 东坡 ¥164 扣停开 vs 合计 ¥116 计划时段）；原子里的“东坡周二偏低”叙述在并排后被揭穿为“东坡每晚都低”
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| C03-a | 异常先行 · 对照 · 小倍数 · 下钻 | relation:multi spatial:juxtapose path:scan load:dense expression:graphic | candidate | 深色刊头 + 目录跳转条；异常清单按偏离%排序、每行带值/参考/差/状态/下钻链接；宽屏 7:5 与指标簿并列，窄屏偏离值提到对象前、下钻变整行按钮；三幅同尺度小倍数按周对齐 |

## C04 · 机制解释页（空间化） · Mechanism explainer (spatial)

- 层级：composition；家族：composition；位置：[compositions/c04-mechanism-explainer.html#C04](compositions/c04-mechanism-explainer.html#C04)
- 职责：理解夜间每次到馆成本为何约为日间三倍，以及哪一项是可调杠杆（开哪几个馆·晚），同时看清三倍倍数的口径缺口
- 输入：派生指标的算式（每小时成本 × 开放时长 ÷ 到馆人次）；各项的组成、定义、流程与例外、基准差；逐步算例（含对照口径）；结论与限定
- 组合自：T01, Q03, T05, W05, W03, Q05, Q09, V02, T04, V03, T06, V04, T07
- 适用：读者要理解一个派生数字由哪些量驱动，并找出可动的那一项；算式项数 3–4
- 不适合：只要结论不需要机制时（用决定段）；算式超过 4 项或非乘除关系时，算式脊与页边项号都会失效
- 容量：约 17 个原子实例、7 节；1440 下每节约一屏；375 下全页约 9000px
- 已见失败：T05-c 的括线高度由边注长度决定，在宽屏越过它限定的句子，需组合层拉开句距；并排两份 V04-a 的步骤行不能跨槽对齐；V03-a 编号钉 2 压住画面日期
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| C04-a | 算式脊 + 页边项号 · 空间化 | relation:whole-part spatial:offset path:drill load:exception expression:spatial | candidate | 算式四项链接到三节，页边重复项号与数值作远距配对；② 节左右翻转、流程跨满栏、日志摘录错位挂在例外分支下方；③ 截图越界进页边栏；窄屏页边项号变节首横带 |

## C05 · 幻灯序列投影 · Slide-sequence projection

- 层级：composition；家族：composition；位置：[compositions/c05-slide-sequence.html#C05](compositions/c05-slide-sequence.html#C05)
- 职责：把同一个“是否扩展夜间开放”的决定投影成 9 张 16:9 帧：现场讲解时一帧一个判断，离开讲解也能逐帧读懂；同时检验哪些原子跨媒介仍成立、哪些要改写、拆帧或移到帧外
- 输入：必需：每帧一个命题标题（T01）＋一个主展项＋帧底来源/方法/定义行（复用 V05-a 来源行标签）＋帧号；可选：每帧至多一个辅助原子（方法说明或第二栏）；帧外附页收纳需要点击或与主展项争位的内容
- 组合自：T01, W04, W02, Q10, V05, V07, V01, V06, Q03, E09, T05, T08, T10, V04
- 适用：决定要在会上讲、材料又要会后转发；每个判断能由一个展项支撑
- 不适合：论证依赖长推导、边注密集或读者需要自己下钻（用文档版组合）；单个判断需要两个以上同等权重的展项
- 容量：6–9 帧；每帧 1 个主展项＋至多 1 个辅助原子；多来源 ≤ 4 条/帧；表 ≤ 4 行 × 5 列
- 已见失败：原子的 px 尺寸和带 rem 下限的 clamp 不随帧缩放：阈值 880px 时 920px 视口 5 帧溢出（已把阈值提到 1000px）；SVG 图表文字随图按帧高缩小，比正文还小（Q10-a）；details / 边注 / 交叉引用链接在投影里失效，必须改写为帧底文字、第二栏或帧号；T01 的 keep-all 在窄屏把“；”挤到行首
- 来路：original-this-run
- 检查：2026-09-27 主代理用 tools/cdp.mjs 在真实 1440 与 375 视口（375 为移动端仿真）、有 JS 与禁用 JS 两种情况下跑几何检查：无页面横向滚动、无越出舞台、无意外裁切（data-allow-scroll 的失败样张除外）；reduced-motion 仅检 C05 与 wayfinding。视觉观察：施工子代理逐变体看过 ?w=375 模拟与 1440 截图；主代理抽看了部分原子与全部组合的截段（见 checks/）。未检：深色、打印、读屏、缩放、键盘全路径。

| 变体 | 名称 | 轴 | 状态 | 说明 |
|---|---|---|---|---|
| C05-a | 9 帧序列 · 宽屏 16:9 / 窄屏自然高度 | relation:sequence spatial:stack path:linear load:dense expression:baseline | candidate | 容器 ≥ 1000px 时帧固定为 16:9，--fs-* token 按帧宽重定义（约 19px 基准），帧与帧体 overflow:hidden，让 check 能报告装不下的帧；< 1000px 时放弃比例，改为自然高度的讲义段，记为媒介转换；无 JS 全部可读，JS 只加 ←/→/Home/End 焦点翻页，reduced-motion 下不滚动动画 |
