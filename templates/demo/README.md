# Demo repository blueprint

未来demo按职责建立 `apps/web`、`services/api`、`packages/ui`、`contracts`、`scenarios/<id>`、`adapters`、`tests`、`infra`。

先完成scenario与contract，再选具体运行栈。不要因蓝图有目录就创建空基础设施。客户overlay留在scenario，共享代码通过Kit的晋升规则进入上游。

起点：[场景模板](../../scenarios/_template/README.md)、[Kit契约](../../kit/contracts/README.md)。

使用Kit参考时，在项目index记录`reference_id / revision / fixture / change / result / evidence`；支持、挑战或扩展的观察按 [参考生命周期](../../docs/governance/reference-lifecycle.md)提炼回流。没有有效增量时无需为打卡重复原卡片。
