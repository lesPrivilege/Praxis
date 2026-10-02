# 原子方法：按问题选读

description：当需要拆解构成关系、选择少量对照或判断复用边界时，从这里选一页；不要求顺序阅读。

状态：可选校订意见，2026-10-02。尚未实现demo、执行eval或修改产品repo；后续调协与打样由Opus决定。不是schema或待执行任务清单。

## 最重要的校订方向

- 把grammar解释为有目的的构成关系，允许在profile、primitive、composition、recipe与样例之间双向追溯和多对多关联
- recipe说明目的、关系和条件；不把整张完成稿封装成必须复用的组件大包
- 输入、状态、工程检查和taste判断分开；一次漂亮样例不能直接证明通用性

## 只打开当前有用的一页

| 当前问题 | 入口 | 读到哪里可停 |
|---|---|---|
| 关系怎么拆，profile与recipe怎么互相解释 | [关系与粒度](atomic-relations.md) | 能说清一条关系及自由度即可 |
| 同内容改grammar，或同解释跨媒介，怎么少量比较 | [两轴小矩阵](atomic-relations.md#3-两个正交方向采用稀疏小矩阵) | 找到一个实际不确定性；不填全排列 |
| 动效/材质该保留什么，自动与人评如何分开 | [证据分工](atomic-evidence.md) | 找到当前声明需要的证据与边界即可 |
| 何时能复用，失败后改哪里 | [复用与反例](atomic-reuse.md) | 能限定复用范围或说明不继续的理由即可 |
| 后续需要一个打样起点 | [可选brief索引](../briefs/atomic-task-proposals.md) | 只取有用的一项，也可提出替代 |
| 要核验作者、工程机制或资产边界 | [12条来源ledger](engineering-sources.md) | 只查对应编号，不全量加载 |

[登记建议](../GRAMMAR_REGISTRATION_PROPOSAL.md)提供可删减的提问，不规定六字段schema。Description负责让任务触发入口，index负责路由，正文按需展开；不要为了可检索性把整个研究包前置到每个agent上下文。

方法证据起点：[Brad Frost的非线性模型](https://atomicdesign.bradfrost.com/chapter-2/)、[Every Layout的组合原语](https://every-layout.dev/rudiments/composition/)、[Storybook的状态样本](https://storybook.js.org/docs/writing-stories)。这些支持工作方法，不共同构成一套强制taxonomy。
