# V02 审阅与执行回执

- 日期：2026-10-14。
- 父任务基点：`ae1827f34c6df067348d2454d7e5c9331ceda25d`；分支由父代理维护，子代理没有 commit、push、改共享索引或运行部署。
- 角色：独立案例作者、primary-source reviewer、合成检查实现者。实际模型标识未在任务环境暴露，沿用父代理配置，不猜测模型名。
- 文件：`V02.md`、`V02.json`、`evidence-v02.json`、`synthetic-v02.py`、本文件。证据交付以统一 [evidence.json](evidence.json) 为准；执行时的 `evidence-v02.json` 是父代理合并前的 V02 侧车，最终由整合者移除。
- 结构：24 nodes、39 typed edges、8 lifecycles、13 check definitions、3 transfer IDs；18 claims，其中 11 source_fact、7 synthetic。11 个用于主张的来源，2 个沿用公共种子 CTMS/EDC，9 个新增 URL。

## 逐源核查

全部 11 条 source_fact 均在本任务重新读取 primary public source 正文并记录 locator，没有用原恢复报告或搜索摘要替代正文。

| 来源身份 | 实际阅读范围 | 支持范围与排除项 |
|---|---|---|
| CTMS / Veeva CTMS | Improve Trial Visibility 主描述、入组/里程碑/监查与偏离段落 | 仅产品自述，未采纳性能百分比、合规宣传或具体栈 |
| EDC / Medidata Rave EDC | Rave 主描述、How Rave Moves Trials Forward | 仅采集、管理、清理、报告定位；不借此证明 Veeva EDC 的操作规则 |
| P04-SRC-fda-eic-guidance | 2016 指南 II Background，Q1–Q7、Q9 | 支持过程、提问、责任和版本信息；未完成全部现行法规或法域适用性分析 |
| P04-SRC-sitevault-consent-status | Participant Consent Status、Veeva eConsent Status、Tracing Signed ICFs | 区分概况与交付/签署/会签状态；并非所有表单要求中心会签 |
| P04-SRC-sitevault-reconsent | Reconsent a Participant 主文 | 新旧 ICF 的重签流程；不推导所有方案修改都要求重签 |
| P04-SRC-veeva-edc-queries | Types、How to Answer、Query Statuses | query 独立生命周期及限定的自动关闭条件 |
| P04-SRC-veeva-edc-signatures | 权限、When Can You Sign、Clear/Break Signature | 版本变化使签名失效；保留可配置 open query 下签署的反例 |
| P04-SRC-veeva-edc-locking | 主描述、权限、Disabled Actions、Lock/Unlock 各级范围 | 锁定限制；没有把签署或全部数据审阅当产品普遍前提 |
| P04-SRC-veeva-edc-freezing | 主描述、Available Actions on Frozen Data | freeze 与 lock 的动作集合不同 |
| P04-SRC-postgresql-locking | 13.3.2 Row-Level Locks、13.3.4 Deadlocks | 行锁与等待/死锁机制；临床 gate 是原创设计，未实跑 PostgreSQL |
| P04-SRC-postgresql-rls | 5.9 开头的策略、default deny、绕过规则 | 普通行访问及账号例外；没有据文档宣称本例已实现数据隔离 |

导航过程中旧地址 `https://cdms.veevavault.help/` 无法经 web tool 打开，随后从 Veeva 官方 Sites 帮助链接抵达 `https://cdmshelp.veeva.com/gr/sites/` 并读取上述正式操作页；未把失败导航页当来源或支持任何主张。未保存第三方正文、截图或图片到仓库。仅保存原创概括、公共 URL 与定位。

## 实际执行

1. `python3 vault/distilled/saas-engineering-atlas/packages/health-science/synthetic-v02.py`

   执行 13 项 unittest，13 项达到各自预期、0 unexpected failures、0 errors。一次记录的运行耗时 0.168 s，仅为该环境本次小样本执行时间，不是性能基准。覆盖三表固定 fixture、answered query、幂等与参数变更重放、值修改后改回、定义变更、新必需成员、旧签署回执、scope/role 拒绝、连接重建核对已提交 operation、两种锁定/改值顺序、双线程 query 插入与锁定竞争。

   第 12、13 项是 **坏实现反例**：计数相等仍遗漏 A3；无共同 gate 的先查后写产生 `locked=true` 且 `open_queries=1`。测试通过表示观察到了预期违例，不表示这两个坏实现正确。

2. 通过 Python `importlib.util.spec_from_file_location` 载入 `scripts/validate_saas_atlas.py`，用公共 catalog 加 `evidence-v02.json` 的 source/claim IDs 调用 `validate_case`。

   结果 `status=pass, errors=[]`。这是 V02 结构验证；完整 atlas 入口只读包级 `evidence.json`，需父代理合并后再运行，不能把本次独立调用当全包完成。

3. 用标准库 `ast.parse` 解析 `synthetic-v02.py`；核对正文 18 个 claim ID 与侧车完全一致；检查所有 source_fact 的 locator、source_ids、limitations；检查新增来源 URL 不重复。

   均通过。没有执行 `py_compile` 写入额外文件。

4. 对 V02.md、V02.json、evidence-v02.json、synthetic-v02.py 分别执行 `git diff --no-index --check /dev/null <path>`。

   四文件均无空白错误输出。本回执及最终补充段落也已通过空白检查；父代理整合后的仓库级检查另行记录。

## 手工走读与裁决

手工核对了十二份表的场景规模、三表版本演算、集合反例、定义标签变化、值改回仍产生新 revision、正常路径与超时/解锁恢复路径，以及三道条件变化题。共用一个绿色状态、旧签名充当新版本确认、回复自动关闭、跨用途同意继承、按回执到达次序覆盖数据、只锁已存在 query 行等反例均有对应解释或检查。

- 保留 `strict query→sign→lock` 为 synthetic policy；官方 Veeva EDC 配置反例说明为什么不可泛化。
- 把 H08 迁移落到安全响应授权，明确账号/设备隔离与紧急处置不能继承知情同意规则。
- 参与者签署与 PI 数据签署保留为两个对象/权限体系；摘要只证明内容比较，不冒充完整电子签名合规实现。
- 修改表单定义时同时说明解释依赖，不把“原始值未变”当作签名仍有效的证明。
- 正文技术选型是候选方案；没有把 React、Django、FastAPI、Spring Boot 或 PostgreSQL 归给任何 provider。
- 按后续用途澄清补入陌生试验的探索路线：先确认配置和专业策略，再区分 CTMS / EDC / eConsent/eISF 方案族，索取权限、版本与接口证据，在获准沙箱先验证关键边界；不规定 Claude 的页面、动效或协作实现。

## 执行边界与剩余缺口

合成脚本使用临时 SQLite 文件和 `BEGIN IMMEDIATE`，把整个文件的写入串行化，锁范围比正文 PostgreSQL gate 更粗。它未实现真实身份认证、同意引擎、完整不可变 revision 内容库、外部回执接收、受控解锁、导出任务、浏览器或消息系统；操作审计只记录模型动作，不能声称完整临床 audit trail。重建连接模拟已提交后丢响应，不是进程 kill 或磁盘故障注入。双线程只观察一次实际合法次序；另一顺序由确定性顺序检查覆盖，未穷举调度。

未调用 CTMS、Rave EDC、Veeva EDC 或 SiteVault 的 API/sandbox；未运行真实 PostgreSQL、UI E2E、缓存/导出隔离、跨系统补偿、负载、AI eval 或专业临床/监管复核。AI 方案的 120 样本和分层分母属于计划，无测得分数。性能数字是 synthetic workload 与目标，无性能结果。

跨包建议：V03 复用版本绑定与影响图时重查采样/方法有效性/放行权威；V01 报告修订保留历史与替代关系，另定临床通知责任；H08 保留动作范围和授权证据，另定紧急隔离规则。上述 transfer IDs 供父代理裁决，未修改别包。
