# ADR-006 · Kit, demo, project and Source Vault

状态：accepted。编订：Astra。日期：2026-09-18。

依据：工作系统r2新增轮 `06836283-9e87-436e-89b5-3c09eb871893`（demo/project生命周期）与 `55fd046b-ba89-4718-afc5-f5328b769f96`（企业原始资料与projection边界）。消费笔记见 [Work System](../../vault/distilled/work-system/README.md)。

## 裁决

1. Kit持有共用grammar、契约、参考和合成demo。`scenarios/` 定义闭环，`demos/` 保存未来可执行参考实现；没有实现时不创建空技术目录。
2. Demo初期用本repo普通子目录；独立git历史或真实客户交付触发独立repo，不在Kit内堆嵌套仓库。worktree是repo级checkout，放在Kit外。
3. 独立项目记录所消费的Praxis revision、scenario/demo ID、local overrides；项目结果经select → sanitize → distill → candidate → ADR回流，不直接把客户实现合回Kit。
4. 企业邮件、会议、录音、联系人和真实文档属于按组织治理的独立Source Vault。Praxis的 `vault/` 是Kit知识与设计研究仓，不承担客户原始业务资料库职责。
5. Canonical demo优先synthetic；真实资料派生物需经过选择、脱敏、泛化/重写、人工复核，才成为sanitized projection。改姓名不等于已脱敏。真实source到fixture的敏感映射留在Source Vault；Kit可只保留不泄露身份的导出记录。
6. fixture由固定版本生成，禁止demo直接连真实客户数据或把路径/凭证/身份带进截图、trace、metadata。真实项目的权限和留存规则由项目决定。

## 本次实现界限

只建立目录及治理契约；不创建外部客户vault、不迁移现有企业资料、不生成所谓已脱敏客户数据。当前本地设计快照也不能因位于vault就自动视为可公开发布；远端连接与发布是两个动作。

## 可修订点

demo规模、独立发布节奏或实际客户约束改变时，以新ADR调整拆分时机。回流晋升仍遵循ADR-002的独立场景证据门槛。
