# 三场语义重画

2026-10-15。源自[图形因果审查](editorial-semantic-review.md)的三个先行阻断。只拥有 `film/specials.js` 与本设计卡，不修改editorial、共享core或编译器；main在editorial之前加载，旧注册遇同id跳过。

| 场 / 时长 | 主角与空间论证 | 变化前 → 中 → 后 | 运动因果与否决 |
|---|---|---|---|
| team / 58s | 真实leader在上，成员A/B在下，各自上下文边界；任务与结果为同两张可追踪材料 | leader有完整合同任务 → 两任务进入各成员上下文 → 两结果回同leader汇总 | 任务到达才执行；原卡变为结果再返回；默认leader回复结束清成员上下文明确附在成员。否决把“传回结果”画成另一成员、把共享输入当共享上下文。 |
| structured / 60s | 一张风险候选沿Schema关口检查，缺依据时停留；补齐后通到有效出口。额外迭代另开明确条件支路 | 候选缺依据 → 补齐并通过 → 下方若上限用尽仍无有效结构，额外5轮后才None | 成功路径和持续失败分支不混为同一必然顺序；None不在grace之前；max_iters默认50，structured grace默认5。 |
| middleware / 58s | on_reply外边界；on_reasoning内含system_prompt transformer与model_call；on_acting单工具I/O边界独立 | 认完整reply边界 → 聚焦提示变换与模型调用 → 聚焦工具I/O及边界外的解析/权限/写入 | 只高亮实际作用范围，不把hook分类连成固定业务流水线；一次例示经过model/tool不代表所有回复都必调工具。 |

关系依据：team `as-0c1773327b10`；structured沿原scene证据与已核Python2.0.10dev默认；middleware `as-cc1c5a96c71f` 第18–59行。例中合同条款、角色A/B与候选字段是教学材料，不声称实测遥测。无TTS，正文至少30px，纯场内时间render支持正逆seek；时间为施工配置，实际播放仍由main审阅。

## 追加五处已采纳阻断

| 场 / 时长 | 实际对象与关系 | 前 → 中 → 后 / 否决 |
|---|---|---|
| scheduling / 62s | 上轨T3读合同/T4读附件同批并发，属性是条件；下轨生成文件→实际产物→发布 | 两调用同时走轨 → 两结果保身份汇合 → 依赖场景先有文件才发布；否决工具属性成为执行终点。 |
| compression / 65s | 旧消息压成summary，recent不动；右侧单工具结果截短和摘要失败条件分别独立 | 四历史消息 → 摘要/近期 → 工具限额、摘要失败分别处理；否决50000截短导致摘要失败。 |
| interrupt / 60s | 上下两种已有状态分别触发取消异步任务或UserInterruptEvent；外部实际影响另核对 | 运行中/已暂停 → 各自入口 → 保留记录、查外部回执；否决运行取消后必转暂停中断。 |
| java-01-harness-context / 62s | 共享Builder给稳定配置，RuntimeContext给本次身份，都指向执行实例；实例按身份读写独立AgentState | 创建I1 → 传身份并读写S1 → 下一直接请求I2加载S1；后台AgentSession保留实例另外标明。否决Context→Builder。 |
| java-08-auth-grant-registration / 65s | 用户/Namespace资源判定与App key调用入口并列要求；独立注册→运行凭据→后续连接链位于受控网络边界 | 调用与资源权限分别满足 → 保护首次注册 → 返回凭据再建立runtime连接；否决App key派生runtime credential。 |

45–65秒是本轮局部修订的时间范围；每场保留不同语义与字量，不统一追求相同长度。8场合计490秒。

## 实际检查与边界

2026-10-15：`node --check`通过。先以真实core.js/film.css独立fixture，再用已接入specials的真实index.html/engine.js复验48个语义状态。真实8场均无pageerror、正文<30px、可见文字越界或两两文字包围框重叠。每场前/中/后24帧在四张联络表中实际查看，team结果形成、scheduling最终产物、Java新实例另看原生1920×1080；检查的不只是碰撞，还包括任务/结果方向、边界归属和条件出口。

实际看图后修正：成员任务卡遮住状态行，增加成员区高度并移动状态；工具依赖线与Schema输送线穿过纸张，移动到纸张图层下；中断外部回执行距画区底过近，上移；I2新实例不再显示前一实例的“状态已写回”；Java AgentState内部字段改为tool state / Plan Mode，日志保存在独立后端的文字说明中，未伪造logs字段。

独立fixture全部48正逆PNG一致。真实全屏复验，team33/44秒的PNG有标题左缘两个抗锯齿像素差异（bbox x71..72/y126..128）；对应SVG outerHTML完全相同，差异在共享h1区域，不在展项。展项区域team正逆PNG一致；Java实例14秒曾有一次区域截图差异，独立完整序列复验SVG与全屏PNG均一致，最后真实全屏复验Java及其余六场均无差异。未修改共享标题层，不据这些结果声称整片编码逐像素确定。

临时实帧与回执在 `/tmp/scope-specials-settled/`；专项SVG/PNG对照在 `/tmp/scope-specials-real/`。本设计卡保存检查结论与范围，不依赖临时文件长期存在。尚未完成8段全时长连续观看、整片编码或观众理解测试；main负责最终视觉接收和仓库validator。未运行AgentScope、安装依赖或加入音轨。
