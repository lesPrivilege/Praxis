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

- [Drift 环境观测看板](drift/README.md)：本地只读采集、逐提供方观测、私有历史与手动基线对照；保留独立演示模式。已完成本机真实采集验收，覆盖与限制见项目说明。

- [视觉语法演示工场](visual-grammar/README.md)：Luna来源索引、选编工单、场景契约与Opus唤醒prompt；四件可运行作品已交付（网页与 VP9/Opus WebM，含一件只做形式探索的作品；未做受众验证），验收见各作品回执。

- [A3 机制演算项目](visual-grammar/a3-event-state-context/README.md)：2026-10-02 从旧 VG-01 加工合成输入制作新的交互 HTML 与 Remotion MP4；项目集中保留内容基线、消费摘要、源码、成品和当轮证据。制作与隔离浏览器测试完成，原生屏幕复验有缺项，用户接收待定。
