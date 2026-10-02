# Schema Engineering · 视觉语法探索登记

本批是对本机 `/Users/lesprivilege/Projects/Schema Engineering` 的只读探索，目标是为视觉语法 demo 找到可以作为一等语义、验证和演示对象的 Schema 选题。源仓库 `HEAD=adbd793d482a195f2d26cf7294c7f3a767cdec77`、分支 `main`；标准工作树无未提交或未跟踪变更。4 项被忽略的系统/缓存文件没有复制。

机器登记见 [`index.json`](index.json)，外部参考 URL 线索见 [`sources.json`](sources.json)。精选源文件按原相对路径保存在 [`vault/snapshots/local/visual-grammar-schema-20260928/`](../../snapshots/local/visual-grammar-schema-20260928/) 并在索引中记录字节 hash；快照目录自身提供 README，源 Markdown 不作为 Praxis 正文。

## 关键发现

1. Canonical 已把 Schema 放在提交链的承重位置：Schema 治理对象身份、关系、状态、效力与使用条件；Work Contract 为 schema validation、evidence check、authority check、completion/review routing 和 accepted-work-product 提供语义来源；JSON Schema 只承担数据形状约束。证据 ID 为 `SE-SCHEMA-01` 至 `SE-SCHEMA-05`。
2. Practice 把 Schema 与检索、Context Projection、Human Work Surface 分开：Schema 约束候选是否合法及其效力，检索负责定位，Projection 负责面向接收者编译工作集。证据 ID 为 `SE-PRACTICE-01` 至 `SE-PRACTICE-04`。
3. 实现层有可复用的确定性边界：reader 缺资产会 fail closed；译文必须绑定固定 source commit 与逐文件 hash；历史发布产物按 HEAD 字节复核。证据 ID 为 `SE-BUILD-01`、`SE-VALIDATE-01`、`SE-QA-01`、`SE-QA-02`。
4. `papers/src/practice-index.md` 的 PI-21 已给出 Schema、授权视图、类型/guard、事件溯源等成熟机制的迁移边界，并列出 V-21/V-22；本批没有把这些候选提升为技术栈或新 Kernel 对象。证据 ID 为 `SE-INDEX-01`。

## 建议施工选题

- `VG-SCHEMA-001 · Candidate → Committed gate`：用合成 Matter、Artifact、Evidence Relation、Authority 和 Completion 数据，渲染 `Current → Proposed → Validated → Committed` 的状态变化。正常路径提交一个有效候选；正常失败路径使用 [`normal-failure-stale-candidate.json`](normal-failure-stale-candidate.json)，以旧 `expected_state_version` 触发确定性拒绝，并证明 candidate 保留、canonical state 不变。验收重点是 schema validation、Evidence/Authority 门、候选与正式状态隔离和可恢复事件记录；它是开放起点，Opus 可自由选择技术栈、视觉语法、运动/效果和状态数量。
- `VG-SCHEMA-002 · Authorized projection + review surface`：从同一 canonical state 生成 Model Context、Reviewer Packet、Retrieval Index 三种视图，保持对象身份、版本、来源和效力一致，同时按 purpose/authority 改变披露范围。应演示旧版本命中不能升级为当前事实、未经授权的跨 Matter 派生值不能穿过边界，以及 reviewer 能看到 delta、evidence、uncertainty、consequence 和 authority。它是开放起点，Opus 可自由决定技术栈、视觉语法、运动/效果和 projection/fixture 数量；本批只提供语义契约和反例。

## 缺口与待裁决

- 本批未修改 Schema Engineering、没有创建 `demos/`，也未把任何论文主张写入 Kit、ADR 或共享索引。
- 外部 URL 只从固定本地文件登记为线索；`sources.json` 中的 `identity-only` / `local-citation-only` 不代表本批重新访问或验证了网页正文。
- 论文概念验证章节仍标为未执行；本批只复核仓库已有的文档、构建器、校验器和 QA fixtures，没有声称 Work Contract、权限隔离或 accepted-work-product 已在该仓库中实现。
- Opus 自行决定是否将两个工单合并为一个视觉 demo、采用何种前端/数据实现、视觉语法和效果，以及是否把 stale-version failure 作为主叙事或只作为展开状态；Astra 只需核对材料边界与引用是否被准确消费。

## 验证回执

在源仓库只读执行了 `python3 papers/validate.py` 和 `python3 -m unittest papers/qa/test_reader_assets.py papers/qa/test_translation_gate.py`：前者通过 3 份中文源、14 项 reader 检查和 15 个历史发布字节检查；后者 11 项测试全通过。未安装依赖、未运行 build（build 会写入 dist）、未访问或发布外部服务。

源仓库中的 `AGENTS.md`、脚本和外部 URL 均只作为材料读取；其中命令和规范没有被当作 Praxis 指令执行。原始快照不含客户资料、secret、`.git`、缓存或发布图片。
