# 来源

访问与核对日期：2026-09-23。法律条文和判决仅用于辨认题中出现的概念（如竞业限制补偿、可保护利益、50%规则的不同含义），不构成法律意见，也不覆盖新加坡、德国以外法域或本题合同的完整适用判断。

## Q1 上下文与缓存

| 来源 | 发布方 | 类型 | 支持的内容 |
|---|---|---|---|
| [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Anthropic | 官方工程文章 | 按需检索与结构化笔记供给 |
| [Claude Code — How Claude Code uses prompt caching](https://code.claude.com/docs/en/prompt-caching) | Anthropic（Claude Code） | 官方文档 | 缓存按前缀匹配，改动即失效 |
| [OpenAI — Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) | OpenAI | 官方文档 | 按需发现的工具追加在末尾 |
| [Anthropic — Tool search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) | Anthropic | 官方文档 | 延迟加载的定义不进入初始上下文 |
| [OpenAI — Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) | OpenAI | 官方文档 | 追加工具可保留旧前缀缓存 |
| [Model Context Protocol — The 2026-07-28 Specification](https://blog.modelcontextprotocol.io/posts/2026-07-28/) | Model Context Protocol | 官方工程文章 | 目录变更通知不等于已接通 |
| [OpenAI — Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) | OpenAI | 官方文档 | 持续评估捕捉配置变化 |

## Q2 Reasoning effort 与成本

| 来源 | 发布方 | 类型 | 支持的内容 |
|---|---|---|---|
| [OpenAI — Reasoning models](https://developers.openai.com/api/docs/guides/reasoning) | OpenAI | 官方文档 | effort是速度、成本与质量的取舍 |
| [jev-harness-lab — Technical evaluation report](https://github.com/Aitejiu/jev-harness-lab/blob/main/docs/REPORT.md) | Aitejiu | 研究代码仓库 | 候选召回限制排序的上限 |
| [Anthropic — Steering thinking and cost](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost) | Anthropic | 官方文档 | 节点成本需累加到任务级 |
| [OpenAI — Latency optimization](https://developers.openai.com/api/docs/guides/latency-optimization) | OpenAI | 官方文档 | 减少请求并改用确定性逻辑 |
| [Claude Code — How Claude Code uses prompt caching](https://code.claude.com/docs/en/prompt-caching) | Anthropic（Claude Code） | 官方文档 | 切换effort可能导致缓存重算 |
| [OpenAI — Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) | OpenAI | 官方文档 | 评估须同时衡量质量、延迟与成本 |

## Q3 权限与恢复

| 来源 | 发布方 | 类型 | 支持的内容 |
|---|---|---|---|
| [OpenAI — Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) | OpenAI | 官方文档 | 敏感环节应在执行前确认 |
| [OpenAI — Guardrails and human review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals) | OpenAI | 官方文档 | 执行前检查对象、参数与授权窗口 |
| [Anthropic — How we contain Claude across products](https://www.anthropic.com/engineering/how-we-contain-claude) | Anthropic | 官方工程文章 | 按访问范围与凭证边界判断风险 |
| [AWS Builders' Library — Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) | Amazon Web Services | 官方工程文章 | 同一请求标识才能安全重试 |
| [RFC 5322 — Internet Message Format](https://www.rfc-editor.org/rfc/rfc5322#section-3.6.4) | IETF | 技术标准 | Message-ID不提供去重保证 |
| [OSWorld 2.0 — Benchmarking computer-use agents on long-horizon real-world tasks](https://osworld-v2.xlang.ai/) | OSWorld | 研究基准 | 任务设计可借用，权限须另行验收 |
| [OpenAI — Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) | OpenAI | 官方文档 | 生产验收需保留真实任务回归 |

## Q4 概率与风险

| 来源 | 发布方 | 类型 | 支持的内容 |
|---|---|---|---|
| [TypeSafe — Score](https://docs.typesafe.ai/primitives/score.md) | TypeSafe | 官方文档 | 分数为等级概率加权，可落在两级之间 |
| [TypeSafe — Confidence](https://docs.typesafe.ai/confidence.md) | TypeSafe | 官方文档 | confidence只反映分布集中度 |
| [TypeSafe — Jev 1.13 jaggedness](https://docs.typesafe.ai/model-jaggedness/jev-1.13.md) | TypeSafe | 官方文档 | 数字、日期与对抗内容需专项覆盖 |
| [TypeSafe — Self-consistency: choices](https://docs.typesafe.ai/cookbooks/consistency_choice_cookbook.md) | TypeSafe | 官方文档 | 重复一致率不等于结果正确 |
| [Pydantic AI — TypeSafe (Jev)](https://pydantic.dev/docs/ai/models/typesafe/) | Pydantic | 官方文档 | 取整等级需核对原始分数字段 |
| [Pydantic AI — models.typesafe API](https://pydantic.dev/docs/ai/api/models/typesafe/) | Pydantic | 官方文档 | latest别名随发布变动，需记录实际版本 |

## Q5 修改与生效

| 来源 | 发布方 | 类型 | 支持的内容 |
|---|---|---|---|
| [Google Research — RRSI: Regularized Recursive Self-Improvement of Agent Harnesses](https://github.com/google-research/rrsi) | Google Research | 研究代码仓库 | 候选保留变更历史，评估后再选用 |
| [RSI-Exam — Benchmarking Recursive Self-Improvement through Executable Research](https://rsi-exam.ai/) | RSI-Exam project | 研究基准 | 开发与隐藏评测分离，冻结后验收 |
| [Weco AIDE² research report](https://www.weco.ai/blog/first-evidence-of-recursive-self-improvement) | Weco AI | 研究论文或预印本 | 任务优化不等于改进能力提升 |
| [Anthropic — Natural emergent misalignment from reward hacking](https://www.anthropic.com/research/emergent-misalignment-reward-hacking) | Anthropic | 研究论文或预印本 | 奖励黑客可能引发 misalignment |
| [Singapore Court of Appeal — Man Financial v Wong Bark Chuan David [2007] SGCA 53](https://www.elitigation.sg/gd/s/2007_SGCA_53) | Singapore Judiciary eLitigation | 判决 | 竞业限制须辨别可保护利益 |
| [Germany — Handelsgesetzbuch §74](https://www.gesetze-im-internet.de/hgb/__74.html) | Gesetze im Internet | 法律条文 | 补偿下限为最后合同给付的一半 |
| [Germany — Handelsgesetzbuch §74a](https://www.gesetze-im-internet.de/hgb/__74a.html) | Gesetze im Internet | 法律条文 | 限制期不得超过离职后两年 |
| [Germany — Handelsgesetzbuch §74b](https://www.gesetze-im-internet.de/hgb/__74b.html) | Gesetze im Internet | 法律条文 | 浮动给付按近三年平均计算 |
| [Germany — Gewerbeordnung §110](https://www.gesetze-im-internet.de/gewo/__110.html) | Gesetze im Internet | 法律条文 | 雇佣关系相应适用HGB竞业条款 |
| [US Treasury OFAC — Entities Owned by Blocked Persons (50 Percent Rule)](https://ofac.treasury.gov/faqs/topic/1521) | U.S. Department of the Treasury, OFAC | 监管机关说明 | 50%所有权规则不是补偿系数 |
