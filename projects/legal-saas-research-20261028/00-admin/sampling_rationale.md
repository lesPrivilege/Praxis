# 选样理由与准入规则

## 深描准入

产品至少满足三项：

- 有公开帮助中心、更新日志或官方录屏，可下钻到对象与状态；
- 与同域候选存在可说明的机制差异；
- 可核对商业模式、部署/集成或服务边界中的至少一项；
- 能补足地域、产品形态或购买者类型；
- 来源足以支持关键流程的多个节点，而非只有首页文案。

## 首轮候选池

| 领域 | 候选 | 首轮关注点 |
|---|---|---|
| 法律研究/核验 | CoCounsel + Westlaw Precision、Lexis+ AI、vLex Vincent、Harvey、Legora、通义法睿/北大法宝等中国代表 | 研究→来源→原件定位→文书复用；内容授权与引用核验 |
| 合同审阅/redlining | Spellbook、Luminance、Harvey、Legora、Juro、ContractPodAi | 条款风险→依据→候选文本→人类确认；Playbook 与例外 |
| CLM/审批签署 | Ironclad、Icertis、Juro、ContractPodAi、法大大/契约锁等中国代表 | intake→生成→审批→签署→义务；规则、版本、系统集成 |
| Matter/case | Clio、Litify、MyCase、Filevine、AlphaLawyer/律所管理中国代表 | matter 作为主对象；任务、时间、账单、客户 portal、权限 |
| 诉讼/eDiscovery | RelativityOne、Everlaw、DISCO、CaseText/CoCounsel | collect→process→review→tag→produce；批量、质量控制、审计 |
| 知识/drafting/协作 | Harvey、Legora、Microsoft 365 集成型产品、Clio Duo、Lexis Create | workspace/command plane、跨文档抽取、draft、共享与治理 |

候选名只是搜索种子。深描以证据质量和机制差异决策，不硬凑数量。

## 预期代表组合

目标组合优先覆盖：

- 内容型研究平台：2–3
- AI-native 律师工作台：2
- 合同审阅/CLM：3–4
- 律所 case/matter：1–2
- eDiscovery：1–2
- 中国代表：至少 2 个进入广索引；仅在证据充分时进入深描

## 排除与降级

- 只有 SEO 首页、无对象/流程证据：保留在广索引，不深描。
- 登录墙后无公开录屏/文档：列证据缺口，不推断页面。
- 定价缺失：记为“公开未发现/报价制待核”，不写免费。
- 厂商声称准确率/安全性/效率：标 `vendor_claim`，除非有独立来源。
