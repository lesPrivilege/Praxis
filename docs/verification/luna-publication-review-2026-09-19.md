# 公开发布范围复核 · 2026-09-19

本 receipt 是 Luna 对本次 Praxis 公开发布范围的只读检查。用户已明确当前不存在企业数据，并授权公开本人工作流；本报告采用该声明作为发布基线。公司名、法务示例、公开 URL 和产品名称本身不被误判为客户数据。原始 Chat 仍按“只供备查”处理。

## 范围与方法

只检查了本任务获准的 `README.md`、`AGENTS.md`、`CHANGELOG.md`、`.gitignore`、`docs/`、`kit/`、`scenarios/`、`demos/`、`templates/`、`scripts/` 和 `vault/`。扫描时允许范围内有 802 个普通文件；其中包括 10 个 ZIP。ZIP 清单、已解包内容、ZIP 成员中的文本/JSON/HTML/脚本，以及一个嵌套 ZIP 都作了静态读取；没有执行快照内脚本、HTML、验证包或外部连接，也没有上传任何文件。

检查包括：

- 高置信度凭据模式：AWS access key、GitHub token、`sk-` 类 key、Slack token、私钥块、JWT、Bearer 值、credential assignment、带用户名密码的 URL、长 base64 data URI。
- 联系方式与原始沟通文件：邮箱、手机号、`.eml`/`.msg`/`.mbox`/`.ics`/`.vcf`、录音和会议文件命名及内容线索。
- 本机路径：用户目录、临时 worktree、`/mnt/data` 等绝对定位，以及源清单中的原始路径字段。
- ZIP member 名称和内容；只记录类型、路径与数量，不输出疑似秘密或联系方式的值。

未读取或搜索并发目录 `wx-cli-again/`、`.obsidian/`，也没有把它们当作本次发布范围的一部分。`.gitignore` 当前已排除这两个目录。

## 结果

没有发现实际发布阻塞性的 credential/token：AWS、GitHub、OpenAI-like、Slack、私钥、JWT、Bearer、credential assignment、URL userinfo 和邮箱模式均为 0。手机号启发式有 6 个命中，全部位于 SHA-256 字符串片段，不是电话号码。没有发现客户邮件、会议原始记录、联系人文件、录音或视频文件；`vault/provenance/work-system/cards/n8n-gmail-hitl.md` 等只是公开产品文档摘要，不含邮件正文。

Downloads 选择登记明确把个人照片、简历/考试书/学术论文、恢复码及无关项目排除在快照之外；本次未发现这些被排除文件的内容。career-kit 当前复制的 10 个文件是入口和企业汇报图式规则，未发现简历、联系方式或投递记录，但其目录身份仍是个人求职仓库，因此按范围排除。

已识别的示例/测试材料没有被当成真实数据。例如 `scenarios/_template/` 明确要求 synthetic/public/redacted fixture；`vault/distilled/work-system/r3/environment-manifest.md` 中的 Client A/B 是抽象示例；`vault/snapshots/local/downloads/extracted-bsdtar/implementation-plan/courtwork-implementation-plan-20260910/evidence/core-client-lifecycle-result.json` 明确写明 synthetic workers、无真实 Core 数据库/provider。这些不是客户结果或凭据。

发现的是发布卫生问题，而非秘密：绝对用户路径共 700 次，集中在 `vault/snapshot-manifest.json`（348）、`vault/intake/local-projects.json`（231）、`vault/intake/downloads.json`（120）和 `vault/distilled/reporting/downloads.md`（1）。快照内另有少量临时 worktree、`/mnt/data` 和 `/path/to` 示例定位。它们应在公开 Git 中排除或改成相对/占位路径。

## 发布路径清单

### 可直接进入首轮公开提交

在当前用户基线下，以下是没有检测到真实秘密、联系方式或原始客户记录的维护面：

- `README.md`、`AGENTS.md`、`CHANGELOG.md`、`.gitignore`。
- `docs/**`、`kit/**`、`scenarios/**`、`demos/**`、`templates/**`。
- `scripts/README.md`、`scripts/*.py`（不含生成的 `scripts/__pycache__/`）。
- `vault/README.md`、`vault/references/**`、`vault/provenance/**`。
- `vault/distilled/**` 中的工作流、grammar、治理和合成 fixture 说明；其中下列两份需按下一节处理。

`vault/references/**` 与 `vault/provenance/**` 保存公开 URL、补充来源摘要和验证限制；它们不恢复原 Chat 隐藏引用，也不构成对历史回答全量背书。公开招聘页、厂商文档和上市公司公开报告按公开来源处理，不当作用户个人资料或客户内部事实。

### 应排除或先清理

- `vault/archive/chat/**`：原始 Chat 是备查材料。即使本次未检出秘密，原始对话和其中的工作上下文没有必要进入首轮公共仓库。
- `vault/snapshots/local/career-kit/**`：个人求职工作仓库的只读副本；当前 10 个复制文件未发现简历/联系方式，但目录用途本身要求排除。
- `vault/snapshots/local/courtwork/**`：本地产品工程/设计源快照。扫描未发现凭据、联系人或原始客户邮件；仍应在 Praxis 首轮发布中排除，除非另行完成上游许可、作者/项目范围和本机路径清理。
- `vault/snapshots/local/downloads/files/**`、`vault/snapshots/local/downloads/extracted-bsdtar/**`：Downloads 源材料及解包副本；未发现真实 credential/contact，但属于本地源快照。
- `vault/snapshots/local/downloads/archives/` 下的 10 个 ZIP：`FD-1产品官网设计稿.zip`、`Schema工作面排版架构典范.zip`、`CourtWork-harness-release-plan-2026-09-12.zip`、`CourtWork-review-24bd954-20260913.zip`、`courtwork-implementation-plan-20260910.zip`、`Courtwork 设计语言定稿.zip`、`版本设计语言的复用包体系.zip`、`CourtWork-runtime-composition-v2-2026-09-12.zip`、`CourtWork-chat-governed-data-research-2026-09-12.zip`、`Courtwork-Claude-Frontend-Harness-2026-09-16-v3.zip`。这些 ZIP 和成员已静态检查，未发现凭据或联系方式；排除原因是源材料范围与发布边界，不是发现了秘密。
- `vault/snapshot-manifest.json`、`vault/intake/local-projects.json`、`vault/intake/downloads.json`：包含用户目录原始定位、mtime/哈希和 Downloads 选择元数据；先排除，或删除绝对路径后单独审阅。
- `vault/intake/chat-captures.json`、`vault/intake/materials.json`、`vault/intake/reporting-materials.json`、`vault/intake/work-system-materials.json`、`vault/intake/work-system-increment-*.json`、`vault/chat-inventory.json`：没有检测到秘密，但含对话归档定位、消息 ID、消费映射和原始上下文元数据；若公开需先确认是否要暴露这些追溯标识。
- `vault/registry.json`：由来源 catalog、Chat 映射和材料索引生成；公开前应确认是否保留 raw-chat mapping，或从公共投影中移除该集合。
- `vault/distilled/reporting/downloads.md`：含一个真实 Downloads 绝对路径，并链接到本地快照；应脱敏或暂不发布。
- `vault/distilled/reporting/local-design.md`：没有联系方式或秘密，但直接指向 Courtwork/career-kit 本地快照；若快照排除，应改为不依赖本地源的公共摘要或暂不发布。
- 生成物 `scripts/__pycache__/**`、`docs/.DS_Store` 及其他 `.DS_Store`：不属于公共源资产，应排除。

## 限制与交接

这是静态范围检查，不是许可证审查、代码安全审计、运行时 secret-store 检查或逐条事实/客户归属裁决。源快照中的公开产品 README 不自动授予 Praxis 再发布权；ZIP/HTML 也没有做浏览器运行或视觉验收。主代理应按上面的清单选择提交范围，并在提交前复查新生成文件和绝对路径；本报告不代表已提交或推送。

