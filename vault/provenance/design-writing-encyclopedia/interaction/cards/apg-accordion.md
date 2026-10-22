# DWI-001 · WAI-ARIA APG Accordion Pattern

来源：[W3C WAI APG Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) · 状态：verified（直接读页面文字；未运行示例）

## 这份来源是什么

WAI-ARIA Authoring Practices Guide 的 Accordion Pattern 页面，描述垂直排列的交互标题及其显示/隐藏内容面板，并给出按键和 ARIA 状态关系。页面正文从“About This Pattern”读到“WAI-ARIA Roles, States, and Properties”。模式把减少滚动作为常见用途，但允许标题旁有常显操作或常显摘要，故“所有内容都折叠”不是必要设计。

## 支持的判断

- 标题控制对应面板；Enter/Space 展开或折叠，能否单开、多开、保持至少一个展开是实现变体。
- 结构上以 heading 包含 button 表达面板标题，按钮 `aria-expanded` 与面板显示状态同步，并通过 `aria-controls` 指向面板。
- 面板 `region` 是可选语义；页面提醒大量可同时展开的面板避免堆积过多 landmark。

定位：[Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) 的 About This Pattern（页面 23–30 段）、Keyboard Interaction（37–41 段）、WAI-ARIA Roles, States, and Properties（42–52 段）。

## 用途、边界与重访

可用于判断“展开一段同层级内容”是否适合 accordion，并检查键盘与面板关联。不要把 accordion 用成不同目的地的站点导航，也不要用它隐藏必须先知悉的费用、权限或不可逆影响。APG 模式指导和示例不是产品的无障碍测试报告；浏览器/辅助技术组合、本地 DOM 与折叠实现均未测试。

重访触发：项目打算复用该模式、APG 页面修订，或添加嵌套/大批量面板时。关联语法：[navigation.md](../../../../../dsh-praxis/kit/design/interaction/navigation.md)，[controls.md](../../../../../dsh-praxis/kit/design/interaction/controls.md)。

许可状态：W3C WAI Material 的许可须按页面许可说明确认；未复制原文或代码，不作宽泛再许可结论。证据形态：页面正文文字直接访问；未看示例截图或运行示例。
