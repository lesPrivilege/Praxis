# DWI-004 · WCAG 2.2 Understanding SC 4.1.3 Status Messages

来源：[W3C WAI Understanding SC 4.1.3](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) · 状态：verified（全文文字已核对；所据为 informative 解说页）

## 这份来源是什么

WCAG 2.2 AA SC 4.1.3 的 WAI Understanding 页面。页面明确标为 informative explanation，不是 normative 条文；它解释正式 [WCAG 2.2 Recommendation, SC 4.1.3](https://www.w3.org/TR/WCAG22/#status-messages)。逐读 In Brief、Success Criterion、Intent、Examples、Techniques、Key Terms。

## 支持的判断

- 在 markup-language content 中，属于 status message 的内容须能由 role/property 等程序化确定，让辅助技术可在不接收焦点时呈现。
- 定义需同时符合两点：提供行动的成功/结果、应用等待、过程进度或错误信息；且不是通过 change of context 传达。
- 页面明确区分结果内容和短状态消息：搜索结果列表本身不是 status message；“正在搜索 / 返回 18 项 / 没有结果”一类简短消息若不挪焦点且不刷新页面，则是。
- Dialog 错误属于焦点/上下文变化，当前 SC 不覆盖；菜单、Accordion 展开和 Tab 改选属 UI component state changes，应依 4.1.2 Name, Role, Value，不再用 4.1.3 重复公告。新增问题字段等若不表达 success/result/wait/progress/error，也不是 status message。
- 4.1.3 不要求作者凭空生成 status message；若确有状态消息，才要求其可被程序化识别。额外 live region/alert 可增强体验但不都被 SC 要求；播报太多会使界面变 chatty，应做用户测试。

定位：[Understanding SC 4.1.3](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)：criterion & intent（页面 29–46 段）、status-message examples 与不属于 status message 的例子（52–103 段）、sufficient techniques（104–129 段）、Key Terms/status message（233–235 段）。[normative criterion](https://www.w3.org/TR/WCAG22/#status-messages)：WCAG 2.2 4.1.3，AA（第 1451–1458 段）。

## 用途、边界与重访

此来源可指导反馈分类和审查边界；页中引用 role=status、role=alert、role=log 和 progress live-region 属 sufficient techniques，并不意味着它们是唯一可行方法，也不应把所有内容改变都转为播报。正式适用性要结合规范文本、技术支持矩阵和目标辅助技术测试。

重访触发：撰写正式 WCAG 验收、选定自动公告实现、或核实例外时。关联语法：[feedback.md](../../../../../dsh-praxis/kit/design/interaction/feedback.md)（`DWG-I-FEEDBACK`）。

许可状态：已读 [WAI Material use policy](https://www.w3.org/WAI/about/using-wai-material/)；通常可免费用但需署名及链接，正文不可随意修改。普通 WAI 材料按 W3C Document License；该说明未明示简摘可单独作为 source snapshot，因此没有保存摘录。证据形态：W3C Understanding 全文直接读文字，没有运行代码或测试辅助技术。
