# DWI-003 · WCAG 2.2 Understanding SC 2.5.7 Dragging Movements

来源：[W3C WAI Understanding SC 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) · 状态：verified（全文文字已核对；所据为 informative 解说页）

## 这份来源是什么

WCAG 2.2 AA 成功准则 2.5.7 的 WAI Understanding 页面。页面标注为 informative explanations，属于解释、示例和 sufficient technique 汇集，不属于必须满足 WCAG 的 normative 文档。通读 In Brief、Success Criterion、Intent、Examples、Techniques、Key Terms。页面时间锚点见独立变更记录。规范要求本身应以 [WCAG 2.2 正式 Recommendation，SC 2.5.7](https://www.w3.org/TR/WCAG22/#dragging-movements) 为准。

## 支持的判断

- 作者实现的内容中，所有依赖拖动的功能都可用一个指针完成而无需拖动；除非拖动本身 essential，或功能由 user agent 决定且未被作者修改。网页内容若拦截浏览器滚动并自定义滚动，则不能套用“浏览器滚动由 user agent 负责”的例外。
- 替代路径须为单一指针可用（鼠标、笔、单指触屏），如点轨道设定 slider 值、通过“上移/下移”按钮改列表顺序、点选任务后用菜单移动列、数值输入替代颜色拖动。替代功能不必是同一控件，但须等价。
- SC 2.5.7 的 single-pointer 替代与键盘操作独立。键盘可排序仍不足以满足单指非拖动路径；反之有点按替代也不替代 WCAG 2.1.1 Keyboard。可用的多用途按钮同时服务二者，但须分别验证。
- 用精确沿轨迹拖动的 slider 或 swiping 作为唯一替代时，可能触及 SC 2.5.1 Pointer Gestures，因为该准则关心 path-based 手势。

定位：[Understanding SC 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)：Success Criterion 与 Intent（页面 30–69 段）、Examples（76–98 段）、Key Terms/essential 与 user agent（130–190 段）。[normative criterion](https://www.w3.org/TR/WCAG22/#dragging-movements)：WCAG 2.2 2.5.7，AA（第 1129–1141 段）。

## 用途、边界与重访

支持区分替代路径需要覆盖哪类输入，以及“keyboard equivalent”与“single-pointer non-drag alternative”的验收分别写。准则仅约束 web content author 解释的 pointer actions，不自动约束 web/native 所有交互。替代控制的等价性和规范例外仍须以具体页面流程验证。没有检查任何具体网页或运行产品，因此不支持已符合性结论。

重访触发：需作正式符合性判断、W3C 修订该准则、或拖动承担精确路径约束时。关联语法：[controls.md](../../../../../kit/design/interaction/controls.md)（`DWG-I-CONTROLS`）。

许可状态：已阅读 [WAI Material use policy](https://www.w3.org/WAI/about/using-wai-material/)；它说明通常可免费使用但需明确署名并链接，且一般不可修改，普通 WAI 材料遵循 W3C Document License。其内容支持在这里读写链接与自有摘要，但未明示允许将若干原文摘录另行保存成 source snapshot；因此未保存源文摘录。证据形态：W3C Understanding 全文，文字访问；未看图片（通过文字读取了图注）或运行示例。
