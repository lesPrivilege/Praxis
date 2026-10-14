# 并行研究工作包

父线程在 checkpoint 后派发；每包单独 branch，从同一 checkpoint SHA 开始。公共文件由父线程整合，包内路径互不重叠。实际执行者和模型在各包 CHANGELOG 记录；下表是任务槽位，不冒称已经启动 worker。

| 包 | 案例 | 唯一写入目录 | 任务 |
|---|---|---|---|
| [P01](./commercial-finance/README.md) | H01, H02, H03, V12, V13, V14, X02 | `commercial-finance/` | 交易、财务与资金 |
| [P02](./people-service/README.md) | H04, H05, H06, V17, V18, V19, V20 | `people-service/` | 人员、专业服务与接收 |
| [P03](./data-ai-control/README.md) | H07, H08, H09, X01 | `data-ai-control/` | 数据、文档、安全与 AI SaaS |
| [P04](./health-science/README.md) | V01, V02, V03 | `health-science/` | 医疗、临床试验与实验室 |
| [P05](./commerce-property/README.md) | V04, V05, V06, V15, V16 | `commerce-property/` | 消费履约、住宿与空间 |
| [P06](./industry-networks/README.md) | V07, V08, V09, V10, V11, V21, V22 | `industry-networks/` | 生产、资产、公用与供应网络 |

机器所有权见 [manifest](manifest.json)。六包覆盖全部 33 个案例，每例只有一个 owner。父线程负责跨包 transfers、共同词表、证据去重和全局导航；本地 Claude 在研究接收后消费案例，自由构建 HTML/motion。
