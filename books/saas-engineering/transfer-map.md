# 跨案例迁移地图

迁移要同时写出保留的机制和改变的条件。下面每条边从已学案例指向变式案例；它不表示数据已经传输、provider 功能等价或领域授权可以继承。机器结构见 [transfer-map.json](../../vault/distilled/saas-engineering-atlas/transfer-map.json)，其余作者提出的连接及原文位置保留在 [建议侧车](../../vault/distilled/saas-engineering-atlas/transfer-proposals.json)。

## 一条迁移的做法

先完成来源案例的小算例，再读目标案例的识题部分。写出不变量，替换条件，构造一条会误导原方法的输入，最后观察目标系统应怎样拒绝、重算或请求接管。练习答案应同时说明业务对象和系统边界。

例如 H01 的付款与服务分离可迁往 V01 的裁决与到账核对；它不能把“预付后开通”的合成规则带入诊疗。H07 的反向邻接可帮助 V03 找到受修订影响的证书；它不授予撤销证书的专业权限。

## 证据与决定

适用前提：已有明确对象、版本、责任人和可观察证据。

| 学过 → 变式 | 保留机制 | 改变的条件 | 反例与验算 |
|---|---|---|---|
| [H01](packages/commercial-finance/H01.md) → [H02](packages/commercial-finance/H02.md) | 动作绑定对象版本、权限和证据 | 采购另需累计验收与质量证据 | 已经收款不证明收到货；缺验收时拒绝付款受理 |
| [V16](packages/commerce-property/V16.md) → [V20](packages/people-service/V20.md) | 多次 booking 的执行证据支持范围接收 | 现场服务不继承住宅进入许可和押金政策 | 一次预约完成关闭总工单；未完成范围仍可见 |
| [V20](packages/people-service/V20.md) → [H06](packages/people-service/H06.md) | 执行与接收针对同一解决版本 | 支持请求可能没有 booking | 客户确认旧版本而新消息未处理；总请求不关闭 |
| [H05](packages/people-service/H05.md) → [H06](packages/people-service/H06.md) | 恢复动作、结果和接收各有证据 | 服务探测与客户确认的权威不同 | 成功探测替客户验收；核对接收人和版本 |
| [H05](packages/people-service/H05.md) → [V18](packages/people-service/V18.md) | 局部关闭不消灭其他有效义务 | legal hold 不能继承工单超时关闭 | 案件关闭自动删除受保全文件；有效 hold 阻止处置 |
| [V02](packages/health-science/V02.md) → [H08](packages/data-ai-control/H08.md) | 权限绑定作用域、动作及拒绝原因 | 研究同意有自主性和持续沟通义务 | 同意被当成永久响应授权；撤回后按具体动作重判 |
| [V03](packages/health-science/V03.md) → [V10](packages/industry-networks/V10.md) | 设备资格是动作前提之一 | 校准、维护许可和投运确认分别决定 | 设备维修完即认为测量合格；资格与结果分别检查 |
| [V10](packages/industry-networks/V10.md) → [V20](packages/people-service/V20.md) | booking 执行与范围接收分开 | 现场隔离、许可与投运不能由客户签收代替 | 签了服务单就解除隔离；缺投运确认仍不放行 |
| [V15](packages/commerce-property/V15.md) → [V16](packages/commerce-property/V16.md) | 工作证据与费用责任分别决定 | 工程计量与押金损坏责任依据不同 | 维修完成即扣全部押金；先核实责任与合同规则 |

## 对账与资金

适用前提：金额单位、币种、来源身份与调整口径明确。

| 学过 → 变式 | 保留机制 | 改变的条件 | 反例与验算 |
|---|---|---|---|
| [H02](packages/commercial-finance/H02.md) → [H03](packages/commercial-finance/H03.md) | 来源身份、币种和修订链 | 总账还需科目、法人和期间 | 匹配正确但科目错仍应留差异；逐来源行核对 |
| [H03](packages/commercial-finance/H03.md) → [X02](packages/commercial-finance/X02.md) | 先按来源配对并保存差额 | 合并增加范围、币种和估值 | 总额相抵却交易方错；按内部双方与来源行核对 |
| [X01](packages/data-ai-control/X01.md) → [H01](packages/commercial-finance/H01.md) | 用量、账单和付款分别核对 | AI 成本单位不天然等于合同计费单位 | 生成 token 即认定收到款；核对账单及收款身份 |
| [V01](packages/health-science/V01.md) → [H01](packages/commercial-finance/H01.md) | 裁决、到账与最终业务完成分开 | 付款开通条件不继承到诊疗处置 | 理赔获批即认为到账；付款核销仍独立 |
| [V11](packages/industry-networks/V11.md) → [H01](packages/commercial-finance/H01.md) | 计费依据、账单和现金分别保存 | 表计累计读数与订阅服务基数不同 | VEE 修正覆盖已结账单；差额通过调整链核对 |
| [V13](packages/commercial-finance/V13.md) → [H03](packages/commercial-finance/H03.md) | 按责任维度解释金额与修订 | reserve 是估计，不能当确定应付或现金 | 准备金变动当成付款；估计与银行记录分开 |
| [V21](packages/industry-networks/V21.md) → [V07](packages/industry-networks/V07.md) | 交付依据与资金义务按来源关联 | 制造应收与运输应付方向相反 | 签收支持了所有附加费；逐费用来源核对 |

## 部分履约与守恒

适用前提：可定义整体、子项及数量单位；不可逆交接可辨认。

| 学过 → 变式 | 保留机制 | 改变的条件 | 反例与验算 |
|---|---|---|---|
| [X02](packages/commercial-finance/X02.md) → [V04](packages/commerce-property/V04.md) | 实物只交付一次，单据分别保留责任 | 零售拆仓没有同样的跨法人内部定价 | 两张公司单据计成两次发货；核对物理交付身份 |
| [V04](packages/commerce-property/V04.md) → [V06](packages/commerce-property/V06.md) | 承诺分成数量可核对的部分 | 房晚带日期，过去一晚不能回到库存 | 跨日退房恢复了过去容量；按日期检查占用 |
| [V08](packages/industry-networks/V08.md) → [V21](packages/industry-networks/V21.md) | 身份、数量与交接事件连接 | 运输事件不证明质量放行或温控合格 | 有签收即判合格；质量与交接证据并列核对 |
| [V14](packages/commercial-finance/V14.md) → [V04](packages/commerce-property/V04.md) | 子项数量守恒与部分完成 | 交易纠正可减少成交量，退货规则不同 | 认为累计成交永远递增；纠正链重算数量 |

## 未知结果与恢复

适用前提：操作有稳定身份，可查询外部效果或交给人工核查。

| 学过 → 变式 | 保留机制 | 改变的条件 | 反例与验算 |
|---|---|---|---|
| [V04](packages/commerce-property/V04.md) → [V05](packages/commerce-property/V05.md) | 外部交接后取消先核对效果 | 厨房制作可能不可逆，不能套仓库释放 | 制作已开始却重新发厨房单；同一制作身份不重复 |
| [H08](packages/data-ai-control/H08.md) → [X01](packages/data-ai-control/X01.md) | 每项外部效果独立核对 | 解除临时限制不等于恢复已终止使用权 | 恢复账号顺手重开租户；当前 entitlement 仍校验 |
| [H06](packages/people-service/H06.md) → [H01](packages/commercial-finance/H01.md) | 未知外部结果先核对同一操作 | 财务动作还需资金权限与开通 guard | 超时重复收费；同一操作只产生一次预期效果 |
| [V22](packages/industry-networks/V22.md) → [V10](packages/industry-networks/V10.md) | 外部效果确认后才释放资源 | 通信退役与现场隔离解除权威不同 | 本地标退役就重配端口；外部未确认仍占用 |

## 时间与修订

适用前提：区间边界、时区、生效时间及输入版本明确。

| 学过 → 变式 | 保留机制 | 改变的条件 | 反例与验算 |
|---|---|---|---|
| [V06](packages/commerce-property/V06.md) → [V16](packages/commerce-property/V16.md) | 资源承诺区间与实际交接分别保存 | 租约独占权、酒店换房和计价规则不同 | 未来签约不占时段导致重租；区间重叠被拒 |
| [V20](packages/people-service/V20.md) → [V19](packages/people-service/V19.md) | 工作记录绑定时间与输入版本 | 现场日志不自动是获批 timecard | 行程被算成可计费作业；只累计获批范围 |
| [H07](packages/data-ai-control/H07.md) → [X01](packages/data-ai-control/X01.md) | 事件时间、修订与去重身份分开 | BI 可重述，定稿账单需调整链 | 迟到用量直接覆盖已付账单；新调整与原账单可追溯 |
| [H04](packages/people-service/H04.md) → [V19](packages/people-service/V19.md) | 有效费率与固定计算输入，修正独立 | 任职存续不等于客户可计费工时 | 用今天费率重算历史；原输入与调整均可解释 |
| [V22](packages/industry-networks/V22.md) → [V11](packages/industry-networks/V11.md) | 发生时间、修订与计费依据连接 | 会话用量、表读数和套餐分母不同 | 按收到时间重复计量；按业务窗口和去重身份验算 |
| [V12](packages/commercial-finance/V12.md) → [H01](packages/commercial-finance/H01.md) | 按生效日重演固定输入 | 本金、服务数量与会计期间基数不同 | 按入库日计算利息；生效日改变结果可复算 |

## 来路与影响

适用前提：边方向、输入版本、访问范围与专业权威可区分。

| 学过 → 变式 | 保留机制 | 改变的条件 | 反例与验算 |
|---|---|---|---|
| [V18](packages/people-service/V18.md) → [V17](packages/people-service/V17.md) | 内容或数值身份与决定版本分开 | 法律特权和成绩批准依据不同 | 同值成绩换依据却沿用旧批准；版本变化需复核 |
| [H07](packages/data-ai-control/H07.md) → [H09](packages/data-ai-control/H09.md) | 批准绑定固定输入与版本 | 数据重述不能决定文件签署效力 | 指标重算自动撤销签名；影响集合交给对应权威 |
| [H07](packages/data-ai-control/H07.md) → [H08](packages/data-ai-control/H08.md) | 图路径定位待检查范围 | 依赖不证明攻击因果或响应权限 | 可达节点全被停用；候选范围与授权执行分开 |
| [V01](packages/health-science/V01.md) → [V03](packages/health-science/V03.md) | 报告修订保留输入、版本与影响 | 临床报告与批次证书取样和专业权威不同 | 一份新结果抹去旧报告；新旧版本及使用者可查 |
| [V02](packages/health-science/V02.md) → [V01](packages/health-science/V01.md) | 修订证据与决定引用分开 | 研究签名不替代临床判断 | 修正 eCRF 自动修改临床决定；重新交给临床责任人 |
| [V03](packages/health-science/V03.md) → [V09](packages/industry-networks/V09.md) | 输入变化沿反向依赖找受影响证据 | 测量不确定度与芯片 signoff 规则不同 | 旧输入报告混进新发布；逐条验证基线身份 |
| [V07](packages/industry-networks/V07.md) → [V09](packages/industry-networks/V09.md) | 发布包绑定一致的设计基线 | 制造工艺与 RTL 实现的证据要求不同 | 绿色报告来自两个约束版本；发布拒绝混版 |
| [V07](packages/industry-networks/V07.md) → [V08](packages/industry-networks/V08.md) | 计划依据与实际投入谱系分别保存 | 混合与拆分不能用离散件身份直接表达 | 配方被当成实际投料；核对实际批次与数量 |
| [V15](packages/commerce-property/V15.md) → [V07](packages/industry-networks/V07.md) | 技术版本变化定位下游影响 | 技术答复不自动批准商业费用或返工 | 新图纸直接增加应付；商业决定单独检查 |

## 身份与范围

适用前提：唯一性域、成员关系与授权规则分别定义。

| 学过 → 变式 | 保留机制 | 改变的条件 | 反例与验算 |
|---|---|---|---|
| [V17](packages/people-service/V17.md) → [H04](packages/people-service/H04.md) | 人员与有期间的成员关系分开 | 学籍、任职与历史保留政策不同 | 注销成员关系删除历史成绩或工资；身份保留可回查 |
| [V17](packages/people-service/V17.md) → [X01](packages/data-ai-control/X01.md) | 租户、来源、对象的复合身份 | 同租户内还需课班和个人访问规则 | 同编号对象跨租户命中；命中和重建都隔离 |

## 依赖与容量

适用前提：前提图、资源容量、时间窗与目标分别给出。

| 学过 → 变式 | 保留机制 | 改变的条件 | 反例与验算 |
|---|---|---|---|
| [H09](packages/data-ai-control/H09.md) → [H03](packages/commercial-finance/H03.md) | 依赖先后与资源冲突分别求解 | 关账岗位与合同审批任务时限不同 | DAG 无环却两任务抢一人；另查资源时窗 |

按 [共同词表](semantics.md)解释对象内部边；按 [阅读主线](learning-path.md)选一条完整路线。
