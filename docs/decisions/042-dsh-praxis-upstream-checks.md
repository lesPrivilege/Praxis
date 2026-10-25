# ADR-042：dsh-praxis 对照上游检查来源，写回保留原排版

日期：2026-10-25。状态：accepted。按 [下一轮工单](../../dsh-praxis/work-order.md) A4 中两项施工：refresh 只判断变化、写回不重排。依据是用户确认的设计原则：名册登记链接与功效，不收录原件正文，链接随上游同步。主会话（Claude Opus 5.5）实现并验证。

## 问题与依据

- **refresh 存全文。** 每次 refresh 把原件字节存进 `vault/snapshots/local/praxis`，再改 catalog 里的快照指针。这与“不收录正文”相反，而且只对 provenance catalog 的记录有效：references catalog 与项目索引的来源，快照指针无处可写。
- **打不开只是报错。** 抓取失败时 refresh 直接报错，什么也不记，链接失效发现不了。
- **写回重排格式。** curate 写手工排版的 JSON 时整份重新排版，上一轮补关系时有两个 catalog 只能手工插入。

## 决定

- **refresh 默认只记一条检查。** 检查写进 `vault/intake/praxis-captures.json` 的 `source_checks`，内容包括：
  - 时间、状态（ok 或 unreachable）、HTTP 码；
  - 内容 hash、大小与类型；
  - 失败时的原因。

  不存正文，也不写 catalog。
- **变化与失效从观察记录推出。** 对每个来源，把检查与保留的快照按时间排成一列：
  - 相邻两次 hash 不同，就是来源变了，挂载出现 `changed`；
  - 最近一次检查失败，挂载出现新的信号 `unreachable`，再次打得开时消失。
- **运行记的是内容 hash。** 来源的 `version` 是最后观察到的 hash；运行的 `sources` 记 `sha256`，stale 拿它跟当前比较。
- **`keep` 才存快照。** 原件可能消失、或要固定版本时，`refresh` 带 `keep: true`，另存一份快照：
  - 同样的字节不存第二份；
  - 快照指针以 intake 的最新一条为准，所有来源都能保留快照；
  - 快照清单照旧由 `build_snapshot_manifest.py` 从 intake 生成。
- **写回保留原排版。** `writeJson` 按文件原有的排版写回：
  - 数据没变的部分照抄原文；
  - 容器里原有的子项还在、顺序未变时，只替换变了的值，新子项用这个容器自己的分隔符接在后面；
  - 其余情况按原来是否单行重排这个容器。

  标准排版的文件写出来与 `JSON.stringify` 相同。

## 验证

- `node --test` 27 项。新增和改写的覆盖：
  - 首次检查是基线，不存内容；
  - 内容变了出现 `changed`；
  - `keep` 存快照，同样字节不存两份；
  - 404 出现 `unreachable`，恢复后消失；
  - 写回：手工排版只改动到的行，三种缩进的标准文件写出与 `JSON.stringify` 一致。
- [验收探针](../../scripts/check_praxis_acceptance.py) 14 项。`source_refresh_stale` 改为：检查不存内容，内容变化使读过它的运行过期。
- 仓库里由 store 写的 267 个 JSON 文件，原样写回逐字不变；在手工排版的 `cw-frontend-references` catalog 上改一个 tag、加一条关系，diff 正好两行。

**首轮检查。** 被任务类型取到的单元上挂着 12 个来源，其中 11 个有 URL，都检查了一遍，全部打得开。第一遍里有 3 个 Google 页面显示打不开，原因在本机：这里经 `HTTPS_PROXY` 上网，Node 的 `fetch` 默认不走代理。命令行与 MCP 服务是 Praxis 自己的进程，现在启动时调用 `http.setGlobalProxyFromEnv()`，与其他命令行工具一样走代理；DSH 插件运行在宿主进程里，不改宿主的网络设置。重新检查后都打得开，失效信号随之消失；失败的那几次检查留在记录里。

施工中发现并修正一处来自 ADR-040 的错误：部分 catalog 把说法写成 `claim_zh` 或纯字符串（分别 54 与 249 条），resolve 组装素材摘录时出错，technical-explainer 的 html 流水线在 `12105ed` 之后无法 resolve。现在三种写法都读出；适配层测试对真实仓库的每个任务类型与流水线跑一遍 resolve。

## 没有做的

集合类来源（作品集、组件库、动画库）随上游的增减淘汰需要按来源类型解析条目，本轮没有做。Design 挂载说明按位置改写，也在 A4 里待做。
