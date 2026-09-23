# Jev 社区工作流正文快照

本目录保存 S13–S24 逐 URL 直接取得的 HTTP 正文。HTML 页面、GitHub raw Markdown 和 JSON 均以 `.txt` 扩展名保存，避免远端链接被误当作本地资源；`catalog.json` 登记每个 source 的单一 `snapshot_path`、SHA-256、字节数和正文定位。

S13/S14、S17/S18 的共同研究/项目关系只通过 `study_id` 表达，快照仍逐 URL 独立。S14/S15 是本次直接读取的 arXiv abstract HTML，不是 PDF 全文；S20/S23 等页面的历史登记范围也保留在 `review_scope` 与 `limits`。没有安装依赖、执行代码、调用 API 或运行 benchmark。需要更新时新增版本快照，不覆盖本批正文。
