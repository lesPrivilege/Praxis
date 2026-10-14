# P01 · 交付给整合者与本地 Claude

## 范围与身份

- Package：P01，交易、财务与资金。
- 基点：`ae1827f34c6df067348d2454d7e5c9331ceda25d`，来源分支 `cloud/saas-engineering-atlas-20261014`。
- 交付分支：`cloud/saas-atlas-commercial-finance-20261014`。
- 内容提交 SHA：`c11415c78d4863768957b4132069287f9aa43115`，包含七例、统一证据和执行检查；随后仅补充本交付记录。最终分支tip的完整SHA在最终报告中以远端核验值给出。早期远端持久化点为`238b0fb`、`a083491`。
- 所有改动仅位于 `vault/distilled/saas-engineering-atlas/packages/commercial-finance/`。没有修改共享来源层、全局索引、其他包、main、CI 或部署。

## 已交付内容

[README](../../../../../books/saas-engineering/packages/commercial-finance/README.md)先建立承诺、履行、应收应付、现金、估计与合并调整的共同模型；七例各有原创中文正文及结构JSON：H01、H02、H03、V12、V13、V14、X02。各例围绕“识题 → 解法 → 演算 → 验算 → 变式”组织，设识别线索、适用方法、下一步探索、计算反例和有答案的条件变化题。总计19道变式题、82条未来验收定义；定义数量不代表测试已执行。

[evidence.json](evidence.json)保留13个来源种子ID，新增15个逐URL来源记录，合计28条复核记录：26项取得主源正文并读取指定范围，2项获取失败。49条包内主张分为25条来源事实、5条原创分析、19条合成设计；H01另引用三个既有公共主张ID并补充本轮读取范围。原报告和快照未被当作事实替代主源。

[checks.py](checks.py)提供18项可复现的纯Python合成检查；[validate-package.py](validate-package.py)补查证据、主张、正文引用与案例身份。所有固定算例、反例及练习均经主代理逐例阅读复算，并由独立审阅再读七章。

## 实际执行与边界

完整命令、结果与审阅修正见 [CHANGELOG](CHANGELOG.md)。本地检查覆盖区间取整守恒、累计验收占用、来源级对账、依赖与资源约束、贷款生效日重演、保险免赔顺序和未知支付占用、证券数量与现金分配、跨公司抵销与配对反例。它们不实现真实服务或数据库并发。

未执行：provider sandbox/API、真实银行或托管、浏览器端到端、租户权限执行、持久化崩溃恢复、负载测试、AI eval及专业财务/信贷/保险/交易合规审查。所有性能数字均为待测workload与目标，AI留出集与分母均为设计，正文checks是未来执行契约。

来源正文与图片未快照入库；离线可读的是原创教材与合成检查，外部主源复核仍依赖公共链接。`ACORD`原页403，未获取正文，不支持任何source_fact。`FIX`原种子及非www页面404；官方EP284 PDF另有独立来源ID，不冒充原页面恢复或最新版本。Stripe发票总览关于paid终态的文字与当前Payment application有局部冲突；H01只采用send_invoice取消分配这一有版本限定的重开分支。

## 跨包迁移与待裁决项

| 关系 | 保留的机制 | 类比失效的位置与整合建议 |
|---|---|---|
| `TR:H01:H02:evidence-before-effect` | 动作绑定权限、版本与证据 | 收款不证明商品验收；H02还需累计占用与质量证据 |
| `TR:H01:H03:versioned-periods`、`TR:V12:H01:effective-time` | 生效时间、输入版本与区间重演 | 服务价款、本金余额、会计期间有不同基数和完整性条件 |
| `TR:H02:H03:matched-to-posted` | 来源身份、币种与修订链 | 匹配通过不证明科目分类正确；保留子账到总账映射 |
| `TR:H03:X02:reconcile-before-consolidate` | 按来源配对并保留差异 | 合并范围、币种、估值与抵销规则需要另外判定 |
| `TR:V13:H03:responsibility-dimensions` | 按责任维度核对金额与修订 | reserve是可修订估计，不等于已确定应付款或银行余额 |
| `TR:V14:H03:execution-reconciliation` | 唯一执行身份与纠正链 | 累计成交量可以真实减少，不能把单调增加作为完整性条件 |
| `TR:X02:H02:receipt-evidence-boundary` | 来源行、数量与结算关系 | 虚拟采购入库不能证明实体收货或验收 |
| `TR:X02:V04:direct-shipment-lineage`、`TR:V14:V04:partial-obligations` | 子项数量守恒与部分完成 | 跨法人权限、内部定价、交易纠正与实物退货各自有边界 |
| 后续接X01多租户控制 | 复合身份及服务端授权 | tenant、法人、provider account、客户可见字段不能合并为一个scope |

整合者需要按canonical URL合并15个新增来源，保留FIX/ACORD失败范围及Stripe冲突，不覆盖公共catalog的历史记录；本包没有擅自修改共享索引。公共H01示例若扩展，应补充真实取消付款分配与迟到旧事件的区别。H03任务示意A→B表示执行先后，JSON中B `depends_on` A指向前提；后续绘图必须按边类型解释方向。

本地Claude可自由重写文字并选择统一的交互HTML、图形、motion与多代理工作方式。本包提供语义底稿，不指定布局、镜头、动效或编排。可操纵的合成参数与state/event痕迹用于让读者识题、算题和验题；source_fact、synthetic、unknown、对象ID、主张ID与方法前提需要保留。

实际角色：主代理负责共同模型、H01、统一证据和检查；三个继承模型子代理各负责两个案例；另使用gpt-6-astra作只读关键审阅。平台未给出前三者精确模型ID，未将其记为Luna。没有委派或执行任何真实机构操作。
