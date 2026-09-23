---
id: "jc-s19-pg-jev-readme"
status: "verified"
url: "https://github.com/realZachi/pg-jev/blob/master/README.md"
---

# pg-jev README

来源：[原始页面](https://github.com/realZachi/pg-jev/blob/master/README.md) · 状态：`verified`

用途：Q2 / Q4 / POSTGRES / BATCH / CACHE / THROUGHPUT / DATA_BOUNDARY

## 摘要

pg-jev 把 Jev 判断封装为 PostgreSQL functions，支持批量、并发、read-ahead、session cache、score/choice/confidence 和 raw eval。README 报告 2,000-row 测试首跑约 100 requests、二跑命中缓存约 50ms；结构化 ground truth 上 batch 1–20 为 100%，40 为 92–98%，80 为 77–94%，位置关联准确率在大 batch 下降。

## 证据与使用边界

作者有限结构化字段自测，不是独立数据库基准；需要 plpython3u、superuser 和 API key，row 内容会发第三方 API；每 session cache 不等于跨连接共享；README 的成本、延迟和准确率不是本次实测。

## 何时重访

extension、Jev API、batch/cache 实现、托管 Postgres 权限或数据外发策略变化时复查，并用目标数据库和切片重测。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
