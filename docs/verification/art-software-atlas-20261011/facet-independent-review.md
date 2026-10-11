# 分面纠正与正文精简：独立复核

## 结论与范围

当前工作树的分面纠正、生成投影、查询语义和九个挂载页面的精简，在本次有界复核范围内无未解决内容阻断项。初审发现的状态混淆、说明冲突和语义回归均已修正并复查。最终验收还须在主代理写入本回执及 `facet-validation.json` 后重跑全局链接和仓库检查；本回执不预称这些尚未完成的检查通过。

复核对象为 `/workspace/Praxis` 的 `cloud/art-software-grammar-atlas-20261011` 工作树，以 `f30b158946b284838afd9c0253ba3d01142b027d` 比较本轮纠正。执行独立只读审阅，未编辑仓库，临时检查和本回执仅写 `/tmp`。读取根 AGENTS、Kit Agent、架构、documentation、intake、atlas 架构、分面说明、生成验证说明和本轮新回执。模型名称只能按确有请求记录为请求侧 provenance；此回执不推定后端身份。

## 发现与处置

| 发现 | 处置及复查 |
|---|---|
| 三件 Skyspace 因“没有运行时证据”被标 not-applicable | 已全部改 unknown；空值、来源 ID 和控制系统未识别的依据保留。另纠正通用理由，改为“人工光或光色体验”，不声称三个来源都说明程序时序 |
| SVG/Canvas 候选 runtime 为 known+inferred，但其他 facet 仍称不能填入技术事实 | 已统一为 Kit 明示的软件表示方案；技术身份可知，原作技术和执行状态不因此获得证明 |
| 乐谱正文将“未说明则未知”精简为“未规定则开放” | 已恢复未知，仅明确交给演奏者的部分才作为开放选择 |
| 光之教会正文仍列摄影者、日期、相机 metadata 与 403 | 已压缩为未取得可核对原图的决策相关限制；ASA-S-07/10/11 三条来源链接保留 |

## 数据、分类与查询检查

- 56 source、46 entity、12 grammar、2 reused source 的 ID 集合与基线完全一致，共 116 个身份。56 source 与 46 entity 的非 facet 字段逐条相等，旧 facet 值保留；来源卡正文未修改。
- 作者/出版机构语境与 grammar 的推断适用领域分开。原物 artifact 与拟交付 artifact 按 scope 区分；具体对象的文化/实践名称没有转成工具属性或默认审美。
- Chimú、Nasca、Isotype 等归类保留本地来源依据；Islamic geometric patterns 标为有限推断；日本語組版 / Japanese text layout 作为完整精确词值保留；未从 Skyspace 作者姓名猜流派。`style_lineage` 同时容纳文化归属与实践名称的范围已在 facets.md 披露，不证明师承或传播链。
- 46 实体谱系状态为 known 10 / unknown 6 / not-applicable 30；runtime 为 22 / 6 / 18，与补正回执一致。缺省 unreviewed 不被改成 unknown 或 not-applicable。两份复用来源仍未补分类，覆盖边界明示。
- 13 个发布查询用 facets.md 的实际代码独立执行，完整结果与 expected 及保存回执相等；最后一次索引重新生成后再次确认 13 项相等。
- 另测 9 项均通过：同一 exemplar 的 printed-book 与 printed-plate 不可拼接；完整日文谱系值可命中而 Japanese 不命中；grammar 不继承 source 的 industry_author 或 implementation 的 runtime；source applicability=unreviewed 正确保留；原物不继承 p5.js；open-score 不从共享来源继承 Processing；Skyspace 的 unknown runtime 可查。
- 未知 scope、未知维度、空值列表、未知状态四类无效查询均拒绝。
- 同 scope 先在同一记录求交集，跨 scope 保留各自见证。shared-evidence 与 typed-relation 分开返回，不沿 contains/discovered-via 递归扩散。
- 共享来源检索可以返回邻接候选。例如 Isotype 的 printed-book 与 CSS 经 ASA-E-03 连接到 HTML/SVG；返回明确标 shared-evidence，文档说明这不是实现证明或文化等价。此语义符合发现入口；下游不得将其重述为已实现关系。
- canonical 分类位于来源 catalog、entities 或 grammar.json；index 及 facet_index 是生成投影。operation 从唯一 operations 生成。分类未提升证据状态、权利、优先级或实现成熟度。

## 九页正文冷读

阅读材料、空间、编辑、规则、乐谱、范围选择、agent 资源、操作入口与发现接力全部九页。所有旧来源卡链接保留，12 个叶子 ID 和锚点存在。各页保留概念、判断关系、实现取舍、例子/构造夹具及失败条件；入口继续服务选路，没有堆入分面登记表。

保留的决定性区别包括：Nasca 离散经纬与连续结构、现代 girih 建模与历史制作假说、Isotype 稳定符号与明确计量、JLReq 需求与渲染支持、屏幕示意与现场感知、Brown 开放选择与未知事项、规则/伪随机/作者选择、框选范围/选集/可见集、设计资源包/registry/Skill/MCP/adapter 的职责，以及读取与写回权限。观察证据未因精简升级；JLReq 的两张图、原创建构例、未查看的原物仍可区分。

从正文移走重复研究过程与注册细节的方向正确；仍保留的局部限制会影响采用决定，不宜仅为缩短而继续删除。篇幅减少不证明设计效果改善。字符数和锚点可以机械核对，文字承重与证据强度必须结合冷读判断。

`construction-comparison.md` 将采用、延后和拒绝分开，没有引入新目录树、自动成熟度或固定刷新任务。此复核只检查其与本地治理的一致性；未独立重读 Library 原附件，因而不认证该文对附件全文的逐项完整性。`local-review-handoff.md` 明确要求按当前 main 至最终分支头的累计差异另行审阅、保护本地改动并在通过后合并，本回执不能代替那个更大范围的合并评审。

## 校验与剩余边界

发布查询代码与已执行临时代码一致；发布生成器和验证器与此前核对的临时代码一致。重新执行当前发布的只读 validator，schema、ID、关系类型、证据外键、源/实体/grammar 投影、operation 单点和完整倒排表均无错误。运行时唯一错误为尚未写入的最终产物链接：README 至 `facet-validation.json`、README 至本回执、concise-body-audit 至 `facet-validation.json`。临时完整结果位于 `/tmp/facet-independent-schema-final.json`。这是待收尾的链接状态，不是整体 pass。

主代理须写入最终回执后重跑全局链接、仓库验证、旧索引检查及 diff whitespace 检查，并报告实际结果。本复核未访问外部来源、未运行 renderer/音频/集成，未重做新用户发现实验，亦未检查相对当前 main 的完整累计合并。精确字符串检索没有自动同义词扩展；所有正文提及的潜在工具组合也未承诺全部建边。通过当前测试只说明此边界内的分类与发现功能可复现。
