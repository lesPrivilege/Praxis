# GeoJS Geo endpoint

- 官方文档：[https://www.geojs.io/docs/v1/endpoints/geo/](https://www.geojs.io/docs/v1/endpoints/geo/)
- 核查日期：2026-09-30
- 状态：verified（已读官方文档；未调用实时端点）

官方文档列出无IP参数HTTPS端点 `https://get.geojs.io/v1/ip/geo.json` 和指定IP变体。响应字段包括 ip、country_code、country、continent_code、asn（integer；未知时文档注明64512）与 organization_name。无IP端点由GeoJS根据请求出口识别地址。

边界：文档声明字段，不构成精度或持续可用保证；无IP端点会让GeoJS收到发起端公网出口地址。
