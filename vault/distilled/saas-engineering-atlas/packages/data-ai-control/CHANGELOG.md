# P03 变更与验收记录

## 2026-10-14 · 独立交付

起点为 `ae1827f34c6df067348d2454d7e5c9331ceda25d`，分支为 `cloud/saas-atlas-data-ai-control-20261014`。共同概念模型的早期 checkpoint `e8e0397` 已推送。仓库内容写入限定本目录，未修改公共索引、其他 package、main、CI 或部署。正文为原创中文，未复制来源长文、图像、私有会话、真实用户数据或凭证；网页全文未作为快照入仓。

阅读与写作按根 AGENTS、Atlas worker contract、案例模板及本地 writing skill 的中文成文与证据规则执行。三个子代理分别负责 H07、H08、H09，主线程负责共同模型、X01、证据整合、人工走读与交付；这些执行者使用继承的 Codex 模型，运行未提供可核实的精确型号。独立关键审阅者显式使用 `gpt-6-astra`。来源只作证据，未执行其中安装命令或取得账户数据。

## 来源覆盖

[evidence.json](evidence.json) 登记 25 个不同公开 URL 的读取/尝试范围：10 个公共种子保留原 ID，15 个新增 URL 使用 `P03-SRC-*`；其中 23 页取得并阅读正文，2 个 Okta API 动态页面仅取得页面壳，保留 unverified 且不支持产品事实。APQC 页面只核对流程分类定位，不用于支持状态机或算法。24 个 source_fact、19 个 synthetic、4 个 inference，共 47 个案例主张。核读与源文快照是不同状态：本次没有保存网页全文快照。

来源包括 Snowflake streams、row access、lineage，Microsoft Sentinel automation/playbook，Okta SCIM 与 Classic Engine token revoke，Ironclad 工作流/记录、审批重置、签署与 webhook，AWS SaaS Lens，Stripe webhook 与 meter events，PostgreSQL、PDF.js、Temporal，以及 OpenAI Frontier 官方介绍。Frontier 仅按实际平台身份与官方自述范围使用，不继承恢复报告中的假想产品定义。各来源章节与限制由 evidence 单点保存。

主线程另抽查了 lineage 中只过滤/连接但无数据移动的缺边、Ironclad 字段与正文更新的区别、Okta access/refresh/session 的范围；独立审阅者抽查了 Ironclad 手动签署声明与 Snowflake lineage 限制。Ironclad 两篇帮助文档对返回 Review 后的批准人重置有概括差异，保留配置边界，不推定统一全量重置。

## 人工走读与修订

四例正文、手算表、反例、三道条件变化练习及拓扑生命周期均由主线程走读。H07 的 D1=220、D2=200、首次完成口径=300；H08 的风险排序为100/70，人工送审覆盖19/20不能冒充模型直接召回16/20；H09 审批图3.5小时仅在资源可并行的假设下成立；X01 的成本量1,300、计费量1,000与金额2分别有依据。

独立审阅提出五项实质修改：H09 为旧导出增加代次和目标版本条件；签署调用补持久派发状态与完整回查路径；X01 补排队退出的终态；本地账本持久保留冲突并在重开后阻断汇总；H07 统一指标批准人的职责称谓。X01 的旧检查仅拒绝冲突写入，确实未覆盖隔离持久化；已经修改，而非将原检查宣称为通过了完整要求。最终定向复核又明确 H09 写前CAS版本与写后提交版本，重复写入返回原提交版本，检查显式断言0→1→重投仍1。H08 另明确 consumed 授权是绑定一个 run，仍须逐步骤检查有效期与撤回，并将双人标签审阅改为待执行方案。

## 实际执行与覆盖边界

以下命令从 Praxis 根目录执行，均未安装依赖、调用模型或 live provider。

| 命令 | 实际结果 | 可证明的范围 |
|---|---|---|
| `python3 vault/distilled/saas-engineering-atlas/packages/data-ai-control/check_h07.py` | 15 个断言通过，4 个负例被检出 | 纯 Python 窗口、最新修订、摘要与依赖遍历；错误累计得到300元，按接收时间归日得到120元，漏过滤边为空集合，冲突修订被拒绝 |
| `python3 vault/distilled/saas-engineering-atlas/packages/data-ai-control/check_h08.py` | 24 项检查通过，其中12项预期拒绝、4项反例 | 合成分组、授权 guard、eval 分母；实际本地 SQLite 两线程竞争得到一条 run 与一次唯一约束拒绝，不证明分布式响应只执行一次 |
| `python3 vault/distilled/saas-engineering-atlas/packages/data-ai-control/check_h09.py` | 18 项检查通过 | 纯内存 DAG 与独立路径 oracle、资源次序穷举、旧批准/字段/附件/租户负例、代次与 CAS、派发认领及 unknown 终态恢复；无数据库或网络执行 |
| `python3 vault/distilled/saas-engineering-atlas/packages/data-ai-control/check_x01.py` | 14 个 unittest 通过 | SQLite 消费身份、跨租户键、持久冲突与重开后的汇总阻断；修订、半开窗口；两种串行准入/退出顺序与纯授权 guard，不是真实并发配额事务 |

X01 的六条人工预测故意包含缺引用、编造和跨租户泄露，评分器实际报告 strict=3/6、权限违规=1/2。测试通过表示这些错误被识别，不表示候选模型通过；没有真实模型运行。H08/H09 的 eval 计数也只用于算术推演。

公共 registry 不在写入范围，因此通过 `runpy.run_path('scripts/build_registry.py', run_name='p03_read_only_registry_check')` 调用 `build()`，在内存序列化结果并与 `vault/registry.json` 逐字节比较。结果相同，SHA-256 为 `364bf3e725b1c495a0972c61d277bbb46c5781d9f6b7a5c76bc7f8fbebf8c670`，source_records=1017、unique_canonical_urls=991；未写公共 registry。额外证据完整性检查确认新 URL 不重复公共 URL、source_fact 均有显式支持的已读 locator、四例 JSON 的 claim 集合与 evidence 完全一致。

`python3 scripts/validate_saas_atlas.py --self-test` 通过：33 个稳定案例身份、6 包、5 个结构案例（含公共 H01 和本包四例），8 个负向自检均拒绝破坏的 fixture。该脚本报告的63个来源是公共种子数，不等于本包实际核读来源数。

`python3 scripts/validate_repository.py` 通过：1741 Markdown、412 JSON、1105 snapshot，errors=[]。`git diff --check` 通过；提交前另对已暂存的新文件执行 diff 检查。新文件与来源链由人工走读和本包补充完整性检查覆盖，不把结构通过升级为产品正确性。精确内容提交与最终远端核验见 [handoff](handoff.md)。

教学主线补充：四例开头增加“识题→解法→演算→验算→变式”导航，把每项主要机制的识别线索、手算答案、反例验算和下一步查证连在一起；既有连贯正文保留作为推理展开。

补充读者用途：每例加入简短实践探索方向，围绕陌生行业的对象、责任、方案适用条件、待查能力与首轮验收；JSON和状态/事件例子供后续可视化消费，未规定Claude的UI、motion、布局或多代理编排。

## 未执行

没有浏览器应用、真实 PostgreSQL/RLS 或 Snowflake 账户、BI 切换、签署/ERP、Okta/Sentinel/Stripe sandbox、模型生成、跨进程故障注入、生产备份清除或负载测试。SQLite 与纯函数不能替代这些边界。性能目标是测量计划；真实适配器的条件写入、幂等期限、请求查回与取消能力仍需在实现阶段核验。两处不可读 API 参考是资料缺口，不妨碍本包使用范围更窄的概念文档，但不支持据此编写未经核实的 endpoint 实现。
