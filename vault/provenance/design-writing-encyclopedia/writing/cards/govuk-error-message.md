# DWW-004 · GOV.UK Design System — Error message

来源：[原始页面](https://design-system.service.gov.uk/components/error-message/) · 状态：`verified` · 实际读到页面文字与静态代码例。

## 内容摘要

该指南面向建设政府在线服务的团队。字段校验错误要说明哪里不符合要求和怎样修正；错误消息放在对应字段附近，并与问题关联。它要求不要清除填写内容，以便用户查看和更改以前的答案。它把用户不能自行处理的资格、权限和服务容量问题划出字段校验组件，建议另外提供问题解释与后续动作。

## 定位与支持的判断

- 开头说明，页面行 57–60：组件服务对象及错误文案的信息要求。
- “When not to use this component”，行 132–146：服务端/资格问题与可修复表单错误的边界。
- “How it works”，行 149–164：字段指向、保留输入、辅助技术错误标识和翻译提示。
- 页面含 HTML 和 Nunjucks 示例，已读取代码文字但未执行。

支持 [DWW-004-C1–C3](../catalog.json)。

## 可复用判断与边界

可用于区分“要求用户改输入”和“产品/服务自身不能继续”两种错误，避免责怪用户或要求其无效重试。具体颜色、aria 关系、消息位置和标准语句属于 GOV.UK 组件实现指导；其它产品应遵照自己的实现与无障碍约束。页面文字不证明运行时有正确聚焦、保留状态或屏幕阅读器行为；这些要另测。许可未核查，未保存源图或代码。

## 链接

- Kit 候选语义：[微文案与错误恢复](../../../../../dsh-praxis/kit/writing/genres/microcopy.md)、[多语言写作与本地化边界](../../../../../dsh-praxis/kit/writing/language/multilingual.md)。
- 与其页面级对应组件互补：[GOV.UK Error summary](govuk-error-summary.md)。
- 范围记录：[目录](../catalog.json)、[研究记录](../CHANGELOG.md)。
