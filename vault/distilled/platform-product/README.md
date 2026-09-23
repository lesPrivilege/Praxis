# 平台类产品 Grammar 扫盲

状态：首轮研究说明（v0.1），不是 Kit 契约，也不是任何平台的官方业务全景。目录以可导入 Xmind 的 Markdown 为交付形态；术语是跨电商、零售、本地生活的通用候选，章节 10 只放迁移案例，不扩成第二套词库。

## 阅读顺序

1. 先导入 [`outline.md`](outline.md)，只看 10 章和 P01–P77 的邻接关系。
2. 按 `P01 → P77` 顺序阅读 [`annotated.md`](annotated.md)，优先记住供给、分发、决策、交易、履约、留存的主链。
3. 第二遍只复习第 5、7、8、9 章：指标口径、长期价值、平台经济和实验因果决定平台型判断是否成立。
4. 最后阅读第 10 章案例，把同一组关系迁移到内容、招聘和企业 AI；案例不是新的术语清单。
5. 需要核查定义时查 [`sources.md`](sources.md) 和集中来源目录 [`vault/provenance/platform-product/catalog.json`](../../provenance/platform-product/catalog.json)，不要把原 Chat 或平台方言当成完整事实。

## 交付清单

- [`outline.md`](outline.md)：一根 H1、10 个 H2、P01–P77 词条 H3，以及 4 个迁移案例 H3；无解释段落，适合先导入 Xmind。
- [`annotated.md`](annotated.md)：与 outline 的 H1–H3 完全一致；每个词条下用 H4 `解释`、`例子`、`边界`承载短句。
- [`vault/provenance/platform-product/catalog.json`](../../provenance/platform-product/catalog.json)：本轮逐 URL 登记，访问日期为 2026-09-22；状态与快照缺口分开记录。
- [`sources.md`](sources.md)：解释来源用途、可支持的主张、不可外推的边界和 Xmind 导入依据。
- [`review.md`](review.md)：Astra 裁决与验收回执。

## 使用约定

P01–P77 是本轮稳定身份；合并近义词时保留原 ID，后续修订不得按字母顺序重编号。CTR、CVR、GMV、ROI、ROAS、Take Rate 必须连同分子、分母、时间窗和范围读取。GMV 只在“订单/交易口径、是否含取消退款、商品金额是否含税运费、币种与时间窗”都明确时分解；`流量 × 转化率 × 客单价`是条件化诊断式，不是跨平台恒等式。

本目录仅保存研究说明。Astra 的候选采纳、删并与下一轮重访由主代理在 ADR 和入口层裁决；厂商材料只用于说明方言落点，不能推出美团、抖音或任何平台的完整业务事实。

## 导入 Xmind

在 Xmind 使用 File → Import → Markdown，选择 `outline.md` 或 `annotated.md`。两稿已通过 [xmind-md/0.1](../../../docs/governance/xmind-markdown-profile.md) 静态检查；用户提供的基线为 Desktop 26.05.01107，本轮未执行该版本实机导入。全局导图入口见 [Mindmaps](../../mindmaps/README.md)。
