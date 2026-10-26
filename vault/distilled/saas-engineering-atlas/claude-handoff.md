# Claude 消费交接

目标是在既有 Praxis 内，把 SaaS 工程全景编订成一致的交互 HTML 教材。读者是能借 AI 搭界面的 vibe coder；需要进入陌生行业后认出对象、工作流、约束、权威与系统边界，选择成熟解法，完成小例题并知道下一步查什么。

## 最少输入

1. [全景入口](../../../projects/books/saas-engineering/README.md)与[阅读主线](../../../projects/books/saas-engineering/learning-path.md)：先读 [企业机制四章](../../../projects/books/saas-engineering/enterprise-mechanisms/README.md)，建立组织→界面→工作上下文与工具→实施的连接。全书沿“识题→解法→演算→验算→变式”。
2. [12 章计算与系统方法](../../../projects/books/saas-engineering/foundations/README.md)与其 18 个演算例；[题型、算法与栈索引](../../../projects/books/saas-engineering/problem-index.md)、[案例目录](../../../projects/books/saas-engineering/case-catalog.md)：先选主线例子，再按需展开行业。
3. [共同词表与读图约定](../../../projects/books/saas-engineering/semantics.md)、[迁移地图](../../../projects/books/saas-engineering/transfer-map.md)：保留哪些机制、哪些条件必须重查。
4. [来源与证据](../../provenance/saas-engineering-atlas/README.md)、[验证方法](validation.md)：来源事实、作者推理、合成政策分别消费。

Claude 承担写作、编订与可视化：先读一条完整路线建立讲法，再展开其余章节；不需逐条重新核查已审阅的来源和算例。证据侧车供发生语义改动、补充事实或遇到特定疑问时查阅。H01 的当前教材在 `packages/commercial-finance/H01.md`；根部 `example-h01.json` 是早期结构验证 fixture，不是另一个案例或第二份权威正文。

## 结构数据的读取方法

Vault 结构目录中的 [`case-index.json`](case-index.json) 是 33 例的稳定入口，给出正文与同名 topology 路径。每个案例 JSON 有 `nodes`、`edges`、`lifecycles`、`algorithm_ids`、`claim_ids` 和 `checks`。`identifiers.json` 定义 ID，`relation-types.json` 定义端点类型与方向。`depends_on` 指向前提；`derived_from` 指向来源，影响查询用反向邻接。生命周期描述对象状态变化，不能与请求、事件交接或现金流混画。

`transfer-map.json` 的 node 是 case，edge 是教学迁移。每条边有 `type/from/to/preserved_mechanism/precondition/changed_condition/counterexample/observable_check`，全部是教学推理；它不继承来源事实、运行权限或专业决定。`transfer-proposals.json` 保留其余建议及出处，可继续编辑或选择。

包内 `evidence.json` 保存原主张和读取记录。复核追加的 `provenance/repair-evidence.json` 与 `provenance/whole-book-repair-evidence.json` 保留新版本读取和模型澄清；原审阅与26项处置见 [复核记录](../../../docs/reviews/README.md)，原记录不覆盖。provenance 的 `catalog.json` 按 canonical URL 去重；`source-aliases.json` 让全部原 source ID 可解析；`claims.json` 保留全部主张、类别与限制；`reviews.json` 保留原始记录、读取日期和失败范围。同一 URL 的不同 claim、版本限制及失败记录不能互相覆盖。enterprise-mechanisms 的 `case-links.json` 连接33例并保留作者所读固定SHA；`reader_root` 与 `reader_path` 指向当前 Books。其 `examples.json` 保留两条工作链，实验指南明确本机 HTTP/SQLite 与真实 provider 的边界。

foundations 的 `curriculum.json` 以 `reader_root` 加章节 `path` 定位 Books，`examples.json` 保存输入、步骤与结果。全局 claims 保留作者原 `kind`，另以 `evidence_kind` 映射为 `source_fact/synthetic/inference`；`source-backed` 与 `synthetic-example` 的原类别不被抹去。

`source_claim_id` 是引用关系，未声明为完全同义的 claim 不应直接合并。

## 设计与编订自由

Claude 可以重写正文、调整主次和渐进展开，自由选择统一 UI、图形、交互、motion、技术栈与多代理工作方式。保留 case/object/claim/source ID、provider 名称、原语言术语、单位、条件和证据类别；语义变化记在消费项目中。避免为了统一外观把各行业的 release、hold、acceptance 或 completed 合成一种状态。

在现有 [场景模板](../../../templates/scenario/README.md)建立具体消费场景；从 [Design](../../../dsh-praxis/kit/design/README.md)、[Write / Publish](../../../dsh-praxis/kit/publish/html/README.md)与[Motion](../../../dsh-praxis/kit/publish/video/README.md)选择表达方法，按 [Demo 入口](../../../projects/README.md)记录运行边界。当前交付没有 HTML 实现，正文维护在 Books，证据与结构资产维护在 Vault。

## 覆盖与继续研究

编订基线、已解决问题和确实影响写作的未决项见 [整合验收](../../../docs/verification/saas-engineering-atlas-20261014.md)。案例、基础章与全书的三份独立复核均已接收，26项意见已完成修复；最终定点独立复查状态另由验收回执记录；这不增加 Claude 全量重审来源的任务。下一步研究从所选行业的对象身份、真实状态及批准权、接口版本和不确定结果查询能力开始，再补专业制度、持久化故障、容量与应用级验收。这些问题服务于读者将方法用到真实项目时的下一步探索；不把专业实施验证转成 Claude 重审整份稿件的任务。

验证命令与各层边界在 [验证方法](validation.md)。合成脚本成功不等于 provider、浏览器端到端、负载或 AI eval 已执行。公共仓库只接收原创泛化解释、合成数据和公共来源；真实用户数据、私密对话、凭据与签名地址不进入消费产物。

## 文字职责与最终成文

本轮成文使用 Praxis [Prose 原理](../../../dsh-praxis/kit/writing/principles.md)与[证据约定](../../../dsh-praxis/kit/writing/evidence.md)。解释正文承担完整推理，标题稳定概括学习问题，图内标签保持短而明确，图注补足独立读图所需条件，操作文字说明动作及确认结果；这些职责不共用一套机械句型。本稿保留对象、关系与计算语义，不预制整套界面微文案。

可视化改变了读者取得信息的方式后，Claude 仍是最终作者：可以让图承担一段解释，重写相邻正文和图注，调整篇章节奏。保留论证、条件、单位和证据身份即可，不必照搬现有段落块。来源层维持原语言与术语；中文译法与英文全称见 [术语索引](../../../projects/books/saas-engineering/terminology.md)，独立图中首次出现的缩写可从 `reader_term_ids` 取得同一解释，勿把译文回写成来源原话。

术语优先采用成熟生态已有的名称与解释习惯。请保留通用机制、标准/provider 定义与本书编订归纳之间的层次；不要因页面需要统一就重命名为一套新的行业语法，也不要把单一厂商的做法写成普遍共识。图形可统一表达方式，领域词的差异由显式映射保留。
