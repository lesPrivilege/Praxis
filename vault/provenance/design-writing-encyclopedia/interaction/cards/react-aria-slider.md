# DWI-007 · React Aria useSlider

来源：[React Aria `useSlider`](https://react-aria.adobe.com/Slider/useSlider) · 状态：verified（文档文字/API 读过；未安装或运行）

## 这份来源是什么

Adobe React Aria 的 slider API 文档，说明其 hook 提供滑块行为和无障碍实现，并把 React 组件、状态对象、控件 thumb 与 output 分为不同职责。所读 API 版本见独立变更记录；读到 About、基础示例及 SliderState/props/Aria 结构。它是成熟库文档中的一个具体实现组织例，不是 W3C 标准，也不是引入 React Aria 的推荐。

## 可迁移的观察

- 价值显示与滑块操纵同属一个控件，但 label、output、track、thumb 分别表达身份、值、范围轨道与抓手。
- API 对多 thumb 值、焦点 thumb、dragging 状态、禁用态与输出格式分别建模；文档输出了隐藏 range input 与其 label 的 props 接口。
- 这一结构有助于检查直接操纵是否也留下读数、可见焦点和语义身份，但文档结构本身不能证明每种辅助技术/浏览器组合都正确。

定位：[Slider/useSlider](https://react-aria.adobe.com/Slider/useSlider) Example、SliderState、AriaSliderProps、SliderAria 与 SliderThumbAria 部分（所开页面第 133–287 段）。

## 用途、边界与重访

把它作为控件职责拆分与潜在键盘/拖动状态清单，和 APG/WCAG 条文及目标项目实现进行比较。不能照搬 React API 到其他框架；不能以隐藏 range input 或源码存在推断语义可靠；不能声称实现通过了实际键盘或读屏测试。

重访触发：为连续范围控件写实现契约、React Aria API 大改版或需要对照另一套成熟库时。关联语法：[controls.md](../../../../../dsh-praxis/kit/design/interaction/controls.md)。

许可状态：代码未复制也未执行，使用前查当前 Adobe 开源许可与具体包版本。证据形态：文档文字/API 阅读；未安装依赖、未运行示例或屏幕阅读器。
