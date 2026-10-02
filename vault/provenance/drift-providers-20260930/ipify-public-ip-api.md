# ipify public IP API

- 官方文档：[https://www.ipify.org/](https://www.ipify.org/)
- 核查日期：2026-09-30
- 状态：verified（已读官方文档；未调用实时端点）

官方主页示例 `https://api64.ipify.org?format=json` 返回仅含ip的JSON，并说明api64支持IPv4/IPv6。

边界：只返回外部IP，不提供ASN/country；ipify会收到发起端公网出口地址。页面中的“不记录访客信息”是服务方声明，未独立验证。
