# 独立视觉审阅证据

2026-10-15，原生1920×1080、DPR=1。截图来自cut3/film/index.html?render=1，通过Film.seek采集关键阶段；不是整片连续观看。

captures.json是首批51帧记录；其中tools/rag/plan/identity场内50秒已越过新版各场尾，不用于对应场结论。current-captures.json为重新按实际场长采样的四个一般场，断言activeScene与目标一致，并记录源码hash。后续修正以独立前缀留图，不覆盖初检问题证据。

实际查看名单与裁决将记录于[独立审阅](../../design/independent-visual-review.md)。现阶段图像存在不等于已人工查看或已接受。

## 实际查看名单

用于对应场审阅的53张新版图如下。4张越界初检图tools-050、rag-050、plan-050、identity-050仅用于识别采样错误，不作为这些场的视觉结论。

- [message-journey-004.png](message-journey-004.png)
- [message-journey-068.png](message-journey-068.png)
- [message-journey-104.png](message-journey-104.png)
- [message-journey-163.png](message-journey-163.png)
- [permission-032.png](permission-032.png)
- [permission-068.png](permission-068.png)
- [permission-080.png](permission-080.png)
- [permission-113.png](permission-113.png)
- [permission-148.png](permission-148.png)
- [workspace-010.png](workspace-010.png)
- [workspace-078.png](workspace-078.png)
- [workspace-128.png](workspace-128.png)
- [workspace-158.png](workspace-158.png)
- [workspace-183.png](workspace-183.png)
- [java-recovery-042.png](java-recovery-042.png)
- [java-recovery-062.png](java-recovery-062.png)
- [java-recovery-089.png](java-recovery-089.png)
- [tools-010.png](tools-010.png)
- [tools-028.png](tools-028.png)
- [rag-028.png](rag-028.png)
- [plan-028.png](plan-028.png)
- [identity-028.png](identity-028.png)
- [current-tools-045.png](current-tools-045.png)
- [current-rag-043.png](current-rag-043.png)
- [current-plan-046.png](current-plan-046.png)
- [current-identity-043.png](current-identity-043.png)
- [fresh-permission-080.png](fresh-permission-080.png)
- [fresh-permission-088.png](fresh-permission-088.png)
- [fresh-message-journey-068.png](fresh-message-journey-068.png)
- [fresh-workspace-128.png](fresh-workspace-128.png)
- [fresh-java-recovery-042.png](fresh-java-recovery-042.png)
- [fresh-message-journey-014.png](fresh-message-journey-014.png)
- [fresh-message-journey-033.png](fresh-message-journey-033.png)
- [fresh-message-journey-057.png](fresh-message-journey-057.png)
- [fresh-message-journey-126.png](fresh-message-journey-126.png)
- [fresh-message-journey-185.png](fresh-message-journey-185.png)
- [fresh-java-recovery-023.png](fresh-java-recovery-023.png)
- [fresh-java-recovery-030.png](fresh-java-recovery-030.png)
- [worked-tools-025.png](worked-tools-025.png)
- [worked-tools-040.png](worked-tools-040.png)
- [worked-plan-035.png](worked-plan-035.png)
- [worked-rag-040.png](worked-rag-040.png)
- [worked-identity-035.png](worked-identity-035.png)
- [lifecycle-message-journey-048.png](lifecycle-message-journey-048.png)
- [lifecycle-message-journey-126.png](lifecycle-message-journey-126.png)
- [lifecycle-message-journey-188.png](lifecycle-message-journey-188.png)
- [worked-tools-012.png](worked-tools-012.png)
- [worked-plan-010.png](worked-plan-010.png)
- [worked-plan-024.png](worked-plan-024.png)
- [worked-rag-010.png](worked-rag-010.png)
- [worked-rag-028.png](worked-rag-028.png)
- [worked-identity-010.png](worked-identity-010.png)
- [worked-identity-024.png](worked-identity-024.png)

新增worked-/lifecycle-分别对应具体实例与消息生命周期补回。metadata JSON记录取样参数与hash；完整独立结论见[审阅报告](../../design/independent-visual-review.md)。
