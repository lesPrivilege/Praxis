# Enterprise Product Grammar

## 核心句法

对话把企业工作面压缩为：

```text
List → Detail → Action → State change
```

“页面像不像后台”不是重点；重点是用户能否看清对象、采取受约束的动作、看到状态变化，并回查依据与责任（T4/A）。

## 前端 grammar：看什么、改什么、做什么

| 语法单元 | 表达的业务含义 | 测试/演示时应观察 |
|---|---|---|
| List / Table | 一批对象 | 搜索、筛选、排序、分页、批量动作、状态 |
| Detail | 一个对象的完整上下文 | 基本信息、关联对象、附件、历史 |
| Form | 创建/修改对象 | 必填、校验、枚举、依赖关系、只读字段 |
| Drawer / Modal | 不离开当前任务的局部动作 | 上下文是否保留、取消/提交是否清晰 |
| Tabs | 同一对象的不同视角 | 基本信息、合同、风险、操作记录是否可回查 |
| Status / Badge | 当前状态 | 与允许动作、下一步是否一致 |
| Action | 用户可执行的业务动作 | 提交、审批、撤回、升级、关闭及禁用原因 |
| Timeline / History | 对象如何到达当前状态 | 谁、何时、做了什么、结果 |
| Attachment / Evidence | 判断依据来源 | 能否定位原文和版本 |
| Exception / Alert | 需要人的 attention | 严重度、原因、建议、升级入口 |
| Dashboard | 管理视角的对象聚合 | 不把聚合指标误当成工作对象本身 |

建议的最小企业工作面是“一批对象列表 + 一个详情页 + 一个明确动作 + 一个状态变化 + 一条可追溯记录”（T4/A）。这是一条设计启发式，不是所有场景的完整验收标准。

## 后端 grammar：记住什么、允许什么、改变什么

| 词汇 | 解释 | 示例 |
|---|---|---|
| Entity / Object | 被处理的业务对象 | Supplier、Contract、Invoice、Matter、Claim |
| State | 对象当前处境 | Draft、Submitted、Under Review、Approved、Rejected、Closed |
| Action | 触发变化的动作 | create、submit、approve、reject、request_changes、close |
| Actor / Permission | 谁有权执行动作 | Applicant、Reviewer、Legal、Finance、Manager、Admin |
| Rule | 动作的前置条件或分支 | 金额、地区、风险、主体、权限、必备材料 |
| Event / Audit | 变化留下的事实记录 | who / what / object / when / basis / result |

合同例子（回答中的示例）：

```text
Contract #123 · Draft
  --Submit for approval（金额超过某阈值）-->
Under Review
  --event: ContractSubmitted-->
```

示例中的具体金额仅用于说明规则结构，不能作为客户政策事实。

## Workflow grammar：对象跨角色流转

```text
Supplier submits
    ↓
Procurement checks completeness
    ↓
AI checks documents
    ↓
Compliance reviews exceptions
    ↓
Manager approves
    ↓
Supplier activated
```

可复用的流程形态包括：

- **Sequential**：A → B → C；
- **Conditional**：按风险、金额或规则分支；
- **Parallel**：并行处理，等待全部或指定结果；
- **Human-in-the-loop**：AI 或规则执行后暂停，等待人决定；
- **Escalation**：超时或高风险升级；
- **Retry**：外部依赖失败后重试；
- **Compensation**：后续动作失败时执行补偿/回滚。

这些是回答中用于读懂 BPM、审批和 Agent workflow 的通用词汇（T4/A），并不表示 Kit 现在应引入某个 workflow engine。

## AI worker grammar

AI 在企业系统中是 worker 类型之一，核心链路可以写成：

```text
Entity
  → AI interpretation
  → structured result
  → rule / human review
  → state change
```

常见 AI 动词：

```text
Extract    从材料得到字段
Classify   判断类别
Compare    比较对象
Check      按规则找异常
Summarize  压缩上下文
Draft      生成可编辑初稿
Recommend  提供候选判断
Retrieve   找到相关证据
Explain    解释异常与依据
```

这些动作不等于自动批准；在本对话的候选模式中，AI 输出应回到规则或人，留下证据和 trace（T4/A、T9/A）。

## 法律/金融对象语法

### 合同

```text
Matter
 └── Contract
      ├── Party
      ├── Clause
      ├── Obligation
      ├── Risk
      ├── Evidence
      └── Approval
```

候选动作：extract、compare、flag deviation、redline、approve、escalate、track obligation。

### 付款/发票

```text
Supplier
  └── Contract ── PO ── Goods Receipt ── Invoice ── Payment
```

候选动作：match、reconcile、check、flag、approve、pay。对话明确提出“ERP 仍是账本，AI 更适合 reconciliation/exception layer”（T5/A）；这是产品边界建议，不是对任何客户系统的事实判断。

### 供应商准入

```text
Supplier → Document → Qualification → Risk → Review → Decision
```

候选动作：submit、extract、verify、request supplement、review、approve、reject。

## 九问验收法

跑一个 demo 时可依次问：

1. **Object**：正在处理什么对象？
2. **Context**：对象需要哪些信息和关联对象？
3. **State**：对象处于什么状态？
4. **Action**：用户为何来到这里，可以做什么？
5. **Rule**：什么情况下动作允许或不允许？
6. **Evidence**：判断依据在哪里？
7. **Human**：什么时候必须交给人？
8. **Trace**：执行后留下什么记录？
9. **Next**：结果流向哪里？

这九问来自 T4/A，可作为测试清单候选。若 demo 只有“上传 PDF → AI 输出一段文字”，则只展示了模型能力，尚未表达完整的企业 work product grammar（T4/A）。

## 待核实与边界

- 上述对象、状态、动作是跨场景候选词表，不代表所有客户都采用同样命名。
- 需在 Kit 中决定是否统一英文 canonical name、中文显示名和客户别名；本线程只提出 grammar 需求，没有命名治理决策。
- 需用实际 demo 验证 Evidence、Audit、Permission、Exception 是否都能被 worker 使用，而不是只在页面上存在。

## 来源

核心 grammar：T4/U、T4/A。  
跨场景 AI/审查闭环：T2/A、T5/A、T9/A、T10/A。

