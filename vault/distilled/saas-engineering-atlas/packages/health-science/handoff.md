# P04 交接

## 交付身份

- Package：`P04`，医疗、临床试验与实验室。
- 分支：`cloud/saas-atlas-health-science-20261014`。
- 精确起点：`ae1827f34c6df067348d2454d7e5c9331ceda25d`，源分支 `cloud/saas-engineering-atlas-20261014`。
- 早期已推送检查点：`af41aad8a305769df1a3753c3f3e3e37bc297886`。
- 完整内容与验证检查点：`ee38ac38a5719406074b062ff16f96b9ec55e872`；已 push，`git ls-remote` 返回同一完整 SHA。当前交接记录随后单独提交；最终分支 SHA 在任务完成报告中提供，也可按下方命令核对。
- 唯一改动目录：`vault/distilled/saas-engineering-atlas/packages/health-science/`。未合并 main，未修改共享索引、其他包、CI 或部署。

## 阅读与后续消费

[README](README.md) 从证据、决定与后果建立共同模型；[V01](V01.md)、[V02](V02.md)、[V03](V03.md) 以识题、解法、演算、验算与变式建立可迁移的解题方法。每例保留完整对象/权限/状态/UI与后端闭环、手算与反例、恢复路径、规模假设、技术候选、练习及进入陌生行业的探索方向。对应 JSON 保存稳定语义 ID、typed topology、并行生命周期与检查，供 Claude 在已有 Praxis 中编订和制作互动 HTML/motion；没有规定布局、动效或多代理编排。

本包可直接消费的事实来自公开 primary source；工程模型、权限策略、数值、算法、栈与性能目标均标明自身身份。来源种子仍用 `CTMS`、`EDC`、`LABWARE`、`FHIR_ORDER`、`FHIR_REPORT`、`DICOM`、`STRIPE_INV`，厂商名称未被地域分类或通用占位名替换。

## 规模与执行角色

3 个案例、82 个节点、149 条有类型边、26 个生命周期、39 项端到端检查定义、9 道变式；这些检查定义与实际跑过的 53 项局部合成测试分别计数。证据为 21 个新增 URL、7 个种子来源身份、30 条读取记录、58 条主张（33 source_fact / 21 synthetic / 4 inference）。27 个来源已读指定正文范围，1 个种子仍有正文缺口。

主代理编写共同模型和 V01 并整合；两个继承模型的独立作者完成 V02/V03；`gpt-6-luna` 承担 V01 来源探索，`gpt-6-astra` 承担独立冷读和修复后的定点复核。继承模型具体标识未暴露时不补写猜测。

## 证据、验证与边界

统一来源与主张在 [evidence.json](evidence.json)。每个已支持的 source_fact 均有本任务的阅读记录及具体 locator；DICOM overview 的读取失败独立记录，PS3.18 未冒充它的恢复全文。无第三方长文/图像复制、原聊天、真实参与者信息、签名下载地址或凭据。

各例检查及独立审阅裁决见 [V01 回执](review-v01.md)、[V02 回执](review-v02.md)、[V03 回执](review-v03.md)，完整命令与实际结果见 [CHANGELOG](CHANGELOG.md)。脚本是局部合成推理检查，不能证明真实 provider、UI、临床流程、电子签名、PostgreSQL、容量、负载或 AI 质量；这些层均未执行。V01/V02 给出有分母的 AI 辅助评估方案，V03 关键链不用 AI。

## 跨包建议与整合裁决

- `TR:V01:H01:adjudication-payment-separation`：裁决、到账与最终业务完成分别建模；H01 的付款开通 guard 不继承到诊疗处置。
- `TR:V01:V03:evidence-revision`、`TR:V02:V01:amended-evidence`、`TR:V02:V03:versioned-release`、`TR:V03:V02:version-bound-review`：共用版本绑定与影响查询，保留临床报告、研究签名、批次证书各自的专业权威和取样范围。
- `TR:V02:H08:scoped-authorization`：可复用作用域、动作权限与拒绝原因；研究同意的自主性、持续沟通不能简化为安全响应授权。
- `TR:V03:V09:dependency-invalidation`、`TR:V03:V10:equipment-eligibility`：依赖与设备状态可以迁移，测量不确定度、样品代表性和调查程序须另取证。
- `TR:V03:X01:scoped-evidence`：租户隔离贯穿库、对象存储、缓存、队列和导出；合法跨机构交接应显式建模，不能只共享一个 tenant 值。
- 同一“完成”必须带对象：付款全分配、应收收清、query closed、signature current、data locked、lot released、CoA issued 均不能合并成共同状态码。
- 父线程按 canonical URL 整合 21 个包内新增来源，保留源 ID 或显式 alias；补充主张用 case claim ID 满足当前 validator，种子 ID 不变。公共来源总表仍保持 checkpoint 状态，不能把本包已读记录自动视为共享总表已更新。
- 本包未修改全局学习主线、case-index 与 registry。整合者决定正文入口、来源去重、跨包关系和术语注册，并统一重建 registry。

## 剩余缺口

DICOM overview 正文未取回；公开在线资料没有做离线全文快照。标准定义不证明任何具体部署满足 profile 或实现全量服务。临床、研究伦理、药典/规格、电子签署和跨组织数据权限仍需针对实际场景的专业裁决。无真实账号、接口契约测试、端到端演示或性能测量；这不是阻塞本教材交付的缺失实现。

## 获取与复核

```bash
git fetch origin cloud/saas-atlas-health-science-20261014
git ls-remote --exit-code origin refs/heads/cloud/saas-atlas-health-science-20261014
git diff --name-only ae1827f34c6df067348d2454d7e5c9331ceda25d...HEAD
```

内容检查点包含全部教材、结构、统一证据、53 项合成检查及其输出。其后提交只记录这份检查点与交付核对。最终 diff 的全部 17 个路径均在本包范围内。
