# RuntimeLab handoff — state / lock / background

完成者：当前 `/root/runtime_states` worker，实际模型沿父代理继承，未另开子代理。日期：2026-10-12，Asia/Singapore。

只编辑 `film/runtime-lab.js`、`film/runtime-lab.css` 与本交接记录。没有覆盖主片、编译器或其他 worker 的模块。未安装依赖、clone、运行目标项目、加入 TTS 或编码视频。按主代理分工，整仓库 validator 与整片验收由 main 集成后执行。

## 接口与阶段

加载 `runtime-lab.css`，在现有 GSAP 之后加载 `runtime-lab.js`。调用 `RuntimeLab.build(type,{root,tl,start,duration,cues,identities,x,y})`。返回 `root/type/duration/identities/phase_names/cues/motion_windows/screen_text/phases/sources`。

- 原生画布局部为 1744×590，默认 x=88、y=300。
- `motion_windows.at` 是场内秒；`screen_text.start/end` 是影片绝对秒。
- cues 接受数组或阶段名 → 数值 / `{at}`，必须递增并能放入 duration。
- 默认 identities 为 `{session_id:'S1',agent_id:'A1',reply_id:'R2',tool_call_id:'T2',task_id:'BG2'}`。alias 用文本转义，reading key 不依赖 alias。
- 每个文本 leaf 都有稳定 `data-reading-key`。同一展示对象在不同 phase 使用同一语义 key；飞行事件复本标为 `data-reading-transient="true"`。
- 默认 duration=54 是结构 fixture，**没有按无 TTS 读速验收**；主代理应据新增信息重排 cues / duration。

| type | 阶段与默认 cue（场内秒） |
|---|---|
| state | persisted 0 → own_tail_asking 8 → observed_other_ignored 16 → submitted_unresolved 24 → matching_result 34 → persisted_resumable 44 |
| lock | contention 0 → acquired_before_load 7 → event_logged 14 → event_live 21 → persisted_before_release 29 → next_worker_loads 38 → stale_branch 46 |
| background | synchronous_wait 0 → offloaded 7 → observer_disconnected 14 → watcher_completed 22 → inbox_wakeup 30 → locked_resume 39 → process_exit 47 |

## 展项语义

state 用持久 AgentState 与尾部消息的并排对象表示。字段显示 summary/context、reply_context、permission_context、tool_context、tasks_context、middle_context；不把 parked 当成持久旗标。尾部 assistant Msg 属于 A1/R2 时，T2=ASKING 等确认；尾部若为 Reviewer 的观察消息，不把其 ASKING 当成本 Agent 等待。返回本 Agent 尾部，T2=SUBMITTED 且没有匹配结果时等待；补上同一消息中的 tool_result T2 后，等待解除。R2/T2 与结果身份不换。observed_other_ignored 是判据反例，不是对其他 Agent 等待状态的判断。

lock 是 W1/W2 泳道及下方 Storage / replay log / live channel。W2 竞争 S1 的运行权，等待时不先读取。W1 拿锁后读取 v0，先将 e1 追加 replay log，再用相同 entry ID 发 live。保存消息、state v1、cursor c1 时仍持 run lock；写入完成才释放，W2 拿锁再读 v1。最后错误分支显示 W2 先读 v0 后等锁、获锁后继续用旧快照。600s 是 Service 传入的锁参数；画面同时区分 Redis 自动续租与内存 acquire_lock 不因 TTL 自动过期。未画600秒业务倒计时。e1、c1、v0/v1 是教学事件/版本身份，未声明 cursor 可算术递增。

background 用进程边界承载 drain_task / watcher，与右侧观察页、inbox 入口分开。10s 为卸载阈值的教学轴，不实际等10秒；普通工具超过阈值返回 synthetic 占位，实际 task 继续。页面断开只停止观察，watcher 不因此取消。真实完成后，task 完成 callback 清理 local handle / registry，watcher 另将 HintBlock 送入 S1 inbox 并 enqueue wakeup。接续 worker 拿 S1 run lock 后消费 inbox，继续原会话。**不保证仍是同一个 reply R2**：R2/T2 保留为工作来源身份；源码允许 same run 或 fresh wakeup-driven run。最后显式“失败分支 · 完成前进程退出”，区分正常停机取消 task 与崩溃可能留下 stale registry；registry 不是可恢复 asyncio 执行。

## 固定来源

返回的 `sources` 可直接接入主片来源标注。全部依据现存固定快照；没有新的未快照外部依赖。

- `as-614314fd8b6b` / `vault/snapshots/agentscope-enterprise-20261012/as-614314fd8b6b-_state.py.txt`：AgentState fields、append_context、get_awaiting_tool_calls，268–410；支持尾部作者与同 ID result 判据。
- `as-188d64eb8aa5` / `...-building-blocks_agent_run-agent.md.txt`：运行、状态与 incoming events；支持状态接续。
- `as-73da307b2ffd` / `...-_chat.py.txt`：804–850 先锁后读；984–995 offload 装配；1476–1512 锁内持久化消息/state/cursor。
- `as-68f5bb723b26` / `...-_bus_ops.py.txt`：37–66 publish_session_event，log_append 后 publish。
- `as-ebaf50819a12` / `...-agentscope-src__agentscope__app__message_bus___redis_message_bus.py-e4c1e074.txt`：629–700 acquire_lock，lease heartbeat 与 token 释放保护。
- `as-e2af92fa9ac1` / `...-_in_memory_message_bus.py.txt`：362–399 acquire_lock，TTL 不令内存锁自动过期。
- `as-19629c6bf4d8` / `...-agentscope-src__agentscope__app__message_bus___keys.py-e4c1e074.txt`：SESSION_RUN_TTL_SECS 与 task registry TTL。
- `as-0791af56faa2` / `...-_tool_offload_middleware.py.txt`：68–99 timeout_secs=10.0，119–125 卸载结构，224–394 drain_task / synthetic / watcher / inbox+wakeup。现有 snapshot 与 catalog 已含此来源，defaults-check-v2.md 中较早的“尚未快照”描述不适用于当前状态。
- `as-d612211accc9` / `...-_background_task_manager.py.txt`：249–328 register_task + 完成 callback 清理，446–470 正常停机取消。

默认与局部深度参考消费了 `script/depth-v2.json`、Vault `depth-review-v2.md` / `defaults-check-v2.md` / `permission-verdict-v2.md`。Kit 消费了任务入口、Design、Write/Motion 与 Design/Motion 的语义和运动判断。未将快照指令作为授权。

## 实际检查与范围

`python3 /tmp/praxis-scope-quality/check-runtime.py`：20 个 1920×1080、DPR=1 原生关键帧，覆盖所有20阶段并含传递运动中的时间点。反序 seek 的截图像素 hash 全部一致；page_errors=[]，overflow=[]，body_below_30px=[]（chrome 24px 明确排除）。人工查看 state 的结果补齐帧、lock 的保存持锁帧、background 的阈值、inbox 与退出分支帧；发现 Worker 换行后已修改并重跑检查。

`python3 /tmp/praxis-scope-quality/check-runtime-api.py`：6 个非法输入在建立 DOM 前拒绝；自定义 S2 / `<A2>` / R3 / T3 / BG3 与 cues / start=100 通过，未造注入元素，screen_text 含真实 alias。reading keys 不随 alias 改变、所有语义 leaf 有 key、传递复本 transient 均通过。三个 type 另以 start=300 验证绝对 screen_text、场内 motion_windows、稳定身份与 phase 数。

临时 fixture、报告与图像：`/tmp/praxis-scope-quality/runtime-fixture.html`、`runtime-check.json`、`runtime-api-check.json`、`runtime-manifest.json` 与 `runtime-{002,010,018,026,036,046,056,063,070,077,085,094,102,110,117,124,132,140,149,157}.png`。

这些检查证明独立组件的渲染、seek、尺寸与身份契约。尚未检查整片读速、53场连续性、完整实时播放、字幕/播放器接入或最终编码；也未验证目标项目在真实部署中的锁接管、后台执行或重启性能。
