# ADR-040：dsh-praxis 的来源闭环

日期：2026-10-25。状态：accepted（用户指示按五项施工：resolve 带 URL 与定位、consume 记实际读过的来源、项目内来源索引按引用登记、成批 capture、每页的来源只在一处；并说明 Praxis 是名册与整合包，不是 skill，每条来源要让人和 agent 知道为何收录、服务哪些任务、怎样消费，不能静默消失）。主会话（Claude Opus 5.5）设计、实现并验证；DSH 宿主能力由一名 Sonnet 代理只读调研，结论经主会话抽查。

## 问题与依据

施工前的仓库状态：

- 5 条运行记录都是 0 来源、0 挂载，其中一条标题就是“取用 Design 外部参考改版”。参考是从单元正文的链接读的，绕开了挂载；history 里没有一次来自真实工作的 capture、curate、refresh 或 review。
- resolve 给的素材只有挂载 ID、标题和概要，不带 URL；要再调 `praxis_source` 才拿到原件地址与摘录定位。
- Kit 页面正文引用了 45 个已登记来源的卡片，这些来源的记录上却没有这一页，resolve 与控制面都看不到。
- registry 构建脚本只为带 `registry_extensions` 的 catalog（图谱、百科、SaaS）带出 `grammar_paths`。挂到其他来源上的关系写进了 catalog，却在重建时被丢掉：调用成功，挂载消失。
- capture 一次一条，只写进 vault 的收录 catalog。Jev 专章五条探索线的 236 个来源因为“材料留在 jev/”的裁定，进不了名册。

## 决定

- **名册对人和 agent 都要说清每条来源。** `praxis_source` 和控制面的来源条目给出：
  - 原件与摘录定位；
  - 它所在的集合为什么收录：登记写明的用途，或 catalog README 的入口段；
  - 用 capture 收录时，当时的任务；
  - 挂在哪些页面，经这些页面服务哪些任务类型；
  - 哪些运行读过它，各交付了什么产物。

  没挂到页面的来源照样在名册里，可搜索，可登记为读过。
- **resolve 把去原件的路交出去。** 每条素材带：
  - source ID 与原件 URL；
  - 证据状态与读取范围；
  - 最多 4 条摘录，每条有定位与说法；
  - 本地快照路径与来源卡。
- **consume 记读过的来源，挂载由它推出。** `sources` 收来源 ID；记下的挂载是“读过的来源 × 读过的单元”之间的那些，任一边改了，这次运行列为过期。`bindings` 参数去掉。
- **每页的来源只在一处：来源自己的记录。** 关系是记录上的 `grammar_paths`，所有记录形态都带进 registry，包括：
  - provenance catalog；
  - references catalog；
  - 读物 intake；
  - 整包 intake。

  `curate` 先确认记录找得到再写，找不到就拒绝，不再静默丢失。Kit 页面正文引用已登记来源的卡片时，validator 要求这页在该来源的 `grammar_paths` 里。这次补上 45 条，分布在 14 个文件。手工排版的两个 catalog 用文本插入，不重排。
- **项目内的来源索引按引用登记。** `praxis_register_index` 在 [`vault/project-indexes.json`](../../vault/project-indexes.json) 记一条登记，内容包括：
  - 文件路径；
  - 字段映射，把名册字段对到项目字段名；
  - 状态值映射；
  - 按来源 ID 关联的主张文件（JSON Lines）；
  - 用途、边界、重访时机；
  - 挂载关系。

  项目文件由项目自己生成和维护，Praxis 原地读取、不写。所以这类来源的关系放在登记里，这是它们唯一的位置。项目来源没有来源卡，validator 只要求标题与定位。
- **capture 成批，写明任务。** `praxis_capture` 收一组来源与一个 `task`：
  - 全部核对后一次写入，任一条不合格整批拒绝；
  - 同一 URL 已登记的返回已有条目，批内重复也一样；
  - `task` 存成记录上的 `captured_for`（任务、操作者、时间）。
- **备份带上每个持有来源记录的文件。** 每个 catalog 与 intake 都算；项目索引带的是登记，项目文件随项目走。

## 验证

- `node --test` 25 项。新增与改写的覆盖：
  - 成批 capture：整批拒绝不落盘、去重、`captured_for`；
  - consume 推出挂载；
  - resolve 素材的原件信息；
  - 来源条目的用途、页面、任务类型、读过它的运行与产物；
  - 项目索引的登记、映射校验、关系写在登记、项目文件不变、再登记保留关系。
- [验收探针](../../scripts/check_praxis_acceptance.py) 13 项，新增 `source_loop`。它用真实的 registry 构建脚本与命令行、MCP 子进程，走一遍：
  1. 项目索引按引用登记，挂到单元；
  2. resolve 交出 URL 与摘录；
  3. consume 记下来源与挂载；
  4. 来源条目给出用途与运行；
  5. references catalog 上新建的关系经重建仍在。
- `python3 scripts/validate_repository.py` 通过，含新规则。
- 实测：Jev 研究登记按引用进入名册（`jev-research`，236 条，186 条带主张摘录），`projects/jev/` 下的文件未改。
- 控制面在应用内浏览器里检查了来源条目和登记表单，无控制台错误。

经过与覆盖边界见 [来源闭环回执](../verification/dsh-praxis-source-loop-20261025.md)。

## 没有做的

- 素材对交付有没有帮助，需要真实任务的对照，本轮没有测。
- 挂载说明有 76/78（Design）仍照抄来源概要，没有按位置改写。
- 补上关系后 328 个已挂载来源只有 7 个有快照，refresh 的覆盖没有补。
- curate 写手工排版的 JSON 时仍会重排格式。
- DSH 里的装载方式与入口另起一轮。
