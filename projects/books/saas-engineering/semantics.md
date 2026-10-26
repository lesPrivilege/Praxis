# 共同词表与读图约定

有了共同词表，不同案例的问题可以放在一起比较；领域词仍然归各自的对象和制度所有。读到“完成”时，先补出主语：付款已分配、工单已接收、报告已批准或资源已退役。不同对象可以同时处于不同阶段。词表分清名称来自通用术语、标准、provider 还是本书的编排，给出身份、时间与权威的共同概念，规定结构数据里边的类型和方向，并用证据身份标明一句话是来源事实、作者推理还是构造的数值。同一个原词在不同案例里含义可能不同，领域状态与 guard 以各例正文为准。

## 名称的层次

名称按来源分四层；层次决定按谁的定义读，以及这个名称能证明什么。

| 层次 | 常见名称 | 读法 |
|---|---|---|
| 通用技术与领域术语 | transaction、idempotency、system of record、read model、DAG、work order | 按通行含义理解；某个系统实际提供哪些保证，以上下文为准，不从名称推断实现 |
| 标准或参考模型 | SCIM、FHIR、DICOM、FIX、EPCIS、EDRM、OneRoster | 保留原名、版本与适用范围；标准数据交换不自动授予业务批准权 |
| provider 专有概念 | Snowflake stream、Stripe invoice、Ironclad Record、ServiceNow incident 状态 | 按该产品来源的定义读；跨产品对照时写明差异 |
| 本书的编排归纳 | 五步解题顺序、案例分组、typed transfer 分类、JSON 边枚举 | 用于比较案例的编排，不作为行业标准或厂商内部设计的证据 |

`TERM:COMMON` 是本书查阅用的命名空间。“共同”指书中多处共用同一个解释，与各厂商是否采用相同实现或制度无关。已有名称能表达机制时沿用原名，不另起新名。

## 身份、时间与权威

共同概念把一件工作的身份、版本、时间、负责方和结果拆开来问；每个概念旁边都有一个容易混淆、需要分开的概念。

| 共同概念 | 判断的问题 | 需要分开的概念 |
|---|---|---|
| object / 工作对象 | 哪件工作有独立身份、状态与约束 | 页面的一行、一次请求、一个文件副本 |
| command / 动作请求 | 谁请求对哪个版本做什么 | event 是所声明的已发生事实；仍需核验来源与适用对象 |
| system of record / 权威记录 | 哪个系统负责哪项事实 | store 只说明保存位置；read model 可能滞后 |
| unknown / 未知结果 | 外部效果是否已经确认 | failed 表示已确认失败；timeout 不能直接释放占用或重新付款 |
| version / 版本 | 决定引用了哪组固定输入 | 当前访问权限（每次仍需重查）；对旧输入的批准（不延及新输入） |
| tenant scope / 租户范围 | 访问和资源按哪个主体隔离 | 法人、客户、患者、承租人、provider account、tenancy 各有独立身份 |
| effective time / 生效时间 | 事实对哪段业务期间有效 | occurred、received、processed、posted 时间回答不同问题 |
| acceptance / 接收 | 指定责任人按哪些证据接收哪段义务 | 机器执行结束、签署、客户签收、质量放行并非同一权威 |
| idempotency / 幂等 | 同一操作身份重试时应保持什么效果 | 不同操作、旧版本、外部未知结果（都不能只凭一次缓存命中判定） |

复合身份要写明在哪个范围内唯一。`(tenant, provider_account, object_type, external_id)` 是一种候选形式，具体包含哪些维度，取决于来源在哪个范围内保证唯一：一个人可以出现在多份租约中，一个集团可以有多个法人，同一个 provider 事件也可能涉及不同账户。主键里放了 tenant，服务端仍要做授权检查。

同一个原词在不同案例里含义不同。`hold` 在 H05 可表示等待，在 V18 是证据保全，在 V13 是资金占用；`release` 在 V08 是质量放行，在 V18 可以是解除保全，在 V19 是开票受理确认，在 V22 是资源释放。索引可以按原词查找，状态代码不统一改名。领域状态与 guard 以各例 lifecycle 和正文为准。

## 边的类型与方向

案例内部的边由 [关系定义](../../../vault/distilled/saas-engineering-atlas/relation-types.json) 规定类型和方向；案例之间连的是解题方法，见 [迁移地图](../../../vault/distilled/saas-engineering-atlas/transfer-map.json)。这两层图不能画成同一种业务流。先读边的类型，再读方向。

| 边 | `from → to` 的含义 | 读图操作 |
|---|---|---|
| `depends_on` | 后续工作 → 前提 | 求执行顺序时转为前提 → 后继；拓扑排序不解决人员容量 |
| `derived_from` | 派生结果 → 输入或证据 | 查来路沿原方向；找受影响结果沿反向邻接 |
| `owns` | 责任方/权威服务 → 对象 | 查谁确认该事实；负责方未必是存储方 |
| `stores` | 存储 → 对象/事件 | 查持久化位置；存储方不因此取得业务决定权 |
| `commands`、`requests` | 发起方 → 被请求方 | 查请求发往谁；确认走另一条路径 |
| `emits`、`delivers` | 产生方 → 事件 → 消费者 | 按可能重复、乱序处理；收到不等于业务完成 |
| `projects` | 对象 → UI | 显示新鲜度、冲突或未决项；屏幕不是另一个权威 |
| `contains` | 整体 → 部分 | 汇总数量或责任；不表示执行先后或资金流 |

例如 B `depends_on` A、C `depends_on` B，执行顺序可为 A、B、C；A 的输入更正后，沿反向邻接可找到需要检查的 B、C。从 A 可达的结果只划出检查范围，不会自动撤销签名、重做临床决定或批准返工。

状态转换记录在 `lifecycles` 中，每次转换都带 trigger、guard、durable_effect 与 recovery；转换方向以这里为准，与画面中箭头的动画方向无关。

## 证据身份

`source_fact` 只在 claim 指定的来源和 locator 范围内成立；`inference` 是作者推理；`synthetic` 是为演示构造的数值或系统设计，不描述任何厂商产品的内部实现。同一 URL 可以支持多条范围不同的 claim，合并 URL 时各条 claim 的限制分别保留。来源别名只用来认定几处来源指向同一份材料，与产品功能是否等价无关。来源、读取记录与原 ID 的解析见 [证据入口](../../../vault/provenance/saas-engineering-atlas/README.md)。

## 语义输入与分析层次

JSON 提供语义输入，解释与推理写在案例 Markdown 里。JSON 字段不规定 UI、图形、motion 或 Claude 的实现架构；使用这些数据的项目要保留 ID 和证据身份，新的设计决定记在该项目里。

企业机制中的 System Schema、Work Schema 与 Agent Context 是三个分析层次，分别描述系统能表达什么、工作怎样推进、这次执行实际读到了什么。三层各自对应成熟生态里已有的对象/接口模型、流程/动作契约、上下文与运行状态，本书并不提出一套取代这些生态的通用 schema 标准。展开说明见 [第三章 从系统结构到 agent 的工作上下文](enterprise-mechanisms/03-schema-tools-completion.md)。
