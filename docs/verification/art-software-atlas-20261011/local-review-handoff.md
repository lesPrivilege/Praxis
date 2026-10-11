# 本地独立审阅与合并交接

云端只推送 `cloud/art-software-grammar-atlas-20261011`，不合并 main。用户授权本地 Astra 在独立审阅通过后处理合并；本文件是审阅范围与证据清单，不在云端执行本地操作。

## 定位和保护工作区

在用户本机定位真实 Praxis checkout，先读当地 AGENTS 与适用指引。检查 remote 是否为 `lesPrivilege/Praxis`、当前分支与工作区状态；保留所有未提交内容。工作区不干净时采用隔离 worktree 或另一个明确 checkout，不 reset、clean、覆盖或自动 stash 用户工作。

获取 `origin/main` 与上述唯一交付分支，用最终交付消息给出的完整 SHA 核对分支头。若分支头已变，先说明差异再确定审阅对象。提交不包含自身最终 SHA，避免自引用；远端 ref 和最终交付消息共同定位这次交接。

## 累计审阅范围

本批直接基线为 `575fae1b2dbcffdf5c0fdc91713a6cddcd154d5e`。首次检查的 main 是 `02ca9ea4b0faa6a9376523883c1f9f7afd5cf154`，当时尚未包含前述百科交付。首次 atlas 提交为 `f30b158946b284838afd9c0253ba3d01142b027d`，随后补正分类与正文。

**合并评审必须比较当前 main 与最终交付头的累计差异，包括先前的 design-writing-encyclopedia。** 只看 f30b158 后的 facet 修复，或只看 575fae1 后的 atlas，都不足以评估相对 main 的合并内容。重新检查 main 的变化与祖先关系，处理真实冲突后再验收。

## 内容与验证

1. 从 [交接](handoff.md)、[补正覆盖](facet-correction.md) 和 [草案裁决](construction-comparison.md)掌握范围；旧的 [百科交付](../design-writing-encyclopedia-20261011/README.md)也在累计审阅内。
2. 检查来源、实体、grammar 的分类所有权；抽查 inferred 的理由、unknown / not-applicable / unreviewed 区别，以及原物与软件候选的分离。
3. 按 [分面查询](../../../vault/provenance/art-software-atlas/facets.md)重跑真实查询与反例；确认同一实体满足同 scope 条件，共享证据不会自动变成实现或文化等价关系。
4. 按 [生成与只读校验](atlas-validation.md)提取代码到临时文件；从仓库根运行。生成前后应无非预期差异，尤其不能生成第二份 canonical metadata。
5. 运行现有 `python3 scripts/validate_repository.py` 与 `python3 scripts/reference_index.py --check`，检查 `git diff --check`。按实际改动补充必要验证，不安装未知依赖或启用 CI。
6. 复核 [证据范围](verification.md)、逐源读取/观看/运行差别、链接访问失败、权利与依赖缺口。公开交付中不应出现原附件、私有会话、账号数据或下载凭证。
7. 按 [正文审校](concise-body-audit.md)冷读入口与深条目：保留概念、决定性区别、用途、例子和下一跳；注册清单、反复保护措辞和研究旁白应在索引/日志，不能通过删限定来求简。

## 合并门槛

独立审阅无阻断项、实际冲突处理完成、相关验证通过且用户工作保留后，才在本地按仓库约定合并。尚有历史归属、权限、schema 或证据强度错误时先修复并复核；记录最终审阅结论、所审 SHA 和实际合并结果。不要把已推送分支写成已合并，也不要自动开启 CI 或扩大部署范围。
