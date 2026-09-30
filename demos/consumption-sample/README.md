# 消费小样：退款复核说明

状态：合成数据、可运行确定性断言与人工走读材料；不代表客户效果、模型能力或共享 Kit 新规范。基线 `88f2c65`。本小样按现有 [Demo 准入](../README.md)、[验收](../../kit/verification/README.md) 与 [XMind profile](../../docs/governance/xmind-markdown-profile.md) 消费。运行 `python3 demos/consumption-sample/verify.py`。

## 场景与分工

一家虚构店铺复核两笔退款。问题是证据是否足够提交给人工负责人，不是让模型自动批准退款。输入、判断、允许变化见 [cases.json](cases.json)。全部名称与业务规则均为本次构造，不对应实际客户或法律意见。

| 消费面 | 本次产物与职责 | 接收检查 |
|---|---|---|
| Write / Prose | 下方短说明：事实、推论、建议分别表达 | 不把缺证据写成拒绝资格 |
| Publish | 同一说明转换为导图主干，元数据留旁路 | 不添加原文不存在的主张 |
| Design | 用标题顺序展示对象、证据、判断、下一责任 | 无视觉容器被误认作业务状态 |
| Motion | 本任务没有状态转换演示的需要，采用静态材料 | 不为展示能力增加动画 |

正面说明：订单 S1 的付款与退货签收凭证齐备，可以提交人工复核。提交只改变复核队列状态，退款仍待负责人决定。订单 S2 缺退货签收证据，保持补件状态；缺件不能推出客户不具退款资格。

失败说明：『S2 没有凭证，所以拒绝退款；S1 已获退款批准。』两句都越过证据与权限边界。真实范例消费时保存具体变化与反例，产物留 demos；真实客户资料留独立项目。私有 Chat 原文不进入公开产物，先提炼、泛化、检查敏感标识，再登记来源定位与所改变的判断。本次只使用继承研究摘要，没有复制任何 Chat。

## Eval 与 Dogfooding

| 项目 | 本次口径 |
|---|---|
| 样本 | cases.json 的四例：齐备、缺件、版本变化、不能重复批准 |
| 标准 | 证据版本匹配；缺件送补件；只有人工允许 approved |
| 基线 | 上述失败说明会错判 S1、S2，人工逐项走读，不假称历史系统结果 |
| 本次结果 | verify.py 运行结果仅证明这四个合成预期 |
| 误报 | 规则可能把其他合法证明列作缺件；该情形交负责人复核，不自动拒绝 |
| 保留 | 真任务中保留证据定位、反例和接收者反馈后，才讨论晋升 |
| 回退 | 若说明暗示自动批准、丢失版本或补件路径，撤回该说明并保留问题证据 |

Dogfooding 下一步：接收者只读本 README 和 cases.json，用一句话说出 S2 的下一动作与批准责任；记录断点与改写。未执行真人试用、真实模型、视觉评审或 XMind 往返。

## XMind 往返

[map.md](map.md) 使用 `xmind-md/0.1 @ 2026-09-22`。应用基线为用户提供的 Xmind Desktop `26.05.01107`，不是本机实测版本。静态 lint 可运行 `python3 scripts/lint_xmind.py demos/consumption-sample/map.md`。

待实机流程：导入 map.md → 检查四个主干及 Unicode/行内代码/链接 → 导出 Markdown → 对比节点、父子关系和文本；备注若丢失则移入普通子节点。不得以原始字节相等代替语义往返，也不能以 lint 通过声称往返通过。

## 来源与现有施工

依据是继承研究摘要：2026-09-22 XMind，09-27–29 Write/Design/Motion、薄适配与 eval，09-28 材料关闭和渐进发现。未逐页读取原 session，精确消息定位待补。以上小样均为本次建议。

本机主工作树另有未提交 `kit/write`、Design 分层、ADR-015–017、reference-lifecycle 和 reference-consumption-20260929 工件，已只读核对其存在。它们不在本分支基线；本次不复制规范，也不覆盖在途修改。合并者应将入口接入届时的 Write/Publish/Design 目录。

参考消费遵循『对象 → 主张 → 边界 → 与现状差异 → 验证 → 处置』。PageIndex、Katamari 的原文定位未恢复，不据名称认定特性或采纳技术。Magpie 已在 Courtwork `87e2207` 的 `engineering/research/architecture-node-2026-09-13/magpie-consumption-20260927.md` 逐项消费；其薄适配、明确模型身份和失败边界是既有处置，不重开规范。SourceWeft 在主工作树已有提炼/来源/消费工件；优先接收现有交付，避免重复登记。四者均不因本小样获得推荐地位。


## 本次作者校验，2026-09-30

四例合成断言、XMind 静态 lint 和本次 Markdown 文件目标检查通过，`git diff --check` 通过。全仓 `validate_repository.py` 未通过：`demos/visual-grammar` 缺 README，导致 `_pipeline/README.md` 与 `_runtime/README.md` 两条链接断开。独立解包基线 HEAD `88f2c65` 后运行相同检查，错误完全相同；本次未新增校验错误，也未修复其他作者的在途目录。当前检查计数为 Markdown 480、JSON 77；基线为 478、76。未执行外部来源重新核实、renderer、真实模型、真人试用或 XMind 实机；没有新增来源快照依赖。
