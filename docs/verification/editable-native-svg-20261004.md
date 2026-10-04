# 可编辑原生 SVG · 登记与交接回执

日期 2026-10-04。基线 `d4fd38765af52f6bd2b9ae422cf016ac0ad1ae96`，云端 main 的只读 ref 查询与本地 HEAD 一致；初始工作区干净，分支 `codex/editable-native-svg-20261004`。本轮仅研究、架构与登记，未 push、merge 或调用外部 agent，现有文件保留。

## 交付与差异

- [项目入口](../../demos/editable-native-svg/README.md)、[覆盖](../../demos/editable-native-svg/coverage.md) / [机器登记](../../demos/editable-native-svg/catalog.json)：44 项需求，22 独立关系候选、14 组合、8 暂不抽取；编辑维度、压力边界、拒用条件、组合依赖和逐项依据已登记。
- [可编辑合同](../../demos/editable-native-svg/delivery-contract.md)：语义/DOM 身份、文字与几何、多实例引用、容器、长标签、等效文本、Motion、许可、安全与编辑器往返的候选要求。
- [发现与可视索引设计](../../demos/editable-native-svg/discovery.md)、[反例/验收](../../demos/editable-native-svg/acceptance.md)、[六组合成输入](../../demos/editable-native-svg/fixtures.json)：包含材料/事项/旧阅读依据的独立版本反例；Flash 的新内容消费规格未执行。
- [五批工单](../../demos/editable-native-svg/work-orders.md) / [fresh Opus 最小交接](../../demos/editable-native-svg/wake-opus.md)：按现有手动唤醒体例保存，全部未开工，视觉裁决留 Opus。
- [研究](../../vault/distilled/editable-native-svg-20261004/README.md)、[intake](../../vault/intake/editable-native-svg-20261004.json)、[来源卡](../../vault/provenance/editable-native-svg-20261004/README.md)：18 个 URL 的身份/摘要/访问范围，15 个相关文字读取、1 个仅目录、2 个访问失败；五张实际查看的既有截图有 hash。

Kit 只给 Design README 增加一条需求触发的发现链接，没有加入候选实现或新规范；demos/Vault/intake/研究/来源/验收入口同步挂接。来源卡与 registry 按既有脚本生成；未修改旧来源/快照/项目实现，未建立 SVG taxonomy、共享 runtime 或新 ADR。知识条目、优先参考与共享运行组件各沿既有不同准入。

## 检查命令与边界

在仓库根执行 `python3 scripts/render_source_cards.py`、`python3 scripts/build_registry.py`、`python3 scripts/validate_repository.py`，项目登记另执行 `python3 demos/editable-native-svg/check-registration.py`；检查结果与 diff 核对将在本回执末尾填写。

仓库检查覆盖受治理 README、Markdown 相对链接、JSON、来源卡投影、registry 一致性与既有登记快照 hash，不访问所有外链，也不验证 SVG 行为。项目检查只核对 ID、计数、组合指向、工单、fixture 预期字段、交付路径与五张已有图的 hash；它不执行 fixture 的业务模型、不验证未来资产或消费效果。

基线已存在的历史验收不能继承为本次验证。未运行项：新 SVG 绘制/预览、几何、浏览器/编辑器、键盘/读屏、打印、Motion/播放/seek、Flash、受众效果和真实客户业务。`bounds` 为待测试输入，当前没有宣称容量通过。外部摘要可本地阅读，正文和 renderer 依赖未快照。

## 来源与调用缺口

付款复核台仅由用户转述作者报告：未提交、43 项通过、16 处修复、8 处留存及旧阅读说明错归风险均未独立核验。没有取得完整原件、项目路径或远端相应实现；没有启动该项目代码修复。F01 是本包新造的合成版本绑定输入。

命令行 `Python urllib.request.urlopen` 对 `https://www.w3.org/TR/SVG2/text.html` 的只读 GET 返回 `URLError: Tunnel connection failed: 403 Forbidden`；浏览展开正文也失败。已停止，未重试、提升权限或绕过。此为代理拒绝，不是自动审批审核拒绝；S02 只取得章节入口/目录，不能支持具体文本布局兼容结论。S17/S18 浏览失败也保留，无伪造来源正文。

仓库支持手动向 fresh Opus 会话粘贴；未发现已验收自动调用封装，当前 PATH 无 `claude`。官方新会话 `claude --model opus` 仅在已有可信工具、已授权用户账号/提供方和可用模型的环境成立。本轮未调用、安装、索取或读取凭据、登录、查询额度，未使用赠金 credits 或可疑领取链接。最小输入是实际 checkout/SHA、规定入口、本项目合同与单批工单、该批研究 ID/fixture；后批另加前批真实回执。

## 实际检查结果

- `render_source_cards.py`：检查 339 个投影文件，只新写本批 20 个文件（18 卡与两页索引），未改写旧卡。
- `build_registry.py`：来源记录 574 → 592，新增本批 18 条；Chat 消费 127、引用映射 229 保持原口径。
- `validate_repository.py`：pass，0 errors；1004 份 Markdown、186 份 JSON、850 个既有快照 hash，来源记录 592、引用映射 229、卡片投影文件 339。
- `check-registration.py`：pass，44 项需求、142 条候选组合指向、六组 fixture、18 个外部 ID、五张既有图 hash 一致；不代表组合兼容已验收。
- `git diff --check`：通过。已核对改动只含新项目、研究/登记/验收、八处入口增量和既有生成 registry；没有删除旧文件、修改来源项目或提交到远端。

最小交接从项目 README 的“接手下一批绘制”进入；可直接粘贴 prompt 在 wake-opus.md。完整 diff 与自足交付 Markdown 存在仓库外工作区，供父会话读取；Library 保存结果以工具实际回执为准，不写成研究/绘制通过。

补充盘点：Git 跟踪独立 SVG 16 个，全部在 Vault 快照；三份读取 XML 源码，其余只枚举，全部未作图形/编辑验收。A3 原生 SVG 源码含固定 defs ID，已登记为多实例压力线索，未运行碰撞测试。此补充未改变需求数量或组件准入结论。
