---
id: ASA-G-SPATIAL-MATERIALS
status: reference
reference_priority: normal
---

# Spatial light and material · 从感知条件到可读的数码表征

本页帮助设计者把开口、表面、光和身体位置转成可解释的图示或原型。目标由具体作品与任务决定；屏幕表征不能代替现场经验。

<a id="asa-g-turrell-skyspace"></a>
## ASA-G-TURRELL-SKYSPACE · James Turrell 的 Skyspace

### 作品语境

UT Landmarks 对《The Color Inside》的介绍把屋顶 oculus、自然天空、晨昏约一小时的 programmed light sequence、日光和天气并列为观看条件，并指出不同 Skyspace 各有差异。[ASA-S-02](../../../vault/provenance/art-software-atlas/spatial/cards/asa-s-02-turrell-ut-project.md)、[ASA-S-03](../../../vault/provenance/art-software-atlas/spatial/cards/asa-s-03-landmarks-color-inside.md) ARoS 对《As Seen Below》另列 Open Sky、封闭开口后的 Colour Shift 和晨昏 Twilight；这是该作的分段模式，不是系列通用程序。[ASA-S-01](../../../vault/provenance/art-software-atlas/spatial/cards/asa-s-01-aros-as-seen-below.md)

屏幕可以解释某个时刻的构图、视点或状态，无法呈现暗适应、周边视野、天气变化、停留时间和共同在场。故先选定媒介能回答的问题：关系说明、时间序列或视角探索；不把图像称作现场复现。

### 可操作关系

- **开口与围合：** 同时标出天窗边缘、室内周边和观看方向；省略房间时注明这是色彩示意。
- **光源分开：** 自然天空与人工灯光各自编码。合并为渐层时，标明它不代表天空色、墙面色或照度测量。
- **时间作为状态：** 用时间线或切换状态表达变化；单帧只代表所选时刻。
- **视点有后果：** 标出站坐位置、仰望方向或身体条件；静态图需说明被省略的观看过程。
- **场地条件保留：** 天气、日照、灯光程序和开放规则是作品具体条件，不能由主题预设替代。

### 实现选择

| 媒介 | 适合表达 | 代价与边界 |
|---|---|---|
| DOM/CSS | 对比天空、室内色域和明暗状态；加入文本说明与键盘操作 | 产生屏幕像素，不是房间照明；设备亮度、色域、环境光和色彩管理会改变结果。CSS Color 4 仍需按目标浏览器核对。[ASA-S-09](../../../vault/provenance/art-software-atlas/spatial/cards/asa-s-09-w3c-css-color.md) |
| SVG | 绘制天窗边界、剖面、视线、入射方向和状态序列 | 平面图压缩空间包围感；渐层和滤镜不是光测数据。 |
| WebGL / three.js | 探索房间体量、相机、时间与天空变量 | 结果受 renderer、曝光、环境贴图、显示 gamut 和设备影响，须标出模型与光源假设。API 的材质说明见 [ASA-S-08](../../../vault/provenance/art-software-atlas/spatial/cards/asa-s-08-threejs-meshstandardmaterial.md)。 |

ASU 的 Air Apparent 记录了另一件 Skyspace 的路径、材料、无障碍与预算约束，可用于比较场地如何改变设计条件，不能移作《The Color Inside》的规格。[ASA-S-04](../../../vault/provenance/art-software-atlas/spatial/cards/asa-s-04-asu-skyspace.md)

### 构造夹具

制作一张“选定时段的空间关系”图：可编辑开口、室内围合、天空区、人工光区、视点与状态标签。明确地点和观看方向，并区分测量值与设计者指定的假设。交互切换状态时保留时间说明，避免动画暗示所有作品只有一种固定节奏。

### 失败与下一步

粉紫色圆洞加黑底渐变只剩下“发光天窗”的图形符号，丢失作品的房间、时间与观看关系。照片取色也不能还原现场：曝光、压缩和屏幕会改变色彩，静帧不包含眼睛适应和天空变化。

下一步可加入经许可的现场测量、曝光与色彩校准、观者位置记录，再决定原型能支持哪种判断。ARoS、UT 与 ASU 的文本分别支持具体作品说明，不构成统一施工方案；来源入口见[空间支线目录](../../../vault/provenance/art-software-atlas/spatial/README.md)。

<a id="asa-g-ando-church-of-the-light"></a>
## ASA-G-ANDO-CHURCH-OF-THE-LIGHT · Tadao Ando《光之教会》

### 作品语境

Clark Art 将《光之教会》描述为朝向太阳的矩形体量、以十五度角穿过室内的独立混凝土墙、深暗礼拜空间中的十字形开口，以及粗脚手架木板地面和座席；其说明把触感与建筑感知相连。[ASA-S-05](../../../vault/provenance/art-software-atlas/spatial/cards/asa-s-05-clark-ando-projects.md) 教会官方页面记录参访受志愿者安排影响，提醒场地仍是礼拜空间，进入须尊重其使用规则。[ASA-S-06](../../../vault/provenance/art-software-atlas/spatial/cards/asa-s-06-ibaraki-church.md)

照片档案与 Commons 元数据未提供本轮可核对的原图，不能据此描述画面或建筑师意图。记录见 [ASA-S-07](../../../vault/provenance/art-software-atlas/spatial/cards/asa-s-07-10plus1-photo-archive.md)、[ASA-S-10](../../../vault/provenance/art-software-atlas/spatial/cards/asa-s-10-commons-ibarakichurch-photo.md) 和 [ASA-S-11](../../../vault/provenance/art-software-atlas/spatial/cards/asa-s-11-commons-image-resource-failure.md)。

这里的设计推演用于解释和搭建有标注的假设，不是历史重建或工程校核。宗教意义只保留来源明确支持的范围；roughness、木纹和“混凝土色”是 renderer 参数，不等于实际材料、施工或社群解释。

### 可操作关系

- **实体与切口：** 把十字形天光画作围护中的开口，而非贴在墙面的灯饰。
- **进入顺序：** 斜墙将入口与礼拜空间分开；只画正面时，明确进场过程被省略。
- **明暗依赖周边：** 保留开口所在的墙和室内几何；过曝会遮住孔、窗、灯或投影之间的区别。
- **材料按接触关系区分：** 混凝土围护与供人接触的木板座席、地面分别表示。来源未给出木种、混凝土配方或反射率，不补写参数。
- **场地仍在使用：** 访客权限、礼拜隐私、导览安排和不可达位置会约束展示方式。

### 实现选择

| 媒介 | 适合表达 | 代价与边界 |
|---|---|---|
| SVG 平面图或剖面 | 墙厚假设、开口、路线、太阳方向、视线和亮暗区域 | 关系易检查，但不模拟反射、遮蔽、视野或人体尺度；区分来源事实、简化和未知值。 |
| DOM/CSS 分步图 | 对比进入、转向和望向祭坛等状态，并提供可访问说明 | CSS 渐层与遮罩只控制像素；色彩规范不提供建筑光照测量。[ASA-S-09](../../../vault/provenance/art-software-atlas/spatial/cards/asa-s-09-w3c-css-color.md) |
| WebGL / three.js | 检查体量、切口、视角、遮光与表面参数假设 | `MeshStandardMaterial` 支持 roughness/metalness 参数，但不恢复施工、光谱反射、老化或触感；错误曝光和贴图会让未经核实的模型显得可信。[ASA-S-08](../../../vault/provenance/art-software-atlas/spatial/cards/asa-s-08-threejs-meshstandardmaterial.md) |

先用有标注的剖面解释几何；需要比较视角或遮光时再引入 3D。工程判断还需施工图、尺寸和现场照度等证据，渲染效果不能补足这些缺项。

### 构造夹具

建立一个标注三类信息的剖面：“来源明确”“为图示简化”“待现场或图纸验证”。画出矩形围护、独立斜墙、十字开口、地面/座席、一个设计者指定的太阳方向和视点。可并排放置灰模与材质预览：前者检查开口和遮挡，后者只比较 renderer 参数，不称为材料复原。

### 失败与下一步

盒状模型加水泥贴图，再贴一个自发光十字，会抹掉开口、斜墙和进场关系；高分辨率纹理反而让错误叙述更可信。电影化提亮室内、抽象替换木板也会掩盖未经核实的光线与材料假设。

下一步查施工与维护记录、木材再利用资料、光照测量和使用场地社群的阐释；经许可查看图像后，再核对模型几何。来源记录、许可信息和访问失败分别见上述 ASA-S-05–11 来源卡；照片档案和 Commons 元数据不能代替现场观察。
