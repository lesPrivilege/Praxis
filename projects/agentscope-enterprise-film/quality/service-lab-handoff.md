# ServiceLab handoff — replay / targets

完成者：当前 /root/service_visuals worker（实际模型沿父代理继承；未另开子代理）。日期：2026-10-12，Asia/Singapore。

仅编辑：`projects/agentscope-enterprise-film/film/service-lab.js`、`service-lab.css`。其他源文件、规范、播放器均未动；未跑全仓库 validator，等待 main 集成。

## API 与接回

先加载 `service-lab.css`，在 GSAP / engine 之后加载 `service-lab.js`。`ServiceLab.build(type,{root,tl,start,duration,cues,identities,x,y})` 返回 `root/type/duration/identities/phase_names/cues/motion_windows/screen_text/phases/sources`。

- 坐标：1744×590；默认场内 left=88、top=300，和 MechanismLab 一致。
- `motion_windows.at` 为场内秒；`screen_text.start/end` 为影片绝对秒。
- `cues` 接受数组或 phase 名→数值 / `{at}`；严格递增。
- `identities` 默认 `{session_id:'JS1',turn_id:'U1',item_id:'M1',tool_call_id:'T1'}`，用文本转义渲染；跨 Java 场可共享这些身份。
- `data-reading-key` 按机制/坐标/语义角色稳定，同一节点跨 phase 仍是同一读物；所有真实文本 leaf 有 key。飞行事件复本为 `data-reading-transient="true"`。
- 原型默认48秒只是结构 fixture；**未验证无 TTS 读速**，主片需按 actual DOM 的新增信息与驻留重排 cues/duration。

replay phases 默认：snapshot 0 → subscribe 6 → delta_applied 12 → disconnected 18 → replay_deduplicated 25 → fresh_snapshot 34 → turn_terminal 42。

targets phases 默认：ownership 0 → context 7 → records 14 → discovery 21 → delivery 28 → recovery 35 → capability_controls 42。

## 具体行为与条件

replay 的 JS1/U1/M1/T1 稳定。快照 as_of=c17 → 订阅 after=c17 → e18 的 item.delta 更新已有 M1 → 成功应用后保存c18；断开观察时e19工具完成仍发生在后台，U1仍running。重连补历史e19，实时交界又见同IDe19，按事件ID只应用一次，c19成为已应用游标。410取 fresh snapshot，从新的as_of继续订阅，U1不重新提交。直到e20 turn.completed才显示同一U1 completed。item.completed 的累计内容替换规则可见；工具状态不写进文本M1，避免工具完成造成消息身份污染。

画面明确：e17–e20 / c17–c20 是教学符号；真实 cursor 是资源专属不透明值。未把游标当整数、timestamp或可解码顺序号。

矩阵按六个职责逐行累计展开，初帧4格、最终24格（含行维度）；并非三张同层卡片。列为 Managed/External/Hosted，行对应执行持有者、上下文维护者、Service记录、发现、文件、恢复。Managed 的示例 capabilities 仅返回 [steer,cancel]，控件只出现这两项；最终切到 Hosted 的示例 [cancel]，取消之外保留观察读取，并显示 checkpoint_restore=false。示例字样可见，未说成固定能力默认。

Harness / Service 分层解释在 context phase；External 注册成功仍需验证dispatch在 discovery phase；Hosted checkpoint_restore=false 在 recovery及最终完整矩阵均可见。没有 iframe Console、真实运行、clone、TTS 或依赖安装。

## 固定来源与定位

组件返回 `sources`，便于主片接入source IDs。

- `as-528e3df546ca` / `vault/snapshots/agentscope-enterprise-20261012/as-528e3df546ca-java-service-sse.md.txt`：Restore a snapshot before applying events；Interpret events and status；Pagination, reconnects, and expiration。支持as_of、apply后存cursor、按事件ID去重、delta append/completed replace、Turn终态、410 fresh snapshot。
- `as-79adbb1a7334` / `...-java-service-session.md.txt`：How Sessions and Turns relate；Read results and restore a page；Add requirements or context；Continue from a checkpoint。支持Session/Turn身份、关闭页面不取消、capabilities/available_commands、steer/cancel等具体控制条件。
- `as-d5dd49d8dc6e` / `...-java-service-external.md.txt`：Choose a transport；Java HTTP integration；Python with HTTP runtime transport。支持External保留应用进程/部署、适配器能力差异、catalog/Session/dispatch分别验证。
- `as-556d0c6a5726` / `...-java-service-runtime-host.md.txt`：Preparation and execution；Events, approval and recovery；Track and control work through the API。支持Host执行provider、provider context/Host持久身份、文件须上传Artifact、Hosted cancel与checkpoint_restore=false、available_commands检查。

没有运行目标项目；矩阵是文档机制教学，不是连通性或恢复性能结果。

## 已实际检查

`python3 /tmp/praxis-scope-quality/check-service.py`：15个1920×1080原生关键帧，全部反序seek像素hash一致；page_errors=[]，DOMoverflow=[]，正文低于30px=[]。矩阵累计cells为4、8、12、16、20、24、24。

`python3 /tmp/praxis-scope-quality/check-service-api.py`：自定义JS2/<U2>/JM2/JC2与cue偏移，HTML转义、不造元素、screen_text真实身份、key不随alias改变、每个语义leaf都有key、transient复本标记通过。6个非法输入在创建DOM前拒绝。

截图：`/tmp/praxis-scope-quality/service-{002,008,014,020,027,030,036,044,050,057,064,071,078,085,092}.png`。实际人工查看027/071/092；看到移动事件可能盖住M1后已将传递终点移回观察轨道，并保留M1正文不因工具完成而换成工具状态。检查在修改后重新通过。

机器报告：`service-check.json`、`service-api-check.json`、`service-manifest.json`。fixture：`service-fixture.html`。这些是临时结构验证；尚未编码视频或验收整片读速、全片连续性、完整实时观看。
