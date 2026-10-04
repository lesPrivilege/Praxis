# 场景契约

每个场景一份，按 [场景模板](../../../scenarios/_template/README.md)填写。实现、测试和界面都以它为准；代码里新增的规则要回填到这里。

| 场景 | 工作 | 契约 |
|---|---|---|
| [事项工作台](matter-workbench.md) | 律所争议团队在举证期限前处置风险：主办律师提出建议，合伙人决定 | [matter.openapi.yaml](../contracts/matter.openapi.yaml) |
| [付款复核台](payment-review.md) | 合同运营核对一笔付款申请的合同、发票和验收材料是否足以交人复核：复核员提交，负责人接受或退回 | [payment.openapi.yaml](../contracts/payment.openapi.yaml) |

两个场景是两件不同的工作，不是同一件工作换了名词：前者的判断对象是带立场的依据，动作里有批量作业；后者的判断对象是规则检查的结果，页面上要把规则、机器提议和人的判断分开，金额是精确值。它们共用的部分在 [work.yaml](../contracts/work.yaml)、后端内核和 `web/workbench`。
