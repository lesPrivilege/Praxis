# 控件与图标语义

语法 ID：`DWG-I-CONTROLS` · 取用：可选普通参考（`normal` / `reference`）。

按控件要完成的动作选择语义、状态表达和输入路径，用于界面设计评审、原型与实现契约；状态与可达性另见 [交互状态](states.md)。

## 动作先于外形

把动作分为导航、命令、选择、输入、展开和直接操纵。链接把人带到另一个位置或资源；按钮触发当前上下文中的命令；选项控件保留选择状态；展开控件显露或隐藏一段关联内容。形状相似不代表语义相同。WAI APG 的 Button Pattern 明确区分按钮与链接，并要求可访问名称；原生 HTML 控件通常优先于自造 ARIA widget。[APG Button Pattern（S12）](../../../../vault/provenance/design-grammar-atlas-20261002/cards/s12-wai-aria-apg-button.md)

用一个完整标签表达“对象 + 动作”或清楚的目的。纯图标按钮也要有可访问名称；若含义依赖周边文字，确认该文字在程序语义上确实关联。图标是冗余线索，不是唯一的关键说明。多个图标容易混淆时，保留文字标签；工具提示可以补充，不应成为唯一标签或唯一发现路径。

### 状态不能混名

选择“当前项”“已按下”“已展开”“已勾选”“已禁用”中与控件一致的一种语义。Tab 的活动项与 toggle button 的 pressed 状态承担不同角色；切换按钮若继续代表同一命令，APG 建议用固定标签加 pressed 状态；若标签改成反向命令（Mute → Unmute），就不再用同一个 pressed 表意。按钮不能因“看起来像开关”就自动变成 switch，反过来也一样。状态须在画面和辅助技术语义中同步。[APG Button Pattern（S12）](../../../../vault/provenance/design-grammar-atlas-20261002/cards/s12-wai-aria-apg-button.md) [APG Tabs Pattern（CW-FE-R03）](../../../../vault/provenance/cw-frontend-references/cards/cw-wai-aria-tabs.md)

### 命中与焦点

对每个关键控件检查：可见标签、可访问名称、键盘可达、焦点可见、禁用或忙碌缘由可理解。符合某个目标尺寸准则要按实际指针目标与适用例外核查；触控目标可以按设备、误触后果和空间条件加大，不能把项目选择误说成所有规范的硬性数值。[WCAG 2.2 目标尺寸重访记录](../../../../vault/provenance/cw-frontend-references/cards/cw-wcag-target-size-minimum.md)

避免紧贴的多个小图标只有颜色、悬停或位置暗示动作。关键焦点不能被固定页眉、弹层或滚动容器遮掉；可见焦点变化不能只用颜色传达。数值要求依项目选定的 WCAG 级别和产品平台单独检查。

## 键盘替代与直接操纵

键盘操作与无拖动指针替代是两份独立约束。WCAG 2.2 AA 的 2.5.7 要求可拖动功能另有单指、无需拖动的指针路径（除拖动本质必要，或由用户代理决定且作者未修改）。若拖动排序用键盘快捷键可行，也要额外让鼠标/笔/触屏用户能点“上移 / 下移”；键盘等效本身不满足这项单指替代准则。滑块可允许点按轨道定位，颜色轮可给数值输入；不要求替代项是同一组件，但功能必须等价。准则与 2.1.1 Keyboard 独立评估；单指替代也不能只依赖路径手势。浏览器自己的滚动/拖动刷新等用户代理操作不属作者实现的内容，除非作者拦截并自作滚动机制。

这些结论的来源是 [WCAG 2.2 normative SC 2.5.7](https://www.w3.org/TR/WCAG22/#dragging-movements)；其配套 [Understanding 页面](../../../../vault/provenance/design-writing-encyclopedia/interaction/cards/wcag-dragging-movements.md)提供解释、技术示例和例外说明，标为 informative，不单独形成符合性要求。

成熟库可帮助拆解实现职责，但它的 API 不是跨栈规范。React Aria 的 Slider 页面分别暴露 label、output、轨道、thumb、焦点 thumb、dragging 与格式化值，提示设计者把直接操纵、键盘焦点和数值读数一起约定；仅读文档，未安装或执行。[DWI-007](../../../../vault/provenance/design-writing-encyclopedia/interaction/cards/react-aria-slider.md)

方向键、Enter、Space、Escape、Home/End 的约定按匹配的 APG pattern 采用；不要从一个 widget 移植另一类 widget 的按键习惯。复合控件减少 Tab 停靠点时，内部方向导航和读屏名称/状态也必须成套实现，并在真实浏览器与辅助技术组合下验证。

## worked example：筛选面板

用户可在筛选面板的“状态”复选框中多选，也可按“应用筛选”命令；键盘依次访问各输入与按钮。标题“状态”只负责分组，不拿来冒充按钮。若用折叠面板，标题中的按钮以 `aria-expanded` 表示展开，并关联面板；若用 tabs，则必须有真实的平行内容面板以及对应的箭头导航。成功应用后显示筛选条件与结果数，焦点留在按钮或移到结果标题取决于是否发生明确的上下文转换。

## 反例

四个只显示 `＋ / － / 漏斗 / 对勾` 的图标，无名称、焦点轮廓，且只有鼠标悬停才解释含义；按 Tab 看不到焦点，拖动才可排序。即使视觉上容易猜测，也缺少可访问名称、键盘替代与可靠反馈。

## 取舍与检查

先使用平台原生控件；只有需要的交互确实超出它时才建立复合 widget。选择组件时对照对应的 APG pattern 和真实运行环境，避免仅因 ARIA 属性齐全就宣称可访问。图标风格、笔画和密度属于视觉系统选择。

最小检查表：逐一写出控件意图、语义角色、名称、当前/禁用/忙碌状态、指针与键盘操作、结果反馈、焦点去向；检查触控目标；测试纯键盘及至少一种屏幕阅读器；检查图标是否使用受限资源。

### 图标来源边界

Apple SF Symbols 官方 overview 描述面向 Apple 平台的符号字重、尺度、方向适配和动态 rendering 能力，可借作平台图标特征观察；它不构成跨平台图标库推荐或许可文本。Apple HIG 的官方搜索摘要另警示 app icon、logo、trademark 相关限制。实际选用具体 symbol 前，先核对 Apple 当前 HIG/许可、该 symbol 的具体限制和目标系统版本；Web 使用授权不能由此推断。[DWI-005](../../../../vault/provenance/design-writing-encyclopedia/interaction/cards/apple-sf-symbols.md) [DWI-008](../../../../vault/provenance/design-writing-encyclopedia/interaction/cards/apple-sf-symbols-overview.md)

## 证据边界

APG/WCAG 定义了语义与成功标准，不证明某个控件已实现或通过验收。Apple HIG 是平台指导；其适用性不自动转成 Web 规则。逐条来源状态、阅读范围和未验证内容见 [interaction 来源目录](../../../../vault/provenance/design-writing-encyclopedia/interaction/catalog.json)。

展开同层内容时还可对照 [APG Accordion（DWI-001）](../../../../vault/provenance/design-writing-encyclopedia/interaction/cards/apg-accordion.md) 的标题按钮与面板关系；具体显隐取舍在 [导航与披露](navigation.md)维护。
