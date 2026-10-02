# Frontend design · 多来源消费入口

本目录按来源和任务组织前端、页面、图表与编排材料。每份记录把来源、实际消费、采纳/舍弃、实现坐标和验证状态分开；没有实现或验证证据的内容保持 candidate、partial 或未覆盖。这里是材料入口，不是 Design Kit 的第二份规范。

## 按任务进入

| 需要回答的问题 | 先读 | 当前材料与边界 |
|---|---|---|
| CW 的页面、图式和状态/证据关系怎样组织 | [CW consumption](cw-consumption.md) · [CW Pages reference index](cw-pages-reference-index.md) | 2026-09-23 有界只读召回；保留源提交、实现坐标和历史验证边界，不声称当前 HEAD 已重建 |
| Review surface、reader、差异和发布状态怎样表达 | [SE consumption](se-consumption.md) | 2026-09-23 Schema Engineering 定向召回；源 CSS/JS 和 QA 是参考素材，不是 Praxis 运行能力 |
| 长文、章节、卡片、图式和打印布局怎样取样 | [Career HTML reference index](career-html-reference-index.md) | 2026-09-23 career-kit 合成展示材料；只借结构、导航和打印线索，不复制案例事实或个人材料 |
| 解释、结构化和数据可视化方法从哪里来 | [Explanation / visualization upstream](explanation-visualization-index.md) | 三份固定版本原文快照及消费边界；未安装、未执行，许可证和 URL 状态以 provenance 为准 |
| 已看过的构图如何映射到实际任务 | [Composition anchors](composition-anchors.md) · [Disposition](disposition-20260923.md) | 历史截图和本地消费处置；不能当作当前页面视觉验收 |
| 查来源身份、hash、快照和统一资产索引 | [catalog.json](catalog.json) · [Intake](../../intake/README.md) · [Provenance](../../provenance/README.md) | 机器登记、逐批来源和快照边界分别保留 |

## 来源路线

### Courtwork（CW）

- [CW consumption](cw-consumption.md) 记录通用前端素材的来源 → 本地消费 → 采纳/拒绝 → 实现定位 → 验证状态，供后续 CW/SE 绘制任务查阅。
- [CW Pages reference index](cw-pages-reference-index.md) 记录 Pages/site 的定向图式、数据语义、布局行为和历史验收；不等于当前源仓库重建。
- CW 外部 URL 的来源卡见 [`../../provenance/cw-frontend-references/`](../../provenance/cw-frontend-references/)，6 条记录在该批消费中保持 `partial`。

### Schema Engineering（SE）

[SE consumption](se-consumption.md) 聚合 publication surface、reader controls、release QA、Practice/Index 以及 reader CSS/JS 的定向记录。可复用的是“当前状态、候选差异、证据、权限、后果和 review 结果的关系”；具体论文语义、外部产品能力和历史 QA 不自动进入 Praxis。外部 URL 登记见 [`../../provenance/se-frontend-references/`](../../provenance/se-frontend-references/)。

### Career-kit 展示 HTML

[Career HTML reference index](career-html-reference-index.md) 以 2026-09-23 的只读召回为边界，记录长文/八幕、章节 rail、图式样张、规则控制台、键盘和打印结构。合成案例文案、业务数字、项目名、简历和投递材料不在消费范围；原件和 hash 见对应 snapshot/intake 登记。

### 上游解释与可视化方法

[Explanation / visualization upstream](explanation-visualization-index.md) 记录 show-me、visual-explainer 和 data-visualization 三份固定版本原文，以及 Design Grammar Chat 中实际消费的位置。它提供来源语义和方法选择线索，不替代当前 Write/Design 决策；未取得的许可证、未快照的依赖和未核实的外部页面保持原状态。

## 消费边界

历史页面和源仓库记录可以说明“当时看到什么、哪条关系被取用、落在哪个任务”，不能证明 Praxis 当前页面已渲染、打印、适配窄屏、通过读屏或满足无障碍 conformance。外部 URL 是否 verified、partial 或 unavailable 由各自 provenance catalog 记录；本目录的链接可达不改变该状态。

需要把某条材料晋升为可重复的 Kit 规则时，回到 [Design 入口](../../../kit/design/README.md) 和治理文档，由项目决定建立唯一维护位置；不要在本目录复制 token、组件契约或 renderer 规范。新增材料先登记 intake、保存必要快照，再补本目录的消费记录。
