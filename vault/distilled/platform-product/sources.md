# 来源说明

本轮研究在 2026-09-22 访问 4 个官方一手网页，逐 URL 记录在集中目录 [`vault/provenance/platform-product/catalog.json`](../../provenance/platform-product/catalog.json)。它们只支持局部定义和导入规则；本目录的 77 个词条是跨场景综合，不能把一条厂商页面当作完整平台事实。

## 可直接支持的主张

- `SRC-CTR`（`google-ads-ctr-definition`）支持 CTR 的基本式：点击次数 ÷ 展示次数。文档只定义 Google Ads 广告/免费商品列表的统计语境；本目录在解释中把渠道、事件和时间窗作为必须另行声明的口径。
- `SRC-GA4`（`google-analytics-recommended-ecommerce-events`）支持把浏览商品、加购、开始结账、购买和退款拆成可记录事件。它用于说明漏斗阶段如何落到事件，不把 GA4 命名当作所有交易系统的 schema。
- `SRC-TTS`（`tiktok-shop-shop-tab-basics`）支持内容驱动入口与 Shop Tab 货架入口的一个公开产品例子。它是迁移案例的方言证据，状态为 partial；不证明中国抖音、TikTok 全平台或任何单一平台的完整业务图谱。
- `SRC-XMIND`（`xmind-markdown-to-mind-map`）支持 Markdown 导入 Xmind、H1/标题层级映射和第一行中心主题。它是本目录两稿的导入依据，不等于已经完成客户端视觉验收。

## 指标口径的本地写法

CTR、CVR、GMV、ROI、ROAS、Take Rate 在 `annotated.md` 中都必须先说分子和分母，再说统计范围与时间窗。CTR 是点击/曝光；CVR 只有在声明“订单/支付/完成”等转化事件和分母是点击、访问或曝光后才可比较；ROI 是收益或增量贡献相对投入，ROAS 是广告归因收入相对广告花费，二者不能互换。

GMV 采用条件化表达：只有在固定时间窗、订单数与金额来自同一订单状态集合、同一币种、同一金额字段，并且客单价确实定义为该集合金额 ÷ 该集合订单数时，`订单数 × 客单价` 才是严格恒等式。进一步拆成 `UV × CVR × AOV` 只有在 CVR 定义为订单数 ÷ UV 且允许一个用户多单时才成立；若 CVR 是支付用户 ÷ UV，就还缺订单频次，不能直接推出 GMV。取消、退款、税费、运费、优惠承担方、跨端去重或归因窗不同，也不能把乘式当作严格恒等式。

## Xmind 导入依据

Xmind 官方指南记录 `File → Import → Markdown`，并说明标题层级会成为节点层级、第一行文本或标题会成为中心主题。因此 `outline.md` 只有一个根 H1，章节是 H2，词和案例是 H3；`annotated.md` 与其保持同一 H1–H3 树，解释、例子、边界仅放在 H4。正文句子压成短单行列表，便于导入后作为节点或注释继续整理。

## 快照与边界

4 个 URL 均为 `not-captured`：本轮没有保存 HTML、课程附件、客户端截图或 SHA-256 快照，离线复核能力只有本地摘要。集中 catalog 将 `status`（verified/partial）和 `snapshot_status` 分开，不能把网页当前可访问误说成已有本地原件。下一轮若要把定义提升为 Kit 契约，应重新访问 URL、捕获原件、记录定位并由 Astra 裁决是否采纳。
