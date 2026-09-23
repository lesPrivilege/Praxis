# Q4–Q5 HTTP 正文快照

本目录保存 `curl -L --fail` 直接取得的 HTTP 响应正文，文件名以来源 ID 开头，统一使用 `.txt` 扩展名以避免把远端链接误当成本地可执行或可导航资源。TypeSafe 文档和 RRSI 是 Markdown 正文；Pydantic、RSI-Exam、Anthropic、SGCA、德国法条和 OFAC 是 HTML 正文。HTML 文件保留原始响应字节，阅读定位写在 `catalog.json` 的 `supported_claims[].locator` 中。

每个文件的 SHA-256 和字节数在上级 [catalog.json](../catalog.json) 登记；不要直接覆盖已有快照。远端字体、脚本、图片和动态接口没有复制，因此不声称完全离线自足。需要复查时按 `revisit_trigger` 新增版本目录或快照，不替换本批正文。
