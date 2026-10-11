---
id: ASA-G-EDITORIAL-TRANSLATIONS
status: reference
reference_priority: normal
---

# 编辑传统的媒介转译 · 数量、阅读顺序与文字规则

当页面需要用重复图像表达数量，或依赖日文纵排、注音来组织阅读时，可参考下面两项范围明确的研究。每种传统都来自具体历史语境；这里的转译是本 Kit 的设计推论，不代表文化等价，也不是放诸四海的默认风格。请按任务挑选有用的关系，再依据实际数据、语言、受众、媒介和渲染器验证。

<a id="asa-g-isotype-quantity"></a>

## ASA-G-ISOTYPE-QUANTITY · Isotype · 以重复稳定符号表达可计数的数量

### 起源与范围

维也纳大学的研究项目将“Isotype”的历史追溯至较早的“Vienna Method of Pictorial Statistics”，并说明团体迁居及后续发展的多条脉络。归属说明应包括 Marie Neurath、符号设计者 Gerd Arntz，以及编辑、研究人员、艺术家和“transformers”等协作角色。“International”这一名称所表达的愿望，以及后来流传的“words divide — pictures unite”口号，都不能证明符号天然普世。RIT Cary 展览也提醒，这句口号可能不公平地贬低文字、高估图像。

**来源卡：**[ASA-E-01](../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-01-isotype-documents.md) · [ASA-E-02](../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-02-isotype-research.md) · [ASA-E-03](../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-03-rit-isotype-exhibit.md) · [ASA-E-04](../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-04-marie-neurath-process.md) · [ASA-E-05](../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-05-isotype-collection.md)

### 传达意图与可操作关系

在部分比较图表中，历史方法保持图形符号稳定，通过重复符号表达数量，而不是放大单个符号。要明确计数单位：一个人形符号可以代表指定人数、时期或人口。只有类别确实不同时才使用不同符号，并保留标签、图例、来源、分母及相关不确定性。读者应能计数或比较符号，并据此还原符号所代表的意思；单靠图形不能承载数据背景。

这只是更广泛编辑实践中的一种操作。Sue Walker 对 Marie Neurath 儿童读物的研究描述了团队如何共同进行资料研究、transforming、绘制草图、写作、编排跨页、排字、审阅，并迭代文字与图像；文中也提到用 miniature books 规划跨页顺序。这说明的是该团队的历史工作方式，并非今天项目必须遵循的流程。

### 软件转译与失效方式

1. **语义化 HTML 加行内 SVG 符号。** 将数值、单位、类别、时期与标签保存在结构化数据中；用同一份 SVG 符号定义的 `<use>` 绘制每个标记，并在旁边提供文字图例和表格或句子，显示精确数值。这样保留可选择的文本，也支持响应式重排。渲染器静默替换缺失符号、过大数值生成数百个 DOM 节点，或读屏器只收到一组重复装饰图形，都可能破坏结果。应检查计数是否准确、键盘和辅助技术输出、窄屏表现及极小数值；不要只从图标外观推断数据。
2. **数据驱动的 SVG 或矢量印刷输出。** 用同一份底层记录生成海报、报告跨页或可交付印刷的 PDF 固定版面；符号保持清晰，映射也能对照源数据核查。固定输出便于精确对齐，但遇到翻译、数值修订、字体替代和小尺寸显示时容易失效。应提供文本等价内容、保留源数据，并在每次输出前重新计算；不要在未追踪的绘图文件中手工复制符号。

在两种方案中，只有当比较任务确实依赖计数时，才仅用重复次数编码数量。人形符号重复出现时又改变大小，会造成两个互相竞争的数量通道。数值很大时，重复图形可能变成纹理；若分组或汇总，必须标出汇总值，并提供查看底层计数的方式。这些是由方法推导出的实现注意事项，不是对 Isotype 历史软件实践的陈述。

### 构造性夹具与反例

夹具：比较三家虚构诊所的月就诊量，以同一符号重复表示数量，图例注明“每个符号 = 10 次就诊”，数值分别为 20、40、70。文字中保留精确数字、相同单位和时期，诊所名称也使用文字。这个例子能检验符号与数值的对应关系，不借用历史图形。

反例：用一个人形符号表示不同人口，有些组悄悄把符号放大，删除图例，再期待读者凭文化经验认出符号含义。这样改变了编码方式，读者也无法还原准确数量。

### 范例身份与证据边界

RIT 展览标出了 *Modern Man in the Making* (1939) 第 73 页 “Annual Iron Production and Immigration”，以及 *Gesellschaft und Wirtschaft* (1930) 第 81 版 “Viennese Social Structure in 1700 and the Present”。这些是可进一步核查的具体范例身份，不是本条目的视觉证据：当时无法查看展览嵌入的图片。直接查看图版前，不要断言其具体版式或视觉细节。University of Reading 的馆藏介绍确认该馆藏包含图表、书籍、工作草图、校样、印版等材料；但作品属于该馆藏，并不能单独证明某一张图表的数据准确。

<a id="asa-g-japanese-composition"></a>

## ASA-G-JAPANESE-COMPOSITION · 日文纵排 · 保留页面中的阅读关系

### 起源与范围

W3C 的 Requirements for Japanese Text Layout（JLReq）由 Japanese Layout Task Force 编写，主要参考 JIS X 4051，也涉及其他版面设计问题。文档说明其目的是描述排版需求和问题，而不是直接给出完整实现。日文出版物既可以横排，也可以纵排；同一页上也可能混用两种方向。不要推断所有日文都采用纵排，也不要把页面阅读顺序简化成通用的“从右到左”风格。

**来源卡：**[ASA-E-06](../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-06-jlreq.md) · [ASA-E-07](../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-07-css-writing-modes.md) · [ASA-E-08](../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-08-css-ruby.md) · [ASA-E-09](../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-09-ndl-newspaper-survey.md) · [ASA-E-10](../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-10-jlreq-source-index.md) · [ASA-E-11](../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-11-jlreq-vertical-comma-figure.md) · [ASA-E-12](../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-12-jlreq-horizontal-mixed-script-figure.md)

### 传达意图与可操作关系

将排版视为一组互相关联的约束：行内和块级流向、字形方向、标点位置、禁止出现在行首或行尾的字符、ruby 注记关联、标题、版面边饰，以及跨页顺序。纵排正文的行内顺序是由上至下，列的推进方向是从右到左；标题、数字、拉丁字串、注释或表格可能遵循不同的局部规则。Ruby 注记与正文字符之间存在发音或释义关系；换行时应保留这种关联。这些做法服务于特定阅读方式，不应当作装饰套用在任意文案上。

### 软件转译与失效方式

1. **语义化 HTML、CSS 书写模式与 ruby。** 在有意义的边界标明语言和书写系统；按任务选择 `writing-mode: vertical-rl`，用 `text-orientation` 控制字形方向，用合适的 `line-break` 行为，并以语义化 `<ruby>` / `<rt>` 标记注音。保持有意义的 DOM 阅读顺序，有意处理横排混合片段。检查标点、较长拉丁名称、数字、宽于正文的 ruby、缩放，以及浏览器和辅助技术行为。单独设置 CSS 属性并不能保证完整实现 JLReq；断行支持不全或不一致、字体回退导致字面度量变化，或 DOM 顺序错误，都可能让页面表面看似合理、实际阅读却出错。
2. **通过 XSL-FO 或专用印刷排版流程进行分页编排。** 当出版物需要控制页面尺寸、页序、书眉、注释、ruby 与插图位置时，可采用此类流程。JLReq 将 XSL-FO、SVG、CSS 和电子书技术列为相关实现环境。应以短小的需求夹具核对导出的 PDF，并在目标引擎和字体组合上比较输出。失败方式包括字形替代或字体回退改变字面度量、文字被栅格化后无法重排或检索，以及文案变更时手工页面坐标失效。
3. **用 SVG 制作固定图示或短样张。** 当空间关系非常重要时，可在固定画布中定位少量文字和视觉注释。应同时提供逻辑顺序的文本稿；长篇文字不要把每个字手工定位，否则文字选择、无障碍、字体回退和响应式阅读顺序都会迅速变差。

### 构造性夹具与反例

夹具：编写一则虚构短通知，使用两列文字，包含日文句点和括号、拉丁产品名、两位数字，以及一段正文加 ruby 的文字。另行记录预期的行首/行尾禁则、列与页面的阅读顺序、以及文本内容。将同一夹具分别放入一个浏览器视图和一个打印/PDF 渲染器，按排版需求核查，不要用“看起来像日文”的质感代替检查。

反例：把整段横排文字旋转九十度，每个字符各放进绝对定位框，再用假名图片代替汉字上方的 ruby 关联。它可能在某一个尺寸上保留轮廓，却失去正常文本流、断行行为、语义与可靠缩放。

### 范例身份与证据边界

已直接查看两张 JLReq 图示。144 × 360 的 `img2_11.png` 对比纵排汉数字与读点的处理：左侧读点后有可见空隙；右侧下一个数字更紧密地排列，与源码所说的“solid”处理相符。480 × 172 的 `img2_1.png` 展示五行日文和逗号、句点；句子提到罗马字与数字，但没有实际西文字母或数字样本，不能用它验证西文混排。这两张图只展示特定排版选择，不是完整页面，也不代表普遍风格。原始 HTML 源码将两张图的身份与其说明和 caption 对应起来。

National Diet Library 的馆藏记录另标出了 *新聞総覧 大正2年版*（*Shinbun Sōran*, Taishō 2 edition），编者与出版者均为 Japan Telegraphic News Agency。该书是可供后续检查的印刷对象；当前检查路径无法打开其页面图像，因此本文不描述它的可见版面结构。

### 验证边界

来源卡分别记录了已阅读的文字和无法查看的图像。CSS Writing Modes 与 CSS Ruby 的规范状态并不相同；JLReq 是排版需求文档。这些来源都没有证明当前跨引擎互通性，也没有测试具体字体组合。声称实现支持前，需另行验证。来源身份、阅读位置和访问限制见[编辑研究目录](../../../vault/provenance/art-software-atlas/editorial/README.md)。
