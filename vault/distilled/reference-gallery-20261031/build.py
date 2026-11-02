#!/usr/bin/env python3
"""Build independent searchable distill from a pinned public Azivor/reference snapshot."""
from pathlib import Path
from collections import Counter
from datetime import date
import csv, json, re, zipfile

D=Path(__file__).parent
prefix={'A':'https://www.anthropic.com/','O':'https://openai.com/','Y':'https://www.youtube.com/','B':'https://oaaa.org/','N':'https://www.brandnewschool.com/','D':'https://studiodumbar.com/','S':'https://live.standards.site/','X':'https://x.ai/','T':'https://x.com/'}
companies={'A':('anthropic','Anthropic','01-anthropic.md'), 'P':('perplexity','Perplexity','02-perplexity.md'), 'O':('openai','OpenAI','03-openai.md'), 'G':('grok','Grok / xAI','04-grok-xai.md')}
types={'P':'Photo + graphic','C':'Cinematic','W':'Website / editorial','M':'3D / material'}
cues={int(x.split('|',1)[0]):x.split('|',1)[1].strip() for x in (D/'cues.compact.txt').read_text().splitlines() if x.strip()}
records=[]
for row in (D/'catalog.compact.txt').read_text().splitlines():
    no,c,id_,title,dt,tp,u,img=row.split('|')
    pu,rest=u.split(':',1)
    company,brand,chap=companies[c]
    cue=cues[int(no)]
    tags=[]
    TAG_RULES={
      'paper-collage':r'纸|档案|拼贴|撕|标本|账本|折纸|印刷|胶片|纸张|拼接',
      'grid-and-drafting':r'格纸|网格|方格|技术|仪表|标尺|绘图|测绘|图解|几何|制图|数码',
      'grain-and-print':r'颗粒|网点|纹理|青晒|旧|纸纹|半色调|印相|印刷|磨损|细纹',
      'physical-metaphor':r'钥匙|天平|扳手|磁铁|扣件|罗盘|锁|剪刀|面包|工具|物件',
      'botanical-and-natural':r'植物|蝴蝶|菌褶|花|牡丹|蝶|银杏|岩|草地|树|云|鸟|蛾翼|自然|菌',
      'archival-and-editorial':r'档案|目录|杂志|凭票|记录|手稿|科研|历史|旧|封面|海报|摄影书|报纸|实体',
      'optical-horizon':r'地平线|天际|轨道|行星|蓝大气|弧线|星球|太空|光弧|星空|天空',
      'dramatic-light':r'辉光|掠射|亮|渐变|光|暗|聚焦|照亮|发光|虚焦|影子',
      'large-type':r'标题|衬线|字标|大字|字体|文字|字标|白字|排版|短句',
      'human-scale':r'人像|手部|小人物|人物|通勤|手作|活动|工作|现实尺度|人文',
      'material-tactility':r'黄铜|金属|材质|毛绒|立体|纸面|物理|反射|触感|照片|网点|掠射',
      'negative-space':r'空白|留白|空域|空场|黑场|暗部空间|纯黑|深暗|简洁|静物',
      'diagrams-and-lines':r'线条|细线|墨线|绘线|环线|曲线|箭头|径向|科学线描|轨迹|网络',
    }
    for tag,pat in TAG_RULES.items():
        if re.search(pat,cue):tags.append(tag)
    if not tags:tags=['editorial-art-direction']
    records.append({'index':int(no),'id':id_,'company':company,'brand':brand,'chapter':chap,
        'title':title,'date_recorded':dt or None,'visual_type':types[tp],
        'source_url':prefix[pu]+rest,
        'gallery_image_url':'https://azivor.github.io/reference/assets/images/'+img,
        'cue_zh':cue,'tags':tags,'evidence_basis':'source-record-and-curator-note','image_manually_verified':False})
assert len(records)==len(cues)==90
assert len({r['id'] for r in records})==90
assert Counter(r['company'] for r in records)==Counter({'anthropic':60,'perplexity':12,'openai':11,'grok':7})

# Machine readable
with (D/'catalog.csv').open('w',newline='',encoding='utf-8-sig') as f:
    fields=['index','id','company','brand','chapter','title','date_recorded','visual_type','source_url','gallery_image_url','cue_zh','tags','evidence_basis','image_manually_verified']
    wr=csv.DictWriter(f,fieldnames=fields);wr.writeheader()
    for r in records:wr.writerow({**r,'tags':';'.join(r['tags'])})
(D/'catalog.jsonl').write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in records),encoding='utf-8')

snap='2026-10-31'; commit='2cc52b3a4b6d4723a984d39f2094030547733322'; srcblob='ddf48f02932b351dae3d3f73f766266dea6b6d57'

chapters={
'anthropic':{
'core':'**编辑拼贴作为品牌视觉主语法**。多数样本并不使用现代 SaaS 界面组件，而将纸面、照片、制图与物理对象编排成具有科学/人文张力的研究封面；少数发布视觉转向大面积暗场与光学地平线。',
'observations':[
'**结构**：双栏与三栏异质拼接、不等宽接缝、矩形开窗、圆形掩模。用于制造阅读顺序，但不等同于产品栅格。',
'**介质**：方格纸、账本、半色调、青晒图、撕纸、档案照片、黄铜器物。不同材质通过共同颗粒度和有限配色关联。',
'**语义**：通过一件可辨识实体（钥匙、天平、扳手、剪刀、仪器）给抽象研究主题建立物理隐喻；物件是封面元素，不应被误当作可交互控件。',
'**色彩**：米白、桃粉、黄、绿、深蓝常作为大面积纸面；蓝、红或珊瑚色以少量高色度标记承担视线锚点。这里是观察，不是官方色值。',
'**例外分支**：黑底细网络（#014）、暗场菌褶（#015）、大气地平线（#023）、舷窗地球（#041）、发布页（#006），共同指向以光和空间表达能力。',
],
'clusters':[
('纸面拼贴与研究档案','001,002,003,008,009,010,017,018,033,043,050'),
('图解、符号与物理隐喻','007,012,019,026,034,035,037,042,046,047,051'),
('植物、标本、青晒与复现','016,024,028,030,031,032,040,054,058'),
('电影光学与发布视觉','006,014,015,023,041'),
('结构性对照与视觉节奏','004,005,011,013,020,025,038,045,055,056,057,060'),
],
'fit':'研究报告封面、专题导览、证据包入口、重度信息页的章首识别区。为业务 Control Plane 的「复杂信息有序陈列」提供视觉文化参照。',
'avoid':'不要把仿旧纸纹、半色调或拼贴用于合同正文、重要参数、表格背景、错误提示、图谱节点等高密度/高精度对象；不要把科研照片拼贴误认为证据。',
},
'perplexity':{
'core':'**一套好奇心主题的跨载体编辑系统**。天体、日轮、山景、小人物、建筑、几何星座与醒目的衬线排版，在海报、街墙、实物和产品展示之间保持可识别家族关系。',
'observations':[
'**尺度对照**：微小人物、辽阔风景、巨型天体或门廊，先传达探索范围，再表达具体产品功能。',
'**排版**：具性格的高对比衬线/压缩字型与大字标，位置可随纵横版式调节；并非每张海报强制固定版式。',
'**色彩与质地**：青绿、钴蓝、金橘、纸白和复古细颗粒；几何细线与自然影像维持同一语调。',
'**跨载体一致性**：海报、购物袋、装裱画面、街墙图案、设备照片能共用语言；适合学习品牌系统怎样变形而非逐像素复制。',
],
'clusters':[
('天体、门户与远景','061,062,063,064,065,066'),
('跨媒介设计系统','067,068,070,071,072'),
('产品发布的科幻编辑语言','069'),
],
'fit':'项目首页、服务探索入口、研究专题首页、品牌活动宣传或 SaaS 模块介绍页；可借鉴「一套视觉语法跨多种容器」的机制。',
'avoid':'不要将巨幅插画、天体和大衬线移植到合同逐条审阅、Playbook 规则维护、Service Intake 表单与 Agent trace；这些需要成熟的信息架构和可见状态。',
},
'openai':{
'core':'**以可理解的人类情境和产品行为承载品牌**。同一集合同时有自然摄影、手作工作台、公共广告、学生问题、电影发布及软材质角色；共性是保留单一主要叙事焦点和大量呼吸空间。',
'observations':[
'**人类场景**：车库、工作台、室内活动、建筑橱窗，用现实框景讲述产品效果，而不是在素材上堆叠 UI 概念。',
'**标题与留白**：大而明确的短句、清晰白边、有限文字，把可读性置于装饰之上；视觉主角往往不需要复杂叠字。',
'**系统适配**：同一种摄影活动可用于横向城市广告和竖向窗面；学生海报用一致的手绘物件穿过多张纸面。',
'**差异化媒介**：大气地球（#073）是电影发布语法；毛绒材质角色（#079）是角色/品牌表达，不是一般化的 Chat UI 模式。',
],
'clusters':[
('自然影像与品牌身份','074,080'),
('现实情境的产品广告','075,076,077,081'),
('实用问题与插画海报','082,083'),
('电影发布与角色材质','073,078,079'),
],
'fit':'Fresh Agent UI 的空状态、首页欢迎区、模块导览、服务引导中可学习其内容优先/低噪声/场景化表达；产品演示视频亦可借鉴真实行动的镜头结构。',
'avoid':'不能凭营销摄影推断 OpenAI 的产品组件规范、路由机制或可用性实践；也不应套用其商标、标志或独特角色形象。',
},
'grok':{
'core':'**黑场中的光学深度和极少文字**。弧光、行星边缘、紫红波面、微粒流与暖色核心形成持续的发布视觉语系；7 张中有 5 张是 Cinematic。',
'observations':[
'**构图**：大面积蓝黑/纯黑负空间，唯一弧线或流束引导视线，中心或侧边小字形成层级。',
'**光学材质**：蓝白大气辉光、橙红边缘发光、紫品红柔焦、粒子焦点；主要用亮度与渐变产生纵深，并不依赖玻璃组件。',
'**注意力收敛**：一张图只允许一个强能量中心或主弧线；多个互不相干光效叠加会使其失去质感。',
'**例外**：太空摄影书（#086）是模型内容展示的编辑包装，不是企业品牌规范。',
],
'clusters':[
('行星边缘与弧形地平线','084,085,088,089'),
('柔焦紫光与粒子流','087,090'),
('物理化编辑展示','086'),
],
'fit':'深色主题 Hero、演示进入画面、产品发布过渡、极少数据的状态总览封面。',
'avoid':'不要让强渐变、粒子和 Glow 覆盖数据、合同内容、错误级别标识、表单或节点边线；明暗层级需按可访问性验证。',
}}

# Chapter markdown with complete list, internal section anchors and deep links
for code,(_,brand,filename) in companies.items():
  cmp=companies[code][0]
  v=chapters[cmp]
  items=[r for r in records if r['company']==cmp]
  lines=[f'# {brand}｜视觉章节 Distill', '', f'> 版本：{snap} · 收录 {len(items)} 条 · 来源：Azivor/reference · 分析级别：原库条目说明与作者设计观察的二次提炼，非逐张像素审查。', '', '## 章节主旨', '',v['core'],'','## 可迁移的视觉语法','']
  lines += ['- '+s for s in v['observations']]
  lines += ['','## 簇级检索','']
  for heading,ids in v['clusters']:
    nums=[int(s) for s in ids.split(',')]
    links=', '.join(f'[`#{k:03d}`](#ref-{k:03d})' for k in nums)
    lines += [f'- **{heading}**：{links}']
  lines += ['','## Fresh Agent UI 适用范围','',v['fit'],'','## 不应迁移的部分','',v['avoid'],'','## 全量逐条索引','', '以下每条均提供稳定 ID、压缩视觉线索、原出处与画廊图片入口。原始素材不打包；必要时通过链接查看。','']
  for r in items:
    n=r['index']; lines += [f'### <a id="ref-{n:03d}"></a>#{n:03d} · {r["title"]}',
      f'- **线索**：{r["cue_zh"]}。',
      f'- **检索标签**：{", ".join(r["tags"])}。',
      f'- **引用**：`{r["id"]}` · [{r["visual_type"]}]({r["gallery_image_url"]}) · [原出处]({r["source_url"]})'+(f' · 记录日期 {r["date_recorded"]}' if r['date_recorded'] else ' · 日期未记录'), '']
  (D/filename).write_text('\n'.join(lines),encoding='utf-8')

# All-record index: navigation is first, references inside chapters
lines=['# INDEX · Reference Visual Library','',
'**目的**：用结构化目录与压缩视觉笔记定位外部作品，后续按需取用原图与具体出处，无须再次遍历整个站点。',
'',f'**快照**：{snap} · 90 条 · 来源仓库 commit tree `{commit}` · 原始记录 blob `{srcblob}`。',
'', '## 按章节', '', '| 章节 | 条目 | 核心语言 |', '|---|---:|---|',
'| [01 Anthropic](01-anthropic.md) | 60 | 科研编辑拼贴、纸面/物理隐喻、对照与局部电影画面 |',
'| [02 Perplexity](02-perplexity.md) | 12 | 探索叙事、天体远景、衬线字、跨载体视觉家族 |',
'| [03 OpenAI](03-openai.md) | 11 | 人类场景、直白信息、留白、产品叙事及软材质 |',
'| [04 Grok / xAI](04-grok-xai.md) | 7 | 暗场光学、弧线地平线、柔焦、粒子与克制白字 |',
'', '## 横向专题', '',
'- [05 Image Treatment：类型与交叉分析](05-image-treatment.md)',
'- [06 Grammar Crosswalk：视觉语法与组件边界](06-grammar-crosswalk.md)',
'- [07 Fresh Agent UI：适用场景与收敛规则](07-fresh-ui-application.md)',
'- [08 Retrieval Protocol：按需展开与增量维护](08-retrieval-protocol.md)',
'', '## 数据结构', '',
'- [`catalog.jsonl`](catalog.jsonl)：90 条完整检索记录（每行一个对象）。',
'- [`catalog.csv`](catalog.csv)：可按品牌、日期、类型、标签、视觉线索筛选。',
'- [`manifest.json`](manifest.json)：章节/类型统计与来源快照信息。',
'', '## 按类型快速检索', '', '| 原站类型 | 条目数 | 用途 |', '|---|---:|---|']
for tp in types.values():
 lines.append(f'| {tp} | {sum(r["visual_type"]==tp for r in records)} | '+({'Photo + graphic':'编辑拼贴、海报、构图与图文关系','Cinematic':'暗场、光学空间、发布 Hero','Website / editorial':'发布页层级与目录结构','3D / material':'角色、材质、棚拍光线'}[tp])+' |')
lines+=['','## 90 条定位表','','下列只给出短线索；完整检索标签、出处和图片入口位于对应章节或 `catalog.jsonl`。','', '| # | 公司 | 标题 / 章内定位 | 视觉类型 | 最小视觉线索 |','|---:|---|---|---|---|']
for r in records:
  s=r['cue_zh']
  if len(s)>41:s=s[:40]+'…'
  lines.append(f'| {r["index"]:03d} | {r["brand"]} | [{r["title"]}]({r["chapter"]}#ref-{r["index"]:03d}) | {r["visual_type"]} | {s} |')
(D/'INDEX.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')

# horizontal category
lines=['# Image Treatment｜跨品牌图像处理与视觉类型','',
'这是原站 **Filter** 里的类型维度，不是第五个已经独立填充的品牌集合。当前只有四种有内容的类型；原站 UI 可能列出但不含条目的 Photography。',
'', '| 类型 | 数量 | 品牌分布 |', '|---|---:|---|']
for tp in types.values():
 d=Counter(r['brand'] for r in records if r['visual_type']==tp)
 lines.append('| '+tp+' | '+str(sum(d.values()))+' | '+', '.join(f'{k} {v}' for k,v in d.items())+' |')
lines += ['','## Photo + graphic：编辑式图文混用（78）','',
'独立照片、素描、技术图表、纸张、具体器物、颗粒及打印痕迹被拼成一个视觉叙述。高频但不意味着每个软件界面都应使用拼贴。',
'**展开样本**：[#001](01-anthropic.md#ref-001) 混合摄影、[#030](01-anthropic.md#ref-030) 青晒复现、[#072](02-perplexity.md#ref-072) 海报体系、[#082](03-openai.md#ref-082) 插画海报。',
'', '## Cinematic：以灯光及空间统领（10）','',
'用少量主体与受控光晕、地平线、光学虚焦建立戏剧性。此类中 Grok 占 5、Anthropic 占 3、Perplexity 占 1、OpenAI 占 1。',
'**展开样本**：[#015](01-anthropic.md#ref-015) 菌褶掠光、[#023](01-anthropic.md#ref-023) 大气地平线、[#065](02-perplexity.md#ref-065) 山景、[#084](04-grok-xai.md#ref-084) 轨道弧光、[#090](04-grok-xai.md#ref-090) 流动粒子。',
'', '## Website / editorial：页面与编辑层级（1）','',
'[#006](01-anthropic.md#ref-006) 涉及大衬线标题、摄影主体、内容目录与层级；可以研究页面节奏，但它是 **品牌发布页面**，不是 SaaS 任务处理流程的标准答案。',
'', '## 3D / material：三维材质及角色（1）','',
'[#079](03-openai.md#ref-079) 毛绒触感、实体角色与暗场棚拍。与 UI 中玻璃、模糊、半透明是不同范畴，不能混淆。',
'', '## 反向检索', '',
'- 想研究 **网格 / blueprints / graph paper**：优先 Anthropic #003, #008, #018, #031, #046；Perplexity #072。',
'- 想研究 **颗粒 / paper / halftone / cyanotype**：Anthropic #002, #030, #031, #040；Perplexity #061, #065。',
'- 想研究 **blur / rim light / particles**：Anthropic #023；OpenAI #073；Grok #084, #087–#090。',
'- 想研究 **type / editorial / whitespace**：Anthropic #006；Perplexity #064, #066, #072；OpenAI #074, #080, #082, #083。',
'- 想研究 **material / object metaphor**：Anthropic #007, #026, #036, #037；OpenAI #079。',
'']
(D/'05-image-treatment.md').write_text('\n'.join(lines),encoding='utf-8')

# grammar crosswalk
lines=['# Grammar Crosswalk｜从视觉参考到可检验的语法','',
'此处是**观察归纳**而非品牌设计规范。采用「视觉原理 → 例证 → 控件边界 → 检验条件」的方式，避免从一张海报直接生成整个前端组件。',
'', '| 语法 | 来源（条目） | 合理容器 | 约束 / 禁止 |', '|---|---|---|---|',
'| 画面分区与强弱尺度 | A #003 #009 #010；P #066 | 报告封面、专题导览 | 不取代实际信息栅格与响应式布局 |',
'| 纸面 / 档案材质 | A #002 #013 #033 #050 | 研究背景、章节封面 | 不置于合同正文、表格数据下 |',
'| 物理隐喻锚点 | A #007 #026 #037 #047 | 内容插画、特定研究封面 | 不伪装为操作按钮或合法性证据 |',
'| 技术制图与细线 | A #008 #018 #040；P #063 | 抽象研究配图、品牌纹饰 | 真实股权/供应链图必须另循图谱语义规范 |',
'| 有限强调色 | A #029 #042；O #074 | 标记、关键交互、图例 | 品牌皮肤不能改变风险等级的语义色 |',
'| 天体与尺度隐喻 | P #061 #064 #065 | 品牌专题页、全屏欢迎页 | 禁用在任务型表单和合同差异审阅 |',
'| 局部主光与暗场 | A #015 #023；G #084 #089 | 发布 Hero、演示开场 | 发光不可吞噬文字与控件状态 |',
'| 光流和微粒 | G #087 #090 | 少量高价值场景动效 | 避免持续运动与过度 GPU 开销 |',
'| 情境化真实摄影 | O #075 #076 #081 | 服务价值说明、视频内容 | 与数据事实、操作演示区分 |',
'| 排版 + 留白 | A #006；P #072；O #080 #083 | 标题层级、空状态、卡片间距 | 保留键盘导航、焦点与操作密度 |',
'| 实体 / 软材质 | O #079 | 角色广告、专用空状态 | 不把拟物装饰推广为数据组件皮肤 |',
'| 不同介质的统一设计 | P #067 #068 #070 #071 | 皮肤衍生与多端品牌化 | 可复制约束系统，不复制商标或素材 |',
'', '## 语法维度（供 Agent 选取）','',
'1. **Structure**：对称/不对称、单主角/多面板、栅格/自由拼贴、边界与遮罩。',
'2. **Hierarchy**：文本层级、视线锚点、焦点数量、前中后景、负空间比例。',
'3. **Color**：大色面、细小强调色、暖冷对比、背景与文字对比。',
'4. **Material**：纸、颗粒、青晒、金属、软材质、玻璃；明确哪些是真实视觉介质、哪些是 UI 承载层。',
'5. **Light**：掠光、弧光、辉光、柔焦、反射、阴影、自然照度。',
'6. **Motion**：粒子聚散、浅位移、自然光变化；不预设每张静态图都对应动效。',
'7. **Semantic boundary**：品牌装饰、证据、业务状态、控件可访问性不得混用。',
'', '## 与玻璃、Blur、点阵的邻接关系','',
'玻璃/Blur 可以作为工具栏、抽屉或悬层的**容器属性**，颗粒/线网/粒子则是背景或内容配图的**视觉属性**。不要把二者都铺满屏幕。界面既有玻璃容器又有多层粒子时，应优先删除装饰而非继续叠加阴影和荧光。',
'', '## 最小视觉验收','',
'- 隐去品牌艺术资产，表单/编辑/审阅逻辑仍可完整使用。',
'- 明暗皮肤中正文、图例、状态、焦点符合既有无障碍阈值。',
'- 低端设备与低动效偏好下，粒子/发光不会阻断界面。',
'- 业务图表仅依据数据驱动标记；不复用艺术背景中的无语义线条表示关系。',
'']
(D/'06-grammar-crosswalk.md').write_text('\n'.join(lines),encoding='utf-8')

lines=['# Fresh Agent UI｜按产品区域配置参考而非照搬','',
'这份归纳服务于 Fresh Agent UI / Praxis 的设计参考读取；**不构成 Harvey、Legora、Lawhive 或其他法律 SaaS 的功能交互审计**。合同审阅、Playbook、Intake 的任务流仍应对齐成熟产品的实际交互共识。',
'', '| 产品区域 | 可参考视觉语言 | 优先项 | 严格禁区 |','|---|---|---|---|',
'| Landing / New 的初始空状态 | OpenAI 情境摄影、Perplexity 编辑留白 | 少信息、明确 CTA、适度背景 | 不让 Hero 抢过 Composer |',
'| 研究报告封面 | Anthropic 纸质拼贴、Grok 简洁光学 | 章节层级、出处标记、单主角 | 不用拼贴伪造证据/图表 |',
'| Deep Research 正文 | Anthropic 编辑栅格 | 标题、脚注、来源、图文节奏 | 不将纸纹放在长段正文底下 |',
'| Contract Review | OpenAI 的克制、信息优先（方法层） | 左中右区域/逐条变化/来源定位/Accept/Reject | 不引入电影光效和海报插画 |',
'| Playbook 规则管理 | 仅借鉴排版秩序 | 规则、条件、优先级、版本、差异和审阅状态 | 不以品牌视觉替代规则可解释性 |',
'| 右侧 Chrome / Card | 统一容器尺寸与焦点层级 | 玻璃仅用于可控悬层；清晰边界 | 多层 blur 叠加产生脏页 |',
'| Service Intake / Provider 进度 | OpenAI 人类情境仅作介绍页配图 | 表单错误、委托状态、来源系统 | 不把服务营销与进度状态混排 |',
'| 持股、信托、供应链图谱 | Anthropic 工程图的审美分层（仅背景灵感） | 节点类型、方向、边语义、风险图例 | 不引用装饰性曲线作真实关系线 |',
'| 高管 Control Plane | Perplexity 的秩序感、Grok 的空间主焦点 | 可追溯事实、优先级、例外预警 | 避免所有卡片都发光、模糊 |',
'| Demo 视频与产品发布 | OpenAI 手作情境 + Grok/Anthropic 单焦点电影光 | 真实操作与情境穿插 | 不把宣传样片当交互说明 |',
'', '## 推荐的三层色彩 / 视觉系统','',
'- **Layer 0 — Semantics（不可随 Skin 变化）**：风险、确认、警告、错误、禁用、选中与来源状态；先有功能语义再有审美。',
'- **Layer 1 — Product chrome（可配置）**：侧栏/Tab/Card/Composer、字体、空间、边框、低量玻璃与遮罩；深浅主题由完整 token 集控制。',
'- **Layer 2 — Brand art（限域）**：封面、首页、空状态、章节视觉；选取 editorial、cinematic、photo/material 中的一种主语法即可。',
'', '## 不应迁移的模式','',
'- 网站中的海报属于品牌传播材料；不能推断它们代表对应公司的 SaaS 组件设计规范。',
'- 已有稳定交互（合同原文—差异—处理—来源）的成熟路径，不因为想获得视觉冲击而改造。',
'- 避免叠加点阵 + 颗粒 + 斜切线 + 荧光渐变 + 毛玻璃作为「高级感」万能模板。每个装饰必须能说明所在区域的主焦点为何需要它。',
'', '## 给后续 Agent 的视觉研究工单字段','',
'`target_surface / business_semantics / candidate_reference_ids / visual_grammar / do_not_transfer / necessary_user_state / evidence_link / validation`。先挑 2–4 张源图深入对照，再做局部构件收敛。',
'']
(D/'07-fresh-ui-application.md').write_text('\n'.join(lines),encoding='utf-8')

lines=['# Retrieval Protocol｜Agent 按需展开协议','',
'## 快速读取','',
'1. 先读 [`INDEX.md`](INDEX.md) 的章节定位与处理类型，或对 `catalog.csv` 按标签 / 文字线索搜索。',
'2. 根据需求至多展开 **1–2 个章节 Distill**；不必每次把 90 条加载进上下文。',
'3. 从章节内选 **2–5 个稳定 ID**（例如 `anthropic-bloom`），先读压缩视觉线索，再打开其原始作品/原站图片。',
'4. 只有涉及颜色、字级、动效节奏、精细光影或细部位置时，才读取高分辨率图片并进行截图 / 视觉审查。',
'5. 分别记录：`observed_fact`（可验证）、`source_curator_note`（原站观察）、`distill_inference`（本包归纳）、`proposed_application`（拟用法）。',
'', '## 建议检索词 → 入口','',
'| 需求 | 优先章节 | 代表 IDs |', '|---|---|---|',
'| 法财税研究报告封面、证据感 | Anthropic | `anthropic-zero-days`, `anthropic-claude-shaped-science`, `anthropic-bloom` |',
'| 背景纸纹、绘图、档案 | Anthropic | `anthropic-persona-selection-model`, `anthropic-enabling-independent-research` |',
'| 统一 Skin 品牌视觉 | Perplexity / OpenAI | `perplexity-poster-system-board`, `openai-brand-photographic-system` |',
'| 感官性 Hero、空间光影 | Grok / Anthropic | `grok-launch-4`, `anthropic-opus-5-5-atmospheric-horizon` |',
'| 多端与线下延展 | Perplexity / OpenAI | `perplexity-street-campaign`, `openai-with-chatgpt-window` |',
'| 简明内容与空白 | OpenAI | `openai-student-pasta-billboard`, `openai-with-chatgpt-garage` |',
'', '## 更新 / 修订','',
'- 原始记录：`https://github.com/Azivor/reference/blob/main/data/references.json`。',
'- 原始发布映射：`https://github.com/Azivor/reference/blob/main/dist/library.json`。',
'- 当前快照树：`2cc52b3a4b6d4723a984d39f2094030547733322`，源记录 blob：`ddf48f02932b351dae3d3f73f766266dea6b6d57`。',
'- 更新时先对比稳定 ID 的增删改，优先只修订变化章节和视觉语法 crosswalk。',
'- 不要以原站图片补齐第三方未明确授权的重制素材库。原站链接可供审阅，生产素材应独立创作或取得授权。',
'', '## 当前包的证据限制','',
'本包逐条覆盖 90 个来源记录及其作者附带的视觉观察，并做独立中文提炼；没有逐张打开高清图片进行像素/色值/动画核验，未二次核实全部外链内容与发布日期。故不输出伪精确色值、字体规格或声称为品牌官方规则。',
'']
(D/'08-retrieval-protocol.md').write_text('\n'.join(lines),encoding='utf-8')

manifest={'project':'Azivor/reference visual distill','as_of':snap,'site':'https://azivor.github.io/reference/',
'repository':'https://github.com/Azivor/reference','git_tree':commit,'reference_blob':srcblob,
'count':len(records),'chapters':{c:{'name':brand,'file':fn,'count':sum(r['company']==c for r in records)} for _,(c,brand,fn) in companies.items()},
'visual_types':dict(Counter(r['visual_type'] for r in records)),
'coverage':{'record_metadata':'90/90','curator_notes_distilled':'90/90','high_res_image_reviewed':'0/90','external_sources_revalidated':'not systematically checked'},
'rights_note':'Only original metadata links and independent short distills, no image assets redistributed.'}
(D/'manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n')
readme=f'''# Reference Gallery · Visual Distill / Index

**快照日期**：{snap}　**记录数**：90（Anthropic 60 / Perplexity 12 / OpenAI 11 / Grok 7）

> **读取目的**：把公开图库整理为独立、结构化、可追溯的参考层。短索引先定位，再展开章节；仅在需要时访问原图。服务于 Praxis/Fresh Agent UI 的设计研究，而非直接输入整个网站或替代现有 Design Kit。

## 入口

- **[INDEX.md](INDEX.md)**：章节导航、类型索引与 90 条完整快速定位。
- **[01-anthropic.md](01-anthropic.md)**：科研编辑拼贴与纸张、实物、摄影的组合（60）。
- **[02-perplexity.md](02-perplexity.md)**：天体图像、探索叙事与跨媒介系统（12）。
- **[03-openai.md](03-openai.md)**：人类场景、摄影、留白与产品广告（11）。
- **[04-grok-xai.md](04-grok-xai.md)**：黑场、弧光、柔焦与粒子（7）。
- **[05-image-treatment.md](05-image-treatment.md)**：按图像类型交叉检索。
- **[06-grammar-crosswalk.md](06-grammar-crosswalk.md)**：视觉语法与组件边界。
- **[07-fresh-ui-application.md](07-fresh-ui-application.md)**：与 Fresh Agent UI 的区域匹配与减法原则。
- **[08-retrieval-protocol.md](08-retrieval-protocol.md)**：按需检索、展开、核验与更新约定。

## 数据

`catalog.jsonl`、`catalog.csv` 保留原来源链接、公开画廊中分辨率图片链接、稳定 ID、视觉类型、精简中文线索、检索标签；`manifest.json` 包含来源指纹和覆盖情况。`catalog.compact.txt` 与 `cues.compact.txt` 是可再生构建输入，`build.py` 可重编译本包。

## 来源与限制

- 网站：[Reference Gallery](https://azivor.github.io/reference/)
- 公开源仓库：[Azivor/reference](https://github.com/Azivor/reference)
- 原始记录：[data/references.json](https://github.com/Azivor/reference/blob/main/data/references.json)
- 本次快照 Git tree：`{commit}`，源数据 blob：`{srcblob}`。
- **验证范围**：90/90 条元数据及原站视觉说明；未对 90 张图片逐张做高清图视觉核验，也未批量检查所有原出处链接的存活状态。记录日期以原数据为准。
- **版权与合规**：不复制图片资源，不将第三方品牌设计或摄影直接作为新产品素材。本包文字是基于参考元数据的独立提炼；实际上线素材需自创或明确授权。

## Agent Context Hygiene

不需要把整个包注入 Context。先读索引选择约 2–5 条 ID，只展开相关章节和必要图片。细节不确定就回原出处核对，不把归纳观察写成品牌官方规范。
'''
(D/'README.md').write_text(readme,encoding='utf-8')

# Validate internal source urls and all chapter entries
for r in records:
 assert r['gallery_image_url'].startswith('https://azivor.github.io/reference/assets/images/')
 assert r['source_url'].startswith('https://')
 assert f'id="ref-{r["index"]:03d}"' in (D/r['chapter']).read_text()
assert sum(Counter(r['visual_type'] for r in records).values())==90
for doc in D.glob('*.md'):
 assert doc.stat().st_size>400,doc
zip_path=Path('/mnt/data/azivor_reference_visual_distill_2026-10-31.zip')
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in sorted(D.iterdir()):
  if p.suffix in ('.md','.csv','.json','.jsonl','.txt','.py'):
   z.write(p,arcname='azivor-reference-distill/'+p.name)
print('OK:',len(records),'records',len(list(D.glob('*.md'))),'markdown files', 'ZIP bytes',zip_path.stat().st_size)
print('Type distribution:',Counter(r['visual_type'] for r in records))
print('Files:',[(p.name,p.stat().st_size) for p in sorted(D.iterdir())])
