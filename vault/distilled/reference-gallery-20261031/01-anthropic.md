# Anthropic｜视觉章节 Distill

> 版本：2026-10-31 · 收录 60 条 · 来源：Azivor/reference · 分析级别：原库条目说明与作者设计观察的二次提炼，非逐张像素审查。

## 章节主旨

**编辑拼贴作为品牌视觉主语法**。多数样本并不使用现代 SaaS 界面组件，而将纸面、照片、制图与物理对象编排成具有科学/人文张力的研究封面；少数发布视觉转向大面积暗场与光学地平线。

## 可迁移的视觉语法

- **结构**：双栏与三栏异质拼接、不等宽接缝、矩形开窗、圆形掩模。用于制造阅读顺序，但不等同于产品栅格。
- **介质**：方格纸、账本、半色调、青晒图、撕纸、档案照片、黄铜器物。不同材质通过共同颗粒度和有限配色关联。
- **语义**：通过一件可辨识实体（钥匙、天平、扳手、剪刀、仪器）给抽象研究主题建立物理隐喻；物件是封面元素，不应被误当作可交互控件。
- **色彩**：米白、桃粉、黄、绿、深蓝常作为大面积纸面；蓝、红或珊瑚色以少量高色度标记承担视线锚点。这里是观察，不是官方色值。
- **例外分支**：黑底细网络（#014）、暗场菌褶（#015）、大气地平线（#023）、舷窗地球（#041）、发布页（#006），共同指向以光和空间表达能力。

## 簇级检索

- **纸面拼贴与研究档案**：[`#001`](#ref-001), [`#002`](#ref-002), [`#003`](#ref-003), [`#008`](#ref-008), [`#009`](#ref-009), [`#010`](#ref-010), [`#017`](#ref-017), [`#018`](#ref-018), [`#033`](#ref-033), [`#043`](#ref-043), [`#050`](#ref-050)
- **图解、符号与物理隐喻**：[`#007`](#ref-007), [`#012`](#ref-012), [`#019`](#ref-019), [`#026`](#ref-026), [`#034`](#ref-034), [`#035`](#ref-035), [`#037`](#ref-037), [`#042`](#ref-042), [`#046`](#ref-046), [`#047`](#ref-047), [`#051`](#ref-051)
- **植物、标本、青晒与复现**：[`#016`](#ref-016), [`#024`](#ref-024), [`#028`](#ref-028), [`#030`](#ref-030), [`#031`](#ref-031), [`#032`](#ref-032), [`#040`](#ref-040), [`#054`](#ref-054), [`#058`](#ref-058)
- **电影光学与发布视觉**：[`#006`](#ref-006), [`#014`](#ref-014), [`#015`](#ref-015), [`#023`](#ref-023), [`#041`](#ref-041)
- **结构性对照与视觉节奏**：[`#004`](#ref-004), [`#005`](#ref-005), [`#011`](#ref-011), [`#013`](#ref-013), [`#020`](#ref-020), [`#025`](#ref-025), [`#038`](#ref-038), [`#045`](#ref-045), [`#055`](#ref-055), [`#056`](#ref-056), [`#057`](#ref-057), [`#060`](#ref-060)

## Fresh Agent UI 适用范围

研究报告封面、专题导览、证据包入口、重度信息页的章首识别区。为业务 Control Plane 的「复杂信息有序陈列」提供视觉文化参照。

## 不应迁移的部分

不要把仿旧纸纹、半色调或拼贴用于合同正文、重要参数、表格背景、错误提示、图谱节点等高密度/高精度对象；不要把科研照片拼贴误认为证据。

## 全量逐条索引

以下每条均提供稳定 ID、压缩视觉线索、原出处与画廊图片入口。原始素材不打包；必要时通过链接查看。

### <a id="ref-001"></a>#001 · How Claude designed protein binders against scorpion neurotoxins
- **线索**：赭色地质与实验照片拼接；电蓝钥匙与蝎子线稿形成强聚焦，颗粒统一材质。
- **检索标签**：paper-collage, grain-and-print, physical-metaphor, dramatic-light, material-tactility。
- **引用**：`anthropic-claude-scorpion-toxin-binder-design` · [Photo + graphic](https://azivor.github.io/reference/assets/images/7452ce622cc4f4a9-1440-q86.webp) · [原出处](https://www.anthropic.com/research/claude-scorpion-toxin-binder-design) · 记录日期 2026-10-20

### <a id="ref-002"></a>#002 · Early progress on accelerating drug development with Claude
- **线索**：档案实验影像叠加账本纸与重复圆片；绿、白、珊瑚色建立节奏。
- **检索标签**：paper-collage, archival-and-editorial。
- **引用**：`anthropic-early-progress-drug-development` · [Photo + graphic](https://azivor.github.io/reference/assets/images/c3aae68f9e261dee-1440-q86.webp) · [原出处](https://www.anthropic.com/research/early-progress-drug-development) · 记录日期 2026-10-27

### <a id="ref-003"></a>#003 · An alignment assessment of the UK AISI cybertesting incident
- **线索**：蓝色机车照片与珊瑚色方格纸不等分；松动墨线打破机械秩序。
- **检索标签**：paper-collage, grid-and-drafting, material-tactility, diagrams-and-lines。
- **引用**：`anthropic-alignment-assessment-ukaisi` · [Photo + graphic](https://azivor.github.io/reference/assets/images/4fa40f90b5febcef-1440-q86.webp) · [原出处](https://www.anthropic.com/research/alignment-assessment-ukaisi) · 记录日期 2026-10-23

### <a id="ref-004"></a>#004 · Anthropic update on independent evaluators
- **线索**：圆形技术制图与流动大理石纹相接；蓝色小标记串联异质画面。
- **检索标签**：grid-and-drafting。
- **引用**：`anthropic-an-update-on-independent-evaluators` · [Photo + graphic](https://azivor.github.io/reference/assets/images/6888ffc20c7ce09a-1440-q86.webp) · [原出处](https://www.anthropic.com/news/an-update-on-independent-evaluators) · 记录日期 2026-10-15

### <a id="ref-005"></a>#005 · Working at the frontier shapes expectations for the future
- **线索**：海平线贯穿圆形遮罩；深蓝反相与绿色纸面制造透视连续性。
- **检索标签**：paper-collage, material-tactility。
- **引用**：`anthropic-expectations-for-the-future` · [Photo + graphic](https://azivor.github.io/reference/assets/images/c51652c95bd9b947-1440-q86.webp) · [原出处](https://www.anthropic.com/research/expectations-for-the-future) · 记录日期 2026-10-16

### <a id="ref-006"></a>#006 · Claude Opus 5.5 — cinematic launch page
- **线索**：暖冷渐变地平线与大衬线标题；相片边条、目录序号组织发布页。
- **检索标签**：archival-and-editorial, optical-horizon, dramatic-light, large-type。
- **引用**：`anthropic-opus-5-5-launch-page` · [Website / editorial](https://azivor.github.io/reference/assets/images/f66cf9e815d9f3b8-1440-q86.webp) · [原出处](https://www.anthropic.com/claude-opus-5-5) · 记录日期 2026-09-22

### <a id="ref-007"></a>#007 · Economic Futures Research Fund agenda
- **线索**：黄纸上的黄铜天平对抗大红蓝几何记号；小物件与大色块互补。
- **检索标签**：paper-collage, grid-and-drafting, physical-metaphor, material-tactility。
- **引用**：`anthropic-economic-futures-research-fund-agenda` · [Photo + graphic](https://azivor.github.io/reference/assets/images/ade06c0ed0c675ed-1440-q86.webp) · [原出处](https://www.anthropic.com/news/economic-futures-research-fund-agenda) · 记录日期 2026-07-22

### <a id="ref-008"></a>#008 · Designing more efficient quantum circuits with Claude
- **线索**：绿机械蓝图、黄标尺与历史控制室照片并置；三段式技术时间感。
- **检索标签**：grid-and-drafting, archival-and-editorial, material-tactility。
- **引用**：`anthropic-designing-efficient-quantum-circuits` · [Photo + graphic](https://azivor.github.io/reference/assets/images/ccd5f16ee210cb4f-1440-q86.webp) · [原出处](https://www.anthropic.com/research/designing-efficient-quantum-circuits) · 记录日期 2026-10-16

### <a id="ref-009"></a>#009 · Investigating unintended model actions in our evaluations and internal use
- **线索**：账本、删改文件与科学照片作纵向分栏；单枚红圆片定焦。
- **检索标签**：paper-collage, material-tactility。
- **引用**：`anthropic-investigating-unintended-model-actions` · [Photo + graphic](https://azivor.github.io/reference/assets/images/79313015b27ac23a-1440-q86.webp) · [原出处](https://www.anthropic.com/research/investigating-unintended-model-actions) · 记录日期 2026-10-09

### <a id="ref-010"></a>#010 · Results from the first Anthropic Public Record
- **线索**：X 光、木槌与手部摄影跨材质拼贴；粉、炭灰与赭色协调。
- **检索标签**：paper-collage, dramatic-light, human-scale, material-tactility。
- **引用**：`anthropic-anthropic-public-record` · [Photo + graphic](https://azivor.github.io/reference/assets/images/afcc6a2edda14061-1440-q86.webp) · [原出处](https://www.anthropic.com/research/anthropic-public-record) · 记录日期 2026-06-12

### <a id="ref-011"></a>#011 · Claude-shaped science
- **线索**：圆形样本、计算器与亮色凭票交错；纸纹和半色调收束高饱和。
- **检索标签**：paper-collage, grain-and-print, archival-and-editorial, dramatic-light。
- **引用**：`anthropic-claude-shaped-science` · [Photo + graphic](https://azivor.github.io/reference/assets/images/e62b8dc953f6800e-1440-q86.webp) · [原出处](https://www.anthropic.com/research/claude-shaped-science) · 记录日期 2026-10-01

### <a id="ref-012"></a>#012 · Can we predict the jobs robots will do?
- **线索**：科学图表、照片碎片与径向仪表置于大幅纸面；留白优先。
- **检索标签**：paper-collage, grid-and-drafting, material-tactility, negative-space, diagrams-and-lines。
- **引用**：`anthropic-what-work-can-robots-do` · [Photo + graphic](https://azivor.github.io/reference/assets/images/791f63a7ac54cfa6-1440-q86.webp) · [原出处](https://www.anthropic.com/research/what-work-can-robots-do) · 记录日期 2026-09-30

### <a id="ref-013"></a>#013 · What do you want from AI?
- **线索**：手绘曲线、索引卡和撕纸叠层；不借助玻璃阴影营造深度。
- **检索标签**：paper-collage, diagrams-and-lines。
- **引用**：`anthropic-your-thoughts-on-ai` · [Photo + graphic](https://azivor.github.io/reference/assets/images/01fe3983ff0ad79d-1440-q86.webp) · [原出处](https://www.anthropic.com/research/your-thoughts-on-ai) · 记录日期 2026-09-29

### <a id="ref-014"></a>#014 · Project Glasswing: An initial update
- **线索**：深底与高对比细线网络；稀疏半透明放射结构保留暗部空间。
- **检索标签**：dramatic-light, negative-space, diagrams-and-lines。
- **引用**：`anthropic-glasswing-initial-update` · [Photo + graphic](https://azivor.github.io/reference/assets/images/f893d5b90bf023a6-1440-q86.webp) · [原出处](https://www.anthropic.com/news/glasswing-initial-update) · 记录日期 2026-05-22

### <a id="ref-015"></a>#015 · Claude Opus 5.5 — mushroom gills
- **线索**：几乎纯黑的背景里用掠射橙光照亮菌褶；局部材质被放大成电影感。
- **检索标签**：botanical-and-natural, dramatic-light, material-tactility, negative-space。
- **引用**：`anthropic-opus-5-5-mushroom-gills` · [Cinematic](https://azivor.github.io/reference/assets/images/d8390122f5f4abfc-1440-q86.webp) · [原出处](https://www.anthropic.com/claude-opus-5-5) · 记录日期 2026-09-22

### <a id="ref-016"></a>#016 · 2028: Two scenarios for global AI leadership
- **线索**：两种蓝底植物状态对照；颗粒统一不同生长形态。
- **检索标签**：grain-and-print, botanical-and-natural。
- **引用**：`anthropic-2028-ai-leadership` · [Photo + graphic](https://azivor.github.io/reference/assets/images/f5b292496830d0fa-1440-q86.webp) · [原出处](https://www.anthropic.com/news/2028-ai-leadership) · 记录日期 2026-05-14

### <a id="ref-017"></a>#017 · Enabling independent research on how people use Claude
- **线索**：柔焦设备摄影与硬格纸交界；自由墨线调和物理与抽象。
- **检索标签**：paper-collage, grid-and-drafting, material-tactility, diagrams-and-lines。
- **引用**：`anthropic-enabling-independent-research` · [Photo + graphic](https://azivor.github.io/reference/assets/images/0c5484e2d16fcd72-1440-q86.webp) · [原出处](https://www.anthropic.com/research/enabling-independent-research) · 记录日期 2026-08-26

### <a id="ref-018"></a>#018 · Focus areas for The Anthropic Institute
- **线索**：建筑测绘、重复幕墙、格纸与黑色环线；结构节律叠加纸质。
- **检索标签**：paper-collage, grid-and-drafting, diagrams-and-lines。
- **引用**：`anthropic-anthropic-institute-agenda` · [Photo + graphic](https://azivor.github.io/reference/assets/images/3920f5165e4c10be-1440-q86.webp) · [原出处](https://www.anthropic.com/news/anthropic-institute-agenda) · 记录日期 2026-05-07

### <a id="ref-019"></a>#019 · How well do job retraining programs work?
- **线索**：工具的矛盾组合形成视觉隐喻；金属质地对柔和桃色网点。
- **检索标签**：grain-and-print, physical-metaphor, material-tactility。
- **引用**：`anthropic-reviewing-the-evidence-on-worker-retraining-programs` · [Photo + graphic](https://azivor.github.io/reference/assets/images/2fc3a1323558124b-1440-q86.webp) · [原出处](https://www.anthropic.com/research/reviewing-the-evidence-on-worker-retraining-programs) · 记录日期 2026-08-12

### <a id="ref-020"></a>#020 · How people ask Claude for personal guidance
- **线索**：宽幅墨线跨越桃橘块面；邻接紫灰大理石纹形成疏密对比。
- **检索标签**：diagrams-and-lines。
- **引用**：`anthropic-claude-personal-guidance` · [Photo + graphic](https://azivor.github.io/reference/assets/images/bcad79a7b08f6798-1440-q86.webp) · [原出处](https://www.anthropic.com/research/claude-personal-guidance) · 记录日期 2026-04-30

### <a id="ref-021"></a>#021 · Inviting hard questions
- **线索**：细花照片与粗砾岩石摄影碰撞；大色纸板维持稳定骨架。
- **检索标签**：paper-collage, botanical-and-natural, material-tactility。
- **引用**：`anthropic-hard-questions` · [Photo + graphic](https://azivor.github.io/reference/assets/images/ce8a92faa001987b-1440-q86.webp) · [原出处](https://www.anthropic.com/news/hard-questions) · 记录日期 2026-07-09

### <a id="ref-022"></a>#022 · Assessing Claude Mythos Preview’s cybersecurity capabilities
- **线索**：纸折花与印刷碎片组成单一静物；奶油粉色从深灰场浮现。
- **检索标签**：paper-collage, grain-and-print, botanical-and-natural, negative-space。
- **引用**：`anthropic-mythos-preview` · [Photo + graphic](https://azivor.github.io/reference/assets/images/0aa6388d7a3c9d66-1440-q86.webp) · [原出处](https://www.anthropic.com/research/mythos-preview) · 记录日期 2026-04-07

### <a id="ref-023"></a>#023 · Claude Opus 5.5 — atmospheric horizon
- **线索**：深色弯曲天际以细橙边缘与蓝大气辉光分层；光本身成为信息。
- **检索标签**：optical-horizon, dramatic-light。
- **引用**：`anthropic-opus-5-5-atmospheric-horizon` · [Cinematic](https://azivor.github.io/reference/assets/images/d17de449952ce443-1440-q86.webp) · [原出处](https://www.anthropic.com/claude-opus-5-5) · 记录日期 2026-09-22

### <a id="ref-024"></a>#024 · Introducing our Science Blog
- **线索**：标本纸阵列中仅一枚绿色蝴蝶；暗圆形科学影像与方格纸呼应。
- **检索标签**：paper-collage, grid-and-drafting, botanical-and-natural, dramatic-light。
- **引用**：`anthropic-introducing-anthropic-science` · [Photo + graphic](https://azivor.github.io/reference/assets/images/89320da1f3efa1d6-1440-q86.webp) · [原出处](https://www.anthropic.com/research/introducing-anthropic-science) · 记录日期 2026-03-23

### <a id="ref-025"></a>#025 · Investing in the public benefit
- **线索**：草地和天空用矩形开窗互换位置；重复暖冷色建立连续画面。
- **检索标签**：botanical-and-natural, optical-horizon。
- **引用**：`anthropic-public-benefit-fund` · [Photo + graphic](https://azivor.github.io/reference/assets/images/0a150e5964b72d0a-1440-q86.webp) · [原出处](https://www.anthropic.com/news/public-benefit-fund) · 记录日期 2026-10-18

### <a id="ref-026"></a>#026 · Labor market impacts of AI: A new measure and early evidence
- **线索**：扳手跨置黄铜天平；荒诞物理隐喻与淡黄空场共同减噪。
- **检索标签**：physical-metaphor, material-tactility, negative-space。
- **引用**：`anthropic-labor-market-impacts` · [Photo + graphic](https://azivor.github.io/reference/assets/images/672eaf9833837985-1440-q86.webp) · [原出处](https://www.anthropic.com/research/labor-market-impacts) · 记录日期 2026-03-05

### <a id="ref-027"></a>#027 · Open call for guest investigators in the life sciences
- **线索**：生物绘图与旧显微照片落在青纸上；暖调手部摄影引入尺度。
- **检索标签**：paper-collage, grid-and-drafting, grain-and-print, archival-and-editorial, human-scale, material-tactility。
- **引用**：`anthropic-open-call-guest-investigators-life-sciences` · [Photo + graphic](https://azivor.github.io/reference/assets/images/955ee9b013896b03-1440-q86.webp) · [原出处](https://www.anthropic.com/news/open-call-guest-investigators-life-sciences) · 记录日期 2026-10-22

### <a id="ref-028"></a>#028 · Model deprecation update for Claude Opus 3
- **线索**：植物斜茎贯穿撕纸和格纸；低对比暖色让轮廓成为主角。
- **检索标签**：paper-collage, grid-and-drafting, botanical-and-natural。
- **引用**：`anthropic-deprecation-updates-opus-3` · [Photo + graphic](https://azivor.github.io/reference/assets/images/562f86a8e23b1609-1440-q86.webp) · [原出处](https://www.anthropic.com/news/deprecation-updates-opus-3) · 记录日期 2026-02-25

### <a id="ref-029"></a>#029 · Preparing for the 2026 US midterms
- **线索**：投票箱、城市地图与天平在纸面关联；两枚彩色圆片控制视线。
- **检索标签**：paper-collage, physical-metaphor, material-tactility。
- **引用**：`anthropic-2026-us-midterms` · [Photo + graphic](https://azivor.github.io/reference/assets/images/7f0520e444ddc984-1440-q86.webp) · [原出处](https://www.anthropic.com/news/2026-us-midterms) · 记录日期 2026-10-14

### <a id="ref-030"></a>#030 · Detecting and preventing distillation attacks
- **线索**：同一植物跨青晒图、网点与笔记线纸复现；比较来自印刷工艺差异。
- **检索标签**：paper-collage, grain-and-print, botanical-and-natural, material-tactility。
- **引用**：`anthropic-detecting-and-preventing-distillation-attacks` · [Photo + graphic](https://azivor.github.io/reference/assets/images/aea5e9413fa2743f-1440-q86.webp) · [原出处](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks) · 记录日期 2026-02-23

### <a id="ref-031"></a>#031 · Strengthening our defenses against distillation attacks
- **线索**：植物青晒图在格纸上多尺度退远；重复和尺寸递减制造纵深。
- **检索标签**：paper-collage, grid-and-drafting, grain-and-print, botanical-and-natural。
- **引用**：`anthropic-distillation-defenses` · [Photo + graphic](https://azivor.github.io/reference/assets/images/1bf0d59a3e6d8176-1440-q86.webp) · [原出处](https://www.anthropic.com/news/distillation-defenses) · 记录日期 2026-10-12

### <a id="ref-032"></a>#032 · Measuring AI agent autonomy in practice
- **线索**：飞鸟越过三种纸面色区；蓝晒植物压住底部，跨栏保持运动连续。
- **检索标签**：paper-collage, botanical-and-natural, material-tactility。
- **引用**：`anthropic-measuring-agent-autonomy` · [Photo + graphic](https://azivor.github.io/reference/assets/images/555f7fda64881535-1440-q86.webp) · [原出处](https://www.anthropic.com/research/measuring-agent-autonomy) · 记录日期 2026-02-18

### <a id="ref-033"></a>#033 · Introducing the Anthropic Cyber Mission
- **线索**：客簿文件、风景小照和红色数码纸；发现档案般的叙事质感。
- **检索标签**：paper-collage, grid-and-drafting, archival-and-editorial。
- **引用**：`anthropic-anthropic-cyber-mission` · [Photo + graphic](https://azivor.github.io/reference/assets/images/b58af5afa9b21b23-1440-q86.webp) · [原出处](https://www.anthropic.com/news/anthropic-cyber-mission) · 记录日期 2026-10-08

### <a id="ref-034"></a>#034 · Evaluating and mitigating the growing risk of LLM-discovered 0-days
- **线索**：树木年轮与罗盘玫瑰相对；双圆系统加测量条与老纸边。
- **检索标签**：paper-collage, physical-metaphor, botanical-and-natural。
- **引用**：`anthropic-zero-days` · [Photo + graphic](https://azivor.github.io/reference/assets/images/9788e7535de8e008-1440-q86.webp) · [原出处](https://www.anthropic.com/research/zero-days) · 记录日期 2026-02-05

### <a id="ref-035"></a>#035 · The persona selection model
- **线索**：银杏叶打断半色调技术圆阵；单一生物对象让抽象结构落地。
- **检索标签**：grid-and-drafting, grain-and-print, botanical-and-natural。
- **引用**：`anthropic-persona-selection-model` · [Photo + graphic](https://azivor.github.io/reference/assets/images/42740c448796db78-1440-q86.webp) · [原出处](https://www.anthropic.com/research/persona-selection-model) · 记录日期 2026-02-23

### <a id="ref-036"></a>#036 · Next-generation Constitutional Classifiers: More efficient protection against universal jailbreaks
- **线索**：微小黄铜扣件悬于粉纸；网状结构和粗紫颗粒分离密度。
- **检索标签**：paper-collage, grain-and-print, physical-metaphor, material-tactility。
- **引用**：`anthropic-next-generation-constitutional-classifiers` · [Photo + graphic](https://azivor.github.io/reference/assets/images/f71760b1d31f3753-1440-q86.webp) · [原出处](https://www.anthropic.com/research/next-generation-constitutional-classifiers) · 记录日期 2026-01-09

### <a id="ref-037"></a>#037 · Teaching Claude why
- **线索**：黄铜钥匙与半透明绘图模板成对；绿粉小色域与切孔对照。
- **检索标签**：grid-and-drafting, physical-metaphor, material-tactility。
- **引用**：`anthropic-teaching-claude-why` · [Photo + graphic](https://azivor.github.io/reference/assets/images/c58522e58f98ea3e-1440-q86.webp) · [原出处](https://www.anthropic.com/research/teaching-claude-why) · 记录日期 2026-05-08

### <a id="ref-038"></a>#038 · Experimenting with AI to defend critical infrastructure
- **线索**：深蓝空间开孔、建筑立面与天空摄影层叠；撕纸和透明青色营造空间。
- **检索标签**：paper-collage, optical-horizon。
- **引用**：`anthropic-critical-infrastructure-defense` · [Photo + graphic](https://azivor.github.io/reference/assets/images/bfe712c80d1341c4-1440-q86.webp) · [原出处](https://www.anthropic.com/research/critical-infrastructure-defense) · 记录日期 2026-01-08

### <a id="ref-039"></a>#039 · How AI assistance impacts the formation of coding skills
- **线索**：乐谱与月球极近景以深缝隔开；微小方向性纹理互文。
- **检索标签**：grain-and-print。
- **引用**：`anthropic-AI-assistance-coding-skills` · [Photo + graphic](https://azivor.github.io/reference/assets/images/c97b0eaa7044a5b0-1440-q86.webp) · [原出处](https://www.anthropic.com/research/AI-assistance-coding-skills) · 记录日期 2026-01-29

### <a id="ref-040"></a>#040 · Introducing Bloom: an open source tool for automated behavioral evaluations
- **线索**：树枝科学线描与深蓝植物印相相接；结构重复而非复制色彩。
- **检索标签**：grain-and-print, botanical-and-natural, diagrams-and-lines。
- **引用**：`anthropic-bloom` · [Photo + graphic](https://azivor.github.io/reference/assets/images/a9eecd24aceeceb3-1440-q86.webp) · [原出处](https://www.anthropic.com/research/bloom) · 记录日期 2025-12-19

### <a id="ref-041"></a>#041 · Claude Sonnet 5.5 — orbital window
- **线索**：航天舷窗框住明蓝地球；暗框景深配白色衬线标题与相片边条。
- **检索标签**：dramatic-light, large-type。
- **引用**：`anthropic-sonnet-5-5-orbital-window` · [Cinematic](https://azivor.github.io/reference/assets/images/332c528d68c767b9-1440-q86.webp) · [原出处](https://www.anthropic.com/claude-sonnet-5-5) · 记录日期 2026-09-28

### <a id="ref-042"></a>#042 · Introducing Anthropic Interviewer: What 1,250 professionals told us about working with AI
- **线索**：实体磁铁连接双向箭头；天空浅纹与深蓝黑底、单点红色反差。
- **检索标签**：physical-metaphor, archival-and-editorial, optical-horizon, diagrams-and-lines。
- **引用**：`anthropic-anthropic-interviewer` · [Photo + graphic](https://azivor.github.io/reference/assets/images/ac21222775e94f92-1440-q86.webp) · [原出处](https://www.anthropic.com/research/anthropic-interviewer) · 记录日期 2025-12-04

### <a id="ref-043"></a>#043 · Evaluating Claude with BioMysteryBench
- **线索**：解剖脑图压在奶油色撕纸上；珊瑚色版面与细绘线保持研究档案感。
- **检索标签**：paper-collage, archival-and-editorial, diagrams-and-lines。
- **引用**：`anthropic-Evaluating-Claude-For-Bioinformatics-With-BioMysteryBench` · [Photo + graphic](https://azivor.github.io/reference/assets/images/8a4cb0f811cbb8c0-1440-q86.webp) · [原出处](https://www.anthropic.com/research/Evaluating-Claude-For-Bioinformatics-With-BioMysteryBench) · 记录日期 2026-04-29

### <a id="ref-044"></a>#044 · How AI is transforming work at Anthropic
- **线索**：暖色办公室照片上的自由白线和米白徽记；现实尺度承载抽象身份。
- **检索标签**：human-scale, material-tactility。
- **引用**：`anthropic-how-ai-is-transforming-work-at-anthropic` · [Photo + graphic](https://azivor.github.io/reference/assets/images/2fcd3c3b196375c7-1440-q86.webp) · [原出处](https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic) · 记录日期 2025-12-02

### <a id="ref-045"></a>#045 · Vibe physics: The AI grad student
- **线索**：岩石照片切为多边形碎块；硬遮罩配格纸与暖色水洗。
- **检索标签**：paper-collage, grid-and-drafting, botanical-and-natural, material-tactility。
- **引用**：`anthropic-vibe-physics` · [Photo + graphic](https://azivor.github.io/reference/assets/images/49edf5caac97dbe9-1440-q86.webp) · [原出处](https://www.anthropic.com/research/vibe-physics) · 记录日期 2026-03-23

### <a id="ref-046"></a>#046 · Mitigating the risk of prompt injections in browser use
- **线索**：剪刀作为四种纸材交叉锚点；深红颗粒和绿网点形成非对称均衡。
- **检索标签**：paper-collage, grain-and-print, physical-metaphor, material-tactility。
- **引用**：`anthropic-prompt-injection-defenses` · [Photo + graphic](https://azivor.github.io/reference/assets/images/0833cbbeed60b69c-1440-q86.webp) · [原出处](https://www.anthropic.com/research/prompt-injection-defenses) · 记录日期 2025-11-24

### <a id="ref-047"></a>#047 · Disrupting an AI-orchestrated cyber espionage campaign
- **线索**：黄铜钥匙被强网格错位打断；浅蓝白纸与撕裂边缘仍保留轮廓。
- **检索标签**：paper-collage, grid-and-drafting, physical-metaphor, material-tactility。
- **引用**：`anthropic-disrupting-AI-espionage` · [Photo + graphic](https://azivor.github.io/reference/assets/images/dca3049d1c71e029-1440-q86.webp) · [原出处](https://www.anthropic.com/news/disrupting-AI-espionage) · 记录日期 2025-11-13

### <a id="ref-048"></a>#048 · Signs of introspection in large language models
- **线索**：高密度生理信号曲线与面包孔隙并置；温灰纸面、强纵缝连接异类。
- **检索标签**：paper-collage, physical-metaphor, material-tactility, diagrams-and-lines。
- **引用**：`anthropic-introspection` · [Photo + graphic](https://azivor.github.io/reference/assets/images/9fed6ae7df6583cb-1440-q86.webp) · [原出处](https://www.anthropic.com/research/introspection) · 记录日期 2025-10-29

### <a id="ref-049"></a>#049 · Preparing for AI’s economic impact: exploring policy responses
- **线索**：古典石柱与现代高楼同向抬升；蓝调建筑摄影、撕纸边界统一。
- **检索标签**：paper-collage。
- **引用**：`anthropic-economic-policy-responses` · [Photo + graphic](https://azivor.github.io/reference/assets/images/f16ac0cec723b619-1440-q86.webp) · [原出处](https://www.anthropic.com/research/economic-policy-responses) · 记录日期 2025-10-14

### <a id="ref-050"></a>#050 · How AI agents shape experts’ judgment calls
- **线索**：风暴帆船叠写旧记录与手稿；纸张磨损和斜置小图形成焦点。
- **检索标签**：paper-collage, grain-and-print, archival-and-editorial。
- **引用**：`anthropic-agents-judgment-calls` · [Photo + graphic](https://azivor.github.io/reference/assets/images/6dbd702fcd27ff4d-1440-q86.webp) · [原出处](https://www.anthropic.com/research/agents-judgment-calls) · 记录日期 2026-10-27

### <a id="ref-051"></a>#051 · Building AI for cyber defenders
- **线索**：透明锁处于精细几何笼中；黑场、绿纸、手写纹理并行。
- **检索标签**：paper-collage, grid-and-drafting, grain-and-print, physical-metaphor, negative-space。
- **引用**：`anthropic-building-ai-cyber-defenders` · [Photo + graphic](https://azivor.github.io/reference/assets/images/d8b441869446bc17-1440-q86.webp) · [原出处](https://www.anthropic.com/research/building-ai-cyber-defenders) · 记录日期 2025-09-29

### <a id="ref-052"></a>#052 · Persona vectors: Monitoring and controlling character traits in language models
- **线索**：解剖脑图、皱地图与白色小卡并置；粉色与土地图统一象征层。
- **检索标签**：editorial-art-direction。
- **引用**：`anthropic-persona-vectors` · [Photo + graphic](https://azivor.github.io/reference/assets/images/482466ddb6a36dff-1440-q86.webp) · [原出处](https://www.anthropic.com/research/persona-vectors) · 记录日期 2025-08-01

### <a id="ref-053"></a>#053 · How people use Claude for support, advice, and companionship
- **线索**：花卉、运动痕迹与重复阳台跨三种尺度；人文温度不靠人像特写。
- **检索标签**：botanical-and-natural, human-scale。
- **引用**：`anthropic-how-people-use-claude-for-support-advice-and-companionship` · [Photo + graphic](https://azivor.github.io/reference/assets/images/b0c8ffdf293d5a6a-1440-q86.webp) · [原出处](https://www.anthropic.com/research/how-people-use-claude-for-support-advice-and-companionship) · 记录日期 2025-06-27

### <a id="ref-054"></a>#054 · Values in the wild: Discovering and analyzing values in real-world language model interactions
- **线索**：墨弧与白牡丹在偏移接缝处互文；旧纸和棕色照片压低张力。
- **检索标签**：paper-collage, grain-and-print, botanical-and-natural, archival-and-editorial, material-tactility。
- **引用**：`anthropic-values-wild` · [Photo + graphic](https://azivor.github.io/reference/assets/images/652da00715fcc8cd-1440-q86.webp) · [原出处](https://www.anthropic.com/research/values-wild) · 记录日期 2025-04-21

### <a id="ref-055"></a>#055 · Evaluating feature steering: A case study in mitigating social biases
- **线索**：小型蓝色标本卡镶在酒红大底；流动大理石纹对抗硬矩形框。
- **检索标签**：paper-collage。
- **引用**：`anthropic-evaluating-feature-steering` · [Photo + graphic](https://azivor.github.io/reference/assets/images/402d384b6f7ade4d-1440-q86.webp) · [原出处](https://www.anthropic.com/research/evaluating-feature-steering) · 记录日期 2024-10-25

### <a id="ref-056"></a>#056 · Using dictionary learning features as classifiers
- **线索**：鲜红票据悬于技术绘图；竖向胶片、地形与数字域制造非对称焦点。
- **检索标签**：paper-collage, grid-and-drafting。
- **引用**：`anthropic-features-as-classifiers` · [Photo + graphic](https://azivor.github.io/reference/assets/images/9867bfbb8f815042-1440-q86.webp) · [原出处](https://www.anthropic.com/research/features-as-classifiers) · 记录日期 2024-10-16

### <a id="ref-057"></a>#057 · Golden Gate Claude
- **线索**：同一桥塔摄影三连；灰、绿、紫色转调与细白线保持视觉家族。
- **检索标签**：editorial-art-direction。
- **引用**：`anthropic-golden-gate-claude` · [Photo + graphic](https://azivor.github.io/reference/assets/images/93a2f8ba46713802-1440-q86.webp) · [原出处](https://www.anthropic.com/research/golden-gate-claude) · 记录日期 2024-05-23

### <a id="ref-058"></a>#058 · Evaluating and mitigating discrimination in language model decisions
- **线索**：两片蛾翼放大到近抽象；淡纸、棕色、芥黄构成博物馆陈列感。
- **检索标签**：paper-collage, botanical-and-natural。
- **引用**：`anthropic-evaluating-and-mitigating-discrimination-in-language-model-decisions` · [Photo + graphic](https://azivor.github.io/reference/assets/images/ea0415f5732bad40-1440-q86.webp) · [原出处](https://www.anthropic.com/research/evaluating-and-mitigating-discrimination-in-language-model-decisions) · 记录日期 2023-12-07

### <a id="ref-059"></a>#059 · Claude's constitution
- **线索**：反射实体与随意手绘跨暖珊瑚纸；格线与颗粒调和实物和符号。
- **检索标签**：paper-collage, grain-and-print, archival-and-editorial, material-tactility。
- **引用**：`anthropic-claudes-constitution` · [Photo + graphic](https://azivor.github.io/reference/assets/images/1d9e60fb61110299-1440-q86.webp) · [原出处](https://www.anthropic.com/news/claudes-constitution) · 记录日期 2023-05-09

### <a id="ref-060"></a>#060 · Anthropic's core views on AI safety
- **线索**：绘画天空被直角平色块切断；软云与硬几何双重秩序。
- **检索标签**：grid-and-drafting, botanical-and-natural, optical-horizon。
- **引用**：`anthropic-core-views-on-ai-safety` · [Photo + graphic](https://azivor.github.io/reference/assets/images/3ed7c74dde33ff9b-1440-q86.webp) · [原出处](https://www.anthropic.com/news/core-views-on-ai-safety) · 记录日期 2023-03-08
