# IANA Autonomous System Numbers

- 来源：[https://www.iana.org/assignments/as-numbers/as-numbers.xhtml](https://www.iana.org/assignments/as-numbers/as-numbers.xhtml)
- 核查日期：2026-09-30；页面更新时间：2026-06-01
- 状态：verified（官方注册表）

IANA registry assigns 23456 as AS_TRANS; 64496–64511 and 65536–65551 are documentation ranges; 64512–65534 and 4200000000–4294967294 are private-use; 0, 65535, and 4294967295 are reserved. This constrains interpreting GeoJS asn=64512 unknown marker.

边界：Registry state is time-sensitive; classify explicit documented special ranges only and do not hard-code all unallocated values as private/reserved. Page updated 2026-06-01 per current registry.

## 2026-10-05 复核增量

- 复核入口：原登记 URL [https://www.iana.org/assignments/as-numbers/as-numbers.xhtml](https://www.iana.org/assignments/as-numbers/as-numbers.xhtml) 已重定向到 canonical URL [https://www.iana.org/assignments/as-numbers](https://www.iana.org/assignments/as-numbers)；页面仍标注 `Last Updated 2026-06-01`。
- 32-bit AS Numbers 表明确列出 `65536–65551` 为 documentation/sample code、`65552–131071` 为 `Reserved`，其后 `131072–132095` 开始进入已分配行。该复核补足原摘要未写出的 `65552–131071` 保留区间；原有 `2026-09-30` 核查日期与摘要保留不变。
- 本次消费：为 Drift P2-3 的解析边界提供一手登记依据；实现应把 `65552–131071` 作为未知/空 ASN 处理，并以 `65551`、`65552`、`131071`、`131072` 做边界测试。该规则用于值语义，不代表 ASN 可信度或风险评分。
- 范围与限制：本次只重访官方注册表，未调用 GeoJS/ipify 或其他实时端点，未读取或推断任何真实观测值；未新增网页快照，页面当前状态以本条复核记录为准。
