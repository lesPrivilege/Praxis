# 累计整合与复验

## 对象与来源

2026-10-11，云端起点 `a3631e1b0567dc296d749e831d6a5b8e99c341b9`；远端 main 与 merge-base 均为 `02ca9ea4b0faa6a9376523883c1f9f7afd5cf154`。审阅包含 main 之后的 design-writing-encyclopedia 与 art-software-atlas 全部交付。远端目标仍为 `cloud/art-software-grammar-atlas-20261011`。

实际阅读了 `b019ba3667485357aa484c54c29b7cd6c841ab53..a3631e1` 差异和 [本地累计审阅](local-review.md)。其中有具体判断，并非只有交付收据；但该记录明确署为本地 Codex，未找到可另行确认归属 Claude 的实质评语。早先 [独立审阅](independent-review.md)及其后续仍按各自披露的执行身份、文本读取和视觉边界使用，不将其改称 Claude 评语。

完整保留本地三项修正：旧百科的 known/空值检查；图谱非法状态的结构化报错；九张 agent 生态卡去除重复标签和通用说明、保留具体摘要、定位与限制。后续脚本化保留并测试前两项语义；历史检查代码仍留在原回执。

本轮主代理维护与编订，Luna 代理只读检查历史与执行两组新上下文任务；最终累计审阅另由未参与编写的代理执行，结果单独留存。没有从私有会话或附件导入内容，也没有新增外部资料采集。CONSTRUCTION.md 仅沿用 [既有比较裁决](construction-comparison.md)，不读取或发布原附件。

## 发现与小幅修正

| 实际问题 | 修正与边界 |
|---|---|
| Design 与 Kit 的“来源书目”只直达旧百科；atlas 另走操作入口，来源阅读者容易少读一支 | 在现有 references README 集中两份书目选路，Kit 与 Design 指向该节；各书目、卡片和 grammar 保持原位 |
| Design 的 Composition 和 Write 的 Prose 各有两行近似入口 | 合并各自任务行，具体问题仍由下一层 README 展开；保留独立的跨媒介判断入口 |
| `kit/design/references.md` 兼容页重复旧四路菜单与维护规则，不能表达后增路线 | 兼容页只留当前入口、旧 ID 映射与规范链接；原路径和三个旧小节锚点保留 |
| 根地图仍只称 Kit 存已采纳知识，设计任务用“已裁决的做法”概括输出 | 明示 Kit 同时有可选参考，根任务描述与现有软件全域范围一致；没有把领域缺口说成已完成研究 |
| atlas 生成/检查代码藏在历史验收页，查询要求复制 40 余行代码到 /tmp | 提取为 `scripts/atlas_index.py` 的 build/check/query，当前 facets 页只留语义与命令；原验证代码作为历史证据保留并注明不再维护。完整投影、别名和 grammar 锚点纳入检查 |

此次没有调整文化名称、参考优先级、规范强度、目录分类或设计参数。原作观看限制、平台缺口、技术集成未运行等会改变取用意义的限定仍保留。

## 新上下文消费任务

两组代理均不继承主代理上下文，先执行任务再查看历史；没有写入实现或改变登记。以下是合成任务的实际输出摘要，不是应用运行或读者效果证据，未做无 Kit 对照。

| 任务 | 实际路线与产物 | 范围与结果 |
|---|---|---|
| 原生桌面分析工具：多选、删除、失败提示 | Kit → Design → Interaction → extent-selection / feedback / states；Write → Prose → microcopy；software-scope。产出指针/键盘共用选集、保持未选上下文、按真实撤销能力设计反馈；超时提示“删除结果待确认”并先核对 | 找到 ASA-G-EXTENT、DWG-I-FEEDBACK、DWG-W-MICROCOPY；明确原生菜单、快捷键、窗口焦点与系统撤销仍缺平台证据 |
| 馆教展板：日文纵排、数量、织物结构 | Kit → Design → Composition → editorial-translations / material-relations；Write → Publish / Prose → multilingual。产出并置比较与纵排正文配横排表两种可选方案，保留 warp、weft、tapestry weave、discontinuous warp and weft | 找到三个相关 grammar 及 ASA-E-06–12、ASA-M-01–03；织物仍为未目验的结构示意。代理首次概括图像边界过宽，经回卡澄清：仓库已记录 E-11/E-12 直接静态观看，本次消费者未亲自看图；图示不证明实际西文/阿拉伯数字混排渲染 |
| 远端动作超时、结果未知 | Kit → Contracts（失败与恢复、交接）→ 共同工作语法。产出保留 action/run/幂等身份、由权威 owner 查实际影响、已完成则停重试、仍未知则有证据和接收人地交接 | 工作系统原有路径可直接支持判断；没有选择执行引擎、查询远端或假设超时等于失败 |

第一组在入口修订前完成，说明已有深条目能支持这三次判断，不能据此归因本轮导航改善。第二组在修订后从根 README 与 Kit 进入两份书目，读到 DWW-004（GOV.UK error-message）与 ASA-M-03（Nasca 对象）唯一来源卡；经旧 references.md 到当前参考路由，也找到 ASA-A-03 设计系统包契约。代理分清任务规则与普通参考，没有读取先前审阅回执才完成判断，未发现阻断路径。

第二组从 scripts README 自行找到并运行以下查询与 `--check`：

```bash
python3 scripts/atlas_index.py --query '{"exemplar.artifact":"woven-garment","exemplar.style_lineage":"Nasca","grammar.industry_applicability":"museum-interpretation","implementation.stack_runtime":"SVG"}'
```

实际命中 ASA-G-ANDEAN-WOVEN-GARMENTS；见证分别为 ASA-M-EXEMPLAR-02、该 grammar 与 ASA-M-SUBSTRATE-01。代理核对原物 runtime 为 not-applicable，SVG 仅属于候选实现；不把连接命中当成原物技术属性。只读检查返回 pass，56 来源、2 复用来源、46 实体、12 grammar、141 关系。

## 独立审阅修正

未参与编写的审阅者完成累计检查后提出两项 P2；实际材料身份没有漂移，但维护检查存在漏口。

1. **复用来源的身份。** 现在将 reused URL 与 card 解析到唯一原 registry 记录，再核对其 registry ID、alias 或原 catalog 的明确 ID / ledger_id。DWI-003 使用 alias，D01 使用原 ledger_id；未为此迁移旧登记。内存修改两条复用来源的 URL、卡路径和 ID，共六例均被拒绝。
2. **引用与图谱成员的一致性。** 现在将 catalog 的 grammar_paths 与 grammar 的 source_ids 按正文路径求并集核对，并从实际正文链接反查声明。两项 canonical 修改负例均被拒绝。该检查揭示 RULE-SYSTEMS 已引用 Tone.js / SuperCollider 文档，却少记 ASA-T-07/08；补齐 source_ids 并重建两条 source→grammar informs 边。原有 implements 关系保持原样，未把定时接口升级为规则生成实现；p5.js→open-score 的反例查询仍无命中。

## 工具与保全检查

- `python3 scripts/validate_repository.py`：检查全仓目录、本地链接、JSON、快照 hash、登记投影与生成卡。
- `python3 scripts/reference_index.py --check`：旧百科 29 来源、13 grammar；本地 known/空值修正保留。
- `python3 scripts/atlas_index.py --check`：56 新来源、2 复用来源、46 实体、12 grammar、143 关系。检查 schema、稳定身份、类型方向、主张与分面依据、完整 canonical 投影、registry alias、来源/grammar 双向链接和锚点。
- `python3 scripts/test_atlas_index.py`：六组测试，回放 13 组既有查询及完整见证；拒绝 8 组非法查询、12 种投影损坏，以及六项复用身份和两项 canonical 引用关系变异。包括同 scope 混项、历史原物继承 runtime、缺省状态混淆、反向关系、删除投影及非法 facet state；全部使用内存副本。
- 脚本提取后实际运行 atlas `--build` 与 `build_registry.py`，两份投影与起点字节相同；独立审阅修正后 atlas 仅增加上述已引用来源及两条 informs 边，registry 仍与起点相同。相对 main 的 595 条既有来源记录、850 条既有快照清单记录逐项相同。
- `git diff --check` 与累计差异检查；本轮无 `.github`、部署配置、来源原件或快照变动。

上述命令的最终重跑与独立审阅结论以 [独立复核](consolidation-review.md)及 Git 交付定位为准；本文不包含自身提交 SHA。

## 未覆盖项

本轮没有重新阅读全部外部 URL、观看原作、试听音频、运行浏览器探针、连接 agent 集成或测试原生设备。历史艺术多数仍为文字研究；JLReq 两张静态图与已有少量合成探针保留原观察范围。来源摘要可以离线初筛，不是完整原文镜像或 renderer 依赖缓存。既有访问失败、权利未明、目录 lead 和软件平台研究缺口没有升级为已证实内容。
