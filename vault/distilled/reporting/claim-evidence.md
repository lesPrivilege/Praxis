# Claim / Evidence 编排

## 内容先于页面

Reporting Kit 的最小工作单元不是一张 slide，而是一条可以被读者检查的 claim。建议把材料拆成：

```text
Claim
  → Evidence
  → Interpretation / uncertainty
  → Decision, recommendation or ask
  → Surface / renderer
```

这套顺序是历史 assistant 在 T2/A 对 source material → claim/evidence → presentation grammar → renderer → review 的压缩；它适用于 HTML、PPT、PDF、Markdown，但仍需按 artifact intent 调整。

## Claim 类型

| 类型 | 它回答什么 | 最低证据要求 | 允许的语气 |
|---|---|---|---|
| Observation | 材料直接显示了什么 | 原文、日志、记录或明确测量 | “材料显示…” |
| Fact | 已确认的外部/内部事实 | 可定位来源、版本、时间 | 直接陈述，附来源 |
| Derived | 从多个事实计算/归纳什么 | 输入、公式、口径、分母 | 说明推导边界 |
| Estimate | 当前只能估计什么 | 假设、区间、方法 | “估计/约/在假设下” |
| Forecast | 对未来的预测 | 基准、模型、时间窗口 | “预测/预期”，与 actual 分开 |
| Synthetic case | 为演示构造的样例 | 明示 synthetic、构造方法 | 不写成客户结果 |
| Inference | 基于证据的解释 | 支撑事实与替代解释 | “推测/可能/当前判断” |
| Recommendation | 建议采取什么动作 | 证据、标准、trade-off | “建议…因为…” |
| Decision | 已由责任人做出的决定 | owner、日期/版本、决定记录 | “已决定…”；链接 ADR |
| Ask | 需要读者做什么 | 对象、范围、后果、期限 | 明确动作与 decision owner |

不要用“看起来专业”的完整句子遮掉证据状态。原始事实、推算值、估算、synthetic case 和 forecast 应在文字或视觉上可区分（T2/A）。

## Evidence 记录的最小字段

```yaml
evidence:
  source_id:
  source_type: document | table | event | quote | measurement | experiment | decision
  locator: page | section | row | timestamp | object_id | url
  source_version:
  captured_at:
  applicable_scope:
  unit:
  denominator:
  status: actual | derived | estimate | forecast | synthetic | unverified
  supports_claim:
  conflicts_with:
  missing_context:
  owner:
```

这是候选登记 schema，不是现有仓库运行时 schema。字段的目的，是让读者知道“这句话从哪里来、何时有效、是否计算过、能否复核”。

## 证据与视觉位置

- L0/页面环境不承载事实；
- L1 标题承载本页判断或准确主题；
- L2 主展项承载主要证据关系；
- L3 放局部例证、定义、差异或反例；
- L4 放来源、版本、单位、时间和范围。

这一层级与 career-kit 本地图式库的 L0–L4 约定相符；本地规则将 L4 设为低权重 metadata，但影响判断的状态不能降到不可读。相关原文见 [`local-design.md`](local-design.md)。

## 不确定性与缺口

没有证据时，不用“缺少数据”作为脚注后的免责语，而应把它作为当前判断的边界：

```text
claim
  → 已有证据
  → 缺什么
  → 影响哪个结论
  → 下一步要取什么材料
```

当证据冲突时，保留冲突双方和版本，不用一张“统一结论”把差异抹平。对法律、风险、治理类材料，应能回到原文、责任人、适用条件和残余风险；这是来源中对 evidence / authority / residual risk 的共同要求（T1/A）。

## Decision 与 Ask

页面不能同时让读者猜“只是通知”还是“要我决策”。在 metadata 中先写 `intent`、`decision_owner`、`required_ask`，然后：

- `inform`：清楚交付状态和关键变化；
- `explore`：列出假设、未知与研究路径；
- `align`：说明共同边界、角色和未决问题；
- `decide/approve`：前置 recommendation、选项、trade-off、风险和 ask；
- `execute`：把 scope、contract、owner、acceptance、dependency 置于一级；
- `handoff`：把责任、开放问题和下一动作写清楚；
- `learn`：保留结果、失败模式、证据和下一轮修改。

这是一套从 T1/A 元数据和不同 audience grammar 归纳的 routing 规则，不取代仓库 ADR。

## Review 时的证据检查

1. 标题是否承载一个可检查的判断或准确主题？
2. 页面主展项是否真的支持标题，而不是只展示相关图形？
3. 所有数字是否有单位、时间、基准和分母？
4. actual、forecast、estimate、synthetic 是否可区分？
5. 引文是否能回到来源、版本和适用条件？
6. 推荐是否与证据相邻，替代方案和 downside 是否暴露？
7. Ask 是否写出对象、动作、期限和后果？
8. 缺口、冲突和未验证状态是否保留？

## 待核实

- 本文 schema 不是当前 kit 的正式 JSON Schema；需在实际报告任务中验证字段是否足够。
- “L4 metadata 低权重”的本地图式规则不能让审计、权限、版本和风险状态变成不可读小字。
- 外部引用占位无法支持其原始主张；本次仅消费 chat 中表达的结构建议。

