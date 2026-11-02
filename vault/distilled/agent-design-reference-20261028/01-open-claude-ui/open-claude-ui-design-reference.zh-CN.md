# Open Claude UI：可复用界面与交互参考

**用途：**供 agent 产品设计、前端实现和设计评审直接使用，重点是层次、留白、字体、密度与工作状态，而不是复制 Claude 品牌。

**源码基线：**Caho1/open-claude-ui，提交 `c1f923ae0051a871941b98a0e2e3183a545e6a85`，提交时间 2026-10-21；研究日期 2026-10-28。本文中的源码链接固定到该提交。公开站点观察另列，不代表与此提交一一对应。

## 1. 先明确参考对象

这是一套 React 示例组件、CSS 令牌、Tailwind 扩展配置与研究文档，不是具有完整业务路由、服务端权限和真实模型接入的 SaaS。包入口输出组件，另外提供 theme、pure CSS 和 Tailwind 配置；`pure.css` 实际仅导入 theme。仓库将其描述为对 Claude Desktop 的逆向还原，但本文只验证仓库自身的声明与实现，不把它提升为 Anthropic 官方设计规范。[包入口与导出][package] [纯 CSS 入口][pure]

值得提炼的主线是：**用较弱的表面差异组织空间，用字号和间距组织阅读，用局部状态提示组织 agent 工作。** 主画布不必塞满卡片；用户输入、工具授权、附件、代码等不同对象，才需要不同的容器边界。

### 证据的三种等级

- **源码声明：**CSS 变量、组件属性和事件处理器直接写出的规则。
- **条件换算：**本文将标准 Tailwind 默认尺度按根字号 16px 换算。它不是浏览器 computed style；宿主改根字号、Tailwind 版本或预设后必须重算。配置没有锁定 Tailwind 依赖，也没有覆盖通用 spacing/fontSize，因此无法保证任意宿主都编译出相同 CSS。
- **设计建议：**为法律科技或 agent 产品提出的迁移方式，不是原仓库已有功能。

特别注意：`--cds-rem-scale: calc(16 / 17)` **不等于**把根字号设置成 16/17，也不会自动缩放整站。只有显式乘此变量的表达式才缩放。源码没有提供统一 body 字号与全局行高。[theme L7–14][theme-scale] [Tailwind 配置][tw]

## 2. 信息架构：三块工作区，两个阅读密度

源码可以组合成下列结构，但没有唯一的整站布局或完整路由：

```text
45px 顶栏：任务标题 / 窗口控件 / 当前页操作
├─ 会话导航：固定会话 + 最近对话
├─ 主阅读区：提问 → 状态/工具 → 回答 → 产物入口
│  └─ 底部输入区：附件 → 输入正文 → 模型/模式/发送
└─ 可选产物区：文档、代码、预览，与主阅读区可调比例
```

**导航密、正文疏、输入紧凑但不拥挤。** 导航需要快速扫读大量标题；回答需要持续阅读；输入区应同时容纳正文和少数操作，却不能变成设置表单。这种密度分工比某一个圆角数值更值得保留。

| 区域 | 源码几何规则（16px 根字号换算） | 层次与留白的作用 |
|---|---|---|
| 桌面顶栏 | 45px 高，左右 padding 16px；标题与操作 gap 8px | 短、稳定，不抢正文的垂直空间 |
| 会话侧栏 | `w-72` → 288px；自身头部 `h-11` → 44px | 注意侧栏头部与桌面顶栏并非相同高度 |
| 侧栏滚动内容 | 内边距 8px；分组间 16px；组内行间 2px | 用组间距区分“固定/最近”，不靠每行分割线 |
| 会话行 | 水平 padding 10px，垂直 8px；圆角 8px | 标题单行截断，副信息缩小；行高随内容而非统一锁死 |
| 输入区外框 | `max-w-3xl` → 最大 768px、居中、左右 padding 16px | 与窗口边缘分离；并不意味着所有消息自动对齐到同一宽度 |
| 助手回答容器 | `max-w-2xl` → 最大 672px；子块间 14px；左 padding 4px | 正文比输入区窄，避免横向长行；没有全局统一版心保证 |
| 用户气泡 | 最大为父容器 85%；内边距水平16/垂直12px | 通过位置和底色识别发言者，而不是每条都加大头像 |

来源：[顶栏 L44–95][header]、[会话导航 L180–335][sessions]、[输入区 L98–155][composer]、[消息 L111–225、271–363][messages]。这里的 288px 是**组件源码**，不是官网文档侧栏的测量值。

### 不应直接照搬的桌面宿主选择

顶栏针对 macOS 非全屏预留 `round(74 / min(zoomFactor,1))` px 红绿灯区域，独立拖拽带高45px，操作区声明 `WebkitAppRegion: no-drag`。普通浏览器 SaaS 不需要这套窗口拖动逻辑，也不应因为 UA 含 Mac 就留下无用途空槽。[顶栏 L23–95][header]

## 3. 字体体系：正文、控制、元数据分工

### 3.1 两套字体栈并不相同

| 使用路径 | 原始字体优先顺序 |
|---|---|
| Tailwind `font-sans` | AnthropicSans → Inter → system-ui → -apple-system → BlinkMacSystemFont → Segoe UI → PingFang SC → sans-serif |
| Tailwind `font-serif` | AnthropicSerif → Newsreader → ui-serif → Georgia → Times New Roman → serif |
| Tailwind `font-mono` | JetBrains Mono → ui-monospace → SF Mono → Menlo → monospace |
| CSS `--font-anthropic-sans` | anthropic-sans → system-ui → Segoe UI → Roboto → Helvetica → Arial → CJK 回退 → sans-serif |
| CSS `--font-anthropic-serif` | anthropic-serif → ui-serif → Georgia → Times New Roman → CJK 回退 → serif |
| CSS `--font-anthropic-mono` | anthropic-mono → ui-monospace → monospace |

CSS 的 CJK 回退依次是 PingFang SC、PingFang TC、Hiragino Sans、Apple SD Gothic Neo。`AnthropicSans` 与 `anthropic-sans` 不能假定指向同一已加载字体；变量存在也不意味着自动赋给 body。实际字形取决于宿主字体安装和声明。[字体变量 L225–234][fonts] [Tailwind L27–55][tw]

**迁移规则：**先选合法可用的中文无衬线正文，再配等宽元数据；不要以“相似英文标题”代替中文长文验证。法律文档的中文标点、数字、括号和长法条，必须以真实内容检查行高和断行。

### 3.2 主要文字阶梯

下表是组件 class 的声明/默认尺度换算，不是统一的全局排版系统。`leading-relaxed` 按常规 Tailwind 为 1.625；未显式行高的任意 px 字号可能继承宿主行高，不能补写一个猜测值。

| 对象 | 字号 / 行高 | 字重及用途 |
|---|---|---|
| 输入正文 | 15px / 1.4，即21px | 普通正文；不是等宽字体 |
| 助手回答正文 | 15px / 1.625，即24.375px | 常规字重，连续阅读优先 |
| 用户提问正文 | 14.5px / 1.625，即23.563px | 常规字重，略小于回答 |
| 侧栏标题 | `text-xs` →12px/16px | 活跃行中等字重；标题截断 |
| 侧栏更新时间 | 10px / 未独立声明 | 弱化信息，不能承载重要状态 |
| 助手头部 | 12px/16px | Claude 名称 semibold；时间11px等宽；模型徽章10px等宽 |
| 工具栏与弹出菜单 | 通常12px/16px | medium；描述/徽章10–11px |
| 代码正文 | 13px / 1.625，即21.125px | mono；独立水平滚动 |
| 思考步骤 | 12px / 1.625，即19.5px | mono；不应将其当成必须展示的隐式推理 |

来源：[输入区 L135–150][composer]、[消息 L125–218、275–384][messages]、[侧栏 L201–310][sessions]。

通用控制字重为 normal400 / medium500 / semibold600 / bold700（默认工具类语义）。暗色主题给 `.font-medium/.font-semibold/.font-bold` 添加 `font-variation-settings: "wght" 465/560/660`，但这只在字体支持相关可变轴时有意义，**不是所有字体都会自动变细**。常规正文无统一 letter-spacing 覆盖；侧栏分组 `tracking-wider` 通常0.05em，附件徽章 `tracking-wide` 通常0.025em。中文标签不应机械继承英文大写字距。[theme L375–400][optical] [侧栏 L205、275][sessions]

### 3.3 “节奏令牌”与实际正文不是一回事

CSS 声明 `--chat-body=.875rem×16/17`、`--chat-leading=1.42857`，turn gap 为两者乘积的0.75，item gap为0.5。根字号16px时分别约13.176px、18.824px行框、14.118px轮次间距、9.412px子项间距。但已检查的消息组件正文直接写14.5px/15px，容器写`space-y-3.5`，并没有完整消费这套节奏变量。**实现时择一套节奏并全局接通，不要把两组数字叠加。**[theme L188–193][rhythm] [消息 L275、361][messages]

## 4. 间距：不是纯4px网格，而是4px主阶梯加光学微调

基础实用阶梯是2、4、6、8、10、12、14、16、20、24、32px。10px/14px来自`2.5/3.5`，并非错误；1px轨道、3.5px状态点间距、11.5px小按钮字等属于局部微调。不要为了统一“8点网格”把所有值四舍五入。

**可以直接复用的关系：**

1. 容器外部留白大于内部控件 gap：输入区外侧16px，壳内14px，操作间6px。
2. 同组内容紧、组与组松：导航行间2px，组间16px；助手回答子块14px。
3. 主体与元信息差一级：正文约15px，控制12px，时间/标记10–11px。
4. 卡片只围住需要操作或确认的对象；长篇回答保持无边框透明底。
5. 行内图标可局部向下偏移0.125em，避免为视觉对齐改整行高度；不要全局强制所有图标同偏移。[图标工具类][optical]

输入区细部：外壳 padding `.875rem`=14px、纵向 gap8px；textarea 左 padding6px，最小3rem=48px，最大24rem=384px，`field-sizing:content`；底栏顶 padding4px；按钮间gap6px。发送为32×32px，内部图标16px。加内容菜单宽208px、模型菜单224px，均向上弹出、与锚点间8px、菜单padding6px。这里没有保证 `field-sizing` 不支持时的自动高度回退实现。[输入区 L98–265][composer]

## 5. 色彩、边界与形状

### 5.1 语义表面

| token | 浅色 | 深色 | 语义倾向 |
|---|---|---|---|
| surface-0 | #f9f9f7 | #0b0b0b | 底层/侧栏基底 |
| surface-1 | #fcfcfb | #151515 | 主聊天画布 |
| surface-2 | #ffffff | #1a1a19 | 内容卡片 |
| surface-3 | #ffffff | #20201f | 更高层输入/控件 |
| surface-popover | #ffffff | #2c2c2a | 弹出层 |
| text-primary | #151515 | #f5f5f5 | 主内容 |
| text-secondary | #525252 | #a3a3a3 | 次级说明 |
| text-muted | #8a8a8a | #666666 | 极弱元信息，慎用 |
| clay | #d97757 | #d97757 | 小面积强调 |
| clay-hover | #cc5a36 | #e08264 | CSS变量的hover色 |
| brand | #c6613f | 继承同值 | 另一个品牌填充，不等于clay |

来源：[浅色变量 L89–144][light]、[深色变量 L284–368][dark]。注意组件可能硬编码neutral色或白色，并非全部遵循语义 token。Tailwind `clay.hover` 固定#cc5a36，不随 CSS 暗色变量变成#e08264；使用`bg-clay-hover`与`var(--cds-clay-hover)`不是完全等价的路径。[Tailwind L12–18][tw]

浅色标准边框为8%灰的10%透明度（`hsla(0,0%,8%,.10)`），strong为20%；暗色分别白9%和18%。细线变量默认1px，2x屏幕0.5px、3x屏幕1/3px；只有使用`.border-hairline`的元素才消费该变量，普通`border`不会全部变成发丝线。[边框与高DPI规则][light] [theme L269–279][hairline]

### 5.2 圆角必须按表达式解析

| 对象 | 实际声明 |
|---|---|
| xs/sm/md/lg/xl/2xl | .125/.25/.375/.5/.75/1rem →2/4/6/8/12/16px |
| panel | 10px |
| composer | 20px |
| 用户气泡、card | `8px + .25rem × (16/17)` →约11.765px，而不是固定18px |
| pill | 999px；另有兼容别名9999px |
| dialog | 16px token，组件用rounded-2xl |
| code | 12px token，示例rounded-xl |

**关键纠偏：**气泡注释仍写“默认18px”，Tailwind bubble fallback也写18px，但现行CSS变量已定义，fallback不会生效。以实际变量解析为准。[圆角 L146–186][radii] [气泡局部覆盖 L648–663][bubble-css]

嵌套圆角的思想是内轮廓与外轮廓协调，不是所有卡片都统一12px。上述计算可作为参考，但若宿主采用不同padding，应重新检查内外弧线。

### 5.3 阴影只用于空间关系

- 小层级：`0 1px 2px rgba(0,0,0,.05)` 加 `0 2px 8px rgba(0,0,0,.08)`。
- 浅色popover：1px外轮廓，加`0 8px 24px rgba(0,0,0,.12)`与`0 2px 6px rgba(0,0,0,.08)`；暗色改内高光1px，并使用更深的黑影。
- 输入区默认：`0 4px 20px rgba(0,0,0,.035)`加内侧1px边界。hover令牌增为24px模糊、.06黑度；focus令牌.08黑度，并增外圈1px。**ChatComposer组件只绑定默认令牌，未接入这两个状态。**
- 焦点应表达键盘位置，不要把装饰性阴影误当成有效focus指示。[阴影 L112–131][shadows] [暗色阴影 L321–340][dark] [输入壳 L101–105][composer]

## 6. 控件：从视觉层级到可操作性

### 6.1 按钮阶梯

| size | 高度 | 水平padding | 圆角 | 字号 | gap |
|---|---:|---:|---:|---:|---:|
| xxs |20px|6px|4px|11px|4px|
| xs |24px|8px|6px|11.5px|4px|
| sm |28px|10px|8px|12px|6px|
| md（默认）|32px|14px|8px|14px|6px|
| lg |40px|20px|12px|15px|8px|
| icon |32×32px|0|8px|继承|—|

来源：[CdsButton L28–35][button]，圆角按仓库Tailwind配置而不是任意版本默认值。

默认variant是secondary：浅底填充、不加实体边框；primary为clay实底白字；ghost透明底，hover才出现背景；danger红色；outline只宜用于未被另一框围住的空白区域。这是“少画一层闭合边界”的设计倾向，不是仓库所有组件都完全遵守。按钮外层负责布局、内层绝对定位paint层负责背景和阴影。加载会禁用按钮并用14px spinner代替左图标；disabled opacity35%，focus-visible有2px clay/50 ring。图标按钮并不自动生成可访问名称，使用者必须传入。[CdsButton L37–149][button]

### 6.2 附件的双密度

tile为`7.5rem×16/17`正方形，根字号16px时约112.94px，内padding12px；不是README描述的128×96px。chip使用水平10/垂直4px padding、8px gap、10px圆角。文件名中间截断保留扩展名；tile按14字符预算、chip按20字符预算。此字符算法不等于视觉宽度算法，中文和长扩展名仍需测试。删除按钮tile20px、chip16px，触控目标偏小；tile本体是带click的div，未配置tabIndex/键盘激活。[AttachmentCard L39–52、89–188][attachment]

### 6.3 分段控件

轨道padding实际是**1px**，不是2px；小/中高28/32px，标签12px。纯CSS指示器宽`(100%-2px)/选项数`，left为`1px+索引×单格宽`，120ms吸附；默认则用Framer Motion spring(500,35)。源码标记tablist/tab/aria-selected，但没有方向键与roving tabindex管理。容器查询类是否可编译未被包配置保证；注释称仅折叠未激活项，但实际label类未按active做区分。不能据注释声称已实现完善窄宽适配。[SegmentedControl L84–166][segmented]

## 7. 状态与交互：借的是协议，不是动画数量

| 流程 | 已实现 | 迁移时必须补齐 |
|---|---|---|
| 输入发送 | 空正文且无附件时禁用；Enter发送、Shift+Enter换行；合成输入或keyCode229不发送；发送回调后立即清空 | 服务端回执/失败恢复/重复发送保护；附件示例是模拟加入，不是真上传 |
| 下拉菜单 | 点击触发；基础composer监听外部mousedown关闭 | Escape、焦点转移/返回、菜单语义与键盘导航；模型名字只是示例数据 |
| 长提问 | 测量高度超过默认300px才显示展开；底部3rem渐隐 | 自定义collapseThreshold只影响判断，CSS裁剪仍固定300px；缩放/字体变化重测 |
| 消息操作 | hover显示；用户消息操作还有focus-within显示；copy文字短暂变成勾 | Clipboard Promise失败处理；触屏可发现性 |
| 思考/工作进度 | 生成中展开；结束后可折叠；grid0fr→1fr、200ms | 展示可理解的工作摘要/工具步骤，而非要求模型暴露隐藏推理；aria-expanded与播报 |
| 流式滚动 | 距底≤40px锁定；离底>120px显示jump；用户输入后150ms冷却；自动贴底使用auto | hook只返回回调，宿主必须真正绑定wheel/touch/key事件；注释35vh底部缓冲没有在hook中实现 |
| 工具授权 | pending_approval/running/success/error；参数预览、拒绝/始终允许/单次批准 | 授权按钮不是权限系统；允许后1200ms自动success是模拟；真实结果必须由执行器驱动 |
| 产物分栏 | 初始50/50；左最小380、右420px；右剩余<18%时折叠；双击重置；Escape回滚 | 总宽<800px时最小宽约束冲突；separator无方向键调整；iframe罩为pointer-events:none，不可称可靠事件屏蔽 |

来源：[composer L53–95、167–265][composer]、[messages L95–106、154–170、254–355][messages]、[scroll hook L14–70][scroll]、[MCP L54–78、143–220][mcp]、[split L38–127、154–201][split]。

### 对法律 agent 最有用的转换

**建议，而非原仓库功能：**

- 把“会话”升级成“事项/研究任务”，侧栏保留密集标题，但把客户/事项编号作为可检索元信息，不靠截断后标题辨识案件。
- 把MCP卡的JSON首屏改成“动作 + 目标文档/系统 + 影响范围 + 是否可撤销”；技术参数仍可展开。单次允许作为明确主动作；长期授权需解释范围和撤销入口。
- 回答保持无边框长文；法源、证据摘录和草稿版本是独立可定位对象，才能在右侧文档面板对照，不应全塞进聊天气泡。
- 对执行失败、权限拒绝、来源不可用分别给状态；不要用同一红色error覆盖所有情况，更不能定时器伪装成功。
- 提交、外发、签署等有后果动作，要把预览和确认置于稳定卡片，不藏在仅hover出现的小按钮中。

## 8. 响应式：容器优先，但当前实现不完整

`ContainerResponsiveBar`声明命名容器toolbar：通常左右12px；≥384px改16px，按钮组gap由4px改8px；<480px隐藏Thinking徽章和Settings文字；<384px模型名最大72px截断；<576px隐藏运行快捷键。代码注释提到<320px“零间距”，**JSX未实现该分支**。且配置`plugins:[]`、未锁定Tailwind版本，对`@container/toolbar`和`@max-*`类的生成支持不能只凭源码字符串判定。[完整Toolbar L13–49][responsive] [配置与依赖][tw] [package][package]

分栏没有自动窄屏替代布局，侧栏也是固定288px。适用于Web的建议是：先保留正文与发送动作，再将元信息折叠；小屏把产物作为独立视图而非硬挤双栏；导航可收起，但必须有明确恢复入口。不能将“文档站有移动端页面”当成组件库已具备完整移动体验。

## 9. 可访问性与工程校核

### 9.1 颜色不等于可读性

以源码不透明色、sRGB相对亮度公式静态计算：主文字#151515对#fcfcfb约17.79:1；次文字#525252约7.61:1；浅色muted#8a8a8a约3.36:1；暗色muted#666666对#151515约3.18:1；白字对clay#d97757约3.12:1。这里是**指定色对计算值**，不是整站浏览器审计结论；真实透明度、底层和状态会改变结果。小字号muted元信息与白字clay按钮应优先重新检查，尤其不要用它们承载法律风险、期限或唯一的执行状态。

### 9.2 不能从注释推出的能力

| 注释/概述容易造成的印象 | 实现核查 |
|---|---|
| Dialog有焦点锁定、动态视口限高、四档宽度 | 实际仅sm400/md520/lg720；默认sm；无focus trap/restore、aria-labelledby，也没绑定注释中的max-height表达式 |
| Composer已有hover/focus三态阴影 | 只有默认shadow绑定；textarea去掉outline和ring，需补明确焦点表现 |
| 所有类都能直接编译 | text-heading、text-caption、text-body、font-header、font-control、gap-xs、duration-fast等在所查theme/config未定义；shadow-field等也未统一解析 |
| Dark模式能覆盖全部实现 | CSS变量支持data-mode=dark和.dark，Tailwind darkMode仅class；仅设置data-mode未必触发dark:类 |
| 纯CSS入口提供所有组件样式 | pure.css仅import theme；React JSX的大部分布局仍依赖宿主工具类生成 |
| 选择tab后具有完整键盘导航 | 有ARIA角色不等于有方向键/焦点管理；separator同样如此 |
| 所有动画遵守reduced-motion | 只部分可变字形动效受no-preference保护；消息、quiet dots等存在独立动画 |

来源：[dialog L24–66、73–154][dialog]、[composer L101–149][composer]、[tailwind完整配置][tw]、[theme L284、690起][theme]、[segmented][segmented]。

不需要为了使用这些设计关系而修补整个库。若新建自己的agent前端，更稳妥的是把已校核规则转成自己的少量语义tokens、可访问组件和状态机，再用这里的视觉节奏校对。

## 10. 一份可执行的设计验收清单

下面是迁移验收要求，不是声称仓库已通过：

- **首屏层次：**5秒内能找到当前事项、主输入和最后一个执行状态；元信息不能压过正文。
- **长中文：**以真实中文法条、双层编号、长机构名、金额和日期测试15–16px正文；200%缩放仍能读完，不出现隐形裁切。
- **导航：**同名事项能区分；选中不仅靠颜色；键盘可打开会话、固定及取消固定。
- **Composer：**中文输入法候选确认不误发送；空文本/附件/上传中/失败各有明确行为；焦点可见。
- **来源与产物：**正文引用能定位到来源；右侧面板关闭后焦点返回触发按钮；窄屏可完成同样任务。
- **执行：**授权前展示目标和后果；running不冒充success；拒绝与系统拦截有不同解释；刷新后的状态来自真实任务记录。
- **动作：**hover工具条在键盘与触屏也可发现；小图标有名称和足够操作空间；危险动作不只用红色表达。
- **动效：**流式输出不抢用户正在阅读的位置；减弱动画设置真正覆盖所有持续动画。
- **编译与主题：**每个语义类都在构建结果存在；浅/深主题逐一核对，而不是只切换root变量就结束。

## 11. 使用与资产边界

仓库LICENSE为MIT，版权声明归Caho1（2026），复用软件或其重要部分时需要保留许可证要求的声明。它并不自动替你取得第三方字体、商标、图标或其他资产的权利。`assets/README.md`明确不公开分发Anthropic专有字体、录音等二进制资产；本次仓库树也未列出字体文件。字体栈中写了某字体名，不表示字体随包分发或可自行复制。[LICENSE][license] [资产说明][assets]

本参考不需要品牌logo、专有字体或音频才能成立。对自己的法律科技产品，保留层次和空间关系，替换品牌名、色彩及图形；其具体合规边界应按拟使用资产另行核实。

## 12. 公开演示站：已观察到的视觉与交互

来源是[公开社区站](https://openclaudeui.com)及[会话组件页](https://openclaudeui.com/docs/components/conversation)，不是官方Claude。观察日期2026-10-28；DOM视口1188×761 CSS px，截图输出1173×751像素，两者不能直接混算。未发送消息、上传文件或批准工具。

### 页面层与组件层分开看

文档shell实测：全局header64px、章节header41px、文档侧栏268px、文章区域852px；h1字号/行高32/40px，h2为24/32px，侧栏文字14/20px。这些是**文档站**尺寸，不是上文45px桌面顶栏、288px会话侧栏的替代值。首页首屏的巨大留白和大标题属于营销层，也不宜原样搬进高频工作区。

普通textarea实测15/21px、初始708×48px，左padding6px；富输入框15/21px、642×44px，左padding8px。实际填字后DOM不再标记Send为disabled；即时截图04仍可能显示浅色，不能仅凭颜色判断状态。输入`/`后实际出现/help、/compact、/model、/plan、/clear五项向上弹层；深浅色切换能改变页面，切到暗色时slash仍保持展开。没有测试菜单键盘遍历或真正发送。

### 截图阅读路线

配套视觉证据目录中，01是首页浅色，02是消息，03是空输入，04是已填字未发送，05是slash菜单，06是深色输入且菜单仍展开，07是深色MCP等待授权。截图02中用户气泡呈非常浅的灰蓝底、助手正文直接落在画布上。截图本身不能证明具体色值或部署提交；**官网展示不应与固定提交强行合并为一个唯一实现**。

可迁移的视觉结论是：正文不靠重卡片建立权威；辅助元信息小而退后；输入区上下分层；权限待决只在局部加强边界。不可由截图推断：真实后端、IME守卫、精确动效时长、窄屏表现、焦点闭环与权限执行。完整截图索引及限制见配套《实际页面观察与截图索引》。

## 13. 证据索引与版本边界

以下链接均指向固定提交；不用重新浏览链接也能按本文重建关键设计关系。主文不包含整份第三方源码。配套JSON仅记录已提炼的关键值、解析条件与来源，不是可直接导入生产的全量主题。


[package]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/package.json#L1-L67
[pure]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/cds-pure.css#L1-L16
[theme-scale]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/cds-theme.css#L7-L14
[tw]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/tailwind.config.js#L1-L92
[header]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/ClaudeDesktopHeader.tsx#L23-L95
[sessions]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/DraggableSessionList.tsx#L180-L335
[composer]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/ChatComposer.tsx#L53-L265
[messages]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/ChatMessageBubbles.tsx#L95-L425
[fonts]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/cds-theme.css#L225-L234
[optical]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/cds-theme.css#L375-L400
[rhythm]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/cds-theme.css#L188-L193
[light]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/cds-theme.css#L89-L144
[dark]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/cds-theme.css#L284-L368
[hairline]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/cds-theme.css#L269-L279
[radii]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/cds-theme.css#L146-L186
[bubble-css]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/cds-theme.css#L648-L663
[shadows]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/cds-theme.css#L112-L131
[button]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/CdsButton.tsx#L28-L144
[attachment]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/AttachmentCard.tsx#L39-L186
[segmented]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/SegmentedControl.tsx#L84-L166
[scroll]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/useClaudeScrollPinning.ts#L14-L70
[mcp]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/McpToolDecisionCard.tsx#L54-L220
[split]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/ArtifactsSplitPaneResizer.tsx#L38-L216
[responsive]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/ContainerResponsiveBar.tsx#L13-L49
[dialog]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/ConfirmationDialog.tsx#L24-L154
[theme]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/code-examples/cds-theme.css#L1-L963
[license]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/LICENSE#L1-L21
[assets]: https://github.com/Caho1/open-claude-ui/blob/c1f923ae0051a871941b98a0e2e3183a545e6a85/assets/README.md#L1-L19


**本包导航：**[视觉观察](visual-evidence.zh-CN.md) · [七张截图](screenshots.md) · [token JSON](design-tokens.reference.json)。
