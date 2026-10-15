# Editorial 图形因果语义复核

2026-10-15。只读专项审查，覆盖31场；排除正在独立重画的 tools / plan / rag / identity 与其他组件场。依据 `film/editorial.js`、`film/story.js`，并用真实 `film/index.html?render=1` 在每场结束前2秒渲染1920×1080。实际查看31末态的四张联络表，另放大查看 team、structured、middleware、java-08 四个原生帧；未把碰撞检查、看过联络表或源码推演等同整段观看。

审查时 editorial.js SHA-256 为 `19282ff5472b46dd1dc6c76c1633add5c70233c4bbff09658acb08b645faccea`；story.js 为 `133f6d9b6e1d107bd823e998680860469dcd4ca45c29cf7bd15f0a6af7665d95`。并行修订后这些意见需要逐项关闭，不自动代表最新画面仍有同样问题。临时原生帧与拍摄时刻留在 `/tmp/scope-semantic-v3/`，本报告包含可重现的场内时刻，不以临时文件作为持久依赖。

## 三个先行阻断

- **team**：把分配、执行、返回、汇总四个过程定义塞进成员星形拓扑，`分配任务` 向 `独立执行` 和 `传回结果` 分叉。后者被读成第二个成员，真实返回方向也没有回到同一个 leader。应画真实 leader 与成员A/B，任务沿分发线走，成员结果回同一leader；过程词贴在边上。
- **structured**：连成 Schema → 生成工具 → 失败None → 宽限5轮。`None` 被画在额外迭代之前，逆转已核实条件。应先生成与校验；有效有独立出口；max_iters后5轮是条件支路，仍无有效结果才None。
- **middleware**：系统提示、模型阶段、工具阶段被单向实线排成业务流水线，运行阶段只是另一块定义。实际是 on_reply / on_reasoning / on_model_call / on_acting 等嵌套与环绕边界，on_system_prompt另为顺序transformer；不能用统一箭头代替hook作用范围。

主代理已采纳这三项，安排以 `specials.js` 专门重画；本表保留发现时状态，不预先关闭问题。

## 全部31场简表

“必修”表示当前连接/位置会引出错误关系；“细修”表示关系可成立但表征需限义；“保留”只接收这里的关系，不代表艺术质量或阅读时间已验收。分类和比较页可以保持分类，不要求统一加案例。

| 场 / 本次场内秒 | 判断 | 当前图表达与事实分工 | 最小处置 |
|---|---|---|---|
| whole / 43 | 必修 | 三职责能作总览；但Service→Workspace标“工作状态”，会使Workspace看成会话状态持久端；Agent→Service单箭头同时标“请求与结果”也混方向。 | 用无箭头的职责关联，或分别准确标“托管会话”“绑定工作区”“调用文件工具”；状态存储不要默认画到Workspace。 |
| docs / 45 | 保留 | 项目问题分四类文档入口，分支不是对象执行链。 | 维持分类树；树干与分支不需要逐条案例。 |
| lanes / 47 | 保留 | Python Agent→Python Service；Java Harness→Java Service两轨正确，未合成共同运行时。 | 保留层次与实现边界。 |
| migration / 43 | 保留 | Runtime/Studio职责汇入2.0是迁移方向，和材料相符。 | 保留“职责归入”，不改为旧包仍是必装组件。 |
| task / 43 | 保留 | 接收→依据→候选→交回是同一粒度业务步骤；没有将候选画成批准。 | 空白纸张不能证明材料流转，可删，但不属事实阻断。 |
| model / 43 | 细修 | 消息→Formatter→Model→统一结构是可成立的数据路径；底部回线落原“内部消息”，容易读成原消息自动被改写。 | 回线终点改为“Agent消费/下一轮输入”，或去掉额外闭环。 |
| scheduling / 45 | 必修 | 上轨“独立读取”箭头的目的地是“工具属性”，把并发属性当成执行结果；下轨“依赖步骤”到“结果汇合”也未表达真正先后。 | 属性作为调度条件；如果保留双轨，画两个真实查询同时进行，对照生成文件→发布文件。也可只作并发安全/业务依赖的条件表，删假执行箭头。 |
| integration / 43 | 保留 | Python/MCP汇入Toolkit、Skill以虚线接入，角色区分尚成立；ToolGroup确可包含tools、mcps、skills。 | 虚线明确“说明/资源”；不要改成Skill自动授予动作权限。 |
| context / 43 | 保留 | 系统提示、摘要、近期上下文共同组成输入；叠层是组成而非先后执行。 | 保留三层，不暗示摘要取代所有recent。 |
| compression / 47 | 必修 | 下轨“工具结果50000 tokens”→“摘要失败”混接两种独立机制；截短工具结果不会造成或定义摘要生成失败。 | 分开历史压缩/近期保留、单工具截短、摘要失败兜底三条件；下轨删因果箭头。空白折叠片也不代表实际消息。 |
| memory / 43 | 保留 | 当前上下文与长期记忆双向“选择写入/按需取回”合理；下面两条是动作定义，不必强造两个存储节点。 | 保留可选语义与数据归属；勿加默认全量注入箭头。 |
| structured / 45 | 必修 | None→宽限的逆序见先行阻断。 | 专项重画；有效出口与最终失败条件都要可见。 |
| interrupt / 43 | 必修 | 运行中断→暂停中断画成连续状态；二者实际是“运行中”与“已暂停”下不同处理入口，不是取消运行后再中断暂停。 | 并列两入口，由各自运行状态触发；记录与外部结果核对分别附着。 |
| middleware / 43 | 必修 | 定义节点被串成固定流水线，见先行阻断。 | 专项重画真实运行/调用边界与hook。 |
| pipeline / 43 | 保留 | executor→结构报告→verifier；fail预算允许返环、pass/impossible右出，和GoalPipeline契约一致。 | 可把executor/verifier标到真实承担者；保持格式校验与结果核验两种判定。 |
| team / 43 | 必修 | 过程名被当leader/成员对象，见先行阻断。 | 专项重画三个真实角色与双向任务/结果。 |
| service / 43 | 保留 | 请求/托管/持久三层可解释职责依赖，不是精确提交时序。 | 不将层间箭头解说为“所有事件必须等最终state提交才发布”；具体锁内时序在sessions场承担。 |
| deployment / 44 | 必修 | API/worker指向共享后端合理；共享后端再向“调度所有权/下载密钥/解析负载”分叉，伪造三者是后端派生出的子组件。 | 上方保留真实共享后端拓扑；下方三项作独立部署检查，或附到真实进程/副本，不接成后端输出。 |
| observability / 44 | 保留 | 同一session/reply身份关联event、trace、message三种投影；它们作为诊断证据可共用参照。 | 不把event或message说成完整trace；分类本身不需换案例。 |
| java-01-harness-context / 43 | 必修 | RuntimeContext→Builder不是实际调用路径；Builder持稳定配置，RuntimeContext在每次执行传入运行实例。两者共同指向State的“身份轴”也不能代替具体关系。 | Builder→Agent实例；RuntimeContext→本次调用；同身份/日志后端关联状态。可用三关系表，删错箭头即可。 |
| java-02-agent-session / 46 | 保留 | 直接调用与后台会话并列；后台会话持实例再响应/续接原任务，没有重启第二执行。 | 保留实例生命周期差异与关闭会话中断条件。 |
| java-04-session-turn-idempotency / 46 | 保留 | Session→Turn、同key同请求体回原Turn两路径可成立；输入接收/应用的区分有文字。 | 无需强制加虚构执行案例；若画对象，Session包含Turn比普通流程箭头更直接。 |
| java-06-interaction-capabilities / 43 | 必修 | caps横线为分类母线，但右端箭头跨过steer/inject/actions到resume，可能读成固定控制顺序；四命令本来独立按能力/状态可用。 | 母线去箭头，独立连到四类控制；保留条件，不必加案例。 |
| java-08-auth-grant-registration / 45 | 必修 | Account/Namespace→External registration及Application key→Runtime credential暗示前置认证和凭据派生。实际首注册端点不认证，runtime credential由注册返回；app key不能替代资源授权。 | 三条身份链并列；唯一实际派生线External registration→返回runtime credential；网络/网关保护画在注册入口。 |
| java-orchestration / 43 | 保留 | Subagent包含、Team成员、Workflow依赖三种拓扑可作为对照；没有把分类项相互串接。 | 不必把所有分类都改为业务故事；可删没有语义标签的小圆，保留差异。 |
| java-issue / 44 | 保留 | Issue定义→分配执行→过程记录→人工接收路径有效，接收与执行区分了。 | 保留结果交接条件，不能将Run结束自动接收。 |
| java-auth-scope / 44 | 保留 | 身份/Namespace之后分到资源动作与工作读取两种判定，关系正确。 | 保持“分别判断”，两项权限不互相推出。 |
| java-budget / 45 | 细修 | 用量与上限对照有意义；达到上限→继续工作不应读成自动续跑。 | 返线加“调额后、状态允许的控制”，或断开自动流程箭头；不要画无来源的百分比。 |
| java-channels / 43 | 保留 | 渠道→路由→执行观察→原对话回传的U形关系成立；Workflow飞书限制保留。 | 不将观察动作画成重新提交任务。 |
| java-webhook / 44 | 细修 | 去重与业务副作用分门合理；上支源“发出事件”、下支源“接收投递”把两层概念作为两份投递，虽文字能读通但重复对象身份不直观。 | 若重画，使用同event_id的投递尝试1/2汇入接收方；保留业务事务幂等另核，不强迫加业务案例。 |
| java-storage / 43 | 保留 | 数据库、文件、Vault密钥共同指向“同一备份点”，是恢复所需集合，不是相互派生。 | “备份点”解释为协调的一组恢复材料，不要求密钥有与数据库相同事务版本号。 |

## 根因与修订原则

当前脚本给 `s.items` 的每个label/detail一个节点，再给节点接所选图法的边。items有时是对象（数据库、文件、密钥），有时是过程（分发、返回），有时是条件（50000截短、摘要失败），有时是分类（四种控制）；它们并不共享一种连线语法。团队、压缩、hook与认证场的错因由此相同：先选图法，再让说明标题占据对象位置。

修订时先写每条边的完整句子：“谁，向谁，传什么/因为什么/属于什么”。能从来源或业务例中成立才保留箭头。分类与比较只需要同级、边界或无箭头母线；流程需真实可行动对象与条件。无需把所有分类页都改成案例，也无需用更多动效掩盖错误连接。

## 固定材料核对

- middleware固定快照 `as-cc1c5a96c71f` 第18–59行：on_reply包完整reply；on_reasoning包一轮推理，内部有system prompt与model call；on_acting包每次工具执行。支持嵌套边界，否定把四条定义当统一业务流水线。
- Java Harness架构 `as-0cf03f3aa25d` 第13/53/68行：shared Builder、直接请求fresh实例、AgentSession保留实例；当前调用RuntimeContext身份从agent取得。支持Builder与调用上下文分工。
- External `as-d5dd49d8dc6e` 第68/124/126行：首注册不认证，需控网络；注册成功返回registrationCredential供后续runtime连接。支持注册→凭据，不支持Application key→runtime credential。
- 工具管理 `as-2fea42114514` 第18/42行：ToolGroup可包含tools、mcps、skills_or_loaders，因此integration的汇入本身可成立；Skill的指导与权限仍分别配置。
- 其余局部判断复用 `story.js` 的既有essay与evidence、第二版已核事实；未新增网络研究，未运行目标项目，也未对所有外部快照逐份重新验真。

本报告只修订图形接收意见，没有编辑实现，没有运行整仓库validator；由主代理合并并验证。没有根据“无碰撞”接受任何关系。
