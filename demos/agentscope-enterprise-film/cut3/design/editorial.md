# 余下主题 · 空间与动作映射

沿用已核实 cut2 的 35 场内容，标题与所有 items label/detail 保留；lead 在开头解释，pm 在结尾解释。说明贴着承担该事实的对象，无固定四卡或段落式 lead 外壳。各场使用同一个低层 SVG 词汇，但连接、包含、顺序、比较位置由本场意义决定。

| 场 | 空间论证与实际动作 | 三关键帧：前 → 中 → 后 | 否决 |
|---|---|---|---|
| whole | 三职责成三角，交互边逐一闭合 | 三个职责 → 请求/执行/状态相连 → 工作闭环 | 画成单向安装步骤 |
| docs | 左侧项目问题，四分支成为问题树 | 总问题 → 四种问题展开 → 文档入口同场可查 | 四章目录替代问题 |
| lanes | Python/Java 两条平行轨，层次逐段接上 | 两条起点 → 各自Agent/Harness到Service → 保持两轨 | 汇成相同运行时 |
| migration | Runtime与Studio两源汇入2.0 | 两旧来源 → 合流线 → 2.0承接 | 暗示旧组件仍必装 |
| task | 合同材料沿复核路径逐段变为候选与交付 | 原材料 → 规则与候选 → 业务确认交回 | 把候选当已批准 |
| model | 内部消息与供应商接口两端，由Formatter/Model接合 | 两端 → 适配桥 → 统一结构返回 | 更换模型无能力核对 |
| tools | 小块按ID收拢到ToolResponse，原T1带结果回写 | Schema与块 → 合并 → 结果 | error被success抹掉、URL可相加 |
| scheduling | 独立查询并发轨，对比串行依赖轨 | 两轨起点 → 并发同起/依赖后启 → 汇合结果 | 以并发安全推导业务依赖 |
| integration | Python/MCP动作入口汇向Toolkit；Skill指导虚线接入 | 三种角色 → 两动作入口 → 指导另外连接 | Skill直接等同执行授权 |
| context | 固定指导、摘要、近期消息三层包含于模型输入 | 三层 → 逐层叠入 → 共同模型输入 | 覆盖近期信息 |
| compression | 旧消息收拢成摘要，recent保留不动 | 旧+近 → 旧折叠 → 摘要+近 | 80%与工具结果50000混成同阈值 |
| memory | 当前上下文与长期记忆左右两岸，读写双向 | 当前 → 选择写入 → 需要时取回 | 记忆自动全量注入 |
| rag | 上轨建索引，下轨问题检索；索引纵向连接 | 材料到索引 → 问题到片段 → 回答 | 检索成功等于回答正确 |
| structured | 候选停在schema门，结果出口有限宽限与None | Schema → 字段校验 → 5轮/None条件 | 暗示永远保证有效 |
| interrupt | 控制线中断，记录与外部结果分开保留 | 运行/等待 → 中断 → 核对外部结果 | 控制停止等于副作用回滚 |
| middleware | 运行边界包围提示/模型/工具，边界钩子逐段接入 | 调用边界 → 内部三节点 → 运行作用域 | 四节点单向业务流水线 |
| pipeline | executor到报告到verifier；fail下返，pass右出 | 候选 → 核验 → 条件返环 | fail与格式重试混同 |
| team | leader居中，成员星形分发/返回 | leader任务 → 成员独立 → 结果回中心 | 默认共享上下文 |
| plan | 左台账行与右SOP规则，结果再改状态 | 待办 → 执行依据 → 勾选/调整 | 时间经过自动完成 |
| service | 请求/托管/持久三层，事件另向观察者 | 请求 → 托管 → 持久及观察 | 观察即启动执行 |
| identity | 认证入口后形成user_id，资源围绕归属检查 | 未确认入口 → 身份 → 资源及执行 | 占位头是真实认证 |
| deployment | API/worker共同连接共享后端，其余职责单独支路 | 两进程 → 共享设施 → 调度/密钥/CPU边界 | 每副本任意调度 |
| observability | event/trace/state三种投影围绕同一reply身份 | 身份 → 三投影 → 诊断对照 | SSE等于完整trace |
| java-01-harness-context | RuntimeContext跨Builder/State的身份轴 | 身份 → 实例持有方式 → 状态随会话 | 把每次调用说成同一实例 |
| java-02-agent-session | 即时调用上轨与后台会话下轨，控制回原任务 | 两入口 → 生命周期区别 → respond/resume | 观察后台再开执行 |
| java-04-session-turn-idempotency | 冻结Session容器，重复同key连回同一Turn | Session/Turn → 同key同请求重试 → 原Turn | 202 queued当input.applied |
| java-06-interaction-capabilities | capabilities包围四种控制，条件闸线先显现 | 能力 → 命令 → 按状态可用 | 所有目标都支持所有命令 |
| java-08-auth-grant-registration | 身份/应用/注册/运行凭证四层，注册裸边界加保护线 | 账户作用域 → 应用入口 → 注册与凭证 | Application key替代用户权限 |
| java-orchestration | Subagent嵌套当前Agent；Team分支；Workflow显式依赖 | 有界范围 → 成员关系 → 步骤依赖 | 三者只是规模差别 |
| java-issue | 执行轨与接收轨平行，以结果交接相连 | Issue定义 → Run执行 → 接受/退回 | Run结束自动接受 |
| java-auth-scope | 身份/Namespace外范围，资源动作与工作读取分叉 | 身份 → 作用域 → 两种授权 | 可调用就可读他人工作 |
| java-budget | 用量记录和配置上限两根参照线 | 归属 → 后续调用门 → 调额续接 | 编造使用百分比或保证无超额 |
| java-channels | 外部对话入路由、执行后回原对话的U形路径 | 外部消息 → 对应工作 → 同源回传 | 回到新会话或Workflow飞书路由 |
| java-webhook | 同一事件两投递线汇到同一接收身份，副作用另门 | 事件 → 重复到达 → 去重后独立业务契约 | 去重自动保证事务幂等 |
| java-storage | 数据库/文件/密钥共同指向一个恢复点 | 三种备份 → 共同参照 → 恢复核对 | 只恢复数据库即可 |

## 施工与检查边界

正文不低于30px；窄列按真实文本拆行，列间留空间给关系，不用省略号截掉事实。说明分阶段揭示，但已认识对象保留，只有真的收拢/合并才改变位置。路径由源到目的逐段建立；条件分支使用虚线，稳定主路径实线。任意时刻由纯 render(t) 得到，减少动态模式改用离散完成态。

这是项目局部映射卡，没有晋升Kit规范；AgentScope事实来源仍是已有cut2来源清单。本轮图法取visual-spec-diff及Kit对象表征、排列与运动指导，未新增外部研究或目标系统运行。

## 局部检查回执

2026-10-15：独立 Chromium SVG fixture 注册35/35场，35场45秒状态均生成原生1920×1080 PNG；35场23秒状态正向和经47秒反向seek后的完整SVG一致。45秒可见文字实际DOM测量无画幅溢出，全部可见文字两两包围框无超过3×4像素的相交。联系表实际查看 tools、compression、structured、java-04、whole、docs、context、java-webhook；tools和middleware另看原生帧。tools合并注释原与B1容器相邻过紧，已上移，标点拆行改为句末符号随前行。

这些是局部施工检查；fixture模拟共享API，画面标题为fixture固定占位，不能用作最终文字核对。共享core最终字体、所有场完整播放、片间衔接及编码仍由主代理集成验收。各图文字虽已测量，不据此声称视觉优于参考作品。

## 自适应时间修订

每场从标题与lead的识别开始，再按每一条label/detail的中文字符、英文术语读量加局部认图停留推导出现时刻；最后一条读完或最后实际动作结束后，留出pm解释的阅读与消化。最短45秒，未把所有场固定成统一分钟数。中文4.7字/秒、英文2.5术语/秒只是施工估算，真实观看仍可否决。合并、折叠和核验勾选时间随相关对象阶段移动，不能在对象出现前完成。

## 真实共享核心接收

主代理编译47场/53主题后，使用真实core.js、engine.js、film.css与PingFang SC复验。35场末态、35场43%中间态均完成实际DOM测量，无可见文字包围框相交或画幅溢出，35场正逆seek一致。正文30px；T1导航28px。标题在y80、底部142.4；note顶956、容器底1031，version顶1036，无相交。场长45–49秒，时间随局部字量和最后动作推导，没有统一64秒下限。

另生成11种图法中间帧，并实际逐张查看whole、docs、tools、context、compression、structured、pipeline、java-webhook八张1920×1080原生图。修复真实字形导致的强调线穿字、运输块与合并注释相交，以及team/observability/capabilities顶标过高；whole两条关系标注移离斜线。只改本模块，未重编或改变共享核心。以上不替代整片实际播放或受众理解检验。临时检查记录 /tmp/editorial-real-report.json 与 /tmp/editorial-real-midcheck-report.json 供主代理消费；不是持久交付依赖。

## 独立 fresh review 后四场改为小输入演算

四定义布局不能证明机制。按主代理裁决，仅 tools / plan / rag / identity 改为下列合同例；原定义与详尽条件仍在阅读稿，屏幕保留本例推理所需事实。其余31场未改，四场duration沿47 / 48 / 45 / 45秒。

- **tools**：Schema 独立连模型输入；两段真实文字“第8条：”和“赔偿不超过合同额。”由同一B1追加到同一行，无落地副本。原T1连ToolResultBlock；error保留、后到success划除；URL+URL追加报错单列条件。否决旧图Schema与ToolChunk共同进入合并。
- **plan**：三条具名待办为读取第8条、核对附件B、保存意见。第8条已读结果由复核人确认后，连接到第一行；只有第一行变完成。其余两行不变，SOP说明先核对附件再保存，不发明项目自动判断结果。
- **rag**：合同第8条 D1/P1 与附件B计算口径 D2/P1 进入索引。问题“责任上限怎么算？”走另一轨检索，命中这两个片段身份后送模型。未给虚构向量或相似分。合同条款内容是本片构造输入，不当作框架自带业务规则。
- **identity**：真实认证取得user_id=U-A，分别与owner U-A、U-B比较，到达后显出允许/拒绝两结果。保留默认X-User-ID占位头须替换的认证边界，没有把演示头作为认证。

真实core前/中/后三帧已生成并实际逐张查看12张1920×1080 PNG：tools 8/25/43，plan 8/23/40，rag 12/29/41，identity 8/24/39。12状态正逆seek一致，可见文字无相交或画幅溢出。修掉B1追加文字斜向接近时相压，改成先水平抵达目标x、再上移至原行；RAG片段改按实际宽度分行。临时证据为 `/tmp/worked-{id}-{t}.png`，DOM报告 `/tmp/editorial-four-qa.json`。没有运行AgentScope。
