# Kit 结构迁移验收 · 2026-09-27

本记录接续 [初次体例整理](kit-editorial-review-20260927.md)。用户指出当时仍是扁平正文，治理没有进入真实目录；本轮执行 [ADR-016](../decisions/016-progressive-kit-structure.md)，不能将前一轮契约补充当作这次结构迁移已经完成。

## 实际改动

- Write 以 prose、publish、motion、shared 分支维护原理、审阅、文体、展项、证据、时间叙事与检查；每个分支有真实内容和 README。
- Design 按 foundations、composition、interaction、motion 与 references 分层；46 条参考（25 C、9 U、11 ref、1 P）保留身份和证据边界，按用途进入。
- Reporting 保留材料目的与组织动作；原 skill 的成文原理、通用内容规则和答卷体例迁往唯一位置。旧 Writing、Design grammar、references 和答卷profile路径保留迁移导航。
- 根 Kit、Agent、架构与维护约定同步当前所有权。Writing skill 保留原名称与触发，改为读取 Kit；单独复制 skill 不再自足。
- Sol 的 [迁移前审计](editorial-audit-20260927/README.md)枚举1,339文件、细读47个，提出8组问题；没有声称逐行审查整个仓库。
- Opus 由用户手动 paste [原子编排工单](../../vault/distilled/layout-specimens-20260927/brief.md)，未生成样张；自动调用未产出文件，不能作为Opus制作或验收证据。

## 迁移保真与检查

已实际核对：迁入 Prose 的8条成文原理与原 skill 内容一致；答卷体例除相对链接重定位外正文不变。旧兼容入口不保留第二份原理正文。保留研究来路和历史审阅，不将历史记录追写成新的通过结论。

`skill-creator/scripts/quick_validate.py .claude/skills/writing` 返回 `Skill is valid!`，只证明格式检查，不证明模型实际遵守。Kit与skill的本地相对链接检查无失效；任务消费路径另由Sol独立走读。

## 独立任务走读

Sol 从 Kit 总入口走读了中文改写审校、含比较展项的HTML说明、动态解释交接，并检查了单独加载Writing skill时Kit存在与缺失的两种情形。实际路径与限制见 [followup](editorial-audit-20260927/followup.md)；Kit缺失是条件模拟，没有卸载或运行模型行为测试。

走读指出两处真实边界问题：Publish对HTML无条件使用Slide Job；Source栏可能引导公开链接到内部index。主代理已分别改为按媒介确定表达任务、公开来源和内部完整登记分离，并从Publish入口显式链接共享证据契约。修复保持原来源与证据职责，不宣称外发控制已经实现。

## 审计处置范围

| 发现 | 本轮处置 |
|---|---|
| 扁平Kit与规范藏在skill | 实际迁移规则、分支与入口，见ADR-016 |
| F1 阶段状态与产物不一致 | 更新当前主题导航，旧交付计划标历史，不重写产物验收 |
| F4/F5/F8 Vault、Intake与Frontend职责滞后 | 更新多来源和跨批次入口，保留稳定来路 |
| F6 答卷taste可能误作全局判断 | 参考分用途展开并保留profile边界；未将历史采纳重判为普遍规则 |
| F7 UI候选无选择与退出条件 | 补场景触发、fixture验证和重访，不新增组件实现 |
| F2 公开披露准备 | 未发布；原件与元数据的实际公开集合需在交付前另定，未做物理迁移或历史清理 |
| F3 既有答卷改名与40断链 | 保留其他工作的改名状态，本轮不修改生成器或恢复旧产物 |

## 最终验证

已运行 `python3 scripts/validate_repository.py`：611个Markdown、91个JSON、622个快照、112条消息、326条来源与212个引用映射。唯一错误组仍是既有答卷删除/改名造成的40处 `answer.html` / `answer.pdf` 断链；没有本轮新增链接、登记或hash错误。全库状态仍为 **fail**，不能称全仓通过。原始输出见 [机器回执](kit-structure-migration-20260927-result.json)。

`git diff --check`通过；Write与Design没有空目录。独立走读及上述两项修复属于文档消费验证，未进行真实跨项目模型运行测试或样张视觉验收。

## 覆盖边界

仅迁移和消费现有知识及按当前任务明确的语义契约。未核实新的外部事实、既有原项目当前版本、样张视觉、视频播放或跨项目真实使用效果；无新依赖安装。Google/Microsoft等既有正文与renderer依赖缺口仍按原来源登记，7个原Chat引用仍为missing-original。治理页面与目录存在不表示已经实现隔离控制或通用运行组件。

后续状态（2026-09-29补记）：本回执的“未生成样张”仅描述迁移检查时点。原子化编排实验已在后续批次完成，可作为参考和改编样板，当前入口见 [实验目录](../../vault/distilled/layout-specimens-20260927/README.md)；原检查结论不回写为新的运行验收。
