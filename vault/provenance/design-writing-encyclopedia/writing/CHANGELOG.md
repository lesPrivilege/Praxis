# 写作来源记录

本文件保留检索范围、时间、读取媒介、修订缘由及覆盖缺口。不得把批次时间或执行者元数据放入 Kit 规则正文。

## 2026-10-11 · 首次直接研究

- 登记 6 个公共 URL，均通过 web 页面实际读取了登记的文字范围；来源卡分别记录精确 section/line locator。未保存网页副本、图像或运行时素材，未查看 Ant Design 页面示例图；Microsoft Learn 两页出现访问授权提示，只采用提示后仍可见的正文段落。
- DWW-001：Google guide about page，读取 Page Summary、reference hierarchy、break the rules、license notice。
- DWW-002–003：Microsoft Learn voice 与 global communications 页。页面出现需授权提示，但相应标题后的部分正文可读；不得据此推断隐藏章节或完整指南。页面显示最近更新日分别为 2022-10-18 与 2025-01-08。
- DWW-004–005：GOV.UK Design System 的 error message / error summary 页面。读取使用场景、运行方式、页面/字段错误关系及支持示例。只读静态页面，没有执行示例。
- DWW-006：Ant Design 中文“文案”页面，读取文字与词语表；Correct/Wrong 示例配图虽在页面中出现，但没有查看，卡片主张不依赖配图内容。页面正文含有具备 Ant 语境的规范词与文风取舍，不转成仓库的普适中文规则。
- 既有来源 `govuk-user-needs` 在本轮重新打开文字并读到用户研究、需要格式及验证章节；沿用 [原卡](../../documentation-practices/cards/govuk-user-needs.md)，不创建重复卡。
- 按上游来源明示，Google 网页内容标注 CC BY 4.0（代码样例另有许可）；未复用原文摘录，未另存许可文件。Microsoft、GOV.UK 和 Ant Design 页面/图例的内容授权未在本次逐项查明，状态为 unknown；不保存其源文或配图。
- 没有验证产品行为、真实服务的可用性、文案效果或本 Kit 的用户收益。Kit 示例全部是明确标作合成的原创材料。

## 2026-10-11 · Toulmin 教学来源与主张追溯增补

- 在 08:26 UTC 直接打开并阅读 [Purdue OWL 的 Toulmin Argument 页面](https://owl.purdue.edu/owl/general_writing/academic_writing/historical_perspectives_on_argumentation/toulmin_argument.html)：What is the Toulmin Method 部分行 28–52。只读文字，没有使用页面图示，也没有读 Stephen E. Toulmin 原著。页面版权提示限制转载，本批只保存原创摘要，不保存源文或摘录。
- 增加 DWW-007 卡和目录记录，定位 claim / grounds / warrant 及按需加入的 backing / qualifier / rebuttal；Kit 页面明确分开 Purdue 的教学解释与本仓库按任务综合出的结构。
- 给五篇 Kit 参考加稳定 `DWG-W-*` ID、`normal`（可选参考）状态以及直接到具体支撑卡的链接；没有扩展反 slop 或其它风格分类。
- 模型记账更正：此后续任务的 subagent 请求 `gpt-6-luna` 已获接受，但实际运行时遥测不可见，无法独立确认具体运行模型。前一 handoff 中的 `GPT-6.1-Sol` 陈述未经独立核实，不作为事实。

### 待补与重访

- 可补 Google 的具体 argument / audience / UI wording 条目，但本批的任务是判断、读者任务、错误恢复及语言边界，不重复已有结构卡。
- Microsoft 可见正文范围受限；引用其声调或 global communication 的主张前先复查授权状态和可见版本。
- Ant Design 的文案页面有图片示例，若后续判断需依赖图像对照，再单独查看和核实许可。
- 若要把 GOV.UK 的前端行为作为实现断言，另查实现代码与当前服务版本；本批证据只有官方组件指南文字。
- Kit 页面还未链接至 `kit/write/prose/README.md` 与 `kit/write/prose/genres/README.md`，待协调者整合导航后，再做消费走读。
