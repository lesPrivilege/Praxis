# 定价与服务机制：公开样本

采集日期：2026-10-28。只使用厂商自有页面；金额和套餐受地区、客户规模、期限与页面动态配置影响，不能替代正式报价。

## 一页结论

法律科技的“价格”至少由四种不同对象组成：软件访问、法律内容覆盖、实施/培训/支持、交易或第三方费用。用一个“每用户/月”字段比较，会把内容授权、按 matter 获客、支付费率、实施复杂度和企业服务揉在一起。

## 1. Spellbook：按 team member 的自定义报价，培训/支持随购买场景进入服务包

官方定价页不显示固定金额。它明确表示按 license 中 team member 数量定价，需 demo 获取 personalized pricing；律所侧列 Group Training、Online Customer Support、10 人以上 Dedicated Support；in-house 侧列 Team Training、Online Support、Playbook Build Service、10 人以上 Dedicated Support；公开称提供 7 天免费试用，大型组织可能获得延长试用。[S-COM-001](https://spellbook.com/pricing)

可建模为：

- `subscription_metric = licensed_team_members`
- `price_visibility = custom_quote`
- `included_software = Word add-in suite + Associate`（以该页当前表述为准）
- `service_entitlements` 区分 law firm / in-house 和团队规模
- `trial` 是临时访问权，不等于免费套餐

安全与隐私（SOC 2 Type II、zero data retention 等）均来自厂商声明，标 `vendor_claim`，不作独立认证结论。

## 2. Clio：套餐 + 每用户起价 + 支付/按事件费用 + add-ons

Clio 美国定价页显示 Starter `starting at $49/user`；Core、Signature、Elite 需 `Get pricing`；AI 从 Core 起包含；页面称所有计划有 24/5 support、training 与 data migration。Elite 包含 Clio Grow，Grow AI 按 hired matter 计费。页面另列支付费率（如 eCheck/ACH、card、Affirm）、court e-filing 按次、额外 jurisdiction 按 firm/月等。[S-COM-002](https://www.clio.com/pricing/)

因此应拆成：

- `base_plan_price`：按用户，只有 Starter 公开起价；
- `plan_entitlement`：Core/Signature/Elite 的能力层；
- `addon_entitlement`：Grow 等；
- `transaction_fee`：payment / e-filing 等，不属于订阅价；
- `outcome_or_event_fee`：Grow AI 的 hired matter；
- `service_inclusion`：support/training/migration 的页面承诺，具体范围未核实。

## 3. Juro：配置式报价，购买输入是吞吐、合同类型、AI、集成与实施复杂度

Juro 定价页不是价格表，而是配置问卷：每月合同量、合同类型、需要的 AI 功能、集成；随后分三步 `Build your package`、`Tailor your support`、`Integrate and scale`，明确把 implementation team、SSO、API 和 integrations 纳入配置。[S-COM-003](https://juro.com/pricing)

页面没有公开金额，不能写成免费或固定每用户价格。更合适的商业对象是：

- `contract_volume_band`
- `contract_type_scope`
- `ai_capability_bundle`
- `integration_bundle`
- `implementation_support_tier`
- `security_scale_options = SSO/API/...`

该页的 ROI 数字是厂商客户故事/营销陈述，不纳入本轮价格事实。

## 4. CoCounsel Legal / Westlaw：AI 软件与法律内容覆盖、jurisdiction、期限共同定价

CoCounsel Legal 定价页面要求先给 sector、attorney count、jurisdiction 与 1/2/3 年期限，在线价格仅面向新客户；现有客户联系销售。页面称初始合同期内新功能加入现有 CoCounsel plan，无需升级。[S-COM-004](https://sales.legalsolutions.thomsonreuters.com/en-us/products/cocounsel-legal/700/plans-pricing)

Westlaw Edge with AI-Assisted Research 页面在一个具体动态状态下显示：law firm、1 attorney 时，单一 circuit 页面价格为 `$170.95/month`（原价 `$210.40`），All States and Federal 为 `$292.50/month`（原价 `$360.00`）；在线价格限最多 10 名律师，规模更大需联系销售。本轮文本抓取没有保留可复现的 term 选择，因此不能把金额绑定到具体 1/2/3 年期限。[S-COM-005](https://sales.legalsolutions.thomsonreuters.com/en-us/products/westlaw-edge-aar/plans-pricing)

这不是“AI 每席位价格”的纯比较：套餐同时绑定 Westlaw editorial/content 与 single-circuit 或 all-states/federal primary-law coverage。应拆成：

- `content_scope`：jurisdiction / primary law / editorial enhancements；
- `ai_entitlement`：AI-Assisted Research / surveys 等；
- `customer_segment` 与 `attorney_count`；
- `term_length` 与促销/折扣状态；
- `new_customer_only` 条件。

页面动态条件会变。正式采购必须保存配置快照与 order form；本研究只记录 2026-10-28 抓取状态。

## 5. Agent 产品建设所需的商业对象

建议保留为独立对象，而非一个 `price` 字段：

| 对象 | 关键字段 | 为什么需要 |
|---|---|---|
| `SoftwareSubscription` | plan、seat/team、term、usage limit | 区分访问权与用量 |
| `ContentLicense` | corpus、jurisdiction、redistribution limit | 法律数据库内容常决定价格与输出可分享性 |
| `ImplementationOrder` | migration、workflow config、SSO/API、timeline | 一次性/项目性服务不应吞进订阅 |
| `TrainingEntitlement` | audience、sessions、self-service/live | “包含培训”范围差异很大 |
| `SupportEntitlement` | channel、hours、named CSM、response target | customer success 与技术支持不是同一服务 |
| `ProfessionalService` | provider、scope、deliverable、responsibility | 专家服务与法律意见需分开 |
| `TransactionFee` | event、rate、minimum、processor | payment/e-filing 等不属于基础 seat |
| `QuoteSnapshot` | configured inputs、currency、tax、validity、source | 防止动态配置页被当成长期固定价格 |

## 6. 证据缺口

- 上述公开页没有完整披露折扣规则、企业最低承诺、税费、超额用量、续约涨价、实施工时或退款条件。
- “包括培训/迁移/支持”未给范围时，只能记 entitlement claim，不能估算服务质量。
- 内容再分发、生成结果可否对外分享，需核对合同/许可，不由定价页直接支持。
- 私有化、数据驻留和数据隔离需安全/部署文件另证；营销页不能替代合同承诺或独立认证。
