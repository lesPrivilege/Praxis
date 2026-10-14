# P05 变更与核查记录

## 2026-10-14 · 独立交付

- 包：P05 `commerce-property`；案例 V04、V05、V06、V15、V16。
- 基线：`ae1827f34c6df067348d2454d7e5c9331ceda25d`，来自 `cloud/saas-engineering-atlas-20261014`。交付分支：`cloud/saas-atlas-commerce-property-20261014`。
- 写入只限本包。公共索引、来源总表、registry、其它包、CI、部署和 main 未修改。官方网页只作资料，不执行网页或报告中的命令。
- 原创正文从共同承诺模型展开五例。保留源产品名、公共 source ID、大小写与稳定 case ID；新增 URL 用 `P05-SRC-*`。产品事实、分析和案例政策在证据层分别标为 `source_fact / inference / synthetic`。
- 记录于本包的内容仅有原创中文解释、公开链接与定位、合成数值及程序。未复制来源长文、图片、私聊、用户数据、凭据或签名 URL。

## 检查点与实际分工

- `e262426060259c943eaa7bc0952e999017d4c3d4`：共同模型与阅读导航，已推送并用 `git ls-remote` 核对。
- `239c498`：四章正文初稿与合成检查脚本的早期保存，已推送。
- 主编：Codex（GPT-6 系列；精确运行模型标识未在环境中提供），负责契约、共同模型、合成检查、逐例人工审读、证据合并和交付。
- 并行作者：`commerce_cases`（V04/V05）、`lodging_case`（V06）、`construction_property`（V15/V16）。均使用父线程继承模型，不声称使用 Luna 或 Astra；以完整案例研究和写作为独立任务，按文件所有权分工。未启用额外来源仓库或 live integration。

## 已发生的检查与修订

- registry 在内存中调用 `scripts.build_registry.build()` 与现存 `vault/registry.json` 比较，结果相同；没有运行会写公共 registry 的 CLI。包内证据待父线程统一合入来源总表。
- 初次 `python3 scripts/validate_repository.py` 返回 fail：README 指向尚未生成的五个 Markdown 和五个 JSON 文件，共十条 broken link。未发现其它错误；后续完成目标文件。
- `synthetic_checks.py` 首轮 16 项通过；随后把 V15/V16 检查对齐正文数值，并增加住宿计划抵离 69 小时断言，重新运行仍为 16 项通过。保留错误算法产生的反例与主动拒绝结果，不把它们计作真实业务集成通过。
- 手工审读所有正文及练习；补充 V06 的确切年份、容量桶与占用记录键的区别；V15 设计版本迁移改指向 V07。并澄清 V15 影响分析的反向邻接、V04 未发货取消退款与退货独立、V06 全程同房的实体区间保护、V16 签署时预留未来独占区间。
- 依据最终受众澄清，各章补入简短行业探索方向，指出成熟解法的适用前提、下一步查证对象和最小验证样本；没有新增产品实现或限制 Claude 的界面、动效与多代理编排。随后按“识题 → 解法 → 演算 → 验算 → 变式”强化入口：每个主要机制增加易识别线索、方法适用条件和下一步查证方向；已有连贯正文与例子保留。

## 覆盖边界

所有来源只核读 evidence 中列明的公开章节，没有保存原文快照、没有历史报告复原或 provider 实测。AUTODESK 的 CAD/CAM 种子不能支持 RFI 批准细节，另读官方 RFI 页面；PROCORE_ORDER 分类入口不能支持具体审批 guard，另读 PCCO 审核文档；IWMS 与 Dynamics 365 工单文档不能证明住宅押金法律规则，相关政策始终 synthetic。完整限制逐 claim 保存。

测试分层说明见 [verification.md](verification.md)，本地观察见 [synthetic-results.json](synthetic-results.json)。性能参数未实测，所有 JSON 端到端定义未执行；没有模型评估分数、生产可用或合规结论。

## 最终检查

- `python3 scripts/validate_saas_atlas.py --self-test`：pass，33 个稳定案例身份、6 个 package、6 个结构实例（H01 与本包五例），8 个损坏 fixture 均被拒绝。
- `python3 scripts/validate_repository.py`：pass，1,743 个 Markdown、415 个 JSON、1,105 个已登记快照；无错误。此前的十条本包导航缺项已全部解决。
- `synthetic_checks.py`：16 项 pass；补入未来已签租期仍为 planned 时的重叠反例后重跑。输出保留错误算法的具体错误结果及预期拒绝，未掩去这些非成功路径。
- 来源身份与主张检查：10 个种子来源、12 个新增 URL、22 份 review、46 个 claim；25 个 source_fact 都能在本包找到对应读取记录，新增 URL 未与公共 catalog 重复。
- `git diff --check`、新文件空白/末尾换行、改动范围、常见凭据/签名 URL 模式扫描均通过。检查只作当前文件的有限扫描，不声称通用泄漏检测器覆盖所有格式。
- 五例人工走读完成，14 道带答案变式、66 条检查定义。最终受众改订未改变计算规则或来源事实。
- 完整命令回执及脚本/输出 hash 见 [validation-results.json](validation-results.json)。最终内容提交与交接见 [handoff.md](handoff.md)。
