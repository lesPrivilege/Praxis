# 法律科技产品自然版图与证据可得性

采集日期：2026-10-28（UTC）  
方法：Exa 五个检索角度、21 次查询，`sources_reviewed = 203`（各次 `numResults` 之和）；结果先按 URL 与产品实体去重，再按对象/状态证据、商业信息和机制差异筛选。结构化索引保留 42 个去重后的高信号 URL。无云端交互式浏览器；所有页面均为公开网页的间接观察，不是登录后实测。

## 结论先行

公开证据最强的产品往往有三种“可见骨架”：帮助中心公开对象与状态（Ironclad、Clio、Everlaw、Juro）、内容数据库公开来源/引证链（vLex、Westlaw/CoCounsel、Lexis+、北大法宝），或工作台公开管理/权限面（Harvey、Legora）。只有营销首页的 AI-native 产品容易说明“能做什么”，却不足以证明接受/拒绝、撤销、版本、失败和权限等状态。

建议进入深描的 12 个代表是：**vLex Vincent、CoCounsel/Westlaw、Lexis+ with Protégé、Harvey、Legora、Luminance、Ironclad、Juro、Clio、Everlaw、RelativityOne、北大法宝**。若最终只做 10 个，优先保留前 10 个；若希望加强中国与合同管理，则用北大法宝替换证据较弱的 Legora，并保留 Alpha 为广索引/局部深描。

## 六个工作域的自然边界

| 工作域 | 主业务对象 | 主状态主干 | 购买者 | 高信号证据形态 |
|---|---|---|---|---|
| 法律研究与引用核验 | question、jurisdiction、authority、memo、citation | 提问→检索中→候选权威→调整权威集→生成/再生→原文核验→导出 | 律所知识负责人、律师、法学院/公共机构 | 帮助文档能显示权威列表、来源链接、效力信号与导出 |
| 合同审阅/redlining/Playbook | document、clause、position、rule、redline、exception | 载入→识别条款→对照规则→风险/偏离→候选文本→接受/拒绝→例外升级 | 法务、合同团队、业务请求者 | Word/编辑器演示、Playbook 规则、逐条建议与审阅周期 |
| CLM/审批签署 | request、workflow、agreement、approval、signature packet、record、obligation | intake→创建→review/approve→sign→archive→renew/obligation | GC、Legal Ops、采购、销售运营、财务 | Workflow Designer、条件路由、权限、repository、定价/实施 |
| Matter/case 管理 | contact、matter/case、task、document、time/expense、bill、client portal | intake→matter 开立→任务/文档→计时费用→账单审批→支付/结案 | 律所管理合伙人、运营、律师 | 帮助中心能下钻 matter、账单状态与 portal 分享 |
| 诉讼证据/eDiscovery | corpus、document、code、batch、review assignment、production、story | ingest/process→搜索→分批审阅→coding/redaction→QC→production→案情构建 | 诉讼团队、eDiscovery 负责人、政府/企业调查团队 | review window、batch、权限、可撤销、任务进度、按托管量计费 |
| 知识/drafting/客户协作 | workspace/vault、knowledge source、thread、draft、template、shared artifact | 选择来源/材料→生成→编辑→引用回溯→保存为模板/工作流→分享/权限→历史 | 律所创新/知识团队、GC、业务客户 | 导航/Library/Vault/History、模板权限、Word 插件、客户 portal |

## 分层索引

### A 级：适合完整深描（公开证据能覆盖对象、流程与至少一项商业/治理边界）

| 产品 | 地区/形态 | 主要任务与购买者 | 差异机制 | 证据入口 | 商业信息 | 未知 |
|---|---|---|---|---|---|---|
| vLex Vincent | 欧美；内容订阅 + AI | 研究、引用核验、Word 内文书增强；律所/研究机构 | authority 侧栏可实时查看；可删减权威集并再生 memo；Word 内负面处理提示 | [研究问题流程](https://support.vlex.com/vincent-by-vlex/vincent/core-workflows/ask-a-research-question)、[Word add-in](https://support.vlex.com/vlex-library/vlex-library-home/workflows-and-productivity-tools/how-to-use-the-vlex-for-word-add-in) | 内容订阅与产品套餐需另核价 | 登录后具体权限、失败恢复、版本历史 |
| CoCounsel / Westlaw | 美国；内容平台 + AI 工作流 | 深度研究、引用/引文核验、draft；律所/法务 | 研究任务有进度/百分比与 cited report；Word 中逐条 reasoning、tracked revisions 接受/拒绝 | [CoCounsel Legal MCP](https://legal-mcp.thomsonreuters.com/docs/connector-guide)、[引用核验培训](https://training.thomsonreuters.com/media/How+to+verify+authority+in+a+draft+brief/1_t5faxrhc/384481072) | Westlaw/CoCounsel 内容与软件组合、通常报价制 | 套餐边界、登录后全导航与失败态 |
| Lexis+ with Protégé | 美国；内容平台 + AI | 研究、策略、上传材料、draft；律所/法务 | Shepard's 信号核验回答中的法律引证；Source Link 定位上传文件的具体支撑段落 | [研究产品页](https://www.lexisnexis.com/en-us/products/lexis-plus-protege/legal-research.page)、[Source Link](https://www.lexisnexis.com/community/insights/legal/b/product-features/posts/3-ways-the-new-source-link-feature-in-lexisnexis-protege-builds-trust-in-legal-ai) | 内容授权 + AI 套餐，公开精确定价未发现 | Source Link 的具体打开/返回状态、权限继承 |
| Harvey | 欧美；AI-native 工作台 | assistant、Vault、Review Tables、agents/workflows、合同；大型律所/企业法务 | 单一工作台连接 thread、Vault、Review Table、Library、Workflow Agent；管理员审批/发布 agents 并控制 run/view | [Support Hub](https://help.harvey.ai/)、[Getting Started](https://help.harvey.ai/articles/getting-started-with-harvey)、[Agents & Workflows](https://help.harvey.ai/topics/workflows) | 企业报价制；培训 Academy、实施与集成需单列 | 定价单位、登录后错误/空态、Playbook 逐条状态 |
| Legora | 欧洲；AI-native 律师工作台 | research、drafting、tabular review、workflows；律所/法务 | 用自然语言、firm standards 和多种工具编排 workflow；role-based access、共享与迭代 | [Help Center](https://support.legora.com/)、[Workflows](https://legora.com/product/workflows) | 企业销售报价；公开套餐/单位未发现 | Help Center 文章细节、workflow 版本与审批发布状态 |
| Luminance | 英国/全球；合同 AI/CLM | 合同谈判、审阅、自动化；法务/采购/业务 | Checklists 将每个 position 的 summary、reason、markup 合并；参考历史让步/先例；非标准项路由 Legal | [Negotiation](https://www.luminance.com/platform/product/negotiation)、[Checklists](https://www.luminance.com/blogs/product-feature-spotlight-accelerate-negotiations-with-luminance%E2%80%99s-ai-powered-checklists) | 报价制；平台/实施边界待核 | 接受/拒绝能否撤销、版本冲突、精确权限模型 |
| Ironclad | 美国；成熟 CLM + AI | request→review→approval→sign→archive；GC/Legal Ops/业务 | Workflow 与完成后的 Record 分离；审批重置、条件角色/权限；archive 是最终元数据确认 | [Workflow Overview](https://support.ironcladapp.com/hc/en-us/articles/24858534941079-Workflows-Overview)、[Workflow Designer](https://support.ironcladapp.com/hc/en-us/categories/12246232651927-Workflow-Designer)、[权限](https://support.ironcladapp.com/hc/en-us/articles/23063233934999-Ironclad-Permissions-Overview)、[定价](https://ironcladapp.com/pricing) | 明确 tailored quote，按产品/用户/workflow/增长定制 | 实施服务/培训收费、AI Playbook 建议的撤销状态 |
| Juro | 英国/全球；browser-native CLM | author/review/approve/sign/repository；法务/业务 | external redline 进入 External Comments；选择 playbook 后生成 Acceptable/Unacceptable；完成/重开 review cycle | [Help Center](https://help.juro.com/)、[AI review redlines](https://help.juro.com/en/articles/9110500-how-to-ai-review-external-redlines) | 套餐/报价需另核；公开帮助中心强 | 文档说明接受/拒绝后不可撤销；规则批准与风险接受边界仍待核 |
| Clio | 北美/全球；成熟律所 SaaS + AI | matter、任务/文档、时间费用、账单、客户 portal；律所 | Matter 聚合业务与财务；bill 有 Draft→Pending approval→Approved unpaid→Paid；portal 分享可撤销 | [Help Center](https://help.clio.com/hc/en-us)、[上手](https://help.clio.com/hc/en-us/articles/33692828481819-Get-Started-Learn-the-Basics-of-Clio-Manage)、[定价](https://www.clio.com/pricing/) | $49/user/month 起；分 Starter/Core/Signature/Elite；培训与数据迁移包含于页面承诺 | 地区差异、AI credits/附加项精价、matter 关闭/重开细节 |
| RelativityOne | 美国/全球；成熟 eDiscovery SaaS | ingest/process/review/code/redact/produce；诉讼/eDiscovery/政府 | 可配置 layout/view/permission；mass operations 与 document rights 组合；工作区级审计 | [Documentation](https://help.relativity.com/RelativityOne/Content/index.htm)、[Review](https://help.relativity.com/RelativityOne/Content/Relativity/Reviewing_documents.htm) | 托管/处理/服务通常报价；精确单位待核 | 当前公开定价、端到端示例状态、AI add-on 边界 |
| Everlaw | 美国/全球；eDiscovery + case prep | evidence review、coding、batch、production、Storybuilder；诉讼/调查团队 | batch modify 先总结影响数量，再异步执行并可跟踪/undo；AI coding 先抽样迭代再批量并最终验证 | [Knowledge Base](https://support.everlaw.com/hc/en-us)、[Batch Modify](https://support.everlaw.com/hc/en-us/articles/204779929-Batch-Modify)、[Pricing FAQ](https://support.everlaw.com/hc/en-us/articles/205660765-Billing-and-Pricing-FAQ) | 按 hosted data 计费，无限用户/processing/production；有限项目管理与非标准数据 $140/hour | 实际 per-GB 价格、production clawback 细节、部分 AI credits |
| 北大法宝 | 中国；法律内容数据库 + AI/MCP | 法规/案例检索、引证、知识库、合同；律所/机构/Agent 开发者 | 法规时效/变迁与跨库联想；智能识别标准化法规/法条并回原文；MCP 与 CLI 双入口 | [法宝 AI+](https://ai.pkulaw.com/)、[特色功能](https://open.pkulaw.com/Help/special-function.html)、[MCP](https://mcp.pkulaw.com/) | 内容订阅、AI 应用、MCP token/服务；公开统一价格未发现 | 账号套餐、引用核验错误态、AI 对话保存与权限 |

### B 级：适合局部深描或商业/反例补充

| 产品 | 地区/形态 | 可用证据与差异 | 降级原因 |
|---|---|---|---|
| Spellbook | 加拿大/全球；Word 合同 AI | Word add-in、合同审阅/redline/Playbook；[Help Center](https://help.spellbook.legal/) | 本轮 Exa 返回帮助文档分散，需进一步抓取逐条建议与定价页 |
| Icertis | 美国/全球；企业 CLM | Agreement/Request、Amendment、bulk actions；[Agreement Management](https://ici-us-wiki01.icertis.com/ICIHelp8.2/index.php?title=Agreement_Management) | 旧版公开 wiki 与当前产品可能版本漂移；销售/实施复杂 |
| Leah（原 ContractPodAi） | 全球；agentic CLM | intake→draft→approval→signature→renewal；元数据驱动路由；[Agentic CLM](https://leahai.com/products/agentic-clm)、[更名说明](https://leahai.com/contractpodai-has-moved-to-leahai-com) | 主要是产品页，交互状态与帮助中心证据不足；2026 更名需双名称索引 |
| Litify | 美国；Salesforce 上法律运营 | dynamic intake、Matter Plans、activity timeline；[Platform](https://www.litify.com/platform) | 公开帮助/状态转移较弱，且需分清 Salesforce 平台能力与 Litify 自身 |
| Filevine | 美国；case management | matter/project、documents、tasks、client communication；[官网](https://www.filevine.com/) | 本轮未取得足够官方 help 深链与公开定价 |
| MyCase | 美国；律所 SaaS | case、client portal、billing；[官网](https://www.mycase.com/) | 与 Clio 机制高度重叠，公开对象证据相对少 |
| DISCO | 美国；eDiscovery + AI | review/production/AI；[官网](https://www.csdisco.com/) | 本轮可用官方帮助深链不足；与 Everlaw/Relativity 重叠 |
| AlphaLawyer | 中国；法律数据库 + 律所管理 | 客户、任务、文档、云盘、计时、日程、知识管理；[产品页](https://promote.alphalawyer.cn/new-home)、[SCRM](https://alphalawyer.cn/scrm/index.html) | 首页有动态数字渲染异常/夸张占位，需避免采信数量；详细状态文档不足 |
| 法大大 | 中国；电子签 + 合同/AI | 数字身份、电子签署、存证/出证、合同管理；[官网](https://www.fadada.com/) | 本轮 Exa 对官方流程页召回不足，多为公司/产品概述 |
| 契约锁 | 中国；电子签/印章/合同管理 | 私有化/本地签、远程签、API 接入等企业场景；[官网](https://www.qiyuesuo.com/) | 官方帮助与公开交互证据不足，LinkedIn 结果不能替代验证 |

### C 级：探索候选，暂不支持机制结论

| 产品 | 初步定位 | 保留理由 | 证据缺口 |
|---|---|---|---|
| NeoLegal 新律 | 中国 AI-native 法律工作台 | 首页声称合同、诉讼起草、法规检索、可核验引用；[官网](https://neolegal.cn/) | 缺帮助中心/录屏/定价；客户引语匿名，不能作独立验证 |
| 通义法睿 | 中国大模型法律服务 | 阿里系内容/模型整合的潜在代表 | 本轮 Exa 未稳定取得当前官方产品/帮助页，名称与入口需复核 |

## 证据可得性评分

评分不是产品质量分，只衡量“能否支撑本研究要求”。

| 产品 | 对象/流程（0–3） | 状态/权限（0–3） | 商业/服务（0–2） | 官方可定位材料（0–2） | 总分 |
|---|---:|---:|---:|---:|---:|
| Ironclad | 3 | 3 | 2 | 2 | 10 |
| Clio | 3 | 3 | 2 | 2 | 10 |
| Everlaw | 3 | 3 | 2 | 2 | 10 |
| Harvey | 3 | 3 | 1 | 2 | 9 |
| vLex Vincent | 3 | 2 | 1 | 2 | 8 |
| Juro | 3 | 3 | 0 | 2 | 8 |
| CoCounsel/Westlaw | 3 | 2 | 1 | 2 | 8 |
| 北大法宝 | 3 | 1 | 1 | 2 | 7 |
| Luminance | 3 | 2 | 0 | 2 | 7 |
| Lexis+ Protégé | 3 | 1 | 1 | 2 | 7 |
| Legora | 3 | 1 | 0 | 2 | 6 |
| RelativityOne | 3 | 2 | 0 | 1 | 6 |

## 跨域机制信号

1. **“引用可核验”至少有四种对象**：回答中的法律引证、上传文件的支撑段落、判例当前效力/负面处理、研究生成时的权威候选集。不能统一写成一个 source link。
2. **三类接受必须分开**：Everlaw/合同编辑器接受候选操作或文本；Juro/Luminance 对条款风险或对方 redline 作接受/拒绝；Ironclad 对 workflow/approver 或规则配置作发布/批准。对象与后果不同。
3. **跨文档抽取自然落到表格**：Harvey Review Tables、Legora Tabular Review、eDiscovery results table 都把文档集转为列式审阅，但来源定位、批处理、权限和回写能力并不相同。
4. **成熟 SaaS 的“主对象”比 AI-native 更稳定**：Ironclad 的 workflow/record、Clio 的 matter/bill、Everlaw 的 document/batch 提供可靠状态骨架；AI-native 更擅长从 thread/vault/workflow 组合任务，但公开文档对失败恢复和版本冲突较弱。
5. **内容授权本身是产品机制**：Westlaw、Lexis、vLex、北大法宝通过专有内容、效力/引证网络和原件定位形成与通用 LLM 不同的价值；不能只按“模型功能”比较。

## 主要缺口

- 无交互式浏览器，未完成截图和登录后状态验证；所有 A/B/C 级均为公开网页研究。
- Harvey、Legora、Luminance、RelativityOne 的公开定价单位不足；不得写成免费。
- 中国产品公开帮助中心普遍少，NeoLegal、通义法睿、法大大、契约锁不支持细粒度状态结论。
- Icertis 的公开 wiki 可能是旧版本；深描前需核对当前版本与更新日期。
- 第三方社区反例尚未纳入此 explorer 索引；应由后续产品 worker/独立 reviewer 补充并标记。
