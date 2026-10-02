# PraxisDesignKit 下一轮串行工单与 Motion 提案

日期：2026-10-02  
阶段：提案，尚未执行  
分工：dot 提供校订、来源研究和原子交接；Opus 负责协调多 agent 实施、视觉打样与最终裁决

## 建议先做什么

下一轮先证明“已有内容能帮助陌生任务作出更好的设计决定”，再扩充覆盖面。建议依次放行五包：

1. 校准来源与描述边界
2. 验证陌生 brief 与跨内容迁移
3. 用少量真实任务打样并回写
4. 建立可选 Motion 的时间语义桥接
5. 验证小原子件的组合与受限组装

本轮不以维度数、卡片数、截图数或覆盖率作目标，不预设大批资产、目录迁移或新治理 schema。Motion 保持独立、可选；可以从自己的任务直接进入，不要求先完成 Write 或 Design。以上是推荐交接顺序，不是所有 Kit 的技术依赖图：工单一至三已构成 Design 闭环；不启动 Motion，也能完成 Design 交接。工单四只硬依赖自身采用的来源与任务输入，工单三的结果是可利用的证据；工单五可按 Design 或 Motion 的已验证输入分别开展。

每次只交接一包。前包的可用结果与已知限制，应成为下一包输入；未闭合的局部缺口可以隔离，不必把整条链一起冻结。

## 现有基线与证据边界

以下均依据作者回执，未独立验收。最新作者回执为：本地当前提交为 f8cf14e，分支 kit-rounds-20260927-1002，工作区 clean，尚未 push。dot 未读取这个本地基线，后续由 Opus 对照它核验。

不为取得 review 而要求直接 push 整个提交。可由 Opus 本地执行，或提供已脱敏的相关文件与差异。Tally 全文、跨项目 source/local-context、实名答卷 HTML/PDF/video、raw chat 与截图等材料先保留本地；本提案不授权公开或处置这些文件，也不新增仓库施工任务。

- Atlas 已被消费。15 个 generalized 关系问题进入 relations 与 ADR018，不新增通用参数；八种 style 作为 VL01–08 普通参考，入口各保留一行。后续以作者当前文件与 ADR015–018 为准，不拿旧远端入口意见重复开工。
- 六个 cold-start 题原先五个通过；Swiss 补入口后通过，但内容与样张相同，尚未验证陌生内容 transfer。问题地图能把浮层 readability、Arabic mix、混乱感带到相应行，尚未证明能支持具体决策。
- A01 是同一内容的四种关系与换皮反例；1440/375 几何检查通过，十二张截图只有作者看过。中文标题断行、CJK 600 字重与数字观感仍是观察，不是已判定的一般规律。
- 47 个来源复访报告为 32 充分、11 partial、4 blocked；只读文本，未看图。9 项 source corrections 的原文、修改内容与裁决理由尚缺，不将其写成“已修正”。
- A02–A04 未打样，F2/F3 未使用；九个 areas 仍只有一行级覆盖。reader、keyboard、print、cross-font 未验；137 链接检查未重跑。

所缺九项清单只阻塞有关来源的正确性判定与晋升，不阻塞外部 Motion 研究，或使用已核输入的小范围迁移试验。

## 共用交接与回执规则

这是已有记录的最低补充，不创建新的必填 schema。

- 开工时冻结本包实际用到的文件版本、brief、参考与预期判断；先写“要帮助读者作什么决定、什么结果算失败”，再看样张。
- worker 登记原句、引用、阅读路径、决策、失败证据与候选修订，不自行把作者偏好或单次结果提升为通则。Opus 可自由拆分 worker、选实现方法、增减试验样本并作出内容裁决，但须说明改变了哪项待验证问题。
- 每包只返回最小差异清单、必要证据和结论。沿用既有 ledger，追加适用范围、反例及证据链接即可。
- “跑通”“找到页面”“字段齐全”“源码能编译”“作者看过”分别记录，不能互相代替。
- 晋升针对具体判断及其适用范围；不能因整包结束，就把一组参考整批升为 generalized。结果只支持一个场景时，保留场景限定；没有净价值时允许不增加任何条目。
- 每包停止规则是收敛问题边界，非机械限制迭代次数。遇到新范围、新资产授权或必要输入缺失，只暂停相关分支，并写明下一步需要什么。

## 工单一 校准来源与描述边界

**对象与原因**  
核对即将影响决策的少量来源、关系条目和参考描述。先解决“资料说了什么、我们据此能主张什么”，避免后续用错误输入验证一个漂亮结果。

**输入与依赖**  
作者当前相关文件与 ADR015–018；47 来源复访记录；9 项 correction 的原句、拟改句、来源及裁决理由；待试验关系与语言参考。没有九项具体清单时，不推测内容，也不重做全部 47 项。

**worker 登记与 Opus 自由**  
worker 区分来源事实、作者解释、设计判断和待验证假设，标注只读了文字还是看过对应图例。Opus 选择最影响下一包的条目，决定修订、降级引用、加边界或暂不使用；不被迫补齐所有 blocked 来源。

**最小交付**  
一份小范围校訂差异：原文与拟改文、依据、影响的调用点、仍悬置的项目；足够支撑下一包的已核输入集合。不另建来源系统。

**验收**  
每项拟作为任务依据的主张都能追溯到当前版本；描述不把风格标签写成万能解，不把局部参数写成通则。依赖视觉证据的描述须看到相应视觉材料才可判定，文字抓取不算。九项缺口明确列为待补，不能混入“已验收”。

**停止与 ledger**  
事实冲突、原图缺失或 blocked 时保留 reference/partial，或从下一包排除；不以补参数化解证据缺口。只有纠偏不等于泛化晋升。已核无争议的分支可放行工单二，其余单独悬置。

## 工单二 验证陌生 brief 与跨内容迁移

**对象与原因**  
验证关系层和参考层是否帮助新使用者做设计决定，补上“能找到条目”与“能正确使用”之间的缺口。

**输入与依赖**  
工单一放行的局部版本；A01 原始内容与样张作为已见样本。Opus 另选未出现在文档和样张中的 brief，避免只换名字、颜色或数字。

**worker 登记与 Opus 自由**  
冷读 worker 不提前接触答案和作者解释；登记实际阅读路径、为什么选此关系、放弃了什么、还缺什么。Opus 自由选择样本及其难度；优先改变信息结构、读者目标或内容长度，而非再增加一串 style 名称。

**最小交付**  
从两个互不等价的新 brief 起步：一个检验既有关系能否迁移，一个检验何时应拒用它。每个只需阅读路径、带理由的选择及轻量草图或内容结构，不先做成套视觉资产。样本不够区分原因时，再补针对性的案例。

**验收**  
在揭示参考答案前，使用者能说明读者要完成什么、选择会怎样影响阅读顺序、什么改变会让该选择失效。路由成功与迁移成功分别记录：前者要找到执行下一步所需内容并说明选择理由，后者要在未参与条目编写的新内容中产出满足 brief 的结果。检查实际草图是否保留事实、优先级与关系；到达正确文档但仍照搬旧样张，记为未通过迁移。Swiss 题必须换陌生内容重试。将失败分为入口、表述、适用边界或任务输入问题；修改后重测保留首轮失败，不能覆盖原记录。

**停止与 ledger**  
若失败源于条目误导，先回工单一做最小修订；若是输入不足，写明缺项，不扩库掩盖。可迁移判断成为“已在这些 brief 中支持决策”的证据；不能据此声称覆盖全域。明确的拒用条件同样值得回写。

## 工单三 用真实任务打样并回写

**对象与原因**  
从工单二暴露的高价值失败分支中挑一个真实任务，保留一个成功对照，检验知识能否改善完成品。先把最关键的一两个分支做深，再决定是否展开剩余 areas。

**输入与依赖**  
工单二的决策与失败记录；真实内容、受众、输出媒介与验收问题；现有 A02–A04 或 F2/F3 中与任务真正相关的一项。编号不是必须逐项完成的排期。

**worker 登记与 Opus 自由**  
制作 worker 可按任务适配结构、字体与表现；评阅者不先看作者自评，独立登记阅读错误、事实遗漏、层级歧义与环境缺陷。Opus 决定哪些修改应回写知识，哪些只是该作品的局部处理。

**最小交付**  
一件真实交付物、解决目标问题前后的必要对照、一个确实换了内容的迁移版本，以及短回写差异。不为九个 areas 各造一张样张。

**验收**  
先用实际内容验阅读结果，再看几何与风格。由目标读者或明确标注为替代的评阅者回答任务问题；检查是否能识别主张、关系和下一步。根据媒介选择必要检查：网页交互做 keyboard 与焦点；打印任务看 print；字体可替换时看 cross-font；中文/混排任务看断行、字重与 bidi。无关项可注明不适用，有关项不可由 1440/375 无溢出代替。样张须留独立视觉证据。

**停止与 ledger**  
若效果仅对原内容成立，保留案例或参考并记录失败边界；若参数依赖字体、语言、密度或媒介，作为局部调校记录，不升为 foundations 常量。只有确实改变了任务决策且在换内容后仍成立的判断，才考虑有范围的晋升。剩余分支保留待检，不自动启动。

## 工单四 建立可选 Motion 时间语义桥接

**对象与原因**  
把静态的阅读关系扩展为“随时间发生什么、观众如何保持理解”。Motion 不只覆盖视频，也可用于界面反馈、状态转换、交互演示和时间性叙事。

**输入与依赖**  
一个确实需要时间变化的独立 Motion brief；已核对的相关来源；本附录的官方能力与社区参考。本轮工单三的稳定判断可作为输入，但不是所有 Motion 任务的前置门槛。若该任务与静态案例无关，直接从自身 brief 建立输入，不制造 Write→Design→Motion 依赖。

**worker 登记与 Opus 自由**  
worker 对照任务说明变化的意义与失败风险；Opus 决定采用哪些时间问题，不强制每个任务填写全部维度，也不预设 primitive→pattern→shot→sequence→profile 的刚性层级。

**最小交付**  
一份短桥接说明与一个小试验设计。候选问题如下，按任务取用：
- motion meaning：为何需要变化，静态是否已经足够
- temporal hierarchy：先看什么，何时看清，何时交出注意力
- object constancy 与 state transition：变化前后是否仍被认作同一对象，状态是否可解释
- choreography 与 rhythm：多个变化怎样协作，何时停留或打断
- legibility、captions 与 audio sync：读得完吗，信息是否依赖声音，字幕与语音是否一致
- reduced motion：减弱或去除运动后，核心信息和任务是否仍成立

**验收**  
说明须能指导至少一个具体选择，并包含“何时不动”的判断；不只给形容词或曲线参数。试验计划预先写出主张、对照和观察方式，例如对象移动后还能否正确追踪、状态变化是否被误读、静音或减弱运动后是否仍懂。时长、缓动和同步容差由实际内容与媒介校准，不能拿外部配方值充当全局标准。

**停止与 ledger**  
若时间变化没有可辨认的信息价值，停止制作动效并保留静态方案。未做试验的桥接判断标候选；只测一种媒介，就保留该媒介范围的结论，主张跨媒介通用性才补第二种媒介证据。视频来源的证据不自动晋升成通用交互规则。只有任务真正需要 Remotion 时才进入具体实现研究。

## 工单五 验证原子件组合与受限组装

**对象与原因**  
验证“几个解释得清、可修改的小件，能否稳定组成一个新任务”，而不是先收集大量模板再寻找用途。

**输入与依赖**  
Design 组合可直接使用工单三已验证的内容/排版与小件；Motion 组合另外依赖工单四选定的时间任务、失败指标与无运动替代。下列时间、帧与音频检查仅用于 Motion 路径。实施前重新检查所选 Remotion 版本、依赖和具体素材授权；本提案不试装、不写视频代码、不打包外部资产。

**worker 登记与 Opus 自由**  
从完成任务所需的最少原子件起步，通常两三件足以暴露组合问题，数量可因问题调整。worker 登记输入、可调边界、接续状态、时间约定、关键帧与失败条件；Opus 决定自由创作、适配或放弃某件，不强迫所有件统一 API。

**最小交付**  
一个短组合、一个陌生内容替换、必要的逐帧/播放证据和简短回写。按需记录语义用途、输入、时间/状态边界、与邻件的连接及已知限制；现有记录容纳得下就不另开 catalog schema。

**验收**  
组合前先验证各件首尾状态和关键内容；组合后检查注意力竞争、重叠与遮挡、内容截断、入出场接缝、数值终态、字幕/音频同步、seek 与重复渲染一致性，以及本任务适用的减弱运动方案。可编译或抽两帧不报错只是工程底线，仍须实际观看全段及关键帧。

主试验允许对内容与媒介作合理适配。若需要分辨“原件问题还是改写问题”，另设只冻结某些变量的诊断对照，并写清冻结理由；“不许 Flash 重新设计”不成为日常常规限制。记录改了哪里、实际适配成本、收益与新缺陷，不设置没有客观判据的 70–80% 复用目标。

**停止与 ledger**  
内容替换或连接后失败时，缩小原子件适用范围，或保持 reference；不要靠继续增加模板覆盖失败。若少量件已产生可说明、可复现的价值，再决定扩多少、扩什么。codemods 仅可作为后续受控源码编辑实验，必须先验证当前 API 支持的具体改动，保留差异与回退；它不替代编译、渲染或视觉验收。

## 外部材料该怎样进入提案

- 官方 Remotion：作为实现能力与接口限制的首要依据；不能替代 Motion 意义与设计判断。
- Elements Guidelines：适合借鉴聚焦、可组合、可修改、真实视频参考与代表性预览；不照搬成所有媒介都必须遵守的统一组件协议。
- video-shotcraft：适合观察“用途→运动语义→配方→准确实现→预览”的对应方式及局部参数边界；先挑任务相关样本，保留其产品宣传片背景。
- remotion-templates：适合研究检索、输入说明和接续建议的组织方式；生成式目录中的字段完整性不等于逐条策展或组合已验。
- remotion-motion-graphics-skill：值得吸收先诊断、看关键帧、查静默失败；其中审美偏好和效果观察保持作者/场景限定。

以上是借鉴位置，不构成复制、安装或执行这些库的授权。

## 事实核验附录

### 核验方法与限制

先读取六个指定 URL；GitHub 项目再用当前 main 的固定提交核对有关正文与代码。发现搜索抓取版本落后时，以固定提交为准。只做只读文本、源码与目录元数据检查，没有安装、执行或渲染外部工具，没有观看完整示例影片，也未对素材授权逐件审查。

固定提交：
- video-shotcraft：5ddbf521038b0a7accfb6dc1e0a9eb29c67277ab
- remotion-templates：6430d423c417b360e598b64a852e7cc57ed9afbe
- remotion-motion-graphics-skill：1fc286924c68260b7945f1f29e474b986446b70d

下文分别标为“官方文档”“社区文件可核事实”“作者自报”或“本提案假设”。不把来源自己的质量承诺写成独立验收结论。

### 1 官方 AI Skills 当前能力范围

当前页列出 12 项：best-practices、create、markup、studio、render、maps、captions、saas、interactivity、docs、upgrade、multimedia。此前所引七项属于其中一部分。数量不是选择依据，应按任务核对能力与当前接口。

官方将 markup 的范围写到 compositions、动画、布局、字体、媒体、音频和 timing；另有字幕、预览、渲染和交互编辑入口。文档的存在不证明该组合已经适合 Praxis 工作流。

来源：[Remotion Agent Skills](https://www.remotion.dev/docs/ai/skills)  
等级：官方文档；核验的是页面声明，未安装技能

### 2 Elements Guidelines 是聚焦与组合指导

官方要求 Element 从已发布视频的技术出发记录链接与时间点，使用原创视觉处理，并避免照搬品牌或专有素材。强调用途聚焦、可移植、可编辑、依赖声明及能展示全时段的预览。临时覆盖物需有进入与退出；背景和循环等有例外。

这些原则支持工单五的小件实验，不能推导“所有动画都必须 enter→hold→exit”或所有对象都该暴露全部内部参数。

来源：[Element Guidelines](https://convert.remotion.dev/elements/guidelines)  
等级：官方文档；未检验任何 Element 的实际表现

### 3 video-shotcraft 的 157 与 214 核到哪里

固定提交 README 主口径为 157 shot recipe cards、214 styles / motion previews。对 gallery/api/library.json 的 cards 和 styles 数组实际计数为 157 与 214，其中 214 个 style 带 media URL，与其 stats 相符。

这证明目录条目数量相符，不证明全部媒体可播放、相互独立或达到同等质量。同一项目仍有 152/209 历史说明和 216 workbench demo 的另一口径，不能混写成一个库存数。该 JSON 的 generatedAt 早于其 newest 字段，故以提交定位快照，不仅依赖生成时间判断新旧。

来源：[固定 README](https://github.com/Vincentwei1021/video-shotcraft/blob/5ddbf521038b0a7accfb6dc1e0a9eb29c67277ab/README.md)、[固定 Gallery JSON](https://github.com/Vincentwei1021/video-shotcraft/blob/5ddbf521038b0a7accfb6dc1e0a9eb29c67277ab/gallery/api/library.json)  
等级：社区文件可核事实；未验预览

### 4 normalized t 有明确适用范围

当前 demos/README 将 Motion 家族的 48 卡描述为由 useT() 驱动；抽查 Motion.tsx 与 AuroraBloomBgFlip.tsx，可见按帧及 durationInFrames 计算归一进度，再用 seg 分段与缓动。

不能据此声称所有 157 卡都是同一接口。文档还说明三个文字密集组件会测量字宽，字体回退可改变布局。归一时间有助于表达比例，但不自动保证换时长后的可读性、不同 fps 下的绝对节奏或跨字体等价。

来源：[固定 demos 说明](https://github.com/Vincentwei1021/video-shotcraft/blob/5ddbf521038b0a7accfb6dc1e0a9eb29c67277ab/demos/README.md)、[Motion 公共件](https://github.com/Vincentwei1021/video-shotcraft/blob/5ddbf521038b0a7accfb6dc1e0a9eb29c67277ab/demos/_fixtures/Motion.tsx)、[抽查实现](https://github.com/Vincentwei1021/video-shotcraft/blob/5ddbf521038b0a7accfb6dc1e0a9eb29c67277ab/demos/effects/aurora-bloom-bg-flip/AuroraBloomBgFlip.tsx)  
等级：社区说明与源码抽查；未运行；迁移限制为本提案推论

### 5 shotcraft 的目录字段不是默认模型

已读取的 Gallery 记录包含 name、summary、use、duration、energy、intention、source、styles、category、tags 及时间/链接字段；style 层含 key、label、description、media，部分含 use。

其用途是帮助定位作者的卡片、变体与对应材料。Praxis 可以先借鉴“用途与限制能否帮助选择”，无需复制整套字段，更不必据此重建目录。

来源：[固定 Gallery JSON](https://github.com/Vincentwei1021/video-shotcraft/blob/5ddbf521038b0a7accfb6dc1e0a9eb29c67277ab/gallery/api/library.json)  
等级：社区文件可核事实；是否借鉴为本提案选择

### 6 remotion-templates 已不只是旧版索引

搜索抓取最初返回旧版 curated index；当前固定提交 README 已改为作者声称的 1,000 templates、100 family engines，并提供 registry、agent catalog、预览与机械验收流程。本次没有逐项统计或验收这 1,000 个模板。

catalog 生成器可核到 visualRole、bestUseCases、inputs、timing、composability、customizationNotes、constraints、usageExamples 等字段。许多说明来自类别级 guidance；story beats 按总时长的 18%、55%、82%生成。因此“有语义字段”不等于“每个模板的时序都由任务或观察推导”。

完整 agent-catalog JSON 因工具返回体积限制未成功读取；上述字段结论来自实际读取的生成器，不能误写为逐条检查过成品目录。

来源：[固定 README](https://github.com/ali-abassi/remotion-templates/blob/6430d423c417b360e598b64a852e7cc57ed9afbe/README.md)、[catalog 生成器](https://github.com/ali-abassi/remotion-templates/blob/6430d423c417b360e598b64a852e7cc57ed9afbe/scripts/build-agent-catalog.mjs)  
等级：规模为作者自报；字段与生成逻辑为源码可核事实

### 7 机械 gate 与视觉验收有边界

该库 gate 实现进行 TypeScript 检查、打包并为每项渲染两个缩小静帧；当前实现选 25% 与 75% 时点，与文件头“first/mid”的旧注释不同。它捕获工程失败，不自动判断叙事、可读性或真实内容适配。

当前 SKILL.md 的部分效果示例仍用 Math.random()；官方文档说明多线程渲染时真随机可能导致不一致，并提供固定 seed 的 random()。因此即使正文宣称 deterministic，也不能直接信任所有片段。

来源：[gate 实现](https://github.com/ali-abassi/remotion-templates/blob/6430d423c417b360e598b64a852e7cc57ed9afbe/scripts/gate.mjs)、[固定 SKILL](https://github.com/ali-abassi/remotion-templates/blob/6430d423c417b360e598b64a852e7cc57ed9afbe/SKILL.md)、[Remotion random](https://www.remotion.dev/docs/random)  
等级：源码与官方文档交叉核对；本次未执行 gate

### 8 craft rules 效果观察是小范围作者自报

fernandokaraka README 称其 craft rules 与无 skill 表现相同；对应 v2 提交说明写的是三个案例。未提供足以独立重建比较的完整模型、任务集与评分证据，不能推出“craft rules 普遍无效”。

可带入本轮的候选做法是：先诊断实际错误、查看关键帧、显式报告未执行。文中关于“永不 linear”、持续 idle life、音效贡献比例等偏好不升为通则。其数值未 clamp 的示例机制，与官方 interpolate 默认外推说明一致，但原案例的实际评分仍未独立核验。

来源：[固定 README](https://github.com/fernandokaraka/remotion-motion-graphics-skill/blob/1fc286924c68260b7945f1f29e474b986446b70d/README.md)、[v2 提交说明](https://github.com/fernandokaraka/remotion-motion-graphics-skill/commit/1fc286924c68260b7945f1f29e474b986446b70d)、[官方 interpolate](https://www.remotion.dev/docs/interpolate)  
等级：效果为作者自报；默认外推为官方能力；采用何种流程为本提案假设

### 9 codemods 能编辑源码 不能替代成片判断

官方将 @remotion/codemods 标为不稳定 Draft API。它接受文件路径与源码映射，能发现节点、插入元素、修改 props/动画、管理 composition 注册并返回变更。它本身不读写文件、不运行项目、不下载媒体、不安装包，也不求值任意 JavaScript。

applyCodemodChanges 检查 previousContents，可按文件差异做事务性应用及回退；节点引用针对源码而非某个渲染实例，共用组件或循环节点的改动会影响多处使用。因此适合研究可审阅的小范围编辑，不可称为可靠的自动组片、素材理解或视觉验收引擎。

来源：[官方 codemods](https://www.remotion.dev/docs/codemods/)  
等级：官方文档；未安装、未验证目标版本兼容性

## 放行建议

现在只需确认工单一的输入与范围。九项 correction 原文到齐后逐项核对；其余独立研究已可用于方案判断。只有每包产生了明确的新证据，才放行下一个有用的实验。若已有内容已足够，最佳结果可以是更清楚的入口、更小的边界说明，以及零新增资产。
