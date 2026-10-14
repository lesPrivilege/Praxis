# 33 个案例的机制入口

沿机制阅读案例，可以比较同一方法在不同条件下怎样成立。下面每一例都有一个可迁移关系、一个不能省略的差别和一项阅读任务。链接指向已经完成的案例正文；本册的组织、前端与 agent 机制在这些对象上继续展开。

## 承诺与证据分别成立

接续本册第一章。

| 案例 | 可迁移的关系 | 条件边界 | 阅读任务 |
|---|---|---|---|
| [H01](https://github.com/lesPrivilege/Praxis/blob/699cc261d2e4407b5de78ee1879efdd850411439/vault/distilled/saas-engineering-atlas/packages/commercial-finance/H01.md) | 合同、服务、收款与收入各有依据 | 先收款与先履约的前提不同；收入不能由收款状态直接推导。 | 找出一笔收款对应的服务期间。 |
| [H02](https://github.com/lesPrivilege/Praxis/blob/699cc261d2e4407b5de78ee1879efdd850411439/vault/distilled/saas-engineering-atlas/packages/commercial-finance/H02.md) | 验收证据支持发票匹配与付款资格 | 预付、数量验收与服务里程碑采用不同 guard。 | 找出同一验收数量是否被两次占用。 |
| [V01](https://github.com/lesPrivilege/Praxis/blob/1d14256792f66420f8c699e79d760c747bc743b6/vault/distilled/saas-engineering-atlas/packages/health-science/V01.md) | 诊疗结果、费用请求与资金结算分开 | 临床有效性与付款方接受条件不能互相代替。 | 定位结果更正后哪些下游工作需要重新判断。 |
| [V03](https://github.com/lesPrivilege/Praxis/blob/1d14256792f66420f8c699e79d760c747bc743b6/vault/distilled/saas-engineering-atlas/packages/health-science/V03.md) | 样品结果连接方法、校准、复核和批次结论 | 样品测量不能脱离取样代表性直接推成整批质量。 | 检查一个结果的证据资格改变后证书如何处理。 |
| [V07](https://github.com/lesPrivilege/Praxis/blob/2c73cc6856c1d2a17a58a94d3c38dcd63872e2a4/vault/distilled/saas-engineering-atlas/packages/industry-networks/V07.md) | 设计、制造、检验、交付与应收分别确认 | 生产结束不等于质量放行；放行不等于客户已收到。 | 追踪一件交付物使用的设计版本。 |
| [V08](https://github.com/lesPrivilege/Praxis/blob/2c73cc6856c1d2a17a58a94d3c38dcd63872e2a4/vault/distilled/saas-engineering-atlas/packages/industry-networks/V08.md) | 配方计划、实际批记录与质量处置分开 | 混合与拆分需要谱系；单件设备身份不能原样套用。 | 检查批次放行前仍缺哪些有效证据。 |

## 批准绑定具体范围与版本

接续本册第一、三章。

| 案例 | 可迁移的关系 | 条件边界 | 阅读任务 |
|---|---|---|---|
| [H08](https://github.com/lesPrivilege/Praxis/blob/7284e10446337299766cb852d52bab3b977f4b02/vault/distilled/saas-engineering-atlas/packages/data-ai-control/H08.md) | 响应动作绑定证据、权限与目标 | 风险分数只支持调查顺序，不授予隔离权限。 | 在同一信号下分别列出调查与执行所需权限。 |
| [H09](https://github.com/lesPrivilege/Praxis/blob/7284e10446337299766cb852d52bab3b977f4b02/vault/distilled/saas-engineering-atlas/packages/data-ai-control/H09.md) | 文件批准、签署和下游同步分别保存 | 批准某版条款不等于法律签署，也不等于已同步。 | 文件改版后找出失效的批准与同步对象。 |
| [V02](https://github.com/lesPrivilege/Praxis/blob/1d14256792f66420f8c699e79d760c747bc743b6/vault/distilled/saas-engineering-atlas/packages/health-science/V02.md) | 方案、同意、表单签署与锁定范围分别管理 | 知情同意不等同于组织内部支出审批。 | 把表单修改前后版本与签署覆盖范围对齐。 |
| [V09](https://github.com/lesPrivilege/Praxis/blob/2c73cc6856c1d2a17a58a94d3c38dcd63872e2a4/vault/distilled/saas-engineering-atlas/packages/industry-networks/V09.md) | 发布包由同一基线的有效检查证据支持 | 报告绿色不证明所有报告采用同一组约束。 | 找一份过期报告，说明它阻止哪次签核。 |
| [V15](https://github.com/lesPrivilege/Praxis/blob/98a6ec86c14e71901952453c5733813a85f37a81/vault/distilled/saas-engineering-atlas/packages/commerce-property/V15.md) | 技术答复、商业变更、计量与支付分开 | 设计认可不能代替合同价调整批准。 | 沿一个变更找技术依据与资金依据的分界。 |
| [V18](https://github.com/lesPrivilege/Praxis/blob/4b930a71bf2f661c3746c2809505b12049571f8e/vault/distilled/saas-engineering-atlas/packages/people-service/V18.md) | 保存、审阅、交付与费用各有授权 | 材料可访问不等于可以对外交付；保全义务不能随结案删除。 | 说明交付集合如何保留来源和排除依据。 |

## 执行、核对与接收各有责任

接续本册第三、四章。

| 案例 | 可迁移的关系 | 条件边界 | 阅读任务 |
|---|---|---|---|
| [H04](https://github.com/lesPrivilege/Praxis/blob/4b930a71bf2f661c3746c2809505b12049571f8e/vault/distilled/saas-engineering-atlas/packages/people-service/H04.md) | 身份启停、任职状态与薪资义务分开 | 停用登录不会自动结清工资或删除历史责任。 | 离职后分别检查每个外部账户与未结义务。 |
| [H05](https://github.com/lesPrivilege/Praxis/blob/4b930a71bf2f661c3746c2809505b12049571f8e/vault/distilled/saas-engineering-atlas/packages/people-service/H05.md) | incident、change、problem 互相关联但分别关闭 | 服务恢复不等于根因已消除；恢复变更仍需复核。 | 找出恢复后仍开放的调查工作。 |
| [H06](https://github.com/lesPrivilege/Praxis/blob/4b930a71bf2f661c3746c2809505b12049571f8e/vault/distilled/saas-engineering-atlas/packages/people-service/H06.md) | 答复、后台动作与客户接收分开 | 发送回复不等于客户已能使用结果。 | 检查新消息或方案更改会不会使旧接收失效。 |
| [V10](https://github.com/lesPrivilege/Praxis/blob/2c73cc6856c1d2a17a58a94d3c38dcd63872e2a4/vault/distilled/saas-engineering-atlas/packages/industry-networks/V10.md) | 资产信号、工作许可、维护与复归分开 | 客户签收不能替代设备现场安全条件。 | 从异常信号一直追到有权批准复归的人。 |
| [V20](https://github.com/lesPrivilege/Praxis/blob/4b930a71bf2f661c3746c2809505b12049571f8e/vault/distilled/saas-engineering-atlas/packages/people-service/V20.md) | 多次 booking 支持一个 work order 的交付 | 任意一次上门结束不代表约定范围已全部完成。 | 把失败或返工预约保留在父工单的未完责任中。 |
| [V22](https://github.com/lesPrivilege/Praxis/blob/2c73cc6856c1d2a17a58a94d3c38dcd63872e2a4/vault/distilled/saas-engineering-atlas/packages/industry-networks/V22.md) | 商业生效、网络配置、用量和资源退役分开 | 没有用量不证明网络已撤销，也不证明资源可再分配。 | 核对退订后仍可能到达的用量与配置回执。 |
| [X01](https://github.com/lesPrivilege/Praxis/blob/7284e10446337299766cb852d52bab3b977f4b02/vault/distilled/saas-engineering-atlas/packages/data-ai-control/X01.md) | 租户开通、隔离服务、计量与退出形成闭环 | 全局同号对象、共享配额和缓存会改变身份与访问前提。 | 退出时列出在途任务、资料与计费各自去向。 |

## 部分完成与资源约束

接续本册第一、二章。

| 案例 | 可迁移的关系 | 条件边界 | 阅读任务 |
|---|---|---|---|
| [V04](https://github.com/lesPrivilege/Praxis/blob/98a6ec86c14e71901952453c5733813a85f37a81/vault/distilled/saas-engineering-atlas/packages/commerce-property/V04.md) | 订单、拆分履约、退货和退款分别核对 | 收钱不代表商品全交；退货不代表退款到账。 | 用数量守恒检查每个履约子集。 |
| [V05](https://github.com/lesPrivilege/Praxis/blob/98a6ec86c14e71901952453c5733813a85f37a81/vault/distilled/saas-engineering-atlas/packages/commerce-property/V05.md) | 制作、消费账与多种支付各自确认 | 已消耗食材不能用取消支付自动恢复。 | 给一次取消分别列出厨房与资金后果。 |
| [V06](https://github.com/lesPrivilege/Praxis/blob/98a6ec86c14e71901952453c5733813a85f37a81/vault/distilled/saas-engineering-atlas/packages/commerce-property/V06.md) | 日期容量、实体配房与 folio 分开 | 预订确认不证明房间可交付；离店不证明迟到费用已对清。 | 把住宿夜数与实际房态、费用期间分别核对。 |
| [V14](https://github.com/lesPrivilege/Praxis/blob/699cc261d2e4407b5de78ee1879efdd850411439/vault/distilled/saas-engineering-atlas/packages/commercial-finance/V14.md) | 订单、部分成交、分配与结算分开 | 撤单只影响可撤部分，不能抹掉已成交数量。 | 检查撤单与成交同时到达时剩余责任。 |
| [V16](https://github.com/lesPrivilege/Praxis/blob/98a6ec86c14e71901952453c5733813a85f37a81/vault/distilled/saas-engineering-atlas/packages/commerce-property/V16.md) | 空间使用、维修责任与押金对账分开 | 维修完成不决定谁应承担损坏费用。 | 分开记录事实修复与费用归属裁决。 |
| [V19](https://github.com/lesPrivilege/Praxis/blob/4b930a71bf2f661c3746c2809505b12049571f8e/vault/distilled/saas-engineering-atlas/packages/people-service/V19.md) | 配员、已发生工时、批准工时与可收费额分开 | 有空不代表具备技能，获批工时也可能超合同上限。 | 从账单倒查每项工时与上限占用。 |
| [V21](https://github.com/lesPrivilege/Praxis/blob/2c73cc6856c1d2a17a58a94d3c38dcd63872e2a4/vault/distilled/saas-engineering-atlas/packages/industry-networks/V21.md) | 约束计划、采购批准、运输和运费支付分开 | 可行或优质计划仍需商业授权与实际交付证据。 | 找出计划被接受后仍未实现的资源与交付。 |

## 口径、期间与最终记录

接续本册第二、四章。

| 案例 | 可迁移的关系 | 条件边界 | 阅读任务 |
|---|---|---|---|
| [H03](https://github.com/lesPrivilege/Praxis/blob/699cc261d2e4407b5de78ee1879efdd850411439/vault/distilled/saas-engineering-atlas/packages/commercial-finance/H03.md) | 子账、对账、期间控制与报告有独立前提 | 任务打勾不能代替余额核对与写入期间控制。 | 从报告的一项数字回到来源与调整。 |
| [H07](https://github.com/lesPrivilege/Praxis/blob/7284e10446337299766cb852d52bab3b977f4b02/vault/distilled/saas-engineering-atlas/packages/data-ai-control/H07.md) | 源数据修订、指标定义与发布版本分开 | 最新数字不必与已发布快照相同，发布不能倒改业务事实。 | 复算同一口径下迟到更正的影响。 |
| [V11](https://github.com/lesPrivilege/Praxis/blob/2c73cc6856c1d2a17a58a94d3c38dcd63872e2a4/vault/distilled/saas-engineering-atlas/packages/industry-networks/V11.md) | 表计读数、质量处置、计费依据与账单分开 | 累计读数不等于区间用量；估算与实测不能默默混合。 | 追踪换表或补读如何改变计费依据。 |
| [V12](https://github.com/lesPrivilege/Praxis/blob/699cc261d2e4407b5de78ee1879efdd850411439/vault/distilled/saas-engineering-atlas/packages/commercial-finance/V12.md) | 批准、放款、余额与 payoff 分别成立 | 批准不证明已交付资金；结清需要时点与剩余义务。 | 核对结清时点的现金与债权记录。 |
| [V13](https://github.com/lesPrivilege/Praxis/blob/699cc261d2e4407b5de78ee1879efdd850411439/vault/distilled/saas-engineering-atlas/packages/commercial-finance/V13.md) | 保障、损失认定、reserve 与赔款分开 | 估计准备不是已付款；不同保障责任不能合成一个金额。 | 说明支付前仍需确认的责任与受款对象。 |
| [V17](https://github.com/lesPrivilege/Praxis/blob/4b930a71bf2f661c3746c2809505b12049571f8e/vault/distilled/saas-engineering-atlas/packages/people-service/V17.md) | 访问资格、评估结果、成绩批准与 transcript 分开 | 名单同步成功不代表成绩已获学校批准。 | 检查更正后的成绩记录是否引用新批准版本。 |
| [X02](https://github.com/lesPrivilege/Praxis/blob/699cc261d2e4407b5de78ee1879efdd850411439/vault/distilled/saas-engineering-atlas/packages/commercial-finance/X02.md) | 各法人业务记录与集团合并核对分开 | 内部抵销不删除法人账；单据多不代表货物多次移动。 | 把一次实物交付与多方义务逐项配对。 |

## 从类比回到调查

看到两个案例都有“批准”，先比较批准对象、有效期限、可撤回条件、专业责任与后果；看到两个案例都有“完成”，先比较实际执行证据和接收者。只有这些前提相容，才能迁移工作规则。对象名称相近、页面长得相似或都使用同一类 API，都不足以证明机制可以直接互换。

原语言词义见 [术语索引](terms.md)。用某一例开展实现时，可以把阅读任务变成最小合成输入，先演算正常路径，再改变一项条件，检查最容易被“成功”标签掩盖的责任。
