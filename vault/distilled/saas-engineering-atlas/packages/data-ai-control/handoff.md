# P03 交接

Package：P03，`data-ai-control`。案例：H07、H08、H09、X01。唯一改动目录为本目录。来源与执行记录分别见 [evidence.json](evidence.json) 和 [CHANGELOG](CHANGELOG.md)。本地 Claude 可重写正文并自由设计 HTML、交互与动效，保留 case/object/claim/source ID、provider 身份、synthetic 前提、权限语义与未确认状态。

## 供父线程整合的连接

| 迁移 ID | 保留的机制 | 类比的失效点 |
|---|---|---|
| `TR:H07:H09:release-approval` | 批准绑定固定输入与版本 | 数据重述不能决定签署文件的法律效力 |
| `TR:H07:X01:window-revisions` | 事件时间、修订与去重身份分开 | BI 可重述，已定稿账单需另行调整和核对 |
| `TR:H07:H08:lineage-impact` | 图路径定位待检查的影响范围 | 数据依赖不证明攻击因果，也不产生响应权限 |
| `TR:H08:X01:containment-vs-offboard` | 每项外部效果单独确认 | 解除临时限制不等于重新开通已结束的服务权利 |
| `TR:H08:H09:version-bound-authority` | 授权绑定对象版本、范围和当前身份 | 紧急响应的期限和恢复政策不等于合同撤回规则 |
| `TR:H09:H03:dependency-versus-capacity` | 依赖先后与资源不重叠分别求解 | 拓扑最早完成时间不是人员排程或业务 SLA |
| `TR:H09:H01:commitment-evidence` | 版本化承诺与履约证据分离 | 内部批准不等于客户接受，撤回不等于退款 |
| `TR:X01:H01:bill-payment-separation` | 用量、账单、付款分别可核对 | 可计费不等于已收款，更不等于收入确认 |

父线程应按 canonical URL 合并新增来源，保留10个公共种子ID。`X01:claim:webhook-boundary` 与既有 `STRIPE_WEBHOOK-C1` 语义重叠，可以建立别名或归并消费关系；不要删除原公共 ID。`SAAS_LENS-C1` 保持不变，本包新增 tenant-context 主张的范围不同。Atlas validator 目前要求包内 claim 为 `<case>:claim:*`，本包遵循它，不用替换公共 C 编号绕过校验。

术语需避免合并：H07 的策略版本是发布解释输入，读取还受当前授权约束；H08 的 consumed 是授权绑定到一个 run，未授予无限期重试；H09 的签署包、内部决定与 provider Record 身份不同；X01 的成本单位、计费单位与 model token 不作天然等价。`derived_from` 的边指向来源，影响分析需要反向邻接；`depends_on` 指向前提，调度图需转成前提到后继。

每例末尾补有实践探索方向，指出陌生行业应先查的对象/政策、方案适用条件和首轮失败验收；其用途是供Claude在既有Praxis中继续研究和制作一致的交互HTML，不要求新增产品实现，也不规定UI/motion或代理编排。

新增参考均为研究候选，不进入 Kit 权威规范。共同索引、学习主线、来源总表、registry 与跨包命名裁决由父线程维护；本分支没有修改它们，也没有创建 PR、合并 main 或部署。

## 交付定位

已完成四例正文与JSON、共同模型、四个检查脚本、证据侧车和执行记录。25个URL中23个读到正文、2个动态API页面未核实；47个主张；四例各有三道条件变化题。节点83、typed edges132、生命周期22、端到端检查定义48项，都是说明契约，不是48项已执行集成测试。

实际检查：H07为15断言/4负例，H08为24检查（12预期拒绝、4反例，并执行本地SQLite双线程唯一约束），H09为18纯内存检查，X01为14 unittest。Atlas含8负向自检通过；仓库验证通过；registry在内存重建与原文件逐字节一致。具体命令、结果及未执行范围见CHANGELOG。

精确内容 checkpoint 和远端核验将在本包内容提交后补记，避免把文件自身的提交SHA写成循环依赖。未核实与未执行范围已列于CHANGELOG；没有权限或授权阻碍。
