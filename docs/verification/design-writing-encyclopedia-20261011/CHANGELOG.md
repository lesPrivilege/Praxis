# Design / Write 参考编订变更记录

## 2026-10-11 · 基线与执行边界

- 初始远端 `origin/main`：`02ca9ea4b0faa6a9376523883c1f9f7afd5cf154`。原 `/workspace/Praxis` 的 `work` 分支干净；没有其他 worktree 或未提交文件。
- 在独立 worktree `/workspace/Praxis-encyclopedia` 创建唯一授权分支 `cloud/design-writing-encyclopedia-20261011`。协调者单独负责整合、提交与推送。检查点仅留本地，整合验收后才推送；不合并 main、不强推、不启用 CI、不发布网站。
- 配置请求：四个研究代理选择 `gpt-6-luna`（视觉、交互、写作、跨媒介），治理代理选择 `gpt-6-astra`；工具接受了这些选择并返回代理结果，但未暴露底层执行模型遥测。部分代理自述的模型名称互相矛盾，因此仅报告已接受的配置，不声称独立确认实际引擎。协调者负责入口、交叉索引、编订与交付。
- 研究仅使用公开来源与通用合成例子。旧仓库的历史原件和私人材料不复制、不迁移。新参考不要求访问私人仓库、原对话或客户资料。
- 基线校验实际失败两项：既有知识片提炼页链接到缺失的 Motion ceiling 研究与来源卡。保留历史定位并改为缺件说明，不伪造来源或补造验收。

## 编订裁决

- 保留 Design 的 Foundations / Composition / Interaction / Motion / References 与 Write 的 Prose / Publish / Motion / Shared；在已证实薄弱的任务分支补充条目，不新建平行分类树。
- 书目视角保存各作者的术语、论述结构和局限，语法视角保存可复用判断；两者互链。语法为可选参考，采纳正文规则仍须明确裁决。
- 年月、取得/核查时间、版本、上游 commit 与批次叙事放在本记录及各研究流 `CHANGELOG.md`；来源 catalog 用 `as_of: null` 保持旧生成器兼容，以 `history_record` 定位时间。摘要和当前证据限制仍离线可读。
- 当前正文中的历史使用表收敛为 [历史定位](body-history.md)与证据边界；不改写快照、既有 ADR 或历史验收回执。
- 新增来源采用手写卡 `cards: maintained`，catalog 保存机器身份和简短检索摘要，不复制完整书目正文。旧来源重访沿用既有卡，以 review 链接记录，不批量重建旧卡。

## 整合状态

研究、编订和本地验收已完成；完整检查与边界见[校验记录](verification.md)。最终分支 commit 与远端 SHA 在交付时另行核对，不在正文嵌入自引用版本。

## 2026-10-11 · 编订收敛

- 合并 audience 与 genres 中重复的文体表，仅 genres/selection.md 保留该选择表；未发布的 instructions.md 更名为 selection.md，修正“操作指南”与“选文体”的歧义。
- 媒介选择页删除重复证据清单和图注职责，回链 Shared evidence 与 Publish exhibits；保留换媒介时新增的判断。字幕不作为可删除的冗余。
- 补正 source-copy 与图片观看声明；白模只作为有明示边界的操作性对照，工业专门来源仍为缺口。Blender 官方手册两页浏览返回 402，未绕过访问控制，未以其支持规则。

## 2026-10-11 · 独立消费、审阅与交付前核对

- 四项普通合成任务与一次新代理入口复查完成；实际路线和过读保存在 [consumption.md](consumption.md)。Design 改为先到 Interaction；书目总入口补全；根 README 的 Agent 路由改为先选任务，维护才读 Agent.md。
- 独立编订审阅六项全部修复并由原审阅者回看：书目缺路、交互选择过严、动画/验证混用、反向来源边遗漏、Hairline 无依据精确参数、模态背景措辞。既有卡的缺陷与实现局限未被日期清理消除。
- `registry_extensions` 只由新 catalog 选择；595 个旧来源记录与 850 条旧快照记录均保持。新集合 29 URL、13 语法、6 短摘录；生成源与本地检查通过，回归探针覆盖真实发现的反边遗漏与正文日期。
- 重新 fetch main 后仍为初始 SHA；远端授权分支尚不存在，原工作树干净，无并发变动需要协调。本批仅在完全收敛后提交并推送唯一授权分支，远端 SHA 与工作树清洁状态随最终交付核对。
