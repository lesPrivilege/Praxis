# Praxis 规范与抗折旧边界

## 来源与结论状态

用户在 r4 明确了两个治理目标：企业数据与 Coding Agent 隔离；稳定的企业工作语义应预先写成结构，避免依赖每次 activation 都重新推导（T1/U）。历史回答据此建议治理规则由 Expert/Kit/runtime 共同承载，Skill 作为局部执行入口（T1/A）。

“attention 权重”“后训练会吸收哪些隐性知识”“宿主 harness 怎样加载上下文”属于理论或实现假设。本文件只把它们作为待验证背景，不把它们写成模型事实。

## 规范层与消费层

### 当前 Praxis 规范层

Praxis 当前应承载长期、可迁移、与单一模型无关的工作契约：

```text
Expert owns responsibility
Kit owns the work world
Skill owns local procedure
Tool owns execution
Model is a runtime parameter
```

规范内容包括：

- 企业事实留在 Enterprise Workspace / Source Vault；Praxis 只保存方法、grammar、policy、schema、workflow、eval 和 synthetic fixture。
- `Event ≠ State ≠ Context`；状态变更以 provenance、diff 和必要的人审为入口。
- 数据、身份、凭证、模型、工具和外部发送有明确边界；policy 可以收紧，不因便利放宽。
- Expert 可以换 runtime，Workspace 才拥有事实；Skill 不复制整个 Kit。
- 从客户项目回流 Kit 必须经过 provenance 检查、脱敏、泛化、合成、leakage review 和独立 eval。
- 需要人判断的决定、冲突、承诺、高风险外发和破坏性动作进入 Review Space。

这些是当前 Praxis 文档应保持稳定的规范方向；它们不是 Courtwork runtime 已经实现的证明。

### Courtwork/runtime 的未来消费

Courtwork 可以在未来把 Praxis 作为一个 managed Expert 的输入，消费：

```text
Expert identity
  → Kit/context compiler
  → project policy
  → visible extensions/tools
  → model routing
  → review policy
  → handoff / run ledger
```

可能需要的 runtime seam 包括 Expert identity、workspace binding、tool restriction、policy enforcement、Review projection、run ledger、heartbeat 和 Expert handoff。它们属于未来实现与验证任务；本轮没有修改 Courtwork、创建 Expert、注册模型或安装 harness。

### post-training 的未来消费

如果未来将语义执行 trace 用于后训练或 eval，输入可包括：

```text
Task · Matter · Role · State · Source · Rule
Decision · Action · Exception · Review · Outcome
```

以及 context selection、tool calls、proposed diff、human correction、accepted result。训练消费必须受 data owner、脱敏、保留和授权 policy 约束；它不能反向改变当前客户事实，也不能把未来模型能力当作今日 runtime 依赖。

## 指令与权威层级

Expert→Kit→Skill→Tool 是产品职责层，**不覆盖宿主的 system/developer/user 指令层级**。它们也不能绕过平台安全边界、用户明确授权、项目 policy、账号权限或 runtime enforcement。

```text
宿主 system / developer / user 指令与平台边界
  ↓
仓库与项目的适用治理规则
  ↓
Expert contract
  ↓
Kit policy / environment
  ↓
Project-local policy
  ↓
Skill / workflow
  ↓
Tool invocation
```

这张图表达“产品治理不得越权”，不是重新定义宿主内部指令优先级。若不同层冲突，应停下并按宿主和项目既定规则处理；Expert 不得把 Kit 文档当成更高一级的系统指令。

## 抗折旧的判定

一项内容若在换模型、换 harness 或换 UI 后仍然成立，才适合进入 Kit 规范：

| 内容 | 适合当前 Kit | 留给未来 runtime / training |
| --- | --- | --- |
| 工作对象、状态、来源、权限、review contract | 是 | runtime 读取并 enforce |
| 企业/项目 data boundary 与 promotion gate | 是 | runtime 做检查和拒绝 |
| 某模型的 prompt 排列、上下文位置经验 | 仅作实验记录 | runtime/eval 验证 |
| 某 harness 版本、Profile API、GUI 热插拔 | 不作为稳定事实 | 版本核查和 adapter |
| 后训练能否吸收某字段/trace | 研究假设 | eval/训练实验 |

当模型变强，可能减少 procedural prompting；当 runtime 变更，仍需保留 policy/state/provenance；当后训练吸收某些行为，仍不能吸收当前客户的事实和权限。

## 最小验证闭环

未来若要把规范变成实现，应按这条顺序验证：

```text
Kit contract
  → synthetic fixture
  → runtime adapter
  → proposed diff
  → human review
  → run ledger
  → failure/eval
  → promotion decision
```

不能用“模型似乎遵守了 Skill”证明数据隔离，也不能用“仓库里有 AGENTS.md”证明权限 enforcement；需要可观察的 runtime 检查、失败案例和恢复路径。

## 未来治理建议

1. 将 Expert/Kit 层定义为产品 contract，将 system/developer/user 指令和平台权限明确列为上位边界。
2. 先以通用 runtime + Praxis Kit 跑出 governed trace，再决定 Courtwork Experts Core、extension 或专用 runtime 的实现。
3. 将 state/policy/provenance/review 作为长期字段；把模型、harness、UI 和 prompt 排列视作可替换实现。
4. 把 post-training 视为未来的 trace/eval 消费者，不把理论上的模型内化能力写成当前行为保证。
