# 设备与账号迁移指南

状态：候选研究指南；证据时间锚点为 2026-09-30。本指南登记准备与验收步骤，没有执行安装、网络修改、凭据撤销或设备清除。

## 先确认迁移类型

| 情况 | 开始方式 | 操作责任 |
|---|---|---|
| 正常换机，旧端仍受控 | 按恢复入口与保留资料 → 新端验证 → 旧端撤销 → 移交推进 | 个人设备由所有者决定；组织设备由 IT 确认流程 |
| 凭据疑似泄漏、设备遗失或旧端不可信 | 从可信设备联系账号或组织负责人，优先控制受影响访问；保留可用审计证据，再恢复访问与迁移资料 | 账号所有者与安全管理员；不等待新端验证才处置泄漏 |
| 组织托管设备或工作账号 | 先核对设备归属、管理状态、资料保留要求与操作角色 | IT 选择撤销、Retire、Wipe 或重新部署方式 |

“疑似泄漏”不能从 IP 变化或演示看板的差异推断。官方威胁报告描述的攻击活动不是个人账号风险模型；普通换机、家庭或办公 IP 改变的执法因果未获本批证据确认。来源：`anthropic-migration-evidence-20260930-anthropic-september-threat-report`（A08/A09）。[本地证据](../../provenance/anthropic-migration-20260930/anthropic-september-threat-report.md)。

## 正常换机

### 1. 恢复入口与保留资料

确认登录邮箱、可信号码、备用验证方式和组织支持入口在新端可用；迁移电话号码时先补齐可信号码。清点需要保留的文件、工作配置、账号登录方式和设备归属，备份后检查能否读取。Apple 的移交流程要求先备份与转移资料；Windows 移交流程同样要求先备份。来源：D01、D02、D05，见下方证据表。

记录登录方式及凭据管理责任，重新认证所需的 secret 留在受控环境；不把有效 token、API key、浏览器会话或原始账号资料写入通用仓库。组织资料的备份位置、保留期限和转移权限由组织确认。

如果账号已受限，按原账号的官方恢复或申诉入口处理。Claude 受限账号的申诉需登录原账号，部分账号可从受限页面导出可用资料，但导出范围与恢复时间没有保证。来源：`anthropic-migration-evidence-20260930-anthropic-safeguards-appeals`（A04）。[本地证据](../../provenance/anthropic-migration-20260930/anthropic-safeguards-appeals.md)。

### 2. 新端验证

通过官方入口安装或打开所需软件，用预定账号重新认证，检查必要资料是否可读、同步是否完成、工作权限是否正确。安装与登录另需实际授权，本指南不提供自动执行命令。

涉及 Claude 或 Claude Code 时，按对应产品核对当前支持地区与认证方式。产品地区名单可变化，企业代理配置也须符合组织网络策略；代理技术支持不能推导出可绕过地区限制。来源：A03、A06、A07/A08，见下方证据表。

验证结果至少记录：设备角色、产品与账号类型、检查时间、成功项、缺项、复核人。记录可回查的结果，凭据本身不进入记录。无法确认资料完整或新端权限时，暂停旧端清除并补齐缺项。

### 3. 旧端撤销

按产品分别确认旧端会话、开发工具授权、API key 和外部身份提供方凭据。Claude 网页的全会话登出覆盖网页、移动与桌面会话；Claude Code 授权 token 单独管理。全会话登出也会影响刚验证的新端，需要从新端重新登录复验。该操作不撤销 API key 或其他提供方的凭据。来源：`anthropic-migration-evidence-20260930-anthropic-active-sessions`（A01/A02）。[本地证据](../../provenance/anthropic-migration-20260930/anthropic-active-sessions.md)。

个人 Microsoft 账号的全局登出可能需要最多 24 小时，Xbox 不在覆盖内；组织 Entra 的刷新 token 撤销也不保证所有应用会话立即失效。分别记录请求、待生效与核验结果。API key 轮换和其他提供方的具体撤销入口不在本批覆盖内，应另查官方文档。来源：D04、D06，见下方证据表。

旧设备仍由本人保留时，是否退出账号或清除资料按保留用途决定；正常换机不自动要求恢复出厂设置。

### 4. 移交

| 设备 | 已完成备份和新端验证后的移交方式 | 完成核验 |
|---|---|---|
| 个人 iPhone / iPad | 按 Apple 对应设备流程退出、抹掉并处理可信设备关联 | 新所有者可开始设置；所需资料已保留，旧端账号关联按官方流程处理 |
| 个人 Mac | 按机型与系统选择“抹掉所有内容和设置”或官方恢复流程 | 留在设置助理，移交前不替新所有者登录 |
| 个人 Windows PC | 按 Microsoft 流程重置，再从个人账号移除设备 | 重置完成与账号移除分别确认 |
| 组织托管设备 | IT 按平台和管理配置选择 Retire、Wipe 或重新部署，并处理身份与设备记录 | 管理动作实际完成；资料保留与接收方确认，不以“已下发”代替完成 |

Apple 账号设备移除不等于存储清除，仍登录的设备可能再次出现。Intune Retire 通常清除组织管理的数据与配置，保留个人内容；Wipe 用于设备重置。管理动作依赖设备签到，效果随平台与配置变化。清理 Entra 设备记录须结合 MDM 流程，Autopilot 管理记录不能当普通旧设备记录随意删除。来源：D01—D03、D05、D07、D08，见下方证据表。

移交记录保留操作责任人、设备角色、资料去向、撤销状态、恢复入口与接收确认。尚未完成的远程动作由原责任人跟进；不要把等待签到、等待失效或账号受限写成迁移已完成。

## 凭据疑似泄漏的分支

正常迁移的连续访问顺序不适用泄漏处置。账号所有者从可信端核对影响范围；组织账号交安全管理员决定阻止新登录、撤销受影响会话、轮换凭据和保留审计证据。Microsoft Entra 官方指南支持管理员阻止登录与撤销刷新 token，同时提醒应用独立会话可能仍需单独处理。来源：`anthropic-migration-evidence-20260930-microsoft-entra-revoke-access`（D06）。[本地证据](../../provenance/anthropic-migration-20260930/microsoft-entra-revoke-access.md)。

完成访问控制后，再验证恢复入口、新端认证与资料完整性。账号平台的具体泄漏响应、API key 轮换、调查与通知责任须补查；本批材料不足以形成通用事故响应方案。

## 证据定位与覆盖

下表的 slug 与 ID 前缀 `anthropic-migration-evidence-20260930-` 合成稳定来源 ID。每条来源的 URL、摘要、访问日期、限制和证据摘录 hash 维护于 [catalog](../../provenance/anthropic-migration-20260930/catalog.json)。

| 主张 | 来源 slug / 本地证据 |
|---|---|
| A03：产品支持地区 | [anthropic-supported-regions](../../provenance/anthropic-migration-20260930/anthropic-supported-regions.md) |
| A06：Claude Code 安装与认证范围 | [anthropic-claude-code-setup](../../provenance/anthropic-migration-20260930/anthropic-claude-code-setup.md) |
| A07/A08：组织代理与 IP allowlist 的边界 | [anthropic-claude-code-network](../../provenance/anthropic-migration-20260930/anthropic-claude-code-network.md) |
| D01：iPhone / iPad 移交 | [apple-iphone-transfer-erase](../../provenance/anthropic-migration-20260930/apple-iphone-transfer-erase.md) |
| D02：Mac 移交 | [apple-mac-transfer-erase](../../provenance/anthropic-migration-20260930/apple-mac-transfer-erase.md) |
| D03：Apple 账号设备列表 | [apple-account-device-list](../../provenance/anthropic-migration-20260930/apple-account-device-list.md) |
| D04：个人 Microsoft 账号全局登出 | [microsoft-account-global-signout](../../provenance/anthropic-migration-20260930/microsoft-account-global-signout.md) |
| D05：个人 Windows PC 移交 | [microsoft-pc-handover](../../provenance/anthropic-migration-20260930/microsoft-pc-handover.md) |
| D06：组织 Entra 访问撤销 | [microsoft-entra-revoke-access](../../provenance/anthropic-migration-20260930/microsoft-entra-revoke-access.md) |
| D07：Intune Retire 与 Wipe | [microsoft-intune-retire](../../provenance/anthropic-migration-20260930/microsoft-intune-retire.md) |
| D08：旧设备记录清理 | [microsoft-stale-device-cleanup](../../provenance/anthropic-migration-20260930/microsoft-stale-device-cleanup.md) |

本轮没有检查真实账号、设备型号、系统版本、租户、权限、审计日志或网络配置，也没有运行迁移工具。未核实普通设备/IP 变化与账号执法的因果、通用 VPN 政策和设备指纹机制。源页面未快照，hash 仅对应本地证据摘录；本地指南可读，官方页面的离线重访及动态入口未保证。

操作顺序与记录字段是本仓库候选整理，不代表服务商正式 schema 或已验证的自动化流程。再次迁移、恢复失败、设备所有权变化、产品支持地区或管理入口更新时重访证据，并补充实际环境验收。
