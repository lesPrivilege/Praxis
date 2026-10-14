# 验证与继续实现

从 Praxis 根目录运行，均使用 Python 标准库；这些命令不安装依赖、不访问外部服务、不触发 CI 或部署；企业机制测试会启动临时本机 HTTP 服务。

```bash
python3 scripts/build_saas_atlas_indexes.py --check
python3 scripts/validate_saas_atlas.py --self-test
python3 scripts/validate_saas_atlas_integration.py --self-test
python3 scripts/run_saas_atlas_checks.py
python3 scripts/build_registry.py
python3 scripts/validate_repository.py
git diff --check
```

来源编辑发生在包内 evidence；种子历史由 provenance 的 seed-catalog 保存。编辑后先去掉 `--check` 重建来源投影，再生成公共 registry。结构校验检验 33 个稳定案例、别名解析、typed edge 端点、生命周期、主张引用、失败检查定义，以及迁移图的方向、前提、反例与全案例连接。索引校验还逐字段比较原始 claims 和 reviews，避免合并时丢掉限定。

`run_saas_atlas_checks.py` 执行所有交付的合成脚本及包内验证器。它把命令、退出码和实际输出写到指定路径；不把 Markdown 的验收表算作已运行测试。各脚本的测试分母不同：有 unittest、有限输入枚举、纯函数断言和本地 SQLite 事务，不能把它们当成同一种生产覆盖率。

## 人工走读

先从入口找到一例，独立算出小输入的结果，再读短答。依次检查对象、权威、guard、界面反馈、持久化、外部确认与恢复；用一条迁移边替换条件，寻找会使旧解法失效的输入。来源抽查沿 claim ID → 原 evidence → review locator → 公共 URL 回查，URL 聚合不替代阅读具体范围。

## 后续应用的检查层次

| 层次 | 需要取得的证据 |
|---|---|
| 计算与状态 | 固定输入、实际输出、反例、版本与单位 |
| 数据库与恢复 | 真实数据库隔离、竞争、崩溃、重开与去重证据 |
| provider 接入 | 版本固定的 schema、sandbox 请求和可核对外部结果 |
| 浏览器端到端 | UI 命令至权威结果再到投影的证据，含键盘与错误恢复 |
| 负载 | workload、租户分布、冷/热缓存、延迟分位数与积压年龄 |
| AI eval | 冻结数据、标签、模型配置、分母、留出集、错判后果与拒绝条件 |

各例中的端到端表是未来实现的定义；真实测试执行另留回执。企业机制的两条本地工作链已分别通过 fake 与实际 loopback HTTP 适配器；其函数名中的 end_to_end 指这个合成实验范围，不表示浏览器或外部 provider 验收。无 AI 决策的案例不需要为了名称加入模型。专业同意、放行、信贷、保险、押金与财务政策按实际行业和法域继续确认。实际运行与缺口见 [验收回执](../../docs/verification/saas-engineering-atlas-20261014.md)。
