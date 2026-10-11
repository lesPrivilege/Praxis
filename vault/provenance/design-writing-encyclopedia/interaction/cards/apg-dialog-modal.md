# DWI-002 · WAI-ARIA APG Dialog (Modal) Pattern

来源：[W3C WAI APG Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) · 状态：verified（直接读页面文字；未运行示例）

## 这份来源是什么

WAI-ARIA Authoring Practices Guide 的模态对话框模式，界定覆盖在主窗口或另一对话框上的窗口及键盘焦点规则。读了 About This Pattern（18–25段）、Keyboard Interaction 和注释（32–56段）、Roles/States/Properties（57–73段）。核心条件不是视觉暗幕单独存在，而是模态期间背景内容确实不可交互；背景也应视觉上遮蔽或减弱。

## 支持的判断

- 打开时把焦点放到对话框内；Tab 和 Shift+Tab 留在对话框可停靠元素内，Escape 关闭。
- 关闭后通常把焦点还给触发控件；若触发控件消失或后续流程的起点更合逻辑，可转移到对应目标。
- 建议对话框顺序中有可见关闭按钮；初始焦点位置应视内容结构、长度和动作后果选取。
- `aria-modal=true` 只有在视觉与交互两方面都真正模态时才设置；错误标记会使辅助技术用户无法感知其实仍可操作的背景。

定位：[Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) Keyboard Interaction（35–56段）、Roles/States, and Properties（57–73段）。

## 用途、边界与重访

可用于短暂、聚焦的任务，尤其确认、编辑或选择。不要把长内容、持续浏览任务随意塞入模态而阻断上下文；若背景仍可操作，需选择非模态模式并匹配其焦点模型。只读指导页，未运行其多层弹窗/日期选择示例，也未检查项目实际实现。

重访触发：模态规则或焦点恢复发生变化、复杂结构/不可逆操作需要选初始焦点时。关联语法：[navigation.md](../../../../../kit/design/interaction/navigation.md)、[feedback.md](../../../../../kit/design/interaction/feedback.md)。

许可状态：未保存原文/代码，重用前核对 W3C 页面许可。证据形态：页面文字，未看图、未运行代码。
