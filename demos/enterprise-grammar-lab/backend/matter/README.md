# 事项工作台 · 后端

[场景契约](../../scenarios/matter-workbench.md)的实现，挂在 [内核](../README.md)上，接口在 `/api/matter`。

| 文件 | 职责 |
|---|---|
| `store.ts` | 内存状态的形状，fixture 的自洽检查 |
| `domain.ts` | 规则、视图和四个动作；不涉及 HTTP |
| `scenario.ts` | 路由、批量指派的作业、一位按脚本并发提交的同事 |
| `matter.test.ts` | 场景契约第 3 节各情形各一项，20 项 |
