# Cut 2 分段播放检查 · Part 2

检查范围：767–1629 秒，context 至 background，共15场，862秒。执行者 `/root/runtime_states`，实际模型继承父代理；日期2026-10-12，Asia/Singapore。只新增本报告与 `quality/playback-part2/` 证据，不修改影片实现。

结论：该分段的连续1倍速浏览器时间轴完成。没有 P1；发现 structured 场一个长字段名越出卡片内文宽度的 P2，主代理已采纳修复，并按原1014–1059秒另行完成45秒1倍速补查。固定后的字串在卡片内自然换行，事实与场长不变。其余场没有发现需要阻断交付的稳定帧遮挡、身份混淆或条件丢失。

## 连续运行与审阅方法

首次有效运行用现有 Playwright 启动 headless Chromium，viewport=1920×1080、DPR=1，加载 cut2/film/index.html?render=1。rAF 从767秒开始，每次以 `767 + (performance.now()-epoch)/1000` 调用 Film.seek，直到1629；不暂停、倍速或用预定帧直接跳过驻留。有效进程 session12182，结束exit0。此前session74779因wait_for_function参数接口不符，在首帧前失败；它不计入连续运行证明。

实际墙钟862.044724秒，浏览器performance时钟862.0022秒，51708次rAF，maxFrameGap=216.7ms，page_errors=[]。截图操作和并行渲染负载造成短暂帧间隔抖动；这不是保证60fps连续显示的证明，但实际播放位置始终以墙钟保持1倍速。日志记录约每秒的时间/帧数，终态done=true。

采样384张原生PNG：每场入场早/晚、末帧，每个unique motion起点在窗口25%、72%与结束后0.35秒取帧，专用展项每个named phase另在cue+1.2秒取帧。每场及18个专用phase全部有覆盖；motion窗口均有多张序列图。capture-manifest记下target、截图前Film.time、performance.now、PNG哈希及采样标签。文件名是目标秒数，截图期间时间轴继续运行，因此不能把文件名等同于精确编码帧号；实际截图前时间与延迟统计见coverage-check.json。

人工实际通过view_image审阅68张运动联系表（384张原始截图的640×360排版副本），并查看40张原生关键图，包括offload四phase、sessions七phase、background七phase，以及文本/例外关键帧。联系表用于对象位置、出现顺序、衔接与短运动序列；文字核对使用原生关键图并对照当前分镜，而不是从缩略图声称每个字符都逐字审过。连续运行是浏览器时间轴证明；人工感知是采样审阅，**不是人类连续观看或PM观众测试**。

## 逐局部记录

下表的所有场都审阅了入场、递增内容与退场序列。稳定文字没有移位后换成另一个未标明身份的对象；本段无需声音才能取得所列主张。读速判断只针对新出现信息与驻留，不能替代真实PM理解测试。

| 场 / 时间 | 无声阅读、运动、条件与衔接 |
|---|---|
| context 767–800 | 固定指导、摘要、近期上下文三行累计出现。已有行继续留在原位置，新增内容每行独立可读；从“输入由什么组成”接到压缩原因。 |
| compression 800–845 | 80%触发、10%近期保留、每项50000 tokens截短与3000文档例子逐项出现。版本置于lead；摘要失败时截旧消息、关闭兜底报错都有清楚驻留。末句把原件回查交给另配offloader，避免把摘要当成完整保留。 |
| offload 845–941 | 四phase原生图：全部context→summary+recent→原件context.jsonl→按引用读回条款。S1与修订稿v3保持一致；存储和读取工具“另配”的条件明确。较早消息、责任上限条款的飞行复本有起点和终点；复本短时覆盖对应行，但运动结束后原行完整可读，未产生新的会话身份。 |
| memory 941–977 | 当前上下文、长期记忆、写入、检索用固定位置累计。写与读分开，归属条件留在最后；与前场offloader的原件保存区分清楚。此场承担机制定位，没有演示真实记忆服务。 |
| rag 977–1014 | 导入解析切片、嵌入索引、检索排序去重、交给Agent按顺序展开。lead明确索引构建与问题检索是两条流程，末句分别检验检索/回答质量。四个框的串联用于全链路定位，未画每次提问都重新建索引的计时。 |
| structured 1014–1059 | Schema→临时提交工具→默认额外5轮→None失败结果。有限宽限与业务含义校验分开；失败卡标题先出现，正文晚3.5秒出现，之后留有阅读时间。旧字串P2见下节；修复45秒补查通过。 |
| interrupt 1059–1096 | 运行中取消、暂停时送中断事件、保留部分记录、外部结果核对逐行递增。末句没有把“停止等待”误画成撤销已经发生的外部动作。接到生命周期横切逻辑顺畅。 |
| middleware 1096–1132 | 系统提示/模型/工具/运行阶段按行展开，作用范围与顺序在最后收束。每次只新增一个阶段，未让规则加入动画伪装成真实执行轨迹。 |
| pipeline 1132–1173 | executor候选、格式提交、pass/fail/impossible、预算允许后继续四步累计。verifier判定与格式校验保持区分；未通过分支的预算条件可读。图承担机制顺序说明，未声称每次都修正后通过。 |
| team 1173–1211 | leader完整输入、成员自己的上下文、工具结果回传、最终汇总按顺序出现。成员权限独立生效留在末句；没有把成员工作画成共享同一context。 |
| plan 1211–1248 | 计划、SOP、任务变化、核验推进固定四区累计。待办记录与流程规则分别命名；完成状态依赖执行结果，承接pipeline/team的组织层。 |
| service 1248–1282 | 章节从03转04。请求/FastAPI、托管/状态与工作区、持久/总线三层展开；执行与观察者分别管理，为后续锁与后台铺垫。 |
| identity 1282–1319 | 认证入口→可信user_id→资源所有者→执行请求。X-User-ID占位头需要替换单独驻留，未把该默认头说成真实认证。进入S1锁场时已有可信身份语境。 |
| sessions 1319–1452 | 七phase全审。W1/W2仍围绕S1/R2/T2；W1锁后读v0，e1先log再live，state/messages/cursor保存后仍持锁，再释放由W2锁后读v1。600s保持Service参数语义，并区分Redis续期和内存锁。末phase橙色“错误分支·先读后锁”与正常流程区分；e1移动复本有三帧序列，未被读成两条不同业务事件。 |
| background 1452–1629 | 七phase全审。10s是教学阈值轴；synthetic占位、watcher持有BG2、页面断开、真实结果、inbox+wakeup、拿S1锁、续推理层层展开。BG2/T2与原S1保持不变，末段明确same run或new wakeup run。失败分支注明“完成前进程退出”，正常停机取消task、崩溃可留registry metadata均可读；未与上一成功路径混成“已经完成的BG2又被取消”。 |

专用phase驻留：offload约32/16/13/20秒；sessions约34/14/12/11/13/15/19秒；background约38/20/18/19/17/15/35秒。重复身份/栏位持续留在同位，阅读可集中在变化行和解释。短crossfade期间旧/新解释有小于0.4秒的重叠，稳定期恢复单一文本；这类过渡没有用于表达两份并存状态。

## P2 修复与补查

首次原生 `structured-1058.700.png` 中，`structured_output=None。` 的detail clientWidth348、scrollWidth405，57px越出内文宽度，仍未出画布。已即时交给main，main仅改成 `structured_output = None`，用等号处空格提供自然断行。

补查独立证据在 `playback-part2/structured-fix/`：新浏览器完整1倍速1014–1059，共45.016658秒墙钟、2701次rAF、maxFrameGap18.8ms、26张原生PNG，page_errors=[]。实际view_image查看新末帧及五张全运动联系表。None现在另起一行，位于失败结果卡片内；卡片高度有余量。四个detail的client/scroll宽高一致，见layout-check.json。等号仍与字段和值组成同一判定，没有拆出另一状态。旧证据保留，不拿新画面替代首次发现。

首次加载版本：scenes.js SHA256 `004de7ad11064075fed72ce55d2dc7533be2ebbdad416bfc911e90dd27bd8276`，timeline.js `8d41301cca5da77923ede397de9eadfaff187b3c061a588d51275711869e321f`。补查加载scenes.js `cdfba2c4cfdb4b63cab38d660fbf69a6cb519c3b0565d871e928af4d2edf6073`，timeline.js `e0bf224320c341fb80409b61083815aedf292e212e887801ddd6e525dfacf476`。全文件哈希随后也受分段外SSE修订影响；主代理确认structured场时间不变，其余本段场未改。原始日志保留实际已加载版本，未回写伪装成同一个hash。

## 证据与未检查项

- 连续日志：`playback-part2/playback-log.json`；逐秒samples、有效终态、墙钟、rAF与源文件哈希。
- 采样计划/实际：capture-plan.json、capture-manifest.json、coverage-check.json；各scene前缀PNG及68张contact图。
- 补查：structured-fix/playback-log.json、capture-manifest.json、layout-check.json与26张PNG/五张contact图。
- 复验命令：`python3 demos/agentscope-enterprise-film/quality/playback-part2/capture.py`；补查命令路径为该目录的structured-fix/capture.py。再次复验会写对应证据，必要时先保留本次版本。

终版MP4由main重编码，本worker尚未核对最终编码帧与浏览器一致性，也未测试小屏、真实PM理解、键盘播放器或目标项目真实运行。整仓库validator依主代理分工集中执行，本worker没有用这份分段播放记录替代整片、编码或仓库验收。
