# 证据、状态与覆盖索引

## 问题—答案结构修订

用户本轮reconnect的论证诊断采纳：[问题—答案树](argument-tree.md)记录五个总问题、18个子问题及推导、支持与动作条件。当前母稿、schema 4.0与HTML已同步；这次重构不新增外部实测证据。旧版“文案通过”不能延伸为结构或视觉通过，当前修订与未决项见[结构记录](../../../docs/verification/assessment-astra-20260923/argument-revision.md)。

示例中的Q2计时表作调整：所有终点统一以请求发出为起点。Q3“参数错误即可重试”不作无条件规则，需确认原请求未执行；变更参数不能借用原请求的幂等保证。其余初始延迟目标、构造分布、假设计费与法域限制保持原身份。

编订：Astra/main；登记与来源探索：Luna Max（gpt-5.6-luna）；日期：2026-09-23。正文采用连续自然语言，研究状态与来源映射在本索引维护。最终呈现采用 [回答体例](../../../kit/reporting/assessment-answer-profile.md)，改动判断见 [交叉核验](cross-check.md)。

## 句法修订

本轮按用户对内部对象直接进入正文的批评通改五题、纲要及相关图注，保留46项主张、18个子问题、4张原生表格和12个展项。[句法修订记录](../../../docs/verification/assessment-astra-20260923/prose-revision.md)区分实际改写、条件核对和未完成验收；这是本地文本修订，未新增来源核查或业务实验。

## 原始材料与覆盖

[本批登记](../../intake/ai-capability-assessment-20260923.json) 保存 Chat、附件和消息映射。初次归档7轮10消息；复读新增1条用户消息，r2共8轮11消息，r1保留。新增消息表达进一步研究Jev社区实践的意向，仅作为历史来源登记，没有据此另启无边界研究。Chat工具未暴露附件；用户另行提供的3个本地文件已按原字节复制。30个引用占位均为missing-original，本次来源是独立核查，不冒充恢复原引文。

附件S01–S28为历史来源地图。本轮核查其中24项，另补工具加载/缓存/MCP的4项来源，并将德国法律的4个URL分别登记；合计31个URL、31个HTTP/Markdown正文快照。S12厂商发布文、S17 guardrails示例、S21 HarnessDev、S23 AHE未在本轮核查。厂商和研究正文得到确认不等于业务效果独立验证。

## 主张与来源

| 正文位置 | 主要证据 | 本次裁决及证据边界 |
|---|---|---|
| Q1 信息供给、压缩与外部状态 | [S01 上下文工程](../../provenance/ai-assessment-q123/cards/s01-anthropic-context-engineering.md) | 采为设计方法；未做目标任务对照 |
| Q1 后续加载与前缀缓存 | [OpenAI Tool Search](../../provenance/ai-assessment-q123/cards/supp-openai-tool-search.md)、[缓存](../../provenance/ai-assessment-q123/cards/supp-openai-prompt-caching.md)、[Anthropic Tool Search](../../provenance/ai-assessment-q123/cards/supp-anthropic-tool-search.md) | 定义供给与服务热更新分开，实际账单须有usage |
| Q1/Q2 产品缓存条件 | [S02 Claude Code](../../provenance/ai-assessment-q123/cards/s02-claude-code-prompt-caching.md) | 条件依赖模型与渠道，正文不固化价格或具名模型例外 |
| Q1 目录刷新 | [MCP发布说明](../../provenance/ai-assessment-q123/cards/supp-mcp-2026-07-28.md) | 核查到2026-07-28语义；原Chat 2025-11-25描述保留为历史；未测目标客户端 |
| Q2 推理预算与延迟 | [S04 reasoning](../../provenance/ai-assessment-q123/cards/s04-openai-reasoning.md)、[S05 thinking](../../provenance/ai-assessment-q123/cards/s05-anthropic-thinking-cost.md)、[S06 latency](../../provenance/ai-assessment-q123/cards/s06-openai-latency-optimization.md) | 路由是设计方案；未做API或用户等待实验 |
| Q3 副作用前授权与恢复 | [S07 computer use](../../provenance/ai-assessment-q123/cards/s07-openai-computer-use.md)、[S08 approval](../../provenance/ai-assessment-q123/cards/s08-openai-guardrails-approvals.md)、[S09 containment](../../provenance/ai-assessment-q123/cards/s09-anthropic-containment.md) | 采用边界原则；未连接真实账号或生产环境 |
| Q3 幂等与unknown | [S10 AWS](../../provenance/ai-assessment-q123/cards/s10-aws-idempotent-apis.md) | 成熟API方法；不据此声称GUI或邮件接口幂等 |
| Q3 向导消融 | [S11 OSWorld](../../provenance/ai-assessment-q123/cards/s11-osworld-2.md)、[S27 eval](../../provenance/ai-assessment-q123/cards/s27-openai-evaluation-best-practices.md) | 基准帮助设计失败测试；非劣效方案为本次设计，无结果数据 |
| Q4 分数与confidence | [S13 Score](../../provenance/ai-assessment-q45/cards/s13-typesafe-score.md)、[S14 Confidence](../../provenance/ai-assessment-q45/cards/s14-typesafe-confidence.md) | 原始分布、均值与集中程度各有语义，均不直接保证业务正确 |
| Q4 重复与适用范围 | [S15 Jev限制](../../provenance/ai-assessment-q45/cards/s15-typesafe-jev-1-13-jaggedness.md)、[S16 consistency](../../provenance/ai-assessment-q45/cards/s16-typesafe-consistency-choice.md) | 厂商示例阈值不采纳；未做独立重放 |
| Q4 包装层取整 | [S18 Pydantic集成](../../provenance/ai-assessment-q45/cards/s18-pydantic-typesafe.md)、[S19 API](../../provenance/ai-assessment-q45/cards/s19-pydantic-api-typesafe.md) | 核对日期2026-09-23；rubric最近等级与半数进位、原始provider_details['scores']来自读取时集成文档，未固定SDK发布版本或执行SDK测试；实现前需核对所用版本 |
| Q5 候选、独立验收与奖励黑客 | [S20 RRSI](../../provenance/ai-assessment-q45/cards/s20-google-research-rrsi.md)、[S22 RSI-Exam](../../provenance/ai-assessment-q45/cards/s22-rsi-exam.md)、[S24 reward hacking](../../provenance/ai-assessment-q45/cards/s24-anthropic-reward-hacking.md) | 研究参考；不将模型演化收益当法律治理保证 |
| Q5 法域、规则身份与德国假阳性 | [Q4–Q5来源目录](../../provenance/ai-assessment-q45/cards/README.md)中的S25/S26/S28 | 只核查具体SG判决、HGB74/74a/74b、GewO110及OFAC概念；没有完整三国法律适用意见，VN未取得批准法源 |

每个URL的原始地址、访问时间、支持主张ID、章节/行定位、hash、正文路径和重访条件在 [Q1–Q3 catalog](../../provenance/ai-assessment-q123/catalog.json) 与 [Q4–Q5 catalog](../../provenance/ai-assessment-q45/catalog.json)。正文未堆叠脚注；本表按题目和主张承担定位。

## RSI综述的增补

[综述裁决](rsi-reference-index.md)对应Q5：明确改进对象为有版本的playbook，补足评估与权限独立、回退，以及任务效果和产生下一次有效改进能力的分别检验。两份实际消费的一手原文与版本在[补充来源目录](../../provenance/rsi-review/catalog.json)。研究数字和分级不进正文，论文或团队自报不充当法律结论依据。

## 时效与用语复核（2026-09-23）

Claude另派两名Sonnet只读复核。时效：Claude Code prompt caching、OpenAI与Anthropic tool search、MCP 2026-07-28发布说明、OpenAI reasoning与computer use、AWS幂等API、TypeSafe score/confidence/jev-1.13限制（2026-09-17复核版）、Pydantic集成、HGB §74、OFAC 50 Percent Rule、RRSI README与Anthropic reward hacking共12项均实时取回，正文所依赖的说法仍然成立；RRSI当前commit未能从页面确认。用语：未发现自造术语冒充通行概念；“可见性窗口”“放行上限”“阻断线”“送审”是本答卷的描述性用语，不作为行业专名。

| 正文位置 | 依据 | 身份 |
|---|---|---|
| Q3.2 Message-ID不提供去重保证 | [RFC 5322 §3.6.4](https://www.rfc-editor.org/rfc/rfc5322#section-3.6.4)：Message-ID标识某封邮件的特定版本，唯一性由生成主机保证；规范不涉及接收方去重 | 2026-09-23在线核对，未保存正文快照 |
| Q4.1 放行上限按严重漏报置信上界不超过预算校准 | 本答卷提出的方法，思路与selective prediction/risk control一致 | 设计方案，未引用具体文献，没有数据 |
| Q4.2 样本覆盖中文、否定、日期和数字、长材料、选项次序、无关信息和对抗内容 | 其中数字、日期、无关上下文与对抗内容见S15；中文、长材料、选项次序为本答卷补充的覆盖清单 | 设计清单，不是厂商列出的限制 |
| Q2.1 不同厂商effort档位不对应相同计算量 | S04 | 官方文档；未做跨厂商实测 |

## 演算与设计目标

| 正文数据 | 身份 | 检查结果/待办 |
|---|---|---|
| 15万token、1元与0.1元/百万token、差额0.135元 | 假设演算 | 150000/1000000×(1−0.1)=0.135；不是供应商报价 |
| 人工12分钟→5分钟、300元/小时、模型工具2元 | 假设演算 | 60元→27元，未计新增错误损失；不是生产账单 |
| 1秒确认、3秒p95、预计10秒以上提供阶段状态 | 初版设计目标 | 没有用户实验、SLA或性能实测；Nielsen历史经验未另行核查，不作为这里的来源 |
| P(1)=0.01/P(2)=0.99 | 确定性合成例子 | 期望1.99、严重及以上99%；不是Jev测量 |
| P(0)=0.5/P(3)=0.5 | 确定性合成例子 | 期望1.5、严重及以上50%；不是校准曲线 |
| 放行/送审/阻断阈值、非劣效容差 | 待业务数据决定 | 没有填入伪精确常量，需独立标签、风险预算与样本量 |

## 尚未验证与离线范围

未运行模型API、真实工具热插拔、邮件发送、生产配置修改、Jev校准、国内网络测量、业务降级或客户隔离测试。没有核查第三方服务区域、SLA、测试限制等合同传言，没有穷尽题干四家公司RSI研究归属。已有文档契约不等于运行控制已经实现。

31份快照保存已读取HTTP/Markdown正文，可本地检查。远端图片、字体、JS、登录态、API和完整来源仓库未保存，不构成完整离线站点。RRSI保存的是读取时默认分支README，不是完整commit快照。可视化参考的原件、依赖与覆盖单列在 [视觉参考index](visual-reference-index.md)。页面、打印和交互验收属于后续Claude工单，当前未执行。

## Jev社区增量

用户同日追加研究包后，另按24个来源入口登记核查；[实践地图与独立证据index](../jev-practices/README.md)维护本批身份、同研究去重和失败记录。它们的S01–S24使用独立命名空间，不与先前28项历史来源混用。Q2吸收语义路由/能力路由与候选覆盖的区分；Q4吸收固定轨迹重复不等于独立样本、用途分层、语义选择/中间量/最终结论分开验收。正文没有添加项目清单或社区性能排行。

## Q1段落编订

用户指出加载策略与验证两段呈现孤立原则。本次把段落主线收束为“使用场景与原生能力→加载选择→请求记录核对成本→回到第40轮任务结果”，没有新增外部事实。未来维护原则“原生能力覆盖自建补丁时简化设计”移出当前论证，留为重访与维护要求。page-composition已同步新母稿hash和q1-p06/p07身份；renderer尚未据此重新生成或验收。

## 术语修订

按用户要求保留无稳定译法的行业英文，清理低/高工作量、工具供给、法律真值、不可补偿门槛等不必要表述；工具选择与模型选择直接解释区别，不将作者分类名当作公认术语。正文仍为37段，page-composition与纲要已同步，未执行renderer重建。修订未新增外部事实。

## 全文编订与参考消费状态

用户指出整篇句子仍像独立断言，母稿已围绕各题的判断过程重写为29段；旧37段数量不再作为要求。最新hash及逐段映射已同步，没有运行renderer。技术与法律依据仍沿既有逐源登记，不因文案重写提高证据状态。

现成CW Pages/career HTML已有可直接查看的构图，但本答卷尚未凭新页面截图完成设计消费验收。CW/SE的11条外部URL仍为partial，只确认其本地使用记录；CW Pages参考清单中的若干产品仍为preparation-only。本轮不以新增外部搜索代替对现成HTML的实际复用。

正文已统一为直接陈述，删除答题者的预告式自述；29段内容映射及hash已同步。仅更新母稿、体例和工单，未重建页面。

## 撰写权限更新

用户已将正文撰写权开放给Claude，包括句子、段落、论证组织、标题及图文分工。现有工作稿与composition是参考，不按旧段落或字面冻结。外部来源、原始快照和证据状态仍按记录核对；改写本身不提高证据等级。

## Claude改写版本（2026-09-23）

正文由Claude按撰写授权改写，母稿hash为 `9d10789ded32`。改写只调整论证组织、标题与图文分工：列举性内容移入图表，正文保留理由、条件与限度。上文“演算与设计目标”中的数字、单位和假设身份未变；Q5反事实表不再点名新加坡，因为当前母稿未涉及新加坡的具体依据。结构与图的位置由母稿承载，论证关系和要点位置见[构图映射](page-composition.json)，页面验收见[渲染验收](rendered/verification.md)。

## Astra独立验收修订

交付标题改为“Agent 系统设计”，“AI能力测试”仅保留为任务/来源身份。Q2撤回“增加effort只对难以验证的节点有意义”和“低effort再检查一定更便宜”的绝对说法，改按生成、检查、重试和返工总成本比较。Q5恢复原题既定背景：香港律师修改客户A的新加坡就业合同；这不新增新加坡法律结论，不能因为缺少法律依据就删除题干事实。

作者headless与640px检查作为该版作者自检保存；640px视口不能替代真实200%浏览器缩放，12页A4对应五个题目、每题可续页。Astra的桌面交互、消费裁决与最终版本另见[独立回执](../../../docs/verification/assessment-astra-20260923/README.md)。

## 本轮文案验收

[文案裁决](../../../docs/verification/assessment-astra-20260923/text-verdict.md)为修订后通过。Q2区分确定性算法与结果可检查性，Q3补足原请求终止和幂等有效期/同标识同参数条件，Q4区分构造等级分布与实测风险，Q5恢复题干两项具体修改并明确两处50%不能直接等同。正文与展项文字同步更新；这不构成视觉、交互或业务效果通过。
