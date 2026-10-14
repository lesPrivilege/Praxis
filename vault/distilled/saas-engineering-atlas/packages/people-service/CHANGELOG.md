# P02 变更与执行记录

## 2026-10-14 · 写作 checkpoint

- 起点：`ae1827f34c6df067348d2454d7e5c9331ceda25d`，来自 `cloud/saas-engineering-atlas-20261014`。
- 交付分支：`cloud/saas-atlas-people-service-20261014`。仅写本包；不修改共享索引、其他包、main、CI 或部署。
- 主代理负责共享模型、V20、整合和验收；三个独立子任务分别编写 H04/H05、H06/V17、V18/V19。均使用继承模型，未请求模型覆盖；工具未暴露精确模型版本。任务需要直接写作和领域分析，未另开只做枚举的 explorer。
- 已读根 AGENTS、Kit 维护/架构/入账约定、writing skill 与中文成文/证据/审阅约定、atlas 共同契约、示例与来源目录。公共来源只作研究线索。
- 已直接读取 Microsoft Learn 的 `D365_FS`、`D365_FS_ARCH` 正文；逐主张范围在证据侧车登记。无 provider API、账号、真实用户数据或集成操作。
- 本 checkpoint 保存共享概念正文；案例仍在编写，不表示七例已验收。

## 2026-10-14 · V20 checkpoint 与独立复核

- V20 正文、拓扑、证据片段与本地检查落盘。算例为两项需求、两次预约、90+60 分钟、应收 500；取消预约不等于取消工作范围。
- `python3 vault/distilled/saas-engineering-atlas/packages/people-service/checks-v20.py`：14 个 unittest 通过；含 24 种日志到达排列、重复事件、缺序号、操作身份冲突、错误转换、部分接收、旧版本竞争、租户键、未知开票与模拟重启。
- 三个坏实现反例被明确展示：忽略依赖的最早空闲排程、经过时间代替工作时间多收费 20、完成或取消任一组合即当作范围接收。检查通过指正确拒绝/识别这些反例，不表示没有失败场景。
- 局部模型不运行真实 UI、数据库锁、消息网络、Microsoft API、负载或 AI eval；fake finance 与顺序交错不升级为真实分布式/并发测试。
- 主代理手工通读七篇正文，复算区间、权重、额度、身份计数与练习；另由 `gpt-6-astra` 承担只读关键裁决。已发现 H06 等待信息与等待确认需分原因、V18 发送前 epoch 预检不能消除撤回竞态，分工作者正在修订。

## 2026-10-14 · 七例整合、教学入口与最终验收

### 内容与来源

- H04/H05/H06/V17/V18/V19/V20 全部完成；共 7 篇教材、7 份拓扑、19 道条件变化题及短答案。按最新教学目的增加逐机制“识题线索→解法与演算→验算→继续查证”表，以及每例具体探索方向，供 Claude 在既有 Praxis 基础设施消费。未增加 HTML 实现或规定布局、motion、多代理编排。
- 结构数据共 165 节点、279 条 typed edges、40 个对象生命周期、69 条检查定义；这些是语义记录，不作应用覆盖率结论。
- 来源合并为单一 `evidence.json`：14 个种子逐源核查，10 个新增支撑来源，共 24 个支撑主张的官方公开来源；另登记 3 个未用于主张的检索路径。46 claims = 25 source_fact + 19 synthetic + 2 inference。保留产品名、种子 ID、locator、范围、版本差异和未快照限制。
- 3 个未用路径分别为 Zendesk Tickets API 页面过大、Relativity Deduplication 路径不可获取、Purview classic hold 指引已读但适用范围不合。没有以替代页面冒充原路径已核实，也没有把这些路径用于 source_fact。
- 证据分工片段合并后移除，公共来源目录与 registry 未修改。公开内容未含私有对话、真实用户数据、签名 URL、credentials 或第三方长文/图像。

### 人工复核与裁决

- 主代理通读七例，手工复算每个主算例和 19 道变式；检查对象权威、UI反馈、状态转移、技术选项的适用条件、失败轨迹及迁移边界。各篇明确原生业务责任，未机械复制同一可靠性段落。
- 独立 `gpt-6-astra` 冷读七篇及七份 JSON 生命周期。采纳 H06 两种等待原因、V18 发送认领/撤回排序、V19 跨cap版本unknown预留三项实质修正；同时明确 V17 改分/批准的提交顺序。对应正文、JSON 和局部检查已同步。
- 额外统一 V19 released 为已核对的账务受理、invoiced 为具体发票已核对；V18 的 O2 保持未决并排除本次交付。H05 移除只作来源参照而不参与合成运行的孤立节点，产品来源仍保留。
- 新增识题/探索入口手工对照正文：方法选择基于区间、候选图、版本、外部确认、额度和保留依赖，而非按厂商或地域编组。

### 实际命令与观察

以下命令均在 Praxis 根目录执行，使用 Python 标准库，无依赖安装。

| 命令 | 实际结果 | 主要边界 |
|---|---|---|
| `python3 -B vault/distilled/saas-engineering-atlas/packages/people-service/checks-h04-h05.py` | 18 tests，0 failures/errors | 固定区间、图/授权guard、SQLite持久化与stub；四类错误方法反例可见 |
| `python3 -B vault/distilled/saas-engineering-atlas/packages/people-service/checks-h06-v17.py` | 27 tests，0 failures/errors；5类故意错误反例 | 纯函数与内存guard、两种提交次序；不含真实数据库并发或完整消息重放 |
| `python3 -B vault/distilled/saas-engineering-atlas/packages/people-service/checks-v18-v19.py` | 18 tests，0 failures/errors；7类故意错误反例 | 含发送预检竞态、unknown换cap、SQLite关闭重开；竞争以确定顺序交错 |
| `python3 -B vault/distilled/saas-engineering-atlas/packages/people-service/checks-v20.py` | 14 tests，0 failures/errors；含24种日志到达顺序 | 固定排程、工作区间、接收和fake账务；三类错误方法反例 |
| `python3 -B scripts/validate_saas_atlas.py --self-test` | pass；33目录身份、6包、8 structured examples（H01+本包7例）、8负向自检、0 errors | 结构检查，不核实产品事实或执行业务 |
| `python3 -B scripts/validate_repository.py` | pass；1744 Markdown、415 JSON、1105 snapshots；0 errors | 仓库维护/链接/登记检查，未改既有快照 |
| 只读 `runpy.run_path('scripts/build_registry.py', run_name='p02_readonly_registry_check')['build']()` 与现有 JSON 对比 | 完全相等；1017 source records、991 unique canonical URLs | 不调用会写共享 registry 的脚本主入口；这些是仓库总数，不是本轮阅读量 |
| 包内一次性身份/引用核对 | 七例正文 claim 引用均解析；25 source_fact 均反向列入对应已读 review；19变式；0 errors | 补足通用 validator 不检查的正文claim回链，不把schema当内容质量证明 |
| `git diff --check` | 通过 | 格式检查 |

四个脚本合计 77 项；测试运行观察为 H04/H05 0.007s、H06/V17 0.001s、V18/V19 0.005s、V20 0.001s。这些只是小型本地测试耗时，不能引用为 SaaS 性能指标。错误方法的反例输出包括工资7700而非7000、SLA误报45而非50、原始分数相加得到73.3而非78、hash-first吞掉未决实例、cap换版误丢3000预留、现场经过时间多收20。

未执行：真实provider/sandbox、浏览器E2E、生产数据库/真实网络并发、负载、OR-Tools求解器、AI模型/eval、OneRoster认证与法域/机构合规检查。验收表和性能预算保留为后续应用的可执行目标，当前无运行部署。

## 2026-10-14 · 推送与封口

- 早期共享模型 checkpoint：`c2bf2bc97b90a009de934f213bc3114341cb4523`，已推送并核对远端。
- V20 正文/结构/局部检查 checkpoint：`8e42dfc`，已推送。
- 完整内容提交：`f94241ec998c3d6db36171b568fd12375be1223c`，`git push origin cloud/saas-atlas-people-service-20261014` 成功，`git ls-remote origin refs/heads/cloud/saas-atlas-people-service-20261014` 返回同一 SHA。
- 末次范围检查：22 个包内文件；相对精确起点及 staged diff 的所有改动均位于授权目录。凭据/签名URL模式扫描无匹配，人工检查未见私人转录或真实用户材料。
- 此封口只补交接记录。最终远端分支头在交付回复记录；未 merge main，未运行 CI 或部署。
