# SourceWeft HTML Slides capability manifest

状态：verified-primary-web · supplemental-reference  
original URL：<https://github.com/SourceWeft/SourceWeft/blob/main/packages/builtin-skill-html-slides/sourceweft.capability.json?utm_source=chatgpt.com>  
canonical URL：<https://github.com/SourceWeft/SourceWeft/blob/main/packages/builtin-skill-html-slides/sourceweft.capability.json>  
pinned URL：<https://raw.githubusercontent.com/SourceWeft/SourceWeft/f88212b91216267f3dc1053f9424010cae9de5b6/packages/builtin-skill-html-slides/sourceweft.capability.json>  
source commit：f88212b91216267f3dc1053f9424010cae9de5b6

## 是什么

manifest 声明 schemaVersion、id、kind、name、version、entry，并把 skill 的 visibility/defaultEnabled/listing、runtime tools、artifact kind/type/publisher 结构化。

## 可消费语义

manifest 展示了 runtime 如何把能力身份、工具边界和产物发布接口分开登记。它可作为未来 consumer adapter 的参考。

## 边界

manifest 只是声明，不证明工具实现、权限安全、发布成功、版本兼容或适合作为 Praxis Kit schema。main 已将 machine-schema/实际宿主接入保留为候选。

证据：SW-HS-MANIFEST-01；访问：2026-09-28。
