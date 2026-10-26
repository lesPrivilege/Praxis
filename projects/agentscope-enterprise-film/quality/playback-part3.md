# 第三段1倍时间轴审阅

2026-10-12（Asia/Singapore），cut2_review。范围1629–2426秒，共797秒、10场：workspace、sandbox、deployment、observability、java-01至java-06。未修改实现、未运行AgentScope目标项目、未参与最终MP4编码。

**此段发现一个新P1：SSE的item.delta例子把文字替换画成追加。已立即交给主代理修正。没有发现其他P0/P1。** 下列记录保留发现时版本；修后172秒1倍补验追加于后。

## 实际运行与查看范围

以Playwright Chromium原生1920×1080、DPR=1载入集成页面。requestAnimationFrame中用performance.now计算1629+elapsed并调用Film.seek，直至2426。连续797.0685秒，UTC 2026-10-11 20:06:27.226330至20:19:44.303059；末值2426，47792次RAF，最大RAF间隔498.9ms，page_errors=[]。

按每个动画事件+0.35秒/+1.5秒、定制phase中点、每场结束前0.5秒采集191帧，全部保存。截图完成timeline较计划最晚0.2801秒。RAF短暂调度间隔可能来自截图/渲染，本次不是无掉帧性能测试。

**实际查看39张分散原生帧**，覆盖全部10场及workspace/矩阵/SSE全部21个phase，另看会话分配与SSE增量运动中帧。其余152张仅采集。没有视频视觉流直接进入审阅者，也没有在所有时刻逐帧注视：这是完整1倍时间轴运行加定点视觉检查，绝不等同完整连续人类观看。

证据：查看名单、墙钟与取帧记录。

beats SHA-256：b9719f4eb0a418e9b3b2a5dd8b6f2f2c30078c0f3c3430346c7b18fc42d0db48。
timeline SHA-256：37a46301bf3fb12e4f2fc9ec217bdb7fb5bad5385970cc33b114fd9def1b42d7。
整片脚本3121秒；浏览器开始时载入的源码不会因之后的磁盘修订自动改变。

## 新P1及最小修正

2241.5秒snapshot与2271.5秒subscribe，M1正文为“责任上限待核对”；2282.15秒运动中帧及2291秒稳定帧，e18是item.delta、增量“缺失”，M1却变成“责任上限缺失”。这替换了“待核对”，与同屏“追加到原消息M1”矛盾。

最小修正：snapshot/subscribe初始正文改“责任上限”；追加“缺失”后为“责任上限缺失”，其他阶段不变。实现定位film/service-lab.js的replay前两条状态正文。

次要动效问题：2282.15秒token尚在传递，右栏正文和“保存c18”已先变化。建议将追加与游标安排在到达和应用后。主代理已同时修正，本报告保留上述旧证据，等待下方补验回执。

## 局部裁决

| 范围 | 已看机制 | 裁决 |
|---|---|---|
| workspace 1629–1816 | per_agent默认；同Agent新会话；per_session/per_user配置对照；MCP按Agent+Session、Skills按Agent；四后端及workspace_id条件 | 因果/范围可读；未见遮挡 |
| sandbox/deployment/observability 1816–1930 | 请求到后端及结果；共享存储/总线、调度所有权、download_secret、CPU进程；事件/轨迹/记录/诊断 | 一般布局清晰，深度低于相邻定制展项 |
| java-01/02 1930–2017 | RuntimeContext、构建/状态归属；call/streamEvents与AgentSession；respond/resume | Java路径独立，无新阻断 |
| targets 2017–2159 | 六行职责展开；三种执行所有权；示例能力控制；Hosted观察恢复与checkpoint_restore=false | 矩阵承载真实比较；最后全表密度高但可读 |
| Session/Turn 2159–2206 | 固定目标、审批阻塞、同幂等键+请求体取原Turn、queued/input.applied | 行为条件明确 |
| SSE 2206–2378 | snapshot→subscribe→delta→断开→e19去重→410→turn.completed；JS1/U1/M1稳定 | 追加错误需修；其余链成立；“重建U1的视图”已修 |
| controls 2378–2426 | steer/inject/actions/resume；request_id/payload；available_commands | 不假定所有目标支持同一控制，无新阻断 |

## 节奏与边界

慢读安排明显：定制展项通常15秒后出现第一机制状态；SSE初始快照从2221至2262约41秒保持同一阶段。它支持无TTS查阅和新术语识别，但没有PM观众读速与注意力反馈，不能断言所有观众都需要这些驻留。一般布局仍呈卡片/条目揭示节奏，与定制机制段的视觉密度有差异。

所看1080帧未见截字/重叠；实际设备体验、最终编码帧、本段以外观感由主代理及其他分段负责。未新增外部来源或未快照依赖；不再次全量复核外部文档。全仓库validator由主代理统一执行。


## 修后172秒1倍补验回执

**新增P1已关闭；本段在已核范围无剩余P0/P1。** 主代理将初始/订阅正文改为“责任上限”，并把增量及游标更新安排到事件到达之后。重新载入修后页面，独立连续运行2206–2378完整172秒，未重跑其他9场。

UTC 2026-10-11 20:25:05.534542至20:27:57.620984，墙钟172.0842秒，10322次RAF，最大RAF间隔18.8ms，page_errors=[]。39帧计划/39帧保存，实际查看9帧：七阶段覆盖，以及增量到达/应用/游标的相邻采样。最晚截图完成比计划晚0.1011秒。记录见repair-run.json。

- 2283.10秒（截图完成2283.1664）：e18 token仍在观察通道，M1为“责任上限”，游标c17。
- 2283.55秒（完成2283.6339）：token已经消失，M1为“责任上限缺失”，游标仍为c17。
- 2284.10秒（完成2284.1662）：M1保持，显示“应用成功→保存c18”。
- 后续断线、e19去重、410重建U1视图和Turn终态均保持原JS1/U1/M1，未见回退或重复追加。

修后beats SHA-256：95be21753589503c3a177b87e8916ea463d6892591f4469e6d76bce1988a0691。
timeline SHA-256：85b0c010d260631b8efb30de1668c96fae6d7adeca2112567398650fd00210d4。
service-lab.js SHA-256：dd83c5a967a50b0423a66977e93738815823bc54a36f6311661b8fa37e929899。

797秒原运行与172秒修后补验是两个版本的独立记录；没有将后者冒充全段重验。最终MP4仍由主代理编码及核验。

2026-10-26：本文提到的 `playback-part3/README.md`、`playback-part3/repair-run.json`、`playback-part3/run.json` 已按 ADR-044 删除，结论以本文和回执为准；登记见 `docs/governance/retired-paths.json`。
