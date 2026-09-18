# Audience Grammar 与交付面

## 先建模阅读行为

用户要求面向高管和不同风格/水平的高管调整汇报材料（T1/U）。历史回答建议不要把读者建模成性格标签，而记录四个可观察维度：

```text
decision altitude
functional lens
technical literacy
attention budget
```

同一组 claim/evidence 可以生成不同 surface；这不是降低内容真实性，而是改变阅读顺序、密度和下钻路径。

## 受众适配

| 受众 | 先回答什么 | 适合的顺序/visual |
|---|---|---|
| CEO / Board / Founder | 发生什么、为何现在重要、建议什么、要决定什么、downside | Recommendation → Why now → Evidence → Options/trade-offs → Risk → Ask；少量关键指标 |
| CFO / Finance / Procurement | 业务结果、投入、持续成本、回报、downside、敏感性、承诺 | cost waterfall、scenario、payback、unit economics、sensitivity |
| CTO / CIO / Technical founder | 系统边界、约束、架构选择、替代方案、可逆性、失败模式、证据 | architecture、data flow、sequence、eval/benchmark |
| COO / 业务负责人 | 今天怎么做、哪一步有问题、新方案改变哪里、谁负责、异常如何处理、如何推广 | current-state → target-state swimlane、责任、exception path、rollout |
| Legal / Risk / Security | 数据/动作流、授权、控制、不可逆动作、例外、审计证据、残余风险 | data flow、control matrix、permission boundary、human checkpoint、decision log |
| Working team | 做什么、为什么、范围、contract、owner、验收、依赖、未决 | requirements table、flow/state、接口、open-issue table |
| Customer-facing | 共同问题定义、业务价值、系统接缝、实施顺序、下一步 | workflow、architecture、value map、implementation sequence |

CEO/Board、CFO、CTO、COO、Legal/Risk 和 working team 的顺序是 T1/A 的候选受众 grammar；具体读者的实际需求仍需在项目中确认。

## 可观察的阅读 profile

| Profile | 材料调整 |
|---|---|
| Interrupt-driven | 第一屏自足；被打断后仍能找回主结论、风险和 ask |
| Pre-read / deep reader | narrative memo；完整 reasoning，会议只讨论争议点 |
| Metrics-first | 先 KPI、variance、evidence，再解释原因 |
| Mechanism-first | 先系统、workflow、因果机制，再谈收益 |
| Risk-first | 先 downside、controls、reversibility、fallback |
| Vision-first | 先 target state / strategic wedge，再进入 execution |
| Low-domain-literacy | 业务结果 → mechanism → details；去掉内部术语 |
| High-domain-literacy | 少科普，多 boundary、trade-off、edge case 和原始证据 |

这些 profile 是可观察阅读行为，不应写成“某个老板喜欢短 PPT”的不可迁移印象（T1/A）。

## Delivery mode

### Live briefing

页面为现场口述留空间；一屏一个主要动作，避免把完整讲稿挤进小字。标题仍需自足，不能依赖讲者现场纠正错误理解。

### Pre-read / readable document

脱离讲解者仍需理解主结论、证据、风险和 ask；可有更高信息密度，但应提供清晰段落、来源和下钻顺序。

### Evidence appendix

完整保留数据表、原文摘录、方法、计算、版本、反例和未决项；附件不是把不清楚的主文塞进去，而是让判断可复核。

### Web / PPT式 HTML

把页面视为 claim/evidence 的 surface；支持屏幕阅读、链接、responsive 适配和静态导出，但不让 HTML renderer 新增业务事实。T2/U 明确把 PPT 式 HTML 纳入 Reporting Kit；T2/A 把 HTML、PPT、PDF、Markdown 视为不同 renderer。

## 同一事实的重排示例

同一个 AI 方案：

```text
CEO:       现状缺口 → 覆盖价值 → 风险 → Ask
CFO:       outcome → cost → return → sensitivity
CTO:       boundary → architecture → failure mode → evidence
COO:       current step → changed step → owner → exception → rollout
Legal:     data/action → authority → control → audit → residual risk
Team:      scope → contract → acceptance → dependencies → open questions
```

事实、来源和不确定性保持一致；变化的是 reading path 与 visual emphasis。

## 会议与异步阅读

历史回答引用 page-led meeting 的思路：先 silent pre-read，再把会议时间留给评论、讨论、decision 和 owner，而不是现场朗读全文（T1/A）。本地 career-kit 也把 live deck 与可独立阅读材料分开管理。两者是方向建议，不是外部事实声明。

## 待核实

- 项目实际是否存在 board、CFO、COO 或 Legal/Risk 等受众，需由项目 owner 确认。
- attention budget 仍是元数据字段，未定义量化单位。
- 同一内容在 16:9 deck、HTML、memo、PDF 和移动端的交付约束，需要 renderer 实测。
