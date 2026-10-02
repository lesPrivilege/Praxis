# 最小记录模板

这些是便于Agent交换的示例形状，可用Markdown段落、YAML或JSON保存。字段表示什么比文件格式更重要。空字段可以省略；不要为了通过schema而补造证据。下面所有记录均是模板或提案，不是经过验证的样例。

## Profile

```yaml
id: profile.example
version: 0.1
status: proposed
names: [主要检索名, 别名]
kind: [历史运动或学校, 文化标签, UI语言, 技术材质, 作者语言] # 仅选适用项，可扩展
scope: 具体时期、作者群、作品或媒介；无需宣称包住整个风格
claims:
  - statement: 来源实际支持的有限断言
    source: source-id 与精确URL或页码
    certainty: 来源性质与缺口的文字说明
interpretation: 从该断言推导到当前任务的软先验
latitude: 可自由偏离、混合、替换的解释
counterexample: 哪种例子能暴露这份解释的局限
links:
  - relation: supports
    target: grammar.example
    because: 哪个局部关系得到支持，不是全风格等价
```

`kind`允许多选，不是互斥taxonomy。`certainty`不是历史真实度的数字打分。颜色/圆角/字体/动效值可以在某个后续样例里出现，但不是profile必填项。

## Grammar 与 Primitive

```yaml
id: grammar.example
intent: 读者需要辨认何种关系
relation: A如何相对B组织，或状态如何随动作改变
scope: 哪类内容、媒介、状态适用
source_claim: source-id支持的内容，以及本条新增的推断
actionable_primitive: 一个可以局部替换或调节的做法
latitude: 参数、结构与解释的开放范围
constraint_refs: [任务契约或媒介目标中的具体约束] # 有需要才填
counterexample: 一种预期失配
```

Primitive可以是「共享对齐轴」「文字与辅助标记的层级差」「动作后的局部状态反馈」等局部构成。它不必是一个现成Button组件或一个颜色token。若primitive与grammar完全重复，合成一条即可。

## Composition 与 Recipe

```yaml
id: recipe.example
status: proposed
purpose: 为哪种内容与读者工作组织关系
uses: [grammar.a, grammar.b]
organization: 哪个关系主导，哪个局部辅助，各作用于哪一层
tradeoff: 得到了什么，同时可能牺牲什么
conflict_when: 哪种内容或条件下关系互相争抢
latitude: 可替换的成员、参数、profile解释
test_question: 一个值得用样例回答的问题
```

Composition记录一次具体组织关系；recipe描述下一次何时、为什么值得试这个组织。两者无需强行分成两份文档。不要把recipe等同「安装某个完整style theme」。

## Demo 回执

```yaml
id: demo.example
status: planned # 只能在实现与观察后改为对应实际状态
question: 这次要建立什么证据
uses: [grammar.example]
fixture: 内容文件、版本与合成或真实标记
implementation: 待Opus提供
observations:
  - check: 一个自动或人工检查
    result: not-run
    evidence: null
judgment: 待人评；不要用自动通过替代taste结论
limits: 尚未覆盖的内容、状态、媒介或人群
next: 保留、修订、再试或退役的建议
```

## 来源记录

每条来源保存：标题、作者/机构、URL、版本或访问日期、实际读取范围、是否看过实际图；支持什么、不支持什么；能引出哪种样例；授权或资产复用边界。来源失效保留身份和最后已知断言，不自动丢失来源链。
