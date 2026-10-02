# 论证节点与表达方式

来源为[结构重组讨论与上游裁决](../frontend-design/explanation-visualization-index.md)。本表在问题—答案树之后选择表达方式，供Claude决定具体编排；标明的是采用方向，不是新增图表已完成或视觉通过。已有图能承担关系时直接调整，连续正文成立时保留正文。

| 节点 | 要说明的关系 | 表达方式 | 必须显现的关系与条件 | 上游参考 |
|---|---|---|---|---|
| [Q1.1](rendered/AI交付能力测试-answer-孙广昊.html#q1-working-set) | 信息保留与更新 | 带回写的流程图 | 对象分组区分长期状态与按需材料，箭头标出选入、执行和回写；版本条件邻近回写。 | `show-me` |
| [Q1.2](rendered/AI交付能力测试-answer-孙广昊.html#q1-cache-paths) | 比较不同加载位置的差额 | 三路径对照表 | 同一批旧内容对齐比较，共同假设邻表；未测目录路径不画定量长度。 | `data-visualization` |
| [Q1.3](rendered/AI交付能力测试-answer-孙广昊.html#q1-test-supply) | 区分改动的因果贡献 | 控制变量表 | 改什么、固定什么、测什么形成三列，不能用步骤箭头暗示三项必须依次实施。 | `show-me` |
| [Q2.1](rendered/AI交付能力测试-answer-孙广昊.html#q2-routing) | 按条件分配处理方式 | 条件分支图 | 确定算法、生成难度和缺证分别通向处理方式；不画成模型能力的等级阶梯。 | `show-me` |
| [Q2.2](rendered/AI交付能力测试-answer-孙广昊.html#q2-latency) | 区分计时终点与产品目标 | 共同起点的事件序列＋独立目标表 | 四个终点共享请求起点；事件若画成序列，不按未测时长配置距离。初始目标单独标明。 | `data-visualization` |
| [Q2.3](rendered/AI交付能力测试-answer-孙广昊.html#q2-unit-economics) | 比较整项任务成本 | 共同尺度的成本分解 | 人工与AI辅助共用0–60元尺度；未计错误损失保持未知，不能画成零。 | `data-visualization` |
| [Q2.4](rendered/AI交付能力测试-answer-孙广昊.html#q2-trust) | 说明信任怎样得到支持 | 连续正文，必要时以一条记录示例补充 | 从材料版本推到动作差异，再到回执，保留因果承接；没有具体数据时不增加仪表盘。 | `show-me` |
| [Q3.1](rendered/AI交付能力测试-answer-孙广昊.html#q3-authorization) | 确定授权范围 | 动作后果对照 | 已覆盖与需核对的动作分组，确认对象、内容版本和期限邻近呈现。 | `show-me` |
| [Q3.2](rendered/AI交付能力测试-answer-孙广昊.html#q3-unknown) | 决定失败后下一步 | 状态分支树＋失败决策表 | 边上说明核验条件；unknown不能直接连到重发；幂等有效期与参数条件紧邻重试。 | `show-me` |
| [Q3.3](rendered/AI交付能力测试-answer-孙广昊.html#q3-remove-wizard) | 检验是否可以删步骤 | 连续论证＋消融比较条件 | 一次删一步、留出任务、风险上界与减负共同构成接受条件；不伪造实验结果图。 | `show-me` |
| [Q4.1](rendered/AI交付能力测试-answer-孙广昊.html#q4-distribution) | 揭示均值隐藏的严重尾部 | 同尺度分布小多图＋精确值 | A/B共用等级与概率尺度，均值和严重尾部同时可见；保留构造例子身份与原始向量。 | `data-visualization` |
| [Q4.2](rendered/AI交付能力测试-answer-孙广昊.html#q4-independent-eval) | 限定验收覆盖 | 验证对象与证据矩阵 | 最终标签、字段和中间量对应所需检查；不把未执行的检查画成通过状态。 | `visual-explainer` |
| [Q4.3](rendered/AI交付能力测试-answer-孙广昊.html#q4-repeat) | 定位不一致发生在哪层 | 输入条件—数值—标签—动作的核对关系 | 区分实验控制与业务后果，保持稳定性和独立情境数量的区别；正文承担解释。 | `show-me` |
| [Q4.4](rendered/AI交付能力测试-answer-孙广昊.html#q4-fallback) | 区分两种失败原因 | 并列双路径 | 网络可用性与判断证据各有条件，共同动作集合不意味着阈值可互换。 | `show-me` |
| [Q5.1](rendered/AI交付能力测试-answer-孙广昊.html#q5-atomic-diff) | 区分删除与新增的待证事项 | 结构diff＋两条独立证据链 | D1/D2符号对应真实改动，两处50%分别追溯；候选与批准状态分开。 | `show-me` |
| [Q5.2](rendered/AI交付能力测试-answer-孙广昊.html#q5-scope) | 判断生效及适用范围 | 记录字段与生效条件、范围的对应关系 | 记录说明依据，批准决定生效，范围限制复用；不可只排列三个主题框。 | `visual-explainer` |
| [Q5.3](rendered/AI交付能力测试-answer-孙广昊.html#q5-independent-release) | 检验收益来源与错误复用 | 四组对照＋反事实矩阵 | 原版、仅删、仅增、组合按共同问题比较；客户/法域变化对应预期行为和验收条件。 | `visual-explainer` |
| [Q5.4](rendered/AI交付能力测试-answer-孙广昊.html#q5-incentives) | 区分任务提升与改进能力提升 | 两层对照实验表＋指标失真的连续解释 | 两行分别固定比较对象与预算，说明各自支持的结论；不将两层画成已达成的能力等级。 | `show-me` |
