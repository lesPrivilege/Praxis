# 验证与边界

## 2026-10-11 · 本批检查

验证对象是目录结构、源身份、推导关系和有界可消费性；没有为艺术史、文化适切性、软件生产能力或用户效果颁发整体认证。

- [模式与关系检查](schema-results.json)：JSON Schema、唯一 ID、主张定位、URL 去重、实体外键/边方向、源卡↔语法、目录 README 与本地链接。
- [负例检查](negative-checks.json)拒绝错误节点类型、错误分面状态、反向 documents 与 source-as-implements；[锚点检查](anchor-checks.json)核对新/改页面中的 16 个本地片段目标。
- [仓库验证](repository-results.json)：运行既有 `python3 scripts/validate_repository.py`；共享 registry 用既有 `build_registry.py` 重建。
- [外部链接检查](link-check.json)：58 个新/复用来源 URL 用普通 HTTP HEAD 检查，9 个返回 200、1 个 HTTP 403、48 个环境连接错误。HEAD 与正文读取是不同证据；失败不证明 URL 已不存在，成功不证明作品、脚本或全部依赖可运行。未绕过限制。
- [独立初审](independent-review.md)、[修复后复审](final-review.md)及 [修复裁决](CHANGELOG.md)：四个官方来源成功抽查，三处受阻，未宣称逐条重读。
- [三个独立发现试用](consumption.md)：任务到条目到决策的可见轨迹；无对照、无用户实验、无效果归因。
- [D3 原创探针](brush-probe.md)：实际执行选择/清除/空集/数值输入与反向范围，根代理查看输出；上游 Observable demo 未运行。
- [编辑合成输出](editorial-probe.md)：只看一张桌面截图，不是字体/排印标准或可达性验收。

## 来源实际检查程度

机器清单在 [索引](../../../vault/provenance/art-software-atlas/index.json)：56 个新来源记录（49 verified、6 partial、1 unavailable，状态只针对所列主张），另复用 D01 与 DWI-003。52 条有 text_read，3 条有 code_read，2 条有 static_image_viewed，7 条兼记 access_failure；形态可重叠，不相加作总数。两条实际源图是 W3C JLReq 的小型标点图；没有声称看过织物原作、Isotype 历史图版、建筑现场、Brown 原谱或 Molnar 原作。没有试听音频。

普通来源卡与原文关联构成离线初筛，但没有整体保存外部 HTML、字体、音频、代码或图像依赖。两个合成 PNG 为原创小样，不是复制艺术作品；第三方图像仅临时检查，不随仓库分发。所有权利字段独立于证据与采纳，文档/仓库许可不自动覆盖字体、图片、品牌与文化语境。

## 可复现的结构检查

在仓库根目录运行：

```sh
python3 scripts/build_registry.py
python3 scripts/reference_index.py --check
python3 scripts/validate_repository.py
```

旧 reference_index 的默认范围保持旧百科集合，不能用它冒称新图的完整验证。新投影的可移植校验说明及原始检查代码保存在 [atlas-validation.md](atlas-validation.md)，依赖已安装的 Python `jsonschema`；不安装或启用 CI。新 index 为本批静态快照，更新 catalog/实体/语法后应同步并重新验证，不声称现有脚本自动覆盖它。

结构检查未代替：文化/母语/制作者复核、商业版权判定、浏览器兼容、辅助技术、触屏、听觉与空间感知、MCP/CLI 权限实现、性能或真实交付体验。失败与缺口进入 [研究流](../../../vault/provenance/art-software-atlas/streams.md)，不以成功链接或较多条目消除。
