# WorkLab 交接 · 工作区隔离与合同闭环

2026-10-12（Asia/Singapore）。当前 `/root/workspace_closure` worker 完成；实际模型沿父代理继承，未另开子代理，未冒称 Luna/Astra。文件所有权：`film/work-lab.js`、`film/work-lab.css` 与本记录。其他源文件与其他 worker 的改动未覆盖。

## 接入契约

在 GSAP 与 engine 之后加载 `work-lab.js`；同时加载 `work-lab.css`。调用：

```js
WorkLab.build(type, {root, tl, start, duration, cues, identities, x, y})
```

返回 `root/type/duration/identities/phase_names/cues/motion_windows/screen_text/phases/sources`。默认展项为 1744×590，left=88 / top=300。`motion_windows.at` 为场内秒，`screen_text.start/end` 为影片绝对秒；named cues 支持数值或 `{at}`，也支持按 phase 顺序传数组。时间必须有限、cue 必须严格递增并落在 duration 内。

全部文本 leaf 有 `data-reading-key`。输入文件名保持 `work:<type>:input:filename`，不随坐标或 identity alias 改变；输出文件名有对应 `result:filename`。飞行图形无正文，标为 `data-reading-transient`。状态只通过传入 GSAP timeline 改变，无回调、计数器、Date 或浏览器动画。

默认 identity 字段：`user_id/agent_id/other_agent_id/python_session_id/other_python_session_id/other_agent_session_id/reply_id/tool_call_id/session_id/file_id/artifact_id/external_call_id/filename/result_filename`。默认示例分别为 U-A、A/B、PA1/PA2/PB1、R2/T2、JS1/JF1/JA1、XW1、contract-v3.pdf、review-v3.md。文本经过 HTML 转义；传空值或非对象在创建 DOM 前拒绝。

## 认知任务与阶段

isolation：`default_agent` 0 → `new_session` 7 → `session_scope` 15 → `user_scope` 23 → `resource_scopes` 31 → `backends` 41 → `access_boundary` 49；fixture duration 58。

前四阶段沿同一用户、两个 Agent、三次会话观察一份 contract-v3.pdf。左侧保持 Agent/会话身份，中间为实际分配的工作目录，右侧为这份文件的目录可见范围。per_agent 为默认；同一 Agent 新开会话仍读原目录。per_session/per_user 为配置对照，画面不声称旧会话自动重分区。资源阶段把 MCP 的 Agent+Session 分区与 Skill 的 Agent 分区并排，显示共享文件不合并这些连接与技能。后端阶段比较 Local、Docker、E2B、K8s 的运行位置与持久化方式，Local 明确使用主机目录且无沙箱。最后把已绑定目录与授权检查分开，同时保留 `explicit workspace_id` 优先、策略变化只影响新分配会话两个条件。

closure：`input` 0 → `missing_basis` 8 → `supplemented` 16 → `candidate` 24 → `confirm_T2` 33 → `written` 43 → `artifact` 52 → `accepted` 61 → `unknown_receipt` 70 → `receipt_checked` 80；fixture duration 90。

主路径为合同输入 → 缺附件 B → 原任务补件 → 依据与候选批注 → 本例 T2 返回 ASK → 用户确认后写入 review-v3.md → 真实文件上传后发布 Artifact → 法务验收版本。顶部进度带为导航，正文是当前工作台与具体材料/动作/结果，不用等大四卡代替实现。候选、已生成、已发布、已接收分开。ASK 为本例实际判定，未声称所有 Write 调用必定确认，也未新增源码 autoapproval 功能。

Java 文件段以“Python 执行例 → 材料交付契约 → Java Managed 交付例”标出概念层交接；JS1 是 Java 示例 Session，未等同 PA1、R2 或 Python 服务会话。JF1 是已上传的真实结果文件记录，JA1 为显式发布后引用 JF1 的 Artifact。

最后两阶段明确为另一路径：业务调用 XW1 写台账遇到超时，接入方按原调用查询回执；查到与 JA1/v3 关联的既有写入后继续读取，不重新提交 XW1，也不重新执行 T2。此处是业务接入设计，具体台账与回执实现未冒充 AgentScope 默认内置能力。合同条款、第 8 条、附件 B 和“年度费用×2”均为教学材料，未当作真实法律结论。

**58/90 秒是施工 fixture，尚未验收无 TTS 读速。** 完整影片须依据可见 DOM 新增信息与驻留重排 cues/duration；本记录不把技术关键帧检查当作完整实时观看或 PM 观众验证。

## 来源与边界

均消费已有 Vault 快照，未新 clone、运行或修改目标仓库。

- `as-00c6583072da`：`vault/snapshots/agentscope-enterprise-20261012/as-00c6583072da-agentscope-doc-deploy__workspace-manager.md.txt`，Isolation grain、End-to-end request flow、Distributed deployment；支持默认粒度、workspace_id 绑定与覆盖、旧会话保留原映射、各后端运行位置与重新连接。
- `as-dc202a66c974`：`...-main-agent-service.md.txt`，Workspace implementation and isolation、Workspace MCPs、Workspace skills；支持文件共享粒度、MCP Agent+Session 与技能 Agent 分区。
- `as-e8bf00e52cb9`：`...-main-workspace.md.txt`，workspace implementations 与 Interface；支持 Local 是主机文件系统，其他后端与生命周期区分。
- `as-7dad78a203b5`：`...-main-permission.md.txt`，Overview 与 Decision Matrix；支持每次调用按规则/模式/工具检查产生 allow/deny/ask，ASK 条件化，未把工作目录可见性当成写入授权。
- `as-69ccfb190c6d`：`...-java-service-files.md.txt`，Upload a Session file、Download and deliver；支持 Managed Session 文件身份、显式 Artifact 发布与真实记录下载，工作文件不会自动成为可下载 Artifact。
- `as-79adbb1a7334`：`...-java-service-session.md.txt`，Add requirements or context、Read results and restore a page；支持补要求、读真实结果与恢复观察。
- `kit/grammar/work.md`：外部动作结果未知、运行完成、材料接收三个不变量；支持教学闭环的业务责任与恢复设计。组件 `sources` 中暂以 `kit-work-contract` 标示本地概念来源；它不是外部 source index 的既有 ID，main 可单独记为业务设计来路。

本轮核查范围为这些快照段落与 Kit 概念；未重新核实外部网站当前版本，未验证真实服务权限、执行恢复、台账可用性或性能。无依赖安装、TTS、远端创建或发布。

## 实际验证

临时 fixture 与自测脚本位于 `/tmp/praxis-scope-quality/work-fixture.html`、`check-work.py`、`check-work-api.py`；机器报告 `work-check.json`、`work-api-check.json` 与文字/运动清单 `work-manifest.json` 同目录。

- 17 个 1920×1080 原生关键帧：page_errors=[]、overflow=[]、正文低于 30px=[]、missing_reading_keys=[]、reverse_seek_mismatches=[]。
- 68 次随机顺序 seek：random_seek_mismatches=[]。
- 自定义 identity、HTML 转义、不造元素、绝对 start 与局部 motion 时标、稳定输入文件 key、6 类非法参数在 DOM 创建前拒绝通过。
- 实际查看默认图、会话对照、资源分区、四后端、授权边界、T2 确认/写入、Java Artifact 以及回执核对关键帧。修正了 Agent 标题与会话块、文件图标与正文、分配条件与文件块的重叠。新增会话使用路由线展开，避免飞行文件副本暗示重新复制同一文件。
- 随机 seek 初检发现进度圆环底边 1 像素抗锯齿差异，DOM 状态一致；改成矩形编号后，最后一版完整反序及 68 次随机 seek 均像素一致。

未编码独立样片，未做全片读速/连续性/完整实时观看。仓库 validator 与完整影片验收由 main 集成后执行。
