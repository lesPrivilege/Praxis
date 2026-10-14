# 共同词表与图语义

共同词表使问题能互相比较；领域词仍归属于自己的对象和制度。读到“完成”时，先补出主语：付款已分配、工单已接收、报告已批准或资源已退役。不同对象可以同时处于不同阶段。

## 名称来自哪一层

| 层次 | 保留的熟悉名称 | 读法 |
|---|---|---|
| 通用技术与领域术语 | transaction、idempotency、system of record、read model、DAG、work order | 采用通行名称解释问题；具体保证仍由上下文给定，不能仅凭名称推断实现 |
| 标准或参考模型 | SCIM、FHIR、DICOM、FIX、EPCIS、EDRM、OneRoster | 保留原名、版本与适用范围；标准数据交换不自动授予业务批准权 |
| provider 特定概念 | Snowflake stream、Stripe invoice、Ironclad Record、ServiceNow incident 状态 | 按对应来源的定义读取，跨产品映射需要显式说明差异 |
| 本书编订归纳 | 五步解题顺序、案例分组、typed transfer 分类、JSON 边枚举 | 帮助比较案例的教学组织，不作为行业标准或厂商内部设计的证据 |

`TERM:COMMON` 只是本书的查阅命名空间。“共同”表示多个教学位置使用同一个解释，不表示全部厂商采用同一实现或制度。已有名称能表达机制时沿用它，跨产品比较用映射保留差异；没有必要为每个熟悉机制再起一个名称。

## 身份、时间与权威

| 共同概念 | 用来判断什么 | 不能顺手合并的概念 |
|---|---|---|
| object / 工作对象 | 哪件工作有独立身份、状态与约束 | 页面的一行、一次请求、一个文件副本 |
| command / 动作请求 | 谁请求对哪个版本做什么 | event 是所声明的已发生事实；仍需核验来源与适用对象 |
| system of record / 权威记录 | 哪个系统负责哪项事实 | store 只说明保存位置；read model 可能滞后 |
| unknown / 结果未知 | 本地缺少外部效果的确认 | failed 表示已确认失败；timeout 不能直接释放占用或重新付钱 |
| version / 版本 | 决定引用了哪组固定输入 | 当前访问权限仍需重查；旧批准不能授权新输入 |
| tenant scope / 租户范围 | 访问和资源隔离的主体边界 | 法人、客户、患者、承租人、provider account、tenancy 各有独立身份 |
| effective time / 生效时间 | 事实对哪段业务期间有效 | occurred、received、processed、posted 时间回答不同问题 |
| acceptance / 接收 | 指定责任人按哪些证据接收哪段义务 | 机器执行结束、签署、客户签收、质量放行并非同一权威 |
| idempotency / 幂等 | 同一操作身份重试时应保持什么效果 | 不同操作、旧版本和外部未知结果不能只凭一次缓存命中判定 |

复合身份写明域：`(tenant, provider_account, object_type, external_id)` 是一种候选形式，具体维度按来源唯一性确定。把 tenant 放进主键仍不能替代服务端授权。一个人可以跨多个租约，一个集团可有多个法人；同一个 provider 事件也可能涉及不同账户。

`hold` 在 H05 可表示等待，在 V18 是证据保全，在 V13 是资金占用；`release` 在 V08 是质量放行，在 V18 可以是解除保全，在 V19 是开票受理确认，在 V22 是资源释放。索引允许按原词查找，状态代码不统一改名。领域状态与 guard 以各例 lifecycle 和正文为准。

## 箭头先读类型，再读方向

[关系定义](../../vault/distilled/saas-engineering-atlas/relation-types.json)约束案例内部边；[迁移地图](../../vault/distilled/saas-engineering-atlas/transfer-map.json)连接案例之间的解题方法。这两层图不能被渲染成同一种业务流。

| 边 | `from → to` 的含义 | 读图操作 |
|---|---|---|
| `depends_on` | 后续工作 → 前提 | 求执行顺序时转为前提 → 后继；拓扑排序不解决人员容量 |
| `derived_from` | 派生结果 → 输入或证据 | 查来路沿原方向；找受影响结果沿反向邻接 |
| `owns` | 责任方/权威服务 → 对象 | 查谁确认该事实，不能据此推断存储位置 |
| `stores` | 存储 → 对象/事件 | 查持久化位置，不能授予业务决定权 |
| `commands`、`requests` | 发起方 → 被请求方 | 表示请求已发往谁，确认另有路径 |
| `emits`、`delivers` | 产生方 → 事件 → 消费者 | 重复与乱序可能存在，收到不等于业务完成 |
| `projects` | 对象 → UI | 显示新鲜度、冲突或未决项；屏幕不是另一个权威 |
| `contains` | 整体 → 部分 | 数量/责任组合，不表示执行先后或资金流 |

例如 B `depends_on` A、C `depends_on` B，执行顺序可为 A、B、C；A 输入更正后，沿反向邻接找到 B、C 需要检查。可达只给出检查范围，不自动撤销签名、重做临床决定或批准返工。状态转换在 `lifecycles`，每次变化带 trigger、guard、durable_effect 与 recovery；它不由画面中箭头的动画方向决定。

## 从事实到案例构造

`source_fact` 只在 claim 指定的来源和 locator 范围成立；`inference` 是作者推理；`synthetic` 是演示数值或系统设计。同一 URL 可以支持多个不同范围的主张，合并 URL 时不合并其限制。来源别名只处理同一材料的身份，不建立产品功能等价关系。来源、读取记录与原 ID 的解析见 [证据入口](../../vault/provenance/saas-engineering-atlas/README.md)。

JSON 是语义输入，案例 Markdown 承担解释与推理；字段不限定 UI、图形、motion 或 Claude 的实现架构。ID 和证据身份应保留，新的设计决定在消费项目记录。

企业机制中的 System Schema、Work Schema 与 Agent Context 是三个分析层次：系统能表达什么、工作怎样推进、这次执行实际读到了什么。它们分别映射到成熟生态中的对象/接口模型、流程/动作契约、上下文与运行状态；不是一套替代这些生态的通用 schema 标准。展开说明见 [工作上下文章](enterprise-mechanisms/03-schema-tools-completion.md)。
