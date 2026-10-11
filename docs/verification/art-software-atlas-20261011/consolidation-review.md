# 整合独立复核

最终结论：两项 P2 均已修复并独立复审通过；相对 main 的累计交付在本报告范围内无剩余阻断项。所审实现提交为 `ae64ecf4ff0d6738b98b57f1c1305085924116d2`。正文、导航、来源身份与查询维护可交付，外部主张、实际视觉/交互效果和新上下文试用仍受下述证据边界限制。审阅者未参与实现，只写本报告，未改其他文件、提交、推送或运行部署。

## 修复后的独立复审

复审对象：`ae64ecf4ff0d6738b98b57f1c1305085924116d2`，Git tree `a295776eecd0ac0476500cbb8bd20aba18bb3b2e`。初审 259 文件清单中 253 个字节不变；只有 atlas 脚本、测试、grammar.json、生成 index.json、scripts README 与 consolidation 回执这六个文件变化。逐项读过变化；来源 catalog、实体、原 registry、来源卡和正文未改。本报告不在实现提交内，后续仅增加本报告的回执提交不改变所审实现。

| 初审发现 | 实际修正与独立确认 | 处置 |
|---|---|---|
| 复用来源身份漏检 | 用 URL 与卡片定位唯一 registry 记录，再回原 catalog 核对 ID / ledger_id；DWI-003 alias 和 D01 ledger_id 继续合法。两份复用叶子的 ID、URL、卡片各有一个内存变异回归，共六例均被拒绝 | 采纳并修复；关闭 |
| 声明与实际引用脱节 | 核对 source 与 grammar 的文件路径并集，并反查正文中的卡片链接。ASA-R-01 两项单边删除负例均被拒绝；本审阅者另将两边声明同时删除，仍因实际正文引用报错 | 采纳并修复；关闭 |

真实数据只给 RULE-SYSTEMS 补入其正文已引用的 ASA-T-07/08。生成投影增加相应两条 source→grammar informs，关系数由 141 变为 143；没有删除关系，全部 implements 边逐项不变。这一裁决与正文的可选声音/事件层相符，没有把音频定时接口说成规则生成实现。

重跑仓库 validator、百科 `--check`、atlas `--check` 和六组回归，全部通过；计数仍为 56 新来源、2 复用来源、46 实体和 12 grammar。测试覆盖 13 组历史查询的完整结果、8 组非法 filter、12 种索引损坏、6 种 canonical 复用身份变异与 2 种 canonical 引用变异。另将当前查询结果与 `a3631e1` 原 index 及历史 fixture 三方比较，13 组结果和见证完全相等。

查询覆盖确有一个符合修复目的的扩展：单查 `implementation.stack_runtime=Tone.js` 现在也返回 RULE-SYSTEMS，其路线明确为 `shared-evidence`、依据 ASA-T-07；OPEN-SCORE 原有 implements 路线不变。这是共同文档证据的发现路径，不是新增运行或实现证明。所有新来源的双向路径集合现已一致。`git diff --check` 通过，工作树除本报告外无未提交改动。

原初审的正文判断、限制与不应改动清单继续有效；没有通过修复重做研究、扩大外部证据或迁移历史身份。下文保留初审发现及当时测试结果，便于追溯，原“待修”处置以本节关闭结论替代。

## 初审定位与范围

基线为 `02ca9ea4b0faa6a9376523883c1f9f7afd5cf154`；审阅 HEAD 为 `a3631e1b0567dc296d749e831d6a5b8e99c341b9`。范围是基线至冻结工作树的累计差异，包含早期设计写作百科、艺术软件图谱、本地修正与本次未提交整合。不是只审 consolidation.md。累计 259 个改变或新增文件，排除本报告；下方保存逐文件 SHA-256，按路径排序的 `SHA256  path\n` 清单摘要为 `7e5e1c0ca593c07df06520126994193f62ed33763c9d766a6f79c3d29dc8e789`。此清单同时包含当时的交付回执；后续仅回执修改不代表实现未经审阅，其差异需另行说明。

读取了 AGENTS、Kit Agent、架构、入账、文档体例、ADR-029 和项目 writing skill 的成文、审阅及证据规则。已枚举累计文件清单，检查入口与治理差异，深读材料、编辑、空间、乐谱、规则、范围选择、agent 生态、来源接力、微文案与跨媒介选择，抽读排印、色彩、对象、控件、导航、反馈及写作分支。来源抽样包括 Nasca 对象、JLReq 两图、OpenDesign 同名候选、MCP、Ant Design；另外检查登记、生成脚本、schema、历史生成与查询代码、保全及消费回执。没有逐字审阅每张来源卡或重新读取全部外部原文。

## 初审发现

### P2 · 复用来源身份未与原登记核对

位置：[atlas_index.py](../../../scripts/atlas_index.py) 的 registry / alias 检查（初审行 200–222）只遍历 `data['sources']`，没有核对 `reused_sources` 的 ID、URL 与卡片是否属于同一既有来源。完整重建只能发现投影偏离编辑源，不能发现编辑源自身改错。

独立内存负例：拦截 `read()`，仅改变 discovery/catalog.json 中 DWI-003 的复用行，分别把 URL 改为 `https://example.invalid/changed-source`、ID 改为 `invented-reuse-id`、card_path 改为现有 README.md；每次先 build 再 validate，三种情况均返回空错误列表。磁盘未改。现有回归测试仅改变已生成的 reused 行，因投影不等而失败，尚未覆盖这类编辑源损坏。

影响：后续修改并重建时，可给同一个既有来源挂上错误身份或错误原文，破坏唯一 canonical home，且仍报告 pass。

建议：由原 registry 和它指向的原 catalog 联合核对唯一 URL、卡片与身份。DWI-003 是 registry alias；D01 则是旧 catalog 的 `ledger_id`，registry 仍使用 `provenance-design-grammar-atlas-20261002:d01-agent-skills-specification`。保留这两种合法身份，不为检查方便迁移旧 ID 或要求所有历史来源补 alias。回归分别变异两份复用登记的 URL、ID 和卡片，再重建并拒绝；也验证未改原记录仍通过。处置：待主代理修复并复审。

### P2 · 来源登记、grammar 登记与实际引用可相互脱节

位置：同一脚本初审行 217–230 只检查列出的 `grammar_paths`，没有反向发现正文实际引用，也未比较 `source.grammar_paths` 与 `grammar.source_ids` 的文件级并集。删掉一个声明关系后，恰好不再检查它。

独立内存负例：将 canonical ASA-R-01 的 grammar_paths 清空，或独立从 canonical grammar.json 删除 ASA-R-01 的 source_ids 成员；每次 build 后 validate 都返回空错误。正文仍链接该卡。另对真实冻结数据做双向集合比较，发现 ASA-T-07 和 ASA-T-08 的 catalog 都声明 `kit/design/motion/rule-systems.md`，该正文也直接引用 Tone.js / SuperCollider，但 RULE-SYSTEMS 的 source_ids 没有这两个来源。因而实际引用、登记和查询中的来源见证不一致。

影响：来源优先路径仍可读到正文，而图谱中的来源关系会消失；维护者无法从 pass 得知哪张图才是完整投影。旧百科 reference_index 已检查实际 grammar-to-card 反向引用，图谱尚未获得同等检查。

建议：按正文路径核对声明的双向关系，并从 grammar 正文实际链接发现漏报卡片；同一正文含多个 grammar ID 时按文件归并，不能强迫每项都继承整页来源。修正两项 temporal 登记时依据实际引用范围决定，保留 source informs 与 substrate implements 的区别；新增来源边不能冒充已运行的实现。变异 canonical 叶子及正文引用均应触发错误，并重跑 13 组原查询完整输出。处置：待主代理裁决、修复并复审。

## 正文、导航与证据判断

入口收敛没有重排仓库。根 README、Kit 和 Design 可以进入统一来源选路，旧 references.md 保留当前入口、旧 ID 映射和原小节锚点；Composition / Prose 的重复任务行已合并。来源优先与问题优先是同一内容的两种发现路径，抽审未发现另一份同时活跃的 canonical 正文。新增方法保持 normal/reference；参考优先级、证据状态、采纳与实现成熟度没有合成等级。状态表、夹具和反例保留设计师的取舍空间，没有把文化名或样张参数升级为全局配方。

软件范围矩阵覆盖网页、原生移动/桌面、终端与开发者工具、数据分析、游戏、XR 和设备界面，也列出声音、触觉、输入与反馈问题。它准确区分可用正文、邻近方法与未研究领域，不能据此声称全域已有深度覆盖。两份书目继续各守来源范围，没有用空实体填满目录。

抽读的正文能给出概念、关键区别、用途、实现取舍、例子和继续阅读路径。织物条目保留 discontinuous warp and weft，Brown 原说明与现代事件表分开，Isotype 的普世性愿望没有写成事实，图像与运行证据限度在相应取用处可见。较长条目仍主要承载必要区别和反例，本轮未发现需要整页机械压缩的阻断问题。重复出现的“未运行”“未观看”在独立取用的页面仍有作用，不应为减字删去。

## 初审实际执行的检查

| 检查 | 本次结果与边界 |
|---|---|
| `python3 scripts/validate_repository.py` | pass；1294 Markdown、283 JSON、856 快照、680 来源记录、344 生成卡；检查时已创建本报告以满足现有链接 |
| `python3 scripts/reference_index.py --check` | pass；29 来源、13 grammar |
| `python3 scripts/atlas_index.py --check` | pass；56 新来源、2 复用来源、46 实体、12 grammar、141 关系；上述 P2 尚未包含在检查范围 |
| `python3 scripts/test_atlas_index.py` | 4 测试全部通过；13 组历史查询及完整见证、8 种非法 filter、12 种损坏索引 |
| 独立 CLI 非法输入 | null、数组、数字条件、非法 state 形状、无 scope、列表含 null、坏 JSON：均返回结构化 fail 和退出码 1 |
| 独立 CLI 损坏索引 | 缺 grammar section、非法 facet state、null 根对象：均返回 fail / 1，无未捕获异常 |
| 旧百科本地修正回归 | canonical 内存副本中的 known/空值及 unknown/非空值均被拒绝 |
| 生成投影与基线保全 | atlas.build() 等于现存 index；build_registry.build() 等于现存 registry；基线 595/595 来源和 850/850 快照清单记录逐项保留 |
| 组合检索 | Nasca + woven-garment + museum-interpretation + SVG 命中唯一 ANDEAN-WOVEN-GARMENTS，见证分别是原物、grammar、候选实现；同 exemplar 同时要求 Nasca 和 SVG 无命中 |
| 链接与差异 | 仓库链接检查及 `git diff --check` 通过；补充扫描累计改变 Markdown 的本地标题/显式锚点，无未解析候选。该扫描不是完整 GFM 渲染器 |
| 身份与关系负例 | 上述两项 P2 已实际复现，均用内存副本，无落盘污染 |

未执行写入模式的 atlas --build 或 registry CLI；用纯函数重建相等性检查遵守本审阅者仅可写报告的范围。未安装依赖。累计 .github 差异为空。

## 新上下文发现证据及限制

本次沿实际入口重新走读并执行组合查询，能确认链接可达、返回身份与查询见证；这是独立维护审阅，不另称 fresh-session 消费实验。consolidation 与 consumption 的新上下文记录包含实际任务、路径、产物和失败修正，足以说明那些任务发生过哪些取舍；本审阅者没有重放其完整代理运行，不能独立认证每条执行过程。

记录明确区分入口改动前后的两组试用，没有无 Kit 对照，没有将修订前成功归因于新导航；馆教任务关于图像证据的过宽概括已留下澄清。这些记录不证明注意力节约、普遍可发现性、设计质量或读者效果。当前书目可以离线初筛，外部原文、图像与 renderer 依赖并未完整快照。

本次未外部检索、重新观看 JLReq 图、检查历史原作、试听、运行浏览器探针、连接 agent/MCP 集成或测试原生设备。保留旧回执的原执行范围，不把源说明改称运行事实。公开报告只含仓库方法、公共来源标识及验证结果，无私有附件、会话原文、账号标识或凭据。

## 不应改动的内容

- 保留原有目录、canonical 来源卡、registry 身份和旧路径；不因验证缺陷开展全库迁移。
- 保留 ordinary reference、历史 accepted 的局部含义、文化原术语及设计师对媒介/参数/例外的裁决。
- 保留原物与软件候选的分面隔离、同 scope 同对象匹配、跨 scope 独立见证、shared-evidence 的局部含义；不得从 contains/discovered-via 继承 runtime 或权利。
- 保留历史艺术主要基于文本、稀少静态图、局部合成探针、未运行集成、原生平台缺口与未知许可等限定。
- 不改写历史原件和历史验收以营造当前一致性；修复及重测另记。不得合并 main、启用 CI、部署、清理分支或强制推送。

## 冻结树逐文件清单

<details>
<summary>冻结审阅清单</summary>

```text
fa5b5220dfe22d6345d030374acc98dbe9bbb56f7c57cd5492f08f49841514a0  CHANGELOG.md
de3f421b9b5e00527bfedef207b8faec09fec95fde2f42913f1b7b6bbfd5d7ea  README.md
35e5911274dd8febcf0ae04383ace38cbca330dcbf6a9711e67e62fcaca38792  docs/architecture/documentation.md
997991ce9b057d2f179e52f10886f06f07480f799029f2b132186cf0cd0bd92c  docs/decisions/029-design-writing-reference-encyclopedia.md
6f229854864debab4b90db813966ad75f5c3087683e04123410d9d936a932a5b  docs/decisions/README.md
22e4fc2e46b3919d8231658cddc24bb8d9e854796cefdea71a072073f9699634  docs/governance/evolution.md
49d6b142c54a0f3018226c261ab5a42e61fb380ea621a51a6d2f3ccede66610d  docs/governance/intake.md
dee1472ab7e5846aadbbc495fc206bb5b66441a338ce530e588fce43cf77fb38  docs/governance/reference-lifecycle.md
59dcd741790d8e741161336553e3e6b8862a1e6b34b6436ef7039860ff40e00f  docs/verification/README.md
1b97eba3f901a32ebe092a38c85fbc79e7b1e207aa95ad4f158fb5a44b9a905c  docs/verification/art-software-atlas-20261011/CHANGELOG.md
eec49aaac5c4a2c8d4710b8dbb758b1c8d8c648b5afafc7f7e816221cd9ddacd  docs/verification/art-software-atlas-20261011/README.md
afe0d03ebc1887ebc3b51ec56b33671e669cf07823d72946902235e6cffce3be  docs/verification/art-software-atlas-20261011/anchor-checks.json
7725616d7728562dcac514228ba2f1dca406a3f3edd5b9319845a2559ef94801  docs/verification/art-software-atlas-20261011/atlas-validation.md
8442942e4e3549b554355f22abcb043f3f0c9fbd8b41f9e5c7c695f28f2de8f0  docs/verification/art-software-atlas-20261011/brush-probe.md
84e19b640b2c6934294465edda07f4c55f207c78b47d3e895222a8ab3450fcc4  docs/verification/art-software-atlas-20261011/brush-results.json
22c5a16b6fe1011ac1ce33385f49e706b08e2e78a78801fd8fec192980cc0ab9  docs/verification/art-software-atlas-20261011/brush-synthetic.png
7612d7958ae6e6a94fb401b50cd38ec9aa0e4928ba21d2131cf092147dac6243  docs/verification/art-software-atlas-20261011/concise-body-audit.md
5ea24a0bb42dd2ec0f5cb304c880d282538142a2eb8a1554e22771743f4235f3  docs/verification/art-software-atlas-20261011/consolidation.md
b57e26341d81bc3a045fdd361b6708979d53876f1de5043c7e045d85d4d70e5e  docs/verification/art-software-atlas-20261011/construction-comparison.md
05749a7a361754763d1342f6f10ceecad7e02b2eb597200004106188d5997a9a  docs/verification/art-software-atlas-20261011/consumption.md
5445c101f2646b710873532b540427aad1eba9bffbf960c9e542457e8469dcce  docs/verification/art-software-atlas-20261011/discovery-trials.md
9f7f90443fb9c010cfcfed05bbe6d821b7af190374af9155879b5344c382c8cc  docs/verification/art-software-atlas-20261011/editorial-probe.md
2a4bff2d3e7eaffa4fb0f630784e796cce1996538d473437c7bdc8157cb9a1f6  docs/verification/art-software-atlas-20261011/editorial-synthetic.png
09e76bd5eed05c7a572f1aa375b402413a23381459f8268ce22b0daeea5cc3e5  docs/verification/art-software-atlas-20261011/facet-correction.md
84957bc0bc18d6839f346b51646938fa525ee6b3e1ad0cd51ae1496cb503ec45  docs/verification/art-software-atlas-20261011/facet-coverage-after.json
34e77a09aa4c679c5cb52592034d16dfc12fc3e15af34bcd8b555a9aa108189c  docs/verification/art-software-atlas-20261011/facet-coverage-before.json
c9ee199be71c62550fd7f4a4eb4b2a570d9eccf69ff24e7c8988a0c081b2b90b  docs/verification/art-software-atlas-20261011/facet-discovery-trial.md
c5526da38f2275a0d4866a1a1236acc766e2f24d9c8a3bcdc018eb29f4577a30  docs/verification/art-software-atlas-20261011/facet-independent-review.md
b06f3bfe310ab5a9ec4d0ecca4bab7eeaf943590abb5d59f8539973e16dd2f10  docs/verification/art-software-atlas-20261011/facet-query-results.json
6e57f4eaa32470fce653d3c1ae7bfdf99838c749a6fd9448f804bed2a9788729  docs/verification/art-software-atlas-20261011/facet-validation.json
cb35b7af034d057ceea567d9efe83fd883125e106ba4a1a2c969d61f0061dbf1  docs/verification/art-software-atlas-20261011/final-review.md
1dc3520ad606b776e077f99719ce0414a5dbcef5183e1b0f0f07162646169ba5  docs/verification/art-software-atlas-20261011/handoff.md
55ca02c49d4c39631f82dc6eee3d3a6c992e0ef341aef2d983e760e3c3266656  docs/verification/art-software-atlas-20261011/independent-review.md
22c201d5dd93a9e727db6ea8704828acac14395e02dfc712c2945328a6ab03dc  docs/verification/art-software-atlas-20261011/link-check.json
a78bed86bba98dce3e359fdbc1cd281659837522a7cb6b34960fe153677bf7b0  docs/verification/art-software-atlas-20261011/local-review-handoff.md
17e97aab2d023b9a806afd7961ef578ce0c441e4dfa22c2620f7c1fbbc37aa01  docs/verification/art-software-atlas-20261011/local-review-results.json
308b1d1a77fe1a79d126b1dafaf8a36aab8bdeef2ca8f51b8d7452069be3db3f  docs/verification/art-software-atlas-20261011/local-review.md
9ce15803c8815275a6f02c22789b3121eabdca7cf0914b5734cd2d77e236b24d  docs/verification/art-software-atlas-20261011/negative-checks.json
3fb5dfe7772f0c556a2a01a617d55af55f32bd6214f9a7922e1244bd7111023b  docs/verification/art-software-atlas-20261011/repository-results.json
e3786ff3d529f870b213e211fa15f2a0fa4399a5b4e76f2221c27154b8753426  docs/verification/art-software-atlas-20261011/schema-results.json
6127bc3a29a975205635391f4fbd7790052647ae663c5383ac67c97d35478175  docs/verification/art-software-atlas-20261011/scope-routing.md
b788790dac7dfa4f0e325cbc3b72b94a95c5021a54b44e31e6eeabc73e3eabbe  docs/verification/art-software-atlas-20261011/verification.md
5af796df162738720e292c29e4031dfc50a5c2f48c93be8bbf71bc9d8e6f81f1  docs/verification/design-writing-encyclopedia-20261011/CHANGELOG.md
2379e861ab60a0a1f9aa44e30d1b0f05b37175dad99da9225afa4b6d239a95ba  docs/verification/design-writing-encyclopedia-20261011/README.md
3421a5cffbac8c1c4d379c3ac0ae49fb94d0561de2e28a33681b6df1a8e0ec9b  docs/verification/design-writing-encyclopedia-20261011/body-history.md
4d29fb3d2a3ae482aa756dae37954fb674b704f2b6d885696644f8c861cbb11c  docs/verification/design-writing-encyclopedia-20261011/consumption.md
aa0fe94727b25df7f10de670839c119b3719ee97f5fc6cd0175f749fc1f6c22b  docs/verification/design-writing-encyclopedia-20261011/verification.md
9f52e1c53a5f067faa4b9e18e9ec778fa642e6084ef1eda91a83e9a79c745070  docs/verification/reference-consumption-template.md
e0bbd1e291b4f07009d9ff4971b349b343c30efe30e53f56584b66a429f98ae9  kit/README.md
36fda90222d8eb5233af439b36b598c37d598db29be665897cbaac2ab7d843b6  kit/design/README.md
6d61886e5e6b5199288448586ee53c09b272e9e57329d874de747a865072f63a  kit/design/composition/README.md
a0ab6aa9d711d684fefaeb16ec156ab782b168c1ce0784c1080d28f514913c6b  kit/design/composition/color.md
eb8cd93a321a0e463dc09d93829d0de9c4ab01e39446fa445169c6a33e808322  kit/design/composition/editorial-translations.md
3ed7de5ffb2441d378d0bc6545ffdb0941ae39c6fb332ea3906d0aa928bc59a3  kit/design/composition/material-relations.md
20ea19a4e1d72dca9a2d9a5c542aaaf0f337a83ddf9d3fa2bddaafa4524b9146  kit/design/composition/object-representation.md
c36ce907d229b4bc54620a6ef77c0169fd29757ad751c8426feb1751f615e8fe  kit/design/composition/spatial-materials.md
74f159e16ce3174a15913cdf21d911b21e4612ae6a3d2281abf91a6545ef9418  kit/design/composition/typography.md
67f13eb0ac6189e7de3dea92d8ae1d2cd485f3b348ef6a41a918463af7a4b58c  kit/design/foundations/README.md
7e80fa449274036fef7291d9d4a372724bb65ec291cdfb727b25461e6351c2dc  kit/design/foundations/anchoring.md
589e64f2ff8d64f5a03630ea297cdb22d984439549421ebb92f947bbb42dd684  kit/design/foundations/relations.md
434b310397ea6cbf84806ff445199fdaa3bf4565ce65080ff8936715f15f585f  kit/design/foundations/standing.md
6635e9a68dea56bb8b636acf54d10cbd006f0b0fa2b2398771cd88f979efdb3d  kit/design/interaction/README.md
6c7eaec1fbabea3d52154f4a89acdd81c0d739e1f8fe599eb54264b9394c42aa  kit/design/interaction/controls.md
6b9e980bae459fe26c08258fe5ffa0174f4485320f19176c7e5cbc7de902e037  kit/design/interaction/extent-selection.md
12c3093c0834cfcb35800b5cb2bd8bd9efebbf576fe214dc1d6de089fad2c6e9  kit/design/interaction/feedback.md
4fa6957f404e6e7d7bdbd06f167eb7919963435abe35cf9987c49fda00f4ff22  kit/design/interaction/navigation.md
bc5e2078e9044b9081f3614927634cd91d41d073e1bf943561574ff11ce408e1  kit/design/motion/README.md
2694c5b55ecdc051eba0440d96ef0a7aea739e73fb38ab0afb310c47d39e3295  kit/design/motion/choreography.md
9c9a5012922c10167547eafb95960bb5418d418942d2ce3b90e1bff3a0cc0704  kit/design/motion/rule-systems.md
797d4a63c53476abe953446a9d7b220738d07459d658ce3e545d1f670329fb70  kit/design/motion/score-and-time.md
177e1ec44071b7f6a57998e93004fb13da8ca79b3041fb008b5d5c009fb95884  kit/design/references.md
50046e1bf16a0dec21ad814ae543f74565fc18fa984aa59452adf7333bc11f76  kit/design/references/README.md
af8db2c54f29bcca8a8887b3435efa927d48791d88dbfd5e7817ae111823b94f  kit/design/references/agent-design-resources.md
8b9543c7e34e8125af7947c067d876fb1e7185a2a3081730948ff81591ec53c5  kit/design/references/art-software-atlas.md
bcc1c8874ea4f568eb02fab94776f75e8bf58b5aa4735a314f95070807aabdd5  kit/design/references/composition.md
d83add1fccdb74de136dd25ad2881a218a93206b65660054b0ad27766e69f232  kit/design/references/curated/comparison-continuity.md
39c5a5bcc99571a7a4077eb730540285fd153d32bc2f7a79e5a0f02f7c03d81e  kit/design/references/curated/note-adjacency.md
fecdfec6d1b0156a2e4cd5ff9f4daa60713f582afecec5cd4356aaf4869e0dfe  kit/design/references/discovery-relay.md
b6848c15ae2b551bdfecfc45f75bd9a0ddfedab9b98ae5c0146c5497055ba3e1  kit/design/references/languages.md
cd2e21735b11fe9609bfc6f79dcf8f760f6db7e743a58bcee3e5e2e559e825dd  kit/design/references/reading-sources.md
b3aa7a5ecde15ff61b3f2b57ae1f2738f87ccb677b3c2a290e9fb36feeb5c350  kit/design/references/specimens.md
346fdf83e361cb6c07aa3cc65bea995c645274fcfd15c38fe0d7995f77acfcf7  kit/design/references/systems.md
bf452c5eb126efc5abe1afcfaf918c8d0cc112908fb8f92f03d0d1fe5be86024  kit/write/README.md
7d14386d1620f7879e37535154e49720a3f40a18ff37924dca6a154e3fa8fc62  kit/write/prose/README.md
111b1ba067c7b051c10f2a541f4bf2e266c07b7920b191ee8fc99078a5b8ca3c  kit/write/prose/argument.md
2d933a41bd22d597238980c4b7a4a64d0b7e0756f23e6625466a937957ecb15e  kit/write/prose/audience.md
6804ce24f74e1fe3ed6d106af1c0e117218ec27e91cd0d4f973598d60211d347  kit/write/prose/genres/README.md
6fc4c3de82c8a453b833d839c0ef0990db47648810c4d6b83f018a2e6567769f  kit/write/prose/genres/narration.md
1367e2637230d8da72b104bdfd4e0b6ba457ebc8656cee1e286c6a61305d311b  kit/write/prose/genres/selection.md
5093508926ff5a6df0b40a8887c587e782507dada7c5495ba59e62c3ce886055  kit/write/prose/microcopy.md
ff67e276f98d4d45b94a3283712432901172574baba9a44900c8e8ee780b1efb  kit/write/prose/multilingual.md
bdf709202cb72872fdf60c286b081ffb4f3545a943d0fc5afd9be51bdd3087ab  kit/write/prose/review.md
19d516a2e864262ef0c6f963c1bef0f7bce43521853431e9ed9d07b44a08b940  kit/write/publish/README.md
37a37855771cbce3f2ca94ce58e225c613241a6c8d402e3eda01003618bd7224  kit/write/publish/media-choice.md
0a9de491dde4ae73461da7d4825a7366693ae9bbd1bf1825e7140c86a499c5e8  scripts/README.md
2388f7e34c027f332a15eaf05a6527dce3bb0007b8a13a859afe11252ec79a14  scripts/atlas_index.py
ccc73202bf8fddf4eb3efd286eae2b4f52977d37fc42bd345fe23f91e1e5d014  scripts/build_registry.py
4882704a73fd40b59e26d248a4e23828ec6bfc80da1517fcee5d70164254bfc9  scripts/reference_index.py
c973ecc3dba6f5ed7eeee0c60cd19ddad69dc8319c6292f7f5baedadde6ae3a6  scripts/test_atlas_index.py
90ee50052e50398d201c0a991879117b00b1e28bd03ac52f710b73b93005f637  scripts/validate_repository.py
476cf70b224647c105c8e7a7f72d18ba635912e6a586dd75bddc2176977cadb1  vault/distilled/knowledge-film-001-distill-20261005/README.md
449bbe80824f5c41068d8e97e26ddf1dd395e396241c0cea2fe0db8e88a9f8b2  vault/intake/README.md
07b32bd9312559b35be3f6760c94318bf1f6ccdd431ad03bfe721bc48a74d49b  vault/intake/art-software-atlas-20261011.json
aae2e4d18a5eb2211e02ecb6f4136605b4f6e4d339c6d90ff5802ad0c73a3677  vault/intake/design-writing-encyclopedia-20261011.json
067202a46e1ae3bbeadb0ea01b09bef9a2362d5592e93e355c0cae2b2c94cbc1  vault/provenance/README.md
ca31911b24160756cc459b255a8b56991715142d0a89e6aec0bb2f0940fed8f7  vault/provenance/art-software-atlas/README.md
aec591ec27b6172b8ad9f34678a970a7c6ee8bbbb72f688601d4274b91ed2978  vault/provenance/art-software-atlas/architecture.md
a863eb0050a8f6e3551f0d84bdd72b408aee200e2d225c44dab0e94c7e565501  vault/provenance/art-software-atlas/bibliography.csv
1c7f56c01e97da93bdac74b75740a8409da716afb3f831950da35a5b03f06d27  vault/provenance/art-software-atlas/discovery/CHANGELOG.md
afd13dbf4bcaa8f1e026ca459f9cbcbe336675e9763956d455330e7bb8a0a774  vault/provenance/art-software-atlas/discovery/README.md
6e5c6f3c250f66093a1668013fb78d395c81b599bede8cd1a0c39bdd845efdae  vault/provenance/art-software-atlas/discovery/cards/README.md
5c660de97f2212f21912307a87585b03fb186c45afbd562f5380ccabdc422de9  vault/provenance/art-software-atlas/discovery/cards/brushable-scatterplot.md
f5abb197ebba189f34cffc638a1d90fd755d2e977f27e798289644d5ee7e846a  vault/provenance/art-software-atlas/discovery/cards/codrops-demos.md
32ac7b224489d124138c97566925e81da1370c0da0111bf39e7dcf9a3fd76915  vault/provenance/art-software-atlas/discovery/cards/creative-coding-directory.md
eeabe45edf1faa6f6bcd1bea77e06949ae0f8de66fd4193e686dc3d799b9291b  vault/provenance/art-software-atlas/discovery/cards/d3-brush.md
90de3f1413b985c9b94c93501f0cf5435c4f9d9b981008a5dea1a5098f8b7ff2  vault/provenance/art-software-atlas/discovery/cards/d3-license.md
8e94ccdc2d9a7db200a41a80fe5c013af029d589a3d2b63aaaf329477a0f3e6b  vault/provenance/art-software-atlas/discovery/cards/rhizome-guide.md
5364544f4377422afc9d4214b86ae966070e58c2f7d038df47caddbaa5cd197b  vault/provenance/art-software-atlas/discovery/cards/rhizome-model.md
1098968a276f639f267dc3f5003aa280667833f1c30c4331e780794d623b471c  vault/provenance/art-software-atlas/discovery/catalog.json
71b5baea80cb834924cec16d306c73619f9e096da6a85366f44ffe215d707a96  vault/provenance/art-software-atlas/discovery/entities.json
cd3232221e5ce828fc42e624940b1d3ffcc9094745aa9ea7c0c030205860c703  vault/provenance/art-software-atlas/ecosystem/CHANGELOG.md
7f6bd2bc983edb34a0f70999db98497a9da1aa33e47d60cc70b0091b51582718  vault/provenance/art-software-atlas/ecosystem/README.md
62ae9a549d870a196b3b095e99e9d3c1f87e6e31d002d640729fad7f944c81db  vault/provenance/art-software-atlas/ecosystem/cards/README.md
a9b07eff2454f410cbfd0e201a28f291cb028e42cbd4947334c6c9db1c5bc5f6  vault/provenance/art-software-atlas/ecosystem/cards/asa-a-01-opendesign-site.md
12fcd4d4c8a1ff56d468e909e7fc1bd011522d5fec41da6afcd2805160b77e32  vault/provenance/art-software-atlas/ecosystem/cards/asa-a-02-opendesign-repository.md
416ee70c7b85ec8d57be004167b370d5c132c9af008c0f03029370bb243346e5  vault/provenance/art-software-atlas/ecosystem/cards/asa-a-03-opendesign-design-systems.md
fcd78aa459ceb10367813fbd3c2efef05dfe44f68bc69c21073293146ecd913f  vault/provenance/art-software-atlas/ecosystem/cards/asa-a-04-opendesign-skills-protocol.md
c4515a6dd0e19614c6cfdb4d5f95e3208dd70ad7ab8771cc21b701ee814bdccc  vault/provenance/art-software-atlas/ecosystem/cards/asa-a-05-opendesign-agent-adapters.md
87dd3a66c44c0c5de802abb6f246bdb18fda13983f8872f4271d26a5cedd0cc6  vault/provenance/art-software-atlas/ecosystem/cards/asa-a-06-opendesigner-candidate.md
253cbd3f9d866dd246b63079bd3be59dc17ce87de44e66523795428e817a13d3  vault/provenance/art-software-atlas/ecosystem/cards/asa-a-08-mcp-tools-spec.md
56a6cf62ba29e4ce745b965ea38f99ea76cf73eb2116283c7eae21d1c9d7d3b3  vault/provenance/art-software-atlas/ecosystem/cards/asa-a-09-shadcn-registry.md
f5f9f60fcb62ebd5f3e24f03380467d98006a0640e4d7d9f68e82744732830d7  vault/provenance/art-software-atlas/ecosystem/cards/asa-a-10-figma-mcp.md
1bd42e53b2ee0f3c795b993d293159d82e180fdec93cdcc248f372571e34a6a6  vault/provenance/art-software-atlas/ecosystem/catalog.json
ff8e503cb52640e59b93c25ca060e652bc069d52bb0e8109b6098c37fdee62ab  vault/provenance/art-software-atlas/ecosystem/entities.json
0cc14507fd55947e2e6e15f459a9d0302f8e6f14f035c43d82bcb68f5309b446  vault/provenance/art-software-atlas/editorial/CHANGELOG.md
d298ef0faf8955b87838851ff0d218d00fdd03f083f36f9df7e266fe6bc2eebc  vault/provenance/art-software-atlas/editorial/README.md
5c025826a3ca57f544106261744c56a02cf9d82ca2051db798d801bd4c033723  vault/provenance/art-software-atlas/editorial/cards/README.md
26a8b7b618ca555e8a969e79fafe4e593014167de7672ec3549b0b6b0637c166  vault/provenance/art-software-atlas/editorial/cards/asa-e-01-isotype-documents.md
ee817a5586c3027c129c7c89dd74d688d30d096c9220d0781c1f8d380001da21  vault/provenance/art-software-atlas/editorial/cards/asa-e-02-isotype-research.md
74071a58021cfcad4cc073927b921dc90cff28907e452e571165fc052b3d2a3a  vault/provenance/art-software-atlas/editorial/cards/asa-e-03-rit-isotype-exhibit.md
21aa5636b334a37af9a7c7e6ed879530be28322bbd05a764a98acc084446b0a4  vault/provenance/art-software-atlas/editorial/cards/asa-e-04-marie-neurath-process.md
205a82c2f1441be80e2e0876b672c1e0fdc096774b5df44635e603547b3e7de0  vault/provenance/art-software-atlas/editorial/cards/asa-e-05-isotype-collection.md
891df6400a95b9fe73dc1e5a005c88226108c07dfe5464cf0c5a4ba50ace899d  vault/provenance/art-software-atlas/editorial/cards/asa-e-06-jlreq.md
5a8e14467f4aab79f48c37aebec8b5c07cacb0bd2ab9e3382de0362739502bf7  vault/provenance/art-software-atlas/editorial/cards/asa-e-07-css-writing-modes.md
4aaf142a415259b346cd798b6268c53394e688e4bf0907f22af5e8dc975875bc  vault/provenance/art-software-atlas/editorial/cards/asa-e-08-css-ruby.md
35c2d207918a6dd5c8052e053ed5a7a82b97ac76a6db36bbd0e30a2e72664073  vault/provenance/art-software-atlas/editorial/cards/asa-e-09-ndl-newspaper-survey.md
c73f7b5e16e969412ae4a2d3a9aa717767694eba5559eb8bbb0d4152c7f8cf3d  vault/provenance/art-software-atlas/editorial/cards/asa-e-10-jlreq-source-index.md
b28dba3b14c5cab9407a8cbbf3431227646881ed83a645c344943194e8228461  vault/provenance/art-software-atlas/editorial/cards/asa-e-11-jlreq-vertical-comma-figure.md
1477abf64ff17e86b5f8a652d2b228dee5b2bccf6f6a0908fcac845feadb52ee  vault/provenance/art-software-atlas/editorial/cards/asa-e-12-jlreq-horizontal-mixed-script-figure.md
548e4a5c4c27e49a2bb00251172218d04b24e91276eb252cac639ec832087442  vault/provenance/art-software-atlas/editorial/catalog.json
91a8639abbd42856fef976b6b21e0a5a3670652670e646221183339d96d65570  vault/provenance/art-software-atlas/editorial/entities.json
1f704ffe35722faaf1aeca9bcef84fe0b4f44b9d5bd9edea3b65d50356e87fe5  vault/provenance/art-software-atlas/facets.md
8d9f2f1b2f2d3bf38782adc06dc1a4bd35d13c2f9a3d564d9e31b5ec2b9df85a  vault/provenance/art-software-atlas/grammar.json
7ef8aea68d0667c514f9850b7b42f68712b78609b1694a0b1cf2121e7df30c4a  vault/provenance/art-software-atlas/index.json
ef691110cd478849fda5ef280eed10394ade964a39e3494cc03dbe8eb02a29a7  vault/provenance/art-software-atlas/material/CHANGELOG.md
9e28e32008069d109dfc0fe425eb7a5d0af25d28b600acbc3a7d595c5170fc6a  vault/provenance/art-software-atlas/material/README.md
7cd86120caa56d9d782cb8ea57c35583a48c5832effa0b7dd6b1382c99a1739d  vault/provenance/art-software-atlas/material/cards/README.md
af4fd1d135cf6f1b079e257c0704c1b1fee2643387d61e5bf115be9e4f9a68df  vault/provenance/art-software-atlas/material/cards/asa-m-01-weaving-abstraction-ancient-and-modern.md
aede8ea3e76d9ae349e4dae0e15ae6e8a200e8e2dac28e69e718cdeaa999a11d  vault/provenance/art-software-atlas/material/cards/asa-m-02-met-chimu-shirt.md
f7b053162b5487901802018799bb1e1012dede46b63abcb595702fe0ee3a7350  vault/provenance/art-software-atlas/material/cards/asa-m-03-brooklyn-nasca-poncho.md
184b1bfdac408921ccb8897eeabb36098ab7bebaded2d0bbd700f8934d9ed2ae  vault/provenance/art-software-atlas/material/cards/asa-m-04-met-geometric-patterns-islamic-art.md
8391fc15c456fe7d8dc90e7cd07d89f7d2b04ab5ad5588f7ad7400693119fb1d  vault/provenance/art-software-atlas/material/cards/asa-m-05-met-entrelacs-octagon-tile.md
936af7548dd0203dddf1a50243f52623c7e122d1fa1e66fbe176f499bd7b6eae  vault/provenance/art-software-atlas/material/cards/asa-m-06-v-and-a-tile-activity.md
ceb8e125fcbe4a93134f7625fee7747d724058305a3974cf476c0036f024a2f6  vault/provenance/art-software-atlas/material/cards/asa-m-07-science-girih-tilings.md
4af46db61181fa98d97c516da1582e3b18dbe045ee8242717c77e7296bc67fc9  vault/provenance/art-software-atlas/material/catalog.json
927f27f60600ede7b73dca4287decefe129a7732780eeb727c1be77f54f508b8  vault/provenance/art-software-atlas/material/entities.json
4fc90eed5155ce53f676606c266e0a591157bd2e52d8e36e545f9394e5f0fe3c  vault/provenance/art-software-atlas/schema.json
16fa477cdcd01ca2af4872efb4540b03d5b514941c0b41d4f1675364545bf55b  vault/provenance/art-software-atlas/software-scope.md
331671c827eb40e5d19e68e3ec4eefe394d3b37b6415c1c46c58b66aec28a805  vault/provenance/art-software-atlas/spatial/CHANGELOG.md
f32e0d8ffdb70959fc715a3d9d36034dae6a5bd75f0a9eead19233e378fa6204  vault/provenance/art-software-atlas/spatial/README.md
d1ff8acc28615e57feefe0d2bdb7b729fc8c62b0dfcc1a3deaccdc5e3ab98e11  vault/provenance/art-software-atlas/spatial/cards/README.md
968731e31d9ef0b7bde1ee19db0ae13d9d0eb046f57319cf9bca56e7bc1ea36f  vault/provenance/art-software-atlas/spatial/cards/asa-s-01-aros-as-seen-below.md
04860a5dc4f058a32a211653456ddeb0f5b853b2f8d21d4f686bb07d0b95f9b4  vault/provenance/art-software-atlas/spatial/cards/asa-s-02-turrell-ut-project.md
afbda0c504e82b503fda27cb1a241be74cdc34fad03793868c54ffb50693ffa8  vault/provenance/art-software-atlas/spatial/cards/asa-s-03-landmarks-color-inside.md
4d7b45bcbdf87fefb48711335bd0bf0e50dafa910d1e76930a4e8791d80633a9  vault/provenance/art-software-atlas/spatial/cards/asa-s-04-asu-skyspace.md
81661e54f5a00d1b63453f18cbd5616ab53d9b094b9a6277268b78d77aa78af5  vault/provenance/art-software-atlas/spatial/cards/asa-s-05-clark-ando-projects.md
92d5aa524d6d1741240e70a7826926444f96987876656aebca6a8333d9129aa0  vault/provenance/art-software-atlas/spatial/cards/asa-s-06-ibaraki-church.md
4a1612d1200ea18501843fc3cdb8eed9421be4fa9d1166d400c3310f33167a45  vault/provenance/art-software-atlas/spatial/cards/asa-s-07-10plus1-photo-archive.md
7607556fb2c1db83f913faea475330646aa8e6d1fce6c37d6180f08428cb8e08  vault/provenance/art-software-atlas/spatial/cards/asa-s-08-threejs-meshstandardmaterial.md
c51875cb8adf3b0aaa76c6b01191af8873b99f76124f0eb03f3e97aa14f89b9f  vault/provenance/art-software-atlas/spatial/cards/asa-s-09-w3c-css-color.md
0c700c07c238169a2dd41e414a5a7f95c33a51e6cd71145f4753e1019afb2971  vault/provenance/art-software-atlas/spatial/cards/asa-s-10-commons-ibarakichurch-photo.md
643f15a7733949136f595f4a3286ca0f21f8c4e05b631adda2fc1ca20a97393a  vault/provenance/art-software-atlas/spatial/cards/asa-s-11-commons-image-resource-failure.md
e473a47d0176d1348e867769952e58fec748512720c0e39325755cdb0fbfb80b  vault/provenance/art-software-atlas/spatial/catalog.json
5f9c90b046ef29a3d00c87f0d086788bc5a9cb84c817ff2c62daeb3ad0c7c3ab  vault/provenance/art-software-atlas/spatial/entities.json
4d879af9c3725440d6ebc34402ba296016ab22f3c3fef27a76e3100d0f3c847b  vault/provenance/art-software-atlas/streams.md
8c1ab293d881fe7a75efc5bb01acc30b76873f25a9391ee9b8a5c8359e82c492  vault/provenance/art-software-atlas/temporal/CHANGELOG.md
3730e246b864302c2a30446653cdeb44515f771e5055c10b4d24f5eaa9bd2b91  vault/provenance/art-software-atlas/temporal/README.md
0d0d47335a7a432f304e7eed62978e0fdf46df7bda0b925bcc27f4190e38ac5d  vault/provenance/art-software-atlas/temporal/cards/README.md
fa56a94068942a5b3fbdbdfdde711d0c8016e680f8e533f1028a2b0366b43bd9  vault/provenance/art-software-atlas/temporal/cards/asa-t-01-getty-december-1952.md
904fdb9645ce2650f50f630f91692433149520f7c997db8de578f7adf497659d  vault/provenance/art-software-atlas/temporal/cards/asa-t-02-getty-introduction.md
d05965e5cb1ee89ce06e12f6a0c486b5c25e02617100405b3d710a75b53872d3  vault/provenance/art-software-atlas/temporal/cards/asa-t-03-morgan-molnar-interruptions.md
57a5aa336c23f53a860cc5141fd39a98e03b9abca78e74d0dfaf1bad1e5c8f1a  vault/provenance/art-software-atlas/temporal/cards/asa-t-04-va-molnar-machine-imaginaire.md
edf9903ebbfd87a63e2c0b3f6a2db0c4f952a492c9f872bb47a01e934f94d802  vault/provenance/art-software-atlas/temporal/cards/asa-t-05-processing-random-seed.md
b5ebfef293b19ca56cfea509c508dc7cc319c28f3f36f224d22ce44dafbaefba  vault/provenance/art-software-atlas/temporal/cards/asa-t-06-p5-random-seed.md
2b11034761a4116eff41385da3089395a158c3748299426ebb375037a13a0f53  vault/provenance/art-software-atlas/temporal/cards/asa-t-07-tonejs-transport.md
72cde0d9d4c59bf9d7a2875a52d8d3d43589e1e0489becd34cd3e0c124d797dc  vault/provenance/art-software-atlas/temporal/cards/asa-t-08-supercollider-server-timing.md
1d5dcb3149e4c2e8ae00416d586795857e20a9924715543b79c5217d450e78fd  vault/provenance/art-software-atlas/temporal/cards/asa-t-09-wcag-animation-from-interactions.md
f4d13f679e0362f907854f15d4306f7c2ac82fad20b62c13d2e06cf3024b08ed  vault/provenance/art-software-atlas/temporal/cards/asa-t-10-earle-brown-prefatory-note.md
82ee8f523246f69f751f7df4a3900239414eebee3214bdc72ab809bec0b77c9e  vault/provenance/art-software-atlas/temporal/catalog.json
7c93572ec8dfdae2ba9aa9ade5315b665b7ef8725dfffc181bff3dace667136e  vault/provenance/art-software-atlas/temporal/entities.json
aa839d95daef1b5844004d54c9a5bf1d77d17a868933bc0dc699f921f068bf9e  vault/provenance/design-writing-encyclopedia/README.md
cdd7a07d4ed3c7c4cc61c7d54e515166a7a0675f180c8a8f9507a5e62dc1d062  vault/provenance/design-writing-encyclopedia/coverage.md
b60dfae6dec5daf223a391fed70d9db9f5b84836a11f1d2327e53af0df0a020f  vault/provenance/design-writing-encyclopedia/cross/CHANGELOG.md
fb9ed1aa4fd58b27c82aa944128c988d7cb5cad5d3a3f3f88d517eb0ecb7b6e2  vault/provenance/design-writing-encyclopedia/cross/README.md
b163285e620cddc0bf4e092a8525142ae3c581ab999719377a1bfe635043b0ee  vault/provenance/design-writing-encyclopedia/cross/cards/README.md
85c5d9b486f24289c3652f00cf4e4ad19a1ea8ba8a40a08e8da9bb30d6f5c7cf  vault/provenance/design-writing-encyclopedia/cross/cards/dwx-01-tversky-animation.md
086a1676cb8e869b9812eec52fad5f985613d8dc3d924b2bdd98afaab61863ec  vault/provenance/design-writing-encyclopedia/cross/cards/dwx-02-nasa-know-your-earth.md
7ba2c69cb5003d0b330d08fdcf8d244180ecfd59aaeedd943e2ea1873e524984  vault/provenance/design-writing-encyclopedia/cross/cards/dwx-03-nasa-eyes.md
ea95bef3c9aad4e810bc7ecae83fd9c61eb4320a40c4f0e758c10c7281c9c458  vault/provenance/design-writing-encyclopedia/cross/catalog.json
eb3a709eb37c61ced1d7ff51f26dc042490112da2e519200bdf30329da05cf14  vault/provenance/design-writing-encyclopedia/index.json
75e2873b844b8a5828fefa9576e2598391fc66cd956e4b44a727a3b181e4a2e6  vault/provenance/design-writing-encyclopedia/interaction/CHANGELOG.md
c74377e55a4b1d216f784aab0b5b8522e00e7d553a73611da87f8d6cb70b18c8  vault/provenance/design-writing-encyclopedia/interaction/README.md
98ac524357b3c0a593eaed60d9b81a9a3c5ac210ddad7424232c896ec94926b4  vault/provenance/design-writing-encyclopedia/interaction/cards/README.md
42395ea33d74746c70b622bfc262b801310d6f8b097c65641a3772c79e3fd1b0  vault/provenance/design-writing-encyclopedia/interaction/cards/apg-accordion.md
e135d8d7ed4326a61c38064c28ea84553e7ed0eee357818b7d14a52d8746502e  vault/provenance/design-writing-encyclopedia/interaction/cards/apg-dialog-modal.md
7d4a7d7325ae8a741855a3d35ee5e4f5438fffdeaac4a407f7000c08db79d9d2  vault/provenance/design-writing-encyclopedia/interaction/cards/apple-sf-symbols-overview.md
2ba0dc9b3ccb58f3b4774a6ed27487b5bc0685b19e89435a19a3fed586abd617  vault/provenance/design-writing-encyclopedia/interaction/cards/apple-sf-symbols.md
9afef0932f77badf55ac77b651250efa1b4eecc42f009de4a5dc5c5878d9c8d3  vault/provenance/design-writing-encyclopedia/interaction/cards/prompt-motion-entry.md
137c1a9630a1472b595f94bb6e443a75fbf17cd4f68de54f986c0ed9a7953443  vault/provenance/design-writing-encyclopedia/interaction/cards/react-aria-slider.md
af7665e02676d45469e6733bb76f047507eafabdbf88406c6ab8179077fb6d3e  vault/provenance/design-writing-encyclopedia/interaction/cards/wcag-dragging-movements.md
f939710ed1d77c30716c94b31e1343681c17982c3ef3d5687141c5bf90ebe6dc  vault/provenance/design-writing-encyclopedia/interaction/cards/wcag-status-messages.md
16df8d6629acc55da384c286abd6e4c411fbd4a73492e98fcb1481981109e293  vault/provenance/design-writing-encyclopedia/interaction/catalog.json
25e5ae2422df19e0cef6a93d322a0854efbcd3e6d28c124c20f84d6f76bf10d5  vault/provenance/design-writing-encyclopedia/visual/CHANGELOG.md
4e3c10dc1790032e610817645ce2984faecf6bf368bdbc8906ffc19f0a8ff0c3  vault/provenance/design-writing-encyclopedia/visual/README.md
8f2228c726949e63efbab1b7d05abf8309585d964ef066276b3fc068a4cc9b9a  vault/provenance/design-writing-encyclopedia/visual/cards/README.md
14a1c41d85821971e05d20853f0717e8cb6d78067f37c836e7ce37ce77dc926c  vault/provenance/design-writing-encyclopedia/visual/cards/anatomy-firing-still.md
010ae54c3904fbba7ce72163ec740a3c8dd50d77c399b832684a97664e802036  vault/provenance/design-writing-encyclopedia/visual/cards/anatomy-readme.md
c488cb18914a0bdf23e18b209ea475d24b71fb2b01c52eec3b3ed7e425637204  vault/provenance/design-writing-encyclopedia/visual/cards/anatomy-skill-landing.md
8cbd92d64059efe68ea7389afe6780af51fc44e035991d6b127179f7d088e64f  vault/provenance/design-writing-encyclopedia/visual/cards/chinese-layout-gap.md
da490ed30191e5525b52c6cd8b90c4782d675d82cb344b2a41345ade0583e1cf  vault/provenance/design-writing-encyclopedia/visual/cards/colorbrewer-schemes.md
3dcc688c9dfe2070f1e293857721760b25a39955cbddeb5aef9dcde85b24af73  vault/provenance/design-writing-encyclopedia/visual/cards/css-text-3.md
55fa183c72fcf7bd355e546c97f118177508e02af7a261c2c4aafc6e0f4b8569  vault/provenance/design-writing-encyclopedia/visual/cards/hairline-hero-gif.md
925f1c1deb2bbf6af3615e94357253d5f7bf59292a108f994ff4930e4abe3d0b  vault/provenance/design-writing-encyclopedia/visual/cards/hairline-inspo.md
d13894e6f1dc15daa44049e68d159c1ace562018b10e848867feb67212d8b9e0  vault/provenance/design-writing-encyclopedia/visual/cards/hairline-skill.md
b9f45960e229c0bacfd2418884d756fcda8891b08df90b4ec83ef4fc36519722  vault/provenance/design-writing-encyclopedia/visual/catalog.json
5feb3560133d819da4c5fdf5401eae5b2953c0721ea33fcde45858de0a5827cc  vault/provenance/design-writing-encyclopedia/writing/CHANGELOG.md
cca1cc03849243f64599f5f792caa85ff08ad6af8379ea8f304ade95c2f9ec15  vault/provenance/design-writing-encyclopedia/writing/README.md
d6f4be6b8570e0f13a8ebef509ce209e7a22b003e501456572981a344378be12  vault/provenance/design-writing-encyclopedia/writing/cards/README.md
8e7917c734b2ad1b9fbce09c56405cc5fb64870d93c0236cf93e1ecf2f72f71f  vault/provenance/design-writing-encyclopedia/writing/cards/ant-design-copywriting-zh.md
3b02851b2feaad486334f2e9ad7ff8ad99c6f7a33613ec8a37b68787270a8a45  vault/provenance/design-writing-encyclopedia/writing/cards/google-style-guide-about.md
30567c8d06dc2ed616c8dd8869c3001d2f80fc14e5619d19fdee60df6ca48737  vault/provenance/design-writing-encyclopedia/writing/cards/govuk-error-message.md
16bfc26ed2dbca98dc77f6d59ccaed2c6acc910e2ebd1288e7917c88a7b0cf05  vault/provenance/design-writing-encyclopedia/writing/cards/govuk-error-summary.md
cdd7ed3f3637cf7560e089665c1da48b9305d557b087f350b3f1f91877441ee5  vault/provenance/design-writing-encyclopedia/writing/cards/microsoft-brand-voice.md
2658592d0462512e53e75704b832ab03d1af409325da9852a569e32f121648df  vault/provenance/design-writing-encyclopedia/writing/cards/microsoft-global-communications.md
7e8dfbf20a2d8a5890e403cf92b50d8b973807c1275b55167fcb083755f92a00  vault/provenance/design-writing-encyclopedia/writing/cards/purdue-toulmin-method.md
5943f0cbd86733f5f027c97ffe0bffee370bf42d6520d31d927f1363f012f271  vault/provenance/design-writing-encyclopedia/writing/catalog.json
337921aaa415e3f28d36cb2e68950281f24f1e3f6d3263c0318f0b753984d30f  vault/registry.json
fc4dde100305ac4f264bd972d4c4753150e32833dab4c672f3519a7846b6e192  vault/snapshot-manifest.json
bdc95677c999ad13d6eab95aea5f6bc61ab0f49cb49d123be177d7facd322b16  vault/snapshots/README.md
74a77e066e9c18030b200c97af8e12a6270fb8dee0df2ab35df903dde6e53701  vault/snapshots/design-writing-encyclopedia/README.md
fe0e28ff91cc6bfd68df12f909fca99ef360517f24cced9b4a94c9cec235dd65  vault/snapshots/design-writing-encyclopedia/interaction/README.md
f47577e710ef87997372979c6c7da6166043cc79b0a5e631170d13d60c14db74  vault/snapshots/design-writing-encyclopedia/visual/README.md
201b3cc67616116b1ab594f48f51a62a7533376e0a41260322db7b62ce1aa0f9  vault/snapshots/design-writing-encyclopedia/visual/anatomy-readme-excerpt.md
a010f2bf8416856326b2bd77828866eb8c5b5d85e5dca671c0a14fa2f5148d4f  vault/snapshots/design-writing-encyclopedia/visual/chinese-layout-gap-excerpt.md
c8031285052824bae6a40acbc845288f1a6b8b3c204af52b58fdf68eef9c47e5  vault/snapshots/design-writing-encyclopedia/visual/colorbrewer-schemes-excerpt.md
4b1891fca938bc735602c3722b5766a20264c293fa3f2b5986f96f683121cea7  vault/snapshots/design-writing-encyclopedia/visual/css-text-3-excerpt.md
82cc499acb07962edd23d253a0171d9d307cb1b0ad7263eb5de99c4c693dec10  vault/snapshots/design-writing-encyclopedia/visual/hairline-inspo-excerpt.md
0752ebe6d8f4632ed386d09b6248744a40174b08164fff872c6a068210752b8f  vault/snapshots/design-writing-encyclopedia/visual/hairline-skill-excerpt.md
bb0d949b549c75b128001db15211d1ffe25dcc3ad2258e01e932988b62d06efd  vault/snapshots/design-writing-encyclopedia/writing/README.md
```

</details>
