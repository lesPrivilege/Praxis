# Fresh Opus 最小交接与启动边界

## 仓库已有支持

已有 [视觉工场唤醒说明](../visual-grammar/wake-opus.md)支持把 prompt 手动粘贴到以 Praxis 为工作目录的独立 Opus 会话；其中旧 Mac 绝对路径仅是历史示例，当前实际 checkout 为 `/workspace/Praxis`。仓库没有发现专用、安全且已经验收的 fresh Opus 自动调用封装。项目 `.agents/skills` 不存在，工作区 `.agents` 也没有技能目录；仅找到并读取相关 `.claude/skills/writing/SKILL.md`。

本环境 `command -v claude` 未找到可执行文件。未调用 Claude CLI、未安装、未读取账号配置、环境凭据或 credential 文件，也没有做登录或额度查询。旧账号迁移研究是参考，不是调用授权。

另查官方 [模型配置](https://code.claude.com/docs/en/model-config)与 [CLI 参考](https://code.claude.com/docs/en/cli-reference)：在**已有可信 Claude Code、用户自行管理的已授权账号/提供方和可用 Opus**的环境，可在实际 checkout 目录新开 `claude --model opus` 交互会话，再粘贴下列 prompt；不使用 continue/resume，不关闭权限检查。实际解析到的模型以目标会话回执为准。这里只报告官方支持的启动方法，未核验此环境能执行。网页/桌面独立新会话也可粘贴，但需要实际具备仓库读取与编辑能力；附件不能替代可写 checkout。

## 所需最小输入

实际 checkout 与基线 SHA；根 AGENTS 和规定维护入口；本页 prompt；本项目 README、当前单批工单、coverage、catalog、delivery-contract；该批指定的研究 L/S ID 与 fixtures。来源不足时才沿 Vault 展开。SVG-02 起另加前批真实作品与回执；SVG-05 不给制作 fixture 或答案提示给消费方。无需凭据、历史会话全文、邮件领取链接或所谓赠金 credits。

## 可直接粘贴的 SVG-01 prompt

```text
请在当前 Praxis checkout 的新会话接手 editable native SVG 的 SVG-01 绘制。
先记录实际 HEAD、分支和工作区状态，核对交接基线 d4fd38765af52f6bd2b9ae422cf016ac0ad1ae96；若已变化，比较与本批相关入口，不假装仍在旧版。
读 AGENTS.md 及规定维护入口，再读 demos/editable-native-svg/README.md、work-orders.md 中 SVG-01、coverage.md 和 delivery-contract.md；catalog.json 是需求登记，尚没有已绘制资产。按研究页的 L01–L05 / S01–S04 与 fixtures.json 的 F01/F02/F06 只展开当前需要的依据。
请自行裁决原子边界、选件数量、造型、构图、字体、配色与实现方式。目标是可改文字、身份、端点、范围与布局的原生 SVG；保持文字与几何分离、语义身份、多实例引用隔离和等效文本。不要把整页轮廓转成 path，也不要把通用几何图标数量当覆盖证明。可以合并或拒用候选，说明覆盖去向和理由。
在 demos/editable-native-svg 的普通作品子目录保存完整 brief、输入与预期、源码、真实 SVG、可打开预览、压力与失败对照、来源/许可和验收回执。不要覆盖旧文件，不建立空 runtime 或嵌套 Git。先检查环境，不自动安装依赖、下载模型、发布、push 或 merge，不联系外部 agent，不读取或索取凭据，不使用赠金 credits 或邮件领取链接。
付款复核台的“未提交、43 项通过、16 处修复、8 处留存”仅是作者自报，未核验，不给该项目修代码。可以用本包合成输入检验材料版本、事项版本与旧阅读依据各自绑定。
按 acceptance.md 执行本批适用检查，记录实际模型/版本、已运行、未运行、看过哪些图与剩余失败；运行 python3 scripts/validate_repository.py。本批不做 Flash 验收，不预设受众效果。完成后给作品入口、可编辑边界、diff 和下一批所需的真实交接。
```

后续每批以同一边界新开会话，替换批次与必要输入即可；SVG-05 的消费方任务只按 acceptance 的自然任务书提供，不能直接复制含选件答案的绘制 prompt。
