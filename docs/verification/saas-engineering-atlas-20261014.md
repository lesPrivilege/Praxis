# SaaS 工程全景 · 整合验收

## 交付范围与当前状态

2026-10-14。交付分支 `cloud/saas-engineering-atlas-20261014`，整合起点 `ae1827f34c6df067348d2454d7e5c9331ceda25d`。六个固定案例提交、foundations 与 enterprise-mechanisms 最终提交均已合并。案例、基础章与全书三份独立复核均已接收，26项问题完成定点修复并通过回归；最终定点独立复查仍待后续，当前回执不是独立终审结论。原始架构检查点记录见 [baseline](saas-engineering-atlas-20261014-baseline.md)。

教材唯一正文在 [Books / SaaS 工程全景](../../projects/books/saas-engineering/README.md)。Vault 保留结构、证据、合成脚本与作者历史。整合已建立共同开篇、4章企业机制、12章计算方法主线、七个业务问题、三条阅读路径、题型/解法/算法/栈索引、共同语义与 typed transfer 图；没有 HTML、main merge、CI 或部署。

## 固定输入

| 包 | 合并的完整 SHA |
|---|---|
| P01 | `699cc261d2e4407b5de78ee1879efdd850411439` |
| P02 | `4b930a71bf2f661c3746c2809505b12049571f8e` |
| P03 | `7284e10446337299766cb852d52bab3b977f4b02` |
| P04 | `1d14256792f66420f8c699e79d760c747bc743b6` |
| P05 | `98a6ec86c14e71901952453c5733813a85f37a81` |
| P06 | `2c73cc6856c1d2a17a58a94d3c38dcd63872e2a4` |
| Foundations recovery | `ee597ceaa3675f818746c6122353858872af17e4` |
| Enterprise mechanisms | `dc37f49302d8145006e62a111a7a06d10e1d6ca2` |

六包整合 checkpoint：`613cdfa3fa6deeb1fd697018a3599157b61c8164`。共同编辑 checkpoint：`58d6cb776efc3cd639d7b71916b51840e277108c`。实际角色为当前 Codex 整合者；本轮未另派子代理，也未把历史作者的独立审阅冒充本轮终审。后续独立技术与教学审阅由交付流程另行记录。

## 数量与检查口径

案例层有 33 个稳定 case ID、765 节点、1,376 typed edges、215 生命周期和 375 条检查定义。根部 H01 早期 fixture 另计，所以基础 validator 报 34 个 structured examples；它不是第 34 个案例。42 条精选 typed transfers 连接全部案例，92 条作者建议保留原位置。

来源数量以 [整合检查脚本](../../scripts/validate_saas_atlas_integration.py)实际输出为准：案例来源整合为 146 canonical URL、150 原 ID、162 条包内 reviews；另有三个直接读取的编订流程来源。295 条案例及基线主张保留原范围，编订流程另有三条，不为 URL 去重合并各 claim 限制。基础种子、包内新增、当前可变 URL、固定版本及失败记录均有身份。

两部分加入及复核修订后，统一目录为211 canonical URL、219原 source ID、231 reviews、405 claims；按 `evidence_kind` 为230 source_fact、146 synthetic、29 inference。Foundations有40个来源，enterprise有17个；原 source/claim/review 身份和范围全部保留。Foundations 的原 `kind` 另以明确映射供统一筛选，不改写原证据字段。

| 执行动作 | 本轮实际结果与边界 |
|---|---|
| 所有已交付 Python 入口 | 21个入口通过：六包15个，foundations2个，enterprise行为与内容验证2个，两组复核修复回归各1个 |
| Foundations复跑 | 12章、18组样例、33案例与8算法家族覆盖；18,462组小输入/场景对照通过，18个损坏期望值被拒绝 |
| 合成检查分母 | P01 18；P02 79；P03 71；P04 53；P05 16；P06 34，合计 271；类型含 unittest、断言、有限枚举和本地 SQLite，不折算生产覆盖率 |
| Enterprise复跑 | 4章、2工作链、14变式、33案例连接、17来源/17reviews/27claims通过；37个unittest方法通过（含新增回归），两条工作链均使用fake和本机HTTP适配器，SQLite双连接竞争与持久化重开已执行 |
| Atlas 结构校验 | 通过；8 个损坏副本被拒绝 |
| 整合校验 | 通过；6 个迁移图损坏副本被拒绝，检查别名、主张保留、导航与全案例连接 |
| Registry 重建与仓库校验 | 通过；Books 已加入仓库维护范围；当前 1,853 Markdown、493 JSON、1,105 snapshot 检查通过 |
| 白名单与公开面 | 只检查本任务增量；不对历史仓库已存内容作新的披露判断 |

机器命令与原始输出另见 [执行回执](saas-engineering-atlas-20261014-checks.json)。375 条案例验收定义与 271 条已运行合成检查分别计数；没有将 AI 留出集设计或浏览器 E2E 表格当成执行结果。Enterprise的本地工作链闭环与loopback HTTP确实执行，但没有连接外部provider。

## 人工阅读与复算

从 Books 开篇，经题型/迁移索引进入以下代表性片段，逐项看了识题、计算和条件变化的衔接。它是整合者手工走读，不是独立读者实验，未对教学效果作对照或留出验证。

| 路线片段 | 独立复算与变化题 | 判断 |
|---|---|---|
| 企业机制 → 前端 → agent工作 → 实施 | EM-E01承诺12×80000=960000分，合格9台对应720000分，预付30%为288000分；9/10=90%、9/12=75%。EM-E02配置4→6、版本8→9，10/10探测与负责人接收各自成立；切换12+5+2+1=20→12+6+1+1=20。两年成本16与52人日，差36；节约27.5不足、55超过差额；5/6任务通过≈83.3% | 手工读完四章，复算两条链与实施变式；统一folio含义，区分编订schema层次和成熟生态定义，校正“定制节约”的题干与指标分母措辞 |
| O7 → 方法章 → 行业例 | 3次×40，完成2次，取消1次后义务数量为2+0+1=3，退款40仍等外部确认；Top-2为E/A而非同分C；依赖最早工期7，B/C共享人员后10；预算5选A+B价值7，选C分支的松弛上界6.5；ANN候选A/C与精确A/B交集1，recall@2=1/2；评估TP18/FN2/FP4/TN16，precision18/22、recall18/20、accuracy34/40 | 手工读完12章并复算代表例；操作unknown到confirmed、方法前提与行业变式相接，未把配套枚举计成独立审阅 |
| H01 → V04 → V20：承诺拆分与接收 | H01 第20日 `27000×20/30 + 9000×8/18 = 22000`，取消新增未来部分 `9000×10/18=5000`；退款未知时现金仍36000。V04 优惠分配 `286×3+72+71=1001`，实付总额12999；杯盖分两次退928与929，不受新价1200影响。V20 `90+60=150`分钟，人工300加零件200得500；固定费变式下收300仍欠200 | 金额守恒不证明实物交付；执行完成不替代接收；退款确认与权利结束分别解释 |
| H07 → V03 → V09：更正与证据 | H07 D1为100+120=220；D2取消A并补入B后80+120=200；首次完成口径变为100+80+120=300。V03 `(18−1)/2=8.5`，加U=0.3得到8.8；18.6AU得8.8但上端9.1须复核。V09 S/P/D/R=4+6+5+1=16；T/D共享单许可证时2+5串行，总18 | 输入版本、口径和当前权限分开。影响集合需反向邻接，T1@50受40分钟后的漂移影响，T0@20不能仅因通知晚到判无效 |
| V06 → V19 → V21 → V22：区间、额度与可行性 | V06房费400归公司、个人餐费60−预付100=−40，个人应退40；未capture授权80不算实收。V19新cap10600−released7000−unknown reserve3000=600。V21容量10时两种可行成本270/254；容量9时总容量18仍无法装入不可拆6/5/5三单。V22固定费1500+超量400=1900；按比例额度5GB时1500+7×200=2900 | 日期/资源/责任账户各有边界；未知预留跨版本继承；总量足够不证明组合可行；技术退役延迟不自动延长商业计费 |

手工检查了正常路径和反例对应的对象；脚本提供可复跑局部模型。未逐一复核全部 provider 文档，来源整合保留作者实际读取范围；新增编订参考由本轮直接读取，见 [方法说明](../../vault/provenance/saas-engineering-atlas/editorial-method.md)。

## 整合裁决与继续研究

- `depends_on` 与 `derived_from` 均指向前提/来源；调度和影响分析分别按需要转换方向。迁移边从学过的案例指向变式，不能混入运行图。
- tenant、法人、provider account、业务 party 与 tenancy 不合并。`release`、`hold`、`acceptance`、`completed` 保留领域对象范围。
- URL 只按精确 canonical 或明确跳转合并；保留全部旧 ID。PostgreSQL current 与18的不同登记未凭猜测合并。Stripe invoice 总览与 payment application 的差异保留限定，不把重开规则扩大到所有发票。
- 真实 provider/sandbox、浏览器 E2E、生产数据库隔离、负载、AI eval、专业法域政策与现场制度均未执行或裁定。部分脚本执行了SQLite，enterprise还实际运行loopback HTTP、两个SQLite连接的竞争和关闭重开；不能误写成完全未运行数据库或网络。
- 公开来源全文未快照；ACORD、DICOM overview、部分 SAP/标准门户和动态 API 文本缺口保留在 reviews。一个替代官方页面成功不消除原入口失败。
- 缩写首用与独立标签按 [术语回执](saas-engineering-atlas-terminology-review.json)复核：保留原语言、产品名和代码身份，中文解释仅进入编订层。
- Foundations 最终提交已接收且移入 Books；其首次导航检查发现旧 Vault learning-path 链接，随章节迁移修复，覆盖验证器改为解析 curriculum.reader_root，未放松12章/33案例/8算法/40来源的检查。Enterprise最终提交也已接收，8页教学正文迁入Books。其内容验证仍检查4章/33案例/17来源；原作者写入范围改为检查固定author SHA，读者引用按章验证公共URL、claim与来源映射。三份独立技术与全书复核已导入；26项修复后的定点独立复查待后续。

## 读者正文的编订

按后续用户要求移除分工说明、可视化制作指令、重复的测试免责声明和正文中的不透明 claim 编号；完整主张身份仍在 JSON 与 evidence，读者保留直接公共引用和按需证据入口。公式、数值、领域政策、重要反例及来源限定保留。部分定点调整见 [编辑侧车](saas-engineering-atlas-editorial-changes.json)，完整差异以 Git 为准。

编订区分解释正文、标题、图内标签、图注与操作文字；未把段落机械拆块，也未提前生成固定 UI 文案。Claude 最终可根据图文分工重写，证据和论证保持可追溯。

## Enterprise整合修复

整合者发现 `OperationJournal.dispatch` 的迟到异常会无条件写入unknown：若另一个核对者已经保存applied，确认可能被覆盖。先增加确定性交错回归，UnknownResult、ContractError、RuleError三个子情形均失败；再用事务内条件更新，仅允许sending→unknown，已有外部证据保持。原36个方法与新增1个方法共37个全部通过。回归位于企业机制的 `test_late_send_failure_preserves_concurrent_confirmation`，不是生产并发穷尽证明。

Enterprise原始 `verification.md` 与 `validation-results.json` 保留作者36项结果；本轮37项及完整命令输出以本页和统一执行回执为准。后续独立技术复核的修复记录见下节；整合者修复不冒充独立终审。

## 独立技术复核与定点修复

从案例复核 `5c5f7098561d4d87403986d6c3edf58cde20a5e7`、基础章复核 `b97d728bd2a2abe4687203592ac1341242f07333` 仅导入各自的 review 目录，13个原文件逐字节比对一致，未合并它们的其他分支内容。两份原脚本在各自冻结输入的临时隔离目录复跑，历史数值与已发现缺陷均复现；这些脚本不是修复后通过标准。[历史复现记录](../reviews/saas-atlas-repairs-20261014/historical-reproduction.json)与[逐项处置](../reviews/saas-atlas-repairs-20261014/dispositions.json)分别保留。

IR-01–08修复两个身份冲突 guard、计费输入域、返聘旧任务派发验证、空引用、FHIR版本、残留标点和GiST前提。R1–R6修复恢复轨迹的实际数据库观察、缓存变式计数、helper复杂度、输入条件、B-tree平衡与占用解释，以及稀少阳性评估变式。原示例推导、33例身份、provider名称与8份作者原始evidence均保留。7个旧Vault路径仅为原审阅的历史导航记录，不含第二份教材正文。

新增回归入口的15个unittest方法通过，包含12,288个三节点有向图/起点组合与独立简单路径枚举的比较，以及3个必须失败的恢复实现变异。H04另增加2个实际假目标派发/核对方法，纳入P02的79项。基础章原18,462组对照与18个损坏期望值检查继续通过；它们和新回归分母分别报告，不把数量相加为覆盖率。精确结果见[修复回归](../reviews/saas-atlas-repairs-20261014/regression-results.json)。

重新打开三份FHIR R5资源页及PostgreSQL18范围约束、GiST名称定义页，仅新增所读范围和主张；先前source ID、URL和失败记录不改写。规范化结果见[修订证据](../../vault/provenance/saas-engineering-atlas/repair-evidence.json)。没有执行PostgreSQL DDL，也没有由文档阅读推断真实医疗或订房流程通过。这14项的原修复记录保留；其后已接收独立全书复核并处理新增12项，见下节。

## 全书复核与追加修复

从 `7aa7da4c9f64d589733a1feb3e14e8697c101e1e` 导入全书复核的15个文件，逐字节比对一致。原审查覆盖49个章节正文，冻结输入为 `cd8d77b6166a6fc566f6aa09b4d9af3e11537408`；两支原脚本在该提交的临时归档中复跑，JSON与原记录完全一致。历史观察及其中缺陷保留在[原审查](../reviews/saas-whole-book-review-20261014/README.md)，不作为修复后的通过条件。

[WB-01–WB-12处置](../reviews/saas-whole-book-repairs-20261014/dispositions.json)补齐固定10/10验收政策、矛盾回执诊断、V21每请求数量、H03→V07迁移、迁移后的命令入口、25个术语、floor/clamp与零基下标、额外制作叙述清理、9+1+2数量分离、实际回执字段、r4新意图身份及X01缓冲答案授权边界。Books与结构数据同步；原33例ID、provider名称和8份作者evidence保持。新增术语在16页共26处首用解释，共享词表现有83项；原语言名称、CU合成单位与专业前提分别保留。

新增14个unittest方法通过，分别记录验收、回执与r4在fake/本机HTTP两种适配器上的结果，以及冲突记录关闭重开、串行预留重试、计算规则和答案分块/回放授权轨迹。V21模型区分版本冲突与库存不足，没有宣称真实数据库并发；X01同步假接收者覆盖首块之前、块间及重连前撤权，没有执行真实SSE。此前15个修复方法、37个enterprise方法和所有原包检查继续通过；完整结果见[新回归回执](../reviews/saas-whole-book-repairs-20261014/regression-results.json)。

人工重走 finance README→checks、V02→Vault脚本与H03→V07迁移；复算16+16抢16只能一项成功、10+6重读版本后可全部成功，以及100分三段为33/33/34。对照enterprise正文与实际线协议确认：前提8来自本地意图，结果9来自回执；9台合格、1台待验收、2台未到货不混称未交付。逐段读回制作叙述删除处，保留变式和专业限制。X01先缓冲校核、再逐块检查当前授权；完整交付与已消耗成本分别计录，撤权不抹掉先前合法交付。

Procore、ServiceNow与Synopsys的一手页面只复核所引名称与用途，新增范围见[全书修订证据](../../vault/provenance/saas-engineering-atlas/whole-book-repair-evidence.json)。原主张限制、失败记录与来源身份未覆盖。新修复状态为fixed-pending-targeted-independent-recheck；没有当前执行阻塞，最终独立定点复查由后续流程完成。Claude的写作、UI、交互、motion和多代理自由保留在既有交接页，不追加视觉约束或全量重审任务。
