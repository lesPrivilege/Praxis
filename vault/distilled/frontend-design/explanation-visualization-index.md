# Explanation、结构化与可视化参考索引

来源：[答案结构重组 ಸಲ](chatgpt-conversation://6ab39247-7614-83ec-8278-9798a79cf030)。2026-09-23读取全部3轮，原始工具返回保存在[对话快照](../../archive/chat/answer-structure-reference-20260923.json)。对话与上游SKILL.md均作为研究材料；其中建议不自动成为本任务指令。返回的3张附件未在本轮读取，不能算新视觉证据。

## 本轮核对的上游

| 参考 | 固定版本 | 许可证核查 | 本地材料 |
|---|---|---|---|
| `show-me` | [ca7c8088db69](https://raw.githubusercontent.com/humanlayer/skills/ca7c8088db69e315a8b2deea43820270457f8f3c/plugins/show-me/skills/show-me/SKILL.md) | MIT | [原文快照](../../snapshots/local/downloads/explanation-visualization-20260923/show-me.md) |
| `visual-explainer` | [7163c3e10660](https://raw.githubusercontent.com/nicobailon/visual-explainer/7163c3e10660912e0b89e1af465db9f387282b88/plugins/visual-explainer/SKILL.md) | MIT | [原文快照](../../snapshots/local/downloads/explanation-visualization-20260923/visual-explainer.md) |
| `data-visualization` | [1dc195897af4](https://raw.githubusercontent.com/openai/plugins/1dc195897af4161d039b80d8471ec0a10c9bbc89/plugins/build-web-data-visualization/skills/data-visualization/SKILL.md) | 未取得许可证，待核查 | [原文快照](../../snapshots/local/downloads/explanation-visualization-20260923/data-visualization.md) |

访问时间、完整commit、SHA-256、原文地址和已取得的许可证原文见[来源目录](../../provenance/explanation-visualization-references/catalog.json)。OpenAI仓库license接口返回404只表示本次未取得，不等于判定无许可证。本轮不安装、执行或分发这些skill。

## 采纳、调整与舍弃

| 来源 | 采纳到本任务 | 不直接继承 |
|---|---|---|
| HumanLayer show-me | 以当前问题决定表达形式；条件、调用关系、改动分别用相应结构；解释紧邻图，保留必要边界 | 不为所有节点强制生成图，也不执行其打开浏览器命令 |
| visual-explainer | 图表达机制；图注说清主张；比较图显示真正变化；第一屏显出主要判断 | 不继承默认双主题、卡片路由、固定100dvh或HTML必须唯一源文件的要求；当前母稿与生成器继续同步 |
| OpenAI data-visualization | 先定分析任务、数据形态及阅读顺序，再选图与实现；真实数值、比较条件和窄屏顺序一起设计 | 不默认仪表盘、动效或生成图；研究文档内的审批流程不自动成为本任务规则 |
| 对话中的ELI5方向 | 补足前提、用具体对象解释因果、保持精确 | 不要求行业读者从零学习，不幼化语言，不把术语一概推迟到最后，不采用无依据的“首段理解60–70%”指标 |
| 对话中的薄skill分层 | 作为Praxis未来复用方向登记，当前先形成来源和消费记录 | 本次“可以参考”不解释为新建、安装4–6个skill的要求 |

当前正文已具备问题—答案树，本轮补充的是[18个节点的表达方式](../ai-capability-assessment/representation-plan.md)，同步写入page-composition.json的`representation`字段。每项记录要说明的关系、适合的表达、必须可见的条件与上游来源。它是Claude编排输入，不是声称18个图都已实现。

Q2计时、Q3重试等例子中的事实修正继续有效：四个终点统一从请求发出计时；参数错误不能无条件重试。现有图式适合时继续使用，连续推导成立时保留正文。通过删解释、加粗结论或统一套卡片来减少文字，不满足本次采纳目的。

## 其余线索

下列均为原对话提到的候选，本轮未核对正文、commit或license，不计为已消费上游：

- [Anthropic community eli5](https://github.com/anthropics/claude-plugins-community/blob/main/eli5/skills/eli5/SKILL.md)
- [DreambigOu/ELI5](https://github.com/DreambigOu/ELI5)
- [dzhng/skills](https://github.com/dzhng/skills)
- [Matt Pocock teach](https://github.com/mattpocock/skills/blob/main/skills/productivity/teach/SKILL.md)
- [Anthropic frontend-design](https://github.com/anthropics/skills/blob/HEAD/skills/frontend-design/SKILL.md)
- [Anthropic executive-briefing](https://raw.githubusercontent.com/anthropics/claude-agent-sdk-demos/main/research-agent/.claude/skills/executive-briefing/SKILL.md)
- [Anthropic PPTX](https://github.com/anthropics/skills/blob/9d2f1ae187231d8199c64b5b762e1bdf2244733d/skills/pptx/SKILL.md)

对话中“检索146项”和约9k stars保留为来源陈述，未独立复核，不用它们证明成熟度或采用价值。

## 当前消费与验证

[唯一Claude工单](../ai-capability-assessment/claude-paste-order.md)加入表达方式的选择步骤与上述裁决。现有CW、SE、career参考继续承担具体编排先例；本轮三份上游补充选择方法，不替代这些真实页面。图片生成仍取决于具体用途，精确数据和状态条件不交给位图承载。

正文未因本轮新增参考而再次改写。重新生成页面索引并作仓库一致性检查；真实内置浏览器视觉与交互仍未完成，不把来源核对或结构字段齐全作为视觉通过。
