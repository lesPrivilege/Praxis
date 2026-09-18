---
id: "postgres-jsonb"
status: "verified"
url: "https://www.postgresql.org/docs/current/datatype-json.html"
---

# PostgreSQL JSON types

来源：[原始页面](https://www.postgresql.org/docs/current/datatype-json.html) · 状态：`verified`

用途：GRAMMAR / BUILD

## 摘要

PostgreSQL 官方文档区分 json 与 jsonb，并说明 jsonb 的处理、索引和操作能力。

## 证据与使用边界

不能单凭该页证明所有演进字段都应放 JSONB，或无需专用向量数据库。

## 何时重访

数据量、查询模式或向量检索需求出现时复查。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
