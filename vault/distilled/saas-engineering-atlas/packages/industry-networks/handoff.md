# P06 交接

交付分支为 `cloud/saas-atlas-industry-networks-20261014`，精确基础为 `ae1827f34c6df067348d2454d7e5c9331ceda25d`。唯一改动范围是本目录。正文、拓扑和证据供父线程继续编订，本地 Claude 可自由重写、设计 HTML 和 motion；本包没有应用、真实接入或部署。

## 交付内容与证据边界

[README](../../../../../books/saas-engineering/packages/industry-networks/README.md)建立共同模型，V07、V08、V09、V10、V11、V21、V22 各有正文和结构 JSON。每例将运行状态、依据版本、权限、UI 反馈、计算、恢复与验收连成一条解释，并附改变前提的练习及短答。[evidence.json](evidence.json)区分 source_fact、inference、synthetic；公开来源只按实际读取范围支持主张。

[synthetic_checks.py](synthetic_checks.py)提供 Python 标准库的计算与 SQLite 合成事务检查；它不实现网络、现场控制、并发压力、完整 EPCIS、EDA、VEE 产品、UI 或 AI。仓库检查验证结构与本地链接，不证明教学系统已上线。

## 集成时保留的区别

- `design baseline`、`recipe` 和 `RTL baseline` 都绑定版本，但分别有设计适用、工艺执行和数字实现的证据要求。V07 与 V15 的商业变更也不能由技术版本更新自动批准。
- V08 的 `lot release`、V09 的 `release`、V10 的工作许可与 V22 的资源 `released` 不应合成一个通用“审批/释放”状态。尤其要保留 V08 外部旧解锁命令的版本约束和人工接管边界。
- V10 与 V20 可以共享 booking、执行确认和接受的对象关系；V20 的客户签收不能替代 V10 的现场隔离与投运确认。
- V11 与 V22 可共享发生时间、有效修订、计费依据及调整链。表计累计读数、VEE 估算、通信会话用量和套餐额度的单位与分母不同；V22 的商业计费区间与技术活跃区间必须分别保留。
- H01、H03、V07、V11、V21、V22 都需要保留账单、付款与调整的关系。V07 应收与 V21 运费应付方向相反；预付开通、赊销交付和后付通信的 guard 不能互相继承。X02 再加入内部交易方后，外部付款也不等于集团内部结算闭合。
- X01 可消费租户边界、操作身份和计量期间的区别，但本例合成主键检查没有测试真实认证、对象存储授权或网络域隔离。

父线程可从正文提取现有 `TR:<from>:<to>:<slug>`，再统一加入跨包 transfer registry；本分支没有修改公共 identifiers、relation-types、case-index、来源总表或 registry。新来源先按 canonical URL 去重，通用门户与真正读取的指南/标准不应被误合并为已核实的同一篇。

## 已完成的人工审阅

主代理逐篇走读七例及手算，另由 `gpt-6-astra` 独立冷读 README 与七篇正文。采纳了有条件供给与实物库存预留分开、外部旧放行命令、商业与技术区间分开、维护异常 episode 合并、超迟样本复核及共享许可说明的修订。未把局部文档事实扩展成厂商架构或行业合规结论。

实际命令和验证边界见 [CHANGELOG](CHANGELOG.md) 与 [validation-results.json](validation-results.json)；最终交付 SHA 以远端核对结果及父线程收到的最终报告定位。

## 数量、验证与剩余缺口

七例共 162 节点、290 typed edges、44 生命周期、71 条 E2E 检查定义和 16 道变式题。证据有 45 claims（25 source_fact、4 inference、16 synthetic）、11 新 source ID、30 条读取记录；24 个唯一一手来源支持所列主张。

实际执行通过：34 项可复跑合成检查、atlas 结构检查及 8 项损坏副本反例、仓库验证、内存 registry 相等比较、包级引用与所有权检查、Git 空白检查。`build_registry.py` 的 `build()` 在内存执行，未调用写公共 registry 的入口。71 条 E2E 是待实现的验收定义，与34项已执行检查的分母不同。

剩余来源缺口：SAP_PP_DETAIL、EPCIS 原门户、IBP、IBP_SAMPLE、TMF_DIR。MAXIMO 的原主机返回403但同文 canonical 正文已核查；SIEMENS_AI 是未消费的可选种子。来源全文未快照；API 完整 schema、产品部署版本和现场制度仍需后续研究。没有真实集成、UI、负载或 AI eval 结果，也没有运行、安装或部署障碍需要用户解除。

父线程下一步可先按 canonical URL 合并来源，再裁决上述对象差异与 transfer。教材输入的 SHA-256 在验证记录中；若 Claude 重写或实现，沿保留的 case/object/claim ID 重新记录语义变化与应用级验收即可，不必沿用本文的视觉方案。

## 精确内容 checkpoint

已验收的完整教材内容提交为 `5eaf15adc9436626286bd0a4f391d03b7ed6daec`。随后仅补充本页、变更记录和验证记录中的提交定位；17 个正文、拓扑、来源与测试文件的 SHA-256 保持不变。最终交付提交由分支远端 SHA 与最终报告定位，避免在提交内伪造其自身哈希。
