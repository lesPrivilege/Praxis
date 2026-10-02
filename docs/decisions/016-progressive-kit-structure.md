# ADR-016：以真实分支落实 Kit 的渐进消费

日期：2026-09-27。状态：accepted（目录、知识所有权与入口迁移）。用户指出 Kit 仍由扁平文档组成，没有完整消费 Chat 提出的治理体例；本轮据此修正 ADR-015 的保守落位。Astra/main 编订关键规范，Luna 迁移参考与导航，Sol 审计并复核消费路径。

## 决定

Kit 的目录应体现读者进入的任务与工作模式。README 选路，具体指南执行，grammar 解释判断，references 再按用途展开到提炼和来源；不要求挂载时一次读完。

- 建立 [Write](../../kit/write/README.md)。`prose/`维护成文原理、审校和按需加载的`genres/`；`publish/`维护空间编排、展项与说明职责；`motion/`维护时间叙事与分镜交接；`shared/`维护跨模式证据与内容验收。
- [Design](../../kit/design/README.md)分为`foundations/`、`composition/`、`interaction/`、`motion/`与`references/`。最后一支继续按编排、界面、设计系统和样张分路，保留已有来源ID与证据边界。
- Reporting 保留材料目的、组织动作、受众和文体选择；已经泛化的表达规则迁入 Write。具体文体如能力测试答卷只在 Prose/Genres 触发，不成为所有材料的默认体例。
- 写作原理从项目 skill 迁入 Kit。`writing` skill 保留名称和触发范围，成为有明确依赖的薄入口，按任务读取 Prose；挂载 Kit 后不依赖某个宿主的skill机制也能找到原理。
- 目录内维护真实规则、指南或来源入口，不只新建空README。已是单一职责的短契约维持原路径，不为目录深度继续拆分。

## 迁移映射与唯一位置

| 原位置 | 当前权威位置 | 旧入口处理 |
|---|---|---|
| `.claude/skills/writing/SKILL.md` 中原理与执行细节 | [Prose grammar](../../kit/write/prose/grammar.md)、[review](../../kit/write/prose/review.md) | 保留skill身份，改为读取Kit |
| `kit/writing/README.md` 的来源、偏差与审阅 | Prose review | 保留迁移导航 |
| Reporting 中证据与通用review | [Shared](../../kit/write/shared/README.md) | 保留原锚点，跳往新位置 |
| Reporting 中视觉、展项与媒介投影 | [Publish](../../kit/write/publish/README.md) | 保留mode路由，无第二份正文 |
| `assessment-answer-profile.md` | [Prose/Genres答卷体例](../../kit/write/prose/genres/assessment-answer.md) | 保留历史路径到达 |
| `kit/design/grammar.md` | Design 的四个判断分支 | 旧锚点转为导航 |
| `kit/design/references.md` | [分用途参考](../../kit/design/references/README.md) | 旧路径仅作兼容入口 |

旧ADR、审计和研究保留当时表述；它们不承担当前规范权威。当前任务入口、维护约定与skill同步迁移。新索引不复制原件，也不把历史 accepted 解释成所有项目适用。

## 对 ADR-014、ADR-015 的修订

替代 ADR-014 的“写作原理由自足skill承载”以及 ADR-015 的“暂不建立Write/Motion分支”决定，保留其来源分层、项目风格边界和证据状态区分。完整内容原子schema和通用renderer仍未建立；Motion现在有内容与运动的交接契约，不能据目录推断存在可复用运行工程。

实际动态简报可作为消费者线索，但其模型、96秒、配乐与Remotion实现仍属于项目。原子样张本轮只提供用户手动paste的Opus工单；未生成、未验证，也未晋升为canonical。

## 兼容与验证

旧路径保留到达能力，但不继续维护规则副本。消费者接入时读对应mode的README，记录所用版本和必要分支。Writing skill现在需要Kit随项目挂载；单独复制skill时必须保留或重新定位该依赖，不能伪称自足。

本轮验证目录README、相对链接、旧入口接续、原理与文体正文迁移、skill格式及按任务走读。真实跨项目效果、生成样张、视频播放与所有外部来源现状均未由这次文档迁移验证。详情见 [迁移验收](../verification/kit-structure-migration-20260927.md)。
