description: 当某条 grammar 校订意见需要核查依据或适用边界时，按来源编号读取相应行，无需通读规范或本表。

# Design grammar atlas：规范与工程来源登记

阅读日期：2026-10-02。用途：为候选维度与校订意见保留最小充分证据；不是现成设计系统、强制 schema、施工规范或素材包。问题入口见 [候选维度的问题索引](grammar-dimensions.md)。

## 问题索引

- 判断网页硬门槛与级别：S01；UA 强制颜色/运动偏好机制：S02/S03
- 阅读与中文/RTL：S07/S04/S05；内容结构：S13
- 状态/形状/材料：S12/S08/S09；图像用途：S11
- 数据编码与标签：S06/S14；运动/空间/声音：S10/S15

## 检索和阅读口径

- Exa 检索 9 次，每次 `numResults=5`；**numResults 总和 = 45**。这是请求的候选结果预算，含重复候选，**不等于实读 45 个来源**。
- Exa fetch **15 次，15 个不同 URL 成功取得正文**。15 页均阅读与条目有关的正文；WCAG、CSS 规范与 CLReq 为大文档，重点阅读适用范围、状态及相关章节，不宣称逐字通读全文。
- 实际视觉图像检视 **0 页**；此次证据全部来自文字规范/工程指南。没有把图像标题、替代文本或搜索缩略图当作“已看图”，不据未看的示例图提出视觉结论。
- 15 条都来自原规范组织、产品平台或原系统团队。**官方来源的权威性只覆盖自身规范/系统，不意味着其审美偏好或效率主张已经得到独立实证**。
- 本次未核验任何第三方图片、字体、代码、声音的具体复用许可。可引用链接并用自己的话概括已读内容；下表“可转样例”均指以后用原创内容/资产重建问题，不是复制原图、原文、组件或品牌资源。需要打包原资产时另查每项许可与署名条件。公开可读不等于可自由再分发。

## 来源表

“看图”列全部为“否（仅正文）”；因此图中对照与动画效果均不作为本轮验证证据。链接里的具体版本可能更新，下面保留此次实际读到的状态。

| ID / 出处 | 实读版本/质量与范围 | 支持什么 | 不支持什么 | 可转为原创样例 | 复用边界 / 看图 |
|---|---|---|---|---|---|
| S01 [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) | 正文为 2024-12-12 Recommendation；W3C 网页无障碍标准，条款有 A/AA/AAA 与例外 | 程序化结构/读序、非色信息、文字/非文字对比、缩放重排、焦点、目标尺寸、键盘、名称角色状态、音频/动效条件 | 不定义“好看”；不自动等于法规适用结论、印刷规范、PDF/UA 认证或产品全体验可用性；AAA 条款不能冒充 AA | 同内容的读序/重排、状态/目标区、色义冗余、文本覆盖夹具 | 仅释义与引用；未复制规范全文或媒体；否 |
| S02 [W3C CSS Color Adjustment Level 1](https://www.w3.org/TR/css-color-adjust/) | 2025-12-16 Candidate Recommendation Snapshot；CSS 自动颜色调整机制，尚非 Recommendation | forced-colors 可重映射颜色、移除 box/text shadow、改变非 URL 背景图；系统颜色与局部 override 的边界 | 不保证所有浏览器一致；不支持为品牌还原而全局关闭用户颜色；不规定印刷成品色差 | 相同控件的填充/描边/阴影冗余；强制颜色下状态可见性 | 仅行为释义与原创夹具；规范许可/代码复用须另查；否 |
| S03 [W3C Media Queries Level 5](https://www.w3.org/TR/mediaqueries-5/) | 实读为 2021-12-18 Working Draft；本文记录草案状态，不称正式推荐标准 | `prefers-reduced-motion` 检测已表达的偏好，reduce 倾向减少非必要运动；forced-colors 与偏好是环境条件 | `no-preference` 不是用户喜欢动画；检测机制不自动修复体验；不证明草案所有媒体特性已广泛实现 | 同一状态变化的常规/减少运动对照 | 仅机制释义与原创夹具；未复用代码；否 |
| S04 [W3C 中文排版需求 CLReq](https://www.w3.org/TR/clreq/) | 2026-09-01 Group Note Draft；中文布局任务团，网页/数字出版排版需求与实践汇总，仍是工作中草案 | 地区不等于简繁；横竖排、混排、标点位置/挤压、行首行尾禁则、不可分单元；文中明确禁则严格度可配置 | 不直接成为强制标准；不是所有 CJK 的统一规则；不把每一中文地区固定为唯一美学；未核查所引国家标准全文 | 同一中文段落在明确地区、宽度与禁则策略下的边界比较 | 仅释义；不摘录图样或规范长段；否 |
| S05 [W3C Inline markup and bidirectional text in HTML](https://www.w3.org/International/articles/inline-bidi-markup/) | 国际化团队实践指导；主要讨论 HTML 行内方向、隔离与嵌套 | 已知反向片段的 dir；未知片段 dir=auto/bdi；数字、标点与方向片段的污染风险 | 不覆盖全部块级 RTL、图标镜像、阿拉伯字体整形或图表轴语义；文中历史浏览器描述不当作当前兼容性报告 | 原创 RTL 句中放编号、括号、产品名、未知用户名，检查显示/复制/朗读 | 仅指导释义；页面含图示但本轮未看、不引用视觉结果；否 |
| S06 [Carbon：Color palettes](https://carbondesignsystem.com/data-visualization/color-palettes/) | IBM/Carbon 自有系统工程指南，页面标 work in progress | 类别、顺序、发散、状态配色应按数据关系分开；该系统明暗主题映射和类别配色顺序 | Carbon 的具体 palette/token 顺序不是普适审美法；其“gradient”禁用语句针对本系统装饰用法，不等于否定连续数据色标 | 同一数据任务的类别/顺序/发散编码，另加非色冗余 | 不复制调色板图库/图例原图；以原创数据研究原理；否 |
| S07 [USWDS：Typography](https://designsystem.digital.gov/components/typography/) | 页面元数据 2026-08-28；美国政府网页系统自身排版指导 | 字号、行长、行距、留白与层级互相影响；标题靠近所属段落；短标签与长文可采用不同目标 | 页面默认字体/16px/45–90 字符/左对齐等不是所有语言媒介的硬规范；“衬线更适于长文”等不在本轮升级成实验结论 | 相同真实内容逐轴改行长/行距/分组距离，而非复刻整套 USWDS | 正文摘要与链接；字体/图/代码单独核验授权；否 |
| S08 [Material 3：Corner radius scale](https://m3.material.io/styles/shape/corner-radius-scale) | Google 原系统指导；当前页列十级 scale，并说明 style 和 component 两层重映射 | 形状可有对称/非对称；圆角、切角与内容余量/嵌套关系；可按组件重映射 | 不支持“一 profile 一套不可改 tokens”；数值 dp 不自动是 CSS px；光学圆角公式是设计指导，不是感知定律 | 同尺寸同内容的圆角/切角对照；嵌套边界与 padding 关系 | 不复制官方图/动画或品牌形状资产；原创重建关系；否 |
| S09 [Apple HIG：Materials](https://developer.apple.com/design/human-interface-guidelines/materials) | Apple 平台指南；页面更新包含 2025-09-09 Liquid Glass；含各平台分节 | 材料应按用途与层级选择；薄厚材质在上下文保留与前景对比间权衡；系统/可访问性设置能改变表现 | Apple 的 Liquid Glass 内容/控制分层不是所有媒介义务；视觉模仿不继承系统可访问性；不保证自定义玻璃在任意背景合格 | 原创覆盖层在纯色/复杂图/滚动背景下的边界与文字对照 | 不复制 Apple 资产/截图库/系统外观素材；仅研究原则；否 |
| S10 [Apple HIG：Motion](https://developer.apple.com/design/human-interface-guidelines/motion) | Apple 平台实践指导，含 visionOS；更新记录至 2025-09-09 | 动效服务反馈与位置关系；可取消/可选；空间中的周边运动、大物体运动与参照框架有舒适性风险 | 不是统一时长/弹簧 preset；未执行前庭或真机实验；游戏帧率经验不转为所有 UI 硬要求 | 同结果的移动/淡变/即时反馈；有空间需求时比较稳定参照 | 不复制视频/动画；原创时序与资产；否 |
| S11 [W3C WAI：Images Tutorial](https://www.w3.org/WAI/tutorials/images/) | WAI 网页实施教程，汇合不同级别 WCAG 条款的指导；不是独立新的合规级别 | 按装饰/信息/功能/复杂图选择等效文本策略；alt 取决于上下文与目的 | 不能机械按图片风格生成 alt；“只有文字”不天然更可访问；不覆盖作品授权与事实真实性 | 同一原创图像在说明、操作、装饰三个用途下不同等效内容 | 仅释义，不复用教程图片；否 |
| S12 [WAI-ARIA APG：Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) | W3C APG 作者实践模式；网页交互实现指南，不能代替 WCAG/ARIA 规范或实际辅助技术测试 | 按钮与链接行为区分；Enter/Space；动作后的焦点；toggle 的 aria-pressed 与标签策略；不可用状态 | 不是“加个 role 就完成键盘行为”；不强迫所有控件套 button 模式；不支持 selected/pressed 混为一谈 | 原创普通按钮、切换按钮、打开/关闭上下文的状态轨迹 | 仅模式释义；示例代码未复制，复制时另查许可与警告；否 |
| S13 [GOV.UK：Create a clear structure for your content](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-structure/) | GOV.UK 内容团队实际服务指导，页面标 Beta；特定网页任务语境 | 重要信息前置、描述性标题、步骤/列表、避免重复；内容结构与用户任务关联 | 不把 F 型阅读或 20–28% 阅读比例当普适实证：本轮未回溯原研究；不外推禁脚注/禁问句标题为编辑出版规范 | 同事实集的操作型内容结构对照；检查标题能否定位行动 | 仅释义；复用原文时另审授权/署名；否 |
| S14 [IBM Design Language：Data visualization / Design](https://www.ibm.com/design/language/data-visualization/design/basics/) | 原设计系统实践指南，品牌与信息表达并重 | 标题/标签/图例、单位与尺度、纹理/标记冗余、不可把重要信息藏在交互后；变化动效要保留关系 | “交互最大化价值”等是系统立场，非所有图表定律；未看页面图/动画，不能对其美学效果下结论；不提供所有统计图正确性规则 | 原创图表的直接标签/图例、纹理冗余、静态/按需细节比较 | 不复制 IBM 图例/品牌素材；原创数据与表现；否 |
| S15 [Apple HIG：Playing audio](https://developer.apple.com/design/human-interface-guidelines/playing-audio) | Apple 音频体验指南，含系统类别/控制与 visionOS 分节 | 用户音量/输出/静音与中断预期；空间音的固定或随对象参照；非主要音频不任意打断别的音频 | visionOS “偏好有声音”不能外推网页自动播放；不说明所有文化/场景的音色偏好；没有替代完整听觉可访问性或真机测试 | 原创声音的对象锚定/固定提示、静音与中断对照；仅在真正需要声音时做 | 声音素材本轮未取用；后续必须原创或明确授权；否 |

所有行的实际阅读日期均为 **2026-10-02**。

## 必须向后续打样保留的争议与缺口

1. **规范等级与系统建议不同**：WCAG Recommendation、CSS 候选推荐、Media Queries 工作草案、CLReq Group Note Draft、APG 实践模式和商业平台 HIG，不能写成同一层“标准”。
2. **系统之间并不需要合并为一个共识**：USWDS 面向政府网页、GOV.UK 面向任务内容、Apple 含原生和空间平台、Carbon 含企业数据图表。保留上下文，再比较可迁移关系。
3. **实证目前不足**：未做用户测试、可访问性技术实测、字体光学校准、图表读数实验、纸张/印刷打样或空间舒适性测试。C 与 T 不因此伪装成 E。
4. **图像证据留空是有意边界**：本轮只交 grammar 登记；后续若引用某个原图的布局、对比或细节，必须实际看图并记用途/许可，不能把本表当视觉审稿记录。
5. **CJK 范围**：本次充分来源是中文；“CJK”只是风险入口命名。日文、韩文不能靠 CLReq 一次覆盖，遇到真实内容再追加相应原生规则与样本。
