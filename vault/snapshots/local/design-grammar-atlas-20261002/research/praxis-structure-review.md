# Praxis 体例只读审查与落点建议

基线：远端 main 的 3417dcac34998ce5e128222e6f7a7ca4f2dc8c96，读取日期 2026-10-02。此处只审已读远端文件；不代表本地未推送的 Design、Write、Motion 体例。本研究包没有修改 Praxis。落点均为建议，实际重构者须对照其工作树和最新授权。

## 已读入口与保留责任

| 现行位置 | 已有责任 | 此次处理建议 |
|---|---|---|
| [kit/reporting/README.md](https://github.com/lesPrivilege/Praxis/blob/3417dcac34998ce5e128222e6f7a7ca4f2dc8c96/kit/reporting/README.md) | 按读者/决定/材料路由，再去提炼与验收 | 保留任务入口，增加可选 Design grammar 链接，不加必经流程 |
| [kit/reporting/grammar.md](https://github.com/lesPrivilege/Praxis/blob/3417dcac34998ce5e128222e6f7a7ca4f2dc8c96/kit/reporting/grammar.md) | claim/evidence、图形语义、renderer不得创造事实 | 这些仍由内容/材料契约负责；Design引用，不复制一遍 |
| [kit/ui/README.md](https://github.com/lesPrivilege/Praxis/blob/3417dcac34998ce5e128222e6f7a7ca4f2dc8c96/kit/ui/README.md) | UI候选组件与状态矩阵；Storybook方法拟采用、未实现 | 保留状态语义与实现归属。企业默认方向限定在此域，不扩展为所有媒介唯一taste |
| [kit/verification/README.md](https://github.com/lesPrivilege/Praxis/blob/3417dcac34998ce5e128222e6f7a7ca4f2dc8c96/kit/verification/README.md) | 分层验收、未执行/不适用、证据范围 | 复用回执体例。Design只补对应观察，不自建第二套万能门禁 |
| [vault/distilled/reporting/local-design.md](https://github.com/lesPrivilege/Praxis/blob/3417dcac34998ce5e128222e6f7a7ca4f2dc8c96/vault/distilled/reporting/local-design.md) | 已消费源与候选解释；Projection/Control边界 | 作为历史来源保留，不把历史候选整体提升为共享规则 |
| [vault/references/design-systems/README.md](https://github.com/lesPrivilege/Praxis/blob/3417dcac34998ce5e128222e6f7a7ca4f2dc8c96/vault/references/design-systems/README.md) | 官方逐源核查及重访 | 外部来源去这里或同级研究区，grammar只引用ID和支持范围 |
| [docs/governance/evolution.md](https://github.com/lesPrivilege/Praxis/blob/3417dcac34998ce5e128222e6f7a7ca4f2dc8c96/docs/governance/evolution.md) | 唯一规范位置、旧新映射、裁决、晋升与撤回 | 保留其owner与裁决机制；本包不重新分配责任 |

## 建议分工

- Write：内容组织、事实边界，以及完成该文本交付所需的必要排版。无需为了日常写作先选择历史风格
- Design：稳定的构成判断、taste语言、跨媒介视觉关系、profile及可组合grammar。保留对当前任务的解释空间
- Motion：可独立调用的时间/空间变化语言，只在变化本身帮助内容或操作时使用。静态替代是完整的可用解法
- 业务或服务owner：对象、状态、权限、保存、取消、重试等事实。视觉层不得把自己的解释变成业务事实

这四项是本轮整合建议与任务方向，不声称远端已按此划分。

## 最小改造形态

若工作树已有 Design 入口，优先在它的当前权威位置接入，不另建第二个 design 根。若确实尚无，候选落点如下，名称可由实际维护者按仓库约定调整：

- Design README：何时使用、如何按问题选grammar、Opus自由边界
- Design grammar registry：最小关系条目，链接profiles与引用，不包含全套style tokens
- profiles 索引：八个词的有范围解释，历史/文化/技术/作者标签允许并存
- references 或 vault：出处、支持/不支持、看图状态、资产边界
- briefs：原子打样输入与要检验的问题；不把未做样例列为已实现
- docs 的本次回执：只记实际发生的改动、走读、检查与缺口

## 可合并的冗余

将「不创造事实、状态命名、图表单位、证据出处」继续收敛到现有材料/状态契约，grammar只引用。将可访问性按媒介目标集中引用，避免每个profile复制不同版本。将外部来源证据集中到ledger，profile保留短断言和定位。把打样清单与已验证样例目录分开，避免仅有prompt就被误当可复用能力。

## 需要实际重构者确认

1. 当前工作树是否已经存在Design/Write/Motion，分别谁是唯一规范owner
2. 是否存在尚未合并的用户编辑或独立分支，哪些目录名必须沿用
3. 原来哪些规则已采纳，哪些只是来源提炼；本次新增条目默认为proposed
4. 迁移只改变入口和重复位置，还是改变契约意义；后者由现有治理负责裁决
