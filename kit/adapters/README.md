# Adapter boundaries

| 边界 | 责任 |
|---|---|
| LLM | provider调用、结构化结果、失败和来源元数据 |
| Storage | 原件、版本、定位及访问接口 |
| Identity / access | actor、能力检查；demo persona明确标注 |
| Enterprise | 只读导入/人工上传起步；系统专有协议留在适配层 |

客户策略不得硬编码进通用组件，外部provider不得成为领域schema的所有者。尚无已实现adapter。
