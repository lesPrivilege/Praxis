# Canonical demos

本目录承载可复用的演示实现；当前仅建立入口，没有可运行demo。

- `scenarios/` 定义业务闭环、schema、policy、fixture与验收要求。
- `demos/<id>/` 在需要实际运行时实现一个或多个场景，登记所用scenario和kit版本。
- 真实客户交付移入独立项目repo；客户原始资料留在独立Source Vault。

初期demo作为本repo普通子目录维护；不要在这里随意嵌套`.git`。需要独立历史时另建repo并登记关系。Git worktree是整个仓库的checkout，放在仓库外，不是给单个子目录附加版本历史。

Demo仅消费synthetic或经明确审查的sanitized fixture，不能通过软链接、绝对路径或live query绕回真实企业资料。数据来源与许可/导出依据写进scenario provenance；敏感的反向映射留在外部受控vault。

开工入口：[场景模板](../scenarios/_template/README.md)、[ADR-006](../docs/decisions/006-demo-project-vault.md)。
