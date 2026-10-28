# 最终合包交接

## 文本研究包

- 权威入口：`07-delivery/LEGALTECH_PRODUCT_MECHANISMS.md`
- 机器索引：`07-delivery/product_index.json`
- 来源：`05-evidence/source_ledger.json` 与 `source_ledger_full.csv`，各 153 条、URL 集合一致
- 视觉文字账本：`05-evidence/visual_observation_ledger.md` / `.json`
- 视觉文件映射：`05-evidence/visual_handoff_manifest.json`
- 独立复核：`06-review/independent_review.md`

覆盖：12 个完整深描、Harvey 1 个聚焦深描、Lawhive 1 个服务模式对照、3 个中国局部深描、24 个广索引候选；1,216 个 Exa 请求/审阅槽位，1,171 个实际返回/检查槽位。

本 executor 的 Library prepared-upload helper 在三种网络权限执行下均于写入前失败，错误为 `hosted apps tools/list request failed: network`。因此权威 MD 和文本 ZIP 没有 Library file ID；结果确定未写入。父任务需从本地路径上传，并以最终上传回执为准：

- `/workspace/legaltech-ai-saas-research-2026-10-28/07-delivery/LEGALTECH_PRODUCT_MECHANISMS.md`
- `/workspace/legaltech-ai-saas-research-text-2026-10-28.zip`

## 视觉 ZIP

- Library 文件：`libfile_a88ad92f6b5c81918600d90b21bc2ac0`
- 版本：1
- 上游报告 SHA-256：`6d343bf83a676f0ad03501085b7ecdbeb9a196f3153d29d5bf40491ef3d74284`
- 证据数：42
- 父任务挂载约定：原 33 项放 `05-evidence/visual/screenshots/`；新增 Harvey / Legora / Lawhive 9 项放 `05-evidence/visual/supplement/`；保留 ZIP 内 manifest、evidence JSON 和联系表。

本 executor 未材料化 version 1，因此没有复算 ZIP SHA 或做像素复核。图像内容结论来自独立云端视觉 worker 的已核验观察；父任务持有字节并负责最终图文抽查。不得把本限制改写成“本研究 reviewer 已完成页面视觉审计”。

## 合包后的最低验证

1. 检查 `visual_handoff_manifest.json.files` 的 42 个相对路径全部存在，ID 顺序与 `visual_observation_ledger.json` 一致。
2. 复算图像 ZIP 和最终完整 ZIP SHA-256；不要沿用文本包的 hash。
3. 抽查核心图：Spellbook 02–09、Ironclad 11–14、DISCO 17–20、Vincent 25–26、Clio 28、CoCounsel 32–33、Legora 37–38、Harvey 40–42、Lawhive 46–47。
4. 23/24 仅图标、31 局部帧、43 有地理分流遮挡，不放核心图册；可以作为明确标注的原始证据保留。
5. Harvey/Legora 补充图是官方营销产品图，不是运行实测；Lawhive intake 未输入或提交。

## 复查时间

- 全库：2027-01-28
- 动态定价、Lawhive 服务/条款：2026-11-28 前，或页面/条款变更时立即复查
