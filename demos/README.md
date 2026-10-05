# 演示实现

当前有施工交接与并行生成的作品，具体运行和验收状态见各项目README。创建实现前完成 [场景契约](../scenarios/_template/README.md)，按 [工程蓝图](../templates/demo/README.md) 选择必要目录。

## 准入与交付

| 记录 | 要求 |
|---|---|
| 消费版本 | scenario ID、Kit revision、实现版本 |
| 材料来路 | 参考来源 ID、已消费提炼、借用或改写的范围、项目自身增量；公开说明只包含已泛化且可披露的内容，原 Chat 留 Vault 备查 |
| 数据 | synthetic 或经明确审查的 sanitized fixture；scenario provenance 记录来源、许可与导出依据 |
| 运行 | 启动方式、依赖、mock 与真实集成范围 |
| 验收 | 正常与失败 fixture、预期结果、运行回执和已知缺口 |
| 参考增量 | 参考ID与版本、实际fixture、取用/改写、结果及反例；按 [参考生命周期](../docs/governance/reference-lifecycle.md) distill 回唯一卡片 |
| 后续 | 接收者、维护责任、下一验证或退出条件 |

真实客户交付进入独立项目；原始资料和敏感反向映射留在受控 Source Vault。demo 禁止通过软链接、绝对路径或 live query 读取真实企业资料。具体分区见 [ADR-006](../docs/decisions/006-demo-project-vault.md)。

本仓库 demo 使用普通子目录。需要独立历史时另建仓库并登记关系；Git worktree 放在仓库外，禁止以嵌套 `.git` 给 demo 子目录附加历史。

## 已准备的施工包

- [可编辑原生 SVG](editable-native-svg/README.md)：44 项需求、可编辑合同、发现与可视索引设计、六组合成输入及五批 fresh Opus 工单；第一批（SVG-01）已交付四个由语义输入生成的关系图件，宽窄两版静态 SVG 与预览页，自动检查和看图范围见其回执；其余四批、编辑器往返、读屏和消费验收都没有做，用户尚未 review。

- [Drift 网络、设备与浏览器观测看板](drift/README.md)：按读数、含义、变化组织观测，支持私有历史、固定基线与合成演示；当前字段、后续维度及验收状态见项目说明。

- [视觉语法演示工场](visual-grammar/README.md)：Luna来源索引、选编工单、场景契约与Opus唤醒prompt；四件可运行作品已交付（网页与 VP9/Opus WebM，含一件只做形式探索的作品；未做受众验证），验收见各作品回执。

- [从诉求到决定 · Palantir 首次设计打样](palantir-discovery/README.md)：按用户交来的设计交接包做的一页离线交互网页，材料全部合成，按钮只模拟；宽窄屏、打印与五条交互路径已检查，没有做受众验证。

- [企业工作面语法实验](enterprise-grammar-lab/README.md)：2026-10-04 用 Kit 的企业工作语法施工的两个合成工作台，律所的事项工作台和合同运营的付款复核台，装在一个应用里，共用一层与业务无关的契约、后端内核和工作面。各有 OpenAPI 契约和模拟冲突、结果未知、部分失败等行为的假后端。45 项测试（后端 40，前端金额 5）和界面主要路径已走通，两轮各有一次独立复查；前端的动作面板没有自动化测试，没有对照组也不打算做，没有专业人员或受众看过，无障碍只抽查。技术栈记在只对该 demo 有效的实现 ADR 里；两轮的教训留成四条带反例的候选条目，没有提交 Kit 裁决。依赖需手动 `npm install`。

- [Knowledge Film 001 ·《金字塔原理》第五版](knowledge-film-001-pyramid-cut5/README.md)：11 分钟的中文知识片，配音先行、网页舞台逐帧渲染；旁白和画面文字按修订后的成文规则重写并经独立审阅。成片检查六项通过；用户看过，认为瓶颈在合成语音。用于内部演示，授权没有核对。[第四版](knowledge-film-001-pyramid/README.md)是冻结的验收版，原样保留。

- 合成消费小样：[退款复核、材料职责与 XMind 往返门槛](consumption-sample/README.md)。20 例合成断言可本地运行；不代表真实业务或模型验收。
- [A3 机制演算项目](visual-grammar/a3-event-state-context/README.md)：2026-10-02 从旧 VG-01 加工合成输入制作新的交互 HTML 与 Remotion MP4；项目集中保留内容基线、消费摘要、源码、成品和当轮证据。制作与隔离浏览器测试完成，原生屏幕复验有缺项，用户接收待定。
