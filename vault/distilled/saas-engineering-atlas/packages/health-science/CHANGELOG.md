# P04 变更与执行记录

## 2026-10-14 · 建立独立交付检查点

- 起点：`ae1827f34c6df067348d2454d7e5c9331ceda25d`，来自 `cloud/saas-engineering-atlas-20261014`。
- 工作分支：`cloud/saas-atlas-health-science-20261014`；只写本包。未修改共享索引、CI、部署或 main。
- 已读取仓库维护与成文约定、atlas 契约、案例示范、标识与关系类型，以及本包来源种子目录。
- 首个检查点保存共同概念模型。V01/V02/V03 研究、正文、结构与验证仍在进行；本记录不表示案例已经交付。
- 分工：主代理负责共同模型、V01 与整合；两个继承模型的独立作者分别负责 V02、V03；`gpt-6-luna` 负责 V01 标准来源探索。模型未由运行环境确切报告的角色不补写猜测名称。

## 2026-10-14 · 教材、证据与验收整合

完成三篇原创教材及配套结构：V01 31 nodes / 48 edges / 5 lifecycles / 12 checks；V02 24 / 39 / 8 / 13；V03 27 / 62 / 13 / 14。三例各有三道变式，给出识题线索、已知解法、演算、验算和实用探索入口。共同模型与稳定 ID 供本地 Claude 在 Praxis 内继续编订及制作互动 HTML/motion，不限制视觉或代理编排。

证据合并为一个 `evidence.json`，移除临时 `evidence-v01/v02/v03.json` 侧车。保留 7 个公共种子身份，新增 21 个 URL；共有 28 个不同来源身份、30 条读取记录、58 条主张，其中 source_fact 33、synthetic 21、inference 4。27 个来源读取了所列正文范围，DICOM overview 的正文未读成功（web 错误/HTTP 403）；它不支持事实主张，另读 PS3.18 作为独立补充。所有 source_fact 均在本任务回到 primary source，营销页限于厂商自述，标准不充当具体部署证明。未保存第三方原文或图像快照。

### 人工审阅与实质修正

- 主代理通读所有案例的手算、反例、正常/异常轨迹、练习与迁移，核对 source claim、provider 名称、合成假设和权限边界。
- `gpt-6-astra` 独立冷读并定点复核。V01 原先只强调锁应收，补为同事务锁付款预算与应收，新增同笔资金分到不同应收的竞态反例；增加 payment-budget 状态，区分付款已全分配与应收未结清；维护累计索引消除脚本逐项扫描的 O(m²) 退化。
- V03 原模型批准直接标为 issued，补成 approved 与独立分发资格 gate，覆盖批准后、发出前的证据撤销；采集幂等键补齐 tenant、instrument、run、acquisition，并加入碰撞反例。
- V02 保留允许开放 query 下签署的产品配置反例，不把本例严格流程写成统一产品规则。V03 保留非药典 `c+U` 策略与 WHO 药典边界。独立复核确认上述原问题已修复，但没有扩大为生产验证结论。
- 子代理在回执与 handoff 尚未创建时运行过 repository validator，出现局部断链。回执和交接补齐后，最终整合验证 errors 为空。没有掩盖这次中间失败。

### 实际运行命令与结果

所有命令在 Praxis 仓库根目录执行，使用现有 Python 标准库，没有安装依赖。

| 命令 | 实际结果 | 边界 |
|---|---|---|
| `python3 vault/distilled/saas-engineering-atlas/packages/health-science/synthetic-v01.py` | 19 tests，0 failures / 0 errors，exit 0 | 进程内金额/身份/图模型，SQLite 操作日志重开，确定性旧版本写入与两种预算竞争次序 |
| `python3 vault/distilled/saas-engineering-atlas/packages/health-science/synthetic-v02.py` | 13 tests，0 unexpected failures / 0 errors，exit 0 | SQLite 签名/manifest/gate 模型；一次双线程合法次序与确定性两种次序，不是 PostgreSQL 证明 |
| `python3 vault/distilled/saas-engineering-atlas/packages/health-science/synthetic-v03.py` | 21 tests，OK，exit 0 | 校准/QC/OOS、谱系、完整身份、SQLite 重开、分发 gate 与仪器 stub |
| `python3 scripts/validate_saas_atlas.py --self-test` | pass；33 assigned cases、6 packages、63 shared seed sources、4 structured examples、8 negative self-tests | 4 examples 为 H01 与本包 3 例，未宣称全 atlas 33 例均已完成 |
| `python3 scripts/validate_repository.py` | pass；errors=[] | 目录、Markdown/JSON、链接、来源生成卡及既有 registry 一致性 |
| `git diff --check` | exit 0，无输出 | 已跟踪改动的空白检查；最终暂存时另作 `git diff --cached --check` |

三个合成套件总共 53 个测试方法。V01 3 个、V02 2 个、V03 1 个方法内 3 种 known-bad 策略，实际展示了错误实现与不变量冲突；不是“所有输入业务成功”。原始合成执行输出保存在 [synthetic-results.json](synthetic-results.json)。未执行真实 provider/API、UI E2E、PACS/仪器/银行、PostgreSQL 隔离、对象存储权限、负载、真实电子签名或 AI eval。V03 的 issued 在脚本里仅是分发授权后的简化标记，没有生成或发送文件。

`build_registry.py` 的 CLI 会写包外共享文件，因此采用相同 `build()` 逻辑的只读比较；没有写共享 registry：

```python
import json, runpy
from pathlib import Path
module = runpy.run_path('scripts/build_registry.py', run_name='atlas_readonly_registry')
expected = module['build']()
assert expected == json.loads(Path('vault/registry.json').read_text())
```

实际结果 pass；1017 source records、991 unique canonical URLs、127 distilled messages、229 citation mappings。包内来源尚未合入公共 catalog，须由父线程统一处理；比较通过不代表包内 21 个新来源已进入共享 registry。

另运行了只读包内引用核对：三例正文 claim 集合与 JSON/evidence 完全一致；33 个 source_fact 都能找到同 source ID、明确支持该 claim 的非 unverified review；21 个新增 canonical URL 不重复。人工公开披露检查与有限敏感模式扫描未发现原聊天、真实用户数据、凭据、私钥或带签名 URL。扫描不是通用秘密检测工具。

### 后续与交付

写入范围、内容检查点、远端核对及跨包建议在 [handoff](handoff.md)。共享索引、全局主线、其他 package、main、CI 和部署未改动。剩余工作属于真实业务实现与专业适用性验证，不是本轮教材的未完成章节。


## 2026-10-14 · 远端交付核对

完整内容提交 `ee38ac38a5719406074b062ff16f96b9ec55e872` 已推送至指定交付分支，远端 `git ls-remote` 返回相同 SHA。写入最终交接记录前再次运行 repository validator：pass，errors=[]；暂存空白检查 pass。此后只补交接与变更记录，具体最终分支 SHA 由完成消息及远端引用提供，避免把文档写成无法自指的提交标识。
