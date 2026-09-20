# 演示实现

当前无可运行 demo。创建实现前完成 [场景契约](../scenarios/_template/README.md)，按 [工程蓝图](../templates/demo/README.md) 选择必要目录。

## 准入与交付

| 记录 | 要求 |
|---|---|
| 消费版本 | scenario ID、Kit revision、实现版本 |
| 数据 | synthetic 或经明确审查的 sanitized fixture；scenario provenance 记录来源、许可与导出依据 |
| 运行 | 启动方式、依赖、mock 与真实集成范围 |
| 验收 | 正常与失败 fixture、预期结果、运行回执和已知缺口 |
| 后续 | 接收者、维护责任、下一验证或退出条件 |

真实客户交付进入独立项目；原始资料和敏感反向映射留在受控 Source Vault。demo 禁止通过软链接、绝对路径或 live query 读取真实企业资料。具体分区见 [ADR-006](../docs/decisions/006-demo-project-vault.md)。

本仓库 demo 使用普通子目录。需要独立历史时另建仓库并登记关系；Git worktree 放在仓库外，禁止以嵌套 `.git` 给 demo 子目录附加历史。
