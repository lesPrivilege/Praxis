# SaaS 工程全景 · 研究记录

## 2026-10-14 · Phase-one checkpoint

- 基线：从远端 `main` 的 `10f87cd17baaf27214be2f51410c795b7a2b8995` 创建 `cloud/saas-engineering-atlas-20261014`。只交付研究 checkpoint，后续研究、整合与终审由父线程以 fresh task 派发。
- 实际执行：Codex 主代理完成架构、有限公开源读取、合成示例与结构校验。运行时未提供可核实的精确模型 ID；没有启动六个后续 worker，不冒称采用了特定子模型。
- 输入边界：恢复目录报告 33 cases、63 sources、383 terms（170 anchored / 213 unverified）、36 relations、18 transfers；历史静态 hash/record count 据报已查，执行未复现。本轮只据目录恢复 33 个 case 身份及 63 个公共 URL，不导入或宣称复核旧术语、关系、transfer 原始记录。
- Library 的 ZIP 已解析到文件元数据，支持的 materialization 下载步骤返回 `download failed`。未取得本地 ZIP 字节，未解压、阅读、复核其 hash 或执行其中实现。此失败没有阻断已授权的目录级架构工作；私人标识、访问 URL 和原报告未进入仓库。
- 公开源读取：4 个原 seed URL 通过 web 文本读取并局部核对。STRIPE_INV：Invoice lifecycle / Draft / Open；STRIPE_WEBHOOK：handler 验签要求、Event ordering、Handle duplicate events、Handle events asynchronously；STRIPE_REV：Licensed subscriptions / Subscription cancellations / Standalone invoices；SAAS_LENS：General design principles 中 SaaS business strategy 段。浏览返回文本，不是原网页运行或 provider API 验证。
- 来源状态：4 verified（仅上述局部主张），59 unverified。canonical URL 暂与 seed URL 相同，未逐个解析 redirect。63 条保留独立 ID；`SIEMENS_AI` 是尚未绑定单例的补充种子。没有新增市场排名或继承假想 Frontier 定义。
- 新结构：8 个 node types、13 个 typed relation types、8 个算法家族及 8 个教学定义。这些是 checkpoint 的原创契约，数量不对应也不替代旧 36 relations / 383 terms。没有构造旧记录的虚假锚点。
- 合成示例：H01 的 12 nodes、20 edges、3 个对象生命周期、8 个检查定义；固定金额/区间手算可复核。它只取部分 invoice 转换，不宣称 provider 完整状态机或财务政策。
- 教材组织：共同企业图景 → 状态与权威 → 交接 → 计算 → 失败 → 专业责任 → 跨组织闭环；增加四道条件变化题及短答案，worker 每例至少两题，保留迁移前提和反例。
- 版权与公开边界：仅原创中文解释、synthetic 对象及公共 primary-source citations；没有复制第三方报告、网页正文、截图、原始会话或个人材料。网页与原 ZIP 均无本地快照；文本可离线阅读，外部资料不能称离线自足。
- 仓库 fit：研究进 `vault/distilled`、来源进 `vault/provenance`、范围进 `vault/intake`、回执进 `docs/verification`；不改 Kit 权威规则，不新增一级主题。`.agents/skills` 在所选工作区与仓库中不存在；读取了根 AGENTS、维护文档及唯一相关 `.claude/skills/writing/SKILL.md`。

结构检查与实际输出见 [验收回执](../../../docs/verification/saas-engineering-atlas-20261014.md)。后续来源或运行结果以新记录追加，不把本次读取变成以后时点的事实保证。

## 2026-10-14 · 六包整合与 Books 入口

按六个精确最终 SHA 合并，保留33例与 provider 名称。来源投影按 canonical URL 汇聚，原始种子记录移入 seed-catalog、原始 reviews 和 claims 保留编辑来源；未把同URL不同范围的主张合成更强结论。三份公开编订流程参考由整合者直接读到正文，范围见 editorial-evidence。

用户增补 Books 目标后，49页教材正文移到 books/saas-engineering，来源与结构资产留在 Vault；相对链接、case-index、transfer图、registry与验证器同步调整。早期示范仍为fixture，不计为新案例。新增题型/方案/算法/栈索引、共同术语与42条精选迁移；92条原建议保留位置。

全部15个案例Python入口通过，报告269项局部合成检查；代表阅读片段、复算、检查输出及待接收输入见 docs/verification/saas-engineering-atlas-20261014.md。未触发CI、部署或main合并。

## Foundations integration · 2026-10-14

Merged exact author commit `ee597ceaa3675f818746c6122353858872af17e4`. Moved14 teaching pages into Books, preserved raw evidence and local curriculum/example identities, and adapted reader routes without weakening coverage checks. All17 delivered Python entry points passed; foundations reports18 examples,18,462 comparison scenarios and18 rejected mutations. Shared catalog now has188 canonical URLs and193 original source identities. Enterprise mechanisms and independent final reviews remain pending.
