# Q4–Q5 research handoff

## 范围与数量

本批只处理 Q4 和 Q5。登记 15 个 URL 级来源记录，覆盖 15 个唯一 URL，保存 15 个直接 HTTP 正文快照，共 1,081,535 bytes；全部取得 HTTP 200，失败列表为空。德国四页各有独立 source slug，并以共同主题组和历史来源 ID `S26` 关联。`catalog.json` 的 `occurrences` 保持空数组，因为本批没有把历史 Chat 的 citation placeholder 当作已恢复映射。来源卡路径已登记，cards 由 main 后续生成。

快照只保存正文。动态页面的远端图片、字体、脚本、接口、默认分支完整仓库和任何未下载依赖均不宣称离线可用。S20 的 RRSI 快照是仓库当前默认分支 raw README，不是固定 commit。

## 可交给 main 的通行解法

以下是从正文抽出的可迁移设计建议，仍是 candidate/研究结论，不是已采纳规范。

Q4 的核心分层是：schema 合法性、业务正确率、概率校准、重复一致性、对抗鲁棒性和动作降级分别验收。TypeSafe 的 Score 语义是概率加权的等级位置，confidence 是从分布形状派生的统计量；二者都不能直接写成“答案正确概率”。Pydantic 包装还会把 rubric 的未取整位置按最近等级返回，半数进位，所以决策记录要同时保留 schema 输出、原始 `provider_details['scores']`、完整 `probabilities`、confidence、模型版本、rubric/policy 版本和输入版本。

严重度闸门应看严重等级的概率质量和漏报上界，而不是只看均值或四舍五入。一个人工构造反例（不是 Jev 实测）是 `P(0)=0.5, P(3)=0.5`：mean 为 1.5，但极严重尾部仍有 50%；另一个反例是 `P(1)=0.01, P(2)=0.99`，mean 为 1.99，但严重及以上概率为 99%。因此“低于 2 自动放行”不能作为一般规则。阈值要用独立业务标签、错误损失和人工负担校准，并按动作风险分层。

重复一致性要同时报告原始浮点/概率分布、选中标签和最终动作是否相同，保留 `uncertain` 和 parse failure；不能靠“重复到某次通过”，也不能只报弃权后的高一致率。S16 的 15 次、8 个 Choice 示例显示 top probability `<0.60` 进入人工能提高 policy agreement，但文档明确该阈值是示例 policy，重复性不等于正确性。网络不可用与语义不确定要分成两条降级路径：前者用超时/熔断/重试后进入已验收的本地模型、规则或人工；后者按 `allow/review/deny/unknown` 处理。不同模型或 primitive 的分数不能直接共用阈值。

Q5 的核心分层是：外部修改先保留原子 diff 和来源，进入候选区；候选要有版本号、父版本、假设、影响范围、反例、成本和回滚；只有独立评估通过并由有权限的发布者批准，才进入 active playbook。独立评估应对比原版、仅删除、仅新增和组合修改，冻结选择集后在未用于调参的 holdout/hidden set 上验收。提议者不能改验收集、评分器、硬性 policy 或自己的生效状态。S20 的 worktree、编辑历史、leakage critic、噪声 floor、成本规则和剪枝可作为研究参考；S22 的工作容器/隔离 verifier/hidden data 可作为评估结构参考。两者都是 RSI 研究材料，不是成熟法律治理。

权限隔离必须至少按客户、法域、事项和发布状态检查检索、摘要、提示、评估材料、候选日志和回滚对象，不能只检查最终答案里是否出现客户名。奖励黑客反例包括删掉风险警告来减少风险条目、把未核实数字写成确定公式、避开难例、修改评分器/隐藏集、记忆客户答案和把所有事项送人工来刷安全分；候选筛选要有不可补偿的法源/适用范围/权限/必检项门槛，再比较正确率、覆盖率、人工时间和成本。

法律范围只做概念核对。SGCA 53 将限制交易放在具体雇佣事实、可保护利益和两层合理性中审查，不能推出 SG/VN 通用补偿公式。德国 HGB §74(2) 的“一半”是竞业限制期间的年度最低补偿，不是制裁；§74a 还要求合法商业利益、不得不公平阻碍职业发展且期限不超过两年，§74b 规定月末支付、变动给付平均和费用排除，GewO §110 将 HGB §§74–75f 相应适用于雇主/雇员。若一个简单德国 fixture 已明确这些适用事实，`月薪 × 12 × 50%` 可是最低补偿的算术表达，不能因为出现 50% 就自动判为错误；但本批不足以确认特定合同、主体、给付基数或完整公式。OFAC FAQ 的 50 Percent Rule 是 blocked persons 对实体的直接/间接合计所有权和制裁后果，不能与竞业补偿混同。越南没有已批准法源，结论保持 `unknown`。

## 证据 ID 与本地定位

| 证据 ID | 支持的主张 | 本地定位 |
|---|---|---|
| S13-Q4-score-01/02 | Score 返回概率、加权 score、confidence；相同 score 可对应不同分布 | [S13 snapshot](snapshots/s13-typesafe-score.md.txt) 第 659–665、730–736 行 |
| S14-Q4-confidence-01/02 | confidence 来自分布形状；按风险分层动作和阈值 | [S14 snapshot](snapshots/s14-typesafe-confidence.md.txt) 第 143–179 行 |
| S15-Q4-limit-01/02 | Jev 1.13 的数字/日期/上下文/对抗/结构不变量限制 | [S15 snapshot](snapshots/s15-typesafe-jev-1-13-jaggedness.md.txt) 第 5–27、35–137 行 |
| S16-Q4-consistency-01/02 | 15 次重复、uncertain、0.60 示例；repeatability 不等于 correctness | [S16 snapshot](snapshots/s16-typesafe-consistency-choice.md.txt) 第 9–41、935–1015 行 |
| S18-Q4-wrapper-01/02 | rubric 半数进位、原始 `provider_details['scores']`、confidence/概率和自有标签校准 | [S18 snapshot](snapshots/s18-pydantic-typesafe.html.txt) HTML body 标题 A rubric is a set of ordered levels / Confidence and thresholds / Measure on your own data |
| S19-Q4-api-01/02 | bool/tool threshold、float 原始概率、不同 response details | [S19 snapshot](snapshots/s19-pydantic-api-typesafe.html.txt) HTML body 的 TypeSafeModelSettings 与 TypeSafeModel 小节 |
| S20-Q5-rrsi-01/02 | 编辑历史、泄漏审查、噪声/成本门槛、候选 worktree 与可审计裁决 | [S20 snapshot](snapshots/s20-rrsi-readme.md.txt) 第 15–54、81–92 行 |
| S22-Q5-rsi-exam-01/02 | visible iteration 与隔离 verifier/hidden set；专家编题和可信评分 | [S22 snapshot](snapshots/s22-rsi-exam.html.txt) HTML body 的 The evaluation pipeline / How a task is built |
| S24-Q5-reward-01/02 | reward hacking 可取得高分却未完成目标；研究中的不对齐迁移警示 | [S24 snapshot](snapshots/s24-anthropic-reward-hacking.html.txt) HTML body 的 From shortcuts to sabotage 与 realistic setup |
| S25-Q5-sg-01/02 | SG 限制交易的具体事实、可保护利益和双重合理性 | [S25 snapshot](snapshots/s25-sgca-2007-53.html.txt) HTML body paragraphs 1–14、44–48、69–79、84–98 |
| S26-Q5-de-74 | 德国书面形式、50%年度最低补偿 | [S26 §74](snapshots/s26-de-hgb-74.html.txt) 正文第 6–8 行 |
| S26-Q5-de-74a | 合法商业利益、职业阻碍与两年上限 | [S26 §74a](snapshots/s26-de-hgb-74a.html.txt) 正文第 6–9 行 |
| S26-Q5-de-74b | 月末支付、变动给付平均和费用排除 | [S26 §74b](snapshots/s26-de-hgb-74b.html.txt) 正文第 6–9 行 |
| S26-Q5-de-gewo-110 | 雇主/雇员范围和 HGB 相应适用 | [S26 GewO §110](snapshots/s26-de-gewo-110.html.txt) 正文第 6–8 行 |
| S28-Q5-ofac-01/02 | OFAC 50% 是 blocked persons 所有权/制裁概念，不是竞业补偿 | [S28 snapshot](snapshots/s28-ofac-faq-1521.html.txt) HTML body FAQ 398–402 |

## 未覆盖、争议与待补

- 附件 S12、S17、S21、S23、S27 未选入本批；具体原因和回查触发在 `catalog.json#gaps[0]`。
- 没有真实 Jev API 回放、独立中文/法律标注、校准曲线、置信区间、严重漏报率、服务可用性、国内网络或降级回放。
- 没有把 S20/S22 的研究结果升格为生产成熟实践；没有实际 IAM/租户策略、发布权限或不可篡改日志证据。
- 没有完成新加坡最新法源检索或完整德国法律意见；德国四页只用于检查简单 fixture 的概念边界。越南保持 `unknown`。
- 没有核查第三方合同、SLA、禁止测试、服务区域等传言，不能把它们写成事实。

## 晋升建议

可优先由 main 晋升为候选方法卡的，是“把 schema、正确率、校准、一致性、降级分开验收”“保留原始概率与未取整 score”“固定模型/rubric/policy/input 版本”“候选与 incumbent 隔离、选择集与 hidden/holdout 隔离”“评价器、硬性 policy 和发布状态不由提议者控制”“客户/法域/事项权限隔离”这组审查方法。它们仍需至少一个独立场景和本地验证证据。

暂不晋升为 kit 规范的，是 `0.60`、`0.8`、`0.9` 等示例阈值，任何 Jev 正确率/校准/优势数字，`月薪×12×50%` 公式本身，SG/VN 泛化，OFAC/德国法条的完整适用结论，以及 RRSI/RSI-Exam 的 benchmark 结果。main 的最终答卷应把这些保留为示例、候选或 unknown，并显示改变判断所需的新证据。

## 验收记录

- `python3 -m json.tool vault/provenance/ai-assessment-q45/catalog.json`：通过。
- 自定义逐文件校验：15 个路径、SHA-256、字节数全部匹配 catalog；通过。
- `python3 scripts/validate_repository.py`：未完成。脚本在共享的 `scripts/build_registry.py` 读取既有 Chat archive 时先失败：`KeyError: ('e7835cd0-51e3-481d-aad6-8115030f4dfd', 'e7835cd0-51e3-481d-aad6-8115030f4dfd')`；traceback 位于 `build_registry.py:71` 的 `chat_lookup`，尚未执行到本目录内容。没有为绕过该共享问题修改 registry、archive 或脚本。
