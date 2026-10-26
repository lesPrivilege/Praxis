# 切 2 状态与阅读统计验收

2026-10-12，Asia/Singapore。执行者：本轮 `film_pipeline` 工作代理，模型继承主代理配置，没有额外指定模型。检查对象为 structured 自然断行与 SSE append 修订后、仍为 3121 秒的冻结切 2 网页与实际 DOM 文字清单；没有编译或渲染影片，也没有改写场景、CSS 或文字采集器。

## 实际执行与结果

- `python3 -m py_compile …/build/check.py …/quality/check_cut2_states.py`：通过。
- 阅读统计的六个行为 fixture：通过。无键清单保持原有分行统计；同键同文去重；同键变值算新内容；曝光区间求并；排除移动副本；keys 顺序无关。执行记录见 [fixture](cut2-reading-semantics-fixture.json)。
- `python3 quality/check_cut2_states.py`：通过。当前 50 场共 110 个状态（39 个一般场最终态、71 个展项阶段），正序与逆序各求值一次。110 次 PNG 和实际文字 hash 完全一致；50 场最终实际可见；0 页面异常、0 manifest 差异、0 状态错误、0 字号失败、0 运行期间输入变化。详见 [状态报告](cut2-state-check.json)，输入文件与运行依赖 hash 随报告保留。
- EXPLORE 的显式 ask、`confirmed = true`、ALLOWED；URL 内容不能追加；R2/T2 与 JA1 的 `review-v3.md` 连续性；SSE“重建 U1 的视图”，均从实际可见文字核对通过。检查并未强迫影片增加“批准”或“ValueError”字面词项。
- [阅读报告](cut2-reading-check.json)：1795 条实际 DOM 记录中，1656 条为内容，合并 585 条重复语义、排除 14 条移动副本，得到 1057 个阅读单位。最高场平均读速 5.9 字符/秒；0 场超过 6，0 曝光过短，0 字号不足。所有真实可见文字仍参与字号检查，包括被排除出阅读量的移动副本。

阅读统计以 `scene + reading_key/reading_keys + text` 区分语义单位；同一对象的内容改变仍算新状态。重复状态的可见时间为曝光区间的并集，避免同时显示两份内容造成虚假的额外阅读时间。第一版没有语义键，继续保持其原统计行为。字幕式 4 秒突发量仍是建议项，不能据此推断 PM 的理解结果。

## 补修后的动态因果核对

在同一完整110状态检查运行中，实际核对SSE右侧业务页六个时刻：snapshot/subscribe初始消息为“责任上限”；delta_applied +1.9秒消息仍为“责任上限”、游标c17；+2.5和+2.6秒已显示“责任上限缺失”、仍为c17；+3.1秒才显示c18。六张实际PNG及DOM值正逆序完全一致，证明此演示把应用消息放在游标推进之前。输入hash在运行期间无变化。

新增 structured 最终文本边界检查通过；并实际原生查看 structured、SSE初始、增量到达、游标推进四张PNG。structured的英文标识自然换行、完整保留于各自框内；到达与游标状态与实际DOM一致。此处仍只证明演示画面，未测试真实Service的事件应用。

## 实际图像抽查

保存 110 张实际状态帧。另外生成并实际查看两张联络表，覆盖八个状态：

- 关键状态：permission 的 ASK 与确认、Java Artifact 发布、闭环 Artifact 桥接。
- 机制状态：ToolResponse URL 约束、SSE 410 重建视图、AgentState 匹配结果、Workspace 访问边界。

这八个静态抽查状态中，文字与对应对象保持邻接，未发现影响阅读的截字或局部重叠；调用、文件名与结果状态可辨。110 张图全部由实际截图生成，但没有把保存图像等同于人工逐图审阅。

## 覆盖边界

本次证明的是网页状态、固定时刻的实际文字与字号、seek 顺序无关，以及量化阅读预算。没有验证最终 MP4 编码/解码、全部动态中间帧、整片实际速度观看、真实 AgentScope 部署行为或 PM 受众理解；量化阅读通过不能代替观感验收。最终成片检查与仓库 validator 由主代理完成。本次没有新增外部来源或依赖，也未改动既有来源核实与快照边界。

返回 [质量记录](README.md)。

2026-10-26：本文提到的 `cut2-state-frames/README.md`、`cut2-state-frames/key-states-contact.png`、`cut2-state-frames/mechanism-states-contact.png`、`cut2-state-frames/sse-cause-arrival.png`、`cut2-state-frames/sse-cause-cursor-after-apply.png`、`cut2-state-frames/sse-cause-snapshot-initial.png`、`cut2-state-frames/structured-final.png` 已按 ADR-044 删除，结论以本文和回执为准；登记见 `docs/governance/retired-paths.json`。
