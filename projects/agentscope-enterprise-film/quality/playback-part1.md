# 第二版第一段 · 实际时轴与逐局部审阅

结论：0–767 秒的 headless Chromium 原生舞台完成实际 1 倍速连续运行；115 张主程帧、3 张补采动效帧均逐张通过 `view_image` 审阅。覆盖 whole 到 integration 的14个实际场、17个展项 phase，以及关键切场和运动窗口。没有发现 P1 内容、裁切、身份或持续遮挡问题；短交叉淡化叠影记为 P2。实施文件没有在本检查中修改。

## 实际执行与证据身份

[运行记录](playback-part1/playback.json)保存启动/结束时刻、输入 SHA、实际捕获前后时间与截图索引。[采样计划](playback-part1/sample-plan.json)、[逐帧审阅清单](playback-part1/review-ledger.json)和[执行脚本](playback-part1/playback.py)在同一证据目录。

- 运行时段：2026-10-12 04:06:04–04:18:53，Asia/Singapore。舞台加载完成后，以浏览器 `performance.now()` 的真实 elapsed 每次 rAF 调用 `Film.seek(elapsed)`，不加速、不暂停、不反向 seek。
- 计时跨度：实际 wall **767.127 秒**；浏览器 elapsed **767.017 秒**；最终 Film.time **767 秒**。共 **46,022 次** rAF，最大间隔 **18.9 ms**，大于100ms的间隔为0。
- 舞台和截图均为 **1920×1080，DPR=1**，使用 `?render=1` 隐藏播放控件。pageerror为0，115个捕获对象的场身份与预期均一致，运行前后输入 SHA 相同。
- 主程采样：14个标题完成帧、13个切场入口帧、11个一般场最终帧、17个展项稳定 phase 帧、60个运动窗口帧。状态切换和对象传递窗口按12%/50%/88%位置计划多帧采样；实际截图持续区间记录在 before/after，最大目标延迟0.120秒、最大截图区间0.117秒。
- 初版采样过滤没有包含 agent 的 `identity_preserving_delivery`。在不打断主程的另一浏览器中，额外对293.6–295.8秒做 **2.212秒 wall** 的真实1倍速短窗口，取得3帧；[补采记录](playback-part1/supplement-agent-delivery.json)明确区分它和完整段落运行。

这是实际时轴运行与模型对原生采样帧的审阅。模型逐张读帧的速度落后于运行，部分审阅在时轴完成后补完；它不等同于人类持续感知全部46,022帧，也不是PM观众测试。没有用静帧seek代替767秒运行。一般场以标题、切入和最终状态为样本，没有逐个捕获每条文字的所有中间显现；三个展项则逐phase与短运动序列检查。

## 逐局部结论

| 时间（秒） | 场 | 无声阅读、机制与条件 | 对象与衔接 | 代表帧 |
|---|---|---|---|---|
| 0–36 | whole | Agent、Service、Workspace的职责逐层进入；三行内容和任务→机制→交付主张可读。 | 开场深色与后续浅色区分总论和展开；职责对应后文对象。 | [002](playback-part1/002-whole-final.jpg) |
| 36–74 | docs | 构建块、编排、部署、企业接入对应四种实现问题，标题与行列关系清楚。 | 从系统职责转到文档发现路径，未将文档目录冒充执行流程。 | [005](playback-part1/005-docs-final.jpg) |
| 74–125 | lanes | Python文档2.0.9、源码2.0.10dev与Java Service 2.1.0-BETA1分开标注；四格职责可读。 | Python Agent/Service与Java Harness/Service分别成对，没有合成同一后端。 | [008](playback-part1/008-lanes-final.jpg) |
| 125–161 | migration | 原Runtime与Studio职责通过两条汇合线归入2.0入口，历史与当前职责区别成立。 | 汇合箭头解释迁移关系，后续任务从2.0进入。 | [011](playback-part1/011-migration-final.jpg) |
| 161–197 | task | 合同材料→规则→候选→确认/发布分开；候选、动作确认、文件交付三个状态可读。 | 四卡先后给后续状态、权限与文件示例提供工作对象。 | [014](playback-part1/014-task-final.jpg) |
| 197–322 | agent | 六phase完整：持久状态、同Agent尾部ASKING、观察其他Agent、SUBMITTED无结果、同ID结果补齐、保存后续接。等待谓词有具体条件。 | S1/A1/R2/T2固定；Reviewer/OBS1明确为另一个作者。已有T2结果时parked=false，不把SUBMITTED永久画成等待。补采T2结果token保持身份。 | [024](playback-part1/024-agent-own_tail_asking-settled.jpg) / [028](playback-part1/028-agent-observed_other_ignored-settled.jpg) / [036](playback-part1/036-agent-matching_result-settled.jpg) |
| 322–360 | message | 身份、有序块、结束原因、附加结果四类信息可读；暂停尚无终态与一次reply多轮调用明确。 | 先给Msg完整记录，再进入事件如何组成记录。 | [043](playback-part1/043-message-final.jpg) |
| 360–450 | events | 五phase逐一审阅。TEXT_END只结束文本块，TOOL_RESULT对应调用，REPLY_END才给reply终态；两段delta追加到一个B1。 | R1、B1、T1身份稳定；两次token传递有中途、接近目标和稳定帧，未生成第二个文本块或重复最终内容。 | [059](playback-part1/059-events-text_delta-settled.jpg) / [063](playback-part1/063-events-text_end-settled.jpg) / [071](playback-part1/071-events-reply_end-settled.jpg) |
| 450–488 | react | 状态检查→模型→工具反馈组成闭环；2.0.10dev默认50轮及普通文本超限无工具总结可读。 | 工具错误/权限拒绝回到推理，图中没有把失败画成业务完成。 | [074](playback-part1/074-react-final.jpg) |
| 488–526 | model | 内部消息、Formatter、Model、统一响应按协议职责排列；切换模型需核对工具/媒体/输出能力。 | 输入、协议转换、请求与统一输出相邻衔接，箭头含义明确。 | [077](playback-part1/077-model-final.jpg) |
| 526–574 | tools | Schema、ToolChunk、ToolResponse、ToolResultBlock分开。URL不可追加、error不被success覆盖及原调用ID回灌在画面常显。此场字量较高，长字段没有裁切。 | 顺序解释请求契约到结果契约，进度与最终数据/状态不混用。 | [080](playback-part1/080-tools-final.jpg) |
| 574–612 | scheduling | 并发属性与业务依赖分别表达；先生成再发布由编排或后续轮次承接，未声称调度器能猜依赖。 | 与工具契约相接，再引出执行前权限判定。 | [083](playback-part1/083-scheduling-final.jpg) |
| 612–733 | permission | 六phase：原调用、输入校验、ASK暂停、确认、执行、结果。DEFAULT顺序常显；EXPLORE显式ask例外和后续重新判定明确。 | R2/T2/review-v3.md贯穿。确认项显示confirm_results[]、tool_call.id=T2、confirmed=true；T2移动到执行侧，随后才显示工具执行/结果。 | [093](playback-part1/093-permission-input_validated-settled.jpg) / [097](playback-part1/097-permission-ask_parked-settled.jpg) / [104](playback-part1/104-permission-confirmed-settled.jpg) / [112](playback-part1/112-permission-result-settled.jpg) |
| 733–767 | integration | Python函数、MCP工具、Skill指导三类入口清楚；技能文本与真实工具授权分开配置。 | 执行权限之后说明能力接入方式，段尾回到上下文与协作入口。 | [115](playback-part1/115-integration-final.jpg) |

本段包括原hitl主题合入permission的确认链。17个展项稳定phase均已审；其余一般场的最终状态也逐场审阅。所有主程和补采图片的实际打开记录在review-ledger。

## 动效判断与P2

阶段切换使用短交叉淡化，最初一段会出现旧、新文本叠影，例如 [agent 021](playback-part1/021-agent-state_change-51-0p12.jpg)、[events 050](playback-part1/050-events-state_change-37-0p12.jpg)、[permission 090](playback-part1/090-permission-state_change-44-0p12.jpg)。中后段和稳定phase恢复清晰，未见稳定状态裁切、身份交换或悬挂token。Agent运行phase的稳定跨度为13–36秒，Event为12–22秒，Permission为14–29秒，均另有明确标题/lead引入；读速的最终适配仍需真实目标观众反馈。

叠影记P2，后续可以使旧文字先退场，再显现新文字，减轻瞬时读字竞争。本轮没有修改冻结实现，也没有把短暂叠影定为整段无法阅读。Agent的结果T2补采运动展示身份关联；状态在运动前已经切换成“结果补齐”，不能把该动画解释为实际外部执行的遥测时序。

## 编码样本

另用现有ffmpeg从当前MP4解码 **35.5、305.5、449.5、573.5、732.5秒** 五个稳定点，并全部以view_image审阅：[编码1](playback-part1/encoded-1.png)、[编码2](playback-part1/encoded-2.png)、[编码3](playback-part1/encoded-3.png)、[编码4](playback-part1/encoded-4.png)、[编码5](playback-part1/encoded-5.png)。五帧均为1920×1080，文字、布局、对象身份与已审对应舞台状态一致，没有观测到漏场、错phase或内容裁切。

[解码记录](playback-part1/encoded-check.json)保存movie SHA与逐样本差异统计。检查前后文件SHA相同：`6962237b27e7c90dcfd4515c41a611be6a55a981ed12f78b200b6cdad43acea7`。各通道平均绝对像素差为1.21–4.50/255；源JPEG、编码与色彩转换的比较不是逐点相等检验，不将五个样本外推为全片像素一致。终版媒体的完整检查由主代理记录。

## 覆盖边界

本记录验收生成影片的解释呈现，没有运行AgentScope、模型、MCP、Provider或沙箱，未做观众理解实验。源事实沿已有catalog与前期静态核查保留，本轮未重新核查外部接口或未来版本。音频约束、整片全解码、其他三段及最终仓库validator由主代理合并验收。保护性范围只留在过程记录，不附加到影片或阅读稿。
