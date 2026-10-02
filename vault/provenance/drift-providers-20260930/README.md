# Drift Provider 来源核查 · 2026-09-30

本批支持 Praxis Drift 的只读公网观测实现。固定提交源码见 [选定上游原件](upstream/README.md)，逐 URL 来源卡与编目见 [catalog.json](catalog.json)，处理范围、快照SHA-256与未核实项见 [登记](../../intake/drift-providers-20260930.json)。

核心消费：GeoJS 官方无参数端点 `https://get.geojs.io/v1/ip/geo.json` 返回它自行观察到的出口IP及国家、ASN字段；ipify `https://api64.ipify.org?format=json` 单独返回出口IP，便于独立观察。证据卡：[GeoJS接口](geojs-geography-endpoint.md)、[ipify接口](ipify-public-ip-api.md)、[IANA AS号登记](iana-as-numbers-registry.md)。固定源码[聚合行为](howismyip-packages-core-src-aggregate-ts.md)显示provider应保留独立记录、错误状态与字段分歧，[timeout与请求辅助器](howismyip-packages-core-src-providers-helpers-ts.md)及[IP规范化](howismyip-packages-core-src-ip-ts.md)供实现对照；[MIT许可证原件](howismyip-license.md)随源码保存。缓存只适用于其Cloudflare hosted部署语境。GeoJS的ASN `64512` 是该文档称未知时的标记，同时落在IANA private-use范围，不可作为公共ASN归属。

不消费：ip-api 的免费endpoint使用 HTTP；上游 hosted quota 的 fail-open 机制不作为本地保护契约；不合成跨来源信誉分数，不落盘真实公网IP或真实回包。外部请求自然会让服务端看到发起机器的出口地址，代码不额外传配置或凭据。
