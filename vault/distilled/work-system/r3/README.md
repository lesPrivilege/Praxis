# Work System r3 增量提炼

本目录消费 `work-system-toolchain-20260919-r3.json` 的前 10 轮、20 条消息。该归档共 19 轮：前 10 轮是 r3 新增，后 9 轮是已在 r1/r2 登记的旧内容；本目录只登记新增部分。原始 JSON 仍在 [`vault/archive/chat/work-system-toolchain-20260919-r3.json`](../../../archive/chat/work-system-toolchain-20260919-r3.json) 备查。

## 阅读顺序

1. [`expert-kit-skill-tool.md`](expert-kit-skill-tool.md)：Expert、Kit、Skill、Tool、Model 的语义层级与 attention drift。
2. [`anti-depreciation.md`](anti-depreciation.md)：外部结构如何抗模型折旧，并沉淀 semantic execution trace。
3. [`praxis-agent.md`](praxis-agent.md)：Praxis 作为 Courtwork 第一个 managed Expert 的候选边界。
4. [`harness-boundaries.md`](harness-boundaries.md)：Profile/Bundle/Extension 与 fork 的候选分界；外部版本主张保持待核实。
5. [`environment-manifest.md`](environment-manifest.md)：fresh Mac 的 environment manifest、目录/data plane、数据库、secret handle 与 bootstrap contract。
6. [`agent-governance.md`](agent-governance.md)：账号、数据、模型路由、隐私、run ledger、quota/成本和 promotion 边界。
7. [`discovery-grammar.md`](discovery-grammar.md)：跨角色访谈的槽位、assertion type、分歧登记和 Universal Discovery Canvas。
8. [`review-gaps.md`](review-gaps.md)：成熟 kit 的横切缺口、项目生命周期、adoption、operations、closeout。
9. [`manifest.json`](manifest.json)：稳定 turn/item ID 与 20 条消息映射。

## 证据身份

- **用户明确意图**：用户要求抗折旧治理、Expert/Kit/Skill 层次、Praxis Expert、fresh Mac 环境、Agent 使用账本、隐私隔离、Discovery Grammar 和成熟度 review。
- **历史 assistant 方案**：Expert contract、Profile/DSH_HOME、五层 environment manifest、P0–P3、run ledger、Discovery Canvas 等均是历史回答提出的候选结构。
- **待验证事实**：对 DeepSeek Harness 上游版本、Profile/Plugin/GUI 能力、chezmoi/Homebrew/Home Manager、SQLite 修复及 Palantir/Anthropic 的外部主张，本轮不浏览；引用占位由其他流程登记。

本增量不实施 Courtwork、bootstrap、Harness fork、账号连接或自动化，也不把聊天中声称已有的环境源码/基础设施当作已实现事实。结构化 intake 见 [`../../../intake/work-system-increment-r3.json`](../../../intake/work-system-increment-r3.json)。
