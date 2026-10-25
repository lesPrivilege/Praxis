# dsh-praxis 管线登记与挂载说明 · 2026-10-25

基线：`37be197`。[工单](../../dsh-praxis/work-order.md) A2 与 A4 的余下部分，取舍见 [ADR-042](../decisions/042-dsh-praxis-upstream-checks.md) 与 [ADR-043](../decisions/043-dsh-praxis-pipelines-as-sources.md)。

## 已验证

| 范围 | 怎样验证 | 结果 |
|---|---|---|
| core 与适配层 | `node --test dsh-praxis/core/*.test.mjs dsh-praxis/adapters/*.test.mjs` | 27 项通过；适配层对真实仓库的每个任务类型与流水线跑 resolve |
| 命令行、MCP 与真实构建脚本 | `python3 scripts/check_praxis_acceptance.py` | 14 项通过 |
| 仓库 | `python3 scripts/validate_repository.py` | 通过 |
| resolve 修正 | 修正前后对真实仓库跑全部任务类型的 resolve | 修正前，technical-explainer 的 html 流水线出错；修正后全部通过 |
| 来源检查 | 被任务类型取到的 11 个带 URL 的来源，用新的 refresh 检查 | 都打得开；3 个 Google 页面第一遍失败，原因是本机代理，见 ADR-042 |
| 写回格式 | 由 store 写的 267 个 JSON 文件原样写回；在手工排版的 catalog 上改一处 | 逐字不变；diff 只有改动的两行 |
| 管线登记 | 一次 capture 登记 5 条管线，挂到 publish/video 与 publish/html | resolve 视频任务时，素材里有三条视频管线 |
| 产出关系 | 补记 8 件产物的 `made_with` | 书单系列管线的来源条目列出 7 个成片 |
| 挂载说明 | 一名 Opus 子代理为 108 条 Design 挂载起草说明；主会话逐条读过，核对长度与重复，经 `praxis_curate` 写入 | 108 条都按位置写，没有一条仍等于来源概要；每条修订进了 history |

## 待用户决定

子代理对两条挂载的关系本身提出怀疑。两条都已写了说明，关系是否保留由用户决定：

| 挂载 | 怀疑的理由 |
|---|---|
| `anatomy-skill-landing` → composition/object-representation | 来源正文没有取得，页面自己写明不能拿相邻的 README 代替 |
| `commons-original-image-http-403` → composition/spatial-materials | 这条记录的是一次 HTTP 403 访问失败，没有图像内容 |

## 没有验证

- 新工具与视图在 DSH 桌面里的表现：要重启 DSH。
- 一件新任务从 resolve 选管线、用它产出、consume 带 `made_with` 的完整过程：留给 A3 的真实任务。
- 挂载说明的读者检验：没有让另一位读者只看说明来判断何时打开来源。
