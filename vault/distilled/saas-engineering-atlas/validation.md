# 验证与接收

从 Praxis 根目录运行以下命令，均使用 Python 标准库，不联网、不安装依赖、不触发 CI。

```bash
python3 scripts/validate_saas_atlas.py
python3 scripts/build_registry.py
python3 scripts/validate_repository.py
git diff --check
```

公共 registry 只由整合者生成。worker 本地可生成以检查，但只提交自己 package 的路径；交接标明这一点。结构 validator 检查 33 个 case ID 的一次性分配、source 引用、包边界、共同算法 ID、typed edge 端点、生命周期、claim 引用和必需失败检查；也接受包内新增案例。它不访问网站、不验证正文真实性、不执行业务状态机。

## 内容接收

人工沿一个案例走读：从谁的需要开始，为什么有这个对象，什么权限和证据允许变化，页面显示的是何种事实，后端如何持久化，外部如何确认，算法怎样得出结果，失败后谁负责恢复。随机挑一条 provider 主张，必须能由 claim ID 回到公开 primary source 的具体章节。种子 URL 的可访问性和完整内容尚待逐源研究。

一个案例至少有 happy path、duplicate、out_of_order、concurrency、tenant_isolation、unknown_outcome、recovery 七类检查定义。它们只是验收设计；执行者应另行提供固定 fixture、实际观察、日志/截图或对账数据。不能用预期结果填写实际结果。

## 后续 demo 的执行边界

本地 Claude 建立实现后，分别记录纯计算检查、状态与持久化检查、provider sandbox integration、端到端 UI、故障注入、负载与恢复。合成 stub 的成功只说明 stub 路径可运行；真实网络 timeout、重复事件、跨租户读取与到账结果需要各自证据。没有测试账号、外部文档或专业复核时，记录具体缺项而不是自动扩大授权。

AI eval 如适用，要冻结输入、标签标准、模型/配置与样本分母，设置独立留出集，并观察错判带来的业务后果。没有 AI 决策的案例写不适用，不为了“AI SaaS”名称插入不必要模型步骤。

## 分包和集成检查

worker 对照 `git diff --name-only <checkpoint-sha>...HEAD` 检查文件所有权。父线程在整合时检查每包 source review 与公共 source ID 的一致性，保留新证据与旧结论差异，再统一重建 registry。来源正文不复制到 Git；公开交付仅包含原创解释、合成对象、公共 citations 与必要元数据。

本轮执行结果与未运行项见 [验收回执](../../../docs/verification/saas-engineering-atlas-20261014.md)。
