# AgentScope 企业片与 Opus/Sonnet 参考的只读质量比较

日期：2026-10-12（Asia/Singapore）

结论先行：AgentScope 片的事实覆盖和静帧可读性已经达到“可查资料的架构导览”，但和参考作品的实际差距在讲解机制上，而不在 TTS。53 场主要复用同一套 `heading → lead → 3/4 个 item → PM 条` 模板；因此每场能说出一个结论，却经常没有把 PM 下一问需要的对象身份、状态变化、执行所有权、异常出口或跨场连续性画出来。金字塔片把同一批对象在不同阶段变换，DeerFlow 页把同一机制拆成可步进图、表格、折叠细节和追问入口；两者都让“为什么这样工作”成为画面结构的一部分。第二版最值得投入的是少量高影响场景的定制重写和跨场身份线，而不是给 53 场统一增加装饰动效。

## 范围、证据与限制

本次只读了当前 worktree `/Users/lesprivilege/.codex/worktrees/agentscope-enterprise-film/Praxis` 的 AgentScope 成果，以及参考原仓库 `/Users/lesprivilege/Projects/Praxis/demos/knowledge-film-001-pyramid-cut5` 和 `/Users/lesprivilege/Projects/Praxis/demos/deerflow-explainer`。没有改动任何源码。

实际核对的 AgentScope 材料包括：

- `projects/agentscope-enterprise-film/out/agentscope-enterprise.mp4`，实际媒体为 1920×1080、24 fps、1934 秒、无音频流；`out/check-report.json` 报告流、空白采样、阅读预算和布局通过，`motion.status` 明确为 `not_checked`。
- `film/scenes.js`、`film/film.css`、`film/engine.js`、`script/storyboard.md`、`script/beats.json`、`reading.md`、`production.md`，以及 `evidence/whole.png`、`react.png`、`permission.png`、`java-03-execution-targets.png`、`java-05-snapshot-sse-cursor.png`、`java-07-files-artifacts.png`、`sandbox.png` 等实际静帧。
- 按 `beats.json` 的绝对时间抽取了开场、ReAct、权限、Java 目标、SSE 恢复和片尾附近帧，另看了这些时间点前后的短窗口。当前环境 shell 没有 `ffmpeg`/`ffprobe`，媒体帧读取用 OpenCV `VideoCapture` 完成；这不影响对已有编码帧的读取，但不是重新编码或完整观看。

参考侧实际核对的材料包括：

- 金字塔第五版的 `out/pyramid-principle.mp4`（1920×1080、30 fps、663.397 秒，含 AAC）、`film/js/scenes/c0-hook.js`、`c2-case.js`、`c4-misuse.js`、`film/js/engine.js`、`research/review-visual.md` 与 `README.md`。抽取了开场、案例、报告、证据和检验阶段的画面。
- DeerFlow `index.html` 的 1320 px 与 375 px 浏览器截图、源码中的图件和交互脚本。它是长页讲解器，不是视频，不能拿它的持续动画时长与 AgentScope 逐秒比较；这里只比较 PM 追问所需的空间、细节层、步进状态和回查能力。

因此下文把静帧能证明的构图、屏幕内容、源代码能证明的动画意图分开写。没有把“看了联络表”写成“完整观看”，也没有评价声音质量或要求添加 TTS。

## 先定一个同题可比的质量标准

对三个作品都用同一套问题检查一个局部机制：

| 维度 | 通过标准 |
|---|---|
| 认知对象 | 画面能指出谁在操作哪个对象，而不是只给抽象名词。 |
| 关系与变换 | 线、位置、层级或时间顺序表达实际关系；动作改变后，观众能看到改变了什么。 |
| 状态与例外 | 至少有一个可追问的状态键、条件、失败出口或人工决策点。 |
| 跨场连续性 | 同一个任务、消息、ID、文件或状态在后续场中仍能被认出。 |
| PM 可追问性 | 场尾能自然产生下一问，例如“谁持有运行权”“哪个文件算交付”“断线后怎么接回”。 |
| 观看后可回查 | 静止画面仍有层次；动态不是把文字换位置，而是让关系或条件变得可见。 |

无 TTS 只改变时间来源，不降低这个视觉标准。AgentScope 已用显式 `labelAt/detailAt/pmAt` 排时间，所以可以在无声条件下达到同样的因果揭示。

## 实际覆盖量与基线

| 作品 | 实际覆盖 | 形式和证据强度 |
|---|---|---|
| AgentScope 当前片 | 53 场、199 个 item、8 种 kind（`flow/rows/stack/compare/merge/loop/branch/replay`）、32:14；6 章；横屏片与阅读稿、双原生封面 | 媒体流、空白、字号/布局和静帧抽查通过；整片实时节奏和 motion 未核实。 |
| 金字塔第五版 | 15 个定制 `Film.scene`，11:03，5 章；同一案例对象从散乱材料、报告页、分组、结论一路变换 | 画面动作挂在逐词时间点；参考方明确记录了逐段/联络表检查，仍承认没有制作方完整听审。 |
| DeerFlow 讲解页 | 结论 + 11 章实现讲解 + FAQ/来源范围；33 处 `details` 细节；8 个交互图件（点选、步进、播放、试算、计时模拟等） | 浏览器实际打开并截取了 1320 px/375 px 视图；源码显示图件的真实状态和可达性。不是视频基线。 |

AgentScope 的数量优势是覆盖广：从 Agent、上下文、Python Service 到 Java Harness/Service 和恢复交付，`storyboard.md` 共有 53 个局部认知任务。质量差距不是“少讲了很多章节”，而是同一局部的视觉分辨率和机制连续性较低。

## 证据对照：当前片具体差在哪里

### 1. 全片视觉语法被单一模板锁住（P0）

在 `film/scenes.js:2-45`，53 场都由同一循环生成：标题在 `T(0)` 出现，lead 在 `leadAt` 出现，item 根据 `kind` 放入预设坐标，PM 条最后出现。`flow`、`stack`、`compare`、`rows` 只换盒子的布局，运动仍是 `show()` 的约 0.6 秒上移/淡入、`draw()` 的约 0.7 秒画线，以及少量 `pulse()`。

实际画面中，`whole` 0–35 秒、`react` 290–325 秒、`java-03-execution-targets` 1285–1332 秒和 `java-07-files-artifacts` 1452–1491 秒都遵循相同的“标题/副标题、等大卡、底部结论条”节奏。`whole.png` 与 `java-03-execution-targets.png` 也显示同一套浅色/深色卡片，只是文字和列数不同。

参考片的同题处理是场景专用的：金字塔 `c0-passage` 在 `c0-hook.js:26-97` 先逐字出现一段没有标题的文字，再让行错位、放出“无标题”槽位、落下“煮饺子”、画骨架和缩放到右侧结论；`c2-world` 在 `c2-case.js:105-179` 维护同一批卡片的散乱、按来源、按主题三个状态，并用镜头缩放/倾斜表达变换。DeerFlow 的系统图在 `index.html:385-445` 以入口、nginx、应用进程、依赖存储分层，点选节点后面板换成该部件的职责和默认值。

差距是“语法能否承载机制”，不是审美偏好。当前片适合目录式导览；参考片让一个动作本身成为证据。

**PM 下一问：**“合同助手这一轮到底在什么对象上做了什么？哪一件事改变了状态？”当前场通常只能回到阅读稿找答案。

### 2. 动效是一次性揭示，长段时间变成静态持有（P0）

当前 `film/scenes.js:11-16,27-45` 的主要动效集中在元素初次出现和连接线绘制。按当前时间表，普通场在最后一个 item 出现后到 PM 条之间通常还有约 4.8–7.8 秒，PM 条出现后到场尾又有约 6.1–7.5 秒；例如 `whole` 最后 item 在 22.03 秒、PM 在 28.43 秒、场尾 35 秒，`java-07-files-artifacts` 最后 item 在 23.20 秒、PM 在 32.70 秒、场尾 39 秒。静读时间本身合理，但连续 53 场都采用同样的揭示—持有—换页，会让“长讲解”变成静态卡片的轮播。

逐秒抽帧能看到当前事件点有短促变化，随后常规画面几乎不变；这与制作记录中 `motion: not_checked` 相符。不能据此说无声片一定节奏差，只能说第二版没有把无声时间主动转化为可理解的过程。

金字塔的动效与认知变化绑定：字符进入、语句失稳、标题落下、关键词着色、骨架替换、镜头缩放；`c2-report` 在 `c2-case.js:434-450` 让文字打字、光标逐页走到第 8 页、再把“团队的工作过程”转成 CEO 问题。DeerFlow 的步进器和播放按钮在 `index.html:474-506`、`1356-1410` 让读者主动推进“发送→转发→建 run→装配→调用模型→执行工具→收尾”，每一步都更换说明，不依赖配音。

**PM 下一问：**“这个箭头是实际发生的动作，还是只是讲解顺序？什么时候会停、分叉、回放？”当前多数场不能从动效回答。

### 3. 核心消息/事件只给类别，没有可追踪的身份键（P0）

`message` 在绝对 221–256 秒按“身份、内容块、结束状态、附加结果”四行揭示；`events` 在 256–290 秒按“文字增量、工具事件、确认请求、完整消息”四行揭示；`react` 在 290–325 秒画四个循环节点。`storyboard.md:11-13` 的认知任务是正确的，但 `evidence/chapter-02.png` 与 `react.png` 里没有一条具体的 `reply_id`、`block_id`、`tool_call_id`、`finished_reason` 或事件如何改写同一条 Msg 的可视对象。正文里虽写了这些概念，画面没有把它们绑在一起。

这使“Event 按身份更新同一回复”仍像一句说明，而不是能被追问的机制。DeerFlow 的“消息的行程”用一个可步进的 10 步轨道（`index.html:474-506`），每步注明调用方向；长页还把 run 状态、checkpoint、artifact 和记忆队列放到收尾位置。参考金字塔同样不靠抽象名词，而是让第 8 页光标、报告内容和 CEO 问题保持同一对象。

**PM 下一问：**“增量事件到达时，前端凭哪个键更新哪一块？断线重连是恢复 Msg 还是新建回复？”

### 4. 权限与人工确认在两个场之间断开（P0）

`permission` 绝对 432–465 秒在一个“待执行工具调用”上分到 `ALLOW/DENY/ASK`；这三路作为互斥分支是正确的。`hitl` 绝对 465–500 秒再从“形成调用”开始，依次写工具/参数/身份、等待、答复、继续。但 `permission.png` 和 `evidence/chapter-02.png` 中没有让同一个 `tool_call_id` 从 `ASK` 卡携带到“停在确认点”、再由用户选择回到原调用；分支结束后下一场重新画一组同样风格的四卡。

因此当前视觉语义没有把错误顺序画成必经链，这是优点；缺口是跨场的身份与状态未延续。参考页在 `index.html:673-681` 把“模型提问→run A 结束→run B 用新消息继续”画成明确的时间线和分支，读者能回答“何时是原 run，何时是下一 run”。

**PM 下一问：**“审批人看到哪些参数？批准后是恢复原调用、开启新 Turn，还是重新执行？”这是当前片最直接的下一问之一。

### 5. Java 执行目标和授权比较缺少比较维度（P0）

`java-03-execution-targets` 绝对 1285–1332 秒的四项是 `Managed`、`External`、`Hosted`、`共同观察面`；画面在 1325 秒附近是 2×2 的四个浅绿块。`java-08-auth-grant-registration` 绝对 1491–1541 秒也是 2×2 的四项：`Account / Namespace`、`Application key`、`External registration`、`Runtime credential`。这些标签和正文方向正确，但空间没有列标题、行维度、持有者、状态存放位置或能力差异；四个块并排很容易被读成同层并列的名词。

DeerFlow 的沙箱图在截图对应章节中是明确的四列比较表：本机、Docker、Kubernetes Pod、云端微虚拟机，行是执行位置、隔离、bash、文件传递、前提与代价（`index.html:895-905` 附近）。系统全景图还把默认启动与可选组件用实线/虚线区分（`index.html:415-425`）。

**PM 下一问：**“Managed/External/Hosted 谁持有进程和会话状态？同一个 Session API 在三种目标上哪些能力不相同？”当前画面不能直接回答，需要回阅读稿。

### 6. Session、Turn、SSE 恢复的身份关系没有形成一条可操作的时间轴（P1）

`java-04-session-turn-idempotency` 绝对 1332–1373 秒以 `Session → Turn → Idempotency-Key → queue / approval` 的 rows 展开；`java-05-snapshot-sse-cursor` 绝对 1373–1411 秒以 `Snapshot → as_of → Cursor → 游标过期：410` 的 replay 展开。`java-05-snapshot-sse-cursor.png` 的静帧有箭头和 410 条件，语义比普通 flow 清楚，这是当前片较好的局部。

仍缺一个“客户端断线再连”的具体事件轨道：快照在何处加载，`as_of` 截到哪个事件，游标从哪一个 ID 开始，成功应用后何时保存新游标；410 后是读新快照还是重做 Turn。参考 DeerFlow 的消息行程和 `index.html:1069-1074` 直接把断线、`Last-Event-ID`、事件缺口和重新加载已保存状态放在同一回查路径上。

**PM 下一问：**“重连时如何避免重复副作用？游标过期是否重做任务？”当前片只给了词语顺序，没有把重连操作画成可执行决策。

### 7. 文件与 Artifact 的交付边界没有被画成“写入—登记—可取得”（P1）

`java-07-files-artifacts` 绝对 1452–1491 秒是三层 `Session file → Artifact → Team / Workflow`；`java-storage` 1799–1834 秒是 `数据库 → 文件快照 → Vault 密钥`。卡片表达层次，但没有一个文件从 Workspace 写出、被登记为 Artifact、再由 Team/Workflow 通过记录取得的真实对象；也没有显示“文件写了但未登记”的失败出口。`storyboard.md:45,54` 只规定了对象和变换，没有对应的动态证据。

DeerFlow 在 `index.html:900-905` 明确画出/写出这条边界：成品写到输出目录，再调用 `present_files` 登记，未登记的改动使 run 按失败结束；FAQ 在 `1225-1227` 再用同一边界回答用户问题。这个例子直接说明，详细讲解不等于堆更多框，而是把失败条件画进交付流程。

**PM 下一问：**“Agent 说生成了文件，业务界面凭什么知道文件在哪里、是否可以安全下载？”

### 8. Workspace、Sandbox、Recovery 的空间粒度和副作用没有形成可比层级（P1）

`workspace` 绝对 1057–1095 秒把 `per_agent/per_session/per_user/生命周期` 放进 2×2 compare；`sandbox` 绝对 1095–1130 秒把工具请求、工作区接口、沙箱后端、执行结果放进一条 flow；`java-09-recovery-capabilities` 绝对 1541–1580 秒再用三层 stack 表达 Capabilities、共享持久层、External effects。每场单独看并不错误，连续看却没有“同一文件在哪一层、谁能读、恢复哪部分、外部副作用如何核对”的嵌套关系。

DeerFlow 在 `index.html:886-905` 把虚拟路径、主机位置、四种沙箱提供方和生命周期分开，随后在 `932-977` 用四处状态表和记忆时间线说明存储粒度。参考金字塔的 `c2-world` 也把同一批卡片持续移动，而不是每一步换一批等大卡。

**PM 下一问：**“同一个 Session 的文件是否与 Agent、用户或副本共享？恢复后能否继续原副作用，还是只能核对结果后新开任务？”

### 9. 结尾把四类契约重新列一遍，缺少一条可检验的闭环（P1）

`failure` 绝对 1834–1869 秒和 `delivery` 1869–1904 秒都用 rows：缺少依据/权限拒绝/结果未知/输入改变，随后是输入/动作/状态/交付契约。`end` 1904–1934 秒再用三条 stack 收束。它们在文字上覆盖了失败闭环，但画面没有让一个失败实例沿同一身份经过补件、拒绝、回执查询或重试后到交付；结尾因此像目录回顾，而不是验收。

参考金字塔的最终检验从空的塔尖开始，逐层补入能支撑结论的内容；`c4-misuse.js:63-150` 甚至把“凑三点、规则不规定数量、按材料恢复 2/5/3”做成同一座塔的形变。AgentScope 可以用合同助手的一个风险条目贯穿结尾：缺依据→补件→工具调用→ASK→Artifact→业务接收，所有场都沿同一 `task_id` 或 `turn_id` 回显。

**PM 下一问：**“这套契约怎样支持验收？我看到的‘完成’是生成、发布、还是业务接受？”

## 优先改造清单（第二版建议）

下面按“直接减少 PM 下一问的成本”排序。每项给出具体场、画面目标和验收点；可以只重做这些场，不需要重写 53 场。

1. **P0 · 建立一条跨场身份线。** 先为 `task` 156–190、`message` 221–256、`events` 256–290、`react` 290–325、`permission` 432–465、`hitl` 465–500 和 `java-05` 1373–1411 选定一个构造的合同任务，用固定的 `task_id / reply_id / tool_call_id / turn_id` 节点贯穿。验收：同一调用在 ASK、暂停、答复、恢复、事件回放中始终能被认出；画面能明确哪些是构造示意，不把示意值当运行日志。

2. **P0 · 把 Message/Event/ReAct 做成一条可步进的消息行程。** 重做 `message/events/react`，让一条 Msg 内部显示 `reply_id`、有序 content block 和 `finished_reason`；事件轨道显示 `start/delta/end` 如何命中 `block_id`；循环显示无工具答复、工具失败、ASK 暂停和迭代上限四个出口。参考 DeerFlow `s2` 的 10 步步进器，保留当前无声静读能力。验收：暂停任意一步，PM 能回答“对象、ID、下一状态、可否重连”。

3. **P0 · 把 Permission→HITL 连接成一个有条件的状态机。** 合并绝对 432–500 秒的两个场，保留 ALLOW/DENY/ASK 三路分支，但只让 ASK 进入 `waiting`；把工具名、参数摘要、调用 ID、审批者选择和 `resume` 事件沿同一节点传递。验收：批准、拒绝、超时三种短片段各有独立出口；没有把 ASK 画成每次调用必经步骤。

4. **P0 · 为 Java 执行目标加真正的比较矩阵。** 重做 `java-03-execution-targets` 1285–1332 和 `java-08-auth-grant-registration` 1491–1541：列是 Managed/External/Hosted 或 Account/Namespace/Application/Runtime，行是进程所有者、Session/Turn 状态、能力发现、凭证、文件/副作用、恢复责任。当前四块文字可保留为注释。验收：静帧即能回答“谁持有运行权、谁保存状态、谁需要另行注册”。

5. **P1 · 把 Snapshot/SSE/Cursor 变成断线回放短片段。** 重做 `java-05-snapshot-sse-cursor` 1373–1411：显示事件编号 `e17/e18/e19`、snapshot 的 `as_of=e17`、从 e18 订阅，应用到 e19 后保存游标；另一路显示 410→新 snapshot，不重做原 Turn。验收：游标正常、重复事件、过期三种状态都可从画面区分。

6. **P1 · 给文件交付增加一个“未登记失败”分支。** 重做 `java-07-files-artifacts` 1452–1491 与 `java-storage` 1799–1834：`Workspace file → Artifact registration → Team/Workflow reference`，并从“写出但未登记”指向失败；恢复场把数据库、文件快照、Vault key 和外部效果分成四个层级。验收：PM 能区分“生成成功”“登记成功”“业务可取得”“业务接受”。

7. **P1 · 用一个持久对象重做 Workspace/Sandbox/Recovery。** 重做 `workspace` 1057–1095、`sandbox` 1095–1130、`java-09` 1541–1580 的图形关系：同一份 `contract.pdf` 从用户上传、Session workspace、sandbox mount、Artifact、恢复核对一路移动；用实线/虚线区分共享、隔离和可选后端。验收：每个箭头有主语和所有权，不用“Workspace”同时指目录、权限边界和服务层资源。

8. **P1 · 用失败实例收束 failure/delivery/end。** 重做 `failure` 1834–1869、`delivery` 1869–1904、`end` 1904–1934：从缺少依据开始，经补件、权限拒绝、结果未知和业务接受四个可选状态，最后落到输入/动作/状态/交付契约。验收：片尾保留一条带条件回路，而不是三组等大总结卡；PM 能指出“完成”与“接受”的差别。

9. **P1 · 只给高影响场增加语义动效。** 不给 53 场统一加漂移或呼吸动画。对上面 1–8 中的关键节点采用可读的移动、聚焦、回边和状态变色；普通 rows/stack 场保持静读。验收：每个动效都改变对象关系、条件或状态，暂停后仍可读；按 `prefers-reduced-motion` 或静态帧仍能看到完整结论。

## 已有优点与不应误改的地方

- 当前片的配色、字号层级和页脚来源线统一，`whole.png`、`permission.png`、`java-05-snapshot-sse-cursor.png` 等全尺寸静帧未见文本截断或遮挡；这部分不需要推翻。
- `events` 用 rows、`scheduling` 明示业务依赖不能从并发属性自动推断、`permission` 用 branch、`java-05` 把 410 放成条件出口，这些是上轮语义审阅后已经修好的边界，应保留。
- 4:3 与 3:4 封面是独立原生编排，当前查看的 PNG 没有“制作”“未验证”“保护提示”等泛泛生产话语；现有封面目标已满足，不是本轮主要缺口。
- 无音频流本身不是问题。第二版可以继续无 TTS，借助场内短标题、阅读稿链接和可暂停舞台把时间交给读者；需要补的是视觉状态和因果，不是声音轨。

## 覆盖边界与未核实项

- 没有连续完整观看 32:14 AgentScope 成片，也没有做真实 PM 受众测试；静帧和短窗口不能证明整片节奏、信息负荷或动效观感。
- 没有运行真实 AgentScope、Java Service、DeerFlow 或外部模型/沙箱；本文不判断这些产品运行时的正确性，只评价片中如何呈现已写入的机制。
- 没有使用或判断金字塔片的完整音轨质量，也没有把其含 AAC 当作视觉优劣；音频只用于说明参考片的逐词时间线来源。
- DeerFlow 是交互长页，不是成片；其可展开细节、表格和步进器是信息架构证据，不能直接推断为视频动效质量。
- 当前 `out/check-report.json` 的 motion 项未完成；上述“动效密度低、持有段落长”是从源代码、时间表和取帧看到的风险与差距，不是受众实验结论。
- 外部来源版本、许可和项目事实沿各自作品的记录读取；没有对参考项目做新增事实审计。
