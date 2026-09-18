# Chat snapshots

| 文件 | 对话 | 范围 |
|---|---|---|
| [enterprise-kit.json](enterprise-kit.json) | 6aad2162-4364-83ec-853b-31df2c36c388 | 工具返回10轮，hasMore=false |
| [report-design-kit.json](report-design-kit.json) | 6aad44ad-bdbc-83ec-912e-a1b901556f2b | 工具返回2轮，hasMore=false |

| [work-system-toolchain.json](work-system-toolchain.json) | 6aad4c21-093c-83ec-9546-64d5c1661a4a | r1：工具返回5轮，hasMore=false；已由r2扩充 |

| [work-system-toolchain-20260918-r2.json](work-system-toolchain-20260918-r2.json) | 同一工作系统对话，r2 | r2共9轮，新增4轮；旧5轮内容不变 |
| [work-system-naming-preview-r2.json](work-system-naming-preview-r2.json) | 读取超时时的命名预览 | 历史暂存；后由完整r2补齐定位 |

2026-09-18通过read_thread读取，工具暴露的attachments均为空；不是原始网页完整导出。引用占位无法仅凭index恢复URL。JSON保留工具返回结构，消息最大上限20000字符；本次返回消息均未触及上限。

- [工作系统r3](work-system-toolchain-20260919-r3.json)：2026-09-19读取两页合并，完整19轮；新增10轮20消息，旧9轮未变。capture_metadata明确记录分页合并方式。
- 当前版本选择与历史顺序由 [chat-captures](../../intake/chat-captures.json) 管理。

- [工作系统r4](work-system-toolchain-20260919-r4.json)：完整20轮，新增1轮2消息（治理与抗折旧），旧19轮不变。

[建立材料分类体系](material-classification-20260919.json)：2026-09-19 完整获取 2 轮/4 消息，无截断，仅供备查。
