# P02 交接：人员、专业服务与接收

## 交付身份与范围

- Package：P02；案例 H04、H05、H06、V17、V18、V19、V20 全部具备原创中文正文与契约 JSON。
- 分支：`cloud/saas-atlas-people-service-20261014`。
- 已验证并推送的完整内容提交：`f94241ec998c3d6db36171b568fd12375be1223c`。该提交包含全部教材、结构、证据和检查；随后的封口提交只更新本 handoff 与 CHANGELOG。最终分支头由交付回复给出，并用 `git ls-remote` 核对，避免在提交内容中循环嵌入自己的 SHA。
- 精确起点：`ae1827f34c6df067348d2454d7e5c9331ceda25d`，来自 `cloud/saas-engineering-atlas-20261014`。
- 唯一改动路径：`vault/distilled/saas-engineering-atlas/packages/people-service/`。共同索引、其他包、main、CI 与部署未改动；没有合并到 main。
- 本包是 Claude 在既有 Praxis 基础设施内继续消费的教材与目录素材，不是运行中的 SaaS 或页面交付。正文包含“识题→解法→演算→验算→变式”入口、每个主要机制的识别线索与继续查证方向；不约束后续 UI、motion、布局或多代理编排。

入口为 [README](../../../../../projects/books/saas-engineering/packages/people-service/README.md)；七组正文/结构同名；[evidence.json](evidence.json) 单点保存来源、claims、边界与读取记录；四个 `checks-*.py` 保存本地合成模型；执行细节与审阅裁决见 [CHANGELOG](CHANGELOG.md)。分工证据片段已合并，未保留平行编辑源。

## 实际内容与证据

共 7 例、19 道有短答案的条件变化题。JSON 保留 actor/object/UI/service/store、typed edges、对象生命周期、算法 ID、claim ID 与可观察检查。算例逐一人工复算：H04 7000/修正−800；H05 50有效分钟与反向依赖；H06 3小时责任时间；V17 78/86/缺交/免交与修订84；V18 6实例/4内容/2交付；V19 3600候选/3000释放/600超额与unknown换版；V20 90+60分钟/应收500与两次booking。

实际读取了 24 个支撑主张的官方公开来源：14 个种子 ID 全部保留，补充 10 个官方 URL。另登记 3 个未用于主张的检索路径：Zendesk API 页面过大未读、Relativity 去重路径不可取、Purview classic hold 页因适用范围排除。证据侧车因此包含 13 个新增 URL 记录、27 条 reviews、46 条 claims（25 source_fact、19 synthetic、2 inference）。未复制第三方长文或图片，未存公开原文快照；locators 使用具体章节/字段与读取范围，不以产品首页支持 API 细节。

Provider 身份按产品/机制保留：Greenhouse、Okta、ServiceNow、Zendesk、1EdTech/IMS Global、EDRM、Wolters Kluwer ELM Solutions、Relativity、Microsoft Purview、Certinia、Dynamics 365 Field Service、PostgreSQL；没有按地域分组。重要范围差异包括 SCIM suspend 不产生同样的下游撤权，ServiceNow temporary workaround 可支持恢复，OneRoster 交换不授予成绩审批权，Dynamics 多booking状态聚合不替代本例范围接收，Certinia cap 示例版本与合成拆行政策分别记录。

## 实际执行角色

主代理编订共同模型、V20、探索方向、识题入口并整合验证；三个子代理分别负责 H04/H05、H06/V17、V18/V19 的研究、正文、JSON 与局部检查，均继承当前模型，未请求覆盖，运行接口未给出可核实的精确版本。独立 `gpt-6-astra` 按仓库偏好进行只读关键裁决。没有为重复枚举再开 explorer；记录实际分工，不把首选 Luna 写成已经执行。

Astra 的三项实质裁决全部采纳：H06 补充信息等待与方案确认等待分因；V18 撤回与发送认领按本地事务排序，认领之后保留可能已发状态；V19 cap 换版继承旧版有效unknown预留并使用合同级占用账本。V17 的改分与批准提交次序、V19 released/invoiced 的意义及 V18 O2 未决也已统一到正文与 JSON。

## 验证边界

四个合成检查脚本分别执行 18、27、18、14 项，共 77 项。覆盖确定算术、错误边界、权限/版本 guard、缺引用、乱序、重复、部分完成、未知结果与固定竞争顺序；H04/H05 和 V18/V19 还用 SQLite 保存后关闭重开。部分测试刻意运行错误方法并证明其输出违背不变量，不能把“测试通过”读成生产系统没有失败。

仓库 atlas 结构验证、其 8 个负向自检、仓库全量维护校验、共享 registry 只读重算比较、包内 claim/URL/范围一致性与 diff 检查的实际命令和结果在 CHANGELOG。只读调用 `scripts/build_registry.py` 的 `build()`，未执行会重写共享 `vault/registry.json` 的入口，遵守本任务只写包内的限制。

没有执行真实 provider/sandbox、浏览器端到端、生产数据库及真实网络并发、负载、AI eval、OneRoster 认证或法域合规检查。每篇的端到端表是未来实现的检查定义。AI 留出集与指标分母为设计或手算，未报告模型成绩。未安装依赖、未触发 CI、未部署。没有阻塞本次文档交付的事项；运行验证与专业规则确认是后续应用阶段的工作。

## 供整合者裁决的迁移关系

| 稳定迁移 ID | 保留机制 | 不能继承的条件 |
|---|---|---|
| `TR:H04:V17:person-membership` / `TR:V17:H04:membership-lifecycle` | 人员与有期间的成员关系分别建模 | 学籍、任职、历史保留与访问规则不同 |
| `TR:H04:V19:effective-rate` | 有效费率、冻结计算输入与修正 | 任职存续不等于客户可计费工时 |
| `TR:H05:H06:resolution-acceptance` / `TR:H06:H05:responsibility-handoff` | 动作、结果、接收与责任交接独立 | 服务探测与客户明确确认的权威不同 |
| `TR:H05:V20:partial-completion` / `TR:H06:V20:acceptance-evidence` | 子动作证据不能自动关闭总义务 | 现场技能、签认和需求范围需重查 |
| `TR:H05:V18:evidence-state` / `TR:V18:H04:release-versus-retention` | 局部关闭不消灭其他有效义务 | legal hold 的解除、数据处置不继承工单超时关闭 |
| `TR:V18:V17:identity-and-decision` / `TR:V17:V19:approved-inputs` | 内容/数值身份与决定版本分别保存 | 法律特权、成绩与费用批准依据不同 |
| `TR:V18:V19:delivery-and-spend` / `TR:V19:V18:effort-versus-acceptance` | 交付、工作量、收费与到账分别核对 | 专业裁决不能由费用审批代替 |
| `TR:V19:V20:capacity-and-window` / `TR:V20:V19:versioned-labor` | 资源约束与工作输入版本 | 日容量不保证现场时窗/路程可行；作业日志不自动成为获批timecard |
| `TR:H06:H01:unknown-action` / `TR:V19:H01:versioned-billing` / `TR:V20:H01:invoice-and-receipt` | 外部未知结果、账务身份、版本与付款分离 | 财务权限、合同额度与预付开通guard需分别决定 |
| `TR:V17:X01:scoped-identity` | 租户/来源/对象复合身份 | 同租户仍需课班与个人授权，key不替代权限 |
| `TR:V20:H06:acceptance-boundary` | 执行与接收分开 | 支持请求可能无booking，关闭依据需按业务重定 |

整合建议：共享术语可统一 command/event、unknown、版本与权威定义；不要统一 `release`、`hold`、`resolved`、`completed` 或 `acceptance` 的领域含义。Hold 在 H05 可为等待状态，在 V18 是保全义务；release 在 V18 可为解除，在 V19 是开票受理确认；时间区间法可以共用，计薪日历、SLA暂停、成绩期间和现场计费政策分别保留。源码/图形消费者应先确认 JSON 的 synthetic 边与 source_fact claim 边界，再决定可视化形式。

需要父线程处理：新增来源按 canonical URL 合并公共 provenance；将七例与选定迁移关系接回共享目录/学习路径；判断教育、保全、费用与接收术语是否需要独立 common term aliases。当前仅提出建议，未写共享索引，也没有为其他工作包代作裁决。
