# DWW-005 · GOV.UK Design System — Error summary

来源：[原始页面](https://design-system.service.gov.uk/components/error-summary/) · 状态：`verified` · 实际读到页面文字和静态示例。

## 内容摘要

GOV.UK 要求表单有验证错误时，在页面顶部提供 error summary，同时为每个错误答案给出字段旁的具体 error message。摘要将用户带回具体字段，同一问题在摘要和字段旁用一致文案，并要求把键盘焦点移动到摘要。摘要不是让错误文字重复堆叠，而是服务页面级发现和字段级修复两个位置。

## 定位与支持的判断

- “When to use this component”，页面行 105–107：有验证错误时使用摘要。
- “How it works”，行 108–120：键盘焦点、摘要标题、错误链接与文字一致。
- “Linking from the error summary to each answer”，行 165–169：摘要错误必须链接到相关答案。
- 页面含 HTML/Nunjucks 示范，已读代码文本但未运行。

支持 [DWW-005-C1–C2](../catalog.json)。

## 可复用判断与边界

错误数量多或读者需在页面中定位时，提示内容与恢复定位是两个不同任务；文案的一致性帮助用户把摘要项对应到字段。GOV.UK 给出的“总是显示”、焦点和 `href` 要求是特定组件指导。该页面不足以证明其它运行时、读屏或键盘实现同样工作；需针对目标环境验证。许可未核查。

## 链接

- Kit 候选语义：[微文案与错误恢复](../../../../../dsh-praxis/kit/writing/genres/microcopy.md)。
- 配对来源：[GOV.UK Error message](govuk-error-message.md)。
- 范围记录：[目录](../catalog.json)、[研究记录](../CHANGELOG.md)。
