# 事项工作台

[场景契约](../../scenarios/matter-workbench.md)的界面：把契约里的事项、风险、依据、文书、任务投影成页面。接口模块在 `api.ts`，业务用词在 `labels.ts`，地址规则在 `routes.ts`，路由树和外壳在 `MatterApp`。

| 文件 | 页面或部件 |
|---|---|
| `MatterListPage` | 事项列表：筛选、排序、分页都在 URL 里，可存成视图；批量指派复核人 |
| `AssignReviewerDialog` | 批量动作的作业进度和逐项结果 |
| `MatterNav` | 侧栏：全部事项和已存视图 |
| `MatterPage` | 事项页：对象头加概览、风险、依据、文书、任务、记录六个投影，各自读取、各自失败 |
| `RisksPanel` | 风险列表与所选风险的依据、处置记录 |
| `RiskActions` | 提出建议、作出决定、退回建议的字段；版本绑定、尝试结果和离开拦截由共用的 `ActionPanel` 处理 |

地址即状态：`/matters/M-2048/risks/R-3104` 直接到一项风险，`/matters/M-2048/activity?attempt=<编号>` 标出一次动作留下的记录。
