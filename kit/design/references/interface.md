# 产品软件界面参考

本页是 U01–U09 的 canonical route，覆盖控件尺寸、对象状态、界面层级、密度和 conceptual donor。返回 [Design 参考路由](README.md) 或 [兼容入口](../references.md)。URL 证据与 Kit 消费状态分开记录；本页不把历史 CW handoff 变成 Praxis 的通用 runtime contract。

## 尺寸、缩放与控件语义

| ID | 参考 | 状态 | 是什么 / Kit 消费什么 | 边界 | 消费位置 | 重访与证据 |
|---|---|---|---|---|---|---|
| U01 | WCAG 目标尺寸与缩放（CW-FE-R01） | accepted | 本地消费把 24 CSS px 作为报告的 AA 下限，44 px 作为 coarse/high-consequence 路径选择，并把 200% 文字缩放、布局重排、文字间距分别列为检查项 | 24 与 44 是不同准则；不把 44 px 说成通用 WCAG 要求，也不声称控件已通过 | CW 工作台 | 开始 UI 验收时重读标准并测 geometry；[消费记录](../../../vault/distilled/frontend-design/cw-consumption.md) |
| U02 | W3C APG Tabs（CW-FE-R01、R03） | accepted | tab 识别对象、版本与范围；关闭/切换是视图动作，不等于取消、删除或批准 | 本地 handoff 未独立证明所有实现和焦点状态 | CW 工作台 | tabs/Preview 改动时复核 APG 与真实焦点；同上 |

## 运行时状态、表面与密度

| ID | 参考 | 状态 | 是什么 / Kit 消费什么 | 边界 | 消费位置 | 重访与证据 |
|---|---|---|---|---|---|---|
| U03 | CW 能力消费（CW-FE-R04） | accepted | 录入、启用、已用、已加载分别标示；proposal 需人审 Apply/Reject | CW 运行时本地边界，不是 Praxis 通用 runtime contract | CW 运行时 | 运行时状态或 owner 改动时复查；[消费记录](../../../vault/distilled/frontend-design/cw-consumption.md) |
| U04 | CW 表面层级 `surface-hierarchy.md`（参考 Radix、Atlassian Elevation） | accepted | 分组靠留白、对齐和字阶；卡片给独立对象；提示框不承载必要信息 | CW 本地决定，Radix/Atlassian 仅 donor；不生成全局 token | CW 工作台；答卷去掉嵌套框 | 新表面层级或组件任务时回查源记录；CW 原仓库 |
| U05 | CW 字阶约束 `type-density-constraints.md` | accepted | 正文字号不动，界面文字降一档；层级靠字号与字重 | CW 工作台的 density 约束，不是所有文档或媒介的字号系统 | CW 工作台；答卷排印 | 新 artifact/profile 时重裁决；[快照](../../../vault/snapshots/local/courtwork/engineering/design/type-density-constraints.md) |
| U06 | CW 界面语法 `ux-grammar.md` UX-05 | accepted | 没有真实进度时不画百分比或预计完成时间 | 不等于任何长任务都无须状态反馈；应区分 unknown、真实进度和终态 | CW 工作台 | 请求/进度模型变化时重访；[快照](../../../vault/snapshots/local/courtwork/engineering/design/ux-grammar.md) |
| U07 | MCP 外部实践（CW-FE-R06） | accepted | Host 负责授权与取消；dispatch 后结果未知与终态分开 | 协议参考不证明 local approval schema、sandbox、exactly-once、rollback 或 Tasks 已实现 | CW 运行时；答卷 Q3 | MCP 版本或 Host contract 改动时重读；[消费记录](../../../vault/distilled/frontend-design/cw-consumption.md) |

## Conceptual donors 与站点拆解

| ID | 参考 | 状态 | 是什么 / Kit 消费什么 | 边界 | 消费位置 | 重访与证据 |
|---|---|---|---|---|---|---|
| U08 | Carbon、Radix | reference | 控件尺寸、图标尺寸、组间距和标签字形分开设定，作为 conceptual donor | 不照搬数值、不引入依赖；具体 URL 卡片分别是 partial 或需重访 | — | 具体 control/token 任务时复查 `cw-carbon-button-style`、`cw-radix-spacing` |
| U09 | Linear、Vercel、Stripe 等站点拆解 | reference | 记录冷调科技站的字阶、描边和克制动效观察 | 站点拆解不是当前官方 grammar 或版本承诺 | — | 需要同类视觉方向时重访；[快照](../../../vault/snapshots/local/downloads/files/anti-ai-slop-kit/03-范例档案/06-冷调科技站拆解.md) |

## 维护

界面任务必须在项目 index 记录实际采用的 U 条目、来源版本、调整理由和真实验证结果；单个像素值不能替代完整的尺寸、焦点、键盘、缩放和布局验收。
