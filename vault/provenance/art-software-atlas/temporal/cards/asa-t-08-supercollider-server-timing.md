# ASA-T-08 · SuperCollider：Scheduling and Server Timing

原始 URL：[SuperCollider 3.14.0 Help](https://doc.sccode.org/Guides/ServerTiming.html)

## 来源摘要

SuperCollider 官方指南区分 logical time 与 physical time，并解释在 OSC bundle 中附带时间戳、使用 latency 让服务器按目标时间输出事件的排程方式。它以低效演示说明同时请求仍有执行/传输抖动；在示例里为两路事件加入相同 latency，可令服务器收到相同时间戳。文档建议实时输入与序列排程选取不同的 latency 策略。

## 可支持与边界

支持文档里的时钟概念、bundle/latency 机制与示例条件，不是对任一机器/网络/声卡的性能承诺。“perfect timing”只复述示例语境，实际同步仍需目标环境测量。本次未执行指南代码，也没有听到任何输出。

## 阅读位置与用途

“Latency”段落的 logical/physical time 区分、成对 Routine 例子与末尾应用建议。供 [score and time](../../../../../kit/design/motion/score-and-time.md) 和 [rule systems](../../../../../kit/design/motion/rule-systems.md)；[CHANGELOG](../CHANGELOG.md)。
