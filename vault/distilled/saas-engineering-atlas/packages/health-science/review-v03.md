# V03 · 作者核查与执行记录

日期：2026-10-14。角色：完整案例作者、primary-source 研究者与合成检查执行者；继承父代理模型，当前工具未暴露可独立核验的具体模型标识。写入范围为父代理分配的五个 V03 文件；未执行 git commit、push、merge、registry 生成或任何外部集成。父代理负责证据侧车合并、工作包交接和分支交付。

## 交付范围

- [V03.md](../../../../../books/saas-engineering/packages/health-science/V03.md)：原创中文教材；共同对象模型、并行生命周期、权限与交互、曲线/QC/判定/失效图演算、故障恢复、技术选择、规模假设、检查、三道条件变化题和行业探索入口。
- [V03.json](V03.json)：27 个节点、62 条有类型边、13 个生命周期、14 个检查定义；所有实现拓扑均为 synthetic。
- [evidence.json](evidence.json)：5 个来源读取记录（已有 LABWARE + 4 个新 URL），18 条主张，其中 source_fact 8、synthetic 9、inference 1。
- [synthetic-v03.py](synthetic-v03.py)：21 个 Python 标准库合成测试方法，包含预期拒绝与 known-bad 策略反例。

## Primary-source 核查

| 来源 | 实际读取范围 | 支持范围与限制 |
|---|---|---|
| `LABWARE` | 官方 QAQC 页面 Sample Management、Lot Management & Release、COAs、Instruments、仪器 FAQ | 保留 LabWare QAQC SaaS LIMS 身份；只支持厂商功能自述，未验证 API、产品实现或合规。种子本次成功读取，无不可读种子缺口 |
| `P04-SRC-fda-oos-2022` | 正式 PDF IV.A–B，重点印刷页 6–8；读取重测/重新取样上下文 | OOS 调查、预定重测与保留初始结果；不把药品指南升级成通用法律判断 |
| `P04-SRC-fda-data-integrity` | 正式 PDF Q1b–c、Q2、Q7–8、Q12，旁读相关 Q10/Q13–14 | metadata、audit trail、作废记录保留与复核；不证明本例符合 CGMP 或 Part 11 |
| `P04-SRC-who-qcl-2024` | 正式 Annex 4 PDF glossary、5.33–5.44、6.33–6.40、6.51–6.67、6.76–6.93 | 设备状态、记录、药典判定边界、OOS、报告修订与 CoA；未读取全部 88 页附录，不使用旧工作草案代替正式附件 |
| `P04-SRC-postgresql-rls` | PostgreSQL 18 当前文档的策略语义、绕过角色及引用完整性限制段 | 说明 RLS 的权限边界；未运行 PostgreSQL |

每条 substantive source_fact 均有此次实际读到的章节/页面 locator，完整限制保存在证据侧车。原始网页正文、图像与报告未复制入仓库；没有保存私有资料、凭证或带签名的 URL。

## 实际执行

| 命令或检查 | 观察到的结果 | 证明边界 |
|---|---|---|
| `python3 vault/distilled/saas-engineering-atlas/packages/health-science/synthetic-v03.py` | 最新一次 21 tests，`OK`，exit 0；测试运行 0.130 s | 纯计算、局部 guard、SQLite 文件重开、确定性交错与显式仪器 stub |
| 调用仓库 `validate_case`，使用 `evidence-v03.json` 合成来源/主张集合 | `pass`、无 errors | 最初 V03 单例契约结构检查；不是事实或业务验收 |
| `python3 scripts/validate_saas_atlas.py --self-test` | `pass`；33 cases、6 packages、63 catalog sources、4 structured examples、8 negative self-tests | 读取父代理当时合并的证据；不执行 provider/UI/性能 |
| `git diff --check -- <五个 V03 文件路径>` | 无输出，exit 0 | 已跟踪改动的空白检查；最终整合由父代理复核 |
| `python3 scripts/validate_repository.py`，review/handoff 尚未落地时 | exit 1：V03 链接的 review 文件缺失，以及 V01/README 链接的 handoff 缺失 | V03 review 随本文件创建修复；包级 handoff 由父代理负责。最终整合检查结果记录在包级交接 |

21 个测试没有把坏输入算作业务成功。`test_03/04/05/06/08/09/10/12/16/20` 检查退化曲线、外推、QC 失败、区间终点、OOS、无依据作废、混样、内容冲突、旧快照和批准后撤销会被拒绝或阻断。`test_19` 实际运行三个已知错误策略，确认它们与正确 guard 分歧：只取末次结果会掩盖 OOS；忽略 U 会误判 8.8 mg/L；按导入时点会误拒绝第 50 分钟采集、第 90 分钟导入的结果。

## 独立审阅后的修正

父代理转回的独立冷读指出两项实现与正文不一致，均已采纳：

1. 原合成脚本签署直接写 `issued`，掩盖批准后、发出前的异步窗口。现改为保存 `approved`，独立分发 gate 再核对证据 epoch 和批次状态；拓扑补 `approved → distribution_hold`，新增 `test_20` 确认撤销后不创建分发意图。该测试不模拟实际文件生成或发送；已经在途的外部请求仍需核对，不能从本地状态推断对方未收到。
2. 原导入表只用 tenant + acquisition，与正文完整身份不一致。现补 tenant + instrument + run + acquisition 组合键；`test_21` 确认同租户不同仪器、不同运行可复用 acquisition ID，同一完整键异摘要会拒绝。

正文另明确 `blocked`、`review_required` 和 `oos` 不通过无痕原位修改恢复。修正或再采集产生新的版本/运行；具名调查决定引用旧事实与新依据。补了三行“识题线索—解法与验算—下一步研究”表和面向行业方的探索段，保留本地 Claude 对界面与动效的选择权。

## 手工核对与剩余缺口

手工逐项核对了：40 mL = 10 + 10 + 20；三标准点的拟合分子 100、分母 50、斜率 2、截距 1；18/18.6/19.4 AU 对应 8.5/8.8/9.2 mg/L；QC 11.2 AU 对应 5.1 mg/L、偏差 0.1；U=2×0.15=0.30 mg/L；8.8+0.3=9.1 的边界；半开校准区间的 59/60 分钟；20 万项/日、10 分钟 2 万项约 33 项/秒、1 MB/项约 200 GB/日。三道变式均给出保持条件、失效条件、反例和可观察检查。

未执行浏览器 UI、真实 LabWare、真实仪器/ERP、PostgreSQL 行级安全与实际并发、对象存储隔离、电子签名、负载、断电恢复、进程强杀或 AI eval。SQLite 两连接测试采用确定性交错，不是同时多线程压力实验。文件重开是持久化模型，不是硬件宕机证明。图循环 fixture 只证明遍历终止，未实现业务层禁止非法循环的写入检查。OOS 作废测试只检查理由与复核身份是否存在，不能判断理由科学上成立。`fit` 为可读性保留输入列表，实际使用 O(n) 内存；正文所述 O(1) 累加空间是可选实现分析。

临床/法规/具体方法适用性、样品代表性、真实不确定度评估和生产部署仍需对应专业人员及实施证据。本例明确非药典的 `c + U` 规则不能套用 WHO 药典规则。暂无阻断本轮教材交付的资料缺口；实施相关缺项均保留为后续验证范围。

跨包建议保留 `TR:V03:V02:version-bound-review`、`TR:V03:V09:dependency-invalidation`、`TR:V03:V10:equipment-eligibility`、`TR:V03:X01:scoped-evidence`，并分别保留同意/校准、构建/样品、维护完成/批次有效、共享数据/授权交接的类比断点。
