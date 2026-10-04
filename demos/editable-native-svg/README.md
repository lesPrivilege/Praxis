# 可编辑原生 SVG · 需求与绘制交接

本项目从真实表达任务登记可编辑 SVG 的需求及组合关系。研究、需求、合同和分批工单由登记轮交付；第一批绘制（SVG-01）已有作品，见下方“已交付作品”，其余四批和 Flash 消费验收尚未开始。构图、造型、颜色、字体和动效由 fresh Claude Opus 自主决定。

基线：2026-10-04 云端 `main` 与本地 HEAD 均为 `d4fd38765af52f6bd2b9ae422cf016ac0ad1ae96`，通过 `git ls-remote origin refs/heads/main` 核对；登记分支 `codex/editable-native-svg-20261004`，未 push、未 merge。实际执行为当前 Codex 主代理，未派 Luna、Opus 或其他代理，不能称为 Luna explore 成果。

| 当前任务 | 最小入口 | 下一产物 |
|---|---|---|
| 判断某个表达需求要不要 SVG、要独立抽取还是组合 | [覆盖登记](coverage.md) / [机器登记](catalog.json) | 匹配需求 ID、边界、组合与拒用理由 |
| 接手下一批绘制 | [工单](work-orders.md) → [交付合同](delivery-contract.md) | 完整作品项目及可编辑资产 |
| 检查陌生 Agent 能否自主找到和使用 | [消费入口与可视索引设计](discovery.md) → [验收任务](acceptance.md) | 实际发现、选择、调整、组合回执 |
| 核对已有作品和一手技术依据 | [研究结论](../../vault/distilled/editable-native-svg-20261004/README.md) | 读取范围、来路、图像观察与未验证项 |
| 开启 fresh Opus 会话 | [最小交接与启动边界](wake-opus.md) | 可直接粘贴的 prompt；本轮不调用 |

## 已交付作品

| 作品 | 资产 ID 与版本 | 覆盖的需求 | 状态 |
|---|---|---|---|
| [SVG-01 · 四个可编辑的关系图件](svg-01-relations/README.md)（[预览](svg-01-relations/index.html)） | `rel-fan`、`rel-scope`、`rel-qualify`、`rel-tracks`、`rel-sheet`，均为 `0.2.0` | R01–R08、R17；R09、R18 各一半；R10 未画 | 候选，等用户 review；自动检查与看图范围见其 [验收回执](svg-01-relations/acceptance.md) |

| [两条关系语法的样板](grammar-specimens/README.md)（[样板页](grammar-specimens/index.html)） | 用上面的图件画，不另立资产 | 不对应新的需求；演示 Kit 的成立程度与精确指向两页 | 候选，等用户 review |

需求 ID 与资产 ID 是多对多的关系，覆盖程度以作品 README 为准。

登记中的 `atomic` / `composite` / `do-not-extract` 是此次粒度判断，不是永久分类。ID 跟随任务关系，条目可合并或撤回。候选不进 Kit 组件库；Kit 只增加到本项目的发现链接。

后续每件作品在本目录普通子目录中保存 brief、合成输入、编辑源码、真实 SVG、预览、失败对照与验收记录，README 说明完整上下文。实际产生内容后再建这些目录，当前不铺空 renderer、assets 或 runtime。外部与未消费材料留 Vault；知识、结构参考与共享运行组件各按既有准入处理，见 [文档体例](../../docs/architecture/documentation.md)、[参考生命周期](../../docs/governance/reference-lifecycle.md)与 [ADR-002](../../docs/decisions/002-promotion.md)。

本项目的主张、证据、规则、机器建议与人判断必须可区分。付款复核台作者回执仅由用户转述，未提交、43 项通过、16 处修复、8 处留存均未独立验证；本项目只把“材料新版本不带动事项版本、旧阅读说明可能错归新材料”转成合成版本绑定反例，不开启该项目修复。
