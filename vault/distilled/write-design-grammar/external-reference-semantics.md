# 外部参考的最小 distilled 语义

状态：`partial`。该文件只提炼 Chat 中引用占位所指向的最小语义，并登记当前可用的补充核查路径。原始 Chat 没有暴露 7 个 citation 的 URL、标题、正文或附件，因此它们在 [`design-grammar-20260927.json`](../../intake/design-grammar-20260927.json) 中均为 `missing-original`。

## Chat 占位与最小语义

| 占位 | Chat 中提出的语义 | 当前状态 |
|---|---|---|
| `index=0` | Google 技术文档：描述性标题、heading 层级、不跳级、语义 HTML、段落信息前置 | 原始定位缺失；仅作候选语义 |
| `index=1` | Microsoft 技术写作：短句、复杂信息转 list/table、heading 支持扫描和导航 | 原始定位缺失；仅作候选语义 |
| `index=2` | Google style guide 对 numbered/bulleted/description list 与 table 的职责区分 | 原始定位缺失；仅作候选语义 |
| `index=3` | 《中文技术文档写作风格指南》涉及语言、标题、段落、列表、表格、图形、引用、缩略语、数字、单位和中英文混排；作者说明它是综合参考 | 原始定位缺失；不可视为权威标准 |
| `index=4` | GB/T 15834-2011《标点符号用法》作为标点机械规则参考 | Chat 原文未提供 URL；现行状态需以官方标准平台核查 |
| `index=5` | GB/T 15835-2011《出版物上数字用法》作为数字表达机械规则参考 | Chat 原文未提供 URL；现行状态需以官方标准平台核查 |
| `index=6` | SI / GB 3100 作为单位参考 | Chat 原文未提供 URL；具体采用范围需核查 |

## 已登记的 supplemental 来源

本轮独立读取并登记 5 个官方页面：Google 的标题、列表、表格、段落结构，以及 Microsoft 的内容扫描性。逐源主张、访问日期、读取范围和重访条件见 [catalog](../../provenance/writing-structure-20260927/catalog.json)，可消费的说明见 [结构写作提炼](../writing-structure-20260927/README.md)。它们补充特定语义，不恢复原 Chat 的引用身份。

本批未核实《中文技术文档写作风格指南》、GB/T 15834、GB/T 15835、SI / GB 3100 的原引用或标准适用性，保留名称作为待查线索，不宣称现行状态。原网页及呈现依赖未快照；Microsoft 只采用实际可见正文，授权提示之外的内容未核查。

## 可携带的最小候选

以下语义按主张区分已登记补充证据与待核实范围，不替代本仓库采纳裁决：

1. 标题、heading 和段落应优先表达语义与导航，而不是只承担视觉样式。
2. 段落先给中心信息；list、table、description list 按内容关系选用，并保持同级结构平行。
3. 规则需要分成可强制的机械 lint 与需要判断的 grammar；外部 style guide 是参考层，项目自身规则优先。
4. 单位、数字和标点需要记录具体标准、版本与适用范围，不能用 Chat 中一句“现行”替代来源卡。

上述语义仍是 distilled candidate；本批不修改 `kit/docs`，也不把 Chat 占位恢复为已验证引用。
