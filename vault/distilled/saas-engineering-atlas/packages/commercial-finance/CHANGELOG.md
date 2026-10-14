# P01 变更与执行记录

## 2026-10-14 · 交付工作开始

- 精确基点：`ae1827f34c6df067348d2454d7e5c9331ceda25d`，来源分支 `cloud/saas-engineering-atlas-20261014`。
- 交付分支：`cloud/saas-atlas-commercial-finance-20261014`。唯一写入范围为本 package；不改共同索引、其他包、CI、部署或 main。
- 范围：H01、H02、H03、V12、V13、V14、X02，原创中文正文、拓扑、证据、计算与失败检查。
- 已读取仓库 AGENTS、维护约定、writing skill 与成文/证据规则，以及 atlas 的指定契约和来源 catalog。
- 实际分工：主代理负责共同模型、H01、编订与验证；三个继承主代理模型的子代理分别负责 H02/H03、V12/V13、V14/X02。平台未提供子代理实际模型标识；未冒称使用 Luna/Astra。任务混合原始来源复核与成文，选择继承模型以保持案例推理与契约一致。
- 公开交付仅保留原创解释、合成数据与公开来源定位；不纳入聊天原文、私有用户资料、凭据或来源全文。
- 当前为早期持久化 checkpoint；本条不代表案例与检查已经完成。完整执行结果将在最终验收段记录。

## 2026-10-14 · 内容、证据与教学编订

- 完成七例正文/JSON，统一为“识题 → 解法 → 演算 → 验算 → 变式”；21条关键机制识别线索、七段下一步探索、19道变式练习均有适用条件与检查方向。添加README共同模型与Claude消费边界，不新增HTML或部署。
- 逐源记录合并为evidence.json：13个种子身份保留，15个新增公开URL；28条复核中26项读取指定正文、2项不可得；49条包内claims及H01引用的3个既有公共claim身份可追溯。
- 未获取ACORD原页（403）；FIX原seed www/non-www均404，使用单独登记的官方EP284出版物补证。两项未获取内容未产生source_fact。
- Stripe invoice overview的paid终态段落与该页状态表、Payment application专页有矛盾。保留原ID，并将重开条件限于专页描述的send_invoice与接口版本；未推断所有发票都能重开。
- 独立gpt-6-astra审阅全部七章并抽查Oracle容差、Mambu生命周期及Guidewire reserve审批。其发现的两项H02问题已采纳：练习一明确返回B10尚未修订分支；验收下修覆盖submitted/unknown在途付款，保留尝试与占用。随后明确匹配失效不自动释放已占数量。
- 主代理人工复算七例全部固定数值与练习；独立审阅另报告19项复算一致，未将此报告计入下述可复现自动化套件的测试数量。

## 2026-10-14 · 已执行的合成检查

`python3 vault/distilled/saas-engineering-atlas/packages/commercial-finance/checks.py`：18项unittest通过，覆盖七例的纯计算与约束。H01初版加H02/H03/V14/X02时为14项，补齐V12/V13后为18项；不把两次运行相加为32项覆盖。

明确观察到的错误算法/无效输入包括：100分三天逐日独立舍入仅得99；每张发票分别比较75件导致累计80件超量；净差0掩盖两条缺失；关账依赖环被拒绝；贷款按收到日而非生效日算得703.80而非702.89；保险先封顶后免赔误得7500而非8000；先舍入交易均价多出0.30；每账户独立取整多分1股；65股无法全部分成10股整手；两笔内部差额+10/−10仍是两项异常。反例被明确检出，不是把失败场景改成成功路径。

`python3 scripts/validate_saas_atlas.py --self-test`：结构检查通过，33个已有案例身份与6个包分配保持不变，结构实例8个（公共示例1个＋本包7个），8个故意损坏的结构样本均被拒绝。该命令不访问provider，不执行案例状态机。

`python3 vault/distilled/saas-engineering-atlas/packages/commercial-finance/validate-package.py`：唯一来源/主张、source-review-claim链接、成功读取状态、正文claim引用与至少两道练习检查通过。统计153个节点、288条边、47个对象生命周期、82条检查定义；这些数量不证明实现正确或业务覆盖完整。

共享registry使用`importlib.util.spec_from_file_location`加载`scripts/build_registry.py`，调用`build()`后按原脚本JSON序列化方式与`vault/registry.json`逐字比较，通过；未运行会写共享文件的脚本main。比较结果为127条distilled_messages、1017条source_records、991个unique_canonical_urls、229条citation_mappings。本包旁证按worker契约留待整合者合入共享来源层。

全仓校验、最终范围检查和远端核验结果在最后交付段追加。没有声称完成真实UI、数据库并发、重启、网络故障、外部API、AI eval或性能测试。

## 2026-10-14 · 全仓与交付范围验收

- `python3 scripts/validate_repository.py`通过：markdown 1744、json 415、snapshots 1105、errors为空。既有共享registry及来源统计未变。
- 在补齐最终教学入口和handoff后，重新运行atlas `--self-test`与包内`validate-package.py`均通过；没有把结构通过提升为事实、业务状态机或端到端通过。
- `git diff --check`通过；公开交付人工检查及定向凭据、签名URL、私有聊天标识扫描无命中。扫描不是通用保密证明，内容范围仍由人工限定为原创合成材料与公共定位。
- 最终交付20个包内文件；证据分片已合并并删除，只有evidence.json维护本包逐源记录。共享registry只在内存再生成比较，没有写共享索引。
- 实际远端SHA由交付后`git ls-remote`核验并在最终报告给出；handoff记录内容提交SHA，后续仅补充交付记录，不使用自引用SHA占位冒充精确提交。
