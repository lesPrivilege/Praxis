# Codex Explore Task · 通用 Agent UI 行为基线

## 任务

在当前 Courtwork 工作树中，研究通用 Agent UI 哪些成熟行为应复用现有实现、assistant-ui、AI Elements 或少量专业原语。用户已经熟悉 Claude/Codex；本轮追求交互一致性与细节可靠，不做新视觉布局、harness core 选型或独创编排。

**默认 Explore-only。不要因为读到候选表就安装全部依赖或开始重构。** 可以运行已有安全的测试；若需要小样来判定组件，应在工作树之外的临时目录使用无副作用 fixture，不修改主产品或 lockfile。没有可运行环境时交付精确待测项，而不是虚构通过。

## 先读什么

先遵循当前仓库 AGENTS.md。读取本包 README、UI_REFERENCE_INDEX（仅按待解决问题选择相关条目）、INTERACTION_CONTRACT、SE_COMPATIBILITY。UI_ACCEPTANCE.json 是测试候选，不是全量需求清单。

本轮已读公开 main 的 manifest 和部分源码，但用户本地正在双线施工。**本地最新事实优先；不要 reset、checkout、清理或覆盖现有未提交内容，不改另一条施工线。**

## E0 · 核验当前接入（必须先做）

记录当前 ref、worktree 状态与已安装版本。对照：

- `apps/desktop/package.json` / lockfile：公开快照曾声明 assistant-ui 0.15.4；本地可能不同。
- `apps/desktop/src/chat/ChatAssistantMessage.tsx`、`ChatMarkdown.tsx`：当前流式渲染、取消、重试和安全回退。
- 搜索实际 assistant-ui imports/provider/adapter/viewport 使用点；依赖声明不等于已接入。
- 从 App.tsx 的真实 imports 追到 Composer、TurnCard、ProcessTrace、WorkProjectionPort、work-replay、HostRendererRegistry。索引里仅标记 import reference 的入口要先解析，不盲猜文件后缀或目录。

先回答：每项状态与滚动由谁拥有，现有接入已经解决哪些问题，哪些是真实缺口。不要仅凭代码分支写“有 bug”；给出复现或待测状态。

## E1 · 最小主路径（先完成这部分）

保持当前 shell/主题/内容不变，准备同一组确定性回放：中文输入、多附件失败、长 Markdown 分片、用户上滚、工具结果、取消、连接中断。不需要调用真实模型，也不需要选择下一代 harness core。

比较当前实现与 assistant-ui 现有公开 API 能提供的行为。优先 T01–T08、T11–T12、T25–T28、T31；性能项 T30 先测量，不先编一个“达标”结论。

**不要立刻做第二套应用。** 只有发现 A 路线在具体行为上缺失或适配负担明显过大时，才对同一场景做 AI Elements 的有界对照。Ant Design X 保留为候选，不默认第三轮完整样机。

Markdown 对照（现有 remark vs Streamdown 或已选 renderer）单独改变这一变量。禁止同时更换会话框架、配色、布局和 renderer，然后声称能归因改善来源。

## E2 · 人参与与成果审阅的局部验证

只用一个澄清问题、一个有资源范围的操作授权、一个带版本成果和一个过期请求。候选为现有组件或 Tool UI 叶组件；需要 diff 时才比较只读 diff 原语。

验证 T13–T21；确认 allow action、answer question、accept result、commit change 不被一个按钮语义混淆。UI mock 可以演示回执和失败，但结果必须标记是 fixture，不能宣称真实权限/提交机制已经实现。

## E3 · 恢复与条件能力

沿现有协议验证 T23–T24；已支持导出、上下文检查或历史分支时再测 T22/T29/T32。Queue/Steer 只有宿主支持时进入 T09/T10，否则记 N/A 并保持草稿，不造假能力。

不为此阶段建设生产 event store、完整 websocket 服务、云同步、工作流画布或多 agent 面板。

## 每个候选都回答

| 字段 | 要求 |
|---|---|
| 具体问题 | 对应测试 ID 和用户可见缺口，不写“高级感不足” |
| 原始证据 | 当前文件/函数/版本，能复现则附场景 |
| 可复用单元 | 一个组件/行为适配/渲染器，不能只写仓库名字 |
| 接入方式 | 公共 API、复制组件或只借行为；记录许可与升级责任 |
| 状态所有权 | 谁 owns draft、viewport、thread、run、正式成果 |
| 结果 | measured / pass / fail / not-run / N/A，不把文档声称填成通过 |
| 维护代价 | 新依赖、私有 API、patch、重复状态、需要保留的旧实现 |
| 决定 | retain / trial / adopt-after-test / reject / defer |

本包 source_entries 的层级必须保留：目录可见不是所有文件已审，blob hash 不是 commit。复制前 pin 目标 commit/版本并核验具体许可；不要把本轮的未核验项补成看似完整的事实。

## 唯一主要交付

交付一份 `AGENT_UI_EXPLORE_RESULT.md`：现状图（用文字/表格即可）、最多三个实际候选比较、最小采用组合、必要的 SE seams、已验证行为及未验证风险、下一步最小改动范围。测试结果可附 JSON，引用 UI_ACCEPTANCE 的 ID。

不要求提交 PR，不要求把研究索引编成永久框架，也不要给每条规则再加一个静态脚本。已有静态 guard 不能代替真实交互测试。

## 停止条件

当已经能解释主路径所需行为、最小复用组合、所有权与对应证据时就停止扩展候选。若某方案要求迁框架、吞下服务端、创建第二份 canonical state、依赖大量内部 API 或建设新权限系统，先记 reject/defer，不扩大范围挽救它。

## 本轮明确不做

不迁 React/Vite/Tauri；不为案例迁 Next.js/Solid；不重写 SE Canon；不选 Pi/DeepSeek/OpenCode 的整套 core；不确定新三栏/Canvas 版式；不拉入多 agent orchestration、账号/计费/云平台；不执行真实外部发送、发布、删除或写入测试。
