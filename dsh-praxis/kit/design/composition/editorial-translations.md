---
id: ASA-G-EDITORIAL-TRANSLATIONS
status: reference
reference_priority: normal
---

# 编辑传统的媒介转译 · 数量、阅读顺序与文字规则

页面以重复图像表达数量，或用日文纵排、注音组织阅读时，可参考以下关系。它们来自各自的历史与语言语境；软件转译是本 Kit 的设计推论，需按实际内容和媒介取用。

<a id="asa-g-isotype-quantity"></a>

## ASA-G-ISOTYPE-QUANTITY · Isotype · 以重复稳定符号表达可计数的数量

### 起源与范围

维也纳大学研究将 Isotype 追溯至 Vienna Method of Pictorial Statistics，并记录团体迁居和后续发展。归属涉及 Marie Neurath、符号设计者 Gerd Arntz，以及编辑、研究人员、艺术家和“transformers”等协作角色。“International”表达的是愿望；“words divide — pictures unite”也不能证明图像天然普世，RIT Cary 展览指出这句口号可能贬低文字、高估图像。

**来源卡：**[ASA-E-01](../../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-01-isotype-documents.md) · [ASA-E-02](../../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-02-isotype-research.md) · [ASA-E-03](../../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-03-rit-isotype-exhibit.md) · [ASA-E-04](../../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-04-marie-neurath-process.md) · [ASA-E-05](../../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-05-isotype-collection.md)

### 传达意图与可操作关系

在部分比较图表中，Isotype 保持符号大小稳定，以重复次数表达数量。明确计数单位（如“每个符号代表 10 人”），类别确有差异时才换符号，并同时给出标签、图例、来源、分母和不确定性。图形负责比较，文字补足数据背景。

Sue Walker 对 Marie Neurath 儿童读物的研究记录了团队协作的研究、transforming、草图、写作、跨页编排、排字与审阅，也提到用 miniature books 规划跨页。这是该团队的历史工作方式，可供编辑项目参考。

### 软件转译与失效方式

1. **语义化 HTML 加行内 SVG。** 将数值、单位、类别、时期和标签保存在结构化数据中；用共享符号绘制重复标记，并以图例、表格或句子提供精确数值。检查缺失符号回退、极大计数、屏幕阅读器输出和窄屏布局。
2. **数据驱动的 SVG 或印刷输出。** 从同一数据生成海报、报告跨页或 PDF，并提供文本等价内容。翻译、数值修订、字体替代和缩小尺寸都可能破坏固定布局；保留源数据并重新生成，避免手工复制后失去对应关系。

只有比较任务确实依赖计数时，才用重复次数编码数量；同时改变符号大小会形成两个竞争的数量通道。大数值可能变成纹理，分组或汇总时要标明汇总值，并允许查看底层计数。

### 构造性夹具与反例

夹具：比较三家虚构诊所的月就诊量，以同一符号重复表示数量，图例注明“每个符号 = 10 次就诊”，数值分别为 20、40、70。文字中保留精确数字、相同单位和时期，诊所名称也使用文字。这个例子能检验符号与数值的对应关系，不借用历史图形。

反例：用一个人形符号表示不同人口，有些组悄悄把符号放大，删除图例，再期待读者凭文化经验认出符号含义。这样改变了编码方式，读者也无法还原准确数量。

### 范例身份与证据边界

RIT 展览列出 *Modern Man in the Making* (1939) 第 73 页 “Annual Iron Production and Immigration” 和 *Gesellschaft und Wirtschaft* (1930) 第 81 版 “Viennese Social Structure in 1700 and the Present”；它们是范例身份，不是本文查看过的图版。University of Reading 的馆藏含图表、书籍、草图、校样和印版；馆藏身份本身不证明单张图表的数据准确。

<a id="asa-g-japanese-composition"></a>

## ASA-G-JAPANESE-COMPOSITION · 日文纵排 · 保留页面中的阅读关系

### 起源与范围

W3C 的 Requirements for Japanese Text Layout（JLReq）由 Japanese Layout Task Force 编写，主要参考 JIS X 4051，也涉及其他版面设计问题。文档说明其目的是描述排版需求和问题，而不是直接给出完整实现。日文出版物既可以横排，也可以纵排；同一页上也可能混用两种方向。不要推断所有日文都采用纵排，也不要把页面阅读顺序简化成通用的“从右到左”风格。

**来源卡：**[ASA-E-06](../../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-06-jlreq.md) · [ASA-E-07](../../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-07-css-writing-modes.md) · [ASA-E-08](../../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-08-css-ruby.md) · [ASA-E-09](../../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-09-ndl-newspaper-survey.md) · [ASA-E-10](../../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-10-jlreq-source-index.md) · [ASA-E-11](../../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-11-jlreq-vertical-comma-figure.md) · [ASA-E-12](../../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-12-jlreq-horizontal-mixed-script-figure.md)

### 传达意图与可操作关系

将排版视为一组互相关联的约束：行内和块级流向、字形方向、标点位置、禁止出现在行首或行尾的字符、ruby 注记关联、标题、版面边饰，以及跨页顺序。纵排正文行内由上至下，列从右向左推进；标题、数字、拉丁字串、注释和表格可有局部规则。Ruby 注记与正文字符有发音或释义关系，换行时须保留。它服务于特定阅读方式，不是通用装饰。

### 软件转译与失效方式

1. **HTML、CSS 书写模式与 ruby。** 标明语言和书写系统；按需使用 `writing-mode: vertical-rl`、`text-orientation`、`line-break` 和语义化 `<ruby>` / `<rt>`。保留 DOM 阅读顺序并处理横排片段。重点检查标点、拉丁名称、数字、ruby 宽度、缩放、浏览器和辅助技术；CSS 属性本身不保证完整实现 JLReq。
2. **XSL-FO 或专用印刷排版。** 适合需要控制页序、书眉、注释、ruby 和插图位置的出版物。用短夹具检查 PDF；字体替代会改变字面度量，栅格化会妨碍重排或检索，手工坐标也会在文案更新时失效。
3. **SVG 固定图示。** 适合空间关系关键的短样张；同时提供逻辑顺序的文本。长篇文字逐字定位会损害选择、无障碍、字体回退和响应式顺序。

### 构造性夹具与反例

夹具：编写两列短通知，包含日文句点和括号、拉丁产品名、两位数字及一处 ruby；记录行首/行尾禁则、列与页面顺序和正文。将同一夹具放入浏览器与 PDF 渲染器检查。

反例：把横排文字旋转九十度并逐字绝对定位，再用假名图片代替 ruby 关联。它失去文本流、断行、语义和可靠缩放。

### 范例身份与证据边界

已查看两张 JLReq 图示：144 × 360 的 `img2_11.png` 对比纵排汉数字与读点间距；480 × 172 的 `img2_1.png` 展示五行日文标点，但没有实际西文字母或数字，不能验证西文混排。它们只说明特定排版选择。图示说明与身份见 [ASA-E-11](../../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-11-jlreq-vertical-comma-figure.md) 和 [ASA-E-12](../../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-12-jlreq-horizontal-mixed-script-figure.md)。

National Diet Library 记录了 *新聞総覧 大正2年版*（*Shinbun Sōran*, Taishō 2 edition），编者和出版者均为 Japan Telegraphic News Agency。可将其作为后续检查对象；当前未查看页面图像，不描述其版面。见 [ASA-E-09](../../../../vault/provenance/art-software-atlas/editorial/cards/asa-e-09-ndl-newspaper-survey.md)。

### 验证边界

JLReq 描述排版需求，CSS Writing Modes 与 CSS Ruby 的规范状态不同；本文没有验证跨引擎互通性或具体字体组合。来源范围和阅读记录见[编辑研究目录](../../../../vault/provenance/art-software-atlas/editorial/README.md)。
