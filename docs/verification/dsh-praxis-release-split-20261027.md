# dsh-praxis 拆包、名册与 worker 自主消费 · 2026-10-27

基线：`7794879`，加上并入的 `wip/dsh-praxis-layout-roles`（087baaf，工单 1.5、1.7）。裁决见 [ADR-046](../decisions/046-dsh-praxis-package-and-roster.md)。主会话（Claude Opus 5.5）施工；Kit 去外链、控制面界面与文档由 Opus 子代理分区完成，主会话应用与核对。

## 已验证

| 范围 | 怎样验证 | 结果 |
|---|---|---|
| core 与适配层 | `node --test core/*.test.mjs adapters/*.test.mjs` | 31 项通过。新增覆盖：<br>• 自有来源与分类<br>• 来源包与名册关系<br>• 集合随上游的新增与下线<br>• 覆盖层修订与冲突<br>• MCP resources 与 prompts<br>• DSH 只注册 worker 工具与 `/praxis`<br>• 提示段只进 agent 会话 |
| 仓库模式 | `python3 scripts/check_praxis_acceptance.py` | 14 项通过。夹具改为“包旁 data + vault 来源包”；备份只含数据根与快照目录，恢复后关系与快照回到导出时 |
| fresh 安装 | `node dsh-praxis/release/walkthrough.mjs` | 14 项通过。步骤：<br>• 只复制 `npm pack` 会发布的 127 个文件，经 MCP 跑完整条链路<br>• 名册从空开始<br>• 发布文件里的链接都在包内<br>• 数据只写进 `$DSH_HOME/dsh-praxis` |
| 数据迁移 | 迁移前后对照 | 关系 582 → 582；项目索引登记与 14 条检查迁入数据根；`vault/project-indexes.json`、`vault/intake/praxis-captures.json` 移除并登记为退役路径 |
| Kit 自足 | validator 新规则（包内 Kit 只链到随包发布的文件） | 68 页 314 处包外链接清零 |
| 应用到名册 | Kit 去外链后的条目逐条应用 | 自有来源 75 条，新建挂载 123 条，30 条照抄概要的挂载补写说明，111 条已有说明保留；挂载共 705 条 |
| 真实集合 | 对一个模型生成作品集（100 件）执行 refresh | 第一次检查记下 100 个成员作基线，名册收其中 2 件，没有误报 |
| 控制面 | 应用内浏览器，真实数据只读；写操作在数据副本上做 | 走查：<br>• 来源包列表<br>• 自有来源编辑与淘汰<br>• 集合增补与跳过<br>• 修订撤回<br>• 需要处理<br>桌面与 375 px 无横向滚动，控制台只有刻意触发的 409 |
| 仓库 | `python3 scripts/validate_repository.py` | 通过 |

## DSH 真实任务对照（A3）

两段提示见下。DSH 在会话开始前已经加载新插件代码：会话 A 的运行记录带会话 ID 与 `kit/…` 路径。

| 项 | 会话 A：Praxis 可用，提示里不提 | 会话 B：明确不用 praxis 工具 |
|---|---|---|
| 模型 | `workbuddy/kimi-k3.1-pro` | — |
| 是否自己取用 | 是：`praxis_entry` → `praxis_resolve`（technical-explainer / html）→ `praxis_projects` → 读 12 个单元 → `praxis_consume` | — |
| 来源 | resolve 给出 12 条素材，worker 一条也没打开，运行记录的来源为空 | — |
| 登记 | 第一次 consume 把单元写成 `writing@479968c5efbc` 被拒，改用 ID 后成功；底稿、成品与 6 份检查记录登记为产物，带会话 ID | — |
| 交付 | 用户判断质量不佳，像是靠模型自身能力，没有用上来源 | 显著超时，没有交付 |

结论：
- **自主取用跑通了**：没有人提 Praxis，worker 就从入口走到 resolve，再到登记，产物落在项目约定的位置，运行带会话标识。
- **来源这一环没有发生**，有两个原因：
  - 这件任务的依据是两份 ADR，不需要外部参考；
  - resolve 的 12 条素材与任务无关的占了一半：`publish/html/exhibits.md` 上挂着 4 条量化研究来源（Freqtrade、Qlib、RD-Agent），说明写的是 quant-fieldguide 的章节用处，不是这一页的用处。
- 这次对照不能说明素材是否提升交付：B 没有交付，A 的模型能力是主要变量。

处理：
- 按用户指示，A 与 B 的产物、运行与产物记录已清理，`projects/ab-layout-explainer/` 删除；这一节是它留下的唯一记录。
- 首次 consume 的报错已补提示：只写单元 ID、不带版本。
- 那 4 条量化来源的挂载留给用户裁定：保留，或移除（移除可恢复）。

两段提示（会话 B 末尾多一句“这次不要调用任何 praxis_ 开头的工具”，路径改为 `without`）：

> 在这个仓库里做一页技术说明 HTML：给第一次接手这个仓库的协作者讲清仓库目录怎样按角色分流，读完能判断一份新文件该放在哪里。依据是 docs/decisions/044-repository-layout-by-role.md 和 docs/decisions/045-praxis-and-dsh-praxis-relations.md。单文件 HTML，离线能打开。底稿写到 projects/ab-layout-explainer/draft/with.md，成品交付到 projects/ab-layout-explainer/out/with/index.html。做完告诉我交付路径和你读过哪些材料。

## 没有验证

- **素材对交付的帮助：** 要换一件需要外部参考的任务，用能力相当的模型，两组都交付后再比。
- **DSH 界面：** `/praxis` 打开侧栏与 resolve、consume 卡片没有在桌面里点验过；DSH 的工具卡片 API 来自读包源码。
- **真实 fresh agent 的走查：** 在新 profile 里装包、用空目录完成任务这一步没有做；脚本化走查只走协议层。
- 发布与远端。
