# 环境与数据分区契约

## 数据的归属

| 层 | 维护内容 | 与公开Kit的关系 |
|---|---|---|
| Praxis | 规则、schema、模板、合成fixture、公开参考与可发布提炼 | 可独立版本化；发布范围另行确定 |
| Machine config | 本机路径、已装能力、运行配置、连接标识 | 按机器生成，不作为通用事实硬编码 |
| Organization Source Vault | 企业邮件、会议、文档、人员与原始证据 | 按组织隔离；不得直接流入公开Kit |
| Customer Project | 场景state、客户策略、验收、交付与source引用 | 独立权限和生命周期；记录Praxis revision |
| Runtime state | runs、临时文件、缓存、重试、调用日志 | 可定位、可清理；不冒充知识与已确认业务state |
| Secret store | credential、token、会话与授权材料 | Kit只记引用及用途，不收录值 |

文档提炼、日志、截图和索引同样可能携带企业事实；不能只隔离原件而放任派生物混入公开层。真实资料导出按 [ADR-006](../../docs/decisions/006-demo-project-vault.md) 的fixture规则审查。

## 能力登记

每项能力记录：ID、用途、可用控制面、owner、账号/组织scope、读写动作、输入输出、安装/版本来源、验证方法、失败与替代路径。账号记录只包含管理所需元数据和secret引用，不记录密码或令牌。

本机路径通过配置映射，避免复制某台机器的绝对路径成为运行前提。原路径可以保留在私有溯源记录中；公开发布时另查路径是否泄漏身份或组织信息。

## Fresh-machine流程

inventory → plan/diff → authorized apply → verify → receipt。每步写实际结果与缺口；中途失败能够停止、重试或回退。bootstrap设计不得假定所有厂商、软件和账号在每台机器都可用。

当前尚未实现installer、账号配置器、全局Agent指引安装或数据库。后续实现必须能证明重复运行不会重复创建状态，升级不会覆盖人工配置，并明确卸载/迁移边界。
