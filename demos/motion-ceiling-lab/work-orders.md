# 分批与工单

> 本页逐字取自交接稿（[快照](../../vault/snapshots/local/motion-ceiling-handoff-20261004/motion-ceiling-handoff-20261004.md) 第 509–525 行），是分批工单。交接稿写于 main `9514ce4`；此后的变化与本页哪些说法已经过时，见 [README](README.md#交接稿之后变了什么)。

本轮全为queued；用户尚未启动fresh Opus。每件完整工程由一位owner负责，必要时后续明确授权协作再分文件所有权，不提前并发碰共享scene/audio/timeline。

| 批次 | 工单 / 输出 | 先行条件 | 退出与失败处置 |
|---|---|---|---|
| B0 | WO00：选第一完整作品；表达提案/依赖许可/成本计划；scenario契约 | read wake、选brief、来源核查；无自动安装 | 语义/fixture/可消费输出明确；缺依赖记准确阻碍，继续已有栈验证 |
| B1 | WO01–02：MC01空间连续与MC02矢量排版（串行交完整件） | 各自先通过局部关键段而不是静帧模板 | ID/拓扑/长标签/逆向失败清楚；完整电影/交互按brief交，不只网格 |
| B2 | WO03–04：MC03因果模拟和MC04真实UI状态 | 共享词表可沿用；不共享renderer强绑定 | 守恒和lateACK反例、实际输入、中断回执；GPU不可用有等价解释路径 |
| B3 | WO05–06：MC05音画叙事与MC06历史混合媒介 | 版权/原声音事件/历史聚合可核，资源计划已测 | 完整听审/字幕与seek、未知/重算/rename；缺音频工具不伪造已听审 |
| B4 | WO07：作品间消费对照；原子反例修订；按准入提交Kit候选 | 至少已完成作品的真实回执，未完成项不填成功 | 知识与runtime准入分别处理；无复用收益条目退回项目局部 |

每一批先交完整件，再决定下一件是否仍代表独立能力。估算render walltime/disk/asset和依赖；先选小批样本测成本，未知不能编吞吐。局部样本仅决定技术可行，不代替最后整体taste、连续节奏或受众理解。

WO07逐条回答：发生了哪个真实任务、复用哪条约束、反例是什么、唯一入口在哪、未来更新谁负责。抽取知识不需等三个renderer；共享runtime需三独立场景消费，当前零实现，故没有提前promote。

回执字段：{workOrder, owner, repoCommit, fixtureHash, toolVersions, dependencyChanges, device, observedModes, outputPaths, fullPlaybackRange, interactionActions, normalChecks, failureChecks, editRerenderChecks, licenseExceptions, resourceUse, knownGaps, decision}。任何blocked项带原错误、影响范围及可继续工作；不能把网络代理失败记成审批拒绝。
