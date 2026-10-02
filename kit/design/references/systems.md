# 设计系统与前端参考

本页是 `ref-*` URL 卡片的 canonical route。它只提供 Design 需要的消费摘要；每条原 URL、canonical URL、原对话主张、核验差异、证据链接和重访触发仍以 Vault 卡片为准。卡片的 `verified`、`partial` 是来源证据状态，不是 Kit 的 `accepted` 状态。返回 [Design 参考路由](README.md) 或 [兼容入口](../references.md)。

这些卡片记录 2026-09-18 的一轮官方入口核查；若卡片或本页注明需要重读，引用前按原 URL 复核。没有保存正文快照时，在线页面不能被当作离线证据。

## Design system 组织

| 来源 ID | URL 卡片 | 状态 | Kit 消费什么 | 边界与重访 |
|---|---|---|---|---|
| ref-atlassian | [Atlassian Design System](../../../vault/references/design-systems/atlassian.md) | verified | foundations、tokens、components、patterns、accessibility、content、AI patterns 的层次线索 | trusted fundamentals 的精确措辞未直接核实；需要导航、表单或状态 grammar 时重访 |
| ref-carbon | [IBM Carbon](../../../vault/references/design-systems/carbon.md) | verified | enterprise component/template 组织和 form/side-panel 等检索入口 | 主页不逐项证明所有 pattern；需要 form mode、read-only 或 migration 时重访 |
| ref-polaris | [Shopify Polaris](../../../vault/references/design-systems/polaris.md) | verified | web-components、layout、icon、event 和 extension surface | object/progressive disclosure 需文档复查；不复制电商对象边界 |
| ref-primer | [GitHub Primer](../../../vault/references/design-systems/primer.md) | verified | Product UI、Brand UI、Accessibility、Primitives/tokens 分层 | “克制”是 Praxis 评价，不是 Primer 原句；需要 token、icon、command 或 a11y 时重访 |
| ref-lightning | [Salesforce Lightning](../../../vault/references/design-systems/lightning.md) | partial | CRM record、related activity、status/path/action 的待查方向 | 页面抽取为空，原清单无法核实；需要 CRM record grammar 时重新找稳定官方页面 |

## Frontend framework 与 workshop 组织

| 来源 ID | URL 卡片 | 状态 | Kit 消费什么 | 边界与重访 |
|---|---|---|---|---|
| ref-ant-design-pro | [Ant Design Pro](../../../vault/references/frontend/ant-design-pro.md) | verified | enterprise shell、template→page、responsive/theme/i18n | 不复制工程栈和品牌；需要模板或权限细节时重访 |
| ref-ant-design | [Ant Design](../../../vault/references/frontend/ant-design.md) | verified | design values、components、themes 和 design/development ecology | 不锁版本、不复制品牌；组件 API 或 token 升级时重访 |
| ref-refine | [Refine](../../../vault/references/frontend/refine.md) | verified | headless provider boundary、resource list/show/create/edit、logic/UI separation | 不引入完整 meta-framework；provider 名称不等于 Praxis contract |
| ref-storybook | [Storybook](../../../vault/references/frontend/storybook.md) | verified | isolated workshop、story fixture、docs/testing/a11y addons | 精确状态矩阵是 Kit 推荐，不是上游声明；新 primitive 状态或视觉回归时重访 |
| ref-mui-x | [MUI X](../../../vault/references/frontend/mui-x.md) | verified | data-dense grid、date/time、tree/chart 和 open-core 边界 | 不作为默认视觉体系；高级能力和 license 需逐项重访 |
| ref-blueprint | [Palantir Blueprint](../../../vault/references/frontend/blueprint.md) | verified | desktop data-dense workspace、layered controls、table | 不把 desktop-first 直接套移动端；tree/inspector 需重访 |

## 维护

逐 URL 的 canonical 登记只保留在 `vault/references` 或 `vault/provenance` 的一个位置；本页不复制原件。需要将某个系统的观察提炼为跨项目语法时，先在项目 index 记录实际消费，再按 [文档结构契约](../../../docs/architecture/documentation.md) 与修订流程提出裁决。
