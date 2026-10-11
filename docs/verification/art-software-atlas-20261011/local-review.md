# 本地累计审阅

## 对象与执行范围

所审交付头：`b019ba3667485357aa484c54c29b7cd6c841ab53`；fetch 后本地 main 与 origin/main 均为 `02ca9ea4b0faa6a9376523883c1f9f7afd5cf154`，且为交付头祖先。累计差异为 253 文件，包含 design-writing-encyclopedia，不限于 atlas 补正提交。

实际执行者为本地 Codex 主代理；当前工具没有 Luna/Astra 子代理调用能力，未声称执行指定模型或新增 fresh-session 实验。原 checkout 有未提交内容，审阅、修订与验证在隔离 worktree 完成。用户工作另以原提交上的保留分支承载；合并只发生在隔离 checkout 的本地 main。未启用 CI、推送、部署或安装依赖。

## 内容裁决

- 来源、实体、grammar 分层和单点登记成立；检查 canonical 投影、103 条主张的身份关系、双向来源路径、关系方向、alias 与推导依据。原始 URL 和具体阅读位置保留；没有快照的来源仍明确缺原件缓存。595 条基线来源记录与 850 条基线 snapshot manifest 记录逐条保持相同。
- 13 组分面查询重跑通过，包括行业、媒介、谱系、技术栈、语言和状态；同 scope 条件必须由同一实体满足。跨 scope 返回各自见证，shared-evidence 没有被改写为 implements 或文化等价。四种非法查询输入被拒绝。
- 软件范围矩阵为 Web、原生移动/桌面、开发者工具、数据分析、游戏、空间、实体设备及跨平台问题提供入口，明确局部正文、邻近方法与研究缺口。缺口未冒充来源或已完成研究。
- 维护走读：AGENTS → Kit → Design → 艺术操作入口 → 材料关系 → ASA-M-03 → 馆方 URL/对象定位；AGENTS → Kit → Write → Prose → 微文案 → DWW-004/005 → 官方错误模式。任务可先取得判断，再按需要回溯原文，不必预读治理或全部历史。这是本轮维护走读，无独立新 session、无对照效果归因；此前 fresh-agent 记录保留其原有证据范围。
- 按 construction-comparison 的裁决保留既有层次、身份和目录；未引入另一套 style/snapshot/review 树、固定配额或原附件。入口没有吸收历史全文。
- 抽读两轮的材料、编辑、空间、时序、交互、写作、媒介选择和 agent 生态条目。历史文本不能支持原作目验；协议和包契约不能支持集成已运行。正文中会改变取用决定的限制继续保留。

## 发现与修订

1. 旧百科 `reference_index.validate` 拒绝 unknown 配非空值，却放过 known 配空值。改为双向检查状态和值是否一致。内存变异前 known/空值未被拒绝；修正后 known/空值与 unknown/非空值均报错。
2. 图谱只读检查发现非法状态后仍用它索引状态表，导致 KeyError，不能给出结构化错误回执。现在跳过非法状态的倒排投影，保留 schema 和投影错误；负例正常以非零状态退出并输出 errors。
3. agent 生态 9 张卡重复打印用途标签、英文通用免责声明及整套权利/未验项。删去重复段落，共通边界归于 ecosystem README，标签与权利登记沿用 catalog。每张卡的具体摘要、主张、定位、front matter 权利与决定性限制仍在，无证据升级。

## 验证

- `python3 scripts/validate_repository.py`：通过，本地链接、JSON、README、快照 hash、生成卡等按既有脚本检查。
- `python3 scripts/reference_index.py --check`：通过，29 来源、13 grammar。
- 从 atlas-validation 提取并执行生成代码及只读检查：通过，56 新来源、2 复用来源、46 实体、12 grammar、141 关系。生成 index 和执行 `scripts/build_registry.py` 后无投影差异。
- 从 facets 提取查询函数，对 facet-query-results 的 13 组 filters/expected 重新求值，全部一致；非法 scope、dimension、state 与空值列表均抛 ValueError。旧百科 `artifact=interactive-control AND stack_runtime=React` 命中 DWI-007。
- 实际检查器的内存/临时代码变异：错误 source kind、非法 facet state、反向 documents、source-as-implements 均被拒绝；旧百科删除 DWW-002 → multilingual 声明、注入 microcopy 正文日期均被拒绝。没有改写磁盘 canonical 数据。
- `git diff --check` 及 main 到待合并提交的累计检查通过。累计交付没有 `.github` 变动；原 checkout 未跟踪的 CI 文件属于用户工作，原样保留。

查询与外部读取回执见 [本地结果](local-review-results.json)。修订后的完整仓库检查仍是结构验证，不是原作观看、用户效果、设备可达性或外部集成验收。

## 外部抽查与剩余边界

本轮读取 MCP URL 固定版本的正文，核对 tools/list、tools/call、structuredContent、人可拒绝调用、服务端输入校验/访问控制与客户端敏感操作确认；与 ASA-A-08 所列有限主张相符。没有连接 MCP server。

Brooklyn 对象页返回 HTTP 429，Ant Design 中文页返回 HTTP 403；本轮只能沿本地卡和登记核对追溯关系，没有重新验证两页原文。大部分历史艺术没有本轮目验，未试听音频、检查现场、重跑浏览器探针或验证生产集成。旧记录中的截图和运行观察仍归于原执行者；未逐条重读所有外部 URL。

上述未覆盖项没有被升级为既成事实。修订并复核后，累计交付在所列范围内无剩余阻断项，可按用户授权合并本地 main。实际修订头与合并 SHA 由 Git 提交及最终回报定位，避免文档自引用。
