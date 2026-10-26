# P05 交接

交付分支：`cloud/saas-atlas-commerce-property-20261014`。基线：`ae1827f34c6df067348d2454d7e5c9331ceda25d`。已完成内容提交：`01c651041f4516f5e886db73c977cd987a0639e0`；本交接记录随后单独提交，最终分支 tip 与远端核对结果见交付消息。内容提交包含五例、共同模型、证据与可执行检查，后续元数据提交不改变案例机制。

写入路径仅为 `vault/distilled/saas-engineering-atlas/packages/commerce-property/`。未合并 main，未修改共享索引、其它包、CI 或部署，也未创建 PR。

## 可直接消费的交付

- [共同概念模型与阅读入口](../../../../../projects/books/saas-engineering/packages/commerce-property/README.md)：承诺、资源、履约证据和资金记录分别确认；说明 UI、权威服务与可恢复动作之间的关系。
- 五章完整正文与对应 topology JSON：[V04](../../../../../projects/books/saas-engineering/packages/commerce-property/V04.md)、[V05](../../../../../projects/books/saas-engineering/packages/commerce-property/V05.md)、[V06](../../../../../projects/books/saas-engineering/packages/commerce-property/V06.md)、[V15](../../../../../projects/books/saas-engineering/packages/commerce-property/V15.md)、[V16](../../../../../projects/books/saas-engineering/packages/commerce-property/V16.md)。合计 14 道条件变化练习及短答案，66 条端到端/领域检查定义。各例按识题、解法、演算、验算与变式建立理解，主要机制均有识别线索与具体后续探索方向。
- [证据](evidence.json)：复读 10 个既有 source ID，补充 12 个官方 URL；22 份逐源 review，46 个本地主张，其中 source_fact 25、synthetic 19、inference 2。旧 source ID/provider 名保留；外部 claim 别名在 `source_claim_id` 中保留。
- [合成检查脚本](synthetic_checks.py)、[实际输出](synthetic-results.json)、[验证边界](verification.md)、[命令回执](validation-results.json)、[变更记录](CHANGELOG.md)。

主编为 Codex；三名继承模型作者分别负责 V04/V05、V06、V15/V16，文件所有权互不重叠。精确运行模型未暴露，未声称使用 Luna/Astra。实际分工详见变更记录。

## 实际验证

| 命令或动作 | 结果与范围 |
|---|---|
| `python3 scripts/validate_saas_atlas.py --self-test` | pass；含 H01 与本包五例共 6 个结构案例，8 个故意损坏输入被拒；只验证结构契约 |
| `python3 scripts/validate_repository.py` | pass；目录、Markdown 链接、JSON、已登记快照 hash、既有 registry 等仓库检查 |
| 在内存调用 `scripts.build_registry.build()` 与现有 registry 比较 | 相同；遵守只写本包的边界，没有重写公共 registry |
| `python3 vault/distilled/saas-engineering-atlas/packages/commerce-property/synthetic_checks.py` | 16 项通过，含 819 组有限分配输入、错误算法反例、非法状态拒绝、SQLite 旧版本竞争和回滚/重开/唯一键检查 |
| `git diff --check`、改动路径检查 | 通过；仅本包路径 |
| 逐例人工走读与引用审计 | 复算例子及 14 道练习；核对状态权限、typed edge 方向、生命周期权威/存储、source_fact 对应 review 和正文 claim 引用 |

曾发现的真实问题保留在变更记录：初次章节尚未生成导致 10 条失效链接；人工审读纠正未发货取消退款必须独立于退货、影响分析要按 derived_from 反向邻接、全程同房要保护实体房区间、已签未来租约要先占独占时段。不能把这些未完成或被修正的尝试改写成从未出错。

子代理还分别运行了逐例 `validate_case` 与空白检查；住宿作者额外运行 10 项内联日期、容量与金额断言。这些不是额外的真实集成覆盖，持续可复现入口以包内脚本为准。

## 证据边界与剩余工作

公开文档章节已实际重读，没有未读页面被用来支持 source_fact。材料没有全文快照；只有定位、范围、原创概括和公共链接。Mews 的旧 `MEWS_POS` URL 跳转到 docs.mews.com，保留旧 ID，并在 review 记录实际读取地址。直接下载 Mews 的一次尝试收到 403，随后通过网页工具成功读到所需正文；未采用的帮助页空解析/错误不构成已验证证据。

这里的“已完成”指教材交付。未实现或执行网页、API、provider sandbox、支付/退款、KDS/打印机、真实 PostgreSQL、缓存授权、进程崩溃、负载或 AI eval。性能均为待测目标。SQLite 只验证合成本地事务，无法证明银行资金或生产并发。V16 没有住宅押金产品集成证据：IWMS 支持类别范围，Dynamics 365 支持工单/预约；押金政策明确为案例构造，法律、税务、会计和真实合同规则仍待具体实施项目确定。

无审批待办、无被拒的写入动作、无不确定的外部业务操作、无阻塞交付的问题。

## 跨包建议与父线程裁决

1. 将包内 12 个新 URL 按 canonical URL 去重后并入全局来源。保留已有 10 个 source ID，以本包 review 新增核查历史，不覆盖旧的 seed-only 历史；本包局部 claim ID 与 `source_claim_id` 同时保留，避免把局部案例设计提升成产品事实。
2. 更新总 README、learning-path 和 case-index 的可用状态，再统一重建 registry。这些共享文件本包未改。状态迁移只表示教材可读，不表示应用实现或 Praxis 规范已采纳。
3. H01/P01 可接 V04 的部分履约与净资金桥；净支付、净结算和利润不可合并。V05 的金额分摊可借用 V04 的守恒，但不能按付钱份额重复制作食物。
4. V20/P02 可复用 V16 的一工单多 booking 与独立经理验收；只迁移完成证据，不能继承住宅进入许可、租约或押金规则。
5. V07/P06 可接 `TR:V15:V07:version-impact`。源版本沿 typed edge 原方向回查，下游影响用反向邻接；可达不代表已返工、已放行或已获商业批准。
6. X01/P03 统一 SaaS `tenant_id/org_id` 与业务 `party_id/tenancy_id` 的区别。物业中一个承租人可以跨多个 tenancy，不能以人的 ID 或房号代替账户隔离。
7. V06→V16 保留半开区间、资源承诺与实际交接的区分；房晚计价、酒店换房和长期独占权有各自前提。入住、退房、工单关闭、账单关闭和押金结清不能统一成一个 `completed` 枚举。

本地 Claude 可自由改写正文、实现 HTML 与 motion。建议每个交互同时展示业务对象和确认依据，用一个失败输入改变可用动作；保留 source IDs、case IDs、单位、合成标签及尚未确认的结果。文中技术栈为带理由的候选，不约束后续实现选择。
