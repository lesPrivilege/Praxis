# Design Writing Encyclopedia · 写作来源

本目录收录直接读取的外部写作与界面文案来源。机器登记见 [`catalog.json`](catalog.json)，每个 URL 的来源卡说明实际看到的范围、可支持的判断、适用边界和 Kit 对应页。历史和重访记录见 [`CHANGELOG.md`](CHANGELOG.md)。没有保存源网页副本；离线阅读依赖卡片摘要与来源定位。

来源 ID 前缀 `DWW` 表示写作来源。当前 7 个 URL 分别覆盖 Purdue OWL 的 Toulmin 教学说明、Google 开发者文档编辑优先级、Microsoft 品牌语气与全球沟通、GOV.UK 表单错误恢复组件，以及 Ant Design 的中文界面文案。来源有各自服务对象，不能压成单一写作风格。GOV.UK 的用户需要页面已在 `documentation-practices` 登记；复读后仍使用原卡，不在此复制。

## 来源卡

- [DWW-001 · Google developer documentation style guide — About this guide](cards/google-style-guide-about.md)：项目规则优先，风格指导可为读者清晰度让步。
- [DWW-002 · Microsoft Style Guide — Microsoft's brand voice](cards/microsoft-brand-voice.md)：品牌 voice 稳定、tone 随语境和客户状态改变。
- [DWW-003 · Microsoft Style Guide — Global communications](cards/microsoft-global-communications.md)：translation 与 localization 的范围差异。
- [DWW-004 · GOV.UK Design System — Error message](cards/govuk-error-message.md)：字段验证错误说明问题和修正方式，并区分服务故障。
- [DWW-005 · GOV.UK Design System — Error summary](cards/govuk-error-summary.md)：表单错误摘要与字段错误之间的对应关系和键盘焦点。
- [DWW-006 · Ant Design — 文案](cards/ant-design-copywriting-zh.md)：中文界面文案中的立足点、术语一致、状态错误与语气判断。
- [DWW-007 · Purdue OWL — Toulmin Argument](cards/purdue-toulmin-method.md)：claim / grounds / warrant 核心及 backing / qualifier / rebuttal 的可选位置；是教学性二手解释，不是 Toulmin 原著。

GOV.UK 的“Learning about users and their needs”重读定位与记录见 [既有用户需要卡](../../documentation-practices/cards/govuk-user-needs.md)，不重复登记。它用于 audience 页面，不是新的 DWW 来源。

## 快照与证据范围

没有保存网页快照或源站素材；`vault/snapshots/design-writing-encyclopedia/writing/README.md` 只说明本目录的快照边界。Purdue OWL 读取的是其 Toulmin 教学页文字，不是 Toulmin 原著。Google 读取的是页面可见文字；Microsoft Learn 页面先显示授权提示，仅登记该提示之后公开呈现的可见段落，不推测隐藏内容；Ant Design 中文页面读取了文字，页面示范配图没有查看。没有执行产品交互，也没有验证 Kit 消费结果或用户效果。
