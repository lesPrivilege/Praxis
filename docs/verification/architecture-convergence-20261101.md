# 架构收敛 · 2026-11-01

范围：[ADR-049](../decisions/049-architecture-convergence.md) 的定位与 Stream。主会话（Claude Opus 5.5）单独施工，未委派。

## 验证

| 检查 | 结果 |
|---|---|
| `npm test`（dsh-praxis） | 34 项通过，含新增的 stream 测试：列入入口、读作单元、不指定时不进任务、带出取用的单元、自己的素材排最前、未知 ID 报错、拒绝走覆盖层 |
| `npm run walkthrough` | 通过；未跑 fresh agent |
| 真实数据 `resolve({ stream: 'visual-motion-grammar' })` | 返回这一页、常驻单元、页面写明的 5 个单元；4 条挂载排在素材最前 |
| `python3 scripts/validate_repository.py` | 不通过：5 条 `projects/matter-room-design` 缺 README，见下 |

## 未验证与遗留

- **运行中的宿主。** DSH 与 MCP 服务还在跑旧代码，新参数要重载后才有；本轮只用进程内调用验证。
- **validator 红。** `projects/matter-room-design/` 是 10-27 起未提交的另一件工作，不在本轮范围，没有动。
- **`build_snapshot_manifest.py` 失败。** 某份已有 intake 的 `source_snapshots` 缺 `original_path`，与本轮无关。本批附图按 `scope.attachments` 的先例登记，不依赖它。
- **一处旧残留。** `provenance-praxis-captures:grammar-demos-guide` 是本地文件，仍挂在 4 个 Design 页上，会进 resolve，与 ADR-047“只列网页来源”不符。
- **未回原件核实。** 原 Chat 里 Codex cached/live 的说法与《校雠通义》的转述。三处 `[?]` 引用未恢复。
- **Stream 没有真实任务证据。** 还没有一件任务按 stream 消费过；控制面网页也没有专页。
