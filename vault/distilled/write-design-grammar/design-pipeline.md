# Design grammar 的 explore、裁决与蒸馏链

状态：`candidate`。来源为 `6ab64deb-7870-83ec-8e5c-0f78ccd7340b`，主要证据是 turn `bbb219f1-346d-47e8-ae83-50f30b446f83` / assistant item `642af881-392e-4183-823b-690570044254`，以及 turn `bbb21cd2-49df-459f-a885-28d046c3ed2a` / assistant item `af13d493-8c58-4c3d-82ae-c98c9eb556d8`。

## 角色分工候选

对话提出一条可替换模型的资产链：

```text
External world
      ↓
Luna: observation / snapshot / index
      ↓
Astra: scope / admission / decision
      ↓
Opus: enumeration / specimen lab
      ↓
Astra: selection / normalization / promotion
      ↓
Registry: grammar + specimen + selection rule
      ↓
Future agent: retrieve → compose → render
```

Luna 的索引应优先降低下一次探索成本，保留 reference ID、category、why it matters、notable patterns、useful for、distinctive points、caveats、source 与 snapshot date；索引提供召回路径，不把观察直接写成规范。

Astra 决定内容进入 Write、Design 或其他层，区分 stable grammar、temporary choice 与 reference，检查重复、开放问题和 promotion/demotion。Opus 的 specimen lab 可以最大化 composition diversity；固化时才最小化 grammar。

## Registry 的语义层级

对话建议 Registry 停在可组合的 content atom，而不是 icon、divider、badge 等 UI 组件：

```text
Atom → Pattern → Composition
```

每个 grammar 至少记录 `grammar_id`、`semantic_job`、`input_shape`、`visual_structure`、`encoding`、`variants`、`use_when`、`avoid_when`、`content_limits`、`annotation_rules`、`failure_modes`、specimens 与 render targets。示例 atom 包括 evidence excerpt、comparison row、timeline event、source note；pattern 可以是 annotated-evidence、metric-with-context；composition 可以是 evidence-led-section、operating-review。

Specimen 需要区分 `canonical` 与 `expressive`：前者安静、通用、默认生产可用；后者更大胆，提供探索上界。Registry 默认召回 canonical，只有任务需要时才请求 expressive。

## 当前缺口

本批没有 Opus specimen 文件、canonical HTML、fixture 或第三方 reference 快照。初次消费后的按语义职责描述展项由 [ADR-015](../../../docs/decisions/015-kit-editorial-contract.md) 收敛；本轮 [ADR-016](../../../docs/decisions/016-progressive-kit-structure.md) 只把检索入口落到真实的 Write/Design 分支和分用途 references。完整 Atom/Pattern/Composition schema、canonical/expressive specimen 库和通用 renderer contract 仍留作候选，由实际产出触发。没有因为对话提到 Opus、Flash 或 Remotion 就声称它们已施工或已验证。
