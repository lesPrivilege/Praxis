# 项目 · 交付与实验

每个项目是这里的一个目录，底稿、中间产物、最终产物、验收证据各在约定位置（[ADR-044](../docs/decisions/044-repository-layout-by-role.md)），登记在控制面的 `praxis_projects`，产物由 `praxis_artifacts` 按版本管理。一个项目的 README 说四件事：是什么、做到哪、下一步、东西在哪。

新项目先复制 [场景契约](../templates/scenario/README.md)写清对象、动作、证据与验收，再按 [工程蓝图](../templates/demo/README.md)选目录，用 `praxis_project` 登记；真实客户交付进独立项目，原始资料留在受控 Source Vault（[ADR-006](../docs/decisions/006-demo-project-vault.md)）。

## 知识与教材

| 项目 | 是什么 | 做到哪 |
|---|---|---|
| [books](books/README.md) | 按学习目标编订的教材正文，来源与结构数据回链 Vault；现有《SaaS 工程全景》 | 主线 13 个文件经独立审阅改写；离线交互版见下 |
| [saas-engineering-textbook](saas-engineering-textbook/README.md) | SaaS 工程教材的离线多页站点：70 页、33 例结构面板、9 个交互图件；场景契约在 `scenario/` | 构建、Atlas 检查与逐图件检查已做；用户未目验，读屏和打印未逐页查 |
| [jev](jev/README.md) | Jev 与 System One 决策模型的 2026-10-23 快照：底稿、单页网页、五条线的研究登记 | 网页第 4 版已登记；来源登记按引用进名册 |
| [palantir](palantir/README.md) | Palantir 方法论主题入口与 [入职书单讲解视频系列](palantir/reading-list-series/README.md)（总论加五集与合集） | 7 个成片已登记；主题正文与 Kit 采纳未做 |
| [tally](tally/README.md) | Tally SaaS 研究主题入口 | 只有《清算 SaaS》书稿登记 |

## 讲解页与看板

| 项目 | 是什么 | 做到哪 |
|---|---|---|
| [deerflow-explainer](deerflow-explainer/README.md) | DeerFlow 各局部实现的单文件交互讲解页 | 八个交互图件与打印已检查，用户目验通过；无受众测试 |
| [dsh-praxis-explainer](dsh-praxis-explainer/README.md) | 以 dsh-praxis 插件自身为题的技术说明页，DSH 会话所作 | 用来测试插件；两个文件 |
| [palantir-discovery](palantir-discovery/README.md) | 从诉求到决定：Palantir 首次设计打样，一页离线交互网页 | 宽窄屏、打印与五条交互路径已检查；无受众验证 |
| [drift](drift/README.md) | 网络、设备与浏览器观测看板：读数、含义、变化 | 字段、后续维度与验收状态见项目说明 |
| [enterprise-grammar-lab](enterprise-grammar-lab/README.md) | 企业工作面语法实验：律所事项工作台与合同付款复核台，共用一层契约与假后端 | 45 项测试通过，两轮独立复查；无对照组，无专业人员看过 |
| [consumption-sample](consumption-sample/README.md) | 退款复核的合成消费小样，20 例确定性断言 | 可本地运行；不代表真实业务 |

## 视频

| 项目 | 是什么 | 做到哪 |
|---|---|---|
| [knowledge-film-001-pyramid-cut5](knowledge-film-001-pyramid-cut5/README.md) | 《金字塔原理》第五版，11 分钟中文知识片，配音先行 | 六项检查通过；用户看过，瓶颈在合成语音 |
| [knowledge-film-001-pyramid](knowledge-film-001-pyramid/README.md) | 同片第四版，冻结的验收版 | 原样保留 |
| [agentscope-enterprise-film](agentscope-enterprise-film/README.md) | AgentScope 企业线知识片：47 场覆盖 53 主题，无 TTS | 第三版；检查范围见制作记录 |
| [role-baseline-film](role-baseline-film/README.md) | 视频能力测试：岗位职责与薪酬方案说明片，97 秒加一份 txt | 七项检查通过；无独立冷读与受众测试 |
| [write-kit-film](write-kit-film/README.md) | 视频能力测试：Write 分支知识讲解，245 秒无配音 | 六项检查通过，一次 Opus 审阅；制作方未按实际速度完整看过 |

## 设计语法工场

| 项目 | 是什么 | 做到哪 |
|---|---|---|
| [visual-grammar](visual-grammar/README.md) | 视觉语法演示工场：四件可运行作品，含 [A3 机制演算](visual-grammar/a3-event-state-context/README.md) | 作品交付；无受众验证 |
| [editable-native-svg](editable-native-svg/README.md) | 可编辑原生 SVG：44 项需求与五批工单，第一批四个关系图件已交付 | 其余四批、编辑器往返与读屏未做 |
| [motion-ceiling-lab](motion-ceiling-lab/README.md) | 六件动态作品的施工现场 | MC01 已交付，其余五件未开始 |

## 准入与交付

| 记录 | 要求 |
|---|---|
| 消费版本 | scenario ID、Kit revision、实现版本 |
| 材料来路 | 参考来源 ID、已消费提炼、借用或改写的范围、项目自身增量；公开说明只含已泛化且可披露的内容，原 Chat 留 Vault |
| 数据 | synthetic 或经审查的 sanitized fixture；provenance 记来源、许可与导出依据 |
| 运行 | 启动方式、依赖、mock 与真实集成范围 |
| 验收 | 正常与失败 fixture、预期结果、运行回执和已知缺口，放在 `evidence/` |
| 参考增量 | 参考 ID 与版本、实际 fixture、取用或改写、结果及反例；按 [参考生命周期](../docs/governance/reference-lifecycle.md) distill 回唯一卡片 |
| 后续 | 接收者、维护责任、下一验证或退出条件 |

demo 禁止通过软链接、绝对路径或 live query 读取真实企业资料。项目用普通子目录；需要独立历史时另建仓库并登记关系，不以嵌套 `.git` 附加历史。中间产物与成片默认不入库，按项目 `.gitignore` 列外；临时物进项目的 `tmp/` 或仓库根的 `work/`。

在途：[量化入门交互知识页](../demos/quant-fieldguide/)仍在 `demos/`，由另一会话施工，完成后迁入这里。
