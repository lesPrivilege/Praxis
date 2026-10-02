# Kit 体例与参考消费验收 · 2026-09-27

基线：`17d44bd397bbfa2914c6ddeec4027192dfa433a5`，在已有未提交工作上做增量。实际分工：Luna Max 执行对话读取、逐消息登记与参考提炼；Astra/main 执行架构裁决、关键规范编订与最终验收。裁决见 [ADR-015](../decisions/015-kit-editorial-contract.md)。

## 改动范围

- [文档结构契约](../architecture/documentation.md)：Kit 体例、活跃条目准入、约束强度、distilled 语义和反馈退出。
- [Design 入口](../../kit/design/README.md)、[语法](../../kit/design/grammar.md)与[参考索引](../../kit/design/references.md)：按任务阅读、通用判断和带范围的参考消费。
- [答卷历史 profile](../../vault/distilled/ai-capability-assessment/design-profile-20260924.md)：保留原入口中的具体样式与交付选择，未修改既有答卷产物。
- [入账规范](../governance/intake.md)：原 Chat、泛化内容和公开披露的边界；未实现存储或 Git 隔离。
- [Reporting grammar](../../kit/reporting/grammar.md)：展项中 description、图注、来源和方法说明的职责；[Demo 准入](../../demos/README.md)补足材料来路。

本轮保留先前 Agent Runtime、AI 答卷呈现与 motion 的工作树修改。最终仓库检查覆盖整个当前工作树，不能把其全部差异归于本轮。

## 来源覆盖

两份指定 Chat 均由工具返回 5 轮/10 消息，`hasMore=false`，合计 10 轮/20 消息。附件条目为空。归档是工具可见导出，不声称网页附件或隐藏来源完整；具体消息 ID、提炼映射与 SHA-256 见 [Opus intake](../../vault/intake/opus-remotion-video-20260927.json) 与 [Design intake](../../vault/intake/design-grammar-20260927.json)。

Design Grammar 中 7 个引用占位缺少原始 URL，保留 `missing-original`；新查官方材料采用 supplemental 身份，不据此改写原引用。原 Chat 的模型名、渲染器与标准现行性说法均不作为本次已核实事实。Opus Chat 的一处显式地址 `https://github.com/...` 是示意占位，已另记 unavailable，不作为真实仓库来源。

[两份对话的主题提炼](../../vault/distilled/write-design-grammar/README.md)保留逐主题来源与候选；[设计参考语义提炼](../../vault/distilled/design-reference-semantics/README.md)覆盖 35 条既有设计参考及 11 条既有 URL 卡片，采用原登记窗口，本轮未重新联网核验这些旧条目。

[结构写作补充](../../vault/distilled/writing-structure-20260927/README.md)另读取 5 个官方页面（Google 标题、列表、表格、段落结构；Microsoft 扫描性）。每 URL 的主张、读取范围与限制见 [catalog](../../vault/provenance/writing-structure-20260927/catalog.json)。Microsoft 页面带有授权提示，仅采用工具实际返回的可见正文；未推断受限部分。5 页均未保存原网页及呈现依赖。

## 导航与反例走读

本轮由 main 逐项阅读入口与目标页，检查输入、产物、判断及下一步；这是维护走读，不是真实跨项目 dogfooding。

| 任务 / 反例 | 实际路径与结果 |
|---|---|
| 新任务需要内容与图表设计 | Kit → Design → grammar → references；可先按读者与关系决定表达，再查依据 |
| 需要复用答卷的冷色、240ms 与 A4 参数 | Design → 历史 profile；明确限定到当时答卷，未作为通用禁令 |
| 有新参考但只有 Chat 转引 | 体例契约 → 入账 → 对应提炼；原引用缺失、补充来源与项目推断分别记录 |
| 报告图表缺少解释或来源 | Reporting → grammar 内容结构；分别找到引介、标注、图注、source 与 method 的职责，并保留答卷正文/index 特例 |
| 一条规则未来反复被绕过 | 体例契约 → evolution；记录反例、复核必要性并保留替代与历史证据 |
| 要制作视频 | Design grammar 说明界面反馈与视频的控制、节奏不同；不从 240ms 推导视频规则，也不宣称已有 Motion 实现 |
| 需要对外披露原 Chat | intake 明确泛化与披露边界；本地可读不等于允许上传，当前未实施自动隔离 |

## 验证结果

已运行 `build_chat_inventory.py`、`build_registry.py`、`build_snapshot_manifest.py` 与 `python3 scripts/validate_repository.py`。本轮新增消息与引用均已接入生成索引；登记一致性、来源卡、消息覆盖和快照 hash 未报错。`git diff --check` 通过。

全库验证仍为 **fail**：40 处本地链接指向既有工作树中已删除的 `rendered/answer.html` 或 `answer.pdf`。对应的新命名 HTML/PDF 在开工时已存在，本轮未改答卷命名、渲染器或那些历史引用。没有为取得绿灯恢复旧产物、覆盖已有修改或放宽验证器。完整输出见 [机器回执](kit-editorial-review-20260927-result.json)。

最后检查覆盖 112 条消息、326 条来源记录、212 个引用映射和 622 个快照；除上述答卷断链外无其他验证错误。本轮自身曾出现重复引用导入和示意 URL 未登记，已修正后重跑。

## 未核实与未覆盖

外部来源只对本轮说明的读取范围负责；没有复验所有既有来源、原项目当前版本或实际 UI。未保存的原网页及其字体、图片、脚本依赖不具备 renderer-complete 证据。GB/T、SI 等原引用缺口、历史目录去重、原 Chat 的物理隔离与真实跨项目使用效果保留为后续范围。未安装依赖、发布或创建远端。
